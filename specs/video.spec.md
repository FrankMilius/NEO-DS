# video Component Spec
> Version 1.0.0 | Status: stable | Layer: unknown

Tags: `media`, `object`, `interactive`

## Anatomy
Root element: `.video-wrap`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| media | `video | iframe` | Yes | Video-Element oder Embed (YouTube, Vimeo). |
| play-sign | `.play-sign` | No | Play-Button Overlay fuer Click-to-Play. |
| open-button | `.open-button` | No | Button zum Oeffnen des Video-Dialogs. |

### DOM Notes
- video-wrap als Wrapper fuer alle Video-Formate.
- video-wrap-autoplay fuer Autoplay-Videos (ohne Play-Button).
- Play-Sign ist ein zentrierter Play-Button mit Dark-Overlay.
- Video-Dialog oeffnet sich als Fullscreen-Overlay.

## Variants
### Verhalten (`behavior`)
Video-Wiedergabeverhalten.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| Click to Play (Standard) | — | Yes |
| Autoplay (Loop, Muted) | `.video-wrap-autoplay` |  |

## States
Supported: `playing`, `paused`

## CSS Token API
Base classes: `.video-wrap`

## Accessibility
- Video-Element muss Untertitel als track-Element haben (WCAG 1.2.2).
- Autoplay-Videos muessen muted sein (WCAG 1.4.2).
- Play-Button muss per Tastatur erreichbar sein.

## Web Components Mapping
Derived from anatomy for potential `<nc-video>` custom element:

```js
class NcVideo extends HTMLElement {
  static observedAttributes = ['behavior'];
  // Slots: <slot name="media">
}
```

---

*Generated from `data/video-recipe.json` by `scripts/generate-component-specs.js`*
