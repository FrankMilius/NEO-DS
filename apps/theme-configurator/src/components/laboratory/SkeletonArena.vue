<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: All Shapes -->
    <div class="arena-category-divider">
      <span class="arena-category-label">All Shapes</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SkeletonShapes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SkeletonShapes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SkeletonShapes :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Card Placeholder -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Card Placeholder</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SkeletonCard :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SkeletonCard :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SkeletonCard :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Size Scale -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Size Scale — XS / SM / MD / LG</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <SkeletonSizes :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <SkeletonSizes :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <SkeletonSizes :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('skeleton')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-skeleton-bg':           '#e2e8f0',
  'nc-skeleton-shimmer':      '#f1f5f9',
  'nc-skeleton-radius':       '4px',
  'nc-skeleton-radius-circle':'9999px',
  'nc-skeleton-duration':     '1.5s',
  'nc-skeleton-ease':         'ease-in-out',
  'nc-skeleton-height-xs':    '12px',
  'nc-skeleton-height-sm':    '16px',
  'nc-skeleton-height-md':    '20px',
  'nc-skeleton-height-lg':    '24px'
}

const TOKEN_REFS = {
  'nc-skeleton-bg':      'background-secondary',
  'nc-skeleton-shimmer': 'background-tertiary',
  'nc-skeleton-radius':  'radius-sm'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'skeleton') || null
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

// Static shimmer: blend bg and shimmer at 50% to approximate mid-animation state
function skeletonBg(tokens) {
  const bg = tokens['nc-skeleton-bg'] || '#e2e8f0'
  const shimmer = tokens['nc-skeleton-shimmer'] || '#f1f5f9'
  // Use a static gradient to visually suggest the shimmer sweep
  return `linear-gradient(90deg, ${bg} 0%, ${shimmer} 50%, ${bg} 100%)`
}

function skeletonBlock(tokens, { width = '100%', height = '16px', radius = null, shape = 'rect' } = {}) {
  const r = shape === 'circle'
    ? (tokens['nc-skeleton-radius-circle'] || '9999px')
    : (radius || tokens['nc-skeleton-radius'] || '4px')
  return {
    display: 'block',
    width,
    height,
    borderRadius: r,
    background: skeletonBg(tokens),
    flexShrink: '0'
  }
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// All Shapes: lines, circle, square, rectangle
const SkeletonShapes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const labelStyle = {
        fontSize: '11px',
        color: props.theme['text-tertiary'] || '#94a3b8',
        marginBottom: '6px',
        display: 'block'
      }

      return h('div', { class: 'arena-preview-stack', style: { width: '100%' } }, [
        // Text lines
        h('div', {}, [
          h('span', { style: labelStyle }, 'Text lines'),
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } }, [
            h('span', { style: skeletonBlock(t, { width: '100%', height: t['nc-skeleton-height-sm'] || '16px' }) }),
            h('span', { style: skeletonBlock(t, { width: '75%', height: t['nc-skeleton-height-sm'] || '16px' }) }),
            h('span', { style: skeletonBlock(t, { width: '50%', height: t['nc-skeleton-height-sm'] || '16px' }) })
          ])
        ]),
        // Geometric shapes
        h('div', {}, [
          h('span', { style: labelStyle }, 'Shapes'),
          h('div', { style: { display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' } }, [
            h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' } }, [
              h('span', { style: skeletonBlock(t, { width: '40px', height: '40px', shape: 'circle' }) }),
              h('span', { style: { fontSize: '10px', color: props.theme['text-tertiary'] || '#94a3b8' } }, 'Circle')
            ]),
            h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' } }, [
              h('span', { style: skeletonBlock(t, { width: '100px', height: '100px' }) }),
              h('span', { style: { fontSize: '10px', color: props.theme['text-tertiary'] || '#94a3b8' } }, 'Square')
            ]),
            h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' } }, [
              h('span', { style: skeletonBlock(t, { width: '200px', height: '100px' }) }),
              h('span', { style: { fontSize: '10px', color: props.theme['text-tertiary'] || '#94a3b8' } }, 'Rectangle')
            ])
          ])
        ])
      ])
    }
  }
})

// Card Placeholder
const SkeletonCard = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const cardStyle = {
        width: '100%',
        maxWidth: '300px',
        border: `1px solid ${props.theme['border-secondary'] || '#e2e8f0'}`,
        borderRadius: '8px',
        overflow: 'hidden',
        background: props.theme['surface-elevated'] || props.theme['background-base'] || '#fff'
      }
      const bodyStyle = {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }
      return h('div', { style: cardStyle }, [
        // Image area
        h('span', { style: skeletonBlock(t, { width: '100%', height: '160px', radius: '0' }) }),
        // Text lines
        h('div', { style: bodyStyle }, [
          h('span', { style: skeletonBlock(t, { width: '80%', height: t['nc-skeleton-height-md'] || '20px' }) }),
          h('span', { style: skeletonBlock(t, { width: '60%', height: t['nc-skeleton-height-sm'] || '16px' }) }),
          h('span', { style: skeletonBlock(t, { width: '40%', height: t['nc-skeleton-height-sm'] || '16px' }) }),
          // Avatar row
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' } }, [
            h('span', { style: skeletonBlock(t, { width: '32px', height: '32px', shape: 'circle' }) }),
            h('span', { style: skeletonBlock(t, { width: '32px', height: '32px', shape: 'circle' }) }),
            h('span', { style: { ...skeletonBlock(t, { width: '80px', height: t['nc-skeleton-height-sm'] || '16px' }), flex: '1' } })
          ])
        ])
      ])
    }
  }
})

// Size Scale: XS / SM / MD / LG
const SkeletonSizes = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const sizes = [
        { label: 'XS', heightKey: 'nc-skeleton-height-xs' },
        { label: 'SM', heightKey: 'nc-skeleton-height-sm' },
        { label: 'MD', heightKey: 'nc-skeleton-height-md' },
        { label: 'LG', heightKey: 'nc-skeleton-height-lg' }
      ]
      const widths = ['100%', '75%', '50%']
      return h('div', { class: 'arena-preview-stack', style: { width: '100%' } },
        sizes.map(({ label, heightKey }) => {
          const height = t[heightKey] || TOKEN_DEFAULTS[heightKey]
          return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' } }, [
            h('span', { style: { fontSize: '11px', fontWeight: '600', color: props.theme['text-secondary'] || '#666' } },
              `${label} — ${height}`
            ),
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' } },
              widths.map(w => h('span', { style: skeletonBlock(t, { width: w, height }) }))
            )
          ])
        })
      )
    }
  }
})
</script>
