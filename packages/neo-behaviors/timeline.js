// @ts-check
// ==========================================================================
// Timeline — nach data/timeline-recipe.json (keyboard, events)
// ==========================================================================
// Website-Bauteil (Plan v4, Phase 6b, 12.10.2026): 1:1 aus
// Drupal.behaviors.neoTimeline (neo_fe/js/neo-theme.js). Wurzel
// [data-timeline] (das Twig setzt es an die <ol class="nc-timeline">).
//
//   - Ohne Skript ist nichts versteckt: die Klasse nc-timeline--progress,
//     unter der das SCSS die Karten ausblendet, setzt erst das Behavior.
//   - prefers-reduced-motion oder kein IntersectionObserver: keine
//     Einblendung, die Linie ist sofort voll (--nc-timeline-progress: 1).
//   - Sonst: nc-timeline--progress, --nc-timeline-progress: 0; jeder Eintrag
//     bekommt is-visible, sobald er zu einem Drittel im Bild ist (threshold
//     0.34, rootMargin unten -10 %), und wird danach nicht mehr beobachtet.
//     Die Fuellhoehe ist der Anteil der sichtbaren Eintraege (3 Stellen).
//     Kein Scroll-Lauscher — die Beobachtung liefert die Taktung.
//
// Ereignis `timeline-progress` { progress } an der Wurzel, wenn sich die
// Fuellhoehe aendert (auch der Endzustand 1 bei reduzierter Bewegung).
// Abbinden: Beobachter getrennt, Klasse, Custom Property und is-visible der
// Eintraege zurueckgenommen (ohne Skript: alles sichtbar).
// ==========================================================================
import { sende } from './kern.js'
import { reduzierteBewegung } from './gallery.js'

export const timeline = {
  id: 'timeline',
  selektor: '[data-timeline]',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const eintraege = /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-timeline__item')])
    if (!eintraege.length) return
    const ansicht = wurzel.ownerDocument.defaultView || window
    const Beobachter = /** @type {any} */ (globalThis).IntersectionObserver || /** @type {any} */ (ansicht).IntersectionObserver
    const vorher = wurzel.style.getPropertyValue('--nc-timeline-progress')
    const hatteKlasse = wurzel.classList.contains('nc-timeline--progress')
    /** @type {any} */
    let beobachter = null
    /** @type {HTMLElement[]} */
    const gesetzt = []

    signal.addEventListener('abort', () => {
      if (beobachter) beobachter.disconnect()
      if (!hatteKlasse) wurzel.classList.remove('nc-timeline--progress')
      if (vorher) wurzel.style.setProperty('--nc-timeline-progress', vorher)
      else wurzel.style.removeProperty('--nc-timeline-progress')
      for (const e of gesetzt) e.classList.remove('is-visible')
    })

    /** @param {string} wert */
    const fuelle = (wert) => {
      wurzel.style.setProperty('--nc-timeline-progress', wert)
      sende(wurzel, 'timeline-progress', { progress: Number(wert) })
    }

    if (reduzierteBewegung(wurzel) || typeof Beobachter !== 'function') {
      // Alles sofort sichtbar, Linie voll — nichts zu animieren
      fuelle('1')
      return
    }

    // Ab jetzt darf ausgeblendet werden
    wurzel.classList.add('nc-timeline--progress')
    wurzel.style.setProperty('--nc-timeline-progress', '0')

    // Fuellhoehe = Anteil der bereits sichtbaren Eintraege
    const nachfuehren = () => {
      const gesehen = eintraege.filter((e) => e.classList.contains('is-visible')).length
      fuelle((gesehen / eintraege.length).toFixed(3))
    }

    beobachter = new Beobachter((/** @type {any[]} */ es) => {
      for (const e of es) {
        if (!e.isIntersecting) continue
        const el = /** @type {HTMLElement} */ (e.target)
        if (!el.classList.contains('is-visible')) { el.classList.add('is-visible'); gesetzt.push(el) }
        beobachter.unobserve(el)
        nachfuehren()
      }
    }, { threshold: 0.34, rootMargin: '0px 0px -10% 0px' })
    for (const e of eintraege) beobachter.observe(e)
  }
}
