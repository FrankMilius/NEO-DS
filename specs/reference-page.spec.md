# reference-page Component Spec
> Version 1.0.0 | Status: draft | Layer: organism

Tags: `content`, `organisms`, `navigation`, `website-block`

## Anatomy
Root element: `.nc-refpage`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| toc | `.nc-refpage__toc` | Yes | Verzeichnis (<nav aria-label>), sticky; ab 1024 px rechte Spalte. |
| toc-disclosure | `.nc-refpage__toc-disclosure` | Yes | <details> — unter 1024 px aufklappbare Liste, darueber ohne Rahmen. |
| toc-summary | `.nc-refpage__toc-summary` | Yes | <summary> „Inhalt" (nur unter 1024 px sichtbar). |
| toc-chevron | `.nc-refpage__toc-chevron` | Yes | Pfeil im summary, dreht beim Oeffnen. |
| toc-title | `.nc-refpage__toc-title` | Yes | „Auf dieser Seite". |
| toc-list | `.nc-refpage__toc-list` | Yes | Liste der Eintraege; --sub fuer Unterpunkte. |
| toc-link | `.nc-refpage__toc-link` | Yes | Eintrag; aria-current="true" markiert den aktuellen Abschnitt (Scroll-Spy in neo-theme.js). |
| content | `.nc-refpage__content` | Yes | Die Abschnitte (Layout-Builder-Sections); innere .nc-container verlieren Breite und Polster. |
| section | `.nc-refpage__section` | No | Sprungziel mit scroll-margin-top gegen die Sticky-Navigation. |
| doc-section | `.nc-doc-section` | No | Abschnitt einer Referenzseite (Block neo_doc_section): Kopf und Unterabschnitte. |
| doc-section-items | `.nc-doc-section__items` | No | Unterabschnitte. |
| doc-section-item | `.nc-doc-section__item` | No | Unterabschnitt (<section> mit id); Trennlinie zwischen zweien. |
| doc-section-title | `.nc-doc-section__title` | No | h3 des Unterabschnitts. |
| doc-section-text | `.nc-doc-section__text` | No | Text in Lesebreite. |
| doc-section-list | `.nc-doc-section__list` | No | Aufzaehlung mit Akzent-Markern. |

### DOM Notes
- Inhaltstyp reference-page: <div class="nc-refpage nc-container"> > nav.nc-refpage__toc + .nc-refpage__content. DOM-Reihenfolge Verzeichnis -> Inhalt (Sprungliste zuerst); ab 1024 px steht der Inhalt per grid-column links.
- Das Verzeichnis kommt serverseitig aus den Sections (Anker-IDs im HTML); neo-theme.js setzt nur aria-current (Scroll-Spy).
- data-text am Link baut einen unsichtbaren fetten Zwilling — der aktive Eintrag bricht nicht um.
- Umbruch 1024 px als Media Query (Fensterbreite) — die Arena zeigt die Desktop-Lage.
- .nc-doc-section (Block neo_doc_section) hat keine eigene Regel an der Wurzel; Unterabschnitte tragen zusaetzlich .nc-refpage__section.

## Variants
### Variante (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-refpage`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-refpage-gap` | — | `--mod-refpage-gap` |
| `--nc-refpage-column-gap` | — | `--mod-refpage-column-gap` |
| `--nc-refpage-toc-width` | — | `--mod-refpage-toc-width` |

### Verzeichnis
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-refpage-toc-size` | — | `--mod-refpage-toc-size` |
| `--nc-refpage-toc-sub-size` | — | `--mod-refpage-toc-sub-size` |
| `--nc-refpage-toc-title-size` | — | `--mod-refpage-toc-title-size` |
| `--nc-refpage-marker-width` | — | `--mod-refpage-marker-width` |
| `--nc-refpage-active-color` | — | `--mod-refpage-active-color` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-reference-page>` custom element:

```js
class NcReferencePage extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="toc">, <slot name="toc-disclosure">, <slot name="toc-summary">, <slot name="toc-chevron">, <slot name="toc-title">, <slot name="toc-list">, <slot name="toc-link">, <slot name="content">
}
```

---

*Generated from `data/reference-page-recipe.json` by `scripts/generate-component-specs.js`*
