# cta Component Spec
> Version 1.1.0 | Status: stable | Layer: organism

Tags: `display`, `content`, `conversion`

## Anatomy
Root element: `.nc-cta`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| left | `.nc-cta__left` | Yes | — |
| mid | `.nc-cta__mid` | No | — |
| right | `.nc-cta__right` | No | — |
| form | `.nc-cta__form` | No | — |
| note | `.nc-cta__note` | No | — |

### DOM Notes
- 3-Spalten Grid: clamp padding, clamp gap. Farbe: always-light auf dunklem BG.
- Sub-Components: nc-newsletter-cta, nc-demo-cta mit eigenen Forms.
- Responsive: Form wird 2fr+1fr ab 768px.

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-cta`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-cta>` custom element:

```js
class NcCta extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="left">
}
```

---

*Generated from `data/cta-recipe.json` by `scripts/generate-component-specs.js`*
