# hero-tmob Component Spec
> Version 1.1.0 | Status: stable | Layer: organism

Tags: `hero`, `display`, `parallax`, `media`

## Anatomy
Root element: `.nc-hero-tmob`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| content | `.nc-hero-tmob__content` | Yes | — |
| text | `.nc-hero-tmob__text` | Yes | — |
| headline | `.nc-hero-tmob__headline` | Yes | — |
| subtext | `.nc-hero-tmob__subtext` | No | — |
| media | `.nc-hero-tmob__media` | No | — |
| badges | `.nc-hero-tmob__badges` | No | — |

### DOM Notes
- Headline + Subtext + Media ueber konfigurierbarem Hintergrund.
- Markup wie data/markup/hero-tmob.html (Website). Die Grundfarbe setzt Drupal je Block inline (background-color); ohne --light steht die Schrift in always-light.
- Ein Parallax-Grund (.nc-parallax-bg) darf im Hero liegen: DS-Regel .nc-hero-tmob .nc-parallax-bg (absolut, volle Hoehe, unter dem Text).
- Bewegung (Einfahren, Parallax) steuert auf der Website GSAP in neo-theme.js — das DS hat dafuer keine Klassen oder Zustaende.

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

### Ton (`tone`)
Schrift fuer dunklen (Standard) oder hellen Grund.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| dark | — |  |
| light | `.nc-hero-tmob--light` |  |

### Inhaltsbreite (`contentWidth`)
Begrenzt den Inhalt (__content) auf eine Containerbreite — Drupal-Feld je Block. 07-organisms/_hero-tom.scss.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| prose | `.nc-hero-tmob--cw-prose` |  |
| narrow | `.nc-hero-tmob--cw-narrow` |  |
| content | `.nc-hero-tmob--cw-content` |  |
| wide | `.nc-hero-tmob--cw-wide` |  |
| xwide | `.nc-hero-tmob--cw-xwide` |  |
| full | `.nc-hero-tmob--cw-full` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-hero-tmob`

### Headline
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-tmob-headline-size` | — | `--mod-hero-tmob-headline-size` |
| `--nc-hero-tmob-headline-weight` | — | `--mod-hero-tmob-headline-weight` |

### Subtext
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-tmob-subtext-size` | — | `--mod-hero-tmob-subtext-size` |
| `--nc-hero-tmob-subtext-opacity` | — | `--mod-hero-tmob-subtext-opacity` |
| `--nc-hero-tmob-subtext-max-width` | — | `--mod-hero-tmob-subtext-max-width` |

### Content
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-tmob-content-max-width` | — | `--mod-hero-tmob-content-max-width` |
| `--nc-hero-tmob-content-gap` | — | `--mod-hero-tmob-content-gap` |

### Media
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-tmob-media-max-width` | — | `--mod-hero-tmob-media-max-width` |
| `--nc-hero-tmob-media-radius` | — | `--mod-hero-tmob-media-radius` |
| `--nc-hero-tmob-media-shadow` | — | `--mod-hero-tmob-media-shadow` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Dependencies
`hero`

## Web Components Mapping
Derived from anatomy for potential `<nc-hero-tmob>` custom element:

```js
class NcHeroTmob extends HTMLElement {
  static observedAttributes = ['variant', 'tone', 'contentWidth'];
  // Slots: <slot name="content">, <slot name="text">, <slot name="headline">
}
```

---

*Generated from `data/hero-tmob-recipe.json` by `scripts/generate-component-specs.js`*
