# tab-nav Component Spec
> Version 1.1.0 | Status: draft | Layer: unknown

Tags: `aufgenommen`, `molecules`

## Anatomy
Root element: `.nc-tab-nav`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| badges | `.nc-tab-nav__badges` | Yes | — |
| bento | `.nc-tab-nav__bento` | Yes | — |
| module | `.nc-tab-nav__module` | Yes | — |
| panel-body | `.nc-tab-nav__panel-body` | Yes | — |
| panel | `.nc-tab-nav__panel` | Yes | — |
| features | `.nc-tab-nav__features` | No | — |
| xpanels | `.nc-tab-nav__xpanels` | No | — |

### DOM Notes
- Wurzel: .nc-solution-tabs.nc-tab-nav (data-orientation, data-autoplay) — Tableiste und Tabs von solution-tabs, Panel .nc-solution-tabs__panel.nc-tab-nav__panel > .nc-tab-nav__panel-body.
- Panel-Body: Titel, Text, Inhaltsmodul .nc-tab-nav__module und CTA (nc-button--accent nc-button--lg).
- Inhaltsmodule der Website: Feature-Liste (nc-feature-list__items), Features (nc-solution-tabs__features nc-tab-nav__features), Bento-Raster (nc-bento-grid nc-tab-nav__bento), Expanding Panels (nc-expanding-panels nc-tab-nav__xpanels).
- Autoplay: data-autoplay=on laesst den Fortschrittsbalken des aktiven Tabs laufen (CSS); den Tabwechsel macht neo-theme.js.
- Slots badges (.nc-tab-nav__badges) und bento sind gebaut; badges ist leer ausgeblendet und kommt im geernteten Markup nicht vor.
- Slots panel, features und xpanels sind Haken der Website am jeweiligen Element (kein eigenes CSS); gestaltet wird ueber solution-tabs, bento-grid und expanding-panels.

## Variants
### Variant (`variant`)
Tab-Darstellung — die Wurzel ist zugleich nc-solution-tabs und nimmt deren Modifier

| Value | CSS Modifier | Default |
| --- | --- | --- |
| line | — |  |
| contained | `.nc-solution-tabs--contained` |  |

## CSS Token API
Base classes: 

## Accessibility
## Web Components Mapping
Derived from anatomy for potential `<nc-tab-nav>` custom element:

```js
class NcTabNav extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="badges">, <slot name="bento">, <slot name="module">, <slot name="panel-body">, <slot name="panel">
}
```

---

*Generated from `data/tab-nav-recipe.json` by `scripts/generate-component-specs.js`*
