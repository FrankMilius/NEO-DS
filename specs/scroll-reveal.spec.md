# scroll-reveal Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `animation`, `scroll`, `fade-in`

## Anatomy
Root element: `.nc-scroll-reveal`

### DOM Notes
- Staggered Fade-In via Intersection Observer.

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-scroll-reveal`

### Timing
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-anim-fade-duration` | — | — |
| `nc-anim-fade-easing` | — | — |
| `nc-anim-stagger-delay` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-scroll-reveal>` custom element:

```js
class NcScrollReveal extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: default
}
```

---

*Generated from `data/scroll-reveal-recipe.json` by `scripts/generate-component-specs.js`*
