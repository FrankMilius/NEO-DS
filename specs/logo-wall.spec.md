# logo-wall Component Spec
> Version 2.2.0 | Status: stable | Layer: molecule

Tags: `display`, `branding`, `logos`, `partner`, `marquee`

## Anatomy
Root element: `.nc-logo-wall`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| pill | `.nc-logo-pill` | Yes | Einzelnes Logo-Item. Flex-Container mit Border, Radius, Padding. |
| track | `.nc-logo-wall__track` | No | Marquee-Track. Flex-Container mit verdoppeltem Inhalt fuer Endlosschleife. |
| pause | `.nc-logo-wall__pause` | No | Pause-Knopf des Laufbands vor der Spur (WCAG 2.2.2): Symbol .nc-logo-wall__pause-icon (Pfade -pause/-play, Wahl per data-playing) und Beschriftung .nc-logo-wall__pause-label „Laufband anhalten“/„Laufband fortsetzen“; Tokens und Verhalten aus marquee. |

### DOM Notes
- Root: display:grid (default), display:flex (marquee/cluster). Gap via Token.
- Pill: Flex-Container, align-items:center, justify-content:center. Border + Radius + Shadow.
- Pill-Img: object-fit:contain. Max-height begrenzt Logo-Groesse.
- Monochrome: CSS filter:grayscale(100%) auf Img. Hover entfernt Filter.
- Fade-In: neo-behaviors einblenden (Plan v4, Phase 6b) setzt .is-visible + transition-delay pro Index (IntersectionObserver); ausgeblendet nur, solange es gebunden ist (data-neo-behavior~="einblenden"). Nicht im Laufband.
- Cluster: flex-wrap:wrap, justify-content:center. Organisches Layout.
- prefers-reduced-motion: Marquee stoppt. Fade-In ohne Animation.
- Marquee: Wurzel als Block; Knopf .nc-logo-wall__pause, dann die Spur (.nc-logo-wall__track, max-content) mit dupliziertem Inhalt, @keyframes translateX(-50%). Kopien aria-hidden, Links darin tabindex=-1 (neo-behaviors marquee; nicht inert, Maus und Hover bleiben); Ruhe per .is-paused/.is-stopped (ungebunden :hover).
- Name: img alt bzw. Text der Pille — kein aria-label an Pille oder Wand (div ohne Rolle). Externe Links (target=_blank) mit .u-sr-only „öffnet in neuem Fenster“.

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
Supported: `default`, `hover`, `paused`, `stopped`

- **hover**: 
- **paused**: 
- **stopped**: 

## CSS Token API
Base classes: `nc-logo-wall`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-logo-wall-gap` | — | `--mod-logo-wall-gap` |
| `--nc-logo-wall-padding-block` | — | `--mod-logo-wall-padding-block` |
| `--nc-logo-wall-padding-inline` | — | `--mod-logo-wall-padding-inline` |
| `--nc-logo-wall-grid-min` | — | `--mod-logo-wall-grid-min` |
| `--nc-logo-wall-align` | — | `--mod-logo-wall-align` |

### Item (Pill)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-logo-wall-item-bg` | — | `--mod-logo-wall-item-bg` |
| `--nc-logo-wall-item-border` | — | `--mod-logo-wall-item-border` |
| `--nc-logo-wall-item-border-width` | — | `--mod-logo-wall-item-border-width` |
| `--nc-logo-wall-item-radius` | — | `--mod-logo-wall-item-radius` |
| `--nc-logo-wall-item-padding` | — | `--mod-logo-wall-item-padding` |
| `--nc-logo-wall-item-aspect-ratio` | — | `--mod-logo-wall-item-aspect-ratio` |
| `--nc-logo-wall-item-shadow` | — | `--mod-logo-wall-item-shadow` |
| `--nc-logo-wall-item-transition` | — | `--mod-logo-wall-item-transition` |

### Sizing
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-logo-wall-item-width-sm` | — | `--mod-logo-wall-item-width-sm` |
| `--nc-logo-wall-item-width-md` | — | — |
| `--nc-logo-wall-item-width-lg` | — | `--mod-logo-wall-item-width-lg` |
| `--nc-logo-wall-item-height` | — | — |
| `--nc-logo-wall-logo-max-height` | — | `--mod-logo-wall-logo-max-height` |

### Logo Image
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-logo-wall-logo-opacity` | — | `--mod-logo-wall-logo-opacity` |
| `--nc-logo-wall-logo-filter` | — | `--mod-logo-wall-logo-filter` |
| `--nc-logo-wall-logo-filter-hover` | — | `--mod-logo-wall-logo-filter-hover` |
| `--nc-logo-wall-logo-opacity-hover` | — | `--mod-logo-wall-logo-opacity-hover` |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-logo-wall-font-size` | — | `--mod-logo-wall-font-size` |
| `--nc-logo-wall-font-weight` | — | `--mod-logo-wall-font-weight` |
| `--nc-logo-wall-color` | — | `--mod-logo-wall-color` |

### Marquee
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-logo-wall-marquee-speed` | — | `--mod-logo-wall-marquee-speed` |
| `--nc-logo-wall-marquee-gap` | — | `--mod-logo-wall-marquee-gap` |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-logo-wall-fadein-duration` | — | `--mod-logo-wall-fadein-duration` |
| `--nc-logo-wall-fadein-delay-step` | — | — |
| `--nc-logo-wall-fadein-easing` | — | `--mod-logo-wall-fadein-easing` |

### Hover
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-logo-wall-item-hover-shadow` | — | `--mod-logo-wall-item-hover-shadow` |
| `--nc-logo-wall-item-hover-border` | — | `--mod-logo-wall-item-hover-border` |

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

- hasAccessibleName
- 2.2.2: Laufband mit Pause-Knopf vor der Spur (Beschriftung wechselt), Maus/Fokus halten voruebergehend an, prefers-reduced-motion: stehend (Behavior marquee).
- 2.4.3/4.1.2: Kopien im Laufband aria-hidden mit tabindex=-1 — nicht per Tab erreichbar, nicht vorgelesen, mit der Maus anklickbar.
- 4.1.2: Kein aria-label an div ohne Rolle; Name aus alt bzw. Linktext.
- 3.2.5/2.4.4: Externe Links mit Hinweis „öffnet in neuem Fenster“ (.u-sr-only).

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
