// @ts-check
// Theme-Store · Gespeicherte Themes, NEO-Defaults vom Server, Downloads
// (aufgeteilt aus stores/theme.js, Plan v2 3.3a — Verhalten unveraendert)

import { primitiveColors, semanticDefaults } from '../../data/tokens.js'
import { downloadDrupalBundle } from '../../export/drupal-adapter.js'
import { toRaw } from 'vue'
import { exportAsCSSVars, exportAsJSON } from './export.js'
import { deepClone, getDefaultFoundation, state } from './kern.js'
import { THEME_DATA_KEYS, applyThemeData, snapshotThemeData } from './verlauf.js'
import { importVorschau, importZiel, pruefeThemeImport } from '../../import/theme-import.js'
import { SpeicherFehler, darf, pruefeKontrast, speicher } from '../../speicher/index.js'
import { standardDaten } from '../../speicher/standard.js'
import { alsEtag } from '../../speicher/inhalts-hash.js'
import { leseKatalog, leseTheme, loescheTheme, schreibeKatalog, schreibeTheme } from '../../speicher/lokal.js'

// ---------------------------------------------------------------------------
// Theme Management — Create, Load, Save, Delete
// ---------------------------------------------------------------------------

export function generateThemeId() {
  return 'theme-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
}

export function getThemeSnapshot() {
  return snapshotThemeData({ withActiveSet: true })
}

export function loadSavedThemesList() {
  try {
    const list = leseKatalog()
    if (list !== null) {
      state.savedThemes = Array.isArray(list) ? list : []
    }
  } catch (e) {
    console.warn('Failed to load saved themes list:', e)
    state.savedThemes = []
  }
}

export function persistSavedThemesList() {
  try {
    schreibeKatalog(toRaw(state.savedThemes))
  } catch (e) {
    console.warn('Failed to persist saved themes list:', e)
  }
}

/**
 * Create a new theme — saves current state under a new name.
 * @param {string} name   — Theme name (e.g. "My Brand Theme")
 * @param {string} version — Semantic version (e.g. "1.0.0")
 * @returns {object} The created theme metadata
 */
export function createTheme(name, version = '1.0.0') {
  const id = generateThemeId()
  const now = new Date().toISOString()
  const meta = { id, name, version, createdAt: now, updatedAt: now }

  // Save the full snapshot
  const snapshot = getThemeSnapshot()
  snapshot.meta = meta
  try {
    schreibeTheme(id, snapshot)
  } catch (e) {
    console.warn('Failed to save theme data:', e)
    return null
  }

  // Add to catalogue
  state.savedThemes.push(meta)
  persistSavedThemesList()

  // Set as current
  state.currentThemeMeta = meta
  state.version = version

  return meta
}

/**
 * Save (overwrite) the currently loaded theme.
 * If no theme is loaded, creates a new one with the given name.
 */
export function saveCurrentTheme(name, version) {
  if (!state.currentThemeMeta) {
    return createTheme(name || 'Untitled Theme', version || '1.0.0')
  }

  const meta = state.currentThemeMeta
  if (name) meta.name = name
  if (version) meta.version = version
  meta.updatedAt = new Date().toISOString()

  // Overwrite snapshot
  const snapshot = getThemeSnapshot()
  snapshot.meta = deepClone(meta)
  try {
    schreibeTheme(meta.id, snapshot)
  } catch (e) {
    console.warn('Failed to save theme data:', e)
  }

  // Update catalogue entry
  const idx = state.savedThemes.findIndex(t => t.id === meta.id)
  if (idx >= 0) state.savedThemes[idx] = deepClone(meta)
  persistSavedThemesList()

  state.version = meta.version
  return meta
}

/**
 * Load a saved theme by its ID.
 */
export function loadTheme(themeId) {
  try {
    const snapshot = leseTheme(themeId)
    if (!snapshot) { console.warn('Theme not found:', themeId); return false }

    applyThemeData(snapshot)

    state.currentThemeMeta = snapshot.meta ? deepClone(snapshot.meta) : null
    if (snapshot.meta?.version) state.version = snapshot.meta.version

    return true
  } catch (e) {
    console.warn('Failed to load theme:', e)
    return false
  }
}

/**
 * Delete a saved theme by its ID.
 * SECURITY: The default NEO Theme (currentThemeMeta === null) can NEVER
 * be deleted. This guard prevents deletion via any code path.
 */
export function deleteTheme(themeId) {
  // Guard 1: Refuse if no themeId provided
  if (!themeId) {
    console.warn('[DELETE GUARD] Cannot delete: no themeId provided')
    return false
  }

  // Guard 2: Refuse if this is the currently loaded NEO default (no meta)
  // This should never happen since the UI disables the button, but belt-and-suspenders
  if (!state.currentThemeMeta) {
    console.warn('[DELETE GUARD] Cannot delete the default NEO Theme')
    return false
  }

  // Guard 3: Check the theme exists in saved list before deleting
  const exists = state.savedThemes.some(t => t.id === themeId)
  if (!exists) {
    console.warn('[DELETE GUARD] Theme not found in saved themes:', themeId)
    return false
  }

  try {
    loescheTheme(themeId)
  } catch {}

  state.savedThemes = state.savedThemes.filter(t => t.id !== themeId)
  persistSavedThemesList()

  // If we just deleted the current theme, revert to NEO defaults
  if (state.currentThemeMeta?.id === themeId) {
    state.currentThemeMeta = null
    state.version = '1.0.0'
  }

  return true
}

/**
 * Load the "Neo Theme" defaults — resets to factory defaults.
 * First tries to fetch the golden master from data/neo-theme-defaults/
 * via the server API. Falls back to in-memory defaults from tokens.js.
 */
export async function loadNeoDefaults() {
  // Try server-side golden master first (secure data folder)
  try {
    // lokal: GET /api/neo-theme-defaults · drupal: GET {basis}/neo-standard
    const d = await speicher().ladeStandard()
    if (d) {
      if (d.themes) {
        state.themes.neo.light = deepClone(d.themes.neo.light)
        state.themes.neo.dark = deepClone(d.themes.neo.dark)
        state.themes.customer.light = deepClone(d.themes.customer.light)
        state.themes.customer.dark = deepClone(d.themes.customer.dark)
      }
      if (d.foundationOverrides) {
        state.foundationOverrides = deepClone(d.foundationOverrides)
      }
      if (d.componentOverrides) {
        state.componentOverrides = deepClone(d.componentOverrides)
      }
      if (d.primitiveOverrides) {
        state.primitiveOverrides = deepClone(d.primitiveOverrides)
      }
      state.customFonts = { neo: [], customer: [] }
      state.focusRingMode = { neo: 'offset', customer: 'offset' }
      state.componentLocks = { neo: {}, customer: {} }
      state.componentVersions = { neo: {}, customer: {} }
      state.variantDefinitions = { neo: {}, customer: {} }
      state.typeScale = { neo: {}, customer: {} }
      state.activeThemeSet = 'neo'
      state.currentThemeMeta = null
      state.version = d._meta?.version || '1.0.0'
      console.log('[RESET] Loaded NEO defaults from secure data folder')
      return
    }
  } catch (err) {
    console.warn('[RESET] Could not fetch server defaults, using in-memory fallback:', err.message)
  }

  // Fallback: in-memory defaults from tokens.js
  state.activeThemeSet = 'neo'
  state.themes.neo.light = deepClone(semanticDefaults['neo-light'])
  state.themes.neo.dark = deepClone(semanticDefaults['neo-dark'])
  state.themes.customer.light = deepClone(semanticDefaults['customer-light'])
  state.themes.customer.dark = deepClone(semanticDefaults['customer-dark'])
  state.foundationOverrides = { neo: deepClone(getDefaultFoundation()), customer: deepClone(getDefaultFoundation()) }
  state.componentOverrides = { neo: {}, customer: {} }
  state.primitiveOverrides = {
    neo: { primary: primitiveColors.primary.base, secondary: primitiveColors.secondary.base, accent: primitiveColors.accent.base },
    customer: { primary: primitiveColors.primary.base, secondary: primitiveColors.secondary.base, accent: primitiveColors.accent.base }
  }
  state.customFonts = { neo: [], customer: [] }
  state.focusRingMode = { neo: 'offset', customer: 'offset' }
  state.componentLocks = { neo: {}, customer: {} }
  state.componentVersions = { neo: {}, customer: {} }
  state.variantDefinitions = { neo: {}, customer: {} }
  state.customSpacingTokens = { neo: {}, customer: {} }
  state.customRadiiTokens = { neo: {}, customer: {} }
  state.customBorderWidthTokens = { neo: {}, customer: {} }
  state.customMediaRatioTokens = { neo: {}, customer: {} }
  state.customShadowTokens = { neo: {}, customer: {} }
  state.customElevationTokens = { neo: {}, customer: {} }
  state.customOpacityTokens = { neo: {}, customer: {} }
  state.customZindexTokens = { neo: {}, customer: {} }
  state.customMotionTokens = { neo: {}, customer: {} }
  state.customMotionEffectTokens = { neo: {}, customer: {} }
  state.iconLibraries = {
    neo: [
      { id: 'tabler', name: 'Tabler Icons', builtIn: true, iconCount: 5254, manifestPath: '/data/icons-manifest.json' },
      { id: 'heroicons', name: 'Heroicons', builtIn: true, iconCount: 324, manifestPath: '/data/icons-manifest-heroicons.json' }
    ],
    customer: [
      { id: 'tabler', name: 'Tabler Icons', builtIn: true, iconCount: 5254, manifestPath: '/data/icons-manifest.json' },
      { id: 'heroicons', name: 'Heroicons', builtIn: true, iconCount: 324, manifestPath: '/data/icons-manifest-heroicons.json' }
    ]
  }
  state.iconStrokeWidths = {
    neo: {
      tabler: { xs: '1', sm: '1.5', md: '1.5', lg: '2', xl: '2', '2xl': '2' },
      heroicons: { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' }
    },
    customer: {
      tabler: { xs: '1', sm: '1.5', md: '1.5', lg: '2', xl: '2', '2xl': '2' },
      heroicons: { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' }
    }
  }
  state.iconStrokeColors = {
    neo: {
      tabler: { light: 'currentColor', dark: 'currentColor' },
      heroicons: { light: 'currentColor', dark: 'currentColor' }
    },
    customer: {
      tabler: { light: 'currentColor', dark: 'currentColor' },
      heroicons: { light: 'currentColor', dark: 'currentColor' }
    }
  }
  state.semanticSpacing = { neo: {}, customer: {} }
  state.semanticTypography = { neo: {}, customer: {} }
  state.typeScale = { neo: {}, customer: {} }
  state.currentThemeMeta = null
  state.version = '1.0.0'
  console.log('[RESET] Loaded NEO defaults from in-memory tokens.js')
}

/**
 * Download theme as JSON file.
 */
export function downloadThemeJSON() {
  const json = exportAsJSON()
  const name = state.currentThemeMeta?.name || (state.activeThemeSet === 'neo' ? 'Neo Theme' : 'Customer Theme')
  const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${safeName}.theme.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Download theme as CSS file.
 */
export function downloadThemeCSS() {
  const css = exportAsCSSVars()
  const name = state.currentThemeMeta?.name || (state.activeThemeSet === 'neo' ? 'Neo Theme' : 'Customer Theme')
  const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
  const blob = new Blob([css], { type: 'text/css' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${safeName}.theme.css`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Download Drupal export bundle (CSS + settings JSON).
 */
export function downloadDrupalExport() {
  const json = exportAsJSON()
  downloadDrupalBundle(json)
}

/**
 * Download DTCG-Datei (W3C Design Tokens). Der Text kommt aus exportAsDTCG(),
 * damit der Export-Dialog vorher die Hinweise zeigen kann.
 */
export function downloadThemeDTCG(text, dateiname = 'theme.tokens.dtcg.json') {
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = dateiname
  a.click()
  URL.revokeObjectURL(url)
}

// ---------------------------------------------------------------------------
// Import (Plan v2, 2.2)
// ---------------------------------------------------------------------------

/** Werkseinstellung eines Theme-Sets (Grundlage fuer fehlende Werte im Import). */
function werkseinstellung(themeSet) {
  const p = themeSet === 'neo' ? 'neo' : 'customer'
  return {
    themes: { light: deepClone(semanticDefaults[`${p}-light`]), dark: deepClone(semanticDefaults[`${p}-dark`]) },
    foundationOverrides: getDefaultFoundation(),
    primitiveOverrides: { primary: primitiveColors.primary.base, secondary: primitiveColors.secondary.base, accent: primitiveColors.accent.base },
  }
}

/**
 * JSON-Text pruefen und die Vorschau fuer das aktive Theme-Set berechnen.
 * Veraendert nichts.
 * @returns {{ ok, fehler: string[], meta, ziel, vorschau }}
 */
export function pruefeImport(text) {
  const erg = pruefeThemeImport(text)
  if (!erg.ok) return { ...erg, ziel: null, vorschau: [] }
  const themeSet = state.activeThemeSet
  const ziel = importZiel(erg.daten, werkseinstellung(themeSet))
  const aktuell = {}
  for (const k of Object.keys(ziel)) aktuell[k] = state[k]?.[themeSet]
  return { ...erg, ziel, vorschau: importVorschau(ziel, aktuell) }
}

/**
 * Geprueften Import in das aktive Theme-Set uebernehmen — EINE Aktion,
 * also ein Undo-Schritt (VERLAUF_AKTIONEN).
 * @param {object} ziel  pruefeImport(text).ziel
 */
export function importTheme(ziel) {
  if (!ziel || typeof ziel !== 'object') return false
  const themeSet = state.activeThemeSet
  for (const [k, v] of Object.entries(ziel)) {
    if (!THEME_DATA_KEYS.includes(k)) continue
    state[k][themeSet] = deepClone(v)
  }
  return true
}

// ---------------------------------------------------------------------------
// Speicher-Abstraktion (Plan v2, 2.6)
// ---------------------------------------------------------------------------
// Asynchrone Gegenstuecke zu loadSavedThemesList/loadTheme/saveCurrentTheme,
// die ueber speicher() laufen. Mit dem Standard-Speicher 'lokal' rufen sie
// genau die bisherigen Funktionen auf (Verhalten unveraendert). Mit 'drupal'
// sprechen sie die REST-Schnittstelle (docs/api/theme-konfigurator.openapi.yaml,
// ADR-002) und fuehren den Inhalts-Hash als currentThemeMeta.etag mit.
// Drupal speichert Config Entities ohne Revisionen — es gibt kein
// Zuruecksetzen auf fruehere Staende im Server (lokal bleiben Branches und
// Releases). Konflikte (409/412) werden als SpeicherFehler (istKonflikt)
// weitergeworfen; die Oberflaeche laesst neu laden und entscheiden.

const istLokal = () => speicher().art === 'lokal'

function brauchtRecht(recht, was) {
  if (!darf(recht)) throw new SpeicherFehler('verboten', `${was}: Dafür fehlt die Berechtigung „${recht}“.`)
}

/** Antwort des Speichers als aktuelles Theme uebernehmen (Meta + ETag, Katalog). */
function uebernehmeMeta(erg) {
  const meta = { ...deepClone(erg.meta), etag: erg.etag ?? null }
  state.currentThemeMeta = meta
  if (meta.version) state.version = meta.version
  const idx = state.savedThemes.findIndex(t => t.id === meta.id)
  if (idx >= 0) state.savedThemes[idx] = deepClone(meta)
  else state.savedThemes.push(deepClone(meta))
}

/** Katalog laden (lokal: localStorage, drupal: GET …/themes inkl. `aktiv`). */
export async function ladeThemeKatalog() {
  if (istLokal()) {
    loadSavedThemesList()
    return state.savedThemes
  }
  state.savedThemes = await speicher().liste()
  return state.savedThemes
}

/**
 * Theme oeffnen (lokal: loadTheme). Ein Undo-Schritt (VERLAUF_AKTIONEN).
 * Drupal liefert Abweichungen; der Adapter fuehrt sie mit dem aktuellen
 * NEO-Standard zusammen.
 */
export async function oeffneTheme(themeId) {
  if (istLokal()) return loadTheme(themeId)
  const erg = await speicher().lade(themeId)
  if (!erg) { console.warn('Theme not found:', themeId); return false }
  applyThemeData(erg.daten)
  uebernehmeMeta(erg)
  return true
}

/**
 * Aktuelles Theme speichern (lokal: saveCurrentTheme). Mit Drupal (Recht
 * „bearbeiten“): ohne Theme-ID wird angelegt, sonst mit If-Match (Inhalts-
 * Hash) gespeichert. Der Adapter sendet nur die Abweichungen vom Standard.
 */
export async function speichereTheme(name, version) {
  if (istLokal()) return saveCurrentTheme(name, version)
  brauchtRecht('bearbeiten', 'Speichern')
  const alt = state.currentThemeMeta ? deepClone(state.currentThemeMeta) : {}
  const { etag, ...rest } = alt
  const meta = {
    ...rest,
    name: name || rest.name || 'Untitled Theme',
    version: version || rest.version || state.version || '1.0.0',
  }
  const erg = await speicher().speichere({ meta, daten: getThemeSnapshot(), etag })
  uebernehmeMeta(erg)
  return state.currentThemeMeta
}

/** Kontrast der semantischen Paare des Theme-Sets (hell + dunkel). */
export function pruefeThemeKontrast(themeSet = state.activeThemeSet) {
  return pruefeKontrast(toRaw(state.themes[themeSet]))
}

/**
 * Gespeichertes Theme veroeffentlichen (Recht „veroeffentlichen“). Die
 * Kontrast-Pruefung ist das Tor: nicht bestanden -> SpeicherFehler('ungueltig')
 * ohne Serveraufruf. Ein Uebergehen gibt es nicht (Frage 2). Die App schickt
 * ihr Ergebnis und das CSS (exportAsCSSVars) mit; der Server prueft den
 * Kontrast verbindlich selbst (422) und legt das CSS dort ab, wo der
 * Library-Override des Frontend-Themes es erwartet (Frage 6).
 *
 * @param {{ notiz?: string }} [optionen]
 */
export async function veroeffentlicheTheme({ notiz } = {}) {
  const sp = speicher()
  if (!sp.faehigkeiten.veroeffentlichen) {
    throw new SpeicherFehler('nicht-unterstuetzt', 'Veroeffentlichen gibt es nur mit Drupal-Speicher.')
  }
  brauchtRecht('veroeffentlichen', 'Veröffentlichen')
  const meta = state.currentThemeMeta
  if (!meta?.id || !meta.etag) {
    throw new SpeicherFehler('ungueltig', 'Bitte das Theme zuerst speichern.')
  }
  const kontrast = pruefeThemeKontrast()
  if (!kontrast.bestanden) {
    throw new SpeicherFehler('ungueltig', 'Kontrast-Prüfung nicht bestanden — Veröffentlichen gesperrt.', { details: kontrast })
  }
  const erg = await sp.veroeffentliche(meta.id, { etag: meta.etag, kontrast, css: exportAsCSSVars(), notiz })
  if (erg?.meta) uebernehmeMeta(erg)
  return { ...erg, kontrast }
}

/**
 * Theme aktivieren (nur Drupal, Recht „veroeffentlichen“): genau eines ist
 * aktiv; der Server liefert dessen veroeffentlichtes CSS aus. Gibt die neue
 * Liste zurueck (mit `aktiv`).
 */
export async function aktiviereTheme(themeId = state.currentThemeMeta?.id) {
  const sp = speicher()
  if (!sp.faehigkeiten.aktivieren) {
    throw new SpeicherFehler('nicht-unterstuetzt', 'Aktivieren gibt es nur mit Drupal-Speicher.')
  }
  brauchtRecht('veroeffentlichen', 'Aktivieren')
  if (!themeId) throw new SpeicherFehler('ungueltig', 'Kein Theme gewählt.')
  state.savedThemes = await sp.aktiviere(themeId)
  return state.savedThemes
}

/**
 * Neues Theme in Drupal anlegen, ausgehend vom NEO-Standard (Recht
 * „bearbeiten“). Die App-Daten werden auf den vollständigen Standard
 * gesetzt (beide Sets, Set „customer“ aktiv — ein Kunden-Theme) und als
 * neues Theme gespeichert (POST, Abweichungen = leer bis auf das Set).
 * Ein Undo-Schritt (VERLAUF_AKTIONEN).
 */
export async function legeThemeAusStandardAn(name, version = '1.0.0') {
  const sp = speicher()
  if (sp.art === 'lokal') return createTheme(name, version)
  brauchtRecht('bearbeiten', 'Neu anlegen')
  const datei = await sp.ladeStandard()
  applyThemeData({ ...standardDaten(datei), activeThemeSet: 'customer' })
  state.currentThemeMeta = null
  state.version = version
  return speichereTheme(name, version)
}

/**
 * Gespeichertes Theme in Drupal löschen (Recht „bearbeiten“). If-Match ist
 * der Inhalts-Hash aus dem Katalog; das aktive Theme lehnt der Server ab
 * (409). War es das geöffnete Theme, arbeitet die App danach ohne
 * Drupal-Theme weiter (Daten bleiben, bis etwas anderes geöffnet wird).
 */
export async function loescheGespeichertesTheme(themeId) {
  const sp = speicher()
  if (sp.art === 'lokal') return deleteTheme(themeId)
  brauchtRecht('bearbeiten', 'Löschen')
  const eintrag = state.savedThemes.find(t => t.id === themeId)
  if (!eintrag) throw new SpeicherFehler('nicht-gefunden', 'Das Theme wurde nicht gefunden.')
  if (eintrag.aktiv) throw new SpeicherFehler('konflikt', 'Das aktive Theme kann nicht gelöscht werden.')
  const etag = state.currentThemeMeta?.id === themeId && state.currentThemeMeta.etag
    ? state.currentThemeMeta.etag
    : (eintrag.hash ? alsEtag(eintrag.hash) : null)
  await sp.loesche(themeId, { etag })
  state.savedThemes = state.savedThemes.filter(t => t.id !== themeId)
  if (state.currentThemeMeta?.id === themeId) {
    state.currentThemeMeta = null
  }
  return true
}
