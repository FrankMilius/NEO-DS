# Übergabe: Theme-Konfigurator in Drupal 11 (neo Workplace, Config Tools)

- **Stand:** 01.10.2026 · Vertrag **1.0.0** · App `1.0.0-rc.1`
- **Von:** Frank Milius (Design System) · **An:** Drupal-Entwicklung
- **Ziel:** Mehrbenutzer-Betrieb des Theme-Konfigurators als eigenes Modul in
  den Config Tools. Die App (Vue) ist fertig und gegen eine Attrappe des
  Servers getestet; zu bauen ist das Drupal-Modul.

## 1. Was ist entschieden

ADR-002 ist angenommen (01.10.2026). Kurzfassung der Beschlüsse:

| Thema | Beschluss |
| --- | --- |
| A Entität | Config Entity, **keine Revisionen** |
| B Schnittstelle | eigenes Modul, REST nach OpenAPI 1.0.0 |
| C Speicherformat | nur **Abweichungen** vom NEO-Standard (`{"$entfernt": true}` für entfernte Schlüssel) |
| F1 Einbettung | in Drupal eingebettet, Sitzung + CSRF-Token |
| F2 Rechte | `ansehen`, `bearbeiten`, `veroeffentlichen` – kein Recht zum Übergehen des Kontrasts |
| F3 Mandanten | eine Instanz je Kunde; mehrere Themes, **genau eines aktiv** |
| F4 Freigabe | kein Vier-Augen-Prinzip |
| F5 Kontrast | Prüfung in App **und** verbindlich auf dem Server (422) |
| F6 Auslieferung | Override der Theme-Library mit dem veröffentlichten CSS |
| F7 Konflikte | `ETag`/`If-Match`, 428 ohne, 412 bei veraltetem Stand |
| F8 Arbeitsstand | ungespeicherte Änderungen bleiben im Browser |
| F9 Standard | NEO-Standard als Datei aus dem DS; ein neuer Standard wirkt automatisch |
| F10 Validierung | JSON-Schema `ThemeAbweichungen` + 1 MB (413) |
| E | Branches/Releases im Drupal-Betrieb ausgeblendet |
| G | Kontrast-Befund im DS behoben (siehe 5.) |

Ausführlich mit allen Optionen: `docs/adr/ADR-002-speichern-in-drupal.md`.

## 2. Inhalt des Pakets

| Datei | Wofür |
| --- | --- |
| `docs/adr/ADR-002-speichern-in-drupal.md` | Entscheidungen, Folgen, offene Anforderungen |
| `docs/adr/ADR-004-server-und-auslieferung.md` | Bundle, Release-ZIP, Einbindung als Library |
| `docs/api/theme-konfigurator.openapi.yaml` | **Vertrag 1.0.0** – Endpunkte, Schemas, Fehlercodes |
| `scripts/drupal-attrappe.mjs` | lauffähige Referenz des Servers (Node, ohne Abhängigkeiten) |
| `data/pruefvektoren/speicher-vertrag.json` | **Prüffälle für PHP** (Hash, ETag, Abweichungen, Zusammenführen, Kontrast, Schema) |
| `data/kontrast-paare.json` | Paarliste des Kontrast-Tors (App, Werkzeug und Server lesen dieselbe Datei) |
| `data/neo-theme-defaults/neo-theme-defaults.json` | NEO-Standard (`GET /neo-standard`) |
| `apps/theme-configurator/src/speicher/` | Referenz-Logik: `inhalts-hash.js`, `abweichungen.js`, `kontrast.js`, `standard.js`, Adapter `drupal.js` |
| `scripts/pruefe-kunden-themes.mjs` | Prüfwerkzeug vor dem Ausrollen eines neuen Standards |
| Release `konfigurator-v<Version>` | gebautes Bundle `theme-configurator-<Version>.zip` |

## 3. Einbindung der App

1. Bundle aus dem GitHub-Release `konfigurator-v<Version>` (Inhalt:
   `theme-config.html`, `theme-configurator/`) als Library des Moduls
   ausliefern. Vite-`base` ist `/config/theme-configurator/` – bei anderem
   Pfad bitte melden, dann bauen wir mit passender `base`.
2. Admin-Route mit `<div id="app"></div>`; **vor** dem App-Skript setzen:

   ```js
   window.NEO_KONFIGURATOR = {
     speicher: 'drupal',
     basisUrl: '/api/neo-theme-konfigurator/v1',
     csrfToken: '…',            // oder csrfTokenUrl: '/session/token'
     rechte: ['ansehen', 'bearbeiten', 'veroeffentlichen'] // aus den Permissions
   }
   ```

   Werte aus `drupalSettings`. Ohne `rechte` hat die App nur `ansehen`.
3. Die App ruft nur die Endpunkte aus der OpenAPI auf:
   `GET /neo-standard`, `GET|POST /themes`, `GET|PUT|DELETE /themes/{id}`,
   `POST /themes/{id}/aktivieren`, `POST /themes/{id}/veroeffentlichen`,
   `GET /themes/{id}/export?format=css|abweichungen`.

## 4. Lokal ausprobieren (ohne Drupal)

Im Projektordner `WEBSITE26` (Wurzel):

```bash
npm ci && npm run build:css
cd apps/theme-configurator && npm ci && cd ../..
npm run config:build          # Bundle bauen
npm run drupal:attrappe       # http://127.0.0.1:3200/
```

Die Startseite der Attrappe verlinkt den Konfigurator mit allen Rechten, ohne
„veröffentlichen“ und „nur ansehen“. Die Attrappe prüft wie der Vertrag
(428/412, 409, 422 Schema und Kontrast, 413, 403 Recht/CSRF). Optionen und
Kopfzeile `X-Neo-Rechte`: `apps/theme-configurator/README.md`, Abschnitt
„Drupal-Betrieb lokal ausprobieren“.

## 5. Serverlogik in PHP – Maßstab sind die Prüffälle

`data/pruefvektoren/speicher-vertrag.json` enthält für jede Funktion Eingabe
und erwartetes Ergebnis der App. Vorschlag: ein PHPUnit-DataProvider je
Abschnitt (`hash`, `etag`, `abweichungen.faelle`, `zusammenfuehrenMitStandard`,
`kontrast`, `schema`). Jeder Fall muss bestehen.

Fallstricke (stehen auch in `_meta.hinweisePhp`):

- JSON **als Objekte** dekodieren (`json_decode($s, false)`), sonst wird `{}`
  zu `[]` und Hash/Abweichungen stimmen nicht.
- Kanonisches JSON: Schlüssel rekursiv per `strcmp` sortiert, Listen
  unverändert, `JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES`, Zahlen wie
  JavaScript (`1` statt `1.0`).
- ETag = `"` + hex(SHA-256(kanonisch `{meta:{name,version}, abweichungen}`)) + `"`.
- Kontrast **ungerundet** mit „mindestens“ vergleichen; der Fall
  „4,4995 zeigt 4.5, fällt aber durch“ prüft genau das. Bewertbar sind
  `#rrggbb` und `#rgb`; alles andere ist nicht bestanden.
- Schema: verbindlich ist nur `gueltig`; die Fehlertexte sind Beispiele.

Die App prüft dieselbe Datei (`tests/speicher/pruefvektoren.test.js`); CI
meldet, wenn sie veraltet (`npm run drupal:pruefvektoren:check`). Ändert sich
die Referenz, entsteht eine neue Datei – die PHP-Tests zeigen dann sofort,
was nachzuziehen ist.

## 6. Offene Umsetzungsanforderungen (Empfehlung, Abnahme durch Frank + Team)

| # | Anforderung | Empfehlung | Abnahmekriterium |
| --- | --- | --- | --- |
| 1 | Deployment darf Themes nicht überschreiben (`drush cim`) | `config_ignore` für `neo_theme_konfigurator.theme.*`, nicht exportieren | Test: Theme ändern → `drush cex/cim` → Änderung bleibt |
| 2 | Auslieferung des veröffentlichten CSS | Datei unter `public://neo-theme/theme-<hash>.css`, `hook_library_info_alter` mit Version = Hash, lädt **nach** `styles.css`; Caches leeren | Nach Veröffentlichen + Aktivieren sieht ein anonymer Besucher die neue Farbe ohne manuelles `drush cr` |
| 3 | Serverlogik in PHP | eigene PHP-Umsetzung + gemeinsame Prüffälle (5.) | alle Fälle aus `speicher-vertrag.json` grün in CI |
| 4 | Rechte | zwei Rollen: „Theme bearbeiten“ (`ansehen`+`bearbeiten`), „Theme veröffentlichen“ (+`veroeffentlichen`); Server erzwingt 403 | Aufruf ohne Recht → 403, auch am UI vorbei |
| 5 | Neuer NEO-Standard | vor dem Ausrollen je Instanz prüfen (Drush-Befehl, der `export?format=abweichungen` + `pruefe-kunden-themes.mjs` ausführt); bis dahin manuell | Exit-Code ≠ 0 stoppt das Ausrollen |

Begründungen, Vor- und Nachteile: ADR-002, Abschnitt „Folgen“.

## 7. Änderung im Design System, die Drupal betrifft

- **Kontrast-Korrektur (Beschluss G, 01.10.2026):** Schrift auf den
  Statusflächen Erfolg, Warnung, Fehler, Info ist dunkel (`#000000`,
  6,26–9,11:1) statt weiß. Status-Buttons (Erfolg, Info, Fehler) folgen den
  `on-*`-Rollen und **hellen bei Hover/Aktiv auf** statt abzudunkeln.
- **To-do Drupal:** die Kopie von `styles.css` in `DRUPAL11 … neo_fe/css/styles.css`
  durch den aktuellen Build ersetzen (`npm run build:css` in `WEBSITE26`).
  Sichtprüfung: Banner, Badges, Status-Buttons.
- Figma-Bibliothek: Variablen „Auf Farbe/danger|info|success|warning“ sind
  in allen Modi schwarz.

## 8. Tests

- App: `cd apps/theme-configurator && npx vitest run` (Speicher, Adapter,
  Attrappe, Prüffälle).
- E2E gegen die Attrappe: `npx playwright test --project=drupal`
  (Konfliktdialog in zweiter Sitzung, Rechte, Kontrast-Tor, Veröffentlichen).
- **Gegen ein echtes Drupal:** Das Projekt `drupal` startet heute immer die
  Attrappe. Sobald ein Test-Drupal steht, stellen wir eine Variable
  (`E2E_DRUPAL_URL`) bereit, die stattdessen die echte Instanz anspricht.
  Gleicher Testlauf = Abnahme der Schnittstelle.

## 9. Ansprechpartner und Ablauf

1. Kick-off: dieses Paket, Fragen sammeln.
2. Entwicklung gegen OpenAPI + Prüffälle; die Attrappe dient als Vergleich.
3. Test-Drupal bereitstellen → E2E gegen die echte Instanz.
4. Release `konfigurator-v1.0.0` (App) + Modul-Release gemeinsam.

Rückfragen: Frank Milius.
