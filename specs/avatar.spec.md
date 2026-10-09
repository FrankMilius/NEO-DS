# avatar Component Spec
> Version 2.0.0 | Status: stable | Layer: atom

Tags: `static`, `interactive`, `identity`, `media`

## Anatomy
Root element: `.nc-avatar`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| image | `.nc-avatar__image` | No | — |
| fallback | `.nc-avatar__fallback` | No | — |
| badge | `.nc-avatar__badge` | No | — |

### DOM Notes
- Image/Fallback-Pattern: Fallback (z-index:0) immer im DOM, Image (z-index:1) ueberdeckt bei Erfolg.
- Image Fade-In: loading='lazy' → opacity:0 → .is-loaded (JS onload) → opacity:1. Verhindert Sprung von Initialen zu Bild.
- Wenn Image fehlt oder bricht → Fallback (Initialen oder Icon) wird automatisch sichtbar.
- Badge nutzt box-shadow statt border fuer saubere Abgrenzung ohne Layout-Shift.
- Badge ist rein dekorativ (aria-hidden='true') — Status muss textuell kommuniziert werden.
- Verified-Badge: Haekchen-SVG als Kind-Element von .nc-avatar__badge--verified.
- Avatar braucht immer alt-Text auf Image oder aria-label auf dem Container.
- Hash-Color: --nc-avatar-hash-bg / --nc-avatar-hash-color per inline-style setzen. JS berechnet Farbe aus Name-Hash.
- Interactive Mode: <a> fuer Links, <button> fuer Aktionen. Immer mit --interactive Modifier.
- Entity (square): Quadratisch mit abgerundeten Ecken fuer Firmenlogos und Projekt-Platzhalter.
- Group: flex-direction: row-reverse — spaetere Avatare erscheinen visuell hinten.
- Group-Count --interactive: oeffnet Popover mit restlichen Mitgliedern als Item-Liste.

## Variants
### Size (`size`)
5 Groessenabstufungen — xs (24px) / sm (32px) / md (40px, Standard) / lg (48px) / xl (64px)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| xs | `.nc-avatar--xs` |  |
| sm | `.nc-avatar--sm` |  |
| md | — |  |
| lg | `.nc-avatar--lg` |  |
| xl | `.nc-avatar--xl` |  |

### Shape (`shape`)
Form — circle (Standard, Personen) oder square (Entity: Firmenlogos, Projekt-Platzhalter)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| circle | — |  |
| square | `.nc-avatar--square` |  |

### Content (`content`)
Inhaltstyp — Image (Foto), Initialen-Fallback oder Icon-Fallback. Hash-Color fuer dynamische Fallback-Faerbung.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| image | — |  |
| initials | — |  |
| icon | — |  |
| hash | `.nc-avatar--hash` |  |

### Decorator (`decorator`)
Visuelle Erweiterungen: Ring (Abgrenzung), Status-Badge, Verified-Badge (Haekchen).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| none | — |  |
| ring | `.nc-avatar--ring` |  |
| badge-online | — |  |
| badge-offline | — |  |
| badge-busy | — |  |
| badge-away | — |  |
| badge-verified | — |  |

### Interactive (`interactive`)
Interaktivitaet — static (Standard), link (Profil-Link mit Hover-Scale), button (Upload/Aktion)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| static | — |  |
| link | `.nc-avatar--interactive` |  |
| button | `.nc-avatar--interactive` |  |

## States
Supported: `default`, `hover`, `active`, `focus`, `disabled`

- **hover**: 
- **active**: 
- **focus**: 
- **disabled**: 

## CSS Token API
Base classes: `nc-avatar`

### Sizing
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-avatar-size-xs` | — | `--mod-avatar-size-xs` |
| `--nc-avatar-size-sm` | — | `--mod-avatar-size-sm` |
| `--nc-avatar-size-md` | — | `--mod-avatar-size-md` |
| `--nc-avatar-size-lg` | — | `--mod-avatar-size-lg` |
| `--nc-avatar-size-xl` | — | `--mod-avatar-size-xl` |

### Typography
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-avatar-font-size-xs` | — | `--mod-avatar-font-size-xs` |
| `--nc-avatar-font-size-sm` | — | `--mod-avatar-font-size-sm` |
| `--nc-avatar-font-size-md` | — | `--mod-avatar-font-size-md` |
| `--nc-avatar-font-size-lg` | — | `--mod-avatar-font-size-lg` |
| `--nc-avatar-font-size-xl` | — | `--mod-avatar-font-size-xl` |
| `--nc-avatar-font-weight` | — | `--mod-avatar-font-weight` |

### Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-avatar-bg` | — | `--mod-avatar-bg` |
| `--nc-avatar-color` | — | `--mod-avatar-color` |
| `--nc-avatar-border-color` | — | — |

### Fallback
### Hash-Color Fallback
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-avatar-hash-bg` | — | `--mod-avatar-hash-bg` |
| `--nc-avatar-hash-color` | — | `--mod-avatar-hash-color` |

### Image Loading
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-avatar-image-fade-duration` | — | `--mod-avatar-image-fade-duration` |

### Circle
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-avatar-radius` | — | `--mod-avatar-radius` |

### Square (Entity)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-avatar-radius-square` | — | `--mod-avatar-radius-square` |

### Ring
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-avatar-ring-width` | — | `--mod-avatar-ring-width` |
| `--nc-avatar-ring-color` | — | `--mod-avatar-ring-color` |
| `--nc-avatar-ring-shadow` | — | `--mod-avatar-ring-shadow` |

### Badge
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-avatar-badge-size` | — | `--mod-avatar-badge-size` |
| `--nc-avatar-badge-border-width` | — | `--mod-avatar-badge-border-width` |
| `--nc-avatar-badge-border-color` | — | `--mod-avatar-badge-border-color` |
| `--nc-avatar-badge-online` | — | `--mod-avatar-badge-online` |
| `--nc-avatar-badge-offline` | — | `--mod-avatar-badge-offline` |
| `--nc-avatar-badge-busy` | — | `--mod-avatar-badge-busy` |
| `--nc-avatar-badge-away` | — | `--mod-avatar-badge-away` |
| `--nc-avatar-badge-verified` | — | `--mod-avatar-badge-verified` |

### Interactive (Link/Button)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-avatar-hover-scale` | — | `--mod-avatar-hover-scale` |
| `--nc-avatar-hover-shadow` | — | `--mod-avatar-hover-shadow` |
| `--nc-avatar-active-scale` | — | `--mod-avatar-active-scale` |
| `--nc-avatar-focus-ring-width` | — | `--mod-avatar-focus-ring-width` |
| `--nc-avatar-focus-ring-color` | — | `--mod-avatar-focus-ring-color` |
| `--nc-avatar-focus-ring-offset` | — | `--mod-avatar-focus-ring-offset` |
| `--nc-avatar-transition-duration` | — | — |

### Group
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-avatar-group-spacing` | — | `--mod-avatar-group-spacing` |
| `--nc-avatar-group-ring-width` | — | `--mod-avatar-group-ring-width` |
| `--nc-avatar-group-ring-color` | — | `--mod-avatar-group-ring-color` |

## Accessibility
Contrast Target: WCAG AA non-text (3:1)

- hasAccessibleName

## Web Components Mapping
Derived from anatomy for potential `<nc-avatar>` custom element:

```js
class NcAvatar extends HTMLElement {
  static observedAttributes = ['size', 'shape', 'content', 'decorator', 'interactive'];
  // Slots: default
}
```

---

*Generated from `data/avatar-recipe.json` by `scripts/generate-component-specs.js`*
