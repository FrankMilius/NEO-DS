# text-cta Component Spec
> Version 1.2.1 | Status: stable | Layer: organism

Tags: `content`, `organisms`, `website-block`, `split-layout`

## Anatomy
Root element: `.nc-text-cta`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| grid | `.nc-text-cta__grid` | Yes | Raster (Container-Query auf .nc-text-cta): gestapelt, ab 600 px Blockbreite (media-text-stack) zweispaltig 1,35fr : 1fr; mit --no-card immer einspaltig. |
| content | `.nc-text-cta__content` | Yes | Textspalte (Flex-Stack mit gap): neo_fe:block-header --flush (field_tc_kicker, field_tc_headline h2, field_tc_subline) und Punkteliste. |
| list | `.nc-text-cta__list` | No | Punkteliste (field_tc_features, eine Zeile je Punkt, Leerzeilen fallen weg). |
| list-item | `.nc-text-cta__list-item` | No | Punkt (<li> mit <span>) mit dekorativem Haken (::before mit leerem Alternativtext, --nc-text-cta-list-marker-color); Folgezeilen buendig unter dem Text. |
| aside | `.nc-text-cta__aside` | No | <aside>, Spalte der Karte — entfaellt ohne Karteninhalt (keins von Icon, Kartenueberschrift, -text, Button-Text gefuellt). |
| card | `.nc-text-cta__card` | No | CTA-Karte auf .nc-card (Flaeche, Rahmen, Radius ueber --mod-card-* aus den --nc-text-cta-card-*-Tokens): zentriert, Icon, Titel (h3.nc-card__title), Text (p.nc-card__description), Button. |
| card-icon | `.nc-text-cta__card-icon` | No | Icon oben in der Karte (field_tc_card_icon, im Preprocess per neo_fe_icon zu SVG mit aria-hidden); dekorativ. |
| card-action | `.nc-text-cta__card-action` | No | Button der Karte (.nc-button--accent.nc-button--lg, volle Breite; field_tc_card_cta_text/_url). |

### DOM Notes
- Website-Block neo_text_cta: <section class="nc-section"><div class="nc-container"><div class="nc-text-cta [--card-left] [--no-card]"><div class="nc-text-cta__grid"> … Die inline_block-Fassung bindet das block_content-Template ein (keine Kopie).
- Die Karte steht im DOM immer hinter dem Text; --card-left (field_tc_card_position left, nur mit Karte) tauscht nur die Anzeige (order) und dreht die Spuren mit (--nc-text-cta-columns-reverse). Gestapelt steht die Karte immer unter dem Text.
- Ohne Karteninhalt rendert Drupal kein __aside und setzt nc-text-cta--no-card: eine Spalte in jeder Breite, Inhalt auf Lesebreite (--nc-text-cta-content-measure) gekappt, linksbuendig (Entscheidung Phase 5, 07.10.2026).
- Kartenflaeche per field_tc_card_bg als Instanzwert --mod-card-bg am .nc-card (Rohwert, wie in Drupal); Sektionsflaeche aus field_surface am Block-Wrapper. Die Tokens --nc-text-cta-card-bg/-border/-radius gehen als --mod-card-* an die Karte und haben selbst keinen --mod-text-cta-*-Override, ebenso --nc-text-cta-card-icon-gap.
- In dunklen Theme-Bereichen (field_surface dunkel) bleibt die Karte hell: Kartenflaeche und -text kommen aus den am :root aufgeloesten Karten-Tokens (gilt fuer .nc-card allgemein). Lesbar, aber eine helle Insel; eine Instanzflaeche aus einem Theme-Token wird dort dunkel und der Text bleibt dunkel.

## Variants
### Lage der Karte (`cardPosition`)
field_tc_card_position

| Value | CSS Modifier | Default |
| --- | --- | --- |
| right | — |  |
| left | `.nc-text-cta--card-left` |  |

### Karte (`card`)
Mit oder ohne Karteninhalt

| Value | CSS Modifier | Default |
| --- | --- | --- |
| mit | — |  |
| ohne | `.nc-text-cta--no-card` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-text-cta`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-text-cta-gap` | — | `--mod-text-cta-gap` |
| `--nc-text-cta-columns` | — | `--mod-text-cta-columns` |
| `--nc-text-cta-columns-reverse` | — | `--mod-text-cta-columns-reverse` |
| `--nc-text-cta-content-gap` | — | `--mod-text-cta-content-gap` |
| `--nc-text-cta-content-measure` | — | `--mod-text-cta-content-measure` |

### Punkteliste
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-text-cta-list-gap` | — | `--mod-text-cta-list-gap` |
| `--nc-text-cta-list-marker-color` | — | `--mod-text-cta-list-marker-color` |

### Karte
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-text-cta-card-bg` | — | — |
| `--nc-text-cta-card-border` | — | — |
| `--nc-text-cta-card-radius` | — | — |
| `--nc-text-cta-card-padding` | — | `--mod-text-cta-card-padding` |
| `--nc-text-cta-card-icon-size` | — | `--mod-text-cta-card-icon-size` |
| `--nc-text-cta-card-icon-color` | — | `--mod-text-cta-card-icon-color` |
| `--nc-text-cta-card-icon-gap` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Erst Erklaerung, dann Handlungsaufruf: die Karte steht im DOM hinter dem Text, auch bei --card-left und gestapelt.
- Eine Ueberschrift fuer den Block (h2 im Kopf); der Kartentitel ist h3 darunter.
- Haken der Punkteliste und Icon der Karte sind dekorativ — der Haken hat leeren Alternativtext (content '\2714' / ''), das Icon aria-hidden; der Sinn steht im Text daneben.
- Der Button ist ein Link (<a class="nc-button">) mit sichtbarem Text; die Karte als <aside> ohne Namen ist keine eigene Landmarke.
- Kontrast AA hell und dunkel (gemessen ab 4,66:1 fuer den Kartentext); die Instanzflaeche field_tc_card_bg ist davon nicht gedeckt.

## Web Components Mapping
Derived from anatomy for potential `<nc-text-cta>` custom element:

```js
class NcTextCta extends HTMLElement {
  static observedAttributes = ['cardPosition', 'card'];
  // Slots: <slot name="grid">, <slot name="content">
}
```

---

*Generated from `data/text-cta-recipe.json` by `scripts/generate-component-specs.js`*
