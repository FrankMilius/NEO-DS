# item Component Spec
> Version 2.0.0 | Status: stable | Layer: molecule

Tags: `display`, `content`, `list`, `media-object`

## Anatomy
Root element: `.nc-item`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| media | `.nc-item__media` | No | — |
| content | `.nc-item__content` | Yes | — |
| title | `.nc-item__title` | Yes | — |
| description | `.nc-item__description` | No | — |
| meta | `.nc-item__meta` | No | — |
| actions | `.nc-item__actions` | No | — |

### DOM Notes
- Flex-Layout: align-items center (oder flex-start via --align-start), gap spacing-03.
- Grid-basierte Content-Struktur: title (bold, text-primary) + description (text-secondary).
- Left-Accent-Border via ::before Pseudo-Element (2px, interactive-Farbe) bei Hover/Active/Selected.
- Density: compact (spacing-01/02), default (spacing-03/04), loose (spacing-04/05).
- Thumbnail: 16:9 Aspect-Ratio, konfigurierbarer Breite (120px default).
- Meta-Slot: Inline-flex rechts neben Content, fuer Shortcuts/Badges.

## Variants
### Variant (`variant`)
Visuelle Variante — default (transparent), outline (Border + Shadow), muted (Hintergrund)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| outline | `.nc-item--outline` |  |
| muted | `.nc-item--muted` |  |

### Size (`size`)
Groesse — default, sm, xs

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| sm | `.nc-item--sm` |  |
| xs | `.nc-item--xs` |  |

### Density (`density`)
Informationsdichte — compact (wenig Platz), default (ausgewogen), loose (viel Platz)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| compact | `.nc-item--compact` |  |
| default | — |  |
| loose | `.nc-item--loose` |  |

### Alignment (`alignment`)
Vertikale Ausrichtung — center (zentriert), start (oben)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| center | — |  |
| start | `.nc-item--align-start` |  |

### Media (`media`)
Media-Typ — none, icon, image, avatar, thumbnail (16:9)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| icon | `.nc-item__media--icon` |  |
| image | `.nc-item__media--image` |  |
| avatar | `.nc-item__media--avatar` |  |
| thumbnail | `.nc-item__media--thumbnail` |  |

## States
Supported: `default`, `hover`, `active`, `selected`, `disabled`

- **hover**: 
- **active**: 
- **selected**: 
- **disabled**: 

## CSS Token API
Base classes: `nc-item`

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-item-bg` | — | `--mod-item-bg` |
| `--nc-item-border` | — | `--mod-item-border` |
| `--nc-item-hover-bg` | — | `--mod-item-hover-bg` |
| `--nc-item-active-bg` | — | `--mod-item-active-bg` |
| `--nc-item-title-color` | — | `--mod-item-title-color` |
| `--nc-item-desc-color` | — | `--mod-item-desc-color` |
| `--nc-item-accent-color` | — | `--mod-item-accent-color` |
| `--nc-item-accent-width` | — | `--mod-item-accent-width` |

### Geometry
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-item-gap` | — | `--mod-item-gap` |
| `--nc-item-padding-x` | — | `--mod-item-padding-x` |
| `--nc-item-padding-y` | — | `--mod-item-padding-y` |
| `--nc-item-radius` | — | `--mod-item-radius` |
| `--nc-item-border-width` | — | `--mod-item-border-width` |
| `--nc-item-align` | — | `--mod-item-align` |
| `--nc-item-accent-width` | — | `--mod-item-accent-width` |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-item-title-font-size` | — | `--mod-item-title-font-size` |
| `--nc-item-title-font-weight` | — | `--mod-item-title-font-weight` |
| `--nc-item-title-line-height` | — | `--mod-item-title-line-height` |
| `--nc-item-desc-font-size` | — | `--mod-item-desc-font-size` |
| `--nc-item-desc-line-height` | — | `--mod-item-desc-line-height` |

### Selected State
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-item-selected-bg` | — | `--mod-item-selected-bg` |
| `--nc-item-selected-border` | — | `--mod-item-selected-border` |
| `--nc-item-selected-accent-width` | — | `--mod-item-selected-accent-width` |

### Media
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-item-media-size` | — | `--mod-item-media-size` |
| `--nc-item-media-radius` | — | `--mod-item-media-radius` |
| `--nc-item-media-bg` | — | `--mod-item-media-bg` |
| `--nc-item-media-color` | — | `--mod-item-media-color` |

### Thumbnail
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-item-thumbnail-ratio` | — | `--mod-item-thumbnail-ratio` |
| `--nc-item-thumbnail-width` | — | `--mod-item-thumbnail-width` |
| `--nc-item-thumbnail-radius` | — | `--mod-item-thumbnail-radius` |

### Density: Compact
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-item-compact-padding-x` | — | `--mod-item-compact-padding-x` |
| `--nc-item-compact-padding-y` | — | `--mod-item-compact-padding-y` |
| `--nc-item-compact-gap` | — | `--mod-item-compact-gap` |
| `--nc-item-compact-media-size` | — | `--mod-item-compact-media-size` |

### Density: Loose
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-item-loose-padding-x` | — | `--mod-item-loose-padding-x` |
| `--nc-item-loose-padding-y` | — | `--mod-item-loose-padding-y` |
| `--nc-item-loose-gap` | — | `--mod-item-loose-gap` |
| `--nc-item-loose-media-size` | — | `--mod-item-loose-media-size` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Interactive Items muessen als <a>, <button> oder [role=button] ausgezeichnet sein
- Disabled Items benoetigen aria-disabled=true
- Gruppen: role=list/listbox, Items: role=listitem/option
- Selected Items: aria-selected=true oder aria-current=true
- Thumbnail-Bilder benoetigen alt-Text

## Web Components Mapping
Derived from anatomy for potential `<nc-item>` custom element:

```js
class NcItem extends HTMLElement {
  static observedAttributes = ['variant', 'size', 'density', 'alignment', 'media'];
  // Slots: <slot name="content">, <slot name="title">
}
```

---

*Generated from `data/item-recipe.json` by `scripts/generate-component-specs.js`*
