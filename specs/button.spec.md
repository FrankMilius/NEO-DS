# button Component Spec
> Version 2.2.1 | Status: stable | Layer: atom

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
- Spinner (.nc-button__spinner) wird im State 'loading' angezeigt und blockiert Interaktion: Modifier .nc-button--loading plus aria-busy='true' — erst der Modifier zeichnet den Spinner.
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
| toggle | `.nc-button--toggle` |  |
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
| `--nc-button-height-xs` | — | `--mod-button-height-xs` |
| `--nc-button-height-sm` | — | `--mod-button-height-sm` |
| `--nc-button-height-md` | — | `--mod-button-height-md` |
| `--nc-button-height-lg` | — | `--mod-button-height-lg` |
| `--nc-button-padding-x-xs` | — | `--mod-button-padding-x-xs` |
| `--nc-button-padding-x-sm` | — | `--mod-button-padding-x-sm` |
| `--nc-button-padding-x-md` | — | `--mod-button-padding-x-md` |
| `--nc-button-padding-x-lg` | — | `--mod-button-padding-x-lg` |
| `--nc-button-padding-y-xs` | — | `--mod-button-padding-y-xs` |
| `--nc-button-padding-y-sm` | — | `--mod-button-padding-y-sm` |
| `--nc-button-padding-y-md` | — | `--mod-button-padding-y-md` |
| `--nc-button-padding-y-lg` | — | `--mod-button-padding-y-lg` |
| `--nc-button-radius-xs` | — | `--mod-button-radius-xs` |
| `--nc-button-radius-sm` | — | `--mod-button-radius-sm` |
| `--nc-button-radius-md` | — | `--mod-button-radius-md` |
| `--nc-button-radius-lg` | — | `--mod-button-radius-lg` |
| `--nc-button-radius-full` | — | `--mod-button-radius-full` |
| `--nc-button-border-width-sm` | — | `--mod-button-border-width-sm` |
| `--nc-button-border-width-lg` | — | `--mod-button-border-width-lg` |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-font-size-xs` | — | `--mod-button-font-size-xs` |
| `--nc-button-font-size-sm` | — | `--mod-button-font-size-sm` |
| `--nc-button-font-size-md` | — | `--mod-button-font-size-md` |
| `--nc-button-font-size-lg` | — | `--mod-button-font-size-lg` |
| `--nc-button-line-height` | — | `--mod-button-line-height` |
| `--nc-button-font-weight` | — | `--mod-button-font-weight` |
| `--nc-button-gap` | — | `--mod-button-gap` |
| `--nc-button-min-width` | — | `--mod-button-min-width` |
| `--nc-button-label-compact` | — | `--mod-button-label-compact` |
| `--nc-button-label-expressive` | — | `--mod-button-label-expressive` |

### Interaction
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-transition-duration` | — | `--mod-button-transition-duration` |
| `--nc-button-scale-active` | — | `--mod-button-scale-active` |
| `--nc-button-opacity-disabled` | — | `--mod-button-opacity-disabled` |

### Touch Target
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-touch-target-min` | — | `--mod-button-touch-target-min` |

### Icon Sizing
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-icon-gap-xs` | — | `--mod-button-icon-gap-xs` |
| `--nc-button-icon-gap-sm` | — | `--mod-button-icon-gap-sm` |
| `--nc-button-icon-gap-md` | — | `--mod-button-icon-gap-md` |
| `--nc-button-icon-gap-lg` | — | `--mod-button-icon-gap-lg` |
| `--nc-button-icon-size-xs` | — | `--mod-button-icon-size-xs` |
| `--nc-button-icon-size-sm` | — | `--mod-button-icon-size-sm` |
| `--nc-button-icon-size-md` | — | `--mod-button-icon-size-md` |
| `--nc-button-icon-size-lg` | — | `--mod-button-icon-size-lg` |

### Size Scale
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-height-xs` | — | `--mod-button-height-xs` |
| `--nc-button-height-sm` | — | `--mod-button-height-sm` |
| `--nc-button-height-md` | — | `--mod-button-height-md` |
| `--nc-button-height-lg` | — | `--mod-button-height-lg` |
| `--nc-button-padding-x-xs` | — | `--mod-button-padding-x-xs` |
| `--nc-button-padding-x-sm` | — | `--mod-button-padding-x-sm` |
| `--nc-button-padding-x-md` | — | `--mod-button-padding-x-md` |
| `--nc-button-padding-x-lg` | — | `--mod-button-padding-x-lg` |
| `--nc-button-font-size-xs` | — | `--mod-button-font-size-xs` |
| `--nc-button-font-size-sm` | — | `--mod-button-font-size-sm` |
| `--nc-button-font-size-md` | — | `--mod-button-font-size-md` |
| `--nc-button-font-size-lg` | — | `--mod-button-font-size-lg` |

### Primary
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-primary-bg` | — | `--mod-button-primary-bg` |
| `--nc-button-primary-bg-hover` | — | `--mod-button-primary-bg-hover` |
| `--nc-button-primary-bg-active` | — | `--mod-button-primary-bg-active` |
| `--nc-button-primary-color` | — | `--mod-button-primary-color` |
| `--nc-button-primary-border` | — | `--mod-button-primary-border` |

### Secondary
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-secondary-bg` | — | `--mod-button-secondary-bg` |
| `--nc-button-secondary-bg-hover` | — | `--mod-button-secondary-bg-hover` |
| `--nc-button-secondary-bg-active` | — | `--mod-button-secondary-bg-active` |
| `--nc-button-secondary-color` | — | `--mod-button-secondary-color` |
| `--nc-button-secondary-border` | — | `--mod-button-secondary-border` |

### Outline
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-outline-bg` | — | `--mod-button-outline-bg` |
| `--nc-button-outline-bg-hover` | — | `--mod-button-outline-bg-hover` |
| `--nc-button-outline-bg-active` | — | `--mod-button-outline-bg-active` |
| `--nc-button-outline-color` | — | `--mod-button-outline-color` |
| `--nc-button-outline-border` | — | `--mod-button-outline-border` |

### Ghost
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-ghost-bg` | — | `--mod-button-ghost-bg` |
| `--nc-button-ghost-bg-hover` | — | `--mod-button-ghost-bg-hover` |
| `--nc-button-ghost-bg-active` | — | `--mod-button-ghost-bg-active` |
| `--nc-button-ghost-color` | — | `--mod-button-ghost-color` |
| `--nc-button-ghost-border` | — | `--mod-button-ghost-border` |

### Soft
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-soft-bg` | — | `--mod-button-soft-bg` |
| `--nc-button-soft-bg-hover` | — | `--mod-button-soft-bg-hover` |
| `--nc-button-soft-bg-active` | — | `--mod-button-soft-bg-active` |
| `--nc-button-soft-color` | — | `--mod-button-soft-color` |
| `--nc-button-soft-border` | — | `--mod-button-soft-border` |

### Inverted
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-inverted-bg` | — | `--mod-button-inverted-bg` |
| `--nc-button-inverted-bg-hover` | — | `--mod-button-inverted-bg-hover` |
| `--nc-button-inverted-bg-active` | — | `--mod-button-inverted-bg-active` |
| `--nc-button-inverted-color` | — | `--mod-button-inverted-color` |
| `--nc-button-inverted-border` | — | `--mod-button-inverted-border` |

### Accent
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-accent-bg` | — | `--mod-button-accent-bg` |
| `--nc-button-accent-bg-hover` | — | `--mod-button-accent-bg-hover` |
| `--nc-button-accent-bg-active` | — | `--mod-button-accent-bg-active` |
| `--nc-button-accent-color` | — | `--mod-button-accent-color` |
| `--nc-button-accent-border` | — | `--mod-button-accent-border` |

### Success
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-success-bg` | — | `--mod-button-success-bg` |
| `--nc-button-success-bg-hover` | — | `--mod-button-success-bg-hover` |
| `--nc-button-success-bg-active` | — | `--mod-button-success-bg-active` |
| `--nc-button-success-color` | — | `--mod-button-success-color` |
| `--nc-button-success-border` | — | `--mod-button-success-border` |

### Warning
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-warning-bg` | — | `--mod-button-warning-bg` |
| `--nc-button-warning-bg-hover` | — | `--mod-button-warning-bg-hover` |
| `--nc-button-warning-bg-active` | — | `--mod-button-warning-bg-active` |
| `--nc-button-warning-color` | — | `--mod-button-warning-color` |
| `--nc-button-warning-border` | — | `--mod-button-warning-border` |

### Error
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-error-bg` | — | `--mod-button-error-bg` |
| `--nc-button-error-bg-hover` | — | `--mod-button-error-bg-hover` |
| `--nc-button-error-bg-active` | — | `--mod-button-error-bg-active` |
| `--nc-button-error-color` | — | `--mod-button-error-color` |
| `--nc-button-error-border` | — | `--mod-button-error-border` |

### Info
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-info-bg` | — | `--mod-button-info-bg` |
| `--nc-button-info-bg-hover` | — | `--mod-button-info-bg-hover` |
| `--nc-button-info-bg-active` | — | `--mod-button-info-bg-active` |
| `--nc-button-info-color` | — | `--mod-button-info-color` |
| `--nc-button-info-border` | — | `--mod-button-info-border` |

### Disabled
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-disabled-bg` | — | `--mod-button-disabled-bg` |
| `--nc-button-disabled-color` | — | `--mod-button-disabled-color` |
| `--nc-button-disabled-border` | — | `--mod-button-disabled-border` |
| `--nc-button-opacity-disabled` | — | `--mod-button-opacity-disabled` |

### FAB (Floating Action Button)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-fab-size` | — | `--mod-button-fab-size` |
| `--nc-button-fab-radius` | — | `--mod-button-fab-radius` |
| `--nc-button-fab-shadow` | — | `--mod-button-fab-shadow` |
| `--nc-button-fab-shadow-hover` | — | `--mod-button-fab-shadow-hover` |

### Spinner / Loading
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-button-spinner-size` | — | `--mod-button-spinner-size` |
| `--nc-button-spinner-border-width` | — | `--mod-button-spinner-border-width` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | activate | Loest den Click-Handler aus (nativ). Toggle (.nc-button--toggle): schaltet aria-pressed um (neo-behaviors button). |
| `Space` | activate | Loest den Click-Handler aus (nativ, beim Loslassen). Verhindert Page-Scroll. Toggle: schaltet aria-pressed um wie Enter. |

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
| `button-toggle` | Yes | `{"pressed":"boolean","value":"string"}` |

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
