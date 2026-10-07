# content Component Spec
> Version 1.0.0 | Status: draft | Layer: object

Tags: `layout`, `objects`, `lesen`

## Anatomy
Root element: `.nc-content`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| title | `.nc-content__title` | No | Titel — nur, wenn der Knoten nicht selbst die Seite ist (label and not page). |
| meta | `.nc-content__meta` | No | Autor und Datum (display_submitted). |
| body | `.nc-content__body` | Yes | Inhalt des Knotens; ohne eigene Regel, das Body-Feld bringt .nc-prose mit. |

### DOM Notes
- Lesespalte einer Inhaltsseite: der Rahmen darf weit sein (xwide 1536), Titel und Angaben stehen in Lesebreite (--container-prose).
- Drupal setzt .nc-content am <article> der Vollansicht (view_mode full); der Teaser ist .nc-card.
- body.is-reading-left setzt Titel und Angaben an die Spaltenkante (Selektor am <body>, in der Arena nicht darstellbar); das Body-Feld nutzt dann .nc-prose--left.
- Die --nc-content-*-Tokens in _section.scss meinen das Spaltenverhaeltnis eines Abschnitts, nicht dieses Object.

## Variants
### Variante (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-content`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--container-padding-inline` | — | — |
| `--container-prose` | — | — |
| `--container-xwide` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-content>` custom element:

```js
class NcContent extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="body">
}
```

---

*Generated from `data/content-recipe.json` by `scripts/generate-component-specs.js`*
