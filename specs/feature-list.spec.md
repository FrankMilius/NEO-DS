# feature-list Component Spec
> Version 1.2.0 | Status: stable | Layer: organism

Tags: `aufgenommen`, `organisms`

## Anatomy
Root element: `.nc-feature-list`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| inner | `.nc-feature-list__inner` | Yes | Innenrahmen auf .nc-container: Flex-Spalte; mit --with-media Raster 1fr | 1fr, gap clamp(1,5rem … spacing-11), bis 768 px einspaltig (Medium oben). |
| media | `.nc-feature-list__media` | No | Medienbereich (nur mit Bild oder Video): 4:3, mindestens 240 px hoch, Radius lg (mit nc-media-frame dessen Radius), background-secondary, Inhalt auf volle Groesse. Rahmen per field_media_frame: frame (Vorgabe, .nc-media-frame), none, device. |
| media--device | `.nc-feature-list__media--device` | No | Geraeterahmen (field_media_frame device): .nc-device mit Screenshot im Dokument statt per Skript; nimmt Seitenverhaeltnis, Mindesthoehe, Flaeche und Rahmen zurueck, Breite --nc-feature-list-device-width, Screenshot object-fit contain. |
| video | `.nc-feature-list__video` | No | Video im Medienbereich (field_fl_video, Vorrang vor dem Bild): <iframe> fuer YouTube/Vimeo oder <video controls>, vom Skript gebaut; object-fit cover. |
| content | `.nc-feature-list__content` | Yes | Textspalte: neo_fe:block-header --flush (field_fl_kicker, field_fl_headline h2, field_fl_lead), Fliesstext, Liste, Knopf; senkrechte Lage per --valign-*. |
| text | `.nc-feature-list__text` | No | Fliesstext (field_fl_text, formatiertes HTML), body-m, text-secondary. |
| items-host | `.nc-feature-list__items-host` | Yes | Huelle der Liste (data-feature-list), steht immer; das Skript haengt die Liste ein. Ohne Eintraege leer (:empty ohne Abstand). |
| items | `.nc-feature-list__items` | No | <ul> der Eintraege aus field_fl_items_json (Strings oder { text }), vom Skript gebaut. |
| item | `.nc-feature-list__item` | No | <li>: Icon und Text nebeneinander, body-m, text-primary. |
| icon | `.nc-feature-list__icon` | No | Haken im Kreis (SVG 36er-Raster, 1,5 rem, aria-hidden, focusable false; Kreis #AEF359 fest im Skript). |
| item-text | `.nc-feature-list__item-text` | No | Text des Eintrags (textContent, kein HTML). |
| cta | `.nc-feature-list__cta` | No | Knopf (field_fl_cta_text/_url): nc-button--accent --lg; nur mit Text. |

### DOM Notes
- Website-Block neo_feature_list: <section class="nc-section nc-feature-list[ --with-media --media-<right|left> --valign-<top|middle|bottom>]"><div class="nc-container nc-feature-list__inner"> … Die drei Modifier setzt Drupal nur mit Medium und dann immer zusammen; Vorgaben right und middle.
- Medium: field_fl_video (Vorrang) oder field_sg_cards (Karte 1). Bild: Drupal.behaviors.neoFeatureMedia ruft NeoBehaviors.shotAufbauen am Medienbereich — der wird selbst zu .nc-shot (data-nc-shot) mit img.nc-shot__img (Fokuspunkt, Zoom, Seitenverhaeltnis der Karte); ohne neo-behaviors ein schlichtes <img>. Mit field_media_frame device steht der Screenshot im Template in .nc-device.
- Liste: Drupal.behaviors.neoFeatureList liest field_fl_items_json und baut ul > li > span.__icon + span.__item-text (derselbe Renderer fuer das Tab-Nav-Modul).
- Bis 768 px eine Spalte, Medium immer oben (order 0), unabhaengig von der Lage.
- Namensvetter: _pricing.scss nennt die Merkmalsliste einer Preiskarte ebenfalls .nc-feature-list (ein <ul>); die Wurzelregel hier setzt ihre Werte deshalb selbst (Umbenennung im BACKLOG).

## Variants
### Variante (`variante`)
Klassen, die Drupal am Block setzt: ohne Medium keine, mit Medium immer with-media + media-<right|left> + valign-<top|middle|bottom> (Vorgaben right, middle). Die Arena ergaenzt fehlende Klassen mit den Drupal-Vorgaben.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| media-left | `.nc-feature-list--media-left` |  |
| media-right | `.nc-feature-list--media-right` |  |
| valign-bottom | `.nc-feature-list--valign-bottom` |  |
| valign-middle | `.nc-feature-list--valign-middle` |  |
| valign-top | `.nc-feature-list--valign-top` |  |
| with-media | `.nc-feature-list--with-media` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-feature-list`

### Alle Tokens
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-feature-list-icon-margin-top` | — | — |

### Geometrie
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-feature-list-device-width` | — | `--mod-feature-list-device-width` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Reihenfolge im DOM: Medium vor dem Text, auch bei Medium rechts (nur die Anzeige tauscht per order) — Screenreader lesen das Bild zuerst.
- Bild-Alternativtext aus der Karte (alt, sonst Titel); Geraete-Screenshot mit alt aus dem Medium. Ein Video-iframe traegt keinen title — im Theme ergaenzen.
- Haken-Icons sind dekorativ (aria-hidden, focusable false); der Sinn steht im Text. Der Kreis #AEF359 ist nicht themefaehig, auf heller Flaeche schwach (nur Schmuck).
- Eine Ueberschrift (h2 im Block-Kopf); die Liste ist eine echte <ul>.
- Kontrast: Eintraege text-primary, Fliesstext text-secondary auf der Abschnittsflaeche.

## Web Components Mapping
Derived from anatomy for potential `<nc-feature-list>` custom element:

```js
class NcFeatureList extends HTMLElement {
  static observedAttributes = ['variante'];
  // Slots: <slot name="inner">, <slot name="content">, <slot name="items-host">
}
```

---

*Generated from `data/feature-list-recipe.json` by `scripts/generate-component-specs.js`*
