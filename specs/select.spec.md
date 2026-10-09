# select Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

Tags: `interactive`, `form`, `selection`

## Anatomy
Root element: `.nc-select`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| indicator | `.nc-select__indicator` | No | — |

### DOM Notes
- Select ist ein natives <select class='nc-select'>. Kein JS fuer Basis-Funktion noetig.
- Custom Arrow via background-image (SVG Chevron Down) oder via __indicator im Wrapper.
- Nutzt --nc-input-* Tokens als Basis (gleiche form-control Mixins wie Input).
- Eigene --nc-select-* Tokens fuer Indicator, Extra-Padding und Optgroup-Styling.
- Optgroup: <optgroup label='...'> wird via nc-select-optgroup-font-weight (semibold) und nc-select-optgroup-padding-left hervorgehoben. Options innerhalb der Gruppe werden zusaetzlich eingerueckt.
- Multi-Select: .nc-select--multiple oder [multiple]. Kein Arrow, height: auto. ACHTUNG: Natives multiple-Select ist schwer bedienbar (Ctrl+Click). Fuer komplexe UIs wird eine Multi-Select-Combobox-Komponente (JS-basiert) mit Tag-Cloud oder Checkbox-Liste empfohlen.
- Open-State: .is-open am Wrapper setzt Chevron transform: rotate(180deg). Benoetigt kleinen JS-Hook (focus/blur oder mousedown). CSS allein reicht nicht, da native Selects keinen :open Pseudo-Klassen-Support haben.
- Placeholder-Color-Hack: select:required:invalid { color: var(--nc-input-placeholder-color) } — funktioniert wenn Select required ist und leere Option <option value='' disabled selected> gewaehlt ist. Sobald eine valide Option gewaehlt wird, greift die normale Textfarbe.
- ::-ms-expand wird versteckt (IE11 Arrow entfernen).
- Error via .nc-select--error ODER [aria-invalid='true'].

## Variants
### Variant (`variant`)
Visuelle Variante — outlined (Standard, Rahmen), filled (Flaeche mit Unterstreichung), borderless (minimalistisch)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| outlined | — |  |
| filled | `.nc-select--filled` |  |
| borderless | `.nc-select--borderless` |  |

### Size (`size`)
3 Groessenabstufungen — sm (32px) / md (40px, Standard) / lg (48px). Nutzt Input-Size-Tokens.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-select--sm` |  |
| md | — |  |
| lg | `.nc-select--lg` |  |

### Type (`type`)
Auswahl-Typ — single (Standard-Dropdown), multiple (native Mehrfachauswahl, nur Fallback)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| single | — |  |
| multiple | `.nc-select--multiple` |  |

### Content (`content`)
Inhaltsvarianten — flat (flache Options-Liste), grouped (mit Optgroups)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| flat | — |  |
| grouped | — |  |

### Validation (`validation`)
Validierungszustand — none (Standard), error (roter Rand), success (gruener Rand)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| error | `.nc-select--error` |  |
| success | `.nc-select--success` |  |

## States
Supported: `default`, `hover`, `focus`, `disabled`, `open`, `placeholder`

- **hover**: 
- **focus**: 
- **open**: 
- **placeholder**: 

## CSS Token API
Base classes: `nc-select`

### Indicator
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-select-indicator-size` | — | `--mod-select-indicator-size` |
| `--nc-select-indicator-color` | — | `--mod-select-indicator-color` |

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-select-padding-right` | — | `--mod-select-padding-right` |

### Colors (Outlined)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-form-control-bg` | — | — |
| `--nc-form-control-border-color` | — | — |
| `--nc-form-control-color` | — | — |

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

### Optgroup
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-select-optgroup-font-weight` | — | `--mod-select-optgroup-font-weight` |
| `--nc-select-optgroup-padding-left` | — | `--mod-select-optgroup-padding-left` |

### Error
### Success
## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Space` | open | Oeffnet die native Liste (.is-open am Wrapper, Chevron dreht). |
| `Enter` | open | Wie Space (sofern die Liste geschlossen ist). |
| `Alt+ArrowDown` | open | Oeffnet die native Liste. |
| `F4` | open | Oeffnet die native Liste (Windows). |
| `Escape` | close | Schliesst die Liste, .is-open entfaellt. |
| `Tab` | close | Fokus verlaesst das Feld, .is-open entfaellt. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `change` | Yes | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-select>` custom element:

```js
class NcSelect extends HTMLElement {
  static observedAttributes = ['variant', 'size', 'type', 'content', 'validation'];
  // Slots: default
}
```

---

*Generated from `data/select-recipe.json` by `scripts/generate-component-specs.js`*
