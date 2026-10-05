# status Component Spec
> Version 1.0.0 | Status: stable | Layer: atom

Tags: `static`, `indicator`, `presence`

## Anatomy
Root element: `.nc-status`

### DOM Notes
- Status ist rein dekorativ — immer aria-hidden='true' auf dem Dot.
- Begleitender Text ueber .nc-status-label oder .u-sr-only fuer Screen-Reader.
- Farbe nie als einziges Signal — immer mit Text kombinieren (R3).
- Pulse-Animation respektiert prefers-reduced-motion automatisch.

## Variants
### Variant (`variant`)
Status-Semantik der Anzeige

| Value | CSS Modifier | Default |
| --- | --- | --- |
| neutral | — |  |
| online | `.nc-status--online` |  |
| offline | `.nc-status--offline` |  |
| busy | `.nc-status--busy` |  |
| away | `.nc-status--away` |  |

### Size (`size`)
Groessenabstufung — xs (6px) / sm (8px, Standard) / md (12px)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| xs | `.nc-status--xs` |  |
| sm | — |  |
| md | `.nc-status--md` |  |

### Decorator (`decorator`)
Visuelle Erweiterungen: Ring (weisser Rand) oder Pulse (Live-Animation)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| ring | `.nc-status--ring` |  |
| pulse | `.nc-status--pulse` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-status`

### Sizing
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-status-size-xs` | — | `--mod-status-size-xs` |
| `--nc-status-size-sm` | — | `--mod-status-size-sm` |
| `--nc-status-size-md` | — | `--mod-status-size-md` |

### Online
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-status-online` | — | `--mod-status-online` |

### Offline
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-status-offline` | — | `--mod-status-offline` |

### Busy
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-status-busy` | — | `--mod-status-busy` |

### Away
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-status-away` | — | `--mod-status-away` |

### Neutral
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-status-neutral` | — | `--mod-status-neutral` |

### Ring
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-status-ring-width` | — | `--mod-status-ring-width` |
| `--nc-status-ring-color` | — | `--mod-status-ring-color` |

### Pulse
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-status-pulse-duration` | — | `--mod-status-pulse-duration` |

## Accessibility
Contrast Target: WCAG AA non-text (3:1)

- doNotRelyOnColorOnly
- hasAccessibleName

## Web Components Mapping
Derived from anatomy for potential `<nc-status>` custom element:

```js
class NcStatus extends HTMLElement {
  static observedAttributes = ['variant', 'size', 'decorator'];
  // Slots: default
}
```

---

*Generated from `data/status-recipe.json` by `scripts/generate-component-specs.js`*
