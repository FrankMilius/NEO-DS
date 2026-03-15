<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Variant & Color Comparison -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Variant & Color Comparison</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <LabelColors :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <LabelColors :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <LabelColors :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Size Comparison -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Size Comparison — XS / SM / MD</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <LabelSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <LabelSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <LabelSizes :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Shape + Interactive -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Shape + Interactive</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <LabelShapes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <LabelShapes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <LabelShapes :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('label')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-label-height-sm':             '24px',
  'nc-label-height-xs':             '20px',
  'nc-label-height-md':             '28px',
  'nc-label-padding-x':             '8px',
  'nc-label-padding-x-xs':          '4px',
  'nc-label-padding-x-md':          '12px',
  'nc-label-radius':                '4px',
  'nc-label-radius-pill':           '9999px',
  'nc-label-font-size':             '11px',
  'nc-label-font-size-xs':          '10px',
  'nc-label-font-size-md':          '12px',
  'nc-label-font-weight':           '600',
  'nc-label-gap':                   '4px',
  'nc-label-letter-spacing':        '0.01em',
  'nc-label-icon-size':             '12px',
  'nc-label-default-bg':            '#f1f5f9',
  'nc-label-default-color':         '#64748b',
  'nc-label-default-border':        'transparent',
  'nc-label-accent-bg':             'rgba(0,102,204,0.12)',
  'nc-label-accent-color':          '#0066cc',
  'nc-label-success-bg':            '#dcfce7',
  'nc-label-success-color':         '#16a34a',
  'nc-label-warning-bg':            '#fef3c7',
  'nc-label-warning-color':         '#d97706',
  'nc-label-danger-bg':             '#fee2e2',
  'nc-label-danger-color':          '#dc2626',
  'nc-label-info-bg':               '#dbeafe',
  'nc-label-info-color':            '#2563eb',
  'nc-label-solid-default-bg':      '#1e293b',
  'nc-label-solid-default-color':   '#ffffff',
  'nc-label-outline-border-width':  '1px',
  'nc-label-remove-size':           '14px',
  'nc-label-disabled-opacity':      '0.4',
  'nc-label-transition-duration':   '150ms'
}

const TOKEN_REFS = {
  'nc-label-default-bg':          'background-secondary',
  'nc-label-default-color':       'text-secondary',
  'nc-label-accent-bg':           'interactive-subtle',
  'nc-label-accent-color':        'interactive-default',
  'nc-label-success-bg':          'background-success',
  'nc-label-success-color':       'text-success',
  'nc-label-warning-bg':          'background-warning',
  'nc-label-warning-color':       'text-warning',
  'nc-label-danger-bg':           'background-danger',
  'nc-label-danger-color':        'text-danger',
  'nc-label-info-bg':             'background-info',
  'nc-label-info-color':          'text-info',
  'nc-label-solid-default-bg':    'background-inverse',
  'nc-label-solid-default-color': 'text-inverse'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'label') || null
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
const COLOR_KEYS = ['default', 'accent', 'success', 'warning', 'danger', 'info']
const COLOR_NAMES = { default: 'Default', accent: 'Accent', success: 'Success', warning: 'Warning', danger: 'Danger', info: 'Info' }

function subtleLabelStyle(tokens, color, { height = null, paddingX = null, fontSize = null, radius = null } = {}) {
  const bg = tokens[`nc-label-${color}-bg`] || TOKEN_DEFAULTS[`nc-label-${color}-bg`]
  const fg = tokens[`nc-label-${color}-color`] || TOKEN_DEFAULTS[`nc-label-${color}-color`]
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: height || tokens['nc-label-height-sm'] || '24px',
    padding: `0 ${paddingX || tokens['nc-label-padding-x'] || '8px'}`,
    borderRadius: radius || tokens['nc-label-radius'] || '4px',
    background: bg,
    color: fg,
    fontSize: fontSize || tokens['nc-label-font-size'] || '11px',
    fontWeight: tokens['nc-label-font-weight'] || '600',
    letterSpacing: tokens['nc-label-letter-spacing'] || '0.01em',
    fontFamily: 'inherit',
    lineHeight: '1',
    border: '1px solid transparent',
    whiteSpace: 'nowrap'
  }
}

function solidLabelStyle(tokens, color, { height = null, paddingX = null, fontSize = null, radius = null } = {}) {
  let bg, fg
  if (color === 'default') {
    bg = tokens['nc-label-solid-default-bg'] || '#1e293b'
    fg = tokens['nc-label-solid-default-color'] || '#ffffff'
  } else {
    bg = tokens[`nc-label-${color}-color`] || TOKEN_DEFAULTS[`nc-label-${color}-color`]
    fg = '#ffffff'
  }
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: height || tokens['nc-label-height-sm'] || '24px',
    padding: `0 ${paddingX || tokens['nc-label-padding-x'] || '8px'}`,
    borderRadius: radius || tokens['nc-label-radius'] || '4px',
    background: bg,
    color: fg,
    fontSize: fontSize || tokens['nc-label-font-size'] || '11px',
    fontWeight: tokens['nc-label-font-weight'] || '600',
    letterSpacing: tokens['nc-label-letter-spacing'] || '0.01em',
    fontFamily: 'inherit',
    lineHeight: '1',
    border: '1px solid transparent',
    whiteSpace: 'nowrap'
  }
}

function outlineLabelStyle(tokens, color, { height = null, paddingX = null, fontSize = null, radius = null } = {}) {
  const fg = tokens[`nc-label-${color}-color`] || TOKEN_DEFAULTS[`nc-label-${color}-color`]
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: height || tokens['nc-label-height-sm'] || '24px',
    padding: `0 ${paddingX || tokens['nc-label-padding-x'] || '8px'}`,
    borderRadius: radius || tokens['nc-label-radius'] || '4px',
    background: 'transparent',
    color: fg,
    fontSize: fontSize || tokens['nc-label-font-size'] || '11px',
    fontWeight: tokens['nc-label-font-weight'] || '600',
    letterSpacing: tokens['nc-label-letter-spacing'] || '0.01em',
    fontFamily: 'inherit',
    lineHeight: '1',
    border: `${tokens['nc-label-outline-border-width'] || '1px'} solid ${fg}`,
    whiteSpace: 'nowrap'
  }
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Variant & Color: Subtle / Solid / Outline rows
const LabelColors = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const rowLabelStyle = {
        fontSize: '11px',
        fontWeight: '600',
        color: props.theme['text-tertiary'] || '#94a3b8',
        minWidth: '52px',
        lineHeight: '1.6'
      }
      const rows = [
        {
          label: 'Subtle',
          items: COLOR_KEYS.map(color =>
            h('span', { style: subtleLabelStyle(t, color) }, COLOR_NAMES[color])
          )
        },
        {
          label: 'Solid',
          items: COLOR_KEYS.map(color =>
            h('span', { style: solidLabelStyle(t, color) }, COLOR_NAMES[color])
          )
        },
        {
          label: 'Outline',
          items: COLOR_KEYS.map(color =>
            h('span', { style: outlineLabelStyle(t, color) }, COLOR_NAMES[color])
          )
        }
      ]
      return h('div', { class: 'arena-preview-stack' },
        rows.map(({ label, items }) =>
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } }, [
            h('span', { style: rowLabelStyle }, label),
            ...items
          ])
        )
      )
    }
  }
})

// Size Comparison: XS / SM / MD
const LabelSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const sizes = [
        {
          label: 'XS',
          height: t['nc-label-height-xs'] || '20px',
          paddingX: t['nc-label-padding-x-xs'] || '4px',
          fontSize: t['nc-label-font-size-xs'] || '10px'
        },
        {
          label: 'SM',
          height: t['nc-label-height-sm'] || '24px',
          paddingX: t['nc-label-padding-x'] || '8px',
          fontSize: t['nc-label-font-size'] || '11px'
        },
        {
          label: 'MD',
          height: t['nc-label-height-md'] || '28px',
          paddingX: t['nc-label-padding-x-md'] || '12px',
          fontSize: t['nc-label-font-size-md'] || '12px'
        }
      ]
      const texts = ['Feature', 'Beta', 'Neu']
      const colors = ['accent', 'success', 'warning']
      return h('div', { class: 'arena-preview-stack' },
        sizes.map(({ label, height, paddingX, fontSize }) =>
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
            h('span', { style: { fontSize: '11px', fontWeight: '600', color: props.theme['text-secondary'] || '#666', minWidth: '24px' } }, label),
            ...texts.map((text, i) =>
              h('span', { style: subtleLabelStyle(t, colors[i], { height, paddingX, fontSize }) }, text)
            )
          ])
        )
      )
    }
  }
})

// Shape + Interactive: rounded, pill, removable, disabled
const LabelShapes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const sectionLabelStyle = {
        fontSize: '11px',
        color: props.theme['text-secondary'] || '#666',
        marginBottom: '6px',
        display: 'block'
      }

      // Rounded labels
      const roundedLabels = ['Design', 'System', 'Tokens'].map((text, i) =>
        h('span', { style: subtleLabelStyle(t, COLOR_KEYS[i + 1], { radius: t['nc-label-radius'] || '4px' }) }, text)
      )

      // Pill labels
      const pillLabels = ['Design', 'System', 'Tokens'].map((text, i) =>
        h('span', { style: subtleLabelStyle(t, COLOR_KEYS[i + 1], { radius: t['nc-label-radius-pill'] || '9999px' }) }, text)
      )

      // Removable labels
      const removeSize = t['nc-label-remove-size'] || '14px'
      const removeBtnStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: removeSize,
        height: removeSize,
        fontSize: removeSize,
        lineHeight: '1',
        cursor: 'pointer',
        opacity: '0.6',
        marginLeft: '2px',
        border: 'none',
        background: 'transparent',
        color: 'inherit',
        padding: '0',
        fontFamily: 'inherit'
      }
      const removableColors = ['accent', 'success']
      const removableLabels = removableColors.map(color => {
        const base = subtleLabelStyle(t, color)
        return h('span', {
          style: { ...base, paddingRight: '4px', gap: t['nc-label-gap'] || '4px' }
        }, [
          'Tag',
          h('span', { style: removeBtnStyle }, '×')
        ])
      })

      // Disabled label
      const disabledLabel = h('span', {
        style: {
          ...subtleLabelStyle(t, 'default'),
          opacity: t['nc-label-disabled-opacity'] || '0.4',
          cursor: 'not-allowed'
        }
      }, 'Disabled')

      return h('div', { class: 'arena-preview-stack' }, [
        h('div', {}, [
          h('span', { style: sectionLabelStyle }, 'Rounded (default radius)'),
          h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } }, roundedLabels)
        ]),
        h('div', {}, [
          h('span', { style: sectionLabelStyle }, 'Pill (radius-pill)'),
          h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } }, pillLabels)
        ]),
        h('div', {}, [
          h('span', { style: sectionLabelStyle }, 'Removable'),
          h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } }, removableLabels)
        ]),
        h('div', {}, [
          h('span', { style: sectionLabelStyle }, 'Disabled'),
          h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } }, [disabledLabel])
        ])
      ])
    }
  }
})
</script>
