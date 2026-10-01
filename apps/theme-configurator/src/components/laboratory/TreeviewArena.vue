<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default Tree with Guide Lines -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default Tree — mit Guide Lines</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <TreeDefault :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <TreeDefault :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <TreeDefault :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Variant Comparison -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Varianten — Default / Bordered / Compact</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <TreeVariants :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <TreeVariants :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <TreeVariants :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Badges & States -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Badges & States — Hover / Selected / Disabled</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <TreeBadgesStates :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <TreeBadgesStates :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <TreeBadgesStates :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('treeview')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-treeview-node-height':           '32px',
  'nc-treeview-node-radius':           '4px',
  'nc-treeview-node-padding':          '4px 8px',
  'nc-treeview-node-gap':              '2px',
  'nc-treeview-indent':                '20px',
  'nc-treeview-toggle-size':           '16px',
  'nc-treeview-icon-size':             '16px',
  'nc-treeview-label-size':            '14px',
  'nc-treeview-label-color':           '#0f172a',
  'nc-treeview-label-color-hover':     '#0066cc',
  'nc-treeview-node-bg-hover':         '#f1f5f9',
  'nc-treeview-node-bg-selected':      '#eff6ff',
  'nc-treeview-node-color-selected':   '#0066cc',
  'nc-treeview-node-bg-focused':       '#dbeafe',
  'nc-treeview-guide-line-color':      '#e2e8f0',
  'nc-treeview-guide-line-width':      '1px',
  'nc-treeview-badge-bg':              '#e2e8f0',
  'nc-treeview-badge-color':           '#475569',
  'nc-treeview-badge-radius':          '9999px',
  'nc-treeview-badge-size':            '12px',
  'nc-treeview-bordered-border':       '1px solid #e2e8f0',
  'nc-treeview-bordered-radius':       '8px',
  'nc-treeview-bordered-item-border':  '1px solid #e2e8f0'
}

const TOKEN_REFS = {
  'nc-treeview-label-color':           'text-primary',
  'nc-treeview-label-color-hover':     'interactive-default',
  'nc-treeview-node-bg-hover':         'background-tertiary',
  'nc-treeview-node-bg-selected':      'interactive-subtle',
  'nc-treeview-node-color-selected':   'interactive-default',
  'nc-treeview-guide-line-color':      'border-secondary',
  'nc-treeview-badge-bg':              'background-tertiary',
  'nc-treeview-badge-color':           'text-secondary',
  'nc-treeview-bordered-border':       'border-secondary',
  'nc-treeview-bordered-item-border':  'border-secondary'
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'treeview') || null
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
function nodeStyle(tokens, { selected = false, hover = false, focused = false, compact = false } = {}) {
  let bg = 'transparent'
  if (selected) bg = tokens['nc-treeview-node-bg-selected']
  else if (focused) bg = tokens['nc-treeview-node-bg-focused']
  else if (hover) bg = tokens['nc-treeview-node-bg-hover']
  const color = selected
    ? tokens['nc-treeview-node-color-selected']
    : (hover ? tokens['nc-treeview-label-color-hover'] : tokens['nc-treeview-label-color'])
  return {
    display: 'flex',
    alignItems: 'center',
    minHeight: compact ? '24px' : tokens['nc-treeview-node-height'],
    padding: compact ? '2px 8px' : tokens['nc-treeview-node-padding'],
    borderRadius: tokens['nc-treeview-node-radius'],
    background: bg,
    color,
    fontSize: tokens['nc-treeview-label-size'],
    fontFamily: 'inherit',
    gap: '6px',
    cursor: 'pointer',
    userSelect: 'none'
  }
}

function badgeStyle(tokens) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '18px',
    height: '18px',
    padding: '0 5px',
    borderRadius: tokens['nc-treeview-badge-radius'],
    background: tokens['nc-treeview-badge-bg'],
    color: tokens['nc-treeview-badge-color'],
    fontSize: tokens['nc-treeview-badge-size'],
    fontWeight: '600',
    lineHeight: '1',
    marginLeft: 'auto'
  }
}

// Chevron toggle icon
function chevronIcon(expanded, color) {
  return h('svg', {
    width: '12', height: '12', viewBox: '0 0 24 24',
    fill: 'none', stroke: color, 'stroke-width': '2.5',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    'aria-hidden': 'true',
    style: {
      flexShrink: '0',
      transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
      transition: 'transform 150ms ease'
    }
  }, [h('path', { d: 'M9 18l6-6-6-6' })])
}

// Folder or file icon
function fileIcon(type, color) {
  const paths = {
    folder: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z',
    file: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
  }
  return h('svg', {
    width: '14', height: '14', viewBox: '0 0 24 24',
    fill: 'none', stroke: color, 'stroke-width': '1.5',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    'aria-hidden': 'true',
    style: { flexShrink: '0' }
  }, [h('path', { d: paths[type] || paths.file })])
}

// Guide line for children (vertical connector)
function renderGuideChildren(tokens, children) {
  return h('div', {
    style: {
      position: 'relative',
      paddingLeft: tokens['nc-treeview-indent'],
      marginLeft: '12px'
    }
  }, [
    // Vertical guide line
    h('div', {
      style: {
        position: 'absolute',
        left: '0',
        top: '0',
        bottom: '16px',
        width: tokens['nc-treeview-guide-line-width'],
        background: tokens['nc-treeview-guide-line-color']
      }
    }),
    ...children
  ])
}

// Render a tree node row
function renderNode(tokens, theme, { label, type = 'file', expanded = false, selected = false, hover = false, focused = false, badge = null, disabled = false, compact = false } = {}) {
  const iconColor = selected
    ? tokens['nc-treeview-node-color-selected']
    : (hover ? tokens['nc-treeview-label-color-hover'] : tokens['nc-treeview-label-color'])

  const isFolder = type === 'folder'

  const children = [
    isFolder ? chevronIcon(expanded, iconColor) : h('span', { style: { width: '12px', flexShrink: '0' } }),
    fileIcon(type, iconColor),
    h('span', {
      style: {
        flex: '1',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, label)
  ]

  if (badge !== null) {
    children.push(h('span', { style: badgeStyle(tokens) }, String(badge)))
  }

  return h('div', {
    style: {
      ...nodeStyle(tokens, { selected, hover, focused, compact }),
      opacity: disabled ? '0.4' : '1'
    }
  }, children)
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Specimen 1: Full tree with guide lines
const TreeDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const th = props.theme

      const buttonVue = renderNode(t, th, { label: 'Button.vue', type: 'file', selected: true })
      const inputVue = renderNode(t, th, { label: 'Input.vue', type: 'file' })
      const componentsChildren = renderGuideChildren(t, [buttonVue, inputVue])

      const componentsFolder = h('div', {}, [
        renderNode(t, th, { label: 'components', type: 'folder', expanded: true }),
        componentsChildren
      ])

      const utilsFolder = renderNode(t, th, { label: 'utils', type: 'folder', expanded: false })
      const mainJs = renderNode(t, th, { label: 'main.js', type: 'file' })

      const srcChildren = renderGuideChildren(t, [componentsFolder, utilsFolder, mainJs])

      const srcFolder = h('div', {}, [
        renderNode(t, th, { label: 'src', type: 'folder', expanded: true }),
        srcChildren
      ])

      const publicFolder = renderNode(t, th, { label: 'public', type: 'folder', expanded: false })

      return h('div', {
        style: {
          fontFamily: 'inherit',
          minWidth: '240px',
          maxWidth: '320px'
        }
      }, [srcFolder, publicFolder])
    }
  }
})

// Specimen 2: Variant comparison — Default / Bordered / Compact
const TreeVariants = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const th = props.theme

      function renderSmallTree(variant) {
        const compact = variant === 'compact'
        const bordered = variant === 'bordered'

        // Resolve border color from token string (may include "1px solid #...")
        const rawBorder = t['nc-treeview-bordered-border'] || '1px solid #e2e8f0'

        const parentNode = renderNode(t, th, { label: 'Dokumente', type: 'folder', expanded: true, compact })
        const child1 = renderNode(t, th, { label: 'Bericht.pdf', type: 'file', selected: true, compact })
        const child2 = renderNode(t, th, { label: 'Tabelle.xlsx', type: 'file', compact })

        const childrenEl = bordered
          ? h('div', {
              style: {
                paddingLeft: t['nc-treeview-indent'],
                marginLeft: '12px'
              }
            }, [
              h('div', {
                style: { borderTop: rawBorder }
              }, child1),
              h('div', {
                style: { borderTop: rawBorder }
              }, child2)
            ])
          : h('div', {
              style: { paddingLeft: t['nc-treeview-indent'], marginLeft: '12px' }
            }, [child1, child2])

        const extra1 = renderNode(t, th, { label: 'Downloads', type: 'folder', expanded: false, compact })
        const extra2 = renderNode(t, th, { label: 'Bilder', type: 'folder', expanded: false, compact })

        const innerContent = [parentNode, childrenEl, extra1, extra2]

        const wrapperStyle = bordered
          ? {
              border: rawBorder,
              borderRadius: t['nc-treeview-bordered-radius'],
              overflow: 'hidden',
              padding: '4px'
            }
          : { padding: '4px' }

        return h('div', { style: { ...wrapperStyle, minWidth: '160px' } }, innerContent)
      }

      const variants = [
        { key: 'default', label: 'Default' },
        { key: 'bordered', label: 'Bordered' },
        { key: 'compact', label: 'Compact' }
      ]

      const labelStyle = {
        fontSize: '11px',
        fontWeight: '600',
        color: th['text-tertiary'] || '#94a3b8',
        marginTop: '8px',
        display: 'block',
        textAlign: 'center'
      }

      const cols = variants.map(({ key, label }) =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, [
          renderSmallTree(key),
          h('span', { style: labelStyle }, label)
        ])
      )

      return h('div', {
        class: 'arena-btn-row',
        style: { alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }
      }, cols)
    }
  }
})

// Specimen 3: With badges & states
const TreeBadgesStates = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const th = props.theme

      const items = [
        h('div', {
          style: nodeStyle(t, { hover: true })
        }, [
          chevronIcon(true, t['nc-treeview-label-color-hover']),
          fileIcon('folder', t['nc-treeview-label-color-hover']),
          h('span', { style: { flex: '1' } }, 'Projekte')
        ]),
        h('div', {
          style: nodeStyle(t, { selected: true })
        }, [
          chevronIcon(true, t['nc-treeview-node-color-selected']),
          fileIcon('folder', t['nc-treeview-node-color-selected']),
          h('span', { style: { flex: '1' } }, 'Design System')
        ]),
        // Children of selected
        h('div', { style: { paddingLeft: t['nc-treeview-indent'], marginLeft: '12px' } }, [
          renderNode(t, th, { label: 'Tokens.json', type: 'file' }),
          renderNode(t, th, { label: 'Komponenten.md', type: 'file', hover: true })
        ]),
        h('div', {
          style: {
            ...nodeStyle(t),
            display: 'flex',
            alignItems: 'center'
          }
        }, [
          chevronIcon(false, t['nc-treeview-label-color']),
          fileIcon('folder', t['nc-treeview-label-color']),
          h('span', { style: { flex: '1' } }, 'Dokumentation'),
          h('span', { style: badgeStyle(t) }, '12')
        ]),
        h('div', {
          style: {
            ...nodeStyle(t),
            display: 'flex',
            alignItems: 'center'
          }
        }, [
          chevronIcon(false, t['nc-treeview-label-color']),
          fileIcon('folder', t['nc-treeview-label-color']),
          h('span', { style: { flex: '1' } }, 'Vorlagen'),
          h('span', { style: badgeStyle(t) }, '3')
        ]),
        h('div', {
          style: {
            ...nodeStyle(t),
            opacity: '0.4',
            cursor: 'not-allowed'
          }
        }, [
          h('span', { style: { width: '12px', flexShrink: '0' } }),
          fileIcon('folder', t['nc-treeview-label-color']),
          h('span', { style: { flex: '1' } }, 'Archiv')
        ])
      ]

      return h('div', {
        style: {
          fontFamily: 'inherit',
          minWidth: '240px',
          maxWidth: '320px',
          display: 'flex',
          flexDirection: 'column',
          gap: t['nc-treeview-node-gap']
        }
      }, items)
    }
  }
})
</script>
