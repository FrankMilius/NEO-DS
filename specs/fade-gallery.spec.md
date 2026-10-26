# fade-gallery Component Spec
> Version 1.2.2 | Status: stable | Layer: organism

Tags: `display`, `gallery`, `tabs`, `fade`

## Anatomy
Root element: `.nc-fade-gallery`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| viewport | `.nc-fade-gallery__viewport` | Yes | — |
| media | `.nc-fade-gallery__media` | Yes | — |
| nav-row | `.nc-fade-gallery__nav-row` | Yes | — |
| tabs | `.nc-fade-gallery__tabs` | Yes | — |
| tab | `.nc-fade-gallery__tab` | Yes | — |
| caption | `.nc-fade-gallery__caption` | Yes | — |
| desc | `.nc-fade-gallery__desc` | Yes | — |

### DOM Notes
- Tab-basierte Fade-Gallery (Apple-Style). Medium + Description faden ein.
- Zustaende der Ansicht: .is-active am Medium, .is-visible an der Beschreibung (die anderen [hidden]), aria-selected am Tab — das SCSS blendet ueber (opacity 0.5 s / 0.4 s, ohne bei prefers-reduced-motion).
- Website-only: die Paddles tragen neben .nc-gallery__paddle die Haken .nc-gallery__paddle--prev/--next und data-fg-prev/data-fg-next (Twig block--block-content--neo-fade-gallery.html.twig) — kein CSS im DS; das Blaettern bindet neo-behaviors fade-gallery.
- Tabs-Muster (neo-behaviors fade-gallery, Plan v4, Phase 6a): .nc-fade-gallery__tabs[role=tablist] > .nc-fade-gallery__tab[role=tab][aria-controls] auf das Medium .nc-fade-gallery__media[role=tabpanel][aria-labelledby]; genau ein Tab aria-selected=true mit tabindex 0. Die Beschreibung gehoert per data-fg-desc=<Nr> zur Ansicht (ohne Angabe nach Reihenfolge); fehlt sie, bleibt die Unterschrift leer.

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

### Navigation (`navigation`)
Zusaetzlich zu Tabs bzw. Scrollen: Blaettern ueber .nc-gallery__paddle und eine Uebersicht ueber .nc-gallery__nav-dot — dieselben Bauteile wie im Galerie-Block. Uebernommen ist das Aussehen, nicht die Lage: Dort sind beide Overlays ueber dem Medium, hier stehen sie darunter im Fluss.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| tabs | — |  |
| paddles | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-fade-gallery`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-fade-gallery-radius` | — | — |

### Ansichten-Leiste
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-fade-gallery-tab-family` | — | `--mod-fade-gallery-tab-family` |
| `--nc-fade-gallery-tab-size` | — | `--mod-fade-gallery-tab-size` |
| `--nc-fade-gallery-tab-weight` | — | `--mod-fade-gallery-tab-weight` |
| `--nc-fade-gallery-tab-tracking` | — | `--mod-fade-gallery-tab-tracking` |
| `--nc-fade-gallery-tab-padding` | — | `--mod-fade-gallery-tab-padding` |
| `--nc-fade-gallery-tab-color` | — | — |
| `--nc-fade-gallery-tab-active` | — | — |
| `--nc-fade-gallery-desc-size` | — | `--mod-fade-gallery-desc-size` |
| `--nc-fade-gallery-desc-measure` | — | `--mod-fade-gallery-desc-measure` |
| `--nc-fade-gallery-desc-color` | — | — |
| `--nc-fade-gallery-nav-gap` | — | `--mod-fade-gallery-nav-gap` |

### Caption
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-fade-gallery-desc-size` | — | `--mod-fade-gallery-desc-size` |
| `--nc-fade-gallery-desc-color` | — | — |

### Animation
## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | focus-next | Paddles (falls vorhanden), dann der gewaehlte Tab (wandernder tabindex), dann weiter aus der Galerie. |
| `ArrowRight` | next | Auf einem Tab: naechste Ansicht (rundum) waehlen und ihren Tab fokussieren. |
| `ArrowLeft` | previous | Auf einem Tab: vorherige Ansicht (rundum) waehlen und ihren Tab fokussieren. |
| `Home` | first | Auf einem Tab: erste Ansicht waehlen und ihren Tab fokussieren. |
| `End` | last | Auf einem Tab: letzte Ansicht waehlen und ihren Tab fokussieren. |
| `Enter` | activate | Nativer Klick: Tab waehlt seine Ansicht, Paddle blaettert (rundum). |
| `Space` | activate | Wie Enter. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `fade-gallery-change` | Yes | `{"index":"number","previousIndex":"number"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard
- 2.1.1: Tabs-Muster mit wanderndem tabindex (nur der gewaehlte Tab in der Tab-Folge); Pfeil rechts/links rundum, Pos1, Ende; Paddles sind button mit aria-label.
- 4.1.2: Tabs role=tab mit aria-selected und aria-controls auf das Medium (role=tabpanel, aria-labelledby); verborgene Medien aria-hidden.
- 4.1.3: Die Unterschrift .nc-fade-gallery__caption ist aria-live=polite — die Beschreibung der gewaehlten Ansicht wird angesagt.
- 2.3.3: Die Ueberblendung entfaellt bei prefers-reduced-motion (SCSS); kein Autoplay.

## Web Components Mapping
Derived from anatomy for potential `<nc-fade-gallery>` custom element:

```js
class NcFadeGallery extends HTMLElement {
  static observedAttributes = ['variant', 'navigation'];
  // Slots: <slot name="viewport">, <slot name="media">, <slot name="nav-row">, <slot name="tabs">, <slot name="tab">, <slot name="caption">, <slot name="desc">
}
```

---

*Generated from `data/fade-gallery-recipe.json` by `scripts/generate-component-specs.js`*
