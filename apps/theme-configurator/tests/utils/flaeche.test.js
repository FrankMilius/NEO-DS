/**
 * Flächenliste der Hauptnavigation (I06 Phase 3): Eine Fläche setzt alle ihre
 * Tokens gemeinsam, die Vorgabe „Standard“ setzt keins.
 */
import { describe, it, expect } from 'vitest'
import { componentTokenGroups } from '../../src/data/tokens.js'
import { flaechenSchluessel, aktiveFlaeche, flaechenAenderung } from '../../src/utils/flaeche.js'

function sucheFlaeche (knoten) {
  if (Array.isArray(knoten)) return knoten.flatMap(sucheFlaeche)
  if (knoten && typeof knoten === 'object') return knoten.type === 'flaeche' ? [knoten] : Object.values(knoten).flatMap(sucheFlaeche)
  return []
}
const steuerelemente = sucheFlaeche(componentTokenGroups)
const token = steuerelemente.find((t) => t.id === 'nc-nav-flaeche')
const knopf = steuerelemente.find((t) => t.id === 'nc-nav-uebersicht-knopf')

describe('Flächenliste nc-nav-flaeche', () => {
  it('kennt genau die vier gewählten Flächen', () => {
    expect(token.id).toBe('nc-nav-flaeche')
    expect(token.optionen.map((o) => o.id)).toEqual(['standard', 'sekundaer', 'invertiert', 'akzent'])
  })

  it('Standard setzt keins, Invertiert setzt alle sechs Tokens, nc-nav-bg bleibt frei', () => {
    const standard = flaechenAenderung(token, 'standard')
    expect(standard.setzen).toEqual({})
    expect(standard.entfernen.sort()).toEqual(flaechenSchluessel(token).sort())
    const inv = flaechenAenderung(token, 'invertiert')
    expect(Object.keys(inv.setzen).sort()).toEqual(['nc-nav-fg', 'nc-nav-focus', 'nc-nav-hover', 'nc-nav-line', 'nc-nav-muted', 'nc-nav-surface'])
    expect(inv.entfernen).toEqual([])
  })

  it('Werte hängen am Thema: keine festen Farben', () => {
    for (const o of token.optionen) for (const w of Object.values(o.werte)) expect(w).toMatch(/^(var|color-mix)\(/)
  })

  it('erkennt die aktive Fläche aus den Abweichungen', () => {
    expect(aktiveFlaeche(token, {})).toBe('standard')
    const akzent = token.optionen.find((o) => o.id === 'akzent')
    expect(aktiveFlaeche(token, { ...akzent.werte, 'nc-button-bg': 'red' })).toBe('akzent')
  })

  it('ein einzelner abweichender Wert ist keine Fläche der Liste', () => {
    const akzent = token.optionen.find((o) => o.id === 'akzent')
    expect(aktiveFlaeche(token, { ...akzent.werte, 'nc-nav-fg': '#123456' })).toBe('eigene')
  })

  it('Button-Typ des Übersichtslinks: Ghost schreibt nichts, die übrigen setzen vier Werte', () => {
    expect(knopf.optionen.map((o) => o.id)).toEqual(['ghost', 'primaer', 'sekundaer', 'akzent'])
    expect(aktiveFlaeche(knopf, {})).toBe('ghost')
    expect(flaechenAenderung(knopf, 'ghost').setzen).toEqual({})
    expect(Object.keys(flaechenAenderung(knopf, 'akzent').setzen).sort()).toEqual(['nc-nav-uebersicht-bg', 'nc-nav-uebersicht-border', 'nc-nav-uebersicht-fg', 'nc-nav-uebersicht-hover'])
  })

  it('unbekannte Fläche ändert nichts', () => {
    expect(flaechenAenderung(token, 'gibt-es-nicht')).toEqual({ setzen: {}, entfernen: [] })
  })
})
