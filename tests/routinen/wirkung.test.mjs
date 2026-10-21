// Routinen (E8): Ausgabe der Wirkungs-Ratsche lesen.
import { describe, it, expect } from 'vitest'
import { ratsche, schwanz } from '../../scripts/routinen/lib/wirkung.mjs'

const KOPF = 'Wirkungsprüfung: 2661 Tokens — wirkt 1751, zustand 182\n'

describe('ratsche', () => {
  it('gut, mit Verbesserungen', () => {
    const r = ratsche(KOPF + '  Besser geworden (3), mit `node scripts/wirkung.mjs --setzen` festschreiben:\n    a: x → y\n  ✓ nichts schlechter als der festgeschriebene Stand\n', 0)
    expect(r).toEqual({ urteil: 'gut', zeile: KOPF.trim(), anzahl: 0, schlechter: [], besser: 3 })
  })
  it('schlechter: Liste der Tokens', () => {
    const r = ratsche(KOPF + '✗ 2 Token(s) schlechter als der festgeschriebene Stand:\n    --nc-a: wirkt → unbenutzt\n    --nc-b: neu und ohne-wirkung\n', 1)
    expect(r.urteil).toBe('schlechter')
    expect(r.schlechter).toEqual(['--nc-a: wirkt → unbenutzt', '--nc-b: neu und ohne-wirkung'])
    expect(r.anzahl).toBe(2)
  })
  it('schlechter: Zahl aus der Kopfzeile, auch bei Tabulator-Einrückung', () => {
    const r = ratsche(KOPF + '✗ 2 Token(s) schlechter als der festgeschriebene Stand:\n\t--nc-a: x\n\t--nc-b: y\n', 1)
    expect(r.anzahl).toBe(2)
    expect(r.schlechter).toHaveLength(2)
  })
  it('abgebrochen: Playwright rot oder keine Messung', () => {
    expect(ratsche('✗ Keine Messung in wirkung-ergebnis/', 1).urteil).toBe('abgebrochen')
    expect(ratsche(KOPF + '  ✓ nichts schlechter als der festgeschriebene Stand\n', 1).urteil).toBe('abgebrochen')
  })
})

describe('schwanz', () => {
  it('letzte n Zeilen', () => {
    expect(schwanz('a\nb\nc\n', 2)).toBe('b\nc')
  })
})
