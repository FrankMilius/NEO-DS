<template>
  <div class="geo-select" ref="rootEl">
    <!-- Trigger Button -->
    <button class="geo-select__trigger" @click="isOpen = !isOpen" :title="`--${token.id}`">
      <span class="geo-select__value">
        <span v-if="matchedLabel" class="geo-select__matched">{{ displayValue }} · {{ matchedLabel }}</span>
        <span v-else class="geo-select__raw">{{ displayValue || '–' }}</span>
      </span>
      <span v-if="isOverridden" class="geo-select__dot" title="modified"></span>
      <svg class="geo-select__chevron" :class="{ open: isOpen }" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </button>

    <!-- Dropdown Panel -->
    <div v-if="isOpen" ref="dropdownEl" class="geo-select__dropdown">
      <input
        ref="searchInput"
        class="geo-select__search"
        type="text"
        v-model="searchQuery"
        placeholder="Search tokens..."
        @keydown.escape="isOpen = false"
      />
      <div class="geo-select__groups">
        <template v-for="group in filteredGroups" :key="group.label">
          <div class="geo-select__group-label">{{ group.label }}</div>
          <button
            v-for="item in group.items"
            :key="item.varName"
            :class="['geo-select__item', { active: isItemActive(item) }]"
            @click="selectItem(item)"
          >
            <div class="geo-select__bar">
              <div class="geo-select__bar-fill" :style="{ width: Math.min(parseFloat(item.value), 80) + 'px' }"></div>
            </div>
            <div class="geo-select__item-info">
              <span class="geo-select__item-name">{{ item.label }}</span>
              <code class="geo-select__item-var">{{ item.varName }}</code>
            </div>
            <code class="geo-select__item-value">{{ item.value }}</code>
            <span v-if="item.rem" class="geo-select__item-rem">{{ item.rem }}</span>
          </button>
        </template>
      </div>
      <!-- Custom value -->
      <div class="geo-select__custom">
        <span class="geo-select__custom-label">Custom</span>
        <input
          class="geo-select__custom-input"
          type="text"
          :value="modelValue"
          @keydown.enter="applyCustom($event)"
          @blur="applyCustom($event)"
          placeholder="e.g. 36px"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { foundationTokens } from '../../data/tokens.js'

const props = defineProps({
  token: { type: Object, required: true },
  modelValue: { type: String, default: '' },
  isOverridden: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const rootEl = ref(null)

// Focus search input when dropdown opens
const dropdownEl = ref(null)

watch(isOpen, (val) => {
  if (val) {
    searchQuery.value = ''
    nextTick(() => {
      searchInput.value?.focus()
      positionDropdown()
    })
  }
})

function positionDropdown() {
  if (!rootEl.value || !dropdownEl.value) return
  const trigger = rootEl.value.querySelector('.geo-select__trigger')
  if (!trigger) return
  const rect = trigger.getBoundingClientRect()
  const dropH = 320
  const spaceBelow = window.innerHeight - rect.bottom - 8
  const top = spaceBelow >= dropH ? rect.bottom + 4 : rect.top - dropH - 4
  dropdownEl.value.style.top = Math.max(8, top) + 'px'
  dropdownEl.value.style.left = rect.left + 'px'
  dropdownEl.value.style.width = Math.max(260, rect.width) + 'px'
}

// Click outside to close
function onClickOutside(e) {
  if (rootEl.value && !rootEl.value.contains(e.target) && (!dropdownEl.value || !dropdownEl.value.contains(e.target))) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))

// ---------------------------------------------------------------------------
// Display value — resolve var() references to px
// ---------------------------------------------------------------------------
const displayValue = computed(() => {
  const val = props.modelValue
  if (!val) return ''
  // If it's a var() reference, try to resolve it
  const varMatch = val.match(/^var\(--fnd-(size|spacing|radius)-(.+)\)$/)
  if (varMatch) {
    const [, category, key] = varMatch
    const catMap = { size: 'sizes', spacing: 'spacing', radius: 'radius' }
    const cat = foundationTokens[catMap[category]]
    if (cat?.tokens[key]) return cat.tokens[key].value
  }
  return val
})

// ---------------------------------------------------------------------------
// Match current value to a foundation token label
// ---------------------------------------------------------------------------
const matchedLabel = computed(() => {
  const val = props.modelValue
  if (!val) return ''

  // Direct var() reference match
  const varMatch = val.match(/^var\(--fnd-(size|spacing|radius)-(.+)\)$/)
  if (varMatch) {
    const [, category, key] = varMatch
    const catMap = { size: 'sizes', spacing: 'spacing', radius: 'radius' }
    const cat = foundationTokens[catMap[category]]
    if (cat?.tokens[key]) {
      const prefix = category === 'size' ? 'Size' : category === 'spacing' ? 'Spacing' : 'Radius'
      return `${prefix} ${cat.tokens[key].label}`
    }
  }

  // Reverse lookup by resolved px value
  const pxVal = displayValue.value
  for (const [catKey, cat] of Object.entries(foundationTokens)) {
    if (!['sizes', 'spacing', 'radius'].includes(catKey)) continue
    for (const [key, tok] of Object.entries(cat.tokens)) {
      if (tok.value === pxVal) {
        const prefix = catKey === 'sizes' ? 'Size' : catKey === 'spacing' ? 'Spacing' : 'Radius'
        return `${prefix} ${tok.label}`
      }
    }
  }
  return ''
})

// ---------------------------------------------------------------------------
// Build suggestion groups based on token ID context
// ---------------------------------------------------------------------------
const suggestionGroups = computed(() => {
  const groups = []
  const tokenId = props.token.id

  // Determine relevant categories based on token ID
  const isRadius = tokenId.includes('radius')
  const isHeight = tokenId.includes('height') || tokenId.includes('min-height')
  const isWidth = tokenId.includes('width') || tokenId.includes('max-width')
  const isPadding = tokenId.includes('padding') || tokenId.includes('gap') || tokenId.includes('spacing') || tokenId.includes('margin') || tokenId.includes('indent')
  const isSize = tokenId.includes('-size') && !tokenId.includes('font-size')
  const isFontSize = tokenId.includes('font-size')
  const isFontWeight = tokenId.includes('weight')

  // Build ordered category list — nur passende Kategorien
  const categoryOrder = []
  if (isRadius) {
    categoryOrder.push('radius')
  } else if (isFontSize) {
    // Font-sizes brauchen keine Foundation-Tokens im Dropdown (die kommen via Typography)
  } else if (isFontWeight) {
    // Font-weights brauchen keine Foundation-Tokens
  } else if (isPadding) {
    categoryOrder.push('spacing')
  } else if (isHeight || isSize) {
    categoryOrder.push('sizes')
  } else if (isWidth) {
    categoryOrder.push('sizes', 'spacing')
  } else if (tokenId.includes('border-width') || tokenId.includes('outline') || tokenId.includes('ring')) {
    categoryOrder.push('border')
  } else if (tokenId.includes('icon')) {
    categoryOrder.push('sizes')
  } else {
    // Nur Sizes als Fallback — keine Cross-Category Vorschlaege mehr
    categoryOrder.push('sizes')
  }

  for (const catKey of categoryOrder) {
    const cat = foundationTokens[catKey]
    if (!cat) continue
    const varPrefix = catKey === 'sizes' ? '--fnd-size' : catKey === 'spacing' ? '--fnd-spacing' : '--fnd-radius'
    const items = Object.entries(cat.tokens)
      .filter(([key]) => key !== 'null')
      .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
      .map(([key, tok]) => ({
        label: `${cat.label === 'Sizes' ? 'Size' : cat.label === 'Spacing' ? 'Spacing' : 'Radius'} ${tok.label}`,
        varName: `${varPrefix}-${key}`,
        varValue: `var(${varPrefix}-${key})`,
        value: tok.value,
        rem: tok.rem || ''
      }))
    if (items.length) groups.push({ label: cat.label, items })
  }

  return groups
})

const filteredGroups = computed(() => {
  if (!searchQuery.value) return suggestionGroups.value
  const q = searchQuery.value.toLowerCase()
  return suggestionGroups.value
    .map(g => ({
      ...g,
      items: g.items.filter(item =>
        item.label.toLowerCase().includes(q) ||
        item.varName.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q) ||
        (item.rem && item.rem.toLowerCase().includes(q))
      )
    }))
    .filter(g => g.items.length > 0)
})

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
function isItemActive(item) {
  return props.modelValue === item.varValue || displayValue.value === item.value
}

function selectItem(item) {
  emit('update:modelValue', item.varValue)
  isOpen.value = false
}

function applyCustom(e) {
  const val = e.target.value.trim()
  if (val && val !== props.modelValue) {
    emit('update:modelValue', val)
  }
  isOpen.value = false
}
</script>

<style scoped>
.geo-select {
  position: relative;
  flex: 1;
  min-width: 0;
}

.geo-select__trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-height: 28px;
  padding: 3px 8px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font-size: 11px;
  font-family: monospace;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s;
}

.geo-select__trigger:hover {
  border-color: var(--cfg-accent);
}

.geo-select__value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.geo-select__matched {
  color: var(--cfg-text);
}

.geo-select__raw {
  color: var(--cfg-text-muted);
}

.geo-select__dot {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: var(--cfg-accent);
  flex-shrink: 0;
}

.geo-select__chevron {
  flex-shrink: 0;
  color: var(--cfg-text-muted);
  transition: transform 0.15s;
}

.geo-select__chevron.open {
  transform: rotate(180deg);
}

/* Dropdown Panel — fixed position to escape overflow containers */
.geo-select__dropdown {
  position: fixed;
  min-width: 260px;
  width: 260px;
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  background: var(--cfg-surface);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  max-height: 320px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.geo-select__search {
  padding: 8px 10px;
  border: none;
  border-bottom: 1px solid var(--cfg-border);
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font-size: 11px;
  outline: none;
}

.geo-select__groups {
  overflow-y: auto;
  padding: 4px;
  flex: 1;
}

.geo-select__group-label {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cfg-text-muted);
  padding: 6px 8px 3px;
}

.geo-select__item {
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

.geo-select__item:hover {
  background: var(--cfg-surface-elevated);
}

.geo-select__item.active {
  background: var(--cfg-accent-subtle);
  color: var(--cfg-accent);
}

.geo-select__bar {
  width: 40px;
  height: 6px;
  background: var(--cfg-surface-elevated);
  border-radius: 2px;
  flex-shrink: 0;
  overflow: hidden;
}

.geo-select__item.active .geo-select__bar {
  background: color-mix(in srgb, var(--cfg-accent) 15%, transparent);
}

.geo-select__bar-fill {
  height: 100%;
  background: var(--cfg-accent);
  opacity: 0.5;
  border-radius: 2px;
}

.geo-select__item-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.geo-select__item-name {
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.geo-select__item-var {
  font-size: 9px;
  color: var(--cfg-text-muted);
}

.geo-select__item-value {
  font-size: 10px;
  color: var(--cfg-text-muted);
  background: var(--cfg-surface-elevated);
  padding: 1px 4px;
  border-radius: 3px;
  flex-shrink: 0;
  font-family: monospace;
}

.geo-select__item-rem {
  font-size: 9px;
  color: var(--cfg-text-muted);
  flex-shrink: 0;
}

/* Custom Value Input */
.geo-select__custom {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-top: 1px solid var(--cfg-border);
  background: var(--cfg-surface-elevated);
}

.geo-select__custom-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--cfg-text-muted);
  flex-shrink: 0;
}

.geo-select__custom-input {
  flex: 1;
  min-width: 0;
  height: 24px;
  padding: 0 6px;
  border: 1px solid var(--cfg-border);
  border-radius: 4px;
  background: var(--cfg-surface);
  color: var(--cfg-text);
  font-size: 11px;
  font-family: monospace;
  outline: none;
}

.geo-select__custom-input:focus {
  border-color: var(--cfg-accent);
}
</style>
