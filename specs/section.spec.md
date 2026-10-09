# section Component Spec
> Version 3.2.0 | Status: stable | Layer: organism

Tags: `layout`, `object`, `section`, `orchestrator`

## Anatomy
Root element: `.section`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| container | `.nc-container` | Yes | Container der den Inhalt horizontal begrenzt. |
| content | `.nc-container > *` | Yes | Beliebiger Inhalt innerhalb des Containers. |

### DOM Notes
- Section ist der Orchestrator: setzt Block-Padding, enthaelt Container, konfiguriert Grid.
- Nesting: .section > .nc-container > .o-grid > .o-col-* > Content
- Section referenziert Container, Grid und Spacing — nicht umgekehrt.
- Section-Modifikatoren (--compact, --spacious) ueberschreiben --nc-section-padding-block.
- Divider-Linien sind Rahmenkanten (border-block-start/-end) der Section aus --nc-section-divider-*; auf der Akzent-Flaeche in --nc-section-accent-color-secondary.
- Accent-Section invertiert Textfarben auf On-Accent fuer WCAG-Kontrast.
- Website-Form: neocosmo.de (Drupal) setzt .nc-section statt .section — <section class="nc-section"><div class="nc-container">…</div></section>. Nur Polsterung: padding-block var(--nc-section-padding-block, var(--fnd-spacing-10)); .nc-section--full setzt sie auf 0 (randlose Abschnitte polstern innen); .nc-section--muted malt die gedaempfte Flaeche (background-secondary). Die uebrigen Dichte-, Flaechen- und Divider-Modifier gelten nur fuer .section (siehe Block website).

## Variants
### Dichte (`density`)
Vertikales Padding der Section.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| compact | `.section--compact` |  |
| spacious | `.section--spacious` |  |

### Oberflaeche (`surface`)
Hintergrundfarbe und Farbschema der Section.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| base | — |  |
| elevated | `.section--elevated` |  |
| muted | `.section--muted` |  |
| accent | `.section--accent` |  |

### Divider (`divider`)
Horizontale Trennlinien am oberen und/oder unteren Rand der Section. Besonders noetig bei identischen Surface-Kombinationen benachbarter Sections.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| top | `.section--divider-top` |  |
| bottom | `.section--divider-bottom` |  |
| both | `.section--divider-both` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `section`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-section-padding-block` | — | `--mod-section-padding-block` |
| `--nc-section-padding-block-sm` | — | `--mod-section-padding-block-sm` |
| `--nc-section-padding-block-lg` | — | `--mod-section-padding-block-lg` |

### Surface
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-section-bg` | — | `--mod-section-bg` |
| `--nc-section-color` | — | `--mod-section-color` |

### Accent
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-section-accent-bg` | — | — |
| `--nc-section-accent-color` | — | — |
| `--nc-section-accent-color-secondary` | — | — |

### Divider
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-section-divider-color` | — | `--mod-section-divider-color` |
| `--nc-section-divider-width` | — | `--mod-section-divider-width` |
| `--nc-section-divider-style` | — | `--mod-section-divider-style` |

## Accessibility
Contrast Target: AA

- Section dient als visueller Trennbereich — kein semantisches Landmark (ausser wenn <section> mit aria-labelledby).
- Farbkontrast zwischen Section-Hintergrund und Text muss WCAG AA erfuellen.
- Accent-Variante: On-Accent-Farbe hat mindestens 4.5:1 Kontrast gegen Akzent-Hintergrund.
- Divider-Linien haben ausreichenden Kontrast (mindestens 3:1) gegen den jeweiligen Hintergrund.

## Dependencies
`container`

## Web Components Mapping
Derived from anatomy for potential `<nc-section>` custom element:

```js
class NcSection extends HTMLElement {
  static observedAttributes = ['density', 'surface', 'divider'];
  // Slots: <slot name="container">, <slot name="content">
}
```

---

*Generated from `data/section-recipe.json` by `scripts/generate-component-specs.js`*
