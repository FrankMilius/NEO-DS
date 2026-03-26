# Analyse: Nick Babich Artikel zu Claude Code + Figma

**Datum:** 2026-03-26
**Quelle:** 7 Artikel von Nick Babich auf UX Planet/Medium (März 2026)
**Kontext:** Bewertung für NEO Design System Anwendungsfälle

---

## 1. Artikel-Zusammenfassungen

### Artikel 1: "CLAUDE.md Tips & Tricks for Product Designers"
**Datum:** 21. März 2026 | **Lesezeit:** 5 Min

8 Tipps für CLAUDE.md:
1. Unterschied project-based vs. global CLAUDE.md
2. Essentielle Sektionen (Project Overview, Tech Stack, Coding Guidelines, A11y, Testing)
3. `/init` zum automatischen Generieren
4. Max 200 Zeilen — darüber Routing Rules (`@docs/design-system.md`)
5. Spezifische Instruktionen statt vage ("Keep components under 200 lines" statt "Write clean code")
6. CLAUDE.md als Living Document behandeln
7. `.claude/rules/` für modulare Regeln (ui.md, testing.md, accessibility.md)
8. CLAUDE.md in Git committen

---

### Artikel 2: "How to Prevent Claude Code from Creating Generic Web Designs"
**Datum:** 18. März 2026 | **Lesezeit:** 8 Min

5 Techniken gegen generisches Design:
1. **`frontend-design` Skill** in CLAUDE.md erzwingen (`## DO THIS FIRST: Invoke 'frontend-design' skill`)
2. **Visual References Ordner** (`@web_design_references`) — Screenshots als Inspirationsquelle
3. **Screenshot Loop** — Claude macht Screenshots, vergleicht mit Referenz, fixt Abweichungen (2 Runden)
4. **Anti-Generic Design Guardrails** — Verbotsliste (keine Default-Tailwind-Palette, keine `shadow-md`, keine `transition-all`, etc.)
5. **Brand Assets Ordner** (`@my_brand_assets`) — Logo, Styleguide, Typografie-Dateien

Kernkonzept: Screenshot-Loop = Claude nimmt Screenshot → vergleicht mit Referenz → fixt → wiederholt.

---

### Artikel 3: "Claude Code CLAUDE.md vs Skills"
**Datum:** 17. März 2026 | **Lesezeit:** 5 Min

Klare Architektur-Trennung:
- **CLAUDE.md = "Project Brain"** — Alles was mit "In this project..." beginnt
- **Skills = "Reusable Capabilities"** — Workflows die projektübergreifend gelten

3 Anti-Patterns:
1. ❌ Workflows in CLAUDE.md (gehört in Skills)
2. ❌ Projekt-Regeln in Skills (gehört in CLAUDE.md)
3. ❌ Logik duplizieren (Skills sollen CLAUDE.md lesen, nicht wiederholen)

Skills referenzieren in CLAUDE.md:
```
## Available Skills
- run-ux-audit → ./skills/ux/run-ux-audit.md
- build-component → ./skills/coding/build-component.md
```

---

### Artikel 4: "Claude Code Project Structure Best Practices"
**Datum:** 16. März 2026 | **Lesezeit:** 4 Min

5 Prinzipien:
1. CLAUDE.md im Root
2. Bei >200 Zeilen: Split in importierte Dateien (`@claude/architecture.md`)
3. `/docs` Ordner für Kontext (Roadmap, API-Docs)
4. `/workflows` Ordner für Arbeitsabläufe (build-component.md, write-auto-tests.md)
5. `/tools` Ordner für Service-Scripts (statt `/scripts` — Verwechslungsgefahr mit Frontend-Scripts)

Workflow-Chaining: `build-component.md` ruft am Ende `@workflows/write-auto-tests.md` auf.

---

### Artikel 5: "Claude Skills 2.0 for Product Designers"
**Datum:** 7. März 2026 | **Lesezeit:** 8 Min

**Skill Creator** = Meta-Skill der automatisch neue Skills generiert:
1. `/manage plugins` → skill-creator installieren
2. Beschreibe gewünschte Capability in Plain Language
3. Skill Creator: Analysiert → fragt Rückfragen → generiert Skill-Package
4. **Automatische Qualitätsevaluation**: Testet Output mit/ohne Skill, vergleicht Ergebnisse

Beispiel: `super-landing-page` Skill — generiert Seiten im Apple-Stil.
Workflow: Capability beschreiben → Skill Creator baut SKILL.md → Tests → Evaluation Table (with/without skill).

---

### Artikel 6: "Current State of Claude Code and Figma Two-way Integration"
**Datum:** 5. März 2026 | **Lesezeit:** 4 Min

**Ehrliche Bewertung — 4 Limitierungen:**
1. **Auto-Layout-Probleme**: Figma-Export hat kaputte Layouts, nicht responsive
2. **Keine Komponenten**: UI-Elemente als einzelne Frames, nicht als Figma Components
3. **Styling-Defekte**: Gradienten, komplexe Styles gehen bei Export verloren (Text-Gradient → Weiß)
4. **Fehlende Sections**: Komplexe Designs verlieren Teile beim Export

**Fazit des Autors:** "Feels more like a beta feature rather than a final product."

---

### Artikel 7: "Claude Code + Figma = 💛"
**Datum:** 4. März 2026 | **Lesezeit:** 7 Min

**4-Schritt Setup-Guide:**
1. **Setup**: `claude mcp add --transport http figma https://mcp.figma.com/mcp`
2. **Code Design**: Claude generiert Landing Page
3. **Transfer to Figma**: `transfer this design into Figma`
4. **Round-Trip**: Änderung in Figma → `update the style according to this [FIGMA LINK]`

Plugin: `/plugin install figma@claude-plugins-official`

Wichtig: Funktioniert nur mit **bezahltem Figma-Seat** (Professional oder höher).

---

### Artikel 8: "Claude Code for Creating Design System Documentation"
**Datum:** 5. März 2026 | **Lesezeit:** 4 Min

**3-Schritt Dokumentations-Workflow:**
1. In Figma: Komponente auswählen → "Copy link to selection"
2. In Claude: `document this component [FIGMA LINK]`
3. Claude extrahiert Properties → generiert Markdown → optional: `publish it as a web page`

Output: Button.md mit allen States, Properties, Varianten.
Konversion: Markdown → HTML-Seite mit einem Prompt.

---

## 2. Relevanz für deine Anwendungsfälle

### Matrix: Artikel × Anwendungsfall

| Artikel | Design System | Storybook | Figma Pipeline | Drupal | CI/CD | Skills/Agents | Product Mgmt |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1. CLAUDE.md Tips | ✅ | — | — | ✅ | — | ✅ | — |
| 2. Anti-Generic Design | ✅ | — | — | ✅ | — | ✅ | — |
| 3. CLAUDE.md vs Skills | ✅ | — | — | — | — | ✅✅ | — |
| 4. Project Structure | ✅ | — | — | — | — | ✅ | — |
| 5. Skills 2.0 | ✅ | ✅ | — | — | — | ✅✅✅ | ✅ |
| 6. Figma Limitations | — | — | ✅✅✅ | — | — | — | — |
| 7. Figma Setup | — | — | ✅✅ | — | — | — | — |
| 8. DS Documentation | ✅✅ | ✅✅ | ✅ | — | — | — | — |

### Detaillierte Relevanz-Bewertung

#### A. Design System (HÖCHSTE RELEVANZ)

**Artikel 1 + 4 — CLAUDE.md Optimierung:**
- Dein CLAUDE.md ist gut, aber **zu lang** (>200 Zeilen laut Memory). Die Artikel empfehlen Routing Rules.
- **Dein Potenzial:** CLAUDE.md aufteilen in importierte Dateien: `@claude/tokens.md`, `@claude/scss-conventions.md`, `@claude/drupal-rules.md`

**Artikel 2 — Anti-Generic Guardrails:**
- Das Konzept der "Anti-Generic Design Guardrails" ist direkt auf dein SCSS-System übertragbar.
- **Dein Potenzial:** Guardrails-Sektion in CLAUDE.md die spezifisch für dein Token-System gilt: "Nie hardcodierte Farben", "Immer `var(--nc-*)` für Component Tokens", "Nie `!important`"

**Artikel 8 — DS Documentation aus Figma:**
- Direkter Workflow: Figma-Komponente → Dokumentation → Storybook
- **Dein Potenzial:** Kombination mit `/publish-storybook` — Figma-Doku als ergänzende Story-Docs

#### B. Skills & Agents (HOHE RELEVANZ)

**Artikel 3 — CLAUDE.md vs Skills Architektur:**
- Direkte Validierung deiner Architektur: Du hast die Trennung richtig gemacht
- **Aber:** Artikel warnt vor duplizierter Logik — prüfe ob deine Skills CLAUDE.md-Regeln wiederholen

**Artikel 5 — Skill Creator (Skills 2.0):**
- **Skill Creator Plugin** kann Skills automatisch generieren und qualitätsprüfen
- **Dein Potenzial:** Statt manuell SKILL.md zu schreiben, beschreibe die Capability und lass Skill Creator das SKILL.md generieren + evaluieren

#### C. Figma Pipeline (MITTLERE RELEVANZ)

**Artikel 6 — Figma Limitierungen:**
- Bestätigt deine Entscheidung, auf Tokens Studio statt Variables API zu setzen
- Auto-Layout-Probleme bedeuten: Figma-Export ist für **Dokumentation** geeignet, nicht für **Produktion**
- **Dein Potenzial:** Figma MCP für Dokumentations-Generierung nutzen (Artikel 8), nicht für Code-Export

**Artikel 7 — Figma MCP Setup:**
- `claude mcp add --transport http figma https://mcp.figma.com/mcp` — einfacher als dein API-Token-Ansatz
- **Dein Potenzial:** Figma MCP als Alternative/Ergänzung zu deinem `figma-sync.mjs`

---

## 3. Bewertung: Must-Have vs. Nice-to-Have

### MUST-HAVE (sofort umsetzen)

| # | Was | Warum | Aufwand |
|---|-----|-------|---------|
| **M1** | **CLAUDE.md Modularisierung** — Split in `@claude/tokens.md`, `@claude/scss.md`, `@claude/drupal.md` | CLAUDE.md ist >200 Zeilen → Token-Overhead, schlechtere Adherence | S (1h) |
| **M2** | **Anti-Generic Guardrails** — Sektion in CLAUDE.md mit SCSS-spezifischen Verboten | Verhindert hardcodierte Werte, Legacy-Patterns, `!important` | S (30min) |
| **M3** | **Skill Creator Plugin** installieren und testen | Skills automatisch generieren + qualitätsprüfen statt manuell schreiben | S (1h) |
| **M4** | **Screenshot-Loop** in `/frontend-design` Skill integrieren | Automatische visuelle QA bei Design-Generierung | M (2h) |
| **M5** | **Figma MCP** einrichten (statt nur API-Token) | Direkter Zwei-Wege-Zugang zu Figma — kein manueller JSON-Export nötig | S (30min) |

### NICE-TO-HAVE (bei Gelegenheit)

| # | Was | Warum | Aufwand |
|---|-----|-------|---------|
| **N1** | **Visual References Ordner** (`@web_design_references`) | Für neue Drupal-Seiten mit Referenz-Screenshots arbeiten | S |
| **N2** | **Brand Assets Ordner** (`@my_brand_assets`) | Logo, Styleguide zentral für Claude verfügbar | S |
| **N3** | **`.claude/rules/`** Verzeichnis für modulare Regeln | Saubere Trennung: UI, Testing, A11y, Copywriting | M |
| **N4** | **Figma DS-Dokumentation** via MCP (Artikel 8) | Figma-Komponenten → Markdown → Storybook-Docs | M |
| **N5** | **`/tools` statt `/scripts`** Naming-Konvention | Klarere Trennung Service-Tools vs. Frontend-Scripts | S |

### NICHT RELEVANT

| Was | Warum nicht |
|-----|-------------|
| Tailwind-spezifische Guardrails | Dein System nutzt SCSS+BEM, nicht Tailwind |
| React/TypeScript Konventionen | Dein Stack ist SCSS+Vue+Drupal, nicht React |
| ShadCN UI Patterns | Nicht in deinem Tech Stack |

---

## 4. Lücken: Was die Artikel NICHT abdecken

Die Artikel fokussieren auf **generische Web-Design-Projekte** (React + Tailwind Landing Pages). Folgende Aspekte deines Workflows werden **nicht behandelt**:

### Nicht abgedeckt aber für dich relevant

| Lücke | Relevanz für dich | Empfehlung |
|-------|-------------------|------------|
| **Design Token Pipeline** (SCSS → CSS → JSON) | Kern deines Systems | Bestehender `/audit-pipeline` Skill deckt das ab |
| **Recipe-basiertes Component System** | Einzigartig für NEO | Kein Artikel behandelt Recipes — dein Ansatz ist fortgeschrittener |
| **Drupal Integration** (Block-Typen, Twig, Config Sync) | Kritisch für dich | Dein `/create-drupal-block` Skill ist weiter als alles in den Artikeln |
| **Multi-Agent Orchestrierung** | Deine Phase 6 | Babich erwähnt keine Agents — dein Agent-Netzwerk ist ein Alleinstellungsmerkmal |
| **Quality Dashboard mit KPIs** | Deine Phase 5 | Kein Artikel behandelt automatisierte Quality-Metriken |
| **Component Evaluation gegen Markt** | Deine Phase 4 | Babich macht keine systematischen Benchmarks gegen Radix/Carbon/Ant |
| **Storybook Auto-Generation aus Recipes** | Deine Phase 2 | Babich dokumentiert manuell, dein Generator ist automatisiert |
| **CI/CD mit Agent Network** | Deine Phase 6 | Babich erwähnt keine CI/CD-Integration |
| **PostToolUse Hooks** für automatische Validierung | In deinem `settings.json` | Nicht in Babichs Artikeln |
| **Memory System** für persistente Projekt-Erinnerungen | In deiner `.claude/memory/` | Babich erwähnt Memory nicht |

### Fazit

**Du bist den Artikeln in den meisten Bereichen voraus.** Die Artikel sind nützlich für **Grundlagen** (CLAUDE.md Struktur, Skill-Architektur, Figma-Setup), aber dein Setup ist signifikant fortgeschrittener:

- **Babich:** Manuelle Skills, kein Testing, kein CI/CD, einfache Figma-Integration
- **Du:** 13 Skills, 4 Agents, 28 Tests, CI/CD Pipeline, Quality Dashboard, Recipe-basiertes DS

Die **5 Must-Haves** oben sind die konkreten Punkte, die du aus den Artikeln übernehmen solltest. Alles andere hast du bereits besser gelöst.
