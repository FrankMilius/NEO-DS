// @ts-check
// ==========================================================================
// Gallery — nach data/gallery-recipe.json (keyboard, events)
// ==========================================================================
// Website-Bauteil (Plan v4, Phase 2, 12.10.2026). Ersetzt in
// neo_fe/js/neo-theme.js die Bedienung von Drupal.behaviors.neoGallery
// (Blaettern, Punkte, Tastatur, Autoplay). Den Aufbau der Slides und Punkte
// aus JSON behaelt das Theme bis Phase 7 und bindet danach mit
// NeoBehaviors.anbinden(wurzel, ['gallery']).
//
// Markup (fertig): .nc-gallery[data-autoplay] > .nc-gallery__track >
// .nc-gallery__slide (role=tabpanel); .nc-gallery__nav[role=tablist] >
// .nc-gallery__nav-dot (role=tab); Paddles [data-gallery-prev|next] bzw.
// .nc-gallery__paddle--prev|--next; Knopf .nc-gallery__autoplay.
//
//   Blaettern   Paddles und Pfeil links/rechts rundum; ohne --fade schiebt
//               die Spur (translate3d), mit --fade blendet .is-active.
//   Punkte      Tabs-Muster: aria-controls auf den Slide, aria-selected,
//               wandernder tabindex (nur der gewaehlte Punkt in der
//               Tab-Folge); auf einem Punkt Pfeile rundum, Pos1, Ende
//               waehlen und fokussieren (automatische Aktivierung).
//   Verborgen   alle Slides ausser dem gewaehlten sind `inert` (und
//               aria-hidden): ihre Links sind nicht fokussierbar.
//   Autoplay    nur data-autoplay="on" und nie bei prefers-reduced-motion
//               (dann ist der Knopf [hidden]). Der Knopf ist die einzige
//               Quelle des Zustands: data-playing="true|false" und die
//               Beschriftung (aria-label, Symbol ohne Text) folgen ihm;
//               Escape setzt ihn auf „angehalten" (vorher schaltete
//               neoGallery per autoplayBtn.click() wieder ein). Texte de/en
//               nach lang („Galerie pausieren"/„Galerie abspielen", en
//               „Pause gallery"/„Play gallery"), am Knopf ueberschreibbar
//               per data-text-pause / data-text-play.
//   Handwahl    Paddle, Punkt oder Pfeiltaste beendet die Rotation
//               dauerhaft (wie solution-tabs, Entscheidung E1) — weiter
//               nur ueber den Knopf.
//   Ruhe        Maus ueber der Galerie oder Fokus darin (ausser auf dem
//               Knopf) halten den Takt an (.is-paused), danach laeuft die
//               Restzeit; ausser Sicht (IntersectionObserver, 30 %) ebenso.
//   Ansage      Die Spur ist aria-live="polite", solange der Takt ruht,
//               und "off", solange er laeuft (APG-Karussell).
//
// Ereignisse: `gallery-change` { index, previousIndex } bei jedem Wechsel;
// `gallery-autoplay` { playing, reason } wenn der Takt anlaeuft oder ruht —
// reason "knopf" | "escape" | "wahl" | "hover" | "fokus" | "ausser-sicht".
// ==========================================================================
import { sende, zielFuerTaste } from './kern.js'

export const TEXTE = {
  de: { pause: 'Galerie pausieren', play: 'Galerie abspielen' },
  en: { pause: 'Pause gallery', play: 'Play gallery' }
}

// Symbole fuer einen angelegten Knopf (das Twig rendert dieselben Klassen)
const SYMBOL = '<svg class="nc-gallery__autoplay-pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>' +
  '<svg class="nc-gallery__autoplay-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><polygon points="6,4 20,12 6,20"/></svg>'

const VORGABE_MS = 6000
let zaehler = 0

/** Sprache: lang am Bauteil oder Vorfahren; de (auch ohne Angabe) oder en
 * @param {HTMLElement} el */
export function spracheVon (el) {
  const lang = (el.closest('[lang]')?.getAttribute('lang') || '').trim().toLowerCase()
  return !lang || lang === 'de' || lang.startsWith('de-') ? 'de' : 'en'
}

/**
 * Dauer in ms aus einer Custom Property („6s", „700ms", „6" = Sekunden wie
 * bisher in neoGallery); sonst die Vorgabe.
 * @param {HTMLElement} el @param {string} eigenschaft @param {number} vorgabe
 */
export function dauerAus (el, eigenschaft, vorgabe) {
  const ansicht = el.ownerDocument.defaultView
  let roh = ''
  try { roh = ansicht?.getComputedStyle(el).getPropertyValue(eigenschaft) || '' } catch { roh = '' }
  if (!roh.trim()) roh = el.style.getPropertyValue(eigenschaft)
  const m = /^\s*([\d.]+)\s*(ms|s)?\s*$/.exec(roh || '')
  if (!m) return vorgabe
  const zahl = parseFloat(m[1])
  if (!(zahl > 0)) return vorgabe
  return m[2] === 'ms' ? zahl : zahl * 1000
}

/** @param {HTMLElement} el */
export function reduzierteBewegung (el) {
  const ansicht = el.ownerDocument.defaultView
  return !!ansicht?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
}

export const gallery = {
  id: 'gallery',
  selektor: '.nc-gallery',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const spur = /** @type {HTMLElement|null} */ (wurzel.querySelector(':scope > .nc-gallery__track'))
    const slides = spur ? /** @type {HTMLElement[]} */ ([...spur.querySelectorAll(':scope > .nc-gallery__slide')]) : []
    // Das Theme baut die Slides erst aus JSON und bindet danach (neu)
    if (!spur || !slides.length) return
    const dok = wurzel.ownerDocument
    const ansicht = dok.defaultView || window
    const fade = wurzel.classList.contains('nc-gallery--fade')
    const nav = /** @type {HTMLElement|null} */ (wurzel.querySelector('.nc-gallery__nav'))
    const punkte = nav ? /** @type {HTMLElement[]} */ ([...nav.querySelectorAll('.nc-gallery__nav-dot')]).slice(0, slides.length) : []
    const zurueck = /** @type {HTMLElement|null} */ (wurzel.querySelector('[data-gallery-prev], .nc-gallery__paddle--prev'))
    const vor = /** @type {HTMLElement|null} */ (wurzel.querySelector('[data-gallery-next], .nc-gallery__paddle--next'))

    // --- ids und Tabs-Muster ------------------------------------------------
    const basis = wurzel.id || 'nc-gallery-' + (++zaehler)
    const vergebeneIds = []
    slides.forEach((s, i) => {
      if (!s.id) { s.id = `${basis}-slide-${i}`; vergebeneIds.push(s) }
      const p = punkte[i]
      if (!p) return
      if (!p.id) { p.id = `${basis}-tab-${i}`; vergebeneIds.push(p) }
      p.setAttribute('role', 'tab')
      p.setAttribute('aria-controls', s.id)
    })

    let index = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')))

    /** Zustand setzen (ohne Ereignis) @param {number} i */
    function zeige (i) {
      index = i
      slides.forEach((s, j) => {
        const an = j === i
        s.classList.toggle('is-active', an)
        s.inert = !an
        if (an) s.removeAttribute('aria-hidden')
        else s.setAttribute('aria-hidden', 'true')
      })
      punkte.forEach((p, j) => {
        const an = j === i
        p.classList.toggle('is-active', an)
        p.setAttribute('aria-selected', String(an))
        p.tabIndex = an ? 0 : -1
      })
      if (!fade) spur.style.transform = `translate3d(-${i * 100}%, 0, 0)`
    }
    zeige(index)

    /** @param {number} i @param {HTMLElement|null} [fokus] */
    function waehle (i, fokus) {
      const n = slides.length
      const ziel = ((i % n) + n) % n
      const vorher = index
      if (ziel !== vorher) {
        zeige(ziel)
        sende(wurzel, 'gallery-change', { index: ziel, previousIndex: vorher })
      }
      if (fokus) fokus.focus()
    }

    // --- Autoplay -----------------------------------------------------------
    const autoplay = wurzel.dataset.autoplay === 'on'
    const reduziert = reduzierteBewegung(wurzel)
    let knopf = /** @type {HTMLButtonElement|null} */ (wurzel.querySelector('.nc-gallery__autoplay'))
    const knopfVorher = knopf
      ? { hidden: knopf.hidden, label: knopf.getAttribute('aria-label'), playing: knopf.getAttribute('data-playing') }
      : null
    let angelegt = false
    let laeuft = false // Wunsch: Rotation an (nur der Knopf und Escape/Handwahl schalten)
    let spielt = false // tatsaechlich im Takt
    /** @type {(an: boolean, grund: string) => void} */
    let schalte = () => {}

    if (autoplay && !reduziert) {
      if (!knopf) {
        knopf = dok.createElement('button')
        knopf.type = 'button'
        knopf.className = 'nc-gallery__autoplay'
        knopf.innerHTML = SYMBOL
        wurzel.append(knopf)
        angelegt = true
      }
      const k = knopf
      k.hidden = false
      const texte = TEXTE[spracheVon(wurzel)]
      const textPause = k.dataset.textPause || texte.pause
      const textPlay = k.dataset.textPlay || texte.play
      const dauer = dauerAus(wurzel, '--nc-gallery-autoplay-interval', VORGABE_MS)
      let maus = false
      let fokus = false
      // globalThis zuerst: Timer und Beobachter wie im Rest des Pakets
      const Beobachter = /** @type {any} */ (globalThis).IntersectionObserver || /** @type {any} */ (ansicht).IntersectionObserver
      let sichtbar = typeof Beobachter !== 'function'
      /** @type {any} */
      let timer = 0
      let rest = dauer
      let start = 0
      laeuft = true

      const zeigeKnopf = () => {
        k.setAttribute('data-playing', String(laeuft))
        k.setAttribute('aria-label', laeuft ? textPause : textPlay)
        wurzel.classList.toggle('is-stopped', !laeuft)
      }

      const plane = () => {
        clearTimeout(timer)
        start = Date.now()
        timer = setTimeout(() => {
          timer = 0
          waehle(index + 1, null)
          rest = dauer
          plane()
        }, rest)
      }

      /** @param {string} grund @param {boolean} [immer] */
      const stimme = (grund, immer = false) => {
        const soll = laeuft && !maus && !fokus && sichtbar
        wurzel.classList.toggle('is-paused', laeuft && !soll)
        spur.setAttribute('aria-live', soll ? 'off' : 'polite')
        if (soll === spielt) {
          if (immer) sende(wurzel, 'gallery-autoplay', { playing: soll, reason: grund })
          return
        }
        spielt = soll
        if (soll) plane()
        else {
          clearTimeout(timer)
          timer = 0
          rest = Math.max(0, rest - (Date.now() - start))
        }
        sende(wurzel, 'gallery-autoplay', { playing: soll, reason: grund })
      }

      schalte = (an, grund) => {
        if (laeuft === an) return
        laeuft = an
        if (an) {
          rest = dauer
          // Wer abspielt, will es sehen: Maus und Fokus auf dem Knopf halten nicht an
          maus = false
          fokus = false
        }
        zeigeKnopf()
        stimme(grund, true)
      }

      zeigeKnopf()
      k.addEventListener('click', () => schalte(!laeuft, 'knopf'), { signal })
      wurzel.addEventListener('mouseenter', () => { maus = true; stimme('hover') }, { signal })
      wurzel.addEventListener('mouseleave', () => { maus = false; stimme('hover') }, { signal })
      const fokusDrin = (ziel) => !!ziel && wurzel.contains(ziel) && !k.contains(ziel)
      wurzel.addEventListener('focusin', (e) => { fokus = fokusDrin(e.target); stimme('fokus') }, { signal })
      wurzel.addEventListener('focusout', (e) => { fokus = fokusDrin(/** @type {FocusEvent} */ (e).relatedTarget); stimme('fokus') }, { signal })

      let beobachter = null
      if (!sichtbar) {
        beobachter = new Beobachter((eintraege) => {
          for (const e of eintraege) sichtbar = e.isIntersecting
          stimme('ausser-sicht')
        }, { threshold: 0.3 })
        beobachter.observe(wurzel)
      }
      stimme('ausser-sicht')

      signal.addEventListener('abort', () => {
        clearTimeout(timer)
        beobachter?.disconnect()
      })
    } else {
      if (knopf) knopf.hidden = true
      spur.setAttribute('aria-live', 'polite')
    }

    signal.addEventListener('abort', () => {
      wurzel.classList.remove('is-paused', 'is-stopped')
      spur.removeAttribute('aria-live')
      for (const el of vergebeneIds) el.removeAttribute('id')
      if (angelegt) knopf?.remove()
      else if (knopf && knopfVorher) {
        knopf.hidden = knopfVorher.hidden
        if (knopfVorher.label === null) knopf.removeAttribute('aria-label')
        else knopf.setAttribute('aria-label', knopfVorher.label)
        if (knopfVorher.playing === null) knopf.removeAttribute('data-playing')
        else knopf.setAttribute('data-playing', knopfVorher.playing)
      }
    })

    // --- Bedienung ----------------------------------------------------------
    /** Handwahl: beendet die Rotation dauerhaft, dann waehlen */
    const hand = (i, fokus = null) => { schalte(false, 'wahl'); waehle(i, fokus) }

    zurueck?.addEventListener('click', () => hand(index - 1), { signal })
    vor?.addEventListener('click', () => hand(index + 1), { signal })
    nav?.addEventListener('click', (e) => {
      const p = /** @type {HTMLElement} */ (e.target).closest?.('.nc-gallery__nav-dot')
      const i = punkte.indexOf(/** @type {HTMLElement} */ (p))
      if (i >= 0) hand(i)
    }, { signal })

    wurzel.addEventListener('keydown', (e) => {
      const ziel = /** @type {HTMLElement} */ (e.target)
      if (e.key === 'Escape') {
        // Escape haelt an — immer, nie wieder einschalten
        if (laeuft) schalte(false, 'escape')
        return
      }
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const punkt = punkte.includes(ziel) ? ziel : null
      if (punkt) {
        const naechster = zielFuerTaste(e.key, punkte, punkt, 'horizontal')
        if (!naechster) return
        e.preventDefault()
        hand(punkte.indexOf(naechster), naechster)
        return
      }
      // Pfeile auf Paddles, Knopf und Wurzel — nicht im Inhalt eines Slides
      // (der Fokus laege danach in einem verborgenen, inerten Slide)
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if (ziel.closest?.('.nc-gallery__slide')) return
      e.preventDefault()
      hand(index + (e.key === 'ArrowRight' ? 1 : -1))
    }, { signal })
  }
}
