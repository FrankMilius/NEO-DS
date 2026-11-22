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
//     0.34, rootMargin unten -10 %; horizontal reicht ein Anschnitt), und
//     wird danach nicht mehr beobachtet.
//     Die Fuellhoehe ist der Anteil der sichtbaren Eintraege (3 Stellen).
//     Senkrecht kein Scroll-Lauscher — die Beobachtung liefert die Taktung.
//
// Ereignis `timeline-progress` { progress } an der Wurzel, wenn sich die
// Fuellhoehe aendert (auch der Endzustand 1 bei reduzierter Bewegung).
//
// Variant B (horizontal, 22.11.2026): when the track scrolls sideways, the
// fill reaches the node of the last revealed card inside the visible area
// (share of the scroll width), updated on scroll. The root gets is-more-start
// / is-more-end (edge fade); the step buttons in [data-timeline-controls]
// right after the root are shown only while the track scrolls.
//
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
    const naechstes = wurzel.nextElementSibling
    const controls = naechstes && naechstes.matches('[data-timeline-controls]') ? /** @type {HTMLElement} */ (naechstes) : null
    const buttons = controls ? /** @type {HTMLButtonElement[]} */ ([...controls.querySelectorAll('[data-timeline-step]')]) : []
    const reduced = reduzierteBewegung(wurzel)
    /** @type {any} */
    let resize = null
    let letzter = ''
    let frame = 0
    let mitSicht = false

    signal.addEventListener('abort', () => {
      if (beobachter) beobachter.disconnect()
      if (resize) resize.disconnect()
      if (frame && typeof ansicht.cancelAnimationFrame === 'function') ansicht.cancelAnimationFrame(frame)
      wurzel.classList.remove('is-more-start', 'is-more-end')
      if (controls) controls.hidden = true
      if (!hatteKlasse) wurzel.classList.remove('nc-timeline--progress')
      if (vorher) wurzel.style.setProperty('--nc-timeline-progress', vorher)
      else wurzel.style.removeProperty('--nc-timeline-progress')
      for (const e of gesetzt) e.classList.remove('is-visible')
    })

    /** @param {string} wert */
    const fuelle = (wert) => {
      if (wert === letzter) return
      letzter = wert
      wurzel.style.setProperty('--nc-timeline-progress', wert)
      sende(wurzel, 'timeline-progress', { progress: Number(wert) })
    }

    // Fuellhoehe = Anteil der bereits sichtbaren Eintraege. Horizontal: up to
    // the node of the last revealed card inside the visible area.
    const nachfuehren = () => {
      if (!scrolls()) {
        const gesehen = eintraege.filter((e) => e.classList.contains('is-visible')).length
        fuelle((gesehen / eintraege.length).toFixed(3))
        return
      }
      const end = wurzel.scrollLeft + wurzel.clientWidth
      let reach = 0
      eintraege.forEach((e, i) => {
        const centre = e.offsetLeft + e.offsetWidth / 2
        if (e.classList.contains('is-visible') && centre <= end) reach = i === eintraege.length - 1 ? wurzel.scrollWidth : centre
      })
      fuelle((reach / wurzel.scrollWidth).toFixed(3))
    }

    const scrolls = () => wurzel.scrollWidth > wurzel.clientWidth + 1

    // Edge state and step buttons (horizontal track only)
    const edges = () => {
      const on = scrolls()
      const start = on && wurzel.scrollLeft > 1
      const end = on && wurzel.scrollLeft + wurzel.clientWidth < wurzel.scrollWidth - 1
      wurzel.classList.toggle('is-more-start', start)
      wurzel.classList.toggle('is-more-end', end)
      if (controls) controls.hidden = !on
      for (const b of buttons) b.disabled = Number(b.dataset.timelineStep) < 0 ? !start : !end
    }

    const update = () => {
      frame = 0
      edges()
      if (mitSicht) nachfuehren()
    }
    const plan = () => {
      if (frame) return
      const raf = ansicht.requestAnimationFrame
      frame = typeof raf === 'function' ? raf.call(ansicht, update) : (update(), 0)
    }

    wurzel.addEventListener('scroll', plan, { passive: true, signal })
    const RO = /** @type {any} */ (globalThis).ResizeObserver || /** @type {any} */ (ansicht).ResizeObserver
    if (typeof RO === 'function') { resize = new RO(plan); resize.observe(wurzel) } else ansicht.addEventListener('resize', plan, { signal })
    for (const b of buttons) {
      b.addEventListener('click', () => {
        const first = eintraege[0]
        const step = first.offsetWidth + (parseFloat(ansicht.getComputedStyle(wurzel).columnGap) || 0)
        if (typeof wurzel.scrollBy === 'function') wurzel.scrollBy({ left: Number(b.dataset.timelineStep) * step, behavior: reduced ? 'auto' : 'smooth' })
      }, { signal })
    }
    edges()

    if (reduced || typeof Beobachter !== 'function') {
      // Alles sofort sichtbar, Linie voll — nichts zu animieren
      fuelle('1')
      return
    }

    // Ab jetzt darf ausgeblendet werden
    wurzel.classList.add('nc-timeline--progress')
    wurzel.style.setProperty('--nc-timeline-progress', '0')

    mitSicht = true

    beobachter = new Beobachter((/** @type {any[]} */ es) => {
      for (const e of es) {
        // Vertical: a third in view. Horizontal: any part — so the card that
        // peeks in at the edge shows and hints at more phases.
        if (!e.isIntersecting || (e.intersectionRatio < 0.34 && !scrolls())) continue
        const el = /** @type {HTMLElement} */ (e.target)
        if (!el.classList.contains('is-visible')) { el.classList.add('is-visible'); gesetzt.push(el) }
        beobachter.unobserve(el)
        nachfuehren()
      }
    }, { threshold: [0, 0.34], rootMargin: '0px 0px -10% 0px' })
    for (const e of eintraege) beobachter.observe(e)
  }
}
