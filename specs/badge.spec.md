# badge Component Spec
> Version 2.2.0 | Status: stable | Layer: atom

Tags: `static`, `indicator`, `label`

## Anatomy
Root element: `.nc-badge`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| icon | `.nc-badge__icon` | No | — |
| label | `.nc-badge__label` | Yes | — |

### DOM Notes
- Badge ist NIEMALS fokussierbar — immer <span>, kein role='button', kein tabindex.
- Farbe nie als einziges Signal verwenden — immer mit Text oder Icon kombinieren.
- Dot-Mode: slot-loses Display, zeigt nur Farbe ohne Text. Benoetigt begleitendes aria-label.
- Counter-Mode: numerischer Inhalt mit min-width fuer gleichmaessige Kreise.
- Decorator-Mode: position:absolute auf Parent (braucht position:relative). Ring-Shadow fuer Abgrenzung.
- Pulse-Animation: --dot.--pulse fuer kritische Status (error). Dezentes Pulsieren.
- Status-String: --status-string — reiner Text ohne BG, fuer Tabellen / dichte UIs.

## Variants
### Tone (`tone`)
Farb-Semantik der Badge

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| secondary | `.nc-badge--secondary` |  |
| success | `.nc-badge--success` |  |
| warning | `.nc-badge--warning` |  |
| error | `.nc-badge--error` |  |
| info | `.nc-badge--info` |  |

### Emphasis (`emphasis`)
Visuelle Gewichtung — Solid (Standard), Outline (Rand), Soft (reduzierte Deckkraft)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| solid | — |  |
| outline | `.nc-badge--outline` |  |
| soft | `.nc-badge--soft` |  |

### Size (`size`)
Groessenabstufung — SM (20px) / MD (24px, Standard)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-badge--sm` |  |
| md | — |  |

### Decorator (`decorator`)
Zusaetzliche visuelle Elemente oder Render-Modi

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| icon | — |  |
| dot | `.nc-badge--dot` |  |
| counter | — |  |
| decorator | `.nc-badge--decorator` |  |
| pulse | `.nc-badge--dot nc-badge--pulse` |  |
| status-string | `.nc-badge--status-string` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-badge`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-badge-height-sm` | — | — |
| `nc-badge-height-md` | — | — |
| `nc-badge-radius` | — | — |
| `nc-badge-padding-x-sm` | — | — |
| `nc-badge-padding-x-md` | — | — |
| `nc-badge-gap` | — | — |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-badge-font-size-sm` | — | — |
| `nc-badge-font-size-md` | — | — |
| `nc-badge-font-weight` | — | — |
| `nc-badge-letter-spacing` | — | — |
| `nc-badge-line-height` | — | — |
| `nc-badge-label-max-width` | — | — |

### Extras (Dot / Icon)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-badge-dot-size` | — | — |
| `nc-badge-dot-radius` | — | — |
| `nc-badge-icon-size` | — | — |

### Default
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-badge-default-bg` | — | — |
| `nc-badge-default-color` | — | — |
| `nc-badge-default-border` | — | — |

### Secondary
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-badge-secondary-bg` | — | — |
| `nc-badge-secondary-color` | — | — |
| `nc-badge-secondary-border` | — | — |

### Success
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-badge-success-bg` | — | — |
| `nc-badge-success-color` | — | — |
| `nc-badge-success-border` | — | — |

### Warning
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-badge-warning-bg` | — | — |
| `nc-badge-warning-color` | — | — |
| `nc-badge-warning-border` | — | — |

### Error
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-badge-error-bg` | — | — |
| `nc-badge-error-color` | — | — |
| `nc-badge-error-border` | — | — |

### Info
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-badge-info-bg` | — | — |
| `nc-badge-info-color` | — | — |
| `nc-badge-info-border` | — | — |

### Outline
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-badge-outline-bg` | — | — |
| `nc-badge-outline-color` | — | — |
| `nc-badge-outline-border` | — | — |
| `nc-badge-border-width` | — | — |

### Soft
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-badge-soft-opacity` | — | — |

### Positioning (Decorator)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-badge-top-offset` | — | — |
| `nc-badge-right-offset` | — | — |
| `nc-badge-ring-width` | — | — |
| `nc-badge-ring-color` | — | — |

### Pulse Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-badge-pulse-duration` | — | — |
| `nc-badge-pulse-scale` | — | — |
| `nc-badge-pulse-opacity` | — | — |

### Status String
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-badge-status-font-weight` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- doNotRelyOnColorOnly

## Web Components Mapping
Derived from anatomy for potential `<nc-badge>` custom element:

```js
class NcBadge extends HTMLElement {
  static observedAttributes = ['tone', 'emphasis', 'size', 'decorator'];
  // Slots: <slot name="label">
}
```

---

*Generated from `data/badge-recipe.json` by `scripts/generate-component-specs.js`*
