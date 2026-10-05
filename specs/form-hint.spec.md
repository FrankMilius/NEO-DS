# form-hint Component Spec
> Version 2.0.0 | Status: stable | Layer: molecule

Tags: `form`, `text`, `help`, `accessibility`

## Anatomy
Root element: `.nc-form-hint`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| icon | `.nc-form-hint__icon` | No | — |
| text | `.nc-form-hint__text` | Yes | — |
| link | `.nc-form-hint__link` | No | — |

### DOM Notes
- Flexbox-Layout: Icon + Text nebeneinander, align-items: flex-start.
- Icon ist ein SVG (stroke-basiert, 1em), optisch via margin-top: 0.2em an Text ausgerichtet.
- Text erbt Styles vom Block (font-size, color, line-height).
- margin-block: gap oben, spacing-02 unten — Abstand zum Input und zum naechsten Element.
- Wird via aria-describedby am zugehoerigen Input verknuepft (id='hint-{name}').
- Kann vor oder nach dem Input im .nc-form-field Wrapper platziert werden.
- Link-Slot: Inline-Anchor innerhalb des Hints. Erbt font-size, nutzt interactive-default Farbe. Muss :focus-visible mit focus-ring haben.
- List-Support: .nc-form-hint__text kann eine <ul class='nc-form-hint__list'> enthalten. Listenpunkte werden via gap-Token (nc-form-hint-list-gap) vertikal beabstandet.
- Muted-Variante: Reduzierte Opazitaet/Farbe fuer sehr dezente Zusatzinformation — soll nicht von der primaeren Hint-Message ablenken.

## Variants
### Content (`content`)
Inhaltsvarianten — text-only (nur Text), with-icon (Info-Icon + Text), with-link (Text + Link), list (Anforderungsliste)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| text-only | — |  |
| with-icon | — |  |
| with-link | — |  |
| list | — |  |

### Variant (`variant`)
Farbvariante — default (sekundaerer Text), muted (noch dezentere Farbe fuer lange Hilfetexte)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| muted | `.nc-form-hint--muted` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-form-hint`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-hint-font-size` | — | `--mod-form-hint-font-size` |
| `--nc-form-hint-gap` | — | `--mod-form-hint-gap` |
| `--nc-form-hint-list-gap` | — | `--mod-form-hint-list-gap` |

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-hint-color` | — | `--mod-form-hint-color` |
| `--nc-form-hint-link-color` | — | `--mod-form-hint-link-color` |
| `--nc-form-hint-muted-color` | — | `--mod-form-hint-muted-color` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName

## Dependencies
`form`

## Web Components Mapping
Derived from anatomy for potential `<nc-form-hint>` custom element:

```js
class NcFormHint extends HTMLElement {
  static observedAttributes = ['content', 'variant'];
  // Slots: <slot name="text">
}
```

---

*Generated from `data/form-hint-recipe.json` by `scripts/generate-component-specs.js`*
