#!/usr/bin/env node
// ==========================================================================
// pruefen:alles — Fertig-Gate: alle nötigen Prüfungen, ein Bericht (E4)
//
//   npm run pruefen:alles                 Auswahl nach Änderungen gegen main
//        [-- --alle] [--ohne modul --ohne bilder] [--basis main]
//        [--gleichzeitig] [--pixel-erzwingen] [--nur-zeigen] [--ausgabe <ordner>]
//
// Welche Prüfung wann (lib/auswahl.mjs): npm test immer; ci:lokal --e2e bei
// Code; Bildvergleich bei App/SCSS/Token; Pixelvergleich der Website bei
// SCSS/Token/Recipes; Modul-e2e bei App/SCSS.
//
// Reihenfolge (Standard nacheinander, Entscheidung Frank 21.10.2026):
//   build:css → npm test → ci:lokal --e2e → pruefen:bilder --bauen
//   → pruefen:pixel → pruefen:modul
// Der Pixelvergleich prüft eine eingefrorene Kopie der frisch gebauten
// styles.css gegen die ausgelieferte von neo_fe. Ist beides byte-gleich, kann
// sich die Website nicht ändern: dann entfällt er als grün (sonst fände er
// nur Rauschen, z. B. /produkte/workplace) — erzwingen mit --pixel-erzwingen.
// --gleichzeitig lässt den Pixelvergleich neben test/ci/bilder laufen; im
// Probelauf vom 21.10.2026 war das langsamer (CI 761 s statt ~263 s unter Last).
// Schlägt npm test, CI oder Bilder fehl, entfallen die folgenden davon;
// pruefen:modul entfällt, wenn npm test oder CI rot sind.
//
// Ausgang: 0 alles grün · 1 mindestens eine Prüfung rot oder entfallen.
// Zeigt der Pixelvergleich Unterschiede, steht „HALTEPUNKT“ im Bericht (E6).
// Bericht: .pruefen/fertig-<zeit>/bericht.md und bericht.json, je Prüfung
// ein Protokoll. Anleitung: README.md.
// ==========================================================================
import { spawn, execFileSync } from 'node:child_process'
import { copyFileSync, createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { lade } from './lib/einstellungen.mjs'
import { waehle, kennzahl, urteil, PRUEFUNGEN } from './lib/auswahl.mjs'

const WURZEL = path.resolve(import.meta.dirname, '../..')
let a
try {
  ;({ values: a } = parseArgs({
    options: {
      alle: { type: 'boolean', default: false },
      ohne: { type: 'string', multiple: true, default: [] },
      basis: { type: 'string', default: 'main' },
      'nur-zeigen': { type: 'boolean', default: false },
      gleichzeitig: { type: 'boolean', default: false },
      'pixel-erzwingen': { type: 'boolean', default: false },
      ausgabe: { type: 'string' },
    },
  }))
} catch (f) { console.error(`Aufruf: ${f.message}`); process.exit(2) }
if (a['pixel-erzwingen'] && a.ohne.includes('pixel')) { console.error('--pixel-erzwingen und --ohne pixel widersprechen sich.'); process.exit(2) }
let einst
try { einst = lade() } catch (f) { console.error(`Einstellungen: ${f.message}`); process.exit(2) }
const unbekannt = a.ohne.filter((p) => !PRUEFUNGEN.includes(p))
if (unbekannt.length) { console.error(`Unbekannte Prüfung bei --ohne: ${unbekannt.join(', ')} (bekannt: ${PRUEFUNGEN.join(', ')})`); process.exit(2) }

// --- Was hat sich geändert? (Zweig gegen Basis + nicht Committetes) ---------
const git = (...args) => execFileSync('git', ['-C', WURZEL, '-c', 'core.quotePath=false', ...args], { encoding: 'utf8' })
try { git('rev-parse', '--verify', '--quiet', `${a.basis}^{commit}`) } catch {
  console.error(`Basis „${a.basis}“ gibt es nicht — ohne sie fielen committete Änderungen still heraus.`)
  process.exit(2)
}
// -z: Pfade ohne Anführungszeichen (Leerzeichen, Umlaute); --no-renames: bei
// Verschiebungen zählen alter und neuer Pfad; -uall: neue Ordner Datei für Datei
const dateien = new Set()
for (const d of git('diff', '--name-only', '-z', '--no-renames', `${a.basis}...HEAD`).split('\0')) if (d) dateien.add(d)
for (const z of git('status', '--porcelain', '-z', '--no-renames', '-uall').split('\0')) if (z.length > 3) dateien.add(z.slice(3))
dateien.delete('STAND.md')

let wahl
try { wahl = waehle([...dateien].sort(), { alle: a.alle, ohne: a.ohne }) } catch (f) { console.error(f.message); process.exit(2) }
const { pruefungen, gruende } = wahl
if (a['pixel-erzwingen'] && !a.ohne.includes('pixel') && !pruefungen.includes('pixel')) {
  gruende.pixel = '--pixel-erzwingen'
  pruefungen.splice(PRUEFUNGEN.filter((p) => pruefungen.includes(p) || p === 'pixel').indexOf('pixel'), 0, 'pixel')
}
const BEFEHL = {
  test: 'npm test',
  ci: 'npm run ci:lokal -- --e2e',
  bilder: 'npm run pruefen:bilder -- --bauen',
  pixel: 'npm run pruefen:pixel -- --vorher <neo_fe styles.css> --nachher <frischer Bau>',
  modul: 'npm run pruefen:modul',
}
console.log(`Fertig-Gate · ${dateien.size} geänderte Datei(en) gegen ${a.basis}`)
for (const p of PRUEFUNGEN) console.log(`  ${pruefungen.includes(p) ? '▸' : '·'} ${p.padEnd(7)} ${pruefungen.includes(p) ? `${BEFEHL[p]}  — ${gruende[p]}` : 'entfällt'}`)
if (!pruefungen.includes('pixel') && !a.ohne.includes('pixel')) console.log('    (pixel kommt dazu, falls die frisch gebaute styles.css von der ausgelieferten abweicht)')
if (a['nur-zeigen']) process.exit(0)

// --- Lauf -------------------------------------------------------------------
const zeit = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15)
const aus = path.resolve(WURZEL, a.ausgabe ?? `.pruefen/fertig-${zeit}`)
mkdirSync(aus, { recursive: true })
const ergebnisse = {}
// Rechnerlast mitschreiben: unter hoher Last (andere Sitzungen) überschreiten
// Vitest und e2e ihre Zeitgrenzen — ein rotes CI ist dann kein Code-Befund.
const last = () => { try { return execFileSync('uptime', { encoding: 'utf8' }).match(/load averages?: ([\d.,]+)/)?.[1].replace(',', '.') ?? '?' } catch { return '?' } }
const lastStart = last()

function lauf (name, befehl, args) {
  return new Promise((fertig) => {
    const start = Date.now()
    const protokoll = path.join(aus, `${name}.log`)
    const log = createWriteStream(protokoll)
    let text = ''
    console.log(`▸ ${name} gestartet`)
    const k = spawn(befehl, args, { cwd: WURZEL, env: { ...process.env, FORCE_COLOR: '0' } })
    const nimm = (b) => { log.write(b); text += b; if (text.length > 400000) text = text.slice(-200000) }
    k.stdout.on('data', nimm); k.stderr.on('data', nimm)
    k.on('close', (ausgang) => {
      log.end()
      let k = kennzahl(name, text)
      if (ausgang !== 0 && !(k ?? '').startsWith('rot')) k = `rot (Ausgang ${ausgang})${k ? ` — ${k}` : ''}`
      const e = { ausgang, dauer: Math.round((Date.now() - start) / 1000), kennzahl: k, protokoll }
      if (name !== 'bau') ergebnisse[name] = e
      console.log(`${ausgang === 0 ? '✓' : '✗'} ${name} (${e.dauer} s)${e.kennzahl ? ` — ${e.kennzahl}` : ''}`)
      fertig(e)
    })
  })
}
const entfaellt = (name, grund) => { ergebnisse[name] = { ausgang: null, dauer: 0, kennzahl: null, entfallen: grund }; console.log(`· ${name} entfällt — ${grund}`) }

const bau = await lauf('bau', 'npm', ['run', 'build:css'])
if (bau.ausgang !== 0) {
  for (const p of pruefungen) entfaellt(p, '`npm run build:css` ist gescheitert')
} else {
  const nachherCss = path.join(aus, 'nachher.css')
  copyFileSync(path.join(WURZEL, 'styles.css'), nachherCss)

  const lokal = async () => {
    let rot = null
    for (const [p, args] of [['test', ['test']], ['ci', ['run', 'ci:lokal', '--', '--e2e']], ['bilder', ['run', 'pruefen:bilder', '--', '--bauen']]]) {
      if (!pruefungen.includes(p)) continue
      if (rot) { entfaellt(p, `${rot} ist rot`); continue }
      if ((await lauf(p, 'npm', args)).ausgang !== 0) rot = p
    }
  }
  // CSS immer vergleichen: weicht der Bau von der ausgelieferten styles.css ab,
  // kommt der Pixelvergleich dazu, egal welche Datei es verursacht hat.
  const vorher = path.join(einst.themePfad, 'css/styles.css')
  const gleich = existsSync(vorher) && readFileSync(vorher).equals(readFileSync(nachherCss))
  if (!gleich && !pruefungen.includes('pixel') && !a.ohne.includes('pixel')) {
    pruefungen.splice(pruefungen.includes('modul') ? pruefungen.indexOf('modul') : pruefungen.length, 0, 'pixel')
    gruende.pixel = 'styles.css weicht von der ausgelieferten ab'
    console.log('▸ pixel kommt dazu — styles.css weicht von der ausgelieferten ab')
  }
  const website = async () => {
    if (!pruefungen.includes('pixel')) return
    if (!existsSync(vorher)) return entfaellt('pixel', `ausgelieferte styles.css fehlt: ${vorher}`)
    if (!a['pixel-erzwingen'] && gleich) {
      ergebnisse.pixel = { ausgang: 0, dauer: 0, kennzahl: 'styles.css byte-gleich mit neo_fe — kein Unterschied möglich, nicht gemessen', protokoll: null }
      console.log(`✓ pixel — ${ergebnisse.pixel.kennzahl}`)
      return
    }
    await lauf('pixel', 'node', ['scripts/pruefen/pixel.mjs', '--vorher', vorher, '--nachher', nachherCss, '--ausgabe', path.join(aus, 'pixel')])
  }
  if (a.gleichzeitig) await Promise.all([lokal(), website()])
  else { await lokal(); await website() }
  if (pruefungen.includes('modul')) {
    const rotLokal = ['test', 'ci'].find((p) => ergebnisse[p] && ergebnisse[p].ausgang !== 0)
    if (rotLokal) entfaellt('modul', `${rotLokal} ist rot`)
    else await lauf('modul', 'npm', ['run', 'pruefen:modul'])
  }
}

// --- Bericht ------------------------------------------------------------------
const u = urteil(ergebnisse)
const zeile = (p) => {
  const e = ergebnisse[p]
  const ergebnis = e.entfallen ? `entfallen: ${e.entfallen}` : e.ausgang === 0 ? 'grün' : `rot (Ausgang ${e.ausgang})`
  return `| ${p} | ${gruende[p]} | ${ergebnis} | ${e.kennzahl ?? '–'} | ${e.dauer} s | ${e.protokoll ? path.relative(WURZEL, e.protokoll) : '–'} |`
}
const md = [
  `# Fertig-Gate ${zeit}`,
  '',
  `Zweig: ${git('branch', '--show-current').trim() || '(losgelöst)'} · Stand ${git('rev-parse', '--short', 'HEAD').trim()} · Basis ${a.basis} · ${dateien.size} geänderte Datei(en) · Rechnerlast ${lastStart} → ${last()}`,
  ...(Number(lastStart) > 40 && ergebnisse.ci?.ausgang ? ['', `> Hinweis: Rechnerlast beim Start ${lastStart}. Zeitüberschreitungen in CI sind dann oft Last, kein Code-Befund — den roten Test einzeln wiederholen, bevor etwas geändert wird.`] : []),
  '',
  `**Gesamt: ${u.gruen ? 'GRÜN' : `ROT — ${u.rot.join(', ')}`}**`,
  ...(u.haltepunkt ? ['', '> **HALTEPUNKT (E6):** Der Pixelvergleich zeigt Unterschiede oder unklare Seiten auf der Website. Anhalten, Frank die Seiten zeigen (Bericht unter pixel/), auch wenn die Änderung gewollt ist.'] : []),
  '',
  '| Prüfung | Grund | Ergebnis | Kennzahl | Dauer | Protokoll |',
  '|---|---|---|---|---|---|',
  ...PRUEFUNGEN.filter((p) => ergebnisse[p]).map(zeile),
  '',
  '## Beleg für den Commit-Rumpf',
  ...PRUEFUNGEN.filter((p) => ergebnisse[p]?.kennzahl).map((p) => `- ${BEFEHL[p].split(' -- ')[0]}: ${ergebnisse[p].kennzahl}`),
  '',
].join('\n')
writeFileSync(path.join(aus, 'bericht.md'), md)
writeFileSync(path.join(aus, 'bericht.json'), JSON.stringify({ zeit, basis: a.basis, dateien: [...dateien], gruende, ergebnisse, urteil: u }, null, 2) + '\n')
console.log(`\n${u.gruen ? '✓ GRÜN' : `✗ ROT — ${u.rot.join(', ')}`}${u.haltepunkt ? ' · HALTEPUNKT Website-Unterschiede' : ''}`)
console.log(`Bericht: ${path.relative(WURZEL, path.join(aus, 'bericht.md'))}`)
process.exit(u.gruen ? 0 : 1)
