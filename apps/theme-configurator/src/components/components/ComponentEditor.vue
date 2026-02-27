<template>
  <div class="component-editor">
    <section class="token-section">
      <h3 class="sub-heading">
        <span class="tier-badge tier-3">L3</span>
        {{ componentData?.label || componentId }} Tokens
      </h3>
      <p class="sub-desc">Component-level tokens reference semantic (L2) tokens. Override here for theme-specific customization.</p>

      <!-- ═══ Varianten-Accordion (wenn subgroups vorhanden) ═══ -->
      <template v-if="hasSubgroups">
        <template v-for="catGroup in categoryGroups" :key="catGroup.category">
          <div v-if="catGroup.category !== 'general'" class="ce-category-divider">
            <span class="ce-category-label">{{ categoryLabel(catGroup.category) }}</span>
          </div>

          <div v-for="sg in catGroup.subgroups" :key="sg.id" class="ce-subgroup">
            <div class="ce-subgroup-header" @click="toggleSubgroup(sg.id)">
              <svg class="ce-subgroup-chevron" :class="{ open: expandedSubgroups.has(sg.id) }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              <span class="ce-subgroup-label">{{ sg.label }}</span>
              <!-- Mini-Swatch-Strip fuer Farbvarianten -->
              <div v-if="sg.swatches.length" class="ce-subgroup-swatches">
                <span
                  v-for="(sw, i) in sg.swatches"
                  :key="i"
                  class="ce-swatch-dot"
                  :style="{ background: sw }"
                  :title="['bg', 'color', 'border'][i]"
                ></span>
              </div>
              <span class="ce-subgroup-count">{{ sg.tokens.length }}</span>
            </div>

            <div v-if="expandedSubgroups.has(sg.id)" class="ce-subgroup-body">
              <template v-for="token in sg.tokens" :key="token.id">
                <div
                  :class="['token-row', { selected: selectedId === token.id, readonly: token.readonly }]"
                  @click="selectToken(token)"
                  :title="token.readonly ? 'Dieses Token ist schreibgeschützt — es folgt dem semantischen Token.' : ''"
                >
                  <div class="token-left">
                    <div v-if="token.type === 'color'" class="token-swatch" :style="{ background: getTokenValue(token) }"></div>
                    <div v-else-if="token.type === 'size'" class="token-size-indicator">
                      <div class="size-bar" :style="{ width: Math.min(parseFloat(getTokenValue(token)), 60) + 'px' }"></div>
                    </div>
                    <div v-else class="token-generic-indicator">
                      <span class="indicator-text">{{ token.type }}</span>
                    </div>
                  </div>
                  <div class="token-info">
                    <span class="token-label">
                      {{ token.label }}
                      <svg v-if="token.readonly" class="lock-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                    <code class="token-name">--{{ token.id }}</code>
                  </div>
                  <div class="token-value-wrap">
                    <code class="token-value">{{ getTokenValue(token) }}</code>
                    <span v-if="token.ref" class="ref-badge" :title="`References --fnd-color-${token.ref}`">ref: {{ token.ref }}</span>
                    <span v-if="isOverridden(token)" class="override-badge">modified</span>
                  </div>
                </div>
                <!-- Inline Editor (Accordion) -->
                <transition name="slide">
                  <div v-if="selectedId === token.id && !token.readonly" class="inline-editor">
                    <ColorEditor v-if="token.type === 'color'"
                      :modelValue="getTokenValue(token)"
                      @update:modelValue="updateToken(token, $event)"
                      :title="token.label" :tokenId="token.id"
                      :tokenPalettes="palettes"
                      :contrastTarget="getContrastTarget(token)" />
                    <SizeEditor v-else-if="token.type === 'size'"
                      :modelValue="getTokenValue(token)"
                      @update:modelValue="updateToken(token, $event)"
                      :title="token.label" :tokenId="token.id" :max="200" />
                    <div v-else class="generic-editor">
                      <h3 class="editor-title">{{ token.label }}</h3>
                      <input type="text" class="generic-input" :value="getTokenValue(token)" @change="updateToken(token, $event.target.value)" />
                    </div>
                  </div>
                </transition>
                <transition name="slide">
                  <div v-if="selectedId === token.id && token.readonly" class="readonly-notice">
                    <svg class="readonly-notice-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <div>
                      <strong>Schreibgeschützt</strong>
                      <p>Dieses Token referenziert <code>--fnd-color-{{ token.ref }}</code> und wird über die semantische Ebene (L2) gesteuert.</p>
                    </div>
                  </div>
                </transition>
              </template>
            </div>
          </div>
        </template>
      </template>

      <!-- ═══ Flat-List Fallback (keine subgroups) ═══ -->
      <div v-else class="token-list">
        <template v-for="token in tokens" :key="token.id">
          <div
            :class="['token-row', { selected: selectedId === token.id, readonly: token.readonly }]"
            @click="selectToken(token)"
            :title="token.readonly ? 'Dieses Token ist schreibgeschützt — es folgt dem semantischen Token.' : ''"
          >
            <div class="token-left">
              <div
                v-if="token.type === 'color'"
                class="token-swatch"
                :style="{ background: getTokenValue(token) }"
              ></div>
              <div v-else-if="token.type === 'size'" class="token-size-indicator">
                <div class="size-bar" :style="{ width: Math.min(parseFloat(getTokenValue(token)), 60) + 'px' }"></div>
              </div>
              <div v-else class="token-generic-indicator">
                <span class="indicator-text">{{ token.type }}</span>
              </div>
            </div>

            <div class="token-info">
              <span class="token-label">
                {{ token.label }}
                <svg v-if="token.readonly" class="lock-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <code class="token-name">--{{ token.id }}</code>
            </div>

            <div class="token-value-wrap">
              <code class="token-value">{{ getTokenValue(token) }}</code>
              <span v-if="token.ref" class="ref-badge" :title="`References --fnd-color-${token.ref}`">
                ref: {{ token.ref }}
              </span>
              <span v-if="isOverridden(token)" class="override-badge">modified</span>
            </div>
          </div>
          <!-- Inline Editor (Flat-List) -->
          <transition name="slide">
            <div v-if="selectedId === token.id && !token.readonly" class="inline-editor">
              <ColorEditor v-if="token.type === 'color'"
                :modelValue="getTokenValue(token)"
                @update:modelValue="updateToken(token, $event)"
                :title="token.label" :tokenId="token.id"
                :tokenPalettes="palettes" />
              <SizeEditor v-else-if="token.type === 'size'"
                :modelValue="getTokenValue(token)"
                @update:modelValue="updateToken(token, $event)"
                :title="token.label" :tokenId="token.id" :max="200" />
              <div v-else class="generic-editor">
                <h3 class="editor-title">{{ token.label }}</h3>
                <input type="text" class="generic-input" :value="getTokenValue(token)" @change="updateToken(token, $event.target.value)" />
              </div>
            </div>
          </transition>
          <transition name="slide">
            <div v-if="selectedId === token.id && token.readonly" class="readonly-notice">
              <svg class="readonly-notice-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <div>
                <strong>Schreibgeschützt</strong>
                <p>Dieses Token referenziert <code>--fnd-color-{{ token.ref }}</code> und wird über die semantische Ebene (L2) gesteuert.</p>
              </div>
            </div>
          </transition>
        </template>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { componentTokenGroups, primitiveColors, supportingPalettes, foundationPalettes, neutralPalette, systemPalettes } from '../../data/tokens.js'
import ColorEditor from '../editors/ColorEditor.vue'
import SizeEditor from '../editors/SizeEditor.vue'

const props = defineProps({
  componentId: { type: String, required: true }
})

const store = useThemeStore()
const selectedToken = ref(null)
const selectedId = computed(() => selectedToken.value?.id || null)

const componentData = computed(() => {
  return componentTokenGroups.find(c => c.id === props.componentId) || null
})

const tokens = computed(() => {
  return componentData.value?.tokens || []
})

// ---------------------------------------------------------------------------
// Varianten-Accordion (subgroups)
// ---------------------------------------------------------------------------
const hasSubgroups = computed(() => componentData.value?.subgroups?.length > 0)

const subgroups = computed(() => {
  if (!hasSubgroups.value) return []
  const tokenMap = new Map(componentData.value.tokens.map(t => [t.id, t]))
  return componentData.value.subgroups.map(sg => {
    const sgTokens = sg.tokenIds.map(id => tokenMap.get(id)).filter(Boolean)
    // Mini-Swatch: zeige bg, color, border Punkte (erste passende Tokens)
    const swatches = []
    if (sg.category) {
      const bgToken = sgTokens.find(t => t.type === 'color' && t.id.endsWith('-bg'))
      const colorToken = sgTokens.find(t => t.type === 'color' && t.id.endsWith('-color'))
      const borderToken = sgTokens.find(t => t.type === 'color' && t.id.endsWith('-border'))
      if (bgToken) swatches.push(getTokenValue(bgToken))
      if (colorToken) swatches.push(getTokenValue(colorToken))
      if (borderToken) {
        const v = getTokenValue(borderToken)
        if (v !== 'transparent') swatches.push(v)
      }
    }
    return { ...sg, tokens: sgTokens, swatches }
  })
})

const categoryGroups = computed(() => {
  const groups = []
  let lastCat = null
  for (const sg of subgroups.value) {
    const cat = sg.category || 'general'
    if (cat !== lastCat) { groups.push({ category: cat, subgroups: [] }); lastCat = cat }
    groups[groups.length - 1].subgroups.push(sg)
  }
  return groups
})

const CATEGORY_LABELS = {
  general: '',
  main: 'Main Variants',
  supporting: 'Supporting',
  system: 'System',
  state: 'States',
  patterns: 'Patterns'
}

function categoryLabel(cat) { return CATEGORY_LABELS[cat] || cat }

const expandedSubgroups = ref(new Set())

function toggleSubgroup(id) {
  const s = new Set(expandedSubgroups.value)
  s.has(id) ? s.delete(id) : s.add(id)
  expandedSubgroups.value = s
}

function getTokenValue(token) {
  // Check for override first
  const override = store.currentComponentOverrides.value[token.id]
  if (override !== undefined) return override

  // If it references a semantic token, resolve it
  if (token.ref) {
    return store.currentSemanticTokens.value[token.ref] || token.default || ''
  }

  return token.default || ''
}

function isOverridden(token) {
  return store.currentComponentOverrides.value[token.id] !== undefined
}

function selectToken(token) {
  selectedToken.value = selectedToken.value?.id === token.id ? null : token
}

function updateToken(token, value) {
  store.updateComponentToken(token.id, value)
}

// ---------------------------------------------------------------------------
// Token-Palette im primitive-picker Format (wie FoundationColors)
// ---------------------------------------------------------------------------
function palettesToPicker(obj) {
  return Object.entries(obj).map(([id, pal]) => ({
    id,
    label: pal.label,
    shades: Object.entries(pal.shades).map(([step, color]) => ({
      step, color, token: `--fnd-primitive-${id}-${step}`
    }))
  }))
}

const palettes = computed(() => {
  const groups = []

  // Brand (Primary, Secondary, Accent)
  for (const [id, pal] of Object.entries(primitiveColors)) {
    groups.push({
      id,
      label: pal.label,
      shades: Object.entries(pal.shades).map(([step, color]) => ({
        step, color, token: `--fnd-primitive-${id}-${step}`
      }))
    })
  }

  // Supporting
  groups.push(...palettesToPicker(supportingPalettes))

  // Neutral
  for (const [id, pal] of Object.entries(neutralPalette)) {
    groups.push({
      id,
      label: pal.label,
      shades: Object.entries(pal.shades).map(([step, color]) => ({
        step, color, token: `--fnd-primitive-neutral-${step}`
      }))
    })
  }

  // Foundation (Black / White)
  groups.push(...palettesToPicker(foundationPalettes))

  // System
  groups.push(...palettesToPicker(systemPalettes))

  return groups
})

// ---------------------------------------------------------------------------
// WCAG Kontrast Auto-Detect: bg↔color innerhalb der Subgroup
// ---------------------------------------------------------------------------
function getContrastTarget(token) {
  if (token.type !== 'color') return ''
  const tokenId = token.id

  // Finde die Subgroup, in der das Token liegt
  const sg = subgroups.value.find(s => s.tokens.some(t => t.id === tokenId))
  const siblings = sg ? sg.tokens : tokens.value

  if (tokenId.endsWith('-bg') || tokenId.endsWith('-background')) {
    // bg → Kontrast gegen -color desselben Subgroups
    const colorToken = siblings.find(t =>
      t.type === 'color' && (t.id.endsWith('-color') || t.id.endsWith('-text'))
    )
    return colorToken ? getTokenValue(colorToken) : ''
  }

  if (tokenId.endsWith('-color') || tokenId.endsWith('-text')) {
    // color → Kontrast gegen -bg desselben Subgroups
    const bgToken = siblings.find(t =>
      t.type === 'color' && (t.id.endsWith('-bg') || t.id.endsWith('-background'))
    )
    return bgToken ? getTokenValue(bgToken) : ''
  }

  return ''
}
</script>

<style scoped>
.component-editor { display: flex; flex-direction: column; gap: 24px; }
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

.sub-desc { font-size: 12px; color: var(--cfg-text-muted); margin: 0; }

.tier-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.tier-3 { background: #fef3c7; color: #d97706; }

.token-list { display: flex; flex-direction: column; gap: 2px; }

.token-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.1s;
  border: 1px solid transparent;
}

.token-row:hover { background: var(--cfg-surface-elevated); }

.token-row.selected {
  border-color: var(--cfg-accent);
  background: var(--cfg-accent-subtle);
}

/* Readonly token row */
.token-row.readonly {
  opacity: 0.65;
  cursor: default;
}

.token-row.readonly:hover {
  opacity: 0.8;
}

.token-row.readonly.selected {
  border-color: var(--cfg-border);
  background: var(--cfg-surface-elevated);
}

.lock-icon {
  vertical-align: middle;
  margin-left: 3px;
  color: var(--cfg-text-muted);
}

.token-left { flex-shrink: 0; width: 36px; }

.token-swatch {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--cfg-border);
}

.token-size-indicator {
  height: 28px;
  display: flex;
  align-items: center;
}

.size-bar {
  height: 8px;
  background: var(--cfg-accent);
  opacity: 0.5;
  border-radius: 2px;
  min-width: 4px;
}

.token-generic-indicator {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--cfg-surface-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
}

.indicator-text { font-size: 8px; color: var(--cfg-text-muted); text-transform: uppercase; }

.token-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.token-label { font-size: 12px; font-weight: 600; color: var(--cfg-text); }
.token-name { font-size: 10px; color: var(--cfg-text-muted); }

.token-value-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.token-value {
  font-size: 11px;
  color: var(--cfg-text-muted);
  background: var(--cfg-surface-elevated);
  padding: 2px 6px;
  border-radius: 4px;
}

.ref-badge {
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 3px;
  background: #dbeafe;
  color: #1d4ed8;
}

.override-badge {
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 3px;
  background: #fef3c7;
  color: #d97706;
  font-weight: 600;
}

.inline-editor {
  padding: 16px;
  background: var(--cfg-surface);
  border: 1px solid var(--cfg-border);
  border-radius: 12px;
}

.readonly-notice {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  background: var(--cfg-surface-elevated);
  border: 1px solid var(--cfg-border);
  border-radius: 12px;
  font-size: 12px;
  color: var(--cfg-text-muted);
}

.readonly-notice strong {
  display: block;
  font-size: 12px;
  color: var(--cfg-text);
  margin-bottom: 2px;
}

.readonly-notice p {
  margin: 0;
  line-height: 1.4;
}

.readonly-notice code {
  font-size: 10px;
  background: var(--cfg-surface);
  padding: 1px 4px;
  border-radius: 3px;
}

.readonly-notice-icon {
  flex-shrink: 0;
  margin-top: 1px;
}

.generic-editor { display: flex; flex-direction: column; gap: 8px; }
.editor-title { font-size: 14px; font-weight: 600; color: var(--cfg-text); margin: 0; }

.generic-input {
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font-size: 12px;
  font-family: monospace;
}

/* Varianten-Accordion */
.ce-category-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0 6px;
}

.ce-category-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--cfg-border);
}

.ce-category-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cfg-text-muted);
  white-space: nowrap;
}

.ce-subgroup {
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  margin-bottom: 4px;
  overflow: hidden;
}

.ce-subgroup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.1s;
}

.ce-subgroup-header:hover { background: var(--cfg-surface-elevated); }

.ce-subgroup-chevron {
  flex-shrink: 0;
  transition: transform 0.15s ease;
  color: var(--cfg-text-muted);
}

.ce-subgroup-chevron.open { transform: rotate(90deg); }

.ce-subgroup-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--cfg-text);
  flex: 1;
}

.ce-subgroup-swatches {
  display: flex;
  gap: 3px;
  align-items: center;
}

.ce-swatch-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--cfg-border);
}

.ce-subgroup-count {
  font-size: 10px;
  color: var(--cfg-text-muted);
  background: var(--cfg-surface-elevated);
  padding: 1px 5px;
  border-radius: 4px;
  font-variant-numeric: tabular-nums;
}

.ce-subgroup-body {
  border-top: 1px solid var(--cfg-border);
  padding: 4px;
}

.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(10px); }
</style>
