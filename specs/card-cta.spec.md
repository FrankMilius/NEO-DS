# card-cta Component Spec
> Version 1.2.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `molecules`

## Anatomy
Root element: `.nc-card-cta`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| actions | `.nc-card-cta__actions` | Yes | — |
| content | `.nc-card-cta__content` | Yes | — |
| media | `.nc-card-cta__media` | Yes | — |
| overlay | `.nc-card-cta__overlay` | Yes | — |
| title | `.nc-card-cta__title` | Yes | — |

### DOM Notes
- Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.
- Slots sind aus Klassennamen abgeleitet. Die ersten sechs werden in der Story gerendert, um die Struktur zu zeigen — welche wirklich Pflicht sind, klaert erst eine Spezifikation.

## Variants
### Ton (`ton`)
data-theme am Wurzelelement: Farbe von Titel und Verlauf ueber dem Bild (06-molecules/_card-cta.scss).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| dunkel | — |  |
| hell | — |  |

## States
Supported: `default`, `hover`

## CSS Token API
Base classes: `nc-card-cta`

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-card-cta>` custom element:

```js
class NcCardCta extends HTMLElement {
  static observedAttributes = ['ton'];
  // Slots: <slot name="actions">, <slot name="content">, <slot name="media">, <slot name="overlay">, <slot name="title">
}
```

---

*Generated from `data/card-cta-recipe.json` by `scripts/generate-component-specs.js`*
