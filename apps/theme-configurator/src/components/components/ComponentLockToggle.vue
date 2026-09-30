<template>
  <div class="lock-toggle">
    <!-- Lock/Unlock Button -->
    <button
      type="button"
      :class="['lock-btn', { locked: isLocked }]"
      :aria-pressed="isLocked"
      @click="handleToggle"
      :title="isLocked ? 'Unlock component for editing' : 'Lock component (read-only)'"
    >
      <!-- Locked icon -->
      <svg aria-hidden="true" v-if="isLocked" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
      <!-- Unlocked icon -->
      <svg aria-hidden="true" v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>
      </svg>
      <span class="lock-label">{{ isLocked ? 'Locked' : 'Unlocked' }}</span>
    </button>

    <!-- Version Badge -->
    <span v-if="version" class="version-badge" :title="`Component version ${version}`">
      v{{ version }}
    </span>

    <!-- Unlock Confirmation Dialog -->
    <div v-if="showUnlockDialog" class="unlock-dialog-overlay" @click.self="showUnlockDialog = false">
      <div ref="dialogRef" class="unlock-dialog" role="dialog" aria-modal="true" :aria-labelledby="`${idBasis}-titel`" :aria-describedby="`${idBasis}-text`" tabindex="-1">
        <h2 :id="`${idBasis}-titel`" class="unlock-dialog-title">Unlock {{ componentLabel }}?</h2>
        <p :id="`${idBasis}-text`" class="unlock-dialog-desc">
          This component is locked at <strong>v{{ version }}</strong>.
          Choose a version bump for editing:
        </p>
        <div class="bump-options" role="group" aria-label="Versionssprung">
          <button
            v-for="opt in bumpOptions"
            :key="opt.type"
            type="button"
            :class="['bump-btn', { active: selectedBump === opt.type }]"
            :aria-pressed="selectedBump === opt.type"
            @click="selectedBump = opt.type"
          >
            <span class="bump-type">{{ opt.label }}</span>
            <span class="bump-version">{{ opt.next }}</span>
          </button>
        </div>
        <div class="unlock-dialog-actions">
          <button type="button" class="dialog-btn dialog-btn--cancel" @click="showUnlockDialog = false">Cancel</button>
          <button type="button" class="dialog-btn dialog-btn--confirm" @click="confirmUnlock">Unlock</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, useId } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { useFokusFalle } from '../../composables/useFokusFalle.js'

const props = defineProps({
  componentId: { type: String, required: true },
  componentLabel: { type: String, default: '' }
})

const store = useThemeStore()

const isLocked = computed(() => store.isComponentLocked(props.componentId))
const version = computed(() => store.getComponentVersion(props.componentId))

const showUnlockDialog = ref(false)
const dialogRef = ref(null)
const idBasis = `cfg-entsperren-${useId()}`
useFokusFalle(dialogRef, showUnlockDialog, {
  startFokus: '.bump-btn.active',
  beiEscape: () => { showUnlockDialog.value = false }
})
const selectedBump = ref('patch')

const bumpOptions = computed(() => {
  const current = version.value || '1.0.0'
  const [major, minor, patch] = current.split('.').map(Number)
  return [
    { type: 'patch', label: 'Patch', next: `${major}.${minor}.${patch + 1}` },
    { type: 'minor', label: 'Minor', next: `${major}.${minor + 1}.0` },
    { type: 'major', label: 'Major', next: `${major + 1}.0.0` }
  ]
})

function handleToggle() {
  if (isLocked.value) {
    // Show unlock confirmation dialog
    selectedBump.value = 'patch'
    showUnlockDialog.value = true
  } else {
    // Lock immediately
    store.lockComponent(props.componentId)
  }
}

function confirmUnlock() {
  store.unlockComponent(props.componentId, selectedBump.value)
  showUnlockDialog.value = false
}
</script>

<style scoped>
.lock-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lock-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: transparent;
  color: var(--cfg-text-muted);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.lock-btn:hover {
  border-color: var(--cfg-text-muted);
  color: var(--cfg-text);
}

.lock-btn.locked {
  background: #fef3c7;
  border-color: #f59e0b;
  color: #d97706;
}

.lock-btn.locked:hover {
  background: #fde68a;
}

.lock-label { white-space: nowrap; }

.version-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text-muted);
  font-family: monospace;
}

/* Unlock Confirmation Dialog */
.unlock-dialog-overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, #000 40%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.unlock-dialog {
  background: var(--cfg-surface);
  border: 1px solid var(--cfg-border);
  border-radius: 12px;
  padding: 20px;
  width: 320px;
  box-shadow: 0 8px 32px color-mix(in srgb, #000 20%, transparent);
}

.unlock-dialog-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--cfg-text);
  margin: 0 0 8px;
}

.unlock-dialog-desc {
  font-size: 12px;
  color: var(--cfg-text-muted);
  margin: 0 0 16px;
  line-height: 1.5;
}

.bump-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.bump-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  background: transparent;
  color: var(--cfg-text);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.bump-btn:hover {
  border-color: var(--cfg-accent);
  background: var(--cfg-surface-elevated);
}

.bump-btn.active {
  border-color: var(--cfg-accent);
  background: var(--cfg-accent-subtle);
}

.bump-type { font-weight: 600; }
.bump-version { font-family: monospace; color: var(--cfg-text-muted); font-size: 11px; }

.unlock-dialog-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.dialog-btn {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.dialog-btn--cancel {
  border: 1px solid var(--cfg-border);
  background: transparent;
  color: var(--cfg-text-muted);
}

.dialog-btn--cancel:hover {
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
}

.dialog-btn--confirm {
  border: 1px solid var(--cfg-accent);
  background: var(--cfg-accent);
  color: white;
}

.dialog-btn--confirm:hover {
  opacity: 0.9;
}
</style>
