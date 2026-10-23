// Hinweis „wirkt derzeit nicht“ aus der Wirkungsprüfung (R12, 20.10.2026)
import { describe, it, expect } from 'vitest'
import { wirkungsHinweis } from '../../src/utils/token-wirkung.js'
import messung from '../../src/data/token-wirkung.json'

const erstes = (art) => Object.keys(messung.tokens).find((id) => messung.tokens[id] === art)

describe('wirkungsHinweis', () => {
  it('nennt Tokens ohne Wirkung und unbenutzte, sonst nichts', () => {
    expect(wirkungsHinweis(erstes('ohne-wirkung'))).toMatch(/keine Wirkung/)
    expect(wirkungsHinweis(erstes('unbenutzt'))).toMatch(/nirgends/)
    for (const art of ['wirkt', 'zustand', 'ohne-pruefwert', 'ohne-buehne', 'bewusst']) expect(wirkungsHinweis(erstes(art))).toBeNull()
    expect(wirkungsHinweis('gibt-es-nicht')).toBeNull()
  })
  it('die heute reparierten Werte gelten als wirksam', () => {
    for (const id of ['nc-button-gap', 'nc-button-font-family', 'nc-chip-font-family', 'nc-input-font-family']) expect(messung.tokens[id]).toBe('wirkt')
  })
  it('Zählung passt zu den Einträgen', () => {
    const n = Object.values(messung.zaehlung).reduce((a, b) => a + b, 0)
    expect(n).toBe(Object.keys(messung.tokens).length)
  })
})
