// @ts-check
// ==========================================================================
// Tooltip — nach data/tooltip-recipe.json (keyboard, events)
// ==========================================================================
// Ein- und Ausblenden bei Hover und Fokus macht das CSS des DS
// (:hover/:focus-within am .nc-tooltip, mit 300 ms Verzoegerung). Das
// Behavior ergaenzt, was CSS nicht kann:
//   - Escape blendet einen sichtbaren Tooltip aus (WCAG 1.4.13): der Inhalt
//     bekommt [hidden], bis Maus und Fokus das Bauteil verlassen haben.
//   - aria-describedby am Ausloeser zeigt auf den Inhalt (role="tooltip"),
//     falls es im Markup fehlt.
//
// Ereignis `tooltip-dismiss` { reason } (reason: 'escape').
// ==========================================================================
import { sende } from './kern.js'

let laufendeNummer = 0

export const tooltip = {
  id: 'tooltip',
  selektor: '.nc-tooltip',
  binde (wurzel, signal) {
    const inhalt = /** @type {HTMLElement|null} */ (wurzel.querySelector(':scope > .nc-tooltip__content'))
    if (!inhalt) return
    const dok = wurzel.ownerDocument
    const ausloeser = /** @type {HTMLElement|null} */ ([...wurzel.children].find((k) => k !== inhalt) || null)

    if (!inhalt.id) inhalt.id = `neo-tooltip-${++laufendeNummer}`
    if (!inhalt.getAttribute('role')) inhalt.setAttribute('role', 'tooltip')
    if (ausloeser) {
      const ids = (ausloeser.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean)
      if (!ids.includes(inhalt.id)) ausloeser.setAttribute('aria-describedby', [...ids, inhalt.id].join(' '))
    }

    let maus = false
    const fokus = () => wurzel.contains(dok.activeElement)
    const freigeben = () => { if (!maus && !fokus()) inhalt.hidden = false }

    wurzel.addEventListener('mouseenter', () => { maus = true }, { signal })
    wurzel.addEventListener('mouseleave', () => { maus = false; freigeben() }, { signal })
    wurzel.addEventListener('focusout', (e) => {
      const nach = /** @type {Node|null} */ (e.relatedTarget)
      if (!nach || !wurzel.contains(nach)) { if (!maus) inhalt.hidden = false }
    }, { signal })

    dok.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || inhalt.hidden || !(maus || fokus())) return
      inhalt.hidden = true
      sende(wurzel, 'tooltip-dismiss', { reason: 'escape' })
    }, { signal })
    // Abbinden darf keinen ausgeblendeten Tooltip hinterlassen
    signal.addEventListener('abort', () => { inhalt.hidden = false })
  }
}
