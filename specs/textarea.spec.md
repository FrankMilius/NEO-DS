# textarea Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

Tags: `interactive`, `form`, `text-input`

## Anatomy
Root element: `.nc-textarea`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| counter | `.nc-textarea__counter` | No | — |
| actions | `.nc-textarea__actions` | No | — |

### DOM Notes
- Textarea ist ein natives <textarea class='nc-textarea'>. Kein JS fuer Basis-Funktion noetig.
- Nutzt --nc-input-* Tokens als Basis (gleiche form-control Mixins wie Input).
- Eigene --nc-textarea-* Tokens fuer min-height, max-height, padding, resize und Scrollbar.
- height: auto ueberschreibt die feste Hoehe aus form-control-size.
- max-height: Bei gesetztem Wert (nicht 'none') erzwingt overflow-y: auto einen Scrollbar.
- scrollbar-width: 'thin' (Standard) fuer schmalere Scrollbars. Webkit-Fallback via ::-webkit-scrollbar.
- Autosize (.nc-textarea--autosize): resize: none, overflow: hidden — JS steuert Hoehe.
- Character Counter (__counter): Nutzt --nc-form-hint-* Tokens. --limit aendert auf Error-Farbe.
- Actions-Slot (__actions): Flex-Container unterhalb der Textarea fuer interaktive Buttons (Copy, Clear, AI-Assist). Wrapper muss :has(.nc-textarea__actions) sein, damit Textarea unteren Radius verliert.
- Empty vs. Focus-Within: :placeholder-shown kennzeichnet leere Textarea. Wrapper :focus-within steuert Actions-Sichtbarkeit — Actions werden ausgeblendet wenn Textarea leer UND nicht fokussiert.
- Error via .nc-textarea--error ODER [aria-invalid='true'].

## Variants
### Variant (`variant`)
Visuelle Variante — outlined (Standard, Rahmen), filled (Flaeche mit Unterstreichung), borderless (minimalistisch)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| outlined | — |  |
| filled | `.nc-textarea--filled` |  |
| borderless | `.nc-textarea--borderless` |  |

### Size (`size`)
3 Groessenabstufungen — sm (min-height 60px) / md (80px, Standard) / lg (120px). Nutzt Input-Size-Tokens.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-textarea--sm` |  |
| md | — |  |
| lg | `.nc-textarea--lg` |  |

### Resize (`resize`)
Resize-Verhalten — default (vertical), autosize (JS-gesteuert, kein Resize), no-resize (fixe Hoehe)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| autosize | `.nc-textarea--autosize` |  |
| no-resize | `.nc-textarea--no-resize` |  |

### Validation (`validation`)
Validierungszustand — none (Standard), error (roter Rand), success (gruener Rand)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| error | `.nc-textarea--error` |  |
| success | `.nc-textarea--success` |  |

### Content (`content`)
Inhaltsvarianten — plain (nur Textarea), with-actions (Textarea + Actions-Leiste)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| plain | — |  |
| with-actions | — |  |

## States
Supported: `default`, `hover`, `focus`, `disabled`, `empty`, `focus-within`

- **hover**: 
- **focus**: 
- **empty**: 
- **focus-within**: 

## CSS Token API
Base classes: `nc-textarea`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-textarea-min-height` | — | `--mod-textarea-min-height` |
| `--nc-textarea-max-height` | — | `--mod-textarea-max-height` |
| `--nc-textarea-padding` | — | `--mod-textarea-padding` |
| `--nc-textarea-resize` | — | `--mod-textarea-resize` |

### Colors (Outlined)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-control-bg` | — | `--mod-form-control-bg` |
| `--nc-form-control-border-color` | — | `--mod-form-control-border-color` |
| `--nc-form-control-color` | — | `--mod-form-control-color` |

### Colors (Filled)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-control-filled-bg` | — | `--mod-form-control-filled-bg` |
| `--nc-form-control-filled-border-bottom` | — | `--mod-form-control-filled-border-bottom` |
| `--nc-form-control-filled-color` | — | `--mod-form-control-filled-color` |

### Colors (Borderless)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-control-minimal-bg-hover` | — | `--mod-form-control-minimal-bg-hover` |
| `--nc-form-control-minimal-border-focus` | — | `--mod-form-control-minimal-border-focus` |

### Scrollbar
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-textarea-scrollbar-width` | — | `--mod-textarea-scrollbar-width` |

### Actions
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-textarea-actions-gap` | — | `--mod-textarea-actions-gap` |
| `--nc-textarea-actions-padding` | — | `--mod-textarea-actions-padding` |

### Error
### Success
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-textarea>` custom element:

```js
class NcTextarea extends HTMLElement {
  static observedAttributes = ['variant', 'size', 'resize', 'validation', 'content'];
  // Slots: default
}
```

---

*Generated from `data/textarea-recipe.json` by `scripts/generate-component-specs.js`*
