<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Basic Data Table -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Basic Data Table</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <DtBasic :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <DtBasic :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <DtBasic :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Density Variants -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Density Variants</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <DtDensity :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <DtDensity :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <DtDensity :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Sort + Selection -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Sort + Selection</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <DtSortSelection :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <DtSortSelection :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <DtSortSelection :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('data-table')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-dt-radius':                      '8px',
  'nc-dt-border':                      '1px solid #e2e8f0',
  'nc-dt-body-bg':                     '#ffffff',
  'nc-dt-body-color':                  '#0f172a',
  'nc-dt-body-font-size':              '14px',
  'nc-dt-body-font-weight':            '400',
  'nc-dt-transition-duration':         '150ms',
  'nc-dt-header-height':               '48px',
  'nc-dt-header-bg':                   '#f8fafc',
  'nc-dt-header-color':                '#475569',
  'nc-dt-header-font-size':            '12px',
  'nc-dt-header-font-weight':          '600',
  'nc-dt-header-letter-spacing':       '0.05em',
  'nc-dt-header-border-bottom':        '2px solid #e2e8f0',
  'nc-dt-row-height':                  '48px',
  'nc-dt-row-bg':                      '#ffffff',
  'nc-dt-row-bg-hover':                '#f8fafc',
  'nc-dt-row-bg-selected':             'rgba(0,102,204,0.06)',
  'nc-dt-row-border':                  '1px solid #f1f5f9',
  'nc-dt-cell-padding':                '0 16px',
  'nc-dt-toolbar-height':              '56px',
  'nc-dt-toolbar-bg':                  '#ffffff',
  'nc-dt-pagination-bg':               '#ffffff',
  'nc-dt-pagination-border-top':       '1px solid #e2e8f0',
  'nc-dt-titlebar-title-font-size':    '16px',
  'nc-dt-titlebar-title-font-weight':  '700',
  'nc-dt-titlebar-title-color':        '#0f172a',
  'nc-dt-sort-icon-color':             '#94a3b8',
  'nc-dt-sort-icon-color-active':      '#0066cc'
}

const TOKEN_REFS = {
  'nc-dt-body-bg':                 'surface-elevated',
  'nc-dt-body-color':              'text-primary',
  'nc-dt-header-bg':               'background-secondary',
  'nc-dt-header-color':            'text-secondary',
  'nc-dt-row-bg':                  'surface-elevated',
  'nc-dt-row-bg-hover':            'background-secondary',
  'nc-dt-row-bg-selected':         'interactive-subtle',
  'nc-dt-toolbar-bg':              'surface-elevated',
  'nc-dt-pagination-bg':           'surface-elevated',
  'nc-dt-titlebar-title-color':    'text-primary',
  'nc-dt-sort-icon-color':         'text-tertiary',
  'nc-dt-sort-icon-color-active':  'interactive-default'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'data-table') || null
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
function renderBadge(text, type = 'success') {
  const colors = {
    success: { bg: '#dcfce7', color: '#166534' },
    neutral: { bg: '#f1f5f9', color: '#475569' }
  }
  const c = colors[type] || colors.neutral
  return h('span', {
    style: {
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: '9999px',
      fontSize: '11px', fontWeight: '600',
      background: c.bg, color: c.color
    }
  }, text)
}

function renderSortIcon(active, direction = 'asc', activeColor = '#0066cc', mutedColor = '#94a3b8') {
  const color = active ? activeColor : mutedColor
  const glyph = active ? (direction === 'asc' ? '↑' : '↓') : '↕'
  return h('span', { style: { fontSize: '11px', color, marginLeft: '4px', opacity: active ? '1' : '0.6' } }, glyph)
}

function renderCheckbox(checked, theme) {
  return h('div', {
    style: {
      width: '16px', height: '16px', borderRadius: '3px', flexShrink: '0',
      border: checked ? 'none' : `1.5px solid ${theme['border-primary'] || '#94a3b8'}`,
      background: checked ? (theme['interactive-default'] || '#0066cc') : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }
  }, checked ? h('span', { style: { color: '#fff', fontSize: '10px', lineHeight: '1' } }, '✓') : null)
}

// Wrapper: komplette DataTable-Hülle
function renderDtWrapper(tokens, { title = null, toolbar = null, header, body, pagination = null } = {}) {
  const bg = tokens['nc-dt-body-bg'] || '#ffffff'
  const radius = tokens['nc-dt-radius'] || '8px'
  const border = tokens['nc-dt-border'] || '1px solid #e2e8f0'

  const children = []

  // Titelleiste
  if (title || toolbar) {
    children.push(h('div', {
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: tokens['nc-dt-toolbar-height'] || '56px',
        padding: '0 16px',
        background: tokens['nc-dt-toolbar-bg'] || bg,
        borderBottom: tokens['nc-dt-header-border-bottom'] || '2px solid #e2e8f0'
      }
    }, [
      title ? h('span', {
        style: {
          fontSize: tokens['nc-dt-titlebar-title-font-size'] || '16px',
          fontWeight: tokens['nc-dt-titlebar-title-font-weight'] || '700',
          color: tokens['nc-dt-titlebar-title-color'] || '#0f172a'
        }
      }, title) : h('span'),
      toolbar || null
    ]))
  }

  // Header-Zeile
  children.push(header)

  // Body-Zeilen
  children.push(h('div', { style: { background: bg } }, body))

  // Pagination
  if (pagination) {
    children.push(h('div', {
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '48px', padding: '0 16px',
        background: tokens['nc-dt-pagination-bg'] || bg,
        borderTop: tokens['nc-dt-pagination-border-top'] || '1px solid #e2e8f0'
      }
    }, pagination))
  }

  return h('div', {
    style: {
      background: bg, borderRadius: radius, border,
      overflow: 'hidden', fontFamily: 'inherit',
      fontSize: tokens['nc-dt-body-font-size'] || '14px',
      color: tokens['nc-dt-body-color'] || '#0f172a',
      width: '100%'
    }
  }, children)
}

// Header-Zeile rendern
function renderDtHeader(tokens, columns, { withCheckbox = false } = {}) {
  const cells = []
  if (withCheckbox) {
    cells.push(h('div', {
      style: {
        width: '48px', height: tokens['nc-dt-header-height'] || '48px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: tokens['nc-dt-header-bg'] || '#f8fafc', flexShrink: '0'
      }
    }, [renderCheckbox(false, {})]))
  }
  columns.forEach(({ label, sort = false, direction = 'asc', active = false }, i) => {
    cells.push(h('div', {
      style: {
        flex: i === 0 ? '2' : '1',
        height: tokens['nc-dt-header-height'] || '48px',
        padding: tokens['nc-dt-cell-padding'] || '0 16px',
        display: 'flex', alignItems: 'center',
        background: tokens['nc-dt-header-bg'] || '#f8fafc',
        color: tokens['nc-dt-header-color'] || '#475569',
        fontSize: tokens['nc-dt-header-font-size'] || '12px',
        fontWeight: tokens['nc-dt-header-font-weight'] || '600',
        letterSpacing: tokens['nc-dt-header-letter-spacing'] || '0.05em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        cursor: sort ? 'pointer' : 'default',
        borderBottom: tokens['nc-dt-header-border-bottom'] || '2px solid #e2e8f0'
      }
    }, [
      label,
      sort ? renderSortIcon(active, direction,
        tokens['nc-dt-sort-icon-color-active'] || '#0066cc',
        tokens['nc-dt-sort-icon-color'] || '#94a3b8'
      ) : null
    ]))
  })
  return h('div', { style: { display: 'flex' } }, cells)
}

// Datenzeile rendern
function renderDtRow(tokens, cells, { rowHeight = null, state = 'default', withCheckbox = false, checked = false, theme = {} } = {}) {
  const h_ = rowHeight || tokens['nc-dt-row-height'] || '48px'
  let bg = tokens['nc-dt-row-bg'] || '#ffffff'
  let borderLeft = 'none'

  if (state === 'hover') bg = tokens['nc-dt-row-bg-hover'] || '#f8fafc'
  else if (state === 'selected') {
    bg = tokens['nc-dt-row-bg-selected'] || 'rgba(0,102,204,0.06)'
    borderLeft = `2px solid ${tokens['nc-dt-sort-icon-color-active'] || '#0066cc'}`
  }

  const rowCells = []
  if (withCheckbox) {
    rowCells.push(h('div', {
      style: {
        width: '48px', height: h_,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: '0'
      }
    }, [renderCheckbox(checked, theme)]))
  }

  cells.forEach((cell, i) => {
    rowCells.push(h('div', {
      style: {
        flex: i === 0 ? '2' : '1',
        height: h_,
        padding: tokens['nc-dt-cell-padding'] || '0 16px',
        display: 'flex', alignItems: 'center',
        borderBottom: tokens['nc-dt-row-border'] || '1px solid #f1f5f9',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
      }
    }, typeof cell === 'string' ? cell : cell))
  })

  return h('div', {
    style: {
      display: 'flex',
      background: bg,
      borderLeft
    }
  }, rowCells)
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Vollständige Data Table mit Toolbar, Header, Zeilen, Pagination
const DtBasic = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens

      // Such-Input im Toolbar
      const searchInput = h('input', {
        type: 'text',
        placeholder: 'Suchen…',
        style: {
          padding: '6px 10px', borderRadius: '6px', fontSize: '13px',
          border: `1px solid ${props.theme['border-primary'] || '#cbd5e1'}`,
          background: props.theme['background-base'] || '#fff',
          color: props.theme['text-primary'] || '#0f172a',
          outline: 'none', width: '160px'
        }
      })

      const columns = [
        { label: 'Name', sort: true, active: true, direction: 'asc' },
        { label: 'E-Mail', sort: false },
        { label: 'Rolle', sort: false },
        { label: 'Status', sort: false }
      ]

      const rows = [
        { cells: ['Anna Müller',   'anna@neo.io',   'Admin',  renderBadge('Aktiv', 'success')], state: 'default' },
        { cells: ['Ben Fischer',   'ben@neo.io',    'Nutzer', renderBadge('Inaktiv', 'neutral')], state: 'default' },
        { cells: ['Clara Weber',   'clara@neo.io',  'Nutzer', renderBadge('Aktiv', 'success')], state: 'hover' },
        { cells: ['David König',   'david@neo.io',  'Admin',  renderBadge('Aktiv', 'success')], state: 'selected' }
      ]

      // Paginierungsinhalt
      const paginationContent = [
        h('span', { style: { fontSize: '13px', color: props.theme['text-secondary'] || '#64748b' } }, '1–4 von 12'),
        h('div', { style: { display: 'flex', gap: '4px' } }, [
          h('button', {
            style: {
              padding: '4px 10px', borderRadius: '4px', fontSize: '13px',
              border: `1px solid ${props.theme['border-primary'] || '#cbd5e1'}`,
              background: 'transparent', cursor: 'pointer',
              color: props.theme['text-secondary'] || '#64748b'
            }
          }, '‹'),
          h('button', {
            style: {
              padding: '4px 10px', borderRadius: '4px', fontSize: '13px',
              border: `1px solid ${props.theme['border-primary'] || '#cbd5e1'}`,
              background: 'transparent', cursor: 'pointer',
              color: props.theme['text-secondary'] || '#64748b'
            }
          }, '›')
        ])
      ]

      return h('div', { style: { width: '100%', overflowX: 'auto' } }, [
        renderDtWrapper(t, {
          title: 'Benutzer',
          toolbar: searchInput,
          header: renderDtHeader(t, columns),
          body: rows.map(r => renderDtRow(t, r.cells, { state: r.state, theme: props.theme })),
          pagination: paginationContent
        })
      ])
    }
  }
})

// Dichtevergleich
const DtDensity = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const columns = [
        { label: 'Name', sort: false },
        { label: 'E-Mail', sort: false },
        { label: 'Rolle', sort: false }
      ]
      const rows3 = [
        ['Anna Müller',  'anna@neo.io',  'Admin'],
        ['Ben Fischer',  'ben@neo.io',   'Nutzer'],
        ['Clara Weber',  'clara@neo.io', 'Nutzer']
      ]
      const densities = [
        { label: 'Default (48px)',  rowHeight: t['nc-dt-row-height'] || '48px' },
        { label: 'Compact (36px)', rowHeight: '36px' }
      ]

      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' } },
        densities.map(({ label, rowHeight }) =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } }, [
            h('span', { style: { fontSize: '11px', fontWeight: '600', color: props.theme['text-secondary'] || '#666' } }, label),
            h('div', { style: { overflowX: 'auto' } }, [
              renderDtWrapper(t, {
                header: renderDtHeader(t, columns),
                body: rows3.map(cells => renderDtRow(t, cells, { rowHeight, theme: props.theme }))
              })
            ])
          ])
        )
      )
    }
  }
})

// Sortierung + Auswahl mit Checkboxen
const DtSortSelection = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const selectedColor = t['nc-dt-sort-icon-color-active'] || '#0066cc'

      const columns = [
        { label: 'Name',  sort: true,  active: true,  direction: 'asc' },
        { label: 'Rolle', sort: true,  active: false },
        { label: 'Status',sort: false }
      ]

      // Batch-Actions-Leiste
      const batchBar = h('div', {
        style: {
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '8px 16px',
          background: `${selectedColor}14`,
          borderBottom: `1px solid ${selectedColor}40`,
          fontSize: '13px',
          color: props.theme['text-primary'] || '#0f172a'
        }
      }, [
        h('span', { style: { fontWeight: '600', color: selectedColor } }, '1 ausgewählt'),
        h('button', {
          style: {
            padding: '4px 10px', borderRadius: '4px', fontSize: '12px',
            border: `1px solid ${selectedColor}`,
            background: 'transparent', cursor: 'pointer',
            color: selectedColor, fontWeight: '600'
          }
        }, 'Aktion'),
        h('button', {
          style: {
            padding: '4px 10px', borderRadius: '4px', fontSize: '12px',
            border: `1px solid ${props.theme['border-primary'] || '#cbd5e1'}`,
            background: 'transparent', cursor: 'pointer',
            color: props.theme['text-secondary'] || '#64748b'
          }
        }, 'Löschen')
      ])

      const rows = [
        { cells: ['Anna Müller',  'Admin',  renderBadge('Aktiv', 'success')],   checked: true,  state: 'selected' },
        { cells: ['Ben Fischer',  'Nutzer', renderBadge('Inaktiv', 'neutral')],  checked: false, state: 'default'  },
        { cells: ['Clara Weber',  'Nutzer', renderBadge('Aktiv', 'success')],   checked: false, state: 'default'  }
      ]

      return h('div', { style: { width: '100%', overflowX: 'auto' } }, [
        h('div', {
          style: {
            background: t['nc-dt-body-bg'] || '#ffffff',
            borderRadius: t['nc-dt-radius'] || '8px',
            border: t['nc-dt-border'] || '1px solid #e2e8f0',
            overflow: 'hidden', fontFamily: 'inherit',
            fontSize: t['nc-dt-body-font-size'] || '14px',
            color: t['nc-dt-body-color'] || '#0f172a'
          }
        }, [
          batchBar,
          renderDtHeader(t, columns, { withCheckbox: true }),
          h('div', { style: { background: t['nc-dt-body-bg'] || '#ffffff' } },
            rows.map(r => renderDtRow(t, r.cells, {
              state: r.state, withCheckbox: true, checked: r.checked, theme: props.theme
            }))
          )
        ])
      ])
    }
  }
})
</script>
