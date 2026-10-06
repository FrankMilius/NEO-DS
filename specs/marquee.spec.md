# marquee Component Spec
> Version 1.2.0 | Status: stable | Layer: molecule

Tags: `display`, `animation`, `decorative`

## Anatomy
Root element: `.nc-marquee`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| track | `.nc-marquee__track` | Yes | — |
| text | `.nc-marquee__text` | Yes | — |

### DOM Notes
- Overflow:hidden Container. Track: inline-flex, gap 2.5rem, will-change:transform.
- Text: uppercase, letter-spacing 0.08em, clamp font-size.
- Bewegung (Entscheidung 06.10.2026): .nc-marquee__track laeuft endlos (Keyframes `marquee`, translate um die halbe Spur) — der Inhalt steht deshalb zweimal in der Spur. Dauer --nc-marquee-duration. prefers-reduced-motion: die Spur steht.

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-marquee`

### Base
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-marquee-duration` | — | `--mod-marquee-duration` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-marquee>` custom element:

```js
class NcMarquee extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="track">, <slot name="text">
}
```

---

*Generated from `data/marquee-recipe.json` by `scripts/generate-component-specs.js`*
