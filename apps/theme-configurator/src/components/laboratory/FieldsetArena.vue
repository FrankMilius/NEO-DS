<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default — Legend + Form Fields</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <FieldsetDefault :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <FieldsetDefault :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <FieldsetDefault :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Card Variant -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Card Variant</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <FieldsetCard :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <FieldsetCard :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <FieldsetCard :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Density -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Compact / Loose Density</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <FieldsetDensity :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <FieldsetDensity :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <FieldsetDensity :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('fieldset')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-fieldset-border-width':       '1px',
  'nc-fieldset-border-color':       '#e5e7eb',
  'nc-fieldset-border-radius':      '4px',
  'nc-fieldset-padding':            '24px',
  'nc-fieldset-gap':                '16px',
  'nc-fieldset-legend-size':        '16px',
  'nc-fieldset-legend-weight':      '600',
  'nc-fieldset-legend-color':       '#1a1a1a',
  'nc-fieldset-legend-padding':     '8px',
  'nc-fieldset-helper-size':        '14px',
  'nc-fieldset-helper-color':       '#6b7280',
  'nc-fieldset-helper-margin-top':  '-4px',
  'nc-fieldset-card-bg':            '#f9fafb',
  'nc-fieldset-card-shadow':        '0 1px 3px rgba(0,0,0,0.06)',
  'nc-fieldset-padding-compact':    '16px',
  'nc-fieldset-gap-compact':        '12px',
  'nc-fieldset-padding-loose':      '32px',
  'nc-fieldset-gap-loose':          '24px',
  'nc-fieldset-required-color':     '#dc2626',
  // Input/label tokens for inline fields
  'nc-input-bg':                    '#ffffff',
  'nc-input-color':                 '#1a1a1a',
  'nc-input-border':                '#d1d5db',
  'nc-input-radius':                '4px',
  'nc-input-border-width':          '1px',
  'nc-input-height-md':             '40px',
  'nc-input-padding-x-md':          '16px',
  'nc-input-padding-y-md':          '8px',
  'nc-input-font-size-md':          '16px',
  'nc-form-label-font-size':        '14px',
  'nc-form-label-font-weight':      '600',
  'nc-form-label-color':            '#1a1a1a',
  'nc-form-field-gap':              '4px'
}

const TOKEN_REFS = {
  'nc-fieldset-border-color':   'border-secondary',
  'nc-fieldset-legend-color':   'text-primary',
  'nc-fieldset-helper-color':   'text-secondary',
  'nc-fieldset-card-bg':        'background-secondary',
  'nc-fieldset-required-color': 'text-danger',
  'nc-input-bg':                'background-base',
  'nc-input-color':             'text-primary',
  'nc-input-border':            'border-primary',
  'nc-form-label-color':        'text-primary'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'fieldset') || null
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
function fieldsetStyle(tokens, { card = false, density = 'default' } = {}) {
  const padding = density === 'compact'
    ? tokens['nc-fieldset-padding-compact']
    : density === 'loose'
    ? tokens['nc-fieldset-padding-loose']
    : tokens['nc-fieldset-padding']
  return {
    display: 'flex',
    flexDirection: 'column',
    border: `${tokens['nc-fieldset-border-width']} solid ${tokens['nc-fieldset-border-color']}`,
    borderRadius: tokens['nc-fieldset-border-radius'],
    padding,
    background: card ? tokens['nc-fieldset-card-bg'] : 'transparent',
    boxShadow: card ? tokens['nc-fieldset-card-shadow'] : 'none',
    width: '320px',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  }
}

function legendStyle(tokens) {
  return {
    fontSize: tokens['nc-fieldset-legend-size'],
    fontWeight: tokens['nc-fieldset-legend-weight'],
    color: tokens['nc-fieldset-legend-color'],
    marginBottom: tokens['nc-fieldset-legend-padding'],
    lineHeight: '1.3'
  }
}

function fieldsContainerStyle(tokens, { density = 'default' } = {}) {
  const gap = density === 'compact'
    ? tokens['nc-fieldset-gap-compact']
    : density === 'loose'
    ? tokens['nc-fieldset-gap-loose']
    : tokens['nc-fieldset-gap']
  return {
    display: 'flex',
    flexDirection: 'column',
    gap
  }
}

function inlineLabelStyle(tokens) {
  return {
    fontSize: tokens['nc-form-label-font-size'],
    fontWeight: tokens['nc-form-label-font-weight'],
    color: tokens['nc-form-label-color'],
    display: 'block',
    marginBottom: tokens['nc-form-field-gap'],
    lineHeight: '1.4'
  }
}

function inlineInputStyle(tokens) {
  return {
    display: 'block',
    width: '100%',
    height: tokens['nc-input-height-md'],
    padding: `${tokens['nc-input-padding-y-md']} ${tokens['nc-input-padding-x-md']}`,
    borderRadius: tokens['nc-input-radius'],
    border: `${tokens['nc-input-border-width']} solid ${tokens['nc-input-border']}`,
    background: tokens['nc-input-bg'],
    color: tokens['nc-input-color'],
    fontSize: tokens['nc-input-font-size-md'],
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box'
  }
}

function renderSimpleField(tokens, label, placeholder) {
  return h('div', {}, [
    h('label', { style: inlineLabelStyle(tokens) }, label),
    h('input', { type: 'text', placeholder, style: inlineInputStyle(tokens) })
  ])
}

function renderFieldset(tokens, { title, description, card = false, density = 'default', fields = [] } = {}) {
  const legend = h('div', { style: legendStyle(tokens) }, title)
  const desc = description
    ? h('p', { style: { fontSize: tokens['nc-fieldset-helper-size'], color: tokens['nc-fieldset-helper-color'], margin: '0 0 12px', lineHeight: '1.4' } }, description)
    : null
  const fieldsContainer = h('div', { style: fieldsContainerStyle(tokens, { density }) }, fields)
  return h('div', { style: fieldsetStyle(tokens, { card, density }) }, [legend, desc, fieldsContainer].filter(Boolean))
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

const FieldsetDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      return renderFieldset(t, {
        title: 'Personal Information',
        description: 'Update your personal details here.',
        fields: [
          renderSimpleField(t, 'First Name', 'Jane'),
          renderSimpleField(t, 'Last Name', 'Doe'),
          renderSimpleField(t, 'Email', 'jane.doe@example.com')
        ]
      })
    }
  }
})

const FieldsetCard = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      return renderFieldset(t, {
        title: 'Billing Address',
        description: 'Used for invoices and receipts.',
        card: true,
        fields: [
          renderSimpleField(t, 'Street', '123 Main St'),
          renderSimpleField(t, 'City', 'Berlin'),
          renderSimpleField(t, 'Postal Code', '10115')
        ]
      })
    }
  }
})

const FieldsetDensity = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const th = props.theme
      const compact = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } }, [
        h('span', { style: { fontSize: '11px', fontWeight: '600', color: th['text-secondary'] || '#666' } }, 'Compact'),
        renderFieldset(t, {
          title: 'Compact Fieldset',
          density: 'compact',
          fields: [
            renderSimpleField(t, 'Name', 'Alice'),
            renderSimpleField(t, 'Role', 'Admin')
          ]
        })
      ])
      const loose = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } }, [
        h('span', { style: { fontSize: '11px', fontWeight: '600', color: th['text-secondary'] || '#666' } }, 'Loose'),
        renderFieldset(t, {
          title: 'Loose Fieldset',
          density: 'loose',
          fields: [
            renderSimpleField(t, 'Name', 'Bob'),
            renderSimpleField(t, 'Role', 'Editor')
          ]
        })
      ])
      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap', alignItems: 'flex-start', gap: '24px' } }, [compact, loose])
    }
  }
})
</script>
