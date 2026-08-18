---
name: phase
description: Setzt genau EINE Phase aus einem Plan um, belegt sie mit ihrer Prüfschranke und committet. Stoppt danach, ohne die nächste Phase anzufangen oder anzubieten. Aufrufen nach /plan, oder mit Nummer (/phase 3).
---

# Phase

Genau **eine** Phase. Nicht mehr, auch wenn die nächste offensichtlich ist.

Der Sinn der Beschränkung ist nicht Ordnung, sondern Zuordenbarkeit: Wenn zwei
Phasen in einem Durchgang laufen und danach etwas kaputt ist, weiß niemand,
welche es war. Genau deshalb schneidet `/plan` die Phasen so, dass jede für
sich messbar ist.

## 1 · Phase bestimmen

Der Plan liegt in `.claude/plans/JJJJ-MM-TT-<kurzname>.md` — sonst ist es der
zuletzt besprochene mehrstufige Plan im Verlauf.

- Mit Argument (`/phase 3`): diese Phase.
- Ohne: die nächste, die noch keine abgehakte Prüfschranke hat.

Eine Zeile an den Nutzer, welche Phase läuft. Keine Zusammenfassung des Plans —
er kennt ihn.

## 2 · Umsetzen

- **Jede Datei lesen, bevor sie geändert wird.** Ohne Ausnahme.
- Strikt im Zuschnitt der Phase bleiben. Was dir nebenbei auffällt, gehört in
  `BACKLOG.md`, nicht in diesen Commit.
- Der Plan nennt Dateien mit Repo. Design System und Theme sind getrennt —
  eine SCSS-Änderung erreicht die Website erst über `npm run sync:drupal`.

> **Keine Verbesserungen außerhalb des Plans.** Sie sind der häufigste Grund,
> weshalb eine Prüfschranke danach nicht mehr eindeutig ist: Schlägt sie an,
> war es die Phase oder die Verbesserung?

## 3 · Prüfschranke

**Die Prüfschranke steht im Plan.** Sie ist der Maßstab, nicht diese Liste hier.
Was unten steht, ist das Minimum, wenn der Plan nichts Genaueres sagt:

| Geändert | Pflicht |
|---|---|
| SCSS, Token | `npm run build:css`, dann `npm run sync:drupal`, `ddev drush cr` |
| irgendetwas Sichtbares | Referenzstand + `npm run kontrast -- <neu> --gegen <alt>` |
| eine Verschiebung ohne gewollte Wirkung | `npm run baseline:diff` — **null Abweichung** |
| Farben, Flächen | `npm run artefakt` |
| Zustände, Navigation | `npm run zustand` |
| Recipes | `npm run lint:recipes` · Token: `npm run lint:tokens` |
| neuer Skill, Agent, Regel | `npm run skills` |

Bei einer **Verschiebung** ist jede Abweichung ein Fehler. Bei einer **gewollten
Änderung** ist keine Abweichung verdächtig. Nicht verwechseln — das ist der
Unterschied zwischen „wirkungsgleich" und „wirkungslos".

Schlägt die Prüfschranke an: diagnostizieren und beheben, nicht committen.
Ein roter Stand im Verlauf kostet später mehr als die Wartezeit jetzt.

## 4 · Committen

Nach den Regeln aus `/commit` — die gelten hier unverändert:

- Einzeln stagen, nie `git add -A`, wenn Fremdes im Baum liegt
- Nachricht über Datei (`git commit -F`), **nie** mit Rückwärtsschrägstrichen
  in der Kommandozeile
- `git -C <pfad>`, nicht `cd`

**Die Überschrift nennt den Grund, nicht die Nummer.** `Phase 3` sagt in sechs
Monaten nichts; `fix(nav): Haarlinie ans Panel, nicht an die Leiste` sagt alles.
Wenn der Plan Phasen nummeriert, gehört die Nummer in den Rumpf.

In den Rumpf gehört außerdem **die Ausgabe der Prüfschranke** — die Zahl, die
belegt, dass es funktioniert hat.

## 5 · Stoppen

Kurz melden: was gilt jetzt, was hat es belegt, was bleibt offen.

Dann **aufhören**. Die nächste Phase nicht planen, nicht vorbereiten, nicht
anbieten. Nicht fragen, ob weitergemacht werden soll — der Plan ist die Antwort
darauf, und der Nutzer ruft `/phase` erneut, wenn er so weit ist.

## Verwandt

`/plan` · `/commit` · `/widersacher` (wenn die Phase eine Behauptung enthält,
die man widerlegen können muss)
