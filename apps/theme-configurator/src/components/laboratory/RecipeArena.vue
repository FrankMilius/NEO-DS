<template>
  <div ref="wurzel" class="recipe-arena" :class="{ 'ra-hilfslinien': hilfslinien }" v-if="ansichten.length" :data-component-id="componentId" :data-modus="modus">
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
    <div v-if="hatVerhalten || abspielInfo" class="ra-modus" role="group" aria-label="Ansicht der Arena">
      <template v-if="hatVerhalten">
        <button type="button" class="ra-modus__knopf" :aria-pressed="modus === 'zustaende'" @click="modus = 'zustaende'">Zustände</button>
        <button type="button" class="ra-modus__knopf" :aria-pressed="modus === 'ausprobieren'" @click="modus = 'ausprobieren'">Ausprobieren</button>
        <span v-if="modus === 'ausprobieren'" class="ra-modus__hinweis">{{ eigenesAusprobieren ? eigenesAusprobieren.hinweis : 'Klicken, tippen, Tastatur — das Verhalten kommt aus neo-behaviors, wie in Drupal.' }}</span>
      </template>
      <!-- Abspielen (Plan v3, Phase 4): Bewegung eines Website-Blocks mit
           den Mitteln des DS nachgestellt; gesperrt mit Grund, wenn es sie
           nur als GSAP-Logik der Website gibt (arena-templates/index.js) -->
      <template v-if="abspielInfo">
        <button
          type="button"
          class="ra-modus__knopf ra-modus__knopf--abspielen"
          data-test="abspielen"
          :aria-pressed="laeuft"
          :disabled="!!abspielSperre"
          :aria-describedby="`${componentId}-abspielen-hinweis`"
          @click="schalteAbspielen"
        >Abspielen</button>
        <span :id="`${componentId}-abspielen-hinweis`" class="ra-modus__hinweis" data-test="abspielen-hinweis">{{ abspielSperre || abspielInfo.hinweis }}</span>
      </template>
    </div>
    <!-- UX-10: Wirkung der Filter sichtbar machen -->
    <p v-if="filterAktiv && modus === 'zustaende'" class="ra-filter-stand" role="status" data-test="filter-stand">
      <template v-if="zellenSichtbar">Filter aktiv: {{ zellenSichtbar }} von {{ zellenGesamt }} Vorschauen.</template>
      <template v-else>Keine Vorschau passt zu den gewählten Filtern.</template>
      <button type="button" class="ra-modus__knopf" data-test="filter-zuruecksetzen" @click="store.resetArenaFilters()">Filter zurücksetzen</button>
    </p>
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
                  :class="{ 'ra-cell--waehlbar': modus === 'zustaende' && z.tokenGroups.length }"
                  @click="zelleGeklickt($event, sp, z)"
                  :data-specimen-id="sp.id"
                  :data-cell-id="z.id"
                  :data-token-groups="z.tokenGroups.join(',')"
                  :data-quelle="z.quelle"
                >
                  <!-- eslint-disable-next-line vue/no-v-html -- Quelle: data/*-recipe.json ueber specimenAnsicht() und arena-templates (im Repo, Texte mit esc() maskiert); Theme-Werte gehen nur in :style -->
                  <div class="ra-live-component" :class="flaecheKlassen(z.flaeche)" :style="variablenFuer(thema, z.flaeche)" :data-flaeche="z.flaeche || null" v-html="ti ? fuerWeiteresThema(z.html, `-t${ti + 1}`) : z.html"></div>
                  <div v-if="isHighlighted" class="ra-highlight" :style="highlightStyle"></div>
                  <!-- Roadmap V03: Zelle → passende Token-Gruppen im Inspector -->
                  <figcaption class="ra-cell-label">
                    <button
                      v-if="z.tokenGroups.length"
                      type="button"
                      class="ra-zu-token"
                      :aria-label="`${z.label || sp.label}: Einstellungen öffnen`"
                      data-test="zu-token"
                      @click.stop="oeffneTokens(sp, z)"
                    >{{ z.label }}</button>
                    <template v-else>{{ z.label }}</template>
                  </figcaption>
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
import { computed, ref, watch, nextTick, onMounted, onUpdated, onBeforeUnmount, inject } from 'vue'
import { anbinden, MIT_VERHALTEN } from 'neo-behaviors'
import { useThemeStore } from '../../stores/theme.js'
import { useRecipeLoader } from '../../composables/useRecipeLoader.js'
import { useArenaHighlight } from '../../composables/useArenaHighlight.js'
import { useHilfslinien } from '../../composables/useHilfslinien.js'
import { normalisiereRecipe, specimenAnsicht, flaecheKlassen, fuerWeiteresThema } from '../../lib/recipe-arena.js'
import { vorlageFuer, einrichtungFuer, ausprobierenFuer, abspielenFuer } from '../../arena-templates/index.js'
import { vorschauVariablen } from '../../lib/vorschau-variablen.js'
import { extractFiltersFromRecipe, filterAchse, useArenaFilters } from '../../composables/useArenaFilters.js'

const props = defineProps({
  componentId: { type: String, required: true },
  // Sektion des Konfigurators, falls sie anders heisst als das Recipe
  // (useArenaResolver ALIASE, z. B. table → compare-table): ihre Tokens
  // (--nc-<sektion>-*) heben die Arena hervor.
  sektion: { type: String, default: null }
})

const store = useThemeStore()
const hilfslinien = useHilfslinien()   // Schritt e: Kanten und Maße der Objekte
const { recipe } = useRecipeLoader(computed(() => props.componentId))
const { isHighlighted, highlightStyle } = useArenaHighlight(props.sektion || props.componentId)

// Quadrant der 4-Theme-Matrix (KomponentenBuehne), sonst null. Vorher fiel
// jede Quadranten-Arena auf previewMode „matrix“ → hell und aktives Set
// zurück; alle vier Felder zeigten dasselbe (Befund UX-09, 15.10.2026).
const quadrant = inject('vorschauQuadrant', null)

// Theme der Vorschau: hell, dunkel oder im Split-Modus beide nebeneinander.
const vorschauThemen = computed(() => {
  if (quadrant) return [quadrant.klasse]
  const mode = store.state.previewMode
  if (mode === 'split') return ['neo-light-theme', 'neo-dark-theme']
  return [mode === 'dark' ? 'neo-dark-theme' : 'neo-light-theme']
})

// Store-Aenderungen und bereichsweises Dunkel in der Vorschau
// (lib/vorschau-variablen.js). Je Modus einmal berechnet.
// Enthaltene Bauteile (komposition „enthaelt", Specimen composes) werden mit
// neu gebunden — sonst mischt die dunkle Vorschau dunkle Flaechen des
// Blocks mit hellen Tokens der Karte/des Buttons (Plan v3, Phase 5).
const enthalteneIds = computed(() => {
  const ids = new Set((recipe.value?.komposition || []).filter((k) => k.art === 'enthaelt').map((k) => k.recipe))
  for (const sp of recipe.value?.specimens || []) for (const c of sp.composes || []) ids.add(c)
  return [...ids]
})
const varsHell = computed(() => vorschauVariablen({ id: props.componentId, modus: 'light', state: store.state, enthaelt: enthalteneIds.value, set: quadrant?.set }))
const varsDunkel = computed(() => vorschauVariablen({ id: props.componentId, modus: 'dark', state: store.state, enthaelt: enthalteneIds.value, set: quadrant?.set }))
function variablenFuer (thema, flaeche) {
  return thema.endsWith('-dark-theme') || flaeche === 'dunkel' ? varsDunkel.value : varsHell.value
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
// Ohne Behavior in neo-behaviors kann die Vorlage ein eigenes „Ausprobieren"
// mitbringen (psychedelic-bg: Canvas-Renderer der Arena, siehe
// src/arena-templates/index.js). Animierte Website-Bloecke nutzen dafuer
// nicht „Ausprobieren", sondern die Taste „Abspielen" (export abspielen,
// siehe unten; Plan v3, Phase 4).
const eigenesAusprobieren = computed(() => (MIT_VERHALTEN.includes(props.componentId) ? null : ausprobierenFuer(props.componentId)))
const hatVerhalten = computed(() => MIT_VERHALTEN.includes(props.componentId) || !!eigenesAusprobieren.value)
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

// --- Filterleiste (Befund UX-10, 15.10.2026) --------------------------------
// ArenaFilterbar schreibt die Auswahl in store.state.arenaFilters; gefiltert
// haben nur die abgeloesten handgeschriebenen Arenen. Jetzt filtert die
// RecipeArena ihre Zellen: Achsenwerte (Variante, Groesse, weitere Achsen)
// und Zustaende. Zellen ohne Wert fuer eine Achse bleiben sichtbar.
const filterOptionen = computed(() => (recipe.value ? extractFiltersFromRecipe(recipe.value) : {}))
const { isValueVisible } = useArenaFilters(filterOptionen)
const filterAktiv = computed(() => Object.values(store.state.arenaFilters).some(Boolean))
function zelleSichtbar (z) {
  for (const [kat, auswahl] of Object.entries(store.state.arenaFilters)) {
    if (!auswahl) continue
    if (kat === 'states') {
      const zustaende = (z.states || []).filter((s) => s !== 'default')
      if (zustaende.some((s) => !isValueVisible('states', s))) return false
      continue
    }
    const achse = filterAchse(recipe.value, kat)
    const wert = achse ? z.axisValues?.[achse] : undefined
    if (wert !== undefined && wert !== null && !isValueVisible(kat, String(wert))) return false
  }
  return true
}
const gefilterteAnsichten = computed(() => {
  if (!filterAktiv.value) return ansichten.value
  return ansichten.value
    .map((sp) => ({ ...sp, zeilen: sp.zeilen.map((zl) => ({ ...zl, zellen: zl.zellen.filter(zelleSichtbar) })).filter((zl) => zl.zellen.length) }))
    .filter((sp) => sp.zeilen.length)
})
const zellenGesamt = computed(() => ansichten.value.reduce((n, sp) => n + sp.zeilen.reduce((m, zl) => m + zl.zellen.length, 0), 0))
const zellenSichtbar = computed(() => gefilterteAnsichten.value.reduce((n, sp) => n + sp.zeilen.reduce((m, zl) => m + zl.zellen.length, 0), 0))

// „Ausprobieren“ zeigt je Specimen EINE Instanz. Vorher blieben Überschrift,
// Beschreibung und Achsen der Matrix stehen („All Variants — MD“, „Alle 11
// Varianten …“, „variant: alle“) — über einer einzigen Schaltfläche
// (Befund UX-54, 19.10.2026).
const sichtbareAnsichten = computed(() => {
  if (modus.value !== 'ausprobieren') return gefilterteAnsichten.value
  return lebendigeAnsichten.value.map((sp) => {
    const zelle = sp.zeilen[0]?.zellen[0]
    const name = zelle?.label || sp.label
    return {
      ...sp,
      label: `${sp.label} · Ausprobieren`,
      description: `Eine bedienbare Instanz (${name}). Alle Varianten zeigt die Ansicht „Zustände“.`,
      achsen: [],
      zeilen: zelle ? [{ key: 'live', label: '', zellen: [{ ...zelle, label: name }] }] : []
    }
  })
})

// --- Zelle öffnet ihre Token-Gruppen (Roadmap V03, 19.10.2026) -------------
// Vorher markierte ein Klick nur das ganze Specimen (useSpecimenClick, im
// Geräte-Frame gar nicht). Jetzt: Klick auf die Zelle oder auf ihre
// Beschriftung (Knopf, also auch Enter) setzt die Arena-Auswahl mit den
// Gruppen DIESER Zelle; der ComponentEditor klappt sie auf, scrollt hin und
// setzt den Fokus.
function oeffneTokens (sp, z) {
  if (!z?.tokenGroups?.length) return
  const name = z.label ? `${sp.label} › ${z.label}` : sp.label
  store.setArenaSelection(props.sektion || props.componentId, name, [...z.tokenGroups])
}
function zelleGeklickt (e, sp, z) {
  if (modus.value !== 'zustaende' || !z.tokenGroups.length) return
  // Links in den Vorschauen (href="#") wuerden sonst die Route der App aendern
  if (e.target.closest?.('a[href]')) e.preventDefault()
  e.stopPropagation()
  oeffneTokens(sp, z)
}

const wurzel = ref(null)
let aufraeumen = null
// Aufraeum-Funktionen, die einrichten() zurueckgibt (z. B. Canvas-Renderer)
let einrichtungWeg = []
function raeumeEinrichtungAuf () {
  for (const weg of einrichtungWeg) weg()
  einrichtungWeg = []
}

// Nach dem Rendern: was die Vorlage als DOM-Eigenschaft setzen muss (z. B.
// checkbox.indeterminate) — siehe einrichten() in src/arena-templates.
function richteEin () {
  raeumeEinrichtungAuf()
  const einrichten = einrichtungFuer(props.componentId)
  if (!einrichten || !wurzel.value) return
  for (const zelle of wurzel.value.querySelectorAll('.ra-live-component')) {
    const weg = einrichten(zelle)
    if (typeof weg === 'function') einrichtungWeg.push(weg)
  }
}

function binde () {
  richteEin()
  aufraeumen?.()
  aufraeumen = null
  if (modus.value === 'ausprobieren' && wurzel.value) aufraeumen = anbinden(wurzel.value, verhaltenIds.value)
}
watch([modus, sichtbareAnsichten, () => store.state.previewMode], () => nextTick(binde), { flush: 'post' })
onMounted(() => nextTick(binde))

// --- Geräteansicht: ausgeblendete Bauteile erklären (UX-59, 19.10.2026) ----
// Manche Bauteile blendet das Design System bei kleiner Fensterbreite aus
// (Navigationsmenü unter 1200 px — die Website zeigt dann die mobile
// Navigation). Statt einer leeren Zelle steht dort ein Hinweis.
let breitenBeobachter = null
function markiereAusgeblendete () {
  const w = wurzel.value
  if (!w) return
  const geraet = !!w.closest('.br-geraet')
  for (const lc of w.querySelectorAll('.ra-live-component')) {
    // erst aufheben, dann messen — sonst verdeckt die eigene Regel den Inhalt
    delete lc.dataset.ausgeblendet
    // Ausgeblendet nur, wenn in der Zelle GAR NICHTS sichtbar ist. Vorher
    // zählte nur das erste nc-*-Element — Navigation und Header nutzen aber
    // Altklassen ohne nc-, ihr einziges nc-* ist ein verstecktes Tastenkürzel
    // (Navigation Tab Mega im Rahmen „Desktop“, 19.10.2026).
    const ansicht = lc.ownerDocument.defaultView
    const sichtbar = [...lc.querySelectorAll('*')].some((el) => {
      if (el.closest('.ra-kopf') === el) return false
      const r = el.getBoundingClientRect()
      return r.width > 0 && r.height > 0 && ansicht.getComputedStyle(el).visibility !== 'hidden' && (el.children.length === 0 || el.textContent.trim())
    })
    const aus = geraet && !sichtbar
    if (aus) lc.dataset.ausgeblendet = ''
  }
}
// Die Wurzel entsteht erst mit dem geladenen Recipe (v-if) — darum am
// Element selbst beobachten, nicht beim Einhängen der Komponente
watch(wurzel, (el) => {
  breitenBeobachter?.disconnect(); breitenBeobachter = null
  if (!el) return
  const RO = el.ownerDocument?.defaultView?.ResizeObserver
  if (RO) { breitenBeobachter = new RO(() => markiereAusgeblendete()); breitenBeobachter.observe(el) }
  nextTick(markiereAusgeblendete)
})
onUpdated(() => nextTick(markiereAusgeblendete))
onBeforeUnmount(() => breitenBeobachter?.disconnect())
onBeforeUnmount(() => { aufraeumen?.(); raeumeEinrichtungAuf() })

// --- Abspielen (Plan v3, Phase 4, Gruppe bewegung) -------------------------
// Animierte Website-Bloecke zeigen in „Zustände" ihren statischen Zustand.
// Die Taste stellt die Bewegung mit den Mitteln des DS nach (Vorlage:
// export abspielen.starten) — in allen sichtbaren Zellen. Kein GSAP.
// Gesperrt, wenn die Vorlage einen Grund nennt (Bewegung nur als GSAP-Logik
// der Website, Bauteil nicht gebaut) oder das System Bewegung reduziert.
const abspielInfo = computed(() => abspielenFuer(props.componentId))
const bewegungReduziert = ref(false)
const abspielSperre = computed(() => {
  if (!abspielInfo.value) return null
  if (abspielInfo.value.gesperrt) return abspielInfo.value.gesperrt
  if (bewegungReduziert.value) return 'Bewegung reduziert (prefers-reduced-motion): die Arena zeigt den statischen Zustand.'
  return null
})
const laeuft = ref(false)
let abspielenWeg = []
function stoppeAbspielen () {
  for (const weg of abspielenWeg) weg()
  abspielenWeg = []
  laeuft.value = false
}
function schalteAbspielen () {
  if (laeuft.value) { stoppeAbspielen(); return }
  const starten = abspielInfo.value?.starten
  if (abspielSperre.value || typeof starten !== 'function' || !wurzel.value) return
  for (const zelle of wurzel.value.querySelectorAll('.ra-live-component')) {
    const weg = starten(zelle)
    if (typeof weg === 'function') abspielenWeg.push(weg)
  }
  laeuft.value = true
}
// Vor jedem neuen Rendern anhalten (flush 'pre': die Aufraeum-Funktionen
// stellen den statischen Zustand am alten DOM her, nicht am neuen)
watch([modus, sichtbareAnsichten, () => store.state.previewMode, () => props.componentId], stoppeAbspielen)
watch(abspielSperre, (sperre) => { if (sperre) stoppeAbspielen() })
let bewegungsAbfrage = null
const merkeBewegung = (e) => { bewegungReduziert.value = !!e.matches }
onMounted(() => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
  bewegungsAbfrage = window.matchMedia('(prefers-reduced-motion: reduce)')
  bewegungReduziert.value = !!bewegungsAbfrage.matches
  bewegungsAbfrage.addEventListener?.('change', merkeBewegung)
})
onBeforeUnmount(() => {
  stoppeAbspielen()
  bewegungsAbfrage?.removeEventListener?.('change', merkeBewegung)
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

/* Jede Zelle wie body der Website (03-elements/_body.scss), nicht wie die
   App: vorher erbten Bauteile Schrift und 14 px der App — Karten und
   Hinweise waren kleiner als auf der Website, eine Fließtext-Schrift des
   Themes kam nicht an. Hier, weil die Zelle die Theme-Variablen trägt
   (Vergleich Bühne/Website, 19.10.2026). */
.ra-live-component {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: var(--lh-body);
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

/* V03: Zelle und Beschriftung führen zu den Einstellungen */
.ra-cell--waehlbar { cursor: pointer; }
.ra-zu-token {
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: var(--cfg-text-secondary, #475569);
  text-decoration: underline dotted;
  text-underline-offset: 2px;
  cursor: pointer;
}
.ra-zu-token:hover { color: var(--cfg-accent, #2563eb); text-decoration-style: solid; }
.ra-zu-token:focus-visible { outline: 2px solid var(--cfg-accent, #2563eb); outline-offset: 2px; border-radius: 2px; }

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

/* ra-kopf--offen: Website-Navigation „V3 Tab-Mega" (navigation-tab-mega)
   mit offenem Panel, Such-Band oder Kopfleisten-Menue. Alles davon haengt
   absolut unter bzw. an der Leiste — der Rahmen haelt ihm die Hoehe frei. */
.ra-live-component .ra-kopf--offen { min-height: 520px; }

/* ra-nav-mobil: navigation-tab-mega in der Mobil-Lage. Das Bauteil schaltet
   sie nur ueber die Fensterbreite (@media (max-width: 1024px) in
   07-organisms/_navigation-tab-mega.scss); im Rahmen stellt die Arena sie
   mit denselben Werten dar. contain macht den Rahmen zum Bezugsrahmen des
   position: fixed-Drawers (wie bei ra-buehne). */
.ra-live-component .ra-nav-mobil {
  position: relative;
  width: 390px;
  max-width: 100%;
  height: 640px;
  overflow: hidden;
  contain: layout paint;
  border-radius: 6px;
  background: var(--fnd-color-background-secondary);
  /* Seitenrand des Containers wie bei 390 px Fensterbreite:
     clamp(16px, 3.5vw, 48px) = 16px. Das Fenster des Konfigurators ist
     breiter und schaltet sonst auf die eingefasste Stufe (ab 1200 px). */
  --nc-container-padding-inline-constrained: 16px;
  --nc-container-padding-inline-xxl: 16px;
}
.ra-live-component .ra-nav-mobil .primary-nav,
.ra-live-component .ra-nav-mobil .hdr-group,
.ra-live-component .ra-nav-mobil .panel,
.ra-live-component .ra-nav-mobil .search-band { display: none; }
.ra-live-component .ra-nav-mobil .burger { display: grid; }
.ra-live-component .ra-nav-mobil .m-drawer { display: block; }

/* ra-typskala: Umgebung mit kleinerer Typo-Skala. nc-section-title und
   nc-lead multiplizieren mit --type-scale, das ein uebergeordnetes Element
   setzt (Doku text-blocks, „Type Scale"). Der Rahmen ist dieses Element. */
.ra-live-component .ra-typskala { --type-scale: 0.85; }

/* ra-tabelle: Tabellenumgebung fuer einzelne Zellen (tbl-cell). Die Zelle
   gestaltet sich nach ihrem Ort (th[scope=row] links und fett, td mittig) —
   der Rahmen gibt ihr den Ort, ohne Gestaltung der Vergleichstabelle. */
.ra-live-component .ra-tabelle { border-collapse: collapse; min-width: 240px; }
.ra-live-component .ra-tabelle :is(th, td) { padding: 8px 12px; border: 1px dashed color-mix(in srgb, var(--fnd-color-text-primary) 25%, transparent); }

/* ra-kulisse: mittelgrauer Grund fuer Bauteile, die ueber Bildern liegen
   (Kopfzeile transparent, Toolbar blurred, square white) — sonst Weiss auf
   Weiss. Bis 08.10.2026 background-inverse: im Hellen fast Schwarz (dunkle
   Flaechen verschwammen), im Dunkeln fast Weiss (weisse Schrift unsichtbar).
   neutral-600 ist themenunabhaengig die Mitte (Standardpalette #727572):
   Weiss 4,66:1, Schwarz 4,50:1, dunkle Flaeche #1a1a1a 3,73:1 — helle und
   dunkle Bauteile bleiben in beiden Modi unterscheidbar. */
.ra-live-component .ra-kulisse {
  padding: 16px;
  border-radius: 6px;
  background: var(--fnd-neutral-600);
}
.ra-live-component .ra-kopf.ra-kulisse { padding: 0; }
/* ra-kulisse--invers: dazu helle Schrift (always-light, in beiden Modi wie
   der weisse Marker) — fuer Text, der selbst keine Farbe setzt (square
   white: weisser Marker vor Fliesstext). */
.ra-live-component .ra-kulisse--invers { display: inline-block; color: var(--fnd-color-always-light); }

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

/* ra-buehne--mobil: Rahmen fuer die Sidebar in der Mobil-Lage. Die Lage
   selbst kommt aus dem DS (.nc-sidebar--overlay, .nc-sidebar-backdrop--overlay);
   ra-buehne macht den Rahmen per contain zum Bezugsrahmen der festen
   Leiste. Hier nur der Seitengrund. */
.ra-live-component .ra-buehne--mobil { background: var(--fnd-color-background-secondary); }
/* Ausprobieren: Platz um den Knopf, der die Sidebar oeffnet */
.ra-live-component .ra-buehne--mobil > .nc-button { margin: 16px; }

/* Rueckmeldungen (Plan v3, Phase 3, Block Rueckmeldung). Nur Platz und
   Rahmen.
   ra-bildschirm: kleiner Bildschirm fuer Toaster (position: fixed) und das
   feste Banner. contain macht den Rahmen zu ihrem Bezugsrahmen (wie bei
   ra-buehne) — sonst saessen sie am Fenster ueber der App. Grund: Seite
   (background-secondary), damit Rand und Schatten des Toasts sichtbar sind.
   Hoehe: der Toaster traegt nichts zur Hoehe bei, der Rahmen haelt sie. */
.ra-live-component .ra-bildschirm {
  position: relative;
  /* Toast-Breite (356 px) + Abstand des Toasters; schmaler schnitte der
     Rahmen den Toast ab — die Vorschau scrollt dann waagrecht */
  width: 420px;
  flex-shrink: 0;
  height: 150px;
  overflow: hidden;
  contain: layout paint;
  border-radius: 6px;
  background: var(--fnd-color-background-secondary);
}
.ra-live-component .ra-bildschirm--breit { width: 560px; }
.ra-live-component .ra-bildschirm--voll { width: 100%; height: auto; min-height: 120px; }
.ra-live-component .ra-bildschirm--mittel { height: 190px; }
.ra-live-component .ra-bildschirm--hoch { height: 400px; }
/* festes Banner: liegt ueber dem Seitentext, der Rahmen haelt Platz fuer
   ein umbrechendes Banner */
.ra-live-component .ra-bildschirm--fest { min-height: 220px; }
/* Seiteninhalt unter dem Banner (Lage static/sticky/fixed im Vergleich) */
.ra-live-component .ra-seitentext {
  margin: 0;
  padding: 16px;
  font-size: 13px;
  color: var(--fnd-color-text-secondary);
}
/* ra-standbild: Ausblend-Animation des DS (is-dismissing, is-leaving)
   angehalten, nach 40 % ihrer Dauer (300 ms) — die Zelle zeigt den Zustand
   „Schließt" halb ausgeblendet, statt leer zu sein. */
.ra-live-component .ra-standbild .is-dismissing,
.ra-live-component .ra-standbild .is-leaving {
  animation-play-state: paused;
  animation-delay: -120ms;
}
/* ra-standbild am Lauftext (Entscheidung 06.10.2026): die Endlos-Animation
   des DS steht in „Zustände"; „Abspielen" nimmt den Rahmen weg. */
.ra-live-component .ra-standbild .nc-marquee__track {
  animation-play-state: paused;
}
.ra-live-component .ra-stapel--breit { align-items: stretch; }
.ra-live-component .ra-stapel--breit > .nc-button { align-self: flex-start; }

/* Inhalte (Plan v3, Phase 3, Block Inhalte). Nur Platz und Rahmen.
   ra-flaechen-probe: die Section-Flaeche (.section--muted/--accent) um eine
   Karte — die Section bringt ihre Seitenabstaende mit (padding-block der
   Section-Tokens); hier nur ein kleiner Rand, damit die Flaeche sichtbar
   bleibt, ohne die Zelle zu sprengen. */
/* ra-reihe--oben: Karten unterschiedlicher Hoehe oben buendig statt mittig */
.ra-live-component .ra-reihe--oben { align-items: flex-start; }
.ra-live-component .ra-flaechen-probe {
  padding: 24px;
  border-radius: 6px;
}

/* Layout (Plan v3, Phase 3, Block Layout): container, grid, section, hero,
   shell, psychedelic-bg. Wieder nur Platz, Rahmen und Platzhalter — die
   Bauteile gestaltet allein styles.css.
   ra-platzhalter: Inhalt ohne Bedeutung, damit Breite, Polsterung und
   Abstaende des Layout-Bauteils sichtbar werden (getoent, gestrichelt,
   beschriftet; Farbe aus currentColor). */
.ra-live-component .ra-platzhalter {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 8px 12px;
  /* aus der Schriftfarbe der Umgebung — bleibt auf jeder Flaeche sichtbar
     (auch auf der Akzent-Section, deren Grund interactive-default ist) */
  border: 1px dashed color-mix(in srgb, currentColor 45%, transparent);
  border-radius: 4px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  color: inherit;
  font: 500 12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
  text-align: center;
}
.ra-live-component .ra-platzhalter--mittel { min-height: 88px; }
.ra-live-component .ra-platzhalter--hoch { min-height: 136px; }

/* Nicht gebaut: Modifier im Recipe ohne CSS (src/arena-templates/_layout.js) */
.ra-live-component .ra-nicht-gebaut {
  justify-content: flex-start;
  min-width: 260px;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.5;
}
.ra-live-component .ra-nicht-gebaut code { font: 600 11px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; }

/* ra-massstab: Desktop-Seite (1600 px) im Massstab 1:2,5. Der Container
   begrenzt seine Breite erst ab 1200 px Fenster — in einer Zelle waeren
   sonst alle Breiten gleich. Die Kante des Containers zeichnet die Arena
   nach (Umriss, ohne Einfluss aufs Layout); die Schrift des Platzhalters
   ist fuer den Massstab vergroessert. */
.ra-live-component .ra-massstab {
  width: 1600px;
  zoom: 0.375;
  padding-block: 32px;
  border-radius: 16px;
  background: var(--fnd-color-background-secondary);
}
.ra-hilfslinien .ra-live-component .ra-massstab > * { outline: 4px dashed color-mix(in srgb, var(--fnd-color-text-primary) 35%, transparent); }
.ra-live-component .ra-massstab .ra-platzhalter { min-height: 160px; font-size: 32px; border-width: 3px; }

/* ra-desktop: Desktop-Seite (1280 px) im Massstab 1:2,4 fuer Bauteile, die
   fuer die Seitenbreite gebaut sind (Hero: zwei Spalten, buendiges Medium).
   Die Fensterbreite (Media Queries) bleibt die des Konfigurators. */
.ra-live-component .ra-desktop {
  width: 1280px;
  zoom: 0.42;
  flex-shrink: 0;
}

/* ra-seite: Kante der Section gestrichelt — die Standard-Flaeche ist gleich
   dem Seitengrund, ohne Kante waere die Polsterung unsichtbar. */
.ra-hilfslinien .ra-live-component .ra-seite > * { outline: 1px dashed color-mix(in srgb, var(--fnd-color-text-primary) 35%, transparent); }
/* ra-seite--kante: Section mit Divider — der Umriss steht 6 px ab, damit die
   Trennlinie (Rahmenkante der Section) sichtbar bleibt. */
.ra-live-component .ra-seite--kante { padding-block: 8px; }
.ra-live-component .ra-seite--kante > * { outline-offset: 6px; }

/* Website-Inhalt der Objekte (_layout.js: abschnitt, karte; 19.10.2026) */
.ra-live-component .ra-abschnitt { display: grid; gap: 16px; }
.ra-live-component .ra-abschnitt > :is(h2, p) { margin: 0; }
.ra-live-component .ra-karten { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.ra-live-component [data-hilfe] > .nc-card { height: 100%; }
/* Hilfslinien: Kanten der Bereiche und ihre Maße — nur mit dem Schalter */
.ra-hilfslinien .ra-live-component [data-hilfe] {
  position: relative;
  outline: 1px dashed color-mix(in srgb, var(--fnd-color-text-primary) 55%, transparent);
  outline-offset: 2px;
  background-image: linear-gradient(color-mix(in srgb, var(--fnd-color-text-primary) 4%, transparent), color-mix(in srgb, var(--fnd-color-text-primary) 4%, transparent));
}
.ra-hilfslinien .ra-live-component [data-hilfe]::before {
  content: attr(data-hilfe);
  position: absolute; z-index: 2; inset-block-start: 0; inset-inline-end: 0;
  padding: 2px 6px; border-radius: 0 0 0 4px;
  background: var(--fnd-color-text-primary); color: var(--fnd-color-background-base);
  font: 500 11px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
  pointer-events: none;
}

/* ra-grund-dunkel: dunkler Grund fuer Bloecke ohne eigene Flaeche mit
   festem hellem Text (cta: always-light) — in hell und dunkel gleich
   (Plan v3, Phase 4). */
.ra-live-component .ra-grund-dunkel { background: var(--fnd-color-always-dark); }

/* ra-schmal: schmale Spalte (360 px) fuer Bauteile mit Container Query —
   z. B. das Stapel-Layout der Datentabelle (nc-data-table--stacked reagiert
   auf die Breite des Tabellen-Wrappers, Entscheidung 06.10.2026). */
.ra-live-component .ra-schmal {
  width: 360px;
  max-width: 100%;
}

/* ra-mobil: Raster in der Mobil-Lage (390 px). Das DS schaltet unter 768 px
   Fensterbreite auf --nc-grid-mobile-columns (4) Spalten, Spannen ueber 4
   laufen ueber die volle Breite (04-objects/_grid.scss, mobile-only). Der
   Rahmen setzt dieselben Werte ueber die Override-Stufe des Rasters — am
   Raster selbst, damit o-grid--mobile-1/2/6 (setzen --nc-grid-mobile-columns
   am Raster) greifen; die Spannen-Regeln der Modifier wie im DS. */
.ra-live-component .ra-mobil {
  width: 390px;
  max-width: 100%;
  padding: 16px;
  border-radius: 6px;
  background: var(--fnd-color-background-secondary);
}
.ra-live-component .ra-mobil .o-grid { --mod-grid-columns: var(--nc-grid-mobile-columns, 4); }
.ra-live-component .ra-mobil :is(.o-col-5, .o-col-6, .o-col-7, .o-col-8, .o-col-9, .o-col-10, .o-col-11, .o-col-12) { grid-column: 1 / -1; }
.ra-live-component .ra-mobil .o-grid--mobile-1 > * { grid-column: 1 / -1; }
.ra-live-component .ra-mobil .o-grid--mobile-2 > :is(.o-col-3, .o-col-4) { grid-column: 1 / -1; }
.ra-live-component .ra-mobil .o-grid--mobile-6 > .o-col-5 { grid-column: span 5; }
.ra-live-component .ra-mobil .o-grid--mobile-6 > .o-col-6 { grid-column: span 6; }
/* ra-zeilen: gibt dem Raster zwei Zeilen vor, wie es eine Seite taete —
   erst dann fuellt o-grid--flow-col sichtbar Spalte fuer Spalte. */
.ra-live-component .ra-zeilen > .o-grid { grid-template-rows: repeat(2, auto); }

/* ra-fenster: Shell als Miniatur — Desktop-Fenster 1200 x 640 px im
   Massstab 1:2,2 (passt neben die Zeilenbeschriftung). Scroll-Container (Navbar und Footerbar kleben oben/unten),
   contain macht ihn zum Bezugsrahmen der festen Elemente (Skip-Link im
   Fokus, Drawer, Overlay). Die Shell fuellt darin min. 100dvh. */
.ra-live-component .ra-fenster {
  position: relative;
  width: 1200px;
  height: 640px;
  zoom: 0.45;
  flex-shrink: 0;
  overflow: hidden;
  contain: layout paint;
  border: 2px solid var(--fnd-color-border-secondary);
  border-radius: 12px;
  --ra-zone-schrift: 22px;
}
/* ra-fenster--mobil: 390 px im Massstab 3:4. Drawer und Footerbar-Lage
   schaltet das DS nur unter lg (respond-to-max('lg') in
   08-templates/_shell.scss) — hier dieselben Werte im Rahmen. */
.ra-live-component .ra-fenster--mobil {
  width: 390px;
  height: 600px;
  zoom: 0.75;
  --ra-zone-schrift: 16px;
}
.ra-live-component .ra-fenster--mobil .nc-shell__stage {
  grid-template-columns: 1fr;
  grid-template-areas: 'main';
}
.ra-live-component .ra-fenster--mobil :is(.nc-shell__sidebar-left, .nc-shell__sidebar-right) {
  display: none;
  position: fixed;
  inset-block: 0;
  z-index: var(--nc-shell-z-drawer);
  width: min(300px, 85%);
  height: auto;
}
.ra-live-component .ra-fenster--mobil .nc-shell__sidebar-left { inset-inline-start: 0; }
.ra-live-component .ra-fenster--mobil .nc-shell__sidebar-right { inset-inline-end: 0; }
.ra-live-component .ra-fenster--mobil .nc-shell--sidebar-left-drawer-open .nc-shell__sidebar-left { display: block; }
.ra-live-component .ra-fenster--mobil .nc-shell--sidebar-right-drawer-open .nc-shell__sidebar-right { display: block; }
.ra-live-component .ra-fenster--mobil [data-footerbar-mobile='hide'] .nc-shell__footerbar { display: none; }
.ra-live-component .ra-fenster--mobil [data-footerbar-mobile='static'] .nc-shell__footerbar { position: static; }
/* Platzhalter in den Zonen der Shell */
.ra-live-component .ra-zone {
  padding: 16px 24px;
  color: var(--fnd-color-text-secondary);
  font: 500 var(--ra-zone-schrift, 13px)/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
}
.ra-live-component .ra-zone--navbar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: var(--nc-nav-height);
  border-block-end: 1px solid var(--fnd-color-border-secondary);
  background: var(--fnd-color-background-base);
}
/* Ausprobieren (Shell): Text der Navbar zwischen den Drawer-Knoepfen, Links
   in der Sidebar untereinander */
.ra-live-component .ra-zone--navbar > span { flex: 1; }
.ra-live-component .ra-zone--links { display: flex; flex-direction: column; gap: 12px; }
.ra-live-component .ra-zone--links a { color: var(--fnd-color-text-primary); }

/* ra-effekt: Flaeche fuer den Canvas-Effekt (psychedelic-bg). Das DS hat
   fuer .nc-psychedelic-bg kein CSS (Entscheidung 25.08.2026); laut Anatomie
   fuellt das Canvas den Container absolut — der Rahmen gibt die Groesse. */
.ra-live-component .ra-effekt {
  position: relative;
  height: 360px;
  overflow: hidden;
  border-radius: 6px;
  background: var(--fnd-color-background-secondary);
}
.ra-live-component .ra-effekt > .nc-psychedelic-bg { position: absolute; inset: 0; }
.ra-live-component .ra-effekt canvas { display: block; }

/* Bewegung (Plan v3, Phase 4, Gruppe bewegung). Nur Platz und Rahmen.
   ra-kopf--mobil: Kopfzeile in der Mobil-Lage (.nc-header--mobile) in
   Telefonbreite; mit .is-mobile-open haengt das Panel unter der Leiste
   (ra-kopf--offen haelt die Hoehe frei). */
.ra-live-component .ra-kopf--mobil { min-width: 0; width: 390px; max-width: 100%; }
.ra-live-component .ra-kopf--mobil.ra-kopf--offen { min-height: 360px; }
/* ra-buehne--mobil-drawer: Drawer der Mobil-Navigation (mobile-drawer). Das
   DS blendet Drawer und Backdrop ab 1200 px FENSTERbreite aus
   (display: none !important, 07-organisms/_mobile-drawer.scss); im Rahmen
   gilt die Lage darunter — dieselbe Ausnahme wie ra-nav-mobil. */
.ra-live-component .ra-buehne--mobil-drawer {
  max-width: 420px;
  background: var(--fnd-color-background-secondary);
}
.ra-live-component .ra-buehne--mobil-drawer :is(.nc-mobile-drawer, .nc-mobile-drawer__backdrop) { display: block !important; }
/* ra-kapitelseite: kleine Seite fuer die Kapitelnavigation in „Ausprobieren"
   (Entscheidung 06.10.2026, website-verhalten) — eigener Scroll-Container,
   die Leiste klebt darin oben, die Kapitel sind hohe Platzhalter, damit der
   Scroll-Spy etwas zu tun hat. */
.ra-live-component .ra-kapitelseite {
  width: 560px;
  max-width: 100%;
  height: 360px;
  overflow-y: auto;
  background: var(--fnd-color-background-base);
  border: 1px solid var(--fnd-color-border-primary);
}
.ra-live-component .ra-platzhalter--kapitel { min-height: 280px; margin: 16px; }
/* ra-refseite: kleine Seite fuer die Referenzseite in „Ausprobieren"
   (Entscheidung Abschluss 08.10.2026, scroll-spy) — eigener Scroll-Container
   ohne Verkleinerung (der Spy rechnet in CSS-Pixeln), Verzeichnis klebt darin
   rechts, die Abschnitte scrollen. */
.ra-live-component .ra-refseite {
  width: 1040px;
  max-width: 100%;
  height: 420px;
  overflow-y: auto;
  background: var(--fnd-color-background-base);
  border: 1px solid var(--fnd-color-border-primary);
}
/* ra-legende: Erlaeuterung neben echtem Markup (Token-Kette, Schichten) —
   Arena-Text, kein DS-Element */
.ra-live-component .ra-legende {
  display: grid;
  gap: 4px;
  margin: 0;
  font-size: 12px;
  color: var(--fnd-color-text-secondary);
}
.ra-live-component .ra-legende > div { display: flex; gap: 8px; }
.ra-live-component .ra-legende dt { min-width: 120px; font-weight: 600; color: var(--fnd-color-text-primary); }
.ra-live-component .ra-legende dd { margin: 0; }
.ra-live-component .ra-legende code { font: 500 11px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; }

/* Theme-Achse: dunkle Zellen (neo-dark-theme bindet die Tokens lokal neu,
   siehe zellenFlaeche). .neo-surface kommt in Drupal aus neo-overrides.css,
   nicht aus styles.css — hier dieselbe Regel fuer die Arena. */
.ra-filter-stand { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin: 0 0 12px; font-size: 12px; color: var(--cfg-text-muted); }

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
  font-size: 10px;
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
  /* UX-19: Grün nur als Fläche/Rahmen, Text in lesbarer Farbe (vorher 2,5:1) */
  background: color-mix(in srgb, var(--fnd-color-feedback-success, #22c55e) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--fnd-color-feedback-success, #22c55e) 45%, transparent);
  color: var(--cfg-text);
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
.ra-modus__knopf--abspielen { margin-left: 8px; }
.ra-modus__knopf--abspielen:first-child { margin-left: 0; }
.ra-modus__knopf:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
</style>

<style>
/* Im Geräterahmen gilt die echte Fensterbreite: ra-massstab (1600 px,
   1:2,7) und ra-desktop (1280 px, 1:2,4) waren der Behelf für die Ansicht
   „Voll“ — im Rahmen verkleinerten sie ein zweites Mal (19.10.2026). */
.br-geraet .recipe-arena .ra-live-component :is(.ra-massstab, .ra-desktop) { width: auto; zoom: 1; padding-block: 0; background: none; border-radius: 0; }
/* Ungekapselt: der Behälter .br-geraet liegt im Frame von BreitenRahmen,
   außerhalb dieser Komponente. .recipe-arena hebt die Spezifität über die
   gekapselten Regeln (Attribut-Selektor). */
/* Geräteansicht (Roadmap V01): Im Frame mit Handy-, Tablet- oder
   Desktop-Breite bekommt das Bauteil die ganze Fensterbreite. Beschriftung
   über den Zellen, keine Rahmen und Innenabstände der Arena. */
.br-geraet .recipe-arena > :not(.ra-specimen) { padding-inline: 12px; }
.br-geraet .recipe-arena .ra-specimen { padding: 0; border: 0; border-radius: 0; }
.br-geraet .recipe-arena .ra-specimen > :not(.ra-preview-gruppe) { margin-inline: 12px; }
.br-geraet .recipe-arena .ra-preview { padding: 0; border: 0; border-radius: 0; overflow: visible; }
.br-geraet .recipe-arena .ra-matrix-row { flex-direction: column; gap: 6px; }
.br-geraet .recipe-arena .ra-axis-label { min-width: 0; padding: 0 12px; }
.br-geraet .recipe-arena .ra-cells { flex-direction: column; align-items: stretch; width: 100%; }
.br-geraet .recipe-arena .ra-cell { width: 100%; }
.br-geraet .recipe-arena .ra-cell-label { padding-inline: 12px; }
/* Seitenbreite Blöcke stehen sonst in einer festen 1280-px-Seite (ra-desktop,
   verkleinert) — im Gerät gilt die echte Fensterbreite. */
.br-geraet .recipe-arena .ra-live-component .ra-desktop { width: auto; zoom: 1; flex-shrink: 1; }
/* UX-59: Kopfzeile und offenes Navigationsmenü stehen sonst in festen
   1080-px-Rahmen — im Gerät zeigen sie, was die Website bei dieser Breite
   zeigt (unter 1200 px die mobile Lage mit Menü-Knopf). */
.br-geraet .recipe-arena .ra-live-component :is(.ra-kopf, .ra-anker--desktop) { min-width: 0; }
.br-geraet .recipe-arena .ra-live-component[data-ausgeblendet] > * { display: none; }
.br-geraet .recipe-arena .ra-live-component[data-ausgeblendet]::before {
  content: 'Bei dieser Fensterbreite blendet das Design System dieses Bauteil aus.';
  display: block;
  padding: 12px;
  font-size: 12px;
  color: var(--cfg-text-secondary, #475569);
  border: 1px dashed var(--cfg-border, #cbd5e1);
  border-radius: 6px;
}
</style>
