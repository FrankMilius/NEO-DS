// Fertig-Gate (E4): Auswahl der Prüfungen nach geänderten Dateien, Kennzahlen
// aus den Ausgaben, Gesamturteil mit Haltepunkt „Website-Unterschiede“.
import { describe, it, expect } from 'vitest'
import { waehle, kennzahl, urteil, PRUEFUNGEN } from '../../scripts/pruefen/lib/auswahl.mjs'

describe('waehle', () => {
  it('nur Text (.claude, docs, md): nur npm test', () => {
    expect(waehle(['.claude/skills/phase/SKILL.md', 'docs/x.md', 'README.md']).pruefungen).toEqual(['test'])
  })
  it('SCSS: alle fünf — Pixel, Bilder, CI, Modul', () => {
    const { pruefungen, gruende } = waehle(['scss/scss/05-atoms/_button.scss'])
    expect(pruefungen).toEqual(PRUEFUNGEN)
    expect(gruende.pixel).toBe('scss/scss/05-atoms/_button.scss')
  })
  it('Token-Quelle und Recipes zählen wie SCSS', () => {
    expect(waehle(['data/design-tokens.json']).pruefungen).toContain('pixel')
    expect(waehle(['data/button-recipe.json']).pruefungen).toContain('pixel')
  })
  it('App: CI, Bilder, Modul — kein Pixelvergleich der Website', () => {
    expect(waehle(['apps/theme-configurator/src/main.js']).pruefungen).toEqual(['test', 'ci', 'bilder', 'modul'])
  })
  it('Skripte: CI, aber keine Website- oder App-Prüfung', () => {
    expect(waehle(['scripts/pruefen/pixel.mjs', 'package.json']).pruefungen).toEqual(['test', 'ci'])
  })
  it('Grund nennt erste Datei und Anzahl weiterer', () => {
    expect(waehle(['scss/a.scss', 'scss/b.scss', 'scss/c.scss']).gruende.pixel).toBe('scss/a.scss (+2)')
  })
  it('Generator, Lockfile und styles.css zählen wie SCSS; .md überall als Text', () => {
    for (const d of ['scripts/generate-tokens.cjs', 'package-lock.json', 'styles.css']) expect(waehle([d]).pruefungen).toContain('pixel')
    expect(waehle(['scripts/pruefen/README.md', 'apps/theme-configurator/README.md', 'scss/scss/TYPOGRAPHY-AUDIT.md']).pruefungen).toEqual(['test'])
  })
  it('npm test ist nicht abwählbar', () => {
    expect(() => waehle(['README.md'], { ohne: ['test'] })).toThrow(/immer/)
  })
  it('--alle und --ohne', () => {
    expect(waehle([], { alle: true }).pruefungen).toEqual(PRUEFUNGEN)
    expect(waehle(['scss/a.scss'], { ohne: ['modul', 'bilder'] }).pruefungen).toEqual(['test', 'ci', 'pixel'])
  })
})

describe('kennzahl', () => {
  it('Vitest, CI, Playwright, Pixel', () => {
    expect(kennzahl('test', ' Test Files  33 passed (33)\n      Tests  202 passed (202)\n')).toBe('Tests 202 passed (202)')
    expect(kennzahl('ci', '  228 passed (2.8m)\n\n✓ 25 Schritte aus .github/workflows/theme-configurator.yml gruen (tokens, app, e2e, 263 s).')).toBe('25 Schritte aus .github/workflows/theme-configurator.yml gruen (tokens, app, e2e, 263 s).')
    expect(kennzahl('bilder', '\x1b[32m  28 passed (26s)\x1b[0m')).toBe('28 passed (26s)')
    expect(kennzahl('modul', '  1 failed\n  1 flaky\n  26 passed (1.0m)')).toBe('1 failed · 1 flaky · 26 passed (1.0m)')
    expect(kennzahl('modul', '27 passed, 0 failed · Dauer 1 min 27 s')).toBe('27 passed, 0 failed · Dauer 1 min 27 s')
    expect(kennzahl('pixel', '1280 Seiten mit Unterschied: 0 von 71\n  unklar    /produkte/workplace  Unterschied 1 · Rauschen 2\n')).toBe('Seiten mit Unterschied 1280: 0 von 71 · unklar 1')
    expect(kennzahl('pixel', '1280 Seiten mit Unterschied: 0 von 71\n390 Seiten mit Unterschied: 2 von 71\n')).toBe('Seiten mit Unterschied 1280: 0 von 71 · 390: 2 von 71')
  })
  it('CI rot: gescheiterter Schritt statt „passed“', () => {
    expect(kennzahl('ci', '      Tests  1 failed | 2869 passed (2870)\n✗ [app] „Unit- und Komponententests“ fehlgeschlagen (Exit 1). So scheitert auch GitHub.')).toBe('rot in [app] „Unit- und Komponententests“ — 1 failed | 2869 passed (2870)')
  })
  it('CI rot im e2e: Zahl der gescheiterten Playwright-Tests', () => {
    expect(kennzahl('ci', '  1 failed\n  227 passed (2.8m)\n✗ [e2e] „E2E (Smoke, Ablaeufe, axe)“ fehlgeschlagen (Exit 1).')).toBe('rot in [e2e] „E2E (Smoke, Ablaeufe, axe)“ — 1 failed')
  })
  it('nichts Erkennbares: null', () => {
    expect(kennzahl('test', 'Fehler beim Start')).toBeNull()
  })
})

describe('urteil', () => {
  it('grün nur, wenn alle Ausgänge 0', () => {
    expect(urteil({ test: { ausgang: 0 }, ci: { ausgang: 0 } })).toEqual({ gruen: true, rot: [], haltepunkt: false })
    expect(urteil({ test: { ausgang: 0 }, bilder: { ausgang: 2 } }).rot).toEqual(['bilder'])
  })
  it('Haltepunkt nach Befund: Ausgang 1, Unterschiede trotz Ausgang 2, unklare Seiten', () => {
    expect(urteil({ pixel: { ausgang: 1 } }).haltepunkt).toBe(true)
    expect(urteil({ pixel: { ausgang: 2, kennzahl: 'Seiten mit Unterschied 1280: 3 von 71 · 390: 0 von 71' } }).haltepunkt).toBe(true)
    expect(urteil({ pixel: { ausgang: 1, kennzahl: 'Seiten mit Unterschied 1280: 0 von 71 · unklar 1' } }).haltepunkt).toBe(true)
    expect(urteil({ pixel: { ausgang: 2, kennzahl: 'Seiten mit Unterschied 1280: 0 von 71' } }).haltepunkt).toBe(false)
    expect(urteil({ pixel: { ausgang: 0, kennzahl: 'styles.css byte-gleich mit neo_fe — kein Unterschied möglich, nicht gemessen' } }).haltepunkt).toBe(false)
  })
})
