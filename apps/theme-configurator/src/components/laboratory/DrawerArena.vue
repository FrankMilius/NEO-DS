<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Bottom Sheet -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Bottom Sheet</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <DrawerBottomSheet :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <DrawerBottomSheet :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <DrawerBottomSheet :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Direction Variants -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Richtungsvarianten — Bottom / Right / Top / Left</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <DrawerDirections :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <DrawerDirections :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <DrawerDirections :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Side Panel with Form -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Side Panel mit Formular</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <DrawerSidePanel :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <DrawerSidePanel :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <DrawerSidePanel :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('drawer')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-drawer-max-width':           '100%',
  'nc-drawer-max-height':          '80vh',
  'nc-drawer-width':               '100%',
  'nc-drawer-side-width':          '440px',
  'nc-drawer-padding':             '24px',
  'nc-drawer-radius':              '16px 16px 0 0',
  'nc-drawer-bg':                  '#ffffff',
  'nc-drawer-shadow':              '0 -4px 20px rgba(0,0,0,0.1)',
  'nc-drawer-overlay-bg':          'rgba(0,0,0,0.4)',
  'nc-drawer-title-font-size':     '17px',
  'nc-drawer-title-font-weight':   '600',
  'nc-drawer-title-color':         '#0f172a',
  'nc-drawer-desc-font-size':      '13px',
  'nc-drawer-desc-color':          '#64748b',
  'nc-drawer-header-gap':          '4px',
  'nc-drawer-header-border-color': '#e2e8f0',
  'nc-drawer-section-gap':         '20px',
  'nc-drawer-footer-gap':          '12px',
  'nc-drawer-footer-border-color': '#e2e8f0',
  'nc-drawer-handle-width':        '32px',
  'nc-drawer-handle-height':       '4px',
  'nc-drawer-handle-radius':       '9999px',
  'nc-drawer-handle-bg':           '#cbd5e1',
  'nc-drawer-close-size':          '32px',
  'nc-drawer-close-radius':        '6px',
  'nc-drawer-close-bg':            'transparent',
  'nc-drawer-close-bg-hover':      '#f1f5f9',
  'nc-drawer-close-icon-size':     '16px',
  'nc-drawer-close-offset':        '12px',
  'nc-drawer-duration':            '300ms',
  'nc-drawer-ease':                'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
}

const TOKEN_REFS = {
  'nc-drawer-bg':                  'surface-elevated',
  'nc-drawer-title-color':         'text-primary',
  'nc-drawer-desc-color':          'text-secondary',
  'nc-drawer-handle-bg':           'border-secondary',
  'nc-drawer-header-border-color': 'border-secondary',
  'nc-drawer-footer-border-color': 'border-secondary',
  'nc-drawer-close-bg-hover':      'background-tertiary',
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'drawer') || null
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
// Icons
// ---------------------------------------------------------------------------
const CLOSE_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
const EDIT_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"/></svg>`
const SHARE_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><line x1="8.7" y1="10.7" x2="15.3" y2="7.3"/><line x1="8.7" y1="13.3" x2="15.3" y2="16.7"/></svg>`
const TRASH_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7l16 0"/><path d="M10 11l0 6"/><path d="M14 11l0 6"/><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/></svg>`

// ---------------------------------------------------------------------------
// Shared Render Helpers
// ---------------------------------------------------------------------------
function renderHandle(tokens) {
  return h('div', {
    style: {
      display: 'flex',
      justifyContent: 'center',
      paddingBottom: '8px',
    }
  }, [
    h('div', {
      style: {
        width: tokens['nc-drawer-handle-width'] || '32px',
        height: tokens['nc-drawer-handle-height'] || '4px',
        borderRadius: tokens['nc-drawer-handle-radius'] || '9999px',
        background: tokens['nc-drawer-handle-bg'] || '#cbd5e1',
      }
    })
  ])
}

function renderCloseBtn(tokens) {
  const sz = tokens['nc-drawer-close-size'] || '32px'
  return h('button', {
    'aria-label': 'Schliessen',
    style: {
      width: sz,
      height: sz,
      minWidth: sz,
      borderRadius: tokens['nc-drawer-close-radius'] || '6px',
      border: 'none',
      background: tokens['nc-drawer-close-bg'] || 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'inherit',
      flexShrink: '0',
    },
    innerHTML: CLOSE_ICON,
  })
}

function cancelBtnStyle(theme) {
  return {
    padding: '8px 16px',
    borderRadius: '6px',
    border: `1px solid ${theme['border-primary'] || '#cbd5e1'}`,
    background: theme['background-secondary'] || '#f8fafc',
    color: theme['text-primary'] || '#0f172a',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    lineHeight: '1.4',
  }
}

function primaryBtnStyle(theme) {
  return {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    background: theme['interactive-default'] || '#0066cc',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    lineHeight: '1.4',
  }
}

function fullWidthPrimaryBtnStyle(theme) {
  return {
    ...primaryBtnStyle(theme),
    width: '100%',
    textAlign: 'center',
  }
}

// ---------------------------------------------------------------------------
// Bottom Sheet Renderer
// ---------------------------------------------------------------------------
function renderBottomSheet(tokens, theme) {
  const pad = tokens['nc-drawer-padding'] || '24px'

  const headerEl = h('div', {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingBottom: '12px',
    }
  }, [
    h('div', { style: { display: 'flex', flexDirection: 'column', gap: tokens['nc-drawer-header-gap'] || '4px' } }, [
      h('h3', {
        style: {
          margin: '0',
          fontSize: tokens['nc-drawer-title-font-size'] || '17px',
          fontWeight: tokens['nc-drawer-title-font-weight'] || '600',
          color: tokens['nc-drawer-title-color'] || '#0f172a',
          lineHeight: '1.3',
        }
      }, 'Optionen'),
      h('p', {
        style: {
          margin: '0',
          fontSize: tokens['nc-drawer-desc-font-size'] || '13px',
          color: tokens['nc-drawer-desc-color'] || '#64748b',
          lineHeight: '1.4',
        }
      }, 'Wählen Sie eine Aktion aus.'),
    ]),
    renderCloseBtn(tokens),
  ])

  const listItems = [
    { label: 'Bearbeiten', icon: EDIT_ICON },
    { label: 'Teilen',     icon: SHARE_ICON },
    { label: 'Löschen',    icon: TRASH_ICON, danger: true },
  ]

  const listEl = h('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      borderTop: `1px solid ${tokens['nc-drawer-header-border-color'] || '#e2e8f0'}`,
      borderBottom: `1px solid ${tokens['nc-drawer-footer-border-color'] || '#e2e8f0'}`,
    }
  }, listItems.map(item =>
    h('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 0',
        color: item.danger ? (theme['feedback-danger'] || '#dc2626') : (tokens['nc-drawer-title-color'] || '#0f172a'),
        fontSize: '14px',
        cursor: 'pointer',
        borderBottom: `1px solid ${tokens['nc-drawer-header-border-color'] || '#e2e8f0'}`,
      }
    }, [
      h('span', {
        style: { display: 'flex', alignItems: 'center', flexShrink: '0' },
        innerHTML: item.icon,
      }),
      h('span', {}, item.label),
    ])
  ))

  const footerEl = h('div', {
    style: { paddingTop: '16px' }
  }, [
    h('button', { style: fullWidthPrimaryBtnStyle(theme) }, 'Fertig'),
  ])

  return h('div', {
    style: {
      background: tokens['nc-drawer-bg'] || '#ffffff',
      borderRadius: tokens['nc-drawer-radius'] || '16px 16px 0 0',
      boxShadow: tokens['nc-drawer-shadow'] || '0 -4px 20px rgba(0,0,0,0.1)',
      padding: pad,
      width: '100%',
      maxWidth: '480px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    }
  }, [
    renderHandle(tokens),
    headerEl,
    listEl,
    footerEl,
  ])
}

// ---------------------------------------------------------------------------
// Direction Card Renderer
// ---------------------------------------------------------------------------
function renderDirectionCard(tokens, theme, direction) {
  const isHorizontal = direction === 'bottom' || direction === 'top'
  const labelMap = { bottom: 'Bottom', right: 'Right', top: 'Top', left: 'Left' }
  const radiusMap = {
    bottom: '12px 12px 0 0',
    top:    '0 0 12px 12px',
    right:  '12px 0 0 12px',
    left:   '0 12px 12px 0',
  }
  const shadowMap = {
    bottom: '0 -4px 16px rgba(0,0,0,0.12)',
    top:    '0 4px 16px rgba(0,0,0,0.12)',
    right:  '-4px 0 16px rgba(0,0,0,0.12)',
    left:   '4px 0 16px rgba(0,0,0,0.12)',
  }

  const cardStyle = {
    background: tokens['nc-drawer-bg'] || '#ffffff',
    borderRadius: radiusMap[direction],
    boxShadow: shadowMap[direction],
    width: isHorizontal ? '100%' : '80px',
    height: isHorizontal ? '60px' : '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    position: 'relative',
  }

  const handleEl = isHorizontal
    ? h('div', {
        style: {
          width: '24px',
          height: '3px',
          borderRadius: '9999px',
          background: tokens['nc-drawer-handle-bg'] || '#cbd5e1',
          position: 'absolute',
          ...(direction === 'bottom' ? { top: '8px' } : { bottom: '8px' }),
        }
      })
    : h('div', {
        style: {
          width: '3px',
          height: '24px',
          borderRadius: '9999px',
          background: tokens['nc-drawer-handle-bg'] || '#cbd5e1',
          position: 'absolute',
          ...(direction === 'right' ? { left: '6px' } : { right: '6px' }),
        }
      })

  return h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' } }, [
    h('div', { style: cardStyle }, [handleEl]),
    h('span', {
      style: { fontSize: '11px', fontWeight: '600', color: theme['text-secondary'] || '#64748b' }
    }, labelMap[direction]),
  ])
}

// ---------------------------------------------------------------------------
// Side Panel Renderer
// ---------------------------------------------------------------------------
function renderSidePanel(tokens, theme) {
  const pad = tokens['nc-drawer-padding'] || '24px'

  const headerEl = h('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${pad} ${pad} 16px`,
      borderBottom: `1px solid ${tokens['nc-drawer-header-border-color'] || '#e2e8f0'}`,
    }
  }, [
    h('h3', {
      style: {
        margin: '0',
        fontSize: tokens['nc-drawer-title-font-size'] || '17px',
        fontWeight: tokens['nc-drawer-title-font-weight'] || '600',
        color: tokens['nc-drawer-title-color'] || '#0f172a',
        lineHeight: '1.3',
      }
    }, 'Neues Projekt'),
    renderCloseBtn(tokens),
  ])

  const inputFieldStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: `1px solid ${theme['border-primary'] || '#cbd5e1'}`,
    background: theme['background-base'] || '#ffffff',
    color: theme['text-primary'] || '#0f172a',
    fontSize: '14px',
    lineHeight: '1.5',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    outline: 'none',
  }

  const textareaStyle = {
    ...inputFieldStyle,
    height: '80px',
    resize: 'none',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: tokens['nc-drawer-title-color'] || '#0f172a',
    marginBottom: '6px',
  }

  const bodyEl = h('div', {
    style: {
      flex: '1',
      padding: `16px ${pad}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }
  }, [
    h('div', {}, [
      h('label', { style: labelStyle }, 'Name'),
      h('input', {
        type: 'text',
        placeholder: 'z. B. Mein Projekt',
        style: inputFieldStyle,
      }),
    ]),
    h('div', {}, [
      h('label', { style: labelStyle }, 'Beschreibung'),
      h('textarea', {
        placeholder: 'Optionale Beschreibung...',
        style: textareaStyle,
      }),
    ]),
  ])

  const footerEl = h('div', {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: tokens['nc-drawer-footer-gap'] || '12px',
      padding: `16px ${pad}`,
      borderTop: `1px solid ${tokens['nc-drawer-footer-border-color'] || '#e2e8f0'}`,
    }
  }, [
    h('button', { style: cancelBtnStyle(theme) }, 'Abbrechen'),
    h('button', { style: primaryBtnStyle(theme) }, 'Speichern'),
  ])

  return h('div', {
    style: {
      background: tokens['nc-drawer-bg'] || '#ffffff',
      borderRadius: '12px 0 0 12px',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: tokens['nc-drawer-side-width'] || '440px',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }
  }, [headerEl, bodyEl, footerEl])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

const DrawerBottomSheet = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      return h('div', {
        style: { display: 'flex', justifyContent: 'center', width: '100%', padding: '8px 0' }
      }, [renderBottomSheet(props.tokens, props.theme)])
    }
  }
})

const DrawerDirections = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const th = props.theme
      const directions = ['bottom', 'right', 'top', 'left']
      return h('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          width: '100%',
          padding: '8px 0',
          justifyItems: 'center',
        }
      }, directions.map(dir => renderDirectionCard(t, th, dir)))
    }
  }
})

const DrawerSidePanel = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      return h('div', {
        style: { display: 'flex', justifyContent: 'flex-end', width: '100%', padding: '8px 0' }
      }, [renderSidePanel(props.tokens, props.theme)])
    }
  }
})
</script>
