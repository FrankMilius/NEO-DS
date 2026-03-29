# psychedelic-bg Component Spec
> Version 1.0.0 | Status: experimental | Layer: organism

Tags: `animation`, `background`, `canvas`, `interactive`

## Anatomy
Root element: `.nc-psychedelic-bg`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| canvas | `canvas` | Yes | HTML5 Canvas Element fuer die Musterzeichnung. |

### DOM Notes
- Canvas mit position:absolute fuellt den Container. requestAnimationFrame fuer 60fps Rendering. ResizeObserver passt Canvas-Groesse automatisch an.

## Variants
### Form (`shape`)
Grundform der Musterobjekte

| Value | CSS Modifier | Default |
| --- | --- | --- |
| lines | — |  |
| circles | — |  |
| squares | — |  |
| rectangles | — |  |
| dots | — |  |
| triangles | — |  |
| waves | — |  |

### Maus-Effekt (`mouseEffect`)
Visueller Effekt bei Mausbewegung

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| lens | — |  |
| funnel | — |  |
| distort | — |  |
| repel | — |  |
| attract | — |  |
| ripple | — |  |

### Farbmodus (`colorMode`)
Einfarbig oder mehrfarbig

| Value | CSS Modifier | Default |
| --- | --- | --- |
| mono | — |  |
| palette | — |  |
| gradient | — |  |

### Region (`region`)
Bereich der Anzeige auf dem Hintergrund

| Value | CSS Modifier | Default |
| --- | --- | --- |
| full | — |  |
| horizontal | — |  |
| vertical | — |  |
| diagonal | — |  |

## States
Supported: `default`, `hover`

## CSS Token API
Base classes: `nc-psychedelic-bg`

### Muster
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-psychedelic-bg-line-width` | — | — |
| `nc-psychedelic-bg-frequency` | — | — |
| `nc-psychedelic-bg-amplitude` | — | — |
| `nc-psychedelic-bg-speed` | — | — |
| `nc-psychedelic-bg-phase` | — | — |

### Dichte
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-psychedelic-bg-density` | — | — |
| `nc-psychedelic-bg-gap` | — | — |
| `nc-psychedelic-bg-scale` | — | — |

### Maus-Interaktion
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-psychedelic-bg-mouse-radius` | — | — |
| `nc-psychedelic-bg-mouse-strength` | — | — |
| `nc-psychedelic-bg-mouse-smoothing` | — | — |

### Einfarbig
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-psychedelic-bg-color` | — | — |
| `nc-psychedelic-bg-bg-color` | — | — |
| `nc-psychedelic-bg-opacity` | — | — |

### Farbpalette
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-psychedelic-bg-palette` | — | — |
| `nc-psychedelic-bg-bg-color` | — | — |
| `nc-psychedelic-bg-opacity` | — | — |

### Farbverlauf
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-psychedelic-bg-gradient-start` | — | — |
| `nc-psychedelic-bg-gradient-end` | — | — |
| `nc-psychedelic-bg-bg-color` | — | — |
| `nc-psychedelic-bg-opacity` | — | — |

### Region-Koordinaten
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-psychedelic-bg-region-x1` | — | — |
| `nc-psychedelic-bg-region-y1` | — | — |
| `nc-psychedelic-bg-region-x2` | — | — |
| `nc-psychedelic-bg-region-y2` | — | — |

## Accessibility
Contrast Target: Dekoratives Element, kein Kontrastziel

- Canvas muss aria-hidden='true' haben
- prefers-reduced-motion: reduce → Animation stoppen

## Web Components Mapping
Derived from anatomy for potential `<nc-psychedelic-bg>` custom element:

```js
class NcPsychedelicBg extends HTMLElement {
  static observedAttributes = ['shape', 'mouseEffect', 'colorMode', 'region'];
  // Slots: <slot name="canvas">
}
```

---

*Generated from `data/psychedelic-bg-recipe.json` by `scripts/generate-component-specs.js`*
