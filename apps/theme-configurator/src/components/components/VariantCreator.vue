<template>
  <div class="variant-creator">
    <!-- Toggle Button -->
    <button class="vc-toggle" @click="showDialog = true" :disabled="isLocked">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14"/><path d="M5 12h14"/>
      </svg>
      New Variant
    </button>

    <!-- Existing Custom Variants -->
    <div v-if="Object.keys(variants).length > 0" class="vc-list">
      <div v-for="(def, name) in variants" :key="name" class="vc-variant-chip">
        <span class="vc-variant-name">{{ name }}</span>
        <code class="vc-variant-modifier">.{{ def.modifier }}</code>
        <button class="vc-variant-delete" @click="handleDelete(name)" title="Delete variant" :disabled="isLocked">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Creator Dialog -->
    <Transition name="modal">
      <div v-if="showDialog" class="modal-overlay" @click.self="showDialog = false">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">New Variant — {{ componentLabel }}</h3>
            <button class="modal-close" @click="showDialog = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <!-- Axis Selection -->
            <div class="form-field" v-if="variantAxes.length > 0">
              <label class="form-label">Axis</label>
              <select class="form-select" v-model="selectedAxis">
                <option v-for="ax in variantAxes" :key="ax.id" :value="ax.id">
                  {{ ax.label }} ({{ ax.valueCount }} values)
                </option>
              </select>
            </div>

            <!-- Variant Name -->
            <div class="form-field">
              <label class="form-label">Variant Name</label>
              <input
                class="form-input"
                v-model="variantName"
                placeholder="e.g. gradient"
                @input="validateName"
              />
              <span v-if="nameError" class="form-error">{{ nameError }}</span>
            </div>

            <!-- Base Variant -->
            <div class="form-field" v-if="baseVariantOptions.length > 0">
              <label class="form-label">Clone Tokens From</label>
              <select class="form-select" v-model="selectedBase">
                <option v-for="opt in baseVariantOptions" :key="opt.id" :value="opt.id">
                  {{ opt.label }} ({{ opt.tokenCount }} tokens)
                </option>
              </select>
            </div>

            <!-- Preview -->
            <div v-if="previewTokenIds.length > 0" class="vc-preview">
              <div class="form-label">Tokens to create ({{ previewTokenIds.length }})</div>
              <div class="vc-preview-list">
                <code v-for="id in previewTokenIds.slice(0, 8)" :key="id" class="vc-preview-token">--{{ id }}</code>
                <span v-if="previewTokenIds.length > 8" class="vc-preview-more">
                  +{{ previewTokenIds.length - 8 }} more
                </span>
              </div>
              <div class="vc-preview-modifier">
                BEM Modifier: <code>.nc-{{ componentId }}--{{ variantName || '...' }}</code>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="modal-btn secondary" @click="showDialog = false">Cancel</button>
            <button
              class="modal-btn primary"
              @click="handleCreate"
              :disabled="!canCreate"
            >Create Variant</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'

const props = defineProps({
  componentId: { type: String, required: true },
  componentLabel: { type: String, default: '' },
  recipe: { type: Object, default: null },
  isLocked: { type: Boolean, default: false }
})

const store = useThemeStore()
const showDialog = ref(false)
const variantName = ref('')
const nameError = ref('')
const selectedAxis = ref('')
const selectedBase = ref('')

const variants = computed(() => store.getVariants(props.componentId))

// Axes that support variants (have tokenGroups)
const variantAxes = computed(() => {
  if (!props.recipe?.axes) return []
  return Object.entries(props.recipe.axes)
    .filter(([, axis]) => {
      // Only axes where values have tokenGroups
      return Object.values(axis.values).some(v => v.tokenGroups?.length > 0)
    })
    .map(([id, axis]) => ({
      id,
      label: axis.label || id,
      valueCount: Object.keys(axis.values).length
    }))
})

// Auto-select first axis
if (variantAxes.value.length > 0 && !selectedAxis.value) {
  selectedAxis.value = variantAxes.value[0].id
}

// Base variant options from the selected axis
const baseVariantOptions = computed(() => {
  if (!props.recipe?.axes || !selectedAxis.value) return []
  const axis = props.recipe.axes[selectedAxis.value]
  if (!axis) return []

  return Object.entries(axis.values)
    .filter(([, v]) => v.tokenGroups?.length > 0)
    .map(([id, v]) => {
      const tokenGroupIds = v.tokenGroups || []
      const tokenCount = tokenGroupIds.reduce((sum, gId) => {
        const group = props.recipe?.styling?.tokenGroups?.[gId]
        return sum + (group?.tokens?.length || 0)
      }, 0)
      return { id, label: id, tokenCount }
    })
})

// Auto-select first base
if (baseVariantOptions.value.length > 0 && !selectedBase.value) {
  selectedBase.value = baseVariantOptions.value[0].id
}

// Base variant token IDs
const baseTokenIds = computed(() => {
  if (!props.recipe?.axes || !selectedAxis.value || !selectedBase.value) return []
  const axis = props.recipe.axes[selectedAxis.value]
  const baseVal = axis?.values?.[selectedBase.value]
  if (!baseVal?.tokenGroups) return []

  const ids = []
  for (const gId of baseVal.tokenGroups) {
    const group = props.recipe?.styling?.tokenGroups?.[gId]
    if (group?.tokens) ids.push(...group.tokens)
  }
  return ids
})

// Preview: new token IDs
const previewTokenIds = computed(() => {
  if (!variantName.value || baseTokenIds.value.length === 0) return []
  return baseTokenIds.value.map(id =>
    id.replace(`nc-${props.componentId}-${selectedBase.value}-`, `nc-${props.componentId}-${variantName.value}-`)
  )
})

const canCreate = computed(() => {
  return variantName.value.trim() &&
    !nameError.value &&
    baseTokenIds.value.length > 0 &&
    selectedBase.value
})

function validateName() {
  const name = variantName.value.trim().toLowerCase()
  if (!name) { nameError.value = ''; return }
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    nameError.value = 'Use lowercase letters, numbers, and hyphens'
    return
  }
  // Check if variant already exists
  if (variants.value[name]) {
    nameError.value = 'Variant already exists'
    return
  }
  // Check against existing recipe axis values
  if (props.recipe?.axes?.[selectedAxis.value]?.values?.[name]) {
    nameError.value = 'Name conflicts with existing axis value'
    return
  }
  nameError.value = ''
}

function handleCreate() {
  if (!canCreate.value) return
  const name = variantName.value.trim().toLowerCase()
  store.createVariant(
    props.componentId,
    name,
    selectedBase.value,
    selectedAxis.value,
    baseTokenIds.value
  )
  showDialog.value = false
  variantName.value = ''
}

function handleDelete(name) {
  if (confirm(`Delete custom variant "${name}"? Associated token overrides will be removed.`)) {
    store.deleteVariant(props.componentId, name)
  }
}
</script>

<style scoped>
.variant-creator { display: flex; flex-direction: column; gap: 8px; }

.vc-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  padding: 6px 12px;
  border: 1px dashed var(--cfg-border);
  border-radius: 6px;
  background: transparent;
  color: var(--cfg-text-muted);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.vc-toggle:hover:not(:disabled) {
  border-color: #7c3aed;
  color: #7c3aed;
  background: #f5f3ff;
}

.vc-toggle:disabled { opacity: 0.4; cursor: not-allowed; }

.vc-list { display: flex; flex-wrap: wrap; gap: 6px; }

.vc-variant-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border: 1px solid #ddd6fe;
  border-radius: 6px;
  background: #f5f3ff;
  font-size: 11px;
}

.vc-variant-name { font-weight: 600; color: #7c3aed; }
.vc-variant-modifier { font-size: 9px; color: var(--cfg-text-muted); }

.vc-variant-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px; height: 16px;
  border: none; border-radius: 3px;
  background: transparent;
  color: var(--cfg-text-muted);
  cursor: pointer;
}
.vc-variant-delete:hover:not(:disabled) { background: #fee2e2; color: #dc2626; }
.vc-variant-delete:disabled { opacity: 0.4; cursor: not-allowed; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: color-mix(in srgb, #000 40%, transparent);
  display: flex; align-items: center; justify-content: center;
  z-index: 1100;
}

.modal-dialog {
  width: 400px;
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

.modal-body { padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }

.form-field { display: flex; flex-direction: column; gap: 4px; }
.form-label { font-size: 11px; font-weight: 600; color: var(--cfg-text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
.form-input, .form-select {
  height: 36px; padding: 0 12px;
  border: 1px solid var(--cfg-border); border-radius: 6px;
  background: var(--cfg-surface-elevated); color: var(--cfg-text);
  font-size: 13px; font-family: inherit; outline: none;
}
.form-input:focus, .form-select:focus { border-color: var(--cfg-accent); }
.form-error { font-size: 10px; color: #dc2626; }

.vc-preview {
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.vc-preview-list { display: flex; flex-wrap: wrap; gap: 4px; }

.vc-preview-token {
  font-size: 10px;
  padding: 2px 6px;
  background: var(--cfg-surface-elevated);
  border-radius: 3px;
  color: var(--cfg-text-muted);
}

.vc-preview-more { font-size: 10px; color: var(--cfg-text-muted); font-style: italic; }

.vc-preview-modifier {
  font-size: 11px;
  color: #7c3aed;
  margin-top: 4px;
}
.vc-preview-modifier code { background: #f5f3ff; padding: 1px 4px; border-radius: 3px; }

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
