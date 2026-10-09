# treeview Component Spec
> Version 2.1.0 | Status: stable | Layer: molecule

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
- Children-Slot nutzt CSS-Grid 0fr→1fr Animation fuer Slide-Down. Zugeklappt (aria-expanded ungleich true) ist der Slot zusaetzlich visibility: hidden — die Eigenschaft laeuft in der Transition mit, die Kinder sind also auch fuer Tastatur und Screenreader weg, ohne JS und ohne die Animation zu brechen (Entscheidung 03.10.2026, nav-a11y). Ohne __children-Wrapper: display: none.
- Action-Slot (rechts) wird bei Hover, Focus-within und Fokus auf dem Eintrag (treeitem) sichtbar.
- Guide-Lines: Vertikale Linien verbinden Eltern mit Kindern (optional).
- Checkbox-Mode: Checkboxen pro Node fuer Multi-Select (aria-checked).
- Drag-Handle: 6-dots Griff, nur bei --draggable Modifier sichtbar.
- Fokus (Entscheidung 03.10.2026, nav-a11y): roving tabindex auf dem li[role=treeitem] — genau ein Eintrag hat tabindex='0', alle anderen '-1'; .nc-treeview__node ist nicht fokussierbar. Der Fokusring liegt sichtbar auf der Zeile (.nc-treeview__item:focus-visible > .nc-treeview__node). Toggle, Checkbox, Link und Ziehgriff tragen tabindex='-1' (Bedienung ueber die Tasten am Eintrag).
- Name: aria-labelledby am treeitem verweist auf .nc-treeview__label bzw. __link — sonst zaehlte der ganze Ast zum Namen. neo-behaviors ergaenzt es, wenn es fehlt.
- Zeilen-Aktionen (Entscheidung 03.10.2026, nav-a11y): .nc-treeview__action tragen tabindex='0' nur in der Zeile mit dem Tab-Stopp, sonst '-1' — Tab fuehrt vom fokussierten Eintrag in dessen Aktionen und danach aus dem Baum, Shift+Tab zurueck, Escape in einer Aktion zurueck auf den Eintrag. Pfeiltasten bleiben dem Baum vorbehalten (WAI-ARIA Tree View: keine Pfeilnavigation in die Zeile).
- Gesperrte Eintraege (Entscheidung 03.10.2026, tree-gesperrt = Ueberspringen): Pfeiltasten, Pos1 und Ende ueberspringen sie, sie sind nicht waehlbar und nicht klappbar — einheitlich mit Tabs, Segmented Control usw.

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
| `--nc-treeview-indent` | — | `--mod-treeview-indent` |
| `--nc-treeview-item-height` | — | `--mod-treeview-item-height` |
| `--nc-treeview-item-height-compact` | — | `--mod-treeview-item-height-compact` |
| `--nc-treeview-item-padding-x` | — | `--mod-treeview-item-padding-x` |
| `--nc-treeview-gap` | — | `--mod-treeview-gap` |
| `--nc-treeview-radius` | — | `--mod-treeview-radius` |

### Toggle
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-treeview-toggle-size` | — | `--mod-treeview-toggle-size` |
| `--nc-treeview-toggle-color` | — | `--mod-treeview-toggle-color` |
| `--nc-treeview-toggle-color-hover` | — | `--mod-treeview-toggle-color-hover` |
| `--nc-treeview-toggle-transition` | — | `--mod-treeview-toggle-transition` |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-treeview-label-font-size` | — | `--mod-treeview-label-font-size` |
| `--nc-treeview-label-color` | — | `--mod-treeview-label-color` |
| `--nc-treeview-label-font-weight` | — | `--mod-treeview-label-font-weight` |
| `--nc-treeview-label-font-weight-selected` | — | `--mod-treeview-label-font-weight-selected` |
| `--nc-treeview-icon-size` | — | `--mod-treeview-icon-size` |
| `--nc-treeview-icon-color` | — | `--mod-treeview-icon-color` |

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-treeview-bg-hover` | — | `--mod-treeview-bg-hover` |
| `--nc-treeview-bg-selected` | — | `--mod-treeview-bg-selected` |
| `--nc-treeview-bg-active` | — | — |
| `--nc-treeview-border-selected` | — | `--mod-treeview-border-selected` |
| `--nc-treeview-border-selected-width` | — | `--mod-treeview-border-selected-width` |
| `--nc-treeview-disabled-opacity` | — | `--mod-treeview-disabled-opacity` |
| `--nc-treeview-transition-duration` | — | `--mod-treeview-transition-duration` |

### Links
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-treeview-link-color` | — | `--mod-treeview-link-color` |
| `--nc-treeview-link-color-hover` | — | `--mod-treeview-link-color-hover` |

### Guide-Lines
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-treeview-guide-color` | — | `--mod-treeview-guide-color` |
| `--nc-treeview-guide-width` | — | `--mod-treeview-guide-width` |
| `--nc-treeview-guide-style` | — | — |
| `--nc-treeview-guide-opacity` | — | `--mod-treeview-guide-opacity` |

### Action-Slot
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-treeview-action-gap` | — | `--mod-treeview-action-gap` |
| `--nc-treeview-action-color` | — | `--mod-treeview-action-color` |
| `--nc-treeview-action-color-hover` | — | `--mod-treeview-action-color-hover` |
| `--nc-treeview-action-size` | — | `--mod-treeview-action-size` |

### Checkbox
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-treeview-checkbox-size` | — | `--mod-treeview-checkbox-size` |
| `--nc-treeview-checkbox-gap` | — | — |

### Badge
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-treeview-badge-font-size` | — | `--mod-treeview-badge-font-size` |
| `--nc-treeview-badge-radius` | — | `--mod-treeview-badge-radius` |
| `--nc-treeview-badge-padding` | — | `--mod-treeview-badge-padding` |
| `--nc-treeview-badge-bg` | — | `--mod-treeview-badge-bg` |
| `--nc-treeview-badge-color` | — | `--mod-treeview-badge-color` |

### Drag & Drop
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-treeview-drop-indicator-color` | — | `--mod-treeview-drop-indicator-color` |
| `--nc-treeview-drop-indicator-width` | — | `--mod-treeview-drop-indicator-width` |
| `--nc-treeview-drag-opacity` | — | `--mod-treeview-drag-opacity` |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-treeview-expand-duration` | — | `--mod-treeview-expand-duration` |

### Bordered Variant
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-treeview-bordered-border-color` | — | `--mod-treeview-bordered-border-color` |
| `--nc-treeview-bordered-border-width` | — | `--mod-treeview-bordered-border-width` |
| `--nc-treeview-bordered-radius` | — | `--mod-treeview-bordered-radius` |
| `--nc-treeview-bordered-padding` | — | `--mod-treeview-bordered-padding` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `ArrowDown` | focus-next-item | Naechster sichtbarer Eintrag (kein Rundum, gesperrte uebersprungen — Entscheidung 03.10.2026, tree-gesperrt). Der Fokus liegt auf dem li[role=treeitem]. |
| `ArrowUp` | focus-prev-item | Vorheriger sichtbarer Eintrag. |
| `ArrowRight` | expand-or-focus-child | Zweig zu: klappt auf (Fokus bleibt). Zweig offen: erstes Kind. Blatt: nichts. |
| `ArrowLeft` | collapse-or-focus-parent | Zweig offen: klappt zu. Sonst: Eltern-Eintrag. |
| `Home` | focus-first-item | Erster Eintrag des Baums. |
| `End` | focus-last-item | Letzter sichtbarer Eintrag. |
| `Enter` | select | Waehlt den Eintrag (single: aria-selected) bzw. hakt ihn an (multiple: aria-checked samt Nachfahren). Steht ein Link in der Zeile (__link), folgt Enter ihm. |
| `Space` | select | Wie Enter, ohne dem Link zu folgen. |
| `Tab` | focus-row-actions-or-leave | Genau ein Eintrag (li[role=treeitem]) ist im Tab-Fluss (roving tabindex). Hat seine Zeile Aktionen (.nc-treeview__action), fuehrt Tab in diese — nur die Zeile mit dem Tab-Stopp hat sie im Tab-Fluss —, danach verlaesst Tab den Baum (Entscheidung 03.10.2026). |
| `Shift+Tab` | focus-item-from-actions | Von der ersten Zeilen-Aktion zurueck auf den Eintrag (nativ, der Eintrag steht im Dokument davor); vom Eintrag aus vor den Baum. |
| `Escape` | focus-item | In einer Zeilen-Aktion: Fokus zurueck auf den Eintrag. Am Eintrag selbst: keine Wirkung. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `treeview-toggle` | Yes | `{"value":"string","expanded":"boolean"}` |
| `treeview-select` | Yes | `{"value":"string","selected":"boolean","values":"string[]"}` |

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
