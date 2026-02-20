// Notification Docs — Inline-Script extrahiert

// Notification Docs: Live Demo
(function () {
  const themeSelect   = document.getElementById('stage-theme');
  const showCheck     = document.getElementById('stage-show');
  const secondaryCheck = document.getElementById('stage-secondary');
  const closeCheck    = document.getElementById('stage-close');
  const preview       = document.getElementById('stage-preview');
  const codeEl        = document.getElementById('stage-code');

  function closeIcon() {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  }

  function render() {
    const theme     = themeSelect.value;
    const isShow    = showCheck.checked;
    const hasSecondary = secondaryCheck.checked;
    const hasClose  = closeCheck.checked;

    const showClass = isShow ? ' show' : '';
    const secondaryHtml = hasSecondary
      ? `\n    <a href="#" class="secondary">Details anzeigen</a>`
      : '';
    const closeHtml = hasClose
      ? `\n  <a href="#" class="icon-button" aria-label="Schlie&szlig;en">\n    <span class="icon-only" aria-hidden="true">${closeIcon()}</span>\n  </a>`
      : '';

    preview.innerHTML = `
      <div class="${theme}" style="width: 100%;">
        <div class="notification${showClass}" role="status" aria-live="polite">
          <div class="notification-body">
            <p><strong>Wartungsfenster:</strong> Am Freitag, 21. Februar, von 22:00 bis 02:00 Uhr steht das System nicht zur Verf&uuml;gung.</p>${secondaryHtml}
          </div>${closeHtml}
        </div>
        ${!isShow ? '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid); font-size: var(--fs-sm);">Banner ist versteckt (kein .show)</p>' : ''}
      </div>`;

    // Attach close handler
    const btn = preview.querySelector('.icon-button');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showCheck.checked = false;
        render();
      });
    }

    // Code output
    const codeLines = [];
    codeLines.push(`<div class="notification${showClass}" role="status" aria-live="polite">`);
    codeLines.push(`  <div class="notification-body">`);
    codeLines.push(`    <p><strong>Wartungsfenster:</strong> Am Freitag, 21. Februar, ...</p>`);
    if (hasSecondary) codeLines.push(`    <a href="#" class="secondary">Details anzeigen</a>`);
    codeLines.push(`  </div>`);
    if (hasClose) {
      codeLines.push(`  <a href="#" class="icon-button" aria-label="Schlie\u00dfen">`);
      codeLines.push(`    <span class="icon-only" aria-hidden="true"><svg>...</svg></span>`);
      codeLines.push(`  </a>`);
    }
    codeLines.push(`</div>`);
    codeEl.textContent = codeLines.join('\n');
  }

  themeSelect.addEventListener('change', render);
  showCheck.addEventListener('change', render);
  secondaryCheck.addEventListener('change', render);
  closeCheck.addEventListener('change', render);

  render();
})();
