// Wirkungsprüfung — Bausteine der Messung (Nachbesserung R14 Paket 3a,
// Entscheidung Frank 23.10.2026): zusätzlich Handy-Breite 390 px,
// scroll-margin(-block-start), padding-right und die untere Ecke von
// Pseudo-Elementen. Bestehende Messungen bleiben; mehr Messung darf nur
// zusätzliche „wirkt“ ergeben.
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import { resolve } from 'node:path'
import { EIGENSCHAFTEN, EIGENSCHAFTEN_BISHER, EIGENSCHAFTEN_NEU, PSEUDO, HANDY, zaehleUnterschiede, zusammenfuehren, gelesenIn, schluesselwortPruefwert, NUR_SCHLUESSELWORT } from '../../e2e/wirkung-messung.js'
import { auswerten } from '../../scripts/wirkung.mjs'

const SPEC = fs.readFileSync(resolve(import.meta.dirname, '../../e2e/wirkung.spec.js'), 'utf8')

describe('Wirkungsprüfung: gemessene Eigenschaften', () => {
  it('alle bisherigen Eigenschaften bleiben, in gleicher Reihenfolge vorn', () => {
    expect(EIGENSCHAFTEN.slice(0, EIGENSCHAFTEN_BISHER.length)).toEqual([...EIGENSCHAFTEN_BISHER])
    expect(EIGENSCHAFTEN_BISHER).toHaveLength(47)
  })

  it('neu: scroll-margin, padding-right, untere Ecke (logisch und physisch)', () => {
    for (const p of ['scroll-margin-top', 'scroll-margin-block-start', 'padding-right', 'border-end-start-radius', 'border-bottom-left-radius']) {
      expect(EIGENSCHAFTEN).toContain(p)
    }
    expect(EIGENSCHAFTEN_NEU.every((p) => EIGENSCHAFTEN.includes(p))).toBe(true)
  })

  it('neu (3c): Trennlinie rechts, Tabulatorbreite, Scrollbalkenbreite', () => {
    for (const p of ['border-right-color', 'tab-size', 'scrollbar-width']) expect(EIGENSCHAFTEN).toContain(p)
  })

  it('keine Eigenschaft doppelt', () => {
    expect(new Set(EIGENSCHAFTEN).size).toBe(EIGENSCHAFTEN.length)
  })

  it('misst Element, ::before und ::after (z. B. .nc-device__screen::after)', () => {
    expect([...PSEUDO]).toEqual([null, '::before', '::after'])
  })

  it('Handy-Breite 390 px, Knopf „handy“ der Bühne', () => {
    expect(HANDY).toEqual({ key: 'handy', breite: 390 })
  })

  it('die Prüfung nutzt diese Bausteine (keine eigene Liste mehr)', () => {
    expect(SPEC).toMatch(/from '\.\/wirkung-messung\.js'/)
    expect(SPEC).toMatch(/\[tokens, css, EIGENSCHAFTEN, PSEUDO\]/)
    expect(SPEC).not.toMatch(/const P = \[/)
    expect(SPEC).toMatch(/aufHandy\(page\)/)
    expect(SPEC).toMatch(/zusammenfuehren\(r\.ergebnis, h\.ergebnis\)/)
  })
})

describe('Wirkungsprüfung: Unterschiede zählen und zusammenführen', () => {
  it('zählt geänderte Abdrücke', () => {
    expect(zaehleUnterschiede(['a', 'b', 'c'], ['a', 'x', 'y'])).toBe(2)
    expect(zaehleUnterschiede(['a'], ['a'])).toBe(0)
  })

  it('addiert Zahlen beider Breiten', () => {
    expect(zusammenfuehren({ a: 0, b: 2 }, { a: 3, b: 0 })).toEqual({ a: 3, b: 2 })
  })

  it('ohne Handy-Messung bleibt die erste unverändert', () => {
    const erste = { a: 1, b: 'unbenutzt' }
    expect(zusammenfuehren(erste, null)).toEqual(erste)
    expect(zusammenfuehren(erste, undefined)).not.toBe(erste)
  })

  it('Text-Ergebnisse der ersten Messung bleiben', () => {
    expect(zusammenfuehren({ a: 'unbenutzt', b: 'ohne-pruefwert' }, { a: 4, b: 4 })).toEqual({ a: 'unbenutzt', b: 'ohne-pruefwert' })
  })

  it('mehr Messung ergibt nur zusätzliche „wirkt“, nie weniger', () => {
    const g = [{ id: 'k', tokens: ['nc-k-a', 'nc-k-b', 'nc-k-c', 'nc-k-d'].map((id) => ({ id })) }]
    const erste = { 'nc-k-a': 2, 'nc-k-b': 0, 'nc-k-c': 0, 'nc-k-d': 'unbenutzt' }
    const handy = { 'nc-k-a': 0, 'nc-k-b': 5, 'nc-k-c': 0, 'nc-k-d': 0 }
    const vorher = auswerten({ k: { ergebnis: erste } }, g)
    const nachher = auswerten({ k: { ergebnis: zusammenfuehren(erste, handy) } }, g)
    expect(vorher).toEqual({ 'nc-k-a': 'wirkt', 'nc-k-b': 'ohne-wirkung', 'nc-k-c': 'ohne-wirkung', 'nc-k-d': 'unbenutzt' })
    expect(nachher).toEqual({ 'nc-k-a': 'wirkt', 'nc-k-b': 'wirkt', 'nc-k-c': 'ohne-wirkung', 'nc-k-d': 'unbenutzt' })
  })
})

// Nachbesserung 3c (Frank, 23.10.2026): Prüfwert für Schlüsselwort-Eigenschaften
describe('Wirkungsprüfung: Schlüsselwort-Prüfwert', () => {
  const CSS = '.nc-textarea{scrollbar-width:var(--mod-textarea-scrollbar-width, var(--nc-textarea-scrollbar-width));max-height:var(--nc-textarea-max-height)}'

  it('scrollbar-width: thin → none (gültiges Schlüsselwort statt Länge)', () => {
    const w = schluesselwortPruefwert({ id: 'nc-textarea-scrollbar-width', default: 'thin' }, CSS)
    expect(w).toBe('none')
    expect(NUR_SCHLUESSELWORT['scrollbar-width']).toContain(w)
    expect(w).not.toMatch(/\d/)
  })

  it('entscheidet an der gelesenen Eigenschaft, nicht am Namen', () => {
    // Name mit „width“, Eigenschaft nimmt Längen: kein Schlüsselwort-Prüfwert
    expect(schluesselwortPruefwert({ id: 'nc-x-width', default: 'auto' }, '.a{width:var(--nc-x-width)}')).toBeNull()
    // Name ohne „width“, Eigenschaft nur Schlüsselwörter: Schlüsselwort
    expect(schluesselwortPruefwert({ id: 'nc-x-balken', default: 'thin' }, '.a{scrollbar-width:var(--nc-x-balken)}')).toBe('none')
    expect(schluesselwortPruefwert({ id: 'nc-x-balken', default: 'none' }, '.a{scrollbar-width:var(--nc-x-balken)}')).toBe('auto')
  })

  it('Länge oder unbekanntes Wort als Standard: kein Schlüsselwort-Prüfwert', () => {
    expect(schluesselwortPruefwert({ id: 'nc-textarea-max-height', default: 'none' }, CSS)).toBeNull()
    expect(schluesselwortPruefwert({ id: 'nc-textarea-scrollbar-width', default: '8px' }, CSS)).toBeNull()
  })

  it('gelesenIn findet die Eigenschaft, nicht die Zwischenvariable', () => {
    expect([...gelesenIn('nc-textarea-scrollbar-width', CSS)]).toEqual(['scrollbar-width'])
    expect([...gelesenIn('nc-y', '.a{--_z:var(--nc-y)}')]).toEqual([])
  })

  it('Spec nutzt den Schlüsselwort-Prüfwert nur, wo es bisher einen Prüfwert gab', () => {
    expect(SPEC).toMatch(/probe: probeFuer\(t, css\)/)
    expect(SPEC).toMatch(/if \(bisher === null\) return null/)
    expect(SPEC).toMatch(/schluesselwortPruefwert\(t, css\) \?\? bisher/)
  })
})
