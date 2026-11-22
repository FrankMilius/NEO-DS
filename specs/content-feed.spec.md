# content-feed Component Spec
> Version 1.3.0 | Status: stable | Layer: organism

Tags: `organisms`, `content`, `cards`, `feed`, `website`

## Anatomy
Root element: `.nc-content-feed`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| head | `.nc-content-feed__head` | No | Ueberschrift der Sektion und „Alle anzeigen“ (.nc-link-with-arrow). Entfaellt der Link, bleibt nur die Ueberschrift. |
| filters | `.nc-content-feed__filters` | No | <nav aria-label="<Ueberschrift> filtern"> mit Filterreitern als Links (.nc-chip); der aktive traegt .nc-chip--selected und aria-current="page". Der Name enthaelt die Ueberschrift, damit zwei Feeds auf einer Seite unterscheidbar bleiben (axe landmark-unique). Fehlt, wenn die Uebersichtsseite ausgeschaltet ist. |
| intro | `.nc-content-feed__intro` | No | Nur Magazin: Titel und Einleitung im Kopf. Darin <h2 class="nc-content-feed__heading"> (Titel, z. B. „Innovation Blog“) und <p class="nc-content-feed__intro-text"> (Einleitung). Klassennamen bewusst ohne __title und __lead (Blockstufen-Regeln R14). |
| rss | `.nc-content-feed__rss` | No | Nur Magazin: Link „Als RSS-Feed abonnieren“ mit Tabler-Icon rss (aria-hidden) auf den Feed des Blogs, im Kopf rechts neben Titel und Einleitung. |
| top | `.nc-content-feed__top` | No | Nur Magazin: <ul class="nc-content-feed__top nc-card-grid"> mit dem Aufmacher und zwei Nebenbeitraegen; ab 640px Containerbreite nebeneinander, darunter gestapelt; ein Nebenbeitrag hat das Bild links, sobald er selbst mindestens 280px breit ist (card-min), sonst oben. |
| feature | `.nc-content-feed__feature` | No | Nur Magazin: <li> mit dem Aufmacher — Vorschau-Karte (.nc-card--preview) mit Bild, Kategorie als Kicker, Titel, Teaser und .nc-byline--sm, ohne Fuss. |
| side | `.nc-content-feed__side` | No | Nur Magazin: <li> je Nebenbeitrag — Vorschau-Karte mit kleinem quadratischem Bild links, Kategorie, Titel und „Lesezeit · Datum“ in .nc-card__meta, ohne Fuss. |
| subhead | `.nc-content-feed__subhead` | No | Nur Magazin: Zwischentitel „Neueste Artikel“ (<h3>) zwischen Aufmacher und Raster. |
| list | `.nc-content-feed__list` | Yes | <ul> zusammen mit .nc-card-grid und .nc-card-grid--cols-2|3|4. Je <li> eine .nc-card. |
| lead | `.nc-content-feed__item--lead` | No | Erstes <li>: grosse Karte .nc-card--preview.nc-card--featured ueber die ganze Breite. |
| date-badge | `.nc-card__date-badge` | No | <time datetime> mit .nc-card__date-badge-day und Monat; im Bild oben links, ohne Bild im Inhalt. |
| footer | `.nc-content-feed__footer` | No | „Mehr laden“ als <a class="nc-button nc-button--secondary" data-feed-more> auf die naechste Seite; mit Skript haengt das Behavior content-feed die Karten an. Dazu im Feed eine Statuszeile <p class="u-sr-only" role="status" aria-live="polite" data-feed-geladen="{anzahl} weitere Beitraege geladen">. |

### DOM Notes
- Die ganze Karte ist ein Link (<a class="nc-card nc-card--navigational">), Bild alt="" und loading="lazy". Externe News: target="_blank" rel="noopener noreferrer" und der schraege Pfeil im Fuss. Wischleiste ohne tabindex: die Karten-Links sind fokussierbar und scrollen beim Fokus ins Bild.
- Bilder einfaerben (I13): data-medien-ton="gruen|aqua|lime|forest" an .nc-content-feed__list faerbt alle Kartenbilder des Feeds (Regel und Toene: card, „Bilder einfaerben“), auch die grosse erste Karte und nachgeladene Karten. Ohne Attribut bleiben die Bilder im Original. Drupal: Feld „Bilder einfaerben“ am Feed-Block, fuer die Uebersichtsseite die Einstellung der Aktuelles-Bereiche.
- Magazin (I15 Phase 2): Reiter sind die Blog-Kategorien als Links (?kategorie=<id>), wie die Filterreiter ohne JavaScript nutzbar. In den Karten steht die Kategorie im Kicker, Lesezeit und Datum in .nc-card__meta. Bilder einfaerben: data-medien-ton an .nc-content-feed__list und an .nc-content-feed__top.

## Variants
### Darstellung (`display`)
Standard (Aktuelles: grosse erste Karte, Raster, schmal Wischleiste) oder Magazin (Blog-Startseite: Kopf mit RSS-Link, Aufmacher, zwei Nebenbeitraege, Zwischentitel, Raster; schmal gestapelt).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| standard | — |  |
| magazin | `.nc-content-feed--magazin` |  |

### Spalten (`columns`)
Hoechstzahl der kleinen Karten je Zeile (ohne Angabe fuellt .nc-card-grid nach Mindestbreite auf); schmalere Container brechen ueber .nc-card-grid--cols-* um.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| 2 | `.nc-card-grid--cols-2` |  |
| 3 | `.nc-card-grid--cols-3` |  |
| 4 | `.nc-card-grid--cols-4` |  |
| auto | — |  |

### Erste Karte (`lead`)
Erste Karte gross ueber die ganze Breite oder wie die anderen.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| featured | — |  |
| none | — |  |

## States
Supported: `default`, `hover`, `focus`

## CSS Token API
Base classes: `nc-content-feed`

### Abstände
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-content-feed-gap` | — | — |
| `--nc-content-feed-filter-gap` | — | — |

### Wischleiste (Handy)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-content-feed-track-item` | — | — |
| `--nc-content-feed-track-gap` | — | — |

### Magazin
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-content-feed-magazin-title-size` | — | — |
| `--nc-content-feed-magazin-intro-color` | — | — |
| `--nc-content-feed-magazin-intro-width` | — | — |
| `--nc-content-feed-magazin-rule-width` | — | — |
| `--nc-content-feed-magazin-rule-color` | — | — |
| `--nc-content-feed-magazin-feature-width` | — | — |
| `--nc-content-feed-magazin-feature-title-size` | — | — |
| `--nc-content-feed-magazin-top-gap` | — | — |
| `--nc-content-feed-magazin-side-gap` | — | — |
| `--nc-content-feed-magazin-side-media-size` | — | — |
| `--nc-content-feed-magazin-side-title-size` | — | — |
| `--nc-content-feed-magazin-subhead-size` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | focus-next | Filterreiter, Karten und „Mehr laden“ in Dokumentreihenfolge. In der Wischleiste scrollt der Browser die fokussierte Karte ins Bild. |
| `Enter` | activate | Auf „Mehr laden“ (Link): laedt die naechste Seite nach, der Fokus springt auf die erste neue Karte. Ohne JavaScript oeffnet der Link die naechste Seite. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `content-feed-mehr` | Yes | `{"anzahl":"number","ende":"boolean"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Filterreiter in <nav aria-label="<Ueberschrift> filtern">, aktiver Reiter mit aria-current="page"
- Wischleiste nur mit fokussierbaren Karten (scrollable-region-focusable)
- Datums-Abzeichen als <time datetime>
- „Mehr laden“: Fokus auf die erste neue Karte, Anzahl in [role="status"], aria-busy an der Liste waehrend des Ladens
- Magazin: Titel als Ueberschrift mit aria-labelledby an der Sektion, Zwischentitel „Neueste Artikel“ als <h3>, RSS-Symbol aria-hidden (der Linktext traegt den Namen), Fokusring am RSS-Link

## Web Components Mapping
Derived from anatomy for potential `<nc-content-feed>` custom element:

```js
class NcContentFeed extends HTMLElement {
  static observedAttributes = ['display', 'columns', 'lead'];
  // Slots: <slot name="list">
}
```

---

*Generated from `data/content-feed-recipe.json` by `scripts/generate-component-specs.js`*
