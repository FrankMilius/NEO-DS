# chip Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

Tags: `interactive`, `filter`, `selection`, `toggle`

## Anatomy
Root element: `.nc-chip`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| icon | `.nc-chip__icon` | No | — |
| avatar | `.nc-chip__avatar` | No | — |
| label | `.nc-chip__label` | Yes | — |
| count | `.nc-chip__count` | No | — |
| remove | `.nc-chip__remove` | No | — |

### DOM Notes
- Chip ist immer ein <button> — interaktiv, toggled Filter.
- Toggle-State via aria-pressed='true|false' (NICHT aria-selected).
- Selected-State via .nc-chip--selected UND/ODER aria-pressed='true'.
- Icon-Slot links (dekorativ, aria-hidden='true'). Avatar-Slot links (rundes Bild).
- Count-Badge (__count): Numerisches Badge im Chip (z.B. 'Inland (12)').
- Remove-Button (__remove) ist ein separater <button> mit aria-label='Entfernen'.
- SM-Chips (24px) haben 44px Touch-Target via unsichtbares ::before Pseudo-Element.
- Transparente Border im Default-State reserviert Platz — kein Layout-Shift bei Selektion.
- font-weight bleibt konstant ueber alle States (kein Sprung bei Bold-Wechsel).
- Chip-Group (.nc-chip-group) ist ein flex-wrap Container mit gap.
- Chip-Group--scroll hat nowrap + overflow-x: auto + versteckte Scrollbar.
- Avatar-Element hat reduziertes Padding-Start fuer buendigen Abschluss mit Chip-Rundung.
- Choice-Gruppen: role='radiogroup' (single) oder role='group' (multiple) mit aria-label.

## Variants
### Size (`size`)
3 Groessenabstufungen — sm (24px, 44px Touch-Target) / md (32px, Standard) / lg (40px)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-chip--sm` |  |
| md | — |  |
| lg | `.nc-chip--lg` |  |

### Variant (`variant`)
Visuelle Variante — filled (Standard, transparent BG + Border), outline (explizit), ghost (keine Border, dezent fuer Dashboards)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| filled | — |  |
| outline | `.nc-chip--outline` |  |
| ghost | `.nc-chip--ghost` |  |

### Content (`content`)
Inhalt-Typ — text-only, mit Icon, mit Avatar, mit Remove-Button, mit Count-Badge

| Value | CSS Modifier | Default |
| --- | --- | --- |
| text | — |  |
| with-icon | — |  |
| with-avatar | — |  |
| with-count | — |  |
| removable | — |  |

## States
Supported: `default`, `hover`, `selected`, `disabled`, `focus`

- **hover**: 
- **focus**: 
- **selected**: 

## CSS Token API
Base classes: `nc-chip`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-chip-height-sm` | — | — |
| `nc-chip-height-md` | — | — |
| `nc-chip-height-lg` | — | — |
| `nc-chip-padding-x` | — | — |
| `nc-chip-padding-y` | — | — |
| `nc-chip-radius` | — | — |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-chip-font-size` | — | — |
| `nc-chip-font-size-sm` | — | — |
| `nc-chip-font-size-lg` | — | — |
| `nc-chip-font-weight` | — | — |

### Default Colors (Filled)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-chip-default-bg` | — | — |
| `nc-chip-default-color` | — | — |
| `nc-chip-default-border` | — | — |
| `nc-chip-default-bg-hover` | — | — |

### Outline Variant
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-chip-outline-bg` | — | — |
| `nc-chip-outline-color` | — | — |
| `nc-chip-outline-border` | — | — |
| `nc-chip-outline-bg-hover` | — | — |

### Ghost Variant
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-chip-ghost-bg` | — | — |
| `nc-chip-ghost-color` | — | — |
| `nc-chip-ghost-border` | — | — |
| `nc-chip-ghost-bg-hover` | — | — |

### Selected
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-chip-selected-bg` | — | — |
| `nc-chip-selected-color` | — | — |
| `nc-chip-selected-border` | — | — |
| `nc-chip-selected-bg-hover` | — | — |

### Elements
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-chip-icon-size` | — | — |
| `nc-chip-avatar-size` | — | — |
| `nc-chip-remove-size` | — | — |
| `nc-chip-padding-avatar` | — | — |

### Count Badge
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-chip-count-font-size` | — | — |
| `nc-chip-count-height` | — | — |
| `nc-chip-count-min-width` | — | — |
| `nc-chip-count-padding-x` | — | — |
| `nc-chip-count-bg` | — | — |
| `nc-chip-count-radius` | — | — |

### Touch Target
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-chip-touch-target-min` | — | — |

### Disabled
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-chip-disabled-bg` | — | — |
| `nc-chip-disabled-color` | — | — |
| `nc-chip-disabled-border` | — | — |
| `nc-chip-opacity-disabled` | — | — |

### Interaction
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-chip-gap` | — | — |
| `nc-chip-transition-duration` | — | — |
| `nc-chip-scale-active` | — | — |

### Group
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-chip-group-gap` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-chip>` custom element:

```js
class NcChip extends HTMLElement {
  static observedAttributes = ['size', 'variant', 'content'];
  // Slots: <slot name="label">
}
```

---

*Generated from `data/chip-recipe.json` by `scripts/generate-component-specs.js`*
