# pricing Component Spec
> Version 1.0.0 | Status: stable | Layer: molecule

Tags: `display`, `content`, `commerce`

## Anatomy
Root element: `.nc-pricing-card`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| price | `.nc-price` | Yes | — |
| feature-list | `.nc-feature-list` | No | — |

### DOM Notes
- Card: background-base, radius-xl, elevation-raised.
- Featured (.is-featured): accent Border, elevation-floating.
- Price: font-heading, fs-xl. Feature-List: Checkmark-Icon, accent-Farbe.

## Variants
### Variant (`variant`)
Variante — default, featured

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| featured | `.is-featured` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-pricing-card`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-pricing>` custom element:

```js
class NcPricing extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="price">
}
```

---

*Generated from `data/pricing-recipe.json` by `scripts/generate-component-specs.js`*
