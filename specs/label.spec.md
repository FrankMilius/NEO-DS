# label Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

Tags: `display`, `tag`, `decorative`, `status`, `metadata`

## Anatomy
Root element: `.nc-label`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| icon | `.nc-label__icon` | Yes | Optionales Status-Icon links vom Text (z.B. Check bei success, Warn-Dreieck bei danger) |
| text | `.nc-label__text` | Yes | Label-Text |
| remove | `.nc-label__remove` | Yes | Dismiss-Button (X) bei interaktiven Filter-Labels |

### DOM Notes
- Inline-flex Element mit static-surface-base Mixin.
- Visuell immer leiser als Buttons — subtile Pastelltoene bevorzugen.
- Emphasis subtle (Standard): Pastellton-BG + dunkler Text gleicher Farbfamilie.
- Emphasis solid: Kraeftiger BG + heller Text — nur fuer hohe Prioritaet.
- Emphasis outline: Nur Rahmen, kein BG — fuer sekundaere Metadaten.
- Shape pill: Vollstaendig abgerundete Seiten — klar abgegrenzt von Buttons.
- Container: .nc-labels-container (flex-wrap, gap) fuer Gruppen-Layout.
- Icons beschleunigen Scanbarkeit: Check-Icon bei success, Warn-Dreieck bei danger.

## Variants
### Variant (`variant`)
Farbvariante — default, accent, success, warning, danger, info

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| accent | `.nc-label--accent` |  |
| success | `.nc-label--success` |  |
| warning | `.nc-label--warning` |  |
| danger | `.nc-label--danger` |  |
| info | `.nc-label--info` |  |

### Emphasis (`emphasis`)
Visuelle Gewichtung — subtle (Pastell, Standard), solid (kraeftig), outline (nur Rahmen)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| subtle | — |  |
| solid | `.nc-label--solid` |  |
| outline | `.nc-label--outline` |  |

### Size (`size`)
Groesse — xs (dichte Listen), sm (Standard), md (Header/Hero)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| xs | `.nc-label--xs` |  |
| sm | — |  |
| md | `.nc-label--md` |  |

### Shape (`shape`)
Form — rounded (System-Radius, Standard), pill (vollstaendig abgerundet)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| rounded | — |  |
| pill | `.nc-label--pill` |  |

### Interactive (`interactive`)
Interaktivitaet — false (Standard, rein dekorativ), true (Hover + Remove-Button)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| false | — |  |
| true | `.nc-label--interactive` |  |

## States
Supported: `default`, `hover`, `focus`, `disabled`

- **hover**: 
- **focus**: 
- **disabled**: 

## CSS Token API
Base classes: `nc-label`

### Geometry (SM Default)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-label-height-sm` | — | — |
| `nc-label-padding-x` | — | — |
| `nc-label-radius` | — | — |
| `nc-label-font-size` | — | — |
| `nc-label-font-weight` | — | — |
| `nc-label-gap` | — | — |
| `nc-label-letter-spacing` | — | — |
| `nc-label-icon-size` | — | — |

### Geometry (XS)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-label-height-xs` | — | — |
| `nc-label-padding-x-xs` | — | — |
| `nc-label-font-size-xs` | — | — |

### Geometry (MD)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-label-height-md` | — | — |
| `nc-label-padding-x-md` | — | — |
| `nc-label-font-size-md` | — | — |

### Shape (Pill)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-label-radius-pill` | — | — |
| `nc-label-radius` | — | — |

### Colors (Default)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-label-default-bg` | — | — |
| `nc-label-default-color` | — | — |
| `nc-label-default-border` | — | — |
| `nc-label-default-bg-hover` | — | — |

### Colors (Accent)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-label-accent-bg` | — | — |
| `nc-label-accent-color` | — | — |
| `nc-label-accent-border` | — | — |
| `nc-label-accent-bg-hover` | — | — |

### Colors (Success)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-label-success-bg` | — | — |
| `nc-label-success-color` | — | — |
| `nc-label-success-border` | — | — |
| `nc-label-success-bg-hover` | — | — |

### Colors (Warning)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-label-warning-bg` | — | — |
| `nc-label-warning-color` | — | — |
| `nc-label-warning-border` | — | — |
| `nc-label-warning-bg-hover` | — | — |

### Colors (Danger)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-label-danger-bg` | — | — |
| `nc-label-danger-color` | — | — |
| `nc-label-danger-border` | — | — |
| `nc-label-danger-bg-hover` | — | — |

### Colors (Info)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-label-info-bg` | — | — |
| `nc-label-info-color` | — | — |
| `nc-label-info-border` | — | — |
| `nc-label-info-bg-hover` | — | — |

### Solid Emphasis
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-label-solid-default-bg` | — | — |
| `nc-label-solid-default-color` | — | — |

### Outline Emphasis
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-label-outline-border-width` | — | — |

### Interactive
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-label-transition-duration` | — | — |
| `nc-label-remove-size` | — | — |
| `nc-label-remove-hover-bg` | — | — |
| `nc-label-disabled-opacity` | — | — |

### Container (Gruppen-Layout)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-label-container-gap` | — | — |
| `nc-label-gap` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Farbe nie alleiniges Signal — Icon oder Text muss Bedeutung vermitteln.
- Interaktive Labels: <button> oder <a> verwenden, nicht <span>.
- Remove-Button: aria-label='Entfernen: {Label-Text}' am X-Button.

## Web Components Mapping
Derived from anatomy for potential `<nc-label>` custom element:

```js
class NcLabel extends HTMLElement {
  static observedAttributes = ['variant', 'emphasis', 'size', 'shape', 'interactive'];
  // Slots: <slot name="icon">, <slot name="text">, <slot name="remove">
}
```

---

*Generated from `data/label-recipe.json` by `scripts/generate-component-specs.js`*
