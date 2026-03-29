# toolbar Component Spec
> Version 2.0.0 | Status: stable | Layer: organism

Tags: `interactive`, `layout`, `action`, `editor`

## Anatomy
Root element: `.nc-toolbar`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| group | `.nc-toolbar__group` | Yes | — |
| separator | `.nc-toolbar__separator` | No | — |
| spacer | `.nc-toolbar__spacer` | No | — |
| label | `.nc-toolbar__label` | No | — |
| overflow-trigger | `.nc-toolbar__overflow-trigger` | No | — |

### DOM Notes
- Root: role='toolbar', aria-label. Flex-Layout, flex-wrap, min-height 48px.
- Group: Logische Zusammenfassung von Buttons/Inputs. Flex-Row mit gap.
- Group--end: margin-inline-start:auto — drueckt Gruppe ans rechte Ende.
- Spacer: flex:1 — flexibler Abstand zwischen Gruppen.
- Separator: Vertikale Trennlinie, feste Hoehe (24px), align-self:center. Dekorativ (aria-hidden).
- Label: Optionaler Text (z.B. 'Filter:', 'Ansicht:'), user-select:none.
- Overflow-Trigger: Button fuer Priority-Based Overflow, oeffnet Dropdown mit ausgeblendeten Items.
- Bordered: Border + Radius um die gesamte Toolbar.
- Border-Bottom: Nur untere Grenzlinie (z.B. unter Header).
- Floating: Card-aehnlich mit surface-elevated BG, Shadow, groesserem Radius. Ideal fuer Canvas-Editoren.
- Blurred: Glassmorphism — halbtransparenter BG + backdrop-filter:blur. Fuer Shell-Integration.
- Compact: 32px Desktop / 48px Mobile (Touch-Target Compliance).
- Sticky: position:sticky, top:0. Schatten via .is-scrolled Klasse (JS-gesteuert).
- Alignment: --align-center (zentriert), --align-justify (space-between).

## Variants
### Variant (`variant`)
Visuelle Variante — default (ohne Border), bordered (Rahmen), border-bottom (untere Linie), floating (Card mit Shadow), blurred (Glassmorphism)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| bordered | `.nc-toolbar--bordered` |  |
| border-bottom | `.nc-toolbar--border-bottom` |  |
| floating | `.nc-toolbar--floating` |  |
| blurred | `.nc-toolbar--blurred` |  |

### Density (`density`)
Informationsdichte — default (48px), compact (32px Desktop / 48px Mobile)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| compact | `.nc-toolbar--compact` |  |

### Alignment (`alignment`)
Ausrichtung der Gruppen — start (links), center (zentriert), justify (gleichmaessig verteilt)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| start | — |  |
| center | `.nc-toolbar--align-center` |  |
| justify | `.nc-toolbar--align-justify` |  |

### Content (`content`)
Inhaltsvariante — buttons-only, with-separator, with-spacer, with-label, full (alle Elemente)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| buttons-only | — |  |
| with-separator | — |  |
| with-spacer | — |  |
| with-label | — |  |
| full | — |  |

### Sticky (`sticky`)
Sticky-Verhalten — none (normal), sticky (haftet unter Navbar mit Scroll-Shadow)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| sticky | `.nc-toolbar--sticky` |  |

## States
Supported: `default`, `scrolled`

- **scrolled**: 

## CSS Token API
Base classes: `nc-toolbar`

### Container
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-toolbar-height` | — | — |
| `nc-toolbar-padding` | — | — |
| `nc-toolbar-gap` | — | — |
| `nc-toolbar-bg` | — | — |
| `nc-toolbar-border` | — | — |
| `nc-toolbar-border-width` | — | — |
| `nc-toolbar-radius` | — | — |

### Separator
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-toolbar-separator-color` | — | — |
| `nc-toolbar-separator-width` | — | — |
| `nc-toolbar-separator-margin` | — | — |
| `nc-toolbar-separator-height` | — | — |

### Label
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-toolbar-label-color` | — | — |
| `nc-toolbar-label-size` | — | — |
| `nc-toolbar-label-weight` | — | — |

### Compact
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-toolbar-compact-height` | — | — |
| `nc-toolbar-compact-gap` | — | — |
| `nc-toolbar-compact-padding` | — | — |

### Floating
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-toolbar-floating-bg` | — | — |
| `nc-toolbar-floating-radius` | — | — |
| `nc-toolbar-floating-shadow` | — | — |
| `nc-toolbar-floating-border` | — | — |

### Blurred (Glassmorphism)
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-toolbar-blurred-bg` | — | — |
| `nc-toolbar-blurred-blur` | — | — |
| `nc-toolbar-blurred-border` | — | — |

### Sticky
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-toolbar-sticky-shadow` | — | — |
| `nc-toolbar-sticky-z-index` | — | — |

### Overflow
| Token | CSS Property | Override |
| --- | --- | --- |
| `nc-toolbar-overflow-trigger-size` | — | — |

## Accessibility
Contrast Target: WCAG AA non-text (3:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-toolbar>` custom element:

```js
class NcToolbar extends HTMLElement {
  static observedAttributes = ['variant', 'density', 'alignment', 'content', 'sticky'];
  // Slots: <slot name="group">
}
```

---

*Generated from `data/toolbar-recipe.json` by `scripts/generate-component-specs.js`*
