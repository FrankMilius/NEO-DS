# card-grid Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `display`, `content`, `grid`, `cards`

## Anatomy
Root element: `.nc-card-grid`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| card | `.nc-card` | Yes | Einzelne Card im Grid. |

### DOM Notes
- CSS Grid mit auto-fit oder fester Spaltenanzahl. Cards per JSON gerendert.

## Variants
### Pattern (`pattern`)
Card-Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| standard | — |  |
| preview | — |  |
| featured | — |  |
| horizontal | — |  |

### Animation (`animation`)
Scroll-basierte Einblendanimation

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| reverse-domino | — |  |

## States
Supported: `default`, `hover`

## CSS Token API
Base classes: `nc-card-grid`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-grid-columns` | — | `--mod-card-grid-columns` |
| `--nc-card-grid-gap` | — | `--mod-card-grid-gap` |
| `--nc-card-grid-title-size` | — | `--mod-card-grid-title-size` |
| `--nc-card-grid-title-margin` | — | `--mod-card-grid-title-margin` |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-grid-anim-duration` | — | `--mod-card-grid-anim-duration` |
| `--nc-card-grid-anim-delay` | — | `--mod-card-grid-anim-delay` |
| `--nc-card-grid-anim-translate-y` | — | `--mod-card-grid-anim-translate-y` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Dependencies
`card`

## Web Components Mapping
Derived from anatomy for potential `<nc-card-grid>` custom element:

```js
class NcCardGrid extends HTMLElement {
  static observedAttributes = ['pattern', 'animation'];
  // Slots: <slot name="card">
}
```

---

*Generated from `data/card-grid-recipe.json` by `scripts/generate-component-specs.js`*
