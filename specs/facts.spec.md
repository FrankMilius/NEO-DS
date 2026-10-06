# facts Component Spec
> Version 1.1.0 | Status: stable | Layer: molecule

Tags: `display`, `content`, `data`

## Anatomy
Root element: `.nc-facts-block`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| title | `.nc-facts-title` | No | — |
| list | `.nc-facts-list` | Yes | — |
| term | `.nc-facts-term` | Yes | — |
| desc | `.nc-facts-desc` | Yes | — |

### DOM Notes
- Block: background-base, radius-xl, elevation-raised.
- List: CSS Grid 2-Spalten (auto 1fr). Term: semibold. Desc: text-secondary.

## Variants
### Content (`content`)
Inhalt — with-title, without-title

| Value | CSS Modifier | Default |
| --- | --- | --- |
| with-title | — |  |
| without-title | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-facts-block`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-facts>` custom element:

```js
class NcFacts extends HTMLElement {
  static observedAttributes = ['content'];
  // Slots: <slot name="list">, <slot name="term">, <slot name="desc">
}
```

---

*Generated from `data/facts-recipe.json` by `scripts/generate-component-specs.js`*
