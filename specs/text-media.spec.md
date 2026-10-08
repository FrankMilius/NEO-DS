# text-media Component Spec
> Version 1.1.2 | Status: stable | Layer: organism

Tags: `display`, `content`, `media`, `split-layout`

## Anatomy
Root element: `.nc-text-media`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| media | `.nc-text-media__media` | Yes | Video oder Bild. |
| content | `.nc-text-media__content` | Yes | Headline, Subline, CTA. |

### DOM Notes
- Grid: 2 Spalten, media + content. Responsive: stacked auf mobile.
- ACHTUNG Divergenz DS <-> Drupal: im DS ist .nc-text-media selbst das Grid (Container-Queries). Das Drupal-Template nutzt ein zusaetzliches .nc-text-media__grid, das in neo-overrides.css gestylt wird. Die Modifier greifen dort.
- Ohne Medium darf der Medien-Container NICHT gerendert werden - sonst bleibt bei 1fr 1fr eine leere Spalte stehen (gemessen: 487px ungenutzt, Text nur 48% Breite).
- media-right tauscht per order, nicht per DOM-Reihenfolge - die Vorlesereihenfolge bleibt damit unveraendert.

## Variants
### Layout (`layout`)
Media links oder rechts

| Value | CSS Modifier | Default |
| --- | --- | --- |
| media-left | — |  |
| media-right | `.nc-text-media--reversed` |  |

### Text Alignment (no media) (`textAlign`)
Ausrichtung des Textblocks, wenn KEIN Medium gesetzt ist. Mit Medium bestimmt layout die Anordnung.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| left | — | Yes |
| center | — |  |
| right | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-text-media`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-text-media-gap` | — | `--mod-text-media-gap` |
| `--nc-text-media-headline-size` | — | `--mod-text-media-headline-size` |
| `--nc-text-media-subline-color` | — | `--mod-text-media-subline-color` |
| `--nc-text-media-content-gap` | — | `--mod-text-media-content-gap` |
| `--nc-text-media-video-radius` | — | `--mod-text-media-video-radius` |

### Geraeterahmen
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-text-media-device-width` | — | `--mod-text-media-device-width` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-text-media>` custom element:

```js
class NcTextMedia extends HTMLElement {
  static observedAttributes = ['layout', 'textAlign'];
  // Slots: <slot name="media">, <slot name="content">
}
```

---

*Generated from `data/text-media-recipe.json` by `scripts/generate-component-specs.js`*
