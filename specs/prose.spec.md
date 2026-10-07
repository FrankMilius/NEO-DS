# prose Component Spec
> Version 1.0.0 | Status: draft | Layer: object

Tags: `layout`, `objects`, `lesen`, `editorial`

## Anatomy
Root element: `.nc-prose`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| bleed-content | `.nc-bleed-content` | No | Kind bricht bis zur Content-Breite aus (oder data-bleed="content"). |
| bleed-wide | `.nc-bleed-wide` | No | Kind bricht bis zur Wide-Breite aus (oder data-bleed="wide"). |
| bleed-full | `.nc-bleed-full` | No | Kind laeuft ueber die volle Breite (gekappt auf xwide; oder data-bleed="full"). |

### DOM Notes
- Ein CSS-Grid mit benannten Linien full | wide | content | prose: jedes direkte Kind steht in der Prosa-Spalte (--prose-measure = --container-prose).
- Breakout per Klasse (.nc-bleed-*) oder Attribut data-bleed="content|wide|full"; die Website nutzt das Attribut (gefilterte Body-HTML).
- Website: field--body.html.twig legt das Body-Feld in .nc-prose, mit reading_left zusaetzlich .nc-prose--left.
- Overrides: --mod-prose-measure, --mod-prose-gutter, --mod-prose-max.

## Variants
### Ausrichtung (`alignment`)
Lage der Lesespalte

| Value | CSS Modifier | Default |
| --- | --- | --- |
| center | — |  |
| left | `.nc-prose--left` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-prose`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--container-content` | — | — |
| `--container-padding-inline` | — | — |
| `--container-prose` | — | — |
| `--container-wide` | — | — |
| `--container-xwide` | — | — |
| `--fnd-spacing-06` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-prose>` custom element:

```js
class NcProse extends HTMLElement {
  static observedAttributes = ['alignment'];
  // Slots: default
}
```

---

*Generated from `data/prose-recipe.json` by `scripts/generate-component-specs.js`*
