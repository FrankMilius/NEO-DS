# hero-tom Component Spec
> Version 1.5.0 | Status: stable | Layer: organism

Tags: `hero`, `display`, `parallax`

## Anatomy
Root element: `.nc-hero-tom`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| media | `.nc-hero-tom__media` | Yes | — |
| scrim | `.nc-hero-tom__scrim` | Yes | — |
| content | `.nc-hero-tom__content` | Yes | — |
| copy | `.nc-hero-tom__copy` | Yes | — |
| kicker | `.nc-hero-tom__kicker` | No | — |
| headline | `.nc-hero-tom__headline` | Yes | — |
| subtext | `.nc-hero-tom__subtext` | No | — |
| badges | `.nc-hero-tom__badges` | No | — |

### DOM Notes
- Text ueber Hintergrund-Medium. Optionaler Parallax-Expand.
- Markup wie data/markup/hero-tom.html (Website). Slots aus dem geernteten Markup (06.10.2026).
- Seit 06.10.2026 (Entscheidung hero-tom-gestaltung) gestaltet das DS den Block vollstaendig: Wurzel (always-light, min-block-size 100svh), Medium (absolut, object-fit cover), radialer Scrim, Text (Kicker, Display-Headline, Subtext), Ton hell (--light), Expand (--expand), Inhaltsbreite (--cw-*) und die Badge-Zeile (05-atoms/_badge-row.scss). Die Regeln waren am 12.08.2026 (8b04d29c) beim zweiten Aufnahme-Lauf verloren gegangen.
- Expand beim Scrollen: das Behavior hero-tom (neo-behaviors, Plan v4, Phase 6b) setzt --tom-expand (0 → 1) inline am Medium; das DS liest es (Inset auf Inhaltsbreite, Radius) und faehrt bei prefers-reduced-motion ganz aus. Die Arena zeigt den Endzustand (--tom-expand: 1).
- Hintergrundvideo (Plan v4, Phase 3): Section mit [data-neo-video], Knopf .nc-video-pause (Recipe video) als Kind der Section hinter dem Medium. Video ohne autoplay — Start ueber neo-behaviors video.

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

### Inhaltsbreite (`contentWidth`)
Begrenzt den Inhalt (__content) auf eine Containerbreite — Drupal-Feld je Block. 07-organisms/_hero-tom.scss.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| prose | `.nc-hero-tom--cw-prose` |  |
| narrow | `.nc-hero-tom--cw-narrow` |  |
| content | `.nc-hero-tom--cw-content` |  |
| wide | `.nc-hero-tom--cw-wide` |  |
| xwide | `.nc-hero-tom--cw-xwide` |  |
| full | `.nc-hero-tom--cw-full` |  |

### Ton (`ton`)
Drupal-Feld field_tom_theme: dark (Standard) oder light. 07-organisms/_hero-tom.scss.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| dark | — |  |
| light | `.nc-hero-tom--light` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-hero-tom`

### Kicker
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-tom-kicker-size` | — | — |
| `--nc-hero-tom-kicker-weight` | — | — |

### Headline
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-tom-headline-size` | — | — |
| `--nc-hero-tom-headline-weight` | — | — |

### Subtext
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-tom-subtext-size` | — | — |
| `--nc-hero-tom-subtext-opacity` | — | — |
| `--nc-hero-tom-content-max-width` | — | — |

### Scrim
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-tom-scrim-color` | — | — |

### Expand
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-tom-expand-radius` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | focus-next | Keine eigene Bedienung: Links im Text und der Pause-Knopf eines Hintergrundvideos (.nc-video-pause, Recipe video) in Dokumentreihenfolge. Das Ausfahren folgt nur dem Scrollen. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `hero-tom-expand` | Yes | `{"expanded":"boolean","progress":"number"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- 2.2.2: Hintergrundvideo mit eigenem Pause-Knopf (.nc-video-pause, Recipe video); prefers-reduced-motion: kein Start, poster sichtbar.

## Dependencies
`hero`

## Web Components Mapping
Derived from anatomy for potential `<nc-hero-tom>` custom element:

```js
class NcHeroTom extends HTMLElement {
  static observedAttributes = ['variant', 'contentWidth', 'ton'];
  // Slots: <slot name="media">, <slot name="scrim">, <slot name="content">, <slot name="copy">, <slot name="headline">
}
```

---

*Generated from `data/hero-tom-recipe.json` by `scripts/generate-component-specs.js`*
