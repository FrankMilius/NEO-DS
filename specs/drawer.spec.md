# drawer Component Spec
> Version 2.0.0 | Status: stable | Layer: organism

Tags: `overlay`, `interactive`, `dialog`, `bottom-sheet`, `side-panel`

## Anatomy
Root element: `.nc-drawer`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| handle | `.nc-drawer__handle` | No | — |
| header | `.nc-drawer__header` | No | — |
| title | `.nc-drawer__title` | No | — |
| description | `.nc-drawer__description` | No | — |
| content | `.nc-drawer__content` | Yes | — |
| footer | `.nc-drawer__footer` | No | — |
| close | `.nc-drawer__close` | No | — |

### DOM Notes
- Natives <dialog> mit showModal(). Slide-in von 4 Richtungen mit Spring-Animation.
- Modifiers: --top, --right, --left (default: bottom).
- Handle: 32×4px abgerundeter Balken, aria-hidden='true'. Nur bei bottom/top sichtbar. Signalisiert Swipe-to-Dismiss.
- Content: scrollbar. Header und Footer bleiben sticky bei langen Listen.
- Header Scroll-Border: JS setzt .is-scrolled Klasse bei gescrolltem Content — Header bekommt subtile Trennlinie.
- Footer Scroll-Border: Gleiche Logik — Footer bekommt obere Trennlinie bei gescrolltem Content.
- Light Dismiss: Klick auf ::backdrop schliesst Drawer. JS: dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close() }).
- Close-Button: Sichtbar auf allen Richtungen (v2.0: nicht mehr nur bei left/right). Absolut positioniert oben-rechts.
- Mobile Prioritaet: Bottom-Sheet (direction=bottom) ist die bevorzugte Overlay-Variante fuer Touch-Geraete (Daumenzone).
- Elevation: elevation-modal (L3) — gleiche Schattenstufe wie Modal. Ueberlagert gesamte Anwendungsebene.
- Spring Animation: cubic-bezier(0.175, 0.885, 0.32, 1.275) fuer physisch-reaktionsschnelles Slide-in.
- Body Scroll Lock: body:has(.nc-drawer[open]) { overflow: hidden }.
- Side-Width: 380px (mobile) → 440px (tablet) → 500px (desktop) — responsive Breakpoints.

## Variants
### Direction (`direction`)
Slide-Richtung — bottom (Standard, Bottom-Sheet), top, left, right (Side-Panel)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| bottom | — |  |
| top | `.nc-drawer--top` |  |
| left | `.nc-drawer--left` |  |
| right | `.nc-drawer--right` |  |

## States
Supported: `default`, `open`, `scrolled`

- **open**: 
- **scrolled**: 

## CSS Token API
Base classes: `nc-drawer`

### Container
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-drawer-max-width` | — | `--mod-drawer-max-width` |
| `--nc-drawer-max-height` | — | `--mod-drawer-max-height` |
| `--nc-drawer-width` | — | `--mod-drawer-width` |
| `--nc-drawer-side-width` | — | `--mod-drawer-side-width` |
| `--nc-drawer-padding` | — | `--mod-drawer-padding` |
| `--nc-drawer-radius` | — | `--mod-drawer-radius` |
| `--nc-drawer-bg` | — | `--mod-drawer-bg` |
| `--nc-drawer-shadow` | — | `--mod-drawer-shadow` |
| `--nc-drawer-overlay-bg` | — | `--mod-drawer-overlay-bg` |

### Header
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-drawer-title-font-size` | — | `--mod-drawer-title-font-size` |
| `--nc-drawer-title-font-weight` | — | `--mod-drawer-title-font-weight` |
| `--nc-drawer-title-color` | — | `--mod-drawer-title-color` |
| `--nc-drawer-desc-font-size` | — | `--mod-drawer-desc-font-size` |
| `--nc-drawer-desc-color` | — | `--mod-drawer-desc-color` |
| `--nc-drawer-header-gap` | — | `--mod-drawer-header-gap` |
| `--nc-drawer-header-border-color` | — | `--mod-drawer-header-border-color` |

### Content & Footer
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-drawer-section-gap` | — | `--mod-drawer-section-gap` |
| `--nc-drawer-footer-gap` | — | `--mod-drawer-footer-gap` |
| `--nc-drawer-footer-border-color` | — | `--mod-drawer-footer-border-color` |

### Handle (Bottom-Sheet)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-drawer-handle-width` | — | `--mod-drawer-handle-width` |
| `--nc-drawer-handle-height` | — | `--mod-drawer-handle-height` |
| `--nc-drawer-handle-radius` | — | `--mod-drawer-handle-radius` |
| `--nc-drawer-handle-bg` | — | `--mod-drawer-handle-bg` |

### Close Button
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-drawer-close-size` | — | `--mod-drawer-close-size` |
| `--nc-drawer-close-radius` | — | `--mod-drawer-close-radius` |
| `--nc-drawer-close-bg` | — | `--mod-drawer-close-bg` |
| `--nc-drawer-close-bg-hover` | — | `--mod-drawer-close-bg-hover` |
| `--nc-drawer-close-icon-size` | — | `--mod-drawer-close-icon-size` |
| `--nc-drawer-close-offset` | — | `--mod-drawer-close-offset` |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-drawer-duration` | — | `--mod-drawer-duration` |
| `--nc-drawer-ease` | — | `--mod-drawer-ease` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Escape` | close | Schliesst den Drawer, Fokus zurueck auf den Ausloeser. |
| `Tab` | trap-focus | Fokus bleibt im Drawer (Fokus-Falle). |
| `Shift+Tab` | trap-focus-reverse | Rueckwaerts innerhalb der Fokus-Falle. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `drawer-open` | Yes | — |
| `drawer-close` | Yes | `{"reason":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard
- focusTrap

## Web Components Mapping
Derived from anatomy for potential `<nc-drawer>` custom element:

```js
class NcDrawer extends HTMLElement {
  static observedAttributes = ['direction'];
  // Slots: <slot name="content">
}
```

---

*Generated from `data/drawer-recipe.json` by `scripts/generate-component-specs.js`*
