# share-bar Component Spec
> Version 1.0.0 | Status: stable | Layer: molecule

Tags: `molecules`, `actions`, `blog`, `website`

## Anatomy
Root element: `.nc-share-bar`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| label | `.nc-share-bar__label` | No | Sichtbares Wort „Teilen“ am Anfang (aria-hidden, die Gruppe traegt aria-label). |
| actions | `.nc-share-bar__actions` | Yes | Icon-Buttons: <button> Teilen (Web Share), <a target="_blank" rel="noopener noreferrer"> LinkedIn, <a href="mailto:"> E-Mail, <button> Link kopieren. Jeder Knopf mit aria-label. |
| popover | `.nc-share-bar__popover` | No | Blase ueber einer markierten Textstelle mit zwei Knoepfen „Zitat teilen“ und „Link kopieren“ (role="group", aria-label="Textstelle teilen"). Steht ausserhalb der Leiste im Artikeltext; Lage und Oeffnen setzt das Behavior teilen. |

### DOM Notes
- Wurzel <div role="group" aria-label="Artikel teilen">. LinkedIn: https://www.linkedin.com/sharing/share-offsite/?url=<Adresse>; E-Mail: mailto:?subject=<Titel>&body=<Adresse>. Beide funktionieren ohne JavaScript.
- Teilen und Link kopieren sind ohne JavaScript ohne Wirkung; das Behavior teilen (Phase 3) blendet sie ein bzw. verdrahtet sie.

## Variants
### Beschriftung (`label`)
Nur Symbole oder mit dem Wort „Teilen“ am Anfang.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| text | — |  |

## States
Supported: `default`, `hover`, `focus`

## CSS Token API
Base classes: `nc-share-bar`

### Leiste
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-share-bar-gap` | — | — |
| `--nc-share-bar-padding-block` | — | — |
| `--nc-share-bar-border-width` | — | — |
| `--nc-share-bar-border-color` | — | — |
| `--nc-share-bar-label-color` | — | — |
| `--nc-share-bar-icon-color` | — | — |

### Blase an der Textstelle
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-share-bar-popover-bg` | — | — |
| `--nc-share-bar-popover-color` | — | — |
| `--nc-share-bar-popover-radius` | — | — |
| `--nc-share-bar-popover-padding` | — | — |
| `--nc-share-bar-popover-shadow` | — | — |
| `--nc-share-bar-popover-arrow` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | focus-next | Teilen, LinkedIn, E-Mail, Link kopieren in Dokumentreihenfolge. |
| `Enter` | activate | Oeffnet den Link bzw. loest den Knopf aus (Verhalten ab Phase 3). |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Leiste und Blase als role="group" mit aria-label
- Jeder Icon-Button mit aria-label; LinkedIn nennt „öffnet in neuem Tab“
- Fokusring der Buttons (focus-ring), Trefferflaeche mindestens 44 px (button-touch-target)

## Web Components Mapping
Derived from anatomy for potential `<nc-share-bar>` custom element:

```js
class NcShareBar extends HTMLElement {
  static observedAttributes = ['label'];
  // Slots: <slot name="actions">
}
```

---

*Generated from `data/share-bar-recipe.json` by `scripts/generate-component-specs.js`*
