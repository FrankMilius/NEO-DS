// @ts-check
// ==========================================================================
// Drawer — nach data/drawer-recipe.json (keyboard, events)
// ==========================================================================
// Natives <dialog class="nc-drawer">, geoeffnet per showModal() ueber einen
// Knopf mit aria-controls (siehe _dialog.js). Escape, Schliessen-Knopf
// (.nc-drawer__close), Fokus-Falle, Fokus zurueck zum Ausloeser. Klick auf
// den Hintergrund schliesst immer (Light Dismiss laut Recipe).
// .is-scrolled am Drawer, sobald .nc-drawer__content gescrollt ist
// (Rahmen an Kopf und Fuss).
//
// Ereignisse `drawer-open` {}, `drawer-close` { reason }.
// ==========================================================================
import { dialogBehavior } from './_dialog.js'

export const drawer = dialogBehavior({
  id: 'drawer',
  selektor: 'dialog.nc-drawer',
  praefix: 'drawer',
  schliessen: '.nc-drawer__close',
  hintergrundSchliesst: () => true,
  scroll (dialog, signal) {
    const inhalt = dialog.querySelector('.nc-drawer__content')
    if (!inhalt) return
    inhalt.addEventListener('scroll', () => dialog.classList.toggle('is-scrolled', inhalt.scrollTop > 0), { signal, passive: true })
  }
})
