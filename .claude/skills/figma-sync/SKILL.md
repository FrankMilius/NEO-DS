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

## Export nach Figma: Tokens Studio (R08, 20.10.2026)

`npm run tokens:studio` erzeugt `data/design-tokens.tokens-studio.json` aus dem
DTCG-Export (Kern: `packages/tokens-studio-export`). Teil von `npm run tokens`;
die CI prüft mit `npm run tokens:studio:check`, dass die Datei aktuell ist und
jeder Verweis aufgelöst wird.

- Sets: `primitives`, `foundation` (die Werte hinter `--fnd-*`), `semantic`,
  `components`, dazu `semantic-dunkel` und `components-dunkel` (nur
  Dunkel-Werte). Themen: „NEO Hell“, „NEO Dunkel“ (Variante „Kunde“ fehlt
  bewusst, Entscheidung E3).
- Format „Legacy“ von Tokens Studio (`value`/`type`), Verweise `{pfad}`.
  CSS, das Figma nicht kennt (`var(…) var(…)`, `clamp(…)`), bleibt Text mit
  Typ `other` — Liste: `node scripts/export-tokens-studio.cjs --andere`.
- In Figma: Tokens Studio → Tools → Load from file → die Datei. Schreibt
  in die Figma-Datei — nur nach Rückfrage bei Frank.
- Rückweg: `--from-file` erwartet W3C-Format (`$value`) und ordnet grob ein;
  für diese Datei ist er noch kein Zweiweg (eigener Schritt).

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
