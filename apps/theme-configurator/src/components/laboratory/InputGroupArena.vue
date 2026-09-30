<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Content Variants -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Content Variants</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <InputGroupContent :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <InputGroupContent :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <InputGroupContent :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Size Variants -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Size Variants — SM / MD / LG</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <InputGroupSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <InputGroupSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <InputGroupSizes :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Validation States -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Validation States</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <InputGroupValidation :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <InputGroupValidation :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <InputGroupValidation :tokens="activeTokens" :theme="activeTheme" />
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
import { useTokenResolver } from '../../composables/useTokenResolver.js'

const store = useThemeStore()
const { isHighlighted, highlightStyle } = useArenaHighlight('input-group')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-input-group-height-md':          '40px',
  'nc-input-group-height-sm':          '32px',
  'nc-input-group-height-lg':          '48px',
  'nc-input-group-radius':             '6px',
  'nc-input-group-border-width':       '1px',
  'nc-input-group-addon-bg':           '#f1f5f9',
  'nc-input-group-addon-color':        '#64748b',
  'nc-input-group-addon-border':       '#cbd5e1',
  'nc-input-group-addon-padding-x':    '12px',
  'nc-input-group-addon-font-size':    '14px',
  'nc-input-group-addon-hover-bg':     '#e2e8f0',
  'nc-input-group-addon-active-bg':    '#d1d9e6',
  'nc-input-group-inner-radius':       '0px',
  'nc-input-group-addon-border-error': '#dc2626',
  'nc-input-group-addon-border-success': '#16a34a'
}

const TOKEN_REFS = {
  'nc-input-group-addon-bg':           'background-secondary',
  'nc-input-group-addon-color':        'text-secondary',
  'nc-input-group-addon-border':       'border-primary',
  'nc-input-group-addon-hover-bg':     'background-tertiary',
  'nc-input-group-addon-border-error': 'feedback-danger',
  'nc-input-group-addon-border-success': 'feedback-success'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'input-group') || null
)
const tLight = computed(() => store.state.themes[store.state.activeThemeSet].light)
const tDark = computed(() => store.state.themes[store.state.activeThemeSet].dark)

// Aufloesung zentral: composables/useTokenResolver.js (Plan v2, 3.1)
const { resolveToken } = useTokenResolver({ store, componentData, refs: TOKEN_REFS, defaults: TOKEN_DEFAULTS })

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
function groupStyle(tokens, { borderColor = null } = {}) {
  const border = borderColor || tokens['nc-input-group-addon-border'] || '#cbd5e1'
  return {
    display: 'flex',
    width: '100%',
    maxWidth: '320px',
    border: `${tokens['nc-input-group-border-width'] || '1px'} solid ${border}`,
    borderRadius: tokens['nc-input-group-radius'] || '6px',
    overflow: 'hidden',
    boxSizing: 'border-box'
  }
}

function addonStyle(tokens, { side = 'leading', borderColor = null, height = null } = {}) {
  const border = borderColor || tokens['nc-input-group-addon-border'] || '#cbd5e1'
  const h_ = height || tokens['nc-input-group-height-md'] || '40px'
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: h_,
    padding: `0 ${tokens['nc-input-group-addon-padding-x'] || '12px'}`,
    background: tokens['nc-input-group-addon-bg'] || '#f1f5f9',
    color: tokens['nc-input-group-addon-color'] || '#64748b',
    fontSize: tokens['nc-input-group-addon-font-size'] || '14px',
    borderRight: side === 'leading' ? `1px solid ${border}` : 'none',
    borderLeft: side === 'trailing' ? `1px solid ${border}` : 'none',
    whiteSpace: 'nowrap',
    flexShrink: '0',
    lineHeight: '1'
  }
}

function inputStyle(tokens, { height = null } = {}) {
  const h_ = height || tokens['nc-input-group-height-md'] || '40px'
  return {
    flex: '1',
    height: h_,
    padding: '0 10px',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'inherit',
    fontSize: tokens['nc-input-group-addon-font-size'] || '14px',
    minWidth: '0',
    fontFamily: 'inherit'
  }
}

function buttonAddonStyle(tokens) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: tokens['nc-input-group-height-md'] || '40px',
    padding: `0 ${tokens['nc-input-group-addon-padding-x'] || '12px'}`,
    background: tokens['nc-input-group-addon-color'] ? '#0066cc' : '#0066cc',
    color: '#ffffff',
    fontSize: tokens['nc-input-group-addon-font-size'] || '14px',
    border: 'none',
    cursor: 'pointer',
    flexShrink: '0',
    lineHeight: '1',
    fontFamily: 'inherit',
    fontWeight: '500'
  }
}

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
function renderInputGroup(tokens, { leading = null, trailing = null, placeholder = '', borderColor = null, height = null } = {}) {
  const children = []
  if (leading) children.push(h('span', { style: addonStyle(tokens, { side: 'leading', borderColor, height }) }, leading))
  children.push(h('input', {
    type: 'text',
    placeholder,
    style: { ...inputStyle(tokens, { height }), background: tokens['surface-elevated'] || 'transparent' },
    disabled: true
  }))
  if (trailing) children.push(h('span', { style: addonStyle(tokens, { side: 'trailing', borderColor, height }) }, trailing))
  return h('div', { style: groupStyle(tokens, { borderColor }) }, children)
}

function renderButtonGroup(tokens, { placeholder = '', buttonLabel = 'Search' } = {}) {
  return h('div', { style: groupStyle(tokens) }, [
    h('input', {
      type: 'text',
      placeholder,
      style: { ...inputStyle(tokens), background: 'transparent' },
      disabled: true
    }),
    h('button', { style: buttonAddonStyle(tokens), disabled: true }, buttonLabel)
  ])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Content Variants: leading text, trailing icon, both, button
const InputGroupContent = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const labelStyle = { fontSize: '11px', color: props.theme['text-secondary'] || '#666', marginBottom: '4px' }
      const rows = [
        {
          label: 'Leading Text Addon',
          node: renderInputGroup(t, { leading: 'https://', placeholder: 'domain.com' })
        },
        {
          label: 'Trailing Icon Addon',
          node: renderInputGroup(t, { trailing: '🔍', placeholder: 'Search...' })
        },
        {
          label: 'Leading + Trailing',
          node: renderInputGroup(t, { leading: '$', trailing: '.00', placeholder: '0.00' })
        },
        {
          label: 'Button Addon',
          node: renderButtonGroup(t, { placeholder: 'Enter keyword', buttonLabel: 'Search' })
        }
      ]
      return h('div', { class: 'arena-preview-stack' },
        rows.map(({ label, node }) =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, [
            h('span', { style: labelStyle }, label),
            node
          ])
        )
      )
    }
  }
})

// Size Variants: SM / MD / LG
const InputGroupSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const sizes = [
        { label: 'SM', heightKey: 'nc-input-group-height-sm' },
        { label: 'MD', heightKey: 'nc-input-group-height-md' },
        { label: 'LG', heightKey: 'nc-input-group-height-lg' }
      ]
      return h('div', { class: 'arena-preview-stack' },
        sizes.map(({ label, heightKey }) =>
          h('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px' } }, [
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px', flex: '1' } }, [
              renderInputGroup(t, { leading: 'https://', placeholder: 'domain.com', height: t[heightKey] }),
              h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } },
                `${label} — ${t[heightKey] || TOKEN_DEFAULTS[heightKey]}`
              )
            ])
          ])
        )
      )
    }
  }
})

// Validation States: Default / Error / Success
const InputGroupValidation = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const states = [
        { label: 'Default', trailing: null, borderColor: null },
        { label: 'Error',   trailing: '!', borderColor: t['nc-input-group-addon-border-error'] || '#dc2626' },
        { label: 'Success', trailing: '✓', borderColor: t['nc-input-group-addon-border-success'] || '#16a34a' }
      ]
      return h('div', { class: 'arena-preview-stack' },
        states.map(({ label, trailing, borderColor }) =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, [
            h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } }, label),
            renderInputGroup(t, { leading: 'User', trailing, placeholder: 'username', borderColor })
          ])
        )
      )
    }
  }
})
</script>
