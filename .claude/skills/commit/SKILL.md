---
name: commit
description: Committet Änderungen in der Drei-Repo-Topologie dieses Projekts — mit Prüfung vor dem Commit, Begründung statt Aufzählung, und ohne fremde Arbeit mitzunehmen. Optional Push samt composer.lock-Nachzug.
---

# Commit

## Die Topologie zuerst

Drei getrennte Repositories, die zusammenhängen:

| Repo | Was dort liegt |
|---|---|
| `~/Sites/WEBSITE26` | Design System, Skripte, Konfig-App, Messstände |
| `~/Sites/DRUPAL11/web/themes/custom/neo_fe` | Theme — **eigenes Repo**, im Site-Repo ignoriert |
| `~/Sites/DRUPAL11` | Site, Konfiguration, `composer.lock` |

Eine Änderung berührt fast immer **zwei** davon: Design System und Theme. Prüfe
alle drei, bevor du meldest, es sei nichts offen.

```bash
for r in ~/Sites/WEBSITE26 ~/Sites/DRUPAL11/web/themes/custom/neo_fe ~/Sites/DRUPAL11; do
  printf "%-12s %s offen, %s geändert\n" "$(basename $r)" \
    "$(git -C $r log --oneline @{u}..HEAD 2>/dev/null | wc -l)" \
    "$(git -C $r status --porcelain | wc -l)"
done
```

> **`cd` in einer Kette gilt weiter.** `cd A && git push` gefolgt von
> `git push` pusht **zweimal A**. Zweimal in dieser Sitzung passiert. Nimm
> `git -C <pfad>`.

## 1 · Vor dem Commit prüfen

Was geändert wurde, bestimmt die Prüfung:

| Geändert | Pflicht |
|---|---|
| SCSS, Token | `npm run build:css`, dann `npm run sync:drupal` und `ddev drush cr` |
| irgendetwas Sichtbares | Referenzstand + `npm run kontrast -- <neu> --gegen <alt>` |
| Farben, Flächen | zusätzlich `npm run artefakt` vor jeder Rücknahme |
| Zustände, Navigation | `npm run zustand` |
| `data/*-recipe.json` | `npm run lint:recipes` |

Bei Fehlern **stoppen**, nicht committen. Ein kaputter Build im Verlauf kostet
später mehr als die Wartezeit jetzt.

## 2 · Fremde Arbeit erkennen

`git status` zeigt auch, was jemand anders geändert hat. Beispiele aus diesem
Projekt: eine Icon-Korrektur in `js/neo-theme.js`, ein `pathauto`-Muster in
der Datenbank.

**Nicht mitnehmen.** Einzeln stagen, nie `git add -A`, wenn Fremdes dabei ist.
Bei Konfigurationsexporten: `git checkout <datei>` für alles, was nicht zur
eigenen Änderung gehört, und den Fund in der Antwort nennen.

Ausschließen, sofern nicht ausdrücklich verlangt: `*.png`, `*.jpg`,
`icons-manifest.json`, `.mcp.json`, `.DS_Store`, `node_modules/`.

## 3 · Die Nachricht

**Begründung, nicht Aufzählung.** Was geändert wurde, steht im Diff. Was
nicht im Diff steht, ist der Grund — und der ist in sechs Monaten das
Einzige, was zählt.

Ein guter Commit dieses Projekts enthält:

- **Was war und warum es falsch war** — mit Zahl, wenn es eine gibt
- **Was jetzt gilt** — mit der Messung, die es belegt
- **Was verworfen wurde und weshalb** — der teuerste Teil, wenn er fehlt
- **Was offen bleibt** — ausdrücklich, nicht durch Weglassen

Eigene Irrtümer gehören hinein. Ein Commit, der einen halben Tag Umweg
verschweigt, lädt zum zweiten Umweg ein.

```bash
# IMMER über Datei, nie mit Backticks in der Kommandozeile:
# Rückwärtsschrägstriche werden sonst als Befehl ausgeführt und durch
# ihre Ausgabe ersetzt. DREIMAL in dieser Sitzung passiert — und es gilt
# nicht nur für Commit-Nachrichten, sondern für JEDEN Text mit
# Rückwärtsschrägstrichen, der durch eine Shell läuft: auch für
# Skill-Dateien, die per Python-Ersetzung geschrieben werden.
# Sicher ist: Edit/Write statt Kommandozeile.
cat > /tmp/msg.txt <<'MSG'
typ(bereich): eine Zeile, die den Grund nennt

…
MSG
git -C <pfad> commit -F /tmp/msg.txt
```

Sprache: Deutsch, passend zum Bestand. Umlaute in Commit-Nachrichten
vermeiden (`ae`, `oe`, `ue`) — der Bestand macht das so.

## 4 · Push

**Nur auf ausdrückliche Bitte.** Frank ist bei Git unsicher; ungefragtes
Pushen nimmt ihm die Kontrolle.

Nach einem Push von `neo_fe` **immer** `composer.lock` nachziehen:

```bash
sleep 40                                    # Satis braucht ~25s
cd ~/Sites/DRUPAL11
composer update neocosmo/neo_fe --no-install
git add composer.lock && git commit -F …
```

> Ohne diesen Schritt setzt das nächste `composer install` das Theme auf den
> alten Stand zurück — samt aller Arbeit darin. Genau so ist einmal ein
> ganzer Tag verschwunden.

`--no-install` ist Pflicht: Ohne das überschreibt Composer das
Theme-Verzeichnis sofort.

## 5 · Danach

`git status` in allen drei Repos, und dem Nutzer sagen, was wo liegt. Wenn
etwas offen bleibt, benennen — nicht schweigen.
