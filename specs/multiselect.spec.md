# multiselect Component Spec
> Version 1.5.2 | Status: stable | Layer: molecule

Tags: `aufgenommen`, `molecules`

## Anatomy
Root element: `.nc-multiselect`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| trigger | `.nc-multiselect__trigger` | Yes | Disclosure-Knopf (button type=button, volle Breite, min. 2,75rem hoch, Rahmen wie .nc-input ueber --nc-multiselect-trigger-border-*) mit aria-expanded, aria-controls aufs Panel und aria-labelledby (Label + Knopf); Hover/Fokus/Fehler/deaktiviert Rahmen wie .nc-input, :focus-visible Ring interactive-focus. |
| value | `.nc-multiselect__value` | Yes | Zusammenfassung im Knopf (einzeilig, Auslassungspunkte): bis zwei Namen mit Komma, sonst „<n> ausgewählt"; ohne Auswahl der Platzhalter mit __value--empty (text-tertiary). |
| caret | `.nc-multiselect__caret` | Yes | Pfeil ▾ (aria-hidden, text-secondary); dreht sich bei .is-open am Feld um 180°. |
| panel | `.nc-multiselect__panel` | Yes | Liste unter dem Feld (absolut, inset-block-start 100 % + spacing-01, hoechstens 16rem hoch, scrollt) mit role=group und aria-labelledby aufs Label; geschlossen [hidden]. |
| option | `.nc-multiselect__option` | Yes | Option als Checkbox: label.nc-checkbox.nc-multiselect__option mit .nc-checkbox__input (name[], value), __control und __label; min. 2,5rem hoch, Hover background-secondary. |

### DOM Notes
- Markup der Website (neo-theme.js, neoForm case 'multiselect'; die Arena-Vorlage folgt ihm): div.nc-form-field.nc-multiselect (position relative, optional --full-width) > span.nc-form-label#<feld>-label (Text + „ *" aria-hidden bzw. „(optional)") + button.nc-multiselect__trigger#<feld>-trigger[aria-expanded][aria-controls][aria-labelledby="<label> <trigger>"][data-placeholder] > __value + __caret, dann div.nc-multiselect__panel#<feld>-panel[role=group][aria-labelledby=<label>][hidden] mit den Optionen. Ohne aria-haspopup (Disclosure, kein Menue; neo_fe seit Abschluss 2, Arena seit 1.5.2).
- Das Label ist ein <span> (kein <label>: es beschriftet einen Knopf und eine Gruppe, kein einzelnes Eingabefeld); der Name des Knopfs ist Label + aktuelle Zusammenfassung.
- Optionen: label.nc-checkbox.nc-multiselect__option > input.nc-checkbox__input[type=checkbox][name=<feld>[]][value] + span.nc-checkbox__control + span.nc-checkbox__label — native Mehrfach-Uebertragung im Formular.
- Zustaende: .is-open am Feld (dreht den Pfeil; setzt das Behavior mit aria-expanded); Panel geschlossen [hidden] — .nc-multiselect__panel[hidden] blendet aus, das Behavior setzt zur Absicherung display: none inline. Beim Oeffnen setzt das Behavior die Lage zusaetzlich inline (Unterkante des Knopfs + 4 px), wie frueher neo-theme.js.
- Ohne Auswahl: __value--empty mit dem Platzhalter (data-placeholder am Knopf, auf der Website per Drupal.t uebersetzt; sonst der Anfangstext, sonst „Bitte wählen…").
- Fehler (Pflichtfeld, neoForm validateMs beim Verlassen ueber den Knopf): .nc-form-field--invalid am Feld faerbt den Rahmen des Knopfs text-danger (06-molecules/_form-field.scss), aria-invalid am Knopf, p.nc-form-error[role=alert] (id <trigger>-err) unter dem Feld per aria-describedby.
- Verhalten: Behavior multiselect (neo-behaviors) — Oeffnen/Schliessen, Fokus auf die erste Checkbox, Pfeiltasten/Pos1/Ende, Escape, Klick ausserhalb, Fokus verlaesst das Feld, Zusammenfassung im Knopf, Ereignis multiselect-change. Die Pflichtfeld-Pruefung bleibt beim Formular.
- Einschraenkung: „<n> ausgewählt" (ab drei Optionen) und der Rueckfall-Platzhalter „Bitte wählen…" stehen fest deutsch im Behavior — auf einer englischen Seite erscheint die Zusammenfassung deutsch. Bewusst nicht umgebaut (Abschluss Plan v3).

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
| `--nc-multiselect-trigger-border` | — | `--mod-multiselect-trigger-border` |
| `--nc-multiselect-trigger-border-disabled` | — | `--mod-multiselect-trigger-border-disabled` |
| `--nc-multiselect-trigger-border-error` | — | `--mod-multiselect-trigger-border-error` |
| `--nc-multiselect-trigger-border-focus` | — | `--mod-multiselect-trigger-border-focus` |
| `--nc-multiselect-trigger-border-hover` | — | `--mod-multiselect-trigger-border-hover` |
| `--nc-multiselect-trigger-border-width` | — | `--mod-multiselect-trigger-border-width` |
| `--nc-multiselect-trigger-font-size` | — | `--mod-multiselect-trigger-font-size` |
| `--nc-multiselect-trigger-gap` | — | `--mod-multiselect-trigger-gap` |
| `--nc-multiselect-trigger-padding` | — | `--mod-multiselect-trigger-padding` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | open | Auf dem geschlossenen Knopf: oeffnet das Panel, Fokus auf die erste Checkbox (wie die Website). Offen: nativer Klick, schliesst. |
| `Space` | open-or-toggle-option | Auf dem geschlossenen Knopf: wie Enter. Auf einer Checkbox: waehlt bzw. waehlt ab (nativ), Zusammenfassung und multiselect-change folgen. |
| `ArrowDown` | open-or-next | Auf dem geschlossenen Knopf: oeffnet, Fokus auf die erste Checkbox. In der Liste: naechste Checkbox (rundum). |
| `ArrowUp` | previous | In der Liste: vorherige Checkbox (rundum). |
| `Home` | first | In der Liste: erste Checkbox. |
| `End` | last | In der Liste: letzte Checkbox. |
| `Escape` | close | Offenes Panel: schliesst; aus der Liste Fokus zurueck auf den Knopf, auf dem Knopf bleibt er dort. |
| `Tab` | close-on-leave | Normaler Tab-Fluss durch Knopf und Checkboxen; verlaesst der Fokus das Feld, schliesst das Panel. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `multiselect-change` | Yes | `{"values":"string[]"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- 4.1.2: Disclosure-Muster — Knopf mit aria-expanded und aria-controls aufs Panel, ohne aria-haspopup (kein Menue); Panel role=group mit Namen (aria-labelledby aufs Label); native Checkboxen.
- 4.1.2: Name des Knopfs = Label + Zusammenfassung (aria-labelledby auf beide); aendert sich die Auswahl, liest der Knopf den neuen Stand.
- 2.1.1/2.4.3: Enter, Leertaste und Pfeil runter oeffnen mit Fokus auf die erste Checkbox; Pfeiltasten/Pos1/Ende in der Liste; Escape schliesst und gibt den Fokus an den Knopf zurueck; Tab aus dem Feld schliesst.
- 3.3.1: Fehler mit .nc-form-field--invalid (Rahmen text-danger plus Schatten), aria-invalid und Meldung role=alert per aria-describedby — nicht nur Farbe.
- 3.1.2: Die Zusammenfassung „<n> ausgewählt" ist fest deutsch (Einschraenkung, siehe domNotes).
- 1.4.3: Kontrast AA hell und dunkel gemessen — Wert text-primary 16,01:1, Platzhalter text-tertiary ab 5,75:1, Pfeil ab 6,07:1, Meldung ab 6,79:1.

## Web Components Mapping
Derived from anatomy for potential `<nc-multiselect>` custom element:

```js
class NcMultiselect extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="trigger">, <slot name="value">, <slot name="caret">, <slot name="panel">, <slot name="option">
}
```

---

*Generated from `data/multiselect-recipe.json` by `scripts/generate-component-specs.js`*
