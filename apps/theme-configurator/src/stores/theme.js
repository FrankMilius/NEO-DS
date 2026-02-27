// ==========================================================================
// NEO Theme Configurator — Global Theme Store
// ==========================================================================
// Reactive state management using Vue 3 Composition API.
// Manages the themeObject, current selections, and undo history.
// ==========================================================================

import { reactive, computed, watch, toRaw } from 'vue'
import {
  semanticDefaults,
  primitiveColors,
  foundationTokens,
  componentTokenGroups,
  semanticTokenGroups
} from '../data/tokens.js'

// ---------------------------------------------------------------------------
// Valid token ID sets (for pruning stale localStorage overrides)
// ---------------------------------------------------------------------------
const _validComponentTokenIds = new Set(
  componentTokenGroups.flatMap(g => g.tokens.map(t => t.id))
)
const _readonlyTokenIds = new Set(
  componentTokenGroups.flatMap(g => g.tokens.filter(t => t.readonly).map(t => t.id))
)
const _validSemanticTokenIds = new Set(
  semanticTokenGroups.flatMap(g => g.tokens.map(t => t.id))
)

// ---------------------------------------------------------------------------
// Deep-clone helper
// ---------------------------------------------------------------------------
function deepClone(obj) {
  return JSON.parse(JSON.stringify(toRaw(obj)))
}

// ---------------------------------------------------------------------------
// Saved Themes storage key
// ---------------------------------------------------------------------------
const SAVED_THEMES_KEY = 'neo-theme-configurator-saved-themes'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const state = reactive({
  // Which theme set: 'neo' or 'customer'
  activeThemeSet: 'neo',

  // Light / Dark preview mode
  previewMode: 'light',

  // Current navigation section
  activeSection: 'foundation-colors',

  // Selected token for inspector
  selectedToken: null,

  // Version tag
  version: '1.0.0',

  // The full theme objects for both sets
  themes: {
    neo: {
      light: deepClone(semanticDefaults['neo-light']),
      dark: deepClone(semanticDefaults['neo-dark'])
    },
    customer: {
      light: deepClone(semanticDefaults['customer-light']),
      dark: deepClone(semanticDefaults['customer-dark'])
    }
  },

  // Foundation token overrides per theme set
  foundationOverrides: {
    neo: deepClone(getDefaultFoundation()),
    customer: deepClone(getDefaultFoundation())
  },

  // Component token overrides per theme set
  componentOverrides: {
    neo: {},
    customer: {}
  },

  // Primitive color overrides per theme set
  primitiveOverrides: {
    neo: {
      primary: primitiveColors.primary.base,
      secondary: primitiveColors.secondary.base,
      accent: primitiveColors.accent.base
    },
    customer: {
      primary: primitiveColors.primary.base,
      secondary: primitiveColors.secondary.base,
      accent: primitiveColors.accent.base
    }
  },

  // Custom font families per theme set
  // Each entry: { id, name, family, url }
  customFonts: {
    neo: [],
    customer: []
  },

  // Focus Ring Mode: 'offset' (aussen, Default) oder 'inset' (innen)
  focusRingMode: {
    neo: 'offset',
    customer: 'offset'
  },

  // Undo history
  history: [],
  historyIndex: -1,

  // ---------------------------------------------------------------------------
  // Theme Management
  // ---------------------------------------------------------------------------
  // Currently loaded theme metadata (null = working on defaults)
  currentThemeMeta: null,

  // List of saved themes [{id, name, version, createdAt, updatedAt}]
  savedThemes: []
})

// ---------------------------------------------------------------------------
// Default foundation values
// ---------------------------------------------------------------------------

function getDefaultFoundation() {
  const result = {}
  for (const [category, data] of Object.entries(foundationTokens)) {
    result[category] = {}
    if (!data.tokens) continue
    for (const [key, token] of Object.entries(data.tokens)) {
      result[category][key] = token.value
    }
  }
  return result
}

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------

const currentThemeKey = computed(() => {
  return `${state.activeThemeSet}-${state.previewMode}`
})

const currentThemeId = computed(() => {
  const map = {
    'neo-light': 'neo-light-theme',
    'neo-dark': 'neo-dark-theme',
    'customer-light': 'customer-light-theme',
    'customer-dark': 'customer-dark-theme'
  }
  return map[currentThemeKey.value]
})

const currentSemanticTokens = computed(() => {
  return state.themes[state.activeThemeSet][state.previewMode]
})

const currentFoundation = computed(() => {
  return state.foundationOverrides[state.activeThemeSet]
})

const currentComponentOverrides = computed(() => {
  return state.componentOverrides[state.activeThemeSet]
})

const currentPrimitives = computed(() => {
  return state.primitiveOverrides[state.activeThemeSet]
})

const currentCustomFonts = computed(() => {
  return state.customFonts[state.activeThemeSet]
})

const currentFocusRingMode = computed(() => {
  return state.focusRingMode[state.activeThemeSet]
})

const isDirty = computed(() => {
  // Check if customer theme differs from neo defaults
  if (state.activeThemeSet === 'customer') {
    const custLight = JSON.stringify(state.themes.customer.light)
    const defLight = JSON.stringify(semanticDefaults['customer-light'])
    return custLight !== defLight
  }
  return false
})

/**
 * True when the user is working on the factory NEO Theme defaults
 * (no custom theme loaded). This theme cannot be deleted.
 */
const isNeoDefault = computed(() => {
  return state.activeThemeSet === 'neo' && state.currentThemeMeta === null
})

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

function setActiveThemeSet(themeSet) {
  state.activeThemeSet = themeSet
}

function setPreviewMode(mode) {
  state.previewMode = mode
}

function setActiveSection(sectionId) {
  state.activeSection = sectionId
}

function selectToken(token) {
  state.selectedToken = token
}

function updateSemanticToken(tokenId, value) {
  const mode = state.previewMode
  const themeSet = state.activeThemeSet
  if (state.themes[themeSet][mode][tokenId] !== undefined) {
    pushHistory()
    state.themes[themeSet][mode][tokenId] = value
  }
}

function setFocusRingMode(mode) {
  pushHistory()
  state.focusRingMode[state.activeThemeSet] = mode
}

function updateFoundationToken(category, key, value) {
  pushHistory()
  state.foundationOverrides[state.activeThemeSet][category][key] = value
}

function updateComponentToken(tokenId, value) {
  if (_readonlyTokenIds.has(tokenId)) {
    console.warn('[Theme Store] Token is readonly, ignoring update:', tokenId)
    return
  }
  pushHistory()
  state.componentOverrides[state.activeThemeSet][tokenId] = value
}

function updatePrimitive(palette, color) {
  pushHistory()
  state.primitiveOverrides[state.activeThemeSet][palette] = color
}

function resetToDefaults() {
  pushHistory()
  const themeSet = state.activeThemeSet
  state.themes[themeSet].light = deepClone(semanticDefaults[`${themeSet === 'neo' ? 'neo' : 'customer'}-light`])
  state.themes[themeSet].dark = deepClone(semanticDefaults[`${themeSet === 'neo' ? 'neo' : 'customer'}-dark`])
  state.foundationOverrides[themeSet] = deepClone(getDefaultFoundation())
  state.componentOverrides[themeSet] = {}
  state.primitiveOverrides[themeSet] = {
    primary: primitiveColors.primary.base,
    secondary: primitiveColors.secondary.base,
    accent: primitiveColors.accent.base
  }
  state.customFonts[themeSet] = []
  state.focusRingMode[themeSet] = 'offset'
}

// ---------------------------------------------------------------------------
// History (Undo)
// ---------------------------------------------------------------------------

function pushHistory() {
  const snapshot = deepClone({
    themes: state.themes,
    foundationOverrides: state.foundationOverrides,
    componentOverrides: state.componentOverrides,
    primitiveOverrides: state.primitiveOverrides,
    customFonts: state.customFonts,
    focusRingMode: state.focusRingMode
  })
  state.history = state.history.slice(0, state.historyIndex + 1)
  state.history.push(snapshot)
  state.historyIndex = state.history.length - 1
  // Keep max 50 entries
  if (state.history.length > 50) {
    state.history.shift()
    state.historyIndex--
  }
}

function undo() {
  if (state.historyIndex > 0) {
    state.historyIndex--
    const snapshot = state.history[state.historyIndex]
    Object.assign(state.themes, deepClone(snapshot.themes))
    Object.assign(state.foundationOverrides, deepClone(snapshot.foundationOverrides))
    Object.assign(state.componentOverrides, deepClone(snapshot.componentOverrides))
    Object.assign(state.primitiveOverrides, deepClone(snapshot.primitiveOverrides))
    if (snapshot.customFonts) Object.assign(state.customFonts, deepClone(snapshot.customFonts))
    if (snapshot.focusRingMode) Object.assign(state.focusRingMode, deepClone(snapshot.focusRingMode))
  }
}

function redo() {
  if (state.historyIndex < state.history.length - 1) {
    state.historyIndex++
    const snapshot = state.history[state.historyIndex]
    Object.assign(state.themes, deepClone(snapshot.themes))
    Object.assign(state.foundationOverrides, deepClone(snapshot.foundationOverrides))
    Object.assign(state.componentOverrides, deepClone(snapshot.componentOverrides))
    Object.assign(state.primitiveOverrides, deepClone(snapshot.primitiveOverrides))
    if (snapshot.customFonts) Object.assign(state.customFonts, deepClone(snapshot.customFonts))
    if (snapshot.focusRingMode) Object.assign(state.focusRingMode, deepClone(snapshot.focusRingMode))
  }
}

// ---------------------------------------------------------------------------
// Theme Management — Create, Load, Save, Delete
// ---------------------------------------------------------------------------

function generateThemeId() {
  return 'theme-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
}

function getThemeSnapshot() {
  return deepClone({
    themes: state.themes,
    foundationOverrides: state.foundationOverrides,
    componentOverrides: state.componentOverrides,
    primitiveOverrides: state.primitiveOverrides,
    customFonts: state.customFonts,
    focusRingMode: state.focusRingMode,
    activeThemeSet: state.activeThemeSet
  })
}

function loadSavedThemesList() {
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

function persistSavedThemesList() {
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
function createTheme(name, version = '1.0.0') {
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
function saveCurrentTheme(name, version) {
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
function loadTheme(themeId) {
  try {
    const raw = localStorage.getItem(`neo-theme-${themeId}`)
    if (!raw) { console.warn('Theme not found:', themeId); return false }

    const snapshot = JSON.parse(raw)
    pushHistory()

    if (snapshot.themes) Object.assign(state.themes, deepClone(snapshot.themes))
    if (snapshot.foundationOverrides) Object.assign(state.foundationOverrides, deepClone(snapshot.foundationOverrides))
    if (snapshot.componentOverrides) Object.assign(state.componentOverrides, deepClone(snapshot.componentOverrides))
    if (snapshot.primitiveOverrides) Object.assign(state.primitiveOverrides, deepClone(snapshot.primitiveOverrides))
    if (snapshot.customFonts) Object.assign(state.customFonts, deepClone(snapshot.customFonts))
    if (snapshot.focusRingMode) Object.assign(state.focusRingMode, deepClone(snapshot.focusRingMode))
    if (snapshot.activeThemeSet) state.activeThemeSet = snapshot.activeThemeSet

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
function deleteTheme(themeId) {
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
async function loadNeoDefaults() {
  pushHistory()

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
  state.currentThemeMeta = null
  state.version = '1.0.0'
  console.log('[RESET] Loaded NEO defaults from in-memory tokens.js')
}

/**
 * Download theme as JSON file.
 */
function downloadThemeJSON() {
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
function downloadThemeCSS() {
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

// ---------------------------------------------------------------------------
// Export as CSS custom properties
// ---------------------------------------------------------------------------

function exportAsCSSVars() {
  const lines = []
  const themeSet = state.activeThemeSet
  const label = themeSet === 'neo' ? 'NEO Theme' : 'Customer Theme'

  lines.push(`/* ${label} — Generated by NEO Theme Configurator */`)
  lines.push(`/* Version: ${state.version} */`)
  lines.push(`/* Date: ${new Date().toISOString()} */\n`)

  // Light theme
  const lightClass = themeSet === 'neo' ? '.neo-light-theme' : '.customer-light-theme'
  lines.push(`${lightClass} {`)
  for (const [token, value] of Object.entries(state.themes[themeSet].light)) {
    lines.push(`  --fnd-color-${token}: ${value};`)
  }
  lines.push('}\n')

  // Dark theme
  const darkClass = themeSet === 'neo' ? '.neo-dark-theme' : '.customer-dark-theme'
  lines.push(`${darkClass} {`)
  for (const [token, value] of Object.entries(state.themes[themeSet].dark)) {
    lines.push(`  --fnd-color-${token}: ${value};`)
  }
  lines.push('}\n')

  // Focus Ring Mode Override
  const focusMode = state.focusRingMode[themeSet]
  if (focusMode === 'inset') {
    lines.push(`/* Focus Ring: Inset-Modus (Outline nach innen) */`)
    lines.push(`:root {`)
    lines.push(`  --fnd-focus-ring-offset: calc(-1 * var(--fnd-focus-inset));`)
    lines.push('}\n')
  }

  // Component overrides
  const overrides = state.componentOverrides[themeSet]
  if (Object.keys(overrides).length > 0) {
    lines.push(`/* Component Token Overrides */`)
    lines.push(`:root {`)
    for (const [token, value] of Object.entries(overrides)) {
      lines.push(`  --${token}: ${value};`)
    }
    lines.push('}')
  }

  return lines.join('\n')
}

function exportAsJSON() {
  const themeSet = state.activeThemeSet
  return JSON.stringify({
    meta: {
      name: themeSet === 'neo' ? 'NEO Theme' : 'Customer Theme',
      version: state.version,
      generated: new Date().toISOString(),
      generator: 'NEO Theme Configurator'
    },
    primitives: state.primitiveOverrides[themeSet],
    semantic: {
      light: state.themes[themeSet].light,
      dark: state.themes[themeSet].dark
    },
    foundation: state.foundationOverrides[themeSet],
    components: state.componentOverrides[themeSet],
    focusRingMode: state.focusRingMode[themeSet]
  }, null, 2)
}

// ---------------------------------------------------------------------------
// Save to Server (full theme format)
// ---------------------------------------------------------------------------

async function saveToServer() {
  const themeSet = state.activeThemeSet
  const payload = {
    meta: {
      name: state.currentThemeMeta?.name || (themeSet === 'neo' ? 'NEO Theme' : 'Customer Theme'),
      version: state.version,
      generated: new Date().toISOString(),
      generator: 'NEO Theme Configurator'
    },
    theme: currentThemeId.value,
    primitives: toRaw(state.primitiveOverrides[themeSet]),
    semantic: {
      [themeSet + '-light']: toRaw(state.themes[themeSet].light),
      [themeSet + '-dark']: toRaw(state.themes[themeSet].dark)
    },
    components: toRaw(state.componentOverrides[themeSet]),
    foundation: toRaw(state.foundationOverrides[themeSet])
  }

  const res = await fetch('/api/save-theme', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const data = await res.json()
  if (data.status !== 'ok') {
    throw new Error(data.message || 'Server save failed')
  }
  return data
}

// ---------------------------------------------------------------------------
// Persist to localStorage
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'neo-theme-configurator'

// Debounce timer for named-theme auto-save (avoids excessive localStorage writes)
let _namedThemeSaveTimer = null

function saveToStorage() {
  try {
    const data = {
      activeThemeSet: state.activeThemeSet,
      previewMode: state.previewMode,
      themes: toRaw(state.themes),
      foundationOverrides: toRaw(state.foundationOverrides),
      componentOverrides: toRaw(state.componentOverrides),
      primitiveOverrides: toRaw(state.primitiveOverrides),
      customFonts: toRaw(state.customFonts),
      focusRingMode: toRaw(state.focusRingMode),
      currentThemeMeta: toRaw(state.currentThemeMeta)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to save theme state:', e)
  }

  // Also persist to the named theme slot (debounced, 500ms)
  // This ensures that when a named theme is loaded and the user edits tokens,
  // the individual theme snapshot stays in sync with the working state.
  if (state.currentThemeMeta) {
    clearTimeout(_namedThemeSaveTimer)
    _namedThemeSaveTimer = setTimeout(() => {
      try {
        const meta = state.currentThemeMeta
        if (!meta) return  // guard in case theme was unloaded during debounce
        meta.updatedAt = new Date().toISOString()
        const snapshot = {
          themes: JSON.parse(JSON.stringify(toRaw(state.themes))),
          foundationOverrides: JSON.parse(JSON.stringify(toRaw(state.foundationOverrides))),
          componentOverrides: JSON.parse(JSON.stringify(toRaw(state.componentOverrides))),
          primitiveOverrides: JSON.parse(JSON.stringify(toRaw(state.primitiveOverrides))),
          customFonts: JSON.parse(JSON.stringify(toRaw(state.customFonts))),
          focusRingMode: JSON.parse(JSON.stringify(toRaw(state.focusRingMode))),
          activeThemeSet: state.activeThemeSet,
          meta: JSON.parse(JSON.stringify(toRaw(meta)))
        }
        localStorage.setItem(`neo-theme-${meta.id}`, JSON.stringify(snapshot))
        // Also update the catalogue entry with the new updatedAt timestamp
        const idx = state.savedThemes.findIndex(t => t.id === meta.id)
        if (idx >= 0) {
          state.savedThemes[idx] = JSON.parse(JSON.stringify(toRaw(meta)))
          persistSavedThemesList()
        }
      } catch (e) {
        console.warn('Failed to auto-save named theme:', e)
      }
    }, 500)
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data.themes) Object.assign(state.themes, data.themes)
      if (data.foundationOverrides) Object.assign(state.foundationOverrides, data.foundationOverrides)
      if (data.componentOverrides) Object.assign(state.componentOverrides, data.componentOverrides)
      if (data.primitiveOverrides) Object.assign(state.primitiveOverrides, data.primitiveOverrides)
      if (data.customFonts) Object.assign(state.customFonts, data.customFonts)
      if (data.focusRingMode) Object.assign(state.focusRingMode, data.focusRingMode)
      if (data.activeThemeSet) state.activeThemeSet = data.activeThemeSet
      if (data.previewMode) state.previewMode = data.previewMode
      if (data.currentThemeMeta) state.currentThemeMeta = data.currentThemeMeta
    }
  } catch (e) {
    console.warn('Failed to load theme state:', e)
  }
  // Also load the saved themes catalogue
  loadSavedThemesList()

  // ---------------------------------------------------------------------------
  // Prune stale component overrides (tokens removed during token hygiene)
  // ---------------------------------------------------------------------------
  for (const themeSet of ['neo', 'customer']) {
    const overrides = state.componentOverrides[themeSet]
    if (!overrides) continue
    for (const key of Object.keys(overrides)) {
      if (!_validComponentTokenIds.has(key)) {
        console.warn('[Theme Store] Pruning stale component override:', key)
        delete overrides[key]
      } else if (_readonlyTokenIds.has(key)) {
        console.warn('[Theme Store] Pruning readonly component override:', key)
        delete overrides[key]
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Migrate legacy custom fonts from isolated localStorage keys into store state
  // Old format: neo-cfg-custom-fonts (NEO default) or neo-cfg-custom-fonts-{themeId}
  // ---------------------------------------------------------------------------
  try {
    const LEGACY_KEY = 'neo-cfg-custom-fonts'
    // Migrate NEO default custom fonts
    if (state.customFonts.neo.length === 0) {
      const legacyNeo = localStorage.getItem(LEGACY_KEY)
      if (legacyNeo) {
        const parsed = JSON.parse(legacyNeo)
        if (Array.isArray(parsed) && parsed.length > 0) {
          state.customFonts.neo = parsed
          localStorage.removeItem(LEGACY_KEY)
          console.log('[MIGRATE] Migrated', parsed.length, 'legacy custom fonts (NEO default)')
        }
      }
    }
    // Migrate per-theme custom fonts for the currently loaded theme
    if (state.currentThemeMeta) {
      const themeSet = state.activeThemeSet
      if (state.customFonts[themeSet].length === 0) {
        const legacyKey = `${LEGACY_KEY}-${state.currentThemeMeta.id}`
        const legacyFonts = localStorage.getItem(legacyKey)
        if (legacyFonts) {
          const parsed = JSON.parse(legacyFonts)
          if (Array.isArray(parsed) && parsed.length > 0) {
            state.customFonts[themeSet] = parsed
            localStorage.removeItem(legacyKey)
            console.log('[MIGRATE] Migrated', parsed.length, 'legacy custom fonts for theme', state.currentThemeMeta.name)
          }
        }
      }
    }
  } catch (e) {
    console.warn('[MIGRATE] Failed to migrate legacy custom fonts:', e)
  }
}

// Auto-save on changes
watch(
  () => [state.themes, state.foundationOverrides, state.componentOverrides, state.primitiveOverrides, state.customFonts, state.focusRingMode],
  () => saveToStorage(),
  { deep: true }
)

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function useThemeStore() {
  return {
    state,
    // Computed
    currentThemeKey,
    currentThemeId,
    currentSemanticTokens,
    currentFoundation,
    currentComponentOverrides,
    currentPrimitives,
    currentCustomFonts,
    currentFocusRingMode,
    isDirty,
    isNeoDefault,
    // Actions
    setActiveThemeSet,
    setPreviewMode,
    setActiveSection,
    selectToken,
    updateSemanticToken,
    updateFoundationToken,
    updateComponentToken,
    updatePrimitive,
    setFocusRingMode,
    resetToDefaults,
    undo,
    redo,
    // Theme Management
    createTheme,
    saveCurrentTheme,
    loadTheme,
    deleteTheme,
    loadNeoDefaults,
    downloadThemeJSON,
    downloadThemeCSS,
    // Export
    exportAsCSSVars,
    exportAsJSON,
    // Persistence
    saveToServer,
    loadFromStorage,
    saveToStorage
  }
}
