# ADR-004: Server und Auslieferung – Docs-Server lokal, Bundle als CI-Artefakt/Release, Integration in Drupal

- **Status:** angenommen für Entwicklung und Auslieferung (Plan v2, 4.3);
  Integration in Drupal **vorgeschlagen**, abhängig von ADR-002
- **Datum:** 30.09.2026
- **Entscheider:** Frank Milius (Auslieferung), Drupal-Entwicklung (Integration)
- **Code:** `scripts/docs-server.js`, `apps/theme-configurator/vite.config.js`,
  `config/theme-config.vorlage.html`, `.github/workflows/theme-configurator.yml`,
  `.github/workflows/release-konfigurator.yml`

## Kontext

Der Konfigurator ist eine Vue-App (Vite). Sie braucht zur Laufzeit neben den
statischen Dateien einige Serverfunktionen: Werkseinstellung laden,
„Speichern“ (Strg+S), Zusatzpaletten in den Styleguide schreiben. Bis
29.09.2026 lauschte der Docs-Server auf allen Interfaces mit CORS `*`, obwohl
er ins Repository schreibt; bis Plan v2, 4.3 lag das gebaute Bundle im Repo
(jeder Build = großer Diff, Stand oft veraltet). Zielbild: Die App wird Teil
der Config Tools der neo Workplace Plattform (Drupal 11), Speichern in Drupal
(ADR-002).

## Entscheidung

1. **Docs-Server nur für die lokale Entwicklung** (`npm run docs`,
   `scripts/docs-server.js`, Node ohne Abhängigkeiten).
   - Lauscht auf `127.0.0.1:3000` (`HOST`, `PORT` überschreibbar), prüft den
     `Host`-Kopf (DNS-Rebinding) und bei POST die `Origin` (nur
     localhost/127.0.0.1/[::1]); Körper höchstens 2 MB; kein Caching.
   - Liefert das Projektverzeichnis statisch aus (keine Punkt-Pfade, kein
     Verlassen der Wurzel), `/` → 302 auf `/docs/`. Fehlt das Bundle,
     antwortet `/config/theme-config` mit 503 und Bauanleitung.
   - API-Endpunkte (vollständig):

     | Methode, Pfad | Wirkung | Aufrufer in der App |
     | --- | --- | --- |
     | `GET /api/neo-theme-defaults` | liest `data/neo-theme-defaults/neo-theme-defaults.json` → `{ status, defaults }` | `speicher/lokal.js` (`ladeStandard`, Reset auf NEO-Standard) |
     | `POST /api/save-theme` | prüft und schreibt `website/data/custom-theme.json` und `data/theme-overrides.css`; stößt, falls `../DRUPAL11` und `/opt/homebrew/bin/ddev` existieren, `ddev drush cr` an | `speicher/lokal.js` (`sichereEntwurf`, Strg+S) |
     | `GET /api/styleguide-status` | Zusatzpaletten aus `scss/scss/00-settings/_color-primitives.scss` | `stores/styleguide-sync.js` |
     | `POST /api/preview-styleguide-update` | Trockenlauf: Diff für neue Paletten | `stores/styleguide-sync.js` |
     | `POST /api/update-styleguide` | schreibt Paletten in `_color-primitives.scss`, `docs/color-docs.html`, `docs/color-docs.js` | `stores/styleguide-sync.js` |

2. **Vite-Dev-Server mit Proxy** für die Arbeit an der App: `/api` →
   `http://127.0.0.1:3000`; `server.fs.allow` gibt die Projektwurzel frei
   (`styles.css`, Schriften, `data/*-recipe.json`).
3. **Das Bundle ist ein Build-Ergebnis, nicht im Repo.**
   `npm run config:build` baut nach `config/theme-configurator/` (Vite-`base`
   `/config/theme-configurator/`) und erzeugt `config/theme-config.html` aus
   `config/theme-config.vorlage.html` (Plugin `sync-theme-config-html`);
   beides steht in `.gitignore`.
4. **CI baut und prüft jeden Stand** (`theme-configurator.yml`): Token-Drift,
   Vitest, Build, Einstieg (`pruefe-konfig-einstieg.cjs`), Bundle-Budget
   (`bundle-budget.json`), E2E (Playwright) gegen das gebaute Bundle. Das
   Bundle wird als Artefakt `theme-configurator-<sha>` (30 Tage) abgelegt.
5. **Release per Tag** `konfigurator-v<Version>` (`release-konfigurator.yml`):
   Tag muss der `version` in `apps/theme-configurator/package.json` gleichen,
   gleiche Prüfungen, danach GitHub-Release mit
   `theme-configurator-<Version>.zip` (`theme-config.html` +
   `theme-configurator/`). **Dieses ZIP ist das Übergabepaket** an die
   Drupal-Entwicklung.
6. **Integration in Drupal (Vorschlag):** Ein Drupal-Modul (Config Tools)
   liefert die Dateien aus dem Release als Library aus, rendert eine
   Admin-Route mit `<div id="app"></div>` und setzt **vor** dem App-Skript
   `window.NEO_KONFIGURATOR = { speicher: 'drupal', basisUrl, csrfToken,
   rechte }` (aus `drupalSettings`; eine Instanz je Kunde, daher kein
   `kunde` — ADR-002, angenommen 01.10.2026). Die App spricht dann nicht mehr
   den Docs-Server, sondern die REST-Schnittstelle aus
   `docs/api/theme-konfigurator.openapi.yaml` (Adapter `src/speicher/drupal.js`).

## Alternativen

| Alternative | Warum nicht |
| --- | --- |
| Bundle weiter im Repo | große Diffs bei jedem Build, Stand nicht nachvollziehbar, Konflikte zwischen Branches. |
| Docs-Server als Produktionsserver | schreibt ins Repository, keine Anmeldung/Rechte, kein Mehrbenutzerbetrieb – Aufgabe von Drupal (ADR-002). |
| npm-Paket statt ZIP | Drupal-Seite nutzt kein npm-Registry-Deployment; ZIP genügt für eine Library. Später möglich. |
| App als eigenständige Seite außerhalb Drupals (OAuth, CORS) | eigene Anmeldung und CORS nötig; verworfen in ADR-002 (Frage 1: eingebettet in eine Drupal-Seite). |

## Folgen

- Positiv: Jeder Stand ist reproduzierbar gebaut und geprüft; die Übergabe
  ist ein Release mit Versionsnummer. Die App zeigt App-Version, Commit und
  Build-Datum im Header (getrennt von der Theme-Version).
- Positiv: Der Docs-Server ist aus dem Netz nicht erreichbar.
- Negativ: Wer das Repo frisch klont, muss vor `npm run docs` einmal
  `npm run config:build` ausführen (503-Seite erklärt das).
- Negativ / offen für die Integration:
  - Vite-`base` ist fest `/config/theme-configurator/`; unter einem anderen
    Pfad in Drupal muss die `base` angepasst (Build-Variable) oder das Bundle
    genau dort ausgeliefert werden.
  - Der Einstieg lädt Google Fonts (Manrope, Space Grotesk, DM Mono) von
    `fonts.googleapis.com`; das gebaute CSS bringt zusätzlich eigene
    `woff2`-Dateien mit. Datenschutz/CSP in Drupal klären.
  - Styleguide-Abgleich (`styleguide-sync.js`) und Drupal-Cache-Clear gibt
    es nur mit dem Docs-Server; im Drupal-Betrieb entfallen sie oder brauchen
    eine eigene Lösung.
  - Der Cache-Clear im Docs-Server ist auf macOS/Homebrew (`/opt/homebrew/bin/ddev`)
    und `../DRUPAL11` verdrahtet.
