<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Basic Notification -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Basic Notification — Feature / System / Promo</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <NotificationBasic :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <NotificationBasic :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <NotificationBasic :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Unread State -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Unread State — Dot + Tinted Background</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <NotificationUnread :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <NotificationUnread :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <NotificationUnread :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Media + Actions -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Mit Media + Aktionen</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <NotificationMedia :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <NotificationMedia :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <NotificationMedia :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('notification')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-notification-padding':              '16px',
  'nc-notification-radius':               '8px',
  'nc-notification-shadow':               '0 4px 16px rgba(0,0,0,0.1)',
  'nc-notification-bg':                   '#ffffff',
  'nc-notification-border-width':         '1px',
  'nc-notification-border-color':         '#e2e8f0',
  'nc-notification-max-width':            '400px',
  'nc-notification-gap':                  '12px',
  'nc-notification-header-gap':           '4px',
  'nc-notification-title-size':           '14px',
  'nc-notification-title-weight':         '600',
  'nc-notification-title-color':          '#0f172a',
  'nc-notification-meta-size':            '12px',
  'nc-notification-meta-color':           '#94a3b8',
  'nc-notification-body-size':            '13px',
  'nc-notification-body-color':           '#475569',
  'nc-notification-body-line-height':     '1.5',
  'nc-notification-media-size':           '48px',
  'nc-notification-media-radius':         '8px',
  'nc-notification-unread-dot-size':      '8px',
  'nc-notification-unread-dot-color':     '#3b82f6',
  'nc-notification-unread-bg':            'rgba(59,130,246,0.06)',
  'nc-notification-close-size':           '28px',
  'nc-notification-close-radius':         '4px',
  'nc-notification-close-opacity':        '0.5',
  'nc-notification-close-opacity-hover':  '1',
  'nc-notification-footer-gap':           '8px',
  'nc-notification-action-size':          '13px',
  'nc-notification-action-weight':        '500',
  'nc-notification-action-color':         '#3b82f6',
  'nc-notification-priority-border-width':'4px',
  'nc-notification-priority-border-color':'#3b82f6',
  'nc-notification-feature-color':        '#3b82f6',
  'nc-notification-system-color':         '#f59e0b',
  'nc-notification-promo-color':          '#22c55e',
  'nc-notification-transition-duration':  '200ms',
  'nc-notification-dismiss-duration':     '300ms'
}

const TOKEN_REFS = {
  'nc-notification-bg':               'surface-elevated',
  'nc-notification-title-color':      'text-primary',
  'nc-notification-body-color':       'text-secondary',
  'nc-notification-meta-color':       'text-tertiary',
  'nc-notification-border-color':     'border-secondary',
  'nc-notification-action-color':     'interactive-default',
  'nc-notification-unread-dot-color': 'interactive-default',
  'nc-notification-feature-color':    'interactive-default'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'notification') || null
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
const TYPE_COLORS = {
  feature: { key: 'nc-notification-feature-color', fallback: '#3b82f6', label: 'Feature' },
  system:  { key: 'nc-notification-system-color',  fallback: '#f59e0b', label: 'System' },
  promo:   { key: 'nc-notification-promo-color',   fallback: '#22c55e', label: 'Promo' }
}

function renderCard(tokens, { type = 'feature', unread = false, body = '', title = '', meta = '' } = {}) {
  const typeInfo = TYPE_COLORS[type]
  const accentColor = tokens[typeInfo.key] || typeInfo.fallback
  const bg = unread ? (tokens['nc-notification-unread-bg'] || 'rgba(59,130,246,0.06)') : (tokens['nc-notification-bg'] || '#ffffff')

  const cardStyle = {
    position: 'relative',
    background: bg,
    borderRadius: tokens['nc-notification-radius'] || '8px',
    boxShadow: tokens['nc-notification-shadow'] || '0 4px 16px rgba(0,0,0,0.1)',
    border: `${tokens['nc-notification-border-width'] || '1px'} solid ${tokens['nc-notification-border-color'] || '#e2e8f0'}`,
    borderLeft: `${tokens['nc-notification-priority-border-width'] || '4px'} solid ${accentColor}`,
    padding: tokens['nc-notification-padding'] || '16px',
    maxWidth: tokens['nc-notification-max-width'] || '400px',
    width: '100%',
    boxSizing: 'border-box'
  }

  // Header row: title + meta + optional unread dot + close button
  const titleEl = h('span', {
    style: {
      fontSize: tokens['nc-notification-title-size'] || '14px',
      fontWeight: tokens['nc-notification-title-weight'] || '600',
      color: tokens['nc-notification-title-color'] || '#0f172a',
      lineHeight: '1.3'
    }
  }, title || 'Neue Nachricht')

  const metaEl = h('span', {
    style: {
      fontSize: tokens['nc-notification-meta-size'] || '12px',
      color: tokens['nc-notification-meta-color'] || '#94a3b8',
      marginTop: '2px'
    }
  }, meta || 'Vor 2 Minuten')

  const closeBtn = h('span', {
    style: {
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: tokens['nc-notification-close-size'] || '28px',
      height: tokens['nc-notification-close-size'] || '28px',
      borderRadius: tokens['nc-notification-close-radius'] || '4px',
      cursor: 'pointer',
      opacity: tokens['nc-notification-close-opacity'] || '0.5',
      color: tokens['nc-notification-title-color'] || '#0f172a',
      flexShrink: '0',
      fontSize: '16px',
      lineHeight: '1'
    }
  }, '×')

  const unreadDot = unread ? h('span', {
    style: {
      position: 'absolute',
      top: (tokens['nc-notification-padding'] || '16px'),
      right: (tokens['nc-notification-padding'] || '16px'),
      width: tokens['nc-notification-unread-dot-size'] || '8px',
      height: tokens['nc-notification-unread-dot-size'] || '8px',
      borderRadius: '50%',
      background: tokens['nc-notification-unread-dot-color'] || accentColor,
      flexShrink: '0'
    }
  }) : null

  const headerRow = h('div', {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: tokens['nc-notification-header-gap'] || '4px',
      marginBottom: '6px'
    }
  }, [
    h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px', flex: '1' } }, [titleEl, metaEl]),
    unread ? h('div', { style: { width: tokens['nc-notification-close-size'] || '28px' } }) : closeBtn
  ])

  const bodyEl = h('p', {
    style: {
      margin: '0',
      fontSize: tokens['nc-notification-body-size'] || '13px',
      color: tokens['nc-notification-body-color'] || '#475569',
      lineHeight: tokens['nc-notification-body-line-height'] || '1.5'
    }
  }, body || 'Stefan hat Ihnen eine neue Nachricht gesendet.')

  const typeBadge = h('span', {
    style: {
      display: 'inline-block',
      fontSize: '10px',
      fontWeight: '600',
      color: accentColor,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      marginBottom: '4px'
    }
  }, typeInfo.label)

  const children = [unreadDot, typeBadge, headerRow, bodyEl].filter(Boolean)
  return h('div', { style: cardStyle }, children)
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Basic Notification — 3 cards stacked (feature / system / promo)
const NotificationBasic = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const cards = [
        { type: 'feature', body: 'Ein neues Feature steht zur Verfügung.', title: 'Feature Update', meta: 'Vor 2 Minuten' },
        { type: 'system',  body: 'Wartungsarbeiten sind für heute Nacht geplant.', title: 'Systemhinweis', meta: 'Vor 1 Stunde' },
        { type: 'promo',   body: 'Ihr Abonnement wurde erfolgreich erneuert.', title: 'Aktion', meta: 'Gestern' }
      ]
      return h('div', { class: 'arena-preview-stack', style: { gap: '12px', width: '100%', maxWidth: '400px' } },
        cards.map(c => renderCard(t, c))
      )
    }
  }
})

// Unread State — 3 cards with unread dot and tinted bg
const NotificationUnread = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const cards = [
        { type: 'feature', unread: true, body: 'Neue Funktion verfügbar: Dunkelmodus.', title: 'Feature', meta: 'Gerade eben' },
        { type: 'system',  unread: true, body: 'Systemupdate erfolgreich abgeschlossen.', title: 'System', meta: 'Vor 5 Minuten' },
        { type: 'promo',   unread: true, body: 'Exklusives Angebot nur für Sie.', title: 'Promo', meta: 'Vor 10 Minuten' }
      ]
      return h('div', { class: 'arena-preview-stack', style: { gap: '12px', width: '100%', maxWidth: '400px' } },
        cards.map(c => renderCard(t, c))
      )
    }
  }
})

// With Media + Actions
const NotificationMedia = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const mediaSize = t['nc-notification-media-size'] || '48px'
      const accentColor = t['nc-notification-feature-color'] || '#3b82f6'

      const mediaEl = h('div', {
        style: {
          width: mediaSize,
          height: mediaSize,
          borderRadius: t['nc-notification-media-radius'] || '8px',
          background: t['nc-notification-border-color'] || '#e2e8f0',
          flexShrink: '0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px'
        }
      }, '👤')

      const titleEl = h('span', {
        style: {
          fontSize: t['nc-notification-title-size'] || '14px',
          fontWeight: t['nc-notification-title-weight'] || '600',
          color: t['nc-notification-title-color'] || '#0f172a',
          lineHeight: '1.3'
        }
      }, 'Stefan Müller')

      const metaEl = h('span', {
        style: {
          fontSize: t['nc-notification-meta-size'] || '12px',
          color: t['nc-notification-meta-color'] || '#94a3b8'
        }
      }, 'Vor 3 Minuten')

      const bodyEl = h('p', {
        style: {
          margin: '4px 0 0',
          fontSize: t['nc-notification-body-size'] || '13px',
          color: t['nc-notification-body-color'] || '#475569',
          lineHeight: t['nc-notification-body-line-height'] || '1.5'
        }
      }, 'Stefan hat Ihnen eine neue Nachricht gesendet.')

      const contentCol = h('div', {
        style: { display: 'flex', flexDirection: 'column', gap: '2px', flex: '1', minWidth: '0' }
      }, [titleEl, metaEl, bodyEl])

      const mainRow = h('div', {
        style: { display: 'flex', gap: t['nc-notification-gap'] || '12px', alignItems: 'flex-start' }
      }, [mediaEl, contentCol])

      const actionLink = (label) => h('button', {
        style: {
          background: 'none',
          border: 'none',
          padding: '0',
          cursor: 'pointer',
          fontSize: t['nc-notification-action-size'] || '13px',
          fontWeight: t['nc-notification-action-weight'] || '500',
          color: t['nc-notification-action-color'] || accentColor,
          fontFamily: 'inherit'
        }
      }, label)

      const footer = h('div', {
        style: {
          display: 'flex',
          gap: t['nc-notification-footer-gap'] || '8px',
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: `1px solid ${t['nc-notification-border-color'] || '#e2e8f0'}`
        }
      }, [actionLink('Anzeigen'), actionLink('Schliessen')])

      const cardStyle = {
        position: 'relative',
        background: t['nc-notification-bg'] || '#ffffff',
        borderRadius: t['nc-notification-radius'] || '8px',
        boxShadow: t['nc-notification-shadow'] || '0 4px 16px rgba(0,0,0,0.1)',
        border: `${t['nc-notification-border-width'] || '1px'} solid ${t['nc-notification-border-color'] || '#e2e8f0'}`,
        borderLeft: `${t['nc-notification-priority-border-width'] || '4px'} solid ${accentColor}`,
        padding: t['nc-notification-padding'] || '16px',
        maxWidth: t['nc-notification-max-width'] || '400px',
        width: '100%',
        boxSizing: 'border-box'
      }

      return h('div', { style: { width: '100%', maxWidth: '400px' } }, [
        h('div', { style: cardStyle }, [mainRow, footer])
      ])
    }
  }
})
</script>
