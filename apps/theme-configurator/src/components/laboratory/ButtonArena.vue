<template>
  <div class="component-arena">

    <!-- Recipe Chips — generated from variant axis -->
    <div class="arena-recipe-chips">
      <button
        v-for="(_, variantId) in recipeData.axes.variant.values"
        :key="variantId"
        :class="['arena-recipe-chip', { 'arena-recipe-chip--active': activeRecipeId === variantId }]"
        @click="activeRecipeId = variantId"
      >
        {{ capitalize(variantId) }}
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
import { loadRecipe, expandSpecimenMatrix, applyStateRules, specimenTokenGroups, groupCellsByAxis, renderModel, capitalize } from 'recipe-sdk'
import recipeRaw from '../../../../../data/button-recipe.json'

const store = useThemeStore()

// ---------------------------------------------------------------------------
// Recipe Data
// ---------------------------------------------------------------------------
const recipeData = loadRecipe(recipeRaw)
const activeRecipeId = ref('primary')

// ---------------------------------------------------------------------------
// Token Data
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'button') || null
)

const tLight = computed(() => store.state.themes[store.state.activeThemeSet].light)
const tDark = computed(() => store.state.themes[store.state.activeThemeSet].dark)

const TOKEN_DEFAULTS = {
  // Geometry
  'nc-button-height-xs':        '24px',
  'nc-button-height-sm':        '32px',
  'nc-button-height-md':        '40px',
  'nc-button-height-lg':        '48px',
  'nc-button-padding-x-xs':     '8px',
  'nc-button-padding-x-sm':     '12px',
  'nc-button-padding-x-md':     '20px',
  'nc-button-padding-x-lg':     '24px',
  'nc-button-padding-y-xs':     '4px',
  'nc-button-padding-y-sm':     '8px',
  'nc-button-padding-y-md':     '12px',
  'nc-button-padding-y-lg':     '16px',
  'nc-button-radius-xs':        '4px',
  'nc-button-radius-sm':        '4px',
  'nc-button-radius-md':        '4px',
  'nc-button-radius-lg':        '4px',
  'nc-button-radius-full':      '9999px',
  // Typography
  'nc-button-font-size-xs':     '12px',
  'nc-button-font-size-sm':     '12px',
  'nc-button-font-size-md':     '16px',
  'nc-button-font-size-lg':     '16px',
  'nc-button-font-weight':      '600',
  'nc-button-line-height':      '1.25',
  'nc-button-label-compact':    '12px',
  'nc-button-label-expressive': '16px',
  // Spacing & General
  'nc-button-gap':              '8px',
  'nc-button-min-width':        '64px',
  'nc-button-border-width-sm':  '1px',
  'nc-button-border-width-lg':  '2px',
  'nc-button-transition-duration': '200ms',
  'nc-button-scale-active':     '0.98',
  'nc-button-opacity-disabled':  '0.38',
  // Icon
  'nc-button-icon-gap-xs':      '4px',
  'nc-button-icon-gap-sm':      '8px',
  'nc-button-icon-gap-md':      '8px',
  'nc-button-icon-gap-lg':      '12px',
  'nc-button-icon-size-xs':     '16px',
  'nc-button-icon-size-sm':     '16px',
  'nc-button-icon-size-md':     '20px',
  'nc-button-icon-size-lg':     '20px',
  // Primary
  'nc-button-primary-bg':       '#0066cc',
  'nc-button-primary-bg-hover': '#0052a3',
  'nc-button-primary-bg-active':'#003d7a',
  'nc-button-primary-color':    '#ffffff',
  'nc-button-primary-border':   'transparent',
  // Secondary
  'nc-button-secondary-bg':       'transparent',
  'nc-button-secondary-bg-hover': '#f5f5f5',
  'nc-button-secondary-bg-active':'#ebebeb',
  'nc-button-secondary-color':    '#0066cc',
  'nc-button-secondary-border':   '#0066cc',
  // Outline
  'nc-button-outline-bg':       'transparent',
  'nc-button-outline-bg-hover': '#f5f5f5',
  'nc-button-outline-bg-active':'#ebebeb',
  'nc-button-outline-color':    '#1a1a1a',
  'nc-button-outline-border':   '#ccc',
  // Ghost
  'nc-button-ghost-bg':         'transparent',
  'nc-button-ghost-bg-hover':   '#f5f5f5',
  'nc-button-ghost-bg-active':  '#ebebeb',
  'nc-button-ghost-color':      '#1a1a1a',
  'nc-button-ghost-border':     'transparent',
  // Accent
  'nc-button-accent-bg':        '#ffcc00',
  'nc-button-accent-bg-hover':  '#e6b800',
  'nc-button-accent-bg-active': '#cca300',
  'nc-button-accent-color':     '#1a1a1a',
  'nc-button-accent-border':    'transparent',
  // Success
  'nc-button-success-bg':       '#198038',
  'nc-button-success-bg-hover': '#157030',
  'nc-button-success-bg-active':'#116028',
  'nc-button-success-color':    '#ffffff',
  'nc-button-success-border':   'transparent',
  // Warning
  'nc-button-warning-bg':       '#f1c21b',
  'nc-button-warning-bg-hover': '#d9ae18',
  'nc-button-warning-bg-active':'#c29a15',
  'nc-button-warning-color':    '#1a1a1a',
  'nc-button-warning-border':   'transparent',
  // Error
  'nc-button-error-bg':         '#da1e28',
  'nc-button-error-bg-hover':   '#c41a23',
  'nc-button-error-bg-active':  '#ad161e',
  'nc-button-error-color':      '#ffffff',
  'nc-button-error-border':     '#da1e28',
  // Info
  'nc-button-info-bg':          '#0043ce',
  'nc-button-info-bg-hover':    '#003ab5',
  'nc-button-info-bg-active':   '#00319c',
  'nc-button-info-color':       '#ffffff',
  'nc-button-info-border':      'transparent',
  // Disabled
  'nc-button-disabled-bg':      '#f0f0f0',
  'nc-button-disabled-color':   '#a8a8a8',
  'nc-button-disabled-border':  '#e0e0e0',
  // Spinner
  'nc-button-spinner-size':        '20px',
  'nc-button-spinner-border-width':'2px'
}

const TOKEN_REFS = {
  'nc-button-primary-bg':         'interactive-default',
  'nc-button-primary-bg-hover':   'interactive-hover',
  'nc-button-primary-bg-active':  'interactive-active',
  'nc-button-primary-color':      'text-on-interactive',
  'nc-button-secondary-color':    'interactive-default',
  'nc-button-secondary-border':   'interactive-default',
  'nc-button-secondary-bg-hover': 'background-secondary',
  'nc-button-secondary-bg-active':'background-tertiary',
  'nc-button-outline-bg-hover':   'background-secondary',
  'nc-button-outline-bg-active':  'background-tertiary',
  'nc-button-outline-color':      'text-primary',
  'nc-button-outline-border':     'border-primary',
  'nc-button-ghost-bg-hover':     'background-secondary',
  'nc-button-ghost-bg-active':    'background-tertiary',
  'nc-button-ghost-color':        'text-primary',
  'nc-button-accent-bg':          'background-accent',
  'nc-button-accent-bg-hover':    'background-accent-secondary',
  'nc-button-success-bg':         'feedback-success',
  'nc-button-warning-bg':         'feedback-warning',
  'nc-button-error-bg':           'feedback-danger',
  'nc-button-error-border':       'feedback-danger',
  'nc-button-info-bg':            'feedback-info',
  'nc-button-disabled-bg':        'background-disabled',
  'nc-button-disabled-color':     'text-disabled',
  'nc-button-disabled-border':    'border-secondary'
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
  store.setArenaSelection('button', specimen.id, groups)
}

function isSpecimenSelected(specimenId) {
  const sel = store.state.arenaSelection
  return sel && sel.componentId === 'button' && sel.specimenId === specimenId
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
// Icons (Tabler-artige SVGs, 24x24 viewBox)
// ---------------------------------------------------------------------------
const ICONS = {
  default:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5l0 14"/><path d="M5 12l14 0"/></svg>',
  primary:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10"/></svg>',
  secondary: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5l0 14"/><path d="M5 12l14 0"/></svg>',
  accent:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 8l0 4l2 2"/></svg>',
  outline:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"/><path d="M13.5 6.5l4 4"/></svg>',
  ghost:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"/><path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"/></svg>',
  success:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M9 12l2 2l4 -4"/></svg>',
  warning:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z"/><path d="M12 16h.01"/></svg>',
  error:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 9v4"/><path d="M12 16h.01"/></svg>',
  info:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 8h.01"/><path d="M11 12h1v4h1"/></svg>'
}

// Toggle icons
const TOGGLE_ICONS = {
  Bold:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5h6a3.5 3.5 0 0 1 0 7h-6z"/><path d="M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7"/></svg>',
  Italic:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5l6 0"/><path d="M7 19l6 0"/><path d="M14 5l-4 14"/></svg>',
  Underline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5v5a5 5 0 0 0 10 0v-5"/><path d="M5 19h14"/></svg>'
}

// ---------------------------------------------------------------------------
// Style Builders
// ---------------------------------------------------------------------------

function buttonStyleForCell(tokens, cell) {
  const variant = cell.axisValues.variant || 'primary'
  const size = cell.axisValues.size || 'md'
  const pattern = cell.axisValues.pattern || 'standard'
  const isIconOnly = pattern === 'icon-only'

  const ht = tokens[`nc-button-height-${size}`]
  const fs = tokens[`nc-button-font-size-${size}`]
  const px = isIconOnly ? '0' : tokens[`nc-button-padding-x-${size}`]
  const py = tokens[`nc-button-padding-y-${size}`]
  const radius = tokens[`nc-button-radius-${size}`]
  const gap = tokens[`nc-button-icon-gap-${size}`]

  const bg = tokens[`nc-button-${variant}-bg`] || tokens['nc-button-primary-bg']
  const color = tokens[`nc-button-${variant}-color`] || tokens['nc-button-primary-color']
  const borderColor = tokens[`nc-button-${variant}-border`] || 'transparent'
  const borderWidth = size === 'lg' ? tokens['nc-button-border-width-lg'] : tokens['nc-button-border-width-sm']

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: gap,
    height: ht,
    minWidth: isIconOnly ? ht : tokens['nc-button-min-width'],
    padding: `${py} ${px}`,
    borderRadius: radius,
    fontSize: fs,
    fontWeight: tokens['nc-button-font-weight'],
    lineHeight: tokens['nc-button-line-height'],
    whiteSpace: 'nowrap',
    background: bg,
    color: color,
    borderWidth: borderWidth,
    borderStyle: 'solid',
    borderColor: borderColor,
    cursor: 'pointer',
    textDecoration: 'none',
    boxSizing: 'border-box'
  }

  if (isIconOnly) {
    style.width = ht
    style.padding = '0'
  }

  return style
}

function spinnerStyle(tokens, cell) {
  const variant = cell.axisValues.variant || 'primary'
  const spinnerColor = tokens[`nc-button-${variant}-color`] || tokens['nc-button-primary-color']
  return {
    width: tokens['nc-button-spinner-size'],
    height: tokens['nc-button-spinner-size'],
    border: `${tokens['nc-button-spinner-border-width']} solid color-mix(in srgb, ${spinnerColor} 30%, transparent)`,
    borderTopColor: spinnerColor,
    borderRadius: '9999px',
    animation: 'spin 0.6s linear infinite',
    flexShrink: '0'
  }
}

function iconStyle(tokens, size) {
  const s = size || 'md'
  return {
    width: tokens[`nc-button-icon-size-${s}`],
    height: tokens[`nc-button-icon-size-${s}`],
    flexShrink: '0',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
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
      const cells = expandSpecimenMatrix(specimen, recipeData)

      // Resolve composition from first cell's axis values via renderModel
      const model = cells.length > 0 ? renderModel(cells[0], recipeData) : {}
      const hint = model.renderHint
      const wrapper = model.wrapper

      // --- Button Group composition ---
      if (hint === 'button-group') {
        const cell = cells[0]
        const labels = render.groupLabels || ['Left', 'Center', 'Right']
        const wrapperAttrs = {
          class: wrapper?.className || 'arena-button-group',
          ...(wrapper?.attributes || { role: 'group' })
        }
        return h(wrapper?.element || 'div', wrapperAttrs,
          labels.map((label, i) => {
            const style = { ...buttonStyleForCell(tokens, cell) }
            // Remove inner border-radius for middle buttons
            if (i === 0) {
              style.borderTopRightRadius = '0'
              style.borderBottomRightRadius = '0'
              style.borderRight = 'none'
            } else if (i === labels.length - 1) {
              style.borderTopLeftRadius = '0'
              style.borderBottomLeftRadius = '0'
              style.borderLeft = 'none'
            } else {
              style.borderRadius = '0'
              style.borderLeft = 'none'
              style.borderRight = 'none'
            }
            return h('button', { key: label, class: 'arena-button', style }, [
              h('span', { class: 'arena-button__label' }, label)
            ])
          })
        )
      }

      // --- Toggle composition ---
      if (hint === 'toggle') {
        const cell = cells[0]
        const labels = render.toggleLabels || ['Bold', 'Italic', 'Underline']
        const wrapperAttrs = {
          class: wrapper?.className || 'arena-button-row',
          ...(wrapper?.attributes || {})
        }
        return h(wrapper?.element || 'div', wrapperAttrs,
          labels.map((label, i) => {
            const pressed = i === 0 // First toggle is "pressed"
            const baseStyle = buttonStyleForCell(tokens, cell)
            const style = { ...baseStyle }
            if (pressed) {
              // Active toggle: use primary colors
              style.background = tokens['nc-button-primary-bg'] || '#0066cc'
              style.color = tokens['nc-button-primary-color'] || '#ffffff'
              style.borderColor = tokens['nc-button-primary-bg'] || '#0066cc'
            }
            const size = cell.axisValues.size || 'md'
            const icon = TOGGLE_ICONS[label] || ICONS.default
            return h('button', {
              key: label,
              class: 'arena-button',
              style,
              'aria-pressed': pressed ? 'true' : 'false'
            }, [
              h('span', {
                class: 'arena-button__icon',
                style: iconStyle(tokens, size),
                innerHTML: icon
              })
            ])
          })
        )
      }

      // --- Link as Button composition (elementHint: 'a') ---
      if (hint === 'link' || model.elementHint === 'a') {
        return h('div', { class: 'arena-button-row' },
          cells.map(cell => {
            const variant = cell.axisValues.variant || 'primary'
            const style = buttonStyleForCell(tokens, cell)
            return h(model.elementHint || 'a', {
              key: cell.id,
              class: 'arena-button',
              style,
              href: '#',
              role: 'button',
              onClick: (e) => e.preventDefault()
            }, [
              h('span', { class: 'arena-button__label' }, capitalize(variant))
            ])
          })
        )
      }

      // --- Icon-Only grid ---
      if (specimen.layout === 'grid' && specimen.layoutConfig?.rowAxis) {
        const rows = groupCellsByAxis(cells, specimen.layoutConfig.rowAxis)
        return h('div', { class: 'arena-button-grid' },
          rows.map(row =>
            h('div', { key: row.key, class: 'arena-button-grid-row' }, [
              h('span', {
                class: 'arena-button-grid-label',
                style: isDark ? { color: theme['text-secondary'] } : {}
              }, row.label),
              ...row.cells.map(cell => renderButtonCell(cell, tokens, render))
            ])
          )
        )
      }

      // --- Standard row layout ---
      return h('div', { class: 'arena-button-row' },
        cells.map(cell => renderButtonCell(cell, tokens, render))
      )
    }
  }
})

function renderButtonCell(cell, tokens, render) {
  const variant = cell.axisValues.variant || 'primary'
  const size = cell.axisValues.size || 'md'
  const pattern = cell.axisValues.pattern || 'standard'
  const isIconOnly = pattern === 'icon-only'
  const hasIcon = cell.slotConfig?.icon
  const isLoading = cell.resolvedState?.active?.includes('loading')
  const stateAttrs = cell.resolvedState?.attributes || {}
  const label = render.label === '{variant}' ? capitalize(variant)
              : render.label === '{size}' ? size.toUpperCase()
              : capitalize(variant)

  const children = []

  // Icon
  if (hasIcon || isIconOnly) {
    const iconKey = isIconOnly ? (render.icon === 'default' ? 'default' : variant) : variant
    children.push(h('span', {
      class: 'arena-button__icon',
      style: iconStyle(tokens, size),
      innerHTML: ICONS[iconKey] || ICONS.default
    }))
  }

  // Label (hidden in loading state to maintain width)
  if (!isIconOnly) {
    const labelStyle = isLoading ? { visibility: 'hidden' } : {}
    children.push(h('span', { class: 'arena-button__label', style: labelStyle }, label))
  }

  // Spinner overlay for loading state (driven by resolvedState.slotConfig.spinner)
  if (isLoading && cell.resolvedState?.slotConfig?.spinner) {
    children.push(h('span', { class: 'arena-button__spinner', style: {
      position: 'absolute', inset: '0',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}, [h('span', { style: spinnerStyle(tokens, cell) })]))
  }

  const btnStyle = { ...buttonStyleForCell(tokens, cell) }
  if (isLoading) btnStyle.position = 'relative'

  return h('button', {
    key: cell.id,
    class: ['arena-button', isLoading ? 'arena-button--loading' : ''].filter(Boolean).join(' '),
    style: btnStyle,
    ...(isIconOnly ? { 'aria-label': capitalize(variant) } : {}),
    ...(stateAttrs['aria-busy'] ? { 'aria-busy': 'true' } : {}),
    ...(stateAttrs['disabled?'] || stateAttrs['aria-disabled'] ? { disabled: true } : {})
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

/* Button Rows */
.arena-button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

/* Button Group (no gap, adjacent borders) */
.arena-button-group {
  display: inline-flex;
  align-items: center;
}

/* Button Grid (icon-only size matrix) */
.arena-button-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.arena-button-grid-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.arena-button-grid-label {
  font-size: 10px;
  font-weight: 600;
  opacity: 0.55;
  min-width: 70px;
}

/* Button Base */
.arena-button {
  box-sizing: border-box;
  font-family: inherit;
}

.arena-button__label {
  display: inline-flex;
  align-items: center;
}

.arena-button__icon {
  line-height: 0;
}

.arena-button__icon > :deep(svg) {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Spinner animation */
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
