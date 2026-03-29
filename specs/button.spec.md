# button Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

Tags: `interactive`, `control`

## Anatomy
Root element: `.nc-button`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| icon | `.nc-button__icon` | No | — |
| label | `.nc-button__label` | Yes | — |
| spinner | `.nc-button__spinner` | No | — |

### DOM Notes
- Buttons muessen immer ein zugaengliches Label haben — entweder sichtbarer Text oder aria-label fuer Icon-Only.
- Spinner wird im State 'loading' angezeigt und blockiert Interaktion.
- XS/SM Buttons haben unsichtbaren ::before Touch-Target (44px Minimum, WCAG 2.5.8).
- Loading nutzt visibility:hidden statt opacity:0 — Label-Breite bleibt erhalten, kein Layout-Shift.

## HTML API
### Elements
| Variant | Element | Attributes |
| --- | --- | --- |
| default | `<button>` | type=button |
| link | `<a>` | href? |

### Attributes
| Name | Type | Applies To |
| --- | --- | --- |
| `disabled` | boolean | button |
| `aria-disabled` | boolean | a |
| `aria-busy` | boolean | button, a |
| `aria-pressed` | boolean | button, a |
| `aria-label` | string | button, a |

## Variants
### Variant (`variant`)
Visuelle Variante / Semantik des Buttons

| Value | CSS Modifier | Default |
| --- | --- | --- |
| primary | — |  |
| secondary | `.nc-button--secondary` |  |
| accent | `.nc-button--accent` |  |
| outline | `.nc-button--outline` |  |
| ghost | `.nc-button--ghost` |  |
| soft | `.nc-button--soft` |  |
| inverted | `.nc-button--inverted` |  |
| success | `.nc-button--success` |  |
| warning | `.nc-button--warning` |  |
| error | `.nc-button--error` |  |
| info | `.nc-button--info` |  |

### Size (`size`)
Groessenabstufung des Buttons

| Value | CSS Modifier | Default |
| --- | --- | --- |
| xs | `.nc-button--xs` |  |
| sm | `.nc-button--sm` |  |
| md | — |  |
| lg | `.nc-button--lg` |  |

### Pattern (`pattern`)
Render-Muster / Slot-Konfiguration

| Value | CSS Modifier | Default |
| --- | --- | --- |
| standard | — |  |
| with-icon | — |  |
| icon-only | `.nc-button--icon-only` |  |

### Width (`width`)
Breitenverhalten des Buttons

| Value | CSS Modifier | Default |
| --- | --- | --- |
| auto | — |  |
| full | `.nc-button--full-width` |  |

### Composition (`composition`)
Kompositions-/Verwendungsform

| Value | CSS Modifier | Default |
| --- | --- | --- |
| single | — |  |
| group | — |  |
| toggle | — |  |
| fab | `.nc-button--fab` |  |
| link | — |  |

## States
Supported: `default`, `hover`, `active`, `focus-visible`, `disabled`, `loading`, `pressed`

- **loading**: blockInteraction
- **disabled**: blockInteraction
- **pressed**: 

## CSS Token API
Base classes: `nc-button`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-height-xs` | — | — |
| `nc-button-height-sm` | — | — |
| `nc-button-height-md` | — | — |
| `nc-button-height-lg` | — | — |
| `nc-button-padding-x-xs` | — | — |
| `nc-button-padding-x-sm` | — | — |
| `nc-button-padding-x-md` | — | — |
| `nc-button-padding-x-lg` | — | — |
| `nc-button-padding-y-xs` | — | — |
| `nc-button-padding-y-sm` | — | — |
| `nc-button-padding-y-md` | — | — |
| `nc-button-padding-y-lg` | — | — |
| `nc-button-radius-xs` | — | — |
| `nc-button-radius-sm` | — | — |
| `nc-button-radius-md` | — | — |
| `nc-button-radius-lg` | — | — |
| `nc-button-radius-full` | — | — |
| `nc-button-border-width-sm` | — | — |
| `nc-button-border-width-lg` | — | — |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-font-size-xs` | — | — |
| `nc-button-font-size-sm` | — | — |
| `nc-button-font-size-md` | — | — |
| `nc-button-font-size-lg` | — | — |
| `nc-button-line-height` | — | — |
| `nc-button-font-weight` | — | — |
| `nc-button-gap` | — | — |
| `nc-button-min-width` | — | — |
| `nc-button-label-compact` | — | — |
| `nc-button-label-expressive` | — | — |

### Interaction
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-transition-duration` | — | — |
| `nc-button-scale-active` | — | — |
| `nc-button-opacity-disabled` | — | — |

### Touch Target
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-touch-target-min` | — | — |

### Icon Sizing
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-icon-gap-xs` | — | — |
| `nc-button-icon-gap-sm` | — | — |
| `nc-button-icon-gap-md` | — | — |
| `nc-button-icon-gap-lg` | — | — |
| `nc-button-icon-size-xs` | — | — |
| `nc-button-icon-size-sm` | — | — |
| `nc-button-icon-size-md` | — | — |
| `nc-button-icon-size-lg` | — | — |

### Size Scale
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-height-xs` | — | — |
| `nc-button-height-sm` | — | — |
| `nc-button-height-md` | — | — |
| `nc-button-height-lg` | — | — |
| `nc-button-padding-x-xs` | — | — |
| `nc-button-padding-x-sm` | — | — |
| `nc-button-padding-x-md` | — | — |
| `nc-button-padding-x-lg` | — | — |
| `nc-button-font-size-xs` | — | — |
| `nc-button-font-size-sm` | — | — |
| `nc-button-font-size-md` | — | — |
| `nc-button-font-size-lg` | — | — |

### Primary
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-primary-bg` | — | — |
| `nc-button-primary-bg-hover` | — | — |
| `nc-button-primary-bg-active` | — | — |
| `nc-button-primary-color` | — | — |
| `nc-button-primary-border` | — | — |

### Secondary
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-secondary-bg` | — | — |
| `nc-button-secondary-bg-hover` | — | — |
| `nc-button-secondary-bg-active` | — | — |
| `nc-button-secondary-color` | — | — |
| `nc-button-secondary-border` | — | — |

### Outline
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-outline-bg` | — | — |
| `nc-button-outline-bg-hover` | — | — |
| `nc-button-outline-bg-active` | — | — |
| `nc-button-outline-color` | — | — |
| `nc-button-outline-border` | — | — |

### Ghost
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-ghost-bg` | — | — |
| `nc-button-ghost-bg-hover` | — | — |
| `nc-button-ghost-bg-active` | — | — |
| `nc-button-ghost-color` | — | — |
| `nc-button-ghost-border` | — | — |

### Soft
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-soft-bg` | — | — |
| `nc-button-soft-bg-hover` | — | — |
| `nc-button-soft-bg-active` | — | — |
| `nc-button-soft-color` | — | — |
| `nc-button-soft-border` | — | — |

### Inverted
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-inverted-bg` | — | — |
| `nc-button-inverted-bg-hover` | — | — |
| `nc-button-inverted-bg-active` | — | — |
| `nc-button-inverted-color` | — | — |
| `nc-button-inverted-border` | — | — |

### Accent
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-accent-bg` | — | — |
| `nc-button-accent-bg-hover` | — | — |
| `nc-button-accent-bg-active` | — | — |
| `nc-button-accent-color` | — | — |
| `nc-button-accent-border` | — | — |

### Success
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-success-bg` | — | — |
| `nc-button-success-bg-hover` | — | — |
| `nc-button-success-bg-active` | — | — |
| `nc-button-success-color` | — | — |
| `nc-button-success-border` | — | — |

### Warning
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-warning-bg` | — | — |
| `nc-button-warning-bg-hover` | — | — |
| `nc-button-warning-bg-active` | — | — |
| `nc-button-warning-color` | — | — |
| `nc-button-warning-border` | — | — |

### Error
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-error-bg` | — | — |
| `nc-button-error-bg-hover` | — | — |
| `nc-button-error-bg-active` | — | — |
| `nc-button-error-color` | — | — |
| `nc-button-error-border` | — | — |

### Info
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-info-bg` | — | — |
| `nc-button-info-bg-hover` | — | — |
| `nc-button-info-bg-active` | — | — |
| `nc-button-info-color` | — | — |
| `nc-button-info-border` | — | — |

### Disabled
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-disabled-bg` | — | — |
| `nc-button-disabled-color` | — | — |
| `nc-button-disabled-border` | — | — |
| `nc-button-opacity-disabled` | — | — |

### FAB (Floating Action Button)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-fab-size` | — | — |
| `nc-button-fab-radius` | — | — |
| `nc-button-fab-shadow` | — | — |
| `nc-button-fab-shadow-hover` | — | — |

### Icon Button
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-icon-button-size` | — | — |
| `nc-icon-button-padding` | — | — |
| `nc-icon-button-radius` | — | — |
| `nc-icon-button-bg` | — | — |
| `nc-icon-button-bg-hover` | — | — |
| `nc-icon-button-color` | — | — |

### Spinner / Loading
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-button-spinner-size` | — | — |
| `nc-button-spinner-border-width` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | activate | Loest den Click-Handler aus. |
| `Space` | activate | Loest den Click-Handler aus. Verhindert Page-Scroll. |

## Test Selectors
| Slot | Selector |
| --- | --- |
| root | `[data-testid='button']` |
| label | `[data-testid='button-label']` |
| icon | `[data-testid='button-icon']` |
| spinner | `[data-testid='button-spinner']` |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `click` | Yes | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- focusIndicatorVisible

## Web Components Mapping
Derived from anatomy for potential `<nc-button>` custom element:

```js
class NcButton extends HTMLElement {
  static observedAttributes = ['variant', 'size', 'pattern', 'width', 'composition'];
  // Slots: <slot name="label">
}
```

---

*Generated from `data/button-recipe.json` by `scripts/generate-component-specs.js`*
