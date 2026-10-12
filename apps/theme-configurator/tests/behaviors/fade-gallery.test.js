/**
 * Fade-Gallery und Karussell (Plan v4, Phase 6a, 12.10.2026): Behaviors
 * fade-gallery und carousel aus neo-behaviors — die beiden Darstellungen des
 * Blocks neo_fade_gallery (vorher Drupal.behaviors.neoFadeGallery in
 * neo-theme.js). Gebunden wird an Markup wie aus dem Twig von neo_fe und an
 * das Markup der Arena („Ausprobieren"). Jede Taste aus `keyboard` und jedes
 * Ereignis aus `events` wird geprueft.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH } from 'neo-behaviors'
import { buehne, lebendigesMarkup, zelleMit, taste, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

beforeEach(() => { vi.useFakeTimers() })
afterEach(() => {
  document.body.innerHTML = ''
  vi.useRealTimers()
  delete window.matchMedia
})

const klick = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
const reduziert = () => { window.matchMedia = (q) => ({ matches: /reduce/.test(q), media: q, addEventListener () {}, removeEventListener () {} }) }

describe('fade-gallery und carousel: Website-Bauteile', () => {
  it('nurAusdruecklich und in NUR_AUSDRUECKLICH (Drupal bindet nur per nur)', () => {
    for (const id of ['fade-gallery', 'carousel']) {
      expect(BEHAVIORS[id].nurAusdruecklich, id).toBe(true)
      expect(NUR_AUSDRUECKLICH).toContain(id)
    }
  })
})

// ---------------------------------------------------------------------------
// Ueberblendung
// ---------------------------------------------------------------------------

/** Markup wie block--block-content--neo-fade-gallery.html.twig (display fade) */
function fadeMarkup ({ ansichten = 3, ohneText = -1 } = {}) {
  const b = 'fg-12'
  const n = Array.from({ length: ansichten }, (_, i) => i)
  return `<div class="block"><section class="nc-section"><div class="nc-container">
<div class="nc-fade-gallery" data-neo-fade-gallery aria-label="Galerie">
<div class="nc-fade-gallery__viewport">
${n.map((i) => `<div class="nc-fade-gallery__media${i === 0 ? ' is-active' : ''}" role="tabpanel" id="${b}-p${i}" aria-labelledby="${b}-t${i}"${i ? ' aria-hidden="true"' : ''}><img src="a${i}.png" alt="Ansicht ${i + 1}"></div>`).join('\n')}
</div>
<div class="nc-fade-gallery__nav-row">
<div class="nc-gallery__controls">
<button type="button" class="nc-gallery__paddle nc-gallery__paddle--prev" data-fg-prev aria-label="Vorherige Ansicht"></button>
<button type="button" class="nc-gallery__paddle nc-gallery__paddle--next" data-fg-next aria-label="Nächste Ansicht"></button>
</div>
<div class="nc-fade-gallery__tabs" role="tablist">
${n.map((i) => `<button type="button" class="nc-fade-gallery__tab" role="tab" id="${b}-t${i}" aria-controls="${b}-p${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">Tab ${i + 1}</button>`).join('\n')}
</div>
</div>
<div class="nc-fade-gallery__caption" aria-live="polite">
${n.filter((i) => i !== ohneText).map((i) => `<p class="nc-fade-gallery__desc${i === 0 ? ' is-visible' : ''}" data-fg-desc="${i}"${i ? ' hidden' : ''}>Text ${i + 1}</p>`).join('\n')}
</div>
</div></div></section></div>`
}

function bauFade (html = fadeMarkup()) {
  const b = buehne(html)
  anbinden(b, ['fade-gallery'])
  const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-fade-gallery'))
  return {
    wurzel,
    medien: /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-fade-gallery__media')]),
    tabs: /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-fade-gallery__tab')]),
    texte: /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-fade-gallery__desc')]),
    zurueck: /** @type {HTMLElement} */ (wurzel.querySelector('.nc-gallery__paddle--prev')),
    vor: /** @type {HTMLElement} */ (wurzel.querySelector('.nc-gallery__paddle--next'))
  }
}
const aktivFade = (medien) => medien.findIndex((m) => m.classList.contains('is-active'))
const tabFolge = (wurzel) => [...wurzel.querySelectorAll('a[href], button, [tabindex]')].filter((e) => /** @type {HTMLElement} */ (e).tabIndex >= 0 && !e.closest('[hidden]'))

describe('fade-gallery: Tabs-Muster und Ansicht', () => {
  it('bindet an das Twig: aria-controls bleibt, wandernder tabindex, Medium aria-hidden', () => {
    const { wurzel, medien, tabs } = bauFade()
    expect(wurzel.getAttribute('data-neo-behavior')).toBe('fade-gallery')
    tabs.forEach((t, i) => expect(document.getElementById(t.getAttribute('aria-controls'))).toBe(medien[i]))
    expect(tabs.map((t) => t.tabIndex)).toEqual([0, -1, -1])
    klick(tabs[2])
    expect(tabs.map((t) => t.tabIndex)).toEqual([-1, -1, 0])
    expect(tabs.map((t) => t.getAttribute('aria-selected'))).toEqual(['false', 'false', 'true'])
    expect(medien.map((m) => m.getAttribute('aria-hidden'))).toEqual(['true', 'true', null])
    expect(aktivFade(medien)).toBe(2)
  })

  it('Beschreibung: erst sichtbar, im naechsten Bild .is-visible; die anderen [hidden]', () => {
    const { tabs, texte } = bauFade()
    klick(tabs[1])
    expect(texte.map((p) => p.hidden)).toEqual([true, false, true])
    expect(texte[1].classList.contains('is-visible')).toBe(false)
    vi.advanceTimersByTime(20)
    expect(texte.map((p) => p.classList.contains('is-visible'))).toEqual([false, true, false])
  })

  it('Beschreibung per data-fg-desc (eine Ansicht ohne Text): die Unterschrift bleibt leer', () => {
    const { tabs, texte } = bauFade(fadeMarkup({ ohneText: 1 }))
    expect(texte).toHaveLength(2)
    klick(tabs[1]); vi.advanceTimersByTime(20)
    expect(texte.every((p) => p.hidden)).toBe(true)
    klick(tabs[2]); vi.advanceTimersByTime(20)
    expect(texte.map((p) => p.hidden)).toEqual([true, false])
    expect(texte[1].textContent).toBe('Text 3')
  })

  it('Paddles blaettern rundum', () => {
    const { medien, zurueck, vor } = bauFade()
    klick(zurueck); expect(aktivFade(medien)).toBe(2)
    klick(vor); expect(aktivFade(medien)).toBe(0)
    klick(vor); expect(aktivFade(medien)).toBe(1)
  })

  it('jede Taste aus keyboard', () => {
    deckeTastenAb('fade-gallery', {
      Tab: () => {
        const { wurzel, tabs, zurueck, vor } = bauFade()
        expect(tabFolge(wurzel)).toEqual([zurueck, vor, tabs[0]])
      },
      ArrowRight: () => {
        const { medien, tabs } = bauFade()
        tabs[0].focus(); taste(tabs[0], 'ArrowRight')
        expect(aktivFade(medien)).toBe(1); expect(document.activeElement).toBe(tabs[1])
        taste(tabs[1], 'ArrowRight'); taste(tabs[2], 'ArrowRight')
        expect(aktivFade(medien)).toBe(0) // rundum
        expect(document.activeElement).toBe(tabs[0])
      },
      ArrowLeft: () => {
        const { medien, tabs } = bauFade()
        const e = taste(tabs[0], 'ArrowLeft')
        expect(e.defaultPrevented).toBe(true)
        expect(aktivFade(medien)).toBe(2); expect(document.activeElement).toBe(tabs[2])
      },
      Home: () => {
        const { medien, tabs } = bauFade()
        klick(tabs[2]); taste(tabs[2], 'Home')
        expect(aktivFade(medien)).toBe(0); expect(document.activeElement).toBe(tabs[0])
      },
      End: () => {
        const { medien, tabs } = bauFade()
        taste(tabs[0], 'End')
        expect(aktivFade(medien)).toBe(2); expect(document.activeElement).toBe(tabs[2])
      },
      Enter: () => {
        const { medien, tabs, vor } = bauFade()
        taste(tabs[1], 'Enter'); expect(aktivFade(medien)).toBe(1)
        taste(vor, 'Enter'); expect(aktivFade(medien)).toBe(2)
      },
      Space: () => {
        const { medien, tabs, zurueck } = bauFade()
        taste(tabs[2], 'Space'); expect(aktivFade(medien)).toBe(2)
        taste(zurueck, 'Space'); expect(aktivFade(medien)).toBe(1)
      }
    })
  })

  it('Ereignis fade-gallery-change wie im Recipe, genau einmal je Wechsel', () => {
    const { wurzel, tabs, vor } = bauFade()
    const liste = sammle(wurzel, 'fade-gallery-change')
    klick(tabs[0]) // schon gewaehlt: kein Ereignis
    klick(tabs[2]); taste(tabs[2], 'Home'); klick(vor)
    expect(liste.map((e) => [e.detail.index, e.detail.previousIndex])).toEqual([[2, 0], [0, 2], [1, 0]])
    for (const e of liste) passtZumRecipe('fade-gallery', e)
  })

  it('Anfang: der Tab mit aria-selected (Arena „zweite Ansicht")', () => {
    const b = buehne(lebendigesMarkup('fade-gallery', 'zweite-ansicht'))
    anbinden(b, ['fade-gallery'])
    const tabs = [...b.querySelectorAll('.nc-fade-gallery__tab')]
    const texte = [...b.querySelectorAll('.nc-fade-gallery__desc')]
    expect(tabs.map((t) => t.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false'])
    expect(texte.map((p) => !p.hidden && p.classList.contains('is-visible'))).toEqual([false, true, false])
    taste(tabs[1], 'ArrowRight')
    expect(tabs[2].getAttribute('aria-selected')).toBe('true')
  })

  it('Arena (Ausprobieren): Paddles in der Leiste blaettern, Beschreibung nach Reihenfolge', () => {
    const b = buehne(zelleMit('fade-gallery', 'navigation', (h) => h.includes('nc-gallery__paddle')))
    anbinden(b, ['fade-gallery'])
    const medien = [...b.querySelectorAll('.nc-fade-gallery__media')]
    klick(/** @type {HTMLElement} */ (b.querySelector('.nc-gallery__paddle--next')))
    expect(aktivFade(medien)).toBe(1)
    expect([...b.querySelectorAll('.nc-fade-gallery__desc')].map((p) => p.hidden)).toEqual([true, false, true])
  })

  it('eine Ansicht allein: nichts gebunden; abbinden loest die Ereignisse', () => {
    const eine = bauFade(fadeMarkup({ ansichten: 1 }))
    expect(eine.tabs[0].getAttribute('aria-selected')).toBe('true')
    document.body.innerHTML = ''
    const { wurzel, medien, tabs } = bauFade()
    abbinden(wurzel.parentElement, ['fade-gallery'])
    expect(wurzel.hasAttribute('data-neo-behavior')).toBe(false)
    klick(tabs[1])
    expect(aktivFade(medien)).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Karussell
// ---------------------------------------------------------------------------

const BREITE = 200 // Figur
const SICHT = 450 // Spur
const FIGUREN = 5

/** Markup wie block--block-content--neo-fade-gallery.html.twig (display devices) */
function karussellMarkup () {
  const b = 'fg-13'
  const n = Array.from({ length: FIGUREN }, (_, i) => i)
  return `<div class="nc-device-gallery" data-neo-fg-carousel aria-label="Galerie">
<div class="nc-carousel nc-carousel--media">
<div class="nc-carousel__track nc-carousel__track--media" tabindex="0" role="group" aria-label="App-Ansichten, waagerecht scrollbar">
${n.map((i) => `<figure class="nc-device-figure" id="${b}-f${i}" data-fg-index="${i}"><div class="nc-device"><div class="nc-device__screen"><img src="d${i}.png" alt="Ansicht ${i + 1}"></div></div></figure>`).join('\n')}
</div>
</div>
<div class="nc-fade-gallery__nav-row">
<div class="nc-gallery__controls">
<button type="button" class="nc-gallery__paddle nc-gallery__paddle--prev" data-fg-prev aria-label="Vorherige Ansicht"></button>
<button type="button" class="nc-gallery__paddle nc-gallery__paddle--next" data-fg-next aria-label="Nächste Ansicht"></button>
</div>
<nav class="nc-gallery__nav" aria-label="Ansicht wählen">
${n.map((i) => `<a class="nc-gallery__nav-dot${i === 0 ? ' is-active' : ''}" href="#${b}-f${i}" data-fg-dot="${i}" aria-label="Ansicht ${i + 1}"></a>`).join('\n')}
</nav>
</div>
</div>`
}

/** Geometrie wie im Browser: Figuren nebeneinander, Spur scrollt bis zum Ende. */
function geometrie (spur, figuren) {
  const max = figuren.length * BREITE - SICHT
  let links = 0
  Object.defineProperty(spur, 'scrollLeft', { configurable: true, get: () => links, set: (v) => { links = Math.max(0, Math.min(max, v)) } })
  const rechteck = (l, b) => ({ left: l, right: l + b, width: b, top: 0, bottom: 100, height: 100, x: l, y: 0 })
  spur.getBoundingClientRect = () => rechteck(0, SICHT)
  figuren.forEach((f, i) => { f.getBoundingClientRect = () => rechteck(i * BREITE - links, BREITE) })
  const aufrufe = []
  spur.scrollTo = (o) => { aufrufe.push(o); spur.scrollLeft = o.left; spur.dispatchEvent(new Event('scroll')) }
  return aufrufe
}

function bauKarussell () {
  const b = buehne(karussellMarkup())
  const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-carousel'))
  const spur = /** @type {HTMLElement} */ (wurzel.querySelector('.nc-carousel__track'))
  const figuren = /** @type {HTMLElement[]} */ ([...spur.children])
  const aufrufe = geometrie(spur, figuren)
  anbinden(b, ['carousel'])
  return {
    b,
    wurzel,
    spur,
    aufrufe,
    punkte: /** @type {HTMLElement[]} */ ([...b.querySelectorAll('.nc-gallery__nav-dot')]),
    zurueck: /** @type {HTMLElement} */ (b.querySelector('[data-fg-prev]')),
    vor: /** @type {HTMLElement} */ (b.querySelector('[data-fg-next]'))
  }
}
const aktuell = (punkte) => punkte.map((p) => p.getAttribute('aria-current'))
const gewaehlt = (punkte) => punkte.findIndex((p) => p.getAttribute('aria-current') === 'true')

describe('carousel: Punkte, Blaettern, Nachfuehren', () => {
  it('Anfang: erster Punkt .is-active und aria-current=true, die anderen ohne', () => {
    const { wurzel, punkte } = bauKarussell()
    expect(wurzel.getAttribute('data-neo-behavior')).toBe('carousel')
    expect(aktuell(punkte)).toEqual(['true', null, null, null, null])
    expect(punkte.map((p) => p.classList.contains('is-active'))).toEqual([true, false, false, false, false])
  })

  it('Klick auf einen Punkt scrollt die Spur (nicht die Seite) weich und markiert sofort', () => {
    const { punkte, aufrufe } = bauKarussell()
    const e = new MouseEvent('click', { bubbles: true, cancelable: true })
    punkte[2].dispatchEvent(e)
    expect(e.defaultPrevented).toBe(true)
    expect(aufrufe.at(-1)).toEqual({ left: 2 * BREITE, behavior: 'smooth' })
    expect(gewaehlt(punkte)).toBe(2)
    vi.advanceTimersByTime(100)
    expect(gewaehlt(punkte)).toBe(2)
  })

  it('reduzierte Bewegung: sofort statt weich', () => {
    reduziert()
    const { vor, aufrufe } = bauKarussell()
    klick(vor)
    expect(aufrufe.at(-1)).toEqual({ left: BREITE, behavior: 'instant' })
  })

  it('am Ende des Streifens bleibt der angesteuerte Punkt markiert, solange seine Figur ganz zu sehen ist', () => {
    const { punkte, spur } = bauKarussell()
    klick(punkte[4]) // die letzte Figur erreicht den linken Rand nie
    vi.advanceTimersByTime(100)
    expect(spur.scrollLeft).toBe(FIGUREN * BREITE - SICHT)
    expect(gewaehlt(punkte)).toBe(4)
  })

  it('Paddles: eine Figur vor/zurueck, an den Enden stehen bleibend', () => {
    const { punkte, zurueck, vor } = bauKarussell()
    klick(zurueck); expect(gewaehlt(punkte)).toBe(0)
    klick(vor); klick(vor); expect(gewaehlt(punkte)).toBe(2)
    klick(vor); klick(vor); klick(vor); expect(gewaehlt(punkte)).toBe(4)
  })

  it('Wischen: nach Ruhe der Spur zaehlt die Figur an der Einrastkante; Ereignis carousel-change', () => {
    const { wurzel, spur, punkte } = bauKarussell()
    const liste = sammle(wurzel, 'carousel-change')
    spur.scrollLeft = 3 * BREITE - 30
    spur.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(50)
    expect(gewaehlt(punkte)).toBe(0) // noch in Bewegung
    vi.advanceTimersByTime(60)
    expect(gewaehlt(punkte)).toBe(3)
    expect(liste.map((e) => [e.detail.index, e.detail.previousIndex])).toEqual([[3, 0]])
    for (const e of liste) passtZumRecipe('carousel', e)
  })

  it('jede Taste aus keyboard', () => {
    deckeTastenAb('carousel', {
      Tab: () => {
        const { b, spur, punkte, zurueck, vor } = bauKarussell()
        expect(tabFolge(b)).toEqual([spur, zurueck, vor, ...punkte])
      },
      ArrowRight: () => {
        // nativ: der Browser scrollt die Spur — das Behavior greift nicht ein
        const { spur, punkte } = bauKarussell()
        const e = taste(spur, 'ArrowRight')
        expect(e.defaultPrevented).toBe(false)
        spur.scrollLeft = BREITE; spur.dispatchEvent(new Event('scroll'))
        vi.advanceTimersByTime(100)
        expect(gewaehlt(punkte)).toBe(1)
      },
      ArrowLeft: () => {
        const { spur, punkte } = bauKarussell()
        spur.scrollLeft = 2 * BREITE; spur.dispatchEvent(new Event('scroll')); vi.advanceTimersByTime(100)
        const e = taste(spur, 'ArrowLeft')
        expect(e.defaultPrevented).toBe(false)
        spur.scrollLeft = BREITE; spur.dispatchEvent(new Event('scroll')); vi.advanceTimersByTime(100)
        expect(gewaehlt(punkte)).toBe(1)
      },
      Enter: () => {
        // Enter auf einem Verweis loest im Browser einen Klick aus
        const { punkte, vor } = bauKarussell()
        taste(punkte[3], 'Enter'); klick(punkte[3])
        expect(gewaehlt(punkte)).toBe(3)
        taste(vor, 'Enter')
        expect(gewaehlt(punkte)).toBe(4)
      },
      Space: () => {
        const { punkte, vor, zurueck } = bauKarussell()
        taste(vor, 'Space'); expect(gewaehlt(punkte)).toBe(1)
        taste(zurueck, 'Space'); expect(gewaehlt(punkte)).toBe(0)
        // auf einem Punkt: ohne Wirkung des Behaviors
        const e = taste(punkte[2], 'Space')
        expect(e.defaultPrevented).toBe(false)
        expect(gewaehlt(punkte)).toBe(0)
      }
    })
  })

  it('Arena (Ausprobieren): Knoepfe in __controls blaettern, ohne Punkte', () => {
    const b = buehne(zelleMit('carousel', 'controls', (h) => h.includes('nc-carousel__controls')))
    const spur = /** @type {HTMLElement} */ (b.querySelector('.nc-carousel__track'))
    const aufrufe = geometrie(spur, /** @type {HTMLElement[]} */ ([...spur.children]))
    anbinden(b, ['carousel'])
    klick(/** @type {HTMLElement} */ (b.querySelector('.nc-gallery__paddle--next')))
    expect(aufrufe.at(-1)?.left).toBe(BREITE)
  })

  it('abbinden: Klick auf einen Punkt wieder ein normaler Verweis, aria-current entfernt', () => {
    const { b, punkte } = bauKarussell()
    abbinden(b, ['carousel'])
    expect(aktuell(punkte)).toEqual([null, null, null, null, null])
    const e = new MouseEvent('click', { bubbles: true, cancelable: true })
    punkte[1].dispatchEvent(e)
    expect(e.defaultPrevented).toBe(false)
  })
})
