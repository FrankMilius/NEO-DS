<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default Search -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default — Search Input</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SearchDefault :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SearchDefault :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SearchDefault :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Results Dropdown -->
    <div class="arena-category-divider">
      <span class="arena-category-label">With Results Dropdown</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SearchWithResults :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SearchWithResults :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SearchWithResults :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: States -->
    <div class="arena-category-divider">
      <span class="arena-category-label">States — Default / Active / Empty Results / Loading</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SearchStates :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SearchStates :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SearchStates :tokens="activeTokens" :theme="activeTheme" />
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
          <SearchSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SearchSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SearchSizes :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('search')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-search-width':                  '320px',
  'nc-search-max-width':              '100%',
  'nc-search-results-bg':             '#ffffff',
  'nc-search-results-border':         '#e5e7eb',
  'nc-search-results-border-width':   '1px',
  'nc-search-results-radius':         '6px',
  'nc-search-results-shadow':         '0 4px 16px rgba(0,0,0,0.12)',
  'nc-search-results-max-height':     '400px',
  'nc-search-results-padding':        '4px',
  'nc-search-results-z-index':        '50',
  'nc-search-item-height':            '32px',
  'nc-search-item-padding':           '8px 12px',
  'nc-search-item-radius':            '4px',
  'nc-search-item-color':             '#111827',
  'nc-search-item-bg-hover':          '#f3f4f6',
  'nc-search-item-icon-size':         '16px',
  'nc-search-item-icon-color':        '#6b7280',
  'nc-search-item-gap':               '8px',
  'nc-search-item-font-size':         '13px',
  'nc-search-highlight-bg':           'rgba(234,179,8,0.25)',
  'nc-search-highlight-color':        '#111827',
  'nc-search-group-label-color':      '#9ca3af',
  'nc-search-group-label-size':       '11px',
  'nc-search-group-label-weight':     '600',
  'nc-search-group-label-padding':    '8px 12px',
  'nc-search-shortcut-color':         '#9ca3af',
  'nc-search-shortcut-size':          '11px',
  'nc-search-xl-height':              '64px',
  'nc-search-xl-font-size':           '18px',
  'nc-search-xl-icon-size':           '24px',
  'nc-search-xl-radius':              '8px',
  'nc-search-xl-shadow':              '0 4px 16px rgba(0,0,0,0.12)',
}

const TOKEN_REFS = {
  'nc-search-results-bg':         'background-base',
  'nc-search-results-border':     'border-secondary',
  'nc-search-item-color':         'text-primary',
  'nc-search-item-bg-hover':      'background-hover',
  'nc-search-item-icon-color':    'text-secondary',
  'nc-search-highlight-color':    'text-primary',
  'nc-search-group-label-color':  'text-tertiary',
  'nc-search-shortcut-color':     'text-tertiary',
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'search') || null
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
// SVG Icons
// ---------------------------------------------------------------------------
function iconSearch(size = '16px', color = 'currentColor') {
  return h('svg', {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, 'stroke-width': '2',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    style: { flexShrink: '0', pointerEvents: 'none' },
    'aria-hidden': 'true',
  }, [
    h('circle', { cx: '11', cy: '11', r: '8' }),
    h('path', { d: 'm21 21-4.35-4.35' })
  ])
}

function iconClose(size = '14px', color = 'currentColor') {
  return h('svg', {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, 'stroke-width': '2.5',
    'stroke-linecap': 'round',
    style: { flexShrink: '0', pointerEvents: 'none' },
    'aria-hidden': 'true',
  }, [
    h('path', { d: 'M18 6 6 18M6 6l12 12' })
  ])
}

function iconDoc(size = '14px', color = 'currentColor') {
  return h('svg', {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, 'stroke-width': '2',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    style: { flexShrink: '0', pointerEvents: 'none' }
  }, [
    h('path', { d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z' }),
    h('polyline', { points: '14 2 14 8 20 8' })
  ])
}

function iconClock(size = '14px', color = 'currentColor') {
  return h('svg', {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, 'stroke-width': '2',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    style: { flexShrink: '0', pointerEvents: 'none' }
  }, [
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('polyline', { points: '12 6 12 12 16 14' })
  ])
}

function iconStar(size = '14px', color = 'currentColor') {
  return h('svg', {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: color, stroke: color, 'stroke-width': '2',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    style: { flexShrink: '0', pointerEvents: 'none' }
  }, [
    h('polygon', { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' })
  ])
}

// ---------------------------------------------------------------------------
// Style Builders
// ---------------------------------------------------------------------------
function searchInputWrapperStyle(theme, { height = '36px', focused = false } = {}) {
  const bg     = theme['background-base'] || '#ffffff'
  const border = focused
    ? (theme['interactive-default'] || '#0066cc')
    : (theme['border-primary'] || '#d1d5db')
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: height,
    padding: '0 10px',
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: '6px',
    boxShadow: focused ? `0 0 0 3px ${theme['interactive-default'] || '#0066cc'}26` : 'none',
    width: '100%',
    maxWidth: '320px',
    boxSizing: 'border-box',
  }
}

function searchPlaceholderStyle(theme) {
  return {
    flex: '1',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: '14px',
    color: theme['text-tertiary'] || '#9ca3af',
    fontFamily: 'inherit',
    cursor: 'text',
  }
}

function searchValueStyle(theme) {
  return {
    flex: '1',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: '14px',
    color: theme['text-primary'] || '#111827',
    fontFamily: 'inherit',
  }
}

function resultsContainerStyle(t, theme) {
  return {
    marginTop: '4px',
    background: t['nc-search-results-bg'] || '#ffffff',
    border: `${t['nc-search-results-border-width'] || '1px'} solid ${t['nc-search-results-border'] || '#e5e7eb'}`,
    borderRadius: t['nc-search-results-radius'] || '6px',
    boxShadow: t['nc-search-results-shadow'] || '0 4px 16px rgba(0,0,0,0.12)',
    padding: t['nc-search-results-padding'] || '4px',
    width: '100%',
    maxWidth: '320px',
    boxSizing: 'border-box',
  }
}

function resultItemStyle(t, theme, { hovered = false } = {}) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: t['nc-search-item-gap'] || '8px',
    height: t['nc-search-item-height'] || '32px',
    padding: t['nc-search-item-padding'] || '8px 12px',
    borderRadius: t['nc-search-item-radius'] || '4px',
    background: hovered ? (t['nc-search-item-bg-hover'] || '#f3f4f6') : 'transparent',
    color: t['nc-search-item-color'] || '#111827',
    fontSize: t['nc-search-item-font-size'] || '13px',
    cursor: 'pointer',
    boxSizing: 'border-box',
  }
}

function groupLabelStyle(t) {
  return {
    padding: t['nc-search-group-label-padding'] || '8px 12px',
    fontSize: t['nc-search-group-label-size'] || '11px',
    fontWeight: t['nc-search-group-label-weight'] || '600',
    color: t['nc-search-group-label-color'] || '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    lineHeight: '1.4',
  }
}

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
function renderSearchInput(theme, { height = '36px', value = '', placeholder = 'Suchen...', focused = false, showClear = false } = {}) {
  const iconColor = theme['text-tertiary'] || '#9ca3af'
  return h('div', { style: searchInputWrapperStyle(theme, { height, focused }) }, [
    iconSearch('16px', iconColor),
    value
      ? h('span', { style: searchValueStyle(theme) }, value)
      : h('span', { style: searchPlaceholderStyle(theme) }, placeholder),
    showClear
      ? h('button', {
          style: {
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '20px', height: '20px', border: 'none', background: 'transparent',
            borderRadius: '3px', cursor: 'pointer', color: iconColor, padding: '0',
          }
        }, [iconClose('12px', iconColor)])
      : null,
  ].filter(Boolean))
}

function renderResultItem(t, theme, { icon = null, label, highlight = null, hovered = false, badge = null } = {}) {
  const iconColor = t['nc-search-item-icon-color'] || '#6b7280'
  const labelNode = highlight
    ? h('span', {}, [
        label.slice(0, label.indexOf(highlight)),
        h('mark', {
          style: {
            background: t['nc-search-highlight-bg'] || 'rgba(234,179,8,0.25)',
            color: t['nc-search-highlight-color'] || 'inherit',
            borderRadius: '2px',
          }
        }, highlight),
        label.slice(label.indexOf(highlight) + highlight.length),
      ])
    : h('span', {}, label)

  return h('div', { style: resultItemStyle(t, theme, { hovered }) }, [
    icon ? h('span', { style: { color: iconColor, display: 'inline-flex' } }, [icon]) : null,
    labelNode,
    badge
      ? h('span', {
          style: {
            marginLeft: 'auto',
            fontSize: '10px',
            padding: '1px 5px',
            borderRadius: '3px',
            background: theme['background-tertiary'] || '#f3f4f6',
            color: theme['text-tertiary'] || '#9ca3af',
          }
        }, badge)
      : null,
  ].filter(Boolean))
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Default: empty search input
const SearchDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const theme = props.theme
      return h('div', { style: { padding: '16px' } }, [
        renderSearchInput(theme, { value: '', placeholder: 'Komponente suchen...' })
      ])
    }
  }
})

// With Results Dropdown
const SearchWithResults = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const theme = props.theme
      const results = [
        { icon: iconDoc('14px'), label: 'Button-Komponente',    highlight: 'Button', hovered: false },
        { icon: iconDoc('14px'), label: 'ButtonGroup-Rezept',   highlight: 'Button', hovered: true  },
        { icon: iconDoc('14px'), label: 'ButtonArena.vue',      highlight: 'Button', hovered: false },
        { icon: iconStar('14px', t['nc-search-item-icon-color'] || '#6b7280'), label: 'Favoriten: Button-Docs', highlight: null, hovered: false },
        { icon: iconClock('14px'), label: 'Zuletzt: ButtonArena', highlight: null, hovered: false, badge: 'Kürzlich' },
      ]

      return h('div', { style: { padding: '16px' } }, [
        renderSearchInput(theme, {
          value: 'Button',
          showClear: true,
          focused: true,
        }),
        h('div', { style: resultsContainerStyle(t, theme) }, [
          h('div', { style: groupLabelStyle(t) }, 'Ergebnisse'),
          ...results.map(r => renderResultItem(t, theme, r))
        ])
      ])
    }
  }
})

// States: Default / Active / Empty / Loading
const SearchStates = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const theme = props.theme
      const labelStyle = {
        fontSize: '11px',
        fontWeight: '600',
        color: theme['text-tertiary'] || '#9ca3af',
        marginBottom: '6px',
      }

      // Loading indicator dots
      const loadingDots = h('div', {
        style: {
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '12px',
          gap: '6px',
        }
      }, [1, 2, 3].map(i =>
        h('span', {
          style: {
            width: '6px', height: '6px', borderRadius: '50%',
            background: theme['text-tertiary'] || '#9ca3af',
            animation: `searchDotPulse 1.2s ease-in-out ${(i - 1) * 0.2}s infinite`,
            flexShrink: '0',
          }
        })
      ))

      return h('div', { class: 'arena-preview-stack', style: { padding: '16px', gap: '16px' } }, [
        // Default
        h('div', {}, [
          h('div', { style: labelStyle }, 'Default'),
          renderSearchInput(theme, { placeholder: 'Suchen...' }),
        ]),
        // Active (with text)
        h('div', {}, [
          h('div', { style: labelStyle }, 'Active'),
          renderSearchInput(theme, { value: 'Theme Configurator', showClear: true, focused: true }),
        ]),
        // Empty results
        h('div', {}, [
          h('div', { style: labelStyle }, 'Empty Results'),
          renderSearchInput(theme, { value: 'xyz123', showClear: true, focused: true }),
          h('div', {
            style: {
              ...resultsContainerStyle(t, theme),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px 12px',
              flexDirection: 'column',
              gap: '4px',
            }
          }, [
            h('span', { style: { fontSize: '13px', color: theme['text-secondary'] || '#6b7280' } }, 'Keine Ergebnisse gefunden'),
            h('span', { style: { fontSize: '11px', color: theme['text-tertiary'] || '#9ca3af' } }, 'Versuche einen anderen Suchbegriff'),
          ])
        ]),
        // Loading
        h('div', {}, [
          h('div', { style: labelStyle }, 'Loading'),
          renderSearchInput(theme, { value: 'Kompon', showClear: true, focused: true }),
          h('div', { style: resultsContainerStyle(t, theme) }, [loadingDots]),
        ]),
        // Keyframes
        h('style', {}, `
          @keyframes searchDotPulse {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50%       { opacity: 1;   transform: scale(1.2); }
          }
        `)
      ])
    }
  }
})

// Sizes: SM / MD / LG
const SearchSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const theme = props.theme
      const sizes = [
        { label: 'SM', height: '28px', fontSize: '12px' },
        { label: 'MD', height: '36px', fontSize: '14px' },
        { label: 'LG', height: '44px', fontSize: '16px' },
      ]
      const labelStyle = {
        fontSize: '11px',
        fontWeight: '600',
        minWidth: '24px',
        color: theme['text-secondary'] || '#6b7280',
      }
      const rows = sizes.map(s =>
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
          h('span', { style: labelStyle }, s.label),
          h('div', { style: { flex: '1' } }, [
            renderSearchInput(theme, { height: s.height, placeholder: 'Suchen...' })
          ])
        ])
      )
      return h('div', { class: 'arena-preview-stack', style: { padding: '16px', gap: '12px' } }, rows)
    }
  }
})
</script>
