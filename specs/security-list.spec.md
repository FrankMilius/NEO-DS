# security-list Component Spec
> Version 1.1.0 | Status: stable | Layer: molecule

Tags: `display`, `content`, `trust`

## Anatomy
Root element: `.nc-security-list`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| item | `.nc-security-list__item` | Yes | — |
| icon | `.nc-security-list__icon` | No | — |
| text | `.nc-security-list__text` | Yes | — |

### DOM Notes
- Liste: ul.nc-security-list ohne Aufzaehlungszeichen, Grid mit gap spacing-03.
- Item: li.nc-security-list__item als Kachel — background-base, Rahmen border-secondary, radius-4xl, Polsterung spacing-04/05; der Text steht direkt im Item.
- Slots icon und text (__icon, __text) sind beschrieben, aber nicht gebaut: styles.css kennt sie nicht (Entscheidung offen).

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-security-list`

### Base
## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-security-list>` custom element:

```js
class NcSecurityList extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="item">, <slot name="text">
}
```

---

*Generated from `data/security-list-recipe.json` by `scripts/generate-component-specs.js`*
