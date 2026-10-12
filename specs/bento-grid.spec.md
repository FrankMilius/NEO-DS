# bento-grid Component Spec
> Version 1.4.0 | Status: stable | Layer: organism

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
- Scroll-Reveal: data-animation='reveal' am Root; ausgeblendet nur, solange neo-behaviors einblenden gebunden ist (data-neo-behavior~="einblenden"), .is-revealed schaltet sichtbar (Plan v4, Phase 6b).
- Responsive: 860px -> 2 Spalten (lg-Zelle behaelt span 2, row auto), 560px -> 1 Spalte (lg-Zelle span auto).
- prefers-reduced-motion: keine Transition/Animation, Inhalte sofort sichtbar.
- Video-Kacheln (Plan v4, Phase 3): [data-neo-video] an der Kachel (cover) bzw. am Medium; der Knopf .nc-video-pause (Recipe video) entsteht beim Binden. Liegt die Kachel als Link vor, sitzt der Knopf im Link (Klick folgt dem Link nicht) — Aufloesung mit dem Umzug nach Twig (Phase 7).

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
| `--nc-bento-grid-gap` | — | — |
| `--nc-bento-grid-columns` | — | — |
| `--nc-bento-grid-cell-min` | — | — |
| `--nc-bento-grid-padding` | — | — |
| `--nc-bento-grid-radius` | — | — |

### Surface & Border
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-bento-grid-surface` | — | — |
| `--nc-bento-grid-border` | — | — |
| `--nc-bento-grid-border-hover` | — | — |

### Accent & Text
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-bento-grid-accent` | — | — |
| `--nc-bento-grid-title` | — | — |
| `--nc-bento-grid-text` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | focus-next | Keine eigene Bedienung: verlinkte Glieder in Dokumentreihenfolge. Die Einblendung versteckt nur optisch (opacity); ein noch nicht eingeblendetes Glied wird beim Fokussieren ins Bild gescrollt und dabei eingeblendet. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `einblenden` | Yes | `{"reason":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- 2.2.2: Kachel-Videos und Animations-Kacheln mit eigenem Pause-Knopf (.nc-video-pause, Recipe video).

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
