// ==========================================================================
// Textarea Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Size, State, Auto-Resize, Zeichenzaehler
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

  var themeSelect   = document.getElementById('stage-theme');
  var sizeSelect    = document.getElementById('stage-size');
  var stateSelect   = document.getElementById('stage-state');
  var autosizeChk   = document.getElementById('stage-autosize');
  var counterChk    = document.getElementById('stage-counter');
  var preview       = document.getElementById('stage-preview');
  var codeOutput    = document.getElementById('stage-code');

  if (!preview) return;

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function updateStage() {
    var theme    = themeSelect.value;
    var size     = sizeSelect.value;
    var state    = stateSelect.value;
    var autosize = autosizeChk.checked;
    var counter  = counterChk.checked;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Build class list
    var classes = ['nc-textarea'];

    // Size modifier (md = default, no modifier needed)
    if (size === 'sm') {
      classes.push('nc-textarea--sm');
    } else if (size === 'lg') {
      classes.push('nc-textarea--lg');
    }

    // State modifier
    if (state === 'error') {
      classes.push('nc-textarea--error');
    } else if (state === 'success') {
      classes.push('nc-textarea--success');
    }

    // Autosize modifier
    if (autosize) {
      classes.push('nc-textarea--autosize');
    }

    var classStr = classes.join(' ');

    // Build attributes
    var attrs = '';
    var attrCode = '';
    var rows = autosize ? 2 : 4;

    attrs += ' rows="' + rows + '"';
    attrCode += '\n          rows="' + rows + '"';

    if (state === 'disabled') {
      attrs += ' disabled';
      attrCode += '\n          disabled';
    } else if (state === 'readonly') {
      attrs += ' readonly';
      attrCode += '\n          readonly';
    }

    if (state === 'error') {
      attrs += ' aria-invalid="true"';
      attrCode += '\n          aria-invalid="true"';
    }

    var placeholder = 'Text eingeben...';
    attrs += ' placeholder="' + placeholder + '"';
    attrCode += '\n          placeholder="' + placeholder + '"';

    var maxlength = 200;
    if (counter) {
      attrs += ' maxlength="' + maxlength + '"';
      attrCode += '\n          maxlength="' + maxlength + '"';
    }

    // Build preview HTML
    var html = '';
    var textareaId = 'stage-textarea-el';

    if (counter) {
      html += '<div class="nc-textarea-wrapper">';
      html += '<textarea class="' + classStr + '" id="' + textareaId + '"' + attrs + '>';
      if (state === 'readonly') {
        html += 'Readonly-Inhalt';
      }
      html += '</textarea>';
      html += '<span class="nc-textarea__counter" id="stage-counter-display">0 / ' + maxlength + '</span>';
      html += '</div>';
    } else {
      html += '<textarea class="' + classStr + '" id="' + textareaId + '"' + attrs + '>';
      if (state === 'readonly') {
        html += 'Readonly-Inhalt';
      }
      html += '</textarea>';
    }

    preview.innerHTML = html;

    // Build code output
    var codeStr = '';
    if (counter) {
      codeStr += '<div class="nc-textarea-wrapper">\n';
      codeStr += '  <textarea class="' + classStr + '"' + attrCode + '>';
      if (state === 'readonly') {
        codeStr += 'Readonly-Inhalt';
      }
      codeStr += '</textarea>\n';
      codeStr += '  <span class="nc-textarea__counter">0 / ' + maxlength + '</span>\n';
      codeStr += '</div>';
    } else {
      codeStr += '<textarea class="' + classStr + '"' + attrCode + '>';
      if (state === 'readonly') {
        codeStr += 'Readonly-Inhalt';
      }
      codeStr += '</textarea>';
    }

    codeOutput.textContent = codeStr;

    // Bind counter logic to staged textarea
    if (counter) {
      var stagedTextarea = document.getElementById(textareaId);
      var stagedCounter  = document.getElementById('stage-counter-display');
      if (stagedTextarea && stagedCounter) {
        stagedTextarea.addEventListener('input', function () {
          var len = stagedTextarea.value.length;
          stagedCounter.textContent = len + ' / ' + maxlength;
          if (len >= maxlength) {
            stagedCounter.classList.add('nc-textarea__counter--limit');
          } else {
            stagedCounter.classList.remove('nc-textarea__counter--limit');
          }
        });
      }
    }

    // Bind autosize logic to staged textarea
    if (autosize) {
      var stagedTextarea = document.getElementById(textareaId);
      if (stagedTextarea) {
        function autoResize() {
          stagedTextarea.style.height = 'auto';
          stagedTextarea.style.height = stagedTextarea.scrollHeight + 'px';
        }
        stagedTextarea.addEventListener('input', autoResize);
      }
    }
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  sizeSelect.addEventListener('change', updateStage);
  stateSelect.addEventListener('change', updateStage);
  autosizeChk.addEventListener('change', updateStage);
  counterChk.addEventListener('change', updateStage);

  // Initial render
  updateStage();

  // -----------------------------------------------------------------------
  // 3. Static Demo: Character Counter
  // -----------------------------------------------------------------------

  var demoCounterTextarea = document.getElementById('demo-counter-textarea');
  var demoCounterDisplay  = document.getElementById('demo-counter-display');

  if (demoCounterTextarea && demoCounterDisplay) {
    demoCounterTextarea.addEventListener('input', function () {
      var len = demoCounterTextarea.value.length;
      var max = parseInt(demoCounterTextarea.getAttribute('maxlength'), 10) || 200;
      demoCounterDisplay.textContent = len + ' / ' + max;
      if (len >= max) {
        demoCounterDisplay.classList.add('nc-textarea__counter--limit');
      } else {
        demoCounterDisplay.classList.remove('nc-textarea__counter--limit');
      }
    });
  }

  // -----------------------------------------------------------------------
  // 4. Static Demo: Auto-Resize
  // -----------------------------------------------------------------------

  var demoAutosizeTextarea = document.getElementById('demo-autosize-textarea');

  if (demoAutosizeTextarea) {
    function handleAutoResize() {
      demoAutosizeTextarea.style.height = 'auto';
      demoAutosizeTextarea.style.height = demoAutosizeTextarea.scrollHeight + 'px';
    }
    demoAutosizeTextarea.addEventListener('input', handleAutoResize);
  }

})();
