# feature-accordion Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `display`, `interactive`, `content`

## Anatomy
Root element: `.nc-feature-accordeon`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| left | `.nc-feature-accordeon__left` | Yes | — |
| title | `.nc-feature-accordeon__title` | No | — |

### DOM Notes
- 2-Spalten Grid: nav-links (left) + expandable chapters (right).
- Left: grid, align-content start, gap 1.5rem. Title: heading font, clamp 2-3.2rem, max-width 16ch.
- Gap: clamp(2rem, 4vw, 4.5rem). Columns: minmax(260px, 0.95fr) + minmax(320px, 1fr).

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`, `open`

- **open**: 

## CSS Token API
Base classes: `nc-feature-accordeon`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-feature-accordion>` custom element:

```js
class NcFeatureAccordion extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="left">
}
```

---

*Generated from `data/feature-accordion-recipe.json` by `scripts/generate-component-specs.js`*
