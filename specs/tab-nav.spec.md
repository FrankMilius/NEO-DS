# tab-nav Component Spec
> Version 1.0.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `molecules`

## Anatomy
Root element: `.nc-tab-nav`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| badges | `.nc-tab-nav__badges` | Yes | — |
| bento | `.nc-tab-nav__bento` | Yes | — |
| module | `.nc-tab-nav__module` | Yes | — |
| panel-body | `.nc-tab-nav__panel-body` | Yes | — |

### DOM Notes
- Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.
- Slots sind aus Klassennamen abgeleitet. Die ersten sechs werden in der Story gerendert, um die Struktur zu zeigen — welche wirklich Pflicht sind, klaert erst eine Spezifikation.

## CSS Token API
Base classes: 

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-tab-nav>` custom element:

```js
class NcTabNav extends HTMLElement {
  static observedAttributes = [];
  // Slots: <slot name="badges">, <slot name="bento">, <slot name="module">, <slot name="panel-body">
}
```

---

*Generated from `data/tab-nav-recipe.json` by `scripts/generate-component-specs.js`*
