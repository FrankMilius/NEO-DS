# Kategorien je Reportinggegenstand

Die ursprüngliche Fassung kannte vier Kategorien für einen PHP/Vue-Stack:
FEAT, REFA, RSRCH, FIX. Zwei Probleme damit — es gibt in diesem Projekt kein
PHP, und vier Kategorien über acht Domänen sagen überall dasselbe, also
nirgends etwas.

Diese Fassung fragt je Domäne das, was **dort** über Fortschritt entscheidet.

## Die vier Grundarten

Sie gelten überall und werden aus dem Commit-Betreff gelesen:

| Kürzel | Was | Woran erkennbar |
|---|---|---|
| **NEU** | Etwas gibt es jetzt, das es vorher nicht gab | `feat`, `add` |
| **UM** | Dasselbe anders — gleiche Wirkung, bessere Form | `refactor`, `move` |
| **FIX** | Etwas war falsch | `fix`, `korrektur`, `revert` |
| **WEG** | Etwas ist fort, und das ist das Ergebnis | `remove`, `delete`, `cleanup` |

> **WEG ist keine Unterkategorie von UM.** Das Löschen des Card-Atoms war die
> Arbeit dieses Tages: 377 Zeilen weniger, null Abweichung. Wer Löschen als
> Aufräumnebenprodukt führt, bekommt nie zu sehen, dass es die eigentliche
> Leistung war.

## Design System

| Frage | Warum sie zählt |
|---|---|
| Neue Komponenten — auf welcher ITCSS-Ebene? | Viele neue Atome bei wenigen Organismen heißt: gebaut wird Vorrat, nicht Bedarf |
| Token neu oder umgewidmet? | Umgewidmete Token sind die riskanteste Änderung überhaupt — sie wirken überall auf einmal |
| Wurzelklassen doppelt geführt? | `npm run risiko -- --ds` |
| Rollenfehler: Akzent, Interaktiv, Rückmeldung, Einordnung? | Der teuerste Fehler des Projekts war ein Rollenfehler, kein Einordnungsfehler |

## Konfig-App

| Frage | Warum sie zählt |
|---|---|
| Neue einstellbare Gruppen | Eine Komponente ohne Eintrag kann kein Kunde anpassen |
| Abstand DS-Komponenten zu Konfig-Gruppen | Wächst der Abstand, entkoppelt sich das System still |
| Token, die es gibt, die aber niemand einstellen kann | `npm run drift:check` |

## Theme

| Frage | Warum sie zählt |
|---|---|
| Neue oder geänderte Twig-Templates | Hier entsteht, was Besucher sehen |
| Überschreibungen in `neo-overrides.css` | Jede ist eine stille Aushebelung des Design Systems |
| Rückstand `composer.lock` | Ohne Nachzug setzt das nächste `composer install` alles zurück |

## Messstände & Werkzeuge

| Frage | Warum sie zählt |
|---|---|
| Neue Prüfungen | Jede Prüfung ist eine Klasse von Fehlern, die künftig auffällt |
| Referenzstände erzeugt | Ein Stand ohne Vergleich ist ein Stand ohne Aussage |
| Prüfungen, die nie anschlagen | Entweder ist alles gut — oder sie prüfen das Falsche |

## Dokumentation

| Frage | Warum sie zählt |
|---|---|
| Komponenten ohne Recipe | Was nicht beschrieben ist, wird zweimal gebaut |
| Recipes, die weniger Klassen führen als die Komponente | Zwölf sind bekanntermaßen unvollständig |
| Begründungen in Commits | Was im Diff steht, braucht keinen Text; der Grund schon |

## Storybook

| Frage | Warum sie zählt |
|---|---|
| Komponenten ohne Story | Unsichtbar heißt ungeprüft |
| Stories mit Randfällen — leer, sehr lang, ohne Bild | Eine Story mit schönem Beispielinhalt beweist nichts |

## Drupal-Site

| Frage | Warum sie zählt |
|---|---|
| Config-Exporte | Nicht exportierte Konfiguration existiert nur auf einer Maschine |
| Neue Blocktypen und Felder | Was die Redaktion selbst kann, muss niemand nachpflegen |

## Agenten & Skills

| Frage | Warum sie zählt |
|---|---|
| Skills unversioniert oder nicht ladbar | `npm run skills` — beides war schon still der Fall |
| Skills, die nie aufgerufen wurden | Ein Skill, den niemand nutzt, ist Beschreibung, kein Werkzeug |

## Zugänglichkeit — quer über alles

Kein eigener Gegenstand, sondern eine Bedingung: **WCAG 2.1 AA bei jeder
Farb- und Token-Änderung, für alle Objekte, in beiden Themen, vor produktiv.**
In der Bilanz erscheint sie als Befund, nicht als Kategorie — weil sie kein
Fortschrittsmaß ist, sondern eine Schranke.
