---
name: evaluate-component
description: Evaluiert eine Design-System-Komponente gegen Best Practices, Wettbewerber und aktuelle Trends. Generiert konkrete Iterationsvorschläge.
---

# Evaluate Component Skill

Evaluiert eine Design-System-Komponente gegen Best Practices, Wettbewerber und aktuelle Trends. Generiert konkrete Iterationsvorschläge.

## Trigger
`/evaluate-component <component-name> [--focus=ux|a11y|tokens|variants|all]`

Beispiel: `/evaluate-component accordion --focus=all`

## Ablauf

### 1. Aktuellen Stand lesen (2 Min)
- Lies `data/<component>-recipe.json` — extrahiere: version, axes, specimens, tokenGroups, a11y, anatomy
- Lies die SCSS-Datei der Komponente (z.B. `scss/scss/06-molecules/_accordion.scss`)
- Lies die Arena-Komponente (z.B. `apps/theme-configurator/src/components/laboratory/AccordionArena.vue`)
- Zusammenfassung: Aktuelle Varianten, Token-Anzahl, A11y-Features, Status

### 2. Internet-Recherche (parallel, 3-4 Quellen)
Starte parallele Research-Agents für:

**Agent A: UX Best Practices**
- Suche: `"<component> UX best practices 2025 2026"`
- Quellen: Nielsen Norman Group, Baymard Institute, Smashing Magazine, UX Planet
- Extraktion: Empfohlene Patterns, Anti-Patterns, Konversions-Daten

**Agent B: Design System Benchmarks**
- Suche: `"<component> design system" site:github.com OR site:storybook.js.org`
- Quellen: Radix UI, Shadcn/ui, Chakra UI, Carbon Design System, Ant Design, Material UI, Spectrum (Adobe)
- Extraktion: Welche Varianten bieten sie? Welche Props/Axes? API-Vergleich

**Agent C: WCAG/ARIA Compliance**
- Suche: `"<component> ARIA pattern" site:w3.org OR site:developer.mozilla.org`
- Quellen: W3C ARIA Practices, MDN Web Docs, a11y-101
- Extraktion: Pflicht-ARIA-Attribute, Keyboard-Interactions, Focus-Management, Screen-Reader-Verhalten

**Agent D: Aktuelle Trends**
- Suche: `"<component> trend 2025 2026 design"`
- Quellen: CSS-Tricks, web.dev, Frontend-Blogs
- Extraktion: Neue CSS-Features (z.B. `<details>` für Accordion), Performance-Patterns, Animation-Trends

### 3. Gap-Analyse (Vergleich)

Erstelle Vergleichsmatrix:

```markdown
| Feature/Variante | NEO | Radix | Shadcn | Carbon | Ant | Empfehlung |
|-----------------|-----|-------|--------|--------|-----|------------|
| Ghost Variant   | ✅  | ✅    | ✅     | ❌     | ✅  | Behalten   |
| Nested          | ✅  | ❌    | ❌     | ✅     | ✅  | Behalten   |
| Sortable        | ❌  | ❌    | ❌     | ❌     | ✅  | Nice-to-Have |
| Motion tokens   | ❌  | ✅    | ✅     | ✅     | ✅  | MUST-HAVE  |
```

### 4. Evaluation-Report generieren

Speichere als `data/evaluations/<component>-evaluation-<YYYY-MM-DD>.md`:

```markdown
# Evaluation: <Component> v<version>
**Datum:** <YYYY-MM-DD>
**Status:** <stable|beta|alpha>
**Recipe:** data/<component>-recipe.json

## 1. Executive Summary
<2-3 Sätze: Gesamtbewertung, größte Stärke, größte Lücke>

## 2. Stärken (vs. Markt)
<Was macht NEO besser oder gleichwertig?>

## 3. Lücken (Missing Features)
### Must-Have (Branchenstandard)
<Features die alle Top-5 Design Systems haben, NEO aber nicht>

### Nice-to-Have (Differenzierung)
<Features die ≤2 Design Systems haben, aber Mehrwert bieten>

## 4. UX-Empfehlungen
<Konkrete UX-Verbesserungen basierend auf Research>

## 5. A11y-Audit
<WCAG-Compliance-Status, fehlende ARIA-Patterns>

## 6. Token-Architektur
<Fehlende Token-Gruppen, Inkonsistenzen, Optimierungen>

## 7. Konkrete Iterations-Vorschläge
### Recipe-Änderungen (JSON-Diff)
<Neue Axes, Specimens, TokenGroups als konkreter JSON-Vorschlag>

### SCSS-Änderungen
<Neue Mixins, Modifier, Token-Referenzen>

## 8. Priorisierte Roadmap
| Prio | Änderung | Aufwand | Impact |
|------|----------|---------|--------|
| P1   | ...      | S/M/L   | Hoch   |
```

### 5. Zusammenfassung ausgeben
- Kurze Console-Ausgabe mit Key Findings
- Pfad zum gespeicherten Report
- Frage: "Soll ich die Must-Have-Änderungen implementieren?"

## Regeln
- IMMER das aktuelle Recipe zuerst lesen — nicht aus dem Gedächtnis arbeiten
- IMMER Internet-Recherche durchführen — keine Annahmen über "Best Practices"
- Recherche-Agents PARALLEL starten für Geschwindigkeit
- Report IMMER in `data/evaluations/` speichern (persistent, nicht nur Console-Output)
- Konkrete JSON-Diffs für Recipe-Änderungen liefern (copy-paste-fähig)
- Keine Implementierung — nur Analyse und Vorschläge
- Bei --focus: nur die relevanten Agents starten (z.B. --focus=a11y → nur Agent C)
