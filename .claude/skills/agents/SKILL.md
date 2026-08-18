---
name: agents
description: Startet das Agent-Netzwerk (Orchestrator → Builder → Tester → Documenter → Reporter).
---

# Agents Skill

Startet das Agent-Netzwerk (Orchestrator → Builder → Tester → Documenter → Reporter).

## Trigger
`/agents [--quick|--full|--changed=file.scss]`

## Modi

| Modus | Command | Was passiert |
|-------|---------|-------------|
| **Auto** | `/agents` | Erkennt geänderte Dateien seit letztem Commit, führt nur relevante Checks aus |
| **Quick** | `/agents --quick` | Nur Builder (Build + Lint), kein Test/Docs (~5s) |
| **Full** | `/agents --full` | Komplette Pipeline inkl. Dashboard-Snapshot (~30s) |
| **Single** | `/agents --changed=file.scss` | Nur Checks relevant für diese eine Datei |

## Pipeline-Ablauf

```
Orchestrator
├── Phase 1: Builder (5s)
│   ├── Token Generation
│   ├── CSS Build
│   ├── Token Sync Check
│   ├── Token Lint
│   └── Recipe Lint
├── Phase 2: Tester (10s)
│   ├── Unit Tests (Vitest)
│   ├── Pipeline Guard
│   ├── Fragment Lint
│   ├── Script Lint
│   └── Vue Tests (wenn .vue geändert)
├── Phase 3: Documenter (14s)
│   ├── Story Generator (107 Recipes → Stories)
│   ├── Docs Token Lint
│   ├── Dashboard Snapshot
│   └── Changelog Entry
├── Phase 3.5: Widersacher (nur wenn Phase 1-3 etwas gemeldet haben)
│   ├── npm run artefakt -- <vorher> <nachher>   Messfehler ausschliessen
│   ├── Bei Fertigmeldungen: npm run widerlegen  Auslieferung statt Quelle
│   └── Ergebnis: WIDERLEGT | TEILWEISE | kein Gegenbeweis
│
└── Phase 4: Reporter
    ├── Konsolidierter Report
    ├── Empfehlungen bei Failures
    └── JSON Export → data/dashboard/last-pipeline-run.json
```

## Kontextbezogene Ausführung

| Geänderte Datei | Builder | Tester | Documenter |
|-----------------|---------|--------|------------|
| `*.scss` | Build + Lint + Sync | Vitest + Pipeline | Docs Lint |
| `*-recipe.json` | Recipe Lint | Vitest | Stories regenerieren |
| `*.js/*.mjs` | — | Fragment + Script Lint | — |
| `*.vue` | — | Vue Tests | — |
| `--full` Flag | Alles | Alles | Alles + Dashboard |

## Output

Report wird gespeichert als `data/dashboard/last-pipeline-run.json` und zeigt:
- Status pro Agent (pass/warn/fail)
- Einzelergebnisse pro Check
- Empfohlene Maßnahmen bei Failures
- Gesamtdauer

## Regeln
- Builder-Failure bei CSS-Build → Pipeline stoppt (Tester braucht gültigen Build)
- Token-Generation-Failure ist non-blocking (warn, nicht fail)
- Quick-Modus überspringt Tester und Documenter
- Bei --full: Dashboard-Snapshot wird automatisch erstellt

## Phase 3.5 — der Widersacher

Läuft **nur**, wenn eine der Phasen davor einen Befund gemeldet hat. Er
bestätigt nicht; er versucht zu widerlegen.

| Auslöser | Aufruf |
|---|---|
| Eine Messung meldet Abweichungen | `npm run artefakt -- <vorher> <nachher>` |
| Eine Änderung gilt als umgesetzt | `npm run widerlegen -- --token <name>` |
| Eine Regel gilt als gesetzt | `npm run widerlegen -- --klasse <selektor>` |
| Eine Aussage betrifft Hover/Fokus | `npm run widerlegen -- --zustand <sel> hover <eigenschaft>` |

**Er bekommt bewusst nur die Behauptung, nicht den Weg dorthin.** Wer die
Begründung kennt, übernimmt sie — dann prüft er die Herleitung statt das
Ergebnis. Als eigener Agent (`.claude/agents/widersacher.md`) ist diese
Trennung gegeben.

**Sperre:** Meldet der Widersacher `VERDAECHTIG`, wird nichts zurückgenommen
und nichts als fertig gemeldet, bevor neu gemessen wurde. Das ist die einzige
Phase, die den Ablauf anhalten darf.

**Warum es diese Phase gibt:** Der Ablauf oben findet Fehler im Code. Er
findet keine Fehler in der *Schlussfolgerung*. Genau dort lagen die teuersten:
eine als abgeschlossen gemeldete Palettenumstellung, die zur Hälfte wirkungslos
war; Element-Stile auf einer Klasse ohne Träger; ein zweimal behandeltes
Symptom, dessen Ursache eine eigene frühere Änderung war.
