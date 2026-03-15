<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Star Fill Variants -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Star Fill — 3/5 · 4/5</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <RatingFills :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <RatingFills :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <RatingFills :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: States -->
    <div class="arena-category-divider">
      <span class="arena-category-label">States — Active / Hover / Readonly / Disabled</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <RatingStates :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <RatingStates :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <RatingStates :tokens="activeTokens" :theme="activeTheme" />
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
          <RatingSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <RatingSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <RatingSizes :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('rating')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-rating-size':             '24px',
  'nc-rating-gap':              '4px',
  'nc-rating-color-active':     '#f59e0b',
  'nc-rating-color-inactive':   '#d1d5db',
  'nc-rating-hover-color':      '#f59e0b',
  'nc-rating-disabled-opacity': '0.5'
}

const TOKEN_REFS = {
  'nc-rating-color-active':   'feedback-warning',
  'nc-rating-color-inactive': 'border-secondary'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'rating') || null
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
// Star SVG Path
// ---------------------------------------------------------------------------
const STAR_PATH = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'

function renderStar(tokens, { active = false, hover = false, size = '24px' } = {}) {
  const fillColor = (active || hover)
    ? (hover ? (tokens['nc-rating-hover-color'] || tokens['nc-rating-color-active'] || '#f59e0b') : (tokens['nc-rating-color-active'] || '#f59e0b'))
    : 'none'
  const strokeColor = (active || hover)
    ? (hover ? (tokens['nc-rating-hover-color'] || tokens['nc-rating-color-active'] || '#f59e0b') : (tokens['nc-rating-color-active'] || '#f59e0b'))
    : (tokens['nc-rating-color-inactive'] || '#d1d5db')

  return h('svg', {
    viewBox: '0 0 24 24',
    width: size,
    height: size,
    style: { flexShrink: '0', display: 'block' }
  }, [
    h('path', {
      d: STAR_PATH,
      fill: fillColor,
      stroke: strokeColor,
      'stroke-width': '1.5',
      'stroke-linejoin': 'round'
    })
  ])
}

function renderStarRow(tokens, { filled = 3, total = 5, hoverUpTo = 0, disabled = false, size = '24px' } = {}) {
  const stars = Array.from({ length: total }, (_, i) => {
    const isActive = i < filled
    const isHover = hoverUpTo > 0 && i < hoverUpTo && i >= filled
    return renderStar(tokens, { active: isActive, hover: isHover, size })
  })

  return h('div', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: tokens['nc-rating-gap'] || '4px',
      opacity: disabled ? (tokens['nc-rating-disabled-opacity'] || '0.5') : '1',
      cursor: disabled ? 'not-allowed' : 'pointer'
    }
  }, stars)
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Star Fill: 3/5 and 4/5
const RatingFills = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const fills = [
        { label: '3 / 5 stars', filled: 3 },
        { label: '4 / 5 stars', filled: 4 }
      ]
      const items = fills.map(({ label, filled }) =>
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' } }, [
          renderStarRow(t, { filled, total: 5 }),
          h('span', {
            style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' }
          }, label)
        ])
      )
      return h('div', { class: 'arena-preview-stack' }, items)
    }
  }
})

// States: Active (3 filled) | Hover (4 highlighted) | Readonly | Disabled
const RatingStates = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const states = [
        { label: 'Active',    filled: 3, hoverUpTo: 0, disabled: false },
        { label: 'Hover',     filled: 3, hoverUpTo: 4, disabled: false },
        { label: 'Readonly',  filled: 4, hoverUpTo: 0, disabled: false },
        { label: 'Disabled',  filled: 2, hoverUpTo: 0, disabled: true  }
      ]
      const items = states.map(s =>
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' } }, [
          renderStarRow(t, { filled: s.filled, hoverUpTo: s.hoverUpTo, disabled: s.disabled }),
          h('span', {
            style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' }
          }, s.label)
        ])
      )
      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap' } }, items)
    }
  }
})

// Size Scale: SM (18px) | MD (24px) | LG (36px) — each showing 3 stars
const SIZE_PX = { sm: '18px', md: '24px', lg: '36px' }

const RatingSizes = defineComponent({
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
          h('span', {
            style: {
              fontSize: '11px', fontWeight: '600', minWidth: '24px',
              color: props.theme['text-secondary'] || '#666'
            }
          }, label),
          renderStarRow(t, { filled: 3, total: 5, size: SIZE_PX[size] })
        ])
      )
      return h('div', { class: 'arena-preview-stack' }, rows)
    }
  }
})
</script>
