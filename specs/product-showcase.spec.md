# product-showcase Component Spec
> Version 1.0.0 | Status: stable | Layer: organism

Tags: `interactive`, `display`, `product`, `gallery`

## Anatomy
Root element: `.nc-product-showcase`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| options | `.nc-product-showcase__options` | Yes | Vertikale oder horizontale Liste der auswaehlbaren Optionen. |
| option | `.nc-product-showcase__option` | Yes | Einzelne Option. Klick triggert Media-Wechsel. Button mit role='tab'. |
| label | `.nc-product-showcase__label` | No | Kategorie-Label ueber den Optionen (z.B. 'Waehlen Sie eine Farbe'). |
| media-panel | `.nc-product-showcase__media-panel` | Yes | Container fuer das aktive Bild/Video. role='tabpanel'. |
| media-item | `.nc-product-showcase__media-item` | Yes | Einzelnes Bild/Video. Sichtbar wenn zugehoerige Option selected. |

### DOM Notes
- Root: Display Grid/Flex. Layout horizontal (Options links, Media rechts) oder stacked (Options oben, Media darunter).
- Options: role='tablist'. Jede Option ist ein button[role='tab'] mit aria-selected='true|false' und aria-controls.
- Media-Panel: role='tabpanel', aria-labelledby zeigt auf die aktive Option.
- Media-Item: position:absolute innerhalb des Panels. Aktives Item: opacity:1 + transform:translateX(0). Inaktiv: opacity:0 + transform:translateX(100%) (slide) oder opacity:0 (fade).
- Animation: transition auf opacity + transform. Duration via --nc-product-showcase-animation-duration.
- Selected-State: .nc-product-showcase__option[aria-selected='true'] bekommt --nc-product-showcase-option-color-active.
- Unselected: opacity oder color gedimmt via --nc-product-showcase-option-color.
- Label: Kleiner Kategorie-Text (z.B. 'Waehlen Sie eine Farbe'), optional, font-size xs, text-tertiary.
- Option-Indicator: Kleiner Farbpunkt oder Thumbnail links der Option. Border-Radius full fuer Kreise.
- Responsive: Auf Mobile wechselt horizontal zu stacked. Options werden horizontal scrollbar.
- Keyboard: ArrowUp/Down (vertikal) oder ArrowLeft/Right (horizontal) navigiert Optionen. Enter/Space selektiert.
- prefers-reduced-motion: Animationen deaktiviert, sofortiger Wechsel.

## Variants
### Layout (`layout`)
Anordnung — horizontal (Options links, Media rechts) oder stacked (Options oben, Media darunter)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| horizontal | — |  |
| stacked | `.nc-product-showcase--stacked` |  |

### Animation (`animation`)
Uebergangs-Animation beim Wechsel — slide (von rechts), fade (einblenden), none (sofort)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| slide | — |  |
| fade | `.nc-product-showcase--fade` |  |
| none | `.nc-product-showcase--no-anim` |  |

### Option Style (`optionStyle`)
Darstellung der Optionen — text (nur Text), indicator (mit Farbpunkt/Thumbnail), card (als Karten)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| text | — |  |
| indicator | `.nc-product-showcase--indicator` |  |
| card | `.nc-product-showcase--card` |  |

## States
Supported: `default`, `hover`, `focus-visible`

- **hover**: 
- **focus-visible**: 

## CSS Token API
Base classes: `nc-product-showcase`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-product-showcase-gap` | — | — |
| `nc-product-showcase-options-width` | — | — |
| `nc-product-showcase-padding` | — | — |

### Options
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-product-showcase-option-font-size` | — | — |
| `nc-product-showcase-option-font-weight` | — | — |
| `nc-product-showcase-option-color` | — | — |
| `nc-product-showcase-option-color-active` | — | — |
| `nc-product-showcase-option-color-hover` | — | — |
| `nc-product-showcase-option-gap` | — | — |
| `nc-product-showcase-option-padding` | — | — |
| `nc-product-showcase-label-font-size` | — | — |
| `nc-product-showcase-label-color` | — | — |
| `nc-product-showcase-indicator-size` | — | — |
| `nc-product-showcase-indicator-radius` | — | — |
| `nc-product-showcase-option-font-family` | — | — |
| `nc-product-showcase-options-align` | — | — |
| `nc-product-showcase-label-font-family` | — | — |

### Headline
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-product-showcase-headline-size` | — | — |
| `nc-product-showcase-headline-weight` | — | — |
| `nc-product-showcase-headline-color` | — | — |

### Description
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-product-showcase-desc-size` | — | — |
| `nc-product-showcase-desc-color` | — | — |

### Media Panel
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-product-showcase-media-radius` | — | — |
| `nc-product-showcase-media-aspect-ratio` | — | — |
| `nc-product-showcase-media-bg` | — | — |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-product-showcase-animation-duration` | — | — |
| `nc-product-showcase-animation-easing` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-product-showcase>` custom element:

```js
class NcProductShowcase extends HTMLElement {
  static observedAttributes = ['layout', 'animation', 'optionStyle'];
  // Slots: <slot name="options">, <slot name="option">, <slot name="media-panel">, <slot name="media-item">
}
```

---

*Generated from `data/product-showcase-recipe.json` by `scripts/generate-component-specs.js`*
