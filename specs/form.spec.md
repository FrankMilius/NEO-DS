# form Component Spec
> Version 1.2.0 | Status: stable | Layer: organism

Tags: `form`, `layout`, `interactive`

## Anatomy
Root element: `.nc-form`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| honeypot | `.nc-form-hp` | No | Honeypot: Feld fuer Bots, per Clip visuell verborgen (nicht display:none). |

### DOM Notes
- Root: <form> mit flex-column Layout. Gap via nc-form-gap (24px).
- Enthaelt .nc-form-field, .nc-fieldset, .nc-form-section, .nc-form-actions.
- Inline: flex-row, flex-wrap. Fields auto-width. Submit am Ende.
- Two-Column: CSS Grid, 1fr mobile → repeat(2,1fr) ab md. Fieldsets/Buttons: grid-column 1/-1.
- Disabled: opacity-disabled, pointer-events:none. Native Controls zusaetzlich deaktivieren.
- novalidate + Custom-Validation empfohlen.
- Pruefung (neo-behaviors form, Wurzel form[data-neo-form]): jedes benannte Feld (input, select, textarea; nicht im Honigtopf .nc-form-hp) und jede Gruppe [data-neo-form-gruppe] (checkbox-group als fieldset, multiselect) mit data-required. Pruefung beim Verlassen (focusout), danach live bei input/change, alle beim Absenden. Grundlage ist die native Gueltigkeit (required, type, minlength, pattern); Gruppen: mindestens ein Haken.
- Fehlertext p.nc-form-error#<feld-id>-err im Feld-Wrapper (.nc-form-field, bei der Zustimmung .nc-form-block__terms) ohne Rolle; Feld aria-invalid="true" und aria-describedby um die Fehler-id ergaenzt (ein Hilfetext bleibt erhalten); Wrapper .nc-form-field--invalid. Eigener Text: data-error am Feld; Name im Text: data-label (sonst „Dieses Feld" / „This field").
- Zusammenfassung (Recipe validation-summary) als erstes Kind des Formulars: div.nc-validation-summary[role=alert][tabindex=-1][aria-labelledby] > Titel mit Anzahl + ul.__list > li.__item > a[href=#<feld-id>]; der Fokus springt beim Absenden mit Fehlern dorthin, ein Link fokussiert das Feld. Ohne Fehler .nc-validation-summary--hidden. Fehlt das Element, legt das Behavior es an.
- Absenden: ohne Fehler das abbrechbare Ereignis form-submit { valid: true, errors: 0 } — wer es abbricht (preventDefault), uebernimmt das Absenden (neo_fe: Honigtopf, AJAX), sonst sendet der Browser. Mit Fehlern bricht das Behavior den Submit ab und sendet form-submit { valid: false, errors: n }.

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
| `--nc-form-gap` | — | `--mod-form-gap` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | focus-next | Felder in Dokumentreihenfolge; nach dem Absenden mit Fehlern steht der Fokus auf der Zusammenfassung, Tab fuehrt zu ihren Links. |
| `Enter` | submit | In einem Textfeld bzw. auf dem Absende-Knopf: alle Felder pruefen; mit Fehlern Zusammenfassung zeigen und fokussieren, ohne Fehler form-submit senden. Auf einem Link der Zusammenfassung: das Feld fokussieren. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `form-submit` | Yes | `{"valid":"boolean","errors":"number"}` |

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
