# NEO Design System — Komponenten

GENERIERT von `scripts/build-skill-references.js` aus `scss/scss/`.
Nicht von Hand aendern. Quelle: WEBSITE26 @ 56f51295

Aufgefuehrt sind die BEM-Wurzelklassen je Komponente. Modifier (`--variante`)
und Elemente (`__teil`) sind zusammengefasst, damit die Liste lesbar bleibt.


## Objekte (Layout-Traeger)

| Komponente | Wurzelklassen | Modifier |
|---|---|---|
| `aspect-ratio` | `.nc-aspect-ratio` | `--1-1 --1-2 --16-9 --2-1 --2-3 --3-2` |
| `container-intent` | `.nc-container` | `--sm` |
| `content` | `.nc-bleed- .nc-content .nc-prose` | – |
| `grid` | `.nc-grid-` | `--split --with-sidebar` |
| `media-frame` | `.nc-media-frame .nc-surface-muted` | `--flush` |
| `prose` | `.nc-bleed-content .nc-bleed-full .nc-bleed-wide .nc-prose` | `--left` |
| `section` | `.nc-benefit-grid .nc-bleed-full .nc-bleed-target .nc-carousel` | `--align-end --align-start --content-ratio --full --lg --md` |
| `video` | `.nc-video-facade .nc-video-pause` | – |

## Atome

| Komponente | Wurzelklassen | Modifier |
|---|---|---|
| `alert` | `.nc-alert` | `--danger --info --inline --success --warning` |
| `avatar` | `.nc-avatar .nc-avatar-group` | `--hash --interactive --ring --square --xs` |
| `badge-row` | `.nc-badge-row .nc-hero .nc-hero-tmob .nc-hero-tom` | – |
| `badge` | `.nc-badge` | `--soft --success` |
| `button` | `.nc-button .nc-button-group` | `--fab --full --lg --sm --xs` |
| `checkbox` | `.nc-checkbox` | `--error --sm` |
| `chip` | `.nc-chip .nc-chip-group` | `--outline --scroll --selected` |
| `code-snippet` | `.nc-code-snippet` | `--expanded --header-macos --header-plain --header-window --inline --line-highlight` |
| `device` | `.nc-device .nc-device-figure` | `--lg --plain --sm --tilt-left --tilt-right` |
| `divider` | `.nc-divider .nc-divider-label` | `--strong --vertical` |
| `form-hp` | `.nc-form-hp` | – |
| `input` | `.nc-input .nc-input-wrapper` | `--borderless --error --filled --has-label --password --search` |
| `kbd` | `.nc-kbd .nc-kbd-group` | – |
| `label` | `.nc-label .nc-labels-container` | – |
| `nav-atoms` | `.nc-nav .nc-searchbar` | – |
| `progress` | `.nc-progress .nc-progress-labeled` | – |
| `radio` | `.nc-radio` | `--error --sm` |
| `range` | `.nc-range` | `--disabled --error --range --tooltip --vertical` |
| `rating` | `.nc-icon .nc-rating` | `--compact --disabled --error --lg --readonly --sentiment` |
| `segmented-control` | `.nc-segmented-control` | `--full-width --scrollable --sm` |
| `select` | `.nc-select .nc-select-wrapper` | `--borderless --error --filled --multiple --sm --success` |
| `skeleton` | `.nc-skeleton .nc-skeleton-group` | `--circle --rect` |
| `spinner` | `.nc-spinner .nc-spinner-overlay` | – |
| `status` | `.nc-status .nc-status-label` | – |
| `switch` | `.nc-switch` | `--checked --indicators --sm` |
| `table` | `.nc-compare-table` | `--borderless --compact --expressive --ghost --hover --selectable` |
| `tag` | `.nc-tag` | – |
| `tbl-cell` | `.nc-tbl-cell` | `--icon` |
| `tbl-icon` | `.nc-tbl-icon` | `--check --dash` |
| `text-blocks` | `.nc-eyebrow .nc-lead .nc-section-title` | – |
| `textarea` | `.nc-textarea .nc-textarea-wrapper` | `--autosize --borderless --error --filled --no-resize --sm` |
| `toggle-group` | `.nc-toggle-group` | `--divider --equal --outline --sm --soft --underline` |

## Molekuele

| Komponente | Wurzelklassen | Modifier |
|---|---|---|
| `accordion` | `.nc-accordion .nc-accordion-toggle-all .nc-chapter-nav` | `--compact --elevated --flush --ghost --lese --media-side` |
| `app-store` | `.nc-app-store` | `--center --on-dark` |
| `breadcrumb-section` | `.nc-breadcrumb-section` | `--above --below` |
| `breadcrumb` | `.nc-breadcrumb .nc-nav` | `--back-link --ghost --sm` |
| `byline` | `.nc-byline` | – |
| `card-cta` | `.nc-card-cta .nc-card-grid-cta` | – |
| `card-grid-cq` | `.nc-card-grid-cq` | – |
| `card-grid-cta` | `.nc-card-grid-cta` | – |
| `card-grid` | `.nc-card .nc-card-grid` | `--cols-2 --cols-3 --cols-4 --cols-5 --cols-6` |
| `card` | `.nc-bento-grid .nc-card .nc-card-grid .nc-label` | `--action --display --expandable --featured --navigational --preview` |
| `carousel` | `.nc-carousel .nc-range .nc-slider` | `--media` |
| `checkbox-group` | `.nc-checkbox .nc-checkbox-group .nc-form-error` | `--disabled --error --horizontal` |
| `dropdown-menu` | `.nc-dropdown` | `--checkable` |
| `empty-state` | `.nc-button .nc-empty-state` | – |
| `facts` | `.nc-facts-block .nc-facts-desc .nc-facts-list .nc-facts-term` | – |
| `faq` | `.nc-faq` | – |
| `file-upload` | `.nc-button .nc-file-upload .nc-file-upload-list` | `--compact --disabled --dragging --error` |
| `form-error` | `.nc-form-error` | `--success --warning` |
| `form-field` | `.nc-checkbox .nc-form-error .nc-form-field .nc-form-hint` | `--disabled --error --horizontal --invalid --required --success` |
| `form-hint` | `.nc-form-hint` | `--muted` |
| `form-label` | `.nc-form-label` | `--disabled --emphasis --inline --sm` |
| `input-group` | `.nc-button .nc-icon .nc-input .nc-input-group` | `--disabled --error --readonly --sm --success` |
| `item` | `.nc-avatar .nc-item .nc-item-group .nc-item-separator` | `--align-start --compact --interactive --loose --muted --outline` |
| `logo-wall` | `.nc-logo-bar .nc-logo-pill .nc-logo-wall .nc-section-header` | `--bar --boxed --cluster --fadein --info --lg` |
| `marquee` | `.nc-logo-wall .nc-marquee` | – |
| `metric` | `.nc-container .nc-metric .nc-metric-grid` | `--md --subtle --trend-down --trend-neutral --trend-up --xl` |
| `multiselect` | `.nc-input .nc-multiselect` | – |
| `nav-molecules` | `.nc-header .nc-icon .nc-lang-toggle .nc-mobile-item` | – |
| `otp-input` | `.nc-otp-input` | `--disabled --error --lg --sm --success` |
| `pagination` | `.nc-nav .nc-pagination` | `--center --minimal --outline --pill --raised --sm` |
| `popover` | `.nc-popover` | `--hover-trigger` |
| `pricing` | `.nc-feature-list .nc-price .nc-pricing-card .nc-pricing-features` | – |
| `radio-group` | `.nc-form-error .nc-radio .nc-radio-group` | `--disabled --error --horizontal --segmented --sm` |
| `search` | `.nc-input .nc-search` | – |
| `searchbar` | `.nc-searchbar` | – |
| `section-header` | `.nc-badge-row .nc-label .nc-section-header` | `--center --flush --right` |
| `security-list` | `.nc-security-list` | – |
| `share-bar` | `.nc-button .nc-share-bar` | `--ghost --icon-only --sm` |
| `shot` | `.nc-shot` | `--ratio --shadow` |
| `stepper` | `.nc-icon .nc-stepper` | `--disabled --error --lg --sm` |
| `tab-nav` | `.nc-button .nc-feature-list .nc-solution-tabs .nc-tab-nav` | – |
| `table-block` | `.nc-compare-table .nc-table-block .nc-tbl-cell` | `--dash --full-width --sticky-col --striped` |
| `tabs` | `.nc-tabs .nc-tooltip` | `--contained --full-width --lg --line --scrollable --sm` |
| `testimonial-grid` | `.nc-container .nc-section .nc-testimonial .nc-testimonial-grid` | `--carousel --cols-2 --cols-3` |
| `testimonial` | `.nc-testimonial` | – |
| `timeline` | `.nc-button .nc-timeline` | `--alternating --horizontal --node-dark --node-dot --progress --rail` |
| `toast` | `.nc-toast .nc-toaster` | `--bottom-center --bottom-left --bottom-right --default --error --info` |
| `tooltip` | `.nc-tooltip` | `--bottom --left --right --top` |
| `treeview` | `.nc-treeview` | `--bordered --checkboxes --compact --draggable --flush --lines-dashed` |

## Organismen

| Komponente | Wurzelklassen | Modifier |
|---|---|---|
| `accordion-block` | `.nc-accordion-block .nc-container` | `--halb --voll --zwei-drittel` |
| `alert-dialog` | `.nc-alert-dialog` | `--destructive --primary` |
| `banner` | `.nc-banner` | `--accent --danger --fixed --info --sticky --success` |
| `bento-grid` | `.nc-bento-grid` | `--cols-3` |
| `bento-section` | `.nc-bento-section` | – |
| `block-bundle` | `.nc-block-bundle` | – |
| `chapter-nav` | `.nc-chapter-anchor .nc-chapter-nav .nc-chapter-toc .nc-container` | `--chaptertoc` |
| `compare-table` | `.nc-compare-table` | `--full-width --sticky-col --striped` |
| `content-feed` | `.nc-button .nc-card .nc-card-grid .nc-chip` | `--cols- --cols-2 --featured --preview --selected` |
| `cta` | `.nc-cta .nc-demo-cta .nc-lead .nc-newsletter-cta` | – |
| `data-table` | `.nc-avatar .nc-data-table` | `--glass --striped` |
| `drawer` | `.nc-drawer` | `--left --right --top` |
| `event` | `.nc-event` | `--outline` |
| `events` | `.nc-events` | – |
| `expanding-panels` | `.nc-expanding-panels` | – |
| `fade-gallery` | `.nc-device-figure .nc-fade-gallery .nc-gallery` | – |
| `feature-accordion` | `.nc-feature-accordeon` | – |
| `feature-list` | `.nc-device .nc-feature-list .nc-media-frame .nc-section` | `--check --media-left --media-right --valign-bottom --valign-middle --valign-top` |
| `fieldset` | `.nc-checkbox-group .nc-fieldset .nc-form-field .nc-radio-group` | `--borderless --card --compact --disabled --legend-center --loose` |
| `footer` | `.nc-footer` | `--2-col --3-col --4-col` |
| `form-actions` | `.nc-button .nc-form-actions` | `--bordered --center --end --spread --stacked --start` |
| `form-block` | `.nc-checkbox .nc-form-block .nc-input .nc-select` | `--text-bottom --text-left --text-right --text-top` |
| `form-section` | `.nc-form-divider .nc-form-field .nc-form-section` | `--bordered --compact` |
| `form` | `.nc-button .nc-fieldset .nc-form .nc-form-field` | `--borderless --disabled --full-width --inline --two-column` |
| `gallery` | `.nc-gallery .nc-icon` | `--aspect --center --end --fade --fixed --lines` |
| `hero-tmob` | `.nc-hero-tmob .nc-parallax-bg` | `--light` |
| `hero-tom` | `.nc-hero-tmob .nc-hero-tom` | `--cw-content --cw-full --cw-narrow --cw-prose --cw-wide --cw-xwide` |
| `hero` | `.nc-badge-row .nc-feature-list .nc-hero .nc-label` | `--center --cw- --cw-prose --ghost --mark-tint --media-start` |
| `mobile-drawer` | `.nc-mobile-drawer` | `--open` |
| `modal` | `.nc-alert-dialog .nc-icon .nc-modal` | `--danger --full --lg --primary --scrollable --sheet` |
| `navigation-menu` | `.nc-header .nc-navigation-menu` | `--mobile` |
| `navigation-tab-mega` | `.nc-container .nc-nav` | `--accent` |
| `navigation` | `.nc-brand .nc-header .nc-mega .nc-mobile-panel` | `--align-center --align-right --mobile` |
| `news` | `.nc-news` | – |
| `notification` | `.nc-notification` | `--feature --permanent --priority-high --promo --system --unread` |
| `product-showcase` | `.nc-accordion .nc-device .nc-product-showcase` | `--accordion --device --fade --media-end --no-anim --right` |
| `question` | `.nc-button` | – |
| `reference-page` | `.nc-container .nc-doc-section .nc-refpage` | – |
| `shell` | `.nc-mobile-drawer .nc-shell` | `--xs` |
| `sidebar` | `.nc-sidebar .nc-sidebar-backdrop` | `--collapsed --open --overlay` |
| `solution-tabs` | `.nc-button .nc-section-header .nc-solution-tabs .nc-solution-tabs-section` | `--accent --contained --vertical` |
| `story-gallery` | `.nc-badge-row .nc-section-header .nc-story-gallery` | `--loop` |
| `table-info-modal` | `.nc-table-info-modal` | – |
| `text-cta` | `.nc-button .nc-card .nc-feature-list .nc-prose` | `--card-left --no-card` |
| `text-media` | `.nc-device .nc-media-frame .nc-section-header .nc-text-media` | `--dark-bg --media-right --no-media --text-center --text-right` |
| `toolbar` | `.nc-button .nc-toolbar` | – |
| `validation-summary` | `.nc-validation-summary` | `--hidden` |
| `video-section` | `.nc-video` | – |

---

137 Komponenten erfasst.
