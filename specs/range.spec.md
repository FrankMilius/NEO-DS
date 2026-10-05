# range Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

Tags: `interactive`, `form`, `range`

## Anatomy
Root element: `.nc-range`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| input | `.nc-range__input` | Yes | — |
| input-max | `.nc-range__input--max` | No | — |
| track | `.nc-range__track` | No | — |
| fill | `.nc-range__fill` | No | — |
| tooltip | `.nc-range__tooltip` | No | — |
| output | `.nc-range__output` | No | — |
| labels | `.nc-range__labels` | No | — |
| label-min | `.nc-range__label-min` | No | — |
| label-max | `.nc-range__label-max` | No | — |

### DOM Notes
- Native <input type='range'> mit Cross-Browser Custom-Styling via Pseudo-Elemente.
- WebKit: ::-webkit-slider-runnable-track + ::-webkit-slider-thumb.
- Firefox: ::-moz-range-track + ::-moz-range-thumb + ::-moz-range-progress (gefuellter Bereich).
- Thumb wird via margin-top auf dem Track zentriert (WebKit).
- CSS-Variable --nc-range-progress (0-100) steuert Fill-Breite und Tooltip-Position.
- Floating Tooltip: Schwebt ueber dem Thumb, sichtbar bei Hover/Focus/Active. Position via left: calc(var(--nc-range-progress) * 1%). Pfeil zeigt nach unten.
- Range-Modus: Zwei ueberlagerte <input type='range'> — pointer-events: none auf dem Input, auto auf den Thumbs. Fill-Bereich zwischen --nc-range-progress-min und --nc-range-progress-max.
- Touch-Target: Input-Hoehe = --nc-range-thumb-touch-size (44px, WCAG 2.5.8). Der sichtbare Thumb bleibt --nc-range-thumb-size.
- Focus-Ring: outline mit --nc-range-thumb-focus-ring-offset (2px) direkt auf dem Pseudo-Element-Thumb, nicht auf dem gesamten Input.
- Output zeigt aktuellen Wert (Tooltip oder Text, via JS aktualisiert).
- Labels zeigen Min/Max-Werte unterhalb des Tracks.
- Hover: Thumb scale(1.15). Focus: focus-ring + border-color auf Thumb.
- Vertikale Variante via writing-mode: vertical-lr + direction: rtl.
- Forced-Colors: Thumb = ButtonText, Track = Canvas + 1px solid ButtonText.
- prefers-reduced-motion: Thumb-Transitions werden deaktiviert.

## Variants
### Orientation (`orientation`)
Ausrichtung — horizontal (Standard) / vertical (Hochformat, 200px Hoehe)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| horizontal | — |  |
| vertical | `.nc-range--vertical` |  |

### Mode (`mode`)
Slider-Modus — single (ein Wert, Standard) / range (zwei Thumbs fuer Min/Max-Spanne)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| single | — |  |
| range | `.nc-range--range` |  |

### Display (`display`)
Anzeige-Optionen — plain (nur Slider), with-tooltip (Floating Tooltip), with-output (statische Wert-Anzeige), with-labels (Min/Max), full (Tooltip + Labels)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| plain | — |  |
| with-tooltip | `.nc-range--tooltip` |  |
| with-output | — |  |
| with-labels | — |  |
| full | `.nc-range--tooltip` |  |

### Validation (`validation`)
Validierungs-State — none (Standard), error (Fehler-Markierung auf Thumb und Fill)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| error | `.nc-range--error` |  |

## States
Supported: `default`, `hover`, `active`, `focus`, `disabled`

- **hover**: 
- **active**: 
- **focus**: 
- **disabled**: 

## CSS Token API
Base classes: `nc-range`

### Track
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-range-track-height` | — | `--mod-range-track-height` |
| `--nc-range-track-bg` | — | `--mod-range-track-bg` |
| `--nc-range-track-bg-active` | — | `--mod-range-track-bg-active` |
| `--nc-range-track-radius` | — | `--mod-range-track-radius` |

### Thumb
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-range-thumb-size` | — | `--mod-range-thumb-size` |
| `--nc-range-thumb-bg` | — | `--mod-range-thumb-bg` |
| `--nc-range-thumb-border` | — | `--mod-range-thumb-border` |
| `--nc-range-thumb-border-width` | — | `--mod-range-thumb-border-width` |
| `--nc-range-thumb-shadow` | — | `--mod-range-thumb-shadow` |
| `--nc-range-thumb-touch-size` | — | `--mod-range-thumb-touch-size` |
| `--nc-range-thumb-focus-ring-offset` | — | `--mod-range-thumb-focus-ring-offset` |

### Interaction
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-range-transition-duration` | — | `--mod-range-transition-duration` |
| `--nc-range-transition-timing` | — | `--mod-range-transition-timing` |

### Floating Tooltip
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-range-tooltip-bg` | — | `--mod-range-tooltip-bg` |
| `--nc-range-tooltip-color` | — | `--mod-range-tooltip-color` |
| `--nc-range-tooltip-radius` | — | `--mod-range-tooltip-radius` |
| `--nc-range-tooltip-font-size` | — | `--mod-range-tooltip-font-size` |
| `--nc-range-tooltip-padding` | — | `--mod-range-tooltip-padding` |
| `--nc-range-tooltip-offset-y` | — | `--mod-range-tooltip-offset-y` |

### Range (Dual Thumb)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-range-range-fill-bg` | — | `--mod-range-range-fill-bg` |

### Disabled
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-range-disabled-opacity` | — | `--mod-range-disabled-opacity` |

## Accessibility
Contrast Target: WCAG AA non-text (3:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-range>` custom element:

```js
class NcRange extends HTMLElement {
  static observedAttributes = ['orientation', 'mode', 'display', 'validation'];
  // Slots: <slot name="input">
}
```

---

*Generated from `data/range-recipe.json` by `scripts/generate-component-specs.js`*
