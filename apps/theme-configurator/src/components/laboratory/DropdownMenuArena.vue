<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Open Dropdown (static) -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Open Dropdown — Static Preview</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <DropdownOpen :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <DropdownOpen :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <DropdownOpen :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Sizes -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Sizes — SM / MD</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <DropdownSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <DropdownSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <DropdownSizes :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Icons -->
    <div class="arena-category-divider">
      <span class="arena-category-label">With Leading Icons</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <DropdownWithIcons :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <DropdownWithIcons :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <DropdownWithIcons :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('dropdown-menu')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-dropdown-bg':                  '#ffffff',
  'nc-dropdown-border':              '#e5e7eb',
  'nc-dropdown-border-width':        '1px',
  'nc-dropdown-radius':              '4px',
  'nc-dropdown-shadow':              '0 4px 16px rgba(0,0,0,0.12)',
  'nc-dropdown-padding':             '4px',
  'nc-dropdown-min-width':           '180px',
  'nc-dropdown-item-height':         '32px',
  'nc-dropdown-item-padding':        '8px 12px',
  'nc-dropdown-item-radius':         '4px',
  'nc-dropdown-item-color':          '#1a1a1a',
  'nc-dropdown-item-bg-hover':       '#f3f4f6',
  'nc-dropdown-item-bg-active':      '#e5e7eb',
  'nc-dropdown-item-color-disabled': '#9ca3af',
  'nc-dropdown-item-icon-size':      '16px',
  'nc-dropdown-item-icon-color':     '#6b7280',
  'nc-dropdown-item-gap':            '8px',
  'nc-dropdown-item-font-size':      '14px',
  'nc-dropdown-item-font-weight':    '400',
  'nc-dropdown-item-danger-color':   '#dc2626',
  'nc-dropdown-item-danger-bg-hover':'#fee2e2',
  'nc-dropdown-group-label-color':   '#9ca3af',
  'nc-dropdown-group-label-size':    '12px',
  'nc-dropdown-group-label-weight':  '600',
  'nc-dropdown-group-label-padding': '8px 12px',
  'nc-dropdown-separator-color':     '#e5e7eb',
  'nc-dropdown-separator-margin':    '4px',
  'nc-dropdown-check-size':          '16px',
  'nc-dropdown-check-color':         '#0066cc'
}

const TOKEN_REFS = {
  'nc-dropdown-bg':                   'surface-elevated',
  'nc-dropdown-border':               'border-secondary',
  'nc-dropdown-item-color':           'text-primary',
  'nc-dropdown-item-bg-hover':        'background-hover',
  'nc-dropdown-item-bg-active':       'background-active',
  'nc-dropdown-item-color-disabled':  'text-disabled',
  'nc-dropdown-item-icon-color':      'text-secondary',
  'nc-dropdown-item-danger-color':    'feedback-danger',
  'nc-dropdown-item-danger-bg-hover': 'background-danger',
  'nc-dropdown-group-label-color':    'text-tertiary',
  'nc-dropdown-separator-color':      'border-secondary',
  'nc-dropdown-check-color':          'interactive-default'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'dropdown-menu') || null
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
// Style Builders
// ---------------------------------------------------------------------------
function panelStyle(tokens) {
  return {
    background: tokens['nc-dropdown-bg'],
    border: `${tokens['nc-dropdown-border-width']} solid ${tokens['nc-dropdown-border']}`,
    borderRadius: tokens['nc-dropdown-radius'],
    boxShadow: tokens['nc-dropdown-shadow'],
    padding: tokens['nc-dropdown-padding'],
    minWidth: tokens['nc-dropdown-min-width'],
    fontFamily: 'inherit'
  }
}

function itemStyle(tokens, { hover = false, disabled = false, danger = false, size = 'md' } = {}) {
  const h_ = size === 'sm' ? '28px' : tokens['nc-dropdown-item-height']
  const fontSize = size === 'sm' ? '12px' : tokens['nc-dropdown-item-font-size']
  let bg = 'transparent'
  let color = tokens['nc-dropdown-item-color']
  if (disabled) {
    color = tokens['nc-dropdown-item-color-disabled']
  } else if (danger && hover) {
    bg = tokens['nc-dropdown-item-danger-bg-hover']
    color = tokens['nc-dropdown-item-danger-color']
  } else if (danger) {
    color = tokens['nc-dropdown-item-danger-color']
  } else if (hover) {
    bg = tokens['nc-dropdown-item-bg-hover']
  }
  return {
    display: 'flex',
    alignItems: 'center',
    gap: tokens['nc-dropdown-item-gap'],
    minHeight: h_,
    padding: tokens['nc-dropdown-item-padding'],
    borderRadius: tokens['nc-dropdown-item-radius'],
    background: bg,
    color,
    fontSize,
    fontWeight: tokens['nc-dropdown-item-font-weight'],
    cursor: disabled ? 'not-allowed' : 'default',
    opacity: disabled ? '0.5' : '1'
  }
}

function separatorStyle(tokens) {
  return {
    height: '1px',
    background: tokens['nc-dropdown-separator-color'],
    margin: `${tokens['nc-dropdown-separator-margin']} 0`
  }
}

function groupLabelStyle(tokens) {
  return {
    padding: tokens['nc-dropdown-group-label-padding'],
    fontSize: tokens['nc-dropdown-group-label-size'],
    fontWeight: tokens['nc-dropdown-group-label-weight'],
    color: tokens['nc-dropdown-group-label-color']
  }
}

function iconSvg(tokens, path) {
  return h('svg', {
    width: tokens['nc-dropdown-item-icon-size'],
    height: tokens['nc-dropdown-item-icon-size'],
    viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
    'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    'aria-hidden': 'true',
    style: { color: tokens['nc-dropdown-item-icon-color'], flexShrink: '0' }
  }, [h('path', { d: path })])
}

function triggerBtnStyle(tokens, theme) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '6px 12px', borderRadius: '4px',
    background: theme['background-base'] || '#fff',
    color: theme['text-primary'] || '#1a1a1a',
    border: `1px solid ${theme['border-primary'] || '#d1d5db'}`,
    fontSize: '14px', fontFamily: 'inherit', cursor: 'pointer'
  }
}

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
function renderDropdown(tokens, theme, { size = 'md', withIcons = false } = {}) {
  const iconPaths = {
    user: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
    edit: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125',
    copy: 'M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.976a60.016 60.016 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75',
    trash: 'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
  }

  const trigger = h('button', { style: triggerBtnStyle(tokens, theme) }, [
    'Options',
    h('svg', { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'aria-hidden': 'true' }, [
      h('path', { d: 'M19.5 8.25l-7.5 7.5-7.5-7.5' })
    ])
  ])

  const icon = (key) => withIcons ? iconSvg(tokens, iconPaths[key] || iconPaths.edit) : null

  const items = [
    h('div', { style: itemStyle(tokens, { size }) }, [icon('user'), 'View Profile']),
    h('div', { style: itemStyle(tokens, { hover: true, size }) }, [icon('edit'), 'Edit Item']),
    h('div', { style: itemStyle(tokens, { size }) }, [icon('copy'), 'Duplicate']),
    h('div', { style: separatorStyle(tokens) }),
    h('div', { style: itemStyle(tokens, { danger: true, size }) }, [icon('trash'), 'Delete']),
    h('div', { style: itemStyle(tokens, { disabled: true, size }) }, [icon('user'), 'Archived (disabled)'])
  ]

  const dropdownPanel = h('div', { style: panelStyle(tokens) }, items)

  return h('div', { style: { display: 'inline-flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' } }, [
    trigger,
    dropdownPanel
  ])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

const DropdownOpen = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => renderDropdown(props.tokens, props.theme, { size: 'md', withIcons: false })
  }
})

const DropdownSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const th = props.theme
      const sizes = [
        { label: 'MD', size: 'md' },
        { label: 'SM', size: 'sm' }
      ]
      const cols = sizes.map(({ label, size }) =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } }, [
          h('span', { style: { fontSize: '11px', fontWeight: '600', color: th['text-secondary'] || '#666' } }, label),
          renderDropdown(t, th, { size })
        ])
      )
      return h('div', { class: 'arena-btn-row', style: { alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' } }, cols)
    }
  }
})

const DropdownWithIcons = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => renderDropdown(props.tokens, props.theme, { size: 'md', withIcons: true })
  }
})
</script>
