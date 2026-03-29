# rating Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

Tags: `interactive`, `form`, `feedback`

## Anatomy
Root element: `.nc-rating`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| input-clear | `.nc-rating__input--clear` | No | — |
| input | `.nc-rating__input` | No | — |
| item | `.nc-rating__item` | Yes | — |
| value | `.nc-rating__value` | No | — |
| count | `.nc-rating__count` | No | — |
| clear | `.nc-rating__clear` | No | — |

### DOM Notes
- Interaktiv: <div class='nc-rating' role='radiogroup' aria-label='Bewertung'> mit versteckten Radio-Inputs + Labels.
- Clear-Input: <input type='radio' class='nc-rating__input--clear' name='rating' value='0'> als erstes Kind — erreichbar via Arrow Left vom 1. Stern. Loest Zuruecksetzen auf 0 Sterne aus.
- Clear-Button: Optionaler sichtbarer Reset-Button (.nc-rating__clear) — erscheint nur wenn ein Wert gewaehlt ist (via :has(.nc-rating__input:checked)). Klickt den Clear-Input.
- Jeder Stern: <input type='radio' class='nc-rating__input' name='rating' value='N'> + <label class='nc-rating__item'>.
- Touch-Target: Items erhalten ::after mit inset: calc(-1 * --nc-rating-touch-padding) fuer min. 44px Klickbereich (WCAG 2.5.8). Im SM-Modus (18px) besonders kritisch.
- Hover-Kaskade: Sterne leuchten mit staggered delay (--nc-rating-stagger-delay: 30ms) nacheinander auf. Jedes Item benoetigt style='--nc-rating-item-index: N'.
- Selection-Bounce: Bei Auswahl spielt der gewahlte Stern eine nc-rating-bounce Keyframe-Animation (scale 1 → 1.25 → 0.95 → 1).
- Readonly: role='img', aria-label='Bewertung: 4.5 von 5 Sternen'. Halbe Sterne via clip-path. Kein Touch-Target (::after display:none).
- Interaktiv: Nur volle Sterne (Full-Star-Selection) — keine halben Sterne im Eingabemodus fuer hohe Fehlertoleranz.
- Sentiment-Farbskala: --sentiment Modifier + --sentiment-low/mid/high Klasse. 1-2: Rot, 3: Gelb, 4-5: Gruen. JS setzt die Klasse basierend auf dem Wert.
- Compact/Pill: --compact Modifier — nur 1 Stern + Zahl sichtbar. Ideal fuer dichte Listen.
- Icon-Types: data-icon='star|heart|thumb|smiley' auf dem Container. SVG wird via JS oder Template gewechselt.
- Focus-Ring: outline mit 2px offset auf dem Label des fokussierten Radio-Inputs.
- Forced-Colors: active = Highlight, inactive = ButtonText (High Contrast Mode).
- prefers-reduced-motion: Stagger, Bounce und Scale-Transitions werden deaktiviert.

## Variants
### Size (`size`)
3 Groessenabstufungen — sm (18px) / md (24px, Standard) / lg (36px)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-rating--sm` |  |
| md | — |  |
| lg | `.nc-rating--lg` |  |

### Mode (`mode`)
Interaktions-Modus — interactive (Radio-Inputs, nur volle Sterne), readonly (nur Anzeige, halbe Sterne moeglich)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| interactive | — |  |
| readonly | `.nc-rating--readonly` |  |

### Display (`display`)
Anzeige-Optionen — stars-only (nur Sterne), with-value (+ Zahl), with-count (+ Zahl + Anzahl), compact (Pill: 1 Stern + Zahl)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| stars-only | — |  |
| with-value | — |  |
| with-count | — |  |
| compact | `.nc-rating--compact` |  |

### Icon Type (`iconType`)
Symbol-Varianz — star (Standard), heart (Favoriten), thumb (Zustimmung), smiley (Zufriedenheit)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| star | — |  |
| heart | — |  |
| thumb | — |  |
| smiley | — |  |

### Sentiment (`sentiment`)
Farbkodierung — none (einheitliche Farbe), scale (Rot/Gelb/Gruen je nach Wert)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| scale | `.nc-rating--sentiment` |  |

## States
Supported: `default`, `hover`, `active`, `focus`, `disabled`

- **hover**: 
- **active**: 
- **focus**: 
- **disabled**: 

## CSS Token API
Base classes: `nc-rating`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-rating-size` | — | — |
| `nc-rating-gap` | — | — |
| `nc-rating-touch-padding` | — | — |

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-rating-color-active` | — | — |
| `nc-rating-color-inactive` | — | — |
| `nc-rating-hover-color` | — | — |
| `nc-rating-count-color` | — | — |
| `nc-rating-error-color` | — | — |

### Sentiment Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-rating-sentiment-low` | — | — |
| `nc-rating-sentiment-mid` | — | — |
| `nc-rating-sentiment-high` | — | — |

### Interaction
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-rating-transition-duration` | — | — |
| `nc-rating-transition-timing` | — | — |
| `nc-rating-stagger-delay` | — | — |
| `nc-rating-bounce-scale` | — | — |

### Disabled
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-rating-disabled-opacity` | — | — |

## Accessibility
Contrast Target: WCAG AA non-text (3:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-rating>` custom element:

```js
class NcRating extends HTMLElement {
  static observedAttributes = ['size', 'mode', 'display', 'iconType', 'sentiment'];
  // Slots: <slot name="item">
}
```

---

*Generated from `data/rating-recipe.json` by `scripts/generate-component-specs.js`*
