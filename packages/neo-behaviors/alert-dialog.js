// @ts-check
// ==========================================================================
// Alert-Dialog — nach data/alert-dialog-recipe.json (keyboard, events)
// ==========================================================================
// WAI-ARIA alertdialog (Entscheidung 02.10.2026). Natives
// <dialog class="nc-alert-dialog" role="alertdialog">, geoeffnet per
// showModal() ueber einen Knopf mit aria-controls (siehe _dialog.js).
//   - Fokus beim Oeffnen auf die sichere Aktion: [data-action="cancel"]
//     (Abbrechen), sonst das erste bedienbare Element — auch wenn eine
//     andere Aktion [autofocus] traegt.
//   - Fokus-Falle (Tab/Shift+Tab), Fokus zurueck zum Ausloeser.
//   - Escape schliesst wie Abbrechen (reason 'escape').
//   - Klick auf den Hintergrund schliesst NICHT (die Entscheidung muss
//     bewusst fallen).
//   - Klick auf einen Knopf mit data-action schliesst; reason ist der Wert
//     ('cancel', 'confirm' oder ein eigener, z. B. 'discard').
//
// Ereignisse `alert-dialog-open` {}, `alert-dialog-close` { reason } —
// reason: 'cancel', 'confirm', 'escape', 'programmatic' oder ein eigener
// data-action-Wert.
// ==========================================================================
import { dialogBehavior } from './_dialog.js'
import { fokussierbare, gesperrt } from './kern.js'

export const alertDialog = dialogBehavior({
  id: 'alert-dialog',
  selektor: 'dialog.nc-alert-dialog',
  praefix: 'alert-dialog',
  schliessen: '[data-action]',
  hintergrundSchliesst: () => false,
  fokusZiel: (dialog) => {
    const abbrechen = /** @type {HTMLElement|null} */ (dialog.querySelector('[data-action="cancel"]'))
    return abbrechen && !gesperrt(abbrechen) ? abbrechen : fokussierbare(dialog)[0] || null
  },
  aktion: (ziel, dialog) => {
    const knopf = /** @type {HTMLElement|null} */ (ziel.closest('[data-action]'))
    if (!knopf || !dialog.contains(knopf) || gesperrt(knopf)) return null
    return knopf.getAttribute('data-action') || null
  }
})
