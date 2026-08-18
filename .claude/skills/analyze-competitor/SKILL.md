---
name: analyze-competitor
description: Analysiert eine Wettbewerber-Website strukturiert und erstellt einen Benchmark-Report.
---

# Analyze Competitor Skill

Analysiert eine Wettbewerber-Website strukturiert und erstellt einen Benchmark-Report.

## Trigger
`/analyze-competitor <url> [--focus=sitemap|blog|features|pricing|all]`

Beispiel: `/analyze-competitor https://staffbase.com/de/ --focus=all`

## Ablauf

### 1. Website crawlen
- Fetche die Homepage und extrahiere die KOMPLETTE Navigation (Header + Footer)
- Identifiziere Mega-Menu-Strukturen, Dropdown-Hierarchien
- Fetche `/sitemap.xml` oder `/post-sitemap.xml` für Gesamtüberblick
- Zähle die Gesamtanzahl indexierbarer Seiten

### 2. Sitemap-Struktur erstellen
- Gruppiere alle Seiten nach Kategorie: Produkt, Lösungen, Ressourcen, Unternehmen, Legal
- Dokumentiere Navigationstiefe (max. Ebenen)
- Erstelle URL-Tabelle mit: Pfad, Seitentitel, Kategorie, Tiefe

### 3. Content-Analyse (wenn --focus=blog oder all)
- Blog-Listing-Seite fetchen, Artikel-Titel + Daten extrahieren
- 3-5 Einzelartikel fetchen für Tiefenanalyse:
  - Wortanzahl, Struktur (H2/H3), interne/externe Links
  - CTA-Muster, Autorennennung
  - KI-Content-Indikatoren
- Publikationsfrequenz berechnen
- Thematische Kategorisierung

### 4. Feature/Produkt-Analyse (wenn --focus=features oder all)
- Produktseiten identifizieren und Struktur dokumentieren
- Feature-Liste extrahieren
- Pricing-Modell (falls öffentlich)
- Trust Signals: Kundenlogos, Awards, Analyst Reports (Gartner, Forrester, G2)

### 5. Report generieren
- Speichere als `data/competitor-<name>-analyse.md`
- Format:
  ```markdown
  # Wettbewerber-Analyse: <Name>
  **URL:** <url>
  **Analysedatum:** <datum>

  ## 1. Sitemap & Navigation
  ## 2. Content-Strategie
  ## 3. Produkt-Positionierung
  ## 4. Trust & Social Proof
  ## 5. Stärken & Schwächen
  ## 6. Takeaways für NEOCOSMO
  ```

### 6. Vergleichsempfehlungen
- Identifiziere inhaltliche Lücken gegenüber neocosmo.de
- Konkrete Must-Have / Nice-to-Have Empfehlungen
- AI Procurement Agent Readiness bewerten

## Regeln
- Nutze WebFetch für alle URL-Abrufe
- Starte parallele Agents für Multi-Page-Analyse
- Alle Texte auf Deutsch
- Keine Spekulationen — nur was tatsächlich auf der Website steht
- Report-Datei IMMER in `data/` speichern
