# block-bundle Component Spec
> Version 1.0.0 | Status: draft | Layer: organism

Tags: `content`, `organisms`, `website-block`

## Anatomy
Root element: `.nc-block-bundle`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| header | `.nc-block-bundle__header` | No | Kopf (traegt .nc-container): neo_fe:block-header --flush, optional Text. |
| text | `.nc-block-bundle__text` | No | Fliesstext unter dem Kopf (mit .u-prose). |
| items | `.nc-block-bundle__items` | Yes | Die gebuendelten Bloecke, jeder mit seinem eigenen Template. |

### DOM Notes
- Website-Block neo_block_bundle: <section class="nc-section nc-block-bundle"> mit optionalem Kopf und den vorgerenderten Kind-Bloecken (bb_blocks).
- Die Wurzel .nc-block-bundle hat keine eigene Regel; gestaltet sind Kopf (Spalte mit gap, Abstand nach unten), Text (text-secondary) und der Abstand zwischen den Kind-Bloecken.
- Farbkontext (field_surface) und Inhaltsbreite (field_content_width) setzt Drupal am Block-Wrapper.
- Die Kind-Bloecke sind in der Arena Platzhalter — sie haben eigene Recipes.

## Variants
### Variante (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-block-bundle`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--fnd-color-text-secondary` | — | — |
| `--fnd-spacing-03` | — | — |
| `--fnd-spacing-04` | — | — |
| `--fnd-spacing-09` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-block-bundle>` custom element:

```js
class NcBlockBundle extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="items">
}
```

---

*Generated from `data/block-bundle-recipe.json` by `scripts/generate-component-specs.js`*
