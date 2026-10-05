# searchbar Component Spec
> Version 1.0.0 | Status: draft | Layer: unknown

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
| shortcut | `.nc-searchbar__shortcut` | Yes | — |

### DOM Notes
- Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.
- Slots sind aus Klassennamen abgeleitet. Die ersten sechs werden in der Story gerendert, um die Struktur zu zeigen — welche wirklich Pflicht sind, klaert erst eine Spezifikation.

## CSS Token API
Base classes: 

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-searchbar>` custom element:

```js
class NcSearchbar extends HTMLElement {
  static observedAttributes = [];
  // Slots: <slot name="close">, <slot name="field">, <slot name="icon">, <slot name="inner">, <slot name="input">, <slot name="shortcut">
}
```

---

*Generated from `data/searchbar-recipe.json` by `scripts/generate-component-specs.js`*
