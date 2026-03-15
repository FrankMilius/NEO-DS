<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Severity Variants -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Severity Variants — Info / Warning / Danger / Success</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <BannerVariants :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <BannerVariants :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <BannerVariants :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Action / CTA -->
    <div class="arena-category-divider">
      <span class="arena-category-label">With Action — Title + CTA Link</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <BannerWithAction :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <BannerWithAction :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <BannerWithAction :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Dismissible -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Dismissible — All Severities with Close Button</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <BannerDismissible :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <BannerDismissible :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <BannerDismissible :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('banner')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-banner-padding':              '12px 20px',
  'nc-banner-gap':                  '12px',
  'nc-banner-font-size':            '13px',
  'nc-banner-font-weight':          '500',
  'nc-banner-icon-size':            '16px',
  'nc-banner-title-weight':         '700',
  'nc-banner-close-size':           '20px',
  'nc-banner-close-radius':         '4px',
  'nc-banner-close-opacity':        '0.6',
  'nc-banner-link-weight':          '700',
  // Info
  'nc-banner-info-bg':              '#002049',
  'nc-banner-info-color':           '#ffffff',
  // Warning
  'nc-banner-warning-bg':           '#f59e0b',
  'nc-banner-warning-color':        '#1a1a1a',
  // Danger
  'nc-banner-danger-bg':            '#da1e28',
  'nc-banner-danger-color':         '#ffffff',
  // Success
  'nc-banner-success-bg':           '#24a148',
  'nc-banner-success-color':        '#ffffff',
}

const TOKEN_REFS = {
  'nc-banner-info-bg':       'interactive-default',
  'nc-banner-info-color':    'text-on-interactive',
  'nc-banner-warning-bg':    'feedback-warning',
  'nc-banner-warning-color': 'on-warning',
  'nc-banner-danger-bg':     'feedback-danger',
  'nc-banner-danger-color':  'on-danger',
  'nc-banner-success-bg':    'feedback-success',
  'nc-banner-success-color': 'on-success',
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'banner') || null
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
// Icon SVGs (16px for banner)
// ---------------------------------------------------------------------------
const ICONS = {
  info:    `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  success: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M9 12l2 2l4 -4"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.871l-8.106 -13.534a1.914 1.914 0 0 0 -3.274 0z"/><path d="M12 16h.01"/></svg>`,
  danger:  `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16h.01"/></svg>`,
}

const CLOSE_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
const TONE_META = {
  info:    { label: 'Info',    text: 'New features are available in this release.' },
  warning: { label: 'Warning', text: 'Scheduled maintenance on Sunday, 02:00–04:00 UTC.' },
  danger:  { label: 'Danger',  text: 'Critical security update required. Please act immediately.' },
  success: { label: 'Success', text: 'All systems are operational. No incidents reported.' },
}

function bannerContainerStyle(tokens, tone) {
  const bg    = tokens[`nc-banner-${tone}-bg`]    || '#002049'
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens['nc-banner-gap'] || '12px',
    padding: tokens['nc-banner-padding'] || '12px 20px',
    background: bg,
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    fontFamily: 'inherit',
  }
}

function renderBanner(tokens, tone, { showClose = false, showAction = false, showTitle = false } = {}) {
  const meta      = TONE_META[tone]
  const textColor = tokens[`nc-banner-${tone}-color`] || '#fff'
  const fontSize  = tokens['nc-banner-font-size']     || '13px'
  const fontWeight = tokens['nc-banner-font-weight']  || '500'

  const children = []

  // Icon
  children.push(h('span', {
    style: { color: textColor, flexShrink: '0', lineHeight: '1', display: 'flex', alignItems: 'center' },
    innerHTML: ICONS[tone]
  }))

  // Content row
  const contentChildren = []

  if (showTitle) {
    contentChildren.push(
      h('strong', {
        style: { fontWeight: tokens['nc-banner-title-weight'] || '700', marginRight: '6px', color: textColor }
      }, `${meta.label}:`)
    )
  }

  contentChildren.push(
    h('span', { style: { color: textColor } }, meta.text)
  )

  if (showAction) {
    contentChildren.push(
      h('a', {
        href: '#',
        onClick: (e) => e.preventDefault(),
        style: {
          color: textColor,
          fontWeight: tokens['nc-banner-link-weight'] || '700',
          textDecoration: 'underline',
          marginLeft: '8px',
          fontSize,
        }
      }, 'Learn more')
    )
  }

  children.push(h('div', {
    style: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px', fontSize, fontWeight }
  }, contentChildren))

  if (showClose) {
    children.push(h('button', {
      'aria-label': 'Banner schliessen',
      style: {
        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: textColor, opacity: tokens['nc-banner-close-opacity'] || '0.6',
        display: 'flex', alignItems: 'center', padding: '4px',
        borderRadius: tokens['nc-banner-close-radius'] || '4px',
      },
      innerHTML: CLOSE_ICON
    }))
  }

  return h('div', { style: bannerContainerStyle(tokens, tone) }, children)
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

const BannerVariants = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const tones = ['info', 'warning', 'danger', 'success']
      return h('div', { class: 'arena-preview-stack', style: { gap: '4px' } },
        tones.map(tone => renderBanner(t, tone))
      )
    }
  }
})

const BannerWithAction = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      return h('div', { class: 'arena-preview-stack', style: { gap: '4px' } }, [
        renderBanner(t, 'info',    { showTitle: true, showAction: true }),
        renderBanner(t, 'warning', { showTitle: true, showAction: true }),
      ])
    }
  }
})

const BannerDismissible = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const tones = ['info', 'warning', 'danger', 'success']
      return h('div', { class: 'arena-preview-stack', style: { gap: '4px' } },
        tones.map(tone => renderBanner(t, tone, { showClose: true }))
      )
    }
  }
})
</script>
