# ADR-005: Komposition im Recipe, Verhalten als gemeinsames Paket

- **Status:** angenommen; Phase 1 umgesetzt, Phase 2 begonnen (Plan v3)
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
