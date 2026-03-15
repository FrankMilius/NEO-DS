<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Size Scale -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Size Scale — SM / MD / LG</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SelectSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SelectSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SelectSizes :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: All States -->
    <div class="arena-category-divider">
      <span class="arena-category-label">All States — MD</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SelectStates :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SelectStates :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SelectStates :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, h, defineComponent } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { useArenaHighlight } from '../../composables/useArenaHighlight.js'
import { componentTokenGroups } from '../../data/tokens.js'

const store = useThemeStore()
const { isHighlighted, highlightStyle } = useArenaHighlight('select')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  // Geometry (inherits from input)
  'nc-input-height-sm':        '32px',
  'nc-input-height-md':        '40px',
  'nc-input-height-lg':        '48px',
  'nc-input-padding-x-sm':     '12px',
  'nc-input-padding-x-md':     '16px',
  'nc-input-padding-x-lg':     '20px',
  'nc-input-font-size-sm':     '12px',
  'nc-input-font-size-md':     '14px',
  'nc-input-font-size-lg':     '16px',
  'nc-input-radius':           '6px',
  'nc-input-border-width':     '1px',
  // Select specific
  'nc-select-indicator-size':  '20px',
  'nc-select-indicator-color': '#6b7280',
  'nc-select-padding-right':   '32px',
  // Colors (shared form-control)
  'nc-form-control-bg':           '#ffffff',
  'nc-form-control-color':        '#1a1a1a',
  'nc-form-control-border-color': '#d1d5db',
  'nc-form-control-placeholder-color': '#9ca3af',
  'nc-form-control-border-hover': '#6b7280',
  'nc-form-control-border-focus': '#0066cc',
  'nc-form-control-transition-duration': '150ms',
  // Disabled
  'nc-input-disabled-bg':      '#f3f4f6',
  'nc-input-disabled-color':   '#9ca3af',
  'nc-input-disabled-border':  '#e5e7eb',
  'nc-input-disabled-opacity': '0.6',
}

const TOKEN_REFS = {
  'nc-select-indicator-color':    'text-secondary',
  'nc-form-control-bg':           'background-base',
  'nc-form-control-color':        'text-primary',
  'nc-form-control-border-color': 'border-primary',
  'nc-form-control-border-hover': 'border-strong',
  'nc-form-control-border-focus': 'interactive-default',
  'nc-input-disabled-bg':         'background-disabled',
  'nc-input-disabled-color':      'text-disabled',
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'select') || null
)
const tLight = computed(() => store.state.themes[store.state.activeThemeSet].light)
const tDark = computed(() => store.state.themes[store.state.activeThemeSet].dark)

function resolveToken(semanticMap, tokenId) {
  const override = store.currentComponentOverrides?.value?.[tokenId]
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
  for (const id of Object.keys(TOKEN_DEFAULTS)) {
    all[id] = resolveToken(semanticMap, id)
  }
  return all
}

const tokensLight = computed(() => resolveAll(tLight.value))
const tokensDark = computed(() => resolveAll(tDark.value))

// ---------------------------------------------------------------------------
// 3-Mode Support
// ---------------------------------------------------------------------------
const arenaMode = computed(() => store.state.previewMode)
const isSplit = computed(() => arenaMode.value === 'split')
const activeTokens = computed(() => arenaMode.value === 'dark' ? tokensDark.value : tokensLight.value)
const activeTheme = computed(() => arenaMode.value === 'dark' ? tDark.value : tLight.value)
const activeBg = computed(() =>
  arenaMode.value === 'dark' ? tDark.value['background-base'] : tLight.value['background-secondary']
)

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------

// Chevron Down SVG for the custom select indicator
function chevronDown(color, size = 16) {
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size, height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    style: { pointerEvents: 'none', flexShrink: '0' },
    'aria-hidden': 'true',
  }, [
    h('polyline', { points: '6 9 12 15 18 9' })
  ])
}

// Fake select box built from a div (styled exactly like a select)
function renderFakeSelect(tokens, { size = 'md', state = 'default', text = 'Option auswählen' } = {}) {
  const height = tokens[`nc-input-height-${size}`] || TOKEN_DEFAULTS[`nc-input-height-${size}`]
  const paddingX = tokens[`nc-input-padding-x-${size}`] || TOKEN_DEFAULTS[`nc-input-padding-x-${size}`]
  const fontSize = tokens[`nc-input-font-size-${size}`] || TOKEN_DEFAULTS[`nc-input-font-size-${size}`]
  const radius = tokens['nc-input-radius'] || TOKEN_DEFAULTS['nc-input-radius']
  const borderWidth = tokens['nc-input-border-width'] || '1px'
  const indicatorColor = tokens['nc-select-indicator-color'] || TOKEN_DEFAULTS['nc-select-indicator-color']

  let bg = tokens['nc-form-control-bg'] || TOKEN_DEFAULTS['nc-form-control-bg']
  let color = tokens['nc-form-control-color'] || TOKEN_DEFAULTS['nc-form-control-color']
  let borderColor = tokens['nc-form-control-border-color'] || TOKEN_DEFAULTS['nc-form-control-border-color']
  let opacity = '1'
  let boxShadow = 'none'
  let cursor = 'pointer'

  if (state === 'hover') {
    borderColor = tokens['nc-form-control-border-hover'] || TOKEN_DEFAULTS['nc-form-control-border-hover']
  } else if (state === 'focus') {
    const focusColor = tokens['nc-form-control-border-focus'] || TOKEN_DEFAULTS['nc-form-control-border-focus']
    borderColor = focusColor
    boxShadow = `0 0 0 3px ${focusColor}33`
  } else if (state === 'disabled') {
    bg = tokens['nc-input-disabled-bg'] || TOKEN_DEFAULTS['nc-input-disabled-bg']
    color = tokens['nc-input-disabled-color'] || TOKEN_DEFAULTS['nc-input-disabled-color']
    borderColor = tokens['nc-input-disabled-border'] || TOKEN_DEFAULTS['nc-input-disabled-border']
    opacity = tokens['nc-input-disabled-opacity'] || TOKEN_DEFAULTS['nc-input-disabled-opacity']
    cursor = 'not-allowed'
  }

  const wrapperStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height, paddingInline: paddingX,
    fontSize, fontFamily: 'inherit',
    color, background: bg,
    border: `${borderWidth} solid ${borderColor}`,
    borderRadius: radius,
    boxShadow,
    opacity,
    cursor,
    boxSizing: 'border-box',
    transition: `border-color ${tokens['nc-form-control-transition-duration'] || '150ms'} ease`,
    userSelect: 'none',
    gap: '8px',
  }

  const labelColor = state === 'disabled'
    ? color
    : (tokens['nc-form-control-placeholder-color'] || TOKEN_DEFAULTS['nc-form-control-placeholder-color'])

  return h('div', { style: wrapperStyle }, [
    h('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: labelColor } }, text),
    chevronDown(indicatorColor, 16)
  ])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Size Scale: SM / MD / LG
const SelectSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const sizes = [
        { label: 'SM — 32px', size: 'sm' },
        { label: 'MD — 40px', size: 'md' },
        { label: 'LG — 48px', size: 'lg' },
      ]
      return h('div', { class: 'arena-preview-stack' },
        sizes.map(({ label, size }) =>
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
            h('span', {
              style: { fontSize: '11px', fontWeight: '600', minWidth: '72px', color: props.theme['text-secondary'] || '#666' }
            }, label),
            h('div', { style: { flex: '1' } }, [
              renderFakeSelect(t, { size, state: 'default', text: 'Option auswählen' })
            ])
          ])
        )
      )
    }
  }
})

// All States: Default / Hover / Focus / Disabled
const SelectStates = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const states = [
        { label: 'Default',  state: 'default',  text: 'Option auswählen' },
        { label: 'Hover',    state: 'hover',     text: 'Option auswählen' },
        { label: 'Focus',    state: 'focus',     text: 'Ausgewählt'       },
        { label: 'Disabled', state: 'disabled',  text: 'Deaktiviert'      },
      ]
      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap', alignItems: 'flex-start' } },
        states.map(s =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '140px', flex: '1' } }, [
            renderFakeSelect(t, { size: 'md', state: s.state, text: s.text }),
            h('span', {
              style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666', textAlign: 'center' }
            }, s.label)
          ])
        )
      )
    }
  }
})
</script>
