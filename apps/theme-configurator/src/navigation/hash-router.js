// ==========================================================================
// Hash-Router: activeSection ↔ location.hash (Plan v2, 3.4)
// ==========================================================================
// URL-Schema (aus der Sektions-ID abgeleitet, Trennung am ersten '-'):
//
//   foundation-typography   →  #/foundation/typography
//   component-button        →  #/component/button
//   component-code-snippet  →  #/component/code-snippet
//   template-dashboard      →  #/template/dashboard
//
// Optional haengen Theme-Set und Vorschaumodus als Query am Hash, aber nur
// wenn sie vom Standard abweichen (Set 'neo', Modus 'light'):
//
//   #/component/button?set=customer&modus=dark
//
// Regeln:
// - Sektionswechsel legen einen History-Eintrag an (pushState) → Zurueck/Vor
//   im Browser wechseln die Sektion. Set-/Modus-Wechsel ersetzen den
//   aktuellen Eintrag (replaceState).
// - Beim Start gewinnt ein gueltiger Hash vor dem gespeicherten Stand; ohne
//   Hash bleibt der gespeicherte Stand und wird in die URL geschrieben.
// - Unbekannte Sektion (#/foo/bar) → Startsektion, ohne Fehler.
// - Hashes, die nicht mit '#/' beginnen (Sprungmarken wie href="#"), werden
//   nach dem Start ignoriert; die URL wird auf den aktuellen Stand gesetzt.
// ==========================================================================

import { watch } from 'vue'
import { START_SEKTION, istNavigationsSektion } from './sektions-ids.js'

export const VORSCHAU_MODI = Object.freeze(['light', 'dark', 'split', 'matrix'])
const STANDARD_SET = 'neo'
const STANDARD_MODUS = 'light'

function dekodiere (teil) {
  try {
    return decodeURIComponent(teil)
  } catch {
    return null
  }
}

/** 'component-button' → '/component/button' */
export function sektionZuPfad (id) {
  const trenner = id.indexOf('-')
  if (trenner < 0) return '/' + encodeURIComponent(id)
  return '/' + encodeURIComponent(id.slice(0, trenner)) + '/' + encodeURIComponent(id.slice(trenner + 1))
}

/** '/component/button' → 'component-button'; alles andere → null */
export function pfadZuSektion (pfad) {
  const teile = String(pfad || '').split('/').filter(Boolean).map(dekodiere)
  if (teile.length !== 2 || teile.some((t) => !t)) return null
  return teile[0] + '-' + teile[1]
}

/**
 * Zerlegt einen Hash. `istRoute` ist false fuer Hashes ohne '#/' (leer oder
 * Sprungmarke) — die gehoeren nicht dem Router.
 * @param {string} hash z. B. '#/component/button?set=customer'
 * @returns {{ istRoute: boolean, sektion: string|null, set: string|null, modus: string|null }}
 */
export function hashZuRoute (hash) {
  const roh = String(hash || '').replace(/^#/, '')
  if (!roh.startsWith('/')) return { istRoute: false, sektion: null, set: null, modus: null }
  const frage = roh.indexOf('?')
  const pfad = frage < 0 ? roh : roh.slice(0, frage)
  const params = new URLSearchParams(frage < 0 ? '' : roh.slice(frage + 1))
  return { istRoute: true, sektion: pfadZuSektion(pfad), set: params.get('set'), modus: params.get('modus') }
}

/** { sektion, set, modus } → '#/…' (Set/Modus nur, wenn nicht Standard) */
export function routeZuHash ({ sektion, set, modus } = {}) {
  const params = new URLSearchParams()
  if (set && set !== STANDARD_SET) params.set('set', set)
  if (modus && modus !== STANDARD_MODUS) params.set('modus', modus)
  const query = params.toString()
  return '#' + sektionZuPfad(sektion || START_SEKTION) + (query ? '?' + query : '')
}

/**
 * Verbindet den Theme-Store mit location.hash. Nach loadFromStorage()
 * aufrufen, damit der Hash den gespeicherten Stand ueberschreibt.
 * @param {object} store Theme-Store (state, setActiveSection, setActiveThemeSet, setPreviewMode)
 * @param {object} [optionen]
 * @param {Window} [optionen.fenster] fuer Tests
 * @param {(id: string) => boolean} [optionen.istBekannt] gueltige Sektionen
 * @param {string} [optionen.start] Startsektion bei unbekanntem Hash
 * @returns {() => void} beendet den Router (Listener + Watcher)
 */
export function starteHashRouter (store, optionen = {}) {
  const fenster = optionen.fenster || window
  const istBekannt = optionen.istBekannt || istNavigationsSektion
  const start = optionen.start || START_SEKTION
  const state = store.state

  const gueltigesSet = (s) => !!s && !!state.themes && Object.prototype.hasOwnProperty.call(state.themes, s)
  const gueltigerModus = (m) => VORSCHAU_MODI.includes(m)

  function aktuellerHash () {
    return routeZuHash({ sektion: state.activeSection, set: state.activeThemeSet, modus: state.previewMode })
  }

  function schreibeHash (ersetzen) {
    const ziel = aktuellerHash()
    if (fenster.location.hash === ziel) return
    const url = fenster.location.pathname + fenster.location.search + ziel
    if (ersetzen) fenster.history.replaceState(fenster.history.state, '', url)
    else fenster.history.pushState(null, '', url)
  }

  function uebernimmRoute (route) {
    const ziel = route.sektion && istBekannt(route.sektion) ? route.sektion : start
    if (ziel !== state.activeSection) store.setActiveSection(ziel)
    if (gueltigesSet(route.set) && route.set !== state.activeThemeSet) store.setActiveThemeSet(route.set)
    if (gueltigerModus(route.modus) && route.modus !== state.previewMode) store.setPreviewMode(route.modus)
  }

  // Merkt die Sektion, die zuletzt in der URL stand: nur echte Sektionswechsel
  // bekommen einen neuen History-Eintrag.
  let letzteSektion

  // 1. Start: Hash gewinnt vor gespeichertem Stand
  const startRoute = hashZuRoute(fenster.location.hash)
  if (startRoute.istRoute || fenster.location.hash.replace(/^#/, '') !== '') {
    uebernimmRoute(startRoute)
  }
  schreibeHash(true)
  letzteSektion = state.activeSection

  // 2. Zurueck/Vor und Hash-Eingaben
  function beiNavigation () {
    const route = hashZuRoute(fenster.location.hash)
    if (route.istRoute) uebernimmRoute(route)
    letzteSektion = state.activeSection
    schreibeHash(true)
  }
  fenster.addEventListener('hashchange', beiNavigation)
  fenster.addEventListener('popstate', beiNavigation)

  // 3. Store → URL
  const stoppeWatch = watch(
    () => [state.activeSection, state.activeThemeSet, state.previewMode],
    () => {
      const neueSektion = state.activeSection !== letzteSektion
      letzteSektion = state.activeSection
      schreibeHash(!neueSektion)
    }
  )

  return function stoppeHashRouter () {
    stoppeWatch()
    fenster.removeEventListener('hashchange', beiNavigation)
    fenster.removeEventListener('popstate', beiNavigation)
  }
}
