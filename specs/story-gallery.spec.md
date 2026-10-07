# story-gallery Component Spec
> Version 1.2.0 | Status: stable | Layer: organism

Tags: `display`, `gallery`, `scroll`, `cards`

## Anatomy
Root element: `.nc-story-gallery`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| scroll | `.nc-story-gallery__scroll` | Yes | — |
| track | `.nc-story-gallery__track` | Yes | — |
| card | `.nc-story-gallery__card` | Yes | — |
| media | `.nc-story-gallery__media` | Yes | — |
| caption | `.nc-story-gallery__caption` | Yes | — |
| title | `.nc-story-gallery__title` | Yes | — |
| desc | `.nc-story-gallery__desc` | No | — |
| footer | `.nc-story-gallery__footer` | No | — |
| paddles | `.nc-story-gallery__paddles` | No | — |
| paddle | `.nc-story-gallery__paddle` | No | — |
| cursor-paddle | `.nc-story-gallery__cursor-paddle` | No | — |
| cursor-icon | `.nc-story-gallery__cursor-icon` | No | — |

### DOM Notes
- Horizontale Scroll-Gallery mit Caption-Cards (Apple-Style).
- Markup wie data/markup/story-gallery.html (Website) und block--block-content--neo-story-gallery.html.twig: __footer mit den Paddles ist Geschwister der Galerie (navigation below), __paddles--overlay liegt in der Galerie.
- Website-only (kein CSS im DS, die Arena laesst sie weg): .nc-story-gallery--nav-below — setzt das Twig (block--…--neo-story-gallery.html.twig), wenn die Paddles unter der Galerie stehen.
- Medium: DS-Bauteil shot (seit 07.10.2026, vorher neo-shot.js/neo-shot.css der Website) — neo-theme.js ruft NeoBehaviors.shotAufbauen(.nc-story-gallery__media, Karte); das Medium wird selbst .nc-shot[data-nc-shot] (Fokus-Crop und Darstellungen). Die Arena zeigt das Medium als einfaches Bild.
- Blaettern: Paddles und Cursor-Paddle steuert neo-theme.js; die Bewegung der Spur ist scroll-behavior: smooth aus dem DS (bei prefers-reduced-motion: auto).

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

### Paddles (`navigation`)
Lage der Blaetter-Knoepfe.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| below | — |  |
| overlay | — |  |

### Endlos (`loop`)
Spur ohne Einzug, Cursor-Paddle statt Mauszeiger.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| off | — |  |
| on | `.nc-story-gallery--loop` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-story-gallery`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-story-gallery-card-height` | — | `--mod-story-gallery-card-height` |
| `--nc-story-gallery-gap` | — | `--mod-story-gallery-gap` |
| `--nc-story-gallery-radius` | — | `--mod-story-gallery-radius` |
| `--nc-story-gallery-headline-size` | — | `--mod-story-gallery-headline-size` |

### Title
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-story-gallery-title-size` | — | `--mod-story-gallery-title-size` |
| `--nc-story-gallery-title-weight` | — | `--mod-story-gallery-title-weight` |
| `--nc-story-gallery-title-color` | — | `--mod-story-gallery-title-color` |

### Description
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-story-gallery-desc-size` | — | `--mod-story-gallery-desc-size` |
| `--nc-story-gallery-desc-color` | — | `--mod-story-gallery-desc-color` |

### Paddles
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-story-gallery-paddle-size` | — | `--mod-story-gallery-paddle-size` |
| `--nc-story-gallery-paddle-bg` | — | `--mod-story-gallery-paddle-bg` |
| `--nc-story-gallery-paddle-shadow` | — | `--mod-story-gallery-paddle-shadow` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-story-gallery>` custom element:

```js
class NcStoryGallery extends HTMLElement {
  static observedAttributes = ['variant', 'navigation', 'loop'];
  // Slots: <slot name="scroll">, <slot name="track">, <slot name="card">, <slot name="media">, <slot name="caption">, <slot name="title">
}
```

---

*Generated from `data/story-gallery-recipe.json` by `scripts/generate-component-specs.js`*
