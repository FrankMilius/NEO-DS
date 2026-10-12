// @ts-check
// ==========================================================================
// Marquee (Laufband) — nach data/marquee-recipe.json (keyboard, events)
// ==========================================================================
// Website-Bauteil (Plan v4, Phase 2, 12.10.2026, WCAG 2.2.2). Bindet an den
// Lauftext .nc-marquee und an das Logo-Laufband .nc-logo-wall--marquee
// (Recipe logo-wall, Layout marquee; teilt dieses Verhalten). Die Bewegung
// selbst macht das CSS des DS (Keyframes, translate um die halbe Spur); das
// Behavior haelt sie an und laesst sie weiterlaufen.
//
// Markup: Wurzel > Knopf (.nc-marquee__pause bzw. .nc-logo-wall__pause, vor
// der Spur) + Spur (.nc-marquee__track bzw. .nc-logo-wall__track). Die Spur
// traegt den Inhalt zweimal; die zweite Haelfte ist als Duplikat markiert
// (aria-hidden="true" an den Gliedern). Das Logo-Laufband baut neo-theme.js
// bis Phase 7 aus JSON und bindet danach mit
// NeoBehaviors.anbinden(wand, ['marquee']).
//
//   Duplikate   werden `inert` (nicht nur aria-hidden): ihre Links sind
//               weder fokussierbar noch fuer Hilfsmittel da.
//   Knopf       ein Knopf mit wechselnder Beschriftung (wie solution-tabs,
//               E1): „Laufband anhalten" / „Laufband fortsetzen" (en: „Pause
//               scrolling" / „Resume scrolling") nach lang, am Knopf
//               ueberschreibbar per data-text-pause / data-text-play;
//               data-playing="true|false" waehlt das Symbol (CSS). Fehlt er,
//               legt das Behavior ihn vor der Spur an. Angehalten:
//               .is-stopped an der Wurzel.
//   Ruhe        Maus ueber dem Laufband oder Fokus darin (ausser auf dem
//               Knopf) halten es vorübergehend an: .is-paused.
//   Reduzierte Bewegung  die Spur steht (CSS), der Knopf ist [hidden].
//
// Eine Wurzel mit aria-hidden="true" (dekorativer Lauftext) gibt das
// aria-hidden an die Spur weiter — sonst laege der Knopf im verborgenen
// Bereich. Abbinden stellt es wieder her.
//
// Ereignis: `marquee-autoplay` { playing, reason } wenn die Bewegung
// anlaeuft oder ruht — reason "knopf" | "hover" | "fokus".
// ==========================================================================
import { sende } from './kern.js'
import { reduzierteBewegung, spracheVon } from './gallery.js'

export const TEXTE = {
  de: { pause: 'Laufband anhalten', play: 'Laufband fortsetzen' },
  en: { pause: 'Pause scrolling', play: 'Resume scrolling' }
}

/** Symbol fuer einen angelegten Knopf (das Twig rendert dasselbe) @param {string} b Block */
const symbol = (b) => `<svg class="${b}__pause-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">` +
  `<path class="${b}__pause-pause" d="M4 2.5h3v11H4zM9 2.5h3v11H9z"/>` +
  `<path class="${b}__pause-play" d="M4.5 2.2 13.5 8l-9 5.8z"/></svg>`

export const marquee = {
  id: 'marquee',
  selektor: '.nc-marquee, .nc-logo-wall--marquee',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const b = wurzel.classList.contains('nc-logo-wall--marquee') ? 'nc-logo-wall' : 'nc-marquee'
    const spur = /** @type {HTMLElement|null} */ (wurzel.querySelector(`:scope > .${b}__track`))
    // Das Theme fuellt die Spur erst aus JSON und bindet danach (neu)
    if (!spur || !spur.children.length) return
    const dok = wurzel.ownerDocument

    // --- Duplikate: inert ----------------------------------------------------
    const duplikate = /** @type {HTMLElement[]} */ ([...spur.children]).filter((el) => el.getAttribute('aria-hidden') === 'true' && !el.inert)
    for (const el of duplikate) el.inert = true

    // --- Knopf ---------------------------------------------------------------
    let knopf = /** @type {HTMLButtonElement|null} */ (wurzel.querySelector(`:scope > .${b}__pause`))
    const knopfVorher = knopf ? { hidden: knopf.hidden, html: knopf.innerHTML, playing: knopf.getAttribute('data-playing') } : null
    let angelegt = false
    if (!knopf) {
      knopf = dok.createElement('button')
      knopf.type = 'button'
      knopf.className = `${b}__pause`
      knopf.innerHTML = symbol(b) + `<span class="${b}__pause-label"></span>`
      wurzel.insertBefore(knopf, spur)
      angelegt = true
    }
    const k = knopf
    // Verborgene Wurzel (dekorativ): aria-hidden an die Spur weitergeben
    const wurzelVerborgen = wurzel.getAttribute('aria-hidden') === 'true'
    const spurHatteHidden = spur.getAttribute('aria-hidden')
    if (wurzelVerborgen) {
      wurzel.removeAttribute('aria-hidden')
      spur.setAttribute('aria-hidden', 'true')
    }

    signal.addEventListener('abort', () => {
      for (const el of duplikate) el.inert = false
      wurzel.classList.remove('is-paused', 'is-stopped')
      if (wurzelVerborgen) {
        wurzel.setAttribute('aria-hidden', 'true')
        if (spurHatteHidden === null) spur.removeAttribute('aria-hidden')
      }
      if (angelegt) k.remove()
      else if (knopfVorher) {
        k.hidden = knopfVorher.hidden
        k.innerHTML = knopfVorher.html
        if (knopfVorher.playing === null) k.removeAttribute('data-playing')
        else k.setAttribute('data-playing', knopfVorher.playing)
      }
    })

    // Reduzierte Bewegung: die Spur steht (CSS) — nichts anzuhalten
    if (reduzierteBewegung(wurzel)) {
      k.hidden = true
      return
    }
    k.hidden = false

    const texte = TEXTE[spracheVon(wurzel)]
    const textPause = k.dataset.textPause || texte.pause
    const textPlay = k.dataset.textPlay || texte.play
    let beschriftung = /** @type {HTMLElement|null} */ (k.querySelector(`.${b}__pause-label`))
    if (!beschriftung) {
      beschriftung = dok.createElement('span')
      beschriftung.className = `${b}__pause-label`
      k.append(beschriftung)
    }
    const label = beschriftung

    let laeuft = true // Wunsch (Knopf)
    let maus = false
    let fokus = false
    let spielt = true // tatsaechlich in Bewegung (CSS laeuft ohne Klassen)

    const zeigeKnopf = () => {
      k.setAttribute('data-playing', String(laeuft))
      label.textContent = laeuft ? textPause : textPlay
      wurzel.classList.toggle('is-stopped', !laeuft)
    }

    /** @param {string} grund @param {boolean} [immer] */
    const stimme = (grund, immer = false) => {
      const soll = laeuft && !maus && !fokus
      wurzel.classList.toggle('is-paused', laeuft && !soll)
      if (soll === spielt) {
        if (immer) sende(wurzel, 'marquee-autoplay', { playing: soll, reason: grund })
        return
      }
      spielt = soll
      sende(wurzel, 'marquee-autoplay', { playing: soll, reason: grund })
    }

    zeigeKnopf()
    k.addEventListener('click', () => {
      laeuft = !laeuft
      // Wer fortsetzt, will es sehen: Maus und Fokus auf dem Knopf halten nicht an
      if (laeuft) { maus = false; fokus = false }
      zeigeKnopf()
      stimme('knopf', true)
    }, { signal })
    // Maus: ueber der Spur (nicht ueber dem Knopf, dort steuert man)
    const ueberSpur = (ziel) => !!ziel && spur.contains(ziel)
    wurzel.addEventListener('mouseover', (e) => { const m = ueberSpur(e.target); if (m !== maus) { maus = m; stimme('hover') } }, { signal })
    wurzel.addEventListener('mouseleave', () => { if (maus) { maus = false; stimme('hover') } }, { signal })
    const fokusDrin = (ziel) => !!ziel && wurzel.contains(ziel) && !k.contains(ziel)
    wurzel.addEventListener('focusin', (e) => { fokus = fokusDrin(e.target); stimme('fokus') }, { signal })
    wurzel.addEventListener('focusout', (e) => { fokus = fokusDrin(/** @type {FocusEvent} */ (e).relatedTarget); stimme('fokus') }, { signal })
  }
}
