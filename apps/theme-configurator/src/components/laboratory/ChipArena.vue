<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Variants -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Variants — Default / Hover / Selected</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ChipVariants :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ChipVariants :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ChipVariants :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Avatar / Icon -->
    <div class="arena-category-divider">
      <span class="arena-category-label">With Avatar / Icon</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ChipContent :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ChipContent :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ChipContent :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Close -->
    <div class="arena-category-divider">
      <span class="arena-category-label">With Close Button</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ChipRemovable :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ChipRemovable :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ChipRemovable :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Sizes -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Sizes — SM / MD / LG</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ChipSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ChipSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ChipSizes :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('chip')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-chip-height-sm':          '24px',
  'nc-chip-height-md':          '32px',
  'nc-chip-height-lg':          '40px',
  'nc-chip-padding-x':          '12px',
  'nc-chip-padding-y':          '4px',
  'nc-chip-radius':             '9999px',
  'nc-chip-font-size':          '12px',
  'nc-chip-font-size-sm':       '12px',
  'nc-chip-font-size-lg':       '16px',
  'nc-chip-font-weight':        '600',
  'nc-chip-gap':                '8px',
  'nc-chip-default-bg':         'transparent',
  'nc-chip-default-color':      '#1a1a1a',
  'nc-chip-default-border':     '#d1d5db',
  'nc-chip-default-bg-hover':   '#f3f4f6',
  'nc-chip-outline-bg':         'transparent',
  'nc-chip-outline-color':      '#1a1a1a',
  'nc-chip-outline-border':     '#d1d5db',
  'nc-chip-outline-bg-hover':   '#f3f4f6',
  'nc-chip-ghost-bg':           'transparent',
  'nc-chip-ghost-color':        '#6b7280',
  'nc-chip-ghost-border':       'transparent',
  'nc-chip-ghost-bg-hover':     'rgba(0,0,0,0.06)',
  'nc-chip-selected-bg':        '#0066cc',
  'nc-chip-selected-color':     '#ffffff',
  'nc-chip-selected-border':    '#0066cc',
  'nc-chip-selected-bg-hover':  '#0052a3',
  'nc-chip-icon-size':          '16px',
  'nc-chip-avatar-size':        '20px',
  'nc-chip-remove-size':        '16px',
  'nc-chip-disabled-bg':        '#f3f4f6',
  'nc-chip-disabled-color':     '#9ca3af',
  'nc-chip-disabled-border':    '#e5e7eb',
  'nc-chip-opacity-disabled':   '0.5',
  'nc-chip-transition-duration':'150ms'
}

const TOKEN_REFS = {
  'nc-chip-default-color':     'text-primary',
  'nc-chip-default-border':    'border-primary',
  'nc-chip-default-bg-hover':  'background-secondary',
  'nc-chip-outline-color':     'text-primary',
  'nc-chip-outline-border':    'border-primary',
  'nc-chip-outline-bg-hover':  'background-secondary',
  'nc-chip-ghost-color':       'text-secondary',
  'nc-chip-selected-bg':       'interactive-default',
  'nc-chip-selected-color':    'text-on-interactive',
  'nc-chip-selected-border':   'interactive-default',
  'nc-chip-selected-bg-hover': 'interactive-hover',
  'nc-chip-disabled-bg':       'background-disabled',
  'nc-chip-disabled-color':    'text-disabled',
  'nc-chip-disabled-border':   'border-secondary'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'chip') || null
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
function chipStyle(tokens, { variant = 'filled', selected = false, hover = false, disabled = false, size = 'md' } = {}) {
  const h_ = size === 'sm' ? tokens['nc-chip-height-sm'] : size === 'lg' ? tokens['nc-chip-height-lg'] : tokens['nc-chip-height-md']
  const fontSize = size === 'sm' ? tokens['nc-chip-font-size-sm'] : size === 'lg' ? tokens['nc-chip-font-size-lg'] : tokens['nc-chip-font-size']

  let bg, color, border
  if (disabled) {
    bg = tokens['nc-chip-disabled-bg']
    color = tokens['nc-chip-disabled-color']
    border = tokens['nc-chip-disabled-border']
  } else if (selected) {
    bg = hover ? tokens['nc-chip-selected-bg-hover'] : tokens['nc-chip-selected-bg']
    color = tokens['nc-chip-selected-color']
    border = tokens['nc-chip-selected-border']
  } else if (variant === 'ghost') {
    bg = hover ? tokens['nc-chip-ghost-bg-hover'] : tokens['nc-chip-ghost-bg']
    color = tokens['nc-chip-ghost-color']
    border = tokens['nc-chip-ghost-border']
  } else if (variant === 'outline') {
    bg = hover ? tokens['nc-chip-outline-bg-hover'] : tokens['nc-chip-outline-bg']
    color = tokens['nc-chip-outline-color']
    border = tokens['nc-chip-outline-border']
  } else {
    bg = hover ? tokens['nc-chip-default-bg-hover'] : tokens['nc-chip-default-bg']
    color = tokens['nc-chip-default-color']
    border = tokens['nc-chip-default-border']
  }

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens['nc-chip-gap'],
    height: h_,
    padding: `0 ${tokens['nc-chip-padding-x']}`,
    borderRadius: tokens['nc-chip-radius'],
    background: bg,
    color,
    border: `1px solid ${border}`,
    fontSize,
    fontWeight: tokens['nc-chip-font-weight'],
    fontFamily: 'inherit',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? tokens['nc-chip-opacity-disabled'] : '1',
    transition: `background ${tokens['nc-chip-transition-duration']} ease`,
    whiteSpace: 'nowrap',
    userSelect: 'none'
  }
}

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
function renderChip(tokens, label, opts = {}) {
  return h('button', { style: chipStyle(tokens, opts) }, label)
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Variants: filled / outline / ghost — each in default + hover + selected
const ChipVariants = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const variants = ['filled', 'outline', 'ghost']
      const rows = variants.map(variant => {
        const states = [
          { label: 'Default',  hover: false, selected: false },
          { label: 'Hover',    hover: true,  selected: false },
          { label: 'Selected', hover: false, selected: true  }
        ]
        const chips = states.map(s =>
          h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' } }, [
            renderChip(t, s.label, { variant, hover: s.hover, selected: s.selected }),
            h('span', { style: { fontSize: '10px', color: props.theme['text-tertiary'] || '#9ca3af' } }, s.label)
          ])
        )
        return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } }, [
          h('span', { style: { fontSize: '11px', fontWeight: '600', color: props.theme['text-secondary'] || '#666', textTransform: 'capitalize' } }, variant),
          h('div', { class: 'arena-btn-row' }, chips)
        ])
      })
      return h('div', { class: 'arena-preview-stack' }, rows)
    }
  }
})

// With Avatar / Icon
const ChipContent = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const iconSvg = h('svg', {
        width: t['nc-chip-icon-size'], height: t['nc-chip-icon-size'],
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        'aria-hidden': 'true', style: { flexShrink: '0' }
      }, [
        h('path', { d: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L9.568 3z' })
      ])
      const avatarCircle = h('span', {
        style: {
          width: t['nc-chip-avatar-size'], height: t['nc-chip-avatar-size'],
          borderRadius: '50%', background: t['interactive-default'] || '#0066cc',
          flexShrink: '0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '9px', fontWeight: '700'
        }
      }, 'AJ')

      const items = [
        { label: 'Text only',   children: ['Design'] },
        { label: 'With icon',   children: [iconSvg, 'Tagged'] },
        { label: 'With avatar', children: [avatarCircle, 'Alice J.'] }
      ]
      const chips = items.map(item =>
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' } }, [
          h('button', { style: chipStyle(t) }, item.children),
          h('span', { style: { fontSize: '10px', color: props.theme['text-tertiary'] || '#9ca3af' } }, item.label)
        ])
      )
      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap' } }, chips)
    }
  }
})

// With Close Button
const ChipRemovable = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const labels = ['Frontend', 'Design System', 'Vue.js']
      const chips = labels.map(label => {
        const removeBtn = h('span', {
          style: {
            width: t['nc-chip-remove-size'], height: t['nc-chip-remove-size'],
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%', cursor: 'pointer', fontSize: '10px', lineHeight: '1',
            opacity: '0.7', flexShrink: '0'
          }
        }, '✕')
        return h('button', { style: chipStyle(t) }, [label, removeBtn])
      })
      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap' } }, chips)
    }
  }
})

// Sizes: SM / MD / LG
const ChipSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const sizes = [
        { label: 'SM', size: 'sm' },
        { label: 'MD', size: 'md' },
        { label: 'LG', size: 'lg' }
      ]
      const rows = sizes.map(({ label, size }) =>
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
          h('span', { style: { fontSize: '11px', fontWeight: '600', minWidth: '24px', color: props.theme['text-secondary'] || '#666' } }, label),
          renderChip(t, 'Default', { size }),
          renderChip(t, 'Selected', { size, selected: true }),
          renderChip(t, 'Disabled', { size, disabled: true })
        ])
      )
      return h('div', { class: 'arena-preview-stack' }, rows)
    }
  }
})
</script>
