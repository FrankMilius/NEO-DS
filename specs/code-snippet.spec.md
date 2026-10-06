# code-snippet Component Spec
> Version 2.1.0 | Status: stable | Layer: atom

Tags: `static`, `content`, `code`

## Anatomy
Root element: `.nc-code-snippet`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| header | `.nc-code-snippet__header` | No | — |
| pre | `.nc-code-snippet__pre` | Yes | — |
| code | `.nc-code-snippet__code` | Yes | — |
| line | `.nc-code-snippet__line` | No | — |
| copy | `.nc-code-snippet__copy` | No | — |
| show-more | `.nc-code-snippet__show-more` | No | — |
| label | `.nc-code-snippet__label` | No | — |

### DOM Notes
- Inline: <code class='nc-code-snippet nc-code-snippet--inline'>. Kein Copy-Button.
- Single: <div class='nc-code-snippet nc-code-snippet--single'><pre><code>. Copy-Button oben rechts.
- Multi:  <div class='nc-code-snippet nc-code-snippet--multi'><pre><code>. Copy-Button + Show-More.
- Copy-Button: aria-label='Code kopieren'. Dual-Icon Pattern (Copy → Check bei Erfolg).
- Copy-Tooltip: .nc-code-snippet__copy-tooltip — erscheint bei Erfolg unter dem Copy-Button.
- Show-More: aria-expanded='true/false'. Gradient-Fade im collapsed Zustand.
- Header: optionale Titelleiste mit Dateiname. Plain/macOS/Window-Varianten.
- macOS-Dots: .nc-code-snippet__header-dot--close/--minimize/--maximize. Dekorativ.
- Zeilennummern: CSS-Counter auf .nc-code-snippet__line::before. user-select:none.
- Zeilen-Highlight: .nc-code-snippet__line--highlighted — farbige Hervorhebung.
- Wrap: white-space:pre-wrap statt horizontalem Scroll.
- Sprach-Label (optional): Badge oben links mit Sprach-Kennung (z.B. 'HTML', 'SCSS').
- Syntax-Highlighting via Prism.js — .token-Klassen werden auf --nc-cs-syntax-* Tokens gemappt.
- Verhalten (neo-behaviors code-snippet): Kopieren setzt .nc-code-snippet__copy--success und aria-label='Kopiert!' fuer 2 s; Mehr anzeigen schaltet .nc-code-snippet--expanded und aria-expanded; passt der Code in die eingeklappte Hoehe, ist der Knopf [hidden].

## Variants
### Variant (`variant`)
Anzeige-Typ — inline (Fliesstext), single-line (Block, 1 Zeile), multi-line (Block, collapsible)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| inline | `.nc-code-snippet--inline` |  |
| single | `.nc-code-snippet--single` |  |
| multi | `.nc-code-snippet--multi` |  |

### Header (`header`)
Titelleisten-Stil — none (kein Header), plain (Dateiname), macos (Traffic-Light Dots), window (Fensterleiste)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| plain | `.nc-code-snippet--header-plain` |  |
| macos | `.nc-code-snippet--header-macos` |  |
| window | `.nc-code-snippet--header-window` |  |

### Line Wrapping (`wrap`)
Zeilenumbruch — none (horizontaler Scroll), wrap (Umbruch bei langen Zeilen)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| wrap | `.nc-code-snippet--wrap` |  |

### Features (`features`)
Zusaetzliche Funktionen — default, with-line-numbers (Zeilennummern), line-highlight (Zeilen hervorheben)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| with-line-numbers | `.nc-code-snippet--with-line-numbers` |  |
| line-highlight | `.nc-code-snippet--line-highlight` |  |

### Syntax (`syntax`)
Syntax-Highlighting aktivieren oder deaktivieren

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| highlighted | — |  |

## States
Supported: `default`, `expanded`

- **expanded**: 

## CSS Token API
Base classes: `nc-code-snippet`

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-cs-font-family` | — | `--mod-cs-font-family` |
| `--nc-cs-font-size` | — | `--mod-cs-font-size` |
| `--nc-cs-line-height` | — | `--mod-cs-line-height` |
| `--nc-cs-font-weight` | — | `--mod-cs-font-weight` |
| `--nc-cs-tab-size` | — | `--mod-cs-tab-size` |

### Block Surface
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-cs-bg` | — | `--mod-cs-bg` |
| `--nc-cs-color` | — | `--mod-cs-color` |
| `--nc-cs-border` | — | `--mod-cs-border` |
| `--nc-cs-border-width` | — | `--mod-cs-border-width` |
| `--nc-cs-radius` | — | `--mod-cs-radius` |
| `--nc-cs-padding` | — | `--mod-cs-padding` |
| `--nc-cs-padding-inline` | — | `--mod-cs-padding-inline` |

### Inline
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-cs-inline-bg` | — | `--mod-cs-inline-bg` |
| `--nc-cs-inline-color` | — | `--mod-cs-inline-color` |
| `--nc-cs-inline-radius` | — | `--mod-cs-inline-radius` |
| `--nc-cs-inline-padding-x` | — | `--mod-cs-inline-padding-x` |
| `--nc-cs-inline-padding-y` | — | `--mod-cs-inline-padding-y` |
| `--nc-cs-inline-font-size` | — | `--mod-cs-inline-font-size` |

### Header
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-cs-header-bg` | — | `--mod-cs-header-bg` |
| `--nc-cs-header-color` | — | `--mod-cs-header-color` |
| `--nc-cs-header-height` | — | `--mod-cs-header-height` |
| `--nc-cs-header-padding` | — | `--mod-cs-header-padding` |
| `--nc-cs-header-font-size` | — | `--mod-cs-header-font-size` |
| `--nc-cs-header-font-weight` | — | `--mod-cs-header-font-weight` |
| `--nc-cs-header-border` | — | `--mod-cs-header-border` |

### macOS Dots
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-cs-header-dot-size` | — | `--mod-cs-header-dot-size` |
| `--nc-cs-header-dot-gap` | — | `--mod-cs-header-dot-gap` |
| `--nc-cs-header-dot-close` | — | `--mod-cs-header-dot-close` |
| `--nc-cs-header-dot-minimize` | — | `--mod-cs-header-dot-minimize` |
| `--nc-cs-header-dot-maximize` | — | `--mod-cs-header-dot-maximize` |

### Line Numbers
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-cs-line-numbers-color` | — | `--mod-cs-line-numbers-color` |
| `--nc-cs-line-numbers-width` | — | `--mod-cs-line-numbers-width` |
| `--nc-cs-line-numbers-padding` | — | `--mod-cs-line-numbers-padding` |
| `--nc-cs-line-numbers-border` | — | `--mod-cs-line-numbers-border` |

### Line Highlight
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-cs-line-highlight-bg` | — | `--mod-cs-line-highlight-bg` |
| `--nc-cs-line-highlight-border` | — | `--mod-cs-line-highlight-border` |
| `--nc-cs-line-highlight-width` | — | `--mod-cs-line-highlight-width` |

### Copy Button
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-cs-copy-size` | — | `--mod-cs-copy-size` |
| `--nc-cs-copy-bg` | — | `--mod-cs-copy-bg` |
| `--nc-cs-copy-bg-hover` | — | `--mod-cs-copy-bg-hover` |
| `--nc-cs-copy-color` | — | `--mod-cs-copy-color` |
| `--nc-cs-copy-color-hover` | — | `--mod-cs-copy-color-hover` |
| `--nc-cs-copy-border` | — | `--mod-cs-copy-border` |
| `--nc-cs-copy-radius` | — | `--mod-cs-copy-radius` |
| `--nc-cs-copy-icon-size` | — | `--mod-cs-copy-icon-size` |
| `--nc-cs-copy-success-color` | — | `--mod-cs-copy-success-color` |

### Copy Tooltip
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-cs-copy-tooltip-bg` | — | `--mod-cs-copy-tooltip-bg` |
| `--nc-cs-copy-tooltip-color` | — | `--mod-cs-copy-tooltip-color` |
| `--nc-cs-copy-tooltip-radius` | — | `--mod-cs-copy-tooltip-radius` |
| `--nc-cs-copy-tooltip-font-size` | — | `--mod-cs-copy-tooltip-font-size` |

### Show More
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-cs-multi-max-height` | — | `--mod-cs-multi-max-height` |
| `--nc-cs-show-more-bg` | — | `--mod-cs-show-more-bg` |
| `--nc-cs-show-more-color` | — | `--mod-cs-show-more-color` |
| `--nc-cs-show-more-font-size` | — | `--mod-cs-show-more-font-size` |
| `--nc-cs-show-more-height` | — | `--mod-cs-show-more-height` |

### Syntax Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-cs-syntax-comment` | — | `--mod-cs-syntax-comment` |
| `--nc-cs-syntax-keyword` | — | `--mod-cs-syntax-keyword` |
| `--nc-cs-syntax-string` | — | `--mod-cs-syntax-string` |
| `--nc-cs-syntax-number` | — | `--mod-cs-syntax-number` |
| `--nc-cs-syntax-function` | — | `--mod-cs-syntax-function` |
| `--nc-cs-syntax-operator` | — | `--mod-cs-syntax-operator` |
| `--nc-cs-syntax-class` | — | `--mod-cs-syntax-class` |
| `--nc-cs-syntax-property` | — | `--mod-cs-syntax-property` |
| `--nc-cs-syntax-tag` | — | `--mod-cs-syntax-tag` |
| `--nc-cs-syntax-attr-name` | — | `--mod-cs-syntax-attr-name` |
| `--nc-cs-syntax-attr-value` | — | `--mod-cs-syntax-attr-value` |
| `--nc-cs-syntax-selector` | — | `--mod-cs-syntax-selector` |
| `--nc-cs-syntax-punctuation` | — | `--mod-cs-syntax-punctuation` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | activate | Auf dem Kopieren- bzw. Mehr-anzeigen-Knopf (native Knoepfe): kopiert den Code bzw. klappt auf/zu. |
| `Space` | activate | Wie Enter auf den beiden Knoepfen. |
| `Tab` | focus-next | Der <pre> ist per tabindex=0 erreichbar (waagrechtes Scrollen per Pfeiltasten), danach Kopieren und Mehr anzeigen. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `code-snippet-copy` | Yes | `{"ok":"boolean"}` |
| `code-snippet-toggle` | Yes | `{"expanded":"boolean"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName

## Web Components Mapping
Derived from anatomy for potential `<nc-code-snippet>` custom element:

```js
class NcCodeSnippet extends HTMLElement {
  static observedAttributes = ['variant', 'header', 'wrap', 'features', 'syntax'];
  // Slots: <slot name="pre">, <slot name="code">
}
```

---

*Generated from `data/code-snippet-recipe.json` by `scripts/generate-component-specs.js`*
