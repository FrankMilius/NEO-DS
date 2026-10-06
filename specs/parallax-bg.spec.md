# parallax-bg Component Spec
> Version 1.1.0 | Status: stable | Layer: organism

Tags: `animation`, `decoration`, `scroll`

## Anatomy
Root element: `.nc-parallax-bg`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| grid | `.nc-parallax-grid` | Yes | — |
| square | `.nc-parallax-square` | Yes | — |
| bar | `.nc-parallax-bar` | No | — |

### DOM Notes
- Staircase Grid Reveal mit animierten Quadraten.
- Markup wie components/parallax-bg/parallax-bg.twig (neo_fe, SDC). Grid, Flaechen und Balken gestaltet die Drupal-Komponente (parallax-bg.css), nicht styles.css; im DS gibt es nur .nc-hero-tmob .nc-parallax-bg.
- Bewegung: die Deckkraft der Flaechen steuert GSAP/ScrollTrigger (parallax-bg.js). Die Arena zeigt den Endzustand (targetOpacity).

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-parallax-bg`

### Core
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-parallax-radius` | — | `--mod-parallax-radius` |
| `--nc-parallax-gap` | — | `--mod-parallax-gap` |
| `--nc-parallax-bg` | — | `--mod-parallax-bg` |
| `--nc-parallax-square-color` | — | `--mod-parallax-square-color` |
| `--nc-parallax-opacity` | — | `--mod-parallax-opacity` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-parallax-bg>` custom element:

```js
class NcParallaxBg extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="grid">, <slot name="square">
}
```

---

*Generated from `data/parallax-bg-recipe.json` by `scripts/generate-component-specs.js`*
