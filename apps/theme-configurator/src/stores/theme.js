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
import { downloadDrupalBundle } from '../export/drupal-adapter.js'

// ---------------------------------------------------------------------------
// Valid token ID sets (for pruning stale localStorage overrides)
// ---------------------------------------------------------------------------
const _validComponentTokenIds = new Set(
  componentTokenGroups.flatMap(g => g.tokens.map(t => t.id))
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

  // Arena specimen selection (ephemeral, not persisted)
  // { componentId, specimenId, tokenGroups } or null
  arenaSelection: null,

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

  // Component Locks — gesperrte Komponenten koennen nicht editiert werden
  componentLocks: {
    neo: {},       // { 'button': true, 'badge': true }
    customer: {}
  },

  // Component Versions — semantische Versionierung pro Komponente
  componentVersions: {
    neo: {},       // { 'button': '1.2.0', 'badge': '1.0.0' }
    customer: {}
  },

  // Custom Variant Definitions per theme set
  // Shape: { 'button': { 'gradient': { modifier, baseVariant, axis, tokens: [...tokenIds] } } }
  variantDefinitions: {
    neo: {},
    customer: {}
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
  const mode = state.previewMode === 'split' ? 'light' : state.previewMode
  return `${state.activeThemeSet}-${mode}`
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
  // In split mode, default to light for editors that need a single map
  const mode = state.previewMode === 'split' ? 'light' : state.previewMode
  return state.themes[state.activeThemeSet][mode]
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
  state.arenaSelection = null
}

function selectToken(token) {
  state.selectedToken = token
}

function setArenaSelection(componentId, specimenId, tokenGroups) {
  state.arenaSelection = { componentId, specimenId, tokenGroups }
}

function clearArenaSelection() {
  state.arenaSelection = null
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
  // Guard: check if the component owning this token is locked
  const componentId = extractComponentId(tokenId)
  if (componentId && isComponentLocked(componentId)) {
    console.warn(`[Theme Store] Cannot update token "${tokenId}": component "${componentId}" is locked.`)
    return false
  }
  pushHistory()
  state.componentOverrides[state.activeThemeSet][tokenId] = value
  return true
}

function resetComponentToken(tokenId) {
  const componentId = extractComponentId(tokenId)
  if (componentId && isComponentLocked(componentId)) {
    console.warn(`[Theme Store] Cannot reset token "${tokenId}": component "${componentId}" is locked.`)
    return false
  }
  pushHistory()
  delete state.componentOverrides[state.activeThemeSet][tokenId]
  return true
}

// ---------------------------------------------------------------------------
// Component Lock + Versioning
// ---------------------------------------------------------------------------

/**
 * Extract component ID from a token ID (e.g. "nc-button-primary-bg" → "button").
 * Handles multi-segment component names like "link-with-arrow", "data-table", etc.
 */
function extractComponentId(tokenId) {
  if (!tokenId.startsWith('nc-')) return null
  const withoutPrefix = tokenId.slice(3) // remove "nc-"
  // Match against known component IDs from componentTokenGroups
  const knownIds = componentTokenGroups.map(g => g.id)
  // Sort by length descending so longer matches win (e.g. "link-with-arrow" before "link")
  const sorted = knownIds.sort((a, b) => b.length - a.length)
  for (const id of sorted) {
    if (withoutPrefix === id || withoutPrefix.startsWith(id + '-')) {
      return id
    }
  }
  return null
}

/**
 * Check if a component is locked (read-only).
 */
function isComponentLocked(componentId) {
  return !!state.componentLocks[state.activeThemeSet][componentId]
}

/**
 * Lock a component — prevents token editing.
 * If no version exists yet, initializes to '1.0.0'.
 */
function lockComponent(componentId) {
  state.componentLocks[state.activeThemeSet][componentId] = true
  if (!state.componentVersions[state.activeThemeSet][componentId]) {
    state.componentVersions[state.activeThemeSet][componentId] = '1.0.0'
  }
}

/**
 * Unlock a component for editing. Optionally bump version.
 * @param {string} componentId
 * @param {'patch'|'minor'|'major'|null} bumpType — null = no bump
 */
function unlockComponent(componentId, bumpType = null) {
  state.componentLocks[state.activeThemeSet][componentId] = false
  if (bumpType) {
    bumpComponentVersion(componentId, bumpType)
  }
}

/**
 * Bump a component's semantic version.
 * @param {string} componentId
 * @param {'patch'|'minor'|'major'} type
 */
function bumpComponentVersion(componentId, type) {
  const current = state.componentVersions[state.activeThemeSet][componentId] || '1.0.0'
  const [major, minor, patch] = current.split('.').map(Number)
  let next
  if (type === 'major') next = `${major + 1}.0.0`
  else if (type === 'minor') next = `${major}.${minor + 1}.0`
  else next = `${major}.${minor}.${patch + 1}`
  state.componentVersions[state.activeThemeSet][componentId] = next
}

/**
 * Get a component's current version string.
 */
function getComponentVersion(componentId) {
  return state.componentVersions[state.activeThemeSet][componentId] || null
}

// ---------------------------------------------------------------------------
// Custom Variant Definitions
// ---------------------------------------------------------------------------

/**
 * Create a new custom variant for a component.
 * Clones tokens from baseVariant with new variant name.
 * @param {string} componentId - e.g. "button"
 * @param {string} variantName - e.g. "gradient"
 * @param {string} baseVariant - e.g. "primary" (tokens to clone)
 * @param {string} axis - Recipe axis (e.g. "variant")
 * @param {Array} baseTokenIds - Token IDs of the base variant
 * @returns {object|null} The created variant definition
 */
function createVariant(componentId, variantName, baseVariant, axis, baseTokenIds) {
  pushHistory()
  const themeSet = state.activeThemeSet

  if (!state.variantDefinitions[themeSet][componentId]) {
    state.variantDefinitions[themeSet][componentId] = {}
  }

  // Generate new token IDs by replacing baseVariant with variantName
  const newTokenIds = baseTokenIds.map(id => {
    return id.replace(`nc-${componentId}-${baseVariant}-`, `nc-${componentId}-${variantName}-`)
  })

  // Clone token values from base variant
  const overrides = state.componentOverrides[themeSet]
  for (let i = 0; i < baseTokenIds.length; i++) {
    const baseId = baseTokenIds[i]
    const newId = newTokenIds[i]
    // Copy override value if present, otherwise use the default from the registry
    if (overrides[baseId] !== undefined) {
      overrides[newId] = overrides[baseId]
    }
    // Note: if no override exists, the token will use its default value
    // which doesn't exist in the registry for custom variants,
    // so we always set an initial value
    if (overrides[newId] === undefined) {
      const registryToken = componentTokenGroups
        .find(g => g.id === componentId)?.tokens
        .find(t => t.id === baseId)
      if (registryToken) {
        overrides[newId] = registryToken.default || ''
      }
    }
  }

  const modifier = `nc-${componentId}--${variantName}`
  const definition = {
    modifier,
    baseVariant,
    axis,
    tokens: newTokenIds,
    createdAt: new Date().toISOString()
  }

  state.variantDefinitions[themeSet][componentId][variantName] = definition
  return definition
}

/**
 * Delete a custom variant and its associated token overrides.
 */
function deleteVariant(componentId, variantName) {
  pushHistory()
  const themeSet = state.activeThemeSet
  const variants = state.variantDefinitions[themeSet][componentId]
  if (!variants || !variants[variantName]) return

  // Remove associated token overrides
  const tokenIds = variants[variantName].tokens || []
  for (const id of tokenIds) {
    delete state.componentOverrides[themeSet][id]
  }

  delete variants[variantName]
  if (Object.keys(variants).length === 0) {
    delete state.variantDefinitions[themeSet][componentId]
  }
}

/**
 * Get all custom variants for a component.
 * @returns {object} { variantName: definition }
 */
function getVariants(componentId) {
  return state.variantDefinitions[state.activeThemeSet][componentId] || {}
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
  state.componentLocks[themeSet] = {}
  state.componentVersions[themeSet] = {}
  state.variantDefinitions[themeSet] = {}
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
    focusRingMode: state.focusRingMode,
    componentLocks: state.componentLocks,
    componentVersions: state.componentVersions,
    variantDefinitions: state.variantDefinitions
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
    if (snapshot.componentLocks) Object.assign(state.componentLocks, deepClone(snapshot.componentLocks))
    if (snapshot.componentVersions) Object.assign(state.componentVersions, deepClone(snapshot.componentVersions))
    if (snapshot.variantDefinitions) Object.assign(state.variantDefinitions, deepClone(snapshot.variantDefinitions))
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
    if (snapshot.componentLocks) Object.assign(state.componentLocks, deepClone(snapshot.componentLocks))
    if (snapshot.componentVersions) Object.assign(state.componentVersions, deepClone(snapshot.componentVersions))
    if (snapshot.variantDefinitions) Object.assign(state.variantDefinitions, deepClone(snapshot.variantDefinitions))
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
    componentLocks: state.componentLocks,
    componentVersions: state.componentVersions,
    variantDefinitions: state.variantDefinitions,
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
    if (snapshot.componentLocks) Object.assign(state.componentLocks, deepClone(snapshot.componentLocks))
    if (snapshot.componentVersions) Object.assign(state.componentVersions, deepClone(snapshot.componentVersions))
    if (snapshot.variantDefinitions) Object.assign(state.variantDefinitions, deepClone(snapshot.variantDefinitions))
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
        state.componentLocks = { neo: {}, customer: {} }
        state.componentVersions = { neo: {}, customer: {} }
        state.variantDefinitions = { neo: {}, customer: {} }
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

/**
 * Download Drupal export bundle (CSS + settings JSON).
 */
function downloadDrupalExport() {
  const json = exportAsJSON()
  downloadDrupalBundle(json)
}

// ---------------------------------------------------------------------------
// Export as CSS custom properties
// ---------------------------------------------------------------------------

function exportAsCSSVars() {
  const lines = []
  const themeSet = state.activeThemeSet
  const label = themeSet === 'neo' ? 'NEO Theme' : 'Customer Theme'

  // Header with metadata
  lines.push(`/* Theme: ${label} */`)
  lines.push(`/* Version: ${state.version} */`)
  lines.push(`/* Branch: ${_getBranchLabel()} */`)

  // Component version summary
  const versionEntries = Object.entries(state.componentVersions[themeSet] || {})
    .filter(([, v]) => v)
  if (versionEntries.length > 0) {
    const componentSummary = versionEntries
      .map(([id, v]) => `${id}@${v}${state.componentLocks[themeSet]?.[id] ? ' (locked)' : ''}`)
      .join(', ')
    lines.push(`/* Components: ${componentSummary} */`)
  }
  lines.push(`/* Generated: ${new Date().toISOString()} */`)
  lines.push(`/* Generator: NEO Theme Configurator v2 */\n`)

  // === Base Theme (Light) ===
  const lightClass = themeSet === 'neo' ? '.neo-light-theme' : '.customer-light-theme'
  lines.push(`/* === Base Theme (Light) === */`)
  lines.push(`${lightClass} {`)
  for (const [token, value] of Object.entries(state.themes[themeSet].light)) {
    lines.push(`  --fnd-color-${token}: ${value};`)
  }
  lines.push('}\n')

  // === Base Theme (Dark) ===
  const darkClass = themeSet === 'neo' ? '.neo-dark-theme' : '.customer-dark-theme'
  lines.push(`/* === Base Theme (Dark) === */`)
  lines.push(`${darkClass} {`)
  for (const [token, value] of Object.entries(state.themes[themeSet].dark)) {
    lines.push(`  --fnd-color-${token}: ${value};`)
  }
  lines.push('}\n')

  // === Foundation Overrides ===
  const fndOverrides = state.foundationOverrides[themeSet]
  if (fndOverrides && Object.keys(fndOverrides).length > 0) {
    lines.push(`/* === Foundation Overrides === */`)
    lines.push(`:root {`)
    for (const [cat, tokens] of Object.entries(fndOverrides)) {
      if (tokens && typeof tokens === 'object') {
        for (const [token, value] of Object.entries(tokens)) {
          lines.push(`  --${token}: ${value};`)
        }
      }
    }
    lines.push('}\n')
  }

  // === Focus Ring Mode Override ===
  const focusMode = state.focusRingMode[themeSet]
  if (focusMode === 'inset') {
    lines.push(`/* Focus Ring: Inset-Modus (Outline nach innen) */`)
    lines.push(`:root {`)
    lines.push(`  --fnd-focus-ring-offset: calc(-1 * var(--fnd-focus-inset));`)
    lines.push('}\n')
  }

  // === Component Token Overrides (grouped by component) ===
  const overrides = state.componentOverrides[themeSet]
  if (Object.keys(overrides).length > 0) {
    // Group overrides by component ID
    const grouped = {}
    for (const [token, value] of Object.entries(overrides)) {
      const compId = extractComponentId(token) || '_ungrouped'
      if (!grouped[compId]) grouped[compId] = {}
      grouped[compId][token] = value
    }

    lines.push(`/* === Component Token Overrides === */`)
    lines.push(`:root {`)
    for (const [compId, tokens] of Object.entries(grouped)) {
      const ver = state.componentVersions[themeSet]?.[compId]
      const locked = state.componentLocks[themeSet]?.[compId]
      const verLabel = ver ? ` (v${ver}${locked ? ' — locked' : ''})` : ''
      lines.push(`  /* ${compId}${verLabel} */`)
      for (const [token, value] of Object.entries(tokens)) {
        lines.push(`  --${token}: ${value};`)
      }
    }
    lines.push('}\n')
  }

  // === Custom Variant Modifier Classes ===
  const variants = state.variantDefinitions[themeSet]
  if (variants && Object.keys(variants).length > 0) {
    lines.push(`/* === Custom Variant Modifier Classes === */`)
    for (const [compId, compVariants] of Object.entries(variants)) {
      for (const [variantName, def] of Object.entries(compVariants)) {
        lines.push(`.${def.modifier} {`)
        // Map base variant tokens to custom variant tokens
        if (def.tokens && Array.isArray(def.tokens)) {
          for (const tokenId of def.tokens) {
            // Derive the property name by removing the component+variant prefix
            const baseProperty = tokenId.replace(`nc-${compId}-${variantName}-`, '')
            const baseTokenId = `nc-${compId}-${baseProperty}`
            lines.push(`  --${baseTokenId}: var(--${tokenId});`)
          }
        }
        lines.push('}')
      }
    }
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Get the current branch label for export headers.
 */
function _getBranchLabel() {
  try {
    // Import is async, so we use a simple fallback
    const stored = localStorage.getItem('neo-theme-branches')
    if (stored) {
      const data = JSON.parse(stored)
      if (data.activeBranchId && data.branches?.[data.activeBranchId]) {
        return data.branches[data.activeBranchId].name
      }
    }
  } catch (e) { /* ignore */ }
  return 'main'
}

function exportAsJSON() {
  const themeSet = state.activeThemeSet
  const overrides = state.componentOverrides[themeSet] || {}
  const locks = state.componentLocks[themeSet] || {}
  const versions = state.componentVersions[themeSet] || {}
  const variants = state.variantDefinitions[themeSet] || {}

  // Build per-component structured data
  const components = {}
  // Group overrides by component ID
  for (const [token, value] of Object.entries(overrides)) {
    const compId = extractComponentId(token) || '_ungrouped'
    if (!components[compId]) {
      components[compId] = {
        version: versions[compId] || null,
        locked: !!locks[compId],
        overrides: {},
        customVariants: {}
      }
    }
    components[compId].overrides[token] = value
  }

  // Add components that have versions/locks but no overrides
  for (const compId of Object.keys(versions)) {
    if (!components[compId]) {
      components[compId] = { version: versions[compId], locked: !!locks[compId], overrides: {}, customVariants: {} }
    } else {
      components[compId].version = versions[compId]
    }
  }
  for (const compId of Object.keys(locks)) {
    if (!components[compId]) {
      components[compId] = { version: versions[compId] || null, locked: !!locks[compId], overrides: {}, customVariants: {} }
    } else {
      components[compId].locked = !!locks[compId]
    }
  }

  // Add custom variants
  for (const [compId, compVariants] of Object.entries(variants)) {
    if (!components[compId]) {
      components[compId] = { version: versions[compId] || null, locked: !!locks[compId], overrides: {}, customVariants: {} }
    }
    for (const [variantName, def] of Object.entries(compVariants)) {
      const variantTokenValues = {}
      if (def.tokens) {
        for (const tokenId of def.tokens) {
          if (overrides[tokenId] !== undefined) {
            variantTokenValues[tokenId] = overrides[tokenId]
          }
        }
      }
      components[compId].customVariants[variantName] = {
        modifier: def.modifier,
        baseVariant: def.baseVariant,
        tokens: variantTokenValues
      }
    }
  }

  return JSON.stringify({
    meta: {
      name: state.currentThemeMeta?.name || (themeSet === 'neo' ? 'NEO Theme' : 'Customer Theme'),
      version: state.version,
      branch: _getBranchLabel(),
      generated: new Date().toISOString(),
      generator: 'NEO Theme Configurator v2'
    },
    components,
    primitives: state.primitiveOverrides[themeSet],
    semantic: {
      light: state.themes[themeSet].light,
      dark: state.themes[themeSet].dark
    },
    foundation: state.foundationOverrides[themeSet],
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
      componentLocks: toRaw(state.componentLocks),
      componentVersions: toRaw(state.componentVersions),
      variantDefinitions: toRaw(state.variantDefinitions),
      currentThemeMeta: toRaw(state.currentThemeMeta),
      activeSection: state.activeSection
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
          componentLocks: JSON.parse(JSON.stringify(toRaw(state.componentLocks))),
          componentVersions: JSON.parse(JSON.stringify(toRaw(state.componentVersions))),
          variantDefinitions: JSON.parse(JSON.stringify(toRaw(state.variantDefinitions))),
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
      if (data.componentLocks) Object.assign(state.componentLocks, data.componentLocks)
      if (data.componentVersions) Object.assign(state.componentVersions, data.componentVersions)
      if (data.variantDefinitions) Object.assign(state.variantDefinitions, data.variantDefinitions)
      if (data.activeThemeSet) state.activeThemeSet = data.activeThemeSet
      if (data.previewMode) state.previewMode = data.previewMode
      if (data.currentThemeMeta) state.currentThemeMeta = data.currentThemeMeta
      if (data.activeSection) state.activeSection = data.activeSection
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
  () => [state.themes, state.foundationOverrides, state.componentOverrides, state.primitiveOverrides, state.customFonts, state.focusRingMode, state.componentLocks, state.componentVersions, state.variantDefinitions],
  () => saveToStorage(),
  { deep: true }
)

// Aktive Sektion separat speichern (leichtgewichtig, kein deep watch noetig)
watch(() => state.activeSection, () => saveToStorage())

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
    setArenaSelection,
    clearArenaSelection,
    updateSemanticToken,
    updateFoundationToken,
    updateComponentToken,
    resetComponentToken,
    // Component Lock + Versioning
    isComponentLocked,
    lockComponent,
    unlockComponent,
    bumpComponentVersion,
    getComponentVersion,
    extractComponentId,
    // Custom Variants
    createVariant,
    deleteVariant,
    getVariants,
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
    downloadDrupalExport,
    // Export
    exportAsCSSVars,
    exportAsJSON,
    // Persistence
    saveToServer,
    loadFromStorage,
    saveToStorage
  }
}
