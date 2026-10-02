// @ts-check
// ==========================================================================
// Toggle-Group — nach data/toggle-group-recipe.json (keyboard, events)
// ==========================================================================
// Das Markup bestimmt den Modus (Achse type):
//   single    role="radiogroup", Knoepfe role="radio" + aria-checked —
//             Klick waehlt, Pfeiltasten/Pos1/Ende wandern und waehlen
//             (roving tabindex, genau einer im Tab-Fluss)
//   multiple  role="group", Knoepfe mit aria-pressed — Klick (bzw. Enter/
//             Leertaste, nativ) schaltet um; alle Knoepfe bleiben im
//             Tab-Fluss, Pfeiltasten/Pos1/Ende bewegen nur den Fokus
// Gesperrte Knoepfe werden uebersprungen.
//
// Ereignis `toggle-change` { value, selected, values } — values: alle
// gewaehlten Werte nach der Aenderung.
// ==========================================================================
import { sende, zielFuerTaste, gesperrt } from './kern.js'
import { wertVon } from './segmented-control.js'

const KNOPF = '.nc-toggle-group__item'

export const toggleGroup = {
  id: 'toggle-group',
  selektor: '.nc-toggle-group',
  binde (wurzel, signal) {
    const knoepfe = () => /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll(KNOPF)])
    if (!knoepfe().length) return
    const einzeln = wurzel.getAttribute('role') === 'radiogroup' || knoepfe().some((k) => k.getAttribute('role') === 'radio')
    const attr = einzeln ? 'aria-checked' : 'aria-pressed'
    const an = (k) => k.getAttribute(attr) === 'true'
    const melde = (knopf) => sende(wurzel, 'toggle-change', { value: wertVon(knopf), selected: an(knopf), values: knoepfe().filter(an).map(wertVon) })

    const waehle = (knopf) => {
      if (!knopf || gesperrt(knopf)) return
      if (!einzeln) {
        knopf.setAttribute(attr, String(!an(knopf)))
        melde(knopf)
        return
      }
      if (an(knopf)) return
      for (const k of knoepfe()) {
        k.setAttribute(attr, String(k === knopf))
        k.tabIndex = k === knopf ? 0 : -1
      }
      melde(knopf)
    }

    if (einzeln) {
      const start = knoepfe().find(an) || knoepfe().find((k) => !gesperrt(k))
      for (const k of knoepfe()) k.tabIndex = k === start ? 0 : -1
    }

    wurzel.addEventListener('click', (e) => {
      const knopf = /** @type {HTMLElement} */ (e.target).closest(KNOPF)
      if (knopf && wurzel.contains(knopf)) waehle(knopf)
    }, { signal })

    wurzel.addEventListener('keydown', (e) => {
      const knopf = /** @type {HTMLElement} */ (e.target).closest(KNOPF)
      if (!knopf) return
      const ziel = zielFuerTaste(e.key, knoepfe(), knopf)
      if (!ziel) return
      e.preventDefault()
      ziel.focus()
      if (einzeln) waehle(ziel)
    }, { signal })
  }
}
