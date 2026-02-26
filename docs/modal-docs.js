// ==========================================================================
// Modal Docs — Staging Area Controller
// ==========================================================================
// Verbindet die Staging-Buttons mit den <dialog>-Elementen.
// Varianten: Location Preference, Contextual Notification, Theme Switcher
// ==========================================================================

(function () {
  'use strict';

  // -----------------------------------------------------------------------
  // 1. Dialog-Elemente
  // -----------------------------------------------------------------------

  var dialogs = {
    location:         document.getElementById('stage-modal-location'),
    notification:     document.getElementById('stage-modal-notification'),
    'theme-switcher': document.getElementById('stage-modal-theme-switcher')
  };

  // -----------------------------------------------------------------------
  // 2. Close-Handler fuer alle Dialoge
  // -----------------------------------------------------------------------

  document.querySelectorAll('[data-modal-close]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dialog = btn.closest('dialog');
      if (dialog) dialog.close();
    });
  });

  // Backdrop-Click schliesst den Dialog
  Object.keys(dialogs).forEach(function (key) {
    var dialog = dialogs[key];
    if (!dialog) return;
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });
  });

  // -----------------------------------------------------------------------
  // 3. Staging Area — Open Button
  // -----------------------------------------------------------------------

  var variantSelect = document.getElementById('stage-variant');
  var openBtn       = document.getElementById('stage-open-modal');
  var codeOutput    = document.getElementById('stage-code');

  if (openBtn && variantSelect) {
    openBtn.addEventListener('click', function () {
      var variant = variantSelect.value;
      var dialog = dialogs[variant];
      if (dialog) dialog.showModal();
    });
  }

  // -----------------------------------------------------------------------
  // 4. Code-Output aktualisieren bei Varianten-Wechsel
  // -----------------------------------------------------------------------

  var codeSnippets = {
    location: '<dialog class="location-preference-modal" aria-labelledby="loc-title">\n'
      + '  <div class="button-container">\n'
      + '    <button class="close-btn" aria-label="Schlie\u00dfen">\n'
      + '      <span class="icon">\u2026</span>\n'
      + '    </button>\n'
      + '  </div>\n'
      + '  <h2 class="dialog-header" id="loc-title">Standort w\u00e4hlen</h2>\n'
      + '  <p class="current-location">Aktuell: <span>Berlin</span></p>\n'
      + '  <input type="search" placeholder="Standort suchen \u2026" />\n'
      + '  <details>\n'
      + '    <summary>\n'
      + '      Region\n'
      + '      <span class="region-summary-icon">\u2026</span>\n'
      + '    </summary>\n'
      + '    <ul>\n'
      + '      <li>Berlin</li>\n'
      + '      <li>Hamburg</li>\n'
      + '    </ul>\n'
      + '  </details>\n'
      + '</dialog>',

    notification: '<dialog class="contextual-notification-modal" aria-labelledby="notif-title">\n'
      + '  <div class="notification-media">\n'
      + '    <picture>\n'
      + '      <img src="image.jpg" alt="Vorschaubild" />\n'
      + '    </picture>\n'
      + '  </div>\n'
      + '  <div class="notification-content">\n'
      + '    <div class="notification-heading">\n'
      + '      <h2 id="notif-title">Neue Veranstaltung</h2>\n'
      + '      <button class="close-btn" aria-label="Schlie\u00dfen">\n'
      + '        <span class="icon">\u2026</span>\n'
      + '      </button>\n'
      + '    </div>\n'
      + '    <p>Konzert heute Abend um 20 Uhr.</p>\n'
      + '    <div class="button-container">\n'
      + '      <span class="icon">\u2026</span>\n'
      + '      <a href="#">Mehr erfahren</a>\n'
      + '    </div>\n'
      + '  </div>\n'
      + '</dialog>',

    'theme-switcher': '<dialog class="theme-switcher-modal" aria-labelledby="ts-title">\n'
      + '  <div class="theme-switcher__header">\n'
      + '    <h2 class="theme-switcher__title" id="ts-title">Theme w\u00e4hlen</h2>\n'
      + '    <button class="theme-switcher__close" aria-label="Schlie\u00dfen">\n'
      + '      <span class="icon">\u2026</span>\n'
      + '    </button>\n'
      + '  </div>\n'
      + '  <div class="theme-switcher__content">\n'
      + '    <span class="theme-switcher__label">Darstellung</span>\n'
      + '    <div class="theme-switcher__grid">\n'
      + '      <button class="theme-switcher__option is-active" data-theme="neo-light-theme">\n'
      + '        <div class="theme-switcher__preview">\u2026</div>\n'
      + '        <span class="theme-switcher__option-label">Neo Light</span>\n'
      + '      </button>\n'
      + '      <!-- Weitere Kacheln ... -->\n'
      + '    </div>\n'
      + '  </div>\n'
      + '</dialog>'
  };

  function updateCode() {
    if (!codeOutput || !variantSelect) return;
    var variant = variantSelect.value;
    codeOutput.textContent = codeSnippets[variant] || '';
  }

  if (variantSelect) {
    variantSelect.addEventListener('change', updateCode);
  }

  // -----------------------------------------------------------------------
  // 5. Demo-Buttons (statische Beispiele)
  // -----------------------------------------------------------------------

  var demoNotification      = document.getElementById('demo-open-notification');
  var demoNotificationGreen = document.getElementById('demo-open-notification-green');
  var demoThemeSwitcher     = document.getElementById('demo-open-theme-switcher');

  var notifDialog      = dialogs.notification;
  var notifGreenDialog = document.getElementById('demo-modal-notification-green');
  var tsDialog         = dialogs['theme-switcher'];

  if (demoNotification && notifDialog) {
    demoNotification.addEventListener('click', function () {
      notifDialog.showModal();
    });
  }

  if (demoNotificationGreen && notifGreenDialog) {
    demoNotificationGreen.addEventListener('click', function () {
      notifGreenDialog.showModal();
    });
  }

  if (demoThemeSwitcher && tsDialog) {
    demoThemeSwitcher.addEventListener('click', function () {
      tsDialog.showModal();
    });
  }

})();
