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

function ausfuehren () {
  const text = readFileSync(WORKFLOW, 'utf8')
  const t0 = Date.now()
  let n = 0
  for (const job of jobs) {
    for (const s of schritte(text, job)) {
      if (!s.run) continue
      if (!args.has('--mit-ci') && /^npm ci$/.test(s.run)) continue
      if (/playwright install/.test(s.run)) continue
      const name = s.name || s.run.split('\n')[0]
      const cwd = path.join(wurzel, s['working-directory'] || '.')
      process.stdout.write(`\n▶ [${job}] ${name}\n`)
      const r = spawnSync('bash', ['-eo', 'pipefail', '-c', s.run], { cwd, stdio: 'inherit', env: { ...process.env, CI: '1' } })
      n++
      if (r.status !== 0) {
        console.error(`\n✗ [${job}] „${name}“ fehlgeschlagen (Exit ${r.status}). So scheitert auch GitHub.`)
        process.exit(r.status || 1)
      }
    }
  }
  console.log(`\n✓ ${n} Schritte aus ${path.relative(wurzel, WORKFLOW)} gruen (${jobs.join(', ')}, ${Math.round((Date.now() - t0) / 1000)} s).`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) ausfuehren()
