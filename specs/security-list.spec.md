# security-list Component Spec
> Version 1.0.0 | Status: stable | Layer: molecule

Tags: `display`, `content`, `trust`

## Anatomy
Root element: `.nc-security-list`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| item | `.nc-security-list__item` | Yes | — |
| icon | `.nc-security-list__icon` | No | — |
| text | `.nc-security-list__text` | Yes | — |

### DOM Notes
- Grid-Layout mit gap. Items: flex, align-items center, border-bottom.
- Icon: accent-Farbe. Text: font-size base.

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-security-list`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-security-list>` custom element:

```js
class NcSecurityList extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="item">, <slot name="text">
}
```

---

*Generated from `data/security-list-recipe.json` by `scripts/generate-component-specs.js`*
