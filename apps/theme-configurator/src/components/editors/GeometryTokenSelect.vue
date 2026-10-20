<template>
  <div class="geo-select" ref="rootEl" @keydown.escape.stop="schliessen(true)">
    <!-- Trigger Button -->
    <button ref="triggerEl" type="button" class="geo-select__trigger" :aria-expanded="isOpen" :aria-controls="popupId"
      :aria-label="`${token.label || token.id}: ${displayValue || 'kein Wert'}${matchedLabel ? ' (' + matchedLabel + ')' : ''}`"
      @click="isOpen ? schliessen(true) : (isOpen = true)" :title="`--${token.id}`">
      <span class="geo-select__value">
        <span v-if="matchedLabel" class="geo-select__matched">{{ displayValue }} · {{ matchedLabel }}</span>
        <span v-else class="geo-select__raw">{{ displayValue || '–' }}</span>
      </span>
      <span v-if="isOverridden" class="geo-select__dot" title="geändert"></span>
      <svg class="geo-select__chevron" :class="{ open: isOpen }" aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </button>

    <!-- Dropdown Panel -->
    <div v-if="isOpen" :id="popupId" ref="dropdownEl" class="geo-select__dropdown" role="group" :aria-label="`Wert für ${token.label || token.id}`"
      data-test="geo-popup" @focusout="beimVerlassen">
      <input aria-label="Token suchen"
        v-if="suggestionGroups.length"
        ref="searchInput"
        class="geo-select__search"
        type="text"
        v-model="searchQuery"
        placeholder="Token suchen …"
      />
      <div class="geo-select__groups">
        <p v-if="!suggestionGroups.length" class="geo-select__leer" data-test="geo-keine-tokens">
          Für diesen Wert gibt es keine passende Token-Skala. Tragen Sie unten einen eigenen Wert ein.
        </p>
        <p v-else-if="!filteredGroups.length" class="geo-select__leer">Kein Token passt zur Suche.</p>
        <template v-for="group in filteredGroups" :key="group.label">
          <div class="geo-select__group-label">{{ group.label }}</div>
          <button
            v-for="item in group.items"
            :key="item.varName"
            type="button"
            :class="['geo-select__item', { active: isItemActive(item) }]"
            :aria-pressed="isItemActive(item)"
            data-test="geo-eintrag"
            @click="selectItem(item)"
          >
            <div class="geo-select__bar" aria-hidden="true">
              <div class="geo-select__bar-fill" :style="{ width: Math.min(inPixel(item.value) || 0, 40) + 'px' }"></div>
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
      <!-- Eigener Wert -->
      <div class="geo-select__custom">
        <label class="geo-select__custom-label" :for="popupId + '-eigen'">Eigener Wert</label>
        <input :id="popupId + '-eigen'"
          ref="eigenInput"
          class="geo-select__custom-input"
          type="text"
          :value="modelValue"
          @keydown.enter="applyCustom($event)"
          @change="applyCustom($event, false)"
          placeholder="z. B. 36px"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount, useId } from 'vue'
import { foundationTokens } from '../../data/tokens.js'
import { useThemeStore } from '../../stores/theme.js'
import { loeseKette, komponentenErbe } from '../../lib/token-erbe.js'
import { vorschlagsGruppen, verweisToken, passendeBezeichnung, popupLage, inPixel } from '../../utils/geometrie-auswahl.js'

const props = defineProps({
  token: { type: Object, required: true },
  modelValue: { type: String, default: '' },
  isOverridden: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const popupId = `geo-popup-${useId()}`

const isOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const eigenInput = ref(null)
const rootEl = ref(null)
const triggerEl = ref(null)
const dropdownEl = ref(null)

watch(isOpen, (val) => {
  if (val) {
    searchQuery.value = ''
    nextTick(() => {
      positionDropdown()
      ;(searchInput.value || eigenInput.value)?.focus()
    })
  }
})

// UX-39: im Fenster halten (vorher ragte das Popup rechts 34px hinaus)
function positionDropdown() {
  if (!triggerEl.value || !dropdownEl.value) return
  const lage = popupLage(triggerEl.value.getBoundingClientRect(), { breite: window.innerWidth, hoehe: window.innerHeight })
  const st = dropdownEl.value.style
  st.top = lage.top + 'px'
  st.left = lage.left + 'px'
  st.width = lage.width + 'px'
  st.maxHeight = lage.maxHeight + 'px'
}

/** @param {boolean} [fokusZurueck] Fokus auf den Ausloeser (Escape, Auswahl) */
function schliessen(fokusZurueck = false) {
  if (!isOpen.value) return
  isOpen.value = false
  if (fokusZurueck) nextTick(() => triggerEl.value?.focus())
}

// Tab aus dem Popup heraus schliesst es (vorher blieb es offen stehen)
function beimVerlassen(e) {
  const ziel = e.relatedTarget
  if (ziel && rootEl.value?.contains(ziel)) return
  if (ziel) schliessen(false)
}

// Click outside to close
function onClickOutside(e) {
  if (rootEl.value && !rootEl.value.contains(e.target)) isOpen.value = false
}

function beiGroessenAenderung() { if (isOpen.value) positionDropdown() }

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
  window.addEventListener('resize', beiGroessenAenderung)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
  window.removeEventListener('resize', beiGroessenAenderung)
})

// ---------------------------------------------------------------------------
// Angezeigter Wert — Verweise aufloesen
// ---------------------------------------------------------------------------
// Erbt der Wert von einer anderen Komponente (var(--nc-…), Plan v3), zeigt
// der Inspector den aufgeloesten Wert — mit Store-Aenderungen — statt des
// rohen Verweises, und nennt die Herkunft.
const store = useThemeStore()
const kette = computed(() => {
  const val = props.modelValue
  if (!val || !/^var\(--nc-/.test(val)) return null
  return loeseKette(val, store.state.componentOverrides?.[store.state.activeThemeSet] || {})
})
const erbe = computed(() => (kette.value ? komponentenErbe(props.modelValue, '') : null))

const roherWert = computed(() => (kette.value ? kette.value.wert : props.modelValue) || '')

const displayValue = computed(() => {
  const val = roherWert.value
  if (!val) return ''
  return verweisToken(val, foundationTokens)?.token.value || val
})

const matchedLabel = computed(() => {
  if (erbe.value) return `erbt von ${erbe.value.category}`
  if (!props.modelValue) return ''
  return passendeBezeichnung(roherWert.value, displayValue.value, props.token.id, foundationTokens)
})

// Nur Skalen, die zum Token passen (Padding → Abstand, Radius → Radius …)
const suggestionGroups = computed(() => vorschlagsGruppen(props.token.id, foundationTokens))

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
// Aktionen
// ---------------------------------------------------------------------------
function isItemActive(item) {
  if (props.modelValue === item.varValue || displayValue.value === item.value) return true
  const px = inPixel(displayValue.value)
  return !Number.isNaN(px) && px === inPixel(item.value)
}

function selectItem(item) {
  emit('update:modelValue', item.varValue)
  schliessen(true)
}

function applyCustom(e, zu = true) {
  const val = e.target.value.trim()
  if (val && val !== props.modelValue) {
    emit('update:modelValue', val)
  }
  if (zu) schliessen(true)
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

.geo-select__trigger:focus-visible,
.geo-select__item:focus-visible,
.geo-select__search:focus-visible,
.geo-select__custom-input:focus-visible {
  outline: 2px solid var(--cfg-accent);
  outline-offset: 1px;
}

.geo-select__leer {
  margin: 0;
  padding: 8px;
  font-size: 11px;
  line-height: 1.4;
  color: var(--cfg-text-secondary);
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
  width: 260px;
  max-width: calc(100vw - 16px);
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  background: var(--cfg-surface);
  box-shadow: var(--cfg-shadow-popover);
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
