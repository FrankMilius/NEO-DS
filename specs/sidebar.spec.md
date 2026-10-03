# sidebar Component Spec
> Version 1.1.0 | Status: stable | Layer: organism

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
- Collapsed: width-collapsed (56px), Labels/Badges/Chevrons/Group-Labels und Unterpunkte (__submenu-items) hidden, Items zentriert; der Untermenue-Knopf bleibt.
- Mobile (<md): fixed, translateX(-100%), --open: translateX(0). Backdrop dahinter. --overlay (+ .nc-sidebar-backdrop--overlay) erzwingt diese Lage auf jeder Fensterbreite. Geschlossen ist die Overlay-Sidebar visibility: hidden (laeuft in der Transition mit) und damit auch ohne JS aus der Tab-Folge (Entscheidung 03.10.2026, nav-a11y).
- Fokus-Falle (Entscheidung 03.10.2026, sidebar-falle): Die offene Overlay-Sidebar mit Backdrop verhaelt sich wie ein Dialog — Fokus beim Oeffnen in die Sidebar (aria-current, sonst erstes Element), Tab/Shift+Tab bleiben drin, Escape und Klick auf den Backdrop schliessen, Geschwister der Sidebar und ihrer Vorfahren (ausser dem Backdrop) werden inert; beim Schliessen entfernt neo-behaviors nur das inert, das es selbst gesetzt hat, und gibt den Fokus an den Ausloeser zurueck. Desktop-Lage (kein Overlay): keine Falle.

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
| `--nc-sidebar-width` | — | `--mod-sidebar-width` |
| `--nc-sidebar-width-collapsed` | — | `--mod-sidebar-width-collapsed` |
| `--nc-sidebar-bg` | — | `--mod-sidebar-bg` |
| `--nc-sidebar-border` | — | `--mod-sidebar-border` |
| `--nc-sidebar-border-width` | — | `--mod-sidebar-border-width` |
| `--nc-sidebar-padding` | — | `--mod-sidebar-padding` |
| `--nc-sidebar-z-index` | — | `--mod-sidebar-z-index` |

### Item
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-sidebar-item-height` | — | `--mod-sidebar-item-height` |
| `--nc-sidebar-item-padding` | — | `--mod-sidebar-item-padding` |
| `--nc-sidebar-item-radius` | — | `--mod-sidebar-item-radius` |
| `--nc-sidebar-item-gap` | — | `--mod-sidebar-item-gap` |
| `--nc-sidebar-item-color` | — | `--mod-sidebar-item-color` |
| `--nc-sidebar-item-color-hover` | — | `--mod-sidebar-item-color-hover` |
| `--nc-sidebar-item-bg-hover` | — | `--mod-sidebar-item-bg-hover` |
| `--nc-sidebar-item-bg-active` | — | `--mod-sidebar-item-bg-active` |
| `--nc-sidebar-item-color-active` | — | `--mod-sidebar-item-color-active` |
| `--nc-sidebar-item-font-size` | — | `--mod-sidebar-item-font-size` |
| `--nc-sidebar-item-font-weight` | — | `--mod-sidebar-item-font-weight` |
| `--nc-sidebar-item-icon-size` | — | `--mod-sidebar-item-icon-size` |

### Group
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-sidebar-group-label-color` | — | `--mod-sidebar-group-label-color` |
| `--nc-sidebar-group-label-size` | — | `--mod-sidebar-group-label-size` |
| `--nc-sidebar-group-label-weight` | — | `--mod-sidebar-group-label-weight` |
| `--nc-sidebar-group-label-padding` | — | `--mod-sidebar-group-label-padding` |
| `--nc-sidebar-group-gap` | — | `--mod-sidebar-group-gap` |

### Nested
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-sidebar-nested-indent` | — | `--mod-sidebar-nested-indent` |

### Badge
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-sidebar-badge-size` | — | `--mod-sidebar-badge-size` |
| `--nc-sidebar-badge-font-size` | — | `--mod-sidebar-badge-font-size` |
| `--nc-sidebar-badge-bg` | — | `--mod-sidebar-badge-bg` |
| `--nc-sidebar-badge-color` | — | `--mod-sidebar-badge-color` |
| `--nc-sidebar-badge-radius` | — | `--mod-sidebar-badge-radius` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | toggle | Auf einem Untermenue-Knopf (button.nc-sidebar__item[aria-controls]): klappt auf/zu. Auf dem Einklapp-Knopf (.nc-sidebar__toggle): klappt die Sidebar ein/aus. Auf Links: folgt dem Link (nativ). |
| `Space` | toggle | Auf Knoepfen wie Enter. |
| `Escape` | close-mobile | Mobil-Lage (.nc-sidebar--open): schliesst die Sidebar, gibt den inert gesetzten Rest der Seite frei, Fokus zurueck auf den oeffnenden Knopf. |
| `Tab` | trap-focus | Offene Overlay-Sidebar mit Backdrop: Fokus bleibt in der Sidebar (vom letzten zum ersten Element). Sonst normaler Tab-Fluss; die geschlossene Overlay-Sidebar ist nicht in der Tab-Folge. |
| `Shift+Tab` | trap-focus-reverse | Offene Overlay-Sidebar mit Backdrop: vom ersten zum letzten Element der Sidebar. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `sidebar-submenu-toggle` | Yes | `{"value":"string","open":"boolean"}` |
| `sidebar-collapse` | Yes | `{"collapsed":"boolean"}` |
| `sidebar-toggle` | Yes | `{"open":"boolean","reason":"string"}` |

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
