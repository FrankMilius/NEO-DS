# event Component Spec
> Version 1.1.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `organisms`

## Anatomy
Root element: `.nc-event`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| agenda | `.nc-event__agenda` | Yes | — |
| content-grid | `.nc-event__content-grid` | Yes | — |
| cta | `.nc-event__cta` | Yes | — |
| hero | `.nc-event__hero` | Yes | — |
| hero-content | `.nc-event__hero-content` | Yes | — |
| hero-media | `.nc-event__hero-media` | Yes | — |
| hero-overlay | `.nc-event__hero-overlay` | No | — |
| info-card | `.nc-event__info-card` | No | — |
| info-card-title | `.nc-event__info-card-title` | No | — |
| info-cta | `.nc-event__info-cta` | No | — |
| info-list | `.nc-event__info-list` | No | — |
| meta | `.nc-event__meta` | No | — |
| meta-item | `.nc-event__meta-item` | No | — |
| related-card | `.nc-event__related-card` | No | — |
| related-grid | `.nc-event__related-grid` | No | — |
| section-title | `.nc-event__section-title` | No | — |
| subtitle | `.nc-event__subtitle` | No | — |
| tag | `.nc-event__tag` | No | — |
| tag--type | `.nc-event__tag--type` | No | — |
| tags | `.nc-event__tags` | No | — |
| title | `.nc-event__title` | No | — |

### DOM Notes
- Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.
- Slots sind aus Klassennamen abgeleitet. Die ersten sechs werden in der Story gerendert, um die Struktur zu zeigen — welche wirklich Pflicht sind, klaert erst eine Spezifikation.

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-event`

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-event>` custom element:

```js
class NcEvent extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="agenda">, <slot name="content-grid">, <slot name="cta">, <slot name="hero">, <slot name="hero-content">, <slot name="hero-media">
}
```

---

*Generated from `data/event-recipe.json` by `scripts/generate-component-specs.js`*
