# radio-group Component Spec
> Version 2.0.0 | Status: stable | Layer: molecule

Tags: `form`, `interactive`, `grouping`

## Anatomy
Root element: `.nc-radio-group`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| hint | `.nc-radio-group__hint` | No | — |

### DOM Notes
- Flex-Column Container fuer mehrere .nc-radio Elemente.
- Gap via --nc-group-gap. Horizontal: flex-row, flex-wrap, --nc-group-gap-horizontal.
- Size-Modifier (--sm / --lg) koppelt Gap an Radio-Groesse: sm=8px, md=12px (default), lg=16px.
- Segmented-Variante: Pillen-Design, Radios nahtlos aneinanderliegend, Controls versteckt, Labels als Buttons.
- Card-Variante: Jedes .nc-radio bekommt .nc-radio--card Modifier fuer eigene Box.
- Hint-Slot: Enthaelt .nc-form-hint fuer Gruppen-Hilfetext. Verknuepft via aria-describedby auf dem Gruppen-Container.
- Error: propagiert border-error auf alle Radio-Controls.
- Disabled: opacity + pointer-events:none auf gesamte Gruppe.
- Tastatur: Arrow Keys wechseln zwischen Radios.

## Variants
### Layout (`layout`)
Layout — vertical (Standard), horizontal (nebeneinander)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| vertical | — |  |
| horizontal | `.nc-radio-group--horizontal` |  |

### Size (`size`)
Koppelt den Gruppen-Gap an die Radio-Groesse — sm (8px), md (12px, Standard), lg (16px)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-radio-group--sm` |  |
| md | — |  |
| lg | `.nc-radio-group--lg` |  |

### Variant (`variant`)
Visuelle Variante — default (Liste), segmented (Pillen-Design), card (Box pro Option)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| segmented | `.nc-radio-group--segmented` |  |
| card | — |  |

## States
Supported: `default`, `error`, `disabled`

- **error**: 
- **disabled**: 

## CSS Token API
Base classes: `nc-radio-group`

### Geometry (Gap)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-group-gap` | — | `--mod-group-gap` |
| `--nc-group-gap-sm` | — | `--mod-group-gap-sm` |
| `--nc-group-gap-lg` | — | `--mod-group-gap-lg` |
| `--nc-group-gap-horizontal` | — | `--mod-group-gap-horizontal` |

### Hint
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-group-hint-margin-top` | — | `--mod-group-hint-margin-top` |

### Segmented Control
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-radio-segmented-bg` | — | `--mod-radio-segmented-bg` |
| `--nc-radio-segmented-bg-checked` | — | `--mod-radio-segmented-bg-checked` |
| `--nc-radio-segmented-color` | — | `--mod-radio-segmented-color` |
| `--nc-radio-segmented-color-checked` | — | `--mod-radio-segmented-color-checked` |
| `--nc-radio-segmented-radius` | — | `--mod-radio-segmented-radius` |
| `--nc-radio-segmented-padding` | — | `--mod-radio-segmented-padding` |
| `--nc-radio-segmented-border` | — | `--mod-radio-segmented-border` |

### Card Variant
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-radio-card-bg` | — | `--mod-radio-card-bg` |
| `--nc-radio-card-bg-checked` | — | `--mod-radio-card-bg-checked` |
| `--nc-radio-card-border` | — | `--mod-radio-card-border` |
| `--nc-radio-card-border-checked` | — | `--mod-radio-card-border-checked` |
| `--nc-radio-card-border-hover` | — | `--mod-radio-card-border-hover` |
| `--nc-radio-card-radius` | — | `--mod-radio-card-radius` |
| `--nc-radio-card-padding` | — | `--mod-radio-card-padding` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Dependencies
`form`, `radio`

## Web Components Mapping
Derived from anatomy for potential `<nc-radio-group>` custom element:

```js
class NcRadioGroup extends HTMLElement {
  static observedAttributes = ['layout', 'size', 'variant'];
  // Slots: default
}
```

---

*Generated from `data/radio-group-recipe.json` by `scripts/generate-component-specs.js`*
