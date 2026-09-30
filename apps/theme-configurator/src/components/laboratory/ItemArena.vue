<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Variant Comparison -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Variant Comparison</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ItemVariants :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ItemVariants :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ItemVariants :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Interactive States -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Interactive States</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ItemStates :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ItemStates :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ItemStates :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Density + Media -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Density + Media Comparison</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <ItemDensity :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <ItemDensity :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <ItemDensity :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('item')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-item-bg':                   'transparent',
  'nc-item-border':               'transparent',
  'nc-item-hover-bg':             '#f1f5f9',
  'nc-item-active-bg':            '#e2e8f0',
  'nc-item-title-color':          '#0f172a',
  'nc-item-desc-color':           '#64748b',
  'nc-item-accent-color':         '#0066cc',
  'nc-item-accent-width':         '2px',
  'nc-item-gap':                  '12px',
  'nc-item-padding-x':            '16px',
  'nc-item-padding-y':            '12px',
  'nc-item-radius':               '6px',
  'nc-item-border-width':         '1px',
  'nc-item-align':                'center',
  'nc-item-title-font-size':      '14px',
  'nc-item-title-font-weight':    '700',
  'nc-item-desc-font-size':       '12px',
  'nc-item-selected-bg':          'rgba(0,102,204,0.1)',
  'nc-item-selected-border':      '#0066cc',
  'nc-item-selected-accent-width':'2px',
  'nc-item-media-size':           '40px',
  'nc-item-media-radius':         '6px',
  'nc-item-media-bg':             '#f1f5f9',
  'nc-item-media-color':          '#64748b',
  'nc-item-thumbnail-width':      '120px',
  'nc-item-thumbnail-radius':     '6px',
  'nc-item-compact-padding-x':    '8px',
  'nc-item-compact-padding-y':    '4px',
  'nc-item-compact-gap':          '8px',
  'nc-item-compact-media-size':   '28px',
  'nc-item-loose-padding-x':      '20px',
  'nc-item-loose-padding-y':      '16px',
  'nc-item-loose-gap':            '16px',
  'nc-item-loose-media-size':     '48px',
  'nc-item-disabled-opacity':     '0.4'
}

const TOKEN_REFS = {
  'nc-item-bg':             'background-base',
  'nc-item-hover-bg':       'background-secondary',
  'nc-item-active-bg':      'background-tertiary',
  'nc-item-title-color':    'text-primary',
  'nc-item-desc-color':     'text-secondary',
  'nc-item-accent-color':   'interactive-default',
  'nc-item-selected-bg':    'interactive-subtle',
  'nc-item-selected-border':'interactive-default',
  'nc-item-media-bg':       'background-secondary',
  'nc-item-media-color':    'text-secondary'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'item') || null
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
function renderMediaCircle(tokens, { size = '40px', initial = 'D', radius = null } = {}) {
  return h('div', {
    style: {
      width: size,
      height: size,
      borderRadius: radius || tokens['nc-item-media-radius'] || '6px',
      background: tokens['nc-item-media-bg'] || '#f1f5f9',
      color: tokens['nc-item-media-color'] || '#64748b',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '13px', fontWeight: '700', flexShrink: '0'
    }
  }, initial)
}

function renderItem(tokens, theme, {
  title = 'Dashboard',
  desc = 'Übersicht & Kennzahlen',
  initial = 'D',
  showMedia = true,
  variant = 'default', // default | outline | flush | accent
  state = 'default',   // default | hover | active | selected
  paddingX = null,
  paddingY = null,
  gap = null,
  mediaSize = null
} = {}) {
  const px = paddingX || tokens['nc-item-padding-x'] || '16px'
  const py = paddingY || tokens['nc-item-padding-y'] || '12px'
  const itemGap = gap || tokens['nc-item-gap'] || '12px'
  const mSize = mediaSize || tokens['nc-item-media-size'] || '40px'

  let bg = tokens['nc-item-bg'] || 'transparent'
  let borderLeft = 'none'
  let borderAll = 'none'
  let borderRadius = tokens['nc-item-radius'] || '6px'

  // State overrides
  if (state === 'hover') bg = tokens['nc-item-hover-bg'] || '#f1f5f9'
  else if (state === 'active') bg = tokens['nc-item-active-bg'] || '#e2e8f0'
  else if (state === 'selected') {
    bg = tokens['nc-item-selected-bg'] || 'rgba(0,102,204,0.1)'
    borderLeft = `${tokens['nc-item-selected-accent-width'] || '2px'} solid ${tokens['nc-item-selected-border'] || '#0066cc'}`
  }

  // Variant overrides
  if (variant === 'outline') {
    borderAll = `${tokens['nc-item-border-width'] || '1px'} solid ${theme['border-primary'] || '#cbd5e1'}`
  } else if (variant === 'accent') {
    borderLeft = `${tokens['nc-item-accent-width'] || '2px'} solid ${tokens['nc-item-accent-color'] || '#0066cc'}`
    borderRadius = '0 6px 6px 0'
  } else if (variant === 'flush') {
    // keine padding-x
  }

  const leftPad = variant === 'flush' ? '0' : px
  const rightPad = variant === 'flush' ? '0' : px

  const media = showMedia ? renderMediaCircle(tokens, { size: mSize, initial }) : null

  const textBlock = h('div', {
    style: { display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0', flex: '1' }
  }, [
    h('span', {
      style: {
        fontSize: tokens['nc-item-title-font-size'] || '14px',
        fontWeight: tokens['nc-item-title-font-weight'] || '700',
        color: tokens['nc-item-title-color'] || '#0f172a',
        lineHeight: '1.3',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
      }
    }, title),
    h('span', {
      style: {
        fontSize: tokens['nc-item-desc-font-size'] || '12px',
        color: tokens['nc-item-desc-color'] || '#64748b',
        lineHeight: '1.3',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
      }
    }, desc)
  ])

  return h('div', {
    style: {
      display: 'flex', alignItems: 'center',
      gap: itemGap,
      paddingTop: py, paddingBottom: py,
      paddingLeft: leftPad, paddingRight: rightPad,
      background: bg,
      borderRadius,
      border: borderAll,
      borderLeft: borderLeft !== 'none' ? borderLeft : (borderAll !== 'none' ? undefined : 'none'),
      boxSizing: 'border-box'
    }
  }, media ? [media, textBlock] : [textBlock])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

const items4 = [
  { title: 'Dashboard',  desc: 'Übersicht & Kennzahlen',  initial: 'D' },
  { title: 'Reports',    desc: 'Berichte & Exporte',       initial: 'R' },
  { title: 'Analytics',  desc: 'Datenanalyse & Charts',    initial: 'A' },
  { title: 'Settings',   desc: 'Einstellungen & Profil',   initial: 'S' }
]

// Variantenvergleich
const ItemVariants = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const sections = [
        { label: 'Default',     variant: 'default' },
        { label: 'Outline',     variant: 'outline' },
        { label: 'Flush',       variant: 'flush'   },
        { label: 'Accent',      variant: 'accent'  }
      ]
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' } },
        sections.map(({ label, variant }) =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } }, [
            h('span', { style: { fontSize: '11px', fontWeight: '600', color: props.theme['text-secondary'] || '#666', marginBottom: '4px' } }, label),
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: '1px', maxWidth: '320px' } },
              items4.map(item => renderItem(t, props.theme, { ...item, variant }))
            )
          ])
        )
      )
    }
  }
})

// Interaktionszustände
const ItemStates = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const states = [
        { state: 'default',  label: 'Default'  },
        { state: 'hover',    label: 'Hover'    },
        { state: 'active',   label: 'Active'   },
        { state: 'selected', label: 'Selected' }
      ]
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '320px', width: '100%' } },
        states.map(({ state, label }, i) =>
          renderItem(t, props.theme, { ...items4[i], state })
        )
      )
    }
  }
})

// Dichte + Media-Vergleich
const ItemDensity = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const users = [
        { title: 'Anna Schmidt',  desc: 'anna@example.com', initial: 'A' },
        { title: 'Ben Fischer',   desc: 'ben@example.com',  initial: 'B' },
        { title: 'Clara Weber',   desc: 'clara@example.com',initial: 'C' }
      ]
      const densities = [
        {
          label: 'Compact',
          paddingX: t['nc-item-compact-padding-x'] || '8px',
          paddingY: t['nc-item-compact-padding-y'] || '4px',
          gap:      t['nc-item-compact-gap']        || '8px',
          mediaSize:t['nc-item-compact-media-size'] || '28px'
        },
        {
          label: 'Default',
          paddingX: t['nc-item-padding-x']  || '16px',
          paddingY: t['nc-item-padding-y']  || '12px',
          gap:      t['nc-item-gap']         || '12px',
          mediaSize:t['nc-item-media-size'] || '40px'
        },
        {
          label: 'Loose',
          paddingX: t['nc-item-loose-padding-x'] || '20px',
          paddingY: t['nc-item-loose-padding-y'] || '16px',
          gap:      t['nc-item-loose-gap']        || '16px',
          mediaSize:t['nc-item-loose-media-size'] || '48px'
        }
      ]

      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' } },
        densities.map(({ label, paddingX, paddingY, gap, mediaSize }) =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } }, [
            h('span', { style: { fontSize: '11px', fontWeight: '600', color: props.theme['text-secondary'] || '#666', marginBottom: '4px' } }, label),
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: '1px', maxWidth: '300px' } },
              users.map(u => renderItem(t, props.theme, { ...u, paddingX, paddingY, gap, mediaSize }))
            )
          ])
        )
      )
    }
  }
})
</script>
