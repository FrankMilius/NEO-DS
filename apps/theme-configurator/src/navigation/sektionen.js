// ==========================================================================
// Sektions-Registry: Sektion → { label, labor, inspector } (Plan v2, 3.4)
// ==========================================================================
// Ersetzt die v-if-Ketten in LaboratoryPanel und InspectorPanel. Beide
// Panels rendern per <component :is> aus dem aufgeloesten Eintrag:
//
//   label      Breadcrumb im Labor-Kopf ('' = keiner)
//   labor      Komponente fuer den Labor-Viewport (lazy per defineAsyncComponent)
//   inspector  Liste von Bloecken { komponente, props } fuer den Inspector;
//              leer = Hinweis „Select a section …" (wie bisher der v-else-Zweig)
//   schluessel Remount-Schluessel fuer den Inspector: Sektionen mit gleichem
//              Schluessel teilen sich die Instanz (vorher: derselbe v-if-Zweig)
//
// Foundation-Sektionen sind fest eingetragen; component-*, template-*,
// utility-* und module-* werden aus dem Praefix abgeleitet — so deckt die
// Registry jede Sektion ab, die navigation-builder.js erzeugt.
// ==========================================================================

import { defineAsyncComponent, markRaw } from 'vue'
import { NAVIGATIONS_SEKTIONEN } from './sektions-ids.js'

// Inspector-Komponenten: statisch wie bisher im InspectorPanel
import FoundationColors from '../components/foundation/FoundationColors.vue'
import SurfaceEditor from '../components/foundation/SurfaceEditor.vue'
import ShadowEditor from '../components/foundation/ShadowEditor.vue'
import TypographyEditor from '../components/foundation/TypographyEditor.vue'
import FoundationGeneric from '../components/foundation/FoundationGeneric.vue'
import GridInspector from '../components/foundation/GridInspector.vue'
import BorderEditor from '../components/foundation/BorderEditor.vue'
import ElementsOverview from '../components/foundation/ElementsOverview.vue'
import ThemesOverview from '../components/foundation/ThemesOverview.vue'
import PraesentationInspector from '../components/foundation/PraesentationInspector.vue'
import ComponentEditor from '../components/components/ComponentEditor.vue'
import ModulePlaceholder from '../components/templates/ModulePlaceholder.vue'
import TemplatePlaceholder from '../components/templates/TemplatePlaceholder.vue'

// ---------------------------------------------------------------------------
// Labor-Komponenten (lazy — werden erst beim ersten Aufruf geladen)
// ---------------------------------------------------------------------------
const lazy = (loader) => markRaw(defineAsyncComponent(loader))

export const LABOR = Object.freeze({
  farben: lazy(() => import('../components/laboratory/foundation/FarbenArena.vue')),
  typografie: lazy(() => import('../components/laboratory/foundation/TypografieBuehne.vue')),
  grid: lazy(() => import('../components/laboratory/GridArena.vue')),
  spacing: lazy(() => import('../components/foundation/SpacingInspector.vue')),
  radius: lazy(() => import('../components/foundation/RadiiEditor.vue')),
  size: lazy(() => import('../components/foundation/SizesEditor.vue')),
  praesentation: lazy(() => import('../components/foundation/PraesentationLab.vue')),
  border: lazy(() => import('../components/foundation/BorderEditor.vue')),
  focus: lazy(() => import('../components/foundation/FocusRingEditor.vue')),
  media: lazy(() => import('../components/foundation/MediaRatioEditor.vue')),
  shadows: lazy(() => import('../components/foundation/ShadowEditor.vue')),
  opacity: lazy(() => import('../components/foundation/OpacityZindexMotionEditor.vue')),
  surfaces: lazy(() => import('../components/foundation/SurfaceEditor.vue')),
  icons: lazy(() => import('../components/foundation/IconsEditor.vue')),
  themes: lazy(() => import('../components/foundation/ThemesOverview.vue')),
  elements: lazy(() => import('../components/foundation/ElementsOverview.vue')),
  komponente: lazy(() => import('../components/laboratory/komponenten/KomponentenBuehne.vue')),
  magazin: lazy(() => import('../components/laboratory/vorschau/MagazinVorschau.vue')),
})

const block = (komponente, props = {}) => Object.freeze({ komponente: markRaw(komponente), props })
const generisch = (category, sectionLabel) =>
  block(FoundationGeneric, sectionLabel ? { category, sectionLabel } : { category })

// ---------------------------------------------------------------------------
// Foundation-Sektionen (feste Zuordnung)
// ---------------------------------------------------------------------------
const FOUNDATION = {
  'foundation-colors': { label: 'Colors', labor: LABOR.farben, inspector: [block(FoundationColors)] },
  'foundation-grid': { label: 'Grid', labor: LABOR.grid, inspector: [block(GridInspector)], schluessel: 'grid' },
  'foundation-surfaces': { label: 'Surfaces', labor: LABOR.surfaces, inspector: [block(SurfaceEditor)] },
  'foundation-spacing': { label: 'Spacing', labor: LABOR.spacing, inspector: [generisch('spacing')] },
  'foundation-size': { label: 'Sizes', labor: LABOR.size, inspector: [generisch('size')] },
  'foundation-typography': {
    label: 'Typography',
    labor: LABOR.typografie,
    inspector: [block(TypographyEditor), generisch('tracking', 'Tracking')],
  },
  'foundation-radius': { label: 'Border Radius', labor: LABOR.radius, inspector: [generisch('radius')] },
  'foundation-border': { label: 'Border', labor: LABOR.border, inspector: [block(BorderEditor)] },
  'foundation-focus': { label: 'Focus Ring', labor: LABOR.focus, inspector: [generisch('focus')] },
  'foundation-media': { label: 'Media Ratios', labor: LABOR.media, inspector: [generisch('media')] },
  'foundation-elements': { label: 'Elements', labor: LABOR.elements, inspector: [block(ElementsOverview)] },
  // Icons haben (noch) keinen eigenen Inspector — leer wie bisher
  'foundation-icons': { label: 'Icons', labor: LABOR.icons, inspector: [] },
  'foundation-themes': { label: 'Themes', labor: LABOR.themes, inspector: [block(ThemesOverview)] },
  'foundation-shadows': { label: 'Shadows', labor: LABOR.shadows, inspector: [block(ShadowEditor)] },
  'foundation-opacity': {
    label: 'Opacity & Motion',
    labor: LABOR.opacity,
    inspector: [generisch('opacity', 'Opacity'), generisch('zindex', 'Z-Index'), generisch('motion', 'Motion')],
  },
  'foundation-praesentation': {
    label: 'Präsentation',
    labor: LABOR.praesentation,
    inspector: [block(PraesentationInspector)],
  },
  // Nicht in der Navigation, aber aus aelteren gespeicherten Staenden erreichbar
  'foundation-motion': { label: 'Motion', labor: LABOR.magazin, inspector: [generisch('motion')] },
}

// "code-snippet" → "Code Snippet"
const titel = (name) => name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

function eintrag (id, daten) {
  return Object.freeze({ id, schluessel: id, ...daten, inspector: Object.freeze([...daten.inspector]) })
}

/**
 * Loest eine Sektions-ID zum Registry-Eintrag auf. Liefert immer einen
 * Eintrag — unbekannte IDs bekommen die Magazin-Vorschau und einen leeren
 * Inspector (wie bisher der jeweilige v-else-Zweig).
 * @param {string} id
 */
export function sektionAufloesen (id) {
  const sektionId = typeof id === 'string' ? id : ''
  if (SEKTIONEN.has(sektionId)) return SEKTIONEN.get(sektionId)
  return erzeugeEintrag(sektionId)
}

function erzeugeEintrag (id) {
  if (Object.prototype.hasOwnProperty.call(FOUNDATION, id)) return eintrag(id, FOUNDATION[id])

  const trenner = id.indexOf('-')
  const art = trenner < 0 ? id : id.slice(0, trenner)
  const name = trenner < 0 ? '' : id.slice(trenner + 1)

  if (id === 'component-grid') {
    // Grid ist Foundation und Objekt zugleich: gleiche Arena, gleicher Inspector
    return eintrag(id, { label: 'Grid', labor: LABOR.grid, inspector: [block(GridInspector)], schluessel: 'grid' })
  }
  switch (art) {
    case 'component':
      return eintrag(id, {
        label: titel(name),
        labor: LABOR.komponente,
        inspector: [block(ComponentEditor, { componentId: name })],
        schluessel: 'component',
      })
    case 'module':
      return eintrag(id, {
        label: titel(name),
        labor: LABOR.magazin,
        inspector: [block(ModulePlaceholder, { moduleId: name })],
        schluessel: 'module',
      })
    case 'template':
      return eintrag(id, {
        label: titel(name),
        labor: LABOR.magazin,
        inspector: [block(TemplatePlaceholder, { templateId: name })],
        schluessel: 'template',
      })
    case 'utility':
      return eintrag(id, { label: titel(name), labor: LABOR.magazin, inspector: [], schluessel: 'utility' })
    default:
      return eintrag(id, { label: '', labor: LABOR.magazin, inspector: [], schluessel: 'leer' })
  }
}

/** Registry aller Navigations-Sektionen (Map in Navigationsreihenfolge). */
export const SEKTIONEN = new Map()
for (const id of NAVIGATIONS_SEKTIONEN) SEKTIONEN.set(id, erzeugeEintrag(id))
