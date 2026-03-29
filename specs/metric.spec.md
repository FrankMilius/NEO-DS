# metric Component Spec
> Version 2.0.0 | Status: stable | Layer: molecule

Tags: `display`, `data`, `content`, `dashboard`

## Anatomy
Root element: `.nc-metric`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| label | `.nc-metric__label` | No | — |
| value-row | `.nc-metric__value-row` | Yes | — |
| value | `.nc-metric__value` | Yes | — |
| unit | `.nc-metric__unit` | No | — |
| trend | `.nc-metric__trend` | No | — |
| footer | `.nc-metric__footer` | No | — |

### DOM Notes
- Container: Flex-Column mit gap. Solid: inverse BG + inverse Text. Subtle: helle BG + primaere Farben.
- Label: Dezente Beschriftung ueber dem Wert (z.B. 'Gesamtumsatz', 'Aktive Nutzer').
- Value-Row: Flex align-baseline Zeile fuer Value + Unit nebeneinander.
- Value: Grosse Zahl — font-heading, font-weight-black, accent-Farbe. tabular-nums fuer stabile Breite.
- Unit: Einheit neben dem Wert ($, %, kg). Gleiche accent-Farbe, kleinere Schrift.
- Trend: Inline-Flex mit Icon + Prozentwert. Farbe via Modifier: --trend-up (Success), --trend-down (Danger), --trend-neutral.
- Trend-Icon: SVG 16px, stroke: currentColor. Arrow-up fuer positiv, arrow-down fuer negativ, minus fuer neutral.
- Footer: Vergleichszeitraum (z.B. 'vs. Vorjahr', 'letzte 30 Tage'). Gedaempfte Opazitaet.
- Size md: Kompakt fuer Sidebar-Cards und Dense-Grids. Reduzierte Font-Sizes und Padding.
- Size xl: Hero-Groesse fuer Marketing-Sektionen. Uebergrosse Zahl (fs-8xl).

## Variants
### Emphasis (`emphasis`)
Hintergrund-Stil — solid (inverse, dunkel) oder subtle (hell, dezent)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| solid | — |  |
| subtle | `.nc-metric--subtle` |  |

### Size (`size`)
Groesse — md (kompakt), lg (Standard), xl (Hero)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| md | `.nc-metric--md` |  |
| lg | — |  |
| xl | `.nc-metric--xl` |  |

### Trend (`trend`)
Richtungsindikator — up (positiv/Success), down (negativ/Danger), neutral (unveraendert)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| up | `.nc-metric--trend-up` |  |
| down | `.nc-metric--trend-down` |  |
| neutral | `.nc-metric--trend-neutral` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-metric`

### Container
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-metric-bg` | — | — |
| `nc-metric-color` | — | — |
| `nc-metric-radius` | — | — |
| `nc-metric-padding` | — | — |
| `nc-metric-gap` | — | — |

### Value (Big Number)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-metric-value-font-family` | — | — |
| `nc-metric-value-font-size` | — | — |
| `nc-metric-value-font-weight` | — | — |
| `nc-metric-value-color` | — | — |
| `nc-metric-value-line-height` | — | — |

### Unit
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-metric-unit-font-size` | — | — |
| `nc-metric-unit-color` | — | — |
| `nc-metric-unit-font-weight` | — | — |

### Label
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-metric-label-font-size` | — | — |
| `nc-metric-label-color` | — | — |
| `nc-metric-label-font-weight` | — | — |
| `nc-metric-label-opacity` | — | — |

### Trend Indicator
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-metric-trend-font-size` | — | — |
| `nc-metric-trend-font-weight` | — | — |
| `nc-metric-trend-gap` | — | — |
| `nc-metric-trend-icon-size` | — | — |
| `nc-metric-trend-up-color` | — | — |
| `nc-metric-trend-down-color` | — | — |
| `nc-metric-trend-neutral-color` | — | — |

### Footer
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-metric-footer-font-size` | — | — |
| `nc-metric-footer-color` | — | — |
| `nc-metric-footer-opacity` | — | — |

### Subtle Emphasis
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-metric-subtle-bg` | — | — |
| `nc-metric-subtle-color` | — | — |
| `nc-metric-subtle-value-color` | — | — |
| `nc-metric-subtle-label-color` | — | — |
| `nc-metric-subtle-label-opacity` | — | — |
| `nc-metric-subtle-footer-color` | — | — |
| `nc-metric-subtle-footer-opacity` | — | — |

### Size MD
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-metric-md-padding` | — | — |
| `nc-metric-md-value-font-size` | — | — |
| `nc-metric-md-unit-font-size` | — | — |
| `nc-metric-md-label-font-size` | — | — |

### Size XL
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-metric-xl-padding` | — | — |
| `nc-metric-xl-value-font-size` | — | — |
| `nc-metric-xl-unit-font-size` | — | — |
| `nc-metric-xl-label-font-size` | — | — |

## Accessibility
Contrast Target: WCAG AA large text (3:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-metric>` custom element:

```js
class NcMetric extends HTMLElement {
  static observedAttributes = ['emphasis', 'size', 'trend'];
  // Slots: <slot name="value-row">, <slot name="value">
}
```

---

*Generated from `data/metric-recipe.json` by `scripts/generate-component-specs.js`*
