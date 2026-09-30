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
          <SwitchStates :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SwitchStates :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SwitchStates :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Size Scale -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Size Scale — MD / SM</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SwitchSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SwitchSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SwitchSizes :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Track Indicators -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Track Indicators (I/O)</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SwitchIndicators :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SwitchIndicators :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SwitchIndicators :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Label -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Switch mit Label</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SwitchWithLabel :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SwitchWithLabel :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SwitchWithLabel :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Disabled States -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Disabled States</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SwitchDisabled :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SwitchDisabled :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SwitchDisabled :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('switch')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-switch-width':                   '44px',
  'nc-switch-height':                  '24px',
  'nc-switch-radius':                  '9999px',
  'nc-switch-bg':                      '#d1d5db',
  'nc-switch-bg-hover':                '#9ca3af',
  'nc-switch-bg-checked':              '#0066cc',
  'nc-switch-thumb-size':              '18px',
  'nc-switch-thumb-color':             '#ffffff',
  'nc-switch-thumb-offset':            '3px',
  'nc-switch-thumb-shadow':            '0 1px 3px rgba(0,0,0,0.2)',
  'nc-switch-disabled-bg':             '#e5e7eb',
  'nc-switch-disabled-thumb':          '#9ca3af',
  'nc-switch-disabled-opacity':        '0.5',
  'nc-switch-label-gap':               '8px',
  'nc-switch-label-color':             '#1a1a1a',
  'nc-switch-indicator-color':         '#6b7280',
  'nc-switch-indicator-checked-color': '#ffffff',
  'nc-switch-transition-duration':     '150ms'
}

const TOKEN_REFS = {
  'nc-switch-bg':                      'background-secondary',
  'nc-switch-bg-hover':                'border-primary',
  'nc-switch-bg-checked':              'interactive-default',
  'nc-switch-thumb-color':             'background-base',
  'nc-switch-disabled-bg':             'background-disabled',
  'nc-switch-label-color':             'text-primary'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'switch') || null
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
function trackStyle(tokens, { checked = false, disabled = false, hover = false, size = 'md' } = {}) {
  const w = size === 'sm' ? '36px' : (tokens['nc-switch-width'] || '44px')
  const h_ = size === 'sm' ? '20px' : (tokens['nc-switch-height'] || '24px')
  let bg = tokens['nc-switch-bg'] || '#d1d5db'
  if (checked) bg = tokens['nc-switch-bg-checked'] || '#0066cc'
  else if (disabled) bg = tokens['nc-switch-disabled-bg'] || '#e5e7eb'
  else if (hover) bg = tokens['nc-switch-bg-hover'] || '#9ca3af'
  return {
    display: 'inline-flex', alignItems: 'center', position: 'relative',
    width: w, height: h_,
    borderRadius: tokens['nc-switch-radius'] || '9999px',
    background: bg,
    flexShrink: '0',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? (tokens['nc-switch-disabled-opacity'] || '0.5') : '1',
    transition: `background ${tokens['nc-switch-transition-duration'] || '150ms'} ease`
  }
}

function thumbStyle(tokens, { checked = false, disabled = false, size = 'md' } = {}) {
  const sz = size === 'sm' ? '15px' : (tokens['nc-switch-thumb-size'] || '18px')
  const offset = tokens['nc-switch-thumb-offset'] || '3px'
  const color = disabled
    ? (tokens['nc-switch-disabled-thumb'] || '#9ca3af')
    : (tokens['nc-switch-thumb-color'] || '#ffffff')
  return {
    position: 'absolute', top: '50%',
    width: sz, height: sz,
    borderRadius: '50%',
    background: color,
    transform: 'translateY(-50%)',
    left: checked ? `calc(100% - ${sz} - ${offset})` : offset,
    transition: `left ${tokens['nc-switch-transition-duration'] || '150ms'} ease`,
    boxShadow: tokens['nc-switch-thumb-shadow'] || '0 1px 3px rgba(0,0,0,0.2)'
  }
}

function labelRowStyle(tokens) {
  return {
    display: 'inline-flex', alignItems: 'center',
    gap: tokens['nc-switch-label-gap'] || '8px',
    fontFamily: 'inherit', fontSize: '14px',
    color: tokens['nc-switch-label-color'] || '#1a1a1a',
    lineHeight: '1.4'
  }
}

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
function renderSwitch(tokens, opts = {}) {
  const thumb = h('span', { style: thumbStyle(tokens, opts) })
  return h('span', { style: trackStyle(tokens, opts) }, [thumb])
}

function renderSwitchWithLabel(tokens, { checked = false, disabled = false, label = '' } = {}) {
  const track = renderSwitch(tokens, { checked, disabled })
  return h('label', { style: { ...labelRowStyle(tokens), opacity: disabled ? (tokens['nc-switch-disabled-opacity'] || '0.5') : '1' } }, [
    track,
    h('span', {}, label)
  ])
}

function renderIndicatorSwitch(tokens, { checked = false } = {}) {
  const thumb = h('span', { style: thumbStyle(tokens, { checked }) })
  // I/O indicator labels
  const indicatorStyle = (visible) => ({
    position: 'absolute',
    fontSize: '10px',
    fontWeight: '700',
    lineHeight: '1',
    color: checked
      ? (tokens['nc-switch-indicator-checked-color'] || '#ffffff')
      : (tokens['nc-switch-indicator-color'] || '#6b7280'),
    opacity: visible ? '1' : '0',
    transition: `opacity ${tokens['nc-switch-transition-duration'] || '150ms'} ease`,
    userSelect: 'none',
    pointerEvents: 'none'
  })
  const labelOn = h('span', {
    style: { ...indicatorStyle(checked), left: '6px' }
  }, 'I')
  const labelOff = h('span', {
    style: { ...indicatorStyle(!checked), right: '6px' }
  }, 'O')
  return h('span', { style: trackStyle(tokens, { checked }) }, [labelOn, labelOff, thumb])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// All States: Off | Hover | Checked | Disabled
const SwitchStates = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const states = [
        { label: 'Off',      checked: false, hover: false, disabled: false },
        { label: 'Hover',    checked: false, hover: true,  disabled: false },
        { label: 'Checked',  checked: true,  hover: false, disabled: false },
        { label: 'Disabled', checked: false, hover: false, disabled: true  }
      ]
      const items = states.map(s =>
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' } }, [
          renderSwitch(t, s),
          h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } }, s.label)
        ])
      )
      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap' } }, items)
    }
  }
})

// Size Scale: MD vs SM × Off/Checked
const SwitchSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const rows = [
        { label: 'MD', size: 'md' },
        { label: 'SM', size: 'sm' }
      ]
      const sections = rows.map(({ label, size }) =>
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
          h('span', { style: { fontSize: '11px', fontWeight: '600', minWidth: '24px', color: props.theme['text-secondary'] || '#666' } }, label),
          renderSwitch(t, { size, checked: false }),
          renderSwitch(t, { size, checked: true })
        ])
      )
      return h('div', { class: 'arena-preview-stack' }, sections)
    }
  }
})

// Track Indicators: without vs with I/O labels
const SwitchIndicators = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      return h('div', { class: 'arena-preview-stack' }, [
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, [
          h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } }, 'Ohne Indikatoren'),
          h('div', { class: 'arena-btn-row' }, [
            renderSwitch(t, { checked: false }),
            renderSwitch(t, { checked: true })
          ])
        ]),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, [
          h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } }, 'Mit Indikatoren (I/O)'),
          h('div', { class: 'arena-btn-row' }, [
            renderIndicatorSwitch(t, { checked: false }),
            renderIndicatorSwitch(t, { checked: true })
          ])
        ])
      ])
    }
  }
})

// With Label
const SwitchWithLabel = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const items = [
        { label: 'Benachrichtigungen',   checked: false, disabled: false },
        { label: 'Dark Mode aktiviert',  checked: true,  disabled: false },
        { label: 'Deaktiviert',          checked: false, disabled: true  }
      ]
      return h('div', { class: 'arena-preview-stack' },
        items.map(item => renderSwitchWithLabel(t, item))
      )
    }
  }
})

// Disabled: unchecked + checked
const SwitchDisabled = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const items = [
        { label: 'Disabled Off',  checked: false, disabled: true },
        { label: 'Disabled On',   checked: true,  disabled: true }
      ]
      return h('div', { class: 'arena-btn-row' },
        items.map(item =>
          h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' } }, [
            renderSwitch(t, item),
            h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } }, item.label)
          ])
        )
      )
    }
  }
})
</script>
