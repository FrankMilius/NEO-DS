<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default Horizontal -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default — Horizontal</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ToolbarDefault :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ToolbarDefault :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ToolbarDefault :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Text Labels -->
    <div class="arena-category-divider">
      <span class="arena-category-label">With Text Labels</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ToolbarWithText :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ToolbarWithText :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ToolbarWithText :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Vertical -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Vertical</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ToolbarVertical :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ToolbarVertical :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ToolbarVertical :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('toolbar')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-toolbar-height':            '48px',
  'nc-toolbar-padding':           '8px 12px',
  'nc-toolbar-gap':               '8px',
  'nc-toolbar-bg':                '#ffffff',
  'nc-toolbar-border':            '#d1d5db',
  'nc-toolbar-border-width':      '1px',
  'nc-toolbar-radius':            '4px',
  'nc-toolbar-separator-color':   '#d1d5db',
  'nc-toolbar-separator-width':   '1px',
  'nc-toolbar-separator-margin':  '4px',
  'nc-toolbar-separator-height':  '24px',
  'nc-toolbar-label-color':       '#6b7280',
  'nc-toolbar-label-size':        '13px',
  'nc-toolbar-label-weight':      '500',
  'nc-toolbar-compact-height':    '32px',
  'nc-toolbar-compact-gap':       '4px',
  'nc-toolbar-compact-padding':   '4px 8px',
  'nc-toolbar-floating-bg':       '#ffffff',
  'nc-toolbar-floating-radius':   '8px',
  'nc-toolbar-floating-shadow':   '0 4px 16px rgba(0,0,0,0.12)',
  'nc-toolbar-floating-border':   '#e5e7eb',
}

const TOKEN_REFS = {
  'nc-toolbar-bg':              'background-base',
  'nc-toolbar-border':          'border-secondary',
  'nc-toolbar-separator-color': 'border-secondary',
  'nc-toolbar-label-color':     'text-secondary',
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'toolbar') || null
)
const tLight = computed(() => store.state.themes[store.state.activeThemeSet].light)
const tDark  = computed(() => store.state.themes[store.state.activeThemeSet].dark)

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
const tokensDark  = computed(() => resolveAll(tDark.value))

// ---------------------------------------------------------------------------
// 3-Mode Support
// ---------------------------------------------------------------------------
const arenaMode    = computed(() => store.state.previewMode)
const isSplit      = computed(() => arenaMode.value === 'split')
const activeTokens = computed(() => arenaMode.value === 'dark' ? tokensDark.value : tokensLight.value)
const activeTheme  = computed(() => arenaMode.value === 'dark' ? tDark.value : tLight.value)
const activeBg     = computed(() =>
  arenaMode.value === 'dark' ? tDark.value['background-base'] : tLight.value['background-secondary']
)

// ---------------------------------------------------------------------------
// SVG Icons
// ---------------------------------------------------------------------------
function iconBold() {
  return h('svg', {
    width: '16', height: '16', viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', 'stroke-width': '2.5',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    style: { pointerEvents: 'none' }
  }, [
    h('path', { d: 'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z' }),
    h('path', { d: 'M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z' })
  ])
}

function iconItalic() {
  return h('svg', {
    width: '16', height: '16', viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', 'stroke-width': '2.5',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    style: { pointerEvents: 'none' }
  }, [
    h('line', { x1: '19', y1: '4', x2: '10', y2: '4' }),
    h('line', { x1: '14', y1: '20', x2: '5', y2: '20' }),
    h('line', { x1: '15', y1: '4', x2: '9', y2: '20' })
  ])
}

function iconUnderline() {
  return h('svg', {
    width: '16', height: '16', viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', 'stroke-width': '2.5',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    style: { pointerEvents: 'none' }
  }, [
    h('path', { d: 'M6 4v6a6 6 0 0 0 12 0V4' }),
    h('line', { x1: '4', y1: '20', x2: '20', y2: '20' })
  ])
}

function iconAlignLeft() {
  return h('svg', {
    width: '16', height: '16', viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', 'stroke-width': '2',
    'stroke-linecap': 'round', style: { pointerEvents: 'none' }
  }, [
    h('line', { x1: '4', y1: '6', x2: '20', y2: '6' }),
    h('line', { x1: '4', y1: '10', x2: '14', y2: '10' }),
    h('line', { x1: '4', y1: '14', x2: '18', y2: '14' }),
    h('line', { x1: '4', y1: '18', x2: '12', y2: '18' })
  ])
}

function iconAlignCenter() {
  return h('svg', {
    width: '16', height: '16', viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', 'stroke-width': '2',
    'stroke-linecap': 'round', style: { pointerEvents: 'none' }
  }, [
    h('line', { x1: '4', y1: '6', x2: '20', y2: '6' }),
    h('line', { x1: '7', y1: '10', x2: '17', y2: '10' }),
    h('line', { x1: '4', y1: '14', x2: '20', y2: '14' }),
    h('line', { x1: '7', y1: '18', x2: '17', y2: '18' })
  ])
}

function iconAlignRight() {
  return h('svg', {
    width: '16', height: '16', viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', 'stroke-width': '2',
    'stroke-linecap': 'round', style: { pointerEvents: 'none' }
  }, [
    h('line', { x1: '4', y1: '6', x2: '20', y2: '6' }),
    h('line', { x1: '10', y1: '10', x2: '20', y2: '10' }),
    h('line', { x1: '6', y1: '14', x2: '20', y2: '14' }),
    h('line', { x1: '12', y1: '18', x2: '20', y2: '18' })
  ])
}

// ---------------------------------------------------------------------------
// Style Builders
// ---------------------------------------------------------------------------
function toolbarContainerStyle(tokens, { vertical = false } = {}) {
  return {
    display: 'inline-flex',
    flexDirection: vertical ? 'column' : 'row',
    alignItems: vertical ? 'stretch' : 'center',
    gap: tokens['nc-toolbar-gap'] || '8px',
    padding: tokens['nc-toolbar-padding'] || '8px 12px',
    background: tokens['nc-toolbar-bg'] || '#ffffff',
    border: `${tokens['nc-toolbar-border-width'] || '1px'} solid ${tokens['nc-toolbar-border'] || '#d1d5db'}`,
    borderRadius: tokens['nc-toolbar-radius'] || '4px',
    minHeight: vertical ? 'auto' : (tokens['nc-toolbar-height'] || '48px'),
    minWidth: vertical ? (tokens['nc-toolbar-height'] || '48px') : 'auto',
  }
}

function groupStyle(tokens, { vertical = false } = {}) {
  return {
    display: 'inline-flex',
    flexDirection: vertical ? 'column' : 'row',
    alignItems: 'center',
    gap: '2px',
  }
}

function toolbarItemStyle(tokens, { active = false } = {}) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    border: 'none',
    background: active ? (tokens['interactive-subtle'] || 'rgba(0,102,204,0.1)') : 'transparent',
    color: active ? (tokens['interactive-default'] || '#0066cc') : (tokens['text-secondary'] || '#6b7280'),
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    flexShrink: '0',
  }
}

function toolbarItemWithTextStyle(tokens, { active = false } = {}) {
  return {
    ...toolbarItemStyle(tokens, { active }),
    width: 'auto',
    padding: '0 10px',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '500',
  }
}

function separatorStyle(tokens, { vertical = false } = {}) {
  if (vertical) {
    return {
      width: '100%',
      height: tokens['nc-toolbar-separator-width'] || '1px',
      background: tokens['nc-toolbar-separator-color'] || '#d1d5db',
      margin: `${tokens['nc-toolbar-separator-margin'] || '4px'} 0`,
      flexShrink: '0',
    }
  }
  return {
    width: tokens['nc-toolbar-separator-width'] || '1px',
    height: tokens['nc-toolbar-separator-height'] || '24px',
    background: tokens['nc-toolbar-separator-color'] || '#d1d5db',
    margin: `0 ${tokens['nc-toolbar-separator-margin'] || '4px'}`,
    flexShrink: '0',
  }
}

function overflowButtonStyle(tokens) {
  return {
    ...toolbarItemStyle(tokens),
    width: '32px',
    letterSpacing: '0.05em',
  }
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Default Horizontal Toolbar
const ToolbarDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      return h('div', { style: { padding: '16px' } }, [
        h('div', { style: toolbarContainerStyle(t) }, [
          // Formatting group
          h('div', { style: groupStyle(t) }, [
            h('button', { style: toolbarItemStyle(t, { active: true }) }, [iconBold()]),
            h('button', { style: toolbarItemStyle(t) }, [iconItalic()]),
            h('button', { style: toolbarItemStyle(t) }, [iconUnderline()]),
          ]),
          // Separator
          h('span', { style: separatorStyle(t), 'aria-hidden': 'true' }),
          // Alignment group
          h('div', { style: groupStyle(t) }, [
            h('button', { style: toolbarItemStyle(t, { active: true }) }, [iconAlignLeft()]),
            h('button', { style: toolbarItemStyle(t) }, [iconAlignCenter()]),
            h('button', { style: toolbarItemStyle(t) }, [iconAlignRight()]),
          ]),
          // Separator
          h('span', { style: separatorStyle(t), 'aria-hidden': 'true' }),
          // Overflow
          h('button', { style: overflowButtonStyle(t) }, '···'),
        ])
      ])
    }
  }
})

// With Text Labels
const ToolbarWithText = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const labelStyle = { fontSize: '11px', fontWeight: '500', whiteSpace: 'nowrap' }
      return h('div', { style: { padding: '16px' } }, [
        h('div', { style: toolbarContainerStyle(t) }, [
          h('div', { style: groupStyle(t) }, [
            h('button', { style: toolbarItemWithTextStyle(t, { active: true }) }, [
              iconBold(),
              h('span', { style: labelStyle }, 'Bold')
            ]),
            h('button', { style: toolbarItemWithTextStyle(t) }, [
              iconItalic(),
              h('span', { style: labelStyle }, 'Italic')
            ]),
            h('button', { style: toolbarItemWithTextStyle(t) }, [
              iconUnderline(),
              h('span', { style: labelStyle }, 'Underline')
            ]),
          ]),
          h('span', { style: separatorStyle(t), 'aria-hidden': 'true' }),
          h('div', { style: groupStyle(t) }, [
            h('button', { style: toolbarItemWithTextStyle(t, { active: true }) }, [
              iconAlignLeft(),
              h('span', { style: labelStyle }, 'Left')
            ]),
            h('button', { style: toolbarItemWithTextStyle(t) }, [
              iconAlignCenter(),
              h('span', { style: labelStyle }, 'Center')
            ]),
            h('button', { style: toolbarItemWithTextStyle(t) }, [
              iconAlignRight(),
              h('span', { style: labelStyle }, 'Right')
            ]),
          ]),
        ])
      ])
    }
  }
})

// Vertical Toolbar
const ToolbarVertical = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      return h('div', { style: { padding: '16px', display: 'flex', alignItems: 'flex-start' } }, [
        h('div', { style: toolbarContainerStyle(t, { vertical: true }) }, [
          h('div', { style: groupStyle(t, { vertical: true }) }, [
            h('button', { style: toolbarItemStyle(t, { active: true }) }, [iconBold()]),
            h('button', { style: toolbarItemStyle(t) }, [iconItalic()]),
            h('button', { style: toolbarItemStyle(t) }, [iconUnderline()]),
          ]),
          h('span', { style: separatorStyle(t, { vertical: true }), 'aria-hidden': 'true' }),
          h('div', { style: groupStyle(t, { vertical: true }) }, [
            h('button', { style: toolbarItemStyle(t, { active: true }) }, [iconAlignLeft()]),
            h('button', { style: toolbarItemStyle(t) }, [iconAlignCenter()]),
            h('button', { style: toolbarItemStyle(t) }, [iconAlignRight()]),
          ]),
          h('span', { style: separatorStyle(t, { vertical: true }), 'aria-hidden': 'true' }),
          h('button', { style: overflowButtonStyle(t) }, '···'),
        ])
      ])
    }
  }
})
</script>
