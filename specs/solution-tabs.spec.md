# solution-tabs Component Spec
> Version 2.0.0 | Status: stable | Layer: organism

Tags: `display`, `content`, `interactive`, `tabs`

## Anatomy
Root element: `.nc-solution-tabs`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| autoplay | `.nc-solution-tabs__autoplay` | No | Pause-/Abspiel-Knopf der Rotation (button type=button), im Markup VOR der Tableiste (erste Station in der Tab-Folge vor der bewegten Region). Symbol (svg __autoplay-icon mit __autoplay-pause/__autoplay-play, aria-hidden) + Beschriftung (__autoplay-label) „Automatische Wiedergabe anhalten“ bzw. „… fortsetzen“; data-playing waehlt das Symbol. Nur bei data-autoplay=on; bei prefers-reduced-motion [hidden]. Fehlt er, legt das Behavior ihn an. |
| tablist | `.nc-solution-tabs__tablist` | Yes | Tab-Leiste. role='tablist', benannt per aria-labelledby (Ueberschrift des Blocks). Horizontal oben oder vertikal seitlich (--vertical). |
| tab | `.nc-solution-tabs__tab` | Yes | Einzelner Tab. button[role='tab'] mit aria-selected/aria-controls und wanderndem tabindex (nur der gewaehlte 0). Enthaelt optionalen Index und Progress-Indikator. |
| progress | `.nc-solution-tabs__progress` | No | Fortschrittsbalken im aktiven Tab bei Autoplay; im Vertikal-Modus statischer Akzent-Indikator. |
| panel | `.nc-solution-tabs__panel` | Yes | Tab-Panel. role='tabpanel'. Sichtbar via .is-active. Grid aus Inhalt + Produkt-Visual. |
| panel-title | `.nc-solution-tabs__panel-title` | Yes | Panel-Ueberschrift (h3). |
| features | `.nc-solution-tabs__features` | No | Feature-Liste mit gestaffelter Einblendung. |
| cta | `.nc-solution-tabs__cta` | No | Call-to-Action-Button im Panel. |
| visual | `.nc-solution-tabs__visual` | No | Produkt-Visual (Mock-UI mit Chip, Name, Skeleton-Linien). Dekorativ, aria-hidden. |

### DOM Notes
- Root .nc-solution-tabs setzt --nc-solution-tabs-accent (Default = -accent-default), per Panel via Inline-Style ueberschreibbar; die Akzentfarbe je Tab ist Daten (Theme), nicht Verhalten.
- Reihenfolge in der Wurzel: [Knopf __autoplay] → Tablist role='tablist' (horizontal flex row oder vertikal --vertical, flex column, border-inline-start; aria-labelledby auf die Block-Ueberschrift) → Panels.
- Tab button[role='tab'][aria-selected][aria-controls]; aktives Panel .is-active (display:grid), die anderen [hidden]. IDs stabil aus der Block-ID (<wurzel-id>-t<n>/-p<n>).
- Autoplay: data-autoplay='on' am Root; Progress-Balken animiert ueber --nc-solution-tabs-autoplay-duration; .is-paused haelt den Balken an (Maus, Fokus im Block ausser auf dem Knopf, ausser Sicht); .is-stopped (Knopf oder Handwahl) zeigt keinen Balken. Den Takt macht das Behavior solution-tabs (ein setTimeout je Schritt, Restzeit nach einer Pause).
- Vertikal: Progress wird zum vertikalen Akzent-Indikator (scaleY); Visual steht oben (order:-1); der Knopf nimmt eine eigene Rasterzeile ueber beiden Spalten.
- Variant contained: gefuellte Tabs ohne Underline/Progress.
- Tastatur: Pfeil rechts/links (horizontal) bzw. runter/hoch (vertikal) rundum, Pos1, Ende — waehlen und fokussieren (automatische Aktivierung); Enter/Space = nativer Klick.
- Responsive 880px: Panel einspaltig, Tablist horizontal scrollbar.
- prefers-reduced-motion: keine Panel-/Feature-Animation, kein Autoplay, kein Knopf.

## Variants
### Orientation (`orientation`)
Anordnung der Tab-Leiste

| Value | CSS Modifier | Default |
| --- | --- | --- |
| horizontal | — |  |
| vertical | `.nc-solution-tabs--vertical` |  |

### Variant (`variant`)
Visuelle Tab-Darstellung

| Value | CSS Modifier | Default |
| --- | --- | --- |
| line | — |  |
| contained | `.nc-solution-tabs--contained` |  |

### Autoplay (`autoplay`)
Automatische Tab-Rotation mit Fortschrittsbalken

| Value | CSS Modifier | Default |
| --- | --- | --- |
| off | — |  |
| on | — |  |

## States
Supported: `default`, `hover`, `active`, `focus`

## CSS Token API
Base classes: `nc-solution-tabs`

### Layout & Surface
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-solution-tabs-border` | — | — |
| `--nc-solution-tabs-visual-bg` | — | — |

### Tabs & Autoplay
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-solution-tabs-tab-color` | — | — |
| `--nc-solution-tabs-tab-color-active` | — | — |
| `--nc-solution-tabs-autoplay-duration` | — | — |

### Accent & Text
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-solution-tabs-accent-default` | — | — |
| `--nc-solution-tabs-title` | — | — |
| `--nc-solution-tabs-text` | — | — |

### Pause-Knopf
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-solution-tabs-autoplay-min-size` | — | — |
| `--nc-solution-tabs-autoplay-padding-inline` | — | — |
| `--nc-solution-tabs-autoplay-gap` | — | — |
| `--nc-solution-tabs-autoplay-radius` | — | — |
| `--nc-solution-tabs-autoplay-font-size` | — | — |
| `--nc-solution-tabs-autoplay-icon-size` | — | — |
| `--nc-solution-tabs-autoplay-margin-block` | — | — |
| `--nc-solution-tabs-autoplay-color` | — | — |
| `--nc-solution-tabs-autoplay-color-hover` | — | — |
| `--nc-solution-tabs-autoplay-border` | — | — |
| `--nc-solution-tabs-autoplay-bg-hover` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | focus-next | Erst der Knopf __autoplay (bei Autoplay), dann der gewaehlte Tab (wandernder tabindex), dann der Inhalt des Panels. |
| `ArrowRight` | next | Horizontal: naechsten Tab (rundum) waehlen und fokussieren. Beendet die Rotation dauerhaft. |
| `ArrowLeft` | previous | Horizontal: vorherigen Tab (rundum) waehlen und fokussieren. Beendet die Rotation dauerhaft. |
| `ArrowDown` | next | Vertikal (aria-orientation=vertical bzw. --vertical): wie Pfeil rechts. |
| `ArrowUp` | previous | Vertikal: wie Pfeil links. |
| `Home` | first | Ersten Tab waehlen und fokussieren. Beendet die Rotation dauerhaft. |
| `End` | last | Letzten Tab waehlen und fokussieren. Beendet die Rotation dauerhaft. |
| `Enter` | activate | Auf einem Tab: nativer Klick, waehlt ihn (beendet die Rotation). Auf dem Knopf: haelt an bzw. setzt fort. |
| `Space` | activate | Wie Enter. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `solution-tabs-change` | Yes | `{"value":"string","previousValue":"string"}` |
| `solution-tabs-autoplay` | Yes | `{"playing":"boolean","reason":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- 2.2.2: Automatische Rotation nur auf Wunsch (data-autoplay=on) und nie mit prefers-reduced-motion; ein sichtbarer Knopf vor der Tableiste haelt sie an und setzt sie fort (Beschriftung wechselt: „Automatische Wiedergabe anhalten“/„… fortsetzen“). Eine Handwahl beendet sie dauerhaft; Maus und Fokus im Block halten sie vorübergehend an (.is-paused, auch der Balken), ausser Sicht ruht sie.
- 4.1.2: Tabs-Muster — tablist/tab/tabpanel, aria-selected, aria-controls, Panel aria-labelledby; Tableiste per aria-labelledby benannt; vertikal aria-orientation=vertical. Der Knopf ist ein button mit sichtbarer Beschriftung (Name = Text, kein aria-pressed).
- 2.1.1/2.4.3: Wandernder tabindex (nur der gewaehlte Tab in der Tab-Folge); Pfeiltasten rundum, Pos1/Ende; der Knopf steht in der Tab-Folge vor der Tableiste.
- 2.5.8: Knopf mindestens 2.5rem (40 px) hoch und breit (Ziel >= 24 x 24 px).
- 3.1.2: Knopftexte nach der Sprache der Seite bzw. des Blocks (lang; de/en), am Knopf ueberschreibbar per data-text-pause/data-text-play.
- 1.3.1: Produkt-Visual dekorativ (aria-hidden), Panel-Titel h3 (Sektions-h2 davor), Fortschrittsbalken und Knopfsymbol aria-hidden.

## Web Components Mapping
Derived from anatomy for potential `<nc-solution-tabs>` custom element:

```js
class NcSolutionTabs extends HTMLElement {
  static observedAttributes = ['orientation', 'variant', 'autoplay'];
  // Slots: <slot name="tablist">, <slot name="tab">, <slot name="panel">, <slot name="panel-title">
}
```

---

*Generated from `data/solution-tabs-recipe.json` by `scripts/generate-component-specs.js`*
