# content-feed Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `organisms`, `content`, `cards`, `feed`, `website`

## Anatomy
Root element: `.nc-content-feed`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| head | `.nc-content-feed__head` | No | Ueberschrift der Sektion und „Alle anzeigen“ (.nc-link-with-arrow). Entfaellt der Link, bleibt nur die Ueberschrift. |
| filters | `.nc-content-feed__filters` | No | <nav aria-label="<Ueberschrift> filtern"> mit Filterreitern als Links (.nc-chip); der aktive traegt .nc-chip--selected und aria-current="page". Der Name enthaelt die Ueberschrift, damit zwei Feeds auf einer Seite unterscheidbar bleiben (axe landmark-unique). Fehlt, wenn die Uebersichtsseite ausgeschaltet ist. |
| list | `.nc-content-feed__list` | Yes | <ul> zusammen mit .nc-card-grid und .nc-card-grid--cols-2|3|4. Je <li> eine .nc-card. |
| lead | `.nc-content-feed__item--lead` | No | Erstes <li>: grosse Karte .nc-card--preview.nc-card--featured ueber die ganze Breite. |
| date-badge | `.nc-card__date-badge` | No | <time datetime> mit .nc-card__date-badge-day und Monat; im Bild oben links, ohne Bild im Inhalt. |
| footer | `.nc-content-feed__footer` | No | „Mehr laden“ als <a class="nc-button"> auf die naechste Seite; mit Skript haengt das Behavior feed-more die Karten an. |

### DOM Notes
- Die ganze Karte ist ein Link (<a class="nc-card nc-card--navigational">), Bild alt="" und loading="lazy". Externe News: target="_blank" rel="noopener noreferrer" und der schraege Pfeil im Fuss. Wischleiste ohne tabindex: die Karten-Links sind fokussierbar und scrollen beim Fokus ins Bild.

## Variants
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

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | focus-next | Keine eigene Bedienung: Filterreiter, Karten und „Mehr laden“ in Dokumentreihenfolge. In der Wischleiste scrollt der Browser die fokussierte Karte ins Bild. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Filterreiter in <nav aria-label="<Ueberschrift> filtern">, aktiver Reiter mit aria-current="page"
- Wischleiste nur mit fokussierbaren Karten (scrollable-region-focusable)
- Datums-Abzeichen als <time datetime>

## Web Components Mapping
Derived from anatomy for potential `<nc-content-feed>` custom element:

```js
class NcContentFeed extends HTMLElement {
  static observedAttributes = ['columns', 'lead'];
  // Slots: <slot name="list">
}
```

---

*Generated from `data/content-feed-recipe.json` by `scripts/generate-component-specs.js`*
