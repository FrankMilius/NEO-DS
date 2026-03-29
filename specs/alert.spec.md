# alert Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

Tags: `static`, `feedback`, `notification`, `inline`

## Anatomy
Root element: `.nc-alert`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| icon | `.nc-alert__icon` | No | — |
| content | `.nc-alert__content` | Yes | — |
| title | `.nc-alert__title` | No | — |
| description | `.nc-alert__description` | No | — |
| details | `.nc-alert__details` | No | — |
| action | `.nc-alert__action` | No | — |
| close | `.nc-alert__close` | No | — |

### DOM Notes
- Alert ist ein <div class='nc-alert' role='alert|status'>.
- Layout: Flex Row — Icon | Content (Title + Description + Details + Action) | Close.
- 4 semantische Varianten: info (Standard), success, warning, danger.
- role='alert' fuer danger/warning (urgent, unterbricht Screen Reader).
- role='status' fuer info/success (polite, unterbricht nicht).
- Icon ist aria-hidden='true' — Text liefert die Information.
- Close-Button braucht aria-label='Schliessen'.
- Details-Slot: Natives <details> Element fuer Progressive Disclosure. Toggle zeigt/verbirgt Zusatzinformationen (z.B. Stacktrace, Validierungsdetails).
- Inline-Variante (--inline): Kein Hintergrund, kein Border, kein Padding. Nur Icon + farbiger Text. Ideal als Alternative zu form-hint direkt an Eingabefeldern.
- Banner-Abgrenzung: Alert ist kontextuell/lokal (innerhalb einer Section). Banner (.nc-banner) ist global (oberer Seitenrand, volle Breite, sticky). Verwende Alert fuer Formular-Feedback, Banner fuer systemweite Meldungen.
- Deprecated: --destructive ist Alias fuer --danger.
- Farbe nie alleiniges Signal — immer mit Icon + Text (R7).

## Variants
### Variant (`variant`)
Semantische Feedback-Variante — info (Standard, blau), success (gruen), warning (gelb/orange), danger (rot)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| info | `.nc-alert--info` |  |
| success | `.nc-alert--success` |  |
| warning | `.nc-alert--warning` |  |
| danger | `.nc-alert--danger` |  |

### Content (`content`)
Inhalts-Komposition — title-only, full, with-action, dismissible, with-details

| Value | CSS Modifier | Default |
| --- | --- | --- |
| title-only | — |  |
| full | — |  |
| with-action | — |  |
| dismissible | — |  |
| with-details | — |  |

### Display (`display`)
Darstellungsmodus — block (Standard mit Hintergrund), inline (nur Icon + Text)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| block | — |  |
| inline | `.nc-alert--inline` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-alert`

### Geometry & Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-alert-padding` | — | — |
| `nc-alert-radius` | — | — |
| `nc-alert-border-width` | — | — |
| `nc-alert-icon-size` | — | — |
| `nc-alert-gap` | — | — |
| `nc-alert-title-font-weight` | — | — |
| `nc-alert-description-opacity` | — | — |
| `nc-alert-close-size` | — | — |

### Info Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-alert-info-bg` | — | — |
| `nc-alert-info-color` | — | — |
| `nc-alert-info-border` | — | — |
| `nc-alert-info-icon-color` | — | — |

### Success Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-alert-success-bg` | — | — |
| `nc-alert-success-color` | — | — |
| `nc-alert-success-border` | — | — |
| `nc-alert-success-icon-color` | — | — |

### Warning Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-alert-warning-bg` | — | — |
| `nc-alert-warning-color` | — | — |
| `nc-alert-warning-border` | — | — |
| `nc-alert-warning-icon-color` | — | — |

### Danger Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-alert-danger-bg` | — | — |
| `nc-alert-danger-color` | — | — |
| `nc-alert-danger-border` | — | — |
| `nc-alert-danger-icon-color` | — | — |

### Inline Variant
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-alert-inline-gap` | — | — |
| `nc-alert-inline-font-size` | — | — |

### Details Toggle
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-alert-details-margin-top` | — | — |
| `nc-alert-details-font-size` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName

## Dependencies
`banner`

## Web Components Mapping
Derived from anatomy for potential `<nc-alert>` custom element:

```js
class NcAlert extends HTMLElement {
  static observedAttributes = ['variant', 'content', 'display'];
  // Slots: <slot name="content">
}
```

---

*Generated from `data/alert-recipe.json` by `scripts/generate-component-specs.js`*
