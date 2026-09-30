<template>
  <div class="recipe-arena" v-if="ansichten.length" :data-component-id="componentId">
    <template v-for="sp in ansichten" :key="sp.id">
      <div class="arena-category-divider">
        <span class="arena-category-label">{{ sp.label }}</span>
      </div>

      <div
        class="arena-specimen ra-specimen"
        :data-specimen-id="sp.id"
        :data-token-groups="sp.tokenGroups.join(',')"
      >
        <p v-if="sp.description" class="ra-desc">{{ sp.description }}</p>

        <!-- Vorschau: echte DS-Klassen, Styles kommen aus styles.css -->
        <div class="ra-preview" :class="[previewThemeClass, `ra-preview--${sp.anordnung}`]">
          <div v-for="zeile in sp.zeilen" :key="zeile.key" class="ra-matrix-row">
            <span v-if="zeile.label" class="ra-axis-label">{{ zeile.label }}</span>
            <div class="ra-cells">
              <figure
                v-for="z in zeile.zellen"
                :key="z.id"
                class="ra-cell"
                :data-specimen-id="sp.id"
                :data-cell-id="z.id"
                :data-token-groups="z.tokenGroups.join(',')"
                :data-quelle="z.quelle"
              >
                <div class="ra-live-component" :class="flaecheKlassen(z.flaeche)" :data-flaeche="z.flaeche || null" v-html="z.html"></div>
                <div v-if="isHighlighted" class="ra-highlight" :style="highlightStyle"></div>
                <figcaption class="ra-cell-label">{{ z.label }}</figcaption>
              </figure>
            </div>
          </div>
        </div>

        <p v-if="sp.nurInteraktiv" class="ra-hinweis">
          * Hover und Fokus kennt das Design System nur als Pseudoklasse — die Zelle zeigt den
          Ruhezustand. Zum Prüfen mit der Maus darüberfahren bzw. per Tab-Taste fokussieren.
        </p>

        <div class="ra-axes" v-if="sp.achsen.length">
          <span v-for="a in sp.achsen" :key="a.name" class="ra-axis-pill">{{ a.name }}: {{ a.werte }}</span>
        </div>

        <div class="ra-tokens" v-if="sp.tokenGroups.length">
          <span v-for="tg in sp.tokenGroups" :key="tg" class="ra-token-pill">{{ tg }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
// ==========================================================================
// RecipeArena — Vorschau direkt aus dem Recipe
// ==========================================================================
// Ersetzt RecipeSpecimenArena. Specimens werden mit dem recipe-sdk expandiert
// (Achsen × Zustaende), Klassen/Token-Gruppen/State-Rules aufgeloest und je
// Zelle gerendert — mit Vorlage aus src/arena-templates/<id>.js, sonst per
// Slot-Heuristik. Siehe src/lib/recipe-arena.js.
// ==========================================================================
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { useRecipeLoader } from '../../composables/useRecipeLoader.js'
import { useArenaHighlight } from '../../composables/useArenaHighlight.js'
import { normalisiereRecipe, specimenAnsicht, flaecheKlassen } from '../../lib/recipe-arena.js'
import { vorlageFuer } from '../../arena-templates/index.js'

const props = defineProps({
  componentId: { type: String, required: true }
})

const store = useThemeStore()
const { recipe } = useRecipeLoader(computed(() => props.componentId))
const { isHighlighted, highlightStyle } = useArenaHighlight(props.componentId)

const previewThemeClass = computed(() => {
  const mode = store.state.previewMode === 'split' ? 'light' : store.state.previewMode
  return mode === 'dark' ? 'neo-dark-theme' : 'neo-light-theme'
})

const normalisiert = computed(() => (recipe.value ? normalisiereRecipe(recipe.value) : null))

const ansichten = computed(() => {
  const r = normalisiert.value
  if (!r) return []
  const vorlage = vorlageFuer(props.componentId)
  return r.specimens.map((sp) => specimenAnsicht(sp, r, props.componentId, vorlage))
})
</script>

<style>
.recipe-arena { padding: 12px; }

.ra-specimen {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border: 1.5px solid var(--cfg-border, #e2e8f0);
  border-radius: 10px;
}

.ra-desc,
.ra-hinweis {
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
  color: var(--cfg-text-muted, #64748b);
}

.ra-preview {
  border: 1px solid var(--cfg-border, #e2e8f0);
  border-radius: 8px;
  padding: 24px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* Die Preview-Zone nutzt das DS-Stylesheet (styles.css) */
  background: var(--fnd-color-background-base, #fff);
  color: var(--fnd-color-text-primary, inherit);
}

.ra-matrix-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.ra-axis-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  min-width: 80px;
  padding-top: 6px;
  flex-shrink: 0;
  color: var(--fnd-color-text-tertiary, #94a3b8);
}

.ra-cells {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
}

.ra-preview--stapel .ra-cells { flex-direction: column; align-items: stretch; }
.ra-preview--stapel .ra-cell { width: 100%; }
.ra-preview--einzeln .ra-cells { justify-content: center; }

.ra-cell {
  position: relative;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  max-width: 100%;
}

.ra-cell-label {
  font-size: 10px;
  line-height: 1.3;
  color: var(--fnd-color-text-tertiary, #94a3b8);
}

.ra-live-component { min-width: 0; }

/* Theme-Achse: dunkle Zellen (neo-dark-theme bindet die Tokens lokal neu,
   siehe zellenFlaeche). .neo-surface kommt in Drupal aus neo-overrides.css,
   nicht aus styles.css — hier dieselbe Regel fuer die Arena. */
.ra-live-component.ra-flaeche {
  padding: 16px;
  border-radius: 6px;
}
.ra-live-component.neo-surface {
  background-color: var(--fnd-color-background-base);
  color: var(--fnd-color-text-primary);
}
.ra-live-component.ra-flaeche--invers {
  background-color: var(--fnd-color-background-inverse);
  color: var(--fnd-color-text-inverse);
  display: inline-flex;
}

/* Heuristik ohne Vorlage: Slotname statt leerer Flaeche */
.ra-live-component .ra-slot-name {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 2px 8px;
  border: 1px dashed var(--cfg-border-strong, #94a3b8);
  border-radius: 4px;
  font: 500 11px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--cfg-text-muted, #64748b);
  background: color-mix(in srgb, var(--cfg-text-muted, #64748b) 6%, transparent);
  white-space: nowrap;
}

.ra-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 12px 16px;
  border: 1.5px dashed var(--fnd-color-border-secondary, #cbd5e1);
  border-radius: 6px;
  color: var(--fnd-color-text-secondary, #64748b);
  font-weight: 600;
  font-size: 13px;
}

.ra-axes, .ra-tokens {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.ra-axis-pill,
.ra-token-pill {
  font-size: 9px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 3px;
  white-space: nowrap;
}

.ra-axis-pill {
  background: color-mix(in srgb, var(--fnd-color-interactive-default, #002049) 8%, transparent);
  color: var(--fnd-color-interactive-default, #002049);
}

.ra-token-pill {
  background: color-mix(in srgb, var(--fnd-color-feedback-success, #22c55e) 8%, transparent);
  color: var(--fnd-color-feedback-success, #22c55e);
}
</style>
