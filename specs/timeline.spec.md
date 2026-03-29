# timeline Component Spec
> Version 1.0.0 | Status: stable | Layer: molecule

Tags: `layout`, `content`, `chronological`

## Anatomy
Root element: `.nc-timeline`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| item | `.nc-timeline__item` | Yes | — |
| node | `.nc-timeline__node` | Yes | — |
| content | `.nc-timeline__content` | Yes | — |
| time | `.nc-timeline__time` | No | — |
| title | `.nc-timeline__title` | Yes | — |
| description | `.nc-timeline__description` | No | — |

### DOM Notes
- <ol> fuer chronologisch geordnete Eintraege — semantische Reihenfolge.
- Item: CSS-Grid (auto + 1fr), vertikale Linie via ::before Pseudo-Element.
- Letzes Item: ::before display:none — keine Linie nach unten.
- Node: Kreis auf der Linie (12px default), z-index: base (ueberdeckt Linie).
- Node-Varianten: --active (interactive-default), --success (feedback-success), --danger (feedback-danger).
- Zeitangabe in <time datetime='...'> fuer maschinenlesbare Daten.
- font-variant-numeric: tabular-nums auf __time fuer gleichbreite Ziffern.
- Icon-Variante: Groessere Nodes (32px) mit SVG-Icon, Linie verschoben.
- Connected-Variante: Content bekommt Card-Hintergrund (layer-01 + border + radius).
- Compact-Variante: Kleinere Nodes (8px), weniger Abstand.

## Variants
### Variant (`variant`)
Visuelle Variante — default (kleine Punkte), icon (grosse Nodes mit Icon), connected (Card-Hintergrund), compact (minimal)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| icon | `.nc-timeline--icon` |  |
| connected | `.nc-timeline--connected` |  |
| compact | `.nc-timeline--compact` |  |

### Node Status (`nodeStatus`)
Status des Node-Punktes — default (neutral), active (primaer), success (Erfolg), danger (Fehler)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| active | — |  |
| success | — |  |
| danger | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-timeline`

### Line
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-timeline-line-color` | — | — |
| `nc-timeline-line-width` | — | — |
| `nc-timeline-gap` | — | — |

### Node
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-timeline-node-size` | — | — |
| `nc-timeline-node-bg` | — | — |
| `nc-timeline-node-border` | — | — |
| `nc-timeline-node-border-width` | — | — |
| `nc-timeline-node-radius` | — | — |

### Node Variants
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-timeline-node-active-bg` | — | — |
| `nc-timeline-node-active-border` | — | — |
| `nc-timeline-node-success-bg` | — | — |
| `nc-timeline-node-danger-bg` | — | — |
| `nc-timeline-node-icon-size` | — | — |
| `nc-timeline-node-icon-color` | — | — |

### Content
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-timeline-content-gap` | — | — |
| `nc-timeline-content-padding` | — | — |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-timeline-title-size` | — | — |
| `nc-timeline-title-weight` | — | — |
| `nc-timeline-title-color` | — | — |
| `nc-timeline-desc-size` | — | — |
| `nc-timeline-desc-color` | — | — |
| `nc-timeline-time-size` | — | — |
| `nc-timeline-time-color` | — | — |
| `nc-timeline-time-weight` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName

## Web Components Mapping
Derived from anatomy for potential `<nc-timeline>` custom element:

```js
class NcTimeline extends HTMLElement {
  static observedAttributes = ['variant', 'nodeStatus'];
  // Slots: <slot name="item">, <slot name="node">, <slot name="content">, <slot name="title">
}
```

---

*Generated from `data/timeline-recipe.json` by `scripts/generate-component-specs.js`*
