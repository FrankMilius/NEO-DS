---
name: pakete-parallel
description: Bearbeitet mehrere Reparatur-Pakete (z. B. R14 Paket 2a/2b) mit Agenten parallel — je Paket eigener Worktree, höchstens 2 Agenten gleichzeitig, Prüfung nacheinander, Widersacher, Bericht. Committet nicht; jedes Paket kommt einzeln zu Frank zur Freigabe. Aufrufen, wenn eine Paketliste unter scripts/pakete/ liegt und die Pakete bearbeitet werden sollen — auch bei „mach einfach durch“.
---

# Pakete parallel

Ein Paket allein ist Paket 1 von R14: Ursache messen, Kette oder Weiche,
Standard = heute sichtbar, Pixel 0, Gegenprobe. Mehrere Pakete parallel
scheitern nicht an der Reparatur, sondern am **gemeinsamen Zustand**: dieselbe
Website, dieselben Docker-Volumes, feste Playwright-Ports, ein Drupal-Modul.
Deshalb: Reparatur parallel, Prüfung nacheinander, Übernahme nacheinander.

## 1 · Anlegen

```bash
npm run pakete:vorbereiten -- scripts/pakete/<liste>.json --nur-zeigen
npm run pakete:vorbereiten -- scripts/pakete/<liste>.json
```

Legt je Paket `~/Sites/_worktrees/WEBSITE26-<punkt>-<id>` auf Zweig
`punkt/<punkt>-<id>` mit eigenen `node_modules` und ausgefüllter `STAND.md` an.
Meldet es „Schon angelegt“ (Ausgang 1): nicht löschen, die vorhandenen
Worktrees verwenden — `--nur-zeigen` nennt Ordner und Zweige trotzdem.

## 2 · Workflow starten

Workflow `r14-pakete` (`.claude/workflows/r14-pakete.js`) mit

```json
{ "pakete": [{ "id": "paket-2a", "ordner": "<ordner>", "zweig": "punkt/r14-paket-2a" }], "trocken": false }
```

Ordner und Zweige aus der Ausgabe von `--nur-zeigen`, nicht ausgedacht.
Erstmals mit einer neuen Liste: zuerst `"trocken": true` (Agenten planen nur,
ändern nichts) und den Plan je Paket lesen. Stimmen Zweige, sind die
Worktrees sauber und meldet kein Agent etwas unter „offen“, folgt der echte
Lauf ohne Rückfrage; sonst erst Frank fragen.

Der Workflow: Reparatur je Paket (höchstens 2 gleichzeitig) → je Paket
nacheinander Ports 3100/3101 frei?, Bau, `e2e:wirkung` + `wirkung --setzen`,
Gegenprobe mit `--css styles.css --bauteile …`, zuletzt
`pruefen:alles -- --ohne modul` → Widersacher.

Meldet ein Agent den falschen Zweig, wird sein Ergebnis verworfen: dann
`git status` in allen Worktrees und in `~/Sites/WEBSITE26` ansehen, Fremdes
**nicht** selbst zurückdrehen, sondern Frank zeigen.

## 3 · Nicht verhandelbar

| Regel | Warum |
|---|---|
| Nie `pruefen:modul`, nie `pruefen:alles` ohne `--ohne modul` | ändert Drupal (App im Modul, Test-Themes); läuft erst beim Übernehmen, allein |
| Prüfungen nie gleichzeitig | Ports 3100/3101, Docker-Volumes; CI unter Last 761 s statt 263 s |
| Kein Agent committet, auch kein „angestoßener“ Commit, der auf den Hook-Dialog wartet | Haltepunkt E6: Frank entscheidet in der Unterhaltung, nicht im Dialog |
| Gegenprobe mit `--css styles.css` und `--bauteile` | ohne `--css` misst sie die alte CSS, ohne `--bauteile` nur Button/Eingabefelder → falsches „wirkungslos“ |
| Gate zuletzt | `wirkung --setzen` ändert `token-wirkung.json`; der Bericht muss den Endstand belegen |

„Mach einfach durch“ hebt keine dieser Regeln auf: Am Ende stehen geprüfte,
**nicht committete** Pakete.

## 4 · Ergebnis vorlegen

Je Paket in **einer** Nachricht an Frank: Urteil, geänderte Dateien
(`git -C <ordner> diff --stat`), Gate-Kennzahlen, Pixel je Breite,
Gegenprobe- und Bühnen-Urteile, ohne-wirkung vorher → nachher,
Widersacher, Entwurf der Überschrift „(…, Freigabe ausstehend)“.

- **HALTEPUNKT** (Pixel geändert oder unklar): Der Workflow hält den ganzen
  Lauf an; die übrigen Pakete bleiben repariert, aber ungeprüft. Seiten,
  Breiten, Bilder unter `.pruefen/…/pixel-…/` zeigen und auf Frank warten.
- **Prüfung abgebrochen** (z. B. Ports belegt) oder **nichts repariert**:
  `offen` des Pakets lesen, Ursache beheben, dann nur dieses Paket erneut.
- **„… N offene Punkte“**: Die Reparatur hat Werte nicht erzwungen — die
  Punkte gehören in die Vorlage an Frank, nicht unter den Tisch.
- **widerlegt**: selbst im selben Worktree nachbessern, dann den Workflow
  nur mit diesem Paket erneut. Nach dem zweiten Widerspruch Frank fragen.
- **Frank fragt zwischendurch**: Stand aus `/workflows` und den bisher
  fertigen Paketen melden; einen laufenden Workflow nicht abbrechen.

## 5 · Nach Franks Freigabe, je Paket nacheinander

1. Zweig-Commit im Paket-Worktree (Regeln aus `/commit`, `git -C`).
2. `pruefen:modul` — allein, nie neben einem anderen Paket.
3. neo_fe-Zweig je Paket mit `css/styles.css` aus dem Bau, Commit
   „styles.css aus WEBSITE26 <hash>“.
4. Frank bringt nach main/master. Erst danach zieht das nächste Paket main
   nach; erzeugte Dateien (`tokens.generated.js`, `token-wirkung.json`,
   DTCG/Tokens-Studio) **neu erzeugen**, nicht von Hand zusammenführen, und
   die Prüfung aus Schritt 2 für dieses Paket wiederholen.

## Verwandt

`/punkt-starten` · `/fertig-pruefen` · `/widersacher` · `/doku` ·
`scripts/pruefen/README.md` · Muster: R14 Paket 1 (`git show 8baf23f7`)
