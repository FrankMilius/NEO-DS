# block-bundle Component Spec
> Version 1.1.1 | Status: stable | Layer: organism

Tags: `content`, `organisms`, `website-block`

## Anatomy
Root element: `.nc-block-bundle`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| header | `.nc-block-bundle__header` | No | Kopf (traegt .nc-container, Spalte mit gap spacing-03): neo_fe:block-header --flush, optional Text. Nur, wenn Kicker, Ueberschrift, Lead oder Text gefuellt sind. |
| text | `.nc-block-bundle__text` | No | Fliesstext unter dem Kopf (field_bb_text, Rich Text, mit .u-prose), Farbe text-secondary. |
| items | `.nc-block-bundle__items` | No | Die gebuendelten Bloecke (field_bb_blocks), jeder mit seinem eigenen Template; nur, wenn Bloecke referenziert sind. |

### DOM Notes
- Website-Block neo_block_bundle: <section class="nc-section nc-block-bundle"> mit optionalem Kopf (.nc-container.nc-block-bundle__header) und optional den vorgerenderten Kind-Bloecken in __items. block_content- und inline_block-Template sind Volltext-Kopien.
- Felder: field_bb_kicker, field_bb_headline, field_bb_lead (-> neo_fe:block-header --flush, Badges aus neo_badges), field_bb_text (-> __text, Rich Text mit |raw), field_bb_blocks (-> bb_blocks: neo_fe_preprocess_block rendert jeden referenzierten Block als Block-Plugin, damit sein neo_*-Template greift).
- Ohne referenzierte Bloecke bleibt nur der Kopf: so stehen die fuenf Buendel auf node 49 als Kapitelueberschriften (Specimen „Nur Kopf"). Der Abstand des Kopfs nach unten (spacing-09) bleibt dabei stehen.
- Die Wurzel .nc-block-bundle hat keine eigene Regel; gestaltet sind Kopf (Spalte mit gap spacing-03, Abstand nach unten spacing-09), Text (text-secondary) und der Abstand zwischen den Kind-Bloecken (spacing-04). Die Kind-Bloecke bringen ihre eigene .nc-section mit Polsterung und ihren eigenen .nc-container mit; __items selbst hat keinen Container.
- Farbkontext (field_surface) und Inhaltsbreite (field_content_width) setzt Drupal am Block-Wrapper.
- Die Kind-Bloecke sind in der Arena Platzhalter — sie haben eigene Recipes.

## Variants
### Variante (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-block-bundle`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--fnd-color-text-secondary` | — | — |
| `--fnd-spacing-03` | — | — |
| `--fnd-spacing-04` | — | — |
| `--fnd-spacing-09` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Der Kopf traegt die Ueberschrift des Buendels (h2); die Kind-Bloecke bringen ihre eigene mit, ebenfalls h2 — die Gliederung stellt sie neben den Buendel-Kopf, nicht darunter (heading_level von block-header reichen die Bloecke nicht durch).
- DOM-Reihenfolge = Lesereihenfolge: Kopf, Text, Kind-Bloecke in der Reihenfolge von field_bb_blocks.
- Kontrast AA: Text in text-secondary, in Theme-Bereichen am Element aufgeloest (hell 6,07:1, dunkel 8,34:1 gemessen).

## Web Components Mapping
Derived from anatomy for potential `<nc-block-bundle>` custom element:

```js
class NcBlockBundle extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: default
}
```

---

*Generated from `data/block-bundle-recipe.json` by `scripts/generate-component-specs.js`*
