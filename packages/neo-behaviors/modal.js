// @ts-check
// ==========================================================================
// Modal — nach data/modal-recipe.json (keyboard, events)
// ==========================================================================
// Natives <dialog class="nc-modal">, geoeffnet per showModal() ueber einen
// Knopf mit aria-controls (siehe _dialog.js). Escape, Schliessen-Knopf
// (.nc-modal__close), Fokus-Falle, Fokus zurueck zum Ausloeser. Klick auf
// den Hintergrund schliesst nur mit data-backdrop-close="true" (domNotes:
// nicht bei Formularen). --scrollable: .is-scrolled-top/.is-scrolled-bottom
// je nach Scrollstand von .nc-modal__body (Rahmen an Kopf/Fuss).
//
// Ereignisse `modal-open` {}, `modal-close` { reason }.
// ==========================================================================
import { dialogBehavior } from './_dialog.js'

export const modal = dialogBehavior({
  id: 'modal',
  selektor: 'dialog.nc-modal',
  praefix: 'modal',
  schliessen: '.nc-modal__close',
  hintergrundSchliesst: (d) => d.dataset.backdropClose === 'true',
  scroll (dialog, signal) {
    const body = dialog.querySelector('.nc-modal__body')
    if (!body || !dialog.classList.contains('nc-modal--scrollable')) return
    const pruefe = () => {
      dialog.classList.toggle('is-scrolled-top', body.scrollTop > 0)
      dialog.classList.toggle('is-scrolled-bottom', body.scrollTop + body.clientHeight < body.scrollHeight - 1)
    }
    body.addEventListener('scroll', pruefe, { signal, passive: true })
    dialog.addEventListener('modal-open', pruefe, { signal })
  }
})
