# media-frame Component Spec
> Version 1.0.0 | Status: draft | Layer: object

Tags: `layout`, `objects`, `media`

## Anatomy
Root element: `.nc-media-frame`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| surface | `.nc-surface-muted` | No | Abgesetzte Flaeche (Layer 2) um den ganzen Block — kombinierbar, steht AUSSEN. |

### DOM Notes
- Bildrahmen fuer Produkt-Screenshots mit hohem Weissanteil: Hairline (--nc-media-frame-border-*) plus Elevation (--nc-media-frame-shadow); die Hairline ist nicht optional (WCAG 1.4.11).
- Website: die Klasse sitzt direkt am <img> (text-media: img.nc-text-media__image.nc-media-frame); als Rahmen um <img>, <picture> oder <video> fuellt das Kind ihn ohne Luecke.
- forced-colors: Kante CanvasText, kein Schatten; prefers-contrast: more: Kante border-strong, kein Schatten; Druck: kein Schatten (in der Arena nicht darstellbar).
- .nc-surface-muted ist die zweite Ebene derselben Datei; derzeit ohne Verwender auf der Website.

## Variants
### Kante (`edge`)
Radius des Rahmens

| Value | CSS Modifier | Default |
| --- | --- | --- |
| rund | — |  |
| flush | `.nc-media-frame--flush` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-media-frame`

### Rahmen
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-media-frame-border-width` | — | `--mod-media-frame-border-width` |
| `--nc-media-frame-border-color` | — | `--mod-media-frame-border-color` |
| `--nc-media-frame-radius` | — | `--mod-media-frame-radius` |
| `--nc-media-frame-shadow` | — | `--mod-media-frame-shadow` |

### Abgesetzte Flaeche
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-surface-muted-bg` | — | `--mod-surface-muted-bg` |
| `--nc-surface-muted-radius` | — | `--mod-surface-muted-radius` |
| `--nc-surface-muted-padding` | — | `--mod-surface-muted-padding` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-media-frame>` custom element:

```js
class NcMediaFrame extends HTMLElement {
  static observedAttributes = ['edge'];
  // Slots: default
}
```

---

*Generated from `data/media-frame-recipe.json` by `scripts/generate-component-specs.js`*
