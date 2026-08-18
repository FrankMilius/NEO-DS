---
name: collateral-check
description: Prüft ob eine Neuentwicklung unbeabsichtigte Seiteneffekte (Kollateralschäden) in anderen Komponenten verursacht hat.
---

# Collateral Check Skill

Prüft ob eine Neuentwicklung unbeabsichtigte Seiteneffekte (Kollateralschäden) in anderen Komponenten verursacht hat.

## Trigger
`/collateral-check [--component=<name>] [--verbose]`

## Ablauf

### 1. Änderungsscope ermitteln
- `git diff --name-only HEAD~1..HEAD` (oder gegen main Branch)
- Identifiziere geänderte Tokens, Mixins, Variablen, Selektoren

### 2. Abhängigkeits-Graph traversieren

**Token-Kaskade prüfen:**
- Geänderter Foundation-Token (z.B. `--fnd-spacing-04`)
  → Welche Semantic-Tokens referenzieren diesen?
  → Welche Component-Tokens referenzieren die Semantic-Tokens?
  → Welche SCSS-Dateien nutzen diese Component-Tokens?
  → Liste aller potenziell betroffenen Komponenten

**Mixin-Abhängigkeiten:**
- Geänderter Mixin (z.B. `form-control-base`)
  → `grep -r "form-control-base" scss/` → alle nutzenden Dateien

**Selektor-Spezifität:**
- Geänderte Selektoren gegen CSS-Spezifität prüfen
  → Wurde ein Selektor spezifischer/genereller?
  → Potenzielle Override-Konflikte?

### 3. CSS-Diff analysieren
- `npm run build:css` → `styles.css` (nach Änderung)
- CSS-Output Größe vergleichen (vorher vs. nachher)
- Geänderte Selektoren identifizieren
- Neue/entfernte Properties auflisten

### 4. Automatische Tests ausführen
- `npx vitest run` → Unit Tests
- Token-Lint → Keine neuen hardcodierten Werte?
- Recipe-Lint → Alle Recipes noch valide?

### 5. Report generieren

Format:
```
🔍 Collateral Check Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Geänderte Dateien: 3
  - scss/scss/05-atoms/_button.scss
  - scss/scss/00-settings/_component-tokens.scss
  - scss/scss/01-tools/_mixins-form.scss

Potenziell betroffene Komponenten: 8
  ⚠️ input (nutzt form-control-base Mixin)
  ⚠️ select (nutzt form-control-base Mixin)
  ⚠️ textarea (nutzt form-control-base Mixin)
  ⚠️ checkbox (nutzt button-Tokens)
  ⚠️ radio (nutzt button-Tokens)
  ✅ card (keine Abhängigkeit)
  ✅ modal (keine Abhängigkeit)

CSS-Diff:
  Größe: 823KB → 825KB (+2KB)
  Neue Selektoren: 3
  Geänderte Properties: 12

Tests: 28/28 passed ✅
Token Lint: 0 violations ✅

Empfehlung: Prüfe Input, Select und Textarea visuell.
```

### 6. Bei kritischen Änderungen
- Foundation-Token geändert → WARNUNG: Betrifft das gesamte Design System
- Mixin geändert → Liste aller nutzenden Komponenten
- Reset/Generic geändert → WARNUNG: Betrifft alle Elemente

## Regeln
- Niemals automatisch fixen — nur berichten
- Bei Foundation-Token-Änderungen: immer WARNUNG ausgeben
- Empfehlung für manuelle visuelle Prüfung geben
- CSS-Diff nur für geänderte Selektoren zeigen (nicht die gesamte CSS)
