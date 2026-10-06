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
// bleibt der Inhalt, wie er ist. Fehlt dem Dialog ein Name, nimmt er den
// des Ausloesers (aria-label).
//
// Ereignisse `table-info-modal-open` {}, `table-info-modal-close` { reason }.
// ==========================================================================
import { ueberlagerungBehavior } from './_ueberlagerung.js'

export const tableInfoModal = {
  ...ueberlagerungBehavior({
    id: 'table-info-modal',
    selektor: '.nc-table-info-modal',
    praefix: 'table-info-modal',
    offenKlasse: 'is-open',
    hintergrund: (p) => /** @type {HTMLElement|null} */ (p.querySelector(':scope > .nc-table-info-modal__backdrop')),
    schliessen: '.nc-table-info-modal__close, [data-modal-close]',
    beimOeffnen (panel, knopf) {
      if (!knopf) return
      const text = knopf.getAttribute('data-info')
      const body = panel.querySelector('.nc-table-info-modal__body')
      if (text !== null && body) {
        body.replaceChildren(...text.split('\n').map((zeile) => {
          const p = panel.ownerDocument.createElement('p')
          p.textContent = zeile
          return p
        }))
      }
      if (!panel.hasAttribute('aria-labelledby') && !panel.hasAttribute('aria-label')) {
        const name = knopf.getAttribute('aria-label') || knopf.textContent?.trim()
        if (name) panel.setAttribute('aria-label', name)
      }
    }
  }),
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true
}
