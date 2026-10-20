/**
 * Erlaubte Bereiche am Feld (R06): Hinweis und Prüfung aus einer Quelle.
 */
import { describe, it, expect } from 'vitest'
import { erlaubterBereich, pruefeFoundationWert, pruefeKomponentenWert, pruefeSchriftskala } from '../../src/utils/token-pruefung.js'

describe('erlaubterBereich', () => {
  it('nennt die Bereiche, die die Prüfung erzwingt', () => {
    expect(erlaubterBereich('opacity')).toBe('0 bis 1, z. B. 0.5')
    expect(pruefeFoundationWert('opacity', 'disabled', 1.2)).toMatch(/0 und 1/)
    expect(erlaubterBereich('zindex')).toMatch(/−1 bis 99999/)
    expect(pruefeFoundationWert('zindex', 'modal', 100000)).toMatch(/-1 und 99999/)
    expect(erlaubterBereich('komponente', 'nc-grid-columns')).toBe('ganze Zahlen von 1 bis 24')
    expect(pruefeKomponentenWert('nc-grid-columns', '25')).toMatch(/1 und 24/)
    expect(erlaubterBereich('schriftskala', 'base_min_px')).toBe('10 bis 32 px')
    expect(pruefeSchriftskala('base_min_px', 40)).toMatch(/10 bis 32 px/)
    expect(erlaubterBereich('schriftskala', 'ratio_max')).toBe('1 bis 1,618')
  })
  it('kennt Deckkraft und Schriftstärke von Komponenten über den Token-Typ', () => {
    expect(erlaubterBereich('komponente', 'nc-badge-pulse-opacity')).toBe('0 bis 1 oder 0 bis 100 %')
    expect(erlaubterBereich('komponente', 'nc-badge-status-font-weight')).toBe('100 bis 900')
  })
  it('liefert null für Felder ohne festen Bereich', () => {
    expect(erlaubterBereich('komponente', 'nc-badge-radius')).toBeNull()
    expect(erlaubterBereich('komponente', 'gibt-es-nicht')).toBeNull()
    expect(erlaubterBereich('schriftskala', 'unbekannt')).toBeNull()
  })
})
