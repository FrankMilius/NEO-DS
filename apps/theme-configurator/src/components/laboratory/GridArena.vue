<template>
  <div class="component-arena">

    <!-- ═══════════════════════════════════════════════════════════════
         12-Column Grid — Schematische Darstellung
         ═══════════════════════════════════════════════════════════════ -->

    <!-- Default Gap -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Default Gap</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="panelStyle('light')">
          <GridSchematic :tokens="tokensLight" :theme="tLight" mode="light" gapVariant="default" :columns="columns" />
          <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>
        </div>
        <div class="arena-specimen__panel" :style="panelStyle('dark')">
          <GridSchematic :tokens="tokensDark" :theme="tDark" mode="dark" gapVariant="default" :columns="columns" />
          <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="panelStyle(arenaMode)">
          <GridSchematic :tokens="activeTokens" :theme="activeTheme" :mode="arenaMode" gapVariant="default" :columns="columns" />
          <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>
        </div>
      </div>
    </div>

    <!-- Gap Small -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Gap Small</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="panelStyle('light')">
          <GridSchematic :tokens="tokensLight" :theme="tLight" mode="light" gapVariant="sm" :columns="columns" />
        </div>
        <div class="arena-specimen__panel" :style="panelStyle('dark')">
          <GridSchematic :tokens="tokensDark" :theme="tDark" mode="dark" gapVariant="sm" :columns="columns" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="panelStyle(arenaMode)">
          <GridSchematic :tokens="activeTokens" :theme="activeTheme" :mode="arenaMode" gapVariant="sm" :columns="columns" />
        </div>
      </div>
    </div>

    <!-- Gap Large -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Gap Large</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="panelStyle('light')">
          <GridSchematic :tokens="tokensLight" :theme="tLight" mode="light" gapVariant="lg" :columns="columns" />
        </div>
        <div class="arena-specimen__panel" :style="panelStyle('dark')">
          <GridSchematic :tokens="tokensDark" :theme="tDark" mode="dark" gapVariant="lg" :columns="columns" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="panelStyle(arenaMode)">
          <GridSchematic :tokens="activeTokens" :theme="activeTheme" :mode="arenaMode" gapVariant="lg" :columns="columns" />
        </div>
      </div>
    </div>

    <!-- Responsive Breakpoints -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Responsive (Mobile 4 Cols)</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="panelStyle('light')">
          <GridSchematic :tokens="tokensLight" :theme="tLight" mode="light" gapVariant="default" :columns="4" />
        </div>
        <div class="arena-specimen__panel" :style="panelStyle('dark')">
          <GridSchematic :tokens="tokensDark" :theme="tDark" mode="dark" gapVariant="default" :columns="4" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="panelStyle(arenaMode)">
          <GridSchematic :tokens="activeTokens" :theme="activeTheme" :mode="arenaMode" gapVariant="default" :columns="4" />
        </div>
      </div>
    </div>

    <!-- Auto-fit -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Auto-fit Layout</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="panelStyle('light')">
          <GridAutofit :tokens="tokensLight" :theme="tLight" mode="light" />
        </div>
        <div class="arena-specimen__panel" :style="panelStyle('dark')">
          <GridAutofit :tokens="tokensDark" :theme="tDark" mode="dark" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="panelStyle(arenaMode)">
          <GridAutofit :tokens="activeTokens" :theme="activeTheme" :mode="arenaMode" />
        </div>
      </div>
    </div>

    <!-- Span-Muster -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Column Spans</span>
    </div>
    <div class="arena-specimen">
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="panelStyle('light')">
          <GridSpans :tokens="tokensLight" :theme="tLight" mode="light" :columns="columns" />
        </div>
        <div class="arena-specimen__panel" :style="panelStyle('dark')">
          <GridSpans :tokens="tokensDark" :theme="tDark" mode="dark" :columns="columns" />
        </div>
      </div>
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="panelStyle(arenaMode)">
          <GridSpans :tokens="activeTokens" :theme="activeTheme" :mode="arenaMode" :columns="columns" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, defineComponent, h } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { useArenaHighlight } from '../../composables/useArenaHighlight.js'
import { componentTokenGroups } from '../../data/tokens.js'
import { useTokenResolver } from '../../composables/useTokenResolver.js'

const store = useThemeStore()
const { isHighlighted, highlightStyle } = useArenaHighlight('grid')

// ---------------------------------------------------------------------------
// Token Data
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'grid') || null
)

const tLight = computed(() => store.state.themes[store.state.activeThemeSet].light)
const tDark = computed(() => store.state.themes[store.state.activeThemeSet].dark)

const TOKEN_DEFAULTS = {
  'nc-grid-columns': '12',
  'nc-grid-gap':     '16px',
  'nc-grid-gap-sm':  '8px',
  'nc-grid-gap-lg':  '32px'
}

// Aufloesung zentral: composables/useTokenResolver.js (Plan v2, 3.1).
// Grid kennt keine Rollen-Verweise, daher leere semantische Tabelle.
const { resolveToken: aufloesen } = useTokenResolver({ store, componentData, defaults: TOKEN_DEFAULTS })
const resolveToken = (tokenId) => aufloesen({}, tokenId)

const columns = computed(() => {
  const val = resolveToken('nc-grid-columns')
  const n = parseInt(val, 10)
  return isNaN(n) ? 12 : n
})

function resolveGap(variant) {
  if (variant === 'sm') return resolveToken('nc-grid-gap-sm')
  if (variant === 'lg') return resolveToken('nc-grid-gap-lg')
  return resolveToken('nc-grid-gap')
}

function resolveAll() {
  const all = {}
  for (const id of Object.keys(TOKEN_DEFAULTS)) {
    all[id] = resolveToken(id)
  }
  return all
}

const tokensLight = computed(() => resolveAll())
const tokensDark = computed(() => resolveAll())
const activeTokens = computed(() => resolveAll())

// ---------------------------------------------------------------------------
// 3-Mode Support
// ---------------------------------------------------------------------------
const arenaMode = computed(() => store.state.previewMode)
const isSplit = computed(() => arenaMode.value === 'split')
const activeTheme = computed(() =>
  arenaMode.value === 'dark' ? tDark.value : tLight.value
)

function panelStyle(mode) {
  const t = mode === 'dark' ? tDark.value : tLight.value
  return {
    background: mode === 'dark' ? t['background-base'] : t['background-secondary'],
    position: 'relative'
  }
}

// ---------------------------------------------------------------------------
// Farben fuer schematische Zellen
// ---------------------------------------------------------------------------
function cellColor(theme, opacity = 1) {
  const interactive = theme['interactive-default'] || '#0066cc'
  return opacity < 1
    ? `color-mix(in srgb, ${interactive} ${Math.round(opacity * 100)}%, transparent)`
    : interactive
}

function labelColor(theme) {
  return theme['text-secondary'] || '#666'
}

// ---------------------------------------------------------------------------
// GridSchematic — rendert Spalten als farbige Zellen
// ---------------------------------------------------------------------------
const GridSchematic = defineComponent({
  props: {
    tokens: { type: Object, required: true },
    theme: { type: Object, required: true },
    mode: { type: String, default: 'light' },
    gapVariant: { type: String, default: 'default' },
    columns: { type: Number, default: 12 }
  },
  setup(props) {
    return () => {
      const gap = resolveGap(props.gapVariant)
      const cols = props.columns

      const containerStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: gap,
        width: '100%'
      }

      const cellStyle = {
        background: cellColor(props.theme, 0.12),
        border: `1px solid ${cellColor(props.theme, 0.25)}`,
        borderRadius: '4px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: '600',
        color: labelColor(props.theme),
        position: 'relative'
      }

      const children = []
      for (let i = 1; i <= cols; i++) {
        children.push(
          h('div', { key: i, style: cellStyle }, String(i))
        )
      }

      // Gap-Label
      const gapLabel = props.gapVariant === 'default'
        ? `Gap: ${gap}`
        : `Gap ${props.gapVariant.toUpperCase()}: ${gap}`

      return h('div', { class: 'grid-schematic' }, [
        h('div', { class: 'grid-schematic__meta', style: { color: labelColor(props.theme) } }, [
          h('span', { class: 'grid-schematic__info' }, `${cols} Columns`),
          h('span', { class: 'grid-schematic__separator' }),
          h('span', { class: 'grid-schematic__info' }, gapLabel)
        ]),
        h('div', { style: containerStyle }, children)
      ])
    }
  }
})

// ---------------------------------------------------------------------------
// GridAutofit — auto-fit Variante mit unterschiedlich breiten Karten
// ---------------------------------------------------------------------------
const GridAutofit = defineComponent({
  props: {
    tokens: { type: Object, required: true },
    theme: { type: Object, required: true },
    mode: { type: String, default: 'light' }
  },
  setup(props) {
    return () => {
      const gap = resolveGap('default')

      const containerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(80px, 100%), 1fr))',
        gap: gap,
        width: '100%'
      }

      const cellBase = {
        background: cellColor(props.theme, 0.12),
        border: `1px solid ${cellColor(props.theme, 0.25)}`,
        borderRadius: '4px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: '600',
        color: labelColor(props.theme)
      }

      const items = [1, 2, 3, 4, 5, 6, 7]

      return h('div', { class: 'grid-schematic' }, [
        h('div', { class: 'grid-schematic__meta', style: { color: labelColor(props.theme) } }, [
          h('span', { class: 'grid-schematic__info' }, 'auto-fit'),
          h('span', { class: 'grid-schematic__separator' }),
          h('span', { class: 'grid-schematic__info' }, `min 80px`)
        ]),
        h('div', { style: containerStyle },
          items.map(i => h('div', { key: i, style: cellBase }, String(i)))
        )
      ])
    }
  }
})

// ---------------------------------------------------------------------------
// GridSpans — Layout-Muster mit verschiedenen Spaltenbreiten
// ---------------------------------------------------------------------------
const GridSpans = defineComponent({
  props: {
    tokens: { type: Object, required: true },
    theme: { type: Object, required: true },
    mode: { type: String, default: 'light' },
    columns: { type: Number, default: 12 }
  },
  setup(props) {
    return () => {
      const gap = resolveGap('default')
      const cols = props.columns

      const containerStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: gap,
        width: '100%'
      }

      function spanCell(span, label, height = '40px') {
        return h('div', {
          style: {
            gridColumn: `span ${Math.min(span, cols)}`,
            background: cellColor(props.theme, 0.08 + (span / cols) * 0.15),
            border: `1px solid ${cellColor(props.theme, 0.2)}`,
            borderRadius: '4px',
            height: height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: '600',
            color: labelColor(props.theme),
            padding: '0 8px'
          }
        }, label)
      }

      // Typische Layout-Muster
      const rows = []

      // Row 1: Full width
      rows.push(spanCell(cols, `span ${cols} (full)`, '32px'))

      // Row 2: Halbe Breite
      const half = Math.floor(cols / 2)
      rows.push(spanCell(half, `span ${half}`))
      rows.push(spanCell(cols - half, `span ${cols - half}`))

      // Row 3: Drittel
      const third = Math.floor(cols / 3)
      const remainder = cols - third * 2
      rows.push(spanCell(third, `span ${third}`))
      rows.push(spanCell(third, `span ${third}`))
      rows.push(spanCell(remainder, `span ${remainder}`))

      // Row 4: Sidebar + Content
      const sidebar = Math.max(Math.floor(cols / 4), 1)
      const content = cols - sidebar
      rows.push(spanCell(sidebar, `sidebar ${sidebar}`, '56px'))
      rows.push(spanCell(content, `content ${content}`, '56px'))

      // Row 5: 3 + 6 + 3 (zentriert)
      if (cols >= 12) {
        rows.push(spanCell(3, 'span 3'))
        rows.push(spanCell(6, 'span 6'))
        rows.push(spanCell(3, 'span 3'))
      }

      return h('div', { class: 'grid-schematic' }, [
        h('div', { class: 'grid-schematic__meta', style: { color: labelColor(props.theme) } }, [
          h('span', { class: 'grid-schematic__info' }, 'Layout-Muster'),
          h('span', { class: 'grid-schematic__separator' }),
          h('span', { class: 'grid-schematic__info' }, `${cols} Columns`)
        ]),
        h('div', { style: containerStyle }, rows)
      ])
    }
  }
})
</script>

<style scoped>
.component-arena {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
}

.arena-category-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 4px;
}

.arena-category-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: currentColor;
  opacity: 0.15;
}

.arena-category-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.5;
  white-space: nowrap;
}

.arena-specimen {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
}

.arena-specimen__pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.arena-specimen__panel {
  padding: 24px;
}

.arena-specimen__single {
  display: grid;
  grid-template-columns: 1fr;
}

.arena-specimen__panel--light {
  border-right: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}

/* Grid Schematic */
.grid-schematic {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.grid-schematic__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  opacity: 0.6;
}

.grid-schematic__info {
  font-weight: 600;
  letter-spacing: 0.02em;
}

.grid-schematic__separator {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.4;
}
</style>
