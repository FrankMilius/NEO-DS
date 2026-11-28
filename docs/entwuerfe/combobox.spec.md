# combobox Component Spec
> Version 0.1.0 | Status: draft | Layer: unknown

Tags: `entwurf`, `molecules`, `formular`

## Anatomy
Root element: `.nc-combobox`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| label | `.nc-form-label` | Yes | Sichtbares Label (label for=<feld>-input) mit „ *“ (aria-hidden) bzw. „(optional)“. Pflicht: das Eingabefeld bezieht seinen Namen daraus. |
| field | `.nc-combobox__field` | Yes | Rahmen des Felds wie .nc-input (Höhe 2,5rem bei einzeiliger Belegung, Radius, Rahmen, Hover/Fokus/Fehler/deaktiviert über --nc-combobox-field-* → --nc-input-*). Trägt bei multiple die Chips und das Eingabefeld in einer Zeile, bricht bei Bedarf um (min. 2,5rem, wächst). |
| chips | `.nc-combobox__chips` | No | Nur multiple: Liste der gewählten Werte (ul, aria-label „Gewählt“) aus nc-chip --sm mit __remove-Knopf; steht im Feld vor dem Eingabefeld. |
| input | `.nc-combobox__input` | Yes | input type=text role=combobox mit aria-expanded, aria-controls aufs Listenfeld, aria-autocomplete=list, aria-activedescendant auf die markierte Option; ohne eigenen Rahmen (der Rahmen gehört zu __field). Text 8 px unter der Oberkante des Felds (1 px Rahmen + 7 px Innenabstand). |
| indicator | `.nc-combobox__indicator` | Yes | Pfeil als Knopf (button type=button tabindex=-1, aria-label „Liste öffnen“), dasselbe SVG und dieselbe Lage wie .nc-select (Chevron, --nc-select-indicator-size, rechts --nc-input-padding-x-md, senkrecht mittig, --nc-select-indicator-color); offen nach oben gedreht. Bei der Variante search statt Pfeil die Lupe links im Feld wie .nc-search. |
| listbox | `.nc-combobox__listbox` | Yes | ul role=listbox (aria-multiselectable=true bei multiple), absolut unter dem Feld (100 % + spacing-01), höchstens 16rem hoch, scrollt; Fläche, Rahmen und Schatten wie .nc-multiselect__panel; geschlossen [hidden]. |
| group | `.nc-combobox__group` | No | li role=presentation > span.nc-combobox__group-label (Mono, Versalien, text-secondary) + ul role=group aria-labelledby: Gruppen des Vokabulars (z. B. Anlass, Ort, Thema). |
| option | `.nc-combobox__option` | Yes | li role=option mit id, aria-selected und data-value; min. 2,5rem hoch, Innenabstand wie .nc-multiselect__option. Markiert (aktive Option der Tastatur) mit .is-active: Fläche background-secondary. Gewählt: Häkchen-Symbol links (bei multiple Checkbox-Optik wie nc-checkbox, rein visuell). |
| match | `.nc-combobox__match` | No | Hervorhebung des getippten Teils im Optionstext (mark, Schriftgewicht 650, keine Farbe). |
| synonym | `.nc-combobox__synonym` | No | Zusatz hinter der Option, wenn ein Synonym getroffen hat: „auch „basketball““ (text-secondary, kleiner). |
| create | `.nc-combobox__create` | No | Letzte Option (role=option, data-create), nur bei creatable=suggest|create und wenn kein Begriff und kein Synonym exakt passt: Plus-Symbol, „„<Eingabe>“ als neues Schlagwort vorschlagen“ bzw. „… anlegen“, darunter eine Zeile Erklärung (text-secondary); Trennlinie oben. |
| status | `.nc-combobox__status` | Yes | Unsichtbare Live-Region (role=status, u-sr-only): Anzahl der Treffer, „Kein Treffer“, Laden, Auswahl/Entfernen, Vorschlag notiert. |
| native | `.nc-combobox__native` | Yes | Ausgangs-Markup ohne JavaScript: select (multiple bei multiple) mit allen Optionen und optgroup je Gruppe; das Behavior blendet es aus (hidden) und hält es synchron — es trägt name und wird übertragen. |

### DOM Notes
- Ausgangs-Markup (progressive Verbesserung, ohne JavaScript bedienbar): div.nc-form-field.nc-combobox[data-combobox][data-variant=single|multiple|search][data-creatable=none|suggest|create][data-max] > label.nc-form-label[for=<feld>-native] + select.nc-select.nc-combobox__native#<feld>-native[name][multiple?] mit optgroup/option + p.nc-form-hint. Das Behavior combobox (neo-behaviors) baut daraus __field (mit __chips, __input, __indicator), __listbox und __status, setzt label[for] auf das Eingabefeld um und blendet das Select aus.
- ARIA nach WAI-ARIA APG „Combobox with listbox popup“ (editierbar, Autovervollständigung list): input role=combobox[aria-expanded][aria-controls=<feld>-listbox][aria-autocomplete=list][aria-activedescendant]; Fokus bleibt immer im Eingabefeld, die Option wird über aria-activedescendant markiert. Kein aria-haspopup (der Standardwert von combobox ist listbox).
- Mehrfach (data-variant=multiple): Listbox mit aria-multiselectable=true, Optionen aria-selected; die Auswahl bleibt nach Enter offen (Panel bleibt), gewählte Werte erscheinen als Chips im Feld. Chips sind eigene Tab-Stopps über ihren __remove-Knopf (aria-label „<Wert> entfernen“).
- Einzeln (data-variant=single): Auswahl schreibt den Text ins Eingabefeld und schließt die Liste; Leeren über Löschen-Knopf (input-Muster __clear) oder Text löschen + Verlassen.
- Suche (data-variant=search): wie single, Lupe links statt Pfeil rechts, Liste öffnet erst ab der ersten Eingabe; für Personen und Orte mit vielen Einträgen.
- Filtern: Teiltreffer in Begriff und Synonymen, unabhängig von Groß-/Kleinschreibung, Umlauten (ä=ae …), Bindestrichen und Leerzeichen. Reihenfolge: Treffer am Wortanfang vor Treffern im Wort, dann Synonym-Treffer, je Gruppe in der Reihenfolge des Vokabulars.
- Neu vorschlagen (data-creatable=suggest): die Option __create erscheint nur, wenn kein Begriff und kein Synonym exakt passt; Auswahl feuert combobox-create und legt einen Chip mit Kennzeichen „Vorschlag“ (nc-chip --outline, gestrichelt) an; der Wert geht als data-pending in ein verstecktes Feld <name>_pending[] und wird erst nach Prüfung durch die Redaktion ein Begriff. data-creatable=create (nur Redaktion): legt sofort an.
- Asynchron (data-source=<url>): ab data-min-chars (Standard 2) Zeichen, Abfrage nach 200 ms Pause, laufende Abfrage wird abgebrochen; währenddessen aria-busy=true an der Listbox, nc-spinner sm in der Liste, Status „Lade …“. Antwort JSON [{value,label,group?,synonym?}].
- Höchstzahl (data-max): ist sie erreicht, sind nicht gewählte Optionen aria-disabled, __create ebenfalls; Hinweis im Feld-Hinweis und in der Live-Region.
- Fehler: .nc-form-field--invalid am Feld färbt den Rahmen von __field text-danger, aria-invalid am Eingabefeld, p.nc-form-error (id <feld>-err) per aria-describedby — wie multiselect.
- Sprache: Texte („Liste öffnen“, „Gewählt“, „Kein Treffer“, „<n> Treffer“, „als neues Schlagwort vorschlagen“, „Vorschlag“, „entfernen“) folgen lang am Feld bzw. Vorfahren (de/en); überschreibbar per data-text-* am Feld, in neo_fe aus Drupal.t.

## Variants
### Variante (`variant`)
Einzel-, Mehrfachauswahl oder Suche

| Value | CSS Modifier | Default |
| --- | --- | --- |
| single | — |  |
| multiple | `.nc-combobox--multiple` |  |
| search | `.nc-combobox--search` |  |

### Neue Werte (`creatable`)
Ob und wie fehlende Werte entstehen

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| suggest | — |  |
| create | — |  |

## States
Supported: `default`, `hover`, `focus`, `open`, `loading`, `empty`, `max`, `error`, `disabled`, `readonly`

## CSS Token API
Base classes: `nc-combobox`

### Feld
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-combobox-field-height` | — | — |
| `--nc-combobox-field-radius` | — | — |
| `--nc-combobox-field-border` | — | — |
| `--nc-combobox-field-border-width` | — | — |
| `--nc-combobox-field-border-hover` | — | — |
| `--nc-combobox-field-border-focus` | — | — |
| `--nc-combobox-field-border-error` | — | — |
| `--nc-combobox-field-bg` | — | — |
| `--nc-combobox-field-padding-x` | — | — |
| `--nc-combobox-field-padding-top` | — | — |
| `--nc-combobox-field-padding-bottom` | — | — |
| `--nc-combobox-indicator-size` | — | — |
| `--nc-combobox-indicator-color` | — | — |

### Liste
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-combobox-listbox-max-height` | — | — |
| `--nc-combobox-listbox-offset` | — | — |
| `--nc-combobox-listbox-shadow` | — | — |
| `--nc-combobox-listbox-padding` | — | — |
| `--nc-combobox-option-min-height` | — | — |
| `--nc-combobox-option-padding` | — | — |
| `--nc-combobox-option-bg-active` | — | — |
| `--nc-combobox-group-label-color` | — | — |
| `--nc-combobox-synonym-color` | — | — |

### Chips (multiple)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-combobox-chips-gap` | — | — |
| `--nc-combobox-pending-border-style` | — | — |

### Neuer Wert
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-combobox-create-border-color` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `ArrowDown` | open-or-next | Geschlossen: öffnet die Liste und markiert die erste Option (bzw. die gewählte bei single). Offen: nächste Option, am Ende keine Umrundung. |
| `ArrowUp` | previous | Offen: vorherige Option; auf der ersten Option zurück ins reine Eingabefeld (keine Markierung). |
| `Alt+ArrowDown` | open | Öffnet ohne die Markierung zu verschieben. |
| `Alt+ArrowUp` | close | Schließt; bei single wird die markierte Option übernommen. |
| `Enter` | select-or-create | Offen mit markierter Option: wählt (single: schließt; multiple: wählt bzw. wählt ab, bleibt offen, Eingabe wird geleert). Markiert ist die Vorschlags-Option: legt den Vorschlag an. Ohne Markierung und mit genau einem Treffer: wählt diesen. Nie Formular absenden, solange die Liste offen ist. |
| `Escape` | close-or-clear | Offen: schließt, Eingabe bleibt. Geschlossen: leert die Eingabe (Auswahl bleibt). |
| `Home` | caret-start | Cursor an den Anfang der Eingabe (APG: Home/End bleiben im Textfeld). |
| `End` | caret-end | Cursor ans Ende der Eingabe. |
| `PageDown` | next-page | Offen: zehn Optionen weiter. |
| `PageUp` | previous-page | Offen: zehn Optionen zurück. |
| `Backspace` | remove-last | Nur multiple, bei leerer Eingabe: markiert den letzten Chip; zweites Backspace entfernt ihn (Status meldet es). |
| `Tab` | leave | Verlässt das Feld und schließt die Liste, ohne die Auswahl zu ändern (APG: keine Übernahme bei Tab). Chips sind über ihren Entfernen-Knopf erreichbar. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `combobox-change` | Yes | `{"values":"string[]"}` |
| `combobox-create` | Yes | `{"label":"string","mode":"suggest|create"}` |
| `combobox-query` | Yes | `{"query":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- 4.1.2: Combobox-Muster der WAI-ARIA APG (Listbox-Popup, aria-autocomplete=list): role=combobox am Eingabefeld mit aria-expanded, aria-controls, aria-activedescendant; Listbox role=listbox (aria-multiselectable bei multiple), Optionen role=option mit aria-selected; Gruppen role=group mit Namen.
- 4.1.2: Name des Eingabefelds aus dem sichtbaren Label (label for); der Pfeil-Knopf ist tabindex=-1 und aria-label „Liste öffnen“, damit er den Tab-Fluss nicht verdoppelt.
- 2.1.1/2.4.3: Bedienung ganz mit der Tastatur (siehe keyboard); Fokus bleibt im Eingabefeld, Escape schließt und leert ggf. die Eingabe, Tab verlässt das Feld ohne Auswahl zu ändern.
- 4.1.3: Statusmeldungen über role=status ohne Fokuswechsel: Trefferzahl, Kein Treffer, Laden, gewählt/entfernt, Vorschlag notiert, Höchstzahl erreicht.
- 1.3.1: Gruppen und Vorschläge sind im Markup erkennbar (role=group mit Label, Option „Vorschlag“ als Text, nicht nur Symbol); Synonym-Hinweis als Text.
- 1.4.1: Gewählt und markiert nicht nur über Farbe: gewählt mit Häkchen bzw. Checkbox-Optik, markiert mit Fläche plus Rahmen in forced-colors.
- 2.5.8: Zielgröße min. 24×24 px für Pfeil und Chip-Entfernen (Fläche 2,5rem bzw. 1,5rem mit Abstand).
- 3.3.1: Fehler mit .nc-form-field--invalid, aria-invalid und Meldung per aria-describedby — nicht nur Farbe.
- Ohne JavaScript: das native select bleibt bedienbar und überträgt die Werte (progressive Verbesserung).

## Web Components Mapping
Derived from anatomy for potential `<nc-combobox>` custom element:

```js
class NcCombobox extends HTMLElement {
  static observedAttributes = ['variant', 'creatable'];
  // Slots: <slot name="label">, <slot name="field">, <slot name="input">, <slot name="indicator">, <slot name="listbox">, <slot name="option">, <slot name="status">, <slot name="native">
}
```

---

*Generated from `data/combobox-recipe.json` by `scripts/generate-component-specs.js`*
