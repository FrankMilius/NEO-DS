# testimonial-grid Component Spec
> Version 1.1.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `molecules`

## Anatomy
Root element: `.nc-testimonial-grid`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| btn | `.nc-testimonial-grid__btn` | Yes | — |
| nav | `.nc-testimonial-grid__nav` | Yes | — |

### DOM Notes
- Raster: .nc-testimonial-grid (grid, gap spacing-05) mit Testimonial-Figures (figure.nc-testimonial); Spalten per --cols-2/--cols-3 (unter 60em zwei, unter 36em eine Spalte), ohne Modifier eine Spalte.
- Karussell: --carousel (flex, scroll-snap, Karten min(360px, 85 %)); die Navigation .nc-testimonial-grid__nav mit zwei .nc-testimonial-grid__btn steht NACH dem Raster und nur beim Karussell.
- disabled: der Knopf am Anfang bzw. Ende ist [disabled] (Opacity-Token).
- Aus dem Drupal-Theme uebernommen (block--block-content--neo-testimonial-grid.html.twig).

## Variants
### Variante (`variante`)
Variante — default, carousel, cols-2, cols-3

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| carousel | `.nc-testimonial-grid--carousel` |  |
| cols-2 | `.nc-testimonial-grid--cols-2` |  |
| cols-3 | `.nc-testimonial-grid--cols-3` |  |

## States
Supported: `default`, `hover`, `focus`, `disabled`

## CSS Token API
Base classes: `nc-testimonial-grid`

### Base
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-testimonial-grid-btn-border-radius` | — | `--mod-testimonial-grid-btn-border-radius` |
| `--nc-testimonial-grid-btn-disabled-opacity` | — | `--mod-testimonial-grid-btn-disabled-opacity` |

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-testimonial-grid>` custom element:

```js
class NcTestimonialGrid extends HTMLElement {
  static observedAttributes = ['variante'];
  // Slots: <slot name="btn">, <slot name="nav">
}
```

---

*Generated from `data/testimonial-grid-recipe.json` by `scripts/generate-component-specs.js`*
