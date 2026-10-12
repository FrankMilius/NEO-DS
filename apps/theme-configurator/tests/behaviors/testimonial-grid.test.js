/**
 * Testimonial-Grid (Plan v4, Phase 6a, 12.10.2026): Behavior testimonial-grid
 * aus neo-behaviors (vorher Drupal.behaviors.neoTestimonialCarousel in
 * neo-theme.js). Gebunden wird an Markup wie aus dem Twig von neo_fe und an
 * das Markup der Arena. Jede Taste aus `keyboard` und jedes Ereignis aus
 * `events` wird geprueft.
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH } from 'neo-behaviors'
import { buehne, lebendigesMarkup, taste, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

afterEach(() => {
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
  delete window.matchMedia
})

const klick = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
const KARTE = 360
const ABSTAND = 24
const SICHT = 800
const KARTEN = 5

/** Markup wie block--block-content--neo-testimonial-grid.html.twig (carousel) */
function websiteMarkup () {
  return `<div class="block"><section class="nc-section"><div class="nc-container">
<div class="nc-testimonial-grid nc-testimonial-grid--carousel" data-testimonial-carousel role="group" aria-roledescription="Karussell" aria-label="Stimmen" tabindex="0" style="column-gap: ${ABSTAND}px">
${Array.from({ length: KARTEN }, (_, i) => `<div class="block"><section class="nc-section"><div class="nc-container"><figure class="nc-testimonial"><blockquote>Zitat ${i + 1}</blockquote></figure></div></section></div>`).join('\n')}
</div>
<div class="nc-testimonial-grid__nav">
<button type="button" class="nc-testimonial-grid__btn" data-tc-prev aria-label="Vorherige Testimonials"><svg aria-hidden="true"></svg></button>
<button type="button" class="nc-testimonial-grid__btn" data-tc-next aria-label="Weitere Testimonials"><svg aria-hidden="true"></svg></button>
</div>
</div></section></div>`
}

/** Geometrie wie im Browser: Spur scrollbar bis zum Ende */
function geometrie (spur) {
  const breite = KARTEN * KARTE + (KARTEN - 1) * ABSTAND
  const max = breite - SICHT
  let links = 0
  Object.defineProperty(spur, 'scrollLeft', { configurable: true, get: () => links, set: (v) => { links = Math.max(0, Math.min(max, v)) } })
  Object.defineProperty(spur, 'clientWidth', { configurable: true, get: () => SICHT })
  Object.defineProperty(spur, 'scrollWidth', { configurable: true, get: () => breite })
  for (const k of spur.querySelectorAll('.nc-testimonial')) k.getBoundingClientRect = () => ({ width: KARTE, height: 300, left: 0, right: KARTE, top: 0, bottom: 300, x: 0, y: 0 })
  const aufrufe = []
  spur.scrollBy = (o) => { aufrufe.push(o); spur.scrollLeft = links + o.left; spur.dispatchEvent(new Event('scroll')) }
  return aufrufe
}

function bau (html = websiteMarkup()) {
  const b = buehne(html)
  const spur = /** @type {HTMLElement} */ (b.querySelector('.nc-testimonial-grid--carousel'))
  const aufrufe = geometrie(spur)
  anbinden(b, ['testimonial-grid'])
  return {
    b,
    spur,
    aufrufe,
    zurueck: /** @type {HTMLButtonElement} */ (b.querySelector('[data-tc-prev]')),
    vor: /** @type {HTMLButtonElement} */ (b.querySelector('[data-tc-next]'))
  }
}

describe('testimonial-grid: Website-Bauteil', () => {
  it('nurAusdruecklich und in NUR_AUSDRUECKLICH (Drupal bindet nur per nur)', () => {
    expect(BEHAVIORS['testimonial-grid'].nurAusdruecklich).toBe(true)
    expect(NUR_AUSDRUECKLICH).toContain('testimonial-grid')
  })

  it('Raster ohne Karussell: nichts gebunden', () => {
    const b = buehne('<div class="nc-testimonial-grid nc-testimonial-grid--cols-3"><figure class="nc-testimonial"></figure></div>')
    anbinden(b, ['testimonial-grid'])
    expect(b.querySelector('[data-neo-behavior]')).toBeNull()
  })
})

describe('testimonial-grid: Blaettern und Enden', () => {
  it('am Anfang „Zurueck" gesperrt; Weiter scrollt um Karte plus Abstand, weich', () => {
    const { spur, zurueck, vor, aufrufe } = bau()
    expect(spur.getAttribute('data-neo-behavior')).toBe('testimonial-grid')
    expect([zurueck.disabled, vor.disabled]).toEqual([true, false])
    klick(vor)
    expect(aufrufe.at(-1)).toEqual({ left: KARTE + ABSTAND, behavior: 'smooth' })
    expect([zurueck.disabled, vor.disabled]).toEqual([false, false])
  })

  it('reduzierte Bewegung: sofort statt weich', () => {
    window.matchMedia = (q) => ({ matches: /reduce/.test(q), media: q, addEventListener () {}, removeEventListener () {} })
    const { vor, aufrufe } = bau()
    klick(vor)
    expect(aufrufe.at(-1)?.behavior).toBe('instant')
  })

  it('am Ende „Weiter" gesperrt; der Fokus wandert auf „Zurueck" statt verloren zu gehen', () => {
    const { vor, zurueck } = bau()
    vor.focus()
    for (let i = 0; i < 6; i++) if (!vor.disabled) klick(vor)
    expect([zurueck.disabled, vor.disabled]).toEqual([false, true])
    expect(document.activeElement).toBe(zurueck)
    // und zurueck bis zum Anfang: Fokus auf „Weiter"
    for (let i = 0; i < 6; i++) if (!zurueck.disabled) klick(zurueck)
    expect([zurueck.disabled, vor.disabled]).toEqual([true, false])
    expect(document.activeElement).toBe(vor)
  })

  it('Scrollen der Spur (Wischen, Pfeile) fuehrt die Knoepfe nach', () => {
    const { spur, zurueck, vor } = bau()
    spur.scrollLeft = 10000; spur.dispatchEvent(new Event('scroll'))
    expect([zurueck.disabled, vor.disabled]).toEqual([false, true])
  })

  it('ohne ResizeObserver: Fenstergroesse fuehrt nach', () => {
    vi.stubGlobal('ResizeObserver', undefined)
    const { spur, zurueck } = bau()
    spur.scrollLeft = 500
    window.dispatchEvent(new Event('resize'))
    expect(zurueck.disabled).toBe(false)
  })

  it('jede Taste aus keyboard', () => {
    deckeTastenAb('testimonial-grid', {
      Tab: () => {
        const { b, spur, vor } = bau()
        const folge = [...b.querySelectorAll('[tabindex], button')].filter((e) => /** @type {HTMLElement} */ (e).tabIndex >= 0 && !(/** @type {HTMLButtonElement} */ (e).disabled))
        expect(folge).toEqual([spur, vor]) // „Zurueck" am Anfang gesperrt
      },
      ArrowRight: () => {
        const { spur, zurueck } = bau()
        const e = taste(spur, 'ArrowRight')
        expect(e.defaultPrevented).toBe(false) // nativ
        spur.scrollLeft = 40; spur.dispatchEvent(new Event('scroll'))
        expect(zurueck.disabled).toBe(false)
      },
      ArrowLeft: () => {
        const { spur, zurueck } = bau()
        spur.scrollLeft = 40; spur.dispatchEvent(new Event('scroll'))
        expect(taste(spur, 'ArrowLeft').defaultPrevented).toBe(false)
        spur.scrollLeft = 0; spur.dispatchEvent(new Event('scroll'))
        expect(zurueck.disabled).toBe(true)
      },
      Enter: () => {
        const { vor, aufrufe } = bau()
        taste(vor, 'Enter')
        expect(aufrufe).toHaveLength(1)
      },
      Space: () => {
        const { vor, zurueck, aufrufe } = bau()
        taste(vor, 'Space'); taste(zurueck, 'Space')
        expect(aufrufe.map((a) => a.left)).toEqual([KARTE + ABSTAND, -(KARTE + ABSTAND)])
      }
    })
  })

  it('Ereignis testimonial-grid-step wie im Recipe', () => {
    const { spur, vor, zurueck } = bau()
    const liste = sammle(spur, 'testimonial-grid-step')
    klick(vor); klick(zurueck)
    expect(liste.map((e) => e.detail.direction)).toEqual(['next', 'prev'])
    for (const e of liste) passtZumRecipe('testimonial-grid', e)
  })

  it('abbinden: Knoepfe ohne Wirkung, disabled wie vorher', () => {
    const { b, vor, zurueck, aufrufe } = bau()
    abbinden(b, ['testimonial-grid'])
    expect([zurueck.disabled, vor.disabled]).toEqual([false, false])
    klick(vor)
    expect(aufrufe).toHaveLength(0)
  })

  it('Arena (Ausprobieren, carousel): bindet an die Spur, Navigation als Geschwister', () => {
    const b = buehne(lebendigesMarkup('testimonial-grid', 'carousel'))
    const spur = /** @type {HTMLElement} */ (b.querySelector('.nc-testimonial-grid--carousel'))
    geometrie(spur)
    anbinden(b, ['testimonial-grid'])
    expect(spur.getAttribute('data-neo-behavior')).toBe('testimonial-grid')
    expect(/** @type {HTMLButtonElement} */ (b.querySelector('[data-tc-prev]')).disabled).toBe(true)
  })
})
