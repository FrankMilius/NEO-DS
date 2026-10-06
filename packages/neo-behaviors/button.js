// @ts-check
// ==========================================================================
// Button (Toggle) — nach data/button-recipe.json (keyboard, events)
// ==========================================================================
// Entscheidung 06.10.2026: Verhalten nur fuer den Umschaltknopf
// (`.nc-button--toggle`, Komposition toggle). Alle anderen Buttons bleiben
// ohne JS — Enter, Leertaste und click sind nativ.
//
//   <button type="button" class="nc-button nc-button--outline nc-button--toggle"
//           aria-pressed="false">…</button>
//
// Klick (Enter/Leertaste loesen am <button> nativ einen Klick aus) schaltet
// aria-pressed um; das SCSS zeichnet den gedrueckten Zustand ueber
// [aria-pressed="true"]. Gesperrte Knoepfe (disabled, aria-disabled="true")
// bleiben unveraendert.
//
// Ereignis `button-toggle` { pressed, value } — value: data-value, sonst
// aria-label, sonst die Beschriftung (wie bei Toggle-Group und
// Segmented Control).
// ==========================================================================
import { sende, gesperrt } from './kern.js'
import { wertVon } from './segmented-control.js'

export const button = {
  id: 'button',
  selektor: '.nc-button--toggle',
  binde (knopf, signal) {
    knopf.addEventListener('click', () => {
      if (gesperrt(knopf)) return
      const gedrueckt = knopf.getAttribute('aria-pressed') !== 'true'
      knopf.setAttribute('aria-pressed', String(gedrueckt))
      sende(knopf, 'button-toggle', { pressed: gedrueckt, value: wertVon(knopf) })
    }, { signal })
  }
}
