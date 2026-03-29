# hero Component Spec
> Version 2.0.0 | Status: stable | Layer: organism

Tags: `display`, `content`, `hero`, `landing`

## Anatomy
Root element: `.nc-hero`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| content | `.nc-hero__content` | Yes | — |
| media | `.nc-hero__media` | No | — |
| actions | `.nc-hero__actions` | No | Primaere und sekundaere CTA-Buttons unterhalb der Highlights. |

### DOM Notes
- Grid: 2-Spalten ab 768px (split: 50/50 buendig). Content: text-inverse, gap 1rem.
- Title: fs-4xl, max-width 18ch fuer optimale Scanbarkeit.
- Highlights: Bullet-Liste mit accent-Punkt, line-height: tight fuer visuellen Zusammenhalt zum Titel.
- Card-Variante: radial-gradient dark BG, radius-3xl, Metric + Pulse-Animation.
- Picture-Variante: radius-sm, elevation-overlay. Overlay-Gradient sichert Kontrast unabhaengig vom Bildinhalt.
- Kicker: <p class='nc-hero__kicker'> ueber dem Titel. Token-gesteuert: --nc-hero-kicker-bg, -color, -size, -weight, -radius, -padding. Kein nc-label — eigenstaendiges Element.
- Subtitle: <p class='nc-hero__subtitle'> unter dem Titel. Token-gesteuert: --nc-hero-subtitle-size, -color, -max-width, -line-height.
- Overlay: <div class='nc-hero__overlay'> mit linear-gradient. Sichtbarkeit via --nc-hero-overlay-visible (1/0).
- Actions: Flex-Row mit gap, primaerer + sekundaerer Button. Alignment folgt der alignment-Achse.
- Breadcrumb: nc-breadcrumb am oberen Content-Rand, nur sichtbar wenn Slot befuellt.
- Centered: Alle Inhalte text-align center, max-width fuer Titel und Highlights.
- Split: Content links, Media rechts buendig (kein Radius), nahtlose Kante zum naechsten Abschnitt.
- Product: Metric-Integration fuer Preisangabe, prominenter CTA-Button.

## Variants
### Variant (`variant`)
Visuelle Variante — picture, card, split, product

| Value | CSS Modifier | Default |
| --- | --- | --- |
| picture | — |  |
| card | — |  |
| split | `.nc-hero--split` |  |
| product | `.nc-hero--product` |  |

### Alignment (`alignment`)
Content-Ausrichtung — start (default) oder center

| Value | CSS Modifier | Default |
| --- | --- | --- |
| start | — |  |
| center | `.nc-hero--center` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-hero`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-hero-bg` | — | — |
| `nc-hero-min-height` | — | — |
| `nc-hero-padding-block` | — | — |
| `nc-hero-padding-inline` | — | — |
| `nc-hero-gap` | — | — |
| `nc-hero-radius` | — | — |

### Overlay
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-hero-overlay-visible` | — | — |
| `nc-hero-overlay-start` | — | — |
| `nc-hero-overlay-end` | — | — |
| `nc-hero-overlay-direction` | — | — |

### Kicker
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-hero-kicker-size` | — | — |
| `nc-hero-kicker-weight` | — | — |
| `nc-hero-kicker-bg` | — | — |
| `nc-hero-kicker-color` | — | — |
| `nc-hero-kicker-radius` | — | — |
| `nc-hero-kicker-padding` | — | — |

### Title
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-hero-title-size` | — | — |
| `nc-hero-title-weight` | — | — |
| `nc-hero-title-color` | — | — |
| `nc-hero-title-max-width` | — | — |
| `nc-hero-title-line-height` | — | — |

### Subtitle
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-hero-subtitle-size` | — | — |
| `nc-hero-subtitle-color` | — | — |
| `nc-hero-subtitle-max-width` | — | — |
| `nc-hero-subtitle-line-height` | — | — |

### Highlights
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-hero-highlights-gap` | — | — |
| `nc-hero-highlights-color` | — | — |
| `nc-hero-highlights-marker` | — | — |
| `nc-hero-highlights-size` | — | — |

### Actions
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-hero-actions-gap` | — | — |
| `nc-hero-actions-margin-top` | — | — |

## Accessibility
Contrast Target: WCAG AA large text (3:1)

- Picture-Variante: Overlay-Gradient muss ausreichend Kontrast fuer text-inverse sichern (min 3:1 auf jedem Bildinhalt).
- Card: Pulse-Animation muss via prefers-reduced-motion deaktivierbar sein.
- Badge: Darf nicht allein durch Farbe Bedeutung vermitteln — Text oder Icon erforderlich.
- Actions: Buttons muessen fokussierbar sein und sichtbaren Focus-Ring haben.
- Breadcrumb: aria-label='Breadcrumb', nav-Element.

## Web Components Mapping
Derived from anatomy for potential `<nc-hero>` custom element:

```js
class NcHero extends HTMLElement {
  static observedAttributes = ['variant', 'alignment'];
  // Slots: <slot name="content">
}
```

---

*Generated from `data/hero-recipe.json` by `scripts/generate-component-specs.js`*
