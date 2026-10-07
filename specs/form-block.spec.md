# form-block Component Spec
> Version 1.1.0 | Status: stable | Layer: organism

Tags: `layout`, `form`, `content`

## Anatomy
Root element: `.nc-form-block`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| text | `.nc-form-block__text` | Yes | Text-Section mit Headline und Subtext. |
| form | `.nc-form-block__form` | Yes | Form-Section (Container fuer Formular-Elemente). |
| headline | `.nc-form-block__headline` | Yes | Headline der Text-Section. |
| subtext | `.nc-form-block__subtext` | No | Beschreibungstext unter der Headline. |
| submission | `.nc-form-block__submission` | No | Submission-Bereich (Terms + Hint + CTA). |
| terms | `.nc-form-block__terms` | No | Terms Checkbox-Area. |
| hint-text | `.nc-form-block__hint-text` | No | Hinweistext unter Terms. |
| submit | `.nc-form-block__submit` | No | Submit-Button. |
| honeypot | `.nc-form-hp` | No | Honeypot: Feld fuer Bots, per Clip visuell verborgen (nicht display:none). |

### DOM Notes
- 4 Positionierungsvarianten: text-left, text-right, text-top, text-bottom.
- Ab md: Side-by-Side Layouts (text-left, text-right), Text-Section 40%, sticky.
- Stacked-Varianten bleiben column.
- Form-Section enthaelt beliebige Formular-Komponenten (form-field, input-group, etc.).

## Variants
### Text-Position (`position`)
Position der Text-Section relativ zur Form.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| Text links, Form rechts | `.nc-form-block--text-left` | Yes |
| Text rechts, Form links | `.nc-form-block--text-right` |  |
| Text oben, Form unten | `.nc-form-block--text-top` |  |
| Text unten, Form oben | `.nc-form-block--text-bottom` |  |

## CSS Token API
Base classes: `.nc-form-block`

## Accessibility
- Form-Block ist ein Layout-Container, keine eigene ARIA-Rolle.
- Formular innerhalb der Form-Section sollte eigenes <form> Element verwenden.
- Headline und Subtext sollten per aria-describedby mit dem Formular verknuepft werden.

## Dependencies
`form`

## Web Components Mapping
Derived from anatomy for potential `<nc-form-block>` custom element:

```js
class NcFormBlock extends HTMLElement {
  static observedAttributes = ['position'];
  // Slots: <slot name="text">, <slot name="form">, <slot name="headline">
}
```

---

*Generated from `data/form-block-recipe.json` by `scripts/generate-component-specs.js`*
