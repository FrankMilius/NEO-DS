// Theme-Store · Komponenten-Sperre, Versionen und eigene Varianten
// (aufgeteilt aus stores/theme.js, Plan v2 3.3a — Verhalten unveraendert)

import { componentTokenGroups } from '../../data/tokens.js'
import { state } from './kern.js'
import { pushHistory } from './verlauf.js'

// Component Lock + Versioning
// ---------------------------------------------------------------------------

/**
 * Extract component ID from a token ID (e.g. "nc-button-primary-bg" → "button").
 * Handles multi-segment component names like "link-with-arrow", "data-table", etc.
 */
export function extractComponentId(tokenId) {
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
export function isComponentLocked(componentId) {
  return !!state.componentLocks[state.activeThemeSet][componentId]
}

/**
 * Lock a component — prevents token editing.
 * If no version exists yet, initializes to '1.0.0'.
 */
export function lockComponent(componentId) {
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
export function unlockComponent(componentId, bumpType = null) {
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
export function bumpComponentVersion(componentId, type) {
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
export function getComponentVersion(componentId) {
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
export function createVariant(componentId, variantName, baseVariant, axis, baseTokenIds) {
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
export function deleteVariant(componentId, variantName) {
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
export function getVariants(componentId) {
  return state.variantDefinitions[state.activeThemeSet][componentId] || {}
}
