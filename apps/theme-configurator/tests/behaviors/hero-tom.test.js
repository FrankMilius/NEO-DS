/**
 * Hero-TOM (Plan v4, Phase 6b, 12.10.2026): Behavior hero-tom aus
 * neo-behaviors — Ausfahren des Mediums beim Scrollen (vorher
 * Drupal.behaviors.neoHeroTom in neo_fe/js/neo-theme.js, Lauscher nie
 * geloest). Markup wie das Twig der Website (data-media-mode="expand") und
 * wie die Arena. Jede Taste aus `keyboard` und jedes Ereignis aus `events`
 * wird geprueft.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH } from 'neo-behaviors'
import { buehne, taste, deckeTastenAb, sammle, passtZumRecipe, zellenMarkup } from './_helfer.js'

/** Frames, die der Test von Hand ausloest (Nummer → Rueckruf) */
let frames = new Map()
let nr = 0
beforeEach(() => {
  frames = new Map()
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((fn) => { frames.set(++nr, fn); return nr })
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((n) => { frames.delete(n) })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 })
})
const aufraeumen = () => { abbinden(document.body, ['hero-tom']); document.body.innerHTML = '' }
afterEach(() => {
  aufraeumen()
  vi.restoreAllMocks()
  delete window.matchMedia
})

const reduziert = () => { window.matchMedia = vi.fn((q) => ({ matches: q === '(prefers-reduced-motion: reduce)' })) }
const naechsterFrame = () => { const f = [...frames.values()]; frames.clear(); f.forEach((fn) => fn(0)) }
const scrolle = () => window.dispatchEvent(new Event('scroll'))

const markup = (modus = 'expand') => `<div class="block"><section class="nc-hero-tom nc-hero-tom--expand" data-neo-hero-tom data-media-mode="${modus}" style="min-height: 100svh;">
<div class="nc-hero-tom__media"><img src="b.jpg" alt=""><div class="nc-hero-tom__scrim"></div></div>
<div class="nc-hero-tom__content"><div class="nc-hero-tom__copy"><h2 class="nc-hero-tom__headline">Titel</h2><a href="#mehr">Mehr</a></div></div>
</section></div>`

/** Wurzel mit verstellbarer Oberkante */
function bau (html = markup(), oben = 1000) {
  const b = buehne(html)
  const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-hero-tom'))
  const lage = { oben }
  wurzel.getBoundingClientRect = () => /** @type {any} */ ({ top: lage.oben, bottom: lage.oben + 800, left: 0, right: 1440, width: 1440, height: 800 })
  const ereignisse = sammle(wurzel, 'hero-tom-expand')
  anbinden(b, ['hero-tom'])
  return { b, wurzel, lage, ereignisse, medium: /** @type {HTMLElement} */ (wurzel.querySelector('.nc-hero-tom__media')) }
}
const wert = (medium) => medium.style.getPropertyValue('--tom-expand')

describe('hero-tom: Website-Bauteil', () => {
  it('nurAusdruecklich und in NUR_AUSDRUECKLICH (Drupal bindet nur per nur)', () => {
    expect(BEHAVIORS['hero-tom'].nurAusdruecklich).toBe(true)
    expect(NUR_AUSDRUECKLICH).toContain('hero-tom')
  })

  it('bindet nur im Modus expand (fullwidth bleibt ohne Verhalten)', () => {
    const b = buehne(markup('fullwidth'))
    anbinden(b, ['hero-tom'])
    expect(b.querySelector('.nc-hero-tom').hasAttribute('data-neo-behavior')).toBe(false)
    expect(b.querySelector('.nc-hero-tom__media').getAttribute('style')).toBeNull()
  })

  it('beim Binden gemessen: Fortschritt = 1 - Oberkante/Fensterhoehe, begrenzt, 4 Stellen', () => {
    expect(wert(bau(markup(), 1000).medium)).toBe('0.0000')
    aufraeumen()
    expect(wert(bau(markup(), 250).medium)).toBe('0.7500')
    aufraeumen()
    expect(wert(bau(markup(), -40).medium)).toBe('1.0000')
    aufraeumen()
    expect(wert(bau(markup(), 1800).medium)).toBe('0.0000')
  })

  it('Scrollen: ein Durchlauf je Bild (gedrosselt), Wert folgt der Oberkante', () => {
    const { lage, medium } = bau()
    lage.oben = 600
    scrolle(); scrolle(); scrolle()
    expect([...frames.values()]).toHaveLength(1)
    expect(wert(medium)).toBe('0.0000')
    naechsterFrame()
    expect(wert(medium)).toBe('0.4000')
    lage.oben = 333
    scrolle(); naechsterFrame()
    expect(wert(medium)).toBe('0.6670')
  })

  it('hero-tom-expand nur beim Wechsel ganz ausgefahren / nicht mehr (nicht je Frame, nicht beim Binden)', () => {
    const { lage, ereignisse } = bau()
    expect(ereignisse).toHaveLength(0)
    for (const oben of [500, 200, 0, -100, 300]) { lage.oben = oben; scrolle(); naechsterFrame() }
    expect(ereignisse.map((e) => e.detail)).toEqual([{ expanded: true, progress: 1 }, { expanded: false, progress: 0.7 }])
    for (const e of ereignisse) passtZumRecipe('hero-tom', e)
  })

  it('reduzierte Bewegung: kein Lauscher, kein Inline-Wert (das SCSS faehrt ganz aus)', () => {
    reduziert()
    const plus = vi.spyOn(window, 'addEventListener')
    const { medium, lage } = bau()
    expect(plus.mock.calls.some(([typ]) => typ === 'scroll')).toBe(false)
    lage.oben = 100
    scrolle()
    expect(frames.size).toBe(0)
    expect(medium.getAttribute('style')).toBeNull()
  })

  it('Tasten aus dem Recipe: Tab — keine eigene Bedienung, nichts abgefangen', () => {
    const pruefungen = {
      Tab: () => {
        const { b } = bau()
        const link = b.querySelector('a')
        const e = taste(link, 'Tab')
        expect(e.defaultPrevented).toBe(false)
      }
    }
    deckeTastenAb('hero-tom', pruefungen)
    for (const p of Object.values(pruefungen)) { p(); aufraeumen() }
  })

  it('Abbinden loest den Scroll-Lauscher (vorher nie geloest), bricht den Frame ab, stellt den Inline-Wert her', () => {
    // Arena-Markup: Endzustand --tom-expand: 1 inline
    const { b, lage, medium } = bau(zellenMarkup('hero-tom', 'default'), 500)
    expect(wert(medium)).toBe('0.5000')
    lage.oben = 100
    scrolle()
    abbinden(b, ['hero-tom'])
    expect([...frames.values()]).toHaveLength(0)
    expect(wert(medium)).toBe('1')
    scrolle()
    expect([...frames.values()]).toHaveLength(0)
    expect(wert(medium)).toBe('1')
  })

  it('Abbinden ohne Inline-Wert vorher: Eigenschaft entfernt', () => {
    const { b, medium } = bau(markup(), 500)
    abbinden(b, ['hero-tom'])
    expect(medium.getAttribute('style') || '').toBe('')
  })
})
