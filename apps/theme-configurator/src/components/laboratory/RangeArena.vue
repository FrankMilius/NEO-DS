<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Size Scale -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Size Scale — XS / SM / MD / LG</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SliderSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SliderSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SliderSizes :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: States -->
    <div class="arena-category-divider">
      <span class="arena-category-label">States — Default / Hover / Disabled</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SliderStates :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SliderStates :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SliderStates :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Range Slider -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Range Slider — Dual Thumb</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SliderRange :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SliderRange :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SliderRange :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('slider')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-range-track-height':         '4px',
  'nc-range-track-bg':             '#d1d5db',
  'nc-range-track-bg-active':      '#0066cc',
  'nc-range-track-radius':         '9999px',
  'nc-range-thumb-size':           '20px',
  'nc-range-thumb-bg':             '#ffffff',
  'nc-range-thumb-border':         '#0066cc',
  'nc-range-thumb-border-width':   '2px',
  'nc-range-thumb-shadow':         '0 1px 3px rgba(0,0,0,0.2)',
  'nc-range-disabled-opacity':     '0.5',
  'nc-range-range-fill-bg':        '#0066cc',
  'nc-range-transition-duration':  '200ms'
}

const TOKEN_REFS = {
  'nc-range-track-bg':        'border-secondary',
  'nc-range-track-bg-active': 'interactive-default',
  'nc-range-thumb-bg':        'background-base',
  'nc-range-thumb-border':    'interactive-default',
  'nc-range-range-fill-bg':   'interactive-default'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'slider') || null
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
const SIZE_TRACK_HEIGHT = { xs: '2px', sm: '3px', md: '4px', lg: '6px' }
const SIZE_THUMB = { xs: '14px', sm: '16px', md: '20px', lg: '26px' }
const SIZE_LABEL = { xs: 'XS', sm: 'SM', md: 'MD', lg: 'LG' }

function trackWrapStyle() {
  return {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    width: '100%'
  }
}

function trackStyle(tokens, { size = 'md', disabled = false } = {}) {
  const h_ = SIZE_TRACK_HEIGHT[size] || tokens['nc-range-track-height'] || '4px'
  return {
    position: 'relative',
    width: '100%',
    height: h_,
    borderRadius: tokens['nc-range-track-radius'] || '9999px',
    background: tokens['nc-range-track-bg'] || '#d1d5db',
    opacity: disabled ? (tokens['nc-range-disabled-opacity'] || '0.5') : '1',
    cursor: disabled ? 'not-allowed' : 'pointer'
  }
}

function fillStyle(tokens, { fillPct = 65, size = 'md', isRange = false, rangeMin = 25, rangeMax = 75 } = {}) {
  if (isRange) {
    return {
      position: 'absolute',
      left: `${rangeMin}%`,
      width: `${rangeMax - rangeMin}%`,
      top: '0',
      height: '100%',
      borderRadius: tokens['nc-range-track-radius'] || '9999px',
      background: tokens['nc-range-range-fill-bg'] || tokens['nc-range-track-bg-active'] || '#0066cc'
    }
  }
  return {
    position: 'absolute',
    left: '0',
    width: `${fillPct}%`,
    top: '0',
    height: '100%',
    borderRadius: tokens['nc-range-track-radius'] || '9999px',
    background: tokens['nc-range-track-bg-active'] || '#0066cc'
  }
}

function thumbStyle(tokens, { fillPct = 65, size = 'md', hover = false } = {}) {
  const sz = SIZE_THUMB[size] || tokens['nc-range-thumb-size'] || '20px'
  const szNum = parseInt(sz)
  return {
    position: 'absolute',
    top: '50%',
    left: `calc(${fillPct}% - ${Math.round(szNum / 2)}px)`,
    transform: 'translateY(-50%)' + (hover ? ' scale(1.15)' : ''),
    width: sz,
    height: sz,
    borderRadius: '50%',
    background: tokens['nc-range-thumb-bg'] || '#ffffff',
    border: `${tokens['nc-range-thumb-border-width'] || '2px'} solid ${tokens['nc-range-thumb-border'] || '#0066cc'}`,
    boxShadow: tokens['nc-range-thumb-shadow'] || '0 1px 3px rgba(0,0,0,0.2)',
    flexShrink: '0',
    zIndex: '1'
  }
}

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
function renderSlider(tokens, { fillPct = 65, size = 'md', hover = false, disabled = false } = {}) {
  const fill = h('div', { style: fillStyle(tokens, { fillPct, size }) })
  const thumb = h('div', { style: thumbStyle(tokens, { fillPct, size, hover }) })
  return h('div', { style: { ...trackStyle(tokens, { size, disabled }), minWidth: '120px' } }, [fill, thumb])
}

function renderRangeSlider(tokens, { rangeMin = 25, rangeMax = 75 } = {}) {
  const fill = h('div', { style: fillStyle(tokens, { isRange: true, rangeMin, rangeMax }) })
  const thumbMin = h('div', { style: thumbStyle(tokens, { fillPct: rangeMin, size: 'md' }) })
  const thumbMax = h('div', { style: thumbStyle(tokens, { fillPct: rangeMax, size: 'md' }) })
  return h('div', { style: { ...trackStyle(tokens, { size: 'md' }), minWidth: '200px' } }, [fill, thumbMin, thumbMax])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Size Scale: XS / SM / MD / LG each at 65% fill
const SliderSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const sizes = ['xs', 'sm', 'md', 'lg']
      const rows = sizes.map(size =>
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
          h('span', {
            style: {
              fontSize: '11px', fontWeight: '600', minWidth: '24px',
              color: props.theme['text-secondary'] || '#666'
            }
          }, SIZE_LABEL[size]),
          h('div', { style: { flex: '1', minWidth: '160px' } }, [
            renderSlider(t, { size, fillPct: 65 })
          ])
        ])
      )
      return h('div', { class: 'arena-preview-stack', style: { width: '100%' } }, rows)
    }
  }
})

// States: Default (65%) | Hover thumb scaled | Disabled (30%)
const SliderStates = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const states = [
        { label: 'Default',  fillPct: 65, hover: false, disabled: false },
        { label: 'Hover',    fillPct: 65, hover: true,  disabled: false },
        { label: 'Disabled', fillPct: 30, hover: false, disabled: true  }
      ]
      const items = states.map(s =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', flex: '1', minWidth: '140px' } }, [
          h('div', { style: { paddingInline: '4px' } }, [
            renderSlider(t, s)
          ]),
          h('span', {
            style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666', textAlign: 'center' }
          }, s.label)
        ])
      )
      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap', alignItems: 'flex-end', width: '100%' } }, items)
    }
  }
})

// Range Slider: min at 25%, max at 75%
const SliderRange = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      return h('div', { class: 'arena-preview-stack', style: { width: '100%' } }, [
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } }, [
          h('div', { style: { paddingInline: '10px' } }, [
            renderRangeSlider(t, { rangeMin: 25, rangeMax: 75 })
          ]),
          h('div', { style: { display: 'flex', justifyContent: 'space-between', paddingInline: '4px' } }, [
            h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } }, '25'),
            h('span', { style: { fontSize: '11px', color: props.theme['text-tertiary'] || '#999' } }, 'Range: 25 – 75'),
            h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } }, '75')
          ])
        ])
      ])
    }
  }
})
</script>
