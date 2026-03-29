# accordion Component Spec
> Version 3.0.0 | Status: stable | Layer: molecule

Tags: `interactive`, `disclosure`, `content`, `navigation`, `faq`, `selection`

## Anatomy
Root element: `.nc-accordion`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| item | `.nc-accordion__item` | Yes | Einzelnes Accordion-Item (details Element). |
| trigger | `.nc-accordion__trigger` | Yes | Klickbarer Header (summary Element). Enthaelt Text, Icon, optional Prefix/Suffix. |
| icon | `.nc-accordion__icon` | No | Toggle-Icon (Chevron). Rotiert bei Open. |
| content | `.nc-accordion__content` | Yes | Content-Container. grid-template-rows: 0fr/1fr Animation. |
| content-inner | `.nc-accordion__content-inner` | Yes | Innerer Content mit overflow:hidden. |
| media | `.nc-accordion__media` | No | Optionaler Bild/Video-Container. |
| trigger-prefix | `.nc-accordion__trigger-prefix` | No | Platz fuer Checkbox, Radio oder Status-Icon links im Trigger. |
| trigger-suffix | `.nc-accordion__trigger-suffix` | No | Platz fuer Badges oder Action-Buttons rechts im Trigger (vor dem Toggle-Icon). |
| footer | `.nc-accordion__footer` | No | Optionaler Footer am Ende des Contents fuer Buttons/Actions. |

### DOM Notes
- Natives <details>/<summary> oder ARIA-Pattern (role='region').
- BEM: .nc-accordion > __item > __trigger + __content > __content-inner.
- CSS-Grid-Animation: grid-template-rows 0fr→1fr fuer fluessige Hoehen-Animation.
- Trigger-Layout: [prefix] [text] [suffix] [icon] via Flexbox.
- Nested: nc-accordion innerhalb eines nc-accordion__content-inner. Eingerueckt via padding-left.
- Selection: .nc-accordion__trigger-prefix enthaelt Checkbox/Radio. Checked-State: farbiger Rahmen + BG auch bei geschlossenem Item.
- Actionable Header: .nc-accordion__trigger-suffix fuer Badges (rechts, vor Icon).
- Sticky Trigger: position:sticky auf dem Trigger bei offenem Item (nur bei langem Content).
- Scroll-Into-View: scrollIntoView({behavior:'smooth'}) auf den Trigger nach Auto-Close im Single-Mode.
- Always Open: data-allow-close='false' auf dem Item verhindert Schliessen.
- Footer: Optionaler Aktionsbereich am Content-Ende (z.B. 'Weiter'-Button).
- prefers-reduced-motion: Transitions deaktiviert.

## Variants
### Variant (`variant`)
Visueller Stil — default, flush, ghost, separated, elevated, nested, selection

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| flush | `.nc-accordion--flush` |  |
| ghost | `.nc-accordion--ghost` |  |
| separated | `.nc-accordion--separated` |  |
| elevated | `.nc-accordion--elevated` |  |
| nested | `.nc-accordion--nested` |  |
| selection | `.nc-accordion--selection` |  |

### Density (`density`)
Platzbedarf — default, compact, spacious

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| compact | `.nc-accordion--compact` |  |
| spacious | `.nc-accordion--spacious` |  |

### Behavior (`behavior`)
Oeffnungs-Verhalten — multiple, single, single-scroll (mit Scroll-Into-View)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| multiple | — |  |
| single | — |  |
| single-scroll | — |  |

### Media Layout (`media-layout`)
Medien-Positionierung — none, top, side

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| top | `.nc-accordion--media-top` |  |
| side | `.nc-accordion--media-side` |  |

### Sticky Trigger (`sticky`)
Trigger bleibt am oberen Rand bei langem Content

| Value | CSS Modifier | Default |
| --- | --- | --- |
| off | — |  |
| on | `.nc-accordion--sticky` |  |

## States
Supported: `default`, `open`, `hover`, `focus`, `disabled`, `selected`

- **hover**: 
- **open**: 
- **focus**: 
- **disabled**: 
- **selected**: 

## CSS Token API
Base classes: `nc-accordion`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-accordion-border` | — | — |
| `nc-accordion-padding` | — | — |
| `nc-accordion-icon-size` | — | — |

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-accordion-trigger-font-weight` | — | — |
| `nc-accordion-trigger-color` | — | — |
| `nc-accordion-content-color` | — | — |
| `nc-accordion-icon-color` | — | — |
| `nc-accordion-trigger-hover-bg` | — | — |
| `nc-accordion-content-font-size` | — | — |

### Separated
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-accordion-item-gap` | — | — |
| `nc-accordion-item-radius` | — | — |
| `nc-accordion-item-shadow` | — | — |
| `nc-accordion-item-bg` | — | — |

### Elevated
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-accordion-elevated-shadow` | — | — |

### Compact
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-accordion-padding-compact` | — | — |
| `nc-accordion-content-font-size-compact` | — | — |

### Spacious
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-accordion-padding-spacious` | — | — |

### Media
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-accordion-media-radius` | — | — |
| `nc-accordion-media-max-height` | — | — |
| `nc-accordion-media-gap` | — | — |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-accordion-transition-duration` | — | — |

### Nested
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-accordion-nested-indent` | — | — |
| `nc-accordion-nested-border-width` | — | — |
| `nc-accordion-nested-icon-size` | — | — |

### Selection
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-accordion-selection-border-active` | — | — |
| `nc-accordion-selection-bg-active` | — | — |
| `nc-accordion-selection-indicator-size` | — | — |

### Header Actions
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-accordion-actions-gap` | — | — |
| `nc-accordion-actions-color` | — | — |
| `nc-accordion-actions-hover-color` | — | — |

### Sticky Trigger
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-accordion-trigger-sticky-z` | — | — |
| `nc-accordion-trigger-sticky-bg` | — | — |

### Footer
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-accordion-footer-padding` | — | — |
| `nc-accordion-footer-border` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | toggle-item | Oeffnet/schliesst das fokussierte Accordion-Item. |
| `Space` | toggle-item | Oeffnet/schliesst das fokussierte Accordion-Item. |
| `ArrowDown` | focus-next-trigger | Fokussiert naechsten Accordion-Trigger. |
| `ArrowUp` | focus-prev-trigger | Fokussiert vorherigen Accordion-Trigger. |
| `Home` | focus-first-trigger | Springt zum ersten Trigger. |
| `End` | focus-last-trigger | Springt zum letzten Trigger. |

## Test Selectors
| Slot | Selector |
| --- | --- |
| root | `[data-testid='accordion']` |
| item | `[data-testid='accordion-item']` |
| trigger | `[data-testid='accordion-trigger']` |
| content | `[data-testid='accordion-content']` |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `accordion-toggle` | Yes | `{"itemId":"string","open":"boolean"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-accordion>` custom element:

```js
class NcAccordion extends HTMLElement {
  static observedAttributes = ['variant', 'density', 'behavior', 'media-layout', 'sticky'];
  // Slots: <slot name="item">, <slot name="trigger">, <slot name="content">, <slot name="content-inner">
}
```

---

*Generated from `data/accordion-recipe.json` by `scripts/generate-component-specs.js`*
