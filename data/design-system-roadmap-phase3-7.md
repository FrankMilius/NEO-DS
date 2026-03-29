# NEO Design System — Roadmap Phase 3-8

> Erstellt: 2026-03-27 | Aktualisiert: 2026-03-27 | Status: Geplant
> Voraussetzung: Phase 1 (component-registry.json) + Phase 2 (Recipe Enhancement) ✓ abgeschlossen
>
> **Korrektur:** Ursprüngliche Evaluation betrachtete nur Layer 05-07 (Komponenten).
> Nach Audit aller 10 ITCSS-Schichten wurde Phase 3 (Foundations) als höchste Priorität eingefügt.
> Alle folgenden Phasen wurden neu nummeriert.

---

## Phase-Übersicht

| Phase | Titel | Aufwand | ROI | Abhängigkeiten |
|-------|-------|---------|-----|----------------|
| **3** | **Foundation-Integration** | **5-8 Tage** | **Kritisch** | **Phase 1+2** |
| 4 | Fallback/Override Token Pattern | 3-5 Tage | Hoch | Keine |
| 5 | Algorithmische Token-Derivation | 5-8 Tage | Mittel | Profitiert von Phase 4 |
| 6 | Base/Theme CSS Split | 3-5 Tage | Hoch | Keine |
| 7 | Cross-Framework Spec Repo | 5-8 Tage | Mittel | Phase 2+3 |
| 8 | Co-Location (optional) | 2-3 Tage | Niedrig | Phase 1 |

**Empfohlene Reihenfolge:** 3 → 4 → 6 → 5 → 7 → 8

---

## Phase 3: Foundation-Integration (NEU — Höchste Priorität)

### Problem
Foundations (Farben, Typografie, Spacing, Radii, Shadow, Motion, Grid, Breakpoints, Icons, A11y, Aspect Ratios, Sizes) sind die Basis des gesamten Design Systems, aber:
- **0/14 Storybook Stories** — kein interaktiver Foundation-Showcase
- **0 Foundation Recipes** — keine maschinenlesbare Spec für Token-Kategorien
- **Breakpoints ohne Docs** — keine Dokumentationsseite
- **Objects (Layer 04)** ohne Recipe: aspect-ratio, video
- **Templates (Layer 08)** ohne Stories: 8/9

Alle 5 Benchmark-Systeme (Carbon, Spectrum, MUI, Ant Design, Shadcn) behandeln Foundations als **erstklassige Bürger** mit eigenen Packages/Docs/Playgrounds.

### Aktueller Stand (aus Registry)

| Foundation | Token-Quelle | SCSS | Generated | Docs | Editor | Story |
|-----------|-------------|------|-----------|------|--------|-------|
| color-primitives | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| color-semantic | ✓ | ✓ | — | ✓ | ✓ | ✗ |
| typography | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| spacing | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| radii | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| border | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| shadow | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| elevation | ✓ | — | — | ✓ | ✓ | ✗ |
| opacity | ✓ | ✓ | — | ✓ | ✓ | ✗ |
| layout | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| breakpoints | ✓ | ✓ | — | **✗** | ✗ | ✗ |
| motion | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| icons | ✓ | — | ✓ | ✓ | ✓ | ✗ |
| a11y | ✓ | ✓ | — | ✓ | ✗ | ✗ |

### Umsetzungsplan

#### 3a: Foundation Storybook Stories (2-3 Tage)
```
stories/foundations/
  colors.stories.js          # Farb-Primitiven + Semantik + Themes
  typography.stories.js      # Fluid Scale, Font Weights, Prose
  spacing.stories.js         # Spacing Scale visuell
  shadow-elevation.stories.js # Alle Shadow-Stufen + Elevation
  radii.stories.js           # Border Radius Scale
  border.stories.js          # Border Tokens
  motion.stories.js          # Alle 12+ Keyframes live animiert
  opacity.stories.js         # Opacity-Stufen
  breakpoints.stories.js     # Responsive Breakpoints visuell
  icons.stories.js           # Icon-Browser (alle 5266 Icons)
  interaction-states.stories.js # Hover/Focus/Active/Disabled Muster
```

#### 3b: Object & Template Recipes (1-2 Tage)
Recipes für Layout-Primitiven und Templates, die bisher fehlen:
- `data/aspect-ratio-recipe.json`
- `data/video-recipe.json`
- Template-Recipes: `data/template-dashboard-recipe.json`, etc.

#### 3c: Fehlende Docs (1 Tag)
- `docs/breakpoints-docs.html`
- `docs/utility-spacing-docs.html`
- `docs/utility-typography-docs.html`
- `docs/animations-docs.html`

#### 3d: Foundation-Recipe-Schema (1-2 Tage)
Neues Schema für Foundation Specs (keine Anatomie, aber Token-Katalog):
```json
{
  "$schema": "./foundation-recipe-schema.json",
  "meta": {
    "category": "spacing",
    "version": "1.0.0",
    "tokenSource": "foundation.spacing"
  },
  "tokens": [
    { "name": "--fnd-spacing-xs", "value": "0.25rem", "usage": "Minimaler Abstand, Icon-Padding" },
    { "name": "--fnd-spacing-sm", "value": "0.5rem", "usage": "Kompakte Elemente" }
  ],
  "usage": {
    "do": ["Spacing-Tokens für padding/margin/gap verwenden"],
    "dont": ["Hardcoded px-Werte in Komponenten"]
  },
  "relatedComponents": ["button", "card", "input"]
}
```

### Risiken
- **Aufwand für 14 Foundation Stories** — kann mit `generate-stories.mjs` teilautomatisiert werden
- **Template-Recipes** erfordern neues Schema (kein anatomy.root, keine axes)

### Impact auf Benchmark-Vergleich
Nach Phase 3 steigt die Foundation-Abdeckung von ~30% auf ~90% und ist vergleichbar mit Carbon und Spectrum.

---

## Phase 3: Optionale Co-Location

### Ziel
Ein Einstiegspunkt pro Komponente, um alle zugehörigen Dateien zu finden — ohne SCSS aus ITCSS-Layern zu verschieben.

### Ansatz: Generierte README-Dateien (nicht Symlinks)
Symlinks sind fragil über Git, Windows und CI hinweg. Stattdessen generierte Index-Dateien.

```
components/
  button/
    README.md         # Auto-generiert: Links zu allen Artefakten
  card/
    README.md
  ...
```

### Generator-Script
`scripts/generate-component-index.js` liest `component-registry.json` und schreibt `components/{name}/README.md` mit:
- Pfade zu Recipe, SCSS, Story, Arena, Drupal, Docs
- Token-Anzahl
- Recipe-Version und Status
- Dependencies

### ROI-Bewertung
**Moderat.** Hauptnutzen ist Discoverability für neue Entwickler. Das System hat bereits starke Konventionen. Nur umsetzen wenn Team wächst.

---

## Phase 4: Fallback/Override Token Pattern (Spectrum-Stil)

### Ziel
Externe Konsumenten (Drupal-Themes, White-Label-Kunden) können Component Tokens überschreiben ohne Specificity-Konflikte.

### Aktuelles Pattern
```scss
background-color: var(--nc-button-primary-bg);
```

### Ziel-Pattern
```scss
background-color: var(--mod-button-primary-bg, var(--nc-button-primary-bg));
```

### Migrationsstrategie

**Schritt 1:** `_component-tokens.scss` bleibt unverändert (`:root`-Deklarationen bleiben `--nc-*`)

**Schritt 2:** Transformation der Consumption-Sites (automatisierbar)
```js
// Regex: var(--nc-{name}) → var(--mod-{name}, var(--nc-{name}))
// NUR in 05-atoms, 06-molecules, 07-organisms
// NICHT in _component-tokens.scss
```

**Geschätzte Änderungen:** 800-1200 `var(--nc-*)` Referenzen in 99 SCSS-Dateien

**Schritt 3:** `sync-component-tokens.js` aktualisieren für neues Pattern

**Schritt 4:** Documentation: `--mod-*` Override-API in Recipe-Docs

### CSS-Größe
~20-30 Bytes pro Wrapping × 1000 Vorkommen = ~25KB unkomprimiert, ~4KB gzipped. Akzeptabel.

### Risiken
- Lesbarkeit: Verschachteltes `var()` ist schwerer zu scannen
- Keine Specificity-Probleme da CSS Custom Properties natürlich kaskadieren

---

## Phase 5: Algorithmische Token-Derivation (Ant-Design-Stil)

### Ziel
Hover/Active/Disabled/Focus-Varianten automatisch aus Seed-Tokens ableiten statt manuell per `color-mix()`.

### Aktueller Stand (bereits vorhanden)
```scss
--nc-button-success-bg-hover: color-mix(in srgb, var(--fnd-color-feedback-success) 85%, var(--fnd-state-mix-target));
```
`--fnd-state-mix-target` abstrahiert bereits die Richtung (Light: aufhellen, Dark: Richtung always-light).

### Vorgeschlagener Algorithmus

**Seed-Parameter pro Komponente:**
```json
{
  "bg": "var(--fnd-color-feedback-success)",
  "hover": { "mix": 85 },
  "active": { "mix": 75 },
  "disabled": { "opacity": "var(--fnd-opacity-disabled)" }
}
```

**Derivation-Regeln:**
| State | Formel |
|-------|--------|
| hover | `color-mix(in srgb, {bg} {hover.mix}%, var(--fnd-state-mix-target))` |
| active | `color-mix(in srgb, {bg} {active.mix}%, var(--fnd-state-mix-target))` |
| disabled | Opacity via `--fnd-opacity-disabled` |
| focus | Ring via `--fnd-color-interactive-default` |

### Integration
- **Konfiguration:** In `design-tokens.json` unter neuem `derivation` Key
- **Generator:** Erweiterung von `generate-tokens.js`
- **Output:** Gleiche `--nc-*` Tokens in `:root`, aber berechnet statt handgeschrieben
- **Escape-Hatch:** `"override": true` Flag für manuell getunte Dark-Mode-Werte

### Theme Configurator
Seed-basiertes Editing: Nutzer ändert Base-Farbe → Hover/Active/Disabled werden live berechnet.

### Risiken
- Algorithmische Werte stimmen nicht immer mit designer-approbierten Werten überein → Override-Mechanismus nötig
- Dark-Mode-Asymmetrie: Einige Tokens sind handgetuned (z.B. `secondary-500` für Button)

---

## Phase 6: Base/Theme CSS Split (Spectrum-Stil)

### Ziel
Kompilierte CSS in zwei Dateien aufteilen:
- `styles-base.css` — Struktur, Layout, Spacing, Typografie (theme-agnostisch)
- `styles-theme.css` — Farben, Schatten, theme-spezifische Behandlungen

### Pragmatischer Ansatz (Option B)
Da alle visuellen Theming-Werte über CSS Custom Properties (`--nc-*`, `--fnd-*`) fließen:

```
styles-base.css  = Vollständig kompilierte Ausgabe (wie bisher)
styles-theme.css = NUR :root { --fnd-*, --nc-* } + Theme-Klassen-Overrides
```

Ein Kunde überschreibt, indem er `styles-base.css` + eigene `styles-customer-theme.css` lädt.

### Build-Pipeline
```json
{
  "build:base": "sass scss/scss/main.scss:styles-base.css --style=compressed",
  "build:theme": "node scripts/extract-theme-css.js"
}
```

`extract-theme-css.js` extrahiert `:root`-Blöcke und Theme-Klassen aus `_component-tokens.scss` + `_color-themes.scss`.

### Hinweis
`data/theme-overrides.css` existiert bereits (untracked) — dieses Pattern wird bereits exploriert.

---

## Phase 7: Cross-Framework Spec Repo

### Ziel
Framework-agnostische Komponentenspezifikationen aus Recipe-JSONs extrahieren.

### Recipe-Abdeckung (bereits vorhanden)

| Spec-Aspekt | Recipe-Ort | Abdeckung |
|------------|-----------|-----------|
| Anatomie | `anatomy.root`, `anatomy.slots` | ✓ Vollständig |
| CSS-Klassen-API | `styling.baseClasses`, `axes.*.modifier` | ✓ Vollständig |
| Token-API | `styling.tokenGroups.*.tokens` | ✓ Vollständig |
| States | `states.supported`, `states.rules` | ✓ Vollständig |
| A11y | `a11y.base`, `a11y.overrides` | ✓ Vollständig |
| Keyboard | `a11y.base.assertions` | ○ Partial |
| Test-Selektoren | — | ✗ Fehlend |
| UX-Guidelines | `constraints.copy`, `domNotes` | ○ Partial |

### Schema-Erweiterungen (3 neue Keys)

```json
"testSelectors": {
  "root": "[data-testid='button']",
  "label": "[data-testid='button-label']"
},
"keyboard": {
  "Enter": { "action": "activate" },
  "Space": { "action": "activate" },
  "Tab": { "action": "focus-next" }
},
"events": {
  "click": { "bubbles": true },
  "change": { "detail": { "value": "string" } }
}
```

### Web Components Mapping
- `anatomy.slots` → `<slot>` Elemente
- `axes` → Attribute/Properties
- `styling.tokenGroups` → Shadow DOM CSS Custom Property API

### Spec-Extraction-Script
`scripts/generate-component-specs.js` → `specs/{component}.spec.json` + `specs/{component}.spec.md`

---

## Sequencing-Diagramm (aktualisiert)

```
Phase 1 (Registry) ─────────┐
Phase 2 (Recipe Enhancement) ┤
                              │
                              ├── Phase 3 (Foundations) ── HÖCHSTE PRIORITÄT
                              │     ├── 3a: Foundation Stories
                              │     ├── 3b: Object/Template Recipes
                              │     ├── 3c: Fehlende Docs
                              │     └── 3d: Foundation Recipe Schema
                              │
                              ├── Phase 4 (Mod Tokens) ── unabhängig
                              │
                              ├── Phase 5 (Derivation) ── profitiert von Ph. 4
                              │
                              ├── Phase 6 (CSS Split) ── unabhängig
                              │
                              ├── Phase 7 (Spec Repo) ── abhängig von Ph. 2+3
                              │
                              └── Phase 8 (Co-Location) ── niedr. Priorität
```

**Phase 3 ist Voraussetzung für ein vollständiges Benchmark-Niveau.**
**Phasen 4, 5 und 6 sind unabhängig und parallelisierbar.**

---

## Kritische Dateien

| Datei | Betroffen von |
|-------|--------------|
| `data/design-tokens.json` | Phase 3, 5 |
| `scss/scss/00-settings/_component-tokens.scss` | Phase 4, 5, 6 |
| `scss/scss/00-settings/*.scss` (28 Dateien) | Phase 3 |
| `scripts/generate-tokens.js` | Phase 5, 6 |
| `scripts/generate-stories.mjs` | Phase 3a |
| `scripts/sync-component-tokens.js` | Phase 4 |
| `data/*-recipe.json` (107 Dateien) | Phase 7 |
| `stories/` (neuer Ordner `foundations/`) | Phase 3a |
| `docs/` (4+ neue Docs-Seiten) | Phase 3c |

---

## Gesamtaufwand
**23-37 Tage** über alle Phasen (Phase 3-8)

| Phase | Tage | Kumulativ |
|-------|------|-----------|
| 3 Foundation-Integration | 5-8 | 5-8 |
| 4 Mod Tokens | 3-5 | 8-13 |
| 5 Token-Derivation | 5-8 | 13-21 |
| 6 CSS Split | 3-5 | 16-26 |
| 7 Spec Repo | 5-8 | 21-34 |
| 8 Co-Location | 2-3 | 23-37 |
