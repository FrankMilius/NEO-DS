<template>
  <div class="component-arena" style="position: relative;">
    <div v-if="isHighlighted" class="arena-highlight-overlay" :style="highlightStyle"></div>

    <!-- Grid-Toggle -->
    <div class="arena-toolbar">
      <label class="arena-toggle-label">
        <input type="checkbox" v-model="showGrid" />
        <span>Grid-Kontext</span>
      </label>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Live Preview                                                    -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="arena-category-divider">
      <span class="arena-category-label">{{ activeRecipe.label }}</span>
    </div>
    <div class="arena-specimen">
      <span class="arena-specimen__label">{{ activeRecipe.description }}</span>
      <!-- Split View -->
      <div v-if="isSplit" class="arena-specimen__pair">
        <div class="arena-specimen__panel arena-specimen__panel--light" :style="panelStyle(tLight)">
          <div v-if="showGrid && activeRecipe.grid" :class="activeRecipe.grid" v-html="repeatedHtml"></div>
          <div v-else v-html="activeRecipe.html"></div>
        </div>
        <div class="arena-specimen__panel" :style="panelStyle(tDark)">
          <div v-if="showGrid && activeRecipe.grid" :class="activeRecipe.grid" v-html="repeatedHtml"></div>
          <div v-else v-html="activeRecipe.html"></div>
        </div>
      </div>
      <!-- Single View -->
      <div v-else class="arena-specimen__single">
        <div class="arena-specimen__panel arena-specimen__panel--full" :style="panelStyle(activeTheme)">
          <div v-if="showGrid && activeRecipe.grid" :class="activeRecipe.grid" v-html="repeatedHtml"></div>
          <div v-else v-html="activeRecipe.html"></div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Status-Varianten (nur bei Status-Rezepten)                    -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <template v-if="activeRecipe.statusLevels">
      <div class="arena-category-divider">
        <span class="arena-category-label">Status-Varianten</span>
      </div>
      <div class="arena-specimen">
        <span class="arena-specimen__label">{{ activeRecipe.statusLevels.join(' · ') }}</span>
        <div v-if="isSplit" class="arena-specimen__pair">
          <div class="arena-specimen__panel arena-specimen__panel--light" :style="panelStyle(tLight)">
            <div :class="showGrid ? 'nc-card-grid' : 'arena-card-status-row'">
              <div v-for="level in activeRecipe.statusLevels" :key="level"
                v-html="activeRecipe.html.replace('status-success', 'status-' + level).replace('Erfolgreich', level).replace('Alle Tests bestanden', 'Status: ' + level).replace('€ 1.2M', level)"></div>
            </div>
          </div>
          <div class="arena-specimen__panel" :style="panelStyle(tDark)">
            <div :class="showGrid ? 'nc-card-grid' : 'arena-card-status-row'">
              <div v-for="level in activeRecipe.statusLevels" :key="level"
                v-html="activeRecipe.html.replace('status-success', 'status-' + level).replace('Erfolgreich', level).replace('Alle Tests bestanden', 'Status: ' + level).replace('€ 1.2M', level)"></div>
            </div>
          </div>
        </div>
        <div v-else class="arena-specimen__single">
          <div class="arena-specimen__panel arena-specimen__panel--full" :style="panelStyle(activeTheme)">
            <div :class="showGrid ? 'nc-card-grid' : 'arena-card-status-row'">
              <div v-for="level in activeRecipe.statusLevels" :key="level"
                v-html="activeRecipe.html.replace('status-success', 'status-' + level).replace('Erfolgreich', level).replace('Alle Tests bestanden', 'Status: ' + level).replace('€ 1.2M', level)"></div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- States Preview (hover, focus, selected, disabled)             -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <template v-if="activeRecipe.states && activeRecipe.states.length">
      <div class="arena-category-divider">
        <span class="arena-category-label">States</span>
      </div>
      <div class="arena-specimen">
        <span class="arena-specimen__label">{{ activeRecipe.states.join(' · ') }}</span>
        <div v-if="isSplit" class="arena-specimen__pair">
          <div class="arena-specimen__panel arena-specimen__panel--light" :style="panelStyle(tLight)">
            <div class="arena-card-states-info">
              States werden durch die echten CSS-Klassen aus styles.css gesteuert.
              Interagiere direkt mit der Card oben.
            </div>
          </div>
          <div class="arena-specimen__panel" :style="panelStyle(tDark)">
            <div class="arena-card-states-info">
              States: {{ activeRecipe.states.join(', ') }}
            </div>
          </div>
        </div>
        <div v-else class="arena-specimen__single">
          <div class="arena-specimen__panel arena-specimen__panel--full" :style="panelStyle(activeTheme)">
            <div class="arena-card-states-info">
              States werden durch die echten CSS-Klassen aus styles.css gesteuert.
              Interagiere direkt mit der Card oben.
            </div>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { useArenaHighlight } from '../../composables/useArenaHighlight.js'
import { componentTokenGroups } from '../../data/tokens.js'

const store = useThemeStore()
const { isHighlighted, highlightStyle } = useArenaHighlight('card')

// ---------------------------------------------------------------------------
// Rezepte aus card-recipes.json (via fetch beim Laden)
// ---------------------------------------------------------------------------
import recipesData from '../../../../../data/card-recipes.json'

const recipes = computed(() => recipesData.recipes || [])
const activeRecipeId = ref('informational')

const activeRecipe = computed(() =>
  recipes.value.find(r => r.id === activeRecipeId.value) || recipes.value[0]
)

const showGrid = ref(false)

// Wiederholtes HTML fuer Grid-Kontext (3 Kopien)
const repeatedHtml = computed(() => {
  const html = activeRecipe.value.html
  return html + html + html
})

// ---------------------------------------------------------------------------
// Token Data
// ---------------------------------------------------------------------------
const componentData = computed(() =>
  componentTokenGroups.find(g => g.id === 'card') || null
)

const tLight = computed(() => store.state.themes[store.state.activeThemeSet].light)
const tDark  = computed(() => store.state.themes[store.state.activeThemeSet].dark)

// 3-Mode Support (light / dark / split)
const arenaMode = computed(() => store.state.previewMode)
const isSplit = computed(() => arenaMode.value === 'split')
const activeTheme = computed(() =>
  arenaMode.value === 'dark' ? tDark.value : tLight.value
)

// ---------------------------------------------------------------------------
// Token Resolution → CSS Custom Properties auf dem Panel
// ---------------------------------------------------------------------------
// Setzt --nc-card-* CSS Custom Properties, damit die echten .nc-card Klassen
// aus styles.css die Token-Werte des aktiven Themes konsumieren.
function panelStyle(semanticMap) {
  const style = {
    background: semanticMap['background-base'],
    color: semanticMap['text-primary']
  }

  if (!componentData.value) return style

  // Semantic tokens als --fnd-color-* setzen (fuer Cards die semantic refs nutzen)
  const semanticKeys = [
    'background-base', 'layer-01', 'text-primary', 'text-secondary', 'text-tertiary',
    'border-secondary', 'border-strong', 'background-secondary', 'background-accent-secondary',
    'interactive-default', 'interactive-hover', 'text-on-interactive',
    'feedback-success', 'feedback-warning', 'feedback-danger', 'feedback-info',
    'text-disabled'
  ]

  for (const key of semanticKeys) {
    if (semanticMap[key]) {
      style[`--fnd-color-${key}`] = semanticMap[key]
    }
  }

  // Component-Token-Overrides vom Store (--nc-card-*)
  for (const token of componentData.value.tokens) {
    const override = store.currentComponentOverrides.value?.[token.id]
    if (override !== undefined) {
      style[`--${token.id}`] = override
    }
  }

  return style
}
</script>

<style scoped>
.component-arena {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
}

/* Toolbar */
.arena-toolbar {
  display: flex;
  gap: 12px;
  padding: 4px 0;
}

.arena-toggle-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  opacity: 0.7;
  cursor: pointer;
}

.arena-toggle-label input[type="checkbox"] {
  margin: 0;
}

/* Category Divider */
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

/* Specimen */
.arena-specimen {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
}

.arena-specimen__label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 6px 12px;
  opacity: 0.55;
  border-radius: 4px;
  background: var(--arena-label-bg, transparent);
}

.arena-specimen__pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.arena-specimen__panel {
  padding: 24px; /* --fnd-spacing-06 */
  overflow: hidden;
}

.arena-specimen__panel--light {
  border-right: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}

.arena-specimen__single {
  display: grid;
  grid-template-columns: 1fr;
}

/* Status Row */
.arena-card-status-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* States Info */
.arena-card-states-info {
  font-size: 11px;
  opacity: 0.5;
  padding: 12px;
  text-align: center;
  font-style: italic;
}
</style>
