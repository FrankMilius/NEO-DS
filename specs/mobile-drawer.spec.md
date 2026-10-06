# mobile-drawer Component Spec
> Version 1.2.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `organisms`

## Anatomy
Root element: `.nc-mobile-drawer`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| backdrop | `.nc-mobile-drawer__backdrop` | Yes | — |
| backdrop--visible | `.nc-mobile-drawer__backdrop--visible` | Yes | — |
| close | `.nc-mobile-drawer__close` | Yes | — |
| header | `.nc-mobile-drawer__header` | Yes | — |
| link | `.nc-mobile-drawer__link` | Yes | — |
| list | `.nc-mobile-drawer__list` | Yes | — |
| nav | `.nc-mobile-drawer__nav` | No | — |
| sublink | `.nc-mobile-drawer__sublink` | No | — |
| sublist | `.nc-mobile-drawer__sublist` | No | — |
| title | `.nc-mobile-drawer__title` | No | — |

### DOM Notes
- Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.
- Slots sind aus Klassennamen abgeleitet. Die ersten sechs werden in der Story gerendert, um die Struktur zu zeigen — welche wirklich Pflicht sind, klaert erst eine Spezifikation.
- Markup nach den BEM-Klassen des SCSS (kein geerntetes Markup): Backdrop als Geschwister vor aside.nc-mobile-drawer; __header (__title, __close), __nav > __list > li > __link (+ __sublist > li > __sublink).
- Unter 1200 px Fensterbreite; darueber blendet das DS Drawer und Backdrop aus. Oeffnen und Schliessen: Behavior mobile-drawer (neo-behaviors) — Ausloeser ist ein Knopf mit aria-controls="<id des Drawers>" (auf der Website .nc-mobile-toggle); Backdrop ist das Geschwister .nc-mobile-drawer__backdrop. Auf der Website steuert es bis zur Umstellung noch neo-theme.js (neoMobileNav).
- Modal (neo-behaviors mobile-drawer): offen role=dialog + aria-modal, Fokus auf das erste bedienbare Element, Fokus-Falle, Geschwister bis <body> ausser dem Backdrop inert, body.u-no-scroll (gestaltet das Theme); geschlossen inert + aria-hidden="true" — der aus dem Bild geschobene Drawer ist sonst per Tab erreichbar. Ab 1200 px (display: none) tut der Knopf nichts, ein offener Drawer schliesst (reason resize).

## Variants
### Variante (`variante`)
Geschlossen (aus dem Bild geschoben) oder offen.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| open | `.nc-mobile-drawer--open` |  |

## States
Supported: `default`, `hover`

## CSS Token API
Base classes: `nc-mobile-drawer`

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | toggle-drawer | Auf dem Knopf mit aria-controls="<id des Drawers>" (nativer Knopf): oeffnet den Drawer, Fokus auf das erste bedienbare Element (Schliessen-Knopf). Erneut: schliesst. |
| `Space` | toggle-drawer | Wie Enter auf dem Knopf. |
| `Escape` | close | Offener Drawer: schliesst, gibt den Rest der Seite frei, Fokus zurueck auf den Ausloeser. |
| `Tab` | trap-focus | Offener Drawer: Fokus bleibt im Drawer (vom letzten zum ersten Element). |
| `Shift+Tab` | trap-focus-reverse | Offener Drawer: vom ersten zum letzten Element. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `mobile-drawer-open` | Yes | — |
| `mobile-drawer-close` | Yes | `{"reason":"string"}` |

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-mobile-drawer>` custom element:

```js
class NcMobileDrawer extends HTMLElement {
  static observedAttributes = ['variante'];
  // Slots: <slot name="backdrop">, <slot name="backdrop--visible">, <slot name="close">, <slot name="header">, <slot name="link">, <slot name="list">
}
```

---

*Generated from `data/mobile-drawer-recipe.json` by `scripts/generate-component-specs.js`*
