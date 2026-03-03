<template>
  <div class="component-arena">

    <!-- Recipe Chips — generated from tone axis -->
    <div class="arena-recipe-chips">
      <button
        v-for="(_, toneId) in recipeData.axes.tone.values"
        :key="toneId"
        :class="['arena-recipe-chip', { 'arena-recipe-chip--active': activeRecipeId === toneId }]"
        @click="activeRecipeId = toneId"
      >
        {{ capitalize(toneId) }}
      </button>
    </div>

    <!-- Specimens — generic matrix renderer (negative specimens sind QA-only) -->
    <template v-for="specimen in recipeData.specimens.filter(s => s.type !== 'negative')" :key="specimen.id">
      <div class="arena-category-divider">
        <span class="arena-category-label">{{ specimen.label }}</span>
      </div>
      <div
        :class="['arena-specimen', { 'arena-specimen--selected': isSpecimenSelected(specimen.id) }]"
        @click="selectSpecimen(specimen)"
      >
        <span class="arena-specimen__label">{{ specimen.description }}</span>

        <!-- Split mode: light + dark panels -->
        <div v-if="isSplit" class="arena-specimen__pair">
          <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
            <SpecimenContent :specimen="specimen" :tokens="tokensLight" :theme="tLight" mode="light" />
          </div>
          <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
            <SpecimenContent :specimen="specimen" :tokens="tokensDark" :theme="tDark" mode="dark" />
          </div>
        </div>

        <!-- Single mode -->
        <div v-else class="arena-specimen__single">
          <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
            <SpecimenContent :specimen="specimen" :tokens="activeTokens" :theme="activeTheme" :mode="arenaMode" />
          </div>
        </div>

      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, h, defineComponent } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { componentTokenGroups } from '../../data/tokens.js'
import { loadRecipe, expandSpecimenMatrix, specimenTokenGroups, groupCellsByAxis, capitalize } from 'recipe-sdk'
import recipeRaw from '../../../../../data/badge-recipe.json'

const recipeData = loadRecipe(recipeRaw)

const store = useThemeStore()

// ---------------------------------------------------------------------------
// Recipe Data
// ---------------------------------------------------------------------------
const activeRecipeId = ref('default')

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
// Specimen Selection — tokenGroups computed from axes
// ---------------------------------------------------------------------------
function selectSpecimen(specimen) {
  const groups = specimenTokenGroups(specimen, recipeData.axes, recipeData.styling.baseTokenGroups, recipeData.states?.rules)
  store.setArenaSelection('badge', specimen.id, groups)
}

function isSpecimenSelected(specimenId) {
  const sel = store.state.arenaSelection
  return sel && sel.componentId === 'badge' && sel.specimenId === specimenId
}

// ---------------------------------------------------------------------------
// Matrix Expansion
// ---------------------------------------------------------------------------
function expandedCells(specimen) {
  return expandSpecimenMatrix(specimen, recipeData)
}

function groupedCells(specimen) {
  const cells = expandedCells(specimen)
  const rowAxis = specimen.layoutConfig?.rowAxis
  if (!rowAxis) return [{ key: '_', label: '', cells }]
  return groupCellsByAxis(cells, rowAxis)
}

// ---------------------------------------------------------------------------
// Icons pro Variante (Tabler-artige SVGs, 24x24 viewBox)
// ---------------------------------------------------------------------------
const ICONS = {
  default:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="12" r="9"/></svg>',
  secondary: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="12" r="9"/></svg>',
  outline:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="12" r="9"/></svg>',
  success:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/><path d="M9 12l2 2l4-4"/></svg>',
  warning:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636-2.87l-8.106-13.536a1.914 1.914 0 0 0-3.274 0z"/><path d="M12 16h.01"/></svg>',
  error:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/><path d="M12 9v4"/><path d="M12 16h.01"/></svg>',
  info:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/><path d="M12 8h.01"/><path d="M11 12h1v4h1"/></svg>'
}

// Vite base path fuer public/ Assets
const base = import.meta.env.BASE_URL
const photos = [
  `${base}avatars/females/avatar-female-1.png`,
  `${base}avatars/males/avatar-male-5.png`,
  `${base}avatars/females/avatar-female-4.png`
]

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

function dotStyle(tokens, variant) {
  return {
    width: tokens['nc-badge-dot-size'],
    height: tokens['nc-badge-dot-size'],
    borderRadius: tokens['nc-badge-dot-radius'] || '9999px',
    background: tokens[`nc-badge-${variant}-bg`] || tokens['nc-badge-default-bg'],
    flexShrink: '0'
  }
}

function iconStyle(tokens) {
  return {
    width: tokens['nc-badge-icon-size'],
    height: tokens['nc-badge-icon-size'],
    flexShrink: '0',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

function avatarBaseStyle() {
  return {
    position: 'relative',
    width: '48px',
    height: '48px',
    minWidth: '48px',
    borderRadius: '9999px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0'
  }
}

function avatarBadgeSlotStyle() {
  return {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    zIndex: '2'
  }
}

// ---------------------------------------------------------------------------
// SpecimenContent — inline render component for each specimen
// ---------------------------------------------------------------------------
const SpecimenContent = defineComponent({
  props: {
    specimen: { type: Object, required: true },
    tokens: { type: Object, required: true },
    theme: { type: Object, required: true },
    mode: { type: String, default: 'light' }
  },
  setup(props) {
    return () => {
      const { specimen, tokens, theme, mode } = props
      const isDark = mode === 'dark'
      const render = specimen.render || {}
      const isComposition = render.compositionType === 'avatar-badge'

      // Dot-mode specimen: special rendering
      const matrixAxes = specimen.matrix?.axes || specimen.matrix || {}
      if (matrixAxes.decorator?.[0] === 'dot' || (Array.isArray(matrixAxes.decorator) && matrixAxes.decorator.includes('dot'))) {
        const cells = expandSpecimenMatrix(specimen, recipeData)
        return h('div', { class: 'arena-badge-row' },
          cells.map(cell => {
            const tone = cell.axisValues.tone || 'default'
            return h('div', { key: cell.id, class: 'arena-badge-labeled' }, [
              h('span', { class: 'arena-badge-dot', style: dotStyle(tokens, tone) }),
              h('span', {
                class: 'arena-badge-dot-label',
                style: isDark ? { color: theme['text-secondary'] } : {}
              }, capitalize(tone))
            ])
          })
        )
      }

      // Counter specimen (non-composition)
      if (render.counterValues && !isComposition) {
        const cells = expandSpecimenMatrix(specimen, recipeData)
        const rows = groupCellsByAxis(cells, specimen.layoutConfig?.rowAxis || 'tone')
        return h('div', { class: 'arena-badge-counter-group' },
          rows.map(row => {
            const representativeCell = row.cells[0]
            return h('div', { key: row.key, class: 'arena-badge-counter-row' }, [
              h('span', {
                class: 'arena-badge-counter-label',
                style: isDark ? { color: theme['text-secondary'] } : {}
              }, row.label),
              ...render.counterValues.map(val =>
                h('span', {
                  key: val,
                  class: 'arena-badge',
                  style: badgeStyleForCell(tokens, representativeCell)
                }, [
                  h('span', { class: 'arena-badge__label' }, val)
                ])
              )
            ])
          })
        )
      }

      // Avatar-badge composition
      if (isComposition) {
        const cells = expandSpecimenMatrix(specimen, recipeData)
        return h('div', { class: 'arena-badge-row' },
          cells.map((cell, i) => {
            const counterVal = render.counterValues?.[i] || ''
            return h('div', { key: cell.id, class: 'arena-avatar-with-badge' }, [
              h('div', { class: 'arena-avatar', style: avatarBaseStyle() }, [
                h('img', {
                  class: 'arena-avatar__image',
                  src: photos[i % photos.length],
                  alt: '',
                  style: { borderRadius: '9999px' }
                }),
                h('span', { class: 'arena-avatar__badge-slot', style: avatarBadgeSlotStyle() }, [
                  h('span', {
                    class: 'arena-badge',
                    style: badgeStyleForCell(tokens, cell)
                  }, [
                    h('span', { class: 'arena-badge__label' }, counterVal)
                  ])
                ])
              ])
            ])
          })
        )
      }

      // Standard rendering: row or grid
      const cells = expandSpecimenMatrix(specimen, recipeData)

      if (specimen.layout === 'grid' && specimen.layoutConfig?.rowAxis) {
        const rows = groupCellsByAxis(cells, specimen.layoutConfig.rowAxis)
        return h('div', { class: 'arena-badge-grid' },
          rows.map(row =>
            h('div', { key: row.key, class: 'arena-badge-size-row' },
              row.cells.map(cell => renderBadgeCell(cell, tokens, render))
            )
          )
        )
      }

      // Row layout (default)
      return h('div', { class: 'arena-badge-row' },
        cells.map(cell => renderBadgeCell(cell, tokens, render))
      )
    }
  }
})

function renderBadgeCell(cell, tokens, render) {
  const tone = cell.axisValues.tone || 'default'
  const label = capitalize(tone)
  const hasIcon = cell.slotConfig?.icon

  const children = []
  if (hasIcon) {
    children.push(h('span', {
      class: 'arena-badge__icon',
      style: iconStyle(tokens),
      innerHTML: ICONS[tone] || ICONS.default
    }))
  }
  children.push(h('span', { class: 'arena-badge__label' }, label))

  return h('span', {
    key: cell.id,
    class: 'arena-badge',
    style: badgeStyleForCell(tokens, cell)
  }, children)
}
</script>

<style scoped>
.component-arena {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
}

/* Recipe Chips */
.arena-recipe-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.arena-recipe-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface);
  color: var(--cfg-text-secondary);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.arena-recipe-chip:hover {
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
}

.arena-recipe-chip--active {
  background: var(--cfg-accent-subtle);
  color: var(--cfg-accent);
  border-color: var(--cfg-accent);
  font-weight: 600;
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
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.arena-specimen:hover {
  border-color: color-mix(in srgb, var(--cfg-accent) 40%, transparent);
}

.arena-specimen--selected {
  border-color: var(--cfg-accent);
  box-shadow: 0 0 0 1px var(--cfg-accent), 0 0 8px color-mix(in srgb, var(--cfg-accent) 20%, transparent);
}

.arena-specimen__label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 6px 12px;
  opacity: 0.55;
  border-radius: 4px;
  background: var(--arena-label-bg, transparent);
}

.arena-specimen__pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.arena-specimen__panel {
  padding: 16px;
}

.arena-specimen__single {
  display: grid;
  grid-template-columns: 1fr;
}

.arena-specimen__panel--light {
  border-right: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}

.arena-specimen__panel--full {
  /* Volle Breite im Single-Modus */
}

/* Badge Rows */
.arena-badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

/* Size Scale Row — SM + MD nebeneinander pro Variante */
.arena-badge-size-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 6px;
}

.arena-badge-size-row:last-child {
  margin-bottom: 0;
}

/* Badge Grid */
.arena-badge-grid {
  display: flex;
  flex-direction: column;
}

/* Badge Base — rein inline-styled, nur layout-Reset hier */
.arena-badge {
  box-sizing: border-box;
}

.arena-badge__label {
  display: inline-flex;
  align-items: center;
}

.arena-badge__icon {
  line-height: 0;
}

.arena-badge__icon > :deep(svg) {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Dot Labeled */
.arena-badge-labeled {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.arena-badge-dot-label {
  font-size: 9px;
  font-weight: 500;
  opacity: 0.6;
}

/* Counter group */
.arena-badge-counter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.arena-badge-counter-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.arena-badge-counter-label {
  font-size: 10px;
  font-weight: 600;
  opacity: 0.55;
  min-width: 44px;
}

/* Avatar with Badge */
.arena-avatar-with-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.arena-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.arena-avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
