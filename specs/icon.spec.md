# icon Component Spec
> Version 1.0.0 | Status: stable | Layer: atom

Tags: `static`, `visual`, `icon`

## Anatomy
Root element: `.icon`

### DOM Notes
- Icon ist ein <span class='icon'> mit inline SVG als Kind-Element.
- Default-Groesse: sm (20px). Kein md-Default — sm ist der Standard.
- SVG nutzt fill: currentColor — Farbe wird via CSS color gesteuert.
- Nicht-BEM Konvention: .icon statt .nc-icon (historisch gewachsen).
- Deprecated: .icon--2xs (12px, altes xs), .icon--high/--mid/--low (alte Farbnamen).
- Interactive-Modifier (.icon--interactive): min 44x44px Touch-Target via Padding, hover + focus-ring.
- Interactive Icons brauchen ein umschliessendes <button> oder role='button' + tabindex.
- Icon-Logo (.icon-logo): Spezialfall mit fester Groesse 88x22px.

## Variants
### Size (`size`)
7 Groessenabstufungen — 2xs (12px, deprecated) / xs (16px) / sm (20px, Standard) / md (24px) / lg (28px) / xl (32px) / 2xl (36px)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| xs | `.icon--xs` |  |
| sm | `.icon--sm` |  |
| md | `.icon--md` |  |
| lg | `.icon--lg` |  |
| xl | `.icon--xl` |  |
| 2xl | `.icon--2xl` |  |

### Color (`color`)
Semantische Farb-Variante — primary (Standard), secondary, tertiary, inverse, disabled

| Value | CSS Modifier | Default |
| --- | --- | --- |
| primary | `.icon--primary` |  |
| secondary | `.icon--secondary` |  |
| tertiary | `.icon--tertiary` |  |
| inverse | `.icon--inverse` |  |
| disabled | `.icon--disabled` |  |

### Interactive (`interactive`)
Interaktivitaet — none (Standard, rein dekorativ), interactive (Touch-Target 44px, hover, focus-ring)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| interactive | `.icon--interactive` |  |

## States
Supported: `default`, `hover`, `focus`

- **hover**: 
- **focus**: 

## CSS Token API
Base classes: `icon`

### Sizing
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-icon-size-xs` | — | — |
| `nc-icon-size-sm` | — | — |
| `nc-icon-size-md` | — | — |
| `nc-icon-size-lg` | — | — |
| `nc-icon-size-xl` | — | — |
| `nc-icon-size-2xl` | — | — |

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-icon-color-default` | — | — |
| `nc-icon-color-secondary` | — | — |
| `nc-icon-color-tertiary` | — | — |
| `nc-icon-color-inverse` | — | — |
| `nc-icon-color-disabled` | — | — |

### Touch Target
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-icon-touch-target` | — | — |

## Accessibility
Contrast Target: WCAG AA non-text (3:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-icon>` custom element:

```js
class NcIcon extends HTMLElement {
  static observedAttributes = ['size', 'color', 'interactive'];
  // Slots: default
}
```

---

*Generated from `data/icon-recipe.json` by `scripts/generate-component-specs.js`*
