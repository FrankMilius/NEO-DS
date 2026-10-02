/**
 * Komposition der Recipes (Plan v3, Phase 1): scripts/pruefe-komposition.mjs
 * haelt die Ketten — Markup traegt die Klasse des enthaltenen Bauteils,
 * geteilte Tokens werden genutzt, abgeleitete Tokens zeigen auf die Quelle.
 */
import { describe, it, expect } from 'vitest'
import { pruefe, ladeRecipes, gefundeneKompositionen } from '../../scripts/pruefe-komposition.mjs'

describe('Komposition', () => {
  const ergebnis = pruefe()

  it('alle erklaerten Ketten halten', () => {
    expect(ergebnis.fehler).toEqual([])
  })

  it('jedes im Markup gefundene Bauteil ist erklaert', () => {
    expect(ergebnis.hinweise).toEqual([])
  })

  it('Suche enthaelt den Input und erbt Hoehe und Radius', () => {
    const suche = ladeRecipes().search.daten.komposition
    const input = suche.find((k) => k.recipe === 'input')
    expect(input).toMatchObject({ art: 'enthaelt', element: '.nc-search__input' })
    expect(input.tokens).toMatchObject({ 'nc-search-input-height': 'nc-input-height-md', 'nc-search-input-radius': 'nc-input-radius' })
  })

  it('alle Feld-Radien der Suche und die Searchbar erben vom Input (Entscheidung 02.10.2026)', () => {
    const r = ladeRecipes()
    const suche = r.search.daten.komposition.find((k) => k.recipe === 'input').tokens
    expect(suche).toMatchObject({ 'nc-search-xl-radius': 'nc-input-radius', 'nc-search-command-radius': 'nc-input-radius' })
    const leiste = r.searchbar.daten.komposition.find((k) => k.recipe === 'input')
    expect(leiste.art).toBe('teilt')
    expect(leiste.tokens).toMatchObject({ 'nc-searchbar-input-radius': 'nc-input-radius', 'nc-searchbar-input-border-focus': 'nc-input-border-focus' })
  })

  it('Formularfelder teilen die Input-Basis', () => {
    const r = ladeRecipes()
    for (const id of ['select', 'textarea', 'otp-input']) {
      expect(r[id].daten.komposition.some((k) => k.art === 'teilt' && k.recipe === 'input'), id).toBe(true)
    }
  })

  it('findet Kompositionen im Markup (Formular enthaelt Formularfeld)', () => {
    expect(gefundeneKompositionen(ladeRecipes()).form).toContain('form-field')
  })
})
