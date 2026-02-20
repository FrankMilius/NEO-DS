// ==========================================================================
// Alert Dialog Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Action-Style, Description toggle
// ==========================================================================

(function () {
  'use strict';

  // -----------------------------------------------------------------------
  // 1. Tab Navigation
  // -----------------------------------------------------------------------

  var tabList = document.querySelector('.docs-tabs__list');
  var triggers = tabList ? tabList.querySelectorAll('.docs-tabs__trigger') : [];
  var panels = document.querySelectorAll('.docs-tabs__panel');

  function activateTab(trigger) {
    // Deactivate all
    triggers.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
    panels.forEach(function (p) { p.classList.remove('is-active'); });

    // Activate selected
    trigger.setAttribute('aria-selected', 'true');
    var panelId = trigger.getAttribute('aria-controls');
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.add('is-active');
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      activateTab(trigger);
    });

    // Arrow key navigation within tabs
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
  // 2. Staging Area
  // -----------------------------------------------------------------------

  var themeSelect       = document.getElementById('stage-theme');
  var actionStyleSelect = document.getElementById('stage-action-style');
  var descriptionChk    = document.getElementById('stage-description');
  var openDialogBtn     = document.getElementById('stage-open-dialog');
  var codeOutput        = document.getElementById('stage-code');

  // Dialog elements
  var stageDialog       = document.getElementById('stage-dialog');
  var stageDialogCancel = document.getElementById('stage-dialog-cancel');
  var stageDialogAction = document.getElementById('stage-dialog-action');
  var stageDialogTitle  = document.getElementById('stage-dlg-title');
  var stageDialogDesc   = document.getElementById('stage-dlg-desc');

  if (!stageDialog) return;

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function updateStage() {
    var theme       = themeSelect.value;
    var actionStyle = actionStyleSelect.value;
    var showDesc    = descriptionChk.checked;

    // Apply theme to the dialog element
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { stageDialog.classList.remove(t); });
    stageDialog.classList.add(theme);

    // Update action button style
    stageDialogAction.className = 'nc-button';
    if (actionStyle === 'danger') {
      stageDialogAction.classList.add('nc-button--danger');
      stageDialogAction.textContent = 'L\u00F6schen';
    } else {
      stageDialogAction.textContent = 'Best\u00E4tigen';
    }

    // Show/hide description
    if (showDesc) {
      stageDialogDesc.style.display = '';
      stageDialog.setAttribute('aria-describedby', 'stage-dlg-desc');
    } else {
      stageDialogDesc.style.display = 'none';
      stageDialog.removeAttribute('aria-describedby');
    }

    // Update code output
    var actionClass = actionStyle === 'danger' ? ' nc-button--danger' : '';
    var actionLabel = actionStyle === 'danger' ? 'L\u00F6schen' : 'Best\u00E4tigen';
    var ariaDesc    = showDesc ? ' aria-describedby="dlg-desc"' : '';

    var descBlock = '';
    if (showDesc) {
      descBlock = '\n    <p class="nc-alert-dialog__description" id="dlg-desc">\n'
                + '      Diese Aktion kann nicht r\u00FCckg\u00E4ngig gemacht werden.\n'
                + '    </p>';
    }

    var code = '<dialog class="nc-alert-dialog" aria-labelledby="dlg-title"' + ariaDesc + '>\n'
             + '  <div class="nc-alert-dialog__header">\n'
             + '    <h2 class="nc-alert-dialog__title" id="dlg-title">Sind Sie sicher?</h2>'
             + descBlock + '\n'
             + '  </div>\n'
             + '  <div class="nc-alert-dialog__footer">\n'
             + '    <button class="nc-button nc-button--outline">Abbrechen</button>\n'
             + '    <button class="nc-button' + actionClass + '" autofocus>' + actionLabel + '</button>\n'
             + '  </div>\n'
             + '</dialog>';

    codeOutput.textContent = code;
  }

  // -----------------------------------------------------------------------
  // 3. Dialog Open/Close — Staging Area
  // -----------------------------------------------------------------------

  openDialogBtn.addEventListener('click', function () {
    stageDialog.showModal();
  });

  stageDialogCancel.addEventListener('click', function () {
    stageDialog.close();
  });

  stageDialogAction.addEventListener('click', function () {
    stageDialog.close('confirm');
  });

  // -----------------------------------------------------------------------
  // 4. Demo Dialogs Open/Close
  // -----------------------------------------------------------------------

  var demoOpenDestructive = document.getElementById('demo-open-destructive');
  var demoDialogDestructive = document.getElementById('demo-dialog-destructive');

  var demoOpenSimple = document.getElementById('demo-open-simple');
  var demoDialogSimple = document.getElementById('demo-dialog-simple');

  if (demoOpenDestructive && demoDialogDestructive) {
    demoOpenDestructive.addEventListener('click', function () {
      demoDialogDestructive.showModal();
    });
  }

  if (demoOpenSimple && demoDialogSimple) {
    demoOpenSimple.addEventListener('click', function () {
      demoDialogSimple.showModal();
    });
  }

  // Close buttons with data-dialog-close attribute
  var dialogCloseButtons = document.querySelectorAll('[data-dialog-close]');
  dialogCloseButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dialog = btn.closest('dialog');
      if (dialog) dialog.close();
    });
  });

  // -----------------------------------------------------------------------
  // 5. Event Listeners + Initial Render
  // -----------------------------------------------------------------------

  themeSelect.addEventListener('change', updateStage);
  actionStyleSelect.addEventListener('change', updateStage);
  descriptionChk.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
