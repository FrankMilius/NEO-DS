# checkbox-group Component Spec
> Version 2.0.0 | Status: stable | Layer: molecule

Tags: `form`, `interactive`, `grouping`

## Anatomy
Root element: `.nc-checkbox-group`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| header | `.nc-checkbox-group__header` | No | — |
| hint | `.nc-checkbox-group__hint` | No | — |

### DOM Notes
- Flex-Column Container fuer mehrere .nc-checkbox Elemente.
- Gap via --nc-group-gap. Horizontal: flex-row, flex-wrap, --nc-group-gap-horizontal.
- Size-Modifier (--sm / --lg) koppelt Gap an Checkbox-Groesse: sm=8px, md=12px (default), lg=16px.
- Header-Slot: Enthaelt Master-Checkbox (.nc-checkbox) fuer Select-All. Separator via border-bottom.
- Master-Checkbox nutzt :indeterminate wenn nur Teilmenge ausgewaehlt (JS: input.indeterminate = true).
- Hint-Slot: Enthaelt .nc-form-hint fuer Gruppen-Hilfetext. Verknuepft via aria-describedby auf dem Gruppen-Container.
- Error: propagiert border-error auf alle Checkbox-Controls.
- Disabled: opacity + pointer-events:none auf gesamte Gruppe.

## Variants
### Layout (`layout`)
Layout — vertical (Standard), horizontal (nebeneinander)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| vertical | — |  |
| horizontal | `.nc-checkbox-group--horizontal` |  |

### Size (`size`)
Koppelt den Gruppen-Gap an die Checkbox-Groesse — sm (8px), md (12px, Standard), lg (16px)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-checkbox-group--sm` |  |
| md | — |  |
| lg | `.nc-checkbox-group--lg` |  |

## States
Supported: `default`, `error`, `disabled`

- **error**: 
- **disabled**: 

## CSS Token API
Base classes: `nc-checkbox-group`

### Geometry (Gap)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-group-gap` | — | — |
| `nc-group-gap-sm` | — | — |
| `nc-group-gap-lg` | — | — |
| `nc-group-gap-horizontal` | — | — |

### Header (Select-All)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-group-header-gap` | — | — |
| `nc-group-header-border` | — | — |

### Hint
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-group-hint-margin-top` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Dependencies
`checkbox`, `form`

## Web Components Mapping
Derived from anatomy for potential `<nc-checkbox-group>` custom element:

```js
class NcCheckboxGroup extends HTMLElement {
  static observedAttributes = ['layout', 'size'];
  // Slots: default
}
```

---

*Generated from `data/checkbox-group-recipe.json` by `scripts/generate-component-specs.js`*
