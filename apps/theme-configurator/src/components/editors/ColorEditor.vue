<template>
  <div class="color-editor">
    <div class="editor-header">
      <h3 class="editor-title">{{ title }}</h3>
      <span v-if="tokenId" class="token-name">--fnd-color-{{ tokenId }}</span>
    </div>

    <div class="editor-body">
      <div class="color-preview-row">
        <div
          class="color-preview"
          :style="{ background: modelValue }"
          @click="focusInput"
        >
          <span class="preview-label" :style="{ color: contrastColor }">Aa</span>
        </div>
        <div class="color-inputs">
          <div class="input-group">
            <label class="input-label">HEX</label>
            <input
              ref="hexInput"
              type="text"
              class="color-text-input"
              :value="modelValue"
              @input="handleHexInput"
              @blur="validateHex"
              maxlength="9"
            />
          </div>
          <div class="input-group">
            <label class="input-label">Picker</label>
            <input
              type="color"
              class="native-picker"
              :value="normalizeHex(modelValue)"
              @input="$emit('update:modelValue', $event.target.value)"
            />
          </div>
        </div>
      </div>

      <div v-if="showPalette" class="palette-section">
        <label class="input-label">Palette</label>
        <div class="palette-grid">
          <button
            v-for="color in paletteColors"
            :key="color"
            class="palette-swatch"
            :class="{ active: modelValue === color }"
            :style="{ background: color }"
            @click="$emit('update:modelValue', color)"
            :title="color"
          ></button>
        </div>
      </div>

      <div v-if="contrastTarget" class="contrast-info">
        <div class="contrast-row">
          <span class="contrast-label">Contrast Ratio</span>
          <span :class="['contrast-value', contrastLevel]">
            {{ contrastRatio }}:1
          </span>
        </div>
        <div class="contrast-badges">
          <span :class="['wcag-badge', { pass: contrastRatio >= 4.5 }]">AA</span>
          <span :class="['wcag-badge', { pass: contrastRatio >= 7 }]">AAA</span>
          <span :class="['wcag-badge', { pass: contrastRatio >= 3 }]">AA Large</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '#000000' },
  title: { type: String, default: 'Color' },
  tokenId: { type: String, default: '' },
  showPalette: { type: Boolean, default: true },
  contrastTarget: { type: String, default: '' },
  paletteColors: {
    type: Array,
    default: () => [
      '#000000', '#1d1d1d', '#333333', '#4d4d4d', '#666666', '#767676',
      '#8e8d8d', '#cbcbcb', '#d9d9d9', '#e5e5e5', '#f5f5f5', '#ffffff',
      '#002049', '#009fe3', '#37e93d', '#5cfe50', '#04cd24',
      '#4589ff', '#24a148', '#d4a400', '#fa4d56',
      '#bf281b', '#0b9e23', '#ef5b4e',
      '#d5ffd1', '#ffdfdc', '#0d2b15', '#3b1419'
    ]
  }
})

const emit = defineEmits(['update:modelValue'])
const hexInput = ref(null)

function focusInput() {
  hexInput.value?.focus()
}

function normalizeHex(val) {
  if (!val || val === 'transparent') return '#000000'
  if (val.startsWith('rgb') || val.startsWith('color-mix')) return '#000000'
  return val.length === 4
    ? `#${val[1]}${val[1]}${val[2]}${val[2]}${val[3]}${val[3]}`
    : val
}

function handleHexInput(e) {
  const val = e.target.value
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    emit('update:modelValue', val)
  }
}

function validateHex() {
  // No-op, keep current value if invalid
}

// Contrast calculation
function hexToRgb(hex) {
  if (!hex || hex === 'transparent') return { r: 0, g: 0, b: 0 }
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.substr(0, 2), 16) / 255,
    g: parseInt(h.substr(2, 2), 16) / 255,
    b: parseInt(h.substr(4, 2), 16) / 255
  }
}

function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex)
  const [rs, gs, bs] = [r, g, b].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  )
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

const contrastRatio = computed(() => {
  if (!props.contrastTarget) return 0
  const l1 = relativeLuminance(props.modelValue)
  const l2 = relativeLuminance(props.contrastTarget)
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  return Math.round(ratio * 10) / 10
})

const contrastLevel = computed(() => {
  if (contrastRatio.value >= 7) return 'aaa'
  if (contrastRatio.value >= 4.5) return 'aa'
  if (contrastRatio.value >= 3) return 'aa-large'
  return 'fail'
})

const contrastColor = computed(() => {
  const lum = relativeLuminance(props.modelValue)
  return lum > 0.179 ? '#000000' : '#ffffff'
})
</script>

<style scoped>
.color-editor {
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

.color-preview-row {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.color-preview {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  border: 1px solid var(--cfg-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.preview-label {
  font-size: 20px;
  font-weight: 700;
}

.color-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.input-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cfg-text-muted);
}

.color-text-input {
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--cfg-border);
  border-radius: 4px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font-size: 12px;
  font-family: monospace;
  outline: none;
}

.color-text-input:focus {
  border-color: var(--cfg-accent);
}

.native-picker {
  width: 100%;
  height: 28px;
  border: 1px solid var(--cfg-border);
  border-radius: 4px;
  cursor: pointer;
  padding: 2px;
  background: var(--cfg-surface-elevated);
}

.palette-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.palette-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.palette-swatch {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 1px solid var(--cfg-border);
  cursor: pointer;
  padding: 0;
  transition: transform var(--fnd-motion-duration-100), box-shadow var(--fnd-motion-duration-100);
}

.palette-swatch:hover {
  transform: scale(1.2);
  z-index: var(--cfg-z-hover);
}

.palette-swatch.active {
  box-shadow: 0 0 0 2px var(--cfg-accent);
}

.contrast-info {
  padding: 10px;
  border-radius: 8px;
  background: var(--cfg-surface-elevated);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contrast-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contrast-label {
  font-size: 11px;
  color: var(--cfg-text-muted);
  font-weight: 500;
}

.contrast-value {
  font-size: 14px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.contrast-value.aaa { color: var(--cfg-indicator-pass); }
.contrast-value.aa { color: var(--cfg-indicator-pass); }
.contrast-value.aa-large { color: var(--cfg-indicator-warn); }
.contrast-value.fail { color: var(--cfg-indicator-fail); }

.contrast-badges {
  display: flex;
  gap: 6px;
}

.wcag-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--cfg-indicator-fail-bg);
  color: var(--cfg-indicator-fail);
}

.wcag-badge.pass {
  background: var(--cfg-indicator-pass-bg);
  color: var(--cfg-indicator-pass);
}
</style>
