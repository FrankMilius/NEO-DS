# cta Component Spec
> Version 1.2.0 | Status: stable | Layer: organism

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
- Eigene Flaeche --nc-cta-bg (Standard always-dark, --mod-cta-bg), Text always-light. Raster: unter md eine Spalte, ab md eine Spalte je vorhandenem Bereich (__left, __mid, __right).
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
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-cta-bg` | — | `--mod-cta-bg` |

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
