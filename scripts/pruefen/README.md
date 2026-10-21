# Prüfwerkzeuge (`scripts/pruefen/`)

Vier Prüfungen, die bisher nur im Protokoll lebten, als feste npm-Befehle
(Roadmap E3, 21.10.2026), dazu das Fertig-Gate `pruefen:alles`, das sie
zusammenführt (E4). Agenten rufen sie auf, statt sie neu zu schreiben.
Pixel, Gegenprobe und Bilder ändern nichts an der Website: Sie ersetzen die
CSS nur im Prüfbrowser. **`pruefen:modul` ändert Drupal:** Es ersetzt die App
im Modul und löscht Test-Themes (siehe dort). Ausgaben landen unter
`.pruefen/` (nicht versioniert).

| Befehl | Frage | Dauer (21.10.2026) |
|---|---|---|
| `npm run pruefen:pixel` | Sieht eine CSS-Änderung auf den DDEV-Seiten anders aus? | 5–10 min |
| `npm run pruefen:gegenprobe` | Wirkt eine Setzung (Token) überhaupt auf die Bauteile? | ~10 s |
| `npm run pruefen:bilder` | Stimmen die Arenen der Konfig-App mit den Referenzbildern? | ~30 s |
| `npm run pruefen:modul` | Läuft die App im DRUPAL11-Modul gegen echtes Drupal? | ~1 min |

Ausgang aller Befehle: **0** in Ordnung · **1** Befund (Unterschied,
wirkungslos, Test rot) · **2** Vorprüfung oder Aufruf gescheitert — der Grund
steht in der letzten Ausgabe.

## `pruefen:alles` — Fertig-Gate (E4)

```bash
npm run pruefen:alles -- --nur-zeigen   # Auswahl ansehen
npm run pruefen:alles                   # laufen lassen
#   [--alle] [--ohne modul --ohne bilder] [--basis main] [--ausgabe <ordner>]
#   [--gleichzeitig] [--pixel-erzwingen]
```

Wählt nach den Änderungen gegen `main` (Zweig + nicht Committetes, ohne
`STAND.md`):

| Geändert | npm test | ci:lokal --e2e | bilder | pixel | modul |
|---|---|---|---|---|---|
| nur `.claude/`, `docs/`, `specs/`, `*.md` (überall) | ✓ | | | | |
| Skripte, `package.json`, Sonstiges | ✓ | ✓ | | | |
| `apps/theme-configurator/`, `packages/` | ✓ | ✓ | ✓ | | ✓ |
| `scss/`, `data/design-tokens.json`, `data/*-recipe.json`, `scripts/generate-tokens*`, `package-lock.json`, `styles.css` | ✓ | ✓ | ✓ | ✓ | ✓ |

`npm test` lässt sich nicht abwählen. Eine unbekannte `--basis` bricht ab
(Ausgang 2), statt still nur den Arbeitsstand zu prüfen. **Unabhängig von
der Auswahl** vergleicht das Gate nach dem Bau die `styles.css` mit der
ausgelieferten: weicht sie ab, kommt der Pixelvergleich dazu.

Nacheinander (Standard): `build:css` → `npm test` → `ci:lokal --e2e` →
`pruefen:bilder --bauen` → `pruefen:pixel` → `pruefen:modul`. Nach einer
roten Prüfung unter test/ci/bilder entfallen die folgenden davon;
`pruefen:modul` entfällt, wenn `npm test` oder CI rot sind.

- **Pixelvergleich** prüft eine eingefrorene Kopie des frischen Baus gegen die
  ausgelieferte `styles.css` von neo_fe. **Sind beide byte-gleich, entfällt er
  als grün** („kein Unterschied möglich“) — sonst fände er nur Rauschen
  (`/produkte/workplace`). Erzwingen: `--pixel-erzwingen`.
- **`--gleichzeitig`** lässt den Pixelvergleich neben test/ci/bilder laufen.
  Im Probelauf vom 21.10.2026 war das nicht schneller: CI brauchte unter der
  Last 761 s statt ~263 s (gesamt ~15 min).

Ausgang **0** alles grün, **1** sonst. Zeigt der Pixelvergleich geänderte
oder unklare Seiten, steht im Bericht **HALTEPUNKT** (E6) — auch wenn er
wegen eines Seitenfehlers mit Ausgang 2 endet: anhalten, Frank die Seiten
zeigen. Kennzahlen nennen fehlgeschlagene und wackelnde Tests mit.
Bericht `.pruefen/fertig-<zeit>/bericht.md` mit Kennzahlen „für den
Commit-Rumpf“, `bericht.json`, je Prüfung ein Protokoll. Der Skill
`/fertig-pruefen` ruft das Gate und danach den Widersacher.

## `pruefen:pixel`

```bash
npm run pruefen:pixel -- --vorher alt.css --nachher neu.css
#   [--breite 1280 --breite 390] [--seiten liste.txt] [--nur '^/produkte']
#   [--parallel 3] [--ausgabe .pruefen/mein-lauf]
```

Je Seite drei Aufnahmen mit ersetzter `styles.css` des Themes: **a** vorher,
**b** nachher, **c** Kontrolle (vorher noch einmal). Gezählt werden Pixel mit
Graudifferenz > 8. Eine Seite gilt als *geändert*, wenn der Unterschied (a↔b)
größer ist als 2 × Rauschen (a↔c), sonst als *unklar* (von Hand ansehen).
Auffällige Seiten werden einmal frisch wiederholt; Bilder nur von diesen
unter `.pruefen/pixel-<zeit>/<breite>/`, dazu `bericht.txt` und `bericht.json`.

```
1280 Seiten mit Unterschied: 0 von 71
390 Seiten mit Unterschied: 0 von 71
  unklar    /produkte/workplace  Unterschied 311800 · Rauschen 571780
```

- **Seitenliste** frisch aus der DDEV-Datenbank (`path_alias`), ohne
  unveröffentlichte Knoten, plus Startseite; Ausschluss über
  `seitenAusschluss`. Die Liste des Laufs steht in `seiten.txt` daneben.
- **Bekanntes Rauschen:** `/produkte/workplace` malt große Bilder mitunter
  leer und bleibt *unklar* (Entscheidung Frank 21.10.2026, kein Ausschluss).
- **Die Kopfzeile zählt nur *geändert*.** Seiten mit *unklar* stehen
  darunter und zählen nicht mit; eine echte Änderung auf einer rauschenden
  Seite kann so „0 von N“ ergeben. Dann ist der Ausgang trotzdem 1 —
  Ausgang und Liste lesen, nicht nur die Zahl.
- **Wiederholung:** Eine auffällige Seite wird einmal frisch gemessen, der
  zweite Durchgang gilt. Eine Änderung, die nur manchmal erscheint, kann
  dadurch verschwinden.
- **Nur Sichtbares zählt:** Eine Änderung, die auf keiner Seite zu sehen ist
  (z. B. `body{background:…}` unter deckenden Abschnitten), ergibt 0.
- **Probe vor dem ersten Einsatz:** zweimal dieselbe CSS muss
  „0 von N“ ergeben.

## `pruefen:gegenprobe`

```bash
npm run pruefen:gegenprobe -- --setze '--font-ui: var(--font-mono)'
#   [--eigenschaft font-family] [--bauteile '.nc-button,.nc-chip']
#   [--css neu.css] [--breite 1280] [--seiten liste.txt] [--nur <muster>]
```

Erzwingt die Deklaration auf `:root` und den vier Theme-Klassen und zählt je
Bauteil, bei wie vielen Elementen sich die Eigenschaft ändert. Ohne `--css`
gilt die ausgelieferte `styles.css`.

| Urteil | Bedeutung |
|---|---|
| wirkt | mindestens ein Element ändert sich |
| wirkungslos | 0 von n — das Bauteil kommt vor, die Setzung erreicht es nicht |
| nicht geprüft | 0 von 0 — das Bauteil kommt auf keiner Seite vor |

- **`--eigenschaft` passend wählen:** Vorgabe ist `font-family`. Wer ein
  Farb- oder Abstandstoken prüft und die Eigenschaft nicht angibt, bekommt
  fälschlich „wirkungslos“.
- **Ausgang 0, sobald ein Bauteil wirkt** — auch wenn andere „nicht geprüft“
  sind. Ein Tippfehler im Bauteilnamen fällt nur in der Tabelle auf.

## `pruefen:bilder`

```bash
npm run pruefen:bilder              # nur prüfen
npm run pruefen:bilder -- --bauen   # vorher styles.css und Konfigurator bauen
npm run pruefen:bilder -- --aktualisieren   # Referenzbilder neu schreiben
```

Startet `npm run e2e:visuell` im Playwright-Abbild (Referenzbilder gibt es nur
für Linux, siehe `apps/theme-configurator/e2e/README.md`) und meldet
„N passed, M failed“. Bricht vorher ab, wenn der Worktree nicht unter
`dockerEinhaengen` liegt, die Abbild-Version nicht zu `@playwright/test` der
App passt, der Bau veraltet ist oder Docker nicht läuft.

**Nach `npm test` gilt der Konfigurator als veraltet:** `npm test` schreibt
`styles.css` neu, auch bei gleichem Inhalt. Dann mit `--bauen` starten.

## `pruefen:modul`

```bash
npm run pruefen:modul -- --nur-zeigen   # Vorprüfung, was aufgeräumt würde
npm run pruefen:modul                   # übernehmen, testen, aufräumen
#   [--drupal-zweig master] [--theme-zweig master]
```

1. Vorprüfung: `styles.css` aktuell, Playwright im Modul (`tests/e2e`),
   DRUPAL11 und neo_fe auf dem erwarteten Zweig, DDEV und Testkonto da.
   **Zweige werden nie umgeschaltet** — der Befehl nennt den Umschaltbefehl
   und bricht ab (Entscheidung Frank 21.10.2026).
2. `scripts/app-uebernehmen.sh` des Moduls mit diesem Worktree, `ddev drush cr`.
3. Modul-e2e (`tests/e2e/ablaeufe.spec.mjs`).
4. Aufräumen, auch nach Fehlschlag: nur `neo_theme` mit Label „E2E…“ oder
   „UX-Audit…“ und die Vorschau unter der Benutzer-Nummer von `e2eKonto`.
   „Kundentheme NEU“ bleibt immer; andere Vorschauen (z. B. Nummer 1)
   bleiben. `config/sync` wird nicht berührt. Das Muster prüft nur den
   Anfang des Labels: Auch ein Theme, das schon vor dem Lauf „E2E…“ hieß
   (oder „UX-Auditor…“), wird gelöscht — eigene Themes nicht so benennen.

Danach enthält das Modul die App aus diesem Worktree. Zurück auf den Stand
von `main`: `bash scripts/app-uebernehmen.sh ~/Sites/WEBSITE26` im Modul,
dann `ddev drush cr`.

## Einstellungen

`einstellungen.json` (versioniert) enthält Franks Pfade als Vorgabe. Eigene
Werte gehören in `einstellungen.lokal.json` daneben (nicht versioniert),
feldweise überschreibend, `~` wird aufgelöst.

| Feld | Wofür |
|---|---|
| `drupalWurzel`, `modulPfad`, `themePfad` | DRUPAL11, Modul `neo_theme_konfigurator`, Theme `neo_fe` |
| `ddevUrl` | Adresse der Website |
| `e2eKonto` | Testkonto der Modul-e2e; seine Vorschau wird aufgeräumt |
| `cssRoute` | Muster der `styles.css`, die Pixel und Gegenprobe ersetzen |
| `dockerAbbild`, `dockerEinhaengen`, `dockerVolumes` | Bildvergleich: Abbild, eingehängter Ordner, Volumes für Linux-`node_modules` |
| `breiten` | Breiten des Pixelvergleichs |
| `seitenAusschluss` | Muster für Seiten, die nicht geprüft werden |

## Aufbau

`lib/` enthält die Bausteine, je mit Test in `tests/pruefen/`:
`einstellungen` · `seiten` · `bau` (gleiche Regel wie der Schutz-Hook) ·
`browser` (Playwright aus `apps/theme-configurator`, keine zweite Fassung in
der Wurzel) · `aufnahme` · `vergleich` (Canvas, in Streifen) · `messung` ·
`pixel-bericht` · `gegenprobe` · `bilder` · `modul`.
