# aspect-ratio Component Spec
> Version 1.0.0 | Status: stable | Layer: unknown

Tags: `layout`, `object`, `media`

## Anatomy
Root element: `.nc-aspect-ratio`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| content | `.nc-aspect-ratio__content` | Yes | Child-Element (img, video, iframe). Fuellt Container absolut. |

### DOM Notes
- Nutzt native CSS aspect-ratio Property.
- Alle Ratios ueber --nc-aspect-ratio-ratio Token steuerbar.
- Custom Ratio via Inline-Style: style="--nc-aspect-ratio-ratio: 21 / 9".
- Reines Layout-Primitive — keine ARIA-Attribute noetig. Semantik kommt vom Child.

## Variants
### Seitenverhaeltnis (`ratio`)
Vordefiniertes Seitenverhaeltnis.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| Square (1:1) | `.nc-aspect-ratio--1-1` |  |
| Landscape Klassisch (4:3) | `.nc-aspect-ratio--4-3` |  |
| Portrait Klassisch (3:4) | `.nc-aspect-ratio--3-4` |  |
| Widescreen (16:9, Default) | `.nc-aspect-ratio--16-9` | Yes |
| Vertikal / Stories (9:16) | `.nc-aspect-ratio--9-16` |  |
| Panorama (2:1) | `.nc-aspect-ratio--2-1` |  |
| Tall Portrait (1:2) | `.nc-aspect-ratio--1-2` |  |
| Classic Landscape (3:2) | `.nc-aspect-ratio--3-2` |  |
| Classic Portrait (2:3) | `.nc-aspect-ratio--2-3` |  |

## CSS Token API
Base classes: `.nc-aspect-ratio`

### Aspect Ratio
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-aspect-ratio-ratio` | aspect-ratio | `--mod-aspect-ratio-ratio` |

## Accessibility
- Reines Layout-Primitive, keine eigene Semantik. Alt-Text und ARIA kommen vom Child-Element (img, video).

## Web Components Mapping
Derived from anatomy for potential `<nc-aspect-ratio>` custom element:

```js
class NcAspectRatio extends HTMLElement {
  static observedAttributes = ['ratio'];
  // Slots: <slot name="content">
}
```

---

*Generated from `data/aspect-ratio-recipe.json` by `scripts/generate-component-specs.js`*
