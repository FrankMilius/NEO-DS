# solutions Component Spec
> Version 1.1.0 | Status: stable | Layer: organism

Tags: `display`, `content`, `interactive`

## Anatomy
Root element: `.solutions`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| accordion | `.accordion--solutions` | Yes | — |
| side-panel | `.solutions > :nth-child(1)` | No | — |
| content-panel | `.solutions > :last-child` | No | — |
| wrapper | `.solutions-wrapper` | No | — |
| mobile-tabs | `.solutions-wrapper > div:first-child` | Yes | — |

### DOM Notes
- Desktop: 3-Spalten Grid (6+1+5) mit grid-areas accordion/side/content.
- Mobile: Horizontal-Scroll Accordion mit scroll-snap, Tabs oben.
- Accordion-Items: Details/Summary, progress-bar Animation (12s linear).
- Side/Content Panels: nur Desktop sichtbar, grid-area overlay.
- Wrapper: erstes Kind ist die Mobil-Tableiste (div > ul > li[.selected] > span), auf dem Desktop ausgeblendet; danach .solutions. Fehlt die Tableiste, ist .solutions das erste Kind und auf dem Desktop unsichtbar.

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
Base classes: `solutions`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-solutions>` custom element:

```js
class NcSolutions extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="accordion">, <slot name="mobile-tabs">
}
```

---

*Generated from `data/solutions-recipe.json` by `scripts/generate-component-specs.js`*
