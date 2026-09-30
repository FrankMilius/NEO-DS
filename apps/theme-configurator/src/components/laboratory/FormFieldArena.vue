<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default — Label + Input + Hint</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <FormFieldDefault :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <FormFieldDefault :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <FormFieldDefault :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Error State -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Error State</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <FormFieldError :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <FormFieldError :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <FormFieldError :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Success State -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Success State</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <FormFieldSuccess :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <FormFieldSuccess :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <FormFieldSuccess :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Required + Disabled -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Required / Disabled</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <FormFieldVariants :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <FormFieldVariants :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <FormFieldVariants :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('form-field')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-form-field-gap':          '4px',
  'nc-form-label-font-size':    '14px',
  'nc-form-label-font-weight':  '600',
  'nc-form-label-color':        '#1a1a1a',
  'nc-form-label-gap':          '8px',
  'nc-input-height-md':         '40px',
  'nc-input-padding-x-md':      '16px',
  'nc-input-padding-y-md':      '8px',
  'nc-input-font-size-md':      '16px',
  'nc-input-radius':            '4px',
  'nc-input-border-width':      '1px',
  'nc-input-bg':                '#ffffff',
  'nc-input-color':             '#1a1a1a',
  'nc-input-border':            '#d1d5db',
  'nc-input-placeholder':       '#9ca3af',
  'nc-input-border-hover':      '#6b7280',
  'nc-input-border-focus':      '#0066cc',
  'nc-input-border-error':      '#dc2626',
  'nc-input-border-success':    '#16a34a',
  'nc-input-disabled-bg':       '#f3f4f6',
  'nc-input-disabled-color':    '#9ca3af',
  'nc-input-disabled-border':   '#e5e7eb',
  'nc-input-disabled-opacity':  '0.5',
  'nc-form-hint-font-size':     '12px',
  'nc-form-hint-color':         '#6b7280',
  'nc-form-hint-color-error':   '#dc2626',
  'nc-form-hint-color-success': '#16a34a'
}

const TOKEN_REFS = {
  'nc-form-label-color':        'text-primary',
  'nc-input-bg':                'background-base',
  'nc-input-color':             'text-primary',
  'nc-input-border':            'border-primary',
  'nc-input-placeholder':       'text-tertiary',
  'nc-input-border-hover':      'border-strong',
  'nc-input-border-focus':      'interactive-focus',
  'nc-input-border-error':      'border-danger',
  'nc-input-border-success':    'border-success',
  'nc-input-disabled-bg':       'background-disabled',
  'nc-input-disabled-color':    'text-disabled',
  'nc-input-disabled-border':   'border-secondary',
  'nc-form-hint-color':         'text-secondary',
  'nc-form-hint-color-error':   'text-danger',
  'nc-form-hint-color-success': 'text-success'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'form-field') || null
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
function fieldWrapStyle(tokens) {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens['nc-form-field-gap'],
    width: '280px',
    fontFamily: 'inherit'
  }
}

function labelStyle(tokens, { required = false } = {}) {
  return {
    fontSize: tokens['nc-form-label-font-size'],
    fontWeight: tokens['nc-form-label-font-weight'],
    color: tokens['nc-form-label-color'],
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    lineHeight: '1.4'
  }
}

function inputStyle(tokens, { state = 'default', disabled = false } = {}) {
  let borderColor = tokens['nc-input-border']
  let bg = tokens['nc-input-bg']
  let color = tokens['nc-input-color']
  let opacity = '1'
  if (state === 'error') borderColor = tokens['nc-input-border-error']
  else if (state === 'success') borderColor = tokens['nc-input-border-success']
  if (disabled) {
    bg = tokens['nc-input-disabled-bg']
    color = tokens['nc-input-disabled-color']
    borderColor = tokens['nc-input-disabled-border']
    opacity = tokens['nc-input-disabled-opacity']
  }
  return {
    display: 'block',
    width: '100%',
    height: tokens['nc-input-height-md'],
    padding: `${tokens['nc-input-padding-y-md']} ${tokens['nc-input-padding-x-md']}`,
    borderRadius: tokens['nc-input-radius'],
    border: `${tokens['nc-input-border-width']} solid ${borderColor}`,
    background: bg,
    color,
    fontSize: tokens['nc-input-font-size-md'],
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: disabled ? 'not-allowed' : 'text',
    opacity
  }
}

function hintStyle(tokens, { tone = 'default' } = {}) {
  let color = tokens['nc-form-hint-color']
  if (tone === 'error') color = tokens['nc-form-hint-color-error']
  else if (tone === 'success') color = tokens['nc-form-hint-color-success']
  return {
    fontSize: tokens['nc-form-hint-font-size'],
    color,
    lineHeight: '1.4',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  }
}

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
function renderField(tokens, { labelText, placeholder, hint, hintTone, state, disabled, required } = {}) {
  const labelNode = h('label', { style: labelStyle(tokens) }, [
    labelText,
    required ? h('span', { style: { color: tokens['nc-form-hint-color-error'] || '#dc2626', marginLeft: '2px' } }, '*') : null
  ])
  const inputNode = h('input', {
    type: 'text',
    placeholder: placeholder || '',
    disabled: disabled || false,
    style: inputStyle(tokens, { state: state || 'default', disabled: disabled || false })
  })
  const hintNode = hint
    ? h('span', { style: hintStyle(tokens, { tone: hintTone || 'default' }) }, hint)
    : null
  return h('div', { style: fieldWrapStyle(tokens) }, [labelNode, inputNode, hintNode].filter(Boolean))
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

const FormFieldDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => renderField(props.tokens, {
      labelText: 'Email address',
      placeholder: 'you@example.com',
      hint: 'We\'ll never share your email.'
    })
  }
})

const FormFieldError = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => renderField(props.tokens, {
      labelText: 'Username',
      placeholder: 'johndoe',
      hint: 'Username is already taken.',
      hintTone: 'error',
      state: 'error'
    })
  }
})

const FormFieldSuccess = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => renderField(props.tokens, {
      labelText: 'Password',
      placeholder: '••••••••',
      hint: 'Password strength: Strong',
      hintTone: 'success',
      state: 'success'
    })
  }
})

const FormFieldVariants = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const requiredField = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } }, [
        h('span', { style: { fontSize: '11px', fontWeight: '600', color: props.theme['text-secondary'] || '#666' } }, 'Required'),
        renderField(t, { labelText: 'Full Name', placeholder: 'Jane Doe', required: true })
      ])
      const disabledField = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } }, [
        h('span', { style: { fontSize: '11px', fontWeight: '600', color: props.theme['text-secondary'] || '#666' } }, 'Disabled'),
        renderField(t, { labelText: 'Account ID', placeholder: 'ACC-12345', disabled: true, hint: 'Read-only field' })
      ])
      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap', alignItems: 'flex-start', gap: '24px' } }, [
        requiredField, disabledField
      ])
    }
  }
})
</script>
