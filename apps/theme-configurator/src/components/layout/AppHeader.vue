<template>
  <header class="app-header">
    <!-- Brand -->
    <div class="header-brand">
      <svg aria-hidden="true" class="brand-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
        <path d="M12 12l8-4.5" /><path d="M12 12v9" /><path d="M12 12L4 7.5" />
      </svg>
      <div class="brand-text">
        <h1 class="app-title">Theme Configurator</h1>
        <span class="brand-meta">
          <span class="version-tag" title="Version des bearbeiteten Themes (Theme-Metadaten)">Theme v{{ store.state.version }}</span>
          <span class="app-version" :title="appVersionTitel">{{ appVersionText }}</span>
        </span>
      </div>
    </div>

    <!-- ═══════════════ TOOLBAR ═══════════════ -->
    <div class="header-toolbar">
      <!-- Drupal-Betrieb (Plan v2, 2.6): Theme-Auswahl, Speichern, Veröffentlichen -->
      <template v-if="drupal">
        <div class="toolbar-group">
          <DrupalWerkzeuge />
        </div>
        <div class="toolbar-divider"></div>
      </template>

      <template v-else>
      <!-- 1) Create New Theme -->
      <div class="toolbar-group">
        <button type="button" class="tb-btn" @click="openCreateDialog" title="Create New Theme">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14"/><path d="M5 12h14"/>
          </svg>
          <span class="tb-label">New</span>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 2) Theme Dropdown Selector + Load -->
      <div class="toolbar-group theme-selector-group">
        <div class="theme-dropdown-wrap" ref="dropdownRef">
          <button
            type="button"
            class="tb-dropdown-btn"
            @click="toggleDropdown"
            :title="activeThemeLabel"
            :aria-label="`Theme wählen, aktiv: ${activeThemeLabel}`"
            :aria-expanded="dropdownOpen"
            :aria-controls="dropdownOpen ? 'cfg-theme-dropdown' : undefined"
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
            </svg>
            <span class="tb-dropdown-label">{{ activeThemeLabel }}</span>
            <svg aria-hidden="true" class="tb-chevron" :class="{ open: dropdownOpen }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          <!-- Dropdown panel -->
          <Transition name="dropdown">
            <div v-if="dropdownOpen" id="cfg-theme-dropdown" class="theme-dropdown-panel">
              <!-- Default: Neo Theme (protected — cannot be deleted) -->
              <button
                class="dd-item dd-item-protected"
                :class="{ active: !store.state.currentThemeMeta }"
                :aria-current="!store.state.currentThemeMeta ? 'true' : undefined"
                @click="selectNeoDefault"
                title="Default NEO Theme — protected, cannot be deleted"
              >
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                </svg>
                <div class="dd-item-text">
                  <span class="dd-item-name">Neo Theme</span>
                  <span class="dd-item-meta">Default · Protected</span>
                </div>
                <svg aria-hidden="true" class="dd-lock" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </button>

              <!-- Saved themes -->
              <template v-if="store.state.savedThemes.length > 0">
                <div class="dd-divider"></div>
                <div class="dd-section-label">Saved Themes</div>
                <button
                  v-for="theme in store.state.savedThemes"
                  :key="theme.id"
                  class="dd-item"
                  :class="{ active: store.state.currentThemeMeta?.id === theme.id }"
                  :aria-current="store.state.currentThemeMeta?.id === theme.id ? 'true' : undefined"
                  @click="handleLoadTheme(theme.id)"
                >
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 6a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z"/>
                  </svg>
                  <div class="dd-item-text">
                    <span class="dd-item-name">{{ theme.name }}</span>
                    <span class="dd-item-meta">v{{ theme.version }} · {{ formatDate(theme.updatedAt || theme.createdAt) }}</span>
                  </div>
                </button>
              </template>
            </div>
          </Transition>
        </div>
      </div>

      <div class="toolbar-divider"></div>
      </template>

      <!-- 2b) Branch Manager (im Drupal-Betrieb ausgeblendet, Beschluss E) -->
      <template v-if="zeigeBranches">
      <div class="toolbar-group">
        <BranchManager
          @merge="handleBranchMerge"
          @release="showReleaseDialog = true"
        />
      </div>

      <div class="toolbar-divider"></div>
      </template>

      <!-- 3) Save Theme -->
      <template v-if="!drupal">
      <div class="toolbar-group">
        <button
          class="tb-btn tb-btn-save"
          :class="{ saving: isSaving, saved: showSaved }"
          @click="handleSaveTheme"
          :disabled="isSaving"
          title="Save Theme (Ctrl+S)"
          aria-keyshortcuts="Control+S"
        >
          <svg aria-hidden="true" v-if="!isSaving && !showSaved" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
          </svg>
          <svg aria-hidden="true" v-else-if="showSaved" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span v-else class="tb-spinner"></span>
          <span class="tb-label">{{ showSaved ? 'Saved' : 'Save' }}</span>
        </button>
      </div>

      <div class="toolbar-divider"></div>
      </template>

      <!-- 4) Undo -->
      <div class="toolbar-group">
        <button
          class="tb-btn"
          @click="store.undo()"
          :disabled="!store.canUndo()"
          title="Undo (Ctrl+Z)"
          aria-label="Rückgängig"
          aria-keyshortcuts="Control+Z"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/>
          </svg>
        </button>
        <button
          class="tb-btn"
          @click="store.redo()"
          :disabled="!store.canRedo()"
          title="Redo (Ctrl+Shift+Z)"
          aria-label="Wiederherstellen"
          aria-keyshortcuts="Control+Shift+Z"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 14l5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/>
          </svg>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 4) Download Theme -->
      <div class="toolbar-group">
        <div class="download-wrap" ref="downloadRef">
          <button
            ref="downloadBtnRef"
            type="button"
            class="tb-btn"
            @click="toggleDownload"
            title="Download Theme"
            :aria-expanded="downloadOpen"
            :aria-controls="downloadOpen ? 'cfg-export-dropdown' : undefined"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span class="tb-label">Export</span>
          </button>

          <Transition name="dropdown">
            <div v-if="downloadOpen" id="cfg-export-dropdown" class="download-dropdown">
              <button class="dd-item" @click="handleDownloadCSS">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                <div class="dd-item-text">
                  <span class="dd-item-name">Export as CSS</span>
                  <span class="dd-item-meta">Custom properties file</span>
                </div>
              </button>
              <button class="dd-item" @click="handleDownloadJSON">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                <div class="dd-item-text">
                  <span class="dd-item-name">Export as JSON</span>
                  <span class="dd-item-meta">Full token snapshot</span>
                </div>
              </button>
              <button class="dd-item" data-test="export-dtcg" @click="handleDownloadDTCG">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13l-2 2 2 2"/><path d="M15 13l2 2-2 2"/>
                </svg>
                <div class="dd-item-text">
                  <span class="dd-item-name">DTCG (W3C Design Tokens)</span>
                  <span class="dd-item-meta">Standardformat, derselbe Exporter wie tokens:dtcg</span>
                </div>
              </button>
              <div class="dd-divider"></div>
              <button class="dd-item" @click="handleDownloadDrupal">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
                <div class="dd-item-text">
                  <span class="dd-item-name">Export for Drupal</span>
                  <span class="dd-item-meta">CSS + settings JSON bundle</span>
                </div>
              </button>
              <div class="dd-divider"></div>
              <button class="dd-item" data-test="import-theme" @click="handleImport">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <div class="dd-item-text">
                  <span class="dd-item-name">Theme importieren …</span>
                  <span class="dd-item-meta">JSON aus „Export as JSON“, mit Prüfung und Vorschau</span>
                </div>
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <template v-if="!drupal">
      <div class="toolbar-divider"></div>

      <!-- 5) Merge / Styleguide Sync -->
      <div class="toolbar-group">
        <button
          class="tb-btn tb-btn-merge"
          :class="{ 'has-pending': sync.hasPendingUpdates }"
          @click="handleMerge"
          :disabled="!sync.hasPendingUpdates"
          :title="sync.hasPendingUpdates
            ? `${sync.pendingCount} pending merge request(s)`
            : 'No pending merge requests'"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>
          </svg>
          <span class="tb-label">Merge</span>
          <span v-if="sync.hasPendingUpdates" class="merge-badge">{{ sync.pendingCount }}</span>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 6) Delete Theme (disabled for NEO default — cannot be deleted) -->
      <div class="toolbar-group">
        <button
          class="tb-btn tb-btn-danger"
          @click="handleDeleteTheme"
          :disabled="!store.state.currentThemeMeta"
          :title="!store.state.currentThemeMeta ? 'Default NEO Theme cannot be deleted' : 'Delete current theme'"
          aria-label="Theme löschen"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
      </template>
    </div>

    <!-- ═══════════════ CREATE THEME DIALOG ═══════════════ -->
    <Transition name="modal">
      <div v-if="showCreateDialog" class="modal-overlay" @click.self="showCreateDialog = false">
        <div ref="createDialogRef" class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="create-dialog-title" tabindex="-1">
          <div class="modal-header">
            <h2 class="modal-title" id="create-dialog-title">Create New Theme</h2>
            <button type="button" class="modal-close" aria-label="Schließen" @click="showCreateDialog = false">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/><path d="M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-field">
              <label class="form-label" for="cfg-neues-theme-name">Theme Name</label>
              <input
                id="cfg-neues-theme-name"
                class="form-input"
                v-model="newThemeName"
                placeholder="e.g. My Brand Theme"
                @keydown.enter="confirmCreateTheme"
                ref="nameInputRef"
              />
            </div>
            <div class="form-row">
              <div class="form-field">
                <label class="form-label" for="cfg-neues-theme-version">Version</label>
                <input id="cfg-neues-theme-version" class="form-input" v-model="newThemeVersion" placeholder="1.0.0" />
              </div>
              <div class="form-field">
                <label class="form-label" for="cfg-neues-theme-datum">Creation Date</label>
                <input id="cfg-neues-theme-datum" class="form-input readonly" :value="todayFormatted" readonly />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="modal-btn secondary" @click="showCreateDialog = false">Cancel</button>
            <button
              type="button"
              class="modal-btn primary"
              @click="confirmCreateTheme"
              :disabled="!newThemeName.trim()"
            >Create Theme</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════ DELETE CONFIRM DIALOG ═══════════════ -->
    <Transition name="modal">
      <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
        <div ref="deleteDialogRef" class="modal-dialog modal-sm" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-text" tabindex="-1">
          <div class="modal-header">
            <h2 class="modal-title" id="delete-dialog-title">Delete Theme</h2>
            <button type="button" class="modal-close" aria-label="Schließen" @click="showDeleteConfirm = false">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/><path d="M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p id="delete-dialog-text" class="delete-warning">
              Are you sure you want to delete <strong>{{ store.state.currentThemeMeta?.name }}</strong>?
              This action cannot be undone.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="modal-btn secondary" data-start-fokus @click="showDeleteConfirm = false">Cancel</button>
            <button type="button" class="modal-btn danger" @click="confirmDeleteTheme">Delete</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════ MERGE DIALOG ═══════════════ -->
    <MergeDialog
      v-if="zeigeBranches"
      :visible="showMergeDialog"
      :branchName="mergeBranchName"
      :autoMerged="mergeAutoMerged"
      :conflicts="mergeConflicts"
      @close="showMergeDialog = false"
      @merge="confirmBranchMerge"
    />

    <!-- ═══════════════ RELEASE DIALOG ═══════════════ -->
    <ReleaseDialog
      v-if="zeigeBranches"
      :visible="showReleaseDialog"
      @close="showReleaseDialog = false"
      @publish="confirmPublishRelease"
    />

    <!-- ═══════════════ DTCG-EXPORT / THEME-IMPORT (Plan v2, 2.2) ═══════════════ -->
    <DtcgExportDialog :visible="showDtcgDialog" @close="showDtcgDialog = false" />
    <ThemeImportDialog :visible="showImportDialog" @close="showImportDialog = false" />
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { useStyleguideSync } from '../../stores/styleguide-sync.js'
import { useBranchStore } from '../../stores/branches.js'
import BranchManager from '../workflow/BranchManager.vue'
import MergeDialog from '../workflow/MergeDialog.vue'
import ReleaseDialog from '../workflow/ReleaseDialog.vue'
import DtcgExportDialog from '../workflow/DtcgExportDialog.vue'
import ThemeImportDialog from '../workflow/ThemeImportDialog.vue'
import { hinweisen } from '../../composables/useBestaetigung.js'
import { appVersionKurz, appVersionLang } from '../../lib/app-version.js'
import { useFokusFalle } from '../../composables/useFokusFalle.js'
import DrupalWerkzeuge from '../drupal/DrupalWerkzeuge.vue'
import { speicher } from '../../speicher/index.js'
import { speichern as drupalSpeichern } from '../../composables/useDrupalBetrieb.js'

const store = useThemeStore()
// App-Version (Build) — getrennt von der Theme-Version store.state.version
const appVersionText = appVersionKurz()
const appVersionTitel = appVersionLang()
const sync = useStyleguideSync()
const branchStore = useBranchStore()

// Plan v2, 2.6: Drupal-Betrieb (window.NEO_KONFIGURATOR.speicher = 'drupal')
// — eigene Werkzeuge, Branches/Releases ausgeblendet. Lokal unveraendert.
const drupal = speicher().art === 'drupal'
const zeigeBranches = speicher().faehigkeiten.branchesUndReleases !== false

// ---------------------------------------------------------------------------
// Refs
// ---------------------------------------------------------------------------
const dropdownRef = ref(null)
const downloadRef = ref(null)
const nameInputRef = ref(null)
const downloadBtnRef = ref(null)
const createDialogRef = ref(null)
const deleteDialogRef = ref(null)

// ---------------------------------------------------------------------------
// Theme Dropdown
// ---------------------------------------------------------------------------
const dropdownOpen = ref(false)
const downloadOpen = ref(false)

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
  downloadOpen.value = false
}

function toggleDownload() {
  downloadOpen.value = !downloadOpen.value
  dropdownOpen.value = false
}

// Close dropdowns on outside click
function onDocumentClick(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
  if (downloadRef.value && !downloadRef.value.contains(e.target)) {
    downloadOpen.value = false
  }
}

// ---------------------------------------------------------------------------
// Save Theme (Ctrl+S)
// ---------------------------------------------------------------------------
const isSaving = ref(false)
const showSaved = ref(false)

async function handleSaveTheme() {
  if (isSaving.value) return
  isSaving.value = true
  try {
    await store.saveToServer()
    showSaved.value = true
    setTimeout(() => { showSaved.value = false }, 2000)
  } catch (err) {
    console.error('[Save] Failed:', err)
    hinweisen({ titel: 'Speichern fehlgeschlagen', text: err.message })
  } finally {
    isSaving.value = false
  }
}

// Close dropdowns on Escape + Ctrl+S Save shortcut
function onDocumentKeydown(e) {
  if (e.key === 'Escape') {
    // Fokus zurueck auf den Menue-Knopf, wenn er im Menue lag (Plan v2, 4.4)
    if (dropdownOpen.value) {
      dropdownOpen.value = false
      e.stopPropagation()
      if (dropdownRef.value?.contains(document.activeElement)) dropdownRef.value.querySelector('.tb-dropdown-btn')?.focus()
    }
    if (downloadOpen.value) {
      downloadOpen.value = false
      e.stopPropagation()
      if (downloadRef.value?.contains(document.activeElement)) downloadBtnRef.value?.focus()
    }
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault()
    if (drupal) drupalSpeichern()
    else handleSaveTheme()
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick, true)
  document.addEventListener('keydown', onDocumentKeydown)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick, true)
  document.removeEventListener('keydown', onDocumentKeydown)
})

// ---------------------------------------------------------------------------
// Active theme label
// ---------------------------------------------------------------------------
const activeThemeLabel = computed(() => {
  if (store.state.currentThemeMeta) {
    return store.state.currentThemeMeta.name
  }
  return 'Neo Theme'
})

// ---------------------------------------------------------------------------
// Select Neo Default
// ---------------------------------------------------------------------------
function selectNeoDefault() {
  store.loadNeoDefaults()
  dropdownOpen.value = false
}

// ---------------------------------------------------------------------------
// Load Theme
// ---------------------------------------------------------------------------
function handleLoadTheme(themeId) {
  store.loadTheme(themeId)
  dropdownOpen.value = false
}

// ---------------------------------------------------------------------------
// Create Theme Dialog
// ---------------------------------------------------------------------------
const showCreateDialog = ref(false)
const newThemeName = ref('')
const newThemeVersion = ref('1.0.0')

const todayFormatted = computed(() => {
  return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
})

// Fokus-Falle: Fokus ins Namensfeld, Tab bleibt im Dialog, Escape schliesst,
// danach zurueck zum Ausloeser (Plan v2, 4.4)
function openCreateDialog() {
  newThemeName.value = ''
  newThemeVersion.value = '1.0.0'
  showCreateDialog.value = true
}
useFokusFalle(createDialogRef, showCreateDialog, {
  startFokus: '#cfg-neues-theme-name',
  beiEscape: () => { showCreateDialog.value = false }
})

function confirmCreateTheme() {
  const name = newThemeName.value.trim()
  if (!name) return
  store.createTheme(name, newThemeVersion.value.trim() || '1.0.0')
  showCreateDialog.value = false
}

// ---------------------------------------------------------------------------
// Delete Theme
// ---------------------------------------------------------------------------
const showDeleteConfirm = ref(false)
useFokusFalle(deleteDialogRef, showDeleteConfirm, {
  startFokus: '[data-start-fokus]',
  beiEscape: () => { showDeleteConfirm.value = false }
})

function handleDeleteTheme() {
  // Double-guard: default NEO Theme can NEVER be deleted
  if (!store.state.currentThemeMeta) {
    console.warn('[UI GUARD] Cannot delete default NEO Theme')
    return
  }
  showDeleteConfirm.value = true
}

function confirmDeleteTheme() {
  if (store.state.currentThemeMeta) {
    store.deleteTheme(store.state.currentThemeMeta.id)
  }
  showDeleteConfirm.value = false
}

// ---------------------------------------------------------------------------
// Download
// ---------------------------------------------------------------------------
function handleDownloadCSS() {
  store.downloadThemeCSS()
  downloadOpen.value = false
}

function handleDownloadJSON() {
  store.downloadThemeJSON()
  downloadOpen.value = false
}

function handleDownloadDrupal() {
  store.downloadDrupalExport()
  downloadOpen.value = false
}

// DTCG-Export und Theme-Import laufen ueber eigene Dialoge (Plan v2, 2.2)
const showDtcgDialog = ref(false)
const showImportDialog = ref(false)

// Das Menue schliesst sich — der Fokus geht vorher auf „Export“, damit die
// Dialoge ihn beim Schliessen dorthin zurueckgeben koennen.
function handleDownloadDTCG() {
  downloadOpen.value = false
  downloadBtnRef.value?.focus()
  showDtcgDialog.value = true
}

function handleImport() {
  downloadOpen.value = false
  downloadBtnRef.value?.focus()
  showImportDialog.value = true
}

// ---------------------------------------------------------------------------
// Merge / Styleguide Sync
// ---------------------------------------------------------------------------
function handleMerge() {
  if (!sync.hasPendingUpdates) return
  // Load custom palettes from localStorage (same source as FoundationColors)
  let customPalettes = []
  try {
    const raw = localStorage.getItem('neo-cfg-custom-palettes')
    customPalettes = raw ? JSON.parse(raw) : []
  } catch { /* ignore */ }
  sync.startPipeline(customPalettes, { trigger: 'toolbar' }, store)
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return '' }
}

// ---------------------------------------------------------------------------
// Branch Merge
// ---------------------------------------------------------------------------
const showMergeDialog = ref(false)
const mergeBranchId = ref(null)
const mergeBranchName = ref('')
const mergeAutoMerged = ref({})
const mergeConflicts = ref([])

function getMainSnapshot() {
  return store.snapshotThemeData({ withActiveSet: true })
}

function handleBranchMerge(branchId) {
  const branch = branchStore.state.branches[branchId]
  if (!branch) return

  // First switch to main if not already there
  if (branchStore.state.activeBranchId) {
    branchStore.switchBranch(null, getMainSnapshot, (snapshot) => store.applyThemeData(snapshot))
  }

  // Compute merge
  const { autoMerged, conflicts } = branchStore.computeMerge(branchId, getMainSnapshot)

  mergeBranchId.value = branchId
  mergeBranchName.value = branch.name
  mergeAutoMerged.value = autoMerged
  mergeConflicts.value = conflicts
  showMergeDialog.value = true
}

function confirmBranchMerge(mergeResult) {
  const { autoMerged, resolvedConflicts } = mergeResult

  // Apply auto-merged changes
  applyMergedChanges(autoMerged)

  // Apply resolved conflicts
  for (const conflict of resolvedConflicts) {
    applyResolvedConflict(conflict)
  }

  // Delete merged branch
  branchStore.applyMergeResult(mergeBranchId.value, mergeResult, () => {})

  showMergeDialog.value = false
}

function applyMergedChanges(autoMerged) {
  // Apply component overrides
  if (autoMerged.componentOverrides) {
    for (const [ts, overrides] of Object.entries(autoMerged.componentOverrides)) {
      for (const [key, val] of Object.entries(overrides)) {
        if (val === undefined) {
          delete store.state.componentOverrides[ts][key]
        } else {
          store.state.componentOverrides[ts][key] = val
        }
      }
    }
  }

  // Apply foundation overrides
  if (autoMerged.foundationOverrides) {
    for (const [ts, cats] of Object.entries(autoMerged.foundationOverrides)) {
      for (const [cat, vals] of Object.entries(cats)) {
        if (!store.state.foundationOverrides[ts][cat]) store.state.foundationOverrides[ts][cat] = {}
        for (const [key, val] of Object.entries(vals)) {
          store.state.foundationOverrides[ts][cat][key] = val
        }
      }
    }
  }

  // Apply semantic token changes
  if (autoMerged.themes) {
    for (const [ts, modes] of Object.entries(autoMerged.themes)) {
      for (const [mode, tokens] of Object.entries(modes)) {
        for (const [key, val] of Object.entries(tokens)) {
          store.state.themes[ts][mode][key] = val
        }
      }
    }
  }

  // Apply locks / versions
  if (autoMerged.componentLocks) {
    for (const [ts, vals] of Object.entries(autoMerged.componentLocks)) {
      for (const [key, val] of Object.entries(vals)) {
        store.state.componentLocks[ts][key] = val
      }
    }
  }
  if (autoMerged.componentVersions) {
    for (const [ts, vals] of Object.entries(autoMerged.componentVersions)) {
      for (const [key, val] of Object.entries(vals)) {
        store.state.componentVersions[ts][key] = val
      }
    }
  }
}

function applyResolvedConflict(conflict) {
  const { layer, themeSet, key, resolvedValue } = conflict

  if (layer === 'componentOverrides') {
    if (resolvedValue === undefined) {
      delete store.state.componentOverrides[themeSet][key]
    } else {
      store.state.componentOverrides[themeSet][key] = resolvedValue
    }
  } else if (layer === 'foundationOverrides') {
    const [cat, k] = key.split('.')
    if (!store.state.foundationOverrides[themeSet][cat]) store.state.foundationOverrides[themeSet][cat] = {}
    store.state.foundationOverrides[themeSet][cat][k] = resolvedValue
  } else if (layer === 'themes') {
    const [mode, k] = key.split('.')
    store.state.themes[themeSet][mode][k] = resolvedValue
  } else if (layer === 'componentLocks') {
    store.state.componentLocks[themeSet][key] = resolvedValue
  } else if (layer === 'componentVersions') {
    store.state.componentVersions[themeSet][key] = resolvedValue
  }
}

// ---------------------------------------------------------------------------
// Publish Release
// ---------------------------------------------------------------------------
const showReleaseDialog = ref(false)

function confirmPublishRelease({ version, notes }) {
  branchStore.publishRelease(version, notes, getMainSnapshot)
  store.state.version = version
  showReleaseDialog.value = false
}
</script>

<style scoped>
/* ======================================================================
   HEADER
   ====================================================================== */
.app-header {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 44px;
  background: var(--cfg-surface);
  border-bottom: 1px solid var(--cfg-border);
  gap: 8px;
  flex-shrink: 0;
}

/* Brand */
.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.brand-icon {
  color: var(--cfg-accent);
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.app-title {
  margin: 0;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: var(--cfg-text);
  letter-spacing: -0.01em;
  line-height: 1.1;
}

.brand-meta {
  display: flex;
  gap: 6px;
  align-items: baseline;
  white-space: nowrap;
}

.app-version {
  font-size: 10px;
  color: var(--cfg-text-muted);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
}

.version-tag {
  font-size: 10px;
  color: var(--cfg-text-muted);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
}

/* ======================================================================
   TOOLBAR
   ====================================================================== */
.header-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  margin-left: 4px;
  border-left: 1px solid var(--cfg-border);
  height: 36px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: var(--cfg-border);
  margin: 0 4px;
  flex-shrink: 0;
}

/* ---- Toolbar Button ---- */
.tb-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: 5px;
  background: transparent;
  color: var(--cfg-text-muted);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--fnd-motion-duration-150) ease;
  white-space: nowrap;
}

.tb-btn:hover:not(:disabled) {
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  border-color: var(--cfg-border);
}

.tb-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.tb-btn-danger:hover:not(:disabled) {
  color: var(--cfg-danger);
  background: var(--cfg-danger-subtle);
  border-color: var(--cfg-danger-border-subtle);
}

/* Text #047857 statt #059669: 4,9:1 statt 3,4:1 auf dem Header-Grund (WCAG AA, Plan v2 4.4) */
.tb-btn-save {
  color: #047857;
  border-color: color-mix(in srgb, #059669 25%, transparent);
}
.tb-btn-save:hover:not(:disabled) {
  background: color-mix(in srgb, #059669 10%, transparent);
  border-color: #047857;
}
.tb-btn-save.saved {
  color: #047857;
  background: color-mix(in srgb, #059669 12%, transparent);
}
.tb-btn-save.saving { opacity: 0.6; cursor: wait; }

.tb-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid color-mix(in srgb, currentColor 25%, transparent);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: tb-spin 0.6s linear infinite;
}

@keyframes tb-spin {
  to { transform: rotate(360deg); }
}

.tb-label {
  font-size: 11px;
  font-weight: 500;
}

/* ---- Merge Button ---- */
.tb-btn-merge.has-pending {
  color: var(--cfg-accent);
}

.tb-btn-merge.has-pending:hover {
  background: var(--cfg-accent-subtle);
  border-color: var(--cfg-accent);
}

.merge-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: var(--cfg-accent);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

/* ---- Dropdown Button ---- */
.tb-dropdown-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 8px 0 10px;
  border: 1px solid var(--cfg-border);
  border-radius: 5px;
  background: var(--cfg-surface);
  color: var(--cfg-text);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--fnd-motion-duration-150) ease;
  min-width: 140px;
  max-width: 220px;
}

.tb-dropdown-btn:hover {
  background: var(--cfg-surface-elevated);
  border-color: var(--cfg-text-muted);
}

.tb-dropdown-label {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tb-chevron {
  flex-shrink: 0;
  transition: transform var(--fnd-motion-duration-150) ease;
}

.tb-chevron.open {
  transform: rotate(180deg);
}

/* ---- Theme Dropdown Panel ---- */
.theme-dropdown-wrap,
.download-wrap {
  position: relative;
}

.theme-dropdown-panel,
.download-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 260px;
  background: var(--cfg-surface);
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  box-shadow: var(--cfg-shadow-lg);
  z-index: var(--cfg-z-dropdown);
  padding: 4px;
  overflow: hidden;
}

.download-dropdown {
  min-width: 220px;
  right: 0;
  left: auto;
}

.dd-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--cfg-text);
  font-size: 12px;
  cursor: pointer;
  transition: background var(--fnd-motion-duration-100);
  text-align: left;
}

.dd-item:hover {
  background: var(--cfg-surface-elevated);
}

.dd-item.active {
  background: var(--cfg-accent);
  color: white;
}

.dd-item.active svg {
  stroke: white;
}

.dd-item-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.dd-item-name {
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dd-item-meta {
  font-size: 10px;
  opacity: 0.6;
  font-weight: 400;
}

.dd-lock {
  flex-shrink: 0;
  opacity: 0.4;
  margin-left: auto;
}

.dd-item-protected.active .dd-lock {
  opacity: 0.7;
  stroke: white;
}

.dd-divider {
  height: 1px;
  background: var(--cfg-border);
  margin: 4px 0;
}

.dd-section-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cfg-text-muted);
  padding: 6px 10px 4px;
}

/* Dropdown transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity var(--fnd-motion-duration-150) ease, transform var(--fnd-motion-duration-150) ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ======================================================================
   MODALS
   ====================================================================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--cfg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--cfg-z-modal);
}

.modal-dialog {
  width: 420px;
  background: var(--cfg-surface);
  border: 1px solid var(--cfg-border);
  border-radius: 12px;
  box-shadow: var(--cfg-shadow-modal);
  overflow: hidden;
}

.modal-sm { width: 360px; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--cfg-border);
}

.modal-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--cfg-text);
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--cfg-text-muted);
  cursor: pointer;
}

.modal-close:hover {
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid var(--cfg-border);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.form-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--cfg-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.form-input {
  height: 36px;
  padding: 0 12px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color var(--fnd-motion-duration-150);
}

.form-input:focus {
  border-color: var(--cfg-accent);
}

.form-input.readonly {
  opacity: 0.6;
  cursor: default;
}

.form-row {
  display: flex;
  gap: 12px;
}

.modal-btn {
  height: 34px;
  padding: 0 16px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--fnd-motion-duration-150) ease;
}

.modal-btn.secondary {
  background: var(--cfg-surface);
  color: var(--cfg-text-muted);
}

.modal-btn.secondary:hover {
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
}

.modal-btn.primary {
  background: var(--cfg-accent);
  color: white;
  border-color: var(--cfg-accent);
}

.modal-btn.primary:hover { opacity: 0.9; }

.modal-btn.primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.modal-btn.danger {
  background: var(--cfg-danger);
  color: white;
  border-color: var(--cfg-danger);
}

.modal-btn.danger:hover { opacity: 0.9; }

.delete-warning {
  font-size: 13px;
  color: var(--cfg-text);
  line-height: 1.5;
  margin: 0;
}

.delete-warning strong {
  color: var(--cfg-danger);
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--fnd-motion-duration-150) ease;
}

.modal-enter-active .modal-dialog,
.modal-leave-active .modal-dialog {
  transition: transform var(--fnd-motion-duration-150) ease, opacity var(--fnd-motion-duration-150) ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-dialog,
.modal-leave-to .modal-dialog {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
</style>
