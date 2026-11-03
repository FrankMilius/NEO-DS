// ci-lokal liest die Schritte aus dem Workflow — dieser Test stellt sicher,
// dass der Leser die Datei noch versteht (sonst liefe lokal still weniger als
// in GitHub). Anlass: 05.10.2026, typecheck und Docs-Pruefung liefen lokal nie.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { schritte, lokalerPlan } from '../scripts/ci-lokal.mjs'

const text = readFileSync(new URL('../.github/workflows/theme-configurator.yml', import.meta.url), 'utf8')

describe('ci-lokal: Schritte aus theme-configurator.yml', () => {
  it('Job tokens enthaelt alle run-Schritte, auch mehrzeilige', () => {
    const runs = schritte(text, 'tokens').filter((s) => s.run).map((s) => s.run)
    const imWorkflow = text.split('\n  app:')[0].split('\n  tokens:')[1].match(/^ {6}- run:|^ {8}run:/gm).length
    expect(runs.length).toBe(imWorkflow)
    expect(runs).toContain('node scripts/build-docs.cjs --check')
    expect(runs).toContain('npm run specs:pruefen')
    expect(runs).toContain('npm run registry:pruefen')
    expect(runs).toContain('npm run components:pruefen')
    expect(runs.some((r) => r.includes('generate-tokens.cjs') && r.includes('git diff'))).toBe(true)
  })

  it('Job app enthaelt Lint, Typen, Tests und Build mit Arbeitsverzeichnis', () => {
    const app = schritte(text, 'app').filter((s) => s.run)
    const typen = app.find((s) => s.run === 'npm run typecheck')
    expect(typen?.['working-directory']).toBe('apps/theme-configurator')
    for (const r of ['npm run lint', 'npx vitest run', 'npx vite build']) {
      expect(app.map((s) => s.run)).toContain(r)
    }
  })

  it('unbekannter Job meldet sich laut', () => {
    expect(() => schritte(text, 'gibt-es-nicht')).toThrow(/fehlt/)
  })

  // 02.11.2026: Locally all jobs share one checkout. Before, every
  // `ci:lokal --e2e` reinstalled the root node_modules (`npm ci && …` in the
  // e2e job slipped past the `^npm ci$` filter) and built styles.css three times.
  it('lokal: npm ci auch in Verkettungen weg, gleiche Schritte nur einmal', () => {
    const plan = lokalerPlan(text, ['tokens', 'app', 'e2e'], { mitCi: false })
    const laeuft = plan.filter((s) => !s.weg)
    expect(laeuft.some((s) => /(^|&&\s*)npm ci(\s|$)/.test(s.run))).toBe(false)
    expect(laeuft.filter((s) => s.run === 'npm run build:css' && s.cwd === '.')).toHaveLength(1)
    expect(plan.find((s) => s.job === 'e2e' && s.weg === 'schon gelaufen')?.run).toBe('npm run build:css')
    const schluessel = laeuft.map((s) => `${s.cwd}\0${s.run}`)
    expect(new Set(schluessel).size).toBe(schluessel.length)
    for (const r of ['npx vitest run', 'npm run e2e', 'npm run typecheck']) expect(laeuft.map((s) => s.run)).toContain(r)
  })

  it('mit --mit-ci: npm ci bleibt wie in GitHub', () => {
    const plan = lokalerPlan(text, ['tokens', 'app', 'e2e'], { mitCi: true })
    expect(plan.filter((s) => !s.weg).some((s) => /^npm ci/.test(s.run))).toBe(true)
  })
})
