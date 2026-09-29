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
import { foundationZeilen } from '../export/foundation-css.js'

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

  // Per-section preview mode memory (section → 'light'|'dark'|'split')
  sectionPreviewModes: {},

  // Current navigation section
  activeSection: 'foundation-colors',

  // Color inspector active tab: 'primitives' or 'semantic'
  colorActiveTab: 'primitives',

  // Spacing inspector active tab: 'primitives' or 'semantic'
  spacingActiveTab: 'primitives',

  // Spacing semantic category: null (overview) or 'layout'|'component'|'custom'
  spacingCategory: null,

  // Typography inspector active tab: 'primitives' or 'semantic'
  typographyActiveTab: 'primitives',

  // Shadow inspector active tab: 'primitives' or 'semantic'
  shadowActiveTab: 'primitives',

  // Typography semantic category: null (overview) or 'heading'|'display'|'body'|'feedback'
  typographyCategory: null,

  // Semantic category: null (overview) or 'text'|'background'|'border'|'interactive'|'feedback'|'layer'|'on-color'
  semanticCategory: null,

  // Selected token for inspector
  selectedToken: null,

  // Arena specimen selection (ephemeral, not persisted)
  // { componentId, specimenId, tokenGroups } or null
  arenaSelection: null,

  // Sync Geometry: Geometrie-Aenderungen gelten fuer beide Themes
  syncGeometry: true,

  // Form Variant: Globaler Stil fuer Input/Textarea/Select (outlined/filled/borderless)
  formVariant: { neo: 'outlined', customer: 'outlined' },

  // Highlighted Token: Inspector→Arena visuelles Feedback
  // { tokenId, property } oder null
  highlightedToken: null,

  // Arena Filters: dynamisch pro Kategorie. null = all selected; Map<id,boolean> = selektiv.
  // Standard-Kategorien: variants, sizes, states. Dazu komponentenspezifische (emphasis, pattern, etc.)
  arenaFilters: {},

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

  // Custom spacing tokens per theme set (user-defined beyond defaults)
  // Shape: { '14': { label: '14', value: '56px' }, ... }
  customSpacingTokens: {
    neo: {},
    customer: {}
  },

  // Custom radii tokens per theme set
  // Maps key to { label, value }: { 'custom-1': { label: 'custom-1', value: '20px' } }
  customRadiiTokens: {
    neo: {},
    customer: {}
  },

  // Custom border width tokens per theme set
  // Shape: { 'xxl': { label: 'XXL', value: '6px' } }
  customBorderWidthTokens: {
    neo: {},
    customer: {}
  },

  // Custom media ratio tokens per theme set
  // Shape: { '21-9': { label: '21:9 (Ultrawide)', value: '21 / 9' } }
  customMediaRatioTokens: {
    neo: {},
    customer: {}
  },

  // Custom shadow level tokens per theme set
  // Shape: { '2xl': { label: '2XL', value: '0 40px 80px rgba(15, 23, 42, 0.24)' } }
  customShadowTokens: {
    neo: {},
    customer: {}
  },

  // Custom elevation (semantic) mapping per theme set
  // Shape: { 'popover': { label: 'Popover', value: 'md' } }  (value = shadow level key)
  customElevationTokens: {
    neo: {},
    customer: {}
  },

  // Custom opacity tokens per theme set
  // Shape: { 'ghost': { label: 'Ghost', value: 0.04 } }
  customOpacityTokens: {
    neo: {},
    customer: {}
  },

  // Custom z-index tokens per theme set
  // Shape: { 'popover': { label: 'Popover', value: 15 } }
  customZindexTokens: {
    neo: {},
    customer: {}
  },

  // Custom motion tokens per theme set
  // Shape: { 'bounce': { label: 'Bounce', value: 'cubic-bezier(.68,-0.55,.27,1.55)', type: 'easing' } }
  customMotionTokens: {
    neo: {},
    customer: {}
  },

  // Custom motion effect tokens per theme set
  // Shape: { 'bounce-in': { label: 'Bounce In', value: '...', transition: '...', intent: 'entrance' } }
  customMotionEffectTokens: {
    neo: {},
    customer: {}
  },

  // Icon libraries per theme set
  // Each entry: { id, name, builtIn, iconCount, manifestPath? }
  // Built-in libraries: Tabler Icons + Heroicons
  iconLibraries: {
    neo: [
      { id: 'tabler', name: 'Tabler Icons', builtIn: true, iconCount: 5254, manifestPath: '/data/icons-manifest.json' },
      { id: 'heroicons', name: 'Heroicons', builtIn: true, iconCount: 324, manifestPath: '/data/icons-manifest-heroicons.json' }
    ],
    customer: [
      { id: 'tabler', name: 'Tabler Icons', builtIn: true, iconCount: 5254, manifestPath: '/data/icons-manifest.json' },
      { id: 'heroicons', name: 'Heroicons', builtIn: true, iconCount: 324, manifestPath: '/data/icons-manifest-heroicons.json' }
    ]
  },

  // Icon stroke widths per size, per library, per theme set
  // Structure: { neo: { tabler: { xs: '1', ... }, heroicons: { ... } }, customer: { ... } }
  iconStrokeWidths: {
    neo: {
      tabler: { xs: '1', sm: '1.5', md: '1.5', lg: '2', xl: '2', '2xl': '2' },
      heroicons: { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' }
    },
    customer: {
      tabler: { xs: '1', sm: '1.5', md: '1.5', lg: '2', xl: '2', '2xl': '2' },
      heroicons: { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' }
    }
  },

  // Icon stroke colors per light/dark mode, per library, per theme set
  // Structure: { neo: { tabler: { light: '#...', dark: '#...' }, heroicons: { ... } }, customer: { ... } }
  iconStrokeColors: {
    neo: {
      tabler: { light: 'currentColor', dark: 'currentColor' },
      heroicons: { light: 'currentColor', dark: 'currentColor' }
    },
    customer: {
      tabler: { light: 'currentColor', dark: 'currentColor' },
      heroicons: { light: 'currentColor', dark: 'currentColor' }
    }
  },

  // Semantic spacing tokens per theme set
  // Maps purpose to a primitive spacing reference: { 'padding-page': 'var(--fnd-spacing-08)', ... }
  semanticSpacing: {
    neo: {},
    customer: {}
  },

  // Semantic typography tokens per theme set
  // Maps purpose to typography values: { 'heading-h1-font-size': '42px', 'heading-h1-line-height': '1.1', ... }
  semanticTypography: {
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

const currentCustomSpacingTokens = computed(() => {
  return state.customSpacingTokens[state.activeThemeSet]
})

const currentCustomRadiiTokens = computed(() => {
  return state.customRadiiTokens[state.activeThemeSet]
})

const currentCustomBorderWidthTokens = computed(() => {
  return state.customBorderWidthTokens[state.activeThemeSet]
})

const currentCustomMediaRatioTokens = computed(() => {
  return state.customMediaRatioTokens[state.activeThemeSet]
})

const currentCustomShadowTokens = computed(() => {
  return state.customShadowTokens[state.activeThemeSet]
})

const currentCustomElevationTokens = computed(() => {
  return state.customElevationTokens[state.activeThemeSet]
})

const currentCustomOpacityTokens = computed(() => {
  return state.customOpacityTokens[state.activeThemeSet]
})

const currentCustomZindexTokens = computed(() => {
  return state.customZindexTokens[state.activeThemeSet]
})

const currentCustomMotionTokens = computed(() => {
  return state.customMotionTokens[state.activeThemeSet]
})

const currentCustomMotionEffectTokens = computed(() => {
  return state.customMotionEffectTokens[state.activeThemeSet]
})

const currentIconLibraries = computed(() => {
  return state.iconLibraries[state.activeThemeSet]
})

const currentIconStrokeWidths = computed(() => {
  return state.iconStrokeWidths[state.activeThemeSet]
})

const currentIconStrokeColors = computed(() => {
  return state.iconStrokeColors[state.activeThemeSet]
})

const currentSemanticSpacing = computed(() => {
  return state.semanticSpacing[state.activeThemeSet]
})

const currentSemanticTypography = computed(() => {
  return state.semanticTypography[state.activeThemeSet]
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
  // Merke den Preview Mode fuer die aktuelle Sektion
  state.sectionPreviewModes[state.activeSection] = mode
}

function setActiveSection(sectionId) {
  state.activeSection = sectionId
  state.arenaSelection = null
  resetArenaFilters()
  // Gespeicherten Preview Mode der Sektion wiederherstellen, sonst Light als Default
  state.previewMode = state.sectionPreviewModes[sectionId] || 'light'
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

// ---------------------------------------------------------------------------
// Sync Geometry + Visual Highlighting
// ---------------------------------------------------------------------------

function setSyncGeometry(val) {
  state.syncGeometry = val
}

function getFormVariant() {
  return state.formVariant[state.activeThemeSet] || 'outlined'
}

function setFormVariant(variant) {
  state.formVariant[state.activeThemeSet] = variant
}

function setHighlightedToken(tokenId, property) {
  state.highlightedToken = tokenId ? { tokenId, property } : null
}

function clearHighlightedToken() {
  state.highlightedToken = null
}

// ---------------------------------------------------------------------------
// Arena Filters
// ---------------------------------------------------------------------------

function setArenaFilter(category, filterMap) {
  state.arenaFilters[category] = filterMap
}

function resetArenaFilters() {
  // Alle Kategorien zuruecksetzen (dynamisch)
  for (const key of Object.keys(state.arenaFilters)) {
    delete state.arenaFilters[key]
  }
}

function updateSemanticToken(tokenId, value) {
  const mode = state.previewMode === 'split' ? 'light' : state.previewMode
  const themeSet = state.activeThemeSet
  pushHistory()
  state.themes[themeSet][mode][tokenId] = value
}

function setFocusRingMode(mode) {
  pushHistory()
  state.focusRingMode[state.activeThemeSet] = mode
}

function updateFoundationToken(category, key, value) {
  pushHistory()
  state.foundationOverrides[state.activeThemeSet][category][key] = value
}

// ---------------------------------------------------------------------------
// Mirror Token Map: Source → Targets
// Wenn ein Source-Token geaendert wird, werden die Targets automatisch
// mit dem gleichen Wert aktualisiert (sofern syncGeometry aktiv ist).
// ---------------------------------------------------------------------------
const MIRROR_TOKEN_MAP = {
  'nc-input-height-sm':    ['nc-input-group-height-sm'],
  'nc-input-height-md':    ['nc-input-group-height-md'],
  'nc-input-height-lg':    ['nc-input-group-height-lg'],
  'nc-input-radius':       ['nc-input-group-radius'],
  'nc-input-border-width': ['nc-input-group-border-width'],
  // Form Control Shared → Input aliases (cascade via CSS var(), mirror for inspector sync)
  'nc-form-control-bg':                          ['nc-input-bg'],
  'nc-form-control-color':                       ['nc-input-color'],
  'nc-form-control-border-color':                ['nc-input-border'],
  'nc-form-control-radius':                      ['nc-input-radius', 'nc-input-group-radius'],
  'nc-form-control-border-width':                ['nc-input-border-width', 'nc-input-group-border-width'],
  'nc-form-control-placeholder-color':           ['nc-input-placeholder'],
  'nc-form-control-border-hover':                ['nc-input-border-hover'],
  'nc-form-control-border-focus':                ['nc-input-border-focus'],
  'nc-form-control-transition-duration':         ['nc-input-transition-duration'],
  // Input Label → Switch Label + Rating Count (einheitliche Form-Label-Farbe)
  'nc-input-label-color':                        ['nc-switch-label-color', 'nc-rating-count-color'],
  // Slider: Track-Fill-Farbe → Range-Fill-Farbe (Konsistenz)
  'nc-range-track-bg-active':                   ['nc-range-range-fill-bg'],
  // Dropdown: Separator-Farbe → Footer-Border-Farbe (Konsistenz)
  'nc-dropdown-separator-color':                 ['nc-dropdown-footer-border-color'],
  // Dialog/Modal: Header-Border → Footer-Border (Konsistenz bei Scroll-Borders)
  'nc-dialog-header-border-color':               ['nc-dialog-footer-border-color'],
  // Popover: Header-Border → Footer-Border (Konsistenz)
  'nc-popover-header-border':                    ['nc-popover-footer-border'],
  // Popover: BG → Arrow-BG (Arrow-Hintergrund muss zum Panel passen)
  // (moved to bottom with nav-menu-viewport-bg)
  // Toast: Default-Progress-BG folgt Default-Icon-Color (visueller Gleichklang)
  'nc-toast-default-icon-color':                 ['nc-toast-default-progress-bg'],
  // Toast: Severity-Progress-BG folgt Severity-Icon-Color (Konsistenz pro Variante)
  'nc-toast-success-icon-color':                 ['nc-toast-success-progress-bg'],
  'nc-toast-warning-icon-color':                 ['nc-toast-warning-progress-bg'],
  'nc-toast-error-icon-color':                   ['nc-toast-error-progress-bg'],
  'nc-toast-info-icon-color':                    ['nc-toast-info-progress-bg'],
  // Notification: Radius folgt Card-Radius, Shadow folgt Popover-Shadow
  'nc-card-radius':                              ['nc-notification-radius', 'nc-metric-radius'],
  // (moved to bottom with nav-menu-viewport-shadow)
  // Drawer: BG/Shadow/Overlay folgen Dialog-Tokens
  'nc-dialog-bg':                                ['nc-drawer-bg'],
  'nc-dialog-shadow':                            ['nc-drawer-shadow'],
  'nc-dialog-overlay-bg':                        ['nc-drawer-overlay-bg'],
  // Alert ↔ Alert-Dialog: Danger-Farben muessen konsistent sein
  'nc-alert-danger-icon-color':                  ['nc-dialog-danger-icon-color'],
  'nc-alert-danger-bg':                          ['nc-dialog-danger-action-bg'],
  // Accordion: Media-Radius erbt von Card-Radius (Konsistenz)
  'nc-card-radius':                              ['nc-accordion-media-radius'],
  // Accordion: Item-Radius folgt Card-Radius (Separated Cards = Cards)
  'nc-accordion-item-radius':                    ['nc-accordion-media-radius'],
  // Toggle Group: Radius folgt Input-Radius (Formular-Konsistenz)
  'nc-input-radius':                             ['nc-toggle-group-radius'],
  // Toggle Group: Underline-Color folgt Selected-BG (visuelle Kohaerenz)
  'nc-toggle-group-item-selected-bg':            ['nc-toggle-group-underline-color'],
  // Input-Radius: Item + Toolbar folgen (Formular-Konsistenz)
  'nc-input-radius':                             ['nc-item-radius', 'nc-toolbar-radius'],
  // Item: Selected-Border und Accent-Color folgen Interactive-Default (Markenfarbe)
  'nc-item-selected-border':                     ['nc-item-accent-color'],
  // Item: Thumbnail-Radius folgt Media-Radius (Konsistenz)
  'nc-item-media-radius':                        ['nc-item-thumbnail-radius'],
  // Search: Results-Shadow folgt Dropdown-Shadow (Overlay-Konsistenz)
  'nc-dropdown-shadow':                          ['nc-search-results-shadow'],
  // Search: Command-Shadow folgt Dialog-Shadow (Modal-Konsistenz)
  'nc-dialog-shadow':                            ['nc-search-command-shadow'],
  // Toolbar: Gap folgt Button-Gap (Hierarchie-Konsistenz)
  'nc-button-gap':                               ['nc-toolbar-gap'],
  // Navigation-Menu: Viewport-Shadow folgt Popover-Shadow (Overlay-Konsistenz)
  'nc-popover-shadow':                           ['nc-notification-shadow', 'nc-nav-menu-viewport-shadow'],
  // Navigation-Menu: Viewport-BG/Border/Radius folgen Popover (Overlay-Konsistenz)
  'nc-popover-bg':                               ['nc-popover-arrow-bg', 'nc-nav-menu-viewport-bg'],
  'nc-popover-border':                           ['nc-nav-menu-viewport-border'],
  'nc-popover-radius':                           ['nc-nav-menu-viewport-radius'],
  // Nav Molecules → Navigation Menu: Shared Interaction Tokens
  'nc-nav-mol-link-hover-bg':                    ['nc-nav-menu-trigger-hover-bg'],
  'nc-nav-mol-link-active-border':               ['nc-nav-menu-indicator-color'],
  // Nav Atoms → Nav Molecules: Icon-Color Kaskade
  'nc-nav-atom-icon-color':                      ['nc-nav-mol-link-color'],
  // Governance: Label ↔ Tag ↔ Badge — Konsistente Semantik-Farben
  'nc-tag-success-bg':                           ['nc-label-success-bg', 'nc-badge-success-bg'],
  'nc-tag-warning-bg':                           ['nc-label-warning-bg', 'nc-badge-warning-bg'],
  'nc-tag-error-bg':                             ['nc-label-danger-bg', 'nc-badge-error-bg'],
  'nc-tag-info-bg':                              ['nc-label-info-bg', 'nc-badge-info-bg'],
  // Badge → Label: Typografie-Konsistenz
  'nc-badge-font-weight':                        ['nc-label-font-weight'],
  // Avatar: Badge-Online folgt Success-Farbe (Konsistenz mit Badge/Label)
  'nc-badge-success-bg':                         ['nc-avatar-badge-online'],
  // Avatar: Badge-Busy folgt Danger-Farbe
  'nc-badge-error-bg':                           ['nc-avatar-badge-busy'],
  // Avatar: Badge-Away folgt Warning-Farbe
  'nc-badge-warning-bg':                         ['nc-avatar-badge-away'],
  // Avatar: Square-Radius folgt Card-Radius (Entity-Konsistenz)
  'nc-card-radius':                              ['nc-avatar-radius-square'],
  // Chip: Avatar-Size folgt Avatar-XS (Proportionskonsistenz)
  'nc-avatar-size-xs':                           ['nc-chip-avatar-size'],
  // Chip: Radius folgt Button-Radius (Systemkonsistenz)
  'nc-button-radius':                            ['nc-chip-radius'],
  // Button: Primary-BG → Checkbox Checked-BG (Markenfarbe fuer Auswahl)
  'nc-button-primary-bg':                        ['nc-checkbox-bg-checked'],
  // Button: Radius-MD → Input-Radius (Formular-Konsistenz)
  'nc-button-radius-md':                         ['nc-input-radius'],
  // TreeView: Gap folgt Item-Gap (Konsistenz Navigations-Elemente)
  'nc-item-gap':                                 ['nc-treeview-gap'],
  // TreeView: Badge-Radius folgt globalem Badge-Radius
  'nc-badge-radius':                             ['nc-treeview-badge-radius'],
  // Compare-Table: Shadow folgt Card-Shadow (Elevation-Konsistenz)
  'nc-card-shadow':                              ['nc-table-shadow', 'nc-dt-card-shadow', 'nc-dt-batch-shadow', 'nc-fieldset-card-shadow'],
  // Compare-Table: Border-Width folgt globalem Border-Width-XS
  'nc-table-border-width':                       ['nc-table-row-border-width'],
  // DataTable: Radius folgt Button-Radius (Formular-Konsistenz)
  'nc-button-radius-sm':                         ['nc-dt-radius', 'nc-pagination-item-radius', 'nc-cs-copy-radius']
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

  // Mirror-Mode: propagiere Aenderungen an abhaengige Tokens
  if (state.syncGeometry && MIRROR_TOKEN_MAP[tokenId]) {
    for (const targetId of MIRROR_TOKEN_MAP[tokenId]) {
      const targetComponent = extractComponentId(targetId)
      if (!targetComponent || !isComponentLocked(targetComponent)) {
        state.componentOverrides[state.activeThemeSet][targetId] = value
      }
    }
  }

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

  // Mirror-Mode: propagiere Reset an abhaengige Tokens
  if (state.syncGeometry && MIRROR_TOKEN_MAP[tokenId]) {
    for (const targetId of MIRROR_TOKEN_MAP[tokenId]) {
      const targetComponent = extractComponentId(targetId)
      if (!targetComponent || !isComponentLocked(targetComponent)) {
        delete state.componentOverrides[state.activeThemeSet][targetId]
      }
    }
  }

  return true
}

// ---------------------------------------------------------------------------
// Custom Spacing Tokens
// ---------------------------------------------------------------------------

function addCustomSpacingToken(key, value) {
  pushHistory()
  state.customSpacingTokens[state.activeThemeSet][key] = { label: key, value }
}

function removeCustomSpacingToken(key) {
  pushHistory()
  delete state.customSpacingTokens[state.activeThemeSet][key]
  // Also remove any semantic spacing references to this token
  const semantic = state.semanticSpacing[state.activeThemeSet]
  for (const [sKey, sVal] of Object.entries(semantic)) {
    if (sVal === `var(--fnd-spacing-${key})`) {
      delete semantic[sKey]
    }
  }
}

function addCustomRadiiToken(key, value) {
  pushHistory()
  state.customRadiiTokens[state.activeThemeSet][key] = { label: key, value }
}

function removeCustomRadiiToken(key) {
  pushHistory()
  delete state.customRadiiTokens[state.activeThemeSet][key]
}

function addCustomBorderWidthToken(key, value) {
  pushHistory()
  state.customBorderWidthTokens[state.activeThemeSet][key] = { label: key, value }
}

function removeCustomBorderWidthToken(key) {
  pushHistory()
  delete state.customBorderWidthTokens[state.activeThemeSet][key]
}

function addCustomMediaRatioToken(key, value, label) {
  pushHistory()
  state.customMediaRatioTokens[state.activeThemeSet][key] = { label: label || key, value }
}

function removeCustomMediaRatioToken(key) {
  pushHistory()
  delete state.customMediaRatioTokens[state.activeThemeSet][key]
}

function addCustomShadowToken(key, value, label) {
  pushHistory()
  state.customShadowTokens[state.activeThemeSet][key] = { label: label || key.toUpperCase(), value }
}

function removeCustomShadowToken(key) {
  pushHistory()
  delete state.customShadowTokens[state.activeThemeSet][key]
  // Remove elevation references pointing to this custom shadow
  const elevations = state.customElevationTokens[state.activeThemeSet]
  for (const [eKey, eVal] of Object.entries(elevations)) {
    if (eVal.value === key) delete elevations[eKey]
  }
}

function addCustomElevationToken(key, value, label) {
  pushHistory()
  state.customElevationTokens[state.activeThemeSet][key] = { label: label || key, value }
}

function removeCustomElevationToken(key) {
  pushHistory()
  delete state.customElevationTokens[state.activeThemeSet][key]
}

function addCustomOpacityToken(key, value, label) {
  pushHistory()
  state.customOpacityTokens[state.activeThemeSet][key] = { label: label || key, value: Number(value) }
}

function removeCustomOpacityToken(key) {
  pushHistory()
  delete state.customOpacityTokens[state.activeThemeSet][key]
}

function addCustomZindexToken(key, value, label) {
  pushHistory()
  state.customZindexTokens[state.activeThemeSet][key] = { label: label || key, value: Number(value) }
}

function removeCustomZindexToken(key) {
  pushHistory()
  delete state.customZindexTokens[state.activeThemeSet][key]
}

function addCustomMotionToken(key, value, label, type) {
  pushHistory()
  state.customMotionTokens[state.activeThemeSet][key] = { label: label || key, value, type: type || 'duration' }
}

function removeCustomMotionToken(key) {
  pushHistory()
  delete state.customMotionTokens[state.activeThemeSet][key]
}

function addCustomMotionEffectToken(key, value, label, transition, intent) {
  pushHistory()
  state.customMotionEffectTokens[state.activeThemeSet][key] = {
    label: label || key,
    value,
    transition: transition || '',
    intent: intent || 'state-change'
  }
}

function removeCustomMotionEffectToken(key) {
  pushHistory()
  delete state.customMotionEffectTokens[state.activeThemeSet][key]
}

function addIconLibrary(library) {
  pushHistory()
  state.iconLibraries[state.activeThemeSet].push(library)
  // Initialisiere per-Library Stroke Defaults
  const ts = state.activeThemeSet
  if (!state.iconStrokeWidths[ts][library.id]) {
    state.iconStrokeWidths[ts][library.id] = { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' }
  }
  if (!state.iconStrokeColors[ts][library.id]) {
    state.iconStrokeColors[ts][library.id] = { light: 'currentColor', dark: 'currentColor' }
  }
}

function removeIconLibrary(id) {
  pushHistory()
  const ts = state.activeThemeSet
  const libs = state.iconLibraries[ts]
  const idx = libs.findIndex(l => l.id === id)
  if (idx >= 0 && !libs[idx].builtIn) {
    libs.splice(idx, 1)
    // Per-Library Stroke-Daten aufraumen
    delete state.iconStrokeWidths[ts][id]
    delete state.iconStrokeColors[ts][id]
  }
}

function updateIconStrokeWidth(libraryId, size, value) {
  pushHistory()
  const ts = state.activeThemeSet
  if (!state.iconStrokeWidths[ts][libraryId]) {
    state.iconStrokeWidths[ts][libraryId] = { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' }
  }
  state.iconStrokeWidths[ts][libraryId][size] = value
}

function updateIconStrokeColor(libraryId, mode, value) {
  pushHistory()
  const ts = state.activeThemeSet
  if (!state.iconStrokeColors[ts][libraryId]) {
    state.iconStrokeColors[ts][libraryId] = { light: 'currentColor', dark: 'currentColor' }
  }
  state.iconStrokeColors[ts][libraryId][mode] = value
}

function updateSemanticSpacing(key, value) {
  pushHistory()
  state.semanticSpacing[state.activeThemeSet][key] = value
}

function removeSemanticSpacing(key) {
  pushHistory()
  delete state.semanticSpacing[state.activeThemeSet][key]
}

function addSemanticSpacingToken(key, spacingRef) {
  pushHistory()
  state.semanticSpacing[state.activeThemeSet][key] = spacingRef
}

// ---------------------------------------------------------------------------
// Semantic Typography Tokens
// ---------------------------------------------------------------------------

function updateSemanticTypography(key, value) {
  pushHistory()
  state.semanticTypography[state.activeThemeSet][key] = value
}

function removeSemanticTypography(key) {
  pushHistory()
  delete state.semanticTypography[state.activeThemeSet][key]
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
  state.customSpacingTokens[themeSet] = {}
  state.customRadiiTokens[themeSet] = {}
  state.customBorderWidthTokens[themeSet] = {}
  state.customMediaRatioTokens[themeSet] = {}
  state.customShadowTokens[themeSet] = {}
  state.customElevationTokens[themeSet] = {}
  state.customOpacityTokens[themeSet] = {}
  state.customZindexTokens[themeSet] = {}
  state.customMotionTokens[themeSet] = {}
  state.customMotionEffectTokens[themeSet] = {}
  state.iconLibraries[themeSet] = [
    { id: 'tabler', name: 'Tabler Icons', builtIn: true, iconCount: 5254, manifestPath: '/data/icons-manifest.json' },
    { id: 'heroicons', name: 'Heroicons', builtIn: true, iconCount: 324, manifestPath: '/data/icons-manifest-heroicons.json' }
  ]
  state.iconStrokeWidths[themeSet] = {
    tabler: { xs: '1', sm: '1.5', md: '1.5', lg: '2', xl: '2', '2xl': '2' },
    heroicons: { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' }
  }
  state.iconStrokeColors[themeSet] = {
    tabler: { light: 'currentColor', dark: 'currentColor' },
    heroicons: { light: 'currentColor', dark: 'currentColor' }
  }
  state.semanticSpacing[themeSet] = {}
  state.semanticTypography[themeSet] = {}
}

// ---------------------------------------------------------------------------
// History (Undo)
// ---------------------------------------------------------------------------

// Modell (korrigiert 29.09.2026):
//   pushHistory() wird VOR einer Aenderung aufgerufen und legt den Zustand
//   davor ab. Der aktuelle Zustand steht deshalb nicht in der History.
//   historyIndex zeigt auf den Schnappschuss, den das naechste Undo
//   wiederherstellt (-1 = nichts mehr rueckgaengig zu machen).
//   Beim ersten Undo an der Spitze wird der aktuelle Zustand nachgetragen,
//   damit Redo ihn wieder erreicht.
// Vorher sprang Undo auf history[index-1]: eine einzelne Aenderung liess sich
// nicht zuruecknehmen, bei mehreren wurde eine uebersprungen, und Redo kam
// nie beim letzten Stand an.

// EIN Schema fuer alle Theme-Inhalte (H1, 29.09.2026). Undo, benannte
// Themes, Branches und Merge benutzen dieselbe Liste. Vorher gab es vier
// Abschriften mit 9, 10 und 24 Feldern: Custom-Tokens, Icons und die
// semantischen Spacing/Typo-Werte fielen aus Undo und Branches heraus und
// "leckten" zwischen Branches.
// Neues Theme-Feld? Hier eintragen — der Test in theme-schema.test.js prueft,
// dass saveToStorage() es auch persistiert.
export const THEME_DATA_KEYS = [
  'themes', 'foundationOverrides', 'componentOverrides', 'primitiveOverrides',
  'customFonts', 'focusRingMode', 'componentLocks', 'componentVersions',
  'variantDefinitions',
  'customSpacingTokens', 'customRadiiTokens', 'customBorderWidthTokens',
  'customMediaRatioTokens', 'customShadowTokens', 'customElevationTokens',
  'customOpacityTokens', 'customZindexTokens', 'customMotionTokens',
  'customMotionEffectTokens',
  'iconLibraries', 'iconStrokeWidths', 'iconStrokeColors',
  'semanticSpacing', 'semanticTypography'
]
const HISTORY_KEYS = THEME_DATA_KEYS
const HISTORY_MAX = 50
// Aenderungen, die schneller aufeinander folgen (Slider, Farbrad), werden zu
// EINEM Undo-Schritt zusammengefasst — sonst legt jeder Slider-Tick einen
// vollstaendigen Schnappschuss an und ein Undo nimmt nur 1 px zurueck.
const HISTORY_COALESCE_MS = 400
let lastPushAt = 0

/** Tiefe Kopie aller Theme-Inhalte (optional mit activeThemeSet). */
function snapshotThemeData({ withActiveSet = false } = {}) {
  const snap = {}
  for (const key of THEME_DATA_KEYS) snap[key] = state[key]
  if (withActiveSet) snap.activeThemeSet = state.activeThemeSet
  return deepClone(snap)
}

/** Schnappschuss zurueckspielen. Fehlende Felder (aeltere Daten) bleiben. */
function applyThemeData(snapshot) {
  if (!snapshot) return
  for (const key of THEME_DATA_KEYS) {
    if (snapshot[key] !== undefined && snapshot[key] !== null) {
      Object.assign(state[key], deepClone(snapshot[key]))
    }
  }
  if (snapshot.activeThemeSet) state.activeThemeSet = snapshot.activeThemeSet
}

const historySnapshot = () => snapshotThemeData()
const applyHistorySnapshot = (snap) => applyThemeData(snap)

function pushHistory() {
  const now = Date.now()
  const atTip = state.historyIndex === state.history.length - 1
  if (atTip && state.history.length && now - lastPushAt < HISTORY_COALESCE_MS) {
    lastPushAt = now
    return
  }
  lastPushAt = now
  state.history = state.history.slice(0, state.historyIndex + 1)
  state.history.push(historySnapshot())
  state.historyIndex = state.history.length - 1
  if (state.history.length > HISTORY_MAX) {
    state.history.shift()
    state.historyIndex--
  }
}

function canUndo() {
  return state.historyIndex >= 0
}

function canRedo() {
  return state.historyIndex + 2 <= state.history.length - 1
}

function undo() {
  if (!canUndo()) return
  if (state.historyIndex === state.history.length - 1) {
    // An der Spitze: aktuellen Zustand sichern, damit Redo ihn erreicht.
    state.history.push(historySnapshot())
  }
  applyHistorySnapshot(state.history[state.historyIndex])
  state.historyIndex--
  lastPushAt = 0
}

function redo() {
  if (!canRedo()) return
  applyHistorySnapshot(state.history[state.historyIndex + 2])
  state.historyIndex++
  lastPushAt = 0
}

// ---------------------------------------------------------------------------
// Theme Management — Create, Load, Save, Delete
// ---------------------------------------------------------------------------

function generateThemeId() {
  return 'theme-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
}

function getThemeSnapshot() {
  return snapshotThemeData({ withActiveSet: true })
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
  // Nur ABWEICHUNGEN vom Design System, mit korrekten CSS-Namen (foundation-css.js).
  const fndOverrides = state.foundationOverrides[themeSet]
  if (fndOverrides && Object.keys(fndOverrides).length > 0) {
    const { zeilen, uebersprungen } = foundationZeilen(fndOverrides)
    if (zeilen.length) {
      lines.push(`/* === Foundation Overrides (nur Abweichungen) === */`)
      lines.push(`:root {`)
      lines.push(...zeilen)
      lines.push('}\n')
    }
    if (uebersprungen.length) {
      lines.push(`/* Nicht exportiert — im DS nicht vorhanden: ${uebersprungen.join(', ')} */\n`)
    }
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
      customSpacingTokens: toRaw(state.customSpacingTokens),
      customRadiiTokens: toRaw(state.customRadiiTokens),
      customBorderWidthTokens: toRaw(state.customBorderWidthTokens),
      customMediaRatioTokens: toRaw(state.customMediaRatioTokens),
      customShadowTokens: toRaw(state.customShadowTokens),
      customElevationTokens: toRaw(state.customElevationTokens),
      customOpacityTokens: toRaw(state.customOpacityTokens),
      customZindexTokens: toRaw(state.customZindexTokens),
      customMotionTokens: toRaw(state.customMotionTokens),
      customMotionEffectTokens: toRaw(state.customMotionEffectTokens),
      iconLibraries: toRaw(state.iconLibraries),
      iconStrokeWidths: toRaw(state.iconStrokeWidths),
      iconStrokeColors: toRaw(state.iconStrokeColors),
      semanticSpacing: toRaw(state.semanticSpacing),
      semanticTypography: toRaw(state.semanticTypography),
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
          customSpacingTokens: JSON.parse(JSON.stringify(toRaw(state.customSpacingTokens))),
          customRadiiTokens: JSON.parse(JSON.stringify(toRaw(state.customRadiiTokens))),
          customBorderWidthTokens: JSON.parse(JSON.stringify(toRaw(state.customBorderWidthTokens))),
          customMediaRatioTokens: JSON.parse(JSON.stringify(toRaw(state.customMediaRatioTokens))),
          customShadowTokens: JSON.parse(JSON.stringify(toRaw(state.customShadowTokens))),
          customElevationTokens: JSON.parse(JSON.stringify(toRaw(state.customElevationTokens))),
          customOpacityTokens: JSON.parse(JSON.stringify(toRaw(state.customOpacityTokens))),
          customZindexTokens: JSON.parse(JSON.stringify(toRaw(state.customZindexTokens))),
          customMotionTokens: JSON.parse(JSON.stringify(toRaw(state.customMotionTokens))),
          customMotionEffectTokens: JSON.parse(JSON.stringify(toRaw(state.customMotionEffectTokens))),
          iconLibraries: JSON.parse(JSON.stringify(toRaw(state.iconLibraries))),
          iconStrokeWidths: JSON.parse(JSON.stringify(toRaw(state.iconStrokeWidths))),
          iconStrokeColors: JSON.parse(JSON.stringify(toRaw(state.iconStrokeColors))),
          semanticSpacing: JSON.parse(JSON.stringify(toRaw(state.semanticSpacing))),
          semanticTypography: JSON.parse(JSON.stringify(toRaw(state.semanticTypography))),
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
      if (data.customSpacingTokens) Object.assign(state.customSpacingTokens, data.customSpacingTokens)
      if (data.customRadiiTokens) Object.assign(state.customRadiiTokens, data.customRadiiTokens)
      if (data.customBorderWidthTokens) Object.assign(state.customBorderWidthTokens, data.customBorderWidthTokens)
      if (data.customMediaRatioTokens) Object.assign(state.customMediaRatioTokens, data.customMediaRatioTokens)
      if (data.customShadowTokens) Object.assign(state.customShadowTokens, data.customShadowTokens)
      if (data.customElevationTokens) Object.assign(state.customElevationTokens, data.customElevationTokens)
      if (data.customOpacityTokens) Object.assign(state.customOpacityTokens, data.customOpacityTokens)
      if (data.customZindexTokens) Object.assign(state.customZindexTokens, data.customZindexTokens)
      if (data.customMotionTokens) Object.assign(state.customMotionTokens, data.customMotionTokens)
      if (data.customMotionEffectTokens) Object.assign(state.customMotionEffectTokens, data.customMotionEffectTokens)
      if (data.iconLibraries) Object.assign(state.iconLibraries, data.iconLibraries)
      if (data.iconStrokeWidths) Object.assign(state.iconStrokeWidths, data.iconStrokeWidths)
      if (data.iconStrokeColors) Object.assign(state.iconStrokeColors, data.iconStrokeColors)

      // --- Migration: Built-in Icon Libraries sicherstellen ---
      const builtInLibs = [
        { id: 'tabler', name: 'Tabler Icons', builtIn: true, iconCount: 5254, manifestPath: '/data/icons-manifest.json' },
        { id: 'heroicons', name: 'Heroicons', builtIn: true, iconCount: 324, manifestPath: '/data/icons-manifest-heroicons.json' }
      ]
      const defaultStrokes = {
        tabler: { xs: '1', sm: '1.5', md: '1.5', lg: '2', xl: '2', '2xl': '2' },
        heroicons: { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' }
      }
      const defaultColors = {
        tabler: { light: 'currentColor', dark: 'currentColor' },
        heroicons: { light: 'currentColor', dark: 'currentColor' }
      }
      for (const ts of ['neo', 'customer']) {
        const libs = state.iconLibraries[ts]
        // Sicherstellen, dass alle Built-in Libraries vorhanden sind + manifestPath haben
        for (const builtIn of builtInLibs) {
          const existing = libs.find(l => l.id === builtIn.id)
          if (!existing) {
            libs.push(builtIn)
          } else {
            if (!existing.manifestPath) existing.manifestPath = builtIn.manifestPath
            if (!existing.builtIn) existing.builtIn = builtIn.builtIn
          }
        }
        // Per-Library Stroke-Daten migrieren (alte Flat-Struktur → nested)
        const sw = state.iconStrokeWidths[ts]
        if (sw && !sw.tabler && sw.xs !== undefined) {
          // Alte Flat-Struktur: { xs: '1', ... } → { tabler: { xs: '1', ... } }
          state.iconStrokeWidths[ts] = { tabler: { ...sw }, heroicons: defaultStrokes.heroicons }
        }
        // Sicherstellen, dass jede Library Stroke Widths hat
        if (!state.iconStrokeWidths[ts].tabler) state.iconStrokeWidths[ts].tabler = defaultStrokes.tabler
        if (!state.iconStrokeWidths[ts].heroicons) state.iconStrokeWidths[ts].heroicons = defaultStrokes.heroicons

        const sc = state.iconStrokeColors[ts]
        if (sc && !sc.tabler && (sc.light !== undefined || sc.dark !== undefined)) {
          // Alte Flat-Struktur: { light: '...', dark: '...' } → { tabler: { ... } }
          state.iconStrokeColors[ts] = { tabler: { ...sc }, heroicons: defaultColors.heroicons }
        }
        if (!state.iconStrokeColors[ts].tabler) state.iconStrokeColors[ts].tabler = defaultColors.tabler
        if (!state.iconStrokeColors[ts].heroicons) state.iconStrokeColors[ts].heroicons = defaultColors.heroicons
      }
      if (data.semanticSpacing) Object.assign(state.semanticSpacing, data.semanticSpacing)
      if (data.semanticTypography) Object.assign(state.semanticTypography, data.semanticTypography)
      if (data.activeThemeSet) state.activeThemeSet = data.activeThemeSet
      // previewMode wird NICHT restored — startet immer im Light Mode
      state.previewMode = 'light'
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
  () => [state.themes, state.foundationOverrides, state.componentOverrides, state.primitiveOverrides, state.customFonts, state.focusRingMode, state.componentLocks, state.componentVersions, state.variantDefinitions, state.customSpacingTokens, state.customRadiiTokens, state.customBorderWidthTokens, state.customMediaRatioTokens, state.customShadowTokens, state.customElevationTokens, state.customOpacityTokens, state.customZindexTokens, state.customMotionTokens, state.customMotionEffectTokens, state.iconLibraries, state.iconStrokeWidths, state.iconStrokeColors, state.semanticSpacing, state.semanticTypography],
  () => saveToStorage(),
  { deep: true }
)

// Aktive Sektion separat speichern (leichtgewichtig, kein deep watch noetig)
watch(() => state.activeSection, () => saveToStorage())

// ---------------------------------------------------------------------------
// Multi-Theme Operations (Phase 5)
// ---------------------------------------------------------------------------

/**
 * Kopiert alle Component-Overrides von einem Theme-Set zum anderen.
 * @param {'neo'|'customer'} fromSet
 * @param {'neo'|'customer'} toSet
 */
function copyThemeOverrides(fromSet, toSet) {
  // Component Overrides
  state.componentOverrides[toSet] = { ...state.componentOverrides[fromSet] }

  // Semantic Tokens (Light + Dark)
  state.themes[toSet] = {
    light: { ...state.themes[fromSet].light },
    dark: { ...state.themes[fromSet].dark }
  }

  // Foundation Overrides
  state.foundationOverrides[toSet] = JSON.parse(JSON.stringify(state.foundationOverrides[fromSet] || {}))

  // Primitive Overrides
  state.primitiveOverrides[toSet] = { ...state.primitiveOverrides[fromSet] }

  saveToStorage()
}

/**
 * Gibt alle Tokens zurueck die zwischen zwei Theme-Sets divergieren.
 * @param {'neo'|'customer'} setA
 * @param {'neo'|'customer'} setB
 * @returns {{ semantic: string[], component: string[], foundation: string[] }}
 */
function diffThemeSets(setA = 'neo', setB = 'customer') {
  const diff = { semantic: [], component: [], foundation: [] }

  // Semantic Diffs (Light + Dark)
  for (const mode of ['light', 'dark']) {
    const a = state.themes[setA]?.[mode] || {}
    const b = state.themes[setB]?.[mode] || {}
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)])
    for (const key of allKeys) {
      if (a[key] !== b[key] && !diff.semantic.includes(`${mode}:${key}`)) {
        diff.semantic.push(`${mode}:${key}`)
      }
    }
  }

  // Component Override Diffs
  const compA = state.componentOverrides[setA] || {}
  const compB = state.componentOverrides[setB] || {}
  const allCompKeys = new Set([...Object.keys(compA), ...Object.keys(compB)])
  for (const key of allCompKeys) {
    if (compA[key] !== compB[key]) diff.component.push(key)
  }

  // Foundation Override Diffs
  const fndA = state.foundationOverrides[setA] || {}
  const fndB = state.foundationOverrides[setB] || {}
  const allFndKeys = new Set([...Object.keys(fndA), ...Object.keys(fndB)])
  for (const key of allFndKeys) {
    if (JSON.stringify(fndA[key]) !== JSON.stringify(fndB[key])) diff.foundation.push(key)
  }

  return diff
}

/**
 * Setzt das Customer Theme auf Neo-Defaults zurueck.
 */
function resetCustomerToNeo() {
  copyThemeOverrides('neo', 'customer')
}

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
    setSyncGeometry,
    getFormVariant,
    setFormVariant,
    setHighlightedToken,
    clearHighlightedToken,
    setArenaFilter,
    resetArenaFilters,
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
    // Custom Spacing
    addCustomSpacingToken,
    removeCustomSpacingToken,
    updateSemanticSpacing,
    removeSemanticSpacing,
    addSemanticSpacingToken,
    currentCustomSpacingTokens,
    currentSemanticSpacing,
    // Custom Radii
    addCustomRadiiToken,
    removeCustomRadiiToken,
    currentCustomRadiiTokens,
    addCustomBorderWidthToken,
    removeCustomBorderWidthToken,
    currentCustomBorderWidthTokens,
    addCustomMediaRatioToken,
    removeCustomMediaRatioToken,
    currentCustomMediaRatioTokens,
    // Custom Shadows & Elevation
    addCustomShadowToken,
    removeCustomShadowToken,
    addCustomElevationToken,
    removeCustomElevationToken,
    currentCustomShadowTokens,
    currentCustomElevationTokens,
    // Custom Opacity, Z-Index, Motion
    addCustomOpacityToken,
    removeCustomOpacityToken,
    currentCustomOpacityTokens,
    addCustomZindexToken,
    removeCustomZindexToken,
    currentCustomZindexTokens,
    addCustomMotionToken,
    removeCustomMotionToken,
    currentCustomMotionTokens,
    addCustomMotionEffectToken,
    removeCustomMotionEffectToken,
    currentCustomMotionEffectTokens,
    // Icon Libraries
    addIconLibrary,
    removeIconLibrary,
    updateIconStrokeWidth,
    updateIconStrokeColor,
    currentIconLibraries,
    currentIconStrokeWidths,
    currentIconStrokeColors,
    currentSemanticTypography,
    // Semantic Typography
    updateSemanticTypography,
    removeSemanticTypography,
    resetToDefaults,
    undo,
    redo,
    canUndo,
    canRedo,
    snapshotThemeData,
    applyThemeData,
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
    saveToStorage,
    // Multi-Theme Operations
    copyThemeOverrides,
    diffThemeSets,
    resetCustomerToNeo
  }
}
