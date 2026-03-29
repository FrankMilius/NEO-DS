# code-snippet Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

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
| `nc-cs-font-family` | — | — |
| `nc-cs-font-size` | — | — |
| `nc-cs-line-height` | — | — |
| `nc-cs-font-weight` | — | — |
| `nc-cs-tab-size` | — | — |

### Block Surface
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-cs-bg` | — | — |
| `nc-cs-color` | — | — |
| `nc-cs-border` | — | — |
| `nc-cs-border-width` | — | — |
| `nc-cs-radius` | — | — |
| `nc-cs-padding` | — | — |
| `nc-cs-padding-inline` | — | — |

### Inline
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-cs-inline-bg` | — | — |
| `nc-cs-inline-color` | — | — |
| `nc-cs-inline-radius` | — | — |
| `nc-cs-inline-padding-x` | — | — |
| `nc-cs-inline-padding-y` | — | — |
| `nc-cs-inline-font-size` | — | — |

### Header
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-cs-header-bg` | — | — |
| `nc-cs-header-color` | — | — |
| `nc-cs-header-height` | — | — |
| `nc-cs-header-padding` | — | — |
| `nc-cs-header-font-size` | — | — |
| `nc-cs-header-font-weight` | — | — |
| `nc-cs-header-border` | — | — |

### macOS Dots
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-cs-header-dot-size` | — | — |
| `nc-cs-header-dot-gap` | — | — |
| `nc-cs-header-dot-close` | — | — |
| `nc-cs-header-dot-minimize` | — | — |
| `nc-cs-header-dot-maximize` | — | — |

### Line Numbers
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-cs-line-numbers-color` | — | — |
| `nc-cs-line-numbers-width` | — | — |
| `nc-cs-line-numbers-padding` | — | — |
| `nc-cs-line-numbers-border` | — | — |

### Line Highlight
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-cs-line-highlight-bg` | — | — |
| `nc-cs-line-highlight-border` | — | — |
| `nc-cs-line-highlight-width` | — | — |

### Copy Button
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-cs-copy-size` | — | — |
| `nc-cs-copy-bg` | — | — |
| `nc-cs-copy-bg-hover` | — | — |
| `nc-cs-copy-color` | — | — |
| `nc-cs-copy-color-hover` | — | — |
| `nc-cs-copy-border` | — | — |
| `nc-cs-copy-radius` | — | — |
| `nc-cs-copy-icon-size` | — | — |
| `nc-cs-copy-success-color` | — | — |

### Copy Tooltip
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-cs-copy-tooltip-bg` | — | — |
| `nc-cs-copy-tooltip-color` | — | — |
| `nc-cs-copy-tooltip-radius` | — | — |
| `nc-cs-copy-tooltip-font-size` | — | — |

### Show More
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-cs-multi-max-height` | — | — |
| `nc-cs-show-more-bg` | — | — |
| `nc-cs-show-more-color` | — | — |
| `nc-cs-show-more-font-size` | — | — |
| `nc-cs-show-more-height` | — | — |

### Syntax Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-cs-syntax-comment` | — | — |
| `nc-cs-syntax-keyword` | — | — |
| `nc-cs-syntax-string` | — | — |
| `nc-cs-syntax-number` | — | — |
| `nc-cs-syntax-function` | — | — |
| `nc-cs-syntax-operator` | — | — |
| `nc-cs-syntax-class` | — | — |
| `nc-cs-syntax-property` | — | — |
| `nc-cs-syntax-tag` | — | — |
| `nc-cs-syntax-attr-name` | — | — |
| `nc-cs-syntax-attr-value` | — | — |
| `nc-cs-syntax-selector` | — | — |
| `nc-cs-syntax-punctuation` | — | — |

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
