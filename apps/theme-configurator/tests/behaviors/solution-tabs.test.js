/**
 * Solution-Tabs und Tab-Nav (Plan v4, Phase 1, 09.10.2026, E1 a / E6 a):
 * Behavior solution-tabs aus neo-behaviors. Gebunden wird an das Markup der
 * Arena („Ausprobieren", Recipe solution-tabs) und an Markup wie aus
 * neo_fe (neoTabNav baut die Tableiste aus JSON, das Twig rendert den
 * Pause-Knopf davor). Jede Taste aus `keyboard` und jedes Ereignis aus
 * `events` wird geprueft; die Zeit laeuft mit falschen Timern.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH } from 'neo-behaviors'
import { taktDauer } from '../../../../packages/neo-behaviors/solution-tabs.js'
import { buehne, lebendigesMarkup, taste, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

const TAKT = 7000

// happy-dom kennt IntersectionObserver, meldet aber nie: Vorgabe hier ist
// „im Bild" (sofort beim Beobachten); der Test „ausser Sicht" setzt eine eigene.
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

/** Markup wie neo_fe: Wurzel aus dem Twig (Knopf bei autoplay on), Tableiste aus neoTabNav */
function websiteMarkup ({ autoplay = 'on', knopf = true, vertikal = false, tabs = 3, dauer = '' } = {}) {
  const id = 'nc-tn-42'
  return `<section class="nc-section nc-solution-tabs-section"><div class="nc-container">
<div class="nc-section-header"><h2 class="nc-section-header__title" id="${id}-titel">Produkte</h2></div>
<div class="nc-solution-tabs nc-tab-nav${vertikal ? ' nc-solution-tabs--vertical' : ''}" id="${id}" data-tab-nav data-orientation="${vertikal ? 'vertical' : 'horizontal'}" data-autoplay="${autoplay}"${dauer ? ` style="--nc-solution-tabs-autoplay-duration: ${dauer};"` : ''}>
${knopf && autoplay === 'on' ? '<button type="button" class="nc-solution-tabs__autoplay" data-playing="true"><svg class="nc-solution-tabs__autoplay-icon" aria-hidden="true"></svg><span class="nc-solution-tabs__autoplay-label">Automatische Wiedergabe anhalten</span></button>' : ''}
<div class="nc-solution-tabs__tablist" role="tablist" aria-labelledby="${id}-titel"${vertikal ? ' aria-orientation="vertical"' : ''}>
${Array.from({ length: tabs }, (_, i) => `<button class="nc-solution-tabs__tab" type="button" role="tab" id="${id}-t${i}" aria-controls="${id}-p${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">Tab ${i + 1}<span class="nc-solution-tabs__progress" aria-hidden="true"></span></button>`).join('\n')}
</div>
${Array.from({ length: tabs }, (_, i) => `<div class="nc-solution-tabs__panel nc-tab-nav__panel${i === 0 ? ' is-active' : ''}" role="tabpanel" id="${id}-p${i}" aria-labelledby="${id}-t${i}"${i === 0 ? '' : ' hidden'}><div class="nc-tab-nav__panel-body"><a href="#x${i}">Mehr ${i + 1}</a></div></div>`).join('\n')}
</div></div></section>`
}

function bau (html = websiteMarkup()) {
  const b = buehne(html)
  anbinden(b, ['solution-tabs'])
  const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-solution-tabs'))
  return {
    b,
    wurzel,
    knopf: /** @type {HTMLButtonElement} */ (wurzel.querySelector('.nc-solution-tabs__autoplay')),
    tabs: /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-solution-tabs__tab')]),
    panels: /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-solution-tabs__panel')])
  }
}
const aktiv = (tabs) => tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true')

describe('solution-tabs: Website-Bauteil', () => {
  it('nurAusdruecklich und in NUR_AUSDRUECKLICH (Drupal bindet nur per nur)', () => {
    expect(BEHAVIORS['solution-tabs'].nurAusdruecklich).toBe(true)
    expect(NUR_AUSDRUECKLICH).toContain('solution-tabs')
  })

  it('Dauer aus --nc-solution-tabs-autoplay-duration (s, ms), sonst 7 s', () => {
    const el = document.createElement('div')
    document.body.append(el)
    expect(taktDauer(el)).toBe(7000)
    el.style.setProperty('--nc-solution-tabs-autoplay-duration', '3s')
    expect(taktDauer(el)).toBe(3000)
    el.style.setProperty('--nc-solution-tabs-autoplay-duration', '1500ms')
    expect(taktDauer(el)).toBe(1500)
    el.style.setProperty('--nc-solution-tabs-autoplay-duration', 'quatsch')
    expect(taktDauer(el)).toBe(7000)
  })

  it('ohne Tableiste bindet es nichts (Theme baut sie erst aus JSON)', () => {
    const b = buehne('<div class="nc-solution-tabs" data-autoplay="on"></div>')
    expect(() => anbinden(b, ['solution-tabs'])).not.toThrow()
    vi.advanceTimersByTime(TAKT * 2)
    expect(b.querySelector('.nc-solution-tabs__autoplay')).toBeNull()
  })
})

describe('solution-tabs: Tabs-Muster (keyboard aus dem Recipe)', () => {
  it('wandernder tabindex: nur der gewaehlte Tab 0, Panels folgen', () => {
    const { tabs, panels } = bau(websiteMarkup({ autoplay: 'off' }))
    expect(tabs.map((t) => t.tabIndex)).toEqual([0, -1, -1])
    klick(tabs[2])
    expect(tabs.map((t) => t.tabIndex)).toEqual([-1, -1, 0])
    expect(panels.map((p) => p.hidden)).toEqual([true, true, false])
    expect(panels[2].classList.contains('is-active')).toBe(true)
    expect(panels[0].classList.contains('is-active')).toBe(false)
  })

  it('jede Taste aus keyboard', () => {
    deckeTastenAb('solution-tabs', {
      Tab: () => {
        // Reihenfolge im Dokument: Knopf vor der Tableiste, nur ein Tab in der Tab-Folge
        const { wurzel, knopf, tabs } = bau()
        const folge = [...wurzel.querySelectorAll('button, a[href]')].filter((e) => e.tabIndex >= 0 && !e.closest('[hidden]'))
        expect(folge[0]).toBe(knopf)
        expect(folge[1]).toBe(tabs[0])
        expect(folge.filter((e) => e.getAttribute('role') === 'tab')).toHaveLength(1)
      },
      ArrowRight: () => {
        const { tabs } = bau(websiteMarkup({ autoplay: 'off' }))
        tabs[0].focus(); taste(tabs[0], 'ArrowRight')
        expect(aktiv(tabs)).toBe(1); expect(document.activeElement).toBe(tabs[1])
        taste(tabs[1], 'ArrowRight'); taste(tabs[2], 'ArrowRight')
        expect(aktiv(tabs)).toBe(0) // rundum
      },
      ArrowLeft: () => {
        const { tabs } = bau(websiteMarkup({ autoplay: 'off' }))
        taste(tabs[0], 'ArrowLeft')
        expect(aktiv(tabs)).toBe(2); expect(document.activeElement).toBe(tabs[2])
      },
      ArrowDown: () => {
        const { tabs } = bau(websiteMarkup({ autoplay: 'off', vertikal: true }))
        taste(tabs[0], 'ArrowDown')
        expect(aktiv(tabs)).toBe(1)
        // horizontal ohne Wirkung
        const h = bau(websiteMarkup({ autoplay: 'off' }))
        const e = taste(h.tabs[0], 'ArrowDown')
        expect(e.defaultPrevented).toBe(false)
        expect(aktiv(h.tabs)).toBe(0)
      },
      ArrowUp: () => {
        const { tabs } = bau(websiteMarkup({ autoplay: 'off', vertikal: true }))
        taste(tabs[0], 'ArrowUp')
        expect(aktiv(tabs)).toBe(2); expect(document.activeElement).toBe(tabs[2])
        // vertikal: rechts ohne Wirkung
        taste(tabs[2], 'ArrowRight')
        expect(aktiv(tabs)).toBe(2)
      },
      Home: () => {
        const { tabs } = bau(websiteMarkup({ autoplay: 'off' }))
        klick(tabs[2]); taste(tabs[2], 'Home')
        expect(aktiv(tabs)).toBe(0); expect(document.activeElement).toBe(tabs[0])
      },
      End: () => {
        const { tabs } = bau(websiteMarkup({ autoplay: 'off' }))
        taste(tabs[0], 'End')
        expect(aktiv(tabs)).toBe(2); expect(document.activeElement).toBe(tabs[2])
      },
      Enter: () => {
        const { tabs, knopf } = bau()
        taste(tabs[1], 'Enter')
        expect(aktiv(tabs)).toBe(1)
        // auf dem Knopf: schaltet (Rotation lief nach der Handwahl nicht mehr)
        taste(knopf, 'Enter')
        expect(knopf.getAttribute('data-playing')).toBe('true')
      },
      Space: () => {
        const { tabs, knopf } = bau()
        taste(tabs[2], 'Space')
        expect(aktiv(tabs)).toBe(2)
        taste(knopf, 'Space')
        expect(knopf.getAttribute('data-playing')).toBe('true')
        taste(knopf, 'Space')
        expect(knopf.getAttribute('data-playing')).toBe('false')
      }
    })
  })

  it('Arena-Markup („Ausprobieren", horizontal-autoplay und vertical) bindet', () => {
    const b = buehne(lebendigesMarkup('solution-tabs', 'horizontal-autoplay'))
    anbinden(b, ['solution-tabs'])
    const tabs = /** @type {HTMLElement[]} */ ([...b.querySelectorAll('.nc-solution-tabs__tab')])
    expect(b.querySelectorAll('.nc-solution-tabs__autoplay')).toHaveLength(1) // aus der Vorlage, kein zweiter
    taste(tabs[0], 'End')
    expect(aktiv(tabs)).toBe(2)
    const v = buehne(lebendigesMarkup('solution-tabs', 'vertical'))
    anbinden(v, ['solution-tabs'])
    expect(v.querySelector('.nc-solution-tabs__autoplay')).toBeNull() // autoplay off
    const vt = /** @type {HTMLElement[]} */ ([...v.querySelectorAll('.nc-solution-tabs__tab')])
    taste(vt[0], 'ArrowDown')
    expect(aktiv(vt)).toBe(1)
  })
})

describe('solution-tabs: Ereignisse (events aus dem Recipe)', () => {
  it('solution-tabs-change { value, previousValue } bei Klick, Taste und Takt — genau einmal', () => {
    const { wurzel, tabs } = bau()
    const wechsel = sammle(wurzel, 'solution-tabs-change')
    vi.advanceTimersByTime(TAKT)
    expect(wechsel).toHaveLength(1)
    expect(wechsel[0].detail).toEqual({ value: 'nc-tn-42-t1', previousValue: 'nc-tn-42-t0' })
    passtZumRecipe('solution-tabs', wechsel[0])
    klick(tabs[1]) // schon gewaehlt: kein Ereignis
    expect(wechsel).toHaveLength(1)
    taste(tabs[1], 'End')
    expect(wechsel).toHaveLength(2)
    passtZumRecipe('solution-tabs', wechsel[1])
  })

  it('solution-tabs-autoplay { playing, reason } fuer knopf, wahl, hover, fokus, ausser-sicht', () => {
    const { wurzel, knopf, tabs } = bau()
    const ap = sammle(wurzel, 'solution-tabs-autoplay')
    maus(wurzel, 'mouseenter'); maus(wurzel, 'mouseleave')
    tabs[0].focus(); tabs[0].blur()
    klick(knopf); klick(knopf)
    klick(tabs[1])
    expect(ap.map((e) => [e.detail.playing, e.detail.reason])).toEqual([
      [false, 'hover'], [true, 'hover'],
      [false, 'fokus'], [true, 'fokus'],
      [false, 'knopf'], [true, 'knopf'],
      [false, 'wahl']
    ])
    for (const e of ap) passtZumRecipe('solution-tabs', e)
  })
})

describe('solution-tabs: Autoplay mit falschen Timern', () => {
  it('Takt: wechselt nach jedem Intervall rundum (Dauer aus dem Inline-Stil)', () => {
    const { tabs, wurzel } = bau(websiteMarkup({ dauer: '2s' }))
    expect(wurzel.classList.contains('is-paused')).toBe(false)
    vi.advanceTimersByTime(1999); expect(aktiv(tabs)).toBe(0)
    vi.advanceTimersByTime(1); expect(aktiv(tabs)).toBe(1)
    vi.advanceTimersByTime(2000); expect(aktiv(tabs)).toBe(2)
    vi.advanceTimersByTime(2000); expect(aktiv(tabs)).toBe(0)
    expect(document.activeElement).toBe(document.body) // der Takt nimmt keinen Fokus
  })

  it('Maus ueber dem Block: ruht mit .is-paused, danach Restzeit', () => {
    const { tabs, wurzel } = bau()
    vi.advanceTimersByTime(3000)
    maus(wurzel, 'mouseenter')
    expect(wurzel.classList.contains('is-paused')).toBe(true)
    vi.advanceTimersByTime(TAKT * 3)
    expect(aktiv(tabs)).toBe(0)
    maus(wurzel, 'mouseleave')
    expect(wurzel.classList.contains('is-paused')).toBe(false)
    vi.advanceTimersByTime(3999); expect(aktiv(tabs)).toBe(0)
    vi.advanceTimersByTime(1); expect(aktiv(tabs)).toBe(1)
  })

  it('Fokus im Block: ruht mit .is-paused (auch der Balken); Fokus auf dem Knopf nicht', () => {
    const { tabs, wurzel, knopf, b } = bau()
    const link = /** @type {HTMLElement} */ (b.querySelector('.nc-solution-tabs__panel:not([hidden]) a'))
    link.focus()
    expect(wurzel.classList.contains('is-paused')).toBe(true)
    vi.advanceTimersByTime(TAKT * 3)
    expect(aktiv(tabs)).toBe(0)
    knopf.focus()
    expect(wurzel.classList.contains('is-paused')).toBe(false)
    vi.advanceTimersByTime(TAKT)
    expect(aktiv(tabs)).toBe(1)
    knopf.blur()
  })

  it('Knopf stoppt dauerhaft, Beschriftung und Symbol wechseln; fortsetzen startet neu', () => {
    const { tabs, wurzel, knopf } = bau()
    const label = knopf.querySelector('.nc-solution-tabs__autoplay-label')
    expect(label?.textContent).toBe('Automatische Wiedergabe anhalten')
    expect(knopf.getAttribute('data-playing')).toBe('true')
    klick(knopf)
    expect(label?.textContent).toBe('Automatische Wiedergabe fortsetzen')
    expect(knopf.getAttribute('data-playing')).toBe('false')
    expect(wurzel.classList.contains('is-stopped')).toBe(true)
    expect(wurzel.classList.contains('is-paused')).toBe(false)
    // Maus rein und raus startet nichts
    maus(wurzel, 'mouseenter'); maus(wurzel, 'mouseleave')
    vi.advanceTimersByTime(TAKT * 3)
    expect(aktiv(tabs)).toBe(0)
    klick(knopf)
    expect(label?.textContent).toBe('Automatische Wiedergabe anhalten')
    expect(wurzel.classList.contains('is-stopped')).toBe(false)
    vi.advanceTimersByTime(TAKT)
    expect(aktiv(tabs)).toBe(1)
  })

  it('Handwahl stoppt dauerhaft; der Takt springt danach nicht auf einen alten Tab', () => {
    const { tabs, wurzel, knopf } = bau()
    vi.advanceTimersByTime(TAKT) // Takt auf Tab 2
    expect(aktiv(tabs)).toBe(1)
    klick(tabs[2])
    expect(knopf.getAttribute('data-playing')).toBe('false')
    expect(wurzel.classList.contains('is-stopped')).toBe(true)
    vi.advanceTimersByTime(TAKT * 3)
    expect(aktiv(tabs)).toBe(2)
    // Fortsetzen: weiter ab dem gewaehlten Tab (Zaehlerfehler der Tab-Nav)
    klick(knopf)
    vi.advanceTimersByTime(TAKT)
    expect(aktiv(tabs)).toBe(0)
    // Taste ist ebenfalls Handwahl
    taste(tabs[0], 'ArrowRight')
    vi.advanceTimersByTime(TAKT * 2)
    expect(aktiv(tabs)).toBe(1)
    expect(knopf.getAttribute('data-playing')).toBe('false')
  })

  it('ausser Sicht kein Wechsel (IntersectionObserver), im Bild Takt', () => {
    let rueckruf = null
    let optionen = null
    class IOAttrappe {
      constructor (cb, opt) { rueckruf = cb; optionen = opt }
      observe () {}
      disconnect () { rueckruf = null }
    }
    vi.stubGlobal('IntersectionObserver', IOAttrappe)
    const { tabs, wurzel } = bau()
    expect(optionen).toEqual({ threshold: 0.3 })
    const ap = sammle(wurzel, 'solution-tabs-autoplay')
    vi.advanceTimersByTime(TAKT * 3)
    expect(aktiv(tabs)).toBe(0) // noch nicht im Bild
    rueckruf([{ isIntersecting: true }])
    vi.advanceTimersByTime(TAKT)
    expect(aktiv(tabs)).toBe(1)
    rueckruf([{ isIntersecting: false }])
    expect(wurzel.classList.contains('is-paused')).toBe(true)
    vi.advanceTimersByTime(TAKT * 3)
    expect(aktiv(tabs)).toBe(1)
    expect(ap.map((e) => [e.detail.playing, e.detail.reason])).toEqual([[true, 'ausser-sicht'], [false, 'ausser-sicht']])
    abbinden(wurzel.parentElement || document.body, ['solution-tabs'])
    expect(rueckruf).toBeNull()
  })

  it('reduzierte Bewegung: kein Autoplay und kein Knopf', () => {
    window.matchMedia = vi.fn((q) => ({ matches: q === '(prefers-reduced-motion: reduce)' }))
    const { tabs, knopf, wurzel } = bau()
    expect(knopf.hidden).toBe(true)
    vi.advanceTimersByTime(TAKT * 3)
    expect(aktiv(tabs)).toBe(0)
    expect(wurzel.classList.contains('is-paused')).toBe(false)
    // ohne Knopf im Markup wird keiner angelegt
    const ohne = bau(websiteMarkup({ knopf: false }))
    expect(ohne.knopf).toBeNull()
    // Tastatur bleibt
    taste(tabs[0], 'End')
    expect(aktiv(tabs)).toBe(2)
  })

  it('autoplay off: kein Takt, ein vorhandener Knopf bleibt verborgen', () => {
    const html = websiteMarkup({ autoplay: 'off' }).replace('<div class="nc-solution-tabs__tablist"', '<button type="button" class="nc-solution-tabs__autoplay">x</button><div class="nc-solution-tabs__tablist"')
    const { tabs, knopf } = bau(html)
    expect(knopf.hidden).toBe(true)
    vi.advanceTimersByTime(TAKT * 2)
    expect(aktiv(tabs)).toBe(0)
  })

  it('ohne Knopf im Markup legt das Behavior ihn vor der Tableiste an (englisch nach lang); Abbinden raeumt auf', () => {
    document.documentElement.setAttribute('lang', 'en')
    const { b, wurzel, tabs } = bau(websiteMarkup({ knopf: false }))
    const knopf = /** @type {HTMLButtonElement} */ (wurzel.querySelector('.nc-solution-tabs__autoplay'))
    expect(knopf).not.toBeNull()
    expect(knopf.type).toBe('button')
    expect(knopf.nextElementSibling?.classList.contains('nc-solution-tabs__tablist')).toBe(true)
    expect(knopf.textContent).toBe('Pause automatic playback')
    expect(knopf.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
    klick(knopf)
    expect(knopf.textContent).toBe('Resume automatic playback')
    abbinden(b, ['solution-tabs'])
    expect(wurzel.querySelector('.nc-solution-tabs__autoplay')).toBeNull()
    expect(wurzel.classList.contains('is-stopped')).toBe(false)
    klick(tabs[1]); vi.advanceTimersByTime(TAKT)
    expect(aktiv(tabs)).toBe(0) // nichts mehr gebunden
  })

  it('eigene Texte per data-text-pause / data-text-play', () => {
    const html = websiteMarkup().replace('data-playing="true"', 'data-playing="true" data-text-pause="Stopp" data-text-play="Weiter"')
    const { knopf } = bau(html)
    expect(knopf.textContent).toBe('Stopp')
    klick(knopf)
    expect(knopf.textContent).toBe('Weiter')
  })

  it('zweimal anbinden bindet einmal (kein doppelter Takt)', () => {
    const b = buehne(websiteMarkup())
    anbinden(b, ['solution-tabs']); anbinden(b, ['solution-tabs'])
    const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-solution-tabs'))
    const wechsel = sammle(wurzel, 'solution-tabs-change')
    vi.advanceTimersByTime(TAKT)
    expect(wechsel).toHaveLength(1)
  })
})
