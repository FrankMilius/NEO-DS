// @ts-check
// ==========================================================================
// Footer — nach data/footer-recipe.json (keyboard, events)
// ==========================================================================
// Website-Bauteil (Plan v4, Phase 6b, 12.10.2026): Knopf „Nach oben" aus
// Drupal.behaviors.neoBackToTop (neo_fe/js/neo-theme.js). Wurzel .nc-footer,
// Knopf [data-back-to-top] (.nc-footer__backtotop) darin.
//
//   Klick (auch Enter/Leertaste, nativer Knopf): die Seite scrollt an den
//   Anfang — sanft nur ohne prefers-reduced-motion (wie bisher) — und der
//   Fokus geht an den Seitenanfang (WCAG 2.4.3; vorher blieb er unten am
//   Knopf, die naechste Tab-Taste fuehrte wieder in den Footer):
//     - Ziel: data-back-to-top="#id" am Knopf, sonst der Hauptinhalt
//       (main, [role="main"]), sonst <body>;
//     - ist das Ziel nicht fokussierbar, bekommt es tabindex="-1", bis es
//       den Fokus wieder abgibt (dann wieder ohne);
//     - focus({ preventScroll: true }), damit das sanfte Scrollen nicht
//       abreisst. Die naechste Tab-Taste fuehrt ins erste Element des
//       Hauptinhalts.
//
// Ereignis `footer-back-to-top` { target } an der Wurzel: id des Ziels (oder
// null). Abbinden loest den Lauscher und nimmt ein gesetztes tabindex weg.
// ==========================================================================
import { sende } from './kern.js'
import { reduzierteBewegung } from './gallery.js'

const FOKUSSIERBAR = 'a[href], button, input, select, textarea, summary, [tabindex]'

/** Fokusziel des Knopfs @param {HTMLElement} knopf */
function zielVon (knopf) {
  const dok = knopf.ownerDocument
  const wert = knopf.getAttribute('data-back-to-top') || ''
  if (wert.startsWith('#') && wert.length > 1) {
    const el = dok.getElementById(wert.slice(1))
    if (el) return el
  }
  return /** @type {HTMLElement} */ (dok.querySelector('main, [role="main"]') || dok.body)
}

export const footer = {
  id: 'footer',
  selektor: '.nc-footer',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const ansicht = wurzel.ownerDocument.defaultView || window
    /** @type {HTMLElement|null} */
    let gesetzt = null
    const zuruecknehmen = () => {
      if (gesetzt) gesetzt.removeAttribute('tabindex')
      gesetzt = null
    }
    signal.addEventListener('abort', zuruecknehmen)

    wurzel.addEventListener('click', (e) => {
      const knopf = /** @type {HTMLElement|null} */ (/** @type {HTMLElement} */ (e.target).closest?.('[data-back-to-top]'))
      if (!knopf || !wurzel.contains(knopf)) return
      ansicht.scrollTo({ top: 0, behavior: reduzierteBewegung(wurzel) ? 'auto' : 'smooth' })
      const ziel = zielVon(knopf)
      if (!ziel.matches(FOKUSSIERBAR)) {
        zuruecknehmen()
        ziel.setAttribute('tabindex', '-1')
        gesetzt = ziel
        ziel.addEventListener('blur', zuruecknehmen, { once: true, signal })
      }
      ziel.focus({ preventScroll: true })
      sende(wurzel, 'footer-back-to-top', { target: ziel.id || null })
    }, { signal })
  }
}
