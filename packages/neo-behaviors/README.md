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
| `rating` | Klick wählt (nativ), färbt bis zum Wert (`__item--active`), Sentiment-Stufe, `__value`; Pfeiltasten ±1 (bis 0), Pos1, Ende; Reset-Knopf; Hover-Vorschau macht das CSS | `rating-change` { value, previousValue } |
| `input` | nur Löschknopf (`__clear`: leeren, `input` melden, Fokus zurück) und `data-empty`-Rückfall für Felder ohne placeholder — schwebendes Label ist reines CSS | `input-clear` { previousValue } |
| `dropdown-menu` | Menu Button: Auslöser (Klick, Enter, Leertaste, Pfeil runter/hoch) öffnet, Pfeiltasten/Pos1/Ende im Menü, Escape/Tab/Klick außen schließen, Fokus zurück; Untermenü (Pfeil rechts/links, 300 ms Hover); menuitemradio/-checkbox | `dropdown-toggle` { open }, `dropdown-select` { value, checked } |
| `popover` | Klick schaltet, Fokus ins Panel, Fokus-Falle, Escape/Schließen-Knopf, Klick außen (nicht bei Formularen); `--hover-trigger`: 300 ms öffnen, 200 ms schließen, Fokus öffnet; `.is-open` an der Wurzel folgt dem Panel | `popover-toggle` { open, reason } |
| `tooltip` | Hover/Fokus macht das CSS; Escape blendet aus, bis Maus und Fokus weg sind (WCAG 1.4.13); ergänzt aria-describedby | `tooltip-dismiss` { reason } |
| `modal` | `<dialog>` per Knopf mit `aria-controls` öffnen (showModal), Escape, Schließen-Knopf, Fokus-Falle, Fokus zurück; Hintergrund nur mit `data-backdrop-close="true"`; `--scrollable`: `is-scrolled-top/-bottom` | `modal-open`, `modal-close` { reason } |
| `drawer` | wie Modal; Klick auf den Hintergrund schließt immer; `is-scrolled` am Drawer | `drawer-open`, `drawer-close` { reason } |
| `alert-dialog` | WAI-ARIA alertdialog: `<dialog>` per Knopf mit `aria-controls` öffnen, Fokus auf Abbrechen (`[data-action="cancel"]`, sonst erstes Element), Fokus-Falle, Escape = Abbrechen, Hintergrund schließt nicht, Knöpfe mit `data-action` schließen, Fokus zurück | `alert-dialog-open`, `alert-dialog-close` { reason } |
| `breadcrumb` | Ellipsis-Menü (Smart-Truncation): Klick, Enter, Leertaste, Pfeil runter/hoch öffnen; Pfeiltasten/Pos1/Ende im Menü; Escape/Tab/Klick außen schließen | `breadcrumb-toggle` { open } |
| `treeview` | WAI-ARIA Tree: Pfeil runter/hoch, rechts (auf / erstes Kind), links (zu / Eltern), Pos1, Ende; Enter/Leertaste/Klick wählen (single, `aria-selected` + `--selected`) bzw. haken an (multiple, `aria-checked` mit mixed-Eltern); Chevron klappt; roving tabindex auf `.nc-treeview__node` | `treeview-toggle` { value, expanded }, `treeview-select` { value, selected, values } |
| `navigation-menu` | Menü-Leiste mit Panels (WAI-ARIA Menubar): roving tabindex, Pfeil rechts/links/Pos1/Ende in der Leiste, Pfeil runter/Enter/Leertaste öffnen (erster Eintrag), Pfeil hoch (letzter); im Panel Pfeil runter/hoch, rechts/links zum Nachbarn, Escape/Tab/Klick außen schließen; `data-trigger="hover"` 150 ms | `navigation-menu-change` { value, previousValue } |

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
  version: 0.2.0
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
  Markup stehen; `js/breadcrumb.js` (Doku/Website) baut es dagegen aus
  `data-breadcrumb-hidden-items` und bindet selbst — beide nicht auf
  derselben Breadcrumb einsetzen.
- **Treeview** — WAI-ARIA Tree. Fokus und roving tabindex liegen auf der
  Zeile `.nc-treeview__node` (dort zeichnet das SCSS den Fokusring), die
  Zustände am `li[role=treeitem]`: `aria-expanded`, `aria-selected` (+
  `.nc-treeview__item--selected`, die Auswahl gestaltet das SCSS über die
  Klasse), im Checkbox-Modus `aria-checked` (true/false/mixed) samt
  `checked`/`indeterminate` der Checkbox. Ziehen & Ablegen und die
  Aktionen im Zeilen-Slot sind nicht Teil des Behaviors.
- **Navigationsmenü** — Menü-Leiste mit Panels nach dem Markup von
  `website/js/site.js`: Der Inhalt im Item ist nur Vorlage, offen zeigt ihn
  eine Kopie im Viewport (`data-state="open"` an Auslöser, Inhalt, Hülle und
  Viewport; `data-motion` beim Wechsel; Indikator `data-state="visible"` mit
  `left`/`width` wie in `site.js`). Die Vorlagen bekommen `inert`, sonst wären
  sie per Tab erreichbar und doppelt im Barrierefreiheits-Baum. Das DS blendet
  das Menü unter 1200 px aus — die Mobil-Navigation ist ein anderes Bauteil.
