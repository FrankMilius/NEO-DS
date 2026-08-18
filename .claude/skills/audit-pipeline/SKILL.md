---
name: audit-pipeline
description: Führt einen umfassenden Pipeline-Audit durch: Token-Sync, CSS-Build, Drupal-Integration, Recipe-Coverage.
---

# Audit Pipeline Skill

Führt einen umfassenden Pipeline-Audit durch: Token-Sync, CSS-Build, Drupal-Integration, Recipe-Coverage.

## Trigger
`/audit-pipeline [--fix] [--scope=tokens|css|drupal|recipes|all]`

Beispiel: `/audit-pipeline --scope=all`

## Ablauf

### 1. Token-Sync prüfen
- Führe `node scripts/sync-component-tokens.js --check` aus
- Vergleiche: Tokens in `_component-tokens.scss` ↔ `tokens.generated.js`
- Berichte: Fehlende Tokens, überflüssige Tokens, Typ-Mismatches
- Bei `--fix`: Führe `--fix` Mode aus

### 2. CSS-Build prüfen
- Prüfe ob `styles.css` älter als neueste `.scss`-Datei ist
- Führe `npm run build:css` aus und prüfe auf Fehler
- Vergleiche Dateigröße mit letztem bekannten Build
- Prüfe auf `@import`-Statements (sollen `@use/@forward` sein)

### 3. Token-Lint
- Führe `npm run lint:tokens` aus
- Berichte: Hardcodierte Werte (Farben, Shadows, Font-Weights, Z-Index, Opacity)
- Zeige exakte Dateien und Zeilennummern

### 4. Recipe-Coverage prüfen
- Scanne `data/*-recipe.json` Dateien
- Für jedes Recipe prüfe:
  - Ist ein Arena-Component vorhanden? (`apps/theme-configurator/src/components/laboratory/<Name>Arena.vue`)
  - Ist ein Import in `useRecipeLoader.js` vorhanden?
  - Sind die `tokenGroups` in `tokens.generated.js` abgebildet?
- Berichte: Recipes ohne Arena, Arenas ohne Recipe, Token-Lücken

### 5. Drupal-Integration prüfen (wenn --scope=drupal oder all)
- Prüfe Docker Bind-Mounts:
  - `styles.css` → Drupal `css/styles.css` (Timestamp-Vergleich)
  - `data/custom-theme.json` Existenz
  - `data/theme-overrides.css` Existenz
- Prüfe Drupal Block-Typen:
  - Für jeden `neo_*` Block-Typ: existieren beide Twig-Templates?
  - Ist die `neo_theme_preprocess_block()` Funktion aktuell?
- Prüfe Config-Sync:
  - `ddev drush config:status` — sind Config-Änderungen nicht exportiert?

### 6. Report generieren

Format:
```
╔══════════════════════════════════════╗
║        PIPELINE AUDIT REPORT        ║
╚══════════════════════════════════════╝

Token Sync:     ✅ 2091/2091 synchronized
CSS Build:      ✅ styles.css aktuell (248KB)
Token Lint:     ⚠️  3 hardcoded values found
Recipe Coverage: ✅ 18/18 recipes have arenas
Drupal Sync:    ⚠️  2 configs not exported

──────────────────────────────────────
DETAILS
──────────────────────────────────────
[Details pro Kategorie]
```

## Regeln
- Nur berichten, nicht automatisch fixen (außer mit --fix Flag)
- Exit-Code 0 = alles OK, Exit-Code 1 = Probleme gefunden
- Immer die konkreten Dateien und Zeilennummern nennen
- Bei Drupal-Prüfungen: `ddev drush` verwenden, vorher prüfen ob DDEV läuft
