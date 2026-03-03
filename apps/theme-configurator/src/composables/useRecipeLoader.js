// ==========================================================================
// Recipe Loader Composable
// ==========================================================================
// Lazy-laedt Recipe-JSON-Dateien via Vite dynamic import (Code-Splitting).
// Cached geladene Recipes. Nutzt loadRecipe() aus recipe-sdk.
// ==========================================================================

import { ref, watch, shallowRef } from 'vue'
import { loadRecipe } from 'recipe-sdk'

// ---------------------------------------------------------------------------
// Static import map: alle Recipe-Dateien als lazy imports
// ---------------------------------------------------------------------------
const RECIPE_IMPORTS = {
  accordion: () => import('../../../../data/accordion-recipe.json'),
  alert: () => import('../../../../data/alert-recipe.json'),
  'alert-dialog': () => import('../../../../data/alert-dialog-recipe.json'),
  avatar: () => import('../../../../data/avatar-recipe.json'),
  badge: () => import('../../../../data/badge-recipe.json'),
  banner: () => import('../../../../data/banner-recipe.json'),
  breadcrumb: () => import('../../../../data/breadcrumb-recipe.json'),
  button: () => import('../../../../data/button-recipe.json'),
  card: () => import('../../../../data/card-recipe.json'),
  carousel: () => import('../../../../data/carousel-recipe.json'),
  checkbox: () => import('../../../../data/checkbox-recipe.json'),
  'checkbox-group': () => import('../../../../data/checkbox-group-recipe.json'),
  chip: () => import('../../../../data/chip-recipe.json'),
  'code-snippet': () => import('../../../../data/code-snippet-recipe.json'),
  cta: () => import('../../../../data/cta-recipe.json'),
  'data-table': () => import('../../../../data/data-table-recipe.json'),
  divider: () => import('../../../../data/divider-recipe.json'),
  drawer: () => import('../../../../data/drawer-recipe.json'),
  'dropdown-menu': () => import('../../../../data/dropdown-menu-recipe.json'),
  'empty-state': () => import('../../../../data/empty-state-recipe.json'),
  facts: () => import('../../../../data/facts-recipe.json'),
  faq: () => import('../../../../data/faq-recipe.json'),
  'feature-accordion': () => import('../../../../data/feature-accordion-recipe.json'),
  fieldset: () => import('../../../../data/fieldset-recipe.json'),
  'file-upload': () => import('../../../../data/file-upload-recipe.json'),
  footer: () => import('../../../../data/footer-recipe.json'),
  form: () => import('../../../../data/form-recipe.json'),
  'form-actions': () => import('../../../../data/form-actions-recipe.json'),
  'form-error': () => import('../../../../data/form-error-recipe.json'),
  'form-field': () => import('../../../../data/form-field-recipe.json'),
  'form-hint': () => import('../../../../data/form-hint-recipe.json'),
  'form-label': () => import('../../../../data/form-label-recipe.json'),
  'form-section': () => import('../../../../data/form-section-recipe.json'),
  header: () => import('../../../../data/header-recipe.json'),
  hero: () => import('../../../../data/hero-recipe.json'),
  icon: () => import('../../../../data/icon-recipe.json'),
  input: () => import('../../../../data/input-recipe.json'),
  'input-group': () => import('../../../../data/input-group-recipe.json'),
  item: () => import('../../../../data/item-recipe.json'),
  kbd: () => import('../../../../data/kbd-recipe.json'),
  label: () => import('../../../../data/label-recipe.json'),
  'link-with-arrow': () => import('../../../../data/link-with-arrow-recipe.json'),
  'logo-wall': () => import('../../../../data/logo-wall-recipe.json'),
  marquee: () => import('../../../../data/marquee-recipe.json'),
  metric: () => import('../../../../data/metric-recipe.json'),
  modal: () => import('../../../../data/modal-recipe.json'),
  'nav-atoms': () => import('../../../../data/nav-atoms-recipe.json'),
  'nav-molecules': () => import('../../../../data/nav-molecules-recipe.json'),
  navigation: () => import('../../../../data/navigation-recipe.json'),
  'navigation-menu': () => import('../../../../data/navigation-menu-recipe.json'),
  notification: () => import('../../../../data/notification-recipe.json'),
  'otp-input': () => import('../../../../data/otp-input-recipe.json'),
  pagination: () => import('../../../../data/pagination-recipe.json'),
  popover: () => import('../../../../data/popover-recipe.json'),
  pricing: () => import('../../../../data/pricing-recipe.json'),
  progress: () => import('../../../../data/progress-recipe.json'),
  question: () => import('../../../../data/question-recipe.json'),
  radio: () => import('../../../../data/radio-recipe.json'),
  'radio-group': () => import('../../../../data/radio-group-recipe.json'),
  rating: () => import('../../../../data/rating-recipe.json'),
  search: () => import('../../../../data/search-recipe.json'),
  'security-list': () => import('../../../../data/security-list-recipe.json'),
  'segmented-control': () => import('../../../../data/segmented-control-recipe.json'),
  select: () => import('../../../../data/select-recipe.json'),
  sidebar: () => import('../../../../data/sidebar-recipe.json'),
  skeleton: () => import('../../../../data/skeleton-recipe.json'),
  slider: () => import('../../../../data/slider-recipe.json'),
  solutions: () => import('../../../../data/solutions-recipe.json'),
  spinner: () => import('../../../../data/spinner-recipe.json'),
  square: () => import('../../../../data/square-recipe.json'),
  'square-value': () => import('../../../../data/square-value-recipe.json'),
  status: () => import('../../../../data/status-recipe.json'),
  stepper: () => import('../../../../data/stepper-recipe.json'),
  switch: () => import('../../../../data/switch-recipe.json'),
  table: () => import('../../../../data/table-recipe.json'),
  tag: () => import('../../../../data/tag-recipe.json'),
  testimonial: () => import('../../../../data/testimonial-recipe.json'),
  'text-blocks': () => import('../../../../data/text-blocks-recipe.json'),
  'text-only': () => import('../../../../data/text-only-recipe.json'),
  textarea: () => import('../../../../data/textarea-recipe.json'),
  timeline: () => import('../../../../data/timeline-recipe.json'),
  toast: () => import('../../../../data/toast-recipe.json'),
  'toggle-group': () => import('../../../../data/toggle-group-recipe.json'),
  toolbar: () => import('../../../../data/toolbar-recipe.json'),
  tooltip: () => import('../../../../data/tooltip-recipe.json'),
  treeview: () => import('../../../../data/treeview-recipe.json'),
  'validation-summary': () => import('../../../../data/validation-summary-recipe.json'),
  'video-section': () => import('../../../../data/video-section-recipe.json'),

  // Layout Primitives
  container: () => import('../../../../data/container-recipe.json'),
  grid: () => import('../../../../data/grid-recipe.json'),
  spacing: () => import('../../../../data/spacing-recipe.json'),
  section: () => import('../../../../data/section-recipe.json'),

  // Layout Specs (Base)
  'layout-marketing': () => import('../../../../data/layout-marketing.json'),
  'layout-docs': () => import('../../../../data/layout-docs.json'),
  'layout-dashboard': () => import('../../../../data/layout-dashboard.json'),
  'layout-form': () => import('../../../../data/layout-form.json'),
  'layout-content': () => import('../../../../data/layout-content.json'),

  // Layout Specs (Derived)
  'layout-marketing-compact': () => import('../../../../data/layout-marketing-compact.json'),
  'layout-marketing-dark': () => import('../../../../data/layout-marketing-dark.json'),
  'layout-docs-wide': () => import('../../../../data/layout-docs-wide.json'),
  'layout-docs-narrow': () => import('../../../../data/layout-docs-narrow.json'),
  'layout-dashboard-spacious': () => import('../../../../data/layout-dashboard-spacious.json'),
  'layout-dashboard-sidebar': () => import('../../../../data/layout-dashboard-sidebar.json'),
  'layout-form-compact': () => import('../../../../data/layout-form-compact.json'),
  'layout-form-wide': () => import('../../../../data/layout-form-wide.json'),
  'layout-content-magazine': () => import('../../../../data/layout-content-magazine.json'),
  'layout-content-landing': () => import('../../../../data/layout-content-landing.json')
}

// ---------------------------------------------------------------------------
// Globaler Cache (shared between all composable instances)
// ---------------------------------------------------------------------------
const _cache = {}

/**
 * Checks whether a recipe import exists for a given component ID.
 * @param {string} componentId
 * @returns {boolean}
 */
export function hasRecipe(componentId) {
  return componentId in RECIPE_IMPORTS
}

/**
 * Returns list of all component IDs that have recipe files.
 * @returns {string[]}
 */
export function recipeComponentIds() {
  return Object.keys(RECIPE_IMPORTS)
}

/**
 * Vue 3 Composable: laedt ein Recipe fuer eine gegebene Component-ID.
 *
 * @param {import('vue').Ref<string>|string} componentIdRef — reactive or plain string
 * @returns {{ recipe: Ref, loading: Ref<boolean>, error: Ref<string|null> }}
 */
export function useRecipeLoader(componentIdRef) {
  const recipe = shallowRef(null)
  const loading = ref(false)
  const error = ref(null)

  async function load(id) {
    if (!id) { recipe.value = null; return }

    // Check cache first
    if (_cache[id]) {
      recipe.value = _cache[id]
      return
    }

    // Check if import exists
    const importFn = RECIPE_IMPORTS[id]
    if (!importFn) {
      recipe.value = null
      return
    }

    loading.value = true
    error.value = null

    try {
      const module = await importFn()
      const raw = module.default || module
      const loaded = loadRecipe(raw)
      _cache[id] = loaded
      recipe.value = loaded
    } catch (err) {
      console.warn(`[RecipeLoader] Failed to load recipe for "${id}":`, err)
      error.value = err.message
      recipe.value = null
    } finally {
      loading.value = false
    }
  }

  // Watch for changes if ref is reactive
  if (typeof componentIdRef === 'object' && componentIdRef.value !== undefined) {
    watch(componentIdRef, (newId) => load(newId), { immediate: true })
  } else {
    load(componentIdRef)
  }

  return { recipe, loading, error }
}
