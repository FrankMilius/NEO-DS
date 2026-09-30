<template>
  <Transition name="modal">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div ref="dialogRef" class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="release-dialog-titel" tabindex="-1">
        <div class="modal-header">
          <h2 id="release-dialog-titel" class="modal-title">Publish Release</h2>
          <button type="button" class="modal-close" aria-label="Schließen" @click="$emit('close')">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-field">
            <label class="form-label" for="cfg-release-version">Version</label>
            <input id="cfg-release-version" class="form-input" v-model="version" placeholder="e.g. 2.1.0" />
          </div>

          <div class="form-field">
            <label class="form-label" for="cfg-release-notizen">Release Notes</label>
            <textarea
              id="cfg-release-notizen"
              class="form-textarea"
              v-model="notes"
              rows="4"
              placeholder="Describe what changed in this release..."
            ></textarea>
          </div>

          <!-- Component summary -->
          <div class="release-summary">
            <div class="summary-label">Components with overrides</div>
            <div class="summary-chips">
              <span
                v-for="comp in modifiedComponents"
                :key="comp.id"
                class="summary-chip"
              >
                {{ comp.id }}
                <span v-if="comp.version" class="chip-version">v{{ comp.version }}</span>
                <svg aria-hidden="true" v-if="comp.locked" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <span v-if="modifiedComponents.length === 0" class="summary-empty">No component overrides</span>
            </div>
          </div>

          <!-- Previous releases -->
          <div v-if="releases.length > 0" class="previous-releases">
            <div class="summary-label">Previous Releases</div>
            <div class="release-list">
              <div v-for="rel in releases.slice(0, 5)" :key="rel.id" class="release-entry">
                <span class="release-version">v{{ rel.version }}</span>
                <span class="release-date">{{ formatDate(rel.publishedAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="modal-btn secondary" @click="$emit('close')">Cancel</button>
          <button
            type="button"
            class="modal-btn primary"
            @click="handlePublish"
            :disabled="!version.trim()"
          >
            Publish Release
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { useBranchStore } from '../../stores/branches.js'
import { componentTokenGroups } from '../../data/tokens.js'
import { useFokusFalle } from '../../composables/useFokusFalle.js'

const props = defineProps({
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'publish'])

const dialogRef = ref(null)
useFokusFalle(dialogRef, () => props.visible, { startFokus: '#cfg-release-version', beiEscape: () => emit('close') })

const themeStore = useThemeStore()
const branchStore = useBranchStore()

const version = ref(themeStore.state.version || '1.0.0')
const notes = ref('')

const releases = computed(() => branchStore.state.releases)

const modifiedComponents = computed(() => {
  const overrides = themeStore.state.componentOverrides[themeStore.state.activeThemeSet] || {}
  const locks = themeStore.state.componentLocks[themeStore.state.activeThemeSet] || {}
  const versions = themeStore.state.componentVersions[themeStore.state.activeThemeSet] || {}

  const componentIds = new Set()
  for (const key of Object.keys(overrides)) {
    const match = componentTokenGroups.find(g => key.startsWith(`nc-${g.id}-`) || key === `nc-${g.id}`)
    if (match) componentIds.add(match.id)
  }

  return [...componentIds].sort().map(id => ({
    id,
    version: versions[id] || null,
    locked: !!locks[id]
  }))
})

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return '' }
}

function handlePublish() {
  if (!version.value.trim()) return
  emit('publish', {
    version: version.value.trim(),
    notes: notes.value.trim()
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: color-mix(in srgb, #000 40%, transparent);
  display: flex; align-items: center; justify-content: center;
  z-index: 1200;
}

.modal-dialog {
  width: 440px;
  max-height: 80vh;
  background: var(--cfg-surface);
  border: 1px solid var(--cfg-border);
  border-radius: 12px;
  box-shadow: 0 8px 32px color-mix(in srgb, #000 20%, transparent);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid var(--cfg-border); flex-shrink: 0;
}

.modal-title { font-size: 15px; font-weight: 700; color: var(--cfg-text); margin: 0; }

.modal-close {
  width: 28px; height: 28px; border: none; border-radius: 6px;
  background: transparent; color: var(--cfg-text-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.modal-close:hover { background: var(--cfg-surface-elevated); }

.modal-body { padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }

.form-field { display: flex; flex-direction: column; gap: 4px; }
.form-label { font-size: 11px; font-weight: 600; color: var(--cfg-text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
.form-input {
  height: 36px; padding: 0 12px;
  border: 1px solid var(--cfg-border); border-radius: 6px;
  background: var(--cfg-surface-elevated); color: var(--cfg-text);
  font-size: 13px; font-family: inherit; outline: none;
}
.form-input:focus { border-color: var(--cfg-accent); }

.form-textarea {
  padding: 10px 12px;
  border: 1px solid var(--cfg-border); border-radius: 6px;
  background: var(--cfg-surface-elevated); color: var(--cfg-text);
  font-size: 12px; font-family: inherit; outline: none; resize: vertical;
  min-height: 80px;
}
.form-textarea:focus { border-color: var(--cfg-accent); }

.release-summary {
  border: 1px solid var(--cfg-border); border-radius: 8px; padding: 12px;
}

.summary-label {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.05em; color: var(--cfg-text-muted); margin-bottom: 8px;
}

.summary-chips { display: flex; flex-wrap: wrap; gap: 6px; }

.summary-chip {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 8px; border-radius: 4px;
  background: var(--cfg-surface-elevated);
  font-size: 11px; font-weight: 500; color: var(--cfg-text);
}

.chip-version { font-size: 9px; color: var(--cfg-text-muted); font-family: monospace; }

.summary-empty { font-size: 11px; color: var(--cfg-text-muted); font-style: italic; }

.previous-releases {
  border: 1px solid var(--cfg-border); border-radius: 8px; padding: 12px;
}

.release-list { display: flex; flex-direction: column; gap: 4px; }

.release-entry {
  display: flex; align-items: center; justify-content: space-between;
  padding: 4px 0;
  font-size: 11px;
}
.release-version { font-weight: 600; font-family: monospace; color: var(--cfg-text); }
.release-date { color: var(--cfg-text-muted); }

.modal-footer {
  display: flex; justify-content: flex-end; gap: 8px;
  padding: 12px 20px; border-top: 1px solid var(--cfg-border); flex-shrink: 0;
}

.modal-btn {
  height: 34px; padding: 0 16px;
  border: 1px solid var(--cfg-border); border-radius: 6px;
  font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all 0.15s;
}
.modal-btn.secondary { background: var(--cfg-surface); color: var(--cfg-text-muted); }
.modal-btn.secondary:hover { background: var(--cfg-surface-elevated); }
.modal-btn.primary { background: #7c3aed; color: white; border-color: #7c3aed; }
.modal-btn.primary:hover { opacity: 0.9; }
.modal-btn.primary:disabled { opacity: 0.4; cursor: not-allowed; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.15s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
