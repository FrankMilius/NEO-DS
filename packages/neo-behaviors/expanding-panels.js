// @ts-check
// ==========================================================================
// Expanding Panels — nach data/expanding-panels-recipe.json (keyboard,
// events)
// ==========================================================================
// Horizontale Panels der Website (Entscheidung 06.10.2026,
// website-verhalten b). Ersetzt in neo_fe/js/neo-theme.js die Verdrahtung
// in window.NeoExpandingPanels.render (activate, Klick, Pfeiltasten) — das
// Bauen der Knoepfe aus JSON gehoert dann ins Twig (Drupal rendert die
// Panels fertig), Drupal.behaviors.neoExpandingPanels entfaellt.
//
// Single-Open wie auf der Website: genau ein Panel traegt
// aria-expanded="true" (das SCSS klappt es per flex-grow auf), alle anderen
// "false". Ist beim Binden keines offen, oeffnet das erste (so startet die
// Website). Klick auf ein Panel oeffnet es (ein offenes bleibt offen — es
// gibt kein „alle zu"). Pfeil rechts/runter und links/hoch wechseln rundum
// und setzen den Fokus mit; neu: Pos1/Ende. Alle Panels bleiben in der
// Tab-Folge (Knoepfe, kein roving tabindex — wie die Website); gesperrte
// werden uebersprungen.
//
// Ereignis `expanding-panels-change` { index, previousIndex }.
// ==========================================================================
import { sende, zielFuerTaste, gesperrt } from './kern.js'

export const expandingPanels = {
  id: 'expanding-panels',
  selektor: '.nc-expanding-panels',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const panels = () => /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll(':scope > .nc-expanding-panels__panel')])
    const vorher = new Map(panels().map((p) => [p, p.getAttribute('aria-expanded')]))
    const offenIndex = () => panels().findIndex((p) => p.getAttribute('aria-expanded') === 'true')

    function aktiviere (panel) {
      const liste = panels()
      const davor = offenIndex()
      const i = liste.indexOf(panel)
      if (i < 0 || gesperrt(panel)) return
      liste.forEach((p, j) => p.setAttribute('aria-expanded', String(j === i)))
      if (i !== davor) sende(wurzel, 'expanding-panels-change', { index: i, previousIndex: davor })
    }

    if (offenIndex() < 0) {
      const erstes = panels().find((p) => !gesperrt(p))
      if (erstes) panels().forEach((p) => p.setAttribute('aria-expanded', String(p === erstes)))
    }

    wurzel.addEventListener('click', (e) => {
      const panel = /** @type {HTMLElement} */ (e.target).closest?.('.nc-expanding-panels__panel')
      if (panel && panel.parentElement === wurzel) aktiviere(/** @type {HTMLElement} */ (panel))
    }, { signal })

    wurzel.addEventListener('keydown', (e) => {
      const panel = /** @type {HTMLElement} */ (e.target).closest?.('.nc-expanding-panels__panel')
      if (!panel || panel.parentElement !== wurzel) return
      const ziel = zielFuerTaste(e.key, panels(), panel)
      if (!ziel) return
      e.preventDefault()
      aktiviere(ziel)
      ziel.focus()
    }, { signal })

    signal.addEventListener('abort', () => {
      for (const [p, wert] of vorher) {
        if (wert === null) p.removeAttribute('aria-expanded')
        else p.setAttribute('aria-expanded', wert)
      }
    })
  }
}
