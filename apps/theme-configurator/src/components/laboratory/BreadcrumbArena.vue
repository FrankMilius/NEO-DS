<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default — 4-stufiger Pfad</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <BreadcrumbDefault :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <BreadcrumbDefault :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <BreadcrumbDefault :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Icons -->
    <div class="arena-category-divider">
      <span class="arena-category-label">With Icons — Icon vor jedem Crumb</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <BreadcrumbWithIcons :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <BreadcrumbWithIcons :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <BreadcrumbWithIcons :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Overflow / Truncated -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Overflow — langer Pfad mit Ellipsis</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <BreadcrumbOverflow :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <BreadcrumbOverflow :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <BreadcrumbOverflow :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('breadcrumb')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-breadcrumb-gap':                  '8px',
  'nc-breadcrumb-font-size':            '14px',
  'nc-breadcrumb-font-size-sm':         '12px',
  'nc-breadcrumb-color':                '#4b5563',
  'nc-breadcrumb-color-current':        '#1a1a1a',
  'nc-breadcrumb-color-hover':          '#1a1a1a',
  'nc-breadcrumb-separator-color':      '#9ca3af',
  'nc-breadcrumb-separator-opacity':    '0.4',
  'nc-breadcrumb-separator-size':       '16px',
  'nc-breadcrumb-separator-min-width':  '16px',
  'nc-breadcrumb-ghost-color':          '#9ca3af',
  'nc-breadcrumb-ghost-color-hover':    '#1a1a1a',
  'nc-breadcrumb-back-icon-size':       '16px',
  'nc-breadcrumb-back-gap':             '4px',
  'nc-breadcrumb-dropdown-min-width':   '160px'
}

const TOKEN_REFS = {
  'nc-breadcrumb-color':          'text-secondary',
  'nc-breadcrumb-color-current':  'text-primary',
  'nc-breadcrumb-color-hover':    'text-primary',
  'nc-breadcrumb-separator-color': 'text-disabled',
  'nc-breadcrumb-ghost-color':    'text-tertiary',
  'nc-breadcrumb-ghost-color-hover': 'text-primary'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'breadcrumb') || null
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
function navStyle(tokens) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: tokens['nc-breadcrumb-gap'] || '8px',
    fontFamily: 'inherit',
    fontSize: tokens['nc-breadcrumb-font-size'] || '14px',
    lineHeight: '1.4'
  }
}

function linkStyle(tokens, { current = false } = {}) {
  return {
    color: current
      ? (tokens['nc-breadcrumb-color-current'] || '#1a1a1a')
      : (tokens['nc-breadcrumb-color'] || '#4b5563'),
    fontWeight: current ? '500' : '400',
    textDecoration: 'none',
    cursor: current ? 'default' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  }
}

function separatorStyle(tokens) {
  return {
    color: tokens['nc-breadcrumb-separator-color'] || '#9ca3af',
    opacity: tokens['nc-breadcrumb-separator-opacity'] || '0.4',
    fontSize: '12px',
    userSelect: 'none',
    flexShrink: '0',
    lineHeight: '1'
  }
}

function ellipsisStyle(tokens) {
  return {
    color: tokens['nc-breadcrumb-separator-color'] || '#9ca3af',
    fontWeight: '600',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    fontSize: '13px',
    lineHeight: '1'
  }
}

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
function renderChevronSep(tokens) {
  return h('span', { style: separatorStyle(tokens), 'aria-hidden': 'true' }, [
    h('svg', {
      width: '12',
      height: '12',
      viewBox: '0 0 12 12',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg'
    }, [
      h('path', {
        d: 'M4.5 2.5L7.5 6L4.5 9.5',
        stroke: 'currentColor',
        'stroke-width': '1.5',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ])
  ])
}

function renderFolderIcon() {
  return h('svg', {
    width: '14',
    height: '14',
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    style: { flexShrink: '0' },
    'aria-hidden': 'true'
  }, [
    h('path', {
      d: 'M3 7a2 2 0 012-2h3.586a1 1 0 01.707.293l1.414 1.414A1 1 0 0011.414 7H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    })
  ])
}

function renderHomeIcon() {
  return h('svg', {
    width: '14',
    height: '14',
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    style: { flexShrink: '0' },
    'aria-hidden': 'true'
  }, [
    h('path', {
      d: 'M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    })
  ])
}

function renderBreadcrumb(tokens, crumbs) {
  const items = []
  crumbs.forEach((crumb, i) => {
    const isCurrent = i === crumbs.length - 1
    const linkChildren = []
    if (crumb.icon) linkChildren.push(crumb.icon)
    linkChildren.push(crumb.label)
    items.push(
      h('span', { style: linkStyle(tokens, { current: isCurrent }) }, linkChildren)
    )
    if (!isCurrent) {
      items.push(renderChevronSep(tokens))
    }
  })
  return h('nav', {
    style: navStyle(tokens),
    'aria-label': 'Breadcrumb'
  }, items)
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------
const DEFAULT_CRUMBS = [
  { label: 'Home' },
  { label: 'Produkte' },
  { label: 'Elektronik' },
  { label: 'Laptops' }
]

const ICON_CRUMBS = [
  { label: 'Home',      icon: renderHomeIcon() },
  { label: 'Produkte',  icon: renderFolderIcon() },
  { label: 'Elektronik', icon: renderFolderIcon() },
  { label: 'Laptops',   icon: renderFolderIcon() }
]

const BreadcrumbDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => renderBreadcrumb(props.tokens, DEFAULT_CRUMBS)
  }
})

const BreadcrumbWithIcons = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => renderBreadcrumb(props.tokens, ICON_CRUMBS)
  }
})

const BreadcrumbOverflow = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      // Home | … | Elektronik | Laptops (truncated middle)
      const items = [
        h('span', { style: linkStyle(t) }, 'Home'),
        renderChevronSep(t),
        h('span', {
          style: ellipsisStyle(t),
          title: 'Bürobedarf > Technik > Computer',
          'aria-label': 'Weitere Seiten anzeigen'
        }, '···'),
        renderChevronSep(t),
        h('span', { style: linkStyle(t) }, 'Elektronik'),
        renderChevronSep(t),
        h('span', { style: linkStyle(t, { current: true }) }, 'Laptops')
      ]
      return h('nav', {
        style: navStyle(t),
        'aria-label': 'Breadcrumb'
      }, items)
    }
  }
})
</script>
