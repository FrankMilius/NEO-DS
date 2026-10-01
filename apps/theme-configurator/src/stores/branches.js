// @ts-check
// ==========================================================================
// NEO Theme Configurator — Branch Management Store
// ==========================================================================
// Git-artiges Branching fuer Theme-Konfiguration.
// Branches isolieren Aenderungen, Merge fuehrt sie zusammen.
// Releases erzeugen immutable Snapshots.
// ==========================================================================

import { reactive, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'

// ---------------------------------------------------------------------------
// Deep-clone helper
// ---------------------------------------------------------------------------
function deepClone(obj) {
  return JSON.parse(JSON.stringify(toRaw(obj)))
}

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------
const BRANCHES_KEY = 'neo-theme-branches'
const RELEASES_KEY = 'neo-theme-releases'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const state = reactive({
  branches: {},         // { [id]: BranchData }
  activeBranchId: null, // null = main
  releases: []          // Published immutable snapshots
})

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------

const branchList = computed(() => {
  return Object.values(state.branches).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

const activeBranch = computed(() => {
  if (!state.activeBranchId) return null
  return state.branches[state.activeBranchId] || null
})

const activeBranchName = computed(() => {
  if (!state.activeBranchId) return 'main'
  return state.branches[state.activeBranchId]?.name || 'unknown'
})

const isOnMain = computed(() => state.activeBranchId === null)

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

/**
 * Generate a unique branch ID.
 */
function generateBranchId() {
  return 'branch-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
}

/**
 * Create a new branch from the current main state.
 * @param {string} name - Branch name (e.g. "button-redesign")
 * @param {string} description - Optional description
 * @param {Function} getSnapshot - Function that returns the current theme snapshot
 * @returns {object} The created branch
 */
function createBranch(name, description, getSnapshot) {
  const id = generateBranchId()
  const snapshot = getSnapshot()

  const branch = {
    id,
    name,
    description: description || '',
    parentBranch: state.activeBranchId || 'main',
    parentSnapshot: deepClone(snapshot),
    snapshot: deepClone(snapshot),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  state.branches[id] = branch
  persistBranches()
  return branch
}

/**
 * Switch to a branch. Saves current state to active branch first.
 * @param {string|null} branchId - null = switch to main
 * @param {Function} getSnapshot - Returns current state snapshot
 * @param {Function} applySnapshot - Applies a snapshot to the theme store
 */
function switchBranch(branchId, getSnapshot, applySnapshot) {
  // Save current state to active branch
  if (state.activeBranchId && state.branches[state.activeBranchId]) {
    state.branches[state.activeBranchId].snapshot = getSnapshot()
    state.branches[state.activeBranchId].updatedAt = new Date().toISOString()
  }

  state.activeBranchId = branchId

  // Load target branch state
  if (branchId && state.branches[branchId]) {
    applySnapshot(deepClone(state.branches[branchId].snapshot))
  }
  // If switching to main, the theme store already has main state
  // (it's the "live" state, branches hold copies)

  persistBranches()
}

/**
 * Save current state to the active branch.
 * @param {Function} getSnapshot - Returns current state snapshot
 */
function saveBranchState(getSnapshot) {
  if (!state.activeBranchId) return
  const branch = state.branches[state.activeBranchId]
  if (!branch) return

  branch.snapshot = getSnapshot()
  branch.updatedAt = new Date().toISOString()
  persistBranches()
}

/**
 * Delete a branch.
 * @param {string} branchId
 * @returns {boolean} Success
 */
function deleteBranch(branchId) {
  if (branchId === state.activeBranchId) {
    console.warn('[Branches] Cannot delete the active branch. Switch to main first.')
    return false
  }
  if (!state.branches[branchId]) return false

  delete state.branches[branchId]
  persistBranches()
  return true
}

/**
 * Compute a 3-way merge between source branch and main.
 * Returns { autoMerged, conflicts }.
 * @param {string} sourceId - The branch to merge
 * @param {Function} getMainSnapshot - Returns current main snapshot
 * @returns {{ autoMerged: object, conflicts: Array }}
 */
function computeMerge(sourceId, getMainSnapshot) {
  const branch = state.branches[sourceId]
  if (!branch) return { autoMerged: {}, conflicts: [] }

  const base = branch.parentSnapshot
  const source = branch.snapshot
  const target = getMainSnapshot()

  const autoMerged = {}
  const conflicts = []

  // Merge component overrides
  mergeOverrideLayer('componentOverrides', base, source, target, autoMerged, conflicts)

  // Merge foundation overrides
  mergeFoundationLayer(base, source, target, autoMerged, conflicts)

  // Merge semantic tokens (light + dark)
  for (const mode of ['light', 'dark']) {
    mergeSemanticLayer(mode, base, source, target, autoMerged, conflicts)
  }

  // Merge component locks and versions
  mergeFlatLayer('componentLocks', base, source, target, autoMerged, conflicts)
  mergeFlatLayer('componentVersions', base, source, target, autoMerged, conflicts)

  return { autoMerged, conflicts }
}

/**
 * Merge component overrides (flat key-value per theme set).
 */
function mergeOverrideLayer(layerName, base, source, target, autoMerged, conflicts) {
  for (const themeSet of ['neo', 'customer']) {
    const baseOverrides = base[layerName]?.[themeSet] || {}
    const sourceOverrides = source[layerName]?.[themeSet] || {}
    const targetOverrides = target[layerName]?.[themeSet] || {}

    const allKeys = new Set([
      ...Object.keys(baseOverrides),
      ...Object.keys(sourceOverrides),
      ...Object.keys(targetOverrides)
    ])

    for (const key of allKeys) {
      const bVal = baseOverrides[key]
      const sVal = sourceOverrides[key]
      const tVal = targetOverrides[key]

      const sourceChanged = sVal !== bVal
      const targetChanged = tVal !== bVal

      if (sourceChanged && !targetChanged) {
        // Source changed, target didn't → take source
        if (!autoMerged[layerName]) autoMerged[layerName] = {}
        if (!autoMerged[layerName][themeSet]) autoMerged[layerName][themeSet] = {}
        autoMerged[layerName][themeSet][key] = sVal
      } else if (sourceChanged && targetChanged && sVal !== tVal) {
        // Both changed to different values → conflict
        conflicts.push({
          layer: layerName,
          themeSet,
          key,
          sourceValue: sVal,
          targetValue: tVal,
          baseValue: bVal
        })
      }
      // If only target changed, or neither changed, keep target (no action needed)
    }
  }
}

/**
 * Merge foundation overrides (nested: category → key → value).
 */
function mergeFoundationLayer(base, source, target, autoMerged, conflicts) {
  for (const themeSet of ['neo', 'customer']) {
    const baseF = base.foundationOverrides?.[themeSet] || {}
    const sourceF = source.foundationOverrides?.[themeSet] || {}
    const targetF = target.foundationOverrides?.[themeSet] || {}

    const allCats = new Set([...Object.keys(baseF), ...Object.keys(sourceF), ...Object.keys(targetF)])

    for (const cat of allCats) {
      const baseCat = baseF[cat] || {}
      const sourceCat = sourceF[cat] || {}
      const targetCat = targetF[cat] || {}

      const allKeys = new Set([...Object.keys(baseCat), ...Object.keys(sourceCat), ...Object.keys(targetCat)])

      for (const key of allKeys) {
        const bVal = baseCat[key]
        const sVal = sourceCat[key]
        const tVal = targetCat[key]

        const sourceChanged = sVal !== bVal
        const targetChanged = tVal !== bVal

        if (sourceChanged && !targetChanged) {
          if (!autoMerged.foundationOverrides) autoMerged.foundationOverrides = {}
          if (!autoMerged.foundationOverrides[themeSet]) autoMerged.foundationOverrides[themeSet] = {}
          if (!autoMerged.foundationOverrides[themeSet][cat]) autoMerged.foundationOverrides[themeSet][cat] = {}
          autoMerged.foundationOverrides[themeSet][cat][key] = sVal
        } else if (sourceChanged && targetChanged && sVal !== tVal) {
          conflicts.push({
            layer: 'foundationOverrides',
            themeSet,
            key: `${cat}.${key}`,
            sourceValue: sVal,
            targetValue: tVal,
            baseValue: bVal
          })
        }
      }
    }
  }
}

/**
 * Merge semantic tokens for a given mode (light/dark).
 */
function mergeSemanticLayer(mode, base, source, target, autoMerged, conflicts) {
  for (const themeSet of ['neo', 'customer']) {
    const baseTokens = base.themes?.[themeSet]?.[mode] || {}
    const sourceTokens = source.themes?.[themeSet]?.[mode] || {}
    const targetTokens = target.themes?.[themeSet]?.[mode] || {}

    const allKeys = new Set([...Object.keys(baseTokens), ...Object.keys(sourceTokens), ...Object.keys(targetTokens)])

    for (const key of allKeys) {
      const bVal = baseTokens[key]
      const sVal = sourceTokens[key]
      const tVal = targetTokens[key]

      const sourceChanged = sVal !== bVal
      const targetChanged = tVal !== bVal

      if (sourceChanged && !targetChanged) {
        if (!autoMerged.themes) autoMerged.themes = {}
        if (!autoMerged.themes[themeSet]) autoMerged.themes[themeSet] = {}
        if (!autoMerged.themes[themeSet][mode]) autoMerged.themes[themeSet][mode] = {}
        autoMerged.themes[themeSet][mode][key] = sVal
      } else if (sourceChanged && targetChanged && sVal !== tVal) {
        conflicts.push({
          layer: 'themes',
          themeSet,
          key: `${mode}.${key}`,
          sourceValue: sVal,
          targetValue: tVal,
          baseValue: bVal
        })
      }
    }
  }
}

/**
 * Merge flat per-themeSet objects (componentLocks, componentVersions).
 */
function mergeFlatLayer(layerName, base, source, target, autoMerged, conflicts) {
  for (const themeSet of ['neo', 'customer']) {
    const baseObj = base[layerName]?.[themeSet] || {}
    const sourceObj = source[layerName]?.[themeSet] || {}
    const targetObj = target[layerName]?.[themeSet] || {}

    const allKeys = new Set([...Object.keys(baseObj), ...Object.keys(sourceObj), ...Object.keys(targetObj)])

    for (const key of allKeys) {
      const bVal = JSON.stringify(baseObj[key])
      const sVal = JSON.stringify(sourceObj[key])
      const tVal = JSON.stringify(targetObj[key])

      const sourceChanged = sVal !== bVal
      const targetChanged = tVal !== bVal

      if (sourceChanged && !targetChanged) {
        if (!autoMerged[layerName]) autoMerged[layerName] = {}
        if (!autoMerged[layerName][themeSet]) autoMerged[layerName][themeSet] = {}
        autoMerged[layerName][themeSet][key] = sourceObj[key]
      } else if (sourceChanged && targetChanged && sVal !== tVal) {
        conflicts.push({
          layer: layerName,
          themeSet,
          key,
          sourceValue: sourceObj[key],
          targetValue: targetObj[key],
          baseValue: baseObj[key]
        })
      }
    }
  }
}

/**
 * Apply a merge result to the main store.
 * @param {object} mergeResult - { autoMerged, resolvedConflicts }
 * @param {Function} applyMerge - Applies merged changes to theme store
 */
function applyMergeResult(sourceId, mergeResult, applyMerge) {
  applyMerge(mergeResult)

  // Delete the merged branch
  delete state.branches[sourceId]
  persistBranches()
}

/**
 * Publish a release — immutable snapshot of current main state.
 * @param {string} version - Semver version
 * @param {string} notes - Release notes
 * @param {Function} getSnapshot - Returns current main snapshot
 * @returns {object} The release entry
 */
function publishRelease(version, notes, getSnapshot) {
  const release = {
    id: 'release-' + Date.now(),
    version,
    notes: notes || '',
    publishedAt: new Date().toISOString(),
    snapshot: getSnapshot()
  }

  state.releases.unshift(release)
  persistReleases()
  return release
}

/**
 * Count changes in a branch relative to its parent snapshot.
 * @param {string} branchId
 * @returns {number}
 */
function countBranchChanges(branchId) {
  const branch = state.branches[branchId]
  if (!branch) return 0

  let count = 0
  const base = branch.parentSnapshot
  const current = branch.snapshot

  // Count component override changes
  for (const themeSet of ['neo', 'customer']) {
    const baseOverrides = base.componentOverrides?.[themeSet] || {}
    const currentOverrides = current.componentOverrides?.[themeSet] || {}
    const allKeys = new Set([...Object.keys(baseOverrides), ...Object.keys(currentOverrides)])
    for (const key of allKeys) {
      if (baseOverrides[key] !== currentOverrides[key]) count++
    }
  }

  return count
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

function persistBranches() {
  try {
    const data = {
      branches: toRaw(state.branches),
      activeBranchId: state.activeBranchId
    }
    localStorage.setItem(BRANCHES_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('[Branches] Failed to persist:', e)
  }
}

function persistReleases() {
  try {
    localStorage.setItem(RELEASES_KEY, JSON.stringify(toRaw(state.releases)))
  } catch (e) {
    console.warn('[Branches] Failed to persist releases:', e)
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(BRANCHES_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data.branches) state.branches = data.branches
      if (data.activeBranchId !== undefined) state.activeBranchId = data.activeBranchId
    }
  } catch (e) {
    console.warn('[Branches] Failed to load:', e)
  }

  try {
    const raw = localStorage.getItem(RELEASES_KEY)
    if (raw) {
      const list = JSON.parse(raw)
      if (Array.isArray(list)) state.releases = list
    }
  } catch (e) {
    console.warn('[Branches] Failed to load releases:', e)
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const useBranchStore = defineStore('branches', () => ({
  state,
  // Computed
  branchList,
  activeBranch,
  activeBranchName,
  isOnMain,
  // Actions
  createBranch,
  switchBranch,
  saveBranchState,
  deleteBranch,
  computeMerge,
  applyMergeResult,
  publishRelease,
  countBranchChanges,
  // Persistence
  loadFromStorage
}))
