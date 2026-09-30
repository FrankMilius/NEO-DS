<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Size Scale -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Size Scale — XS bis XL</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SpinnerSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SpinnerSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SpinnerSizes :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Color Variants -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Color Variants</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SpinnerColors :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SpinnerColors :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SpinnerColors :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: In Button + Overlay -->
    <div class="arena-category-divider">
      <span class="arena-category-label">In Button + Overlay</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SpinnerInContext :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SpinnerInContext :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SpinnerInContext :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('spinner')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-spinner-color':            '#0066cc',
  'nc-spinner-track-color':      '#e2e8f0',
  'nc-spinner-duration':         '700ms',
  'nc-spinner-ease':             'linear',
  'nc-spinner-size-xs':          '16px',
  'nc-spinner-size-sm':          '20px',
  'nc-spinner-size-md':          '24px',
  'nc-spinner-size-lg':          '32px',
  'nc-spinner-size-xl':          '40px',
  'nc-spinner-border-width-xs':  '1px',
  'nc-spinner-border-width-sm':  '2px',
  'nc-spinner-border-width-md':  '2px',
  'nc-spinner-border-width-lg':  '3px',
  'nc-spinner-border-width-xl':  '3px'
}

const TOKEN_REFS = {
  'nc-spinner-color':        'interactive-default',
  'nc-spinner-track-color':  'border-secondary'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'spinner') || null
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
// Render Helpers
// ---------------------------------------------------------------------------
function spinnerStyle(tokens, { size = 'md', color, trackColor } = {}) {
  const sz = tokens[`nc-spinner-size-${size}`] || '24px'
  const bw = tokens[`nc-spinner-border-width-${size}`] || '2px'
  const spinnerColor = color || tokens['nc-spinner-color'] || '#0066cc'
  const track = trackColor || tokens['nc-spinner-track-color'] || '#e2e8f0'
  return {
    display: 'inline-block',
    width: sz,
    height: sz,
    borderRadius: '50%',
    border: `${bw} solid ${track}`,
    borderTopColor: spinnerColor,
    flexShrink: '0'
  }
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Größenskala XS – XL
const SpinnerSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
      const items = sizes.map(size =>
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' } }, [
          h('span', { style: spinnerStyle(t, { size }) }),
          h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } }, size.toUpperCase())
        ])
      )
      return h('div', { class: 'arena-btn-row', style: { alignItems: 'flex-end', flexWrap: 'wrap' } }, items)
    }
  }
})

// Farbvarianten
const SpinnerColors = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const variants = [
        { label: 'Default',  color: t['nc-spinner-color'],  bg: props.theme['background-base'] || '#fff',    track: t['nc-spinner-track-color'] },
        { label: 'Inverse',  color: '#ffffff',               bg: '#0066cc',                                   track: 'rgba(255,255,255,0.3)' },
        { label: 'Success',  color: '#16a34a',               bg: props.theme['background-base'] || '#fff',    track: '#dcfce7' },
        { label: 'Warning',  color: '#f59e0b',               bg: props.theme['background-base'] || '#fff',    track: '#fef3c7' },
        { label: 'Danger',   color: '#dc2626',               bg: props.theme['background-base'] || '#fff',    track: '#fee2e2' }
      ]
      const items = variants.map(v =>
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' } }, [
          h('div', {
            style: {
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '52px', height: '52px', borderRadius: '8px', background: v.bg
            }
          }, [
            h('span', { style: spinnerStyle(t, { size: 'md', color: v.color, trackColor: v.track }) })
          ]),
          h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } }, v.label)
        ])
      )
      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap' } }, items)
    }
  }
})

// In Button + Overlay-Kontext
const SpinnerInContext = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const spinnerColor = t['nc-spinner-color'] || '#0066cc'
      const interactiveDefault = props.theme['interactive-default'] || '#0066cc'

      // Primär-Button mit kleinem Spinner
      const buttonSpinner = h('span', {
        style: {
          display: 'inline-block',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.4)',
          borderTopColor: '#ffffff',
          flexShrink: '0'
        }
      })
      const loadingButton = h('button', {
        style: {
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 16px', borderRadius: '6px',
          background: interactiveDefault, color: '#ffffff',
          border: 'none', fontSize: '14px', fontWeight: '600',
          cursor: 'not-allowed', opacity: '0.85'
        }
      }, [buttonSpinner, 'Laden…'])

      // Karten-Overlay mit großem Spinner
      const overlayCard = h('div', {
        style: {
          position: 'relative', width: '180px', height: '100px',
          borderRadius: '8px', background: props.theme['surface-elevated'] || '#fff',
          border: `1px solid ${props.theme['border-secondary'] || '#e2e8f0'}`,
          overflow: 'hidden'
        }
      }, [
        // Karten-Inhalt (gedimmt)
        h('div', {
          style: {
            padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px'
          }
        }, [
          h('div', { style: { width: '80px', height: '10px', borderRadius: '4px', background: props.theme['background-tertiary'] || '#e2e8f0' } }),
          h('div', { style: { width: '120px', height: '8px', borderRadius: '4px', background: props.theme['background-secondary'] || '#f1f5f9' } }),
          h('div', { style: { width: '60px', height: '8px', borderRadius: '4px', background: props.theme['background-secondary'] || '#f1f5f9' } })
        ]),
        // Halbtransparentes Overlay
        h('div', {
          style: {
            position: 'absolute', inset: '0',
            background: 'rgba(255,255,255,0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }
        }, [
          h('span', { style: spinnerStyle(t, { size: 'lg', color: spinnerColor }) })
        ])
      ])

      return h('div', { class: 'arena-btn-row', style: { flexWrap: 'wrap', alignItems: 'center' } }, [
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' } }, [
          h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } }, 'Button mit Spinner'),
          loadingButton
        ]),
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' } }, [
          h('span', { style: { fontSize: '11px', color: props.theme['text-secondary'] || '#666' } }, 'Karten-Overlay'),
          overlayCard
        ])
      ])
    }
  }
})
</script>
