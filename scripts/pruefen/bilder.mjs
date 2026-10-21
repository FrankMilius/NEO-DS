#!/usr/bin/env node
// ==========================================================================
// pruefen:bilder — Docker-Bildvergleich der Konfig-App (E3)
//
//   npm run pruefen:bilder [-- --bauen] [-- --aktualisieren]
//
// Prüft vorher, dass styles.css und der gebaute Konfigurator nicht älter
// sind als ihre Quellen (sonst vergleicht der Lauf eine alte Fassung) —
// --bauen baut dann selbst. Startet `npm run e2e:visuell` im Playwright-
// Abbild, weil die Referenzbilder nur für Linux versioniert sind
// (apps/theme-configurator/e2e/README.md). --aktualisieren schreibt die
// Referenzbilder neu (--update-snapshots=all).
//
// Ausgang: 0 alles bestanden · 1 Abweichung · 2 Bau, Docker oder Aufruf.
// Einstellungen: scripts/pruefen/einstellungen.json.
// ==========================================================================
import { spawn, spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { lade } from './lib/einstellungen.mjs'
import { bauVeraltet } from './lib/bau.mjs'
import { liesErgebnis, versionAusAbbild, dockerArgumente } from './lib/bilder.mjs'

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const app = path.join(wurzel, 'apps/theme-configurator')
const { values: a } = parseArgs({ options: { bauen: { type: 'boolean' }, aktualisieren: { type: 'boolean' } } })

function abbruch (...zeilen) {
  console.error(zeilen.join('\n'))
  process.exit(2)
}

const einst = lade()

if (!(wurzel + path.sep).startsWith(einst.dockerEinhaengen + path.sep)) {
  abbruch(`Der Worktree ${wurzel} liegt nicht unter dockerEinhaengen (${einst.dockerEinhaengen}) — im Container wäre er nicht zu sehen.`)
}

let appVersion
try {
  appVersion = createRequire(path.join(app, 'package.json'))('@playwright/test/package.json').version
} catch {
  abbruch('Playwright fehlt in apps/theme-configurator — erst `npm ci` dort.')
}
if (versionAusAbbild(einst.dockerAbbild) !== appVersion) {
  abbruch(`Abbild ${einst.dockerAbbild} passt nicht zu @playwright/test ${appVersion} der App — dockerAbbild in den Einstellungen anpassen.`)
}

let gruende = bauVeraltet(wurzel)
if (gruende.length && a.bauen) {
  for (const [befehl, ort] of [['build:css', wurzel], ['build', app]]) {
    console.error(`Baue: npm run ${befehl} (${path.relative(wurzel, ort) || '.'})`)
    if (spawnSync('npm', ['run', befehl], { cwd: ort, stdio: 'inherit' }).status !== 0) abbruch(`npm run ${befehl} ist fehlgeschlagen.`)
  }
  gruende = bauVeraltet(wurzel)
}
if (gruende.length) abbruch('Bau veraltet, Bildvergleich nicht gestartet:', ...gruende.map((g) => `  - ${g}`), 'Mit --bauen baut das Werkzeug selbst.')

if (spawnSync('docker', ['info'], { stdio: 'ignore' }).status !== 0) abbruch('Docker läuft nicht — Docker Desktop starten.')

console.error(`Bildvergleich im Abbild ${einst.dockerAbbild}${a.aktualisieren ? ' (Referenzbilder werden neu geschrieben)' : ''} …`)
const start = Date.now()
let ausgabe = ''
const kind = spawn('docker', dockerArgumente({ wurzel, einst, aktualisieren: a.aktualisieren }), { stdio: ['ignore', 'pipe', 'pipe'] })
kind.stdout.on('data', (d) => { ausgabe += d; process.stdout.write(d) })
kind.stderr.on('data', (d) => { ausgabe += d; process.stderr.write(d) })
const code = await new Promise((r) => kind.on('close', r))
const dauer = Math.round((Date.now() - start) / 1000)

const e = liesErgebnis(ausgabe)
if (!e) abbruch(`Bildvergleich ohne Ergebnis abgebrochen (docker-Ausgang ${code}).`)
console.log(`\nBildvergleich: ${e.passed} passed, ${e.failed} failed${e.flaky ? `, ${e.flaky} flaky` : ''}${e.skipped ? `, ${e.skipped} skipped` : ''} · Dauer ${Math.floor(dauer / 60)} min ${dauer % 60} s`)
if (e.failed) console.log('Bericht mit Diff-Bildern: apps/theme-configurator/playwright-report/index.html')
process.exit(e.failed || code !== 0 ? 1 : 0)
