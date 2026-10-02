/**
 * Plan v3, Phase 1: Select und Suche kommen aus dem Recipe (Vorlagen
 * select.js, search.js) statt aus handgeschriebenen Arenen. Die Suche
 * enthaelt den Input (Klasse nc-input), das Select ist ein echtes natives
 * Feld (Entscheidung 01.10.2026). Dazu: Token-Erbe fuer den Inspector.
 */
import { describe, it, expect } from 'vitest'
import { vorlageFuer } from '../../src/arena-templates/index.js'
import { normalisiereRecipe, specimenAnsicht } from '../../src/lib/recipe-arena.js'
import { hasArena } from '../../src/composables/useArenaResolver.js'
import { komponentenErbe, loeseKette } from '../../src/lib/token-erbe.js'
import { rohesRecipe } from './_recipes.js'

function zellen (id, specimenId) {
  const recipe = normalisiereRecipe(rohesRecipe(id))
  return recipe.specimens
    .filter((sp) => !specimenId || sp.id === specimenId)
    .flatMap((sp) => specimenAnsicht(sp, recipe, id, vorlageFuer(id)).zeilen.flatMap((z) => z.zellen))
}

function dom (html) {
  const d = document.createElement('div')
  d.innerHTML = html
  return d
}

describe('Select aus dem Recipe', () => {
  it('keine Sonderfall-Arena mehr, jede Zelle aus der Vorlage', () => {
    expect(hasArena('select')).toBe(false)
    expect(new Set(zellen('select').map((z) => z.quelle))).toEqual(new Set(['vorlage']))
  })

  it('jede Zelle ist ein natives, bedienbares <select class="nc-select">', () => {
    for (const z of zellen('select')) {
      const feld = dom(z.html).querySelector('select.nc-select')
      expect(feld, z.html).not.toBeNull()
      expect(feld.options.length).toBeGreaterThan(1)
    }
  })

  it('Zustaende: deaktiviert, offen (Wrapper is-open), Platzhalter, Gruppen, Mehrfach', () => {
    const alle = zellen('select', 'all-states').map((z) => dom(z.html))
    expect(alle.some((d) => d.querySelector('select').disabled)).toBe(true)
    const offen = dom(zellen('select', 'open-state')[0].html)
    expect(offen.querySelector('.nc-select-wrapper.is-open .nc-select__indicator')).not.toBeNull()
    expect(offen.querySelector('select').classList.contains('is-open')).toBe(false)
    const platz = dom(zellen('select', 'placeholder-hack')[0].html).querySelector('select')
    expect(platz.required).toBe(true)
    expect(platz.value).toBe('')
    expect(dom(zellen('select', 'with-optgroups')[0].html).querySelectorAll('optgroup').length).toBe(2)
    expect(zellen('select', 'single-vs-multiple').some((z) => dom(z.html).querySelector('select').multiple)).toBe(true)
  })

  it('Varianten kommen als Modifier aus dem Recipe', () => {
    const klassen = zellen('select', 'variant-comparison').map((z) => dom(z.html).querySelector('select').className)
    expect(klassen.some((k) => k.includes('nc-select--filled'))).toBe(true)
    expect(klassen.some((k) => k.includes('nc-select--borderless'))).toBe(true)
  })
})

describe('Suche aus dem Recipe', () => {
  it('keine Sonderfall-Arena mehr, jede Zelle aus der Vorlage', () => {
    expect(hasArena('search')).toBe(false)
    expect(new Set(zellen('search').map((z) => z.quelle))).toEqual(new Set(['vorlage']))
  })

  it('das Suchfeld ist ein Input (nc-input nc-search__input)', () => {
    for (const z of zellen('search')) {
      const feld = dom(z.html).querySelector('input.nc-search__input')
      expect(feld.classList.contains('nc-input')).toBe(true)
      expect(feld.getAttribute('role')).toBe('combobox')
    }
  })

  it('Ergebnis-Zustaende: Treffer, leer, laedt, geschlossen, Verlauf, Beliebt', () => {
    const z = zellen('search', 'results-states').map((c) => dom(c.html))
    expect(z.some((d) => d.querySelector('.nc-search__item .nc-search__highlight'))).toBe(true)
    expect(z.some((d) => d.querySelector('.nc-search__empty'))).toBe(true)
    expect(z.some((d) => d.querySelector('.nc-search__loading'))).toBe(true)
    expect(z.some((d) => !d.querySelector('.nc-search__results'))).toBe(true)
    expect(z.some((d) => d.textContent.includes('Zuletzt gesucht'))).toBe(true)
    expect(z.some((d) => d.textContent.includes('Beliebt'))).toBe(true)
  })

  it('Bereich, Kuerzel, Vorschlag und Befehlspalette', () => {
    expect(dom(zellen('search', 'scoped-search')[0].html).querySelector('.nc-search__scope-trigger')).not.toBeNull()
    expect(dom(zellen('search', 'appearance-xl')[0].html).querySelector('.nc-search--xl .nc-search__shortcut')).not.toBeNull()
    expect(dom(zellen('search', 'type-ahead')[0].html).querySelector('.nc-search__ghost')).not.toBeNull()
    const befehl = dom(zellen('search', 'command-palette')[0].html)
    expect(befehl.querySelector('.nc-search--command').getAttribute('style')).toContain('position:absolute')
  })
})

describe('Token-Erbe zwischen Komponenten', () => {
  it('Suche erbt Hoehe und Radius vom Input', () => {
    expect(komponentenErbe('var(--nc-input-height-md)', 'search')).toMatchObject({ source: 'komponente', gruppe: 'input', varName: '--nc-input-height-md' })
    expect(komponentenErbe('var(--nc-input-radius)', 'search')).toMatchObject({ gruppe: 'input' })
  })

  it('kein Erbe bei Foundation-Werten, festen Werten oder eigener Gruppe', () => {
    expect(komponentenErbe('var(--fnd-size-md)', 'search')).toBeNull()
    expect(komponentenErbe('320px', 'search')).toBeNull()
    expect(komponentenErbe('var(--nc-input-height-md)', 'input')).toBeNull()
  })
  it('loeseKette folgt der Kette mit Store-Aenderungen bis zum Foundation-Wert', () => {
    // Standard: Suche → Input → Formular-Basis → Foundation
    expect(loeseKette('var(--nc-search-input-radius)', {})).toEqual({ wert: '4px', quelle: 'nc-search-input-radius' })
    expect(loeseKette('var(--nc-input-radius)', { 'nc-input-radius': 'var(--fnd-radius-lg)' })).toEqual({ wert: 'var(--fnd-radius-lg)', quelle: 'nc-input-radius' })
    expect(loeseKette('var(--nc-search-input-radius)', { 'nc-input-radius': 'var(--fnd-radius-lg)' }).wert).toBe('var(--fnd-radius-lg)')
    expect(loeseKette('12px', {})).toEqual({ wert: '12px', quelle: null })
  })
})
