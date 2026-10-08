# events Component Spec
> Version 1.2.1 | Status: stable | Layer: organism

Tags: `aufgenommen`, `organisms`

## Anatomy
Root element: `.nc-events`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| filter-bar | `.nc-events__filter-bar` | Yes | Filterleiste: Flex-Zeile mit Umbruch — Suchfeld und drei Auswahlen (Typ, Kategorie, Jahr). |
| search | `.nc-events__search` | Yes | Huelle des Suchfelds: waechst (flex 1 1 250px), mindestens 200 px. |
| search-wrapper | `.nc-events__search-wrapper` | Yes | Bezugsrahmen fuer das Lupen-Icon. |
| search-icon | `.nc-events__search-icon` | Yes | Lupe (SVG, 18 px), absolut links im Feld, text-tertiary; dekorativ. |
| search-input | `.nc-events__search-input` | Yes | <input type="search" data-events-search>, 44 px hoch, Platzhalter „Events durchsuchen…"; Fokus: Rahmen interactive-focus plus 2-px-Schein. |
| filter-select | `.nc-events__filter-select` | Yes | <select data-events-filter="type|category|year">, 44 px hoch, mindestens 160 px; Optionen fuellt das Skript. |
| results-count | `.nc-events__results-count` | Yes | Trefferzahl („N Events gefunden"), body-s, text-tertiary; Text setzt das Skript. |
| grid | `.nc-events__grid` | Yes | Raster der Karten (data-events-grid): auto-fill, Spur mindestens 300 px (hoechstens die Rasterbreite), gap spacing-05. |
| card | `.nc-events__card` | No | Karte, vom Skript gebaut: <a href> (ganze Karte ist der Link), Rahmen border-secondary, Radius md; Hover: Schatten sm, Rahmen border-primary, 2 px angehoben. |
| card-header | `.nc-events__card-header` | No | Kopf der Karte (waechst): Typ, Titel, ggf. Untertitel, Meta. |
| card-type | `.nc-events__card-type` | No | Gattung (Taxonomie-Name, solange er nicht geladen ist die Term-ID): caption, Versalien, interactive-default. Das Skript setzt das <span> immer, auch leer. |
| card-title | `.nc-events__card-title` | No | Titel (<h3>), heading-s bold. |
| card-meta | `.nc-events__card-meta` | No | Zeile mit Datum, Uhrzeit und Ort (je nur mit Wert), caption, text-secondary, unten im Kopf. |
| card-meta-item | `.nc-events__card-meta-item` | No | Eintrag, Datum und Uhrzeit mit Strich-Icon (14 px), Ort ohne. |
| card-footer | `.nc-events__card-footer` | No | Fusszeile „Mehr erfahren" mit Pfeil, Trennlinie oben, caption, text-secondary. |
| empty | `.nc-events__empty` | No | Leerzustand (data-events-empty, <p> mit Text): steht im Template, per hidden versteckt, solange es Treffer gibt; bei Ladefehler „Fehler beim Laden der Events." |
| load-more | `.nc-events__load-more` | No | Huelle des Knopfs „Mehr laden" (nc-button--secondary, data-events-load-btn): per hidden versteckt, wenn alle Treffer stehen. |

### DOM Notes
- Website: block--block-content/inline-block--neo-events-listing.html.twig (identisch) und die Canvas-Komponente neo-events-listing geben <section class="nc-section"><div class="nc-container" data-neo-events-listing …> mit Filterleiste, Trefferzahl, leerem Raster, Leerzustand und „Mehr laden" aus. Eine Wurzel .nc-events gibt es dort nicht; die Arena setzt sie als Recipe-Wurzel.
- Verhalten (Drupal.behaviors.neoEventsListing, js/neo-theme.js — nicht im DS): laedt /api/events?_format=json, sortiert nach Datum absteigend, fuellt die Auswahlen (Term-Namen per JSON:API nachgeladen), filtert bei change bzw. Eingabe (300 ms Verzug), zeigt 16 Karten je Schritt; „Mehr laden" haengt weitere an. Leerzustand und „Mehr laden" schaltet es per hidden.
- Karte (createCard): optionaler Untertitel als <p> mit Inline-Stil (font-size var(--fs-sm), text-secondary) — ohne eigene Klasse.
- Die Canvas-Komponente bringt eigene CSS (neo-events-listing.css) mit abweichenden Werten mit; massgeblich fuer die Layout-Builder-Bloecke ist die DS-Regel.

## Variants
### Variant (`variant`)
Einzige Variante — Leerzustand und Teile per Specimen (leer, nur-raster).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`, `hover`

## CSS Token API
Base classes: `nc-events`

### Alle
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-events-card-type-letter-spacing` | — | `--mod-events-card-type-letter-spacing` |
| `--nc-events-card-title-line-height` | — | `--mod-events-card-title-line-height` |
| `--nc-events-card-meta-item-gap` | — | `--mod-events-card-meta-item-gap` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Suchfeld und Auswahlen brauchen einen zugaenglichen Namen — das Template gibt keinen aus (nur Platzhalter bzw. erste Option); aria-label oder <label class="u-sr-only"> im Theme ergaenzen (die Arena zeigt aria-label).
- Die Trefferzahl aendert sich ohne Ankuendigung — aria-live="polite" am Element waere noetig, damit Filter und Suche hoerbar wirken.
- Jede Karte ist ein Link mit h3 als Namen; Icons ohne Text (Lupe, Kalender, Uhr, Pfeil) sind dekorativ und tragen im Skript kein aria-hidden.
- Kontrast: Gattung, Meta, Fusszeile und Trefferzahl gemessen ab 5,75:1 (hell und dunkel).
- „Mehr laden" ist ein <button>; neue Karten erscheinen hinter den alten, der Fokus bleibt am Knopf.

## Web Components Mapping
Derived from anatomy for potential `<nc-events>` custom element:

```js
class NcEvents extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="filter-bar">, <slot name="search">, <slot name="search-wrapper">, <slot name="search-icon">, <slot name="search-input">, <slot name="filter-select">, <slot name="results-count">, <slot name="grid">
}
```

---

*Generated from `data/events-recipe.json` by `scripts/generate-component-specs.js`*
