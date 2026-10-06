# accordion Component Spec
> Version 3.1.0 | Status: stable | Layer: molecule

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
- .nc-accordion__text ist ein <div>, kein <p>: die Antwort darf Listen enthalten, und ein <ul> in einem <p> bricht den Absatz im Browser auf.
- Erlaubte Auszeichnung in der Antwort: p, br, strong, em, b, i, ul, ol, li, a, code, abbr. Alles andere wird verworfen (Drupal: Xss::filter im Preprocess _neo_fe_acc_antwort).
- Loser Text vor oder zwischen Bloecken wird in <p> gefasst — sonst klebt eine Liste am Vorspann, denn CSS kann "steht hinter einem Textknoten" nicht auswaehlen.

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
| register | `.nc-accordion--register` |  |
| lese | `.nc-accordion--lese` |  |

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

### Sprungziel (`deepLink`)
Jeder Eintrag traegt eine Kennung. /seite#kennung oeffnet ihn und springt hin; der offene Eintrag bekommt eine Marke, damit man sieht, wo man gelandet ist.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| on | — |  |

### Alle aufklappen (`expandAll`)
Schalter ueber der Liste. Sinnvoll ab etwa acht Eintraegen. Bei Verhalten `single` wirkungslos — dort widerspraeche er sich selbst.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| off | — |  |
| on | `.nc-accordion-toggle-all` |  |

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
| `--nc-accordion-border` | — | `--mod-accordion-border` |
| `--nc-accordion-padding` | — | `--mod-accordion-padding` |
| `--nc-accordion-icon-size` | — | `--mod-accordion-icon-size` |

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-trigger-font-weight` | — | `--mod-accordion-trigger-font-weight` |
| `--nc-accordion-trigger-color` | — | `--mod-accordion-trigger-color` |
| `--nc-accordion-content-color` | — | `--mod-accordion-content-color` |
| `--nc-accordion-icon-color` | — | `--mod-accordion-icon-color` |
| `--nc-accordion-trigger-hover-bg` | — | `--mod-accordion-trigger-hover-bg` |
| `--nc-accordion-content-font-size` | — | `--mod-accordion-content-font-size` |

### Separated
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-item-gap` | — | `--mod-accordion-item-gap` |
| `--nc-accordion-item-radius` | — | `--mod-accordion-item-radius` |
| `--nc-accordion-item-shadow` | — | `--mod-accordion-item-shadow` |
| `--nc-accordion-item-bg` | — | `--mod-accordion-item-bg` |

### Elevated
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-elevated-shadow` | — | `--mod-accordion-elevated-shadow` |

### Compact
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-padding-compact` | — | `--mod-accordion-padding-compact` |
| `--nc-accordion-content-font-size-compact` | — | `--mod-accordion-content-font-size-compact` |

### Spacious
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-padding-spacious` | — | `--mod-accordion-padding-spacious` |

### Media
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-media-radius` | — | `--mod-accordion-media-radius` |
| `--nc-accordion-media-max-height` | — | `--mod-accordion-media-max-height` |
| `--nc-accordion-media-gap` | — | `--mod-accordion-media-gap` |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-transition-duration` | — | `--mod-accordion-transition-duration` |

### Nested
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-nested-indent` | — | `--mod-accordion-nested-indent` |
| `--nc-accordion-nested-border-width` | — | `--mod-accordion-nested-border-width` |
| `--nc-accordion-nested-icon-size` | — | `--mod-accordion-nested-icon-size` |

### Selection
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-selection-border-active` | — | `--mod-accordion-selection-border-active` |
| `--nc-accordion-selection-bg-active` | — | `--mod-accordion-selection-bg-active` |
| `--nc-accordion-selection-indicator-size` | — | `--mod-accordion-selection-indicator-size` |

### Header Actions
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-actions-gap` | — | `--mod-accordion-actions-gap` |
| `--nc-accordion-actions-color` | — | `--mod-accordion-actions-color` |
| `--nc-accordion-actions-hover-color` | — | `--mod-accordion-actions-hover-color` |

### Sticky Trigger
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-trigger-sticky-z` | — | `--mod-accordion-trigger-sticky-z` |
| `--nc-accordion-trigger-sticky-bg` | — | `--mod-accordion-trigger-sticky-bg` |

### Footer
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-footer-padding` | — | `--mod-accordion-footer-padding` |
| `--nc-accordion-footer-border` | — | `--mod-accordion-footer-border` |

### Typografie des Ausloesers
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-trigger-family` | — | `--mod-accordion-trigger-family` |
| `--nc-accordion-trigger-size` | — | `--mod-accordion-trigger-size` |
| `--nc-accordion-trigger-lh` | — | `--mod-accordion-trigger-lh` |
| `--nc-accordion-trigger-tracking` | — | `--mod-accordion-trigger-tracking` |
| `--nc-accordion-trigger-font-weight` | — | `--mod-accordion-trigger-font-weight` |
| `--nc-accordion-trigger-color` | — | `--mod-accordion-trigger-color` |
| `--nc-accordion-trigger-hover-bg` | — | `--mod-accordion-trigger-hover-bg` |
| `--nc-accordion-trigger-sticky-z` | — | `--mod-accordion-trigger-sticky-z` |
| `--nc-accordion-trigger-sticky-bg` | — | `--mod-accordion-trigger-sticky-bg` |
| `--nc-accordion-kicker-family` | — | `--mod-accordion-kicker-family` |
| `--nc-accordion-kicker-size` | — | `--mod-accordion-kicker-size` |
| `--nc-accordion-kicker-weight` | — | `--mod-accordion-kicker-weight` |
| `--nc-accordion-kicker-tracking` | — | `--mod-accordion-kicker-tracking` |
| `--nc-accordion-kicker-color` | — | `--mod-accordion-kicker-color` |
| `--nc-accordion-kicker-gap` | — | `--mod-accordion-kicker-gap` |
| `--nc-accordion-content-lh` | — | `--mod-accordion-content-lh` |
| `--nc-accordion-content-measure` | — | `--mod-accordion-content-measure` |
| `--nc-accordion-gutter` | — | `--mod-accordion-gutter` |

### Register
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-register-columns` | — | `--mod-accordion-register-columns` |
| `--nc-accordion-register-gap` | — | `--mod-accordion-register-gap` |

### Lesefassung
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-lese-trigger-size` | — | `--mod-accordion-lese-trigger-size` |
| `--nc-accordion-lese-content-size` | — | `--mod-accordion-lese-content-size` |
| `--nc-accordion-lese-measure` | — | `--mod-accordion-lese-measure` |
| `--nc-accordion-lese-padding-block` | — | `--mod-accordion-lese-padding-block` |
| `--nc-accordion-lese-media-max` | — | `--mod-accordion-lese-media-max` |

### Sprungziel
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-target-marker` | — | `--mod-accordion-target-marker` |
| `--nc-accordion-target-width` | — | `--mod-accordion-target-width` |

### Blockraster
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-cols` | — | `--mod-accordion-cols` |
| `--nc-accordion-voll-measure` | — | `--mod-accordion-voll-measure` |

### Innenabstand
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-padding-block` | — | `--mod-accordion-padding-block` |
| `--nc-accordion-padding-inline` | — | `--mod-accordion-padding-inline` |
| `--nc-accordion-padding` | — | `--mod-accordion-padding` |
| `--nc-accordion-padding-compact-block` | — | `--mod-accordion-padding-compact-block` |
| `--nc-accordion-padding-compact-inline` | — | `--mod-accordion-padding-compact-inline` |
| `--nc-accordion-padding-compact` | — | `--mod-accordion-padding-compact` |
| `--nc-accordion-padding-spacious-block` | — | `--mod-accordion-padding-spacious-block` |
| `--nc-accordion-padding-spacious-inline` | — | `--mod-accordion-padding-spacious-inline` |
| `--nc-accordion-padding-spacious` | — | `--mod-accordion-padding-spacious` |

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
  static observedAttributes = ['variant', 'density', 'behavior', 'media-layout', 'sticky', 'deepLink', 'expandAll'];
  // Slots: <slot name="item">, <slot name="trigger">, <slot name="content">, <slot name="content-inner">
}
```

---

*Generated from `data/accordion-recipe.json` by `scripts/generate-component-specs.js`*
