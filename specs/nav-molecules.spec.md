# nav-molecules Component Spec
> Version 2.0.0 | Status: stable | Layer: molecule

Tags: `navigation`, `interactive`

## Anatomy
Root element: `.nc-nav__link`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| nav-link | `.nc-nav__link` | Yes | — |
| nav-toggle | `.nc-nav__toggle` | No | — |
| mobile-toggle | `.nc-mobile-toggle` | No | — |
| mobile-panel | `.nc-mobile-panel` | No | — |
| lang-toggle | `.nc-lang-toggle` | No | — |
| search-panel | `.nc-search-panel` | No | — |

### DOM Notes
- Nav-Link: inline-flex, gap, padding, radius — Hover: BG-Wechsel + Textfarbe. Active: border-bottom accent.
- Shared Interaction: Hover-BG und Active-Underline werden von navigation-menu__trigger wiederverwendet.
- Mobile Toggle: Hamburger-Icon (3 Balken via box-shadow). Steuert .nc-mobile-panel Sichtbarkeit.
- Mobile Panel: Vertikal gestapelte Links. Sichtbar via .nc-header.is-mobile-open.
- Lang Toggle: Segmented Control fuer Sprachen. Active via .is-active (inverse colors).
- Search Panel: Full-Width Overlay — Search-Component (06-molecules/_search.scss) nutzen fuer fortgeschrittene Suche.

## Variants
### Element (`element`)
Nav-Molekuel-Typ — link (Icon+Label+Interaktion), toggle (Hamburger), mobile (Dropdown), lang (Sprachumschalter)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| link | — |  |
| toggle | — |  |
| mobile | — |  |
| lang | — |  |

## States
Supported: `default`, `hover`, `active`, `focus`

- **hover**: 
- **active**: 
- **focus**: 

## CSS Token API
Base classes: `nc-nav__link`

### Nav Link
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-nav-mol-link-gap` | — | `--mod-nav-mol-link-gap` |
| `--nc-nav-mol-link-padding-x` | — | `--mod-nav-mol-link-padding-x` |
| `--nc-nav-mol-link-padding-y` | — | `--mod-nav-mol-link-padding-y` |
| `--nc-nav-mol-link-radius` | — | `--mod-nav-mol-link-radius` |
| `--nc-nav-mol-link-color` | — | `--mod-nav-mol-link-color` |
| `--nc-nav-mol-link-hover-bg` | — | `--mod-nav-mol-link-hover-bg` |
| `--nc-nav-mol-link-hover-color` | — | `--mod-nav-mol-link-hover-color` |
| `--nc-nav-mol-link-active-weight` | — | `--mod-nav-mol-link-active-weight` |
| `--nc-nav-mol-link-active-border` | — | `--mod-nav-mol-link-active-border` |
| `--nc-nav-mol-link-active-width` | — | `--mod-nav-mol-link-active-width` |

### Mobile Toggle
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-nav-mol-toggle-size` | — | `--mod-nav-mol-toggle-size` |
| `--nc-nav-mol-toggle-bar-height` | — | `--mod-nav-mol-toggle-bar-height` |
| `--nc-nav-mol-toggle-bar-gap` | — | `--mod-nav-mol-toggle-bar-gap` |
| `--nc-nav-mol-toggle-bar-radius` | — | `--mod-nav-mol-toggle-bar-radius` |
| `--nc-nav-mol-toggle-bar-color` | — | `--mod-nav-mol-toggle-bar-color` |

### Mobile Panel
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-nav-mol-mobile-bg` | — | `--mod-nav-mol-mobile-bg` |
| `--nc-nav-mol-mobile-border` | — | `--mod-nav-mol-mobile-border` |
| `--nc-nav-mol-mobile-padding` | — | `--mod-nav-mol-mobile-padding` |
| `--nc-nav-mol-mobile-gap` | — | `--mod-nav-mol-mobile-gap` |
| `--nc-nav-mol-mobile-link-padding` | — | `--mod-nav-mol-mobile-link-padding` |
| `--nc-nav-mol-mobile-link-border` | — | `--mod-nav-mol-mobile-link-border` |

### Lang Toggle
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-nav-mol-lang-bg` | — | `--mod-nav-mol-lang-bg` |
| `--nc-nav-mol-lang-radius` | — | `--mod-nav-mol-lang-radius` |
| `--nc-nav-mol-lang-padding` | — | `--mod-nav-mol-lang-padding` |
| `--nc-nav-mol-lang-active-bg` | — | `--mod-nav-mol-lang-active-bg` |
| `--nc-nav-mol-lang-active-color` | — | `--mod-nav-mol-lang-active-color` |
| `--nc-nav-mol-lang-active-radius` | — | `--mod-nav-mol-lang-active-radius` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Dependencies
`header`, `search`

## Web Components Mapping
Derived from anatomy for potential `<nc-nav-molecules>` custom element:

```js
class NcNavMolecules extends HTMLElement {
  static observedAttributes = ['element'];
  // Slots: <slot name="nav-link">
}
```

---

*Generated from `data/nav-molecules-recipe.json` by `scripts/generate-component-specs.js`*
