# link-with-arrow Component Spec
> Version 1.1.0 | Status: stable | Layer: atom

Tags: `navigation`, `interactive`, `link`

## Anatomy
Root element: `.link-with-arrow`

### DOM Notes
- Flex-Row: Text + Pfeil-Icon. Gap spacing-02.
- Hover: text-decoration:none, color secondary.
- Focus: focus-ring.

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`, `hover`, `focus`

- **hover**: 
- **focus**: 

## CSS Token API
Base classes: `link-with-arrow`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-link-with-arrow>` custom element:

```js
class NcLinkWithArrow extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: default
}
```

---

*Generated from `data/link-with-arrow-recipe.json` by `scripts/generate-component-specs.js`*
