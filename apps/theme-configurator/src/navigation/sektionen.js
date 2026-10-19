// ==========================================================================
// Sektions-Registry: Sektion → { label, labor, inspector } (Plan v2, 3.4)
// ==========================================================================
// Ersetzt die v-if-Ketten in LaboratoryPanel und InspectorPanel. Beide
// Panels rendern per <component :is> aus dem aufgeloesten Eintrag:
//
//   label      Breadcrumb im Labor-Kopf ('' = keiner)
//   labor      Komponente fuer den Labor-Viewport (lazy per defineAsyncComponent)
//   inspector  Liste von Bloecken { komponente, props } fuer den Inspector;
//              leer = deutscher Leerhinweis im InspectorPanel (v-else-Zweig)
//   schluessel Remount-Schluessel fuer den Inspector: Sektionen mit gleichem
//              Schluessel teilen sich die Instanz (vorher: derselbe v-if-Zweig)
//
// Foundation-Sektionen sind fest eingetragen; component-*, template-*,
// utility-* und module-* werden aus dem Praefix abgeleitet — so deckt die
// Registry jede Sektion ab, die navigation-builder.js erzeugt.
// ==========================================================================

import { defineAsyncComponent, defineComponent, h, markRaw } from 'vue'
import { NAVIGATIONS_SEKTIONEN } from './sektions-ids.js'
import { bereichsName, komponentenName } from './namen.js'

// Inspector-Komponenten: statisch wie bisher im InspectorPanel
import FoundationColors from '../components/foundation/FoundationColors.vue'
import SurfaceEditor from '../components/foundation/SurfaceEditor.vue'
import TypographyEditor from '../components/foundation/TypographyEditor.vue'
import FoundationGeneric from '../components/foundation/FoundationGeneric.vue'
import GridInspector from '../components/foundation/GridInspector.vue'
import PraesentationInspector from '../components/foundation/PraesentationInspector.vue'
import IconsInspector from '../components/foundation/IconsInspector.vue'
import NurAnsicht from '../components/foundation/NurAnsicht.vue'
import ComponentEditor from '../components/components/ComponentEditor.vue'
import ModulePlaceholder from '../components/templates/ModulePlaceholder.vue'
import TemplatePlaceholder from '../components/templates/TemplatePlaceholder.vue'

// ---------------------------------------------------------------------------
// Labor-Komponenten (lazy — werden erst beim ersten Aufruf geladen)
// ---------------------------------------------------------------------------
const lazy = (loader) => markRaw(defineAsyncComponent(loader))
// Lazy mit festen Props (Roadmap V04: dieselbe Komponente als Wirkung bzw. Eingabe)
const lazyMit = (loader, props) => markRaw(defineAsyncComponent(() =>
  loader().then((m) => defineComponent({ name: m.default.name || m.default.__name || 'MitProps', render: () => h(m.default, props) }))))
const wirkung = (kategorie) => lazyMit(() => import('../components/laboratory/foundation/FoundationWirkung.vue'), { kategorie })

export const LABOR = Object.freeze({
  farben: lazy(() => import('../components/laboratory/foundation/FarbenArena.vue')),
  typografie: lazy(() => import('../components/laboratory/foundation/TypografieBuehne.vue')),
  grid: lazy(() => import('../components/laboratory/foundation/GridBuehne.vue')),
  // Roadmap V04: eingabefreie Wirkung; die Editoren stehen im Inspector (EDITOR)
  spacing: wirkung('spacing'),
  radius: wirkung('radius'),
  size: wirkung('size'),
  praesentation: lazy(() => import('../components/foundation/PraesentationLab.vue')),
  border: lazy(() => import('../components/foundation/BorderEditor.vue')),
  focus: wirkung('focus'),
  media: wirkung('media'),
  shadows: lazy(() => import('../components/foundation/ShadowEditor.vue')),
  opacity: wirkung('opacity'),
  surfaces: lazyMit(() => import('../components/foundation/SurfaceEditor.vue'), { ansicht: 'wirkung' }),
  icons: wirkung('icons'),
  // Bühne = Ausschnitt der echten Website (19.10.2026): vorher Token-Steckbriefe
  themes: lazy(() => import('../components/laboratory/foundation/ThemesBuehne.vue')),
  elements: lazy(() => import('../components/laboratory/foundation/ElementeBuehne.vue')),
  komponente: lazy(() => import('../components/laboratory/komponenten/KomponentenBuehne.vue')),
  magazin: lazy(() => import('../components/laboratory/vorschau/MagazinVorschau.vue')),
  vorlagen: lazy(() => import('../components/templates/TemplateUebersicht.vue')),
})

// Editoren für den Inspector (lazy wie bisher in der Bühne)
export const EDITOR = Object.freeze({
  spacing: lazy(() => import('../components/foundation/SpacingInspector.vue')),
  radius: lazy(() => import('../components/foundation/RadiiEditor.vue')),
  size: lazy(() => import('../components/foundation/SizesEditor.vue')),
  focus: lazy(() => import('../components/foundation/FocusRingEditor.vue')),
  media: lazy(() => import('../components/foundation/MediaRatioEditor.vue')),
  opacity: lazy(() => import('../components/foundation/OpacityZindexMotionEditor.vue')),
  icons: lazy(() => import('../components/foundation/IconsEditor.vue')),
})

const block = (komponente, props = {}) => Object.freeze({ komponente: markRaw(komponente), props })
const nurAnsicht = (text, links = []) => block(NurAnsicht, { text, links })
const generisch = (category, sectionLabel) =>
  block(FoundationGeneric, sectionLabel ? { category, sectionLabel } : { category })

// ---------------------------------------------------------------------------
// Foundation-Sektionen (feste Zuordnung)
// ---------------------------------------------------------------------------
const FOUNDATION = {
  'foundation-colors': { label: bereichsName('foundation-colors'), labor: LABOR.farben, inspector: [block(FoundationColors)] },
  'foundation-grid': { label: bereichsName('foundation-grid'), labor: LABOR.grid, inspector: [block(GridInspector)], schluessel: 'grid' },
  'foundation-surfaces': { label: bereichsName('foundation-surfaces'), labor: LABOR.surfaces, inspector: [block(SurfaceEditor, { ansicht: 'eingabe' })] },
  'foundation-spacing': { label: bereichsName('foundation-spacing'), labor: LABOR.spacing, inspector: [block(EDITOR.spacing)] },
  'foundation-size': { label: bereichsName('foundation-size'), labor: LABOR.size, inspector: [block(EDITOR.size)] },
  'foundation-typography': {
    label: bereichsName('foundation-typography'),
    labor: LABOR.typografie,
    inspector: [block(TypographyEditor), generisch('tracking', 'Tracking')],
  },
  'foundation-radius': { label: bereichsName('foundation-radius'), labor: LABOR.radius, inspector: [block(EDITOR.radius)] },
  'foundation-border': { label: bereichsName('foundation-border'), labor: LABOR.border, inspector: [nurAnsicht('Rahmenbreiten und -stile sind im Design System festgelegt und im Theme nicht änderbar. Die Bühne zeigt sie.')] },
  'foundation-focus': { label: bereichsName('foundation-focus'), labor: LABOR.focus, inspector: [block(EDITOR.focus)] },
  'foundation-media': { label: bereichsName('foundation-media'), labor: LABOR.media, inspector: [block(EDITOR.media)] },
  'foundation-elements': { label: bereichsName('foundation-elements'), labor: LABOR.elements, inspector: [nurAnsicht('Die Grundstile der HTML-Elemente ergeben sich aus Typografie und Farben. Die Bühne zeigt sie.', [{ label: 'Typografie', hash: '#/foundation/typography' }, { label: 'Farben', hash: '#/foundation/colors' }])] },
  // Icons: Hinweis, was davon exportiert wird (UX-37), darunter der Editor (V04)
  'foundation-icons': { label: bereichsName('foundation-icons'), labor: LABOR.icons, inspector: [block(IconsInspector), block(EDITOR.icons)] },
  'foundation-themes': { label: bereichsName('foundation-themes'), labor: LABOR.themes, inspector: [nurAnsicht('Themes wählen, speichern und veröffentlichen Sie in der Kopfleiste. Die Bühne zeigt die vier Kombinationen aus Set und Modus.')] },
  'foundation-shadows': { label: bereichsName('foundation-shadows'), labor: LABOR.shadows, inspector: [nurAnsicht('Schattenstufen und ihre Zuordnung zu Erhebungen sind im Design System festgelegt und im Theme nicht änderbar. Die Bühne zeigt sie.')] },
  'foundation-opacity': { label: bereichsName('foundation-opacity'), labor: LABOR.opacity, inspector: [block(EDITOR.opacity)] },
  'foundation-praesentation': {
    label: bereichsName('foundation-praesentation'),
    labor: LABOR.praesentation,
    inspector: [block(PraesentationInspector)],
  },
  // Nicht in der Navigation, aber aus aelteren gespeicherten Staenden erreichbar
  'foundation-motion': { label: bereichsName('foundation-motion'), labor: LABOR.magazin, inspector: [generisch('motion')] },
}

// "tbl-cell" → "Table Cell" (namen.js, Block 5e)
const titel = (name) => komponentenName(name)

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

  // component-grid teilte bis 06.10.2026 Arena und Inspector mit
  // foundation-grid. Seit Plan v3, Phase 3 (Block Layout) ist es eine
  // Komponente wie jede andere: RecipeArena mit dem echten .o-grid, Inspector
  // ComponentEditor. Die Grid-Buehne bleibt der Foundation.
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
      // V05: Seitenvorlagen als ein Bereich (Übersicht aller Skizzen)
      if (name === 'content-templates') {
        return eintrag(id, {
          label: 'Seitenvorlagen',
          labor: LABOR.vorlagen,
          inspector: [nurAnsicht('Seitenvorlagen haben keine eigenen Werte. Sie übernehmen Farben, Schrift und Abstände aus den Grundlagen und das Aussehen der Komponenten.', [{ label: 'Farben', hash: '#/foundation/colors' }, { label: 'Typografie', hash: '#/foundation/typography' }])],
          schluessel: 'template',
        })
      }
      return eintrag(id, {
        label: titel(name),
        labor: LABOR.magazin,
        inspector: [block(TemplatePlaceholder, { templateId: name })],
        schluessel: 'template',
      })
    case 'utility':
      // V05: nicht mehr in der Navigation; alte Links bekommen einen Hinweis
      return eintrag(id, {
        label: titel(name),
        labor: LABOR.magazin,
        inspector: [nurAnsicht('Hilfsklassen (Utilities) haben keine Theme-Werte und stehen deshalb nicht in der Navigation. Sie wirken über Klassen im HTML der Website.')],
        schluessel: 'utility',
      })
    default:
      return eintrag(id, { label: '', labor: LABOR.magazin, inspector: [], schluessel: 'leer' })
  }
}

/** Registry aller Navigations-Sektionen (Map in Navigationsreihenfolge). */
export const SEKTIONEN = new Map()
for (const id of NAVIGATIONS_SEKTIONEN) SEKTIONEN.set(id, erzeugeEintrag(id))
