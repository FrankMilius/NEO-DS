# ADR-002: Theme-Konfigurator speichert in Drupal

- **Status:** vorgeschlagen — Gespraechsgrundlage fuer die Abstimmung mit den Entwicklern
- **Datum:** 30.09.2026
- **Entscheider:** Frank Milius (Zielbild), Drupal-Entwicklung (Schnittstelle)
- **Plan:** v2, Schritt 2.6 „Speichern"
- **Begleitdateien:** `docs/api/theme-konfigurator.openapi.yaml` (API-Entwurf),
  `apps/theme-configurator/src/speicher/` (App-Vorbereitung)

## Kontext

**Zielbild (Entscheidung 30.09.2026):** Der Theme-Konfigurator wird Teil der
Config Tools der neo Workplace Plattform (Drupal 11). Administratorinnen und
Administratoren passen damit das NEO-Standard-Theme an das Corporate Design
eines Kunden an. Mehrere Personen arbeiten mit der App. Festgelegt sind:
Speichern **pro Kunde in Drupal**, **Drupal-Revisionen** statt eigener
Versionierung, **Rollen/Rechte**, **Kontrast-Pruefung als Tor** vor dem
Veroeffentlichen. Offen ist die konkrete Schnittstelle.

### Bestandsaufnahme: was die App heute speichert (30.09.2026)

Alles liegt im Browser der einzelnen Person. Es gibt weder Anmeldung noch
Mehrbenutzerbetrieb noch Konflikterkennung.

| Was | Wo | Format |
| --- | --- | --- |
| Arbeitsstand (Auto-Save bei jeder Aenderung) | `localStorage['neo-theme-configurator']` | alle `THEME_DATA_KEYS` fuer **beide** Sets (`neo`, `customer`) + `activeThemeSet`, `previewMode`, `currentThemeMeta`, `activeSection` |
| Benannte Themes (Schnappschuss) | `localStorage['neo-theme-{id}']` | `snapshotThemeData({ withActiveSet })` + `meta` `{ id, name, version, createdAt, updatedAt }`; Auto-Save 500 ms entprellt |
| Katalog der benannten Themes | `localStorage['neo-theme-configurator-saved-themes']` | Liste der `meta` |
| Branches (git-artig) | `localStorage['neo-theme-branches']` | `{ branches: { [id]: … }, activeBranchId }` (eigener Store `stores/branches.js`) |
| Releases (unveraenderliche Schnappschuesse) | `localStorage['neo-theme-releases']` | Liste |
| Alt-Schriften (Migration) | `neo-cfg-custom-fonts[-{id}]` | wird beim Laden in den Store uebernommen und geloescht |
| „Speichern" (Strg+S) | `POST /api/save-theme` (lokaler Docs-Server `scripts/docs-server.js`) | nur aktives Set: `meta, theme, primitives, semantic{set-light,set-dark}, components, foundation, typeScale` → `website/data/custom-theme.json` |
| NEO-Standard (Werkseinstellung) | `GET /api/neo-theme-defaults` | `data/neo-theme-defaults/neo-theme-defaults.json`; Rueckfall `tokens.js` |
| Export/Import | Datei-Download / Upload | `exportAsJSON()` (nur aktives Set, **ohne** eigene Tokens, Schriften, Icons), CSS-Variablen, DTCG, Drupal-Bundle |

`THEME_DATA_KEYS` (`stores/theme/verlauf.js`) sind das eine Schema fuer alle
Theme-Inhalte (25 Schluessel: `themes`, `foundationOverrides`,
`componentOverrides`, `primitiveOverrides`, `customFonts`, `focusRingMode`,
`componentLocks`, `componentVersions`, `variantDefinitions`, zehn
`custom*Tokens`, `iconLibraries`, `iconStrokeWidths`, `iconStrokeColors`,
`semanticSpacing`, `semanticTypography`, `typeScale`).

Branches und Releases der App sind eine eigene, lokale Versionierung. Mit
Drupal-Revisionen werden sie fuer den Drupal-Betrieb ueberfluessig (siehe Folgen).

## Entscheidungsoptionen

### A. Entitaetstyp in Drupal

| | A1 Config Entity `neo_theme` je Kunde | A2 Content Entity `neo_theme`, revisionierbar |
| --- | --- | --- |
| Revisionen | keine (nur ueber Config-Export/Git) | Drupal-Revisionen eingebaut, inkl. Autor, Zeit, Protokoll, „Revert" |
| Veroeffentlichen | eigener Mechanismus | `EntityPublishedInterface` oder Content Moderation (Entwurf → Freigabe → veroeffentlicht) |
| Mehrere Admins | letzte Schreibaktion gewinnt | `changed`-Pruefung vorhanden, ETag/If-Match leicht ergaenzbar |
| Deployment | per Config-Sync zwischen Umgebungen | Inhalt, wandert nicht mit Config-Sync |
| Rechte | eine Admin-Permission | Entity Access + eigene Permissions je Operation |

### B. Schnittstelle

| | B1 JSON:API (Core) | B2 eigener REST-Controller (kleines Modul) |
| --- | --- | --- |
| Aufwand | gering fuer CRUD | mittel |
| Revisionen lesen | nur eingeschraenkt (`resourceVersion`), Wiederherstellen fehlt | frei |
| Aktionen (Veroeffentlichen mit Tor, Export) | nicht vorgesehen | frei |
| Optimistische Sperre (If-Match/412) | nicht eingebaut | frei |
| Nutzlast | JSON:API-Umschlag (`data.attributes`) | schlankes Theme-Dokument |

### C. Speicherformat

| | C1 App-Schnappschuss (`THEME_DATA_KEYS`) | C2 Theme-JSON (`exportAsJSON`, nur Abweichungen) | C3 vollstaendiges DTCG |
| --- | --- | --- | --- |
| verlustfrei fuer die App | ja | nein (eigene Tokens, Schriften, Icons fehlen) | nein (Sperren, Versionen, Varianten fehlen) |
| Umrechnung | keine | Import-Pfad vorhanden | Exporter vorhanden, kein Import |
| lesbar fuer Drupal/Frontend | JSON-Wert, per Schema pruefbar | ja | ja, Standard |
| Groesse | mittel | klein | gross |

## Empfehlung

1. **A2 — Content Entity `neo_theme`, revisionierbar**, ein Eintrag je Kunde
   und Theme. Nur A2 erfuellt „Drupal-Revisionen statt eigener
   Versionierung" ohne Zusatzbau. Das veroeffentlichte Ergebnis (CSS-Datei)
   kann zusaetzlich als Config oder Datei abgelegt werden, wenn es mit
   Config-Sync wandern soll.
2. **B2 — schlanker eigener REST-Controller** nach dem Entwurf in
   `docs/api/theme-konfigurator.openapi.yaml`. Gruende: Veroeffentlichen mit
   Kontrast-Tor, Revision wiederherstellen, Export und If-Match/412 sind
   Aktionen, die JSON:API nicht abbildet; der Controller bleibt duenn
   (Entity API + Access-Pruefung), die Logik liegt in Drupal-Services.
3. **C1 — App-Schnappschuss als JSON-Feld speichern**, per JSON-Schema aus
   der OpenAPI-Datei (`ThemeDaten`) geprueft. Verlustfrei, keine
   Umrechnung, die App laedt genau das, was sie gespeichert hat. C2 und C3
   bleiben **Exportformate** (`GET …/export?format=json|dtcg|css`).
4. **Optimistische Sperre:** ETag = Revisions-ID; PUT, DELETE,
   Wiederherstellen und Veroeffentlichen verlangen `If-Match`; 412 bei
   veraltetem Stand, 428 ohne `If-Match`, 409 bei Zustandskonflikten.
   Die App loest Konflikte nicht selbst, sie laedt neu und laesst die
   Person entscheiden.
5. **Kontrast-Tor:** Die App prueft vor dem Veroeffentlichen
   (`src/speicher/kontrast.js`, WCAG 2.1 AA, feste Paarliste) und schickt
   das Ergebnis mit; der Server lehnt mit 422 ab, wenn es nicht bestanden
   ist.

## Folgen

- Positiv: Ein Stand je Kunde fuer alle Admins, nachvollziehbar (wer, wann,
  warum), ruecksetzbar; kein stilles Ueberschreiben bei parallelem Arbeiten.
- Positiv: Die App ist vorbereitet, ohne das heutige Verhalten zu aendern:
  `src/speicher/` mit Adapter `lokal` (Standard, localStorage + Docs-Server,
  unveraendert) und `drupal` (gegen den Entwurf). Umschalten per
  `window.NEO_KONFIGURATOR = { speicher: 'drupal', basisUrl, kunde,
  csrfToken }` im Einstieg oder `VITE_NEO_*`.
- Negativ: Branches/Releases der App und Drupal-Revisionen ueberschneiden
  sich. Vorschlag: im Drupal-Betrieb Branches/Releases ausblenden; lokal
  bleiben sie.
- Negativ: Das Frontend-Theme muss das Ergebnis einbinden (siehe offene
  Fragen) — neue Abhaengigkeit zwischen Config Tools und Theme.
- **Befund 30.09.2026:** Der NEO-Standard besteht das Kontrast-Tor selbst
  nicht: im hellen Modus `on-danger` auf `feedback-danger` und `on-success`
  auf `feedback-success` nur **3,35:1** (Text in Banner, Badge, Label).
  Bevor das Tor scharf geschaltet wird, muss das Design System diese Werte
  korrigieren — sonst kann kein vom Standard abgeleitetes Theme
  veroeffentlicht werden.

## Offene Fragen an die Entwickler

1. **Anmeldung/CSRF:** Laeuft die App in einer Drupal-Seite (Sitzungscookie
   + `X-CSRF-Token` von `/session/token`, Token per `drupalSettings`)? Oder
   eigenstaendig mit OAuth (`simple_oauth`)? CORS?
2. **Rollen/Rechte:** Welche Permissions? Vorschlag: `neo theme ansehen`,
   `neo theme bearbeiten`, `neo theme veroeffentlichen`,
   `neo theme kontrast uebergehen` (falls es das geben soll). Wer vergibt sie
   je Kunde?
3. **Mandant/Kunde:** Eine Drupal-Instanz je Kunde (dann entfaellt
   `{kunde}` im Pfad) oder mehrere Kunden in einer Instanz (Group, Domain
   Access …)? Mehrere Themes je Kunde oder genau eines?
4. **Revisionen/Freigabe:** Reicht „veroeffentlicht ja/nein" oder braucht es
   Content Moderation mit Freigabeschritt (Vier-Augen-Prinzip)?
   Aufbewahrung alter Revisionen?
5. **Kontrast-Tor:** Vertraut der Server dem Ergebnis der App, rechnet er
   selbst nach (PHP, gleiche Paarliste) oder beides? Darf jemand das Tor
   uebergehen, und wird das protokolliert?
6. **Konsum im Frontend-Theme:** Erzeugt der Server beim Veroeffentlichen
   eine CSS-Variablen-Datei (`public://neo-theme/{kunde}/theme.{hash}.css`,
   eingebunden per `hook_page_attachments`, Cache-Tags invalidieren)? Oder
   schickt die App das fertige CSS mit (Exporter existiert nur in JS)? Oder
   Libraries-Override im Theme?
7. **Konflikt zweier Admins:** Genuegt If-Match/412 mit „neu laden" oder
   wird ein Hinweis „X bearbeitet gerade" (Sperre mit Ablaufzeit,
   Content Lock) gewuenscht?
8. **Auto-Save:** Bleibt der Arbeitsstand wie heute nur im Browser (Vorschlag)
   oder sollen Entwuerfe automatisch als Revision gespeichert werden
   (Revisionsflut)?
9. **NEO-Standard:** Woher liest Drupal ihn — mit dem Design System als
   Datei ausgeliefert (`data/neo-theme-defaults/`) oder als eigener Eintrag?
   Wie wird ein neuer Standard auf bestehende Kunden-Themes angewendet?
10. **Validierung:** JSON-Schema aus der OpenAPI-Datei serverseitig pruefen
    (z. B. `justinrainbow/json-schema`)? Groessenlimit?
