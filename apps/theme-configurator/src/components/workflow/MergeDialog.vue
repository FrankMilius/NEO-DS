<template>
  <Transition name="modal">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">
            Merge "{{ branchName }}" → main
          </h3>
          <button class="modal-close" @click="$emit('close')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- Auto-merged summary -->
          <div v-if="autoMergedCount > 0" class="merge-summary merge-summary--success">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            {{ autoMergedCount }} token(s) auto-merged
          </div>

          <!-- No conflicts -->
          <div v-if="conflicts.length === 0" class="merge-summary merge-summary--clean">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/>
            </svg>
            No conflicts — ready to merge!
          </div>

          <!-- Conflicts -->
          <template v-if="conflicts.length > 0">
            <div class="merge-summary merge-summary--conflict">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              {{ conflicts.length }} conflict(s) need resolution
            </div>

            <!-- Bulk actions -->
            <div class="bulk-actions">
              <button class="bulk-btn" @click="acceptAllOurs">Accept All Ours (branch)</button>
              <button class="bulk-btn" @click="acceptAllTheirs">Accept All Theirs (main)</button>
            </div>

            <!-- Conflict list -->
            <div class="conflict-list">
              <div v-for="(conflict, i) in conflicts" :key="i" class="conflict-item">
                <div class="conflict-header">
                  <code class="conflict-key">{{ conflict.key }}</code>
                  <span class="conflict-layer">{{ conflict.layer }}</span>
                </div>
                <div class="conflict-values">
                  <label :class="['conflict-option', { selected: resolutions[i] === 'ours' }]">
                    <input type="radio" :name="'conflict-' + i" value="ours" v-model="resolutions[i]" />
                    <div class="conflict-value-wrap">
                      <span class="conflict-label">Ours (branch)</span>
                      <div v-if="isColor(conflict.sourceValue)" class="conflict-swatch" :style="{ background: conflict.sourceValue }"></div>
                      <code class="conflict-value">{{ formatValue(conflict.sourceValue) }}</code>
                    </div>
                  </label>
                  <label :class="['conflict-option', { selected: resolutions[i] === 'theirs' }]">
                    <input type="radio" :name="'conflict-' + i" value="theirs" v-model="resolutions[i]" />
                    <div class="conflict-value-wrap">
                      <span class="conflict-label">Theirs (main)</span>
                      <div v-if="isColor(conflict.targetValue)" class="conflict-swatch" :style="{ background: conflict.targetValue }"></div>
                      <code class="conflict-value">{{ formatValue(conflict.targetValue) }}</code>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="modal-footer">
          <button class="modal-btn secondary" @click="$emit('close')">Cancel</button>
          <button
            class="modal-btn primary"
            @click="handleMerge"
            :disabled="!allResolved"
          >
            Merge
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  branchName: { type: String, default: '' },
  autoMerged: { type: Object, default: () => ({}) },
  conflicts: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'merge'])

// Track resolution for each conflict: 'ours' or 'theirs'
const resolutions = ref({})

const autoMergedCount = computed(() => {
  let count = 0
  const am = props.autoMerged
  if (am.componentOverrides) {
    for (const ts of Object.values(am.componentOverrides)) count += Object.keys(ts).length
  }
  if (am.foundationOverrides) {
    for (const ts of Object.values(am.foundationOverrides)) {
      for (const cat of Object.values(ts)) count += Object.keys(cat).length
    }
  }
  if (am.themes) {
    for (const ts of Object.values(am.themes)) {
      for (const mode of Object.values(ts)) count += Object.keys(mode).length
    }
  }
  return count
})

const allResolved = computed(() => {
  if (props.conflicts.length === 0) return true
  return props.conflicts.every((_, i) => resolutions.value[i] === 'ours' || resolutions.value[i] === 'theirs')
})

function acceptAllOurs() {
  const r = {}
  props.conflicts.forEach((_, i) => { r[i] = 'ours' })
  resolutions.value = r
}

function acceptAllTheirs() {
  const r = {}
  props.conflicts.forEach((_, i) => { r[i] = 'theirs' })
  resolutions.value = r
}

function isColor(val) {
  if (typeof val !== 'string') return false
  return val.startsWith('#') || val.startsWith('rgb') || val.startsWith('hsl') || val.startsWith('var(--fnd-color')
}

function formatValue(val) {
  if (val === undefined) return '(deleted)'
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

function handleMerge() {
  if (!allResolved.value) return

  // Build resolved conflicts
  const resolvedConflicts = props.conflicts.map((conflict, i) => ({
    ...conflict,
    resolvedValue: resolutions.value[i] === 'ours' ? conflict.sourceValue : conflict.targetValue
  }))

  emit('merge', {
    autoMerged: props.autoMerged,
    resolvedConflicts
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, #000 40%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
}

.modal-dialog {
  width: 480px;
  max-height: 80vh;
  background: var(--cfg-surface);
  border: 1px solid var(--cfg-border);
  border-radius: 12px;
  box-shadow: 0 8px 32px color-mix(in srgb, #000 20%, transparent);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--cfg-border);
  flex-shrink: 0;
}

.modal-title { font-size: 15px; font-weight: 700; color: var(--cfg-text); margin: 0; }

.modal-close {
  width: 28px; height: 28px;
  border: none; border-radius: 6px;
  background: transparent; color: var(--cfg-text-muted);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.modal-close:hover { background: var(--cfg-surface-elevated); }

.modal-body { padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }

.merge-summary {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 12px; border-radius: 8px;
  font-size: 12px; font-weight: 500;
}

.merge-summary--success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.merge-summary--clean { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.merge-summary--conflict { background: #fef3c7; color: #d97706; border: 1px solid #fde68a; }

.bulk-actions { display: flex; gap: 8px; }

.bulk-btn {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: transparent;
  color: var(--cfg-text-muted);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.bulk-btn:hover { background: var(--cfg-surface-elevated); color: var(--cfg-text); }

.conflict-list { display: flex; flex-direction: column; gap: 8px; }

.conflict-item {
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  overflow: hidden;
}

.conflict-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px;
  background: var(--cfg-surface-elevated);
  border-bottom: 1px solid var(--cfg-border);
}

.conflict-key { font-size: 11px; font-weight: 600; color: var(--cfg-text); }
.conflict-layer { font-size: 9px; color: var(--cfg-text-muted); text-transform: uppercase; }

.conflict-values { display: flex; flex-direction: column; }

.conflict-option {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.1s;
  border-bottom: 1px solid var(--cfg-border);
}
.conflict-option:last-child { border-bottom: none; }
.conflict-option:hover { background: var(--cfg-surface-elevated); }
.conflict-option.selected { background: #eff6ff; }

.conflict-option input { flex-shrink: 0; }

.conflict-value-wrap { display: flex; align-items: center; gap: 8px; flex: 1; }
.conflict-label { font-size: 10px; font-weight: 600; color: var(--cfg-text-muted); min-width: 80px; }
.conflict-swatch { width: 16px; height: 16px; border-radius: 4px; border: 1px solid var(--cfg-border); flex-shrink: 0; }
.conflict-value { font-size: 11px; color: var(--cfg-text); }

.modal-footer {
  display: flex; justify-content: flex-end; gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid var(--cfg-border);
  flex-shrink: 0;
}

.modal-btn {
  height: 34px; padding: 0 16px;
  border: 1px solid var(--cfg-border); border-radius: 6px;
  font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all 0.15s;
}
.modal-btn.secondary { background: var(--cfg-surface); color: var(--cfg-text-muted); }
.modal-btn.secondary:hover { background: var(--cfg-surface-elevated); }
.modal-btn.primary { background: var(--cfg-accent); color: white; border-color: var(--cfg-accent); }
.modal-btn.primary:hover { opacity: 0.9; }
.modal-btn.primary:disabled { opacity: 0.4; cursor: not-allowed; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.15s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
