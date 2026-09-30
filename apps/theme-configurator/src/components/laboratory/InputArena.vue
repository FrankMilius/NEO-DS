<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Size Scale -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Size Scale — SM / MD / LG</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <InputSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <InputSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <InputSizes :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: All States -->
    <div class="arena-category-divider">
      <span class="arena-category-label">All States — MD</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <InputStates :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <InputStates :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <InputStates :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Variants -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Variants — Outlined / Filled / Borderless</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <InputVariants :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <InputVariants :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <InputVariants :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Adornments -->
    <div class="arena-category-divider">
      <span class="arena-category-label">With Adornments — Icons &amp; Affixes</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <InputAdornments :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <InputAdornments :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <InputAdornments :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('input')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  // Geometry
  'nc-input-height-sm':        '32px',
  'nc-input-height-md':        '40px',
  'nc-input-height-lg':        '48px',
  'nc-input-padding-x-sm':     '12px',
  'nc-input-padding-x-md':     '16px',
  'nc-input-padding-x-lg':     '20px',
  'nc-input-padding-y-sm':     '4px',
  'nc-input-padding-y-md':     '8px',
  'nc-input-padding-y-lg':     '12px',
  'nc-input-font-size-sm':     '12px',
  'nc-input-font-size-md':     '14px',
  'nc-input-font-size-lg':     '16px',
  'nc-input-radius':           '6px',
  'nc-input-border-width':     '1px',
  // Colors
  'nc-input-bg':               '#ffffff',
  'nc-input-color':            '#1a1a1a',
  'nc-input-border':           '#d1d5db',
  'nc-input-placeholder':      '#9ca3af',
  'nc-input-border-hover':     '#6b7280',
  'nc-input-border-focus':     '#0066cc',
  'nc-input-border-error':     '#dc2626',
  'nc-input-border-success':   '#16a34a',
  'nc-input-transition-duration': '150ms',
  // Disabled
  'nc-input-disabled-bg':      '#f3f4f6',
  'nc-input-disabled-color':   '#9ca3af',
  'nc-input-disabled-border':  '#e5e7eb',
  'nc-input-disabled-opacity': '0.6',
  // Icon
  'nc-input-icon-size':        '20px',
  'nc-input-icon-color':       '#6b7280',
  // Affix
  'nc-input-affix-color':      '#6b7280',
  'nc-input-affix-font-size':  '13px',
  'nc-input-affix-padding-x':  '12px',
  'nc-input-affix-bg':         '#f3f4f6',
  'nc-input-affix-border':     '#d1d5db',
  // Filled variant
  'nc-input-filled-bg':        '#f3f4f6',
  'nc-input-filled-bg-hover':  '#e5e7eb',
  'nc-input-filled-underline-width': '2px',
  'nc-input-filled-underline-color': '#d1d5db',
  'nc-input-filled-underline-color-focus': '#0066cc',
  // Borderless variant
  'nc-input-borderless-bg-hover': 'rgba(0,0,0,0.05)',
  'nc-input-borderless-underline-focus': '#0066cc',
}

const TOKEN_REFS = {
  'nc-input-bg':               'background-base',
  'nc-input-color':            'text-primary',
  'nc-input-border':           'border-primary',
  'nc-input-placeholder':      'text-tertiary',
  'nc-input-border-hover':     'border-strong',
  'nc-input-border-focus':     'interactive-default',
  'nc-input-border-error':     'feedback-danger',
  'nc-input-border-success':   'feedback-success',
  'nc-input-disabled-bg':      'background-disabled',
  'nc-input-disabled-color':   'text-disabled',
  'nc-input-icon-color':       'text-secondary',
  'nc-input-affix-color':      'text-secondary',
  'nc-input-affix-bg':         'background-secondary',
  'nc-input-affix-border':     'border-primary',
  'nc-input-filled-bg':        'background-secondary',
  'nc-input-filled-bg-hover':  'background-tertiary',
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'input') || null
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
function baseInputStyle(tokens, size = 'md') {
  const height = tokens[`nc-input-height-${size}`] || TOKEN_DEFAULTS[`nc-input-height-${size}`]
  const paddingX = tokens[`nc-input-padding-x-${size}`] || TOKEN_DEFAULTS[`nc-input-padding-x-${size}`]
  const paddingY = tokens[`nc-input-padding-y-${size}`] || TOKEN_DEFAULTS[`nc-input-padding-y-${size}`]
  const fontSize = tokens[`nc-input-font-size-${size}`] || TOKEN_DEFAULTS[`nc-input-font-size-${size}`]
  return {
    display: 'block',
    width: '100%',
    height,
    minHeight: height,
    padding: `${paddingY} ${paddingX}`,
    fontSize,
    fontFamily: 'inherit',
    lineHeight: '1.5',
    color: tokens['nc-input-color'] || TOKEN_DEFAULTS['nc-input-color'],
    background: tokens['nc-input-bg'] || TOKEN_DEFAULTS['nc-input-bg'],
    border: `${tokens['nc-input-border-width'] || '1px'} solid ${tokens['nc-input-border'] || TOKEN_DEFAULTS['nc-input-border']}`,
    borderRadius: tokens['nc-input-radius'] || TOKEN_DEFAULTS['nc-input-radius'],
    outline: 'none',
    boxSizing: 'border-box',
    transition: `border-color ${tokens['nc-input-transition-duration'] || '150ms'} ease`,
  }
}

function inputStateStyle(tokens, state = 'default', size = 'md') {
  const base = baseInputStyle(tokens, size)
  if (state === 'hover') {
    return { ...base, borderColor: tokens['nc-input-border-hover'] || TOKEN_DEFAULTS['nc-input-border-hover'] }
  }
  if (state === 'focus') {
    return {
      ...base,
      borderColor: tokens['nc-input-border-focus'] || TOKEN_DEFAULTS['nc-input-border-focus'],
      boxShadow: `0 0 0 3px ${tokens['nc-input-border-focus'] || TOKEN_DEFAULTS['nc-input-border-focus']}33`,
    }
  }
  if (state === 'error') {
    return { ...base, borderColor: tokens['nc-input-border-error'] || TOKEN_DEFAULTS['nc-input-border-error'] }
  }
  if (state === 'disabled') {
    return {
      ...base,
      background: tokens['nc-input-disabled-bg'] || TOKEN_DEFAULTS['nc-input-disabled-bg'],
      color: tokens['nc-input-disabled-color'] || TOKEN_DEFAULTS['nc-input-disabled-color'],
      borderColor: tokens['nc-input-disabled-border'] || TOKEN_DEFAULTS['nc-input-disabled-border'],
      opacity: tokens['nc-input-disabled-opacity'] || TOKEN_DEFAULTS['nc-input-disabled-opacity'],
      cursor: 'not-allowed',
    }
  }
  return base
}

function stateLabel(theme, text) {
  return h('span', {
    style: { fontSize: '11px', color: theme['text-secondary'] || '#666', marginTop: '4px', display: 'block', textAlign: 'center' }
  }, text)
}

function itemWrap(children) {
  return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '140px', flex: '1' } }, children)
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Size Scale
const InputSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const sizes = [
        { label: 'SM — 32px', size: 'sm' },
        { label: 'MD — 40px', size: 'md' },
        { label: 'LG — 48px', size: 'lg' },
      ]
      return h('div', { class: 'arena-preview-stack' },
        sizes.map(({ label, size }) =>
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
            h('span', {
              style: { fontSize: '11px', fontWeight: '600', minWidth: '72px', color: props.theme['text-secondary'] || '#666' }
            }, label),
            h('div', { style: { flex: '1' } }, [
              h('input', {
                type: 'text',
                placeholder: 'Placeholder…',
                style: inputStateStyle(t, 'default', size),
              })
            ])
          ])
        )
      )
    }
  }
})

// All States at MD
const InputStates = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const states = [
        { label: 'Default',  state: 'default',  placeholder: 'Placeholder…', value: '',         disabled: false },
        { label: 'Hover',    state: 'hover',     placeholder: 'Placeholder…', value: '',         disabled: false },
        { label: 'Focus',    state: 'focus',     placeholder: '',              value: 'Eingabe…', disabled: false },
        { label: 'Error',    state: 'error',     placeholder: '',              value: 'Fehler',   disabled: false },
        { label: 'Disabled', state: 'disabled',  placeholder: 'Deaktiviert',  value: '',         disabled: true  },
      ]
      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap', alignItems: 'flex-start' } },
        states.map(s =>
          itemWrap([
            h('input', {
              type: 'text',
              placeholder: s.placeholder,
              value: s.value,
              disabled: s.disabled,
              style: inputStateStyle(t, s.state, 'md'),
            }),
            stateLabel(props.theme, s.label)
          ])
        )
      )
    }
  }
})

// Variants: Outlined / Filled / Borderless
const InputVariants = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens

      const outlinedStyle = inputStateStyle(t, 'default', 'md')

      const filledStyle = {
        ...baseInputStyle(t, 'md'),
        background: t['nc-input-filled-bg'] || TOKEN_DEFAULTS['nc-input-filled-bg'],
        border: 'none',
        borderBottom: `${t['nc-input-filled-underline-width'] || TOKEN_DEFAULTS['nc-input-filled-underline-width']} solid ${t['nc-input-filled-underline-color'] || TOKEN_DEFAULTS['nc-input-filled-underline-color']}`,
        borderRadius: `${t['nc-input-radius'] || TOKEN_DEFAULTS['nc-input-radius']} ${t['nc-input-radius'] || TOKEN_DEFAULTS['nc-input-radius']} 0 0`,
      }

      const borderlessStyle = {
        ...baseInputStyle(t, 'md'),
        background: 'transparent',
        border: 'none',
        borderRadius: t['nc-input-radius'] || TOKEN_DEFAULTS['nc-input-radius'],
        paddingLeft: '4px',
        paddingRight: '4px',
      }

      const variants = [
        { label: 'Outlined',   style: outlinedStyle },
        { label: 'Filled',     style: filledStyle    },
        { label: 'Borderless', style: borderlessStyle },
      ]

      return h('div', { class: 'arena-preview-stack' },
        variants.map(v =>
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
            h('span', {
              style: { fontSize: '11px', fontWeight: '600', minWidth: '72px', color: props.theme['text-secondary'] || '#666' }
            }, v.label),
            h('div', { style: { flex: '1' } }, [
              h('input', {
                type: 'text',
                placeholder: 'Placeholder…',
                style: v.style,
              })
            ])
          ])
        )
      )
    }
  }
})

// With Adornments
const InputAdornments = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const base = inputStateStyle(t, 'default', 'md')
      const iconColor = t['nc-input-icon-color'] || TOKEN_DEFAULTS['nc-input-icon-color']
      const affixColor = t['nc-input-affix-color'] || TOKEN_DEFAULTS['nc-input-affix-color']
      const affixBg = t['nc-input-affix-bg'] || TOKEN_DEFAULTS['nc-input-affix-bg']
      const affixBorder = t['nc-input-affix-border'] || TOKEN_DEFAULTS['nc-input-affix-border']
      const borderWidth = t['nc-input-border-width'] || '1px'
      const borderColor = t['nc-input-border'] || TOKEN_DEFAULTS['nc-input-border']
      const radius = t['nc-input-radius'] || TOKEN_DEFAULTS['nc-input-radius']
      const height = t['nc-input-height-md'] || TOKEN_DEFAULTS['nc-input-height-md']
      const fontSize = t['nc-input-font-size-md'] || TOKEN_DEFAULTS['nc-input-font-size-md']
      const paddingX = t['nc-input-padding-x-md'] || TOKEN_DEFAULTS['nc-input-padding-x-md']
      const bg = t['nc-input-bg'] || TOKEN_DEFAULTS['nc-input-bg']
      const color = t['nc-input-color'] || TOKEN_DEFAULTS['nc-input-color']

      // Search icon SVG (magnifying glass)
      const searchIcon = h('svg', {
        xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 24 24',
        fill: 'none', stroke: iconColor, 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        style: { flexShrink: '0', pointerEvents: 'none' },
        'aria-hidden': 'true'
      }, [
        h('circle', { cx: '11', cy: '11', r: '8' }),
        h('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' })
      ])

      // Clear X icon
      const clearIcon = h('svg', {
        xmlns: 'http://www.w3.org/2000/svg', width: '14', height: '14', viewBox: '0 0 24 24',
        fill: 'none', stroke: iconColor, 'stroke-width': '2.5', 'stroke-linecap': 'round',
        style: { flexShrink: '0', pointerEvents: 'none' },
        'aria-hidden': 'true'
      }, [
        h('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
        h('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
      ])

      const wrapperStyle = {
        display: 'flex', alignItems: 'center', position: 'relative',
        height, border: `${borderWidth} solid ${borderColor}`,
        borderRadius: radius, background: bg, overflow: 'hidden', flex: '1',
        boxSizing: 'border-box',
      }
      const inputInnerStyle = {
        flex: '1', border: 'none', outline: 'none', background: 'transparent',
        color, fontSize, fontFamily: 'inherit', padding: `0 ${paddingX}`,
        height: '100%', boxSizing: 'border-box',
      }

      // Leading icon — search
      const leadingIcon = h('div', { style: wrapperStyle }, [
        h('span', { style: { display: 'flex', alignItems: 'center', paddingLeft: '10px' } }, [searchIcon]),
        h('input', { type: 'text', placeholder: 'Suchen…', style: inputInnerStyle }),
      ])

      // Trailing icon — clear X
      const trailingIcon = h('div', { style: wrapperStyle }, [
        h('input', { type: 'text', value: 'Eingabetext', style: inputInnerStyle }),
        h('span', { style: { display: 'flex', alignItems: 'center', paddingRight: '10px' } }, [clearIcon]),
      ])

      // Prefix text "$"
      const affixStyle = {
        display: 'flex', alignItems: 'center', paddingInline: '10px',
        background: affixBg, color: affixColor,
        fontSize: t['nc-input-affix-font-size'] || TOKEN_DEFAULTS['nc-input-affix-font-size'],
        fontFamily: 'inherit', height: '100%', borderRight: `${borderWidth} solid ${affixBorder}`,
        whiteSpace: 'nowrap', flexShrink: '0',
      }
      const suffixStyle = { ...affixStyle, borderRight: 'none', borderLeft: `${borderWidth} solid ${affixBorder}` }

      const prefixInput = h('div', { style: wrapperStyle }, [
        h('span', { style: affixStyle }, '$'),
        h('input', { type: 'text', placeholder: '0.00', style: inputInnerStyle }),
      ])

      // Suffix text ".com"
      const suffixInput = h('div', { style: wrapperStyle }, [
        h('input', { type: 'text', placeholder: 'domain', style: inputInnerStyle }),
        h('span', { style: suffixStyle }, '.com'),
      ])

      const adornments = [
        { label: 'Leading Icon',  el: leadingIcon  },
        { label: 'Trailing Icon', el: trailingIcon },
        { label: 'Prefix "$"',   el: prefixInput  },
        { label: 'Suffix ".com"', el: suffixInput  },
      ]

      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap', alignItems: 'flex-start' } },
        adornments.map(a =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '160px', flex: '1' } }, [
            a.el,
            h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666', textAlign: 'center' } }, a.label)
          ])
        )
      )
    }
  }
})
</script>
