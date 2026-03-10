<template>
  <div class="component-arena">

    <!-- Pro Variante ein eigener Specimen-Container -->
    <template v-for="variant in visibleVariants" :key="variant">
      <div class="arena-category-divider">
        <span class="arena-category-label">{{ capitalize(variant) }}</span>
      </div>
      <div class="arena-specimen">

        <!-- Split mode: light + dark panels -->
        <div v-if="isSplit" class="arena-specimen__pair">
          <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'], position: 'relative' }">
            <VariantContent :variant="variant" :tokens="tokensLight" :theme="tLight" mode="light" />
            <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>
          </div>
          <div class="arena-specimen__panel" :style="{ background: tDark['background-base'], position: 'relative' }">
            <VariantContent :variant="variant" :tokens="tokensDark" :theme="tDark" mode="dark" />
            <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>
          </div>
        </div>

        <!-- Single mode -->
        <div v-else class="arena-specimen__single">
          <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg, position: 'relative' }">
            <VariantContent :variant="variant" :tokens="activeTokens" :theme="activeTheme" :mode="arenaMode" />
            <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>
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
import recipeRaw from '../../../../../data/button-recipe.json'

const store = useThemeStore()
const { isHighlighted, highlightStyle } = useArenaHighlight('button')

// ---------------------------------------------------------------------------
// Recipe Data
// ---------------------------------------------------------------------------
const recipeData = loadRecipe(recipeRaw)

// Achsen aus Recipe
const allVariants = Object.keys(recipeData.axes.variant?.values || {})
const allSizes = Object.keys(recipeData.axes.size?.values || {})
const allStates = (recipeData.states?.supported || []).filter(s => s !== 'default')
const allPatterns = Object.keys(recipeData.axes.pattern?.values || {})
const allCompositions = Object.keys(recipeData.axes.composition?.values || {}).filter(c => c !== 'single')

// Generischer Filter-Helper: null/undefined = alle, Map = selektiv
function filteredAxis(allValues, filterKey) {
  return computed(() => {
    const f = store.state.arenaFilters[filterKey]
    if (!f) return allValues
    return allValues.filter(v => f.has(v) && f.get(v) !== false)
  })
}

// Sichtbare Achsen
const visibleVariants = filteredAxis(allVariants, 'variants')
const visibleSizes = filteredAxis(allSizes, 'sizes')
const visibleStates = filteredAxis(allStates, 'states')
const visiblePatterns = filteredAxis(allPatterns, 'pattern')
const visibleCompositions = filteredAxis(allCompositions, 'composition')

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
// Mehr als 1 Size? → Size-Sektion anzeigen
// ---------------------------------------------------------------------------
const hasSizes = allSizes.length > 1

// ---------------------------------------------------------------------------
// Icons (Tabler-artige SVGs, 24x24 viewBox)
// ---------------------------------------------------------------------------
const ICON_PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5l0 14"/><path d="M5 12l14 0"/></svg>'
const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10"/></svg>'

// Toggle Icons
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
  return {
    width: tokens[`nc-button-icon-size-${size}`] || '20px',
    height: tokens[`nc-button-icon-size-${size}`] || '20px',
    flexShrink: '0',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

// ---------------------------------------------------------------------------
// VariantContent — rendert pro Variante: Default → States → Sizes
// ---------------------------------------------------------------------------
const VariantContent = defineComponent({
  props: {
    variant: { type: String, required: true },
    tokens: { type: Object, required: true },
    theme: { type: Object, required: true },
    mode: { type: String, default: 'light' }
  },
  setup(props) {
    return () => {
      const { variant, tokens } = props
      const sections = []

      // 1. Default — Button in md, default state
      sections.push(
        h('div', { class: 'arena-variant-section' },
          [renderButton(tokens, { variant, size: 'md' })]
        )
      )

      // 2. States (sofern sichtbar)
      const states = visibleStates.value
      if (states.length > 0) {
        sections.push(
          h('div', { class: 'arena-variant-section' }, [
            h('div', { class: 'arena-variant-section__label' }, 'States'),
            h('div', { class: 'arena-button-row' },
              states.map(state =>
                renderButton(tokens, { variant, size: 'md', state })
              )
            )
          ])
        )
      }

      // 3. Sizes (sofern > 1 Size und sichtbar)
      const sizes = visibleSizes.value
      if (hasSizes && sizes.length > 0) {
        sections.push(
          h('div', { class: 'arena-variant-section' }, [
            h('div', { class: 'arena-variant-section__label' }, 'Sizes'),
            h('div', { class: 'arena-button-row' },
              sizes.map(size =>
                renderButton(tokens, { variant, size })
              )
            )
          ])
        )
      }

      // 4. Patterns (with-icon, icon-only — sofern sichtbar)
      const patterns = visiblePatterns.value.filter(p => p !== 'standard')
      if (patterns.length > 0) {
        sections.push(
          h('div', { class: 'arena-variant-section' }, [
            h('div', { class: 'arena-variant-section__label' }, 'Pattern'),
            h('div', { class: 'arena-button-row' },
              patterns.map(pattern =>
                renderButton(tokens, { variant, size: 'md', pattern })
              )
            )
          ])
        )
      }

      // 5. Compositions (group, toggle, link — sofern sichtbar)
      const compositions = visibleCompositions.value
      if (compositions.length > 0) {
        sections.push(
          h('div', { class: 'arena-variant-section' }, [
            h('div', { class: 'arena-variant-section__label' }, 'Composition'),
            h('div', { class: 'arena-button-row', style: { gap: '16px' } },
              compositions.map(comp =>
                renderComposition(tokens, { variant, size: 'md', composition: comp })
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
// renderButton — einzelner Button mit Variant/Size/State
// ---------------------------------------------------------------------------
function renderButton(tokens, { variant, size = 'md', state = 'default', pattern = 'standard' }) {
  const isDisabled = state === 'disabled'
  const isLoading = state === 'loading'
  const isFocus = state === 'focus-visible'
  const isHover = state === 'hover'
  const isActive = state === 'active'
  const isPressed = state === 'pressed'
  const isIconOnly = pattern === 'icon-only'
  const hasIcon = pattern === 'with-icon' || isIconOnly

  const style = { ...buttonStyleForCell(tokens, { axisValues: { variant, size, pattern } }) }

  // State-spezifische Style-Overrides
  if (isHover) {
    style.background = tokens[`nc-button-${variant}-bg-hover`] || style.background
  }
  if (isActive) {
    style.background = tokens[`nc-button-${variant}-bg-active`] || style.background
  }
  if (isDisabled) {
    style.background = tokens['nc-button-disabled-bg']
    style.color = tokens['nc-button-disabled-color']
    style.borderColor = tokens['nc-button-disabled-border']
    style.opacity = tokens['nc-button-opacity-disabled']
    style.cursor = 'not-allowed'
  }
  if (isLoading) {
    style.position = 'relative'
    style.cursor = 'wait'
  }
  if (isFocus) {
    style.outline = `2px solid ${tokens['nc-button-primary-bg'] || '#0066cc'}`
    style.outlineOffset = '2px'
  }
  if (isPressed) {
    style.background = tokens['nc-button-primary-bg'] || '#0066cc'
    style.color = tokens['nc-button-primary-color'] || '#ffffff'
    style.borderColor = tokens['nc-button-primary-bg'] || '#0066cc'
  }

  const label = pattern !== 'standard'
    ? capitalize(pattern.replace('-', ' '))
    : state !== 'default' ? capitalize(state) : capitalize(variant)
  const children = []

  // Icon (leading icon oder icon-only)
  if (hasIcon) {
    children.push(h('span', {
      class: 'arena-button__icon',
      style: iconStyle(tokens, size),
      innerHTML: isIconOnly ? ICON_PLUS : ICON_CHECK
    }))
  }

  // Label (hidden during loading, absent for icon-only)
  if (!isIconOnly) {
    const labelStyle = isLoading ? { visibility: 'hidden' } : {}
    children.push(h('span', { class: 'arena-button__label', style: labelStyle }, label))
  }

  // Spinner fuer Loading
  if (isLoading) {
    children.push(h('span', { class: 'arena-button__spinner', style: {
      position: 'absolute', inset: '0',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}, [h('span', { style: spinnerStyle(tokens, { axisValues: { variant } }) })]))
  }

  return h('button', {
    key: `${variant}-${size}-${state}-${pattern}`,
    class: ['arena-button', isLoading ? 'arena-button--loading' : ''].filter(Boolean).join(' '),
    style,
    ...(isIconOnly ? { 'aria-label': capitalize(variant) } : {}),
    ...(isDisabled ? { disabled: true } : {})
  }, children)
}

// ---------------------------------------------------------------------------
// renderComposition — Button-Group, Toggle, Link
// ---------------------------------------------------------------------------
function renderComposition(tokens, { variant, size = 'md', composition }) {
  if (composition === 'group') {
    const labels = ['Left', 'Center', 'Right']
    return h('div', { key: 'group', class: 'arena-button-group', role: 'group' },
      labels.map((label, i) => {
        const style = { ...buttonStyleForCell(tokens, { axisValues: { variant, size, pattern: 'standard' } }) }
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

  if (composition === 'toggle') {
    const labels = ['Bold', 'Italic', 'Underline']
    return h('div', { key: 'toggle', class: 'arena-button-group', role: 'group' },
      labels.map((label, i) => {
        const pressed = i === 0
        const style = { ...buttonStyleForCell(tokens, { axisValues: { variant, size, pattern: 'standard' } }) }
        if (pressed) {
          style.background = tokens['nc-button-primary-bg'] || '#0066cc'
          style.color = tokens['nc-button-primary-color'] || '#ffffff'
          style.borderColor = tokens['nc-button-primary-bg'] || '#0066cc'
        }
        return h('button', {
          key: label, class: 'arena-button', style,
          'aria-pressed': pressed ? 'true' : 'false'
        }, [
          h('span', {
            class: 'arena-button__icon',
            style: iconStyle(tokens, size),
            innerHTML: TOGGLE_ICONS[label]
          })
        ])
      })
    )
  }

  if (composition === 'link') {
    const style = buttonStyleForCell(tokens, { axisValues: { variant, size, pattern: 'standard' } })
    return h('a', {
      key: 'link', class: 'arena-button', style,
      href: '#', role: 'button',
      onClick: (e) => e.preventDefault()
    }, [
      h('span', { class: 'arena-button__label' }, 'Link as Button')
    ])
  }

  return null
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

/* Button Rows */
.arena-button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* --fnd-spacing-04 */
  align-items: center;
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

/* Button Group */
.arena-button-group {
  display: inline-flex;
}

/* Button Icon */
.arena-button__icon svg {
  width: 100%;
  height: 100%;
}

/* Spinner animation */
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
