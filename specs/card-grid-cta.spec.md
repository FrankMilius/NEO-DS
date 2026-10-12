# card-grid-cta Component Spec
> Version 1.2.0 | Status: stable | Layer: organism

Tags: `display`, `hero`, `cta`, `grid`

## Anatomy
Root element: `.nc-card-grid-cta`

### DOM Notes
- Hero-artige Teaser-Karten mit BG-Media + Headline + CTA.
- Karten-Video (Plan v4, Phase 3): .nc-card-cta mit [data-neo-video]; Knopf .nc-video-pause (Recipe video) unten am Ende der Karte.

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-card-grid-cta`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-grid-cta-columns` | — | — |
| `--nc-card-grid-cta-gap` | — | — |
| `--nc-card-grid-cta-padding` | — | — |
| `--nc-card-grid-cta-radius` | — | — |

### Title
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-grid-cta-title-size` | — | — |
| `--nc-card-grid-cta-title-weight` | — | — |
| `--nc-card-grid-cta-title-color` | — | — |

### Overlay
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-grid-cta-overlay-start` | — | — |
| `--nc-card-grid-cta-overlay-end` | — | — |

### Interaction
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-grid-cta-hover-scale` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- 2.2.2: Karten-Videos mit eigenem Pause-Knopf (.nc-video-pause, Recipe video).

## Dependencies
`card`

## Web Components Mapping
Derived from anatomy for potential `<nc-card-grid-cta>` custom element:

```js
class NcCardGridCta extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: default
}
```

---

*Generated from `data/card-grid-cta-recipe.json` by `scripts/generate-component-specs.js`*
