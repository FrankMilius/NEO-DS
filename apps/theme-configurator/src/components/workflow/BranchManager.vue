<template>
  <div class="branch-manager" ref="wrapRef">
    <!-- Branch Badge + Dropdown Toggle -->
    <button class="branch-badge" @click="isOpen = !isOpen" :title="`Branch: ${branchStore.activeBranchName.value}`">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>
      </svg>
      <span class="branch-name">{{ branchStore.activeBranchName.value }}</span>
      <svg class="branch-chevron" :class="{ open: isOpen }" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </button>

    <!-- Dropdown Panel -->
    <Transition name="dropdown">
      <div v-if="isOpen" class="branch-dropdown">
        <!-- Main branch -->
        <button
          :class="['branch-item', { active: branchStore.isOnMain.value }]"
          @click="switchToMain"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="6" y1="3" x2="6" y2="15"/><circle cx="6" cy="18" r="3"/>
          </svg>
          <span class="branch-item-name">main</span>
          <span v-if="branchStore.isOnMain.value" class="branch-current-tag">current</span>
        </button>

        <!-- Branch list -->
        <template v-if="branchStore.branchList.value.length > 0">
          <div class="branch-divider"></div>
          <div class="branch-section-label">Branches</div>
          <button
            v-for="branch in branchStore.branchList.value"
            :key="branch.id"
            :class="['branch-item', { active: branchStore.state.activeBranchId === branch.id }]"
            @click="switchToBranch(branch.id)"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>
            </svg>
            <div class="branch-item-info">
              <span class="branch-item-name">{{ branch.name }}</span>
              <span class="branch-item-meta">{{ changeCount(branch.id) }} changes</span>
            </div>
            <span v-if="branchStore.state.activeBranchId === branch.id" class="branch-current-tag">current</span>
            <button
              v-else
              class="branch-delete-btn"
              @click.stop="handleDelete(branch.id)"
              title="Delete branch"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
              </svg>
            </button>
          </button>
        </template>

        <div class="branch-divider"></div>

        <!-- Actions -->
        <button class="branch-action" @click="showCreateDialog = true; isOpen = false">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14"/><path d="M5 12h14"/>
          </svg>
          New Branch
        </button>

        <button
          v-if="!branchStore.isOnMain.value"
          class="branch-action branch-action--merge"
          @click="$emit('merge', branchStore.state.activeBranchId); isOpen = false"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>
          </svg>
          Merge to main
        </button>

        <button class="branch-action branch-action--release" @click="$emit('release'); isOpen = false">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
          </svg>
          Publish Release
        </button>
      </div>
    </Transition>

    <!-- Create Branch Dialog -->
    <Transition name="modal">
      <div v-if="showCreateDialog" class="modal-overlay" @click.self="showCreateDialog = false">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">New Branch</h3>
            <button class="modal-close" @click="showCreateDialog = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-field">
              <label class="form-label">Branch Name</label>
              <input
                class="form-input"
                v-model="newBranchName"
                placeholder="e.g. button-redesign"
                @keydown.enter="confirmCreate"
                ref="branchNameRef"
              />
            </div>
            <div class="form-field">
              <label class="form-label">Description (optional)</label>
              <input
                class="form-input"
                v-model="newBranchDesc"
                placeholder="What are you working on?"
              />
            </div>
            <p class="branch-base-note">
              Branching from <strong>{{ branchStore.activeBranchName.value }}</strong>
            </p>
          </div>
          <div class="modal-footer">
            <button class="modal-btn secondary" @click="showCreateDialog = false">Cancel</button>
            <button class="modal-btn primary" @click="confirmCreate" :disabled="!newBranchName.trim()">
              Create Branch
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useBranchStore } from '../../stores/branches.js'
import { useThemeStore } from '../../stores/theme.js'

const emit = defineEmits(['merge', 'release'])

const branchStore = useBranchStore()
const themeStore = useThemeStore()

const wrapRef = ref(null)
const branchNameRef = ref(null)
const isOpen = ref(false)
const showCreateDialog = ref(false)
const newBranchName = ref('')
const newBranchDesc = ref('')

function getSnapshot() {
  // Deep-clone the current theme state for branch storage
  return JSON.parse(JSON.stringify({
    themes: themeStore.state.themes,
    foundationOverrides: themeStore.state.foundationOverrides,
    componentOverrides: themeStore.state.componentOverrides,
    primitiveOverrides: themeStore.state.primitiveOverrides,
    customFonts: themeStore.state.customFonts,
    focusRingMode: themeStore.state.focusRingMode,
    componentLocks: themeStore.state.componentLocks,
    componentVersions: themeStore.state.componentVersions,
    activeThemeSet: themeStore.state.activeThemeSet
  }))
}

function applySnapshot(snapshot) {
  if (snapshot.themes) Object.assign(themeStore.state.themes, snapshot.themes)
  if (snapshot.foundationOverrides) Object.assign(themeStore.state.foundationOverrides, snapshot.foundationOverrides)
  if (snapshot.componentOverrides) Object.assign(themeStore.state.componentOverrides, snapshot.componentOverrides)
  if (snapshot.primitiveOverrides) Object.assign(themeStore.state.primitiveOverrides, snapshot.primitiveOverrides)
  if (snapshot.customFonts) Object.assign(themeStore.state.customFonts, snapshot.customFonts)
  if (snapshot.focusRingMode) Object.assign(themeStore.state.focusRingMode, snapshot.focusRingMode)
  if (snapshot.componentLocks) Object.assign(themeStore.state.componentLocks, snapshot.componentLocks)
  if (snapshot.componentVersions) Object.assign(themeStore.state.componentVersions, snapshot.componentVersions)
  if (snapshot.activeThemeSet) themeStore.state.activeThemeSet = snapshot.activeThemeSet
}

function switchToMain() {
  if (branchStore.isOnMain.value) { isOpen.value = false; return }
  branchStore.switchBranch(null, getSnapshot, applySnapshot)
  isOpen.value = false
}

function switchToBranch(id) {
  if (branchStore.state.activeBranchId === id) { isOpen.value = false; return }
  branchStore.switchBranch(id, getSnapshot, applySnapshot)
  isOpen.value = false
}

function confirmCreate() {
  const name = newBranchName.value.trim()
  if (!name) return
  const branch = branchStore.createBranch(name, newBranchDesc.value.trim(), getSnapshot)
  branchStore.switchBranch(branch.id, getSnapshot, applySnapshot)
  showCreateDialog.value = false
  newBranchName.value = ''
  newBranchDesc.value = ''
}

function handleDelete(id) {
  if (confirm('Delete this branch? This cannot be undone.')) {
    branchStore.deleteBranch(id)
  }
}

function changeCount(id) {
  return branchStore.countBranchChanges(id)
}

// Close dropdown on outside click
function onDocClick(e) {
  if (wrapRef.value && !wrapRef.value.contains(e.target) && !showCreateDialog.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onDocClick, true)
  branchStore.loadFromStorage()
})
onUnmounted(() => {
  document.removeEventListener('click', onDocClick, true)
})
</script>

<style scoped>
.branch-manager { position: relative; }

.branch-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 10px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface);
  color: var(--cfg-text);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.branch-badge:hover {
  background: var(--cfg-surface-elevated);
  border-color: var(--cfg-text-muted);
}

.branch-name { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.branch-chevron { transition: transform 0.15s; flex-shrink: 0; }
.branch-chevron.open { transform: rotate(180deg); }

/* Dropdown */
.branch-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 260px;
  background: var(--cfg-surface);
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  box-shadow: 0 8px 32px color-mix(in srgb, #000 15%, transparent);
  z-index: 1000;
  padding: 4px;
}

.branch-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--cfg-text);
  font-size: 12px;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
}

.branch-item:hover { background: var(--cfg-surface-elevated); }
.branch-item.active { background: var(--cfg-accent); color: white; }
.branch-item.active svg { stroke: white; }

.branch-item-info { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
.branch-item-name { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.branch-item-meta { font-size: 10px; opacity: 0.6; }

.branch-current-tag {
  font-size: 9px;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 3px;
  background: color-mix(in srgb, currentColor 15%, transparent);
  flex-shrink: 0;
}

.branch-delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--cfg-text-muted);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.1s;
}

.branch-delete-btn:hover { background: #fee2e2; color: #dc2626; }

.branch-divider { height: 1px; background: var(--cfg-border); margin: 4px 0; }
.branch-section-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cfg-text-muted);
  padding: 6px 10px 3px;
}

.branch-action {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--cfg-text-muted);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all 0.1s;
}

.branch-action:hover { background: var(--cfg-surface-elevated); color: var(--cfg-text); }
.branch-action--merge:hover { color: #16a34a; }
.branch-action--release:hover { color: #7c3aed; }

/* Modal reuse */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, #000 40%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.modal-dialog {
  width: 380px;
  background: var(--cfg-surface);
  border: 1px solid var(--cfg-border);
  border-radius: 12px;
  box-shadow: 0 8px 32px color-mix(in srgb, #000 20%, transparent);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--cfg-border);
}

.modal-title { font-size: 15px; font-weight: 700; color: var(--cfg-text); margin: 0; }

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
.modal-close:hover { background: var(--cfg-surface-elevated); }

.modal-body { padding: 20px; display: flex; flex-direction: column; gap: 12px; }

.form-field { display: flex; flex-direction: column; gap: 4px; }
.form-label { font-size: 11px; font-weight: 600; color: var(--cfg-text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
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
}
.form-input:focus { border-color: var(--cfg-accent); }

.branch-base-note { font-size: 11px; color: var(--cfg-text-muted); margin: 0; }
.branch-base-note strong { color: var(--cfg-text); }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid var(--cfg-border);
}

.modal-btn {
  height: 34px;
  padding: 0 16px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.modal-btn.secondary { background: var(--cfg-surface); color: var(--cfg-text-muted); }
.modal-btn.secondary:hover { background: var(--cfg-surface-elevated); color: var(--cfg-text); }
.modal-btn.primary { background: var(--cfg-accent); color: white; border-color: var(--cfg-accent); }
.modal-btn.primary:hover { opacity: 0.9; }
.modal-btn.primary:disabled { opacity: 0.4; cursor: not-allowed; }

/* Transitions */
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.15s, transform 0.15s; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-4px); }
.modal-enter-active, .modal-leave-active { transition: opacity 0.15s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
