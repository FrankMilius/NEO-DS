<template>
  <div class="color-editor">
    <!-- ── Current Color Preview ── -->
    <div class="picker-current" :style="themeBackground ? { background: themeBackground } : {}">
      <div class="picker-preview" :style="{ background: modelValue }">
        <span class="picker-preview-label" :style="{ color: contrastColor }">Aa</span>
      </div>
      <div class="picker-info">
        <span v-if="tokenId" class="picker-token-name">--{{ tokenId }}</span>
        <span class="picker-hex">{{ modelValue }}</span>
        <div v-if="primitiveRef" class="picker-ref">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 14l11 -11" /><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
          </svg>
          {{ primitiveRef }}
        </div>
      </div>
    </div>

    <!-- ── HEX Input + Pipette ── -->
    <div class="hex-row">
      <label class="input-label">HEX</label>
      <div class="hex-input-wrap">
        <input aria-label="HEX-Wert"
          ref="hexInput"
          type="text"
          class="color-text-input"
          :value="modelValue"
          @input="handleHexInput"
          @blur="validateHex"
          maxlength="9"
        />
        <button class="pipette-btn" @click="openPicker" title="Color Picker öffnen">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 7l6 6" /><path d="M4 16l11.7 -11.7a1 1 0 0 1 1.4 0l2.6 2.6a1 1 0 0 1 0 1.4l-11.7 11.7h-4v-4z" />
          </svg>
        </button>
        <input tabindex="-1" aria-hidden="true"
          ref="nativePicker"
          type="color"
          class="native-picker-hidden"
          :value="normalizeHex(modelValue)"
          @input="$emit('update:modelValue', $event.target.value)"
        />
      </div>
    </div>

    <!-- ── WCAG Contrast (wenn contrastTarget gesetzt) ── -->
    <div v-if="contrastTarget" class="picker-contrast">
      <span class="contrast-ratio-label">Contrast</span>
      <span :class="['contrast-ratio-value', contrastLevel]">
        {{ contrastRatio }}:1
      </span>
      <span :class="['wcag-mini-badge', { pass: contrastRatio >= 4.5 }]">AA</span>
      <span :class="['wcag-mini-badge', { pass: contrastRatio >= 7 }]">AAA</span>
    </div>

    <!-- ── Token Palettes (primitive-picker Stil) ── -->
    <div v-if="tokenPalettes.length" class="picker-palettes">
      <div
        v-for="group in tokenPalettes"
        :key="group.id"
        class="picker-palette-group"
      >
        <span class="picker-palette-label">{{ group.label }}</span>
        <div class="picker-palette-strip">
          <button
            v-for="shade in group.shades"
            :key="shade.token"
            :class="['picker-swatch', {
              'picker-swatch--active': modelValue === shade.color,
              'picker-swatch--white': group.id === 'white'
            }]"
            :style="{ background: shade.color }"
            :title="`${shade.token}\n${shade.color}`"
            @click="selectSwatch(shade)"
          >
            <span class="picker-swatch-step">{{ shade.step }}</span>
          </button>
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
  tokenPalettes: { type: Array, default: () => [] },
  contrastTarget: { type: String, default: '' },
  themeBackground: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'select-primitive'])
const hexInput = ref(null)
const nativePicker = ref(null)

// Reverse-lookup: welches Primitive-Token passt zum aktuellen Wert?
const primitiveRef = computed(() => {
  if (!props.tokenPalettes.length || !props.modelValue) return null
  const normalized = props.modelValue.toLowerCase()
  for (const group of props.tokenPalettes) {
    for (const shade of group.shades) {
      if (shade.color.toLowerCase() === normalized) return shade.token
    }
  }
  return null
})

function openPicker() {
  nativePicker.value?.click()
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

function selectSwatch(shade) {
  emit('update:modelValue', shade.color)
  emit('select-primitive', shade)
}

// Contrast calculation
function hexToRgb(hex) {
  if (!hex || hex === 'transparent') return { r: 0, g: 0, b: 0 }
  if (!hex.startsWith('#')) return { r: 0, g: 0, b: 0 }
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

/* ── Current Color Preview ── */
.picker-current {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--cfg-border);
}

.picker-preview {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 1px solid var(--cfg-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.picker-preview-label {
  font-size: 16px;
  font-weight: 700;
}

.picker-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.picker-token-name {
  font-size: 11px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  color: var(--cfg-text);
}

.picker-hex {
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--cfg-text-muted);
}

.picker-ref {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--cfg-accent);
  margin-top: 1px;
}

/* ── HEX Input + Pipette ── */
.hex-row {
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

.hex-input-wrap {
  display: flex;
  gap: 4px;
  align-items: center;
  position: relative;
}

.color-text-input {
  flex: 1;
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

.pipette-btn {
  width: 28px;
  height: 28px;
  border: 1px solid var(--cfg-border);
  border-radius: 4px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-shrink: 0;
  transition: color 0.1s, border-color 0.1s;
}

.pipette-btn:hover {
  color: var(--cfg-accent);
  border-color: var(--cfg-accent);
}

.native-picker-hidden {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

/* ── WCAG Contrast Mini-Bar ── */
.picker-contrast {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: var(--cfg-surface);
  border-radius: 6px;
  border: 1px solid var(--cfg-border);
}

.contrast-ratio-label {
  font-size: 10px;
  color: var(--cfg-text-muted);
  font-weight: 500;
}

.contrast-ratio-value {
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  margin-right: auto;
}

.contrast-ratio-value.aaa { color: var(--cfg-indicator-pass); }
.contrast-ratio-value.aa { color: var(--cfg-indicator-pass); }
.contrast-ratio-value.aa-large { color: var(--cfg-indicator-warn); }
.contrast-ratio-value.fail { color: var(--cfg-indicator-fail); }

.wcag-mini-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--cfg-indicator-fail-bg);
  color: var(--cfg-indicator-fail);
}

.wcag-mini-badge.pass {
  background: var(--cfg-indicator-pass-bg);
  color: var(--cfg-indicator-pass);
}

/* ── Palette Groups (primitive-picker Stil) ── */
.picker-palettes {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 4px;
}

.picker-palette-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.picker-palette-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--cfg-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.picker-palette-strip {
  display: flex;
  border-radius: 6px;
  overflow: hidden;
}

.picker-swatch {
  flex: 1;
  height: 28px;
  border: none;
  padding: 0;
  cursor: pointer;
  position: relative;
  transition: transform var(--fnd-motion-duration-100);
  display: flex;
  align-items: center;
  justify-content: center;
}

.picker-swatch:hover {
  transform: scaleY(1.3);
  z-index: 2;
  box-shadow: var(--cfg-shadow-md);
}

.picker-swatch--active {
  box-shadow: inset 0 0 0 2px var(--cfg-accent), 0 0 0 1px var(--cfg-accent);
  z-index: 3;
  transform: scaleY(1.15);
}

.picker-swatch--white {
  box-shadow: inset 0 0 0 1px var(--cfg-border);
}

.picker-swatch--white.picker-swatch--active {
  box-shadow: inset 0 0 0 2px var(--cfg-accent), 0 0 0 1px var(--cfg-accent);
}

.picker-swatch-step {
  font-size: 6px;
  font-weight: 700;
  opacity: 0;
  color: white;
  mix-blend-mode: difference;
  transition: opacity var(--fnd-motion-duration-100);
  pointer-events: none;
}

.picker-swatch:hover .picker-swatch-step {
  opacity: 1;
}
</style>
