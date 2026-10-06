// @ts-check
// ==========================================================================
// Mobile-Drawer — nach data/mobile-drawer-recipe.json (keyboard, events)
// ==========================================================================
// Drawer der Mobil-Navigation aus dem Drupal-Theme (Entscheidung 06.10.2026,
// overlay-verhalten). Ersetzt Drupal.behaviors.neoMobileNav in
// neo_fe/js/neo-theme.js: dort oeffnete .nc-mobile-toggle den Drawer
// #mobile-nav (.nc-mobile-drawer--open, aria-hidden, aria-expanded,
// Backdrop --visible, body.u-no-scroll), [data-mobile-close] und der
// Backdrop schlossen, Escape schloss mit Fokus zurueck.
//
// Hier (gemeinsamer Teil _ueberlagerung.js): Ausloeser ist jeder Knopf mit
// aria-controls="<id des Drawers>"; dazu Fokus in den Drawer, Fokus-Falle,
// Rest der Seite inert, geschlossener Drawer inert (vorher per Tab
// erreichbar, obwohl aus dem Bild geschoben), Fokus zurueck auch nach
// Backdrop und Schliessen-Knopf. Backdrop: .nc-mobile-drawer__backdrop als
// Geschwister (bzw. [data-mobile-backdrop] im selben Elternelement).
// Ab 1200 px Fensterbreite blendet das DS Drawer und Backdrop aus
// (display: none) — dann tut der Knopf nichts, ein offener Drawer schliesst
// beim Wechsel ('resize').
//
// Ereignisse `mobile-drawer-open` {}, `mobile-drawer-close` { reason }.
// ==========================================================================
import { ueberlagerungBehavior } from './_ueberlagerung.js'

export const mobileDrawer = {
  ...ueberlagerungBehavior({
    id: 'mobile-drawer',
    selektor: '.nc-mobile-drawer',
    praefix: 'mobile-drawer',
    offenKlasse: 'nc-mobile-drawer--open',
    hintergrund: (p) => /** @type {HTMLElement|null} */ (p.parentElement?.querySelector(':scope > .nc-mobile-drawer__backdrop, :scope > [data-mobile-backdrop]') || null),
    hintergrundKlasse: 'nc-mobile-drawer__backdrop--visible',
    schliessen: '.nc-mobile-drawer__close, [data-mobile-close]',
    seiteSperren: 'u-no-scroll',
    nochDa: (p) => p.ownerDocument.defaultView?.getComputedStyle(p).display !== 'none'
  }),
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true
}
