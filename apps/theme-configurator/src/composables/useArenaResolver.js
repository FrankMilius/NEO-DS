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
// Verwendung:
//   const { resolvedArena } = useArenaResolver(componentId)
//   <component :is="resolvedArena" />
// ==========================================================================

import { computed, defineAsyncComponent, markRaw, h } from 'vue'

// ---------------------------------------------------------------------------
// Sonderfall-Liste: componentId → handgeschriebene Arena (lazy import)
// ---------------------------------------------------------------------------

const SONDERFAELLE = {
  avatar: () => import('../components/laboratory/AvatarArena.vue'),
  badge: () => import('../components/laboratory/BadgeArena.vue'),
  status: () => import('../components/laboratory/StatusArena.vue'),
  card: () => import('../components/laboratory/CardArena.vue'),
  button: () => import('../components/laboratory/ButtonArena.vue'),
  switch: () => import('../components/laboratory/SwitchArena.vue'),
  checkbox: () => import('../components/laboratory/CheckboxArena.vue'),
  radio: () => import('../components/laboratory/RadioArena.vue'),
  range: () => import('../components/laboratory/RangeArena.vue'),
  rating: () => import('../components/laboratory/RatingArena.vue'),
  input: () => import('../components/laboratory/InputArena.vue'),
  textarea: () => import('../components/laboratory/TextareaArena.vue'),
  select: () => import('../components/laboratory/SelectArena.vue'),
  alert: () => import('../components/laboratory/AlertArena.vue'),
  toast: () => import('../components/laboratory/ToastArena.vue'),
  banner: () => import('../components/laboratory/BannerArena.vue'),
  tooltip: () => import('../components/laboratory/TooltipArena.vue'),
  accordion: () => import('../components/laboratory/AccordionArena.vue'),
  breadcrumb: () => import('../components/laboratory/BreadcrumbArena.vue'),
  pagination: () => import('../components/laboratory/PaginationArena.vue'),
  'segmented-control': () => import('../components/laboratory/SegmentedControlArena.vue'),
  'toggle-group': () => import('../components/laboratory/ToggleGroupArena.vue'),
  chip: () => import('../components/laboratory/ChipArena.vue'),
  tag: () => import('../components/laboratory/TagArena.vue'),
  'dropdown-menu': () => import('../components/laboratory/DropdownMenuArena.vue'),
  'form-field': () => import('../components/laboratory/FormFieldArena.vue'),
  fieldset: () => import('../components/laboratory/FieldsetArena.vue'),
  metric: () => import('../components/laboratory/MetricArena.vue'),
  toolbar: () => import('../components/laboratory/ToolbarArena.vue'),
  progress: () => import('../components/laboratory/ProgressArena.vue'),
  'code-snippet': () => import('../components/laboratory/CodeSnippetArena.vue'),
  search: () => import('../components/laboratory/SearchArena.vue'),
  'alert-dialog': () => import('../components/laboratory/AlertDialogArena.vue'),
  modal: () => import('../components/laboratory/ModalArena.vue'),
  drawer: () => import('../components/laboratory/DrawerArena.vue'),
  notification: () => import('../components/laboratory/NotificationArena.vue'),
  popover: () => import('../components/laboratory/PopoverArena.vue'),
  sidebar: () => import('../components/laboratory/SidebarArena.vue'),
  'navigation-menu': () => import('../components/laboratory/NavigationMenuArena.vue'),
  navigation: () => import('../components/laboratory/NavigationArena.vue'),
  treeview: () => import('../components/laboratory/TreeviewArena.vue'),
  'input-group': () => import('../components/laboratory/InputGroupArena.vue'),
  'form-layout': () => import('../components/laboratory/FormLayoutArena.vue'),
  label: () => import('../components/laboratory/LabelArena.vue'),
  skeleton: () => import('../components/laboratory/SkeletonArena.vue'),
  spinner: () => import('../components/laboratory/SpinnerArena.vue'),
  item: () => import('../components/laboratory/ItemArena.vue'),
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
