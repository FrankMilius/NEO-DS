(function () {
  'use strict';

  var body = document.body;
  var themeToggle = document.querySelector('[data-theme-toggle]');
  var bTarget = document.querySelector('[data-demo="b-target"]');
  var cTarget = document.querySelector('[data-demo="c-target"]');
  var progressRange = document.getElementById('progress-range');
  var progressValue = document.getElementById('progress-value');

  function setButtonState(button, options) {
    if (!button) return;

    var loading = !!options.loading;
    var state = options.state || '';
    var label = options.label || '';
    var progress = typeof options.progress === 'number' ? options.progress : null;

    button.dataset.loading = loading ? 'true' : 'false';
    button.setAttribute('aria-busy', loading ? 'true' : 'false');

    if (state) {
      button.dataset.state = state;
    } else {
      button.removeAttribute('data-state');
    }

    if (progress !== null) {
      button.style.setProperty('--nc-button-progress', progress + '%');
    }

    var textEl = button.querySelector('.nc-button__label');
    if (textEl && label) textEl.textContent = label;
  }

  function setProgress(value) {
    if (!bTarget || !progressValue) return;
    bTarget.style.setProperty('--nc-button-progress', value + '%');
    progressValue.textContent = value + '%';
  }

  function flashState(button, config, timeoutMs) {
    setButtonState(button, config);
    window.setTimeout(function () {
      setButtonState(button, {
        loading: false,
        state: '',
        label: config.resetLabel || 'Speichern'
      });
    }, timeoutMs || 1200);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      if (body.classList.contains('neo-light-theme')) {
        body.classList.remove('neo-light-theme');
        body.classList.add('neo-dark-theme');
      } else {
        body.classList.remove('neo-dark-theme');
        body.classList.add('neo-light-theme');
      }
    });
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-demo-action]');
    if (!trigger) return;

    var action = trigger.getAttribute('data-demo-action');

    if (action === 'loading') {
      setButtonState(bTarget, { loading: true, state: '', label: 'Speichern' });
    }

    if (action === 'success') {
      flashState(bTarget, { loading: false, state: 'success', label: 'Gespeichert', resetLabel: 'Speichern' }, 1400);
    }

    if (action === 'error') {
      flashState(bTarget, { loading: false, state: 'error', label: 'Fehler', resetLabel: 'Speichern' }, 1300);
    }

    if (action === 'reset') {
      setButtonState(bTarget, { loading: false, state: '', label: 'Speichern' });
      if (progressRange) setProgress(Number(progressRange.value));
    }

    if (action === 'c-loading') {
      setButtonState(cTarget, { loading: true, state: '', label: 'Absenden' });
    }

    if (action === 'c-success') {
      flashState(cTarget, { loading: false, state: 'success', label: 'Erfolgreich', resetLabel: 'Absenden' }, 1400);
    }

    if (action === 'c-error') {
      flashState(cTarget, { loading: false, state: 'error', label: 'Bitte prüfen', resetLabel: 'Absenden' }, 1300);
    }
  });

  if (progressRange) {
    progressRange.addEventListener('input', function () {
      setProgress(Number(progressRange.value));
    });
    setProgress(Number(progressRange.value));
  }

  document.addEventListener('pointerdown', function (event) {
    var target = event.target;
    if (!target || !target.closest) return;

    var button = target.closest('.nc-button--micro-a, .nc-button--micro-b, .nc-button--micro-c');
    if (!button) return;
    if (button.matches(':disabled, [aria-disabled="true"], [data-loading="true"]')) return;

    var rect = button.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var size = Math.max(rect.width, rect.height) * 1.2;

    button.style.setProperty('--nc-ripple-x', x + 'px');
    button.style.setProperty('--nc-ripple-y', y + 'px');
    button.style.setProperty('--nc-ripple-size', size + 'px');

    button.classList.remove('is-rippling');
    void button.offsetWidth;
    button.classList.add('is-rippling');

    if (button._rippleTimeout) {
      clearTimeout(button._rippleTimeout);
    }
    button._rippleTimeout = setTimeout(function () {
      button.classList.remove('is-rippling');
    }, 560);
  });
})();
