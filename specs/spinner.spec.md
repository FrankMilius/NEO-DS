# spinner Component Spec
> Version 1.0.0 | Status: stable | Layer: atom

Tags: `static`, `loading`, `indicator`

## Anatomy
Root element: `.nc-spinner`

### DOM Notes
- Spinner ist ein <div class='nc-spinner' role='status'> mit ::after Pseudo-Element fuer den rotierenden Ring.
- Braucht ein .u-sr-only Kind-Element mit 'Wird geladen...' oder aria-label auf dem Container.
- Ring: border-color = Track, border-top-color = Active. Animation: fnd-spin (360° Rotation).
- prefers-reduced-motion verlangsamt die Rotation (2s statt 700ms).
- Overlay (.nc-spinner-overlay): position:absolute, inset:0, semi-transparenter BG.

## Variants
### Size (`size`)
5 Groessenabstufungen — xs (16px), sm (20px), md (24px, Standard), lg (40px), xl (56px)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| xs | `.nc-spinner--xs` |  |
| sm | `.nc-spinner--sm` |  |
| md | — |  |
| lg | `.nc-spinner--lg` |  |
| xl | `.nc-spinner--xl` |  |

### Color (`color`)
Farb-Variante — default (interactive), inverse (weiss), success (gruen), danger (rot)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| inverse | `.nc-spinner--inverse` |  |
| success | `.nc-spinner--success` |  |
| danger | `.nc-spinner--danger` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-spinner`

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-spinner-color` | — | — |
| `nc-spinner-track-color` | — | — |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-spinner-duration` | — | — |
| `nc-spinner-ease` | — | — |

### Sizing
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-spinner-size-xs` | — | — |
| `nc-spinner-size-sm` | — | — |
| `nc-spinner-size-md` | — | — |
| `nc-spinner-size-lg` | — | — |
| `nc-spinner-size-xl` | — | — |

### Border Width
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-spinner-border-width-xs` | — | — |
| `nc-spinner-border-width-sm` | — | — |
| `nc-spinner-border-width-md` | — | — |
| `nc-spinner-border-width-lg` | — | — |
| `nc-spinner-border-width-xl` | — | — |

## Accessibility
Contrast Target: WCAG AA non-text (3:1)

- hasAccessibleName

## Web Components Mapping
Derived from anatomy for potential `<nc-spinner>` custom element:

```js
class NcSpinner extends HTMLElement {
  static observedAttributes = ['size', 'color'];
  // Slots: default
}
```

---

*Generated from `data/spinner-recipe.json` by `scripts/generate-component-specs.js`*
