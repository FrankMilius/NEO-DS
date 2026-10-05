# news Component Spec
> Version 1.0.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `organisms`

## Anatomy
Root element: `.nc-news`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| body | `.nc-news__body` | Yes | — |
| date | `.nc-news__date` | Yes | — |
| eyebrow | `.nc-news__eyebrow` | Yes | — |
| footer | `.nc-news__footer` | Yes | — |
| hero | `.nc-news__hero` | Yes | — |
| hero-cta | `.nc-news__hero-cta` | Yes | — |
| hero-inner | `.nc-news__hero-inner` | No | — |
| hero-media | `.nc-news__hero-media` | No | — |
| hero-overlay | `.nc-news__hero-overlay` | No | — |
| kicker | `.nc-news__kicker` | No | — |
| lead | `.nc-news__lead` | No | — |
| title | `.nc-news__title` | No | — |

### DOM Notes
- Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.
- Slots sind aus Klassennamen abgeleitet. Die ersten sechs werden in der Story gerendert, um die Struktur zu zeigen — welche wirklich Pflicht sind, klaert erst eine Spezifikation.

## CSS Token API
Base classes: 

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-news>` custom element:

```js
class NcNews extends HTMLElement {
  static observedAttributes = [];
  // Slots: <slot name="body">, <slot name="date">, <slot name="eyebrow">, <slot name="footer">, <slot name="hero">, <slot name="hero-cta">
}
```

---

*Generated from `data/news-recipe.json` by `scripts/generate-component-specs.js`*
