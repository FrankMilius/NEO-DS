# hero Component Spec
> Version 2.3.1 | Status: stable | Layer: organism

Tags: `display`, `content`, `hero`, `landing`

## Anatomy
Root element: `.nc-hero`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| content | `.nc-hero__content` | Yes | — |
| media | `.nc-hero__media` | No | — |
| actions | `.nc-hero__actions` | No | Primaere und sekundaere CTA-Buttons unterhalb der Highlights. |
| footer | `.nc-hero__footer` | No | Badges und Kennzahlen unter den Aktionen. |
| cards | `.nc-hero__cards` | No | Kennzahlen-Raster. Nutzt .nc-metric, kein eigenes Bauteil. |
| mark | `.nc-hero__mark` | No | Hervorhebung INNERHALB der Ueberschrift. Immer Balken — auch mit nc-hero--mark-tint (Entscheidung 06.10.2026); Tinte nur mit dem Element-Modifier .nc-hero__mark--tint. Nicht zu verwechseln mit .nc-hero__highlight, dem Eintrag der Merkmalsliste. |
| badges | `.nc-hero__badges` | No | Badge-Zeile ueber der Headline: .nc-badge-row.nc-hero__badges mit .nc-label; auf dunklem Hero eigener Schleier (--nc-badge-row-hero-*). |

### DOM Notes
- Grid: 2-Spalten ab 768px (split: 50/50 buendig). Content: text-inverse, gap 1rem.
- Title: fs-4xl, max-width 18ch fuer optimale Scanbarkeit.
- Highlights: Bullet-Liste mit accent-Punkt, line-height: tight fuer visuellen Zusammenhalt zum Titel.
- Card-Variante: radial-gradient dark BG, radius-3xl, Metric + Pulse-Animation.
- Picture-Variante: radius-sm, elevation-overlay. Overlay-Gradient sichert Kontrast unabhaengig vom Bildinhalt.
- Kicker: <p class='nc-hero__kicker'> ueber dem Titel. Token-gesteuert: --nc-hero-kicker-bg, -color, -size, -weight, -radius, -padding. Kein nc-label — eigenstaendiges Element.
- Subtitle: <p class='nc-hero__subtitle'> unter dem Titel. Token-gesteuert: --nc-hero-subtitle-size, -color, -max-width, -line-height.
- Overlay: <div class='nc-hero__overlay'> mit linear-gradient. Sichtbarkeit via --nc-hero-overlay-visible (1/0).
- Actions: Flex-Row mit gap, primaerer + sekundaerer Button. Alignment folgt der alignment-Achse.
- Breadcrumb: nc-breadcrumb am oberen Content-Rand, nur sichtbar wenn Slot befuellt.
- Centered: Alle Inhalte text-align center, max-width fuer Titel und Highlights.
- Split: Content links, Media rechts buendig (kein Radius), nahtlose Kante zum naechsten Abschnitt.

## Variants
### Variant (`variant`)
Visuelle Variante — picture, mockup, split

| Value | CSS Modifier | Default |
| --- | --- | --- |
| picture | — |  |
| split | `.nc-hero--split` |  |
| mockup | — |  |

### Alignment (`alignment`)
Content-Ausrichtung — start (default) oder center

| Value | CSS Modifier | Default |
| --- | --- | --- |
| start | — |  |
| center | `.nc-hero--center` |  |

### Surface (`surface`)
Flaeche und Vordergrund als PAAR. Kommt aus dem projektweiten Feld field_surface. accent (Lime) wird bewusst nicht bedient und faellt auf dark zurueck.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| dark | `.nc-hero--surface-dark` |  |
| muted | `.nc-hero--surface-muted` |  |
| light | `.nc-hero--surface-light` |  |

### Media Position (`mediaPosition`)
Auf welcher Seite das Medium steht. Der Inhalt bleibt im Markup zuerst; die Umstellung laeuft ueber order, nicht ueber die Quellreihenfolge.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| end | — |  |
| start | `.nc-hero--media-start` |  |

### Headline Mark (`markStyle`)
Hervorhebung in der Ueberschrift. Balken faerbt eine Flaeche hinter dem Text und laesst den Kontrast unangetastet; Tinte faerbt den Text selbst und braucht deshalb einen zur Flaeche passenden Wert. Der Modifier tint wirkt nur auf <mark>; .nc-hero__mark bleibt Balken (Entscheidung 06.10.2026).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| bar | — |  |
| tint | `.nc-hero--mark-tint` |  |

### Badges Position (`badgesPosition`)
Badge-Zeile ueber der Ueberschrift oder im Fuss unter den Aktionen. Vorgabe bleibt top, damit bestehende Seiten sich nicht verschieben.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| top | — |  |
| bottom | — |  |

### Ausrichtung der Kennzahlen (`cardsAlign`)
Getrennt von der Ausrichtung des Heroes: Ein zentrierter Hero kann linksbuendige Kennzahlen tragen und umgekehrt.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| start | `.nc-hero__cards--start` |  |
| center | `.nc-hero__cards--center` |  |
| end | `.nc-hero__cards--end` |  |

### Trennlinien der Kennzahlen (`cardsRule`)
Staerke und Farbe. Die Linie gliedert nur und kennzeichnet kein Bedienelement — 1.4.11 greift dort nicht, deshalb ist Lime hier zulaessig, wo es als Schriftfarbe unbrauchbar waere.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-hero__cards--rule-sm` |  |
| md | `.nc-hero__cards--rule-md` |  |
| lg | `.nc-hero__cards--rule-lg` |  |
| accent | `.nc-hero__cards--rule-accent` |  |

### Flaeche der Kennzahlen-Karten (`cardsSurface`)
Gewaehlt wird eine ROLLE, keine Farbe — die Werte folgen dem Thema. Mit gesetzter Flaeche wechselt auch die Schriftfarbe: Sie kommt dann aus den Thementoken statt vom Hero, sonst stuende weisse Schrift auf einer weissen Karte.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| base | `.nc-hero__cards--bg-base` |  |
| secondary | `.nc-hero__cards--bg-secondary` |  |
| tertiary | `.nc-hero__cards--bg-tertiary` |  |
| inverse | `.nc-hero__cards--bg-inverse` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-hero`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-bg` | — | `--mod-hero-bg` |
| `--nc-hero-min-height` | — | `--mod-hero-min-height` |
| `--nc-hero-padding-block` | — | `--mod-hero-padding-block` |
| `--nc-hero-padding-inline` | — | — |
| `--nc-hero-gap` | — | `--mod-hero-gap` |
| `--nc-hero-radius` | — | `--mod-hero-radius` |

### Overlay
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-overlay-visible` | — | `--mod-hero-overlay-visible` |
| `--nc-hero-overlay-start` | — | `--mod-hero-overlay-start` |
| `--nc-hero-overlay-end` | — | `--mod-hero-overlay-end` |
| `--nc-hero-overlay-direction` | — | `--mod-hero-overlay-direction` |

### Kicker
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-kicker-size` | — | `--mod-hero-kicker-size` |
| `--nc-hero-kicker-weight` | — | `--mod-hero-kicker-weight` |
| `--nc-hero-kicker-bg` | — | `--mod-hero-kicker-bg` |
| `--nc-hero-kicker-color` | — | `--mod-hero-kicker-color` |
| `--nc-hero-kicker-radius` | — | `--mod-hero-kicker-radius` |
| `--nc-hero-kicker-padding` | — | `--mod-hero-kicker-padding` |

### Title
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-title-size` | — | `--mod-hero-title-size` |
| `--nc-hero-title-weight` | — | `--mod-hero-title-weight` |
| `--nc-hero-title-color` | — | `--mod-hero-title-color` |
| `--nc-hero-title-max-width` | — | `--mod-hero-title-max-width` |
| `--nc-hero-title-line-height` | — | `--mod-hero-title-line-height` |

### Subtitle
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-subtitle-size` | — | `--mod-hero-subtitle-size` |
| `--nc-hero-subtitle-color` | — | `--mod-hero-subtitle-color` |
| `--nc-hero-subtitle-max-width` | — | `--mod-hero-subtitle-max-width` |
| `--nc-hero-subtitle-line-height` | — | `--mod-hero-subtitle-line-height` |

### Highlights
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-highlights-gap` | — | `--mod-hero-highlights-gap` |
| `--nc-hero-highlights-color` | — | `--mod-hero-highlights-color` |
| `--nc-hero-highlights-marker` | — | `--mod-hero-highlights-marker` |
| `--nc-hero-highlights-size` | — | `--mod-hero-highlights-size` |

### Actions
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-actions-gap` | — | `--mod-hero-actions-gap` |
| `--nc-hero-actions-margin-top` | — | `--mod-hero-actions-margin-top` |

### Flaeche
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-surface-dark-bg` | — | — |
| `--nc-hero-surface-dark-fg` | — | — |
| `--nc-hero-surface-light-bg` | — | — |
| `--nc-hero-surface-light-fg` | — | — |
| `--nc-hero-surface-muted-bg` | — | — |

### Hervorhebung in der Ueberschrift
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-mark-color` | — | `--mod-hero-mark-color` |
| `--nc-hero-mark-thickness` | — | `--mod-hero-mark-thickness` |
| `--nc-hero-mark-on-light` | — | — |
| `--nc-hero-mark-on-dark` | — | — |
| `--nc-hero-mark-tint` | — | `--mod-hero-mark-tint` |
| `--nc-hero-mark-tint-on-light` | — | — |
| `--nc-hero-mark-tint-on-dark` | — | — |

### Fuss: Badges und Kennzahlen
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-footer-margin-top` | — | `--mod-hero-footer-margin-top` |
| `--nc-hero-footer-gap` | — | `--mod-hero-footer-gap` |
| `--nc-hero-cards-gap` | — | `--mod-hero-cards-gap` |
| `--nc-hero-footer-rule` | — | — |
| `--nc-hero-cards-stack` | — | `--mod-hero-cards-stack` |
| `--nc-hero-cards-rule-width-sm` | — | — |
| `--nc-hero-cards-rule-width-md` | — | — |
| `--nc-hero-cards-rule-width-lg` | — | — |
| `--nc-hero-cards-rule-inset` | — | `--mod-hero-cards-rule-inset` |
| `--nc-hero-cards-rule-color` | — | `--mod-hero-cards-rule-color` |
| `--nc-hero-cards-rule-accent` | — | — |
| `--nc-hero-cards-kicker-size` | — | `--mod-hero-cards-kicker-size` |
| `--nc-hero-cards-value-size` | — | `--mod-hero-cards-value-size` |
| `--nc-hero-cards-label-size` | — | `--mod-hero-cards-label-size` |
| `--nc-hero-cards-rule-on-dark` | — | — |
| `--nc-hero-cards-rule-on-light` | — | — |
| `--nc-hero-cards-bg` | — | `--mod-hero-cards-bg` |
| `--nc-hero-cards-fg` | — | `--mod-hero-cards-fg` |
| `--nc-hero-cards-fg-muted` | — | `--mod-hero-cards-fg-muted` |
| `--nc-hero-cards-radius` | — | `--mod-hero-cards-radius` |
| `--nc-hero-cards-pad` | — | `--mod-hero-cards-pad` |

### Split-Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-split-columns` | — | `--mod-hero-split-columns` |
| `--nc-hero-split-media-min-height` | — | `--mod-hero-split-media-min-height` |
| `--nc-hero-split-gap` | — | `--mod-hero-split-gap` |

### Dashboard-Attrappe
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-hero-mockup-width` | — | `--mod-hero-mockup-width` |
| `--nc-hero-mockup-ratio` | — | `--mod-hero-mockup-ratio` |
| `--nc-hero-mockup-radius` | — | `--mod-hero-mockup-radius` |
| `--nc-hero-mockup-padding` | — | `--mod-hero-mockup-padding` |
| `--nc-hero-mockup-gap` | — | `--mod-hero-mockup-gap` |

## Accessibility
Contrast Target: WCAG AA large text (3:1)

- Picture-Variante: Overlay-Gradient muss ausreichend Kontrast fuer text-inverse sichern (min 3:1 auf jedem Bildinhalt).
- Card: Pulse-Animation muss via prefers-reduced-motion deaktivierbar sein.
- Badge: Darf nicht allein durch Farbe Bedeutung vermitteln — Text oder Icon erforderlich.
- Actions: Buttons muessen fokussierbar sein und sichtbaren Focus-Ring haben.
- Breadcrumb: aria-label='Breadcrumb', nav-Element.

## Web Components Mapping
Derived from anatomy for potential `<nc-hero>` custom element:

```js
class NcHero extends HTMLElement {
  static observedAttributes = ['variant', 'alignment', 'surface', 'mediaPosition', 'markStyle', 'badgesPosition', 'cardsAlign', 'cardsRule', 'cardsSurface'];
  // Slots: <slot name="content">
}
```

---

*Generated from `data/hero-recipe.json` by `scripts/generate-component-specs.js`*
