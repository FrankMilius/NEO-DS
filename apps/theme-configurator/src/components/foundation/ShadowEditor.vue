<template>
  <div class="shadow-editor">
    <section class="token-section">
      <h3 class="sub-heading">Shadow Levels</h3>
      <div class="shadow-grid">
        <div
          v-for="(shadow, key) in shadows"
          :key="key"
          class="shadow-card"
        >
          <div class="shadow-demo" :style="{ boxShadow: shadow.value }"></div>
          <div class="shadow-info">
            <span class="shadow-label">{{ shadow.label }}</span>
            <code class="shadow-token">--fnd-shadow-{{ key }}</code>
            <code class="shadow-value">{{ shadow.value }}</code>
          </div>
        </div>
      </div>
    </section>

    <section class="token-section">
      <h3 class="sub-heading">Elevation Mapping</h3>
      <p class="sub-desc">Semantic elevation levels mapped to shadow values.</p>
      <div class="elevation-grid">
        <div v-for="(elev, key) in elevations" :key="key" class="elevation-card">
          <div class="elevation-demo" :style="{ boxShadow: getShadowForElevation(elev.value) }">
            <span class="elevation-icon">{{ elevationIcons[key] }}</span>
          </div>
          <div class="elevation-info">
            <span class="elevation-label">{{ elev.label }}</span>
            <code class="elevation-map">shadow-{{ elev.value }}</code>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { foundationTokens } from '../../data/tokens.js'

const shadows = foundationTokens.shadow.tokens
const elevations = foundationTokens.elevation.tokens

const elevationIcons = {
  base: '~',
  raised: '^',
  floating: '^^',
  overlay: '^^^',
  modal: '^^^^'
}

function getShadowForElevation(shadowKey) {
  return shadows[shadowKey]?.value || 'none'
}
</script>

<style scoped>
.shadow-editor {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.token-section { display: flex; flex-direction: column; gap: 16px; }
.sub-heading { font-size: 15px; font-weight: 700; color: var(--cfg-text); margin: 0; }
.sub-desc { font-size: 12px; color: var(--cfg-text-muted); margin: 0; }

.shadow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.shadow-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: var(--cfg-surface);
  border: 1px solid var(--cfg-border);
  border-radius: 10px;
}

.shadow-demo {
  width: 100%;
  height: 60px;
  background: var(--cfg-surface);
  border-radius: 8px;
}

.shadow-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.shadow-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--cfg-text);
}

.shadow-token {
  font-size: 10px;
  color: var(--cfg-text-muted);
}

.shadow-value {
  font-size: 9px;
  color: var(--cfg-text-muted);
  word-break: break-all;
}

.elevation-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.elevation-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.elevation-demo {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  background: var(--cfg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--cfg-text-muted);
}

.elevation-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.elevation-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--cfg-text);
}

.elevation-map {
  font-size: 10px;
  color: var(--cfg-text-muted);
}
</style>
