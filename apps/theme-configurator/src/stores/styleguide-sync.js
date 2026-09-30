// ==========================================================================
// NEO Theme Configurator — Styleguide CI/CD Pipeline Store
// ==========================================================================
// Implements a best-of-breed CI/CD process for syncing theme changes
// to the Design System Documentation source files.
//
// Pipeline Stages:
//   1. DETECT  — Discover pending changes (custom palettes vs. existing)
//   2. FORGE   — Generate a "merge request" with diffs of all file changes
//   3. REVIEW  — Show the user exactly what will change (UpdateDialog)
//   4. MERGE   — Apply changes to the styleguide source files via API
//   5. VERIFY  — Confirm changes were applied, refresh status
//
// Files affected:
//   - scss/scss/00-settings/_color-primitives.scss
//   - docs/color-docs.html
//   - docs/color-docs.js
// ==========================================================================

import { reactive, computed, watch } from 'vue'
import { defineStore } from 'pinia'

// ---------------------------------------------------------------------------
// Pipeline State
// ---------------------------------------------------------------------------

const state = reactive({
  // --- Source of Truth (fetched from server) ---
  existingPalettes: [],   // [{ id, base }] — palettes already in SCSS
  loaded: false,          // Whether the initial fetch completed
  fetchError: null,       // Error message if fetch failed

  // --- Pipeline Stages ---
  stage: 'idle',          // idle | detecting | forging | review | merging | success | error
  stageMessage: '',       // Human-readable status message

  // --- Merge Request ---
  pendingPalettes: [],    // [{ id, label, base }] — palettes to be added
  mergeRequest: null,     // { palettes, files, diffs, timestamp }

  // --- Dialog ---
  showDialog: false,
  dialogContext: null,     // { trigger: 'add-palette' | 'manual', palette? }

  // --- History ---
  lastSync: null,         // { timestamp, palettes: [...], status: 'success' | 'error' }
  syncLog: []             // [{ timestamp, action, detail }]
})

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------

const hasPendingUpdates = computed(() => state.pendingPalettes.length > 0)
const pendingCount = computed(() => state.pendingPalettes.length)
const isProcessing = computed(() => ['detecting', 'forging', 'merging'].includes(state.stage))
const canMerge = computed(() => state.stage === 'review' && state.mergeRequest !== null)

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

function log(action, detail) {
  state.syncLog.push({
    timestamp: new Date().toISOString(),
    action,
    detail
  })
  // Keep max 100 log entries
  if (state.syncLog.length > 100) state.syncLog.shift()
  console.log(`[SYNC:${action}]`, detail)
}

// ---------------------------------------------------------------------------
// Stage 1: FETCH — Load existing styleguide state from server
// ---------------------------------------------------------------------------

async function fetchExistingPalettes() {
  state.fetchError = null
  try {
    log('fetch', 'Fetching existing palettes from /api/styleguide-status')
    const res = await fetch('/api/styleguide-status')
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${res.statusText}`)
    }
    const data = await res.json()
    if (data.status !== 'ok') {
      throw new Error(data.message || 'Unknown server error')
    }
    state.existingPalettes = data.palettes || []
    state.loaded = true
    state.fetchError = null
    log('fetch', `Loaded ${state.existingPalettes.length} existing palettes: ${state.existingPalettes.map(p => p.id).join(', ')}`)
  } catch (err) {
    console.warn('Could not fetch styleguide status:', err.message)
    state.existingPalettes = []
    state.loaded = true
    state.fetchError = err.message
    log('fetch-error', err.message)
  }
}

// ---------------------------------------------------------------------------
// Stage 2: DETECT — Find new palettes not yet in the styleguide
// ---------------------------------------------------------------------------

function detectPendingUpdates(customPalettes) {
  if (!Array.isArray(customPalettes)) return

  const existingIds = new Set(state.existingPalettes.map(p => p.id))
  const pending = customPalettes.filter(p => !existingIds.has(p.id))

  state.pendingPalettes = pending.map(p => ({
    id: p.id,
    label: p.label,
    base: p.base
  }))

  log('detect', `Found ${pending.length} pending palette(s): ${pending.map(p => p.id).join(', ') || 'none'}`)
  return pending.length > 0
}

// ---------------------------------------------------------------------------
// Stage 3: FORGE — Create the "merge request" with preview of changes
// ---------------------------------------------------------------------------

async function forgeMergeRequest() {
  if (state.pendingPalettes.length === 0) return false

  state.stage = 'forging'
  state.stageMessage = 'Generating merge request...'
  log('forge', `Creating merge request for ${state.pendingPalettes.length} palette(s)`)

  try {
    // Request diff preview from the server
    const res = await fetch('/api/preview-styleguide-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        palettes: state.pendingPalettes.map(p => ({
          id: p.id,
          label: p.label,
          base: p.base
        }))
      })
    })

    const data = await res.json()

    if (!res.ok || data.status !== 'ok') {
      throw new Error(data.message || 'Failed to generate merge request')
    }

    state.mergeRequest = {
      palettes: [...state.pendingPalettes],
      files: data.files || [],
      diffs: data.diffs || [],
      timestamp: new Date().toISOString(),
      summary: data.summary || ''
    }

    state.stage = 'review'
    state.stageMessage = 'Review changes before merging'
    log('forge', `Merge request ready: ${data.diffs?.length || 0} file diff(s)`)
    return true

  } catch (err) {
    // Fallback: create merge request without diff preview
    // (server may not have the preview endpoint yet)
    log('forge-fallback', 'Preview API unavailable, creating basic merge request: ' + err.message)

    state.mergeRequest = {
      palettes: [...state.pendingPalettes],
      files: [
        { path: 'scss/scss/00-settings/_color-primitives.scss', type: 'scss', action: 'modify' },
        { path: 'docs/color-docs.html', type: 'html', action: 'modify' },
        { path: 'docs/color-docs.js', type: 'js', action: 'modify' }
      ],
      diffs: state.pendingPalettes.map(p => ({
        palette: p.id,
        changes: [
          { file: '_color-primitives.scss', lines: [`+ $_${p.id}-base: ${p.base} !default;`, `+ $${p.id}: fn.generate-shade-scale($_${p.id}-base) !default;`, `+ @each $step, $color in $${p.id} { --fnd-primitive-${p.id}-#{$step}: #{$color}; }`] },
          { file: 'color-docs.html', lines: [`+ <h4>${p.label}</h4>`, `+ <div id="scale-${p.id}"></div>`] },
          { file: 'color-docs.js', lines: [`+ ${p.id}: ['--fnd-primitive-${p.id}-', steps10]`] }
        ]
      })),
      timestamp: new Date().toISOString(),
      summary: `Add ${state.pendingPalettes.length} supporting palette(s) to the Design System`
    }

    state.stage = 'review'
    state.stageMessage = 'Review changes before merging'
    return true
  }
}

// ---------------------------------------------------------------------------
// Stage 4: MERGE — Apply changes to the styleguide files
// ---------------------------------------------------------------------------

/**
 * SECURITY: mergeToStyleguide also accepts a themeStore for a double-check
 * at merge time. Even if the pipeline was started on NEO defaults, the user
 * could have switched themes before clicking "Merge".
 */
async function mergeToStyleguide(themeStore = null) {
  if (!state.mergeRequest || state.pendingPalettes.length === 0) return false

  // ── Double-check guard at merge time ──
  if (themeStore && !isNeoDefaultTheme(themeStore)) {
    const reason = 'Merge blocked: Only the default NEO Theme may update the Design System Documentation.'
    log('merge-blocked', reason)
    state.stage = 'error'
    state.stageMessage = reason
    return false
  }

  state.stage = 'merging'
  state.stageMessage = 'Applying changes to styleguide files...'
  log('merge', `Merging ${state.mergeRequest.palettes.length} palette(s)`)

  try {
    const res = await fetch('/api/update-styleguide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        palettes: state.mergeRequest.palettes.map(p => ({
          id: p.id,
          label: p.label,
          base: p.base
        }))
      })
    })

    const data = await res.json()

    if (!res.ok || data.status !== 'ok') {
      throw new Error(data.message || 'Merge failed')
    }

    // Move merged palettes to existing list
    data.updated.forEach(id => {
      const pal = state.pendingPalettes.find(p => p.id === id)
      if (pal) {
        state.existingPalettes.push({ id: pal.id, base: pal.base })
      }
    })

    // Remove merged palettes from pending
    state.pendingPalettes = state.pendingPalettes.filter(
      p => !data.updated.includes(p.id)
    )

    // Record success
    state.lastSync = {
      timestamp: new Date().toISOString(),
      palettes: data.updated,
      files: data.files,
      status: 'success'
    }

    state.stage = 'success'
    state.stageMessage = `Successfully merged ${data.updated.length} palette(s) into ${data.files.length} files`
    log('merge-success', state.stageMessage)

    // Auto-dismiss after success
    setTimeout(() => {
      if (state.stage === 'success') {
        dismissDialog()
      }
    }, 4000)

    return true

  } catch (err) {
    state.stage = 'error'
    state.stageMessage = err.message
    state.lastSync = {
      timestamp: new Date().toISOString(),
      palettes: state.mergeRequest.palettes.map(p => p.id),
      files: [],
      status: 'error'
    }
    log('merge-error', err.message)
    return false
  }
}

// ---------------------------------------------------------------------------
// Stage 5: VERIFY — Re-fetch and confirm changes were applied
// ---------------------------------------------------------------------------

async function verifyMerge() {
  log('verify', 'Verifying merge by re-fetching existing palettes')
  await fetchExistingPalettes()
  if (state.lastSync && state.lastSync.status === 'success') {
    const verified = state.lastSync.palettes.every(id =>
      state.existingPalettes.some(p => p.id === id)
    )
    log('verify', verified ? 'All palettes verified in styleguide' : 'Some palettes may not have been applied')
    return verified
  }
  return false
}

// ---------------------------------------------------------------------------
// Pipeline Orchestration
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Security: Only the default NEO Theme may update Design System Documentation
// ---------------------------------------------------------------------------

function isNeoDefaultTheme(themeStore) {
  // Only allow updates when:
  // 1. Active theme set is 'neo'
  // 2. No custom theme is loaded (currentThemeMeta === null) — i.e. pure defaults
  if (!themeStore) return false
  if (themeStore.state.activeThemeSet !== 'neo') return false
  if (themeStore.state.currentThemeMeta !== null) return false
  return true
}

/**
 * Full pipeline: detect → forge → show dialog for review.
 * Called after a palette is added, or manually by the user.
 *
 * SECURITY: Only the default NEO Theme (no custom theme loaded) can
 * trigger Design System Documentation updates. All other themes are
 * blocked from modifying the styleguide source files.
 */
async function startPipeline(customPalettes, context = {}, themeStore = null) {
  // ── Guard: Block non-NEO-default themes ──
  if (themeStore && !isNeoDefaultTheme(themeStore)) {
    const reason = themeStore.state.currentThemeMeta
      ? `Custom theme "${themeStore.state.currentThemeMeta.name}" cannot update Design System Documentation`
      : `Only the default NEO Theme can update Design System Documentation (active: ${themeStore.state.activeThemeSet})`
    log('pipeline-blocked', reason)
    state.stage = 'idle'
    state.stageMessage = reason
    console.warn('[SYNC GUARD]', reason)
    return false
  }

  // Stage 1: Ensure we have latest state
  if (!state.loaded) {
    await fetchExistingPalettes()
  }

  // Stage 2: Detect pending updates
  state.stage = 'detecting'
  state.stageMessage = 'Checking for pending updates...'
  const hasPending = detectPendingUpdates(customPalettes)

  if (!hasPending) {
    state.stage = 'idle'
    state.stageMessage = 'All palettes are up-to-date'
    log('pipeline', 'No pending updates found')
    return false
  }

  // Stage 3: Forge merge request
  await forgeMergeRequest()

  // Show review dialog
  state.dialogContext = context
  state.showDialog = true
  log('pipeline', 'Merge request ready for review')
  return true
}

/**
 * Quick check for pending updates without triggering the full pipeline.
 * Used on app startup and after removing palettes.
 * Only operates when on the default NEO Theme.
 */
function quickDetect(customPalettes, themeStore = null) {
  if (!state.loaded) return false
  // Guard: non-NEO themes don't need pending detection
  if (themeStore && !isNeoDefaultTheme(themeStore)) return false
  return detectPendingUpdates(customPalettes)
}

// ---------------------------------------------------------------------------
// Dialog Management
// ---------------------------------------------------------------------------

function promptForUpdate(context = {}) {
  state.dialogContext = context
  state.showDialog = true
}

function dismissDialog() {
  state.showDialog = false
  state.dialogContext = null
  state.mergeRequest = null
  // Reset stage to idle (unless we have pending items)
  state.stage = state.pendingPalettes.length > 0 ? 'idle' : 'idle'
  state.stageMessage = ''
}

function retryMerge() {
  state.stage = 'review'
  state.stageMessage = 'Review changes before merging'
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const useStyleguideSync = defineStore('styleguide-sync', () => ({
  state,

  // Computed
  hasPendingUpdates,
  pendingCount,
  isProcessing,
  canMerge,

  // Security
  isNeoDefaultTheme,

  // Pipeline stages
  fetchExistingPalettes,
  detectPendingUpdates,
  forgeMergeRequest,
  mergeToStyleguide,
  verifyMerge,

  // Pipeline orchestration
  startPipeline,
  quickDetect,

  // Dialog
  promptForUpdate,
  dismissDialog,
  retryMerge
}))
