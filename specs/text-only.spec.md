# text-only Component Spec
> Version 2.0.0 | Status: stable | Layer: molecule

Tags: `display`, `content`, `text`

## Anatomy
Root element: `.text-only`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| wrapper | `.text-only-wrapper` | No | — |
| text | `.text-only p:not(.button-container)` | Yes | — |
| button-container | `.text-only .button-container` | No | — |

### DOM Notes
- Aufbau: .text-only-wrapper (Flaeche background-base) > .text-only (Spalte, padding spacing-10, ab desktop-up spacing-12) > div > div (ab desktop-up 12-Spalten-Raster).
- Absatz: p in heading-s, ab desktop-up Spalten 1–7. Knopf: p.button-container mit Abstand spacing-08/09.
- Variante scroll: die Woerter stehen als <span> im Absatz (text-transparency-low); p.visible faerbt sie per Keyframes change-color ein — das Setzen von .visible beim Scrollen uebernimmt das Skript der Seite (kein Behavior im DS). Einen Modifier an der Wurzel gibt es nicht.

## Variants
### Variant (`variant`)
Variante — default (Absatz), scroll (Wort-Spans, p.visible faerbt ein)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| scroll | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `text-only`

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
