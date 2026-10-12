/**
 * Akkordeon-Block (Plan v4, Phase 6b, 12.10.2026): das Behavior accordion
 * uebernimmt Sprungziel, „nur eines offen + mitscrollen" und „Alle
 * aufklappen" aus Drupal.behaviors.neoAccordion (neo_fe/js/neo-theme.js).
 * Markup wie das Twig der Website (block--block-content--neo-accordion:
 * Knopf vor dem Akkordeon, data-neo-accordion, data-behavior). Ereignisse
 * und Texte aus dem Recipe accordion.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { anbinden, abbinden } from 'neo-behaviors'
import { TEXTE } from '../../../../packages/neo-behaviors/accordion.js'
import { rohesRecipe } from '../arena/_recipes.js'
import { buehne, taste, sammle, passtZumRecipe } from './_helfer.js'

let gescrollt = []
let fensterScroll = []
const rafVorher = window.requestAnimationFrame
beforeEach(() => {
  gescrollt = []
  fensterScroll = []
  history.replaceState(null, '', '/seite')
  Element.prototype.scrollIntoView = function (opt) { gescrollt.push([this.id, opt]) }
  vi.spyOn(window, 'scrollTo').mockImplementation((opt) => { fensterScroll.push(opt) })
  // naechstes Bild sofort
  window.requestAnimationFrame = (fn) => { fn(0); return 1 }
})
afterEach(() => {
  abbinden(document.body, ['accordion'])
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('lang')
  vi.restoreAllMocks()
  vi.useRealTimers()
  window.requestAnimationFrame = rafVorher
  delete Element.prototype.scrollIntoView
  delete window.matchMedia
})

const reduziert = () => { window.matchMedia = vi.fn((q) => ({ matches: q === '(prefers-reduced-motion: reduce)' })) }
const eintrag = (id, titel, name) => `<details class="nc-accordion__item" id="${id}"${name ? ` name="${name}"` : ''}>
<summary class="nc-accordion__trigger"><span class="nc-accordion__trigger-body"><span class="nc-accordion__trigger-text">${titel}</span></span></summary>
<div class="nc-accordion__content"><div class="nc-accordion__content-inner"><div class="nc-accordion__text">Text ${titel}</div></div></div></details>`

/** Block wie das Twig: behavior multiple|single|single-scroll, Knopf bei multiple */
function blockMarkup ({ behavior = 'multiple', knopf = behavior === 'multiple', basis = 'acc-7' } = {}) {
  const name = behavior.startsWith('single') ? basis : ''
  return `<section class="nc-section nc-accordion-block nc-accordion-block--zwei-drittel"><div class="nc-container nc-accordion-block__inner">
<div class="nc-accordion-block__text"><h2>Fragen</h2><a href="#zwei" class="verweis">Zum zweiten</a></div>
<div class="nc-accordion-block__accordion">
${knopf ? `<button type="button" class="nc-accordion-toggle-all" data-neo-accordion-toggle-all aria-controls="${basis}-liste" aria-expanded="false"><span data-label-auf>Alle aufklappen</span></button>` : ''}
<div class="nc-accordion nc-accordion--separated" id="${basis}-liste" data-neo-accordion data-behavior="${behavior}">
${eintrag('eins', 'Eins', name)}${eintrag('zwei', 'Zwei', name)}${eintrag('drei', 'Drei', name)}
</div></div></div></section>`
}

function bau (opt) {
  const b = buehne(blockMarkup(opt))
  const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-accordion'))
  const ziele = sammle(wurzel, 'accordion-target')
  const alle = sammle(wurzel, 'accordion-toggle-all')
  anbinden(b, ['accordion'])
  return {
    b,
    wurzel,
    ziele,
    alle,
    knopf: /** @type {HTMLButtonElement} */ (b.querySelector('[data-neo-accordion-toggle-all]')),
    eintraege: /** @type {HTMLDetailsElement[]} */ ([...wurzel.querySelectorAll('.nc-accordion__item')])
  }
}
const klick = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
const toggle = (d) => d.dispatchEvent(new Event('toggle'))

describe('accordion: Texte aus dem Recipe', () => {
  it('„Alle aufklappen/zuklappen" de/en wie constraints.copy.toggleAll', () => {
    const copy = rohesRecipe('accordion').constraints.copy.toggleAll
    expect(TEXTE).toEqual({ de: copy.de, en: copy.en })
  })
})

describe('accordion: Sprungziel (#eintrag)', () => {
  it('beim Binden: Eintrag aus dem Anker auf, sanft an den Anfang gescrollt, accordion-target', () => {
    history.replaceState(null, '', '/seite#zwei')
    const { eintraege, ziele } = bau()
    expect(eintraege.map((e) => e.open)).toEqual([false, true, false])
    expect(gescrollt).toEqual([['zwei', { behavior: 'smooth', block: 'start' }]])
    expect(ziele).toHaveLength(1)
    passtZumRecipe('accordion', ziele[0])
    expect(ziele[0].detail).toEqual({ itemId: 'zwei' })
  })

  it('reduzierte Bewegung: ohne sanftes Scrollen (vorher immer sanft)', () => {
    reduziert()
    history.replaceState(null, '', '/seite#drei')
    bau()
    expect(gescrollt).toEqual([['drei', { behavior: 'auto', block: 'start' }]])
  })

  it('hashchange oeffnet; unbekannte oder fremde Anker tun nichts', () => {
    const { eintraege, ziele } = bau()
    expect(gescrollt).toHaveLength(0)
    history.replaceState(null, '', '/seite#drei')
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    expect(eintraege[2].open).toBe(true)
    history.replaceState(null, '', '/seite#gibtsnicht')
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    expect(ziele.map((e) => e.detail.itemId)).toEqual(['drei'])
  })

  it('derselbe Verweis ein zweites Mal (kein hashchange): Eintrag wieder auf', () => {
    history.replaceState(null, '', '/seite#zwei')
    const { b, eintraege, ziele } = bau()
    eintraege[1].open = false
    klick(b.querySelector('a.verweis'))
    expect(eintraege[1].open).toBe(true)
    expect(ziele).toHaveLength(2)
  })

  it('Verweis auf ein anderes Ziel: nichts (das macht hashchange)', () => {
    history.replaceState(null, '', '/seite#eins')
    const { b, ziele } = bau()
    klick(b.querySelector('a.verweis'))
    expect(ziele).toHaveLength(1)
  })

  it('verschachtelt: der umschliessende Eintrag geht mit auf; das innere Akkordeon meldet', () => {
    history.replaceState(null, '', '/seite#innen')
    const b = buehne(`<div class="nc-accordion" id="aussen" data-neo-accordion>
<details class="nc-accordion__item" id="a1"><summary class="nc-accordion__trigger">A</summary><div class="nc-accordion__content">
<div class="nc-accordion nc-accordion--nested" id="innen-liste">${eintrag('innen', 'Innen')}</div></div></details></div>`)
    const aussen = sammle(b.querySelector('#aussen'), 'accordion-target')
    anbinden(b, ['accordion'])
    expect(b.querySelector('#a1').open).toBe(true)
    expect(b.querySelector('#innen').open).toBe(true)
    // das Ereignis kommt vom inneren Akkordeon und steigt durch das aeussere auf
    expect(aussen.map((e) => e.target.id)).toEqual(['innen-liste'])
  })
})

describe('accordion: nur eines offen + mitscrollen (data-behavior="single-scroll")', () => {
  const lage = (el, top) => { el.getBoundingClientRect = () => /** @type {any} */ ({ top, bottom: top + 56, left: 0, right: 600, width: 600, height: 56 }) }

  it('Kopf aus dem Bild: nach 100 ms unter die Kopfzeile zurueckgeholt (Abstand 16 px), sanft', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const { eintraege } = bau({ behavior: 'single-scroll' })
    const vorher = Object.getOwnPropertyDescriptor(window, 'scrollY')
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 2000 })
    lage(eintraege[2].querySelector('summary'), -400)
    eintraege[2].open = true
    toggle(eintraege[2])
    expect(fensterScroll).toHaveLength(0)
    vi.advanceTimersByTime(100)
    expect(fensterScroll).toEqual([{ top: 2000 - 400 - 16, behavior: 'smooth' }])
    if (vorher) Object.defineProperty(window, 'scrollY', vorher)
    else delete window.scrollY
  })

  it('Kopfzeile .site-header[data-neo-nav] zaehlt mit; reduzierte Bewegung ohne sanftes Scrollen', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    reduziert()
    const nav = document.createElement('header')
    nav.className = 'site-header'
    nav.setAttribute('data-neo-nav', '')
    Object.defineProperty(nav, 'offsetHeight', { value: 72 })
    document.body.prepend(nav)
    const { eintraege } = bau({ behavior: 'single-scroll' })
    lage(eintraege[0].querySelector('summary'), 40)
    eintraege[0].open = true
    toggle(eintraege[0])
    vi.advanceTimersByTime(100)
    expect(fensterScroll).toEqual([{ top: 0, behavior: 'auto' }])
  })

  it('Kopf im Bild: die Seite bleibt ruhig; Schliessen scrollt nie', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const { eintraege } = bau({ behavior: 'single-scroll' })
    lage(eintraege[1].querySelector('summary'), 200)
    eintraege[1].open = true
    toggle(eintraege[1])
    eintraege[0].open = false
    toggle(eintraege[0])
    vi.advanceTimersByTime(200)
    expect(fensterScroll).toHaveLength(0)
  })

  it('ohne single-scroll (multiple, single) kein Mitscrollen', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    for (const behavior of ['multiple', 'single']) {
      const { eintraege } = bau({ behavior })
      lage(eintraege[2].querySelector('summary'), -400)
      eintraege[2].open = true
      toggle(eintraege[2])
      vi.advanceTimersByTime(200)
      abbinden(document.body, ['accordion'])
      document.body.innerHTML = ''
    }
    expect(fensterScroll).toHaveLength(0)
  })

  it('Abbinden vor Ablauf: kein Scrollen mehr', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const { b, eintraege } = bau({ behavior: 'single-scroll' })
    lage(eintraege[2].querySelector('summary'), -400)
    eintraege[2].open = true
    toggle(eintraege[2])
    abbinden(b, ['accordion'])
    vi.advanceTimersByTime(200)
    expect(fensterScroll).toHaveLength(0)
  })
})

describe('accordion: Alle auf-/zuklappen', () => {
  it('Knopf oeffnet alle, dann schliesst er alle; aria-expanded, Beschriftung, accordion-toggle-all', () => {
    const { knopf, eintraege, alle } = bau()
    const text = () => knopf.querySelector('[data-label-auf]').textContent
    expect(knopf.getAttribute('aria-expanded')).toBe('false')
    expect(text()).toBe('Alle aufklappen')
    klick(knopf)
    expect(eintraege.every((e) => e.open)).toBe(true)
    expect(knopf.getAttribute('aria-expanded')).toBe('true')
    expect(text()).toBe('Alle zuklappen')
    klick(knopf)
    expect(eintraege.some((e) => e.open)).toBe(false)
    expect(text()).toBe('Alle aufklappen')
    expect(alle.map((e) => e.detail)).toEqual([{ open: true }, { open: false }])
    for (const e of alle) passtZumRecipe('accordion', e)
  })

  it('folgt dem Oeffnen von Hand: alle offen → „Alle zuklappen"', () => {
    const { knopf, eintraege } = bau()
    for (const e of eintraege) { e.open = true; toggle(e) }
    expect(knopf.getAttribute('aria-expanded')).toBe('true')
    expect(knopf.textContent.trim()).toBe('Alle zuklappen')
    eintraege[1].open = false
    toggle(eintraege[1])
    expect(knopf.getAttribute('aria-expanded')).toBe('false')
  })

  it('Sprache: en „Expand all/Collapse all"; eigene Texte per data-text-expand/-collapse', () => {
    document.documentElement.setAttribute('lang', 'en')
    const { knopf } = bau()
    expect(knopf.textContent.trim()).toBe('Expand all')
    klick(knopf)
    expect(knopf.textContent.trim()).toBe('Collapse all')
    abbinden(document.body, ['accordion'])
    document.body.innerHTML = ''
    const b = buehne(blockMarkup())
    const k = b.querySelector('[data-neo-accordion-toggle-all]')
    k.dataset.textExpand = 'Alles zeigen'
    k.dataset.textCollapse = 'Alles verbergen'
    anbinden(b, ['accordion'])
    expect(k.textContent.trim()).toBe('Alles zeigen')
  })

  it('Tasten aus dem Recipe am Knopf: Enter und Leertaste schalten alle (nativer Klick)', () => {
    const keyboard = rohesRecipe('accordion').keyboard
    expect(keyboard.Enter.note).toMatch(/Alle aufklappen/)
    expect(keyboard.Space.note).toMatch(/Alle aufklappen/)
    const { knopf, eintraege } = bau()
    taste(knopf, 'Enter')
    expect(eintraege.every((e) => e.open)).toBe(true)
    taste(knopf, 'Space')
    expect(eintraege.some((e) => e.open)).toBe(false)
  })

  it('Knopf eines anderen Akkordeons bleibt unberuehrt', () => {
    const b = buehne(blockMarkup({ basis: 'acc-1' }) + blockMarkup({ basis: 'acc-2' }))
    anbinden(b, ['accordion'])
    const [k1] = b.querySelectorAll('[data-neo-accordion-toggle-all]')
    klick(k1)
    expect([...b.querySelectorAll('#acc-1-liste details')].every((e) => e.open)).toBe(true)
    expect([...b.querySelectorAll('#acc-2-liste details')].some((e) => e.open)).toBe(false)
  })

  it('Abbinden: Beschriftung und aria-expanded wie vorher, Klick wirkt nicht mehr, hashchange auch nicht', () => {
    document.documentElement.setAttribute('lang', 'en')
    const { b, knopf, eintraege } = bau()
    klick(knopf)
    abbinden(b, ['accordion'])
    expect(knopf.textContent.trim()).toBe('Alle aufklappen')
    expect(knopf.getAttribute('aria-expanded')).toBe('false')
    for (const e of eintraege) e.open = false
    klick(knopf)
    expect(eintraege.some((e) => e.open)).toBe(false)
    history.replaceState(null, '', '/seite#zwei')
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    expect(eintraege[1].open).toBe(false)
  })
})
