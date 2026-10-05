# testimonial-grid Component Spec
> Version 1.0.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `molecules`

## Anatomy
Root element: `.nc-testimonial-grid`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| btn | `.nc-testimonial-grid__btn` | Yes | — |
| nav | `.nc-testimonial-grid__nav` | Yes | — |

### DOM Notes
- Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.
- Slots sind aus Klassennamen abgeleitet. Die ersten sechs werden in der Story gerendert, um die Struktur zu zeigen — welche wirklich Pflicht sind, klaert erst eine Spezifikation.

## Variants
### undefined (`0`)
| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| carousel | `.nc-testimonial-grid--carousel` |  |
| cols-2 | `.nc-testimonial-grid--cols-2` |  |
| cols-3 | `.nc-testimonial-grid--cols-3` |  |

## CSS Token API
Base classes: 

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-testimonial-grid>` custom element:

```js
class NcTestimonialGrid extends HTMLElement {
  static observedAttributes = ['0'];
  // Slots: <slot name="btn">, <slot name="nav">
}
```

---

*Generated from `data/testimonial-grid-recipe.json` by `scripts/generate-component-specs.js`*
