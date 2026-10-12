# gallery Component Spec
> Version 1.1.0 | Status: stable | Layer: organism

Tags: `interactive`, `display`, `carousel`, `hero`, `media`

## Anatomy
Root element: `.nc-gallery`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| track | `.nc-gallery__track` | Yes | Flex-Container fuer Slides. Horizontal via translate3d animiert. |
| slide | `.nc-gallery__slide` | Yes | Einzelner Slide (role=tabpanel, id). 100% Breite, flex-shrink:0. Enthaelt BG + Content. Verborgene Slides sind inert (neo-behaviors gallery). |
| slide-bg | `.nc-gallery__slide-bg` | Yes | Hintergrundbild-Container. Absolute positioniert, object-fit:cover. |
| slide-overlay | `.nc-gallery__slide-overlay` | No | Gradient-Overlay fuer Textkontrast. Richtung + Opazitaet via Tokens. |
| slide-content | `.nc-gallery__slide-content` | Yes | Content-Wrapper: Logo, Tag, Titel, Beschreibung, Actions. |
| controls | `.nc-gallery__controls` | No | Container fuer Prev/Next Paddle-Buttons. Absolute overlay. |
| paddle | `.nc-gallery__paddle` | No | Prev/Next Pfeil-Button. Runder Button mit Pfeil-Icon. |
| nav | `.nc-gallery__nav` | No | Punkte-Leiste. role=tablist. Position unten zentriert. |
| nav-dot | `.nc-gallery__nav-dot` | No | Einzelner Punkt. role=tab, aria-selected, aria-controls auf den Slide, wandernder tabindex. |
| autoplay | `.nc-gallery__autoplay` | No | Pause-/Abspiel-Knopf (einzige Quelle des Autoplay-Zustands): data-playing="true|false" waehlt das Symbol, aria-label wechselt „Galerie pausieren“/„Galerie abspielen“. Bei autoplay off und prefers-reduced-motion [hidden]. |

### DOM Notes
- Website-only: die Paddles tragen neben .nc-gallery__paddle die Haken .nc-gallery__paddle--prev/--next (Markup der Website, data-gallery-prev/-next) — kein CSS im DS.
- Root: position:relative, overflow:hidden, width:100%, height via --nc-gallery-height.
- Track: display:flex, transform:translate3d(-Nx100%, 0, 0). will-change:transform.
- Slide-BG: position:absolute, inset:0. img mit object-fit:cover.
- Overlay: linear-gradient(direction, start, end). pointer-events:none.
- Content: position:relative, z-index:2. Flex-Column mit gap.
- Paddles: button mit aria-label ('Vorheriger Slide', 'Naechster Slide').
- Per-Slide-Theme: data-slide-theme='light|dark' auf .nc-gallery__slide.
- Animation: Slide = translate3d auf Track. Fade = opacity auf Slides (position:absolute).
- prefers-reduced-motion: Autoplay deaktiviert, Transitionen entfernt.
- Slide: flex:0 0 100%, position:relative. Aktiver Slide .is-active; die anderen inert und aria-hidden (neo-behaviors gallery).
- Nav: role='tablist'. Punkte: button[role='tab'], aria-selected='true|false', aria-controls (Slide-id), wandernder tabindex.
- Autoplay: button.nc-gallery__autoplay mit data-playing und wechselndem aria-label ('Galerie pausieren' / 'Galerie abspielen'); Symbole .nc-gallery__autoplay-pause/-play folgen data-playing (CSS).
- Keyboard: Pfeil links/rechts blaettert (auf Punkten: waehlt und fokussiert, rundum; Pos1/Ende), Enter/Space aktivieren, Escape haelt den Autoplay an. Im Inhalt eines Slides blaettern die Pfeile nicht (der Fokus laege sonst in einem verborgenen Slide).
- Verhalten (Plan v4, Phase 2, 12.10.2026): neo-behaviors gallery bindet an fertiges Markup; die Website baut Slides und Punkte aus JSON (neoGallery) und bindet danach.

## Variants
### Animation (`animation`)
Uebergangs-Animation — slide (translate3d), fade (opacity), none (sofort)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| slide | — |  |
| fade | `.nc-gallery--fade` |  |
| none | `.nc-gallery--no-anim` |  |

### Nav Style (`navStyle`)
Navigations-Indikator — dots (Punkte), lines (Balken), thumbnails (Mini-Bilder)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| dots | — |  |
| lines | `.nc-gallery--lines` |  |
| thumbnails | `.nc-gallery--thumbnails` |  |

### Height (`height`)
Slide-Hoehe — viewport (100dvh), fixed (500-700px), aspect (16:9)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| viewport | — |  |
| fixed | `.nc-gallery--fixed` |  |
| aspect | `.nc-gallery--aspect` |  |

### Content Align (`contentAlign`)
Content-Ausrichtung — start (links), center (zentriert), end (rechts)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| start | — |  |
| center | `.nc-gallery--center` |  |
| end | `.nc-gallery--end` |  |

## States
Supported: `default`, `hover`, `focus-visible`, `playing`, `paused`, `stopped`

- **hover**: 
- **focus-visible**: 
- **paused**: 
- **stopped**: 

## CSS Token API
Base classes: `nc-gallery`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-gallery-height` | — | `--mod-gallery-height` |
| `--nc-gallery-min-height` | — | `--mod-gallery-min-height` |
| `--nc-gallery-max-height` | — | `--mod-gallery-max-height` |
| `--nc-gallery-padding-block` | — | `--mod-gallery-padding-block` |
| `--nc-gallery-padding-inline` | — | `--mod-gallery-padding-inline` |
| `--nc-gallery-content-max-width` | — | `--mod-gallery-content-max-width` |
| `--nc-gallery-content-gap` | — | `--mod-gallery-content-gap` |
| `--nc-gallery-content-align` | — | `--mod-gallery-content-align` |

### Overlay
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-gallery-overlay-start` | — | `--mod-gallery-overlay-start` |
| `--nc-gallery-overlay-end` | — | `--mod-gallery-overlay-end` |
| `--nc-gallery-overlay-direction` | — | `--mod-gallery-overlay-direction` |

### Title
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-gallery-title-size` | — | `--mod-gallery-title-size` |
| `--nc-gallery-title-weight` | — | `--mod-gallery-title-weight` |
| `--nc-gallery-title-color` | — | `--mod-gallery-title-color` |
| `--nc-gallery-title-line-height` | — | `--mod-gallery-title-line-height` |

### Description
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-gallery-desc-size` | — | `--mod-gallery-desc-size` |
| `--nc-gallery-desc-color` | — | `--mod-gallery-desc-color` |
| `--nc-gallery-desc-max-width` | — | `--mod-gallery-desc-max-width` |
| `--nc-gallery-desc-line-height` | — | `--mod-gallery-desc-line-height` |

### Tag
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-gallery-tag-size` | — | `--mod-gallery-tag-size` |
| `--nc-gallery-tag-weight` | — | `--mod-gallery-tag-weight` |
| `--nc-gallery-tag-bg` | — | `--mod-gallery-tag-bg` |
| `--nc-gallery-tag-color` | — | `--mod-gallery-tag-color` |
| `--nc-gallery-tag-radius` | — | `--mod-gallery-tag-radius` |
| `--nc-gallery-tag-padding` | — | `--mod-gallery-tag-padding` |

### Logo
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-gallery-logo-max-height` | — | `--mod-gallery-logo-max-height` |
| `--nc-gallery-logo-max-width` | — | `--mod-gallery-logo-max-width` |

### Navigation Dots
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-gallery-dot-size` | — | `--mod-gallery-dot-size` |
| `--nc-gallery-dot-gap` | — | `--mod-gallery-dot-gap` |
| `--nc-gallery-dot-color` | — | `--mod-gallery-dot-color` |
| `--nc-gallery-dot-color-active` | — | `--mod-gallery-dot-color-active` |
| `--nc-gallery-dot-radius` | — | `--mod-gallery-dot-radius` |

### Paddles
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-gallery-paddle-size` | — | `--mod-gallery-paddle-size` |
| `--nc-gallery-paddle-bg` | — | `--mod-gallery-paddle-bg` |
| `--nc-gallery-paddle-bg-hover` | — | `--mod-gallery-paddle-bg-hover` |
| `--nc-gallery-paddle-color` | — | `--mod-gallery-paddle-color` |
| `--nc-gallery-paddle-radius` | — | `--mod-gallery-paddle-radius` |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-gallery-animation-duration` | — | `--mod-gallery-animation-duration` |
| `--nc-gallery-animation-easing` | — | `--mod-gallery-animation-easing` |

### Autoplay
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-gallery-autoplay-interval` | — | — |
| `--nc-gallery-autoplay-progress-color` | — | `--mod-gallery-autoplay-progress-color` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | focus-next | Inhalt des sichtbaren Slides (verborgene Slides sind inert), Paddles, der gewaehlte Punkt (wandernder tabindex), der Knopf __autoplay. |
| `ArrowRight` | next | Naechster Slide (rundum). Auf einem Punkt: waehlt und fokussiert den naechsten Punkt. Auf Paddles, Knopf, Wurzel: blaettert. Im Inhalt eines Slides ohne Wirkung. Beendet die Rotation dauerhaft. |
| `ArrowLeft` | previous | Vorheriger Slide (rundum), sonst wie Pfeil rechts. |
| `Home` | first | Auf einem Punkt: ersten Slide waehlen und seinen Punkt fokussieren. Beendet die Rotation dauerhaft. |
| `End` | last | Auf einem Punkt: letzten Slide waehlen und seinen Punkt fokussieren. Beendet die Rotation dauerhaft. |
| `Enter` | activate | Nativer Klick: Punkt waehlt seinen Slide, Paddle blaettert (beides Handwahl), Knopf haelt an bzw. setzt fort. |
| `Space` | activate | Wie Enter. |
| `Escape` | pause | Haelt den Autoplay an (Knopf zeigt danach „Galerie abspielen“); laeuft er nicht, ohne Wirkung — Escape schaltet nie ein. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `gallery-change` | Yes | `{"index":"number","previousIndex":"number"}` |
| `gallery-autoplay` | Yes | `{"playing":"boolean","reason":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard
- 2.2.2: Automatische Rotation nur auf Wunsch (data-autoplay=on) und nie mit prefers-reduced-motion; der Knopf haelt sie an und setzt sie fort (aria-label wechselt); Escape haelt an (Fehler behoben); Handwahl beendet sie dauerhaft; Maus, Fokus und ausser Sicht halten voruebergehend an.
- 4.1.2/2.4.3: Verborgene Slides inert (keine fokussierbaren CTA-Links ausserhalb des sichtbaren Slides); Punkte role=tab mit aria-controls und aria-selected.
- 2.1.1: Wandernder tabindex auf den Punkten (nur der gewaehlte in der Tab-Folge), Pfeile rundum, Pos1/Ende; Paddles und Knopf sind button.
- 4.1.3: Spur aria-live=polite, solange der Takt ruht (Handwahl wird angesagt), off waehrend der Rotation.
- 3.1.2: Knopftexte nach der Sprache (lang; de/en), am Knopf ueberschreibbar per data-text-pause/data-text-play.

## Web Components Mapping
Derived from anatomy for potential `<nc-gallery>` custom element:

```js
class NcGallery extends HTMLElement {
  static observedAttributes = ['animation', 'navStyle', 'height', 'contentAlign'];
  // Slots: <slot name="track">, <slot name="slide">, <slot name="slide-bg">, <slot name="slide-content">
}
```

---

*Generated from `data/gallery-recipe.json` by `scripts/generate-component-specs.js`*
