// @ts-check
// ==========================================================================
// Shot — Medien-Bauteil, nach data/shot-recipe.json (keyboard, events)
// ==========================================================================
// Ein Master-Bild, viele Ausspielungen (Entscheidung 07.10.2026, Punkt 3:
// nc-shot ins DS). Loest neo_fe/js/neo-shot.js (window.NeoShot) ab. Je
// Instanz Fokuspunkt (x/y 0..1), Zoom (>= 1) und Format; der sichtbare
// Ausschnitt rechnet sich per object-fit/object-position/scale. Darueber die
// Darstellungen (data-nc-shot):
//
//   none      nur Fokus-Crop
//   frame     Browser-Rahmen (Leiste mit Punkten und Adresse) bzw. Minimal/Ohne
//   kenburns  langsame Fokus-Fahrt zwischen Start und Ziel; pausiert ausser
//             Sicht (IntersectionObserver), aus bei prefers-reduced-motion
//   lens      Lupe folgt dem Zeiger (reine Zeiger-Zugabe, das Bild bleibt
//             ohne Lupe vollstaendig)
//   hotspots  Marker (Knoepfe) oeffnen eine Erklaerung mit Detail-Zoom —
//             WAI-ARIA Disclosure: aria-expanded, Enter/Leertaste (nativer
//             Klick) schalten, Escape schliesst (Fokus bleibt am Marker),
//             Klick ins Bild schliesst
//   compare   Vorher/Nachher per Regler (input type=range) — WAI-ARIA Slider:
//             Pfeiltasten +-1, Bild auf/ab +-10, Pos1/Ende; aria-valuetext;
//             die Tasten steigen nicht weiter auf (Galerie-Blaettern)
//
// Wege:
//   shotAufbauen(container, opts)  baut das Markup aus den Karten-Daten (wie
//                                  bisher NeoShot.render) und bindet es; gibt
//                                  eine Aufraeum-Funktion zurueck
//   shotBauen(container, opts)     nur das Markup (Arena, data/markup)
//   anbinden(bereich, ['shot'])    bindet fertiges Markup (data-Attribute s. u.)
//
// Daten im Markup (das Behavior liest nur diese, keine Karten-Objekte):
//   Wurzel   data-nc-shot-fokus="x y zoom", data-nc-shot-ziel="x y zoom",
//            data-nc-shot-dauer (s) — Ken-Burns; data-nc-shot-lupe-groesse
//            (px), data-nc-shot-lupe-zoom — Lupe
//   Marker   data-nc-shot-titel (optional), data-nc-shot-text,
//            data-nc-shot-fokus="x y zoom" — Detail-Zoom der Erklaerung
//
// Ereignisse: `shot-hotspot-toggle` { index, open }, `shot-compare-change`
// { value }.
// ==========================================================================
import { sende, bindeAlle, loeseAlle } from './kern.js'

/** @typedef {{ x?: number, y?: number, zoom?: number }} Fokus */

const DARSTELLUNGEN = ['none', 'frame', 'kenburns', 'lens', 'hotspots', 'compare']

const clamp01 = (v, d) => Math.min(1, Math.max(0, v == null ? d : v))

/**
 * Fokuspunkt und Zoom am Bild (object-position, transform-origin, scale) —
 * dieselben Werte wie neo-shot.js.
 * @param {HTMLElement} img @param {Fokus|undefined|null} fokus @param {number|string|undefined} zoom
 */
export function setzeFokus (img, fokus, zoom) {
  const fx = (clamp01(fokus && fokus.x, 0.5) * 100).toFixed(2)
  const fy = (clamp01(fokus && fokus.y, 0.5) * 100).toFixed(2)
  const z = Math.max(1, +(zoom ?? 1) || 1)
  img.style.objectPosition = fx + '% ' + fy + '%'
  img.style.transformOrigin = fx + '% ' + fy + '%'
  img.style.transform = z > 1 ? 'scale(' + z + ')' : ''
}

/** "x y zoom" → { x, y, zoom } (fehlende Teile: Vorgabe) */
function liesFokus (text, zoomVorgabe) {
  const teile = String(text || '').trim().split(/\s+/).filter(Boolean).map(Number)
  const [x, y, z] = teile
  return { x: Number.isFinite(x) ? x : 0.5, y: Number.isFinite(y) ? y : 0.5, zoom: Number.isFinite(z) ? z : zoomVorgabe }
}

/** @param {Fokus|undefined|null} f @param {number|string|undefined} zoom */
const fokusText = (f, zoom) => `${clamp01(f && f.x, 0.5)} ${clamp01(f && f.y, 0.5)} ${Math.max(1, +(zoom ?? 1) || 1)}`

/**
 * @param {Document} dok
 * @param {{ src?: string, srcset?: string, sizes?: string, alt?: string, loading?: string, focal?: Fokus, zoom?: number|string }} o
 */
function fokusBild (dok, o) {
  const img = dok.createElement('img')
  img.src = o.src || ''
  if (o.srcset) img.srcset = o.srcset
  if (o.sizes) img.sizes = o.sizes
  img.alt = o.alt || ''
  img.setAttribute('loading', o.loading || 'lazy')
  img.decoding = 'async'
  img.className = 'nc-shot__img'
  setzeFokus(img, o.focal, o.zoom)
  return img
}

/** Verschachtelter Fokus-Crop (Erklaerung der Marker, Vergleich). */
function unterShot (dok, o) {
  const d = dok.createElement('div')
  d.className = 'nc-shot'
  d.appendChild(fokusBild(dok, o))
  return d
}

// ---- Markup je Darstellung (wie neo-shot.js) -------------------------------

const BAU = {
  none (c, o, dok) { c.appendChild(fokusBild(dok, o)) },

  frame (c, o, dok) {
    const P = o.params || {}
    const art = P.frame || 'Browser'
    const rahmen = dok.createElement('div')
    rahmen.className = 'nc-shot__frame' + (P.shadow === false ? '' : ' nc-shot--shadow')
    if (art === 'Browser') {
      const leiste = dok.createElement('div')
      leiste.className = 'nc-shot__chrome-bar'
      for (let i = 0; i < 3; i++) {
        const punkt = dok.createElement('span')
        punkt.className = 'nc-shot__chrome-dot'
        leiste.appendChild(punkt)
      }
      const adresse = dok.createElement('span')
      adresse.className = 'nc-shot__chrome-url'
      adresse.textContent = P.url || 'workplace.neocosmo.de'
      leiste.appendChild(adresse)
      rahmen.appendChild(leiste)
    }
    const sicht = dok.createElement('div')
    sicht.className = 'nc-shot__viewport'
    sicht.appendChild(fokusBild(dok, o))
    rahmen.appendChild(sicht)
    c.appendChild(rahmen)
  },

  kenburns (c, o, dok) {
    const P = o.params || {}
    const dauer = P.dur || 6
    c.style.setProperty('--nc-shot-dur', dauer + 's')
    c.appendChild(fokusBild(dok, o))
    const ziel = P.to || { x: 0.5, y: 0.5 }
    c.setAttribute('data-nc-shot-fokus', fokusText(o.focal, o.zoom))
    c.setAttribute('data-nc-shot-ziel', fokusText(ziel, ziel.zoom != null ? ziel.zoom : 1))
    c.setAttribute('data-nc-shot-dauer', String(dauer))
  },

  lens (c, o, dok) {
    const P = o.params || {}
    c.appendChild(fokusBild(dok, o))
    c.setAttribute('data-nc-shot-lupe-groesse', String(+P.lensSize || 200))
    c.setAttribute('data-nc-shot-lupe-zoom', String(+P.lensZoom || 2.5))
  },

  hotspots (c, o, dok) {
    const P = o.params || {}
    c.appendChild(fokusBild(dok, o))
    ;(P.hotspots || []).forEach((s, i) => {
      const h = dok.createElement('button')
      h.type = 'button'
      h.className = 'nc-shot__hotspot'
      h.setAttribute('aria-label', s.label || ('Detail ' + (i + 1)))
      h.style.left = ((s.x || 0.5) * 100) + '%'
      h.style.top = ((s.y || 0.5) * 100) + '%'
      if (s.label) h.setAttribute('data-nc-shot-titel', s.label)
      h.setAttribute('data-nc-shot-text', s.text || '')
      if (s.focal) h.setAttribute('data-nc-shot-fokus', fokusText(s.focal, s.focal.zoom || 2))
      c.appendChild(h)
    })
  },

  compare (c, o, dok) {
    const P = o.params || {}
    const huelle = dok.createElement('div')
    huelle.className = 'nc-shot__compare'
    const a = unterShot(dok, { src: o.src, focal: o.focal, zoom: o.zoom, alt: o.alt })
    const b = unterShot(dok, { src: P.src2 || o.src, focal: o.focal, zoom: o.zoom, alt: '' })
    const linie = dok.createElement('div')
    linie.className = 'nc-shot__divider'
    const regler = dok.createElement('input')
    regler.type = 'range'
    regler.min = '0'
    regler.max = '100'
    regler.value = String(P.start || 50)
    regler.setAttribute('aria-label', 'Vergleichsposition')
    huelle.append(a, b, linie, regler)
    c.appendChild(huelle)
    setzeVergleich(huelle, regler.value)
  }
}

/** Vorher/Nachher-Lage: zweites Bild beschneiden, Linie setzen. */
function setzeVergleich (huelle, wert) {
  const b = /** @type {HTMLElement|null} */ (huelle.querySelector(':scope > .nc-shot:nth-of-type(2)'))
  const linie = /** @type {HTMLElement|null} */ (huelle.querySelector(':scope > .nc-shot__divider'))
  const v = +wert
  if (b) b.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)'
  if (linie) linie.style.left = v + '%'
}

// ---- Verhalten je Darstellung ----------------------------------------------

/** @type {Record<string, (w: HTMLElement, signal: AbortSignal) => void>} */
const BINDE = {
  kenburns (w, signal) {
    const img = /** @type {HTMLElement|null} */ (w.querySelector(':scope > .nc-shot__img'))
    if (!img) return
    const ansicht = /** @type {any} */ (w.ownerDocument.defaultView || globalThis)
    if (ansicht.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const start = liesFokus(w.getAttribute('data-nc-shot-fokus'), 1)
    const ziel = liesFokus(w.getAttribute('data-nc-shot-ziel'), 1)
    const dauer = +(w.getAttribute('data-nc-shot-dauer') || 6) || 6
    let amZiel = false
    let sichtbar = true
    let takt = 0
    const schritt = () => {
      if (!sichtbar) return
      amZiel = !amZiel
      if (amZiel) setzeFokus(img, ziel, ziel.zoom)
      else setzeFokus(img, start, start.zoom)
    }
    const starte = () => { ansicht.clearInterval(takt); takt = ansicht.setInterval(schritt, dauer * 1000 + 800) }
    const erster = ansicht.setTimeout(schritt, 600)
    starte()
    let beobachter = null
    if (typeof ansicht.IntersectionObserver === 'function') {
      beobachter = new ansicht.IntersectionObserver((es) => {
        sichtbar = es[0].isIntersecting
        if (sichtbar) starte(); else ansicht.clearInterval(takt)
      }, { threshold: 0.2 })
      beobachter.observe(w)
    }
    signal.addEventListener('abort', () => {
      ansicht.clearTimeout(erster)
      ansicht.clearInterval(takt)
      beobachter?.disconnect()
      setzeFokus(img, start, start.zoom)
    })
  },

  lens (w, signal) {
    const quelle = w.querySelector(':scope > .nc-shot__img')?.getAttribute('src')
    if (!quelle) return
    const dok = w.ownerDocument
    const groesse = +(w.getAttribute('data-nc-shot-lupe-groesse') || 200) || 200
    const zoom = +(w.getAttribute('data-nc-shot-lupe-zoom') || 2.5) || 2.5
    const lupe = dok.createElement('div')
    lupe.className = 'nc-shot__lens'
    lupe.style.width = groesse + 'px'
    lupe.style.height = groesse + 'px'
    const gross = dok.createElement('img')
    gross.src = quelle
    gross.alt = ''
    gross.style.position = 'absolute'
    lupe.appendChild(gross)
    w.appendChild(lupe)
    w.addEventListener('pointermove', (e) => {
      const r = w.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      if (x < 0 || y < 0 || x > r.width || y > r.height) { lupe.style.display = 'none'; return }
      lupe.style.display = 'block'
      lupe.style.left = (x - groesse / 2) + 'px'
      lupe.style.top = (y - groesse / 2) + 'px'
      gross.style.width = (r.width * zoom) + 'px'
      gross.style.height = 'auto'
      gross.style.left = (groesse / 2 - x * zoom) + 'px'
      gross.style.top = (groesse / 2 - y * zoom) + 'px'
    }, { signal })
    w.addEventListener('pointerleave', () => { lupe.style.display = 'none' }, { signal })
    signal.addEventListener('abort', () => lupe.remove())
  },

  hotspots (w, signal) {
    const dok = w.ownerDocument
    const marker = () => /** @type {HTMLButtonElement[]} */ ([...w.querySelectorAll(':scope > .nc-shot__hotspot')])
    const quelle = w.querySelector(':scope > .nc-shot__img')?.getAttribute('src') || ''
    const vorher = new Map(marker().map((m) => [m, m.getAttribute('aria-expanded')]))
    for (const m of marker()) m.setAttribute('aria-expanded', 'false')
    /** @type {{ knopf: HTMLButtonElement, tip: HTMLElement }|null} */
    let offen = null

    function schliesse () {
      if (!offen) return
      const { knopf, tip } = offen
      offen = null
      tip.remove()
      knopf.setAttribute('aria-expanded', 'false')
      knopf.removeAttribute('aria-description')
      sende(w, 'shot-hotspot-toggle', { index: marker().indexOf(knopf), open: false })
    }

    function oeffne (knopf) {
      schliesse()
      const tip = dok.createElement('div')
      tip.className = 'nc-shot__tip'
      const fokus = liesFokus(knopf.getAttribute('data-nc-shot-fokus'), 2)
      tip.appendChild(unterShot(dok, { src: quelle, focal: fokus, zoom: fokus.zoom, alt: '' }))
      const titel = knopf.getAttribute('data-nc-shot-titel')
      if (titel) {
        const t = dok.createElement('strong')
        t.className = 'nc-shot__tip-title'
        t.textContent = titel
        tip.appendChild(t)
      }
      const p = dok.createElement('p')
      p.textContent = knopf.getAttribute('data-nc-shot-text') || ''
      tip.appendChild(p)
      knopf.appendChild(tip)
      knopf.setAttribute('aria-expanded', 'true')
      // Die Erklaerung steht im Knopf, sein Name kommt aus aria-label — der
      // Text wird als Beschreibung angesagt. aria-description statt
      // aria-describedby: eine id an der Erklaerung braechte die
      // [id]-Regeln der Seite (scroll-margin) an das Element.
      knopf.setAttribute('aria-description', [titel, p.textContent].filter(Boolean).join(': '))
      offen = { knopf, tip }
      sende(w, 'shot-hotspot-toggle', { index: marker().indexOf(knopf), open: true })
    }

    w.addEventListener('click', (e) => {
      const ziel = /** @type {HTMLElement} */ (e.target)
      const knopf = /** @type {HTMLButtonElement|null} */ (ziel.closest?.('.nc-shot__hotspot'))
      if (knopf && knopf.parentElement === w) {
        // wie neo-shot.js: der Klick auf einen Marker verlaesst ihn nicht
        e.stopPropagation()
        if (ziel.closest('.nc-shot__tip')) return // Klick in die Erklaerung
        if (offen && offen.knopf === knopf) schliesse(); else oeffne(knopf)
        return
      }
      schliesse()
    }, { signal })

    w.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !offen) return
      const { knopf } = offen
      e.preventDefault()
      schliesse()
      knopf.focus()
    }, { signal })

    signal.addEventListener('abort', () => {
      offen?.tip.remove()
      offen = null
      for (const [m, wert] of vorher) {
        if (wert == null) m.removeAttribute('aria-expanded'); else m.setAttribute('aria-expanded', wert)
        m.removeAttribute('aria-description')
      }
    })
  },

  compare (w, signal) {
    const huelle = /** @type {HTMLElement|null} */ (w.querySelector(':scope > .nc-shot__compare'))
    const regler = /** @type {HTMLInputElement|null} */ (huelle?.querySelector(':scope > input[type="range"]') || null)
    if (!huelle || !regler) return
    const min = +(regler.min || 0)
    const max = +(regler.max || 100)
    const text = () => regler.setAttribute('aria-valuetext', `${regler.value} %`)
    const setze = (v) => {
      const wert = Math.min(max, Math.max(min, v))
      if (String(wert) === regler.value) return
      regler.value = String(wert)
      melde()
    }
    const melde = () => {
      setzeVergleich(huelle, regler.value)
      text()
      sende(w, 'shot-compare-change', { value: +regler.value })
    }
    text()
    setzeVergleich(huelle, regler.value)
    regler.addEventListener('input', melde, { signal })
    const SCHRITT = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }
    regler.addEventListener('keydown', (e) => {
      const v = +regler.value
      if (e.key in SCHRITT) setze(v + SCHRITT[e.key])
      else if (e.key === 'Home') setze(min)
      else if (e.key === 'End') setze(max)
      else return
      e.preventDefault()
      // Der Regler besitzt die Tasten: die Story-Gallery blaettert sonst mit
      // Pfeil links/rechts (keydown an ihrem Scroller) und verhinderte so
      // bisher jede Bewegung des Reglers per Tastatur.
      e.stopPropagation()
    }, { signal })
    signal.addEventListener('abort', () => regler.removeAttribute('aria-valuetext'))
  }
}

export const shot = {
  id: 'shot',
  // nur Wurzeln — die verschachtelten .nc-shot (Vergleich, Erklaerung)
  // tragen kein data-nc-shot
  selektor: '.nc-shot[data-nc-shot]',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    BINDE[wurzel.getAttribute('data-nc-shot') || '']?.(wurzel, signal)
  }
}

/**
 * Baut das Medien-Bauteil aus den Karten-Daten in `container` (wie bisher
 * window.NeoShot.render) und bindet es.
 *
 *   opts = { src, srcset?, sizes?, alt?, ratio?, focal: { x, y }, zoom?,
 *            preset?, params?, loading? }
 *
 * Ohne `ratio` behaelt der Container die Groesse, die ihm der Konsument gibt
 * (z. B. Story-Gallery); mit `ratio` bekommt er aspect-ratio und volle Breite.
 * @param {HTMLElement} container
 * @param {Record<string, any>} [opts]
 * @returns {() => void} Aufraeumen (Verhalten loesen, Container leeren)
 */
export function shotAufbauen (container, opts = {}) {
  loeseAlle(container, [shot])
  shotBauen(container, opts)
  bindeAlle(container, [shot])
  return () => { loeseAlle(container, [shot]); container.innerHTML = '' }
}

/**
 * Nur das Markup (ohne Verhalten) — fuer die Arena-Vorlage, data/markup und
 * serverseitig vorbereitetes Markup. shotAufbauen = shotBauen + Binden.
 * @param {HTMLElement} container
 * @param {Record<string, any>} [opts]
 */
export function shotBauen (container, opts = {}) {
  const dok = container.ownerDocument
  container.classList.add('nc-shot')
  container.innerHTML = ''
  for (const a of ['fokus', 'ziel', 'dauer', 'lupe-groesse', 'lupe-zoom']) container.removeAttribute('data-nc-shot-' + a)
  if (opts.ratio) {
    container.classList.add('nc-shot--ratio')
    container.style.aspectRatio = String(opts.ratio).replace('/', ' / ')
  }
  const darstellung = DARSTELLUNGEN.includes(opts.preset) ? opts.preset : 'none'
  container.setAttribute('data-nc-shot', darstellung)
  BAU[darstellung](container, opts, dok)
}
