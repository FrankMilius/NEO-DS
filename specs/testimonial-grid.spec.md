# testimonial-grid Component Spec
> Version 1.2.0 | Status: stable | Layer: molecule

Tags: `aufgenommen`, `molecules`

## Anatomy
Root element: `.nc-testimonial-grid`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| nav | `.nc-testimonial-grid__nav` | No | Navigation des Karussells — steht als Geschwister NACH dem Raster, nur bei --carousel; rechtsbuendig. |
| btn | `.nc-testimonial-grid__btn` | No | <button type="button"> „Vorherige/Weitere Testimonials" (aria-label, Pfeil-SVG aria-hidden; data-tc-prev/-next): 2,5 rem, rund, Rahmen border-secondary; Hover text-accent, Fokusring interactive-focus; [disabled] am Anfang bzw. Ende (Opacity-Token). |

### DOM Notes
- Website: block--block-content/inline-block--neo-testimonial-grid.html.twig — <section class="nc-section"><div class="nc-container"> mit neo_fe:block-header (Kicker, Ueberschrift) und dem Raster; ohne referenzierte Testimonials kein Raster.
- Raster: Drupal setzt immer nc-testimonial-grid--cols-<field_tg_columns> (Vorgabe 3; gestaltet sind 2 und 3, unter 60em zwei, unter 36em eine Spalte) oder --carousel (field_tg_layout). Ohne Modifier (eine Spalte) kommt auf der Website nicht vor.
- Kinder sind gerenderte neo_testimonial-Bloecke (Huelle > .nc-section > .nc-container > figure.nc-testimonial); display: contents entpackt die Huellen, damit die Figures Raster- bzw. Flex-Elemente werden. Die Figure streckt sich, der Autor steht unten.
- Karussell: Flex-Spur mit scroll-snap, Karten min(360px, 85 %); die Navigation .nc-testimonial-grid__nav mit zwei .nc-testimonial-grid__btn steht NACH der Spur.
- Verhalten (Drupal.behaviors.neoTestimonialCarousel, js/neo-theme.js — nicht ins DS migriert): Weiter/Zurueck scrollen um eine Kartenbreite plus Abstand (smooth); disabled am Anfang bzw. Ende, aktualisiert bei scroll und resize. Kein Autoplay.

## Variants
### Variante (`variante`)
Raster mit 2 oder 3 Spalten, Karussell; default (ohne Modifier, eine Spalte) erzeugt Drupal nicht.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| carousel | `.nc-testimonial-grid--carousel` |  |
| cols-2 | `.nc-testimonial-grid--cols-2` |  |
| cols-3 | `.nc-testimonial-grid--cols-3` |  |

## States
Supported: `default`, `hover`, `focus`, `disabled`

## CSS Token API
Base classes: `nc-testimonial-grid`

### Alle Tokens
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-testimonial-grid-btn-border-radius` | — | `--mod-testimonial-grid-btn-border-radius` |
| `--nc-testimonial-grid-btn-disabled-opacity` | — | `--mod-testimonial-grid-btn-disabled-opacity` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Karussell als benannte Gruppe (role="group", aria-roledescription="Karussell", aria-label) und mit tabindex="0" per Tastatur scrollbar (Pfeiltasten).
- Knoepfe sind <button> mit aria-label; das Pfeil-SVG ist aria-hidden.
- Am Anfang bzw. Ende ist der jeweilige Knopf disabled (nicht fokussierbar, Opacity-Token) — der Zustand ist damit auch fuer Screenreader gesetzt.
- Kein Autoplay, keine Bewegung ohne Ausloeser; scroll-behavior smooth folgt der Nutzerwahl des Browsers nicht automatisch (prefers-reduced-motion nicht beruecksichtigt).
- Kontrast der Knoepfe gemessen 16:1 (hell und dunkel); Hover faerbt Pfeil und Rahmen in text-accent.

## Web Components Mapping
Derived from anatomy for potential `<nc-testimonial-grid>` custom element:

```js
class NcTestimonialGrid extends HTMLElement {
  static observedAttributes = ['variante'];
  // Slots: default
}
```

---

*Generated from `data/testimonial-grid-recipe.json` by `scripts/generate-component-specs.js`*
