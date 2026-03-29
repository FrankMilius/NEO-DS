# hero-tmob Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `hero`, `display`, `parallax`, `media`

## Anatomy
Root element: `.nc-hero-tmob`

### DOM Notes
- Headline + Subtext + Media ueber konfigurierbarem Hintergrund.

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-hero-tmob`

### Headline
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-hero-tmob-headline-size` | — | — |
| `nc-hero-tmob-headline-weight` | — | — |

### Subtext
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-hero-tmob-subtext-size` | — | — |
| `nc-hero-tmob-subtext-opacity` | — | — |
| `nc-hero-tmob-subtext-max-width` | — | — |

### Content
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-hero-tmob-content-max-width` | — | — |
| `nc-hero-tmob-content-gap` | — | — |

### Media
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-hero-tmob-media-max-width` | — | — |
| `nc-hero-tmob-media-radius` | — | — |
| `nc-hero-tmob-media-shadow` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Dependencies
`hero`

## Web Components Mapping
Derived from anatomy for potential `<nc-hero-tmob>` custom element:

```js
class NcHeroTmob extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: default
}
```

---

*Generated from `data/hero-tmob-recipe.json` by `scripts/generate-component-specs.js`*
