# neo-behaviors

Verhalten der NEO-Bauteile — eine Quelle für Drupal, Doku und Theme-Konfigurator
(ADR-005, Entscheidung 01.10.2026).

| Recipe | Verhalten | Ereignisse |
| --- | --- | --- |
| `tabs` | Klick, Pfeiltasten (vertikal: hoch/runter), Pos1, Ende, Enter/Leertaste; gesperrte Tabs übersprungen; `data-neo-tabs="manuell"` = nur Enter aktiviert | `tab-change` { value, previousValue } |
| `accordion` | `<details>` klappt nativ; Pfeiltasten, Pos1, Ende zwischen den Kopfzeilen; `data-neo-accordion="einzeln"` = nur eines offen; Sprungziel `#id` öffnet den Eintrag (auch umschließende) und scrollt ihn an den Anfang (beim Binden, `hashchange`, erneuter Klick auf denselben Verweis); `data-behavior="single-scroll"` holt den geöffneten Kopf nach 100 ms unter die Kopfzeile zurück; Knopf `[data-neo-accordion-toggle-all]` mit `aria-controls` = id: alle auf/zu, `aria-expanded`, Beschriftung „Alle aufklappen/zuklappen“ (de/en nach `lang`, `data-text-expand`/`-collapse`); sanft nur ohne reduced motion (Plan v4, Phase 6b, vorher `neoAccordion`) | `accordion-toggle` { itemId, open }, `accordion-target` { itemId }, `accordion-toggle-all` { open } |
| `select` | natives Feld; `.is-open` am `.nc-select-wrapper` solange die Liste offen ist (Chevron dreht) | — |
| `search` | Fokus/Tippen öffnet, Tippen filtert und markiert, Leerhinweis, Pfeiltasten + Enter wählen, Escape/Verlassen schließt, Bereichs-Menü | `search-open` { open }, `search-select` { value } |
| `segmented-control` | Klick, Pfeiltasten, Pos1, Ende wählen ein Segment (Radio-Muster, roving tabindex); gesperrte übersprungen; gleitender Indikator (`setzeIndikator`, auch von der Arena-Vorlage genutzt) | `segment-change` { value, previousValue } |
| `toggle-group` | `single` (radiogroup): Klick/Pfeiltasten wählen, aria-checked; `multiple` (group): Klick/Enter/Leertaste schalten aria-pressed, Pfeiltasten bewegen nur den Fokus | `toggle-change` { value, selected, values } |
| `switch` | Button-Muster (`role="switch"`): Klick/Leertaste/Enter schalten aria-checked; Checkbox-Muster nativ | `switch-change` { checked } |
| `button` | nur Umschaltknöpfe (`.nc-button--toggle`, Entscheidung 06.10.2026): Klick, Enter, Leertaste (nativer Klick) schalten `aria-pressed`; gesperrte (`disabled`, `aria-disabled`) bleiben unverändert; alle anderen Buttons ohne JS | `button-toggle` { pressed, value } |
| `rating` | Klick wählt (nativ), färbt bis zum Wert (`__item--active`), Sentiment-Stufe, `__value`; Pfeiltasten ±1 (bis 0), Pos1, Ende; Reset-Knopf; Hover-Vorschau macht das CSS | `rating-change` { value, previousValue } |
| `input` | nur Löschknopf (`__clear`: leeren, `input` melden, Fokus zurück) und `data-empty`-Rückfall für Felder ohne placeholder — schwebendes Label ist reines CSS | `input-clear` { previousValue } |
| `multiselect` | Website (Formularfeld des Drupal-Theme): Knopf schaltet das Panel (`[hidden]` + inline `display: none` als Absicherung zur SCSS-Regel `.nc-multiselect__panel[hidden]`; `aria-expanded`, `aria-controls`, `.is-open`), Enter/Leertaste/Pfeil runter öffnen mit Fokus auf die erste Checkbox, Pfeiltasten/Pos1/Ende in der Liste, Leertaste wählt (nativ), Escape schließt + Fokus zurück, Klick außen und Fokus aus dem Feld schließen; Zusammenfassung im Knopf (bis zwei Namen, sonst „n ausgewählt“, leer: Platzhalter). In Drupal nur per `nur` | `multiselect-change` { values } |
| `form` | Website (Plan v4, Phase 8; `form[data-neo-form]`, Felder aus dem Twig): prüft jedes benannte Feld über die native Gültigkeit (das Formular trägt `novalidate`) und Gruppen `[data-neo-form-gruppe][data-required]` (mindestens ein Haken) — beim Verlassen, danach live, solange fehlerhaft, beim Absenden alle; Fehlertext `p.nc-form-error#<id>-err` ohne Rolle, `aria-invalid`, `aria-describedby`; beim Absenden mit Fehlern Zusammenfassung `.nc-validation-summary` (`role="alert"`, `tabindex=-1`, Links zu den Feldern) als erstes Kind, Fokus dorthin; Texte de/en nach `lang` (`data-error`, `data-label`). Absenden übernimmt, wer `form-submit` abbricht (in Drupal `js/neo-form.js`). In Drupal nur per `nur` | `form-submit` { valid, errors } (abbrechbar) |
| `dropdown-menu` | Menu Button: Auslöser (Klick, Enter, Leertaste, Pfeil runter/hoch) öffnet, Pfeiltasten/Pos1/Ende im Menü, Escape/Tab/Klick außen schließen, Fokus zurück; Untermenü (Pfeil rechts/links, 300 ms Hover); menuitemradio/-checkbox | `dropdown-toggle` { open }, `dropdown-select` { value, checked } |
| `popover` | Klick schaltet, Fokus ins Panel, Fokus-Falle, Escape/Schließen-Knopf, Klick außen (nicht bei Formularen); `--hover-trigger`: 300 ms öffnen, 200 ms schließen, Fokus öffnet; `.is-open` an der Wurzel folgt dem Panel | `popover-toggle` { open, reason } |
| `tooltip` | Hover/Fokus macht das CSS; Escape blendet aus, bis Maus und Fokus weg sind (WCAG 1.4.13); ergänzt aria-describedby | `tooltip-dismiss` { reason } |
| `modal` | `<dialog>` per Knopf mit `aria-controls` öffnen (showModal), Escape, Schließen-Knopf, Fokus-Falle, Fokus zurück; Hintergrund nur mit `data-backdrop-close="true"`; `--scrollable`: `is-scrolled-top/-bottom` | `modal-open`, `modal-close` { reason } |
| `drawer` | wie Modal; Klick auf den Hintergrund schließt immer; `is-scrolled` am Drawer | `drawer-open`, `drawer-close` { reason } |
| `alert-dialog` | WAI-ARIA alertdialog: `<dialog>` per Knopf mit `aria-controls` öffnen, Fokus auf die markierte sichere Aktion (`[autofocus]`, sonst Abbrechen `[data-action="cancel"]`, sonst erstes Element), Fokus-Falle, Escape = Abbrechen, Hintergrund schließt nicht, Knöpfe mit `data-action` schließen, Fokus zurück; mit `data-close="manuell"` am `<dialog>` schließt Bestätigen nicht, sondern meldet nur (`open: true`) — das Programm schließt mit `dialog.close()` | `alert-dialog-open`, `alert-dialog-close` { reason, action, open } |
| `mobile-drawer` | Website (Drupal-Theme): Knopf mit `aria-controls="<id des Drawers>"` öffnet `.nc-mobile-drawer--open` + Backdrop `--visible` (+ `body.u-no-scroll`), Fokus in den Drawer, Fokus-Falle, Rest der Seite `inert`; Escape, Schließen-Knopf, Backdrop oder erneut der Knopf schließen, Fokus zurück; geschlossen `inert` + `aria-hidden`; ab 1200 px (DS blendet aus) ohne Verhalten. In Drupal nur per `nur` | `mobile-drawer-open`, `mobile-drawer-close` { reason } |
| `table-info-modal` | Website (Drupal-Theme): Info-Knopf mit `aria-controls="<id des Dialogs>"` öffnet `.is-open`, Text aus `data-info` des Knopfs als Absätze in `__body` (als Text), Fokus auf Schließen, Fokus-Falle, Rest `inert`; Escape, Schließen-Knopf, Backdrop schließen, Fokus zurück; geschlossen `inert` + `aria-hidden`; Name des Dialogs bei jedem Öffnen aus `data-info-label` des Knopfs (Plan v4, Phase 5), ohne das und ohne Namen am Dialog `aria-label` des Knopfs; Abbinden stellt den Namen von vorher her. In Drupal nur per `nur` | `table-info-modal-open`, `table-info-modal-close` { reason } |
| `table-block` | Website (Tabellen-Block `.nc-table-block`, Tabelle aus dem Twig): Scroll-Grenze `data-scroll-bp` → `data-scroll-active` (Fensterbreite unter der Grenze), bei Überlauf benannte Scroll-Region (`role="region"`, `aria-label` aus dem Blocktitel, sonst `data-scroll-label`, sonst „Tabelle“/„Table“ nach `lang`, `tabindex="0"`), sonst keine; Schatten `.is-scrolled` ab 5 px; Messen gedrosselt (ein Durchlauf je Bild) über ResizeObserver und `resize`; Abbinden nimmt alles zurück. Ersetzt `Drupal.behaviors.neoTable` (Plan v4, Phase 5). In Drupal nur per `nur` | `table-block-change` { scrollActive, overflow } |
| `breadcrumb` | Ellipsis-Menü (Smart-Truncation): Klick, Enter, Leertaste, Pfeil runter/hoch öffnen; Pfeiltasten/Pos1/Ende im Menü; Escape/Tab/Klick außen schließen | `breadcrumb-toggle` { open } |
| `treeview` | WAI-ARIA Tree: Pfeil runter/hoch, rechts (auf / erstes Kind), links (zu / Eltern), Pos1, Ende; Enter/Leertaste/Klick wählen (single, `aria-selected` + `--selected`) bzw. haken an (multiple, `aria-checked` mit mixed-Eltern); Chevron klappt; roving tabindex auf dem `li[role=treeitem]`; Zeilen-Aktionen per Tab vom Eintrag, Escape zurück | `treeview-toggle` { value, expanded }, `treeview-select` { value, selected, values } |
| `navigation-menu` | WAI-ARIA Disclosure-Navigation (Recipe 3.0.0): Auslöser mit `aria-expanded`/`aria-controls`, Panel `[hidden]` im Item; Tab durch alle Einträge (kein roving tabindex), Enter/Leertaste/Klick schalten, Escape schließt (Fokus auf den Auslöser), optional Pfeil rechts/links/Pos1/Ende oben, Pfeil runter ins Panel, Pfeil runter/hoch/Pos1/Ende im Panel; Fokus verlässt das offene Item oder Klick außen schließen; höchstens ein Panel offen; `data-trigger="hover"` 150 ms | `navigation-menu-change` { value, previousValue } |
| `toolbar` | eine Tab-Station (roving tabindex über alle Knöpfe, Links und Felder, auch in eingebetteten Gruppen); Pfeil rechts/links (rundum), Pos1, Ende; in Eingabefeldern bleiben Pfeile/Pos1/Ende im Feld, Tab/Shift+Tab gehen vom Feld zum Nachbarn (am Rand raus); `nc-toolbar--sticky` bekommt `is-scrolled`, solange sie angeheftet ist (IntersectionObserver) | `toolbar-focus` { value, previousValue } |
| `sidebar` | Untermenü-Knopf (`aria-controls`) klappt per `[hidden]`; `__toggle` schaltet `--collapsed` (+ aria-label der Einträge); Mobil-Lage: Knopf mit `aria-controls` öffnet `--open` + Backdrop, Escape/Backdrop/Knopf schließen, Fokus zurück | `sidebar-submenu-toggle` { value, open }, `sidebar-collapse` { collapsed }, `sidebar-toggle` { open, reason } |
| `navigation-tab-mega` | Website-Hauptnavigation (Drupal `neo_nav`) auf fertigem Markup: Panels per Klick/Enter/Leertaste (nur eines, Fokus zurück), Mega-Tabs (Klick, Pfeil runter/hoch rundum), Such-Band (Fokus ins Feld, Löschen-Knopf), Sprach-/Erscheinungsbild-Menü (Pfeile, Auswahl), Sprache live über `data-neo-i18n`, Escape (Menü → Suche → Panel → Drawer), Klick außen, Drawer mit Push-Navigation (geschlossener Drawer und verschobene Bildschirme `inert`), aktueller Ast (`aria-current`), Auto-Hide beim Scrollen | `navigation-tab-mega-panel` { value, open }, `-tab` { value, previousValue }, `-search` { open }, `-menu` { value, open }, `-select` { menu, value }, `-language` { value }, `-drawer` { open, reason }, `-screen` { value }, `-hidden` { hidden } |
| `chapter-nav` | Website (Landing Pages): Scroll-Spy markiert per `aria-current` das LETZTE Kapitel über der Linie (max(`scroll-margin-top`, Kopfzeile `.site-header[data-neo-nav]` + Leiste) + 24 px), oben das erste, am Seitenende das letzte; Klick/Enter markiert sofort (Spy ruht bis das Scrollen steht, solange `[data-neo-sprung]` an `<html>` für das Auto-Hide der Hauptnavigation), springt mit Versatz (sanft, außer reduced motion), Anker per `pushState`, Fokus aufs Kapitel, das Kapitel bleibt markiert, bis wieder gescrollt wird; markierter Verweis in der Leiste sichtbar. In Drupal nur per `nur` | `chapter-nav-change` { value, previousValue } |
| `reference-page` | Website (Referenzseiten, `.nc-refpage`): Scroll-Spy im Verzeichnis wie `chapter-nav` — `aria-current` am LETZTEN Abschnitt über der Linie (max(`scroll-margin-top`, Kopfzeile `.site-header[data-neo-nav]`) + 24 px), oben der erste, am Seitenende der letzte; Klick/Enter markiert sofort (Spy ruht, `[data-neo-sprung]`), schließt unter 1024 px das Verzeichnis, springt mit Versatz (sanft, außer reduced motion), Anker per `pushState`, Fokus aufs Sprungziel, der Eintrag bleibt markiert, bis wieder gescrollt wird; Verzeichnis (`<details>`) unter 1024 px zu, darüber offen. In Drupal nur per `nur` | `reference-page-change` { value, previousValue } |
| `expanding-panels` | Website: Single-Open per `aria-expanded` (beim Binden das erste offen, falls keines), Klick öffnet (offenes bleibt offen), Pfeil rechts/runter und links/hoch rundum mit Fokus, Pos1, Ende; gesperrte übersprungen; alle Panels in der Tab-Folge. In Drupal nur per `nur` | `expanding-panels-change` { index, previousIndex } |
| `feature-accordion` | Website: Klick/Enter/Leertaste auf einen Link markiert ihn (`.is-active` + `aria-current`), scrollt sein Kapitel an den Anfang der rechten Spalte (zweispaltig die Spalte, gestapelt die Seite; sanft außer reduced motion), Fokus aufs Kapitel; Scroll-Spy der Spalte markiert das letzte Kapitel über ihrem Anfang; Einträge nativ (`<details>`). In Drupal nur per `nur` | `feature-accordion-change` { index, previousIndex } |
| `solution-tabs` | Website (Solution-Tabs und Tab-Nav, gleiche Wurzel): Tabs-Muster auf fertiger Tableiste (wandernder `tabindex`, Klick, Pfeil rechts/links bzw. vertikal runter/hoch rundum, Pos1, Ende, automatische Aktivierung); Autoplay nur mit `data-autoplay="on"` und ohne reduced motion: ein `setTimeout` je Schritt (`--nc-solution-tabs-autoplay-duration`), Knopf `__autoplay` vor der Tableiste mit wechselnder Beschriftung „Automatische Wiedergabe anhalten/fortsetzen“ (de/en nach `lang`, fehlt er, legt das Behavior ihn an), Handwahl stoppt dauerhaft, Maus/Fokus und außer Sicht ruhen (`.is-paused`, Restzeit), gestoppt `.is-stopped`; bei reduced motion Knopf `[hidden]`. In Drupal nur per `nur` | `solution-tabs-change` { value, previousValue }, `solution-tabs-autoplay` { playing, reason } |
| `gallery` | Website (Galerie, `.nc-gallery`): Blättern per Paddle und Pfeil links/rechts rundum (Spur `translate3d`, mit `--fade` nur `.is-active`); Punkte als Tabs (`aria-controls` auf den Slide, `aria-selected`, wandernder `tabindex`, auf den Punkten Pfeile rundum, Pos1, Ende); verborgene Slides `inert`; Autoplay nur mit `data-autoplay="on"` und ohne reduced motion (`--nc-gallery-autoplay-interval`), der Knopf `__autoplay` ist die einzige Quelle des Zustands (`data-playing`, `aria-label` „Galerie pausieren/abspielen“ de/en nach `lang`, fehlt er, legt das Behavior ihn an), Escape hält an, Handwahl stoppt dauerhaft, Maus/Fokus und außer Sicht ruhen (`.is-paused`), gestoppt `.is-stopped`; Spur `aria-live` polite, solange der Takt ruht. In Drupal nur per `nur` | `gallery-change` { index, previousIndex }, `gallery-autoplay` { playing, reason } |
| `marquee` | Website (Lauftext `.nc-marquee` und Logo-Laufband `.nc-logo-wall--marquee`): Pause-Knopf `__pause` vor der Spur mit wechselnder Beschriftung „Laufband anhalten/fortsetzen“ (de/en nach `lang`, fehlt er, legt das Behavior ihn an; `.is-stopped`), Maus über der Spur und Fokus im Laufband ruhen (`.is-paused`), Duplikate (`aria-hidden="true"`) aus der Tab-Folge (`tabindex="-1"` an allem Fokussierbaren, beim Abbinden zurück; nicht `inert`, damit Maus und Hover bleiben), bei reduced motion steht die Spur und der Knopf ist `[hidden]`; eine Wurzel mit `aria-hidden` gibt es an die Spur weiter. In Drupal nur per `nur` | `marquee-autoplay` { playing, reason } |
| `fade-gallery` | Website (Plan v4, Phase 6a; Überblend-Galerie `.nc-fade-gallery`, Markup im Twig): Tabs-Muster (`aria-selected`, wandernder `tabindex`, `aria-controls` auf das Medium `role=tabpanel`; auf einem Tab Pfeil rechts/links rundum, Pos1, Ende), Paddles `[data-fg-prev/next]` bzw. `.nc-gallery__paddle--prev/--next` blättern rundum; Medium `.is-active`, die anderen `aria-hidden`; Beschreibung (`data-fg-desc`, sonst Reihenfolge) erst sichtbar, im nächsten Bild `.is-visible`. Anfang: der Tab mit `aria-selected="true"`. In Drupal nur per `nur` | `fade-gallery-change` { index, previousIndex } |
| `carousel` | Website (Plan v4, Phase 6a; Geräte-Karussell `.nc-carousel` im Block neo_fade_gallery): Punkte `.nc-gallery__nav-dot` (Verweise auf die Figur; mit Skript scrollt die Spur statt der Seite) mit `.is-active` und `aria-current="true"`, Paddles eine Figur vor/zurück (an den Enden stehen bleibend), beide gesucht in der Hülle `[data-neo-fg-carousel]` oder der Wurzel; weiches Scrollen nur ohne reduced motion; Nachführen beim Wischen nach 90 ms Ruhe (zuletzt angesteuerte Figur, solange ganz zu sehen, sonst die an der Einrastkante). In Drupal nur per `nur` | `carousel-change` { index, previousIndex } |
| `product-showcase` | Website (Plan v4, Phase 6a, E8 = a; `.nc-product-showcase`), zwei Modi nach dem Markup. **Auswahl** (Optionen `.nc-product-showcase__option`, Block neo_product_showcase; seit Plan v4, Phase 7 Akkordeon-Muster statt Tabs): `aria-expanded` und `aria-controls` auf die eigene Beschreibung direkt darunter (offen `.is-open`, sonst `[hidden]`), genau eine offen, alle Optionen in der Tab-Folge, Pfeile rundum, Pos1, Ende; Rollen älteren Markups (`tablist`/`tab`/`tabpanel`, `aria-selected`) nimmt es beim Binden zurück; Medium per `data-station` (sonst Reihenfolge) `.is-active`; Text der Beschreibung neu eingesetzt (Einblende-Animation). **Stationen** (`.nc-product-showcase__trigger`, Geräte-Strecke): genau eine offen, Screen wechselt; längs `aria-expanded`, quer (Streifen `flex-direction: row`) `aria-current`, Formwechsel per ResizeObserver; quer gewischt = gewählt (IntersectionObserver auf dem Streifen, > 60 %); Pfeile ohne Umlauf, Pos1, Ende; setzt `data-neo-device-accordion="aktiv"`. In Drupal nur per `nur` | `product-showcase-change` { index, previousIndex } |
| `testimonial-grid` | Website (Plan v4, Phase 6a; Karussell `.nc-testimonial-grid--carousel`, Navigation `.nc-testimonial-grid__nav` als Geschwister danach): Vor/Zurück (`[data-tc-prev/next]`) scrollen um Kartenbreite plus `column-gap`, weich nur ohne reduced motion; an den Enden `disabled`, nachgeführt bei scroll und Größenänderung (ResizeObserver, sonst `resize`); wird der fokussierte Knopf gesperrt, geht der Fokus auf den anderen (sonst die Spur). Pfeile auf der Spur nativ. In Drupal nur per `nur` | `testimonial-grid-step` { direction } |
| `video` | Website (Plan v4, Phase 3, E5): an `[data-neo-video]`. Hintergrund: dekoratives `<video muted loop>` ohne `autoplay` startet nur ohne reduced motion und im Bild (IntersectionObserver), außer Sicht pausiert; Pause-Knopf `.nc-video-pause` je Video (ein Knopf, `aria-label` „Video anhalten/abspielen“ de/en nach `lang`, `data-playing`; fehlt er, legt das Behavior ihn hinter dem Medium an; in `aria-hidden`-Bereichen `tabindex=-1`; in einem Link folgt der Klick dem Link nicht); Handpause bleibt; reduced motion: kein Start, poster sichtbar, Knopf `[hidden]`; abgelehntes `play()` gilt als angehalten. Fassade (`data-neo-video="fassade"`, `data-video-url`): iframe erst nach dem Klick (YouTube über youtube-nocookie.com, Vimeo `dnt=1`), `title` aus dem `aria-label`, Fokus aufs iframe; `videoEinbettung(url)` liefert die Adresse. In Drupal nur per `nur` | `video-autoplay` { playing, reason }, `video-fassade` { provider, url } |
| `timeline` | Website (Plan v4, Phase 6b): an `[data-timeline]` (die `<ol class="nc-timeline">` des Twig), 1:1 aus `neoTimeline`: ohne Skript nichts versteckt (`nc-timeline--progress` setzt erst das Behavior); reduced motion oder kein IntersectionObserver: Linie sofort voll (`--nc-timeline-progress: 1`); sonst Einträge `is-visible` ab einem Drittel im Bild, Füllhöhe = Anteil der sichtbaren; Abbinden nimmt alles zurück. In Drupal nur per `nur` | `timeline-progress` { progress } |
| `hero-tom` | Website (Plan v4, Phase 6b): an `.nc-hero-tom[data-media-mode="expand"]` — das Medium fährt beim Scrollen auf volle Breite aus: `--tom-expand` = 1 − Oberkante/Fensterhöhe (0 … 1, inline am Medium), passiver Scroll-Lauscher, ein Durchlauf je Bild; reduced motion: nichts (SCSS zeigt den Endzustand); Abbinden löst den Lauscher und stellt den Inline-Wert her. Ersetzt `neoHeroTom`. In Drupal nur per `nur` | `hero-tom-expand` { expanded, progress } |
| `footer` | Website (Plan v4, Phase 6b): Knopf „Nach oben“ `[data-back-to-top]` in `.nc-footer` — scrollt an den Seitenanfang (sanft nur ohne reduced motion) und setzt den Fokus an den Seitenanfang (WCAG 2.4.3): Ziel `data-back-to-top="#id"`, sonst `main`/`[role=main]`, sonst `body`; nicht fokussierbare Ziele bekommen `tabindex="-1"` bis zum Verlassen; `focus({ preventScroll: true })`. Ersetzt `neoBackToTop` (Fokus blieb am Knopf). In Drupal nur per `nur` | `footer-back-to-top` { target } |
| `einblenden` | Website (Plan v4, Phase 6b), Hilfs-Behavior ohne eigenes Recipe (Soll in `card-grid`, `bento-grid`, `logo-wall`, `BEHAVIORS.einblenden.recipes`): an `[data-animation="reverse-domino"]`, `[data-animation="reveal"]` und `.nc-logo-wall--fadein` (nicht im Laufband). Das SCSS versteckt nur unter `[data-neo-behavior~="einblenden"]` — ohne Skript nichts versteckt; reduced motion oder kein IntersectionObserver: sofort `is-revealed`; sonst bei 15 % im Bild, gestaffelt (Karten `--card-delay` i × 0,1 s, Pillen `is-visible` + `transition-delay` i × `--nc-logo-wall-fadein-delay-step`); leere Wurzel wartet per MutationObserver auf Glieder. Ersetzt die drei Beobachter in `neo-theme.js`. In Drupal nur per `nur` | `einblenden` { reason } |
| `shot` | Website (Medien-Bauteil, Entscheidung 07.10.2026): `NeoBehaviors.shotAufbauen(container, karte)` baut das Markup aus den Karten-Daten (wie bisher `window.NeoShot.render`, das es ersetzt; `shotBauen` nur Markup) und bindet; Marker als Disclosure (Klick/Enter/Leertaste schalten, `aria-expanded`, Erklärung im Knopf als `aria-description`, Escape schließt mit Fokus am Marker, Klick ins Bild schließt), Vergleich als Slider (Ziehen, Pfeile ±1, Bild auf/ab ±10, Pos1/Ende, `aria-valuetext`), Lupe folgt dem Zeiger, Ken-Burns-Fahrt im Takt (pausiert außer Sicht, aus bei reduced motion). In Drupal nur per `nur` | `shot-hotspot-toggle` { index, open }, `shot-compare-change` { value } |
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
`BEHAVIORS`, `MIT_VERHALTEN`, `version`, `shotAufbauen`) und meldet sich selbst als
`Drupal.behaviors.neoBehaviors` an (attach bindet im Kontext, detach beim
`unload` löst wieder). Kein eigener Glue-Code nötig.

Einbinden im Theme `neo_fe` (`neo_fe.libraries.yml`):

```yaml
neo-behaviors:
  version: 0.18.0
  js:
    js/neo-behaviors.js: { attributes: { defer: true } }
  dependencies:
    - core/drupal
    - core/drupalSettings
```

Aktivieren im Theme immer über `_neo_fe_behaviors_anhaengen($variables,
['<id>'])` im Preprocess (hängt die Library an und setzt `nur`); nie
global über `global-styling`. Steuern über `drupalSettings`:

```php
$build['#attached']['drupalSettings']['neoBehaviors'] = ['nur' => ['tabs' => TRUE, 'select' => TRUE]]; // nur diese
$build['#attached']['drupalSettings']['neoBehaviors'] = ['aus' => TRUE];              // nichts binden
```

Website-Bauteile (Entscheidung 06.10.2026): Behaviors mit
`nurAusdruecklich: true` (Liste `NUR_AUSDRUECKLICH`) bindet die Drupal-Datei
**nur**, wenn `drupalSettings.neoBehaviors.nur` sie nennt — ein Aufruf ohne
`nur` lässt sie aus. So wird keines still auf einer Seite aktiv, auf der der
Block nicht steht. `nur` setzt das Theme als Objekt (`{ tabs: true }`);
eine Liste versteht die Datei auch, aber Drupal überschreibt Zahlenschlüssel
beim Zusammenführen mehrerer Blöcke (Fehler 08.10.2026). `anbinden()` aus dem Modul (Arena, Doku) bindet ohne `nur`
weiter alle. Wie ein Website-Bauteil entsteht, steht im Abschnitt
„Website-Bauteile“.

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

## Website-Bauteile (Entscheidung 06.10.2026, Stand nach Plan v4)

Seit Plan v4 (Phasen 1–8, 09.–13.10.2026) gibt es `neo_fe/js/neo-theme.js`
nicht mehr. Die Arbeit ist dreigeteilt:

| Wer | Was | Wo |
| --- | --- | --- |
| Twig (neo_fe) | Markup im Anfangszustand, Texte nach Positivliste (E9 a) | `templates/block/*.html.twig`, Aufbereitung in `includes/neo_*.inc` |
| neo-behaviors | Tastatur, Zustände, ARIA, Ereignisse (Soll im Recipe) | dieses Paket, `js/neo-behaviors.js` im Theme |
| Block-Library (neo_fe) | nur Daten und Absenden: Akzentfarbe je Tab, Medien aus Karten-JSON, Laden/Filtern der Veranstaltungen, Formular senden | `js/neo-<block>.js`, je Block eine Library |

So kommt ein neues Bauteil mit Verhalten auf die Website:

1. Recipe zuerst: `keyboard`, `events`, Zustände, Texte de/en.
2. Behavior in `packages/neo-behaviors/<id>.js` mit `nurAusdruecklich: true`,
   in `index.js` eintragen; Tests in
   `apps/theme-configurator/tests/behaviors/`.
3. `npm run behaviors:build`, `npm run behaviors:check`; `dist` committen.
4. Markup im Twig, so wie das Behavior es erwartet (Anfangszustand fertig,
   ohne Skript bedienbar oder vollständig sichtbar).
5. Im Block-Preprocess `_neo_fe_behaviors_anhaengen($variables, ['<id>'])`.
   Braucht der Block zusätzlich Theme-Code (Daten, Absenden), kommt er in
   eine eigene Library `neo_fe/neo-<block>` und wird mit
   `_neo_fe_bibliothek_anhaengen($variables, 'neo-<block>')` angehängt —
   nie in `global-styling`. Gemeinsames liegt in `neo_fe/neo-fe-binden`
   (`Drupal.neoFe.verhaltenBinden`, `.tabsBinden`).
6. Am Ende der Phase Version anheben (package.json, `version:` oben, dist)
   und `dist/neo-behaviors.js` byteweise nach `neo_fe/js/neo-behaviors.js`
   kopieren, Version in `neo_fe.libraries.yml` nachziehen.

Die Einträge unten beschreiben die Umstellung je Bauteil zum jeweiligen
Datum; „bis Phase 7“ heißt: inzwischen erledigt (siehe die beiden letzten
Einträge).

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
  DOM statt aus dem Token); wie `neo-chapter-nav.js` am Seitenende das letzte
  Kapitel und `[data-neo-sprung]` während eines Sprungs (07.10.2026). Neu: Fokus aufs angesprungene Kapitel, Spy ruht
  während des Sprungs, `prefers-reduced-motion`, Ereignis.
- **Referenzseite** (Entscheidung Abschluss 08.10.2026, scroll-spy) — das
  Verzeichnis `.nc-refpage__toc` aus `node--reference-page` (bisher
  `Drupal.behaviors.neoRefpageToc` in `neo-theme.js`). Spy und Sprung wie
  `chapter-nav` (gemeinsamer Scroll-Container über `naechsterScroller`),
  Klappzustand unter 1024 px wie bisher. Neu gegenüber `neo-theme.js`: am
  Seitenende der letzte Abschnitt, Fokus aufs Sprungziel, Sprung per Skript
  (Spy ruht, `[data-neo-sprung]`, reduced motion), Ereignis. Drupal:
  `_neo_fe_behaviors_anhaengen($variables, ['reference-page'])` im
  Node-Preprocess der Referenzseite.
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
- **Solution-Tabs / Tab-Nav** (Plan v4, Phase 1, 09.10.2026, E1/E6) —
  Verhalten aus `neoSolutionTabs` und `neoTabNav` in `neo-theme.js`; den
  Aufbau aus JSON behält das Theme bis Phase 7 und bindet danach mit
  `NeoBehaviors.anbinden(wurzel, ['solution-tabs'])`. Neu: Pause-Knopf
  (WCAG 2.2.2), Handwahl beendet die Rotation dauerhaft, Pos1/Ende auch in
  Solution-Tabs, `.is-paused` auch bei Fokus, kein Takt außer Sicht, der
  nächste Tab folgt immer dem gewählten (Zählerfehler der Tab-Nav), Ereignisse.
  Die Akzentfarbe je Tab bleibt im Theme (Daten; es hört auf
  `solution-tabs-change`).
- **Galerie und Laufband** (Plan v4, Phase 2, 12.10.2026) — Bedienung aus
  `neoGallery` in `neo-theme.js` (Blättern, Punkte, Tastatur, Autoplay)
  und neu das Laufband der Logo-Wand (vorher nur CSS mit Hover-Pause); den
  Aufbau aus JSON behält das Theme bis Phase 7 und bindet danach mit
  `NeoBehaviors.anbinden(wurzel, ['gallery'])` bzw. `['marquee']`. Behoben:
  Escape schaltete die Galerie per `autoplayBtn.click()` wieder ein;
  verborgene Slides (jetzt `inert`) und Laufband-Kopien (jetzt
  `tabindex="-1"`, weiter mausbedienbar) waren als Links fokussierbar. Neu:
  Punkte als Tabs mit `aria-controls` und wanderndem `tabindex`, Knopf als
  einzige Quelle des Zustands, Pause-Knopf im Laufband (WCAG 2.2.2),
  Ereignisse.
- **Tabellen-Block** (Plan v4, Phase 5, 12.10.2026) — `neoTable` in
  `neo-theme.js` entfällt vollständig: die Tabelle rendert neo_fe im Twig
  (Preprocess mit Positivliste, E9 a), das Verhalten (Scroll-Grenze,
  Scroll-Region, Schatten) kommt aus `table-block`, der Dialogname je Knopf
  aus `table-info-modal` (`data-info-label`). Neu: ohne JavaScript steht die
  vollständige Tabelle im Dokument; Messen gedrosselt (vorher `resize`
  ungedrosselt).
- **Fade-Gallery und Karussell** (Plan v4, Phase 6a, 12.10.2026) —
  `neoFadeGallery` in `neo-theme.js` entfällt; das Markup steht seit
  20.08.2026 im Twig, die beiden Darstellungen des Blocks binden
  `fade-gallery` bzw. `carousel`. Neu: `aria-current` am gewählten Punkt
  des Karussells, weiches Scrollen nur ohne reduced motion, Anfang nach
  `aria-selected`, Ereignisse.
- **Product-Showcase und Geräte-Strecke** (Plan v4, Phase 6a, 12.10.2026,
  E8 = a) — ein Behavior für beide: die Auswahl aus `neoProductShowcase`
  (Optionen baut das Theme bis Phase 7 weiter aus JSON und bindet danach)
  und `js/neo-device-scroll.js` (Library `neo-device-scroll` entfällt).
  Neu im Tabs-Modus: `aria-controls`, wandernder `tabindex`, Pos1/Ende,
  Medien-Panel als `tabpanel`, Beschreibung per `aria-describedby` statt
  `region` + `aria-hidden` in der Tableiste (axe aria-required-children).
- **Testimonial-Karussell** (Plan v4, Phase 6a, 12.10.2026) —
  `neoTestimonialCarousel` in `neo-theme.js` entfällt. Neu: weiches
  Scrollen nur ohne reduced motion (Recipe-Befund), der Fokus geht vom
  gesperrten Knopf auf den anderen über, Ereignis.
- **Umschalt-Bauteile auf fertigem Markup** (Plan v4, Phase 6b,
  12.10.2026) — Verhalten an Markup, das das Twig schon fertig liefert;
  die alte Funktion in `neo-theme.js` entfällt jeweils.
  `timeline`: 1:1 aus `neoTimeline` (vorher mit `core/once`), neu nur das
  Ereignis und das Abbinden.
  `hero-tom`: aus `neoHeroTom`; neu: der Scroll-Lauscher wird beim
  Abbinden gelöst (vorher nie), Ereignis beim Wechsel ganz ausgefahren.
  `accordion` übernimmt `neoAccordion` (Sprungziel, Mitscrollen, „Alle
  aufklappen“) — Theme und Paket teilen sich das Akkordeon nicht mehr;
  neu: Knopftexte nach Sprache, sanft nur ohne reduced motion, Sprung auch
  beim zweiten Klick auf denselben Verweis.
  `footer`: „Nach oben“ aus `neoBackToTop`; neu: Fokus an den
  Seitenanfang (Hauptinhalt) statt am Knopf (WCAG 2.4.3).
  `einblenden`: ein Behavior für die drei gleichen Einblendungen in
  Card-Grid, Bento und Logo-Wand; neu: ohne Skript ist nichts versteckt
  (das SCSS blendet nur unter dem gebundenen Behavior aus). Die aus JSON
  gebauten Blöcke binden nach dem Aufbau mit
  `NeoBehaviors.anbinden(wurzel, ['einblenden'])`.
- **Markup ins Twig** (Plan v4, Phase 7, 13.10.2026) — Feature-Liste,
  Card-Grid, Card-Grid-CTA, Bento, Logo-Wand, Product-Showcase (Modus
  Auswahl, Akkordeon-Muster statt Tabs), Galerie, Story-Gallery,
  Solution-Tabs und Tab-Nav (Gerüst und die Module features, feature_list,
  expanding, bento, form) rendern ihr Markup im Twig statt aus JSON per
  `innerHTML`; die Behaviors binden am fertigen Markup. Die im Bestand
  ungenutzten Tab-Nav-Module card_grid, hero, hero_tom, hero_tmob und
  text_media baut weiter `js/neo-tab-nav.js` (Entscheidung 10f, Weg 3).
- **Formular, Veranstaltungsliste, Block-Libraries** (Plan v4, Phase 8,
  13.10.2026) — `form` ersetzt die Prüfung aus `NeoForm.renderFields`
  (eine Zusammenfassung statt eines `role="alert"` je Feld); die Felder
  rendert das Twig, Absenden bleibt im Theme (`js/neo-form.js`, Ereignis
  `form-submit`). Die Veranstaltungsliste klont ihre Karte aus
  `<template data-events-card>` (statt `innerHTML`), Begriffs-Namen kommen
  aus Drupal. `neo-theme.js` ist in Block-Libraries aufgeteilt;
  `global-styling` lädt kein Block-Skript mehr.
- **FAQ** (website-verhalten d) — **kein eigenes Behavior**, `<details>`
  genügt. Begründung: `neo-theme.js` bindet am FAQ nichts (`neoAccordion`
  greift nur bei `[data-neo-accordion]` mit `.nc-accordion__item`), das
  heutige Website-Verhalten ist also das native — 1:1 heißt ohne Skript.
  Enter/Leertaste/Klick, die Ansage des Zustands und die Suche im Dokument
  liefert der Browser; „nur eine offen“ geht nativ über ein gemeinsames
  `name` an den `<details>`; Pfeiltasten sind im APG-Muster optional, Tab
  reicht für eine Liste unabhängiger Fragen. Wer Sprungziele, „Alle
  aufklappen“ oder Pfeiltasten braucht, nimmt das Akkordeon (`accordion`).
