<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default Dropdown -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default Dropdown — Open State</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <NavMenuDefault :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <NavMenuDefault :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <NavMenuDefault :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Two-Column Callout -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Two-Column Callout Layout</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <NavMenuCallout :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <NavMenuCallout :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <NavMenuCallout :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Mega Menu -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Mega Menu — 3-Column Grid</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <NavMenuMega :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <NavMenuMega :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <NavMenuMega :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('navigation-menu')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-nav-menu-bg':                    '#ffffff',
  'nc-nav-menu-radius':                '8px',
  'nc-nav-menu-shadow':                '0 8px 24px rgba(0,0,0,0.1)',
  'nc-nav-menu-padding':               '20px',
  'nc-nav-menu-viewport-padding':      '20px',
  'nc-nav-menu-trigger-color':         '#475569',
  'nc-nav-menu-trigger-color-hover':   '#0f172a',
  'nc-nav-menu-trigger-bg-hover':      '#f1f5f9',
  'nc-nav-menu-trigger-radius':        '6px',
  'nc-nav-menu-trigger-padding':       '8px 12px',
  'nc-nav-menu-trigger-font-size':     '14px',
  'nc-nav-menu-trigger-font-weight':   '500',
  'nc-nav-menu-link-color':            '#0f172a',
  'nc-nav-menu-link-color-hover':      '#0066cc',
  'nc-nav-menu-link-bg-hover':         '#f1f5f9',
  'nc-nav-menu-link-radius':           '6px',
  'nc-nav-menu-link-padding':          '8px 12px',
  'nc-nav-menu-link-font-size':        '14px',
  'nc-nav-menu-link-desc-color':       '#64748b',
  'nc-nav-menu-link-desc-size':        '12px',
  'nc-nav-menu-indicator-color':       '#0066cc',
  'nc-nav-menu-indicator-height':      '2px',
  'nc-nav-menu-callout-bg':            '#eff6ff',
  'nc-nav-menu-callout-radius':        '6px',
  'nc-nav-menu-callout-title-size':    '16px',
  'nc-nav-menu-callout-title-color':   '#0f172a',
  'nc-nav-menu-callout-desc-size':     '13px',
  'nc-nav-menu-callout-desc-color':    '#64748b'
}

const TOKEN_REFS = {
  'nc-nav-menu-bg':                    'surface-elevated',
  'nc-nav-menu-trigger-color':         'text-secondary',
  'nc-nav-menu-trigger-color-hover':   'text-primary',
  'nc-nav-menu-trigger-bg-hover':      'background-tertiary',
  'nc-nav-menu-link-color':            'text-primary',
  'nc-nav-menu-link-color-hover':      'interactive-default',
  'nc-nav-menu-link-bg-hover':         'background-tertiary',
  'nc-nav-menu-link-desc-color':       'text-secondary',
  'nc-nav-menu-indicator-color':       'interactive-default',
  'nc-nav-menu-callout-bg':            'interactive-subtle',
  'nc-nav-menu-callout-title-color':   'text-primary',
  'nc-nav-menu-callout-desc-color':    'text-secondary'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'navigation-menu') || null
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
function triggerStyle(tokens, { active = false, hover = false } = {}) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: tokens['nc-nav-menu-trigger-padding'],
    borderRadius: tokens['nc-nav-menu-trigger-radius'],
    background: hover ? tokens['nc-nav-menu-trigger-bg-hover'] : 'transparent',
    color: active || hover
      ? tokens['nc-nav-menu-trigger-color-hover']
      : tokens['nc-nav-menu-trigger-color'],
    fontSize: tokens['nc-nav-menu-trigger-font-size'],
    fontWeight: tokens['nc-nav-menu-trigger-font-weight'],
    fontFamily: 'inherit',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    whiteSpace: 'nowrap'
  }
}

function dropdownPanelStyle(tokens) {
  return {
    background: tokens['nc-nav-menu-bg'],
    borderRadius: tokens['nc-nav-menu-radius'],
    boxShadow: tokens['nc-nav-menu-shadow'],
    padding: tokens['nc-nav-menu-padding'],
    fontFamily: 'inherit'
  }
}

function navLinkStyle(tokens, { hover = false } = {}) {
  return {
    display: 'block',
    padding: tokens['nc-nav-menu-link-padding'],
    borderRadius: tokens['nc-nav-menu-link-radius'],
    background: hover ? tokens['nc-nav-menu-link-bg-hover'] : 'transparent',
    color: hover ? tokens['nc-nav-menu-link-color-hover'] : tokens['nc-nav-menu-link-color'],
    textDecoration: 'none',
    cursor: 'pointer'
  }
}

function linkTitleStyle(tokens) {
  return {
    fontSize: tokens['nc-nav-menu-link-font-size'],
    fontWeight: '500',
    lineHeight: '1.3',
    marginBottom: '2px'
  }
}

function linkDescStyle(tokens) {
  return {
    fontSize: tokens['nc-nav-menu-link-desc-size'],
    color: tokens['nc-nav-menu-link-desc-color'],
    lineHeight: '1.4'
  }
}

function indicatorStyle(tokens) {
  return {
    position: 'absolute',
    bottom: '-2px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 24px)',
    height: tokens['nc-nav-menu-indicator-height'],
    background: tokens['nc-nav-menu-indicator-color'],
    borderRadius: '1px'
  }
}

function calloutBoxStyle(tokens) {
  return {
    background: tokens['nc-nav-menu-callout-bg'],
    borderRadius: tokens['nc-nav-menu-callout-radius'],
    padding: '20px',
    height: '100%',
    boxSizing: 'border-box'
  }
}

// Chevron down SVG
function chevronDown(color) {
  return h('svg', {
    width: '12', height: '12', viewBox: '0 0 24 24',
    fill: 'none', stroke: color, 'stroke-width': '2.5',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    'aria-hidden': 'true'
  }, [h('path', { d: 'M19.5 8.25l-7.5 7.5-7.5-7.5' })])
}

// Render a single nav link item (title + desc)
function renderNavLink(tokens, title, desc, { hover = false } = {}) {
  return h('a', { style: navLinkStyle(tokens, { hover }) }, [
    h('div', { style: linkTitleStyle(tokens) }, title),
    h('div', { style: linkDescStyle(tokens) }, desc)
  ])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Specimen 1: Default dropdown — nav bar + open dropdown below active trigger
const NavMenuDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const th = props.theme

      const triggers = ['Produkte', 'Lösungen', 'Preise', 'Über uns']

      const navBar = h('div', {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px',
          padding: '6px',
          background: th['background-base'] || '#fff',
          borderRadius: '8px',
          border: `1px solid ${th['border-secondary'] || '#e2e8f0'}`,
          position: 'relative'
        }
      }, triggers.map((label, i) => {
        const isActive = i === 0
        const triggerEl = h('button', {
          style: triggerStyle(t, { active: isActive })
        }, [
          label,
          chevronDown(isActive ? t['nc-nav-menu-trigger-color-hover'] : t['nc-nav-menu-trigger-color']),
          isActive ? h('span', { style: indicatorStyle(t) }) : null
        ])
        return triggerEl
      }))

      const links = [
        { title: 'Komponenten', desc: 'Buttons, Formulare, Tabellen und mehr' },
        { title: 'Design Tokens', desc: 'Farben, Abstände und Typografie' },
        { title: 'Patterns', desc: 'Wiederverwendbare UI-Muster' }
      ]

      const dropdown = h('div', { style: { ...dropdownPanelStyle(t), minWidth: '280px' } },
        links.map((link, i) => renderNavLink(t, link.title, link.desc, { hover: i === 0 }))
      )

      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '0', alignItems: 'flex-start' } }, [
        navBar,
        h('div', { style: { paddingLeft: '12px', paddingTop: '4px' } }, [dropdown])
      ])
    }
  }
})

// Specimen 2: Two-column callout dropdown
const NavMenuCallout = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const th = props.theme

      const callout = h('div', { style: calloutBoxStyle(t) }, [
        h('div', {
          style: {
            fontSize: t['nc-nav-menu-callout-title-size'],
            fontWeight: '700',
            color: t['nc-nav-menu-callout-title-color'],
            marginBottom: '8px'
          }
        }, 'Neu in v2.0'),
        h('p', {
          style: {
            fontSize: t['nc-nav-menu-callout-desc-size'],
            color: t['nc-nav-menu-callout-desc-color'],
            lineHeight: '1.5',
            margin: '0 0 12px'
          }
        }, 'Das neue Theme-System ermöglicht vollständige Anpassung aller Design Tokens.'),
        h('a', {
          style: {
            fontSize: '13px',
            fontWeight: '600',
            color: t['nc-nav-menu-indicator-color'],
            textDecoration: 'none',
            cursor: 'pointer'
          }
        }, 'Mehr erfahren →')
      ])

      const rightLinks = [
        { title: 'Neue Komponenten', desc: 'Navigation, Treeview, Shell' },
        { title: 'Token-Editor', desc: 'Live-Vorschau aller Token' },
        { title: 'Export Pipeline', desc: 'CSS, JSON, Drupal-Format' },
        { title: 'Dark Mode', desc: 'Vollständige Dunkel-Unterstützung' }
      ]

      const rightCol = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
        rightLinks.map((link, i) => renderNavLink(t, link.title, link.desc, { hover: i === 1 }))
      )

      const panel = h('div', {
        style: {
          ...dropdownPanelStyle(t),
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '16px',
          minWidth: '560px'
        }
      }, [callout, rightCol])

      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' } }, [
        h('div', {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: '600',
            color: th['text-tertiary'] || '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }
        }, 'Dropdown-Inhalt'),
        panel
      ])
    }
  }
})

// Specimen 3: Mega menu — 3-column grid
const NavMenuMega = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const th = props.theme

      const columns = [
        {
          heading: 'Foundations',
          links: [
            { title: 'Farben', desc: 'Primitives, Semantic, Themes' },
            { title: 'Typografie', desc: 'Schriftarten und -größen' },
            { title: 'Abstände', desc: 'Spacing-Skala und Layout' }
          ]
        },
        {
          heading: 'Components',
          links: [
            { title: 'Formulare', desc: 'Input, Select, Checkbox' },
            { title: 'Navigation', desc: 'Header, Nav, Breadcrumb' },
            { title: 'Feedback', desc: 'Alert, Toast, Notification' }
          ]
        },
        {
          heading: 'Templates',
          links: [
            { title: 'Dashboard', desc: 'Admin-Layouts mit Sidebar' },
            { title: 'Landingpage', desc: 'Hero, Features, CTA' },
            { title: 'Formular-Seite', desc: 'Multi-Step Formulare' }
          ]
        }
      ]

      const columnEls = columns.map(col =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, [
          h('div', {
            style: {
              fontSize: '11px',
              fontWeight: '700',
              color: t['nc-nav-menu-link-desc-color'],
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              padding: `4px ${t['nc-nav-menu-link-padding']?.split(' ')[1] || '12px'}`,
              marginBottom: '4px'
            }
          }, col.heading),
          ...col.links.map((link, i) => renderNavLink(t, link.title, link.desc, { hover: i === 0 && col.heading === 'Components' }))
        ])
      )

      const panel = h('div', {
        style: {
          ...dropdownPanelStyle(t),
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
          minWidth: '700px'
        }
      }, columnEls)

      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' } }, [
        h('div', {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: '600',
            color: th['text-tertiary'] || '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }
        }, 'Mega Menu'),
        panel
      ])
    }
  }
})
</script>
