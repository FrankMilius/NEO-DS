<template>
  <div class="typography-editor">

    <!-- ═══════════════════════════════════════════════════════════════════
         FONT FAMILIES
         ═══════════════════════════════════════════════════════════════════ -->
    <section class="token-section">
      <h3 class="sub-heading">
        Font Families
        <span v-if="isDefaultNeo" class="locked-badge" title="Font families are fixed on the default NEO Theme">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Default
        </span>
        <span v-else class="theme-name-badge">{{ currentThemeName }}</span>
      </h3>
      <p v-if="isDefaultNeo" class="sub-desc">NEO Design System default fonts — Manrope (body), Space Grotesk (headings), DM Mono (code).</p>
      <p v-else class="sub-desc">
        Override font families for this theme. Assign a role (Body, Heading, Mono) or add custom font families.
      </p>

      <!-- Default NEO: Read-only font cards -->
      <div v-if="isDefaultNeo" class="font-cards">
        <div v-for="font in defaultFonts" :key="font.id" class="font-card font-card--locked">
          <div class="font-preview" :style="{ fontFamily: font.value }">
            <span class="font-sample">Aa Bb Cc 123</span>
          </div>
          <div class="font-info">
            <span class="font-role-badge">{{ font.role }}</span>
            <span class="font-label">{{ font.label }}</span>
            <code class="font-value">{{ font.primary }}</code>
          </div>
        </div>
      </div>

      <!-- Non-default: Editable font cards -->
      <div v-else class="font-cards">
        <!-- Active theme font assignments (body, heading, mono) -->
        <div v-for="font in activeFonts" :key="font.id" class="font-card">
          <div class="font-preview" :style="{ fontFamily: font.value }">
            <span class="font-sample">Aa Bb Cc 123</span>
          </div>
          <div class="font-info">
            <span class="font-role-badge">{{ font.role }}</span>
            <div class="font-edit-row">
              <input
                type="text"
                class="font-input"
                :value="font.value"
                @change="updateFontFamily(font.tokenKey, $event.target.value)"
                :placeholder="font.placeholder"
              />
            </div>
            <code class="font-value">--fnd-{{ font.tokenKey }}</code>
          </div>
        </div>

        <!-- Custom font families for this theme -->
        <div
          v-for="font in customFonts"
          :key="font.id"
          class="font-card"
        >
          <div class="font-preview" :style="{ fontFamily: font.family }">
            <span class="font-sample">Aa Bb Cc 123</span>
          </div>
          <div class="font-info">
            <span class="font-role-badge font-role-badge--custom">Custom</span>
            <div class="font-edit-row">
              <input
                type="text"
                class="font-input font-input--name"
                :value="font.name"
                @change="updateCustomFontName(font.id, $event.target.value)"
                placeholder="Font name"
              />
              <button
                class="btn-remove"
                @click="removeCustomFont(font.id)"
                title="Remove font family"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" />
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
              </button>
            </div>
            <div class="font-edit-row">
              <input
                type="text"
                class="font-input"
                :value="font.family"
                @change="updateCustomFontFamily(font.id, $event.target.value)"
                placeholder="Font stack, e.g. Inter, sans-serif"
              />
            </div>
            <div class="font-edit-row">
              <label class="font-url-label">Google Fonts URL (optional)</label>
              <input
                type="text"
                class="font-input font-input--url"
                :value="font.url"
                @change="updateCustomFontUrl(font.id, $event.target.value)"
                placeholder="https://fonts.googleapis.com/css2?family=..."
              />
            </div>
            <code class="font-value">{{ font.family.split(',')[0].trim() }}</code>
          </div>
        </div>

        <!-- Add Font Family Card -->
        <div class="font-card add-font-card">
          <template v-if="!showAddForm">
            <button class="add-font-btn" @click="showAddForm = true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Add Font Family</span>
            </button>
          </template>
          <template v-else>
            <div class="add-form">
              <label class="add-form-label">Font Name</label>
              <input
                ref="addFontNameInput"
                type="text"
                class="font-input"
                v-model="newFontName"
                placeholder="e.g. Inter"
                @keyup.enter="addCustomFont"
                @keyup.escape="cancelAddFont"
              />
              <label class="add-form-label">Font Stack</label>
              <input
                type="text"
                class="font-input"
                v-model="newFontFamily"
                placeholder="e.g. Inter, Helvetica Neue, sans-serif"
                @keyup.enter="addCustomFont"
                @keyup.escape="cancelAddFont"
              />
              <label class="add-form-label">Google Fonts URL (optional)</label>
              <input
                type="text"
                class="font-input font-input--url"
                v-model="newFontUrl"
                placeholder="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                @keyup.enter="addCustomFont"
                @keyup.escape="cancelAddFont"
              />
              <!-- Live preview -->
              <div v-if="newFontFamily.trim()" class="add-font-preview" :style="{ fontFamily: newFontFamily }">
                <span class="font-sample">Aa Bb Cc Dd 1234</span>
              </div>
              <div class="add-form-actions">
                <button class="btn-add-confirm" @click="addCustomFont" :disabled="!newFontName.trim() || !newFontFamily.trim()">Add</button>
                <button class="btn-add-cancel" @click="cancelAddFont">Cancel</button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════
         FONT WEIGHTS
         ═══════════════════════════════════════════════════════════════════ -->
    <section class="token-section">
      <h3 class="sub-heading">Font Weights</h3>
      <div class="weight-strip">
        <div v-for="weight in weights" :key="weight.id" class="weight-chip">
          <span class="weight-preview" :style="{ fontWeight: weight.value, fontFamily: bodyFontFamily }">Ag</span>
          <span class="weight-label">{{ weight.label }}</span>
          <span class="weight-number">{{ weight.value }}</span>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════
         TYPE SCALE
         ═══════════════════════════════════════════════════════════════════ -->
    <section class="token-section">
      <h3 class="sub-heading">Type Scale</h3>
      <div class="scale-list">
        <div v-for="size in typeSizes" :key="size.name" class="scale-row">
          <span class="scale-name">{{ size.name }}</span>
          <span class="scale-sample" :style="{ fontSize: size.px + 'px', fontFamily: bodyFontFamily }">The quick brown fox</span>
          <span class="scale-value">{{ size.px }}px</span>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { foundationTokens } from '../../data/tokens.js'

const store = useThemeStore()
const typoTokens = foundationTokens.typography.tokens

// ---------------------------------------------------------------------------
// Is the user on the factory default NEO Theme?
// ---------------------------------------------------------------------------
const isDefaultNeo = computed(() => {
  return store.state.activeThemeSet === 'neo' && store.state.currentThemeMeta === null
})

const currentThemeName = computed(() => {
  if (store.state.currentThemeMeta) return store.state.currentThemeMeta.name
  return store.state.activeThemeSet === 'neo' ? 'Neo Theme' : 'Customer Theme'
})

// ---------------------------------------------------------------------------
// Default NEO fonts (read-only display)
// ---------------------------------------------------------------------------
const defaultFonts = [
  { id: 'body', role: 'Body', label: 'Manrope', primary: 'Manrope', value: typoTokens['font-body'].value },
  { id: 'heading', role: 'Heading', label: 'Space Grotesk', primary: 'Space Grotesk', value: typoTokens['font-heading'].value },
  { id: 'mono', role: 'Mono', label: 'DM Mono', primary: 'DM Mono', value: typoTokens['font-mono'].value }
]

// ---------------------------------------------------------------------------
// Active theme font families (editable for non-default)
// ---------------------------------------------------------------------------
const activeFonts = computed(() => {
  const foundation = store.currentFoundation.value
  const typo = foundation?.typography || {}
  return [
    {
      id: 'body',
      role: 'Body',
      tokenKey: 'font-body',
      value: typo['font-body'] || typoTokens['font-body'].value,
      placeholder: typoTokens['font-body'].value
    },
    {
      id: 'heading',
      role: 'Heading',
      tokenKey: 'font-heading',
      value: typo['font-heading'] || typoTokens['font-heading'].value,
      placeholder: typoTokens['font-heading'].value
    },
    {
      id: 'mono',
      role: 'Mono',
      tokenKey: 'font-mono',
      value: typo['font-mono'] || typoTokens['font-mono'].value,
      placeholder: typoTokens['font-mono'].value
    }
  ]
})

// Body font family for weight/scale preview
const bodyFontFamily = computed(() => {
  if (isDefaultNeo.value) return typoTokens['font-body'].value
  const foundation = store.currentFoundation.value
  return foundation?.typography?.['font-body'] || typoTokens['font-body'].value
})

function updateFontFamily(tokenKey, value) {
  store.updateFoundationToken('typography', tokenKey, value)
}

// ---------------------------------------------------------------------------
// Custom Font Families (store-managed, persisted via theme snapshot)
// ---------------------------------------------------------------------------
const customFonts = computed(() => store.state.customFonts[store.state.activeThemeSet])
const showAddForm = ref(false)
const newFontName = ref('')
const newFontFamily = ref('')
const newFontUrl = ref('')
const addFontNameInput = ref(null)

// Track dynamically loaded font stylesheets
const loadedStylesheets = ref(new Map())

function addCustomFont() {
  const name = newFontName.value.trim()
  const family = newFontFamily.value.trim()
  if (!name || !family) return
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36)
  store.state.customFonts[store.state.activeThemeSet].push({
    id,
    name,
    family,
    url: newFontUrl.value.trim()
  })
  // Load the Google Font if URL provided
  if (newFontUrl.value.trim()) {
    loadGoogleFont(id, newFontUrl.value.trim())
  }
  cancelAddFont()
}

function removeCustomFont(id) {
  const themeSet = store.state.activeThemeSet
  store.state.customFonts[themeSet] = store.state.customFonts[themeSet].filter(f => f.id !== id)
  unloadGoogleFont(id)
}

function updateCustomFontName(id, value) {
  const font = customFonts.value.find(f => f.id === id)
  if (font) {
    font.name = value
  }
}

function updateCustomFontFamily(id, value) {
  const font = customFonts.value.find(f => f.id === id)
  if (font) {
    font.family = value
  }
}

function updateCustomFontUrl(id, value) {
  const font = customFonts.value.find(f => f.id === id)
  if (font) {
    font.url = value
    if (value.trim()) {
      loadGoogleFont(id, value.trim())
    } else {
      unloadGoogleFont(id)
    }
  }
}

function cancelAddFont() {
  showAddForm.value = false
  newFontName.value = ''
  newFontFamily.value = ''
  newFontUrl.value = ''
}

watch(showAddForm, (v) => {
  if (v) nextTick(() => addFontNameInput.value?.focus())
})

// Reload font stylesheets when theme or customFonts change
watch(customFonts, (newFonts, oldFonts) => {
  // Unload stylesheets for fonts no longer present
  const newIds = new Set((newFonts || []).map(f => f.id))
  loadedStylesheets.value.forEach((_, id) => {
    if (!newIds.has(id)) unloadGoogleFont(id)
  })
  // Load stylesheets for new fonts
  ;(newFonts || []).forEach(f => {
    if (f.url && !loadedStylesheets.value.has(f.id)) {
      loadGoogleFont(f.id, f.url)
    }
  })
}, { deep: true })

// ---------------------------------------------------------------------------
// Dynamic Google Font Loading
// ---------------------------------------------------------------------------
function loadGoogleFont(id, url) {
  // Remove existing if any
  unloadGoogleFont(id)
  // Only load URLs from Google Fonts
  if (!url.includes('fonts.googleapis.com')) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  link.dataset.customFontId = id
  document.head.appendChild(link)
  loadedStylesheets.value.set(id, link)
}

function unloadGoogleFont(id) {
  const link = loadedStylesheets.value.get(id)
  if (link) {
    link.remove()
    loadedStylesheets.value.delete(id)
  }
}

// Load custom font stylesheets on mount
onMounted(() => {
  customFonts.value.forEach(f => {
    if (f.url) loadGoogleFont(f.id, f.url)
  })
})

// Cleanup on unmount
onUnmounted(() => {
  loadedStylesheets.value.forEach((_, id) => unloadGoogleFont(id))
})

// ---------------------------------------------------------------------------
// Font Weights & Type Scale (shared between default and custom themes)
// ---------------------------------------------------------------------------
const weights = [
  { id: 'light', label: 'Light', value: 300 },
  { id: 'regular', label: 'Regular', value: 400 },
  { id: 'medium', label: 'Medium', value: 500 },
  { id: 'semibold', label: 'Semibold', value: 600 },
  { id: 'bold', label: 'Bold', value: 700 },
  { id: 'black', label: 'Black', value: 900 }
]

const typeSizes = [
  { name: 'xs', px: 10 }, { name: 'sm', px: 12 }, { name: 'base', px: 14 },
  { name: 'lg', px: 17 }, { name: 'xl', px: 20 }, { name: '2xl', px: 24 },
  { name: '3xl', px: 29 }, { name: '4xl', px: 35 }, { name: '5xl', px: 42 }
]
</script>

<style scoped>
.typography-editor { display: flex; flex-direction: column; gap: 32px; }
.token-section { display: flex; flex-direction: column; gap: 16px; }

.sub-heading {
  font-size: 15px;
  font-weight: 700;
  color: var(--cfg-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sub-desc {
  font-size: 12px;
  color: var(--cfg-text-muted);
  margin: 0;
}

.locked-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  font-size: 10px;
  font-weight: 600;
  color: var(--cfg-text-muted);
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--cfg-surface-elevated);
  border: 1px solid var(--cfg-border);
}

.theme-name-badge {
  font-size: 10px;
  font-weight: 600;
  color: var(--cfg-accent);
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--cfg-accent-subtle);
  margin-left: auto;
}

/* ═══════════════════════════════════════════════════════════════════
   FONT CARDS
   ═══════════════════════════════════════════════════════════════════ */
.font-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.font-card {
  border: 1px solid var(--cfg-border);
  border-radius: 10px;
  overflow: hidden;
  background: var(--cfg-surface);
  display: flex;
  flex-direction: column;
}

.font-card--locked {
  opacity: 0.9;
  position: relative;
}

.font-card--locked::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  pointer-events: none;
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 8px,
    rgba(128, 128, 128, 0.03) 8px,
    rgba(128, 128, 128, 0.03) 16px
  );
}

.font-preview {
  padding: 20px;
  background: var(--cfg-surface-elevated);
  text-align: center;
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.font-sample {
  font-size: 24px;
  color: var(--cfg-text);
}

.font-info {
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.font-role-badge {
  display: inline-flex;
  align-self: flex-start;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 6px;
  border-radius: 3px;
  background: #dbeafe;
  color: #1d4ed8;
}

.font-role-badge--custom {
  background: #fef3c7;
  color: #d97706;
}

.font-label { font-size: 13px; font-weight: 600; color: var(--cfg-text); }
.font-value { font-size: 10px; color: var(--cfg-text-muted); }

.font-edit-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.font-input {
  flex: 1;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--cfg-border);
  border-radius: 4px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font-size: 12px;
  font-family: monospace;
  outline: none;
  transition: border-color 0.15s;
}

.font-input:focus {
  border-color: var(--cfg-accent);
}

.font-input--name {
  font-family: inherit;
  font-weight: 600;
}

.font-input--url {
  font-size: 10px;
}

.font-url-label {
  font-size: 9px;
  font-weight: 600;
  color: var(--cfg-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

/* ═══════════════════════════════════════════════════════════════════
   ADD FONT CARD
   ═══════════════════════════════════════════════════════════════════ */
.add-font-card {
  border-style: dashed;
  min-height: 140px;
  justify-content: center;
  align-items: center;
}

.add-font-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: none;
  background: var(--cfg-surface);
  color: var(--cfg-text-muted);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.15s ease;
  width: 100%;
}

.add-font-btn:hover {
  color: var(--cfg-accent);
  background: var(--cfg-accent-subtle);
}

.add-font-btn span {
  font-size: 12px;
  font-weight: 600;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  width: 100%;
}

.add-form-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--cfg-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.add-font-preview {
  padding: 12px;
  background: var(--cfg-surface-elevated);
  border-radius: 6px;
  text-align: center;
}

.add-form-actions {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.btn-add-confirm {
  flex: 1;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: var(--cfg-accent);
  color: #000;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-add-confirm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-add-confirm:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-add-cancel {
  flex: 1;
  height: 28px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface);
  color: var(--cfg-text-muted);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-add-cancel:hover {
  border-color: var(--cfg-text-muted);
  color: var(--cfg-text);
}

.btn-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--cfg-text-muted);
  cursor: pointer;
  transition: all 0.12s;
  flex-shrink: 0;
}

.btn-remove:hover {
  color: #fa4d56;
  background: rgba(250, 77, 86, 0.08);
  border-color: rgba(250, 77, 86, 0.2);
}

/* ═══════════════════════════════════════════════════════════════════
   WEIGHTS & TYPE SCALE
   ═══════════════════════════════════════════════════════════════════ */
.weight-strip {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.weight-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  background: var(--cfg-surface);
  min-width: 70px;
}

.weight-preview { font-size: 24px; color: var(--cfg-text); }
.weight-label { font-size: 10px; font-weight: 500; color: var(--cfg-text-muted); }
.weight-number { font-size: 10px; font-family: monospace; color: var(--cfg-text-muted); }

.scale-list { display: flex; flex-direction: column; gap: 2px; }

.scale-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 12px;
  border-radius: 6px;
}

.scale-row:hover { background: var(--cfg-surface-elevated); }

.scale-name {
  width: 40px;
  font-size: 10px;
  font-weight: 600;
  color: var(--cfg-text-muted);
  text-transform: uppercase;
}

.scale-sample {
  flex: 1;
  color: var(--cfg-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scale-value {
  font-size: 11px;
  font-family: monospace;
  color: var(--cfg-text-muted);
}
</style>
