# text-cta Component Spec
> Version 1.0.0 | Status: draft | Layer: organism

Tags: `content`, `organisms`, `website-block`, `split-layout`

## Anatomy
Root element: `.nc-text-cta`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| grid | `.nc-text-cta__grid` | Yes | Raster (Container-Query auf .nc-text-cta): gestapelt, ab media-text-stack zweispaltig. |
| content | `.nc-text-cta__content` | Yes | Textspalte: neo_fe:block-header --flush und Punkteliste. |
| list | `.nc-text-cta__list` | No | Punkteliste (field_tc_features, eine Zeile je Punkt). |
| list-item | `.nc-text-cta__list-item` | No | Punkt mit Haken (::before). |
| aside | `.nc-text-cta__aside` | No | Spalte der Karte — entfaellt ohne Karteninhalt. |
| card | `.nc-text-cta__card` | No | CTA-Karte auf .nc-card (Flaeche, Rahmen, Radius ueber --mod-card-*). |
| card-icon | `.nc-text-cta__card-icon` | No | Icon oben in der Karte (dekorativ). |
| card-action | `.nc-text-cta__card-action` | No | Button der Karte, volle Breite. |

### DOM Notes
- Website-Block neo_text_cta: <section class="nc-section"><div class="nc-container"><div class="nc-text-cta [--card-left] [--no-card]"><div class="nc-text-cta__grid"> …
- Die Karte steht im DOM immer hinter dem Text; --card-left tauscht nur die Anzeige (order) und dreht die Spuren mit (--nc-text-cta-columns-reverse).
- Ohne Karteninhalt rendert Drupal kein __aside und setzt nc-text-cta--no-card — dafuer gibt es keine Regel: das Raster bleibt zweispaltig, der Text steht in der linken Spur (Entscheidungsfall Phase 5).
- Kartenflaeche per field_tc_card_bg als Instanzwert --mod-card-bg am .nc-card (wie in Drupal); Sektionsflaeche aus field_surface am Block-Wrapper.

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

### Punkteliste
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-text-cta-list-gap` | — | `--mod-text-cta-list-gap` |
| `--nc-text-cta-list-marker-color` | — | `--mod-text-cta-list-marker-color` |

### Karte
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-text-cta-card-bg` | — | `--mod-text-cta-card-bg` |
| `--nc-text-cta-card-border` | — | `--mod-text-cta-card-border` |
| `--nc-text-cta-card-radius` | — | `--mod-text-cta-card-radius` |
| `--nc-text-cta-card-padding` | — | `--mod-text-cta-card-padding` |
| `--nc-text-cta-card-icon-size` | — | `--mod-text-cta-card-icon-size` |
| `--nc-text-cta-card-icon-color` | — | `--mod-text-cta-card-icon-color` |
| `--nc-text-cta-card-icon-gap` | — | `--mod-text-cta-card-icon-gap` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

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
