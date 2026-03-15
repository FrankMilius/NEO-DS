<template>
  <div class="spacing-inspector">

    <!-- ═══════════════════════════════════════════════════════════════
         TAB 1: Primitive Spacing Scale
         ═══════════════════════════════════════════════════════════════ -->
    <template v-if="activeTab === 'primitives'">

      <p class="si-intro">
        Spacing Scale auf Basis des 4px-Grids. Token-Nummer = Pixelwert / 4
        (z.B. <code>spacing-08</code> = 32px). Werte koennen ueberschrieben
        und neue Stufen hinzugefuegt werden.
      </p>

      <!-- Token List (sorted ascending by px) -->
      <div class="si-token-list">
        <div
          v-for="token in sortedPrimitiveTokens"
          :key="token.key"
          class="si-token-row"
          :class="{ 'si-token-row--custom': token.isCustom, 'si-token-row--modified': token.isModified }"
        >
          <div class="si-token-info">
            <span class="si-token-label">
              {{ token.label }}
              <span v-if="token.isCustom" class="si-badge si-badge--custom">custom</span>
              <span v-else-if="token.isModified" class="si-badge si-badge--modified">modified</span>
            </span>
            <code class="si-token-name">--fnd-spacing-{{ token.key }}</code>
          </div>
          <div class="si-token-bar">
            <div class="si-bar" :style="{ width: token.value }"></div>
          </div>
          <div class="si-token-controls">
            <input
              type="text"
              class="si-value-input"
              :value="token.value"
              @change="updateSpacingValue(token.key, $event.target.value, token.isCustom)"
            />
            <button
              v-if="token.isCustom"
              class="si-remove-btn"
              @click="removeToken(token.key)"
              title="Token entfernen"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Add Custom Token -->
      <div class="si-add-token">
        <button class="si-add-btn" @click="showAddDialog = !showAddDialog">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          <span>Spacing Token hinzufuegen</span>
        </button>
        <div v-if="showAddDialog" class="si-add-dialog">
          <div class="si-add-field">
            <label class="si-add-label">Pixelwert</label>
            <div class="si-add-input-row">
              <input
                type="number"
                class="si-add-input"
                v-model.number="newTokenPx"
                min="1"
                step="1"
                placeholder="z.B. 56"
              />
              <span class="si-add-suffix">px</span>
            </div>
            <span class="si-add-hint" v-if="newTokenPx > 0">
              Token: <code>--fnd-spacing-{{ computedNewKey }}</code>
              <template v-if="newTokenConflict"> — bereits vorhanden!</template>
            </span>
          </div>
          <button
            class="si-add-confirm"
            :disabled="newTokenPx <= 0 || newTokenConflict"
            @click="confirmAddToken"
          >Hinzufuegen</button>
        </div>
      </div>

    </template>

    <!-- ═══════════════════════════════════════════════════════════════
         TAB 2: Semantic Spacing — Category Cards (Overview)
         ═══════════════════════════════════════════════════════════════ -->
    <template v-else-if="activeTab === 'semantic' && !spacingCategory">

      <p class="si-intro">
        Semantische Spacing-Tokens definieren Abstands-Zwecke und referenzieren
        die Primitiv-Stufen. Waehle eine Kategorie.
      </p>

      <div class="si-category-grid">
        <!-- Layout Spacing Card -->
        <button class="si-category-card" @click="store.state.spacingCategory = 'layout'">
          <div class="si-category-card__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18"/><path d="M3 9h18"/>
            </svg>
          </div>
          <div class="si-category-card__title-row">
            <span class="si-category-card__label">Layout Spacing</span>
            <span
              :class="['si-category-card__status', `si-category-card__status--${getCategoryStatus('layout')}`]"
            >
              <svg v-if="getCategoryStatus('layout') === 'complete'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
              <svg v-else-if="getCategoryStatus('layout') === 'partial'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>
            </span>
          </div>
          <span class="si-category-card__count">{{ getLayoutMappedCount }}/{{ semanticLayoutTokens.length }} zugeordnet</span>
          <div class="si-category-card__bars">
            <div v-for="t in semanticLayoutTokens.slice(0, 4)" :key="t.id" class="si-category-card__bar-item">
              <div class="si-category-card__bar" :style="{ width: resolveBarWidth(t.id) }"></div>
            </div>
          </div>
        </button>

        <!-- Component Spacing Card -->
        <button class="si-category-card" @click="store.state.spacingCategory = 'component'">
          <div class="si-category-card__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h6v6H4z"/><path d="M14 4h6v6h-6z"/><path d="M4 14h6v6H4z"/><path d="M14 14h6v6h-6z"/>
            </svg>
          </div>
          <div class="si-category-card__title-row">
            <span class="si-category-card__label">Component Spacing</span>
            <span
              :class="['si-category-card__status', `si-category-card__status--${getCategoryStatus('component')}`]"
            >
              <svg v-if="getCategoryStatus('component') === 'complete'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
              <svg v-else-if="getCategoryStatus('component') === 'partial'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>
            </span>
          </div>
          <span class="si-category-card__count">{{ getComponentMappedCount }}/{{ semanticComponentTokens.length }} zugeordnet</span>
          <div class="si-category-card__bars">
            <div v-for="t in semanticComponentTokens.slice(0, 4)" :key="t.id" class="si-category-card__bar-item">
              <div class="si-category-card__bar" :style="{ width: resolveBarWidth(t.id) }"></div>
            </div>
          </div>
        </button>
      </div>

      <!-- Custom tokens always visible below cards -->
      <div v-if="customSemanticEntries.length > 0" class="si-custom-section">
        <h4 class="si-custom-heading">Benutzerdefiniert <span class="si-custom-count">{{ customSemanticEntries.length }}</span></h4>
        <div v-for="entry in customSemanticEntries" :key="entry.key" class="si-semantic-row">
          <div class="si-semantic-info">
            <span class="si-semantic-label">{{ entry.key }}</span>
            <code class="si-semantic-name">--fnd-spacing-{{ entry.key }}</code>
          </div>
          <select
            class="si-select"
            :value="entry.value"
            @change="store.updateSemanticSpacing(entry.key, $event.target.value)"
          >
            <option value="">— nicht gesetzt —</option>
            <option
              v-for="opt in spacingSelectOptions"
              :key="opt.var"
              :value="opt.var"
            >{{ opt.px }} · {{ opt.label }}</option>
          </select>
          <button
            class="si-remove-btn"
            @click="store.removeSemanticSpacing(entry.key)"
            title="Token entfernen"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- Add Custom Semantic Token -->
      <div class="si-add-token">
        <button class="si-add-btn" @click="showAddSemanticDialog = !showAddSemanticDialog">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          <span>Semantisches Token hinzufuegen</span>
        </button>
        <div v-if="showAddSemanticDialog" class="si-add-dialog">
          <div class="si-add-field">
            <label class="si-add-label">Token-Name (z.B. padding-card)</label>
            <input
              type="text"
              class="si-add-input si-add-input--wide"
              v-model="newSemanticName"
              placeholder="z.B. padding-card"
            />
          </div>
          <div class="si-add-field">
            <label class="si-add-label">Spacing-Referenz</label>
            <select class="si-select" v-model="newSemanticRef">
              <option value="">— waehlen —</option>
              <option
                v-for="opt in spacingSelectOptions"
                :key="opt.var"
                :value="opt.var"
              >{{ opt.px }} · {{ opt.label }}</option>
            </select>
          </div>
          <button
            class="si-add-confirm"
            :disabled="!newSemanticName || !newSemanticRef || semanticNameConflict"
            @click="confirmAddSemantic"
          >Hinzufuegen</button>
        </div>
      </div>

    </template>

    <!-- ═══════════════════════════════════════════════════════════════
         TAB 2: Semantic Spacing — Category Detail View
         ═══════════════════════════════════════════════════════════════ -->
    <template v-else-if="activeTab === 'semantic' && spacingCategory">

      <!-- Back + Title -->
      <div class="si-category-header">
        <button class="si-back-btn" @click="store.state.spacingCategory = null">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 6l-6 6l6 6"/>
          </svg>
          Kategorien
        </button>
        <h4 class="si-category-title">{{ activeCategoryLabel }}</h4>
        <span class="si-category-count">{{ activeCategoryTokens.length }} Tokens</span>
      </div>

      <!-- Token List -->
      <div class="si-semantic-detail-list">
        <div v-for="token in activeCategoryTokens" :key="token.id" class="si-semantic-row">
          <div class="si-semantic-info">
            <span class="si-semantic-label">{{ token.label }}</span>
            <code class="si-semantic-name">--fnd-spacing-{{ token.id }}</code>
            <p class="si-semantic-desc">{{ token.desc }}</p>
          </div>
          <select
            class="si-select"
            :value="getSemanticValue(token.id)"
            @change="store.updateSemanticSpacing(token.id, $event.target.value)"
          >
            <option value="">— nicht gesetzt —</option>
            <option
              v-for="opt in spacingSelectOptions"
              :key="opt.var"
              :value="opt.var"
            >{{ opt.px }} · {{ opt.label }}</option>
          </select>
        </div>
      </div>

    </template>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { foundationTokens } from '../../data/tokens.js'

const store = useThemeStore()
const activeTab = computed(() => store.state.spacingActiveTab)
const spacingCategory = computed(() => store.state.spacingCategory)

// ---------------------------------------------------------------------------
// Primitive Spacing Tokens
// ---------------------------------------------------------------------------

const defaultSpacingTokens = computed(() => {
  return foundationTokens.spacing?.tokens || {}
})

function parsePx(val) {
  const n = parseInt(val, 10)
  return isNaN(n) ? 0 : n
}

function pxToKey(px) {
  const n = Math.round(px / 4)
  return String(n).padStart(2, '0')
}

const sortedPrimitiveTokens = computed(() => {
  const tokens = []
  const overrides = store.currentFoundation.value?.spacing || {}
  const customs = store.currentCustomSpacingTokens.value || {}

  for (const [origKey, tok] of Object.entries(defaultSpacingTokens.value)) {
    const px = parsePx(tok.value)
    const gridKey = pxToKey(px)
    const overrideVal = overrides[origKey]
    const isModified = overrideVal !== undefined && overrideVal !== tok.value
    tokens.push({
      key: gridKey, origKey,
      label: `Spacing ${gridKey}`,
      value: isModified ? overrideVal : tok.value,
      defaultValue: tok.value, px,
      isCustom: false, isModified
    })
  }

  for (const [key, tok] of Object.entries(customs)) {
    const px = parsePx(tok.value)
    tokens.push({
      key, origKey: null,
      label: `Spacing ${key}`,
      value: tok.value, defaultValue: null, px,
      isCustom: true, isModified: false
    })
  }

  tokens.sort((a, b) => a.px - b.px)
  return tokens
})

function updateSpacingValue(key, value, isCustom) {
  if (isCustom) {
    store.addCustomSpacingToken(key, value)
  } else {
    const tok = sortedPrimitiveTokens.value.find(t => t.key === key)
    if (tok?.origKey) {
      store.updateFoundationToken('spacing', tok.origKey, value)
    }
  }
}

function removeToken(key) {
  store.removeCustomSpacingToken(key)
}

const showAddDialog = ref(false)
const newTokenPx = ref(0)
const computedNewKey = computed(() => pxToKey(newTokenPx.value))
const newTokenConflict = computed(() => {
  return sortedPrimitiveTokens.value.some(t => t.key === computedNewKey.value)
})

function confirmAddToken() {
  store.addCustomSpacingToken(computedNewKey.value, `${newTokenPx.value}px`)
  newTokenPx.value = 0
  showAddDialog.value = false
}

// ---------------------------------------------------------------------------
// Semantic Spacing Tokens
// ---------------------------------------------------------------------------

const semanticLayoutTokens = [
  { id: 'page-padding-inline', label: 'Page Padding (Inline)', desc: 'Horizontaler Seitenabstand links/rechts des Content-Bereichs.' },
  { id: 'page-padding-block', label: 'Page Padding (Block)', desc: 'Vertikaler Abstand oben/unten des Hauptcontents.' },
  { id: 'section-gap', label: 'Section Gap', desc: 'Abstand zwischen Sektionen (Hero, Content, Footer).' },
  { id: 'stack-gap', label: 'Stack Gap', desc: 'Vertikaler Abstand in Inhaltsgruppen (Heading + Text + Button).' },
  { id: 'inline-gap', label: 'Inline Gap', desc: 'Horizontaler Abstand zwischen nebeneinanderliegenden Elementen.' }
]

const semanticComponentTokens = [
  { id: 'card-padding', label: 'Card Padding', desc: 'Innenabstand von Karten und Panels.' },
  { id: 'input-padding-inline', label: 'Input Padding (Inline)', desc: 'Horizontaler Innenabstand in Formularfeldern.' },
  { id: 'input-padding-block', label: 'Input Padding (Block)', desc: 'Vertikaler Innenabstand in Formularfeldern.' },
  { id: 'button-padding-inline', label: 'Button Padding (Inline)', desc: 'Horizontaler Innenabstand in Buttons.' },
  { id: 'button-padding-block', label: 'Button Padding (Block)', desc: 'Vertikaler Innenabstand in Buttons.' },
  { id: 'modal-padding', label: 'Modal Padding', desc: 'Innenabstand von Modal-Dialogen.' },
  { id: 'list-gap', label: 'List Item Gap', desc: 'Abstand zwischen Listeneintraegen.' }
]

function getSemanticValue(id) {
  return store.currentSemanticSpacing.value?.[id] || ''
}

// Resolve semantic ref to px value for bar preview
function resolveBarWidth(id) {
  const ref = getSemanticValue(id)
  if (!ref) return '0px'
  const m = ref.match(/var\(--fnd-spacing-(\d+)\)/)
  if (!m) return '0px'
  const tok = sortedPrimitiveTokens.value.find(t => t.key === m[1])
  return tok ? tok.value : '0px'
}

// Category status: complete / partial / none
function getCategoryStatus(category) {
  const tokens = category === 'layout' ? semanticLayoutTokens : semanticComponentTokens
  const mapped = tokens.filter(t => !!getSemanticValue(t.id)).length
  if (mapped === tokens.length) return 'complete'
  if (mapped > 0) return 'partial'
  return 'none'
}

const getLayoutMappedCount = computed(() =>
  semanticLayoutTokens.filter(t => !!getSemanticValue(t.id)).length
)

const getComponentMappedCount = computed(() =>
  semanticComponentTokens.filter(t => !!getSemanticValue(t.id)).length
)

// Active category detail
const activeCategoryLabel = computed(() => {
  if (spacingCategory.value === 'layout') return 'Layout Spacing'
  if (spacingCategory.value === 'component') return 'Component Spacing'
  return ''
})

const activeCategoryTokens = computed(() => {
  if (spacingCategory.value === 'layout') return semanticLayoutTokens
  if (spacingCategory.value === 'component') return semanticComponentTokens
  return []
})

// Spacing select options
const spacingSelectOptions = computed(() => {
  return sortedPrimitiveTokens.value.map(t => ({
    label: `Spacing ${t.key}`,
    var: `var(--fnd-spacing-${t.key})`,
    px: t.value
  }))
})

// Custom semantic tokens
const showAddSemanticDialog = ref(false)
const newSemanticName = ref('')
const newSemanticRef = ref('')

const builtInIds = new Set([
  ...semanticLayoutTokens.map(t => t.id),
  ...semanticComponentTokens.map(t => t.id)
])

const allSemanticIds = computed(() => {
  return new Set([
    ...builtInIds,
    ...Object.keys(store.currentSemanticSpacing.value || {})
  ])
})

const semanticNameConflict = computed(() => allSemanticIds.value.has(newSemanticName.value))

function confirmAddSemantic() {
  store.addSemanticSpacingToken(newSemanticName.value, newSemanticRef.value)
  newSemanticName.value = ''
  newSemanticRef.value = ''
  showAddSemanticDialog.value = false
}

const customSemanticEntries = computed(() => {
  const semantic = store.currentSemanticSpacing.value || {}
  return Object.entries(semantic)
    .filter(([key]) => !builtInIds.has(key))
    .map(([key, value]) => ({ key, value }))
})
</script>

<style scoped>
.spacing-inspector {
  display: flex;
  flex-direction: column;
  gap: var(--fnd-spacing-04, 16px);
}

/* ═══════════════════════════════════════════════════════════════
   Intro
   ═══════════════════════════════════════════════════════════════ */

.si-intro {
  font-size: 12px;
  line-height: 1.5;
  color: var(--cfg-text-muted);
  margin: 0;
}

.si-intro code {
  font-size: 11px;
  font-family: var(--cfg-font-mono);
  padding: 1px 4px;
  border-radius: 3px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
}

/* ═══════════════════════════════════════════════════════════════
   Category Cards
   ═══════════════════════════════════════════════════════════════ */

.si-category-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.si-category-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 14px;
  border: 1px solid var(--cfg-border);
  border-radius: 10px;
  background: var(--cfg-surface);
  cursor: pointer;
  transition: border-color var(--fnd-motion-duration-150, 0.15s), box-shadow var(--fnd-motion-duration-150, 0.15s);
  text-align: left;
  color: inherit;
  width: 100%;
}

.si-category-card:hover {
  border-color: var(--cfg-accent);
  box-shadow: 0 0 0 1px var(--cfg-accent);
}

.si-category-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--cfg-surface-elevated, #f5f5f5);
  color: var(--cfg-accent);
}

.si-category-card__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
}

.si-category-card__label {
  font-size: 13px;
  font-weight: 700;
  color: var(--cfg-text);
}

.si-category-card__count {
  font-size: 11px;
  color: var(--cfg-text-muted);
}

.si-category-card__status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  color: #fff;
}

.si-category-card__status--complete { background: #16a34a; }
.si-category-card__status--partial { background: #d97706; }
.si-category-card__status--none { background: #dc2626; }

.si-category-card__bars {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
  margin-top: 2px;
}

.si-category-card__bar-item {
  height: 6px;
  width: 100%;
  background: var(--cfg-surface-elevated);
  border-radius: 2px;
  overflow: hidden;
}

.si-category-card__bar {
  height: 100%;
  background: var(--cfg-accent);
  opacity: 0.5;
  border-radius: 2px;
  transition: width 0.2s;
  max-width: 100%;
}

/* ═══════════════════════════════════════════════════════════════
   Category Header (Back + Title)
   ═══════════════════════════════════════════════════════════════ */

.si-category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.si-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px 4px 4px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface);
  color: var(--cfg-text-muted);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.1s, border-color 0.1s;
}

.si-back-btn:hover {
  color: var(--cfg-text);
  border-color: var(--cfg-text-muted);
}

.si-category-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--cfg-text);
  margin: 0;
}

.si-category-count {
  font-size: 11px;
  color: var(--cfg-text-muted);
  margin-left: auto;
}

/* ═══════════════════════════════════════════════════════════════
   Custom Semantic Section (overview)
   ═══════════════════════════════════════════════════════════════ */

.si-custom-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.si-custom-heading {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--cfg-text-muted);
  margin: 0;
}

.si-custom-count {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 4px;
  border-radius: 3px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text-muted);
  margin-left: 4px;
}

/* ═══════════════════════════════════════════════════════════════
   Semantic Detail List
   ═══════════════════════════════════════════════════════════════ */

.si-semantic-detail-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ═══════════════════════════════════════════════════════════════
   Primitive Token List
   ═══════════════════════════════════════════════════════════════ */

.si-token-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.si-token-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.1s;
}

.si-token-row:hover { background: var(--cfg-surface-elevated); }

.si-token-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 140px;
  flex-shrink: 0;
}

.si-token-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--cfg-text);
}

.si-token-name {
  font-size: 10px;
  color: var(--cfg-text-muted);
  font-family: var(--cfg-font-mono);
}

.si-badge {
  display: inline-block;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 1px 5px;
  border-radius: 3px;
  vertical-align: middle;
  margin-left: 4px;
}

.si-badge--custom {
  background: color-mix(in srgb, #8b5cf6 15%, transparent);
  color: #8b5cf6;
}

.si-badge--modified {
  background: color-mix(in srgb, var(--cfg-accent) 15%, transparent);
  color: var(--cfg-accent);
}

.si-token-bar {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

.si-bar {
  height: 10px;
  background: var(--cfg-accent);
  opacity: 0.5;
  border-radius: 2px;
  min-width: 2px;
  max-width: 100%;
  transition: width 0.2s;
}

.si-token-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.si-value-input {
  width: 60px;
  height: 26px;
  padding: 0 6px;
  border: 1px solid var(--cfg-border);
  border-radius: 4px;
  background: var(--cfg-surface);
  color: var(--cfg-text);
  font-size: 11px;
  font-family: var(--cfg-font-mono);
  text-align: center;
  outline: none;
}

.si-value-input:focus { border-color: var(--cfg-accent); }

.si-remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 1px solid var(--cfg-border);
  border-radius: 4px;
  background: var(--cfg-surface);
  color: var(--cfg-text-muted);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}

.si-remove-btn:hover {
  background: #dc2626;
  border-color: #dc2626;
  color: #fff;
}

/* ═══════════════════════════════════════════════════════════════
   Add Token Dialog
   ═══════════════════════════════════════════════════════════════ */

.si-add-token {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.si-add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px dashed var(--cfg-border);
  border-radius: 8px;
  background: transparent;
  color: var(--cfg-text-muted);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

.si-add-btn:hover {
  border-color: var(--cfg-accent);
  color: var(--cfg-accent);
}

.si-add-dialog {
  padding: 12px;
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  background: var(--cfg-surface-elevated);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.si-add-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.si-add-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--cfg-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.si-add-input-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.si-add-input {
  width: 80px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--cfg-border);
  border-radius: 4px;
  background: var(--cfg-surface);
  color: var(--cfg-text);
  font-size: 12px;
  font-family: var(--cfg-font-mono);
  outline: none;
}

.si-add-input--wide { width: 100%; }
.si-add-input:focus { border-color: var(--cfg-accent); }

.si-add-suffix {
  font-size: 12px;
  color: var(--cfg-text-muted);
  font-family: var(--cfg-font-mono);
}

.si-add-hint {
  font-size: 11px;
  color: var(--cfg-text-muted);
}

.si-add-hint code {
  font-size: 11px;
  font-family: var(--cfg-font-mono);
  background: var(--cfg-surface);
  padding: 1px 4px;
  border-radius: 3px;
}

.si-add-confirm {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background: var(--cfg-accent);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.si-add-confirm:disabled { opacity: 0.4; cursor: not-allowed; }
.si-add-confirm:hover:not(:disabled) { opacity: 0.85; }

/* ═══════════════════════════════════════════════════════════════
   Semantic Token Row
   ═══════════════════════════════════════════════════════════════ */

.si-semantic-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 6px;
  background: var(--cfg-surface-elevated);
}

.si-semantic-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.si-semantic-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--cfg-text);
}

.si-semantic-name {
  font-size: 10px;
  color: var(--cfg-text-muted);
  font-family: var(--cfg-font-mono);
}

.si-semantic-desc {
  font-size: 11px;
  color: var(--cfg-text-muted);
  margin: 2px 0 0;
  line-height: 1.4;
}

.si-select {
  width: 160px;
  flex-shrink: 0;
  height: 28px;
  padding: 0 6px;
  border: 1px solid var(--cfg-border);
  border-radius: 4px;
  background: var(--cfg-surface);
  color: var(--cfg-text);
  font-size: 11px;
  font-family: var(--cfg-font-mono);
  outline: none;
  cursor: pointer;
}

.si-select:focus { border-color: var(--cfg-accent); }
</style>
