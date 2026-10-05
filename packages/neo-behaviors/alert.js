// @ts-check
// ==========================================================================
// Alert — nach data/alert-recipe.json (keyboard, events)
// ==========================================================================
// Der Alert ist statisch (role="alert" bzw. "status" im Markup). Verhalten
// hat nur die schliessbare Fassung: der Knopf .nc-alert__close nimmt den
// Alert aus dem Dokument (das SCSS kennt keine Ausblend-Animation). Lag der
// Fokus auf dem Knopf, geht er zum naechsten Bedienelement (WCAG 2.4.3).
// Der Details-Schalter ist natives <details>, die Aktion ein normaler Knopf
// des Programms — beides ohne Behavior.
//
// Ereignis `alert-dismiss` { reason } (reason: 'close').
// ==========================================================================
import { sende } from './kern.js'
import { fokusWeiter } from './_meldung.js'

export const alert = {
  id: 'alert',
  selektor: '.nc-alert',
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    wurzel.addEventListener('click', (e) => {
      const knopf = /** @type {HTMLElement} */ (e.target).closest('.nc-alert__close')
      if (!knopf || knopf.closest('.nc-alert') !== wurzel) return
      sende(wurzel, 'alert-dismiss', { reason: 'close' })
      fokusWeiter(wurzel)
      wurzel.remove()
    }, { signal })
  }
}
