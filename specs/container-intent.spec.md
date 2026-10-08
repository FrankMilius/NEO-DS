# container-intent Component Spec
> Version 1.1.0 | Status: stable | Layer: object

Tags: `layout`, `objects`, `container`

## Anatomy
Root element: `.container`

### DOM Notes
- Intent-Container: Breiten nach Inhaltsabsicht (prose 72ch, narrow 768, content 1090, wide 1290, xwide 1536, full 100 %) aus den Foundation-Tokens --fnd-layout-container-*; :root stellt sie als --container-* bereit. Die --fnd-layout-container-* stehen in design-tokens.css (auf der Website eine eigene Datei vor styles.css); styles.css traegt dieselben Werte als Rueckfall in den Aliasen.
- .container ohne Breiten-Modifier hat keine Kappung (inline-size 100 %, zentriert, Innenabstand). Jeder Modifier setzt nur max-inline-size.
- Bewusst getrennt von .nc-container (Site-Shell); die --nc-container-max-width*-Tokens zeigen an der Quelle auf diese Skala. Die numerischen Modifier .nc-container--sm|md|lg|xl|xxl sind abgekuendigt.
- Website: das Section-Layout (neo_section_default) rendert <section class="nc-section"><div class="container container--{{ width }}"> — width aus dem Layout-Setting, Vorgabe content.
- Website, Passthrough-Modus: bestehen alle Bloecke einer Section aus autonomen neo_*-Bloecken (eigene <section> + .nc-container), rendert das Layout KEIN .container; die Breite geht als style="--mod-container-max-width: var(--container-<width>)" an den Wrapper (bei content entfaellt das Attribut) und wirkt ueber den .nc-container der Bloecke.
- Website, Kopfzeile: neo-nav.html.twig nutzt .container ohne Breite (.container.header-inner und in den Panels). Dort gilt die Geometrie aus 07-organisms/_navigation-tab-mega.scss (.site-header[data-neo-nav] .container: max-width --nn-content-max = xwide, Innenabstand in drei Phasen wie .nc-container) — nicht die Breiten dieses Objects.
- Innenabstand fluid ueber --container-padding-inline (= --fnd-spacing-06); Override --mod-container-padding-inline.

## Variants
### Breite (`width`)
Inhaltsabsicht

| Value | CSS Modifier | Default |
| --- | --- | --- |
| prose | `.container--prose` |  |
| narrow | `.container--narrow` |  |
| content | `.container--content` |  |
| wide | `.container--wide` |  |
| xwide | `.container--xwide` |  |
| full | `.container--full` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `container`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--container-content` | — | — |
| `--container-full` | — | — |
| `--container-narrow` | — | — |
| `--container-padding-inline` | — | — |
| `--container-prose` | — | — |
| `--container-wide` | — | — |
| `--container-xwide` | — | — |
| `--fnd-layout-container-content` | — | — |
| `--fnd-layout-container-full` | — | — |
| `--fnd-layout-container-narrow` | — | — |
| `--fnd-layout-container-prose` | — | — |
| `--fnd-layout-container-wide` | — | — |
| `--fnd-layout-container-xwide` | — | — |
| `--fnd-spacing-06` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Rein layoutgebend: keine Rolle, kein Landmark. Semantik traegt das umgebende Element (auf der Website <section class="nc-section">).
- Reflow (WCAG 1.4.10): inline-size 100 % mit box-sizing border-box und Innenabstand — bei 320 px kein horizontales Scrollen, Inhalt nie an der Kante.
- Lesetext gehoert in container--prose (72ch) oder in .nc-prose; content und breiter sind fuer Raster und Medien, nicht fuer Fliesstext ueber die volle Breite (WCAG 1.4.8, Zeilenlaenge).

## Web Components Mapping
Derived from anatomy for potential `<nc-container-intent>` custom element:

```js
class NcContainerIntent extends HTMLElement {
  static observedAttributes = ['width'];
  // Slots: default
}
```

---

*Generated from `data/container-intent-recipe.json` by `scripts/generate-component-specs.js`*
