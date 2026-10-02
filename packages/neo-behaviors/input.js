// @ts-check
// ==========================================================================
// Input — nach data/input-recipe.json (keyboard, events)
// ==========================================================================
// Schwebendes Label und Sichtbarkeit des Loeschknopfs macht das CSS des DS
// (:placeholder-shown, :focus-within) — dafuer gibt es hier kein JS.
// Das Behavior uebernimmt nur, was CSS nicht kann:
//   - Loeschknopf (.nc-input__clear): leert das Feld, meldet `input` (damit
//     Formulare und Frameworks es mitbekommen) und setzt den Fokus zurueck
//     ins Feld.
//   - JS-Rueckfall data-empty="true|false" (SCSS, states.contentStates) —
//     nur fuer Felder ohne placeholder-Attribut, bei denen
//     :placeholder-shown nie greift.
//
// Ereignis `input-clear` { previousValue }.
// ==========================================================================
import { sende } from './kern.js'

export const eingabe = {
  id: 'input',
  selektor: '.nc-input-wrapper',
  binde (wurzel, signal) {
    const feld = /** @type {HTMLInputElement|null} */ (wurzel.querySelector('input.nc-input'))
    if (!feld) return
    const knopf = wurzel.querySelector('.nc-input__clear')
    const rueckfall = !feld.hasAttribute('placeholder')
    const leer = () => { if (rueckfall) feld.dataset.empty = String(feld.value === '') }

    if (rueckfall) {
      leer()
      feld.addEventListener('input', leer, { signal })
      feld.addEventListener('change', leer, { signal })
    }
    if (knopf) {
      knopf.addEventListener('click', (e) => {
        if (feld.disabled || feld.readOnly) return
        e.preventDefault()
        const vorher = feld.value
        feld.value = ''
        feld.dispatchEvent(new Event('input', { bubbles: true }))
        leer()
        feld.focus()
        if (vorher !== '') sende(wurzel, 'input-clear', { previousValue: vorher })
      }, { signal })
    }
    signal.addEventListener('abort', () => { if (rueckfall) delete feld.dataset.empty })
  }
}
