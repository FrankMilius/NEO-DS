// @ts-check
// ==========================================================================
// Solution-Tabs — nach data/solution-tabs-recipe.json (keyboard, events)
// ==========================================================================
// Website-Bauteil (Plan v4, Phase 1, Entscheidungen E1 und E6, 09.10.2026).
// Ersetzt in neo_fe/js/neo-theme.js das Verhalten von
// Drupal.behaviors.neoSolutionTabs und Drupal.behaviors.neoTabNav (activate,
// Tastatur, Autoplay). Den Aufbau von Tableiste und Panels aus JSON behaelt
// das Theme bis Phase 7 (E6) und bindet danach mit
// NeoBehaviors.anbinden(wurzel, ['solution-tabs']). Die Tab-Nav nutzt
// dieselbe Wurzel („nc-solution-tabs nc-tab-nav") und damit dieses Behavior.
//
// Tabs-Muster (WAI-ARIA, automatische Aktivierung) auf fertigem Markup:
// .nc-solution-tabs__tablist[role=tablist] > .nc-solution-tabs__tab
// [role=tab][aria-controls]; genau ein Tab aria-selected="true" mit
// tabindex 0 (wandernder tabindex), sein Panel .is-active, die anderen
// [hidden]. Klick waehlt; Pfeil rechts/links (vertikal runter/hoch) rundum,
// Pos1, Ende waehlen und fokussieren. Enter/Leertaste: nativer Klick.
//
// Autoplay (nur data-autoplay="on" und nie bei prefers-reduced-motion):
//   Takt         ein setTimeout je Schritt (Dauer aus
//                --nc-solution-tabs-autoplay-duration, Vorgabe 7 s) — der
//                naechste Tab folgt immer dem gerade gewaehlten (behebt den
//                Zaehlerfehler von neoTabNav nach einer Handwahl).
//   Knopf        .nc-solution-tabs__autoplay vor der Tableiste (das Twig
//                rendert ihn, sonst legt das Behavior ihn an). Ein Knopf mit
//                wechselnder Beschriftung (E1, APG-Karussell): „Automatische
//                Wiedergabe anhalten" / „… fortsetzen" (en: „Pause/Resume
//                automatic playback") nach lang wie multiselect, am Bauteil
//                ueberschreibbar per data-text-pause / data-text-play.
//                data-playing="true|false" am Knopf waehlt das Symbol (CSS).
//   Handwahl     Klick oder Taste auf einem Tab beendet die Rotation
//                dauerhaft (E1) — weiter nur ueber den Knopf.
//   Ruhe         Maus ueber dem Block oder Fokus im Block (ausser auf dem
//                Knopf) halten den Takt an und setzen .is-paused (der
//                Fortschrittsbalken haelt mit); danach laeuft die Restzeit.
//                Ausser Sicht (IntersectionObserver, 30 %) ruht der Takt
//                ebenso. Gestoppt: .is-stopped (kein Balken).
//   Reduzierte Bewegung  kein Autoplay, der Knopf ist [hidden].
//
// Ereignisse: `solution-tabs-change` { value, previousValue } (id des Tabs,
// sonst sein Text) bei jedem Tabwechsel; `solution-tabs-autoplay`
// { playing, reason } wenn die Rotation anlaeuft oder ruht — reason
// "knopf" | "wahl" | "hover" | "fokus" | "ausser-sicht" (der Ausloeser).
// ==========================================================================
import { sende, zielFuerTaste } from './kern.js'

const TEXTE = {
  de: { pause: 'Automatische Wiedergabe anhalten', play: 'Automatische Wiedergabe fortsetzen' },
  en: { pause: 'Pause automatic playback', play: 'Resume automatic playback' }
}

// Symbole fuer einen angelegten Knopf (das Twig rendert dieselben)
const SYMBOL = '<svg class="nc-solution-tabs__autoplay-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
  '<path class="nc-solution-tabs__autoplay-pause" d="M4 2.5h3v11H4zM9 2.5h3v11H9z"/>' +
  '<path class="nc-solution-tabs__autoplay-play" d="M4.5 2.2 13.5 8l-9 5.8z"/></svg>'

const VORGABE_MS = 7000

/** Sprache: lang am Bauteil oder Vorfahren; de (auch ohne Angabe) oder en
 * @param {HTMLElement} el */
function spracheVon (el) {
  const lang = (el.closest('[lang]')?.getAttribute('lang') || '').trim().toLowerCase()
  return !lang || lang === 'de' || lang.startsWith('de-') ? 'de' : 'en'
}

/** Dauer eines Schritts in ms aus --nc-solution-tabs-autoplay-duration („7s", „700ms")
 * @param {HTMLElement} wurzel */
export function taktDauer (wurzel) {
  const ansicht = wurzel.ownerDocument.defaultView
  let roh = ''
  try { roh = ansicht?.getComputedStyle(wurzel).getPropertyValue('--nc-solution-tabs-autoplay-duration') || '' } catch { roh = '' }
  if (!roh.trim()) roh = wurzel.style.getPropertyValue('--nc-solution-tabs-autoplay-duration')
  const m = /^\s*([\d.]+)\s*(ms|s)?\s*$/.exec(roh || '')
  if (!m) return VORGABE_MS
  const zahl = parseFloat(m[1])
  if (!(zahl > 0)) return VORGABE_MS
  return m[2] === 'ms' ? zahl : zahl * 1000
}

/** @param {HTMLElement} wurzel */
function reduzierteBewegung (wurzel) {
  const ansicht = wurzel.ownerDocument.defaultView
  return !!ansicht?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
}

export const solutionTabs = {
  id: 'solution-tabs',
  selektor: '.nc-solution-tabs',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const liste = /** @type {HTMLElement|null} */ (wurzel.querySelector(':scope > .nc-solution-tabs__tablist'))
    if (!liste) return
    const dok = wurzel.ownerDocument
    const ansicht = dok.defaultView || window
    const tabs = () => /** @type {HTMLElement[]} */ ([...liste.querySelectorAll('.nc-solution-tabs__tab')])
    const vertikal = liste.getAttribute('aria-orientation') === 'vertical' || wurzel.classList.contains('nc-solution-tabs--vertical')
    const panelVon = (tab) => {
      const id = tab.getAttribute('aria-controls')
      return id ? /** @type {HTMLElement|null} */ (wurzel.querySelector('#' + CSS.escape(id))) : null
    }
    const wertVon = (tab) => tab.id || (tab.textContent || '').trim()
    const gewaehlt = () => tabs().find((t) => t.getAttribute('aria-selected') === 'true') || null

    /** Zustand setzen (ohne Ereignis) */
    function zeige (tab) {
      for (const t of tabs()) {
        const an = t === tab
        t.setAttribute('aria-selected', String(an))
        t.tabIndex = an ? 0 : -1
        const panel = panelVon(t)
        if (panel) { panel.classList.toggle('is-active', an); panel.hidden = !an }
      }
    }

    // Anfang: der gewaehlte Tab (sonst der erste) — wandernder tabindex
    const erster = gewaehlt() || tabs()[0]
    if (erster) zeige(erster)

    function waehle (tab, fokus) {
      const vorher = gewaehlt()
      if (fokus) tab.focus()
      if (vorher === tab) return
      zeige(tab)
      sende(wurzel, 'solution-tabs-change', { value: wertVon(tab), previousValue: vorher ? wertVon(vorher) : null })
    }

    // --- Autoplay -----------------------------------------------------------
    const autoplay = wurzel.dataset.autoplay === 'on'
    const reduziert = reduzierteBewegung(wurzel)
    let knopf = /** @type {HTMLButtonElement|null} */ (wurzel.querySelector(':scope > .nc-solution-tabs__autoplay'))
    const knopfVorher = knopf ? { hidden: knopf.hidden, html: knopf.innerHTML, playing: knopf.getAttribute('data-playing') } : null
    let angelegt = false

    if (!autoplay || reduziert) {
      if (knopf) knopf.hidden = true
      bindeTabs(() => {})
      signal.addEventListener('abort', () => { if (knopf && knopfVorher) knopf.hidden = knopfVorher.hidden })
      return
    }

    if (!knopf) {
      knopf = dok.createElement('button')
      knopf.type = 'button'
      knopf.className = 'nc-solution-tabs__autoplay'
      knopf.innerHTML = SYMBOL + '<span class="nc-solution-tabs__autoplay-label"></span>'
      wurzel.insertBefore(knopf, liste)
      angelegt = true
    }
    const k = knopf
    k.hidden = false
    const texte = TEXTE[spracheVon(wurzel)]
    const textPause = k.dataset.textPause || texte.pause
    const textPlay = k.dataset.textPlay || texte.play
    let beschriftung = /** @type {HTMLElement|null} */ (k.querySelector('.nc-solution-tabs__autoplay-label'))
    if (!beschriftung) {
      beschriftung = dok.createElement('span')
      beschriftung.className = 'nc-solution-tabs__autoplay-label'
      k.append(beschriftung)
    }
    const label = beschriftung

    const dauer = taktDauer(wurzel)
    let laeuft = true // Wunsch: Rotation an (Knopf, Handwahl schalten ab)
    let maus = false
    let fokus = false
    // globalThis zuerst: Timer und Beobachter wie im Rest des Pakets (toast.js)
    const Beobachter = /** @type {any} */ (globalThis).IntersectionObserver || /** @type {any} */ (ansicht).IntersectionObserver
    let sichtbar = typeof Beobachter !== 'function'
    let spielt = false // tatsaechlich im Takt
    /** @type {any} */
    let timer = 0
    let rest = dauer
    let start = 0

    function zeigeKnopf () {
      k.setAttribute('data-playing', String(laeuft))
      label.textContent = laeuft ? textPause : textPlay
      wurzel.classList.toggle('is-stopped', !laeuft)
    }

    function schritt () {
      timer = 0
      const alle = tabs()
      const jetzt = gewaehlt()
      const naechster = alle[(alle.indexOf(/** @type {HTMLElement} */ (jetzt)) + 1) % alle.length]
      if (naechster) waehle(naechster, false)
      rest = dauer
      plane()
    }

    function plane () {
      clearTimeout(timer)
      start = Date.now()
      timer = setTimeout(schritt, rest)
    }

    /**
     * Effektiven Zustand neu bestimmen; Ereignis bei Wechsel (Knopf und
     * Handwahl melden immer, auch wenn der Takt schon ruhte).
     * @param {string} grund @param {boolean} [immer]
     */
    function stimme (grund, immer = false) {
      const soll = laeuft && !maus && !fokus && sichtbar
      wurzel.classList.toggle('is-paused', laeuft && !soll)
      if (soll === spielt) {
        if (immer) sende(wurzel, 'solution-tabs-autoplay', { playing: soll, reason: grund })
        return
      }
      spielt = soll
      if (soll) plane()
      else {
        clearTimeout(timer)
        timer = 0
        rest = Math.max(0, rest - (Date.now() - start))
      }
      sende(wurzel, 'solution-tabs-autoplay', { playing: soll, reason: grund })
    }

    /** Rotation dauerhaft an/aus (Knopf, Handwahl). @param {boolean} an @param {string} grund */
    function schalte (an, grund) {
      if (laeuft === an) return
      laeuft = an
      if (an) {
        rest = dauer // neuer Durchlauf, der Balken beginnt von vorn
        // Wer abspielt, will es sehen: Maus und Fokus auf dem Knopf halten nicht an
        maus = false
        fokus = false
      }
      zeigeKnopf()
      stimme(grund, true)
    }

    zeigeKnopf()
    k.addEventListener('click', () => schalte(!laeuft, 'knopf'), { signal })
    bindeTabs(() => schalte(false, 'wahl'))

    wurzel.addEventListener('mouseenter', () => { maus = true; stimme('hover') }, { signal })
    wurzel.addEventListener('mouseleave', () => { maus = false; stimme('hover') }, { signal })
    // Fokus auf dem Knopf zaehlt nicht: dort steuert man die Rotation
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
      wurzel.classList.remove('is-paused', 'is-stopped')
      if (angelegt) k.remove()
      else if (knopfVorher) {
        k.hidden = knopfVorher.hidden
        k.innerHTML = knopfVorher.html
        if (knopfVorher.playing === null) k.removeAttribute('data-playing')
        else k.setAttribute('data-playing', knopfVorher.playing)
      }
    })

    // --- Tabs ---------------------------------------------------------------
    /** @param {() => void} handwahl */
    function bindeTabs (handwahl) {
      liste.addEventListener('click', (e) => {
        const tab = /** @type {HTMLElement} */ (e.target).closest?.('.nc-solution-tabs__tab')
        if (!tab || !liste.contains(tab)) return
        handwahl()
        waehle(/** @type {HTMLElement} */ (tab), false)
      }, { signal })

      liste.addEventListener('keydown', (e) => {
        const tab = /** @type {HTMLElement} */ (e.target).closest?.('.nc-solution-tabs__tab')
        if (!tab || !liste.contains(tab)) return
        const ziel = zielFuerTaste(e.key, tabs(), tab, vertikal ? 'vertikal' : 'horizontal')
        if (!ziel) return
        e.preventDefault()
        handwahl()
        waehle(ziel, true)
      }, { signal })
    }
  }
}
