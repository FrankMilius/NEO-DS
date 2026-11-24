#!/usr/bin/env node
// ==========================================================================
// pruefen:sg-bilder — lädt die Story Gallery Bilder in passender Größe?
// (I18 Phase 12, 24.11.2026, Vorschlag 15, E5 Frank)
//
//   npm run pruefen:sg-bilder -- --theme <neo_fe> [--css <styles.css>]
//        [--block 26] [--seite /] [--breiten 1280,390] [--grenze-mb 1.5]
//
// 1. Die Aufbereitung includes/neo_story_gallery.inc aus <neo_fe> läuft in
//    DDEV (Drupal mit Bildstilen) auf die Karten von Block <block>; das
//    Ergebnis ersetzt auf der Seite die data-sg-shot der Galerie (DDEV
//    rendert sonst das Theme aus Franks Haupt-Checkout).
// 2. Je Breite (2-fache bzw. 3-fache Pixeldichte) werden alle Galeriebilder
//    geladen — einmal mit den heutigen Daten (vorher), einmal mit srcset
//    (nachher) — und gemessen: übertragene Bytes, gewählte Datei, Schärfe
//    (Bildpixel je Gerätepixel im sichtbaren Ausschnitt).
//
// Erfüllt, wenn nachher die Summe unter --grenze-mb liegt und jede Karte
// mindestens so scharf ist wie vorher, höchstens bis 1,0 verlangt (über 1
// hinaus bringt mehr Auflösung nichts). Ausgang 0 erfüllt, 1 Abweichung,
// 2 Seiten- oder Aufruffehler.
// ==========================================================================
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { parseArgs } from 'node:util'
import { lade } from './lib/einstellungen.mjs'
import { chromium } from './lib/browser.mjs'

const { values: a } = parseArgs({
  options: {
    theme: { type: 'string' },
    css: { type: 'string' },
    block: { type: 'string', default: '26' },
    seite: { type: 'string', default: '/' },
    breiten: { type: 'string', default: '1280,390' },
    'grenze-mb': { type: 'string', default: '1.5' },
    drupal: { type: 'string', default: '/Users/frank.milius/Sites/DRUPAL11' },
  },
})
if (!a.theme) { console.error('--theme <neo_fe> fehlt'); process.exit(2) }

// ---- 1. Aufbereitung in DDEV ------------------------------------------------
const ddev = (args, input) => execFileSync('ddev', args, { cwd: a.drupal, encoding: 'utf8', input, maxBuffer: 1 << 26 })
for (const datei of ['neo_table.inc', 'neo_story_gallery.inc']) {
  ddev(['exec', 'bash', '-c', `cat > /tmp/sg-probe-${datei}`], readFileSync(`${a.theme}/includes/${datei}`, 'utf8'))
}
const php = `require "/tmp/sg-probe-neo_table.inc"; require "/tmp/sg-probe-neo_story_gallery.inc";
$b = \\Drupal\\block_content\\Entity\\BlockContent::load(${Number(a.block)});
$h = (int) ($b->field_sg_card_height->value ?: 420);
$befunde = [];
echo json_encode(["hoehe" => $h, "shots" => array_column(_neo_fe_sg_aufbereiten((string) $b->field_sg_cards->value, $befunde, $h), "shot")]);`
const aus = JSON.parse(ddev(['drush', 'php:eval', php]).trim().split('\n').pop())
const shots = aus.shots
console.log(`· Aufbereitung: ${shots.length} Karten, Höhe ${aus.hoehe} · srcset bei ${shots.filter((s) => s && JSON.parse(s).srcset).length}`)

// ---- 2. Laden und messen ----------------------------------------------------
const einst = lade()
const css = a.css ? readFileSync(a.css, 'utf8') : null
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
function umbauen (html, neu) {
  html = html.replace(/style="--sg-card-height:/g, 'style="--sg-card-height-block:')
  if (!neu) return html
  let i = 0
  return html.replace(/data-sg-shot="[^"]*"/g, (m) => { const s = shots[i++]; return s ? `data-sg-shot="${esc(s)}"` : m })
}

async function lauf (browser, breite, neu) {
  const mobil = breite < 768
  const ctx = await browser.newContext({ baseURL: einst.ddevUrl, viewport: { width: breite, height: 900 }, deviceScaleFactor: mobil ? 3 : 2, isMobile: mobil, hasTouch: mobil, ignoreHTTPSErrors: true })
  const seite = await ctx.newPage()
  if (css !== null) await ctx.route(/neo_fe\/css\/styles\.css/, (r) => r.fulfill({ body: css, contentType: 'text/css' }))
  await seite.route((u) => new URL(u).pathname === a.seite, async (r) => { const x = await r.fetch(); await r.fulfill({ response: x, body: umbauen(await x.text(), neu) }) })
  const bytes = new Map()
  seite.on('response', async (r) => {
    if (!/\/sites\/default\/files\//.test(r.url()) || r.request().resourceType() !== 'image') return
    try { bytes.set(r.url(), (await r.body()).length) } catch { /* abgebrochen */ }
  })
  const antwort = await seite.goto(a.seite, { waitUntil: 'networkidle', timeout: 90000 })
  if (!antwort || antwort.status() >= 400) throw new Error(`HTTP ${antwort?.status()}`)
  const karten = await seite.evaluate(async () => {
    const g = document.querySelector('[data-neo-story-gallery]')
    const imgs = [...g.querySelectorAll('.nc-story-gallery__card:not(.nc-story-gallery__card--clone) .nc-shot__img')]
    imgs.forEach((i) => { i.loading = 'eager' })
    await Promise.all(imgs.map((i) => i.decode().catch(() => {})))
    // naturalWidth ist bei srcset die Dichte-bereinigte Breite, nicht die der
    // Datei — echte Pixel über ein zweites Bild ohne srcset
    const echt = await Promise.all(imgs.map((img) => new Promise((ok) => { const p = new Image(); p.onload = () => ok(p.naturalWidth); p.onerror = () => ok(img.naturalWidth); p.src = img.currentSrc })))
    return imgs.map((img, n) => {
      const box = img.parentElement.getBoundingClientRect()
      const cs = getComputedStyle(img)
      const passt = cs.objectFit === 'cover' && cs.width !== 'auto'
      const z = (cs.transform.match(/matrix\(([^,]+)/) || [0, 1])[1] * 1
      const w = img.offsetWidth, h = img.offsetHeight
      const nw = echt[n], nh = nw * img.naturalHeight / img.naturalWidth
      const skal = passt ? Math.max(w / nw, h / nh) * z : w / nw
      return { url: img.currentSrc, datei: img.currentSrc.split('/').pop().split('?')[0], natur: nw, q: +(1 / (skal * devicePixelRatio)).toFixed(2), box: Math.round(box.width) }
    })
  })
  await seite.waitForTimeout(800)
  // nur die Dateien der Galerie (die Seite hat weitere Bilder)
  const galerie = new Set(karten.map((k) => k.url))
  const summe = [...bytes].filter(([u]) => galerie.has(u)).reduce((s, [, x]) => s + x, 0)
  await ctx.close()
  return { karten, summe, anzahl: galerie.size }
}

const browser = await chromium().launch()
const fehler = []
for (const breite of a.breiten.split(',').map(Number)) {
  try {
    const vor = await lauf(browser, breite, false)
    const nach = await lauf(browser, breite, true)
    const mb = (x) => (x / 1048576).toFixed(2)
    console.log(`· ${breite}: vorher ${mb(vor.summe)} MB (${vor.anzahl} Dateien) → nachher ${mb(nach.summe)} MB (${nach.anzahl} Dateien)`)
    if (nach.summe / 1048576 > Number(a['grenze-mb'])) fehler.push(`${breite}: ${mb(nach.summe)} MB über ${a['grenze-mb']} MB`)
    nach.karten.forEach((k, i) => {
      const v = vor.karten[i]
      const soll = Math.min(v.q, 1)
      console.log(`    Karte ${i + 1}: Schärfe ${v.q} → ${k.q} · ${k.datei} (${k.natur} px)`)
      if (k.q < soll - 0.02) fehler.push(`${breite} Karte ${i + 1}: Schärfe ${k.q} statt mindestens ${soll}`)
    })
  } catch (e) { fehler.push(`${breite}: ${e.message.split('\n')[0]}`) }
}
await browser.close()
for (const f of fehler) console.log('✗ ' + f)
console.log(`\n${fehler.length} Abweichung(en)`)
process.exit(fehler.some((x) => /HTTP|Timeout/.test(x)) ? 2 : fehler.length ? 1 : 0)
