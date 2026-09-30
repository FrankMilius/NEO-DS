// Werkseinstellung (Plan v2, Schritt 2.1 · 30.09.2026)
//
// "Reset to Defaults" laedt data/neo-theme-defaults/neo-theme-defaults.json.
// Bis zum 30.09. setzte die Datei Primary #002049 und Secondary #009fe3 — die
// alte Marke — als Overrides, weil ihr Generator unter Node nicht lief. Diese
// Tests halten fest, dass die Werkseinstellung dieselbe Quelle zeigt wie die
// App beim ersten Start.
import { describe, it, expect } from 'vitest'
import werk from '../../../../data/neo-theme-defaults/neo-theme-defaults.json'
import { primitiveColors, semanticDefaults, foundationTokens } from '../../src/data/tokens.generated.js'

const basen = {
  primary: primitiveColors.primary.base,
  secondary: primitiveColors.secondary.base,
  accent: primitiveColors.accent.base,
}

describe('Werkseinstellung = Quelle', () => {
  it('Primitive-Overrides sind die Basen der Quelle (Graphit, Lime)', () => {
    expect(werk.primitiveOverrides.neo).toEqual(basen)
    expect(werk.primitiveOverrides.customer).toEqual(basen)
    expect(werk.primitiveOverrides.neo.primary).not.toBe('#002049')
    expect(werk.primitiveOverrides.neo.secondary).not.toBe('#009fe3')
  })

  it('Themen sind die semantischen Vorgaben der Quelle', () => {
    expect(werk.themes.neo.light).toEqual(semanticDefaults['neo-light'])
    expect(werk.themes.neo.dark).toEqual(semanticDefaults['neo-dark'])
    expect(werk.themes.customer.light).toEqual(semanticDefaults['customer-light'])
    expect(werk.themes.customer.dark).toEqual(semanticDefaults['customer-dark'])
  })

  it('Foundation-Vorgaben entsprechen den Konfigurator-Tokens', () => {
    for (const [kat, daten] of Object.entries(foundationTokens)) {
      if (!daten?.tokens) continue
      for (const [key, t] of Object.entries(daten.tokens)) {
        expect(werk.foundationOverrides.neo[kat][key], `${kat}.${key}`).toEqual(t.value)
      }
    }
  })
})
