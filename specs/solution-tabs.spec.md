# solution-tabs Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `display`, `content`, `interactive`, `tabs`

## Anatomy
Root element: `.nc-solution-tabs`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| tablist | `.nc-solution-tabs__tablist` | Yes | Tab-Leiste. role='tablist'. Horizontal oben oder vertikal seitlich (--vertical). |
| tab | `.nc-solution-tabs__tab` | Yes | Einzelner Tab. button[role='tab'] mit aria-selected/aria-controls. Enthaelt optionalen Index und Progress-Indikator. |
| progress | `.nc-solution-tabs__progress` | No | Fortschrittsbalken im aktiven Tab bei Autoplay; im Vertikal-Modus statischer Akzent-Indikator. |
| panel | `.nc-solution-tabs__panel` | Yes | Tab-Panel. role='tabpanel'. Sichtbar via .is-active. Grid aus Inhalt + Produkt-Visual. |
| panel-title | `.nc-solution-tabs__panel-title` | Yes | Panel-Ueberschrift (h3). |
| features | `.nc-solution-tabs__features` | No | Feature-Liste mit gestaffelter Einblendung. |
| cta | `.nc-solution-tabs__cta` | No | Call-to-Action-Button im Panel. |
| visual | `.nc-solution-tabs__visual` | No | Produkt-Visual (Mock-UI mit Chip, Name, Skeleton-Linien). Dekorativ, aria-hidden. |

### DOM Notes
- Root .nc-solution-tabs setzt --nc-solution-tabs-accent (Default = -accent-default), per Panel via Inline-Style ueberschreibbar.
- Tablist role='tablist'; horizontal (flex row) oder vertikal (--vertical, flex column, border-inline-start).
- Tab button[role='tab'][aria-selected][aria-controls]; aktives Panel .is-active (display:grid).
- Autoplay: data-autoplay='on' am Root; Progress-Balken animiert ueber --nc-solution-tabs-autoplay-duration; .is-paused pausiert (Hover/Fokus). JS rotiert die Tabs.
- Vertikal: Progress wird zum vertikalen Akzent-Indikator (scaleY); Visual steht oben (order:-1).
- Variant contained: gefuellte Tabs ohne Underline/Progress.
- Tastatur: ArrowLeft/Right (horizontal) bzw. ArrowUp/Down (vertikal) navigiert; Enter/Space aktiviert.
- Responsive 880px: Panel einspaltig, Tablist horizontal scrollbar.
- prefers-reduced-motion: keine Panel-/Feature-Animation, kein Autoplay-Progress.

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
| `--nc-solution-tabs-border` | — | `--mod-solution-tabs-border` |
| `--nc-solution-tabs-visual-bg` | — | `--mod-solution-tabs-visual-bg` |

### Tabs & Autoplay
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-solution-tabs-tab-color` | — | `--mod-solution-tabs-tab-color` |
| `--nc-solution-tabs-tab-color-active` | — | `--mod-solution-tabs-tab-color-active` |
| `--nc-solution-tabs-autoplay-duration` | — | `--mod-solution-tabs-autoplay-duration` |

### Accent & Text
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-solution-tabs-accent-default` | — | `--mod-solution-tabs-accent-default` |
| `--nc-solution-tabs-title` | — | `--mod-solution-tabs-title` |
| `--nc-solution-tabs-text` | — | `--mod-solution-tabs-text` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

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
