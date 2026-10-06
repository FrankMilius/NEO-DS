# compare-table Component Spec
> Version 2.0.1 | Status: stable | Layer: atom

Tags: `data`, `display`, `comparison`

## Anatomy
Root element: `.nc-compare-table`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| sort-icon | `.nc-compare-table__sort-icon` | Yes | Sort-Indikator im Header (SVG Chevron) |
| checkbox | `.nc-compare-table__checkbox` | Yes | Checkbox-Zelle fuer Row-Selection |
| numeric | `.nc-compare-table__numeric` | Yes | Rechtsbuendige Zahlenzelle mit tabular-nums |
| section-row | `.nc-compare-table__section-row` | Yes | — |

### DOM Notes
- Einfache Vergleichstabelle mit inverser Header-Zeile.
- Volle Breite, border-collapse, elevation-raised Shadow.
- Header: inverse BG + Color. Zellen: variable Padding per Density.
- Sortable: cursor pointer + Sort-Icon im Header. Selectable: Checkbox-Spalte.
- Sticky-Header: position sticky mit Shadow beim Scrollen.
- Zusammengelegt am 25.08.2026. Es gab ZWEI Recipes fuer dieselbe Wurzel .nc-compare-table: `table` (stable v2, 3 Bereiche, 13 Tokengruppen) und `compare-table` (draft v1, 1 Bereich, keine Tokengruppe). Beide erzeugten eine eigene Story fuer dasselbe Bauteil. Der Inhalt kommt aus `table`, der NAME aus der Wurzelklasse — ein blankes `table` waere neben `table-block` und `data-table` ohnehin mehrdeutig gewesen.

## Variants
### Grid Style (`variant`)
Visuelles Grid-Layout — lines (Standard mit Trennlinien), borderless (nur Weissraum), ghost (dezent fuer Card-Integration)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| lines | — |  |
| borderless | `.nc-compare-table--borderless` |  |
| ghost | `.nc-compare-table--ghost` |  |

### Density (`density`)
Zellenabstand — compact (datenintensiv), default (Standard), expressive (Marketing-Vergleiche)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| compact | `.nc-compare-table--compact` |  |
| default | — |  |
| expressive | `.nc-compare-table--expressive` |  |

### Striping (`striping`)
Zebra-Striping fuer verbesserte Zeilenorientierung

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| striped | `.nc-compare-table--striped` |  |

### Selection (`selection`)
Zeilen-Auswahl per Checkbox fuer Massenaktionen

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| checkbox | `.nc-compare-table--selectable` |  |

### Sorting (`sorting`)
Interaktive Spalten-Sortierung mit Sort-Icons

| Value | CSS Modifier | Default |
| --- | --- | --- |
| static | — |  |
| sortable | `.nc-compare-table--sortable` |  |

## States
Supported: `default`, `hover`, `selected`


## CSS Token API
Base classes: `nc-compare-table`

### Container
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-table-bg` | — | `--mod-table-bg` |
| `--nc-table-radius` | — | `--mod-table-radius` |
| `--nc-table-shadow` | — | `--mod-table-shadow` |
| `--nc-table-border-color` | — | `--mod-table-border-color` |
| `--nc-table-border-width` | — | `--mod-table-border-width` |

### Header
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-table-header-bg` | — | `--mod-table-header-bg` |
| `--nc-table-header-color` | — | `--mod-table-header-color` |
| `--nc-table-header-font-size` | — | `--mod-table-header-font-size` |
| `--nc-table-header-font-weight` | — | `--mod-table-header-font-weight` |
| `--nc-table-header-letter-spacing` | — | `--mod-table-header-letter-spacing` |

### Cell Padding (Default)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-table-cell-padding` | — | `--mod-table-cell-padding` |
| `--nc-table-cell-padding-default` | — | `--mod-table-cell-padding-default` |

### Cell Padding (Compact)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-table-cell-padding-compact` | — | `--mod-table-cell-padding-compact` |

### Cell Padding (Expressive)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-table-cell-padding-expressive` | — | `--mod-table-cell-padding-expressive` |

### Row Border
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-table-row-border-color` | — | `--mod-table-row-border-color` |
| `--nc-table-row-border-width` | — | `--mod-table-row-border-width` |

### Row Hover
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-table-row-bg-hover` | — | `--mod-table-row-bg-hover` |

### Zebra-Striping
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-table-stripe-bg` | — | `--mod-table-stripe-bg` |

### Selection
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-table-row-bg-selected` | — | `--mod-table-row-bg-selected` |
| `--nc-table-row-border-selected` | — | `--mod-table-row-border-selected` |
| `--nc-table-checkbox-size` | — | `--mod-table-checkbox-size` |
| `--nc-table-checkbox-column-width` | — | `--mod-table-checkbox-column-width` |

### Sortable
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-table-sort-icon-size` | — | `--mod-table-sort-icon-size` |
| `--nc-table-sort-icon-color` | — | `--mod-table-sort-icon-color` |
| `--nc-table-sort-icon-color-active` | — | `--mod-table-sort-icon-color-active` |

### Sticky Header
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-table-sticky-shadow` | — | `--mod-table-sticky-shadow` |
| `--nc-table-sticky-z-index` | — | `--mod-table-sticky-z-index` |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-table-font-size` | — | `--mod-table-font-size` |
| `--nc-table-color` | — | `--mod-table-color` |
| `--nc-table-color-secondary` | — | `--mod-table-color-secondary` |
| `--nc-table-transition-duration` | — | `--mod-table-transition-duration` |

### Ghost Variant
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-table-ghost-header-bg` | — | `--mod-table-ghost-header-bg` |
| `--nc-table-ghost-header-color` | — | `--mod-table-ghost-header-color` |
| `--nc-table-ghost-border-color` | — | `--mod-table-ghost-border-color` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- hasColumnHeaders

## Web Components Mapping
Derived from anatomy for potential `<nc-compare-table>` custom element:

```js
class NcCompareTable extends HTMLElement {
  static observedAttributes = ['variant', 'density', 'striping', 'selection', 'sorting'];
  // Slots: <slot name="sort-icon">, <slot name="checkbox">, <slot name="numeric">, <slot name="section-row">
}
```

---

*Generated from `data/compare-table-recipe.json` by `scripts/generate-component-specs.js`*
