#!/usr/bin/env node
// Video-Messung zum Einfärben (I14, 21.11.2026): Ruckelt ein Hintergrundvideo
// in card-cta, wenn es eingefärbt ist (Filterkette + multiply)?
//
// Drei Video-Karten wie im Drupal-Template, je Durchgang ohne Ton und mit
// Grid „gruen“, die mittlere Karte im Hover (Vergrößerung). Gezählt werden die
// gezeigten Frames (requestVideoFrameCallback) und die ausgelassenen
// (getVideoPlaybackQuality), bei gedrosselter CPU (CDP Emulation).
//
//   node scripts/pruefen/medien-ton-video.mjs <video> [--sekunden 10] [--drossel 4] [--kanal chrome]
//
// Grenze: mit Ton höchstens 5 % weniger gezeigte Frames als ohne.
import { readFileSync, existsSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { chromium } from './lib/browser.mjs'

const args = process.argv.slice(2)
const wert = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d }
const video = args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')))
if (!video || !existsSync(video)) { console.error('Video fehlt: node scripts/pruefen/medien-ton-video.mjs <video>'); process.exit(2) }
const sekunden = Number(wert('--sekunden', 10))
const drossel = Number(wert('--drossel', 4))
const kanal = wert('--kanal', undefined)
const css = readFileSync(path.resolve(import.meta.dirname, '../../styles.css'), 'utf8')

const seiteHtml = (ton) => `<!doctype html><html><head><style>${css}</style><style>
  body{margin:0;padding:24px;background:#fff}
  .nc-card-grid-cta{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;width:1232px}
</style></head><body><div class="nc-card-grid-cta"${ton ? ` data-medien-ton="${ton}"` : ''}>
${[1, 2, 3].map((n) => `<div class="nc-card-cta" id="k${n}"><video class="nc-card-cta__media" src="/video" loop muted playsinline autoplay></video>
<div class="nc-card-cta__overlay"></div><div class="nc-card-cta__content"><h3 class="nc-card-cta__title">Karte ${n}</h3></div></div>`).join('\n')}
</div></body></html>`

// Kleiner Server, damit das Video mit Range-Anfragen ausgeliefert wird
const daten = readFileSync(video)
const server = createServer((req, res) => {
  if (req.url.startsWith('/video')) {
    const range = /bytes=(\d+)-(\d*)/.exec(req.headers.range || '')
    const start = range ? Number(range[1]) : 0
    const ende = range && range[2] ? Number(range[2]) : daten.length - 1
    res.writeHead(range ? 206 : 200, {
      'Content-Type': video.endsWith('.webm') ? 'video/webm' : 'video/mp4',
      'Accept-Ranges': 'bytes', 'Content-Length': ende - start + 1,
      ...(range ? { 'Content-Range': `bytes ${start}-${ende}/${daten.length}` } : {}),
    })
    return res.end(daten.subarray(start, ende + 1))
  }
  const ton = new URL(req.url, 'http://x').searchParams.get('ton')
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(seiteHtml(ton))
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const basis = `http://127.0.0.1:${server.address().port}`

const browser = await chromium().launch(kanal ? { channel: kanal } : {})
async function durchgang (ton) {
  const kontext = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const seite = await kontext.newPage()
  const cdp = await kontext.newCDPSession(seite)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: drossel })
  await seite.goto(`${basis}/?ton=${ton || ''}`)
  const laeuft = await seite.evaluate(async () => {
    const v = [...document.querySelectorAll('video')]
    await Promise.all(v.map((x) => x.play().catch(() => {})))
    await new Promise((r) => setTimeout(r, 1500))
    return v.map((x) => ({ zeit: x.currentTime, fehler: x.error?.code ?? null, bereit: x.readyState }))
  })
  await seite.hover('#k2')
  const filter = await seite.evaluate(() => getComputedStyle(document.querySelector('video')).filter)
  const r = await seite.evaluate(async (ms) => {
    const v = [...document.querySelectorAll('video')]
    const vorher = v.map((x) => x.getVideoPlaybackQuality())
    const gezeigt = v.map(() => 0)
    v.forEach((x, i) => { const z = () => { gezeigt[i]++; x.requestVideoFrameCallback(z) }; x.requestVideoFrameCallback(z) })
    await new Promise((res) => setTimeout(res, ms))
    const nachher = v.map((x) => x.getVideoPlaybackQuality())
    return v.map((x, i) => ({
      gezeigt: gezeigt[i],
      ausgelassen: nachher[i].droppedVideoFrames - vorher[i].droppedVideoFrames,
      gesamt: nachher[i].totalVideoFrames - vorher[i].totalVideoFrames,
    }))
  }, sekunden * 1000)
  await kontext.close()
  return { ton: ton || 'ohne', laeuft, filter, karten: r, gezeigt: r.reduce((s, k) => s + k.gezeigt, 0), ausgelassen: r.reduce((s, k) => s + k.ausgelassen, 0) }
}

const ohne = await durchgang(null)
const mit = await durchgang('gruen')
await browser.close(); server.close()

for (const d of [ohne, mit]) {
  console.log(`${d.ton.padEnd(6)} gezeigt ${String(d.gezeigt).padStart(4)}  ausgelassen ${String(d.ausgelassen).padStart(4)}  je Karte ${d.karten.map((k) => k.gezeigt).join(' / ')}  filter ${d.filter.slice(0, 40)}`)
  if (d.laeuft.some((l) => l.fehler || l.zeit === 0)) console.log('  WARNUNG: Video spielt nicht', JSON.stringify(d.laeuft))
}
const verlust = ohne.gezeigt ? (1 - mit.gezeigt / ohne.gezeigt) * 100 : NaN
console.log(`Frame-Verlust mit Ton: ${verlust.toFixed(1)} % (Grenze 5 %), Drosselung ${drossel}×, ${sekunden} s`)
process.exit(Number.isFinite(verlust) && verlust <= 5 ? 0 : 1)
