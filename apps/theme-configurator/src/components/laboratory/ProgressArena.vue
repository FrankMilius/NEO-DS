<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Linear Progress -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Linear Progress — 0 / 25 / 50 / 75 / 100 %</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ProgressLinear :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ProgressLinear :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ProgressLinear :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: States -->
    <div class="arena-category-divider">
      <span class="arena-category-label">States — Default / Success / Warning / Danger / Indeterminate</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ProgressStates :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ProgressStates :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ProgressStates :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Sizes -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Sizes — XS (2px) / SM (4px) / MD (8px) / LG (12px)</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ProgressSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ProgressSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ProgressSizes :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Label -->
    <div class="arena-category-divider">
      <span class="arena-category-label">With Label + Value</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ProgressLabeled :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ProgressLabeled :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ProgressLabeled :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('progress')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-progress-bg':           '#e5e7eb',
  'nc-progress-fill':         '#0066cc',
  'nc-progress-radius':       '9999px',
  'nc-progress-transition':   '300ms',
  'nc-progress-ease':         'ease-out',
  'nc-progress-height-xs':    '2px',
  'nc-progress-height-sm':    '4px',
  'nc-progress-height-md':    '8px',
  'nc-progress-height-lg':    '12px',
  'nc-progress-fill-success': '#16a34a',
  'nc-progress-fill-warning': '#d97706',
  'nc-progress-fill-danger':  '#dc2626',
  'nc-progress-fill-info':    '#0284c7',
  'nc-progress-label-color':  '#6b7280',
  'nc-progress-label-size':   '12px',
  'nc-progress-label-weight': '500',
  'nc-progress-label-gap':    '8px',
}

const TOKEN_REFS = {
  'nc-progress-bg':           'background-tertiary',
  'nc-progress-fill':         'interactive-default',
  'nc-progress-fill-success': 'feedback-success',
  'nc-progress-fill-warning': 'feedback-warning',
  'nc-progress-fill-danger':  'feedback-danger',
  'nc-progress-fill-info':    'feedback-info',
  'nc-progress-label-color':  'text-secondary',
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'progress') || null
)
const tLight = computed(() => store.state.themes[store.state.activeThemeSet].light)
const tDark  = computed(() => store.state.themes[store.state.activeThemeSet].dark)

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
const tokensDark  = computed(() => resolveAll(tDark.value))

// ---------------------------------------------------------------------------
// 3-Mode Support
// ---------------------------------------------------------------------------
const arenaMode    = computed(() => store.state.previewMode)
const isSplit      = computed(() => arenaMode.value === 'split')
const activeTokens = computed(() => arenaMode.value === 'dark' ? tokensDark.value : tokensLight.value)
const activeTheme  = computed(() => arenaMode.value === 'dark' ? tDark.value : tLight.value)
const activeBg     = computed(() =>
  arenaMode.value === 'dark' ? tDark.value['background-base'] : tLight.value['background-secondary']
)

// ---------------------------------------------------------------------------
// Style Builders
// ---------------------------------------------------------------------------
function trackStyle(tokens, height) {
  return {
    width: '100%',
    height: height || tokens['nc-progress-height-sm'] || '4px',
    background: tokens['nc-progress-bg'] || '#e5e7eb',
    borderRadius: tokens['nc-progress-radius'] || '9999px',
    overflow: 'hidden',
    flexShrink: '0',
  }
}

function fillStyle(tokens, { width = '60%', color = null } = {}) {
  return {
    width: width,
    height: '100%',
    background: color || tokens['nc-progress-fill'] || '#0066cc',
    borderRadius: tokens['nc-progress-radius'] || '9999px',
    transition: `width ${tokens['nc-progress-transition'] || '300ms'} ${tokens['nc-progress-ease'] || 'ease-out'}`,
  }
}

function indeterminateFillStyle(tokens) {
  return {
    width: '40%',
    height: '100%',
    background: tokens['nc-progress-fill'] || '#0066cc',
    borderRadius: tokens['nc-progress-radius'] || '9999px',
    animation: 'progressIndeterminate 1.5s ease-in-out infinite',
    transformOrigin: 'left center',
  }
}

function labelStyle(tokens) {
  return {
    fontSize: tokens['nc-progress-label-size'] || '12px',
    fontWeight: tokens['nc-progress-label-weight'] || '500',
    color: tokens['nc-progress-label-color'] || '#6b7280',
    lineHeight: '1.4',
  }
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Linear Progress: 0 / 25 / 50 / 75 / 100 %
const ProgressLinear = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const steps = [0, 25, 50, 75, 100]
      const rows = steps.map(pct =>
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
          h('span', { style: { ...labelStyle(t), minWidth: '32px', textAlign: 'right' } }, `${pct}%`),
          h('div', { style: { ...trackStyle(t, tokens_sm_height(t)), flex: '1' } }, [
            h('div', { style: fillStyle(t, { width: `${pct}%` }) })
          ])
        ])
      )
      return h('div', { class: 'arena-preview-stack', style: { padding: '16px', gap: '10px' } }, rows)
    }
  }
})

function tokens_sm_height(t) {
  return t['nc-progress-height-sm'] || '4px'
}

// States: default / success / warning / danger / indeterminate
const ProgressStates = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const states = [
        { label: 'Default',       color: t['nc-progress-fill'],         width: '65%' },
        { label: 'Success',       color: t['nc-progress-fill-success'],  width: '80%' },
        { label: 'Warning',       color: t['nc-progress-fill-warning'],  width: '45%' },
        { label: 'Danger',        color: t['nc-progress-fill-danger'],   width: '30%' },
        { label: 'Info',          color: t['nc-progress-fill-info'],     width: '55%' },
      ]
      const rows = states.map(s =>
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
          h('span', { style: { ...labelStyle(t), minWidth: '72px' } }, s.label),
          h('div', { style: { ...trackStyle(t, t['nc-progress-height-sm'] || '4px'), flex: '1' } }, [
            h('div', { style: fillStyle(t, { width: s.width, color: s.color }) })
          ])
        ])
      )
      // Indeterminate row — approximate with gradient animation via keyframe in style
      const indeterminateRow = h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
        h('span', { style: { ...labelStyle(t), minWidth: '72px' } }, 'Indeterm.'),
        h('div', {
          style: {
            ...trackStyle(t, t['nc-progress-height-sm'] || '4px'),
            flex: '1',
            background: `linear-gradient(90deg, ${t['nc-progress-bg'] || '#e5e7eb'} 0%, ${t['nc-progress-fill'] || '#0066cc'} 40%, ${t['nc-progress-bg'] || '#e5e7eb'} 100%)`,
            backgroundSize: '200% 100%',
            animation: 'progressShimmer 1.5s linear infinite',
          }
        })
      ])
      return h('div', { class: 'arena-preview-stack', style: { padding: '16px', gap: '10px' } }, [
        ...rows,
        indeterminateRow,
        // Keyframe injection via scoped style trick
        h('style', {}, `
          @keyframes progressShimmer {
            0%   { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @keyframes progressIndeterminate {
            0%   { transform: scaleX(0.3) translateX(-100%); }
            50%  { transform: scaleX(0.7) translateX(100%); }
            100% { transform: scaleX(0.3) translateX(300%); }
          }
        `)
      ])
    }
  }
})

// Sizes: XS / SM / MD / LG
const ProgressSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const sizes = [
        { label: 'XS (2px)', height: t['nc-progress-height-xs'] || '2px' },
        { label: 'SM (4px)', height: t['nc-progress-height-sm'] || '4px' },
        { label: 'MD (8px)', height: t['nc-progress-height-md'] || '8px' },
        { label: 'LG (12px)', height: t['nc-progress-height-lg'] || '12px' },
      ]
      const rows = sizes.map(s =>
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
          h('span', { style: { ...labelStyle(t), minWidth: '68px' } }, s.label),
          h('div', { style: { ...trackStyle(t, s.height), flex: '1' } }, [
            h('div', { style: fillStyle(t, { width: '60%' }) })
          ])
        ])
      )
      return h('div', { class: 'arena-preview-stack', style: { padding: '16px', gap: '12px' } }, rows)
    }
  }
})

// With Label + Value
const ProgressLabeled = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const items = [
        { label: 'Upload abgeschlossen', pct: 72, color: t['nc-progress-fill'] },
        { label: 'Speicher verwendet',   pct: 45, color: t['nc-progress-fill-success'] },
        { label: 'CPU-Auslastung',       pct: 88, color: t['nc-progress-fill-danger'] },
      ]
      const rows = items.map(item =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: t['nc-progress-label-gap'] || '8px' } }, [
          h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } }, [
            h('span', { style: labelStyle(t) }, item.label),
            h('span', { style: { ...labelStyle(t), fontVariantNumeric: 'tabular-nums' } }, `${item.pct}%`),
          ]),
          h('div', { style: { ...trackStyle(t, t['nc-progress-height-sm'] || '4px'), flex: '1' } }, [
            h('div', { style: fillStyle(t, { width: `${item.pct}%`, color: item.color }) })
          ])
        ])
      )
      return h('div', { class: 'arena-preview-stack', style: { padding: '16px', gap: '16px' } }, rows)
    }
  }
})
</script>
