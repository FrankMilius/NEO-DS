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
// Mehr/Weniger aus neo-behaviors). form-layout bleibt Sonderfall: es hat
// kein Recipe (Muster, Entscheidung offen).
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

const SONDERFAELLE = {
  card: () => import('../components/laboratory/CardArena.vue'),
  accordion: () => import('../components/laboratory/AccordionArena.vue'),
  'form-layout': () => import('../components/laboratory/FormLayoutArena.vue'),
  table: () => import('../components/laboratory/TableArena.vue'),
  'data-table': () => import('../components/laboratory/DataTableArena.vue'),
  grid: () => import('../components/laboratory/GridArena.vue'),
  hero: () => import('../components/laboratory/HeroArena.vue'),
  container: () => import('../components/laboratory/ContainerArena.vue'),
  section: () => import('../components/laboratory/SectionArena.vue'),
  shell: () => import('../components/laboratory/ShellArena.vue'),
  'psychedelic-bg': () => import('../components/laboratory/PsychedelicBgArena.vue'),
}

// Regelfall: RecipeArena. LaboratoryPanel rendert `<component :is>` ohne
// Props — die Komponenten-ID wird deshalb hier gebunden. (Vorher bekam der
// Fallback gar keine ID und blieb leer.)
const RECIPE_ARENA = () => import('../components/laboratory/RecipeArena.vue')

function recipeArenaFuer (id) {
  return () => RECIPE_ARENA().then((modul) => ({
    name: 'RecipeArenaFuer',
    render: () => h(modul.default, { componentId: id })
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

    const loader = SONDERFAELLE[id] || recipeArenaFuer(id)

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
 * Gibt alle registrierten Arena-IDs zurueck.
 * @returns {string[]}
 */
export function getRegisteredArenas () {
  return Object.keys(SONDERFAELLE)
}
