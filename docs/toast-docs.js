// ==========================================================================
// Toast / Sonner Docs — Tab Navigation + Staging Area + Live Demos
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Variant, Position, Title, Description, Close, Action,
//               Progress, Duration → Trigger-Button
// Showcases: Varianten, Positionen, Action, Stacking, Nur Beschreibung
// ==========================================================================

(function () {
  'use strict';

  // -----------------------------------------------------------------------
  // 1. Tab Navigation (Benutzung | Style | API | Accessibility)
  // -----------------------------------------------------------------------

  var tabList = document.querySelector('.docs-tabs__list');
  var triggers = tabList ? tabList.querySelectorAll('.docs-tabs__trigger') : [];
  var panels = document.querySelectorAll('.docs-tabs__panel');

  function activateTab(trigger) {
    triggers.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
    panels.forEach(function (p) { p.classList.remove('is-active'); });
    trigger.setAttribute('aria-selected', 'true');
    var panelId = trigger.getAttribute('aria-controls');
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.add('is-active');
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      activateTab(trigger);
    });

    trigger.addEventListener('keydown', function (e) {
      var index = Array.prototype.indexOf.call(triggers, trigger);
      var nextIndex = -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (index + 1) % triggers.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (index - 1 + triggers.length) % triggers.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = triggers.length - 1;
      }

      if (nextIndex >= 0) {
        e.preventDefault();
        triggers[nextIndex].focus();
        activateTab(triggers[nextIndex]);
      }
    });
  });

  // -----------------------------------------------------------------------
  // 2. SVG Icon Templates
  // -----------------------------------------------------------------------

  var ICON_DEFAULT = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

  var ICON_SUCCESS = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';

  var ICON_WARNING = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

  var ICON_ERROR = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

  var ICON_INFO = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';

  var ICON_CLOSE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  var ICONS = {
    'default': ICON_DEFAULT,
    success: ICON_SUCCESS,
    warning: ICON_WARNING,
    error: ICON_ERROR,
    info: ICON_INFO
  };

  var VARIANT_TITLES = {
    'default': 'Benachrichtigung',
    success: 'Erfolgreich',
    warning: 'Warnung',
    error: 'Fehler',
    info: 'Information'
  };

  var VARIANT_DESCRIPTIONS = {
    'default': 'Dies ist eine Standard-Benachrichtigung.',
    success: 'Die Aktion wurde erfolgreich ausgef\u00fchrt.',
    warning: 'Bitte \u00fcberpr\u00fcfen Sie die Eingabe.',
    error: 'Ein kritischer Fehler ist aufgetreten.',
    info: 'Hier ist eine informative Nachricht.'
  };

  var POSITIONS = [
    'top-left', 'top-center', 'top-right',
    'bottom-left', 'bottom-center', 'bottom-right'
  ];

  // -----------------------------------------------------------------------
  // 3. Toast Engine (NcToast)
  // -----------------------------------------------------------------------

  var toastIdCounter = 0;
  var toasterContainers = {};  // position → DOM element
  var activeToasts = {};       // toastId → { el, timer, position }

  /**
   * Get or create a toaster container for a given position.
   * Optionally constrain it within a parent element (for stage demos).
   */
  function getToaster(position, parent) {
    var key = position + (parent ? '-scoped' : '-global');

    if (toasterContainers[key] && toasterContainers[key].parentNode) {
      // Update position class if needed
      return toasterContainers[key];
    }

    var container = document.createElement('div');
    container.className = 'nc-toaster nc-toaster--' + position;
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Benachrichtigungen');

    if (parent) {
      // Scoped toaster (inside preview area)
      container.style.position = 'absolute';
      parent.appendChild(container);
    } else {
      // Global toaster (in body)
      document.body.appendChild(container);
    }

    toasterContainers[key] = container;
    return container;
  }

  /**
   * Show a toast notification.
   * @param {Object} options
   * @returns {string} toastId
   */
  function showToast(options) {
    var opts = Object.assign({
      variant: 'default',
      position: 'top-right',
      title: null,
      description: null,
      duration: 5000,
      showClose: true,
      showProgress: true,
      actionLabel: null,
      onAction: null,
      onDismiss: null,
      parent: null,
      theme: null
    }, options);

    var toastId = 'nc-toast-' + (++toastIdCounter);
    var role = (opts.variant === 'error' || opts.variant === 'warning') ? 'alert' : 'status';

    var toaster = getToaster(opts.position, opts.parent);

    // Apply theme to toaster if specified
    if (opts.theme) {
      var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
      themes.forEach(function (t) { toaster.classList.remove(t); });
      toaster.classList.add(opts.theme);
    }

    // Build toast DOM
    var toast = document.createElement('div');
    toast.className = 'nc-toast nc-toast--' + opts.variant + ' is-entering';
    toast.setAttribute('role', role);
    toast.setAttribute('data-toast-id', toastId);

    // Icon
    var iconHtml = ICONS[opts.variant] || ICONS['default'];
    var icon = document.createElement('span');
    icon.className = 'nc-toast__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = iconHtml;
    toast.appendChild(icon);

    // Content
    var content = document.createElement('div');
    content.className = 'nc-toast__content';

    if (opts.title) {
      var title = document.createElement('p');
      title.className = 'nc-toast__title';
      title.textContent = opts.title;
      content.appendChild(title);
    }

    if (opts.description) {
      var desc = document.createElement('p');
      desc.className = 'nc-toast__description';
      desc.textContent = opts.description;
      content.appendChild(desc);
    }

    toast.appendChild(content);

    // Action Button
    if (opts.actionLabel) {
      var actionBtn = document.createElement('button');
      actionBtn.className = 'nc-toast__action';
      actionBtn.textContent = opts.actionLabel;
      actionBtn.addEventListener('click', function () {
        if (opts.onAction) opts.onAction();
        dismissToast(toastId);
      });
      toast.appendChild(actionBtn);
    }

    // Close Button
    if (opts.showClose) {
      var closeBtn = document.createElement('button');
      closeBtn.className = 'nc-toast__close';
      closeBtn.setAttribute('aria-label', 'Schlie\u00dfen');
      closeBtn.innerHTML = ICON_CLOSE;
      closeBtn.addEventListener('click', function () {
        dismissToast(toastId);
      });
      toast.appendChild(closeBtn);
    }

    // Progress Bar
    if (opts.showProgress && opts.duration > 0) {
      var progress = document.createElement('div');
      progress.className = 'nc-toast__progress';
      // Einzel-Eigenschaften statt der Kurzform `animation`: als Inline-Stil
      // setzte sie animation-play-state und hebelte die Pause per
      // :hover/:focus-within des SCSS aus (wie neo-behaviors toast).
      progress.style.animationName = 'nc-toast-progress';
      progress.style.animationDuration = opts.duration + 'ms';
      progress.style.animationTimingFunction = 'linear';
      progress.style.animationFillMode = 'forwards';
      toast.appendChild(progress);
    }

    // Insert into toaster (for bottom positions, prepend; for top, append)
    var isBottom = opts.position.indexOf('bottom') === 0;
    if (isBottom) {
      toaster.insertBefore(toast, toaster.firstChild);
    } else {
      toaster.appendChild(toast);
    }

    // Remove entering class after animation
    var animDuration = 300; // matches --nc-toast-animation-duration
    setTimeout(function () {
      toast.classList.remove('is-entering');
    }, animDuration);

    // Auto-dismiss — der Timer haelt bei Maus und Fokus im Toast an (wie der
    // Balken per CSS) und laeuft danach mit der Restzeit weiter (WCAG 2.2.1)
    var timer = null;
    if (opts.duration > 0) {
      var rest = opts.duration;
      var start = 0;
      var maus = false;
      var laufe = function () {
        if (timer || maus || toast.contains(document.activeElement)) return;
        start = Date.now();
        timer = setTimeout(function () { dismissToast(toastId); }, rest);
        if (activeToasts[toastId]) activeToasts[toastId].timer = timer;
      };
      var halte = function () {
        if (!timer) return;
        clearTimeout(timer);
        timer = null;
        rest = Math.max(0, rest - (Date.now() - start));
      };
      toast.addEventListener('mouseenter', function () { maus = true; halte(); });
      toast.addEventListener('mouseleave', function () { maus = false; laufe(); });
      toast.addEventListener('focusin', halte);
      toast.addEventListener('focusout', function (e) {
        if (!e.relatedTarget || !toast.contains(e.relatedTarget)) setTimeout(laufe, 0);
      });
      laufe();
    }

    // Track
    activeToasts[toastId] = {
      el: toast,
      timer: timer,
      position: opts.position,
      parent: opts.parent,
      onDismiss: opts.onDismiss
    };

    return toastId;
  }

  /**
   * Dismiss a toast by ID.
   */
  function dismissToast(toastId) {
    var toastData = activeToasts[toastId];
    if (!toastData) return;

    var el = toastData.el;

    // Clear auto-dismiss timer
    if (toastData.timer) clearTimeout(toastData.timer);

    // Add leaving animation
    el.classList.add('is-leaving');

    // Remove after animation
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
      if (toastData.onDismiss) toastData.onDismiss();
      delete activeToasts[toastId];
    }, 300);
  }

  /**
   * Dismiss all active toasts.
   */
  function dismissAll() {
    Object.keys(activeToasts).forEach(function (id) {
      dismissToast(id);
    });
  }

  // ESC key dismisses most recent toast
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var ids = Object.keys(activeToasts);
      if (ids.length > 0) {
        dismissToast(ids[ids.length - 1]);
      }
    }
  });

  // Expose globally for docs page usage
  window.NcToast = {
    show: showToast,
    dismiss: dismissToast,
    dismissAll: dismissAll
  };

  // -----------------------------------------------------------------------
  // 4. Staging Area
  // -----------------------------------------------------------------------

  var themeSelect    = document.getElementById('stage-theme');
  var variantSelect  = document.getElementById('stage-variant');
  var positionSelect = document.getElementById('stage-position');
  var titleChk       = document.getElementById('stage-title');
  var descChk        = document.getElementById('stage-description');
  var closeChk       = document.getElementById('stage-close');
  var actionChk      = document.getElementById('stage-action');
  var progressChk    = document.getElementById('stage-progress');
  var durationSelect = document.getElementById('stage-duration');
  var triggerBtn     = document.getElementById('stage-trigger-btn');
  var codeOutput     = document.getElementById('stage-code');

  if (!triggerBtn) return;

  function updateStageCode() {
    var variant  = variantSelect.value;
    var position = positionSelect.value;
    var showTitle = titleChk.checked;
    var showDesc  = descChk.checked;
    var showClose = closeChk.checked;
    var showAction = actionChk.checked;
    var showProgress = progressChk.checked;
    var duration = parseInt(durationSelect.value, 10);

    var role = (variant === 'error' || variant === 'warning') ? 'alert' : 'status';

    var code = '<!-- Toaster Container -->\n';
    code += '<div class="nc-toaster nc-toaster--' + position + '"\n';
    code += '     aria-live="polite" role="region"\n';
    code += '     aria-label="Benachrichtigungen">\n\n';

    code += '  <!-- Toast -->\n';
    code += '  <div class="nc-toast nc-toast--' + variant + '"\n';
    code += '       role="' + role + '"' + (duration > 0 ? ' data-duration="' + duration + '"' : '') + '>\n';
    code += '    <span class="nc-toast__icon" aria-hidden="true">\n';
    code += '      <svg><!-- ' + variant + ' icon --></svg>\n';
    code += '    </span>\n';
    code += '    <div class="nc-toast__content">\n';

    if (showTitle) {
      code += '      <p class="nc-toast__title">' + VARIANT_TITLES[variant] + '</p>\n';
    }
    if (showDesc) {
      code += '      <p class="nc-toast__description">' + VARIANT_DESCRIPTIONS[variant] + '</p>\n';
    }

    code += '    </div>\n';

    if (showAction) {
      code += '    <button class="nc-toast__action">Aktion</button>\n';
    }

    if (showClose) {
      code += '    <button class="nc-toast__close" aria-label="Schlie\u00dfen">\n';
      code += '      <svg><!-- close icon --></svg>\n';
      code += '    </button>\n';
    }

    if (showProgress && duration > 0) {
      code += '    <!-- laeuft per neo-behaviors (data-duration) ab -->\n';
      code += '    <div class="nc-toast__progress" aria-hidden="true"></div>\n';
    }

    code += '  </div>\n';
    code += '</div>\n\n';

    code += '<!-- JS-Aufruf -->\n';
    code += 'NcToast.show({\n';
    code += '  variant: \'' + variant + '\',\n';
    code += '  position: \'' + position + '\',\n';
    if (showTitle) {
      code += '  title: \'' + VARIANT_TITLES[variant] + '\',\n';
    }
    if (showDesc) {
      code += '  description: \'' + VARIANT_DESCRIPTIONS[variant] + '\',\n';
    }
    code += '  duration: ' + duration + ',\n';
    code += '  showClose: ' + showClose + ',\n';
    code += '  showProgress: ' + showProgress;
    if (showAction) {
      code += ',\n  actionLabel: \'Aktion\',\n';
      code += '  onAction: function() { /* handler */ }';
    }
    code += '\n});';

    codeOutput.textContent = code;
  }

  triggerBtn.addEventListener('click', function () {
    var theme    = themeSelect.value;
    var variant  = variantSelect.value;
    var position = positionSelect.value;
    var showTitle = titleChk.checked;
    var showDesc  = descChk.checked;
    var showClose = closeChk.checked;
    var showAction = actionChk.checked;
    var showProgress = progressChk.checked;
    var duration = parseInt(durationSelect.value, 10);

    showToast({
      variant: variant,
      position: position,
      title: showTitle ? VARIANT_TITLES[variant] : null,
      description: showDesc ? VARIANT_DESCRIPTIONS[variant] : null,
      duration: duration,
      showClose: showClose,
      showProgress: showProgress,
      actionLabel: showAction ? 'Aktion' : null,
      onAction: showAction ? function () { /* noop for demo */ } : null,
      theme: theme
    });

    updateStageCode();
  });

  // Update code on any change
  [themeSelect, variantSelect, positionSelect, durationSelect].forEach(function (el) {
    el.addEventListener('change', updateStageCode);
  });
  [titleChk, descChk, closeChk, actionChk, progressChk].forEach(function (el) {
    el.addEventListener('change', updateStageCode);
  });

  // Initial code render
  updateStageCode();

  // -----------------------------------------------------------------------
  // 5. Showcase: Alle Varianten
  // -----------------------------------------------------------------------

  var demoVariants = document.getElementById('demo-variants');
  if (demoVariants) {
    var variants = ['default', 'success', 'warning', 'error', 'info'];
    variants.forEach(function (v) {
      var btn = document.createElement('button');
      btn.className = 'nc-button nc-button--sm nc-button--outline';
      btn.textContent = v.charAt(0).toUpperCase() + v.slice(1) + ' Toast';
      btn.addEventListener('click', function () {
        showToast({
          variant: v,
          position: 'top-right',
          title: VARIANT_TITLES[v],
          description: VARIANT_DESCRIPTIONS[v],
          duration: 5000,
          showClose: true,
          showProgress: true
        });
      });
      demoVariants.appendChild(btn);
    });
  }

  // -----------------------------------------------------------------------
  // 6. Showcase: Alle Positionen
  // -----------------------------------------------------------------------

  var demoPositions = document.getElementById('demo-positions');
  if (demoPositions) {
    POSITIONS.forEach(function (pos) {
      var btn = document.createElement('button');
      btn.className = 'nc-button nc-button--sm nc-button--outline';
      btn.textContent = pos;
      btn.addEventListener('click', function () {
        showToast({
          variant: 'info',
          position: pos,
          title: 'Position: ' + pos,
          description: 'Toast an Position ' + pos + ' angezeigt.',
          duration: 4000,
          showClose: true,
          showProgress: true
        });
      });
      demoPositions.appendChild(btn);
    });
  }

  // -----------------------------------------------------------------------
  // 7. Showcase: Mit Action Button
  // -----------------------------------------------------------------------

  var demoAction = document.getElementById('demo-action');
  if (demoAction) {
    var btn = document.createElement('button');
    btn.className = 'nc-button nc-button--sm nc-button--outline';
    btn.textContent = 'Toast mit Action';
    btn.addEventListener('click', function () {
      showToast({
        variant: 'default',
        position: 'top-right',
        title: 'Eintrag gel\u00f6scht',
        description: 'Der Eintrag wurde entfernt.',
        duration: 8000,
        showClose: true,
        showProgress: true,
        actionLabel: 'R\u00fcckg\u00e4ngig',
        onAction: function () {
          showToast({
            variant: 'success',
            position: 'top-right',
            title: 'R\u00fcckg\u00e4ngig gemacht',
            description: 'Der Eintrag wurde wiederhergestellt.',
            duration: 3000,
            showClose: true,
            showProgress: true
          });
        }
      });
    });
    demoAction.appendChild(btn);

    // Warning with action
    var btnWarn = document.createElement('button');
    btnWarn.className = 'nc-button nc-button--sm nc-button--outline';
    btnWarn.textContent = 'Warning mit Action';
    btnWarn.addEventListener('click', function () {
      showToast({
        variant: 'warning',
        position: 'top-right',
        title: 'Sitzung l\u00e4uft ab',
        description: 'Ihre Sitzung l\u00e4uft in 5 Minuten ab.',
        duration: 0,
        showClose: true,
        showProgress: false,
        actionLabel: 'Verl\u00e4ngern',
        onAction: function () {
          showToast({
            variant: 'success',
            position: 'top-right',
            title: 'Verl\u00e4ngert',
            description: 'Ihre Sitzung wurde verl\u00e4ngert.',
            duration: 3000,
            showClose: true,
            showProgress: true
          });
        }
      });
    });
    demoAction.appendChild(btnWarn);
  }

  // -----------------------------------------------------------------------
  // 8. Showcase: Stacking
  // -----------------------------------------------------------------------

  var demoStacking = document.getElementById('demo-stacking');
  if (demoStacking) {
    var stackCounter = 0;
    var btn = document.createElement('button');
    btn.className = 'nc-button nc-button--sm nc-button--primary';
    btn.textContent = 'Mehrere Toasts erzeugen';
    btn.addEventListener('click', function () {
      var variants = ['success', 'info', 'warning', 'error', 'default'];
      for (var i = 0; i < 3; i++) {
        (function (idx) {
          setTimeout(function () {
            stackCounter++;
            var v = variants[idx % variants.length];
            showToast({
              variant: v,
              position: 'top-right',
              title: VARIANT_TITLES[v] + ' #' + stackCounter,
              description: VARIANT_DESCRIPTIONS[v],
              duration: 5000 + (idx * 1000),
              showClose: true,
              showProgress: true
            });
          }, idx * 200);
        })(i);
      }
    });
    demoStacking.appendChild(btn);

    // Dismiss All button
    var dismissBtn = document.createElement('button');
    dismissBtn.className = 'nc-button nc-button--sm nc-button--outline';
    dismissBtn.textContent = 'Alle schlie\u00dfen';
    dismissBtn.addEventListener('click', function () {
      dismissAll();
    });
    demoStacking.appendChild(dismissBtn);
  }

  // -----------------------------------------------------------------------
  // 9. Showcase: Nur Beschreibung
  // -----------------------------------------------------------------------

  var demoDescOnly = document.getElementById('demo-description-only');
  if (demoDescOnly) {
    var btn = document.createElement('button');
    btn.className = 'nc-button nc-button--sm nc-button--outline';
    btn.textContent = 'Kompakter Toast';
    btn.addEventListener('click', function () {
      showToast({
        variant: 'success',
        position: 'top-right',
        title: null,
        description: '\u00c4nderungen gespeichert.',
        duration: 3000,
        showClose: true,
        showProgress: true
      });
    });
    demoDescOnly.appendChild(btn);

    var btn2 = document.createElement('button');
    btn2.className = 'nc-button nc-button--sm nc-button--outline';
    btn2.textContent = 'Error ohne Titel';
    btn2.addEventListener('click', function () {
      showToast({
        variant: 'error',
        position: 'top-right',
        title: null,
        description: 'Verbindung fehlgeschlagen.',
        duration: 0,
        showClose: true,
        showProgress: false
      });
    });
    demoDescOnly.appendChild(btn2);
  }

})();
