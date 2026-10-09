# tag Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

Tags: `interactive`, `label`, `feedback`

## Anatomy
Root element: `.nc-tag`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| icon | `.nc-tag__icon` | No | — |
| label | `.nc-tag__label` | No | — |
| remove | `.nc-tag__remove` | No | — |

### DOM Notes
- Statischer Tag: <span class='nc-tag'>. Nicht fokussierbar, kein interaktives Element.
- Navigations-Tag: <a href='...' class='nc-tag nc-tag--interactive'>. Immer mit --interactive Modifier.
- Entfernbarer Tag: <span class='nc-tag nc-tag--removable'> mit <button class='nc-tag__remove'> als Kind.
- Remove-Button ist ein eigenstaendiger <button> mit aria-label (z.B. 'Tag entfernen').
- 7 Farbvarianten: default, outline, primary, success, warning, error, info.
- Pill-Shape via --fnd-radius-full (border-radius: 9999px).
- Deprecated: --destructive und --danger sind Aliase fuer --error.
- Interactive: Hover-BG, Active-Scale(0.98), focus-ring. Disabled: opacity + cursor:not-allowed.

## Variants
### Size (`size`)
3 Groessenabstufungen — sm (24px) / md (32px, Standard) / lg (40px). Versetzt zum Button-Scale.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-tag--sm` |  |
| md | — |  |
| lg | `.nc-tag--lg` |  |

### Variant (`variant`)
Farbvariante — default (filled neutral), outline (transparent + Border), primary (interactive-BG), success, warning, error, info

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| outline | `.nc-tag--outline` |  |
| primary | `.nc-tag--primary` |  |
| success | `.nc-tag--success` |  |
| warning | `.nc-tag--warning` |  |
| error | `.nc-tag--error` |  |
| info | `.nc-tag--info` |  |

### Content (`content`)
Inhalt — text (nur Label), icon-text (Icon + Label), removable (Label + Dismiss-Button)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| text | — |  |
| icon-text | — |  |
| removable | `.nc-tag--removable` |  |

### Interactive (`interactive`)
Interaktivitaet — static (Standard, nicht klickbar), interactive (Hover/Active/Focus mit Shadow fuer Links/Buttons)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| static | — |  |
| interactive | `.nc-tag--interactive` |  |

### Selected (`selected`)
Toggle-State fuer Filter-Chips — false (Standard), true (aktiv, aria-pressed)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| false | — |  |
| true | `.nc-tag--selected` |  |

## States
Supported: `default`, `hover`, `active`, `disabled`, `focus`

- **hover**: 
- **active**: 
- **focus**: 
- **disabled**: 

## CSS Token API
Base classes: `nc-tag`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tag-height-sm` | — | `--mod-tag-height-sm` |
| `--nc-tag-height-md` | — | `--mod-tag-height-md` |
| `--nc-tag-height-lg` | — | `--mod-tag-height-lg` |
| `--nc-tag-padding-x` | — | `--mod-tag-padding-x` |
| `--nc-tag-padding-y` | — | `--mod-tag-padding-y` |
| `--nc-tag-radius` | — | `--mod-tag-radius` |
| `--nc-tag-gap` | — | `--mod-tag-gap` |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tag-font-size` | — | `--mod-tag-font-size` |
| `--nc-tag-font-size-sm` | — | `--mod-tag-font-size-sm` |
| `--nc-tag-font-size-lg` | — | `--mod-tag-font-size-lg` |
| `--nc-tag-font-weight` | — | `--mod-tag-font-weight` |

### Default Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tag-default-bg` | — | `--mod-tag-default-bg` |
| `--nc-tag-default-color` | — | `--mod-tag-default-color` |
| `--nc-tag-default-border` | — | `--mod-tag-default-border` |
| `--nc-tag-default-bg-hover` | — | `--mod-tag-default-bg-hover` |

### Outline Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tag-outline-bg` | — | `--mod-tag-outline-bg` |
| `--nc-tag-outline-color` | — | `--mod-tag-outline-color` |
| `--nc-tag-outline-border` | — | `--mod-tag-outline-border` |
| `--nc-tag-outline-bg-hover` | — | `--mod-tag-outline-bg-hover` |

### Primary Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tag-primary-bg` | — | `--mod-tag-primary-bg` |
| `--nc-tag-primary-color` | — | `--mod-tag-primary-color` |
| `--nc-tag-primary-border` | — | `--mod-tag-primary-border` |
| `--nc-tag-primary-bg-hover` | — | `--mod-tag-primary-bg-hover` |

### Success Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tag-success-bg` | — | `--mod-tag-success-bg` |
| `--nc-tag-success-color` | — | `--mod-tag-success-color` |
| `--nc-tag-success-border` | — | `--mod-tag-success-border` |
| `--nc-tag-success-bg-hover` | — | `--mod-tag-success-bg-hover` |

### Warning Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tag-warning-bg` | — | `--mod-tag-warning-bg` |
| `--nc-tag-warning-color` | — | `--mod-tag-warning-color` |
| `--nc-tag-warning-border` | — | `--mod-tag-warning-border` |
| `--nc-tag-warning-bg-hover` | — | `--mod-tag-warning-bg-hover` |

### Error Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tag-error-bg` | — | `--mod-tag-error-bg` |
| `--nc-tag-error-color` | — | `--mod-tag-error-color` |
| `--nc-tag-error-border` | — | `--mod-tag-error-border` |
| `--nc-tag-error-bg-hover` | — | `--mod-tag-error-bg-hover` |

### Info Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tag-info-bg` | — | `--mod-tag-info-bg` |
| `--nc-tag-info-color` | — | `--mod-tag-info-color` |
| `--nc-tag-info-border` | — | `--mod-tag-info-border` |
| `--nc-tag-info-bg-hover` | — | `--mod-tag-info-bg-hover` |

### Elements
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tag-remove-size` | — | `--mod-tag-remove-size` |
| `--nc-tag-remove-hover-bg` | — | — |
| `--nc-tag-icon-size` | — | `--mod-tag-icon-size` |

### Disabled
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tag-disabled-bg` | — | `--mod-tag-disabled-bg` |
| `--nc-tag-disabled-color` | — | `--mod-tag-disabled-color` |
| `--nc-tag-disabled-border` | — | `--mod-tag-disabled-border` |
| `--nc-tag-opacity-disabled` | — | `--mod-tag-opacity-disabled` |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tag-transition-duration` | — | — |

### Interactive Shadow
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tag-interactive-shadow-hover` | — | `--mod-tag-interactive-shadow-hover` |

### Selected State
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tag-selected-bg` | — | `--mod-tag-selected-bg` |
| `--nc-tag-selected-color` | — | `--mod-tag-selected-color` |
| `--nc-tag-selected-border` | — | `--mod-tag-selected-border` |
| `--nc-tag-selected-bg-hover` | — | `--mod-tag-selected-bg-hover` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-tag>` custom element:

```js
class NcTag extends HTMLElement {
  static observedAttributes = ['size', 'variant', 'content', 'interactive', 'selected'];
  // Slots: default
}
```

---

*Generated from `data/tag-recipe.json` by `scripts/generate-component-specs.js`*
