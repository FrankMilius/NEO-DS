# form-section Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `form`, `layout`, `grouping`

## Anatomy
Root element: `.nc-form-section`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| header | `.nc-form-section__header` | No | — |
| title | `.nc-form-section__title` | No | — |
| description | `.nc-form-section__description` | No | — |
| content | `.nc-form-section__content` | Yes | — |

### DOM Notes
- Logische Gruppierung innerhalb eines Formulars mit optionalem Titel + Beschreibung.
- Root: flex-column, gap via nc-form-gap. Aufeinanderfolgende Sections: margin-top section-gap.
- Header: flex-column, Titel (H2/H3) + Beschreibung. margin-bottom spacing-02.
- Content: flex-column mit nc-form-gap, enthaelt .nc-form-field Kinder.
- Bordered: border-top + padding-top. Erste Section: keine Border.
- Compact: reduzierte Abstaende (spacing-03 statt spacing-06).
- Trennlinie: .nc-form-divider als eigenstaendiges <hr>-Element.

## Variants
### Variant (`variant`)
Variante — default (ohne Trennlinie), bordered (border-top), compact (weniger Abstand)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| bordered | `.nc-form-section--bordered` |  |
| compact | `.nc-form-section--compact` |  |

### Content (`content`)
Inhalt — fields-only (nur Fields), with-header (Titel + Beschreibung + Fields), with-title (nur Titel + Fields)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| fields-only | — |  |
| with-header | — |  |
| with-title | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-form-section`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-section-gap` | — | `--mod-form-section-gap` |
| `--nc-form-gap` | — | `--mod-form-gap` |
| `--nc-form-divider-color` | — | `--mod-form-divider-color` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName

## Dependencies
`form`

## Web Components Mapping
Derived from anatomy for potential `<nc-form-section>` custom element:

```js
class NcFormSection extends HTMLElement {
  static observedAttributes = ['variant', 'content'];
  // Slots: <slot name="content">
}
```

---

*Generated from `data/form-section-recipe.json` by `scripts/generate-component-specs.js`*
