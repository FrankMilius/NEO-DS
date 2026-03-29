# navigation-menu Component Spec
> Version 2.0.0 | Status: stable | Layer: organism

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
| viewport | `.nc-navigation-menu__viewport` | No | — |

### DOM Notes
- Radix-UI Pattern: nav > ul > li > trigger/content.
- Data-Attributes: [data-state=open|closed] auf Trigger/Content, [data-active] auf Links.
- Viewport: animierter Container fuer Dropdown-Inhalte, teilt Tokens mit Popover.
- Indicator: 2px Unterstrich-Balken mit layout-transition (sanftes Hergleiten statt Springen).
- Mega-Menu: --mega Modifier, Grid mit konfigurierbaren Spalten (default 2).
- Featured Item: Grafischer Highlight-Slot, volle Breite im Grid (grid-column: 1 / -1).
- Callout: Highlight-Bereich im Mega-Menu (linke Spalte, Gradient-BG).
- Trigger-Mode: data-trigger='hover' (Desktop) vs 'click' (Touch/komplexe Menus).

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
| `nc-nav-menu-item-gap` | — | — |
| `nc-nav-menu-item-margin` | — | — |

### Trigger
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-nav-menu-trigger-color` | — | — |
| `nc-nav-menu-trigger-hover-bg` | — | — |
| `nc-nav-menu-trigger-active-bg` | — | — |
| `nc-nav-menu-trigger-radius` | — | — |
| `nc-nav-menu-trigger-font-size` | — | — |
| `nc-nav-menu-trigger-font-weight` | — | — |
| `nc-nav-menu-trigger-padding-x` | — | — |
| `nc-nav-menu-trigger-padding-y` | — | — |

### Viewport
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-nav-menu-viewport-bg` | — | — |
| `nc-nav-menu-viewport-border` | — | — |
| `nc-nav-menu-viewport-radius` | — | — |
| `nc-nav-menu-viewport-shadow` | — | — |
| `nc-nav-menu-viewport-width` | — | — |
| `nc-nav-menu-content-padding` | — | — |
| `nc-nav-menu-content-width` | — | — |

### Link
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-nav-menu-link-radius` | — | — |
| `nc-nav-menu-link-hover-bg` | — | — |
| `nc-nav-menu-link-padding` | — | — |
| `nc-nav-menu-content-padding` | — | — |
| `nc-nav-menu-content-width` | — | — |

### Indicator
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-nav-menu-indicator-color` | — | — |
| `nc-nav-menu-indicator-height` | — | — |

### Mega Menu
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-nav-menu-mega-columns` | — | — |
| `nc-nav-menu-mega-gap` | — | — |
| `nc-nav-menu-featured-bg` | — | — |
| `nc-nav-menu-featured-radius` | — | — |
| `nc-nav-menu-featured-padding` | — | — |

### Motion
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-nav-menu-duration` | — | — |
| `nc-nav-menu-ease` | — | — |

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
