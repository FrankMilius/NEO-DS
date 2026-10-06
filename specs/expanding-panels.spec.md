# expanding-panels Component Spec
> Version 1.1.0 | Status: stable | Layer: organism

Tags: `display`, `content`, `interactive`, `disclosure`

## Anatomy
Root element: `.nc-expanding-panels`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| panel | `.nc-expanding-panels__panel` | Yes | Einzelnes Panel. <button> mit aria-expanded. Expandiert bei Hover/Fokus/Aktiv via flex-grow. |
| label | `.nc-expanding-panels__label` | Yes | Vertikales Label im Ruhezustand. Wird beim Expandieren ausgeblendet. |
| num | `.nc-expanding-panels__num` | No | Laufende Nummer oben links. |
| body | `.nc-expanding-panels__body` | Yes | Detail-Inhalt, sichtbar wenn Panel aktiv. Enthaelt Chip, Titel, Text. |
| bg | `.nc-expanding-panels__bg` | No | Dekorativer Radial-Hintergrund pro Panel. aria-hidden. |

### DOM Notes
- Root .nc-expanding-panels: display:flex, gap, feste Hoehe (--nc-expanding-panels-height).
- Panel: button[aria-expanded], flex:1; bei :hover/:focus-within/[aria-expanded=true] flex-grow:--nc-expanding-panels-grow.
- Label (.nc-expanding-panels__label): writing-mode:vertical-rl + rotate(180deg); opacity:0 wenn Panel aktiv.
- Body (.nc-expanding-panels__body): position:absolute, justify-content:flex-end; opacity:0/translateY bis aktiv.
- Chip im Body: margin-bottom:auto schiebt ihn nach oben.
- Single-Open: JS setzt aria-expanded='true' am geklickten Panel, 'false' an allen anderen; initial erstes Panel aktiv.
- Tastatur: Enter/Space aktiviert (nativer Button-Klick); ArrowLeft/Right wechselt das aktive Panel.
- Responsive 820px: flex-direction:column (vertikales Akkordeon); Label horizontal; Body zentriert.
- prefers-reduced-motion: keine Transitions.

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`, `hover`, `focus`, `open`

## CSS Token API
Base classes: `nc-expanding-panels`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-expanding-panels-gap` | — | `--mod-expanding-panels-gap` |
| `--nc-expanding-panels-height` | — | `--mod-expanding-panels-height` |
| `--nc-expanding-panels-radius` | — | `--mod-expanding-panels-radius` |
| `--nc-expanding-panels-grow` | — | `--mod-expanding-panels-grow` |

### Surface & Border
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-expanding-panels-surface` | — | `--mod-expanding-panels-surface` |
| `--nc-expanding-panels-border` | — | `--mod-expanding-panels-border` |

### Accent & Text
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-expanding-panels-accent` | — | `--mod-expanding-panels-accent` |
| `--nc-expanding-panels-title` | — | `--mod-expanding-panels-title` |
| `--nc-expanding-panels-text` | — | `--mod-expanding-panels-text` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-expanding-panels>` custom element:

```js
class NcExpandingPanels extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="panel">, <slot name="label">, <slot name="body">
}
```

---

*Generated from `data/expanding-panels-recipe.json` by `scripts/generate-component-specs.js`*
