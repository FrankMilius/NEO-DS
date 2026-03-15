<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: All States -->
    <div class="arena-category-divider">
      <span class="arena-category-label">All States — MD</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <CheckboxStates :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <CheckboxStates :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <CheckboxStates :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Size Scale -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Size Scale — SM / MD / LG</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <CheckboxSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <CheckboxSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <CheckboxSizes :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Label -->
    <div class="arena-category-divider">
      <span class="arena-category-label">With Label</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <CheckboxWithLabel :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <CheckboxWithLabel :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <CheckboxWithLabel :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Checkbox Group -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Checkbox Group</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <CheckboxGroup :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <CheckboxGroup :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <CheckboxGroup :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('checkbox')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-checkbox-size-sm':              '16px',
  'nc-checkbox-size-md':              '20px',
  'nc-checkbox-size-lg':              '24px',
  'nc-checkbox-radius':               '4px',
  'nc-checkbox-border-width':         '2px',
  'nc-checkbox-bg':                   '#ffffff',
  'nc-checkbox-border':               '#6b7280',
  'nc-checkbox-border-hover':         '#0066cc',
  'nc-checkbox-bg-checked':           '#0066cc',
  'nc-checkbox-border-checked':       '#0066cc',
  'nc-checkbox-bg-indeterminate':     '#0066cc',
  'nc-checkbox-disabled-bg':          '#f3f4f6',
  'nc-checkbox-disabled-border':      '#d1d5db',
  'nc-checkbox-disabled-opacity':     '0.5',
  'nc-checkbox-label-gap':            '12px',
  'nc-checkbox-label-color':          '#1a1a1a',
  'nc-checkbox-border-error':         '#dc2626',
  'nc-checkbox-transition-duration':  '150ms'
}

const TOKEN_REFS = {
  'nc-checkbox-bg':               'background-base',
  'nc-checkbox-border':           'border-strong',
  'nc-checkbox-border-hover':     'interactive-hover',
  'nc-checkbox-bg-checked':       'interactive-default',
  'nc-checkbox-border-checked':   'interactive-default',
  'nc-checkbox-bg-indeterminate': 'interactive-default',
  'nc-checkbox-disabled-bg':      'background-disabled',
  'nc-checkbox-disabled-border':  'border-secondary',
  'nc-checkbox-label-color':      'text-primary',
  'nc-checkbox-border-error':     'border-danger'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'checkbox') || null
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
// Style Builders
// ---------------------------------------------------------------------------
function controlStyle(tokens, { checked = false, indeterminate = false, hover = false, disabled = false, error = false, size = 'md' } = {}) {
  const sizeMap = {
    sm: tokens['nc-checkbox-size-sm'] || '16px',
    md: tokens['nc-checkbox-size-md'] || '20px',
    lg: tokens['nc-checkbox-size-lg'] || '24px'
  }
  const sz = sizeMap[size] || sizeMap.md

  let bg = tokens['nc-checkbox-bg'] || '#ffffff'
  let border = tokens['nc-checkbox-border'] || '#6b7280'

  if (disabled) {
    bg = tokens['nc-checkbox-disabled-bg'] || '#f3f4f6'
    border = tokens['nc-checkbox-disabled-border'] || '#d1d5db'
  } else if (checked || indeterminate) {
    bg = checked
      ? (tokens['nc-checkbox-bg-checked'] || '#0066cc')
      : (tokens['nc-checkbox-bg-indeterminate'] || '#0066cc')
    border = tokens['nc-checkbox-border-checked'] || '#0066cc'
  } else if (hover) {
    border = tokens['nc-checkbox-border-hover'] || '#0066cc'
  } else if (error) {
    border = tokens['nc-checkbox-border-error'] || '#dc2626'
  }

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sz,
    height: sz,
    minWidth: sz,
    borderRadius: tokens['nc-checkbox-radius'] || '4px',
    border: `${tokens['nc-checkbox-border-width'] || '2px'} solid ${border}`,
    background: bg,
    flexShrink: '0',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? (tokens['nc-checkbox-disabled-opacity'] || '0.5') : '1',
    transition: `background ${tokens['nc-checkbox-transition-duration'] || '150ms'} ease, border-color ${tokens['nc-checkbox-transition-duration'] || '150ms'} ease`,
    boxSizing: 'border-box'
  }
}

function labelRowStyle(tokens, { disabled = false } = {}) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens['nc-checkbox-label-gap'] || '12px',
    fontFamily: 'inherit',
    fontSize: '14px',
    color: tokens['nc-checkbox-label-color'] || '#1a1a1a',
    lineHeight: '1.4',
    opacity: disabled ? (tokens['nc-checkbox-disabled-opacity'] || '0.5') : '1',
    cursor: disabled ? 'not-allowed' : 'pointer'
  }
}

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
const svgCheck = h('svg', {
  viewBox: '0 0 14 14',
  fill: 'none',
  stroke: 'white',
  'stroke-width': '2.5',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  style: { width: '10px', height: '10px', display: 'block' }
}, [h('polyline', { points: '2.5 7 5.5 10.5 11.5 3.5' })])

const svgIndeterminate = h('svg', {
  viewBox: '0 0 14 14',
  stroke: 'white',
  'stroke-width': '2.5',
  'stroke-linecap': 'round',
  style: { width: '10px', height: '10px', display: 'block' }
}, [h('line', { x1: '3', y1: '7', x2: '11', y2: '7' })])

function renderCheckbox(tokens, opts = {}) {
  const { checked = false, indeterminate = false } = opts
  const icon = checked ? svgCheck : indeterminate ? svgIndeterminate : null
  return h('span', { style: controlStyle(tokens, opts) }, icon ? [icon] : [])
}

function renderCheckboxWithLabel(tokens, { checked = false, indeterminate = false, disabled = false, label = '', size = 'md' } = {}) {
  const control = h('span', { style: { ...controlStyle(tokens, { checked, indeterminate, disabled, size }), opacity: '1' } },
    checked ? [svgCheck] : indeterminate ? [svgIndeterminate] : []
  )
  return h('label', { style: labelRowStyle(tokens, { disabled }) }, [
    control,
    h('span', {}, label)
  ])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// All States: default, checked, indeterminate, hover, disabled
const CheckboxStates = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const states = [
        { label: 'Default',       checked: false, indeterminate: false, hover: false, disabled: false },
        { label: 'Checked',       checked: true,  indeterminate: false, hover: false, disabled: false },
        { label: 'Indeterminate', checked: false, indeterminate: true,  hover: false, disabled: false },
        { label: 'Hover',         checked: false, indeterminate: false, hover: true,  disabled: false },
        { label: 'Disabled',      checked: false, indeterminate: false, hover: false, disabled: true  }
      ]
      const items = states.map(s =>
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' } }, [
          renderCheckbox(t, s),
          h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } }, s.label)
        ])
      )
      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap' } }, items)
    }
  }
})

// Size Scale: SM / MD / LG × unchecked/checked
const CheckboxSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const rows = [
        { label: 'LG', size: 'lg' },
        { label: 'MD', size: 'md' },
        { label: 'SM', size: 'sm' }
      ]
      const sections = rows.map(({ label, size }) =>
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
          h('span', { style: { fontSize: '11px', fontWeight: '600', minWidth: '24px', color: props.theme['text-secondary'] || '#666' } }, label),
          renderCheckbox(t, { size, checked: false }),
          renderCheckbox(t, { size, checked: true }),
          renderCheckbox(t, { size, indeterminate: true })
        ])
      )
      return h('div', { class: 'arena-preview-stack' }, sections)
    }
  }
})

// With Label: default, checked, disabled
const CheckboxWithLabel = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const items = [
        { label: 'Benachrichtigungen',  checked: false, disabled: false },
        { label: 'Dark Mode aktiviert', checked: true,  disabled: false },
        { label: 'Deaktiviert',         checked: false, disabled: true  }
      ]
      return h('div', { class: 'arena-preview-stack' },
        items.map(item => renderCheckboxWithLabel(t, item))
      )
    }
  }
})

// Checkbox Group: Option A (checked), Option B (unchecked), Option C (disabled)
const CheckboxGroup = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const items = [
        { label: 'Option A', checked: true,  disabled: false },
        { label: 'Option B', checked: false, disabled: false },
        { label: 'Option C', checked: false, disabled: true  }
      ]
      return h('div', { class: 'arena-preview-stack' },
        items.map(item => renderCheckboxWithLabel(t, item))
      )
    }
  }
})
</script>
