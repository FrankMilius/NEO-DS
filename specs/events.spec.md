# events Component Spec
> Version 1.1.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `organisms`

## Anatomy
Root element: `.nc-events`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| card | `.nc-events__card` | Yes | — |
| card-footer | `.nc-events__card-footer` | Yes | — |
| card-header | `.nc-events__card-header` | Yes | — |
| card-meta | `.nc-events__card-meta` | Yes | — |
| card-meta-item | `.nc-events__card-meta-item` | Yes | — |
| card-title | `.nc-events__card-title` | Yes | — |
| card-type | `.nc-events__card-type` | No | — |
| empty | `.nc-events__empty` | No | — |
| filter-bar | `.nc-events__filter-bar` | No | — |
| filter-select | `.nc-events__filter-select` | No | — |
| grid | `.nc-events__grid` | No | — |
| load-more | `.nc-events__load-more` | No | — |
| results-count | `.nc-events__results-count` | No | — |
| search | `.nc-events__search` | No | — |
| search-icon | `.nc-events__search-icon` | No | — |
| search-input | `.nc-events__search-input` | No | — |
| search-wrapper | `.nc-events__search-wrapper` | No | — |

### DOM Notes
- Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.
- Slots sind aus Klassennamen abgeleitet. Die ersten sechs werden in der Story gerendert, um die Struktur zu zeigen — welche wirklich Pflicht sind, klaert erst eine Spezifikation.

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`, `hover`

## CSS Token API
Base classes: `nc-events`

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-events>` custom element:

```js
class NcEvents extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="card">, <slot name="card-footer">, <slot name="card-header">, <slot name="card-meta">, <slot name="card-meta-item">, <slot name="card-title">
}
```

---

*Generated from `data/events-recipe.json` by `scripts/generate-component-specs.js`*
