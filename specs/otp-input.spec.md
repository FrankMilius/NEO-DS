# otp-input Component Spec
> Version 1.0.0 | Status: stable | Layer: molecule

Tags: `interactive`, `form`, `verification`

## Anatomy
Root element: `.nc-otp-input`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| cell | `.nc-otp-input__cell` | Yes | — |
| separator | `.nc-otp-input__separator` | No | — |

### DOM Notes
- Inline-Flex Container mit einzelnen Input-Zellen (maxlength=1).
- Jede Zelle: quadratisch (48px default), zentrierter Text, Monospace-Charakter.
- Border via --nc-input-border-width (shared Input-Token).
- Placeholder, Selection, Hover, Focus, Disabled erben Input-Token-Werte.
- Spinner entfernt via ::-webkit-inner-spin-button + -moz-appearance: textfield.
- Separator: optionaler Bindestrich zwischen Zellen-Gruppen (z.B. 3+3 Format).
- Filled-State: __cell--filled Modifier via JS — border-color wechselt zu focus-Farbe.
- Auto-Focus auf naechste Zelle bei Eingabe (JS-gesteuert).
- Forced-Colors: 1px solid ButtonText, Focus: Highlight.
- prefers-reduced-motion: Transitions deaktiviert.

## Variants
### Size (`size`)
Groesse der Zellen — sm (Input-Height-MD), md (48px, Standard), lg (60px)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-otp-input--sm` |  |
| md | — |  |
| lg | `.nc-otp-input--lg` |  |

### Validation (`validation`)
Validierungs-State — none (Standard), error (roter Rand), success (gruener Rand)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| error | `.nc-otp-input--error` |  |
| success | `.nc-otp-input--success` |  |

### Content (`content`)
Inhaltsvariante — plain (nur Zellen), with-separator (Zellen mit Trennzeichen)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| plain | — |  |
| with-separator | — |  |

## States
Supported: `default`, `hover`, `focus`, `filled`, `disabled`

- **hover**: 
- **focus**: 
- **filled**: 
- **disabled**: 

## CSS Token API
Base classes: `nc-otp-input`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-otp-cell-size` | — | — |
| `nc-otp-cell-gap` | — | — |
| `nc-otp-cell-radius` | — | — |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-otp-cell-font-size` | — | — |
| `nc-otp-cell-font-weight` | — | — |

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-otp-cell-border` | — | — |
| `nc-otp-cell-border-focus` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-otp-input>` custom element:

```js
class NcOtpInput extends HTMLElement {
  static observedAttributes = ['size', 'validation', 'content'];
  // Slots: <slot name="cell">
}
```

---

*Generated from `data/otp-input-recipe.json` by `scripts/generate-component-specs.js`*
