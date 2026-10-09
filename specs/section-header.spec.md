# section-header Component Spec
> Version 1.2.0 | Status: stable | Layer: molecule

Tags: `content`, `molecules`, `block-kopf`

## Anatomy
Root element: `.nc-section-header`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| badges | `.nc-section-header__badges` | No | Badge-Zeile (.nc-badge-row mit .nc-label) ueber dem Kicker. |
| label | `.nc-section-header__label` | No | Kicker (Dachzeile, Monospace in Versalien). |
| title | `.nc-section-header__title` | Yes | Ueberschrift (h2, per heading_level auch h1/h3). |
| subtitle | `.nc-section-header__subtitle` | No | Lead. |

### DOM Notes
- Der geteilte Kopf der Website-Bloecke: neo_fe:block-header rendert Badges -> Kicker -> Headline -> Lead; 20 Bloecke binden ihn ein (je block_content- und inline_block-Template). Sind alle Felder leer, rendert er nichts.
- Drupal-Props: badges (Liste {label, color, style} aus neo_badges, bewusst nicht deklariert), kicker, headline, lead, heading_level (h1|h2|h3, Vorgabe h2 — kein Block der Website setzt einen anderen Wert), modifier (Zusatzklassen).
- embed-Slots fuer Zusatzinhalt innerhalb des Kopfs: before_kicker, after_kicker, after_lead. Auf der Website nutzt nur solution-tabs after_lead (Trust-Badges).
- Die Badge-Zeile ist .nc-badge-row (neo_fe:badge-row, 05-atoms/_badge-row.scss, Hilfsklasse ohne eigenes Recipe) mit .nc-section-header__badges fuer den Abstand; die Badges sind .nc-label mit Farbe und Stil aus der Freigabeliste (success, warning, danger, info, accent, interactive, inverse; solid, outline, pill).
- Modifier auf der Website: --flush in accordion, block-bundle, feature-list, form, text-cta, text-media (Eltern mit eigenem gap); --center in card-grid-cta, fade-gallery, logo-wall, product-showcase, story-gallery, table; tab-nav und timeline setzen --center/--right aus ihrem Ausrichtungsfeld. Ohne Modifier: bento-grid, card-grid, device-scroll, doc-section, expanding-panels, solution-tabs, testimonial-grid.
- Hoechstbreite --fnd-prose-max-width (72ch); --center zentriert den Kasten (margin-inline auto), --right rueckt ihn nach rechts; beide richten auch die Badge-Zeile mit aus.
- Kicker-Satz: Groesse, Sperrung und Versalien ueber --nc-section-header-label-* (zeigen auf --nc-kicker-*), die Schriftfamilie liest das SCSS direkt aus --nc-kicker-font-family (Mono); das Gewicht setzt --nc-section-header-label-font-weight mit 800 eigenstaendig (nicht ueber --nc-kicker-font-weight).
- Farben in Theme-Bereichen (.neo-/.customer-light-theme, .neo-/.customer-dark-theme, Drupal: field_surface am Block-Wrapper) neu gebunden: Titel text-primary, Lead --nc-block-lead-color, Kicker hell neutral-800, dunkel text-secondary (auch seitenweit dunkel per prefers-color-scheme ohne data-theme).
- Lokale Ueberschreibungen ausserhalb des Recipes: .nc-text-media--dark-bg (Titel und Lead hell auf Medienflaeche), .nc-solution-tabs-section (Titel, Kicker, Lead aus --nc-solution-tabs-*). app-store setzt __title/__subtitle ohne block-header.

## Variants
### Ausrichtung (`alignment`)
Textausrichtung des Kopfs

| Value | CSS Modifier | Default |
| --- | --- | --- |
| left | — |  |
| center | `.nc-section-header--center` |  |
| right | `.nc-section-header--right` |  |

### Abstand (`spacing`)
Abstand zum Folgeinhalt

| Value | CSS Modifier | Default |
| --- | --- | --- |
| standard | — |  |
| flush | `.nc-section-header--flush` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-section-header`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-section-header-gap` | — | — |
| `--nc-section-header-badges-spacing` | — | — |

### Kicker
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-section-header-label-color` | — | — |
| `--nc-section-header-label-font-size` | — | — |
| `--nc-section-header-label-font-weight` | — | — |
| `--nc-section-header-label-letter-spacing` | — | — |
| `--nc-section-header-label-text-transform` | — | — |
| `--nc-section-header-label-spacing` | — | — |

### Titel
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-section-header-title-color` | — | — |
| `--nc-section-header-title-font-size` | — | — |
| `--nc-section-header-title-font-weight` | — | — |
| `--nc-section-header-title-line-height` | — | — |
| `--nc-section-header-title-letter-spacing` | — | — |
| `--nc-section-header-title-spacing` | — | — |

### Lead
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-section-header-subtitle-color` | — | — |
| `--nc-section-header-subtitle-font-size` | — | — |
| `--nc-section-header-subtitle-line-height` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Genau eine Ueberschrift je Block (.nc-section-header__title); Ebene ueber heading_level passend zur Gliederung der Seite, auf der Website h2.
- Der Kicker ist ein <span> vor der Ueberschrift, keine Ueberschrift und nicht Teil davon; Badges sind <span>, keine Bedienelemente.
- DOM-Reihenfolge = Lesereihenfolge (Badges, Kicker, Titel, Lead); die Ausrichtung aendert sie nicht.
- Kontrast AA in hell und dunkel: Kicker hell neutral-800 (8,95:1), dunkel text-secondary (>= 6,4:1); Titel und Lead binden in Theme-Bereichen neu.

## Web Components Mapping
Derived from anatomy for potential `<nc-section-header>` custom element:

```js
class NcSectionHeader extends HTMLElement {
  static observedAttributes = ['alignment', 'spacing'];
  // Slots: <slot name="title">
}
```

---

*Generated from `data/section-header-recipe.json` by `scripts/generate-component-specs.js`*
