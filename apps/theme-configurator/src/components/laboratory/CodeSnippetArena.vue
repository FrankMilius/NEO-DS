<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Specimen: Default (with header + line numbers + syntax highlighting) -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default — Header + Line Numbers + Syntax Highlighting</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <CodeSnippetDefault :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <CodeSnippetDefault :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <CodeSnippetDefault :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Without Line Numbers -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Without Line Numbers</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <CodeSnippetNoLineNumbers :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <CodeSnippetNoLineNumbers :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <CodeSnippetNoLineNumbers :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: macOS Header Style -->
    <div class="arena-category-divider">
      <span class="arena-category-label">macOS Header — Traffic Light Dots</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <CodeSnippetMacOS :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <CodeSnippetMacOS :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <CodeSnippetMacOS :tokens="activeTokens" :theme="activeTheme" />
        </div>
      </div>
    </div>

    <!-- Specimen: Inline Code -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Inline Code in Context</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-secondary'] }">
          <CodeSnippetInline :tokens="tokensLight" :theme="tLight" />
        </div>
        <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
          <CodeSnippetInline :tokens="tokensDark" :theme="tDark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="{ background: activeBg }">
          <CodeSnippetInline :tokens="activeTokens" :theme="activeTheme" />
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
const { isHighlighted, highlightStyle } = useArenaHighlight('code-snippet')

// ---------------------------------------------------------------------------
// Token Defaults & Semantic Refs
// ---------------------------------------------------------------------------
const TOKEN_DEFAULTS = {
  'nc-cs-font-family':          'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace',
  'nc-cs-font-size':            '13px',
  'nc-cs-line-height':          '1.6',
  'nc-cs-font-weight':          '400',
  'nc-cs-tab-size':             '2',
  'nc-cs-bg':                   '#1e1e2e',
  'nc-cs-color':                '#cdd6f4',
  'nc-cs-border':               '#313244',
  'nc-cs-border-width':         '1px',
  'nc-cs-radius':               '8px',
  'nc-cs-padding':              '20px',
  'nc-cs-padding-inline':       '20px',
  'nc-cs-inline-bg':            '#f3f4f6',
  'nc-cs-inline-color':         '#1f2937',
  'nc-cs-inline-radius':        '3px',
  'nc-cs-inline-padding-x':     '5px',
  'nc-cs-inline-padding-y':     '2px',
  'nc-cs-inline-font-size':     '0.875em',
  'nc-cs-copy-size':            '32px',
  'nc-cs-copy-bg':              'transparent',
  'nc-cs-copy-bg-hover':        'rgba(255,255,255,0.08)',
  'nc-cs-copy-color':           '#a1a1aa',
  'nc-cs-copy-color-hover':     '#e4e4e7',
  'nc-cs-copy-border':          'transparent',
  'nc-cs-copy-radius':          '4px',
  'nc-cs-copy-icon-size':       '16px',
  'nc-cs-header-bg':            '#181825',
  'nc-cs-header-color':         '#a1a1aa',
  'nc-cs-header-height':        '36px',
  'nc-cs-header-padding':       '0 16px',
  'nc-cs-header-font-size':     '12px',
  'nc-cs-header-font-weight':   '500',
  'nc-cs-header-border':        '#313244',
  'nc-cs-header-dot-size':      '12px',
  'nc-cs-header-dot-gap':       '8px',
  'nc-cs-header-dot-close':     '#ff5f57',
  'nc-cs-header-dot-minimize':  '#febc2e',
  'nc-cs-header-dot-maximize':  '#28c840',
  'nc-cs-line-numbers-color':   '#585b70',
  'nc-cs-line-numbers-width':   '40px',
  'nc-cs-line-numbers-padding': '0 12px 0 16px',
  'nc-cs-line-numbers-border':  '#313244',
  'nc-cs-line-highlight-bg':    'rgba(137,180,250,0.1)',
  'nc-cs-line-highlight-border':'#89b4fa',
  'nc-cs-line-highlight-width': '3px',
  'nc-cs-syntax-comment':       '#6c7086',
  'nc-cs-syntax-keyword':       '#cba6f7',
  'nc-cs-syntax-string':        '#a6e3a1',
  'nc-cs-syntax-number':        '#fab387',
  'nc-cs-syntax-function':      '#89b4fa',
  'nc-cs-syntax-operator':      '#89dceb',
  'nc-cs-syntax-class':         '#f9e2af',
  'nc-cs-syntax-property':      '#f38ba8',
  'nc-cs-syntax-punctuation':   '#bac2de',
}

const TOKEN_REFS = {
  'nc-cs-bg':              'layer-01',
  'nc-cs-color':           'text-primary',
  'nc-cs-border':          'border-secondary',
  'nc-cs-inline-bg':       'background-secondary',
  'nc-cs-inline-color':    'text-primary',
  'nc-cs-copy-color':      'text-secondary',
  'nc-cs-copy-color-hover':'text-primary',
  'nc-cs-header-color':    'text-tertiary',
  'nc-cs-line-numbers-color': 'text-tertiary',
  'nc-cs-syntax-comment':  'text-tertiary',
  'nc-cs-syntax-operator': 'text-secondary',
  'nc-cs-syntax-punctuation': 'text-tertiary',
}

// ---------------------------------------------------------------------------
// Token Resolution
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'code-snippet') || null
)
const tLight = computed(() => store.state.themes[store.state.activeThemeSet].light)
const tDark  = computed(() => store.state.themes[store.state.activeThemeSet].dark)

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
const tokensDark  = computed(() => resolveAll(tDark.value))

// ---------------------------------------------------------------------------
// 3-Mode Support
// ---------------------------------------------------------------------------
const arenaMode    = computed(() => store.state.previewMode)
const isSplit      = computed(() => arenaMode.value === 'split')
const activeTokens = computed(() => arenaMode.value === 'dark' ? tokensDark.value : tokensLight.value)
const activeTheme  = computed(() => arenaMode.value === 'dark' ? tDark.value : tLight.value)
const activeBg     = computed(() =>
  arenaMode.value === 'dark' ? tDark.value['background-base'] : tLight.value['background-secondary']
)

// ---------------------------------------------------------------------------
// Render Helpers
// ---------------------------------------------------------------------------
function renderCopyIcon(t) {
  return h('button', {
    style: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: t['nc-cs-copy-size'] || '32px',
      height: t['nc-cs-copy-size'] || '32px',
      background: t['nc-cs-copy-bg'] || 'transparent',
      border: `1px solid ${t['nc-cs-copy-border'] || 'transparent'}`,
      borderRadius: t['nc-cs-copy-radius'] || '4px',
      color: t['nc-cs-copy-color'] || '#a1a1aa',
      cursor: 'pointer',
      flexShrink: '0',
    }
  }, [
    h('svg', {
      width: '14', height: '14', viewBox: '0 0 24 24',
      fill: 'none', stroke: 'currentColor', 'stroke-width': '2',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round'
    }, [
      h('rect', { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' }),
      h('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' })
    ])
  ])
}

function renderHeader(t, { title = 'example.ts', plain = true } = {}) {
  return h('div', {
    style: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: t['nc-cs-header-height'] || '36px',
      padding: t['nc-cs-header-padding'] || '0 16px',
      background: t['nc-cs-header-bg'] || '#181825',
      borderBottom: `1px solid ${t['nc-cs-header-border'] || '#313244'}`,
      fontFamily: 'inherit',
      fontSize: t['nc-cs-header-font-size'] || '12px',
      fontWeight: t['nc-cs-header-font-weight'] || '500',
      color: t['nc-cs-header-color'] || '#a1a1aa',
    }
  }, [
    h('span', {}, title),
    renderCopyIcon(t),
  ])
}

function renderMacOSHeader(t, { title = 'app.ts' } = {}) {
  const dotColors = [
    t['nc-cs-header-dot-close'] || '#ff5f57',
    t['nc-cs-header-dot-minimize'] || '#febc2e',
    t['nc-cs-header-dot-maximize'] || '#28c840',
  ]
  const dotSize = t['nc-cs-header-dot-size'] || '12px'
  const dotGap = t['nc-cs-header-dot-gap'] || '8px'
  const dots = h('div', {
    style: { display: 'flex', alignItems: 'center', gap: dotGap }
  }, dotColors.map(color =>
    h('span', {
      style: {
        width: dotSize, height: dotSize,
        borderRadius: '50%',
        background: color,
        flexShrink: '0',
      }
    })
  ))
  return h('div', {
    style: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: t['nc-cs-header-height'] || '36px',
      padding: t['nc-cs-header-padding'] || '0 16px',
      background: t['nc-cs-header-bg'] || '#181825',
      borderBottom: `1px solid ${t['nc-cs-header-border'] || '#313244'}`,
      fontFamily: 'inherit',
      fontSize: t['nc-cs-header-font-size'] || '12px',
      fontWeight: t['nc-cs-header-font-weight'] || '500',
      color: t['nc-cs-header-color'] || '#a1a1aa',
    }
  }, [
    dots,
    h('span', {}, title),
    renderCopyIcon(t),
  ])
}

// Syntax-highlighted code line
function renderCodeLines(t, { lineNumbers = true } = {}) {
  const kw  = (s) => h('span', { style: { color: t['nc-cs-syntax-keyword']   || '#cba6f7' } }, s)
  const str = (s) => h('span', { style: { color: t['nc-cs-syntax-string']    || '#a6e3a1' } }, s)
  const fn  = (s) => h('span', { style: { color: t['nc-cs-syntax-function']  || '#89b4fa' } }, s)
  const op  = (s) => h('span', { style: { color: t['nc-cs-syntax-operator']  || '#89dceb' } }, s)
  const cm  = (s) => h('span', { style: { color: t['nc-cs-syntax-comment']   || '#6c7086', fontStyle: 'italic' } }, s)
  const pn  = (s) => h('span', { style: { color: t['nc-cs-syntax-punctuation'] || '#bac2de' } }, s)
  const num = (s) => h('span', { style: { color: t['nc-cs-syntax-number']    || '#fab387' } }, s)
  const plain = (s) => h('span', { style: { color: t['nc-cs-color'] || '#cdd6f4' } }, s)

  const lines = [
    [cm('// Komponente initialisieren')],
    [kw('import'), plain(' '), pn('{'), plain(' ref, computed '), pn('}'), plain(' '), kw('from'), plain(' '), str("'vue'")],
    [kw('import'), plain(' '), pn('{'), plain(' useThemeStore '), pn('}'), plain(' '), kw('from'), plain(' '), str("'../stores/theme'")],
    [],
    [kw('const'), plain(' '), plain('store'), plain(' '), op('='), plain(' '), fn('useThemeStore'), pn('()')],
    [kw('const'), plain(' '), plain('isDark'), plain(' '), op('='), plain(' '), fn('computed'), pn('('), pn('()'), plain(' '), op('=>')],
    [plain('  store.state.previewMode '), op('==='), plain(' '), str("'dark'"), pn(')')],
    [],
    [kw('export'), plain(' '), kw('default'), plain(' '), pn('{')],
    [plain('  '), plain('name'), pn(':'), plain(' '), str("'ThemeConfigurator'"), pn(',')],
    [plain('  '), plain('version'), pn(':'), plain(' '), num('2'), pn('.')],
    [pn('}')],
  ]

  const lineNumberStyle = {
    display: 'inline-block',
    width: t['nc-cs-line-numbers-width'] || '40px',
    padding: t['nc-cs-line-numbers-padding'] || '0 12px 0 0',
    borderRight: `1px solid ${t['nc-cs-line-numbers-border'] || '#313244'}`,
    marginRight: '16px',
    color: t['nc-cs-line-numbers-color'] || '#585b70',
    textAlign: 'right',
    userSelect: 'none',
    flexShrink: '0',
  }

  return lines.map((tokens_line, idx) => {
    const lineContent = tokens_line.length === 0
      ? [h('span', {}, '\u00a0')] // non-breaking space for empty lines
      : tokens_line

    if (lineNumbers) {
      return h('div', {
        style: { display: 'flex', alignItems: 'flex-start', minHeight: '1.6em' }
      }, [
        h('span', { style: lineNumberStyle }, String(idx + 1)),
        h('span', { style: { flex: '1' } }, lineContent)
      ])
    }
    return h('div', { style: { minHeight: '1.6em' } }, lineContent)
  })
}

function renderCodeBlock(t, { lineNumbers = true, header = null } = {}) {
  const containerStyle = {
    background: t['nc-cs-bg'] || '#1e1e2e',
    border: `${t['nc-cs-border-width'] || '1px'} solid ${t['nc-cs-border'] || '#313244'}`,
    borderRadius: t['nc-cs-radius'] || '8px',
    overflow: 'hidden',
    fontFamily: t['nc-cs-font-family'] || 'monospace',
    fontSize: t['nc-cs-font-size'] || '13px',
    lineHeight: String(t['nc-cs-line-height'] || '1.6'),
    fontWeight: t['nc-cs-font-weight'] || '400',
  }

  const codeAreaStyle = {
    padding: t['nc-cs-padding'] || '20px',
    overflowX: 'auto',
    color: t['nc-cs-color'] || '#cdd6f4',
  }

  const children = []
  if (header) children.push(header)
  children.push(
    h('div', { style: codeAreaStyle }, renderCodeLines(t, { lineNumbers }))
  )

  return h('div', { style: containerStyle }, children)
}

// ---------------------------------------------------------------------------
// Specimen Sub-Components
// ---------------------------------------------------------------------------

// Default: header + line numbers + syntax
const CodeSnippetDefault = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      return h('div', { style: { padding: '16px' } }, [
        renderCodeBlock(t, {
          lineNumbers: true,
          header: renderHeader(t, { title: 'example.ts' }),
        })
      ])
    }
  }
})

// Without line numbers
const CodeSnippetNoLineNumbers = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      return h('div', { style: { padding: '16px' } }, [
        renderCodeBlock(t, {
          lineNumbers: false,
          header: renderHeader(t, { title: 'app.ts' }),
        })
      ])
    }
  }
})

// macOS header style
const CodeSnippetMacOS = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      return h('div', { style: { padding: '16px' } }, [
        renderCodeBlock(t, {
          lineNumbers: true,
          header: renderMacOSHeader(t, { title: 'theme-store.ts' }),
        })
      ])
    }
  }
})

// Inline code in paragraph context
const CodeSnippetInline = defineComponent({
  props: { tokens: Object, theme: Object },
  setup(props) {
    return () => {
      const t = props.tokens
      const textColor = t['text-primary'] || '#1a1a1a'

      const inlineStyle = {
        fontFamily: t['nc-cs-font-family'] || 'monospace',
        fontSize: t['nc-cs-inline-font-size'] || '0.875em',
        background: t['nc-cs-inline-bg'] || '#f3f4f6',
        color: t['nc-cs-inline-color'] || '#1f2937',
        borderRadius: t['nc-cs-inline-radius'] || '3px',
        padding: `${t['nc-cs-inline-padding-y'] || '2px'} ${t['nc-cs-inline-padding-x'] || '5px'}`,
        display: 'inline',
      }

      const paraStyle = {
        fontSize: '14px',
        lineHeight: '1.7',
        color: textColor,
        margin: '0',
        fontFamily: 'inherit',
      }

      const inline = (text) => h('code', { style: inlineStyle }, text)

      return h('div', { style: { padding: '16px' } }, [
        h('div', { class: 'arena-preview-stack' }, [
          h('p', { style: paraStyle }, [
            'Verwende ',
            inline('useThemeStore()'),
            ' um auf den Theme-State zuzugreifen. Der aktuelle Modus ist in ',
            inline('store.state.previewMode'),
            ' gespeichert.',
          ]),
          h('p', { style: paraStyle }, [
            'Die Funktion ',
            inline('resolveToken(semanticMap, id)'),
            ' löst einen Token-Wert auf. Übergib den ',
            inline('semanticMap'),
            ' des aktiven Themes als erstes Argument.',
          ]),
          h('p', { style: paraStyle }, [
            'Installiere die Abhängigkeiten mit ',
            inline('npm install'),
            ', dann starte den Dev-Server mit ',
            inline('npm run dev'),
            '.',
          ]),
        ])
      ])
    }
  }
})
</script>
