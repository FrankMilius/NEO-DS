# tooltip Component Spec
> Version 2.0.0 | Status: stable | Layer: molecule

Tags: `overlay`, `informational`, `hover`

## Anatomy
Root element: `.nc-tooltip`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| content | `.nc-tooltip__content` | Yes | — |
| arrow | `.nc-tooltip__arrow` | No | — |

### DOM Notes
- Wrapper um Trigger + Content. Content wird absolut positioniert.
- role='tooltip' auf Content. aria-describedby auf Trigger → verlinkt mit Content-ID.
- Erscheint auf :hover UND :focus-within (Keyboard-Support, kein JS noetig fuer Basis).
- Fester sichtbarer Zustand: Klasse .is-open am Wrapper (.nc-tooltip.is-open) zeigt den Inhalt ohne Hover/Fokus — fuer Doku, Arena und Onboarding-Hinweise. Das Escape-[hidden] von neo-behaviors hat Vorrang. Entscheidung 02.10.2026.
- Tooltip-Inhalt ist ergaenzend, nie essenziell — kein interaktiver Inhalt erlaubt.
- Disabled Trigger: Wrapper <span tabindex='0'> fuer Fokussierbarkeit.
- Arrow ist rein dekorativ — rotiertes CSS-Quadrat, uebernimmt bg, kein DOM-Bedarf fuer a11y.
- Hover-Intent Delay: transition-delay (--nc-tooltip-delay, 300ms) verhindert 'Tooltip-Terror'. Tooltip erscheint erst nach bewusstem Verweilen auf dem Trigger.
- Hoverable Content (WCAG 1.4.13): Im sichtbaren Zustand pointer-events:auto — Nutzer kann mit Maus auf Tooltip fahren ohne Schliessung. Ermoeglicht Text-Selektion/Kopieren.
- ESC-Dismiss (JS): Sichtbare Tooltips per ESC schliessbar (WCAG 1.4.13). JS-seitig implementieren.
- Touch-Geraete (pointer:coarse): :hover-Trigger wird unterdrueckt. Alternativ: long-press per JS oder Popover-Fallback fuer Touch.
- Scale+Fade Animation: Tooltip skaliert von 0.95→1.0 und verschiebt sich 4px in Richtung Ziel. transform-origin per Position.
- Overlay-Hierarchie: Tooltip nutzt elevation-floating (L1, subtilster Schatten). Unter Dropdown/Popover/Modal.

## Variants
### Position (`position`)
Positionierung relativ zum Trigger — top (Standard), bottom, left, right

| Value | CSS Modifier | Default |
| --- | --- | --- |
| top | — |  |
| bottom | `.nc-tooltip--bottom` |  |
| left | `.nc-tooltip--left` |  |
| right | `.nc-tooltip--right` |  |

## States
Supported: `default`, `visible`

- **visible**: 

## CSS Token API
Base classes: `nc-tooltip`

### Appearance
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tooltip-bg` | — | `--mod-tooltip-bg` |
| `--nc-tooltip-color` | — | `--mod-tooltip-color` |
| `--nc-tooltip-padding` | — | `--mod-tooltip-padding` |
| `--nc-tooltip-radius` | — | `--mod-tooltip-radius` |
| `--nc-tooltip-shadow` | — | `--mod-tooltip-shadow` |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tooltip-font-size` | — | `--mod-tooltip-font-size` |
| `--nc-tooltip-max-width` | — | `--mod-tooltip-max-width` |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tooltip-transition-duration` | — | `--mod-tooltip-transition-duration` |
| `--nc-tooltip-transition-timing` | — | `--mod-tooltip-transition-timing` |
| `--nc-tooltip-offset` | — | `--mod-tooltip-offset` |
| `--nc-tooltip-delay` | — | `--mod-tooltip-delay` |

### Arrow
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tooltip-arrow-size` | — | `--mod-tooltip-arrow-size` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Escape` | dismiss | Blendet den sichtbaren Tooltip aus, bis Maus und Fokus das Bauteil verlassen (WCAG 1.4.13). |
| `Tab` | show-on-focus | Fokus auf dem Ausloeser zeigt den Tooltip (CSS :focus-within, kein JS). |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `tooltip-dismiss` | Yes | `{"reason":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-tooltip>` custom element:

```js
class NcTooltip extends HTMLElement {
  static observedAttributes = ['position'];
  // Slots: <slot name="content">
}
```

---

*Generated from `data/tooltip-recipe.json` by `scripts/generate-component-specs.js`*
