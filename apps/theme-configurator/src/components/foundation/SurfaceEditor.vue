<template>
  <div class="surface-editor">
    <section class="surface-section">
      <h3 class="sub-heading">
        <span class="tier-badge tier-2">L2</span>
        Surface System
        <span class="theme-indicator">{{ themeLabel }}</span>
      </h3>
      <p class="sub-desc">
        Carbon-model layer system. Surfaces alternate (light) or ascend (dark) for depth.
      </p>

      <div class="surface-grid">
        <div v-for="surface in surfaces" :key="surface.id" class="surface-card">
          <div class="surface-preview" :style="{ background: getColor(surface.tokenId) }">
            <div class="surface-content-preview" :style="{ color: getColor(surface.onTokenId) }">
              <span class="surface-label-big">{{ surface.label }}</span>
              <span class="surface-sublabel">{{ surface.desc }}</span>
            </div>
          </div>
          <div class="surface-controls">
            <div class="control-row">
              <label class="control-label">Background</label>
              <div class="control-input">
                <input :aria-label="`${surface.label}: Background wählen`"
                  type="color"
                  :value="normalizeHex(getColor(surface.tokenId))"
                  @input="updateToken(surface.tokenId, $event.target.value)"
                  class="color-mini"
                />
                <input :aria-label="`${surface.label}: Background als HEX-Wert`"
                  type="text"
                  :value="getColor(surface.tokenId)"
                  @change="updateToken(surface.tokenId, $event.target.value)"
                  class="hex-mini"
                />
              </div>
            </div>
            <div class="control-row">
              <label class="control-label">On-Color</label>
              <div class="control-input">
                <input :aria-label="`${surface.label}: On-Color wählen`"
                  type="color"
                  :value="normalizeHex(getColor(surface.onTokenId))"
                  @input="updateToken(surface.onTokenId, $event.target.value)"
                  class="color-mini"
                />
                <input :aria-label="`${surface.label}: On-Color als HEX-Wert`"
                  type="text"
                  :value="getColor(surface.onTokenId)"
                  @change="updateToken(surface.onTokenId, $event.target.value)"
                  class="hex-mini"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nesting Preview -->
    <section class="nesting-preview">
      <h3 class="sub-heading">Nesting Preview</h3>
      <p class="sub-desc">How surfaces nest within the base page background.</p>
      <div class="nest-demo" :style="{ background: getColor('background-base'), color: getColor('on-surface') }">
        <span class="nest-label">Page (background-base)</span>
        <div class="nest-level" :style="{ background: getColor('layer-01'), color: getColor('on-layer-01') }">
          <span class="nest-label">Surface 01 (layer-01)</span>
          <div class="nest-level" :style="{ background: getColor('layer-02'), color: getColor('on-layer-02') }">
            <span class="nest-label">Surface 02 (layer-02)</span>
            <div class="nest-level" :style="{ background: getColor('layer-03') }">
              <span class="nest-label">Surface 03 (layer-03)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'

const store = useThemeStore()

const themeLabel = computed(() => {
  const labels = {
    'neo-light': 'NEO Light', 'neo-dark': 'NEO Dark',
    'customer-light': 'Customer Light', 'customer-dark': 'Customer Dark'
  }
  return labels[store.currentThemeKey] || ''
})

const surfaces = [
  { id: 's01', label: 'Surface 01', desc: 'Cards, containers', tokenId: 'layer-01', onTokenId: 'on-layer-01' },
  { id: 's02', label: 'Surface 02', desc: 'Nested elements', tokenId: 'layer-02', onTokenId: 'on-layer-02' },
  { id: 's03', label: 'Surface 03', desc: 'Deep nesting', tokenId: 'layer-03', onTokenId: 'on-surface' }
]

function getColor(tokenId) {
  return store.currentSemanticTokens[tokenId] || '#000000'
}

function normalizeHex(val) {
  if (!val || val === 'transparent') return '#000000'
  return val
}

function updateToken(tokenId, value) {
  store.updateSemanticToken(tokenId, value)
}
</script>

<style scoped>
.surface-editor {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.surface-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sub-heading {
  font-size: 15px;
  font-weight: 700;
  color: var(--cfg-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sub-desc {
  font-size: 12px;
  color: var(--cfg-text-muted);
  margin: 0;
}

.tier-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.tier-2 { background: #dcfce7; color: #16a34a; }

.theme-indicator {
  font-size: 11px;
  font-weight: 600;
  color: var(--cfg-accent);
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--cfg-accent-subtle);
}

.surface-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.surface-card {
  border: 1px solid var(--cfg-border);
  border-radius: 10px;
  overflow: hidden;
  background: var(--cfg-surface);
}

.surface-preview {
  padding: 20px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.surface-content-preview {
  text-align: center;
}

.surface-label-big {
  display: block;
  font-size: 14px;
  font-weight: 700;
}

.surface-sublabel {
  display: block;
  font-size: 11px;
  opacity: 0.7;
  margin-top: 2px;
}

.surface-controls {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.control-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--cfg-text-muted);
}

.control-input {
  display: flex;
  gap: 4px;
  align-items: center;
}

.color-mini {
  width: 24px;
  height: 24px;
  border: 1px solid var(--cfg-border);
  border-radius: 4px;
  padding: 1px;
  cursor: pointer;
  background: transparent;
}

.hex-mini {
  width: 80px;
  height: 24px;
  padding: 0 6px;
  border: 1px solid var(--cfg-border);
  border-radius: 4px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font-size: 11px;
  font-family: monospace;
}

/* Nesting Preview */
.nesting-preview {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nest-demo {
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--cfg-border);
}

.nest-level {
  padding: 16px;
  border-radius: 10px;
  margin-top: 12px;
  border: 1px dashed currentColor;
  opacity: 0.9;
}

.nest-label {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.8;
}
</style>
