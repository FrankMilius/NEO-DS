/**
 * Timeline (Plan v4, Phase 6b, 12.10.2026): Behavior timeline aus
 * neo-behaviors — 1:1 aus Drupal.behaviors.neoTimeline (neo_fe/js/
 * neo-theme.js). Markup wie das Twig der Website (block--block-content--
 * neo-timeline: <ol class="nc-timeline" data-timeline>). Jede Taste aus
 * `keyboard` und jedes Ereignis aus `events` wird geprueft.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH } from 'neo-behaviors'
import { buehne, taste, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

beforeEach(() => {
  // happy-dom bringt einen Beobachter mit, der nie meldet: Tests mit Sicht
  // stubben ihn selbst, sonst gilt „kein Beobachter"
  vi.stubGlobal('IntersectionObserver', undefined)
})
afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  delete window.matchMedia
})

const reduziert = () => { window.matchMedia = vi.fn((q) => ({ matches: q === '(prefers-reduced-motion: reduce)' })) }

/** Beobachter, dessen Rueckruf der Test ausloest */
function beobachter () {
  const b = { rueckruf: null, beobachtet: [], entfernt: [], getrennt: 0, opt: null }
  vi.stubGlobal('IntersectionObserver', class {
    constructor (cb, opt) { b.rueckruf = cb; b.opt = opt }
    observe (el) { b.beobachtet.push(el) }
    unobserve (el) { b.entfernt.push(el) }
    disconnect () { b.getrennt++ }
  })
  return b
}

const eintrag = (n) => `<li class="nc-timeline__item"><div class="nc-timeline__node" aria-hidden="true"></div>
<div class="nc-timeline__content"><h3 class="nc-timeline__title">Phase ${n}</h3><a class="nc-button nc-timeline__cta" href="#p${n}">Mehr</a></div></li>`
const markup = (n = 4) => `<section class="nc-section"><ol class="nc-timeline nc-timeline--alternating" data-timeline aria-label="Ablauf">${Array.from({ length: n }, (_, i) => eintrag(i + 1)).join('')}</ol></section>`

function bau (n) {
  const b = buehne(markup(n))
  const wurzel = /** @type {HTMLElement} */ (b.querySelector('[data-timeline]'))
  const fortschritt = sammle(wurzel, 'timeline-progress')
  anbinden(b, ['timeline'])
  return { b, wurzel, fortschritt, eintraege: /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-timeline__item')]) }
}

describe('timeline: Website-Bauteil', () => {
  it('nurAusdruecklich und in NUR_AUSDRUECKLICH (Drupal bindet nur per nur)', () => {
    expect(BEHAVIORS.timeline.nurAusdruecklich).toBe(true)
    expect(NUR_AUSDRUECKLICH).toContain('timeline')
  })

  it('ohne Binden nichts versteckt: keine nc-timeline--progress, kein Fortschritt', () => {
    const b = buehne(markup())
    const wurzel = b.querySelector('[data-timeline]')
    expect(wurzel.classList.contains('nc-timeline--progress')).toBe(false)
    expect(wurzel.style.getPropertyValue('--nc-timeline-progress')).toBe('')
  })

  it('reduzierte Bewegung: keine Einblendung, Linie sofort voll (Ereignis progress 1)', () => {
    reduziert()
    const b = beobachter()
    const { wurzel, fortschritt } = bau()
    expect(wurzel.classList.contains('nc-timeline--progress')).toBe(false)
    expect(wurzel.style.getPropertyValue('--nc-timeline-progress')).toBe('1')
    expect(b.beobachtet).toHaveLength(0)
    expect(fortschritt).toHaveLength(1)
    passtZumRecipe('timeline', fortschritt[0])
    expect(fortschritt[0].detail).toEqual({ progress: 1 })
  })

  it('ohne IntersectionObserver: Linie voll, nichts ausgeblendet', () => {
    const { wurzel } = bau()
    expect(wurzel.classList.contains('nc-timeline--progress')).toBe(false)
    expect(wurzel.style.getPropertyValue('--nc-timeline-progress')).toBe('1')
  })

  it('mit Beobachter: Klasse und Fortschritt 0, jeder Eintrag beobachtet (threshold 0.34, rootMargin wie neoTimeline)', () => {
    const b = beobachter()
    const { wurzel, eintraege } = bau()
    expect(wurzel.classList.contains('nc-timeline--progress')).toBe(true)
    expect(wurzel.style.getPropertyValue('--nc-timeline-progress')).toBe('0')
    expect(b.beobachtet).toEqual(eintraege)
    expect(b.opt).toEqual({ threshold: 0.34, rootMargin: '0px 0px -10% 0px' })
  })

  it('Eintraege im Bild: is-visible, nicht mehr beobachtet, Fuellhoehe = Anteil (3 Stellen), Ereignis je Aenderung', () => {
    const b = beobachter()
    const { wurzel, eintraege, fortschritt } = bau(3)
    b.rueckruf([{ target: eintraege[0], isIntersecting: true }, { target: eintraege[1], isIntersecting: false }])
    expect(eintraege[0].classList.contains('is-visible')).toBe(true)
    expect(eintraege[1].classList.contains('is-visible')).toBe(false)
    expect(b.entfernt).toEqual([eintraege[0]])
    expect(wurzel.style.getPropertyValue('--nc-timeline-progress')).toBe('0.333')
    b.rueckruf([{ target: eintraege[1], isIntersecting: true }, { target: eintraege[2], isIntersecting: true }])
    expect(wurzel.style.getPropertyValue('--nc-timeline-progress')).toBe('1.000')
    expect(fortschritt.map((e) => e.detail.progress)).toEqual([0.333, 0.667, 1])
    for (const e of fortschritt) passtZumRecipe('timeline', e)
  })

  it('Tasten aus dem Recipe: Tab erreicht die Links in den Karten (auch noch nicht eingeblendete)', () => {
    beobachter()
    const pruefungen = {
      Tab: () => {
        const { b } = bau()
        const links = [...b.querySelectorAll('.nc-timeline__cta')]
        const e = taste(links[0], 'Tab')
        // keine eigene Bedienung: das Behavior faengt nichts ab
        expect(e.defaultPrevented).toBe(false)
        expect(links.every((l) => l.tabIndex === 0)).toBe(true)
      }
    }
    deckeTastenAb('timeline', pruefungen)
    for (const p of Object.values(pruefungen)) { p(); document.body.innerHTML = '' }
  })

  it('Abbinden: Beobachter getrennt, Klasse, Fortschritt und is-visible zurueck; erneutes Binden geht', () => {
    const b = beobachter()
    const { b: buehne1, wurzel, eintraege } = bau()
    b.rueckruf([{ target: eintraege[0], isIntersecting: true }])
    abbinden(buehne1, ['timeline'])
    expect(b.getrennt).toBe(1)
    expect(wurzel.classList.contains('nc-timeline--progress')).toBe(false)
    expect(wurzel.style.getPropertyValue('--nc-timeline-progress')).toBe('')
    expect(eintraege[0].classList.contains('is-visible')).toBe(false)
    expect(wurzel.hasAttribute('data-neo-behavior')).toBe(false)
    anbinden(buehne1, ['timeline'])
    expect(wurzel.classList.contains('nc-timeline--progress')).toBe(true)
  })

  it('ohne Eintraege: nichts gesetzt', () => {
    beobachter()
    const b = buehne('<ol class="nc-timeline" data-timeline></ol>')
    anbinden(b, ['timeline'])
    expect(b.querySelector('ol').classList.contains('nc-timeline--progress')).toBe(false)
  })
})
