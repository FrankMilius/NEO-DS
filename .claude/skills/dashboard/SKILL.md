---
name: dashboard
description: Berechnet alle Quality-KPIs, zeigt den aktuellen Stand und identifiziert Trends.
---

# Dashboard Skill

Berechnet alle Quality-KPIs, zeigt den aktuellen Stand und identifiziert Trends.

## Trigger
`/dashboard [--snapshot] [--trend]`

## Ablauf

### 1. Metriken berechnen
- `npm run dashboard` — berechnet alle 10 KPIs:
  - Token Coverage (lint:tokens)
  - Recipe Completeness (Pflichtfelder)
  - Test Coverage (Vitest)
  - Build Health (CSS kompiliert, Größe)
  - Documentation Coverage (Storybook Stories)
  - Component Maturity (stable/beta/alpha)
  - Token Sync (SCSS ↔ tokens.generated.js)
  - Bundle Size Trend (Größenänderung)
  - Pipeline Sync (Drupal Integration)
  - Evaluations (durchgeführte Component-Evaluationen)

### 2. Ergebnis berichten
Zeige das Dashboard im Terminal mit Status-Icons (✅/⚠️/❌).

### 3. Trend-Analyse (wenn --trend)
- Lade vorherige Snapshots aus `data/dashboard/history/`
- Vergleiche: Was hat sich verbessert/verschlechtert?
- Zeige Trend-Chart (letzte 5 Snapshots)

### 4. Snapshot speichern (wenn --snapshot)
- Speichert in `data/dashboard/history/YYYY-MM-DD.json`
- Git-tracked für historische Nachvollziehbarkeit

### 5. Empfehlungen
- Bei Score < 90: Zeige Top-3 Verbesserungsvorschläge
- Bei rückläufigem Trend: Warnung mit konkreten Maßnahmen

## KPI-Gewichtung

| KPI | Gewicht | Warum |
|-----|---------|-------|
| Test Coverage | 20% | Fundament für Vertrauen |
| Build Health | 15% | Muss immer grün sein |
| Token Sync | 15% | Drift = Bugs |
| Token Coverage | 15% | Keine hardcodierten Werte |
| Recipe Completeness | 10% | Dokumentationsqualität |
| Docs Coverage | 10% | Storybook-Abdeckung |
| Component Maturity | 10% | Reifegrad-Tracking |
| Pipeline Sync | 5% | Drupal-Integration |

## Regeln
- Snapshot nur bei explizitem `--snapshot` Flag speichern
- Trend-Analyse nur wenn ≥2 Snapshots vorhanden
- Metriken-Berechnung darf maximal 60s dauern
- Bei Build-Fehler: Score 0 für Build Health, alle anderen trotzdem berechnen
