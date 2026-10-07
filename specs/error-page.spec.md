# error-page Component Spec
> Version 1.0.0 | Status: draft | Layer: template

Tags: `templates`, `layout`, `fehler`

## Anatomy
Root element: `.t-error`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| content | `.t-error__content` | Yes | Zentrierter Inhalt. |
| code | `.t-error__code` | No | Grosse Fehlernummer, aria-hidden (steht im h1). |
| title | `.t-error__title` | Yes | h1. |
| description | `.t-error__description` | Yes | Erklaerung. |
| actions | `.t-error__actions` | Yes | Buttons. |

### DOM Notes
- Im SCSS als DEPRECATED markiert: die Layout-Struktur uebernimmt das Shell-Preset <body data-layout="focused"> mit .nc-shell; die Bauteil-Stile bleiben. Kein Verwender auf der Website.
- Fehlerseiten (404, 500) mit zentriertem Inhalt.

## Variants
### Variante (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `t-error`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--fnd-color-text-primary` | — | — |
| `--fnd-color-text-secondary` | — | — |
| `--fnd-color-text-tertiary` | — | — |
| `--fnd-font-weight-bold` | — | — |
| `--fnd-prose-max-width` | — | — |
| `--fnd-spacing-03` | — | — |
| `--fnd-spacing-04` | — | — |
| `--fnd-spacing-06` | — | — |
| `--fnd-spacing-08` | — | — |
| `--fnd-typography-display-2xl-font-size` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-error-page>` custom element:

```js
class NcErrorPage extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="content">, <slot name="title">, <slot name="description">, <slot name="actions">
}
```

---

*Generated from `data/error-page-recipe.json` by `scripts/generate-component-specs.js`*
