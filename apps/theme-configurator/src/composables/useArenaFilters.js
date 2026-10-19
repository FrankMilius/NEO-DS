// ==========================================================================
// useArenaFilters — Filter-Composable fuer Arena-Specimens
// ==========================================================================
// Extrahiert Filterkategorien (Varianten, Groessen, Zustaende) aus Recipe-
// Daten und synchronisiert sie mit dem Store. Liefert Computed-Helpers
// fuer Filterbar-Dropdowns, Chip-Bar und Arena-Cell-Sichtbarkeit.
// ==========================================================================

import { computed } from 'vue'
import { useThemeStore } from '../stores/theme.js'
import { achsenAlsObjekt } from '../lib/recipe-arena.js'

// ---------------------------------------------------------------------------
// Axis-Name → generische Filter-Kategorie Mapping
// ---------------------------------------------------------------------------
// Achsen die auf die 3 Standard-Kategorien gemappt werden:
const VARIANT_AXES = ['variant', 'tone', 'severity', 'color']
const SIZE_AXIS = 'size'
// Achsen die keinen visuellen Mehrwert als Filter bieten → ausblenden:
const SKIP_AXES = []

// Label-Mapping fuer komponentenspezifische Achsen
// Block 5e: Achsennamen deutsch (Begriffsliste); Werte bleiben die Namen
// aus dem Design System
const AXIS_LABELS = {
  variants: 'Varianten',
  sizes: 'Größen',
  states: 'Zustände',
  emphasis: 'Betonung',
  pattern: 'Muster',
  content: 'Inhalt',
  decorator: 'Schmuck',
  composition: 'Zusammensetzung',
  validation: 'Prüfung',
  behavior: 'Verhalten',
  density: 'Dichte',
  feature: 'Funktion',
  mode: 'Modus',
  orientation: 'Lage',
  position: 'Position',
  shape: 'Form',
  style: 'Stil',
  spacing: 'Abstand',
  display: 'Darstellung',
  type: 'Typ',
  interactive: 'Bedienbar',
  separator: 'Trenner',
  alignment: 'Ausrichtung',
  syntax: 'Syntax',
  surface: 'Fläche',
  statusLevel: 'Statusstufe',
  width: 'Breite',
  gap: 'Lücke',
  layout: 'Layout',
  role: 'Rolle',
  overflow: 'Überlauf',
  sticky: 'Haftend',
  expandAll: 'Alle aufklappen',
  deepLink: 'Sprungziel',
  'media-layout': 'Medienlage',
  mediaPosition: 'Medienposition',
  markStyle: 'Markierung',
  badgesPosition: 'Badge-Position',
  cardsAlign: 'Karten-Ausrichtung',
  cardsRule: 'Karten-Linie',
  cardsSurface: 'Karten-Fläche',
  progress: 'Fortschritt',
  cardTone: 'Kartenton',
  headerAlign: 'Kopf-Ausrichtung',
  ctaVariant: 'CTA-Variante',
  textAlign: 'Textausrichtung',
}

const gross = (id) => id.charAt(0).toUpperCase() + id.slice(1)

/**
 * Filteroptionen einer Achse. Bezeichnung aus dem Recipe (label), gekuerzt
 * bis vor eine Klammer: „Line (Underline-Indikator)“ → „Line“. Eine
 * Bezeichnung, die nur den Schluessel wiederholt („left“), wird wie bisher
 * gross geschrieben.
 * @param {Record<string, any>} werte
 * @param {(id: string) => string} [standard]
 */
export function optionen (werte, standard = gross) {
  return Object.entries(werte || {}).map(([id, def]) => {
    const label = typeof def?.label === 'string' ? def.label.split(' (')[0].trim() : ''
    return { id, label: label && label !== id ? label : standard(id) }
  })
}

/**
 * Extrahiert ALLE Filteroptionen aus Recipe-Daten.
 * Mappt visuelle Achsen auf "variants", size auf "sizes",
 * states.supported auf "states", und alle weiteren Achsen
 * als komponentenspezifische Filter-Kategorien.
 *
 * @returns {Object} - { variants: [{id,label}], sizes: [...], states: [...], emphasis: [...], ... }
 */
export function extractFiltersFromRecipe(recipeData) {
  if (!recipeData) return { variants: [], sizes: [], states: [] }

  // Achsen als Liste (tabs, timeline, video …) wie in der Arena in Objektform
  // bringen. Vorher lieferte Object.keys() einer Liste „0 1 2“ (UX-40).
  const axes = achsenAlsObjekt(recipeData.axes)
  const result = {}

  // 1. Varianten: variant > tone > severity > color
  let variantAxisKey = null
  for (const key of VARIANT_AXES) {
    if (axes[key]) { variantAxisKey = key; break }
  }
  result.variants = variantAxisKey
    ? optionen(axes[variantAxisKey].values)
    : []

  // 2. Sizes
  result.sizes = axes[SIZE_AXIS]
    ? optionen(axes[SIZE_AXIS].values, id => id.toUpperCase())
    : []

  // 3. States (ohne "default")
  const supported = recipeData.states?.supported || []
  result.states = supported
    .filter(s => s !== 'default')
    .map(id => ({
      id,
      label: id.charAt(0).toUpperCase() + id.slice(1)
    }))

  // 4. Alle weiteren Achsen als komponentenspezifische Filter
  for (const [axisKey, axisData] of Object.entries(axes)) {
    // Bereits gemappt oder uebersprungen?
    if (axisKey === variantAxisKey) continue
    if (axisKey === SIZE_AXIS) continue
    if (SKIP_AXES.includes(axisKey)) continue
    if (!axisData.values) continue

    result[axisKey] = optionen(axisData.values)
  }

  return result
}

/**
 * Achse des Recipes hinter einer Filter-Kategorie: „variants“ → variant/
 * tone/severity/color, „sizes“ → size, sonst die Kategorie selbst.
 * „states“ ist keine Achse (Zustaende der Zelle) → null.
 */
export function filterAchse(recipeData, kategorie) {
  if (kategorie === 'states') return null
  if (kategorie === 'sizes') return SIZE_AXIS
  if (kategorie === 'variants') return VARIANT_AXES.find(k => recipeData?.axes?.[k]) || null
  return kategorie
}

/**
 * Liefert das Display-Label fuer eine Filter-Kategorie.
 */
export function filterCategoryLabel(key) {
  return AXIS_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1)
}

/**
 * Composable: liest Store-Filter und liefert reaktive Helpers.
 * Kategorien werden dynamisch aus availableOptions abgeleitet.
 *
 * @param {Ref<Object>} availableOptions - { variants: [{id,label}], sizes: [...], states: [...], emphasis: [...], ... }
 */
export function useArenaFilters(availableOptions) {
  const store = useThemeStore()

  // Kategorien dynamisch aus verfuegbaren Optionen ableiten
  const categories = computed(() => {
    const opts = availableOptions.value || {}
    return Object.keys(opts)
      .filter(key => (opts[key] || []).length > 0)
      .map(key => ({ key, label: filterCategoryLabel(key) }))
  })

  // -----------------------------------------------------------------------
  // Dropdown Items (fuer Filterbar-Dropdown)
  // -----------------------------------------------------------------------
  function dropdownItems(category) {
    const available = availableOptions.value?.[category] || []
    const filterMap = store.state.arenaFilters[category]
    return available.map(item => ({
      ...item,
      checked: !filterMap ? true : filterMap.has(item.id)
    }))
  }

  function toggleDropdownItem(category, id) {
    const available = availableOptions.value?.[category] || []
    const current = store.state.arenaFilters[category]

    if (!current) {
      // Alle waren selektiert → erzeuge Map mit allen AUSSER diesem
      const map = new Map()
      for (const item of available) {
        if (item.id !== id) map.set(item.id, true)
      }
      store.setArenaFilter(category, map.size === 0 ? null : map)
    } else if (current.has(id)) {
      // Item abwaehlen
      const map = new Map(current)
      map.delete(id)
      store.setArenaFilter(category, map.size === 0 ? null : map)
    } else {
      // Item hinzufuegen
      const map = new Map(current)
      map.set(id, true)
      // Wenn alle wieder drin → null (= all selected)
      if (map.size === available.length) {
        store.setArenaFilter(category, null)
      } else {
        store.setArenaFilter(category, map)
      }
    }
  }

  function selectAll(category) {
    store.setArenaFilter(category, null)
  }

  function deselectAll(category) {
    store.setArenaFilter(category, new Map())
  }

  // -----------------------------------------------------------------------
  // Chip Groups (fuer Chip-Bar)
  // -----------------------------------------------------------------------
  const chipGroups = computed(() => {
    return categories.value
      .map(cat => {
        const available = availableOptions.value?.[cat.key] || []
        const filterMap = store.state.arenaFilters[cat.key]
        if (available.length === 0) return null

        const items = !filterMap
          ? available.map(item => ({ id: item.id, label: item.label, active: true, selected: true }))
          : available
              .filter(item => filterMap.has(item.id))
              .map(item => ({ id: item.id, label: item.label, active: filterMap.get(item.id) !== false, selected: true }))

        return items.length > 0
          ? { category: cat.key, label: cat.label, items }
          : null
      })
      .filter(Boolean)
  })

  // -----------------------------------------------------------------------
  // Chip Actions
  // -----------------------------------------------------------------------
  function toggleChip(category, id) {
    const available = availableOptions.value?.[category] || []
    const current = store.state.arenaFilters[category]

    if (!current) {
      // Alle aktiv → setze dieses auf inactive
      const map = new Map()
      for (const item of available) {
        map.set(item.id, item.id !== id ? true : false)
      }
      store.setArenaFilter(category, map)
    } else {
      const map = new Map(current)
      const wasActive = map.get(id) !== false
      map.set(id, !wasActive)
      // Pruefen ob alle aktiv → null
      const allActive = available.every(item => !map.has(item.id) || map.get(item.id) !== false)
      if (allActive && map.size === available.length) {
        store.setArenaFilter(category, null)
      } else {
        store.setArenaFilter(category, map)
      }
    }
  }

  function removeChip(category, id) {
    const available = availableOptions.value?.[category] || []
    const current = store.state.arenaFilters[category]

    if (!current) {
      // Alle selektiert → entferne dieses eine
      const map = new Map()
      for (const item of available) {
        if (item.id !== id) map.set(item.id, true)
      }
      store.setArenaFilter(category, map.size === 0 ? null : map)
    } else {
      const map = new Map(current)
      map.delete(id)
      // Wenn alle wieder drin → null
      if (map.size === available.length) {
        store.setArenaFilter(category, null)
      } else {
        store.setArenaFilter(category, map.size === 0 ? null : map)
      }
    }
  }

  // -----------------------------------------------------------------------
  // Sichtbarkeit (fuer Arena-Cell-Filtering)
  // -----------------------------------------------------------------------
  function isValueVisible(category, id) {
    const filterMap = store.state.arenaFilters[category]
    if (!filterMap) return true
    return filterMap.has(id) && filterMap.get(id) !== false
  }

  // -----------------------------------------------------------------------
  // Counts (fuer Dropdown-Trigger Labels)
  // -----------------------------------------------------------------------
  function selectedCount(category) {
    const available = availableOptions.value?.[category] || []
    const filterMap = store.state.arenaFilters[category]
    if (!filterMap) return available.length
    return filterMap.size
  }

  function totalCount(category) {
    return (availableOptions.value?.[category] || []).length
  }

  return {
    categories,
    chipGroups,
    dropdownItems,
    toggleDropdownItem,
    selectAll,
    deselectAll,
    toggleChip,
    removeChip,
    isValueVisible,
    selectedCount,
    totalCount
  }
}
