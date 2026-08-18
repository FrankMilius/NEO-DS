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
