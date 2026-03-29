# navigation Component Spec
> Version 2.0.0 | Status: stable | Layer: organism

Tags: `navigation`, `interactive`, `layout`, `header`

## Anatomy
Root element: `.nc-header`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| nav | `.nc-nav` | Yes | — |
| inner | `.nc-nav__inner` | Yes | — |
| brand | `.nc-brand` | Yes | — |
| list | `.nc-nav__list` | No | — |
| actions | `.nc-nav__actions` | No | — |
| navigation-menu | `.nc-navigation-menu` | No | — |

### DOM Notes
- nc-header: sticky top, backdrop-filter blur, bg-base 90% opacity, border-bottom.
- nc-nav: full-width, font-size base. Inner: flex, space-between, align-items center, gap.
- Transparent: Kein Hintergrund, weisse Schrift — ideal ueber Hero-Images auf Landingpages.
- Solid: Voller Hintergrund ohne Blur — besser fuer Performance und einfache Layouts.
- Intelligent Sticky: is-hidden beim Runterscrollen (mehr Content-Platz), is-scrolled beim Hochscrollen.
- Alignment: --align-center zentriert Links (Landingpage), --align-right rechtsbuendig.
- Mobile: Hamburger-Toggle oeffnet nc-drawer mit vertikal gestapelten Links.

## Variants
### Emphasis (`emphasis`)
Visueller Modus — default (Blur 90%), transparent (Hero-Overlay), solid (voller Hintergrund)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| transparent | `.nc-header--transparent` |  |
| solid | `.nc-header--solid` |  |

### Alignment (`alignment`)
Ausrichtung der Links — start (links), center (zentriert), right (rechts)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| start | — |  |
| center | `.nc-nav--align-center` |  |
| right | `.nc-nav--align-right` |  |

## States
Supported: `default`, `scrolled`, `hidden`

- **scrolled**: 
- **hidden**: 

## CSS Token API
Base classes: `nc-header`

### Header
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-nav-height` | — | — |
| `nc-nav-bg` | — | — |
| `nc-nav-bg-solid` | — | — |
| `nc-nav-border` | — | — |
| `nc-nav-border-width` | — | — |
| `nc-nav-blur` | — | — |
| `nc-nav-z-index` | — | — |
| `nc-nav-padding-block` | — | — |
| `nc-nav-padding-inline` | — | — |
| `nc-nav-gap` | — | — |
| `nc-nav-sticky-shadow` | — | — |

### Brand / Logo
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-nav-brand-size` | — | — |
| `nc-nav-brand-weight` | — | — |
| `nc-nav-brand-color` | — | — |
| `nc-nav-brand-gap` | — | — |
| `nc-nav-brand-logo-height` | — | — |
| `nc-nav-brand-letter-spacing` | — | — |

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-nav-justify-content` | — | — |
| `nc-nav-align-items` | — | — |

### Transparent (Hero)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-nav-transparent-bg` | — | — |
| `nc-nav-transparent-border` | — | — |
| `nc-nav-transparent-color` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Dependencies
`header`

## Web Components Mapping
Derived from anatomy for potential `<nc-navigation>` custom element:

```js
class NcNavigation extends HTMLElement {
  static observedAttributes = ['emphasis', 'alignment'];
  // Slots: <slot name="nav">, <slot name="inner">, <slot name="brand">
}
```

---

*Generated from `data/navigation-recipe.json` by `scripts/generate-component-specs.js`*
