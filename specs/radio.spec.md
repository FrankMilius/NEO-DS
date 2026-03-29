# radio Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

Tags: `interactive`, `form`, `selection`

## Anatomy
Root element: `.nc-radio`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| input | `.nc-radio__input` | Yes | — |
| control | `.nc-radio__control` | Yes | — |
| label | `.nc-radio__label` | No | — |

### DOM Notes
- Wrapper ist ein <label class='nc-radio'> — Klick auf Label aktiviert Input.
- Native <input type='radio'> wird via sr-only versteckt, bleibt im DOM fuer Accessibility.
- __control ist ein <span> mit border-radius: 50% (Kreis).
- :checked → Dot via ::after pseudo-element, skaliert mit transform: scale(dot-scale).
- :focus-visible auf dem Native Input delegiert den Focus-Ring auf __control.
- Radio-Buttons in einer Gruppe teilen sich den gleichen name-Attribut. Nur einer kann gleichzeitig checked sein.
- Error kann per .nc-radio--error gesetzt werden.
- Alignment --top: Control obenbuendig bei mehrzeiligen Labels (margin-top: 0.15em).
- Card-Variante (--card): Wrapper bekommt Padding, Border, Radius. Checked-State zeigt aktiven BG + Border.

## Variants
### Size (`size`)
3 Groessenabstufungen — sm (16px) / md (20px, Standard) / lg (24px)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-radio--sm` |  |
| md | — |  |
| lg | `.nc-radio--lg` |  |

### Alignment (`alignment`)
Vertikale Ausrichtung des Controls zum Label — center (Standard, zentriert), top (obenbuendig, fuer mehrzeilige Labels)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| center | — |  |
| top | `.nc-radio--top` |  |

### Variant (`variant`)
Visuelle Variante — default (Standard-Radio), card (umgebender Rahmen mit Checked-Hintergrund)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| card | `.nc-radio--card` |  |

### Validation (`validation`)
Validierungszustand — none (Standard), error (roter Rand)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| error | `.nc-radio--error` |  |

## States
Supported: `default`, `hover`, `checked`, `disabled`, `focus`

- **hover**: 
- **focus**: 

## CSS Token API
Base classes: `nc-radio`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-radio-size-sm` | — | — |
| `nc-radio-size-md` | — | — |
| `nc-radio-size-lg` | — | — |
| `nc-radio-border-width` | — | — |

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-radio-bg` | — | — |
| `nc-radio-border` | — | — |
| `nc-radio-border-hover` | — | — |

### Checked
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-radio-bg-checked` | — | — |
| `nc-radio-border-checked` | — | — |
| `nc-radio-dot-color` | — | — |
| `nc-radio-dot-scale` | — | — |

### Disabled
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-radio-disabled-bg` | — | — |
| `nc-radio-disabled-border` | — | — |
| `nc-radio-disabled-opacity` | — | — |

### Error
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-radio-border-error` | — | — |

### Label
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-radio-label-gap` | — | — |
| `nc-radio-label-color` | — | — |

### Interaction
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-radio-transition-duration` | — | — |

### Card Variant
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-radio-card-bg` | — | — |
| `nc-radio-card-bg-checked` | — | — |
| `nc-radio-card-border` | — | — |
| `nc-radio-card-border-checked` | — | — |
| `nc-radio-card-border-hover` | — | — |
| `nc-radio-card-radius` | — | — |
| `nc-radio-card-padding` | — | — |

## Accessibility
Contrast Target: WCAG AA non-text (3:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-radio>` custom element:

```js
class NcRadio extends HTMLElement {
  static observedAttributes = ['size', 'alignment', 'variant', 'validation'];
  // Slots: <slot name="input">, <slot name="control">
}
```

---

*Generated from `data/radio-recipe.json` by `scripts/generate-component-specs.js`*
