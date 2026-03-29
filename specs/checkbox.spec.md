# checkbox Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

Tags: `interactive`, `form`, `selection`

## Anatomy
Root element: `.nc-checkbox`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| input | `.nc-checkbox__input` | Yes | — |
| control | `.nc-checkbox__control` | Yes | — |
| label | `.nc-checkbox__label` | No | — |

### DOM Notes
- Wrapper ist ein <label class='nc-checkbox'> — Klick auf Label aktiviert Input.
- Native <input type='checkbox'> wird via sr-only versteckt, bleibt aber im DOM fuer Accessibility.
- __control ist ein <span> — zeigt visuellen Zustand (Border, BG, Checkmark/Minus).
- :checked → Checkmark SVG via background-image. :indeterminate → Minus-Zeichen.
- :focus-visible auf dem Native Input delegiert den Focus-Ring auf __control.
- Error kann per .nc-checkbox--error ODER [aria-invalid='true'] auf dem Input gesetzt werden.
- Card-Variante (--card): Wrapper bekommt Padding, Border, Radius. Checked-State zeigt aktiven BG + Border.

## Variants
### Size (`size`)
3 Groessenabstufungen — sm (16px) / md (20px, Standard) / lg (24px)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-checkbox--sm` |  |
| md | — |  |
| lg | `.nc-checkbox--lg` |  |

### Variant (`variant`)
Visuelle Variante — default (Standard-Checkbox), card (umgebender Rahmen mit Checked-Hintergrund)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| card | `.nc-checkbox--card` |  |

### Validation (`validation`)
Validierungszustand — none (Standard), error (roter Rand)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| error | `.nc-checkbox--error` |  |

## States
Supported: `default`, `hover`, `checked`, `indeterminate`, `disabled`, `focus`

- **hover**: 
- **focus**: 
- **indeterminate**: 

## CSS Token API
Base classes: `nc-checkbox`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-checkbox-size-sm` | — | — |
| `nc-checkbox-size-md` | — | — |
| `nc-checkbox-size-lg` | — | — |
| `nc-checkbox-radius` | — | — |
| `nc-checkbox-border-width` | — | — |

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-checkbox-bg` | — | — |
| `nc-checkbox-border` | — | — |
| `nc-checkbox-border-hover` | — | — |

### Checked
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-checkbox-bg-checked` | — | — |
| `nc-checkbox-border-checked` | — | — |
| `nc-checkbox-bg-indeterminate` | — | — |

### Disabled
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-checkbox-disabled-bg` | — | — |
| `nc-checkbox-disabled-border` | — | — |
| `nc-checkbox-disabled-opacity` | — | — |

### Error
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-checkbox-border-error` | — | — |

### Label
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-checkbox-label-gap` | — | — |
| `nc-checkbox-label-color` | — | — |

### Interaction
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-checkbox-transition-duration` | — | — |
| `nc-checkbox-focus-ring-offset` | — | — |

### Card Variant
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-checkbox-card-bg` | — | — |
| `nc-checkbox-card-bg-checked` | — | — |
| `nc-checkbox-card-border` | — | — |
| `nc-checkbox-card-border-checked` | — | — |
| `nc-checkbox-card-border-hover` | — | — |
| `nc-checkbox-card-radius` | — | — |
| `nc-checkbox-card-padding` | — | — |

## Accessibility
Contrast Target: WCAG AA non-text (3:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-checkbox>` custom element:

```js
class NcCheckbox extends HTMLElement {
  static observedAttributes = ['size', 'variant', 'validation'];
  // Slots: <slot name="input">, <slot name="control">
}
```

---

*Generated from `data/checkbox-recipe.json` by `scripts/generate-component-specs.js`*
