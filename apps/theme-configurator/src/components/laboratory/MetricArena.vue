<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default (Solid) -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default — Solid with Trend</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <MetricDefault :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <MetricDefault :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <MetricDefault :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Solid vs Subtle -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Solid vs Subtle</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <MetricEmphasis :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <MetricEmphasis :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <MetricEmphasis :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Dashboard Grid -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Dashboard Grid — 4 Metrics</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <MetricGrid :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <MetricGrid :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <MetricGrid :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('metric')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-metric-bg':                     '#1a1a1a',
  'nc-metric-color':                  '#ffffff',
  'nc-metric-radius':                 '8px',
  'nc-metric-padding':                '24px',
  'nc-metric-gap':                    '8px',
  'nc-metric-value-font-size':        '3.5rem',
  'nc-metric-value-font-weight':      '900',
  'nc-metric-value-color':            '#60a5fa',
  'nc-metric-value-line-height':      '1.1',
  'nc-metric-unit-font-size':         '1.5rem',
  'nc-metric-unit-color':             '#60a5fa',
  'nc-metric-unit-font-weight':       '700',
  'nc-metric-label-font-size':        '14px',
  'nc-metric-label-color':            '#ffffff',
  'nc-metric-label-font-weight':      '500',
  'nc-metric-label-opacity':          '0.75',
  'nc-metric-trend-font-size':        '14px',
  'nc-metric-trend-font-weight':      '600',
  'nc-metric-trend-gap':              '4px',
  'nc-metric-trend-icon-size':        '16px',
  'nc-metric-trend-up-color':         '#4ade80',
  'nc-metric-trend-down-color':       '#f87171',
  'nc-metric-trend-neutral-color':    '#9ca3af',
  'nc-metric-footer-font-size':       '12px',
  'nc-metric-footer-color':           '#ffffff',
  'nc-metric-footer-opacity':         '0.5',
  'nc-metric-subtle-bg':              '#f3f4f6',
  'nc-metric-subtle-color':           '#1a1a1a',
  'nc-metric-subtle-value-color':     '#0066cc',
  'nc-metric-subtle-label-color':     '#6b7280',
  'nc-metric-subtle-label-opacity':   '1',
  'nc-metric-subtle-footer-color':    '#9ca3af',
  'nc-metric-subtle-footer-opacity':  '1',
  'nc-metric-md-padding':             '16px',
  'nc-metric-md-value-font-size':     '1.875rem',
  'nc-metric-md-unit-font-size':      '1.125rem',
  'nc-metric-md-label-font-size':     '12px'
}

const TOKEN_REFS = {
  'nc-metric-bg':                     'background-inverse',
  'nc-metric-color':                   'text-inverse',
  'nc-metric-value-color':            'background-accent',
  'nc-metric-unit-color':             'background-accent',
  'nc-metric-label-color':            'text-inverse',
  'nc-metric-trend-up-color':         'feedback-success',
  'nc-metric-trend-down-color':       'feedback-danger',
  'nc-metric-trend-neutral-color':    'text-tertiary',
  'nc-metric-footer-color':           'text-inverse',
  'nc-metric-subtle-bg':              'background-secondary',
  'nc-metric-subtle-color':           'text-primary',
  'nc-metric-subtle-value-color':     'interactive-default',
  'nc-metric-subtle-label-color':     'text-secondary',
  'nc-metric-subtle-footer-color':    'text-tertiary'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'metric') || null
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
function metricContainerStyle(tokens, { subtle = false, size = 'lg' } = {}) {
  const padding = size === 'md' ? tokens['nc-metric-md-padding'] : tokens['nc-metric-padding']
  const bg = subtle ? tokens['nc-metric-subtle-bg'] : tokens['nc-metric-bg']
  const color = subtle ? tokens['nc-metric-subtle-color'] : tokens['nc-metric-color']
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens['nc-metric-gap'],
    padding,
    borderRadius: tokens['nc-metric-radius'],
    background: bg,
    color,
    fontFamily: 'inherit',
    minWidth: size === 'md' ? '160px' : '200px'
  }
}

function metricLabelStyle(tokens, { subtle = false } = {}) {
  const color = subtle ? tokens['nc-metric-subtle-label-color'] : tokens['nc-metric-label-color']
  const opacity = subtle ? tokens['nc-metric-subtle-label-opacity'] : tokens['nc-metric-label-opacity']
  return {
    fontSize: tokens['nc-metric-label-font-size'],
    fontWeight: tokens['nc-metric-label-font-weight'],
    color,
    opacity,
    lineHeight: '1.4'
  }
}

function metricValueStyle(tokens, { subtle = false, size = 'lg' } = {}) {
  const fontSize = size === 'md' ? tokens['nc-metric-md-value-font-size'] : tokens['nc-metric-value-font-size']
  const color = subtle ? tokens['nc-metric-subtle-value-color'] : tokens['nc-metric-value-color']
  return {
    fontSize,
    fontWeight: tokens['nc-metric-value-font-weight'],
    color,
    lineHeight: tokens['nc-metric-value-line-height'],
    fontVariantNumeric: 'tabular-nums'
  }
}

function metricUnitStyle(tokens, { subtle = false, size = 'lg' } = {}) {
  const fontSize = size === 'md' ? tokens['nc-metric-md-unit-font-size'] : tokens['nc-metric-unit-font-size']
  const color = subtle ? tokens['nc-metric-subtle-value-color'] : tokens['nc-metric-unit-color']
  return {
    fontSize,
    fontWeight: tokens['nc-metric-unit-font-weight'],
    color
  }
}

function metricTrendStyle(tokens, { direction = 'up' } = {}) {
  let color = tokens['nc-metric-trend-neutral-color']
  if (direction === 'up') color = tokens['nc-metric-trend-up-color']
  else if (direction === 'down') color = tokens['nc-metric-trend-down-color']
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens['nc-metric-trend-gap'],
    fontSize: tokens['nc-metric-trend-font-size'],
    fontWeight: tokens['nc-metric-trend-font-weight'],
    color
  }
}

function metricFooterStyle(tokens, { subtle = false } = {}) {
  const color = subtle ? tokens['nc-metric-subtle-footer-color'] : tokens['nc-metric-footer-color']
  const opacity = subtle ? tokens['nc-metric-subtle-footer-opacity'] : tokens['nc-metric-footer-opacity']
  return {
    fontSize: tokens['nc-metric-footer-font-size'],
    color,
    opacity,
    lineHeight: '1.4'
  }
}

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
function arrowUpIcon(tokens) {
  return h('svg', {
    width: tokens['nc-metric-trend-icon-size'], height: tokens['nc-metric-trend-icon-size'],
    viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
    'stroke-width': '2.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    'aria-hidden': 'true'
  }, [h('path', { d: 'M4.5 15.75l7.5-7.5 7.5 7.5' })])
}

function arrowDownIcon(tokens) {
  return h('svg', {
    width: tokens['nc-metric-trend-icon-size'], height: tokens['nc-metric-trend-icon-size'],
    viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
    'stroke-width': '2.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    'aria-hidden': 'true'
  }, [h('path', { d: 'M19.5 8.25l-7.5 7.5-7.5-7.5' })])
}

function renderMetric(tokens, { label, value, unit, trendDirection, trendValue, footer, subtle = false, size = 'lg' } = {}) {
  const labelNode = label
    ? h('div', { style: metricLabelStyle(tokens, { subtle }) }, label)
    : null

  const valueRow = h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '4px' } }, [
    unit ? h('span', { style: metricUnitStyle(tokens, { subtle, size }) }, unit) : null,
    h('span', { style: metricValueStyle(tokens, { subtle, size }) }, value)
  ].filter(Boolean))

  const trendIcon = trendDirection === 'up' ? arrowUpIcon(tokens) : trendDirection === 'down' ? arrowDownIcon(tokens) : null
  const trendNode = trendValue
    ? h('div', { style: metricTrendStyle(tokens, { direction: trendDirection || 'neutral' }) }, [trendIcon, trendValue].filter(Boolean))
    : null

  const footerNode = footer
    ? h('div', { style: metricFooterStyle(tokens, { subtle }) }, footer)
    : null

  return h('div', { style: metricContainerStyle(tokens, { subtle, size }) },
    [labelNode, valueRow, trendNode, footerNode].filter(Boolean)
  )
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

const MetricDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => renderMetric(props.tokens, {
      label: 'Total Revenue',
      unit: '€',
      value: '24,521',
      trendDirection: 'up',
      trendValue: '+12.5% vs last month',
      footer: 'Last updated today'
    })
  }
})

const MetricEmphasis = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const th = props.theme
      const solidMetric = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } }, [
        h('span', { style: { fontSize: '11px', fontWeight: '600', color: th['text-secondary'] || '#666' } }, 'Solid'),
        renderMetric(t, { label: 'Active Users', value: '8,420', trendDirection: 'up', trendValue: '+3.2%', subtle: false })
      ])
      const subtleMetric = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } }, [
        h('span', { style: { fontSize: '11px', fontWeight: '600', color: th['text-secondary'] || '#666' } }, 'Subtle'),
        renderMetric(t, { label: 'Active Users', value: '8,420', trendDirection: 'up', trendValue: '+3.2%', subtle: true })
      ])
      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap', alignItems: 'flex-start', gap: '24px' } }, [solidMetric, subtleMetric])
    }
  }
})

const MetricGrid = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const metrics = [
        { label: 'Revenue',     unit: '€', value: '24,521', trendDirection: 'up',   trendValue: '+12.5%' },
        { label: 'Users',              value: '8,420',   trendDirection: 'up',   trendValue: '+3.2%' },
        { label: 'Conversion', unit: '%', value: '3.8',     trendDirection: 'down', trendValue: '-0.4%' },
        { label: 'Avg. Order', unit: '€', value: '68',      trendDirection: 'up',   trendValue: '+7.1%' }
      ]
      const cards = metrics.map(m => renderMetric(t, { ...m, subtle: true, size: 'md' }))
      return h('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '12px',
          width: '100%'
        }
      }, cards)
    }
  }
})
</script>
