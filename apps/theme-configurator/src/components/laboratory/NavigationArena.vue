<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default Navigation -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default Navigation (Default + Scrolled)</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <NavDefault :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <NavDefault :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <NavDefault :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Emphasis Variants -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Emphasis Variants — Default / Transparent / Solid</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <NavEmphasis :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <NavEmphasis :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <NavEmphasis :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Alignment Variants -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Alignment Variants — Start / Center / End</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <NavAlignment :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <NavAlignment :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <NavAlignment :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('navigation')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-nav-bg':                   'rgba(255,255,255,0.9)',
  'nc-nav-height':               '64px',
  'nc-nav-padding-x':            '24px',
  'nc-nav-border-color':         '#e2e8f0',
  'nc-nav-shadow':               '0 1px 3px rgba(0,0,0,0.06)',
  'nc-nav-backdrop-blur':        '12px',
  'nc-nav-brand-color':          '#0f172a',
  'nc-nav-brand-font-size':      '16px',
  'nc-nav-brand-font-weight':    '700',
  'nc-nav-link-color':           '#475569',
  'nc-nav-link-color-hover':     '#0f172a',
  'nc-nav-link-color-active':    '#0066cc',
  'nc-nav-link-bg-hover':        '#f1f5f9',
  'nc-nav-link-radius':          '6px',
  'nc-nav-link-padding':         '6px 10px',
  'nc-nav-link-font-size':       '14px',
  'nc-nav-link-font-weight':     '500',
  'nc-nav-link-active-indicator':'2px',
  'nc-nav-link-active-color':    '#0066cc',
  'nc-nav-action-gap':           '8px',
  'nc-nav-gap':                  '4px'
}

const TOKEN_REFS = {
  'nc-nav-brand-color':          'text-primary',
  'nc-nav-link-color':           'text-secondary',
  'nc-nav-link-color-hover':     'text-primary',
  'nc-nav-link-color-active':    'interactive-default',
  'nc-nav-link-bg-hover':        'background-tertiary',
  'nc-nav-link-active-color':    'interactive-default',
  'nc-nav-border-color':         'border-secondary'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'navigation') || null
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
// Style Builders
// ---------------------------------------------------------------------------
function navBarStyle(tokens, theme, { scrolled = false, bg = null, borderColor = null } = {}) {
  return {
    display: 'flex',
    alignItems: 'center',
    height: tokens['nc-nav-height'],
    paddingLeft: tokens['nc-nav-padding-x'],
    paddingRight: tokens['nc-nav-padding-x'],
    background: bg || tokens['nc-nav-bg'],
    borderBottom: `1px solid ${borderColor || tokens['nc-nav-border-color']}`,
    boxShadow: scrolled ? tokens['nc-nav-shadow'] : 'none',
    gap: '0',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '6px',
    overflow: 'hidden'
  }
}

function brandStyle(tokens, { color = null } = {}) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: color || tokens['nc-nav-brand-color'],
    fontSize: tokens['nc-nav-brand-font-size'],
    fontWeight: tokens['nc-nav-brand-font-weight'],
    textDecoration: 'none',
    flexShrink: '0',
    whiteSpace: 'nowrap'
  }
}

function logoCircleStyle(color) {
  return {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    background: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0'
  }
}

function navLinkStyle(tokens, { active = false, hover = false, color = null } = {}) {
  let linkColor = color || tokens['nc-nav-link-color']
  if (active) linkColor = color || tokens['nc-nav-link-color-active']
  else if (hover) linkColor = color || tokens['nc-nav-link-color-hover']
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: tokens['nc-nav-link-padding'],
    borderRadius: tokens['nc-nav-link-radius'],
    background: hover ? tokens['nc-nav-link-bg-hover'] : 'transparent',
    color: linkColor,
    fontSize: tokens['nc-nav-link-font-size'],
    fontWeight: tokens['nc-nav-link-font-weight'],
    textDecoration: 'none',
    cursor: 'pointer',
    position: 'relative',
    whiteSpace: 'nowrap'
  }
}

function activeLinkUnderline(tokens) {
  return {
    position: 'absolute',
    bottom: '0',
    left: '10px',
    right: '10px',
    height: tokens['nc-nav-link-active-indicator'],
    background: tokens['nc-nav-link-active-color'],
    borderRadius: '1px'
  }
}

function ghostBtnStyle(tokens, theme, { textColor = null } = {}) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 14px',
    borderRadius: '6px',
    border: `1px solid ${tokens['nc-nav-border-color']}`,
    background: 'transparent',
    color: textColor || tokens['nc-nav-brand-color'],
    fontSize: tokens['nc-nav-link-font-size'],
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit'
  }
}

function primaryBtnStyle(tokens, theme) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 14px',
    borderRadius: '6px',
    border: 'none',
    background: tokens['nc-nav-link-color-active'],
    color: '#ffffff',
    fontSize: tokens['nc-nav-link-font-size'],
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit'
  }
}

// Render a brand logo + wordmark
function renderBrand(tokens, theme, { color = null, logoColor = null } = {}) {
  const lc = logoColor || tokens['nc-nav-link-color-active']
  return h('a', { style: brandStyle(tokens, { color }) }, [
    h('div', { style: logoCircleStyle(lc) }, [
      h('svg', {
        width: '16', height: '16', viewBox: '0 0 24 24',
        fill: 'none', stroke: '#fff', 'stroke-width': '2.5',
        'stroke-linecap': 'round', 'stroke-linejoin': 'round'
      }, [h('path', { d: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' })])
    ]),
    'NEO Design'
  ])
}

// Render a nav link group
function renderLinks(tokens, links, { color = null } = {}) {
  return h('nav', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens['nc-nav-gap']
    }
  }, links.map(({ label, active, hover }) => {
    const linkEl = h('a', { style: navLinkStyle(tokens, { active, hover, color }) }, [
      label,
      active ? h('span', { style: activeLinkUnderline(tokens) }) : null
    ])
    return linkEl
  }))
}

// Render nav actions (ghost + primary button)
function renderActions(tokens, theme, { textColor = null } = {}) {
  return h('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens['nc-nav-action-gap'],
      marginLeft: 'auto',
      flexShrink: '0'
    }
  }, [
    h('button', { style: ghostBtnStyle(tokens, theme, { textColor }) }, 'Anmelden'),
    h('button', { style: primaryBtnStyle(tokens, theme) }, 'Starten')
  ])
}

// Full nav bar render
function renderNavBar(tokens, theme, { scrolled = false, bg = null, borderColor = null, linkColor = null, logoColor = null } = {}) {
  const navLinks = [
    { label: 'Komponenten', active: true, hover: false },
    { label: 'Foundation', active: false, hover: false },
    { label: 'Muster', active: false, hover: false },
    { label: 'Icons', active: false, hover: false }
  ]

  return h('div', { style: navBarStyle(tokens, theme, { scrolled, bg, borderColor }) }, [
    renderBrand(tokens, theme, { color: linkColor, logoColor }),
    h('div', { style: { width: '24px', flexShrink: '0' } }),
    renderLinks(tokens, navLinks, { color: linkColor }),
    renderActions(tokens, theme, { textColor: linkColor })
  ])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Specimen 1: Default + Scrolled state rows
const NavDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const th = props.theme
      const labelStyle = {
        fontSize: '11px',
        fontWeight: '600',
        color: th['text-tertiary'] || '#94a3b8',
        marginBottom: '6px',
        display: 'block'
      }
      return h('div', { class: 'arena-preview-stack', style: { gap: '20px' } }, [
        h('div', {}, [
          h('span', { style: labelStyle }, 'Default'),
          renderNavBar(t, th, { scrolled: false })
        ]),
        h('div', {}, [
          h('span', { style: labelStyle }, 'Scrolled (mit Schatten)'),
          renderNavBar(t, th, { scrolled: true })
        ])
      ])
    }
  }
})

// Specimen 2: Emphasis variants — Default / Transparent / Solid
const NavEmphasis = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const th = props.theme

      const labelStyle = {
        fontSize: '11px',
        fontWeight: '600',
        color: th['text-tertiary'] || '#94a3b8',
        marginBottom: '6px',
        display: 'block'
      }

      // Transparent variant: dark hero bg
      const heroBg = '#0f2744'

      return h('div', { class: 'arena-preview-stack', style: { gap: '20px' } }, [
        h('div', {}, [
          h('span', { style: labelStyle }, 'Default (blur + semi-transparent)'),
          renderNavBar(t, th)
        ]),
        h('div', {
          style: { background: heroBg, borderRadius: '6px', overflow: 'hidden' }
        }, [
          h('span', { style: { ...labelStyle, color: 'rgba(255,255,255,0.5)', padding: '8px 16px 0', display: 'block' } }, 'Transparent (über Hero)'),
          renderNavBar(t, th, {
            bg: 'transparent',
            borderColor: 'rgba(255,255,255,0.15)',
            linkColor: '#ffffff',
            logoColor: '#60a5fa'
          })
        ]),
        h('div', {}, [
          h('span', { style: labelStyle }, 'Solid (opak, kein Blur)'),
          renderNavBar(t, th, {
            bg: th['background-base'] || '#ffffff',
            scrolled: true
          })
        ])
      ])
    }
  }
})

// Specimen 3: Alignment variants — Start / Center / End
const NavAlignment = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const th = props.theme

      const navLinks = [
        { label: 'Komponenten', active: true, hover: false },
        { label: 'Foundation', active: false, hover: false },
        { label: 'Muster', active: false, hover: false },
        { label: 'Icons', active: false, hover: false }
      ]

      const labelStyle = {
        fontSize: '11px',
        fontWeight: '600',
        color: th['text-tertiary'] || '#94a3b8',
        marginBottom: '6px',
        display: 'block'
      }

      function renderAlignedBar(justify) {
        return h('div', {
          style: {
            ...navBarStyle(t, th),
            gap: '0'
          }
        }, [
          renderBrand(t, th),
          h('div', {
            style: {
              flex: '1',
              display: 'flex',
              justifyContent: justify,
              padding: '0 16px'
            }
          }, [
            renderLinks(t, navLinks)
          ]),
          h('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: t['nc-nav-action-gap'],
              flexShrink: '0'
            }
          }, [
            h('button', { style: ghostBtnStyle(t, th) }, 'Anmelden'),
            h('button', { style: primaryBtnStyle(t, th) }, 'Starten')
          ])
        ])
      }

      return h('div', { class: 'arena-preview-stack', style: { gap: '20px' } }, [
        h('div', {}, [
          h('span', { style: labelStyle }, 'Links (Start)'),
          renderAlignedBar('flex-start')
        ]),
        h('div', {}, [
          h('span', { style: labelStyle }, 'Mitte (Center)'),
          renderAlignedBar('center')
        ]),
        h('div', {}, [
          h('span', { style: labelStyle }, 'Rechts (End)'),
          renderAlignedBar('flex-end')
        ])
      ])
    }
  }
})
</script>
