# testimonial Component Spec
> Version 1.2.0 | Status: stable | Layer: molecule

Tags: `display`, `content`, `social-proof`

## Anatomy
Root element: `.nc-testimonial`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| quote | `.nc-testimonial__quote` | Yes | — |
| author | `.nc-testimonial__author` | Yes | — |
| meta | `.nc-testimonial__meta` | No | — |
| name | `.nc-testimonial__name` | Yes | — |
| role | `.nc-testimonial__role` | No | — |

### DOM Notes
- figure.nc-testimonial (Karte: background-secondary, radius-4xl, Polsterung spacing-05, Grid gap spacing-05) > blockquote.__quote, optional ul.__results, figcaption.__author > div.__meta > cite.__name + span.__role, optional p.__context.
- Optional (aufgenommen aus neo-overrides.css): img.__avatar vor den Meta-Angaben, img.__logo rechts im Autorenblock, __socials > a.__social unter Name/Rolle, __video (Vorschau __video-facade > __video-play, per order oben).
- Drupal zeigt jeden optionalen Teil nur, wenn das Feld gefuellt ist.
- Video-Fassade (Plan v4, Phase 3): .nc-testimonial__video-facade mit data-neo-video="fassade" und data-video-url; das iframe baut neo-behaviors video (Recipe video) erst beim Klick.

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-testimonial`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Datenschutz/4.1.2: Fassade laedt vor dem Klick nichts von YouTube/Vimeo; das iframe heisst wie die Fassade (aria-label).

## Web Components Mapping
Derived from anatomy for potential `<nc-testimonial>` custom element:

```js
class NcTestimonial extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="quote">, <slot name="author">, <slot name="name">
}
```

---

*Generated from `data/testimonial-recipe.json` by `scripts/generate-component-specs.js`*
