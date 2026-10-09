# app-store Component Spec
> Version 1.2.0 | Status: stable | Layer: molecule

Tags: `media`, `app`, `app-store`

## Anatomy
Root element: `.nc-app-store`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| badges | `.nc-app-store__badges` | No | Store-Abzeichen. Ein leeres Adressfeld blendet sein Abzeichen aus — ein toter Verweis ist schlimmer als ein fehlender. |
| qr | `.nc-app-store__qr` | No | QR-Code. Erst ab md sichtbar: Wer die Seite auf dem Telefon liest, braucht keinen Code, um aufs Telefon zu kommen. |
| note | `.nc-app-store__note` | No | Kleingedrucktes — Voraussetzungen, Groesse, Sprachen. |

### DOM Notes
- Die Abzeichen sind KEINE Nachbauten der Marken von Apple und Google. Beide geben eigene Bilddateien und Gestaltungsvorgaben vor; bis die vorliegen, steht hier eine Schaltflaeche im Systemstil.
- Der QR-Code wird als Bild erwartet, nicht im Browser gerechnet — eine QR-Bibliothek waere ein weiteres Skript fuer etwas, das sich einmal erzeugen laesst.

## Variants
### Flaeche (`surface`)
| Value | CSS Modifier | Default |
| --- | --- | --- |
| light | — |  |
| dark | `.nc-app-store--on-dark` |  |

### Ausrichtung (`align`)
| Value | CSS Modifier | Default |
| --- | --- | --- |
| start | — |  |
| center | `.nc-app-store--center` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-app-store`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-app-store-gap` | — | `--mod-app-store-gap` |
| `--nc-app-store-badge-gap` | — | `--mod-app-store-badge-gap` |
| `--nc-app-store-badge-pad` | — | `--mod-app-store-badge-pad` |
| `--nc-app-store-badge-radius` | — | `--mod-app-store-badge-radius` |
| `--nc-app-store-badge-border-width` | — | — |
| `--nc-app-store-badge-border` | — | `--mod-app-store-badge-border` |
| `--nc-app-store-badge-border-hover` | — | `--mod-app-store-badge-border-hover` |
| `--nc-app-store-badge-bg` | — | `--mod-app-store-badge-bg` |
| `--nc-app-store-badge-bg-hover` | — | `--mod-app-store-badge-bg-hover` |
| `--nc-app-store-badge-color` | — | `--mod-app-store-badge-color` |
| `--nc-app-store-kicker-size` | — | `--mod-app-store-kicker-size` |
| `--nc-app-store-name-size` | — | `--mod-app-store-name-size` |
| `--nc-app-store-icon-size` | — | — |
| `--nc-app-store-qr-size` | — | `--mod-app-store-qr-size` |

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-app-store>` custom element:

```js
class NcAppStore extends HTMLElement {
  static observedAttributes = ['surface', 'align'];
  // Slots: default
}
```

---

*Generated from `data/app-store-recipe.json` by `scripts/generate-component-specs.js`*
