# mobile-drawer Component Spec
> Version 1.3.0 | Status: stable | Layer: organism

Tags: `aufgenommen`, `organisms`

## Anatomy
Root element: `.nc-mobile-drawer`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| backdrop | `.nc-mobile-drawer__backdrop` | Yes | Abdunklung als Geschwister vor dem Drawer (position fixed, always-dark 40 %); offen mit __backdrop--visible. Klick schliesst (reason overlay-click). Das Behavior findet sie als Geschwister (.nc-mobile-drawer__backdrop oder [data-mobile-backdrop]) und laesst sie beim Sperren der Seite frei. |
| header | `.nc-mobile-drawer__header` | Yes | Kopfzeile (flex, space-between, Trennlinie border-secondary) mit Titel und Schliessen-Knopf. |
| title | `.nc-mobile-drawer__title` | No | Sichtbarer Titel (semibold, label-size); kann per aria-labelledby den Namen des Dialogs liefern. |
| close | `.nc-mobile-drawer__close` | Yes | Schliessen-Knopf 36 x 36 px mit aria-label; erstes bedienbares Element — bekommt beim Oeffnen den Fokus. Auch [data-mobile-close] schliesst (reason close-button). |
| nav | `.nc-mobile-drawer__nav` | Yes | <nav> mit aria-label um die Liste (Polster spacing-03). |
| list | `.nc-mobile-drawer__list` | Yes | Erste Ebene (ul ohne Aufzaehlungszeichen). |
| link | `.nc-mobile-drawer__link` | Yes | Eintrag der ersten Ebene (Block-Link, medium, text-primary; Hover background-hover). |
| sublist | `.nc-mobile-drawer__sublist` | No | Zweite Ebene im li unter dem Link, eingerueckt (spacing-05). |
| sublink | `.nc-mobile-drawer__sublink` | No | Eintrag der zweiten Ebene (body-s, text-secondary; Hover text-primary); der aktuelle Eintrag traegt aria-current="page". |

### DOM Notes
- Markup nach den BEM-Klassen des SCSS (kein geerntetes Markup, das Bauteil laeuft auf der Website nicht): div.nc-mobile-drawer__backdrop als Geschwister vor aside.nc-mobile-drawer (id, aria-label); darin __header (__title, __close) und nav.__nav > ul.__list > li > a.__link (+ ul.__sublist > li > a.__sublink).
- Ausloeser ist jeder Knopf mit aria-controls="<id des Drawers>" ausserhalb des Drawers (z. B. ein Burger in der Kopfzeile, Klasse frei); das Behavior haelt aria-expanded an allen solchen Knoepfen.
- Zustand offen: .nc-mobile-drawer--open (translateX(0) statt 100 %, transform 0,3 s) und am Backdrop __backdrop--visible (opacity --nc-mobile-drawer-backdrop-visible-opacity, pointer-events). Beides setzt das Behavior; prefers-reduced-motion verkuerzt die Uebergaenge global (02-generic/_reset.scss).
- Breite min(320px, 85vw), rechts angeschlagen, z-index --fnd-z-drawer (Backdrop eins darunter), eigener Scrollbereich (overflow-y auto).
- Nur unter 1200 px Fensterbreite: darueber blendet das DS Drawer und Backdrop aus (display: none !important) — der Knopf tut dann nichts, ein offener Drawer schliesst beim Wechsel (reason resize). Die Arena zeigt die Lage darunter (Rahmen ra-buehne--mobil-drawer).
- Modal (neo-behaviors mobile-drawer): offen role=dialog + aria-modal, Fokus auf das erste bedienbare Element (Schliessen-Knopf), Fokus-Falle, Geschwister des Drawers und seiner Vorfahren bis <body> ausser dem Backdrop inert, body.u-no-scroll; geschlossen inert + aria-hidden="true" — der aus dem Bild geschobene Drawer waere sonst per Tab erreichbar. Fokus nach dem Schliessen zurueck zum Ausloeser.
- body.u-no-scroll hat im DS keine Regel; die Seitensperre gestaltet das einbindende Theme (neo_fe: css/neo-overrides.css). Ohne sie scrollt die Seite hinter dem Drawer mit.
- Auf neocosmo.de nicht im Einsatz (meta.source): die Mobilnavigation ist .m-drawer aus der Hauptnavigation (Recipe navigation-tab-mega, Behavior navigation-tab-mega). Das Behavior bindet in Drupal nur auf ausdrueckliche Anforderung (drupalSettings.neoBehaviors.nur).

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

### Base
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-mobile-drawer-backdrop-visible-opacity` | — | — |
| `--nc-mobile-drawer-close-background` | — | — |
| `--nc-mobile-drawer-root-box-shadow` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | toggle-drawer | Auf dem geschlossenen Ausloeser (nativer Knopf mit aria-controls="<id des Drawers>"): oeffnet den Drawer, Fokus auf das erste bedienbare Element (Schliessen-Knopf). Waehrend der Drawer offen ist, ist der Knopf inert; ein Klick von aussen (zweiter Ausloeser, Skript) schliesst (reason trigger). |
| `Space` | toggle-drawer | Wie Enter auf dem Ausloeser. |
| `Escape` | close | Offener Drawer (Fokus irgendwo im Dokument): schliesst, gibt den Rest der Seite frei, Fokus zurueck auf den Ausloeser (reason escape). |
| `Tab` | trap-focus | Offener Drawer: Fokus bleibt im Drawer (vom letzten zum ersten Element). |
| `Shift+Tab` | trap-focus-reverse | Offener Drawer: vom ersten zum letzten Element. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `mobile-drawer-open` | Yes | — |
| `mobile-drawer-close` | Yes | `{"reason":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- 2.1.2/2.4.3: modaler Dialog — Fokus beim Oeffnen in den Drawer, Fokus-Falle (Tab/Shift+Tab), Rest der Seite inert, Escape schliesst, Fokus zurueck zum Ausloeser.
- 4.1.2: Ausloeser mit aria-controls und aria-expanded (setzt das Behavior); der Drawer braucht einen Namen im Markup (aria-label oder aria-labelledby auf __title) — das Behavior setzt keinen.
- 2.4.3: geschlossen inert und aria-hidden — die unsichtbaren Links sind nicht per Tab erreichbar und werden nicht vorgelesen.
- 1.3.1: Navigation als <nav> mit aria-label und verschachtelten Listen; der aktuelle Eintrag traegt aria-current="page".
- 2.5.8: Schliessen-Knopf 36 x 36 px; Links als Block mit Polster spacing-03/-04.
- 1.4.3: Kontrast AA hell und dunkel gemessen — Links und Titel text-primary 16,01:1, Unterpunkte text-secondary ab 6,07:1, Schliessen-Symbol ab 6,07:1 (1.4.11).

## Web Components Mapping
Derived from anatomy for potential `<nc-mobile-drawer>` custom element:

```js
class NcMobileDrawer extends HTMLElement {
  static observedAttributes = ['variante'];
  // Slots: <slot name="backdrop">, <slot name="header">, <slot name="close">, <slot name="nav">, <slot name="list">, <slot name="link">
}
```

---

*Generated from `data/mobile-drawer-recipe.json` by `scripts/generate-component-specs.js`*
