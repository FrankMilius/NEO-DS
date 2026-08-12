# NEO Design System — Komponenten

GENERIERT von `scripts/build-skill-references.js` aus `scss/scss/`.
Nicht von Hand aendern. Quelle: WEBSITE26 @ ae406e4

Aufgefuehrt sind die BEM-Wurzelklassen je Komponente. Modifier (`--variante`)
und Elemente (`__teil`) sind zusammengefasst, damit die Liste lesbar bleibt.


## Objekte (Layout-Traeger)

| Komponente | Wurzelklassen | Modifier |
|---|---|---|
| `aspect-ratio` | `.nc-aspect-ratio` | `--1-1 --1-2 --16-9 --2-1 --2-3 --3-2` |
| `container-intent` | `.nc-container` | `--sm` |
| `media-frame` | `.nc-media-frame .nc-surface-muted` | `--flush` |
| `prose` | `.nc-bleed-content .nc-bleed-full .nc-bleed-wide .nc-prose` | `--left` |
| `section` | `.nc-benefit-grid .nc-bleed-full .nc-bleed-target .nc-container` | `--content-ratio --full --lg --md --narrow --sm` |

## Atome

| Komponente | Wurzelklassen | Modifier |
|---|---|---|
| `alert` | `.nc-alert` | `--danger --info --inline --success --warning` |
| `avatar` | `.nc-avatar .nc-avatar-group` | `--hash --interactive --ring --square --xs` |
| `badge-row` | `.nc-badge-row .nc-hero .nc-hero-tmob .nc-hero-tom` | – |
| `badge` | `.nc-badge` | `--soft --success` |
| `button` | `.nc-button .nc-button-group` | `--lg --sm --xs` |
| `card` | `.nc-card` | – |
| `checkbox` | `.nc-checkbox` | `--error --sm` |
| `chip` | `.nc-chip .nc-chip-group` | `--outline --scroll --selected` |
| `code-snippet` | `.nc-code-snippet` | `--expanded --header-macos --header-plain --header-window --inline --line-highlight` |
| `divider` | `.nc-divider .nc-divider-label` | `--vertical` |
| `input` | `.nc-input .nc-input-wrapper` | `--borderless --error --filled --has-label --password --search` |
| `kbd` | `.nc-kbd .nc-kbd-group` | – |
| `label` | `.nc-label .nc-labels-container` | – |
| `nav-atoms` | `.nc-nav` | – |
| `progress` | `.nc-progress .nc-progress-labeled` | – |
| `radio` | `.nc-radio` | `--error --sm` |
| `rating` | `.nc-icon .nc-rating` | `--compact --disabled --error --lg --readonly --sentiment` |
| `segmented-control` | `.nc-segmented-control` | `--full-width --scrollable --sm` |
| `select` | `.nc-select .nc-select-wrapper` | `--borderless --error --filled --multiple --sm --success` |
| `skeleton` | `.nc-skeleton .nc-skeleton-group` | `--circle --rect` |
| `slider` | `.nc-slider` | `--disabled --error --range --tooltip --vertical` |
| `spinner` | `.nc-spinner .nc-spinner-overlay` | – |
| `status` | `.nc-status .nc-status-label` | – |
| `switch` | `.nc-switch` | `--checked --indicators --sm` |
| `table` | `.nc-compare-table` | `--borderless --compact --expressive --ghost --hover --selectable` |
| `tag` | `.nc-tag` | – |
| `text-blocks` | `.nc-eyebrow .nc-lead .nc-section-title` | – |
| `textarea` | `.nc-textarea .nc-textarea-wrapper` | `--autosize --borderless --error --filled --no-resize --sm` |
| `toggle-group` | `.nc-toggle-group` | `--divider --equal --outline --sm --soft --underline` |

## Molekuele

| Komponente | Wurzelklassen | Modifier |
|---|---|---|
| `accordion` | `.nc-accordion` | `--compact --elevated --flush --ghost --media-side --media-top` |
| `breadcrumb` | `.nc-breadcrumb` | `--back-link --ghost --sm` |
| `card` | `.nc-bento-grid .nc-card .nc-card-grid .nc-label` | `--action --expandable --featured --navigational --preview --selectable` |
| `checkbox-group` | `.nc-checkbox .nc-checkbox-group .nc-form-error` | `--disabled --error --horizontal` |
| `dropdown-menu` | `.nc-dropdown` | `--checkable` |
| `empty-state` | `.nc-button .nc-empty-state` | – |
| `facts` | `.nc-facts-block .nc-facts-desc .nc-facts-list .nc-facts-term` | – |
| `faq` | `.nc-faq` | – |
| `file-upload` | `.nc-button .nc-file-upload .nc-file-upload-list` | `--compact --disabled --dragging --error` |
| `form-error` | `.nc-form-error` | – |
| `form-field` | `.nc-checkbox .nc-form-error .nc-form-field .nc-form-hint` | `--disabled --error --horizontal --required --success` |
| `form-hint` | `.nc-form-hint` | `--muted` |
| `form-label` | `.nc-form-label` | `--disabled --emphasis --inline --sm` |
| `input-group` | `.nc-button .nc-icon .nc-input .nc-input-group` | `--disabled --error --readonly --sm --success` |
| `item` | `.nc-avatar .nc-item .nc-item-group .nc-item-separator` | `--align-start --compact --interactive --loose --muted --outline` |
| `logo-wall` | `.nc-logo-pill .nc-logo-wall` | `--boxed --cluster --fadein --lg --marquee --mono` |
| `marquee` | `.nc-marquee` | – |
| `metric` | `.nc-container .nc-metric .nc-metric-grid` | `--md --subtle --trend-down --trend-neutral --trend-up --xl` |
| `nav-molecules` | `.nc-header .nc-icon .nc-lang-toggle .nc-mobile-item` | – |
| `otp-input` | `.nc-otp-input` | `--disabled --error --lg --sm --success` |
| `pagination` | `.nc-pagination` | `--center --minimal --outline --pill --raised --sm` |
| `popover` | `.nc-popover` | – |
| `pricing` | `.nc-feature-list .nc-price .nc-pricing-card` | – |
| `radio-group` | `.nc-form-error .nc-radio .nc-radio-group` | `--disabled --error --horizontal --segmented --sm` |
| `search` | `.nc-search` | – |
| `section-header` | `.nc-badge-row .nc-label .nc-section-header` | `--center --flush --right` |
| `security-list` | `.nc-security-list` | – |
| `slider` | `.nc-slider` | `--media` |
| `stepper` | `.nc-icon .nc-stepper` | `--disabled --error --lg --sm` |
| `tabs` | `.nc-tabs .nc-tooltip` | `--contained --full-width --lg --line --scrollable --sm` |
| `testimonial` | `.nc-testimonial` | – |
| `timeline` | `.nc-button .nc-timeline` | `--alternating --horizontal --progress` |
| `toast` | `.nc-toast .nc-toaster` | `--bottom-center --bottom-left --bottom-right --default --error --info` |
| `tooltip` | `.nc-tooltip` | `--bottom --left --right --top` |
| `treeview` | `.nc-treeview` | `--bordered --checkboxes --compact --draggable --flush --lines-dashed` |

## Organismen

| Komponente | Wurzelklassen | Modifier |
|---|---|---|
| `alert-dialog` | `.nc-alert-dialog` | `--destructive --primary` |
| `banner` | `.nc-banner` | `--accent --danger --fixed --info --sticky --success` |
| `bento-grid` | `.nc-bento-grid` | `--cols-3` |
| `cta` | `.nc-cta .nc-demo-cta .nc-lead .nc-newsletter-cta` | – |
| `data-table` | `.nc-avatar .nc-data-table` | `--glass --striped` |
| `drawer` | `.nc-drawer` | `--left --right --top` |
| `expanding-panels` | `.nc-expanding-panels` | – |
| `feature-accordion` | `.nc-feature-accordeon` | – |
| `fieldset` | `.nc-checkbox-group .nc-fieldset .nc-form-field .nc-radio-group` | `--borderless --card --compact --disabled --legend-center --loose` |
| `footer` | `.nc-footer` | – |
| `form-actions` | `.nc-button .nc-form-actions` | `--bordered --center --end --spread --stacked --start` |
| `form-block` | `.nc-form-block` | `--text-bottom --text-left --text-right --text-top` |
| `form-section` | `.nc-form-divider .nc-form-field .nc-form-section` | `--bordered --compact` |
| `form` | `.nc-button .nc-fieldset .nc-form .nc-form-field` | `--disabled --full-width --inline --two-column` |
| `gallery` | `.nc-gallery .nc-icon` | `--aspect --center --end --fade --fixed --lines` |
| `hero` | `.nc-badge-row .nc-hero .nc-label` | `--cw- --cw-prose --ghost` |
| `modal` | `.nc-alert-dialog .nc-icon .nc-modal` | `--danger --full --lg --primary --scrollable --sm` |
| `navigation-menu` | `.nc-header .nc-navigation-menu` | – |
| `navigation` | `.nc-brand .nc-header .nc-mega .nc-mobile-panel` | `--align-center --align-right` |
| `notification` | `.nc-notification` | `--feature --permanent --priority-high --promo --system --unread` |
| `product-showcase` | `.nc-product-showcase` | `--fade --no-anim --right --stacked` |
| `reference-page` | `.nc-container .nc-doc-section .nc-refpage` | – |
| `sidebar` | `.nc-sidebar .nc-sidebar-backdrop` | – |
| `solution-tabs` | `.nc-button .nc-section-header .nc-solution-tabs .nc-solution-tabs-section` | `--accent --contained --vertical` |
| `text-cta` | `.nc-button .nc-card .nc-feature-list .nc-text-cta` | `--card-left` |
| `text-media` | `.nc-section-header .nc-text-media .nc-video` | `--media-right --no-media --text-center --text-right` |
| `toolbar` | `.nc-button .nc-toolbar` | – |
| `validation-summary` | `.nc-validation-summary` | `--hidden` |
| `video-section` | `.nc-video` | – |

---

98 Komponenten erfasst.
