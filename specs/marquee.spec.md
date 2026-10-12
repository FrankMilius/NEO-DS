# marquee Component Spec
> Version 1.3.0 | Status: stable | Layer: molecule

Tags: `display`, `animation`, `decorative`

## Anatomy
Root element: `.nc-marquee`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| pause | `.nc-marquee__pause` | No | Pause-Knopf vor der Spur (WCAG 2.2.2): Symbol .nc-marquee__pause-icon (Pfade -pause/-play, Wahl per data-playing) und Beschriftung .nc-marquee__pause-label „Laufband anhalten“/„Laufband fortsetzen“. Bei prefers-reduced-motion [hidden]. |
| track | `.nc-marquee__track` | Yes | — |
| text | `.nc-marquee__text` | Yes | — |

### DOM Notes
- Overflow:hidden Container. Track: inline-flex, gap 2.5rem, will-change:transform.
- Text: uppercase, letter-spacing 0.08em, clamp font-size.
- Bewegung (Entscheidung 06.10.2026): .nc-marquee__track laeuft endlos (Keyframes `marquee`, translate um die halbe Spur) — der Inhalt steht deshalb zweimal in der Spur. Dauer --nc-marquee-duration. prefers-reduced-motion: die Spur steht.
- Verhalten (Plan v4, Phase 2, 12.10.2026): neo-behaviors marquee — Knopf vor der Spur schaltet die Bewegung (data-playing, .is-stopped); Maus ueber der Spur und Fokus im Laufband ruhen (.is-paused, animation-play-state); Duplikate (aria-hidden=true) mit tabindex=-1 an allem Fokussierbaren, nicht inert (Maus und Hover bleiben). Dekorativer Lauftext: aria-hidden an der Spur, nicht an der Wurzel.

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`, `hover`, `focus-visible`, `paused`, `stopped`

- **hover**: 
- **focus-visible**: 
- **paused**: 
- **stopped**: 

## CSS Token API
Base classes: `nc-marquee`

### Base
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-marquee-duration` | — | `--mod-marquee-duration` |

### Pause-Knopf
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-marquee-pause-min-size` | — | — |
| `--nc-marquee-pause-padding-inline` | — | — |
| `--nc-marquee-pause-gap` | — | — |
| `--nc-marquee-pause-radius` | — | — |
| `--nc-marquee-pause-font-size` | — | — |
| `--nc-marquee-pause-icon-size` | — | — |
| `--nc-marquee-pause-margin-block` | — | — |
| `--nc-marquee-pause-color` | — | — |
| `--nc-marquee-pause-color-hover` | — | — |
| `--nc-marquee-pause-border` | — | — |
| `--nc-marquee-pause-bg-hover` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | focus-next | Erst der Knopf (vor der Spur), dann die Glieder der ersten Haelfte mit Links; Duplikate (tabindex=-1) werden uebersprungen. Fokus im Laufband haelt es voruebergehend an. |
| `Enter` | activate | Auf dem Knopf: haelt das Laufband an bzw. setzt es fort. |
| `Space` | activate | Wie Enter. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `marquee-autoplay` | Yes | `{"playing":"boolean","reason":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- 2.2.2: Die Bewegung (laenger als 5 s, neben anderem Inhalt) laesst sich per Knopf vor der Spur anhalten und fortsetzen (Beschriftung wechselt); Maus und Fokus halten voruebergehend an; prefers-reduced-motion: die Spur steht.
- 2.4.3/4.1.2: Duplikate der Spur aria-hidden, alles Fokussierbare darin tabindex=-1 (kein aria-hidden-focus, nicht per Tab erreichbar); mit der Maus bleiben sie bedienbar. Der Knopf steht in der Tab-Folge vor der Spur.
- 2.5.8: Knopf mindestens 2.5rem (40 px) hoch und breit.
- 3.1.2: Knopftexte nach lang (de/en), ueberschreibbar per data-text-pause/data-text-play.
- 1.3.1: Dekorativer Lauftext aria-hidden an der Spur; Knopfsymbol aria-hidden.

## Web Components Mapping
Derived from anatomy for potential `<nc-marquee>` custom element:

```js
class NcMarquee extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="track">, <slot name="text">
}
```

---

*Generated from `data/marquee-recipe.json` by `scripts/generate-component-specs.js`*
