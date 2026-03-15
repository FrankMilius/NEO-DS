<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Full Sidebar (Expanded) -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Vollständige Sidebar — Erweitert</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SidebarFull :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SidebarFull :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SidebarFull :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Collapsed Sidebar -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Kollabierte Sidebar — Icons Only</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SidebarCollapsed :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SidebarCollapsed :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SidebarCollapsed :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Nested Navigation -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Verschachtelte Navigation — Expand / Collapse</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SidebarNested :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SidebarNested :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SidebarNested :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('sidebar')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-sidebar-width':                    '240px',
  'nc-sidebar-width-collapsed':          '56px',
  'nc-sidebar-bg':                       '#f8fafc',
  'nc-sidebar-border-color':             '#e2e8f0',
  'nc-sidebar-padding':                  '16px',
  'nc-sidebar-group-gap':                '8px',
  'nc-sidebar-item-height':              '36px',
  'nc-sidebar-item-radius':              '6px',
  'nc-sidebar-item-padding':             '8px 12px',
  'nc-sidebar-item-gap':                 '8px',
  'nc-sidebar-item-color':               '#475569',
  'nc-sidebar-item-color-hover':         '#0f172a',
  'nc-sidebar-item-color-active':        '#0066cc',
  'nc-sidebar-item-bg-hover':            '#f1f5f9',
  'nc-sidebar-item-bg-active':           '#eff6ff',
  'nc-sidebar-item-font-size':           '14px',
  'nc-sidebar-item-font-weight':         '400',
  'nc-sidebar-item-font-weight-active':  '500',
  'nc-sidebar-group-label-size':         '11px',
  'nc-sidebar-group-label-color':        '#94a3b8',
  'nc-sidebar-group-label-weight':       '600',
  'nc-sidebar-group-label-spacing':      '0.08em',
  'nc-sidebar-nested-indent':            '20px',
  'nc-sidebar-badge-bg':                 '#dc2626',
  'nc-sidebar-badge-color':              '#ffffff',
  'nc-sidebar-badge-radius':             '9999px',
  'nc-sidebar-badge-size':               '18px',
  'nc-sidebar-header-height':            '56px',
  'nc-sidebar-footer-border-color':      '#e2e8f0'
}

const TOKEN_REFS = {
  'nc-sidebar-bg':                  'background-secondary',
  'nc-sidebar-border-color':        'border-secondary',
  'nc-sidebar-item-color':          'text-secondary',
  'nc-sidebar-item-color-hover':    'text-primary',
  'nc-sidebar-item-color-active':   'interactive-default',
  'nc-sidebar-item-bg-hover':       'background-tertiary',
  'nc-sidebar-item-bg-active':      'interactive-subtle',
  'nc-sidebar-group-label-color':   'text-tertiary',
  'nc-sidebar-footer-border-color': 'border-secondary',
  'nc-sidebar-badge-bg':            'feedback-danger'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'sidebar') || null
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
// Render Helpers
// ---------------------------------------------------------------------------
const ICON_COLORS = ['#6366f1', '#0066cc', '#0891b2', '#059669', '#d97706', '#dc2626']

function iconPlaceholder(size = '18px', colorIndex = 0) {
  return h('span', {
    style: {
      display: 'inline-block',
      width: size, height: size,
      borderRadius: '4px',
      background: ICON_COLORS[colorIndex % ICON_COLORS.length],
      flexShrink: '0'
    }
  })
}

function renderGroupLabel(tokens, label) {
  return h('div', {
    style: {
      padding: `4px ${tokens['nc-sidebar-padding'] || '16px'} 2px`,
      fontSize: tokens['nc-sidebar-group-label-size'] || '11px',
      fontWeight: tokens['nc-sidebar-group-label-weight'] || '600',
      color: tokens['nc-sidebar-group-label-color'] || '#94a3b8',
      letterSpacing: tokens['nc-sidebar-group-label-spacing'] || '0.08em',
      textTransform: 'uppercase'
    }
  }, label)
}

function renderNavItem(tokens, { label, active = false, indent = false, badge = null, iconIndex = 0 } = {}) {
  const paddingLeft = indent
    ? `calc(${tokens['nc-sidebar-padding'] || '16px'} + ${tokens['nc-sidebar-nested-indent'] || '20px'})`
    : tokens['nc-sidebar-padding'] || '16px'

  return h('div', {
    style: {
      display: 'flex', alignItems: 'center',
      gap: tokens['nc-sidebar-item-gap'] || '8px',
      height: tokens['nc-sidebar-item-height'] || '36px',
      paddingLeft,
      paddingRight: tokens['nc-sidebar-padding'] || '16px',
      borderRadius: tokens['nc-sidebar-item-radius'] || '6px',
      margin: '1px 8px',
      background: active ? (tokens['nc-sidebar-item-bg-active'] || '#eff6ff') : 'transparent',
      color: active
        ? (tokens['nc-sidebar-item-color-active'] || '#0066cc')
        : (tokens['nc-sidebar-item-color'] || '#475569'),
      fontSize: tokens['nc-sidebar-item-font-size'] || '14px',
      fontWeight: active
        ? (tokens['nc-sidebar-item-font-weight-active'] || '500')
        : (tokens['nc-sidebar-item-font-weight'] || '400'),
      cursor: 'pointer',
      boxSizing: 'border-box'
    }
  }, [
    iconPlaceholder('16px', iconIndex),
    h('span', { style: { flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, label),
    badge ? h('span', {
      style: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: tokens['nc-sidebar-badge-size'] || '18px',
        height: tokens['nc-sidebar-badge-size'] || '18px',
        padding: '0 5px',
        borderRadius: tokens['nc-sidebar-badge-radius'] || '9999px',
        background: tokens['nc-sidebar-badge-bg'] || '#dc2626',
        color: tokens['nc-sidebar-badge-color'] || '#ffffff',
        fontSize: '10px',
        fontWeight: '600',
        lineHeight: '1'
      }
    }, String(badge)) : null
  ].filter(Boolean))
}

function renderSidebarShell(tokens, theme, width, children) {
  return h('div', {
    style: {
      width: width,
      height: '480px',
      background: tokens['nc-sidebar-bg'] || '#f8fafc',
      border: `1px solid ${tokens['nc-sidebar-border-color'] || '#e2e8f0'}`,
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: '0'
    }
  }, children)
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Full Expanded Sidebar
const SidebarFull = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const theme = props.theme

      // Header
      const header = h('div', {
        style: {
          height: t['nc-sidebar-header-height'] || '56px',
          display: 'flex', alignItems: 'center',
          padding: `0 ${t['nc-sidebar-padding'] || '16px'}`,
          gap: '10px',
          borderBottom: `1px solid ${t['nc-sidebar-border-color'] || '#e2e8f0'}`,
          flexShrink: '0'
        }
      }, [
        iconPlaceholder('24px', 0),
        h('span', {
          style: {
            flex: '1',
            fontSize: '14px',
            fontWeight: '600',
            color: theme['text-primary'] || '#0f172a'
          }
        }, 'NEO Design'),
        h('span', {
          style: {
            fontSize: '16px',
            color: theme['text-tertiary'] || '#94a3b8',
            cursor: 'pointer',
            lineHeight: '1'
          }
        }, '☰')
      ])

      // Nav content
      const nav = h('div', {
        style: {
          flex: '1',
          overflowY: 'auto',
          paddingTop: '8px',
          paddingBottom: '8px'
        }
      }, [
        renderGroupLabel(t, 'Übersicht'),
        renderNavItem(t, { label: 'Dashboard', active: true, iconIndex: 1 }),
        renderNavItem(t, { label: 'Analytics', iconIndex: 2 }),
        renderNavItem(t, { label: 'Reports', iconIndex: 3 }),
        h('div', { style: { marginTop: t['nc-sidebar-group-gap'] || '8px' } }),
        renderGroupLabel(t, 'Verwaltung'),
        renderNavItem(t, { label: 'Users', iconIndex: 4, badge: 3 }),
        renderNavItem(t, { label: 'Settings', iconIndex: 5 }),
        renderNavItem(t, { label: 'Help', iconIndex: 0 })
      ])

      // Footer
      const footer = h('div', {
        style: {
          display: 'flex', alignItems: 'center',
          gap: '10px',
          padding: `12px ${t['nc-sidebar-padding'] || '16px'}`,
          borderTop: `1px solid ${t['nc-sidebar-footer-border-color'] || '#e2e8f0'}`,
          flexShrink: '0'
        }
      }, [
        h('div', {
          style: {
            width: '28px', height: '28px',
            borderRadius: '50%',
            background: ICON_COLORS[1],
            flexShrink: '0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', color: '#fff', fontWeight: '600'
          }
        }, 'FM'),
        h('span', {
          style: {
            flex: '1',
            fontSize: '13px',
            fontWeight: '500',
            color: theme['text-primary'] || '#0f172a',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }
        }, 'Frank M.'),
        h('span', {
          style: {
            fontSize: '14px',
            color: theme['text-tertiary'] || '#94a3b8',
            cursor: 'pointer'
          }
        }, '⚙')
      ])

      return renderSidebarShell(t, theme, t['nc-sidebar-width'] || '240px', [header, nav, footer])
    }
  }
})

// Collapsed Sidebar — icons only
const SidebarCollapsed = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const theme = props.theme
      const w = t['nc-sidebar-width-collapsed'] || '56px'

      function collapsedItem(iconIndex, active = false) {
        return h('div', {
          style: {
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: t['nc-sidebar-item-height'] || '36px',
            borderRadius: t['nc-sidebar-item-radius'] || '6px',
            margin: '1px 8px',
            background: active ? (t['nc-sidebar-item-bg-active'] || '#eff6ff') : 'transparent',
            cursor: 'pointer'
          }
        }, [iconPlaceholder('18px', iconIndex)])
      }

      const header = h('div', {
        style: {
          height: t['nc-sidebar-header-height'] || '56px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderBottom: `1px solid ${t['nc-sidebar-border-color'] || '#e2e8f0'}`,
          flexShrink: '0'
        }
      }, [iconPlaceholder('24px', 0)])

      const nav = h('div', {
        style: { flex: '1', paddingTop: '8px', paddingBottom: '8px' }
      }, [
        collapsedItem(1, true),
        collapsedItem(2),
        collapsedItem(3),
        h('div', { style: { height: '8px' } }),
        collapsedItem(4),
        collapsedItem(5),
        collapsedItem(0)
      ])

      const footer = h('div', {
        style: {
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '12px 0',
          borderTop: `1px solid ${t['nc-sidebar-footer-border-color'] || '#e2e8f0'}`,
          flexShrink: '0'
        }
      }, [
        h('div', {
          style: {
            width: '28px', height: '28px',
            borderRadius: '50%',
            background: ICON_COLORS[1],
            flexShrink: '0'
          }
        })
      ])

      return renderSidebarShell(t, theme, w, [header, nav, footer])
    }
  }
})

// Nested Navigation
const SidebarNested = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const theme = props.theme

      function parentItem(label, expanded = false, iconIndex = 0) {
        return h('div', {
          style: {
            display: 'flex', alignItems: 'center',
            gap: t['nc-sidebar-item-gap'] || '8px',
            height: t['nc-sidebar-item-height'] || '36px',
            paddingLeft: t['nc-sidebar-padding'] || '16px',
            paddingRight: t['nc-sidebar-padding'] || '16px',
            borderRadius: t['nc-sidebar-item-radius'] || '6px',
            margin: '1px 8px',
            color: t['nc-sidebar-item-color'] || '#475569',
            fontSize: t['nc-sidebar-item-font-size'] || '14px',
            fontWeight: '500',
            cursor: 'pointer',
            boxSizing: 'border-box'
          }
        }, [
          iconPlaceholder('16px', iconIndex),
          h('span', { style: { flex: '1' } }, label),
          h('span', {
            style: {
              fontSize: '10px',
              opacity: '0.7',
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
              display: 'inline-block',
              transition: 'transform 200ms'
            }
          }, '▶')
        ])
      }

      const nav = h('div', {
        style: { flex: '1', paddingTop: '8px', paddingBottom: '8px' }
      }, [
        renderNavItem(t, { label: 'Overview', iconIndex: 0 }),
        parentItem('Komponenten', true, 1),
        renderNavItem(t, { label: 'Button', indent: true, iconIndex: 2 }),
        renderNavItem(t, { label: 'Input', indent: true, iconIndex: 3 }),
        renderNavItem(t, { label: 'Modal', indent: true, active: true, iconIndex: 4 }),
        parentItem('Foundation', false, 5),
        renderNavItem(t, { label: 'Settings', iconIndex: 0 })
      ])

      const header = h('div', {
        style: {
          height: t['nc-sidebar-header-height'] || '56px',
          display: 'flex', alignItems: 'center',
          padding: `0 ${t['nc-sidebar-padding'] || '16px'}`,
          gap: '10px',
          borderBottom: `1px solid ${t['nc-sidebar-border-color'] || '#e2e8f0'}`,
          flexShrink: '0'
        }
      }, [
        iconPlaceholder('24px', 0),
        h('span', {
          style: {
            fontSize: '14px', fontWeight: '600',
            color: theme['text-primary'] || '#0f172a'
          }
        }, 'Navigation')
      ])

      return renderSidebarShell(t, theme, t['nc-sidebar-width'] || '240px', [header, nav])
    }
  }
})
</script>
