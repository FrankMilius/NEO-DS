---
name: fertig-pruefen
description: Fertig-Gate vor jeder Fertigmeldung und vor dem Zweig-Commit „(…, Freigabe ausstehend)“ — führt mit npm run pruefen:alles alle nötigen Prüfungen aus (npm test, ci:lokal mit e2e, Bildvergleich, Pixelvergleich der Website, Modul-e2e; Auswahl nach Änderungen), hält bei Website-Unterschieden an und lässt die Fertigmeldung danach vom Widersacher widerlegen. Ein Bericht statt fünf Einzelläufen.
---

# Fertig prüfen

Eine Phase ist erst fertig, wenn ein **frischer** Lauf es belegt und jemand
ohne Kenntnis des Wegs versucht hat, es zu widerlegen. Dieser Skill macht
beides in einem Durchgang.

## 1 · Gate laufen lassen

```bash
npm run pruefen:alles -- --nur-zeigen     # erst ansehen, was laufen wird
npm run pruefen:alles                     # dann laufen lassen (im Hintergrund)
```

Die Auswahl richtet sich nach den Änderungen gegen `main`; `--alle` erzwingt
alle fünf, `--ohne <prüfung>` lässt eine weg — nur mit Grund, und der Grund
gehört in die Fertigmeldung. Dauer: nur Text ~2 min, Code ~6 min, SCSS mit
Pixelvergleich und Modul ~15 min. Den Lauf im Hintergrund starten und nicht
nebenher an denselben Dateien weiterarbeiten.

`pruefen:modul` ändert Drupal (App im Modul, Test-Themes) — das ist im
Ablauf vorgesehen. Bricht es mit Ausgang 2 ab (Zweig passt nicht), nennt es
den Umschaltbefehl: **nicht selbst umschalten**, Frank fragen.

## 2 · Bericht lesen

`.pruefen/fertig-<zeit>/bericht.md`: Gesamturteil, je Prüfung Grund,
Ergebnis, Kennzahl, Dauer, Protokoll.

- **ROT:** nicht melden, sondern `systematic-debugging` an der ersten roten
  Prüfung (Protokoll daneben). Danach das Gate erneut — ganz, nicht nur die
  rote Prüfung, weil eine Korrektur Nachbarn trifft.
- **HALTEPUNKT (E6):** Der Pixelvergleich zeigt Unterschiede auf der Website.
  **Sofort anhalten** und Frank die Seiten zeigen (Bilder unter `pixel/`),
  zusammen mit der Frage, ob die Phase laut `STAND.md` die Website ändern
  darf. Auch bei gewollter Änderung entscheidet Frank.
- **GRÜN:** weiter mit 3.

## 3 · Widersacher

Die Fertigmeldung als **eine** Behauptung formulieren, mit den Kennzahlen aus
„Beleg für den Commit-Rumpf“ — z. B. „Phase 2 von E4 ist fertig: npm test 214
passed, ci:lokal 25 Schritte grün, Website 0 von 71 Seiten verändert“.
Dann den Subagenten `widersacher` mit **nur dieser Behauptung** und dem Pfad
des Berichts starten, nicht mit dem Weg dorthin.

- Widerlegt: Befund beheben, zurück zu 1.
- Nicht widerlegt: melden — Behauptung, Kennzahlen, Pfad des Berichts, und
  was der Widersacher geprüft hat.

## 4 · Weiter

Vor dem Zweig-Commit gilt der Haltepunkt aus `/phase`: Überschrift, Dateien
und die Kennzahlen aus dem Bericht vorlegen; der Schutz-Hook fragt dann
nach. Die Kennzahlen gehören in den Commit-Rumpf.

## Verwandt

`/phase` (ruft diesen Skill als Prüfschranke) · `/widersacher` ·
`verification-before-completion` · `scripts/pruefen/README.md`
