# tbl-cell Component Spec
> Version 1.0.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `atoms`

## Anatomy
Root element: `.nc-tbl-cell`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| icon-block | `.nc-tbl-cell__icon-block` | Yes | — |
| info-btn | `.nc-tbl-cell__info-btn` | Yes | — |
| sub | `.nc-tbl-cell__sub` | Yes | — |
| text | `.nc-tbl-cell__text` | Yes | — |

### DOM Notes
- Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.
- Slots sind aus Klassennamen abgeleitet. Die ersten sechs werden in der Story gerendert, um die Struktur zu zeigen — welche wirklich Pflicht sind, klaert erst eine Spezifikation.

## Variants
### undefined (`0`)
| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| icon | `.nc-tbl-cell--icon` |  |

## CSS Token API
Base classes: 

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-tbl-cell>` custom element:

```js
class NcTblCell extends HTMLElement {
  static observedAttributes = ['0'];
  // Slots: <slot name="icon-block">, <slot name="info-btn">, <slot name="sub">, <slot name="text">
}
```

---

*Generated from `data/tbl-cell-recipe.json` by `scripts/generate-component-specs.js`*
