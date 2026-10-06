# chapter-nav Component Spec
> Version 1.2.0 | Status: stable | Layer: 07-organisms

Tags: `navigation`, `anchor`, `sticky`, `long-page`, `editorial`

## Anatomy
Root element: `.nc-chapter-nav`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| Leiste, quer scrollbar | `.nc-chapter-nav__inner` | Yes | — |
| Kapitelverweis | `.nc-chapter-nav__link` | Yes | — |
| Verzeichnis am Seitenanfang | `.nc-chapter-toc` | No | — |
| Nummerierte Kapitelliste | `.nc-chapter-toc__list` | No | — |
| Sprungziel am Block | `.nc-chapter-anchor` | Yes | — |

### DOM Notes
- Dieses Recipe schrieb bis zum 24.08.2026 root als Zeichenkette und die Slots ohne fuehrenden Punkt — anders als alle 130 uebrigen. Damit war das Bauteil fuer jede Pruefung unsichtbar: die Verwendungsmessung sah null Zeugen, obwohl es live auf den Landing Pages steht, und die Markup-Ernte fand keinen Wurzelselektor.
- meta.component hiess bis zum 24.08.2026 "chapternav" und wich damit als einziges der 131 Recipes vom Dateinamen ab. Der Story-Generator sucht die Markup-Datei ueber diesen Namen und fand deshalb chapternav.html statt chapter-nav.html — das Bauteil blieb ohne Markup, obwohl es geerntet war. Die CSS-Klasse heisst weiterhin .nc-chapter-nav; das ist eine eigene Unstimmigkeit und steht im BACKLOG.
- Verhalten (neo-behaviors chapter-nav, Leiste .nc-chapter-nav mit a.nc-chapter-nav__link[href="#<id>"], Kapitel per id im Dokument): Scroll-Spy setzt aria-current="true" am Verweis des LETZTEN Kapitels, dessen Oberkante die Linie passiert hat (Linie = max(scroll-margin-top, Kopfzeile .site-header[data-neo-nav] + Leiste) + 24 px); ueber dem ersten Kapitel bleibt das erste markiert. Klick: markiert sofort, Spy ruht bis das Scrollen steht, sanfter Sprung (reduced motion: sofort), pushState des Ankers, Fokus aufs Kapitel (tabindex=-1). Scroll-Container: naechster Vorfahr mit overflow-y auto/scroll, sonst das Fenster.

## Variants
### Form (`form`)
Genau eine Form je Seite. Leiste UND Verzeichnis gleichzeitig sagen dasselbe zweimal untereinander und ueberladen die Seite — deshalb keine Kombination, sondern eine Wahl.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| leiste | — |  |
| verzeichnis | `.nc-chapter-toc` |  |
| keine | — |  |

## States
Supported: `default`, `current`

- **current**: 

## CSS Token API
Base classes: `nc-chapter-nav`

### Kapitelleiste
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-chapter-nav-bg` | — | `--mod-chapter-nav-bg` |
| `--nc-chapter-nav-border` | — | `--mod-chapter-nav-border` |
| `--nc-chapter-nav-gap` | — | `--mod-chapter-nav-gap` |
| `--nc-chapter-nav-padding-block` | — | `--mod-chapter-nav-padding-block` |
| `--nc-chapter-nav-padding` | — | `--mod-chapter-nav-padding` |
| `--nc-chapter-nav-family` | — | `--mod-chapter-nav-family` |
| `--nc-chapter-nav-size` | — | `--mod-chapter-nav-size` |
| `--nc-chapter-nav-weight` | — | `--mod-chapter-nav-weight` |
| `--nc-chapter-nav-color` | — | `--mod-chapter-nav-color` |
| `--nc-chapter-nav-color-active` | — | `--mod-chapter-nav-color-active` |
| `--nc-chapter-nav-marker` | — | `--mod-chapter-nav-marker` |
| `--nc-chapter-nav-marker-height` | — | `--mod-chapter-nav-marker-height` |
| `--nc-chapter-nav-top` | — | `--mod-chapter-nav-top` |

### Verzeichnis
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-chapter-nav-toc-bg` | — | `--mod-chapter-nav-toc-bg` |
| `--nc-chapter-nav-toc-border` | — | `--mod-chapter-nav-toc-border` |
| `--nc-chapter-nav-toc-radius` | — | `--mod-chapter-nav-toc-radius` |
| `--nc-chapter-nav-toc-padding` | — | `--mod-chapter-nav-toc-padding` |
| `--nc-chapter-nav-toc-gap` | — | `--mod-chapter-nav-toc-gap` |
| `--nc-chapter-nav-toc-title-size` | — | `--mod-chapter-nav-toc-title-size` |
| `--nc-chapter-nav-toc-title-color` | — | `--mod-chapter-nav-toc-title-color` |
| `--nc-chapter-nav-toc-size` | — | `--mod-chapter-nav-toc-size` |
| `--nc-chapter-nav-toc-color` | — | `--mod-chapter-nav-toc-color` |
| `--nc-chapter-nav-toc-number-color` | — | `--mod-chapter-nav-toc-number-color` |

### Sprungziel
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-chapter-nav-scroll-margin` | — | `--mod-chapter-nav-scroll-margin` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | jump | Auf einem Kapitelverweis: markiert ihn sofort (aria-current), scrollt das Kapitel unter Kopfzeile und Leiste und setzt den Fokus aufs Kapitel — Tab geht von dort im Inhalt weiter. |
| `Tab` | native | Die Verweise sind normale Links in der Tab-Folge (kein roving tabindex). |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `chapter-nav-change` | Yes | `{"value":"string","previousValue":"string"}` |

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-chapter-nav>` custom element:

```js
class NcChapterNav extends HTMLElement {
  static observedAttributes = ['form'];
  // Slots: <slot name="Leiste, quer scrollbar">, <slot name="Kapitelverweis">, <slot name="Sprungziel am Block">
}
```

---

*Generated from `data/chapter-nav-recipe.json` by `scripts/generate-component-specs.js`*
