# hero-tom Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `hero`, `display`, `parallax`

## Anatomy
Root element: `.nc-hero-tom`

### DOM Notes
- Text ueber Hintergrund-Medium. Optionaler Parallax-Expand.

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

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
  static observedAttributes = ['variant'];
  // Slots: default
}
```

---

*Generated from `data/hero-tom-recipe.json` by `scripts/generate-component-specs.js`*
