# stepper Component Spec
> Version 1.0.0 | Status: stable | Layer: molecule

Tags: `interactive`, `form`, `numeric`

## Anatomy
Root element: `.nc-stepper`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| decrement | `.nc-stepper__decrement` | Yes | — |
| input | `.nc-stepper__input` | Yes | — |
| increment | `.nc-stepper__increment` | Yes | — |

### DOM Notes
- Inline-Flex Container: Decrement-Button | Input | Increment-Button.
- Nahtlose Borders: Input hat margin-inline: -1px, decrement hat rechte Ecken 0, increment hat linke Ecken 0.
- Buttons: quadratisch (32px default), SVG-Icons (50% der Button-Groesse).
- Input: zentrierter Text, Spinner-Arrows entfernt, readonly optional.
- Border kommt von shared --nc-input-* Tokens (border-width, border-color).
- Hover: bg-hover + border-hover auf den Buttons.
- Focus: focus-ring + border-focus. Input bekommt z-index: base bei Focus (ueberlappt Buttons).
- Error: Alle drei Teile erhalten border-error Farbe.
- Disabled: Alle Teile ausgegraut — opacity, disabled-bg, disabled-border.
- SM/LG: Nutzen Input-Height-Tokens fuer konsistente Hoehe mit anderen Form-Controls.

## Variants
### Size (`size`)
Groesse — sm (Input-Height-SM), md (32px, Standard), lg (Input-Height-LG)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-stepper--sm` |  |
| md | — |  |
| lg | `.nc-stepper--lg` |  |

### Validation (`validation`)
Validierungs-State — none (Standard), error (roter Rand auf allen Teilen)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| error | `.nc-stepper--error` |  |

## States
Supported: `default`, `hover`, `focus`, `disabled`

- **hover**: 
- **focus**: 
- **disabled**: 

## CSS Token API
Base classes: `nc-stepper`

### Button
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-stepper-button-size` | — | `--mod-stepper-button-size` |
| `--nc-stepper-button-radius` | — | `--mod-stepper-button-radius` |
| `--nc-stepper-button-bg` | — | `--mod-stepper-button-bg` |
| `--nc-stepper-button-bg-hover` | — | `--mod-stepper-button-bg-hover` |
| `--nc-stepper-button-color` | — | `--mod-stepper-button-color` |

### Input
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-stepper-input-width` | — | `--mod-stepper-input-width` |

## Accessibility
Contrast Target: WCAG AA non-text (3:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-stepper>` custom element:

```js
class NcStepper extends HTMLElement {
  static observedAttributes = ['size', 'validation'];
  // Slots: <slot name="decrement">, <slot name="input">, <slot name="increment">
}
```

---

*Generated from `data/stepper-recipe.json` by `scripts/generate-component-specs.js`*
