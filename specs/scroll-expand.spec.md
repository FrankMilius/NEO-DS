# scroll-expand Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `animation`, `scroll`, `parallax`

## Anatomy
Root element: `.nc-scroll-expand`

### DOM Notes
- Element expandiert von Content-Breite zum Viewport beim Scrollen.

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-scroll-expand`

### Timing
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-anim-expand-duration` | — | — |
| `nc-anim-scroll-easing` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-scroll-expand>` custom element:

```js
class NcScrollExpand extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: default
}
```

---

*Generated from `data/scroll-expand-recipe.json` by `scripts/generate-component-specs.js`*
