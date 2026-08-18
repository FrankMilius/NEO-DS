# Ablauf, Ausgabe und Wartung

## Der Weg der Zahlen

```
git log (3 Repos, --numstat)  ─┐
Claude-Transkripte (~/.claude) ─┼─→  bilanz-daten.js  ─→  bilanz-html.js  ─→  Seite
Bestand + Prüfwerkzeuge       ─┘         (Rohdaten)         (Darstellung)      + Mail
```

**Erhebung und Darstellung sind getrennt.** Wer einer Zahl misstraut, ruft
`node scripts/bilanz-daten.js --von … --bis …` auf und liest JSON, ohne sich
durch Markup zu arbeiten. Wer die Seite ändern will, fasst die Zahlen nicht an.

## Aufbau der Seite

1. **Kennzahlenband** — fünf Werte, die eine Woche zusammenfassen
2. **Reportinggegenstände** — die Domänentabelle, das Rückgrat des Berichts
3. **Gesamtstrecke** — mit namentlicher Liste der Lücken
4. **Befunde** — was die Prüfwerkzeuge gerade melden
5. **Verbrauch im Einzelnen** — Token nach Posten
6. **Verlauf** — alle Commits, neueste zuerst

Die Reihenfolge ist Absicht: **erst das Urteil, dann die Belege.** Wer nur die
ersten beiden Abschnitte liest, hat die Woche verstanden.

## Gestaltung

Die Seite benutzt die Farben, über die sie berichtet — Graphit als Grund, Lime
als einzigen Akzent. Beide Themen sind gestaltet, die Umschaltung folgt
`prefers-color-scheme` und `data-theme`.

> **Lime trägt nie Text.** `#37e93d` kommt auf Weiß auf 1,7:1 und ist als
> Schriftfarbe unbrauchbar. Es markiert Balken und Kanten; für Text steht
> `--lime-text` daneben, das AA hält. Wer die Seite umfärbt, muss das
> beibehalten — es ist dieselbe Trennung wie im Design System selbst.

Zahlen stehen durchgehend in Tabellenziffern (`tabular-nums`), damit Spalten
untereinander lesbar bleiben. Größen erscheinen zusätzlich als Balken: Form
liest sich schneller als Zahl.

## Automatik

| Was | Wo |
|---|---|
| Zeitplan | `~/Library/LaunchAgents/de.neocosmo.arbeitsbilanz.plist` |
| Startskript | `scripts/bilanz-woechentlich.sh` |
| Protokoll | `data/bilanz/lauf.log`, `launchd.log` |

Montags 8:47 Uhr. Nach Änderungen am Plist neu laden:

```bash
launchctl bootout   gui/$(id -u)/de.neocosmo.arbeitsbilanz
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/de.neocosmo.arbeitsbilanz.plist
```

Der Wrapper existiert, weil launchd mit nacktem Umfeld startet: **kein PATH,
keine Profile.** `git` fände sich noch, `node` nicht.

## Mail

Über Mail.app per AppleScript. Auf diesem Rechner läuft **kein MTA** — `mail`
und `sendmail` würden still in einer Queue hängen, die niemand leert.

Voraussetzungen: Mail.app eingerichtet, und einmalig die Erlaubnis unter
Systemeinstellungen › Datenschutz › Automatisierung. Empfänger über
`--an <adresse>` oder `BILANZ_MAIL`.

**Schlägt der Versand fehl, ist die Seite trotzdem geschrieben.** Der Bericht
ist das Ergebnis, die Mail nur die Benachrichtigung — sie darf ihn nicht mit
sich reißen.

## Wartung

Was beim Ändern schiefgehen kann, in der Reihenfolge der Wahrscheinlichkeit:

| Fall | Zeichen | Behebung |
|---|---|---|
| **Neuer Ordner ohne Domänenregel** | „Projektgerüst" wächst | Regel in `DOMAENEN` ergänzen, **vor** der allgemeinen |
| **Dubletten wieder mitgezählt** | Verbrauch springt etwa aufs Doppelte | Entdopplung über `message.id` in `nutzung()` prüfen |
| **Preise veraltet** | Beträge passen nicht zur Abrechnung | nur `data/claude-preise.json` |
| **Werkzeug bricht** | Befund „nicht ermittelbar" | Absicht — ein fehlender Wert darf die Bilanz nicht kippen |
| **Alle Deltas stehen auf null** | Vergleich mit dem eigenen Stand | `zeitraum.bis === bis` muss übersprungen werden |
| **Probe nicht mehr ausführbar** | Entscheidung „unprüfbar" | Die geprüfte Datei wurde umbenannt — Probe nachziehen, nicht löschen |

> **Der Selbstvergleich ist die unauffälligste Falle.** Ein zweiter Lauf
> desselben Zeitraums überschreibt seine eigene JSON-Datei und fände sie dann
> als „Vorwoche" — jede Veränderung wäre für immer null, und zwar
> überzeugend. `cssGewicht`, `backlog` und `befundAlter` überspringen deshalb
> jeden Stand mit gleichem `zeitraum.bis`.

> **Die erste zutreffende Domänenregel gewinnt.** Deshalb steht Besonderes oben
> und Allgemeines unten. Wer eine Regel ans Ende hängt, wundert sich, dass sie
> nie greift.
