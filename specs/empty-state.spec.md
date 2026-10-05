# empty-state Component Spec
> Version 1.0.0 | Status: stable | Layer: molecule

Tags: `feedback`, `layout`, `placeholder`

## Anatomy
Root element: `.nc-empty-state`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| icon | `.nc-empty-state__icon` | No | — |
| title | `.nc-empty-state__title` | Yes | — |
| description | `.nc-empty-state__description` | No | — |
| actions | `.nc-empty-state__actions` | No | — |

### DOM Notes
- Flex-Column-Container, zentriert (align-items + text-align: center).
- max-width: 400px + margin-inline: auto — begrenzt die Breite und zentriert horizontal.
- Icon: grosses dekoratives SVG (64px Standard), stroke-basiert, aria-hidden='true'.
- Title: Heading (h2/h3 je nach Kontext), font-heading Familie.
- Description: sekundaere Farbe, max-width via prose-max-width fuer Lesbarkeit.
- Actions: Flex-Row mit gap fuer Button(s), margin-top fuer Abstand.
- Compact-Modifier: reduziertes Padding (spacing-06), kleinere Icon/Title/Desc Groessen.
- Full-Modifier: min-height: 100% — fuellt den gesamten Container.

## Variants
### Variant (`variant`)
Groessen-Variante — default (grosszuegiges Padding, grosse Elemente), compact (weniger Padding, kleinere Elemente)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| compact | `.nc-empty-state--compact` |  |

### Height (`height`)
Hoehen-Verhalten — auto (natuerliche Hoehe), full (fuellt Container, min-height: 100%)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| auto | — |  |
| full | `.nc-empty-state--full` |  |

### Content (`content`)
Inhaltskombination — minimal (nur Title), with-description (Title + Beschreibung), with-action (Title + Beschreibung + Button), full (Icon + Title + Beschreibung + Button)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| minimal | — |  |
| with-description | — |  |
| with-action | — |  |
| full | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-empty-state`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-empty-state-padding` | — | `--mod-empty-state-padding` |
| `--nc-empty-state-gap` | — | `--mod-empty-state-gap` |
| `--nc-empty-state-max-width` | — | `--mod-empty-state-max-width` |

### Icon
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-empty-state-icon-size` | — | `--mod-empty-state-icon-size` |
| `--nc-empty-state-icon-color` | — | `--mod-empty-state-icon-color` |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-empty-state-title-size` | — | `--mod-empty-state-title-size` |
| `--nc-empty-state-title-weight` | — | `--mod-empty-state-title-weight` |
| `--nc-empty-state-title-color` | — | `--mod-empty-state-title-color` |
| `--nc-empty-state-desc-size` | — | `--mod-empty-state-desc-size` |
| `--nc-empty-state-desc-color` | — | `--mod-empty-state-desc-color` |

### Action
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-empty-state-action-gap` | — | `--mod-empty-state-action-gap` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName

## Web Components Mapping
Derived from anatomy for potential `<nc-empty-state>` custom element:

```js
class NcEmptyState extends HTMLElement {
  static observedAttributes = ['variant', 'height', 'content'];
  // Slots: <slot name="title">
}
```

---

*Generated from `data/empty-state-recipe.json` by `scripts/generate-component-specs.js`*
