<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: All Placements -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Placements — Top / Bottom / Left / Right</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <TooltipPlacements :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <TooltipPlacements :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <TooltipPlacements :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Arrow -->
    <div class="arena-category-divider">
      <span class="arena-category-label">With Arrow — All Positions</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <TooltipWithArrow :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <TooltipWithArrow :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <TooltipWithArrow :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Sizes -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Content Length — Short / Long</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <TooltipSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <TooltipSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <TooltipSizes :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('tooltip')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-tooltip-bg':                  '#1a1a1a',
  'nc-tooltip-color':               '#ffffff',
  'nc-tooltip-padding':             '10px 12px',
  'nc-tooltip-radius':              '4px',
  'nc-tooltip-shadow':              '0 2px 8px rgba(0,0,0,0.25)',
  'nc-tooltip-font-size':           '12px',
  'nc-tooltip-max-width':           '320px',
  'nc-tooltip-arrow-size':          '8px',
  'nc-tooltip-offset':              '8px',
  'nc-tooltip-transition-duration': '150ms',
  'nc-tooltip-transition-timing':   'ease',
  'nc-tooltip-delay':               '300ms',
}

const TOKEN_REFS = {
  'nc-tooltip-bg':    'background-inverse',
  'nc-tooltip-color': 'text-inverse',
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'tooltip') || null
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
function tooltipBoxStyle(tokens) {
  return {
    background: tokens['nc-tooltip-bg'] || '#1a1a1a',
    color: tokens['nc-tooltip-color'] || '#fff',
    padding: tokens['nc-tooltip-padding'] || '10px 12px',
    borderRadius: tokens['nc-tooltip-radius'] || '4px',
    boxShadow: tokens['nc-tooltip-shadow'] || '0 2px 8px rgba(0,0,0,0.25)',
    fontSize: tokens['nc-tooltip-font-size'] || '12px',
    maxWidth: tokens['nc-tooltip-max-width'] || '320px',
    lineHeight: '1.4',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    userSelect: 'none',
  }
}

function triggerBtnStyle(theme) {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '6px 14px', borderRadius: '4px', fontSize: '13px',
    fontWeight: '500', cursor: 'default',
    border: `1px solid ${theme['border-primary'] || '#ccc'}`,
    background: theme['background-base'] || '#fff',
    color: theme['text-primary'] || '#1a1a1a',
    boxSizing: 'border-box',
  }
}

// Arrow element for a given position
function arrowEl(tokens, position) {
  const size = parseInt(tokens['nc-tooltip-arrow-size'] || '8', 10)
  const bg   = tokens['nc-tooltip-bg'] || '#1a1a1a'
  const half = size + 'px'
  const arrowStyleMap = {
    top:    { width: 0, height: 0, borderLeft: `${half} solid transparent`, borderRight: `${half} solid transparent`, borderTop: `${half} solid ${bg}`, position: 'absolute', bottom: `-${half}`, left: '50%', transform: 'translateX(-50%)' },
    bottom: { width: 0, height: 0, borderLeft: `${half} solid transparent`, borderRight: `${half} solid transparent`, borderBottom: `${half} solid ${bg}`, position: 'absolute', top: `-${half}`, left: '50%', transform: 'translateX(-50%)' },
    left:   { width: 0, height: 0, borderTop: `${half} solid transparent`, borderBottom: `${half} solid transparent`, borderLeft: `${half} solid ${bg}`, position: 'absolute', right: `-${half}`, top: '50%', transform: 'translateY(-50%)' },
    right:  { width: 0, height: 0, borderTop: `${half} solid transparent`, borderBottom: `${half} solid transparent`, borderRight: `${half} solid ${bg}`, position: 'absolute', left: `-${half}`, top: '50%', transform: 'translateY(-50%)' },
  }
  return h('span', { style: arrowStyleMap[position] || arrowStyleMap.top })
}

// Render a tooltip pair: trigger + visible tooltip for a given position
function renderTooltipUnit(tokens, theme, position, label, { withArrow = false } = {}) {
  const offset = parseInt(tokens['nc-tooltip-offset'] || '8', 10) + 'px'

  const tooltipContent = h('div', { style: { ...tooltipBoxStyle(tokens), position: 'relative' } }, [
    withArrow ? arrowEl(tokens, position) : null,
    label
  ])

  const TRIGGER_LABEL = 'Hover me'
  const trigger = h('button', { style: triggerBtnStyle(theme) }, TRIGGER_LABEL)

  // Positioning wrapper: places tooltip relative to trigger
  const positionStyles = {
    top: {
      wrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: offset },
      order: [tooltipContent, trigger],
    },
    bottom: {
      wrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: offset },
      order: [trigger, tooltipContent],
    },
    left: {
      wrapper: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: offset },
      order: [tooltipContent, trigger],
    },
    right: {
      wrapper: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: offset },
      order: [trigger, tooltipContent],
    },
  }

  const ps = positionStyles[position] || positionStyles.top
  const labelEl = h('span', {
    style: {
      fontSize: '11px', fontWeight: '600', color: theme['text-secondary'] || '#666',
      textAlign: 'center', display: 'block', marginTop: '4px'
    }
  }, position)

  return h('div', {
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '6px', padding: '12px 8px',
    }
  }, [
    h('div', { style: ps.wrapper }, ps.order),
    labelEl
  ])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

const TooltipPlacements = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const theme = props.theme
      const positions = ['top', 'bottom', 'left', 'right']
      const labels = {
        top:    'Appears above trigger',
        bottom: 'Appears below trigger',
        left:   'Appears left of trigger',
        right:  'Appears right of trigger',
      }
      return h('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          width: '100%',
        }
      }, positions.map(pos =>
        renderTooltipUnit(t, theme, pos, labels[pos])
      ))
    }
  }
})

const TooltipWithArrow = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const theme = props.theme
      const positions = ['top', 'bottom', 'left', 'right']
      const labels = {
        top:    'Top with arrow',
        bottom: 'Bottom with arrow',
        left:   'Left with arrow',
        right:  'Right with arrow',
      }
      return h('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          width: '100%',
        }
      }, positions.map(pos =>
        renderTooltipUnit(t, theme, pos, labels[pos], { withArrow: true })
      ))
    }
  }
})

const TooltipSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const theme = props.theme

      const rows = [
        { label: 'Short',        content: 'Delete item',               position: 'top' },
        { label: 'Medium',       content: 'Save your changes now',      position: 'top' },
        { label: 'Long',         content: 'This action cannot be undone. Please review before confirming.', position: 'top' },
      ]

      return h('div', { class: 'arena-preview-stack', style: { gap: '24px' } },
        rows.map(({ label, content, position }) => {
          const tooltipEl = h('div', { style: { ...tooltipBoxStyle(t), whiteSpace: content.length > 40 ? 'normal' : 'nowrap' } }, content)
          const trigger   = h('button', { style: triggerBtnStyle(theme) }, 'Hover me')
          const typeLabel = h('span', {
            style: { fontSize: '11px', fontWeight: '600', minWidth: '52px', color: theme['text-secondary'] || '#666' }
          }, label)

          return h('div', {
            style: { display: 'flex', alignItems: 'center', gap: '16px' }
          }, [
            typeLabel,
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' } }, [
              tooltipEl,
              trigger,
            ])
          ])
        })
      )
    }
  }
})
</script>
