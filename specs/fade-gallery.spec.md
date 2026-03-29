# fade-gallery Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `display`, `gallery`, `tabs`, `fade`

## Anatomy
Root element: `.nc-fade-gallery`

### DOM Notes
- Tab-basierte Fade-Gallery (Apple-Style). Medium + Description faden ein.

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-fade-gallery`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-fade-gallery-radius` | — | — |
| `nc-fade-gallery-headline-size` | — | — |

### Tabs
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-fade-gallery-tab-size` | — | — |
| `nc-fade-gallery-tab-weight` | — | — |
| `nc-fade-gallery-tab-color` | — | — |
| `nc-fade-gallery-tab-active` | — | — |
| `nc-fade-gallery-tab-indicator` | — | — |

### Caption
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-fade-gallery-desc-size` | — | — |
| `nc-fade-gallery-desc-color` | — | — |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-fade-gallery-fade-duration` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-fade-gallery>` custom element:

```js
class NcFadeGallery extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: default
}
```

---

*Generated from `data/fade-gallery-recipe.json` by `scripts/generate-component-specs.js`*
