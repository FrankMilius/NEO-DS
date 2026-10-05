# progress Component Spec
> Version 1.0.0 | Status: stable | Layer: atom

Tags: `static`, `feedback`, `indicator`

## Anatomy
Root element: `.nc-progress`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| fill | `.nc-progress__fill` | Yes | — |

### DOM Notes
- Progress ist ein <div class='nc-progress' role='progressbar' aria-valuenow='X' aria-valuemin='0' aria-valuemax='100'>.
- Fill ist ein Kind-Element <div class='nc-progress__fill' style='width: X%'>.
- Fortschritt wird via inline style width auf __fill gesteuert — kein JS-Framework noetig.
- Indeterminiert (.nc-progress--indeterminate): kein aria-valuenow, endlose Slide-Animation.
- prefers-reduced-motion: Indeterminate-Animation stoppt, Fill wird 100% mit reduzierter Opacity.
- Labeled Wrapper (.nc-progress-labeled): Flex-Column mit Header (Label + Value) und Gap.
- Value-Anzeige nutzt font-variant-numeric: tabular-nums fuer stabile Breite.
- Pill-Shape via --fnd-radius-full (border-radius: 9999px).

## Variants
### Size (`size`)
4 Hoehenstufen — xs (2px) / sm (4px, Standard) / md (8px) / lg (12px)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| xs | `.nc-progress--xs` |  |
| sm | — |  |
| md | `.nc-progress--md` |  |
| lg | `.nc-progress--lg` |  |

### Color (`color`)
Feedback-Variante — default (interactive), success, warning, danger, info

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| success | `.nc-progress--success` |  |
| warning | `.nc-progress--warning` |  |
| danger | `.nc-progress--danger` |  |
| info | `.nc-progress--info` |  |

### Mode (`mode`)
Fortschritts-Modus — determinate (fester Wert 0–100%, Standard), indeterminate (unbekannter Fortschritt, Animation)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| determinate | — |  |
| indeterminate | `.nc-progress--indeterminate` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-progress`

### Appearance
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-progress-bg` | — | `--mod-progress-bg` |
| `--nc-progress-fill` | — | `--mod-progress-fill` |
| `--nc-progress-radius` | — | `--mod-progress-radius` |

### Sizing
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-progress-height-xs` | — | `--mod-progress-height-xs` |
| `--nc-progress-height-sm` | — | `--mod-progress-height-sm` |
| `--nc-progress-height-md` | — | `--mod-progress-height-md` |
| `--nc-progress-height-lg` | — | `--mod-progress-height-lg` |

### Feedback Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-progress-fill-success` | — | `--mod-progress-fill-success` |
| `--nc-progress-fill-warning` | — | `--mod-progress-fill-warning` |
| `--nc-progress-fill-danger` | — | `--mod-progress-fill-danger` |
| `--nc-progress-fill-info` | — | `--mod-progress-fill-info` |

### Label
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-progress-label-color` | — | `--mod-progress-label-color` |
| `--nc-progress-label-size` | — | `--mod-progress-label-size` |
| `--nc-progress-label-weight` | — | `--mod-progress-label-weight` |
| `--nc-progress-label-gap` | — | `--mod-progress-label-gap` |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-progress-transition` | — | `--mod-progress-transition` |
| `--nc-progress-ease` | — | `--mod-progress-ease` |

## Accessibility
Contrast Target: WCAG AA non-text (3:1)

- hasAccessibleName

## Web Components Mapping
Derived from anatomy for potential `<nc-progress>` custom element:

```js
class NcProgress extends HTMLElement {
  static observedAttributes = ['size', 'color', 'mode'];
  // Slots: <slot name="fill">
}
```

---

*Generated from `data/progress-recipe.json` by `scripts/generate-component-specs.js`*
