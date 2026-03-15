<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Feedback Variants -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Feedback Variants — Info / Success / Warning / Danger</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <AlertVariants :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <AlertVariants :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <AlertVariants :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Close Button -->
    <div class="arena-category-divider">
      <span class="arena-category-label">With Close Button</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <AlertDismissible :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <AlertDismissible :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <AlertDismissible :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Inline / No-Icon -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Inline / No-Icon — Compact</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <AlertInline :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <AlertInline :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <AlertInline :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('alert')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-alert-padding':             '16px 20px',
  'nc-alert-radius':              '4px',
  'nc-alert-border-width':        '1px',
  'nc-alert-icon-size':           '20px',
  'nc-alert-gap':                 '12px',
  'nc-alert-title-font-weight':   '600',
  'nc-alert-description-opacity': '0.8',
  'nc-alert-close-size':          '20px',
  'nc-alert-inline-gap':          '8px',
  'nc-alert-inline-font-size':    '13px',
  // Info
  'nc-alert-info-bg':             '#e3f2fd',
  'nc-alert-info-color':          '#1a1a1a',
  'nc-alert-info-border':         '#1565c0',
  'nc-alert-info-icon-color':     '#1565c0',
  // Success
  'nc-alert-success-bg':          '#e6f4ea',
  'nc-alert-success-color':       '#1a1a1a',
  'nc-alert-success-border':      '#1a7431',
  'nc-alert-success-icon-color':  '#1a7431',
  // Warning
  'nc-alert-warning-bg':          '#fef3e0',
  'nc-alert-warning-color':       '#1a1a1a',
  'nc-alert-warning-border':      '#e65100',
  'nc-alert-warning-icon-color':  '#e65100',
  // Danger
  'nc-alert-danger-bg':           '#fde8e8',
  'nc-alert-danger-color':        '#1a1a1a',
  'nc-alert-danger-border':       '#c62828',
  'nc-alert-danger-icon-color':   '#c62828',
}

const TOKEN_REFS = {
  'nc-alert-info-bg':            'background-info',
  'nc-alert-info-color':         'text-primary',
  'nc-alert-info-border':        'feedback-info',
  'nc-alert-info-icon-color':    'feedback-info',
  'nc-alert-success-bg':         'background-success',
  'nc-alert-success-color':      'text-primary',
  'nc-alert-success-border':     'border-success',
  'nc-alert-success-icon-color': 'feedback-success',
  'nc-alert-warning-bg':         'background-warning',
  'nc-alert-warning-color':      'text-primary',
  'nc-alert-warning-border':     'feedback-warning',
  'nc-alert-warning-icon-color': 'feedback-warning',
  'nc-alert-danger-bg':          'background-danger',
  'nc-alert-danger-color':       'text-primary',
  'nc-alert-danger-border':      'border-danger',
  'nc-alert-danger-icon-color':  'feedback-danger',
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'alert') || null
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
  info: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  success: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M9 12l2 2l4 -4"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.871l-8.106 -13.534a1.914 1.914 0 0 0 -3.274 0z"/><path d="M12 16h.01"/></svg>`,
  danger: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16h.01"/></svg>`,
}

const CLOSE_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
const TONE_META = {
  info:    { label: 'Info',    title: 'Information',          desc: 'Your session will expire in 15 minutes. Please save your work.' },
  success: { label: 'Success', title: 'Changes saved',        desc: 'Your profile has been updated successfully.' },
  warning: { label: 'Warning', title: 'Review required',      desc: 'Some fields are incomplete. Please check before submitting.' },
  danger:  { label: 'Danger',  title: 'Action failed',        desc: 'Unable to delete the record. Please try again or contact support.' },
}

function alertContainerStyle(tokens, tone) {
  const bg     = tokens[`nc-alert-${tone}-bg`]     || '#e3f2fd'
  const border = tokens[`nc-alert-${tone}-border`] || '#1565c0'
  const bw     = tokens['nc-alert-border-width']   || '1px'
  const radius = tokens['nc-alert-radius']         || '4px'
  const pad    = tokens['nc-alert-padding']        || '16px 20px'
  return {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens['nc-alert-gap'] || '12px',
    padding: pad,
    background: bg,
    border: `${bw} solid ${border}`,
    borderLeft: `3px solid ${border}`,
    borderRadius: radius,
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
  }
}

function renderAlert(tokens, tone, { showClose = false } = {}) {
  const meta = TONE_META[tone]
  const iconColor  = tokens[`nc-alert-${tone}-icon-color`] || '#1565c0'
  const textColor  = tokens[`nc-alert-${tone}-color`]      || '#1a1a1a'
  const titleWeight = tokens['nc-alert-title-font-weight']  || '600'
  const descOpacity = tokens['nc-alert-description-opacity'] || '0.8'

  const iconEl = h('span', {
    style: { color: iconColor, flexShrink: '0', lineHeight: '1', display: 'flex', alignItems: 'center' },
    innerHTML: ICONS[tone]
  })

  const titleEl = h('strong', {
    style: { fontWeight: titleWeight, color: textColor, fontSize: '14px', display: 'block', marginBottom: '4px' }
  }, meta.title)

  const descEl = h('p', {
    style: { color: textColor, opacity: descOpacity, fontSize: '13px', margin: '0', lineHeight: '1.5' }
  }, meta.desc)

  const contentEl = h('div', { style: { flex: '1', minWidth: '0' } }, [titleEl, descEl])

  const children = [iconEl, contentEl]

  if (showClose) {
    const closeEl = h('button', {
      'aria-label': 'Schliessen',
      style: {
        position: 'absolute', top: '8px', right: '8px',
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: textColor, opacity: '0.6', lineHeight: '1',
        display: 'flex', alignItems: 'center', padding: '2px',
        borderRadius: '2px',
      },
      innerHTML: CLOSE_ICON
    })
    children.push(closeEl)
  }

  return h('div', { style: alertContainerStyle(tokens, tone) }, children)
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

const AlertVariants = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const tones = ['info', 'success', 'warning', 'danger']
      return h('div', { class: 'arena-preview-stack', style: { gap: '8px' } },
        tones.map(tone => renderAlert(t, tone))
      )
    }
  }
})

const AlertDismissible = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      return h('div', { style: { width: '100%' } }, [
        renderAlert(t, 'info', { showClose: true })
      ])
    }
  }
})

const AlertInline = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const tones = ['info', 'success', 'warning', 'danger']
      const gap = t['nc-alert-inline-gap'] || '8px'
      const fontSize = t['nc-alert-inline-font-size'] || '13px'

      const rows = tones.map(tone => {
        const iconColor = t[`nc-alert-${tone}-icon-color`] || '#1565c0'
        const textColor = t[`nc-alert-${tone}-color`]      || '#1a1a1a'
        const meta = TONE_META[tone]
        return h('div', {
          style: {
            display: 'flex', alignItems: 'center', gap,
            fontSize, color: textColor, lineHeight: '1.4',
          }
        }, [
          h('span', {
            style: { color: iconColor, flexShrink: '0', lineHeight: '1', display: 'flex' },
            innerHTML: ICONS[tone]
          }),
          h('span', {}, `${meta.title} — ${meta.desc}`)
        ])
      })

      return h('div', { class: 'arena-preview-stack', style: { gap: '10px' } }, rows)
    }
  }
})
</script>
