<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default (gemischte Zustände) -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default — erstes Item offen</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <AccordionDefault :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <AccordionDefault :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <AccordionDefault :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: All Open -->
    <div class="arena-category-divider">
      <span class="arena-category-label">All Open — alle Items expandiert</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <AccordionAllOpen :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <AccordionAllOpen :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <AccordionAllOpen :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Separated -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Separated — Cards mit Gap und Shadow</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <AccordionSeparated :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <AccordionSeparated :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <AccordionSeparated :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('accordion')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-accordion-border':              '1px solid #e5e7eb',
  'nc-accordion-padding':             '12px 16px',
  'nc-accordion-icon-size':           '20px',
  'nc-accordion-trigger-font-weight': '500',
  'nc-accordion-trigger-color':       '#1a1a1a',
  'nc-accordion-content-color':       '#6b7280',
  'nc-accordion-icon-color':          '#9ca3af',
  'nc-accordion-trigger-hover-bg':    'rgba(0,0,0,0.04)',
  'nc-accordion-content-font-size':   '14px',
  'nc-accordion-item-gap':            '8px',
  'nc-accordion-item-radius':         '4px',
  'nc-accordion-item-shadow':         '0 1px 3px rgba(0,0,0,0.08)',
  'nc-accordion-item-bg':             '#ffffff',
  'nc-accordion-elevated-shadow':     '0 4px 12px rgba(0,0,0,0.12)',
  'nc-accordion-transition-duration': '200ms'
}

const TOKEN_REFS = {
  'nc-accordion-trigger-color':    'text-primary',
  'nc-accordion-content-color':    'text-secondary',
  'nc-accordion-icon-color':       'text-tertiary',
  'nc-accordion-item-bg':          'background-base'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'accordion') || null
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
function accordionWrapStyle(tokens) {
  return {
    width: '100%',
    border: tokens['nc-accordion-border'] || '1px solid #e5e7eb',
    borderRadius: '6px',
    overflow: 'hidden',
    fontFamily: 'inherit'
  }
}

function accordionItemStyle(tokens, { isLast = false } = {}) {
  return {
    borderBottom: isLast ? 'none' : (tokens['nc-accordion-border'] || '1px solid #e5e7eb')
  }
}

function triggerStyle(tokens, { hover = false } = {}) {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: tokens['nc-accordion-padding'] || '12px 16px',
    background: hover ? (tokens['nc-accordion-trigger-hover-bg'] || 'rgba(0,0,0,0.04)') : 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: tokens['nc-accordion-trigger-font-weight'] || '500',
    color: tokens['nc-accordion-trigger-color'] || '#1a1a1a',
    textAlign: 'left',
    lineHeight: '1.4'
  }
}

function contentStyle(tokens) {
  return {
    padding: tokens['nc-accordion-padding'] || '12px 16px',
    paddingTop: '4px',
    fontSize: tokens['nc-accordion-content-font-size'] || '14px',
    color: tokens['nc-accordion-content-color'] || '#6b7280',
    lineHeight: '1.6'
  }
}

function chevronStyle(tokens, { open = false } = {}) {
  return {
    width: tokens['nc-accordion-icon-size'] || '20px',
    height: tokens['nc-accordion-icon-size'] || '20px',
    flexShrink: '0',
    color: tokens['nc-accordion-icon-color'] || '#9ca3af',
    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: `transform ${tokens['nc-accordion-transition-duration'] || '200ms'} ease`
  }
}

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
function renderChevron(tokens, open = false) {
  return h('svg', {
    style: chevronStyle(tokens, { open }),
    viewBox: '0 0 20 20',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': 'true'
  }, [
    h('path', {
      d: 'M5 7.5L10 12.5L15 7.5',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    })
  ])
}

function renderAccordionItem(tokens, { title, content, open = false, isLast = false }) {
  const trigger = h('button', { style: triggerStyle(tokens) }, [
    h('span', {}, title),
    renderChevron(tokens, open)
  ])
  const children = [trigger]
  if (open) {
    children.push(h('div', { style: contentStyle(tokens) }, content))
  }
  return h('div', { style: accordionItemStyle(tokens, { isLast }) }, children)
}

function renderSeparatedItem(tokens, { title, content, open = false }) {
  const itemStyle = {
    border: tokens['nc-accordion-border'] || '1px solid #e5e7eb',
    borderRadius: tokens['nc-accordion-item-radius'] || '4px',
    background: tokens['nc-accordion-item-bg'] || '#ffffff',
    boxShadow: tokens['nc-accordion-item-shadow'] || '0 1px 3px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    fontFamily: 'inherit'
  }
  const trigger = h('button', { style: triggerStyle(tokens) }, [
    h('span', {}, title),
    renderChevron(tokens, open)
  ])
  const children = [trigger]
  if (open) {
    children.push(h('div', { style: contentStyle(tokens) }, content))
  }
  return h('div', { style: itemStyle }, children)
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------
const ITEMS = [
  { title: 'Was ist das NEO Design System?', content: 'NEO ist ein komponentenbasiertes Design System für konsistente und barrierefreie Web-Oberflächen.' },
  { title: 'Welche Themes werden unterstützt?', content: 'Es gibt vier Themes: Neo Light, Neo Dark, Customer Light und Customer Dark.' },
  { title: 'Wie werden Tokens überschrieben?', content: 'Component Tokens können per CSS Custom Properties auf Scope-Ebene überschrieben werden.' }
]

const AccordionDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      return h('div', { style: { ...accordionWrapStyle(t), maxWidth: '480px' } },
        ITEMS.map((item, i) =>
          renderAccordionItem(t, {
            title: item.title,
            content: item.content,
            open: i === 0,
            isLast: i === ITEMS.length - 1
          })
        )
      )
    }
  }
})

const AccordionAllOpen = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      return h('div', { style: { ...accordionWrapStyle(t), maxWidth: '480px' } },
        ITEMS.map((item, i) =>
          renderAccordionItem(t, {
            title: item.title,
            content: item.content,
            open: true,
            isLast: i === ITEMS.length - 1
          })
        )
      )
    }
  }
})

const AccordionSeparated = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const gap = t['nc-accordion-item-gap'] || '8px'
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap, maxWidth: '480px', width: '100%' } },
        ITEMS.map((item, i) =>
          renderSeparatedItem(t, {
            title: item.title,
            content: item.content,
            open: i === 0
          })
        )
      )
    }
  }
})
</script>
