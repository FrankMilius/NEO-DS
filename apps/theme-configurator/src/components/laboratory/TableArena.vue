<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default Table (Lines) -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default Table (Lines)</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <TableDefault :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <TableDefault :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <TableDefault :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Density Comparison -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Density Comparison</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <TableDensity :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <TableDensity :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <TableDensity :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Striped + Hover -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Striped + Hover + Selected</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <TableStriped :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <TableStriped :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <TableStriped :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('table')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-table-bg':                        '#ffffff',
  'nc-table-radius':                    '8px',
  'nc-table-shadow':                    '0 1px 3px rgba(0,0,0,0.06)',
  'nc-table-border-color':              '#e2e8f0',
  'nc-table-border-width':              '1px',
  'nc-table-header-bg':                 '#1e293b',
  'nc-table-header-color':              '#ffffff',
  'nc-table-header-font-size':          '13px',
  'nc-table-header-font-weight':        '600',
  'nc-table-header-letter-spacing':     '0.01em',
  'nc-table-cell-padding':              '12px 16px',
  'nc-table-cell-padding-default':      '12px 16px',
  'nc-table-cell-padding-compact':      '8px 12px',
  'nc-table-cell-padding-expressive':   '16px 20px',
  'nc-table-row-border-color':          '#e2e8f0',
  'nc-table-row-border-width':          '1px',
  'nc-table-row-bg-hover':              '#f8fafc',
  'nc-table-stripe-bg':                 'rgba(241,245,249,0.5)',
  'nc-table-row-bg-selected':           '#f1f5f9',
  'nc-table-row-border-selected':       '#0066cc',
  'nc-table-sticky-shadow':             '0 2px 4px rgba(0,0,0,0.08)'
}

const TOKEN_REFS = {
  'nc-table-bg':                 'surface-elevated',
  'nc-table-border-color':       'border-secondary',
  'nc-table-header-bg':          'background-inverse',
  'nc-table-header-color':       'text-inverse',
  'nc-table-row-border-color':   'border-secondary',
  'nc-table-row-bg-hover':       'background-secondary',
  'nc-table-row-bg-selected':    'background-tertiary',
  'nc-table-row-border-selected':'interactive-default',
  'nc-table-stripe-bg':          'background-secondary'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'table') || null
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
const COLUMNS = ['Name', 'Status', 'Rolle', 'Zuletzt aktiv']
const ROWS = [
  ['Maria Schmidt', 'Aktiv',    'Admin',   'Heute'],
  ['Jonas Bauer',   'Aktiv',    'Nutzer',  'Gestern'],
  ['Laura Klein',   'Inaktiv',  'Nutzer',  'vor 7 Tagen'],
  ['Felix Müller',  'Aktiv',    'Editor',  'vor 3 Stunden']
]
const ROWS3 = ROWS.slice(0, 3)

function renderTableHeader(tokens, { cellPadding = null } = {}) {
  const pad = cellPadding || tokens['nc-table-cell-padding-default'] || '12px 16px'
  return h('thead', {}, [
    h('tr', {},
      COLUMNS.map(col =>
        h('th', {
          style: {
            padding: pad,
            background: tokens['nc-table-header-bg'] || '#1e293b',
            color: tokens['nc-table-header-color'] || '#ffffff',
            fontSize: tokens['nc-table-header-font-size'] || '13px',
            fontWeight: tokens['nc-table-header-font-weight'] || '600',
            letterSpacing: tokens['nc-table-header-letter-spacing'] || '0.01em',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            borderBottom: 'none'
          }
        }, col)
      )
    )
  ])
}

function renderTableRow(tokens, cells, { cellPadding = null, bg = null, borderLeft = null } = {}) {
  const pad = cellPadding || tokens['nc-table-cell-padding-default'] || '12px 16px'
  const rowBg = bg || tokens['nc-table-bg'] || '#ffffff'
  return h('tr', {
    style: {
      background: rowBg,
      borderBottom: `${tokens['nc-table-row-border-width'] || '1px'} solid ${tokens['nc-table-row-border-color'] || '#e2e8f0'}`,
      borderLeft: borderLeft || 'none'
    }
  },
    cells.map(cell =>
      h('td', {
        style: {
          padding: pad,
          fontSize: '14px',
          color: '#334155',
          whiteSpace: 'nowrap'
        }
      }, cell)
    )
  )
}

function renderTable(tokens, { rows = ROWS, cellPadding = null, striped = false, states = [] } = {}) {
  const tableBg = tokens['nc-table-bg'] || '#ffffff'
  const borderColor = tokens['nc-table-border-color'] || '#e2e8f0'
  const borderWidth = tokens['nc-table-border-width'] || '1px'

  const bodyRows = rows.map((row, i) => {
    const state = states[i] || 'default'
    let bg = tableBg
    let borderLeft = 'none'

    if (state === 'hover') {
      bg = tokens['nc-table-row-bg-hover'] || '#f8fafc'
    } else if (state === 'selected') {
      bg = tokens['nc-table-row-bg-selected'] || '#f1f5f9'
      borderLeft = `2px solid ${tokens['nc-table-row-border-selected'] || '#0066cc'}`
    } else if (striped && i % 2 === 0) {
      bg = tokens['nc-table-stripe-bg'] || 'rgba(241,245,249,0.5)'
    }

    return renderTableRow(tokens, row, { cellPadding, bg, borderLeft })
  })

  return h('table', {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      background: tableBg,
      borderRadius: tokens['nc-table-radius'] || '8px',
      overflow: 'hidden',
      border: `${borderWidth} solid ${borderColor}`,
      boxShadow: tokens['nc-table-shadow'] || '0 1px 3px rgba(0,0,0,0.06)',
      fontSize: '14px',
      fontFamily: 'inherit'
    }
  }, [
    renderTableHeader(tokens, { cellPadding }),
    h('tbody', {}, bodyRows)
  ])
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Standard-Tabelle (Linien)
const TableDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => h('div', { style: { width: '100%', overflowX: 'auto' } },
      [renderTable(props.tokens)]
    )
  }
})

// Dichtevarianzen
const TableDensity = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const densities = [
        { label: 'Compact',     cellPadding: t['nc-table-cell-padding-compact']    || '8px 12px'  },
        { label: 'Default',     cellPadding: t['nc-table-cell-padding-default']    || '12px 16px' },
        { label: 'Expressive',  cellPadding: t['nc-table-cell-padding-expressive'] || '16px 20px' }
      ]
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' } },
        densities.map(({ label, cellPadding }) =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } }, [
            h('span', { style: { fontSize: '11px', fontWeight: '600', color: props.theme['text-secondary'] || '#666' } }, label),
            h('div', { style: { overflowX: 'auto' } }, [
              renderTable(t, { rows: ROWS3, cellPadding })
            ])
          ])
        )
      )
    }
  }
})

// Gestreift + Hover + Ausgewählt
const TableStriped = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      // Zeile 0: normal (ungerade, stripe), Zeile 1: hover, Zeile 2: normal (ungerade), Zeile 3: selected
      const states = ['default', 'hover', 'default', 'selected']
      return h('div', { style: { width: '100%', overflowX: 'auto' } }, [
        renderTable(t, { rows: ROWS, striped: true, states })
      ])
    }
  }
})
</script>
