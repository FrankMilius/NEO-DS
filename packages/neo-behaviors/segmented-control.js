// @ts-check
// ==========================================================================
// Segmented Control — nach data/segmented-control-recipe.json (keyboard, events)
// ==========================================================================
// Immer Einzelauswahl (role="radiogroup", Segmente role="radio" +
// aria-checked; ohne role="radio" ersatzweise aria-pressed). Klick waehlt ein
// Segment; Pfeiltasten, Pos1, Ende wandern und waehlen dabei (Radio-Muster,
// roving tabindex). Gesperrte Segmente werden uebersprungen.
//
// Gleitender Indikator: Steht .nc-segmented-control__indicator in der Leiste,
// legt setzeIndikator() ihn unter das gewaehlte Segment (--_indicator-left,
// --_indicator-width; die Bewegung macht das CSS). Dieselbe Funktion nutzt
// die Arena-Vorlage (arena-templates/segmented-control.js, einrichten()).
//
// Ereignis `segment-change` { value, previousValue }.
// ==========================================================================
import { sende, zielFuerTaste, gesperrt } from './kern.js'

const SEGMENT = '.nc-segmented-control__item'

/**
 * Legt den gleitenden Indikator unter das gewaehlte Segment.
 * @param {HTMLElement} leiste .nc-segmented-control
 */
export function setzeIndikator (leiste) {
  const gewaehlt = /** @type {HTMLElement|null} */ (leiste.querySelector(`${SEGMENT}[aria-checked="true"], ${SEGMENT}[aria-pressed="true"]`))
  if (!gewaehlt || !leiste.querySelector('.nc-segmented-control__indicator')) return
  leiste.style.setProperty('--_indicator-left', `${gewaehlt.offsetLeft}px`)
  leiste.style.setProperty('--_indicator-width', `${gewaehlt.offsetWidth}px`)
}

/** Name eines Segments fuer Ereignisse: data-value, aria-label oder Text. */
export function wertVon (el) {
  return el.dataset.value || el.getAttribute('aria-label') || el.textContent.trim()
}

export const segmentedControl = {
  id: 'segmented-control',
  selektor: '.nc-segmented-control',
  binde (wurzel, signal) {
    const segmente = () => /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll(SEGMENT)])
    if (!segmente().length) return
    const attr = (el) => (el.getAttribute('role') === 'radio' ? 'aria-checked' : 'aria-pressed')
    const istGewaehlt = (el) => el.getAttribute(attr(el)) === 'true'

    const waehle = (segment) => {
      if (!segment || gesperrt(segment)) return
      const alle = segmente()
      const vorher = alle.find(istGewaehlt) || null
      for (const s of alle) {
        s.setAttribute(attr(s), String(s === segment))
        s.tabIndex = s === segment ? 0 : -1
      }
      setzeIndikator(wurzel)
      segment.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
      if (vorher !== segment) sende(wurzel, 'segment-change', { value: wertVon(segment), previousValue: vorher ? wertVon(vorher) : null })
    }

    // Startzustand: genau ein Segment im Tab-Fluss
    const start = segmente().find(istGewaehlt) || segmente().find((s) => !gesperrt(s))
    for (const s of segmente()) s.tabIndex = s === start ? 0 : -1
    setzeIndikator(wurzel)

    wurzel.addEventListener('click', (e) => {
      const segment = /** @type {HTMLElement} */ (e.target).closest(SEGMENT)
      if (segment && wurzel.contains(segment)) waehle(segment)
    }, { signal })

    wurzel.addEventListener('keydown', (e) => {
      const segment = /** @type {HTMLElement} */ (e.target).closest(SEGMENT)
      if (!segment) return
      const ziel = zielFuerTaste(e.key, segmente(), segment)
      if (!ziel) return
      e.preventDefault()
      ziel.focus()
      waehle(ziel)
    }, { signal })

    // Breite aendert sich (Schrift geladen, Fenster, volle Breite): Indikator nachziehen
    if (typeof ResizeObserver === 'function' && wurzel.querySelector('.nc-segmented-control__indicator')) {
      const beobachter = new ResizeObserver(() => setzeIndikator(wurzel))
      beobachter.observe(wurzel)
      signal.addEventListener('abort', () => beobachter.disconnect())
    }
  }
}
