// @ts-check
// ==========================================================================
// Switch — nach data/switch-recipe.json (keyboard, events)
// ==========================================================================
// Zwei Muster (Achse pattern, scss/scss/05-atoms/_switch.scss):
//   button    <button class="nc-switch__track" role="switch" aria-checked>
//             — Klick (Leertaste/Enter loesen nativ einen Klick aus)
//             schaltet aria-checked um; das CSS zeichnet danach.
//   checkbox  <input type="checkbox" role="switch"> — der Browser schaltet
//             selbst, hier ist nichts zu tun (natives `change`).
//
// Ereignis `switch-change` { checked } (nur Button-Muster).
// ==========================================================================
import { sende, gesperrt } from './kern.js'

const KNOPF = 'button[role="switch"]'

export const schalter = {
  id: 'switch',
  selektor: '.nc-switch',
  binde (wurzel, signal) {
    if (!wurzel.querySelector(KNOPF)) return // Checkbox-Muster: nativ
    wurzel.addEventListener('click', (e) => {
      const knopf = /** @type {HTMLElement} */ (e.target).closest(KNOPF)
      if (!knopf || !wurzel.contains(knopf) || gesperrt(knopf)) return
      const an = knopf.getAttribute('aria-checked') !== 'true'
      knopf.setAttribute('aria-checked', String(an))
      sende(wurzel, 'switch-change', { checked: an })
    }, { signal })
  }
}
