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
| `nc-drawer-max-width` | — | — |
| `nc-drawer-max-height` | — | — |
| `nc-drawer-width` | — | — |
| `nc-drawer-side-width` | — | — |
| `nc-drawer-padding` | — | — |
| `nc-drawer-radius` | — | — |
| `nc-drawer-bg` | — | — |
| `nc-drawer-shadow` | — | — |
| `nc-drawer-overlay-bg` | — | — |

### Header
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-drawer-title-font-size` | — | — |
| `nc-drawer-title-font-weight` | — | — |
| `nc-drawer-title-color` | — | — |
| `nc-drawer-desc-font-size` | — | — |
| `nc-drawer-desc-color` | — | — |
| `nc-drawer-header-gap` | — | — |
| `nc-drawer-header-border-color` | — | — |

### Content & Footer
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-drawer-section-gap` | — | — |
| `nc-drawer-footer-gap` | — | — |
| `nc-drawer-footer-border-color` | — | — |

### Handle (Bottom-Sheet)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-drawer-handle-width` | — | — |
| `nc-drawer-handle-height` | — | — |
| `nc-drawer-handle-radius` | — | — |
| `nc-drawer-handle-bg` | — | — |

### Close Button
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-drawer-close-size` | — | — |
| `nc-drawer-close-radius` | — | — |
| `nc-drawer-close-bg` | — | — |
| `nc-drawer-close-bg-hover` | — | — |
| `nc-drawer-close-icon-size` | — | — |
| `nc-drawer-close-offset` | — | — |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-drawer-duration` | — | — |
| `nc-drawer-ease` | — | — |

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
