#!/usr/bin/env node
// ==========================================================================
// pakete:vorbereiten — je Paket einer Liste einen Arbeitsbereich anlegen (E10)
//
//   npm run pakete:vorbereiten -- scripts/pakete/r14-probelauf.json
//        [--nur-zeigen] [--pakete paket-2a,paket-2b] [--ohne-npm]
//        [--skript ~/.claude/skills/punkt-starten/punkt-starten.sh]
//
// Prüft die Liste (doppelte, unbekannte oder schon wirkende Tokens), dann
// je Paket: punkt-starten.sh <PUNKT> <id> WEBSITE26 (Worktree unter
// ~/Sites/_worktrees, Zweig punkt/<punkt>-<id>, eigene node_modules) und
// füllt die STAND.md mit Werten, Abnahme und Entscheidungen.
// Existiert schon ein Ordner oder Zweig, wird NICHTS angelegt.
// Franks Hauptcheckout wird nicht umgeschaltet (das Skript nutzt worktree add).
//
// Ausgang: 0 angelegt bzw. gezeigt · 1 Liste fehlerhaft oder schon angelegt
// · 2 Aufruf oder Anlegen gescheitert.
// ==========================================================================
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { parseArgs } from 'node:util'
import { fuelle, pruefeListe, ziel } from './lib/stand.mjs'

const WURZEL = path.resolve(import.meta.dirname, '../..')
const HAUPT = path.join(homedir(), 'Sites/WEBSITE26')

const { values: a, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    'nur-zeigen': { type: 'boolean', default: false },
    pakete: { type: 'string' },
    'ohne-npm': { type: 'boolean', default: false },
    skript: { type: 'string', default: path.join(homedir(), '.claude/skills/punkt-starten/punkt-starten.sh') },
  },
})

if (positionals.length !== 1) {
  console.error('Aufruf: npm run pakete:vorbereiten -- <liste.json> [--nur-zeigen] [--pakete a,b] [--ohne-npm]')
  process.exit(2)
}

const liste = JSON.parse(readFileSync(path.resolve(positionals[0]), 'utf8'))
const wirkung = JSON.parse(readFileSync(path.join(WURZEL, 'apps/theme-configurator/src/data/token-wirkung.json'), 'utf8')).tokens
const fehler = pruefeListe(liste, wirkung)
if (fehler.length) {
  console.error(`✗ Liste ${positionals[0]}:\n  ${fehler.join('\n  ')}`)
  process.exit(1)
}

let pakete = liste.pakete
if (a.pakete) {
  const wahl = a.pakete.split(',')
  const fremd = wahl.filter((id) => !pakete.some((p) => p.id === id))
  if (fremd.length) { console.error(`✗ Nicht in der Liste: ${fremd.join(', ')}`); process.exit(2) }
  pakete = pakete.filter((p) => wahl.includes(p.id))
}

// Erst alles prüfen, dann anlegen — kein halb angelegter Probelauf
const plan = pakete.map((p) => ({ paket: p, ...ziel(liste, p) }))
const belegt = plan.filter(({ ordner, zweig }) => existsSync(ordner) ||
  spawnSync('git', ['-C', HAUPT, 'show-ref', '--verify', '--quiet', `refs/heads/${zweig}`]).status === 0)

for (const { paket, ordner, zweig } of plan) {
  console.log(`${paket.id.padEnd(10)} ${String(paket.werte.length).padStart(2)} Werte  ${zweig}  ${ordner}`)
}
console.log(`${plan.length} Pakete, ${plan.reduce((s, x) => s + x.paket.werte.length, 0)} Werte`)

if (belegt.length) {
  console.error(`✗ Schon angelegt: ${belegt.map((b) => b.ordner).join(', ')} — STAND.md dort lesen, nichts angelegt.`)
  process.exit(1)
}
if (a['nur-zeigen']) process.exit(0)
if (!existsSync(a.skript)) { console.error(`✗ punkt-starten.sh nicht gefunden: ${a.skript}`); process.exit(2) }

for (const { paket, ordner } of plan) {
  console.log(`\n▸ ${paket.id}`)
  const r = spawnSync('bash', [a.skript, liste.punkt, paket.id, 'WEBSITE26', ...(a['ohne-npm'] ? ['--ohne-npm'] : [])], { stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8' })
  if (r.status !== 0) { console.error(`✗ punkt-starten.sh für ${paket.id}: Ausgang ${r.status}`); process.exit(2) }
  const datei = path.join(ordner, 'STAND.md')
  const basis = spawnSync('git', ['-C', ordner, 'log', '-1', '--format=main %h'], { encoding: 'utf8' }).stdout.trim()
  writeFileSync(datei, fuelle(readFileSync(datei, 'utf8'), paket, liste, { basis }))
  console.log(`✓ ${ordner} — STAND.md ausgefüllt (${paket.werte.length} Werte)`)
}
