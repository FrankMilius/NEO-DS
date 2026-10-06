# feature-accordion Component Spec
> Version 1.2.0 | Status: stable | Layer: organism

Tags: `display`, `interactive`, `content`

## Anatomy
Root element: `.nc-feature-accordeon`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| left | `.nc-feature-accordeon__left` | Yes | — |
| title | `.nc-feature-accordeon__title` | No | — |

### DOM Notes
- 2-Spalten Grid: nav-links (left) + expandable chapters (right).
- Left: grid, align-content start, gap 1.5rem. Title: heading font, clamp 2-3.2rem, max-width 16ch.
- Gap: clamp(2rem, 4vw, 4.5rem). Columns: minmax(260px, 0.95fr) + minmax(320px, 1fr).
- Verhalten (neo-behaviors feature-accordion): Link i gehoert zu Kapitel i (oder per aria-controls zur id des Kapitels). Aktiver Link: .is-active + aria-current="true". Klick scrollt das Kapitel an den Anfang von __right (overflow-y auto in der zweispaltigen Lage) bzw. die Seite (gestapelt), Fokus aufs Kapitel (tabindex=-1); Scrollen der Spalte markiert das letzte Kapitel, dessen Oberkante ihren Anfang + 24 px passiert hat. Die <details> klappt der Browser.

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`, `open`

- **open**: 

## CSS Token API
Base classes: `nc-feature-accordeon`

### Base
## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | jump-or-toggle | Auf einem Link (nativer Knopf): markiert ihn, scrollt sein Kapitel an den Anfang der rechten Spalte, Fokus aufs Kapitel. Auf einem Eintrag (<summary>): klappt auf/zu (nativ). |
| `Space` | jump-or-toggle | Wie Enter. |
| `Tab` | native | Links und Eintraege in Dokumentreihenfolge (kein roving tabindex); nach einem Sprung geht Tab im Kapitel weiter. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `feature-accordion-change` | Yes | `{"index":"number","previousIndex":"number"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-feature-accordion>` custom element:

```js
class NcFeatureAccordion extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="left">
}
```

---

*Generated from `data/feature-accordion-recipe.json` by `scripts/generate-component-specs.js`*
