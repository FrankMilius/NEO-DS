// ci-lokal liest die Schritte aus dem Workflow — dieser Test stellt sicher,
// dass der Leser die Datei noch versteht (sonst liefe lokal still weniger als
// in GitHub). Anlass: 05.10.2026, typecheck und Docs-Pruefung liefen lokal nie.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { schritte } from '../scripts/ci-lokal.mjs'

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
})
