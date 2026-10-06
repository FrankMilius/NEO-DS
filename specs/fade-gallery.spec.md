# fade-gallery Component Spec
> Version 1.1.1 | Status: stable | Layer: organism

Tags: `display`, `gallery`, `tabs`, `fade`

## Anatomy
Root element: `.nc-fade-gallery`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| viewport | `.nc-fade-gallery__viewport` | Yes | — |
| media | `.nc-fade-gallery__media` | Yes | — |
| nav-row | `.nc-fade-gallery__nav-row` | Yes | — |
| tabs | `.nc-fade-gallery__tabs` | Yes | — |
| tab | `.nc-fade-gallery__tab` | Yes | — |
| caption | `.nc-fade-gallery__caption` | Yes | — |
| desc | `.nc-fade-gallery__desc` | Yes | — |

### DOM Notes
- Tab-basierte Fade-Gallery (Apple-Style). Medium + Description faden ein.
- Zustaende der Ansicht: .is-active am Medium, .is-visible an der Beschreibung (die anderen [hidden]), aria-selected am Tab — das SCSS blendet ueber (opacity 0.5 s / 0.4 s, ohne bei prefers-reduced-motion).
- Website-only: die Paddles tragen neben .nc-gallery__paddle die Haken .nc-gallery__paddle--prev/--next (Twig block--block-content--neo-fade-gallery.html.twig) — kein CSS im DS; das Blaettern bindet neo-theme.js ueber data-fg-prev/data-fg-next.

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
| paddles | — |  |

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
  // Slots: <slot name="viewport">, <slot name="media">, <slot name="nav-row">, <slot name="tabs">, <slot name="tab">, <slot name="caption">, <slot name="desc">
}
```

---

*Generated from `data/fade-gallery-recipe.json` by `scripts/generate-component-specs.js`*
