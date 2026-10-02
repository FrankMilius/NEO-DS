/**
 * neo-behaviors, Formular-Bauteile (Plan v3, Phase 2): Segmented Control,
 * Toggle-Group, Switch, Rating, Input. Gebunden wird an genau das Markup,
 * das die Arena aus dem Recipe baut; jede Taste aus `keyboard` wird geprueft,
 * jedes Ereignis gegen `events`.
 */
import { describe, it, expect, afterEach } from 'vitest'
import { anbinden, abbinden, setzeIndikator } from 'neo-behaviors'
import { einrichtungFuer } from '../../src/arena-templates/index.js'
import { zellenMarkup, zelleMit, buehne, taste, tastenAus, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

afterEach(() => { document.body.innerHTML = '' })

const gewaehlt = (b, sel, attr = 'aria-checked') => [...b.querySelectorAll(sel)].findIndex((e) => e.getAttribute(attr) === 'true')

// ---------------------------------------------------------------------------
describe('Segmented Control (segmented-control-recipe.json)', () => {
  const SEG = '.nc-segmented-control__item'
  function aufbau (specimen = 'all-states') {
    const b = buehne(zellenMarkup('segmented-control', specimen))
    anbinden(b)
    return { b, wurzel: b.querySelector('.nc-segmented-control'), segmente: [...b.querySelectorAll(SEG)] }
  }

  it('Klick waehlt, roving tabindex, segment-change wie im Recipe', () => {
    const { b, wurzel, segmente } = aufbau()
    const ev = sammle(wurzel, 'segment-change')
    segmente[2].click()
    expect(gewaehlt(b, SEG)).toBe(2)
    expect(segmente.map((s) => s.tabIndex)).toEqual([-1, -1, 0])
    expect(ev).toHaveLength(1)
    passtZumRecipe('segmented-control', ev[0])
    expect(ev[0].detail).toEqual({ value: 'Karten', previousValue: 'Raster' })
    segmente[2].click()
    expect(ev).toHaveLength(1) // gleiches Segment: kein Wechsel
  })

  describe('Tasten aus dem Recipe', () => {
    const pruefungen = {
      ArrowRight: ({ b, segmente }) => { taste(segmente[0], 'ArrowRight'); expect(gewaehlt(b, SEG)).toBe(1); expect(document.activeElement).toBe(segmente[1]) },
      ArrowDown: ({ b, segmente }) => { taste(segmente[0], 'ArrowDown'); expect(gewaehlt(b, SEG)).toBe(1) },
      ArrowLeft: ({ b, segmente }) => { taste(segmente[0], 'ArrowLeft'); expect(gewaehlt(b, SEG)).toBe(2) }, // rundum
      ArrowUp: ({ b, segmente }) => { taste(segmente[0], 'ArrowUp'); expect(gewaehlt(b, SEG)).toBe(2) },
      Home: ({ b, segmente }) => { segmente[2].click(); taste(segmente[2], 'Home'); expect(gewaehlt(b, SEG)).toBe(0) },
      End: ({ b, segmente }) => { taste(segmente[0], 'End'); expect(gewaehlt(b, SEG)).toBe(2) },
      Tab: ({ segmente }) => { expect(segmente.filter((s) => s.tabIndex === 0)).toEqual([segmente[0]]) }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('segmented-control', pruefungen))
    for (const t of tastenAus('segmented-control')) it(t, () => pruefungen[t](aufbau()))
  })

  it('gesperrtes Segment wird uebersprungen und nicht gewaehlt', () => {
    const { b, segmente } = aufbau('disabled-mixed')
    const zu = segmente.at(-1)
    expect(zu.getAttribute('aria-disabled')).toBe('true')
    zu.click()
    expect(gewaehlt(b, SEG)).toBe(0)
    taste(segmente[1], 'ArrowRight')
    expect(gewaehlt(b, SEG)).toBe(0) // rundum, am gesperrten vorbei
  })

  it('gleitender Indikator folgt der Auswahl (dieselbe Funktion wie die Arena-Vorlage)', () => {
    const { wurzel, segmente } = aufbau('sliding-indicator')
    Object.defineProperty(segmente[1], 'offsetLeft', { value: 90 })
    Object.defineProperty(segmente[1], 'offsetWidth', { value: 70 })
    segmente[1].click()
    expect(wurzel.style.getPropertyValue('--_indicator-left')).toBe('90px')
    expect(wurzel.style.getPropertyValue('--_indicator-width')).toBe('70px')
    // Vorlage: einrichten() nutzt setzeIndikator() aus dem Paket
    wurzel.style.removeProperty('--_indicator-left')
    einrichtungFuer('segmented-control')(wurzel.parentElement)
    expect(wurzel.style.getPropertyValue('--_indicator-left')).toBe('90px')
    expect(setzeIndikator).toBeTypeOf('function')
  })
})

// ---------------------------------------------------------------------------
describe('Toggle-Group (toggle-group-recipe.json)', () => {
  const KN = '.nc-toggle-group__item'
  const einfach = () => { const b = buehne(zellenMarkup('toggle-group', 'all-states')); anbinden(b); return { b, wurzel: b.firstElementChild, knoepfe: [...b.querySelectorAll(KN)] } }
  const mehrfach = () => { const b = buehne(zellenMarkup('toggle-group', 'toolbar-pattern')); anbinden(b); return { b, wurzel: b.firstElementChild, knoepfe: [...b.querySelectorAll(KN)] } }
  const gedrueckt = (k) => k.map((x) => x.getAttribute('aria-pressed'))

  it('einfach (radiogroup): Klick waehlt genau einen, toggle-change wie im Recipe', () => {
    const { b, wurzel, knoepfe } = einfach()
    expect(wurzel.getAttribute('role')).toBe('radiogroup')
    const ev = sammle(wurzel, 'toggle-change')
    knoepfe[1].click()
    expect(gewaehlt(b, KN)).toBe(1)
    knoepfe[1].click() // Radio: nicht abwaehlbar
    expect(gewaehlt(b, KN)).toBe(1)
    expect(ev).toHaveLength(1)
    passtZumRecipe('toggle-group', ev[0])
    expect(ev[0].detail).toEqual({ value: 'Liste', selected: true, values: ['Liste'] })
  })

  it('mehrfach (group): aria-pressed schaltet je Knopf, alle bleiben im Tab-Fluss', () => {
    const { wurzel, knoepfe } = mehrfach()
    expect(wurzel.getAttribute('role')).toBe('group')
    const ev = sammle(wurzel, 'toggle-change')
    knoepfe[1].click()
    knoepfe[2].click()
    knoepfe[0].click()
    expect(gedrueckt(knoepfe)).toEqual(['false', 'true', 'true', 'false'])
    expect(ev.at(-1).detail).toEqual({ value: 'Fett', selected: false, values: ['Kursiv', 'Unterstrichen'] })
    passtZumRecipe('toggle-group', ev.at(-1))
    expect(knoepfe.every((k) => k.tabIndex === 0)).toBe(true)
  })

  describe('Tasten aus dem Recipe', () => {
    const pruefungen = {
      ArrowRight: () => {
        const e = einfach(); taste(e.knoepfe[0], 'ArrowRight'); expect(gewaehlt(e.b, KN)).toBe(1)
        const m = mehrfach(); taste(m.knoepfe[0], 'ArrowRight'); expect(document.activeElement).toBe(m.knoepfe[1]); expect(gedrueckt(m.knoepfe)).toEqual(['true', 'false', 'false', 'false'])
      },
      ArrowDown: () => { const e = einfach(); taste(e.knoepfe[0], 'ArrowDown'); expect(gewaehlt(e.b, KN)).toBe(1) },
      ArrowLeft: () => { const e = einfach(); taste(e.knoepfe[0], 'ArrowLeft'); expect(gewaehlt(e.b, KN)).toBe(2) },
      ArrowUp: () => { const e = einfach(); taste(e.knoepfe[0], 'ArrowUp'); expect(gewaehlt(e.b, KN)).toBe(2) },
      Home: () => { const e = einfach(); e.knoepfe[2].click(); taste(e.knoepfe[2], 'Home'); expect(gewaehlt(e.b, KN)).toBe(0) },
      End: () => { const m = mehrfach(); taste(m.knoepfe[0], 'End'); expect(document.activeElement).toBe(m.knoepfe.at(-1)) },
      Space: () => {
        const m = mehrfach(); taste(m.knoepfe[1], 'Space'); expect(gedrueckt(m.knoepfe)[1]).toBe('true')
        const e = einfach(); taste(e.knoepfe[2], 'Space'); expect(gewaehlt(e.b, KN)).toBe(2)
      },
      Enter: () => { const m = mehrfach(); taste(m.knoepfe[3], 'Enter'); expect(gedrueckt(m.knoepfe)[3]).toBe('true') },
      Tab: () => {
        const e = einfach(); expect(e.knoepfe.filter((k) => k.tabIndex === 0)).toHaveLength(1)
        const m = mehrfach(); expect(m.knoepfe.every((k) => k.tabIndex === 0)).toBe(true)
      }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('toggle-group', pruefungen))
    for (const t of tastenAus('toggle-group')) it(t, () => pruefungen[t]())
  })

  it('gesperrte Gruppe reagiert nicht', () => {
    const b = buehne(zelleMit('toggle-group', 'all-states', (h) => / disabled/.test(h)))
    anbinden(b)
    const k = [...b.querySelectorAll(KN)]
    expect(k[1].disabled).toBe(true)
    k[1].dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(gewaehlt(b, KN)).toBe(0)
  })
})

// ---------------------------------------------------------------------------
describe('Switch (switch-recipe.json)', () => {
  const knopfMuster = () => { const b = buehne(zellenMarkup('switch', 'default-states')); anbinden(b); return { b, wurzel: b.querySelector('.nc-switch'), knopf: b.querySelector('[role="switch"]') } }

  it('Button-Muster: Klick schaltet aria-checked, switch-change wie im Recipe', () => {
    const { wurzel, knopf } = knopfMuster()
    const ev = sammle(wurzel, 'switch-change')
    knopf.click()
    expect(knopf.getAttribute('aria-checked')).toBe('true')
    knopf.click()
    expect(knopf.getAttribute('aria-checked')).toBe('false')
    expect(ev.map((e) => e.detail.checked)).toEqual([true, false])
    passtZumRecipe('switch', ev[0])
  })

  it('Checkbox-Muster: nativ, kein eigenes Ereignis', () => {
    const b = buehne(zelleMit('switch', 'pattern-comparison', (h) => h.includes('nc-switch__input')))
    anbinden(b)
    const feld = b.querySelector('input[role="switch"]')
    expect(feld).toBeTruthy()
    const ev = sammle(b, 'switch-change')
    feld.click()
    expect(feld.checked).toBe(true)
    expect(ev).toHaveLength(0)
  })

  it('gesperrter Schalter bleibt aus', () => {
    const b = buehne(zelleMit('switch', 'disabled-states', (h) => / disabled/.test(h)))
    anbinden(b)
    const knopf = b.querySelector('[role="switch"]')
    expect(knopf.disabled).toBe(true)
    knopf.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(knopf.getAttribute('aria-checked')).toBe('false')
  })

  describe('Tasten aus dem Recipe', () => {
    const pruefungen = {
      Space: () => { const { knopf } = knopfMuster(); taste(knopf, 'Space'); expect(knopf.getAttribute('aria-checked')).toBe('true') },
      Enter: () => { const { knopf } = knopfMuster(); taste(knopf, 'Enter'); expect(knopf.getAttribute('aria-checked')).toBe('true') }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('switch', pruefungen))
    for (const t of tastenAus('switch')) it(t, () => pruefungen[t]())
  })
})

// ---------------------------------------------------------------------------
describe('Rating (rating-recipe.json)', () => {
  function aufbau (specimen = 'interactive-states') {
    const b = buehne(zellenMarkup('rating', specimen))
    anbinden(b)
    const wurzel = b.querySelector('.nc-rating')
    const sterne = [...wurzel.querySelectorAll('.nc-rating__input:not(.nc-rating__input--clear)')]
    const wert = () => Number(wurzel.querySelector('.nc-rating__input:checked')?.value || 0)
    const aktiv = () => wurzel.querySelectorAll('.nc-rating__item--active').length
    return { b, wurzel, sterne, wert, aktiv }
  }

  it('Klick auf einen Stern setzt den Wert und faerbt bis dahin ein; rating-change wie im Recipe', () => {
    const r = aufbau()
    expect(r.wert()).toBe(3)
    const ev = sammle(r.wurzel, 'rating-change')
    // Klick aufs Label waehlt nativ das Radio und meldet change
    r.wurzel.querySelector(`label[for="${r.sterne[4].id}"]`).click()
    expect(r.wert()).toBe(5)
    expect(r.aktiv()).toBe(5)
    expect(ev).toHaveLength(1)
    passtZumRecipe('rating', ev[0])
    expect(ev[0].detail).toEqual({ value: 5, previousValue: 3 })
  })

  it('Reset-Knopf setzt auf 0, Sentiment-Stufe folgt dem Wert', () => {
    const r = aufbau('clear-reset')
    r.wurzel.classList.add('nc-rating--sentiment')
    abbinden(r.b); anbinden(r.b)
    expect(r.wurzel.classList.contains('nc-rating--sentiment-mid')).toBe(true)
    taste(r.sterne[2], 'ArrowRight')
    expect(r.wurzel.classList.contains('nc-rating--sentiment-high')).toBe(true)
    r.wurzel.querySelector('.nc-rating__clear').click()
    expect(r.wert()).toBe(0)
    expect(r.aktiv()).toBe(0)
    expect(r.wurzel.className).not.toMatch(/sentiment-(low|mid|high)/)
  })

  it('readonly (role="img") bleibt unberuehrt', () => {
    const b = buehne(zellenMarkup('rating', 'icon-types'))
    const vorher = b.innerHTML
    anbinden(b)
    expect(b.innerHTML.replace(/ data-neo-behavior="rating"/g, '')).toBe(vorher)
  })

  describe('Tasten aus dem Recipe', () => {
    const pruefungen = {
      ArrowRight: () => { const r = aufbau(); taste(r.sterne[2], 'ArrowRight'); expect(r.wert()).toBe(4); expect(r.aktiv()).toBe(4); expect(document.activeElement).toBe(r.sterne[3]) },
      ArrowUp: () => { const r = aufbau(); taste(r.sterne[2], 'ArrowUp'); expect(r.wert()).toBe(4) },
      ArrowLeft: () => {
        const r = aufbau(); taste(r.sterne[2], 'ArrowLeft'); expect(r.wert()).toBe(2)
        taste(r.sterne[1], 'ArrowLeft'); taste(r.sterne[0], 'ArrowLeft')
        expect(r.wert()).toBe(0) // vom ersten Stern aufs Null-Radio
        expect(r.aktiv()).toBe(0)
      },
      ArrowDown: () => { const r = aufbau(); taste(r.sterne[2], 'ArrowDown'); expect(r.wert()).toBe(2) },
      Home: () => { const r = aufbau(); taste(r.sterne[2], 'Home'); expect(r.wert()).toBe(1) },
      End: () => { const r = aufbau(); taste(r.sterne[2], 'End'); expect(r.wert()).toBe(5); expect(r.aktiv()).toBe(5) }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('rating', pruefungen))
    for (const t of tastenAus('rating')) it(t, () => pruefungen[t]())
  })
})

// ---------------------------------------------------------------------------
describe('Input (input-recipe.json)', () => {
  function aufbau () {
    const b = buehne(zelleMit('input', 'content-states', (h) => h.includes('nc-input__clear') && !/ disabled| value=/.test(h)))
    anbinden(b)
    const wurzel = b.querySelector('.nc-input-wrapper')
    return { b, wurzel, feld: wurzel.querySelector('input'), knopf: wurzel.querySelector('.nc-input__clear') }
  }

  it('Loeschknopf leert das Feld, meldet input und input-clear, Fokus zurueck', () => {
    const { wurzel, feld, knopf } = aufbau()
    feld.value = 'Hallo'
    const eingaben = sammle(feld, 'input')
    const ev = sammle(wurzel, 'input-clear')
    knopf.click()
    expect(feld.value).toBe('')
    expect(eingaben).toHaveLength(1)
    expect(document.activeElement).toBe(feld)
    expect(ev).toHaveLength(1)
    passtZumRecipe('input', ev[0])
    expect(ev[0].detail).toEqual({ previousValue: 'Hallo' })
  })

  it('schwebendes Label bleibt reines CSS: Felder mit placeholder bekommen kein data-empty', () => {
    const b = buehne(zellenMarkup('input', 'floating-label-states'))
    anbinden(b)
    expect(b.querySelector('input').hasAttribute('data-empty')).toBe(false)
  })

  it('JS-Rueckfall data-empty nur ohne placeholder; abbinden raeumt auf', () => {
    const b = buehne('<div class="nc-input-wrapper"><input class="nc-input" type="date" aria-label="Datum"><label class="nc-input__label">Datum</label></div>')
    anbinden(b)
    const feld = b.querySelector('input')
    expect(feld.dataset.empty).toBe('true')
    feld.value = '2026-10-02'
    feld.dispatchEvent(new Event('input'))
    expect(feld.dataset.empty).toBe('false')
    abbinden(b)
    expect(feld.hasAttribute('data-empty')).toBe(false)
  })

  describe('Tasten aus dem Recipe', () => {
    const leert = (t) => () => { const { feld, knopf } = aufbau(); feld.value = 'x'; taste(knopf, t); expect(feld.value).toBe('') }
    const pruefungen = { Enter: leert('Enter'), Space: leert('Space') }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('input', pruefungen))
    for (const t of tastenAus('input')) it(t, () => pruefungen[t]())
  })
})

// ---------------------------------------------------------------------------
describe('Formular-Behaviors: anbinden/abbinden', () => {
  const FAELLE = [
    ['segmented-control', 'all-states', (b) => b.querySelectorAll('.nc-segmented-control__item')[1].click(), 'segment-change'],
    ['toggle-group', 'toolbar-pattern', (b) => b.querySelectorAll('.nc-toggle-group__item')[1].click(), 'toggle-change'],
    ['switch', 'default-states', (b) => b.querySelector('[role="switch"]').click(), 'switch-change'],
    ['rating', 'interactive-states', (b) => taste(b.querySelectorAll('.nc-rating__input')[3], 'ArrowRight'), 'rating-change'],
    ['input', 'content-states', (b) => { b.querySelector('input').value = 'x'; b.querySelector('.nc-input__clear').click() }, 'input-clear']
  ]
  for (const [id, sp, tu, name] of FAELLE) {
    it(`${id}: doppelt gebunden wirkt einfach, nach dem Aufraeumen nicht mehr`, () => {
      const b = buehne(zellenMarkup(id, sp))
      const ev = sammle(b, name)
      const aufraeumen = anbinden(b, [id])
      anbinden(b, [id])
      anbinden(b)
      tu(b)
      expect(ev).toHaveLength(1)
      aufraeumen()
      expect(b.querySelector('[data-neo-behavior]')).toBeNull()
      tu(b)
      expect(ev).toHaveLength(1)
    })
  }
})
