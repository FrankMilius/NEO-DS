#!/usr/bin/env node
// ==========================================================================
// pruefen:pixel — Pixelvergleich der DDEV-Seiten mit Kontrollaufnahme (E3)
//
//   npm run pruefen:pixel -- --vorher <css> --nachher <css>
//        [--breite 1280 --breite 390] [--seiten <datei>] [--nur <muster>]
//        [--parallel 3] [--ausgabe <ordner>]
//
// Je Seite drei Aufnahmen mit ersetzter styles.css: a (vorher), b (nachher),
// c (Kontrolle = vorher); eine auffällige Seite wird einmal frisch wiederholt
// (lib/messung.mjs). Bericht je Breite „Seiten mit Unterschied: n von N“,
// je auffälliger Seite Unterschied (a↔b) und Rauschen (a↔c). Bilder nur von
// auffälligen Seiten, unter .pruefen/pixel-<zeit>/ samt bericht.json.
//
// Ausgang: 0 kein Unterschied · 1 Unterschied oder unklar · 2 Fehler/Aufruf.
// Einstellungen: scripts/pruefen/einstellungen.json. Anleitung: README.md.
// ==========================================================================
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { lade } from './lib/einstellungen.mjs'
import { seiten } from './lib/seiten.mjs'
import { chromium } from './lib/browser.mjs'
import { oeffne, aufnehmen } from './lib/aufnahme.mjs'
import { Vergleicher } from './lib/vergleich.mjs'
import { urteil, bericht, FAKTOR } from './lib/pixel-bericht.mjs'
import { messeSeite } from './lib/messung.mjs'

const SCHWELLE = 8

const { values: a } = parseArgs({
  options: {
    vorher: { type: 'string' },
    nachher: { type: 'string' },
    breite: { type: 'string', multiple: true },
    seiten: { type: 'string' },
    nur: { type: 'string' },
    parallel: { type: 'string', default: '3' },
    ausgabe: { type: 'string' },
  },
})

if (!a.vorher || !a.nachher) {
  console.error('Aufruf: npm run pruefen:pixel -- --vorher <css> --nachher <css> [--breite 1280] [--seiten <datei>] [--nur <muster>]')
  process.exit(2)
}

const einst = lade()
const css = { a: readFileSync(a.vorher, 'utf8'), b: readFileSync(a.nachher, 'utf8') }
css.c = css.a
const breiten = (a.breite ?? einst.breiten).map(Number)
let liste = seiten(einst, { datei: a.seiten })
if (a.nur) liste = liste.filter((s) => new RegExp(a.nur).test(s))
if (!liste.length) { console.error('Keine Seiten zu prüfen.'); process.exit(2) }

const zeit = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15)
const aus = path.resolve(a.ausgabe ?? `.pruefen/pixel-${zeit}`)
mkdirSync(aus, { recursive: true })
writeFileSync(path.join(aus, 'seiten.txt'), liste.join('\n') + '\n')

const start = Date.now()
const browser = await chromium().launch()
const vergleicher = await Vergleicher.starte(browser)
const ergebnis = {}

for (const breite of breiten) {
  const ordner = path.join(aus, String(breite))
  const zeilen = new Array(liste.length)
  let naechste = 0
  let fertig = 0
  const arbeiter = async () => {
    while (naechste < liste.length) {
      const i = naechste++
      const s = liste[i]
      try {
        // Jeder Durchgang in frischem Kontext, damit die Wiederholung nichts erbt
        const nimmAuf = async () => {
          const t = await oeffne(browser, einst, breite)
          try {
            const bilder = {}
            for (const tag of ['a', 'b', 'c']) { t.setzeCss(css[tag]); bilder[tag] = await aufnehmen(t.seite, s) }
            return bilder
          } finally { await t.schliesse() }
        }
        const vergleiche = async (x, y) => (await vergleicher.vergleiche(x, y, { schwelle: SCHWELLE })).abweichend
        const { ab, ac, wiederholt, bilder } = await messeSeite({ nimmAuf, vergleiche })
        zeilen[i] = { seite: s, ab, ac, wiederholt, urteil: urteil({ ab, ac }) }
        if (ab || ac) {
          mkdirSync(ordner, { recursive: true })
          const name = `${String(i).padStart(2, '0')}-${s.replace(/[^\w-]+/g, '_').replace(/^_|_$/g, '') || 'start'}`
          for (const [tag, png] of Object.entries(bilder)) writeFileSync(path.join(ordner, `${name}-${tag}.png`), png)
          zeilen[i].bilder = path.relative(aus, path.join(ordner, name))
        }
      } catch (e) {
        zeilen[i] = { seite: s, fehler: e.message.split('\n')[0].slice(0, 120) }
      }
      process.stderr.write(`\r${breite}: ${++fertig}/${liste.length}`)
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, Number(a.parallel)) }, arbeiter))
  process.stderr.write('\n')
  ergebnis[breite] = zeilen
}

await browser.close()
const dauer = Math.round((Date.now() - start) / 1000)

const texte = breiten.map((b) => bericht(b, ergebnis[b]))
const kopf = `Pixelvergleich ${a.vorher} → ${a.nachher}\nRegel: Pixel mit Graudifferenz > ${SCHWELLE}; geändert, wenn Unterschied > ${FAKTOR} × Rauschen`
const fuss = `Dauer ${Math.floor(dauer / 60)} min ${dauer % 60} s · Ausgabe ${path.relative(process.cwd(), aus) || aus}`
const text = [kopf, ...texte, fuss].join('\n\n')
console.log(text)
writeFileSync(path.join(aus, 'bericht.txt'), text + '\n')
writeFileSync(path.join(aus, 'bericht.json'), JSON.stringify({
  vorher: path.resolve(a.vorher), nachher: path.resolve(a.nachher), schwelle: SCHWELLE, faktor: FAKTOR,
  ddevUrl: einst.ddevUrl, dauerSekunden: dauer, seiten: liste, breiten: ergebnis,
}, null, 2))

const alle = Object.values(ergebnis).flat()
process.exit(alle.some((e) => e.fehler) ? 2 : alle.some((e) => e.urteil && e.urteil !== 'unverändert') ? 1 : 0)
