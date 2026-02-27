<template>
  <div class="component-arena" v-if="componentData">

    <!-- Header -->
    <div class="arena-header">
      <h4 class="arena-title">{{ componentData.label }} Arena</h4>
      <span class="arena-mode-labels">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/></svg>
        Light
        <span style="margin: 0 4px; opacity: .35">|</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9z"/></svg>
        Dark
      </span>
    </div>

    <!-- variants-matrix Renderer -->
    <template v-if="arenaConfig && arenaConfig.type === 'variants-matrix'">

      <!-- Pro Category -->
      <template v-for="cat in variantCategories" :key="cat.id">
        <div class="arena-category-divider">
          <span class="arena-category-label">{{ cat.label }}</span>
        </div>

        <!-- Pro Variant -->
        <div
          v-for="variant in cat.variants"
          :key="variant.id"
          :class="['arena-specimen', { 'arena-specimen--pulse': pulsingVariants.has(variant.id) }]"
        >
          <span class="arena-specimen__label">{{ variant.label }}</span>
          <div class="arena-specimen__pair">
            <!-- Light Panel -->
            <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
              <div class="arena-btn-row">
                <button
                  v-for="size in arenaConfig.sizes"
                  :key="size"
                  class="arena-btn"
                  :style="buildStyle(tokensLight, variant.id, size)"
                >{{ variant.label }} {{ size.toUpperCase() }}</button>
              </div>
            </div>
            <!-- Dark Panel -->
            <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
              <div class="arena-btn-row">
                <button
                  v-for="size in arenaConfig.sizes"
                  :key="size"
                  class="arena-btn"
                  :style="buildStyle(tokensDark, variant.id, size)"
                >{{ variant.label }} {{ size.toUpperCase() }}</button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- States Section -->
      <div class="arena-category-divider">
        <span class="arena-category-label">States</span>
      </div>
      <div class="arena-specimen">
        <span class="arena-specimen__label">Primary — States</span>
        <div class="arena-specimen__pair">
          <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
            <div class="arena-btn-row">
              <button class="arena-btn" :style="buildStyle(tokensLight, 'primary', 'md')">Default</button>
              <button class="arena-btn" :style="hoverStyle(tokensLight, 'primary', 'md')">Hover</button>
              <button class="arena-btn" :style="activeStyle(tokensLight, 'primary', 'md')">Active</button>
              <button class="arena-btn arena-btn--disabled" :style="disabledStyle(tokensLight)">Disabled</button>
            </div>
          </div>
          <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
            <div class="arena-btn-row">
              <button class="arena-btn" :style="buildStyle(tokensDark, 'primary', 'md')">Default</button>
              <button class="arena-btn" :style="hoverStyle(tokensDark, 'primary', 'md')">Hover</button>
              <button class="arena-btn" :style="activeStyle(tokensDark, 'primary', 'md')">Active</button>
              <button class="arena-btn arena-btn--disabled" :style="disabledStyle(tokensDark)">Disabled</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- Patterns Section — 6 Specimens                                -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <template v-if="specimens.length">
        <div class="arena-category-divider">
          <span class="arena-category-label">Patterns</span>
        </div>

        <!-- With Icon -->
        <div :class="['arena-specimen', { 'arena-specimen--pulse': pulsingVariants.has('with-icon') }]">
          <span class="arena-specimen__label">With Icon</span>
          <div class="arena-specimen__pair">
            <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
              <div class="arena-btn-row">
                <button
                  v-for="size in arenaConfig.sizes" :key="size"
                  class="arena-btn"
                  :style="{ ...buildStyle(tokensLight, 'primary', size), gap: tokensLight['nc-button-gap'] || '8px' }"
                ><svg class="arena-btn__icon" :style="{ width: iconSize(size), height: iconSize(size) }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>Label</button>
              </div>
            </div>
            <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
              <div class="arena-btn-row">
                <button
                  v-for="size in arenaConfig.sizes" :key="size"
                  class="arena-btn"
                  :style="{ ...buildStyle(tokensDark, 'primary', size), gap: tokensDark['nc-button-gap'] || '8px' }"
                ><svg class="arena-btn__icon" :style="{ width: iconSize(size), height: iconSize(size) }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>Label</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Icon Only -->
        <div :class="['arena-specimen', { 'arena-specimen--pulse': pulsingVariants.has('icon-only') }]">
          <span class="arena-specimen__label">Icon Only</span>
          <div class="arena-specimen__pair">
            <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
              <div class="arena-btn-row">
                <template v-for="vid in ['primary', 'secondary', 'ghost']" :key="vid">
                  <button
                    v-for="size in arenaConfig.sizes" :key="size"
                    class="arena-btn"
                    :style="iconOnlyStyle(tokensLight, vid, size)"
                  ><svg class="arena-btn__icon" :style="{ width: iconSize(size), height: iconSize(size) }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
                </template>
              </div>
            </div>
            <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
              <div class="arena-btn-row">
                <template v-for="vid in ['primary', 'secondary', 'ghost']" :key="vid">
                  <button
                    v-for="size in arenaConfig.sizes" :key="size"
                    class="arena-btn"
                    :style="iconOnlyStyle(tokensDark, vid, size)"
                  ><svg class="arena-btn__icon" :style="{ width: iconSize(size), height: iconSize(size) }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div :class="['arena-specimen', { 'arena-specimen--pulse': pulsingVariants.has('loading') }]">
          <span class="arena-specimen__label">Loading</span>
          <div class="arena-specimen__pair">
            <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
              <div class="arena-btn-row">
                <button
                  v-for="vid in ['primary', 'secondary']" :key="vid"
                  class="arena-btn"
                  :style="loadingStyle(tokensLight, vid, 'md')"
                ><span style="opacity: 0">Loading</span><span class="arena-btn__spinner" :style="spinnerStyle(tokensLight, vid)"></span></button>
              </div>
            </div>
            <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
              <div class="arena-btn-row">
                <button
                  v-for="vid in ['primary', 'secondary']" :key="vid"
                  class="arena-btn"
                  :style="loadingStyle(tokensDark, vid, 'md')"
                ><span style="opacity: 0">Loading</span><span class="arena-btn__spinner" :style="spinnerStyle(tokensDark, vid)"></span></button>
              </div>
            </div>
          </div>
        </div>

        <!-- Button Group -->
        <div :class="['arena-specimen', { 'arena-specimen--pulse': pulsingVariants.has('group') }]">
          <span class="arena-specimen__label">Button Group</span>
          <div class="arena-specimen__pair">
            <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
              <div class="arena-btn-group">
                <button class="arena-btn" :style="groupBtnStyle(tokensLight, 'outline', 'md', 'first')">Left</button>
                <button class="arena-btn" :style="groupBtnStyle(tokensLight, 'outline', 'md', 'middle')">Center</button>
                <button class="arena-btn" :style="groupBtnStyle(tokensLight, 'outline', 'md', 'last')">Right</button>
              </div>
            </div>
            <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
              <div class="arena-btn-group">
                <button class="arena-btn" :style="groupBtnStyle(tokensDark, 'outline', 'md', 'first')">Left</button>
                <button class="arena-btn" :style="groupBtnStyle(tokensDark, 'outline', 'md', 'middle')">Center</button>
                <button class="arena-btn" :style="groupBtnStyle(tokensDark, 'outline', 'md', 'last')">Right</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Toggle -->
        <div :class="['arena-specimen', { 'arena-specimen--pulse': pulsingVariants.has('toggle') }]">
          <span class="arena-specimen__label">Toggle</span>
          <div class="arena-specimen__pair">
            <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
              <div class="arena-btn-row">
                <button class="arena-btn" :style="buildStyle(tokensLight, 'outline', 'md')" aria-pressed="false">Unpressed</button>
                <button class="arena-btn" :style="togglePressedStyle(tokensLight, 'md')" aria-pressed="true">Pressed</button>
              </div>
            </div>
            <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
              <div class="arena-btn-row">
                <button class="arena-btn" :style="buildStyle(tokensDark, 'outline', 'md')" aria-pressed="false">Unpressed</button>
                <button class="arena-btn" :style="togglePressedStyle(tokensDark, 'md')" aria-pressed="true">Pressed</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Link as Button -->
        <div :class="['arena-specimen', { 'arena-specimen--pulse': pulsingVariants.has('link') }]">
          <span class="arena-specimen__label">Link as Button</span>
          <div class="arena-specimen__pair">
            <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
              <div class="arena-btn-row">
                <a v-for="vid in ['primary', 'secondary', 'ghost']" :key="vid"
                   class="arena-btn"
                   :style="{ ...buildStyle(tokensLight, vid, 'md'), textDecoration: 'none' }"
                >{{ vid.charAt(0).toUpperCase() + vid.slice(1) }} Link</a>
              </div>
            </div>
            <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
              <div class="arena-btn-row">
                <a v-for="vid in ['primary', 'secondary', 'ghost']" :key="vid"
                   class="arena-btn"
                   :style="{ ...buildStyle(tokensDark, vid, 'md'), textDecoration: 'none' }"
                >{{ vid.charAt(0).toUpperCase() + vid.slice(1) }} Link</a>
              </div>
            </div>
          </div>
        </div>

      </template>

    </template>

    <!-- Placeholder -->
    <div v-else class="arena-placeholder">
      Vorschau für {{ componentData.label }} wird bald verfügbar.
    </div>

  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { componentTokenGroups } from '../../data/tokens.js'

const props = defineProps({
  componentId: { type: String, required: true }
})

const store = useThemeStore()

const componentData = computed(() => {
  return componentTokenGroups.find(g => g.id === props.componentId) || null
})

const arenaConfig = computed(() => componentData.value?.arenaConfig || null)

const specimens = computed(() => arenaConfig.value?.specimens || [])

const tLight = computed(() => store.state.themes[store.state.activeThemeSet].light)
const tDark = computed(() => store.state.themes[store.state.activeThemeSet].dark)

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
function resolveTokens(semanticMap, useDarkDefaults = false) {
  const resolved = {}
  if (!componentData.value) return resolved
  for (const token of componentData.value.tokens) {
    const override = store.currentComponentOverrides.value[token.id]
    if (override !== undefined) { resolved[token.id] = override; continue }
    if (token.ref) { resolved[token.id] = semanticMap[token.ref] || token.default || ''; continue }
    if (useDarkDefaults && token.darkDefault) { resolved[token.id] = token.darkDefault; continue }
    resolved[token.id] = token.default || ''
  }
  return resolved
}

const tokensLight = computed(() => resolveTokens(tLight.value, false))
const tokensDark = computed(() => resolveTokens(tDark.value, true))

// ---------------------------------------------------------------------------
// Variant Categories
// ---------------------------------------------------------------------------
const CATEGORY_LABELS = { main: 'Main Variants', supporting: 'Supporting', system: 'System' }

const variantCategories = computed(() => {
  if (!arenaConfig.value) return []
  const groups = []
  let lastCat = null
  for (const v of arenaConfig.value.variants) {
    const cat = v.category || 'main'
    if (cat !== lastCat) {
      groups.push({ id: cat, label: CATEGORY_LABELS[cat] || cat, variants: [] })
      lastCat = cat
    }
    groups[groups.length - 1].variants.push(v)
  }
  return groups
})

// ---------------------------------------------------------------------------
// Inline Style Builders
// ---------------------------------------------------------------------------
function resolvePattern(tokens, pattern, variant, size) {
  return tokens[pattern.replace('{variant}', variant).replace('{size}', size)] || ''
}

function buildStyle(tokens, variantId, sizeId) {
  if (!arenaConfig.value) return {}
  const p = arenaConfig.value.tokenPattern
  return {
    background: resolvePattern(tokens, p.background, variantId, sizeId),
    color: resolvePattern(tokens, p.color, variantId, sizeId),
    borderColor: resolvePattern(tokens, p.borderColor, variantId, sizeId) || 'transparent',
    minHeight: resolvePattern(tokens, p.height, variantId, sizeId),
    borderRadius: resolvePattern(tokens, p.radius, variantId, sizeId),
    fontSize: resolvePattern(tokens, p.fontSize, variantId, sizeId),
    paddingInline: resolvePattern(tokens, p.paddingX, variantId, sizeId),
    paddingBlock: resolvePattern(tokens, p.paddingY, variantId, sizeId),
    fontWeight: tokens['nc-button-font-weight'] || '600',
    borderWidth: sizeId === 'lg' ? '2px' : '1px',
    borderStyle: 'solid'
  }
}

function hoverStyle(tokens, variantId, sizeId) {
  if (!arenaConfig.value) return {}
  const base = buildStyle(tokens, variantId, sizeId)
  const p = arenaConfig.value.tokenPattern
  base.background = resolvePattern(tokens, p.backgroundHover, variantId, sizeId) || base.background
  return base
}

function activeStyle(tokens, variantId, sizeId) {
  if (!arenaConfig.value) return {}
  const base = buildStyle(tokens, variantId, sizeId)
  const p = arenaConfig.value.tokenPattern
  base.background = resolvePattern(tokens, p.backgroundActive, variantId, sizeId) || base.background
  return base
}

function disabledStyle(tokens) {
  return {
    background: tokens['nc-button-disabled-bg'] || '',
    color: tokens['nc-button-disabled-color'] || '',
    borderColor: tokens['nc-button-disabled-border'] || 'transparent',
    minHeight: tokens['nc-button-height-md'] || '40px',
    borderRadius: tokens['nc-button-radius-md'] || '6px',
    fontSize: tokens['nc-button-font-size-md'] || '16px',
    paddingInline: tokens['nc-button-padding-x-md'] || '20px',
    paddingBlock: tokens['nc-button-padding-y-md'] || '12px',
    fontWeight: tokens['nc-button-font-weight'] || '600',
    borderWidth: '1px',
    borderStyle: 'solid',
    opacity: '0.5',
    cursor: 'not-allowed'
  }
}

// ---------------------------------------------------------------------------
// Pattern Specimen Helpers
// ---------------------------------------------------------------------------
const ICON_SIZES = { xs: '14px', sm: '16px', md: '18px', lg: '20px' }

function iconSize(sizeId) {
  return ICON_SIZES[sizeId] || '18px'
}

function iconOnlyStyle(tokens, variantId, sizeId) {
  const base = buildStyle(tokens, variantId, sizeId)
  const h = base.minHeight || '40px'
  base.width = h
  base.minWidth = h
  base.paddingInline = '0'
  base.paddingBlock = '0'
  return base
}

function loadingStyle(tokens, variantId, sizeId) {
  const base = buildStyle(tokens, variantId, sizeId)
  base.position = 'relative'
  base.pointerEvents = 'none'
  return base
}

function spinnerStyle(tokens, variantId) {
  if (!arenaConfig.value) return {}
  const p = arenaConfig.value.tokenPattern
  return {
    width: tokens['nc-button-spinner-size'] || '20px',
    height: tokens['nc-button-spinner-size'] || '20px',
    borderWidth: tokens['nc-button-spinner-border-width'] || '2px',
    borderColor: resolvePattern(tokens, p.color, variantId, 'md') || 'currentColor'
  }
}

function togglePressedStyle(tokens, sizeId) {
  if (!arenaConfig.value) return {}
  const base = buildStyle(tokens, 'outline', sizeId)
  const p = arenaConfig.value.tokenPattern
  base.background = resolvePattern(tokens, p.background, 'primary', sizeId)
  base.color = resolvePattern(tokens, p.color, 'primary', sizeId)
  base.borderColor = resolvePattern(tokens, p.background, 'primary', sizeId)
  return base
}

function groupBtnStyle(tokens, variantId, sizeId, position) {
  const base = buildStyle(tokens, variantId, sizeId)
  const r = base.borderRadius || '4px'
  if (position === 'first') {
    base.borderRadius = `${r} 0 0 ${r}`
    base.marginRight = '-1px'
  } else if (position === 'middle') {
    base.borderRadius = '0'
    base.marginRight = '-1px'
  } else {
    base.borderRadius = `0 ${r} ${r} 0`
  }
  return base
}

// ---------------------------------------------------------------------------
// Pulse bei Token-Aenderungen
// ---------------------------------------------------------------------------
const pulsingVariants = ref(new Set())

function triggerPulse(ids) {
  for (const id of ids) pulsingVariants.value.add(id)
  pulsingVariants.value = new Set(pulsingVariants.value)
  setTimeout(() => {
    pulsingVariants.value = new Set()
  }, 900)
}

watch(
  () => JSON.stringify(store.currentComponentOverrides.value),
  (next, prev) => {
    if (!prev || !arenaConfig.value) return
    try {
      const oldObj = JSON.parse(prev)
      const newObj = JSON.parse(next)
      const changed = new Set()
      for (const key of Object.keys(newObj)) {
        if (oldObj[key] !== newObj[key] && key.startsWith('nc-button-')) {
          // Finde betroffene Variante
          for (const v of arenaConfig.value.variants) {
            if (key.includes(`-${v.id}-`)) { changed.add(v.id); break }
          }
        }
      }
      // Pulse fuer Pattern-Specimens
      for (const key of Object.keys(newObj)) {
        if (oldObj[key] === newObj[key]) continue
        if (key.startsWith('nc-icon-button-')) changed.add('icon-only')
        if (key.startsWith('nc-button-spinner-')) changed.add('loading')
      }
      if (changed.size > 0) triggerPulse(changed)
    } catch {}
  }
)
</script>

<style scoped>
.component-arena {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
}

.arena-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.arena-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}

.arena-mode-labels {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  opacity: 0.6;
}

.arena-category-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 4px;
}

.arena-category-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: currentColor;
  opacity: 0.15;
}

.arena-category-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.5;
  white-space: nowrap;
}

.arena-specimen {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  transition: box-shadow 0.3s ease;
}

.arena-specimen--pulse {
  animation: arena-pulse 0.9s ease;
}

@keyframes arena-pulse {
  0%, 100% { box-shadow: none; }
  50% { box-shadow: 0 0 0 3px rgba(0, 159, 227, 0.35); }
}

.arena-specimen__label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 6px 12px;
  opacity: 0.55;
}

.arena-specimen__pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.arena-specimen__panel {
  padding: 12px;
}

.arena-specimen__panel--light {
  border-right: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}

.arena-btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.arena-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  cursor: default;
  line-height: 1.25;
  white-space: nowrap;
  outline: none;
  appearance: none;
  text-decoration: none;
}

.arena-btn--disabled {
  cursor: not-allowed;
}

/* Pattern: Icon */
.arena-btn__icon {
  display: inline-flex;
  flex-shrink: 0;
}

/* Pattern: Spinner */
.arena-btn__spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border-style: solid;
  border-color: currentColor;
  border-top-color: transparent;
  animation: arena-spin 0.6s linear infinite;
}

@keyframes arena-spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Pattern: Button Group */
.arena-btn-group {
  display: inline-flex;
}

.arena-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  font-size: 13px;
  opacity: 0.5;
  font-style: italic;
}
</style>
