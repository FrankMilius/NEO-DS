# multiselect Component Spec
> Version 1.3.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `molecules`

## Anatomy
Root element: `.nc-multiselect`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| caret | `.nc-multiselect__caret` | Yes | — |
| option | `.nc-multiselect__option` | Yes | — |
| panel | `.nc-multiselect__panel` | Yes | — |
| trigger | `.nc-multiselect__trigger` | Yes | — |
| value | `.nc-multiselect__value` | Yes | — |
| value--empty | `.nc-multiselect__value--empty` | Yes | — |

### DOM Notes
- Feld-Wrapper: .nc-form-field.nc-multiselect (position relative) mit .nc-form-label, Knopf .nc-multiselect__trigger (aria-haspopup, aria-expanded) und Panel .nc-multiselect__panel (absolut unter dem Feld: inset-block-start calc(100% + spacing-01); neo-theme.js bzw. das Behavior multiselect setzen die Lage beim Oeffnen zusaetzlich inline).
- Optionen sind Checkboxen: label.nc-checkbox.nc-multiselect__option mit .nc-checkbox__input/__control/__label.
- Geoeffnet: .is-open am Feld dreht den Pfeil (.nc-multiselect__caret); das Panel steht im Markup und ist geschlossen [hidden]. Achtung: display: flex des Panels gewinnt gegen [hidden] — das Behavior setzt geschlossen zusaetzlich display: none inline. Knopf mit aria-controls auf das Panel (setzt das Behavior, falls es fehlt).
- Ohne Auswahl: .nc-multiselect__value--empty mit Platzhaltertext. Fehler: .nc-form-field--invalid faerbt den Rahmen des Knopfs.
- Aus dem Drupal-Theme uebernommen (neo-theme.js, case 'multiselect'). Verhalten: Behavior multiselect (neo-behaviors) — Oeffnen/Schliessen, Pfeiltasten, Escape, Klick ausserhalb, Zusammenfassung im Knopf (bis zwei Namen, sonst „<n> ausgewählt“, leer: Platzhalter aus data-placeholder bzw. dem Anfangstext), Ereignis multiselect-change. Pflichtfeld-Pruefung bleibt beim Formular.

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`, `hover`, `focus`, `open`, `error`

## CSS Token API
Base classes: `nc-multiselect`

### Base
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-multiselect-option-padding` | — | `--mod-multiselect-option-padding` |
| `--nc-multiselect-panel-box-shadow` | — | `--mod-multiselect-panel-box-shadow` |
| `--nc-multiselect-panel-gap` | — | `--mod-multiselect-panel-gap` |
| `--nc-multiselect-panel-padding` | — | `--mod-multiselect-panel-padding` |
| `--nc-multiselect-trigger-font-size` | — | `--mod-multiselect-trigger-font-size` |
| `--nc-multiselect-trigger-gap` | — | `--mod-multiselect-trigger-gap` |
| `--nc-multiselect-trigger-padding` | — | `--mod-multiselect-trigger-padding` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | open | Auf dem geschlossenen Knopf: oeffnet das Panel, Fokus auf die erste Checkbox (wie die Website). Offen: schaltet per Klick zu. |
| `Space` | open-or-toggle-option | Auf dem geschlossenen Knopf: wie Enter. Auf einer Checkbox: waehlt bzw. waehlt ab (nativ), Zusammenfassung und multiselect-change folgen. |
| `ArrowDown` | open-or-next | Auf dem geschlossenen Knopf: oeffnet, Fokus auf die erste Checkbox. In der Liste: naechste Checkbox (rundum). |
| `ArrowUp` | previous | In der Liste: vorherige Checkbox (rundum). |
| `Home` | first | In der Liste: erste Checkbox. |
| `End` | last | In der Liste: letzte Checkbox. |
| `Escape` | close | Schliesst das Panel; aus der Liste Fokus zurueck auf den Knopf. |
| `Tab` | close-on-leave | Normaler Tab-Fluss durch Knopf und Checkboxen; verlaesst der Fokus das Feld, schliesst das Panel. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `multiselect-change` | Yes | `{"values":"string[]"}` |

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-multiselect>` custom element:

```js
class NcMultiselect extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="caret">, <slot name="option">, <slot name="panel">, <slot name="trigger">, <slot name="value">, <slot name="value--empty">
}
```

---

*Generated from `data/multiselect-recipe.json` by `scripts/generate-component-specs.js`*
