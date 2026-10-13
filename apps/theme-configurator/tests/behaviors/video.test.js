/**
 * Video (Plan v4, Phase 3, 12.10.2026, Entscheidung E5 = a, WCAG 2.2.2):
 * Behavior video aus neo-behaviors — dekorative Hintergrundvideos mit
 * Pause-Knopf (Markup wie neo_fe: Twig mit Knopf bzw. aus JSON ohne Knopf)
 * und die Video-Fassade (click-to-play, vorher neoTestimonialVideo).
 * Jede Taste aus `keyboard` und jedes Ereignis aus `events` wird geprueft.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH, videoEinbettung } from 'neo-behaviors'
import { buehne, taste, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

// jsdom spielt keine Medien ab: play/pause zaehlen und paused nachbilden
let gespielt = 0
let pausiert = 0
let geladen = 0
/** @type {(v: HTMLMediaElement) => Promise<void>} */
let playErgebnis = () => Promise.resolve()
beforeEach(() => {
  gespielt = 0; pausiert = 0; geladen = 0
  // happy-dom bringt einen Beobachter mit, der nie meldet: ohne Stub gilt
  // „kein Beobachter" (Video sichtbar); Tests mit Sicht stubben ihn selbst
  vi.stubGlobal('IntersectionObserver', undefined)
  // happy-dom laedt iframes wirklich (Netz): jede Anfrage beantwortet hier
  // eine leere Seite — kein Netz, keine Fehlermeldung
  const hd = /** @type {any} */ (window).happyDOM
  if (hd?.settings) {
    hd.settings.fetch.interceptor = {
      beforeAsyncRequest: async () => new window.Response('<!doctype html><title>leer</title>', { headers: { 'content-type': 'text/html' } })
    }
  }
  playErgebnis = () => Promise.resolve()
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function () { gespielt++; this._spielt = true; return playErgebnis(this) })
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function () { pausiert++; this._spielt = false })
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(function () { geladen++ })
  Object.defineProperty(HTMLMediaElement.prototype, 'paused', { configurable: true, get () { return !this._spielt } })
})
afterEach(() => {
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('lang')
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  delete HTMLMediaElement.prototype.paused
  delete window.matchMedia
})

const klick = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
const reduziert = () => { window.matchMedia = vi.fn((q) => ({ matches: q === '(prefers-reduced-motion: reduce)' })) }

/** Beobachter, dessen Rueckruf der Test ausloest */
function beobachter () {
  const b = { rueckruf: null, beobachtet: [], getrennt: 0, opt: null }
  vi.stubGlobal('IntersectionObserver', class {
    constructor (cb, opt) { b.rueckruf = cb; b.opt = opt }
    observe (el) { b.beobachtet.push(el) }
    disconnect () { b.getrennt++ }
  })
  return b
}

const KNOPF = '<button type="button" class="nc-video-pause" data-playing="true" hidden><svg class="nc-video-pause__icon" aria-hidden="true"></svg></button>'

/** Hero wie neo_fe (Twig): Wurzel = Section, Video ohne autoplay, Knopf dahinter */
const heroMarkup = ({ knopf = true, autoplay = false, poster = true } = {}) => `<div class="block"><section class="nc-hero" data-neo-video>
<video class="nc-hero__bg-video" muted loop playsinline${autoplay ? ' autoplay' : ''}${poster ? ' poster="p.jpg"' : ''}><source src="v.mp4" type="video/mp4"></video>
${knopf ? KNOPF : ''}
<div class="nc-hero__overlay"></div><div class="nc-hero__content"><h1 class="nc-hero__title">Titel</h1><a class="nc-button" href="#cta">Mehr</a></div>
</section></div>`

/** Bento-Kachel mit URL wie NeoBento.buildCell (aus JSON, ohne Knopf) */
const bentoMarkup = () => `<div class="nc-bento-grid"><a class="nc-bento-grid__cell" href="/ziel" data-media-pos="cover" data-neo-video>
<div class="nc-bento-grid__media"><video muted loop playsinline><source src="v.mp4"></video><span class="nc-bento-grid__scrim"></span></div>
<div class="nc-bento-grid__content"><h3 class="nc-bento-grid__title">Kachel</h3></div></a></div>`

/** Bento-Link-Kachel wie das Twig (Plan v4, Phase 7, Block 4): <article>, Link als eigenes Kind */
const bentoTwigMarkup = () => `<div class="nc-bento-grid"><article class="nc-bento-grid__cell" data-media-pos="cover" data-neo-video>
<div class="nc-bento-grid__media"><video muted loop playsinline preload="metadata"><source src="v.mp4"></video><span class="nc-bento-grid__scrim"></span></div>
<div class="nc-bento-grid__content"><h3 class="nc-bento-grid__title" id="b-1-titel">Kachel</h3></div><a class="nc-bento-grid__link" href="/ziel" aria-labelledby="b-1-titel"></a></article></div>`

const fassadeMarkup = (url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', label = 'Video abspielen – Anna Muster') => `<div class="nc-testimonial__video">
<button type="button" class="nc-testimonial__video-facade" data-neo-video="fassade" data-video-url="${url}" aria-label="${label}"><span aria-hidden="true">▶</span></button></div>`

function bau (html = heroMarkup()) {
  const b = buehne(html)
  anbinden(b, ['video'])
  const wurzel = /** @type {HTMLElement} */ (b.querySelector('[data-neo-video]'))
  return {
    b,
    wurzel,
    video: /** @type {HTMLVideoElement} */ (wurzel.querySelector('video')),
    knopf: /** @type {HTMLButtonElement} */ (wurzel.querySelector('.nc-video-pause'))
  }
}

describe('video: Website-Bauteil', () => {
  it('nurAusdruecklich und in NUR_AUSDRUECKLICH', () => {
    expect(BEHAVIORS.video.nurAusdruecklich).toBe(true)
    expect(NUR_AUSDRUECKLICH).toContain('video')
  })

  it('Wurzel ohne Video (Theme baut noch): bindet nichts, kein Knopf', () => {
    const b = buehne('<div class="nc-story-gallery__media" data-neo-video></div>')
    anbinden(b, ['video'])
    expect(b.querySelector('.nc-video-pause')).toBeNull()
    expect(gespielt).toBe(0)
  })

  it('Twig-Knopf: wird sichtbar, aria-label und data-playing; Video startet ohne Beobachter sofort', () => {
    const { knopf, video } = bau()
    expect(knopf.hidden).toBe(false)
    expect(knopf.getAttribute('aria-label')).toBe('Video anhalten')
    expect(knopf.getAttribute('data-playing')).toBe('true')
    expect(gespielt).toBe(1)
    expect(video.muted).toBe(true)
  })

  it('autoplay im Markup wird abgenommen und beim Abbinden zurueckgegeben', () => {
    const { b, video } = bau(heroMarkup({ autoplay: true }))
    expect(video.hasAttribute('autoplay')).toBe(false)
    abbinden(b, ['video'])
    expect(video.hasAttribute('autoplay')).toBe(true)
  })

  it('aus JSON ohne Knopf: legt ihn hinter dem Teil mit dem Video an (Bento: hinter dem Medium, in der Kachel)', () => {
    const { wurzel, knopf, b } = bau(bentoMarkup())
    expect(knopf).not.toBeNull()
    expect(knopf.parentElement).toBe(wurzel)
    expect(knopf.previousElementSibling?.classList.contains('nc-bento-grid__media')).toBe(true)
    expect(knopf.type).toBe('button')
    expect(knopf.querySelector('.nc-video-pause__pause')).not.toBeNull()
    abbinden(b, ['video'])
    expect(wurzel.querySelector('.nc-video-pause')).toBeNull()
  })

  it('Knopf in einem Link: Klick folgt dem Link nicht und erreicht ihn nicht', () => {
    const { wurzel, knopf } = bau(bentoMarkup())
    let linkKlick = 0
    wurzel.addEventListener('click', () => { linkKlick++ })
    const e = new MouseEvent('click', { bubbles: true, cancelable: true })
    knopf.dispatchEvent(e)
    expect(e.defaultPrevented).toBe(true)
    expect(linkKlick).toBe(0)
  })

  it('Bento wie das Twig: Knopf hinter dem Medium, nicht im Link (Plan v4, Phase 7, Block 4)', () => {
    const { wurzel, knopf } = bau(bentoTwigMarkup())
    expect(knopf).not.toBeNull()
    expect(knopf.parentElement).toBe(wurzel)
    expect(knopf.previousElementSibling?.classList.contains('nc-bento-grid__media')).toBe(true)
    expect(knopf.closest('a')).toBeNull()
    expect(wurzel.querySelector('a .nc-video-pause, a button')).toBeNull()
  })

  it('Video ist das Wurzel-Element selbst: Knopf direkt dahinter', () => {
    const b = buehne('<div class="huelle"><video data-neo-video muted loop></video></div>')
    anbinden(b, ['video'])
    const v = b.querySelector('video')
    expect(v?.nextElementSibling?.classList.contains('nc-video-pause')).toBe(true)
  })

  it('innere Wurzel: die aeussere nimmt deren Video nicht', () => {
    const b = buehne('<section data-neo-video id="aussen"><div data-neo-video id="innen"><video muted loop></video></div></section>')
    anbinden(b, ['video'])
    expect(b.querySelectorAll('.nc-video-pause').length).toBe(1)
    expect(b.querySelector('#innen > .nc-video-pause')).not.toBeNull()
  })

  it('verborgene Kopie (aria-hidden, Story-Gallery-Endlos-Modus): Knopf tabindex -1', () => {
    const b = buehne('<li class="nc-story-gallery__card nc-story-gallery__card--clone" aria-hidden="true"><div class="nc-story-gallery__media" data-neo-video><video muted loop></video></div></li>')
    anbinden(b, ['video'])
    expect(b.querySelector('.nc-video-pause')?.getAttribute('tabindex')).toBe('-1')
  })

  it('Sprache en: englische Texte; eigene Texte per data-text-pause/-play', () => {
    document.documentElement.setAttribute('lang', 'en')
    const { knopf } = bau()
    expect(knopf.getAttribute('aria-label')).toBe('Pause video')
    klick(knopf)
    expect(knopf.getAttribute('aria-label')).toBe('Play video')
    document.body.innerHTML = ''
    const b = buehne(heroMarkup().replace('class="nc-video-pause"', 'class="nc-video-pause" data-text-pause="Stopp" data-text-play="Los"'))
    anbinden(b, ['video'])
    expect(b.querySelector('.nc-video-pause')?.getAttribute('aria-label')).toBe('Stopp')
  })

  it('Abbinden stellt den Twig-Knopf wieder her (hidden, ohne aria-label)', () => {
    const { b, knopf } = bau()
    abbinden(b, ['video'])
    expect(knopf.hidden).toBe(true)
    expect(knopf.hasAttribute('aria-label')).toBe(false)
    expect(knopf.getAttribute('data-playing')).toBe('true')
  })
})

describe('video: Pause-Knopf (2.2.2)', () => {
  it('Knopf haelt an und setzt fort, Beschriftung und Symbol wechseln', () => {
    const { knopf } = bau()
    klick(knopf)
    expect(pausiert).toBe(1)
    expect(knopf.getAttribute('aria-label')).toBe('Video abspielen')
    expect(knopf.getAttribute('data-playing')).toBe('false')
    klick(knopf)
    expect(gespielt).toBe(2)
    expect(knopf.getAttribute('aria-label')).toBe('Video anhalten')
  })

  it('ausser Sicht pausiert, im Bild wieder an; erst im Bild gestartet', () => {
    const io = beobachter()
    const { wurzel } = bau()
    expect(io.beobachtet).toEqual([wurzel])
    expect(gespielt).toBe(0)
    io.rueckruf([{ isIntersecting: true }])
    expect(gespielt).toBe(1)
    io.rueckruf([{ isIntersecting: false }])
    expect(pausiert).toBe(1)
    io.rueckruf([{ isIntersecting: true }])
    expect(gespielt).toBe(2)
  })

  it('Handpause bleibt bestehen, auch wenn das Video aus dem Bild und wieder hinein kommt', () => {
    const io = beobachter()
    const { knopf } = bau()
    io.rueckruf([{ isIntersecting: true }])
    klick(knopf)
    io.rueckruf([{ isIntersecting: false }])
    io.rueckruf([{ isIntersecting: true }])
    expect(gespielt).toBe(1)
    expect(knopf.getAttribute('data-playing')).toBe('false')
    // Fortsetzen ausser Sicht: Wunsch gilt, gespielt wird erst im Bild
    io.rueckruf([{ isIntersecting: false }])
    klick(knopf)
    expect(gespielt).toBe(1)
    io.rueckruf([{ isIntersecting: true }])
    expect(gespielt).toBe(2)
  })

  it('Abbinden trennt den Beobachter', () => {
    const io = beobachter()
    const { b } = bau()
    abbinden(b, ['video'])
    expect(io.getrennt).toBe(1)
  })

  it('Browser lehnt ab (play verworfen): gilt als angehalten, Knopf bietet Abspielen an', async () => {
    playErgebnis = () => Promise.reject(Object.assign(new Error('nein'), { name: 'NotAllowedError' }))
    const { knopf, wurzel } = bau()
    const ap = sammle(wurzel, 'video-autoplay')
    await Promise.resolve(); await Promise.resolve()
    expect(knopf.getAttribute('data-playing')).toBe('false')
    expect(knopf.getAttribute('aria-label')).toBe('Video abspielen')
    expect(ap.map((e) => [e.detail.playing, e.detail.reason])).toEqual([[false, 'blockiert']])
  })
})

describe('video: reduzierte Bewegung', () => {
  it('kein Start, kein Knopf, kein Beobachter', () => {
    reduziert()
    const io = beobachter()
    const { knopf } = bau()
    expect(gespielt).toBe(0)
    expect(knopf.hidden).toBe(true)
    expect(io.beobachtet).toEqual([])
  })

  it('lief es schon (autoplay vor dem Binden): anhalten und neu laden, damit das poster erscheint', () => {
    reduziert()
    const b = buehne(heroMarkup({ autoplay: true }))
    const v = /** @type {any} */ (b.querySelector('video'))
    v._spielt = true
    anbinden(b, ['video'])
    expect(pausiert).toBe(1)
    expect(geladen).toBe(1)
    expect(v.hasAttribute('autoplay')).toBe(false)
  })

  it('aus JSON: der angelegte Knopf bleibt verborgen', () => {
    reduziert()
    const { knopf } = bau(bentoMarkup())
    expect(knopf.hidden).toBe(true)
  })
})

describe('video: Fassade (click-to-play, DSGVO)', () => {
  it('einbettung: YouTube ueber youtube-nocookie, Vimeo mit dnt, sonst leer', () => {
    expect(videoEinbettung('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toEqual({ provider: 'youtube', embed: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0' })
    expect(videoEinbettung('https://youtu.be/dQw4w9WgXcQ').embed).toContain('youtube-nocookie.com/embed/dQw4w9WgXcQ')
    expect(videoEinbettung('https://www.youtube.com/embed/dQw4w9WgXcQ').provider).toBe('youtube')
    expect(videoEinbettung('https://www.youtube.com/watch?feature=share&v=dQw4w9WgXcQ').provider).toBe('youtube')
    expect(videoEinbettung('https://vimeo.com/76979871')).toEqual({ provider: 'vimeo', embed: 'https://player.vimeo.com/video/76979871?autoplay=1&dnt=1' })
    expect(videoEinbettung('https://example.org/film.mp4')).toEqual({ provider: null, embed: '' })
  })

  it('vor dem Klick kein iframe; Klick ersetzt die Fassade, title aus aria-label, Fokus aufs iframe', () => {
    const b = buehne(fassadeMarkup())
    anbinden(b, ['video'])
    expect(b.querySelector('iframe')).toBeNull()
    klick(/** @type {HTMLElement} */ (b.querySelector('[data-neo-video]')))
    const f = /** @type {HTMLIFrameElement} */ (b.querySelector('iframe'))
    expect(f.src).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0')
    expect(f.title).toBe('Video abspielen – Anna Muster')
    expect(f.getAttribute('allow')).toContain('autoplay')
    expect(f.hasAttribute('allowfullscreen')).toBe(true)
    expect(b.querySelector('[data-neo-video]')).toBeNull()
    expect(document.activeElement).toBe(f)
  })

  it('data-video-class gibt dem iframe Klassen; ohne aria-label heisst es „Video“', () => {
    const b = buehne('<div><button type="button" class="nc-video-facade" data-neo-video="fassade" data-video-url="https://vimeo.com/76979871" data-video-class="nc-feature-list__video"></button></div>')
    anbinden(b, ['video'])
    klick(/** @type {HTMLElement} */ (b.querySelector('button')))
    const f = /** @type {HTMLIFrameElement} */ (b.querySelector('iframe'))
    expect(f.className).toBe('nc-feature-list__video')
    expect(f.title).toBe('Video')
  })

  it('unbekannter Anbieter: neues Fenster, Fassade bleibt', () => {
    const offen = vi.spyOn(window, 'open').mockImplementation(() => null)
    const b = buehne(fassadeMarkup('https://example.org/film'))
    anbinden(b, ['video'])
    klick(/** @type {HTMLElement} */ (b.querySelector('button')))
    expect(offen).toHaveBeenCalledWith('https://example.org/film', '_blank', 'noopener')
    expect(b.querySelector('iframe')).toBeNull()
  })

  it('Abbinden stellt die Fassade wieder her', () => {
    const b = buehne(fassadeMarkup())
    anbinden(b, ['video'])
    const fassade = b.querySelector('button')
    klick(/** @type {HTMLElement} */ (fassade))
    abbinden(b, ['video'])
    // abbinden findet die Fassade nicht mehr im Bereich — Aufraeumen ueber anbinden()
    const b2 = buehne(fassadeMarkup())
    const aufraeumen = anbinden(b2, ['video'])
    klick(/** @type {HTMLElement} */ (b2.querySelector('button')))
    aufraeumen()
    expect(b2.querySelector('iframe')).toBeNull()
    expect(b2.querySelector('button[data-neo-video="fassade"]')).not.toBeNull()
  })
})

describe('video: Tastatur (keyboard aus dem Recipe)', () => {
  it('jede Taste aus keyboard', () => {
    const pruefungen = {
      Tab: () => {
        const { wurzel, knopf } = bau()
        const folge = [...wurzel.querySelectorAll('a[href], button')].filter((e) => /** @type {HTMLElement} */ (e).tabIndex >= 0 && !e.closest('[hidden]'))
        expect(folge[0]).toBe(knopf)
      },
      Enter: () => {
        const { knopf } = bau()
        taste(knopf, 'Enter')
        expect(knopf.getAttribute('data-playing')).toBe('false')
        expect(knopf.getAttribute('aria-label')).toBe('Video abspielen')
        document.body.innerHTML = ''
        const b = buehne(fassadeMarkup())
        anbinden(b, ['video'])
        taste(/** @type {HTMLElement} */ (b.querySelector('button')), 'Enter')
        expect(b.querySelector('iframe')).not.toBeNull()
      },
      Space: () => {
        const { knopf } = bau()
        taste(knopf, 'Space')
        expect(knopf.getAttribute('data-playing')).toBe('false')
        taste(knopf, 'Space')
        expect(knopf.getAttribute('data-playing')).toBe('true')
      }
    }
    deckeTastenAb('video', pruefungen)
    for (const pruefe of Object.values(pruefungen)) { pruefe(); document.body.innerHTML = '' }
  })
})

describe('video: Ereignisse (events aus dem Recipe)', () => {
  it('video-autoplay { playing, reason } fuer sicht, ausser-sicht, knopf', () => {
    const io = beobachter()
    const { wurzel, knopf } = bau()
    const ap = sammle(wurzel, 'video-autoplay')
    io.rueckruf([{ isIntersecting: true }])
    io.rueckruf([{ isIntersecting: false }])
    io.rueckruf([{ isIntersecting: true }])
    klick(knopf)
    io.rueckruf([{ isIntersecting: false }])
    klick(knopf)
    expect(ap.map((e) => [e.detail.playing, e.detail.reason])).toEqual([
      [true, 'sicht'], [false, 'ausser-sicht'], [true, 'sicht'],
      [false, 'knopf'],
      // ausser Sicht fortgesetzt: meldet den Knopf, spielt aber noch nicht
      [false, 'knopf']
    ])
    for (const e of ap) passtZumRecipe('video', e)
  })

  it('video-fassade { provider, url } genau einmal je Klick', () => {
    const b = buehne(fassadeMarkup())
    anbinden(b, ['video'])
    const ev = sammle(b, 'video-fassade')
    klick(/** @type {HTMLElement} */ (b.querySelector('button')))
    expect(ev.map((e) => e.detail)).toEqual([{ provider: 'youtube', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }])
    passtZumRecipe('video', ev[0])
  })
})
