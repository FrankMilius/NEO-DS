<template>
  <div class="icons-editor">

    <!-- ── Icon Libraries ── -->
    <section class="ie-section">
      <h3 class="ie-heading">
        Icon Libraries
        <span class="ie-heading__count">{{ store.currentIconLibraries.length }}</span>
      </h3>

      <div class="ie-lib-list">
        <div
          v-for="lib in store.currentIconLibraries"
          :key="lib.id"
          class="ie-lib-row"
          :class="{ 'ie-lib-row--builtin': lib.builtIn, 'ie-lib-row--active': activeLibrary === lib.id }"
        >
          <button class="ie-lib-select" @click="activeLibrary = lib.id">
            <div class="ie-lib-info">
              <span class="ie-lib-name">{{ lib.name }}</span>
              <span class="ie-lib-meta">
                {{ lib.iconCount || '?' }} Icons
                <span v-if="lib.builtIn" class="ie-lib-badge">Standard</span>
                <span v-else class="ie-lib-badge ie-lib-badge--custom">Custom</span>
              </span>
            </div>
          </button>
          <button
            v-if="!lib.builtIn"
            class="ie-remove-btn"
            @click="store.removeIconLibrary(lib.id)"
            title="Library entfernen"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- Add Library -->
      <div v-if="!showAddLib" class="ie-add-row">
        <button class="ie-add-btn" @click="showAddLib = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          SVG Icon Library hinzufuegen
        </button>
      </div>
      <div v-else class="ie-add-form">
        <div class="ie-add-fields">
          <input aria-label="Name der Icon-Bibliothek"
            ref="addLibInput"
            type="text"
            class="ie-input"
            v-model="newLibName"
            placeholder="Name (z.B. Lucide Icons)"
            @keyup.enter="addLibrary"
            @keyup.escape="cancelAddLib"
          />
          <input aria-label="npm-Paketname"
            type="text"
            class="ie-input"
            v-model="newLibUrl"
            placeholder="npm Package Name (z.B. lucide-static)"
            @keyup.enter="addLibrary"
            @keyup.escape="cancelAddLib"
          />
        </div>
        <div class="ie-add-hint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          Nur SVG-basierte Libraries werden unterstuetzt. Package muss Outline-SVGs enthalten.
        </div>
        <div class="ie-add-actions">
          <button class="ie-btn ie-btn--primary" @click="addLibrary" :disabled="!newLibName.trim() || !newLibUrl.trim()">Hinzufuegen</button>
          <button class="ie-btn ie-btn--ghost" @click="cancelAddLib">Abbrechen</button>
        </div>
      </div>
    </section>

    <!-- ══ Per-Library Configuration ══ -->
    <template v-if="activeLib">
      <div class="ie-lib-header">
        <h3 class="ie-lib-title">{{ activeLib.name }}</h3>
        <span class="ie-lib-title-count">{{ activeLib.iconCount }} Icons</span>
      </div>

      <!-- ── Stroke Color (Light / Dark) ── -->
      <section class="ie-section">
        <h3 class="ie-heading">
          Stroke Color
          <span class="ie-heading__count">{{ activeLibrary }}</span>
        </h3>
        <p class="ie-desc">
          Farbe der Icon-Strokes fuer {{ activeLib.name }}. Pro Theme (Light/Dark) konfigurierbar.
        </p>

        <div class="ie-color-cards">
          <!-- Light -->
          <div class="ie-color-card" :class="{ 'ie-color-card--active': expandedColor === activeLibrary + '-light' }">
            <button class="ie-color-card__header" @click="toggleColorCard(activeLibrary + '-light')">
              <div class="ie-color-card__swatch" :style="{ background: resolvedColorHex(activeLibrary, 'light') }"></div>
              <div class="ie-color-card__meta">
                <span class="ie-color-card__label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/>
                  </svg>
                  Light
                </span>
                <span class="ie-color-card__value">
                  <span v-if="primitiveRefForMode(activeLibrary, 'light')" class="ie-color-card__ref">{{ primitiveRefForMode(activeLibrary, 'light') }}</span>
                  {{ resolvedColorHex(activeLibrary, 'light') }}
                </span>
              </div>
              <svg
                class="ie-color-card__chevron"
                :class="{ 'ie-color-card__chevron--open': expandedColor === activeLibrary + '-light' }"
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              ><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            <div v-if="expandedColor === activeLibrary + '-light'" class="ie-color-card__body">
              <ColorEditor
                :modelValue="resolvedColorHex(activeLibrary, 'light')"
                @update:modelValue="updateStrokeColor(activeLibrary, 'light', $event)"
                @select-primitive="updateStrokeColor(activeLibrary, 'light', $event.color)"
                :tokenId="'fnd-icon-stroke-' + activeLibrary + '-light'"
                :tokenPalettes="palettes"
                :themeBackground="'#ffffff'"
              />
            </div>
          </div>

          <!-- Dark -->
          <div class="ie-color-card" :class="{ 'ie-color-card--active': expandedColor === activeLibrary + '-dark' }">
            <button class="ie-color-card__header" @click="toggleColorCard(activeLibrary + '-dark')">
              <div class="ie-color-card__swatch" :style="{ background: resolvedColorHex(activeLibrary, 'dark') }"></div>
              <div class="ie-color-card__meta">
                <span class="ie-color-card__label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/>
                  </svg>
                  Dark
                </span>
                <span class="ie-color-card__value">
                  <span v-if="primitiveRefForMode(activeLibrary, 'dark')" class="ie-color-card__ref">{{ primitiveRefForMode(activeLibrary, 'dark') }}</span>
                  {{ resolvedColorHex(activeLibrary, 'dark') }}
                </span>
              </div>
              <svg
                class="ie-color-card__chevron"
                :class="{ 'ie-color-card__chevron--open': expandedColor === activeLibrary + '-dark' }"
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              ><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            <div v-if="expandedColor === activeLibrary + '-dark'" class="ie-color-card__body">
              <ColorEditor
                :modelValue="resolvedColorHex(activeLibrary, 'dark')"
                @update:modelValue="updateStrokeColor(activeLibrary, 'dark', $event)"
                @select-primitive="updateStrokeColor(activeLibrary, 'dark', $event.color)"
                :tokenId="'fnd-icon-stroke-' + activeLibrary + '-dark'"
                :tokenPalettes="palettes"
                :themeBackground="'#000000'"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- ── Stroke Width per Size ── -->
      <section class="ie-section">
        <h3 class="ie-heading">
          Stroke Width per Size
          <span class="ie-heading__count">{{ activeLib.name }}</span>
        </h3>
        <div class="ie-token-list">
          <div
            v-for="size in iconSizes"
            :key="'stroke-' + activeLibrary + '-' + size.key"
            class="ie-token-row"
          >
            <div class="ie-token-info">
              <span class="ie-token-label">{{ size.label }}</span>
              <code class="ie-token-name">stroke-width @ {{ size.key }}</code>
            </div>
            <div class="ie-stroke-control">
              <select :aria-label="`Strichstärke ${size.label}`"
                class="ie-value-select"
                :value="currentStroke(activeLibrary, size.key)"
                @change="store.updateIconStrokeWidth(activeLibrary, size.key, $event.target.value)"
              >
                <option v-for="sw in strokeOptions" :key="sw" :value="sw">{{ sw }}px</option>
              </select>
              <div class="ie-stroke-preview" :style="{ color: activeStrokeColor }">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" :stroke-width="currentStroke(activeLibrary, size.key)" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M12 8v4l2 2"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- ── Icon Sizes (global) ── -->
    <section class="ie-section">
      <h3 class="ie-heading">
        Icon Sizes
        <span class="ie-heading__count">6</span>
      </h3>
      <div class="ie-token-list">
        <div
          v-for="size in iconSizes"
          :key="size.key"
          class="ie-token-row"
        >
          <div class="ie-token-info">
            <span class="ie-token-label">{{ size.label }}</span>
            <code class="ie-token-name">{{ size.dimension }}</code>
          </div>
          <div class="ie-token-value">
            <code>{{ size.dimension }}</code>
          </div>
        </div>
      </div>
    </section>

    <!-- ── General Settings ── -->
    <section class="ie-section">
      <h3 class="ie-heading">Allgemein</h3>
      <div class="ie-token-list">
        <div class="ie-token-row">
          <div class="ie-token-info">
            <span class="ie-token-label">Default Size</span>
            <code class="ie-token-name">icon-default-size</code>
          </div>
          <select aria-label="Standardgröße"
            class="ie-value-select"
            :value="currentElementValue('icon-default-size', 'md')"
            @change="store.updateFoundationToken('elements', 'icon-default-size', $event.target.value)"
          >
            <option v-for="size in iconSizes" :key="size.key" :value="size.key">{{ size.key }} ({{ size.dimension }})</option>
          </select>
        </div>
        <div class="ie-token-row">
          <div class="ie-token-info">
            <span class="ie-token-label">Touch Target Min</span>
            <code class="ie-token-name">icon-touch-target</code>
          </div>
          <input aria-label="Mindestgröße Touch-Ziel"
            type="text"
            class="ie-value-input"
            :value="currentElementValue('icon-touch-target', '44px')"
            @change="store.updateFoundationToken('elements', 'icon-touch-target', $event.target.value)"
          />
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { primitiveColors, supportingPalettes, foundationPalettes, neutralPalette, systemPalettes } from '../../data/tokens.js'
import ColorEditor from '../editors/ColorEditor.vue'

const store = useThemeStore()

const iconSizes = [
  { key: 'xs', label: 'XS', dimension: '16px' },
  { key: 'sm', label: 'SM', dimension: '20px' },
  { key: 'md', label: 'MD', dimension: '24px' },
  { key: 'lg', label: 'LG', dimension: '28px' },
  { key: 'xl', label: 'XL', dimension: '32px' },
  { key: '2xl', label: '2XL', dimension: '36px' }
]

const strokeOptions = ['0.5', '0.75', '1', '1.25', '1.5', '1.75', '2', '2.5', '3']

// ── Active Library Selection ──
const activeLibrary = ref('tabler')

const activeLib = computed(() => {
  return store.currentIconLibraries.find(l => l.id === activeLibrary.value) || null
})

// Per-library stroke width lookup
function currentStroke(libId, size) {
  return store.currentIconStrokeWidths?.[libId]?.[size] ?? '1.5'
}

function currentElementValue(key, fallback) {
  return store.currentFoundation.elements?.[key] ?? fallback
}

// ── Add Library ──
const showAddLib = ref(false)
const newLibName = ref('')
const newLibUrl = ref('')
const addLibInput = ref(null)

watch(showAddLib, (v) => { if (v) nextTick(() => addLibInput.value?.focus()) })

function addLibrary() {
  const name = newLibName.value.trim()
  const url = newLibUrl.value.trim()
  if (!name || !url) return
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  store.addIconLibrary({ id, name, npmPackage: url, format: 'svg', builtIn: false, iconCount: 0 })
  activeLibrary.value = id
  cancelAddLib()
}

function cancelAddLib() {
  showAddLib.value = false
  newLibName.value = ''
  newLibUrl.value = ''
}

// ── Stroke Color (Light / Dark) — per Library ──
function palettesToPicker(obj) {
  return Object.entries(obj).map(([id, pal]) => ({
    id, label: pal.label,
    shades: Object.entries(pal.shades).map(([step, color]) => ({ step, color, token: `--fnd-primitive-${id}-${step}` }))
  }))
}

const palettes = computed(() => {
  const groups = []
  for (const [id, pal] of Object.entries(primitiveColors)) {
    groups.push({
      id, label: pal.label,
      shades: Object.entries(pal.shades).map(([step, color]) => ({ step, color, token: `--fnd-primitive-${id}-${step}` }))
    })
  }
  groups.push(...palettesToPicker(supportingPalettes))
  for (const [id, pal] of Object.entries(neutralPalette)) {
    groups.push({
      id, label: pal.label,
      shades: Object.entries(pal.shades).map(([step, color]) => ({ step, color, token: `--fnd-primitive-neutral-${step}` }))
    })
  }
  groups.push(...palettesToPicker(foundationPalettes))
  groups.push(...palettesToPicker(systemPalettes))
  return groups
})

const expandedColor = ref(null)

function toggleColorCard(key) {
  expandedColor.value = expandedColor.value === key ? null : key
}

function strokeColorValue(libId, mode) {
  return store.currentIconStrokeColors?.[libId]?.[mode] ?? 'currentColor'
}

function resolvedColorHex(libId, mode) {
  const val = strokeColorValue(libId, mode)
  if (val && val.startsWith('#')) return val
  return mode === 'dark' ? '#ffffff' : '#000000'
}

function primitiveRefForMode(libId, mode) {
  const hex = resolvedColorHex(libId, mode).toLowerCase()
  for (const group of palettes.value) {
    for (const shade of group.shades) {
      if (shade.color.toLowerCase() === hex) return shade.token
    }
  }
  return null
}

function updateStrokeColor(libId, mode, value) {
  store.updateIconStrokeColor(libId, mode, value)
}

// Aktive Stroke-Farbe fuer Preview-SVGs
const activeStrokeColor = computed(() => {
  const mode = store.state.previewMode === 'dark' ? 'dark' : 'light'
  return resolvedColorHex(activeLibrary.value, mode)
})
</script>

<style scoped>
.icons-editor { display: flex; flex-direction: column; gap: 24px; }

.ie-section { display: flex; flex-direction: column; gap: 10px; }

.ie-heading {
  font-size: 14px; font-weight: 700; color: var(--cfg-text); margin: 0;
  display: flex; align-items: center; gap: 8px;
}

.ie-heading__count {
  margin-left: auto; font-size: 10px; font-weight: 600;
  color: var(--cfg-text-muted); font-family: monospace;
}

/* Library List */
.ie-lib-list { display: flex; flex-direction: column; gap: 4px; }

.ie-lib-row {
  display: flex; align-items: center; gap: 0;
  border-radius: 8px;
  background: var(--cfg-surface-elevated);
  transition: border-color 0.15s, box-shadow 0.15s;
  border: 2px solid transparent;
}

.ie-lib-row--builtin {
  background: color-mix(in srgb, var(--cfg-accent) 5%, var(--cfg-surface-elevated));
}

.ie-lib-row--active {
  border-color: var(--cfg-accent);
  box-shadow: 0 0 0 1px var(--cfg-accent);
}

.ie-lib-select {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border: none; background: none;
  cursor: pointer; flex: 1; text-align: left; color: inherit;
  border-radius: 8px;
}

.ie-lib-select:hover { background: color-mix(in srgb, var(--cfg-accent) 8%, transparent); }

.ie-lib-info { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.ie-lib-name { font-size: 13px; font-weight: 600; color: var(--cfg-text); }
.ie-lib-meta { font-size: 10px; color: var(--cfg-text-muted); display: flex; align-items: center; gap: 6px; }

.ie-lib-badge {
  font-size: 9px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.5px; padding: 1px 5px; border-radius: 3px;
  background: var(--cfg-accent); color: #fff;
}

.ie-lib-badge--custom {
  background: color-mix(in srgb, var(--cfg-text) 15%, transparent);
  color: var(--cfg-text);
}

.ie-remove-btn {
  width: 24px; height: 24px; padding: 0; border: none;
  background: none; color: var(--cfg-text-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  border-radius: 4px; flex-shrink: 0; margin-right: 8px;
  transition: color 0.1s, background 0.1s;
}

.ie-remove-btn:hover { color: var(--cfg-indicator-fail); background: var(--cfg-surface); }

/* Per-Library Header */
.ie-lib-header {
  display: flex; align-items: baseline; gap: 8px;
  padding: 8px 0 0; border-top: 1px solid var(--cfg-border);
}

.ie-lib-title {
  font-size: 16px; font-weight: 800; color: var(--cfg-accent); margin: 0;
}

.ie-lib-title-count {
  font-size: 11px; color: var(--cfg-text-muted); font-weight: 500;
}

/* Token List */
.ie-token-list { display: flex; flex-direction: column; gap: 2px; }

.ie-token-row {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 10px; border-radius: 6px;
  transition: background 0.1s;
}

.ie-token-row:hover { background: var(--cfg-surface-elevated); }

.ie-token-info {
  display: flex; flex-direction: column; gap: 1px;
  width: 120px; flex-shrink: 0;
}

.ie-token-label { font-size: 12px; font-weight: 600; color: var(--cfg-text); }
.ie-token-name { font-size: 10px; color: var(--cfg-text-muted); }

.ie-token-value { margin-left: auto; flex-shrink: 0; }
.ie-token-value code {
  font-size: 11px; color: var(--cfg-text-muted);
  background: var(--cfg-surface-elevated); padding: 2px 6px; border-radius: 4px;
}

.ie-stroke-control {
  display: flex; align-items: center; gap: 10px;
  margin-left: auto; flex-shrink: 0;
}

.ie-stroke-preview {
  color: var(--cfg-text); display: flex; align-items: center;
}

.ie-value-input {
  width: 80px; height: 26px; padding: 0 6px;
  border: 1px solid var(--cfg-border); border-radius: 4px;
  background: var(--cfg-surface-elevated); color: var(--cfg-text);
  font-size: 11px; font-family: monospace; outline: none;
  text-align: right; flex-shrink: 0; margin-left: auto;
  transition: border-color 0.15s;
}

.ie-value-input:focus { border-color: var(--cfg-accent); }

.ie-value-select {
  width: 80px; height: 26px; padding: 0 4px;
  border: 1px solid var(--cfg-border); border-radius: 4px;
  background: var(--cfg-surface-elevated); color: var(--cfg-text);
  font-size: 11px; outline: none; cursor: pointer;
  transition: border-color 0.15s;
}

.ie-value-select:focus { border-color: var(--cfg-accent); }

/* ── Add Library Form ── */
.ie-add-row { margin-top: 4px; }

.ie-add-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; border: 1px dashed var(--cfg-border);
  border-radius: 6px; background: none;
  color: var(--cfg-text-muted); font-size: 12px; font-weight: 500;
  cursor: pointer; transition: border-color 0.15s, color 0.15s;
  width: 100%;
}

.ie-add-btn:hover { border-color: var(--cfg-accent); color: var(--cfg-accent); }

.ie-add-form {
  display: flex; flex-direction: column; gap: 10px;
  padding: 12px; border: 1px solid var(--cfg-border);
  border-radius: 8px; background: var(--cfg-surface-elevated);
}

.ie-add-fields { display: flex; flex-direction: column; gap: 8px; }

.ie-input {
  width: 100%; height: 30px; padding: 0 8px; box-sizing: border-box;
  border: 1px solid var(--cfg-border); border-radius: 6px;
  background: var(--cfg-surface); color: var(--cfg-text);
  font-size: 12px; outline: none;
}

.ie-input:focus { border-color: var(--cfg-accent); }

.ie-add-hint {
  display: flex; align-items: flex-start; gap: 6px;
  font-size: 10px; color: var(--cfg-text-muted); line-height: 1.4;
}

.ie-add-actions { display: flex; gap: 8px; }

.ie-btn {
  padding: 6px 14px; border-radius: 6px; font-size: 12px;
  font-weight: 600; cursor: pointer; border: none;
  transition: background 0.1s, opacity 0.1s;
}

.ie-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.ie-btn--primary { background: var(--cfg-accent); color: #fff; }
.ie-btn--primary:hover:not(:disabled) { opacity: 0.9; }
.ie-btn--ghost { background: none; color: var(--cfg-text-muted); }
.ie-btn--ghost:hover { color: var(--cfg-text); }

/* ── Description ── */
.ie-desc { font-size: 12px; color: var(--cfg-text-muted); margin: 0; line-height: 1.5; }

/* ── Color Cards (same pattern as FocusRingEditor) ── */
.ie-color-cards { display: flex; flex-direction: column; gap: 2px; }

.ie-color-card {
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  background: var(--cfg-surface);
  overflow: hidden;
  transition: border-color 0.15s;
}

.ie-color-card--active {
  border-color: var(--cfg-accent);
  box-shadow: 0 0 0 1px var(--cfg-accent);
}

.ie-color-card__header {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px; border: none; background: none;
  cursor: pointer; width: 100%; text-align: left;
  color: inherit; transition: background 0.1s;
}

.ie-color-card__header:hover { background: var(--cfg-surface-elevated); }

.ie-color-card__swatch {
  width: 28px; height: 28px; border-radius: 6px;
  border: 1px solid var(--cfg-border); flex-shrink: 0;
}

.ie-color-card__meta {
  display: flex; flex-direction: column; gap: 1px;
  min-width: 0; flex: 1;
}

.ie-color-card__label {
  font-size: 12px; font-weight: 600; color: var(--cfg-text);
  display: flex; align-items: center; gap: 5px;
}

.ie-color-card__value {
  font-size: 10px; font-family: monospace; color: var(--cfg-text-muted);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  display: flex; align-items: center; gap: 6px;
}

.ie-color-card__ref {
  color: var(--cfg-accent); font-weight: 600;
}

.ie-color-card__chevron {
  color: var(--cfg-text-muted); transition: transform 0.2s; flex-shrink: 0;
}

.ie-color-card__chevron--open { transform: rotate(180deg); }

.ie-color-card__body {
  padding: 12px; border-top: 1px solid var(--cfg-border);
  background: var(--cfg-surface-elevated);
}
</style>
