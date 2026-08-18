---
name: figma-sync
description: Synchronisiert Design Tokens und Komponenten-Varianten zwischen Figma und dem NEO Design System.
---

# Figma Sync Skill

Synchronisiert Design Tokens und Komponenten-Varianten zwischen Figma und dem NEO Design System.

## Trigger
`/figma-sync [--pull|--diff|--components|--import=file.json]`

## Voraussetzungen
- `.env` Datei mit `FIGMA_TOKEN` und `FIGMA_FILE_KEY` (siehe `.env.example`)
- Figma-Datei mit Tokens Studio Plugin oder nativen Figma Variables

## Ablauf

### Mode: --pull (Standard)
1. Figma Variables API abrufen → `data/figma-tokens.json`
2. Transformiere in NEO Format (Primitives, Semantic)
3. Diff gegen aktuelles `data/design-tokens.json`
4. Bei Änderungen: Merge durchführen
5. `npm run tokens` → SCSS regenerieren
6. `npm run build:css` → CSS kompilieren
7. `npm run test:unit` → Tests prüfen

### Mode: --diff
Wie --pull, aber ohne Merge. Zeigt nur Änderungen an.

### Mode: --components
1. Figma Components API abrufen
2. Map Figma-Varianten → Recipe Axes
3. Identifiziere:
   - Bestehende Recipes die Figma-Varianten fehlen
   - Figma-Komponenten ohne Recipe (→ Scaffold-Kandidaten)

### Mode: --import=file.json
1. Tokens Studio JSON-Datei lesen
2. W3C DTCG Format → NEO Format transformieren
3. Diff + optional Merge

## Workflow: Neue Figma-Variante → Recipe

```
1. Designer erstellt neue Button-Variante "ghost" in Figma
2. /figma-sync --components
   → Erkennt: button hat neue Variante "ghost" ohne Recipe-Mapping
3. /sync-recipe button
   → Ergänzt "ghost" als neuen Axis-Wert + Specimen
4. /publish-storybook
   → Story wird automatisch generiert
```

## Pipeline
```
Figma (Tokens Studio / Variables)
  ↓ figma-sync.mjs --pull
data/figma-tokens.json
  ↓ diff + merge
data/design-tokens.json
  ↓ generate-tokens.js
scss/scss/00-settings/_tokens-*.generated.scss
  ↓ sass
styles.css
  ↓ bind-mount
Drupal (piipe-workplace.ddev.site)
```

## Regeln
- NIEMALS `design-tokens.json` ohne Diff überschreiben
- Bei Pull: Immer zuerst Diff anzeigen, dann fragen ob Merge
- Figma ist nicht die einzige Quelle — manuell definierte Tokens in design-tokens.json behalten
- Nach jedem Merge: `npm run tokens && npm run build:css && npm run test:unit`
