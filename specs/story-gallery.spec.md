# story-gallery Component Spec
> Version 1.8.0 | Status: stable | Layer: organism

Tags: `display`, `gallery`, `scroll`, `cards`

## Anatomy
Root element: `.nc-story-gallery`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| scroll | `.nc-story-gallery__scroll` | Yes | — |
| track | `.nc-story-gallery__track` | Yes | — |
| card | `.nc-story-gallery__card` | Yes | — |
| media | `.nc-story-gallery__media` | Yes | — |
| caption | `.nc-story-gallery__caption` | Yes | — |
| title | `.nc-story-gallery__title` | Yes | — |
| desc | `.nc-story-gallery__desc` | No | — |
| footer | `.nc-story-gallery__footer` | No | — |
| progress | `.nc-story-gallery__progress` | No | — |
| progress-bar | `.nc-story-gallery__progress-bar` | No | — |
| paddles | `.nc-story-gallery__paddles` | No | — |
| paddle | `.nc-story-gallery__paddle` | No | — |
| cursor-paddle | `.nc-story-gallery__cursor-paddle` | No | — |
| cursor-icon | `.nc-story-gallery__cursor-icon` | No | — |

### DOM Notes
- Horizontale Scroll-Gallery mit Caption-Cards (Apple-Style).
- Markup wie block--block-content--neo-story-gallery.html.twig: __footer (Fortschritt __progress links, Pfeile __paddles--below rechts) ist Geschwister der Galerie — bei navigation below und im Endlos-Modus; __paddles--overlay liegt in der Galerie (nur overlay ohne Endlos-Modus). Ein .nc-section-header direkt davor wird zum Kopf der Galerie (linksbuendig, Token-Gruppe head).
- Website-only (kein CSS im DS, die Arena laesst sie weg): .nc-story-gallery--nav-below — setzt das Twig (block--…--neo-story-gallery.html.twig), wenn die Paddles unter der Galerie stehen.
- Medienflaeche: .nc-story-gallery__media hat Innenabstand (stage-padding) oben und seitlich; ::after zeichnet Ecken und Schatten des Bildschirms ueber dem Bild. nc-shot rechnet Fokus und Zoom im eingerueckten Bildkasten (I16 Phase 6 gemessen: Fokuspunkt auf 2 px).
- Blaettern: Pfeile, Cursor-Paddle und Fortschritt steuert neo_fe/js/neo-story-gallery.js (setzt --sg-fortschritt-breite und --sg-fortschritt-lage am Balken); die Bewegung der Spur ist scroll-behavior: smooth aus dem DS (bei prefers-reduced-motion: auto).
- Blaettern: Paddles und Cursor-Paddle steuert neo-theme.js; die Bewegung der Spur ist scroll-behavior: smooth aus dem DS (bei prefers-reduced-motion: auto).
- Karten-Video (Plan v4, Phase 3): .nc-story-gallery__media mit [data-neo-video]; Knopf .nc-video-pause (Recipe video) unten am Ende des Mediums; in Kopien (aria-hidden) tabindex=-1.
- Kartenhöhe (I18, 24.11.2026): Die Vorlage setzt den Blockwert als --sg-card-height-block im Inline-Stil der Galerie; das DS leitet daraus --sg-card-height ab und ersetzt ihn bis 768 px durch --nc-story-gallery-card-height-mobile. Karten sind dort höchstens 100cqi des Scrollers minus --nc-story-gallery-peek-mobile breit.
- Anordnung (I18 Phase 9, 24.11.2026): includes/neo_story_gallery.inc liest den Kartenschlüssel „anordnung“ (unten|rechts|links|ganz), Vorgabe ohne Wahl: Hochformat (Breite < Höhe) „ganz“, sonst keine Klasse; bei „ganz“ setzt sie Zoom 1 und Fokus Mitte im data-sg-shot. Der Editor (neo_fe/js/neo-shot-editor.js) bietet vier Knöpfe mit Bildchen und rückt bei „rechts“/„links“ einen mittigen Fokus an die sichtbare Kante.
- Kartenfläche (I18 Phase 11, 24.11.2026): neo_fe includes/neo_story_gallery.inc (_neo_fe_sg_flaeche) prüft Block-Feld und Kartenschlüssel und gibt nur var(--nc-story-gallery-stage-bg-*), var(--fnd-primitive-<palette>-<stufe>), transparent oder #hex aus; die Vorlage setzt den Wert als --nc-story-gallery-stage-bg im style der Galerie bzw. Karte. Farbfelder im Karten-Editor (js/neo-shot-editor.js) lesen die Paletten aus css/neo-shot-vorschau.css (scripts/baue-shot-vorschau.mjs, kartenflaechenTokens).

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

### Paddles (`navigation`)
Lage der Blaetter-Knoepfe.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| below | — |  |
| overlay | — |  |

### Anordnung (`anordnung`)
Wo der Screen die Medienfläche verlässt — je Karte (Karten-JSON „anordnung“), Klasse an der Karte .nc-story-gallery__card--anordnung-*. Ohne Wahl: Hochformat „ganz“, sonst „unten“ (I18 Phase 9, E3 Frank).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| unten | — |  |
| rechts | — |  |
| links | — |  |
| ganz | — |  |

### Endlos (`loop`)
Endlose Spur aus Kopien; Fussleiste mit Fortschritt je Runde und zusaetzlich Cursor-Paddle.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| off | — |  |
| on | `.nc-story-gallery--loop` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-story-gallery`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-story-gallery-card-height` | — | — |
| `--nc-story-gallery-card-height-mobile` | — | — |
| `--nc-story-gallery-peek-mobile` | — | — |
| `--nc-story-gallery-gap` | — | — |
| `--nc-story-gallery-gap-mobile` | — | — |
| `--nc-story-gallery-radius` | — | — |
| `--nc-story-gallery-ratio-min` | — | — |
| `--nc-story-gallery-ratio-min-mobile` | — | — |
| `--nc-story-gallery-ratio-max` | — | — |
| `--nc-story-gallery-caption-gap` | — | — |
| `--nc-story-gallery-caption-max-width` | — | — |

### Title
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-story-gallery-title-size` | — | — |
| `--nc-story-gallery-title-weight` | — | — |
| `--nc-story-gallery-title-line-height` | — | — |
| `--nc-story-gallery-title-lines` | — | — |
| `--nc-story-gallery-title-gap` | — | — |
| `--nc-story-gallery-title-color` | — | — |

### Description
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-story-gallery-desc-size` | — | — |
| `--nc-story-gallery-desc-line-height` | — | — |
| `--nc-story-gallery-desc-color` | — | — |

### Paddles
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-story-gallery-paddle-size` | — | — |
| `--nc-story-gallery-paddle-color` | — | — |
| `--nc-story-gallery-paddle-bg` | — | — |
| `--nc-story-gallery-paddle-shadow` | — | — |
| `--nc-story-gallery-paddle-disabled-opacity` | — | — |
| `--nc-story-gallery-cursor-paddle-is-visible-opacity` | — | — |

### Medienflaeche
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-story-gallery-stage-bg` | — | — |
| `--nc-story-gallery-stage-bg-akzent` | — | — |
| `--nc-story-gallery-stage-bg-neutral` | — | — |
| `--nc-story-gallery-stage-bg-hell` | — | — |
| `--nc-story-gallery-stage-bg-dunkel` | — | — |
| `--nc-story-gallery-stage-padding` | — | — |
| `--nc-story-gallery-stage-radius` | — | — |
| `--nc-story-gallery-stage-shadow` | — | — |

### Kopf
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-story-gallery-head-title-size` | — | — |
| `--nc-story-gallery-head-gap` | — | — |
| `--nc-story-gallery-content-max-width` | — | — |

### Fussleiste
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-story-gallery-footer-spacing` | — | — |
| `--nc-story-gallery-footer-gap` | — | — |
| `--nc-story-gallery-progress-height` | — | — |
| `--nc-story-gallery-progress-track` | — | — |
| `--nc-story-gallery-progress-bar` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- 2.2.2: Karten-Videos mit eigenem Pause-Knopf (.nc-video-pause, Recipe video); ausser Sicht (auch seitlich aus der Spur) pausiert.

## Web Components Mapping
Derived from anatomy for potential `<nc-story-gallery>` custom element:

```js
class NcStoryGallery extends HTMLElement {
  static observedAttributes = ['variant', 'navigation', 'anordnung', 'loop'];
  // Slots: <slot name="scroll">, <slot name="track">, <slot name="card">, <slot name="media">, <slot name="caption">, <slot name="title">
}
```

---

*Generated from `data/story-gallery-recipe.json` by `scripts/generate-component-specs.js`*
