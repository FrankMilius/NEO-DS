# kbd Component Spec
> Version 1.0.0 | Status: stable | Layer: atom

Tags: `static`, `typography`, `keyboard`

## Anatomy
Root element: `.nc-kbd`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| separator | `.nc-kbd__separator` | No | — |

### DOM Notes
- Kbd ist ein natives <kbd class='nc-kbd'> Element — semantisch korrekt fuer Tastatur-Eingaben.
- Verschachtelt fuer Kombinationen: <kbd class='nc-kbd-group'><kbd class='nc-kbd'>Ctrl</kbd><span class='nc-kbd__separator'>+</span><kbd class='nc-kbd'>S</kbd></kbd>.
- __separator ist ein <span> zwischen den Tasten (z.B. '+', 'dann').
- Rein informativ — kein interaktives Element.
- min-width: 1.5em sorgt fuer quadratisches Aussehen bei einzelnen Zeichen.
- box-shadow via elevation-base erzeugt subtilen 3D-Effekt (Tasten-Look).

## Variants
### Variant (`variant`)
Darstellungs-Variante — single (einzelne Taste, Standard), combination (Tastenkombination mit Separator)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| single | — |  |
| combination | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-kbd`

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-kbd-bg` | — | — |
| `nc-kbd-color` | — | — |
| `nc-kbd-border` | — | — |

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-kbd-border-width` | — | — |
| `nc-kbd-radius` | — | — |
| `nc-kbd-padding-x` | — | — |
| `nc-kbd-padding-y` | — | — |
| `nc-kbd-shadow` | — | — |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-kbd-font-family` | — | — |
| `nc-kbd-font-size` | — | — |
| `nc-kbd-font-weight` | — | — |
| `nc-kbd-line-height` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-kbd>` custom element:

```js
class NcKbd extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: default
}
```

---

*Generated from `data/kbd-recipe.json` by `scripts/generate-component-specs.js`*
