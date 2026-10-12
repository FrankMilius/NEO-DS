/**
 * Laufband (Plan v4, Phase 2, 12.10.2026, WCAG 2.2.2): Behavior marquee aus
 * neo-behaviors — fuer den Lauftext .nc-marquee und das Logo-Laufband
 * .nc-logo-wall--marquee (Markup wie neo_fe: Twig mit Knopf vor der Spur,
 * neoLogoWall fuellt die Spur aus JSON, Kopien aria-hidden). Jede Taste aus
 * `keyboard` und jedes Ereignis aus `events` wird geprueft.
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH } from 'neo-behaviors'
import { buehne, lebendigesMarkup, zellenMarkup, taste, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

afterEach(() => {
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('lang')
  delete window.matchMedia
})

const klick = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

const LOGOS = ['AWO', 'Dataport', 'Festo']

/** Logo-Laufband wie neo_fe nach neoLogoWall */
function logoMarkup ({ knopf = true, links = true } = {}) {
  const pille = (n, kopie) => links
    ? `<a class="nc-logo-pill" href="https://${n.toLowerCase()}.example" target="_blank" rel="noopener noreferrer"${kopie ? ' aria-hidden="true"' : ''}><img class="nc-logo-pill__img" src="x.png" alt="${n}"><span class="u-sr-only"> (öffnet in neuem Fenster)</span></a>`
    : `<div class="nc-logo-pill"${kopie ? ' aria-hidden="true"' : ''}><img class="nc-logo-pill__img" src="x.png" alt="${n}"></div>`
  return `<section class="nc-section"><div class="nc-container">
<div class="nc-logo-wall nc-logo-wall--marquee" data-neo-logo-wall data-layout="marquee">
${knopf ? '<button type="button" class="nc-logo-wall__pause" data-playing="true"><svg class="nc-logo-wall__pause-icon" aria-hidden="true"></svg><span class="nc-logo-wall__pause-label">Laufband anhalten</span></button>' : ''}
<div class="nc-logo-wall__track">${LOGOS.map((n) => pille(n, false)).join('')}${LOGOS.map((n) => pille(n, true)).join('')}</div>
</div></div></section>`
}

function bau (html = logoMarkup()) {
  const b = buehne(html)
  anbinden(b, ['marquee'])
  const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-logo-wall--marquee, .nc-marquee'))
  return {
    b,
    wurzel,
    knopf: /** @type {HTMLButtonElement} */ (wurzel.querySelector(':scope > .nc-logo-wall__pause, :scope > .nc-marquee__pause')),
    spur: /** @type {HTMLElement} */ (wurzel.querySelector(':scope > .nc-logo-wall__track, :scope > .nc-marquee__track'))
  }
}
const tabFolge = (wurzel) => [...wurzel.querySelectorAll('a[href], button')].filter((e) => e.tabIndex >= 0 && !e.closest('[inert], [hidden]'))
const kopien = (spur) => /** @type {HTMLElement[]} */ ([...spur.children]).filter((g) => g.getAttribute('aria-hidden') === 'true')
const label = (k) => k.querySelector('[class$="__pause-label"]')?.textContent

describe('marquee: Website-Bauteil', () => {
  it('nurAusdruecklich und in NUR_AUSDRUECKLICH', () => {
    expect(BEHAVIORS.marquee.nurAusdruecklich).toBe(true)
    expect(NUR_AUSDRUECKLICH).toContain('marquee')
  })

  it('leere Spur (Theme fuellt sie erst aus JSON): bindet nichts', () => {
    const b = buehne('<div class="nc-logo-wall nc-logo-wall--marquee"><div class="nc-logo-wall__track"></div></div>')
    anbinden(b, ['marquee'])
    expect(b.querySelector('.nc-logo-wall__pause')).toBeNull()
  })

  it('Duplikate: aria-hidden, tabindex -1, nicht inert (Maus bleibt); Originale unberuehrt', () => {
    const { spur } = bau()
    const glieder = /** @type {HTMLElement[]} */ ([...spur.children])
    expect(glieder.map((g) => g.inert)).toEqual([false, false, false, false, false, false])
    expect(glieder.map((g) => g.getAttribute('tabindex'))).toEqual([null, null, null, '-1', '-1', '-1'])
    expect(kopien(spur).every((g) => g.getAttribute('aria-hidden') === 'true')).toBe(true)
  })

  it('Duplikate: auch Fokussierbares im Inneren bekommt tabindex -1; Klick auf eine Kopie kommt an', () => {
    const b = buehne('<div class="nc-marquee"><div class="nc-marquee__track"><span class="nc-marquee__text"><a href="#a">A</a></span><span class="nc-marquee__text" aria-hidden="true"><a href="#a">A</a><button type="button" tabindex="0">B</button></span></div></div>')
    anbinden(b, ['marquee'])
    const kopie = /** @type {HTMLElement} */ (b.querySelector('.nc-marquee__text[aria-hidden="true"]'))
    expect([...kopie.querySelectorAll('a, button')].map((e) => e.getAttribute('tabindex'))).toEqual(['-1', '-1'])
    expect(b.querySelector('.nc-marquee__text:not([aria-hidden]) a')?.hasAttribute('tabindex')).toBe(false)
    let geklickt = 0
    kopie.querySelector('a')?.addEventListener('click', (e) => { e.preventDefault(); geklickt++ })
    klick(/** @type {HTMLElement} */ (kopie.querySelector('a')))
    expect(geklickt).toBe(1)
    abbinden(b, ['marquee'])
    expect([...kopie.querySelectorAll('a, button')].map((e) => e.getAttribute('tabindex'))).toEqual([null, '0'])
  })
})

describe('marquee: Tastatur (keyboard aus dem Recipe)', () => {
  it('jede Taste aus keyboard', () => {
    deckeTastenAb('marquee', {
      Tab: () => {
        const { wurzel, knopf } = bau()
        const folge = tabFolge(wurzel)
        expect(folge[0]).toBe(knopf)
        expect(folge.slice(1).map((a) => a.getAttribute('href'))).toEqual(LOGOS.map((n) => `https://${n.toLowerCase()}.example`))
      },
      Enter: () => {
        const { knopf, wurzel } = bau()
        taste(knopf, 'Enter')
        expect(knopf.getAttribute('data-playing')).toBe('false')
        expect(wurzel.classList.contains('is-stopped')).toBe(true)
      },
      Space: () => {
        const { knopf, wurzel } = bau()
        taste(knopf, 'Space'); taste(knopf, 'Space')
        expect(knopf.getAttribute('data-playing')).toBe('true')
        expect(wurzel.classList.contains('is-stopped')).toBe(false)
      }
    })
  })
})

describe('marquee: Knopf, Ruhe, Ereignisse', () => {
  it('Knopf: Beschriftung und Symbol wechseln, .is-stopped', () => {
    const { knopf, wurzel } = bau()
    expect(label(knopf)).toBe('Laufband anhalten')
    klick(knopf)
    expect(label(knopf)).toBe('Laufband fortsetzen')
    expect(knopf.getAttribute('data-playing')).toBe('false')
    expect(wurzel.classList.contains('is-stopped')).toBe(true)
    klick(knopf)
    expect(label(knopf)).toBe('Laufband anhalten')
  })

  it('Maus ueber der Spur und Fokus im Laufband: .is-paused; ueber/auf dem Knopf nicht', () => {
    const { knopf, wurzel, spur } = bau()
    spur.firstElementChild.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    expect(wurzel.classList.contains('is-paused')).toBe(true)
    knopf.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    expect(wurzel.classList.contains('is-paused')).toBe(false)
    spur.firstElementChild.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    wurzel.dispatchEvent(new MouseEvent('mouseleave'))
    expect(wurzel.classList.contains('is-paused')).toBe(false)
    const link = /** @type {HTMLElement} */ (spur.querySelector('a'))
    link.focus()
    expect(wurzel.classList.contains('is-paused')).toBe(true)
    knopf.focus()
    expect(wurzel.classList.contains('is-paused')).toBe(false)
    // angehalten: keine Ruhe-Klasse, .is-stopped genuegt
    klick(knopf); link.focus()
    expect(wurzel.classList.contains('is-paused')).toBe(false)
    expect(wurzel.classList.contains('is-stopped')).toBe(true)
  })

  it('marquee-autoplay { playing, reason } fuer knopf, hover, fokus', () => {
    const { knopf, wurzel, spur } = bau()
    const ap = sammle(wurzel, 'marquee-autoplay')
    spur.firstElementChild.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    wurzel.dispatchEvent(new MouseEvent('mouseleave'))
    const link = /** @type {HTMLElement} */ (spur.querySelector('a'))
    link.focus(); link.blur()
    klick(knopf); klick(knopf)
    expect(ap.map((e) => [e.detail.playing, e.detail.reason])).toEqual([
      [false, 'hover'], [true, 'hover'],
      [false, 'fokus'], [true, 'fokus'],
      [false, 'knopf'], [true, 'knopf']
    ])
    for (const e of ap) passtZumRecipe('marquee', e)
  })

  it('reduzierte Bewegung: Knopf verborgen, Duplikate trotzdem aus der Tab-Folge', () => {
    window.matchMedia = vi.fn((q) => ({ matches: q === '(prefers-reduced-motion: reduce)' }))
    const { knopf, spur, wurzel } = bau()
    expect(knopf.hidden).toBe(true)
    expect(kopien(spur).filter((g) => g.getAttribute('tabindex') === '-1')).toHaveLength(3)
    expect(tabFolge(wurzel)).toHaveLength(3)
  })

  it('ohne Knopf legt das Behavior ihn vor der Spur an (englisch nach lang); Abbinden raeumt auf', () => {
    document.documentElement.setAttribute('lang', 'en')
    const { b, wurzel, spur } = bau(logoMarkup({ knopf: false }))
    const knopf = /** @type {HTMLButtonElement} */ (wurzel.querySelector('.nc-logo-wall__pause'))
    expect(knopf.type).toBe('button')
    expect(knopf.nextElementSibling).toBe(spur)
    expect(label(knopf)).toBe('Pause scrolling')
    klick(knopf)
    expect(label(knopf)).toBe('Resume scrolling')
    abbinden(b, ['marquee'])
    expect(wurzel.querySelector('.nc-logo-wall__pause')).toBeNull()
    expect(wurzel.classList.contains('is-stopped')).toBe(false)
    expect([...spur.children].some((g) => g.hasAttribute('tabindex'))).toBe(false)
  })

  it('eigene Texte per data-text-pause / data-text-play', () => {
    const { knopf } = bau(logoMarkup().replace('data-playing="true"', 'data-playing="true" data-text-pause="Stopp" data-text-play="Weiter"'))
    expect(label(knopf)).toBe('Stopp')
    klick(knopf)
    expect(label(knopf)).toBe('Weiter')
  })

  it('abbinden + anbinden (Muster neo-theme.js) bindet genau einmal', () => {
    const b = buehne(logoMarkup())
    anbinden(b, ['marquee']); abbinden(b, ['marquee']); anbinden(b, ['marquee'])
    const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-logo-wall--marquee'))
    const ap = sammle(wurzel, 'marquee-autoplay')
    klick(/** @type {HTMLElement} */ (wurzel.querySelector('.nc-logo-wall__pause')))
    expect(ap).toHaveLength(1)
  })
})

describe('marquee: Lauftext .nc-marquee (Arena)', () => {
  it('Arena „Ausprobieren": Knopf aus der Vorlage, Spur dekorativ, laeuft ohne Standbild-Rahmen', () => {
    const html = lebendigesMarkup('marquee', 'default')
    expect(html).not.toMatch(/ra-standbild/)
    const { knopf, wurzel, spur } = bau(html)
    expect(wurzel.querySelectorAll('.nc-marquee__pause')).toHaveLength(1)
    expect(wurzel.hasAttribute('aria-hidden')).toBe(false)
    expect(spur.getAttribute('aria-hidden')).toBe('true')
    klick(knopf)
    expect(label(knopf)).toBe('Laufband fortsetzen')
  })

  it('Wurzel mit aria-hidden: gibt es an die Spur weiter (Knopf erreichbar); Abbinden stellt her', () => {
    const b = buehne('<div class="nc-marquee" aria-hidden="true"><div class="nc-marquee__track"><span class="nc-marquee__text">A</span><span class="nc-marquee__text">A</span></div></div>')
    anbinden(b, ['marquee'])
    const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-marquee'))
    expect(wurzel.hasAttribute('aria-hidden')).toBe(false)
    expect(wurzel.querySelector('.nc-marquee__track')?.getAttribute('aria-hidden')).toBe('true')
    expect(wurzel.querySelector('.nc-marquee__pause')).not.toBeNull()
    abbinden(b, ['marquee'])
    expect(wurzel.getAttribute('aria-hidden')).toBe('true')
    expect(wurzel.querySelector('.nc-marquee__track')?.hasAttribute('aria-hidden')).toBe(false)
    expect(wurzel.querySelector('.nc-marquee__pause')).toBeNull()
  })

  it('Logo-Wand der Arena (Laufband): Knopf vor der Spur, kein aria-label an Wand und Pillen', () => {
    const html = zellenMarkup('logo-wall', 'marquee-ticker')
    const b = buehne(html)
    expect(b.querySelector('[aria-label]')).toBeNull()
    anbinden(b, ['marquee'])
    const wand = /** @type {HTMLElement} */ (b.querySelector('.nc-logo-wall--marquee'))
    expect(wand.firstElementChild?.classList.contains('nc-logo-wall__pause')).toBe(true)
    expect(wand.querySelectorAll('[inert]').length).toBe(0)
    expect(wand.querySelectorAll('.nc-logo-pill[aria-hidden="true"]').length).toBe(6)
  })
})
