# form-error Component Spec
> Version 1.0.0 | Status: stable | Layer: molecule

Tags: `form`, `validation`, `feedback`

## Anatomy
Root element: `.nc-form-error`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| icon | `.nc-form-error__icon` | No | — |
| text | `.nc-form-error__text` | Yes | — |

### DOM Notes
- Flexbox-Layout: Icon + Text nebeneinander, align-items: flex-start.
- Icon ist ein SVG (stroke-basiert, 16px), optisch via margin-top: 0.1em an Text ausgerichtet.
- Text erbt Styles vom Block (font-size, color, font-weight).
- Wird via aria-describedby am zugehoerigen Input verknuepft (id='error-{name}').
- role='alert' fuer sofortige Screenreader-Ansage, aria-live='polite' fuer sanfte Updates.

## Variants
### Content (`content`)
Inhaltsvarianten — text-only (nur Text), with-icon (Icon + Text)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| text-only | — |  |
| with-icon | — |  |

### Severity (`severity`)
Schweregrad der Meldung — error (Fehler, Standard), warning (Warnung), success (Erfolg/Bestaetigung)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| error | — |  |
| warning | `.nc-form-error--warning` |  |
| success | `.nc-form-error--success` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-form-error`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-error-font-size` | — | `--mod-form-error-font-size` |
| `--nc-form-error-font-weight` | — | `--mod-form-error-font-weight` |
| `--nc-form-error-icon-size` | — | `--mod-form-error-icon-size` |
| `--nc-form-error-gap` | — | `--mod-form-error-gap` |

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-error-color` | — | `--mod-form-error-color` |

### Severity Warning
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-error-warning-color` | — | `--mod-form-error-warning-color` |

### Severity Success
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-error-success-color` | — | `--mod-form-error-success-color` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName

## Dependencies
`form`

## Web Components Mapping
Derived from anatomy for potential `<nc-form-error>` custom element:

```js
class NcFormError extends HTMLElement {
  static observedAttributes = ['content', 'severity'];
  // Slots: <slot name="text">
}
```

---

*Generated from `data/form-error-recipe.json` by `scripts/generate-component-specs.js`*
