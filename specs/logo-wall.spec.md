# logo-wall Component Spec
> Version 2.0.0 | Status: stable | Layer: molecule

Tags: `display`, `branding`, `logos`, `partner`, `marquee`

## Anatomy
Root element: `.nc-logo-wall`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| pill | `.nc-logo-pill` | Yes | Einzelnes Logo-Item. Flex-Container mit Border, Radius, Padding. |
| track | `.nc-logo-wall__track` | No | Marquee-Track. Flex-Container mit verdoppeltem Inhalt fuer Endlosschleife. |

### DOM Notes
- Root: display:grid (default), display:flex (marquee/cluster). Gap via Token.
- Pill: Flex-Container, align-items:center, justify-content:center. Border + Radius + Shadow.
- Pill-Img: object-fit:contain. Max-height begrenzt Logo-Groesse.
- Monochrome: CSS filter:grayscale(100%) auf Img. Hover entfernt Filter.
- Marquee: Track mit dupliziertem Inhalt. @keyframes translateX(-50%). pause-on-hover.
- Fade-In: Intersection Observer setzt .is-visible + transition-delay pro Index.
- Cluster: flex-wrap:wrap, justify-content:center. Organisches Layout.
- prefers-reduced-motion: Marquee stoppt. Fade-In ohne Animation.

## Variants
### Layout (`layout`)
Anordnung — grid (responsives Raster), marquee (Endlos-Ticker), cluster (organisch)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| grid | — |  |
| marquee | `.nc-logo-wall--marquee` |  |
| cluster | `.nc-logo-wall--cluster` |  |

### Size (`size`)
Groesse der Logo-Boxen — sm (kompakt/Footer), md (Standard), lg (Feature)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-logo-wall--sm` |  |
| md | — |  |
| lg | `.nc-logo-wall--lg` |  |

### Appearance (`appearance`)
Darstellung — original (Markenfarben), mono (Grayscale, Hover = Farbe)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| original | — |  |
| mono | `.nc-logo-wall--mono` |  |

### Animation (`animation`)
Einblendung — none (sofort), fadein (gestaffeltes Einblenden per Intersection Observer)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| fadein | `.nc-logo-wall--fadein` |  |

## States
Supported: `default`, `hover`

- **hover**: 

## CSS Token API
Base classes: `nc-logo-wall`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-logo-wall-gap` | — | — |
| `nc-logo-wall-padding-block` | — | — |
| `nc-logo-wall-padding-inline` | — | — |
| `nc-logo-wall-grid-min` | — | — |
| `nc-logo-wall-align` | — | — |

### Item (Pill)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-logo-wall-item-bg` | — | — |
| `nc-logo-wall-item-border` | — | — |
| `nc-logo-wall-item-border-width` | — | — |
| `nc-logo-wall-item-radius` | — | — |
| `nc-logo-wall-item-padding` | — | — |
| `nc-logo-wall-item-aspect-ratio` | — | — |
| `nc-logo-wall-item-shadow` | — | — |
| `nc-logo-wall-item-transition` | — | — |

### Sizing
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-logo-wall-item-width-sm` | — | — |
| `nc-logo-wall-item-width-md` | — | — |
| `nc-logo-wall-item-width-lg` | — | — |
| `nc-logo-wall-item-height` | — | — |
| `nc-logo-wall-logo-max-height` | — | — |

### Logo Image
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-logo-wall-logo-opacity` | — | — |
| `nc-logo-wall-logo-filter` | — | — |
| `nc-logo-wall-logo-filter-hover` | — | — |
| `nc-logo-wall-logo-opacity-hover` | — | — |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-logo-wall-font-size` | — | — |
| `nc-logo-wall-font-weight` | — | — |
| `nc-logo-wall-color` | — | — |

### Marquee
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-logo-wall-marquee-speed` | — | — |
| `nc-logo-wall-marquee-gap` | — | — |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-logo-wall-fadein-duration` | — | — |
| `nc-logo-wall-fadein-delay-step` | — | — |
| `nc-logo-wall-fadein-easing` | — | — |

### Hover
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-logo-wall-item-hover-shadow` | — | — |
| `nc-logo-wall-item-hover-border` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName

## Web Components Mapping
Derived from anatomy for potential `<nc-logo-wall>` custom element:

```js
class NcLogoWall extends HTMLElement {
  static observedAttributes = ['layout', 'size', 'appearance', 'animation'];
  // Slots: <slot name="pill">
}
```

---

*Generated from `data/logo-wall-recipe.json` by `scripts/generate-component-specs.js`*
