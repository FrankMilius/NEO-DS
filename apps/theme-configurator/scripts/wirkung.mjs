#!/usr/bin/env node
// ==========================================================================
// Wirkungsprüfung auswerten (Roadmap R12, 20.10.2026)
// ==========================================================================
// Liest wirkung-ergebnis/*.json (e2e/wirkung.spec.js) und ordnet jedes
// Komponenten-Token einer Art zu:
//   wirkt           Prüfwert ändert die Bühne
//   zustand         keine Änderung, Name deutet auf Zustand/Bewegung
//                   (Hover, Fokus, Dauer …) — auf der ruhenden Bühne nicht messbar
//   ohne-wirkung    im CSS gelesen, aber keine Änderung auf der Bühne
//   unbenutzt       im CSS der Bühne nirgends gelesen
//   ohne-pruefwert  kein passender Prüfwert (z. B. Schlüsselwörter)
//   ohne-buehne     Komponente hat keine Bühne
// Festgeschrieben in src/data/token-wirkung.json (die App zeigt daraus den
// Hinweis „wirkt derzeit nicht“).
//
//   node scripts/wirkung.mjs --leeren    Ergebnisordner leeren (vor dem Lauf)
//   node scripts/wirkung.mjs --pruefen   Ratsche: nichts darf schlechter werden
//   node scripts/wirkung.mjs --setzen    Stand festschreiben
// ==========================================================================
import fs from 'node:fs'
import process from 'node:process'
import { resolve } from 'node:path'
import { componentTokenGroups } from '../src/data/tokens.generated.js'

const APP = resolve(import.meta.dirname, '..')
const ERGEBNIS = resolve(APP, 'wirkung-ergebnis')
const DATEI = resolve(APP, 'src/data/token-wirkung.json')
const ZUSTAND = /hover|active|focus|pressed|visited|disabled|selected|checked|open|expanded|current|loading|skeleton|transition|duration|delay|anim|ease|drag|placeholder|scrolled|sticky|print/
/** Rang: höher = schlechter. Ratsche verbietet Anstieg. */
const RANG = { wirkt: 0, zustand: 1, 'ohne-pruefwert': 1, 'ohne-buehne': 1, 'ohne-wirkung': 2, unbenutzt: 2 }
const TOT = new Set(['ohne-wirkung', 'unbenutzt'])

const modus = process.argv[2]
if (modus === '--leeren') { fs.rmSync(ERGEBNIS, { recursive: true, force: true }); process.exit(0) }

/** Art je Token über alle Komponenten (beste Messung zählt) */
export function auswerten (ergebnisse) {
  const art = {}
  const setze = (id, a) => { if (!(id in art) || RANG[a] < RANG[art[id]]) art[id] = a }
  for (const g of componentTokenGroups) {
    const e = ergebnisse[g.id]
    for (const t of [...(g.tokens || []), ...((g.subGroups || g.subgroups || []).flatMap((s) => s.tokens || []))]) {
      if (!e) { setze(t.id, 'ohne-buehne'); continue }
      const v = e.ergebnis[t.id]
      if (v === undefined) setze(t.id, 'ohne-buehne')
      else if (typeof v === 'number') setze(t.id, v > 0 ? 'wirkt' : (ZUSTAND.test(t.id) ? 'zustand' : 'ohne-wirkung'))
      else setze(t.id, v)
    }
  }
  return Object.fromEntries(Object.entries(art).sort(([a], [b]) => a.localeCompare(b)))
}

function zaehle (art) {
  const z = {}
  for (const a of Object.values(art)) z[a] = (z[a] || 0) + 1
  return z
}

const dateien = fs.existsSync(ERGEBNIS) ? fs.readdirSync(ERGEBNIS).filter((f) => f.endsWith('.json')) : []
if (!dateien.length) { console.error('✗ Keine Messung in wirkung-ergebnis/ — erst: npx playwright test --project=wirkung'); process.exit(1) }
const ergebnisse = {}
for (const f of dateien) {
  const d = JSON.parse(fs.readFileSync(resolve(ERGEBNIS, f), 'utf8'))
  if (!d.elemente) { console.error(`✗ ${f}: Bühne ohne Elemente — Messung ungültig`); process.exit(1) }
  ergebnisse[f.slice(0, -5)] = d
}
const jetzt = auswerten(ergebnisse)
const z = zaehle(jetzt)
const zeile = Object.entries(z).map(([a, n]) => `${a} ${n}`).join(', ')

if (modus === '--setzen') {
  fs.writeFileSync(DATEI, JSON.stringify({ zaehlung: z, tokens: jetzt }, null, 1) + '\n')
  console.log(`✓ Festgeschrieben: ${Object.keys(jetzt).length} Tokens — ${zeile}`)
  process.exit(0)
}

const stand = fs.existsSync(DATEI) ? JSON.parse(fs.readFileSync(DATEI, 'utf8')).tokens : {}
const schlechter = []; const besser = []
for (const [id, a] of Object.entries(jetzt)) {
  const alt = stand[id]
  if (alt === undefined) { if (TOT.has(a)) schlechter.push(`${id}: neu und ${a}`); continue }
  if (RANG[a] > RANG[alt]) schlechter.push(`${id}: ${alt} → ${a}`)
  else if (RANG[a] < RANG[alt]) besser.push(`${id}: ${alt} → ${a}`)
}
console.log(`Wirkungsprüfung: ${Object.keys(jetzt).length} Tokens — ${zeile}`)
if (besser.length) console.log(`  Besser geworden (${besser.length}), mit \`node scripts/wirkung.mjs --setzen\` festschreiben:\n    ${besser.slice(0, 20).join('\n    ')}`)
if (schlechter.length) {
  console.error(`✗ ${schlechter.length} Token(s) schlechter als der festgeschriebene Stand:\n    ${schlechter.join('\n    ')}`)
  process.exit(1)
}
console.log('  ✓ nichts schlechter als der festgeschriebene Stand')
