# NEO Design System — Dev Process Acceleration
## Schulungspräsentation Phase 1–6

---

# AGENDA

1. **Phase 1:** Testing Foundation & CI/CD
2. **Phase 2:** Storybook Integration
3. **Phase 3:** Figma Pipeline
4. **Phase 4:** Research Agent
5. **Phase 5:** Quality Dashboard
6. **Phase 6:** Agent-Netzwerk

---

# ÜBERBLICK: WAS WURDE GEBAUT?

| Metrik | Vorher | Nachher |
|--------|--------|---------|
| **Automatisierte Tests** | 0 | 28 Unit Tests |
| **Storybook Stories** | 0 | 107 auto-generiert |
| **CI/CD Pipelines** | 0 | 2 GitHub Actions |
| **Quality KPIs** | 0 | 10 automatisiert |
| **Custom Skills** | 4 | 13 |
| **Agents** | 0 | 4 (Builder, Tester, Documenter, Reporter) |
| **Figma Integration** | 0 | API-Sync + Import |
| **Quality Score** | Unbekannt | **97/100** |

---

# PHASE 1: Testing Foundation & CI/CD

---

## Phase 1 — Konzept & Grundlagen

### Warum zuerst Tests?
- **Ohne Tests ist jede Automatisierung riskant** — wir wissen nicht ob Änderungen etwas kaputt machen
- Tests sind das **Fundament** auf dem Phase 2–6 aufbauen
- Design Systems haben besondere Test-Anforderungen:
  - Token-Konsistenz (SCSS → CSS → Browser)
  - Recipe-Validität (JSON-Schema)
  - CSS-Output-Qualität (keine hardcodierten Werte)

### Technologie-Entscheidung
| Option | Pro | Con | Entscheidung |
|--------|-----|-----|-------------|
| **Vitest** | Schnell, ESM-native, Vite-kompatibel | Kein Browser-Testing | **✅ Gewählt** |
| Jest | Großes Ökosystem | Langsam, CJS-fokussiert | ❌ |
| Playwright | Visual Regression | Overhead für Unit Tests | Für Phase 2+ |

---

## Phase 1 — Was wurde implementiert

### 1. SCSS Token Tests (`tests/scss/tokens.test.mjs`)
- **16 Tests** prüfen den kompilierten CSS-Output:
  - Foundation Tokens (`--fnd-spacing-*`, `--fnd-color-*`, `--fnd-font-weight-*`)
  - Component Tokens (`--nc-button-*`, `--nc-input-*`, `--nc-nav-*`)
  - Keine Legacy `--ds-*` Tokens mehr
  - SCSS↔CSS Synchronisation (>80% Coverage)
  - CSS-Dateigröße: 150–1000KB
  - `!important` Budget: max 60 Vorkommen
  - Build kompiliert fehlerfrei

### 2. Recipe Schema Tests (`tests/recipes/recipe-schema.test.mjs`)
- **12 Tests** validieren alle 107 Recipe-JSON-Dateien:
  - Gültiges JSON
  - Pflichtfelder: `meta.component`, `meta.schemaVersion`
  - Empfohlene Felder: `anatomy`, `axes`, `specimens`, `tokenGroups`
  - Specimen↔Axis Konsistenz (Specimens referenzieren nur definierte Axes)
  - TokenGroup-IDs existieren in `_component-tokens.scss`
  - Alle Recipes in `useRecipeLoader.js` registriert (>70%)

### 3. GitHub Actions CI/CD (`.github/workflows/ci.yml`)
- Läuft bei jedem Push/PR auf main
- Pipeline: Build → Tests → Lint → Report

---

## Phase 1 — Vollständige Modi-Referenz

### Skill: `/test`

**Syntax:**
```
/test [--all] [--scope=scss|recipes|unit|lint]
```

#### 5 verfügbare Modi

| Modus | Command | Was wird ausgeführt | Dauer |
|-------|---------|---------------------|-------|
| **Auto** | `/test` (ohne Flags) | Erkennt geänderte Dateien, führt nur relevante Tests aus | 3–8s |
| **All** | `/test --all` | Komplette Test-Suite (`npm test`) | 15–20s |
| **Scope: scss** | `/test --scope=scss` | `build:css` + `lint:tokens` + `vitest tests/scss/` | 5–8s |
| **Scope: recipes** | `/test --scope=recipes` | `vitest tests/recipes/` + `lint:recipes` | 3–5s |
| **Scope: unit** | `/test --scope=unit` | Nur `vitest run` (alle Unit Tests) | 3–5s |
| **Scope: lint** | `/test --scope=lint` | `lint:tokens` + `lint:recipes` + `lint:fragments` + `lint:docs-scripts` | 4–6s |

---

#### Modus: Auto (Standard, ohne Flags)

**Was passiert:**
1. `git diff --name-only HEAD` — erkennt welche Dateien geändert wurden
2. Kategorisiert: SCSS, Recipe JSON, Vue, JS, Twig
3. Führt nur die Tests aus, die für die geänderten Dateitypen relevant sind

**Kontextbezogene Test-Auswahl:**

| Geänderte Datei | Ausgeführte Tests |
|-----------------|-------------------|
| `*.scss` | `build:css` + `lint:tokens` + `vitest tests/scss/` |
| `*-recipe.json` | `vitest tests/recipes/` + `lint:recipes` |
| `*.vue` | `cd apps/theme-configurator && npm run test` |
| `*.js/*.mjs` (scripts) | `lint:docs-scripts` |
| `_component-tokens.scss` | `tokens:sync:check` + `vitest tests/scss/` |

**Wann verwenden:** Nach jeder Code-Änderung als schneller Feedback-Loop.

**Beispiel:**
```
# Du hast _button.scss geändert
/test
→ 🧪 Test Results (context: SCSS)
→ ✅ CSS Build: OK (825KB)
→ ✅ Token Lint: 0 violations
→ ✅ Unit Tests: 16/16 passed
→ ⏱️ Duration: 5.2s
```

---

#### Modus: `--all` (Komplette Suite)

**Was passiert:**
Führt die gesamte `npm test` Pipeline aus — identisch mit dem CI/CD-Gate:
1. `npm run test:build` (CSS kompilieren)
2. `npm run test:unit` (Vitest)
3. `npm run pipeline:check` (Pipeline Guard)
4. `npm run tokens:sync:check` (Token Sync)
5. `npm run lint:tokens` (Hardcoded Values)
6. `npm run lint:docs-tokens` (Docs Token)
7. `npm run lint:fragments` (HTML Fragments)
8. `npm run lint:docs-scripts` (Script Lint)
9. `npm run lint:recipes` (Recipe Lint)

**Wann verwenden:** Vor einem Commit oder PR — sicherstellen dass nichts kaputt ist.

**Beispiel:**
```
/test --all
→ 🧪 Test Results (full suite)
→ ✅ CSS Build: OK (825KB)
→ ✅ Unit Tests: 28/28 passed
→ ✅ Pipeline Guard: OK
→ ✅ Token Sync: In sync
→ ✅ 5 Lint checks passed
→ ⏱️ Duration: 18.3s
```

---

#### Modus: `--scope=scss`

**Was passiert:**
1. `npm run build:css` — CSS kompilieren
2. `npm run lint:tokens` — Keine hardcodierten Farben/Shadows/Font-Weights
3. `npx vitest run tests/scss/` — 16 Token-Integrity-Tests

**Wann verwenden:** Nach SCSS-Änderungen — prüft ob der CSS-Output korrekt ist.

**Beispiel:**
```
/test --scope=scss
→ ✅ CSS Build: OK (825KB)
→ ✅ Token Lint: 0 violations
→ ✅ SCSS Tests: 16/16 passed (Spacing, Colors, Typography, Shadows, Z-Index)
```

---

#### Modus: `--scope=recipes`

**Was passiert:**
1. `npx vitest run tests/recipes/` — 12 Schema-Validierungs-Tests
2. `npm run lint:recipes` — Recipe JSON Lint

**Wann verwenden:** Nach Recipe-Änderungen — prüft JSON-Integrität und Axis-Konsistenz.

**Beispiel:**
```
/test --scope=recipes
→ ✅ 107 Recipes valid JSON
→ ✅ Required fields present (>80%)
→ ✅ Specimen→Axis consistency OK
→ ✅ TokenGroups → SCSS coverage >80%
```

---

### Skill: `/collateral-check`

**Syntax:**
```
/collateral-check [--component=<name>] [--verbose]
```

#### 3 verfügbare Modi

| Modus | Command | Was wird geprüft | Dauer |
|-------|---------|------------------|-------|
| **Auto** | `/collateral-check` | Alle geänderten Dateien seit HEAD~1 | 10–20s |
| **Component** | `/collateral-check --component=button` | Nur Abhängigkeiten einer Komponente | 5–10s |
| **Verbose** | `/collateral-check --verbose` | Auto + detaillierter CSS-Diff | 15–25s |

---

#### Modus: Auto (Standard)

**Was passiert:**
1. `git diff --name-only HEAD~1..HEAD` — geänderte Dateien identifizieren
2. Token-Kaskade traversieren: geänderter Token → welche Komponenten nutzen ihn?
3. Mixin-Abhängigkeiten: geänderter Mixin → alle `@include`-Stellen finden
4. CSS-Diff: Größenvergleich vorher/nachher
5. Automatische Tests ausführen

**Report enthält:**
```
🔍 Collateral Check Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Geänderte Dateien: 3
Potenziell betroffene Komponenten: 8
  ⚠️ input (nutzt form-control-base Mixin)
  ⚠️ select (nutzt form-control-base Mixin)
  ✅ card (keine Abhängigkeit)
CSS-Diff: 823KB → 825KB (+2KB)
Tests: 28/28 passed ✅
Empfehlung: Prüfe Input und Select visuell.
```

**Wann verwenden:** Nach Änderungen an Foundation-Tokens, Mixins oder generischen Elementen.

**Beispiel:**
```
# Du hast den form-control-base Mixin geändert
/collateral-check
→ ⚠️ 6 Komponenten betroffen: input, select, textarea, otp-input, checkbox, radio
→ Empfehlung: Visuell prüfen ob Padding/Border sich korrekt verhält
```

---

#### Modus: `--component=<name>`

**Was passiert:**
1. Identifiziert alle Tokens, Mixins und Variablen die die Komponente nutzt
2. Prüft ob diese in den letzten Änderungen modifiziert wurden
3. Rückwärts-Suche: Welche Foundation-Tokens referenziert die Komponente?

**Wann verwenden:** Vor dem Release einer spezifischen Komponente — sicherstellen dass keine externe Änderung sie beeinflusst hat.

**Beispiel:**
```
/collateral-check --component=modal
→ modal nutzt: --nc-dialog-* (25 Tokens), focus-ring Mixin, surface-elevated Token
→ Letzte Änderungen: --fnd-color-surface-elevated wurde am 2026-03-24 geändert
→ ⚠️ Modal Backdrop könnte betroffen sein — visuell prüfen
```

---

#### Modus: `--verbose`

**Was passiert:** Wie Auto, aber zusätzlich:
- Vollständiger CSS-Diff (alle geänderten Selektoren + Properties)
- Token-Abhängigkeits-Baum als ASCII-Tree
- Mixin-Nutzungsliste mit Dateipfad + Zeilennummer

**Wann verwenden:** Wenn du den genauen Impact einer Änderung verstehen willst.

**Beispiel:**
```
/collateral-check --verbose
→ Token-Baum:
  --fnd-spacing-04 (geändert)
    ├── --fnd-spacing-element (referenziert)
    │   ├── --nc-button-padding-x (button)
    │   ├── --nc-input-padding-x-md (input)
    │   └── --nc-form-field-gap (form-field)
    └── --fnd-spacing-gutter (referenziert)
        └── --nc-grid-gap (grid)
→ CSS-Diff: 14 Selektoren geändert
→ .nc-button { padding: 12px → 16px }  ← PRÜFEN
```

---

## Phase 1 — Pro & Con

| Pro | Con |
|-----|-----|
| ✅ 28 Tests decken Token-Integrität + Recipe-Konsistenz ab | ⚠️ Keine Visual Regression Tests (Pixel-Vergleich) |
| ✅ CSS-Build wird bei jedem Test verifiziert | ⚠️ Test Coverage nur auf SCSS-Output, nicht auf Mixin-Logik |
| ✅ Recipe-Validierung fängt JSON-Fehler früh ab | ⚠️ Kein Browser-basiertes Testing |
| ✅ CI/CD verhindert kaputte Merges | ⚠️ Schwellwerte (Toleranzen) sind initial großzügig |

---

## Phase 1 — Praxisbeispiele

### Beispiel 1: Token-Vollständigkeit prüfen
```bash
npm run test:unit
```
**Szenario:** Du fügst einen neuen Spacing-Token `--fnd-spacing-14` hinzu.
Der Test `enthält Spacing-Tokens` prüft ob er im CSS-Output erscheint.
Fehlt er → Test schlägt fehl → CI blockiert den Merge.

### Beispiel 2: Recipe-Validierung nach Änderung
```bash
npx vitest run tests/recipes/
```
**Szenario:** Du erweiterst `accordion-recipe.json` um eine neue Axis `media`.
Der Test prüft ob alle Specimens die neue Axis korrekt referenzieren.
Ungültige Axis-Referenz → `Specimen "X" uses undefined axis "media"`.

### Beispiel 3: Automatische CI-Prüfung
**Szenario:** Du pushst SCSS-Änderungen.
GitHub Actions führt automatisch aus: `npm run agents:full`
- Build CSS ✅ → Token Lint ✅ → Unit Tests ✅ → PR bekommt grünes Häkchen
- Build Fail ❌ → PR wird blockiert → Fehler wird in Job Summary angezeigt

---

# PHASE 2: Storybook Integration

---

## Phase 2 — Konzept & Grundlagen

### Warum Storybook?
- **Single Source of Truth für Komponenten-Dokumentation**
- Visuelles Testing (A11y, Viewport, Theme-Wechsel)
- Teilbar mit Designern, PMs, Stakeholdern (ohne Code-Zugriff)
- Auto-generiert aus bestehenden Recipe-JSONs

### Architektur-Entscheidung
| Option | Pro | Con | Entscheidung |
|--------|-----|-----|-------------|
| `@storybook/html-vite` | Framework-agnostisch, SCSS direkt | Kein Vue-Rendering | **✅ Gewählt** |
| `@storybook/vue3-vite` | Vue-Komponenten rendern | Bindet an Vue-Framework | ❌ |
| Custom Docs (bestehend) | Bereits vorhanden | Nicht teilbar, keine Interaktion | ❌ |

**Begründung:** Das Design System ist HTML+SCSS-basiert (BEM-Klassen). Vue ist nur für die Konfig-App. Storybook soll die CSS-Komponenten dokumentieren, nicht die Vue-App.

---

## Phase 2 — Was wurde implementiert

### 1. Recipe→Story Auto-Generator (`scripts/generate-stories.mjs`)
- Liest alle 107 `data/*-recipe.json` Dateien
- Generiert Storybook Stories in 3 Layer-Ordnern:
  - `stories/atoms/` (16 Stories)
  - `stories/molecules/` (15 Stories)
  - `stories/organisms/` (76 Stories)
- Pro Recipe wird generiert:
  - **Default Story** — Grundlegende Anatomy
  - **Specimen Stories** — Bis zu 8 Varianten aus dem Recipe
  - **ArgTypes** — Axis-Werte als Storybook Controls
  - **Auto-Docs** — Version, Status, A11y-Infos aus dem Recipe

### 2. Storybook Konfiguration
- **Theme Toggle** (4 Themes: NEO Light/Dark, Customer Light/Dark)
- **Viewport Presets** (Mobile 375px, Tablet 768px, Desktop 1280px, Wide 1600px)
- **A11y Addon** — Automatische WCAG-Prüfung pro Story
- **styles.css wird geladen** — Echte Token-Werte im Preview

### 3. CI/CD Deploy (`deploy-storybook.yml`)
- Trigger: Push auf main mit Recipe/SCSS/Story-Änderungen
- Pipeline: `generate:stories` → `build-storybook` → GitHub Pages

---

## Phase 2 — Vollständige Modi-Referenz

### Skill: `/publish-storybook`

**Syntax:**
```
/publish-storybook [--deploy] [--bump=patch|minor|major]
```

#### 4 verfügbare Modi

| Modus | Command | Was passiert | Dauer |
|-------|---------|-------------|-------|
| **Standard** | `/publish-storybook` | Stories regenerieren + Build | 20–30s |
| **Deploy** | `/publish-storybook --deploy` | + Deploy auf GitHub Pages | 30–60s |
| **Bump Patch** | `/publish-storybook --bump=patch` | Version 1.0.0 → 1.0.1 + Git Tag | 25–35s |
| **Bump Minor** | `/publish-storybook --bump=minor` | Version 1.0.0 → 1.1.0 + Git Tag | 25–35s |
| **Bump Major** | `/publish-storybook --bump=major` | Version 1.0.0 → 2.0.0 + Git Tag | 25–35s |

**Flags sind kombinierbar:** `/publish-storybook --bump=minor --deploy`

---

#### Modus: Standard (ohne Flags)

**Was passiert:**
1. `npm run build:css` — CSS aktualisieren
2. `npm run generate:stories` — 107 Recipes → Stories
3. `npm run build-storybook` — Statischer Build → `storybook-static/`
4. Report: Anzahl Stories, Build-Größe

**Wann verwenden:** Lokaler Test — Storybook bauen ohne zu deployen.

**Beispiel:**
```
/publish-storybook
→ ✅ CSS Build: 825KB
→ 📖 107 stories generated (16 atoms, 15 molecules, 76 organisms)
→ 📦 Storybook Build: storybook-static/ (4.2MB)
→ Fertig. Lokal testen: npx http-server storybook-static
```

---

#### Modus: `--deploy`

**Was passiert:** Standard + zusätzlich:
5. Push nach `gh-pages` Branch
6. GitHub Pages URL berichten

**Wann verwenden:** Nach einem Sprint — aktualisiertes Storybook für Designer/PMs bereitstellen.

**Beispiel:**
```
/publish-storybook --deploy
→ 📖 107 stories generated
→ 📦 Build: 4.2MB
→ 🚀 Deployed to: https://neocosmo.github.io/neo-design-system/
```

---

#### Modus: `--bump=patch|minor|major`

**Was passiert:** Standard + zusätzlich:
5. Version in `package.json` bumpen (Semver)
6. Git Commit: `chore: bump design system to vX.Y.Z`
7. Git Tag: `vX.Y.Z`

| Bump | Wann | Beispiel |
|------|------|---------|
| `patch` | Bugfixes, Token-Korrekturen | 1.0.0 → 1.0.1 |
| `minor` | Neue Varianten, neue Komponenten | 1.0.0 → 1.1.0 |
| `major` | Breaking Changes (Token-Umbenennung, API-Änderung) | 1.0.0 → 2.0.0 |

**Beispiel:**
```
/publish-storybook --bump=minor --deploy
→ 📖 107 stories
→ 📦 Version: 1.0.0 → 1.1.0
→ 🏷️ Git Tag: v1.1.0
→ 🚀 Deployed to: https://neocosmo.github.io/neo-design-system/
```

### npm Scripts (direkt nutzbar)

| Script | Identisch zu |
|--------|-------------|
| `npm run generate:stories` | Nur Stories regenerieren |
| `npm run storybook` | Dev-Server starten (Port 6006) |
| `npm run build-storybook` | Stories + Build (ohne Deploy) |

---

## Phase 2 — Pro & Con

| Pro | Con |
|-----|-----|
| ✅ 107 Stories automatisch aus Recipes — kein manueller Aufwand | ⚠️ HTML-Rendering ist statisch (keine JS-Interaktion in Stories) |
| ✅ Theme-Wechsel in der Toolbar | ⚠️ Specimen-HTML wird generiert — nicht immer pixel-perfekt |
| ✅ A11y-Addon prüft WCAG automatisch | ⚠️ Kein Vue-Component-Testing in Storybook |
| ✅ Teilbar via GitHub Pages URL | ⚠️ Storybook 8.6 — Version 10 wäre neuer, braucht Node 22.12+ |

---

## Phase 2 — Praxisbeispiele

### Beispiel 1: Neues Recipe → automatisch eine Story
```bash
# 1. Neues Recipe erstellen
vim data/tooltip-recipe.json

# 2. Stories regenerieren
npm run generate:stories
# → 📖 108 stories generated

# 3. Storybook starten
npm run storybook
# → http://localhost:6006 → Atoms/Tooltip erscheint
```

### Beispiel 2: Theme-Testing im Browser
**Szenario:** Du willst prüfen ob der Button in allen 4 Themes korrekt aussieht.
1. Öffne `http://localhost:6006` → Atoms → Button
2. Klicke auf das Theme-Dropdown in der Toolbar
3. Wechsle zwischen NEO Light → NEO Dark → Customer Light → Customer Dark
4. Jeder Wechsel wendet die CSS Theme-Klasse an — Token-Werte ändern sich live

### Beispiel 3: A11y-Prüfung in Storybook
**Szenario:** Du öffnest die Checkbox-Story.
1. Klicke auf den "Accessibility" Tab im Bottom Panel
2. Storybook zeigt automatisch: Violations (rot), Passes (grün), Incomplete (gelb)
3. Beispiel-Violation: "Color contrast ratio 3.2:1 is below AA threshold of 4.5:1"
4. Du fixst den Kontrast in `_component-tokens.scss` → Story wird automatisch aktualisiert

---

# PHASE 3: Figma Pipeline

---

## Phase 3 — Konzept & Grundlagen

### Warum Figma-Integration?
- **Designer arbeiten in Figma, Entwickler im Code** — ohne Sync driftet beides auseinander
- Token-Werte (Farben, Spacing, Typografie) sollen **eine einzige Quelle** haben
- Neue Komponenten-Varianten aus Figma sollen automatisch in Recipes fließen

### Pipeline-Architektur
```
Figma (Tokens Studio / Variables API)
  ↓ figma-sync.mjs --pull
data/figma-tokens.json (Rohexport)
  ↓ Transform + Diff + Merge
data/design-tokens.json (Single Source of Truth)
  ↓ generate-tokens.js
scss/scss/00-settings/_tokens-*.generated.scss
  ↓ sass
styles.css → Drupal
```

### API-Limitierung
| Feature | Professional Plan | Enterprise Plan |
|---------|------------------|-----------------|
| File Content lesen | ✅ | ✅ |
| Styles lesen (Colors, Text) | ✅ | ✅ |
| Components lesen | ✅ | ✅ |
| Variables lesen/schreiben | ❌ | ✅ |

**Workaround:** Tokens Studio Plugin für JSON-Export/-Import statt Variables API.

---

## Phase 3 — Was wurde implementiert

### 1. Figma Sync Script (`scripts/figma-sync.mjs`)
**4 Modi:**
| Modus | Command | Funktion |
|-------|---------|----------|
| Pull | `npm run figma:pull` | Figma API → Styles/Colors → Diff → Merge |
| Diff | `npm run figma:diff` | Nur Vergleich, kein Merge |
| Components | `npm run figma:components` | Figma-Varianten → Recipe-Mapping |
| Import | `npm run figma:import -- --from-file=X.json` | Tokens Studio JSON importieren |

### 2. Diff-Engine
- Vergleicht Figma-Export mit `design-tokens.json`
- Zeigt: Added (🟢), Modified (🟡), Removed (🔴)
- Merge nur nach Bestätigung

### 3. Component→Recipe Mapping
- Erkennt: Welche Figma-Komponenten haben ein Recipe?
- Identifiziert: Neue Varianten ohne Recipe-Mapping

---

## Phase 3 — Vollständige Modi-Referenz

### Skill: `/figma-sync`

**Syntax:**
```
/figma-sync [--pull|--diff|--components|--import=file.json]
```

**Voraussetzung:** `.env` mit `FIGMA_TOKEN` und `FIGMA_FILE_KEY`.

#### 4 verfügbare Modi

| Modus | Command | Internet | Schreibt Dateien | Dauer |
|-------|---------|----------|-----------------|-------|
| **Pull** | `/figma-sync --pull` | ✅ Figma API | ✅ design-tokens.json | 5–15s |
| **Diff** | `/figma-sync --diff` | ✅ Figma API | ❌ Nur Report | 5–10s |
| **Components** | `/figma-sync --components` | ✅ Figma API | ❌ Nur Report | 3–5s |
| **Import** | `/figma-sync --import=file.json` | ❌ Lokal | Optional Merge | 1–3s |

---

#### Modus: `--pull` (Figma → Design Tokens)

**Was passiert:**
1. Figma File API abrufen (Styles + Components)
2. Styles nach Typ kategorisieren (FILL → Colors, TEXT → Typography, EFFECT → Shadows)
3. Style-Nodes auflösen: Node-IDs → tatsächliche Farbwerte/Typo-Werte
4. Diff gegen aktuelles `data/design-tokens.json`
5. Merge: Geänderte/neue Tokens in `design-tokens.json` schreiben
6. `data/figma-tokens.json` (Rohexport) + `data/figma-resolved.json` (aufgelöste Werte) speichern

**Report enthält:**
```
🔄 Fetching Figma File (Styles + Components)...
   📄 File: "neo-ds" (v2334831689677192591)
   🎨 Styles: 48

📊 Figma Styles aufgelöst:
   Farben:      32
   Typografie:  12
   Effekte:     4

📊 Token Diff: 5 Änderungen
   🟢 Hinzugefügt (2): brand.tertiary.500, neutral.50
   🟡 Geändert (3): accent.500, spacing-06, radius-lg
```

**Wann verwenden:** Wenn der Designer Tokens in Figma aktualisiert hat und du die Änderungen in den Code übernehmen willst.

**Beispiel:**
```
/figma-sync --pull
→ 5 Token-Änderungen gemergt
→ Nächste Schritte:
   npm run tokens        # SCSS regenerieren
   npm run build:css     # CSS kompilieren
   npm run test:unit     # Tests prüfen
```

---

#### Modus: `--diff` (Nur Vergleich)

**Was passiert:**
1. Figma API abrufen (identisch zu --pull)
2. Diff berechnen
3. **Kein Merge** — nur Report anzeigen
4. Exit-Code: 0 wenn synchron, 1 wenn Differenzen

**Wann verwenden:**
- In CI/CD: "Warnung wenn Figma und Code auseinanderdriften"
- Vor Pull: Erst schauen was sich ändert, bevor man mergt
- Regelmäßiger Drift-Check (z.B. wöchentlich)

**Beispiel:**
```
/figma-sync --diff
→ 📊 Token Diff: 3 Änderungen
→   🟡 accent.500: #37e93d → #2dd636
→   🟢 neutral.50: (neu)
→   🔴 deprecated.old-blue: (entfernt)
→ Exit-Code: 1 (nicht synchron)
```

---

#### Modus: `--components` (Figma → Recipe Mapping)

**Was passiert:**
1. Figma Components API abrufen
2. Jede Figma-Komponente gegen `data/*-recipe.json` matchen
3. Figma-Properties (Varianten) gegen Recipe-Axes vergleichen
4. Report: Bestehende Recipes, neue Komponenten ohne Recipe

**Report enthält:**
```
📦 Figma Components → Recipes (24):
  🔄 Bestehende Recipes (18):
     button — 5 Varianten in Figma
     card — 3 Varianten in Figma
     accordion — 7 Varianten in Figma
  🆕 Neue Komponenten ohne Recipe (6):
     tooltip (Tooltip)
     skeleton (Skeleton Loader)
     progress (Progress Bar)
```

**Wann verwenden:** Nach größeren Design-Updates in Figma — identifiziere welche Komponenten ein Recipe brauchen.

**Beispiel:**
```
/figma-sync --components
→ 6 neue Figma-Komponenten ohne Recipe
→ Nächster Schritt: /sync-recipe tooltip (Recipe scaffolden)
```

---

#### Modus: `--import=file.json` (Tokens Studio Import)

**Was passiert:**
1. JSON-Datei lesen (Tokens Studio W3C DTCG Format)
2. In NEO Token-Format transformieren
3. Diff gegen `design-tokens.json` anzeigen
4. Optional: Merge (mit Bestätigung)

**Wann verwenden:** Wenn du keinen Figma API-Zugang hast oder die Variables API (Enterprise-only) brauchst. Designer exportiert manuell aus Tokens Studio Plugin.

**Beispiel:**
```
/figma-sync --import=~/Downloads/tokens-export.json
→ 📥 Tokens Studio Datei importiert
→ 📊 Diff: 12 Änderungen (8 Farben, 3 Spacing, 1 Radius)
→ Merge durchführen? (nutze --pull mit --apply)
```

### npm Scripts (direkt nutzbar)

| Script | Identisch zu |
|--------|-------------|
| `npm run figma:pull` | `--pull` Modus |
| `npm run figma:diff` | `--diff` Modus |
| `npm run figma:components` | `--components` Modus |
| `npm run figma:import -- --from-file=X.json` | `--import` Modus |

---

## Phase 3 — Pro & Con

| Pro | Con |
|-----|-----|
| ✅ Bidirektionale Pipeline (Figma↔Code) konzipiert | ⚠️ Push nach Figma nur über Tokens Studio Plugin (nicht API) |
| ✅ Diff-Engine verhindert ungewollte Überschreibungen | ⚠️ Variables API nicht verfügbar (Professional Plan) |
| ✅ Tokens Studio Import als Fallback | ⚠️ Manueller Export aus Figma nötig (kein Auto-Sync) |
| ✅ Component Mapping identifiziert Lücken | ⚠️ Figma-Datei muss erst befüllt werden |

---

## Phase 3 — Praxisbeispiele

### Beispiel 1: Farb-Token aus Figma synchronisieren
```bash
# 1. Figma Credentials konfigurieren
cp .env.example .env
# FIGMA_TOKEN und FIGMA_FILE_KEY eintragen

# 2. Diff anzeigen (ohne Merge)
npm run figma:diff
# → 📊 Token Diff: 12 Änderungen
#   🟢 Hinzugefügt: brand.tertiary.500
#   🟡 Geändert: accent.500: #37e93d → #2dd636

# 3. Pull + Merge
npm run figma:pull
# → design-tokens.json aktualisiert
# → npm run tokens && npm run build:css
```

### Beispiel 2: Tokens Studio JSON importieren
```bash
# 1. In Figma: Tokens Studio → Export → JSON-Datei speichern

# 2. Import
npm run figma:import -- --from-file=~/Downloads/tokens-export.json
# → 📥 Importiere Tokens Studio Datei
# → 📊 Token Diff: 8 Änderungen
```

### Beispiel 3: Figma-Komponenten → Recipe Mapping
```bash
npm run figma:components
# → 📦 Figma Components → Recipes (24):
#   🔄 Bestehende Recipes (18): button, card, accordion...
#   🆕 Neue Komponenten ohne Recipe (6): tooltip, skeleton, progress...
# → Aktion: Recipe für neue Komponenten mit /sync-recipe scaffolden
```

---

# PHASE 4: Research Agent

---

## Phase 4 — Konzept & Grundlagen

### Warum ein Research Agent?
- **Bisher:** Gemini-Evaluationen manuell erstellt und 1:1 als Prompts kopiert
- **Problem:** Zeitaufwändig, inkonsistente Qualität, kein strukturiertes Format
- **Lösung:** `/evaluate-component` Skill der automatisch recherchiert, vergleicht und konkrete Vorschläge generiert

### Evaluationsframework
```
Aktuelles Recipe lesen
  ↓ (parallel)
┌────────────┬──────────────┬──────────────┬──────────────┐
│ UX Research│ Design System│ ARIA/WCAG    │ CSS Trends   │
│ (NNg,      │ Benchmarks   │ Compliance   │ (@starting-  │
│  Baymard)  │ (Radix,Carbon│ (W3C, MDN)   │  style, etc) │
│            │  Ant, Shadcn)│              │              │
└────────────┴──────────────┴──────────────┴──────────────┘
  ↓
Gap-Analyse (NEO vs. Markt)
  ↓
Evaluation Report (data/evaluations/<name>-<date>.md)
```

---

## Phase 4 — Was wurde implementiert

### `/evaluate-component` Skill
**Ablauf:**
1. **Aktuellen Stand lesen** (2 Min) — Recipe, SCSS, Arena
2. **Internet-Recherche** (parallel, 4 Agents):
   - Agent A: UX Best Practices (NNg, Baymard, Smashing)
   - Agent B: Design System Benchmarks (Radix, Shadcn, Chakra, Carbon, Ant)
   - Agent C: WCAG/ARIA Compliance (W3C APG, MDN)
   - Agent D: CSS/Web Platform Trends (@starting-style, Popover API)
3. **Gap-Analyse** — Vergleichsmatrix: NEO vs. 5 Benchmarks
4. **Report** — Gespeichert als `data/evaluations/<component>-evaluation-<date>.md`

### Proof of Concept: Modal Evaluation
- **Ergebnis:** 6.5/10 (gute Architektur, Implementierungslücken)
- **Must-Have P1:** Motion Tokens, `@starting-style`, `aria-describedby`, Focus-Restore
- **Must-Have P2:** Mobile Bottom-Sheet, Intent erweitern (success/warning)
- **Kritisch:** SCSS hat `.location-preference-modal` statt `.nc-modal` BEM-Klassen

---

## Phase 4 — Vollständige Modi-Referenz

### Syntax
```
/evaluate-component <component-name> [--focus=<modus>]
```

### 5 verfügbare Modi

| Modus | Command | Agents | Dauer | Anwendungsfall |
|-------|---------|--------|-------|----------------|
| **all** | `--focus=all` | A + B + C + D (4 parallel) | 3–5 Min | Vollständige Evaluation vor Refactoring oder Major Release |
| **ux** | `--focus=ux` | Nur Agent A | 1–2 Min | UX-Review: Patterns, Anti-Patterns, Konversions-Empfehlungen |
| **a11y** | `--focus=a11y` | Nur Agent C | 1–2 Min | WCAG-Compliance Check vor Release |
| **tokens** | `--focus=tokens` | Kein Internet-Agent | <1 Min | Token-Architektur-Audit (lokal, ohne Recherche) |
| **variants** | `--focus=variants` | Nur Agent B + D | 2–3 Min | Varianten-Vergleich + Trend-Check für Modernisierung |

---

### Modus 1: `--focus=all` (Vollständige Evaluation)

**Was passiert:**
1. Recipe + SCSS + Arena lesen
2. 4 Research-Agents parallel: UX (A) + Benchmarks (B) + A11y (C) + Trends (D)
3. Gap-Analyse-Matrix: NEO vs. Radix, Shadcn, Chakra, Carbon, Ant
4. Vollständiger Report mit 8 Sektionen

**Report enthält:**
- Executive Summary + Score
- Stärken vs. Markt
- Lücken (Must-Have + Nice-to-Have)
- UX-Empfehlungen
- A11y-Audit
- Token-Architektur-Analyse
- Konkrete Recipe-JSON-Diffs
- Priorisierte Roadmap (P1/P2/P3)

**Wann verwenden:**
- Vor einem größeren Refactoring
- Bei Vorbereitung einer neuen Major-Version
- Für die initiale Bewertung einer neuen Komponente

**Beispiel:**
```
/evaluate-component accordion --focus=all
→ data/evaluations/accordion-evaluation-2026-03-25.md (8 Sektionen, ~2000 Wörter)
```

---

### Modus 2: `--focus=ux` (UX Best Practices)

**Was passiert:**
1. Recipe + SCSS lesen
2. Nur Agent A: Recherche zu UX Best Practices
3. Report fokussiert auf UX-Patterns und Anti-Patterns

**Report enthält:**
- Empfohlene UX-Patterns (aus NNg, Baymard, Material Design, Apple HIG)
- Anti-Patterns die vermieden werden sollten
- Größen-Empfehlungen (sm/md/lg)
- Animation-Empfehlungen (Timing, Easing)
- Mobile-spezifische Patterns
- Form-Interaktionen (bei Formular-Komponenten)

**Wann verwenden:**
- Wenn die Komponente technisch solide ist, aber UX-Feinschliff braucht
- Vor User-Testing — sicherstellen dass bekannte UX-Fehler vermieden werden
- Für Argumentationsgrundlage gegenüber Stakeholdern ("NNg empfiehlt X")

**Beispiel:**
```
/evaluate-component modal --focus=ux
→ Report: "Modals unter 640px Viewport → Bottom Sheet empfohlen (Baymard 2024)"
→ Report: "Exit-Animation kürzer als Entry — fühlt sich reaktiver an (Material Design)"
→ Report: "Maximal 2 Buttons im Footer (Carbon: Danger + Cancel)"
```

---

### Modus 3: `--focus=a11y` (WCAG/ARIA Compliance)

**Was passiert:**
1. Recipe lesen (a11y-Sektion + anatomy + constraints)
2. Nur Agent C: Recherche zu W3C ARIA Practices + MDN
3. Detaillierter Compliance-Check gegen WCAG 2.2 AA

**Report enthält:**
- Pflicht-ARIA-Attribute (role, aria-modal, aria-labelledby, aria-describedby)
- Keyboard-Interactions (ESC, Tab-Trap, Initial Focus)
- Focus-Management (Trap, Restore, focus-visible)
- Screen-Reader-Verhalten (Ankündigungen, Browse-Mode)
- Bekannte Browser-Bugs (Safari-Fokus, Firefox-Scroll)
- Checkliste: ✅ implementiert / ❌ fehlt / ⚠️ teilweise

**Wann verwenden:**
- Vor einem Release — WCAG 2.2 AA Compliance sicherstellen
- Nach Implementierung — A11y-Regression prüfen
- Für BITV 2.0 / BFSG Compliance-Dokumentation

**Beispiel:**
```
/evaluate-component modal --focus=a11y
→ ✅ role="dialog" (nativ)
→ ✅ aria-modal="true" (nativ)
→ ❌ aria-describedby fehlt
→ ❌ prefers-reduced-motion nicht implementiert
→ ⚠️ Focus-Restore nur dokumentiert, nicht in JS implementiert
→ Roadmap: P1 = aria-describedby + reduced-motion (WCAG 2.3.3)
```

---

### Modus 4: `--focus=tokens` (Token-Architektur-Audit)

**Was passiert:**
1. Recipe lesen (tokenGroups)
2. SCSS `_component-tokens.scss` lesen
3. `tokens.generated.js` lesen
4. **Kein Internet-Agent** — rein lokale Analyse
5. Vergleich: Recipe ↔ SCSS ↔ Token Registry

**Report enthält:**
- Vollständige Token-Inventur (Anzahl pro Gruppe)
- Fehlende Token-Gruppen (Recipe definiert sie, SCSS hat sie nicht)
- Überflüssige Tokens (in SCSS, aber nicht im Recipe)
- Inkonsistente Naming-Patterns
- Empfehlungen für neue Token-Gruppen (basierend auf Anatomy)
- Dark-Mode-Token-Coverage

**Wann verwenden:**
- Nach Token-Refactoring — sind alle Tokens konsistent?
- Vor `/sync-recipe` — Ist die Token-Basis sauber?
- Für Token-Hygiene zwischen Design-System-Versionen

**Beispiel:**
```
/evaluate-component modal --focus=tokens
→ Aktuell: 25 Tokens in 7 Gruppen
→ ❌ Fehlend: Motion-Gruppe (enter-duration, exit-easing, backdrop-blur)
→ ❌ Fehlend: Mobile-Gruppe (mobile-radius, mobile-max-height)
→ ⚠️ Body-Gruppe dünn: nur 2 Tokens (padding fehlt)
→ ⚠️ Footer-Gruppe dünn: padding + alignment fehlen
→ Empfehlung: 3 neue TokenGroups → +11 Tokens
```

---

### Modus 5: `--focus=variants` (Varianten-Benchmark + Trends)

**Was passiert:**
1. Recipe lesen (axes, specimens)
2. Agent B: Design System Benchmarks (Radix, Shadcn, Chakra, Carbon, Ant)
3. Agent D: CSS/Web Platform Trends (neue Features, Patterns)
4. Gap-Analyse: Welche Varianten haben andere, die NEO fehlen?

**Report enthält:**
- Vergleichsmatrix: NEO Axes vs. 5 Benchmarks
- Fehlende Varianten (die der Marktstandard hat)
- Neue CSS-Features die Varianten ermöglichen/verbessern
- Konkrete Vorschläge für neue Axes und Specimens
- Recipe-JSON-Diff (copy-paste-fähig)

**Wann verwenden:**
- Wenn du die Varianten einer Komponente erweitern willst
- Vor der Design-Phase — was bieten andere, was wir nicht haben?
- Für Trend-basierte Modernisierung (neue CSS-Features nutzen)

**Beispiel:**
```
/evaluate-component tooltip --focus=variants
→ NEO: 0 Axes (kein Recipe)
→ Radix: placement (12 Positionen), side, align, delay
→ Shadcn: Radix-basiert + Tailwind-Varianten
→ Trend: Popover API (popover="hint") ersetzt JS-Positioning
→ Trend: CSS Anchor Positioning eliminiert absolute/fixed Hacks
→ Empfehlung: Neues Recipe mit Axes placement, trigger, delay
```

---

### Entscheidungshilfe: Welchen Modus verwenden?

```
Frage: "Was will ich wissen?"
  │
  ├── "Ist die Komponente insgesamt gut?"     → --focus=all
  ├── "Ist die UX optimal?"                   → --focus=ux
  ├── "Ist sie barrierefrei?"                 → --focus=a11y
  ├── "Sind die Tokens sauber?"               → --focus=tokens
  └── "Was fehlt im Vergleich zum Markt?"     → --focus=variants
```

### Kombinierte Workflows

| Workflow | Schritt 1 | Schritt 2 | Schritt 3 |
|----------|-----------|-----------|-----------|
| **Refactoring** | `--focus=all` (Gesamtbild) | Implementieren | `--focus=a11y` (Nachprüfung) |
| **Neue Variante** | `--focus=variants` (Was fehlt?) | Implementieren | `--focus=tokens` (Tokens sauber?) |
| **Release-Check** | `--focus=a11y` (Compliance) | `--focus=tokens` (Konsistenz) | `/audit-pipeline` (Integration) |
| **Trend-Update** | `--focus=variants` (Was ist neu?) | Design in Figma | `/sync-recipe` (Übernehmen) |

---

## Phase 4 — Pro & Con

| Pro | Con |
|-----|-----|
| ✅ Ersetzt manuelle Gemini-Evaluationen (12x pro Session) | ⚠️ Internet-Recherche abhängig von WebFetch-Verfügbarkeit |
| ✅ Strukturierter Report mit konkreten JSON-Diffs | ⚠️ Nicht alle Design Systems haben öffentlich zugängliche Docs |
| ✅ Gap-Analyse gegen 5 Branchenstandards | ⚠️ Trainingsdaten-Cutoff — neueste Features evtl. nicht bekannt |
| ✅ Persistent gespeichert (`data/evaluations/`) | ⚠️ Evaluation dauert 2-5 Minuten (4 parallele Agents) |

---

## Phase 4 — Praxisbeispiele

### Beispiel 1: Komponente vor Refactoring evaluieren
```
/evaluate-component accordion --focus=all
```
**Ergebnis:** Report zeigt dass Carbon 5 semantische Varianten hat (Passive, Transactional, Danger, Acknowledgment, Progress), NEO aber nur 2.
→ Konkrete Empfehlung: Intent-Axis erweitern + Recipe-JSON-Diff.

### Beispiel 2: A11y-Check vor Release
```
/evaluate-component modal --focus=a11y
```
**Ergebnis:** Report zeigt fehlende `aria-describedby`, fehlende `prefers-reduced-motion`.
→ Priorisierte Roadmap: P1 (muss vor Release gefixt werden), P2 (kann nachgezogen werden).

### Beispiel 3: Trend-basierte Modernisierung
```
/evaluate-component tooltip --focus=variants
```
**Ergebnis:** Report zeigt dass Popover API + CSS Anchor Positioning den Tooltip ablösen könnte.
→ Empfehlung: Migration von JS-Positioning zu CSS-only mit `@popover` + `anchor()`.

---

# PHASE 5: Quality Dashboard

---

## Phase 5 — Konzept & Grundlagen

### Warum ein Dashboard?
- **"If you can't measure it, you can't improve it"** — nach 4 Phasen haben wir viele bewegliche Teile
- 10 KPIs tracken die Gesundheit des gesamten Design Systems
- History-Snapshots ermöglichen Trend-Analyse über Zeit

### 10 KPIs (gewichtet)

| KPI | Gewicht | Was wird gemessen |
|-----|---------|-------------------|
| Test Coverage | 20% | Vitest: passed/failed |
| Build Health | 15% | CSS kompiliert, Dateigröße |
| Token Sync | 15% | SCSS ↔ tokens.generated.js Drift |
| Token Coverage | 15% | Hardcoded Values (lint:tokens) |
| Recipe Completeness | 10% | Pflichtfelder in 107 Recipes |
| Docs Coverage | 10% | Storybook Stories pro Recipe |
| Component Maturity | 10% | stable/beta/alpha Verteilung |
| Pipeline Sync | 5% | Drupal-Integration |
| Bundle Size | — | CSS-Größe + Trend (informativ) |
| Evaluations | — | Durchgeführte Evaluationen (informativ) |

---

## Phase 5 — Was wurde implementiert

### 1. Metrics Script (`scripts/dashboard-metrics.mjs`)
- Berechnet alle 10 KPIs automatisch (~12s)
- 3 Modi: Terminal-Output, JSON-Export, History-Snapshot
- Gewichteter Overall Score (0–100)

### 2. Vue Dashboard Component (`QualityDashboard.vue`)
- 4×2 KPI-Grid mit Statusfarben (grün/gelb/rot)
- Bundle Size Trend (↑/→/↓)
- Refresh-Button für Live-Berechnung
- Integration in die bestehende Konfig-App

### 3. History-Pipeline
- Snapshots in `data/dashboard/history/YYYY-MM-DD.json`
- Git-tracked für Nachvollziehbarkeit
- Trend-Vergleich zwischen Snapshots

---

## Phase 5 — Vollständige Modi-Referenz

### Skill: `/dashboard`

**Syntax:**
```
/dashboard [--snapshot] [--trend]
```

#### 3 verfügbare Modi

| Modus | Command | Speichert Daten | Dauer |
|-------|---------|----------------|-------|
| **Standard** | `/dashboard` | ✅ `data/dashboard/metrics.json` | ~12s |
| **Snapshot** | `/dashboard --snapshot` | + `data/dashboard/history/YYYY-MM-DD.json` | ~12s |
| **Trend** | `/dashboard --trend` | ❌ Nur Analyse | ~3s |

---

#### Modus: Standard (ohne Flags)

**Was passiert:**
1. **10 KPIs berechnen** (parallel wo möglich):
   - Token Coverage → `npm run lint:tokens`
   - Recipe Completeness → 107 Recipes auf Pflichtfelder prüfen
   - Test Coverage → `npx vitest run` (passed/failed)
   - Build Health → `npm run build:css` (Erfolg + Dateigröße)
   - Docs Coverage → Stories vs. Recipes zählen
   - Component Maturity → stable/beta/alpha aus Recipe-Meta
   - Token Sync → `npm run tokens:sync:check`
   - Bundle Size Trend → CSS-Größe vs. letzter Snapshot
   - Pipeline Sync → `npm run pipeline:check`
   - Evaluations → Dateien in `data/evaluations/` zählen
2. **Gewichteten Overall Score berechnen** (0–100)
3. **Report im Terminal anzeigen**
4. **`data/dashboard/metrics.json` aktualisieren**

**Report-Format:**
```
╔══════════════════════════════════════╗
║     QUALITY DASHBOARD METRICS        ║
╚══════════════════════════════════════╝

──────────────────────────────────────────────────
  Overall Score: 97/100 (excellent)
──────────────────────────────────────────────────
  ✅ Test Coverage:      28/28 passed (100%)
  ✅ Build Health:       825KB CSS
  ✅ Token Coverage:     100% (0 violations)
  ✅ Recipe Completeness: 100% (107 recipes)
  ✅ Docs Coverage:      107/107 with stories (100%)
  ✅ Component Maturity: 106 stable, 0 beta, 0 alpha
  ❌ Token Sync:         1 drift
  ⚠️ Pipeline Sync:      50%
  📦 Bundle Size:        825KB (stable)
  📝 Evaluations:        1 (modal)
──────────────────────────────────────────────────
  ⏱️ Duration: 11.9s
```

**Wann verwenden:** Täglicher Health-Check — "Wie gesund ist mein Design System gerade?"

**Beispiel:**
```
/dashboard
→ Overall Score: 97/100 (excellent)
→ 8 KPIs grün, 1 gelb, 1 rot
→ Empfehlung: Token Sync fixen (1 Drift)
```

---

#### Modus: `--snapshot` (History-Snapshot)

**Was passiert:** Standard + zusätzlich:
5. Snapshot als `data/dashboard/history/YYYY-MM-DD.json` speichern
6. Datei wird Git-tracked für historische Nachvollziehbarkeit

**Wann verwenden:**
- Am Ende eines Sprints
- Nach einem Major Release
- Wöchentlich als Baseline für Trend-Analyse

**Beispiel:**
```
/dashboard --snapshot
→ Overall Score: 97/100 (excellent)
→ 💾 Snapshot: data/dashboard/history/2026-03-25.json

# Nächste Woche:
/dashboard
→ Bundle Size: 830KB (+5KB, growing ↑) ← Vergleich mit Snapshot
```

---

#### Modus: `--trend` (Trend-Analyse)

**Was passiert:**
1. Alle Snapshots in `data/dashboard/history/` laden
2. Zeitlicher Vergleich: KPI-Entwicklung über die letzten 5 Snapshots
3. Verschlechterungen identifizieren und warnen

**Voraussetzung:** Mindestens 2 Snapshots müssen existieren.

**Report enthält:**
```
📈 Trend-Analyse (letzte 5 Snapshots)

| KPI           | 03-20 | 03-22 | 03-25 | Trend |
|---------------|-------|-------|-------|-------|
| Overall Score | 94    | 96    | 97    | ↑ +3  |
| Bundle Size   | 810KB | 820KB | 825KB | ↑ +15KB |
| Test Coverage | 100%  | 100%  | 100%  | → stabil |
| Token Sync    | fail  | pass  | fail  | ↕ instabil |

⚠️ Token Sync ist instabil — 2 von 3 Snapshots failed
```

**Wann verwenden:** Monatliches Review — zeigt ob sich das Design System in die richtige Richtung entwickelt.

**Beispiel:**
```
/dashboard --trend
→ Overall Score: 94 → 97 (+3 in 2 Wochen) ↑
→ Bundle Size: wächst (+15KB) → ggf. ungenutztes CSS entfernen
→ Token Sync: instabil → Root Cause analysieren
```

### npm Scripts (direkt nutzbar)

| Script | Identisch zu |
|--------|-------------|
| `npm run dashboard` | Standard (Terminal + metrics.json) |
| `npm run dashboard:snapshot` | Standard + History-Snapshot |
| `npm run dashboard:json` | Nur JSON-Output auf stdout (für CI) |

---

## Phase 5 — Pro & Con

| Pro | Con |
|-----|-----|
| ✅ 10 KPIs decken alle Aspekte ab (Build, Test, Docs, A11y) | ⚠️ Dashboard UI noch nicht in Navigation der Konfig-App integriert |
| ✅ History-Snapshots ermöglichen Trend-Tracking | ⚠️ Metriken-Berechnung dauert ~12s (blockiert Terminal) |
| ✅ JSON-Output für CI/CD Integration | ⚠️ Schwellwerte sind initial — müssen über Zeit kalibriert werden |
| ✅ Overall Score gibt sofortigen Überblick | ⚠️ Kein automatischer Alert bei Score-Verschlechterung |

---

## Phase 5 — Praxisbeispiele

### Beispiel 1: Täglicher Health Check
```bash
npm run dashboard
```
**Output:**
```
Overall Score: 97/100 (excellent)
✅ Test Coverage:      28/28 passed (100%)
✅ Build Health:       825KB CSS
✅ Docs Coverage:      107/107 with stories (100%)
⚠️ Pipeline Sync:      50% (Drupal DDEV nicht erreichbar)
```

### Beispiel 2: Sprint-Ende Snapshot
```bash
npm run dashboard:snapshot
```
**Aktion:** Speichert `data/dashboard/history/2026-03-25.json`.
**Vergleich:** Nächste Woche `npm run dashboard` zeigt: "Bundle Size: 830KB (+5KB, growing)".

### Beispiel 3: CI/CD Integration
```yaml
# In .github/workflows/ci.yml
- name: Quality Gate
  run: |
    SCORE=$(npm run dashboard:json | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).overallScore))")
    if [ "$SCORE" -lt 80 ]; then echo "Quality gate failed ($SCORE < 80)"; exit 1; fi
```
**Aktion:** PR wird blockiert wenn Quality Score unter 80 fällt.

---

# PHASE 6: Agent-Netzwerk

---

## Phase 6 — Konzept & Grundlagen

### Warum ein Agent-Netzwerk?
- **Phase 1–5 haben einzelne Tools geschaffen** — jetzt müssen sie orchestriert werden
- Statt `npm run build:css && npm run test:unit && npm run lint:tokens && ...` → ein einziger Befehl
- **Kontextbezogen:** Nur relevante Checks für geänderte Dateien
- **Fehlerkaskade:** Build-Failure → Tests überspringen (spart Zeit)

### Architektur

```
          Orchestrator
         /     |      \
     Builder  Tester  Documenter
     (5 Checks) (4 Checks) (3 Checks)
         \     |      /
          Reporter
         (Aggregation)
```

### Kontextbezogene Ausführung

| Geänderte Datei | Builder | Tester | Documenter |
|-----------------|---------|--------|------------|
| `*.scss` | ✅ Build + Lint + Sync | ✅ Vitest + Pipeline | ✅ Docs Lint |
| `*-recipe.json` | ✅ Recipe Lint | ✅ Vitest | ✅ Stories regenerieren |
| `*.js/*.mjs` | — | ✅ Fragment + Script Lint | — |
| `*.vue` | — | ✅ Vue Tests | — |
| `--full` Flag | ✅ Alles | ✅ Alles | ✅ + Dashboard Snapshot |

---

## Phase 6 — Was wurde implementiert

### 4 Agents + Shared Utilities

| Agent | Datei | Checks | Dauer |
|-------|-------|--------|-------|
| **Builder** | `agents/builder.mjs` | Token Gen, CSS Build, Token Sync, Token Lint, Recipe Lint | ~6s |
| **Tester** | `agents/tester.mjs` | Vitest, Pipeline Guard, Fragment Lint, Script Lint, Vue Tests | ~10s |
| **Documenter** | `agents/documenter.mjs` | Story Gen, Docs Lint, Dashboard Snapshot, Changelog | ~14s |
| **Reporter** | `agents/reporter.mjs` | Aggregation, JSON Export, Empfehlungen | <1s |
| **Shared** | `agents/shared.mjs` | Logging, Run(), Git Helpers, File I/O | — |

### 3 Ausführungsmodi

```bash
npm run agents           # Auto-detect (nur geänderte Dateien)
npm run agents:quick     # Nur Builder (~5s)
npm run agents:full      # Komplette Pipeline (~30s)
```

---

## Phase 6 — Vollständige Modi-Referenz

### Skill: `/agents`

**Syntax:**
```
/agents [--quick|--full|--changed=<datei>|--since=<commit>]
```

#### 4 verfügbare Modi

| Modus | Command | Agents aktiv | Checks | Dauer |
|-------|---------|-------------|--------|-------|
| **Auto** | `/agents` | Builder + Tester + Documenter | Kontextbezogen | 10–20s |
| **Quick** | `/agents --quick` | Nur Builder | 5 Checks | ~5s |
| **Full** | `/agents --full` | Alle 3 + Dashboard Snapshot | 12 Checks | ~30s |
| **Single File** | `/agents --changed=file.scss` | Kontextbezogen | Variabel | 5–15s |
| **Since Commit** | `/agents --since=HEAD~3` | Kontextbezogen | Variabel | 10–20s |

---

#### Modus: Auto (Standard)

**Was passiert:**
1. `git diff --name-only HEAD~1` — geänderte Dateien seit letztem Commit erkennen
2. Dateien kategorisieren: SCSS, Recipe, JS, Vue, andere
3. Nur relevante Agents + Checks starten

**Kontextbezogene Agent-Aktivierung:**

| Geänderte Datei | Builder | Tester | Documenter |
|-----------------|---------|--------|------------|
| `*.scss` | ✅ CSS Build, Token Lint, Sync | ✅ Vitest, Pipeline Guard | ✅ Docs Lint |
| `*-recipe.json` | ✅ Recipe Lint | ✅ Vitest | ✅ Stories regenerieren |
| `*.js/*.mjs` | — | ✅ Fragment + Script Lint | — |
| `*.vue` | — | ✅ Vue Tests | — |
| Keine Änderungen | ⚠️ Fallback: unstaged Changes | | |

**Wann verwenden:** Standard-Modus für den Alltag — schnelles kontextbezogenes Feedback.

**Beispiel:**
```
# Du hast _button.scss und button-recipe.json geändert
/agents
→ Mode: Auto-detect — 2 files changed (1 scss, 1 recipe)
→ [Builder] ✅ CSS 825KB, ✅ Token Lint, ✅ Recipe Lint
→ [Tester] ✅ Vitest 28/28
→ [Documenter] ✅ 107 Stories regenerated
→ Overall: 5 passed, 0 warnings — 12.4s
```

---

#### Modus: `--quick` (Nur Builder)

**Was passiert:**
1. Builder-Agent mit allen 5 Checks:
   - Token Generation
   - CSS Build
   - Token Sync Check
   - Token Lint
   - Recipe Lint
2. Tester und Documenter werden **übersprungen**
3. Reporter erstellt Kurzreport

**Wann verwenden:**
- Schneller Sanity-Check während der Entwicklung
- Nach einzelner CSS-Änderung
- Wenn du nicht 30s warten willst

**Beispiel:**
```
/agents --quick
→ [Builder] ✅ CSS build successful (825KB)
→ [Builder] ✅ No hardcoded values
→ [Builder] ✅ Recipes valid
→ Overall: 3 passed, 0 warnings — 5.1s
```

---

#### Modus: `--full` (Komplette Pipeline)

**Was passiert:**
1. **Builder** (alle 5 Checks, ~6s)
   - Token Generation, CSS Build, Token Sync, Token Lint, Recipe Lint
2. **Tester** (alle 4-5 Checks, ~10s)
   - Vitest, Pipeline Guard, Fragment Lint, Script Lint, Vue Tests
3. **Documenter** (alle 3-4 Checks, ~14s)
   - Story Generation (107), Docs Token Lint, **Dashboard Snapshot**, Changelog
4. **Reporter** — Aggregation, JSON Export, Empfehlungen

**Build-Failure = Pipeline Stop:** Wenn CSS Build fehlschlägt, werden Tester und Documenter übersprungen (fail fast).

**Wann verwenden:**
- **Vor einem Commit** — sicherstellen dass alles grün ist
- **In CI/CD** — GitHub Actions nutzt diesen Modus
- **Vor einem Release** — vollständiger Quality Gate

**Beispiel:**
```
/agents --full
→ Phase 1: Builder (6.2s)
→   ✅ Token Gen, ✅ CSS 825KB, ✅ Sync, ✅ Lint, ✅ Recipes
→ Phase 2: Tester (9.6s)
→   ✅ Vitest 28/28, ✅ Pipeline Guard, ✅ Fragments, ✅ Scripts
→ Phase 3: Documenter (13.9s)
→   ✅ 107 Stories, ✅ Docs Lint, ✅ Dashboard 97/100
→ Phase 4: Reporter
→   Overall: 12 passed, 0 warnings, 0 failed — 29.8s
→   💾 Report: data/dashboard/last-pipeline-run.json
```

---

#### Modus: `--changed=<datei>` (Single File)

**Was passiert:**
1. Nur die angegebene Datei als Kontext verwenden
2. Agents aktivieren basierend auf Dateityp
3. Minimaler Check-Umfang

**Wann verwenden:** Nach einer einzelnen gezielten Änderung — maximale Geschwindigkeit.

**Beispiel:**
```
/agents --changed=scss/scss/06-molecules/_card.scss
→ Mode: Single file (1 scss)
→ [Builder] ✅ CSS Build, ✅ Token Lint
→ [Tester] ✅ Vitest (28/28)
→ Overall: 3 passed — 8.2s
```

---

#### Modus: `--since=<commit>` (Seit Commit)

**Was passiert:**
1. `git diff --name-only <commit>` — alle geänderten Dateien seit dem angegebenen Commit
2. Kontextbezogene Agent-Aktivierung basierend auf allen geänderten Dateien

**Wann verwenden:**
- Prüfen was sich seit dem letzten Merge geändert hat
- Sprint-Review: alle Änderungen seit Sprint-Start prüfen

**Beispiel:**
```
/agents --since=HEAD~5
→ Mode: Since HEAD~5 — 14 files changed (8 scss, 3 recipe, 2 js, 1 vue)
→ [Builder] ✅ 5/5 checks
→ [Tester] ✅ 5/5 checks (inkl. Vue Tests)
→ [Documenter] ✅ 3/3 checks
→ Overall: 13 passed, 0 warnings — 24.1s
```

### npm Scripts (direkt nutzbar)

| Script | Identisch zu |
|--------|-------------|
| `npm run agents` | Auto-Modus |
| `npm run agents:quick` | `--quick` Modus |
| `npm run agents:full` | `--full` Modus |

### Entscheidungshilfe: Welchen Modus verwenden?

```
Frage: "Was brauche ich gerade?"
  │
  ├── "Schneller Check ob CSS kompiliert"    → /agents --quick (~5s)
  ├── "Feedback zu meinen letzten Änderungen" → /agents (~15s)
  ├── "Alles prüfen vor dem Commit"           → /agents --full (~30s)
  ├── "Nur diese eine Datei prüfen"           → /agents --changed=file.scss
  └── "Sprint-Review: alles seit Montag"      → /agents --since=abc1234
```

---

## Phase 6 — Pro & Con

| Pro | Con |
|-----|-----|
| ✅ Ein Befehl statt 8+ einzelne npm Scripts | ⚠️ Token-Generation scheitert (ESM/CJS Kompatibilität) |
| ✅ Kontextbezogen — spart 70% der Zeit bei kleinen Änderungen | ⚠️ Sequentielle Ausführung (nicht parallel) |
| ✅ Build-Failure stoppt Pipeline (fail fast) | ⚠️ Reporter zeigt nur Terminal-Output, kein Web-UI |
| ✅ JSON-Report für CI/CD und Dashboard | ⚠️ Kein Retry-Mechanismus bei transienten Fehlern |

---

## Phase 6 — Praxisbeispiele

### Beispiel 1: Quick Check nach SCSS-Änderung
```bash
npm run agents:quick
```
**Output (5s):**
```
[Builder] ✅ CSS build successful (825KB)
[Builder] ✅ No hardcoded values found
Overall: 2 passed, 0 warnings, 0 failed
```
→ Schnelles Feedback — Tester und Documenter werden übersprungen.

### Beispiel 2: Volle Pipeline vor dem Commit
```bash
npm run agents:full
```
**Output (30s):**
```
Phase 1: Builder  — ✅ CSS 825KB, Token Sync ✅, Lint ✅
Phase 2: Tester   — ✅ 28/28 Tests, Pipeline ✅
Phase 3: Documenter — ✅ 107 Stories, Dashboard 97/100
Overall: 12 passed, 0 warnings, 0 failed
```
→ Alles grün → sicher committen.

### Beispiel 3: Kontextbezogen nach einzelner Datei
```bash
node agents/orchestrator.mjs --changed=scss/scss/05-atoms/_button.scss
```
**Output:**
```
Mode: Single file — scss/scss/05-atoms/_button.scss
Files: 1 scss
[Builder] ✅ CSS build, ✅ Token Lint
[Tester] ✅ Vitest (28/28)
[Documenter] ⚠️ Docs token lint
Overall: 3 passed, 1 warning
```
→ Nur SCSS-relevante Checks — Vue-Tests werden übersprungen.

---

# ZUSAMMENFASSUNG

---

## Gesamtüberblick: 6 Phasen

```
Phase 1: TESTING            → "Können wir es messen?"
Phase 2: STORYBOOK          → "Können wir es zeigen?"
Phase 3: FIGMA              → "Können wir es designen?"
Phase 4: RESEARCH           → "Können wir es verbessern?"
Phase 5: DASHBOARD          → "Wie gut ist es?"
Phase 6: AGENTS             → "Läuft es automatisch?"
```

### Vorher → Nachher

| Workflow | Vorher | Nachher |
|----------|--------|---------|
| **CSS-Änderung prüfen** | Manuell Browser refreshen | `npm run agents:quick` (5s) |
| **Neues Recipe erstellen** | Manuell Arena + Inspector updaten | `/sync-recipe <name>` |
| **Komponente evaluieren** | Gemini-Prompt kopieren, 30min Recherche | `/evaluate-component <name>` (3min) |
| **Quality Check** | "Hoffentlich funktioniert alles" | `npm run dashboard` (12s) → 97/100 |
| **Storybook aktualisieren** | Stories manuell schreiben | `npm run generate:stories` (107 auto) |
| **Drupal Block erstellen** | 7 Schritte manuell | `/create-drupal-block <id>` |
| **Wettbewerber analysieren** | Website manuell durchklicken | `/analyze-competitor <url>` |

---

## Nächste Schritte

1. **Figma Two-Way Pipeline** — Tokens Studio Format Export für bidirektionalen Sync
2. **Visual Regression Tests** — Playwright-basierte Pixel-Vergleiche
3. **Agent-Netzwerk parallelisieren** — Builder + Tester gleichzeitig
4. **Dashboard in Konfig-App integrieren** — Quality Tab neben Theme Arena
5. **Schwellwerte kalibrieren** — Toleranzen basierend auf 4 Wochen Daten anpassen
