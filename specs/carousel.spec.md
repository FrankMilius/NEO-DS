# carousel Component Spec
> Version 1.1.0 | Status: stable | Layer: molecule

Tags: `layout`, `media`, `carousel`

## Anatomy
Root element: `.nc-carousel`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| track | `.nc-carousel__track` | Yes | Waagerechte Spur mit scroll-snap. Jedes direkte Kind rastet am Anfang ein. |
| controls | `.nc-carousel__controls` | No | Blaetter-Schaltflaechen, rechtsbuendig unter der Spur. |

### DOM Notes
- Die Spur ist ein Grid mit grid-auto-flow: column — die Elemente stehen nebeneinander, unabhaengig von ihrer Zahl.
- Spaltenbreite minmax(360px, 1fr), unter 720px minmax(260px, 85vw). Der angeschnittene Rest der naechsten Karte zeigt, dass es weitergeht.
- scroll-snap-type: x mandatory am Track, scroll-snap-align: start an den Kindern.

## Variants
### Medien-Variante (`media`)
Fuer randlose Inhalte: nimmt die Polsterung heraus und gibt die Spaltenbreite frei, statt sie auf 360px zu zwingen.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| media | `.nc-carousel--media` |  |

### Steuerung (`controls`)
Blaetter-Knoepfe (.nc-carousel__controls) — Zugabe, kein Ersatz fuer die bedienbare Spur.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| with | — |  |
| without | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-carousel`

### Layout
## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-carousel>` custom element:

```js
class NcCarousel extends HTMLElement {
  static observedAttributes = ['media', 'controls'];
  // Slots: <slot name="track">
}
```

---

*Generated from `data/carousel-recipe.json` by `scripts/generate-component-specs.js`*
