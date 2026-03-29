# text-media Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `display`, `content`, `media`, `split-layout`

## Anatomy
Root element: `.nc-text-media`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| media | `.nc-text-media__media` | Yes | Video oder Bild. |
| content | `.nc-text-media__content` | Yes | Headline, Subline, CTA. |

### DOM Notes
- Grid: 2 Spalten, media + content. Responsive: stacked auf mobile.

## Variants
### Layout (`layout`)
Media links oder rechts

| Value | CSS Modifier | Default |
| --- | --- | --- |
| media-left | — |  |
| media-right | `.nc-text-media--reversed` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-text-media`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-text-media-gap` | — | — |
| `nc-text-media-headline-size` | — | — |
| `nc-text-media-subline-color` | — | — |
| `nc-text-media-content-gap` | — | — |
| `nc-text-media-video-radius` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-text-media>` custom element:

```js
class NcTextMedia extends HTMLElement {
  static observedAttributes = ['layout'];
  // Slots: <slot name="media">, <slot name="content">
}
```

---

*Generated from `data/text-media-recipe.json` by `scripts/generate-component-specs.js`*
