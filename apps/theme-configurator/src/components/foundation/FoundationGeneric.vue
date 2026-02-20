<template>
  <div class="foundation-generic">
    <div class="token-list">
      <div
        v-for="(token, key) in tokens"
        :key="key"
        class="token-row"
      >
        <div class="token-info">
          <span class="token-label">{{ token.label }}</span>
          <code class="token-name">--fnd-{{ category }}-{{ key }}</code>
        </div>
        <div class="token-preview">
          <!-- Radius preview -->
          <div v-if="category === 'radius'" class="preview-radius" :style="{ borderRadius: currentValue(key) }"></div>
          <!-- Spacing preview -->
          <div v-else-if="category === 'spacing'" class="preview-spacing" :style="{ width: currentValue(key) }"></div>
          <!-- Opacity preview -->
          <div v-else-if="category === 'opacity'" class="preview-opacity" :style="{ opacity: currentValue(key) }"></div>
          <!-- Motion preview -->
          <div v-else class="preview-value-text">{{ currentValue(key) }}</div>
        </div>
        <div class="token-value-display">
          <code>{{ currentValue(key) }}</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { foundationTokens } from '../../data/tokens.js'

const props = defineProps({
  category: { type: String, required: true }
})

const store = useThemeStore()

const tokens = computed(() => {
  return foundationTokens[props.category]?.tokens || {}
})

function currentValue(key) {
  return store.currentFoundation.value[props.category]?.[key] ?? tokens.value[key]?.value ?? ''
}
</script>

<style scoped>
.foundation-generic { display: flex; flex-direction: column; gap: 16px; }

.token-list { display: flex; flex-direction: column; gap: 2px; }

.token-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;
  border-radius: 8px;
  transition: background 0.1s;
}

.token-row:hover { background: var(--cfg-surface-elevated); }

.token-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 180px;
  flex-shrink: 0;
}

.token-label { font-size: 13px; font-weight: 600; color: var(--cfg-text); }
.token-name { font-size: 10px; color: var(--cfg-text-muted); }

.token-preview {
  flex: 1;
  display: flex;
  align-items: center;
}

.preview-radius {
  width: 48px;
  height: 48px;
  background: var(--cfg-accent);
  opacity: 0.5;
  transition: border-radius 0.2s;
}

.preview-spacing {
  height: 12px;
  background: var(--cfg-accent);
  opacity: 0.5;
  border-radius: 2px;
  min-width: 4px;
  max-width: 100%;
  transition: width 0.2s;
}

.preview-opacity {
  width: 48px;
  height: 48px;
  background: var(--cfg-accent);
  border-radius: 8px;
  transition: opacity 0.2s;
}

.preview-value-text {
  font-size: 12px;
  color: var(--cfg-text-secondary);
  font-family: monospace;
}

.token-value-display {
  width: 100px;
  text-align: right;
  flex-shrink: 0;
}

.token-value-display code {
  font-size: 11px;
  color: var(--cfg-text-muted);
  background: var(--cfg-surface-elevated);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
