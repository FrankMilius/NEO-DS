<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Pro Tone ein eigener Specimen-Container -->
    <template v-for="tone in visibleTones" :key="tone">
      <div class="arena-category-divider">
        <span class="arena-category-label">{{ capitalize(tone) }}</span>
      </div>
      <div class="arena-specimen">

        <!-- Split mode: light + dark panels -->
        <div v-if="isSplit" class="arena-specimen__pair">
          <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
            <ToneContent :tone="tone" :tokens="tokensLight" :theme="tLight" mode="light" />
          </div>
          <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
            <ToneContent :tone="tone" :tokens="tokensDark" :theme="tDark" mode="dark" />
          </div>
        </div>

        <!-- Single mode -->
        <div v-else class="arena-specimen__single">
          <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
            <ToneContent :tone="tone" :tokens="activeTokens" :theme="activeTheme" :mode="arenaMode" />
          </div>
        </div>

      </div>
    </template>

  </div>
</template>

<script setup>
import { computed, h, defineComponent } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { useArenaHighlight } from '../../composables/useArenaHighlight.js'
import { componentTokenGroups } from '../../data/tokens.js'
import { loadRecipe, capitalize } from 'recipe-sdk'
import recipeRaw from '../../../../../data/badge-recipe.json'

const recipeData = loadRecipe(recipeRaw)

const store = useThemeStore()
const { isHighlighted, highlightStyle } = useArenaHighlight('badge')

// ---------------------------------------------------------------------------
// Achsen aus Recipe
// ---------------------------------------------------------------------------
const allTones = Object.keys(recipeData.axes.tone?.values || {})
const allSizes = Object.keys(recipeData.axes.size?.values || {})
const allEmphases = Object.keys(recipeData.axes.emphasis?.values || {})
const allDecorators = Object.keys(recipeData.axes.decorator?.values || {}).filter(d => d !== 'none')

// Generischer Filter-Helper: null/undefined = alle, Map = selektiv
function filteredAxis(allValues, filterKey) {
  return computed(() => {
    const f = store.state.arenaFilters[filterKey]
    if (!f) return allValues
    return allValues.filter(v => f.has(v) && f.get(v) !== false)
  })
}

// Sichtbare Tones (tone → variants), Sizes, Emphases
const visibleTones = filteredAxis(allTones, 'variants')
const visibleSizes = filteredAxis(allSizes, 'sizes')
const visibleEmphases = filteredAxis(allEmphases, 'emphasis')
const visibleDecorators = filteredAxis(allDecorators, 'decorator')

const hasSizes = allSizes.length > 1

// ---------------------------------------------------------------------------
// Token Data
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'badge') || null
)

const tLight = computed(() => store.state.themes[store.state.activeThemeSet].light)
const tDark = computed(() => store.state.themes[store.state.activeThemeSet].dark)

const TOKEN_DEFAULTS = {
  'nc-badge-padding-x-sm':     '6px',
  'nc-badge-padding-x-md':     '8px',
  'nc-badge-padding-y':        '2px',
  'nc-badge-radius':           '9999px',
  'nc-badge-font-size-sm':     '0.6875rem',
  'nc-badge-font-size-md':     '0.75rem',
  'nc-badge-font-weight':      '600',
  'nc-badge-letter-spacing':   '0.01em',
  'nc-badge-line-height':      '1',
  'nc-badge-border-width':     '0',
  'nc-badge-border-color':     'transparent',
  'nc-badge-height-sm':        '20px',
  'nc-badge-height-md':        '24px',
  'nc-badge-default-bg':       '#e8e8e8',
  'nc-badge-default-color':    '#1a1a1a',
  'nc-badge-default-border':   'transparent',
  'nc-badge-secondary-bg':     '#f0f0f0',
  'nc-badge-secondary-color':  '#666',
  'nc-badge-secondary-border': 'transparent',
  'nc-badge-outline-bg':       'transparent',
  'nc-badge-outline-color':    '#1a1a1a',
  'nc-badge-outline-border':   '#ccc',
  'nc-badge-success-bg':       '#e6f4ea',
  'nc-badge-success-color':    '#1a7431',
  'nc-badge-success-border':   'transparent',
  'nc-badge-warning-bg':       '#fef3e0',
  'nc-badge-warning-color':    '#8a6d3b',
  'nc-badge-warning-border':   'transparent',
  'nc-badge-error-bg':         '#fde8e8',
  'nc-badge-error-color':      '#c62828',
  'nc-badge-error-border':     'transparent',
  'nc-badge-info-bg':          '#e3f2fd',
  'nc-badge-info-color':       '#1565c0',
  'nc-badge-info-border':      'transparent',
  'nc-badge-icon-size':        '12px',
  'nc-badge-gap':              '4px',
  'nc-badge-dot-size':         '8px',
  'nc-badge-dot-radius':       '9999px',
  'nc-badge-label-max-width':  '20ch'
}

const TOKEN_REFS = {
  'nc-badge-default-bg':       'background-secondary',
  'nc-badge-default-color':    'text-primary',
  'nc-badge-secondary-bg':     'background-tertiary',
  'nc-badge-secondary-color':  'text-secondary',
  'nc-badge-outline-bg':       '',
  'nc-badge-outline-color':    'text-primary',
  'nc-badge-outline-border':   'border-primary',
  'nc-badge-success-bg':       'background-success',
  'nc-badge-success-color':    'text-success',
  'nc-badge-warning-bg':       'background-warning',
  'nc-badge-warning-color':    'text-warning',
  'nc-badge-error-bg':         'background-danger',
  'nc-badge-error-color':      'text-danger',
  'nc-badge-info-bg':          'background-info',
  'nc-badge-info-color':       'text-info'
}

function resolveToken(semanticMap, tokenId) {
  const override = store.currentComponentOverrides.value?.[tokenId]
  if (override !== undefined) return override
  if (componentData.value) {
    const tok = componentData.value.tokens.find(t => t.id === tokenId)
    if (tok) {
      if (tok.ref && semanticMap[tok.ref]) return semanticMap[tok.ref]
      if (tok.default) return tok.default
    }
  }
  if (TOKEN_REFS[tokenId] && semanticMap[TOKEN_REFS[tokenId]]) {
    return semanticMap[TOKEN_REFS[tokenId]]
  }
  return TOKEN_DEFAULTS[tokenId] || ''
}

function resolveAll(semanticMap) {
  const all = {}
  const allIds = [...Object.keys(TOKEN_DEFAULTS), ...Object.keys(TOKEN_REFS)]
  for (const id of new Set(allIds)) {
    all[id] = resolveToken(semanticMap, id)
  }
  return all
}

const tokensLight = computed(() => resolveAll(tLight.value))
const tokensDark = computed(() => resolveAll(tDark.value))

// ---------------------------------------------------------------------------
// 3-Mode Support (light / dark / split)
// ---------------------------------------------------------------------------
const arenaMode = computed(() => store.state.previewMode)
const isSplit = computed(() => arenaMode.value === 'split')
const activeTokens = computed(() =>
  arenaMode.value === 'dark' ? tokensDark.value : tokensLight.value
)
const activeTheme = computed(() =>
  arenaMode.value === 'dark' ? tDark.value : tLight.value
)
const activeBg = computed(() =>
  arenaMode.value === 'dark'
    ? tDark.value['background-base']
    : tLight.value['background-secondary']
)


// ---------------------------------------------------------------------------
// Style Builders
// ---------------------------------------------------------------------------

function badgeStyleForCell(tokens, cell) {
  const tone = cell.axisValues.tone || 'default'
  const emphasis = cell.axisValues.emphasis || 'solid'
  const size = cell.axisValues.size || 'md'
  const ht = size === 'sm' ? tokens['nc-badge-height-sm'] : tokens['nc-badge-height-md']
  const fs = size === 'sm' ? tokens['nc-badge-font-size-sm'] : tokens['nc-badge-font-size-md']
  const px = size === 'sm' ? tokens['nc-badge-padding-x-sm'] : tokens['nc-badge-padding-x-md']
  const py = size === 'sm' ? '0' : tokens['nc-badge-padding-y']

  // Resolve tone colors
  let bg = tokens[`nc-badge-${tone}-bg`] || tokens['nc-badge-default-bg']
  let color = tokens[`nc-badge-${tone}-color`] || tokens['nc-badge-default-color']
  let borderColor = tokens[`nc-badge-${tone}-border`] || 'transparent'

  // Emphasis overrides
  if (emphasis === 'outline') {
    bg = tokens['nc-badge-outline-bg'] || 'transparent'
    color = tokens['nc-badge-outline-color'] || tokens['nc-badge-default-color']
    borderColor = tokens['nc-badge-outline-border'] || tokens['nc-badge-default-border'] || '#ccc'
  } else if (emphasis === 'soft') {
    bg = `color-mix(in srgb, ${bg} 40%, transparent)`
    borderColor = 'transparent'
  }

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens['nc-badge-gap'],
    minHeight: ht,
    padding: `${py} ${px}`,
    borderRadius: tokens['nc-badge-radius'],
    fontSize: fs,
    fontWeight: tokens['nc-badge-font-weight'],
    letterSpacing: tokens['nc-badge-letter-spacing'],
    lineHeight: tokens['nc-badge-line-height'],
    whiteSpace: 'nowrap',
    background: bg,
    color: color,
    borderWidth: tokens['nc-badge-border-width'] || '0',
    borderStyle: 'solid',
    borderColor: borderColor
  }
}

// ---------------------------------------------------------------------------
// ToneContent — rendert pro Tone: Default → Sizes
// ---------------------------------------------------------------------------
const ToneContent = defineComponent({
  props: {
    tone: { type: String, required: true },
    tokens: { type: Object, required: true },
    theme: { type: Object, required: true },
    mode: { type: String, default: 'light' }
  },
  setup(props) {
    return () => {
      const { tone, tokens } = props
      const sections = []

      // 1. Default — Badge in md, sichtbare Emphases
      const emphases = visibleEmphases.value
      sections.push(
        h('div', { class: 'arena-variant-section' },
          [h('div', { class: 'arena-badge-row' },
            emphases.map(emphasis =>
              renderBadge(tokens, { tone, size: 'md', emphasis })
            )
          )]
        )
      )

      // 2. Sizes (sofern > 1 Size und sichtbar)
      const sizes = visibleSizes.value
      if (hasSizes && sizes.length > 0) {
        sections.push(
          h('div', { class: 'arena-variant-section' }, [
            h('div', { class: 'arena-variant-section__label' }, 'Sizes'),
            h('div', { class: 'arena-badge-row' },
              sizes.map(size =>
                renderBadge(tokens, { tone, size, emphasis: 'solid' })
              )
            )
          ])
        )
      }

      // 3. Decorators (icon, dot, counter — sofern sichtbar)
      const decorators = visibleDecorators.value
      if (decorators.length > 0) {
        sections.push(
          h('div', { class: 'arena-variant-section' }, [
            h('div', { class: 'arena-variant-section__label' }, 'Decorator'),
            h('div', { class: 'arena-badge-row' },
              decorators.map(decorator =>
                renderDecoratedBadge(tokens, { tone, size: 'md', emphasis: 'solid', decorator })
              )
            )
          ])
        )
      }

      return h('div', { class: 'arena-variant-content' }, sections)
    }
  }
})

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
const BADGE_ICON = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10"/></svg>'

// ---------------------------------------------------------------------------
// renderDecoratedBadge — Badge mit Decorator (icon, dot, counter)
// ---------------------------------------------------------------------------
function renderDecoratedBadge(tokens, { tone, size = 'md', emphasis = 'solid', decorator }) {
  const style = badgeStyleForCell(tokens, { axisValues: { tone, size, emphasis } })
  const children = []

  if (decorator === 'dot') {
    const toneColor = tokens[`nc-badge-${tone}-color`] || tokens['nc-badge-default-color']
    children.push(h('span', {
      class: 'arena-badge__dot',
      style: {
        width: tokens['nc-badge-dot-size'],
        height: tokens['nc-badge-dot-size'],
        borderRadius: tokens['nc-badge-dot-radius'],
        background: toneColor,
        flexShrink: '0'
      }
    }))
  }

  if (decorator === 'icon') {
    children.push(h('span', {
      class: 'arena-badge__icon',
      style: {
        width: tokens['nc-badge-icon-size'],
        height: tokens['nc-badge-icon-size'],
        flexShrink: '0',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      innerHTML: BADGE_ICON
    }))
  }

  children.push(h('span', { class: 'arena-badge__label' }, capitalize(decorator)))

  if (decorator === 'counter') {
    children.push(h('span', {
      class: 'arena-badge__counter',
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '16px',
        height: '16px',
        padding: '0 4px',
        borderRadius: '9999px',
        fontSize: '10px',
        fontWeight: '700',
        lineHeight: '1',
        background: tokens[`nc-badge-${tone}-color`] || tokens['nc-badge-default-color'],
        color: tokens[`nc-badge-${tone}-bg`] || tokens['nc-badge-default-bg']
      }
    }, '3'))
  }

  return h('span', {
    key: `${tone}-${size}-${emphasis}-${decorator}`,
    class: 'arena-badge',
    style
  }, children)
}

// ---------------------------------------------------------------------------
// renderBadge — einzelnes Badge mit Tone/Size/Emphasis
// ---------------------------------------------------------------------------
function renderBadge(tokens, { tone, size = 'md', emphasis = 'solid' }) {
  const label = emphasis !== 'solid' ? capitalize(emphasis) : capitalize(tone)
  const style = badgeStyleForCell(tokens, { axisValues: { tone, size, emphasis } })

  return h('span', {
    key: `${tone}-${size}-${emphasis}`,
    class: 'arena-badge',
    style
  }, [
    h('span', { class: 'arena-badge__label' }, label)
  ])
}
</script>

<style scoped>
.component-arena {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
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
}

.arena-specimen__pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.arena-specimen__panel {
  padding: 24px; /* --fnd-spacing-06 */
}

.arena-specimen__single {
  display: grid;
  grid-template-columns: 1fr;
}

.arena-specimen__panel--light {
  border-right: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}

/* Variant Content */
.arena-variant-content {
  display: flex;
  flex-direction: column;
  gap: 8px; /* --fnd-spacing-02 */
}

.arena-variant-section {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.arena-variant-section__label {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.4;
  margin-bottom: 8px; /* --fnd-spacing-02 */
}

.arena-variant-divider {
  height: 1px;
  background: currentColor;
  opacity: 0.08;
  margin: 0;
}

/* Badge Rows */
.arena-badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* --fnd-spacing-04 */
  align-items: center;
}

/* Badge Base */
.arena-badge {
  box-sizing: border-box;
}

.arena-badge__label {
  display: inline-flex;
  align-items: center;
}

.arena-badge__icon svg {
  width: 100%;
  height: 100%;
}
</style>
