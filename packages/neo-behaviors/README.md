# neo-behaviors

Verhalten der NEO-Bauteile — eine Quelle für Drupal, Doku und Theme-Konfigurator
(ADR-005, Entscheidung 01.10.2026).

| Recipe | Verhalten | Ereignisse |
| --- | --- | --- |
| `tabs` | Klick, Pfeiltasten (vertikal: hoch/runter), Pos1, Ende, Enter/Leertaste; gesperrte Tabs übersprungen; `data-neo-tabs="manuell"` = nur Enter aktiviert | `tab-change` { value, previousValue } |
| `accordion` | `<details>` klappt nativ; Pfeiltasten, Pos1, Ende zwischen den Kopfzeilen; `data-neo-accordion="einzeln"` = nur eines offen | `accordion-toggle` { itemId, open } |
| `select` | natives Feld; `.is-open` am `.nc-select-wrapper` solange die Liste offen ist (Chevron dreht) | — |
| `search` | Fokus/Tippen öffnet, Tippen filtert und markiert, Leerhinweis, Pfeiltasten + Enter wählen, Escape/Verlassen schließt, Bereichs-Menü | `search-open` { open }, `search-select` { value } |
| `segmented-control` | Klick, Pfeiltasten, Pos1, Ende wählen ein Segment (Radio-Muster, roving tabindex); gesperrte übersprungen; gleitender Indikator (`setzeIndikator`, auch von der Arena-Vorlage genutzt) | `segment-change` { value, previousValue } |
| `toggle-group` | `single` (radiogroup): Klick/Pfeiltasten wählen, aria-checked; `multiple` (group): Klick/Enter/Leertaste schalten aria-pressed, Pfeiltasten bewegen nur den Fokus | `toggle-change` { value, selected, values } |
| `switch` | Button-Muster (`role="switch"`): Klick/Leertaste/Enter schalten aria-checked; Checkbox-Muster nativ | `switch-change` { checked } |
| `button` | nur Umschaltknöpfe (`.nc-button--toggle`, Entscheidung 06.10.2026): Klick, Enter, Leertaste (nativer Klick) schalten `aria-pressed`; gesperrte (`disabled`, `aria-disabled`) bleiben unverändert; alle anderen Buttons ohne JS | `button-toggle` { pressed, value } |
| `rating` | Klick wählt (nativ), färbt bis zum Wert (`__item--active`), Sentiment-Stufe, `__value`; Pfeiltasten ±1 (bis 0), Pos1, Ende; Reset-Knopf; Hover-Vorschau macht das CSS | `rating-change` { value, previousValue } |
| `input` | nur Löschknopf (`__clear`: leeren, `input` melden, Fokus zurück) und `data-empty`-Rückfall für Felder ohne placeholder — schwebendes Label ist reines CSS | `input-clear` { previousValue } |
| `multiselect` | Website (Formularfeld des Drupal-Theme): Knopf schaltet das Panel (`[hidden]` + inline `display: none`, weil `display: flex` des Panels sonst gewinnt; `aria-expanded`, `aria-controls`, `.is-open`), Enter/Leertaste/Pfeil runter öffnen mit Fokus auf die erste Checkbox, Pfeiltasten/Pos1/Ende in der Liste, Leertaste wählt (nativ), Escape schließt + Fokus zurück, Klick außen und Fokus aus dem Feld schließen; Zusammenfassung im Knopf (bis zwei Namen, sonst „n ausgewählt“, leer: Platzhalter). In Drupal nur per `nur` | `multiselect-change` { values } |
| `dropdown-menu` | Menu Button: Auslöser (Klick, Enter, Leertaste, Pfeil runter/hoch) öffnet, Pfeiltasten/Pos1/Ende im Menü, Escape/Tab/Klick außen schließen, Fokus zurück; Untermenü (Pfeil rechts/links, 300 ms Hover); menuitemradio/-checkbox | `dropdown-toggle` { open }, `dropdown-select` { value, checked } |
| `popover` | Klick schaltet, Fokus ins Panel, Fokus-Falle, Escape/Schließen-Knopf, Klick außen (nicht bei Formularen); `--hover-trigger`: 300 ms öffnen, 200 ms schließen, Fokus öffnet; `.is-open` an der Wurzel folgt dem Panel | `popover-toggle` { open, reason } |
| `tooltip` | Hover/Fokus macht das CSS; Escape blendet aus, bis Maus und Fokus weg sind (WCAG 1.4.13); ergänzt aria-describedby | `tooltip-dismiss` { reason } |
| `modal` | `<dialog>` per Knopf mit `aria-controls` öffnen (showModal), Escape, Schließen-Knopf, Fokus-Falle, Fokus zurück; Hintergrund nur mit `data-backdrop-close="true"`; `--scrollable`: `is-scrolled-top/-bottom` | `modal-open`, `modal-close` { reason } |
| `drawer` | wie Modal; Klick auf den Hintergrund schließt immer; `is-scrolled` am Drawer | `drawer-open`, `drawer-close` { reason } |
| `alert-dialog` | WAI-ARIA alertdialog: `<dialog>` per Knopf mit `aria-controls` öffnen, Fokus auf die markierte sichere Aktion (`[autofocus]`, sonst Abbrechen `[data-action="cancel"]`, sonst erstes Element), Fokus-Falle, Escape = Abbrechen, Hintergrund schließt nicht, Knöpfe mit `data-action` schließen, Fokus zurück; mit `data-close="manuell"` am `<dialog>` schließt Bestätigen nicht, sondern meldet nur (`open: true`) — das Programm schließt mit `dialog.close()` | `alert-dialog-open`, `alert-dialog-close` { reason, action, open } |
| `mobile-drawer` | Website (Drupal-Theme): Knopf mit `aria-controls="<id des Drawers>"` öffnet `.nc-mobile-drawer--open` + Backdrop `--visible` (+ `body.u-no-scroll`), Fokus in den Drawer, Fokus-Falle, Rest der Seite `inert`; Escape, Schließen-Knopf, Backdrop oder erneut der Knopf schließen, Fokus zurück; geschlossen `inert` + `aria-hidden`; ab 1200 px (DS blendet aus) ohne Verhalten. In Drupal nur per `nur` | `mobile-drawer-open`, `mobile-drawer-close` { reason } |
| `table-info-modal` | Website (Drupal-Theme): Info-Knopf mit `aria-controls="<id des Dialogs>"` öffnet `.is-open`, Text aus `data-info` des Knopfs als Absätze in `__body` (als Text), Fokus auf Schließen, Fokus-Falle, Rest `inert`; Escape, Schließen-Knopf, Backdrop schließen, Fokus zurück; geschlossen `inert` + `aria-hidden`; ohne Namen am Dialog `aria-label` des Knopfs. In Drupal nur per `nur` | `table-info-modal-open`, `table-info-modal-close` { reason } |
| `breadcrumb` | Ellipsis-Menü (Smart-Truncation): Klick, Enter, Leertaste, Pfeil runter/hoch öffnen; Pfeiltasten/Pos1/Ende im Menü; Escape/Tab/Klick außen schließen | `breadcrumb-toggle` { open } |
| `treeview` | WAI-ARIA Tree: Pfeil runter/hoch, rechts (auf / erstes Kind), links (zu / Eltern), Pos1, Ende; Enter/Leertaste/Klick wählen (single, `aria-selected` + `--selected`) bzw. haken an (multiple, `aria-checked` mit mixed-Eltern); Chevron klappt; roving tabindex auf dem `li[role=treeitem]`; Zeilen-Aktionen per Tab vom Eintrag, Escape zurück | `treeview-toggle` { value, expanded }, `treeview-select` { value, selected, values } |
| `navigation-menu` | WAI-ARIA Disclosure-Navigation (Recipe 3.0.0): Auslöser mit `aria-expanded`/`aria-controls`, Panel `[hidden]` im Item; Tab durch alle Einträge (kein roving tabindex), Enter/Leertaste/Klick schalten, Escape schließt (Fokus auf den Auslöser), optional Pfeil rechts/links/Pos1/Ende oben, Pfeil runter ins Panel, Pfeil runter/hoch/Pos1/Ende im Panel; Fokus verlässt das offene Item oder Klick außen schließen; höchstens ein Panel offen; `data-trigger="hover"` 150 ms | `navigation-menu-change` { value, previousValue } |
| `toolbar` | eine Tab-Station (roving tabindex über alle Knöpfe, Links und Felder, auch in eingebetteten Gruppen); Pfeil rechts/links (rundum), Pos1, Ende; in Eingabefeldern bleiben Pfeile/Pos1/Ende im Feld, Tab/Shift+Tab gehen vom Feld zum Nachbarn (am Rand raus); `nc-toolbar--sticky` bekommt `is-scrolled`, solange sie angeheftet ist (IntersectionObserver) | `toolbar-focus` { value, previousValue } |
| `sidebar` | Untermenü-Knopf (`aria-controls`) klappt per `[hidden]`; `__toggle` schaltet `--collapsed` (+ aria-label der Einträge); Mobil-Lage: Knopf mit `aria-controls` öffnet `--open` + Backdrop, Escape/Backdrop/Knopf schließen, Fokus zurück | `sidebar-submenu-toggle` { value, open }, `sidebar-collapse` { collapsed }, `sidebar-toggle` { open, reason } |
| `navigation-tab-mega` | Website-Hauptnavigation (Drupal `neo_nav`) auf fertigem Markup: Panels per Klick/Enter/Leertaste (nur eines, Fokus zurück), Mega-Tabs (Klick, Pfeil runter/hoch rundum), Such-Band (Fokus ins Feld, Löschen-Knopf), Sprach-/Erscheinungsbild-Menü (Pfeile, Auswahl), Sprache live über `data-neo-i18n`, Escape (Menü → Suche → Panel → Drawer), Klick außen, Drawer mit Push-Navigation (geschlossener Drawer und verschobene Bildschirme `inert`), aktueller Ast (`aria-current`), Auto-Hide beim Scrollen | `navigation-tab-mega-panel` { value, open }, `-tab` { value, previousValue }, `-search` { open }, `-menu` { value, open }, `-select` { menu, value }, `-language` { value }, `-drawer` { open, reason }, `-screen` { value }, `-hidden` { hidden } |
| `chapter-nav` | Website (Landing Pages): Scroll-Spy markiert per `aria-current` das LETZTE Kapitel über der Linie (max(`scroll-margin-top`, Kopfzeile `.site-header[data-neo-nav]` + Leiste) + 24 px), oben das erste; Klick/Enter markiert sofort (Spy ruht bis das Scrollen steht), springt mit Versatz (sanft, außer reduced motion), Anker per `pushState`, Fokus aufs Kapitel; markierter Verweis in der Leiste sichtbar. In Drupal nur per `nur` | `chapter-nav-change` { value, previousValue } |
| `expanding-panels` | Website: Single-Open per `aria-expanded` (beim Binden das erste offen, falls keines), Klick öffnet (offenes bleibt offen), Pfeil rechts/runter und links/hoch rundum mit Fokus, Pos1, Ende; gesperrte übersprungen; alle Panels in der Tab-Folge. In Drupal nur per `nur` | `expanding-panels-change` { index, previousIndex } |
| `feature-accordion` | Website: Klick/Enter/Leertaste auf einen Link markiert ihn (`.is-active` + `aria-current`), scrollt sein Kapitel an den Anfang der rechten Spalte (zweispaltig die Spalte, gestapelt die Seite; sanft außer reduced motion), Fokus aufs Kapitel; Scroll-Spy der Spalte markiert das letzte Kapitel über ihrem Anfang; Einträge nativ (`<details>`). In Drupal nur per `nur` | `feature-accordion-change` { index, previousIndex } |
| `toast` | Schließen-Knopf, Escape (Toast mit Fokus, sonst der neueste; nicht bei offenem modalem Dialog), Auto-Ausblenden nur mit `data-duration` (ms; leer/`auto` = Token; Fehler/Warnung bleiben stehen), mit Aktion mindestens 10 s, Pause bei Maus/Fokus/verborgener Seite mit Restzeit, Balken per Einzel-Eigenschaften der Animation, Wischen (Touch/Stift, Schwelle aus Token), Warteschlange im `.nc-toaster` (`--nc-toast-max-visible`), `.is-entering`/`.is-leaving`; danach aus dem DOM, Fokus weiter | `toast-dismiss` { reason }, `toast-action` { action } |
| `notification` | Schließen-Knopf (nicht `--permanent`): `.is-dismissing` mit `--_notification-height`, danach aus dem DOM, Fokus weiter; Klick/Aktion in einer ungelesenen nimmt `--unread`, den Punkt und „Ungelesen:" aus `aria-label` | `notification-dismiss` { reason }, `notification-read` |
| `alert` | Schließen-Knopf nimmt den Alert aus dem DOM (keine Animation im SCSS), Fokus weiter; Details nativ | `alert-dismiss` { reason } |
| `banner` | Schließen-Knopf: `.is-dismissing` mit `--_banner-height`, danach aus dem DOM, Fokus weiter; `data-banner-id` merkt das Schließen (localStorage `neo-banner:<id>`, dann `[hidden]`); `--fixed` gibt dem Elternelement oben Platz | `banner-dismiss` { reason, id } |
| `code-snippet` | Block-Snippets (nicht `--inline`): Kopieren-Knopf schreibt den Code in die Zwischenablage (Ersatzweg ohne Clipboard-API), Erfolg 2 s als `__copy--success` + aria-label „Kopiert!“; „Mehr anzeigen“ schaltet `--expanded`, aria-expanded und den Text; Knopf `[hidden]`, wenn der Code in die eingeklappte Höhe passt. Syntax-Hervorhebung bringt das Markup mit | `code-snippet-copy` { ok }, `code-snippet-toggle` { expanded } |
| `shell` | Drawer der Mobil-Lage (unter lg, Sidebar `position: fixed`): Knopf mit `aria-controls="<id der Sidebar>"` öffnet `--sidebar-{left,right}-drawer-open` + Overlay `--visible` (höchstens ein Drawer), Fokus in die Sidebar, Fokus-Falle, Rest der Seite `inert`; Escape, Overlay, Knopf oder Wechsel über lg schließen, Fokus zurück. Ab lg: kein Verhalten | `shell-drawer-toggle` { side, open, reason } |

```js
import { anbinden, abbinden } from 'neo-behaviors'

const aufraeumen = anbinden(document)       // oder ein Teilbereich, mehrfach harmlos
aufraeumen()                                // bzw. abbinden(bereich)
anbinden(bereich, ['tabs'])                 // nur bestimmte Bauteile
```

## Drupal: fertige Datei

`dist/neo-behaviors.js` ist die fertige Datei für die Drupal-Library (IIFE,
ohne Module, ES2019, nicht minifiziert — Drupal aggregiert selbst). Sie entsteht
mit `npm run behaviors:build` aus `drupal.js`; CI prüft mit
`npm run behaviors:check`, dass sie aktuell ist. Nicht von Hand ändern.

Die Datei stellt `window.NeoBehaviors` bereit (`anbinden`, `abbinden`,
`BEHAVIORS`, `MIT_VERHALTEN`, `version`) und meldet sich selbst als
`Drupal.behaviors.neoBehaviors` an (attach bindet im Kontext, detach beim
`unload` löst wieder). Kein eigener Glue-Code nötig.

Einbinden im Theme `neo_fe` (`neo_fe.libraries.yml`):

```yaml
neo-behaviors:
  version: 0.8.0
  js:
    js/neo-behaviors.js: { attributes: { defer: true } }
  dependencies:
    - core/drupal
    - core/drupalSettings
```

Aktivieren: `{{ attach_library('neo_fe/neo-behaviors') }}` in einem Template
oder als Abhängigkeit von `global-styling`. Steuern über `drupalSettings`:

```php
$build['#attached']['drupalSettings']['neoBehaviors'] = ['nur' => ['tabs', 'select']]; // nur diese
$build['#attached']['drupalSettings']['neoBehaviors'] = ['aus' => TRUE];              // nichts binden
```

Website-Bauteile (Entscheidung 06.10.2026): Behaviors mit
`nurAusdruecklich: true` (Liste `NUR_AUSDRUECKLICH`) bindet die Drupal-Datei
**nur**, wenn `drupalSettings.neoBehaviors.nur` sie nennt — ein Aufruf ohne
`nur` lässt sie aus. Es sind Bauteile, deren Verhalten heute noch
`neo-theme.js` liefert; so wird keines still auf der Website aktiv und
nichts doppelt gebunden. Umstellen je Bauteil: `nur[] = '<id>'` setzen und
die alte Funktion in `neo-theme.js` entfernen (siehe Abschnitt
„Website-Bauteile“). `anbinden()` aus dem Modul (Arena, Doku) bindet ohne
`nur` weiter alle.

Achtung beim Aktivieren: `neo-theme.js` hat eigene Behaviors (z. B.
`neoAccordion` für `[data-neo-accordion]`, Tab-Nav, Suche). Doppelt gebunden
wird nichts Schädliches, aber vor dem globalen Einschalten mit der
Drupal-Entwicklung festlegen, welche Bauteile das Paket übernimmt (`nur`).

Das Soll steht im Recipe (`keyboard`, `events`, State-Regeln). Die Tests in
`apps/theme-configurator/tests/behaviors/` binden an genau das Markup, das die
Arena aus dem Recipe baut, prüfen jede Taste aus `keyboard` und jedes Ereignis
gegen `events`. Die Overlays (Dropdown-Menü, Popover, Tooltip, Modal, Drawer,
Alert-Dialog) kommen seit Phase 3 ebenfalls aus Recipe-Vorlagen; ihre Tests
nutzen zusätzlich DS-Markup nach SCSS und Recipe, „Ausprobieren" gibt es für
alle sechs.
gegen `events`. Die Overlay-Tests nutzen DS-Markup nach SCSS und Recipe; die
Navigations-Tests (`navigation-behaviors.test.js`) binden an das Markup, das
die Arena im Modus „Ausprobieren" baut.

Bewusst ohne JS: das schwebende Label des Inputs (`:placeholder-shown`,
`:focus-within`), die Hover-Vorschau des Ratings und das Ein-/Ausblenden des
Tooltips (`:hover`, `:focus-within`) — das kann das CSS des DS allein.

## Navigation (Entscheidung 02.10.2026)

Die Navigations-Bauteile binden nur an Klassen und Attribute, die das SCSS
kennt; Zustände stehen in ARIA (`aria-expanded`, `aria-selected`,
`aria-current`, `tabindex`) bzw. dort, wo das SCSS sie liest.

- **Breadcrumb** — nur die gekürzte Fassung hat Verhalten: der Knopf
  `.nc-breadcrumb__ellipsis` klappt `.nc-breadcrumb__dropdown` auf
  (`.is-open` + `aria-expanded`, so liest es das SCSS). Das Menü muss im
  Markup stehen; das Behavior ist das einzige Verhalten dafür (das frühere
  `js/breadcrumb.js` der Doku baute ein zweites Menü und ist entfernt,
  Entscheidung 03.10.2026).
- **Treeview** — WAI-ARIA Tree. Fokus und roving tabindex liegen auf dem
  `li[role=treeitem]` (Entscheidung 03.10.2026; den Fokusring zeichnet das
  SCSS an der Zeile `.nc-treeview__node`), ebenso die Zustände:
  `aria-expanded`, `aria-selected` (+ `.nc-treeview__item--selected`, die
  Auswahl gestaltet das SCSS über die Klasse), im Checkbox-Modus
  `aria-checked` (true/false/mixed) samt `checked`/`indeterminate` der
  Checkbox. Älteres Markup mit `tabindex` an der Zeile wird beim Binden
  umgestellt; fehlt `aria-labelledby`, verweist das Behavior auf das Label.
  Zeilen-Aktionen (`.nc-treeview__action`): nur die Zeile mit dem Tab-Stopp
  hat sie im Tab-Fluss — Tab vom Eintrag in seine Aktionen, Escape zurück.
  Zugeklappte Kinder blendet das SCSS aus (auch für Tastatur/Screenreader).
  Ziehen & Ablegen ist nicht Teil des Behaviors.
- **Navigationsmenü** — WAI-ARIA Disclosure-Navigation (Entscheidung
  03.10.2026, Recipe 3.0.0; vorher Menubar): keine Menü-Rollen, kein roving
  tabindex. Das Panel liegt im Item direkt nach seinem Auslöser, offen =
  `aria-expanded="true"` + Panel ohne `[hidden]` — genau das liest das SCSS
  (kein Viewport, keine Kopie, kein `inert` mehr). Fehlen `id`/`aria-controls`,
  vergibt das Behavior sie. Die Pfeiltasten sind optional (APG erlaubt sie);
  Enter/Leertaste bleiben der native Klick des Knopfs. Fokus aus dem offenen
  Item (Tab weiter, anderer Eintrag) schließt; ein Mausdruck auf einen
  anderen Auslöser wechselt direkt (ein Ereignis). `data-motion` beim
  Wechsel, Indikator `data-state="visible"` mit `--_indicator-left/-width`.
  Das DS blendet das Menü unter 1200 px aus — die Mobil-Navigation ist ein
  anderes Bauteil. Das alte Markup aus Recipe 2.x (Menubar mit
  Viewport-Kopie) ist weder Vorlage des Behaviors noch wird es seit
  05.10.2026 vom SCSS gestaltet (Prototyp stillgelegt).
- **Toolbar** — eine Tab-Station: genau ein Bedienelement trägt
  `tabindex="0"`. Die Pfeiltasten laufen flach über alle Bedienelemente, auch
  über die Knöpfe eingebetteter Toggle-Groups und Segmented Controls (die
  Toolbar hört in der Capture-Phase und hält deren eigene Pfeiltasten an;
  Enter/Leertaste/Klick bleiben bei der Gruppe). In Eingabefeldern bleiben
  Pfeiltasten, Pos1 und Ende im Feld (Entscheidung 02.10.2026); Tab/Shift+Tab
  verlassen das Feld zum nächsten/vorherigen Bedienelement der Leiste, am
  Rand die Leiste. Das Markup darf ohne `tabindex` kommen — ohne JS bleibt so
  jeder Knopf erreichbar; beim Lösen stellt das Behavior die alten Werte
  wieder her. `.is-scrolled` der Sticky-Toolbar setzt es nicht.
- **Sidebar** — Untermenü über `[hidden]` am Container
  (`.nc-sidebar__submenu-items`), Einklappen über `.nc-sidebar--collapsed`,
  Mobil-Lage über `.nc-sidebar--open` und den Backdrop
  `.nc-sidebar-backdrop[hidden]` — genau die Zustände des SCSS. Der Backdrop
  wird als Geschwister der Sidebar gesucht; der öffnende Knopf ist ein
  beliebiger Knopf mit `aria-controls="<id der Sidebar>"`. In der
  Overlay-Lage mit Backdrop ist die offene Sidebar modal (Entscheidung
  03.10.2026): Fokus-Falle, Geschwister bis `<body>` (außer dem Backdrop)
  bekommen `inert` — beim Schließen und Abbinden entfernt das Behavior nur
  das eigene `inert`. Geschlossen hält das SCSS sie per `visibility` aus der
  Tab-Folge. Desktop-Lage: keine Falle.
- **Hauptnavigation V3 Tab-Mega** (Entscheidung 03.10.2026) — löst
  `neo_fe/js/neo-nav.js` ab. Das Twig rendert das komplette Markup (Panels,
  Tabs, Such-Band, Drawer-Bildschirme), das Behavior baut nichts. Teile
  werden über `aria-controls` gefunden (Panel, Such-Band, Menü, Drawer,
  Drawer-Unterseite), nicht über feste ids. Sprache live ohne Neuladen:
  jede übersetzbare Beschriftung trägt `data-neo-i18n='{"de":…,"en":…}'`
  (mit `data-neo-i18n-attr` für `aria-label`, `placeholder`, `data-text`);
  `lang` wechselt an Header und Drawer, nicht an `<html>`. Das
  Erscheinungsbild schaltet die Website selbst (Ereignis
  `navigation-tab-mega-select`). `data-neo-nav-autohide="aus"` schaltet das
  Auto-Hide ab (Arena), `data-neo-nav-pfad` ersetzt `location.pathname`.
  Drupal: `drupalSettings.neoBehaviors.nur[] = 'navigation-tab-mega'` am
  Block `neo_main_nav`.

- **Shell** (Entscheidung 06.10.2026, shell-verhalten) — nur der Drawer der
  Mobil-Lage. Zustände wie im SCSS (`08-templates/_shell.scss`):
  `.nc-shell--sidebar-left-drawer-open` / `--sidebar-right-drawer-open` und
  `.nc-shell__sidebar-overlay--visible`. Mobil-Lage heißt: die Sidebar ist
  `position: fixed` (unter lg; die Arena stellt sie im Rahmen
  `ra-fenster--mobil` dar). Der Auslöser ist ein beliebiger Knopf mit
  `aria-controls="<id der Sidebar>"` (üblich `[data-shell-toggle]` in der
  Navbar). Die offene Sidebar ist modal wie die Sidebar in der Overlay-Lage:
  Fokus-Falle, Geschwister bis `<body>` (außer dem Overlay) bekommen `inert`,
  beim Schließen und Abbinden nur das eigene zurück. Fehlt das Overlay im
  Markup, legt das Behavior es beim ersten Öffnen an. Ab lg tut der Knopf
  nichts (Einklappen auf dem Desktop gehört nicht dazu). Drupal bindet die
  Shell nicht ein (eigene Entscheidung): neo_fe setzt
  `drupalSettings.neoBehaviors.nur` (Hauptnavigation), `shell` steht nicht
  darin — ein Aufruf ohne `nur` würde sie mitbinden.

## Rückmeldungen (Plan v3, Phase 3, Block Rückmeldung)

Toast, Benachrichtigung, Alert und Banner binden an fertiges Markup und
verschwinden beim Schließen aus dem Dokument (gemeinsamer Teil in
`_meldung.js`): Klasse der Ausblend-Animation des DS setzen, auf
`animationend` warten (ohne Animation, z. B. bei `prefers-reduced-motion`,
sofort; mit Zeitlimit), dann entfernen. Lag der Fokus in der Meldung, geht er
zum nächsten Bedienelement danach, sonst davor (WCAG 2.4.3).

- **Toast** — Auto-Ausblenden ist Absicht des Programms: nur mit
  `data-duration`. Ohne Angabe bleibt der Toast, bis man ihn schließt
  (WCAG 2.2.1). Fehler und Warnung (`.nc-toast--error`, `.nc-toast--warning`)
  bleiben immer stehen: `data-duration` wird dort ignoriert, kein Timer, kein
  `timeout`; ein Balken ist dann `[hidden]` (Entscheidung 05.10.2026).
  Der Timer hält an, solange Maus oder Fokus im Toast sind oder
  die Seite verborgen ist, und läuft mit der Restzeit weiter; den Balken hält
  das CSS des DS (`:hover`/`:focus-within`) an — deshalb setzt das Behavior
  die Animation in Einzel-Eigenschaften, nicht als Kurzform `animation`
  (die als Inline-Stil `animation-play-state` überstimmt). Toasts mit Aktion
  laufen mindestens 10 s (Recipe: extended-timeout). Escape trifft den Toast
  mit dem Fokus, sonst den neuesten — nicht, solange ein `dialog[open]` da
  ist. Ein geschlossener Toast löst seine Dokument-Ereignisse selbst.
- **Banner** — das feste Banner (`--fixed`) gibt seinem Elternelement oben
  Platz (`padding-block-start: calc(<bisher> + <Höhe>)`, mit ResizeObserver);
  in Drupal steht das Banner zuerst im `<body>`.
- **Benachrichtigung** — „gelesen" speichert das Programm auf
  `notification-read` hin (localStorage oder API).

## Website-Bauteile (Entscheidung 06.10.2026)

Verhalten, das heute `neo_fe/js/neo-theme.js` liefert, steht jetzt auch hier
— 1:1 nach der Website, mit den Verbesserungen für Barrierefreiheit. Auf der
Website ändert sich nichts, bis Drupal die Bauteile per `nur` einbindet und
die alte Funktion entfernt (Freigabe).

- **Mobile-Drawer** und **Tabellen-Info-Modal** (overlay-verhalten) —
  Überlagerungen ohne natives `<dialog>`, gemeinsamer Teil `_ueberlagerung.js`
  (Muster aus `_dialog.js`/`shell.js`, Hilfen aus `kern.js`). Neu gegenüber
  der Website: Fokus-Falle, Rest der Seite `inert`, Fokus zurück auch nach
  Klick, geschlossen `inert` (vorher per Tab erreichbar, obwohl unsichtbar),
  `role="dialog"`/`aria-modal`. Der Info-Text kommt als Text aus `data-info`
  (die Website setzte HTML per `innerHTML`).
- **Multiselect** (multiselect-verhalten) — das Formularfeld aus `neoForm`
  (case `'multiselect'`). Drupal rendert Label, Knopf und Panel fertig
  (Panel `[hidden]`), das Behavior übernimmt Öffnen, Tastatur und
  Zusammenfassung. Pflichtfeld-Prüfung bleibt beim Formular. Neu: Pfeiltasten
  in der Liste, `aria-controls`, Schließen auch beim Verlassen per Tab aus
  der Liste (vorher nur beim Verlassen des Knopfs). Die Suchleiste
  (`searchbar`, „/“ öffnet) ist nicht umgesetzt: das Recipe kennt keine
  Taste „/“ (die Website nutzt Strg/⌘+K; der Shortcut-Hinweis ist laut
  Recipe nie sichtbar), und die Suche der Website liegt heute im Such-Band
  von `navigation-tab-mega`.
- **Kapitelnavigation** (website-verhalten a) — die Leiste
  `.nc-chapter-nav[data-neo-chapternav]` aus `node--landing-page--full`
  (Library `neo_fe/neo-chapter-nav`). Spy nach `neoRefpageToc` in
  `neo-theme.js` (letzter Abschnitt über der Linie, Kopfzeilenhöhe aus dem
  DOM statt aus dem Token). Neu: Fokus aufs angesprungene Kapitel, Spy ruht
  während des Sprungs, `prefers-reduced-motion`, Ereignis.
- **Expanding Panels** (website-verhalten b) — Single-Open wie
  `NeoExpandingPanels.render` in `neo-theme.js`, aber auf fertigem Markup
  (Drupal rendert die Knöpfe im Twig statt aus JSON). Neu: Pos1/Ende,
  gesperrte Panels, Ereignis.
- **Feature-Akkordeon** (website-verhalten c) — Kapitelwechsel über die
  Links links. `neo-theme.js` enthält dafür keine Funktion (und `neo_fe`
  kein Block-Template; das Markup stammt aus der Doku). Umgesetzt ist, was
  die Doku beschreibt: `.is-active` „wenn gescrollt oder ein Kapitel
  geklickt wird“. Zuordnung Link → Kapitel per `aria-controls`, sonst
  Reihenfolge.
- **FAQ** (website-verhalten d) — **kein eigenes Behavior**, `<details>`
  genügt. Begründung: `neo-theme.js` bindet am FAQ nichts (`neoAccordion`
  greift nur bei `[data-neo-accordion]` mit `.nc-accordion__item`), das
  heutige Website-Verhalten ist also das native — 1:1 heißt ohne Skript.
  Enter/Leertaste/Klick, die Ansage des Zustands und die Suche im Dokument
  liefert der Browser; „nur eine offen“ geht nativ über ein gemeinsames
  `name` an den `<details>`; Pfeiltasten sind im APG-Muster optional, Tab
  reicht für eine Liste unabhängiger Fragen. Wer Sprungziele, „Alle
  aufklappen“ oder Pfeiltasten braucht, nimmt das Akkordeon (`accordion`).
