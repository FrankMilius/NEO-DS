<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: All Severity Tones -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Severity Tones — Default / Info / Success / Warning / Error</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ToastTones :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ToastTones :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ToastTones :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Action Button -->
    <div class="arena-category-divider">
      <span class="arena-category-label">With Action Button (Undo)</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ToastWithAction :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ToastWithAction :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ToastWithAction :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Stacked (Positioning) -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Stacked — Simulated Bottom-Right Position</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ToastStacked :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ToastStacked :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ToastStacked :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('toast')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-toast-padding':              '16px 20px',
  'nc-toast-radius':               '4px',
  'nc-toast-shadow':               '0 4px 12px rgba(0,0,0,0.15)',
  'nc-toast-border-width':         '1px',
  'nc-toast-item-gap':             '12px',
  'nc-toast-icon-size':            '20px',
  'nc-toast-font-size':            '13px',
  'nc-toast-description-font-size':'12px',
  'nc-toast-width':                '356px',
  'nc-toast-close-size':           '20px',
  'nc-toast-close-opacity':        '0.5',
  'nc-toast-action-padding':       '4px 12px',
  'nc-toast-action-radius':        '4px',
  'nc-toast-action-font-size':     '12px',
  // Default tone
  'nc-toast-default-bg':           '#ffffff',
  'nc-toast-default-color':        '#1a1a1a',
  'nc-toast-default-border':       '#e0e0e0',
  'nc-toast-default-icon-color':   '#6b7280',
  'nc-toast-default-progress-bg':  '#6b7280',
  // Success
  'nc-toast-success-bg':           '#e6f4ea',
  'nc-toast-success-color':        '#1a1a1a',
  'nc-toast-success-border':       '#1a7431',
  'nc-toast-success-icon-color':   '#1a7431',
  'nc-toast-success-progress-bg':  '#1a7431',
  // Warning
  'nc-toast-warning-bg':           '#fef3e0',
  'nc-toast-warning-color':        '#1a1a1a',
  'nc-toast-warning-border':       '#e65100',
  'nc-toast-warning-icon-color':   '#e65100',
  'nc-toast-warning-progress-bg':  '#e65100',
  // Error
  'nc-toast-error-bg':             '#fde8e8',
  'nc-toast-error-color':          '#1a1a1a',
  'nc-toast-error-border':         '#c62828',
  'nc-toast-error-icon-color':     '#c62828',
  'nc-toast-error-progress-bg':    '#c62828',
  // Info
  'nc-toast-info-bg':              '#e3f2fd',
  'nc-toast-info-color':           '#1a1a1a',
  'nc-toast-info-border':          '#1565c0',
  'nc-toast-info-icon-color':      '#1565c0',
  'nc-toast-info-progress-bg':     '#1565c0',
}

const TOKEN_REFS = {
  'nc-toast-default-bg':           'surface-elevated',
  'nc-toast-default-color':        'text-primary',
  'nc-toast-default-border':       'border-primary',
  'nc-toast-default-icon-color':   'text-secondary',
  'nc-toast-success-bg':           'background-success',
  'nc-toast-success-color':        'text-primary',
  'nc-toast-success-border':       'border-success',
  'nc-toast-success-icon-color':   'feedback-success',
  'nc-toast-warning-bg':           'background-warning',
  'nc-toast-warning-color':        'text-primary',
  'nc-toast-warning-border':       'feedback-warning',
  'nc-toast-warning-icon-color':   'feedback-warning',
  'nc-toast-error-bg':             'background-danger',
  'nc-toast-error-color':          'text-primary',
  'nc-toast-error-border':         'border-danger',
  'nc-toast-error-icon-color':     'feedback-danger',
  'nc-toast-info-bg':              'background-info',
  'nc-toast-info-color':           'text-primary',
  'nc-toast-info-border':          'feedback-info',
  'nc-toast-info-icon-color':      'feedback-info',
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'toast') || null
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
// Icon SVGs
// ---------------------------------------------------------------------------
const ICONS = {
  default: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  info:    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  success: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M9 12l2 2l4 -4"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.871l-8.106 -13.534a1.914 1.914 0 0 0 -3.274 0z"/><path d="M12 16h.01"/></svg>`,
  error:   `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16h.01"/></svg>`,
}

const CLOSE_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
const TONE_META = {
  default: { title: 'Update available',       desc: 'A new version is ready to install.' },
  info:    { title: 'Information',             desc: 'Your request is being processed.' },
  success: { title: 'Saved successfully',      desc: 'Your changes have been saved.' },
  warning: { title: 'Low disk space',          desc: 'Less than 10% storage remaining.' },
  error:   { title: 'Upload failed',           desc: 'Could not reach the server. Retry.' },
}

function toastStyle(tokens, tone) {
  const bg     = tokens[`nc-toast-${tone}-bg`]     || '#fff'
  const border = tokens[`nc-toast-${tone}-border`] || '#e0e0e0'
  const bw     = tokens['nc-toast-border-width']   || '1px'
  return {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens['nc-toast-item-gap'] || '12px',
    padding: tokens['nc-toast-padding'] || '16px 20px',
    background: bg,
    border: `${bw} solid ${border}`,
    borderRadius: tokens['nc-toast-radius'] || '4px',
    boxShadow: tokens['nc-toast-shadow'] || '0 4px 12px rgba(0,0,0,0.15)',
    width: tokens['nc-toast-width'] || '356px',
    maxWidth: '100%',
    boxSizing: 'border-box',
    position: 'relative',
  }
}

function renderToast(tokens, tone, { showAction = false, actionLabel = 'Undo' } = {}) {
  const meta      = TONE_META[tone]
  const iconColor = tokens[`nc-toast-${tone}-icon-color`] || '#6b7280'
  const textColor = tokens[`nc-toast-${tone}-color`]      || '#1a1a1a'
  const fontSize  = tokens['nc-toast-font-size']          || '13px'
  const descSize  = tokens['nc-toast-description-font-size'] || '12px'

  const iconEl = h('span', {
    style: { color: iconColor, flexShrink: '0', lineHeight: '1', display: 'flex', alignItems: 'center', marginTop: '1px' },
    innerHTML: ICONS[tone]
  })

  const titleEl = h('div', {
    style: { fontWeight: '500', color: textColor, fontSize, lineHeight: '1.4', marginBottom: '2px' }
  }, meta.title)

  const descEl = h('div', {
    style: { color: textColor, opacity: '0.7', fontSize: descSize, lineHeight: '1.4' }
  }, meta.desc)

  const contentChildren = [titleEl, descEl]

  if (showAction) {
    const actionStyle = {
      display: 'inline-flex', alignItems: 'center',
      marginTop: '8px', padding: tokens['nc-toast-action-padding'] || '4px 12px',
      borderRadius: tokens['nc-toast-action-radius'] || '4px',
      fontSize: tokens['nc-toast-action-font-size'] || '12px',
      fontWeight: '500', cursor: 'pointer',
      border: `1px solid ${textColor}`,
      color: textColor, background: 'transparent',
    }
    contentChildren.push(h('button', { style: actionStyle }, actionLabel))
  }

  const contentEl = h('div', { style: { flex: '1', minWidth: '0' } }, contentChildren)

  const closeEl = h('button', {
    'aria-label': 'Schliessen',
    style: {
      background: 'transparent', border: 'none', cursor: 'pointer',
      color: textColor, opacity: tokens['nc-toast-close-opacity'] || '0.5',
      lineHeight: '1', display: 'flex', alignItems: 'center',
      padding: '0', flexShrink: '0', marginTop: '1px',
    },
    innerHTML: CLOSE_ICON
  })

  return h('div', { style: toastStyle(tokens, tone) }, [iconEl, contentEl, closeEl])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

const ToastTones = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const tones = ['default', 'info', 'success', 'warning', 'error']
      return h('div', { class: 'arena-preview-stack', style: { gap: '8px', alignItems: 'flex-start' } },
        tones.map(tone => renderToast(t, tone))
      )
    }
  }
})

const ToastWithAction = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      return h('div', { class: 'arena-preview-stack', style: { gap: '8px', alignItems: 'flex-start' } }, [
        renderToast(t, 'default', { showAction: true, actionLabel: 'Undo' }),
        renderToast(t, 'error',   { showAction: true, actionLabel: 'Retry' }),
      ])
    }
  }
})

const ToastStacked = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const stack = [
        { tone: 'success', title: 'File uploaded',      desc: 'report-q4.pdf is ready.' },
        { tone: 'warning', title: 'Session expiring',   desc: 'You will be logged out in 5 min.' },
        { tone: 'default', title: 'Update available',   desc: 'Refresh the page to apply.' },
      ]

      // Render simulated bottom-right stack
      const toasts = stack.map(({ tone, title, desc }, i) => {
        const bg     = t[`nc-toast-${tone}-bg`]     || '#fff'
        const border = t[`nc-toast-${tone}-border`] || '#e0e0e0'
        const bw     = t['nc-toast-border-width']   || '1px'
        const iconColor = t[`nc-toast-${tone}-icon-color`] || '#6b7280'
        const textColor = t[`nc-toast-${tone}-color`]      || '#1a1a1a'
        const fontSize  = t['nc-toast-font-size']          || '13px'
        const descSize  = t['nc-toast-description-font-size'] || '12px'

        return h('div', {
          style: {
            display: 'flex', alignItems: 'flex-start',
            gap: t['nc-toast-item-gap'] || '12px',
            padding: t['nc-toast-padding'] || '16px 20px',
            background: bg,
            border: `${bw} solid ${border}`,
            borderRadius: t['nc-toast-radius'] || '4px',
            boxShadow: t['nc-toast-shadow'] || '0 4px 12px rgba(0,0,0,0.15)',
            width: t['nc-toast-width'] || '356px',
            maxWidth: '100%',
            boxSizing: 'border-box',
            opacity: i === 0 ? '1' : i === 1 ? '0.85' : '0.7',
            transform: i === 0 ? 'none' : `translateY(${i * -4}px) scale(${1 - i * 0.02})`,
          }
        }, [
          h('span', {
            style: { color: iconColor, flexShrink: '0', lineHeight: '1', display: 'flex', alignItems: 'center', marginTop: '1px' },
            innerHTML: ICONS[tone]
          }),
          h('div', { style: { flex: '1' } }, [
            h('div', { style: { fontWeight: '500', color: textColor, fontSize, lineHeight: '1.4', marginBottom: '2px' } }, title),
            h('div', { style: { color: textColor, opacity: '0.7', fontSize: descSize, lineHeight: '1.4' } }, desc),
          ]),
          h('button', {
            'aria-label': 'Schliessen',
            style: { background: 'transparent', border: 'none', cursor: 'pointer', color: textColor, opacity: '0.5', display: 'flex', padding: '0', flexShrink: '0' },
            innerHTML: CLOSE_ICON
          })
        ])
      })

      return h('div', {
        style: {
          display: 'flex', flexDirection: 'column', gap: '8px',
          alignItems: 'flex-end', width: '100%',
          padding: '8px',
        }
      }, toasts)
    }
  }
})
</script>
