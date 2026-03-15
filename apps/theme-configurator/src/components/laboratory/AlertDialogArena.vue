<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default Alert Dialog -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default Alert Dialog</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <AlertDialogDefault :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <AlertDialogDefault :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <AlertDialogDefault :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Destructive Alert Dialog -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Destructive Alert Dialog</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <AlertDialogDestructive :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <AlertDialogDestructive :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <AlertDialogDestructive :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Intent Comparison -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Intent Comparison — Default vs. Destructive</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <AlertDialogComparison :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <AlertDialogComparison :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <AlertDialogComparison :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('alert-dialog')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-dialog-max-width':            '480px',
  'nc-dialog-padding':              '24px',
  'nc-dialog-radius':               '8px',
  'nc-dialog-bg':                   '#ffffff',
  'nc-dialog-shadow':               '0 20px 60px rgba(0,0,0,0.15)',
  'nc-dialog-overlay-bg':           'rgba(0,0,0,0.5)',
  'nc-dialog-section-gap':          '20px',
  'nc-dialog-title-font-size':      '18px',
  'nc-dialog-title-font-weight':    '600',
  'nc-dialog-title-color':          '#0f172a',
  'nc-dialog-header-gap':           '8px',
  'nc-dialog-description-font-size': '14px',
  'nc-dialog-description-color':    '#64748b',
  'nc-dialog-footer-gap':           '12px',
  'nc-dialog-icon-size':            '24px',
  'nc-dialog-danger-icon-color':    '#dc2626',
  'nc-dialog-danger-action-bg':     '#dc2626',
  'nc-dialog-danger-action-color':  '#ffffff',
}

const TOKEN_REFS = {
  'nc-dialog-bg':                   'surface-elevated',
  'nc-dialog-title-color':          'text-primary',
  'nc-dialog-description-color':    'text-secondary',
  'nc-dialog-danger-icon-color':    'feedback-danger',
  'nc-dialog-danger-action-bg':     'feedback-danger',
  'nc-dialog-overlay-bg':           'background-secondary',
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'alert-dialog') || null
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
// Icons
// ---------------------------------------------------------------------------
const WARNING_ICON = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.871l-8.106 -13.534a1.914 1.914 0 0 0 -3.274 0z"/><path d="M12 16h.01"/></svg>`

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
function dialogCardStyle(tokens) {
  return {
    background: tokens['nc-dialog-bg'] || '#ffffff',
    borderRadius: tokens['nc-dialog-radius'] || '8px',
    boxShadow: tokens['nc-dialog-shadow'] || '0 20px 60px rgba(0,0,0,0.15)',
    padding: tokens['nc-dialog-padding'] || '24px',
    width: '100%',
    maxWidth: tokens['nc-dialog-max-width'] || '480px',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens['nc-dialog-section-gap'] || '20px',
    boxSizing: 'border-box',
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

function renderDefaultDialog(tokens, theme) {
  const headerEl = h('div', {
    style: { display: 'flex', flexDirection: 'column', gap: tokens['nc-dialog-header-gap'] || '8px' }
  }, [
    h('h3', {
      style: {
        margin: '0',
        fontSize: tokens['nc-dialog-title-font-size'] || '18px',
        fontWeight: tokens['nc-dialog-title-font-weight'] || '600',
        color: tokens['nc-dialog-title-color'] || '#0f172a',
        lineHeight: '1.3',
      }
    }, 'Sitzung beenden?'),
    h('p', {
      style: {
        margin: '0',
        fontSize: tokens['nc-dialog-description-font-size'] || '14px',
        color: tokens['nc-dialog-description-color'] || '#64748b',
        lineHeight: '1.5',
      }
    }, 'Alle nicht gespeicherten Änderungen gehen verloren.')
  ])

  const footerEl = h('div', {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: tokens['nc-dialog-footer-gap'] || '12px',
    }
  }, [
    h('button', { style: cancelBtnStyle(theme) }, 'Abbrechen'),
    h('button', { style: primaryBtnStyle(theme) }, 'Beenden'),
  ])

  return h('div', { style: dialogCardStyle(tokens) }, [headerEl, footerEl])
}

function renderDestructiveDialog(tokens, theme) {
  const iconEl = h('div', {
    style: {
      color: tokens['nc-dialog-danger-icon-color'] || '#dc2626',
      display: 'flex',
      alignItems: 'center',
    },
    innerHTML: WARNING_ICON,
  })

  const headerEl = h('div', {
    style: { display: 'flex', flexDirection: 'column', gap: tokens['nc-dialog-header-gap'] || '8px' }
  }, [
    iconEl,
    h('h3', {
      style: {
        margin: '0',
        fontSize: tokens['nc-dialog-title-font-size'] || '18px',
        fontWeight: tokens['nc-dialog-title-font-weight'] || '600',
        color: tokens['nc-dialog-title-color'] || '#0f172a',
        lineHeight: '1.3',
      }
    }, 'Eintrag löschen?'),
    h('p', {
      style: {
        margin: '0',
        fontSize: tokens['nc-dialog-description-font-size'] || '14px',
        color: tokens['nc-dialog-description-color'] || '#64748b',
        lineHeight: '1.5',
      }
    }, 'Diese Aktion kann nicht rückgängig gemacht werden.')
  ])

  const footerEl = h('div', {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: tokens['nc-dialog-footer-gap'] || '12px',
    }
  }, [
    h('button', { style: cancelBtnStyle(theme) }, 'Abbrechen'),
    h('button', { style: dangerBtnStyle(tokens) }, 'Löschen'),
  ])

  return h('div', { style: dialogCardStyle(tokens) }, [headerEl, footerEl])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

const AlertDialogDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      return h('div', {
        style: { display: 'flex', justifyContent: 'center', width: '100%', padding: '8px 0' }
      }, [renderDefaultDialog(props.tokens, props.theme)])
    }
  }
})

const AlertDialogDestructive = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      return h('div', {
        style: { display: 'flex', justifyContent: 'center', width: '100%', padding: '8px 0' }
      }, [renderDestructiveDialog(props.tokens, props.theme)])
    }
  }
})

const AlertDialogComparison = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const th = props.theme
      return h('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          width: '100%',
          padding: '8px 0',
        }
      }, [
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } }, [
          h('span', {
            style: { fontSize: '11px', fontWeight: '600', color: th['text-secondary'] || '#64748b', textAlign: 'center' }
          }, 'Default'),
          renderDefaultDialog(t, th),
        ]),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } }, [
          h('span', {
            style: { fontSize: '11px', fontWeight: '600', color: th['text-secondary'] || '#64748b', textAlign: 'center' }
          }, 'Destructive'),
          renderDestructiveDialog(t, th),
        ]),
      ])
    }
  }
})
</script>
