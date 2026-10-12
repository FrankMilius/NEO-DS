// @ts-check
// ==========================================================================
// Video — nach data/video-recipe.json (keyboard, events)
// ==========================================================================
// Website-Bauteil (Plan v4, Phase 3, 12.10.2026, Entscheidung E5 = a, WCAG
// 2.2.2). Zwei Modi an derselben Wurzel [data-neo-video]:
//
//   Hintergrund (Vorgabe, jeder Wert ausser "fassade")
//     Dekoratives Video (muted, loop, ohne Bedienleiste) in Hero, Hero-TOM,
//     Hero-TMOB, Bento, Card-Grid-CTA, Story-Gallery und den Tab-Modulen.
//     Das Video ist das erste <video> der Wurzel (oder die Wurzel selbst),
//     das zu keiner inneren [data-neo-video]-Wurzel gehoert. Das Markup
//     traegt KEIN autoplay (ein vorhandenes nimmt das Behavior ab und gibt
//     es beim Abbinden zurueck) — gestartet wird nur hier:
//       - nie bei prefers-reduced-motion: das Video steht, poster bzw.
//         erstes Bild bleibt sichtbar (lief es schon, laedt load() neu, damit
//         das poster wieder erscheint), der Knopf ist [hidden];
//       - nur im Bild (IntersectionObserver aus globalThis, sonst aus dem
//         Fenster; ohne Beobachter gilt es als sichtbar), ausser Sicht
//         pausiert;
//       - eine Handpause (Knopf) bleibt bestehen, auch wenn das Video aus
//         dem Bild und wieder hinein kommt.
//     Knopf .nc-video-pause: EIN Knopf mit wechselnder Beschriftung (Muster
//     wie solution-tabs/gallery, E1/E5): aria-label „Video anhalten" /
//     „Video abspielen" (en: „Pause video" / „Play video") nach lang, am
//     Knopf ueberschreibbar per data-text-pause / data-text-play;
//     data-playing="true|false" waehlt das Symbol (CSS). Fehlt er, legt das
//     Behavior ihn als Kind der Wurzel direkt hinter dem Teil an, der das
//     Video enthaelt. Ein Knopf in einem verborgenen Bereich
//     (aria-hidden="true", z. B. die Kopien der Story-Gallery im
//     Endlos-Modus) bekommt tabindex="-1" (per Maus bedienbar, nicht in der
//     Tab-Folge). Liegt die Wurzel in einem Link (Bento-Kachel mit URL),
//     verhindert der Knopf das Folgen des Links.
//     Lehnt der Browser das Abspielen ab (play() verworfen), gilt das als
//     angehalten — der Knopf bietet „Video abspielen" an.
//
//   Fassade ([data-neo-video="fassade"], Muster neoTestimonialVideo)
//     Ein Knopf mit data-video-url (YouTube oder Vimeo) und aria-label.
//     Vor dem Klick laedt nichts von YouTube oder Vimeo (DSGVO); beim Klick
//     ersetzt ein iframe den Knopf (YouTube ueber youtube-nocookie.com, Vimeo
//     mit dnt=1, jeweils autoplay=1), title aus dem aria-label, Fokus aufs
//     iframe. Unbekannte Anbieter: Link in neuem Fenster (wie bisher).
//     data-video-class gibt dem iframe Klassen mit. Abbinden stellt die
//     Fassade wieder her.
//
// Ereignisse: `video-autoplay` { playing, reason } wenn ein Hintergrund-
// video anlaeuft oder ruht — reason "knopf" (meldet immer) | "sicht" (kommt
// ins Bild) | "ausser-sicht" | "blockiert" (Browser lehnt ab);
// `video-fassade` { provider, url } wenn eine Fassade das iframe laedt —
// provider "youtube" | "vimeo" | null (unbekannt: neues Fenster).
// ==========================================================================
import { sende } from './kern.js'
import { reduzierteBewegung, spracheVon } from './gallery.js'

export const TEXTE = {
  de: { pause: 'Video anhalten', play: 'Video abspielen', titel: 'Video' },
  en: { pause: 'Pause video', play: 'Play video', titel: 'Video' }
}

/** Symbol fuer einen angelegten Knopf (das Twig rendert dasselbe) */
const SYMBOL = '<svg class="nc-video-pause__icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
  '<path class="nc-video-pause__pause" d="M4 2.5h3v11H4zM9 2.5h3v11H9z"/>' +
  '<path class="nc-video-pause__play" d="M4.5 2.2 13.5 8l-9 5.8z"/></svg>'

/**
 * Einbettungs-Adresse einer Fassade (wie bisher neoVideoEmbedUrl, Vimeo
 * zusaetzlich mit dnt=1). Unbekannte Anbieter: provider null, embed ''.
 * @param {string} url
 * @returns {{ provider: 'youtube'|'vimeo'|null, embed: string }}
 */
export function einbettung (url) {
  const u = String(url || '')
  const yt = u.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  if (yt) return { provider: 'youtube', embed: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0` }
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vm) return { provider: 'vimeo', embed: `https://player.vimeo.com/video/${vm[1]}?autoplay=1&dnt=1` }
  return { provider: null, embed: '' }
}

/** Das Video der Wurzel (nicht das einer inneren Wurzel) @param {HTMLElement} wurzel */
function videoVon (wurzel) {
  if (wurzel.tagName === 'VIDEO') return /** @type {HTMLVideoElement} */ (wurzel)
  for (const v of wurzel.querySelectorAll('video')) {
    if (v.parentElement?.closest('[data-neo-video]') === wurzel) return /** @type {HTMLVideoElement} */ (v)
  }
  return null
}

export const video = {
  id: 'video',
  selektor: '[data-neo-video]',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    if (wurzel.getAttribute('data-neo-video') === 'fassade') fassade(wurzel, signal)
    else hintergrund(wurzel, signal)
  }
}

/** @param {HTMLElement} wurzel @param {AbortSignal} signal */
function hintergrund (wurzel, signal) {
  const v = videoVon(wurzel)
  // Das Theme baut manche Bloecke erst aus JSON und bindet danach (neu)
  if (!v) return
  const dok = wurzel.ownerDocument
  const ansicht = dok.defaultView || window

  // --- Video: Start nur hier ------------------------------------------------
  const hatteAutoplay = v.hasAttribute('autoplay')
  v.removeAttribute('autoplay')
  v.autoplay = false
  v.muted = true
  v.setAttribute('muted', '')
  v.setAttribute('playsinline', '')

  // --- Knopf ------------------------------------------------------------------
  let knopf = /** @type {HTMLButtonElement|null} */ (wurzel.querySelector(':scope > .nc-video-pause'))
  const knopfVorher = knopf
    ? { hidden: knopf.hidden, label: knopf.getAttribute('aria-label'), playing: knopf.getAttribute('data-playing'), tabindex: knopf.getAttribute('tabindex') }
    : null
  let angelegt = false
  if (!knopf) {
    knopf = dok.createElement('button')
    knopf.type = 'button'
    knopf.className = 'nc-video-pause'
    knopf.innerHTML = SYMBOL
    knopf.hidden = true
    if (v === wurzel) v.after(knopf)
    else {
      const anker = [...wurzel.children].find((c) => c.contains(v))
      if (anker) anker.after(knopf)
      else wurzel.append(knopf)
    }
    angelegt = true
  }
  const k = knopf
  if (wurzel.closest('[aria-hidden="true"]')) k.tabIndex = -1

  /** @type {any} */
  let beobachter = null
  signal.addEventListener('abort', () => {
    if (beobachter) beobachter.disconnect()
    if (hatteAutoplay) v.setAttribute('autoplay', '')
    if (angelegt) k.remove()
    else if (knopfVorher) {
      k.hidden = knopfVorher.hidden
      for (const [attr, wert] of /** @type {Array<[string, string|null]>} */ ([['aria-label', knopfVorher.label], ['data-playing', knopfVorher.playing], ['tabindex', knopfVorher.tabindex]])) {
        if (wert === null) k.removeAttribute(attr)
        else k.setAttribute(attr, wert)
      }
    }
  })

  // Reduzierte Bewegung: kein Start, poster sichtbar, kein Knopf
  if (reduzierteBewegung(wurzel)) {
    k.hidden = true
    const lief = !v.paused || v.currentTime > 0
    v.pause()
    // load() setzt auf den Anfang zurueck: das poster erscheint wieder
    if (lief) v.load()
    return
  }
  k.hidden = false

  const texte = TEXTE[spracheVon(wurzel)]
  const textPause = k.dataset.textPause || texte.pause
  const textPlay = k.dataset.textPlay || texte.play

  let laeuft = true // Wunsch (Knopf)
  const Beobachter = /** @type {any} */ (globalThis).IntersectionObserver || /** @type {any} */ (ansicht).IntersectionObserver
  let sichtbar = typeof Beobachter !== 'function'
  let spielt = false // tatsaechlich angestossen

  const zeigeKnopf = () => {
    k.setAttribute('data-playing', String(laeuft))
    k.setAttribute('aria-label', laeuft ? textPause : textPlay)
  }

  /** @param {string} grund @param {boolean} [immer] */
  const stimme = (grund, immer = false) => {
    const soll = laeuft && sichtbar
    if (soll !== spielt) {
      spielt = soll
      if (soll) {
        const versuch = v.play()
        // Browser lehnt ab (Autoplay-Regeln): gilt als angehalten
        if (versuch && typeof versuch.catch === 'function') {
          versuch.catch((/** @type {any} */ fehler) => {
            if (signal.aborted || fehler?.name === 'AbortError' || !spielt) return
            spielt = false
            laeuft = false
            zeigeKnopf()
            sende(wurzel, 'video-autoplay', { playing: false, reason: 'blockiert' })
          })
        }
      } else v.pause()
      sende(wurzel, 'video-autoplay', { playing: soll, reason: grund })
    } else if (immer) sende(wurzel, 'video-autoplay', { playing: soll, reason: grund })
  }

  zeigeKnopf()
  k.addEventListener('click', (e) => {
    // In einem Link (Bento-Kachel): nicht dem Link folgen
    e.preventDefault()
    e.stopPropagation()
    laeuft = !laeuft
    zeigeKnopf()
    stimme('knopf', true)
  }, { signal })

  if (typeof Beobachter === 'function') {
    beobachter = new Beobachter((/** @type {Array<{isIntersecting: boolean}>} */ eintraege) => {
      const e = eintraege[eintraege.length - 1]
      if (!e || e.isIntersecting === sichtbar) return
      sichtbar = e.isIntersecting
      stimme(sichtbar ? 'sicht' : 'ausser-sicht')
    }, { threshold: 0.1 })
    beobachter.observe(wurzel)
  } else {
    stimme('sicht')
  }
}

/** @param {HTMLElement} wurzel @param {AbortSignal} signal */
function fassade (wurzel, signal) {
  const dok = wurzel.ownerDocument
  const ansicht = dok.defaultView || window
  /** @type {HTMLIFrameElement|null} */
  let rahmen = null
  signal.addEventListener('abort', () => {
    if (rahmen && rahmen.isConnected) rahmen.replaceWith(wurzel)
    rahmen = null
  })
  wurzel.addEventListener('click', (e) => {
    e.preventDefault()
    const url = wurzel.getAttribute('data-video-url') || ''
    const { provider, embed } = einbettung(url)
    sende(wurzel, 'video-fassade', { provider, url })
    if (!embed) {
      if (url) ansicht.open(url, '_blank', 'noopener')
      return
    }
    const f = dok.createElement('iframe')
    f.src = embed
    f.title = (wurzel.getAttribute('aria-label') || '').trim() || TEXTE[spracheVon(wurzel)].titel
    f.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media')
    f.setAttribute('allowfullscreen', '')
    const klassen = wurzel.getAttribute('data-video-class')
    if (klassen) f.className = klassen
    rahmen = f
    wurzel.replaceWith(f)
    f.focus()
  }, { signal })
}
