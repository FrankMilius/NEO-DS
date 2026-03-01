# Recipe Canonical Form v3.1.0

Dieses Dokument definiert die kanonische Struktur fuer alle Komponenten-Recipes im NEO Design System. Recipes sind die Single Source of Truth fuer Varianten, Tokens, Specimens und A11y-Regeln einer Komponente.

## Dateien

| Datei | Status | Schema |
|---|---|---|
| `data/recipe-schema.json` | JSON Schema Draft 2020-12 | Formale Validierung aller Recipes |
| `data/badge-recipe.json` | Canonical v3.1 | 4 Achsen, 8 Specimens |
| `data/button-recipe.json` | Canonical v3.1 | 4 Achsen, 8 Specimens |
| `data/card-recipes.json` | Legacy v1.0 | Flat Recipes, Migration ausstehend |
| `packages/recipe-sdk/index.js` | Canonical SDK (ESM) | Validation, Expansion, Derivation |
| `scripts/validate-recipe-schema.js` | Schema Validator | Lightweight Draft 2020-12 Subset |
| `scripts/lint-recipes.mjs` | CI Gate (ESM) | Discovers + validates all recipes |

## JSON Schema

Alle Recipes werden gegen `data/recipe-schema.json` (Draft 2020-12) validiert. Das Schema definiert:

- Alle 9 Pflicht-Sektionen mit Typ, Pattern und Enum-Constraints
- Wiederverwendbare `$defs` (slot, axis, axisValue, stateRule, a11yOverride, condition, tokenGroup, specimen)
- `additionalProperties: true` auf Section-Ebene fuer Erweiterbarkeit

### Erweiterbarkeit: Strict Core, Open Extensions

Das Schema ist bewusst in zwei Schichten aufgebaut:

1. **Strict Core** — Pflichtfelder, Typen, Enums und Referenzen sind typsicher validiert
2. **Open Extensions** — Jede Section erlaubt zusaetzliche Properties (`additionalProperties: true`)

Konventionen fuer Extensions:
- Prefix `x-` fuer experimentelle Felder (z.B. `"x-figmaNodeId"`)
- `schemaVersion`-gated Requirements: Neue Pflichtfelder nur mit neuer Minor-Version
- Deprecation Warnings statt Breaking Errors bei Evolution

### Referenz in Recipe-Dateien

Jede Recipe-Datei verweist auf das Schema:

```json
{
  "$schema": "./recipe-schema.json",
  "meta": { "schemaVersion": "3.1.0", ... }
}
```

## CI-Integration

```bash
npm run lint:recipes          # Strukturvalidierung (Teil von npm test)
npm run lint:recipes:strict   # + Token-Coverage + SCSS-Paritaet
```

Das Lint-Script (`scripts/lint-recipes.mjs`) nutzt die SDK (`packages/recipe-sdk/index.js`) und prueft:

### Phase 1 — JSON Schema Validation

Strukturelle Validierung gegen `data/recipe-schema.json`:
- Pflichtfelder (required), Typen, Enums, Patterns
- `$ref`-Aufloesung fuer Sub-Schemas
- `oneOf`-Branching (z.B. `modifier: string | null`, `matrix.axes.*: "*" | string[]`)

### Phase 2 — Semantische Cross-Field Checks

Programmatische Validierung die ueber Schema-Faehigkeiten hinausgeht:
- `axes.*.values.*.tokenGroups` MUESSEN in `styling.tokenGroups` existieren
- `states.rules[].onlyWhen` darf nur bekannte `axes`-Werte und `states` referenzieren
- `a11y.overrides[].when` und `constraints.rules[].when` pruefen Achsen-Referenzen
- `specimens[].matrix.axes` darf nur definierte Achsen und Werte verwenden
- `styling.baseTokenGroups` MUESSEN als Keys in `styling.tokenGroups` existieren

### Phase 3 — Token-Coverage + SCSS-Paritaet (strict only)

3. **Token-Coverage** — Recipe-Tokens vs. `design-tokens.json`
4. **SCSS-Paritaet** — CSS Custom Properties vs. Token-Registry
5. **Specimen-Sanity** — Matrix-Expansion, Zell-Anzahl, Duplikate

---

## Schema-Ueberblick

```
{
  meta            — Metadaten (Version, Status, Links)
  anatomy         — Root-Element, Slots, DOM-Hinweise
  axes            — Variationsachsen (Tone, Size, Emphasis, ...)
  states          — Unterstuetzte Zustaende + Precedence
  a11y            — Barrierefreiheit (Base + kontextuelle Overrides)
  constraints     — Regeln + Copy-Einschraenkungen
  styling         — CSS-Klassen + Token-Gruppen
  recipes         — Ableitungsregeln
  specimens       — Matrix-basierte Testmuster
}
```

---

## 1. meta (Pflicht)

```json
{
  "meta": {
    "schemaVersion": "3.1.0",
    "component": "badge",
    "version": "2.1.0",
    "status": "stable",
    "tags": ["static", "indicator"],
    "links": {
      "figma": "https://...",
      "storybook": "",
      "docs": "/docs/badge-docs"
    }
  }
}
```

| Feld | Typ | Pflicht | Werte |
|---|---|---|---|
| `schemaVersion` | string | ja | `"3.1.0"` |
| `component` | string | ja | Komponenten-ID (kebab-case) |
| `version` | string | ja | Semver der Recipe-Datei |
| `status` | string | ja | `"draft"`, `"stable"`, `"deprecated"` |
| `tags` | string[] | ja | Klassifikation |
| `links` | object | nein | Externe Referenzen |

---

## 2. anatomy (Pflicht)

```json
{
  "anatomy": {
    "root": { "element": ".nc-badge" },
    "slots": [
      { "name": "icon", "element": ".nc-badge__icon", "optional": true },
      { "name": "label", "element": ".nc-badge__label", "optional": false }
    ],
    "domNotes": [
      "Badge ist NIEMALS fokussierbar."
    ]
  }
}
```

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `root` | object | ja | Root-Element mit CSS-Klasse |
| `slots` | array | ja | Benannte Slots mit BEM-Klasse + optional-Flag |
| `domNotes` | string[] | nein | Freitext-Hinweise zum DOM |

---

## 3. axes (Pflicht)

Jede Achse definiert benannte Werte mit CSS-Modifier und Token-Zuordnung.

```json
{
  "axes": {
    "tone": {
      "label": "Tone",
      "description": "Farb-Semantik",
      "values": {
        "default":   { "modifier": null,                  "tokenGroups": ["tone-default"] },
        "success":   { "modifier": "nc-badge--success",   "tokenGroups": ["tone-success"] }
      }
    }
  }
}
```

### Achsen-Wert Felder

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `modifier` | string\|null | ja | CSS-Klasse (`null` = Default, kein Modifier) |
| `tokenGroups` | string[] | ja | Token-Gruppen die dieser Wert aktiviert |
| `slotConfig` | object | nein | Slot-Aktivierung `{ icon: true }` |
| `excludeAxes` | string[] | nein | Achsen die dieser Wert ausschliesst |
| `renderHint` | string | nein | Steuerung fuer Arena-Rendering |
| `elementHint` | string | nein | DOM-Element Override (`"a"` statt `"button"`) |

### Regeln

- Jede Achse MUSS mindestens einen Default-Wert haben (`modifier: null`)
- `tokenGroups` MUSS immer explizit definiert sein (auch wenn leer: `[]`)
- `excludeAxes` referenziert nur Achsen-IDs die in `axes` existieren

### Beispiel-Achsen

| Achse | Zweck | Beispielwerte |
|---|---|---|
| `tone` / `variant` | Farb-/Intent-Semantik | default, success, error, info, primary |
| `emphasis` | Visuelle Gewichtung | solid, outline, soft |
| `size` | Groessenabstufung | xs, sm, md, lg |
| `pattern` | Render-Muster | standard, with-icon, icon-only |
| `decorator` | Zusatz-Elemente | none, icon, dot, counter |
| `composition` | Verwendungskontext | single, group, toggle, link |

---

## 4. states (Pflicht)

```json
{
  "states": {
    "supported": ["default", "hover", "active", "focus-visible", "disabled", "loading"],
    "precedence": ["disabled", "loading", "active", "hover", "focus-visible", "default"],
    "interactive": true,
    "rules": [
      {
        "state": "loading",
        "effects": ["blockInteraction"],
        "attributes": { "aria-busy": true },
        "slotConfig": { "spinner": true },
        "tokenGroups": ["spinner"]
      },
      {
        "state": "disabled",
        "effects": ["blockInteraction"],
        "attributes": { "disabled?": true, "aria-disabled": true },
        "tokenGroups": ["state-disabled"]
      }
    ]
  }
}
```

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `supported` | string[] | ja | Alle unterstuetzten States |
| `precedence` | string[] | ja | Auswertungsreihenfolge (erstes gewinnt) |
| `interactive` | boolean | nein | Convenience-Flag |
| `rules` | array | ja | State-spezifische Regeln |

### State-Rule Felder

| Feld | Typ | Beschreibung |
|---|---|---|
| `state` | string | State-Name (muss in `supported` sein) |
| `effects` | string[] | `"blockInteraction"` etc. |
| `attributes` | object | HTML/ARIA Attribute |
| `slotConfig` | object | Slot-Aktivierung |
| `tokenGroups` | string[] | Zusaetzliche Token-Gruppen |
| `onlyWhen` | object | Bedingung: `{ axes: { composition: ["toggle"] } }` |

### Nicht-interaktive Komponenten

```json
{
  "states": {
    "supported": ["default"],
    "precedence": ["default"],
    "rules": [],
    "interactive": false
  }
}
```

---

## 5. a11y (Pflicht)

```json
{
  "a11y": {
    "base": {
      "interactive": false,
      "contrastTarget": "WCAG AA normal text (4.5:1)",
      "assertions": ["hasAccessibleName", "doNotRelyOnColorOnly"],
      "note": "Badge ist nicht interaktiv."
    },
    "overrides": [
      {
        "when": { "axes": { "decorator": ["dot"] } },
        "require": ["aria-label"],
        "contrastTarget": "WCAG AA non-text (3:1)",
        "note": "Dot-Mode benoetigt aria-label."
      }
    ]
  }
}
```

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `base` | object | ja | Basis-A11y fuer alle Instanzen |
| `overrides` | array | nein | Kontextuelle A11y-Regeln |

### Override-Felder

| Feld | Typ | Beschreibung |
|---|---|---|
| `when` | object | Bedingung: `{ axes: {...} }` oder `{ states: [...] }` |
| `require` | string[] | Pflicht-Attribute |
| `suggest` | string[] | Empfohlene Attribute |
| `contrastTarget` | string | Override des Kontrast-Ziels |
| `note` | string | Freitext-Hinweis |

---

## 6. constraints (Optional)

```json
{
  "constraints": {
    "rules": [
      { "when": { "axes": { "pattern": ["icon-only"] } }, "require": ["aria-label"] }
    ],
    "copy": {
      "label": { "maxChars": 20, "truncation": "ellipsis" },
      "counter": { "maxValue": 99, "overflowLabel": "99+" }
    }
  }
}
```

---

## 7. styling (Pflicht)

```json
{
  "styling": {
    "baseClasses": ["nc-badge"],
    "baseTokenGroups": ["core-geometry", "core-typography"],
    "tokenGroups": {
      "core-geometry": {
        "label": "Geometry",
        "tokens": ["nc-badge-height-sm", "nc-badge-height-md", "nc-badge-radius"]
      },
      "tone-success": {
        "label": "Success",
        "tokens": ["nc-badge-success-bg", "nc-badge-success-color", "nc-badge-success-border"]
      }
    }
  }
}
```

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `baseClasses` | string[] | ja | CSS-Klassen fuer jede Instanz |
| `baseTokenGroups` | string[] | ja | Token-Gruppen fuer jede Instanz |
| `tokenGroups` | object | ja | Benannte Token-Gruppen mit Token-IDs |

### Regeln

- Jede Token-ID in `tokenGroups.*.tokens` MUSS in `design-tokens.json` existieren
- `baseTokenGroups` MUSS auf existierende Keys in `tokenGroups` verweisen
- Achsen-Wert `tokenGroups` (z.B. `["tone-success"]`) MUESSEN in `styling.tokenGroups` existieren
- Leere Token-Arrays sind erlaubt (z.B. `emphasis-soft` nutzt CSS-Technik statt eigener Tokens)

---

## 8. recipes (Pflicht)

```json
{
  "recipes": {
    "mode": "derived",
    "derive": {
      "from": ["axes", "states", "styling.tokenGroups"],
      "output": ["classList", "resolvedTokens", "a11yAssertions"]
    },
    "resolution": {
      "classList": [
        "styling.baseClasses",
        "axes.*.values.*.modifier"
      ],
      "tokenGroups": [
        "styling.baseTokenGroups",
        "axes.*.values.*.tokenGroups"
      ]
    }
  }
}
```

| Mode | Beschreibung |
|---|---|
| `derived` | Recipes werden aus Achsen berechnet (v3.1 Standard) |
| `static` | Handgeschriebene Recipe-Liste (Legacy/Card) |

---

## 9. specimens (Pflicht)

Specimens definieren Testmuster als Matrizen ueber die Achsen.

```json
{
  "specimens": [
    {
      "id": "emphasis-grid",
      "label": "Emphasis x Tone",
      "description": "Solid, Outline und Soft je Tone",
      "matrix": {
        "axes": { "tone": "*", "emphasis": "*", "size": ["md"], "decorator": ["none"] },
        "states": ["default"]
      },
      "focusTokenGroups": ["tone-default", "emphasis-outline"],
      "layout": "grid",
      "layoutConfig": { "rowAxis": "tone", "colAxis": "emphasis" },
      "render": { "label": "{tone}" },
      "a11y": {
        "contrastTarget": "WCAG AA normal text (4.5:1)",
        "note": "Alle Emphasis-Varianten muessen Kontrast einhalten."
      }
    }
  ]
}
```

### Specimen-Felder

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `id` | string | ja | Eindeutige ID |
| `label` | string | ja | Anzeigename |
| `description` | string | nein | Beschreibung |
| `matrix` | object | ja | Achsen-Werte + States |
| `matrix.axes` | object | ja | `{ axisId: "*" \| string[] }` |
| `matrix.states` | string[] | ja | Aktive States |
| `focusTokenGroups` | string[] | nein | Override fuer Inspector-Filterung |
| `layout` | string | ja | `"row"`, `"grid"`, `"composition"` |
| `layoutConfig` | object | nein | Grid-Konfiguration |
| `render` | object | nein | Render-Steuerung |
| `composes` | string[] | nein | Komposition mit anderen Komponenten |
| `a11y` | object | nein | Specimen-spezifische A11y-Checks |

### Matrix-Wildcards

- `"*"` — alle Werte der Achse (expandiert automatisch)
- `["md"]` — nur die angegebenen Werte
- Achsen die nicht in der Matrix stehen werden uebersprungen

### focusTokenGroups

Optional. Wenn definiert, steuert es welche Token-Gruppen der Inspector anzeigt (unabhaengig von der Matrix). Ohne `focusTokenGroups` wird die Union aller Token-Gruppen aller Matrix-Werte berechnet.

### Layout-Typen

| Layout | Beschreibung |
|---|---|
| `row` | Flexbox-Reihe aller Zellen |
| `grid` | Gruppiert nach `layoutConfig.rowAxis` / `colAxis` |
| `composition` | Spezial-Rendering (Button-Group, Avatar+Badge) |

---

## SDK (packages/recipe-sdk/)

Kanonische Engine als ESM-Modul. Alle Konsumenten importieren von hier.

### API

```javascript
import {
  // Loading
  loadRecipe,              // (raw) → canonical v3.1 (full object)

  // Validation (CI)
  validateRecipe,          // (recipe, { schema?, validateAgainstSchema? }?) → { errors, warnings }
  validateTokenCoverage,   // (recipe, registry) → { errors, warnings }
  validateScssParity,      // (scssContent, registryComponent, componentId) → { errors, warnings }
  validateSpecimenSanity,  // (recipe) → { errors, warnings }

  // Matrix Expansion
  expandSpecimenMatrix,    // (specimen, recipe) → cells[]

  // Cell Resolution
  resolveClassList,        // (cell, recipe) → string[]
  resolveTokenGroups,      // (cell, recipe) → string[]
  resolveA11y,             // (cell, recipe) → { base, overrides: [matching] }
  renderModel,             // (cell, recipe) → { slotConfig, renderHint, elementHint }

  // Grouping
  groupCellsByAxis,        // (cells, rowAxis) → [{ key, label, cells }]

  // Backward Compat (deprecated)
  expandMatrix,            // (specimen, axes, baseClasses) → cells[]
  specimenTokenGroups,     // (specimen, axes, baseTokenGroups) → string[]
  deriveRecipe,            // (axes, baseClasses, baseTokenGroups, axisValues) → recipe

  // Utility
  capitalize               // (s) → string
} from 'recipe-sdk';
```

### loadRecipe(raw)

Normalisiert und laedt Recipe-Daten in kanonische v3.1 Form.
Gibt immer das vollstaendige Objekt mit allen 9 Sektionen zurueck.
Unterstuetzt v3.0 (`variantAxes`, top-level `baseClasses`) und v3.1 (`axes`, `styling` Container).

### expandSpecimenMatrix(specimen, recipe)

Vereinfachte 2-Argument API. Extrahiert `axes` und `baseClasses` intern.
Rueckgabe: `[{ id, axisValues, classes, slotConfig, renderHint }]`

### resolveClassList / resolveTokenGroups / resolveA11y / renderModel

Per-Cell Resolution Funktionen. Loesen CSS-Klassen, Token-Gruppen, A11y-Regeln
und Render-Hints fuer eine einzelne Zelle aus dem Recipe auf.

### validateRecipe(recipe, opts?)

Schema + Validator werden via `opts.schema` und `opts.validateAgainstSchema` injiziert.
Haelt das SDK browser-sicher (kein fs/path). Ohne Parameter: nur Phase 2 (Semantik).

---

## Konsumenten

| Konsument | Datei | Nutzt |
|---|---|---|
| CI Lint | `scripts/lint-recipes.mjs` | loadRecipe, validateRecipe, validateTokenCoverage, validateScssParity, validateSpecimenSanity |
| Theme Configurator | `ButtonArena.vue`, `BadgeArena.vue` | loadRecipe, expandSpecimenMatrix, specimenTokenGroups, groupCellsByAxis, capitalize |
| Docs (zukuenftig) | — | loadRecipe, expandSpecimenMatrix, resolveA11y |
| Figma Plugin (zukuenftig) | — | loadRecipe, resolveClassList, renderModel |

---

## Migration v1.0 → v3.1

Fuer Legacy-Recipes (z.B. `card-recipes.json`):

1. `meta` ergaenzen
2. `behaviors` → `axes` umwandeln (jeder Modifier wird Achsen-Wert)
3. `recipes[]` → `specimens[]` mit Matrix-Definition
4. `tokenGroups` → `styling.tokenGroups`
5. `stateMatrix` → `states` mit Rules
6. `lint:recipes:strict` ausfuehren und alle Fehler beheben
