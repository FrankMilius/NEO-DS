# table-info-modal Component Spec
> Version 1.1.0 | Status: draft | Layer: unknown

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
- Markup wie data/markup/table-info-modal.html: div[role=dialog] mit __backdrop und __content (__close, __body); den Text der Zelle setzt neo-theme.js in __body.
- Zustand open = .is-open (SCSS blendet per opacity ein). hover/focus nur am Schliessen-Knopf.
- Die Ernte hat keinen Namen am Dialog (aria-labelledby) und kein aria-modal — die Arena ergaenzt beides.

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`, `open`, `hover`, `focus`

## CSS Token API
Base classes: `nc-table-info-modal`

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-table-info-modal>` custom element:

```js
class NcTableInfoModal extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="backdrop">, <slot name="body">, <slot name="close">, <slot name="content">
}
```

---

*Generated from `data/table-info-modal-recipe.json` by `scripts/generate-component-specs.js`*
