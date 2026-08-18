---
name: plan
description: Erstellt einen Umsetzungsplan für eine Änderung am Design System oder an der Website — mit Prüfschranke je Phase, benannten Risiken und den Entscheidungen, die der Nutzer treffen muss. Speichert nach .claude/plans/.
---

# Plan

Ein Plan, der nur auflistet, was zu tun ist, ist eine Aufgabenliste. Ein Plan
für dieses Projekt beantwortet drei Fragen, die teurer sind als die Reihenfolge:

1. **Woran merken wir, dass es funktioniert hat?** — je Phase eine Messung
2. **Was kann dabei kaputtgehen, ohne dass es auffällt?** — die Risiken
3. **Was muss der Nutzer entscheiden, bevor es losgeht?** — nicht unterwegs

## 1 · Erst nachsehen, dann planen

Höchstens ein paar Minuten, aber **nicht null**. Ein Plan, der auf Annahmen
über den Ist-Stand beruht, plant an der Wirklichkeit vorbei.

Nachsehen, nicht vermuten:

```bash
npm run drift:check                       # was ist noch offen
node scripts/messen.js <pfad> <selektor>  # was gilt heute wirklich
npm run widerlegen -- --token <name>      # wer setzt es, wer gewinnt
```

Wo eine Zahl in der Aufgabenstellung steht, **prüfe sie**. Zahlen aus
Erinnerungen und älteren Ständen beschreiben oft einen Zustand, den es nicht
mehr gibt.

## 2 · Der Plan

Je Phase:

| Feld | Inhalt |
|---|---|
| **Ziel** | Ein Satz. Was danach gilt, nicht was getan wird. |
| **Dateien** | Konkret, mit Repo. Design System und Theme sind getrennt. |
| **Prüfschranke** | Welcher Befehl belegt den Erfolg — und was er ausgeben muss |
| **Risiko** | Was still schiefgehen kann, nicht was laut scheitert |
| **Rückweg** | Wie der Stand vor der Phase wiederherzustellen ist |

**Phasen so schneiden, dass jede einzeln messbar ist.** Eine Phase, deren
Wirkung sich erst mit der nächsten zeigt, ist keine Phase — sie ist ein halber
Schritt und verhindert, dass ein Fehler zugeordnet werden kann.

## 3 · Risiken, die dieses Projekt kennt

Beim Planen ausdrücklich prüfen, ob eines davon zutrifft:

| Risiko | Woran man es erkennt |
|---|---|
| **Spätere Ebene gewinnt** | Der Wert steht in mehr als einer Datei. `neo-overrides.css` und `theme-overrides.css` laden nach `styles.css`. |
| **Geltungsbereich ohne Träger** | Eine Regel auf einer Klasse, die auf keiner Seite vorkommt. |
| **Ebenen-Doppelung** | Dieselbe Komponente wird auf zwei ITCSS-Ebenen geführt. |
| **Geteilter Klassenname** | Zwei Komponenten heißen gleich (`.nc-feature-list`). |
| **Zustand ungeprüft** | Die Änderung betrifft Hover, Fokus oder Geöffnet — der Referenzstand ist dort blind. |
| **Composer setzt zurück** | Theme gepusht, `composer.lock` nicht nachgezogen. |
| **Konfig-App vergessen** | Ein Token existiert, aber niemand kann es einstellen. |

## 4 · Entscheidungen vorher einholen

Trenne sauber:

- **Was du selbst entscheidest** — Umsetzungsweg, Benennung, ITCSS-Ebene,
  Reihenfolge. Dafür bist du da; frage nicht nach Selbstverständlichem.
- **Was der Nutzer entscheiden muss** — alles, wo verschiedene Lesarten zu
  materiell verschiedener Arbeit führen: Markenfarbe, sichtbare Umbauten,
  Verhältnis von Aufwand zu Nutzen.

Frage **vor** der Umsetzung, nicht mittendrin. Und stelle die Frage mit
Belegen: Wer eine Farbe wählen soll, braucht die Kontrastwerte daneben.

Wenn eine Entscheidung visuell ist, biete eine Vorschau an, statt zu
beschreiben. Ein HTML-Artefakt mit Vorher und Nachher beantwortet in dreißig
Sekunden, worüber sonst zwei Runden vergehen.

## 5 · Die Gesamtstrecke einplanen

Nach einer **finalen** Entscheidung ist die Umsetzung erst fertig, wenn vier
Stationen bedient sind. Jede gehört in den Plan, nicht in ein Nachwort:

```
Design System   SCSS auf der richtigen ITCSS-Ebene, Token in _component-tokens
Konfig-App      components.groups in design-tokens.json, npm run tokens
Dokumentation   Recipe, Begründung im Code oder im BACKLOG
Storybook       npm run recipe && npm run generate:stories
```

## 6 · Speichern und übergeben

`.claude/plans/JJJJ-MM-TT-<kurzname>.md`

Dann **eine** Frage: welche Phase zuerst. Nicht „soll ich anfangen" — der
Plan ist die Antwort darauf.

Vorherige Phasen nicht erneut prüfen, wenn nicht danach gefragt wird. Ihre
Prüfschranke ist gelaufen; ein zweiter Durchgang kostet Zeit und findet
nichts.
