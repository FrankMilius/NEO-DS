<template>
  <div class="themes-overview">
    <div class="themes-grid">
      <div
        v-for="theme in themeList"
        :key="theme.id"
        class="theme-card"
        :class="'scheme-' + theme.colorScheme"
      >
        <div class="theme-header">
          <span class="theme-label">{{ theme.label }}</span>
          <span class="theme-role">{{ theme.role }}</span>
        </div>
        <div class="theme-details">
          <div class="detail-row">
            <span class="detail-key">CSS-Klasse</span>
            <code class="detail-value">.{{ theme.id }}</code>
          </div>
          <div class="detail-row">
            <span class="detail-key">color-scheme</span>
            <code class="detail-value">{{ theme.colorScheme }}</code>
          </div>
          <div class="detail-row">
            <span class="detail-key">mix-target</span>
            <code class="detail-value">{{ theme.mixTarget }}</code>
          </div>
        </div>
        <p class="theme-desc">{{ theme.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { foundationTokens } from '../../data/tokens.js'

const themeList = foundationTokens.themes?.themeList || []
</script>

<style scoped>
.themes-overview {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.theme-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--cfg-surface);
  border: 1px solid var(--cfg-border);
  border-radius: 10px;
}

.theme-card.scheme-dark {
  background: color-mix(in srgb, var(--cfg-surface) 90%, #000);
}

.theme-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.theme-label {
  font-size: 15px;
  font-weight: 700;
  color: var(--cfg-text);
}

.theme-role {
  font-size: 11px;
  color: var(--cfg-text-muted);
  background: var(--cfg-surface-elevated);
  padding: 2px 8px;
  border-radius: 4px;
}

.theme-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.detail-key {
  font-size: 11px;
  color: var(--cfg-text-muted);
}

.detail-value {
  font-size: 11px;
  color: var(--cfg-text);
  background: var(--cfg-surface-elevated);
  padding: 2px 6px;
  border-radius: 4px;
}

.theme-desc {
  font-size: 12px;
  color: var(--cfg-text-secondary, var(--cfg-text-muted));
  line-height: 1.5;
  margin: 0;
}
</style>
