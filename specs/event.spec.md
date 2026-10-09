# event Component Spec
> Version 1.4.2 | Status: stable | Layer: organism

Tags: `aufgenommen`, `organisms`

## Anatomy
Root element: `.nc-event`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| hero | `.nc-event__hero` | Yes | Abschnitt 1, <section>: dunkler Kopf (always-dark, Text always-light), mindestens 400 px hoch, Inhalt unten ausgerichtet. |
| hero--has-media | `.nc-event__hero--has-media` | No | Modifier am Hero, den Drupal mit Titelbild setzt (field_event_image) — ohne eigene Regel; Bild und Verlauf liegen absolut darin. |
| hero-media | `.nc-event__hero-media` | No | Titelbild (field_event_image), absolut, object-fit cover; <img> mit alt = Titel des Events, loading eager. |
| hero-overlay | `.nc-event__hero-overlay` | No | Verlauf ueber dem Titelbild (always-dark 80 % unten bis 10 % oben); nur mit Bild. |
| hero-content | `.nc-event__hero-content` | Yes | Inhalt des Heros auf .nc-container: Flex-Spalte mit Tags, Titel, Untertitel, Meta und Knoepfen. |
| tags | `.nc-event__tags` | No | Tag-Zeile; das Template gibt sie immer aus, ohne Typ, Format und Sprache bleibt sie leer. |
| tag | `.nc-event__tag` | No | Tag (Format = field_event_location_type, Sprache = field_event_language): caption, Versalien, halbtransparente helle Flaeche. |
| tag--type | `.nc-event__tag--type` | No | Gattungs-Tag (field_event_type): inverse Flaeche (background-inverse, text-inverse). |
| title | `.nc-event__title` | Yes | Titel (<h1> mit dem Knotentitel): display-m bold; im Hero erbt er always-light. |
| subtitle | `.nc-event__subtitle` | No | Untertitel (field_event_subheadline), body-l, Deckkraft prominent. |
| meta | `.nc-event__meta` | No | Zeile mit Datum, Uhrzeit (beide aus field_event_date/_end) und Ort (field_event_location); das Template gibt sie immer aus, ohne Werte bleibt sie leer. |
| meta-item | `.nc-event__meta-item` | No | Eintrag mit Strich-Icon (SVG, 18 px) und Text, body-s. |
| cta | `.nc-event__cta` | Yes | Knopfzeile: nc-button--accent --lg (field_event_cta_text, Vorgabe „Anmelden"; Ziel field_event_cta_url, sonst #event-signup), mit Video-URL dazu nc-button--outline --lg „Aufzeichnung ansehen" (neues Fenster). Der Outline-Knopf nimmt im Hero die Farben des Heros (Schrift always-light, Schleier beim Ueberfahren). |
| content-grid | `.nc-event__content-grid` | No | Abschnitt 2 (nur mit Body): Raster, ab 768 px 1fr | 360 px — links Beschreibung, rechts Infokarte. |
| description | `.nc-event__description` | No | Linke Spalte (u-prose): h2 „Über dieses Event" und Body — ohne eigene Regel. |
| sidebar | `.nc-event__sidebar` | No | <aside id="event-signup">, rechte Spalte um die Infokarte (Sprungziel des Anmeldeknopfs) — ohne eigene Regel. |
| info-card | `.nc-event__info-card` | No | Infokarte: background-secondary, radius-md, sticky unter der Navigation (--nav-height). |
| info-card-title | `.nc-event__info-card-title` | No | Titel der Infokarte (<h3> „Event Details"), heading-s bold. |
| info-list | `.nc-event__info-list` | No | <dl> mit Datum, Uhrzeit, Format, Ort, Sprache, Typ, Kategorie (je nur mit Wert); dt text-secondary. |
| info-cta | `.nc-event__info-cta` | No | Knopf der Infokarte (nc-button--accent, volle Breite), nur mit CTA-Text. |
| section-title | `.nc-event__section-title` | No | Abschnittstitel (<h2>) von Agenda und weiteren Events, heading-l bold. |
| agenda | `.nc-event__agenda` | No | Abschnitt 3 (nur mit field_event_agenda): formatierter Text (u-prose, max. 800 px) in nc-section nc-section--muted. |
| related-grid | `.nc-event__related-grid` | No | Abschnitt 4 (nur mit Treffern: bis zu drei Events desselben Typs): Raster auto-fill, Spur mindestens 300 px, hoechstens die Rasterbreite. |
| related-card | `.nc-event__related-card` | No | Karte eines weiteren Events: a.nc-card.nc-card--navigational mit Kicker (Typ), h3, Datum und Fusszeile „Mehr erfahren"; Rahmen border-secondary. |

### DOM Notes
- Website: node--event--full.html.twig rendert <article class="nc-event"> mit bis zu vier Abschnitten — Hero (immer), Details mit Infokarte (nur mit Body), Agenda (nur mit field_event_agenda, nc-section--muted), weitere Events (nur mit Treffern). Die Werte kommen aus neo_fe_preprocess_node (event.*).
- Der Hero ist in jedem Seitenthema dunkel (always-dark, Text always-light); Titel und Tags sind darauf abgestimmt. Ohne Titelbild bleibt die Flaeche schwarz.
- Das Template gibt an den Tags noch nc-event__tag--format und nc-event__tag--lang aus; das DS hat beide gestrichen (Entscheidung event-klassen, 06.10.2026) — sie wirken nicht, die Anpassung im Theme steht aus.
- Ueberschriften: h1 (Titel), h2 (Beschreibung, Agenda, weitere Events), h3 (Infokarte, Karten). Die Arena zeigt den Titel als h2, weil der Konfigurator die Seitenueberschrift selbst traegt.
- Verhalten: keins — Sprungziel #event-signup ist ein gewoehnlicher Anker; die Infokarte klebt per position: sticky.

## Variants
### Variant (`variant`)
Einzige Variante — Teile kommen und gehen mit den Feldern (Specimens hero-bild, infokarte, minimal).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-event`

### Alle
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-event-tag-padding` | — | — |
| `--nc-event-tag-letter-spacing` | — | — |
| `--nc-event-title-line-height` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Eine h1 je Seite (Titel im Hero); Abschnitte mit h2, Infokarte und Karten mit h3.
- Hero-Text always-light auf always-dark (gemessen 21:1, Gattungs-Tag 17:1) — unabhaengig vom Seitenthema; mit Titelbild sichert der Verlauf den unteren Bereich.
- Outline-Knopf im Hero: Schrift always-light in jedem Seitenthema (21:1; vorher im hellen Theme 1,18:1).
- Titelbild: das Template setzt alt = Titel des Events, der direkt darunter als h1 steht — Screenreader lesen ihn doppelt; das Bild ist dekorativ (alt="" waere richtig, Aenderung im Theme).
- Icons in Meta und Karten sind SVG ohne Text und ohne aria-hidden; der Sinn steht im Text daneben.
- Die Infokarte ist eine <aside> ohne Namen; ihr Titel „Event Details" benennt sie sichtbar.
- Karten weiterer Events sind ganze Links (<a class="nc-card">) mit h3 als Namen.

## Web Components Mapping
Derived from anatomy for potential `<nc-event>` custom element:

```js
class NcEvent extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="hero">, <slot name="hero-content">, <slot name="title">, <slot name="cta">
}
```

---

*Generated from `data/event-recipe.json` by `scripts/generate-component-specs.js`*
