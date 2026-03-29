# dropdown-menu Component Spec
> Version 2.0.0 | Status: stable | Layer: molecule

Tags: `interactive`, `navigation`, `action`, `selection`

## Anatomy
Root element: `.nc-dropdown`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| trigger | `.nc-dropdown__trigger` | Yes | — |
| menu | `.nc-dropdown__menu` | Yes | — |
| item | `.nc-dropdown__item` | Yes | — |
| item-check | `.nc-dropdown__item-check` | No | — |
| item-icon | `.nc-dropdown__item-icon` | No | — |
| item-label | `.nc-dropdown__item-label` | No | — |
| item-shortcut | `.nc-dropdown__item-shortcut` | No | — |
| submenu-indicator | `.nc-dropdown__submenu-indicator` | No | — |
| group | `.nc-dropdown__group` | No | — |
| group-label | `.nc-dropdown__group-label` | No | — |
| separator | `.nc-dropdown__separator` | No | — |
| footer | `.nc-dropdown__footer` | No | — |

### DOM Notes
- Root: inline-flex Wrapper mit Trigger-Button und Menu-Panel.
- Trigger: <button aria-haspopup='true' aria-expanded='true|false'>.
- Menu: position:absolute, role='menu'. Versteckt via [hidden].
- Positionierung: --bottom-start, --bottom-end, --top-start, --top-end Modifier. Empfehlung: Auto-Placement via Floating UI (computePosition + flip + shift + offset) fuer viewportabhaengige Positionierung. CSS-Modifier als Fallback fuer statische Anwendungsfaelle.
- Auto-Placement Pattern: import { computePosition, flip, shift, offset } from '@floating-ui/dom'; computePosition(trigger, menu, { placement: 'bottom-start', middleware: [offset(4), flip(), shift({ padding: 8 })] });
- Items: role='menuitem', flex-Layout mit gap fuer Check + Icon + Label + Shortcut + Submenu-Indicator.
- Checkable Items (single): role='menuitemradio', aria-checked='true|false'. Nur ein Item gleichzeitig checked. Check-Icon (Haekchen) links im Item, reservierte Spalte via .nc-dropdown--checkable.
- Checkable Items (multiple): role='menuitemcheckbox', aria-checked='true|false'. Mehrere Items gleichzeitig checked.
- Submenu: Parent-Item hat aria-haspopup='menu' + aria-expanded='true|false'. Submenu oeffnet sich rechts (LTR) oder links (RTL). Oeffnung via Hover (300ms Delay) oder ArrowRight. Schliessung via ArrowLeft oder Hover-out. Chevron-Icon (.nc-dropdown__submenu-indicator) zeigt Submenu-Existenz an.
- Footer: Permanenter Bereich am unteren Rand mit eigener Border-Top. Nicht scrollbar (sticky). Typisch: 'Alle anzeigen'-Link, Hilfetext, Aktions-Buttons.
- Danger-Item: Rote Farbe (feedback-danger), eigener Hover-BG.
- Icons: 16px, dekorativ. Shortcut: monospace, rechtsbuendig.
- Group-Label: uppercase, letter-spacing, user-select:none.
- Separator: border-top, horizontale Trennlinie zwischen Gruppen.
- Animation: fnd-dropdown-enter Keyframe, reduced-motion: none.

## Variants
### Placement (`placement`)
Positionierung des Menues relativ zum Trigger — bottom-start (Standard), bottom-end, top-start, top-end. Empfehlung: Floating UI fuer dynamisches Auto-Placement.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| bottom-start | — |  |
| bottom-end | `.nc-dropdown__menu--bottom-end` |  |
| top-start | `.nc-dropdown__menu--top-start` |  |
| top-end | `.nc-dropdown__menu--top-end` |  |

### Selection Mode (`selectionMode`)
Auswahl-Modus: none (Standard, reine Aktionen), single (Radio-Auswahl, nur ein Item aktiv), multiple (Checkbox-Auswahl, mehrere Items aktiv)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| single | `.nc-dropdown--checkable` |  |
| multiple | `.nc-dropdown--checkable` |  |

### Content (`content`)
Inhaltsvariante — plain (nur Items), with-icons (Items mit Icons), grouped (Items in Gruppen mit Label + Separator), with-shortcuts (Items mit Tastaturkuerzel), with-submenu (Items mit Submenu-Indikator), with-footer (permanenter Footer-Bereich)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| plain | — |  |
| with-icons | — |  |
| grouped | — |  |
| with-shortcuts | — |  |
| with-submenu | — |  |
| with-footer | — |  |

### Item Variant (`itemVariant`)
Variante des einzelnen Items — default (neutral), danger (destruktive Aktion)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| danger | `.nc-dropdown__item--danger` |  |

## States
Supported: `default`, `hover`, `active`, `focus`, `disabled`, `checked`

- **hover**: 
- **active**: 
- **focus**: 
- **disabled**: 
- **checked**: 

## CSS Token API
Base classes: `nc-dropdown`

### Container
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dropdown-bg` | — | — |
| `nc-dropdown-border` | — | — |
| `nc-dropdown-border-width` | — | — |
| `nc-dropdown-radius` | — | — |
| `nc-dropdown-shadow` | — | — |
| `nc-dropdown-padding` | — | — |
| `nc-dropdown-min-width` | — | — |
| `nc-dropdown-max-height` | — | — |
| `nc-dropdown-z-index` | — | — |
| `nc-dropdown-animation-duration` | — | — |

### Item
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dropdown-item-height` | — | — |
| `nc-dropdown-item-padding` | — | — |
| `nc-dropdown-item-radius` | — | — |
| `nc-dropdown-item-color` | — | — |
| `nc-dropdown-item-bg-hover` | — | — |
| `nc-dropdown-item-bg-active` | — | — |
| `nc-dropdown-item-color-disabled` | — | — |
| `nc-dropdown-item-icon-size` | — | — |
| `nc-dropdown-item-icon-color` | — | — |
| `nc-dropdown-item-gap` | — | — |
| `nc-dropdown-item-font-size` | — | — |
| `nc-dropdown-item-font-weight` | — | — |

### Danger Item
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dropdown-item-danger-color` | — | — |
| `nc-dropdown-item-danger-bg-hover` | — | — |

### Checkable Items
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dropdown-check-size` | — | — |
| `nc-dropdown-check-color` | — | — |
| `nc-dropdown-check-gap` | — | — |

### Submenu
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dropdown-submenu-indicator-size` | — | — |
| `nc-dropdown-submenu-indicator-color` | — | — |
| `nc-dropdown-submenu-offset` | — | — |

### Footer
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dropdown-footer-padding` | — | — |
| `nc-dropdown-footer-bg` | — | — |
| `nc-dropdown-footer-border-color` | — | — |

### Group Label
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dropdown-group-label-color` | — | — |
| `nc-dropdown-group-label-size` | — | — |
| `nc-dropdown-group-label-weight` | — | — |
| `nc-dropdown-group-label-padding` | — | — |

### Separator
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-dropdown-separator-color` | — | — |
| `nc-dropdown-separator-margin` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-dropdown-menu>` custom element:

```js
class NcDropdownMenu extends HTMLElement {
  static observedAttributes = ['placement', 'selectionMode', 'content', 'itemVariant'];
  // Slots: <slot name="trigger">, <slot name="menu">, <slot name="item">
}
```

---

*Generated from `data/dropdown-menu-recipe.json` by `scripts/generate-component-specs.js`*
