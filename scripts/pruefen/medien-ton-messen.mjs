#!/usr/bin/env node
// ==========================================================================
// medien-ton-messen — trifft die CSS-Filterkette die von Hand gefärbte
// Prod-Vorlage? (I12 Medien einfärben, Phase 1)
//
//   node scripts/pruefen/medien-ton-messen.mjs
//        [--original <jpg>] [--vorlage <jpg>] [--ton '#88e6b1']
//        [--schwarzpunkt 0.3] [--grenze 12] [--suche]
//
// Färbt das Original im echten Chromium so, wie die Website es tun wird
// (Graustufen → Schwarzpunkt → multiply mit dem Ton), und gibt die mittlere
// Abweichung je Farbkanal gegen die Vorlage aus (0 bis 255).
// --suche probiert Schwarzpunkte von 0.20 bis 0.40 und nennt den besten.
//
// Ausgang: 0 jeder Kanal ≤ Grenze · 1 ein Kanal darüber oder Größe ungleich
// · 2 Aufruf oder Dateien fehlerhaft.
// ==========================================================================
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { chromium } from './lib/browser.mjs'
import { filterKette, vergleicheMitVorlage } from './lib/medien-ton.mjs'

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const VORLAGEN = path.join(WURZEL, 'tests/fixtures/medien-ton')

const { values: a } = parseArgs({
  options: {
    original: { type: 'string', default: path.join(VORLAGEN, 'einfuehrung-beratung-konzeption.jpg') },
    vorlage: { type: 'string', default: path.join(VORLAGEN, 'einfuehrung-beratung-konzeption-gruen.jpg') },
    ton: { type: 'string', default: '#88e6b1' },
    schwarzpunkt: { type: 'string', default: '0.3' },
    grenze: { type: 'string', default: '12' },
    suche: { type: 'boolean', default: false },
  },
})

const grenze = Number(a.grenze)
const bp = Number(a.schwarzpunkt)
if (!Number.isFinite(grenze) || !/^#[0-9a-f]{6}$/i.test(a.ton)) {
  console.error('Aufruf: node scripts/pruefen/medien-ton-messen.mjs [--ton #rrggbb] [--schwarzpunkt 0.3] [--grenze 12] [--suche]')
  process.exit(2)
}

function datenUrl (datei) {
  const typ = /\.png$/i.test(datei) ? 'image/png' : 'image/jpeg'
  return `data:${typ};base64,${readFileSync(datei).toString('base64')}`
}

let original, vorlage
try {
  original = datenUrl(a.original)
  vorlage = datenUrl(a.vorlage)
} catch (e) {
  console.error(`Datei nicht lesbar: ${e.message}`)
  process.exit(2)
}

const runde = (z) => z.toFixed(2)
const browser = await chromium().launch()
try {
  const seite = await browser.newPage({ deviceScaleFactor: 1 })
  const miss = (schwarzpunkt) => vergleicheMitVorlage(seite, { original, vorlage, ton: a.ton, schwarzpunkt })

  if (a.suche) {
    let bester = null
    for (let i = 20; i <= 40; i++) {
      const s = i / 100
      const r = await miss(s)
      if (!r.gleicheGroesse) break
      const mittel = r.abweichung.reduce((x, y) => x + y, 0) / 3
      console.log(`  Schwarzpunkt ${s.toFixed(2)}  R ${runde(r.abweichung[0])}  G ${runde(r.abweichung[1])}  B ${runde(r.abweichung[2])}  Mittel ${runde(mittel)}`)
      if (!bester || mittel < bester.mittel) bester = { s, mittel }
    }
    if (bester) console.log(`  Bester Schwarzpunkt: ${bester.s.toFixed(2)} (Mittel ${runde(bester.mittel)})`)
  }

  const r = await miss(bp)
  console.log(`Original  ${path.relative(WURZEL, a.original)}`)
  console.log(`Vorlage   ${path.relative(WURZEL, a.vorlage)}`)
  console.log(`Ton ${a.ton} · Schwarzpunkt ${bp} · filter: ${filterKette(bp)}; mix-blend-mode: multiply`)
  if (!r.gleicheGroesse) {
    console.log('Urteil: Original und Vorlage sind ungleich groß — kein Vergleich möglich.')
    process.exitCode = 1
  } else {
    const [R, G, B] = r.abweichung
    const ok = r.abweichung.every((k) => k <= grenze)
    console.log(`${r.breite} × ${r.hoehe} px · mittlere Abweichung je Kanal (0–255): R ${runde(R)}  G ${runde(G)}  B ${runde(B)}`)
    console.log(`Urteil: ${ok ? 'trifft' : 'trifft nicht'} (Grenze ${grenze})`)
    process.exitCode = ok ? 0 : 1
  }
} catch (e) {
  console.error(`Messung gescheitert: ${e.message}`)
  process.exitCode = 2
} finally {
  await browser.close()
}
