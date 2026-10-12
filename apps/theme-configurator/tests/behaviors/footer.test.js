/**
 * Footer (Plan v4, Phase 6b, 12.10.2026): Behavior footer aus neo-behaviors
 * — Knopf „Nach oben" (vorher Drupal.behaviors.neoBackToTop in neo_fe/js/
 * neo-theme.js; der Fokus blieb unten am Knopf, WCAG 2.4.3). Markup wie die
 * Seite der Website (page.html.twig: main#main-content; Footer-Block mit
 * button[data-back-to-top]). Jede Taste aus `keyboard` und jedes Ereignis aus
 * `events` wird geprueft.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH } from 'neo-behaviors'
import { buehne, taste, deckeTastenAb, sammle, passtZumRecipe, zellenMarkup, lebendigesMarkup } from './_helfer.js'
import { rohesRecipe } from '../arena/_recipes.js'

let gescrollt = []
beforeEach(() => {
  gescrollt = []
  vi.spyOn(window, 'scrollTo').mockImplementation((opt) => { gescrollt.push(opt) })
})
afterEach(() => {
  abbinden(document.body, ['footer'])
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  delete window.matchMedia
})

const reduziert = () => { window.matchMedia = vi.fn((q) => ({ matches: q === '(prefers-reduced-motion: reduce)' })) }

const KNOPF = (ziel = '') => `<button type="button" class="nc-footer__backtotop" data-back-to-top${ziel ? `="${ziel}"` : ''} aria-label="Nach oben">
<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg><span>Nach oben</span></button>`
const seite = ({ main = true, ziel = '' } = {}) => `<a href="#main-content" class="nc-shell__skip-link">Zum Inhalt springen</a>
${main ? '<main id="main-content" class="nc-shell__content-body" role="main"><h1 id="titel">Seite</h1><a href="#a" id="erster">Erster Link</a></main>' : '<div class="inhalt"><a href="#a" id="erster">Erster Link</a></div>'}
<div class="block"><footer class="nc-footer nc-footer--inverse" role="contentinfo" aria-label="Footer"><div class="nc-footer__inner nc-container">
<div class="nc-footer__bottom"><div class="nc-footer__legal"><nav class="nc-footer__legal-links" aria-label="Rechtliches"><a href="/impressum">Impressum</a></nav></div>
${KNOPF(ziel)}</div></div></footer></div>`

function bau (opt) {
  const b = buehne(seite(opt))
  const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-footer'))
  const ereignisse = sammle(wurzel, 'footer-back-to-top')
  anbinden(b, ['footer'])
  return { b, wurzel, ereignisse, knopf: /** @type {HTMLButtonElement} */ (b.querySelector('[data-back-to-top]')), main: b.querySelector('main') }
}
const klick = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

describe('footer: Website-Bauteil', () => {
  it('nurAusdruecklich und in NUR_AUSDRUECKLICH (Drupal bindet nur per nur)', () => {
    expect(BEHAVIORS.footer.nurAusdruecklich).toBe(true)
    expect(NUR_AUSDRUECKLICH).toContain('footer')
  })

  it('Klick: sanft an den Anfang, Fokus auf den Hauptinhalt (tabindex=-1, ohne Mitscrollen), footer-back-to-top', () => {
    const { knopf, main, ereignisse } = bau()
    const fokus = vi.spyOn(main, 'focus')
    knopf.focus()
    klick(knopf)
    expect(gescrollt).toEqual([{ top: 0, behavior: 'smooth' }])
    expect(document.activeElement).toBe(main)
    expect(main.getAttribute('tabindex')).toBe('-1')
    expect(fokus).toHaveBeenCalledWith({ preventScroll: true })
    expect(ereignisse).toHaveLength(1)
    passtZumRecipe('footer', ereignisse[0])
    expect(ereignisse[0].detail).toEqual({ target: 'main-content' })
  })

  it('verlaesst der Fokus den Hauptinhalt, ist er wieder ohne tabindex', () => {
    const { b, knopf, main } = bau()
    klick(knopf)
    b.querySelector('#erster').focus()
    expect(main.hasAttribute('tabindex')).toBe(false)
  })

  it('reduzierte Bewegung: ohne sanftes Scrollen (wie bisher), Fokus trotzdem oben', () => {
    reduziert()
    const { knopf, main } = bau()
    klick(knopf)
    expect(gescrollt).toEqual([{ top: 0, behavior: 'auto' }])
    expect(document.activeElement).toBe(main)
  })

  it('Ziel per data-back-to-top="#id"; fokussierbares Ziel bekommt kein tabindex', () => {
    const { knopf, b, ereignisse } = bau({ ziel: '#erster' })
    klick(knopf)
    const ziel = b.querySelector('#erster')
    expect(document.activeElement).toBe(ziel)
    expect(ziel.hasAttribute('tabindex')).toBe(false)
    expect(ereignisse[0].detail).toEqual({ target: 'erster' })
  })

  it('ohne main: body (Seitenanfang), target null', () => {
    const { knopf, ereignisse } = bau({ main: false })
    klick(knopf)
    expect(document.activeElement).toBe(document.body)
    expect(ereignisse[0].detail).toEqual({ target: null })
  })

  it('Tasten aus dem Recipe', () => {
    const pruefungen = {
      Tab: () => {
        const { knopf } = bau()
        const e = taste(knopf, 'Tab')
        expect(e.defaultPrevented).toBe(false)
        expect(gescrollt).toHaveLength(0)
      },
      Enter: () => {
        const { knopf, main } = bau()
        knopf.focus()
        taste(knopf, 'Enter')
        expect(gescrollt.at(-1)).toEqual({ top: 0, behavior: 'smooth' })
        expect(document.activeElement).toBe(main)
      },
      Space: () => {
        const { knopf, main } = bau()
        knopf.focus()
        taste(knopf, 'Space')
        expect(document.activeElement).toBe(main)
      }
    }
    deckeTastenAb('footer', pruefungen)
    for (const p of Object.values(pruefungen)) { p(); abbinden(document.body, ['footer']); document.body.innerHTML = '' }
  })

  it('Abbinden: Klick wirkt nicht mehr, gesetztes tabindex weg', () => {
    const { b, knopf, main } = bau()
    klick(knopf)
    abbinden(b, ['footer'])
    expect(main.hasAttribute('tabindex')).toBe(false)
    knopf.focus()
    klick(knopf)
    expect(gescrollt).toHaveLength(1)
    expect(document.activeElement).toBe(knopf)
  })
})

describe('footer: Arena „Ausprobieren"', () => {
  it('nur in „Ausprobieren" mit Knopf „Nach oben"; Klick fokussiert den Hauptinhalt', () => {
    expect(zellenMarkup('footer')).not.toContain('data-back-to-top')
    const b = buehne('<main id="arena-main"><p>Arena</p></main>' + lebendigesMarkup('footer', rohesRecipe('footer').specimens[0].id))
    anbinden(b, ['footer'])
    const knopf = b.querySelector('.nc-footer [data-back-to-top]')
    expect(knopf).not.toBeNull()
    klick(knopf)
    expect(document.activeElement).toBe(b.querySelector('main'))
  })
})
