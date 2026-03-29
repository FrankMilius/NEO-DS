# testimonial Component Spec
> Version 1.0.0 | Status: stable | Layer: molecule

Tags: `display`, `content`, `social-proof`

## Anatomy
Root element: `.nc-testimonial`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| quote | `.nc-testimonial__quote` | Yes | — |
| author | `.nc-testimonial__author` | Yes | — |
| meta | `.nc-testimonial__meta` | No | — |
| name | `.nc-testimonial__name` | Yes | — |
| role | `.nc-testimonial__role` | No | — |

### DOM Notes
- Card: background-secondary, radius-sm, padding-05, grid gap 1.25rem, scroll-snap-align.
- Quote: fs-lg, line-height 1.25. Author: flex, gap 0.75rem. Name: semibold. Role: fs-xs, text-secondary.

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-testimonial`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-testimonial>` custom element:

```js
class NcTestimonial extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="quote">, <slot name="author">, <slot name="name">
}
```

---

*Generated from `data/testimonial-recipe.json` by `scripts/generate-component-specs.js`*
