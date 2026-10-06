# multiselect Component Spec
> Version 1.1.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `molecules`

## Anatomy
Root element: `.nc-multiselect`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| caret | `.nc-multiselect__caret` | Yes | — |
| option | `.nc-multiselect__option` | Yes | — |
| panel | `.nc-multiselect__panel` | Yes | — |
| trigger | `.nc-multiselect__trigger` | Yes | — |
| value | `.nc-multiselect__value` | Yes | — |
| value--empty | `.nc-multiselect__value--empty` | Yes | — |

### DOM Notes
- Feld-Wrapper: .nc-form-field.nc-multiselect (position relative) mit .nc-form-label, Knopf .nc-multiselect__trigger (aria-haspopup, aria-expanded) und Panel .nc-multiselect__panel (absolut unter dem Knopf).
- Optionen sind Checkboxen: label.nc-checkbox.nc-multiselect__option mit .nc-checkbox__input/__control/__label.
- Geoeffnet: .is-open am Feld dreht den Pfeil (.nc-multiselect__caret), das Panel ist nur dann im DOM bzw. sichtbar (neo-theme.js).
- Ohne Auswahl: .nc-multiselect__value--empty mit Platzhaltertext. Fehler: .nc-form-field--invalid faerbt den Rahmen des Knopfs.
- Aus dem Drupal-Theme uebernommen (neo-theme.js, case 'multiselect'); ein Verhalten in neo-behaviors gibt es nicht.

## CSS Token API
Base classes: 

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-multiselect>` custom element:

```js
class NcMultiselect extends HTMLElement {
  static observedAttributes = [];
  // Slots: <slot name="caret">, <slot name="option">, <slot name="panel">, <slot name="trigger">, <slot name="value">, <slot name="value--empty">
}
```

---

*Generated from `data/multiselect-recipe.json` by `scripts/generate-component-specs.js`*
