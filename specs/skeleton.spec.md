# skeleton Component Spec
> Version 1.0.0 | Status: stable | Layer: atom

Tags: `static`, `loading`, `placeholder`

## Anatomy
Root element: `.nc-skeleton`

### DOM Notes
- Skeleton ist ein <div class='nc-skeleton'> mit aria-hidden='true'.
- Begleitend ein .u-sr-only Element mit 'Inhalt wird geladen...' fuer Screen Reader.
- Shimmer-Animation via linear-gradient + @keyframes nc-skeleton-shimmer.
- prefers-reduced-motion deaktiviert Shimmer — nur statischer Hintergrund.
- Skeleton-Group (.nc-skeleton-group) stapelt Zeilen vertikal. Letzte Zeile automatisch kuerzer (80%).
- Varianten: --text (default), --heading (60% Breite, md Hoehe), --circle (Kreis), --rect (Flaeche).

## Variants
### Shape (`shape`)
Formvariante — text (Zeile, Standard), heading (breitere Zeile), circle (Kreis), rect (Flaeche)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| text | — |  |
| heading | `.nc-skeleton--heading` |  |
| circle | `.nc-skeleton--circle` |  |
| rect | `.nc-skeleton--rect` |  |

### Size (`size`)
Hoehe — xs (12px), sm (16px, Standard), md (24px), lg (48px)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| xs | `.nc-skeleton--xs` |  |
| sm | — |  |
| md | `.nc-skeleton--md` |  |
| lg | `.nc-skeleton--lg` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-skeleton`

### Appearance
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-skeleton-bg` | — | — |
| `nc-skeleton-shimmer` | — | — |
| `nc-skeleton-radius` | — | — |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-skeleton-duration` | — | — |
| `nc-skeleton-ease` | — | — |

### Sizing
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-skeleton-height-xs` | — | — |
| `nc-skeleton-height-sm` | — | — |
| `nc-skeleton-height-md` | — | — |
| `nc-skeleton-height-lg` | — | — |

### Circle
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-skeleton-radius-circle` | — | — |

## Accessibility
Contrast Target: WCAG AA non-text (3:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-skeleton>` custom element:

```js
class NcSkeleton extends HTMLElement {
  static observedAttributes = ['shape', 'size'];
  // Slots: default
}
```

---

*Generated from `data/skeleton-recipe.json` by `scripts/generate-component-specs.js`*
