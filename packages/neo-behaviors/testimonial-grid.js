// @ts-check
// ==========================================================================
// Testimonial-Grid — nach data/testimonial-grid-recipe.json (keyboard, events)
// ==========================================================================
// Website-Bauteil (Plan v4, Phase 6a, 12.10.2026). Ersetzt in
// neo_fe/js/neo-theme.js Drupal.behaviors.neoTestimonialCarousel.
//
// Markup (fertig, Twig): .nc-testimonial-grid--carousel[data-testimonial-
// carousel][role=group][tabindex=0] (die Spur), danach als Geschwister
// .nc-testimonial-grid__nav mit den Knoepfen [data-tc-prev] / [data-tc-next]
// (sonst erster bzw. letzter .nc-testimonial-grid__btn).
//
//   Blaettern  um eine Kartenbreite plus Abstand (column-gap); weich nur
//              ohne prefers-reduced-motion, sonst sofort.
//   Enden      „Zurueck" ist am Anfang, „Weiter" am Ende disabled;
//              nachgefuehrt bei scroll und Groessenaenderung der Spur
//              (ResizeObserver, sonst resize des Fensters).
//   Fokus      Wird der fokussierte Knopf gesperrt, wandert der Fokus auf den
//              anderen Knopf (sonst auf die Spur) — ein gesperrter Knopf
//              verliert den Fokus an den Seitenanfang.
//   Tastatur   Pfeile auf der Spur scrollt der Browser (nativ).
//
// Ereignis: `testimonial-grid-step` { direction: "prev" | "next" }, wenn ein
// Knopf blaettert.
// ==========================================================================
import { sende } from './kern.js'
import { reduzierteBewegung } from './gallery.js'

export const testimonialGrid = {
  id: 'testimonial-grid',
  selektor: '.nc-testimonial-grid--carousel',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} spur @param {AbortSignal} signal */
  binde (spur, signal) {
    const nav = /** @type {HTMLElement|null} */ (spur.parentElement?.querySelector(':scope > .nc-testimonial-grid__nav') || null)
    if (!nav) return
    const knoepfe = /** @type {HTMLButtonElement[]} */ ([...nav.querySelectorAll('.nc-testimonial-grid__btn')])
    const zurueck = /** @type {HTMLButtonElement|null} */ (nav.querySelector('[data-tc-prev]') || knoepfe[0] || null)
    const vor = /** @type {HTMLButtonElement|null} */ (nav.querySelector('[data-tc-next]') || (knoepfe.length > 1 ? knoepfe.at(-1) : null) || null)
    const dok = spur.ownerDocument
    const ansicht = dok.defaultView || window
    const vorher = [zurueck, vor].map((k) => k?.disabled ?? false)

    /** Schrittweite: Kartenbreite plus Abstand, sonst 80 % der Spur */
    function schritt () {
      const karte = spur.querySelector('.nc-testimonial')
      if (karte) {
        const abstand = parseFloat(ansicht.getComputedStyle(spur).columnGap) || 20
        return karte.getBoundingClientRect().width + abstand
      }
      return spur.clientWidth * 0.8
    }

    /** @param {HTMLButtonElement|null} k @param {boolean} gesperrt @param {HTMLButtonElement|null} anderer */
    function sperre (k, gesperrt, anderer) {
      if (!k || k.disabled === gesperrt) return
      const hatteFokus = gesperrt && dok.activeElement === k
      k.disabled = gesperrt
      if (hatteFokus) (anderer && !anderer.disabled ? anderer : spur).focus()
    }

    function stimme () {
      const amAnfang = spur.scrollLeft <= 4
      const amEnde = spur.scrollLeft + spur.clientWidth >= spur.scrollWidth - 4
      sperre(zurueck, amAnfang, vor)
      sperre(vor, amEnde, zurueck)
    }

    /** @param {-1|1} richtung */
    function blaettere (richtung) {
      const ziel = { left: richtung * schritt(), behavior: /** @type {ScrollBehavior} */ (reduzierteBewegung(spur) ? 'instant' : 'smooth') }
      if (typeof spur.scrollBy === 'function') spur.scrollBy(ziel)
      else spur.scrollLeft += ziel.left
      sende(spur, 'testimonial-grid-step', { direction: richtung < 0 ? 'prev' : 'next' })
    }

    zurueck?.addEventListener('click', () => blaettere(-1), { signal })
    vor?.addEventListener('click', () => blaettere(1), { signal })
    spur.addEventListener('scroll', stimme, { passive: true, signal })

    const Groesse = /** @type {any} */ (globalThis).ResizeObserver || /** @type {any} */ (ansicht).ResizeObserver
    let groesse = null
    if (typeof Groesse === 'function') {
      groesse = new Groesse(() => stimme())
      groesse.observe(spur)
    } else ansicht.addEventListener('resize', stimme, { signal })

    stimme()

    signal.addEventListener('abort', () => {
      groesse?.disconnect()
      if (zurueck) zurueck.disabled = vorher[0]
      if (vor) vor.disabled = vorher[1]
    })
  }
}
