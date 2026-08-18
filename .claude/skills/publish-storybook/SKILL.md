---
name: publish-storybook
description: Regeneriert Stories aus Recipes, baut Storybook und deployt.
---

# Publish Storybook Skill

Regeneriert Stories aus Recipes, baut Storybook und deployt.

## Trigger
`/publish-storybook [--deploy] [--bump=patch|minor|major]`

## Ablauf

### 1. CSS Build sicherstellen
- `npm run build:css` — Storybook preview.js lädt `styles.css`

### 2. Stories regenerieren
- `npm run generate:stories` — Alle 107 Recipes → Stories
- Prüfe Output: Anzahl generierter Stories berichten

### 3. Storybook Build
- `npm run build-storybook` — Statischer Build nach `storybook-static/`
- Prüfe auf Build-Fehler

### 4. Version bumpen (optional, wenn --bump)
- Aktualisiere `version` in `package.json` (Semver bump)
- Git commit: `chore: bump design system to vX.Y.Z`
- Git tag: `vX.Y.Z`

### 5. Deploy (optional, wenn --deploy)
- Push nach `gh-pages` Branch
- Oder: `npx storybook-deployer --ci`
- URL berichten

### 6. Zusammenfassung
```
📖 Storybook Published
  Version:  1.2.0
  Stories:  107 (atoms: 15, molecules: 12, organisms: 80)
  Build:    storybook-static/ (4.2MB)
  URL:      https://neocosmo.github.io/neo-design-system/
```

## Regeln
- Immer `npm run build:css` VOR Stories-Generierung
- Immer `npm run generate:stories` VOR Storybook Build
- Build-Fehler abfangen und berichten
- `storybook-static/` NICHT committen (in .gitignore)
