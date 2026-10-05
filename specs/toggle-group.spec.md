# toggle-group Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

Tags: `interactive`, `selection`, `group`, `toolbar`, `multi-select`

## Anatomy
Root element: `.nc-toggle-group`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| item | `.nc-toggle-group__item` | Yes | — |
| icon | `.nc-toggle-group__icon` | No | — |

### DOM Notes
- Container ist ein <div class='nc-toggle-group'>.
- Items sind <button class='nc-toggle-group__item'>.
- Single-Select: role='radiogroup' auf Container, role='radio' + aria-checked auf Items. Arrow-Key Navigation (roving tabindex).
- Multi-Select: role='group' auf Container, aria-pressed='true'/'false' auf Items. Tab-Navigation zwischen Items.
- Items haben keinen eigenen border-radius — Container hat overflow: hidden + border-radius.
- Divider-Modifier (--divider): Subtile vertikale Trennlinien via ::before (50% Hoehe, margin-block: auto). Moderner als volle Border-Linien. Divider wird bei selected-Nachbar ausgeblendet.
- Underline-Modifier (--underline): Container hat keinen Rahmen/BG, nur border-block-end. Selected-Item bekommt ::after Underline.
- Soft-Variante (--soft): Selected = helle Markenfarbe (12% interactive via color-mix). Weniger dominant als filled.
- Equal-Width (--equal): flex: 1 auf Items. Alle gleich breit.
- Groessen-Modifier am Container (--sm, --lg) propagieren zu allen Items.
- Icon-only Items brauchen aria-label fuer Accessibility.
- Abgrenzung zu Segmented Control: Toggle-Group primaer fuer multi-select Toolbars. Segmented Control fuer single-select Navigation mit Sliding Indicator.

## Variants
### Size (`size`)
3 Groessenabstufungen — sm (32px) / md (40px, Standard) / lg (48px). Nutzt Button-Size-Tokens.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-toggle-group--sm` |  |
| md | — |  |
| lg | `.nc-toggle-group--lg` |  |

### Type (`type`)
Auswahl-Modus — single (Radio-Pattern, genau 1 selektiert), multiple (Toggle-Pattern, 0–n selektiert)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| single | — |  |
| multiple | — |  |

### Variant (`variant`)
Visueller Stil — filled (kraeftige Selektion), outline (transparenter BG, subtil), soft (helle Markenfarbe, weniger dominant)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| filled | — |  |
| outline | `.nc-toggle-group--outline` |  |
| soft | `.nc-toggle-group--soft` |  |

### Indicator (`indicator`)
Selektions-Indikator — bg (Background-Wechsel, Standard), underline (dicke Linie unter dem gewaehlten Item, tab-aehnlich)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| bg | — |  |
| underline | `.nc-toggle-group--underline` |  |

### Width (`width`)
Item-Breite — auto (natuerliche Breite), equal (alle gleich breit, flex: 1)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| auto | — |  |
| equal | `.nc-toggle-group--equal` |  |

### Content (`content`)
Inhalt der Items — text (nur Text), icon-text (Icon + Text), icon-only (nur Icon, aria-label noetig)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| text | — |  |
| icon-text | — |  |
| icon-only | — |  |

## States
Supported: `default`, `hover`, `selected`, `disabled`, `focus`

- **hover**: 
- **selected**: 
- **focus**: 

## CSS Token API
Base classes: `nc-toggle-group`

### Container
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toggle-group-gap` | — | `--mod-toggle-group-gap` |
| `--nc-toggle-group-radius` | — | `--mod-toggle-group-radius` |
| `--nc-toggle-group-border` | — | `--mod-toggle-group-border` |
| `--nc-toggle-group-bg` | — | `--mod-toggle-group-bg` |
| `--nc-toggle-group-shadow` | — | `--mod-toggle-group-shadow` |

### Item Default
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toggle-group-item-bg` | — | `--mod-toggle-group-item-bg` |
| `--nc-toggle-group-item-color` | — | `--mod-toggle-group-item-color` |
| `--nc-toggle-group-item-border` | — | `--mod-toggle-group-item-border` |

### Item Hover
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toggle-group-item-bg-hover` | — | `--mod-toggle-group-item-bg-hover` |

### Item Selected
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toggle-group-item-selected-bg` | — | `--mod-toggle-group-item-selected-bg` |
| `--nc-toggle-group-item-selected-color` | — | `--mod-toggle-group-item-selected-color` |
| `--nc-toggle-group-item-selected-border` | — | `--mod-toggle-group-item-selected-border` |

### Soft Selected
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toggle-group-item-soft-bg` | — | `--mod-toggle-group-item-soft-bg` |
| `--nc-toggle-group-item-soft-color` | — | `--mod-toggle-group-item-soft-color` |

### Underline Indicator
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toggle-group-underline-width` | — | `--mod-toggle-group-underline-width` |
| `--nc-toggle-group-underline-color` | — | `--mod-toggle-group-underline-color` |

### Divider
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toggle-group-divider-width` | — | `--mod-toggle-group-divider-width` |
| `--nc-toggle-group-divider-height` | — | `--mod-toggle-group-divider-height` |
| `--nc-toggle-group-divider-color` | — | `--mod-toggle-group-divider-color` |

### Item Disabled
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toggle-group-item-disabled-bg` | — | `--mod-toggle-group-item-disabled-bg` |
| `--nc-toggle-group-item-disabled-color` | — | `--mod-toggle-group-item-disabled-color` |
| `--nc-toggle-group-item-disabled-opacity` | — | `--mod-toggle-group-item-disabled-opacity` |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-toggle-group-transition-duration` | — | `--mod-toggle-group-transition-duration` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `ArrowRight` | focus-next-item | Fokussiert den naechsten Knopf (rundum); bei type=single wird er zugleich gewaehlt. |
| `ArrowDown` | focus-next-item | Wie ArrowRight. |
| `ArrowLeft` | focus-prev-item | Fokussiert den vorherigen Knopf (rundum); bei type=single wird er zugleich gewaehlt. |
| `ArrowUp` | focus-prev-item | Wie ArrowLeft. |
| `Home` | focus-first-item | Erster bedienbarer Knopf (single: zugleich gewaehlt). |
| `End` | focus-last-item | Letzter bedienbarer Knopf (single: zugleich gewaehlt). |
| `Space` | toggle-item | Schaltet den fokussierten Knopf um (multiple) bzw. waehlt ihn (single). Nativ als Klick. |
| `Enter` | toggle-item | Wie Space. |
| `Tab` | focus-group | single: nur der gewaehlte Knopf im Tab-Fluss (roving tabindex). multiple: alle Knoepfe im Tab-Fluss. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `toggle-change` | Yes | `{"value":"string","selected":"boolean","values":"string[]"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-toggle-group>` custom element:

```js
class NcToggleGroup extends HTMLElement {
  static observedAttributes = ['size', 'type', 'variant', 'indicator', 'width', 'content'];
  // Slots: <slot name="item">
}
```

---

*Generated from `data/toggle-group-recipe.json` by `scripts/generate-component-specs.js`*
