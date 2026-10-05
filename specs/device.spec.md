# device Component Spec
> Version 1.0.0 | Status: stable | Layer: atom

Tags: `media`, `app`, `device`

## Anatomy
Root element: `.nc-device`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| screen | `.nc-device__screen` | Yes | Der Bildschirm. Bringt das Seitenverhaeltnis mit — deshalb darf ihm kein Elternteil eines aufzwingen. |
| caption | `.nc-device-figure__caption` | No | Beschriftung ausserhalb des Rahmens, in .nc-device-figure. |

### DOM Notes
- Das Seitenverhaeltnis 1206/2622 ist das gemessene Mass der vorhandenen App-Screenshots (iPhone 17), nicht ein gerundeter Geraetewert. Wo Rahmen und Bild uebereinstimmen, hat object-fit nichts zu tun.
- object-fit ist contain, NICHT cover. cover war die Ursache des Problems, fuer das dieses Bauteil gebaut wurde: In einem 16:9-Rahmen blieben von 2622 px Hoehe 678 uebrig.
- Die Aussparung ist ein Pseudoelement und steht deshalb gar nicht im Baum — sie braucht kein aria-hidden.

## Variants
### Groesse (`size`)
| Value | CSS Modifier | Default |
| --- | --- | --- |
| sm | `.nc-device--sm` |  |
| default | — |  |
| lg | `.nc-device--lg` |  |

### Neigung (`tilt`)
| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| left | `.nc-device--tilt-left` |  |
| right | `.nc-device--tilt-right` |  |

### Aussparung (`notch`)
| Value | CSS Modifier | Default |
| --- | --- | --- |
| on | — |  |
| off | `.nc-device--plain` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-device`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-device-ratio` | — | `--mod-device-ratio` |
| `--nc-device-width` | — | `--mod-device-width` |
| `--nc-device-bezel` | — | `--mod-device-bezel` |
| `--nc-device-bezel-color` | — | `--mod-device-bezel-color` |
| `--nc-device-radius` | — | `--mod-device-radius` |
| `--nc-device-screen-radius` | — | `--mod-device-screen-radius` |
| `--nc-device-shadow` | — | `--mod-device-shadow` |
| `--nc-device-notch-width` | — | `--mod-device-notch-width` |
| `--nc-device-notch-height` | — | `--mod-device-notch-height` |
| `--nc-device-notch-radius` | — | `--mod-device-notch-radius` |
| `--nc-device-tilt` | — | `--mod-device-tilt` |
| `--nc-device-caption-size` | — | `--mod-device-caption-size` |
| `--nc-device-caption-color` | — | `--mod-device-caption-color` |
| `--nc-device-caption-gap` | — | `--mod-device-caption-gap` |

### Geometrie
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-device-width-per-height` | — | `--mod-device-width-per-height` |

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-device>` custom element:

```js
class NcDevice extends HTMLElement {
  static observedAttributes = ['size', 'tilt', 'notch'];
  // Slots: <slot name="screen">
}
```

---

*Generated from `data/device-recipe.json` by `scripts/generate-component-specs.js`*
