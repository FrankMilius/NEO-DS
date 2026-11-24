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
//   Duplikate   bleiben aria-hidden; jedes fokussierbare Element darin
//               bekommt tabindex="-1" (beim Abbinden zurueck) — nicht per
//               Tab erreichbar, nicht vorgelesen, aber mit der Maus
//               anklickbar und mit Hover (bewusst nicht inert).
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

// Fokussierbar per Tab (wie kern.js, ohne die Pruefung auf Sichtbarkeit)
const FOKUSSIERBAR = 'a[href], area[href], button, input, select, textarea, iframe, summary, [tabindex], [contenteditable="true"]'

export const TEXTE = {
  de: { pause: 'Laufband anhalten', play: 'Laufband fortsetzen' },
  en: { pause: 'Pause scrolling', play: 'Resume scrolling' }
}

/**
 * Symbol des Knopfs: Tabler player-pause / player-play im 24er-Raster,
 * Strichstaerke 2 wie die Pfeile der Story Gallery (I19 Phase 3,
 * Entscheidung Frank 24.11.2026, gilt fuer Laufband und Logo-Leiste). Das
 * Behavior setzt es auch in einen Knopf aus dem Twig, der noch das alte
 * Symbol traegt; Abbinden stellt das alte wieder her.
 * @param {string} b Block
 */
const symbol = (b) => `<svg class="${b}__pause-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">` +
  `<path class="${b}__pause-pause" d="M6 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1zM14 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"/>` +
  `<path class="${b}__pause-play" d="M7 4v16l13 -8z"/></svg>`

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

    // --- Duplikate: aus der Tab-Folge (nicht inert) ---------------------------
    // aria-hidden bleibt am Duplikat; jedes fokussierbare Element darin
    // (auch das Duplikat selbst, z. B. ein Logo-Link) bekommt tabindex -1.
    // Nicht inert: die Maus soll die Kopien weiter anklicken koennen, der
    // Hover (Mono -> Farbe) wirkt weiter (Plan v4, Phase 2, Nachbesserung).
    const duplikate = /** @type {HTMLElement[]} */ ([...spur.children]).filter((el) => el.getAttribute('aria-hidden') === 'true')
    /** @type {Array<[HTMLElement, string|null]>} */
    const ausDerFolge = []
    for (const dup of duplikate) {
      const ziele = /** @type {HTMLElement[]} */ ([dup, ...dup.querySelectorAll('*')]).filter((el) => el.matches(FOKUSSIERBAR))
      for (const el of ziele) {
        if (el.getAttribute('tabindex') === '-1') continue
        ausDerFolge.push([el, el.getAttribute('tabindex')])
        el.setAttribute('tabindex', '-1')
      }
    }

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
    // Symbol vereinheitlichen (Twig liefert ggf. noch das alte)
    if (!angelegt) {
      k.querySelectorAll(':scope > svg').forEach((alt) => alt.remove())
      k.insertAdjacentHTML('afterbegin', symbol(b))
    }
    // Verborgene Wurzel (dekorativ): aria-hidden an die Spur weitergeben
    const wurzelVerborgen = wurzel.getAttribute('aria-hidden') === 'true'
    const spurHatteHidden = spur.getAttribute('aria-hidden')
    if (wurzelVerborgen) {
      wurzel.removeAttribute('aria-hidden')
      spur.setAttribute('aria-hidden', 'true')
    }

    signal.addEventListener('abort', () => {
      for (const [el, vorher] of ausDerFolge) {
        if (vorher === null) el.removeAttribute('tabindex')
        else el.setAttribute('tabindex', vorher)
      }
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
