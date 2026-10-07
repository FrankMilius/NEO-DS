# bento-grid Component Spec
> Version 1.2.0 | Status: stable | Layer: organism

Tags: `display`, `content`, `grid`, `interactive`

## Anatomy
Root element: `.nc-bento-grid`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| cell | `.nc-bento-grid__cell` | Yes | Einzelne Bento-Zelle. Als <article> oder verlinkt als <a>. Modifier --lg = prominente Feature-Zelle (Span 2x2); --wide = breite Zelle (Span 2x1) zum lueckenlosen Auffuellen der unteren Reihe. |
| icon | `.nc-bento-grid__icon` | No | Icon-Chip oben in der Zelle. Rotiert leicht bei Hover. |
| title | `.nc-bento-grid__title` | Yes | Titel der Zelle (h3). |
| text | `.nc-bento-grid__text` | No | Beschreibungstext der Zelle. |
| badge | `.nc-bento-grid__badge` | No | Kleines Badge oben rechts (z.B. 'GPL / MIT'). |
| mesh | `.nc-bento-grid__mesh` | No | Dekorativer animierter Mesh-Gradient, typischerweise in der grossen Zelle. aria-hidden. |
| section | `.nc-bento-section` | No | Sektion des Website-Blocks mit eigenem Polster oben/unten (--fnd-spacing-10). Steht AUSSEN. |

### DOM Notes
- Root .nc-bento-grid: CSS Grid, repeat(--nc-bento-grid-columns, 1fr), grid-auto-rows minmax(--nc-bento-grid-cell-min, auto).
- Feature-Zelle: .nc-bento-grid__cell--lg mit grid-column:span 2 und grid-row:span 2.
- Hover/Focus-visible: Zelle hebt sich (translateY -6px), Border auf --nc-bento-grid-accent, radialer Glow (::after) fadet ein, Icon rotiert.
- Mesh-Layer (.nc-bento-grid__mesh): position:absolute, conic-gradient, blur, dauerhafte Rotation; rein dekorativ (aria-hidden).
- Verlinkte Zelle: a.nc-bento-grid__cell, text-decoration:none.
- Scroll-Reveal: data-animation='reveal' am Root, .is-revealed schaltet sichtbar.
- Responsive: 860px -> 2 Spalten (lg-Zelle behaelt span 2, row auto), 560px -> 1 Spalte (lg-Zelle span auto).
- prefers-reduced-motion: keine Transition/Animation, Inhalte sofort sichtbar.

## Variants
### Columns (`columns`)
Anzahl der Raster-Spalten auf Desktop

| Value | CSS Modifier | Default |
| --- | --- | --- |
| 3 | `.nc-bento-grid--cols-3` |  |
| 4 | — |  |

### Animation (`animation`)
Scroll-basierte Einblendanimation

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| reveal | — |  |

## States
Supported: `default`, `hover`, `focus`

## CSS Token API
Base classes: `nc-bento-grid`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-bento-grid-gap` | — | `--mod-bento-grid-gap` |
| `--nc-bento-grid-columns` | — | `--mod-bento-grid-columns` |
| `--nc-bento-grid-cell-min` | — | `--mod-bento-grid-cell-min` |
| `--nc-bento-grid-padding` | — | `--mod-bento-grid-padding` |
| `--nc-bento-grid-radius` | — | `--mod-bento-grid-radius` |

### Surface & Border
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-bento-grid-surface` | — | `--mod-bento-grid-surface` |
| `--nc-bento-grid-border` | — | `--mod-bento-grid-border` |
| `--nc-bento-grid-border-hover` | — | `--mod-bento-grid-border-hover` |

### Accent & Text
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-bento-grid-accent` | — | `--mod-bento-grid-accent` |
| `--nc-bento-grid-title` | — | `--mod-bento-grid-title` |
| `--nc-bento-grid-text` | — | `--mod-bento-grid-text` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-bento-grid>` custom element:

```js
class NcBentoGrid extends HTMLElement {
  static observedAttributes = ['columns', 'animation'];
  // Slots: <slot name="cell">, <slot name="title">
}
```

---

*Generated from `data/bento-grid-recipe.json` by `scripts/generate-component-specs.js`*
