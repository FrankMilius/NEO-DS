#!/usr/bin/env node
// ==========================================================================
// ci-lokal — fuehrt die Pruefschritte der GitHub-Workflows lokal aus
// ==========================================================================
// Anlass (05.10.2026): Lokal waren `npm test` und Vitest gruen, in GitHub
// scheiterten trotzdem „Typen (tsc)“ und „Docs-Seiten entstehen aus
// docs/content“ — beide Schritte liefen lokal nie. Damit Lokal und CI nicht
// wieder auseinanderlaufen, gibt es KEINE eigene Liste: das Skript liest die
// `run:`-Schritte direkt aus .github/workflows/theme-configurator.yml.
//
//   npm run ci:lokal               Jobs „tokens“ und „app“ (ohne Upload)
//   npm run ci:lokal -- --e2e      zusaetzlich Job „e2e“ (Playwright)
//   npm run ci:lokal -- --mit-ci   zusaetzlich `npm ci` (wie in GitHub)
//
// Uebersprungen werden Schritte mit `uses:` (Checkout, Node, Artefakte) und
// standardmaessig `npm ci` sowie `playwright install` (lokal vorhanden).
// Bricht beim ersten Fehler ab und nennt Job und Schritt wie in GitHub.
//
// Locally all jobs share ONE checkout (02.11.2026): `npm ci` is also dropped
// at the start of a chain (`npm ci && npm run build:css` in the e2e job used
// to reinstall the root node_modules on every run), and a step identical to
// one that already ran (same command, same directory) runs only once — in
// GitHub every job starts on a fresh machine, here nothing was undone.
// ==========================================================================

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const WORKFLOW = path.join(wurzel, '.github/workflows/theme-configurator.yml')
const args = new Set(process.argv.slice(2))
const jobs = ['tokens', 'app', ...(args.has('--e2e') ? ['e2e'] : [])]

/**
 * Liest die Schritte eines Jobs aus dem Workflow (nur das Format dieser Datei:
 * Jobs mit 2 Leerzeichen Einzug, Schritte als `- name/run/uses`, mehrzeilige
 * `run: |`-Bloecke, `working-directory`).
 * @param {string} text
 * @param {string} job
 */
export function schritte (text, job) {
  const zeilen = text.split('\n')
  const start = zeilen.findIndex((z) => z === `  ${job}:`)
  if (start < 0) throw new Error(`Job „${job}“ fehlt in ${WORKFLOW}`)
  const ende = zeilen.findIndex((z, i) => i > start && /^ {2}\S/.test(z))
  const block = zeilen.slice(start + 1, ende < 0 ? undefined : ende)
  const liste = []
  let akt = null
  for (let i = 0; i < block.length; i++) {
    const z = block[i]
    const neu = z.match(/^ {6}- (\w[\w-]*):\s*(.*)$/)
    const feld = neu || z.match(/^ {8}(\w[\w-]*):\s*(.*)$/)
    if (neu) { akt = {}; liste.push(akt) }
    if (!feld || !akt) continue
    const [, schluessel, wert] = feld
    if (schluessel === 'run' && wert === '|') {
      const teile = []
      while (i + 1 < block.length && (/^ {10}/.test(block[i + 1]) || block[i + 1].trim() === '')) {
        teile.push(block[++i].slice(10))
      }
      akt.run = teile.join('\n').trim()
    } else {
      akt[schluessel] = wert.replace(/^['"]|['"]$/g, '')
    }
  }
  return liste
}

/**
 * Local run plan: the workflow steps of the given jobs, each marked `weg`
 * (reason) when it does not run locally.
 * @param {string} text
 * @param {string[]} jobListe
 * @param {{ mitCi: boolean }} opt
 */
export function lokalerPlan (text, jobListe, { mitCi }) {
  const gelaufen = new Set()
  const plan = []
  for (const job of jobListe) {
    for (const s of schritte(text, job)) {
      if (!s.run) continue
      let run = s.run
      if (!mitCi) run = run.replace(/^npm ci\s*&&\s*/, '')
      const cwd = s['working-directory'] || '.'
      const name = s.name || s.run.split('\n')[0]
      const eintrag = { job, name, run, cwd, weg: null }
      if (!mitCi && /^npm ci$/.test(run)) eintrag.weg = 'npm ci (lokal vorhanden)'
      else if (/playwright install/.test(run)) eintrag.weg = 'playwright install (lokal vorhanden)'
      else if (gelaufen.has(`${cwd}\0${run}`)) eintrag.weg = 'schon gelaufen'
      else gelaufen.add(`${cwd}\0${run}`)
      plan.push(eintrag)
    }
  }
  return plan
}

function ausfuehren () {
  const text = readFileSync(WORKFLOW, 'utf8')
  const t0 = Date.now()
  let n = 0
  for (const s of lokalerPlan(text, jobs, { mitCi: args.has('--mit-ci') })) {
    if (s.weg) {
      if (s.weg === 'schon gelaufen') process.stdout.write(`\n· [${s.job}] ${s.name} — schon gelaufen\n`)
      continue
    }
    process.stdout.write(`\n▶ [${s.job}] ${s.name}\n`)
    const r = spawnSync('bash', ['-eo', 'pipefail', '-c', s.run], { cwd: path.join(wurzel, s.cwd), stdio: 'inherit', env: { ...process.env, CI: '1' } })
    n++
    if (r.status !== 0) {
      console.error(`\n✗ [${s.job}] „${s.name}“ fehlgeschlagen (Exit ${r.status}). So scheitert auch GitHub.`)
      process.exit(r.status || 1)
    }
  }
  console.log(`\n✓ ${n} Schritte aus ${path.relative(wurzel, WORKFLOW)} gruen (${jobs.join(', ')}, ${Math.round((Date.now() - t0) / 1000)} s).`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) ausfuehren()
