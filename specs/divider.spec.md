# divider Component Spec
> Version 1.0.0 | Status: stable | Layer: atom

Tags: `static`, `layout`, `separator`

## Anatomy
Root element: `.nc-divider`

### DOM Notes
- Standard: <hr class='nc-divider'>. Nativer role='separator' ist implizit.
- Vertikal: .nc-divider--vertical. Braucht aria-orientation='vertical'.
- Label-Variante: <div class='nc-divider-label' role='separator'><span>Text</span></div>.
- Label-Variante nutzt ::before/::after Pseudo-Elemente fuer die Linien links und rechts.
- Spacing-Modifier: --sm (8px), --lg (24px), --none (0).
- Style-Modifier: --dashed, --dotted (aendert border-style).
- Strong-Modifier: --strong (dickere Linie, staerkere Farbe).

## Variants
### Orientation (`orientation`)
Ausrichtung — horizontal (Standard) oder vertikal

| Value | CSS Modifier | Default |
| --- | --- | --- |
| horizontal | — |  |
| vertical | `.nc-divider--vertical` |  |

### Variant (`variant`)
Visuelle Variante — default, strong (dickere Linie), with-label (Text in der Mitte)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| strong | `.nc-divider--strong` |  |
| with-label | — |  |

### Style (`style`)
Linien-Stil — solid (Standard), dashed, dotted

| Value | CSS Modifier | Default |
| --- | --- | --- |
| solid | — |  |
| dashed | `.nc-divider--dashed` |  |
| dotted | `.nc-divider--dotted` |  |

### Spacing (`spacing`)
Abstand ober-/unterhalb — sm (8px), md (16px, Standard), lg (24px), none (0)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-divider--sm` |  |
| md | — |  |
| lg | `.nc-divider--lg` |  |
| none | `.nc-divider--none` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-divider`

### Line
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-divider-color` | — | `--mod-divider-color` |
| `--nc-divider-width` | — | `--mod-divider-width` |
| `--nc-divider-style` | — | `--mod-divider-style` |
| `--nc-divider-spacing` | — | `--mod-divider-spacing` |

### Strong
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-divider-strong-color` | — | `--mod-divider-strong-color` |
| `--nc-divider-strong-width` | — | `--mod-divider-strong-width` |

### Label
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-divider-label-color` | — | `--mod-divider-label-color` |
| `--nc-divider-label-size` | — | `--mod-divider-label-size` |
| `--nc-divider-label-weight` | — | `--mod-divider-label-weight` |
| `--nc-divider-label-gap` | — | `--mod-divider-label-gap` |

## Accessibility
Contrast Target: WCAG AA non-text (3:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-divider>` custom element:

```js
class NcDivider extends HTMLElement {
  static observedAttributes = ['orientation', 'variant', 'style', 'spacing'];
  // Slots: default
}
```

---

*Generated from `data/divider-recipe.json` by `scripts/generate-component-specs.js`*
