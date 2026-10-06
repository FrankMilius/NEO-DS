# navigation-orchestration Component Spec
> Version 2.0.0 | Status: stable | Layer: organism

Tags: `navigation`, `orchestration`, `composition`, `governance`

## Anatomy
Root element: `.nc-header`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| shell-slot | `.nc-shell__navbar` | Yes | — |
| header | `.nc-header` | Yes | — |
| nav-inner | `.nc-nav__inner` | Yes | — |
| brand | `.nc-brand` | Yes | — |
| menu | `.nc-navigation-menu` | No | — |
| menu-list | `.nc-navigation-menu__list` | No | — |
| menu-item | `.nc-navigation-menu__item` | No | — |
| menu-trigger | `.nc-navigation-menu__trigger` | No | — |
| nav-link | `.nc-nav__link` | No | — |
| nav-icon | `.nc-nav__icon` | No | — |
| nav-label | `.nc-nav__label` | No | — |
| nav-badge | `.nc-nav__badge` | No | — |
| mobile-toggle | `.nc-mobile-toggle` | No | — |
| actions | `.nc-nav__actions` | No | — |
| tools | `.nc-tools` | No | — |

### DOM Notes
- Ebene 1 — Shell: .nc-shell__navbar Slot reserviert die Grid-Row. nc-shell-z-navbar bestimmt den Z-Index.
- Ebene 2 — Navigation: .nc-header fuellt den Shell-Slot. Sticky, Blur, Emphasis, Mobile-Toggle.
- Ebene 3 — NavigationMenu: .nc-navigation-menu sitzt in .nc-nav__inner. Steuert Link-Verteilung und Dropdowns.
- Ebene 4 — Nav-Molecules: .nc-nav__link wird als Item im Menu gerendert. Shared Hover/Active Tokens.
- Ebene 5 — Nav-Atoms: .nc-nav__icon + .nc-nav__label werden innerhalb der Links genutzt. Konsistente 24px Icons.
- Mobile: Unterhalb lg wird .nc-navigation-menu ausgeblendet, .nc-mobile-toggle eingeblendet → Shell Drawer.
- Mobil-Lage unabhaengig vom Fenster per .nc-header--mobile (Entscheidung 02.10.2026); .is-mobile-open zeigt .nc-mobile-panel.

## Variants
### Viewport (`viewport`)
Responsive Modus — desktop (Navigation-Menu sichtbar), mobile (Hamburger → Drawer)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| desktop | — |  |
| mobile | — |  |

## States
Supported: `default`, `scrolled`, `hidden`, `mobile-open`

- **scrolled**: 
- **hidden**: 
- **mobile-open**: 

## CSS Token API
Base classes: `nc-header`

### Composition Map
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-nav-orch-shell-z-index` | — | `--mod-nav-orch-shell-z-index` |
| `--nc-nav-orch-height` | — | `--mod-nav-orch-height` |
| `--nc-nav-orch-gap` | — | `--mod-nav-orch-gap` |
| `--nc-nav-orch-icon-size` | — | `--mod-nav-orch-icon-size` |
| `--nc-nav-orch-link-hover-bg` | — | `--mod-nav-orch-link-hover-bg` |
| `--nc-nav-orch-link-active-border` | — | `--mod-nav-orch-link-active-border` |
| `--nc-nav-orch-viewport-shadow` | — | `--mod-nav-orch-viewport-shadow` |

### Token Sync Rules
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-nav-orch-sync-height` | — | `--mod-nav-orch-sync-height` |
| `--nc-nav-orch-sync-interaction` | — | `--mod-nav-orch-sync-interaction` |
| `--nc-nav-orch-sync-elevation` | — | `--mod-nav-orch-sync-elevation` |
| `--nc-nav-orch-sync-spacing` | — | `--mod-nav-orch-sync-spacing` |

### Mobile Orchestration
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-nav-orch-mobile-breakpoint` | — | `--mod-nav-orch-mobile-breakpoint` |
| `--nc-nav-orch-mobile-drawer-width` | — | `--mod-nav-orch-mobile-drawer-width` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard
- hasSkipLink

## Dependencies
`header`, `navigation`, `shell`

## Web Components Mapping
Derived from anatomy for potential `<nc-navigation-orchestration>` custom element:

```js
class NcNavigationOrchestration extends HTMLElement {
  static observedAttributes = ['viewport'];
  // Slots: <slot name="shell-slot">, <slot name="header">, <slot name="nav-inner">, <slot name="brand">
}
```

---

*Generated from `data/navigation-orchestration-recipe.json` by `scripts/generate-component-specs.js`*
