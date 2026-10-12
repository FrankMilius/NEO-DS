// @ts-check
// ==========================================================================
// Tabellen-Info-Modal — nach data/table-info-modal-recipe.json (keyboard,
// events)
// ==========================================================================
// Info-Dialog zu einer Tabellenzelle (Entscheidung 06.10.2026,
// overlay-verhalten). Ersetzt in neo_fe/js/neo-theme.js
// (Drupal.behaviors.neoTable) openInfoModal/closeInfoModal und deren
// Ereignisse: dort setzte der Info-Knopf der Zelle den Text in __body,
// .is-open und aria-hidden, Fokus auf den Schliessen-Knopf;
// [data-modal-close] (Knopf und Backdrop) und Escape schlossen — ohne
// Fokus-Falle und ohne Fokus zurueck.
//
// Hier (gemeinsamer Teil _ueberlagerung.js): Ausloeser ist jeder Knopf mit
// aria-controls="<id des Dialogs>"; Fokus auf den Schliessen-Knopf (erstes
// bedienbares Element), Fokus-Falle, Rest der Seite inert, Escape,
// Schliessen-Knopf, Backdrop, Fokus zurueck zum Info-Knopf; geschlossen
// inert. Inhalt: traegt der Ausloeser data-info, setzt das Behavior den Text
// als Absaetze (Zeilenumbruch = neuer Absatz) in .nc-table-info-modal__body —
// als Text, nicht als HTML (die Website nutzte innerHTML). Ohne data-info
// bleibt der Inhalt, wie er ist.
//
// Name des Dialogs (Plan v4, Phase 5, 12.10.2026): traegt der Ausloeser
// data-info-label („Informationen zu Cloud, Premium"), wird das bei jedem
// Oeffnen das aria-label des Dialogs — ein Dialog je Tabelle dient vielen
// Knoepfen (vorher setzte neoTable den Namen per Klick-Lauscher am Knopf).
// Ein Name per aria-labelledby im Markup bleibt. Ohne data-info-label: fehlt
// dem Dialog ein Name, nimmt er den des Ausloesers (aria-label). Abbinden
// stellt das aria-label von vorher wieder her.
//
// Ereignisse `table-info-modal-open` {}, `table-info-modal-close` { reason }.
// ==========================================================================
import { ueberlagerungBehavior } from './_ueberlagerung.js'

/** aria-label des Dialogs vor dem ersten Oeffnen (null = keins) — fuer Abbinden */
const vorherigeNamen = /** @type {WeakMap<HTMLElement, string|null>} */ (new WeakMap())

const infoDialogBasis = ueberlagerungBehavior({
  id: 'table-info-modal',
  selektor: '.nc-table-info-modal',
  praefix: 'table-info-modal',
  offenKlasse: 'is-open',
  hintergrund: (p) => /** @type {HTMLElement|null} */ (p.querySelector(':scope > .nc-table-info-modal__backdrop')),
  schliessen: '.nc-table-info-modal__close, [data-modal-close]',
  beimOeffnen (panel, knopf) {
    if (!knopf) return
    if (!vorherigeNamen.has(panel)) vorherigeNamen.set(panel, panel.getAttribute('aria-label'))
    const text = knopf.getAttribute('data-info')
    const body = panel.querySelector('.nc-table-info-modal__body')
    if (text !== null && body) {
      body.replaceChildren(...text.split('\n').map((zeile) => {
        const p = panel.ownerDocument.createElement('p')
        p.textContent = zeile
        return p
      }))
    }
    if (panel.hasAttribute('aria-labelledby')) return
    const dialogName = knopf.getAttribute('data-info-label')?.trim()
    if (dialogName) panel.setAttribute('aria-label', dialogName)
    else if (!panel.hasAttribute('aria-label')) {
      const name = knopf.getAttribute('aria-label') || knopf.textContent?.trim()
      if (name) panel.setAttribute('aria-label', name)
    }
  }
})

export const tableInfoModal = {
  ...infoDialogBasis,
  /** @param {HTMLElement} panel @param {AbortSignal} signal */
  binde (panel, signal) {
    infoDialogBasis.binde(panel, signal)
    signal.addEventListener('abort', () => {
      if (!vorherigeNamen.has(panel)) return
      const name = vorherigeNamen.get(panel) ?? null
      vorherigeNamen.delete(panel)
      if (name === null) panel.removeAttribute('aria-label')
      else panel.setAttribute('aria-label', name)
    })
  },
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true
}
