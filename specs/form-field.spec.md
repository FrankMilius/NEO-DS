# form-field Component Spec
> Version 2.0.0 | Status: stable | Layer: molecule

Tags: `form`, `layout`, `wrapper`

## Anatomy
Root element: `.nc-form-field`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| label | `.nc-form-label` | No | — |
| hint-above | `.nc-form-hint` | No | — |
| control | `.nc-input | .nc-textarea | .nc-select | .nc-checkbox` | Yes | — |
| error | `.nc-form-error` | No | — |
| hint-below | `.nc-form-hint` | No | — |

### DOM Notes
- Flex-Column-Container der Label, Input, Hint und Error zusammenfasst.
- gap via --nc-form-field-gap (4px) — Label margin-bottom wird auf 0 gesetzt.
- Error-Modifier propagiert border-color auf Kind-Inputs (nc-input, nc-textarea, nc-select).
- Success-Modifier propagiert success-border-color auf Kind-Inputs.
- Disabled-Modifier graut Label und Hint aus (text-disabled, cursor: not-allowed).
- Horizontal-Modifier: flex-direction: row ab Tablet, Label 200px breit, Input flex: 1.
- Hint kann vor oder nach dem Input platziert werden.
- Input hat aria-describedby mit IDs von Hint und/oder Error (Leerzeichen-getrennt).
- Required: .nc-form-label__required zeigt '*' (aria-hidden='true'). Der Input bekommt required oder aria-required='true'.
- Optional: .nc-form-label__optional zeigt '(Optional)' — optionaler visueller Hinweis.
- Fieldset-Gruppierung: Wenn mehrere Form-Fields zusammengehoeren (z.B. Adresse), wird ein <fieldset> mit <legend> statt <div> verwendet. Siehe fieldset-recipe fuer Details.

## Variants
### Layout (`layout`)
Anordnung — vertical (Standard, Label oben), horizontal (Label links, Input rechts, ab Tablet)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| vertical | — |  |
| horizontal | `.nc-form-field--horizontal` |  |

### Requirement (`requirement`)
Pflichtfeld-Markierung — none (kein Indikator), required (Sternchen '*' am Label), optional ('(Optional)' am Label)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| required | `.nc-form-field--required` |  |
| optional | `.nc-form-field--optional` |  |

### Validation (`validation`)
Validierungs-State — none (Standard), error (Fehler), success (Erfolg)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| error | `.nc-form-field--error` |  |
| success | `.nc-form-field--success` |  |

### Content (`content`)
Inhaltskombination — minimal (Label + Input), with-hint (+ Hint), full (Label + Hint + Input + Error)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| minimal | — |  |
| with-hint | — |  |
| full | — |  |

### Grouping (`grouping`)
Element-Typ — div (Standard-Wrapper), fieldset (semantische Gruppierung mit <legend>)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| div | — |  |
| fieldset | — |  |

## States
Supported: `default`, `disabled`

- **disabled**: 

## CSS Token API
Base classes: `nc-form-field`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-form-field-gap` | — | — |

### Requirement Indicators
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-form-label-required-color` | — | — |
| `nc-form-label-optional-color` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName

## Dependencies
`checkbox`, `form`, `input`, `select`, `textarea`

## Web Components Mapping
Derived from anatomy for potential `<nc-form-field>` custom element:

```js
class NcFormField extends HTMLElement {
  static observedAttributes = ['layout', 'requirement', 'validation', 'content', 'grouping'];
  // Slots: <slot name="control">
}
```

---

*Generated from `data/form-field-recipe.json` by `scripts/generate-component-specs.js`*
