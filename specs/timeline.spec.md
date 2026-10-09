# timeline Component Spec
> Version 2.3.0 | Status: stable | Layer: molecule

Tags: `chronological`, `content`, `layout`, `process`, `scroll`, `steps`

## Anatomy
Root element: `.nc-timeline`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| item | `.nc-timeline__item` | Yes | — |
| node | `.nc-timeline__node` | Yes | — |
| content | `.nc-timeline__content` | Yes | — |
| time | `.nc-timeline__time` | No | — |
| title | `.nc-timeline__title` | Yes | — |
| description | `.nc-timeline__description` | No | — |
| fill | `.nc-timeline--alternating::after` | No | Fortschrittsfuellung der Linie als Pseudo-Element (ein echtes Element waere in der <ol> ungueltiges Markup). Hoehe via --nc-timeline-progress. |
| period | `.nc-timeline__period` | No | Zeitraum-Badge, z. B. "Woche 1-2". |
| badge | `.nc-timeline__badge` | No | Frei beschriftbares Status-Badge, Farbton via cardTone. |
| phase | `.nc-timeline__phase` | No | Kleine Phasen-Auszeichnung ueber dem Titel, z. B. "Phase 1". |
| lead | `.nc-timeline__lead` | No | Hervorgehobener Einleitungssatz unter dem Titel. |
| list | `.nc-timeline__list` | No | Stichpunktliste der Phaseninhalte. |
| cta | `.nc-timeline__cta` | No | Optionaler Button am Kartenende. Wird nur gerendert, wenn Beschriftung UND Ziel gepflegt sind. |

### DOM Notes
- <ol> fuer chronologisch geordnete Eintraege — semantische Reihenfolge.
- Item: CSS-Grid (auto + 1fr), vertikale Linie via ::before Pseudo-Element.
- Letzes Item: ::before display:none — keine Linie nach unten.
- Node: Kreis auf der Linie (12px default), z-index: base (ueberdeckt Linie).
- Node-Varianten: --active (interactive-default), --success (feedback-success), --danger (feedback-danger).
- Zeitangabe in <time datetime='...'> fuer maschinenlesbare Daten.
- font-variant-numeric: tabular-nums auf __time fuer gleichbreite Ziffern.
- Icon-Variante: Groessere Nodes (32px) mit SVG-Icon, Linie verschoben.
- Connected-Variante: Content bekommt Card-Hintergrund (layer-01 + border + radius).
- Compact-Variante: Kleinere Nodes (8px), weniger Abstand.
- alternating: 3-Spalten-Grid (1fr / Node / 1fr), Items wechseln per :nth-child die Seite.
- Fortschritt: JS setzt --nc-timeline-progress (0-1) auf dem Wurzelelement; CSS skaliert die Fuellung daraus.
- Ohne JS und bei prefers-reduced-motion sind alle Items sofort sichtbar (kein opacity:0-Startzustand).
- Icons stammen aus der Heroicons-Sammlung des DS und erben currentColor.
- horizontal: der scrollende Bereich traegt tabindex="0" + role="group" + aria-label, damit er per Tastatur bedienbar bleibt (WCAG 2.1.1).
- Kartentitel (h3) nutzt --nc-timeline-card-title-size (= heading-m / --fs-xl), NICHT den kompakten Basis-Token --nc-timeline-title-size (--fs-sm).
- Animiert wird die KARTE (.nc-timeline__content), nicht das Item - sonst wandert der Node mit und loest sich von der Linie.
- Der Node darf kein margin-top tragen: das Basis-Mixin setzt 2px fuer die kompakte Timeline, was ihn in alternating/horizontal aus der Kartenmitte schiebt und im horizontalen Layout die Linie verfehlen laesst.
- horizontal: Node per align-self:center mittig ueber der Karte, damit die Linie durch die Kartenmitten laeuft.
- Die Fortschrittsfuellung nutzt einen Verlauf mit transparenten Enden, damit sie nicht hart abgeschnitten wirkt.
- CTA wird nur gerendert, wenn label UND url gesetzt sind - ein Link ohne erkennbares Ziel waere fuer Screenreader wertlos. Unbekannte Varianten fallen im Preprocess auf primary zurueck.
- Die Slots 6-12 trugen bis zum 24.08.2026 `selector`/`required` statt `element`/`optional` — eine zweite Konvention in derselben Datei, angelegt beim Ausbau der Zeitleiste. Damit fehlten sie jeder Pruefung, die `element` liest.

## Variants
### Variant (`variant`)
Visuelle Variante — default (kleine Punkte), icon (grosse Nodes mit Icon), connected (Card-Hintergrund), compact (minimal)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| icon | `.nc-timeline--icon` |  |
| connected | `.nc-timeline--connected` |  |
| compact | `.nc-timeline--compact` |  |

### Node Status (`nodeStatus`)
Status des Node-Punktes — default (neutral), active (primaer), success (Erfolg), danger (Fehler)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| active | — |  |
| success | — |  |
| danger | — |  |

### Layout (`layout`)
single = einspaltig (Linie links). alternating = Zickzack, Linie mittig. horizontal = Karten nebeneinander, Bereich scrollt seitlich mit Scroll-Snap. Unter 860px fallen alternating UND horizontal auf gestapelt zurueck.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| single | — | Yes |
| alternating | — |  |
| horizontal | — |  |

### Progress (`progress`)
off = statische Linie. scroll = Linie fuellt sich beim Scrollen, Items blenden ein. Bei prefers-reduced-motion und ohne JS ist alles sofort sichtbar.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| off | — | Yes |
| scroll | — |  |

### Card Status Tone (`cardTone`)
Farbton des frei beschriftbaren Status-Badges. Alle Toene sind bei 8% Tint in Light UND Dark auf >=4.5:1 geprueft.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| accent | — |  |
| info | — |  |
| warning | — |  |
| danger | — |  |
| neutral | — | Yes |

### Header Alignment (`headerAlign`)
Ausrichtung des Section-Kopfes. Nutzt die zentralen Modifier .nc-section-header--center / --right; left ist der modifier-freie Default.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| left | — | Yes |
| center | — |  |
| right | — |  |

### Card CTA Variant (`ctaVariant`)
Button-Variante des optionalen Karten-CTA. Angeboten sind nur die Varianten, die auf einer Kartenflaeche in BEIDEN Themes tragen. Die Feedback-Toene (success/warning/error/info) signalisieren Zustand statt Aktion, inverted ist fuer dunkle Flaechen gedacht - beide bewusst nicht angeboten. Groesse ist md: ein Karten-CTA liegt eine Ebene unter dem Block-Primaer-CTA (P6: lg).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| primary | — | Yes |
| secondary | — |  |
| accent | — |  |
| outline | — |  |
| ghost | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-timeline`

### Line
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-timeline-line-color` | — | `--mod-timeline-line-color` |
| `--nc-timeline-line-width` | — | `--mod-timeline-line-width` |
| `--nc-timeline-gap` | — | — |

### Node
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-timeline-node-size` | — | `--mod-timeline-node-size` |
| `--nc-timeline-node-bg` | — | `--mod-timeline-node-bg` |
| `--nc-timeline-node-border` | — | `--mod-timeline-node-border` |
| `--nc-timeline-node-border-width` | — | `--mod-timeline-node-border-width` |
| `--nc-timeline-node-radius` | — | `--mod-timeline-node-radius` |

### Node Variants
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-timeline-node-active-bg` | — | `--mod-timeline-node-active-bg` |
| `--nc-timeline-node-active-border` | — | `--mod-timeline-node-active-border` |
| `--nc-timeline-node-success-bg` | — | `--mod-timeline-node-success-bg` |
| `--nc-timeline-node-danger-bg` | — | `--mod-timeline-node-danger-bg` |
| `--nc-timeline-node-icon-size` | — | `--mod-timeline-node-icon-size` |
| `--nc-timeline-node-icon-color` | — | `--mod-timeline-node-icon-color` |

### Content
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-timeline-content-gap` | — | `--mod-timeline-content-gap` |
| `--nc-timeline-content-padding` | — | `--mod-timeline-content-padding` |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-timeline-title-size` | — | `--mod-timeline-title-size` |
| `--nc-timeline-title-weight` | — | `--mod-timeline-title-weight` |
| `--nc-timeline-title-color` | — | `--mod-timeline-title-color` |
| `--nc-timeline-desc-size` | — | `--mod-timeline-desc-size` |
| `--nc-timeline-desc-color` | — | `--mod-timeline-desc-color` |
| `--nc-timeline-time-size` | — | `--mod-timeline-time-size` |
| `--nc-timeline-time-color` | — | `--mod-timeline-time-color` |
| `--nc-timeline-time-weight` | — | `--mod-timeline-time-weight` |

### Alternating Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-timeline-alt-max-width` | — | `--mod-timeline-alt-max-width` |
| `--nc-timeline-alt-node-col` | — | `--mod-timeline-alt-node-col` |
| `--nc-timeline-alt-gap` | — | `--mod-timeline-alt-gap` |
| `--nc-timeline-alt-item-gap` | — | `--mod-timeline-alt-item-gap` |
| `--nc-timeline-progress-color` | — | `--mod-timeline-progress-color` |

### Card
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-timeline-card-bg` | — | `--mod-timeline-card-bg` |
| `--nc-timeline-card-border` | — | `--mod-timeline-card-border` |
| `--nc-timeline-card-radius` | — | `--mod-timeline-card-radius` |
| `--nc-timeline-card-padding` | — | `--mod-timeline-card-padding` |
| `--nc-timeline-badge-tint` | — | — |
| `--nc-timeline-badge-radius` | — | `--mod-timeline-badge-radius` |
| `--nc-timeline-lead-color` | — | `--mod-timeline-lead-color` |
| `--nc-timeline-marker-color` | — | `--mod-timeline-marker-color` |
| `--nc-timeline-card-title-size` | — | `--mod-timeline-card-title-size` |
| `--nc-timeline-card-title-weight` | — | `--mod-timeline-card-title-weight` |
| `--nc-timeline-cta-gap` | — | `--mod-timeline-cta-gap` |

### Horizontal Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-timeline-h-card-width` | — | `--mod-timeline-h-card-width` |
| `--nc-timeline-h-gap` | — | `--mod-timeline-h-gap` |
| `--nc-timeline-h-pad-block` | — | `--mod-timeline-h-pad-block` |

### Reveal Effects
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-timeline-reveal-shift` | — | — |
| `--nc-timeline-reveal-duration` | — | — |
| `--nc-timeline-reveal-glow` | — | — |
| `--nc-timeline-node-glow` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName

## Web Components Mapping
Derived from anatomy for potential `<nc-timeline>` custom element:

```js
class NcTimeline extends HTMLElement {
  static observedAttributes = ['variant', 'nodeStatus', 'layout', 'progress', 'cardTone', 'headerAlign', 'ctaVariant'];
  // Slots: <slot name="item">, <slot name="node">, <slot name="content">, <slot name="title">
}
```

---

*Generated from `data/timeline-recipe.json` by `scripts/generate-component-specs.js`*
