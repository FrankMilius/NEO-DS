# slider Component Spec
> Version 2.0.0 | Status: stable | Layer: molecule

Tags: `interactive`, `form`, `range`

## Anatomy
Root element: `.nc-slider`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| input | `.nc-slider__input` | Yes | — |
| input-max | `.nc-slider__input--max` | No | — |
| track | `.nc-slider__track` | No | — |
| fill | `.nc-slider__fill` | No | — |
| tooltip | `.nc-slider__tooltip` | No | — |
| output | `.nc-slider__output` | No | — |
| labels | `.nc-slider__labels` | No | — |
| label-min | `.nc-slider__label-min` | No | — |
| label-max | `.nc-slider__label-max` | No | — |

### DOM Notes
- Native <input type='range'> mit Cross-Browser Custom-Styling via Pseudo-Elemente.
- WebKit: ::-webkit-slider-runnable-track + ::-webkit-slider-thumb.
- Firefox: ::-moz-range-track + ::-moz-range-thumb + ::-moz-range-progress (gefuellter Bereich).
- Thumb wird via margin-top auf dem Track zentriert (WebKit).
- CSS-Variable --nc-slider-progress (0-100) steuert Fill-Breite und Tooltip-Position.
- Floating Tooltip: Schwebt ueber dem Thumb, sichtbar bei Hover/Focus/Active. Position via left: calc(var(--nc-slider-progress) * 1%). Pfeil zeigt nach unten.
- Range-Modus: Zwei ueberlagerte <input type='range'> — pointer-events: none auf dem Input, auto auf den Thumbs. Fill-Bereich zwischen --nc-slider-progress-min und --nc-slider-progress-max.
- Touch-Target: Input-Hoehe = --nc-slider-thumb-touch-size (44px, WCAG 2.5.8). Der sichtbare Thumb bleibt --nc-slider-thumb-size.
- Focus-Ring: outline mit --nc-slider-thumb-focus-ring-offset (2px) direkt auf dem Pseudo-Element-Thumb, nicht auf dem gesamten Input.
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
| vertical | `.nc-slider--vertical` |  |

### Mode (`mode`)
Slider-Modus — single (ein Wert, Standard) / range (zwei Thumbs fuer Min/Max-Spanne)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| single | — |  |
| range | `.nc-slider--range` |  |

### Display (`display`)
Anzeige-Optionen — plain (nur Slider), with-tooltip (Floating Tooltip), with-output (statische Wert-Anzeige), with-labels (Min/Max), full (Tooltip + Labels)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| plain | — |  |
| with-tooltip | `.nc-slider--tooltip` |  |
| with-output | — |  |
| with-labels | — |  |
| full | `.nc-slider--tooltip` |  |

### Validation (`validation`)
Validierungs-State — none (Standard), error (Fehler-Markierung auf Thumb und Fill)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| error | `.nc-slider--error` |  |

## States
Supported: `default`, `hover`, `active`, `focus`, `disabled`

- **hover**: 
- **active**: 
- **focus**: 
- **disabled**: 

## CSS Token API
Base classes: `nc-slider`

### Track
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-slider-track-height` | — | — |
| `nc-slider-track-bg` | — | — |
| `nc-slider-track-bg-active` | — | — |
| `nc-slider-track-radius` | — | — |

### Thumb
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-slider-thumb-size` | — | — |
| `nc-slider-thumb-bg` | — | — |
| `nc-slider-thumb-border` | — | — |
| `nc-slider-thumb-border-width` | — | — |
| `nc-slider-thumb-shadow` | — | — |
| `nc-slider-thumb-touch-size` | — | — |
| `nc-slider-thumb-focus-ring-offset` | — | — |

### Interaction
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-slider-transition-duration` | — | — |
| `nc-slider-transition-timing` | — | — |

### Floating Tooltip
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-slider-tooltip-bg` | — | — |
| `nc-slider-tooltip-color` | — | — |
| `nc-slider-tooltip-radius` | — | — |
| `nc-slider-tooltip-font-size` | — | — |
| `nc-slider-tooltip-padding` | — | — |
| `nc-slider-tooltip-offset-y` | — | — |

### Range (Dual Thumb)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-slider-range-fill-bg` | — | — |

### Disabled
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-slider-disabled-opacity` | — | — |

## Accessibility
Contrast Target: WCAG AA non-text (3:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-slider>` custom element:

```js
class NcSlider extends HTMLElement {
  static observedAttributes = ['orientation', 'mode', 'display', 'validation'];
  // Slots: <slot name="input">
}
```

---

*Generated from `data/slider-recipe.json` by `scripts/generate-component-specs.js`*
