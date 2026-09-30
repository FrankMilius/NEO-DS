// Form des Generats tokens.generated.js (Befund 30.09.2026): neutralPalette
// kam ohne Stufen an, weil der Generator noch die alte Form p.neutral las.
// Vier Editoren (Icons, Fokus-Ring, Farben, Komponenten) brachen daran ab.
import { describe, it, expect } from 'vitest'
import * as G from '../../src/data/tokens.generated.js'

const PALETTEN = ['primitiveColors', 'supportingPalettes', 'foundationPalettes', 'neutralPalette', 'systemPalettes']

describe('Generat: jede Palette hat Stufen', () => {
  for (const name of PALETTEN) {
    it(name, () => {
      const gruppe = G[name]
      expect(gruppe, name).toBeTruthy()
      expect(Object.keys(gruppe).length, name).toBeGreaterThan(0)
      for (const [id, pal] of Object.entries(gruppe)) {
        expect(pal?.shades, `${name}.${id}.shades`).toBeTypeOf('object')
        expect(Object.keys(pal.shades).length, `${name}.${id}`).toBeGreaterThan(0)
      }
    })
  }
})
