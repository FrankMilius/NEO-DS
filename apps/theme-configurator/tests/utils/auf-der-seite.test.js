// Schritt f (19.10.2026): „Auf der Seite“ ordnet gemessene Werte Tokens zu
import { describe, it, expect } from 'vitest'
import { passendeLaenge, KATEGORIE_JE_BEREICH } from '../../src/utils/auf-der-seite.js'
import { foundationTokens } from '../../src/data/tokens.js'

describe('auf-der-seite', () => {
  const toks = [{ name: 'sm', label: 'SM', wert: 4 }, { name: 'md', label: 'MD', wert: 6 }]
  it('Länge passt auf ±0,5 px, sonst kein Token', () => {
    expect(passendeLaenge(4.3, toks)?.name).toBe('sm')
    expect(passendeLaenge(5, toks)).toBeNull()
    expect(passendeLaenge(0, toks)).toBeNull()
  })
  it('jede Kategorie mit Token-Liste gibt es in den Grundlagen', () => {
    for (const k of ['radius', 'spacing', 'size', 'border', 'shadow', 'opacity']) {
      expect(Object.values(KATEGORIE_JE_BEREICH)).toContain(k)
      expect(Object.keys(foundationTokens[k]?.tokens || {}).length, k).toBeGreaterThan(0)
    }
  })
})
