#!/usr/bin/env node
// ==========================================================================
// pruefen:modul — Konfig-App ins DRUPAL11-Modul übernehmen, Modul-e2e gegen
// DDEV laufen lassen, Test-Themes aufräumen (E3)
//
//   npm run pruefen:modul [-- --nur-zeigen]
//        [--drupal-zweig master] [--theme-zweig master]
//
// Vorab: styles.css aktuell, DRUPAL11 und neo_fe auf dem erwarteten Zweig
// (nur prüfen, nie umschalten — Entscheidung Frank 21.10.2026), DDEV
// erreichbar. Dann scripts/app-uebernehmen.sh des Moduls mit diesem
// Worktree, drush cr, Playwright in tests/e2e des Moduls. Danach — auch nach
// Fehlschlägen — Aufräumen: nur Themes „E2E …“/„UX-Audit …“ und die Vorschau
// des Testkontos (e2eKonto); „Kundentheme NEU“ bleibt immer.
// --nur-zeigen: nur Vorprüfung und was aufgeräumt würde, ohne Änderung.
//
// Ausgang: 0 bestanden · 1 Tests fehlgeschlagen · 2 Vorprüfung/Aufruf.
// Einstellungen: scripts/pruefen/einstellungen.json.
// ==========================================================================
import { execFileSync, spawn, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { lade } from './lib/einstellungen.mjs'
import { bauVeraltet } from './lib/bau.mjs'
import { liesErgebnis } from './lib/bilder.mjs'
import { waehleZumLoeschen, pruefeZweige, phpListe, phpLoeschen } from './lib/modul.mjs'

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const { values: a } = parseArgs({
  options: {
    'nur-zeigen': { type: 'boolean' },
    'drupal-zweig': { type: 'string', default: 'master' },
    'theme-zweig': { type: 'string', default: 'master' },
  },
})

function abbruch (...zeilen) {
  console.error(zeilen.join('\n'))
  process.exit(2)
}

const einst = lade()
const e2e = path.join(einst.modulPfad, 'tests/e2e')
const modulRel = path.relative(einst.drupalWurzel, einst.modulPfad)
const zweig = (p) => execFileSync('git', ['-C', p, 'branch', '--show-current'], { encoding: 'utf8' }).trim() || '(losgelöst)'
const gitStand = () => execFileSync('git', ['-C', einst.drupalWurzel, 'status', '--short', '--', modulRel], { encoding: 'utf8' }).trim()
const drushPhp = (code) => {
  const aus = execFileSync('ddev', ['drush', 'php:eval', code], { cwd: einst.drupalWurzel, encoding: 'utf8' })
  return JSON.parse(aus.trim().split('\n').pop())
}

// --- Vorprüfung ------------------------------------------------------------
const gruende = bauVeraltet(wurzel, { nurCss: true })
if (gruende.length) abbruch('Bau veraltet, Modul-e2e nicht gestartet:', ...gruende.map((g) => `  - ${g}`))
if (!existsSync(path.join(e2e, 'node_modules/.bin/playwright'))) abbruch(`Playwright fehlt in ${e2e} — dort erst npm ci (siehe README des Moduls).`)

const zweige = pruefeZweige(
  { drupal: zweig(einst.drupalWurzel), theme: zweig(einst.themePfad) },
  { drupal: a['drupal-zweig'], theme: a['theme-zweig'] },
  { drupal: einst.drupalWurzel, theme: einst.themePfad },
)
if (zweige.length) abbruch('Checkout passt nicht, Modul-e2e nicht gestartet:', ...zweige.map((z) => `  - ${z}`))

let vorher
try {
  vorher = drushPhp(phpListe(einst.e2eKonto))
} catch (e) {
  abbruch(`DDEV nicht erreichbar (ddev drush php:eval in ${einst.drupalWurzel}): ${e.message.split('\n')[0]}`)
}
if (vorher.uid === null) abbruch(`Testkonto „${einst.e2eKonto}“ fehlt in Drupal — anlegen siehe README des Moduls.`)

const zeigeThemes = (themes) => themes.map((t) => t.label).join(', ') || 'keine'
console.log(`Vorher: Themes ${zeigeThemes(vorher.themes)} · Vorschau ${einst.e2eKonto} (Nr. ${vorher.uid}): ${vorher.vorschau ? 'ja' : 'nein'}`)

if (a['nur-zeigen']) {
  console.log(`Würde löschen: ${zeigeThemes(waehleZumLoeschen(vorher.themes))}${vorher.vorschau ? ` und die Vorschau von ${einst.e2eKonto}` : ''}`)
  process.exit(0)
}

// --- Übernahme und Lauf ----------------------------------------------------
const gitVorher = gitStand()
const start = Date.now()
for (const [befehl, argumente, ort] of [
  ['bash', ['scripts/app-uebernehmen.sh', wurzel], einst.modulPfad],
  ['ddev', ['drush', 'cr'], einst.drupalWurzel],
]) {
  if (spawnSync(befehl, argumente, { cwd: ort, stdio: 'inherit' }).status !== 0) abbruch(`${befehl} ${argumente.join(' ')} ist fehlgeschlagen.`)
}

let ausgabe = ''
const kind = spawn('./node_modules/.bin/playwright', ['test', '-c', 'playwright.config.mjs'], { cwd: e2e, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, NEO_DRUPAL_URL: einst.ddevUrl } })
kind.stdout.on('data', (d) => { ausgabe += d; process.stdout.write(d) })
kind.stderr.on('data', (d) => { ausgabe += d; process.stderr.write(d) })
const code = await new Promise((r) => kind.on('close', r))
const dauer = Math.round((Date.now() - start) / 1000)
const ergebnis = liesErgebnis(ausgabe)

// --- Aufräumen, auch nach Fehlschlag ---------------------------------------
const zwischen = drushPhp(phpListe(einst.e2eKonto))
const weg = drushPhp(phpLoeschen(waehleZumLoeschen(zwischen.themes).map((t) => t.id), einst.e2eKonto))
const nachher = drushPhp(phpListe(einst.e2eKonto))
const gitNachher = gitStand()

console.log('')
console.log(ergebnis
  ? `Modul-e2e: ${ergebnis.passed} passed, ${ergebnis.failed} failed${ergebnis.flaky ? `, ${ergebnis.flaky} flaky` : ''}${ergebnis.skipped ? `, ${ergebnis.skipped} skipped` : ''} · Dauer ${Math.floor(dauer / 60)} min ${dauer % 60} s`
  : `Modul-e2e ohne Ergebnis abgebrochen (Ausgang ${code}).`)
console.log(`Aufgeräumt: ${weg.geloescht.join(', ') || 'keine Themes'}${weg.vorschau ? ` · Vorschau von ${einst.e2eKonto}` : ''}`)
console.log(`Behalten: ${zeigeThemes(nachher.themes)}`)
const uebrig = waehleZumLoeschen(nachher.themes)
if (uebrig.length) console.log(`Achtung, noch da: ${zeigeThemes(uebrig)}`)
console.log(`DRUPAL11 ${modulRel}: ${gitNachher === gitVorher ? 'git-Stand unverändert' : `git-Stand vorher\n${gitVorher || '  (sauber)'}\nnachher\n${gitNachher || '  (sauber)'}`}`)

process.exit(!ergebnis || uebrig.length ? 2 : ergebnis.failed || code !== 0 ? 1 : 0)
