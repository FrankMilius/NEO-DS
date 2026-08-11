# Typografie-Audit — Design System (WEBSITE26 / SCSS)

**Datum:** 2026-06-25
**Geprüfter Umfang:** 181 SCSS-Dateien (ITCSS / Atomic Design), Fokus Typografie-Layer
**Methodik:** Skill `design:design-system` (audit-Modus) + erweiterte Typografie-Rubrik
(Scale-Design, Line-Height-System, Font-Weight, A11y-Sizing, Font-Loading/Privacy, i18n)

---

## Summary

| Kennzahl | Wert |
|---|---|
| Geprüfte Token-Dateien | 4 Kern (`_typography.scss`, `_tokens-typography.generated.scss`, `_mixins-typography.scss`, `_typography` utilities) + Element-/Komponenten-Layer |
| Token-Architektur | Fluid Custom Properties (`clamp()`), 320–1400px Viewport |
| **Gesamt-Score** | **63 / 100** |
| Reifegrad | Solide Grundarchitektur, mit klaren Lücken bei Konsistenz, Font-Loading und A11y-Mindestgrößen |

**Kurzfazit:** Das System hat ein architektonisch durchdachtes, fluides Typografie-Fundament mit sehr sauberer Tokenisierung von Schriftfamilie und -gewicht. Die größten Risiken liegen woanders: render-blockierendes Google-Fonts-`@import` mit EU-Datenschutzproblem, ein doppelter „Source of Truth", massiv hardcodierte `line-height`-Werte und zu kleine Mindestschriftgrößen am unteren Ende der Skala.

---

## Bewertung nach Rubrik

| Dimension | Score | Kommentar |
|---|---|---|
| Token-Architektur / Single Source of Truth | 11 / 15 | Starke Custom-Property-Schicht, aber tote Doppelstruktur (statische Maps) |
| Tokenisierungs-Abdeckung (keine Hardcodes) | 9 / 15 | Family/Weight exzellent, aber `line-height`/`letter-spacing`/`font-size` vielfach hartkodiert |
| Scale-Design (Ratio, Harmonie) | 7 / 10 | Sauberes modulares 1.2-System, aber zu kleine Min-Größen unten |
| Fluid / Responsive | 9 / 10 | Vorbildliches `clamp()`-System mit einheitlicher Viewport-Range |
| Line-Height-System | 5 / 10 | Tokens vorhanden, in Komponenten aber massiv umgangen |
| Font-Weight-System | 6 / 10 | Saubere Tokens, aber geladene Schnitte passen nicht zur Token-Skala |
| Accessibility (Sizing, Zoom, Min-Size, Zeilenlänge) | 9 / 15 | rem-Basis & Touch-Targets gut, aber 8–12px-Texte & ungenutzte `prose-max-width` |
| Font-Loading / Performance / Datenschutz | 4 / 10 | `@import` render-blockierend + Google-Fonts-EU-Transfer |
| Internationalisierung / Robustheit | 3 / 5 | Gute Fallback-Stacks, aber kein Subsetting, keine Variable Fonts |
| **Gesamt** | **63 / 100** | |

---

## Stärken

**1. Durchgängiges Fluid-Type-System.** Alle drei Kategorien (Display, Heading, Paragraph) skalieren über `clamp()` mit einer einzigen, mit Spacing geteilten Viewport-Range (320–1400px). Die Slope/Intercept-Berechnung in `fluid-type-clamp()` ist mathematisch korrekt umgesetzt. Das ist State of the Art.

**2. Saubere Tokenisierung von Schriftfamilie und -gewicht.** Praktisch keine Hardcodes:
- `font-family`: durchgängig `var(--font-*)` oder `inherit`, **keine** literalen Font-Strings in Komponenten.
- `font-weight`: 224 von 229 Deklarationen (98 %) nutzen `var(--fnd-font-weight-*)`; **0** numerische Literale (`700`, `600` …) außerhalb der Settings. Die wenigen Ausnahmen sind legitim (`inherit`, `normal`, Mixin-Parameter).

**3. Zoom-/A11y-freundliche rem-Basis.** Kein `font-size` auf `html` überschrieben, keine `px`-Schriftgrößen-Literale. Damit bleibt Browser-Zoom und Nutzer-Default-Schriftgröße wirksam (WCAG 1.4.4).

**4. Modulare semantische Skala.** Ratio-basierte Stufen `2xs`–`9xl` (Faktor 1.2, „Minor Third") mit Basis 14–18px, plus `--type-scale`-Multiplikator für Kontexte (z. B. Dashboard 0.92). Klar, erweiterbar, konsistent.

**5. Solides A11y-Grundgerüst drumherum.** 44px Touch-Target-Token (WCAG 2.5.8), Focus-Ring-Tokens, Skip-Link, `prefers-reduced-motion` in 35 Dateien, `prefers-contrast`/`forced-colors`-Behandlung, `-webkit-font-smoothing`, durchgängig logische Properties (`margin-block`/`padding-inline`).

**6. Klare semantische Schichtung.** `display` (Hero/CTA) / `heading` / `paragraph` als Mixins (`@include heading('m')`) und Utilities, sauber auf die Element-Ebene (h1–h6, p, blockquote, code …) gemappt.

---

## Schwächen und Lücken

### Kritisch

**A. Google-Fonts-`@import` — Performance + EU-Datenschutz.**
`02-generic/_fonts.scss` lädt Manrope, Space Grotesk und DM Mono per
`@import url('https://fonts.googleapis.com/...')`.
- **Performance:** `@import` in CSS ist render-blockierend und seriell (CSS lädt erst, dann die Schrift-CSS, dann die Fonts). Kein `preconnect`, kein `preload`. `&display=swap` ist gesetzt (gut), löst aber das Wasserfall-Problem nicht.
- **Datenschutz (für dich als DE/EU-Betreiber relevant):** Das Einbinden über `fonts.googleapis.com` überträgt die IP des Besuchers an Google in die USA. Nach dem LG-München-Urteil (2022) und der DSGVO-Lage ist das ohne Self-Hosting abmahnungsrelevant. **Empfehlung: Fonts selbst hosten** (woff2, lokal), per `@font-face` mit `font-display: swap` und `<link rel="preload">`.

**B. Doppelter „Source of Truth" / toter Code.**
`_typography.scss` definiert statische Maps `$typography-display/-heading/-paragraph` **und** eine Funktion `get-typography()` — diese werden zur Laufzeit aber **nirgends** verwendet (Grep: 0 Treffer außerhalb der Definition). Die echten Werte kommen aus den Fluid-Custom-Properties. Folgen:
- Divergenz-Risiko: Statische Map und Fluid-Mapping können auseinanderlaufen.
- Bereits jetzt inkonsistent: Kommentar bei `heading.2xl` sagt „54px", `3.5rem` sind aber 56px; mehrere Kommentar-/Wert-Abweichungen.
- **Empfehlung:** Entweder die statischen Maps als echten Fallback aktiv nutzen oder ersatzlos entfernen.

**C. `line-height` wird massiv hartkodiert.**
89 literale `line-height`-Werte (`1.4`, `1.5`, `1.3`, `1`, sogar `5.25rem`) in Komponenten, statt der Tokens `--lh-tight/-heading/-body`. Das ist die größte Tokenisierungs-Lücke und führt zu uneinheitlichem vertikalem Rhythmus. **Empfehlung:** `--lh-*`-Token-Set erweitern (z. B. `--lh-snug`, `--lh-relaxed`) und Komponenten darauf umstellen.

### Wichtig

**D. Mindestschriftgrößen zu klein (A11y/Lesbarkeit).**
Über die Fluid-Mappings landen kleine Paragraph-Stufen sehr niedrig:
- `paragraph.xs` → `2xs` (Step −3): rechnerisch **~8.1px** (min) bis ~10.4px (max).
- `paragraph.s` → `xs` (Step −2): **~9.7px** bis ~12.5px.

Text unter ~12px ist auf Mobile praktisch unlesbar und ein klares Usability-/A11y-Problem. **Empfehlung:** Untergrenze der Body-Skala auf ~12px (besser 14px) anheben oder die kleinsten Paragraph-Stufen auf höhere Steps mappen.

**E. Font-Weight-Skala ≠ geladene Schnitte.**
Tokens definieren `light 300 … black 900`. Geladen werden aber nur: Manrope 300–800, Space Grotesk 400–700, DM Mono 300–500.
- `--fnd-font-weight-black: 900` existiert, ist aber **für keine Familie geladen** → Browser synthetisiert „Faux Bold" (unsauberes Rendering), falls verwendet.
- **Empfehlung:** Token-Skala und geladene Achsen angleichen, oder auf **Variable Fonts** umstellen (Manrope und Space Grotesk sind als VF verfügbar) und die `wght`-Achse voll nutzen.
- **Erledigt (2026-08-11):** Alle drei Familien liegen jetzt als Variable Fonts vor, selbst gehostet. DM Mono ist durch **JetBrains Mono** ersetzt (`wght 100–800`, mit echtem Kursivschnitt) — damit entfällt die Lücke zwischen Token-Skala und geladenen Schnitten in der Monospace. `--fnd-font-weight-black: 900` liegt weiterhin über der Mono-Achse (max. 800); die Kennzahl nutzt deshalb `bold 700`.

**F. `--fnd-prose-max-width: 72ch` definiert, aber nicht angewendet.**
Es gibt keine `.prose`-/Reading-Width-Utility, die den Token einsetzt. Optimale Zeilenlänge (ca. 45–75 Zeichen, WCAG 1.4.8) wird damit nicht erzwungen. **Empfehlung:** `.u-prose { max-width: var(--fnd-prose-max-width); }` ergänzen und in Content-Templates anwenden.

**G. Heading-Gewichtshierarchie flach.**
Alle h1–h6 nutzen `--fnd-font-weight-heading: 400` (Space Grotesk Regular). Für große Displays gewollt möglich, aber es gibt keine Gewichts-Differenzierung in der Hierarchie. Prüfen, ob das Absicht ist; ggf. semantischere Heading-Weight-Tokens vergeben.

### Geringer Aufwand / Quick Wins

**H. Utility-/Token-Abdeckung unvollständig.** Tokens definieren Display bis `2xl`, Heading `xxs`–`2xl`, Paragraph `xs`–`xl`. Die Utilities exponieren aber nur Display `s`–`l`, Heading `xxs`–`xl` (kein `2xl`), Paragraph `s`–`xl` (kein `xs`). Inkonsistent zwischen Token-Definition und nutzbarer Oberfläche.

**I. `letter-spacing` hartkodiert.** 38 literale Werte außerhalb der Settings.

**J. Hardcodierte `font-size`-Eigenbau-`clamp()`s.** ~21 Stellen (v. a. Organisms wie `_feature-accordion`, `_bento-grid`, `_solution-tabs`) definieren eigene `clamp()`-Ranges statt das Fluid-System zu nutzen.

**K. Kein `text-wrap: balance`/`pretty`.** Moderner, billiger Gewinn für Headline-Umbrüche und Witwen/Waisen — derzeit nirgends genutzt.

**L. Keine OpenType-/Variable-Features.** `font-feature-settings` nur an einer Stelle (Datums-Spalte), kein `font-optical-sizing`, kein `unicode-range`-Subsetting für i18n/Performance.

---

## Priorisierte Maßnahmen

1. **Fonts selbst hosten** (woff2 + `@font-face` + `preload`), Google-`@import` entfernen. Löst Performance **und** DSGVO-Risiko gleichzeitig. *(Kritisch, hoher Impact)*
2. **`line-height`-Tokens erweitern und Komponenten umstellen** (89 Hardcodes auf `--lh-*`). *(Kritisch für Konsistenz)*
3. **Mindestschriftgrößen anheben** (kleinste Paragraph-Stufen ≥ 12px, ideal 14px). *(A11y)*
4. **Doppelten Source of Truth auflösen** — statische Maps + `get-typography()` entfernen oder als echten Fallback aktivieren.
5. **Font-Weight-Token-Skala an geladene Schnitte angleichen** oder auf Variable Fonts wechseln.
6. **`.u-prose` mit `prose-max-width` ergänzen** und in Content-Templates anwenden.
7. **Utility-Abdeckung vervollständigen** (Display `xl`/`2xl`, Heading `2xl`, Paragraph `xs`).
8. **Quick Wins:** `text-wrap: balance` für Headings, `letter-spacing`/Eigen-`clamp()`-Hardcodes tokenisieren.

---

## Anmerkung zur Methodik

Der Skill `design:design-system` lieferte das Audit-Gerüst (Summary, Token-Coverage-Tabelle, Priority Actions). Die fachspezifische Tiefe — Scale-Ratio-Analyse, Line-Height-System, Mindestgrößen-Berechnung, Font-Loading/Datenschutz und i18n — stammt aus der ergänzten Typografie-Rubrik, da der Skill Typografie nur als eine von sechs Token-Kategorien (eine Tabellenzeile) behandelt. Für reine Kontrast-/Größenprüfung lässt sich zusätzlich `design:accessibility-review` kombinieren.
