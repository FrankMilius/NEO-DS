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
          <RadioStates :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <RadioStates :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <RadioStates :tokens="activeTokens" :theme="activeTheme" />
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
          <RadioSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <RadioSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <RadioSizes :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Radio Group -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Radio Group</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <RadioGroup :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <RadioGroup :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <RadioGroup :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('radio')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-radio-size-sm':             '16px',
  'nc-radio-size-md':             '20px',
  'nc-radio-size-lg':             '24px',
  'nc-radio-border-width':        '2px',
  'nc-radio-bg':                  '#ffffff',
  'nc-radio-border':              '#6b7280',
  'nc-radio-border-hover':        '#0066cc',
  'nc-radio-bg-checked':          '#0066cc',
  'nc-radio-border-checked':      '#0066cc',
  'nc-radio-dot-color':           '#ffffff',
  'nc-radio-dot-scale':           '0.4',
  'nc-radio-disabled-bg':         '#f3f4f6',
  'nc-radio-disabled-border':     '#d1d5db',
  'nc-radio-disabled-opacity':    '0.5',
  'nc-radio-label-gap':           '12px',
  'nc-radio-label-color':         '#1a1a1a',
  'nc-radio-border-error':        '#dc2626',
  'nc-radio-transition-duration': '150ms'
}

const TOKEN_REFS = {
  'nc-radio-bg':              'background-base',
  'nc-radio-border':          'border-strong',
  'nc-radio-border-hover':    'interactive-hover',
  'nc-radio-bg-checked':      'interactive-default',
  'nc-radio-border-checked':  'interactive-default',
  'nc-radio-dot-color':       'text-on-interactive',
  'nc-radio-disabled-bg':     'background-disabled',
  'nc-radio-disabled-border': 'border-secondary',
  'nc-radio-label-color':     'text-primary',
  'nc-radio-border-error':    'border-danger'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'radio') || null
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
function controlStyle(tokens, { checked = false, hover = false, disabled = false, error = false, size = 'md' } = {}) {
  const sizeMap = {
    sm: tokens['nc-radio-size-sm'] || '16px',
    md: tokens['nc-radio-size-md'] || '20px',
    lg: tokens['nc-radio-size-lg'] || '24px'
  }
  const sz = sizeMap[size] || sizeMap.md

  let bg = tokens['nc-radio-bg'] || '#ffffff'
  let border = tokens['nc-radio-border'] || '#6b7280'

  if (disabled) {
    bg = tokens['nc-radio-disabled-bg'] || '#f3f4f6'
    border = tokens['nc-radio-disabled-border'] || '#d1d5db'
  } else if (checked) {
    bg = tokens['nc-radio-bg-checked'] || '#0066cc'
    border = tokens['nc-radio-border-checked'] || '#0066cc'
  } else if (hover) {
    border = tokens['nc-radio-border-hover'] || '#0066cc'
  } else if (error) {
    border = tokens['nc-radio-border-error'] || '#dc2626'
  }

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sz,
    height: sz,
    minWidth: sz,
    borderRadius: '50%',
    border: `${tokens['nc-radio-border-width'] || '2px'} solid ${border}`,
    background: bg,
    flexShrink: '0',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? (tokens['nc-radio-disabled-opacity'] || '0.5') : '1',
    transition: `background ${tokens['nc-radio-transition-duration'] || '150ms'} ease, border-color ${tokens['nc-radio-transition-duration'] || '150ms'} ease`,
    boxSizing: 'border-box',
    position: 'relative'
  }
}

function dotStyle(tokens, { size = 'md' } = {}) {
  const sizeMap = {
    sm: tokens['nc-radio-size-sm'] || '16px',
    md: tokens['nc-radio-size-md'] || '20px',
    lg: tokens['nc-radio-size-lg'] || '24px'
  }
  const parentSz = parseInt(sizeMap[size] || '20', 10)
  const scale = parseFloat(tokens['nc-radio-dot-scale'] || '0.4')
  const dotSz = `${Math.round(parentSz * scale)}px`

  return {
    width: dotSz,
    height: dotSz,
    borderRadius: '50%',
    background: tokens['nc-radio-dot-color'] || '#ffffff',
    display: 'block',
    flexShrink: '0'
  }
}

function labelRowStyle(tokens, { disabled = false } = {}) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens['nc-radio-label-gap'] || '12px',
    fontFamily: 'inherit',
    fontSize: '14px',
    color: tokens['nc-radio-label-color'] || '#1a1a1a',
    lineHeight: '1.4',
    opacity: disabled ? (tokens['nc-radio-disabled-opacity'] || '0.5') : '1',
    cursor: disabled ? 'not-allowed' : 'pointer'
  }
}

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
function renderRadio(tokens, opts = {}) {
  const { checked = false } = opts
  const dot = checked ? h('span', { style: dotStyle(tokens, opts) }) : null
  return h('span', { style: controlStyle(tokens, opts) }, dot ? [dot] : [])
}

function renderRadioWithLabel(tokens, { checked = false, disabled = false, label = '', size = 'md' } = {}) {
  const control = h('span', { style: { ...controlStyle(tokens, { checked, disabled, size }), opacity: '1' } },
    checked ? [h('span', { style: dotStyle(tokens, { size }) })] : []
  )
  return h('label', { style: labelRowStyle(tokens, { disabled }) }, [
    control,
    h('span', {}, label)
  ])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// All States: default, checked, hover, disabled
const RadioStates = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const states = [
        { label: 'Default',  checked: false, hover: false, disabled: false },
        { label: 'Checked',  checked: true,  hover: false, disabled: false },
        { label: 'Hover',    checked: false, hover: true,  disabled: false },
        { label: 'Disabled', checked: false, hover: false, disabled: true  }
      ]
      const items = states.map(s =>
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' } }, [
          renderRadio(t, s),
          h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } }, s.label)
        ])
      )
      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap' } }, items)
    }
  }
})

// Size Scale: SM / MD / LG × unchecked/checked
const RadioSizes = defineComponent({
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
          renderRadio(t, { size, checked: false }),
          renderRadio(t, { size, checked: true })
        ])
      )
      return h('div', { class: 'arena-preview-stack' }, sections)
    }
  }
})

// Radio Group: Option A (selected), Option B (unselected), Option C (disabled)
const RadioGroup = defineComponent({
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
        items.map(item => renderRadioWithLabel(t, item))
      )
    }
  }
})
</script>
