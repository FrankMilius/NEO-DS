(function () {
  'use strict';

  // ===== Tab Navigation =====
  var tabList = document.querySelector('.docs-tabs__list');
  var triggers = tabList ? tabList.querySelectorAll('.docs-tabs__trigger') : [];
  var panels = document.querySelectorAll('.docs-tabs__panel');

  function activateTab(trigger) {
    triggers.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
    panels.forEach(function (p) { p.classList.remove('is-active'); });
    trigger.setAttribute('aria-selected', 'true');
    var panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (panel) panel.classList.add('is-active');
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () { activateTab(trigger); });
    trigger.addEventListener('keydown', function (e) {
      var idx = Array.prototype.indexOf.call(triggers, trigger);
      var next = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % triggers.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + triggers.length) % triggers.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = triggers.length - 1;
      if (next >= 0) { e.preventDefault(); triggers[next].focus(); activateTab(triggers[next]); }
    });
  });

  // ===== Staging Area =====
  var themeSelect = document.getElementById('stage-theme');
  var variantSelect = document.getElementById('stage-variant');
  var mediaChk = document.getElementById('stage-media');
  var disabledChk = document.getElementById('stage-disabled');
  var preview = document.getElementById('stage-preview');
  var codeOutput = document.getElementById('stage-code');

  if (!preview) return;

  // ===== Recipes laden =====
  var recipes = null;
  var recipesMap = {};

  fetch('/data/card-recipes.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      recipes = data;
      data.recipes.forEach(function (r) { recipesMap[r.id] = r; });
      buildChips();
      updateStage();
    })
    .catch(function () {
      // Fallback: Staging funktioniert ohne Recipes weiter
      updateStage();
    });

  // ===== Chips aus Recipes generieren =====
  var chipGroup = document.querySelector('[data-stage-target="stage-variant"]');

  function buildChips() {
    if (!chipGroup || !recipes) return;
    // Bestehende Chips entfernen
    chipGroup.innerHTML = '';
    recipes.recipes.forEach(function (r, i) {
      var btn = document.createElement('button');
      btn.className = 'nc-chip nc-chip--sm' + (i === 0 ? ' nc-chip--selected' : '');
      btn.type = 'button';
      btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      btn.setAttribute('data-value', r.id);
      btn.textContent = r.label;
      chipGroup.appendChild(btn);
    });
    // Hidden select aktualisieren
    if (variantSelect) {
      variantSelect.innerHTML = '';
      recipes.recipes.forEach(function (r, i) {
        var opt = document.createElement('option');
        opt.value = r.id;
        opt.textContent = r.label;
        if (i === 0) opt.selected = true;
        variantSelect.appendChild(opt);
      });
    }
    // Chip-Click-Events neu binden (über docs-stage.js data-stage-control="chips" pattern)
    // Die docs-stage.js hört via event-delegation, also reicht das Einfügen der Elemente.
  }

  // ===== Staging Helpers =====
  var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];

  var chevronSvg = '<svg class="nc-card__expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

  var placeholderMedia = '<div class="nc-card__media" style="height: 160px; background: var(--fnd-color-background-secondary); display: flex; align-items: center; justify-content: center;">'
    + '<svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>'
    + '</div>';

  var placeholderAvatar = '<div class="nc-card__media" style="background: var(--fnd-color-background-secondary); display: flex; align-items: center; justify-content: center;">'
    + '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/><path d="M2 21a10 10 0 0 1 20 0"/></svg>'
    + '</div>';

  // ===== Staging Preview Renderer =====
  // Generiert interaktive Preview-HTML (mit Placeholder-Grafiken, Disabled-States, Multi-Card-Wrapper)
  function buildPreview(variant, withMedia, isDisabled) {
    var d = isDisabled;
    var da = d ? ' aria-disabled="true"' : '';
    var dc = d ? ' nc-card--disabled' : '';
    var m = withMedia ? placeholderMedia : '';

    switch (variant) {
      case 'informational':
        return '<article class="nc-card' + dc + '"' + da + '>' + m
          + '<div class="nc-card__content">'
          + '<h3 class="nc-card__title">Projektstatus</h3>'
          + '<p class="nc-card__description">Aktuelle Informationen zum Sprint</p>'
          + '</div></article>';

      case 'nav-entire':
        return '<a href="#" class="nc-card nc-card--navigational' + dc + '"' + da + ' onclick="event.preventDefault();">' + m
          + '<div class="nc-card__content">'
          + '<h3 class="nc-card__title">Link-Titel</h3>'
          + '<p class="nc-card__description">Gesamte Fl\u00e4che ist klickbar</p>'
          + '</div></a>';

      case 'nav-partial':
        return '<article class="nc-card' + dc + '"' + da + '>' + m
          + '<div class="nc-card__content">'
          + '<h3 class="nc-card__title"><a href="#" class="nc-card__title-link" onclick="event.preventDefault();">Partieller Link</a></h3>'
          + '<p class="nc-card__description">Nur der Titel ist verlinkt</p>'
          + '</div></article>';

      case 'action':
        return '<article class="nc-card nc-card--action' + dc + '"' + da + '>' + m
          + '<div class="nc-card__content">'
          + '<h3 class="nc-card__title">Benutzer einladen</h3>'
          + '<p class="nc-card__description">Sende eine Einladung per E-Mail.</p>'
          + '</div>'
          + '<div class="nc-card__footer">'
          + '<button class="nc-button nc-button--outline nc-button--sm nc-card__footer-action">Abbrechen</button>'
          + '<button class="nc-button nc-button--sm nc-card__footer-action">Einladen</button>'
          + '</div></article>';

      case 'selectable-radio':
        var chk = d ? ' disabled' : '';
        return '<div style="display:flex;gap:16px;flex-wrap:wrap;">'
          + '<label class="nc-card nc-card--selectable" style="flex:1;min-width:140px;">'
          + '<input class="nc-card__input" type="radio" name="stage-plan" value="basic" checked' + chk + '/>'
          + '<div class="nc-card__content"><span class="nc-card__title">Basic</span><span class="nc-card__description">5 GB</span></div></label>'
          + '<label class="nc-card nc-card--selectable" style="flex:1;min-width:140px;">'
          + '<input class="nc-card__input" type="radio" name="stage-plan" value="pro"' + chk + '/>'
          + '<div class="nc-card__content"><span class="nc-card__title">Pro</span><span class="nc-card__description">50 GB</span></div></label>'
          + '</div>';

      case 'selectable-checkbox':
        var chk2 = d ? ' disabled' : '';
        return '<div style="display:flex;gap:16px;flex-wrap:wrap;">'
          + '<label class="nc-card nc-card--selectable" style="flex:1;min-width:140px;">'
          + '<input class="nc-card__input" type="checkbox" name="stage-feat" value="analytics" checked' + chk2 + '/>'
          + '<div class="nc-card__content"><span class="nc-card__title">Analytics</span><span class="nc-card__description">Auswertungen</span></div></label>'
          + '<label class="nc-card nc-card--selectable" style="flex:1;min-width:140px;">'
          + '<input class="nc-card__input" type="checkbox" name="stage-feat" value="export"' + chk2 + '/>'
          + '<div class="nc-card__content"><span class="nc-card__title">Export</span><span class="nc-card__description">CSV &amp; PDF</span></div></label>'
          + '</div>';

      case 'expandable':
        return '<details class="nc-card nc-card--expandable" style="max-width:100%;">'
          + '<summary class="nc-card__summary">'
          + '<span class="nc-card__title" style="font-size:var(--fnd-typography-body-m-font-size);">Welche Zahlungsmethoden werden akzeptiert?</span>'
          + chevronSvg + '</summary>'
          + '<div class="nc-card__details-content"><p style="margin:0;">Visa, Mastercard, PayPal und Bank\u00fcberweisung.</p></div>'
          + '</details>';

      case 'status':
        return '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;">'
          + '<article class="nc-card nc-card--status nc-card--status-success"><div class="nc-card__content"><h3 class="nc-card__title">Erfolgreich</h3><p class="nc-card__description">Alle Tests bestanden</p></div></article>'
          + '<article class="nc-card nc-card--status nc-card--status-warning"><div class="nc-card__content"><h3 class="nc-card__title">Warnung</h3><p class="nc-card__description">Speicher fast voll</p></div></article>'
          + '<article class="nc-card nc-card--status nc-card--status-danger"><div class="nc-card__content"><h3 class="nc-card__title">Fehler</h3><p class="nc-card__description">Build fehlgeschlagen</p></div></article>'
          + '<article class="nc-card nc-card--status nc-card--status-info"><div class="nc-card__content"><h3 class="nc-card__title">Info</h3><p class="nc-card__description">Wartungsfenster geplant</p></div></article>'
          + '</div>';

      case 'event-preview':
        return '<a href="#" class="nc-card nc-card--preview nc-card--navigational' + dc + '"' + da + ' onclick="event.preventDefault();">'
          + placeholderMedia
          + '<div class="nc-card__content">'
          + '<span class="nc-card__kicker">Webinar</span>'
          + '<h3 class="nc-card__title">Cloud Migration Best Practices</h3>'
          + '<p class="nc-card__description">Erfahren Sie, wie Sie Ihre Infrastruktur sicher in die Cloud migrieren.</p>'
          + '<span class="nc-card__meta">15. M\u00e4rz 2026 \u00b7 14:00 Uhr</span>'
          + '</div></a>';

      case 'story-featured':
        return '<a href="#" class="nc-card nc-card--preview nc-card--featured nc-card--navigational' + dc + '"' + da + ' onclick="event.preventDefault();" style="max-width:100%;">'
          + '<div class="nc-card__media" style="background:var(--fnd-color-background-secondary);display:flex;align-items:center;justify-content:center;min-height:200px;">'
          + '<svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></div>'
          + '<div class="nc-card__content">'
          + '<span class="nc-card__kicker">Customer Success</span>'
          + '<h3 class="nc-card__title">Festo modernisiert WeNet und PeopleNet</h3>'
          + '<p class="nc-card__description">Mit PIIPE Workplace setzt Festo neue Ma\u00dfst\u00e4be f\u00fcr die interne Kommunikation und vernetzt Tausende Mitarbeitende weltweit.</p>'
          + '</div></a>';

      case 'team-member':
        return '<div class="nc-card-grid nc-card-grid--compact" style="max-width:400px;">'
          + '<article class="nc-card nc-card--summary">' + placeholderAvatar
          + '<div class="nc-card__content"><h3 class="nc-card__title">Anna M\u00fcller</h3><p class="nc-card__description">Lead Developer</p></div></article>'
          + '<article class="nc-card nc-card--summary">' + placeholderAvatar
          + '<div class="nc-card__content"><h3 class="nc-card__title">Tom Schmidt</h3><p class="nc-card__description">UX Designer</p></div></article>'
          + '</div>';

      case 'city-location':
        return '<div class="nc-card-grid nc-card-grid--compact" style="max-width:500px;">'
          + '<a href="#" class="nc-card nc-card--summary nc-card--navigational" onclick="event.preventDefault();">' + placeholderAvatar
          + '<div class="nc-card__content"><h3 class="nc-card__title">Berlin</h3><p class="nc-card__description">42 Mitarbeitende</p></div></a>'
          + '<a href="#" class="nc-card nc-card--summary nc-card--navigational" onclick="event.preventDefault();">' + placeholderAvatar
          + '<div class="nc-card__content"><h3 class="nc-card__title">M\u00fcnchen</h3><p class="nc-card__description">28 Mitarbeitende</p></div></a>'
          + '</div>';

      case 'quick-link':
        return '<div class="nc-card-grid nc-card-grid--links" style="max-width:500px;">'
          + '<a href="#" class="nc-card nc-card--action nc-card--navigational" onclick="event.preventDefault();"><div class="nc-card__content">'
          + '<svg class="nc-card__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M2 12h20"/></svg>'
          + '<h3 class="nc-card__title">Feature</h3><p class="nc-card__description">Kurze Beschreibung</p></div></a>'
          + '<a href="#" class="nc-card nc-card--action nc-card--navigational" onclick="event.preventDefault();"><div class="nc-card__content">'
          + '<svg class="nc-card__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/></svg>'
          + '<h3 class="nc-card__title">Support</h3><p class="nc-card__description">Hilfe erhalten</p></div></a>'
          + '</div>';

      case 'testimonial-quote':
        return '<article class="nc-card" style="max-width:400px;margin:0 auto;">'
          + '<div class="nc-card__content">'
          + '<p class="nc-card__description">\u201eMit PIIPE Workplace haben wir unsere interne Kommunikation revolutioniert.\u201c</p>'
          + '<span class="nc-card__meta">Anna M\u00fcller \u00b7 CTO, Festo SE</span>'
          + '</div></article>';

      case 'pricing-tier':
        var chk3 = d ? ' disabled' : '';
        return '<div style="display:flex;gap:16px;flex-wrap:wrap;">'
          + '<label class="nc-card nc-card--selectable" style="flex:1;min-width:160px;">'
          + '<input class="nc-card__input" type="radio" name="stage-pricing" value="basic"' + chk3 + '/>'
          + '<div class="nc-card__content"><span class="nc-card__kicker">Starter</span><span class="nc-card__title">Basic</span><span class="nc-card__description">5 GB, E-Mail Support</span></div>'
          + '<div class="nc-card__footer"><span class="nc-card__meta">\u20ac 9 / Monat</span></div></label>'
          + '<label class="nc-card nc-card--selectable" style="flex:1;min-width:160px;">'
          + '<input class="nc-card__input" type="radio" name="stage-pricing" value="pro" checked' + chk3 + '/>'
          + '<div class="nc-card__content"><span class="nc-card__kicker">Empfohlen</span><span class="nc-card__title">Pro</span><span class="nc-card__description">50 GB, Priority Support</span></div>'
          + '<div class="nc-card__footer"><span class="nc-card__meta">\u20ac 29 / Monat</span></div></label>'
          + '</div>';

      case 'dashboard-metric':
        return '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px;">'
          + '<article class="nc-card nc-card--status nc-card--status-success"><div class="nc-card__content"><span class="nc-card__kicker">Umsatz Q1</span><h3 class="nc-card__title">\u20ac 1.2M</h3><span class="nc-card__meta">\u2191 12% vs. Vorjahr</span></div></article>'
          + '<article class="nc-card nc-card--status nc-card--status-warning"><div class="nc-card__content"><span class="nc-card__kicker">Speicher</span><h3 class="nc-card__title">87%</h3><span class="nc-card__meta">Grenzwert: 90%</span></div></article>'
          + '<article class="nc-card nc-card--status nc-card--status-info"><div class="nc-card__content"><span class="nc-card__kicker">Aktive Nutzer</span><h3 class="nc-card__title">2.841</h3><span class="nc-card__meta">\u2191 5% diese Woche</span></div></article>'
          + '</div>';

      case 'media-gallery':
        return '<div class="nc-card-grid" style="max-width:500px;">'
          + '<a href="#" class="nc-card nc-card--navigational" onclick="event.preventDefault();">' + placeholderMedia + '</a>'
          + '<a href="#" class="nc-card nc-card--navigational" onclick="event.preventDefault();">' + placeholderMedia + '</a>'
          + '<a href="#" class="nc-card nc-card--navigational" onclick="event.preventDefault();">' + placeholderMedia + '</a>'
          + '</div>';

      case 'skeleton':
        return '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;">'
          + '<article class="nc-card nc-card--skeleton"><div class="nc-card__media"></div><div class="nc-card__content"><span class="nc-card__kicker">&nbsp;</span><h3 class="nc-card__title">&nbsp;</h3><p class="nc-card__description">&nbsp;</p><span class="nc-card__meta">&nbsp;</span></div></article>'
          + '<article class="nc-card nc-card--skeleton"><div class="nc-card__media"></div><div class="nc-card__content"><span class="nc-card__kicker">&nbsp;</span><h3 class="nc-card__title">&nbsp;</h3><p class="nc-card__description">&nbsp;</p><span class="nc-card__meta">&nbsp;</span></div></article>'
          + '</div>';

      default:
        return '<p style="color:var(--fnd-color-text-tertiary);">Variante nicht gefunden.</p>';
    }
  }

  // Varianten ohne Media/Disabled-Toggle
  var noMediaVariants = ['expandable', 'status', 'skeleton', 'event-preview', 'story-featured',
    'team-member', 'city-location', 'quick-link', 'testimonial-quote', 'pricing-tier',
    'dashboard-metric', 'media-gallery'];
  var noDisabledVariants = ['informational', 'status', 'expandable', 'skeleton',
    'team-member', 'testimonial-quote', 'dashboard-metric', 'media-gallery'];

  function updateStage() {
    var theme = themeSelect.value;
    var variant = variantSelect.value;
    var withMedia = mediaChk.checked;
    var isDisabled = disabledChk.checked;

    // Theme anwenden
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Media-Toggle deaktivieren wenn nicht zutreffend
    if (noMediaVariants.indexOf(variant) >= 0) {
      mediaChk.disabled = true;
      mediaChk.checked = false;
      withMedia = false;
    } else {
      mediaChk.disabled = false;
    }

    // Disabled-Toggle deaktivieren wenn nicht zutreffend
    if (noDisabledVariants.indexOf(variant) >= 0) {
      disabledChk.disabled = true;
      disabledChk.checked = false;
      isDisabled = false;
    } else {
      disabledChk.disabled = false;
    }

    // Preview rendern
    preview.innerHTML = buildPreview(variant, withMedia, isDisabled);

    // Code-Output: aus Recipes-JSON wenn verfügbar, sonst Fallback
    if (recipesMap[variant] && recipesMap[variant].html) {
      codeOutput.textContent = recipesMap[variant].html;
    } else {
      codeOutput.textContent = '<!-- Variante: ' + variant + ' -->';
    }
  }

  themeSelect.addEventListener('change', updateStage);
  variantSelect.addEventListener('change', updateStage);
  mediaChk.addEventListener('change', updateStage);
  disabledChk.addEventListener('change', updateStage);

  updateStage();
})();
