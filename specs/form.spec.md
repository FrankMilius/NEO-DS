# form Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `form`, `layout`, `interactive`

## Anatomy
Root element: `.nc-form`

### DOM Notes
- Root: <form> mit flex-column Layout. Gap via nc-form-gap (24px).
- Enthaelt .nc-form-field, .nc-fieldset, .nc-form-section, .nc-form-actions.
- Inline: flex-row, flex-wrap. Fields auto-width. Submit am Ende.
- Two-Column: CSS Grid, 1fr mobile → repeat(2,1fr) ab md. Fieldsets/Buttons: grid-column 1/-1.
- Disabled: opacity-disabled, pointer-events:none. Native Controls zusaetzlich deaktivieren.
- novalidate + Custom-Validation empfohlen.

## Variants
### Layout (`layout`)
Layout — vertical (Standard, flex-column), inline (flex-row), two-column (CSS Grid 2-Spalten)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| vertical | — |  |
| inline | `.nc-form--inline` |  |
| two-column | `.nc-form--two-column` |  |

## States
Supported: `default`, `disabled`

- **disabled**: 

## CSS Token API
Base classes: `nc-form`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-form-gap` | — | — |

### Label
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-form-label-font-size` | — | — |
| `nc-form-label-font-weight` | — | — |
| `nc-form-label-color` | — | — |
| `nc-form-label-gap` | — | — |
| `nc-form-label-required-color` | — | — |
| `nc-form-label-optional-color` | — | — |

### Hint
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-form-hint-font-size` | — | — |
| `nc-form-hint-color` | — | — |
| `nc-form-hint-gap` | — | — |

### Error
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-form-error-font-size` | — | — |
| `nc-form-error-font-weight` | — | — |
| `nc-form-error-color` | — | — |
| `nc-form-error-icon-size` | — | — |
| `nc-form-error-gap` | — | — |

### Field
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-form-field-gap` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName

## Dependencies
`fieldset`

## Web Components Mapping
Derived from anatomy for potential `<nc-form>` custom element:

```js
class NcForm extends HTMLElement {
  static observedAttributes = ['layout'];
  // Slots: default
}
```

---

*Generated from `data/form-recipe.json` by `scripts/generate-component-specs.js`*
