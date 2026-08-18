---
name: test
description: Führt kontextbezogene Tests aus — erkennt welche Dateien geändert wurden und führt nur relevante Tests aus.
---

# Test Skill

Führt kontextbezogene Tests aus — erkennt welche Dateien geändert wurden und führt nur relevante Tests aus.

## Trigger
`/test [--all] [--scope=scss|recipes|unit|lint]`

## Ablauf

### 1. Geänderte Dateien erkennen
- `git diff --name-only HEAD` → Liste der geänderten Dateien
- Kategorisiere: SCSS, Recipe JSON, Vue, JS, Twig

### 2. Tests nach Kontext auswählen

| Geändert | Tests |
|----------|-------|
| `scss/**/*.scss` | `npm run build:css` + `npm run lint:tokens` + `npx vitest run tests/scss/` |
| `data/*-recipe.json` | `npx vitest run tests/recipes/` + `npm run lint:recipes` |
| `apps/**/*.vue` | `cd apps/theme-configurator && npm run test` |
| `scripts/*.js` | `npm run lint:docs-scripts` |
| `_component-tokens.scss` | `npm run tokens:sync:check` + `npx vitest run tests/scss/` |
| `--all` Flag | `npm test` (komplette Test-Suite) |

### 3. Ergebnisse berichten

Format:
```
🧪 Test Results (context: SCSS + Recipes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CSS Build:        OK (823KB)
✅ Token Lint:       0 violations
✅ Unit Tests:       28/28 passed
✅ Recipe Lint:      107/107 valid
⏱️  Duration:        8.2s
```

### 4. Bei Fehlern
- Zeige den genauen Fehler mit Datei + Zeile
- Schlage einen Fix vor (wenn offensichtlich)
- Frage ob der Fix angewendet werden soll

## Regeln
- Ohne `--all`: nur relevante Tests ausführen (schnell!)
- Mit `--all`: komplette Suite (`npm test`)
- Immer `npm run build:css` zuerst, wenn SCSS geändert wurde
- Zeige Ausführungszeit pro Test-Gruppe
