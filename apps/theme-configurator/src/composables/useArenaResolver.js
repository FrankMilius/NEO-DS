// ==========================================================================
// Arena Resolver — Dynamic Component Loading fuer LaboratoryPanel
// ==========================================================================
// Regel (Plan v2, 3.5): Arenen entstehen aus den Recipes — so wie die
// Drupal-Komponenten. Jede Komponente ohne Eintrag in SONDERFAELLE bekommt
// die RecipeArena (Specimens aus dem Recipe, Markup aus
// src/arena-templates/<id>.js oder per Slot-Heuristik).
//
// SONDERFAELLE sind handgeschriebene Arenen. Sie bleiben vorerst, bis ihre
// Recipes eine Vorlage haben; neue kommen nur fuer echte Sonderfaelle dazu
// (z. B. Arenen mit eigener Interaktion oder Canvas).
//
// Abgeloest (Plan v3, Phase 1): select, search — echtes DS-Markup, Komposition
// mit dem Input (natives Select, Entscheidung 01.10.2026).
//
// Abgeloest (Plan v3, Phase 3, Block Formular): input, textarea, checkbox,
// radio, switch, range, rating, segmented-control, toggle-group, form-field,
// input-group, fieldset — native Felder echt und bedienbar, Zustaende ueber
// DS-Klassen und -Attribute statt Inline-Stilen.
//
// Abgeloest (Plan v3, Phase 3, Block Overlays): dropdown-menu, popover,
// tooltip, modal, drawer, alert-dialog — DS-Markup nach SCSS-Struktur, in
// „Zustände" fest geoeffnet (Panel sichtbar, Dialoge im Arena-Rahmen
// ra-buehne), in „Ausprobieren" geschlossen und per neo-behaviors bedienbar
// (alert-dialog: noch ohne Verhalten).
//
// Abgeloest (Plan v3, Phase 3, Block Navigation): breadcrumb, pagination,
// navigation, navigation-menu, sidebar, treeview, toolbar — DS-Markup nach
// SCSS-Struktur und Doku (navigation-menu damals nach dem Prototyp), nur
// „Zustände": keines der Recipes gibt keyboard/events vor, neo-behaviors hat
// fuer sie kein Verhalten. Offene Zustaende fest (Breadcrumb-Dropdown,
// Navigationsmenue-Viewport), Arena-Rahmen ra-kopf/ra-kulisse/ra-spalte und
// ra-buehne--mobil fuer die Mobil-Lage der Sidebar.
//
// Abgeloest (Plan v3, Phase 3, Block Rueckmeldung): toast, notification,
// alert, banner — DS-Markup nach SCSS-Struktur und data/markup, Toaster und
// festes Banner im Arena-Rahmen ra-bildschirm, Ausblend-Zustaende als
// Standbild (ra-standbild); „Ausprobieren" mit den neuen Behaviors aus
// neo-behaviors (Schliessen, Escape, Auto-Ausblenden mit Pause, Wischen,
// Gelesen) und „Erneut zeigen".
//
// Abgeloest (Plan v3, Phase 3, Block Bausteine): button, item, metric,
// code-snippet — DS-Markup nach SCSS-Struktur und data/markup, alle
// Specimens der Recipes (Toggle mit nc-button--toggle, Loading mit
// nc-button--loading, Item-Zustaende als Optionen einer Listbox, Kennzahlen
// im nc-metric-grid); „Ausprobieren" nur beim Code-Snippet (Kopieren,
// Mehr/Weniger aus neo-behaviors).
//
// Gestrichen (Entscheidung 06.10.2026): FormLayoutArena — die letzte
// handgeschriebene Arena. form-layout war ein Muster ohne Recipe und ohne
// SCSS; dieselbe Komposition (form-section, form-field, form-actions,
// validation-summary) zeigt die RecipeArena von `form`, die in der
// Navigation schon als eigene Sektion „Form" unter „Form Structure" steht.
// Ein Alias form-layout → form haette diese Sektion nur verdoppelt; die
// Sektion component-form-layout entfaellt deshalb (Registry ohne Eintrag).
//
// Abgeloest (Plan v3, Phase 3, Block Inhalte): card, accordion, data-table
// und table — DS-Markup nach SCSS-Struktur und data/markup (Website: Karte
// und Akkordeon), statt nachgezeichneter Inline-Stile. „Ausprobieren" nur fuer
// das Akkordeon (neo-behaviors accordion); Karte und Datentabelle nennen im
// Recipe weder keyboard noch events. `table` hat kein eigenes Recipe mehr: es
// wurde am 25.08.2026 mit compare-table zusammengelegt (dieselbe Wurzel
// .nc-compare-table, dieselben --nc-table-*-Tokens, 05-atoms/_table.scss) —
// die Sektion „Table" zeigt deshalb die Arena von compare-table (ALIASE).
//
// Abgeloest (Plan v3, Phase 3, Block Layout): container, grid, section,
// hero, shell, psychedelic-bg — echtes DS-Markup statt Schemazeichnungen.
// Layout-Bauteile in Arena-Rahmen: ra-massstab (Desktop-Seite 1:2,5 fuer
// die Containerbreiten), ra-seite (Kante der Section), ra-mobil (Raster in
// der Mobil-Lage), ra-fenster/--mobil (Shell als Miniatur, Drawer und
// Footerbar unter lg), ra-effekt (Canvas). Modifier, die das Recipe
// beschreibt und styles.css nicht kennt, zeigt die Arena als „nicht gebaut"
// (arena-templates/_layout.js). psychedelic-bg: „Ausprobieren" mit dem
// Canvas-Renderer des Konfigurators (kein Behavior in neo-behaviors).
// Die Grid-Buehne der Foundation liegt unter laboratory/foundation/.
//
// Abgeloest (Stufe 4): avatar, badge, chip, label, progress, skeleton,
// spinner, status, tag — Vorlage vorhanden, alle Recipe-Specimens inkl.
// Kompositionen, Split-Modus hell/dunkel. Die *Arena.vue-Dateien bleiben
// liegen, solange meta.pipeline.arena der Recipes (data/) darauf zeigt.
//
// Verwendung:
//   const { resolvedArena } = useArenaResolver(componentId)
//   <component :is="resolvedArena" />
// ==========================================================================

import { computed, defineAsyncComponent, markRaw, h } from 'vue'

// ---------------------------------------------------------------------------
// Sonderfall-Liste: componentId → handgeschriebene Arena (lazy import)
// ---------------------------------------------------------------------------

// Derzeit leer (Entscheidung 06.10.2026: FormLayoutArena gestrichen). Die
// Liste bleibt fuer kuenftige echte Sonderfaelle.
/** @type {Record<string, () => Promise<any>>} */
const SONDERFAELLE = {}

// Sektionen ohne eigenes Recipe, deren Bauteil unter anderer ID im Recipe
// steht: Sektion → Recipe-ID. Die Arena ist dann die RecipeArena des Recipes.
const ALIASE = {
  // Zusammengelegt am 25.08.2026 (Dublette): Inhalt aus table, Name aus der
  // Wurzelklasse .nc-compare-table. Die Sektion „Table" traegt die
  // --nc-table-*-Tokens weiter — sie gehoeren zu diesem Bauteil.
  table: 'compare-table'
}

// Regelfall: RecipeArena. LaboratoryPanel rendert `<component :is>` ohne
// Props — die Komponenten-ID wird deshalb hier gebunden. (Vorher bekam der
// Fallback gar keine ID und blieb leer.)
const RECIPE_ARENA = () => import('../components/laboratory/RecipeArena.vue')

function recipeArenaFuer (id, sektion = id) {
  return () => RECIPE_ARENA().then((modul) => ({
    name: 'RecipeArenaFuer',
    // sektion: fuer die Token-Hervorhebung (--nc-<sektion>-*), wenn die
    // Sektion anders heisst als das Recipe (ALIASE)
    render: () => h(modul.default, { componentId: id, sektion })
  }))
}

// Cache fuer bereits erstellte AsyncComponents (vermeidet Neuinstanziierung)
const _cache = new Map()

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------

/**
 * Resolved eine Arena-Komponente fuer einen gegebenen componentId.
 * @param {import('vue').Ref<string>|import('vue').ComputedRef<string>} componentIdRef
 * @returns {{ resolvedArena: import('vue').ComputedRef, hasDedicatedArena: import('vue').ComputedRef<boolean> }}
 */
export function useArenaResolver (componentIdRef) {
  const resolvedArena = computed(() => {
    const id = typeof componentIdRef === 'string' ? componentIdRef : componentIdRef.value
    if (!id) return null

    // Cache pruefen
    if (_cache.has(id)) return _cache.get(id)

    const loader = SONDERFAELLE[id] || recipeArenaFuer(ALIASE[id] || id, id)

    const asyncComp = markRaw(defineAsyncComponent({
      loader,
      loadingComponent: null,
      delay: 0,
      timeout: 10000,
      onError (error, retry, fail) {
        console.warn(`[ArenaResolver] Fehler beim Laden von "${id}":`, error.message)
        fail()
      },
    }))

    _cache.set(id, asyncComp)
    return asyncComp
  })

  const hasDedicatedArena = computed(() => {
    const id = typeof componentIdRef === 'string' ? componentIdRef : componentIdRef.value
    return !!SONDERFAELLE[id]
  })

  return { resolvedArena, hasDedicatedArena }
}

/**
 * Prueft ob fuer einen componentId eine dedizierte Arena existiert.
 * @param {string} componentId
 * @returns {boolean}
 */
export function hasArena (componentId) {
  return !!SONDERFAELLE[componentId]
}

/**
 * Woher kommt die Arena? 'sonderfall' (handgeschrieben) oder 'recipe'.
 * @param {string} componentId
 * @returns {'sonderfall'|'recipe'}
 */
export function arenaQuelle (componentId) {
  return SONDERFAELLE[componentId] ? 'sonderfall' : 'recipe'
}

/**
 * Recipe-ID, deren RecipeArena die Sektion zeigt (ALIASE), sonst die ID selbst.
 * @param {string} componentId
 * @returns {string}
 */
export function arenaRecipe (componentId) {
  return ALIASE[componentId] || componentId
}

/**
 * Gibt alle registrierten Arena-IDs zurueck.
 * @returns {string[]}
 */
export function getRegisteredArenas () {
  return Object.keys(SONDERFAELLE)
}
