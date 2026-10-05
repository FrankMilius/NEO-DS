# grid Component Spec
> Version 2.0.0 | Status: stable | Layer: organism

Tags: `layout`, `object`, `grid`

## Anatomy
Root element: `.o-grid`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| column | `.o-col-*` | Yes | Grid-Spalte mit konfigurierter Breite (1-12). |

### DOM Notes
- 12-Spalten-Grid basierend auf CSS Grid.
- Gap skaliert fluid von 12px (Mobile) bis 24px (Desktop).
- Mobile-Spalten konfigurierbar: Standard 4, alternativ 2 oder 6 Spalten.
- Responsive Spans ueber .o-col-sm-* (Tablet) und .o-col-lg-* (Desktop).
- Flow-Achse steuert grid-auto-flow: row (Standard), column oder dense.
- Subgrid erlaubt verschachtelte Grids die das Eltern-Raster uebernehmen (z.B. fuer Header-Alignment in Cards).
- Grid-Overlay kann im Konfigurator persistiert werden fuer visuelles Debugging.

## Variants
### Gap (`gap`)
Abstand zwischen Grid-Spalten.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| sm | `.o-grid--gap-sm` |  |
| lg | `.o-grid--gap-lg` |  |

### Layout-Modus (`layout`)
Grid-Template-Strategie.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| fixed | — |  |
| auto-fit | `.o-grid--auto-fit` |  |

### Alignment (`alignment`)
Vertikale Ausrichtung der Grid-Items.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| start | — |  |
| center | `.o-grid--center` |  |
| end | `.o-grid--end` |  |

### Flow (`flow`)
Automatische Platzierung von Items im Grid.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| row | — |  |
| column | `.o-grid--flow-col` |  |
| dense | `.o-grid--dense` |  |

### Mobile Spalten (`mobile-columns`)
Spaltenanzahl auf Mobile-Viewports (< 768px). Standard: 4 Spalten.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| 1 | `.o-grid--mobile-1` |  |
| 2 | `.o-grid--mobile-2` |  |
| 4 | — |  |
| 6 | `.o-grid--mobile-6` |  |

### Subgrid (`subgrid`)
Verschachteltes Grid das das Spaltenraster des Eltern-Grids uebernimmt.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| columns | `.o-grid--subgrid` |  |
| rows | `.o-grid--subgrid-rows` |  |
| both | `.o-grid--subgrid-both` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `o-grid`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-grid-columns` | — | `--mod-grid-columns` |
| `--nc-grid-gap` | — | `--mod-grid-gap` |
| `--nc-grid-gap-sm` | — | `--mod-grid-gap-sm` |
| `--nc-grid-gap-lg` | — | `--mod-grid-gap-lg` |

### Gap-Varianten
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-grid-gap-sm` | — | `--mod-grid-gap-sm` |
| `--nc-grid-gap-lg` | — | `--mod-grid-gap-lg` |

### Responsive
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-grid-mobile-columns` | — | `--mod-grid-mobile-columns` |
| `--nc-grid-tablet-columns` | — | `--mod-grid-tablet-columns` |

## Accessibility
- Grid ist ein visuelles Layout-Werkzeug — DOM-Reihenfolge muss logisch bleiben.
- Spalten-Umordnung per CSS (order) nur wenn Lesereihenfolge identisch bleibt.
- Dense-Modus kann visuelle Reihenfolge von DOM-Reihenfolge abweichen — fuer Screen Reader problematisch.
- Subgrid aendert keine Semantik — nur das visuelle Raster wird geteilt.

## Web Components Mapping
Derived from anatomy for potential `<nc-grid>` custom element:

```js
class NcGrid extends HTMLElement {
  static observedAttributes = ['gap', 'layout', 'alignment', 'flow', 'mobile-columns', 'subgrid'];
  // Slots: <slot name="column">
}
```

---

*Generated from `data/grid-recipe.json` by `scripts/generate-component-specs.js`*
