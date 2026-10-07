# section-header Component Spec
> Version 1.0.0 | Status: draft | Layer: molecule

Tags: `content`, `molecules`, `block-kopf`

## Anatomy
Root element: `.nc-section-header`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| badges | `.nc-section-header__badges` | No | Badge-Zeile (.nc-badge-row mit .nc-label) ueber dem Kicker. |
| label | `.nc-section-header__label` | No | Kicker (Dachzeile, Monospace in Versalien). |
| title | `.nc-section-header__title` | Yes | Ueberschrift (h2, per heading_level auch h1/h3). |
| subtitle | `.nc-section-header__subtitle` | No | Lead. |

### DOM Notes
- Der geteilte Kopf der Website-Bloecke: neo_fe:block-header rendert Badges -> Kicker -> Headline -> Lead; rund 20 Bloecke binden ihn ein.
- Die Badge-Zeile ist .nc-badge-row (05-atoms/_badge-row.scss, Hilfsklasse ohne eigenes Recipe) mit .nc-section-header__badges fuer den Abstand.
- --flush nimmt den Abstand nach unten weg — fuer Flex-/Grid-Eltern mit eigenem gap (text-media, form-block, accordion-block, text-cta).
- Hoechstbreite --fnd-prose-max-width (72ch); --center und --right richten auch die Badge-Zeile mit aus.

## Variants
### Ausrichtung (`alignment`)
Textausrichtung des Kopfs

| Value | CSS Modifier | Default |
| --- | --- | --- |
| left | — |  |
| center | `.nc-section-header--center` |  |
| right | `.nc-section-header--right` |  |

### Abstand (`spacing`)
Abstand zum Folgeinhalt

| Value | CSS Modifier | Default |
| --- | --- | --- |
| standard | — |  |
| flush | `.nc-section-header--flush` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-section-header`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-section-header-gap` | — | `--mod-section-header-gap` |
| `--nc-section-header-badges-spacing` | — | `--mod-section-header-badges-spacing` |

### Kicker
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-section-header-label-color` | — | `--mod-section-header-label-color` |
| `--nc-section-header-label-font-size` | — | `--mod-section-header-label-font-size` |
| `--nc-section-header-label-font-weight` | — | `--mod-section-header-label-font-weight` |
| `--nc-section-header-label-letter-spacing` | — | `--mod-section-header-label-letter-spacing` |
| `--nc-section-header-label-text-transform` | — | `--mod-section-header-label-text-transform` |
| `--nc-section-header-label-spacing` | — | `--mod-section-header-label-spacing` |

### Titel
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-section-header-title-color` | — | `--mod-section-header-title-color` |
| `--nc-section-header-title-font-size` | — | `--mod-section-header-title-font-size` |
| `--nc-section-header-title-font-weight` | — | `--mod-section-header-title-font-weight` |
| `--nc-section-header-title-line-height` | — | `--mod-section-header-title-line-height` |
| `--nc-section-header-title-letter-spacing` | — | `--mod-section-header-title-letter-spacing` |
| `--nc-section-header-title-spacing` | — | `--mod-section-header-title-spacing` |

### Lead
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-section-header-subtitle-color` | — | `--mod-section-header-subtitle-color` |
| `--nc-section-header-subtitle-font-size` | — | `--mod-section-header-subtitle-font-size` |
| `--nc-section-header-subtitle-line-height` | — | `--mod-section-header-subtitle-line-height` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-section-header>` custom element:

```js
class NcSectionHeader extends HTMLElement {
  static observedAttributes = ['alignment', 'spacing'];
  // Slots: <slot name="title">
}
```

---

*Generated from `data/section-header-recipe.json` by `scripts/generate-component-specs.js`*
