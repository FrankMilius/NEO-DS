# home-hero Component Spec
> Version 1.0.0 | Status: draft | Layer: template

Tags: `templates`, `layout`, `landing`, `animation`

## Anatomy
Root element: `.t-home-hero`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| skip-button | `.skip-button` | No | Absatz mit Link „Zum Inhalt springen". |

### DOM Notes
- Im SCSS als DEPRECATED markiert: die Layout-Struktur uebernimmt das Shell-Preset <body data-layout="landing"> mit .nc-shell; die Bauteil-Stile bleiben. Kein Verwender auf der Website.
- Gestaltet ueber Element-Selektoren (h1, p, em, a) und Zustandsklassen der frueheren Zeichen-Animation (.show, .animate, .char, .highlights, .world). Das JS dazu gibt es im DS nicht mehr — die Arena zeigt den statischen Zustand.
- .t-home-hero--visited (wiederkehrender Besuch) versetzt nur die animierten Zeichen (.char) — ohne Zeichen-Markup ohne Wirkung, deshalb keine Achse.

## Variants
### Variante (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `t-home-hero`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--fnd-color-background-base` | — | — |
| `--fnd-color-text-primary` | — | — |
| `--fnd-color-text-tertiary` | — | — |
| `--fnd-motion-duration-1500` | — | — |
| `--fnd-motion-ease-focused` | — | — |
| `--fnd-spacing-02` | — | — |
| `--fnd-spacing-04` | — | — |
| `--fnd-spacing-06` | — | — |
| `--fnd-spacing-08` | — | — |
| `--fnd-spacing-09` | — | — |
| `--fnd-spacing-10` | — | — |
| `--fnd-spacing-11` | — | — |
| `--fnd-typography-heading-xl-line-height` | — | — |
| `--fnd-typography-paragraph-xl-font-size` | — | — |
| `--fnd-z-base` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-home-hero>` custom element:

```js
class NcHomeHero extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: default
}
```

---

*Generated from `data/home-hero-recipe.json` by `scripts/generate-component-specs.js`*
