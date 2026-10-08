# reference-page Component Spec
> Version 1.1.0 | Status: stable | Layer: organism

Tags: `content`, `organisms`, `navigation`, `website-block`

## Anatomy
Root element: `.nc-refpage`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| toc | `.nc-refpage__toc` | Yes | <nav aria-label="Inhaltsverzeichnis">, sticky; unter 1024 px oben (Klebepunkt --nc-nav-height + spacing-03), darueber rechte Spalte mit Polsterung wie die Abschnitte, eigener Scrollbereich (max. Fensterhoehe, Scrollleiste ausgeblendet). |
| toc-disclosure | `.nc-refpage__toc-disclosure` | Yes | <details open> — unter 1024 px aufklappbare Liste mit Rahmen (das JS schliesst sie dort beim Laden und nach jedem Sprung), darueber immer offen und ohne Rahmen. |
| toc-summary | `.nc-refpage__toc-summary` | Yes | <summary> „Inhalt" (nur unter 1024 px sichtbar). |
| toc-chevron | `.nc-refpage__toc-chevron` | Yes | Pfeil im summary, dreht beim Oeffnen. |
| toc-title | `.nc-refpage__toc-title` | Yes | „Auf dieser Seite". |
| toc-list | `.nc-refpage__toc-list` | Yes | Liste der Eintraege; --sub fuer Unterpunkte. |
| toc-link | `.nc-refpage__toc-link` | Yes | Eintrag mit <span> und data-text (unsichtbarer fetter Zwilling haelt die Hoehe); aria-current="true" markiert den aktuellen Abschnitt (Scroll-Spy in neo-theme.js) — Textfarbe, Schnitt und Markierungsleiste. |
| content | `.nc-refpage__content` | Yes | Die Abschnitte (Layout-Builder-Sections, data-refpage-content); innere .nc-container verlieren Breite und Polsterung, weil .nc-refpage selbst der Container ist. |
| section | `.nc-refpage__section` | No | Sprungziel mit scroll-margin-top (--nc-nav-height + spacing-05): Drupal setzt die Klasse samt Anker-ID an den Wrapper JEDES Blocks mit Ueberschrift auf der Referenzseite und an jeden Unterabschnitt von doc-section. |
| doc-section | `.nc-doc-section` | No | Abschnitt einer Referenzseite (Block neo_doc_section): <section class="nc-section nc-doc-section"> > .nc-container mit neo_fe:block-header (ohne Modifier, h2) und Unterabschnitten. |
| doc-section-items | `.nc-doc-section__items` | No | Unterabschnitte. |
| doc-section-item | `.nc-doc-section__item` | No | Unterabschnitt (<section> mit id = Block-Anker--Titel, gleiche Titel im Block mit -2, -3; zusaetzlich .nc-refpage__section); Haarlinie und Abstand zwischen zweien. |
| doc-section-title | `.nc-doc-section__title` | No | h3 des Unterabschnitts. |
| doc-section-text | `.nc-doc-section__text` | No | Text (<p>, field_ds_sections text) in Lesebreite --container-prose, text-secondary. |
| doc-section-list | `.nc-doc-section__list` | No | Aufzaehlung (items) in Lesebreite mit Akzent-Markern (text-accent). |

### DOM Notes
- Inhaltstyp reference_page: <article> > fuehrende Vollbreite-Sections (refpage_above, z. B. Hero) > <div class="nc-refpage nc-container"> > nav.nc-refpage__toc + .nc-refpage__content. Ohne Verzeichniseintraege rendert Drupal kein .nc-refpage, sondern nur den Inhalt.
- DOM-Reihenfolge Verzeichnis -> Inhalt (Sprungliste zuerst); ab 1024 px steht der Inhalt per grid-column links, das Verzeichnis rechts (--nc-refpage-toc-width 300px, Spaltenabstand --nc-refpage-column-gap); darunter uebereinander mit --nc-refpage-gap.
- Verzeichnis serverseitig (neo_fe_preprocess_node): ein Eintrag je Block mit Ueberschrift ausserhalb der fuehrenden Vollbreite-Sections, Unterpunkte nur aus den Unterabschnitten von neo_doc_section (ID Block-Anker--Titel). Node- und Block-Preprocess rechnen die Anker unabhaengig aus derselben Ueberschrift (_neo_fe_slug) und stimmen ohne JS ueberein — ausser bei gleichen Block-Ueberschriften: nur der Node-Preprocess zaehlt sie hoch (-2, -3), die Bloecke nicht (doppelte ID, toter Verzeichniseintrag; Befund fuer neo_fe).
- Verhalten (neo-theme.js, Drupal.behaviors.neoRefpageToc): Scroll-Spy — aktuell ist der LETZTE Abschnitt, dessen Oberkante die Linie Kopfzeilenhoehe (.site-header[data-neo-nav], offsetHeight) + 24 px passiert hat; ueber dem ersten Abschnitt der erste, solange die Seite oben steht. IntersectionObserver plus Scroll-Auswertung per requestAnimationFrame. Klick und Aufruf mit Anker markieren sofort. Unter 1024 px (matchMedia) startet das Verzeichnis zu und schliesst nach jedem Sprung.
- Das Verhalten gehoert nach neo-behaviors (Website-Bauteil, nur auf ausdrueckliche Anforderung wie chapter-nav, dessen Spy dieselbe Regel fuehrt). Unterschiede zu chapter-nav: keine Ende-der-Seite-Regel (ein kurzer letzter Abschnitt wird nie markiert), kein Fokus auf das Sprungziel, kein Ereignis. Bis zur Migration keine keyboard/events im Recipe.
- Umbruch 1024 px steht zweimal: als SCSS-Variable $refpage-bp (Media Query, Fensterbreite) und im JS (matchMedia). Die Arena zeigt die Desktop-Lage.
- data-text am Link baut einen unsichtbaren fetten Zwilling — der aktive Eintrag bricht nicht um. Inaktive Eintraege text-tertiary, aktiv text-primary + semibold + Markierungsleiste --nc-refpage-active-color (--nc-refpage-marker-width).
- .nc-doc-section (Block neo_doc_section) hat keine eigene Regel an der Wurzel; der Kopf ist neo_fe:block-header ohne Modifier, die Unterabschnitte folgen mit spacing-07 Abstand. Fremde Tokens im SCSS: --nc-nav-height, --nc-section-padding-block, --nc-type-body-m-size, --nc-type-label-size, --container-prose.

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

- 2.4.1: Das Verzeichnis ist ein <nav> mit aria-label und steht im DOM vor dem Inhalt.
- 1.4.1: Der aktuelle Eintrag traegt aria-current="true" und zusaetzlich Schriftschnitt und Markierungsleiste — nicht nur Farbe.
- 2.4.7: Jedes Sprungziel (.nc-refpage__section) hat scroll-margin-top gegen die klebende Kopfzeile.
- Unter 1024 px <details>/<summary> statt eigener Klapplogik: Tastatur, Rolle und Zustand vom Browser; Pfeil aria-hidden.
- Die Anker stehen im ausgelieferten HTML: Sprung und geteilte URL funktionieren ohne JavaScript; ohne JS fehlt nur die Markierung.
- Kontrast AA hell und dunkel: inaktive Eintraege und Verzeichnistitel text-tertiary (gemessen ab 5,75:1), Text der Abschnitte text-secondary.

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
