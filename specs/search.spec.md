# search Component Spec
> Version 3.0.0 | Status: stable | Layer: molecule

Tags: `interactive`, `form`, `navigation`, `combobox`

## Anatomy
Root element: `.nc-search`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| input-wrapper | `.nc-search__input-wrapper` | Yes | — |
| scope-trigger | `.nc-search__scope-trigger` | No | — |
| icon | `.nc-search__icon` | Yes | — |
| input | `.nc-search__input` | Yes | — |
| ghost | `.nc-search__ghost` | No | — |
| clear-trigger | `.nc-search__clear` | No | Sichtbar bei value.length > 0. Loescht Input und setzt Focus zurueck. |
| shortcut | `.nc-search__shortcut` | No | — |
| scope-menu | `.nc-search__scope-menu` | No | — |
| results | `.nc-search__results` | Yes | — |
| group | `.nc-search__group` | No | — |
| group-label | `.nc-search__group-label` | No | — |
| item | `.nc-search__item` | Yes | — |
| item-icon | `.nc-search__item-icon` | No | — |
| item-label | `.nc-search__item-label` | Yes | — |
| highlight | `.nc-search__highlight` | No | — |
| empty | `.nc-search__empty` | No | — |
| loading | `.nc-search__loading` | No | — |
| history | `.nc-search__history` | No | Letzte Suchanfragen bei leerem Input (History-First Pattern). |
| popular | `.nc-search__popular` | No | Beliebte Suchbegriffe als Kaltstart-Fallback. |
| backdrop | `.nc-search__backdrop` | No | Semi-transparenter Layer hinter der Suche fuer Navigation-Integration. |
| mobile-header | `.nc-search__mobile-header` | No | Mobile Full-Screen: [Zurueck] [Input] [Clear] ersetzt den Header. |

### DOM Notes
- Root: role='combobox', aria-haspopup='listbox', aria-expanded='true|false', data-state='closed|open'.
- Input-Wrapper: relative Container. Enthält Icon (links), Input (mitte), Clear-Trigger (rechts, bedingt), Shortcut-Hint (rechts, bedingt).
- Clear-Trigger: button[aria-label='Suche zuruecksetzen']. Nur sichtbar wenn input.value.length > 0. Klick: value='', focus auf Input.
- Escape-Verhalten (3-stufig): 1. Loescht Ghost-Text falls aktiv. 2. Schliesst Results-Panel (data-state='closed'). 3. Blur vom Input.
- Outside-Click: Schliesst Results-Panel und setzt data-state='closed' auf Root.
- Type-to-Select: ArrowDown navigiert sofort in die Results. Enter waehlt den fokussierten Treffer.
- History-First: Bei leerem Input (value='') zeigt Results-Panel die letzten 5 Suchanfragen.
- Recent/Popular: Falls keine History vorhanden, werden 'Beliebte Suchbegriffe' als Kaltstart angezeigt.
- Ghost: position:absolute, pointer-events:none. Text beginnt mit aktuellem Input-Wert. ArrowRight uebernimmt.
- Mobile Full-Screen (< 768px): position:fixed, inset:0, z-index:modal. Header wird durch .nc-search__mobile-header ersetzt.
- Mobile Results: height:100dvh - input-height, overflow-y:auto, scroll fuer lange Listen.
- Navigation-Integration: Results-Panel top-offset = var(--nc-nav-height). Backdrop hinter Results, vor Header-Content.
- Backdrop: position:fixed, inset:0, bg:rgba(0,0,0,var(--nc-search-backdrop-opacity)). Klick = Close.

## Variants
### Width (`width`)
Breite — default (320px fest), full (100% Container), viewport (volle Viewport-Breite / Mobile Overlay)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| full | `.nc-search--full` |  |
| viewport | `.nc-search--viewport` |  |

### Appearance (`appearance`)
Visuelle Variante — default (Standard), minimal (Header, transparent), xl (Hero, 64px)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| minimal | `.nc-search--minimal` |  |
| xl | `.nc-search--xl` |  |

### Scope (`scope`)
Suchbereich — global (alles), scoped (eingeschraenkt)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| global | — |  |
| scoped | — |  |

### Content (`content`)
Inhaltsvariante — plain, with-icons, grouped, with-shortcut

| Value | CSS Modifier | Default |
| --- | --- | --- |
| plain | — |  |
| with-icons | — |  |
| grouped | — |  |
| with-shortcut | — |  |

### Mode (`mode`)
Suchverhalten — instant (sofort bei Eingabe), manual (bei Enter/Button)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| instant | — |  |
| manual | — |  |

### Animation (`animation`)
Results-Panel Animation — slide-down (Standard), fade (performant), expand (Input weitet sich)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| slide-down | — |  |
| fade | `.nc-search--anim-fade` |  |
| expand | `.nc-search--anim-expand` |  |

### Results State (`resultsState`)
Zustand der Ergebnisliste

| Value | CSS Modifier | Default |
| --- | --- | --- |
| results | — |  |
| empty | — |  |
| loading | — |  |
| closed | — |  |
| history | — |  |
| popular | — |  |

## States
Supported: `default`, `hover`, `focus`

- **hover**: 
- **focus**: 

## CSS Token API
Base classes: `nc-search`

### Input Area
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-search-width` | — | `--mod-search-width` |
| `--nc-search-max-width` | — | `--mod-search-max-width` |
| `--nc-search-input-radius` | — | `--mod-search-input-radius` |
| `--nc-search-input-height` | — | `--mod-search-input-height` |

### Results Panel
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-search-results-bg` | — | `--mod-search-results-bg` |
| `--nc-search-results-border` | — | `--mod-search-results-border` |
| `--nc-search-results-border-width` | — | `--mod-search-results-border-width` |
| `--nc-search-results-radius` | — | `--mod-search-results-radius` |
| `--nc-search-results-shadow` | — | `--mod-search-results-shadow` |
| `--nc-search-results-max-height` | — | `--mod-search-results-max-height` |
| `--nc-search-results-padding` | — | `--mod-search-results-padding` |
| `--nc-search-results-z-index` | — | `--mod-search-results-z-index` |
| `--nc-search-results-animation` | — | `--mod-search-results-animation` |
| `--nc-search-results-top-offset` | — | — |

### Item
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-search-item-height` | — | `--mod-search-item-height` |
| `--nc-search-item-padding` | — | `--mod-search-item-padding` |
| `--nc-search-item-radius` | — | `--mod-search-item-radius` |
| `--nc-search-item-color` | — | `--mod-search-item-color` |
| `--nc-search-item-bg-hover` | — | `--mod-search-item-bg-hover` |
| `--nc-search-item-icon-size` | — | `--mod-search-item-icon-size` |
| `--nc-search-item-icon-color` | — | `--mod-search-item-icon-color` |
| `--nc-search-item-gap` | — | `--mod-search-item-gap` |
| `--nc-search-item-font-size` | — | `--mod-search-item-font-size` |

### Highlight
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-search-highlight-bg` | — | `--mod-search-highlight-bg` |
| `--nc-search-highlight-color` | — | `--mod-search-highlight-color` |

### Group Label
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-search-group-label-color` | — | `--mod-search-group-label-color` |
| `--nc-search-group-label-size` | — | `--mod-search-group-label-size` |
| `--nc-search-group-label-weight` | — | `--mod-search-group-label-weight` |
| `--nc-search-group-label-padding` | — | `--mod-search-group-label-padding` |

### Shortcut
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-search-shortcut-color` | — | `--mod-search-shortcut-color` |
| `--nc-search-shortcut-size` | — | `--mod-search-shortcut-size` |

### Clear Trigger
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-search-clear-size` | — | — |
| `--nc-search-clear-color` | — | — |
| `--nc-search-clear-color-hover` | — | — |

### Scope
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-search-scope-bg` | — | `--mod-search-scope-bg` |
| `--nc-search-scope-color` | — | `--mod-search-scope-color` |
| `--nc-search-scope-border` | — | `--mod-search-scope-border` |
| `--nc-search-scope-radius` | — | `--mod-search-scope-radius` |
| `--nc-search-scope-font-size` | — | `--mod-search-scope-font-size` |
| `--nc-search-scope-padding` | — | `--mod-search-scope-padding` |
| `--nc-search-scope-gap` | — | `--mod-search-scope-gap` |

### Minimal (Header)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-search-minimal-bg` | — | `--mod-search-minimal-bg` |
| `--nc-search-minimal-border` | — | `--mod-search-minimal-border` |
| `--nc-search-minimal-border-focus` | — | `--mod-search-minimal-border-focus` |

### XL (Hero)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-search-xl-height` | — | `--mod-search-xl-height` |
| `--nc-search-xl-font-size` | — | `--mod-search-xl-font-size` |
| `--nc-search-xl-icon-size` | — | `--mod-search-xl-icon-size` |
| `--nc-search-xl-radius` | — | `--mod-search-xl-radius` |
| `--nc-search-xl-shadow` | — | `--mod-search-xl-shadow` |

### Command Palette
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-search-command-max-width` | — | `--mod-search-command-max-width` |
| `--nc-search-command-shadow` | — | `--mod-search-command-shadow` |
| `--nc-search-command-radius` | — | `--mod-search-command-radius` |
| `--nc-search-command-overlay-bg` | — | `--mod-search-command-overlay-bg` |

### Type-Ahead
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-search-ghost-color` | — | `--mod-search-ghost-color` |

### Mobile Full-Screen
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-search-mobile-header-height` | — | — |
| `--nc-search-mobile-results-max-height` | — | — |
| `--nc-search-mobile-bg` | — | — |

### Backdrop (Nav-Integration)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-search-backdrop-bg` | — | — |
| `--nc-search-backdrop-opacity` | — | — |
| `--nc-search-backdrop-z-index` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `ArrowDown` | highlight-next | Oeffnet die Liste und markiert den naechsten sichtbaren Eintrag (rundum, aria-activedescendant). |
| `ArrowUp` | highlight-prev | Oeffnet die Liste und markiert den vorherigen sichtbaren Eintrag (rundum). |
| `Enter` | select-highlighted | Uebernimmt den markierten Eintrag ins Feld und schliesst die Liste. |
| `Escape` | close | Schliesst die Ergebnisliste. |
| `Tab` | close | Fokus verlaesst die Suche — die Liste schliesst. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `search-open` | Yes | `{"open":"boolean"}` |
| `search-select` | Yes | `{"value":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-search>` custom element:

```js
class NcSearch extends HTMLElement {
  static observedAttributes = ['width', 'appearance', 'scope', 'content', 'mode', 'animation', 'resultsState'];
  // Slots: <slot name="input-wrapper">, <slot name="icon">, <slot name="input">, <slot name="results">, <slot name="item">, <slot name="item-label">
}
```

---

*Generated from `data/search-recipe.json` by `scripts/generate-component-specs.js`*
