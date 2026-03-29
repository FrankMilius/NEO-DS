# video-section Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `display`, `media`, `content`

## Anatomy
Root element: `.nc-video`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| media | `.nc-video__media` | Yes | — |
| content | `.nc-video__content` | Yes | — |
| title | `.nc-video__title` | No | — |
| text | `.nc-video__text` | No | — |
| overlay | `.nc-video__overlay` | No | — |
| overlay-icon | `.nc-video__overlay-icon` | No | — |

### DOM Notes
- 2-Spalten Grid: media + content, gap 4rem. Single-Column unter 900px.
- Media: 16:9 aspect-ratio, always-dark BG, radius-sm, overflow hidden.
- Play-Overlay: Gradient-Overlay, 72×72 runder Button mit Play-Triangle.
- is-playing: Overlay ausblenden (opacity 0, pointer-events none).

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`, `playing`

- **playing**: 

## CSS Token API
Base classes: `nc-video`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Dependencies
`video`

## Web Components Mapping
Derived from anatomy for potential `<nc-video-section>` custom element:

```js
class NcVideoSection extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="media">, <slot name="content">
}
```

---

*Generated from `data/video-section-recipe.json` by `scripts/generate-component-specs.js`*
