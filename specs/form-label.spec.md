# form-label Component Spec
> Version 2.0.0 | Status: stable | Layer: molecule

Tags: `form`, `text`, `label`, `accessibility`

## Anatomy
Root element: `.nc-form-label`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| text | `.nc-form-label__text` | Yes | — |
| required | `.nc-form-label__required` | No | — |
| optional | `.nc-form-label__optional` | No | — |
| info | `.nc-form-label__info` | No | — |

### DOM Notes
- Semantisch ein <label for='input-id'> Element.
- Flexbox-Layout: Text + Indicator + Info-Icon inline, align-items: baseline.
- margin-bottom via --nc-form-label-gap — Abstand zum darunterliegenden Input.
- Required-Sternchen ('*'): aria-hidden='true' — Screen Reader liest aria-required am Input.
- Optional-Text ('(Optional)'): kleiner, leichteres Gewicht, tertiaere Farbe.
- Info-Icon: <button> mit aria-label, oeffnet Tooltip bei Click/Hover. Fokussierbar via Tab.
- cursor: pointer — Klick auf Label fokussiert den verknuepften Input.
- Klickbereich: padding-block + min-height vergroessern den Touch-Target (Fitts' Law, WCAG 2.5.8 Target Size).
- Im .nc-form-field Wrapper wird margin-bottom: 0 gesetzt (gap uebernimmt).

## Variants
### Indicator (`indicator`)
Pflichtfeld-Indikator — none (Standard), required (rotes *), optional (grauer Text), info (Tooltip-Icon)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| required | — |  |
| optional | — |  |
| info | — |  |

### Size (`size`)
Typografie-Hierarchie — sm (kompakt), md (Standard), emphasis (hervorgehoben fuer Section-Labels)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-form-label--sm` |  |
| md | — |  |
| emphasis | `.nc-form-label--emphasis` |  |

### Layout (`layout`)
Layout-Variante — block (Standard, Label ueber Input), inline (Label neben Input)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| block | — |  |
| inline | `.nc-form-label--inline` |  |

## States
Supported: `default`, `disabled`

- **disabled**: 

## CSS Token API
Base classes: `nc-form-label`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-label-font-size` | — | `--mod-form-label-font-size` |
| `--nc-form-label-font-weight` | — | `--mod-form-label-font-weight` |
| `--nc-form-label-gap` | — | `--mod-form-label-gap` |
| `--nc-form-label-padding-block` | — | `--mod-form-label-padding-block` |
| `--nc-form-label-min-height` | — | `--mod-form-label-min-height` |

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-label-color` | — | `--mod-form-label-color` |
| `--nc-form-label-required-color` | — | `--mod-form-label-required-color` |
| `--nc-form-label-optional-color` | — | `--mod-form-label-optional-color` |
| `--nc-form-label-info-color` | — | `--mod-form-label-info-color` |

### Size SM Overrides
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-label-sm-font-size` | — | `--mod-form-label-sm-font-size` |
| `--nc-form-label-sm-font-weight` | — | `--mod-form-label-sm-font-weight` |

### Size Emphasis Overrides
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-label-emphasis-font-size` | — | `--mod-form-label-emphasis-font-size` |
| `--nc-form-label-emphasis-font-weight` | — | `--mod-form-label-emphasis-font-weight` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName

## Dependencies
`form`

## Web Components Mapping
Derived from anatomy for potential `<nc-form-label>` custom element:

```js
class NcFormLabel extends HTMLElement {
  static observedAttributes = ['indicator', 'size', 'layout'];
  // Slots: <slot name="text">
}
```

---

*Generated from `data/form-label-recipe.json` by `scripts/generate-component-specs.js`*
