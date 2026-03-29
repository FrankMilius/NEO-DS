# question Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `display`, `animation`, `marquee`

## Anatomy
Root element: `.question`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| text-row | `.question-text-row` | Yes | — |
| text | `.question-text` | Yes | — |
| text-container | `.question-text-container` | No | — |
| action-section | `.question-action-section` | No | — |

### DOM Notes
- Marquee-Lauftext: alternierend links/rechts scrollend (marquee/marquee-reverse).
- Geschwindigkeit: --px-per-sec (80 mobile, 160 desktop). Icon-Separatoren zwischen Texten.
- Action-Section: Buttons + Paragraphs. with-text Variante: side-by-side Layout ab Tablet.

## Variants
### Variant (`variant`)
Variante — default, with-text

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| with-text | `.with-text` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `question`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-question>` custom element:

```js
class NcQuestion extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="text-row">, <slot name="text">
}
```

---

*Generated from `data/question-recipe.json` by `scripts/generate-component-specs.js`*
