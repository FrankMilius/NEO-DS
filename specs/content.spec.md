# content Component Spec
> Version 1.1.0 | Status: stable | Layer: object

Tags: `layout`, `objects`, `lesen`

## Anatomy
Root element: `.nc-content`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| title | `.nc-content__title` | No | Titel als <h2> mit Link (rel="bookmark") — nur, wenn der Knoten nicht selbst die Seite ist (label and not page). |
| meta | `.nc-content__meta` | No | Autorbild und „Autor — Datum" (display_submitted); Lesebreite wie der Titel. |
| body | `.nc-content__body` | Yes | Alle Felder des Knotens ({{ content }}); ohne eigene Regel, das Body-Feld bringt .nc-prose mit (field--body.html.twig). |

### DOM Notes
- Lesespalte einer Inhaltsseite: der Rahmen darf weit sein (max-inline-size --container-xwide 1536, zentriert, Innenabstand --container-padding-inline), Titel und Angaben stehen in Lesebreite (--container-prose), mittig ueber der Prosa-Achse des Body-Felds.
- Drupal setzt .nc-content am <article class="node node--type-… node--view-mode-full nc-content"> der Vollansicht (node.html.twig, view_mode full); der Teaser ist .nc-card. Andere Ansichtsmodi rendern dasselbe Markup ohne .nc-content.
- Gilt nur fuer Inhaltstypen ohne eigenes Full-Template: landing-page, reference-page, event und news haben eigene Templates und tragen .nc-content nicht.
- body.is-reading-left (neo_fe_preprocess_html, Pfade /inside/blog und /inside/dokumentation) setzt Titel und Angaben an die Spaltenkante; das Body-Feld nutzt dort .nc-prose--left. Selektor am <body>, in der Arena nicht darstellbar.
- Die --nc-content-*-Tokens in _section.scss (Spaltenverhaeltnis, Rastergap) meinen nicht dieses Object; es hat keine eigenen Komponenten-Tokens.

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

- Ueberschriften-Hierarchie: auf der eigenen Seite traegt der Seitenkopf das <h1> (__title entfaellt), eingebettet ist __title ein <h2>.
- Titel und Angaben auf --container-prose (72ch) — gleiche Lesebreite wie das Body-Feld (WCAG 1.4.8).
- <article> ist das Element des Knotens; .nc-content fuegt keine Rolle hinzu.

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
