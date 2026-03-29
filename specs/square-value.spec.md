# square-value Component Spec
> Version 1.0.0 | Status: stable | Layer: molecule

Tags: `display`, `animation`, `3d`

## Anatomy
Root element: `.square-value`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| wrapper | `.square-value-wrapper` | Yes | — |
| square-wrapper | `.square-wrapper` | Yes | — |
| square-block | `.square-block` | Yes | — |

### DOM Notes
- 3D-Wuerfel: transform-style preserve-3d, rotateX/rotateY fuer Flaechen.
- 4 Faces pro Wuerfel: background-inverse, radius-sm, text-inverse.
- Richtungs-Varianten: mobile-vertical, tablet-vertical, desktop-vertical.
- Animationen: enter (scale 0→1), exit (scale→0), rotate-once/-twice/-thrice, char-square Textanimation.

## Variants
### Orientation (`orientation`)
Wuerfel-Rotation — horizontal (default), mobile-vertical, tablet-vertical, desktop-vertical

| Value | CSS Modifier | Default |
| --- | --- | --- |
| horizontal | — |  |
| mobile-vertical | `.mobile-vertical` |  |
| tablet-vertical | `.tablet-vertical` |  |
| desktop-vertical | `.desktop-vertical` |  |

### Content (`content`)
Inhalt der Wuerfel-Flaechen — text, image, video

| Value | CSS Modifier | Default |
| --- | --- | --- |
| text | — |  |
| image | — |  |
| video | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `square-value`

### Base
## Accessibility
Contrast Target: WCAG AA large text (3:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-square-value>` custom element:

```js
class NcSquareValue extends HTMLElement {
  static observedAttributes = ['orientation', 'content'];
  // Slots: <slot name="wrapper">, <slot name="square-wrapper">, <slot name="square-block">
}
```

---

*Generated from `data/square-value-recipe.json` by `scripts/generate-component-specs.js`*
