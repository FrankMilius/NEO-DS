# feature-list Component Spec
> Version 1.1.1 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `organisms`

## Anatomy
Root element: `.nc-feature-list`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| content | `.nc-feature-list__content` | Yes | — |
| cta | `.nc-feature-list__cta` | Yes | — |
| icon | `.nc-feature-list__icon` | Yes | — |
| inner | `.nc-feature-list__inner` | Yes | — |
| item | `.nc-feature-list__item` | Yes | — |
| item-text | `.nc-feature-list__item-text` | Yes | — |
| items | `.nc-feature-list__items` | No | — |
| items-host | `.nc-feature-list__items-host` | No | — |
| media | `.nc-feature-list__media` | No | — |
| text | `.nc-feature-list__text` | No | — |
| video | `.nc-feature-list__video` | No | — |

### DOM Notes
- Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.
- Slots sind aus Klassennamen abgeleitet. Die ersten sechs werden in der Story gerendert, um die Struktur zu zeigen — welche wirklich Pflicht sind, klaert erst eine Spezifikation.

## Variants
### Variante (`variante`)
Klassen, die Drupal am Block setzt (mit Medium immer with-media, media-* und valign-*).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| media-left | `.nc-feature-list--media-left` |  |
| media-right | `.nc-feature-list--media-right` |  |
| valign-bottom | `.nc-feature-list--valign-bottom` |  |
| valign-middle | `.nc-feature-list--valign-middle` |  |
| valign-top | `.nc-feature-list--valign-top` |  |
| with-media | `.nc-feature-list--with-media` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-feature-list`

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-feature-list>` custom element:

```js
class NcFeatureList extends HTMLElement {
  static observedAttributes = ['variante'];
  // Slots: <slot name="content">, <slot name="cta">, <slot name="icon">, <slot name="inner">, <slot name="item">, <slot name="item-text">
}
```

---

*Generated from `data/feature-list-recipe.json` by `scripts/generate-component-specs.js`*
