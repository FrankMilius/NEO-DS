// @ts-check
// ==========================================================================
// Gemeinsamer Teil von Modal, Drawer und Alert-Dialog (natives <dialog>)
// ==========================================================================
// Oeffnen: ein Knopf mit aria-controls="<id des Dialogs>" (empfohlen mit
// aria-haspopup="dialog") irgendwo im Dokument → showModal(). Der Fokus geht
// auf [autofocus] bzw. das erste bedienbare Element im Dialog.
// Schliessen: Escape, Schliessen-Knopf (__close, [data-action="close"],
// [data-action="cancel"]), Klick auf den Hintergrund (::backdrop) — beim
// Modal nur mit data-backdrop-close="true", beim Drawer immer (Light
// Dismiss laut Recipe). Danach Fokus zurueck auf den Ausloeser.
// Tab/Shift+Tab bleiben im Dialog (Fokus-Falle; showModal() macht den Rest
// der Seite inert, die Falle haelt den Fokus auch vor der Browser-Leiste).
// Scroll-Rahmen: JS setzt die Klassen, die das SCSS erwartet.
//
// Ereignisse `<praefix>-open` {} und `<praefix>-close` { reason } —
// reason: 'escape', 'overlay-click', 'close-button', 'programmatic'.
//
// Abweichungen je Bauteil (optional):
//   fokusZiel(dialog)     Element, das beim Oeffnen den Fokus bekommt —
//                         ueberstimmt die Suche oben (Alert-Dialog:
//                         [autofocus], sonst Abbrechen)
//   aktion(ziel, dialog)  Grund fuer einen Klick im Dialog, der schliesst
//                         (oder null = bleibt offen) — ersetzt die
//                         Schliessen-Knoepfe oben
//   schliessDetail(reason) detail fuer `<praefix>-close` (Standard
//                         { reason }; Alert-Dialog: { reason, action, open })
// ==========================================================================
import { sende, fokussierbare, fokusFalle } from './kern.js'

/**
 * @param {{ id: string, selektor: string, praefix: string, schliessen: string,
 *   hintergrundSchliesst: (d: HTMLElement) => boolean,
 *   fokusZiel?: (d: HTMLElement) => HTMLElement|null,
 *   aktion?: (ziel: HTMLElement, d: HTMLElement) => string|null,
 *   scroll?: (d: HTMLElement, signal: AbortSignal) => void }} art
 */
export function dialogBehavior (art) {
  return {
    id: art.id,
    selektor: art.selektor,
    /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
    binde (wurzel, signal) {
      const dialog = /** @type {HTMLDialogElement} */ (wurzel)
      if (typeof dialog.showModal !== 'function') return
      const dok = dialog.ownerDocument
      let zurueck = /** @type {HTMLElement|null} */ (null)
      let grund = /** @type {string|null} */ (null)

      const oeffne = (ausloeser) => {
        if (dialog.open) return
        zurueck = ausloeser
        dialog.showModal()
        const eigen = art.fokusZiel?.(dialog)
        if (eigen) eigen.focus()
        else {
          const ziel = /** @type {HTMLElement|null} */ (dialog.querySelector('[autofocus]')) || fokussierbare(dialog)[0]
          if (ziel && !dialog.contains(dok.activeElement)) ziel.focus()
        }
        sende(dialog, `${art.praefix}-open`, {})
      }
      const schliesse = (warum) => {
        if (!dialog.open) return
        grund = warum
        dialog.close()
      }

      dok.addEventListener('click', (e) => {
        const knopf = /** @type {HTMLElement} */ (e.target).closest?.('[aria-controls]')
        if (!knopf || !dialog.id || knopf.getAttribute('aria-controls') !== dialog.id || dialog.contains(knopf)) return
        if (knopf.hasAttribute('disabled') || knopf.getAttribute('aria-disabled') === 'true') return
        e.preventDefault()
        oeffne(/** @type {HTMLElement} */ (knopf))
      }, { signal })

      dialog.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { e.preventDefault(); schliesse('escape') }
        else fokusFalle(e, dialog)
      }, { signal })
      // Escape ohne keydown (z. B. Zurueck-Geste): der Browser meldet `cancel`
      dialog.addEventListener('cancel', (e) => { e.preventDefault(); schliesse('escape') }, { signal })

      dialog.addEventListener('click', (e) => {
        const ziel = /** @type {HTMLElement} */ (e.target)
        if (ziel === dialog) {
          // Klick auf ::backdrop: Ziel ist der Dialog selbst, der Punkt liegt ausserhalb
          const r = dialog.getBoundingClientRect()
          const draussen = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom
          if (draussen && art.hintergrundSchliesst(dialog)) schliesse('overlay-click')
          return
        }
        const warum = art.aktion
          ? art.aktion(ziel, dialog)
          : ziel.closest(`${art.schliessen}, [data-action="close"], [data-action="cancel"]`) ? 'close-button' : null
        if (warum) schliesse(warum)
      }, { signal })

      dialog.addEventListener('close', () => {
        const reason = grund || 'programmatic'
        sende(dialog, `${art.praefix}-close`, art.schliessDetail ? art.schliessDetail(reason) : { reason })
        grund = null
        if (zurueck && zurueck.isConnected) zurueck.focus()
        zurueck = null
      }, { signal })

      art.scroll?.(dialog, signal)
    }
  }
}
