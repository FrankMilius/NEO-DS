// Docker-Bildvergleich der Konfig-App (pruefen:bilder): Ergebnis aus der
// Playwright-Ausgabe lesen, Abbild-Version gegen @playwright/test prüfen,
// docker-Aufruf aus den Einstellungen bauen (bisher von Hand aus LIESMICH).
import { describe, it, expect } from 'vitest'
import { liesErgebnis, versionAusAbbild, dockerArgumente } from '../../scripts/pruefen/lib/bilder.mjs'
import { lade } from '../../scripts/pruefen/lib/einstellungen.mjs'

const einst = lade({ lokal: false })

describe('pruefen: Bildvergleich — Ergebnis lesen', () => {
  it('nur bestanden', () => {
    expect(liesErgebnis('Running 28 tests using 4 workers\n\n  28 passed (41.2s)\n')).toEqual({ passed: 28, failed: 0, flaky: 0, skipped: 0 })
  })

  it('gemischt, mit Farbcodes', () => {
    const text = '\u001b[31m  2 failed\u001b[39m\n    [visuell] › e2e/arenen.visuell.spec.js:12:3 › Arena Button\n\u001b[33m  1 flaky\u001b[39m\n\u001b[32m  25 passed\u001b[39m (1.1m)\n  1 skipped\n'
    expect(liesErgebnis(text)).toEqual({ passed: 25, failed: 2, flaky: 1, skipped: 1 })
  })

  it('ohne Zusammenfassung → null (Lauf ist vorher abgebrochen)', () => {
    expect(liesErgebnis('npm ERR! code ENOENT\n')).toBeNull()
  })
})

describe('pruefen: Bildvergleich — Abbild und Aufruf', () => {
  it('liest die Playwright-Version aus dem Abbildnamen', () => {
    expect(versionAusAbbild('mcr.microsoft.com/playwright:v1.64.1-noble')).toBe('1.64.1')
    expect(versionAusAbbild('ubuntu:24.04')).toBeNull()
  })

  it('das eingestellte Abbild passt zu @playwright/test der App', async () => {
    const { createRequire } = await import('node:module')
    const app = createRequire(new URL('../../apps/theme-configurator/package.json', import.meta.url))
    expect(versionAusAbbild(einst.dockerAbbild)).toBe(app('@playwright/test/package.json').version)
  })

  it('baut den docker-Aufruf aus den Einstellungen', () => {
    const w = '/Users/x/Sites/_worktrees/W'
    const a = dockerArgumente({ wurzel: w, einst: { ...einst, dockerEinhaengen: '/Users/x/Sites' } })
    expect(a.slice(0, 3)).toEqual(['run', '--rm', '--ipc=host'])
    expect(a).toContain('/Users/x/Sites:/Users/x/Sites')
    expect(a).toContain(`${einst.dockerVolumes.wurzel}:${w}/node_modules`)
    expect(a).toContain(`${einst.dockerVolumes.app}:${w}/apps/theme-configurator/node_modules`)
    expect(a[a.indexOf('-w') + 1]).toBe(w)
    expect(a).toContain(einst.dockerAbbild)
    expect(a.at(-1)).toMatch(/npm run e2e:visuell$/)
  })

  it('--aktualisieren reicht --update-snapshots=all durch', () => {
    const a = dockerArgumente({ wurzel: '/w', einst, aktualisieren: true })
    expect(a.at(-1)).toMatch(/npm run e2e:visuell -- --update-snapshots=all$/)
  })

  it('ein fehlgeschlagenes npm ci im Container wird gemeldet, nicht verschluckt', () => {
    const skript = dockerArgumente({ wurzel: '/w', einst }).at(-1)
    expect(skript).toMatch(/npm ci[^;]*\|\| \{ echo "npm ci \(Wurzel\) fehlgeschlagen"/)
    expect(skript).toMatch(/npm ci[^;]*\|\| \{ echo "npm ci \(App\) fehlgeschlagen"/)
  })
})
