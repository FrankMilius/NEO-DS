# faq Component Spec
> Version 1.1.0 | Status: stable | Layer: molecule

Tags: `content`, `interactive`, `accordion`

## Anatomy
Root element: `.nc-faq`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| item | `.nc-faq__item` | Yes | — |
| question | `.nc-faq__question` | Yes | — |
| answer | `.nc-faq__answer` | Yes | — |

### DOM Notes
- Grid-Container mit FAQ-Items. Item: border, radius-3xl, padding.
- Question: semibold, cursor:pointer. Answer: text-secondary.
- Aufklappbar via <details>/<summary> oder JS.

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
Base classes: `nc-faq`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-faq>` custom element:

```js
class NcFaq extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="item">, <slot name="question">, <slot name="answer">
}
```

---

*Generated from `data/faq-recipe.json` by `scripts/generate-component-specs.js`*
