/**
 * packages/neo-behaviors (Plan v3, Phase 2): Verhalten aus dem Recipe.
 * Gebunden wird an genau das Markup, das die Arena aus dem Recipe baut
 * (src/arena-templates) — Recipe, Markup und Verhalten pruefen sich so
 * gegenseitig. Tastatur und Ereignisse folgen `keyboard`/`events` im Recipe.
 */
import { describe, it, expect, afterEach } from 'vitest'
import { anbinden, abbinden, MIT_VERHALTEN } from 'neo-behaviors'
import { vorlageFuer } from '../../src/arena-templates/index.js'
import { normalisiereRecipe, specimenAnsicht } from '../../src/lib/recipe-arena.js'
import { rohesRecipe } from '../arena/_recipes.js'
import { taste as bediene, tastenAus, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

function erstesMarkup (id, specimenId) {
  const recipe = normalisiereRecipe(rohesRecipe(id))
  const sp = recipe.specimens.find((s) => !specimenId || s.id === specimenId)
  return specimenAnsicht(sp, recipe, id, vorlageFuer(id)).zeilen[0].zellen[0].html
}

function buehne (html) {
  const d = document.createElement('div')
  d.innerHTML = html
  document.body.append(d)
  return d
}

const taste = (el, key, extra = {}) => el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...extra }))

afterEach(() => { document.body.innerHTML = '' })

describe('neo-behaviors: Grundlagen', () => {
  it('kennt die Bauteile mit Verhalten', () => {
    expect([...MIT_VERHALTEN].sort()).toEqual([
      'accordion', 'alert', 'alert-dialog', 'banner', 'breadcrumb', 'code-snippet', 'drawer', 'dropdown-menu', 'input', 'modal', 'navigation-menu', 'navigation-tab-mega', 'notification', 'popover', 'rating', 'search', 'segmented-control', 'select', 'sidebar', 'switch', 'tabs', 'toast', 'toggle-group', 'toolbar', 'tooltip', 'treeview',
    ])
  })

  it('jedes Bauteil mit Verhalten beschreibt Tastatur und Ereignisse im Recipe', () => {
    for (const id of MIT_VERHALTEN) {
      const r = rohesRecipe(id)
      expect(Object.keys(r.keyboard || {}).length, `${id}: keyboard fehlt`).toBeGreaterThan(0)
      expect(Object.keys(r.events || {}).length, `${id}: events fehlt`).toBeGreaterThan(0)
    }
  })

  it('bindet jede Wurzel nur einmal und loest wieder', () => {
    const b = buehne(erstesMarkup('tabs'))
    const aufraeumen = anbinden(b)
    expect(anbinden(b)).toBeTypeOf('function')
    const wurzel = b.querySelector('.nc-tabs')
    expect(wurzel.getAttribute('data-neo-behavior')).toBe('tabs')
    aufraeumen()
    expect(wurzel.hasAttribute('data-neo-behavior')).toBe(false)
    anbinden(b); abbinden(b)
    expect(wurzel.hasAttribute('data-neo-behavior')).toBe(false)
  })
})

describe('Tabs (tabs-recipe.json)', () => {
  const tastenImRecipe = Object.keys(rohesRecipe('tabs').keyboard)

  it('Klick wechselt den aktiven Tab und das Panel, feuert tab-change', () => {
    const b = buehne(erstesMarkup('tabs'))
    anbinden(b)
    const tabs = [...b.querySelectorAll('.nc-tabs__trigger')]
    const ereignisse = []
    b.addEventListener('tab-change', (e) => ereignisse.push(e.detail))
    tabs[2].click()
    expect(tabs[2].getAttribute('aria-selected')).toBe('true')
    expect(tabs[2].classList.contains('is-active')).toBe(true)
    expect(tabs[0].getAttribute('aria-selected')).toBe('false')
    expect(tabs[2].tabIndex).toBe(0)
    const panel = b.querySelector('#' + tabs[2].getAttribute('aria-controls'))
    expect(panel.hidden).toBe(false)
    expect(b.querySelector('#' + tabs[0].getAttribute('aria-controls')).hidden).toBe(true)
    expect(ereignisse).toEqual([{ value: tabs[2].id, previousValue: tabs[0].id }])
  })

  it('Pfeiltasten, Pos1, Ende wie im Recipe', () => {
    expect(tastenImRecipe).toEqual(expect.arrayContaining(['ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter', 'Space']))
    const b = buehne(erstesMarkup('tabs'))
    anbinden(b)
    const tabs = [...b.querySelectorAll('.nc-tabs__trigger')]
    taste(tabs[0], 'ArrowRight')
    expect(tabs[1].getAttribute('aria-selected')).toBe('true')
    taste(tabs[1], 'End')
    expect(tabs.at(-1).getAttribute('aria-selected')).toBe('true')
    taste(tabs.at(-1), 'ArrowRight')
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    taste(tabs[0], 'ArrowLeft')
    expect(tabs.at(-1).getAttribute('aria-selected')).toBe('true')
    taste(tabs.at(-1), 'Home')
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
  })

  it('gesperrte Tabs werden uebersprungen und nicht aktiviert', () => {
    // Recipe-Regel: gesperrte Tabs (aria-disabled) sind nicht anklickbar
    const b = buehne(erstesMarkup('tabs'))
    const tabs = [...b.querySelectorAll('.nc-tabs__trigger')]
    const gesperrt = tabs[2]
    gesperrt.setAttribute('aria-disabled', 'true')
    anbinden(b)
    gesperrt.click()
    expect(gesperrt.getAttribute('aria-selected')).toBe('false')
    const vorher = tabs[tabs.indexOf(gesperrt) - 1]
    vorher.click()
    taste(vorher, 'ArrowRight')
    expect(gesperrt.getAttribute('aria-selected')).toBe('false')
  })

  it('manuelle Aktivierung: Pfeil fokussiert nur, Enter aktiviert', () => {
    const b = buehne(erstesMarkup('tabs'))
    b.querySelector('.nc-tabs').dataset.neoTabs = 'manuell'
    anbinden(b)
    const tabs = [...b.querySelectorAll('.nc-tabs__trigger')]
    taste(tabs[0], 'ArrowRight')
    expect(tabs[1].getAttribute('aria-selected')).toBe('false')
    taste(tabs[1], 'Enter')
    expect(tabs[1].getAttribute('aria-selected')).toBe('true')
  })
})

describe('Akkordeon (accordion-recipe.json)', () => {
  const html = `<div class="nc-accordion" data-neo-accordion="einzeln">
    <details class="nc-accordion__item" id="a" open><summary class="nc-accordion__trigger">A</summary><div class="nc-accordion__content">a</div></details>
    <details class="nc-accordion__item" id="b"><summary class="nc-accordion__trigger">B</summary><div class="nc-accordion__content">b</div></details>
    <details class="nc-accordion__item" id="c"><summary class="nc-accordion__trigger">C</summary><div class="nc-accordion__content">c</div></details>
  </div>`

  it('Pfeiltasten, Pos1, Ende wandern zwischen den Kopfzeilen', () => {
    expect(Object.keys(rohesRecipe('accordion').keyboard)).toEqual(expect.arrayContaining(['ArrowDown', 'ArrowUp', 'Home', 'End']))
    const b = buehne(html)
    anbinden(b)
    const koepfe = [...b.querySelectorAll('summary')]
    koepfe[0].focus()
    taste(koepfe[0], 'ArrowDown')
    expect(document.activeElement).toBe(koepfe[1])
    taste(koepfe[1], 'End')
    expect(document.activeElement).toBe(koepfe[2])
    taste(koepfe[2], 'ArrowDown')
    expect(document.activeElement).toBe(koepfe[0])
  })

  it('„nur eines offen" schliesst die anderen, accordion-toggle mit itemId/open', () => {
    const b = buehne(html)
    anbinden(b)
    const ereignisse = []
    b.addEventListener('accordion-toggle', (e) => ereignisse.push(e.detail))
    const [a, bb] = b.querySelectorAll('details')
    bb.open = true
    bb.dispatchEvent(new Event('toggle'))
    expect(a.open).toBe(false)
    expect(ereignisse).toContainEqual({ itemId: 'b', open: true })
  })
})

describe('Select (select-recipe.json, natives Feld)', () => {
  it('Wrapper bekommt .is-open beim Oeffnen und verliert es bei Auswahl, Escape, Verlassen', () => {
    const b = buehne(erstesMarkup('select', 'with-indicator'))
    anbinden(b)
    const wrapper = b.querySelector('.nc-select-wrapper')
    const feld = b.querySelector('select')
    feld.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(wrapper.classList.contains('is-open')).toBe(true)
    feld.value = feld.options[1].value
    feld.dispatchEvent(new Event('change', { bubbles: true }))
    expect(wrapper.classList.contains('is-open')).toBe(false)
    taste(feld, ' ')
    expect(wrapper.classList.contains('is-open')).toBe(true)
    taste(feld, 'Escape')
    expect(wrapper.classList.contains('is-open')).toBe(false)
  })

  it('gesperrtes Feld oeffnet nicht', () => {
    const b = buehne(erstesMarkup('select', 'with-indicator'))
    b.querySelector('select').disabled = true
    anbinden(b)
    b.querySelector('select').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(b.querySelector('.nc-select-wrapper').classList.contains('is-open')).toBe(false)
  })
})

describe('Suche (search-recipe.json)', () => {
  function suche () {
    const b = buehne(erstesMarkup('search', 'default'))
    anbinden(b)
    return { b, feld: b.querySelector('.nc-search__input'), liste: b.querySelector('.nc-search__results') }
  }

  it('Liste startet geschlossen, Fokus oeffnet sie', () => {
    const { feld, liste } = suche()
    expect(liste.hidden).toBe(true)
    expect(feld.getAttribute('aria-expanded')).toBe('false')
    feld.dispatchEvent(new FocusEvent('focus'))
    expect(liste.hidden).toBe(false)
    expect(feld.getAttribute('aria-expanded')).toBe('true')
  })

  it('Tippen filtert und markiert, ohne Treffer erscheint der Leerhinweis', () => {
    const { feld, liste } = suche()
    feld.value = 'micro'
    feld.dispatchEvent(new Event('input'))
    const sichtbar = [...liste.querySelectorAll('.nc-search__item')].filter((e) => !e.hidden)
    expect(sichtbar).toHaveLength(1)
    expect(sichtbar[0].querySelector('.nc-search__highlight').textContent).toBe('Micro')
    feld.value = 'xyz'
    feld.dispatchEvent(new Event('input'))
    expect(liste.querySelector('.nc-search__empty').hidden).toBe(false)
    expect(liste.querySelector('.nc-search__empty').textContent).toContain('xyz')
  })

  it('Pfeiltasten waehlen Eintraege (aria-activedescendant), Enter uebernimmt, Escape schliesst', () => {
    const { b, feld, liste } = suche()
    const auswahl = []
    b.addEventListener('search-select', (e) => auswahl.push(e.detail.value))
    feld.dispatchEvent(new FocusEvent('focus'))
    taste(feld, 'ArrowDown')
    const erster = liste.querySelector('.nc-search__item')
    expect(erster.getAttribute('aria-selected')).toBe('true')
    expect(feld.getAttribute('aria-activedescendant')).toBe(erster.id)
    taste(feld, 'Enter')
    expect(auswahl[0]).toContain('Button')
    expect(liste.hidden).toBe(true)
    feld.dispatchEvent(new FocusEvent('focus'))
    taste(feld, 'Escape')
    expect(liste.hidden).toBe(true)
  })
})

describe('Select: Tasten aus dem Recipe', () => {
  function feld () {
    const b = buehne(erstesMarkup('select', 'with-indicator'))
    anbinden(b)
    return { wrapper: b.querySelector('.nc-select-wrapper'), feld: b.querySelector('select') }
  }
  const oeffnet = (t) => () => { const s = feld(); bediene(s.feld, t); expect(s.wrapper.classList.contains('is-open')).toBe(true) }
  const schliesst = (t) => () => { const s = feld(); bediene(s.feld, 'Space'); bediene(s.feld, t); expect(s.wrapper.classList.contains('is-open')).toBe(false) }
  const pruefungen = {
    Space: oeffnet('Space'),
    Enter: oeffnet('Enter'),
    'Alt+ArrowDown': oeffnet('Alt+ArrowDown'),
    F4: oeffnet('F4'),
    Escape: schliesst('Escape'),
    Tab: schliesst('Tab')
  }
  it('jede Taste hat eine Pruefung', () => deckeTastenAb('select', pruefungen))
  for (const t of tastenAus('select')) it(t, () => pruefungen[t]())

  it('Ereignis change kommt nativ vom Feld', () => {
    const s = feld()
    const ev = sammle(s.feld, 'change')
    s.feld.value = s.feld.options[1].value
    s.feld.dispatchEvent(new Event('change', { bubbles: true }))
    passtZumRecipe('select', ev[0])
  })
})

describe('Suche: Tasten und Ereignisse aus dem Recipe', () => {
  function suche () {
    const b = buehne(erstesMarkup('search', 'default') + '<button type="button" id="weiter">weiter</button>')
    anbinden(b)
    const wurzel = b.querySelector('.nc-search')
    const feld = b.querySelector('.nc-search__input')
    feld.focus()
    feld.dispatchEvent(new FocusEvent('focus'))
    return { wurzel, feld, liste: b.querySelector('.nc-search__results') }
  }
  const sichtbare = (liste) => [...liste.querySelectorAll('.nc-search__item')].filter((e) => !e.hidden)
  const markiert = (liste) => sichtbare(liste).findIndex((e) => e.getAttribute('aria-selected') === 'true')
  const pruefungen = {
    ArrowDown: () => { const s = suche(); bediene(s.feld, 'ArrowDown'); bediene(s.feld, 'ArrowDown'); expect(markiert(s.liste)).toBe(1) },
    ArrowUp: () => { const s = suche(); bediene(s.feld, 'ArrowUp'); expect(markiert(s.liste)).toBe(sichtbare(s.liste).length - 1) },
    Enter: () => {
      const s = suche()
      const ev = sammle(s.wurzel, 'search-select')
      bediene(s.feld, 'ArrowDown'); bediene(s.feld, 'Enter')
      expect(ev).toHaveLength(1); passtZumRecipe('search', ev[0]); expect(s.liste.hidden).toBe(true)
    },
    Escape: () => { const s = suche(); bediene(s.feld, 'Escape'); expect(s.liste.hidden).toBe(true) },
    Tab: () => {
      const s = suche()
      const weiter = document.getElementById('weiter')
      s.feld.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: weiter }))
      expect(s.liste.hidden).toBe(true)
    }
  }
  it('jede Taste hat eine Pruefung', () => deckeTastenAb('search', pruefungen))
  for (const t of tastenAus('search')) it(t, () => pruefungen[t]())

  it('search-open { open } wie im Recipe', () => {
    const b = buehne(erstesMarkup('search', 'default'))
    anbinden(b)
    const ev = sammle(b.querySelector('.nc-search'), 'search-open')
    b.querySelector('.nc-search__input').dispatchEvent(new FocusEvent('focus'))
    expect(ev.map((e) => e.detail)).toEqual([{ open: true }])
    passtZumRecipe('search', ev[0])
  })
})
