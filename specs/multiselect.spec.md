# multiselect Component Spec
> Version 1.0.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `molecules`

## Anatomy
Root element: `.nc-multiselect`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| caret | `.nc-multiselect__caret` | Yes | — |
| option | `.nc-multiselect__option` | Yes | — |
| panel | `.nc-multiselect__panel` | Yes | — |
| trigger | `.nc-multiselect__trigger` | Yes | — |
| value | `.nc-multiselect__value` | Yes | — |
| value--empty | `.nc-multiselect__value--empty` | Yes | — |

### DOM Notes
- Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.
- Slots sind aus Klassennamen abgeleitet. Die ersten sechs werden in der Story gerendert, um die Struktur zu zeigen — welche wirklich Pflicht sind, klaert erst eine Spezifikation.

## CSS Token API
Base classes: 

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-multiselect>` custom element:

```js
class NcMultiselect extends HTMLElement {
  static observedAttributes = [];
  // Slots: <slot name="caret">, <slot name="option">, <slot name="panel">, <slot name="trigger">, <slot name="value">, <slot name="value--empty">
}
```

---

*Generated from `data/multiselect-recipe.json` by `scripts/generate-component-specs.js`*
