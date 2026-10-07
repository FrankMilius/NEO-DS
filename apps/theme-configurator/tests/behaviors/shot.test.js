/**
 * Medien-Bauteil shot (Entscheidung 07.10.2026, Punkt 3): neo-behaviors
 * shot.js loest neo_fe/js/neo-shot.js (window.NeoShot) ab.
 *
 *   - shotBauen/shotAufbauen bauen dasselbe Markup wie NeoShot.render
 *     (Soll: neo-shot.js, Stand neo_fe master b6b19ad) — Struktur, Klassen,
 *     Inline-Werte (Fokuspunkt, Zoom, Format, Ken-Burns-Dauer, Vergleich).
 *   - Das Behavior bindet fertiges Markup: Marker (Disclosure), Vergleich
 *     (Slider), Lupe, Ken-Burns (Takt, Sichtbarkeit, reduced motion).
 *   - Jede Taste aus `keyboard`, jedes Ereignis aus `events` im Recipe.
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH, shotBauen, shotAufbauen } from 'neo-behaviors'
import { buehne, lebendigesMarkup, taste, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

afterEach(() => {
  document.body.innerHTML = ''
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const klick = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

/** Container wie im Story-Gallery-Medium (Groesse vom Konsumenten). */
function medium (opts) {
  const host = document.createElement('div')
  host.className = 'nc-story-gallery__media'
  document.body.append(host)
  const weg = shotAufbauen(host, { src: 'master.png', alt: 'Bild', ...opts })
  return { host, weg }
}

const HOTSPOTS = [
  { x: 0.3, y: 0.32, label: 'Suche', text: 'Volltextsuche.', focal: { x: 0.3, y: 0.32, zoom: 2.5 } },
  { x: 0.7, y: 0.6, text: 'Ohne Titel.' }
]

describe('shot: Website-Bauteil', () => {
  it('nurAusdruecklich — Drupal bindet nur per nur', () => {
    expect(BEHAVIORS.shot.nurAusdruecklich).toBe(true)
    expect(NUR_AUSDRUECKLICH).toContain('shot')
  })

  it('bindet nur Wurzeln (data-nc-shot), nicht die verschachtelten .nc-shot', () => {
    const { host } = medium({ preset: 'compare', params: { src2: 'b.png' } })
    expect(host.getAttribute('data-neo-behavior')).toBe('shot')
    for (const innen of host.querySelectorAll('.nc-shot')) expect(innen.hasAttribute('data-neo-behavior')).toBe(false)
  })
})

describe('shot: Markup wie neo-shot.js (NeoShot.render)', () => {
  it('none: Bild im Fokus-Crop — object-position, transform-origin, scale', () => {
    const { host } = medium({ focal: { x: 0.32, y: 0.38 }, zoom: 1.6, loading: 'eager', srcset: 'a 800w', sizes: '50vw' })
    expect(host.classList.contains('nc-shot')).toBe(true)
    expect(host.classList.contains('nc-shot--ratio')).toBe(false)
    expect(host.getAttribute('data-nc-shot')).toBe('none')
    const img = host.querySelector(':scope > img.nc-shot__img')
    expect(img.getAttribute('alt')).toBe('Bild')
    expect(img.getAttribute('loading')).toBe('eager')
    expect(img.getAttribute('decoding')).toBe('async')
    expect(img.getAttribute('srcset')).toBe('a 800w')
    expect(img.getAttribute('sizes')).toBe('50vw')
    expect(img.style.objectPosition).toMatch(/^32(\.00)?% 38(\.00)?%$/)
    expect(img.style.transformOrigin).toMatch(/^32(\.00)?% 38(\.00)?%$/)
    expect(img.style.transform).toBe('scale(1.6)')
  })

  it('Vorgaben: Fokus Mitte, Zoom 1 ohne transform, loading lazy, unbekanntes Preset = none; Fokus begrenzt auf 0..1', () => {
    const { host } = medium({ preset: 'gibtsnicht' })
    const img = host.querySelector('.nc-shot__img')
    expect(host.getAttribute('data-nc-shot')).toBe('none')
    expect(img.getAttribute('loading')).toBe('lazy')
    expect(img.style.objectPosition).toMatch(/^50(\.00)?% 50(\.00)?%$/)
    expect(img.style.transform).toBe('')
    const { host: h2 } = medium({ focal: { x: 2, y: -1 }, zoom: 0.5 })
    expect(h2.querySelector('.nc-shot__img').style.objectPosition).toMatch(/^100(\.00)?% 0(\.00)?%$/)
    expect(h2.querySelector('.nc-shot__img').style.transform).toBe('')
  })

  it('ratio: .nc-shot--ratio und aspect-ratio (Standalone, Feature-Liste)', () => {
    const { host } = medium({ ratio: '16/10' })
    expect(host.classList.contains('nc-shot--ratio')).toBe(true)
    expect(host.style.aspectRatio.replace(/\s/g, '')).toBe('16/10')
  })

  it('frame Browser: Rahmen mit Schatten, Leiste mit drei Punkten und Adresse (als Text), Bild im Viewport', () => {
    const { host } = medium({ preset: 'frame', params: { url: '<b>x</b>' } })
    const rahmen = host.querySelector(':scope > .nc-shot__frame')
    expect(rahmen.className).toBe('nc-shot__frame nc-shot--shadow')
    const leiste = rahmen.children[0]
    expect(leiste.className).toBe('nc-shot__chrome-bar')
    expect([...leiste.children].map((c) => c.className)).toEqual(['nc-shot__chrome-dot', 'nc-shot__chrome-dot', 'nc-shot__chrome-dot', 'nc-shot__chrome-url'])
    expect(leiste.querySelector('.nc-shot__chrome-url').textContent).toBe('<b>x</b>')
    expect(leiste.querySelector('b')).toBeNull()
    expect(rahmen.children[1].className).toBe('nc-shot__viewport')
    expect(rahmen.querySelector('.nc-shot__viewport > .nc-shot__img')).not.toBeNull()
    const { host: h2 } = medium({ preset: 'frame' })
    expect(h2.querySelector('.nc-shot__chrome-url').textContent).toBe('workplace.neocosmo.de')
  })

  it('frame Minimal/Ohne: ohne Leiste; shadow:false ohne Schatten', () => {
    for (const frame of ['Minimal', 'Ohne']) {
      const { host } = medium({ preset: 'frame', params: { frame, shadow: false } })
      expect(host.querySelector('.nc-shot__chrome-bar')).toBeNull()
      expect(host.querySelector('.nc-shot__frame').className).toBe('nc-shot__frame')
    }
  })

  it('kenburns: --nc-shot-dur und Fokus/Ziel/Dauer am Markup', () => {
    const { host } = medium({ preset: 'kenburns', focal: { x: 0.2, y: 0.25 }, zoom: 1.7, params: { to: { x: 0.7, y: 0.6, zoom: 1.3 }, dur: 7 } })
    expect(host.style.getPropertyValue('--nc-shot-dur')).toBe('7s')
    expect(host.getAttribute('data-nc-shot-fokus')).toBe('0.2 0.25 1.7')
    expect(host.getAttribute('data-nc-shot-ziel')).toBe('0.7 0.6 1.3')
    expect(host.getAttribute('data-nc-shot-dauer')).toBe('7')
    const { host: h2 } = medium({ preset: 'kenburns' })
    expect(h2.style.getPropertyValue('--nc-shot-dur')).toBe('6s')
    expect(h2.getAttribute('data-nc-shot-ziel')).toBe('0.5 0.5 1')
  })

  it('hotspots: Knoepfe mit Namen, Lage in Prozent und Daten fuer die Erklaerung', () => {
    const { host } = medium({ preset: 'hotspots', params: { hotspots: HOTSPOTS } })
    const k = host.querySelectorAll(':scope > button.nc-shot__hotspot')
    expect(k).toHaveLength(2)
    expect(k[0].getAttribute('type')).toBe('button')
    expect(k[0].getAttribute('aria-label')).toBe('Suche')
    expect(k[1].getAttribute('aria-label')).toBe('Detail 2')
    expect(k[0].style.left).toBe('30%')
    expect(k[0].style.top).toBe('32%')
    expect(k[0].getAttribute('data-nc-shot-titel')).toBe('Suche')
    expect(k[1].hasAttribute('data-nc-shot-titel')).toBe(false)
    expect(k[0].getAttribute('data-nc-shot-fokus')).toBe('0.3 0.32 2.5')
    expect(k[1].hasAttribute('data-nc-shot-fokus')).toBe(false)
  })

  it('compare: zwei verschachtelte Crops, Linie, Regler; Startlage beschneidet das zweite Bild', () => {
    const { host } = medium({ preset: 'compare', params: { src2: 'nachher.png', start: 35 } })
    const huelle = host.querySelector(':scope > .nc-shot__compare')
    expect([...huelle.children].map((c) => c.className || c.tagName)).toEqual(['nc-shot', 'nc-shot', 'nc-shot__divider', 'INPUT'])
    const [a, b] = huelle.querySelectorAll(':scope > .nc-shot')
    expect(a.querySelector('img').getAttribute('alt')).toBe('Bild')
    expect(b.querySelector('img').getAttribute('src')).toBe('nachher.png')
    expect(b.querySelector('img').getAttribute('alt')).toBe('')
    expect(b.style.clipPath.replace(/px/g, '')).toBe('inset(0 65% 0 0)')
    expect(huelle.querySelector('.nc-shot__divider').style.left).toBe('35%')
    const r = huelle.querySelector('input')
    expect(r.type).toBe('range')
    expect(r.getAttribute('aria-label')).toBe('Vergleichsposition')
    expect(r.value).toBe('35')
  })

  it('shotAufbauen gibt Aufraeumen zurueck: Verhalten loesen, Container leeren; neu bauen ersetzt', () => {
    const { host, weg } = medium({ preset: 'lens' })
    expect(host.querySelector('.nc-shot__lens')).not.toBeNull()
    shotAufbauen(host, { src: 'x.png', preset: 'none' })
    expect(host.getAttribute('data-nc-shot')).toBe('none')
    expect(host.hasAttribute('data-nc-shot-lupe-groesse')).toBe(false)
    expect(host.querySelectorAll('.nc-shot__img')).toHaveLength(1)
    weg()
    expect(host.innerHTML).toBe('')
    expect(host.hasAttribute('data-neo-behavior')).toBe(false)
  })

  it('shotBauen baut ohne zu binden', () => {
    const d = document.createElement('div')
    shotBauen(d, { src: 'a.png', preset: 'lens' })
    expect(d.hasAttribute('data-neo-behavior')).toBe(false)
    expect(d.querySelector('.nc-shot__lens')).toBeNull()
  })
})

describe('shot: Marker (Disclosure)', () => {
  const bau = () => {
    const { host } = medium({ preset: 'hotspots', params: { hotspots: HOTSPOTS } })
    const knoepfe = /** @type {HTMLButtonElement[]} */ ([...host.querySelectorAll('.nc-shot__hotspot')])
    return { host, knoepfe }
  }

  it('beim Binden aria-expanded=false', () => {
    const { knoepfe } = bau()
    expect(knoepfe.map((k) => k.getAttribute('aria-expanded'))).toEqual(['false', 'false'])
  })

  it('Klick oeffnet die Erklaerung im Knopf: Detail-Zoom, Titel, Text; aria-expanded, aria-description; Ereignis', () => {
    const { host, knoepfe } = bau()
    const auf = sammle(host, 'shot-hotspot-toggle')
    knoepfe[0].click()
    const tip = knoepfe[0].querySelector(':scope > .nc-shot__tip')
    expect(tip).not.toBeNull()
    expect([...tip.children].map((c) => c.className || c.tagName)).toEqual(['nc-shot', 'nc-shot__tip-title', 'P'])
    expect(tip.querySelector('.nc-shot__tip-title').tagName).toBe('STRONG')
    expect(tip.querySelector('.nc-shot__tip-title').textContent).toBe('Suche')
    expect(tip.querySelector('p').textContent).toBe('Volltextsuche.')
    const img = tip.querySelector('.nc-shot > img.nc-shot__img')
    expect(img.getAttribute('src')).toBe('master.png')
    expect(img.style.objectPosition).toMatch(/^30(\.00)?% 32(\.00)?%$/)
    expect(img.style.transform).toBe('scale(2.5)')
    expect(tip.hasAttribute('id')).toBe(false)
    expect(knoepfe[0].getAttribute('aria-expanded')).toBe('true')
    expect(knoepfe[0].getAttribute('aria-description')).toBe('Suche: Volltextsuche.')
    expect(auf.map((e) => e.detail)).toEqual([{ index: 0, open: true }])
    passtZumRecipe('shot', auf[0])
  })

  it('Marker ohne Titel und Fokus: kein Titel, Detail-Zoom Mitte mit Zoom 2 (wie neo-shot.js)', () => {
    const { knoepfe } = bau()
    knoepfe[1].click()
    const tip = knoepfe[1].querySelector('.nc-shot__tip')
    expect(tip.querySelector('.nc-shot__tip-title')).toBeNull()
    const img = tip.querySelector('img')
    expect(img.style.objectPosition).toMatch(/^50(\.00)?% 50(\.00)?%$/)
    expect(img.style.transform).toBe('scale(2)')
  })

  it('anderer Marker wechselt (zu, dann auf); zweiter Klick schliesst; Klick in die Erklaerung laesst offen; Klick ins Bild schliesst', () => {
    const { host, knoepfe } = bau()
    const ev = sammle(host, 'shot-hotspot-toggle')
    knoepfe[0].click()
    knoepfe[1].click()
    expect(host.querySelectorAll('.nc-shot__tip')).toHaveLength(1)
    expect(knoepfe.map((k) => k.getAttribute('aria-expanded'))).toEqual(['false', 'true'])
    expect(ev.map((e) => e.detail)).toEqual([{ index: 0, open: true }, { index: 0, open: false }, { index: 1, open: true }])
    klick(knoepfe[1].querySelector('.nc-shot__tip p'))
    expect(knoepfe[1].getAttribute('aria-expanded')).toBe('true')
    knoepfe[1].click()
    expect(host.querySelector('.nc-shot__tip')).toBeNull()
    expect(knoepfe[1].getAttribute('aria-expanded')).toBe('false')
    knoepfe[0].click()
    klick(host.querySelector(':scope > .nc-shot__img'))
    expect(host.querySelector('.nc-shot__tip')).toBeNull()
    expect(knoepfe[0].hasAttribute('aria-description')).toBe(false)
  })

  it('der Klick auf einen Marker steigt nicht weiter auf (wie neo-shot.js, z. B. Galerie-Klicks)', () => {
    const { knoepfe } = bau()
    const aussen = vi.fn()
    document.body.addEventListener('click', aussen)
    knoepfe[0].click()
    expect(aussen).not.toHaveBeenCalled()
    document.body.removeEventListener('click', aussen)
  })

  it('Abbinden: Erklaerung weg, aria-expanded/-description wie vorher', () => {
    const { host, knoepfe } = bau()
    knoepfe[0].click()
    abbinden(host, ['shot'])
    expect(host.querySelector('.nc-shot__tip')).toBeNull()
    expect(knoepfe[0].hasAttribute('aria-expanded')).toBe(false)
    expect(knoepfe[0].hasAttribute('aria-description')).toBe(false)
  })
})

describe('shot: Vergleich (Slider)', () => {
  const bau = (start) => {
    const { host } = medium({ preset: 'compare', params: { src2: 'b.png', start } })
    const regler = /** @type {HTMLInputElement} */ (host.querySelector('input[type="range"]'))
    const zweites = /** @type {HTMLElement} */ (host.querySelectorAll('.nc-shot__compare > .nc-shot')[1])
    const linie = /** @type {HTMLElement} */ (host.querySelector('.nc-shot__divider'))
    return { host, regler, zweites, linie }
  }

  it('aria-valuetext beim Binden; Ziehen (input) setzt Beschnitt und Linie, Ereignis', () => {
    const { host, regler, zweites, linie } = bau(40)
    expect(regler.getAttribute('aria-valuetext')).toBe('40 %')
    const ev = sammle(host, 'shot-compare-change')
    regler.value = '72'
    regler.dispatchEvent(new Event('input', { bubbles: true }))
    expect(zweites.style.clipPath.replace(/px/g, '')).toBe('inset(0 28% 0 0)')
    expect(linie.style.left).toBe('72%')
    expect(regler.getAttribute('aria-valuetext')).toBe('72 %')
    expect(ev.map((e) => e.detail)).toEqual([{ value: 72 }])
    passtZumRecipe('shot', ev[0])
  })
})

describe('shot: Tasten aus dem Recipe', () => {
  it('Marker: Enter/Leertaste schalten, Escape schliesst mit Fokus am Marker; Regler: Pfeile, Bild auf/ab, Pos1/Ende', () => {
    const marker = medium({ preset: 'hotspots', params: { hotspots: HOTSPOTS } })
    const k = /** @type {HTMLButtonElement[]} */ ([...marker.host.querySelectorAll('.nc-shot__hotspot')])
    const vergleich = medium({ preset: 'compare', params: { src2: 'b.png', start: 50 } })
    const r = /** @type {HTMLInputElement} */ (vergleich.host.querySelector('input'))
    const linie = /** @type {HTMLElement} */ (vergleich.host.querySelector('.nc-shot__divider'))
    const wert = (taste_, start, soll) => {
      r.value = String(start)
      r.dispatchEvent(new Event('input', { bubbles: true }))
      const ev = sammle(vergleich.host, 'shot-compare-change')
      const e = taste(r, taste_)
      expect(e.defaultPrevented, taste_).toBe(true)
      expect(r.value, taste_).toBe(String(soll))
      expect(linie.style.left, taste_).toBe(soll + '%')
      expect(ev.length, taste_).toBe(start === soll ? 0 : 1)
    }
    const pruefungen = {
      Enter: () => { taste(k[0], 'Enter'); expect(k[0].getAttribute('aria-expanded')).toBe('true'); taste(k[0], 'Enter'); expect(k[0].getAttribute('aria-expanded')).toBe('false') },
      Space: () => { taste(k[1], 'Space'); expect(k[1].getAttribute('aria-expanded')).toBe('true'); taste(k[1], 'Space'); expect(k[1].getAttribute('aria-expanded')).toBe('false') },
      Escape: () => {
        k[0].click()
        const ev = sammle(marker.host, 'shot-hotspot-toggle')
        const e = taste(k[0].querySelector('.nc-shot__tip') || k[0], 'Escape')
        expect(e.defaultPrevented).toBe(true)
        expect(k[0].getAttribute('aria-expanded')).toBe('false')
        expect(marker.host.querySelector('.nc-shot__tip')).toBeNull()
        expect(document.activeElement).toBe(k[0])
        expect(ev.map((x) => x.detail)).toEqual([{ index: 0, open: false }])
        // ohne offene Erklaerung: Escape bleibt frei
        expect(taste(k[0], 'Escape').defaultPrevented).toBe(false)
      },
      ArrowRight: () => wert('ArrowRight', 50, 51),
      ArrowUp: () => wert('ArrowUp', 99, 100),
      ArrowLeft: () => wert('ArrowLeft', 50, 49),
      ArrowDown: () => wert('ArrowDown', 0, 0),
      PageUp: () => wert('PageUp', 95, 100),
      PageDown: () => wert('PageDown', 50, 40),
      Home: () => wert('Home', 50, 0),
      End: () => wert('End', 50, 100)
    }
    deckeTastenAb('shot', pruefungen)
    for (const p of Object.values(pruefungen)) p()
    expect(r.getAttribute('aria-valuetext')).toBe('100 %')
  })
})

describe('shot: Regler besitzt seine Tasten', () => {
  it('Pfeil links/rechts am Regler steigen nicht auf (die Story-Gallery blaettert sonst und verhinderte die Bewegung)', () => {
    const { host } = medium({ preset: 'compare', params: { src2: 'b.png', start: 50 } })
    const galerie = vi.fn((e) => e.preventDefault())
    document.body.addEventListener('keydown', galerie)
    const r = host.querySelector('input')
    taste(r, 'ArrowRight')
    expect(r.value).toBe('51')
    expect(galerie).not.toHaveBeenCalled()
    taste(r, 'Tab')
    expect(galerie).toHaveBeenCalledTimes(1)
    document.body.removeEventListener('keydown', galerie)
  })
})

describe('shot: Lupe', () => {
  it('beim Binden angelegt (verborgen), folgt dem Zeiger, verlaesst das Bild = verborgen; Abbinden entfernt sie', () => {
    const { host } = medium({ preset: 'lens', params: { lensSize: 160, lensZoom: 3 } })
    host.getBoundingClientRect = () => /** @type {DOMRect} */ ({ left: 100, top: 50, width: 400, height: 300, right: 500, bottom: 350, x: 100, y: 50, toJSON () {} })
    const lupe = /** @type {HTMLElement} */ (host.querySelector(':scope > .nc-shot__lens'))
    expect(lupe.style.width).toBe('160px')
    const gross = /** @type {HTMLImageElement} */ (lupe.querySelector('img'))
    expect(gross.getAttribute('src')).toBe('master.png')
    host.dispatchEvent(new MouseEvent('pointermove', { clientX: 300, clientY: 200 }))
    expect(lupe.style.display).toBe('block')
    expect(lupe.style.left).toBe('120px') // 200 - 80
    expect(lupe.style.top).toBe('70px') // 150 - 80
    expect(gross.style.width).toBe('1200px')
    expect(gross.style.left).toBe('-520px') // 80 - 200*3
    host.dispatchEvent(new MouseEvent('pointermove', { clientX: 700, clientY: 200 }))
    expect(lupe.style.display).toBe('none')
    host.dispatchEvent(new MouseEvent('pointermove', { clientX: 300, clientY: 200 }))
    host.dispatchEvent(new MouseEvent('pointerleave'))
    expect(lupe.style.display).toBe('none')
    abbinden(host, ['shot'])
    expect(host.querySelector('.nc-shot__lens')).toBeNull()
  })
})

describe('shot: Ken-Burns', () => {
  const opts = { preset: 'kenburns', focal: { x: 0.2, y: 0.25 }, zoom: 1.7, params: { to: { x: 0.7, y: 0.6, zoom: 1.3 }, dur: 2 } }
  const lage = (host) => {
    const img = host.querySelector('.nc-shot__img')
    return [img.style.objectPosition, img.style.transform]
  }

  it('faehrt nach 600 ms zum Ziel und im Takt (Dauer + 0,8 s) zurueck; Abbinden haelt an und stellt den Start her', () => {
    vi.useFakeTimers()
    const { host } = medium(opts)
    const start = lage(host)
    vi.advanceTimersByTime(600)
    expect(lage(host)[0]).toMatch(/^70(\.00)?% 60(\.00)?%$/)
    expect(lage(host)[1]).toBe('scale(1.3)')
    vi.advanceTimersByTime(2800)
    expect(lage(host)).toEqual(start)
    vi.advanceTimersByTime(2800)
    expect(lage(host)[1]).toBe('scale(1.3)')
    abbinden(host, ['shot'])
    expect(lage(host)).toEqual(start)
    vi.advanceTimersByTime(10000)
    expect(lage(host)).toEqual(start)
  })

  it('prefers-reduced-motion: keine Fahrt', () => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', (q) => ({ matches: q.includes('reduce'), media: q, addEventListener () {}, removeEventListener () {} }))
    const { host } = medium(opts)
    const start = lage(host)
    vi.advanceTimersByTime(20000)
    expect(lage(host)).toEqual(start)
  })

  it('ausserhalb des Sichtbereichs (IntersectionObserver) keine Schritte, wieder sichtbar weiter', () => {
    vi.useFakeTimers()
    let melde
    vi.stubGlobal('IntersectionObserver', class { constructor (cb, o) { melde = cb; this.o = o } observe () {} disconnect () {} })
    const { host } = medium(opts)
    const start = lage(host)
    melde([{ isIntersecting: false }])
    vi.advanceTimersByTime(10000)
    expect(lage(host)).toEqual(start)
    melde([{ isIntersecting: true }])
    vi.advanceTimersByTime(2800)
    expect(lage(host)[1]).toBe('scale(1.3)')
  })
})

describe('shot: Arena „Ausprobieren"', () => {
  it('Marker, Vergleich und Lupe aus den Recipe-Vorlagen sind bindbar und bedienbar', () => {
    const b = buehne(lebendigesMarkup('shot', 'marker') + lebendigesMarkup('shot', 'vergleich') + lebendigesMarkup('shot', 'lupe'))
    expect(b.querySelector('.nc-shot__tip')).toBeNull()
    anbinden(b, ['shot'])
    expect(b.querySelectorAll('[data-neo-behavior="shot"]')).toHaveLength(3)
    b.querySelector('.nc-shot__hotspot').click()
    expect(b.querySelector('.nc-shot__tip')).not.toBeNull()
    const r = b.querySelector('input[type="range"]')
    taste(r, 'End')
    expect(r.value).toBe('100')
    expect(b.querySelector('.nc-shot__lens')).not.toBeNull()
  })
})
