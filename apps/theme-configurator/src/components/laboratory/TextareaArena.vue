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
          <TextareaSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <TextareaSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <TextareaSizes :tokens="activeTokens" :theme="activeTheme" />
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
          <TextareaStates :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <TextareaStates :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <TextareaStates :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Resize -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Resize Variants — None / Vertical / Both</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <TextareaResize :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <TextareaResize :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <TextareaResize :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('textarea')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  // Geometry
  'nc-textarea-min-height':    '80px',
  'nc-textarea-max-height':    'none',
  'nc-textarea-padding':       '8px 16px',
  'nc-textarea-resize':        'vertical',
  'nc-textarea-scrollbar-width': 'thin',
  // Shared form-control colors
  'nc-form-control-bg':        '#ffffff',
  'nc-form-control-color':     '#1a1a1a',
  'nc-form-control-border-color': '#d1d5db',
  'nc-form-control-radius':    '6px',
  'nc-form-control-border-width': '1px',
  'nc-form-control-placeholder-color': '#9ca3af',
  'nc-form-control-border-hover':  '#6b7280',
  'nc-form-control-border-focus':  '#0066cc',
  'nc-form-control-border-error':  '#dc2626',
  'nc-form-control-transition-duration': '150ms',
  // Disabled
  'nc-input-disabled-bg':      '#f3f4f6',
  'nc-input-disabled-color':   '#9ca3af',
  'nc-input-disabled-border':  '#e5e7eb',
  'nc-input-disabled-opacity': '0.6',
  // Font sizes (inherit from input)
  'nc-input-font-size-sm':     '12px',
  'nc-input-font-size-md':     '14px',
  'nc-input-font-size-lg':     '16px',
}

const TOKEN_REFS = {
  'nc-form-control-bg':           'background-base',
  'nc-form-control-color':        'text-primary',
  'nc-form-control-border-color': 'border-primary',
  'nc-form-control-border-hover': 'border-strong',
  'nc-form-control-border-focus': 'interactive-default',
  'nc-form-control-border-error': 'feedback-danger',
  'nc-input-disabled-bg':         'background-disabled',
  'nc-input-disabled-color':      'text-disabled',
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'textarea') || null
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
function baseTextareaStyle(tokens, minHeight = null) {
  return {
    display: 'block',
    width: '100%',
    minHeight: minHeight || tokens['nc-textarea-min-height'] || TOKEN_DEFAULTS['nc-textarea-min-height'],
    padding: tokens['nc-textarea-padding'] || TOKEN_DEFAULTS['nc-textarea-padding'],
    fontSize: tokens['nc-input-font-size-md'] || TOKEN_DEFAULTS['nc-input-font-size-md'],
    fontFamily: 'inherit',
    lineHeight: '1.6',
    color: tokens['nc-form-control-color'] || TOKEN_DEFAULTS['nc-form-control-color'],
    background: tokens['nc-form-control-bg'] || TOKEN_DEFAULTS['nc-form-control-bg'],
    border: `${tokens['nc-form-control-border-width'] || '1px'} solid ${tokens['nc-form-control-border-color'] || TOKEN_DEFAULTS['nc-form-control-border-color']}`,
    borderRadius: tokens['nc-form-control-radius'] || TOKEN_DEFAULTS['nc-form-control-radius'],
    outline: 'none',
    boxSizing: 'border-box',
    resize: tokens['nc-textarea-resize'] || TOKEN_DEFAULTS['nc-textarea-resize'],
    transition: `border-color ${tokens['nc-form-control-transition-duration'] || '150ms'} ease`,
  }
}

function textareaStateStyle(tokens, state = 'default') {
  const base = baseTextareaStyle(tokens)
  if (state === 'focus') {
    const focusColor = tokens['nc-form-control-border-focus'] || TOKEN_DEFAULTS['nc-form-control-border-focus']
    return { ...base, borderColor: focusColor, boxShadow: `0 0 0 3px ${focusColor}33` }
  }
  if (state === 'error') {
    return { ...base, borderColor: tokens['nc-form-control-border-error'] || TOKEN_DEFAULTS['nc-form-control-border-error'] }
  }
  if (state === 'disabled') {
    return {
      ...base,
      background: tokens['nc-input-disabled-bg'] || TOKEN_DEFAULTS['nc-input-disabled-bg'],
      color: tokens['nc-input-disabled-color'] || TOKEN_DEFAULTS['nc-input-disabled-color'],
      borderColor: tokens['nc-input-disabled-border'] || TOKEN_DEFAULTS['nc-input-disabled-border'],
      opacity: tokens['nc-input-disabled-opacity'] || TOKEN_DEFAULTS['nc-input-disabled-opacity'],
      cursor: 'not-allowed',
      resize: 'none',
    }
  }
  return base
}

function stateLabel(theme, text) {
  return h('span', {
    style: { fontSize: '11px', color: theme['text-secondary'] || '#666', marginTop: '4px', display: 'block', textAlign: 'center' }
  }, text)
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Size Scale: SM / MD / LG — different min-heights and font sizes
const TextareaSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const sizes = [
        { label: 'SM — 60px',  minHeight: '60px',  fontSize: t['nc-input-font-size-sm'] || TOKEN_DEFAULTS['nc-input-font-size-sm'] },
        { label: 'MD — 80px',  minHeight: '80px',  fontSize: t['nc-input-font-size-md'] || TOKEN_DEFAULTS['nc-input-font-size-md'] },
        { label: 'LG — 120px', minHeight: '120px', fontSize: t['nc-input-font-size-lg'] || TOKEN_DEFAULTS['nc-input-font-size-lg'] },
      ]
      return h('div', { class: 'arena-preview-stack' },
        sizes.map(({ label, minHeight, fontSize }) =>
          h('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px' } }, [
            h('span', {
              style: { fontSize: '11px', fontWeight: '600', minWidth: '80px', color: props.theme['text-secondary'] || '#666', paddingTop: '8px' }
            }, label),
            h('div', { style: { flex: '1' } }, [
              h('textarea', {
                placeholder: 'Placeholder-Text…',
                style: { ...baseTextareaStyle(t, minHeight), fontSize }
              })
            ])
          ])
        )
      )
    }
  }
})

// All States
const TextareaStates = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const states = [
        { label: 'Default',  state: 'default',  placeholder: 'Placeholder…', value: '',                  disabled: false },
        { label: 'Focus',    state: 'focus',     placeholder: '',              value: 'Fokussiert…',       disabled: false },
        { label: 'Error',    state: 'error',     placeholder: '',              value: 'Fehlerhafte Eingabe', disabled: false },
        { label: 'Disabled', state: 'disabled',  placeholder: 'Deaktiviert',  value: '',                  disabled: true  },
      ]
      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap', alignItems: 'flex-start' } },
        states.map(s =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '140px', flex: '1' } }, [
            h('textarea', {
              placeholder: s.placeholder,
              disabled: s.disabled,
              style: textareaStateStyle(t, s.state)
            }, s.value),
            stateLabel(props.theme, s.label)
          ])
        )
      )
    }
  }
})

// Resize Variants
const TextareaResize = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const variants = [
        { label: 'None',     resize: 'none'     },
        { label: 'Vertical', resize: 'vertical' },
        { label: 'Both',     resize: 'both'     },
      ]
      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap', alignItems: 'flex-start' } },
        variants.map(v =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '160px', flex: '1' } }, [
            h('textarea', {
              placeholder: 'Hier Text eingeben…',
              style: { ...baseTextareaStyle(t), resize: v.resize }
            }),
            h('span', {
              style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666', textAlign: 'center' }
            }, `Resize: ${v.label}`)
          ])
        )
      )
    }
  }
})
</script>
