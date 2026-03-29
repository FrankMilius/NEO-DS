# square Component Spec
> Version 1.0.0 | Status: stable | Layer: atom

Tags: `decorative`, `display`

## Anatomy
Root element: `.square`

### DOM Notes
- Dekoratives Quadrat via ::before Pseudo-Element.
- Varianten: default (accent/gruen), white, dark, adaptive (inverse), blinking.
- Groessen: default (10px), square-l (12px), square-s (8px).

## Variants
### Variant (`variant`)
Farbvariante — default (accent), white, dark, adaptive, blinking

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| white | — |  |
| dark | — |  |
| adaptive | — |  |
| blinking | — |  |

### Size (`size`)
Groesse — sm (8px), md (10px Standard), lg (12px)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.square-s` |  |
| md | — |  |
| lg | `.square-l` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `square`

### Base
## Accessibility
Contrast Target: WCAG AA non-text (3:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-square>` custom element:

```js
class NcSquare extends HTMLElement {
  static observedAttributes = ['variant', 'size'];
  // Slots: default
}
```

---

*Generated from `data/square-recipe.json` by `scripts/generate-component-specs.js`*
