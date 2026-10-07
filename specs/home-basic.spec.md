# home-basic Component Spec
> Version 1.0.0 | Status: draft | Layer: template

Tags: `templates`, `layout`, `landing`

## Anatomy
Root element: `.t-home-basic`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| title | `.t-home-basic-title` | Yes | h2, Teil in <em> hervorgehoben. |
| link | `.t-home-basic-link` | No | Link oben rechts. |
| body | `.t-home-basic-body` | No | Text mit .button-container. |
| media | `.t-home-basic-media` | No | Bild 4:3. |

### DOM Notes
- Im SCSS als DEPRECATED markiert: die Layout-Struktur uebernimmt das Shell-Preset <body data-layout="landing"> mit .nc-shell; die Bauteil-Stile bleiben. Kein Verwender auf der Website.
- Elemente mit Bindestrich statt BEM (&-title -> .t-home-basic-title); die Doku nutzt den alten Namen .home-basic, das SCSS bedient beide.
- Ab desktop-up Raster 7/5 Spalten mit den Flaechen title/link und body/media.

## Variants
### Variante (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `t-home-basic`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--fnd-color-text-primary` | — | — |
| `--fnd-color-text-secondary` | — | — |
| `--fnd-color-text-tertiary` | — | — |
| `--fnd-media-ratio-4-3` | — | — |
| `--fnd-radius-sm` | — | — |
| `--fnd-spacing-08` | — | — |
| `--fnd-spacing-10` | — | — |
| `--fnd-spacing-12` | — | — |
| `--grid-gap` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-home-basic>` custom element:

```js
class NcHomeBasic extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="title">
}
```

---

*Generated from `data/home-basic-recipe.json` by `scripts/generate-component-specs.js`*
