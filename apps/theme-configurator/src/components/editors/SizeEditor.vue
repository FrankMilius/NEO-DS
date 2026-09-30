<template>
  <div class="size-editor">
    <div class="editor-header">
      <h3 class="editor-title">{{ title }}</h3>
      <span v-if="tokenId" class="token-name">--{{ tokenId }}</span>
    </div>

    <div class="editor-body">
      <div class="slider-row">
        <input :aria-label="`${title}: Schieberegler`"
          type="range"
          class="size-slider"
          :value="numericValue"
          :min="min"
          :max="max"
          :step="step"
          @input="handleSlider"
        />
        <div class="value-input-wrap">
          <input :aria-label="`${title}: Wert`"
            type="text"
            class="value-input"
            :value="modelValue"
            @input="handleTextInput"
            @blur="validateInput"
          />
        </div>
      </div>

      <div class="preview-bar">
        <div class="preview-visual" :style="previewStyle"></div>
      </div>

      <div v-if="presets.length > 0" class="presets">
        <label class="input-label">Presets</label>
        <div class="preset-grid">
          <button
            v-for="preset in presets"
            :key="preset.value"
            :class="['preset-btn', { active: modelValue === preset.value }]"
            @click="$emit('update:modelValue', preset.value)"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '0px' },
  title: { type: String, default: 'Size' },
  tokenId: { type: String, default: '' },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  unit: { type: String, default: 'px' },
  presets: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const numericValue = computed(() => {
  return parseFloat(props.modelValue) || 0
})

const previewStyle = computed(() => {
  const val = numericValue.value
  if (props.tokenId.includes('radius')) {
    return {
      width: '48px',
      height: '48px',
      borderRadius: props.modelValue,
      background: 'var(--cfg-accent)',
      opacity: 0.6
    }
  }
  return {
    width: Math.min(val, 200) + 'px',
    height: '12px',
    borderRadius: '2px',
    background: 'var(--cfg-accent)',
    opacity: 0.6
  }
})

function handleSlider(e) {
  emit('update:modelValue', e.target.value + props.unit)
}

function handleTextInput(e) {
  emit('update:modelValue', e.target.value)
}

function validateInput() {
  // Keep current value
}
</script>

<style scoped>
.size-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.editor-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.editor-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--cfg-text);
  margin: 0;
}

.token-name {
  font-size: 11px;
  font-family: monospace;
  color: var(--cfg-text-muted);
}

.editor-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slider-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.size-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--cfg-border);
  border-radius: 2px;
  outline: none;
}

.size-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--cfg-accent);
  cursor: pointer;
  border: 2px solid var(--cfg-surface);
  box-shadow: var(--cfg-shadow-sm);
}

.value-input-wrap {
  flex-shrink: 0;
}

.value-input {
  width: 72px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--cfg-border);
  border-radius: 4px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font-size: 12px;
  font-family: monospace;
  text-align: right;
  outline: none;
}

.value-input:focus {
  border-color: var(--cfg-accent);
}

.preview-bar {
  padding: 12px;
  background: var(--cfg-surface-elevated);
  border-radius: 8px;
  display: flex;
  align-items: center;
}

.preview-visual {
  transition: all 0.15s ease;
}

.input-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cfg-text-muted);
}

.presets {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preset-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.preset-btn {
  padding: 4px 10px;
  border: 1px solid var(--cfg-border);
  border-radius: 4px;
  background: var(--cfg-surface);
  color: var(--cfg-text-secondary);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.1s;
}

.preset-btn:hover {
  border-color: var(--cfg-accent);
  color: var(--cfg-accent);
}

.preset-btn.active {
  background: var(--cfg-accent-subtle);
  border-color: var(--cfg-accent);
  color: var(--cfg-accent);
  font-weight: 600;
}
</style>
