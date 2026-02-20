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

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];

  var chevronSvg = '<svg class="nc-card__expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

  var mediaBlock = '<div class="nc-card__media" style="height: 160px; background: var(--fnd-color-background-secondary); display: flex; align-items: center; justify-content: center;">'
    + '<svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>'
    + '</div>';

  var mediaCode = '  <div class="nc-card__media">\n'
    + '    <img src="bild.jpg" alt="Beschreibung" />\n'
    + '  </div>\n';

  function buildVariant(variant, withMedia, isDisabled) {
    var html = '';
    var code = '';
    var disabledAttr = isDisabled ? ' aria-disabled="true"' : '';
    var disabledClass = isDisabled ? ' nc-card--disabled' : '';
    var media = withMedia ? mediaBlock : '';
    var mediaC = withMedia ? mediaCode : '';

    switch (variant) {

      case 'informational':
        html = '<article class="nc-card' + disabledClass + '"' + disabledAttr + '>'
          + media
          + '<div class="nc-card__header">'
          + '<h3 class="nc-card__title">Projektstatus</h3>'
          + '<p class="nc-card__description">Aktuelle Informationen zum Sprint</p>'
          + '</div>'
          + '<div class="nc-card__content"><p style="margin:0;">12 von 18 Tasks abgeschlossen.</p></div>'
          + '</article>';
        code = '<article class="nc-card">\n'
          + mediaC
          + '  <div class="nc-card__header">\n'
          + '    <h3 class="nc-card__title">Projektstatus</h3>\n'
          + '    <p class="nc-card__description">Aktuelle Informationen</p>\n'
          + '  </div>\n'
          + '  <div class="nc-card__content">\n'
          + '    <p>Inhalt...</p>\n'
          + '  </div>\n'
          + '</article>';
        break;

      case 'nav-entire':
        html = '<a href="#" class="nc-card nc-card--navigational' + disabledClass + '"' + disabledAttr + ' onclick="event.preventDefault();">'
          + media
          + '<div class="nc-card__header">'
          + '<h3 class="nc-card__title">Link-Titel</h3>'
          + '<p class="nc-card__description">Gesamte Fläche ist klickbar</p>'
          + '</div>'
          + '</a>';
        code = '<a href="/ziel" class="nc-card nc-card--navigational">\n'
          + mediaC
          + '  <div class="nc-card__header">\n'
          + '    <h3 class="nc-card__title">Link-Titel</h3>\n'
          + '    <p class="nc-card__description">Beschreibung</p>\n'
          + '  </div>\n'
          + '</a>';
        break;

      case 'nav-partial':
        html = '<article class="nc-card' + disabledClass + '"' + disabledAttr + '>'
          + media
          + '<div class="nc-card__header">'
          + '<h3 class="nc-card__title"><a href="#" class="nc-card__title-link" onclick="event.preventDefault();">Partieller Link</a></h3>'
          + '<p class="nc-card__description">Nur der Titel ist verlinkt</p>'
          + '</div>'
          + '</article>';
        code = '<article class="nc-card">\n'
          + mediaC
          + '  <div class="nc-card__header">\n'
          + '    <h3 class="nc-card__title">\n'
          + '      <a href="/ziel" class="nc-card__title-link">Titel</a>\n'
          + '    </h3>\n'
          + '    <p class="nc-card__description">Beschreibung</p>\n'
          + '  </div>\n'
          + '</article>';
        break;

      case 'action':
        html = '<article class="nc-card nc-card--action' + disabledClass + '"' + disabledAttr + '>'
          + media
          + '<div class="nc-card__header">'
          + '<h3 class="nc-card__title">Benutzer einladen</h3>'
          + '<p class="nc-card__description">Sende eine Einladung per E-Mail.</p>'
          + '</div>'
          + '<div class="nc-card__footer">'
          + '<button class="nc-button nc-button--outline nc-button--sm">Abbrechen</button>'
          + '<button class="nc-button nc-button--sm">Einladen</button>'
          + '</div>'
          + '</article>';
        code = '<article class="nc-card nc-card--action">\n'
          + mediaC
          + '  <div class="nc-card__header">\n'
          + '    <h3 class="nc-card__title">Aufgabe</h3>\n'
          + '    <p class="nc-card__description">Beschreibung</p>\n'
          + '  </div>\n'
          + '  <div class="nc-card__footer">\n'
          + '    <button class="nc-button nc-button--outline">Abbrechen</button>\n'
          + '    <button class="nc-button">Bestätigen</button>\n'
          + '  </div>\n'
          + '</article>';
        break;

      case 'selectable-radio':
        var chk = isDisabled ? ' disabled' : '';
        html = '<div style="display: flex; gap: 16px; flex-wrap: wrap;">'
          + '<label class="nc-card nc-card--selectable" style="flex: 1; min-width: 140px;">'
          + '<input class="nc-card__input" type="radio" name="stage-plan" value="basic" checked' + chk + ' />'
          + '<div class="nc-card__header"><span class="nc-card__title">Basic</span><span class="nc-card__description">5 GB</span></div>'
          + '</label>'
          + '<label class="nc-card nc-card--selectable" style="flex: 1; min-width: 140px;">'
          + '<input class="nc-card__input" type="radio" name="stage-plan" value="pro"' + chk + ' />'
          + '<div class="nc-card__header"><span class="nc-card__title">Pro</span><span class="nc-card__description">50 GB</span></div>'
          + '</label>'
          + '</div>';
        code = '<label class="nc-card nc-card--selectable">\n'
          + '  <input class="nc-card__input" type="radio"\n'
          + '         name="plan" value="basic" />\n'
          + '  <div class="nc-card__header">\n'
          + '    <span class="nc-card__title">Basic</span>\n'
          + '    <span class="nc-card__description">5 GB</span>\n'
          + '  </div>\n'
          + '</label>';
        break;

      case 'selectable-checkbox':
        var chk2 = isDisabled ? ' disabled' : '';
        html = '<div style="display: flex; gap: 16px; flex-wrap: wrap;">'
          + '<label class="nc-card nc-card--selectable" style="flex: 1; min-width: 140px;">'
          + '<input class="nc-card__input" type="checkbox" name="stage-feat" value="analytics" checked' + chk2 + ' />'
          + '<div class="nc-card__header"><span class="nc-card__title">Analytics</span><span class="nc-card__description">Auswertungen</span></div>'
          + '</label>'
          + '<label class="nc-card nc-card--selectable" style="flex: 1; min-width: 140px;">'
          + '<input class="nc-card__input" type="checkbox" name="stage-feat" value="export"' + chk2 + ' />'
          + '<div class="nc-card__header"><span class="nc-card__title">Export</span><span class="nc-card__description">CSV &amp; PDF</span></div>'
          + '</label>'
          + '</div>';
        code = '<label class="nc-card nc-card--selectable">\n'
          + '  <input class="nc-card__input" type="checkbox"\n'
          + '         name="features" value="analytics" />\n'
          + '  <div class="nc-card__header">\n'
          + '    <span class="nc-card__title">Analytics</span>\n'
          + '    <span class="nc-card__description">Auswertungen</span>\n'
          + '  </div>\n'
          + '</label>';
        break;

      case 'expandable':
        html = '<details class="nc-card nc-card--expandable" style="max-width: 100%;">'
          + '<summary class="nc-card__summary">'
          + '<span class="nc-card__title" style="font-size: var(--fnd-typography-body-m-font-size);">Welche Zahlungsmethoden werden akzeptiert?</span>'
          + chevronSvg
          + '</summary>'
          + '<div class="nc-card__content"><p style="margin: 0;">Visa, Mastercard, PayPal und Banküberweisung.</p></div>'
          + '</details>';
        code = '<details class="nc-card nc-card--expandable">\n'
          + '  <summary class="nc-card__summary">\n'
          + '    <span class="nc-card__title">FAQ-Frage</span>\n'
          + '    <svg class="nc-card__expand-icon" ...>...</svg>\n'
          + '  </summary>\n'
          + '  <div class="nc-card__content">\n'
          + '    <p>Antwort...</p>\n'
          + '  </div>\n'
          + '</details>';
        break;

      case 'status':
        html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">'
          + '<article class="nc-card nc-card--status nc-card--status-success"><div class="nc-card__header"><h3 class="nc-card__title">Erfolgreich</h3><p class="nc-card__description">Alle Tests bestanden</p></div></article>'
          + '<article class="nc-card nc-card--status nc-card--status-warning"><div class="nc-card__header"><h3 class="nc-card__title">Warnung</h3><p class="nc-card__description">Speicher fast voll</p></div></article>'
          + '<article class="nc-card nc-card--status nc-card--status-danger"><div class="nc-card__header"><h3 class="nc-card__title">Fehler</h3><p class="nc-card__description">Build fehlgeschlagen</p></div></article>'
          + '<article class="nc-card nc-card--status nc-card--status-info"><div class="nc-card__header"><h3 class="nc-card__title">Info</h3><p class="nc-card__description">Wartungsfenster geplant</p></div></article>'
          + '</div>';
        code = '<article class="nc-card nc-card--status nc-card--status-success">\n'
          + '  <div class="nc-card__header">\n'
          + '    <h3 class="nc-card__title">Erfolgreich</h3>\n'
          + '    <p class="nc-card__description">Alle Tests bestanden</p>\n'
          + '  </div>\n'
          + '</article>';
        break;
    }

    return { html: html, code: code };
  }

  function updateStage() {
    var theme = themeSelect.value;
    var variant = variantSelect.value;
    var withMedia = mediaChk.checked;
    var isDisabled = disabledChk.checked;

    // Apply theme
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Disable media checkbox for expandable/status variants
    if (variant === 'expandable' || variant === 'status') {
      mediaChk.disabled = true;
      mediaChk.checked = false;
      withMedia = false;
    } else {
      mediaChk.disabled = false;
    }

    // Disable disabled checkbox for non-interactive variants
    if (variant === 'informational' || variant === 'status' || variant === 'expandable') {
      disabledChk.disabled = true;
      disabledChk.checked = false;
      isDisabled = false;
    } else {
      disabledChk.disabled = false;
    }

    var result = buildVariant(variant, withMedia, isDisabled);
    preview.innerHTML = result.html;
    codeOutput.textContent = result.code;
  }

  themeSelect.addEventListener('change', updateStage);
  variantSelect.addEventListener('change', updateStage);
  mediaChk.addEventListener('change', updateStage);
  disabledChk.addEventListener('change', updateStage);

  updateStage();
})();
