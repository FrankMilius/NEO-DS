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
| Stufe (50–950) | Shade, 5-%-Schritt | eine der 11 Abstufungen einer Palette, wie die Website sie nutzt |
| Farbrollen (Ebene 2) | Semantic Colors, Semantik, Bedeutungen | Rollen wie Text, Fläche, Rahmen; verweisen auf Grundfarben |
| Komponentenwerte (Ebene 3) | Level L3, Component Tokens | Werte einzelner Komponenten |
| Hell · Dunkel · Nebeneinander · Alle vier | Light, Dark, Split, Matrix | Vorschaumodi |
| App-Darstellung: Hell · Dunkel · Wie System | Dark Mode, Light Mode, App-Theme | Schalter rechts in der Kopfleiste (R03, 20.10.2026); färbt nur die Oberfläche der App, nicht die Bühne. Nie nur „Hell/Dunkel“ ohne „App-Darstellung“, damit es nicht mit den Vorschaumodi verwechselt wird |
| Bühne | Arena, Theme Arena, Laboratory, Labor | mittlere Vorschaufläche |
| Einstellungen | Inspector | rechte Spalte (Entscheidung E2) |
| Vorschau | Specimen | eine Vorschau auf der Bühne |
| Hilfslinien | Outline, Debug-Rahmen | Schalter auf der Bühne bei Objekten: Kanten und Maße über dem echten Inhalt |
| Muster · Auf der Seite | Specimen, Kontext | Ansicht einer Grundlage auf der Bühne: Kacheln je Wert oder Website-Ausschnitt mit Markierungen, wo der Wert wirkt |
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
| Gespeichert · Ungespeicherte Änderungen · Wird gespeichert … · Lädt … | gemischte Zustände |
| Nur Ansicht | „Nicht in Drupal gespeichert“ im Ansichtsmodus |
| Von anderer Person geändert | Konflikt |
| Zusammenführen · Arbeitsstand (nur lokal) | Merge, Branch, main |

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
