<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Tones -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Tones — All Variants</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <TagTones :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <TagTones :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <TagTones :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Dot -->
    <div class="arena-category-divider">
      <span class="arena-category-label">With Status Dot</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <TagWithDot :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <TagWithDot :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <TagWithDot :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Sizes -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Sizes — SM / MD</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <TagSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <TagSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <TagSizes :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('tag')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-tag-height-sm':             '24px',
  'nc-tag-height-md':             '32px',
  'nc-tag-height-lg':             '40px',
  'nc-tag-padding-x':             '12px',
  'nc-tag-padding-y':             '4px',
  'nc-tag-radius':                '9999px',
  'nc-tag-font-size':             '12px',
  'nc-tag-font-size-sm':          '12px',
  'nc-tag-font-size-lg':          '16px',
  'nc-tag-font-weight':           '600',
  'nc-tag-gap':                   '8px',
  'nc-tag-default-bg':            '#f3f4f6',
  'nc-tag-default-color':         '#1a1a1a',
  'nc-tag-default-border':        'transparent',
  'nc-tag-outline-bg':            'transparent',
  'nc-tag-outline-color':         '#1a1a1a',
  'nc-tag-outline-border':        '#d1d5db',
  'nc-tag-primary-bg':            '#0066cc',
  'nc-tag-primary-color':         '#ffffff',
  'nc-tag-primary-border':        'transparent',
  'nc-tag-success-bg':            '#dcfce7',
  'nc-tag-success-color':         '#16a34a',
  'nc-tag-success-border':        'transparent',
  'nc-tag-warning-bg':            '#fef9c3',
  'nc-tag-warning-color':         '#ca8a04',
  'nc-tag-warning-border':        'transparent',
  'nc-tag-error-bg':              '#fee2e2',
  'nc-tag-error-color':           '#dc2626',
  'nc-tag-error-border':          'transparent',
  'nc-tag-info-bg':               '#dbeafe',
  'nc-tag-info-color':            '#2563eb',
  'nc-tag-info-border':           'transparent',
  'nc-tag-icon-size':             '14px',
  'nc-tag-remove-size':           '16px',
  'nc-tag-disabled-bg':           '#f3f4f6',
  'nc-tag-disabled-color':        '#9ca3af',
  'nc-tag-transition-duration':   '150ms'
}

const TOKEN_REFS = {
  'nc-tag-default-bg':    'background-secondary',
  'nc-tag-default-color': 'text-primary',
  'nc-tag-outline-color': 'text-primary',
  'nc-tag-outline-border':'border-primary',
  'nc-tag-primary-bg':    'interactive-default',
  'nc-tag-primary-color': 'text-on-interactive',
  'nc-tag-success-bg':    'background-success',
  'nc-tag-success-color': 'text-success',
  'nc-tag-warning-bg':    'background-warning',
  'nc-tag-warning-color': 'text-warning',
  'nc-tag-error-bg':      'background-danger',
  'nc-tag-error-color':   'text-danger',
  'nc-tag-info-bg':       'background-info',
  'nc-tag-info-color':    'text-info',
  'nc-tag-disabled-bg':   'background-disabled',
  'nc-tag-disabled-color':'text-disabled'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'tag') || null
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
const TONE_CONFIGS = [
  { key: 'default',  label: 'Default',  dotColor: '#6b7280' },
  { key: 'outline',  label: 'Outline',  dotColor: '#6b7280' },
  { key: 'primary',  label: 'Primary',  dotColor: '#0066cc' },
  { key: 'success',  label: 'Success',  dotColor: '#16a34a' },
  { key: 'warning',  label: 'Warning',  dotColor: '#ca8a04' },
  { key: 'error',    label: 'Error',    dotColor: '#dc2626' },
  { key: 'info',     label: 'Info',     dotColor: '#2563eb' }
]

function tagStyle(tokens, { tone = 'default', size = 'md' } = {}) {
  const h_ = size === 'sm' ? tokens['nc-tag-height-sm'] : tokens['nc-tag-height-md']
  const fontSize = size === 'sm' ? tokens['nc-tag-font-size-sm'] : tokens['nc-tag-font-size']
  const bg = tokens[`nc-tag-${tone}-bg`] || tokens['nc-tag-default-bg']
  const color = tokens[`nc-tag-${tone}-color`] || tokens['nc-tag-default-color']
  const border = tokens[`nc-tag-${tone}-border`] || 'transparent'
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens['nc-tag-gap'],
    height: h_,
    padding: `0 ${tokens['nc-tag-padding-x']}`,
    borderRadius: tokens['nc-tag-radius'],
    background: bg,
    color,
    border: `1px solid ${border}`,
    fontSize,
    fontWeight: tokens['nc-tag-font-weight'],
    fontFamily: 'inherit',
    whiteSpace: 'nowrap'
  }
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// All Tones
const TagTones = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const tags = TONE_CONFIGS.map(({ key, label }) =>
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' } }, [
          h('span', { style: tagStyle(t, { tone: key }) }, label),
          h('span', { style: { fontSize: '10px', color: props.theme['text-tertiary'] || '#9ca3af' } }, key)
        ])
      )
      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap' } }, tags)
    }
  }
})

// With Status Dot
const TagWithDot = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const dotted = TONE_CONFIGS.filter(c => !['outline'].includes(c.key)).map(({ key, label, dotColor }) => {
        const actualColor = t[`nc-tag-${key}-color`] || dotColor
        const dot = h('span', {
          style: {
            width: '6px', height: '6px', borderRadius: '50%',
            background: actualColor, flexShrink: '0'
          }
        })
        return h('span', { style: tagStyle(t, { tone: key }) }, [dot, label])
      })
      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap' } }, dotted)
    }
  }
})

// Sizes
const TagSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const sizes = [
        { label: 'SM', size: 'sm' },
        { label: 'MD', size: 'md' }
      ]
      const tonesForSize = ['default', 'primary', 'success', 'error']
      const rows = sizes.map(({ label, size }) => {
        const tags = tonesForSize.map(tone =>
          h('span', { style: tagStyle(t, { tone, size }) },
            tone.charAt(0).toUpperCase() + tone.slice(1)
          )
        )
        return h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
          h('span', { style: { fontSize: '11px', fontWeight: '600', minWidth: '24px', color: props.theme['text-secondary'] || '#666' } }, label),
          ...tags
        ])
      })
      return h('div', { class: 'arena-preview-stack' }, rows)
    }
  }
})
</script>
