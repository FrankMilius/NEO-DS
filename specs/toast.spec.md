# toast Component Spec
> Version 2.1.0 | Status: stable | Layer: molecule

Tags: `feedback`, `notification`, `interactive`, `overlay`

## Anatomy
Root element: `.nc-toast`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| icon | `.nc-toast__icon` | No | — |
| content | `.nc-toast__content` | Yes | — |
| title | `.nc-toast__title` | Yes | — |
| description | `.nc-toast__description` | No | — |
| action | `.nc-toast__action` | No | — |
| close | `.nc-toast__close` | No | — |
| progress | `.nc-toast__progress` | No | — |

### DOM Notes
- Toast: flex-row, Icon + Content + Action + Close. Border, Shadow, radius.
- Toaster (.nc-toaster): fixed Container, 6 Positionen, flex-column, gestapelt.
- Varianten: default, success, warning, error, info — Farben via Private Props (--_toast-*).
- Animation: Slide-in/out je nach Position. Reduced Motion: opacity only.
- Progress: absolut unten, countdown per JS duration. Pausiert bei :hover/:focus-within.
- Close: Token-gesteuert (--nc-toast-close-size, close-opacity, close-bg-hover).
- Action: Token-gesteuert (--nc-toast-action-padding, action-radius, action-font-size).
- Swipe-to-Dismiss: JS setzt --_toast-swipe-x + --_toast-swipe-opacity. CSS: .is-swiping / .is-swipe-out.
- Stack-Transition: .nc-toaster > .nc-toast nutzt transition fuer sanftes Nachruecken.
- Queue: JS begrenzt sichtbare Toasts auf --nc-toast-max-visible (Standard: 3).
- Overlay-Hierarchie: Toast nutzt elevation-overlay (L2), z-index ueber Modal.
- Verhalten (neo-behaviors toast): .nc-toast__close schliesst; Escape schliesst den Toast mit dem Fokus, sonst den neuesten (nicht, solange ein modaler Dialog offen ist); geschlossen: .is-leaving, danach aus dem DOM, Fokus geht zum naechsten Bedienelement.
- Auto-Ausblenden nur mit data-duration (ms; ohne Wert/'auto' = --nc-toast-auto-dismiss-duration). Ohne data-duration bleibt der Toast (WCAG 2.2.1). Toasts mit Aktion mindestens 10 s. Timer und Balken halten bei Hover, Fokus und verborgener Seite an und laufen mit der Restzeit weiter.
- Balken: JS setzt animation-name/-duration/-timing-function/-fill-mode einzeln (nicht die Kurzform animation, die als Inline-Stil animation-play-state ueberstimmt und die Pause per :hover/:focus-within verhindert).
- Aktion: .nc-toast__action meldet toast-action { action } (data-action, data-undo = 'undo', sonst Knopftext) und schliesst den Toast.

## Variants
### Severity (`severity`)
Semantische Variante — default, success, warning, error, info

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | `.nc-toast--default` |  |
| success | `.nc-toast--success` |  |
| warning | `.nc-toast--warning` |  |
| error | `.nc-toast--error` |  |
| info | `.nc-toast--info` |  |

### Position (`position`)
Position des Toasters — top-left, top-center, top-right, bottom-left, bottom-center, bottom-right

| Value | CSS Modifier | Default |
| --- | --- | --- |
| top-right | — |  |
| top-left | — |  |
| top-center | — |  |
| bottom-right | — |  |
| bottom-left | — |  |
| bottom-center | — |  |

### Content (`content`)
Inhaltsoptionen — basic, with-description, with-action, with-undo, with-progress

| Value | CSS Modifier | Default |
| --- | --- | --- |
| basic | — |  |
| with-description | — |  |
| with-action | — |  |
| with-undo | — |  |
| with-progress | — |  |

## States
Supported: `default`, `entering`, `leaving`, `swiping`, `swipe-out`

- **entering**: 
- **leaving**: 
- **swiping**: 
- **swipe-out**: 

## CSS Token API
Base classes: `nc-toast`

### Container
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toast-z-index` | — | `--mod-toast-z-index` |
| `--nc-toast-offset` | — | `--mod-toast-offset` |
| `--nc-toast-gap` | — | `--mod-toast-gap` |
| `--nc-toast-width` | — | `--mod-toast-width` |
| `--nc-toast-padding` | — | `--mod-toast-padding` |
| `--nc-toast-radius` | — | `--mod-toast-radius` |
| `--nc-toast-border-width` | — | `--mod-toast-border-width` |
| `--nc-toast-shadow` | — | `--mod-toast-shadow` |
| `--nc-toast-item-gap` | — | `--mod-toast-item-gap` |
| `--nc-toast-icon-size` | — | `--mod-toast-icon-size` |
| `--nc-toast-font-size` | — | `--mod-toast-font-size` |
| `--nc-toast-description-font-size` | — | `--mod-toast-description-font-size` |
| `--nc-toast-progress-height` | — | `--mod-toast-progress-height` |
| `--nc-toast-auto-dismiss-duration` | — | `--mod-toast-auto-dismiss-duration` |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toast-animation-duration` | — | `--mod-toast-animation-duration` |
| `--nc-toast-animation-easing` | — | `--mod-toast-animation-easing` |
| `--nc-toast-stack-transition` | — | `--mod-toast-stack-transition` |

### Close Button
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toast-close-size` | — | `--mod-toast-close-size` |
| `--nc-toast-close-opacity` | — | `--mod-toast-close-opacity` |
| `--nc-toast-close-bg-hover` | — | `--mod-toast-close-bg-hover` |

### Action Button
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toast-action-padding` | — | `--mod-toast-action-padding` |
| `--nc-toast-action-radius` | — | `--mod-toast-action-radius` |
| `--nc-toast-action-font-size` | — | `--mod-toast-action-font-size` |

### Queue & Swipe
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toast-max-visible` | — | `--mod-toast-max-visible` |
| `--nc-toast-swipe-threshold` | — | `--mod-toast-swipe-threshold` |

### Default Severity
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toast-default-bg` | — | `--mod-toast-default-bg` |
| `--nc-toast-default-color` | — | `--mod-toast-default-color` |
| `--nc-toast-default-border` | — | `--mod-toast-default-border` |
| `--nc-toast-default-icon-color` | — | `--mod-toast-default-icon-color` |
| `--nc-toast-default-progress-bg` | — | `--mod-toast-default-progress-bg` |

### Success Severity
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toast-success-bg` | — | `--mod-toast-success-bg` |
| `--nc-toast-success-color` | — | `--mod-toast-success-color` |
| `--nc-toast-success-border` | — | `--mod-toast-success-border` |
| `--nc-toast-success-icon-color` | — | `--mod-toast-success-icon-color` |
| `--nc-toast-success-progress-bg` | — | `--mod-toast-success-progress-bg` |

### Warning Severity
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toast-warning-bg` | — | `--mod-toast-warning-bg` |
| `--nc-toast-warning-color` | — | `--mod-toast-warning-color` |
| `--nc-toast-warning-border` | — | `--mod-toast-warning-border` |
| `--nc-toast-warning-icon-color` | — | `--mod-toast-warning-icon-color` |
| `--nc-toast-warning-progress-bg` | — | `--mod-toast-warning-progress-bg` |

### Error Severity
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toast-error-bg` | — | `--mod-toast-error-bg` |
| `--nc-toast-error-color` | — | `--mod-toast-error-color` |
| `--nc-toast-error-border` | — | `--mod-toast-error-border` |
| `--nc-toast-error-icon-color` | — | `--mod-toast-error-icon-color` |
| `--nc-toast-error-progress-bg` | — | `--mod-toast-error-progress-bg` |

### Info Severity
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toast-info-bg` | — | `--mod-toast-info-bg` |
| `--nc-toast-info-color` | — | `--mod-toast-info-color` |
| `--nc-toast-info-border` | — | `--mod-toast-info-border` |
| `--nc-toast-info-icon-color` | — | `--mod-toast-info-icon-color` |
| `--nc-toast-info-progress-bg` | — | `--mod-toast-info-progress-bg` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Escape` | dismiss | Schliesst den Toast, in dem der Fokus liegt, sonst den neuesten offenen (toast-dismiss reason 'escape'). Nicht, solange ein modaler Dialog offen ist — der bekommt Escape. |
| `Tab` | pause-on-focus | Fokus auf Aktion oder Schliessen-Knopf haelt Timer und Balken an (WCAG 2.2.1); Reihenfolge: Aktion vor Schliessen (Recipe a11y Undo). |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `toast-dismiss` | Yes | `{"reason":"string"}` |
| `toast-action` | Yes | `{"action":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-toast>` custom element:

```js
class NcToast extends HTMLElement {
  static observedAttributes = ['severity', 'position', 'content'];
  // Slots: <slot name="content">, <slot name="title">
}
```

---

*Generated from `data/toast-recipe.json` by `scripts/generate-component-specs.js`*
