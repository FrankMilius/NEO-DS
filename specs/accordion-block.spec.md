# accordion-block Component Spec
> Version 1.1.0 | Status: stable | Layer: organism

Tags: `content`, `organisms`, `website-block`

## Anatomy
Root element: `.nc-accordion-block`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| inner | `.nc-accordion-block__inner` | Yes | Raster aus Kopf und Akkordeon; traegt zusaetzlich .nc-container (Breite und Polster). |
| text | `.nc-accordion-block__text` | Yes | Kopf (neo_fe:block-header --flush, Spalte mit gap spacing-03); klebt neben dem Akkordeon (sticky, top = --nc-nav-height + spacing-06) — nicht bei voll und unter 768 px. |
| accordion | `.nc-accordion-block__accordion` | Yes | Spalte mit dem Akkordeon (.nc-accordion, eigenes Recipe accordion) und optional davor dem Schalter .nc-accordion-toggle-all. |

### DOM Notes
- Website-Block neo_accordion: <section class="nc-section nc-accordion-block nc-accordion-block--{ratio}"> > .nc-container.nc-accordion-block__inner > __text + __accordion. Die inline_block-Fassung bindet das block_content-Template ein (keine Kopie).
- Der Ratio-Modifier steht immer (field_acc_ratio, Vorgabe zwei-drittel); Spalten ueber --nc-accordion-cols (Override --mod-accordion-cols): zwei-drittel 1fr 2fr, halb 1fr 1fr, voll 1fr (Kopf oben, nicht sticky, Lesebreite --nc-accordion-voll-measure 62ch). Die Akkordeon-Varianten register und lese erzwingen in Drupal voll.
- Alle anderen Felder wirken auf das innere .nc-accordion (Recipe accordion), nicht auf den Block: field_acc_variant (Vorgabe separated), field_acc_density (Vorgabe spacious), field_acc_media_side (top/side; im Register immer top), field_acc_sticky (--sticky), field_acc_behavior (single/single-scroll -> name-Attribut an den <details>), field_acc_expand_all (Schalter „Alle aufklappen").
- Instanzflaeche field_acc_bg_color: Drupal schreibt sie als style="background-color: …" an die <section> — ein Rohwert, der die Textfarben nicht mitdreht; die gestaltete Flaeche kommt aus field_surface (Klasse am Block-Wrapper), die Breite aus field_content_width.
- Senkrechter Rhythmus: __inner traegt padding-block spacing-10 zusaetzlich zur Polsterung von .nc-section; Abstand zwischen Kopf und Akkordeon gap spacing-10 (unter 768 px spacing-06). Die Anschnittlinie kommt vom .nc-container (seit 20.08.2026 keine eigene Hoechstbreite mehr).
- Unter 768 px Fensterbreite (Media Query) einspaltig, Kopf nicht mehr sticky — die Arena zeigt die Desktop-Lage.
- Verhalten (neo-theme.js, Drupal.behaviors.neoAccordion — gehoert zum Recipe accordion): Eintrag per Anker oeffnen, „Alle aufklappen" mit aria-expanded und Beschriftungswechsel, bei single-scroll den geoeffneten Eintrag in Sicht rollen. FAQ-Auszeichnung (JSON-LD) nur mit field_acc_faq.

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

- Eintraege als natives <details>/<summary> — Tastatur, Rolle und Zustand vom Browser; die Browsersuche findet und oeffnet zugeklappten Text.
- Der Kopf steht im DOM vor dem Akkordeon (auch wenn er klebt); genau eine Ueberschrift (h2) fuer den Block, die Eintragstitel sind keine Ueberschriften.
- „Alle aufklappen" ist ein <button> mit aria-controls auf die Liste und aria-expanded; er fehlt bei „nur eines offen" und bei nur einem Eintrag.
- Kontrast AA hell und dunkel ueber Section-Header und Akkordeon (gemessen ab 6,07:1); eine Instanzflaeche (field_acc_bg_color) ist davon nicht gedeckt.

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
