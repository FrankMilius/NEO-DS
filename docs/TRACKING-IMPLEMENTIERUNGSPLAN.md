# Micro-User-Tracking im WEBSITE26 Design System
## Vollstandiges Referenzdokument fur die Implementierung

**Erstellt:** 12. Februar 2026
**Projekt:** WEBSITE26 — Neocosmo Marketing-Website
**Status:** Analyse abgeschlossen, Implementierung ausstehend

---

## Inhaltsverzeichnis

1. [Prompt fur die spatere Implementierung](#1-prompt-fur-die-spatere-implementierung)
2. [Zusammenfassung der Codebase-Analyse](#2-zusammenfassung-der-codebase-analyse)
3. [Identifizierte Probleme und Bewertungen](#3-identifizierte-probleme-und-bewertungen)
4. [To-Dos: Selbst erledigen vs. delegieren](#4-to-dos-selbst-erledigen-vs-delegieren)
5. [Technisches Umsetzungskonzept](#5-technisches-umsetzungskonzept)
6. [Phasenmodell mit Zeitplan](#6-phasenmodell-mit-zeitplan)
7. [Empfohlener Tech-Stack](#7-empfohlener-tech-stack)
8. [Event-Naming-Konventionen](#8-event-naming-konventionen)
9. [Vollstandige Tracking-Event-Matrix](#9-vollstandige-tracking-event-matrix)
10. [DSGVO-Compliance-Checkliste](#10-dsgvo-compliance-checkliste)
11. [Anhang: Dateistruktur und Einstiegspunkte](#11-anhang-dateistruktur-und-einstiegspunkte)

---

## 1. Prompt fur die spatere Implementierung

Den folgenden Prompt kannst du kopieren und in einer neuen Claude-Code-Session verwenden, um die Implementierung zu starten. Er enthalt alle notwendigen Kontextinformationen.

---

### PROMPT — Beginn

```
Ich mochte Micro-User-Tracking in mein Design System integrieren. Die Codebase
befindet sich im aktuellen Arbeitsverzeichnis. Hier ist der vollstandige Kontext:

## Codebase-Architektur

- Vanilla JavaScript (KEIN Vue.js, kein React, kein Framework)
- Alle Render-Funktionen in js/site.js (1.549 Zeilen, 25+ Render-Funktionen)
- Rendering uber createEl(tag, className, text) Hilfsfunktion
- Sections werden uber buildSectionShell(section, lang) erzeugt
- renderApp() baut den gesamten DOM neu auf (app.innerHTML = '')
- Setup-Funktionen (setupSlider, setupMarquee, etc.) werden nach jedem Render aufgerufen
- Kein Bundler — JS wird per <script type="module"> geladen
- SASS als CSS-Preprozessor, Atomic Design (00-Settings bis 10-Utilities)
- Daten kommen aus data/site-data.json (JSON-getrieben)
- Mehrsprachig (DE/EN), Theme-Switcher (4 Themes)
- 7 HTML-Seiten: index, products, services, customers, news, pricing, use-cases
- State in globalem Objekt: const state = { lang, page, theme }

## Was implementiert werden soll

### Neue Dateien erstellen:
1. js/tracking.js — Zentraler TrackingService
2. js/tracking-micro.js — Micro-Interactions (Rage Clicks, Dead Clicks, Hesitation, Scroll Depth)
3. js/tracking-consent.js — Consent-Management-Layer
4. js/tracking-performance.js — Core Web Vitals uber PerformanceObserver

### Bestehende Dateien anpassen:
1. js/site.js — data-track-* Attribute in ALLE interaktiven Elemente einfugen
2. js/site.js — TrackingService.init() am Ende von renderApp() aufrufen
3. Alle .html Dateien — Script-Tags fur tracking-consent.js und tracking.js einfugen

### Architektur-Regeln:
- Tracking MUSS vom Rendering entkoppelt bleiben
- tracking.init(scope) findet alle [data-track] Elemente und bindet Event-Listener
- tracking.init() MUSS nach jedem renderApp() aufgerufen werden (DOM wird komplett neu gebaut)
- Events werden per navigator.sendBeacon() gesendet (Batching alle 5 Sekunden)
- Consent wird IMMER gepruft bevor Events gesendet werden
- 3 Consent-Stufen: essential (immer), analytics (opt-in), extended (opt-in)
- IP-Anonymisierung muss serverseitig oder im Analytics-Tool konfiguriert werden

### Data-Track-Attribute fur interaktive Elemente:
Jedes trackbare Element bekommt diese Attribute:
- data-track="[event-type]" (click, submit, focus, toggle)
- data-track-category="[CTA|Navigation|Form|Content|Media]"
- data-track-action="[click|submit|toggle|play|scroll]"
- data-track-label="[eindeutiger-bezeichner]"
- data-track-component="[button|link|nav|form|accordion|slider|video|faq]"
- data-track-variant="[accent|outline|ghost|primary|secondary]"
- data-track-context="[page-id]"

### Event-Naming-Schema:
[component]_[action]_[target]
Beispiele: button_click_hero-cta, form_submit_demo, nav_click_products, faq_toggle_item-3

### Betroffene Render-Funktionen und ihre trackbaren Elemente:
- renderNavigation: Nav-Links, CTA-Buttons, Mega-Menu-Toggles, Suche, Mobile-Toggle, Lang-Toggle
- renderHero: CTA Primary, CTA Secondary
- renderVideoSection: Video Play-Button, CTA
- renderFeatureGrid: Card-Klicks (falls verlinkt)
- renderMediaGallery: Slider Prev/Next
- renderTestimonials: Slider Prev/Next
- renderPricing: Plan-CTAs
- renderFeatureAccordeon: Accordion-Toggles, Chapter-Navigation
- renderFaq: FAQ-Item-Toggles (details/summary)
- renderCTA: Newsletter-Submit, Demo-Submit, Form-Felder (focus/blur)
- renderFooter: Footer-Links, Social-Links

### Micro-Interaction-Tracking (in tracking-micro.js):
- Rage Clicks: 3+ Klicks auf dasselbe Element innerhalb von 500ms
- Dead Clicks: Klick auf nicht-interaktive Elemente (kein a, button, input, select, details)
- Hesitation Time: Zeit zwischen mouseenter und click auf CTAs
- Scroll Depth: IntersectionObserver auf allen Sections (25%, 50%, 75%, 100%)
- Form Abandonment: Focus auf Formularfeld ohne spateres Submit
- Input-Korrektur-Rate: Zaehler fur Backspace/Delete in Eingabefeldern

### Performance-Tracking (in tracking-performance.js):
- LCP (Largest Contentful Paint) uber PerformanceObserver
- CLS (Cumulative Layout Shift) uber PerformanceObserver
- INP (Interaction to Next Paint) uber PerformanceObserver
- Page Load Time uber Performance API
- Nur mit essential Consent (aggregiert, keine PII)

### Consent-Layer (in tracking-consent.js):
- Level 0 (essential): Error-Logging, Performance-Metriken (aggregiert)
- Level 1 (analytics): Page Views, Click-Tracking, Scroll Depth, Session Duration
- Level 2 (extended): Session Recording, Heatmaps, Micro-Surveys
- Consent-Status in localStorage speichern (Key: 'trackingConsent')
- hasConsent(level) Funktion die true/false zuruckgibt
- Cookie-Banner muss DSGVO-konform sein: expliziter Opt-in, keine vorausgefullten Checkboxen

### Wichtige technische Constraints:
- createEl() Funktion NICHT modifizieren — Tracking-Attribute nach createElement setzen
- state.page enthalt die aktuelle Seite (home, products, services, etc.)
- state.lang enthalt die aktuelle Sprache (de, en)
- renderApp(data) ist der zentrale Einstiegspunkt nach Datenlade
- Kein npm-Paket installieren — alles als Script-Tags oder native Browser-APIs

Bitte lies zuerst die bestehenden Dateien (js/site.js, package.json, index.html)
und erstelle dann die Implementierung Phase fur Phase. Beginne mit Phase 1
(Consent-Layer und Basis-Tracking-Infrastruktur).
```

### PROMPT — Ende

---

## 2. Zusammenfassung der Codebase-Analyse

### Technologie-Stack

| Aspekt | Ist-Zustand |
|---|---|
| Sprache | Vanilla JavaScript (ES Modules) |
| CSS | SASS/Dart Sass, Atomic Design (113 SCSS-Dateien) |
| Build | `npm run build` (Tokens + Icons + SASS) |
| Bundler | Keiner — direkte Script-Tags |
| Framework | Keines |
| Daten | JSON-getrieben (data/site-data.json, 52KB) |
| Seiten | 7 HTML-Seiten + Config-Seiten + Docs |
| Rendering | 25+ Render-Funktionen in site.js |
| State | Globales Objekt + localStorage |
| i18n | Bilingual DE/EN |
| Theming | 4 Themes, CSS-Klassen auf body |
| A11y | ARIA-Labels, Keyboard-Nav, Skip-Link, prefers-reduced-motion |
| SEO | JSON-LD Schema.org Markup |

### Tracking-relevante Ist-Situation

| Aspekt | Status |
|---|---|
| Analytics | Nicht vorhanden |
| Tracking-Attribute | Nicht vorhanden |
| Consent Management | Nicht vorhanden |
| Cookie Banner | Nicht vorhanden |
| Datenschutzerklarung | Nicht vorhanden |
| Event Bus | Nicht vorhanden |
| Performance Monitoring | Nicht vorhanden |

### Bestehende Einstiegspunkte fur Tracking

| Stelle im Code | Zeile | Relevanz |
|---|---|---|
| `createEl(tag, className, text)` | site.js:52 | Hier konnten data-track Attribute zentral gesetzt werden |
| `buildSectionShell(section, lang)` | site.js:131 | Setzt bereits `dataset.sectionType` — Pattern fur Tracking |
| `renderApp(data)` | site.js:1497 | Ruft alle Setup-Funktionen auf — tracking.init() hier einfugen |
| `init()` | site.js:1537 | Async Entry-Point nach Data-Fetch |
| Alle Event-Listener in Render-Funktionen | verteilt | Konnen parallel Tracking-Events feuern |

---

## 3. Identifizierte Probleme und Bewertungen

### Problem 1: Kein Vue.js — Konzept muss adaptiert werden
- **Schweregrad:** HOCH (konzeptionell), NIEDRIG (technisch)
- **Auswirkung:** Vue-Directives (v-track) und Composables funktionieren nicht
- **Losung:** data-track Attribute direkt im DOM setzen + tracking.init() Pattern
- **Aufwand:** Gering — Vanilla JS ist sogar einfacher als Vue-Integration
- **Blocker:** Nein

### Problem 2: Monolithische site.js (1.549 Zeilen)
- **Schweregrad:** MITTEL
- **Auswirkung:** Tracking-Code in site.js wurde die Datei noch grosser machen
- **Losung:** Separates tracking.js Modul, entkoppelt vom Rendering
- **Aufwand:** Gering
- **Blocker:** Nein

### Problem 3: Kein Bundler / Kein ES-Module-System
- **Schweregrad:** MITTEL
- **Auswirkung:** Kein import/export zwischen Dateien (site.js nutzt bereits type="module")
- **Losung:** Alle Tracking-Dateien als eigene Script-Tags laden ODER site.js auf import umstellen
- **Aufwand:** Gering — da `<script type="module">` bereits verwendet wird, sind ES-Imports moglich
- **Blocker:** Nein

### Problem 4: renderApp() loscht den kompletten DOM
- **Schweregrad:** HOCH
- **Auswirkung:** Bei Sprachwechsel (setupLangToggle) wird `app.innerHTML = ''` gesetzt — alle Event-Listener gehen verloren
- **Losung:** tracking.init() muss nach jedem renderApp() aufgerufen werden — analog zu setupSlider(), setupMarquee() etc.
- **Aufwand:** 1 Zeile Code
- **Blocker:** Nein — aber ohne diese Zeile funktioniert Tracking nach Sprachwechsel nicht

### Problem 5: Fehlende Consent-Infrastruktur
- **Schweregrad:** KRITISCH
- **Auswirkung:** Ohne Consent darf kein nicht-essentielles Tracking aktiviert werden (DSGVO)
- **Losung:** CMP integrieren (Cookiebot/Usercentrics) + eigener Consent-Layer
- **Aufwand:** Mittel — CMP-Auswahl, Integration, Datenschutzerklarung
- **Blocker:** JA — muss VOR jeglichem Tracking implementiert werden

### Problem 6: Kein Client-Side-Router
- **Schweregrad:** NIEDRIG
- **Auswirkung:** Kein SPA-Routing, daher kein History-Change-Tracking notig
- **Losung:** Standard-Page-Load-Events reichen aus
- **Aufwand:** Keiner
- **Blocker:** Nein — vereinfacht die Implementierung

### Problem 7: Performance-Risiko durch Micro-Tracking
- **Schweregrad:** MITTEL
- **Auswirkung:** Viele Event-Listener (Scroll, Mouse, Click, Focus) konnen Main-Thread blockieren
- **Losung:** Event-Batching (5s Intervall), Debouncing, IntersectionObserver statt Scroll-Events, navigator.sendBeacon()
- **Aufwand:** Mittel — muss von Anfang an eingeplant werden
- **Blocker:** Nein — aber Performance muss uberwacht werden

### Problem 8: Third-Party-Tools fur Session Recording und Heatmaps
- **Schweregrad:** NIEDRIG
- **Auswirkung:** Session Replays und Heatmaps konnen nicht selbst gebaut werden
- **Losung:** Microsoft Clarity (kostenlos) oder PostHog per Script-Tag nach Consent laden
- **Aufwand:** Gering — Script-Tag + Consent-Gate
- **Blocker:** Nein

### Zusammenfassung Problemmatrix

| # | Problem | Schwere | Aufwand | Blocker |
|---|---|---|---|---|
| 5 | Fehlende Consent-Infrastruktur | KRITISCH | Mittel | JA |
| 4 | Re-Render loscht DOM | HOCH | Gering | Nein |
| 1 | Kein Vue.js | HOCH (konz.) | Gering | Nein |
| 7 | Performance-Risiko | MITTEL | Mittel | Nein |
| 2 | Monolithische site.js | MITTEL | Gering | Nein |
| 3 | Kein Bundler | MITTEL | Gering | Nein |
| 8 | Third-Party noetig | NIEDRIG | Gering | Nein |
| 6 | Kein Router | NIEDRIG | Keiner | Nein |

---

## 4. To-Dos: Selbst erledigen vs. delegieren

### A) SELBST ERLEDIGEN (implementierungsunabhangig)

Diese Aufgaben erfordern Geschaftsentscheidungen und mussen vor der technischen
Implementierung abgeschlossen sein.

#### A1. Analytics-Tool auswahlen und beschaffen
- **Prioritat:** KRITISCH — bestimmt die gesamte technische Integration
- **Entscheidung:** Self-hosted (Matomo) vs. Cloud (Plausible, Fathom)
- **Kriterien:**
  - EU-Hosting zwingend (DSGVO)
  - Cookieless-Modus bevorzugt
  - Budget fur Self-Hosting vs. SaaS-Kosten
  - Matomo Self-Hosted: Server notig, volle Kontrolle, kostenlos
  - Plausible Cloud: 9 EUR/Monat (10K Views), zero-config, cookieless
  - PostHog Cloud EU: Freemium, Feature Flags + Session Replay inklusive
- **Ergebnis:** Account/Server-Zugang + Tracking-Endpoint-URL

#### A2. Consent Management Platform (CMP) auswahlen und konfigurieren
- **Prioritat:** KRITISCH — rechtlich erforderlich vor jedem Tracking
- **Optionen:**
  - Cookiebot: ab 0 EUR/Monat (bis 100 Seiten), einfache Integration
  - Usercentrics: ab 0 EUR/Monat (CMP Lite), umfangreicher
  - Didomi: Enterprise-Level, ab ca. 500 EUR/Monat
- **Aufgabe:** Account anlegen, Kategorien definieren (Essential, Analytics, Extended), Banner-Design anpassen
- **Ergebnis:** Embed-Code fur Cookie-Banner

#### A3. Datenschutzerklarung erstellen/aktualisieren
- **Prioritat:** KRITISCH — rechtlich zwingend
- **Inhalt muss umfassen:**
  - Welche Daten werden erhoben (Page Views, Klicks, Scroll-Verhalten, Performance-Metriken)
  - Zu welchem Zweck (UX-Optimierung, Performance-Monitoring)
  - Welche Tools werden eingesetzt (Analytics-Tool, ggf. Clarity)
  - Rechtsgrundlage (Einwilligung gem. Art. 6 Abs. 1 lit. a DSGVO)
  - Aufbewahrungsdauer
  - Betroffenenrechte (Auskunft, Loschung, Widerspruch)
  - Kontaktdaten des Verantwortlichen
- **Empfehlung:** Delegieren an Juristen (siehe B3)

#### A4. Geschaftsziele und KPIs definieren
- **Prioritat:** HOCH — bestimmt, welche Events uberhaupt getrackt werden
- **Fragen beantworten:**
  - Was ist das primare Conversion-Ziel? (Demo-Anfrage? Newsletter-Signup?)
  - Welche Seiten sind geschiftskritisch? (Pricing? Products?)
  - Welcher Funnel soll gemessen werden? (Home > Products > Pricing > Demo?)
  - Welche Micro-Interactions liefern die meisten UX-Insights?
- **Ergebnis:** Priorisierte Liste von 10-15 Events fur Phase 1

#### A5. Data Processing Agreements (DPAs) abschliessen
- **Prioritat:** HOCH — rechtlich erforderlich fur alle Drittanbieter
- **Betroffene Anbieter:**
  - Analytics-Tool (Matomo Cloud / Plausible / PostHog)
  - CMP-Anbieter (Cookiebot / Usercentrics)
  - Session Replay Tool (Clarity / Hotjar) — erst in Phase 3
- **Aufgabe:** DPA-Vorlagen der Anbieter prufen und unterzeichnen
- **Ergebnis:** Signierte DPAs im Dokumentenmanagement

#### A6. Hosting/Server fur Analytics bereitstellen (falls Self-Hosted)
- **Prioritat:** MITTEL — nur bei Matomo Self-Hosted
- **Anforderungen:**
  - EU-Standort (z.B. Hetzner, Netcup)
  - PHP 8.x + MySQL/MariaDB (fur Matomo)
  - SSL-Zertifikat
  - Min. 2 GB RAM, 20 GB Storage
- **Ergebnis:** Laufende Matomo-Instanz mit Admin-Zugang

#### A7. Internes Review-Meeting planen
- **Prioritat:** MITTEL
- **Teilnehmer:** Projektleitung, UX, Entwicklung, ggf. Datenschutzbeauftragter
- **Agenda:**
  - Tracking-Strategie vorstellen
  - Event-Liste priorisieren
  - Toolauswahl bestatigen
  - Datenschutz-Anforderungen klaren
  - Timeline abstimmen
- **Ergebnis:** Freigegebener Implementierungsplan

---

### B) AN SPEZIALISTEN DELEGIEREN

#### B1. Analytics-Tool: Setup & Dashboard-Konfiguration
- **Delegieren an:** Analytics-Spezialist oder DevOps
- **Aufgabe:**
  - Analytics-Tool installieren/konfigurieren
  - IP-Anonymisierung aktivieren
  - Datenretention-Policy einstellen (empfohlen: max. 26 Monate)
  - Basis-Dashboards anlegen:
    - Executive Dashboard (Page Views, Bounce Rate, Top Pages)
    - UX Dashboard (Scroll Depth, CTR, Form Completions)
    - Performance Dashboard (LCP, CLS, INP)
  - Automatische Alerts fur Anomalien konfigurieren
- **Lieferergebnis:** Funktionierendes Analytics-Setup mit Dashboards
- **Geschatzter Aufwand:** 4-8 Stunden

#### B2. CMP: Cookie-Banner-Design und -Konfiguration
- **Delegieren an:** UX-Designer + Frontend-Entwickler
- **Aufgabe:**
  - Cookie-Banner im Design-System-Stil gestalten
  - 3 Consent-Kategorien konfigurieren:
    - Essential (nicht abwahlbar): Error-Logging, Performance-Metriken
    - Analytics (opt-in): Page Views, Klick-Tracking, Scroll-Depth
    - Extended (opt-in): Session Recording, Heatmaps, Surveys
  - Banner-Texte DE/EN verfassen
  - Responsive Design sicherstellen
  - A11y prufen (Keyboard-Navigation, Screen-Reader)
- **Lieferergebnis:** Konfiguierter Cookie-Banner mit Embed-Code
- **Geschatzter Aufwand:** 8-16 Stunden

#### B3. Datenschutzerklarung: Juristische Prufung
- **Delegieren an:** Datenschutzbeauftragter oder externer Jurist
- **Aufgabe:**
  - Datenschutzerklarung fur Tracking erstellen/erweitern
  - DSGVO-Konformitat sicherstellen
  - Rechtsgrundlagen (Art. 6, Art. 7 DSGVO) korrekt benennen
  - Aufbewahrungsfristen festlegen
  - Impressum prufen (falls noch nicht vorhanden)
  - Prufen ob DPIA (Datenschutz-Folgenabschatzung) notig ist
- **Lieferergebnis:** Rechtsichere Datenschutzerklarung
- **Geschatzter Aufwand:** 4-8 Stunden (extern)

#### B4. Session Replay & Heatmaps: Tool-Setup (Phase 3)
- **Delegieren an:** Analytics-Spezialist
- **Aufgabe:**
  - Microsoft Clarity oder PostHog konfigurieren
  - DSGVO-konforme Einstellungen (PII-Masking, Consent-Gate)
  - Recordings nur mit "Extended"-Consent aktivieren
  - Automatisches Masking von Formulareingaben sicherstellen
- **Lieferergebnis:** Lauffohiges Session-Replay mit Consent-Gate
- **Geschatzter Aufwand:** 2-4 Stunden

#### B5. Quartalsweise DSGVO-Compliance-Audits
- **Delegieren an:** Datenschutzbeauftragter
- **Aufgabe (wiederkehrend):**
  - Prufen, ob nur die vereinbarten Daten erhoben werden
  - Consent-Raten analysieren
  - DPAs auf Aktualitat prufen
  - Neue regulatorische Anforderungen bewerten (EU AI Act, ePrivacy-VO)
  - Tracking-Scripts auf unautorisierte Drittanbieter-Requests scannen
- **Lieferergebnis:** Audit-Bericht mit Handlungsempfehlungen
- **Geschatzter Aufwand:** 4-8 Stunden pro Quartal

---

### C) ENTSCHEIDUNGSMATRIX

| To-Do | Wer | Wann | Blockiert Implementierung? |
|---|---|---|---|
| A4 KPIs definieren | Du selbst | Sofort | Ja — bestimmt Event-Auswahl |
| A1 Analytics-Tool wahlen | Du selbst | Sofort | Ja — bestimmt Integration |
| A2 CMP wahlen | Du selbst | Sofort | Ja — Consent vor Tracking |
| A5 DPAs abschliessen | Du selbst | Parallel | Ja — rechtliche Grundlage |
| B3 Datenschutz-Prufung | Jurist | Parallel zu A1-A3 | Ja — Go-Live-Blocker |
| B2 Cookie-Banner Design | UX + Dev | Nach A2 | Ja — Consent vor Tracking |
| A3 Datenschutzerklarung | Du + Jurist (B3) | Nach A1-A2 | Ja — Go-Live-Blocker |
| A7 Review-Meeting | Du selbst | Nach A1-A5 | Nein — aber empfohlen |
| A6 Server bereitstellen | Du / DevOps | Nach A1 (nur bei Self-Hosted) | Nur bei Matomo Self-Hosted |
| B1 Analytics-Dashboards | Analytics-Spezialist | Nach Phase 1-2 | Nein |
| B4 Session Replay Setup | Analytics-Spezialist | Phase 3 | Nein |
| B5 Compliance-Audits | Datenschutz | Quartalweise ab Go-Live | Nein |

---

## 5. Technisches Umsetzungskonzept

### Dateistruktur nach Implementierung

```
js/
 site.js                    <-- Bestehend, wird erweitert (data-track Attribute)
 tracking.js                <-- NEU: Zentraler TrackingService
 tracking-micro.js          <-- NEU: Rage Clicks, Dead Clicks, Hesitation, etc.
 tracking-consent.js        <-- NEU: Consent-Layer (3 Stufen)
 tracking-performance.js    <-- NEU: Core Web Vitals
```

### Architektur-Diagramm

```
                        +------------------+
                        |    site.js       |
                        |  renderApp()     |
                        |  (data-track-*   |
                        |   Attribute)     |
                        +--------+---------+
                                 |
                                 | ruft auf nach Render
                                 v
                        +------------------+
                        | tracking.js      |
                        | TrackingService  |
                        | .init()          |
                        | .send()          |
                        +--------+---------+
                                 |
                    +------------+------------+
                    |            |            |
                    v            v            v
          +-----------+  +------------+  +---------------+
          | tracking-  |  | tracking-  |  | tracking-     |
          | consent.js |  | micro.js   |  | performance.js|
          | hasConsent()|  | rageClicks |  | LCP, CLS, INP|
          | getLevel() |  | deadClicks |  | PageLoad      |
          +-----------+  | hesitation |  +---------------+
                         | scrollDepth|
                         | formAband. |
                         +------------+

                                 |
                                 | sendBeacon / dataLayer
                                 v
                        +------------------+
                        | Analytics-Tool   |
                        | (Matomo/Plausible|
                        |  /PostHog)       |
                        +------------------+
```

### Script-Einbindung in HTML

Alle 7 Seiten (index.html, products.html, services.html, customers.html,
news.html, pricing.html, use-cases.html) mussen erweitert werden:

```html
<!-- VOR site.js laden -->
<script type="module" src="js/tracking-consent.js"></script>

<!-- NACH site.js laden -->
<script type="module" src="js/tracking.js"></script>
<script type="module" src="js/tracking-micro.js"></script>
<script type="module" src="js/tracking-performance.js"></script>

<!-- CMP Embed-Code (Cookiebot/Usercentrics) -->
<script id="CookieConsent" src="https://[CMP-URL]" data-cbid="[DEINE-ID]" type="text/javascript"></script>
```

### Anpassungen in site.js

#### 1. Tracking-Init in renderApp() einfugen

In der Funktion renderApp() (Zeile 1497-1535) muss am Ende hinzugefugt werden:

```javascript
// Bestehend (Zeile 1533-1534):
setupThemeSwitcher(state.lang);
applyTheme(state.theme);

// NEU hinzufugen:
if (window.TrackingService) {
  window.TrackingService.init();
}
```

#### 2. data-track Attribute in Render-Funktionen

Beispiel: renderHero() — CTA-Buttons

```javascript
// Bestehend (Zeile 418-421):
const primary = createEl('a', 'button accent', content.cta_primary.label);
primary.href = content.cta_primary.href;
const secondary = createEl('a', 'button outline', content.cta_secondary.label);
secondary.href = content.cta_secondary.href;

// Erweiterung:
primary.dataset.track = 'click';
primary.dataset.trackCategory = 'CTA';
primary.dataset.trackAction = 'click';
primary.dataset.trackLabel = 'hero-primary-' + section.id;
primary.dataset.trackComponent = 'button';
primary.dataset.trackVariant = 'accent';
primary.dataset.trackContext = state.page;

secondary.dataset.track = 'click';
secondary.dataset.trackCategory = 'CTA';
secondary.dataset.trackAction = 'click';
secondary.dataset.trackLabel = 'hero-secondary-' + section.id;
secondary.dataset.trackComponent = 'button';
secondary.dataset.trackVariant = 'outline';
secondary.dataset.trackContext = state.page;
```

### Konzept: TrackingService (tracking.js)

```javascript
// Grundstruktur - wird bei Implementierung vollstandig ausgebaut
const TrackingService = {
  queue: [],
  batchInterval: 5000, // 5 Sekunden

  init(scope = document) {
    scope.querySelectorAll('[data-track]').forEach(el => {
      const eventType = el.dataset.track;
      el.addEventListener(eventType, () => {
        this.track({
          category: el.dataset.trackCategory,
          action: el.dataset.trackAction,
          label: el.dataset.trackLabel,
          component: el.dataset.trackComponent,
          variant: el.dataset.trackVariant,
          context: el.dataset.trackContext,
          timestamp: Date.now(),
          page: document.body.dataset.page,
          lang: document.documentElement.lang
        });
      });
    });
  },

  track(eventData) {
    if (!window.TrackingConsent?.hasConsent('analytics')) return;
    this.queue.push(eventData);
  },

  flush() {
    if (!this.queue.length) return;
    const payload = JSON.stringify(this.queue);
    navigator.sendBeacon('/api/track', payload);
    // ODER: window.dataLayer?.push(...this.queue.map(e => ({event: 'ds_event', ...e})));
    this.queue = [];
  },

  startBatching() {
    setInterval(() => this.flush(), this.batchInterval);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') this.flush();
    });
  }
};

window.TrackingService = TrackingService;
TrackingService.startBatching();
```

### Konzept: Consent-Layer (tracking-consent.js)

```javascript
const CONSENT_KEY = 'trackingConsent';

const TrackingConsent = {
  LEVELS: { essential: 0, analytics: 1, extended: 2 },

  getConsent() {
    try {
      return JSON.parse(localStorage.getItem(CONSENT_KEY)) || { level: 'essential' };
    } catch {
      return { level: 'essential' };
    }
  },

  setConsent(level) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      level,
      timestamp: Date.now(),
      version: '1.0'
    }));
  },

  hasConsent(requiredLevel) {
    const current = this.getConsent();
    return this.LEVELS[current.level] >= this.LEVELS[requiredLevel];
  }
};

window.TrackingConsent = TrackingConsent;
```

### Konzept: Micro-Interactions (tracking-micro.js)

```javascript
// Rage Click Detection
let clickLog = [];
document.addEventListener('click', (e) => {
  const now = Date.now();
  clickLog.push({ target: e.target, time: now });
  clickLog = clickLog.filter(c => now - c.time < 500);
  if (clickLog.filter(c => c.target === e.target).length >= 3) {
    TrackingService.track({
      category: 'MicroInteraction',
      action: 'rage_click',
      label: e.target.closest('[data-track-label]')?.dataset.trackLabel || 'unknown',
      component: e.target.tagName.toLowerCase()
    });
  }
});

// Dead Click Detection
document.addEventListener('click', (e) => {
  const interactive = e.target.closest('a, button, input, select, textarea, details, [data-track]');
  if (!interactive) {
    TrackingService.track({
      category: 'MicroInteraction',
      action: 'dead_click',
      label: e.target.className || e.target.tagName,
      context: document.body.dataset.page
    });
  }
});

// Scroll Depth (IntersectionObserver)
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      TrackingService.track({
        category: 'Engagement',
        action: 'scroll_depth',
        label: entry.target.id || entry.target.dataset.sectionType,
        context: document.body.dataset.page
      });
      scrollObserver.unobserve(entry.target); // Nur einmal pro Section
    }
  });
}, { threshold: 0.5 });

// Nach jedem Render aufrufen:
document.querySelectorAll('.section').forEach(s => scrollObserver.observe(s));
```

---

## 6. Phasenmodell mit Zeitplan

### Phase 0: Vorbereitung (Woche 1) — Kein Code

| Schritt | Aufgabe | Verantwortlich | Ergebnis |
|---|---|---|---|
| 0.1 | Geschoftsziele und KPIs definieren | Du | Priorisierte Event-Liste |
| 0.2 | Analytics-Tool auswahlen | Du | Entscheidung + Account |
| 0.3 | CMP auswahlen | Du | Entscheidung + Account |
| 0.4 | DPAs abschliessen | Du + Anbieter | Signierte Vertrage |
| 0.5 | Datenschutzerklarung beauftragen | Jurist | Entwurf |
| 0.6 | Review-Meeting durchfuhren | Team | Freigegebener Plan |
| 0.7 | Event-Naming-Konventionen festlegen | Du + UX | Referenzdokument |

### Phase 1: Foundation (Wochen 2-3) — Consent + Basis-Infrastruktur

| Schritt | Aufgabe | Dateien |
|---|---|---|
| 1.1 | tracking-consent.js erstellen | js/tracking-consent.js |
| 1.2 | Cookie-Banner/CMP integrieren | Alle .html Seiten |
| 1.3 | tracking.js erstellen (TrackingService) | js/tracking.js |
| 1.4 | data-track Attribute in alle Render-Funktionen | js/site.js |
| 1.5 | tracking.init() in renderApp() einbinden | js/site.js |
| 1.6 | Analytics-Tool Endpoint anbinden | js/tracking.js |
| 1.7 | Datenschutzerklarung veroffentlichen | Neue HTML-Seite oder Footer-Link |
| 1.8 | QA: Consent-Flow manuell testen | Alle Seiten |

### Phase 2: Core Tracking (Wochen 4-5) — Quantitative Metriken

| Schritt | Aufgabe | Dateien |
|---|---|---|
| 2.1 | Page Views automatisch erfassen | js/tracking.js |
| 2.2 | Scroll Depth Tracking | js/tracking-micro.js |
| 2.3 | CTA Click-Through-Rates | Automatisch via data-track |
| 2.4 | Navigation Paths loggen | js/tracking.js |
| 2.5 | Rage Click Detection | js/tracking-micro.js |
| 2.6 | Dead Click Detection | js/tracking-micro.js |
| 2.7 | Hesitation Time auf CTAs | js/tracking-micro.js |
| 2.8 | Form Abandonment (CTA-Formulare) | js/tracking-micro.js |
| 2.9 | tracking-performance.js erstellen | js/tracking-performance.js |
| 2.10 | Event-Batching + sendBeacon | js/tracking.js |
| 2.11 | Basis-Dashboards aufsetzen | Analytics-Tool |
| 2.12 | Automatische Alerts konfigurieren | Analytics-Tool |

### Phase 3: Deep Insights (Wochen 6-8) — Qualitative Daten

| Schritt | Aufgabe |
|---|---|
| 3.1 | Session Recording Tool integrieren (Clarity/PostHog) |
| 3.2 | Heatmaps aktivieren |
| 3.3 | Micro-Surveys nach Demo-Form-Submit |
| 3.4 | A/B-Testing fur Hero-Varianten |
| 3.5 | Cross-Page-Funnel: Home > Products > Pricing > Demo |
| 3.6 | Input-Korrektur-Rate im Demo-Formular |
| 3.7 | Rage-Zoom-Detection fur Mobile |
| 3.8 | NPS-Messung einrichten |

### Phase 4: Continuous Improvement (ab Woche 9) — Prozesse

| Aufgabe | Rhythmus | Verantwortlich |
|---|---|---|
| Key-Metrics-Review | Wochentlich | UX + Product |
| UX-Qualitatsberichte | Monatlich | UX |
| DSGVO-Compliance-Audit | Quartalweise | Datenschutz |
| Tracking-Plan aktualisieren | Bei neuen Komponenten | Entwicklung |
| A/B-Test-Ergebnisse auswerten | Laufend | UX + Product |
| Event-Katalog pflegen | Laufend | Entwicklung |

### Zeitstrahl

```
Woche 1         Woche 2-3       Woche 4-5       Woche 6-8       Woche 9+
+--------------+-+--------------+-+--------------+-+--------------+-+------------+
| VORBEREITUNG | | FOUNDATION   | | CORE TRACK.  | | DEEP INSIGHTS| | CONTINUOUS |
| (kein Code)  | | (Consent +   | | (Metriken +  | | (Qualitativ  | | IMPROVE-   |
|              | |  Infrastr.)  | |  Micro-Int.) | |  + A/B)      | | MENT       |
| - KPIs       | | - Consent-   | | - Page Views | | - Session    | |            |
| - Tool-Wahl  | |   Layer      | | - Scroll     | |   Recording  | | - Reviews  |
| - CMP-Wahl   | | - Cookie-    | |   Depth      | | - Heatmaps   | | - Reports  |
| - DPAs       | |   Banner     | | - CTR        | | - Surveys    | | - Audits   |
| - Datenschutz| | - tracking.js| | - Rage/Dead  | | - A/B Tests  | | - Backlog  |
|   -erklarung | | - data-track | |   Clicks     | | - Funnels    | | - Updates  |
| - Meeting    | | - Analytics  | | - Hesitation | | - NPS        | |            |
|              | |   Endpoint   | | - Performance| |              | |            |
+--------------+-+--------------+-+--------------+-+--------------+-+------------+
```

---

## 7. Empfohlener Tech-Stack

### Analytics-Tool

| Tool | Hosting | Cookies | Preis | Empfehlung |
|---|---|---|---|---|
| Matomo (self-hosted) | Eigener Server (EU) | Optional | Kostenlos (Server-Kosten) | Beste Kontrolle |
| Plausible | EU (Hetzner) | Keine | Ab 9 EUR/Monat | Einfachste Integration |
| PostHog | EU Cloud | Konfigurierbar | Freemium | Umfangreichste Features |
| Fathom | EU verfugbar | Keine | Ab 14 USD/Monat | Privacy-first |

**Empfehlung fur WEBSITE26:** Plausible (einfach, cookieless, EU) oder PostHog (wenn Session Replay gewunscht).

### Consent Management

| Tool | Preis | Integration | Empfehlung |
|---|---|---|---|
| Cookiebot | Ab 0 EUR (bis 100 Seiten) | Script-Tag | Einfachste Option |
| Usercentrics | Ab 0 EUR (CMP Lite) | Script-Tag | Umfangreicher |

### Session Replay & Heatmaps (Phase 3)

| Tool | Preis | DSGVO | Empfehlung |
|---|---|---|---|
| Microsoft Clarity | Kostenlos | Konfigurierbar | Kostenloses Einstiegs-Tool |
| PostHog | Im Plan enthalten | EU Cloud | Falls PostHog als Analytics gewahlt |

### Performance Monitoring

| Tool | Preis | Integration |
|---|---|---|
| Native PerformanceObserver | Kostenlos | Browser-API, kein externes Tool |

### Event Transport

| Methode | Vorteil |
|---|---|
| navigator.sendBeacon() | Zuverlassig beim Page-Unload, async, non-blocking |
| window.dataLayer.push() | Falls GTM genutzt wird |

---

## 8. Event-Naming-Konventionen

### Schema

```
[component]_[action]_[target]
```

### Regeln

1. Alles lowercase
2. Worter mit Bindestrich trennen (kebab-case)
3. Component = UI-Komponente (button, form, nav, accordion, slider, video, faq, footer)
4. Action = Was passiert (click, submit, toggle, play, scroll, focus, blur, abandon)
5. Target = Eindeutiger Bezeichner (hero-cta, demo-form, products-link, item-3)

### Beispiele

| Event-Name | Beschreibung |
|---|---|
| `button_click_hero-primary` | Klick auf den primaren Hero-CTA |
| `button_click_hero-secondary` | Klick auf den sekundaren Hero-CTA |
| `button_click_pricing-starter` | Klick auf den Starter-Plan-CTA |
| `button_click_pricing-professional` | Klick auf den Professional-Plan-CTA |
| `form_submit_newsletter` | Newsletter-Formular abgeschickt |
| `form_submit_demo` | Demo-Anfrage abgeschickt |
| `form_abandon_demo` | Demo-Formular abgebrochen |
| `form_focus_demo-email` | Focus auf E-Mail-Feld im Demo-Formular |
| `nav_click_products` | Klick auf "Produkte" in der Navigation |
| `nav_click_mega-submenu-item` | Klick auf Mega-Menu-Unterpunkt |
| `nav_toggle_mega-products` | Mega-Menu fur Produkte geoffnet/geschlossen |
| `nav_click_mobile-toggle` | Mobiles Menu geoffnet |
| `nav_click_lang-en` | Sprachwechsel zu Englisch |
| `nav_click_lang-de` | Sprachwechsel zu Deutsch |
| `search_submit_global` | Suche ausgefuhrt |
| `video_play_hero` | Video im Hero abgespielt |
| `slider_click_next-testimonials` | Nachstes Testimonial im Slider |
| `slider_click_prev-media-gallery` | Vorheriges Bild in Media Gallery |
| `accordion_toggle_chapter-1` | Feature-Accordion Kapitel 1 geoffnet |
| `accordion_toggle_feature-item-3` | Feature-Item 3 geoffnet |
| `faq_toggle_item-5` | FAQ Frage 5 geoffnet |
| `footer_click_social-linkedin` | Klick auf LinkedIn im Footer |
| `footer_click_datenschutz` | Klick auf Datenschutzerklarung |
| `theme_switch_dark-base` | Theme gewechselt zu Dark Base |
| `micro_rage-click_[label]` | Rage Click auf Element |
| `micro_dead-click_[element]` | Dead Click auf nicht-interaktives Element |
| `micro_hesitation_[label]` | Zogerung vor Klick (>3 Sekunden) |
| `scroll_depth_[section-id]` | Section wurde gescrollt |
| `perf_lcp_[page]` | Largest Contentful Paint |
| `perf_cls_[page]` | Cumulative Layout Shift |
| `perf_inp_[page]` | Interaction to Next Paint |

---

## 9. Vollstandige Tracking-Event-Matrix

### Render-Funktion: renderNavigation (site.js:142)

| Element | Event | data-track | data-track-label | Prioritat |
|---|---|---|---|---|
| Nav-Links (ohne Kinder) | click | click | nav-[link.label] | HOCH |
| Mega-Menu-Toggles | click | click | nav-toggle-[link.label] | HOCH |
| Mega-Menu-Unterpunkte | click | click | nav-submenu-[child.label] | MITTEL |
| CTA Primary (Header) | click | click | nav-cta-primary | HOCH |
| Such-Button | click | click | nav-search-open | MITTEL |
| Such-Input | submit | submit | search-submit | HOCH |
| Sprach-Toggle DE | click | click | nav-lang-de | MITTEL |
| Sprach-Toggle EN | click | click | nav-lang-en | MITTEL |
| Mobile-Toggle | click | click | nav-mobile-toggle | MITTEL |
| Mobile-Submenu-Toggles | click | click | nav-mobile-[link.label] | NIEDRIG |

### Render-Funktion: renderHero (site.js:408)

| Element | Event | data-track-label | Prioritat |
|---|---|---|---|
| CTA Primary | click | hero-primary-[section.id] | KRITISCH |
| CTA Secondary | click | hero-secondary-[section.id] | HOCH |

### Render-Funktion: renderVideoSection (site.js:458)

| Element | Event | data-track-label | Prioritat |
|---|---|---|---|
| Play-Overlay | click | video-play-[section.id] | HOCH |
| Video (play event) | play | video-started-[section.id] | HOCH |
| Video (ended event) | ended | video-completed-[section.id] | MITTEL |
| CTA | click | video-cta-[section.id] | HOCH |

### Render-Funktion: renderFeatureGrid (site.js:526)

| Element | Event | data-track-label | Prioritat |
|---|---|---|---|
| Feature-Cards (falls verlinkt) | click | feature-card-[index] | NIEDRIG |
| Section Visibility | scroll | scroll-features-[section.id] | MITTEL |

### Render-Funktion: renderMediaGallery (site.js:601)

| Element | Event | data-track-label | Prioritat |
|---|---|---|---|
| Slider Previous | click | slider-prev-media | NIEDRIG |
| Slider Next | click | slider-next-media | NIEDRIG |

### Render-Funktion: renderTestimonials (site.js:660)

| Element | Event | data-track-label | Prioritat |
|---|---|---|---|
| Slider Previous | click | slider-prev-testimonials | NIEDRIG |
| Slider Next | click | slider-next-testimonials | NIEDRIG |

### Render-Funktion: renderPricing (site.js:713)

| Element | Event | data-track-label | Prioritat |
|---|---|---|---|
| Plan-CTA (pro Plan) | click | pricing-cta-[plan.name] | KRITISCH |

### Render-Funktion: renderFeatureAccordeon (site.js:766)

| Element | Event | data-track-label | Prioritat |
|---|---|---|---|
| Chapter-Navigation-Buttons | click | accordion-chapter-[index] | MITTEL |
| Details/Summary Toggles | toggle | accordion-item-[chapter]-[item] | MITTEL |

### Render-Funktion: renderFaq (site.js:871)

| Element | Event | data-track-label | Prioritat |
|---|---|---|---|
| FAQ Details/Summary | toggle | faq-item-[index] | MITTEL |

### Render-Funktion: renderCTA (site.js:902)

| Element | Event | data-track-label | Prioritat |
|---|---|---|---|
| Newsletter E-Mail Input | focus | form-focus-newsletter-email | MITTEL |
| Newsletter Submit | submit | form-submit-newsletter | KRITISCH |
| Demo E-Mail Input | focus | form-focus-demo-email | HOCH |
| Demo Vorname Input | focus | form-focus-demo-firstname | MITTEL |
| Demo Nachname Input | focus | form-focus-demo-lastname | MITTEL |
| Demo Unternehmen Input | focus | form-focus-demo-company | MITTEL |
| Demo Topic Select | change | form-change-demo-topic | MITTEL |
| Demo Submit | submit | form-submit-demo | KRITISCH |

### Render-Funktion: renderFooter (site.js:987)

| Element | Event | data-track-label | Prioritat |
|---|---|---|---|
| Footer-Links | click | footer-link-[col]-[label] | NIEDRIG |
| Social Links | click | footer-social-[label] | MITTEL |

### Globale Events (nicht an Render-Funktionen gebunden)

| Event | Trigger | Prioritat |
|---|---|---|
| page_view | DOMContentLoaded | KRITISCH |
| scroll_depth_25/50/75/100 | IntersectionObserver | HOCH |
| session_start | Erster Page View | HOCH |
| session_end | visibilitychange (hidden) | HOCH |
| rage_click | 3+ Klicks < 500ms | HOCH |
| dead_click | Klick auf nicht-interaktiv | MITTEL |
| hesitation | mouseenter → click > 3s | MITTEL |
| form_abandonment | focus ohne submit | HOCH |
| theme_switch | applyTheme() | NIEDRIG |
| perf_lcp | PerformanceObserver | HOCH |
| perf_cls | PerformanceObserver | HOCH |
| perf_inp | PerformanceObserver | HOCH |
| perf_page_load | Performance API | HOCH |

---

## 10. DSGVO-Compliance-Checkliste

### Vor Go-Live (MUSS erfullt sein)

- [ ] CMP ausgewahlt und Account erstellt
- [ ] Cookie-Banner implementiert mit granularen Kategorien
- [ ] Expliziter Opt-in (keine vorausgefullten Checkboxen)
- [ ] Opt-out jederzeit moglich und einfach zuganglich
- [ ] Datenschutzerklarung erstellt und verlinkt
- [ ] IP-Anonymisierung im Analytics-Tool aktiviert
- [ ] Datenretention-Policy konfiguriert (max. 26 Monate empfohlen)
- [ ] DPAs mit allen Drittanbietern abgeschlossen
- [ ] EU-Datenhosting sichergestellt
- [ ] Keine personenbezogenen Daten ohne Consent erhoben
- [ ] Essential-Level enthalt KEINE PII (nur aggregierte Metriken)

### Consent-Stufen korrekt implementiert

- [ ] Level 0 (Essential): Nur Error-Logging und aggregierte Performance-Metriken
- [ ] Level 1 (Analytics): Page Views, Klicks, Scroll, Session — NUR nach Opt-in
- [ ] Level 2 (Extended): Session Replay, Heatmaps, Surveys — NUR nach explizitem Opt-in
- [ ] Consent-Status wird korrekt in localStorage gespeichert
- [ ] Consent-Widerruf loscht gespeicherte Daten

### Laufend (nach Go-Live)

- [ ] Quartalweise Compliance-Audit
- [ ] Prufen auf unautorisierte Tracking-Scripts
- [ ] DPAs auf Aktualitat prufen
- [ ] Neue regulatorische Anforderungen bewerten
- [ ] Consent-Raten analysieren (Opt-in-Quote)
- [ ] Betroffenenrechte-Prozess funktioniert (Auskunft, Loschung, Widerspruch)

---

## 11. Anhang: Dateistruktur und Einstiegspunkte

### Betroffene Dateien

| Datei | Anderungsart | Umfang |
|---|---|---|
| `js/site.js` | Erweitern | data-track Attribute in 14 Render-Funktionen + init()-Aufruf |
| `js/tracking.js` | Neu erstellen | ~120 Zeilen |
| `js/tracking-micro.js` | Neu erstellen | ~150 Zeilen |
| `js/tracking-consent.js` | Neu erstellen | ~80 Zeilen |
| `js/tracking-performance.js` | Neu erstellen | ~60 Zeilen |
| `index.html` | Erweitern | Script-Tags + CMP-Embed |
| `products.html` | Erweitern | Script-Tags + CMP-Embed |
| `services.html` | Erweitern | Script-Tags + CMP-Embed |
| `customers.html` | Erweitern | Script-Tags + CMP-Embed |
| `news.html` | Erweitern | Script-Tags + CMP-Embed |
| `pricing.html` | Erweitern | Script-Tags + CMP-Embed |
| `use-cases.html` | Erweitern | Script-Tags + CMP-Embed |

### Kritische Zeilennummern in site.js

| Zeile | Funktion | Relevanz |
|---|---|---|
| 52-57 | createEl() | Pattern fur Element-Erstellung |
| 131-140 | buildSectionShell() | Setzt bereits dataset-Attribute — Vorbild |
| 142-406 | renderNavigation() | Grosste Funktion, meiste trackbare Elemente |
| 408-456 | renderHero() | Kritische CTAs |
| 458-509 | renderVideoSection() | Video-Play-Tracking |
| 713-738 | renderPricing() | Conversion-kritische CTAs |
| 766-869 | renderFeatureAccordeon() | Komplexeste Interaktions-Logik |
| 871-888 | renderFaq() | Details/Summary Toggle-Tracking |
| 902-964 | renderCTA() | Formulare — wichtigstes Conversion-Element |
| 1497-1535 | renderApp() | Hier tracking.init() einfugen |
| 1537-1549 | init() | Async Entry-Point |

### HTML-Seiten und ihre data-page Werte

| Datei | data-page | Haupt-Sections |
|---|---|---|
| index.html | home | hero, video, features, metrics, testimonials, cta, footer |
| products.html | products | hero, feature-accordeon, benefits, comparison, pricing, cta |
| services.html | services | hero, features, use-cases, cta |
| customers.html | customers | hero, testimonials, logos, cta |
| news.html | news | hero, news-grid, cta |
| pricing.html | pricing | hero, pricing, comparison, faq, cta |
| use-cases.html | use-cases | hero, content-blocks, cta |

---

## Abschlusshinweis

Dieses Dokument enthalt alle Informationen, die fur die vollstandige Implementierung
des Micro-User-Tracking-Systems benotigt werden. Der Prompt in Abschnitt 1 gibt
Claude Code den vollstandigen technischen Kontext, um die Implementierung
eigenstandig durchzufuhren.

**Vor der Implementierung mussen abgeschlossen sein:**
1. Analytics-Tool ausgewahlt und bereit (To-Do A1)
2. CMP ausgewahlt und konfiguriert (To-Do A2)
3. Datenschutzerklarung erstellt und juristisch gepruft (To-Do A3 + B3)
4. DPAs abgeschlossen (To-Do A5)
5. KPIs und Event-Prioritaten festgelegt (To-Do A4)

Ohne diese Voraussetzungen darf keine Tracking-Implementierung live gehen.
