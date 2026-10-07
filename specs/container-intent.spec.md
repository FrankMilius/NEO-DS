# container-intent Component Spec
> Version 1.0.0 | Status: draft | Layer: object

Tags: `layout`, `objects`, `container`

## Anatomy
Root element: `.container`

### DOM Notes
- Intent-Container: Breiten nach Inhaltsabsicht (prose 72ch, narrow 768, content 1090, wide 1290, xwide 1536, full 100 %) aus den Foundation-Tokens --fnd-layout-container-*; :root stellt sie als --container-* bereit.
- Bewusst getrennt von .nc-container (Site-Shell); die --nc-container-max-width*-Tokens zeigen an der Quelle auf diese Skala. Die numerischen Modifier .nc-container--sm|md|lg|xl|xxl sind abgekuendigt.
- Website: das Section-Layout rendert <section class="nc-section"><div class="container container--{{ width }}"> (Vorgabe content); die Kopfzeile nutzt .container ohne Breite.
- Innenabstand fluid ueber --container-padding-inline (Override --mod-container-padding-inline).

## Variants
### Breite (`width`)
Inhaltsabsicht

| Value | CSS Modifier | Default |
| --- | --- | --- |
| prose | `.container--prose` |  |
| narrow | `.container--narrow` |  |
| content | `.container--content` |  |
| wide | `.container--wide` |  |
| xwide | `.container--xwide` |  |
| full | `.container--full` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `container`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--container-content` | — | — |
| `--container-full` | — | — |
| `--container-narrow` | — | — |
| `--container-padding-inline` | — | — |
| `--container-prose` | — | — |
| `--container-wide` | — | — |
| `--container-xwide` | — | — |
| `--fnd-layout-container-content` | — | — |
| `--fnd-layout-container-full` | — | — |
| `--fnd-layout-container-narrow` | — | — |
| `--fnd-layout-container-prose` | — | — |
| `--fnd-layout-container-wide` | — | — |
| `--fnd-layout-container-xwide` | — | — |
| `--fnd-spacing-06` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-container-intent>` custom element:

```js
class NcContainerIntent extends HTMLElement {
  static observedAttributes = ['width'];
  // Slots: default
}
```

---

*Generated from `data/container-intent-recipe.json` by `scripts/generate-component-specs.js`*
