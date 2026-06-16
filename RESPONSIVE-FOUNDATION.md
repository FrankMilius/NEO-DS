# Responsive Foundation — Migrationsnotiz

Token-getriebene Responsive-Foundation für das NEO Design System (WEBSITE26) und
das Drupal-Theme `neo_fe`. Vier Techniken: gestaffelte Intent-Container,
auto-fill Card-Grids, fluide Type/Space (bereits vorhanden, wiederverwendet),
Container Queries.

## Architektur-Leitplanken (Governance — WICHTIG)

Es gibt jetzt **drei klar getrennte Responsive-Achsen**. Wer sie vermischt,
verwässert die Foundation:

| Achse | Wofür | Quelle | NICHT für |
|---|---|---|---|
| **Viewport-Breakpoints** (`$breakpoints` sm/md/lg/xl/xxl, `respond-to`) | Page-Shell, Haupt-/Mobilnav, Full-Bleed-Hero | `00-settings/_breakpoints.scss` | Komponenten-Reflow |
| **Intent-Container** (`--container-prose…full`, `.container--*`) | Inhaltsbreite nach Absicht (Lesefluss vs. dichtes Grid) | `foundation.layout.container` | Media-Queries für Komponenten |
| **Container-Queries** (`@container`, `container-min/max`) | Komponenten-Reflow nach EIGENER Breite | `foundation.layout.container_query` | globale Layout-Sprünge |

**Regel:** Komponenten reagieren über `@container`, nicht über `@media`.
Viewport-Media-Queries nur noch für die wenigen echten Viewport-Fälle.

## Eine kanonische Container-Skala

Single Source: `data/design-tokens.json → foundation.layout.container`.

| Tier | Wert | Zweck |
|---|---|---|
| prose | 72ch | Fließtext (kappt hart, Lesbarkeit) |
| narrow | 768px | Formulare, fokussiert |
| **content** | **1090px** | Standardseiten (= Drupal Image-BP) |
| **wide** | **1290px** | Übersichten/Card-Grids (= Drupal Image-BP) |
| xwide | 1536px | Dashboards/dichte Grids |
| full | 100% | Full-Bleed |

**Konvergenz (Phase 2):** Früher existierten 4 „Seitenbreiten" parallel
(`--nc-container-max-width` 1440, `-wide` 1600, `-content` 1200, Intent 1090/1290).
Das war Drift. `04-objects/_container-intent.scss` zeigt die bestehenden
`--nc-container-max-width*` per Cascade auf die Intent-Tokens um → die ganze Site
(`.nc-container`) konvergiert ohne Template-Änderung auf **1090/1290**.

### DEPRECATED / Sunset
- `.nc-container--sm|md|lg|xl|xxl` (768/960/1200/1440/1600) — rohe numerische
  Modifier, abgekündigt. Neue Layouts: `.container--{tier}`.
- **Endgültiger Fix (offen):** die Component-Token-Quelle (`sync-component-tokens.js`)
  auf die Intent-Werte umstellen, dann entfällt der Cascade-Override.

## Ersetzte Hardcodes

- Card-Grid `minmax(280px,…)` + 3× `@media`-Override → Mixin `card-grid($min)`
  (`auto-fill` + `min()`-Guard), Min aus Token `cq('card-min')`.
- Card `--horizontal`/`--featured`: `respond-to('md')` → `container-min(card,'card-compact'|'card-wide')`.
- Text-Media Split (extern via `nc-grid--split`) → self-contained Grid + `container-min(text-media,'media-text-stack')`.
- Toolbar Wrap: `respond-to-max('sm')` → `container-max(toolbar,'widget-two-col')`.
- Container-Breiten 1200/1440/1600 → Intent-Tokens (Konvergenz).

## MUSS-Komponenten auf Container Queries (Phase 1)

`card` (+ `--preview`/`--summary`-Varianten decken News-/Magazin-Teaser, Person-Card ab),
`text-media`, `metric` (KPI), `toolbar` (App-Launcher). Event-Card = Card-`--preview`.
Jede mit `container-context(...)`; Schwellen aus `$token-container-query`
(`@container` kann keine CSS-Vars in Bedingungen → SCSS-Map nötig).

Storybook: globaler Decorator (`.storybook/preview.js`) mit Toolbar-Toggle
inkl. **„↔ Compare narrow + wide"** — zeigt jede Komponente schmal & breit
gleichzeitig, ohne die autogenerierten Stories zu ändern.

## Build / Sync — „Rebuild schlägt durch"

```bash
# 1. Tokens aus design-tokens.json generieren (SCSS-Maps + --fnd-* CSS-Vars)
npm run tokens            # ⚠ siehe Tooling-Hinweis

# 2. DS bauen UND ins Drupal-Theme synchronisieren (styles.css + design-tokens.css)
npm run build:drupal      # = build:css + sync:drupal

# 3. In Drupal
cd ../DRUPAL11 && ddev drush cr
```

Eine geänderte Container-/Type-Token-Definition im DS schlägt nach `build:drupal`
im Theme durch (verifiziert: 1200→1090 erreichte `neo_fe/css/design-tokens.css`).
Zielpfad via Env `NEO_DRUPAL_THEME` überschreibbar.

### Image ↔ Layout-Vertrag (Drift-Check, kein Generator)
```bash
npm run check:drupal-images
```
Asserted (respektiert Drupals Config-Ownership): `image.style.wide` Scale-Breite
== `container.content` (1090) **und** responsive `sizes`-Breakpoint == `container.wide`
(1290). Bricht (exit 1) bei Drift → ideal für CI. Bild-Switch und Layout-Umbruch
fallen damit garantiert zusammen.

## ⚠ Tooling-Hinweis (vorbestehend, sollte gefixt werden)

`scripts/generate-tokens.js` + `validate-tokens.js` nutzen `require`, das Repo hat
aber `"type":"module"` → unter Node ≥ 20 brechen `npm run tokens`/`tokens:validate`.
Workaround beim Bauen: Skript temporär als `.cjs` kopieren und ausführen.
**Empfehlung:** Token-Skripte auf `.cjs` umbenennen *oder* auf ESM-`import` umstellen.
(Neue Skripte `sync-drupal-css.js` / `check-drupal-image-breakpoints.js` sind ESM-konform.)

## Offen / nächste Schritte

- **SOLL-Komponenten** (noch nicht auf `@container`): Suchergebnis-Eintrag,
  Kommentar/Aktivität, Accordion-Item, Mega-Menü-Teaser.
- **Übersichten/Views** auf `.container--wide` + `card-grid` umstellen: Muster steht
  (Klasse + Mixin verfügbar), konkrete View-Templates noch zu verdrahten.
- **Component-Token-Quelle** auf Intent-Werte umstellen (Sunset des Cascade-Overrides).
- **Demo:** Artikel `node/2` hat Beispiel-Body (Prose + `data-bleed="wide"`) zur
  Veranschaulichung — bei Bedarf durch echten Inhalt ersetzen.
