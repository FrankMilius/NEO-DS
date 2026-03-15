<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default — "Analytics" aktiv</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SegmentedDefault :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SegmentedDefault :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SegmentedDefault :tokens="activeTokens" :theme="activeTheme" />
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
          <SegmentedSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SegmentedSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SegmentedSizes :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Full Width -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Full Width — Segmente füllen den Container</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SegmentedFullWidth :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SegmentedFullWidth :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SegmentedFullWidth :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('segmented-control')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-segmented-bg':                      '#f3f4f6',
  'nc-segmented-radius':                  '6px',
  'nc-segmented-padding':                 '2px',
  'nc-segmented-gap':                     '2px',
  'nc-segmented-item-bg':                 'transparent',
  'nc-segmented-item-color':              '#6b7280',
  'nc-segmented-item-radius':             '4px',
  'nc-segmented-item-bg-hover':           'rgba(0,0,0,0.05)',
  'nc-segmented-item-color-hover':        '#1a1a1a',
  'nc-segmented-item-selected-bg':        '#ffffff',
  'nc-segmented-item-selected-color':     '#1a1a1a',
  'nc-segmented-item-selected-shadow':    '0 1px 3px rgba(0,0,0,0.12)',
  'nc-segmented-item-disabled-color':     '#9ca3af',
  'nc-segmented-item-disabled-opacity':   '0.5',
  'nc-segmented-transition-duration':     '200ms'
}

const TOKEN_REFS = {
  'nc-segmented-bg':                  'background-secondary',
  'nc-segmented-item-color':          'text-secondary',
  'nc-segmented-item-color-hover':    'text-primary',
  'nc-segmented-item-selected-bg':    'background-base',
  'nc-segmented-item-selected-color': 'text-primary',
  'nc-segmented-item-disabled-color': 'text-disabled'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'segmented-control') || null
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
function trackStyle(tokens, { fullWidth = false } = {}) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    background: tokens['nc-segmented-bg'] || '#f3f4f6',
    borderRadius: tokens['nc-segmented-radius'] || '6px',
    padding: tokens['nc-segmented-padding'] || '2px',
    gap: tokens['nc-segmented-gap'] || '2px',
    width: fullWidth ? '100%' : 'auto',
    maxWidth: fullWidth ? '480px' : 'none'
  }
}

function segmentStyle(tokens, { selected = false, disabled = false, size = 'md', fullWidth = false } = {}) {
  const heights = { sm: '28px', md: '36px', lg: '44px' }
  const fontSizes = { sm: '12px', md: '13px', lg: '14px' }
  const paddings = { sm: '0 10px', md: '0 14px', lg: '0 18px' }

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: heights[size] || heights.md,
    padding: paddings[size] || paddings.md,
    borderRadius: tokens['nc-segmented-item-radius'] || '4px',
    background: selected
      ? (tokens['nc-segmented-item-selected-bg'] || '#ffffff')
      : (tokens['nc-segmented-item-bg'] || 'transparent'),
    color: selected
      ? (tokens['nc-segmented-item-selected-color'] || '#1a1a1a')
      : disabled
        ? (tokens['nc-segmented-item-disabled-color'] || '#9ca3af')
        : (tokens['nc-segmented-item-color'] || '#6b7280'),
    boxShadow: selected ? (tokens['nc-segmented-item-selected-shadow'] || '0 1px 3px rgba(0,0,0,0.12)') : 'none',
    fontFamily: 'inherit',
    fontSize: fontSizes[size] || fontSizes.md,
    fontWeight: selected ? '500' : '400',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? (tokens['nc-segmented-item-disabled-opacity'] || '0.5') : '1',
    userSelect: 'none',
    flexShrink: fullWidth ? '0' : 'auto',
    flex: fullWidth ? '1 1 0%' : 'none',
    whiteSpace: 'nowrap',
    border: 'none',
    transition: `background ${tokens['nc-segmented-transition-duration'] || '200ms'} ease, color ${tokens['nc-segmented-transition-duration'] || '200ms'} ease`
  }
}

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
function renderSegmentedControl(tokens, segments, { activeIndex = 0, size = 'md', fullWidth = false } = {}) {
  return h('div', {
    style: trackStyle(tokens, { fullWidth }),
    role: 'radiogroup',
    'aria-label': 'Ansicht wählen'
  },
    segments.map((seg, i) =>
      h('button', {
        style: segmentStyle(tokens, { selected: i === activeIndex, disabled: seg.disabled, size, fullWidth }),
        role: 'radio',
        'aria-checked': i === activeIndex ? 'true' : 'false',
        disabled: seg.disabled
      }, seg.label)
    )
  )
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------
const SEGMENTS = [
  { label: 'Übersicht' },
  { label: 'Analytics' },
  { label: 'Berichte' }
]

const SegmentedDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => renderSegmentedControl(props.tokens, SEGMENTS, { activeIndex: 1 })
  }
})

const SegmentedSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const sizes = [
        { label: 'SM — 28px', size: 'sm' },
        { label: 'MD — 36px', size: 'md' },
        { label: 'LG — 44px', size: 'lg' }
      ]
      return h('div', { class: 'arena-preview-stack' },
        sizes.map(({ label, size }) =>
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } }, [
            h('span', {
              style: { fontSize: '11px', fontWeight: '600', minWidth: '80px', color: props.theme['text-secondary'] || '#666' }
            }, label),
            renderSegmentedControl(t, SEGMENTS, { activeIndex: 1, size })
          ])
        )
      )
    }
  }
})

const SegmentedFullWidth = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => renderSegmentedControl(props.tokens, SEGMENTS, { activeIndex: 1, fullWidth: true })
  }
})
</script>
