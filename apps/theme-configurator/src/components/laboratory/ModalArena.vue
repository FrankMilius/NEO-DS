<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default Modal (Full) -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default Modal — Vollständig</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ModalDefault :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ModalDefault :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ModalDefault :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Size Variants -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Größenvarianten — SM / MD / LG</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ModalSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ModalSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ModalSizes :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Danger Confirmation -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Danger Confirmation Modal</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ModalDanger :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ModalDanger :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ModalDanger :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('modal')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-dialog-max-width':            '560px',
  'nc-dialog-max-height':           '80vh',
  'nc-dialog-padding':              '24px',
  'nc-dialog-radius':               '8px',
  'nc-dialog-bg':                   '#ffffff',
  'nc-dialog-shadow':               '0 20px 60px rgba(0,0,0,0.15)',
  'nc-dialog-section-gap':          '20px',
  'nc-dialog-title-font-size':      '18px',
  'nc-dialog-title-font-weight':    '600',
  'nc-dialog-title-color':          '#0f172a',
  'nc-dialog-header-gap':           '12px',
  'nc-dialog-header-border-color':  '#e2e8f0',
  'nc-dialog-description-font-size': '14px',
  'nc-dialog-description-color':    '#64748b',
  'nc-dialog-footer-gap':           '12px',
  'nc-dialog-footer-border-color':  '#e2e8f0',
  'nc-dialog-close-size':           '32px',
  'nc-dialog-close-radius':         '6px',
  'nc-dialog-close-bg':             'transparent',
  'nc-dialog-close-bg-hover':       '#f1f5f9',
  'nc-dialog-close-icon-size':      '16px',
  'nc-dialog-danger-icon-color':    '#dc2626',
  'nc-dialog-danger-action-bg':     '#dc2626',
  'nc-dialog-danger-action-color':  '#ffffff',
}

const TOKEN_REFS = {
  'nc-dialog-bg':                   'surface-elevated',
  'nc-dialog-title-color':          'text-primary',
  'nc-dialog-description-color':    'text-secondary',
  'nc-dialog-header-border-color':  'border-secondary',
  'nc-dialog-footer-border-color':  'border-secondary',
  'nc-dialog-close-bg-hover':       'background-tertiary',
  'nc-dialog-danger-icon-color':    'feedback-danger',
  'nc-dialog-danger-action-bg':     'feedback-danger',
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'modal') || null
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
const WARNING_ICON = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.871l-8.106 -13.534a1.914 1.914 0 0 0 -3.274 0z"/><path d="M12 16h.01"/></svg>`

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
function modalCardStyle(tokens, maxWidth) {
  return {
    background: tokens['nc-dialog-bg'] || '#ffffff',
    borderRadius: tokens['nc-dialog-radius'] || '8px',
    boxShadow: tokens['nc-dialog-shadow'] || '0 20px 60px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: maxWidth || tokens['nc-dialog-max-width'] || '560px',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    overflow: 'hidden',
  }
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

function dangerBtnStyle(tokens) {
  return {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    background: tokens['nc-dialog-danger-action-bg'] || '#dc2626',
    color: tokens['nc-dialog-danger-action-color'] || '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    lineHeight: '1.4',
  }
}

function renderCloseBtn(tokens) {
  const sz = tokens['nc-dialog-close-size'] || '32px'
  return h('button', {
    'aria-label': 'Schliessen',
    style: {
      width: sz,
      height: sz,
      minWidth: sz,
      borderRadius: tokens['nc-dialog-close-radius'] || '6px',
      border: 'none',
      background: tokens['nc-dialog-close-bg'] || 'transparent',
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

function renderModalHeader(tokens, theme, title, dangerIcon = false) {
  const iconEl = dangerIcon
    ? h('span', {
        style: { color: tokens['nc-dialog-danger-icon-color'] || '#dc2626', display: 'flex', alignItems: 'center', flexShrink: '0' },
        innerHTML: WARNING_ICON,
      })
    : null

  const titleEl = h('h3', {
    style: {
      margin: '0',
      fontSize: tokens['nc-dialog-title-font-size'] || '18px',
      fontWeight: tokens['nc-dialog-title-font-weight'] || '600',
      color: tokens['nc-dialog-title-color'] || '#0f172a',
      lineHeight: '1.3',
      flex: '1',
    }
  }, title)

  const headerInnerChildren = dangerIcon ? [iconEl, titleEl] : [titleEl]

  return h('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens['nc-dialog-header-gap'] || '12px',
      padding: `${tokens['nc-dialog-padding'] || '24px'} ${tokens['nc-dialog-padding'] || '24px'} 16px`,
      borderBottom: `1px solid ${tokens['nc-dialog-header-border-color'] || '#e2e8f0'}`,
    }
  }, [
    h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', flex: '1' } }, headerInnerChildren),
    renderCloseBtn(tokens),
  ])
}

function renderModalBody(tokens, theme, bodyText) {
  return h('div', {
    style: {
      padding: `16px ${tokens['nc-dialog-padding'] || '24px'}`,
      flex: '1',
    }
  }, [
    h('p', {
      style: {
        margin: '0',
        fontSize: tokens['nc-dialog-description-font-size'] || '14px',
        color: tokens['nc-dialog-description-color'] || '#64748b',
        lineHeight: '1.6',
      }
    }, bodyText)
  ])
}

function renderModalFooter(tokens, theme, actions) {
  return h('div', {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: tokens['nc-dialog-footer-gap'] || '12px',
      padding: `16px ${tokens['nc-dialog-padding'] || '24px'}`,
      borderTop: `1px solid ${tokens['nc-dialog-footer-border-color'] || '#e2e8f0'}`,
    }
  }, actions)
}

function renderFullModal(tokens, theme) {
  return h('div', { style: modalCardStyle(tokens) }, [
    renderModalHeader(tokens, theme, 'Einstellungen'),
    renderModalBody(tokens, theme, 'Konfigurieren Sie die Einstellungen für Ihr Konto.'),
    renderModalFooter(tokens, theme, [
      h('button', { style: cancelBtnStyle(theme) }, 'Abbrechen'),
      h('button', { style: primaryBtnStyle(theme) }, 'Speichern'),
    ]),
  ])
}

function renderSizedModal(tokens, theme, label, maxWidth) {
  return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', flex: '1', minWidth: '0' } }, [
    h('span', {
      style: { fontSize: '11px', fontWeight: '600', color: theme['text-secondary'] || '#64748b', textAlign: 'center' }
    }, label),
    h('div', { style: { ...modalCardStyle(tokens, maxWidth), maxWidth: '100%' } }, [
      h('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `14px 16px`,
          borderBottom: `1px solid ${tokens['nc-dialog-header-border-color'] || '#e2e8f0'}`,
        }
      }, [
        h('span', {
          style: {
            fontSize: '14px',
            fontWeight: tokens['nc-dialog-title-font-weight'] || '600',
            color: tokens['nc-dialog-title-color'] || '#0f172a',
          }
        }, label + ' Modal'),
        renderCloseBtn(tokens),
      ]),
      h('div', { style: { padding: '12px 16px' } }, [
        h('p', {
          style: {
            margin: '0',
            fontSize: '12px',
            color: tokens['nc-dialog-description-color'] || '#64748b',
            lineHeight: '1.5',
          }
        }, 'Breite: ' + maxWidth)
      ]),
    ]),
  ])
}

function renderDangerModal(tokens, theme) {
  return h('div', { style: modalCardStyle(tokens) }, [
    renderModalHeader(tokens, theme, 'Konto löschen', true),
    renderModalBody(tokens, theme, 'Diese Aktion ist endgültig und kann nicht rückgängig gemacht werden.'),
    renderModalFooter(tokens, theme, [
      h('button', { style: cancelBtnStyle(theme) }, 'Abbrechen'),
      h('button', { style: dangerBtnStyle(tokens) }, 'Endgültig löschen'),
    ]),
  ])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

const ModalDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      return h('div', {
        style: { display: 'flex', justifyContent: 'center', width: '100%', padding: '8px 0' }
      }, [renderFullModal(props.tokens, props.theme)])
    }
  }
})

const ModalSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const th = props.theme
      const sizes = [
        { label: 'SM', width: '360px' },
        { label: 'MD', width: '560px' },
        { label: 'LG', width: '720px' },
      ]
      return h('div', {
        style: { display: 'flex', gap: '12px', width: '100%', padding: '8px 0', alignItems: 'flex-start' }
      }, sizes.map(s => renderSizedModal(t, th, s.label, s.width)))
    }
  }
})

const ModalDanger = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      return h('div', {
        style: { display: 'flex', justifyContent: 'center', width: '100%', padding: '8px 0' }
      }, [renderDangerModal(props.tokens, props.theme)])
    }
  }
})
</script>
