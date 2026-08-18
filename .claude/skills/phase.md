---
name: phase
description: Implementiert genau EINE Phase aus einem Plan, verifiziert den Build und committet. Stoppt danach.
---
# Phase Skill

Implementiere exakt EINE Phase — nicht mehr. Kein Vorausplanen der naechsten Phase.

## 1. Plan identifizieren
- Suche nach dem aktiven Plan: PLAN.md, oder der zuletzt besprochene mehrstufige Plan im Kontext.
- Falls ein Argument uebergeben wurde (z.B. `/phase 3`), implementiere diese spezifische Phase.
- Ansonsten: identifiziere die NAECHSTE unerledigte Phase.
- Zeige dem User kurz an, welche Phase implementiert wird (1 Zeile).

## 2. Implementieren
- Lies JEDE Datei BEVOR du sie editierst.
- Schreibe Code direkt — keine erweiterte Analyse oder Exploration.
- Halte dich strikt an den Scope der Phase. Keine "Verbesserungen" ausserhalb des Plans.

## 3. Build verifizieren
- `npm run build:css` ausfuehren.
- Bei Fehlern: diagnostizieren und fixen. Loop bis der Build gruen ist.

## 4. Tests ausfuehren (wenn relevant)
- Falls SCSS geaendert: `npm run lint:tokens`
- Falls Recipes geaendert: `npm run lint:recipes`
- Falls umfangreiche Aenderungen: `npm test`
- Bei Fehlern: fixen und erneut testen.

## 5. Commit
- Relevante Dateien einzeln stagen (kein `git add .`).
- Commit-Message: `Phase N: <Beschreibung der Phase>`
- Co-Authored-By Zeile am Ende.

## 6. STOPPEN
- Dem User mitteilen, was implementiert wurde (kurze Zusammenfassung, max 5 Zeilen).
- Die naechste Phase NICHT planen oder beginnen.
- NICHT fragen "Soll ich mit Phase N+1 weitermachen?" — einfach stoppen.
