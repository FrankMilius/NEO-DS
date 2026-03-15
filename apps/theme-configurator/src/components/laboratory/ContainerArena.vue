<template>
  <div class="container-arena">

    <!-- ═══════════════════════════════════════════════════════════════
         BREITEN-VARIANTEN
         ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Breiten-Varianten</span>
    </div>

    <p class="ca-intro" :style="{ color: t['text-secondary'] }">
      Der Container begrenzt die maximale Breite und zentriert den Inhalt horizontal.
      Fluid Padding skaliert via <code :style="{ color: t['interactive-default'] }">clamp()</code> von 16px (Mobile) bis 48px (Desktop).
      Ab XXL entfaellt das Padding zugunsten von max-width.
    </p>

    <div class="ca-variants">
      <div
        v-for="variant in widthVariants"
        :key="variant.id"
        class="ca-variant-card"
        :style="{ borderColor: t['border-secondary'] }"
      >
        <div class="ca-variant-header" :style="{ borderColor: t['border-secondary'] }">
          <span class="ca-variant-name" :style="{ color: t['text-primary'] }">{{ variant.label }}</span>
          <code v-if="variant.modifier" class="ca-variant-modifier" :style="{ color: t['interactive-default'] }">{{ variant.modifier }}</code>
          <span v-else class="ca-variant-default-badge" :style="{ background: t['interactive-default'], color: t['text-on-interactive'] }">Default</span>
        </div>
        <div class="ca-variant-desc" :style="{ color: t['text-secondary'] }">{{ variant.description }}</div>

        <!-- Schematic -->
        <div class="ca-schematic" :style="{ background: t['background-secondary'] }">
          <div class="ca-viewport">
            <span class="ca-viewport-label" :style="{ color: t['text-tertiary'] }">Viewport</span>
            <div
              class="ca-container-box"
              :style="{
                maxWidth: variant.schematicWidth,
                borderColor: t['interactive-default'],
                background: `color-mix(in srgb, ${t['interactive-default']} 8%, transparent)`
              }"
            >
              <div v-if="variant.showPadding" class="ca-padding-zone" :style="paddingZoneStyle">
                <span class="ca-padding-label" :style="{ color: t['text-tertiary'] }">P</span>
              </div>
              <div class="ca-content-area">
                <div class="ca-content-block" :style="{ background: t['interactive-default'], opacity: 0.3 }"></div>
                <div class="ca-content-block ca-content-block--sm" :style="{ background: t['interactive-default'], opacity: 0.2 }"></div>
                <div class="ca-content-block ca-content-block--xs" :style="{ background: t['interactive-default'], opacity: 0.15 }"></div>
              </div>
              <div v-if="variant.showPadding" class="ca-padding-zone" :style="paddingZoneStyle">
                <span class="ca-padding-label" :style="{ color: t['text-tertiary'] }">P</span>
              </div>
            </div>
            <div class="ca-dimension" :style="{ color: t['text-tertiary'] }">
              <div class="ca-dimension-line" :style="{ borderColor: t['text-tertiary'] }"></div>
              <span class="ca-dimension-value">{{ variant.dimensionLabel }}</span>
              <div class="ca-dimension-line" :style="{ borderColor: t['text-tertiary'] }"></div>
            </div>
          </div>
        </div>

        <div class="ca-variant-tokens" :style="{ borderColor: t['border-secondary'] }">
          <div v-for="tok in variant.tokens" :key="tok.name" class="ca-token-ref">
            <code class="ca-token-name" :style="{ color: t['text-tertiary'] }">{{ tok.name }}</code>
            <code class="ca-token-value" :style="{ color: t['interactive-default'] }">{{ tok.value }}</code>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         VERTICAL SPACING
         ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Vertical Spacing</span>
    </div>

    <p class="ca-intro" :style="{ color: t['text-secondary'] }">
      Vertikales Padding (padding-block) definiert den Abstand zur umgebenden Section oder Shell.
      Alle Stufen nutzen <code :style="{ color: t['interactive-default'] }">clamp()</code> fuer Fluid-Skalierung.
    </p>

    <div class="ca-vspace-grid">
      <div
        v-for="vs in vspaceVariants"
        :key="vs.id"
        class="ca-vspace-card"
        :style="{ borderColor: t['border-secondary'] }"
      >
        <div class="ca-vspace-header">
          <span class="ca-vspace-name" :style="{ color: t['text-primary'] }">{{ vs.label }}</span>
          <code v-if="vs.modifier" class="ca-variant-modifier" :style="{ color: t['interactive-default'] }">{{ vs.modifier }}</code>
          <span v-else class="ca-variant-default-badge" :style="{ background: t['interactive-default'], color: t['text-on-interactive'] }">Default</span>
        </div>

        <!-- Visual: Container with top/bottom padding zones -->
        <div class="ca-vspace-schema" :style="{ background: t['background-secondary'] }">
          <div class="ca-vspace-box" :style="{ borderColor: t['interactive-default'] }">
            <div
              v-if="vs.paddingPx > 0"
              class="ca-vspace-zone ca-vspace-zone--top"
              :style="{ height: vs.paddingPx + 'px', background: `color-mix(in srgb, ${t['feedback-success-background'] || '#10b981'} 15%, transparent)` }"
            >
              <span class="ca-vspace-dim" :style="{ color: t['text-tertiary'] }">{{ vs.value }}</span>
            </div>
            <div class="ca-vspace-content" :style="{ background: `color-mix(in srgb, ${t['interactive-default']} 15%, transparent)` }">
              <span :style="{ color: t['text-tertiary'], fontSize: '10px' }">Inhalt</span>
            </div>
            <div
              v-if="vs.paddingPx > 0"
              class="ca-vspace-zone ca-vspace-zone--bottom"
              :style="{ height: vs.paddingPx + 'px', background: `color-mix(in srgb, ${t['feedback-success-background'] || '#10b981'} 15%, transparent)` }"
            >
              <span class="ca-vspace-dim" :style="{ color: t['text-tertiary'] }">{{ vs.value }}</span>
            </div>
          </div>
        </div>

        <div class="ca-vspace-footer" :style="{ color: t['text-secondary'] }">{{ vs.description }}</div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         ALIGNMENT
         ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Alignment</span>
    </div>

    <p class="ca-intro" :style="{ color: t['text-secondary'] }">
      Standardmaessig ist der Container zentriert (<code :style="{ color: t['interactive-default'] }">margin-inline: auto</code>).
      In Sidebar- oder Dashboard-Layouts wird oft links- oder rechtsbuendige Ausrichtung benoetigt.
    </p>

    <div class="ca-align-grid">
      <div
        v-for="al in alignVariants"
        :key="al.id"
        class="ca-align-card"
        :style="{ borderColor: t['border-secondary'] }"
      >
        <div class="ca-align-header">
          <span class="ca-align-name" :style="{ color: t['text-primary'] }">{{ al.label }}</span>
          <code v-if="al.modifier" class="ca-variant-modifier" :style="{ color: t['interactive-default'] }">{{ al.modifier }}</code>
          <span v-else class="ca-variant-default-badge" :style="{ background: t['interactive-default'], color: t['text-on-interactive'] }">Default</span>
        </div>

        <div class="ca-align-schema" :style="{ background: t['background-secondary'] }">
          <div class="ca-align-viewport">
            <div
              class="ca-align-box"
              :style="{
                borderColor: t['interactive-default'],
                background: `color-mix(in srgb, ${t['interactive-default']} 12%, transparent)`,
                marginInlineStart: al.marginStart,
                marginInlineEnd: al.marginEnd
              }"
            >
              <div class="ca-content-block" :style="{ background: t['interactive-default'], opacity: 0.25 }"></div>
              <div class="ca-content-block ca-content-block--sm" :style="{ background: t['interactive-default'], opacity: 0.15 }"></div>
            </div>
          </div>
        </div>

        <div class="ca-align-css" :style="{ color: t['text-tertiary'], borderColor: t['border-secondary'] }">
          <code>margin-inline: {{ al.marginStart }} {{ al.marginEnd }}</code>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         SURFACE CONTAINER
         ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Surface Container</span>
    </div>

    <p class="ca-intro" :style="{ color: t['text-secondary'] }">
      Obwohl Container meist transparent sind, erlaubt die Surface-Variante Hintergrundfarbe, Schatten und Radius
      auf Layout-Ebene — aehnlich einer Card, aber als strukturelles Element. Ideal fuer hervorgehobene Inhaltsbereiche.
    </p>

    <div class="ca-surface-compare">
      <!-- Transparent (Default) -->
      <div class="ca-surface-card" :style="{ borderColor: t['border-secondary'] }">
        <div class="ca-surface-header">
          <span class="ca-surface-name" :style="{ color: t['text-primary'] }">Transparent</span>
          <span class="ca-variant-default-badge" :style="{ background: t['interactive-default'], color: t['text-on-interactive'] }">Default</span>
        </div>
        <div class="ca-surface-demo" :style="{ background: t['background-base'] }">
          <div class="ca-surface-container ca-surface-container--transparent" :style="{ borderColor: `color-mix(in srgb, ${t['interactive-default']} 30%, transparent)` }">
            <div class="ca-surface-inner">
              <div class="ca-content-block" :style="{ background: t['interactive-default'], opacity: 0.2 }"></div>
              <div class="ca-content-block ca-content-block--sm" :style="{ background: t['interactive-default'], opacity: 0.12 }"></div>
            </div>
          </div>
        </div>
        <div class="ca-surface-desc" :style="{ color: t['text-secondary'] }">Kein Hintergrund — Inhalt steht direkt auf der Page-Surface.</div>
      </div>

      <!-- Elevated Surface -->
      <div class="ca-surface-card" :style="{ borderColor: t['border-secondary'] }">
        <div class="ca-surface-header">
          <span class="ca-surface-name" :style="{ color: t['text-primary'] }">Elevated Surface</span>
          <code class="ca-variant-modifier" :style="{ color: t['interactive-default'] }">.nc-container--surface</code>
        </div>
        <div class="ca-surface-demo" :style="{ background: t['background-secondary'] }">
          <div
            class="ca-surface-container ca-surface-container--elevated"
            :style="{
              background: surfaceBg,
              borderRadius: surfaceRadius,
              boxShadow: surfaceShadow,
              padding: '20px'
            }"
          >
            <div class="ca-surface-inner">
              <div class="ca-content-block" :style="{ background: t['interactive-default'], opacity: 0.2 }"></div>
              <div class="ca-content-block ca-content-block--sm" :style="{ background: t['interactive-default'], opacity: 0.12 }"></div>
            </div>
          </div>
        </div>
        <div class="ca-surface-tokens" :style="{ borderColor: t['border-secondary'] }">
          <div class="ca-token-ref">
            <code class="ca-token-name" :style="{ color: t['text-tertiary'] }">--nc-container-surface-bg</code>
            <code class="ca-token-value" :style="{ color: t['interactive-default'] }">{{ tokenVal('nc-container-surface-bg') }}</code>
          </div>
          <div class="ca-token-ref">
            <code class="ca-token-name" :style="{ color: t['text-tertiary'] }">--nc-container-surface-radius</code>
            <code class="ca-token-value" :style="{ color: t['interactive-default'] }">{{ tokenVal('nc-container-surface-radius') }}</code>
          </div>
          <div class="ca-token-ref">
            <code class="ca-token-name" :style="{ color: t['text-tertiary'] }">--nc-container-surface-shadow</code>
            <code class="ca-token-value" :style="{ color: t['interactive-default'] }">{{ tokenVal('nc-container-surface-shadow') }}</code>
          </div>
          <div class="ca-token-ref">
            <code class="ca-token-name" :style="{ color: t['text-tertiary'] }">--nc-container-surface-padding</code>
            <code class="ca-token-value" :style="{ color: t['interactive-default'] }">{{ tokenVal('nc-container-surface-padding') }}</code>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         FLUID TOKENS
         ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Fluid Token Formeln</span>
    </div>

    <p class="ca-intro" :style="{ color: t['text-secondary'] }">
      Container-Tokens nutzen <code :style="{ color: t['interactive-default'] }">clamp(min, preferred, max)</code> fuer Viewport-responsive Skalierung ohne Media Queries.
    </p>

    <div class="ca-fluid-table" :style="{ borderColor: t['border-secondary'] }">
      <div class="ca-fluid-row ca-fluid-row--header" :style="{ borderColor: t['border-secondary'], color: t['text-secondary'] }">
        <span class="ca-fluid-cell ca-fluid-cell--token">Token</span>
        <span class="ca-fluid-cell">Min</span>
        <span class="ca-fluid-cell">Preferred</span>
        <span class="ca-fluid-cell">Max</span>
      </div>
      <div v-for="fluid in fluidTokens" :key="fluid.token" class="ca-fluid-row" :style="{ borderColor: t['border-secondary'] }">
        <code class="ca-fluid-cell ca-fluid-cell--token" :style="{ color: t['text-primary'] }">{{ fluid.token }}</code>
        <span class="ca-fluid-cell" :style="{ color: t['interactive-default'] }">{{ fluid.min }}</span>
        <span class="ca-fluid-cell" :style="{ color: t['text-tertiary'] }">{{ fluid.preferred }}</span>
        <span class="ca-fluid-cell" :style="{ color: t['interactive-default'] }">{{ fluid.max }}</span>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         RESPONSIVE VERHALTEN
         ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Responsive Verhalten</span>
    </div>

    <div class="ca-responsive-grid">
      <div v-for="bp in breakpoints" :key="bp.label" class="ca-responsive-card" :style="{ borderColor: t['border-secondary'] }">
        <div class="ca-responsive-header">
          <span class="ca-responsive-label" :style="{ color: t['text-primary'] }">{{ bp.label }}</span>
          <code class="ca-responsive-bp" :style="{ color: t['text-tertiary'] }">{{ bp.range }}</code>
        </div>
        <div class="ca-responsive-schema" :style="{ background: t['background-secondary'] }">
          <div class="ca-resp-viewport" :style="{ width: bp.vpWidth + 'px' }">
            <div class="ca-resp-container" :style="{ borderColor: t['interactive-default'], width: bp.containerWidth }">
              <div v-if="bp.paddingWidth" class="ca-resp-padding" :style="{ width: bp.paddingWidth + 'px', background: `color-mix(in srgb, ${t['interactive-default']} 12%, transparent)` }"></div>
              <div class="ca-resp-content" :style="{ background: `color-mix(in srgb, ${t['interactive-default']} 25%, transparent)` }"></div>
              <div v-if="bp.paddingWidth" class="ca-resp-padding" :style="{ width: bp.paddingWidth + 'px', background: `color-mix(in srgb, ${t['interactive-default']} 12%, transparent)` }"></div>
            </div>
          </div>
        </div>
        <span class="ca-responsive-desc" :style="{ color: t['text-secondary'] }">{{ bp.desc }}</span>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         FULL-BLEED + ANATOMY
         ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">Full-Bleed Pattern</span>
    </div>

    <div class="ca-fullbleed-schema" :style="{ background: t['background-secondary'], borderColor: t['border-secondary'] }">
      <div class="ca-fb-viewport">
        <div class="ca-fb-container" :style="{ borderColor: t['interactive-default'] }">
          <div class="ca-fb-block" :style="{ background: `color-mix(in srgb, ${t['interactive-default']} 20%, transparent)` }">
            <span :style="{ color: t['text-tertiary'] }">Regulaerer Inhalt</span>
          </div>
          <div class="ca-fb-bleed" :style="{ background: `color-mix(in srgb, ${t['feedback-success-background'] || '#10b981'} 20%, transparent)`, borderColor: `color-mix(in srgb, ${t['feedback-success-background'] || '#10b981'} 40%, transparent)` }">
            <span :style="{ color: t['text-primary'] }">Full-Bleed (Hero)</span>
            <span class="ca-fb-bleed-note" :style="{ color: t['text-tertiary'] }">margin-inline: calc(-1 * var(--container-pad))</span>
          </div>
          <div class="ca-fb-block" :style="{ background: `color-mix(in srgb, ${t['interactive-default']} 20%, transparent)` }">
            <span :style="{ color: t['text-tertiary'] }">Regulaerer Inhalt</span>
          </div>
        </div>
      </div>
    </div>

    <div class="arena-category-divider">
      <span class="arena-category-label">Anatomy</span>
    </div>

    <div class="ca-anatomy" :style="{ background: t['background-secondary'], borderColor: t['border-secondary'] }">
      <div class="ca-anatomy-row">
        <code class="ca-anatomy-el" :style="{ color: t['interactive-default'] }">.nc-container</code>
        <span class="ca-anatomy-desc" :style="{ color: t['text-secondary'] }">Root-Element — zentriert Inhalt, begrenzt max-width</span>
      </div>
      <div class="ca-anatomy-row ca-anatomy-row--child">
        <code class="ca-anatomy-el" :style="{ color: t['text-tertiary'] }">*</code>
        <span class="ca-anatomy-desc" :style="{ color: t['text-secondary'] }">Beliebiger Inhalt (Slot: content)</span>
      </div>
      <div class="ca-anatomy-divider" :style="{ borderColor: t['border-secondary'] }"></div>
      <div class="ca-anatomy-row">
        <span class="ca-anatomy-note" :style="{ color: t['text-tertiary'] }">Container ist ein reines Layout-Element ohne semantische Rolle. Surface-Container sollten als &lt;section&gt; oder &lt;article&gt; mit aria-label genutzt werden.</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { componentTokenGroups } from '../../data/tokens.js'
import { useRecipeLoader } from '../../composables/useRecipeLoader.js'

const store = useThemeStore()
const { recipe } = useRecipeLoader('container')

const activeThemeMode = computed(() => store.state.previewMode === 'split' ? 'light' : store.state.previewMode)
const t = computed(() => store.state.themes[store.state.activeThemeSet][activeThemeMode.value])

// Resolve token value with override support
function tokenVal(id) {
  const group = componentTokenGroups.find(c => c.id === 'container')
  if (!group) return ''
  const tok = group.tokens.find(t => t.id === id)
  if (!tok) return ''
  const override = store.currentComponentOverrides.value[id]
  return override !== undefined ? override : tok.default
}

const maxWidth = computed(() => tokenVal('nc-container-max-width') || '1200px')
const maxWidthWide = computed(() => tokenVal('nc-container-max-width-wide') || '1440px')
const paddingInlineVal = computed(() => tokenVal('nc-container-padding-inline') || 'clamp(16px, 3.5vw, 48px)')
const surfaceBg = computed(() => tokenVal('nc-container-surface-bg') || 'var(--fnd-color-surface-elevated)')
const surfaceRadius = computed(() => tokenVal('nc-container-surface-radius') || 'var(--fnd-radius-md)')
const surfaceShadow = computed(() => tokenVal('nc-container-surface-shadow') || 'var(--fnd-shadow-sm)')

const paddingZoneStyle = computed(() => ({
  width: '48px',
  background: `color-mix(in srgb, ${t.value['feedback-success-background'] || '#10b981'} 15%, transparent)`,
  borderColor: `color-mix(in srgb, ${t.value['feedback-success-background'] || '#10b981'} 30%, transparent)`
}))

// ── Width Variants ──
const widthVariants = computed(() => {
  const axes = recipe.value?.axes?.width?.values || {}
  return [
    { id: 'standard', label: 'Standard', modifier: null, description: axes.standard?.description || 'Standard-Container: max-width 1200px.', schematicWidth: '80%', dimensionLabel: maxWidth.value, showPadding: true, tokens: [{ name: '--nc-container-max-width', value: maxWidth.value }, { name: '--nc-container-padding-inline', value: paddingInlineVal.value }] },
    { id: 'wide', label: 'Wide', modifier: '.nc-container--wide', description: axes.wide?.description || 'Breiter Container: max-width 1440px.', schematicWidth: '92%', dimensionLabel: maxWidthWide.value, showPadding: true, tokens: [{ name: '--nc-container-max-width-wide', value: maxWidthWide.value }, { name: '--nc-container-padding-inline', value: paddingInlineVal.value }] },
    { id: 'narrow', label: 'Narrow', modifier: '.nc-container--narrow', description: axes.narrow?.description || 'Schmaler Container: max-width 768px.', schematicWidth: '55%', dimensionLabel: '768px', showPadding: true, tokens: [{ name: 'max-width', value: '768px' }, { name: '--nc-container-padding-inline', value: paddingInlineVal.value }] },
    { id: 'full', label: 'Full', modifier: '.nc-container--full', description: axes.full?.description || 'Volle Breite ohne max-width Begrenzung.', schematicWidth: '100%', dimensionLabel: '100%', showPadding: false, tokens: [{ name: 'max-width', value: 'none' }] }
  ]
})

// ── Vertical Spacing Variants ──
const vspaceVariants = computed(() => [
  { id: 'none', label: 'None', modifier: null, value: '0', paddingPx: 0, description: 'Kein vertikales Padding (Standard).' },
  { id: 'sm', label: 'SM', modifier: '.nc-container--vspace-sm', value: tokenVal('nc-container-padding-block-sm') || 'clamp(16px, 2vw, 24px)', paddingPx: 12, description: 'Kleiner vertikaler Abstand: 16px – 24px (fluid).' },
  { id: 'md', label: 'MD', modifier: '.nc-container--vspace-md', value: tokenVal('nc-container-padding-block-md') || 'clamp(32px, 4vw, 48px)', paddingPx: 24, description: 'Mittlerer vertikaler Abstand: 32px – 48px (fluid).' },
  { id: 'lg', label: 'LG', modifier: '.nc-container--vspace-lg', value: tokenVal('nc-container-padding-block-lg') || 'clamp(48px, 6vw, 80px)', paddingPx: 40, description: 'Grosser vertikaler Abstand: 48px – 80px (fluid).' }
])

// ── Alignment Variants ──
const alignVariants = computed(() => [
  { id: 'center', label: 'Center', modifier: null, marginStart: 'auto', marginEnd: 'auto', description: 'Zentriert (Standard).' },
  { id: 'start', label: 'Start (Links)', modifier: '.nc-container--align-start', marginStart: '0', marginEnd: 'auto', description: 'Linksbuendig — ideal fuer Sidebars.' },
  { id: 'end', label: 'End (Rechts)', modifier: '.nc-container--align-end', marginStart: 'auto', marginEnd: '0', description: 'Rechtsbuendig — fuer asymmetrische Layouts.' }
])

// ── Fluid Token Reference ──
const fluidTokens = computed(() => [
  { token: '--nc-container-padding-inline', min: '16px', preferred: '3.5vw', max: '48px' },
  { token: '--nc-container-padding-block-sm', min: '16px', preferred: '2vw', max: '24px' },
  { token: '--nc-container-padding-block-md', min: '32px', preferred: '4vw', max: '48px' },
  { token: '--nc-container-padding-block-lg', min: '48px', preferred: '6vw', max: '80px' },
  { token: '--nc-container-surface-padding', min: '16px', preferred: '3vw', max: '32px' }
])

// ── Breakpoints ──
const breakpoints = [
  { label: 'Mobile', range: '< 768px', vpWidth: 60, containerWidth: '100%', paddingWidth: 4, desc: 'Padding: 16px — volle Breite.' },
  { label: 'Tablet', range: '768 – 1200px', vpWidth: 100, containerWidth: '100%', paddingWidth: 8, desc: 'Padding: ~28px (fluid).' },
  { label: 'Desktop', range: '1200 – 1920px', vpWidth: 160, containerWidth: '70%', paddingWidth: 10, desc: 'Padding: 48px — max-width greift.' },
  { label: 'XXL', range: '> 1920px', vpWidth: 200, containerWidth: '50%', paddingWidth: 0, desc: 'Kein Padding — reines max-width.' }
]
</script>

<style scoped>
.container-arena {
  padding: 24px; display: flex; flex-direction: column; gap: 24px;
}

.ca-intro { font-size: 13px; line-height: 1.6; margin: 0; }
.ca-intro code { font-size: 12px; font-weight: 600; }

/* ── Variant Cards ── */
.ca-variants { display: flex; flex-direction: column; gap: 24px; }

.ca-variant-card { border: 1px solid; border-radius: 12px; overflow: hidden; }

.ca-variant-header {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; border-bottom: 1px solid;
}

.ca-variant-name { font-size: 15px; font-weight: 700; }

.ca-variant-modifier {
  font-size: 11px; font-family: monospace; font-weight: 600;
  padding: 2px 8px; border-radius: 4px;
  background: color-mix(in srgb, currentColor 10%, transparent);
}

.ca-variant-default-badge {
  font-size: 9px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.5px; padding: 2px 8px; border-radius: 4px;
}

.ca-variant-desc { padding: 10px 16px; font-size: 12px; line-height: 1.5; }

/* ── Schematic ── */
.ca-schematic { padding: 24px 16px; display: flex; justify-content: center; }

.ca-viewport {
  width: 100%; max-width: 500px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}

.ca-viewport-label {
  font-size: 9px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.5px; align-self: flex-end;
}

.ca-container-box {
  width: 100%; display: flex; align-items: stretch;
  min-height: 60px; border: 2px dashed; border-radius: 6px;
  margin: 0 auto; transition: max-width 0.3s;
}

.ca-padding-zone {
  display: flex; align-items: center; justify-content: center;
  min-width: 16px; flex-shrink: 0;
  border-inline: 1px dashed;
}

.ca-padding-label {
  font-size: 9px; font-weight: 700; text-transform: uppercase;
  writing-mode: vertical-rl; letter-spacing: 1px;
}

.ca-content-area { flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; }
.ca-content-block { height: 12px; border-radius: 3px; }
.ca-content-block--sm { width: 75%; height: 10px; }
.ca-content-block--xs { width: 50%; height: 8px; }

.ca-dimension {
  display: flex; align-items: center; gap: 6px;
  font-size: 10px; font-family: monospace; font-weight: 600;
  width: 100%; max-width: 300px;
}

.ca-dimension-line { flex: 1; height: 0; border-top: 1px dashed; }
.ca-dimension-value { white-space: nowrap; }

.ca-variant-tokens {
  display: flex; flex-direction: column; gap: 4px;
  padding: 10px 16px; border-top: 1px solid;
}

.ca-token-ref { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.ca-token-name { font-size: 10px; font-family: monospace; }
.ca-token-value { font-size: 11px; font-family: monospace; font-weight: 600; }

/* ── Vertical Spacing ── */
.ca-vspace-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
}

.ca-vspace-card {
  border: 1px solid; border-radius: 10px; overflow: hidden;
  display: flex; flex-direction: column;
}

.ca-vspace-header {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px;
}

.ca-vspace-name { font-size: 13px; font-weight: 700; }

.ca-vspace-schema {
  padding: 12px; display: flex; justify-content: center; flex: 1;
}

.ca-vspace-box {
  width: 100%; border: 1px dashed; border-radius: 4px;
  display: flex; flex-direction: column;
  overflow: hidden;
}

.ca-vspace-zone {
  display: flex; align-items: center; justify-content: center;
  min-height: 4px; transition: height 0.3s;
}

.ca-vspace-dim { font-size: 8px; font-family: monospace; font-weight: 600; }

.ca-vspace-content {
  flex: 1; min-height: 28px;
  display: flex; align-items: center; justify-content: center;
  padding: 4px;
}

.ca-vspace-footer { padding: 10px 14px; font-size: 11px; line-height: 1.4; }

/* ── Alignment ── */
.ca-align-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
}

.ca-align-card {
  border: 1px solid; border-radius: 10px; overflow: hidden;
}

.ca-align-header {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px;
}

.ca-align-name { font-size: 13px; font-weight: 700; }

.ca-align-schema {
  padding: 12px; display: flex; justify-content: center;
}

.ca-align-viewport {
  width: 100%; border: 1px solid rgba(128,128,128,0.2); border-radius: 4px;
  padding: 8px; min-height: 50px; display: flex;
}

.ca-align-box {
  width: 60%; border: 1px dashed; border-radius: 4px;
  padding: 8px; display: flex; flex-direction: column; gap: 4px;
}

.ca-align-css {
  padding: 8px 14px; font-size: 10px; font-family: monospace;
  border-top: 1px solid;
}

/* ── Surface ── */
.ca-surface-compare {
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
}

.ca-surface-card {
  border: 1px solid; border-radius: 12px; overflow: hidden;
}

.ca-surface-header {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px;
}

.ca-surface-name { font-size: 14px; font-weight: 700; }

.ca-surface-demo {
  padding: 24px; display: flex; justify-content: center;
}

.ca-surface-container {
  width: 80%; min-height: 60px;
}

.ca-surface-container--transparent {
  border: 2px dashed; border-radius: 8px;
}

.ca-surface-container--elevated {
  border: none;
}

.ca-surface-inner {
  display: flex; flex-direction: column; gap: 6px; padding: 12px;
}

.ca-surface-desc { padding: 10px 16px; font-size: 12px; line-height: 1.5; }

.ca-surface-tokens {
  display: flex; flex-direction: column; gap: 4px;
  padding: 10px 16px; border-top: 1px solid;
}

/* ── Fluid Token Table ── */
.ca-fluid-table {
  border: 1px solid; border-radius: 10px; overflow: hidden;
}

.ca-fluid-row {
  display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 8px; padding: 8px 14px; border-bottom: 1px solid;
}

.ca-fluid-row:last-child { border-bottom: none; }

.ca-fluid-row--header {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.3px;
}

.ca-fluid-cell { font-size: 11px; font-family: monospace; }
.ca-fluid-cell--token { font-weight: 600; }

/* ── Responsive ── */
.ca-responsive-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;
}

.ca-responsive-card {
  display: flex; flex-direction: column; border: 1px solid; border-radius: 10px; overflow: hidden;
}

.ca-responsive-header {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
}

.ca-responsive-label { font-size: 13px; font-weight: 700; }
.ca-responsive-bp { font-size: 10px; font-family: monospace; margin-left: auto; }

.ca-responsive-schema { padding: 16px; display: flex; justify-content: center; }

.ca-resp-viewport {
  border: 1px solid rgba(128,128,128,0.2); border-radius: 4px;
  display: flex; justify-content: center; padding: 8px;
}

.ca-resp-container {
  display: flex; border: 1px dashed; border-radius: 3px; min-height: 32px;
}

.ca-resp-padding { flex-shrink: 0; }
.ca-resp-content { flex: 1; min-height: 28px; border-radius: 2px; }

.ca-responsive-desc { padding: 10px 14px; font-size: 11px; line-height: 1.4; }

/* ── Full-Bleed ── */
.ca-fullbleed-schema { border: 1px solid; border-radius: 10px; padding: 20px; }
.ca-fb-viewport { display: flex; justify-content: center; }

.ca-fb-container {
  width: 70%; max-width: 400px; border: 2px dashed; border-radius: 6px;
  display: flex; flex-direction: column; overflow: visible;
}

.ca-fb-block {
  padding: 14px 16px; font-size: 11px; text-align: center;
  border-radius: 4px; margin: 8px 12px;
}

.ca-fb-bleed {
  padding: 16px; text-align: center; font-size: 12px; font-weight: 600;
  border-top: 1px dashed; border-bottom: 1px dashed;
  margin-left: -22px; margin-right: -22px;
  display: flex; flex-direction: column; gap: 4px;
}

.ca-fb-bleed-note { font-size: 9px; font-weight: 400; font-family: monospace; }

/* ── Anatomy ── */
.ca-anatomy {
  border: 1px solid; border-radius: 10px; padding: 16px;
  display: flex; flex-direction: column; gap: 8px;
}

.ca-anatomy-row { display: flex; align-items: center; gap: 12px; }
.ca-anatomy-row--child { padding-left: 24px; }
.ca-anatomy-el { font-size: 12px; font-family: monospace; font-weight: 600; }
.ca-anatomy-desc { font-size: 12px; }
.ca-anatomy-note { font-size: 11px; font-style: italic; line-height: 1.5; }
.ca-anatomy-divider { border-top: 1px dashed; margin: 4px 0; }

/* ── Arena category divider ── */
.arena-category-divider {
  display: flex; align-items: center; gap: 12px; padding: 4px 0;
}

.arena-category-divider::after {
  content: ''; flex: 1; height: 1px; background: var(--cfg-border);
}

.arena-category-label {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.8px; color: var(--cfg-text-muted); white-space: nowrap;
}
</style>
