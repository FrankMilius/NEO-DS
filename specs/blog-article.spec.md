# blog-article Component Spec
> Version 1.0.0 | Status: stable | Layer: template

Tags: `templates`, `content`, `blog`, `website`

## Anatomy
Root element: `.t-article.t-article--blog`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| header | `.t-article__header` | Yes | Kopf: Kategorie, Titel, Untertitel, .nc-byline, .nc-share-bar. |
| category | `.t-article__category` | No | Kategorie als Link zur Themen- bzw. Blog-Seite, Grossbuchstaben in der Kicker-Schrift. |
| title | `.t-article__title` | Yes | <h1> (auf der Artikelseite), heading xl. |
| subtitle | `.t-article__subtitle` | No | Untertitel (Drupal field_subtitle, 200 Zeichen). |
| figure | `.t-article__figure` | No | <figure> mit <img> und <figcaption>; je Seite bis zu --nc-blog-article-figure-bleed breiter als die Textspalte. |
| prose | `.t-article__prose` | Yes | Fliesstext (Drupal body): p, h2/h3, blockquote, ul/ol, mark. Spalte --nc-blog-article-measure. |
| tags | `.t-article__tags` | No | <ul aria-label="Schlagwörter"> mit .nc-chip als Links. |

### DOM Notes
- Die Wurzel traegt die Fliesstextgroesse; dadurch misst ch in der Spaltenbreite dieselbe Schrift wie die Prosa. Titel, Untertitel, Kategorie und Bildunterschrift setzen ihre Groesse selbst.
- Raster: Spalten wide und content; alle Kinder in content, die Figur in wide. Unter der Spaltenbreite schrumpfen die Randspalten auf 0.
- Die Blase .nc-share-bar__popover fuer eine markierte Stelle gehoert zur Teilen-Leiste (Recipe share-bar) und steht im Fliesstext.

## Variants
### Hauptbild (`figure`)
Mit Hauptbild und Bildunterschrift oder ohne (Artikel ohne Bild).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| with | — |  |
| without | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `t-article`, `t-article--blog`

### Fließtext und Spalte
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-blog-article-font-size` | — | — |
| `--nc-blog-article-line-height` | — | — |
| `--nc-blog-article-measure` | — | — |
| `--nc-blog-article-gap` | — | — |

### Kopf
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-blog-article-category-color` | — | — |
| `--nc-blog-article-subtitle-size` | — | — |
| `--nc-blog-article-subtitle-color` | — | — |

### Bild, Zitat und Markierung
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-blog-article-figure-bleed` | — | — |
| `--nc-blog-article-caption-color` | — | — |
| `--nc-blog-article-quote-size` | — | — |
| `--nc-blog-article-quote-border-width` | — | — |
| `--nc-blog-article-quote-border-color` | — | — |
| `--nc-blog-article-mark-bg` | — | — |
| `--nc-blog-article-mark-color` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Ein <h1> je Seite (Titel), Zwischentitel ab <h2>
- Hauptbild mit Alternativtext, Bildunterschrift in <figcaption>
- Tags in <ul aria-label="Schlagwörter">
- Bei 390 px kein seitliches Scrollen
- Zeilenlaenge im Fliesstext 60 bis 70 Zeichen

## Web Components Mapping
Derived from anatomy for potential `<nc-blog-article>` custom element:

```js
class NcBlogArticle extends HTMLElement {
  static observedAttributes = ['figure'];
  // Slots: <slot name="header">, <slot name="title">, <slot name="prose">
}
```

---

*Generated from `data/blog-article-recipe.json` by `scripts/generate-component-specs.js`*
