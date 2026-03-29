# carousel Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `display`, `interactive`, `slider`

## Anatomy
Root element: `.carousel`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| slides-wrapper | `.carousel-slides-wrapper` | Yes | — |
| bottom-nav | `.carousel-bottom-nav-wrapper` | Yes | — |
| line-wrapper | `.carousel-line-wrapper` | No | — |
| navigations | `.carousel-navigations-wrapper` | No | — |

### DOM Notes
- Slides: ul/li, flex nowrap, dynamische Breite via carousel-slide-width-{1-12}.
- Progress-Lines: 2px Hoehe, active-Line 112px breit, autoplay mit CSS-Animation.
- Navigation-Buttons: 32×32, icon-only, :disabled state, focus-ring.

## Variants
### Variant (`variant`)
Variante — default, autoplay

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| autoplay | — |  |

## States
Supported: `default`, `disabled`

- **disabled**: 

## CSS Token API
Base classes: `carousel`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-carousel>` custom element:

```js
class NcCarousel extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="slides-wrapper">, <slot name="bottom-nav">
}
```

---

*Generated from `data/carousel-recipe.json` by `scripts/generate-component-specs.js`*
