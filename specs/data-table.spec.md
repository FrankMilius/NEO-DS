# data-table Component Spec
> Version 2.1.0 | Status: stable | Layer: organism

Tags: `data`, `interactive`, `table`, `composite`

## Anatomy
Root element: `.nc-data-table`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| title-bar | `.nc-data-table__title-bar` | No | — |
| title | `.nc-data-table__title` | No | — |
| description | `.nc-data-table__description` | No | — |
| toolbar | `.nc-data-table__toolbar` | No | — |
| scroll-container | `.nc-data-table__scroll-container` | Yes | — |
| table | `.nc-data-table__table` | Yes | — |
| thead | `.nc-data-table__thead` | Yes | — |
| tbody | `.nc-data-table__tbody` | Yes | — |
| row | `.nc-data-table__row` | Yes | — |
| th | `.nc-data-table__th` | Yes | — |
| td | `.nc-data-table__td` | Yes | — |
| sort-button | `.nc-data-table__sort-button` | No | — |
| checkbox-cell | `.nc-data-table__checkbox-cell` | No | — |
| radio-cell | `.nc-data-table__radio-cell` | No | — |
| expand-button | `.nc-data-table__expand-button` | No | — |
| expand-panel | `.nc-data-table__expand-panel` | No | — |
| action-menu | `.nc-data-table__action-menu` | No | — |
| batch-bar | `.nc-data-table__batch-bar` | No | — |
| batch-count | `.nc-data-table__batch-count` | No | Zaehler mit aria-live='polite': z.B. '12 Eintraege ausgewaehlt' |
| batch-clear | `.nc-data-table__batch-clear` | No | Clear All Button neben dem Zaehler |
| pagination | `.nc-data-table__pagination` | No | — |
| empty | `.nc-data-table__empty` | No | — |
| error | `.nc-data-table__error` | No | — |
| skeleton-bar | `.nc-data-table__skeleton-bar` | No | — |
| stacked-label | `.nc-data-table__td::before` | No | data-label Attribut auf td fuer Stacked/Card Layout |

### DOM Notes
- Wrapper: border, radius, overflow:hidden. Semantisches <table> mit <thead>/<tbody>.
- Scroll-Container: horizontaler Scroll mit CSS-Schatten-Indikatoren.
- Title-Bar: Titel + Beschreibung. Toolbar: Suche + Filter + Batch-Actions.
- Density: default (40px), compact (32px), comfortable (48px).
- Striped: nth-child(even of :not(expand-row)). Bordered: border-inline-end.
- Sticky Header: position:sticky top:0 auf <th>.
- Sticky Columns: erste/letzte Spalte fixiert mit Schatten-Indikator.
- Stacked Layout: Mobile Card-View via data-label auf <td>.
- Card Variante: erhobene Tabelle mit elevation-raised Shadow.
- Glass Variante: transparente Zeilen mit backdrop-filter fuer Dashboards.
- Batch-Bar v2: Zaehler (aria-live) + Clear-All Button + Aktionen.
- Skeleton Varianten: avatar (rund), numeric (schmal), text (75%).
- Content Wrapping: --wrap Modifier fuer mehrzeiligen Zelleninhalt.

## Variants
### Density (`density`)
Zeilendichte — default (40px), compact (32px), comfortable (48px)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| compact | `.nc-data-table--compact` |  |
| comfortable | `.nc-data-table--comfortable` |  |

### Feature (`feature`)
Feature-Set — basic, sortable, selectable, expandable

| Value | CSS Modifier | Default |
| --- | --- | --- |
| basic | — |  |
| sortable | `.nc-data-table--sortable` |  |
| selectable | `.nc-data-table--selectable` |  |
| expandable | `.nc-data-table--expandable` |  |

### Selection Mode (`selection`)
Zeilen-Auswahl — none, checkbox (multi-select), radio (single-select)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| checkbox | `.nc-data-table--selectable` |  |
| radio | — |  |

### Variant (`variant`)
Visuelles Layout — flat (Standard), striped, bordered, card (erhobene Card), glass (transparente Dashboard-Tabelle)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| flat | — |  |
| striped | `.nc-data-table--striped` |  |
| bordered | `.nc-data-table--bordered` |  |
| card | `.nc-data-table--card` |  |
| glass | `.nc-data-table--glass` |  |

### Content (`content`)
Zelleninhalt-Behandlung — truncate (Ellipsis, Standard), wrap (mehrzeilig)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| truncate | — |  |
| wrap | `.nc-data-table--wrap` |  |

## States
Supported: `default`, `hover`, `selected`, `loading`, `error`, `empty`

- **hover**: 
- **selected**: 
- **loading**: 
- **error**: 
- **empty**: 

## CSS Token API
Base classes: `nc-data-table`

### Container
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-radius` | — | `--mod-dt-radius` |
| `--nc-dt-border` | — | `--mod-dt-border` |
| `--nc-dt-body-bg` | — | `--mod-dt-body-bg` |
| `--nc-dt-body-color` | — | `--mod-dt-body-color` |
| `--nc-dt-body-font-size` | — | `--mod-dt-body-font-size` |
| `--nc-dt-body-font-weight` | — | `--mod-dt-body-font-weight` |
| `--nc-dt-scroll-shadow-size` | — | `--mod-dt-scroll-shadow-size` |
| `--nc-dt-transition-duration` | — | `--mod-dt-transition-duration` |

### Header
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-header-height` | — | `--mod-dt-header-height` |
| `--nc-dt-header-bg` | — | `--mod-dt-header-bg` |
| `--nc-dt-header-color` | — | `--mod-dt-header-color` |
| `--nc-dt-header-font-size` | — | `--mod-dt-header-font-size` |
| `--nc-dt-header-font-weight` | — | `--mod-dt-header-font-weight` |
| `--nc-dt-header-letter-spacing` | — | `--mod-dt-header-letter-spacing` |
| `--nc-dt-header-border-bottom` | — | `--mod-dt-header-border-bottom` |

### Row
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-row-height` | — | `--mod-dt-row-height` |
| `--nc-dt-row-height-compact` | — | `--mod-dt-row-height-compact` |
| `--nc-dt-row-height-default` | — | `--mod-dt-row-height-default` |
| `--nc-dt-row-height-comfortable` | — | `--mod-dt-row-height-comfortable` |
| `--nc-dt-cell-padding-x` | — | `--mod-dt-cell-padding-x` |
| `--nc-dt-cell-padding-y` | — | `--mod-dt-cell-padding-y` |
| `--nc-dt-row-border-bottom` | — | `--mod-dt-row-border-bottom` |
| `--nc-dt-row-bg-hover` | — | `--mod-dt-row-bg-hover` |
| `--nc-dt-row-bg-selected` | — | `--mod-dt-row-bg-selected` |
| `--nc-dt-row-bg-stripe` | — | `--mod-dt-row-bg-stripe` |

### Toolbar
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-toolbar-height` | — | `--mod-dt-toolbar-height` |
| `--nc-dt-toolbar-padding` | — | `--mod-dt-toolbar-padding` |
| `--nc-dt-toolbar-bg` | — | `--mod-dt-toolbar-bg` |
| `--nc-dt-toolbar-border-bottom` | — | `--mod-dt-toolbar-border-bottom` |
| `--nc-dt-toolbar-gap` | — | `--mod-dt-toolbar-gap` |
| `--nc-dt-search-min-width` | — | `--mod-dt-search-min-width` |
| `--nc-dt-select-width` | — | `--mod-dt-select-width` |

### Pagination
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-pagination-height` | — | `--mod-dt-pagination-height` |
| `--nc-dt-pagination-padding` | — | `--mod-dt-pagination-padding` |
| `--nc-dt-pagination-bg` | — | `--mod-dt-pagination-bg` |
| `--nc-dt-pagination-border-top` | — | `--mod-dt-pagination-border-top` |
| `--nc-dt-pagination-gap` | — | `--mod-dt-pagination-gap` |
| `--nc-dt-pagination-color` | — | `--mod-dt-pagination-color` |
| `--nc-dt-pagination-font-size` | — | `--mod-dt-pagination-font-size` |
| `--nc-dt-page-select-width` | — | `--mod-dt-page-select-width` |

### Title Bar
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-title-bar-padding` | — | `--mod-dt-title-bar-padding` |
| `--nc-dt-title-bar-gap` | — | `--mod-dt-title-bar-gap` |
| `--nc-dt-title-font-size` | — | `--mod-dt-title-font-size` |
| `--nc-dt-title-font-weight` | — | `--mod-dt-title-font-weight` |
| `--nc-dt-title-color` | — | `--mod-dt-title-color` |
| `--nc-dt-title-line-height` | — | `--mod-dt-title-line-height` |
| `--nc-dt-description-font-size` | — | `--mod-dt-description-font-size` |
| `--nc-dt-description-color` | — | `--mod-dt-description-color` |
| `--nc-dt-description-line-height` | — | `--mod-dt-description-line-height` |

### Sort
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-sort-icon-size` | — | `--mod-dt-sort-icon-size` |
| `--nc-dt-sort-icon-color` | — | `--mod-dt-sort-icon-color` |
| `--nc-dt-sort-icon-color-active` | — | `--mod-dt-sort-icon-color-active` |
| `--nc-dt-sort-hit-area` | — | `--mod-dt-sort-hit-area` |

### Checkbox
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-checkbox-column-width` | — | `--mod-dt-checkbox-column-width` |
| `--nc-dt-checkbox-padding-x` | — | `--mod-dt-checkbox-padding-x` |

### Radio
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-radio-column-width` | — | `--mod-dt-radio-column-width` |
| `--nc-dt-radio-padding-x` | — | `--mod-dt-radio-padding-x` |

### Expand
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-expand-icon-size` | — | `--mod-dt-expand-icon-size` |
| `--nc-dt-expand-column-width` | — | `--mod-dt-expand-column-width` |
| `--nc-dt-expand-panel-bg` | — | `--mod-dt-expand-panel-bg` |
| `--nc-dt-expand-panel-padding` | — | `--mod-dt-expand-panel-padding` |

### Batch
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-batch-bg` | — | `--mod-dt-batch-bg` |
| `--nc-dt-batch-color` | — | `--mod-dt-batch-color` |
| `--nc-dt-batch-padding` | — | `--mod-dt-batch-padding` |
| `--nc-dt-batch-height` | — | `--mod-dt-batch-height` |
| `--nc-dt-batch-radius` | — | `--mod-dt-batch-radius` |
| `--nc-dt-batch-shadow` | — | `--mod-dt-batch-shadow` |
| `--nc-dt-batch-count-font-size` | — | `--mod-dt-batch-count-font-size` |
| `--nc-dt-batch-clear-color` | — | `--mod-dt-batch-clear-color` |

### Link & Actions
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-link-color` | — | `--mod-dt-link-color` |
| `--nc-dt-link-color-hover` | — | `--mod-dt-link-color-hover` |
| `--nc-dt-link-icon-size` | — | `--mod-dt-link-icon-size` |
| `--nc-dt-link-gap` | — | `--mod-dt-link-gap` |
| `--nc-dt-date-font-feature` | — | `--mod-dt-date-font-feature` |
| `--nc-dt-actions-gap` | — | `--mod-dt-actions-gap` |
| `--nc-dt-action-column-width` | — | `--mod-dt-action-column-width` |
| `--nc-dt-action-icon-size` | — | `--mod-dt-action-icon-size` |

### Skeleton
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-skeleton-bg` | — | `--mod-dt-skeleton-bg` |
| `--nc-dt-skeleton-radius` | — | `--mod-dt-skeleton-radius` |
| `--nc-dt-skeleton-shimmer` | — | `--mod-dt-skeleton-shimmer` |
| `--nc-dt-skeleton-width-avatar` | — | `--mod-dt-skeleton-width-avatar` |
| `--nc-dt-skeleton-width-numeric` | — | `--mod-dt-skeleton-width-numeric` |
| `--nc-dt-skeleton-width-text` | — | `--mod-dt-skeleton-width-text` |

### Empty & Error
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-empty-icon-size` | — | `--mod-dt-empty-icon-size` |
| `--nc-dt-empty-title-color` | — | `--mod-dt-empty-title-color` |
| `--nc-dt-empty-body-color` | — | `--mod-dt-empty-body-color` |
| `--nc-dt-error-border` | — | `--mod-dt-error-border` |
| `--nc-dt-error-color` | — | `--mod-dt-error-color` |

### User Column
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-user-avatar-size` | — | `--mod-dt-user-avatar-size` |
| `--nc-dt-user-gap` | — | `--mod-dt-user-gap` |
| `--nc-dt-user-name-font-weight` | — | `--mod-dt-user-name-font-weight` |
| `--nc-dt-user-name-color` | — | `--mod-dt-user-name-color` |
| `--nc-dt-user-email-font-size` | — | `--mod-dt-user-email-font-size` |
| `--nc-dt-user-email-color` | — | `--mod-dt-user-email-color` |

### Progress Column
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-progress-height` | — | `--mod-dt-progress-height` |
| `--nc-dt-progress-bg` | — | `--mod-dt-progress-bg` |
| `--nc-dt-progress-fill` | — | `--mod-dt-progress-fill` |
| `--nc-dt-progress-fill-success` | — | `--mod-dt-progress-fill-success` |
| `--nc-dt-progress-fill-warning` | — | `--mod-dt-progress-fill-warning` |
| `--nc-dt-progress-fill-danger` | — | `--mod-dt-progress-fill-danger` |
| `--nc-dt-progress-radius` | — | `--mod-dt-progress-radius` |
| `--nc-dt-progress-gap` | — | `--mod-dt-progress-gap` |
| `--nc-dt-progress-label-width` | — | `--mod-dt-progress-label-width` |
| `--nc-dt-progress-label-font-size` | — | `--mod-dt-progress-label-font-size` |

### Stacked Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-stacked-card-gap` | — | `--mod-dt-stacked-card-gap` |
| `--nc-dt-stacked-card-padding` | — | `--mod-dt-stacked-card-padding` |
| `--nc-dt-stacked-card-radius` | — | `--mod-dt-stacked-card-radius` |
| `--nc-dt-stacked-card-border` | — | `--mod-dt-stacked-card-border` |
| `--nc-dt-stacked-label-width` | — | `--mod-dt-stacked-label-width` |
| `--nc-dt-stacked-label-color` | — | `--mod-dt-stacked-label-color` |
| `--nc-dt-stacked-label-font-weight` | — | `--mod-dt-stacked-label-font-weight` |

### Sticky Columns
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-sticky-col-shadow` | — | `--mod-dt-sticky-col-shadow` |
| `--nc-dt-sticky-col-shadow-end` | — | `--mod-dt-sticky-col-shadow-end` |
| `--nc-dt-sticky-col-bg` | — | `--mod-dt-sticky-col-bg` |

### Card Variant
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-card-shadow` | — | `--mod-dt-card-shadow` |
| `--nc-dt-card-bg` | — | `--mod-dt-card-bg` |

### Glass Variant
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-glass-bg` | — | `--mod-dt-glass-bg` |
| `--nc-dt-glass-header-bg` | — | `--mod-dt-glass-header-bg` |
| `--nc-dt-glass-border` | — | `--mod-dt-glass-border` |
| `--nc-dt-glass-backdrop-blur` | — | `--mod-dt-glass-backdrop-blur` |

### Content Wrapping
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dt-cell-line-clamp` | — | `--mod-dt-cell-line-clamp` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-data-table>` custom element:

```js
class NcDataTable extends HTMLElement {
  static observedAttributes = ['density', 'feature', 'selection', 'variant', 'content'];
  // Slots: <slot name="scroll-container">, <slot name="table">, <slot name="thead">, <slot name="tbody">, <slot name="row">, <slot name="th">, <slot name="td">
}
```

---

*Generated from `data/data-table-recipe.json` by `scripts/generate-component-specs.js`*
