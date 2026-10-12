# video Component Spec
> Version 1.1.0 | Status: stable | Layer: object

Tags: `media`, `object`, `interactive`

## Anatomy
Root element: `.video-wrap`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| media | `video | iframe` | Yes | Video-Element oder Embed (YouTube, Vimeo). |
| pause | `.nc-video-pause` | No | Pause-/Abspiel-Knopf eines dekorativen Hintergrundvideos (WCAG 2.2.2): Symbol .nc-video-pause__icon (Pfade __pause/__play, Wahl per data-playing), Beschriftung als aria-label „Video anhalten“/„Video abspielen“. Liegt ueber dem Medium (position absolute, unten am Ende); bei prefers-reduced-motion [hidden]. Auch der Knopf der Hintergrund-Animationen (neo-bg). |
| facade | `.nc-video-facade` | No | Video-Fassade (click-to-play, data-neo-video="fassade", data-video-url): Knopf mit aria-label und Abspiel-Symbol .nc-video-facade__play; das iframe entsteht erst beim Klick (DSGVO). |
| play-sign | `.play-sign` | No | Play-Button Overlay fuer Click-to-Play. |
| open-button | `.open-button` | No | Button zum Oeffnen des Video-Dialogs. |

### DOM Notes
- video-wrap als Wrapper fuer alle Video-Formate.
- video-wrap-autoplay fuer Autoplay-Videos (ohne Play-Button).
- Play-Sign ist ein zentrierter Play-Button mit Dark-Overlay.
- Video-Dialog oeffnet sich als Fullscreen-Overlay.
- Verhalten (Plan v4, Phase 3, 12.10.2026): neo-behaviors video an [data-neo-video]. Hintergrund: das erste <video> der Wurzel (oder die Wurzel selbst), Markup ohne autoplay; Start nur ohne reduced motion und im Bild; Knopf .nc-video-pause als Kind der Wurzel (fehlt er, hinter dem Teil mit dem Video angelegt); eine Wurzel ohne eigene Position wird per :where() relativ. Fassade: button[data-neo-video="fassade"][data-video-url][aria-label] (data-video-class: Klassen fuers iframe).
- Knopf in verborgenem Bereich (aria-hidden, z. B. Kopien der Story-Gallery): tabindex=-1. In einem Link (Bento-Kachel mit URL): der Klick folgt dem Link nicht.

## Variants
### Verhalten (`behavior`)
Video-Wiedergabeverhalten.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| Click to Play (Standard) | — | Yes |
| Autoplay (Loop, Muted, mit Pause-Knopf) | `.video-wrap-autoplay` |  |

## States
Supported: `default`, `hover`, `focus-visible`, `playing`, `paused`, `stopped`

- **hover**: 
- **focus-visible**: 
- **playing**: 
- **paused**: 
- **stopped**: 

## CSS Token API
Base classes: `.video-wrap`

### Pause-Knopf
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-video-pause-size` | — | — |
| `--nc-video-pause-icon-size` | — | — |
| `--nc-video-pause-offset` | — | — |
| `--nc-video-pause-radius` | — | — |
| `--nc-video-pause-z` | — | — |
| `--nc-video-pause-color` | — | — |
| `--nc-video-pause-bg` | — | — |
| `--nc-video-pause-bg-hover` | — | — |
| `--nc-video-pause-border` | — | — |

### Fassade
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-video-facade-bg` | — | — |
| `--nc-video-facade-play-size` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | focus-next | Der Knopf .nc-video-pause steht in der Tab-Folge hinter dem Medium (in verborgenen Kopien tabindex=-1); eine Fassade ist ein Knopf. |
| `Enter` | activate | Knopf: haelt das Video an bzw. setzt es fort. Fassade: laedt das iframe und setzt den Fokus darauf. |
| `Space` | activate | Wie Enter. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `video-autoplay` | Yes | `{"playing":"boolean","reason":"string"}` |
| `video-fassade` | Yes | `{"provider":"string","url":"string"}` |

## Accessibility
- Video-Element muss Untertitel als track-Element haben (WCAG 1.2.2) — gilt fuer Videos mit Inhalt; dekorative Hintergrundvideos sind stumm und ohne Information.
- Autoplay-Videos muessen muted sein (WCAG 1.4.2).
- Play-Button muss per Tastatur erreichbar sein.
- 2.2.2: Jedes dekorative Hintergrundvideo (laenger als 5 s, neben anderem Inhalt) hat einen eigenen Knopf zum Anhalten und Fortsetzen (Beschriftung wechselt); ausser Sicht pausiert es; eine Handpause bleibt bestehen.
- 2.3.3/prefers-reduced-motion: kein Start, poster bzw. erstes Bild sichtbar, kein Knopf.
- 2.5.8: Knopf 2.5rem (40 px).
- 1.4.11: Knopf als dunkle, halbdurchsichtige Flaeche mit hellem Symbol und heller Kante in beiden Themes (always-dark/always-light), unabhaengig vom Videobild.
- 4.1.2/3.1.2: Name per aria-label nach lang (de/en), ueberschreibbar per data-text-pause/data-text-play; Fassaden-iframe mit title aus dem aria-label.
- Datenschutz: Fassade laedt nichts von YouTube/Vimeo vor dem Klick (youtube-nocookie.com, Vimeo dnt=1).

## Web Components Mapping
Derived from anatomy for potential `<nc-video>` custom element:

```js
class NcVideo extends HTMLElement {
  static observedAttributes = ['behavior'];
  // Slots: <slot name="media">
}
```

---

*Generated from `data/video-recipe.json` by `scripts/generate-component-specs.js`*
