# fieldset Component Spec
> Version 2.0.0 | Status: stable | Layer: organism

Tags: `form`, `layout`, `grouping`

## Anatomy
Root element: `.nc-fieldset`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| legend | `.nc-fieldset__legend` | Yes | — |
| helper | `.nc-fieldset__helper` | No | — |
| required | `.nc-fieldset__required` | No | — |

### DOM Notes
- Root: gestyltes <fieldset> — Browser-Defaults zurueckgesetzt (margin:0, min-width:0).
- Flex-Column-Layout mit gap fuer vertikalen Abstand zwischen enthaltenen Controls.
- Border: solid, sekundaere Farbe, border-radius. Visuell gruppiert die enthaltenen Felder.
- Legend: <legend> als Abschnitts-Ueberschrift. float:none + width:auto (Browser-Reset).
- Legend hat padding-inline fuer Abstand zur Border-Linie oben.
- Helper: optionale Gruppen-Beschreibung unter der Legend (aria-describedby verknuepft).
- Required: Pflicht-Indikator (*) innerhalb der Legend mit --nc-fieldset-required-color.
- Borderless-Variante: keine Border, kein Padding — nur semantische Gruppierung.
- Card-Variante: Hintergrund-Fuellung + Schatten statt Border — moderner Look.
- Density: compact (reduziertes Padding/Gap) oder loose (grosszuegiges Padding/Gap).
- Legend-Center: zentrierte Legend-Ausrichtung fuer zentrierte Formulare.
- Disabled: native <fieldset disabled> deaktiviert ALLE enthaltenen Controls.
- Disabled visuell: opacity-disabled + legend color-disabled.
- Enthaltene Kinder: .nc-form-field, .nc-checkbox-group, .nc-radio-group — eigene Tokens.

## Variants
### Appearance (`appearance`)
Section-Style — plain (Border), card (Hintergrund + Schatten), borderless (nur semantisch)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| plain | — |  |
| card | `.nc-fieldset--card` |  |
| borderless | `.nc-fieldset--borderless` |  |

### Density (`density`)
Steuert Padding und Gap — compact fuer schmale Sidebars, loose fuer Full-Page-Formulare

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| compact | `.nc-fieldset--compact` |  |
| loose | `.nc-fieldset--loose` |  |

### Legend Alignment (`legend-align`)
Ausrichtung der Legend — start (Standard), center (zentriert fuer Login/Registrierung)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| start | — |  |
| center | `.nc-fieldset--legend-center` |  |

## States
Supported: `default`, `disabled`

- **disabled**: 

## CSS Token API
Base classes: `nc-fieldset`

### Container
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-fieldset-border-width` | — | `--mod-fieldset-border-width` |
| `--nc-fieldset-border-color` | — | `--mod-fieldset-border-color` |
| `--nc-fieldset-border-radius` | — | `--mod-fieldset-border-radius` |
| `--nc-fieldset-padding` | — | `--mod-fieldset-padding` |
| `--nc-fieldset-gap` | — | `--mod-fieldset-gap` |

### Legend
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-fieldset-legend-size` | — | `--mod-fieldset-legend-size` |
| `--nc-fieldset-legend-weight` | — | `--mod-fieldset-legend-weight` |
| `--nc-fieldset-legend-color` | — | `--mod-fieldset-legend-color` |
| `--nc-fieldset-legend-padding` | — | `--mod-fieldset-legend-padding` |

### Helper-Text
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-fieldset-helper-size` | — | `--mod-fieldset-helper-size` |
| `--nc-fieldset-helper-color` | — | `--mod-fieldset-helper-color` |
| `--nc-fieldset-helper-margin-top` | — | `--mod-fieldset-helper-margin-top` |

### Card-Variante
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-fieldset-card-bg` | — | `--mod-fieldset-card-bg` |
| `--nc-fieldset-card-shadow` | — | `--mod-fieldset-card-shadow` |

### Density Compact
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-fieldset-padding-compact` | — | `--mod-fieldset-padding-compact` |
| `--nc-fieldset-gap-compact` | — | `--mod-fieldset-gap-compact` |

### Density Loose
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-fieldset-padding-loose` | — | `--mod-fieldset-padding-loose` |
| `--nc-fieldset-gap-loose` | — | `--mod-fieldset-gap-loose` |

### Required-Indikator
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-fieldset-required-color` | — | `--mod-fieldset-required-color` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName

## Dependencies
`checkbox`, `form`, `radio`

## Web Components Mapping
Derived from anatomy for potential `<nc-fieldset>` custom element:

```js
class NcFieldset extends HTMLElement {
  static observedAttributes = ['appearance', 'density', 'legend-align'];
  // Slots: <slot name="legend">
}
```

---

*Generated from `data/fieldset-recipe.json` by `scripts/generate-component-specs.js`*
