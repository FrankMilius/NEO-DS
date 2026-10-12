/**
 * Tabellen-Block (Plan v4, Phase 5, 12.10.2026): Behavior table-block aus
 * neo-behaviors — Scroll-Grenze, benannte Scroll-Region nur bei Ueberlauf,
 * Schatten, gedrosseltes Messen — und der Name des Info-Dialogs je Knopf
 * (table-info-modal, data-info-label). Markup wie aus dem Twig von neo_fe
 * (die Tabelle rendert der Server, vorher neoTable im Browser). Jede Taste
 * aus `keyboard` und jedes Ereignis aus `events` wird geprueft.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH } from 'neo-behaviors'
import { buehne, lebendigesMarkup, taste, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

// happy-dom misst nicht: Breiten je Element von Hand, ResizeObserver als
// Attrappe, die der Test ausloest; requestAnimationFrame ueber falsche Timer.
const beobachter = []
class RO {
  constructor (cb) { this.cb = cb; this.ziele = []; beobachter.push(this) }
  observe (el) { this.ziele.push(el) }
  disconnect () { this.ziele = []; this.aus = true }
  melde () { if (!this.aus) this.cb(this.ziele.map((target) => ({ target }))) }
}
const meldeAlle = () => beobachter.forEach((b) => b.melde())

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] })
  vi.stubGlobal('ResizeObserver', RO)
  beobachter.length = 0
  fenster(1440)
})
afterEach(() => {
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('lang')
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

function fenster (breite) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: breite })
}
/** Breiten des Blocks (scrollWidth > clientWidth + 1 = Ueberlauf) */
function breiten (el, scroll, client) {
  Object.defineProperty(el, 'scrollWidth', { configurable: true, get: () => typeof scroll === 'function' ? scroll() : scroll })
  Object.defineProperty(el, 'clientWidth', { configurable: true, get: () => typeof client === 'function' ? client() : client })
}
const klick = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

const HAKEN = '<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none" role="img" aria-label="enthalten"><circle cx="18" cy="18" r="18"/><path d="M12 18L16 22L24 14" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const INFO = '<svg class="nc-tbl-info-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/></svg>'
const knopf = (zeile, spalte, info) => {
  const bezug = spalte ? `${zeile}, ${spalte}` : zeile
  return `<button type="button" class="nc-tbl-cell__info-btn" aria-label="Mehr Informationen zu ${bezug}" aria-controls="nc-table-info-34" aria-expanded="false" data-info="${info}" data-info-label="Informationen zu ${bezug}"> ${INFO}</button>`
}

/** Markup wie das Twig von neo_fe (block--block-content--neo-table.html.twig) */
function websiteMarkup ({ titel = 'Editionen im Vergleich', bp = '768' } = {}) {
  return `<div class="block"><section class="nc-section"><div class="nc-container">
${titel ? `<div class="nc-section-header nc-section-header--center"><h2 class="nc-section-header__title">${titel}</h2></div>` : ''}
<div class="nc-table-block" data-neo-table data-width="full" data-scroll-bp="${bp}" data-sticky-col="first" data-info-modal="nc-table-info-34">
<div class="nc-compare-table nc-compare-table--striped nc-compare-table--sticky-header nc-compare-table--full-width nc-compare-table--sticky-col">
<table><thead><tr><th scope="col">Feature Set</th><th scope="col">Standard</th><th scope="col">Premium</th></tr></thead><tbody>
<tr><th scope="row"><div class="nc-tbl-cell"><p class="nc-tbl-cell__text">Cloud${knopf('Cloud', '', 'ISO 27001')}</p><p class="nc-tbl-cell__sub">EU, Deutschland</p></div></th><td><div class="nc-tbl-cell nc-tbl-cell--icon">${HAKEN}</div></td><td><div class="nc-tbl-cell"><p class="nc-tbl-cell__text"><strong>Optional</strong>${knopf('Cloud', 'Premium', 'Aufpreis\nje Mandant')}</p></div></td></tr>
</tbody></table></div></div>
<div class="nc-table-info-modal" id="nc-table-info-34" aria-hidden="true" role="dialog"><div class="nc-table-info-modal__backdrop" data-modal-close></div><div class="nc-table-info-modal__content"><button class="nc-table-info-modal__close" data-modal-close aria-label="Schliessen">x</button><div class="nc-table-info-modal__body"></div></div></div>
</div></section></div>`
}

function bau (optionen, { scroll = 1200, client = 1200 } = {}) {
  const b = buehne(websiteMarkup(optionen))
  const block = /** @type {HTMLElement} */ (b.querySelector('.nc-table-block'))
  breiten(block, scroll, client)
  anbinden(b, ['table-info-modal', 'table-block'])
  return { b, block }
}
const region = (el) => [el.getAttribute('role'), el.getAttribute('aria-label'), el.getAttribute('tabindex')]

describe('table-block: Website-Bauteil', () => {
  it('nurAusdruecklich und in NUR_AUSDRUECKLICH', () => {
    expect(BEHAVIORS['table-block'].nurAusdruecklich).toBe(true)
    expect(NUR_AUSDRUECKLICH).toContain('table-block')
  })

  it('bindet nur, wenn ausdruecklich genannt (Drupal nur[]), genau einmal', () => {
    const b = buehne(websiteMarkup())
    anbinden(b, ['table-info-modal'])
    expect(b.querySelector('.nc-table-block').hasAttribute('data-scroll-active')).toBe(false)
    anbinden(b, ['table-block'])
    anbinden(b, ['table-block'])
    expect(b.querySelector('.nc-table-block').getAttribute('data-neo-behavior')).toBe('table-block')
    expect(beobachter).toHaveLength(1)
  })
})

describe('table-block: Scroll-Grenze', () => {
  it('Fenster ueber der Grenze: data-scroll-active=false; darunter true', () => {
    fenster(1440)
    expect(bau().block.getAttribute('data-scroll-active')).toBe('false')
    document.body.innerHTML = ''
    fenster(375)
    expect(bau().block.getAttribute('data-scroll-active')).toBe('true')
  })

  it('genau an der Grenze nicht aktiv (wie neoTable: innerWidth < Grenze)', () => {
    fenster(768)
    expect(bau().block.getAttribute('data-scroll-active')).toBe('false')
  })

  it('ohne oder mit 0 als Grenze nie aktiv', () => {
    fenster(320)
    expect(bau({ bp: '0' }).block.getAttribute('data-scroll-active')).toBe('false')
    document.body.innerHTML = ''
    expect(bau({ bp: '' }).block.getAttribute('data-scroll-active')).toBe('false')
  })

  it('Fenster-resize: gedrosselt, ein Durchlauf je Bild', () => {
    const { block } = bau()
    const auf = sammle(block, 'table-block-change')
    const setze = vi.spyOn(block, 'setAttribute')
    fenster(375)
    for (let i = 0; i < 10; i++) window.dispatchEvent(new Event('resize'))
    expect(block.getAttribute('data-scroll-active')).toBe('false')
    vi.advanceTimersToNextFrame()
    expect(block.getAttribute('data-scroll-active')).toBe('true')
    expect(setze.mock.calls.filter(([a]) => a === 'data-scroll-active')).toHaveLength(1)
    expect(auf).toHaveLength(1)
    expect(auf[0].detail).toEqual({ scrollActive: true, overflow: false })
    passtZumRecipe('table-block', auf[0])
  })
})

describe('table-block: Scroll-Region nur bei Ueberlauf', () => {
  it('ohne Ueberlauf: keine Region, kein Tab-Halt', () => {
    const { block } = bau(undefined, { scroll: 1200, client: 1200 })
    expect(region(block)).toEqual([null, null, null])
  })

  it('1 px Ueberlauf zaehlt nicht (Rundung), 2 px schon', () => {
    expect(region(bau(undefined, { scroll: 1201, client: 1200 }).block)).toEqual([null, null, null])
    document.body.innerHTML = ''
    expect(region(bau(undefined, { scroll: 1202, client: 1200 }).block)).toEqual(['region', 'Editionen im Vergleich', '0'])
  })

  it('Name: Blocktitel, sonst data-scroll-label, sonst „Tabelle“/„Table“ nach lang', () => {
    const ueber = { scroll: 600, client: 343 }
    expect(bau({ titel: '' }, ueber).block.getAttribute('aria-label')).toBe('Tabelle')
    document.body.innerHTML = ''
    document.documentElement.setAttribute('lang', 'en')
    expect(bau({ titel: '' }, ueber).block.getAttribute('aria-label')).toBe('Table')
    document.body.innerHTML = ''
    const b = buehne(websiteMarkup({ titel: '' }))
    const block = /** @type {HTMLElement} */ (b.querySelector('.nc-table-block'))
    block.dataset.scrollLabel = 'Preise'
    breiten(block, 600, 343)
    anbinden(b, ['table-block'])
    expect(block.getAttribute('aria-label')).toBe('Preise')
  })

  it('ResizeObserver: Ueberlauf kommt und geht, gedrosselt; Ereignis je Aenderung', () => {
    let scroll = 1200
    const { block } = bau(undefined, { scroll: () => scroll, client: 1200 })
    expect(beobachter[0].ziele).toEqual([block, block.querySelector('table')])
    const auf = sammle(block, 'table-block-change')
    scroll = 1500
    meldeAlle(); meldeAlle(); meldeAlle()
    expect(block.getAttribute('role')).toBe(null)
    vi.advanceTimersToNextFrame()
    expect(region(block)).toEqual(['region', 'Editionen im Vergleich', '0'])
    expect(auf.map((e) => e.detail)).toEqual([{ scrollActive: false, overflow: true }])
    scroll = 1200
    meldeAlle()
    vi.advanceTimersToNextFrame()
    expect(region(block)).toEqual([null, null, null])
    expect(auf.at(-1).detail).toEqual({ scrollActive: false, overflow: false })
    // unveraendert: kein Ereignis
    meldeAlle()
    vi.advanceTimersToNextFrame()
    expect(auf).toHaveLength(2)
    for (const e of auf) passtZumRecipe('table-block', e)
  })

  it('Region im Markup bleibt unangetastet', () => {
    const b = buehne(websiteMarkup())
    const block = /** @type {HTMLElement} */ (b.querySelector('.nc-table-block'))
    block.setAttribute('role', 'region')
    block.setAttribute('aria-label', 'Fest')
    breiten(block, 1200, 1200)
    anbinden(b, ['table-block'])
    expect(region(block)).toEqual(['region', 'Fest', null])
  })
})

describe('table-block: Schatten', () => {
  it('.is-scrolled ab mehr als 5 px', () => {
    const { block } = bau(undefined, { scroll: 600, client: 343 })
    block.scrollLeft = 5
    block.dispatchEvent(new Event('scroll'))
    expect(block.classList.contains('is-scrolled')).toBe(false)
    block.scrollLeft = 6
    block.dispatchEvent(new Event('scroll'))
    expect(block.classList.contains('is-scrolled')).toBe(true)
    block.scrollLeft = 0
    block.dispatchEvent(new Event('scroll'))
    expect(block.classList.contains('is-scrolled')).toBe(false)
  })
})

describe('table-block: Tasten aus dem Recipe', () => {
  it('Tab erreicht den Block nur bei Ueberlauf; Pfeile bleiben beim Browser', () => {
    const { block } = bau(undefined, { scroll: 600, client: 343 })
    const pruefungen = {
      Tab: () => {
        expect(block.tabIndex).toBe(0)
        block.focus()
        expect(document.activeElement).toBe(block)
      },
      ArrowLeft: () => { expect(taste(block, 'ArrowLeft').defaultPrevented).toBe(false) },
      ArrowRight: () => { expect(taste(block, 'ArrowRight').defaultPrevented).toBe(false) }
    }
    deckeTastenAb('table-block', pruefungen)
    for (const p of Object.values(pruefungen)) p()
  })
})

describe('table-block: Abbinden', () => {
  it('nimmt Zustand, Region, Schatten und Beobachter zurueck', () => {
    let scroll = 600
    const { b, block } = bau(undefined, { scroll: () => scroll, client: 343 })
    block.scrollLeft = 40
    block.dispatchEvent(new Event('scroll'))
    abbinden(b, ['table-block'])
    expect(block.hasAttribute('data-scroll-active')).toBe(false)
    expect(region(block)).toEqual([null, null, null])
    expect(block.classList.contains('is-scrolled')).toBe(false)
    expect(beobachter[0].aus).toBe(true)
    // gebunden lauscht nichts mehr
    scroll = 1200
    window.dispatchEvent(new Event('resize'))
    vi.advanceTimersToNextFrame()
    expect(block.hasAttribute('data-scroll-active')).toBe(false)
  })

  it('geplanter Durchlauf faellt beim Abbinden weg', () => {
    const { b, block } = bau()
    fenster(375)
    window.dispatchEvent(new Event('resize'))
    abbinden(b, ['table-block'])
    vi.advanceTimersToNextFrame()
    expect(block.hasAttribute('data-scroll-active')).toBe(false)
  })
})

describe('table-block: Arena „Ausprobieren“', () => {
  it('bindet an das Markup der Arena (Specimen default)', () => {
    const b = buehne(lebendigesMarkup('table-block', 'default'))
    anbinden(b, ['table-block'])
    expect(b.querySelector('.nc-table-block').getAttribute('data-neo-behavior')).toBe('table-block')
    expect(b.querySelector('.nc-table-block').getAttribute('data-scroll-active')).toBe('false')
  })
})

describe('table-info-modal: Name je Knopf aus data-info-label (Plan v4, Phase 5)', () => {
  it('jeder Knopf benennt den Dialog nach Zeile und Spalte; Text als Absaetze; Fokus zurueck', () => {
    const { b } = bau()
    const dialog = /** @type {HTMLElement} */ (b.querySelector('.nc-table-info-modal'))
    const [k1, k2] = /** @type {HTMLButtonElement[]} */ ([...b.querySelectorAll('.nc-tbl-cell__info-btn')])
    k1.focus(); klick(k1)
    expect(dialog.getAttribute('aria-label')).toBe('Informationen zu Cloud')
    expect(k1.getAttribute('aria-expanded')).toBe('true')
    taste(document.activeElement, 'Escape')
    expect(document.activeElement).toBe(k1)
    k2.focus(); klick(k2)
    expect(dialog.getAttribute('aria-label')).toBe('Informationen zu Cloud, Premium')
    expect([...dialog.querySelectorAll('.nc-table-info-modal__body > p')].map((p) => p.textContent)).toEqual(['Aufpreis', 'je Mandant'])
    klick(dialog.querySelector('.nc-table-info-modal__close'))
    expect(document.activeElement).toBe(k2)
  })

  it('aria-labelledby im Markup hat Vorrang', () => {
    const { b } = bau()
    const dialog = /** @type {HTMLElement} */ (b.querySelector('.nc-table-info-modal'))
    dialog.setAttribute('aria-labelledby', 'x')
    klick(b.querySelector('.nc-tbl-cell__info-btn'))
    expect(dialog.hasAttribute('aria-label')).toBe(false)
  })

  it('ohne data-info-label wie bisher: Name des Knopfs, nur wenn der Dialog keinen hat', () => {
    const { b } = bau()
    const dialog = /** @type {HTMLElement} */ (b.querySelector('.nc-table-info-modal'))
    const [k1, k2] = [...b.querySelectorAll('.nc-tbl-cell__info-btn')]
    k1.removeAttribute('data-info-label'); k2.removeAttribute('data-info-label')
    klick(k1)
    expect(dialog.getAttribute('aria-label')).toBe('Mehr Informationen zu Cloud')
    klick(dialog.querySelector('.nc-table-info-modal__close'))
    klick(k2)
    expect(dialog.getAttribute('aria-label')).toBe('Mehr Informationen zu Cloud')
  })

  it('Abbinden stellt den Namen von vorher wieder her', () => {
    const { b } = bau()
    const dialog = /** @type {HTMLElement} */ (b.querySelector('.nc-table-info-modal'))
    klick(b.querySelector('.nc-tbl-cell__info-btn'))
    klick(dialog.querySelector('.nc-table-info-modal__close'))
    abbinden(b, ['table-info-modal'])
    expect(dialog.hasAttribute('aria-label')).toBe(false)
  })
})
