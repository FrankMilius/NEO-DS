# modal Component Spec
> Version 2.0.0 | Status: stable | Layer: organism

Tags: `overlay`, `interactive`, `dialog`

## Anatomy
Root element: `.nc-modal`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| header | `.nc-modal__header` | No | — |
| title | `.nc-modal__title` | No | — |
| header-icon | `.nc-modal__header-icon` | No | — |
| close | `.nc-modal__close` | No | — |
| body | `.nc-modal__body` | Yes | — |
| footer | `.nc-modal__footer` | No | — |

### DOM Notes
- Root: natives <dialog> Element. showModal() fuer modale Anzeige.
- Verwendet --nc-dialog-* Tokens (geteilt mit Alert-Dialog fuer Overlay-Konsistenz).
- [open]: display:flex. Zentriert via fixed + margin:auto.
- Backdrop: ::backdrop mit overlay-bg Animation. Optional: Klick auf Backdrop schliesst via data-backdrop-close='true'. Nicht bei Formularen (Datenverlust).
- Oeffnungs-Animation: opacity + translate (16px hoch). @starting-style.
- Body Scroll Lock: body:has(.nc-modal[open]) { overflow: hidden }.
- Sticky Header/Footer: Bei --scrollable Modifier bleiben Header und Footer fixiert. JS setzt .is-scrolled-top/.is-scrolled-bottom auf .nc-modal basierend auf scrollTop des Body — Header/Footer zeigen dann eine subtile Border (nc-dialog-header-border-color / nc-dialog-footer-border-color) als Scroll-Indikator.
- Scroll-Detection JS Pattern: const body = modal.querySelector('.nc-modal__body'); body.addEventListener('scroll', () => { modal.classList.toggle('is-scrolled-top', body.scrollTop > 0); modal.classList.toggle('is-scrolled-bottom', body.scrollTop + body.clientHeight < body.scrollHeight); });
- Backdrop-Close JS Pattern: dialog.addEventListener('click', (e) => { if (e.target === dialog && dialog.dataset.backdropClose === 'true') dialog.close(); });
- Mobile Bottom-Sheet: Unter sm-Breakpoint gleitet das Modal von unten herein (translate: 0 100% → 0 0), volle Breite, abgerundete obere Ecken (nc-dialog-mobile-radius). Max-Hoehe begrenzt (nc-dialog-mobile-max-height: 90vh).
- Overlay-Konsistenz: nc-dialog-bg = surface-elevated (wie Dropdown/Popover). nc-dialog-shadow = elevation-modal (Level 3, hoechster Schatten). Dropdown: elevation-floating (Level 1). Popover: elevation-overlay (Level 2).
- Danger-Intent: Header-Icon-Bereich und primaere Footer-Action uebernehmen danger-Markenfarbe. Visuelles Signal fuer destruktive Aktion.
- Close-Button: <button class='nc-modal__close' aria-label='Schliessen'>. 36px Target, focus-visible Ring.

## Variants
### Size (`size`)
Groesse — sm (400px), md (560px Standard), lg (720px), full (100%)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-modal--sm` |  |
| md | — |  |
| lg | `.nc-modal--lg` |  |
| full | `.nc-modal--full` |  |

### Content (`content`)
Inhaltsstruktur — simple (nur Body), with-header, with-footer, full (Header + Body + Footer), scrollable (voller Inhalt mit scrollbarem Body und sticky Header/Footer)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| simple | — |  |
| with-header | — |  |
| with-footer | — |  |
| full | — |  |
| scrollable | `.nc-modal--scrollable` |  |

### Intent (`intent`)
Absicht — default (neutral, informativ), danger (destruktive Aktion wie Loeschen)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| danger | `.nc-modal--danger` |  |

## States
Supported: `default`, `open`

- **open**: 

## CSS Token API
Base classes: `nc-modal`

### Container
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dialog-max-width` | — | — |
| `nc-dialog-max-height` | — | — |
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
| `nc-dialog-header-border-color` | — | — |

### Body
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dialog-description-font-size` | — | — |
| `nc-dialog-description-color` | — | — |

### Footer
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dialog-footer-gap` | — | — |
| `nc-dialog-footer-border-color` | — | — |

### Close Button
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dialog-close-size` | — | — |
| `nc-dialog-close-radius` | — | — |
| `nc-dialog-close-bg` | — | — |
| `nc-dialog-close-bg-hover` | — | — |
| `nc-dialog-close-icon-size` | — | — |

### Danger Intent
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dialog-danger-icon-color` | — | — |
| `nc-dialog-danger-action-bg` | — | — |
| `nc-dialog-danger-action-color` | — | — |

### Scroll Borders
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dialog-header-border-color` | — | — |
| `nc-dialog-footer-border-color` | — | — |

### Mobile Bottom-Sheet
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dialog-mobile-radius` | — | — |
| `nc-dialog-mobile-max-height` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Escape` | close | Schliesst den Modal-Dialog. |
| `Tab` | trap-focus | Focus bleibt innerhalb des Modals (Focus Trap). |
| `Shift+Tab` | trap-focus-reverse | Rueckwaerts-Navigation innerhalb des Focus Trap. |

## Test Selectors
| Slot | Selector |
| --- | --- |
| root | `[data-testid='modal']` |
| overlay | `[data-testid='modal-overlay']` |
| content | `[data-testid='modal-content']` |
| close | `[data-testid='modal-close']` |
| header | `[data-testid='modal-header']` |
| body | `[data-testid='modal-body']` |
| footer | `[data-testid='modal-footer']` |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `modal-open` | Yes | — |
| `modal-close` | Yes | `{"reason":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-modal>` custom element:

```js
class NcModal extends HTMLElement {
  static observedAttributes = ['size', 'content', 'intent'];
  // Slots: <slot name="body">
}
```

---

*Generated from `data/modal-recipe.json` by `scripts/generate-component-specs.js`*
