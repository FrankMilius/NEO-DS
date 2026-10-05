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

### Navigation (`navigation`)
Zusaetzlich zu Tabs bzw. Scrollen: Blaettern ueber .nc-gallery__paddle und eine Uebersicht ueber .nc-gallery__nav-dot — dieselben Bauteile wie im Galerie-Block. Uebernommen ist das Aussehen, nicht die Lage: Dort sind beide Overlays ueber dem Medium, hier stehen sie darunter im Fluss.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| tabs | — |  |
| paddles | `.nc-fade-gallery__nav-row` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-fade-gallery`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-fade-gallery-radius` | — | `--mod-fade-gallery-radius` |
| `--nc-fade-gallery-headline-size` | — | `--mod-fade-gallery-headline-size` |

### Ansichten-Leiste
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-fade-gallery-tab-family` | — | `--mod-fade-gallery-tab-family` |
| `--nc-fade-gallery-tab-size` | — | `--mod-fade-gallery-tab-size` |
| `--nc-fade-gallery-tab-weight` | — | `--mod-fade-gallery-tab-weight` |
| `--nc-fade-gallery-tab-tracking` | — | `--mod-fade-gallery-tab-tracking` |
| `--nc-fade-gallery-tab-padding` | — | `--mod-fade-gallery-tab-padding` |
| `--nc-fade-gallery-tab-color` | — | `--mod-fade-gallery-tab-color` |
| `--nc-fade-gallery-tab-active` | — | `--mod-fade-gallery-tab-active` |
| `--nc-fade-gallery-tab-indicator` | — | `--mod-fade-gallery-tab-indicator` |
| `--nc-fade-gallery-desc-size` | — | `--mod-fade-gallery-desc-size` |
| `--nc-fade-gallery-desc-measure` | — | `--mod-fade-gallery-desc-measure` |
| `--nc-fade-gallery-desc-color` | — | `--mod-fade-gallery-desc-color` |
| `--nc-fade-gallery-nav-gap` | — | `--mod-fade-gallery-nav-gap` |

### Caption
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-fade-gallery-desc-size` | — | `--mod-fade-gallery-desc-size` |
| `--nc-fade-gallery-desc-color` | — | `--mod-fade-gallery-desc-color` |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-fade-gallery-fade-duration` | — | `--mod-fade-gallery-fade-duration` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-fade-gallery>` custom element:

```js
class NcFadeGallery extends HTMLElement {
  static observedAttributes = ['variant', 'navigation'];
  // Slots: default
}
```

---

*Generated from `data/fade-gallery-recipe.json` by `scripts/generate-component-specs.js`*
