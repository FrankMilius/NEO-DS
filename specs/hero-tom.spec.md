# hero-tom Component Spec
> Version 1.1.0 | Status: stable | Layer: organism

Tags: `hero`, `display`, `parallax`

## Anatomy
Root element: `.nc-hero-tom`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| media | `.nc-hero-tom__media` | Yes | — |
| scrim | `.nc-hero-tom__scrim` | Yes | — |
| content | `.nc-hero-tom__content` | Yes | — |
| copy | `.nc-hero-tom__copy` | Yes | — |
| kicker | `.nc-hero-tom__kicker` | No | — |
| headline | `.nc-hero-tom__headline` | Yes | — |
| subtext | `.nc-hero-tom__subtext` | No | — |
| badges | `.nc-hero-tom__badges` | No | — |

### DOM Notes
- Text ueber Hintergrund-Medium. Optionaler Parallax-Expand.
- Markup wie data/markup/hero-tom.html (Website). Slots aus dem geernteten Markup (06.10.2026).
- Das DS gestaltet davon nur die Inhaltsbreite (--cw-*, begrenzt __content) und die Badge-Zeile (__badges, 05-atoms/_badge-row.scss). Wurzel, Medium, Scrim und Text gestaltet das Drupal-Theme (neo_fe), nicht styles.css.
- Expand beim Scrollen: GSAP/ScrollTrigger in neo-theme.js setzt --tom-expand am Medium; das DS kennt die Eigenschaft nicht. Die Arena zeigt den Endzustand (--tom-expand: 1).

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

### Inhaltsbreite (`contentWidth`)
Begrenzt den Inhalt (__content) auf eine Containerbreite — Drupal-Feld je Block. 07-organisms/_hero-tom.scss.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| prose | `.nc-hero-tom--cw-prose` |  |
| narrow | `.nc-hero-tom--cw-narrow` |  |
| content | `.nc-hero-tom--cw-content` |  |
| wide | `.nc-hero-tom--cw-wide` |  |
| xwide | `.nc-hero-tom--cw-xwide` |  |
| full | `.nc-hero-tom--cw-full` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-hero-tom`

### Kicker
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-tom-kicker-size` | — | `--mod-hero-tom-kicker-size` |
| `--nc-hero-tom-kicker-weight` | — | `--mod-hero-tom-kicker-weight` |

### Headline
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-tom-headline-size` | — | `--mod-hero-tom-headline-size` |
| `--nc-hero-tom-headline-weight` | — | `--mod-hero-tom-headline-weight` |

### Subtext
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-tom-subtext-size` | — | `--mod-hero-tom-subtext-size` |
| `--nc-hero-tom-subtext-opacity` | — | `--mod-hero-tom-subtext-opacity` |
| `--nc-hero-tom-content-max-width` | — | `--mod-hero-tom-content-max-width` |

### Scrim
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-tom-scrim-color` | — | `--mod-hero-tom-scrim-color` |

### Expand
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-tom-expand-radius` | — | `--mod-hero-tom-expand-radius` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Dependencies
`hero`

## Web Components Mapping
Derived from anatomy for potential `<nc-hero-tom>` custom element:

```js
class NcHeroTom extends HTMLElement {
  static observedAttributes = ['variant', 'contentWidth'];
  // Slots: <slot name="media">, <slot name="scrim">, <slot name="content">, <slot name="copy">, <slot name="headline">
}
```

---

*Generated from `data/hero-tom-recipe.json` by `scripts/generate-component-specs.js`*
