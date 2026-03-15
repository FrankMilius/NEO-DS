<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default Popover (Open) -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default Popover — Offen mit Filter-Panel</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <PopoverDefault :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <PopoverDefault :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <PopoverDefault :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Placement Variants -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Platzierungs-Varianten — Bottom / Top / Left / Right</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <PopoverPlacements :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <PopoverPlacements :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <PopoverPlacements :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Arrow -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Mit Pfeil-Zeiger</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <PopoverWithArrow :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <PopoverWithArrow :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <PopoverWithArrow :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('popover')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-popover-bg':                '#ffffff',
  'nc-popover-radius':            '8px',
  'nc-popover-shadow':            '0 8px 24px rgba(0,0,0,0.12)',
  'nc-popover-border':            '1px solid #e2e8f0',
  'nc-popover-padding':           '16px',
  'nc-popover-max-width':         '320px',
  'nc-popover-offset':            '8px',
  'nc-popover-arrow-size':        '8px',
  'nc-popover-header-gap':        '8px',
  'nc-popover-header-border':     '1px solid #e2e8f0',
  'nc-popover-footer-border':     '1px solid #e2e8f0',
  'nc-popover-footer-gap':        '8px',
  'nc-popover-title-font-size':   '14px',
  'nc-popover-title-font-weight': '600',
  'nc-popover-title-color':       '#0f172a',
  'nc-popover-close-size':        '24px',
  'nc-popover-close-radius':      '4px',
  'nc-popover-close-bg':          'transparent',
  'nc-popover-close-bg-hover':    '#f1f5f9'
}

const TOKEN_REFS = {
  'nc-popover-bg':              'surface-elevated',
  'nc-popover-title-color':     'text-primary',
  'nc-popover-close-bg-hover':  'background-tertiary',
  'nc-popover-header-border':   'border-secondary',
  'nc-popover-footer-border':   'border-secondary'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'popover') || null
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
function renderTriggerButton(tokens, theme, label = 'Filter') {
  return h('button', {
    style: {
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '7px 14px',
      borderRadius: '6px',
      border: `1px solid ${theme['border-primary'] || '#cbd5e1'}`,
      background: theme['background-base'] || '#ffffff',
      color: theme['text-primary'] || '#0f172a',
      fontSize: '13px',
      fontWeight: '500',
      fontFamily: 'inherit',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    }
  }, [label, h('span', { style: { fontSize: '10px', opacity: '0.7' } }, '▼')])
}

function renderCloseBtn(tokens) {
  return h('button', {
    style: {
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: tokens['nc-popover-close-size'] || '24px',
      height: tokens['nc-popover-close-size'] || '24px',
      borderRadius: tokens['nc-popover-close-radius'] || '4px',
      border: 'none',
      background: tokens['nc-popover-close-bg'] || 'transparent',
      cursor: 'pointer',
      color: tokens['nc-popover-title-color'] || '#0f172a',
      fontSize: '16px',
      lineHeight: '1',
      opacity: '0.6',
      flexShrink: '0',
      fontFamily: 'inherit'
    }
  }, '×')
}

function renderPopoverPanel(tokens, theme, { title = '', children = [], footer = null, width = '280px' } = {}) {
  const borderColor = theme['border-secondary'] || '#e2e8f0'

  const headerEl = h('div', {
    style: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: tokens['nc-popover-header-gap'] || '8px',
      paddingBottom: '12px',
      marginBottom: '12px',
      borderBottom: `1px solid ${borderColor}`
    }
  }, [
    h('span', {
      style: {
        fontSize: tokens['nc-popover-title-font-size'] || '14px',
        fontWeight: tokens['nc-popover-title-font-weight'] || '600',
        color: tokens['nc-popover-title-color'] || '#0f172a'
      }
    }, title),
    renderCloseBtn(tokens)
  ])

  const panelStyle = {
    background: tokens['nc-popover-bg'] || '#ffffff',
    borderRadius: tokens['nc-popover-radius'] || '8px',
    boxShadow: tokens['nc-popover-shadow'] || '0 8px 24px rgba(0,0,0,0.12)',
    border: tokens['nc-popover-border'] || '1px solid #e2e8f0',
    padding: tokens['nc-popover-padding'] || '16px',
    width: width,
    boxSizing: 'border-box'
  }

  const panelChildren = [headerEl, ...children]
  if (footer) {
    panelChildren.push(h('div', {
      style: {
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: `1px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: tokens['nc-popover-footer-gap'] || '8px'
      }
    }, footer))
  }

  return h('div', { style: panelStyle }, panelChildren)
}

function renderCheckRow(tokens, theme, label, checked = false) {
  return h('label', {
    style: {
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '7px 0',
      cursor: 'pointer',
      fontSize: '13px',
      color: theme['text-primary'] || '#0f172a',
      fontFamily: 'inherit'
    }
  }, [
    h('span', {
      style: {
        width: '16px', height: '16px',
        borderRadius: '4px',
        border: `2px solid ${checked ? (theme['interactive-default'] || '#0066cc') : (theme['border-primary'] || '#cbd5e1')}`,
        background: checked ? (theme['interactive-default'] || '#0066cc') : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: '0',
        fontSize: '10px',
        color: '#fff'
      }
    }, checked ? '✓' : ''),
    h('span', {}, label)
  ])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Default Popover with filter panel
const PopoverDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const theme = props.theme

      const checkRows = [
        renderCheckRow(t, theme, 'Aktiv', true),
        renderCheckRow(t, theme, 'Inaktiv', false),
        renderCheckRow(t, theme, 'Entwurf', false)
      ]

      const footerContent = [
        h('button', {
          style: {
            background: 'none', border: 'none', padding: '0',
            cursor: 'pointer',
            fontSize: '13px',
            color: theme['text-secondary'] || '#475569',
            fontFamily: 'inherit'
          }
        }, 'Zurücksetzen'),
        h('button', {
          style: {
            padding: '6px 14px',
            borderRadius: '5px',
            border: 'none',
            background: theme['interactive-default'] || '#0066cc',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }
        }, 'Anwenden')
      ]

      return h('div', {
        style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }
      }, [
        renderTriggerButton(t, theme, 'Filter'),
        renderPopoverPanel(t, theme, {
          title: 'Filteroptionen',
          children: checkRows,
          footer: footerContent,
          width: '280px'
        })
      ])
    }
  }
})

// Placement Variants — 2×2 grid
const PopoverPlacements = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const theme = props.theme
      const borderColor = theme['border-secondary'] || '#e2e8f0'

      function miniPanel(label) {
        return h('div', {
          style: {
            background: t['nc-popover-bg'] || '#ffffff',
            borderRadius: t['nc-popover-radius'] || '8px',
            boxShadow: t['nc-popover-shadow'] || '0 8px 24px rgba(0,0,0,0.12)',
            border: t['nc-popover-border'] || `1px solid ${borderColor}`,
            padding: '10px 14px',
            fontSize: '12px',
            color: theme['text-secondary'] || '#475569',
            whiteSpace: 'nowrap'
          }
        }, [
          h('div', { style: { fontWeight: '600', color: theme['text-primary'] || '#0f172a', marginBottom: '4px', fontSize: '12px' } }, label),
          h('div', {}, 'Popover-Inhalt'),
          h('div', {}, 'Zeile zwei')
        ])
      }

      function placement(name, panelPos, triggerPos, direction) {
        const isVertical = direction === 'bottom' || direction === 'top'
        return h('div', {
          style: {
            display: 'flex',
            flexDirection: isVertical ? 'column' : 'row',
            alignItems: 'center',
            gap: '6px',
            position: 'relative'
          }
        }, [
          direction === 'bottom' || direction === 'right'
            ? [renderTriggerButton(t, theme, name), miniPanel(name)]
            : [miniPanel(name), renderTriggerButton(t, theme, name)]
        ])
      }

      return h('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          width: '100%'
        }
      }, [
        placement('Bottom', 'below', 'above', 'bottom'),
        placement('Top', 'above', 'below', 'top'),
        placement('Right', 'right', 'left', 'right'),
        placement('Left', 'left', 'right', 'left')
      ])
    }
  }
})

// With Arrow Pointer
const PopoverWithArrow = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const theme = props.theme
      const arrowSize = parseInt(t['nc-popover-arrow-size'] || '8', 10)
      const borderColor = theme['border-secondary'] || '#e2e8f0'
      const panelBg = t['nc-popover-bg'] || '#ffffff'

      const trigger = renderTriggerButton(t, theme, 'Info')

      // Arrow: rotated square connecting trigger to panel
      const arrowEl = h('div', {
        style: {
          width: `${arrowSize * 2}px`,
          height: `${arrowSize * 2}px`,
          background: panelBg,
          border: `1px solid ${borderColor}`,
          transform: 'rotate(45deg)',
          borderBottom: 'none',
          borderRight: 'none',
          alignSelf: 'center',
          marginBottom: `-${arrowSize}px`,
          position: 'relative',
          zIndex: '1',
          boxShadow: 'none'
        }
      })

      const headerEl = h('div', {
        style: {
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '8px'
        }
      }, [
        h('span', {
          style: {
            fontSize: t['nc-popover-title-font-size'] || '14px',
            fontWeight: t['nc-popover-title-font-weight'] || '600',
            color: t['nc-popover-title-color'] || '#0f172a'
          }
        }, 'Hinweis'),
        renderCloseBtn(t)
      ])

      const bodyEl = h('p', {
        style: {
          margin: '0',
          fontSize: '13px',
          color: theme['text-secondary'] || '#475569',
          lineHeight: '1.5'
        }
      }, 'Dieser Wert beeinflusst alle abhängigen Komponenten im aktuellen Theme.')

      const panel = h('div', {
        style: {
          background: panelBg,
          borderRadius: t['nc-popover-radius'] || '8px',
          boxShadow: t['nc-popover-shadow'] || '0 8px 24px rgba(0,0,0,0.12)',
          border: t['nc-popover-border'] || `1px solid ${borderColor}`,
          padding: t['nc-popover-padding'] || '16px',
          width: '260px',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: '2'
        }
      }, [headerEl, bodyEl])

      return h('div', {
        style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }
      }, [trigger, arrowEl, panel])
    }
  }
})
</script>
