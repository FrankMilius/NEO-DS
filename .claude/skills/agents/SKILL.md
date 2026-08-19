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
| **Widersacher** | `/agents --widersacher` | Erzwingt Phase 3.5 auch ohne Befund |

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
│   ├── Token-Namen aus den Befunden ziehen (höchstens 4)
│   ├── npm run widerlegen -- --token <name> --streng
│   └── Urteil: WIDERLEGT | VERDAECHTIG | KEIN-GEGENBEWEIS
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

`agents/widersacher.mjs`, aufgerufen zwischen Documenter und Reporter.

> **Bis zum 19.08.2026 stand diese Phase nur hier, nicht im Ablauf.** Der Text
> beschrieb sie über zwanzig Zeilen, `agents/orchestrator.mjs` kannte sie
> nicht — `grep widersacher` fand null Treffer. Dieselbe Lücke zwischen Zusage
> und Wirklichkeit wie beim Hero-Recipe, das `nc-hero--split` beschrieb, ohne
> dass es die Klasse gab.

### Wann sie läuft

| Lage | Verhalten |
|---|---|
| Phase 1–3 melden nichts | übersprungen, mit Begründung im Report |
| Befunde ohne Token-Bezug | übersprungen — sie erfindet keine Behauptung |
| `--quick` | übersprungen |
| `--widersacher` | läuft, auch wenn alles grün ist |

### Was sie prüft

Steckt in einem Befund ein Token-Name, dann steckt darin die Behauptung
**„dieses Token existiert und wirkt"**. Genau die lässt sich widerlegen:
`npm run widerlegen -- --token <name> --streng` sieht nicht in die Quelle,
sondern in die **Auslieferung**.

Drei Urteile, maschinenlesbar in der letzten Zeile (`URTEIL <wort> <anzahl>`):

| Urteil | Bedeutung | Folge |
|---|---|---|
| `WIDERLEGT` | keine Deklaration im ausgelieferten CSS, oder kein Träger für den Geltungsbereich | **Sperre**, Rückgabecode 1 |
| `VERDAECHTIG` | mehr als eine Datei setzt das Token — eine Änderung an der falschen bleibt wirkungslos | Warnung |
| `KEIN-GEGENBEWEIS` | hier nicht gescheitert | weiter |

> **`--streng` musste erst gebaut werden.** `widerlegen.js` endete bis dahin
> **immer** mit 0, auch wenn es etwas widerlegt hatte. Für einen Menschen am
> Bildschirm reicht das — der liest den Text. Ein Dirigent sieht nur den
> Rückgabecode und hielte jede Widerlegung für einen Erfolg. Die Vorgabe
> bleibt 0, damit bestehende Aufrufe unverändert laufen.

### Grenzen, die ausgesprochen werden

- **Höchstens vier Behauptungen je Lauf.** Jede kostet einen Browserstart und
  rund fünf Sekunden. Bleibt etwas liegen, sagt sie es — eine stille Deckelung
  liest sich wie Vollständigkeit.
- **Ohne laufende Website prüft sie nichts** und meldet das als Warnung, nicht
  als Entlastung. Ein Fehlurteil wäre schlimmer als eine Fehlanzeige.
- **Nur Token.** `--klasse` und `--zustand` brauchen einen Selektor, den kein
  Lint-Befund hergibt. Wer sie will, ruft sie von Hand auf.

### Die Sperre

Meldet sie `WIDERLEGT`, endet der Lauf mit Rückgabecode 1 und einem eigenen
Block im Bericht. Nichts gilt als fertig und nichts wird zurückgenommen, bevor
neu gemessen wurde. Das ist die einzige Phase, die den Ablauf anhalten darf.

**Warum es sie gibt:** Der Ablauf davor findet Fehler im Code. Er findet keine
Fehler in der *Schlussfolgerung*. Genau dort lagen die teuersten: eine als
abgeschlossen gemeldete Palettenumstellung, die zur Hälfte wirkungslos war;
Element-Stile auf einer Klasse ohne Träger; ein zweimal behandeltes Symptom,
dessen Ursache eine eigene frühere Änderung war.

**Beim ersten Lauf hat sie geliefert:** drei `--nc-type-caption-*` werden von
`styles.css` **und** `neo-overrides.css` gesetzt — und Letzteres lädt später.
Beide stehen heute auf demselben Wert, es fällt also nichts auf. Ändert jemand
den Wert im Design System, verschluckt ihn die Überschreibung stillschweigend.
Das ist exakt das Muster, mit dem die Slate-Palette vier Tage überlebt hat.

## Was dieser Ablauf NICHT ist

**Kein Agentennetzwerk.** Builder, Tester, Documenter und Reporter sind
`.mjs`-Module, die npm-Befehle in Reihenfolge ausführen — kein eigener
Kontext, kein eigenes Modell, kein eigenes Urteil. Für Build und Lint ist ein
deterministischer Läufer genau richtig und einem Sprachmodell überlegen.

Der einzige echte Agent ist der Widersacher (`.claude/agents/widersacher.md`),
und auch er wird hier über sein **Werkzeug** aufgerufen, nicht als Subagent:
Der Dirigent ist ein Node-Skript und kann keinen starten. Als Agent existiert
er für den Aufruf aus einer Sitzung heraus — dort bekommt er bewusst nur die
Behauptung, nicht den Weg dorthin.

Wer den Ablauf zu einem Netzwerk ausbauen will, sollte zuerst fragen, wo
wirklich **geurteilt** werden muss. „Läuft der Build durch" braucht kein
Urteil. „Hält diese Schlussfolgerung" schon.
