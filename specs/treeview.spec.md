# treeview Component Spec
> Version 2.0.0 | Status: stable | Layer: molecule

Tags: `navigation`, `interactive`, `hierarchy`

## Anatomy
Root element: `.nc-treeview`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| node | `.nc-treeview__node` | Yes | — |
| toggle | `.nc-treeview__toggle` | No | — |
| checkbox | `.nc-treeview__checkbox` | No | — |
| icon | `.nc-treeview__icon` | No | — |
| label | `.nc-treeview__label` | Yes | — |
| badge | `.nc-treeview__badge` | No | — |
| actions | `.nc-treeview__actions` | No | — |
| drag-handle | `.nc-treeview__drag-handle` | No | — |
| children | `.nc-treeview__children` | No | — |

### DOM Notes
- Hierarchische Baumstruktur mit role=tree und role=treeitem.
- Toggle-Chevron rotiert sanft 0° auf 90° bei Expand (CSS transition).
- Children-Slot nutzt CSS-Grid 0fr→1fr Animation fuer Slide-Down.
- Action-Slot (rechts) wird nur bei Hover/Focus-within sichtbar.
- Guide-Lines: Vertikale Linien verbinden Eltern mit Kindern (optional).
- Checkbox-Mode: Checkboxen pro Node fuer Multi-Select (aria-checked).
- Drag-Handle: 6-dots Griff, nur bei --draggable Modifier sichtbar.

## HTML API
### Elements
| Variant | Element | Attributes |
| --- | --- | --- |
| default | `<nav>` | aria-label? |

### Attributes
| Name | Type | Applies To |
| --- | --- | --- |
| `role` | string | ul |
| `role` | string | li |
| `aria-expanded` | boolean | li |
| `aria-selected` | boolean | li |
| `aria-checked` | string | li |
| `aria-disabled` | boolean | li |
| `aria-level` | number | li |
| `aria-setsize` | number | li |
| `aria-posinset` | number | li |

## Variants
### Variant (`variant`)
Visuelle Variante — default, bordered, compact, flush

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| bordered | `.nc-treeview--bordered` |  |
| compact | `.nc-treeview--compact` |  |
| flush | `.nc-treeview--flush` |  |

### Selection Mode (`selection`)
Selektionsmodus — single (aria-selected) oder multiple (Checkboxen)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| single | — |  |
| multiple | `.nc-treeview--checkboxes` |  |

### Line Style (`lines`)
Vertikale Guide-Lines zur Orientierung in tiefen Baeumen

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| solid | `.nc-treeview--lines-solid` |  |
| dashed | `.nc-treeview--lines-dashed` |  |

### Interaction (`interaction`)
Interaktionsmodus — static (nur Expand/Select) oder draggable (Drag & Drop)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| static | — |  |
| draggable | `.nc-treeview--draggable` |  |

## States
Supported: `default`, `hover`, `active`, `focus-visible`, `expanded`, `selected`, `disabled`

- **expanded**: 
- **selected**: 
- **disabled**: blockInteraction

## CSS Token API
Base classes: `nc-treeview`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-treeview-indent` | — | — |
| `nc-treeview-item-height` | — | — |
| `nc-treeview-item-height-compact` | — | — |
| `nc-treeview-item-padding-x` | — | — |
| `nc-treeview-gap` | — | — |
| `nc-treeview-radius` | — | — |

### Toggle
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-treeview-toggle-size` | — | — |
| `nc-treeview-toggle-color` | — | — |
| `nc-treeview-toggle-color-hover` | — | — |
| `nc-treeview-toggle-transition` | — | — |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-treeview-label-font-size` | — | — |
| `nc-treeview-label-color` | — | — |
| `nc-treeview-label-font-weight` | — | — |
| `nc-treeview-label-font-weight-selected` | — | — |
| `nc-treeview-icon-size` | — | — |
| `nc-treeview-icon-color` | — | — |

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-treeview-bg-hover` | — | — |
| `nc-treeview-bg-selected` | — | — |
| `nc-treeview-bg-active` | — | — |
| `nc-treeview-border-selected` | — | — |
| `nc-treeview-border-selected-width` | — | — |
| `nc-treeview-disabled-opacity` | — | — |
| `nc-treeview-transition-duration` | — | — |

### Links
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-treeview-link-color` | — | — |
| `nc-treeview-link-color-hover` | — | — |

### Guide-Lines
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-treeview-guide-color` | — | — |
| `nc-treeview-guide-width` | — | — |
| `nc-treeview-guide-style` | — | — |
| `nc-treeview-guide-opacity` | — | — |

### Action-Slot
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-treeview-action-gap` | — | — |
| `nc-treeview-action-color` | — | — |
| `nc-treeview-action-color-hover` | — | — |
| `nc-treeview-action-size` | — | — |

### Checkbox
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-treeview-checkbox-size` | — | — |
| `nc-treeview-checkbox-gap` | — | — |

### Badge
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-treeview-badge-font-size` | — | — |
| `nc-treeview-badge-radius` | — | — |
| `nc-treeview-badge-padding` | — | — |
| `nc-treeview-badge-bg` | — | — |
| `nc-treeview-badge-color` | — | — |

### Drag & Drop
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-treeview-drop-indicator-color` | — | — |
| `nc-treeview-drop-indicator-width` | — | — |
| `nc-treeview-drag-opacity` | — | — |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-treeview-expand-duration` | — | — |

### Bordered Variant
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-treeview-bordered-border-color` | — | — |
| `nc-treeview-bordered-border-width` | — | — |
| `nc-treeview-bordered-radius` | — | — |
| `nc-treeview-bordered-padding` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- focusIndicatorVisible

## Web Components Mapping
Derived from anatomy for potential `<nc-treeview>` custom element:

```js
class NcTreeview extends HTMLElement {
  static observedAttributes = ['variant', 'selection', 'lines', 'interaction'];
  // Slots: <slot name="node">, <slot name="label">
}
```

---

*Generated from `data/treeview-recipe.json` by `scripts/generate-component-specs.js`*
