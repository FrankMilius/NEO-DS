# ADR-002: Theme-Konfigurator speichert in Drupal

- **Status:** angenommen (01.10.2026)
- **Datum:** 30.09.2026 (Vorschlag), 01.10.2026 (Entscheidung)
- **Entscheider:** Frank Milius (Zielbild), Drupal-Entwicklung (Schnittstelle)
- **Bezug:** Mail „Entscheidungen“ vom 01.10.2026 (Abstimmung mit dem Entwicklerteam, 17 Beschlüsse)
- **Plan:** v2, Schritt 2.6 „Speichern in Drupal“
- **Begleitdateien:** `docs/api/theme-konfigurator.openapi.yaml` (Vertrag 1.0.0),
  `apps/theme-configurator/src/speicher/` (App-Seite),
  `data/kontrast-paare.json` (Paarliste für App und Server),
  `scripts/pruefe-kunden-themes.mjs` (Prüfwerkzeug vor dem Ausrollen eines neuen Standards)

## Kontext

**Zielbild (30.09.2026):** Der Theme-Konfigurator wird Teil der Config Tools
der neo Workplace Plattform (Drupal 11). Administratorinnen und
Administratoren passen damit das NEO-Standard-Theme an das Corporate Design
eines Kunden an. Mehrere Personen arbeiten mit der App. Festgelegt waren:
Speichern in Drupal, Rollen/Rechte, Kontrast-Prüfung als Tor vor dem
Veröffentlichen. Offen war die konkrete Schnittstelle.

### Bestandsaufnahme: was die App heute speichert (30.09.2026)

Alles liegt im Browser der einzelnen Person. Es gibt weder Anmeldung noch
Mehrbenutzerbetrieb noch Konflikterkennung.

| Was | Wo | Format |
| --- | --- | --- |
| Arbeitsstand (Auto-Save bei jeder Änderung) | `localStorage['neo-theme-configurator']` | alle `THEME_DATA_KEYS` für **beide** Sets (`neo`, `customer`) + `activeThemeSet`, `previewMode`, `currentThemeMeta`, `activeSection` |
| Benannte Themes (Schnappschuss) | `localStorage['neo-theme-{id}']` | `snapshotThemeData({ withActiveSet })` + `meta` `{ id, name, version, createdAt, updatedAt }` |
| Katalog der benannten Themes | `localStorage['neo-theme-configurator-saved-themes']` | Liste der `meta` |
| Branches (git-artig) | `localStorage['neo-theme-branches']` | eigener Store `stores/branches.js` |
| Releases (unveränderliche Schnappschüsse) | `localStorage['neo-theme-releases']` | Liste |
| „Speichern“ (Strg+S) | `POST /api/save-theme` (lokaler Docs-Server) | nur aktives Set → `website/data/custom-theme.json` |
| NEO-Standard (Werkseinstellung) | `GET /api/neo-theme-defaults` | `data/neo-theme-defaults/neo-theme-defaults.json`; Rückfall `tokens.js` |
| Export/Import | Datei | `exportAsJSON()`, CSS-Variablen, DTCG, Drupal-Bundle |

`THEME_DATA_KEYS` (seit 2.6 in `stores/theme/theme-schluessel.js`) sind das
eine Schema für alle Theme-Inhalte (25 Schlüssel).

## Entscheidungsoptionen (Stand 30.09.2026)

### A. Entitätstyp in Drupal

| | A1 Config Entity `neo_theme` | A2 Content Entity `neo_theme`, revisionierbar |
| --- | --- | --- |
| Revisionen | keine (nur über Config-Export/Git) | eingebaut, inkl. Autor, Zeit, „Revert“ |
| Veröffentlichen | eigener Mechanismus | `EntityPublishedInterface` oder Content Moderation |
| Mehrere Admins | eigene Konflikterkennung nötig | `changed`-Prüfung vorhanden |
| Deployment | wandert mit Config-Sync | Inhalt, wandert nicht mit |
| Rechte | eigene Permissions | Entity Access + Permissions |

### B. Schnittstelle

| | B1 JSON:API (Core) | B2 eigener REST-Controller (kleines Modul) |
| --- | --- | --- |
| Aufwand | gering für CRUD | mittel |
| Aktionen (Veröffentlichen mit Tor, Aktivieren, Export) | nicht vorgesehen | frei |
| Optimistische Sperre (If-Match/412) | nicht eingebaut | frei |
| Nutzlast | JSON:API-Umschlag | schlankes Theme-Dokument |

### C. Speicherformat

| | C1 App-Stand (`THEME_DATA_KEYS`) | C2 Theme-JSON (`exportAsJSON`) | C3 vollständiges DTCG |
| --- | --- | --- | --- |
| verlustfrei für die App | ja | nein | nein |
| Umrechnung | keine | Import-Pfad vorhanden | kein Import |
| per Schema prüfbar | ja | ja | ja |

## Entscheidung (01.10.2026)

Abgestimmt mit dem Entwicklerteam; verbindlich.

| Nr. | Thema | Beschluss |
| --- | --- | --- |
| A | Entitätstyp | **Config Entity** (nicht Content Entity) — **keine Drupal-Revisionen** |
| B | Schnittstelle | eigenes schlankes Drupal-Modul mit **REST-Controller** (nicht JSON:API) |
| C | Speicherformat | **kompletter App-Stand** (`THEME_DATA_KEYS`), per JSON-Schema geprüft — gespeichert als Abweichungen vom NEO-Standard (siehe Folge 3) |
| E | Branches/Releases | im Drupal-Betrieb **ausblenden**; lokal bleiben sie |
| G | Kontrast-Befund | das Design System wird korrigiert, **dann** wird das Tor scharf (eigene Aufgabe) |
| 1 | Einbettung/Anmeldung | App eingebettet in eine Drupal-Seite; Sitzung + CSRF-Token (`window.NEO_KONFIGURATOR` aus `drupalSettings`) |
| 2 | Rechte | drei Rechte: **ansehen, bearbeiten, veröffentlichen**; kein Recht zum Übergehen des Kontrast-Tors |
| 3a | Mandanten | eine Drupal-Instanz je Kunde → **kein `{kunde}` im Pfad** |
| 3b | Themes je Kunde | mehrere Themes, **genau eines aktiv** |
| 4 | Freigabe | keine Vier-Augen-Freigabe; **veröffentlicht ja/nein** |
| 5 | Kontrast | App zeigt sofort, **Server prüft verbindlich** (gleiche Paarliste) |
| 6 | Auslieferung | über einen **Override in der Theme-Library** des Frontend-Themes |
| 7 | Konflikte | Konflikterkennung beim Speichern (**If-Match/412**, „neu laden und entscheiden“), **keine Sperre** |
| 8 | Arbeitsstand | bleibt im Browser; **Speichern (Strg+S) schreibt in Drupal** |
| 9a | NEO-Standard | als **Datei mit dem DS** ausgeliefert (`data/neo-theme-defaults/neo-theme-defaults.json`) |
| 9b | neuer Standard | wird **automatisch** übernommen |
| 10 | Validierung | Server prüft gegen **JSON-Schema** + **Größenlimit 1 MB** |

### Verworfene Empfehlungen aus dem Vorschlag vom 30.09.2026

- **A2 Content Entity mit Revisionen — verworfen.** Das Team bevorzugt eine
  Config Entity: kleiner, ohne Revisionstabellen, passt zu „Konfiguration
  eines Kunden“. Versionsgeschichte im Server wird nicht gebraucht; lokal
  bleiben Branches/Releases.
- **ETag = Revisions-ID — verworfen** (es gibt keine Revisionen). Ersetzt
  durch den Inhalts-Hash (Folge 1).
- **Revisionen lesen / wiederherstellen (`…/revisionen…`) — verworfen**,
  Endpunkte und App-Funktionen sind entfernt.
- **Export `format=dtcg|json` im Server — verworfen.** DTCG und Theme-JSON
  erzeugt nur der JS-Exporter; die App exportiert sie weiter selbst. Der
  Server liefert `css` und `abweichungen`.
- **Recht „Kontrast übergehen“ (`uebergangen`) — verworfen** (Frage 2).
- **Pfadsegment `{kunde}` — verworfen** (Frage 3a).

Beibehalten wurden B2 (eigener REST-Controller), C1 (App-Stand, jetzt als
Abweichungen), If-Match/412/428 und das Kontrast-Tor.

## Folgen und Umgang mit den Wechselwirkungen

### 1. Config Entity ohne Revisionen

- **Kein Verlauf, kein Zurücksetzen in Drupal.** Die App bietet im
  Drupal-Betrieb kein „Revision wiederherstellen“ mehr (Store-Aktionen
  `ladeRevisionen`/`stelleRevisionWiederHer` entfernt). Undo/Redo der
  laufenden Sitzung bleibt; Branches/Releases bleiben lokal (Beschluss E;
  `speicher().faehigkeiten.branchesUndReleases` ist im Drupal-Betrieb
  `false` — das Ausblenden in der Oberfläche ist Teil 2).
- **Konfliktkennung = Inhalts-Hash.** `ETag = "<hex(SHA-256(kanonisches JSON))>"`
  über `{ meta: { name, version }, abweichungen }`. Kanonisch heißt:
  Objektschlüssel rekursiv sortiert, Listen in ihrer Reihenfolge, keine
  Leerzeichen, Unicode und `/` unmaskiert. Referenz und Prüfvektor:
  `src/speicher/inhalts-hash.js`, `tests/speicher/inhalts-hash.test.js`.
  PHP-Hinweis: JSON als Objekte dekodieren (nicht `assoc`), sonst wird aus
  `{}` ein `[]` und der Hash stimmt nicht.
- **Risiko Deployment:** `drush cim` überschreibt Config — damit würden
  Änderungen der Admins beim nächsten Deployment verloren gehen.
  **Annahme/Anforderung an die Entwicklung (offen):** Die Theme-Konfiguration
  (`neo_theme_konfigurator.theme.*` o. ä.) wird per `config_ignore` (oder
  gleichwertig, z. B. eigener Config-Storage) vom Import ausgenommen und
  nicht exportiert. **Offene Umsetzungsanforderung**, Abnahme durch das Team.

### 2. Auslieferung über die Theme-Library

- **Annahme:** Beim Veröffentlichen schickt die App das fertige CSS mit
  (vorhandener Exporter `exportAsCSSVars()`); der Server erzeugt kein CSS
  selbst. Er prüft vorher den Kontrast verbindlich (Folge 3, Frage 5).
- **Anforderung an die Entwicklung:** Der Server legt das CSS versioniert ab
  und, wenn das Theme aktiv ist (oder aktiviert wird), an den Pfad, den der
  Library-Override referenziert — z. B. `public://neo-theme/theme.css` oder
  ein vom Modul definierter Pfad — und leert die betroffenen Caches
  (Library-Discovery, Render-Cache, Aggregation). Die Antwort nennt Pfad,
  URL, Version und Hash der Datei. Wie der Override genau aussieht
  (`libraries-override` in der Theme-Info oder `hook_library_info_alter`,
  z. B. für `css/theme-overrides.css` in `neo_fe/global-styling`), entscheidet
  das Team.
- Aktivieren (`POST /themes/{id}/aktivieren`) nur für veröffentlichte Themes
  (sonst 409); genau eines ist aktiv.

### 3. Neuer NEO-Standard wird automatisch übernommen (9b)

- Kunden-Themes speichern nur **Abweichungen** vom NEO-Standard. Format C
  bleibt der App-Stand, aber reduziert: nur geänderte oder neue Werte,
  Listen als Ganzes, entfernte Schlüssel als `{ "$entfernt": true }`
  (Schema `ThemeAbweichungen`; Referenz `src/speicher/abweichungen.js`,
  Garantie `zusammenfuehren(standard, abweichungenBerechnen(x, standard)) == x`).
- Beim Laden führt die App die Abweichungen mit dem **aktuellen** Standard
  (`GET /neo-standard`) zusammen. Ein neuer Standard wirkt so überall, außer
  an Stellen, die ein Kunde bewusst geändert hat. Der Server führt für die
  Kontrastprüfung genauso zusammen.
- **Vor jedem Ausrollen eines neuen Standards** läuft die Kontrastprüfung
  über alle Kunden-Themes: Abweichungen je Instanz exportieren
  (`GET /themes/{id}/export?format=abweichungen`), dann
  `node scripts/pruefe-kunden-themes.mjs --standard <neuer Standard> <Ordner>`.
  Exit-Code ≠ 0 heißt: Befunde klären, bevor der Standard ausgerollt wird.
- Die Paarliste liegt als `data/kontrast-paare.json` vor; App, Prüfwerkzeug
  und Server lesen dieselbe Datei.

### Weitere Folgen

- Positiv: ein Stand je Theme für alle Admins, kein stilles Überschreiben;
  kleine, lesbare Datensätze; ein neuer Standard verteilt sich ohne Migration.
- Positiv: Der Adapter `lokal` und das heutige Verhalten bleiben; Umschalten
  per `window.NEO_KONFIGURATOR = { speicher: 'drupal', basisUrl, csrfToken,
  rechte }`. `darf(recht)` liest die Rechte (lokal: alle).
- Negativ: kein Zurücksetzen auf frühere Stände im Server; wer das braucht,
  exportiert vorher (`format=abweichungen`).
- Negativ: neue Abhängigkeit zwischen Config Tools und Frontend-Theme
  (Library-Override, Folge 2).
- **Befund 30.09.2026 (Beschluss G) — behoben am 01.10.2026:** Der
  NEO-Standard bestand das Tor selbst nicht (hell: `on-danger`/`on-success`
  auf `feedback-danger`/`feedback-success` 3,35:1, `on-warning` 2,31:1).
  Korrektur im Design System: Schrift auf allen vier Statusflächen ist dunkel
  (`#000000`, 6,26–9,11:1), in allen Theme-Klassen; die Status-Buttons
  (Erfolg, Info, Fehler) folgen den `on-*`-Rollen und hellen bei Hover/Aktiv
  auf statt abzudunkeln. Der NEO-Standard besteht das Tor.
- Bekannt, harmlos: Der Rückfall `getDefaultFoundation()` (ohne Server)
  legt leere Foundation-Kategorien (`elements`, `themes`) an, die
  Standard-Datei nicht. Ergebnis ist höchstens die Abweichung
  `{ elements: {}, themes: {} }`.

## Offene Umsetzungsanforderungen an die Entwicklung

1. `config_ignore` (o. ä.) für die Theme-Konfiguration (Folge 1).
2. Library-Override, Ablagepfad und Cache-Invalidierung (Folge 2).
3. Serverseitig: JSON-Schema `ThemeAbweichungen` + 1 MB (413), Zusammenführen
   und Kontrastprüfung in PHP nach `abweichungen.js` und
   `data/kontrast-paare.json`, Inhalts-Hash nach `inhalts-hash.js`.
4. Permissions für die drei Rechte und Übergabe an die App
   (`drupalSettings` → `window.NEO_KONFIGURATOR.rechte`).
