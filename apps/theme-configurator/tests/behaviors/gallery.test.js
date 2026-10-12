/**
 * Galerie (Plan v4, Phase 2, 12.10.2026): Behavior gallery aus neo-behaviors.
 * Gebunden wird an Markup wie aus neo_fe (Twig: Wurzel, Paddles, leere
 * Punkte-Leiste, Knopf; neoGallery baut Slides und Punkte aus JSON) und an
 * das Markup der Arena („Ausprobieren"). Jede Taste aus `keyboard` und jedes
 * Ereignis aus `events` wird geprueft; die Zeit laeuft mit falschen Timern.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH } from 'neo-behaviors'
import { dauerAus } from '../../../../packages/neo-behaviors/gallery.js'
import { buehne, lebendigesMarkup, taste, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

const TAKT = 6000

class ImBild {
  constructor (cb) { this.cb = cb }
  observe (el) { this.cb([{ isIntersecting: true, target: el }]) }
  disconnect () {}
}
beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('IntersectionObserver', ImBild) })
afterEach(() => {
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('lang')
  vi.useRealTimers()
  vi.unstubAllGlobals()
  delete window.matchMedia
})

const klick = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
const maus = (el, typ) => el.dispatchEvent(new MouseEvent(typ, { bubbles: false }))

/** Markup wie neo_fe nach neoGallery (Slides und Punkte aus JSON) */
function websiteMarkup ({ autoplay = 'on', knopf = true, slides = 3, fade = false, intervall = '' } = {}) {
  const id = 'nc-gal-7'
  return `<div class="block"><div class="nc-gallery${fade ? ' nc-gallery--fade' : ''}" id="${id}" data-neo-gallery data-autoplay="${autoplay}" aria-label="Bild-Galerie" role="group" aria-roledescription="Karussell"${intervall ? ` style="--nc-gallery-autoplay-interval: ${intervall};"` : ''}>
<div class="nc-gallery__track">
${Array.from({ length: slides }, (_, i) => `<div class="nc-gallery__slide${i === 0 ? ' is-active' : ''}" role="tabpanel" aria-roledescription="Slide" aria-label="Slide ${i + 1}"${i ? ' aria-hidden="true"' : ''}><div class="nc-gallery__slide-stage"><div class="nc-gallery__slide-content"><h3 class="nc-gallery__slide-title">Titel ${i + 1}</h3><div class="nc-gallery__slide-actions"><a class="nc-button" href="#cta${i}">Mehr ${i + 1}</a></div></div></div></div>`).join('\n')}
</div>
<div class="nc-gallery__controls">
<button class="nc-gallery__paddle nc-gallery__paddle--prev" type="button" aria-label="Vorheriger Slide" data-gallery-prev>&lt;</button>
<button class="nc-gallery__paddle nc-gallery__paddle--next" type="button" aria-label="Naechster Slide" data-gallery-next>&gt;</button>
</div>
<div class="nc-gallery__nav" role="tablist" aria-label="Slide-Navigation">
${Array.from({ length: slides }, (_, i) => `<button class="nc-gallery__nav-dot${i === 0 ? ' is-active' : ''}" type="button" role="tab" aria-selected="${i === 0}" aria-label="Slide ${i + 1}" data-index="${i}"></button>`).join('\n')}
</div>
${knopf && autoplay === 'on' ? '<button type="button" class="nc-gallery__autoplay" aria-label="Galerie pausieren" data-playing="true" data-gallery-autoplay><svg class="nc-gallery__autoplay-pause" aria-hidden="true"></svg><svg class="nc-gallery__autoplay-play" aria-hidden="true"></svg></button>' : ''}
</div></div>`
}

function bau (html = websiteMarkup()) {
  const b = buehne(html)
  anbinden(b, ['gallery'])
  const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-gallery'))
  return {
    b,
    wurzel,
    spur: /** @type {HTMLElement} */ (wurzel.querySelector('.nc-gallery__track')),
    knopf: /** @type {HTMLButtonElement} */ (wurzel.querySelector('.nc-gallery__autoplay')),
    slides: /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-gallery__slide')]),
    punkte: /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-gallery__nav-dot')]),
    zurueck: /** @type {HTMLElement} */ (wurzel.querySelector('[data-gallery-prev]')),
    vor: /** @type {HTMLElement} */ (wurzel.querySelector('[data-gallery-next]'))
  }
}
const aktiv = (slides) => slides.findIndex((s) => s.classList.contains('is-active'))
/** In der Tab-Folge (nicht inert/hidden, tabindex >= 0) */
const tabFolge = (wurzel) => [...wurzel.querySelectorAll('a[href], button')].filter((e) => e.tabIndex >= 0 && !e.closest('[inert], [hidden]'))

describe('gallery: Website-Bauteil', () => {
  it('nurAusdruecklich und in NUR_AUSDRUECKLICH (Drupal bindet nur per nur)', () => {
    expect(BEHAVIORS.gallery.nurAusdruecklich).toBe(true)
    expect(NUR_AUSDRUECKLICH).toContain('gallery')
  })

  it('Intervall aus --nc-gallery-autoplay-interval (s, ms, Zahl = s), sonst 6 s', () => {
    const el = document.createElement('div')
    document.body.append(el)
    const d = () => dauerAus(el, '--nc-gallery-autoplay-interval', 6000)
    expect(d()).toBe(6000)
    el.style.setProperty('--nc-gallery-autoplay-interval', '3s'); expect(d()).toBe(3000)
    el.style.setProperty('--nc-gallery-autoplay-interval', '1500ms'); expect(d()).toBe(1500)
    el.style.setProperty('--nc-gallery-autoplay-interval', '4'); expect(d()).toBe(4000)
    el.style.setProperty('--nc-gallery-autoplay-interval', 'quatsch'); expect(d()).toBe(6000)
  })

  it('ohne Slides bindet es nichts (Theme baut sie erst aus JSON)', () => {
    const b = buehne('<div class="nc-gallery" data-autoplay="on"><div class="nc-gallery__track"></div><button class="nc-gallery__autoplay"></button></div>')
    expect(() => anbinden(b, ['gallery'])).not.toThrow()
    expect(b.querySelector('.nc-gallery__autoplay')?.hasAttribute('data-playing')).toBe(false)
  })
})

describe('gallery: Tabs-Muster und verborgene Slides', () => {
  it('Punkte: aria-controls auf den Slide, aria-selected, wandernder tabindex', () => {
    const { slides, punkte } = bau(websiteMarkup({ autoplay: 'off' }))
    punkte.forEach((p, i) => {
      expect(p.getAttribute('aria-controls')).toBe(slides[i].id)
      expect(slides[i].id).toBe(`nc-gal-7-slide-${i}`)
    })
    expect(punkte.map((p) => p.tabIndex)).toEqual([0, -1, -1])
    klick(punkte[2])
    expect(punkte.map((p) => p.tabIndex)).toEqual([-1, -1, 0])
    expect(punkte.map((p) => p.getAttribute('aria-selected'))).toEqual(['false', 'false', 'true'])
  })

  it('verborgene Slides sind inert (und aria-hidden), der gewaehlte nicht', () => {
    const { slides, vor, wurzel } = bau(websiteMarkup({ autoplay: 'off' }))
    expect(slides.map((s) => s.inert)).toEqual([false, true, true])
    expect(slides.map((s) => s.getAttribute('aria-hidden'))).toEqual([null, 'true', 'true'])
    klick(vor)
    expect(slides.map((s) => s.inert)).toEqual([true, false, true])
    // Tab-Folge: nur der CTA des sichtbaren Slides
    const ctas = tabFolge(wurzel).filter((e) => e.matches('a'))
    expect(ctas.map((a) => a.getAttribute('href'))).toEqual(['#cta1'])
  })

  it('Slide-Modus schiebt die Spur, Fade-Modus nicht', () => {
    const { spur, vor } = bau(websiteMarkup({ autoplay: 'off' }))
    klick(vor); klick(vor)
    expect(spur.style.transform).toBe('translate3d(-200%, 0, 0)')
    document.body.innerHTML = ''
    const f = bau(websiteMarkup({ autoplay: 'off', fade: true }))
    klick(f.vor)
    expect(f.spur.style.transform).toBe('')
    expect(aktiv(f.slides)).toBe(1)
  })

  it('Paddles blaettern rundum', () => {
    const { slides, vor, zurueck } = bau(websiteMarkup({ autoplay: 'off' }))
    klick(zurueck); expect(aktiv(slides)).toBe(2)
    klick(vor); expect(aktiv(slides)).toBe(0)
  })

  it('jede Taste aus keyboard', () => {
    deckeTastenAb('gallery', {
      Tab: () => {
        const { wurzel, knopf, punkte, zurueck, vor } = bau()
        const folge = tabFolge(wurzel)
        expect(folge).toEqual([wurzel.querySelector('a[href="#cta0"]'), zurueck, vor, punkte[0], knopf])
      },
      ArrowRight: () => {
        const { slides, punkte, vor } = bau(websiteMarkup({ autoplay: 'off' }))
        punkte[0].focus(); taste(punkte[0], 'ArrowRight')
        expect(aktiv(slides)).toBe(1); expect(document.activeElement).toBe(punkte[1])
        taste(punkte[1], 'ArrowRight'); taste(punkte[2], 'ArrowRight')
        expect(aktiv(slides)).toBe(0) // rundum
        // auf einem Paddle: blaettert, Fokus bleibt
        vor.focus(); taste(vor, 'ArrowRight')
        expect(aktiv(slides)).toBe(1); expect(document.activeElement).toBe(vor)
        // im Inhalt eines Slides: ohne Wirkung
        const cta = /** @type {HTMLElement} */ (slides[1].querySelector('a'))
        const e = taste(cta, 'ArrowRight')
        expect(e.defaultPrevented).toBe(false)
        expect(aktiv(slides)).toBe(1)
      },
      ArrowLeft: () => {
        const { slides, punkte, zurueck } = bau(websiteMarkup({ autoplay: 'off' }))
        taste(punkte[0], 'ArrowLeft')
        expect(aktiv(slides)).toBe(2); expect(document.activeElement).toBe(punkte[2])
        taste(zurueck, 'ArrowLeft')
        expect(aktiv(slides)).toBe(1)
      },
      Home: () => {
        const { slides, punkte } = bau(websiteMarkup({ autoplay: 'off' }))
        klick(punkte[2]); taste(punkte[2], 'Home')
        expect(aktiv(slides)).toBe(0); expect(document.activeElement).toBe(punkte[0])
      },
      End: () => {
        const { slides, punkte } = bau(websiteMarkup({ autoplay: 'off' }))
        taste(punkte[0], 'End')
        expect(aktiv(slides)).toBe(2); expect(document.activeElement).toBe(punkte[2])
      },
      Enter: () => {
        const { slides, punkte, knopf, vor } = bau()
        taste(punkte[1], 'Enter')
        expect(aktiv(slides)).toBe(1)
        expect(knopf.getAttribute('data-playing')).toBe('false') // Handwahl
        taste(vor, 'Enter')
        expect(aktiv(slides)).toBe(2)
        taste(knopf, 'Enter')
        expect(knopf.getAttribute('data-playing')).toBe('true')
      },
      Space: () => {
        const { slides, punkte, knopf } = bau()
        taste(punkte[2], 'Space')
        expect(aktiv(slides)).toBe(2)
        taste(knopf, 'Space')
        expect(knopf.getAttribute('data-playing')).toBe('true')
        taste(knopf, 'Space')
        expect(knopf.getAttribute('data-playing')).toBe('false')
      },
      Escape: () => {
        // Fehler von neoGallery: Escape schaltete per autoplayBtn.click() wieder ein
        const { wurzel, knopf, slides } = bau()
        knopf.focus()
        taste(knopf, 'Escape')
        expect(knopf.getAttribute('data-playing')).toBe('false')
        expect(knopf.getAttribute('aria-label')).toBe('Galerie abspielen')
        expect(wurzel.classList.contains('is-stopped')).toBe(true)
        vi.advanceTimersByTime(TAKT * 3)
        expect(aktiv(slides)).toBe(0)
        // zweites Escape schaltet nicht wieder ein
        taste(wurzel, 'Escape')
        expect(knopf.getAttribute('data-playing')).toBe('false')
        vi.advanceTimersByTime(TAKT * 2)
        expect(aktiv(slides)).toBe(0)
      }
    })
  })

  it('Arena-Markup („Ausprobieren", default-slide) bindet: Autoplay mit Knopf aus der Vorlage', () => {
    const b = buehne(lebendigesMarkup('gallery', 'default-slide'))
    anbinden(b, ['gallery'])
    const knopf = /** @type {HTMLElement} */ (b.querySelector('.nc-gallery__autoplay'))
    expect(b.querySelectorAll('.nc-gallery__autoplay')).toHaveLength(1)
    expect(knopf.hidden).toBe(false)
    expect(knopf.getAttribute('data-playing')).toBe('true')
    const slides = /** @type {HTMLElement[]} */ ([...b.querySelectorAll('.nc-gallery__slide')])
    vi.advanceTimersByTime(TAKT)
    expect(aktiv(slides)).toBe(1)
    taste(knopf, 'Escape')
    expect(knopf.getAttribute('aria-label')).toBe('Galerie abspielen')
    expect(slides.filter((s) => s.inert)).toHaveLength(2)
  })
})

describe('gallery: Ereignisse (events aus dem Recipe)', () => {
  it('gallery-change { index, previousIndex } bei Takt, Paddle, Punkt und Taste — genau einmal', () => {
    const { wurzel, vor, punkte } = bau()
    const wechsel = sammle(wurzel, 'gallery-change')
    vi.advanceTimersByTime(TAKT)
    expect(wechsel.map((e) => e.detail)).toEqual([{ index: 1, previousIndex: 0 }])
    klick(vor)
    klick(punkte[2]) // schon gewaehlt: kein Ereignis
    taste(punkte[2], 'Home')
    expect(wechsel.map((e) => e.detail)).toEqual([{ index: 1, previousIndex: 0 }, { index: 2, previousIndex: 1 }, { index: 0, previousIndex: 2 }])
    for (const e of wechsel) passtZumRecipe('gallery', e)
  })

  it('gallery-autoplay { playing, reason } fuer knopf, escape, wahl, hover, fokus, ausser-sicht', () => {
    let rueckruf = null
    vi.stubGlobal('IntersectionObserver', class { constructor (cb) { rueckruf = cb } observe () {} disconnect () {} })
    const { wurzel, knopf, punkte } = bau()
    const ap = sammle(wurzel, 'gallery-autoplay')
    rueckruf([{ isIntersecting: true }])
    maus(wurzel, 'mouseenter'); maus(wurzel, 'mouseleave')
    punkte[0].focus(); punkte[0].blur()
    klick(knopf); klick(knopf)
    taste(wurzel, 'Escape')
    klick(knopf)
    klick(punkte[1])
    expect(ap.map((e) => [e.detail.playing, e.detail.reason])).toEqual([
      [true, 'ausser-sicht'],
      [false, 'hover'], [true, 'hover'],
      [false, 'fokus'], [true, 'fokus'],
      [false, 'knopf'], [true, 'knopf'],
      [false, 'escape'],
      [true, 'knopf'],
      [false, 'wahl']
    ])
    for (const e of ap) passtZumRecipe('gallery', e)
  })
})

describe('gallery: Autoplay mit falschen Timern', () => {
  it('Takt: wechselt nach jedem Intervall rundum, nimmt keinen Fokus; Spur aria-live off', () => {
    const { slides, spur } = bau(websiteMarkup({ intervall: '2s' }))
    expect(spur.getAttribute('aria-live')).toBe('off')
    vi.advanceTimersByTime(1999); expect(aktiv(slides)).toBe(0)
    vi.advanceTimersByTime(1); expect(aktiv(slides)).toBe(1)
    vi.advanceTimersByTime(4000); expect(aktiv(slides)).toBe(0)
    expect(document.activeElement).toBe(document.body)
  })

  it('Maus: ruht mit .is-paused, danach Restzeit; Spur aria-live polite in Ruhe', () => {
    const { slides, wurzel, spur } = bau()
    vi.advanceTimersByTime(2000)
    maus(wurzel, 'mouseenter')
    expect(wurzel.classList.contains('is-paused')).toBe(true)
    expect(spur.getAttribute('aria-live')).toBe('polite')
    vi.advanceTimersByTime(TAKT * 3); expect(aktiv(slides)).toBe(0)
    maus(wurzel, 'mouseleave')
    vi.advanceTimersByTime(3999); expect(aktiv(slides)).toBe(0)
    vi.advanceTimersByTime(1); expect(aktiv(slides)).toBe(1)
  })

  it('Fokus in der Galerie ruht; Fokus auf dem Knopf nicht', () => {
    const { slides, wurzel, knopf } = bau()
    const cta = /** @type {HTMLElement} */ (wurzel.querySelector('a[href="#cta0"]'))
    cta.focus()
    expect(wurzel.classList.contains('is-paused')).toBe(true)
    vi.advanceTimersByTime(TAKT * 2); expect(aktiv(slides)).toBe(0)
    knopf.focus()
    expect(wurzel.classList.contains('is-paused')).toBe(false)
    vi.advanceTimersByTime(TAKT); expect(aktiv(slides)).toBe(1)
  })

  it('Knopf: einzige Quelle des Zustands — aria-label und data-playing wechseln, stoppt dauerhaft', () => {
    const { slides, wurzel, knopf } = bau()
    expect(knopf.getAttribute('aria-label')).toBe('Galerie pausieren')
    klick(knopf)
    expect(knopf.getAttribute('aria-label')).toBe('Galerie abspielen')
    expect(knopf.getAttribute('data-playing')).toBe('false')
    expect(wurzel.classList.contains('is-stopped')).toBe(true)
    maus(wurzel, 'mouseenter'); maus(wurzel, 'mouseleave')
    vi.advanceTimersByTime(TAKT * 3); expect(aktiv(slides)).toBe(0)
    klick(knopf)
    expect(knopf.getAttribute('aria-label')).toBe('Galerie pausieren')
    vi.advanceTimersByTime(TAKT); expect(aktiv(slides)).toBe(1)
  })

  it('Handwahl (Paddle) stoppt dauerhaft; fortsetzen laeuft ab dem gewaehlten Slide', () => {
    const { slides, vor, knopf } = bau()
    klick(vor)
    expect(knopf.getAttribute('data-playing')).toBe('false')
    vi.advanceTimersByTime(TAKT * 3); expect(aktiv(slides)).toBe(1)
    klick(knopf)
    vi.advanceTimersByTime(TAKT); expect(aktiv(slides)).toBe(2)
  })

  it('ausser Sicht kein Wechsel', () => {
    let rueckruf = null
    vi.stubGlobal('IntersectionObserver', class { constructor (cb, opt) { rueckruf = cb; this.opt = opt } observe () {} disconnect () { rueckruf = null } })
    const { slides, wurzel, b } = bau()
    vi.advanceTimersByTime(TAKT * 2); expect(aktiv(slides)).toBe(0)
    rueckruf([{ isIntersecting: true }])
    vi.advanceTimersByTime(TAKT); expect(aktiv(slides)).toBe(1)
    rueckruf([{ isIntersecting: false }])
    expect(wurzel.classList.contains('is-paused')).toBe(true)
    vi.advanceTimersByTime(TAKT * 2); expect(aktiv(slides)).toBe(1)
    abbinden(b, ['gallery'])
    expect(rueckruf).toBeNull()
  })

  it('reduzierte Bewegung: kein Autoplay, Knopf verborgen, Bedienung bleibt', () => {
    window.matchMedia = vi.fn((q) => ({ matches: q === '(prefers-reduced-motion: reduce)' }))
    const { slides, knopf, punkte, spur } = bau()
    expect(knopf.hidden).toBe(true)
    expect(spur.getAttribute('aria-live')).toBe('polite')
    vi.advanceTimersByTime(TAKT * 3); expect(aktiv(slides)).toBe(0)
    taste(punkte[0], 'End'); expect(aktiv(slides)).toBe(2)
  })

  it('autoplay off: kein Takt, kein Knopf', () => {
    const { slides, knopf } = bau(websiteMarkup({ autoplay: 'off' }))
    expect(knopf).toBeNull()
    vi.advanceTimersByTime(TAKT * 2); expect(aktiv(slides)).toBe(0)
  })

  it('ohne Knopf legt das Behavior ihn an (englisch nach lang); Abbinden raeumt auf', () => {
    document.documentElement.setAttribute('lang', 'en')
    const { b, wurzel, vor, slides } = bau(websiteMarkup({ knopf: false }))
    const knopf = /** @type {HTMLButtonElement} */ (wurzel.querySelector('.nc-gallery__autoplay'))
    expect(knopf.type).toBe('button')
    expect(knopf.getAttribute('aria-label')).toBe('Pause gallery')
    taste(knopf, 'Escape')
    expect(knopf.getAttribute('aria-label')).toBe('Play gallery')
    abbinden(b, ['gallery'])
    expect(wurzel.querySelector('.nc-gallery__autoplay')).toBeNull()
    expect(wurzel.classList.contains('is-stopped')).toBe(false)
    klick(vor)
    expect(aktiv(slides)).toBe(0) // nichts mehr gebunden
  })

  it('eigene Texte per data-text-pause / data-text-play', () => {
    const html = websiteMarkup().replace('data-playing="true"', 'data-playing="true" data-text-pause="Stopp" data-text-play="Weiter"')
    const { knopf } = bau(html)
    expect(knopf.getAttribute('aria-label')).toBe('Stopp')
    klick(knopf)
    expect(knopf.getAttribute('aria-label')).toBe('Weiter')
  })

  it('abbinden + anbinden (Muster neo-theme.js) bindet genau einmal', () => {
    const b = buehne(websiteMarkup())
    anbinden(b, ['gallery']); anbinden(b, ['gallery'])
    abbinden(b, ['gallery']); anbinden(b, ['gallery'])
    const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-gallery'))
    const wechsel = sammle(wurzel, 'gallery-change')
    vi.advanceTimersByTime(TAKT)
    expect(wechsel).toHaveLength(1)
    klick(/** @type {HTMLElement} */ (wurzel.querySelector('[data-gallery-next]')))
    expect(wechsel).toHaveLength(2)
  })
})
