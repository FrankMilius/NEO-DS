// Ratsche der Wirkungsprüfung: Zustand „bewusst“ (Entscheidung Frank,
// 23.10.2026, R14 Paket 3a). nc-textarea-resize (E3) und
// nc-hero-cards-rule-color (V09) bleiben absichtlich ohne Wirkung und zählen
// nicht als Mangel — nur diese feste Liste, kein Muster. Nachbesserung 3a
// (Frank, 23.10.2026): dazu nc-shell-sidebar-right-width, -narrow, -wide
// (Website ohne rechte Seitenleiste).
import { describe, it, expect } from 'vitest'
import { auswerten, BEWUSST, RANG, TOT } from '../../scripts/wirkung.mjs'
import messung from '../../src/data/token-wirkung.json'

const gruppe = (id, tokens) => ({ id, tokens: tokens.map((t) => ({ id: t })) })

describe('Wirkungsprüfung: bewusst ohne Wirkung', () => {
  it('feste Liste mit genau den fünf entschiedenen Werten', () => {
    expect([...BEWUSST].sort()).toEqual([
      'nc-hero-cards-rule-color',
      'nc-shell-sidebar-right-width',
      'nc-shell-sidebar-right-width-narrow',
      'nc-shell-sidebar-right-width-wide',
      'nc-textarea-resize'
    ])
  })

  it('nc-shell-sidebar-right-width-standard gehört nicht dazu (kein Muster)', () => {
    expect(BEWUSST.has('nc-shell-sidebar-right-width-standard')).toBe(false)
  })

  it('kein Mangel: nicht in TOT, Rang wie zustand', () => {
    expect(TOT.has('bewusst')).toBe(false)
    expect(RANG.bewusst).toBe(RANG.zustand)
    expect(RANG.bewusst).toBeLessThan(RANG['ohne-wirkung'])
  })

  it('ohne Wirkung gemessen → bewusst; andere Werte bleiben ohne-wirkung', () => {
    const g = [gruppe('textarea', ['nc-textarea-resize', 'nc-textarea-anders']), gruppe('hero', ['nc-hero-cards-rule-color'])]
    const art = auswerten({ textarea: { ergebnis: { 'nc-textarea-resize': 0, 'nc-textarea-anders': 0 } }, hero: { ergebnis: { 'nc-hero-cards-rule-color': 'unbenutzt' } } }, g)
    expect(art).toEqual({ 'nc-hero-cards-rule-color': 'bewusst', 'nc-textarea-anders': 'ohne-wirkung', 'nc-textarea-resize': 'bewusst' })
  })

  it('wirkt einer doch, bleibt es bei wirkt (beste Messung zählt)', () => {
    const g = [gruppe('a', ['nc-textarea-resize']), gruppe('b', ['nc-textarea-resize'])]
    expect(auswerten({ a: { ergebnis: { 'nc-textarea-resize': 0 } }, b: { ergebnis: { 'nc-textarea-resize': 3 } } }, g)['nc-textarea-resize']).toBe('wirkt')
  })

  it('festgeschriebener Stand führt alle als bewusst', () => {
    for (const id of BEWUSST) expect(messung.tokens[id]).toBe('bewusst')
    expect(messung.zaehlung.bewusst).toBe(BEWUSST.size)
  })
})
