import { describe, it, expect } from 'vitest'
import { kontrastVerhaeltnis, pruefeKontrast, KONTRAST_PAARE } from '../../src/speicher/kontrast.js'
import { semanticDefaults } from '../../src/data/tokens.js'

describe('Kontrast-Pruefung (Tor vor dem Veroeffentlichen)', () => {
  it('rechnet WCAG-Verhaeltnisse', () => {
    expect(kontrastVerhaeltnis('#000000', '#ffffff')).toBeCloseTo(21, 5)
    expect(kontrastVerhaeltnis('#fff', '#ffffff')).toBeCloseTo(1, 5)
    expect(kontrastVerhaeltnis('rgba(0,0,0,.5)', '#fff')).toBeNull()
  })

  it('nicht bewertbare Werte zaehlen nicht als bestanden', () => {
    const erg = pruefeKontrast({ light: { 'text-primary': 'var(--x)', 'background-base': '#fff' }, dark: {} })
    expect(erg.ergebnisse[0].bestanden).toBeNull()
    expect(erg.bestanden).toBe(false)
  })

  it('alle Paare gibt es als semantische Tokens', () => {
    const namen = new Set(Object.keys(semanticDefaults['customer-light']))
    for (const [vg, hg] of KONTRAST_PAARE) {
      expect(namen.has(vg), vg).toBe(true)
      expect(namen.has(hg), hg).toBe(true)
    }
  })

  // Befund 30.09.2026 (ADR-002): im hellen Modus erreichen on-danger und
  // on-success nur 3,35:1. Aendert das Design System die Werte, schlaegt
  // dieser Test fehl — dann die Liste hier leeren.
  it('NEO-Standard: nur die bekannten Befunde fallen durch', () => {
    for (const set of ['neo', 'customer']) {
      const erg = pruefeKontrast({ light: semanticDefaults[`${set}-light`], dark: semanticDefaults[`${set}-dark`] })
      const durchgefallen = erg.ergebnisse.filter(e => e.bestanden !== true)
        .map(e => `${e.modus}:${e.vordergrund}/${e.hintergrund}`)
      expect(durchgefallen, set).toEqual(['light:on-danger/feedback-danger', 'light:on-success/feedback-success'])
    }
  })
})
