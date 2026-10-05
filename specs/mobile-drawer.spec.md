# mobile-drawer Component Spec
> Version 1.0.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `organisms`

## Anatomy
Root element: `.nc-mobile-drawer`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| backdrop | `.nc-mobile-drawer__backdrop` | Yes | — |
| backdrop--visible | `.nc-mobile-drawer__backdrop--visible` | Yes | — |
| close | `.nc-mobile-drawer__close` | Yes | — |
| header | `.nc-mobile-drawer__header` | Yes | — |
| link | `.nc-mobile-drawer__link` | Yes | — |
| list | `.nc-mobile-drawer__list` | Yes | — |
| nav | `.nc-mobile-drawer__nav` | No | — |
| sublink | `.nc-mobile-drawer__sublink` | No | — |
| sublist | `.nc-mobile-drawer__sublist` | No | — |
| title | `.nc-mobile-drawer__title` | No | — |

### DOM Notes
- Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.
- Slots sind aus Klassennamen abgeleitet. Die ersten sechs werden in der Story gerendert, um die Struktur zu zeigen — welche wirklich Pflicht sind, klaert erst eine Spezifikation.

## Variants
### undefined (`0`)
| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| open | `.nc-mobile-drawer--open` |  |

## CSS Token API
Base classes: 

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-mobile-drawer>` custom element:

```js
class NcMobileDrawer extends HTMLElement {
  static observedAttributes = ['0'];
  // Slots: <slot name="backdrop">, <slot name="backdrop--visible">, <slot name="close">, <slot name="header">, <slot name="link">, <slot name="list">
}
```

---

*Generated from `data/mobile-drawer-recipe.json` by `scripts/generate-component-specs.js`*
