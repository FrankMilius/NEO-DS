# breadcrumb Component Spec
> Version 2.0.0 | Status: stable | Layer: molecule

Tags: `interactive`, `navigation`, `wayfinding`

## Anatomy
Root element: `.nc-breadcrumb`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| list | `.nc-breadcrumb__list` | Yes | — |
| item | `.nc-breadcrumb__item` | Yes | — |
| link | `.nc-breadcrumb__link` | Yes | — |
| page | `.nc-breadcrumb__page` | No | — |
| separator | `.nc-breadcrumb__separator` | No | — |
| home-icon | `.nc-breadcrumb__home-icon` | No | — |
| back-icon | `.nc-breadcrumb__back-icon` | No | — |
| ellipsis | `.nc-breadcrumb__ellipsis` | No | — |
| ellipsis-wrap | `.nc-breadcrumb__ellipsis-wrap` | No | — |
| dropdown | `.nc-breadcrumb__dropdown` | No | — |
| dropdown-item | `.nc-breadcrumb__dropdown-item` | No | — |

### DOM Notes
- Wrapper ist <nav class='nc-breadcrumb' aria-label='Breadcrumb'>.
- Liste ist <ol class='nc-breadcrumb__list'> — geordnete Semantik fuer den Pfad.
- Items sind <li class='nc-breadcrumb__item'> mit <a class='nc-breadcrumb__link'> oder <span class='nc-breadcrumb__page'>.
- Letztes Item: <span class='nc-breadcrumb__page' aria-current='page'> — nicht klickbar, font-weight medium.
- Breadcrumb-Labels muessen exakt mit den <h1>-Ueberschriften der Zielseiten uebereinstimmen (kognitive Konsistenz).
- Separator: <span class='nc-breadcrumb__separator' aria-hidden='true'> mit Chevron-SVG oder '/'.
- Separatoren haben reduzierte Opacity (40%) und feste min-width gegen Layout-Shift.
- Home-Icon: <span class='nc-breadcrumb__home-icon'> mit Haus-SVG ersetzt 'Home'-Text. Link braucht aria-label='Home'.
- Smart-Truncation: Home + letzte 2 Items immer sichtbar. Mittlere Ebenen → Ellipsis-Dropdown.
- Ellipsis: <button class='nc-breadcrumb__ellipsis' aria-label='Weitere Seiten anzeigen'> fuer abgekuerzte Pfade.
- Ellipsis-Wrap: <li class='nc-breadcrumb__ellipsis-wrap'> ist Position-Context fuer Dropdown.
- Dropdown: <ul class='nc-breadcrumb__dropdown' role='menu'> nutzt nc-dropdown-* Tokens (gleicher shadow/radius wie Navigation-Menu).
- Dropdown-Item: <a class='nc-breadcrumb__dropdown-item' role='menuitem'> — einzelner Link.
- Ghost: Links wirken wie normaler Text (text-tertiary), erst bei Hover interaktiv. Ideal fuer Artikel-Seiten.
- Back-Link: Mobile-First — nur '← Parent' Link. Spart Platz fuer Content auf schmalen Viewports.
- Back-Link braucht aria-label='Zurueck zu [Parent-Name]' fuer Screen-Reader-Kontext.

## Variants
### Size (`size`)
2 Groessenabstufungen — sm (Admin/Sidebar) / md (Standard, DEFAULT)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-breadcrumb--sm` |  |
| md | — |  |

### Appearance (`appearance`)
Visueller Stil — default (Link-Farbe + Hover-Underline), ghost (dezente Links wie Text, erst bei Hover interaktiv)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| ghost | `.nc-breadcrumb--ghost` |  |

### Variant (`variant`)
Darstellung — full (alle Items sichtbar), truncated (Smart-Truncation mit Ellipsis-Dropdown), back-link (nur Parent-Link fuer Mobile)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| full | — |  |
| truncated | — |  |
| back-link | `.nc-breadcrumb--back-link` |  |

### Content (`content`)
Home-Element — text ('Home' als Wort) oder home-icon (Haus-SVG, platzsparend + international)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| text | — |  |
| home-icon | — |  |

### Separator (`separator`)
Trennzeichen — chevron (SVG, Standard), slash ('/'), dot (Punkt), square (Quadrat), custom (via Token)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| chevron | — |  |
| slash | — |  |
| dot | `.nc-breadcrumb__separator--dot` |  |
| square | `.nc-breadcrumb__separator--square` |  |
| custom | `.nc-breadcrumb__separator--custom` |  |

## States
Supported: `default`, `hover`, `focus`, `open`

- **hover**: 
- **focus**: 
- **open**: 

## CSS Token API
Base classes: `nc-breadcrumb`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-breadcrumb-gap` | — | — |
| `nc-breadcrumb-font-size` | — | — |

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-breadcrumb-color` | — | — |
| `nc-breadcrumb-color-current` | — | — |
| `nc-breadcrumb-color-hover` | — | — |

### Separator
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-breadcrumb-separator-color` | — | — |
| `nc-breadcrumb-separator-opacity` | — | — |
| `nc-breadcrumb-separator-size` | — | — |
| `nc-breadcrumb-separator-min-width` | — | — |
| `nc-breadcrumb-separator-custom` | — | — |

### Size SM
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-breadcrumb-font-size-sm` | — | — |

### Ghost Variant
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-breadcrumb-ghost-color` | — | — |
| `nc-breadcrumb-ghost-color-hover` | — | — |

### Back-Link
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-breadcrumb-back-icon-size` | — | — |
| `nc-breadcrumb-back-gap` | — | — |

### Home Icon
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-breadcrumb-separator-size` | — | — |

### Dropdown
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-breadcrumb-dropdown-min-width` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-breadcrumb>` custom element:

```js
class NcBreadcrumb extends HTMLElement {
  static observedAttributes = ['size', 'appearance', 'variant', 'content', 'separator'];
  // Slots: <slot name="list">, <slot name="item">, <slot name="link">
}
```

---

*Generated from `data/breadcrumb-recipe.json` by `scripts/generate-component-specs.js`*
