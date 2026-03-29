# text-blocks Component Spec
> Version 1.0.0 | Status: stable | Layer: atom

Tags: `typography`, `display`, `content`

## Anatomy
Root element: `.nc-section-title`

### DOM Notes
- Text-Primitives: Section-Title (.nc-section-title), Eyebrow (.nc-eyebrow), Lead (.nc-lead).
- Section-Title: font-heading, fs-3xl, margin-bottom 4rem.
- Eyebrow: uppercase, fs-xs, letter-spacing 0.2em, text-secondary.
- Lead: fs-lg, text-secondary, max-width 56ch.

## Variants
### Variant (`variant`)
Text-Block-Typ — section-title, eyebrow, lead

| Value | CSS Modifier | Default |
| --- | --- | --- |
| section-title | — |  |
| eyebrow | — |  |
| lead | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-section-title`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Dependencies
`section`

## Web Components Mapping
Derived from anatomy for potential `<nc-text-blocks>` custom element:

```js
class NcTextBlocks extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: default
}
```

---

*Generated from `data/text-blocks-recipe.json` by `scripts/generate-component-specs.js`*
