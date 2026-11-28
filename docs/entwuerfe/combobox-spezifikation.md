# Combobox – Spezifikation (Entwurf)

- **Status:** Entwurf 0.1.0, Freigabe ausstehend
- **Datum:** 28.11.2026
- **Entscheider:** Frank Milius
- **Ebene:** Molekül (`scss/scss/06-molecules/_combobox.scss`)
- **Verhalten:** `packages/neo-behaviors/combobox.js` (ADR-005)
- **Maschinenlesbar:** [`combobox-recipe.json`](combobox-recipe.json) (Schema 3.1.0, Status `draft`),
  daraus erzeugt: [`combobox.spec.md`](combobox.spec.md) und [`combobox.spec.json`](combobox.spec.json)

Der Entwurf liegt unter `docs/entwuerfe/` und nicht in `data/`: Token-Coverage,
SCSS-Parität und der Abgleich `generate-component-specs --pruefen` greifen erst,
wenn das SCSS steht. Beim Bau wandert das Recipe nach `data/combobox-recipe.json`,
der Generator erzeugt `specs/combobox.spec.*` neu.

---

## 1 · Wozu

Ein Eingabefeld mit Vorschlagsliste: Man tippt, die Liste zeigt passende Werte,
man wählt einen oder mehrere. Bei mehreren erscheinen die gewählten Werte als
Chips im Feld.

**Anlass:** Die Prüfung im Prototyp v15-fotowand (28.11.2026) hat gezeigt, dass
das Design System dafür nichts hat. Die Fotowand behalf sich zuerst mit der
Vorschlagsliste des Browsers (`datalist`, eigener Pfeil ohne Innenabstand),
dann mit `nc-multiselect` plus eigenem Suchfeld im Panel. Das trägt bis etwa
30 Begriffe, darüber nicht. Mit der Entscheidung für **Option D der
Schlagwort-Steuerung** (Vokabular der Redaktion, neue Begriffe nur als Vorschlag)
braucht das System ein Feld, das große, gepflegte Listen durchsuchbar macht und
den Vorschlag als festen Teil der Bedienung kennt.

## 2 · Abgrenzung: welches Feld wann

| Lage | Feld |
|---|---|
| bis 7 Optionen, eine | `radio-group` |
| bis 7 Optionen, mehrere | `checkbox-group` |
| bis ca. 30 Optionen, eine | `select` |
| bis ca. 30 Optionen, mehrere, ohne Suche | `multiselect` |
| **über ca. 30 Optionen, gepflegtes Vokabular, Suche in einer Quelle** | **`combobox`** |
| freie Suche über Inhalte (kein Wert fürs Formular) | `search` |

Faustregel: Muss man scrollen, um seine Option zu finden, ist es eine Combobox.

## 3 · Varianten

Zwei Achsen, frei kombinierbar.

**`variant`**

| Wert | Bedeutung | Beispiel |
|---|---|---|
| `single` | ein Wert, steht nach der Auswahl als Text im Feld | Abteilung, Album, Standort |
| `multiple` | mehrere Werte als Chips im Feld, Liste bleibt beim Wählen offen | Schlagworte, Themen, Empfänger |
| `search` | wie `single`, Lupe links statt Pfeil rechts, Liste erst ab Eingabe | Person suchen (asynchron) |

**`creatable`**

| Wert | Bedeutung | Wer |
|---|---|---|
| `none` | nur vorhandene Werte | Standard |
| `suggest` | fehlt ein Wert: „„X“ als neues Schlagwort vorschlagen“ → Chip „Vorschlag“, geht an die Redaktion, bis zur Prüfung nicht öffentlich (**Option D**) | Beschäftigte |
| `create` | fehlt ein Wert: „„X“ anlegen“ → sofort im Vokabular | nur Redaktion |

## 4 · Anatomie und Markup

### Ausgangs-Markup (ohne JavaScript bedienbar)

```html
<div class="nc-form-field nc-combobox nc-combobox--multiple"
     data-combobox data-variant="multiple" data-creatable="suggest" data-max="5">
  <label class="nc-form-label" for="tags-native">
    <span class="nc-form-label__text">Schlagworte</span>
    <span class="nc-form-label__optional"> (optional)</span>
  </label>
  <select class="nc-select nc-combobox__native" id="tags-native" name="tags[]" multiple>
    <optgroup label="Anlass">
      <option value="kundentag">Kundentag</option>
      <option value="sommerfest" data-synonyms="sommerparty, betriebsfest">Sommerfest</option>
    </optgroup>
    <optgroup label="Thema">
      <option value="sport" data-synonyms="basketball, fußball">Sport</option>
    </optgroup>
  </select>
  <p class="nc-form-hint" id="tags-hint">Bis zu 5. Fehlt ein Begriff, schlägst du ihn in der Liste vor.</p>
</div>
```

Das native `select` ist die Quelle: Drupal rendert es (Widget für Entity-Referenzen),
ohne JavaScript funktioniert das Formular, und es trägt `name`.

### Nach dem Aufrüsten durch das Behavior

```html
<div class="nc-form-field nc-combobox nc-combobox--multiple is-open" data-combobox …>
  <label class="nc-form-label" for="tags-input">…</label>
  <div class="nc-combobox__field">
    <ul class="nc-combobox__chips" aria-label="Gewählt">
      <li class="nc-chip nc-chip--sm"><span class="nc-chip__label">Kundentag</span>
        <button type="button" class="nc-chip__remove" aria-label="Kundentag entfernen">…</button></li>
      <li class="nc-chip nc-chip--sm nc-chip--outline nc-combobox__pending">
        <span class="nc-chip__label">Weihnachtsmarkt</span><span class="nc-combobox__pending-tag">Vorschlag</span>
        <button type="button" class="nc-chip__remove" aria-label="Vorschlag Weihnachtsmarkt zurückziehen">…</button></li>
    </ul>
    <input class="nc-combobox__input" id="tags-input" type="text" role="combobox"
           aria-expanded="true" aria-controls="tags-listbox" aria-autocomplete="list"
           aria-activedescendant="tags-opt-sport" aria-describedby="tags-hint" autocomplete="off">
    <button type="button" class="nc-combobox__indicator" tabindex="-1" aria-label="Liste öffnen">…Chevron…</button>
  </div>
  <ul class="nc-combobox__listbox" id="tags-listbox" role="listbox" aria-multiselectable="true" aria-label="Schlagworte">
    <li class="nc-combobox__group" role="presentation">
      <span class="nc-combobox__group-label" id="tags-g-thema">Thema</span>
      <ul role="group" aria-labelledby="tags-g-thema">
        <li class="nc-combobox__option is-active" id="tags-opt-sport" role="option" aria-selected="false" data-value="sport">
          Sport<span class="nc-combobox__synonym">auch „basketball“</span></li>
      </ul>
    </li>
    <li class="nc-combobox__create" id="tags-opt-new" role="option" aria-selected="false" data-create>
      <b>„Weihnachtsmarkt“ als neues Schlagwort vorschlagen</b>
      <small>Die Redaktion prüft den Begriff. Bis dahin ist er nicht öffentlich.</small></li>
  </ul>
  <p class="nc-combobox__status u-sr-only" role="status"></p>
  <select class="nc-select nc-combobox__native" … hidden>…</select>
  <input type="hidden" name="tags_pending[]" value="Weihnachtsmarkt">
  <p class="nc-form-hint" id="tags-hint">…</p>
</div>
```

Teile im Einzelnen: siehe [`combobox.spec.md`](combobox.spec.md), Abschnitt Anatomy.

## 5 · Maße – gleich mit select und input

Diese Regeln stammen aus Franks Durchsicht der Fotowand (28.11.2026) und gelten
für jedes Feld in derselben Maske. Sie sind Abnahmekriterien.

| Maß | Wert | Token |
|---|---|---|
| Höhe einzeilig | 40 px | `--nc-combobox-field-height` → `--nc-input-height-md` (`--fnd-size-md`) |
| Text unter der Oberkante | **8 px** (1 px Rahmen + 7 px Innenabstand) | `--nc-combobox-field-padding-top` = 7px, `-bottom` = 9px |
| Innenabstand seitlich | 16 px | `--nc-combobox-field-padding-x` → `--nc-input-padding-x-md` |
| Pfeil | Chevron des select, 20 px, rechts 16 px, senkrecht mittig | `--nc-combobox-indicator-size` → `--nc-select-indicator-size` |
| Farbe Pfeil | `text-secondary` | `--nc-combobox-indicator-color` → `--nc-select-indicator-color` |
| Radius, Rahmen, Fläche | wie input | `--nc-combobox-field-*` → `--nc-input-*` |
| Liste: Abstand zum Feld | 4 px | `--nc-combobox-listbox-offset` → `--fnd-spacing-01` |
| Liste: Höhe | höchstens 16 rem, scrollt | `--nc-combobox-listbox-max-height` |
| Liste: Fläche, Schatten, Innenabstand | wie multiselect-Panel | `--nc-combobox-listbox-*` → `--nc-multiselect-panel-*` |
| Option | min. 40 px, Innenabstand 8 px | `--nc-combobox-option-*` → `--nc-multiselect-option-padding` |
| Option markiert | Fläche `background-secondary` | `--nc-combobox-option-bg-active` |
| Chips im Feld | `nc-chip --sm`, Abstand 4 px; das Feld wächst zeilenweise | `--nc-combobox-chips-gap` |
| Gruppen-Überschrift | Mono, Versalien, `text-secondary` | `--nc-combobox-group-label-color` |

**Felder einer Zeile sind oben bündig.** Hinweise unter einem Feld dürfen das
Nachbarfeld nicht verschieben (Ursache in der Fotowand: Grid mit
`align-content: stretch`).

### Begleitänderungen im Design System (gehören in denselben Bau)

1. **Ein Pfeil.** `select` malt den Pfeil als Hintergrund-SVG mit festem
   `#6b7280`; `--nc-select-indicator-color` (= `text-secondary`) wirkt dadurch
   nicht, im Dunkel-Theme stimmt die Farbe nicht. `multiselect` nutzt das Zeichen
   „▾“. Vorschlag: Pfeil als `mask-image` mit `background-color:
   var(--nc-select-indicator-color)` in select, multiselect und combobox –
   ein SVG, ein Token, beide Themes.
2. **Gleiche Höhe und Fläche.** `multiselect` ist 2,75 rem hoch und hat die
   Fläche `background-base`, `select` 2,5 rem und `surface-elevated`. Angleichen
   an select.
3. **Textlage 8 px.** Heute steht der Text in input/select bei 1 + 8 = 9 px.
   Für das 8-px-Raster `--nc-input-padding-y-md` als Paar oben 7 px / unten
   9 px führen (Höhe bleibt 40 px) – für input, select, multiselect, combobox.
4. **Komponentenliste.** `multiselect` fehlt in `skill/references/components.md`;
   combobox dort aufnehmen.

## 6 · Zustände

| Zustand | Erkennbar an |
|---|---|
| default | Rahmen `--nc-input-border` |
| hover | Rahmen `--nc-input-border-hover` |
| focus | Fokusring am Feld (`:focus-within`), 2 px `interactive-focus`, Abstand 2 px |
| open | Liste sichtbar, Pfeil nach oben, `aria-expanded=true` |
| loading | `aria-busy` an der Liste, `nc-spinner --sm` in der Liste, Status „Lade …“ |
| empty | „Kein passendes Schlagwort.“, bei `suggest` direkt darunter die Vorschlags-Option |
| max | nicht gewählte Optionen `aria-disabled`, Hinweis „Höchstens 5 Schlagworte.“ |
| error | `.nc-form-field--invalid`, Rahmen `text-danger`, `aria-invalid`, `p.nc-form-error` |
| disabled | wie input disabled; Chips ohne Entfernen-Knopf |
| readonly | wie input readonly; Chips ohne Entfernen-Knopf, Liste öffnet nicht |

## 7 · Verhalten

**Filtern.** Teiltreffer in Begriff und Synonymen, unabhängig von
Groß-/Kleinschreibung, Umlauten (ä = ae …), Bindestrichen und Leerzeichen.
Reihenfolge: Treffer am Wortanfang, dann im Wort, dann über ein Synonym. Der
getippte Teil ist im Optionstext hervorgehoben (`mark`, Gewicht 650, keine
Farbe). Bei einem Synonym-Treffer steht dahinter „auch „basketball““.

**Vorschlagen (`suggest`, Option D).** Die letzte Option heißt
„„<Eingabe>“ als neues Schlagwort vorschlagen“ und erscheint nur, wenn kein
Begriff und kein Synonym **exakt** passt. Ähnliche Begriffe stehen darüber –
so wird „Meintest du …?“ zur normalen Liste, ohne eigenen Dialog. Auswahl:
Chip mit Kennzeichen „Vorschlag“ (gestrichelt), verstecktes Feld
`<name>_pending[]`, Ereignis `combobox-create`. Der Vorschlag zählt zur
Höchstzahl.

**Asynchron.** `data-source="<url>"`: ab `data-min-chars` (Standard 2) Zeichen,
Abfrage nach 200 ms Pause, laufende Abfrage wird abgebrochen. Antwort
`[{ value, label, group?, synonym? }]`.

**Mehrfach.** Enter wählt bzw. wählt ab, die Liste bleibt offen, die Eingabe
wird geleert. Backspace in leerer Eingabe markiert den letzten Chip, ein
zweites entfernt ihn.

**Schließen.** Escape, Klick außerhalb, Tab aus dem Feld. Tab ändert die Auswahl
nie (WAI-ARIA APG). Die Liste schließt **nicht** schon, wenn der Fokus beim
Mausklick kurz das Eingabefeld verlässt – Fehlerbild aus der Fotowand: Die Liste
schloss vor dem Klick, Optionen ließen sich mit der Maus nicht wählen.

**Lage.** Die Liste öffnet unter dem Feld; reicht der Platz im Fenster bzw. im
scrollenden Dialog nicht, scrollt das Behavior die Liste beim Öffnen in den
sichtbaren Bereich (in Dialogen) bzw. öffnet nach oben (freie Seite).

**Sprache.** Texte nach `lang` (de/en), überschreibbar per `data-text-*`, in
neo_fe aus `Drupal.t` – wie multiselect.

## 8 · Tastatur

Nach WAI-ARIA APG „Combobox with Listbox Popup“. Der Fokus bleibt im
Eingabefeld, die markierte Option kommt über `aria-activedescendant`.

| Taste | Wirkung |
|---|---|
| ↓ | geschlossen: öffnen, erste (bzw. gewählte) Option markieren; offen: nächste |
| ↑ | vorherige; auf der ersten zurück ins Textfeld |
| Alt + ↓ / Alt + ↑ | öffnen ohne Markierung / schließen |
| Enter | markierte Option wählen bzw. Vorschlag anlegen; ohne Markierung bei genau einem Treffer diesen wählen; sendet bei offener Liste nie das Formular ab |
| Escape | offen: schließen; geschlossen: Eingabe leeren |
| Pos1 / Ende | Cursor im Textfeld |
| Bild ↓ / Bild ↑ | zehn Optionen weiter / zurück |
| Backspace (leer, multiple) | letzten Chip markieren, zweites Mal entfernen |
| Tab | Feld verlassen, Auswahl unverändert |

## 9 · Barrierefreiheit (Abnahme)

- **4.1.2** Combobox-Muster vollständig: `role=combobox`, `aria-expanded`,
  `aria-controls`, `aria-autocomplete=list`, `aria-activedescendant`; Listbox
  `role=listbox` (`aria-multiselectable` bei multiple), Optionen `role=option`
  mit `aria-selected`, Gruppen `role=group` mit Namen.
- **4.1.3** Statusmeldungen ohne Fokuswechsel: Trefferzahl, kein Treffer, Laden,
  gewählt/entfernt, Vorschlag notiert, Höchstzahl erreicht.
- **2.1.1 / 2.4.3** alles per Tastatur (Abschnitt 8); Chips über ihren
  Entfernen-Knopf erreichbar; Pfeil-Knopf `tabindex=-1`.
- **1.4.1** gewählt mit Häkchen bzw. Checkbox-Optik, markiert mit Fläche plus
  Rahmen in `forced-colors` – nie nur Farbe.
- **1.4.3** Kontrast AA hell und dunkel: Text, Platzhalter, Pfeil,
  Gruppen-Überschrift, Synonym-Hinweis gegen die tatsächliche Fläche messen.
- **2.5.8** Zielgröße mindestens 24 × 24 px (Pfeil, Chip-Entfernen).
- **3.3.1** Fehler mit Rahmen, `aria-invalid` und Meldung – nicht nur Farbe.
- **Ohne JavaScript** bleibt das native `select` bedienbar.
- `prefers-reduced-motion`: keine Bewegung beim Öffnen; `forced-colors`:
  Rahmen um Liste, Optionen und Chips.

## 10 · Ereignisse

| Ereignis | detail | wann |
|---|---|---|
| `combobox-change` | `{ values: string[] }` | jede Änderung der Auswahl; natives select ist schon synchron |
| `combobox-create` | `{ label, mode: "suggest" \| "create" }` | Auswahl der Vorschlags-/Anlegen-Option |
| `combobox-query` | `{ query }` | ohne `data-source`: nach 200 ms Tipp-Pause |

## 11 · Drupal (neo_fe)

- **Widget:** Entity-Referenz auf Taxonomie, Widget „Auswahlliste“ (rendert das
  native `select`), `neo_fe` setzt `data-combobox` und die Varianten; „Referenzierte
  Begriffe automatisch anlegen“ aus.
- **Synonyme:** Feld am Begriff (Modul Synonyms) → `data-synonyms` an der Option.
- **Vorschläge:** `<feld>_pending[]` → eigene Entität „Begriffsvorschlag“
  (Begriff, Person, Inhalt, Status) mit Warteschlange der Redaktion;
  Benachrichtigung über `nwp_notify`.
- **`create`** nur mit der Berechtigung „Begriffe in <Vokabular> anlegen“.
- **Asynchron:** JSON-Route je Vokabular bzw. für Personen (Search API).

## 12 · Abnahme und Tests

- `npm run lint:recipes`, `lint:recipe-form`, `lint:komposition`, `generate-component-specs --pruefen` grün, nachdem das Recipe in `data/` liegt.
- Unit-Tests für `combobox.js` (wie `website-behaviors.test.js`): Filtern mit
  Umlaut/Synonym, Enter bei einem Treffer, Vorschlag nur ohne exakten Treffer,
  Höchstzahl, Backspace, Tab ohne Übernahme, Sprache de/en.
- **Echte Klicks** in Playwright (nicht `element.click()`): Option mit der Maus
  wählen, während der Fokus im Eingabefeld steht.
- axe ohne Befund in Arena und Storybook; Screenreader-Probe VoiceOver und NVDA.
- Messung neben select und input (Arena-Zustand „Zustände“): gleiche Höhe,
  Text 8 px unter der Oberkante, Pfeil gleiche Lage – per
  `node scripts/messen.js`.

## 13 · Offene Entscheidungen

| Nr. | Frage | Vorschlag |
|---|---|---|
| C1 | Begleitänderung 3 (Text 8 px) gleich für input und select mitziehen? Ändert jede Maske auf der Website um 1 px. | ja, im selben Bau, Pixelvergleich vorher/nachher |
| C2 | Pfeil per `mask-image` (Begleitänderung 1) – auch im nativen select? | ja |
| C3 | Ab wie vielen Optionen ersetzt combobox das multiselect in neo_fe automatisch? | ab 30, per Widget-Einstellung übersteuerbar |
| C4 | Variante `create` überhaupt anbieten oder Anlegen nur in der Begriffspflege? | nur Pflege; `create` erst bei Bedarf |
| C5 | Einzelauswahl: Text im Feld oder Chip? | Text im Feld (wie select) |

## 14 · Nächster Schritt

Nach Freigabe: Umsetzungsplan mit `/plan` (Phasen: Begleitänderungen 1–3 mit
Pixelvergleich → SCSS und Tokens → Behavior mit Tests → Recipe nach `data/`,
Specs erzeugen → Storybook und Arena → neo_fe-Widget → Fotowand im Prototyp
umstellen).
