# NEO Design System — Schulung & Architektur-Dokumentation

> Version 1.0 | Stand: 2026-03-27
> Zielgruppe: Frontend-Entwickler, Theme-Integratoren, Drupal-Entwickler

---

## Lernziele

Nach dieser Schulung verstehen die Teilnehmer:

1. **Verstaendnis:** Warum das NEO Design System auf Recipes statt starrer Komponenten basiert und wie das 3-Layer Token-System aufgebaut ist.
2. **Anwendung:** Wie ein Theme in der Konfig-App konfiguriert und nach Drupal uebertragen wird.
3. **Maintenance:** Wie das System in Storybook erweitert wird, ohne die Konsistenz zu brechen.

---

## Inhaltsverzeichnis

1. [Vision & Architektur](#1-vision--architektur)
2. [Das Token-System](#2-das-token-system)
3. [Die Recipe-Philosophie](#3-die-recipe-philosophie)
4. [Die Tool-Chain](#4-die-tool-chain)
5. [Theme-Konfiguration & White-Label](#5-theme-konfiguration--white-label)
6. [Maintenance & Erweiterung](#6-maintenance--erweiterung)
7. [Component Deep-Dives](#7-component-deep-dives)

---

# 1. Vision & Architektur

## 1.1 Warum ein Design System?

Das NEO Design System ist die zentrale Quelle fuer alle visuellen und interaktiven Entscheidungen. Es loest drei fundamentale Probleme:

- **Inkonsistenz:** Ohne zentrales System werden Buttons, Farben und Abstaende in jedem Projekt anders implementiert.
- **Skalierung:** Bei 111+ Komponenten und 4 Themes (Light/Dark × Neo/Customer) ist manuelle Pflege unmoeglich.
- **Multi-Plattform:** Dasselbe Design muss in Drupal, Storybook und der Konfig-App konsistent erscheinen.

## 1.2 Die 10-Schichten-Architektur (ITCSS + Atomic Design)

Das NEO System basiert auf der ITCSS-Methodik (Inverted Triangle CSS) kombiniert mit Atomic Design:

```
Layer 00: Settings     → Design Tokens, Farben, Spacing, Typography (keine CSS-Ausgabe)
Layer 01: Tools         → SCSS Funktionen & Mixins (keine CSS-Ausgabe)
Layer 02: Generic       → Reset, Fonts, Keyframe-Animationen
Layer 03: Elements      → HTML-Element-Defaults (body, headings, links, forms)
Layer 04: Objects       → Layout-Primitiven (Container, Grid, Section, Aspect-Ratio)
Layer 05: Atoms         → Kleinste Komponenten (Button, Input, Badge, Chip)
Layer 06: Molecules     → Kombinationen (Card, Accordion, Tabs, Search)
Layer 07: Organisms     → Komplexe Sektionen (Hero, Navigation, Modal, Data-Table)
Layer 08: Templates     → Seiten-Layouts (Dashboard, Content-Page, Form-Page)
Layer 10: Utilities     → Hilfsklassen (.u-sr-only, Spacing, Visibility)
```

**Prinzip:** Jede Schicht hat steigende Spezifitaet. Settings definieren *was*, Atoms definieren *wie*, Organisms definieren *wohin*.

## 1.3 Die Pipeline

Jede Komponente durchlaeuft eine 6-stufige Pipeline:

```
Recipe JSON  →  SCSS  →  Storybook  →  Theme Configurator  →  Drupal  →  Docs
  (Spec)      (Impl.)   (Vorschau)     (Konfiguration)       (CMS)    (Referenz)
```

Das **Component Registry** (`data/component-registry.json`) trackt den Status jeder Komponente ueber alle 6 Stufen. Es wird automatisch generiert:

```bash
npm run registry
```

---

# 2. Das Token-System

## 2.1 Drei Schichten — vom Primitiv zum Komponent

Das Herzstueck des NEO Design Systems ist ein 3-Layer Token-System. Jede Schicht abstrahiert die darunterliegende:

### Schicht 1: Primitives (`--fnd-color-{palette}-{shade}`)

Rohe Designwerte ohne Semantik. Die Farbpaletten definieren Shades von 100 (hell) bis 950 (dunkel):

```css
:root {
  --fnd-color-primary-500: #002049;   /* Neo Darkblue */
  --fnd-color-secondary-500: #009fe3; /* Neo Blue */
  --fnd-color-accent-500: #37e93d;    /* Neo Lime */
  --fnd-color-neutral-500: #64748b;   /* Grau */
}
```

**Regel:** Primitives werden NIE direkt in Komponenten verwendet. Sie sind die Rohstoffe fuer die naechste Schicht.

### Schicht 2: Semantic Tokens (`--fnd-color-{role}`)

Theme-aware Zuordnungen. Diese Tokens aendern ihren Wert je nach aktivem Theme:

```css
/* Neo Light Theme */
:root {
  --fnd-color-text-primary: #0f172a;
  --fnd-color-background-base: #ffffff;
  --fnd-color-interactive-default: #002049;
}

/* Neo Dark Theme */
.neo-dark-theme {
  --fnd-color-text-primary: #f8fafc;
  --fnd-color-background-base: #000000;
  --fnd-color-interactive-default: #009fe3;
}
```

**Regel:** Semantische Tokens definieren *Rollen*, nicht *Farben*. `text-primary` ist "die wichtigste Textfarbe" — ob das Schwarz oder Weiss ist, entscheidet das Theme.

### Schicht 3: Component Tokens (`--nc-{component}-{property}`)

Komponentenspezifische Tokens. Jede Komponente referenziert NUR ihre eigenen `--nc-*` Tokens:

```css
:root {
  --nc-button-primary-bg: var(--fnd-color-interactive-default);
  --nc-button-primary-bg-hover: var(--fnd-color-interactive-hover);
  --nc-button-primary-color: var(--fnd-color-text-on-interactive);
  --nc-button-height-md: var(--fnd-size-md); /* 40px */
  --nc-button-radius-md: var(--fnd-radius-sm); /* 4px */
}
```

**Regel:** Komponenten-SCSS referenziert IMMER `var(--nc-*)`. NIE direkte Foundation-Tokens. Dadurch kann jeder Token-Wert per Scope ueberschrieben werden:

```css
/* Alle Buttons in einer Hero-Section rot machen */
.nc-hero { --nc-button-primary-bg: var(--fnd-color-feedback-danger); }
```

## 2.2 Das Override-Pattern (`--mod-*`)

Seit Phase 4 verwenden alle Komponenten ein Fallback/Override-Pattern (inspiriert von Adobe Spectrum):

```scss
// In der Komponente (05-atoms/_button.scss):
background-color: var(--mod-button-primary-bg, var(--nc-button-primary-bg));
```

Das `--mod-*` Token ist NIRGENDS deklariert — es existiert nur als Hook. Externe Konsumenten (White-Label-Kunden, Drupal-Themes) koennen es setzen:

```css
/* Kunden-Override — ohne NEO-Quellen zu aendern */
.customer-theme {
  --mod-button-primary-bg: #ff6600;
}
```

**Hierarchie:** `--mod-*` (Override) → `--nc-*` (Component) → `--fnd-*` (Foundation) → Primitives

## 2.3 Weitere Foundation-Token-Kategorien

Neben Farben definiert das System Tokens fuer:

| Kategorie | Prefix | Beispiel | Stufen |
|-----------|--------|---------|--------|
| **Spacing** | `--fnd-spacing-*` | `--fnd-spacing-04` = 16px | 13 (01-13), 06-13 fluid |
| **Typography** | `--fs-*` | `--fs-lg`, `--fs-3xl` | 14 (2xs-9xl), alle fluid |
| **Font Weight** | `--fnd-font-weight-*` | `--fnd-font-weight-semibold` = 600 | 6 |
| **Radii** | `--fnd-radius-*` | `--fnd-radius-md` = 6px | 10 (null-full) |
| **Shadow** | `--fnd-shadow-*` | `--fnd-shadow-md` | 5 (xs-xl) |
| **Elevation** | `--fnd-elevation-*` | `--fnd-elevation-overlay` | 5 (base-modal) |
| **Border** | `--fnd-border-width-*` | `--fnd-border-width-sm` = 2px | 6 |
| **Opacity** | `--fnd-opacity-*` | `--fnd-opacity-disabled` = 0.5 | 10 |
| **Z-Index** | `--fnd-z-*` | `--fnd-z-drawer` = 300 | 10 |
| **Motion** | `--fnd-duration-*` | `--fnd-duration-normal` = 200ms | 5 |
| **Size Scale** | `--fnd-size-*` | `--fnd-size-md` = 40px | 6 (xs-2xl) |

**Anti-Generisch-Regeln:** Keine hardcodierten Werte in Komponenten. Keine `px`-Font-Sizes, keine numerischen `font-weight`, keine magischen `z-index`-Zahlen. Der Token-Lint (`npm run lint:tokens`) erzwingt dies automatisch.

## 2.4 State-Derivation

Hover- und Active-Zustaende werden algorithmisch aus einer Basis-Farbe abgeleitet:

```scss
// In _component-tokens.scss:
@include state.state-colors(
  --nc-button-success-bg,
  var(--fnd-color-feedback-success)
);

// Erzeugt automatisch:
//   --nc-button-success-bg:        var(--fnd-color-feedback-success);
//   --nc-button-success-bg-hover:  color-mix(in srgb, ... 85%, var(--fnd-state-mix-target));
//   --nc-button-success-bg-active: color-mix(in srgb, ... 75%, var(--fnd-state-mix-target));
```

Die Prozentsaetze sind als CSS Custom Properties konfigurierbar:

```css
:root {
  --fnd-state-bold-hover: 85%;   /* Hover = 15% dunkler/heller */
  --fnd-state-bold-active: 75%;  /* Active = 25% dunkler/heller */
}
```

`--fnd-state-mix-target` kehrt automatisch die Richtung um: Im Light Mode wird abgedunkelt, im Dark Mode aufgehellt. Dadurch brauchen Hover/Active-States KEINEN separaten Dark-Mode-Override.

---

# 3. Die Recipe-Philosophie

## 3.1 Was ist ein Recipe?

Ein Recipe ist eine **maschinenlesbare Komponenten-Spezifikation** in JSON. Es beschreibt WAS eine Komponente ist, nicht WIE sie implementiert wird. Ein Recipe ist framework-agnostisch — es kann von Storybook, der Konfig-App, Drupal oder einem zukuenftigen Web-Components-Framework konsumiert werden.

```
data/button-recipe.json     → 111 Recipes total
data/card-recipe.json
data/accordion-recipe.json
...
```

## 3.2 Warum Recipes statt starrer Komponenten?

| Aspekt | Starre Komponente | Recipe |
|--------|-------------------|--------|
| **Framework** | React/Vue/Angular | Framework-agnostisch (JSON) |
| **Varianten** | Im Code verstreut | Deklarativ als Axes |
| **Tokens** | Im CSS vergraben | Explizit als tokenGroups |
| **Dokumentation** | Separat gepflegt | Aus Recipe generiert |
| **Tests** | Manuell geschrieben | Aus Specimens abgeleitet |
| **A11y** | Hoffentlich beachtet | Formal spezifiziert |
| **Multi-Consumer** | Ein Framework | Storybook + Konfig-App + Drupal + Docs |

## 3.3 Aufbau eines Recipes

Jedes Recipe folgt dem Schema v3.1.0 mit diesen Bloecken:

```json
{
  "meta": {
    "component": "button",
    "version": "2.0.0",
    "status": "stable",
    "layer": "atom",
    "pipeline": { "scss": [...], "story": "...", "arena": "...", "docs": "..." }
  },

  "anatomy": {
    "root": { "element": ".nc-button" },
    "slots": [
      { "name": "icon", "element": ".nc-button__icon", "optional": true },
      { "name": "label", "element": ".nc-button__label", "optional": false }
    ]
  },

  "axes": {
    "variant": {
      "values": [
        { "value": "primary", "modifier": null },
        { "value": "secondary", "modifier": "nc-button--secondary" }
      ]
    },
    "size": {
      "values": [
        { "value": "sm", "modifier": "nc-button--sm" },
        { "value": "md", "modifier": null, "default": true },
        { "value": "lg", "modifier": "nc-button--lg" }
      ]
    }
  },

  "states": {
    "supported": ["default", "hover", "active", "focus-visible", "disabled", "loading"]
  },

  "styling": {
    "baseClasses": ["nc-button"],
    "tokenGroups": { ... }
  },

  "keyboard": {
    "Enter": { "action": "activate" },
    "Space": { "action": "activate" }
  },

  "testSelectors": {
    "root": "[data-testid='button']",
    "label": "[data-testid='button-label']"
  },

  "a11y": { ... },
  "specimens": [ ... ]
}
```

### Logische Trennung der Varianten

Recipes trennen Variationen in **orthogonale Achsen** (Axes):

- **Size** — Geometrie (xs, sm, md, lg). Betrifft Hoehe, Padding, Font-Size.
- **Intent/Variant** — Semantik (primary, secondary, success, error). Betrifft Farben.
- **State** — Interaktion (hover, focus, disabled, loading). Betrifft Opacity, Cursor, Pointer-Events.
- **Pattern** — Slot-Konfiguration (standard, with-icon, icon-only). Betrifft DOM-Struktur.

Diese Achsen sind **unabhaengig kombinierbar**: Ein `success`-Button in Groesse `sm` im State `loading` ist eine gueltige Kombination, ohne dass sie einzeln definiert werden muss.

---

# 4. Die Tool-Chain

## 4.1 Datenfluss-Uebersicht

```
design-tokens.json ──→ generate-tokens.js ──→ _tokens-*.generated.scss
                                                      ↓
                                              _component-tokens.scss
                                                      ↓
                                               main.scss ──→ styles.css
                                                      ↓
*-recipe.json ──→ generate-stories.mjs ──→ stories/*.stories.js ──→ Storybook
      ↓                                                               ↑
      ↓           useRecipeLoader.js ──→ *Arena.vue ──→ Theme Configurator
      ↓
      └──→ neo_theme.theme ──→ *.html.twig ──→ Drupal Rendering
```

## 4.2 Design-Entscheidung in der Konfig-App

Die **Theme Configurator App** (`apps/theme-configurator/`) ist eine Vue-Anwendung die Token-Werte live aendert.

**Workflow:**
1. Entwickler oeffnet die Konfig-App (`npm run dev` → `localhost:3000/config/theme-config.html`)
2. Im Foundation-Panel: Farben, Spacing, Radii, Shadows anpassen
3. Im Laboratory-Panel: Komponenten-Arenas zeigen die Aenderungen live
4. Export: Geaenderte Token-Werte als CSS-Datei oder JSON exportieren

**Arena-Komponenten** (`*Arena.vue`) laden das zugehoerige Recipe via `useRecipeLoader`:

```javascript
// In CardArena.vue:
import { useRecipeLoader } from '../composables/useRecipeLoader'
const { recipe, loading } = useRecipeLoader('card')
```

Der Loader nutzt Vite Code-Splitting — jedes Recipe wird lazy geladen. Die Arena rendert dann alle Specimens aus dem Recipe als Live-Vorschau.

## 4.3 Visualisierung & Test in Storybook

**Storybook** (`npm run storybook` → `localhost:6006`) zeigt alle Komponenten als interaktive Stories.

**Recipe → Story Generierung:**

```bash
npm run generate:stories
```

Das Script `generate-stories.mjs` liest alle `data/*-recipe.json` Dateien und generiert `stories/{layer}/{component}.stories.js`. Jedes Specimen im Recipe wird zu einer eigenen Story:

```
button-recipe.json
  └→ specimens:
      ├→ "all-variants" → AllVariantsMD Story
      ├→ "size-scale"   → SizeScaleXSSMMDLG Story
      └→ "with-icon"    → WithIcon Story
```

**Foundation Stories** (nicht aus Recipes generiert) befinden sich in `stories/foundations/`:
- Colors, Typography, Spacing, Shadow, Radii, Border, Motion, Opacity, Breakpoints, Layout, Icons, Size Scale, Accessibility, Interaction States

## 4.4 Integration in Drupal

### Block-Typ-Pattern

Jede Makro-Komponente (Hero, Card-Grid, Accordion, etc.) wird als Drupal Block Content Type implementiert:

```
1. BlockContentType:     neo_hero
2. FieldStorageConfig:   field_hero_headline, field_hero_subline, ...
3. FieldConfig:          Instanz-Konfiguration pro Feld
4. Form Display:         Widget-Konfiguration (WYSIWYG, Select, etc.)
5. View Display:         Alle Felder hidden — Template rendert
6. Twig Templates:       block--inline-block--neo-hero.html.twig
                          block--block-content--neo-hero.html.twig
7. JS Behavior:          In neo-theme.js (falls noetig)
```

### Template-Pattern

Alle Templates folgen demselben Muster:

```twig
{# 1. Felder aus neo_fields extrahieren #}
{% set f = neo_fields|default({}) %}
{% set headline = f.field_hero_headline|default('') %}
{% set bg_color = f.field_hero_bg_color|default('var(--fnd-color-always-dark)') %}

{# 2. Component-Tokens per Inline-Style ueberschreiben #}
{% set hero_style = 'background-color: ' ~ bg_color %}

{# 3. NEO BEM-Klassen verwenden #}
<div{{ attributes }}>
  <section class="nc-hero" style="{{ hero_style }}">
    <div class="nc-hero__content">
      <h1 class="nc-hero__headline">{{ headline }}</h1>
    </div>
  </section>
</div>
```

### Recipe → Drupal Mapping

| Recipe-Konzept | Drupal-Aequivalent |
|---------------|-------------------|
| `anatomy.root.element` | CSS-Klasse im Template (`.nc-hero`) |
| `anatomy.slots` | Twig-Template-Bereiche |
| `axes.variant` | Drupal-Feld (z.B. `field_hero_height` → Select Widget) |
| `styling.tokenGroups` | CSS Custom Properties via `style=""` im Template |
| `a11y.base.role` | ARIA-Attribute im Template |

### Konfig-Export → Drupal

Wenn ein Theme in der Konfig-App konfiguriert wird, erzeugt es eine CSS-Datei mit Token-Overrides. Diese wird in Drupal eingebunden:

```php
// In neo_theme.info.yml:
libraries:
  - neo_theme/global
  - neo_theme/customer-overrides  // ← Token-Overrides aus der Konfig-App
```

---

# 5. Theme-Konfiguration & White-Label

## 5.1 Die 4 Themes

| Theme | Klasse | Verwendung |
|-------|--------|-----------|
| Neo Light | `.neo-light-theme` (Default auf `:root`) | Standard-Theme |
| Neo Dark | `.neo-dark-theme` | Dunkler Modus |
| Customer Light | `.customer-light-theme` | Kunden-Branding (heller Hintergrund) |
| Customer Dark | `.customer-dark-theme` | Kunden-Branding (dunkler Hintergrund) |

Theme-Wechsel geschieht per CSS-Klasse auf dem HTML-Element oder per `data-theme` Attribut:

```html
<html data-theme="neo-dark-theme">
```

`prefers-color-scheme: dark` schaltet automatisch zum Dark Theme. `data-theme` ueberschreibt die automatische Erkennung.

## 5.2 Base/Theme CSS Split

Das Build-System erzeugt zwei CSS-Dateien:

```bash
npm run build:css     # → styles.css (959 KB, alles)
npm run build:theme   # → styles-theme.css (165 KB, nur Tokens + Themes)
```

White-Label-Kunden laden:
```html
<link rel="stylesheet" href="styles.css">        <!-- Struktur + Tokens -->
<link rel="stylesheet" href="customer-theme.css"> <!-- Ueberschreibt nur Tokens -->
```

Ein Override-Template steht bereit:
```bash
npm run build:theme:template  # → styles-theme-override.template.css
```

## 5.3 Override-Hierarchie

Drei Ebenen der Anpassung, von global bis komponentenspezifisch:

```css
/* 1. Foundation-Level: Aendert ALLE Komponenten */
:root { --fnd-color-interactive-default: #ff6600; }

/* 2. Component-Level: Aendert eine spezifische Komponente */
:root { --nc-button-primary-bg: #ff6600; }

/* 3. Mod-Level: Externes Override ohne System-Quellen zu aendern */
:root { --mod-button-primary-bg: #ff6600; }

/* 4. Scope-Level: Aendert nur innerhalb eines Containers */
.hero-section { --mod-button-primary-bg: var(--fnd-color-always-light); }
```

---

# 6. Maintenance & Erweiterung

## 6.1 Neue Komponente hinzufuegen

### Schritt 1: Recipe erstellen

```bash
# Neues Recipe anlegen (Schema v3.1.0)
cp data/button-recipe.json data/neue-komponente-recipe.json
# Anpassen: meta.component, anatomy, axes, states, styling, specimens
```

Mindestens diese Bloecke muessen definiert sein:
- `meta` (component, version, status, tags)
- `anatomy` (root, slots)
- `axes` (mindestens eine Variationsachse)
- `states` (supported, rules)
- `styling` (baseClasses, tokenGroups)
- `specimens` (mindestens ein Testmuster)
- `a11y` (base assertions)

### Schritt 2: SCSS implementieren

```scss
// scss/scss/05-atoms/_neue-komponente.scss (oder 06/07 je nach Komplexitaet)
@use '../01-tools' as *;

.nc-neue-komponente {
  // Component Tokens konsumieren (IMMER mit --mod-* Wrapper)
  background: var(--mod-neue-komponente-bg, var(--nc-neue-komponente-bg));
  padding: var(--mod-neue-komponente-padding, var(--nc-neue-komponente-padding));
}
```

Tokens in `_component-tokens.scss` registrieren:

```scss
// In scss/scss/00-settings/_component-tokens.scss:
:root {
  --nc-neue-komponente-bg: var(--fnd-color-layer-01);
  --nc-neue-komponente-padding: var(--fnd-spacing-04);
}
```

### Schritt 3: Story generieren

```bash
npm run generate:stories -- --component=neue-komponente
```

Oder manuell in `stories/{layer}/neue-komponente.stories.js`.

### Schritt 4: Registry aktualisieren

```bash
npm run registry:enhance  # Registry + Recipe-Enhancement
npm run specs             # Component Spec generieren
npm run components        # Component Index aktualisieren
```

### Schritt 5: Tests

```bash
npm test  # Build + Unit Tests + Token Lint + Recipe Lint
```

## 6.2 Bestehende Komponente erweitern

### Neue Variante hinzufuegen

1. **Recipe:** Neuen Wert zur passenden Achse hinzufuegen
2. **Tokens:** Neue `--nc-*` Tokens in `_component-tokens.scss`
3. **SCSS:** Modifier-Klasse implementieren (`.nc-button--neue-variante`)
4. **Specimen:** Testmuster im Recipe hinzufuegen
5. **Story:** `npm run generate:stories` (regeneriert automatisch)

### Neuen State hinzufuegen

1. **Recipe:** State zu `states.supported` hinzufuegen, Rule definieren
2. **Tokens:** State-spezifische Tokens registrieren
3. **SCSS:** State-Logik implementieren (`:hover`, `[aria-disabled]`, etc.)
4. **A11y:** ARIA-Attribute in `a11y.base` oder `a11y.overrides` dokumentieren

## 6.3 Konsistenz-Checks

Das System hat mehrere automatische Sicherheitsnetze:

| Check | Befehl | Prueft |
|-------|--------|--------|
| Token Lint | `npm run lint:tokens` | Keine hardcodierten Hex/Shadow/font-weight/z-index |
| Recipe Lint | `npm run lint:recipes` | Recipe-Schema-Validierung |
| Token Sync | `npm run tokens:sync:check` | SCSS ↔ Konfig-App Konsistenz |
| Pipeline Guard | `npm run pipeline:check` | Build-Integritaet |
| Unit Tests | `npm run test:unit` | 28 Tests (Vitest) |
| Full Test | `npm test` | Alle Checks zusammen |

## 6.4 Foundation Stories erweitern

Foundation Stories in `stories/foundations/` sind handgeschrieben (nicht aus Recipes generiert). Bei neuen Foundation-Tokens:

1. Token in `data/design-tokens.json` definieren
2. SCSS in `scss/scss/00-settings/` generieren (via `npm run tokens`)
3. Story in `stories/foundations/` erstellen oder erweitern
4. Registry aktualisieren (`npm run registry`)

---

# 7. Component Deep-Dives

## 7.1 Deep-Dive Template

Jeder Komponenten-Deep-Dive folgt dieser Struktur:

### Aufbau
- **Layer:** Atom / Molecule / Organism
- **Root-Element:** `.nc-{component}`
- **Slots:** Welche Kind-Elemente existieren und ob sie optional sind
- **DOM-Hinweise:** Besonderheiten der HTML-Struktur

### Wann einsetzen
- Primaerer Anwendungsfall
- Wann NICHT einsetzen (besser: Alternative)

### Varianten (Axes)
- Tabellarische Uebersicht aller Achsen mit CSS-Modifiern

### Konfig-App
- Welche Arena zeigt die Komponente (`*Arena.vue`)
- Wie werden Token-Werte live geaendert
- JSON-Schema Export fuer Design-Presets

### Storybook & Recipes
- Welche Stories existieren (auto-generiert aus Specimens)
- Wie nutzt man Controls fuer Grenzfaelle
- Wie fuegt man neue Specimens hinzu

### Drupal-Mapping
- Block Content Type Name
- Feld-Prefix-Konvention
- Template-Dateien (inline-block + block-content)
- Wie Recipe-Axes auf Drupal-Felder gemappt werden

---

## 7.2 Button

### Aufbau
- **Layer:** Atom (`scss/scss/05-atoms/_button.scss`)
- **Root:** `.nc-button`
- **Slots:** `icon` (optional), `label` (required), `spinner` (optional)
- **DOM:** `<button>` (Default) oder `<a>` (Link-Variante). XS/SM haben unsichtbaren `::before` Touch-Target (44px WCAG 2.5.8). Loading nutzt `visibility:hidden` statt `opacity:0`.

### Wann einsetzen
- Primaere und sekundaere Aktionen in Formularen, Toolbars, Dialogen
- CTAs in Hero-Sections und Marketing-Bloecken
- Icon-Only Buttons fuer kompakte UI (Close, Menu, Settings)
- **Nicht einsetzen:** Fuer Navigation → Link mit Arrow verwenden

### Varianten

| Achse | Werte | CSS Modifier |
|-------|-------|-------------|
| **variant** | primary, secondary, accent, outline, ghost, soft, inverted, success, warning, error, info | `.nc-button--{variant}` |
| **size** | xs, sm, md (default), lg | `.nc-button--{size}` |
| **pattern** | standard, with-icon, icon-only | `.nc-button--icon-only` |
| **width** | auto (default), full | `.nc-button--full-width` |
| **composition** | single, group, toggle, fab, link | `.nc-button--fab` |

### Konfig-App
- **Arena:** `ButtonArena.vue`
- **Token-Gruppen:** Geometry (16 Tokens), Typography (10), Primary/Secondary/... (je 5), Interaction (3), FAB (4), Icon Button (6)
- **Gesamt: 80+ Tokens** — der tokenreichste Atom im System
- **Export:** Token-Werte als CSS Custom Properties Datei

### Storybook & Recipes
- **Recipe:** `data/button-recipe.json` (v2.0.0)
- **Stories:** Auto-generiert: All Variants, Size Scale, With Icon, Icon-Only, Full Width, Loading, Disabled, Button Group, FAB, Toggle
- **Keyboard-Spec:** Enter/Space → activate
- **Test-Selektoren:** `[data-testid='button']`, `[data-testid='button-label']`, `[data-testid='button-icon']`, `[data-testid='button-spinner']`

### Drupal-Mapping
Buttons werden in Drupal nicht als eigener Block-Typ erstellt. Sie erscheinen **inline** in anderen Bloecken (Hero CTA, Card Footer, Form Submit). Das Recipe definiert die CSS-API, der Drupal-Entwickler nutzt die BEM-Klassen direkt:

```twig
<a href="{{ cta_url }}" class="nc-button nc-button--lg">
  <span class="nc-button__label">{{ cta_text }}</span>
</a>
```

---

## 7.3 Card

### Aufbau
- **Layer:** Atom + Molecule (`scss/scss/05-atoms/_card.scss` + `scss/scss/06-molecules/_card.scss`)
- **Root:** `.nc-card`
- **Slots:** `media` (optional), `content` (required), `footer` (optional)
- **Convenience-Elemente:** `kicker`, `title`, `title-link`, `description`, `meta`, `icon`, `input`, `footer-action`, `summary`, `expand-icon`
- **DOM:** Root-Element haengt vom Behavior ab: `<article>` (static), `<a>` (navigational-entire), `<label>` (selectable), `<details>` (expandable)

### Wann einsetzen
- Content-Teaser (Blog, News, Produkte) → navigational variant
- Feature-Highlights → icon variant
- Auswahl-Karten (Pricing, Plans) → selectable variant
- FAQ/Detail-Aufklapper → expandable variant

### Varianten

| Achse | Werte |
|-------|-------|
| **behavior** | static, navigational-partial, navigational-entire, selectable, expandable |
| **orientation** | vertical (default), horizontal |
| **size** | sm, md, lg |
| **appearance** | elevated, outlined, ghost, glass |
| **media** | none, image, icon, avatar |
| **intent** | default, success, warning, danger |

### Konfig-App
- **Arena:** `CardArena.vue`
- **50+ Tokens** in 8 Gruppen (Geometry, Background, Border, Media, Title, Description, Footer, States)

### Storybook & Recipes
- **Recipe:** `data/card-recipe.json` (v3.0.0, das komplexeste Recipe im System)
- **Specimens:** Default, With Media, Horizontal, Selectable, Expandable, Intent Variants, Glass Appearance
- **Grenzfall-Tests:** Lange Titel (Textoverflow), fehlende Media (Fallback), verschachtelte Links (z-index)

### Drupal-Mapping
Cards erscheinen primaer im **Card Grid** Block (`neo-card-grid`):

```
Block: neo_card_grid
  ├→ field_cg_headline
  ├→ field_cg_columns (2/3/4)
  └→ field_cg_cards (Paragraph Reference)
       └→ neo_card Paragraph
            ├→ field_card_title
            ├→ field_card_text
            ├→ field_card_image
            ├→ field_card_link
            └→ field_card_variant (select)
```

Template `block--inline-block--neo-card-grid.html.twig` iteriert ueber die Card-Paragraphs und rendert jede Card mit den NEO BEM-Klassen.

---

## 7.4 Accordion

### Aufbau
- **Layer:** Molecule (`scss/scss/06-molecules/_accordion.scss`)
- **Root:** `.nc-accordion`
- **Slots:** `trigger` (required), `content` (required), `trigger-icon` (optional), `trigger-suffix` (optional)
- **DOM:** Nutzt native `<details>/<summary>` fuer progressives Enhancement. JavaScript erweitert um Single-Mode, Scroll-Into-View, Selection.

### Wann einsetzen
- FAQ-Bereiche → standard variant
- Einstellungs-Panels → bordered variant
- Hierarchische Inhalte → nested variant
- Auswahl-Listen → selection variant (mit Checkbox/Radio)

### Varianten

| Achse | Werte |
|-------|-------|
| **variant** | default, bordered, flush, nested, selection |
| **mode** | multiple (default), single |
| **trigger-position** | start (default), end |
| **size** | sm, md, lg |

### Keyboard-Spec
| Taste | Aktion |
|-------|--------|
| Enter/Space | Item oeffnen/schliessen |
| ArrowDown/Up | Naechsten/vorherigen Trigger fokussieren |
| Home/End | Ersten/letzten Trigger fokussieren |

### Drupal-Mapping
```
Block: neo_accordion
  ├→ field_acc_headline
  ├→ field_acc_variant (select: default/bordered/flush)
  └→ field_acc_items (Paragraph Reference)
       └→ neo_accordion_item Paragraph
            ├→ field_aci_title
            └→ field_aci_body (formatted text)
```

---

## 7.5 Hero

### Aufbau
- **Layer:** Organism (`scss/scss/07-organisms/_hero.scss`)
- **Root:** `.nc-hero`
- **Slots:** `content` (required), `media` (optional), `actions` (optional), `kicker` (optional), `highlights` (optional)
- **DOM:** Section mit optionalem Background-Image/-Video. Content-Container mit max-width Constraint.

### Wann einsetzen
- Landing Pages (Startseite, Kampagnen)
- Produkt-Launches mit Video-Background
- Content-Seiten mit hervorgehobenem Header

### Varianten

| Achse | Werte |
|-------|-------|
| **layout** | content-only, content-media, full-bleed |
| **height** | auto, viewport (100dvh), svh, 80svh |
| **alignment** | left, center |
| **overlay** | none, gradient, solid |

### Konfig-App
- **Arena:** `HeroArena.vue`
- **34 Tokens** (Geometry, Colors, Typography, Media, Overlay)

### Drupal-Mapping
```
Block: neo_hero
  ├→ field_hero_headline, field_hero_subline, field_hero_kicker
  ├→ field_hero_cta_text, field_hero_cta_url
  ├→ field_hero_ghost_text, field_hero_ghost_url  (Secondary CTA)
  ├→ field_hero_bg_color (Color Picker)
  ├→ field_hero_image (Media Reference)
  ├→ field_hero_bg_video (URL)
  ├→ field_hero_height (select: auto/viewport/svh/80svh)
  └→ field_hero_media_type (select: image/video)
```

Das Twig-Template setzt Component Tokens per Inline-Style:
```twig
{% set hero_style = 'background-color: ' ~ bg_color %}
{% if hero_height == 'viewport' %}
  {% set hero_style = hero_style ~ ' --nc-hero-min-height: 100dvh;' %}
{% endif %}
<section class="nc-hero" style="{{ hero_style }}">
```

---

## 7.6 Modal

### Aufbau
- **Layer:** Organism (`scss/scss/07-organisms/_modal.scss`)
- **Root:** `.nc-modal`
- **Slots:** `overlay` (required), `content` (required), `header` (optional), `body` (required), `footer` (optional), `close` (required)
- **DOM:** Nutzt `<dialog>` Element fuer native Backdrop- und Fokus-Verwaltung.

### Wann einsetzen
- Bestaetigungs-Dialoge (Loeschen, Abbrechen)
- Formulare die den Hauptinhalt ueberlagern
- Detail-Ansichten ohne Navigation

### Keyboard-Spec
| Taste | Aktion |
|-------|--------|
| Escape | Modal schliessen |
| Tab | Focus innerhalb des Modals halten (Focus Trap) |
| Shift+Tab | Rueckwaerts-Navigation im Focus Trap |

### Events
| Event | Detail | Wann |
|-------|--------|------|
| `modal-open` | — | Beim Oeffnen |
| `modal-close` | `{ reason: 'escape' \| 'overlay-click' \| 'close-button' }` | Beim Schliessen |

---

## 7.7 Tabs

### Aufbau
- **Layer:** Molecule (`scss/scss/06-molecules/_tabs.scss`)
- **Root:** `.nc-tabs`
- **Slots:** `list` (required, `role=tablist`), `trigger` (required, `role=tab`), `panel` (required, `role=tabpanel`), `scroll-btn` (optional)

### Varianten

| Achse | Werte |
|-------|-------|
| **variant** | line (default, Underline-Indikator), contained (gefuellter Hintergrund) |
| **orientation** | horizontal (default), vertical |
| **size** | sm (32px), md (40px, default), lg (48px) |
| **overflow** | wrap, scrollable (Scroll-Buttons) |

### Keyboard-Spec
| Taste | Aktion |
|-------|--------|
| ArrowRight/Left | Naechsten/vorherigen Tab fokussieren (horizontal) |
| ArrowDown/Up | Naechsten/vorherigen Tab fokussieren (vertikal) |
| Home/End | Ersten/letzten Tab fokussieren |
| Enter/Space | Tab aktivieren |
| Tab | Direkt zum Panel-Inhalt springen |

---

# Anhang

## A. Befehls-Referenz

```bash
# Build
npm run build          # Full Build (Tokens + Icons + CSS)
npm run build:css      # Nur SCSS → CSS
npm run build:theme    # Theme-Only CSS (165 KB)

# Entwicklung
npm run dev            # Alle Watchers + Docs-Server
npm run storybook      # Storybook (localhost:6006)
npm run watch          # SCSS Watcher

# Generierung
npm run tokens         # design-tokens.json → SCSS
npm run generate:stories  # Recipes → Storybook Stories
npm run registry       # Component Registry generieren
npm run registry:enhance  # Registry + Recipe Enhancement
npm run specs          # Component Specs (JSON + Markdown)
npm run components     # Component Index (READMEs)

# Qualitaet
npm test               # Full Test Suite (28 Tests)
npm run lint:tokens    # Token-Hardcode Check
npm run lint:recipes   # Recipe Schema Validation
npm run dashboard      # Quality Dashboard (10 KPIs)
```

## B. Dateistruktur

```
data/
  design-tokens.json          # Single Source of Truth fuer Tokens
  *-recipe.json               # 111 Component Recipes
  component-registry.json     # Pipeline-Tracking (auto-generiert)
  foundation-spacing.json     # Foundation Recipe (exemplarisch)

scss/scss/
  00-settings/                # Tokens, Farben, Component Tokens
  01-tools/                   # Mixins, Funktionen
  02-generic/                 # Reset, Fonts, Animations
  03-elements/                # HTML Defaults
  04-objects/                 # Container, Grid, Section
  05-atoms/                   # Button, Input, Badge, ...
  06-molecules/               # Card, Accordion, Tabs, ...
  07-organisms/               # Hero, Modal, Navigation, ...
  08-templates/               # Dashboard, Content-Page, ...
  10-utilities/               # .u-sr-only, Spacing, Visibility
  main.scss                   # Haupt-Einstiegspunkt
  theme-only.scss             # Theme-Only Einstiegspunkt

stories/
  foundations/                # 14 Foundation Token Showcases
  atoms/                      # Atom Stories (auto-generiert)
  molecules/                  # Molecule Stories (auto-generiert)
  organisms/                  # Organism Stories (auto-generiert)
  templates/                  # Template Wireframes

specs/
  *.spec.json                 # Maschinenlesbare Specs
  *.spec.md                   # Menschenlesbare Specs
  index.json                  # Spec-Verzeichnis

components/
  {name}/README.md            # Co-Location Index (auto-generiert)
  _foundations/{name}/        # Foundation READMEs
  _objects/{name}/            # Object READMEs
  _templates/{name}/          # Template READMEs

scripts/
  generate-tokens.js          # Token Pipeline
  generate-stories.mjs        # Recipe → Story Generator
  generate-component-registry.js  # Registry Generator
  generate-component-specs.js     # Spec Extractor
  generate-component-index.js     # Co-Location Generator
  migrate-mod-tokens.js           # --mod-* Migration
  extract-theme-css.js            # Theme CSS Extraktor
  sync-component-tokens.js       # Token Sync Check
```

## C. Glossar

| Begriff | Bedeutung |
|---------|-----------|
| **Recipe** | Maschinenlesbare Komponenten-Spezifikation (JSON) |
| **Axis** | Variationsachse einer Komponente (Size, Variant, Pattern) |
| **Specimen** | Testmuster im Recipe das eine Achsen-Kombination zeigt |
| **Arena** | Vue-Komponente im Theme Configurator die eine Komponente live zeigt |
| **Token** | CSS Custom Property die einen Designwert abstrakt |
| **Foundation Token** | `--fnd-*` — System-weite Basis-Tokens |
| **Component Token** | `--nc-*` — Komponentenspezifische Tokens |
| **Mod Token** | `--mod-*` — Externer Override-Hook (nie deklariert, nur als Fallback) |
| **ITCSS** | Inverted Triangle CSS — Organisationsmethodik fuer CSS |
| **BEM** | Block-Element-Modifier — Namenskonvention (`.nc-card__title--large`) |
| **SDC** | Single Directory Component — Drupal-Pattern fuer komponentenbasierte Templates |
