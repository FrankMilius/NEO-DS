# alert-dialog Component Spec
> Version 2.1.0 | Status: stable | Layer: organism

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
- Focus-Management (WAI-ARIA alertdialog, Entscheidung 03.10.2026 — sichere Aktion per Markierung): Beim Oeffnen geht der Fokus auf das bedienbare Element mit [autofocus] im Dialog; ohne Markierung auf Abbrechen (data-action='cancel'), sonst das erste bedienbare Element. Die sichere Aktion haengt vom Inhalt ab: meist Abbrechen, bei 'Sitzung laeuft ab' die Aktion 'Angemeldet bleiben'. Anti-Slipping: destruktive Aktionen nie markieren.
- Visuelle Synergie: Danger-Farben (bg, border, icon-color) sind identisch mit .nc-alert--danger, sodass ein Danger-Alert im Formular visuell exakt zum darauf folgenden Destructive-Alert-Dialog passt.
- Verhalten (neo-behaviors alert-dialog): Ausloeser mit aria-controls oeffnet per showModal(); Fokus-Falle; Escape schliesst wie Abbrechen (reason 'escape'); Klick auf den Hintergrund schliesst NICHT; Knoepfe mit data-action schliessen mit reason = data-action ('cancel', 'confirm', eigene Werte); danach Fokus zurueck auf den Ausloeser.
- Manuelles Schliessen (Entscheidung 03.10.2026): data-close='manuell' am <dialog> (nicht am Knopf — es beschreibt den Ablauf des Dialogs). Ein Klick auf data-action='confirm' schliesst dann NICHT, sondern meldet nur alert-dialog-close { reason: 'confirm', action: 'confirm', open: true }; das Programm zeigt z. B. einen Ladezustand (Knopf aria-disabled='true') und schliesst selbst mit dialog.close() (Ereignis reason 'programmatic', open false; Fokus zurueck zum Ausloeser). Abbrechen, eigene data-action-Werte und Escape schliessen weiter sofort.
- Unsaved-Changes: drei Knoepfe im Footer — Speichern (nc-button--secondary, data-action='save'), Abbrechen (data-action='cancel'), Verwerfen (data-action='confirm', bei destructive in Gefahrenfarbe).

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
| `--nc-dialog-max-width` | — | `--mod-dialog-max-width` |
| `--nc-dialog-padding` | — | `--mod-dialog-padding` |
| `--nc-dialog-radius` | — | `--mod-dialog-radius` |
| `--nc-dialog-bg` | — | `--mod-dialog-bg` |
| `--nc-dialog-shadow` | — | `--mod-dialog-shadow` |
| `--nc-dialog-overlay-bg` | — | `--mod-dialog-overlay-bg` |
| `--nc-dialog-section-gap` | — | `--mod-dialog-section-gap` |

### Header
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dialog-title-font-size` | — | `--mod-dialog-title-font-size` |
| `--nc-dialog-title-font-weight` | — | `--mod-dialog-title-font-weight` |
| `--nc-dialog-title-color` | — | `--mod-dialog-title-color` |
| `--nc-dialog-header-gap` | — | `--mod-dialog-header-gap` |

### Footer & Description
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dialog-description-font-size` | — | `--mod-dialog-description-font-size` |
| `--nc-dialog-description-color` | — | `--mod-dialog-description-color` |
| `--nc-dialog-footer-gap` | — | `--mod-dialog-footer-gap` |

### Status Icon
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dialog-icon-size` | — | `--mod-dialog-icon-size` |

### Destructive Intent
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-dialog-danger-icon-color` | — | `--mod-dialog-danger-icon-color` |
| `--nc-dialog-danger-action-bg` | — | `--mod-dialog-danger-action-bg` |
| `--nc-dialog-danger-action-color` | — | `--mod-dialog-danger-action-color` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Escape` | cancel | Schliesst wie Abbrechen (alert-dialog-close reason 'escape'), Fokus zurueck auf den Ausloeser. |
| `Enter` | activate | Loest die fokussierte Aktion aus (nativer Knopf). Beim Oeffnen liegt der Fokus auf der sicheren Aktion ([autofocus], sonst Abbrechen) — Enter loest nie versehentlich eine destruktive Aktion aus. |
| `Tab` | trap-focus | Fokus bleibt im Dialog (Fokus-Falle). |
| `Shift+Tab` | trap-focus-reverse | Rueckwaerts innerhalb der Fokus-Falle. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `alert-dialog-open` | Yes | — |
| `alert-dialog-close` | Yes | `{"reason":"string","action":"string","open":"boolean"}` |

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
