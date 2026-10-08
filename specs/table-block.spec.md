# table-block Component Spec
> Version 1.2.0 | Status: stable | Layer: molecule

Tags: `aufgenommen`, `molecules`

## Anatomy
Root element: `.nc-table-block`

### DOM Notes
- Website (block--block-content--neo-table.html.twig): section.nc-section[style=background-color aus field_tbl_bg_color] > .nc-container > neo_fe:block-header (nc-section-header--center; Badges, Kicker, Headline, Lead) + div.nc-table-block[data-neo-table][data-width][data-scroll-bp][data-sticky-col][data-info-modal][style=--tbl-header-bg/--tbl-stripe-bg] > div.nc-compare-table… > <table></table> + script[data-table-json] + der Info-Dialog (Recipe table-info-modal).
- Felder: field_tbl_variant striped (Vorgabe) | compact | borderless -> nc-compare-table--{variant}; immer --sticky-header; field_tbl_width full (Vorgabe) -> --full-width (data-width hat kein CSS); field_tbl_sticky_col first (Vorgabe) -> --sticky-col; field_tbl_scroll_bp (Vorgabe 768) -> data-scroll-bp; field_tbl_header_bg/-stripe_bg -> --tbl-header-bg/--tbl-stripe-bg inline (Rohwerte, auf der Website z. B. #1a1a1a und #f5f5f5).
- Tabelle aus dem JSON (neoTable): thead > tr > th[scope=col] je Spalte; tbody > tr je Zeile, erste Zelle th[scope=row], sonst td, Inhalt je Zelle .nc-tbl-cell (Recipe tbl-cell). Rubriken sind normale Zeilen (Text im Zeilenkopf, leere Wertzellen).
- Kopfzeile: thead th in Versalien (fs-xs, bold, letter-spacing --nc-table-block-thead-th-letter-spacing), mittig, die erste links; Flaeche var(--tbl-header-bg, background-tertiary), Textfarbe text-inverse aus compare-table (thead). Mit --sticky-col setzt compare-table der ersten Kopfzelle background-base — siehe a11y.
- Scrollen: der Block scrollt immer waagerecht (overflow-x auto). Unter data-scroll-bp setzt neoTable data-scroll-active=true (Tabelle max-content statt fester Breite; bei jedem resize neu), beim Scrollen ab 5 px .is-scrolled (Schatten der festen ersten Spalte, --nc-table-block-is-scrolled-…-after-opacity). Polster spacing-06, unter 768 px spacing-03; Hoechstbreite --nc-container-max-width.
- Kein Behavior in neo-behaviors fuer den Block selbst (Aufbau und Scroll-Zustaende in neoTable); der Info-Dialog nutzt table-info-modal.

## Variants
### Variant (`variant`)
Einzige Variante (die Tabellenvariante kommt als Modifier von compare-table)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`, `scrolled`

## CSS Token API
Base classes: `nc-table-block`

### Base
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-table-block-is-scrolled-nc-compare-table-sticky-col-th-first-child-after-opacity` | — | `--mod-table-block-is-scrolled-nc-compare-table-sticky-col-th-first-child-after-opacity` |
| `--nc-table-block-thead-th-letter-spacing` | — | `--mod-table-block-thead-th-letter-spacing` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- 1.3.1: echte Tabelle — Spaltenkoepfe th[scope=col], Zeilenkoepfe th[scope=row]; Rubriken sind normale Zeilen (keine eigene Auszeichnung).
- 1.4.3: Kopfzeile text-inverse auf --tbl-header-bg — auf der Website #1a1a1a (hell 16,74:1). Ohne Feldwert faellt die Flaeche auf background-tertiary zurueck: 1,43:1 (Entscheidungsfall). Die erste Kopfzelle bekam mit --sticky-col background-base: 1,07:1 (Befund, Korrektur in eigenem Commit).
- 1.4.3: die Farbfelder (--tbl-header-bg, --tbl-stripe-bg) sind Rohwerte und drehen im Dunkelmodus nicht mit — Kopftext und Streifenzeilen werden dort unlesbar (Befund fuer neo_fe: Felder auf Theme-Tokens umstellen).
- 2.1.1: der waagerecht scrollende Block ist ohne tabindex nur ueber die Info-Knoepfe per Tastatur erreichbar — empfohlen role=region, aria-label und tabindex=0 am .nc-table-block (Befund fuer neo_fe).
- 1.4.10: unter der Scroll-Grenze scrollt die Tabelle im Block, die Seite nicht; die erste Spalte bleibt stehen.
- 1.4.3: Zellen gemessen (Arena) — Zeilenkoepfe text-primary ab 12,79:1, Strich ab 4,59:1; Info-Symbol siehe tbl-cell.

## Web Components Mapping
Derived from anatomy for potential `<nc-table-block>` custom element:

```js
class NcTableBlock extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: default
}
```

---

*Generated from `data/table-block-recipe.json` by `scripts/generate-component-specs.js`*
