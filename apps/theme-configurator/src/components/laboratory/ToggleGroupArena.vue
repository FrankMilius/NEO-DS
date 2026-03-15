<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Single Select -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Single Select — genau eine Option aktiv</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ToggleSingleSelect :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ToggleSingleSelect :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ToggleSingleSelect :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Multi Select -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Multi Select — mehrere Optionen gleichzeitig aktiv</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ToggleMultiSelect :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ToggleMultiSelect :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ToggleMultiSelect :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Sizes -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Sizes — SM / MD / LG</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ToggleSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ToggleSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ToggleSizes :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('toggle-group')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-toggle-group-gap':                    '0',
  'nc-toggle-group-radius':                 '6px',
  'nc-toggle-group-border':                 '#d1d5db',
  'nc-toggle-group-bg':                     '#f3f4f6',
  'nc-toggle-group-shadow':                 'none',
  'nc-toggle-group-item-bg':                'transparent',
  'nc-toggle-group-item-color':             '#1a1a1a',
  'nc-toggle-group-item-border':            '#e5e7eb',
  'nc-toggle-group-item-bg-hover':          '#f3f4f6',
  'nc-toggle-group-item-selected-bg':       '#0066cc',
  'nc-toggle-group-item-selected-color':    '#ffffff',
  'nc-toggle-group-item-selected-border':   '#0066cc',
  'nc-toggle-group-item-soft-bg':           'rgba(0,102,204,0.12)',
  'nc-toggle-group-item-soft-color':        '#0066cc',
  'nc-toggle-group-underline-width':        '2px',
  'nc-toggle-group-underline-color':        '#0066cc',
  'nc-toggle-group-divider-width':          '1px',
  'nc-toggle-group-divider-height':         '50%',
  'nc-toggle-group-divider-color':          '#e5e7eb',
  'nc-toggle-group-item-disabled-bg':       '#f3f4f6',
  'nc-toggle-group-item-disabled-color':    '#9ca3af',
  'nc-toggle-group-item-disabled-opacity':  '0.5',
  'nc-toggle-group-transition-duration':    '200ms'
}

const TOKEN_REFS = {
  'nc-toggle-group-border':                 'border-primary',
  'nc-toggle-group-bg':                     'background-secondary',
  'nc-toggle-group-item-color':             'text-primary',
  'nc-toggle-group-item-border':            'border-secondary',
  'nc-toggle-group-item-bg-hover':          'background-tertiary',
  'nc-toggle-group-item-selected-bg':       'interactive-default',
  'nc-toggle-group-item-selected-color':    'text-on-interactive',
  'nc-toggle-group-item-selected-border':   'interactive-default',
  'nc-toggle-group-item-disabled-color':    'text-disabled'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'toggle-group') || null
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
function containerStyle(tokens) {
  return {
    display: 'inline-flex',
    alignItems: 'stretch',
    borderRadius: tokens['nc-toggle-group-radius'] || '6px',
    border: `1px solid ${tokens['nc-toggle-group-border'] || '#d1d5db'}`,
    background: tokens['nc-toggle-group-bg'] || '#f3f4f6',
    overflow: 'hidden',
    boxShadow: tokens['nc-toggle-group-shadow'] || 'none'
  }
}

function itemStyle(tokens, { selected = false, disabled = false, size = 'md', isFirst = false, isLast = false } = {}) {
  const heights = { sm: '32px', md: '40px', lg: '48px' }
  const fontSizes = { sm: '12px', md: '13px', lg: '14px' }
  const paddings = { sm: '0 10px', md: '0 14px', lg: '0 18px' }

  let bg = tokens['nc-toggle-group-item-bg'] || 'transparent'
  let color = tokens['nc-toggle-group-item-color'] || '#1a1a1a'
  let borderLeft = isFirst ? 'none' : `1px solid ${tokens['nc-toggle-group-item-border'] || '#e5e7eb'}`

  if (selected) {
    bg = tokens['nc-toggle-group-item-selected-bg'] || '#0066cc'
    color = tokens['nc-toggle-group-item-selected-color'] || '#ffffff'
    borderLeft = isFirst ? 'none' : `1px solid ${tokens['nc-toggle-group-item-selected-border'] || '#0066cc'}`
  }
  if (disabled) {
    color = tokens['nc-toggle-group-item-disabled-color'] || '#9ca3af'
  }

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: heights[size] || heights.md,
    padding: paddings[size] || paddings.md,
    background: bg,
    color,
    fontFamily: 'inherit',
    fontSize: fontSizes[size] || fontSizes.md,
    fontWeight: selected ? '500' : '400',
    border: 'none',
    borderLeft,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? (tokens['nc-toggle-group-item-disabled-opacity'] || '0.5') : '1',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    transition: `background ${tokens['nc-toggle-group-transition-duration'] || '200ms'} ease, color ${tokens['nc-toggle-group-transition-duration'] || '200ms'} ease`
  }
}

// ---------------------------------------------------------------------------
// SVG Icons für Text-Formatting-Toolbar
// ---------------------------------------------------------------------------
function renderBoldIcon() {
  return h('svg', {
    width: '16', height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': 'true'
  }, [
    h('path', {
      d: 'M6 12h8a4 4 0 000-8H6v8zm0 0h9a4 4 0 010 8H6v-8z',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    })
  ])
}

function renderItalicIcon() {
  return h('svg', {
    width: '16', height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': 'true'
  }, [
    h('path', {
      d: 'M11 5h6M7 19h6M14 5L10 19',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    })
  ])
}

function renderUnderlineIcon() {
  return h('svg', {
    width: '16', height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': 'true'
  }, [
    h('path', {
      d: 'M6 4v6a6 6 0 0012 0V4M4 20h16',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    })
  ])
}

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
function renderToggleGroup(tokens, items, { size = 'md', type = 'single' } = {}) {
  const role = type === 'single' ? 'radiogroup' : 'group'
  return h('div', {
    style: containerStyle(tokens),
    role,
    'aria-label': 'Formatierung'
  },
    items.map((item, i) =>
      h('button', {
        style: itemStyle(tokens, { selected: item.selected, disabled: item.disabled, size, isFirst: i === 0, isLast: i === items.length - 1 }),
        role: type === 'single' ? 'radio' : 'button',
        'aria-checked': type === 'single' ? (item.selected ? 'true' : 'false') : undefined,
        'aria-pressed': type === 'multiple' ? (item.selected ? 'true' : 'false') : undefined,
        'aria-label': item.ariaLabel || item.label
      }, item.icon || item.label)
    )
  )
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------
const SINGLE_ITEMS = [
  { label: 'Tag',   selected: true },
  { label: 'Woche', selected: false },
  { label: 'Monat', selected: false }
]

const MULTI_ITEMS = [
  { label: 'Fett',          icon: renderBoldIcon(),      ariaLabel: 'Fett',          selected: true },
  { label: 'Kursiv',        icon: renderItalicIcon(),    ariaLabel: 'Kursiv',        selected: false },
  { label: 'Unterstrichen', icon: renderUnderlineIcon(), ariaLabel: 'Unterstrichen', selected: true }
]

const ToggleSingleSelect = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      return h('div', { class: 'arena-preview-stack' }, [
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } }, [
          h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } }, 'Text (Day / Week / Month)'),
          renderToggleGroup(t, SINGLE_ITEMS, { type: 'single' })
        ]),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } }, [
          h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } }, 'Mit Disabled Item'),
          renderToggleGroup(t, [
            { label: 'Tag',   selected: true },
            { label: 'Woche', selected: false, disabled: true },
            { label: 'Monat', selected: false }
          ], { type: 'single' })
        ])
      ])
    }
  }
})

const ToggleMultiSelect = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      return h('div', { class: 'arena-preview-stack' }, [
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } }, [
          h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } }, 'Icon-Toolbar (Fett + Unterstrichen aktiv)'),
          renderToggleGroup(t, MULTI_ITEMS, { type: 'multiple' })
        ]),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } }, [
          h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } }, 'Text-Optionen (mehrere selektierbar)'),
          renderToggleGroup(t, [
            { label: 'Fett',    selected: true },
            { label: 'Kursiv',  selected: true },
            { label: 'Code',    selected: false }
          ], { type: 'multiple' })
        ])
      ])
    }
  }
})

const ToggleSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const sizes = [
        { label: 'SM — 32px', size: 'sm' },
        { label: 'MD — 40px', size: 'md' },
        { label: 'LG — 48px', size: 'lg' }
      ]
      return h('div', { class: 'arena-preview-stack' },
        sizes.map(({ label, size }) =>
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } }, [
            h('span', {
              style: { fontSize: '11px', fontWeight: '600', minWidth: '80px', color: props.theme['text-secondary'] || '#666' }
            }, label),
            renderToggleGroup(t, SINGLE_ITEMS, { size, type: 'single' })
          ])
        )
      )
    }
  }
})
</script>
