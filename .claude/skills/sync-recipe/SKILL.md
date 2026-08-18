---
name: sync-recipe
description: Synchronisiert ein Recipe JSON mit der Konfig-App (Lab Arena + Inspector/Token-Registry).
---

# Sync Recipe Skill

Synchronisiert ein Recipe JSON mit der Konfig-App (Lab Arena + Inspector/Token-Registry).

## Trigger
`/sync-recipe <component-name>` (z.B. `/sync-recipe accordion`)

## Ablauf

### 1. Recipe lesen & validieren
- Lies `data/<component-name>-recipe.json`
- Extrahiere: version, axes, specimens, tokenGroups, anatomy, a11y
- Prüfe JSON-Validität und Vollständigkeit (alle Pflichtfelder vorhanden?)

### 2. Lab Arena aktualisieren
- Datei: `apps/theme-configurator/src/components/laboratory/<ComponentName>Arena.vue`
- Gleiche ab: Sind alle `specimens` aus dem Recipe als Vue-Komponenten/Render-Blöcke vorhanden?
- Sind alle `axes` als konfigurierbare Props/Toggles implementiert?
- Fehlende Specimens → generiere HTML-Struktur aus `anatomy` + `specimens[].config`
- Fehlende Axes → ergänze Toggles/Selects im Arena-Header

### 3. Token-Registry aktualisieren
- Datei: `apps/theme-configurator/src/data/tokens.generated.js`
- Prüfe: Sind alle `tokenGroups` aus dem Recipe als Subgroups im Token-Registry-Eintrag vorhanden?
- Fehlende Token-Gruppen → ergänze in der richtigen Komponenten-Sektion
- Prüfe Token-IDs gegen `scss/scss/00-settings/_component-tokens.scss`

### 4. Recipe Loader prüfen
- Datei: `apps/theme-configurator/src/composables/useRecipeLoader.js`
- Prüfe: Ist der Recipe-Import für `<component-name>` vorhanden?
- Falls nicht → ergänze lazy import in RECIPE_IMPORTS Map

### 5. Pipeline-Sync verifizieren
- Führe `node scripts/sync-component-tokens.js --check` aus
- Bei Drift: zeige Differenzen und frage ob `--fix` ausgeführt werden soll

### 6. Zusammenfassung ausgeben
- Tabelle: Was war aktuell, was wurde ergänzt, was hat Drift
- Build-Ergebnis: `npm run build:css` Status

## Regeln
- NIEMALS Recipe-JSON verändern — nur die Konfig-App wird angepasst
- Lies JEDE Datei vor dem Editieren
- Bei Unsicherheit über Anatomy/HTML-Struktur: frage nach statt zu raten
- Immer `npm run build:css` am Ende ausführen
