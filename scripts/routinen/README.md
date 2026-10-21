# Routinen (Agenten-Landkarte E8)

Zwei Berichte, die regelmäßig von selbst laufen. **Nur lesen, nur berichten**:
Sie ändern keine Datei in einem Repository, committen nicht, pushen nicht und
schreiben die Ratsche nicht fest.

| Routine | Befehl | Wann | Bericht |
|---|---|---|---|
| Wirkungsprüfung | `npm run routinen:wirkung` | täglich 03:00 | `~/Sites/_berichte/wirkung-JJJJ-MM-TT.md` |
| Wartungsbericht | `npm run routinen:wartung` | Montag 08:00 | `~/Sites/_berichte/wartung-JJJJ-MM-TT.md` |

Die letzte Zeile der Ausgabe lautet immer `HANDLUNGSBEDARF: …` (oder
`HANDLUNGSBEDARF: keiner`). Nur wenn dort etwas steht, meldet die geplante
Aufgabe sich bei Frank.

## Wirkungsprüfung (`wirkung-nacht.mjs`)

- Prüft den **lokalen** Stand von `main` (auch Ungepushtes) mit der Ratsche aus
  R12 (`apps/theme-configurator`: `npm run e2e:wirkung`).
- Eigener, fester Worktree `~/Sites/_worktrees/WEBSITE26-routine` mit
  abgehängtem Kopf; wird beim ersten Lauf angelegt. Hat er Änderungen, bricht
  der Lauf ab, statt sie zu verwerfen.
- `npm ci` nur, wenn sich eine `package-lock.json` geändert hat.
- Eigene Ports 3190/3191 und `CI=1`, damit kein fremder Docs-Server einer
  anderen Sitzung mitgemessen wird.
- Rückgabe: 0 gut · 1 Token schlechter als festgeschrieben · 2 abgebrochen.

## Wartungsbericht (`wartung.mjs`)

- **Sicherung:** neuestes Bündel `~/Sites/_sicherung/<repo>-master-*.bundle`
  gegen `master` von DRUPAL11 und neo_fe. „gepusht“ = master liegt bereits auf
  dem entfernten Repository, ein Bündel ist dann nicht nötig.
- **Nicht gepusht:** Commits je Repository über dem entfernten Zweig (ab 10
  als Handlungsbedarf).
- **Worktrees:** erledigt (Zweig steckt in der Basis, nichts offen) · liegt
  (letzter Commit älter als 7 Tage) · in Arbeit · Ordner fehlt.
- **Dependabot:** offene Pull-Requests auf GitHub mit CI-Zustand (`gh`).
- **Drupal-Sicherheit:** `composer audit --locked` auf dem Mac. Bewusst nicht
  `ddev composer`: das löst den Theme-Schutz („COMPOSER GESTOPPT“) aus und
  braucht laufendes ddev. `--locked` liest nur `composer.lock`.
- Rückgabe: 0 kein Handlungsbedarf · 1 Handlungsbedarf.

## Geplante Aufgaben (Claude-App)

Angelegt mit den Werkzeugen für geplante Aufgaben. Die Aufträge:

**neo-wirkung-nacht** (täglich 03:00)

> Du bist Claude Code. Führe im Ordner /Users/frank.milius/Sites/WEBSITE26
> genau diesen Befehl aus: `node scripts/routinen/wirkung-nacht.mjs`. Ändere
> keine Dateien, committe nicht, pushe nicht, führe kein `--setzen` aus. Lies
> die letzte Zeile der Ausgabe. Steht dort „HANDLUNGSBEDARF: keiner“, beende
> dich ohne Meldung. Sonst schicke Frank eine kurze Push-Benachrichtigung auf
> Deutsch mit dem Handlungsbedarf und dem Pfad des Berichts.

**neo-wartung-woche** (Montag 08:00)

> Du bist Claude Code. Führe im Ordner /Users/frank.milius/Sites/WEBSITE26
> genau diesen Befehl aus: `node scripts/routinen/wartung.mjs`. Ändere keine
> Dateien, räume nichts auf, committe nicht, pushe nicht. Lies die letzte
> Zeile der Ausgabe. Steht dort „HANDLUNGSBEDARF: keiner“, beende dich ohne
> Meldung. Sonst schicke Frank eine kurze Push-Benachrichtigung auf Deutsch
> mit den Punkten und dem Pfad des Berichts.

Tests: `tests/routinen/` (reine Auswertung in `lib/`).
