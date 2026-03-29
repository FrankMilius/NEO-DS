# validation-summary Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `feedback`, `form`, `validation`

## Anatomy
Root element: `.nc-validation-summary`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| icon | `.nc-validation-summary__icon` | No | — |
| title | `.nc-validation-summary__title` | Yes | — |
| list | `.nc-validation-summary__list` | Yes | — |
| item | `.nc-validation-summary__item` | Yes | — |

### DOM Notes
- Error-Summary-Box am Anfang eines Formulars — zeigt alle Fehler gesammelt.
- Root: flex-column, gap, danger-BG + danger-Border. Focus-visible fuer JS-Fokus.
- Icon: 20px Error-Icon, dekorativ (aria-hidden). Optional neben dem Titel.
- Title: flex-row mit Icon + Text. 'Es gibt X Fehler im Formular'.
- List: <ol> oder <ul> mit disc-Marker, padding-inline-start.
- Item: Einzelner Fehler — kann <a href='#field-id'> sein fuer direkten Sprung.
- Item-Links: underline, hover: thickness 2px, focus-ring.
- Hidden-Modifier: display:none — JS entfernt wenn Fehler vorhanden.
- Forced-Colors: 2px solid Mark, Canvas-BG, CanvasText fuer High Contrast.

## Variants
### Content (`content`)
Inhaltsvariante — with-links (Fehler als Links zum Feld), text-only (Fehler als Text ohne Links), with-icon (mit Error-Icon im Titel)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| with-links | — |  |
| text-only | — |  |
| with-icon | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-validation-summary`

### Container
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-validation-summary-bg` | — | — |
| `nc-validation-summary-border` | — | — |
| `nc-validation-summary-color` | — | — |
| `nc-validation-summary-radius` | — | — |
| `nc-validation-summary-padding` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName

## Web Components Mapping
Derived from anatomy for potential `<nc-validation-summary>` custom element:

```js
class NcValidationSummary extends HTMLElement {
  static observedAttributes = ['content'];
  // Slots: <slot name="title">, <slot name="list">, <slot name="item">
}
```

---

*Generated from `data/validation-summary-recipe.json` by `scripts/generate-component-specs.js`*
