# nav-atoms Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

Tags: `navigation`, `display`, `primitive`

## Anatomy
Root element: `.nc-nav__icon`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| icon | `.nc-nav__icon` | Yes | — |
| label | `.nc-nav__label` | Yes | — |
| badge | `.nc-nav__badge` | No | — |

### DOM Notes
- Icon: inline-flex Container, width/height via --nc-nav-atom-icon-size (default 24px).
- SVG-Kinder: fill:none, stroke:currentColor, stroke-width via Token.
- Label: display:block, font-size/weight/color via Tokens.
- Badge: Absolut positioniert relativ zum Elternelement. Roter Punkt mit weissem Ring.
- Werden in Nav-Molecules (06) und Organisms (07) zusammengesetzt.

## Variants
### Element (`element`)
Nav-Atom-Typ — icon (SVG-Container), label (Text), badge (Notification-Dot)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| icon | — |  |
| label | — |  |
| badge | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-nav__icon`

### Icon
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-nav-atom-icon-size` | — | `--mod-nav-atom-icon-size` |
| `--nc-nav-atom-icon-color` | — | `--mod-nav-atom-icon-color` |
| `--nc-nav-atom-icon-stroke` | — | `--mod-nav-atom-icon-stroke` |

### Label
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-nav-atom-label-size` | — | `--mod-nav-atom-label-size` |
| `--nc-nav-atom-label-weight` | — | `--mod-nav-atom-label-weight` |
| `--nc-nav-atom-label-color` | — | `--mod-nav-atom-label-color` |

### Badge Dot
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-nav-atom-badge-size` | — | `--mod-nav-atom-badge-size` |
| `--nc-nav-atom-badge-color` | — | `--mod-nav-atom-badge-color` |
| `--nc-nav-atom-badge-offset` | — | `--mod-nav-atom-badge-offset` |
| `--nc-nav-atom-badge-ring-width` | — | `--mod-nav-atom-badge-ring-width` |
| `--nc-nav-atom-badge-ring-color` | — | `--mod-nav-atom-badge-ring-color` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-nav-atoms>` custom element:

```js
class NcNavAtoms extends HTMLElement {
  static observedAttributes = ['element'];
  // Slots: <slot name="icon">, <slot name="label">
}
```

---

*Generated from `data/nav-atoms-recipe.json` by `scripts/generate-component-specs.js`*
