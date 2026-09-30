<template>
  <div class="section-arena">

    <!-- ═══════════════════════════════════════════════════════════════
         DENSITY × SURFACE VISUAL MATRIX
         ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Dichte × Oberflaeche</span>
    </div>

    <p class="sa-intro" :style="{ color: t['text-secondary'] }">
      Vollstaendige Matrix aller Dichte- und Oberflaechenkombinationen.
      Pruefe ob z.B. <code :style="{ color: t['interactive-default'] }">compact</code> auf
      <code :style="{ color: t['interactive-default'] }">accent</code> zu gedraengt wirkt.
    </p>

    <!-- Column Headers -->
    <div class="sa-matrix">
      <div class="sa-matrix-header">
        <div class="sa-matrix-corner" :style="{ color: t['text-tertiary'] }">surface \ density</div>
        <div
          v-for="d in densityValues"
          :key="d.id"
          class="sa-matrix-col-label"
          :style="{ color: t['text-secondary'] }"
        >
          {{ d.label }}
        </div>
      </div>

      <!-- Matrix Rows -->
      <div v-for="s in surfaceValues" :key="s.id" class="sa-matrix-row">
        <div class="sa-matrix-row-label" :style="{ color: t['text-secondary'] }">
          {{ s.label }}
          <code v-if="s.modifier" class="sa-mod" :style="{ color: t['interactive-default'] }">{{ s.modifier }}</code>
        </div>

        <div
          v-for="d in densityValues"
          :key="d.id"
          class="sa-matrix-cell"
          :style="cellStyle(s, d)"
          :class="{ 'sa-matrix-cell--active': activeCellKey === `${s.id}-${d.id}` }"
          @click="activeCellKey = `${s.id}-${d.id}`"
        >
          <!-- Section Schematic -->
          <div class="sa-cell-section" :style="cellSectionStyle(s, d)">
            <div class="sa-cell-content">
              <div class="sa-cell-heading" :style="cellTextStyle(s, true)">Headline</div>
              <div class="sa-cell-body" :style="cellTextStyle(s, false)">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            </div>
          </div>

          <div class="sa-cell-meta" :style="{ color: t['text-tertiary'] }">
            <span>{{ d.paddingLabel }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         DIVIDER VARIANTS
         ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Section Dividers</span>
    </div>

    <p class="sa-intro" :style="{ color: t['text-secondary'] }">
      Horizontale Trennlinien erzeugen visuelle Abgrenzung zwischen benachbarten Sections —
      besonders wichtig bei identischen Surface-Kombinationen. Realisiert via
      <code :style="{ color: t['interactive-default'] }">border-top</code> /
      <code :style="{ color: t['interactive-default'] }">border-bottom</code> auf dem Root-Element.
    </p>

    <div class="sa-divider-grid">
      <div
        v-for="dv in dividerVariants"
        :key="dv.id"
        class="sa-divider-card"
        :style="{ borderColor: t['border-secondary'] }"
      >
        <div class="sa-divider-header">
          <span class="sa-divider-name" :style="{ color: t['text-primary'] }">{{ dv.label }}</span>
          <code v-if="dv.modifier" class="sa-mod" :style="{ color: t['interactive-default'] }">{{ dv.modifier }}</code>
          <span v-else class="sa-default-badge" :style="{ background: t['interactive-default'], color: t['text-on-interactive'] }">Default</span>
        </div>

        <!-- Stacked Section Schematic -->
        <div class="sa-divider-demo" :style="{ background: t['background-secondary'] }">
          <div class="sa-stacked-section sa-stacked-section--above" :style="{ background: t['background-base'] }">
            <span :style="{ color: t['text-tertiary'] }">Section (above)</span>
          </div>
          <div
            class="sa-stacked-section sa-stacked-section--main"
            :style="{
              background: t['surface-elevated'] || t['background-base'],
              borderTop: dv.hasTop ? `${dividerWidth} ${dividerStyle} ${dividerColor}` : 'none',
              borderBottom: dv.hasBottom ? `${dividerWidth} ${dividerStyle} ${dividerColor}` : 'none'
            }"
          >
            <span :style="{ color: t['text-primary'] }">Section ({{ dv.label }})</span>
          </div>
          <div class="sa-stacked-section sa-stacked-section--below" :style="{ background: t['background-base'] }">
            <span :style="{ color: t['text-tertiary'] }">Section (below)</span>
          </div>
        </div>

        <div class="sa-divider-desc" :style="{ color: t['text-secondary'] }">{{ dv.description }}</div>

        <div v-if="dv.id !== 'none'" class="sa-divider-tokens" :style="{ borderColor: t['border-secondary'] }">
          <div class="sa-token-ref">
            <code class="sa-token-name" :style="{ color: t['text-tertiary'] }">--nc-section-divider-color</code>
            <span class="sa-token-swatch" :style="{ background: dividerColor }"></span>
          </div>
          <div class="sa-token-ref">
            <code class="sa-token-name" :style="{ color: t['text-tertiary'] }">--nc-section-divider-width</code>
            <code class="sa-token-value" :style="{ color: t['interactive-default'] }">{{ dividerWidth }}</code>
          </div>
          <div class="sa-token-ref">
            <code class="sa-token-name" :style="{ color: t['text-tertiary'] }">--nc-section-divider-style</code>
            <code class="sa-token-value" :style="{ color: t['interactive-default'] }">{{ dividerStyle }}</code>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         SURFACE × DIVIDER CONTEXT
         ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Surface × Divider Kontext</span>
    </div>

    <p class="sa-intro" :style="{ color: t['text-secondary'] }">
      Divider sind vor allem dann noetig, wenn benachbarte Sections dieselbe Oberflaeche haben.
      Bei unterschiedlichen Surfaces reicht der Farbkontrast oft aus.
    </p>

    <div class="sa-ctx-grid">
      <div
        v-for="ctx in surfaceDividerContexts"
        :key="ctx.id"
        class="sa-ctx-card"
        :style="{ borderColor: t['border-secondary'] }"
      >
        <div class="sa-ctx-label" :style="{ color: t['text-primary'] }">{{ ctx.label }}</div>
        <div class="sa-ctx-stack">
          <div class="sa-ctx-section" :style="{ background: ctx.aboveBg }">
            <span class="sa-ctx-text" :style="{ color: ctx.aboveColor }">{{ ctx.aboveLabel }}</span>
          </div>
          <div
            class="sa-ctx-divider-line"
            :style="{ borderColor: ctx.showDivider ? dividerColor : 'transparent' }"
          ></div>
          <div class="sa-ctx-section" :style="{ background: ctx.belowBg }">
            <span class="sa-ctx-text" :style="{ color: ctx.belowColor }">{{ ctx.belowLabel }}</span>
          </div>
        </div>
        <div class="sa-ctx-verdict" :style="{ color: t['text-tertiary'] }">
          {{ ctx.verdict }}
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         EDGE SHAPES
         ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Edge Shapes</span>
    </div>

    <p class="sa-intro" :style="{ color: t['text-secondary'] }">
      Dekorative Kantenformen erzeugen dynamische visuelle Uebergaenge zwischen Sections.
      Umgesetzt via <code :style="{ color: t['interactive-default'] }">clip-path</code> oder
      <code :style="{ color: t['interactive-default'] }">SVG mask</code>.
    </p>

    <div class="sa-edge-grid">
      <div
        v-for="edge in edgeVariants"
        :key="edge.id"
        class="sa-edge-card"
        :style="{ borderColor: t['border-secondary'] }"
      >
        <div class="sa-edge-header">
          <span class="sa-edge-name" :style="{ color: t['text-primary'] }">{{ edge.label }}</span>
          <code v-if="edge.modifier" class="sa-mod" :style="{ color: t['interactive-default'] }">{{ edge.modifier }}</code>
          <span v-else class="sa-default-badge" :style="{ background: t['interactive-default'], color: t['text-on-interactive'] }">Default</span>
        </div>

        <!-- Edge Shape Demo -->
        <div class="sa-edge-demo">
          <div class="sa-edge-section sa-edge-section--top" :style="{ background: t['interactive-default'] || '#0066cc' }">
            <span :style="{ color: t['text-on-interactive'] }">Section A</span>
            <!-- Edge Shape SVG Overlay -->
            <svg v-if="edge.id === 'slanted'" class="sa-edge-svg" viewBox="0 0 400 48" preserveAspectRatio="none">
              <polygon :fill="t['background-base'] || '#ffffff'" points="0,48 400,0 400,48" />
            </svg>
            <svg v-else-if="edge.id === 'curved'" class="sa-edge-svg" viewBox="0 0 400 48" preserveAspectRatio="none">
              <path :fill="t['background-base'] || '#ffffff'" d="M0,48 Q200,0 400,48 Z" />
            </svg>
          </div>
          <div class="sa-edge-section sa-edge-section--bottom" :style="{ background: t['background-base'] }">
            <span :style="{ color: t['text-primary'] }">Section B</span>
          </div>
        </div>

        <div class="sa-edge-desc" :style="{ color: t['text-secondary'] }">{{ edge.description }}</div>

        <div v-if="edge.id !== 'straight'" class="sa-edge-tokens" :style="{ borderColor: t['border-secondary'] }">
          <div class="sa-token-ref">
            <code class="sa-token-name" :style="{ color: t['text-tertiary'] }">--nc-section-edge-height</code>
            <code class="sa-token-value" :style="{ color: t['interactive-default'] }">{{ tokenVal('nc-section-edge-height') }}</code>
          </div>
          <div v-if="edge.id === 'slanted'" class="sa-token-ref">
            <code class="sa-token-name" :style="{ color: t['text-tertiary'] }">--nc-section-edge-angle</code>
            <code class="sa-token-value" :style="{ color: t['interactive-default'] }">{{ tokenVal('nc-section-edge-angle') }}</code>
          </div>
          <div class="sa-token-ref">
            <code class="sa-token-name" :style="{ color: t['text-tertiary'] }">--nc-section-edge-fill</code>
            <span class="sa-token-swatch" :style="{ background: t['background-base'] }"></span>
          </div>
          <div class="sa-edge-css" :style="{ color: t['text-tertiary'] }">
            <code>{{ edge.cssSnippet }}</code>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         DEPENDENCY MAPPING / CONTEXTUAL TOKENS
         ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Dependency Mapping</span>
    </div>

    <p class="sa-intro" :style="{ color: t['text-secondary'] }">
      Section erbt und referenziert Tokens aus anderen Gruppen (Surface, Typography, Spacing).
      Jede Oberflaeche hat ein eigenes Token-Set. Die Accent-Variante invertiert saemtliche Textfarben
      auf <code :style="{ color: t['interactive-default'] }">on-accent</code> / <code :style="{ color: t['interactive-default'] }">on-interactive</code>.
    </p>

    <div class="sa-dep-tabs">
      <button
        v-for="s in surfaceValues"
        :key="s.id"
        class="sa-dep-tab"
        :class="{ 'sa-dep-tab--active': activeSurface === s.id }"
        :style="depTabStyle(s)"
        @click="activeSurface = s.id"
      >
        {{ s.label }}
      </button>
    </div>

    <div class="sa-dep-panel" :style="depPanelStyle">
      <!-- Surface Preview -->
      <div class="sa-dep-preview" :style="depPreviewStyle">
        <div class="sa-dep-content">
          <div class="sa-dep-heading" :style="depHeadingStyle">Section Headline</div>
          <div class="sa-dep-body" :style="depBodyStyle">
            Dieser Text zeigt den Kontrast der Textfarben auf der gewahlten Oberflache.
            Bei der Accent-Variante werden On-Accent-Farben verwendet.
          </div>
          <div v-if="activeSurface === 'accent'" class="sa-dep-mirror-hint" :style="{ color: depSecondaryColor }">
            Mirror-Mode: On-Accent Textfarben aktiv
          </div>
        </div>
      </div>

      <!-- Token List -->
      <div class="sa-dep-tokens" :style="{ borderColor: t['border-secondary'] }">
        <div class="sa-dep-section-label" :style="{ color: t['text-primary'] }">
          Referenzierte Tokens
          <span v-if="activeSurface === 'accent'" class="sa-mirror-badge" :style="{ background: t['interactive-default'], color: t['text-on-interactive'] }">Mirror-Mode</span>
        </div>
        <div
          v-for="dep in activeDependencies"
          :key="dep.token"
          class="sa-dep-row"
          :style="{ borderColor: t['border-secondary'] }"
        >
          <div class="sa-dep-role" :style="{ color: t['text-secondary'] }">{{ dep.role }}</div>
          <code class="sa-dep-token-name" :style="{ color: t['interactive-default'] }">--{{ dep.token }}</code>
          <span class="sa-dep-swatch" :style="{ background: resolveDepColor(dep.token) }"></span>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         SECTION FLOW PREVIEW
         ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Section Flow</span>
    </div>

    <p class="sa-intro" :style="{ color: t['text-secondary'] }">
      Realistischer Seitenfluss: Mehrere Sections mit unterschiedlichen Surfaces, Dividers und Edge-Shapes
      im Zusammenspiel. So sieht eine typische Landing Page aus.
    </p>

    <div class="sa-flow" :style="{ borderColor: t['border-secondary'] }">
      <!-- Section 1: Accent + Slanted Edge -->
      <div class="sa-flow-section sa-flow-section--accent" :style="{ background: t['interactive-default'] }">
        <div class="sa-flow-content">
          <div class="sa-flow-heading" :style="{ color: t['text-on-interactive'] }">Hero Section</div>
          <div class="sa-flow-body" :style="{ color: t['text-on-interactive'], opacity: 0.8 }">Accent + Slanted Edge</div>
        </div>
        <svg class="sa-flow-edge" viewBox="0 0 400 32" preserveAspectRatio="none">
          <polygon :fill="t['background-base'] || '#ffffff'" points="0,32 400,0 400,32" />
        </svg>
      </div>

      <!-- Section 2: Base + Divider Bottom -->
      <div
        class="sa-flow-section"
        :style="{ background: t['background-base'], borderBottom: `1px solid ${dividerColor}` }"
      >
        <div class="sa-flow-content">
          <div class="sa-flow-heading" :style="{ color: t['text-primary'] }">Features</div>
          <div class="sa-flow-body" :style="{ color: t['text-secondary'] }">Base + Divider Bottom</div>
        </div>
      </div>

      <!-- Section 3: Muted -->
      <div class="sa-flow-section" :style="{ background: t['background-secondary'] }">
        <div class="sa-flow-content">
          <div class="sa-flow-heading" :style="{ color: t['text-primary'] }">Testimonials</div>
          <div class="sa-flow-body" :style="{ color: t['text-secondary'] }">Muted Surface</div>
        </div>
      </div>

      <!-- Section 4: Elevated + Curved Edge -->
      <div class="sa-flow-section sa-flow-section--elevated" :style="{ background: t['surface-elevated'] || '#ffffff' }">
        <svg class="sa-flow-edge sa-flow-edge--top" viewBox="0 0 400 24" preserveAspectRatio="none">
          <path :fill="t['background-secondary'] || '#f5f5f5'" d="M0,0 Q200,24 400,0 Z" />
        </svg>
        <div class="sa-flow-content">
          <div class="sa-flow-heading" :style="{ color: t['text-primary'] }">Pricing</div>
          <div class="sa-flow-body" :style="{ color: t['text-secondary'] }">Elevated + Curved Edge Top</div>
        </div>
      </div>

      <!-- Section 5: Accent (CTA) -->
      <div class="sa-flow-section sa-flow-section--accent" :style="{ background: t['interactive-default'] }">
        <div class="sa-flow-content">
          <div class="sa-flow-heading" :style="{ color: t['text-on-interactive'] }">Call to Action</div>
          <div class="sa-flow-body" :style="{ color: t['text-on-interactive'], opacity: 0.8 }">Accent Surface</div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         ANATOMY
         ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Anatomy</span>
    </div>

    <div class="sa-anatomy" :style="{ background: t['background-secondary'], borderColor: t['border-secondary'] }">
      <div class="sa-anatomy-row">
        <code class="sa-anatomy-el" :style="{ color: t['interactive-default'] }">.section</code>
        <span class="sa-anatomy-desc" :style="{ color: t['text-secondary'] }">Root — Orchestrator fuer Block-Padding, Surface, Divider und Edge</span>
      </div>
      <div class="sa-anatomy-row sa-anatomy-row--child">
        <code class="sa-anatomy-el" :style="{ color: t['interactive-default'] }">.nc-container</code>
        <span class="sa-anatomy-desc" :style="{ color: t['text-secondary'] }">Container — horizontale Begrenzung und Zentrierung</span>
      </div>
      <div class="sa-anatomy-row sa-anatomy-row--grandchild">
        <code class="sa-anatomy-el" :style="{ color: t['text-tertiary'] }">*</code>
        <span class="sa-anatomy-desc" :style="{ color: t['text-secondary'] }">Beliebiger Inhalt (Grid, Komponenten, Text)</span>
      </div>
      <div class="sa-anatomy-divider" :style="{ borderColor: t['border-secondary'] }"></div>
      <div class="sa-anatomy-row">
        <span class="sa-anatomy-note" :style="{ color: t['text-tertiary'] }">
          Modifikatoren: <code>--compact</code>, <code>--spacious</code>, <code>--elevated</code>, <code>--muted</code>, <code>--accent</code>,
          <code>--divider-top</code>, <code>--divider-bottom</code>, <code>--divider-both</code>,
          <code>--edge-slanted</code>, <code>--edge-curved</code>
        </span>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         LAYOUT CASCADE
         ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Layout Cascade</span>
    </div>

    <p class="sa-intro" :style="{ color: t['text-secondary'] }">
      Section ist der Master-Orchestrator im Layout-Stack. Aenderungen propagieren zu Container und Grid.
    </p>

    <!-- Cascade Chain -->
    <div class="sa-cascade-chain">
      <template v-for="(node, idx) in cascadeChain" :key="node.id">
        <div
          class="sa-cascade-node"
          :class="{ 'sa-cascade-node--active': node.isActive }"
          :style="{
            borderColor: node.isActive ? t['interactive-default'] : t['border-secondary'],
            background: node.isActive ? `color-mix(in srgb, ${t['interactive-default']} 10%, transparent)` : 'transparent',
            color: node.isActive ? t['interactive-default'] : t['text-secondary']
          }"
        >
          <span class="sa-cascade-name">{{ node.label }}</span>
          <span class="sa-cascade-count" :style="{ background: t['background-secondary'], color: t['text-tertiary'] }">{{ node.tokenCount }}</span>
        </div>
        <svg v-if="idx < cascadeChain.length - 1" width="24" height="12" viewBox="0 0 24 12" :style="{ color: t['text-tertiary'] }">
          <path d="M2 6h18M16 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>
        </svg>
      </template>
    </div>

    <!-- Conflict Warnings (wenn vorhanden) -->
    <div v-if="relevantConflicts.length" class="sa-conflicts">
      <div
        v-for="conflict in relevantConflicts"
        :key="conflict.id"
        class="sa-conflict-card"
        :style="{
          borderColor: conflict.severity === 'warning' ? 'color-mix(in srgb, #f59e0b 40%, transparent)' : 'color-mix(in srgb, #3b82f6 30%, transparent)',
          background: conflict.severity === 'warning' ? 'color-mix(in srgb, #f59e0b 6%, transparent)' : 'color-mix(in srgb, #3b82f6 5%, transparent)'
        }"
      >
        <div class="sa-conflict-header" :style="{ color: conflict.severity === 'warning' ? '#f59e0b' : '#3b82f6' }">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          <span class="sa-conflict-label">{{ conflict.label }}</span>
        </div>
        <p class="sa-conflict-msg" :style="{ color: t['text-secondary'] }">{{ conflict.message }}</p>
      </div>
    </div>

    <!-- Contextual Notes -->
    <div v-if="contextualNotes.length" class="sa-ctx-notes">
      <div
        v-for="(note, idx) in contextualNotes"
        :key="idx"
        class="sa-ctx-note"
        :style="{
          background: note.type === 'warning' ? 'color-mix(in srgb, #f59e0b 6%, transparent)' : 'color-mix(in srgb, #3b82f6 6%, transparent)',
          color: t['text-secondary']
        }"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          :style="{ color: note.type === 'warning' ? '#f59e0b' : '#3b82f6' }">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
        </svg>
        <span>{{ note.text }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { componentTokenGroups } from '../../data/tokens.js'
import { useRecipeLoader } from '../../composables/useRecipeLoader.js'
import { useLayoutDependencies } from '../../composables/useLayoutDependencies.js'

const store = useThemeStore()
const { recipe } = useRecipeLoader('section')
const { cascadeChain, relevantConflicts, smartLinks, contextualNotes } = useLayoutDependencies('section')

const activeThemeMode = computed(() => store.state.previewMode === 'split' ? 'light' : store.state.previewMode)
const t = computed(() => store.state.themes[store.state.activeThemeSet][activeThemeMode.value])

// Resolve token value with override support
function tokenVal(id) {
  const group = componentTokenGroups.find(c => c.id === 'section')
  if (!group) return ''
  const tok = group.tokens.find(t => t.id === id)
  if (!tok) return ''
  const override = store.currentComponentOverrides?.[id]
  return override !== undefined ? override : tok.default
}

// ── Density Axis ──
const densityValues = computed(() => [
  { id: 'compact', label: 'Compact', modifier: 'section--compact', paddingLabel: '32px', paddingPx: 14 },
  { id: 'default', label: 'Default', modifier: null, paddingLabel: 'clamp(2rem, 4vw, 6rem)', paddingPx: 24 },
  { id: 'spacious', label: 'Spacious', modifier: 'section--spacious', paddingLabel: '160px', paddingPx: 40 }
])

// ── Surface Axis ──
const surfaceValues = computed(() => [
  { id: 'base', label: 'Base', modifier: null },
  { id: 'elevated', label: 'Elevated', modifier: 'section--elevated' },
  { id: 'muted', label: 'Muted', modifier: 'section--muted' },
  { id: 'accent', label: 'Accent', modifier: 'section--accent' }
])

// ── Matrix Cell Styles ──
function surfaceBg(surface) {
  const tv = t.value
  switch (surface.id) {
    case 'elevated': return tv['surface-elevated'] || '#ffffff'
    case 'muted': return tv['background-secondary'] || '#f5f5f5'
    case 'accent': return tv['interactive-default'] || '#0066cc'
    default: return tv['background-base'] || '#ffffff'
  }
}

function surfaceTextColor(surface, isHeading) {
  const tv = t.value
  if (surface.id === 'accent') {
    return isHeading ? tv['text-on-interactive'] : (tv['text-on-interactive'] || '#ffffff')
  }
  return isHeading ? tv['text-primary'] : tv['text-secondary']
}

function cellStyle(surface) {
  return { borderColor: t.value['border-secondary'] }
}

function cellSectionStyle(surface, density) {
  return {
    background: surfaceBg(surface),
    paddingBlock: density.paddingPx + 'px',
    paddingInline: '12px'
  }
}

function cellTextStyle(surface, isHeading) {
  return { color: surfaceTextColor(surface, isHeading) }
}

const activeCellKey = ref(null)

// ── Divider Tokens ──
const dividerColor = computed(() => t.value['border-primary'] || '#d0d0d0')
const dividerWidth = computed(() => tokenVal('nc-section-divider-width') || '1px')
const dividerStyle = computed(() => tokenVal('nc-section-divider-style') || 'solid')

// ── Divider Variants ──
const dividerVariants = computed(() => [
  { id: 'none', label: 'None', modifier: null, hasTop: false, hasBottom: false, description: 'Keine Trennlinie (Standard).' },
  { id: 'top', label: 'Top', modifier: '.section--divider-top', hasTop: true, hasBottom: false, description: '1px Linie am oberen Rand — trennt von der darueberliegenden Section.' },
  { id: 'bottom', label: 'Bottom', modifier: '.section--divider-bottom', hasTop: false, hasBottom: true, description: '1px Linie am unteren Rand — trennt von der darunterliegenden Section.' },
  { id: 'both', label: 'Both', modifier: '.section--divider-both', hasTop: true, hasBottom: true, description: 'Trennlinien oben und unten — vollstaendige visuelle Kapselung.' }
])

// ── Surface × Divider Context ──
const surfaceDividerContexts = computed(() => {
  const tv = t.value
  return [
    { id: 'base-base', label: 'Base → Base', aboveBg: tv['background-base'], belowBg: tv['background-base'], aboveColor: tv['text-primary'], belowColor: tv['text-primary'], aboveLabel: 'Base', belowLabel: 'Base', showDivider: true, verdict: 'Divider noetig — kein Farbkontrast' },
    { id: 'base-muted', label: 'Base → Muted', aboveBg: tv['background-base'], belowBg: tv['background-secondary'], aboveColor: tv['text-primary'], belowColor: tv['text-primary'], aboveLabel: 'Base', belowLabel: 'Muted', showDivider: false, verdict: 'Kein Divider — Farbwechsel reicht' },
    { id: 'base-accent', label: 'Base → Accent', aboveBg: tv['background-base'], belowBg: tv['interactive-default'], aboveColor: tv['text-primary'], belowColor: tv['text-on-interactive'], aboveLabel: 'Base', belowLabel: 'Accent', showDivider: false, verdict: 'Kein Divider — starker Kontrast' },
    { id: 'muted-muted', label: 'Muted → Muted', aboveBg: tv['background-secondary'], belowBg: tv['background-secondary'], aboveColor: tv['text-primary'], belowColor: tv['text-primary'], aboveLabel: 'Muted', belowLabel: 'Muted', showDivider: true, verdict: 'Divider noetig — gleiche Surface' },
    { id: 'elevated-base', label: 'Elevated → Base', aboveBg: tv['surface-elevated'] || '#fff', belowBg: tv['background-base'], aboveColor: tv['text-primary'], belowColor: tv['text-primary'], aboveLabel: 'Elevated', belowLabel: 'Base', showDivider: false, verdict: 'Optional — leichter Schattenwurf genuegt' },
    { id: 'accent-muted', label: 'Accent → Muted', aboveBg: tv['interactive-default'], belowBg: tv['background-secondary'], aboveColor: tv['text-on-interactive'], belowColor: tv['text-primary'], aboveLabel: 'Accent', belowLabel: 'Muted', showDivider: false, verdict: 'Kein Divider — maximaler Kontrast' }
  ]
})

// ── Edge Variants ──
const edgeVariants = computed(() => [
  { id: 'straight', label: 'Straight', modifier: null, description: 'Gerade Kante (Standard). Kein dekoratives Element.', cssSnippet: '' },
  { id: 'slanted', label: 'Slanted', modifier: '.section--edge-slanted', description: 'Diagonaler Schnitt mit 2–4° Neigung. Erzeugt dynamische Uebergaenge.', cssSnippet: 'clip-path: polygon(0 0, 100% 0, 100% calc(100% - 48px), 0 100%)' },
  { id: 'curved', label: 'Curved', modifier: '.section--edge-curved', description: 'Wellenfoermige Kante via SVG. Weiche, organische Uebergaenge.', cssSnippet: 'mask: url(#wave-mask); mask-size: 100% 48px' }
])

// ── Dependency Mapping ──
const activeSurface = ref('base')

const dependencyMap = computed(() => {
  const maps = recipe.value?.dependencies?.maps || []
  const map = maps.find(m => m.surface === activeSurface.value)
  return map?.inherits || []
})

const activeDependencies = computed(() => dependencyMap.value)

function resolveDepColor(token) {
  const tv = t.value
  // Map token names to resolved theme values
  const tokenMap = {
    'fnd-color-background-base': tv['background-base'],
    'fnd-color-background-secondary': tv['background-secondary'],
    'fnd-color-surface-elevated': tv['surface-elevated'],
    'fnd-color-text-primary': tv['text-primary'],
    'fnd-color-text-secondary': tv['text-secondary'],
    'fnd-color-text-tertiary': tv['text-tertiary'],
    'fnd-color-text-on-interactive': tv['text-on-interactive'],
    'fnd-color-text-on-accent': tv['text-on-interactive'],
    'fnd-color-on-accent': tv['text-on-interactive'],
    'fnd-color-interactive-default': tv['interactive-default'],
    'fnd-color-border-primary': tv['border-primary'],
    'fnd-color-border-secondary': tv['border-secondary'],
    'fnd-color-border-on-accent': tv['border-secondary']
  }
  return tokenMap[token] || tv['text-primary'] || '#333'
}

const depSecondaryColor = computed(() => {
  const tv = t.value
  return activeSurface.value === 'accent'
    ? (tv['text-on-interactive'] || '#ffffff')
    : tv['text-secondary']
})

function depTabStyle(surface) {
  const isActive = activeSurface.value === surface.id
  const tv = t.value
  return {
    background: isActive ? tv['interactive-default'] : 'transparent',
    color: isActive ? tv['text-on-interactive'] : tv['text-secondary'],
    borderColor: isActive ? tv['interactive-default'] : tv['border-secondary']
  }
}

const depPanelStyle = computed(() => ({
  borderColor: t.value['border-secondary']
}))

const depPreviewStyle = computed(() => ({
  background: surfaceBg({ id: activeSurface.value })
}))

const depHeadingStyle = computed(() => ({
  color: surfaceTextColor({ id: activeSurface.value }, true)
}))

const depBodyStyle = computed(() => ({
  color: surfaceTextColor({ id: activeSurface.value }, false),
  opacity: activeSurface.value === 'accent' ? 0.85 : 1
}))
</script>

<style scoped>
.section-arena {
  padding: 24px; display: flex; flex-direction: column; gap: 24px;
}

.sa-intro { font-size: 13px; line-height: 1.6; margin: 0; }
.sa-intro code { font-size: 12px; font-weight: 600; }

.sa-mod {
  font-size: 10px; font-family: monospace; font-weight: 600;
  padding: 2px 6px; border-radius: 4px;
  background: color-mix(in srgb, currentColor 10%, transparent);
}

.sa-default-badge {
  font-size: 9px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.5px; padding: 2px 8px; border-radius: 4px;
}

/* ═══════════════════════════════════════════════════════
   DENSITY × SURFACE MATRIX
   ═══════════════════════════════════════════════════════ */
.sa-matrix { display: flex; flex-direction: column; gap: 0; }

.sa-matrix-header {
  display: grid; grid-template-columns: 120px repeat(3, 1fr); gap: 8px;
  padding-bottom: 8px;
}

.sa-matrix-corner {
  font-size: 10px; font-style: italic; align-self: end; padding-bottom: 4px;
}

.sa-matrix-col-label {
  font-size: 11px; font-weight: 700; text-align: center;
  text-transform: uppercase; letter-spacing: 0.5px;
}

.sa-matrix-row {
  display: grid; grid-template-columns: 120px repeat(3, 1fr); gap: 8px;
  margin-bottom: 8px;
}

.sa-matrix-row-label {
  font-size: 12px; font-weight: 600;
  display: flex; flex-direction: column; gap: 2px;
  justify-content: center; padding-right: 8px;
}

.sa-matrix-cell {
  border: 1px solid; border-radius: 8px; overflow: hidden;
  cursor: pointer; transition: box-shadow 0.15s;
}

.sa-matrix-cell:hover,
.sa-matrix-cell--active {
  box-shadow: 0 0 0 2px color-mix(in srgb, currentColor 30%, transparent);
}

.sa-cell-section {
  display: flex; flex-direction: column; gap: 4px;
  transition: padding 0.2s;
}

.sa-cell-content { display: flex; flex-direction: column; gap: 4px; }

.sa-cell-heading { font-size: 12px; font-weight: 700; }
.sa-cell-body { font-size: 10px; line-height: 1.4; opacity: 0.85; }

.sa-cell-meta {
  padding: 4px 8px; font-size: 9px; font-family: monospace;
  text-align: center;
}

/* ═══════════════════════════════════════════════════════
   DIVIDER VARIANTS
   ═══════════════════════════════════════════════════════ */
.sa-divider-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
}

.sa-divider-card {
  border: 1px solid; border-radius: 10px; overflow: hidden;
  display: flex; flex-direction: column;
}

.sa-divider-header {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px;
}

.sa-divider-name { font-size: 13px; font-weight: 700; }

.sa-divider-demo {
  padding: 8px; display: flex; flex-direction: column; gap: 0;
}

.sa-stacked-section {
  display: flex; align-items: center; justify-content: center;
  padding: 12px; font-size: 10px; font-weight: 600;
}

.sa-stacked-section--above { border-radius: 4px 4px 0 0; }
.sa-stacked-section--main { min-height: 40px; }
.sa-stacked-section--below { border-radius: 0 0 4px 4px; }

.sa-divider-desc { padding: 10px 14px; font-size: 11px; line-height: 1.4; }

.sa-divider-tokens {
  display: flex; flex-direction: column; gap: 4px;
  padding: 8px 14px; border-top: 1px solid;
}

/* ═══════════════════════════════════════════════════════
   SURFACE × DIVIDER CONTEXT
   ═══════════════════════════════════════════════════════ */
.sa-ctx-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
}

.sa-ctx-card {
  border: 1px solid; border-radius: 10px; overflow: hidden;
  display: flex; flex-direction: column;
}

.sa-ctx-label {
  font-size: 12px; font-weight: 700; padding: 10px 14px;
}

.sa-ctx-stack {
  padding: 8px; display: flex; flex-direction: column;
}

.sa-ctx-section {
  display: flex; align-items: center; justify-content: center;
  padding: 16px; font-size: 10px; font-weight: 600;
}

.sa-ctx-section:first-child { border-radius: 4px 4px 0 0; }
.sa-ctx-section:last-child { border-radius: 0 0 4px 4px; }

.sa-ctx-divider-line {
  height: 0; border-top: 1px solid;
}

.sa-ctx-text { font-size: 10px; font-weight: 600; }

.sa-ctx-verdict {
  padding: 8px 14px; font-size: 10px; font-style: italic;
  line-height: 1.4;
}

/* ═══════════════════════════════════════════════════════
   EDGE SHAPES
   ═══════════════════════════════════════════════════════ */
.sa-edge-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
}

.sa-edge-card {
  border: 1px solid; border-radius: 10px; overflow: hidden;
  display: flex; flex-direction: column;
}

.sa-edge-header {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px;
}

.sa-edge-name { font-size: 13px; font-weight: 700; }

.sa-edge-demo {
  display: flex; flex-direction: column; overflow: hidden;
}

.sa-edge-section {
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}

.sa-edge-section--top {
  min-height: 80px; padding: 16px 16px 32px;
}

.sa-edge-section--bottom {
  min-height: 60px; padding: 16px;
}

.sa-edge-section span { position: relative; z-index: 1; font-size: 12px; font-weight: 700; }

.sa-edge-svg {
  position: absolute; bottom: 0; left: 0; right: 0;
  width: 100%; height: 48px;
}

.sa-edge-desc { padding: 10px 14px; font-size: 11px; line-height: 1.4; }

.sa-edge-tokens {
  display: flex; flex-direction: column; gap: 4px;
  padding: 8px 14px; border-top: 1px solid;
}

.sa-edge-css {
  font-size: 10px; font-family: monospace;
  padding: 4px 0; word-break: break-all;
}

/* ═══════════════════════════════════════════════════════
   SHARED TOKEN REF
   ═══════════════════════════════════════════════════════ */
.sa-token-ref {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
}

.sa-token-name { font-size: 10px; font-family: monospace; }
.sa-token-value { font-size: 11px; font-family: monospace; font-weight: 600; }

.sa-token-swatch {
  width: 14px; height: 14px; border-radius: 3px;
  border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
  flex-shrink: 0;
}

/* ═══════════════════════════════════════════════════════
   DEPENDENCY MAPPING
   ═══════════════════════════════════════════════════════ */
.sa-dep-tabs {
  display: flex; gap: 4px;
}

.sa-dep-tab {
  padding: 6px 14px; border-radius: 6px; border: 1px solid;
  font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all 0.15s;
}

.sa-dep-tab:hover { opacity: 0.8; }

.sa-dep-panel {
  border: 1px solid; border-radius: 12px; overflow: hidden;
  display: flex; flex-direction: column;
}

.sa-dep-preview {
  padding: 24px; display: flex; align-items: center; justify-content: center;
}

.sa-dep-content {
  max-width: 400px; display: flex; flex-direction: column; gap: 8px;
}

.sa-dep-heading { font-size: 18px; font-weight: 700; }
.sa-dep-body { font-size: 13px; line-height: 1.5; }

.sa-dep-mirror-hint {
  font-size: 11px; font-style: italic; margin-top: 4px;
}

.sa-dep-tokens {
  padding: 16px; border-top: 1px solid;
  display: flex; flex-direction: column; gap: 8px;
}

.sa-dep-section-label {
  font-size: 12px; font-weight: 700;
  display: flex; align-items: center; gap: 8px;
}

.sa-mirror-badge {
  font-size: 9px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.5px; padding: 2px 8px; border-radius: 4px;
}

.sa-dep-row {
  display: grid; grid-template-columns: 1fr auto 18px; gap: 10px;
  align-items: center; padding: 6px 0;
  border-bottom: 1px solid;
}

.sa-dep-row:last-child { border-bottom: none; }

.sa-dep-role { font-size: 11px; }
.sa-dep-token-name { font-size: 10px; font-family: monospace; }

.sa-dep-swatch {
  width: 16px; height: 16px; border-radius: 4px;
  border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
}

/* ═══════════════════════════════════════════════════════
   SECTION FLOW
   ═══════════════════════════════════════════════════════ */
.sa-flow {
  border: 1px solid; border-radius: 12px; overflow: hidden;
}

.sa-flow-section {
  position: relative; overflow: hidden;
}

.sa-flow-section--accent { }

.sa-flow-content {
  padding: 24px 32px; display: flex; flex-direction: column; gap: 4px;
  position: relative; z-index: 1;
}

.sa-flow-heading { font-size: 16px; font-weight: 700; }
.sa-flow-body { font-size: 12px; }

.sa-flow-edge {
  position: absolute; bottom: 0; left: 0; right: 0;
  width: 100%; height: 32px;
}

.sa-flow-edge--top {
  position: absolute; top: 0; bottom: auto;
  height: 24px;
}

/* ═══════════════════════════════════════════════════════
   ANATOMY
   ═══════════════════════════════════════════════════════ */
.sa-anatomy {
  border: 1px solid; border-radius: 10px; padding: 16px;
  display: flex; flex-direction: column; gap: 8px;
}

.sa-anatomy-row {
  display: flex; align-items: center; gap: 10px;
}

.sa-anatomy-row--child { padding-left: 20px; }
.sa-anatomy-row--grandchild { padding-left: 40px; }

.sa-anatomy-el { font-size: 12px; font-family: monospace; font-weight: 600; }
.sa-anatomy-desc { font-size: 11px; }

.sa-anatomy-divider {
  height: 0; border-top: 1px dashed; margin: 4px 0;
}

.sa-anatomy-note {
  font-size: 11px; line-height: 1.5;
}

.sa-anatomy-note code {
  font-size: 10px; font-weight: 600;
  background: color-mix(in srgb, currentColor 10%, transparent);
  padding: 1px 4px; border-radius: 3px;
}

/* ═══════════════════════════════════════════════════════
   LAYOUT CASCADE
   ═══════════════════════════════════════════════════════ */
.sa-cascade-chain {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
}

.sa-cascade-node {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; border: 1px solid; border-radius: 8px;
  font-size: 12px; font-weight: 600;
}

.sa-cascade-node--active { font-weight: 700; }

.sa-cascade-name { white-space: nowrap; }

.sa-cascade-count {
  font-size: 10px; font-variant-numeric: tabular-nums;
  padding: 1px 6px; border-radius: 4px;
}

.sa-conflicts { display: flex; flex-direction: column; gap: 8px; }

.sa-conflict-card {
  border: 1px solid; border-radius: 10px; padding: 12px;
  display: flex; flex-direction: column; gap: 4px;
}

.sa-conflict-header {
  display: flex; align-items: center; gap: 6px;
}

.sa-conflict-label { font-size: 12px; font-weight: 700; }
.sa-conflict-msg { font-size: 11px; line-height: 1.4; margin: 0; }

.sa-ctx-notes { display: flex; flex-direction: column; gap: 4px; }

.sa-ctx-note {
  display: flex; align-items: flex-start; gap: 6px;
  padding: 8px 12px; border-radius: 6px;
  font-size: 11px; line-height: 1.4;
}

.sa-ctx-note svg { flex-shrink: 0; margin-top: 1px; }
</style>
