<template>
  <div class="elements-overview">
    <div class="elements-grid">
      <div
        v-for="group in groups"
        :key="group.label"
        class="element-card"
      >
        <h3 class="card-title">{{ group.label }}</h3>
        <div class="property-list">
          <div
            v-for="item in group.items"
            :key="item.property"
            class="property-row"
          >
            <code class="property-name">{{ item.property }}</code>
            <code class="property-value">{{ item.value }}</code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { foundationTokens } from '../../data/tokens.js'

const groups = foundationTokens.elements?.groups || []
</script>

<style scoped>
.elements-overview {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.elements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.element-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--cfg-surface);
  border: 1px solid var(--cfg-border);
  border-radius: 10px;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--cfg-text);
  margin: 0;
}

.property-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.property-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.property-name {
  font-size: 11px;
  color: var(--cfg-text-muted);
  flex-shrink: 0;
}

.property-value {
  font-size: 11px;
  color: var(--cfg-text);
  background: var(--cfg-surface-elevated);
  padding: 2px 6px;
  border-radius: 4px;
  text-align: right;
  word-break: break-all;
}
</style>
