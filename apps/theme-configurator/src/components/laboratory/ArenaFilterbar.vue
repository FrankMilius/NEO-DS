<template>
  <div class="arena-filterbar">

    <!-- Filter Bar -->
    <div class="filterbar-row">
      <div
        v-for="cat in visibleCategories"
        :key="cat.key"
        class="filter-dropdown"
        :class="{ open: openDropdown === cat.key }"
      >
        <button
          type="button"
          class="filter-trigger"
          :aria-expanded="openDropdown === cat.key"
          :aria-controls="openDropdown === cat.key ? `cfg-filter-${cat.key}` : undefined"
          @click="toggleDropdown(cat.key)"
        >
          <span class="filter-trigger__label">{{ cat.label }}</span>
          <span class="filter-trigger__count">{{ selectedCount(cat.key) }}/{{ totalCount(cat.key) }}</span>
          <svg aria-hidden="true" class="filter-trigger__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        <!-- Dropdown Panel -->
        <div v-if="openDropdown === cat.key" :id="`cfg-filter-${cat.key}`" class="filter-panel">
          <div class="filter-panel__actions">
            <button type="button" class="filter-panel__action" :aria-label="`${cat.label}: alle auswählen`" @click="selectAll(cat.key)">All</button>
            <button type="button" class="filter-panel__action" :aria-label="`${cat.label}: keine auswählen`" @click="deselectAll(cat.key)">None</button>
          </div>
          <ul class="filter-panel__list" :aria-label="cat.label">
            <li
              v-for="item in dropdownItems(cat.key)"
              :key="item.id"
            >
              <button
                type="button"
                class="filter-panel__item cfg-knopf-reset"
                role="checkbox"
                :aria-checked="item.checked ? 'true' : 'false'"
                @click="toggleDropdownItem(cat.key, item.id)"
              >
              <span :class="['filter-checkbox', { checked: item.checked }]" aria-hidden="true">
                <svg aria-hidden="true" v-if="item.checked" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </span>
              <span class="filter-panel__label">{{ item.label }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Chip Bar -->
    <div v-if="chipGroups.length > 0" class="chipbar-row">
      <template v-for="group in chipGroups" :key="group.category">
        <span class="chipbar-group-label">{{ group.label }}:</span>
        <!-- Chip: Umschalten und Entfernen als zwei Knoepfe nebeneinander (Plan v2, 4.4) -->
        <span
          v-for="chip in group.items"
          :key="group.category + '-' + chip.id"
          :class="['arena-chip', { inactive: !chip.active }]"
        >
          <button
            type="button"
            class="arena-chip__label cfg-knopf-reset"
            :aria-pressed="chip.active ? 'true' : 'false'"
            @click="toggleChip(group.category, chip.id)"
          >{{ chip.label }}</button>
          <button
            type="button"
            class="arena-chip__close cfg-knopf-reset"
            :aria-label="`Filter „${chip.label}“ entfernen`"
            @click.stop="removeChip(group.category, chip.id)"
          >
            <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
            </svg>
          </button>
        </span>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useArenaFilters } from '../../composables/useArenaFilters.js'

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({})
  }
})

const availableOptions = computed(() => props.filters)

const {
  categories,
  chipGroups,
  dropdownItems,
  toggleDropdownItem,
  selectAll,
  deselectAll,
  toggleChip,
  removeChip,
  selectedCount,
  totalCount
} = useArenaFilters(availableOptions)

// categories ist bereits computed und filtert leere Kategorien
const visibleCategories = categories

// Dropdown open/close
const openDropdown = ref(null)

function toggleDropdown(key) {
  openDropdown.value = openDropdown.value === key ? null : key
}

function onClickOutside(e) {
  if (!e.target.closest('.filter-dropdown')) {
    openDropdown.value = null
  }
}

onMounted(() => document.addEventListener('click', onClickOutside, true))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside, true))
</script>

<style scoped>
/* ── Filterbar Container ── */
.arena-filterbar {
  display: flex;
  flex-direction: column;
  background: var(--cfg-surface);
}

/* ── Filter Bar ── */
.filterbar-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  height: 3rem;
  padding: 0 16px;
  border-bottom: 1px solid var(--cfg-border);
}

/* ── Filter Dropdown ── */
.filter-dropdown {
  position: relative;
}

.filter-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface);
  color: var(--cfg-text);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 120ms ease;
  white-space: nowrap;
}

.filter-trigger:hover {
  border-color: var(--cfg-text-muted);
}

.filter-dropdown.open .filter-trigger {
  border-color: var(--cfg-accent);
  box-shadow: 0 0 0 1px var(--cfg-accent);
}

.filter-trigger__count {
  color: var(--cfg-text-muted);
  font-weight: 400;
  font-size: 10px;
}

.filter-trigger__chevron {
  transition: transform 150ms ease;
}

.filter-dropdown.open .filter-trigger__chevron {
  transform: rotate(180deg);
}

/* ── Dropdown Panel ── */
.filter-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 180px;
  max-height: 260px;
  background: var(--cfg-surface);
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 20;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.filter-panel__actions {
  display: flex;
  gap: 4px;
  padding: 6px 8px;
  border-bottom: 1px solid var(--cfg-border);
}

.filter-panel__action {
  padding: 2px 8px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--cfg-accent);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
}

.filter-panel__action:hover {
  background: var(--cfg-surface-elevated);
}

.filter-panel__list {
  list-style: none;
  margin: 0;
  padding: 4px 0;
  overflow-y: auto;
  max-height: 220px;
}

.filter-panel__item {
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 12px;
  color: var(--cfg-text);
  transition: background 80ms ease;
}

.filter-panel__item:hover {
  background: var(--cfg-surface-elevated);
}

.filter-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border: 1px solid var(--cfg-border);
  border-radius: 3px;
  background: var(--cfg-surface);
  flex-shrink: 0;
  transition: all 120ms ease;
}

.filter-checkbox.checked {
  background: var(--cfg-accent);
  border-color: var(--cfg-accent);
  color: #fff;
}

.filter-panel__label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Chip Bar ── */
.chipbar-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  min-height: 3rem;
  padding: 16px;
  border-bottom: 1px solid var(--cfg-border);
}

.chipbar-group-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--cfg-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-right: 2px;
  padding-left: 2px;
}

.chipbar-group-label:not(:first-child) {
  margin-left: 6px;
}

.arena-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 2px 0 8px;
  border: 1px solid var(--cfg-accent);
  border-radius: 10px;
  background: color-mix(in srgb, var(--cfg-accent) 12%, transparent);
  color: var(--cfg-accent);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 120ms ease;
  white-space: nowrap;
}

.arena-chip:hover {
  background: color-mix(in srgb, var(--cfg-accent) 20%, transparent);
}

.arena-chip.inactive {
  border-style: dashed;
  border-color: var(--cfg-text-muted);
  background: transparent;
  color: var(--cfg-text-muted);
  opacity: 0.6;
}

.arena-chip.inactive:hover {
  opacity: 0.8;
}

.arena-chip__label {
  cursor: pointer;
  /* WCAG 2.2 AA 2.5.8: Klickziel mindestens 24 × 24 px (Plan v2, 4.4) */
  min-height: 24px;
  min-width: 24px;
  display: inline-flex;
  align-items: center;
}

.arena-chip__close {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  opacity: 0.5;
  transition: all 100ms ease;
}

.arena-chip__close:hover {
  opacity: 1;
  background: color-mix(in srgb, currentColor 15%, transparent);
}
</style>
