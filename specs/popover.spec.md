# popover Component Spec
> Version 2.1.0 | Status: stable | Layer: molecule

Tags: `interactive`, `overlay`, `dialog`, `filter`

## Anatomy
Root element: `.nc-popover`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| trigger | `.nc-popover__trigger` | Yes | — |
| panel | `.nc-popover__panel` | Yes | — |
| arrow | `.nc-popover__arrow` | No | — |
| header | `.nc-popover__header` | No | — |
| body | `.nc-popover__body` | Yes | — |
| footer | `.nc-popover__footer` | No | — |
| close | `.nc-popover__close` | No | — |

### DOM Notes
- Root: inline-flex Wrapper mit Trigger und Panel.
- Trigger: <button aria-haspopup='dialog' aria-expanded='true|false'>.
- Panel: position:absolute, role='dialog' aria-labelledby. Versteckt via [hidden]; fest offen per .is-open an der Wurzel ([hidden] hat Vorrang).
- Unterschied zu Tooltip: Popover ist interaktiv, Focus-Trap, bleibt offen bis geschlossen.
- Positionen: --bottom (default), --top, --left, --right — jeweils zentriert via translate.
- Alignment: --bottom-start, --bottom-end fuer left/right-ausgerichtetes Panel.
- Arrow: 8px rotiertes Quadrat (45deg) mit passender Border-Seite. Optional und dezent — Select/Dropdown haben keinen Pfeil. Arrow ist rein dekorativ: aria-hidden='true'.
- Header: flex-Layout mit Titel + Close-Button, border-bottom Trennlinie.
- Body: padding via nc-popover-padding, beliebiger Inhalt.
- Footer: flex-Layout justify-end mit gap, border-top Trennlinie.
- Close-Button: 24px (nc-popover-close-size), focus-ring, hover-bg. SVG 14px stroke.
- Animation: fnd-scale-in Keyframe, reduced-motion: none.
- Overlay-Hierarchie: Dropdown (elevation-floating, Level 1) → Popover (elevation-overlay, Level 2) → Modal (elevation-modal, Level 3). Alle Overlays: surface-elevated, einheitliche Border/Radius.
- Panel-Konsistenz: nc-popover-bg = surface-elevated (wie nc-dropdown-bg, nc-dialog-bg). nc-popover-radius = fnd-radius-sm (wie nc-dropdown-radius). Gleiche 'Materialitaet' wie alle Overlay-Panels.
- Viewport-Constraint: max-width: min(nc-popover-max-width, calc(100vw - 32px)). Panel darf niemals breiter als der Viewport sein.
- Auto-Placement (Floating UI empfohlen): computePosition({ placement, middleware: [offset(nc-popover-offset), flip(), shift({ padding: 16 })] }). Feste CSS-Positionen als Fallback. JS setzt data-placement='top|bottom|left|right' auf dem Panel.
- Trigger-Modi: 'click' (Standard): Toggle bei Klick. 'hover' (optional): Oeffnet nach 300ms Delay, schliesst bei Mausverlust mit 200ms Delay. Hover-Modus nur fuer nicht-interaktive Vorschau-Inhalte — sobald der Nutzer im Panel interagieren muss, click verwenden.
- Light Dismiss: Klick ausserhalb des Panels schliesst das Popover (JS). Optional: Scroll des Eltern-Containers schliesst (data-dismiss-on-scroll='true'). Pattern: document.addEventListener('click', (e) => { if (!popover.contains(e.target) && !trigger.contains(e.target)) close(); });
- High Contrast Mode: Panel erhaelt 1px solid ButtonText. Close-Button: 2px solid Highlight bei focus-visible.
- Hover-Modus (nc-popover--hover-trigger): Panel im Markup OHNE [hidden]. Ohne JS oeffnet es per CSS bei :hover/:focus-within (wie Tooltip); neo-behaviors setzt beim Binden [hidden] und steuert dann mit 300/200 ms Verzoegerung. Entscheidung 02.10.2026.
- Fester offener Zustand (.is-open an .nc-popover): zeigt das Panel ohne Hover/Klick — fuer Doku, Arena und serverseitig offen gerendertes Markup. Im Klick-Modus regelt [hidden] (is-open ueberstimmt es nicht), im Hover-Modus steht das Panel ohne [hidden] und is-open oeffnet es. neo-behaviors haelt is-open mit dem Panel synchron. Entscheidung 02.10.2026.

## Variants
### Placement (`placement`)
Positionierung des Panels relativ zum Trigger — bottom (Standard), top, left, right, bottom-start, bottom-end. Auto-Placement via Floating UI empfohlen.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| bottom | — |  |
| top | `.nc-popover__panel--top` |  |
| left | `.nc-popover__panel--left` |  |
| right | `.nc-popover__panel--right` |  |
| bottom-start | `.nc-popover__panel--bottom-start` |  |
| bottom-end | `.nc-popover__panel--bottom-end` |  |

### Content (`content`)
Inhaltsvariante — body-only (minimal), with-header (Header + Body), with-footer (Body + Footer), full (Header + Body + Footer), with-arrow (Body + Arrow), form (Header + Form-Fields + Footer)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| body-only | — |  |
| with-header | — |  |
| with-footer | — |  |
| full | — |  |
| with-arrow | — |  |
| form | — |  |

### Trigger (`trigger`)
Interaktionsmodus — click (Standard: Toggle bei Klick), hover (oeffnet nach 300ms Delay, nur fuer nicht-interaktive Vorschau)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| click | — |  |
| hover | `.nc-popover--hover-trigger` |  |

## States
Supported: `default`, `open`

- **open**: 

## CSS Token API
Base classes: `nc-popover`

### Container
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-popover-bg` | — | `--mod-popover-bg` |
| `--nc-popover-border` | — | `--mod-popover-border` |
| `--nc-popover-border-width` | — | `--mod-popover-border-width` |
| `--nc-popover-radius` | — | `--mod-popover-radius` |
| `--nc-popover-shadow` | — | `--mod-popover-shadow` |
| `--nc-popover-padding` | — | `--mod-popover-padding` |
| `--nc-popover-min-width` | — | `--mod-popover-min-width` |
| `--nc-popover-max-width` | — | `--mod-popover-max-width` |
| `--nc-popover-z-index` | — | `--mod-popover-z-index` |
| `--nc-popover-offset` | — | `--mod-popover-offset` |
| `--nc-popover-animation-duration` | — | `--mod-popover-animation-duration` |

### Arrow
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-popover-arrow-size` | — | `--mod-popover-arrow-size` |
| `--nc-popover-arrow-bg` | — | `--mod-popover-arrow-bg` |
| `--nc-popover-arrow-border` | — | `--mod-popover-arrow-border` |

### Header
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-popover-header-padding` | — | `--mod-popover-header-padding` |
| `--nc-popover-header-border` | — | `--mod-popover-header-border` |
| `--nc-popover-header-font-size` | — | `--mod-popover-header-font-size` |
| `--nc-popover-header-font-weight` | — | `--mod-popover-header-font-weight` |
| `--nc-popover-header-color` | — | `--mod-popover-header-color` |

### Footer
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-popover-footer-padding` | — | `--mod-popover-footer-padding` |
| `--nc-popover-footer-border` | — | `--mod-popover-footer-border` |

### Close Button
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-popover-close-size` | — | `--mod-popover-close-size` |
| `--nc-popover-close-radius` | — | `--mod-popover-close-radius` |
| `--nc-popover-close-bg-hover` | — | `--mod-popover-close-bg-hover` |
| `--nc-popover-close-icon-size` | — | `--mod-popover-close-icon-size` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | toggle | Auf dem Ausloeser: oeffnet/schliesst (nativer Klick). Beim Oeffnen geht der Fokus ins Panel. |
| `Space` | toggle | Wie Enter. |
| `Escape` | close | Schliesst, Fokus zurueck auf den Ausloeser. |
| `Tab` | trap-focus | Fokus bleibt im Panel (Fokus-Falle), solange es offen ist. |
| `Shift+Tab` | trap-focus-reverse | Rueckwaerts innerhalb der Fokus-Falle. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `popover-toggle` | Yes | `{"open":"boolean","reason":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-popover>` custom element:

```js
class NcPopover extends HTMLElement {
  static observedAttributes = ['placement', 'content', 'trigger'];
  // Slots: <slot name="trigger">, <slot name="panel">, <slot name="body">
}
```

---

*Generated from `data/popover-recipe.json` by `scripts/generate-component-specs.js`*
