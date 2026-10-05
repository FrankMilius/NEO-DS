# input Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

Tags: `interactive`, `form`, `text-input`

## Anatomy
Root element: `.nc-input`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| label | `.nc-input__label` | Yes | Floating Label — bewegt sich beim Focus/Not-Empty nach oben. Pflicht fuer Accessibility. |
| icon | `.nc-input__icon` | No | — |
| icon-end | `.nc-input__icon--end` | No | — |
| prefix-text | `.nc-input__prefix` | No | Text-Praefix (z.B. 'https://', 'EUR'). Nicht klickbar, rein dekorativ. |
| suffix-text | `.nc-input__suffix` | No | Text-Suffix (z.B. '€', 'kg', '.com'). Nicht klickbar, rein dekorativ. |
| clear | `.nc-input__clear` | No | Clear-Button (×). Sichtbar nur wenn Input nicht leer (:not(:placeholder-shown)). |

### DOM Notes
- Input ist immer ein <input> Element mit type='text|email|url|tel|password|search|number|color'.
- Icon-Prefix/Suffix, Label und Text-Affixe erfordern .nc-input-wrapper als Container.
- Search-Typ: padding-left fuer Lupe. Password-Typ: padding-right fuer Reveal-Toggle.
- :focus-visible triggert Focus-Ring. :disabled und [aria-disabled] haben eigenes Styling.
- [readonly] hat eigene BG/Border-Tokens — kein disabled-Opacity.
- Error kann per .nc-input--error ODER [aria-invalid='true'] gesetzt werden.
- Floating Label: Label steht initial ueber dem Placeholder. Bei :focus oder :not(:placeholder-shown) schwebt es nach oben (transform + font-size).
- Text-Affixe (.nc-input__prefix / .nc-input__suffix) sind inline-flex Elemente mit eigener Geometrie. Input-Padding wird automatisch angepasst.
- Clear-Button ist per CSS unsichtbar wenn :placeholder-shown aktiv ist. Sichtbar sobald Inhalt vorhanden.
- Touch-Target: Ein ::after Pseudo-Element auf .nc-input sichert min 44x44px Klickflaeche, auch bei sm-Groesse.

## Variants
### Variant (`variant`)
Visuelle Variante — outlined (Standard, Rahmen), filled (Flaeche mit Unterstreichung), borderless (minimalistisch, In-Line Editing)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| outlined | — |  |
| filled | `.nc-input--filled` |  |
| borderless | `.nc-input--borderless` |  |

### Size (`size`)
3 Groessenabstufungen — sm (32px) / md (40px, Standard) / lg (48px)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-input--sm` |  |
| md | — |  |
| lg | `.nc-input--lg` |  |

### Type (`type`)
Input-Typ — text (Standard), search (Lupe links), password (Reveal rechts)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| text | — |  |
| search | `.nc-input--search` |  |
| password | `.nc-input--password` |  |

### Validation (`validation`)
Validierungszustand — none (Standard), error (roter Rand), success (gruener Rand)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| error | `.nc-input--error` |  |
| success | `.nc-input--success` |  |

## States
Supported: `default`, `hover`, `focus`, `disabled`, `readonly`, `not-empty`

- **hover**: 
- **focus**: 
- **readonly**: 
- **not-empty**: 

## CSS Token API
Base classes: `nc-input`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-input-height-sm` | — | `--mod-input-height-sm` |
| `--nc-input-height-md` | — | `--mod-input-height-md` |
| `--nc-input-height-lg` | — | `--mod-input-height-lg` |
| `--nc-input-padding-x-sm` | — | `--mod-input-padding-x-sm` |
| `--nc-input-padding-x-md` | — | `--mod-input-padding-x-md` |
| `--nc-input-padding-x-lg` | — | `--mod-input-padding-x-lg` |
| `--nc-input-padding-y-sm` | — | `--mod-input-padding-y-sm` |
| `--nc-input-padding-y-md` | — | `--mod-input-padding-y-md` |
| `--nc-input-padding-y-lg` | — | `--mod-input-padding-y-lg` |
| `--nc-input-font-size-sm` | — | `--mod-input-font-size-sm` |
| `--nc-input-font-size-md` | — | `--mod-input-font-size-md` |
| `--nc-input-font-size-lg` | — | `--mod-input-font-size-lg` |
| `--nc-input-radius` | — | `--mod-input-radius` |
| `--nc-input-border-width` | — | `--mod-input-border-width` |

### Colors (Outlined)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-control-bg` | — | `--mod-form-control-bg` |
| `--nc-form-control-border-color` | — | `--mod-form-control-border-color` |
| `--nc-form-control-color` | — | `--mod-form-control-color` |

### Colors (Filled)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-control-filled-bg` | — | `--mod-form-control-filled-bg` |
| `--nc-form-control-filled-border-bottom` | — | `--mod-form-control-filled-border-bottom` |
| `--nc-form-control-filled-color` | — | `--mod-form-control-filled-color` |

### Colors (Borderless)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-control-minimal-bg-hover` | — | `--mod-form-control-minimal-bg-hover` |
| `--nc-form-control-minimal-border-focus` | — | `--mod-form-control-minimal-border-focus` |

### Floating Label
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-input-label-color` | — | `--mod-input-label-color` |
| `--nc-input-label-color-focus` | — | `--mod-input-label-color-focus` |
| `--nc-input-label-font-size` | — | `--mod-input-label-font-size` |
| `--nc-input-label-font-size-float` | — | `--mod-input-label-font-size-float` |
| `--nc-input-label-offset-y` | — | `--mod-input-label-offset-y` |
| `--nc-input-label-scale` | — | `--mod-input-label-scale` |
| `--nc-input-label-padding-top` | — | `--mod-input-label-padding-top` |

### Affix (Prefix/Suffix Text)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-input-affix-color` | — | `--mod-input-affix-color` |
| `--nc-input-affix-font-size` | — | `--mod-input-affix-font-size` |
| `--nc-input-affix-padding-x` | — | `--mod-input-affix-padding-x` |
| `--nc-input-affix-bg` | — | `--mod-input-affix-bg` |
| `--nc-input-affix-border` | — | `--mod-input-affix-border` |

### Touch Target
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-input-touch-area-min` | — | `--mod-input-touch-area-min` |

### Error
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-input-border-error` | — | `--mod-input-border-error` |

### Success
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-input-border-success` | — | `--mod-input-border-success` |

### Disabled
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-input-disabled-bg` | — | `--mod-input-disabled-bg` |
| `--nc-input-disabled-color` | — | `--mod-input-disabled-color` |
| `--nc-input-disabled-border` | — | `--mod-input-disabled-border` |
| `--nc-input-disabled-opacity` | — | `--mod-input-disabled-opacity` |

### Readonly
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-input-bg-readonly` | — | `--mod-input-bg-readonly` |
| `--nc-input-border-readonly` | — | `--mod-input-border-readonly` |

### Icon
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-input-icon-size` | — | `--mod-input-icon-size` |
| `--nc-input-icon-color` | — | `--mod-input-icon-color` |

### Content State
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-input-clear-size` | — | `--mod-input-clear-size` |
| `--nc-input-clear-color` | — | `--mod-input-clear-color` |
| `--nc-input-clear-color-hover` | — | `--mod-input-clear-color-hover` |

### Interaction
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-input-transition-duration` | — | `--mod-input-transition-duration` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | clear-input | Auf dem Loeschknopf (.nc-input__clear): leert das Feld, Fokus zurueck ins Feld. Nativer Klick des <button>. |
| `Space` | clear-input | Wie Enter. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `input-clear` | Yes | `{"previousValue":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-input>` custom element:

```js
class NcInput extends HTMLElement {
  static observedAttributes = ['variant', 'size', 'type', 'validation'];
  // Slots: <slot name="label">
}
```

---

*Generated from `data/input-recipe.json` by `scripts/generate-component-specs.js`*
