# carousel Component Spec
> Version 1.2.0 | Status: stable | Layer: molecule

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
- Verhalten (neo-behaviors carousel, Plan v4, Phase 6a): bindet an die Wurzel; Paddles (data-fg-prev/-next bzw. die Paddle-Haken --prev/--next der Galerie) und Punkte (nav-dot der Galerie) sucht es in der Huelle der Website-Geraete-Galerie ([data-neo-fg-carousel]) oder in der Wurzel (__controls).
- Punkte sind <a href="#figur"> — ohne Skript springt der Browser zur Figur; mit Skript scrollt die Spur. Der gewaehlte Punkt traegt .is-active und aria-current=true.

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
## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | focus-next | Spur (tabindex=0), Paddles, dann jeder Punkt (Verweise, alle in der Tab-Folge). |
| `ArrowRight` | scroll | Auf der Spur: der Browser scrollt waagerecht (nativ, scroll-snap rastet ein); die Punkte folgen nach Ruhe der Spur. |
| `ArrowLeft` | scroll | Wie Pfeil rechts, in die andere Richtung. |
| `Enter` | activate | Auf einem Punkt: scrollt die Spur zur Figur (statt der Seite) und markiert ihn (aria-current). Auf einem Paddle: blaettert um eine Figur. |
| `Space` | activate | Auf einem Paddle: wie Enter (nativer Klick). Auf einem Punkt (Verweis) ohne Wirkung des Behaviors. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `carousel-change` | Yes | `{"index":"number","previousIndex":"number"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Die Spur ist waagerecht scrollbar und damit ueber die Tastatur erreichbar, sobald sie den Fokus bekommt — sie braucht dafuer tabindex="0" und eine Beschriftung im Markup.
- Blaetter-Schaltflaechen sind Zugabe, kein Ersatz: Wer sie weglaesst, muss sicherstellen, dass die Spur selbst bedienbar bleibt.
- 2.3.3: Blaettern und Punkte scrollen weich nur ohne prefers-reduced-motion (neo-behaviors carousel), sonst sofort.
- 4.1.2: Der Punkt der gewaehlten Figur traegt aria-current=true (Punkte sind Verweise, keine Tabs); er folgt auch beim Wischen.

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
