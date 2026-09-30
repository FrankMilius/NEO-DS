<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default (erstes Item offen) -->
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

    <!-- Specimen: Separated -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Separated — Cards mit Gap und Shadow</span>
    </div>
    <div class="arena-specimen">
      <div class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <AccordionSeparated :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Ghost + Compact -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Ghost + Compact — minimal, kein Rahmen</span>
    </div>
    <div class="arena-specimen">
      <div class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <AccordionGhost :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Nested -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Nested — hierarchisch mit Einrückung</span>
    </div>
    <div class="arena-specimen">
      <div class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <AccordionNested :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Selection (Checkable) -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Selection — mit Checkbox, aktiver Rahmen</span>
    </div>
    <div class="arena-specimen">
      <div class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <AccordionSelection :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Actionable Header -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Actionable Header — Badge + Action im Trigger</span>
    </div>
    <div class="arena-specimen">
      <div class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <AccordionActions :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: With Footer -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Separated + Footer — Aktionsbereich am Content-Ende</span>
    </div>
    <div class="arena-specimen">
      <div class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <AccordionFooter :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('accordion')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs (all 34 tokens)
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
  'nc-accordion-transition-duration': '200ms',
  'nc-accordion-padding-compact':     '8px 12px',
  'nc-accordion-padding-spacious':    '20px 24px',
  'nc-accordion-content-font-size-compact': '13px',
  'nc-accordion-media-radius':        '4px',
  'nc-accordion-media-max-height':    '200px',
  'nc-accordion-media-gap':           '16px',
  // New v3 tokens
  'nc-accordion-nested-indent':       '24px',
  'nc-accordion-nested-border-width': '1px',
  'nc-accordion-nested-icon-size':    '16px',
  'nc-accordion-selection-border-active': '#009fe3',
  'nc-accordion-selection-bg-active': 'rgba(0,159,227,0.05)',
  'nc-accordion-selection-indicator-size': '20px',
  'nc-accordion-actions-gap':         '8px',
  'nc-accordion-actions-color':       '#9ca3af',
  'nc-accordion-actions-hover-color': '#1a1a1a',
  'nc-accordion-trigger-sticky-z':    '2',
  'nc-accordion-trigger-sticky-bg':   '#ffffff',
  'nc-accordion-footer-padding':      '12px 16px',
  'nc-accordion-footer-border':       '#e5e7eb'
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
function wrapStyle(tokens) {
  return { width: '100%', maxWidth: '520px', border: tokens['nc-accordion-border'], borderRadius: '6px', overflow: 'hidden', fontFamily: 'inherit' }
}

function itemStyle(tokens, { isLast = false } = {}) {
  return { borderBottom: isLast ? 'none' : tokens['nc-accordion-border'] }
}

function triggerStyle(tokens, { hover = false } = {}) {
  return {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
    width: '100%', padding: tokens['nc-accordion-padding'], background: hover ? tokens['nc-accordion-trigger-hover-bg'] : 'transparent',
    border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px',
    fontWeight: tokens['nc-accordion-trigger-font-weight'], color: tokens['nc-accordion-trigger-color'],
    textAlign: 'left', lineHeight: '1.4'
  }
}

function contentStyle(tokens) {
  return { padding: tokens['nc-accordion-padding'], paddingTop: '4px', fontSize: tokens['nc-accordion-content-font-size'], color: tokens['nc-accordion-content-color'], lineHeight: '1.6' }
}

function chevron(tokens, open = false) {
  return h('svg', {
    style: { width: tokens['nc-accordion-icon-size'], height: tokens['nc-accordion-icon-size'], flexShrink: '0', color: tokens['nc-accordion-icon-color'], transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: `transform ${tokens['nc-accordion-transition-duration']} ease` },
    viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': 'true'
  }, [h('path', { d: 'M5 7.5L10 12.5L15 7.5', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })])
}

function renderItem(tokens, { title, content, open = false, isLast = false, prefix, suffix }) {
  const triggerChildren = []
  if (prefix) triggerChildren.push(prefix)
  triggerChildren.push(h('span', { style: { flex: '1' } }, title))
  if (suffix) triggerChildren.push(suffix)
  triggerChildren.push(chevron(tokens, open))
  const trigger = h('button', { style: triggerStyle(tokens) }, triggerChildren)
  const children = [trigger]
  if (open) children.push(h('div', { style: contentStyle(tokens) }, content))
  return h('div', { style: itemStyle(tokens, { isLast }) }, children)
}

function renderSeparatedItem(tokens, { title, content, open = false, prefix, suffix, footer: footerContent }) {
  const style = { border: tokens['nc-accordion-border'], borderRadius: tokens['nc-accordion-item-radius'], background: tokens['nc-accordion-item-bg'], boxShadow: tokens['nc-accordion-item-shadow'], overflow: 'hidden' }
  if (open) style.boxShadow = tokens['nc-accordion-elevated-shadow']
  const triggerChildren = []
  if (prefix) triggerChildren.push(prefix)
  triggerChildren.push(h('span', { style: { flex: '1' } }, title))
  if (suffix) triggerChildren.push(suffix)
  triggerChildren.push(chevron(tokens, open))
  const children = [h('button', { style: triggerStyle(tokens) }, triggerChildren)]
  if (open) {
    children.push(h('div', { style: contentStyle(tokens) }, content))
    if (footerContent) {
      children.push(h('div', { style: { padding: tokens['nc-accordion-footer-padding'], borderTop: `1px solid ${tokens['nc-accordion-footer-border']}`, display: 'flex', justifyContent: 'flex-end', gap: '8px' } }, footerContent))
    }
  }
  return h('div', { style }, children)
}

// ---------------------------------------------------------------------------
// Specimen Data
// ---------------------------------------------------------------------------
const ITEMS = [
  { title: 'Was ist das NEO Design System?', content: 'NEO ist ein komponentenbasiertes Design System für konsistente und barrierefreie Web-Oberflächen.' },
  { title: 'Welche Themes werden unterstützt?', content: 'Es gibt vier Themes: Neo Light, Neo Dark, Customer Light und Customer Dark.' },
  { title: 'Wie werden Tokens überschrieben?', content: 'Component Tokens können per CSS Custom Properties auf Scope-Ebene überschrieben werden.' }
]

// ---------------------------------------------------------------------------
// Specimen Components
// ---------------------------------------------------------------------------
const AccordionDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => h('div', { style: wrapStyle(props.tokens) },
      ITEMS.map((item, i) => renderItem(props.tokens, { title: item.title, content: item.content, open: i === 0, isLast: i === ITEMS.length - 1 }))
    )
  }
})

const AccordionSeparated = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => h('div', { style: { display: 'flex', flexDirection: 'column', gap: props.tokens['nc-accordion-item-gap'], maxWidth: '520px', width: '100%' } },
      ITEMS.map((item, i) => renderSeparatedItem(props.tokens, { title: item.title, content: item.content, open: i === 0 }))
    )
  }
})

const AccordionGhost = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => h('div', { style: { maxWidth: '520px', width: '100%' } },
      ITEMS.map((item, i) => {
        const style = { borderBottom: '1px solid transparent' }
        const trig = h('button', { style: { ...triggerStyle(props.tokens), padding: props.tokens['nc-accordion-padding-compact'], fontSize: '13px' } }, [
          h('span', { style: { flex: '1' } }, item.title), chevron(props.tokens, i === 0)
        ])
        const children = [trig]
        if (i === 0) children.push(h('div', { style: { ...contentStyle(props.tokens), padding: props.tokens['nc-accordion-padding-compact'], paddingTop: '0', fontSize: props.tokens['nc-accordion-content-font-size-compact'] } }, item.content))
        return h('div', { style }, children)
      })
    )
  }
})

const AccordionNested = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const nestedItems = [
        { title: 'Unter-Option A', content: 'Details zu A.' },
        { title: 'Unter-Option B', content: 'Details zu B.' }
      ]
      const nestedAccordion = h('div', { style: { marginLeft: t['nc-accordion-nested-indent'], borderLeft: `${t['nc-accordion-nested-border-width']} solid ${t['nc-accordion-border'].split(' ').pop()}`, marginTop: '4px' } },
        nestedItems.map((ni, j) => {
          const trig = h('button', { style: { ...triggerStyle(t), padding: '8px 12px', fontSize: '13px' } }, [
            h('span', { style: { flex: '1' } }, ni.title),
            h('svg', { style: { width: t['nc-accordion-nested-icon-size'], height: t['nc-accordion-nested-icon-size'], flexShrink: '0', color: t['nc-accordion-icon-color'], transform: j === 0 ? 'rotate(180deg)' : 'rotate(0)' }, viewBox: '0 0 20 20', fill: 'none' }, [h('path', { d: 'M5 7.5L10 12.5L15 7.5', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round' })])
          ])
          const ch = [trig]
          if (j === 0) ch.push(h('div', { style: { padding: '4px 12px 8px', fontSize: '12px', color: t['nc-accordion-content-color'] } }, ni.content))
          return h('div', { style: { borderBottom: j < nestedItems.length - 1 ? `1px solid ${t['nc-accordion-border'].split(' ').pop()}` : 'none' } }, ch)
        })
      )
      return h('div', { style: wrapStyle(t) }, [
        renderItem(t, { title: 'Kategorie 1 (mit Unterkategorien)', content: [nestedAccordion], open: true }),
        renderItem(t, { title: 'Kategorie 2 (einfach)', content: 'Einfacher Inhalt ohne Unterkategorien.', isLast: true })
      ])
    }
  }
})

const AccordionSelection = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const items = [
        { title: 'Option A — Performance', selected: true },
        { title: 'Option B — Comfort', selected: false },
        { title: 'Option C — Eco', selected: false }
      ]
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: t['nc-accordion-item-gap'], maxWidth: '520px', width: '100%' } },
        items.map(item => {
          const borderColor = item.selected ? t['nc-accordion-selection-border-active'] : t['nc-accordion-border'].split(' ').pop()
          const bg = item.selected ? t['nc-accordion-selection-bg-active'] : t['nc-accordion-item-bg']
          const checkbox = h('div', { style: { width: t['nc-accordion-selection-indicator-size'], height: t['nc-accordion-selection-indicator-size'], borderRadius: '4px', border: `2px solid ${item.selected ? t['nc-accordion-selection-border-active'] : '#d1d5db'}`, background: item.selected ? t['nc-accordion-selection-border-active'] : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' } },
            item.selected ? [h('svg', { style: { width: '12px', height: '12px', color: '#fff' }, viewBox: '0 0 20 20', fill: 'none' }, [h('path', { d: 'M5 10l3 3 7-7', stroke: 'currentColor', 'stroke-width': '2' })])] : []
          )
          return h('div', { style: { border: `2px solid ${borderColor}`, borderRadius: t['nc-accordion-item-radius'], background: bg, overflow: 'hidden', transition: 'border-color 200ms, background 200ms' } }, [
            h('button', { style: { ...triggerStyle(t), gap: '12px' } }, [checkbox, h('span', { style: { flex: '1' } }, item.title), chevron(t, item.selected)]),
            item.selected ? h('div', { style: contentStyle(t) }, 'Konfigurationsdetails für diese Option werden hier angezeigt.') : null
          ])
        })
      )
    }
  }
})

const AccordionActions = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const badge = h('span', { style: { fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: '#dbeafe', color: '#1d4ed8', fontWeight: '600', whiteSpace: 'nowrap' } }, 'Neu')
      const editBtn = h('button', { style: { background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: t['nc-accordion-actions-color'], fontSize: '12px' } }, '✏️')
      const suffix = h('div', { style: { display: 'flex', alignItems: 'center', gap: t['nc-accordion-actions-gap'] } }, [badge, editBtn])
      return h('div', { style: wrapStyle(t) }, [
        renderItem(t, { title: 'Feature mit Badge + Action', content: 'Dieser Trigger hat einen Badge und einen Edit-Button im Header.', open: true, suffix }),
        renderItem(t, { title: 'Normaler Trigger', content: 'Ohne Suffix.', isLast: true })
      ])
    }
  }
})

const AccordionFooter = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const footerButtons = [
        h('button', { style: { padding: '6px 16px', fontSize: '13px', border: `1px solid ${t['nc-accordion-border'].split(' ').pop()}`, borderRadius: '4px', background: 'transparent', cursor: 'pointer', color: t['nc-accordion-trigger-color'] } }, 'Abbrechen'),
        h('button', { style: { padding: '6px 16px', fontSize: '13px', border: 'none', borderRadius: '4px', background: t['nc-accordion-selection-border-active'] || '#009fe3', color: '#fff', cursor: 'pointer' } }, 'Weiter')
      ]
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: t['nc-accordion-item-gap'], maxWidth: '520px', width: '100%' } }, [
        renderSeparatedItem(t, { title: 'Schritt 1: Grunddaten', content: 'Formular-Inhalte für Schritt 1...', open: true, footer: footerButtons }),
        renderSeparatedItem(t, { title: 'Schritt 2: Konfiguration', content: 'Formular-Inhalte für Schritt 2...' }),
        renderSeparatedItem(t, { title: 'Schritt 3: Zusammenfassung', content: 'Übersicht und Bestätigung.' })
      ])
    }
  }
})
</script>
