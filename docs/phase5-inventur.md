# Phase 5 — Inventur der Bausteine ohne Recipe

Stand 07.10.2026, Plan v3, Phase 5 („Recipes für die Bausteine ohne Recipe").
Grundlage: `data/component-registry.json` (`gaps.*.missingRecipe` und alle
Templates/Utilities ohne `data/<id>-recipe.json`) — 39 Einträge, davon einer
ein Fehler der Registry (`recipe`, siehe unten). Ergänzt um `09-pages/_docs`,
das die Registry nicht führt.

Grundsatz des Plans: **Templates und Website-Blöcke ja; Utilities und
Hilfsklassen nein.**

Einordnung:

- **(a)** Recipe anlegen — Template, Website-Block oder eigenständiges Bauteil
- **(b)** kein Recipe — Utility, Hilfsklasse oder Teil eines anderen Bauteils
  (dort als Anatomie-Element/Modifier ergänzt, falls es fehlte)
- **(c)** unklar/tot — kein Verwender; nicht gelöscht, Entscheidungsfall

Verwender gezählt in `scss/`, `data/markup/`, `docs/`, `apps/`, `packages/`,
`stories/` und im Drupal-Theme `neo_fe` (Twig, JS). „Website" heißt: das
Drupal-Theme rendert die Klasse.

## (a) Recipe angelegt — 14

| id | Schicht | Wurzel | Verwender | Begründung |
|---|---|---|---|---|
| container-intent | Object | `.container` | Website: Section-Layout `neo-section-default` (`container container--{{ width }}`), Kopfzeile `neo-nav` | Layout-API der Website (Breiten nach Inhaltsabsicht), eigenes Bauteil neben `.nc-container` |
| content | Object | `.nc-content` | Website: `node.html.twig` (Vollansicht) | Lesespalte der Inhaltsseite |
| media-frame | Object | `.nc-media-frame` | Website: text-media, feature-list (Twig und `data/markup`) | Bildrahmen mit Hairline und Elevation, von zwei Website-Blöcken genutzt |
| prose | Object | `.nc-prose` | Website: `field--body.html.twig` | Lesefluss-Spalte mit Breakout (`data-bleed`) |
| section-header | Molecule | `.nc-section-header` | Website: `neo_fe:block-header` (rund 20 Blöcke), `data/markup` von feature-list, form-block, text-media | geteilter Block-Kopf aller Website-Blöcke |
| accordion-block | Organism | `.nc-accordion-block` | Website: Block `neo_accordion` | Website-Block (Kopf + Akkordeon, Breitenverhältnis) |
| block-bundle | Organism | `.nc-block-bundle` | Website: Block `neo_block_bundle` | Website-Block (Kopf + gestapelte Blöcke) |
| reference-page | Organism | `.nc-refpage` | Website: `node--reference-page`, Block `neo_doc_section`, `neo-theme.js` (Scroll-Spy) | Referenzseite mit Verzeichnis; `.nc-doc-section` ist ihr Abschnitt |
| text-cta | Organism | `.nc-text-cta` | Website: Block `neo_text_cta` | Website-Block (Text + CTA-Karte) |
| dashboard | Template | `.t-dashboard` | Doku `template-dashboard`, Story | Template (im SCSS als „DEPRECATED" zugunsten der Shell-Presets markiert) |
| error-page | Template | `.t-error` | Doku `template-error-page`, Story | Template (DEPRECATED, s. o.) |
| home-basic | Template | `.t-home-basic` | Doku `template-home-basic`, Story | Template (DEPRECATED, s. o.) |
| home-hero | Template | `.t-home-hero` | Doku `template-home-hero`, Story | Template (DEPRECATED, s. o.) |
| settings-page | Template | `.t-settings` | Doku `template-settings-page`, Story | Template (DEPRECATED, s. o.) |

Alle neuen Recipes stehen auf `meta.status: "draft"` (Kennzeichen „Entwurf"). Die Templates mit Recipe erscheinen in der Navigation als Komponenten-Sektion (RecipeArena) statt als Wireframe-Platzhalter.

## (b) Kein Recipe — 21 (+ `09-pages`)

| id | Schicht | Klassen | Verwender | Einordnung / Maßnahme |
|---|---|---|---|---|
| badge-row | Atom | `.nc-badge-row` | Website: `neo_fe:badge-row` (Kopf und drei Heroes) | Hilfsklasse (Anordnung einer Reihe `.nc-label`). Anatomie ergänzt: hero `badges` (`.nc-hero__badges`), section-header `badges`; hero-tom/hero-tmob hatten den Slot schon |
| form-hp | Atom | `.nc-form-hp` | Website: `neo-theme.js`; `data/markup` form, form-block | Hilfsklasse (Honeypot-Feld, visuell verborgen). Anatomie ergänzt: form und form-block `honeypot` |
| sizes | Atom | — | — | siehe (c) |
| table | Atom | `.nc-compare-table` | compare-table | SCSS-Datei von compare-table (am 25.08.2026 zusammengelegt); die Sektion „Table" zeigt per `ALIASE` die Arena von compare-table. Nichts zu tun |
| tbl-icon | Atom | `.nc-tbl-icon`, `--check`, `--dash` | Website: `neo-theme.js`; `data/markup` compare-table, table-block | Teil der Tabellenzelle. Anatomie ergänzt: tbl-cell und compare-table `icon` |
| breadcrumb-section | Molecule | `.nc-breadcrumb-section`, `--above`, `--below` | Website: `page.html.twig`; Shell-SCSS | Hülle des Breadcrumbs. Anatomie ergänzt: breadcrumb `section` |
| card-grid-cq | Molecule | `.nc-card-grid-cq` | Website: Block `neo_card_grid` | Container-Query-Kontext des Kartenrasters. Anatomie ergänzt: card-grid `cq` |
| section-intro | Molecule | — | — | siehe (c) |
| bento-section | Organism | `.nc-bento-section` | Website: Block `neo_bento_grid` | Sektionspolster des Bento-Rasters. Anatomie ergänzt: bento-grid `section` |
| card-grid-section | Organism | — | — | siehe (c) |
| content-templates | Template | `.t-dashboard-overview`, `.t-article`, `.t-card-grid`, `.t-form`, `.t-split` | Doku `shell` | Inhalts-Layouts für `.nc-shell__content-body` — Teil der Shell. Anatomie ergänzt: shell `layout-*` (je Inhalts-Layout ein Slot) und `domNotes` |
| a11y | Utility | `.u-sr-only`, `.u-skip-link`, `.u-focus-ring` … | breit | Utility |
| block-roles | Utility | Typo-Rollen der Blöcke | breit | Utility |
| content-width | Utility | `.nc-cw-*` | Website (Block-Wrapper) | Utility |
| fragment | Utility | `.fragment`, `.u-fragment` | Präsentation | Utility |
| spacing | Utility | `.u-m*-auto` | — | Utility |
| sr-only | Utility | `.nc-sr-only` | breit | Utility |
| themes | Utility | `.u-bg-*` | — | Utility |
| type-utilities | Utility | `.nc-type-*` | breit | Utility |
| typography | Utility | `.u-text-*` | — | Utility |
| visibility | Utility | `.u-hidden`, `.hidden` … | breit | Utility |
| *(09-pages/docs)* | Page | Doku-Seitenstile | Doku | kein Bauteil (Gestaltung der Doku-Seiten) |

Die Utilities `spacing`, `themes` und `typography` haben ebenfalls kaum
Verwender; nach dem Grundsatz bekommen Utilities kein Recipe — sie sind hier
nicht weiter geprüft.

## (c) Unklar/tot — 5 (Entscheidungsfälle, nichts gelöscht)

| id | Datei | Befund |
|---|---|---|
| sizes | `05-atoms/_sizes.scss` | erzeugt kein CSS; Kommentar-Referenz für Button-Größen mit alten Klassennamen (`.button.xs` … `.button.2xl`, 24–80 px), die das Button-Recipe so nicht kennt |
| section-intro | `06-molecules/_section-intro.scss` | kein Verwender in DS, Doku, Konfigurator, Drupal-Twig/-JS (nur noch der Aufnahme-Vermerk in `neo-overrides.css` und `styles.css` des Themes) |
| card-grid-section | `07-organisms/_card-grid-section.scss` | kein Verwender; die Karten-Raster-Blöcke nutzen `.nc-section-header`. Die Tokens `--nc-card-grid-title-*` hängen nur an dieser Regel |
| content-page | `08-templates/_content-page.scss` | Template, aber **nicht kompiliert**: `08-templates/_index.scss` bindet es nicht ein („ENTFERNT: ersetzt durch data-layout="content-page"“). `.t-content*` steht nicht in `styles.css`; Doku `template-content-page` und Story zeigen Klassen ohne Wirkung |
| form-page | `08-templates/_form-page.scss` | wie content-page: nicht eingebunden („ersetzt durch data-layout="focused"“), `.t-form-page*` fehlt in `styles.css`; Doku `template-form-page` und Story zeigen Klassen ohne Wirkung |

**Entschieden am 07.10.2026 (Entscheidungen Phase 5), umgesetzt ohne Website-Wirkung:**
`sizes`, `section-intro`, `card-grid-section` gelöscht (Button-Größen-Skala
steht jetzt in der Button-Doku, Abschnitt „Größen“; Tokens
`--nc-card-grid-title-*` mit entfernt, card-grid-Recipe 1.1.1);
`content-page` und `form-page` stillgelegt (Partials, Doku, Story,
Konfigurator-Sektion entfernt; Ersatz `data-layout="content-page"` bzw.
`"focused"`). `styles.css` 1244,5 → 1243,8 KB.

## Registry-Fehler

`recipe` in `components` ist kein Baustein: `scanArenas()` in
`scripts/generate-component-registry.js` las `RecipeArena.vue` als Arena eines
Bauteils „recipe". Behoben (Generator überspringt die RecipeArena; Eintrag aus
der Registry entfernt).
