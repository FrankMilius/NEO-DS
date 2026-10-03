# ADR-005: Komposition im Recipe, Verhalten als gemeinsames Paket

- **Status:** angenommen; Phase 1 umgesetzt, Phase 2 weitgehend umgesetzt, Phase 3:
  Blöcke Formular, Overlays und Navigation umgesetzt, Verhalten der
  Navigations-Bauteile ergänzt (Plan v3, Stand 02.10.2026)
- **Datum:** 01.10.2026
- **Entscheider:** Frank Milius
- **Code:** `data/recipe-schema.json` (`komposition`), `scripts/pruefe-komposition.mjs`,
  `packages/neo-behaviors/`, `apps/theme-configurator/src/components/laboratory/RecipeArena.vue`

## Kontext

Die Arena des Theme-Konfigurators zeigt jeden Zustand als feste Zelle. Das ist
gewollt: Beim Ändern eines Tokens sieht man alle Zustände auf einmal. Zwei
Dinge fehlten aber:

1. **Komposition.** Kein Recipe sagte, aus welchen Bauteilen es besteht. Die
   Suche trug im Markup nicht `nc-input`, obwohl die SCSS-Anatomie das vorsah,
   und erbte vom Input nur den Radius. Das Select war in der Arena eine
   nachgezeichnete Attrappe mit eigenen Ersatzwerten.
2. **Verhalten.** Tab wechseln, Liste öffnen, Tastatur: Das stand nur in der
   Drupal-Datei `neo_fe/js/neo-theme.js` (website-spezifisch) und in
   Doku-Skripten. Die Recipes beschreiben Tastatur und Ereignisse nur bei 4 von
   130 Bauteilen.

## Entscheidung

1. **Natives Select bleibt.** Die geöffnete Liste zeichnet der Browser; das
   Theme gestaltet das geschlossene Feld. Die Arena zeigt ein echtes,
   bedienbares Feld.
2. **Recipe-Feld `komposition`** (optional, Schema 3.1):
   `{ "art": "enthaelt" | "teilt", "recipe", "element"?, "tokenPraefix"?, "tokens"? }`.
   `scripts/pruefe-komposition.mjs` (in `npm test` und CI) prüft, dass die
   Kette hält: Klasse im Markup, geteilte Tokens im SCSS, abgeleitete Tokens
   zeigen per `var()` auf die Quelle. Neue Fundstellen im Markup ohne
   Erklärung werden gemeldet.
3. **Verhalten als gemeinsames Paket `packages/neo-behaviors`** im Design
   System: Vanilla JS, ohne Abhängigkeiten, `anbinden(bereich)` /
   `abbinden(bereich)`, je Recipe-ID ein Behavior. Das Soll steht im Recipe
   (`keyboard`, `events`, State-Regeln); Tests binden an genau das Markup, das
   die Arena aus dem Recipe baut. Drupal, Doku und Konfigurator nutzen dieselbe
   Datei.
4. **Arena mit zwei Ansichten:** „Zustände" (feste Matrix, wie bisher) und
   „Ausprobieren" (je Specimen eine lebendige Instanz mit dem Verhalten).

## Alternativen

- **Verhalten im Konfigurator nachbauen (Vue):** schnell, aber eine vierte
  Kopie neben Drupal, Doku und Storybook — verworfen.
- **Behaviors aus `neo-theme.js` übernehmen:** die Datei ist auf die Website
  zugeschnitten (Inhalte aus JSON, GSAP, Seitenanker) — als Quelle für die
  Bauteile ungeeignet; sie kann später auf das Paket umsteigen.
- **Eigene Select-Liste:** gestaltbar, aber schlechter auf Mobilgeräten und
  aufwendiger in der Barrierefreiheit — verworfen (Entscheidung 1).

## Folgen

- 72 Beziehungen in 40 Recipes erklärt (68 aus dem Markup ermittelt).
- Suche: Markup `nc-input nc-search__input`; `--nc-search-input-height` zeigt
  auf `--nc-input-height-md`. Der Inspector zeigt „erbt von Input". Die Suche
  ist auf der Website nicht im Einsatz, sichtbar nur in Doku, Storybook und
  Konfigurator.
- Dabei gefundene DS-Fehler behoben: Such-Symbol lag unter dem Feld;
  Bereichs-Knopf überdeckte das Symbol; Vorschlagstext (Type-Ahead) stand
  versetzt; die Ergebnisliste der Befehlspalette lag am unteren Bildrand.
- Select und Suche kommen aus dem Recipe (Vorlagen), die Vue-Arenen sind
  gelöscht.
- `neo-behaviors` 0.1.0: Tabs, Akkordeon, Select (Chevron), Suche. Offen:
  Build als Datei für die Drupal-Library (IIFE) und der Umstieg von
  `neo-theme.js` — mit der Drupal-Entwicklung abzustimmen.
- `recipe-sdk` `loadRecipe()` reicht `komposition`, `keyboard`, `events` durch.
- `neo-behaviors` 0.2.0 (02.10.2026): zusätzlich Segmented Control, Toggle-Group,
  Switch, Rating, Input (nur Löschknopf), Dropdown-Menü, Popover, Tooltip,
  Modal, Drawer. `keyboard`/`events` stehen jetzt in 15 Recipes (11 neu, darunter
  Suche und Select); die Tests prüfen jede Taste und jede detail-Struktur.
  Der gleitende Indikator des Segmented Control kommt aus dem Paket
  (`setzeIndikator`), die Arena-Vorlage nutzt dieselbe Funktion.
  „Ausprobieren" gibt es für die Formular-Bauteile; die Overlays folgen, wenn
  ihre Sonderfall-Arenen in Phase 3 Recipe-Vorlagen bekommen.
- Phase 3, Block Formular (02.10.2026): input, textarea, checkbox, radio,
  switch, range, rating, segmented-control, toggle-group, form-field,
  input-group, fieldset kommen aus Recipe-Vorlagen (`src/arena-templates`);
  zwölf `*Arena.vue` gelöscht. Native Felder sind echt und bedienbar.
- Phase 3, Block Overlays (02.10.2026): dropdown-menu, popover, tooltip, modal,
  drawer, alert-dialog kommen aus Recipe-Vorlagen; sechs `*Arena.vue`
  gelöscht. Das Arena-Modell trägt `m.ausprobieren`: In „Zustände" stehen die
  Overlays fest offen (Panel ohne `[hidden]`, `aria-expanded="true"`, Dialoge
  mit `[open]`), in „Ausprobieren" starten sie geschlossen und das Behavior
  öffnet sie. Damit nichts über die App ragt, liegen Menü, Popover und Tooltip
  in einer Platzfläche (`ra-anker`) und die Dialoge in einem Rahmen
  (`ra-buehne`), den `contain: layout paint` zum Bezugsrahmen der
  `position: fixed`-Dialoge macht; `showModal()` öffnet in „Ausprobieren"
  wie in Drupal über dem ganzen Fenster. „Ausprobieren" gibt es für alle
  Overlays mit Behavior; der Alert-Dialog hat noch keins (Recipe ohne
  `keyboard`/`events`) und zeigt nur „Zustände".
- Die Arena macht DS-Fehler der Overlays sichtbar, die die handgeschriebenen
  Arenen (eigene Inline-Stile) verdeckt hatten — u. a. bleibt das Untermenü
  des Dropdowns im `overflow` des Menüs hängen, und die Eingangsanimation des
  Popovers überschreibt dessen Zentrierung (`transform`). Sie sind nicht
  stillschweigend behoben, sondern als Befunde zur Entscheidung gemeldet.
- Phase 3, Block Navigation (02.10.2026): breadcrumb, pagination, navigation,
  navigation-menu, sidebar, treeview, toolbar kommen aus Recipe-Vorlagen;
  sieben `*Arena.vue` gelöscht. Markup nach SCSS-Struktur, Doku und
  `data/markup` (Navigationsmenü nach `website/js/site.js`). Keines der sieben
  Recipes gibt `keyboard`/`events` vor, `neo-behaviors` hat für sie kein
  Verhalten — alle zeigen nur „Zustände". Offene Zustände stehen fest
  (Breadcrumb-Dropdown `.is-open`, Viewport des Navigationsmenüs
  `data-state="open"`). Neue Arena-Rahmen: `ra-kopf` (Kopfzeile in
  Desktop-Breite, schneidet `.is-hidden` ab), `ra-kulisse` (dunkler Grund für
  transparente/geblurrte Flächen), `ra-spalte` (Höhe für die Sidebar),
  `ra-anker--desktop` (offenes Navigationsmenü) und `ra-buehne--mobil` (die
  Sidebar als Mobil-Overlay; das DS schaltet diese Lage nur über die
  Fensterbreite, die Arena stellt sie im Rahmen mit den DS-Werten dar).
  Die Arena gilt dem DS-Bauteil `.nc-header`/`.nc-nav`; ob die
  Website-Navigation „V3 Tab-Mega" (Drupal-Modul `neo_nav`) ein eigenes Recipe
  bekommt, ist offen. Auch hier sichtbar gewordene DS-Befunde (u. a.
  Listenabstand aus `li`-Elementstilen in Treeview, Breadcrumb und Pagination;
  Marke und Links der transparenten Kopfzeile bleiben dunkel) sind gemeldet,
  nicht stillschweigend behoben.
- Overlays, drei Entscheidungen (02.10.2026): (1) Fester offener Zustand per
  Klasse `.is-open` an `.nc-popover` (Panel sichtbar, auch im Hover-Modus;
  `[hidden]` hat Vorrang) und `.nc-tooltip` (Mixin `tooltip-visible`); das
  Popover-Behavior hält `is-open` mit dem Panel synchron, die Arena zeigt
  „Zustände" darüber statt mit eigener Nachbildung (`ra-anker--offen`
  entfällt). (2) Modifier `nc-modal--sheet`: Bottom-Sheet auf jeder
  Fensterbreite; die Regeln liegen im Mixin `modal-bottom-sheet`, das auch
  die automatische Umschaltung unter sm nutzt; Recipe-Achse `layout`
  (dialog | sheet). (3) Alert-Dialog-Verhalten nach WAI-ARIA alertdialog:
  Behavior `alert-dialog` (Fokus auf Abbrechen, Fokus-Falle, Escape =
  Abbrechen, Hintergrund schließt nicht, `data-action` schließt mit
  reason), Recipe mit `keyboard`/`events`, „Ausprobieren" jetzt für alle
  sechs Overlays.
- Verhalten der Navigations-Bauteile (Entscheidung 02.10.2026): `keyboard` und
  `events` jetzt auch in breadcrumb, treeview, navigation-menu, toolbar und
  sidebar (20 Recipes); `neo-behaviors` 0.3.0 mit fünf neuen Behaviors —
  Breadcrumb (Ellipsis-Menü), Treeview (WAI-ARIA Tree mit Auswahl und
  Checkbox-Kaskade), Navigationsmenü (Menü-Leiste mit Panels, Kopie der
  Item-Vorlage im Viewport wie `site.js`), Toolbar (eine Tab-Station, roving
  tabindex; in Eingabefeldern bleiben die Pfeiltasten im Feld, Tab/Shift+Tab
  verlassen das Feld zum Nachbarn in der Leiste) und Sidebar (Untermenü,
  Einklappen, Mobil-Lage mit Escape und Backdrop). Zustände nur über das, was
  das SCSS kennt: ARIA, `[hidden]`, `data-state` und die vorhandenen
  Zustandsklassen (`.is-open`, `--selected`, `--collapsed`, `--open`); keine
  SCSS-Änderung. Pagination und Navigation (Kopfzeile) bleiben ohne Verhalten.
- „Ausprobieren" gibt es damit für alle fünf. Offene Zustände (Breadcrumb-
  Dropdown, Panels des Navigationsmenüs, Mobil-Sidebar) starten dort zu; die
  Mobil-Sidebar bekommt einen Öffner mit `aria-controls`. Die Toolbar-Vorlage
  liefert in „Ausprobieren" das Markup mit roving tabindex, in „Zustände"
  bleiben alle Knöpfe in der Tab-Folge (dort bindet kein Verhalten — Knöpfe
  mit `tabindex="-1"` wären per Tastatur unerreichbar). Die Arena bindet
  neben dem Bauteil auch enthaltene Bauteile mit Verhalten (`komposition`
  „enthaelt", Specimen `composes`), z. B. die Toggle-Groups der Toolbar;
  `anbinden()` bindet immer in der Reihenfolge von `BEHAVIORS`, äußere
  Bauteile zuletzt.
- Sichtbar gewordene DS-Befunde (gemeldet, nicht behoben): der Fokus des
  Treeviews liegt auf `.nc-treeview__node` (ohne Rolle) statt auf dem
  `treeitem`, Auswahl und Sperre gestaltet das SCSS nur über Klassen,
  zugeklappte Kinder sind nur per Grid/Deckkraft versteckt; die Vorlagen des
  Navigationsmenüs im Item sind fokussierbar (das Behavior setzt `inert`);
  die geschlossene Mobil-Sidebar bleibt in der Tab-Folge (nur verschoben),
  das Untermenü der eingeklappten Sidebar ist ganz ausgeblendet und damit
  unerreichbar; `js/breadcrumb.js` würde auf Markup mit vorhandenem Menü
  ein zweites bauen.
- Entscheidung 02.10.2026: Die Website-Hauptnavigation „V3 Tab-Mega" bekommt
  ein eigenes Recipe `navigation-tab-mega` (Wurzel `.site-header[data-neo-nav]`,
  zweite Wurzel `.m-drawer`). `neo-nav.css` ist als
  `07-organisms/_navigation-tab-mega.scss` mit unveränderten Werten
  aufgenommen, jede Regel auf die Wurzeln begrenzt (`:where()`, Spezifität
  unverändert); Arena-Vorlage, `data/markup` und Story kommen aus dem Markup,
  das `neo-nav.js` aufbaut. Das Recipe nennt `keyboard` (aus `neo-nav.js`),
  ein Behavior in `neo-behaviors` gibt es dafür noch nicht — die Arena zeigt
  nur „Zustände". Drupal lädt bis zur Umstellung weiter sein `neo-nav.css`.
- Entscheidung 03.10.2026 (navmenu-muster): Das DS-Navigationsmenü folgt dem
  WAI-ARIA Disclosure-Navigationsmuster statt der Menubar (Recipe
  `navigation-menu` 3.0.0, Major — das Markup bricht). Markup:
  `nav[aria-label] > ul > li` mit Links bzw.
  `button[type=button][aria-expanded][aria-controls]` und dem Panel
  `.nc-navigation-menu__content#id[hidden]` direkt danach im Item — keine
  Rollen `menubar`/`menu`/`menuitem`/`none`, kein roving tabindex, kein
  Viewport und keine Kopie mehr (damit entfällt auch `inert`). Das SCSS zeigt
  das offene Panel (`aria-expanded="true"` + `aria-controls`, ohne `[hidden]`)
  unter der Leiste in voller Breite; Vorher/Nachher-Screenshot der Arena
  pixelgleich. Das alte Markup (`data-state`, Viewport — `website/js/site.js`
  der Prototyp-Seiten) liest das SCSS weiter (veraltet). Verhalten: Tab durch
  alle Einträge, Enter/Leertaste (nativer Klick) schalten, Escape schließt
  mit Fokus auf den Auslöser, Fokus aus dem offenen Item oder Klick außen
  schließt, höchstens ein Panel offen; optionale Pfeiltasten (oben
  rechts/links/Pos1/Ende, Pfeil runter ins Panel, im Panel runter/hoch).
  `aria-current="page"` markiert die aktuelle Seite. Ereignis
  `navigation-menu-change` unverändert. Die Website (Drupal, „V3 Tab-Mega")
  nutzt das DS-Navigationsmenü nicht und ist nicht betroffen.
- Entscheidung 03.10.2026 (tabmega-umstellen = „Jetzt umstellen"): Drupal
  lädt `neo-nav.css` nicht mehr; die Library `neo_fe/neo-nav` hat kein
  eigenes Stylesheet, die Regeln kommen aus `styles.css` (global-styling),
  `css/neo-nav.css` ist gelöscht. Die Kaskade ändert sich nur in der
  Reihenfolge (vorher nach, jetzt vor `theme-overrides.css` und
  `neo-overrides.css`); beide enthalten keine Navigations-Selektoren.
  Nachgemessen mit Twig + `neo-nav.js` in Drupal-Reihenfolge: 0 abweichende
  berechnete Stile (alle Knoten in Header und Drawer inkl. `::before`/
  `::after`, neun Zustände, hell/dunkel) und 0 abweichende Pixel.
- Entscheidung 03.10.2026 (tabmega-verhalten = „Markup per Twig, Verhalten
  in neo-behaviors"): Behavior `navigation-tab-mega` arbeitet auf fertigem
  Markup und deckt alles ab, was `neo-nav.js` konnte (Panels, Mega-Tabs,
  Such-Band, Kopfleisten-Menüs, Sprache live, Escape, Klick außen, Drawer
  mit Push-Navigation, aktueller Ast, Auto-Hide) — außer dem Aufbau des
  Markups. Recipe 1.1.0 mit `events`; Klassen und Größengrenze unverändert
  (tabmega-klassen, tabmega-groesse = lassen). DE/EN bleibt live ohne
  Neuladen: das Twig rendert die Seitensprache und legt beide Fassungen in
  `data-neo-i18n` ab (ein Neuladen in der anderen Sprache hätte
  Sprach-URLs und übersetzte Inhalte vorausgesetzt, die die Website nicht
  zusagt). Bewusste Abweichungen von `neo-nav.js`: Öffnen von Panel/Suche
  schließt auch die Kopfleisten-Menüs, Escape schließt auch ein Menü ohne
  Fokus darin (beides wie im Recipe), `lang` wechselt an Header und Drawer
  statt an `<html>`, die Push-Navigation führt den Fokus (Zurück bzw.
  Zeile), der geschlossene Drawer und die verschobenen Bildschirme sind
  `inert` (vorher per Tab erreichbar, obwohl aus dem Bild geschoben; liegt
  der Fokus beim Schließen im Drawer, geht er zum Burger). „Ausprobieren" für die Arena; dort startet alles zu und das
  Auto-Hide ist aus.
