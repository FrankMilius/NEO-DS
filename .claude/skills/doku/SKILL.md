---
name: doku
description: Lässt den Doku-Agenten Commit-Rumpf, README-Eintrag der Konfig-App, Roadmap-Eintrag und die BEGRIFFE.md-Prüfung neuer Oberflächentexte entwerfen und legt die Entwürfe Frank vor. Aufrufen nach grünem /fertig-pruefen, vor dem Zweig-Commit „(…, Freigabe ausstehend)“.
---

# Doku

Dieselbe Information entsteht sonst viermal von Hand: Commit-Text,
README-Eintrag, BEGRIFFE.md, Roadmap. Der Agent `doku` entwirft alle vier
aus einer Quelle (Diff, `STAND.md`, Gate-Bericht).

## 1 · Voraussetzung

Ein grüner Lauf von `/fertig-pruefen` (`npm run pruefen:alles`) — der
Agent übernimmt dessen Kennzahlen in den Commit-Rumpf. Ohne grünen Bericht
nicht aufrufen.

## 2 · Agent starten

Subagent `doku` mit: Worktree-Pfad, Basis (`main`), Pfad des letzten
Berichts `.pruefen/fertig-*/bericht.md`. Er ändert nichts und liefert vier
Abschnitte: Commit · README · Begriffe · Roadmap.

## 3 · Vorlegen und übernehmen

Frank in **einer** Nachricht vorlegen — das ist zugleich die Vorlage für den
Haltepunkt vor dem Zweig-Commit (E6):

- **Begriffe:** `npm run doku:begriffe` liefert **Hinweise**, kein Urteil —
  Ausgang 1 heißt nur „es gibt etwas einzuordnen“. Der Agent ordnet jeden
  Hinweis ein (Verstoß · im Zusammenhang richtig · neuer Begriff). Verstöße
  vor dem Commit beheben (Oberflächentext oder, nach Franks Ja, BEGRIFFE.md);
  die übrigen nennen, nicht wegdiskutieren.
- **README:** nach Franks Ja einfügen und mit committen.
- **Commit:** Nachricht über Datei (`git commit -F`); der Schutz-Hook fragt
  beim Zweig-Commit nach.
- **Roadmap:** erst **nach** der Freigabe schreiben (`ArtifactData`, Sammlung
  `eintraege`), mit dem endgültigen Hash.

Entwürfe sind Vorschläge: Was Frank ändert, gilt.

## Verwandt

`/fertig-pruefen` · `/phase` · `/commit` · Agent `doku` ·
`npm run doku:begriffe` · `apps/theme-configurator/BEGRIFFE.md`
