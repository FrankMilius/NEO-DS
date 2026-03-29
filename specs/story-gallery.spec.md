# story-gallery Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `display`, `gallery`, `scroll`, `cards`

## Anatomy
Root element: `.nc-story-gallery`

### DOM Notes
- Horizontale Scroll-Gallery mit Caption-Cards (Apple-Style).

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-story-gallery`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-story-gallery-card-height` | — | — |
| `nc-story-gallery-gap` | — | — |
| `nc-story-gallery-radius` | — | — |
| `nc-story-gallery-headline-size` | — | — |

### Title
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-story-gallery-title-size` | — | — |
| `nc-story-gallery-title-weight` | — | — |
| `nc-story-gallery-title-color` | — | — |

### Description
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-story-gallery-desc-size` | — | — |
| `nc-story-gallery-desc-color` | — | — |

### Paddles
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-story-gallery-paddle-size` | — | — |
| `nc-story-gallery-paddle-bg` | — | — |
| `nc-story-gallery-paddle-shadow` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-story-gallery>` custom element:

```js
class NcStoryGallery extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: default
}
```

---

*Generated from `data/story-gallery-recipe.json` by `scripts/generate-component-specs.js`*
