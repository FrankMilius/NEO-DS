# table-block Component Spec
> Version 1.1.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `molecules`

## Anatomy
Root element: `.nc-table-block`

### DOM Notes
- Block: .nc-table-block (data-neo-table, data-width, data-scroll-bp, data-sticky-col) um .nc-compare-table --striped --sticky-header --full-width --sticky-col; Zellen sind .nc-tbl-cell (tbl-cell).
- Kopfzeile: thead th in Versalien auf --tbl-header-bg (Drupal setzt die Farbe je Block inline, Vorgabe background-tertiary).
- Scrollen: unter data-scroll-bp setzt neo-theme.js data-scroll-active=true (Tabelle max-content, waagerecht scrollbar) und beim Scrollen .is-scrolled (Schatten der festen ersten Spalte).
- Aus dem Drupal-Theme uebernommen; Markup aus der Website /events/editionen-preise (data/markup/table-block.html).

## CSS Token API
Base classes: 

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-table-block>` custom element:

```js
class NcTableBlock extends HTMLElement {
  static observedAttributes = [];
  // Slots: default
}
```

---

*Generated from `data/table-block-recipe.json` by `scripts/generate-component-specs.js`*
