# table-info-modal Component Spec
> Version 1.0.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `organisms`

## Anatomy
Root element: `.nc-table-info-modal`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| backdrop | `.nc-table-info-modal__backdrop` | Yes | — |
| body | `.nc-table-info-modal__body` | Yes | — |
| close | `.nc-table-info-modal__close` | Yes | — |
| content | `.nc-table-info-modal__content` | Yes | — |

### DOM Notes
- Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.
- Slots sind aus Klassennamen abgeleitet. Die ersten sechs werden in der Story gerendert, um die Struktur zu zeigen — welche wirklich Pflicht sind, klaert erst eine Spezifikation.

## CSS Token API
Base classes: 

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-table-info-modal>` custom element:

```js
class NcTableInfoModal extends HTMLElement {
  static observedAttributes = [];
  // Slots: <slot name="backdrop">, <slot name="body">, <slot name="close">, <slot name="content">
}
```

---

*Generated from `data/table-info-modal-recipe.json` by `scripts/generate-component-specs.js`*
