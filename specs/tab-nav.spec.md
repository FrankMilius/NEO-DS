# tab-nav Component Spec
> Version 1.3.0 | Status: stable | Layer: molecule

Tags: `aufgenommen`, `molecules`

## Anatomy
Root element: `.nc-tab-nav`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| panel | `.nc-tab-nav__panel` | Yes | Haken am Panel .nc-solution-tabs__panel (role=tabpanel, aria-labelledby, [hidden] ausser dem aktiven); kein eigenes CSS — einspaltig ueber .nc-tab-nav .nc-solution-tabs__panel.is-active. |
| panel-body | `.nc-tab-nav__panel-body` | Yes | Spalte im Panel (flex column, gap spacing-04, linksbuendig): Titel h3, Text, Inhaltsmodul und CTA. |
| module | `.nc-tab-nav__module` | Yes | Traeger des Inhaltsmoduls (volle Breite); den Inhalt baut das Modul aus window.NeoTabModules (Vorgabe features). |
| bento | `.nc-tab-nav__bento` | No | Haken am Bento-Raster des Moduls bento (.nc-bento-grid, volle Breite). |
| features | `.nc-tab-nav__features` | No | Haken an der Liste des Moduls features (.nc-solution-tabs__features); kein eigenes CSS. |
| xpanels | `.nc-tab-nav__xpanels` | No | Haken an den Expanding Panels des Moduls expanding (.nc-expanding-panels); kein eigenes CSS. |
| badges | `.nc-tab-nav__badges` | No | Badge-Zeile (flex, gap/margin-block per Token, leer ausgeblendet). Nicht im Website-Markup — die Badges rendert der Section-Header (neo_fe:block-header) ueber dem Kicker. |
| section | `.nc-solution-tabs-section` | No | Flaeche um Kopf und Block: section.nc-section.nc-section--full.nc-solution-tabs-section > .nc-container; setzt die Farb-Tokens von Titel, Text und Tabs und padding-block spacing-12. |

### DOM Notes
- Website (block--block-content--neo-tab-nav.html.twig): section.nc-section.nc-section--full.nc-solution-tabs-section.nc-tab-nav-section[style=background-color] > .nc-container > neo_fe:block-header (Badges, Kicker, Headline h2, Lead; Ausrichtung field_tn_align -> nc-section-header--{align}) + div.nc-solution-tabs.nc-tab-nav[data-tab-nav][data-orientation][data-autoplay][style=--nc-solution-tabs-autoplay-duration: <Intervall>s] (leer) + script[type=application/json][data-tab-nav-tabs].
- Felder: field_st_variant line (Vorgabe) | contained -> nc-solution-tabs--contained (Achse variant); field_st_orientation horizontal | vertical -> nc-solution-tabs--vertical (Modifier von solution-tabs, hier keine eigene Achse); field_st_autoplay off | on; field_st_interval Sekunden (Vorgabe 7); field_st_bg Flaeche als Inline-Stil (Vorgabe var(--fnd-color-background-base)); .nc-tab-nav-section ist ein Haken ohne CSS im DS.
- Tableiste und Panels baut neoTabNav aus dem JSON: div.nc-solution-tabs__tablist[role=tablist] (vertikal aria-orientation) > button.nc-solution-tabs__tab[role=tab][aria-selected][aria-controls] (Roving-Tabindex; vertikal mit span.__tab-index „01") + span.__progress[aria-hidden]; je Tab div.nc-solution-tabs__panel.nc-tab-nav__panel[role=tabpanel][aria-labelledby] > .nc-tab-nav__panel-body > h3.__panel-title + p.__panel-text + .nc-tab-nav__module + a.nc-button.nc-button--accent.nc-button--lg. Akzentfarbe je Tab (--nc-solution-tabs-accent) an Wurzel und Panel.
- Inhaltsmodule der Website (window.NeoTabModules, Feld module je Tab, Vorgabe features): features (nc-solution-tabs__features nc-tab-nav__features), feature_list (nc-feature-list__items), bento (nc-bento-grid nc-tab-nav__bento), expanding (nc-expanding-panels nc-tab-nav__xpanels, Behavior expanding-panels), card_grid (nc-card-grid nc-tab-nav__card-grid), hero (nc-hero nc-tab-nav__hero), hero_tom, hero_tmob (nc-tab-nav__hero-tom/-tmob), text_media (nc-section nc-tab-nav__text-media), form (nc-form-block nc-tab-nav__form, Behavior multiselect). Die Arena zeigt die ersten vier; die uebrigen Haken haben kein CSS im DS, gestaltet wird ueber das jeweilige Bauteil.
- Verhalten (neo-theme.js, Drupal.behaviors.neoTabNav — nicht migriert): Klick waehlt; Pfeil rechts/links (vertikal runter/hoch) waehlt den naechsten/vorigen Tab rundum und setzt den Fokus (automatische Aktivierung), Pos1/Ende den ersten/letzten. Keine Ereignisse. Ein Behavior in neo-behaviors gibt es nicht; keyboard/events bleiben leer, bis es migriert wird.
- Autoplay (nur data-autoplay=on und ohne prefers-reduced-motion): ab 30 % Sichtbarkeit wechselt der Tab im Intervall; der Fortschrittsbalken des aktiven Tabs laeuft per CSS. Pause bei Maus ueber dem Block (.is-paused haelt auch den Balken an) und bei Fokus im Block (nur der Wechsel ruht). Einen Pause-Knopf gibt es nicht.
- Die Arena zeigt die Flaeche wie die Website (Section mit Farb-Tokens), ohne den Haken nc-tab-nav-section und die Inline-Flaeche; animierte Bloecke als Standbild (autoplay off), „Abspielen" setzt data-autoplay=on.

## Variants
### Variant (`variant`)
Tab-Darstellung — die Wurzel ist zugleich nc-solution-tabs und nimmt deren Modifier

| Value | CSS Modifier | Default |
| --- | --- | --- |
| line | — |  |
| contained | `.nc-solution-tabs--contained` |  |

## States
Supported: `default`, `active`

## CSS Token API
Base classes: `nc-tab-nav`

### Base
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tab-nav-badges-gap` | — | `--mod-tab-nav-badges-gap` |
| `--nc-tab-nav-badges-margin-block` | — | `--mod-tab-nav-badges-margin-block` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- 4.1.2: Tabs-Muster — tablist/tab/tabpanel, aria-selected, aria-controls und aria-labelledby, Roving-Tabindex; vertikal aria-orientation=vertical (neoTabNav).
- 2.1.1: Pfeiltasten (rundum) und Pos1/Ende in der Tableiste, automatische Aktivierung beim Pfeil; Tab fuehrt aus der Tableiste zum naechsten bedienbaren Element (die inaktiven Panels sind [hidden]).
- 1.3.1: eine Ueberschrift h2 im Section-Header, Panel-Titel h3; Fortschrittsbalken aria-hidden.
- 2.2.2: Autoplay nur auf Wunsch (field_st_autoplay) und nie mit prefers-reduced-motion; es ruht bei Maus und Fokus im Block — ein sichtbarer Pause-/Stopp-Knopf fehlt (Befund, Entscheidungsfall).
- 1.4.3: Kontrast AA hell und dunkel gemessen (Arena-Flaeche) — Tabs ab 12,89:1, Panel-Text text-secondary ab 6,07:1, Bento-Text ab 4,66:1. Eine Instanzflaeche (field_st_bg) und die Akzentfarbe je Tab sind davon nicht gedeckt.

## Web Components Mapping
Derived from anatomy for potential `<nc-tab-nav>` custom element:

```js
class NcTabNav extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="panel">, <slot name="panel-body">, <slot name="module">
}
```

---

*Generated from `data/tab-nav-recipe.json` by `scripts/generate-component-specs.js`*
