# input-group Component Spec
> Version 2.0.0 | Status: stable | Layer: molecule

Tags: `interactive`, `form`, `composite`

## Anatomy
Root element: `.nc-input-group`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| prepend | `.nc-input-group__prepend` | No | — |
| input | `.nc-input` | Yes | — |
| append | `.nc-input-group__append` | No | — |

### DOM Notes
- Flex-Row Container: display:flex, align-items:center. Prepend | Input | Append.
- Vertical Alignment: align-items:center statt stretch — Addons und Input sind vertikal zentriert, auch bei unterschiedlicher Hoehe.
- Border-Radius-Logik: erstes Kind linker Radius, letztes Kind rechter Radius, Mitte 0.
- Inner Radius: Verschachtelte Buttons/Selects in Addons bekommen --nc-input-group-inner-radius (0) — nahtloser Uebergang zum Container.
- Negative margin-inline-start auf nicht-erstes Kind vermeidet doppelte Borders.
- Focus: z-index:base auf fokussiertem Element (ueberlappt Nachbarn).
- Addon: statischer Text, Icons oder kleine Buttons. bg-secondary, border-primary.
- Button in Addon: border-radius wird auf inner-radius (0) gesetzt. Button-Groesse passt sich der Input-Group-Size an.
- Input: flex:1, min-width:0 (Overflow-Fix).
- SM/LG: Addon-Padding und Font-Size passen sich an.
- Error: border-error auf allen Teilen (Input + Addons).
- Success: border-success auf allen Teilen (Input + Addons).
- Disabled: Addons ausgegraut (disabled-bg, disabled-color, opacity). Cursor: not-allowed.
- Readonly: Input-Styling readonly (heller Hintergrund, no-cursor). Addons bleiben interaktiv (z.B. Copy-Button).

## Variants
### Size (`size`)
Groesse — sm, md (Standard), lg

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-input-group--sm` |  |
| md | — |  |
| lg | `.nc-input-group--lg` |  |

### Content (`content`)
Addon-Konfiguration — prepend-only, append-only, both (Prepend + Append)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| prepend-only | — |  |
| append-only | — |  |
| both | — |  |

### Validation (`validation`)
Validierungs-State — none, error, success

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| error | `.nc-input-group--error` |  |
| success | `.nc-input-group--success` |  |

## States
Supported: `default`, `hover`, `focus`, `disabled`, `readonly`

- **focus**: 
- **disabled**: 
- **readonly**: 

## CSS Token API
Base classes: `nc-input-group`

### Mirror (from Input)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-input-group-height-sm` | — | — |
| `nc-input-group-height-md` | — | — |
| `nc-input-group-height-lg` | — | — |
| `nc-input-group-radius` | — | — |
| `nc-input-group-border-width` | — | — |

### Addon Base
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-input-group-addon-bg` | — | — |
| `nc-input-group-addon-color` | — | — |
| `nc-input-group-addon-border` | — | — |
| `nc-input-group-addon-padding-x` | — | — |
| `nc-input-group-addon-font-size` | — | — |

### Addon Interaction
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-input-group-addon-hover-bg` | — | — |
| `nc-input-group-addon-active-bg` | — | — |
| `nc-input-group-inner-radius` | — | — |

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-input-group-inner-radius` | — | — |
| `nc-input-group-height-sm` | — | — |
| `nc-input-group-height-md` | — | — |
| `nc-input-group-height-lg` | — | — |

### Validation Error
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-input-group-addon-border-error` | — | — |

### Validation Success
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-input-group-addon-border-success` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Dependencies
`input`

## Web Components Mapping
Derived from anatomy for potential `<nc-input-group>` custom element:

```js
class NcInputGroup extends HTMLElement {
  static observedAttributes = ['size', 'content', 'validation'];
  // Slots: <slot name="input">
}
```

---

*Generated from `data/input-group-recipe.json` by `scripts/generate-component-specs.js`*
