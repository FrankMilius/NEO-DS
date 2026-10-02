// @ts-check
// ==========================================================================
// Popover — nach data/popover-recipe.json (keyboard, events)
// ==========================================================================
// .nc-popover__trigger (aria-haspopup="dialog", aria-expanded) oeffnet und
// schliesst .nc-popover__panel (role="dialog", versteckt per [hidden]).
//   Klick-Modus (Standard)
//     Klick/Enter/Leertaste schalten um; beim Oeffnen geht der Fokus ins
//     Panel (erstes bedienbares Element, bei Formularen das erste Feld).
//     Tab/Shift+Tab bleiben im Panel (Fokus-Falle laut Recipe/SCSS R3).
//     Escape und .nc-popover__close schliessen, Fokus zurueck zum Ausloeser.
//     Klick ausserhalb schliesst (Light Dismiss) — nicht bei Formularen im
//     Panel oder data-light-dismiss="false" (Datenverlust).
//   Hover-Modus (.nc-popover--hover-trigger)
//     Oeffnet nach 300 ms Verweilen oder sofort bei Fokus auf dem Ausloeser,
//     schliesst 200 ms nach Verlassen bzw. wenn der Fokus das Bauteil
//     verlaesst; Escape schliesst. Keine Fokus-Falle.
//
// Ereignis `popover-toggle` { open, reason } — reason: 'trigger', 'escape',
// 'close-button', 'outside', 'hover', 'focus'.
// ==========================================================================
import { sende, fokussierbare, fokusFalle, gesperrt } from './kern.js'

const OEFFNEN_NACH = 300
const SCHLIESSEN_NACH = 200

export const popover = {
  id: 'popover',
  selektor: '.nc-popover',
  binde (wurzel, signal) {
    const ausloeser = /** @type {HTMLElement|null} */ (wurzel.querySelector(':scope > .nc-popover__trigger'))
    const panel = /** @type {HTMLElement|null} */ (wurzel.querySelector(':scope > .nc-popover__panel'))
    if (!ausloeser || !panel) return
    const dok = wurzel.ownerDocument
    const hover = wurzel.classList.contains('nc-popover--hover-trigger')
    const lichtAus = () => wurzel.dataset.lightDismiss !== 'false' && !panel.querySelector('form, input, select, textarea')
    const offen = () => !panel.hidden

    if (!ausloeser.hasAttribute('aria-haspopup')) ausloeser.setAttribute('aria-haspopup', 'dialog')
    ausloeser.setAttribute('aria-expanded', String(offen()))

    const setze = (an, grund) => {
      if (offen() === an) return
      panel.hidden = !an
      ausloeser.setAttribute('aria-expanded', String(an))
      sende(wurzel, 'popover-toggle', { open: an, reason: grund })
      if (an && !hover) {
        const feld = panel.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled])')
        const ziel = /** @type {HTMLElement|null} */ (feld || fokussierbare(panel)[0] || null)
        if (ziel) ziel.focus()
        else { panel.tabIndex = -1; panel.focus() }
      }
    }
    const schliesse = (grund, fokusZurueck) => {
      if (!offen()) return
      const warDrin = panel.contains(dok.activeElement)
      setze(false, grund)
      if (fokusZurueck || warDrin) ausloeser.focus()
    }

    ausloeser.addEventListener('click', () => {
      if (gesperrt(ausloeser)) return
      if (offen()) schliesse('trigger', false)
      else setze(true, 'trigger')
    }, { signal })

    wurzel.addEventListener('keydown', (e) => {
      if (!offen()) return
      if (e.key === 'Escape') { e.preventDefault(); schliesse('escape', true); return }
      if (!hover && e.key === 'Tab' && panel.contains(/** @type {Node} */ (e.target))) fokusFalle(e, panel)
    }, { signal })

    panel.addEventListener('click', (e) => {
      if (/** @type {HTMLElement} */ (e.target).closest('.nc-popover__close')) schliesse('close-button', true)
    }, { signal })

    dok.addEventListener('click', (e) => {
      if (offen() && lichtAus() && !wurzel.contains(/** @type {Node} */ (e.target))) schliesse('outside', false)
    }, { signal, capture: true })

    if (hover) {
      let uhr = 0
      const spaeter = (fn, ms) => { clearTimeout(uhr); uhr = window.setTimeout(fn, ms) }
      wurzel.addEventListener('mouseenter', () => spaeter(() => setze(true, 'hover'), OEFFNEN_NACH), { signal })
      wurzel.addEventListener('mouseleave', () => spaeter(() => { if (!wurzel.contains(dok.activeElement)) setze(false, 'hover') }, SCHLIESSEN_NACH), { signal })
      ausloeser.addEventListener('focus', () => { clearTimeout(uhr); setze(true, 'focus') }, { signal })
      wurzel.addEventListener('focusout', (e) => {
        const nach = /** @type {Node|null} */ (e.relatedTarget)
        if (!nach || !wurzel.contains(nach)) setze(false, 'focus')
      }, { signal })
      signal.addEventListener('abort', () => clearTimeout(uhr))
    }
  }
}
