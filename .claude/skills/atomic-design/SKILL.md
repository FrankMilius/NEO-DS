---
name: atomic-design
description: Ordnet Interface-Bausteine nach dem Modell von Brad Frost ein — Atome, Moleküle, Organismen, Templates, Seiten. Erkennt Wiederverwendbarkeit, Kontextabhängigkeit, Dubletten und fehlende Grundbausteine. Aufrufen beim Anlegen einer Komponente, beim Aufräumen einer Ebene, bei der Frage „wohin gehört das", und vor jeder Aufnahme aus dem Theme ins Design System.
---

# Atomic Design System Architect

## Zweck

Interface-Bausteine so ordnen, dass sie wiederverwendbar bleiben und ihr Platz
begründbar ist. Nicht: Seiten bauen. **Build systems, not pages.**

## Erstes und wichtigstes Prinzip

**Atomic Design ist ein mentales Modell, kein Ablauf.** Es beschreibt, *wie
Dinge zueinander stehen*, nicht *in welcher Reihenfolge sie entstehen*.
Die fünf Ebenen sind gleichzeitig gültig, nicht nacheinander zu durchlaufen.

Konkret heißt das:

- Man beginnt **nicht** bei den Atomen. Meist beginnt man mit einer Seite, die
  jemand braucht, und findet die Atome darin.
- Ein Organismus darf entstehen, bevor seine Moleküle benannt sind. Die
  Zerlegung kommt danach — oder gar nicht, wenn sie nichts einbringt.
- Die Ebene eines Bausteins darf sich ändern. Etwas, das als Atom begann und
  drei Teile bekommen hat, ist ein Molekül geworden.

Wer die Ebenen als Phasen liest, baut sechs Monate an einer Bibliothek, bevor
die erste Seite steht. Das ist der häufigste und teuerste Fehler mit diesem
Modell.

## Die Ebenen in diesem Projekt

Das NEO-System benutzt **ITCSS**, und ITCSS hat mehr Ebenen als Atomic Design.
Das ist kein Widerspruch, aber die Abbildung muss man kennen:

| ITCSS | Atomic Design | Was dort hingehört |
|---|---|---|
| `00-settings` | — | Token, Leitern, Themen. Kein Baustein. |
| `01-tools` | — | Mixins, Funktionen. |
| `02-generic`, `03-elements` | — | Zurücksetzung, nackte HTML-Elemente. |
| `04-objects` | **kein Gegenstück** | Layout-Objekte: `container`, `grid`, `section`, `content`, `aspect-ratio`. |
| `05-atoms` | Atom | Kleinste funktionale Einheit. |
| `06-molecules` | Molekül | Mehrere Atome mit einer Aufgabe. |
| `07-organisms` | Organismus | Eigenständiger Abschnitt. |
| `08-templates` | Template | Struktur ohne Inhalt. |
| `09-pages` | Seite | Instanz mit echten Daten. |
| `10-utilities` | **kein Gegenstück** | Einzweckklassen: `sr-only`, `cw-*`, `type-*`. |

> **Die beiden Ebenen ohne Gegenstück sind wichtig.** Atomic Design kennt
> keinen Ort für ein reines Layout-Objekt und keinen für eine Hilfsklasse.
> Wer sie in die fünf Ebenen presst, bekommt „Atome", die keine Funktion
> haben. Ein `container` ist kein Atom — er ist ein Objekt. Er trägt kein
> Interface, er ordnet nur an.

## Entscheidungsregeln

Der Reihe nach prüfen; die erste zutreffende Regel entscheidet.

| Frage | Wenn ja |
|---|---|
| Ordnet es nur an, ohne selbst etwas darzustellen? | **04-objects** |
| Tut es genau eine Sache und ist es keine Komponente? | **10-utilities** |
| Ist es sinnvoll weiter zerlegbar? | eine Ebene höher prüfen |
| Besteht es aus mehreren Atomen mit **einer** Aufgabe? | **Molekül** |
| Ist es ein Abschnitt, der allein stehen kann? | **Organismus** |
| Beschreibt es eine Anordnung ohne Inhalt? | **Template** |
| Hat es echte Daten? | **Seite** |
| Nichts davon, und nicht weiter zerlegbar? | **Atom** |

### Die zwei Fragen, die wirklich entscheiden

Bei jedem Zweifel zwischen zwei Ebenen:

1. **Kann ich es woanders verwenden, ohne etwas mitzuschleppen?** Ja → tiefere
   Ebene. Nein → höhere.
2. **Hat es eine Aufgabe oder mehrere?** Eine → Molekül. Mehrere, die zusammen
   einen Abschnitt ergeben → Organismus.

Der Rest ist Auslegung, und Auslegung darf man abkürzen: Eine Fehleinordnung
auf einer Ebene kostet weniger als eine Woche Diskussion.

## Was in diesem Projekt schiefgehen kann

Diese fünf Fälle sind hier tatsächlich eingetreten. Vor jeder Einordnung prüfen.

### 1 · Ebenen-Doppelung

Dieselbe Klasse auf zwei Ebenen. Die spätere Datei gewinnt, die frühere ist
wirkungslos — und niemand merkt es, weil beide Dateien existieren.

**Offen im Bestand, Stand 18.08.2026:**

```
card     .nc-card    in 05-atoms UND 06-molecules   → Molekül gewinnt
slider   .nc-slider  in 05-atoms UND 06-molecules   → Molekül gewinnt
```

```bash
npm run risiko -- --ds            # Doppelungen INNERHALB des Design Systems
npm run risiko -- --alle          # zusätzlich die drei Aufnahme-Ursachen
```

Die beiden Aufrufe sehen auf verschiedene Dinge. `--ds` findet Klassen, die
das System selbst zweimal führt; `--alle` prüft, was bei einer Aufnahme aus
dem Theme schiefgehen kann.

**Vor jeder Aufnahme laufen lassen.** An dieser Ursache sind `form-label`,
`form-error`, `form-field` und `gallery` schon einmal gescheitert.

### 2 · Geteilter Klassenname

Zwei verschiedene Bausteine heißen gleich. `.nc-feature-list` war die
Merkmalsliste einer Preiskarte (`<ul>`) **und** ein Blocktyp — deren
`padding: 0` nahm dem Block seine Abschnittspolsterung.

Der Blocktyp hatte gar keine eigene Wurzelregel; seine ganze Gestaltung kam
versehentlich aus der Preistabelle. **Prüfen: Gibt es die Klasse schon?**

### 3 · Abhängigkeit von der Ladereihenfolge

Eine Regel gewinnt nur, weil ihre Datei zuletzt lädt. Nach dem Umzug ins
Design System verliert sie. `.nc-section` verlor so seine Polsterung.

### 4 · Überladenes Molekül

Ein Molekül mit mehr als etwa acht Slots ist meist ein Organismus, der sich
nicht traut. Gegenprobe: Lässt es sich in zwei Teile schneiden, die jeder für
sich eine Aufgabe haben?

Umgekehrt: Ein Organismus mit zwei Slots ist meist ein Molekül.

### 5 · Rolle statt Aussehen

Der teuerste Fehler dieses Projekts war kein Einordnungsfehler, sondern ein
Rollenfehler: Ein Gattungsetikett nahm eine **interaktive** Fläche mit einer
**Akzent**-Schriftfarbe. Das ging gut, solange beide dasselbe Cyan waren.

Beim Einordnen immer mitprüfen, welche Rolle ein Baustein hat:

| Rolle | Bedeutet | Token |
|---|---|---|
| **Akzent** | Das ist *die* Handlung | `--accent-*` |
| **Interaktiv** | Man kann es anklicken | `--interactive-*` |
| **Rückmeldung** | Ein Zustand | `--feedback-*` |
| **Einordnung** | Ordnet ein, ruft nicht auf | Grauleiter |

## Arbeitsweise

Kein linearer Ablauf — nimm, was zur Lage passt.

### Beim Anlegen einer Komponente

1. Rolle bestimmen (Tabelle oben), dann Ebene (Entscheidungsregeln)
2. `npm run risiko -- <name>` — die drei Ursachen ausschließen
3. Anlegen, in `_index.scss` einhängen
4. **Prüfen, ob die Klasse im gebauten CSS ankommt** — eine Datei, die nicht
   eingehängt ist, wird gebaut und nie geladen
5. Die Gesamtstrecke: Konfig-App, Dokumentation, Storybook

### Beim Aufräumen einer Ebene

1. Bestand aufnehmen: Was liegt dort, was gehört woandershin?
2. Doppelungen und geteilte Namen suchen
3. Umzüge **einzeln**, jeder mit eigener Messung
4. Nach jedem Umzug: `npm run baseline:diff` — null Abweichung ist das Ziel,
   denn ein Umzug soll wirkungsgleich sein

> Bei einem Umzug ist **jede** Abweichung ein Fehler. Bei einer gewollten
> Änderung ist keine Abweichung verdächtig. Nicht verwechseln.

### Beim Prüfen eines Templates

Ein Template ohne echten Inhalt beweist wenig. Prüfe mit:

- der **längsten** realistischen Überschrift, nicht der schönsten
- einer leeren Liste und einer mit vierzig Einträgen
- fehlendem Bild, fehlendem Untertitel, fehlendem Aufruf
- beiden Themen und drei Breiten

## Ausgaben

Je nach Auftrag:

- **Einordnung je Baustein** mit Begründung in einem Satz
- **Abhängigkeitskarte** — was benutzt was, von Atom bis Seite
- **Befunde**: Doppelungen, geteilte Namen, überladene Moleküle, fehlende
  Grundbausteine
- **Reihenfolge für den Ausbau**, nach Abhängigkeit sortiert: Was von vielem
  benutzt wird, zuerst
- **HTML-Vorschau**, wenn eine Einordnung visuell zu entscheiden ist

## Qualitätsmaß

Nicht „ist die Einordnung richtig", sondern:

| Frage | Woran messbar |
|---|---|
| Ist der Baustein wiederverwendbar? | Auf wie vielen Seiten kommt er vor? Der Referenzstand weiß es. |
| Trägt er Kontext, den er nicht tragen sollte? | Enthält er Selektoren, die auf Eltern zeigen? |
| Gibt es ihn zweimal? | `npm run risiko` |
| Erreicht ihn ein Kundendesign? | `npm run drift:check` — „Nicht in der Konfig-App" |

## Nicht-Ziele

- Kein pixelgenauer Entwurf
- Keine Inhalte
- Keine Seiten ohne Systemlogik
- **Keine Auslegung der fünf Ebenen als Phasen.** Wer bei den Atomen anfängt
  und auf die Seite hinarbeitet, baut ein halbes Jahr an einer Bibliothek,
  bevor irgendjemand etwas sieht.
- Keine Zerlegung um ihrer selbst willen. Ein Molekül, das genau einmal
  vorkommt und nie wiederverwendet wird, war die Mühe nicht wert.

## Verwandt

`npm run risiko` · `npm run aufnehmen` · `npm run drift:check` ·
`npm run baseline:diff` · `FARB-FOUNDATION.md` · Skill `widersacher`
