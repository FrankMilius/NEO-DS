// Theme-Store · Gespeicherte Themes, NEO-Defaults vom Server, Downloads
// (aufgeteilt aus stores/theme.js, Plan v2 3.3a — Verhalten unveraendert)

import { primitiveColors, semanticDefaults } from '../../data/tokens.js'
import { downloadDrupalBundle } from '../../export/drupal-adapter.js'
import { toRaw } from 'vue'
import { exportAsCSSVars, exportAsJSON } from './export.js'
import { SAVED_THEMES_KEY, deepClone, getDefaultFoundation, state } from './kern.js'
import { THEME_DATA_KEYS, applyThemeData, snapshotThemeData } from './verlauf.js'
import { importVorschau, importZiel, pruefeThemeImport } from '../../import/theme-import.js'

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
    const raw = localStorage.getItem(SAVED_THEMES_KEY)
    if (raw) {
      const list = JSON.parse(raw)
      state.savedThemes = Array.isArray(list) ? list : []
    }
  } catch (e) {
    console.warn('Failed to load saved themes list:', e)
    state.savedThemes = []
  }
}

export function persistSavedThemesList() {
  try {
    localStorage.setItem(SAVED_THEMES_KEY, JSON.stringify(toRaw(state.savedThemes)))
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
    localStorage.setItem(`neo-theme-${id}`, JSON.stringify(snapshot))
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
    localStorage.setItem(`neo-theme-${meta.id}`, JSON.stringify(snapshot))
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
    const raw = localStorage.getItem(`neo-theme-${themeId}`)
    if (!raw) { console.warn('Theme not found:', themeId); return false }

    const snapshot = JSON.parse(raw)
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
    localStorage.removeItem(`neo-theme-${themeId}`)
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
    const res = await fetch('/api/neo-theme-defaults')
    if (res.ok) {
      const data = await res.json()
      if (data.status === 'ok' && data.defaults) {
        const d = data.defaults
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
