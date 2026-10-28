# Korrekturen über die ganze Strecke

Gilt für jede Korrektur an der Konfig-App (`apps/theme-configurator`) oder an
der Drupal-Umsetzung (`neo_fe`, `DRUPAL11`), auch für die kleinste.
Vorgabe Frank 28.10.2026.

## Grundsatz

Eine Korrektur ist erst fertig, wenn **jede Station geprüft** ist. Eine
Station ohne Änderung bekommt einen Satz „nichts nachzuziehen, weil …“ in
`STAND.md` und im Commit-Rumpf. Schweigen zählt nicht als geprüft.

## Die Stationen

| Station | Frage | Ort | Befehl |
|---|---|---|---|
| Ursache | Liegt der Fehler wirklich in App oder Theme — oder im Design System? | `npm run widerlegen -- --token <name>` | — |
| Design System | Muss SCSS oder ein Token mit? | `scss/scss/…`, `_component-tokens.scss`, `data/design-tokens.json` | `npm run tokens`, `npm run build:drupal` |
| Konfig-App | Ist der Wert einstellbar und wirkt er? Neue Oberflächentexte? | `components.groups` in `design-tokens.json`, `apps/theme-configurator/README.md`, `apps/theme-configurator/BEGRIFFE.md` | `npm run doku:begriffe -- --basis main` |
| Doku des Design Systems | Stimmen Beschreibung, Beispiel und Recipe noch? | `docs/content/<komponente>.html`, `data/recipes/<komponente>-recipe.json` | `npm run lint:recipes` |
| Storybook | Folgen die Stories dem Recipe? | `stories/` | `npm run generate:stories`; bei aus dem Theme aufgenommenen Komponenten vorher `npm run recipe -- <komponente> --schreiben` |
| Nebenbefunde | Was ist aufgefallen, gehört aber nicht dazu? | `BACKLOG.md` | — |
| Roadmap | Ist der Punkt als Improvement eingetragen und erledigt? | Artefakt EFmN6VFRxTG3NTpSxBNHcj, Sammlung `eintraege` (Abschnitt unten) | — |

## Wohin die Korrektur gehört

- **Fehler in einer Komponente des Design Systems** wird im Design System
  behoben, nicht in `neo-overrides.css`. Dort steht nur, was an Drupals
  eigenem Markup hängt.
- **Ein Wert im Konfigurator ohne Wirkung** hat seine Ursache fast immer im
  Design System (Muster R11): erst dort ansetzen, dann die App.
- **Würde eine Theme-Regel auch außerhalb von Drupal gelten**, gehört sie ins
  Design System.

## Reihenfolge über die Repositorys

1. WEBSITE26 (Design System, App, Doku) — eigener Worktree, eigener Commit
2. `neo_fe` — nach `npm run build:drupal`, eigener Commit
3. `DRUPAL11` — Konfiguration nur auf ausdrücklichen Wunsch

Jeder Commit-Rumpf nennt die Hashes der anderen Repositorys.

## Roadmap: Improvements

Jede Korrektur steht als **Improvement** in der Roadmap (Vorgabe Frank
28.10.2026), Bereich „Improvements“ der Seite
https://claude.ai/artifact/EFmN6VFRxTG3NTpSxBNHcj.

- **Wann:** beim Anlegen des Worktrees, nicht erst am Ende. Die Nummer des
  Eintrags ist der Punkt für `/punkt-starten` (z. B. `I02 <kurzname>`).
- **Nummer:** `I` plus zweistellige laufende Zahl; die nächste freie aus der
  Sammlung `eintraege` lesen.
- **Felder:** `bereich: "improvements"`, `art` (`verbesserung`, bei einem
  Mangel `fehler`), `titel`, `text` (was danach gilt, mit Datei oder Token),
  `warum`, `herkunft` („Befund Frank <Datum>“), `bezug`, `zeitraum: "jetzt"`,
  `reihenfolge`.
- **Nach der Freigabe:** `erledigt` mit Datum, Hashes je Repository und den
  Zahlen des Fertig-Gates; offene Folgepunkte nennen.
- Mit `ArtifactData` schreiben; einen bestehenden Eintrag nur mit `if_version`
  ändern.

## Ablauf

- Eine Korrektur, eine Sitzung, ein Worktree: `/punkt-starten <Punkt> <kurzname>`.
  Bündeln nur, wenn dieselbe Komponente betroffen ist.
- In `STAND.md` festhalten, ob die Website sich ändern darf.
- Haltepunkte (E6) und Fertig-Gate (`npm run pruefen:alles`) gelten unverändert.
- Für größere Korrekturen plant `/plan` dieselben Stationen ein (Abschnitt
  „Gesamtstrecke“); diese Regel ist die Kurzform für kleine.
