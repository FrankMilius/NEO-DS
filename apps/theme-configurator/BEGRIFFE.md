# Begriffsliste und Schreibregeln — Theme-Konfigurator

Freigegeben von Frank Milius am 19.10.2026 (Paket 5, Block 5e; Befunde
UX-20, UX-25, UX-52, UX-53, UX-56). Verbindlich für alle sichtbaren Texte der
App. Neue Begriffe hier eintragen, bevor sie in die Oberfläche kommen.

## Anrede und Schreibregeln

1. **Anrede „Sie“**, durchgängig. Imperativ als „Wählen Sie …“, nie „Wähle …“.
2. **Umlaute und ß** immer: „für“, nie „fuer“.
3. **Knöpfe sind Verben**, wenn möglich mit Ziel („Theme speichern“,
   „Auf der Website aktivieren“).
4. **Fehlermeldungen** nennen, was passiert ist und was zu tun ist. Keine
   Ausrufezeichen, keine Schuldzuweisung.
5. **Typografie:** deutsche Anführungszeichen „…“, Gedankenstrich –, Zahl und
   Einheit mit Leerzeichen („16 px“), Dezimalkomma im Fließtext („1,5“),
   Punkt nur in Eingabefeldern und technischen Werten.
6. **Technische Namen** (CSS-Variablen, Dateinamen, Recipe-IDs) erscheinen nur,
   wenn „Technische Namen zeigen“ eingeschaltet ist.

## Ausnahmeliste (bleibt englisch)

Eigennamen und Fachbegriffe: NEO Design System, Theme, Token, Drupal, Tabler,
Heroicons, CSS, HEX, JSON, DTCG, sowie die **Komponentennamen** des Design
Systems (Button, Card, Accordion …) — ausgeschrieben, ohne Kürzel
(„Table Cell“, nicht „Tbl Cell“), jede Komponente genau einmal.

## Grundbegriffe

| Begriff | Ersetzt | Bedeutung |
|---|---|---|
| NEO-Standard | NEO Theme, Neo Theme, NEO-Theme, Standard-Theme | das unveränderte Ausgangstheme des Design Systems |
| Auf NEO-Standard zurücksetzen | Reset to Defaults, Werkseinstellung | Aktion |
| NEO Design System | – | Eigenname der Quelle |
| Theme | – | ein gespeicherter Satz von Abweichungen. **Jeder Kunde bekommt ein eigenes Theme**; es können beliebig viele Kunden-Themes nebeneinander bestehen. |
| Token | – | Fachbegriff (Entscheidung E1); in „Begriffe erklärt“ erläutert, im Fließtext auch „Wert“ |
| Abweichung | Override | Wert, der vom NEO-Standard abweicht; Kennzeichen am Wert: „geändert“ (statt „modified“) |
| Grundfarben (Ebene 1) | Primitive Colors, Primitive | die Farbpaletten |
| Primär · Sekundär · Akzent | Primary, Secondary, Accent; „Neo Lime“ als Name einer geänderten Palette | Rollen der Markenpaletten und ihr Name (UX-34). Der NEO-Name (Graphit, Neo Lime) steht nur beim Wert des NEO-Standards; geändert heißt es „Akzent · eigene Farbe“ |
| Fläche (Navigation): Standard · Sekundär · Invertiert · Akzent | – | feste Liste für Leiste, Panels und mobiles Menü; jede Fläche setzt Hintergrund, Text, Nebentext, Linie, Hover und Fokus gemeinsam |
| Button-Typ (Übersichtslink): Ghost · Primär · Sekundär · Akzent | – | Aussehen des Links „Zur Übersicht“ in der Variante zentriert, für alle Panels gleich |
| Stufe (50–950) | Shade, 5-%-Schritt | eine der 11 Abstufungen einer Palette, wie die Website sie nutzt |
| Farbrollen (Ebene 2) | Semantic Colors, Semantik, Bedeutungen | Rollen wie Text, Fläche, Rahmen; verweisen auf Grundfarben |
| Komponentenwerte (Ebene 3) | Level L3, Component Tokens | Werte einzelner Komponenten |
| Schriftrollen: Body · Heading · Mono · Bedienelemente | UI Font, font-ui, Font Family (als Freitext) | die Schriften unter Typografie (20.10.2026). „Bedienelemente“ verweist auf Body, Heading oder Mono und gilt für Buttons, Formularfelder, Badges, Chips, Tags, Brotkrumen und Seitenzahlen. Die Schriftfamilie einer Komponente wählt eine dieser Rollen; ein eigener Font-Stack heißt „Eigene Angabe“ |
| Hell · Dunkel · Nebeneinander · Alle vier | Light, Dark, Split, Matrix | Vorschaumodi |
| App-Darstellung: Hell · Dunkel · Wie System | Dark Mode, Light Mode, App-Theme | Schalter rechts in der Kopfleiste (R03, 20.10.2026); färbt nur die Oberfläche der App, nicht die Bühne. Nie nur „Hell/Dunkel“ ohne „App-Darstellung“, damit es nicht mit den Vorschaumodi verwechselt wird |
| Bühne | Arena, Theme Arena, Laboratory, Labor | mittlere Vorschaufläche |
| Einstellungen | Inspector | rechte Spalte (Entscheidung E2) |
| Vorschau | Specimen | eine Vorschau auf der Bühne |
| Hilfslinien | Outline, Debug-Rahmen | Schalter auf der Bühne bei Objekten: Kanten und Maße über dem echten Inhalt |
| wirkt derzeit nicht | – | Kennzeichen an einem Komponentenwert (R12, 20.10.2026): Die Wirkungsprüfung misst auf der Bühne keine Änderung, oder das Design System liest den Wert nirgends. Erklärung beim Darüberfahren |
| Muster · Auf der Seite | Specimen, Kontext | Ansicht einer Grundlage auf der Bühne: Kacheln je Wert oder Website-Ausschnitt mit Markierungen, wo der Wert wirkt |
| Datums-Abzeichen | Date Badge, Datums-Badge, Kalenderblatt | Feld mit Tag und Monat auf der Event-Karte des Content Feeds (Card › Datums-Abzeichen, I11 19.11.2026); nicht die Komponente Badge |
| Bilder einfärben · Ton | Duotone, Tint, Colorize, Bildfilter | Kartenbilder werden im Browser von Schwarz bis zu einem Ton gefärbt, das Bild selbst bleibt unverändert (Card › Bilder einfärben, I12 20.11.2026). Töne: Grün · Aqua · Lime · Forest; „aus“ schaltet eine einzelne Karte ab; ohne Ton bleiben die Bilder im Original — Übersichtsseite Aktuelles und Card-Grid-Reiter der Tab-Navigation beschriften den leeren Wert „Original“ (I13 20.11.2026). Gilt auch für Card CTA (Card Grid CTA, Bild und Video; I14 21.11.2026) |
| Schwarzpunkt | Black Point, Schwellwert | Helligkeit, ab der ein Bildpunkt beim Einfärben schwarz wird (0 bis 0,9; Vorgabe 0,26). Höher = dunkleres, kontrastreicheres Bild |
| Wischleiste (Handy) | Slider, Carousel, Swipe-Leiste | die Karten des Content Feeds liegen auf schmalen Breiten nebeneinander und lassen sich waagerecht wischen (Content Feed › Wischleiste, I11 19.11.2026) |
| Pfeile · Pfeilfarbe | Paddle, Paddle Color, Arrow, Navigationspfeil | die Knöpfe zum Blättern in der Story Gallery; Pfeilfarbe färbt die Pfeile und den Mauspfeil im Endlos-Modus (Story Gallery › Farben, I16 23.11.2026) |
| Nächste Karte sichtbar (Handy) | Peek, Anschnitt, Vorschau | wie viel der folgenden Karte am rechten Rand der Story Gallery stehen bleibt, damit man sieht, dass es weitergeht (Story Gallery › Geometrie, I18 24.11.2026) |
| Medienfläche · Bildschirm | Bühne, Stage, Passepartout | getönte Fläche hinter jedem Bild der Story Gallery mit Innenabstand oben und seitlich; „Bildschirm“ ist das Bild darauf mit Schatten und oben gerundeten Ecken (Story Gallery › Medienfläche, I16 23.11.2026). „Bühne“ bleibt der Vorschaufläche der App vorbehalten |
| Fußleiste · Fortschritt | Footer, Progress, Progress Bar, Scrollbar | Leiste unter der Story Gallery mit dem dünnen Fortschrittsbalken links und den Pfeilen rechts, bei „Pfeile: unten“ und im Endlos-Modus (Story Gallery › Fußleiste, I16 23.11.2026); der Balken zeigt, wie weit geblättert ist, im Endlos-Modus je Runde |
| Byline | Autorenzeile, Author Line, Autorenbox | Zeile mit Foto oder Initialen, Name, Lesezeit und Datum unter dem Titel eines Blog-Artikels und klein in Karten (Gruppe Byline, I15 22.11.2026). Im Fließtext der App „Autorenzeile“ erlaubt |
| Teilen-Leiste | Share Bar, Aktionsleiste, Social Bar | Leiste mit Haarlinien und den Knöpfen Teilen, LinkedIn, E-Mail und Link kopieren im Kopf eines Blog-Artikels (Gruppe Teilen-Leiste, I15 22.11.2026); kein Merken, keine Zähler |
| Blase an der Textstelle | Popover, Share-Popover, Tooltip, Highlight-Menü | kleine dunkle Fläche mit „Zitat teilen“ und „Link kopieren“ über einer markierten Stelle im Artikel (Teilen-Leiste › Blase an der Textstelle, I15 22.11.2026); nicht die Komponente Popover |
| Blog-Artikel | Blog Article, Artikel-Template, Lesefokus | Template-Variante `t-article--blog` für die Artikelseite des Blogs (Gruppe Blog-Artikel, I15 22.11.2026) |
| Spaltenbreite (Zeichen je Zeile) | Measure, Zeilenlänge, max-width | Breite der Textspalte im Blog-Artikel (Vorgabe 52ch, gemessen rund 65 Zeichen je Zeile) |
| Überstand (Hauptbild) | Bleed, Breakout | so viel ist das Hauptbild je Seite breiter als die Textspalte; auf schmalen Breiten 0 |
| Zitat teilen | Share quote, Quote teilen, Highlight teilen | Knopf in der Blase an der Textstelle: teilt die markierte Stelle in Anführungszeichen mit der Adresse samt Textstelle (Web Share, sonst LinkedIn; Behavior share-bar, I15 22.11.2026) |
| Link kopieren · Link kopiert | Copy link, URL kopieren, Kopiert! | Knopf der Teilen-Leiste und der Blase; nach Erfolg heißt er 2 s „Link kopiert“ und die Statuszeile meldet es. Fehler: „Link konnte nicht kopiert werden. Bitte kopieren Sie die Adresse aus der Adresszeile.“ (I15 22.11.2026) |
| Artikel teilen | Share article, Beitrag teilen | Name (aria-label) der Teilen-Leiste für Screenreader (I15 22.11.2026) |
| Textstelle teilen | Share selection, Auswahl teilen | Name (aria-label) der Blase an der Textstelle für Screenreader (I15 22.11.2026) |
| Adresse mit Textstelle | Text-Fragment, Deep Link, Scroll-to-Text | Link, der beim Öffnen zur markierten Stelle springt und sie hervorhebt (`#:~:text=`); im Fließtext so nennen, „Text-Fragment“ nur bei „Technische Namen zeigen“ |
| Magazin (Darstellung) | Magazine Layout, Blog-Layout, Editorial | Darstellung des Content Feeds für die Blog-Startseite: Kopf mit RSS-Link, Aufmacher, zwei Nebenbeiträge, darunter „Neueste Artikel“ als Raster (Content Feed › Magazin, I15 22.11.2026); Gegenstück „Standard“ |
| Aufmacher | Hero-Artikel, Featured Post, Lead Story | der große Beitrag links oben im Magazin, mit Bild, Teaser und Byline (Artikel mit „Hervorgehoben“, sonst der neueste); nicht die „große erste Karte“ des Standard-Feeds |
| Nebenbeitrag | Side Post, Teaser, Secondary | einer der zwei kleineren Beiträge rechts neben dem Aufmacher, mit kleinem Bild, Kategorie, Titel, Lesezeit und Datum |
| Kategorie-Reiter | Tabs, Filter-Tabs, Pills | die Filterreiter des Content Feeds, im Magazin je Blog-Kategorie (Content Feed › Magazin, I15 22.11.2026) |
| Zwischentitel | Subheading, H3, Zwischenüberschrift | die Überschrift „Neueste Artikel“ zwischen Aufmacher und Raster im Magazin |
| RSS-Feed | Feed, News-Feed, Atom | Adresse, unter der Feed-Leser neue Blog-Artikel abholen; Link im Kopf „Als RSS-Feed abonnieren“ |
| Entwurf | „Recipe im Status draft“ | Kennzeichen; „Recipe“ nur mit technischen Namen |
| Gesperrt / Bearbeitbar, Version | Locked, Unlocked | Sperre einer Komponente |
| Variante: NEO · Kunde | Theme-Set, Neo / Customer | nur im lokalen Betrieb (Entscheidung E3); wählt die Variante **innerhalb** eines Themes. Weitere Kunden = weitere Themes. In Drupal unsichtbar. |

## Aktionen und Status

| Neu | Ersetzt |
|---|---|
| Neues Theme | New |
| Speichern | Save |
| Exportieren (ein Einstieg; darunter „Für Entwickler: JSON, CSS, DTCG“) | Export, Export JSON |
| Rückgängig / Wiederholen | Undo, Redo |
| Veröffentlichen | Publish |
| Auf der Website aktivieren | Aktivieren |
| Vorschau von „‹Theme›“ auf der Website (Schalter) | Vorschau an / Vorschau aus |
| Als Besucher ansehen · Zurück zur Vorschau (Links in der Leiste auf der Website, R04) | privates Fenster öffnen |
| Besucheransicht (Leiste, gestrichelt) | – |
| Gespeichert · Ungespeicherte Änderungen · Wird gespeichert … · Lädt … | gemischte Zustände |
| Nur Ansicht | „Nicht in Drupal gespeichert“ im Ansichtsmodus |
| Von anderer Person geändert | Konflikt |
| Zusammenführen · Arbeitsstand (nur lokal) | Merge, Branch, main |
| Mehr … (Menü rechts in der Kopfleiste, R05; Gruppe „Weitere Aktionen“) | Overflow, ⋯-Menü, Weitere |

## Navigation und Bereichsnamen

Eine Quelle für Seitenleiste, Breadcrumb, Kopf der Einstellungen und
Seitentitel („‹Bereich› – Theme-Konfigurator“).

| Neu | Ersetzt |
|---|---|
| Grundlagen | Foundation |
| Raster | Grid |
| Farben | Color |
| Flächen | Surfaces |
| Abstände | Spacing |
| Größen | Sizes |
| Typografie | Typography |
| Eckenradien | Radii, Border Radius |
| Rahmen | Border |
| Fokusring | Focus Ring |
| Seitenverhältnisse | Media Ratios |
| HTML-Elemente | Elements |
| Icons | – |
| Themes | – |
| Schatten | Shadow & Elevation, Shadows, Erhebung |
| Deckkraft, Ebenen und Bewegung | Opacity, Z-Index & Motion |
| Präsentation · Seitenvorlagen · Muster | – |
| Objekte · Atome · Moleküle · Organismen | Objects, Atoms, Molecules, Organisms (Entscheidung E4) |

Abschnitte in den Einstellungen einer Komponente:

| Neu | Ersetzt |
|---|---|
| Größe und Abstände | Position & Layout |
| Farben | Fill |
| Schrift | Typography |
| Effekte und Zustände | Effects & States |
| Weitere Einstellungen | Advanced |
