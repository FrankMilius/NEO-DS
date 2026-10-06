# card Component Spec
> Version 3.2.1 | Status: stable | Layer: molecule

Tags: `container`, `surface`, `interactive`, `layout`

## Anatomy
Root element: `.nc-card`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| media | `.nc-card__media` | No | Bild, Video oder Platzhalter. Standard aspect-ratio 3:2. |
| content | `.nc-card__content` | Yes | Freier Inhaltsbereich, flex-grow: 1, Padding via Token. |
| footer | `.nc-card__footer` | No | Aktionen, Meta. margin-top: auto, immer am unteren Rand. |

### DOM Notes
- Root-Element haengt vom Behavior ab: <article> (static), <a> (navigational-entire), <label> (selectable), <details> (expandable).
- Title-Link (navigational-partial): ::after { position: absolute; inset: 0 } fuer Stretched Link.
- Selectable: Hidden <input> (sr-only), :has(:checked) fuer Selected-State.
- Footer-Actions haben z-index: 1 ueber dem Stretched Title-Link.
- Skeleton-State via --skeleton Modifier auf Root — kein JS noetig.

## Variants
### Behavior (`behavior`)
Interaktionsmodell der Card

| Value | CSS Modifier | Default |
| --- | --- | --- |
| static | — |  |
| navigational | `.nc-card--navigational` |  |
| selectable | `.nc-card--selectable` |  |
| expandable | `.nc-card--expandable` |  |
| action | `.nc-card--action` |  |

### Pattern (`pattern`)
Visuelles Layout-Muster der Card

| Value | CSS Modifier | Default |
| --- | --- | --- |
| standard | — |  |
| preview | `.nc-card--preview` |  |
| featured | `.nc-card--preview nc-card--featured` |  |
| summary | `.nc-card--summary` |  |
| status | `.nc-card--status` |  |
| horizontal | `.nc-card--horizontal` |  |

### Status Level (`statusLevel`)
Farbe des Status-Indikators (nur fuer pattern: status)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| success | `.nc-card--status-success` |  |
| warning | `.nc-card--status-warning` |  |
| danger | `.nc-card--status-danger` |  |
| info | `.nc-card--status-info` |  |

### Layout-Kontext (`context`)
Kontextueller Kontext der Card innerhalb eines Grid/Section-Layouts

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| tight | `.nc-card--tight` |  |
| display | `.nc-card--display` |  |

## States
Supported: `default`, `hover`, `focus-visible`, `active`, `disabled`, `selected`, `open`, `skeleton`

- **hover**: shadowElevate, borderHighlight
- **focus-visible**: focusRingInset
- **active**: scaleDown
- **disabled**: blockInteraction
- **selected**: selectedRing
- **open**: expandIconRotate
- **skeleton**: shimmerAnimation

## CSS Token API
Base classes: `nc-card`

### Basis
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-bg` | — | `--mod-card-bg` |
| `--nc-card-color` | — | `--mod-card-color` |
| `--nc-card-border` | — | `--mod-card-border` |
| `--nc-card-radius` | — | `--mod-card-radius` |
| `--nc-card-padding` | — | `--mod-card-padding` |
| `--nc-card-shadow` | — | `--mod-card-shadow` |
| `--nc-card-shadow-hover` | — | `--mod-card-shadow-hover` |
| `--nc-card-border-width` | — | `--mod-card-border-width` |
| `--nc-card-disabled-opacity` | — | `--mod-card-disabled-opacity` |

### Spacing
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-header-padding` | — | `--mod-card-header-padding` |
| `--nc-card-header-gap` | — | `--mod-card-header-gap` |
| `--nc-card-content-padding` | — | `--mod-card-content-padding` |
| `--nc-card-footer-padding` | — | `--mod-card-footer-padding` |
| `--nc-card-footer-gap` | — | `--mod-card-footer-gap` |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-title-font-size` | — | `--mod-card-title-font-size` |
| `--nc-card-title-font-weight` | — | `--mod-card-title-font-weight` |
| `--nc-card-title-color` | — | `--mod-card-title-color` |
| `--nc-card-title-line-height` | — | `--mod-card-title-line-height` |
| `--nc-card-description-font-size` | — | `--mod-card-description-font-size` |
| `--nc-card-description-color` | — | `--mod-card-description-color` |
| `--nc-card-description-line-height` | — | `--mod-card-description-line-height` |

### Interactive
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-transition-duration` | — | `--mod-card-transition-duration` |
| `--nc-card-hover-border` | — | `--mod-card-hover-border` |
| `--nc-card-nav-color-hover` | — | `--mod-card-nav-color-hover` |
| `--nc-card-link-decoration` | — | `--mod-card-link-decoration` |
| `--nc-card-link-hover-decoration` | — | `--mod-card-link-hover-decoration` |

### Selectable
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-selected-border` | — | `--mod-card-selected-border` |
| `--nc-card-selected-bg` | — | `--mod-card-selected-bg` |
| `--nc-card-selected-ring-width` | — | `--mod-card-selected-ring-width` |

### Expandable
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-summary-font-weight` | — | `--mod-card-summary-font-weight` |
| `--nc-card-summary-padding` | — | `--mod-card-summary-padding` |
| `--nc-card-details-content-padding` | — | `--mod-card-details-content-padding` |
| `--nc-card-expand-icon-size` | — | `--mod-card-expand-icon-size` |

### Status
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-status-border-width` | — | `--mod-card-status-border-width` |
| `--nc-card-status-success-border` | — | `--mod-card-status-success-border` |
| `--nc-card-status-warning-border` | — | `--mod-card-status-warning-border` |
| `--nc-card-status-danger-border` | — | `--mod-card-status-danger-border` |
| `--nc-card-status-info-border` | — | `--mod-card-status-info-border` |

### Preview
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-preview-media-ratio` | — | `--mod-card-preview-media-ratio` |
| `--nc-card-preview-title-size` | — | `--mod-card-preview-title-size` |

### Summary
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-summary-avatar-size` | — | `--mod-card-summary-avatar-size` |
| `--nc-card-summary-avatar-radius` | — | `--mod-card-summary-avatar-radius` |

### Action
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-action-icon-size` | — | `--mod-card-action-icon-size` |

### Tight Context
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-padding` | — | `--mod-card-padding` |
| `--nc-card-header-padding` | — | `--mod-card-header-padding` |
| `--nc-card-content-padding` | — | `--mod-card-content-padding` |
| `--nc-card-footer-padding` | — | `--mod-card-footer-padding` |
| `--nc-card-title-font-size` | — | `--mod-card-title-font-size` |
| `--nc-card-description-font-size` | — | `--mod-card-description-font-size` |

### Display Context
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-card-padding` | — | `--mod-card-padding` |
| `--nc-card-header-padding` | — | `--mod-card-header-padding` |
| `--nc-card-content-padding` | — | `--mod-card-content-padding` |
| `--nc-card-footer-padding` | — | `--mod-card-footer-padding` |
| `--nc-card-title-font-size` | — | `--mod-card-title-font-size` |
| `--nc-card-title-font-weight` | — | `--mod-card-title-font-weight` |
| `--nc-card-title-line-height` | — | `--mod-card-title-line-height` |
| `--nc-card-shadow` | — | `--mod-card-shadow` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- semanticStructure

## Web Components Mapping
Derived from anatomy for potential `<nc-card>` custom element:

```js
class NcCard extends HTMLElement {
  static observedAttributes = ['behavior', 'pattern', 'statusLevel', 'context'];
  // Slots: <slot name="content">
}
```

---

*Generated from `data/card-recipe.json` by `scripts/generate-component-specs.js`*
