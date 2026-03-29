# spacing Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `foundation`, `spacing`, `scale`

## Anatomy
Root element: `.fnd-spacing`

### DOM Notes
- Spacing ist kein gerendertes Element, sondern eine Foundation-Skala.
- 13-Stufen-Skala auf 4px-Basegrid: 4px bis 160px.
- Stufen 01-05 sind statisch, Stufen 06-13 skalieren fluid mit clamp().
- Semantische Aliase: section, component, element, gutter, inline, stack, inset.

## Variants
### Rolle (`role`)
Semantische Spacing-Rolle.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| section | `.section` |  |
| component | `.component` |  |
| element | `.element` |  |
| gutter | `.gutter` |  |
| inline | `.inline` |  |
| stack | `.stack` |  |
| inset | `.inset` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `fnd-spacing`

### Scale
### Semantische Rollen
## Accessibility
- Spacing beeinflusst keine Zugaenglichkeit direkt.
- Ausreichender Abstand zwischen interaktiven Elementen (WCAG 2.5.8 Target Spacing).

## Web Components Mapping
Derived from anatomy for potential `<nc-spacing>` custom element:

```js
class NcSpacing extends HTMLElement {
  static observedAttributes = ['role'];
  // Slots: default
}
```

---

*Generated from `data/spacing-recipe.json` by `scripts/generate-component-specs.js`*
