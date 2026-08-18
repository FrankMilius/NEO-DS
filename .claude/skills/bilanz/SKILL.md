---
name: bilanz
description: Erstellt die Arbeitsbilanz — was in einem Zeitraum entstanden ist, je Reportinggegenstand, mit Verbrauchszuordnung und offenen Befunden. Läuft montags automatisch; hier von Hand für andere Zeiträume oder zum Nachrechnen. Aufrufen bei „was habe ich diese Woche gemacht", vor Rückblicken, und wenn eine Zahl aus der Bilanz erklärt werden soll.
---

# Arbeitsbilanz

## Der Grundsatz: rechnen, nicht erzählen

Die Bilanz wird **berechnet**, nicht von mir formuliert. Drei Gründe, und alle
drei sind wichtiger, als es zunächst klingt:

1. **Vergleichbarkeit.** Ein erzählter Bericht ist jede Woche anders betont.
   Zwei Wochen nebeneinanderzulegen wird damit unmöglich — genau das, wofür
   eine Bilanz da ist.
2. **Prüfbarkeit.** Jede Zahl hat einen Befehl, der sie reproduziert. Wer
   misstraut, rechnet nach statt nachzufragen.
3. **Redlichkeit.** Ein Bericht, den ich schreibe, ist ein Bericht über meine
   eigene Arbeit. Die Versuchung, die guten Wochen besser klingen zu lassen,
   gehört gar nicht erst in die Nähe.

```bash
npm run bilanz                                  # letzte 7 Tage
npm run bilanz -- --wochen 4                    # letzte 4 Wochen
npm run bilanz -- --von 2026-07-01 --bis 2026-07-31
npm run bilanz -- --mail                        # zusätzlich Mail
npm run bilanz -- --oeffnen                     # gleich im Browser
node scripts/bilanz-daten.js --von … --bis …    # nur die Rohdaten
```

Ergebnis: `data/bilanz/bilanz-<von>_<bis>.html` und `.json` daneben.

## Wann automatisch, wann von Hand

**Montags 8:47 Uhr** läuft sie von selbst über einen LaunchAgent
(`~/Library/LaunchAgents/de.neocosmo.arbeitsbilanz.plist`) und schickt eine
Mail. Der Zeitpunkt liegt bewusst vor der Backlog-Erinnerung um 9:00 — erst
die Zahlen, dann die Vorsätze.

Von Hand lohnt sie sich bei: Monats- oder Quartalsrückblick, vor einem
Gespräch über Aufwand, und immer dann, wenn eine Zahl aus der Wochenmail
erklärt werden soll.

Läuft die Wochenmail nicht: `data/bilanz/lauf.log` und `launchd.log` ansehen.
Häufigste Ursache ist ein schlafender Rechner am Montagmorgen — dann von Hand
mit `--wochen 1` nachziehen.

## Die Reportinggegenstände

Der Bericht ist nach **Domänen** gegliedert, nicht nach Dateitypen. Eine Domäne
ist etwas, das eine eigene Aufgabe hat und für sich beurteilt werden kann:

| Domäne | Aufgabe | Was dort gemessen wird |
|---|---|---|
| **Design System** | Quelle der Wahrheit | Komponenten, Ebenenverteilung, ohne Recipe/Story |
| **Konfig-App** | Kundendesign ohne Code | einstellbare Gruppen, Vue-Bausteine |
| **Theme** | was die Website zeigt | Templates, JS, CSS |
| **Messstände** | womit belegt wird | Prüfskripte, Referenzstände |
| **Dokumentation** | Recipes und Begründungen | Recipes, Markdown |
| **Storybook** | begehbare Bibliothek | Stories |
| **Drupal-Site** | Konfiguration | Config-Exporte |
| **Agenten & Skills** | wie ich arbeite | Skills, Agenten, Regeln |
| **Projektgerüst** | Build, Abhängigkeiten | sollte klein bleiben |

Zuordnung in `scripts/bilanz-daten.js`, Feld `DOMAENEN`. **Die erste
zutreffende Regel gewinnt** — deshalb steht Besonderes oben. Kommt etwas Neues
dazu (ein weiteres Repo, ein neuer Ordner), gehört die Regel dort hinein,
sonst landet es still in „Projektgerüst".

Ausführlicher: [Kategorien](references/kategorien.md) ·
[Maße](references/masse.md) · [Ablauf und Ausgabeformat](references/ablauf.md)

## Das Entscheidungsregister

`data/entscheidungen.json` führt jede final getroffene Entscheidung mit einer
**Probe** — einer Prüfung, die wöchentlich beantwortet, ob sie noch gilt.

Der Grund steht in der Datei: Die Slate-Palette lief am 23.06.2026 vier Tage
produktiv, ohne dass es auffiel; `neo-overrides.css` hatte sie still
ausgehebelt. **Eine Entscheidung ohne Gegenprobe ist eine Absicht, kein
Zustand.**

Eine Entscheidung gehört hinein, wenn du sie ausdrücklich als final bezeichnet
hast **und** sie sich im Bestand nachweisen lässt. Was sich nicht prüfen lässt,
gehört ins `BACKLOG.md` — ein Eintrag ohne Probe wäre eine Behauptung mit Datum.

| Probe | Prüft |
|---|---|
| `muster` | Regex kommt in der Datei vor (`erwartet: false` = darf nicht) |
| `abwesend` | Die Datei darf es nicht geben |
| `vorhanden` | Die Datei muss es geben |

`repo` wählt das Repository: `ds` (Vorgabe), `theme`, `site`. Mit
`"status": "offen"` wird eine noch nicht entschiedene Frage mitgeführt, ohne
als gebrochen zu gelten — so steht der Slider-Namenskonflikt im Register,
bevor er gelöst ist.

**Nach jeder finalen Entscheidung einen Eintrag ergänzen.** Das ist die fünfte
Station der Gesamtstrecke: Design System, Konfig-App, Dokumentation, Storybook —
und der Nachweis, dass es so bleibt.

## Die vier Maße, auf die es ankommt

Zählungen sagen wenig — 67 Commits können eine gute oder eine schlechte Woche
sein. Diese vier sagen etwas:

**Gesamtstrecke.** Von den berührten Komponenten: wie viele haben Recipe, Story
und Konfig-App-Eintrag? Das misst genau die Regel, die du gesetzt hast, und
zwar am Stand, nicht an der Absicht.

**Nacharbeitsquote.** Anteil der Commits, die Korrekturen sind. Zwei Signale,
absichtlich getrennt geführt: Betreff spricht von Korrektur, **und** der Commit
fasst Dateien an, die in den 14 Tagen davor schon geändert wurden. Eine steigende
Quote ist das früheste Zeichen, dass zu schnell zu viel geändert wird.

**Bauteile ohne Fundstelle.** Wurzelklassen, die auf keiner gemessenen Seite
vorkommen. Nicht automatisch tot — vieles gehört zu Storybook oder wartet auf
seinen Einsatz. Aber hier stand auch das Card-Atom, 377 Zeilen, die niemand je
gesehen hat.

**Offene Befunde — mit Alter.** Was die Prüfwerkzeuge gerade melden: doppelte
Wurzelklassen, nicht geladene Skills, verirrte Build-Artefakte. Die Spalte
„offen seit" liest sich aus den JSON-Ständen früherer Bilanzen; ein Befund von
gestern und einer, der seit sechs Wochen mitreist, sind nicht dasselbe.

## Drei Zahlen für die lange Sicht

Einzeln sagen sie wenig, über Monate viel:

**Gewicht des gebauten CSS.** Bytes, Regeln, Selektoren, Eigenschaften. Die
Card-Löschung nahm 37 Regeln weg — ohne diese Zahl merkt niemand, ob
`styles.css` über Monate wächst.

> Es ist der Stand **von heute**, nicht der am Periodenende: `styles.css` ist
> gitignoriert und hat keine Historie. Für den Montagslauf stimmt das, weil
> heute das Periodenende ist. Ein nachträglicher Bericht über eine alte Woche
> zeigt hier das heutige Gewicht — die Seite sagt das dazu.

**Backlog-Bewegung.** Zugefügt gegen abgearbeitet. `BACKLOG.md` liegt in git,
deshalb wird hier wirklich der Stand **am Periodenende** gelesen
(`git show <sha>:BACKLOG.md`) und nicht der von heute. Ein Bericht über den
Juni zeigt das Backlog vom Juni.

**Fremdanteil.** Wer hat außer dir committet. Der Wert liegt weniger in der Zahl
als in der Frage, die sie stellt: Fällt fremde Arbeit an, muss sie beim Committen
ausgenommen werden — genau daran ist hier schon einmal eine Icon-Korrektur
mitgerutscht.

## Der Verbrauch

Kosten fallen **je Sitzung** an, Arbeit **je Domäne**. Die Brücke dazwischen ist
eine Schätzung: Der Betrag einer Sitzung wird auf die Domänen verteilt, die sie
angefasst hat — gewichtet nach Dateipfaden aus Werkzeugaufrufen und nach Commits
im Zeitfenster. Der Bericht sagt das an Ort und Stelle dazu.

Drei Dinge, die man beim Lesen wissen muss:

- **Preise stehen in `data/claude-preise.json`.** Sie sind eine Annahme und
  gehören mit der Abrechnung abgeglichen. Nur dort ändern, nirgends im Code.
- **Bei `abonnement: true` ist der Betrag kein Ausgabeposten**, sondern ein Maß
  für Verbrauch. Der Bericht beschriftet die Spalte entsprechend.
- **Cache-Lesen ist der größte und billigste Posten.** Ein hoher Anteil ist gut:
  lange Sitzungen mit warmem Kontext statt ständigem Neuaufbau.

> **Die Dublettenfalle.** Ein Modellergebnis steht mehrfach im Transkript — je
> Inhaltsblock eine Zeile, mit identischem `usage` und identischer `message.id`.
> Ungefiltert zählt eine Antwort bis zu achtmal. In der ersten Erhebung waren
> 4260 von 7511 Einträgen Dubletten; die Kosten lagen um die Hälfte zu hoch.
> `nutzung()` entdoppelt über `message.id`. Wer die Zählung anfasst, muss das
> beibehalten.

## Was die Bilanz NICHT ist

- **Keine Leistungsbeurteilung.** Zeilenzahlen messen Umfang, nicht Wert. Eine
  Woche mit 37 gelöschten Regeln kann die beste des Monats sein.
- **Kein Ersatz für den Verlauf.** Warum etwas geschah, steht im Commit. Die
  Bilanz zählt, sie begründet nicht.
- **Kein Frühwarnsystem.** Sie schaut zurück. Wer wissen will, ob etwas gerade
  kaputtgeht, nimmt `npm run kontrast`, `zustand` oder `baseline:diff`.

## Verwandt

`npm run risiko` · `npm run skills` · `npm run drift:check` ·
Skill `commit` · Skill `plan` · `BACKLOG.md`
