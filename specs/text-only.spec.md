# text-only Component Spec
> Version 1.0.0 | Status: stable | Layer: molecule

Tags: `display`, `content`, `text`

## Anatomy
Root element: `.nc-text-only`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| title | `.nc-text-only__title` | No | — |
| text | `.nc-text-only__text` | Yes | — |
| scroll-text | `.nc-text-only__scroll-text` | No | — |

### DOM Notes
- Container: max-width, padding. Title: heading-Stil.
- Scroll-Text: perspective 600px, 3D-Rotation mit scroll-animation, rotateX + translateZ + scale. Reduced-Motion: Animation deaktiviert.

## Variants
### Variant (`variant`)
Variante — default, scroll

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| scroll | `.has-scroll` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-text-only`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-text-only>` custom element:

```js
class NcTextOnly extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="text">
}
```

---

*Generated from `data/text-only-recipe.json` by `scripts/generate-component-specs.js`*
