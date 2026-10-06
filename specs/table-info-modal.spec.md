# table-info-modal Component Spec
> Version 1.2.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `organisms`

## Anatomy
Root element: `.nc-table-info-modal`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| backdrop | `.nc-table-info-modal__backdrop` | Yes | — |
| body | `.nc-table-info-modal__body` | Yes | — |
| close | `.nc-table-info-modal__close` | Yes | — |
| content | `.nc-table-info-modal__content` | Yes | — |

### DOM Notes
- Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.
- Slots sind aus Klassennamen abgeleitet. Die ersten sechs werden in der Story gerendert, um die Struktur zu zeigen — welche wirklich Pflicht sind, klaert erst eine Spezifikation.
- Markup wie data/markup/table-info-modal.html: div[role=dialog] mit __backdrop und __content (__close, __body). Den Text der Zelle setzt das Behavior table-info-modal aus data-info des Ausloesers (als Text, Zeilenumbruch = Absatz) in __body; auf der Website bis zur Umstellung noch neo-theme.js (neoTable, openInfoModal).
- Zustand open = .is-open (SCSS blendet per opacity ein). hover/focus nur am Schliessen-Knopf.
- Die Ernte hat keinen Namen am Dialog (aria-labelledby) und kein aria-modal — die Arena ergaenzt beides.
- Ausloeser: Info-Knopf der Zelle (.nc-tbl-cell__info-btn) mit aria-controls="<id des Dialogs>", aria-haspopup="dialog" und aria-label. Modal (neo-behaviors table-info-modal): aria-modal, Fokus auf den Schliessen-Knopf, Fokus-Falle, Rest der Seite inert; geschlossen inert + aria-hidden="true" (sonst bleibt der unsichtbare Schliessen-Knopf per Tab erreichbar). Ohne Namen am Dialog nimmt er den des Ausloesers.

## Variants
### Variant (`variant`)
Standard

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`, `open`, `hover`, `focus`

## CSS Token API
Base classes: `nc-table-info-modal`

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | open | Auf dem Info-Knopf mit aria-controls (nativer Knopf): oeffnet den Dialog, Fokus auf den Schliessen-Knopf. |
| `Space` | open | Wie Enter auf dem Info-Knopf. |
| `Escape` | close | Schliesst den Dialog, Fokus zurueck auf den Info-Knopf. |
| `Tab` | trap-focus | Fokus bleibt im Dialog (Fokus-Falle). |
| `Shift+Tab` | trap-focus-reverse | Rueckwaerts innerhalb der Fokus-Falle. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `table-info-modal-open` | Yes | — |
| `table-info-modal-close` | Yes | `{"reason":"string"}` |

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-table-info-modal>` custom element:

```js
class NcTableInfoModal extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="backdrop">, <slot name="body">, <slot name="close">, <slot name="content">
}
```

---

*Generated from `data/table-info-modal-recipe.json` by `scripts/generate-component-specs.js`*
