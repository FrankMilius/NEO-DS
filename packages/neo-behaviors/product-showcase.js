// @ts-check
// ==========================================================================
// Product-Showcase — nach data/product-showcase-recipe.json (keyboard, events)
// ==========================================================================
// Website-Bauteil (Plan v4, Phase 6a, 12.10.2026, Entscheidung E8 = a: ein
// Behavior, zwei Modi). Ersetzt in neo_fe die Auswahl und Tastatur von
// Drupal.behaviors.neoProductShowcase (neo-theme.js) und js/neo-device-scroll.js
// (Geraete-Strecke, Library neo-device-scroll entfaellt) — vorher banden zwei
// Verhalten an dieselben Klassen .nc-product-showcase__*. Den Aufbau der
// Optionen aus JSON behaelt das Theme bis Phase 7 und bindet danach mit
// NeoBehaviors.anbinden(wurzel, ['product-showcase']).
//
// Der Modus folgt dem Markup:
//
// Stationen (es gibt .nc-product-showcase__trigger — Geraete-Strecke,
// --accordion): .nc-product-showcase__option[data-station] >
// button.__trigger[aria-controls] + .__panel; Screens
// .nc-product-showcase__media-item[data-station] im geteilten Geraet.
//   Genau eine Station offen (.is-active); ein Klick auf die offene schliesst
//   sie nicht — das Geraet zeigt immer einen Screen. Die Ansage folgt der
//   Form: laengs (Streifen untereinander) aria-expanded, quer (Streifen
//   flex-direction: row, schmale Bildschirme) aria-current="true" statt
//   aria-expanded — dort ist jeder Text sichtbar, „zugeklappt" waere falsch.
//   Wechselt die Form (ResizeObserver), wird die Ansage neu gesetzt. Quer
//   gewischt = gewaehlt (IntersectionObserver mit dem Streifen als root,
//   Anteil > 60 % — waehrend des Wischens sind zwei Karten halb sichtbar);
//   ein Klick zieht die Karte quer heran (weich nur ohne reduzierte
//   Bewegung). Pfeile runter/rechts, hoch/links ohne Umlauf, Pos1, Ende
//   fokussieren und oeffnen. Das Behavior setzt
//   data-neo-device-accordion="aktiv" an der Wurzel — erst dann klappt das
//   SCSS zu und blendet die Einzelgeraete aus (ohne Skript ist jede Station
//   offen und zeigt ihr eigenes Geraet).
//
// Tabs (Optionen .nc-product-showcase__option als Knoepfe, Website-Block
// neo_product_showcase): Tabs-Muster mit automatischer Aktivierung —
// role=tablist an .nc-product-showcase__options, Optionen role=tab mit
// aria-selected, wanderndem tabindex und aria-controls auf das geteilte
// Medien-Panel .nc-product-showcase__media-panel (role=tabpanel,
// aria-labelledby = gewaehlte Option). Pfeile rundum, Pos1, Ende waehlen und
// fokussieren. Das Medium der Option (data-station an Option und Medium,
// sonst Reihenfolge) wird .is-active.
//   Beschreibung  .nc-product-showcase__description steht im Markup
//   UNTER ihrer Option, also innerhalb der Tableiste. Ein tabpanel (oder
//   region) dort ist ein unzulaessiges Kind der tablist (axe
//   aria-required-children; so war es vorher mit role=region). Sie bleibt
//   deshalb ohne Rolle (lesbar im Lesemodus), offen .is-open, die anderen
//   [hidden], und ist per aria-describedby an ihre Option gebunden. Ihr Text
//   wird beim Wechsel neu eingesetzt, damit die Einblende-Animation (SCSS)
//   erneut laeuft. (Phase 7 baut die Optionen im Twig — dann kann die
//   Beschreibung aus der Tableiste heraus.)
//
// Ereignis: `product-showcase-change` { index, previousIndex }, wenn die
// gewaehlte Option bzw. offene Station wechselt.
// ==========================================================================
import { sende, zielFuerTaste } from './kern.js'
import { reduzierteBewegung } from './gallery.js'

let zaehler = 0

/**
 * Merkt sich Attribute vor dem Aendern und stellt sie beim Abbinden her.
 * @returns {{ setze: (el: Element, name: string, wert: string|null) => void, zurueck: () => void }}
 */
function merker () {
  /** @type {Map<Element, Map<string, string|null>>} */
  const alt = new Map()
  return {
    setze (el, name, wert) {
      let m = alt.get(el)
      if (!m) { m = new Map(); alt.set(el, m) }
      if (!m.has(name)) m.set(name, el.getAttribute(name))
      if (wert === null) el.removeAttribute(name)
      else el.setAttribute(name, wert)
    },
    zurueck () {
      for (const [el, m] of alt) {
        for (const [name, wert] of m) {
          if (wert === null) el.removeAttribute(name)
          else el.setAttribute(name, wert)
        }
      }
      alt.clear()
    }
  }
}

export const productShowcase = {
  id: 'product-showcase',
  selektor: '.nc-product-showcase',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    if (wurzel.querySelector('.nc-product-showcase__trigger')) stationen(wurzel, signal)
    else tabs(wurzel, signal)
  }
}

/** Medien der Wurzel (im geteilten Panel) */
const medienVon = (wurzel) => /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-product-showcase__media-panel .nc-product-showcase__media-item')])

/** Medium zur Option: gleiches data-station, sonst gleiche Position
 * @param {HTMLElement[]} medien @param {HTMLElement} option @param {number} i */
function mediumZu (medien, option, i) {
  const st = option.dataset.station
  if (st !== undefined) return medien.find((m) => m.dataset.station === st) || null
  return medien[i] || null
}

// --------------------------------------------------------------------------
// Modus Stationen (Geraete-Strecke)
// --------------------------------------------------------------------------

/** @param {HTMLElement} wurzel @param {AbortSignal} signal */
function stationen (wurzel, signal) {
  const liste = /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-product-showcase__option')])
    .filter((st) => st.querySelector('.nc-product-showcase__trigger'))
  if (!liste.length) return
  const ansicht = wurzel.ownerDocument.defaultView || window
  const streifen = /** @type {HTMLElement|null} */ (wurzel.querySelector('.nc-product-showcase__options'))
  const medien = medienVon(wurzel)
  const knopfVon = (st) => /** @type {HTMLElement} */ (st.querySelector('.nc-product-showcase__trigger'))
  const m = merker()

  /** Liegen die Stationen nebeneinander? Dann ist keine zugeklappt. */
  const quer = () => !!streifen && ansicht.getComputedStyle(streifen).flexDirection === 'row'

  let offen = -1

  /** Zustand setzen (ohne Ereignis) @param {number} nr */
  function zeige (nr) {
    offen = nr
    const istQuer = quer()
    liste.forEach((st, i) => {
      const an = i === nr
      st.classList.toggle('is-active', an)
      const k = knopfVon(st)
      if (istQuer) {
        m.setze(k, 'aria-expanded', null)
        m.setze(k, 'aria-current', an ? 'true' : null)
      } else {
        m.setze(k, 'aria-current', null)
        m.setze(k, 'aria-expanded', String(an))
      }
    })
    liste.forEach((st, i) => {
      const b = mediumZu(medien, st, i)
      if (b) b.classList.toggle('is-active', i === nr)
    })
  }

  /** @param {number} nr */
  function oeffne (nr) {
    const vorher = offen
    if (nr === vorher) return
    zeige(nr)
    sende(wurzel, 'product-showcase-change', { index: nr, previousIndex: vorher })
  }

  liste.forEach((st, i) => {
    const k = knopfVon(st)
    k.addEventListener('click', () => {
      // Quer zieht der Klick die Karte heran — sonst markierte er eine
      // Karte, die halb aus dem Bild ragt.
      if (quer() && streifen) {
        const links = streifen.scrollLeft + (st.getBoundingClientRect().left - streifen.getBoundingClientRect().left)
        const ziel = { left: links, behavior: /** @type {ScrollBehavior} */ (reduzierteBewegung(wurzel) ? 'instant' : 'auto') }
        if (typeof streifen.scrollTo === 'function') streifen.scrollTo(ziel)
        else streifen.scrollLeft = links
      }
      oeffne(i)
    }, { signal })
    // Pfeile wandern durch die Stationen (ohne Umlauf), Pos1/Ende springen
    k.addEventListener('keydown', (e) => {
      let ziel = -1
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') ziel = i + 1
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ziel = i - 1
      else if (e.key === 'Home') ziel = 0
      else if (e.key === 'End') ziel = liste.length - 1
      else return
      if (ziel < 0 || ziel >= liste.length) return
      e.preventDefault()
      knopfVon(liste[ziel]).focus()
      oeffne(ziel)
    }, { signal })
  })

  // Quer gewischt = gewaehlt. Beobachtet wird der Streifen selbst: die
  // Karten bewegen sich in einem eigenen Scrollbereich, das Fenster steht.
  const Beobachter = /** @type {any} */ (globalThis).IntersectionObserver || /** @type {any} */ (ansicht).IntersectionObserver
  let beobachter = null
  if (streifen && typeof Beobachter === 'function') {
    beobachter = new Beobachter((eintraege) => {
      if (!quer()) return
      let beste = null
      for (const e of eintraege) if (!beste || e.intersectionRatio > beste.intersectionRatio) beste = e
      // Nur eine Karte, die wirklich im Bild steht — sonst flackert der
      // Screen zwischen zwei halb sichtbaren.
      if (beste && beste.isIntersecting && beste.intersectionRatio > 0.6) {
        const nr = liste.indexOf(beste.target)
        if (nr !== -1) oeffne(nr)
      }
    }, { root: streifen, threshold: [0.3, 0.6, 0.9] })
    for (const st of liste) beobachter.observe(st)
  }

  // Wer das Fenster dreht, wechselt die Form — und damit die Ansage.
  const Groesse = /** @type {any} */ (globalThis).ResizeObserver || /** @type {any} */ (ansicht).ResizeObserver
  let groesse = null
  if (typeof Groesse === 'function') {
    let form = quer()
    groesse = new Groesse(() => {
      const jetzt = quer()
      if (jetzt === form) return
      form = jetzt
      zeige(Math.max(0, offen))
    })
    groesse.observe(wurzel.ownerDocument.documentElement)
  }

  m.setze(wurzel, 'data-neo-device-accordion', 'aktiv')
  const anfang = liste.findIndex((st) => st.classList.contains('is-active'))
  zeige(anfang === -1 ? 0 : anfang)

  signal.addEventListener('abort', () => {
    beobachter?.disconnect()
    groesse?.disconnect()
    m.zurueck()
  })
}

// --------------------------------------------------------------------------
// Modus Tabs (Optionen)
// --------------------------------------------------------------------------

/** @param {HTMLElement} wurzel @param {AbortSignal} signal */
function tabs (wurzel, signal) {
  const liste = /** @type {HTMLElement|null} */ (wurzel.querySelector('.nc-product-showcase__options'))
  if (!liste) return
  const optionen = /** @type {HTMLElement[]} */ ([...liste.querySelectorAll('.nc-product-showcase__option')])
  // Das Theme baut die Optionen erst aus JSON und bindet danach (neu)
  if (!optionen.length) return
  const medien = medienVon(wurzel)
  const m = merker()
  const basis = wurzel.id || 'nc-product-showcase-' + (++zaehler)

  /** Beschreibung der Option: in ihrer Gruppe */
  const panele = optionen.map((o) => /** @type {HTMLElement|null} */ (o.closest('.nc-product-showcase__option-group')?.querySelector('.nc-product-showcase__description') || null))
  const panel = /** @type {HTMLElement|null} */ (wurzel.querySelector('.nc-product-showcase__media-panel'))

  m.setze(liste, 'role', 'tablist')
  if (panel) {
    if (!panel.id) m.setze(panel, 'id', `${basis}-medien`)
    m.setze(panel, 'role', 'tabpanel')
  }
  optionen.forEach((o, i) => {
    if (!o.id) m.setze(o, 'id', `${basis}-tab-${i}`)
    m.setze(o, 'role', 'tab')
    m.setze(o, 'aria-pressed', null)
    if (panel) m.setze(o, 'aria-controls', panel.id)
    const p = panele[i]
    if (!p) return
    if (!p.id) m.setze(p, 'id', `${basis}-text-${i}`)
    // role=region (neoProductShowcase bis 6a) ist in der tablist unzulaessig
    m.setze(p, 'role', null)
    m.setze(p, 'aria-hidden', null)
    if ((p.textContent || '').trim()) m.setze(o, 'aria-describedby', p.id)
  })

  let jetzt = optionen.findIndex((o) => o.getAttribute('aria-selected') === 'true' || o.classList.contains('is-active'))
  if (jetzt === -1) jetzt = 0

  /** Zustand setzen (ohne Ereignis) @param {number} nr @param {boolean} neuEinblenden */
  function zeige (nr, neuEinblenden) {
    jetzt = nr
    if (panel) m.setze(panel, 'aria-labelledby', optionen[nr].id)
    optionen.forEach((o, i) => {
      const an = i === nr
      m.setze(o, 'aria-selected', String(an))
      m.setze(o, 'tabindex', an ? '0' : '-1')
      o.classList.toggle('is-active', an)
      const p = panele[i]
      if (p) {
        p.classList.toggle('is-open', an)
        m.setze(p, 'hidden', an ? null : '')
        // Einblende-Animation des Textes erneut ausloesen: Element ersetzen
        const text = an && neuEinblenden ? p.querySelector('.nc-product-showcase__description-text') : null
        if (text) text.replaceWith(text.cloneNode(true))
      }
      const b = mediumZu(medien, o, i)
      if (b) b.classList.toggle('is-active', an)
    })
  }

  /** @param {number} nr @param {boolean} fokus */
  function waehle (nr, fokus) {
    const vorher = jetzt
    if (fokus) optionen[nr].focus()
    if (nr === vorher) return
    zeige(nr, true)
    sende(wurzel, 'product-showcase-change', { index: nr, previousIndex: vorher })
  }

  zeige(jetzt, false)

  const optionVon = (e) => /** @type {HTMLElement|null} */ (/** @type {HTMLElement} */ (e.target).closest?.('.nc-product-showcase__option'))
  liste.addEventListener('click', (e) => {
    const o = optionVon(e)
    if (o && optionen.includes(o)) waehle(optionen.indexOf(o), false)
  }, { signal })
  liste.addEventListener('keydown', (e) => {
    const o = optionVon(e)
    if (!o || !optionen.includes(o)) return
    const ziel = zielFuerTaste(e.key, optionen, o, 'beide')
    if (!ziel) return
    e.preventDefault()
    waehle(optionen.indexOf(ziel), true)
  }, { signal })

  signal.addEventListener('abort', () => m.zurueck())
}
