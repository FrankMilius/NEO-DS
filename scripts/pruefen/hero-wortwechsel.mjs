#!/usr/bin/env node
// ==========================================================================
// pruefen:hero-ww — hält der Hero „Wortwechsel“ die Layoutregeln ein?
// (I19 Phase 1, 24.11.2026; Abnahme in STAND.md)
//
//   npm run pruefen:hero-ww -- [--css <styles.css>] [--ausgeliefert]
//        [--ohne-ersatz] [--js <neo-behaviors.js>] [--vergleich]
//        [--groessen 1280x560,1440x900,…]
//
// Lädt die DDEV-Startseite. Standard: styles.css aus diesem Arbeitsbaum
// (--ausgeliefert: die von DDEV), und der heutige Hero wird durch das
// Beispiel aus docs/content/hero.html (Marke hero-wortwechsel:beispiel)
// ersetzt — Bilder aus dem Prototyp-Ordner. --ohne-ersatz misst den Hero,
// den Drupal ausliefert (ab Phase 6). --vergleich misst dieselbe Größe im
// Prototyp und zeigt die Abweichung (nur zur Information).
//
// Regeln je Größe:
//   - kein Claim ragt in die Screens (Wortzelle rechts ≤ Bühne links,
//     gestapelt: Unterkante ≤ Bühne oben)
//   - nebeneinander (≥ 960 px): Rahmen oben = unten ±2 px
//       oben  = Oberkante der Komposition − Unterkante Kopfzeile
//       unten = Unterkante Hero − Unterkante Laufleiste
//   - Nähe 1:2: Laufleiste→Unterkante ≥ 2 × Screens→Laufleiste
//   - Claim höchstens 88 px
//   - Text bündig unter dem Logo ±1 px
//   - ab 1920 px Breite: Bühne gleich groß (±1 px)
//   - keine Skriptfehler
// Ausgang 0 alles eingehalten, 1 Abweichung, 2 Aufruf- oder Seitenfehler.
// ==========================================================================
import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import { lade } from './lib/einstellungen.mjs'
import { chromium } from './lib/browser.mjs'

const { values: a } = parseArgs({
  options: {
    css: { type: 'string', default: 'styles.css' },
    ausgeliefert: { type: 'boolean', default: false },
    'ohne-ersatz': { type: 'boolean', default: false },
    js: { type: 'string' },
    vergleich: { type: 'boolean', default: false },
    groessen: { type: 'string', default: '1280x560,1336x728,1440x900,1643x992,1920x1080,2734x1400,1024x768,390x844' },
  },
})

const einst = lade()
const groessen = a.groessen.split(',').map((g) => g.trim().split('x').map(Number)).filter(([w, h]) => w && h)
const css = a.ausgeliefert ? null : readFileSync(a.css, 'utf8')
const js = a.js ? readFileSync(a.js, 'utf8') : null
const PROTOTYP = '/sites/default/files/hero-prototyp/index.html'

// Beispiel aus der Musterseite: eine Quelle für Doku und Messung
function beispiel () {
  const html = readFileSync('docs/content/hero.html', 'utf8')
  const m = html.match(/<!-- hero-wortwechsel:beispiel -->([\s\S]*?)<!-- \/hero-wortwechsel:beispiel -->/)
  if (!m) throw new Error('Marke hero-wortwechsel:beispiel fehlt in docs/content/hero.html')
  return m[1].replaceAll('../assets/images/hero-wortwechsel/', '/sites/default/files/hero-prototyp/img/')
}

// Ersetzt den ersten <section class="nc-hero …">…</section> (ohne verschachtelte section)
function ersetzeHero (html, neu) {
  const start = html.search(/<section class="nc-hero[ "]/)
  if (start < 0) throw new Error('kein nc-hero auf der Startseite')
  const ende = html.indexOf('</section>', start)
  return html.slice(0, start) + neu + html.slice(ende + '</section>'.length)
}

// Im Browser messen (echter Hero oder Prototyp)
function messen () {
  const r = (e) => e && e.getBoundingClientRect()
  const kopf = r(document.getElementById('siteHeader'))
  const logo = r(document.querySelector('#siteHeader .brand, #siteHeader a'))
  const ww = document.querySelector('.nc-hero--wortwechsel')
  const q = ww
    ? { hero: ww, text: '.nc-hero__content', woerter: '.nc-hero__ww-words', titel: '.nc-hero__title', buehne: '.nc-hero__ww-stage', leiste: '.nc-hero__ww-bar', kicker: '.nc-hero__kicker' }
    : { hero: document.getElementById('hero'), text: '.h-text', woerter: '#words', titel: '.h-title', buehne: '#stage', leiste: '#hbar', kicker: '.h-kicker' }
  if (!q.hero) return { fehler: 'kein Hero Wortwechsel' }
  const el = (s) => q.hero.querySelector(s)
  const text = r(el(q.text))
  // Breiteste Wortzelle: im Prototyp liegen die Wörter absolut → breitestes Kind
  const wz = el(q.woerter)
  let woerter = r(wz)
  if (!ww) {
    const breit = Math.max(...[...wz.children].map((c) => c.offsetWidth))
    woerter = { left: woerter.left, right: woerter.left + breit, top: woerter.top, bottom: woerter.bottom }
  }
  const kick = el(q.kicker)
  const rg = document.createRange(); rg.selectNodeContents(kick)
  return {
    kopfUnten: kopf ? kopf.bottom : 0,
    logoLinks: logo ? logo.left : null,
    textLinks: rg.getBoundingClientRect().left,
    hero: r(q.hero).toJSON(),
    text: text.toJSON(),
    woerter: { left: woerter.left, right: woerter.right, top: woerter.top, bottom: woerter.bottom },
    titelGroesse: parseFloat(getComputedStyle(el(q.titel)).fontSize),
    buehne: r(el(q.buehne)).toJSON(),
    leiste: r(el(q.leiste)).toJSON(),
  }
}

const browser = await chromium().launch()
const fehler = []
const buehnen = []
let geprueft = 0

async function kontext (w, h, mitRoute) {
  const k = await browser.newContext({ baseURL: einst.ddevUrl, viewport: { width: w, height: h }, ignoreHTTPSErrors: true, reducedMotion: 'reduce' })
  if (mitRoute) {
    if (css !== null) await k.route(new RegExp(einst.cssRoute), (r) => r.fulfill({ body: css, contentType: 'text/css' }))
    if (js !== null) await k.route(/neo_fe\/js\/neo-behaviors\.js/, (r) => r.fulfill({ body: js, contentType: 'text/javascript' }))
    if (!a['ohne-ersatz']) {
      const neu = beispiel()
      await k.route((u) => new URL(u).pathname === '/', async (r) => {
        const antwort = await r.fetch()
        await r.fulfill({ response: antwort, body: ersetzeHero(await antwort.text(), neu) })
      })
    }
  }
  return k
}

for (const [w, h] of groessen) {
  const name = `${w}×${h}`
  const k = await kontext(w, h, true)
  const s = await k.newPage()
  const skriptfehler = []
  s.on('pageerror', (e) => skriptfehler.push(e.message))
  try {
    const antwort = await s.goto('/', { waitUntil: 'networkidle', timeout: 45000 })
    if (!antwort || antwort.status() >= 400) throw new Error(`HTTP ${antwort?.status() ?? 'ohne Antwort'}`)
    await s.evaluate(() => document.fonts.ready)
    await s.waitForTimeout(800)
    const m = await s.evaluate(messen)
    geprueft++
    if (m.fehler) { fehler.push(`${name}: ${m.fehler}`); console.log(`✗ ${name}: ${m.fehler}`); continue }
    const neben = w >= 960
    const zeilen = []
    const pruefe = (ok, text) => { zeilen.push(`${ok ? '✓' : '✗'} ${text}`); if (!ok) fehler.push(`${name}: ${text}`) }

    // kein Claim in den Screens
    if (neben) pruefe(m.woerter.right <= m.buehne.left + 0.5, `Claim rechts ${m.woerter.right.toFixed(1)} ≤ Bühne links ${m.buehne.left.toFixed(1)}`)
    else pruefe(m.text.bottom <= m.buehne.top + 0.5, `Text unten ${m.text.bottom.toFixed(1)} ≤ Bühne oben ${m.buehne.top.toFixed(1)}`)

    const heroUnten = m.hero.bottom
    const unten = heroUnten - m.leiste.bottom
    const abstandLeiste = m.leiste.top - m.buehne.bottom
    if (neben) {
      const oben = Math.min(m.text.top, m.buehne.top) - m.kopfUnten
      pruefe(Math.abs(oben - unten) <= 2, `Rahmen oben ${oben.toFixed(1)} = unten ${unten.toFixed(1)} (±2)`)
    }
    pruefe(unten >= 2 * abstandLeiste - 0.5, `Nähe: Leiste→Unterkante ${unten.toFixed(1)} ≥ 2 × ${abstandLeiste.toFixed(1)}`)
    pruefe(m.titelGroesse <= 88, `Claim ${m.titelGroesse.toFixed(1)} px ≤ 88`)
    if (m.logoLinks !== null) pruefe(Math.abs(m.textLinks - m.logoLinks) <= 1, `Text links ${m.textLinks.toFixed(1)} = Logo ${m.logoLinks.toFixed(1)} (±1)`)
    pruefe(skriptfehler.length === 0, `Skriptfehler: ${skriptfehler.length}${skriptfehler.length ? ' — ' + skriptfehler[0] : ''}`)
    if (w >= 1920) buehnen.push([name, m.buehne.width, m.buehne.height])

    let info = `Bühne ${m.buehne.width.toFixed(0)}×${m.buehne.height.toFixed(0)} @ ${m.buehne.left.toFixed(0)},${m.buehne.top.toFixed(0)} · Hero ${m.hero.height.toFixed(0)} · Claim ${m.titelGroesse.toFixed(1)}`
    if (a.vergleich) {
      const kp = await kontext(w, h, false)
      const sp = await kp.newPage()
      await sp.goto(PROTOTYP, { waitUntil: 'networkidle', timeout: 45000 })
      await sp.evaluate(() => document.fonts.ready)
      await sp.waitForTimeout(2600)
      const p = await sp.evaluate(messen)
      await kp.close()
      if (!p.fehler) {
        const d = (x, y) => (x - y >= 0 ? '+' : '') + (x - y).toFixed(0)
        info += `\n    Prototyp: Bühne ${p.buehne.width.toFixed(0)}×${p.buehne.height.toFixed(0)} @ ${p.buehne.left.toFixed(0)},${p.buehne.top.toFixed(0)} · Hero ${p.hero.height.toFixed(0)} · Claim ${p.titelGroesse.toFixed(1)}` +
          `  → Abweichung Breite ${d(m.buehne.width, p.buehne.width)}, links ${d(m.buehne.left, p.buehne.left)}, oben ${d(m.buehne.top, p.buehne.top)}, Hero ${d(m.hero.height, p.hero.height)}`
      }
    }
    console.log(`\n${name}  ${info}`)
    for (const z of zeilen) console.log('  ' + z)
  } catch (e) {
    fehler.push(`${name}: ${e.message}`)
    console.log(`✗ ${name}: ${e.message}`)
  }
  await k.close()
}

// ab 1920 px: gleiche Bühne
if (buehnen.length > 1) {
  const [n0, w0, h0] = buehnen[0]
  for (const [n, bw, bh] of buehnen.slice(1)) {
    const ok = Math.abs(bw - w0) <= 1 && Math.abs(bh - h0) <= 1
    console.log(`${ok ? '✓' : '✗'} Bühne ${n} ${bw.toFixed(0)}×${bh.toFixed(0)} = ${n0} ${w0.toFixed(0)}×${h0.toFixed(0)}`)
    if (!ok) fehler.push(`Bühne ${n} weicht von ${n0} ab`)
  }
}

await browser.close()
console.log(`\n${geprueft} Größen · ${fehler.length} Abweichung(en)`)
for (const f of fehler) console.log('  - ' + f)
process.exit(fehler.some((f) => /HTTP|kein nc-hero|kein Hero|Marke/.test(f)) ? 2 : fehler.length ? 1 : 0)
