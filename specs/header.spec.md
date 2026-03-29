# header Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `navigation`, `layout`, `interactive`

## Anatomy
Root element: `.header`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| nav-wrapper | `.nav-wrapper` | Yes | — |
| conversion | `.conversion` | No | — |

### DOM Notes
- Relative positioned, z-index header. Nav-Wrapper: fixed, background-base, border-bottom.
- nav-hidden: opacity 0, pointer-events none. Conversion: fixed Button, right 0, z-index dropdown.

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`, `hidden`

- **hidden**: 

## CSS Token API
Base classes: `header`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-header>` custom element:

```js
class NcHeader extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="nav-wrapper">
}
```

---

*Generated from `data/header-recipe.json` by `scripts/generate-component-specs.js`*
