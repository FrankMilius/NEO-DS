# footer Component Spec
> Version 2.1.0 | Status: stable | Layer: organism

Tags: `navigation`, `layout`, `content`, `cta`

## Anatomy
Root element: `.nc-footer`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| cta-area | `.nc-footer__cta` | No | Engagement-CTA: Kicker, Headline und Button. Nur aktiv bei layout=cta-active. |
| columns | `.nc-footer__columns` | No | Sitemap-Grid: 2-4 Spalten mit Link-Listen. Nur aktiv bei layout=columns oder cta-active. |
| column | `.nc-footer__column` | No | Einzelne Spalte im Grid mit Heading + Link-Liste. |
| heading | `.nc-footer__heading` | No | Spalten-Ueberschrift (uppercase, semibold). |
| links | `.nc-footer__links` | No | Link-Liste innerhalb einer Spalte. |
| social-links | `.nc-footer__social` | No | Social-Media-Icons. Konsistente Hover-States und aria-labels. |
| legal-area | `.nc-footer__legal` | Yes | Copyright und rechtliche Links. Immer sichtbar. |
| newsletter | `.nc-footer__newsletter` | No | Optionales Newsletter-Input-Feld fuer Lead-Generierung. |
| separator | `.nc-footer__separator` | No | Horizontale Trennlinie zwischen Bereichen. |
| backtotop | `.nc-footer__backtotop` | No | Knopf „Nach oben“ (button type=button, data-back-to-top, sichtbarer Text + Pfeil-Symbol aria-hidden; Website: field_ft_backtotop, in .nc-footer__bottom hinter den Rechtslinks). Verhalten aus neo-behaviors footer: scrollt an den Seitenanfang (sanft nur ohne reduzierte Bewegung) und setzt den Fokus auf den Hauptinhalt (oder data-back-to-top="#id"). |

### DOM Notes
- Root: <footer> mit role='contentinfo'. BEM-Root: .nc-footer.
- Simple-Layout: 2-Spalten Flexbox — Legal links, Social rechts.
- Columns-Layout: CSS Grid mit 2-4 Spalten. Headings uppercase. Gap via Token.
- CTA-Layout: Dedizierter CTA-Bereich oberhalb. Kicker + Headline + Button.
- Inverse Theme: background-inverse, text-inverse. Links: text-link auf inversem BG.
- Mobile: Columns stapeln vertikal. Optional Accordion-Transformation.
- Social-Icons: Flex-Row, gap via Token. Jedes Icon: aria-label mit Plattform-Name.
- Legal: Copyright-Text (text-tertiary) + Flex-Row mit Legal-Links.
- Newsletter: Input + Button, form-field-recipe kompatibel.
- Separator: 1px border-secondary horizontal, margin via Token.

## Variants
### Layout (`layout`)
Footer-Variante — simple (Legal + Social), columns (Sitemap-Grid), cta-active (Engagement-CTA + Columns)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| simple | — |  |
| columns | `.nc-footer--columns` |  |
| cta-active | `.nc-footer--cta` |  |

### Columns (`columns`)
Anzahl der Spalten im Sitemap-Grid (nur bei layout=columns oder cta-active)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| 2 | `.nc-footer--2-col` |  |
| 3 | `.nc-footer--3-col` |  |
| 4 | `.nc-footer--4-col` |  |

### Theme (`theme`)
Farbschema — base (hell), inverse (dunkel)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| base | — |  |
| inverse | `.nc-footer--inverse` |  |

## States
Supported: `default`, `hover`, `focus-visible`

- **hover**: 
- **focus-visible**: 

## CSS Token API
Base classes: `nc-footer`

### Base
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-footer-bg` | — | — |
| `--nc-footer-color` | — | — |
| `--nc-footer-padding-block` | — | — |
| `--nc-footer-padding-inline` | — | — |
| `--nc-footer-max-width` | — | — |
| `--nc-footer-separator-color` | — | — |
| `--nc-footer-link-color` | — | — |
| `--nc-footer-link-hover-color` | — | — |

### Columns
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-footer-col-gap` | — | — |
| `--nc-footer-heading-size` | — | — |
| `--nc-footer-heading-weight` | — | — |
| `--nc-footer-heading-color` | — | — |
| `--nc-footer-heading-transform` | — | — |
| `--nc-footer-link-size` | — | — |

### CTA Area
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-footer-cta-kicker-size` | — | — |
| `--nc-footer-cta-headline-size` | — | — |
| `--nc-footer-cta-headline-weight` | — | — |
| `--nc-footer-cta-gap` | — | — |

### Social Links
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-footer-social-icon-size` | — | — |
| `--nc-footer-social-gap` | — | — |
| `--nc-footer-social-color` | — | — |
| `--nc-footer-social-hover-color` | — | — |

### Legal Area
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-footer-legal-size` | — | — |
| `--nc-footer-legal-color` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | focus-next | Links und Knoepfe des Footers in Dokumentreihenfolge, der Knopf „Nach oben“ zuletzt in der unteren Leiste. |
| `Enter` | back-to-top | Auf dem Knopf „Nach oben“: an den Seitenanfang scrollen, Fokus auf den Hauptinhalt (main) bzw. das Ziel aus data-back-to-top; die naechste Tab-Taste fuehrt in den Hauptinhalt. |
| `Space` | back-to-top | Wie Enter. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `footer-back-to-top` | Yes | `{"target":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard
- 2.4.3: „Nach oben“ setzt den Fokus an den Seitenanfang (Hauptinhalt), nicht nur die Scrollposition; 2.3.3: sanftes Scrollen nur ohne prefers-reduced-motion.

## Web Components Mapping
Derived from anatomy for potential `<nc-footer>` custom element:

```js
class NcFooter extends HTMLElement {
  static observedAttributes = ['layout', 'columns', 'theme'];
  // Slots: <slot name="legal-area">
}
```

---

*Generated from `data/footer-recipe.json` by `scripts/generate-component-specs.js`*
