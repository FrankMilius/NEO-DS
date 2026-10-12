// @ts-check
// ==========================================================================
// Akkordeon — nach data/accordion-recipe.json (keyboard, events)
// ==========================================================================
// Die Eintraege sind <details>/<summary>: Auf- und Zuklappen (Enter,
// Leertaste, Klick) macht der Browser. Das Behavior ergaenzt die Pfeiltasten
// (hoch/runter, Pos1, Ende) zwischen den Kopfzeilen, „nur eines offen" per
// data-neo-accordion="einzeln" (zusaetzlich zum name-Attribut) und das
// Ereignis `accordion-toggle` { itemId, open }.
//
// Gesperrte Eintraege (Ausloeser mit aria-disabled="true", Recipe-Zustand
// disabled): das DS nimmt ihnen nur die Maus (pointer-events: none) — Enter
// und Leertaste loesen am <summary> trotzdem einen Klick aus und klappten
// auf. Das Behavior verwirft diesen Klick; die Pfeiltasten ueberspringen
// gesperrte Ausloeser (nachbar/ersterBedienbar).
//
// Aus Drupal.behaviors.neoAccordion (neo_fe/js/neo-theme.js; Plan v4,
// Phase 6b, 12.10.2026) — was ein Dokument allein nicht kann:
//
//   Sprungziel   /seite#eintrag: der Eintrag mit dieser id klappt auf (auch
//                ein umschliessender Eintrag) und wird an den Anfang
//                gescrollt — beim Binden (nach dem Layout, im naechsten
//                Bild), bei hashchange und beim erneuten Klick auf einen
//                Verweis mit demselben Ziel (dann gibt es kein hashchange).
//                Sanft nur ohne prefers-reduced-motion (vorher immer
//                sanft). Ereignis `accordion-target` { itemId }.
//   Mitscrollen  data-behavior="single-scroll" (am Akkordeon oder einem
//                Vorfahren, field_acc_behavior): oeffnet sich ein Eintrag,
//                holt das Behavior seinen Kopf nach 100 ms unter die
//                Kopfzeile (.site-header[data-neo-nav] + 16 px) zurueck,
//                wenn er nicht im Bild steht — „nur eines offen" schliesst
//                den langen Eintrag darueber, der geoeffnete rutschte sonst
//                aus dem Bild. Sanft nur ohne reduzierte Bewegung.
//   Alle auf-/   Knopf [data-neo-accordion-toggle-all] mit aria-controls =
//   zuklappen    id des Akkordeons (steht im Block ausserhalb der Wurzel):
//                Klick oeffnet alle bzw. schliesst alle, aria-expanded =
//                alle offen; Beschriftung ([data-label-auf] im Knopf)
//                „Alle aufklappen“/„Alle zuklappen“ (en „Expand all“/
//                „Collapse all“) nach lang, ueberschreibbar per
//                data-text-expand/data-text-collapse am Knopf (vorher fest
//                deutsch). Folgt auch dem Oeffnen von Hand. Ereignis
//                `accordion-toggle-all` { open }.
// Abbinden loest alle Lauscher und Zeitgeber und stellt Beschriftung und
// aria-expanded des Knopfs her.
// ==========================================================================
import { sende, nachbar, ersterBedienbar } from './kern.js'
import { reduzierteBewegung, spracheVon } from './gallery.js'

export const TEXTE = {
  de: { expand: 'Alle aufklappen', collapse: 'Alle zuklappen' },
  en: { expand: 'Expand all', collapse: 'Collapse all' }
}

/** Abstand des Mitscrollens unter der Kopfzeile (px), wie neoAccordion */
const ABSTAND = 16
/** Wartezeit nach dem Oeffnen, bis „nur eines offen" geschlossen hat (ms) */
const WARTEN = 100

export const akkordeon = {
  id: 'accordion',
  selektor: '.nc-accordion',
  binde (wurzel, signal) {
    const eintraege = () => /** @type {HTMLDetailsElement[]} */ ([...wurzel.querySelectorAll(':scope > .nc-accordion__item, :scope > * > .nc-accordion__item')])
    const koepfe = () => eintraege().map((e) => /** @type {HTMLElement} */ (e.querySelector('.nc-accordion__trigger'))).filter(Boolean)
    const einzeln = wurzel.dataset.neoAccordion === 'einzeln'

    wurzel.addEventListener('toggle', (e) => {
      const item = /** @type {HTMLDetailsElement} */ (e.target)
      if (!item.classList?.contains('nc-accordion__item')) return
      if (einzeln && item.open) for (const andere of eintraege()) if (andere !== item && andere.open) andere.open = false
      sende(wurzel, 'accordion-toggle', { itemId: item.id || null, open: item.open })
    }, { signal, capture: true })

    wurzel.addEventListener('click', (e) => {
      const kopf = /** @type {HTMLElement} */ (e.target).closest?.('.nc-accordion__trigger')
      if (kopf?.getAttribute('aria-disabled') === 'true' && wurzel.contains(kopf)) e.preventDefault()
    }, { signal })

    wurzel.addEventListener('keydown', (e) => {
      const kopf = /** @type {HTMLElement} */ (e.target).closest('.nc-accordion__trigger')
      if (!kopf) return
      const alle = koepfe()
      let ziel = null
      if (e.key === 'ArrowDown') ziel = nachbar(alle, kopf, 1)
      else if (e.key === 'ArrowUp') ziel = nachbar(alle, kopf, -1)
      else if (e.key === 'Home') ziel = ersterBedienbar(alle)
      else if (e.key === 'End') ziel = ersterBedienbar(alle, true)
      if (!ziel) return
      e.preventDefault()
      ziel.focus()
    }, { signal })

    sprungziel(wurzel, signal, eintraege)
    mitscrollen(wurzel, signal, eintraege)
    alleUmschalten(wurzel, signal, eintraege)
  }
}

/** Sanft scrollen nur ohne reduzierte Bewegung @param {HTMLElement} el */
const art = (el) => /** @type {ScrollBehavior} */ (reduzierteBewegung(el) ? 'auto' : 'smooth')

/**
 * Sprungziel /seite#eintrag oeffnen.
 * @param {HTMLElement} wurzel @param {AbortSignal} signal @param {() => HTMLDetailsElement[]} eintraege
 */
function sprungziel (wurzel, signal, eintraege) {
  const dok = wurzel.ownerDocument
  const ansicht = dok.defaultView
  if (!ansicht) return

  const oeffne = () => {
    let kennung = ansicht.location.hash.slice(1)
    try { kennung = decodeURIComponent(kennung) } catch { /* roh lassen */ }
    if (!kennung) return
    const ziel = /** @type {HTMLElement|null} */ ([...wurzel.querySelectorAll('.nc-accordion__item')].find((e) => e.id === kennung) || null)
    // Ein inneres Akkordeon behandelt seine Eintraege selbst
    if (!ziel || ziel.closest('.nc-accordion') !== wurzel || !eintraege().includes(/** @type {HTMLDetailsElement} */ (ziel))) return
    // Bei „nur eines offen" schliesst das name-Attribut die uebrigen selbst;
    // umschliessende Eintraege (verschachtelt) muessen mit auf
    for (let el = /** @type {HTMLElement|null} */ (ziel); el; el = el.parentElement) {
      if (el.tagName === 'DETAILS') /** @type {HTMLDetailsElement} */ (el).open = true
    }
    ziel.scrollIntoView({ behavior: art(wurzel), block: 'start' })
    sende(wurzel, 'accordion-target', { itemId: ziel.id })
  }

  ansicht.addEventListener('hashchange', oeffne, { signal })
  // Derselbe Verweis ein zweites Mal: kein hashchange — trotzdem dasselbe
  dok.addEventListener('click', (e) => {
    const a = /** @type {HTMLAnchorElement|null} */ (/** @type {HTMLElement} */ (e.target).closest?.('a[href*="#"]'))
    if (!a || e.defaultPrevented) return
    let url
    try { url = new URL(a.href, ansicht.location.href) } catch { return }
    if (!url.hash || url.hash !== ansicht.location.hash || url.pathname !== ansicht.location.pathname) return
    ansicht.requestAnimationFrame(() => { if (!signal.aborted) oeffne() })
  }, { signal })
  if (ansicht.location.hash) {
    // Nach dem Layout, sonst springt der Browser an die Stelle, an der das
    // noch zugeklappte Element stand
    const bild = ansicht.requestAnimationFrame(oeffne)
    signal.addEventListener('abort', () => ansicht.cancelAnimationFrame(bild))
  }
}

/**
 * „nur eines offen, mitscrollen" (data-behavior="single-scroll").
 * @param {HTMLElement} wurzel @param {AbortSignal} signal @param {() => HTMLDetailsElement[]} eintraege
 */
function mitscrollen (wurzel, signal, eintraege) {
  if (!wurzel.closest('[data-behavior="single-scroll"]')) return
  const dok = wurzel.ownerDocument
  const ansicht = dok.defaultView
  if (!ansicht) return
  // Ein Zeitgeber je Eintrag (ein zweites toggle ersetzt den ersten)
  /** @type {Map<HTMLElement, number>} */
  const uhren = new Map()
  signal.addEventListener('abort', () => { for (const u of uhren.values()) ansicht.clearTimeout(u) })

  wurzel.addEventListener('toggle', (e) => {
    const item = /** @type {HTMLDetailsElement} */ (e.target)
    if (!item.open || !eintraege().includes(item)) return
    if (uhren.has(item)) ansicht.clearTimeout(uhren.get(item))
    uhren.set(item, ansicht.setTimeout(() => {
      uhren.delete(item)
      const kopf = item.querySelector('.nc-accordion__trigger')
      if (!kopf) return
      const nav = /** @type {HTMLElement|null} */ (dok.querySelector('.site-header[data-neo-nav]'))
      const oben = ((nav && nav.offsetHeight) || 0) + ABSTAND
      const r = kopf.getBoundingClientRect()
      // Steht er schon im Bild, bleibt die Seite ruhig
      if (r.top >= oben && r.bottom <= ansicht.innerHeight) return
      ansicht.scrollTo({ top: Math.max(0, r.top + ansicht.scrollY - oben), behavior: art(wurzel) })
    }, WARTEN))
  }, { signal, capture: true })
}

/**
 * Knopf „Alle aufklappen" (ausserhalb der Wurzel, aria-controls = id).
 * @param {HTMLElement} wurzel @param {AbortSignal} signal @param {() => HTMLDetailsElement[]} eintraege
 */
function alleUmschalten (wurzel, signal, eintraege) {
  if (!wurzel.id) return
  const knoepfe = /** @type {HTMLElement[]} */ ([...wurzel.ownerDocument.querySelectorAll('[data-neo-accordion-toggle-all]')])
    .filter((k) => k.getAttribute('aria-controls') === wurzel.id)
  for (const knopf of knoepfe) {
    const beschriftung = /** @type {HTMLElement|null} */ (knopf.querySelector('[data-label-auf]'))
    const vorher = { text: beschriftung?.textContent ?? null, expanded: knopf.getAttribute('aria-expanded') }
    const texte = TEXTE[spracheVon(knopf)]
    const textAuf = knopf.dataset.textExpand || texte.expand
    const textZu = knopf.dataset.textCollapse || texte.collapse

    const nachfuehren = () => {
      const liste = eintraege()
      const alleOffen = liste.length > 0 && liste.every((e) => e.open)
      knopf.setAttribute('aria-expanded', String(alleOffen))
      if (beschriftung) beschriftung.textContent = alleOffen ? textZu : textAuf
    }

    knopf.addEventListener('click', () => {
      const auf = knopf.getAttribute('aria-expanded') !== 'true'
      for (const e of eintraege()) e.open = auf
      nachfuehren()
      sende(wurzel, 'accordion-toggle-all', { open: auf })
    }, { signal })
    // Wer einzelne Eintraege von Hand oeffnet, aendert, was der Knopf als
    // naechstes tun muss
    wurzel.addEventListener('toggle', nachfuehren, { signal, capture: true })
    signal.addEventListener('abort', () => {
      if (beschriftung && vorher.text !== null) beschriftung.textContent = vorher.text
      if (vorher.expanded === null) knopf.removeAttribute('aria-expanded')
      else knopf.setAttribute('aria-expanded', vorher.expanded)
    })
    nachfuehren()
  }
}
