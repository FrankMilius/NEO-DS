# container Component Spec
> Version 2.0.0 | Status: stable | Layer: organism

Tags: `layout`, `object`, `container`

## Anatomy
Root element: `.nc-container`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| content | `.nc-container > *` | Yes | Beliebiger Inhalt innerhalb des Containers. |

### DOM Notes
- Container zentriert Inhalt horizontal und begrenzt die maximale Breite.
- Fluid Padding Inline skaliert von 16px (320px Viewport) bis 48px (1600px) via clamp().
- Ab XXL (1920px) entfaellt das Inline-Padding, stattdessen greift max-width.
- Full-bleed Kinder (z.B. .nc-hero) brechen per negativem Margin aus dem Container aus.
- Vertical Spacing (padding-block) definiert den Abstand zur umgebenden Section/Shell.
- Alignment steuert die horizontale Ausrichtung (zentriert, links, rechts).
- Surface-Variante erlaubt Hintergrundfarbe und Schatten auf Layout-Ebene.

## Variants
### Breite (`width`)
Maximale Breite des Containers ab XXL-Breakpoint.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| standard | — |  |
| wide | `.nc-container--wide` |  |
| narrow | `.nc-container--narrow` |  |
| full | `.nc-container--full` |  |

### Vertical Spacing (`vertical-spacing`)
Vertikales Padding (padding-block) fuer den Abstand zur umgebenden Section oder Shell.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| sm | `.nc-container--vspace-sm` |  |
| md | `.nc-container--vspace-md` |  |
| lg | `.nc-container--vspace-lg` |  |

### Alignment (`alignment`)
Horizontale Ausrichtung des Containers innerhalb des Viewports.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| center | — |  |
| start | `.nc-container--align-start` |  |
| end | `.nc-container--align-end` |  |

### Surface (`surface`)
Optionale Hintergrund-Surface auf Layout-Ebene (aehnlich Card, aber als Container).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| transparent | — |  |
| elevated | `.nc-container--surface` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-container`

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-container-max-width` | — | `--mod-container-max-width` |
| `--nc-container-padding-inline` | — | `--mod-container-padding-inline` |
| `--nc-container-padding-inline-xxl` | — | `--mod-container-padding-inline-xxl` |
| `--nc-container-max-width-wide` | — | `--mod-container-max-width-wide` |

### Wide
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-container-max-width-wide` | — | `--mod-container-max-width-wide` |

### Vertical Spacing
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-container-padding-block-sm` | — | `--mod-container-padding-block-sm` |
| `--nc-container-padding-block-md` | — | `--mod-container-padding-block-md` |
| `--nc-container-padding-block-lg` | — | `--mod-container-padding-block-lg` |

### Alignment
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-container-margin-start` | — | `--mod-container-margin-start` |
| `--nc-container-margin-end` | — | `--mod-container-margin-end` |

### Surface
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-container-surface-bg` | — | `--mod-container-surface-bg` |
| `--nc-container-surface-radius` | — | `--mod-container-surface-radius` |
| `--nc-container-surface-shadow` | — | `--mod-container-surface-shadow` |
| `--nc-container-surface-padding` | — | `--mod-container-surface-padding` |

## Accessibility
- Container ist ein reines Layout-Element ohne semantische Rolle.
- Inhalt innerhalb des Containers muss eigenstaendig zugaenglich sein.
- Surface-Container sollten als <section> oder <article> mit aria-label genutzt werden.

## Dependencies
`hero`

## Web Components Mapping
Derived from anatomy for potential `<nc-container>` custom element:

```js
class NcContainer extends HTMLElement {
  static observedAttributes = ['width', 'vertical-spacing', 'alignment', 'surface'];
  // Slots: <slot name="content">
}
```

---

*Generated from `data/container-recipe.json` by `scripts/generate-component-specs.js`*
