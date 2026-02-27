<template>
  <div class="border-editor">
    <section class="token-section">
      <h3 class="sub-heading">Border Width</h3>
      <div class="token-list">
        <div
          v-for="(token, key) in widthTokens"
          :key="key"
          class="token-row"
        >
          <div class="token-info">
            <span class="token-label">{{ token.label }}</span>
            <code class="token-name">--fnd-border-{{ key }}</code>
          </div>
          <div class="token-preview">
            <div class="preview-border-width" :style="{ borderBottomWidth: token.value, borderBottomStyle: 'solid' }"></div>
          </div>
          <div class="token-value-display">
            <code>{{ token.value }}</code>
          </div>
        </div>
      </div>
    </section>

    <section class="token-section">
      <h3 class="sub-heading">Border Style</h3>
      <div class="token-list">
        <div
          v-for="(token, key) in styleTokens"
          :key="key"
          class="token-row"
        >
          <div class="token-info">
            <span class="token-label">{{ token.label }}</span>
            <code class="token-name">--fnd-border-{{ key }}</code>
          </div>
          <div class="token-preview">
            <div class="preview-border-style" :style="{ borderBottomStyle: token.value }"></div>
          </div>
          <div class="token-value-display">
            <code>{{ token.value }}</code>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { foundationTokens } from '../../data/tokens.js'

const allTokens = foundationTokens.border?.tokens || {}

const widthTokens = computed(() => {
  const result = {}
  for (const [key, token] of Object.entries(allTokens)) {
    if (token.type === 'width') result[key] = token
  }
  return result
})

const styleTokens = computed(() => {
  const result = {}
  for (const [key, token] of Object.entries(allTokens)) {
    if (token.type === 'style') result[key] = token
  }
  return result
})
</script>

<style scoped>
.border-editor {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.token-section { display: flex; flex-direction: column; gap: 16px; }
.sub-heading { font-size: 15px; font-weight: 700; color: var(--cfg-text); margin: 0; }

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

.preview-border-width,
.preview-border-style {
  width: 100%;
  height: 0;
  border-bottom-color: var(--cfg-accent);
}

.preview-border-style {
  border-bottom-width: 2px;
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
