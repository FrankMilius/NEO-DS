# file-upload Component Spec
> Version 1.0.0 | Status: stable | Layer: molecule

Tags: `interactive`, `form`, `upload`

## Anatomy
Root element: `.nc-file-upload`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| icon | `.nc-file-upload__icon` | No | — |
| text | `.nc-file-upload__text` | Yes | — |
| subtext | `.nc-file-upload__subtext` | No | — |
| button | `.nc-file-upload__button` | No | — |
| input | `.nc-file-upload__input` | Yes | — |
| list | `.nc-file-upload-list` | No | — |
| list-item | `.nc-file-upload-list__item` | No | — |
| list-icon | `.nc-file-upload-list__icon` | No | — |
| list-name | `.nc-file-upload-list__name` | No | — |
| list-size | `.nc-file-upload-list__size` | No | — |
| list-remove | `.nc-file-upload-list__remove` | No | — |
| list-progress | `.nc-file-upload-list__progress` | No | — |

### DOM Notes
- Dropzone: flex-column zentriert, gestrichelte Border (dashed), Hover wechselt Border + BG.
- Icon: 40px Upload-Icon, dekorativ (aria-hidden).
- Text: Hauptanweisung (z.B. 'Dateien hierher ziehen').
- Subtext: Erlaubte Typen/Groesse (z.B. 'PNG, JPG bis 5MB').
- Button: Optionaler Browse-Button, nutzt .nc-button Styling.
- Input: <input type='file'> ist sr-only — visuell versteckt aber zugaenglich.
- Compact-Variante: flex-row, solid Border, kleineres Icon, Subtext hidden.
- Dragging-State: border-hover + bg-hover + 2px Border (JS via Drag-Events).
- Error-State: border-error Farbe auf der Dropzone.
- Disabled-State: opacity-disabled, not-allowed, pointer-events:none.
- Dateiliste: Separate Komponente (.nc-file-upload-list), flex-column.
- List-Item: flex-row mit Icon, Name (ellipsis), Size, Remove-Button.
- Item--error: border-error + bg-danger auf einzelne fehlerhafte Datei.
- Item--uploading: opacity-medium waehrend Upload.
- Progress-Bar: 3px, interactive-default Farbe, border-radius-full.

## Variants
### Variant (`variant`)
Variante — default (Dropzone mit Icon/Text), compact (kompakte Zeile mit Button)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| compact | `.nc-file-upload--compact` |  |

### Validation (`validation`)
Validierungs-State — none (Standard), error (roter Rand)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| error | `.nc-file-upload--error` |  |

### Content (`content`)
Inhaltsvariante — dropzone-only (nur Dropzone), with-list (Dropzone + Dateiliste), with-progress (Dateiliste mit Upload-Fortschritt)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| dropzone-only | — |  |
| with-list | — |  |
| with-progress | — |  |

## States
Supported: `default`, `hover`, `focus`, `dragging`, `disabled`

- **hover**: 
- **focus**: 
- **dragging**: 
- **disabled**: 

## CSS Token API
Base classes: `nc-file-upload`

### Dropzone
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-file-upload-border` | — | — |
| `nc-file-upload-border-style` | — | — |
| `nc-file-upload-border-hover` | — | — |
| `nc-file-upload-bg` | — | — |
| `nc-file-upload-bg-hover` | — | — |
| `nc-file-upload-radius` | — | — |
| `nc-file-upload-padding` | — | — |

### Icon
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-file-upload-icon-size` | — | — |
| `nc-file-upload-icon-color` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Dependencies
`button`

## Web Components Mapping
Derived from anatomy for potential `<nc-file-upload>` custom element:

```js
class NcFileUpload extends HTMLElement {
  static observedAttributes = ['variant', 'validation', 'content'];
  // Slots: <slot name="text">, <slot name="input">
}
```

---

*Generated from `data/file-upload-recipe.json` by `scripts/generate-component-specs.js`*
