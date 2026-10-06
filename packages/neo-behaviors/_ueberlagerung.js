// @ts-check
// ==========================================================================
// Gemeinsamer Teil von Mobile-Drawer und Tabellen-Info-Modal
// ==========================================================================
// Beide Bauteile sind Ueberlagerungen OHNE natives <dialog> (aus dem
// Drupal-Theme aufgenommen): das SCSS blendet sie ueber eine Klasse ein
// (Mobile-Drawer: .nc-mobile-drawer--open + Backdrop --visible,
// Info-Modal: .is-open). Geschlossen bleiben sie im Layout (transform bzw.
// opacity) — ohne Behavior waeren ihre Knoepfe und Links per Tab erreichbar,
// obwohl man sie nicht sieht. Das Behavior macht daraus einen modalen
// Dialog nach WAI-ARIA (Entscheidung 06.10.2026, overlay-verhalten), mit
// den Hilfen aus kern.js (fokussierbare, fokusFalle) und dem Muster aus
// _dialog.js/shell.js:
//
//   Oeffnen      ein Knopf mit aria-controls="<id des Panels>" irgendwo im
//                Dokument (nicht im Panel) — aria-expanded am Knopf, Fokus
//                auf [autofocus] bzw. das erste bedienbare Element im Panel
//                (sonst das Panel selbst, tabindex="-1" fuer die Dauer).
//                Ein zweiter Klick auf denselben Knopf schliesst (wie der
//                Umschalter der Website).
//   Modal        Tab/Shift+Tab bleiben im Panel (fokusFalle); der Rest der
//                Seite wird inert — Geschwister des Panels und seiner
//                Vorfahren bis <body>, ausser dem Backdrop. Beim Schliessen
//                und Abbinden nimmt das Behavior nur das eigene inert zurueck.
//   Geschlossen  Panel mit inert und aria-hidden="true": nicht per Tab
//                erreichbar, nicht vorgelesen (Verbesserung gegenueber der
//                Website, dort blieb der unsichtbare Inhalt im Tab-Fluss).
//   Schliessen   Escape, Schliessen-Knopf, Klick auf den Backdrop (wie
//                neo-theme.js); danach Fokus zurueck zum Ausloeser (auf der
//                Website nur bei Escape).
//
// Ereignisse `<praefix>-open` {} und `<praefix>-close` { reason } —
// reason: 'escape', 'overlay-click', 'close-button', 'trigger', 'resize'.
//
// Je Bauteil:
//   offenKlasse         Klasse am Panel im offenen Zustand
//   hintergrund(panel)  Backdrop-Element (oder null)
//   hintergrundKlasse   Klasse am Backdrop im offenen Zustand (optional)
//   schliessen          Selektor der Schliessen-Knoepfe im Panel
//   beimOeffnen(panel, knopf)  optional, z. B. Inhalt aus dem Ausloeser
//   nochDa(panel)       optional: false = Lage passt nicht mehr (Fenster
//                       waechst, DS blendet aus) → schliessen ('resize')
//   seiteSperren        optional: Klasse an <body> waehrend offen
// ==========================================================================
import { sende, fokussierbare, fokusFalle, gesperrt } from './kern.js'

/**
 * @param {{ id: string, selektor: string, praefix: string, offenKlasse: string,
 *   hintergrund: (p: HTMLElement) => HTMLElement|null, hintergrundKlasse?: string,
 *   schliessen: string, beimOeffnen?: (p: HTMLElement, knopf: HTMLElement|null) => void,
 *   nochDa?: (p: HTMLElement) => boolean, seiteSperren?: string }} art
 */
export function ueberlagerungBehavior (art) {
  return {
    id: art.id,
    selektor: art.selektor,
    /** @param {HTMLElement} panel @param {AbortSignal} signal */
    binde (panel, signal) {
      const dok = panel.ownerDocument
      const ansicht = dok.defaultView
      const hinten = art.hintergrund(panel)
      const vorher = {
        inert: panel.hasAttribute('inert'),
        ariaHidden: panel.getAttribute('aria-hidden'),
        ariaModal: panel.getAttribute('aria-modal'),
        role: panel.getAttribute('role')
      }

      /** @type {null | { knopf: HTMLElement|null, tabindex: boolean }} */
      let offen = null
      const vonUnsInert = /** @type {Set<Element>} */ (new Set())

      const knoepfe = () => panel.id
        ? /** @type {HTMLElement[]} */ ([...dok.querySelectorAll(`[aria-controls="${CSS.escape(panel.id)}"]`)]).filter((k) => !panel.contains(k))
        : []
      const sperreRest = () => {
        for (let el = /** @type {Element} */ (panel); el.parentElement && el !== dok.body; el = el.parentElement) {
          for (const g of el.parentElement.children) {
            if (g === el || g === hinten || g.hasAttribute('inert')) continue
            g.setAttribute('inert', '')
            vonUnsInert.add(g)
          }
        }
      }
      const gibRestFrei = () => {
        for (const g of vonUnsInert) g.removeAttribute('inert')
        vonUnsInert.clear()
      }
      const zu = () => {
        panel.classList.remove(art.offenKlasse)
        if (art.hintergrundKlasse) hinten?.classList.remove(art.hintergrundKlasse)
        panel.setAttribute('aria-hidden', 'true')
        panel.setAttribute('inert', '')
        if (art.seiteSperren) dok.body.classList.remove(art.seiteSperren)
      }

      function oeffne (knopf) {
        if (offen) return
        art.beimOeffnen?.(panel, knopf)
        panel.classList.add(art.offenKlasse)
        if (art.hintergrundKlasse) hinten?.classList.add(art.hintergrundKlasse)
        panel.removeAttribute('inert')
        panel.setAttribute('aria-hidden', 'false')
        if (art.seiteSperren) dok.body.classList.add(art.seiteSperren)
        for (const k of knoepfe()) k.setAttribute('aria-expanded', 'true')
        sperreRest()
        const start = /** @type {HTMLElement|null} */ (panel.querySelector('[autofocus]')) || fokussierbare(panel)[0] || null
        const tabindex = !start && !panel.hasAttribute('tabindex')
        if (tabindex) panel.setAttribute('tabindex', '-1')
        offen = { knopf, tabindex }
        ;(start || panel).focus()
        sende(panel, `${art.praefix}-open`, {})
      }

      function schliesse (grund) {
        if (!offen) return
        const { knopf, tabindex } = offen
        offen = null
        zu()
        gibRestFrei()
        for (const k of knoepfe()) k.setAttribute('aria-expanded', 'false')
        if (tabindex) panel.removeAttribute('tabindex')
        if (knopf && knopf.isConnected) knopf.focus()
        sende(panel, `${art.praefix}-close`, { reason: grund })
      }

      // Anfangszustand: im Markup offen (Klasse) → gilt als offen (Escape,
      // Backdrop und Knopf schliessen; Fokus bleibt, wo er ist); sonst
      // geschlossen und unerreichbar
      if (panel.classList.contains(art.offenKlasse)) { offen = { knopf: null, tabindex: false }; sperreRest() }
      else zu()
      if (!panel.hasAttribute('role')) panel.setAttribute('role', 'dialog')
      panel.setAttribute('aria-modal', 'true')
      for (const k of knoepfe()) k.setAttribute('aria-expanded', String(panel.classList.contains(art.offenKlasse)))

      dok.addEventListener('click', (e) => {
        const knopf = /** @type {HTMLElement|null} */ (/** @type {HTMLElement} */ (e.target).closest?.('[aria-controls]') || null)
        if (!knopf || !panel.id || knopf.getAttribute('aria-controls') !== panel.id || panel.contains(knopf) || gesperrt(knopf)) return
        if (art.nochDa && !art.nochDa(panel)) return
        e.preventDefault()
        if (offen) schliesse('trigger')
        else oeffne(knopf)
      }, { signal })

      panel.addEventListener('click', (e) => {
        if (!offen) return
        const ziel = /** @type {HTMLElement} */ (e.target)
        if (hinten && panel.contains(hinten) && hinten.contains(ziel)) schliesse('overlay-click')
        else if (ziel.closest?.(art.schliessen)) schliesse('close-button')
      }, { signal })
      if (hinten && !panel.contains(hinten)) hinten.addEventListener('click', () => schliesse('overlay-click'), { signal })

      dok.addEventListener('keydown', (e) => {
        if (!offen) return
        if (e.key === 'Escape') { e.preventDefault(); schliesse('escape') }
        else fokusFalle(e, panel)
      }, { signal })

      if (art.nochDa) ansicht?.addEventListener('resize', () => { if (offen && !art.nochDa?.(panel)) schliesse('resize') }, { signal })

      signal.addEventListener('abort', () => {
        if (offen?.tabindex) panel.removeAttribute('tabindex')
        if (offen) {
          panel.classList.remove(art.offenKlasse)
          if (art.hintergrundKlasse) hinten?.classList.remove(art.hintergrundKlasse)
        }
        offen = null
        gibRestFrei()
        if (art.seiteSperren) dok.body.classList.remove(art.seiteSperren)
        if (vorher.inert) panel.setAttribute('inert', '')
        else panel.removeAttribute('inert')
        for (const [attr, wert] of /** @type {const} */ ([['aria-hidden', vorher.ariaHidden], ['aria-modal', vorher.ariaModal], ['role', vorher.role]])) {
          if (wert === null) panel.removeAttribute(attr)
          else panel.setAttribute(attr, wert)
        }
      })
    }
  }
}
