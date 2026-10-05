# switch Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

Tags: `interactive`, `toggle`, `form`

## Anatomy
Root element: `.nc-switch`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| track | `.nc-switch__track` | Yes | — |
| thumb | `.nc-switch__thumb` | Yes | — |
| indicator-on | `.nc-switch__indicator-on` | No | — |
| indicator-off | `.nc-switch__indicator-off` | No | — |
| label | `.nc-switch__label` | No | — |

### DOM Notes
- Button-Pattern: <button role='switch' aria-checked='true/false'> als Track.
- Input-Pattern: <input type='checkbox' role='switch'> + <span> Track + Thumb.
- Switch braucht IMMER ein sichtbares Label oder aria-label.
- Touch-Target: Der Track erhaelt ein unsichtbares ::after Pseudo-Element mit inset: calc(-1 * --nc-switch-touch-padding). Dadurch wird der Klickbereich auf mindestens 44x44px erweitert (WCAG 2.5.8), ohne das visuelle Design (z.B. 40x20px) zu veraendern.
- Focus-Ring: outline mit --nc-switch-focus-ring-offset (3px) auf dem Track. Der Ring umschliesst den Switch sauber mit Abstand — klemmt nicht direkt auf der pill-foermigen Rundung.
- Thumb-Bewegung per transform: translateX — timing via --nc-switch-transition-timing (cubic-bezier). Respektiert prefers-reduced-motion.
- Squash & Stretch: Bei :active dehnt sich der Thumb in Bewegungsrichtung (scaleX via width-Aenderung). Loslassen loest snap-back mit cubic-bezier Easing aus.
- Track-Indikatoren: .nc-switch--indicators aktiviert I/O Labels im Track. 'O' sichtbar bei unchecked, 'I' sichtbar bei checked. Fade-Transition synced mit Thumb-Bewegung.
- Thumb-Shadow: --nc-switch-thumb-shadow kontrolliert die Elevation. Standard: fnd-shadow-xs fuer plastischen Effekt auf farbigem Track.

## Variants
### Size (`size`)
Groessenabstufung — md (44x24px, Standard) / sm (36x20px, kompakt)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| md | — |  |
| sm | `.nc-switch--sm` |  |

### Pattern (`pattern`)
Implementierungs-Muster: Button-Track (Standard) oder native Checkbox

| Value | CSS Modifier | Default |
| --- | --- | --- |
| button | — |  |
| checkbox | — |  |

### Track Indicators (`indicators`)
Zustandsindikatoren innerhalb des Tracks — none (rein farblich) oder labels (I/O Symbole fuer verbesserte a11y-Erkennbarkeit).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| labels | `.nc-switch--indicators` |  |

## States
Supported: `default`, `hover`, `active`, `checked`, `disabled`, `focus`

- **hover**: 
- **focus**: 
- **active**: 

## CSS Token API
Base classes: `nc-switch`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-switch-width` | — | `--mod-switch-width` |
| `--nc-switch-height` | — | `--mod-switch-height` |
| `--nc-switch-radius` | — | `--mod-switch-radius` |
| `--nc-switch-touch-padding` | — | `--mod-switch-touch-padding` |
| `--nc-switch-focus-ring-offset` | — | `--mod-switch-focus-ring-offset` |

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-switch-bg` | — | `--mod-switch-bg` |
| `--nc-switch-bg-hover` | — | `--mod-switch-bg-hover` |
| `--nc-switch-bg-checked` | — | `--mod-switch-bg-checked` |

### Thumb
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-switch-thumb-size` | — | `--mod-switch-thumb-size` |
| `--nc-switch-thumb-color` | — | `--mod-switch-thumb-color` |
| `--nc-switch-thumb-offset` | — | `--mod-switch-thumb-offset` |
| `--nc-switch-thumb-shadow` | — | `--mod-switch-thumb-shadow` |

### Disabled
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-switch-disabled-bg` | — | `--mod-switch-disabled-bg` |
| `--nc-switch-disabled-thumb` | — | `--mod-switch-disabled-thumb` |
| `--nc-switch-disabled-opacity` | — | `--mod-switch-disabled-opacity` |

### Label
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-switch-label-gap` | — | `--mod-switch-label-gap` |
| `--nc-switch-label-color` | — | `--mod-switch-label-color` |

### Interaction
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-switch-transition-duration` | — | `--mod-switch-transition-duration` |
| `--nc-switch-transition-timing` | — | `--mod-switch-transition-timing` |
| `--nc-switch-thumb-active-scale` | — | `--mod-switch-thumb-active-scale` |

### Track Indicators
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-switch-indicator-color` | — | `--mod-switch-indicator-color` |
| `--nc-switch-indicator-checked-color` | — | `--mod-switch-indicator-checked-color` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Space` | toggle | Schaltet um (Button-Muster: aria-checked; Checkbox-Muster: nativ). |
| `Enter` | toggle | Schaltet um — nur Button-Muster (nativer Klick des <button>). |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `switch-change` | Yes | `{"checked":"boolean"}` |

## Accessibility
Contrast Target: WCAG AA non-text (3:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-switch>` custom element:

```js
class NcSwitch extends HTMLElement {
  static observedAttributes = ['size', 'pattern', 'indicators'];
  // Slots: <slot name="track">, <slot name="thumb">
}
```

---

*Generated from `data/switch-recipe.json` by `scripts/generate-component-specs.js`*
