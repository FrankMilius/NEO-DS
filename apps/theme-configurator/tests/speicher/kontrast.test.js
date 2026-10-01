import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { kontrastVerhaeltnis, pruefeKontrast, KONTRAST_PAARE, KONTRAST_VERFAHREN } from '../../src/speicher/kontrast.js'
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

  // Plan v2, 2.6: Die Paarliste liegt als JSON fuer App UND PHP-Server vor
  // (data/kontrast-paare.json). Beide muessen identisch pruefen.
  it('Paarliste aus data/kontrast-paare.json ist dieselbe, die die App prueft', () => {
    const datei = JSON.parse(readFileSync(resolve(__dirname, '../../../../data/kontrast-paare.json'), 'utf8'))
    const ausDatei = datei.paare.map(p => [p.vordergrund, p.hintergrund, p.mindestens])
    expect(KONTRAST_PAARE).toEqual(ausDatei)
    expect(KONTRAST_VERFAHREN).toBe(datei._meta.verfahren)
    expect(datei._meta.modi).toEqual(['light', 'dark'])
    for (const p of datei.paare) {
      expect(Object.keys(p).sort()).toEqual(['hintergrund', 'mindestens', 'vordergrund'])
      expect([3, 4.5]).toContain(p.mindestens)
    }
    for (const set of ['neo', 'customer']) {
      const themes = { light: semanticDefaults[`${set}-light`], dark: semanticDefaults[`${set}-dark`] }
      const a = pruefeKontrast(themes)
      const b = pruefeKontrast(themes, ausDatei)
      expect(a.ergebnisse).toEqual(b.ergebnisse)
      expect(a.bestanden).toBe(b.bestanden)
    }
  })
})
