<template>
  <div ref="wurzel" class="recipe-arena" v-if="ansichten.length" :data-component-id="componentId" :data-modus="modus">
    <!-- Komposition (Plan v3): woraus das Bauteil besteht. Aendert man dort
         etwas, aendert es sich hier mit. -->
    <nav v-if="komposition.length" class="ra-komposition" aria-label="Besteht aus">
      <span class="ra-komposition__titel">Besteht aus</span>
      <a v-for="k in komposition" :key="k.art + k.recipe" class="ra-komposition__teil" :href="`#/component/${k.recipe}`" :title="k.hinweis || (k.art === 'teilt' ? 'teilt die Tokens' : 'enthält das Bauteil')">
        {{ k.name }}<span v-if="k.art === 'teilt'" class="ra-komposition__art">Tokens</span>
      </a>
    </nav>
    <!-- Zustaende (feste Matrix) oder Ausprobieren (lebendige Instanz mit dem
         Verhalten aus packages/neo-behaviors — derselben Datei wie in Drupal). -->
    <div v-if="hatVerhalten" class="ra-modus" role="group" aria-label="Ansicht der Arena">
      <button type="button" class="ra-modus__knopf" :aria-pressed="modus === 'zustaende'" @click="modus = 'zustaende'">Zustände</button>
      <button type="button" class="ra-modus__knopf" :aria-pressed="modus === 'ausprobieren'" @click="modus = 'ausprobieren'">Ausprobieren</button>
      <span v-if="modus === 'ausprobieren'" class="ra-modus__hinweis">Klicken, tippen, Tastatur — das Verhalten kommt aus neo-behaviors, wie in Drupal.</span>
    </div>
    <template v-for="sp in sichtbareAnsichten" :key="sp.id">
      <div class="arena-category-divider">
        <span class="arena-category-label">{{ sp.label }}</span>
      </div>

      <div
        class="arena-specimen ra-specimen"
        :data-specimen-id="sp.id"
        :data-token-groups="sp.tokenGroups.join(',')"
      >
        <p v-if="sp.description" class="ra-desc">{{ sp.description }}</p>

        <!-- Vorschau: echte DS-Klassen, Styles kommen aus styles.css. Im
             Split-Modus steht dieselbe Vorschau hell und dunkel nebeneinander
             (wie in den handgeschriebenen Arenen). -->
        <div class="ra-preview-gruppe" :class="{ 'ra-preview-gruppe--split': vorschauThemen.length > 1 }">
          <div
            v-for="(thema, ti) in vorschauThemen"
            :key="thema"
            class="ra-preview"
            :class="[thema, `ra-preview--${sp.anordnung}`]"
            :data-thema="thema"
          >
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
                  <div class="ra-live-component" :class="flaecheKlassen(z.flaeche)" :style="variablenFuer(thema, z.flaeche)" :data-flaeche="z.flaeche || null" v-html="ti ? fuerWeiteresThema(z.html, `-t${ti + 1}`) : z.html"></div>
                  <div v-if="isHighlighted" class="ra-highlight" :style="highlightStyle"></div>
                  <figcaption class="ra-cell-label">{{ z.label }}</figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>

        <p v-if="sp.nurInteraktiv && modus === 'zustaende'" class="ra-hinweis">
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
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { anbinden, MIT_VERHALTEN } from 'neo-behaviors'
import { useThemeStore } from '../../stores/theme.js'
import { useRecipeLoader } from '../../composables/useRecipeLoader.js'
import { useArenaHighlight } from '../../composables/useArenaHighlight.js'
import { normalisiereRecipe, specimenAnsicht, flaecheKlassen, fuerWeiteresThema } from '../../lib/recipe-arena.js'
import { vorlageFuer, einrichtungFuer } from '../../arena-templates/index.js'
import { vorschauVariablen } from '../../lib/vorschau-variablen.js'

const props = defineProps({
  componentId: { type: String, required: true }
})

const store = useThemeStore()
const { recipe } = useRecipeLoader(computed(() => props.componentId))
const { isHighlighted, highlightStyle } = useArenaHighlight(props.componentId)

// Theme der Vorschau: hell, dunkel oder im Split-Modus beide nebeneinander.
const vorschauThemen = computed(() => {
  const mode = store.state.previewMode
  if (mode === 'split') return ['neo-light-theme', 'neo-dark-theme']
  return [mode === 'dark' ? 'neo-dark-theme' : 'neo-light-theme']
})

// Store-Aenderungen und bereichsweises Dunkel in der Vorschau
// (lib/vorschau-variablen.js). Je Modus einmal berechnet.
const varsHell = computed(() => vorschauVariablen({ id: props.componentId, modus: 'light', state: store.state }))
const varsDunkel = computed(() => vorschauVariablen({ id: props.componentId, modus: 'dark', state: store.state }))
function variablenFuer (thema, flaeche) {
  return thema === 'neo-dark-theme' || flaeche === 'dunkel' ? varsDunkel.value : varsHell.value
}

const normalisiert = computed(() => (recipe.value ? normalisiereRecipe(recipe.value) : null))

const komposition = computed(() => (recipe.value?.komposition || []).map((k) => ({
  ...k,
  name: k.recipe.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')
})))

const ansichten = computed(() => {
  const r = normalisiert.value
  if (!r) return []
  const vorlage = vorlageFuer(props.componentId)
  return r.specimens.map((sp) => specimenAnsicht(sp, r, props.componentId, vorlage))
})

// --- Ausprobieren (Plan v3, Phase 2) ---------------------------------------
// Je Specimen eine lebendige Instanz (die erste Zelle), an die das Verhalten
// aus packages/neo-behaviors gebunden wird. Die Zustandsmatrix bleibt
// unberuehrt: dort zeigt jede Zelle einen festen Zustand.
// Die Instanz wird mit { ausprobieren: true } gebaut: Overlays zeigen in
// „Zustände" ihren offenen Zustand fest, hier starten sie geschlossen und
// das Verhalten oeffnet sie (Plan v3, Phase 3, Block Overlays).
const hatVerhalten = computed(() => MIT_VERHALTEN.includes(props.componentId))
// Gebunden wird das Bauteil selbst und, was es enthaelt (komposition
// „enthaelt", Specimen composes) und selbst Verhalten hat — z. B. die
// Toggle-Groups und die Suche in der Toolbar. Die Reihenfolge macht
// neo-behaviors (aeussere Bauteile zuletzt).
const verhaltenIds = computed(() => {
  const ids = new Set([props.componentId])
  for (const k of recipe.value?.komposition || []) if (k.art === 'enthaelt') ids.add(k.recipe)
  for (const sp of recipe.value?.specimens || []) for (const c of sp.composes || []) ids.add(c)
  return [...ids].filter((id) => MIT_VERHALTEN.includes(id))
})
const modus = ref('zustaende')
watch(() => props.componentId, () => { modus.value = 'zustaende' })

const lebendigeAnsichten = computed(() => {
  const r = normalisiert.value
  if (!r || modus.value !== 'ausprobieren') return []
  const vorlage = vorlageFuer(props.componentId)
  return r.specimens.map((sp) => specimenAnsicht(sp, r, props.componentId, vorlage, { ausprobieren: true }))
})

const sichtbareAnsichten = computed(() => {
  if (modus.value !== 'ausprobieren') return ansichten.value
  return lebendigeAnsichten.value.map((sp) => {
    const zelle = sp.zeilen[0]?.zellen[0]
    return { ...sp, zeilen: zelle ? [{ key: 'live', label: '', zellen: [{ ...zelle, label: 'Ausprobieren' }] }] : [] }
  })
})

const wurzel = ref(null)
let aufraeumen = null

// Nach dem Rendern: was die Vorlage als DOM-Eigenschaft setzen muss (z. B.
// checkbox.indeterminate) — siehe einrichten() in src/arena-templates.
function richteEin () {
  const einrichten = einrichtungFuer(props.componentId)
  if (!einrichten || !wurzel.value) return
  for (const zelle of wurzel.value.querySelectorAll('.ra-live-component')) einrichten(zelle)
}

function binde () {
  richteEin()
  aufraeumen?.()
  aufraeumen = null
  if (modus.value === 'ausprobieren' && wurzel.value) aufraeumen = anbinden(wurzel.value, verhaltenIds.value)
}
watch([modus, sichtbareAnsichten, () => store.state.previewMode], () => nextTick(binde), { flush: 'post' })
onMounted(() => nextTick(binde))
onBeforeUnmount(() => aufraeumen?.())
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

.ra-preview-gruppe { display: flex; flex-direction: column; gap: 12px; }
.ra-preview-gruppe--split { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }

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

/* Layout-Huellen fuer Vorlagen, die mehrere Exemplare in eine Zelle stellen
   (z. B. deaktiviert aus und an). Nur Anordnung, keine Gestaltung. */
.ra-live-component .ra-reihe { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
.ra-live-component .ra-stapel { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
.ra-live-component .ra-feld { width: 280px; max-width: 100%; }
.ra-live-component .ra-feld--breit { width: 520px; }

/* Overlays (Plan v3, Phase 3, Block Overlays). Nur Platz und Rahmen — die
   Bauteile selbst gestaltet allein styles.css.
   ra-anker: Flaeche um Ausloeser + Panel. Menue, Popover-Panel und Tooltip
   liegen absolut am Ausloeser; die Flaeche haelt ihnen den Platz frei,
   damit sie in der Zelle bleiben und nichts ueberdecken. */
.ra-live-component .ra-anker {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  min-width: 240px;
  min-height: 240px;
  padding: 8px;
}
.ra-live-component .ra-anker--hoch { min-height: 380px; }
.ra-live-component .ra-anker--flach { min-height: 150px; }
.ra-live-component .ra-anker--breit { min-width: 460px; }
.ra-live-component .ra-anker--sehr-breit { min-width: 640px; }
.ra-live-component .ra-anker--oben { align-items: flex-end; }
.ra-live-component .ra-anker--mitte { justify-content: center; }
.ra-live-component .ra-anker--zentriert { align-items: center; }
.ra-live-component .ra-anker--ende { justify-content: flex-end; }

/* ra-buehne: Rahmen fuer Modal, Drawer und Alert-Dialog. Die Dialoge sind
   position: fixed; contain macht den Rahmen zu ihrem Bezugsrahmen (statt des
   Fensters), der Rahmen ist damit ein kleiner Bildschirm mit Hintergrund-
   Abdunklung (Token des Backdrops). In „Ausprobieren" oeffnet showModal()
   den Dialog in der obersten Ebene — dann ueber dem ganzen Fenster, wie in
   Drupal. */
.ra-live-component .ra-buehne {
  position: relative;
  width: 100%;
  max-width: 760px;
  height: 420px;
  overflow: hidden;
  contain: layout paint;
  border-radius: 6px;
  background: var(--nc-dialog-overlay-bg);
}
.ra-live-component .ra-buehne--drawer { background: var(--nc-drawer-overlay-bg); }
.ra-live-component .ra-buehne--niedrig { height: 300px; }
.ra-live-component .ra-buehne--hoch { height: 520px; }
/* Scrollender Inhalt: die Hoehenbegrenzung des DS rechnet mit 100vh; im
   Rahmen gilt dieselbe Formel gegen die Rahmenhoehe (DS-Instanzwert). */
.ra-live-component .ra-buehne--begrenzt { --mod-dialog-max-height: calc(100% - var(--fnd-spacing-08)); }

/* Navigation (Plan v3, Phase 3, Block Navigation). Wieder nur Platz und
   Rahmen.
   ra-feld--sehr-breit: Leisten mit vielen Teilen (Navigationsmenue, Toolbar
   mit Suche) — Ausrichtung und Spacer brauchen Breite. */
.ra-live-component .ra-feld--sehr-breit { width: 720px; }

/* ra-anker--desktop: offenes Navigationsmenue. Der Viewport liegt absolut
   unter der Liste, ist so breit wie das Menue und fuer Desktop-Breite
   gebaut (Callout-Karten, Mega-Spalten) — Platz in beide Richtungen. */
.ra-live-component .ra-anker--desktop { min-width: 1080px; min-height: 560px; }

/* ra-kopf: Rahmen fuer die Kopfzeile (nc-header). Der Header ist sticky
   und schiebt sich mit .is-hidden um seine Hoehe nach oben — der Rahmen
   schneidet ab, die Zelle zeigt dann den leeren Kopfbereich wie die Seite.
   Grund: Seitenhintergrund, damit Blur und 90 % Deckkraft sichtbar sind.
   Breite: die Kopfzeile ist fuer Fensterbreiten ab 1200 px gebaut (Liste
   und Aktionen erst ab lg) — schmaler bricht die Liste in die feste Hoehe
   um. Der Rahmen haelt Desktop-Breite, die Vorschau scrollt waagrecht. */
.ra-live-component .ra-kopf {
  position: relative;
  width: 100%;
  min-width: 1080px;
  min-height: var(--nc-nav-height);
  overflow: hidden;
  border-radius: 6px;
  background: var(--fnd-color-background-secondary);
}

/* ra-kulisse: dunkler Grund fuer Bauteile, die ueber Bildern liegen
   (Kopfzeile transparent, Toolbar blurred) — sonst Weiss auf Weiss. */
.ra-live-component .ra-kulisse {
  padding: 16px;
  border-radius: 6px;
  background: var(--fnd-color-background-inverse);
}
.ra-live-component .ra-kopf.ra-kulisse { padding: 0; }

/* ra-spalte: die Sidebar ist im DS 100 % hoch (Footer per margin-top:auto
   unten) — der Rahmen gibt ihr eine Hoehe. */
.ra-live-component .ra-spalte {
  display: flex;
  height: 400px;
  border-radius: 6px;
  overflow: hidden;
  background: var(--fnd-color-background-secondary);
}
.ra-live-component .ra-spalte--hoch { height: 760px; }

/* ra-buehne--mobil: Sidebar als Mobil-Overlay (--open + Backdrop). Das DS
   schaltet die Mobil-Lage nur ueber die Fensterbreite (respond-to-max('md')
   in 07-organisms/_sidebar.scss); im Rahmen stellt die Arena sie mit den
   Werten des DS dar — 100vh wird zur Rahmenhoehe (wie bei ra-buehne). */
.ra-live-component .ra-buehne--mobil { background: var(--fnd-color-background-secondary); }
.ra-live-component .ra-buehne--mobil .nc-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  transform: translateX(-100%);
}
.ra-live-component .ra-buehne--mobil .nc-sidebar--open { transform: translateX(0); }
.ra-live-component .ra-buehne--mobil .nc-sidebar-backdrop {
  display: block;
  position: fixed;
  inset: 0;
  background-color: color-mix(in srgb, var(--fnd-color-background-base) 50%, transparent);
  z-index: calc(var(--fnd-z-sidebar) - 1);
}
/* wie im DS: der Backdrop mit [hidden] ist weg (Ausprobieren: zu) */
.ra-live-component .ra-buehne--mobil .nc-sidebar-backdrop[hidden] { display: none; }
/* Ausprobieren: Platz um den Knopf, der die Sidebar oeffnet */
.ra-live-component .ra-buehne--mobil > .nc-button { margin: 16px; }

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
.ra-komposition {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 0 0 12px;
  font-size: 12px;
}
.ra-komposition__titel {
  color: var(--cfg-text-muted, #64748b);
  margin-right: 2px;
}
.ra-komposition__teil {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border: 1px solid var(--cfg-border, #e2e8f0);
  border-radius: 999px;
  color: inherit;
  text-decoration: none;
}
.ra-komposition__teil:hover,
.ra-komposition__teil:focus-visible {
  border-color: currentColor;
}
.ra-komposition__art {
  font-size: 10px;
  opacity: 0.7;
}
.ra-modus {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 0 0 16px;
  font-size: 12px;
}
.ra-modus__knopf {
  padding: 4px 12px;
  border: 1px solid var(--cfg-border, #e2e8f0);
  border-radius: 999px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.ra-modus__knopf[aria-pressed='true'] {
  border-color: var(--cfg-accent, #2563eb);
  color: var(--cfg-accent, #2563eb);
  font-weight: 600;
}
.ra-modus__knopf:focus-visible {
  outline: 2px solid var(--cfg-accent, #2563eb);
  outline-offset: 2px;
}
.ra-modus__hinweis {
  color: var(--cfg-text-muted, #64748b);
  margin-left: 4px;
}
</style>
