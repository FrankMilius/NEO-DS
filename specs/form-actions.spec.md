# form-actions Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `form`, `layout`, `action`

## Anatomy
Root element: `.nc-form-actions`

### DOM Notes
- Flex-Container fuer Formular-Buttons (Submit, Cancel, Reset).
- Default: flex-start. Modifier: --center, --end, --spread (space-between).
- --sticky: sticky bottom:0 mit BG + Shadow + border-top. Fuer lange Formulare.
- --stacked: flex-column, Buttons volle Breite. Fuer Mobile.
- --bordered: border-top Trennlinie, margin-top.
- --responsive: automatisch stacked unter 479px.
- Primary Action an erster Stelle im DOM.

## Variants
### Alignment (`alignment`)
Ausrichtung — start (links), center, end (rechts), spread (space-between)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| start | `.nc-form-actions--start` |  |
| center | `.nc-form-actions--center` |  |
| end | `.nc-form-actions--end` |  |
| spread | `.nc-form-actions--spread` |  |

### Variant (`variant`)
Layout-Variante — default (inline), sticky (haftet unten), stacked (vertikal), bordered (Trennlinie)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| sticky | `.nc-form-actions--sticky` |  |
| stacked | `.nc-form-actions--stacked` |  |
| bordered | `.nc-form-actions--bordered` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-form-actions`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-form-actions-gap` | — | — |

## Accessibility
Contrast Target: WCAG AA non-text (3:1)

- hasAccessibleName

## Dependencies
`form`

## Web Components Mapping
Derived from anatomy for potential `<nc-form-actions>` custom element:

```js
class NcFormActions extends HTMLElement {
  static observedAttributes = ['alignment', 'variant'];
  // Slots: default
}
```

---

*Generated from `data/form-actions-recipe.json` by `scripts/generate-component-specs.js`*
