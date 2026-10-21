# Skill Development Rules

## Skill Creator (installiert)

Nutze den `skill-creator` Plugin um neue Skills zu erstellen und bestehende zu verbessern.

### Neuen Skill erstellen
```
/skill-creator
```
Beschreibe die gewünschte Capability → Skill Creator generiert SKILL.md + Tests + Evaluation.

### Bestehenden Skill verbessern
```
Improve the /evaluate-component skill — it should also check for CSS-only animation opportunities
```
Skill Creator analysiert den bestehenden Skill, testet ihn und generiert eine verbesserte Version.

## Skill-Architektur (NEO Design System)

### Projekt-Skills (13 Stück)
Alle in `.claude/skills/<name>/SKILL.md`:
- `/commit` — Git Commit Workflow
- `/plan` — Implementierungsplanung
- `/test` — Kontextbezogene Tests
- `/collateral-check` — Kollateralschaden-Prüfung
- `/sync-recipe` — Recipe → Konfig-App Sync
- `/create-drupal-block` — Drupal Block erstellen
- `/analyze-competitor` — Wettbewerber-Analyse
- `/audit-pipeline` — Pipeline-Gesundheitscheck
- `/publish-storybook` — Storybook Build + Deploy
- `/figma-sync` — Figma Token Sync
- `/evaluate-component` — Component Research + Evaluation
- `/dashboard` — Quality Dashboard KPIs
- `/agents` — Agent Network Pipeline

### Regel: CLAUDE.md vs Skills
- **CLAUDE.md** = Projekt-spezifische Regeln ("In diesem Projekt...")
- **Skills** = Wiederverwendbare Workflows (projektübergreifend)
- Skills sollen CLAUDE.md lesen, nicht Regeln daraus duplizieren
- Workflows gehören in Skills, nicht in CLAUDE.md

## Superpowers (seit 21.10.2026)

Zusätzlich zu den Projekt-Skills liegen zwölf Superpowers-Skills (obra/superpowers,
MIT) in `~/.claude/skills/`, mit dem Wegweiser `neo-superpowers` (Vorrang,
Zuordnung, Aktualisierung). Projekt-Skills haben Vorrang.

- Neue oder geänderte Skills nach `writing-skills` prüfen: erst ohne Skill mit
  einem Subagenten das Fehlverhalten beobachten, dann den Skill schreiben,
  dann mit Subagent erneut prüfen.
- Danach `npm run skills`.

## Benutzer-Skills außerhalb des Repositorys (seit 21.10.2026)

In `~/.claude/skills/` (für jede Sitzung, auch in `~/Documents/WEBSITE26`, wo
die Projekt-Skills nicht geladen werden): `neo-superpowers` mit den
Superpowers-Skills und `punkt-starten` (Worktree, Zweig, `STAND.md` je
Roadmap-Punkt). Arbeitssitzungen im Worktree-Ordner starten — nur dort sind
die Projekt-Skills geladen.

