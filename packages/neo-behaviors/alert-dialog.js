// @ts-check
// ==========================================================================
// Alert-Dialog — nach data/alert-dialog-recipe.json (keyboard, events)
// ==========================================================================
// WAI-ARIA alertdialog (Entscheidung 02.10.2026). Natives
// <dialog class="nc-alert-dialog" role="alertdialog">, geoeffnet per
// showModal() ueber einen Knopf mit aria-controls (siehe _dialog.js).
//   - Fokus beim Oeffnen auf die sichere Aktion, markiert im Markup
//     (Entscheidung 03.10.2026): das bedienbare Element mit [autofocus] im
//     Dialog; ohne Markierung [data-action="cancel"] (Abbrechen), sonst das
//     erste bedienbare Element. Beispiel „Sitzung laeuft ab“: autofocus auf
//     „Angemeldet bleiben“.
//   - Fokus-Falle (Tab/Shift+Tab), Fokus zurueck zum Ausloeser.
//   - Escape schliesst wie Abbrechen (reason 'escape').
//   - Klick auf den Hintergrund schliesst NICHT (die Entscheidung muss
//     bewusst fallen).
//   - Klick auf einen Knopf mit data-action schliesst; reason ist der Wert
//     ('cancel', 'confirm' oder ein eigener, z. B. 'discard').
//   - Manuelles Schliessen (Entscheidung 03.10.2026): traegt der <dialog>
//     data-close="manuell", schliesst ein Klick auf [data-action="confirm"]
//     NICHT, sondern meldet nur `alert-dialog-close` mit
//     { reason: 'confirm', action: 'confirm', open: true } — der Dialog ist
//     noch offen (z. B. waehrend gespeichert wird). Das Programm schliesst
//     selbst mit dialog.close() (Ereignis danach mit reason 'programmatic',
//     action null, open false; Fokus geht zurueck zum Ausloeser).
//     Abbrechen, eigene data-action-Werte und Escape schliessen weiter
//     sofort. Waehrend der Arbeit den
//     Knopf mit aria-disabled="true" sperren — gesperrte Knoepfe melden
//     nichts. Die Markierung sitzt am Dialog (nicht am Knopf): sie
//     beschreibt den Ablauf des ganzen Dialogs und gilt nur fuer confirm.
//
// Ereignisse `alert-dialog-open` {}, `alert-dialog-close`
// { reason, action, open } — reason: 'cancel', 'confirm', 'escape',
// 'programmatic' oder ein eigener data-action-Wert; action: der
// data-action-Wert des geklickten Knopfs (bei Escape/programmatic null);
// open: false, nur bei data-close="manuell" + confirm true (noch offen).
// ==========================================================================
import { dialogBehavior } from './_dialog.js'
import { fokussierbare, gesperrt, sende } from './kern.js'

const OHNE_KNOPF = ['escape', 'programmatic']

export const alertDialog = dialogBehavior({
  id: 'alert-dialog',
  selektor: 'dialog.nc-alert-dialog',
  praefix: 'alert-dialog',
  schliessen: '[data-action]',
  hintergrundSchliesst: () => false,
  schliessDetail: (reason) => ({ reason, action: OHNE_KNOPF.includes(reason) ? null : reason, open: false }),
  fokusZiel: (dialog) => {
    const bedienbar = fokussierbare(dialog).filter((e) => !gesperrt(e))
    const markiert = bedienbar.find((e) => e.hasAttribute('autofocus'))
    if (markiert) return markiert
    const abbrechen = /** @type {HTMLElement|null} */ (dialog.querySelector('[data-action="cancel"]'))
    return abbrechen && !gesperrt(abbrechen) ? abbrechen : bedienbar[0] || fokussierbare(dialog)[0] || null
  },
  aktion: (ziel, dialog) => {
    const knopf = /** @type {HTMLElement|null} */ (ziel.closest('[data-action]'))
    if (!knopf || !dialog.contains(knopf) || gesperrt(knopf)) return null
    const wert = knopf.getAttribute('data-action') || null
    if (wert === 'confirm' && dialog.getAttribute('data-close') === 'manuell') {
      // Nur melden — das Programm schliesst selbst (dialog.close())
      sende(dialog, 'alert-dialog-close', { reason: 'confirm', action: 'confirm', open: true })
      return null
    }
    return wert
  }
})
