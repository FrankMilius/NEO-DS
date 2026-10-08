# news Component Spec
> Version 1.2.0 | Status: stable | Layer: organism

Tags: `aufgenommen`, `organisms`

## Anatomy
Root element: `.nc-news`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| hero | `.nc-news__hero` | Yes | <header>, Artikel-Kopf: mindestens 400 px hoch, Inhalt senkrecht mittig, background-base und text-primary des Themas. |
| hero--has-media | `.nc-news__hero--has-media` | No | Modifier mit Titelbild (field_hero_image); Drupal setzt dazu neo-dark-theme — die Theme-Tokens im Hero werden dunkel. Ohne eigene Regel. |
| hero-media | `.nc-news__hero-media` | No | Titelbild als Hintergrund (background-size cover); Instanzwerte inline: background-image, background-position aus dem Fokuspunkt (field_hero_focus_x/_y), transform scale aus dem Zoom (field_hero_zoom, mindestens 1). |
| hero-overlay | `.nc-news__hero-overlay` | No | Verlauf ueber dem Bild (--nc-news-hero-overlay-background), aria-hidden; nur mit Bild. |
| hero-inner | `.nc-news__hero-inner` | Yes | Inhalt des Heros: Breite --mod-container-max-width aus nc-cw-<field_hero_width> (Vorgabe wide), Rueckfall container-content; seitliche Polsterung container-padding-inline. |
| eyebrow | `.nc-news__eyebrow` | Yes | Dachzeile: Flex-Zeile mit Kicker und Datum, caption; steht immer, bleibt ohne Werte leer. |
| kicker | `.nc-news__kicker` | No | Dachzeile (field_kicker): semibold, Satz und Farbe aus den geteilten --nc-kicker-*-Tokens. |
| date | `.nc-news__date` | No | Datum (field_news_date, Formatierung des Feldes), text-secondary. |
| title | `.nc-news__title` | Yes | Titel (<h1> mit dem Knotentitel): --nc-news-title-*, text-primary. |
| lead | `.nc-news__lead` | No | Zusammenfassung (field_summary, <div>): --nc-news-lead-*, text-secondary, hoechstens 65ch. |
| hero-cta | `.nc-news__hero-cta` | No | Knopf im Hero (field_hero_cta, Ausgabe des Feldes). |
| body | `.nc-news__body` | Yes | Textbereich (field_news_text, u-prose): Breite aus nc-cw-<field_content_width> (Vorgabe content), Polsterung spacing-10 oben und unten. |
| footer | `.nc-news__footer` | No | <footer class="nc-news__footer nc-container"> (nur mit Fuss-CTA oder Kontaktlink): Trennlinie oben, Links in text-accent semibold; feste Breite container-content. |
| footer-cta | `.nc-news__footer-cta` | No | Huelle des Fuss-Links (field_footer_cta) — ohne eigene Regel. |
| contact | `.nc-news__contact` | No | Huelle des Kontaktlinks (field_contact_link) — ohne eigene Regel. |

### DOM Notes
- Website: node--news--full.html.twig rendert <article class="node node--type-news nc-news"> mit Hero (<header>), Textbereich und optionaler Fusszeile; Werte aus content.field_* und neo_fe_preprocess_node (news.hero_bg_url, focus_x/_y, zoom, hero_width, content_width).
- Mit Titelbild: <header class="nc-news__hero nc-news__hero--has-media neo-dark-theme"> — der Hero bindet die Theme-Tokens dunkel (Text hell auf dem Verlauf), ohne Bild folgt er dem Seitenthema.
- Inhaltsbreiten: nc-cw-* (10-utilities/_content-width.scss) setzt --mod-container-max-width, das __hero-inner und __body lesen; die Fusszeile nimmt nc-container und haelt container-content.
- Ueberschrift: h1 (Knotentitel). Die Arena zeigt h2, weil der Konfigurator die Seitenueberschrift selbst traegt.
- Kein Verhalten.

## Variants
### Variant (`variant`)
Einzige Variante — mit und ohne Titelbild per Specimen.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-news`

### Alle
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-news-eyebrow-gap` | — | `--mod-news-eyebrow-gap` |
| `--nc-news-footer-a-font-weight` | — | `--mod-news-footer-a-font-weight` |
| `--nc-news-hero-overlay-background` | — | `--mod-news-hero-overlay-background` |
| `--nc-news-lead-font-size` | — | `--mod-news-lead-font-size` |
| `--nc-news-lead-line-height` | — | `--mod-news-lead-line-height` |
| `--nc-news-title-font-size` | — | `--mod-news-title-font-size` |
| `--nc-news-title-font-weight` | — | `--mod-news-title-font-weight` |
| `--nc-news-title-line-height` | — | `--mod-news-title-line-height` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Eine h1 je Seite (Titel im Hero), der Text darunter beginnt mit h2.
- Titelbild ist Hintergrund ohne Alternativtext — es darf keine Information tragen, die nicht im Text steht; der Verlauf ist aria-hidden.
- Mit Bild ist der Hero dunkel gebunden (neo-dark-theme) — Dachzeile, Datum, Titel und Zusammenfassung hell auf dem Verlauf; ohne Bild gemessen ab 5,74:1 (hell) bzw. 8,34:1 (dunkel).
- Datum als Ausgabe des Feldes; ein <time datetime> setzt der Feld-Formatter, nicht das Template.
- Fusszeilen-Links in text-accent (5,74:1 hell) mit sichtbarem Text.

## Web Components Mapping
Derived from anatomy for potential `<nc-news>` custom element:

```js
class NcNews extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="hero">, <slot name="hero-inner">, <slot name="eyebrow">, <slot name="title">, <slot name="body">
}
```

---

*Generated from `data/news-recipe.json` by `scripts/generate-component-specs.js`*
