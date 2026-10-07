# accordion-block Component Spec
> Version 1.0.0 | Status: draft | Layer: organism

Tags: `content`, `organisms`, `website-block`

## Anatomy
Root element: `.nc-accordion-block`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| inner | `.nc-accordion-block__inner` | Yes | Raster aus Kopf und Akkordeon; traegt zusaetzlich .nc-container (Breite und Polster). |
| text | `.nc-accordion-block__text` | Yes | Kopf (neo_fe:block-header, --flush); klebt neben dem Akkordeon (sticky). |
| accordion | `.nc-accordion-block__accordion` | Yes | Spalte mit .nc-accordion und optional .nc-accordion-toggle-all. |

### DOM Notes
- Website-Block neo_accordion: <section class="nc-section nc-accordion-block nc-accordion-block--{ratio}"> > .nc-container.nc-accordion-block__inner > __text + __accordion.
- Breitenverhaeltnis ueber --nc-accordion-cols (Override --mod-accordion-cols): zwei-drittel 1fr 2fr (Vorgabe), halb 1fr 1fr, voll 1fr (Kopf oben, Lesebreite --nc-accordion-voll-measure).
- Die Varianten register und lese des Akkordeons erzwingen in Drupal ratio voll.
- Unter 768 px Fensterbreite einspaltig, Kopf nicht mehr sticky.
- Die Anschnittlinie kommt vom .nc-container (seit 20.08.2026 keine eigene Hoechstbreite mehr).

## Variants
### Verhaeltnis (`ratio`)
Breiten von Kopf und Akkordeon

| Value | CSS Modifier | Default |
| --- | --- | --- |
| zwei-drittel | `.nc-accordion-block--zwei-drittel` |  |
| halb | `.nc-accordion-block--halb` |  |
| voll | `.nc-accordion-block--voll` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-accordion-block`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-accordion-cols` | — | `--mod-accordion-cols` |
| `--nc-accordion-voll-measure` | — | `--mod-accordion-voll-measure` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-accordion-block>` custom element:

```js
class NcAccordionBlock extends HTMLElement {
  static observedAttributes = ['ratio'];
  // Slots: <slot name="inner">, <slot name="text">, <slot name="accordion">
}
```

---

*Generated from `data/accordion-block-recipe.json` by `scripts/generate-component-specs.js`*
