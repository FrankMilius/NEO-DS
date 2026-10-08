# prose Component Spec
> Version 1.2.0 | Status: stable | Layer: object

Tags: `layout`, `objects`, `lesen`, `editorial`

## Anatomy
Root element: `.nc-prose`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| bleed-content | `.nc-bleed-content` | No | Direktes Kind bricht bis zur Content-Breite aus (1090; oder data-bleed="content"). |
| bleed-wide | `.nc-bleed-wide` | No | Direktes Kind bricht bis zur Wide-Breite aus (1290; oder data-bleed="wide"). |
| bleed-full | `.nc-bleed-full` | No | Direktes Kind laeuft ueber die volle Breite, gekappt auf xwide 1536 (oder data-bleed="full"); <img>, <picture> <img> und <video> darin fuellen die Spalte. |

### DOM Notes
- Ein CSS-Grid mit benannten Linien full | wide | content | prose: jedes direkte Kind steht in der Prosa-Spalte (--prose-measure = --container-prose, 72ch); seitlich mindestens --prose-gutter (= --container-padding-inline).
- Breakout per Klasse (.nc-bleed-content|wide|full) oder Attribut data-bleed="content|wide|full" — nur an DIREKTEN Kindern; sie setzen margin-inline 0 (sonst zoege der Browser-Rand von <figure> sie ein). Die Website nutzt das Attribut (gefilterte Body-HTML).
- Das Ganze ist auf --container-xwide gekappt und zentriert (--mod-prose-max); full bricht also bis 1536 aus, nicht bis zum Viewport.
- .nc-prose--left: Lesespalte an der linken Kante (margin-inline 0, kein linker Gutter), Breakouts wachsen nach rechts. Den Abstand zur Seitenkante liefert der umgebende Rahmen (.nc-content).
- Website: field--body.html.twig legt das Body-Feld in <div class="nc-prose">; neo_fe_preprocess_field setzt reading_left in den Bereichen /inside/blog und /inside/dokumentation, dann zusaetzlich .nc-prose--left.
- Keine Typografie: Abstaende und Schrift der Kinder kommen aus der Basis. .u-prose (10-utilities, event und news) ist etwas anderes — nur max-width und Zeilenhoehe, kein Breakout.
- data-bleed="full" wirkt auch als direktes Kind von .nc-container (04-objects/_section.scss) — dort mit anderer Technik (negativer Rand ueber --container-pad), nicht Teil dieses Objects.
- Overrides: --mod-prose-measure, --mod-prose-gutter, --mod-prose-max.

## Variants
### Ausrichtung (`alignment`)
Lage der Lesespalte

| Value | CSS Modifier | Default |
| --- | --- | --- |
| center | — |  |
| left | `.nc-prose--left` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-prose`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--container-content` | — | — |
| `--container-padding-inline` | — | — |
| `--container-prose` | — | — |
| `--container-wide` | — | — |
| `--container-xwide` | — | — |
| `--fnd-spacing-06` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Zeilenlaenge um 72 Zeichen (WCAG 1.4.8 empfiehlt hoechstens 80); --mod-prose-measure nicht ueber 80ch setzen.
- Breakouts aendern nur grid-column, nie die Reihenfolge — Lese- und DOM-Reihenfolge bleiben gleich.
- Ausbrechende Medien brauchen ihren Alternativtext bzw. eine <figcaption>; dekorative Bilder alt="".
- Reflow (WCAG 1.4.10): die Prosa-Spalte schrumpft mit min(measure, 100 % - 2 x Gutter), min-width 0 an jedem Kind verhindert Ueberlauf durch <pre> oder lange Woerter im Raster.

## Web Components Mapping
Derived from anatomy for potential `<nc-prose>` custom element:

```js
class NcProse extends HTMLElement {
  static observedAttributes = ['alignment'];
  // Slots: default
}
```

---

*Generated from `data/prose-recipe.json` by `scripts/generate-component-specs.js`*
