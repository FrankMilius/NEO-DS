<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default — Seite 2 aktiv</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <PaginationDefault :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <PaginationDefault :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <PaginationDefault :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Appearance Variants -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Appearance Variants — Default / Pill / Outline / Minimal</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <PaginationAppearances :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <PaginationAppearances :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <PaginationAppearances :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Sizes -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Sizes — MD (32px) vs SM (28px)</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <PaginationSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <PaginationSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <PaginationSizes :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Alignment -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Alignment — Start / Center / End</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <PaginationAlignment :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <PaginationAlignment :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <PaginationAlignment :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('pagination')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-pagination-gap':                   '4px',
  'nc-pagination-padding':               '12px 0',
  'nc-pagination-color':                 '#6b7280',
  'nc-pagination-font-size':             '14px',
  'nc-pagination-item-size':             '32px',
  'nc-pagination-item-radius':           '4px',
  'nc-pagination-item-bg':               'transparent',
  'nc-pagination-item-bg-hover':         'rgba(0,0,0,0.05)',
  'nc-pagination-item-bg-active':        '#0066cc',
  'nc-pagination-item-color':            '#1a1a1a',
  'nc-pagination-item-color-active':     '#ffffff',
  'nc-pagination-item-font-weight':      '500',
  'nc-pagination-nav-color':             '#0066cc',
  'nc-pagination-nav-color-disabled':    '#9ca3af',
  'nc-pagination-ellipsis-color':        '#9ca3af',
  'nc-pagination-active-indicator-height': '2px',
  'nc-pagination-active-indicator-color':  '#0066cc',
  'nc-pagination-item-shadow-active':    '0 2px 8px rgba(0,102,204,0.25)',
  'nc-pagination-touch-min':             '44px',
  'nc-pagination-minimal-info-color':    '#6b7280',
  'nc-pagination-minimal-info-size':     '14px',
  'nc-pagination-outline-border':        '1px solid #e5e7eb',
  'nc-pagination-outline-border-active': '2px solid #0066cc'
}

const TOKEN_REFS = {
  'nc-pagination-color':              'text-secondary',
  'nc-pagination-item-bg-active':     'interactive-default',
  'nc-pagination-item-color':         'text-primary',
  'nc-pagination-item-color-active':  'text-on-interactive',
  'nc-pagination-nav-color':          'interactive-default',
  'nc-pagination-nav-color-disabled': 'text-disabled',
  'nc-pagination-ellipsis-color':     'text-tertiary',
  'nc-pagination-minimal-info-color': 'text-secondary'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'pagination') || null
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
function rowStyle(justify = 'flex-start') {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: justify,
    flexWrap: 'wrap',
    width: '100%'
  }
}

function itemStyle(tokens, { active = false, disabled = false, size = 'md', appearance = 'default' } = {}) {
  const sz = size === 'sm' ? '28px' : (tokens['nc-pagination-item-size'] || '32px')
  let bg = tokens['nc-pagination-item-bg'] || 'transparent'
  let color = tokens['nc-pagination-item-color'] || '#1a1a1a'
  let border = 'none'
  let radius = tokens['nc-pagination-item-radius'] || '4px'

  if (active) {
    bg = tokens['nc-pagination-item-bg-active'] || '#0066cc'
    color = tokens['nc-pagination-item-color-active'] || '#ffffff'
  }
  if (disabled) {
    color = tokens['nc-pagination-nav-color-disabled'] || '#9ca3af'
  }
  if (appearance === 'pill') {
    radius = '9999px'
  }
  if (appearance === 'outline') {
    border = active
      ? (tokens['nc-pagination-outline-border-active'] || '2px solid #0066cc')
      : (tokens['nc-pagination-outline-border'] || '1px solid #e5e7eb')
    bg = 'transparent'
  }

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: sz,
    height: sz,
    padding: '0 4px',
    borderRadius: radius,
    border,
    background: bg,
    color,
    fontFamily: 'inherit',
    fontSize: tokens['nc-pagination-font-size'] || '14px',
    fontWeight: active ? (tokens['nc-pagination-item-font-weight'] || '500') : '400',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? '0.5' : '1',
    userSelect: 'none',
    flexShrink: '0',
    fontVariantNumeric: 'tabular-nums'
  }
}

function navBtnStyle(tokens, { disabled = false, size = 'md' } = {}) {
  const sz = size === 'sm' ? '28px' : (tokens['nc-pagination-item-size'] || '32px')
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: sz,
    minWidth: sz,
    padding: '0 8px',
    gap: '4px',
    background: 'transparent',
    border: 'none',
    borderRadius: tokens['nc-pagination-item-radius'] || '4px',
    color: disabled
      ? (tokens['nc-pagination-nav-color-disabled'] || '#9ca3af')
      : (tokens['nc-pagination-nav-color'] || '#0066cc'),
    fontFamily: 'inherit',
    fontSize: tokens['nc-pagination-font-size'] || '14px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? '0.5' : '1',
    userSelect: 'none',
    flexShrink: '0'
  }
}

function ellipsisStyle(tokens) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: tokens['nc-pagination-item-size'] || '32px',
    height: tokens['nc-pagination-item-size'] || '32px',
    color: tokens['nc-pagination-ellipsis-color'] || '#9ca3af',
    fontSize: tokens['nc-pagination-font-size'] || '14px',
    userSelect: 'none',
    cursor: 'default',
    fontVariantNumeric: 'tabular-nums'
  }
}

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
function renderPrevArrow() {
  return h('svg', {
    width: '16', height: '16',
    viewBox: '0 0 16 16',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': 'true'
  }, [
    h('path', {
      d: 'M10 12L6 8L10 4',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    })
  ])
}

function renderNextArrow() {
  return h('svg', {
    width: '16', height: '16',
    viewBox: '0 0 16 16',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': 'true'
  }, [
    h('path', {
      d: 'M6 12L10 8L6 4',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    })
  ])
}

function renderPagination(tokens, { activePage = 2, pages = [1,2,3,null,10], size = 'md', appearance = 'default', justify = 'flex-start' } = {}) {
  const gap = tokens['nc-pagination-gap'] || '4px'
  const items = [
    h('button', { style: navBtnStyle(tokens, { size }), 'aria-label': 'Vorherige Seite' }, [
      renderPrevArrow(),
      h('span', { style: { fontSize: 'inherit' } }, 'Zurück')
    ])
  ]

  pages.forEach(page => {
    if (page === null) {
      items.push(h('span', { style: ellipsisStyle(tokens), 'aria-hidden': 'true' }, '…'))
    } else {
      items.push(
        h('button', {
          style: itemStyle(tokens, { active: page === activePage, size, appearance }),
          'aria-label': `Seite ${page}`,
          'aria-current': page === activePage ? 'page' : undefined
        }, String(page))
      )
    }
  })

  items.push(
    h('button', { style: navBtnStyle(tokens, { size }), 'aria-label': 'Nächste Seite' }, [
      h('span', { style: { fontSize: 'inherit' } }, 'Weiter'),
      renderNextArrow()
    ])
  )

  return h('nav', {
    style: { ...rowStyle(justify), gap },
    'aria-label': 'Seitennavigation'
  }, items)
}

function renderMinimalPagination(tokens) {
  return h('nav', {
    style: { display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'inherit' },
    'aria-label': 'Seitennavigation'
  }, [
    h('button', { style: navBtnStyle(tokens), 'aria-label': 'Vorherige Seite' }, [renderPrevArrow()]),
    h('span', {
      style: {
        fontSize: tokens['nc-pagination-minimal-info-size'] || '14px',
        color: tokens['nc-pagination-minimal-info-color'] || '#6b7280',
        fontFamily: 'inherit',
        whiteSpace: 'nowrap'
      }
    }, 'Seite 2 von 10'),
    h('button', { style: navBtnStyle(tokens), 'aria-label': 'Nächste Seite' }, [renderNextArrow()])
  ])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------
const PaginationDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => renderPagination(props.tokens, { activePage: 2, pages: [1,2,3,null,10] })
  }
})

const PaginationAppearances = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const appearances = [
        { label: 'Default',  value: 'default' },
        { label: 'Pill',     value: 'pill' },
        { label: 'Outline',  value: 'outline' },
        { label: 'Minimal',  value: 'minimal' }
      ]
      return h('div', { class: 'arena-preview-stack' },
        appearances.map(({ label, value }) =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } }, [
            h('span', {
              style: { fontSize: '11px', fontWeight: '600', color: props.theme['text-secondary'] || '#666' }
            }, label),
            value === 'minimal'
              ? renderMinimalPagination(t)
              : renderPagination(t, { activePage: 2, pages: [1,2,3,null,10], appearance: value })
          ])
        )
      )
    }
  }
})

const PaginationSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      return h('div', { class: 'arena-preview-stack' }, [
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } }, [
          h('span', { style: { fontSize: '11px', fontWeight: '600', color: props.theme['text-secondary'] || '#666' } }, 'MD — 32px'),
          renderPagination(t, { activePage: 2, pages: [1,2,3,null,10], size: 'md' })
        ]),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } }, [
          h('span', { style: { fontSize: '11px', fontWeight: '600', color: props.theme['text-secondary'] || '#666' } }, 'SM — 28px'),
          renderPagination(t, { activePage: 2, pages: [1,2,3,null,10], size: 'sm' })
        ])
      ])
    }
  }
})

const PaginationAlignment = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const aligns = [
        { label: 'Start',  justify: 'flex-start' },
        { label: 'Center', justify: 'center' },
        { label: 'End',    justify: 'flex-end' }
      ]
      return h('div', { class: 'arena-preview-stack', style: { width: '100%' } },
        aligns.map(({ label, justify }) =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' } }, [
            h('span', { style: { fontSize: '11px', fontWeight: '600', color: props.theme['text-secondary'] || '#666' } }, label),
            renderPagination(t, { activePage: 2, pages: [1,2,3], justify })
          ])
        )
      )
    }
  }
})
</script>
