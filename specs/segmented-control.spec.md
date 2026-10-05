# segmented-control Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

Tags: `interactive`, `navigation`, `selection`

## Anatomy
Root element: `.nc-segmented-control`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| item | `.nc-segmented-control__item` | Yes | — |
| icon | `.nc-segmented-control__icon` | No | — |
| badge | `.nc-segmented-control__badge` | No | — |
| indicator | `.nc-segmented-control__indicator` | No | — |

### DOM Notes
- Container ist ein <div class='nc-segmented-control' role='radiogroup'> mit aria-label.
- Items sind <button class='nc-segmented-control__item' role='radio' aria-checked='true|false'>.
- Immer Single-Select — genau ein Item ist aria-checked='true'.
- Arrow-Key Navigation via roving tabindex (tabindex='-1' auf inaktive, '0' auf aktives).
- Groessen-Modifier am Container (--sm, --lg) propagieren zu allen Items.
- Selected State: erhoeht (box-shadow via elevation-base) auf hellem BG innerhalb des Tracks.
- --full-width: alle Segments gleichmaessig breit (flex: 1 1 0%).
- Icon-only Segments brauchen aria-label fuer Accessibility.
- Badge-Slot: <span class='nc-segmented-control__badge'>5</span> im Item. Farbe wechselt automatisch bei Selected-State.
- Sliding Indicator (optional, empfohlen fuer High-End UIs): Ein <div class='nc-segmented-control__indicator'> als erstes Kind im Container. JS setzt --_indicator-left und --_indicator-width bei Selection-Wechsel. Der Indikator gleitet per CSS transition (cubic-bezier) zum aktiven Segment. Wenn vorhanden: Items verlieren eigenen Selected-BG (transparent) — der Indikator uebernimmt die visuelle Markierung.
- --scrollable: Horizontaler Scroll bei Platzmangel (scrollbar hidden). Items behalten flex-shrink:0. Empfehlung: Bei >5 Segmenten oder Container-Overflow → in ein Select-Dropdown umwandeln (JS/Framework-Logik).

## Variants
### Size (`size`)
3 Groessenabstufungen — sm (32px) / md (40px, Standard) / lg (48px). Nutzt Button-Size-Tokens fuer min-height, padding, font-size.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-segmented-control--sm` |  |
| md | — |  |
| lg | `.nc-segmented-control--lg` |  |

### Width (`width`)
Layout-Verhalten — auto (Segmente nach Inhalt, Standard), full-width (gleichmaessig verteilt), scrollable (horizontal scrollbar bei Overflow)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| auto | — |  |
| full-width | `.nc-segmented-control--full-width` |  |
| scrollable | `.nc-segmented-control--scrollable` |  |

### Content (`content`)
Inhalt der Segments — text (nur Text, Standard), icon-text (Icon + Text), icon-only (nur Icon, aria-label noetig), text-badge (Text + Badge-Counter)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| text | — |  |
| icon-text | — |  |
| icon-only | — |  |
| text-badge | — |  |

### Indicator (`indicator`)
Visuelles Feedback fuer den Selected-State — static (Background-Toggle pro Item, Standard), sliding (animierter Hintergrund-Layer)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| static | — |  |
| sliding | — |  |

## States
Supported: `default`, `hover`, `selected`, `disabled`, `focus`

- **hover**: 
- **selected**: 
- **focus**: 

## CSS Token API
Base classes: `nc-segmented-control`

### Track
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-segmented-bg` | — | `--mod-segmented-bg` |
| `--nc-segmented-radius` | — | `--mod-segmented-radius` |
| `--nc-segmented-padding` | — | `--mod-segmented-padding` |
| `--nc-segmented-gap` | — | `--mod-segmented-gap` |

### Item Default
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-segmented-item-bg` | — | `--mod-segmented-item-bg` |
| `--nc-segmented-item-color` | — | `--mod-segmented-item-color` |
| `--nc-segmented-item-radius` | — | `--mod-segmented-item-radius` |

### Item Hover
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-segmented-item-bg-hover` | — | `--mod-segmented-item-bg-hover` |
| `--nc-segmented-item-color-hover` | — | `--mod-segmented-item-color-hover` |

### Item Selected
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-segmented-item-selected-bg` | — | `--mod-segmented-item-selected-bg` |
| `--nc-segmented-item-selected-color` | — | `--mod-segmented-item-selected-color` |
| `--nc-segmented-item-selected-shadow` | — | `--mod-segmented-item-selected-shadow` |

### Item Disabled
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-segmented-item-disabled-color` | — | `--mod-segmented-item-disabled-color` |
| `--nc-segmented-item-disabled-opacity` | — | `--mod-segmented-item-disabled-opacity` |

### Badge
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-segmented-item-badge-bg` | — | `--mod-segmented-item-badge-bg` |
| `--nc-segmented-item-badge-color` | — | `--mod-segmented-item-badge-color` |
| `--nc-segmented-item-badge-bg-selected` | — | `--mod-segmented-item-badge-bg-selected` |
| `--nc-segmented-item-badge-color-selected` | — | `--mod-segmented-item-badge-color-selected` |
| `--nc-segmented-item-badge-radius` | — | `--mod-segmented-item-badge-radius` |
| `--nc-segmented-item-badge-padding` | — | `--mod-segmented-item-badge-padding` |
| `--nc-segmented-item-badge-font-size` | — | `--mod-segmented-item-badge-font-size` |

### Sliding Indicator
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-segmented-indicator-transition` | — | `--mod-segmented-indicator-transition` |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-segmented-transition-duration` | — | `--mod-segmented-transition-duration` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `ArrowRight` | select-next-segment | Fokussiert und waehlt das naechste Segment (rundum, gesperrte uebersprungen). |
| `ArrowDown` | select-next-segment | Wie ArrowRight (Radio-Muster). |
| `ArrowLeft` | select-prev-segment | Fokussiert und waehlt das vorherige Segment (rundum). |
| `ArrowUp` | select-prev-segment | Wie ArrowLeft (Radio-Muster). |
| `Home` | select-first-segment | Waehlt das erste bedienbare Segment. |
| `End` | select-last-segment | Waehlt das letzte bedienbare Segment. |
| `Tab` | focus-group | Nur das gewaehlte Segment steht im Tab-Fluss (roving tabindex). |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `segment-change` | Yes | `{"value":"string","previousValue":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-segmented-control>` custom element:

```js
class NcSegmentedControl extends HTMLElement {
  static observedAttributes = ['size', 'width', 'content', 'indicator'];
  // Slots: <slot name="item">
}
```

---

*Generated from `data/segmented-control-recipe.json` by `scripts/generate-component-specs.js`*
