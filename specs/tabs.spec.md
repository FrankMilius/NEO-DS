# tabs Component Spec
> Version 1.0.0 | Status: stable | Layer: molecule

Tags: `navigation`, `interactive`, `disclosure`

## Anatomy
Root element: `.nc-tabs`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| list | `.nc-tabs__list` | Yes | Container fuer Tab-Trigger (role=tablist). |
| trigger | `.nc-tabs__trigger` | Yes | Einzelner Tab-Button (role=tab). |
| trigger-icon | `.nc-tabs__trigger-icon` | No | Icon innerhalb des Triggers. |
| trigger-label | `.nc-tabs__trigger-label` | No | Text-Label im Trigger. |
| panel | `.nc-tabs__panel` | Yes | Inhaltspanel (role=tabpanel), per aria-labelledby verknuepft. |
| scroll-btn | `.nc-tabs__scroll-btn` | No | Scroll-Buttons bei Overflow (--scrollable). |

### DOM Notes
- Tabs verwenden WAI-ARIA Tabs Pattern (role=tablist/tab/tabpanel).
- aria-selected markiert den aktiven Tab, aria-controls verknuepft Tab mit Panel.
- Keyboard: Arrow Left/Right navigiert Tabs, Home/End springt zum ersten/letzten.
- Line-Variante (Default): Underline-Indikator unter dem aktiven Tab.
- Contained-Variante: Gefuellter Hintergrund mit Shadow fuer aktiven Tab.
- Groessen nutzen die Button-Scale (SM=32px, MD=40px, LG=48px).

## Variants
### Variante (`variant`)
Visuelle Darstellung der Tabs.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| Line (Underline-Indikator) | `.nc-tabs--line` | Yes |
| Contained (gefuellter Hintergrund) | `.nc-tabs--contained` |  |

### Orientierung (`orientation`)
Anordnung der Tab-Leiste.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| Horizontal (Standard) | — | Yes |
| Vertikal (seitlich) | `.nc-tabs--vertical` |  |

### Groesse (`size`)
Hoehe der Tab-Trigger.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| Small (32px) | `.nc-tabs--sm` |  |
| Medium (40px, Default) | `.nc-tabs--md` | Yes |
| Large (48px) | `.nc-tabs--lg` |  |

### Overflow (`overflow`)
Verhalten bei zu vielen Tabs.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| Wrap (Zeilenumbruch) | — | Yes |
| Scrollable (Scroll-Buttons) | `.nc-tabs--scrollable` |  |

## States
Supported: `default`, `hover`, `active`, `focus`, `disabled`

- Genau ein Tab ist immer aktiv (aria-selected=true).
- Disabled Tabs sind nicht anklickbar (aria-disabled=true, opacity: --fnd-opacity-disabled).

## CSS Token API
Base classes: `.nc-tabs`

### Trigger
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tabs-trigger-color` | color | `--mod-tabs-trigger-color` |
| `--nc-tabs-trigger-color-hover` | color | `--mod-tabs-trigger-color-hover` |
| `--nc-tabs-trigger-color-active` | color | `--mod-tabs-trigger-color-active` |
| `--nc-tabs-trigger-font-weight` | font-weight | `--mod-tabs-trigger-font-weight` |
| `--nc-tabs-trigger-font-weight-active` | font-weight | `--mod-tabs-trigger-font-weight-active` |

### Line Variant
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tabs-line-border-color` | border-color | `--mod-tabs-line-border-color` |
| `--nc-tabs-line-indicator-color` | border-color (active) | `--mod-tabs-line-indicator-color` |

### Contained Variant
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tabs-contained-bg` | background | `--mod-tabs-contained-bg` |
| `--nc-tabs-contained-trigger-bg-active` | background (active) | `--mod-tabs-contained-trigger-bg-active` |
| `--nc-tabs-contained-trigger-shadow` | box-shadow (active) | `--mod-tabs-contained-trigger-shadow` |

### Sizes
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tabs-height-sm` | height | `--mod-tabs-height-sm` |
| `--nc-tabs-height-md` | height | `--mod-tabs-height-md` |
| `--nc-tabs-height-lg` | height | `--mod-tabs-height-lg` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `ArrowRight` | focus-next-tab | Fokussiert naechsten Tab (horizontal). |
| `ArrowLeft` | focus-prev-tab | Fokussiert vorherigen Tab (horizontal). |
| `ArrowDown` | focus-next-tab | Fokussiert naechsten Tab (vertikal). |
| `ArrowUp` | focus-prev-tab | Fokussiert vorherigen Tab (vertikal). |
| `Home` | focus-first-tab | Springt zum ersten Tab. |
| `End` | focus-last-tab | Springt zum letzten Tab. |
| `Enter` | activate-tab | Aktiviert den fokussierten Tab (falls nicht auto-activate). |
| `Space` | activate-tab | Aktiviert den fokussierten Tab. |
| `Tab` | focus-panel | Springt direkt zum aktiven Panel-Inhalt (nicht durch alle Tabs). |

## Test Selectors
| Slot | Selector |
| --- | --- |
| root | `[data-testid='tabs']` |
| list | `[data-testid='tabs-list']` |
| trigger | `[data-testid='tabs-trigger']` |
| panel | `[data-testid='tabs-panel']` |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `tab-change` | Yes | `{"value":"string","previousValue":"string"}` |

## Accessibility
ARIA Role: `tablist`

- Tab-Leiste hat role=tablist, Tabs haben role=tab, Panels haben role=tabpanel.
- aria-selected=true auf aktivem Tab.
- aria-controls auf Tab verweist auf Panel-ID, aria-labelledby auf Panel verweist auf Tab-ID.
- Arrow Keys navigieren horizontal, Home/End springen zum Anfang/Ende.
- Tab-Key springt direkt zum aktiven Panel-Inhalt (nicht durch alle Tabs).

## Web Components Mapping
Derived from anatomy for potential `<nc-tabs>` custom element:

```js
class NcTabs extends HTMLElement {
  static observedAttributes = ['variant', 'orientation', 'size', 'overflow'];
  // Slots: <slot name="list">, <slot name="trigger">, <slot name="panel">
}
```

---

*Generated from `data/tabs-recipe.json` by `scripts/generate-component-specs.js`*
