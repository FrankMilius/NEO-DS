# pagination Component Spec
> Version 2.0.0 | Status: stable | Layer: molecule

Tags: `navigation`, `list`, `data`

## Anatomy
Root element: `.nc-pagination`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| prev | `.nc-pagination__prev` | Yes | — |
| list | `.nc-pagination__list` | Yes | — |
| item | `.nc-pagination__item` | Yes | — |
| ellipsis | `.nc-pagination__ellipsis` | No | — |
| next | `.nc-pagination__next` | Yes | — |
| info | `.nc-pagination__info` | No | — |
| jumper | `.nc-pagination__jumper` | No | — |

### DOM Notes
- Root: <nav aria-label='Seitennavigation'> — landmark fuer Screen Reader.
- Seitenzahlen als <button> oder <a>. Aktive Seite: aria-current='page'.
- Prev/Next: <button> mit SVG-Chevron. Am Rand: aria-disabled='true'.
- Ellipsis: <span> mit .u-sr-only 'Weitere Seiten'.
- Info: Minimal-Variante zeigt 'Seite X von Y' statt Seitenzahlen.
- Jumper: <input type='number'> fuer direkte Seiteneingabe.
- Touch-Target: unsichtbarer ::before min. 44px fuer Mobile-Tap.
- tabular-nums: Gleichbreite Ziffern verhindern Layout-Sprung bei Seitenwechsel.

## Variants
### Size (`size`)
Groesse der Seitenbuttons — md (32px, default), sm (28px, kompakt)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| md | — |  |
| sm | `.nc-pagination--sm` |  |

### Alignment (`alignment`)
Horizontale Ausrichtung der Pagination

| Value | CSS Modifier | Default |
| --- | --- | --- |
| start | — |  |
| center | `.nc-pagination--center` |  |
| end | `.nc-pagination--end` |  |
| between | `.nc-pagination--between` |  |

### Appearance (`appearance`)
Visueller Stil — default (Hintergrund), pill (abgerundet), outline (Border), minimal (nur Prev/Next + Info)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| pill | `.nc-pagination--pill` |  |
| outline | `.nc-pagination--outline` |  |
| minimal | `.nc-pagination--minimal` |  |

### Elevation (`elevation`)
Shadow auf aktiver Seite — none (flach), raised (Schatten)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| raised | `.nc-pagination--raised` |  |

### Features (`features`)
Zusaetzliche Funktionen — default, with-indicator (Unterlinie), with-jumper (Go-to Input)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| with-indicator | `.nc-pagination--with-indicator` |  |
| with-jumper | `.nc-pagination--with-jumper` |  |

## States
Supported: `default`, `hover`, `focus`, `active`, `disabled`

- **active**: 
- **disabled**: 
- **hover**: 
- **focus**: 

## CSS Token API
Base classes: `nc-pagination`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-pagination-gap` | — | `--mod-pagination-gap` |
| `--nc-pagination-padding` | — | `--mod-pagination-padding` |
| `--nc-pagination-color` | — | `--mod-pagination-color` |
| `--nc-pagination-font-size` | — | `--mod-pagination-font-size` |

### Page Item
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-pagination-item-size` | — | `--mod-pagination-item-size` |
| `--nc-pagination-item-radius` | — | `--mod-pagination-item-radius` |
| `--nc-pagination-item-bg` | — | `--mod-pagination-item-bg` |
| `--nc-pagination-item-bg-hover` | — | `--mod-pagination-item-bg-hover` |
| `--nc-pagination-item-bg-active` | — | `--mod-pagination-item-bg-active` |
| `--nc-pagination-item-color` | — | `--mod-pagination-item-color` |
| `--nc-pagination-item-color-active` | — | `--mod-pagination-item-color-active` |
| `--nc-pagination-item-font-weight` | — | `--mod-pagination-item-font-weight` |

### Navigation (Prev/Next)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-pagination-nav-color` | — | `--mod-pagination-nav-color` |
| `--nc-pagination-nav-color-disabled` | — | `--mod-pagination-nav-color-disabled` |

### Ellipsis
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-pagination-ellipsis-color` | — | `--mod-pagination-ellipsis-color` |

### Active Indicator
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-pagination-active-indicator-height` | — | `--mod-pagination-active-indicator-height` |
| `--nc-pagination-active-indicator-color` | — | `--mod-pagination-active-indicator-color` |

### Raised (Shadow)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-pagination-item-shadow-active` | — | `--mod-pagination-item-shadow-active` |

### Touch Target
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-pagination-touch-min` | — | `--mod-pagination-touch-min` |

### Minimal-Variante
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-pagination-minimal-info-color` | — | `--mod-pagination-minimal-info-color` |
| `--nc-pagination-minimal-info-size` | — | `--mod-pagination-minimal-info-size` |

### Jumper (Go-to-Page)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-pagination-jumper-width` | — | `--mod-pagination-jumper-width` |
| `--nc-pagination-jumper-height` | — | `--mod-pagination-jumper-height` |
| `--nc-pagination-jumper-radius` | — | `--mod-pagination-jumper-radius` |
| `--nc-pagination-jumper-border` | — | `--mod-pagination-jumper-border` |
| `--nc-pagination-jumper-font-size` | — | `--mod-pagination-jumper-font-size` |
| `--nc-pagination-jumper-color` | — | `--mod-pagination-jumper-color` |

### Outline-Variante
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-pagination-outline-border` | — | `--mod-pagination-outline-border` |
| `--nc-pagination-outline-border-active` | — | `--mod-pagination-outline-border-active` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-pagination>` custom element:

```js
class NcPagination extends HTMLElement {
  static observedAttributes = ['size', 'alignment', 'appearance', 'elevation', 'features'];
  // Slots: <slot name="prev">, <slot name="list">, <slot name="item">, <slot name="next">
}
```

---

*Generated from `data/pagination-recipe.json` by `scripts/generate-component-specs.js`*
