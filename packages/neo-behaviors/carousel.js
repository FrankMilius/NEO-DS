// @ts-check
// ==========================================================================
// Carousel — nach data/carousel-recipe.json (keyboard, events)
// ==========================================================================
// Website-Bauteil (Plan v4, Phase 6a, 12.10.2026). Ersetzt in
// neo_fe/js/neo-theme.js den Geraete-Karussell-Zweig von
// Drupal.behaviors.neoFadeGallery (field_fg_display = devices). Gescrollt
// wird weiterhin vom Browser — scroll-snap ist reines CSS. Dazu kommen
// Blaettern und Punkte.
//
// Markup (fertig): .nc-carousel > .nc-carousel__track (Figuren, auf der
// Website [data-fg-index] mit id). Paddles [data-fg-prev|next] bzw.
// .nc-gallery__paddle--prev|--next und Punkte .nc-gallery__nav-dot
// (a[href="#figur"]) sucht das Behavior in der Huelle [data-neo-fg-carousel]
// (Website: .nc-device-gallery) — sonst in der Wurzel (__controls).
//
//   Punkte   Verweise: ohne Skript springt der Browser zur Figur. Mit Skript
//            scrollt die Spur (nicht die Seite). Der gewaehlte Punkt traegt
//            .is-active und aria-current="true" — sofort beim Klick, nicht
//            erst wenn das Scrollen zur Ruhe kommt.
//   Paddles  eine Figur vor/zurueck, an den Enden stehen bleibend.
//   Scrollen weich nur ohne prefers-reduced-motion, sonst sofort.
//   Wischen  nach Ruhe der Spur (90 ms) zaehlt die zuletzt angesteuerte
//            Figur, solange sie ganz zu sehen ist (am Ende des Streifens
//            erreichen die letzten Figuren den linken Rand nie); sonst die
//            Figur, deren linker Rand der Einrastkante am naechsten liegt —
//            dieselbe Regel, nach der der Browser einrastet. NICHT ueber den
//            groessten Sichtanteil: drei bis vier Geraete stehen gleichzeitig
//            ganz im Bild (gemessen in neoFadeGallery: Klick auf Punkt 4
//            markierte Punkt 6).
//   Position die Differenz zweier Rechtecke, NICHT offsetLeft (zaehlt vom
//            naechsten positionierten Vorfahren, der fuer Figur und Spur nicht
//            derselbe sein muss).
//
// Ereignis: `carousel-change` { index, previousIndex }, wenn die gewaehlte
// Figur wechselt (Punkt, Paddle, Wischen).
// ==========================================================================
import { sende } from './kern.js'
import { reduzierteBewegung } from './gallery.js'

export const carousel = {
  id: 'carousel',
  selektor: '.nc-carousel',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const spur = /** @type {HTMLElement|null} */ (wurzel.querySelector(':scope > .nc-carousel__track'))
    if (!spur) return
    const markiert = /** @type {HTMLElement[]} */ ([...spur.querySelectorAll(':scope > [data-fg-index]')])
    const figuren = markiert.length ? markiert : /** @type {HTMLElement[]} */ ([...spur.children])
    if (figuren.length < 2) return
    const huelle = /** @type {HTMLElement} */ (wurzel.closest('[data-neo-fg-carousel]') || wurzel)
    const punkte = /** @type {HTMLElement[]} */ ([...huelle.querySelectorAll('.nc-gallery__nav-dot')]).slice(0, figuren.length)
    const zurueck = /** @type {HTMLElement|null} */ (huelle.querySelector('[data-fg-prev], .nc-gallery__paddle--prev'))
    const vor = /** @type {HTMLElement|null} */ (huelle.querySelector('[data-fg-next], .nc-gallery__paddle--next'))

    let aktiv = -1
    /** @type {number|null} zuletzt angesteuert (Punkt, Paddle) */
    let gewuenscht = null

    /** Punkte markieren; Ereignis bei Wechsel @param {number} nr */
    function markiere (nr) {
      punkte.forEach((p, i) => {
        p.classList.toggle('is-active', i === nr)
        if (i === nr) p.setAttribute('aria-current', 'true')
        else p.removeAttribute('aria-current')
      })
      const vorher = aktiv
      aktiv = nr
      if (vorher !== -1 && vorher !== nr) sende(wurzel, 'carousel-change', { index: nr, previousIndex: vorher })
    }

    /** Scrollposition, bei der Figur nr links einrastet @param {number} nr */
    const stelle = (nr) => spur.scrollLeft + (figuren[nr].getBoundingClientRect().left - spur.getBoundingClientRect().left)

    /** @param {number} nr */
    function hin (nr) {
      nr = Math.max(0, Math.min(figuren.length - 1, nr))
      gewuenscht = nr
      // Sofort markieren — und NICHT ueber nachfuehren(): im Moment des
      // Klicks ist die Figur noch nicht ganz zu sehen.
      markiere(nr)
      const ziel = { left: stelle(nr), behavior: /** @type {ScrollBehavior} */ (reduzierteBewegung(wurzel) ? 'instant' : 'smooth') }
      if (typeof spur.scrollTo === 'function') spur.scrollTo(ziel)
      else spur.scrollLeft = ziel.left
    }

    /** Ist Figur nr ganz im sichtbaren Teil der Spur? @param {number} nr */
    function ganzZuSehen (nr) {
      const s = spur.getBoundingClientRect()
      const f = figuren[nr].getBoundingClientRect()
      return f.left >= s.left - 1 && f.right <= s.right + 1
    }

    function nachfuehren () {
      let nr = 0
      if (gewuenscht !== null && ganzZuSehen(gewuenscht)) nr = gewuenscht
      else {
        gewuenscht = null
        const kante = spur.getBoundingClientRect().left
        let kleinster = Infinity
        figuren.forEach((f, i) => {
          const abstand = Math.abs(f.getBoundingClientRect().left - kante)
          if (abstand < kleinster) { kleinster = abstand; nr = i }
        })
      }
      markiere(nr)
    }

    punkte.forEach((p, i) => {
      p.addEventListener('click', (e) => {
        // Den Sprung selbst uebernehmen: sonst springt die SEITE zur Figur
        // und die Spur steht daneben still.
        e.preventDefault()
        hin(i)
      }, { signal })
    })
    zurueck?.addEventListener('click', () => hin(aktiv - 1), { signal })
    vor?.addEventListener('click', () => hin(aktiv + 1), { signal })

    /** @type {any} */
    let ruhe = 0
    spur.addEventListener('scroll', () => {
      // Erst wenn die Spur zur Ruhe gekommen ist — waehrend der Bewegung
      // waere jede Zwischenposition eine andere Antwort.
      clearTimeout(ruhe)
      ruhe = setTimeout(nachfuehren, 90)
    }, { passive: true, signal })

    nachfuehren()

    signal.addEventListener('abort', () => {
      clearTimeout(ruhe)
      for (const p of punkte) p.removeAttribute('aria-current')
    })
  }
}
