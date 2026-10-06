# tbl-cell Component Spec
> Version 1.1.0 | Status: draft | Layer: unknown

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
- Zelle der Vergleichstabelle: .nc-tbl-cell (flex) in th oder td — der Ort gestaltet sie: th[scope=row] links mit fettem Text, td mittig.
- Zeilenkopf: p.nc-tbl-cell__text mit optionalem Info-Knopf .nc-tbl-cell__info-btn (aria-label), darunter optional .nc-tbl-cell__sub.
- Wertzelle: .nc-tbl-cell--icon mit Haken (nc-tbl-icon--check) oder Strich (nc-tbl-icon--dash); .nc-tbl-cell__icon-block stellt ein Symbol ueber Text.
- Aus dem Drupal-Theme uebernommen; Markup aus der Website /events/editionen-preise.

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
