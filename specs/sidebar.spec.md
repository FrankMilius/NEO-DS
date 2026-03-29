# sidebar Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `navigation`, `layout`, `interactive`

## Anatomy
Root element: `.nc-sidebar`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| header | `.nc-sidebar__header` | No | — |
| logo | `.nc-sidebar__logo` | No | — |
| toggle | `.nc-sidebar__toggle` | No | — |
| nav | `.nc-sidebar__nav` | Yes | — |
| group | `.nc-sidebar__group` | No | — |
| group-label | `.nc-sidebar__group-label` | No | — |
| item | `.nc-sidebar__item` | Yes | — |
| item-icon | `.nc-sidebar__item-icon` | No | — |
| item-label | `.nc-sidebar__item-label` | Yes | — |
| item-badge | `.nc-sidebar__item-badge` | No | — |
| item-chevron | `.nc-sidebar__item-chevron` | No | — |
| submenu | `.nc-sidebar__submenu` | No | — |
| footer | `.nc-sidebar__footer` | No | — |

### DOM Notes
- Root: <nav aria-label='Seitennavigation'>. Flex-column, volle Hoehe, border-right.
- Header: Logo + Collapse-Toggle. Logo: <a> mit Icon + Text.
- Toggle: 24px Button, steuert Collapsed-State (JS).
- Nav: flex-column, flex:1, enthaelt Groups mit Items.
- Group: flex-column mit gap. Group-Label: uppercase, letter-spacing, user-select:none.
- Item: <a> fuer Navigation, <button> fuer Sub-Menu-Toggle. Flex-row mit Icon + Label + Badge + Chevron.
- Item--active / aria-current='page': active-BG + active-Color (interactive-default).
- Badge: Zaehler (z.B. ungelesene Nachrichten), danger-BG, radius-full.
- Chevron: 16px, rotiert 90° bei aria-expanded='true'.
- Submenu: verschachtelte Items, padding-left: nested-indent. hidden-Attribut.
- Footer: margin-top:auto, border-top. Wird ans Ende gedrueckt.
- Collapsed: width-collapsed (56px), Labels/Badges/Chevrons/Group-Labels hidden, Items zentriert.
- Mobile (<md): fixed, translateX(-100%), --open: translateX(0). Backdrop dahinter.

## Variants
### Variant (`variant`)
Variante — expanded (voll ausgeklappt), collapsed (nur Icons)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| expanded | — |  |
| collapsed | `.nc-sidebar--collapsed` |  |

### Content (`content`)
Inhaltsvariante — flat (nur Items), grouped (Items in Gruppen), nested (Items mit Sub-Menus), with-badges (Items mit Zaehler-Badges), full (Header + Groups + Nested + Badges + Footer)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| flat | — |  |
| grouped | — |  |
| nested | — |  |
| with-badges | — |  |
| full | — |  |

## States
Supported: `default`, `hover`, `active`, `focus`

- **hover**: 
- **active**: 
- **focus**: 

## CSS Token API
Base classes: `nc-sidebar`

### Container
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-sidebar-width` | — | — |
| `nc-sidebar-width-collapsed` | — | — |
| `nc-sidebar-bg` | — | — |
| `nc-sidebar-border` | — | — |
| `nc-sidebar-border-width` | — | — |
| `nc-sidebar-padding` | — | — |
| `nc-sidebar-z-index` | — | — |

### Item
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-sidebar-item-height` | — | — |
| `nc-sidebar-item-padding` | — | — |
| `nc-sidebar-item-radius` | — | — |
| `nc-sidebar-item-gap` | — | — |
| `nc-sidebar-item-color` | — | — |
| `nc-sidebar-item-color-hover` | — | — |
| `nc-sidebar-item-bg-hover` | — | — |
| `nc-sidebar-item-bg-active` | — | — |
| `nc-sidebar-item-color-active` | — | — |
| `nc-sidebar-item-font-size` | — | — |
| `nc-sidebar-item-font-weight` | — | — |
| `nc-sidebar-item-icon-size` | — | — |

### Group
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-sidebar-group-label-color` | — | — |
| `nc-sidebar-group-label-size` | — | — |
| `nc-sidebar-group-label-weight` | — | — |
| `nc-sidebar-group-label-padding` | — | — |
| `nc-sidebar-group-gap` | — | — |

### Nested
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-sidebar-nested-indent` | — | — |

### Badge
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-sidebar-badge-size` | — | — |
| `nc-sidebar-badge-font-size` | — | — |
| `nc-sidebar-badge-bg` | — | — |
| `nc-sidebar-badge-color` | — | — |
| `nc-sidebar-badge-radius` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-sidebar>` custom element:

```js
class NcSidebar extends HTMLElement {
  static observedAttributes = ['variant', 'content'];
  // Slots: <slot name="nav">, <slot name="item">, <slot name="item-label">
}
```

---

*Generated from `data/sidebar-recipe.json` by `scripts/generate-component-specs.js`*
