// ==========================================================================
// Docs Stage Controls — DS-Komponenten ↔ Hidden Input Sync
// ==========================================================================
// Generisches Script: Verbindet DS-Komponenten (nc-segmented-control,
// nc-switch, nc-chip-group, nc-select) mit versteckten nativen Inputs.
// Bestehende per-Seite JS-Dateien arbeiten weiter über getElementById().
// ==========================================================================

(function () {
  'use strict';

  // -----------------------------------------------------------------------
  // Hilfsfunktionen
  // -----------------------------------------------------------------------

  /**
   * Dispatcht ein natives 'change'-Event auf einem Element.
   */
  function dispatchChange(el) {
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // -----------------------------------------------------------------------
  // Segmented Control — Keyboard + Click
  // -----------------------------------------------------------------------

  function initSegmentedControl(container) {
    var items = container.querySelectorAll('.nc-segmented-control__item');
    if (!items.length) return;

    // Zugehöriges hidden input finden
    var targetId = container.getAttribute('data-stage-target');
    var hiddenInput = targetId ? document.getElementById(targetId) : null;

    function activate(item) {
      items.forEach(function (it) {
        it.setAttribute('aria-checked', 'false');
        it.setAttribute('tabindex', '-1');
      });
      item.setAttribute('aria-checked', 'true');
      item.setAttribute('tabindex', '0');
      item.focus();

      // Hidden input synchronisieren
      if (hiddenInput) {
        var val = item.getAttribute('data-value');
        if (hiddenInput.tagName === 'SELECT') {
          hiddenInput.value = val;
        } else if (hiddenInput.type === 'checkbox') {
          hiddenInput.checked = val === 'true';
        } else {
          hiddenInput.value = val;
        }
        dispatchChange(hiddenInput);
      }
    }

    // Click
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        activate(item);
      });
    });

    // Keyboard (Roving Tabindex)
    container.addEventListener('keydown', function (e) {
      var current = container.querySelector('[aria-checked="true"]');
      var idx = Array.prototype.indexOf.call(items, current);
      var next = -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        next = (idx + 1) % items.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        next = (idx - 1 + items.length) % items.length;
      } else if (e.key === 'Home') {
        next = 0;
      } else if (e.key === 'End') {
        next = items.length - 1;
      }

      if (next >= 0) {
        e.preventDefault();
        activate(items[next]);
      }
    });
  }

  // -----------------------------------------------------------------------
  // Switch (Input-Pattern) — Sync mit hidden input
  // -----------------------------------------------------------------------

  function initSwitch(wrapper) {
    var input = wrapper.querySelector('.nc-switch__input');
    if (!input) return;

    var targetId = wrapper.getAttribute('data-stage-target');
    var hiddenInput = targetId ? document.getElementById(targetId) : null;

    if (hiddenInput) {
      input.addEventListener('change', function () {
        hiddenInput.checked = input.checked;
        dispatchChange(hiddenInput);
      });
    }
  }

  // -----------------------------------------------------------------------
  // Chip-Group — Single-Select (radio-artig)
  // -----------------------------------------------------------------------

  function initChipGroup(group) {
    var chips = group.querySelectorAll('.nc-chip');
    if (!chips.length) return;

    var targetId = group.getAttribute('data-stage-target');
    var hiddenInput = targetId ? document.getElementById(targetId) : null;

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        // Alle deselektieren
        chips.forEach(function (c) {
          c.setAttribute('aria-pressed', 'false');
          c.classList.remove('nc-chip--selected');
        });
        // Diesen selektieren
        chip.setAttribute('aria-pressed', 'true');
        chip.classList.add('nc-chip--selected');

        // Hidden input synchronisieren
        if (hiddenInput) {
          hiddenInput.value = chip.getAttribute('data-value');
          dispatchChange(hiddenInput);
        }
      });
    });
  }

  // -----------------------------------------------------------------------
  // nc-select — Sync (DS-Select → hidden Select)
  // -----------------------------------------------------------------------

  function initDsSelect(select) {
    var targetId = select.getAttribute('data-stage-target');
    var hiddenInput = targetId ? document.getElementById(targetId) : null;

    if (hiddenInput) {
      select.addEventListener('change', function () {
        hiddenInput.value = select.value;
        dispatchChange(hiddenInput);
      });
    }
  }

  // -----------------------------------------------------------------------
  // Copy HTML — Kopiert innerHTML der Preview-Area
  // -----------------------------------------------------------------------

  function initCopyButton(btn, stageEl) {
    var preview = stageEl.querySelector('.docs-stage__preview');
    if (!preview) return;

    btn.addEventListener('click', function () {
      var html = preview.innerHTML.trim();
      // Einrücken für Lesbarkeit
      var formatted = html
        .replace(/></g, '>\n<')
        .replace(/^\s+/gm, function (m) { return m; });

      navigator.clipboard.writeText(formatted).then(function () {
        btn.classList.add('docs-stage__action-btn--copied');
        var orig = btn.innerHTML;
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        setTimeout(function () {
          btn.classList.remove('docs-stage__action-btn--copied');
          btn.innerHTML = orig;
        }, 1500);
      });
    });
  }

  // -----------------------------------------------------------------------
  // Reset — Alle Controls auf Defaultwerte zurücksetzen
  // -----------------------------------------------------------------------

  function initResetButton(btn, stageEl) {
    btn.addEventListener('click', function () {
      // Segmented Controls: data-default oder erstes Item aktivieren
      stageEl.querySelectorAll('[data-stage-control="segmented"]').forEach(function (sc) {
        var items = sc.querySelectorAll('.nc-segmented-control__item');
        var defaultVal = sc.getAttribute('data-default');
        var target = null;

        if (defaultVal) {
          items.forEach(function (it) {
            if (it.getAttribute('data-value') === defaultVal) target = it;
          });
        }
        if (!target) target = items[0];
        if (target) target.click();
      });

      // Switches: Auf unchecked zurücksetzen
      stageEl.querySelectorAll('[data-stage-control="switch"]').forEach(function (sw) {
        var input = sw.querySelector('.nc-switch__input');
        if (input && input.checked) {
          input.checked = false;
          dispatchChange(input);
          // Hidden input auch zurücksetzen
          var targetId = sw.getAttribute('data-stage-target');
          var hidden = targetId ? document.getElementById(targetId) : null;
          if (hidden) {
            hidden.checked = false;
            dispatchChange(hidden);
          }
        }
      });

      // Chip-Groups: data-default oder erstes Chip aktivieren
      stageEl.querySelectorAll('[data-stage-control="chips"]').forEach(function (cg) {
        var chips = cg.querySelectorAll('.nc-chip');
        var defaultVal = cg.getAttribute('data-default');
        var target = null;

        if (defaultVal) {
          chips.forEach(function (c) {
            if (c.getAttribute('data-value') === defaultVal) target = c;
          });
        }
        if (!target) target = chips[0];
        if (target) target.click();
      });

      // nc-select: Auf data-default oder erste Option zurücksetzen
      stageEl.querySelectorAll('[data-stage-control="select"]').forEach(function (sel) {
        var defaultVal = sel.getAttribute('data-default');
        if (defaultVal) {
          sel.value = defaultVal;
        } else {
          sel.selectedIndex = 0;
        }
        // Hidden input synchronisieren
        var targetId = sel.getAttribute('data-stage-target');
        var hidden = targetId ? document.getElementById(targetId) : null;
        if (hidden) {
          hidden.value = sel.value;
          dispatchChange(hidden);
        }
      });
    });
  }

  // -----------------------------------------------------------------------
  // Hauptinitialisierung
  // -----------------------------------------------------------------------

  function initStageControls(stageEl) {
    // Segmented Controls
    stageEl.querySelectorAll('[data-stage-control="segmented"]').forEach(function (sc) {
      initSegmentedControl(sc);
    });

    // Switches
    stageEl.querySelectorAll('[data-stage-control="switch"]').forEach(function (sw) {
      initSwitch(sw);
    });

    // Chip-Groups
    stageEl.querySelectorAll('[data-stage-control="chips"]').forEach(function (cg) {
      initChipGroup(cg);
    });

    // DS-Selects
    stageEl.querySelectorAll('[data-stage-control="select"]').forEach(function (sel) {
      initDsSelect(sel);
    });

    // Action-Buttons
    var copyBtn = stageEl.querySelector('[data-stage-action="copy"]');
    if (copyBtn) initCopyButton(copyBtn, stageEl);

    var resetBtn = stageEl.querySelector('[data-stage-action="reset"]');
    if (resetBtn) initResetButton(resetBtn, stageEl);
  }

  // -----------------------------------------------------------------------
  // Auto-Init bei DOMContentLoaded
  // -----------------------------------------------------------------------

  function init() {
    document.querySelectorAll('.docs-stage').forEach(initStageControls);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export für manuellen Aufruf
  window.initStageControls = initStageControls;

})();
