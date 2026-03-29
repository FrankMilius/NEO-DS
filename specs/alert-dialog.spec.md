# alert-dialog Component Spec
> Version 2.0.0 | Status: stable | Layer: organism

Tags: `overlay`, `interactive`, `dialog`, `confirmation`

## Anatomy
Root element: `.nc-alert-dialog`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| icon | `.nc-alert-dialog__icon` | No | — |
| header | `.nc-alert-dialog__header` | Yes | — |
| title | `.nc-alert-dialog__title` | Yes | — |
| description | `.nc-alert-dialog__description` | No | — |
| footer | `.nc-alert-dialog__footer` | Yes | — |

### DOM Notes
- Root: natives <dialog> Element. showModal() fuer modale Anzeige.
- Verwendet --nc-dialog-* Tokens (geteilt mit Modal und Drawer).
- Icon-Slot (v2.0): Optionales Status-Icon vor dem Header. Bei destructive: rotes Warnsymbol (nc-dialog-danger-icon-color). Verstaerkt visuelle Dringlichkeit.
- Header: flex-column, Title + Description. Gap via header-gap.
- Footer: flex, justify-end, Cancel + Action Buttons.
- [open]: display:flex. Zentriert via fixed + margin:auto.
- Backdrop: ::backdrop mit overlay-bg Fade-in Animation.
- Body Scroll Lock: body:has(.nc-alert-dialog[open]) { overflow: hidden }.
- Destructive-Modifier: .nc-alert-dialog--destructive setzt Icon-Farbe auf danger und styled Action-Button als Danger-Button.
- Focus-Management: Bei default: autofocus auf Action-Button (primaere Aktion). Bei destructive: autofocus auf Cancel-Button (verhindert versehentliches Loeschen = Anti-Slipping-Pattern).
- Visuelle Synergie: Danger-Farben (bg, border, icon-color) sind identisch mit .nc-alert--danger, sodass ein Danger-Alert im Formular visuell exakt zum darauf folgenden Destructive-Alert-Dialog passt.

## Variants
### Intent (`intent`)
Intention — default (neutral, informativ), destructive (Loeschen/Gefahr, visuell hervorgehoben)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| destructive | `.nc-alert-dialog--destructive` |  |

### Content (`content`)
Inhalt — with-description (Title + Description), title-only (nur Title), with-icon (Title + Description + Status-Icon)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| with-description | — |  |
| title-only | — |  |
| with-icon | — |  |

## States
Supported: `default`, `open`

- **open**: 

## CSS Token API
Base classes: `nc-alert-dialog`

### Container
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dialog-max-width` | — | — |
| `nc-dialog-padding` | — | — |
| `nc-dialog-radius` | — | — |
| `nc-dialog-bg` | — | — |
| `nc-dialog-shadow` | — | — |
| `nc-dialog-overlay-bg` | — | — |
| `nc-dialog-section-gap` | — | — |

### Header
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dialog-title-font-size` | — | — |
| `nc-dialog-title-font-weight` | — | — |
| `nc-dialog-title-color` | — | — |
| `nc-dialog-header-gap` | — | — |

### Footer & Description
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dialog-description-font-size` | — | — |
| `nc-dialog-description-color` | — | — |
| `nc-dialog-footer-gap` | — | — |

### Status Icon
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dialog-icon-size` | — | — |

### Destructive Intent
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dialog-danger-icon-color` | — | — |
| `nc-dialog-danger-action-bg` | — | — |
| `nc-dialog-danger-action-color` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard
- focusTrap

## Dependencies
`alert`

## Web Components Mapping
Derived from anatomy for potential `<nc-alert-dialog>` custom element:

```js
class NcAlertDialog extends HTMLElement {
  static observedAttributes = ['intent', 'content'];
  // Slots: <slot name="header">, <slot name="title">, <slot name="footer">
}
```

---

*Generated from `data/alert-dialog-recipe.json` by `scripts/generate-component-specs.js`*
