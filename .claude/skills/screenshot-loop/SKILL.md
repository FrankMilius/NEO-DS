---
name: screenshot-loop
description: Automatische visuelle QA: Screenshot erstellen, gegen Referenz vergleichen, Abweichungen fixen, wiederholen.
---

# Screenshot Loop Skill

Automatische visuelle QA: Screenshot erstellen, gegen Referenz vergleichen, Abweichungen fixen, wiederholen.

## Trigger
`/screenshot-loop [--rounds=2] [--reference=path/to/reference.png]`

Wird automatisch von `/frontend-design` aufgerufen wenn Visual References vorhanden sind.

## Ablauf

### 1. Referenz-Check
- Prüfe ob `web_design_references/` Ordner existiert und Bilder enthält
- Falls ja: nutze als Vergleichsreferenz
- Falls nein: nutze die erste generierte Version als Baseline

### 2. Screenshot erstellen
- Nutze Playwright MCP: `mcp__playwright__browser_navigate` → `mcp__playwright__browser_take_screenshot`
- Screenshot speichern in `screenshots/loop-round-{N}.png`

### 3. Visueller Vergleich
- Screenshot gegen Referenz vergleichen (oder vorherige Iteration)
- Identifiziere Abweichungen:
  - Farb-Differenzen
  - Spacing/Layout-Unterschiede
  - Fehlende Elemente
  - Typografie-Abweichungen
  - Responsive Breakpoint-Probleme

### 4. Fix-Runde
- CSS/HTML-Korrekturen basierend auf identifizierten Abweichungen
- Nur die Abweichungen fixen, nicht den Rest ändern

### 5. Wiederholen
- Erneut Screenshot erstellen
- Erneut vergleichen
- Standard: 2 Runden (konfigurierbar via `--rounds`)
- Abbruch wenn keine Abweichungen mehr gefunden

### 6. Report
```
🔄 Screenshot Loop: 2 Rounds
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Round 1: 5 Abweichungen gefunden, 5 gefixt
Round 2: 1 Abweichung gefunden, 1 gefixt
Final:   0 Abweichungen

Screenshots: screenshots/loop-round-1.png, screenshots/loop-round-2.png
```

## Integration mit anderen Skills

### In CLAUDE.md einbinden:
```markdown
## Visual QA
- When generating frontend code, run `/screenshot-loop` after completion
- Visual references: @web_design_references/
- Screenshots: @screenshots/
```

### Kombination mit `/frontend-design`:
1. `frontend-design` Skill generiert Code
2. `screenshot-loop` macht visuellen QA-Check
3. Fixes werden automatisch angewendet
4. Ergebnis: Design näher an der Referenz

## Regeln
- Playwright MCP muss verfügbar sein
- Screenshots immer in `screenshots/` speichern (nicht im Root)
- Maximal 5 Runden (Endlos-Loops vermeiden)
- Bei >3 Abweichungen nach Runde 3: stoppen und User fragen
