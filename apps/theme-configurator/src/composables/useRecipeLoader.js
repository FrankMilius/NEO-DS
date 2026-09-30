// ==========================================================================
// Recipe Loader Composable
// ==========================================================================
// Lazy-laedt Recipe-JSON-Dateien via Vite dynamic import (Code-Splitting).
// Cached geladene Recipes. Nutzt loadRecipe() aus recipe-sdk.
// ==========================================================================

import { ref, watch, shallowRef, isRef } from 'vue'
import { loadRecipe } from 'recipe-sdk'

// ---------------------------------------------------------------------------
// Import-Liste — aus dem Ordner, nicht von Hand
// ---------------------------------------------------------------------------
// Hier stand eine haendisch gepflegte Liste mit 120 Eintraegen neben einem
// Ordner mit 167 Dateien. Zwei Quellen fuer dieselbe Frage driften, und genau
// das war passiert:
//
//   slider-recipe.json   in der Liste, im Ordner nicht mehr (am 19.08.2026 in
//                        range und carousel geteilt). Vite kann den Import
//                        nicht aufloesen, das Modul liefert 500 — und die
//                        GANZE App montiert nicht mehr. Ein umbenanntes Recipe
//                        legt den Konfigurator lahm.
//
//   27 Recipes           im Ordner, in der Liste nicht. Sie waren im
//                        Konfigurator schlicht nicht vorhanden: kein Fehler,
//                        keine Meldung, nur ein Bauteil, das niemand einstellen
//                        kann.
//
// `import.meta.glob` liest den Ordner beim Bauen. Ein neues Recipe ist damit
// sofort da, ein umbenanntes kann nichts mehr kaputtmachen.
//
// Die Kennung ist der Dateiname ohne `-recipe.json` — genau die Schreibweise,
// die die alte Liste von Hand gefuehrt hat (alert-dialog, card-grid, …).
const RECIPE_MODULES = import.meta.glob('../../../../data/*-recipe.json')
const LAYOUT_MODULES = import.meta.glob('../../../../data/layout-*.json')

function kennungAus(pfad, endung) {
  return pfad.split('/').pop().slice(0, -endung.length)
}

const RECIPE_IMPORTS = {}
for (const [pfad, laden] of Object.entries(RECIPE_MODULES)) {
  RECIPE_IMPORTS[kennungAus(pfad, '-recipe.json')] = laden
}
// Layout-Specs tragen kein `-recipe` im Namen und wuerden sonst fehlen.
for (const [pfad, laden] of Object.entries(LAYOUT_MODULES)) {
  const kennung = kennungAus(pfad, '.json')
  if (!(kennung in RECIPE_IMPORTS)) RECIPE_IMPORTS[kennung] = laden
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

  // Reaktive Quelle beobachten. Frueher stand hier `componentIdRef.value !==
  // undefined` — ein computed, das anfangs undefined liefert, galt dann als
  // fester String und wurde nie wieder gelesen.
  if (isRef(componentIdRef)) {
    watch(componentIdRef, (newId) => load(newId), { immediate: true })
  } else {
    load(componentIdRef)
  }

  return { recipe, loading, error }
}
