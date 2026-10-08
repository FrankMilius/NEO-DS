# card-cta Component Spec
> Version 1.3.0 | Status: stable | Layer: molecule

Tags: `aufgenommen`, `molecules`

## Anatomy
Root element: `.nc-card-cta`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| media | `.nc-card-cta__media` | No | Hintergrundmedium, absolut auf die ganze Karte, object-fit cover: <img alt=""> (card.media, loading lazy) oder <video> mit autoplay, loop, muted, playsinline und aria-hidden (card.video, Vorrang vor dem Bild). Dekorativ. |
| overlay | `.nc-card-cta__overlay` | No | Verlauf ueber dem Medium (von unten): dunkel, bei data-theme="light" hell. Nur mit Medium; pointer-events none. |
| content | `.nc-card-cta__content` | Yes | Inhaltsebene ueber Medium und Verlauf: Flex-Spalte, unten ausgerichtet, Polsterung spacing-06. |
| title | `.nc-card-cta__title` | No | <h3> (card.title), heading-l bold; always-light, bei data-theme="light" always-dark. Breite als Instanzwert max-width in % (card.titleWidth, Vorgabe 80). |
| actions | `.nc-card-cta__actions` | No | Knopfzeile (card.cta): ein .nc-button — <a> mit card.url, sonst <span>; --primary oder --ghost (card.ghost). Auf dunkler Karte setzt das Skript helle Knopffarben inline (--nc-button-primary-bg/-color bzw. --nc-button-ghost-color/-border). aria-label „<CTA> – <Titel>". |

### DOM Notes
- Kein Twig: Drupal.behaviors.neoCardGridCta (js/neo-theme.js) baut die Karten aus dem JSON-Feld field_cgc_cards in das Raster .nc-card-grid-cta (Recipe card-grid-cta) — <div class="nc-card-cta" data-theme="dark|light"> mit __media, __overlay, __content > __title + __actions.
- data-theme steht nur, wenn die Karte card.theme traegt; ohne Angabe verhaelt sie sich wie dunkel (heller Titel, dunkler Verlauf, helle Knopffarben). data-theme bindet hier keine Theme-Tokens neu, es waehlt nur die beiden Regeln .nc-card-cta[data-theme="light"].
- Seitenverhaeltnis aus --cgc-ratio (Instanzwert am Raster, field_cgc_ratio 16/9 | 4/3 | 1/1 | 3/4; Vorgabe 16/9), Radius --nc-card-radius (Rueckfall radius-md).
- Ohne Medium steht die Karte auf background-tertiary des Seitenthemas ohne Verlauf.
- Hover: das Medium zoomt auf 1.03 (Uebergang 0,4 s, bei prefers-reduced-motion ohne Uebergang); die Karte selbst ist kein Link, der Knopf traegt das Ziel.
- Die Mobilregel (max-width 768px) setzt dieselbe Titelgroesse wie die Grundregel und ist wirkungslos.

## Variants
### Ton (`ton`)
data-theme am Wurzelelement: Farbe von Titel und Verlauf ueber dem Bild (06-molecules/_card-cta.scss).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| dunkel | — |  |
| hell | — |  |

## States
Supported: `default`, `hover`

## CSS Token API
Base classes: `nc-card-cta`

### Fundament
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-radius` | — | `--mod-card-radius` |
| `--fnd-radius-md` | — | — |
| `--fnd-color-background-tertiary` | — | — |
| `--fnd-color-always-dark` | — | — |
| `--fnd-color-always-light` | — | — |
| `--fnd-spacing-03` | — | — |
| `--fnd-spacing-04` | — | — |
| `--fnd-spacing-06` | — | — |
| `--nc-type-heading-l-size` | — | `--mod-type-heading-l-size` |
| `--fnd-font-weight-bold` | — | — |
| `--lh-heading` | — | — |

## Accessibility
Contrast Target: WCAG AA large text (3:1) — Titel heading-l bold

- Medium dekorativ: Bild mit alt="", Video mit aria-hidden und stumm; der Sinn steht im Titel.
- Titel als <h3> unter der Ueberschrift des Rasters (h2 im Block-Kopf).
- Der Knopf ist das einzige Ziel (<a class="nc-button">); sein aria-label nennt Aktion und Titel, weil mehrere Karten dieselbe Aktion tragen koennen. Ohne URL ist er ein <span> und nicht bedienbar.
- Kontrast von Titel und Knopf haengt am Medium: der Verlauf (dunkel 60 %, hell 70 % am unteren Rand) sichert ihn nur im unteren Bereich — Bild passend zum Ton waehlen.
- Das Video laeuft automatisch in Schleife ohne Pausenknopf (WCAG 2.2.2 bei mehr als 5 s) — nur ruhige, kurze Loops verwenden.
- Hover-Zoom entfaellt bei prefers-reduced-motion.

## Web Components Mapping
Derived from anatomy for potential `<nc-card-cta>` custom element:

```js
class NcCardCta extends HTMLElement {
  static observedAttributes = ['ton'];
  // Slots: <slot name="content">
}
```

---

*Generated from `data/card-cta-recipe.json` by `scripts/generate-component-specs.js`*
