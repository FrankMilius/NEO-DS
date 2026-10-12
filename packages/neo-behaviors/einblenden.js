// @ts-check
// ==========================================================================
// Einblenden — Hilfs-Behavior fuer drei Website-Bloecke (Plan v4, Phase 6b)
// ==========================================================================
// Kein eigenes Recipe: das Soll steht in den Recipes der Traeger (keyboard,
// events, Anatomie) — card-grid (data-animation="reverse-domino"),
// bento-grid (data-animation="reveal") und logo-wall (.nc-logo-wall--fadein,
// nicht im Laufband). Ersetzt dreimal denselben IntersectionObserver in
// neo_fe/js/neo-theme.js (NeoCardGrid.render, NeoBento.maybeReveal,
// neoLogoWall), Plan v4, Inventur Nr. 7, 8, 20.
//
//   Ohne Skript ist nichts versteckt: das SCSS blendet die Glieder nur aus,
//   solange dieses Behavior gebunden ist ([data-neo-behavior~="einblenden"]
//   an der Wurzel, setzt der Kern). Vorher versteckte das SCSS die Karten
//   bzw. Pillen schon am Attribut bzw. an der Klasse.
//
//   - prefers-reduced-motion oder kein IntersectionObserver: sofort der
//     Endzustand, ohne Staffelung.
//   - Sonst: Endzustand, sobald 15 % der Wurzel im Bild sind (einmal, danach
//     getrennt) — mit Staffelung wie bisher: Karten --card-delay = i × 0,1 s,
//     Pillen transition-delay = i × --nc-logo-wall-fadein-delay-step
//     (Vorgabe 0,08 s); Bento ohne Staffelung.
//   - Endzustand: is-revealed an der Wurzel; in der Logo-Wand zusaetzlich
//     is-visible an jeder Pille (die Klasse liest das SCSS).
//   - Ist die Wurzel beim Binden noch leer (Bloecke, die das Theme aus JSON
//     baut, koennen nach diesem Behavior gefuellt werden), wartet es per
//     MutationObserver auf die ersten Glieder. Ist sie schon eingeblendet
//     (is-revealed, z. B. erneutes Binden nach dem Aufbau), bekommen alle
//     Glieder sofort den Endzustand.
//
// Ereignis `einblenden` { reason } an der Wurzel beim Einblenden: "sicht"
// (kommt ins Bild), "reduzierte-bewegung", "ohne-beobachter".
// Abbinden trennt die Beobachter; der Endzustand bleibt (ohne Bindung ist
// ohnehin nichts versteckt).
// ==========================================================================
import { sende } from './kern.js'
import { reduzierteBewegung, dauerAus } from './gallery.js'

/** Traeger-Recipes (Soll: keyboard, events) */
export const EINBLENDEN_RECIPES = Object.freeze(['card-grid', 'bento-grid', 'logo-wall'])

/** Art der Wurzel: Glieder, Staffelung @param {HTMLElement} wurzel */
function artVon (wurzel) {
  if (wurzel.classList.contains('nc-logo-wall--fadein')) {
    /** @type {number|null} Schritt in s, einmal gelesen */
    let schritt = null
    return {
      glieder: () => /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-logo-pill')]),
      /** @param {HTMLElement} el @param {number} i */
      staffeln: (el, i) => {
        if (schritt === null) schritt = dauerAus(wurzel, '--nc-logo-wall-fadein-delay-step', 80) / 1000
        el.style.transitionDelay = `${+(i * schritt).toFixed(3)}s`
      },
      /** @param {HTMLElement} el */
      zeige: (el) => el.classList.add('is-visible')
    }
  }
  if (wurzel.getAttribute('data-animation') === 'reverse-domino') {
    return {
      glieder: () => /** @type {HTMLElement[]} */ ([...wurzel.children].filter((c) => c.classList.contains('nc-card'))),
      /** @param {HTMLElement} el @param {number} i */
      staffeln: (el, i) => el.style.setProperty('--card-delay', `${+(i * 0.1).toFixed(1)}s`),
      zeige: () => {}
    }
  }
  return {
    glieder: () => /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-bento-grid__cell')]),
    staffeln: () => {},
    zeige: () => {}
  }
}

export const einblenden = {
  id: 'einblenden',
  selektor: '[data-animation="reverse-domino"], [data-animation="reveal"], .nc-logo-wall--fadein:not(.nc-logo-wall--marquee)',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  recipes: EINBLENDEN_RECIPES,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const art = artVon(wurzel)
    const ansicht = wurzel.ownerDocument.defaultView || window
    const Beobachter = /** @type {any} */ (globalThis).IntersectionObserver || /** @type {any} */ (ansicht).IntersectionObserver
    const Wache = /** @type {any} */ (globalThis).MutationObserver || /** @type {any} */ (ansicht).MutationObserver
    /** @type {any[]} */
    const beobachter = []
    signal.addEventListener('abort', () => { for (const b of beobachter) b.disconnect() })

    /** @param {boolean} gestaffelt */
    const endzustand = (gestaffelt) => {
      art.glieder().forEach((el, i) => {
        if (gestaffelt) art.staffeln(el, i)
        art.zeige(el)
      })
      wurzel.classList.add('is-revealed')
    }

    // Schon eingeblendet (erneutes Binden): alle Glieder sofort sichtbar
    if (wurzel.classList.contains('is-revealed')) { endzustand(false); return }

    if (reduzierteBewegung(wurzel) || typeof Beobachter !== 'function') {
      endzustand(false)
      sende(wurzel, 'einblenden', { reason: reduzierteBewegung(wurzel) ? 'reduzierte-bewegung' : 'ohne-beobachter' })
      return
    }

    const beobachte = () => {
      const io = new Beobachter((/** @type {any[]} */ es) => {
        if (!es.some((e) => e.isIntersecting)) return
        io.disconnect()
        endzustand(true)
        sende(wurzel, 'einblenden', { reason: 'sicht' })
      }, { threshold: 0.15 })
      beobachter.push(io)
      io.observe(wurzel)
    }

    if (art.glieder().length || typeof Wache !== 'function') { beobachte(); return }
    // Noch leer: auf die ersten Glieder warten (Aufbau aus JSON)
    const wache = new Wache(() => {
      if (!art.glieder().length) return
      wache.disconnect()
      beobachte()
    })
    beobachter.push(wache)
    wache.observe(wurzel, { childList: true, subtree: true })
  }
}
