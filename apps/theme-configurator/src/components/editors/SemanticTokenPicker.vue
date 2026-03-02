<template>
  <div class="semantic-picker" v-if="suggestions.length > 0">
    <button class="picker-toggle" @click="isOpen = !isOpen">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
      {{ isOpen ? 'Hide' : 'Map to' }} Foundation Token
      <svg class="picker-chevron" :class="{ open: isOpen }" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </button>

    <div v-if="isOpen" class="picker-dropdown">
      <input
        ref="searchInput"
        class="picker-search"
        type="text"
        v-model="searchQuery"
        placeholder="Search foundation tokens..."
        @input="onSearch"
      />
      <div class="picker-groups">
        <template v-for="group in filteredSuggestions" :key="group.label">
          <div class="picker-group-label">{{ group.label }}</div>
          <button
            v-for="item in group.items"
            :key="item.value"
            :class="['picker-item', { active: item.value === currentValue }]"
            @click="$emit('select', item.value)"
            :title="item.description"
          >
            <div v-if="item.preview && token.type === 'color'" class="picker-swatch" :style="{ background: item.preview }"></div>
            <div v-else-if="token.type === 'size'" class="picker-size-bar">
              <div class="picker-size-fill" :style="{ width: Math.min(parseFloat(item.resolvedValue || '0'), 40) + 'px' }"></div>
            </div>
            <div class="picker-item-info">
              <span class="picker-item-name">{{ item.label }}</span>
              <code class="picker-item-token">{{ item.tokenName }}</code>
            </div>
            <code class="picker-item-value">{{ item.resolvedValue }}</code>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { semanticTokenGroups, foundationTokens } from '../../data/tokens.js'

const props = defineProps({
  token: { type: Object, required: true },
  currentValue: { type: String, default: '' }
})

defineEmits(['select'])

const store = useThemeStore()
const isOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

function onSearch() {
  // Search is reactive via v-model
}

/**
 * Build suggestion list based on token type.
 */
const suggestions = computed(() => {
  const groups = []
  const type = props.token.type

  if (type === 'color') {
    // Semantic color tokens
    for (const group of semanticTokenGroups) {
      const items = group.tokens.map(t => {
        const resolved = store.currentSemanticTokens.value[t.id] || ''
        return {
          label: t.label,
          tokenName: `--fnd-color-${t.id}`,
          value: `var(--fnd-color-${t.id})`,
          resolvedValue: resolved,
          preview: resolved,
          description: t.description || ''
        }
      })
      if (items.length > 0) {
        groups.push({ label: group.label, items })
      }
    }
  }

  if (type === 'size') {
    // Spacing tokens
    if (foundationTokens.spacing) {
      const items = Object.entries(foundationTokens.spacing.tokens).map(([key, t]) => ({
        label: `Spacing ${key}`,
        tokenName: `--fnd-spacing-${key}`,
        value: `var(--fnd-spacing-${key})`,
        resolvedValue: t.value,
        preview: null,
        description: `${t.label}: ${t.value}`
      }))
      if (items.length > 0) groups.push({ label: 'Spacing', items })
    }

    // Size tokens
    if (foundationTokens.sizes) {
      const items = Object.entries(foundationTokens.sizes.tokens).map(([key, t]) => ({
        label: `Size ${key.toUpperCase()}`,
        tokenName: `--fnd-size-${key}`,
        value: `var(--fnd-size-${key})`,
        resolvedValue: t.value,
        preview: null,
        description: `${t.label}: ${t.value}`
      }))
      if (items.length > 0) groups.push({ label: 'Sizes', items })
    }

    // Radius tokens
    if (foundationTokens.radius) {
      const items = Object.entries(foundationTokens.radius.tokens)
        .filter(([key]) => key !== 'null')
        .map(([key, t]) => ({
          label: `Radius ${key.toUpperCase()}`,
          tokenName: `--fnd-radius-${key}`,
          value: `var(--fnd-radius-${key})`,
          resolvedValue: t.value,
          preview: null,
          description: `${t.label}: ${t.value}`
        }))
      if (items.length > 0) groups.push({ label: 'Radii', items })
    }
  }

  return groups
})

const filteredSuggestions = computed(() => {
  if (!searchQuery.value) return suggestions.value
  const q = searchQuery.value.toLowerCase()
  return suggestions.value
    .map(group => ({
      ...group,
      items: group.items.filter(item =>
        item.label.toLowerCase().includes(q) ||
        item.tokenName.toLowerCase().includes(q) ||
        (item.resolvedValue && item.resolvedValue.toLowerCase().includes(q))
      )
    }))
    .filter(group => group.items.length > 0)
})
</script>

<style scoped>
.semantic-picker {
  margin-top: 4px;
}

.picker-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 6px 10px;
  border: 1px dashed var(--cfg-border);
  border-radius: 6px;
  background: transparent;
  color: var(--cfg-text-muted);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}

.picker-toggle:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
}

.picker-chevron {
  margin-left: auto;
  transition: transform 0.15s;
}

.picker-chevron.open { transform: rotate(180deg); }

.picker-dropdown {
  margin-top: 6px;
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  background: var(--cfg-surface);
  max-height: 280px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.picker-search {
  padding: 8px 10px;
  border: none;
  border-bottom: 1px solid var(--cfg-border);
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font-size: 11px;
  outline: none;
}

.picker-groups {
  overflow-y: auto;
  padding: 4px;
}

.picker-group-label {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cfg-text-muted);
  padding: 6px 8px 3px;
}

.picker-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 5px 8px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--cfg-text);
  font-size: 11px;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
}

.picker-item:hover { background: var(--cfg-surface-elevated); }
.picker-item.active { background: #dbeafe; }

.picker-swatch {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1px solid var(--cfg-border);
  flex-shrink: 0;
}

.picker-size-bar {
  width: 40px;
  height: 8px;
  background: var(--cfg-surface-elevated);
  border-radius: 2px;
  flex-shrink: 0;
  overflow: hidden;
}

.picker-size-fill {
  height: 100%;
  background: var(--cfg-accent);
  opacity: 0.5;
  border-radius: 2px;
}

.picker-item-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.picker-item-name {
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.picker-item-token {
  font-size: 9px;
  color: var(--cfg-text-muted);
}

.picker-item-value {
  font-size: 9px;
  color: var(--cfg-text-muted);
  background: var(--cfg-surface-elevated);
  padding: 1px 4px;
  border-radius: 3px;
  flex-shrink: 0;
}
</style>
