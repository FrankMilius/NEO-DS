# searchbar Component Spec
> Version 1.2.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `molecules`

## Anatomy
Root element: `.nc-searchbar`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| close | `.nc-searchbar__close` | Yes | — |
| field | `.nc-searchbar__field` | Yes | — |
| icon | `.nc-searchbar__icon` | Yes | — |
| inner | `.nc-searchbar__inner` | Yes | — |
| input | `.nc-searchbar__input` | Yes | — |

### DOM Notes
- Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.
- Slots sind aus Klassennamen abgeleitet (close, field, icon, inner, input). Einen Shortcut-Hinweis hat die Leiste nicht (Entscheidung 06.10.2026).

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`, `hover`, `focus`

## CSS Token API
Base classes: `nc-searchbar`

### Base
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-searchbar-close-background` | — | `--mod-searchbar-close-background` |
| `--nc-searchbar-input-padding-left` | — | `--mod-searchbar-input-padding-left` |
| `--nc-searchbar-input-padding-right` | — | `--mod-searchbar-input-padding-right` |

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-searchbar>` custom element:

```js
class NcSearchbar extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="close">, <slot name="field">, <slot name="icon">, <slot name="inner">, <slot name="input">
}
```

---

*Generated from `data/searchbar-recipe.json` by `scripts/generate-component-specs.js`*
