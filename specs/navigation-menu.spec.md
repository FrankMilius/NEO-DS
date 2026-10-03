# navigation-menu Component Spec
> Version 3.0.0 | Status: stable | Layer: organism

Tags: `navigation`, `interactive`, `dropdown`, `mega-menu`

## Anatomy
Root element: `.nc-navigation-menu`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| list | `.nc-navigation-menu__list` | Yes | — |
| item | `.nc-navigation-menu__item` | Yes | — |
| trigger | `.nc-navigation-menu__trigger` | No | — |
| content | `.nc-navigation-menu__content` | No | — |
| link | `.nc-navigation-menu__link` | No | — |
| featured | `.nc-navigation-menu__featured` | No | — |
| callout | `.nc-navigation-menu__callout` | No | — |
| indicator | `.nc-navigation-menu__indicator` | No | — |

### DOM Notes
- WAI-ARIA Disclosure-Navigation: nav[aria-label] > ul > li > button[aria-expanded][aria-controls] + Panel (.nc-navigation-menu__content#id) bzw. a.nc-navigation-menu__link--top.
- Keine Rollen menubar/menu/menuitem/none, kein roving tabindex — jeder Top-Level-Eintrag ist eine Tab-Station.
- Zu: Panel mit [hidden], aria-expanded='false'. Offen: aria-expanded='true', Panel ohne [hidden]; das SCSS zeigt es unter der Leiste in voller Breite der Wurzel.
- Aktuelle Seite: aria-current='page' am Link; enthaelt ein Panel die aktuelle Seite, zeigt sein Ausloeser den Unterstrich dauerhaft (alternativ data-current='true').
- Indicator: dekorativer Unterstrich/Pfeil, data-state='visible|hidden', Lage per Custom Property --_indicator-left/--_indicator-width.
- Mega-Menu: --mega Modifier am Panel, Grid mit konfigurierbaren Spalten (default 3).
- Featured Item: Grafischer Highlight-Slot, volle Breite im Grid (grid-column: 1 / -1).
- Callout: Highlight-Bereich (linke Spalte, Gradient-BG) im Layout two-col.
- Trigger-Mode: data-trigger='hover' (Desktop) vs 'click' (Touch/komplexe Menus).
- Veraltet (Recipe 2.x, website/js/site.js): Menubar-Rollen, data-state='open|closed', .nc-navigation-menu__viewport(-wrapper) mit Kopie des Panels — das SCSS liest es weiter.

## Variants
### Layout (`layout`)
Content-Layout — default (einfache Liste), two-col (2 Spalten mit Callout), mega (Grid-Layout)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| two-col | `.nc-navigation-menu__content--two-col` |  |
| mega | `.nc-navigation-menu__content--mega` |  |

### Trigger Mode (`trigger`)
Ausloeser — hover (Desktop, schnell), click (Touch, sicher fuer komplexe Menus)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| hover | — |  |
| click | — |  |

## States
Supported: `default`, `hover`, `focus`, `open`

- **open**: 
- **hover**: 

## CSS Token API
Base classes: `nc-navigation-menu`

### List / Items
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-nav-menu-item-gap` | — | `--mod-nav-menu-item-gap` |
| `--nc-nav-menu-item-margin` | — | `--mod-nav-menu-item-margin` |

### Trigger
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-nav-menu-trigger-color` | — | `--mod-nav-menu-trigger-color` |
| `--nc-nav-menu-trigger-hover-bg` | — | `--mod-nav-menu-trigger-hover-bg` |
| `--nc-nav-menu-trigger-active-bg` | — | `--mod-nav-menu-trigger-active-bg` |
| `--nc-nav-menu-trigger-radius` | — | `--mod-nav-menu-trigger-radius` |
| `--nc-nav-menu-trigger-font-size` | — | `--mod-nav-menu-trigger-font-size` |
| `--nc-nav-menu-trigger-font-weight` | — | `--mod-nav-menu-trigger-font-weight` |
| `--nc-nav-menu-trigger-padding-x` | — | `--mod-nav-menu-trigger-padding-x` |
| `--nc-nav-menu-trigger-padding-y` | — | `--mod-nav-menu-trigger-padding-y` |

### Viewport
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-nav-menu-viewport-bg` | — | `--mod-nav-menu-viewport-bg` |
| `--nc-nav-menu-viewport-border` | — | `--mod-nav-menu-viewport-border` |
| `--nc-nav-menu-viewport-radius` | — | `--mod-nav-menu-viewport-radius` |
| `--nc-nav-menu-viewport-shadow` | — | `--mod-nav-menu-viewport-shadow` |
| `--nc-nav-menu-viewport-width` | — | `--mod-nav-menu-viewport-width` |
| `--nc-nav-menu-content-padding` | — | `--mod-nav-menu-content-padding` |
| `--nc-nav-menu-content-width` | — | `--mod-nav-menu-content-width` |

### Link
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-nav-menu-link-radius` | — | `--mod-nav-menu-link-radius` |
| `--nc-nav-menu-link-hover-bg` | — | `--mod-nav-menu-link-hover-bg` |
| `--nc-nav-menu-link-padding` | — | `--mod-nav-menu-link-padding` |
| `--nc-nav-menu-content-padding` | — | `--mod-nav-menu-content-padding` |
| `--nc-nav-menu-content-width` | — | `--mod-nav-menu-content-width` |

### Indicator
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-nav-menu-indicator-color` | — | `--mod-nav-menu-indicator-color` |
| `--nc-nav-menu-indicator-height` | — | `--mod-nav-menu-indicator-height` |

### Mega Menu
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-nav-menu-mega-columns` | — | `--mod-nav-menu-mega-columns` |
| `--nc-nav-menu-mega-gap` | — | `--mod-nav-menu-mega-gap` |
| `--nc-nav-menu-featured-bg` | — | `--mod-nav-menu-featured-bg` |
| `--nc-nav-menu-featured-radius` | — | `--mod-nav-menu-featured-radius` |
| `--nc-nav-menu-featured-padding` | — | `--mod-nav-menu-featured-padding` |

### Motion
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-nav-menu-duration` | — | `--mod-nav-menu-duration` |
| `--nc-nav-menu-ease` | — | `--mod-nav-menu-ease` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | sequential-focus | Durch alle Links und Ausloeser der obersten Ebene (jeder eine Tab-Station), vom offenen Ausloeser in sein Panel. Verlaesst der Fokus das offene Item oder das Menue, schliesst das Panel. |
| `Enter` | toggle | Auf einem Ausloeser: oeffnet bzw. schliesst sein Panel (nativer Klick), der Fokus bleibt; ein anderes offenes Panel schliesst. Auf Links: folgt dem Link. |
| `Space` | toggle | Auf einem Ausloeser wie Enter. |
| `Escape` | close | Schliesst das offene Panel, Fokus auf dessen Ausloeser (vom Ausloeser oder aus dem Panel). |
| `ArrowRight` | focus-next-top-item | Optional (APG): naechster Eintrag der obersten Ebene (rundum). Das Panel bleibt, wie es ist — verlaesst der Fokus das offene Item, schliesst es. |
| `ArrowLeft` | focus-prev-top-item | Optional: wie ArrowRight, rueckwaerts. |
| `ArrowDown` | open-or-focus-next | Optional: auf einem Ausloeser oeffnet es das Panel und fokussiert den ersten Link darin; im Panel naechster Link (rundum). |
| `ArrowUp` | focus-prev | Optional: im Panel vorheriger Link (rundum). |
| `Home` | focus-first | Optional: erster Eintrag der obersten Ebene bzw. erster Link im Panel. |
| `End` | focus-last | Optional: letzter Eintrag der obersten Ebene bzw. letzter Link im Panel. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `navigation-menu-change` | Yes | `{"value":"string","previousValue":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Dependencies
`navigation`

## Web Components Mapping
Derived from anatomy for potential `<nc-navigation-menu>` custom element:

```js
class NcNavigationMenu extends HTMLElement {
  static observedAttributes = ['layout', 'trigger'];
  // Slots: <slot name="list">, <slot name="item">
}
```

---

*Generated from `data/navigation-menu-recipe.json` by `scripts/generate-component-specs.js`*
