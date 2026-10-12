// @ts-check
// ==========================================================================
// Hero-TOM — nach data/hero-tom-recipe.json (keyboard, events)
// ==========================================================================
// Website-Bauteil (Plan v4, Phase 6b, 12.10.2026): aus
// Drupal.behaviors.neoHeroTom (neo_fe/js/neo-theme.js). Wurzel
// .nc-hero-tom[data-media-mode="expand"]: das Medium .nc-hero-tom__media
// faehrt beim Scrollen von Inhaltsbreite auf volle Breite aus — das
// Behavior setzt --tom-expand (0 … 1, 4 Stellen) inline am Medium, das SCSS
// liest daraus Inset und Radius.
//
//   Fortschritt = 1 - (Oberkante der Wurzel / Fensterhoehe), begrenzt auf
//   0 … 1: 0, solange die Wurzel unten am Fensterrand steht; 1, sobald ihre
//   Oberkante den oberen Rand erreicht.
//
//   - prefers-reduced-motion: nichts (das SCSS zeigt den ausgefahrenen
//     Endzustand, --tom-expand: 1).
//   - Scroll-Lauscher am Fenster (passiv), gedrosselt auf einen Durchlauf je
//     Bild (requestAnimationFrame) wie bisher; Messen auch beim Binden.
//   - Neu: Abbinden loest den Lauscher (vorher nie geloest), bricht einen
//     ausstehenden Frame ab und stellt den Inline-Wert von vorher her.
//
// Ereignis `hero-tom-expand` { expanded, progress } an der Wurzel, wenn das
// Medium ganz ausgefahren ist (progress 1) bzw. es nicht mehr ist — nicht
// bei jedem Frame.
// ==========================================================================
import { sende } from './kern.js'
import { reduzierteBewegung } from './gallery.js'

export const heroTom = {
  id: 'hero-tom',
  selektor: '.nc-hero-tom[data-media-mode="expand"]',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const medium = /** @type {HTMLElement|null} */ (wurzel.querySelector('.nc-hero-tom__media'))
    if (!medium || reduzierteBewegung(wurzel)) return
    const ansicht = wurzel.ownerDocument.defaultView || window
    const vorher = medium.style.getPropertyValue('--tom-expand')
    /** @type {boolean|null} */
    let ausgefahren = null
    let frame = 0

    const messe = () => {
      frame = 0
      const hoehe = ansicht.innerHeight || 1
      const fortschritt = Math.max(0, Math.min(1, 1 - (wurzel.getBoundingClientRect().top / hoehe)))
      medium.style.setProperty('--tom-expand', fortschritt.toFixed(4))
      const ganz = fortschritt >= 1
      if (ganz !== ausgefahren) {
        // Erster Stand beim Binden ohne Ereignis, danach jeder Wechsel
        if (ausgefahren !== null) sende(wurzel, 'hero-tom-expand', { expanded: ganz, progress: fortschritt })
        ausgefahren = ganz
      }
    }

    ansicht.addEventListener('scroll', () => {
      if (!frame) frame = ansicht.requestAnimationFrame(messe)
    }, { passive: true, signal })

    signal.addEventListener('abort', () => {
      if (frame) ansicht.cancelAnimationFrame(frame)
      if (vorher) medium.style.setProperty('--tom-expand', vorher)
      else medium.style.removeProperty('--tom-expand')
    })

    messe()
  }
}
