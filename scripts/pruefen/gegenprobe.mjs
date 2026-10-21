#!/usr/bin/env node
// ==========================================================================
// pruefen:gegenprobe — wirkt eine Setzung überhaupt auf die Website? (E3)
//
//   npm run pruefen:gegenprobe -- --setze '--font-ui: var(--font-mono)'
//        [--eigenschaft font-family] [--bauteile '.nc-button,.nc-badge']
//        [--css <datei>] [--breite 1280] [--seiten <datei>] [--nur <muster>]
//        [--parallel 3] [--ausgabe <ordner>]
//
// Lädt jede DDEV-Seite (ohne --css mit der ausgelieferten styles.css),
// erzwingt die Setzung auf :root und den vier Theme-Klassen und zählt je
// Bauteil, bei wie vielen Elementen sich die Eigenschaft ändert.
// Urteil: wirkt · wirkungslos (0 von n) · nicht geprüft (0 von 0).
//
// Ausgang: 0 mindestens ein Bauteil wirkt · 1 alles wirkungslos oder nicht
// geprüft · 2 Fehler/Aufruf. Einstellungen: scripts/pruefen/einstellungen.json.
// ==========================================================================
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { lade } from './lib/einstellungen.mjs'
import { seiten } from './lib/seiten.mjs'
import { chromium } from './lib/browser.mjs'
import { oeffne } from './lib/aufnahme.mjs'
import { BAUTEILE, regel, messe, summiere, urteil, bericht } from './lib/gegenprobe.mjs'

// Der Wert von --setze beginnt meist selbst mit „--“ (Custom Property);
// parseArgs hielte ihn für eine Option, daher als --setze=<wert> zusammenziehen
const argv = process.argv.slice(2)
const i = argv.indexOf('--setze')
if (i >= 0 && i + 1 < argv.length) argv.splice(i, 2, `--setze=${argv[i + 1]}`)

const { values: a } = parseArgs({
  args: argv,
  options: {
    setze: { type: 'string' },
    eigenschaft: { type: 'string', default: 'font-family' },
    bauteile: { type: 'string' },
    css: { type: 'string' },
    breite: { type: 'string', default: '1280' },
    seiten: { type: 'string' },
    nur: { type: 'string' },
    parallel: { type: 'string', default: '3' },
    ausgabe: { type: 'string' },
  },
})

if (!a.setze) {
  console.error("Aufruf: npm run pruefen:gegenprobe -- --setze '--font-ui: var(--font-mono)' [--eigenschaft font-family] [--bauteile '.nc-button,…'] [--css <datei>]")
  process.exit(2)
}

const einst = lade()
const bauteile = a.bauteile ? a.bauteile.split(',').map((s) => s.trim()).filter(Boolean) : BAUTEILE
const css = regel(a.setze)
const ersatz = a.css ? readFileSync(a.css, 'utf8') : null
let liste = seiten(einst, { datei: a.seiten })
if (a.nur) liste = liste.filter((s) => new RegExp(a.nur).test(s))
if (!liste.length) { console.error('Keine Seiten zu prüfen.'); process.exit(2) }

const zeit = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15)
const aus = path.resolve(a.ausgabe ?? `.pruefen/gegenprobe-${zeit}`)
mkdirSync(aus, { recursive: true })

const start = Date.now()
const browser = await chromium().launch()
const jeSeite = new Array(liste.length)
let naechste = 0
let fertig = 0
await Promise.all(Array.from({ length: Math.max(1, Number(a.parallel)) }, async () => {
  const t = await oeffne(browser, einst, Number(a.breite))
  if (ersatz !== null) t.setzeCss(ersatz)
  while (naechste < liste.length) {
    const i = naechste++
    const s = liste[i]
    try {
      const antwort = await t.seite.goto(s, { waitUntil: 'load', timeout: 30000 })
      if (!antwort || antwort.status() >= 400) throw new Error(`HTTP ${antwort?.status() ?? 'ohne Antwort'}`)
      jeSeite[i] = { seite: s, zaehlung: await messe(t.seite, { bauteile, eigenschaft: a.eigenschaft, css }) }
    } catch (e) {
      jeSeite[i] = { seite: s, fehler: e.message.split('\n')[0].slice(0, 120) }
    }
    process.stderr.write(`\r${++fertig}/${liste.length}`)
  }
  await t.schliesse()
}))
process.stderr.write('\n')
await browser.close()
const dauer = Math.round((Date.now() - start) / 1000)

const geprueft = jeSeite.filter((e) => !e.fehler)
const fehler = jeSeite.filter((e) => e.fehler)
const summe = summiere(geprueft.map((e) => e.zaehlung), bauteile)
const zeilen = [
  `Gegenprobe ${a.setze} → ${a.eigenschaft}, ${geprueft.length} von ${liste.length} Seiten bei ${a.breite} px, CSS ${a.css ?? 'ausgeliefert'}`,
  '',
  bericht(summe),
]
if (fehler.length) zeilen.push('', `Fehler: ${fehler.length} nicht geprüft`, ...fehler.map((e) => `  ${e.seite}  ${e.fehler}`))
zeilen.push('', `Dauer ${Math.floor(dauer / 60)} min ${dauer % 60} s · Ausgabe ${path.relative(process.cwd(), aus) || aus}`)
const text = zeilen.join('\n')
console.log(text)
writeFileSync(path.join(aus, 'bericht.txt'), text + '\n')
writeFileSync(path.join(aus, 'bericht.json'), JSON.stringify({
  setze: a.setze, regel: css, eigenschaft: a.eigenschaft, breite: Number(a.breite), css: a.css ? path.resolve(a.css) : null,
  ddevUrl: einst.ddevUrl, dauerSekunden: dauer, summe, urteil: Object.fromEntries(Object.entries(summe).map(([k, z]) => [k, urteil(z)])), seiten: jeSeite,
}, null, 2))

process.exit(fehler.length ? 2 : Object.values(summe).some((z) => urteil(z) === 'wirkt') ? 0 : 1)
