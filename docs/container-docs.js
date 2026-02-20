// Container Docs — Inline-Script extrahiert

(function () {
  var themeSelect    = document.getElementById('stage-theme');
  var variantSelect  = document.getElementById('stage-variant');
  var fullbleedCheck = document.getElementById('stage-fullbleed');
  var preview        = document.getElementById('stage-preview');
  var codeEl         = document.getElementById('stage-code');

  function render() {
    var theme     = themeSelect.value;
    var variant   = variantSelect.value;
    var fullbleed = fullbleedCheck.checked;

    var innerStyle = [
      'background: var(--fnd-color-background-base)',
      'min-height: 100px',
      'display: flex',
      'align-items: center',
      'justify-content: center',
      'border-radius: var(--fnd-radius-md)',
      'color: var(--fnd-color-text-secondary)',
      'font-size: var(--fnd-typography-body-s-font-size)'
    ].join('; ');

    var fullbleedEl = fullbleed
      ? '<div class="nc-hero" style="background: var(--fnd-color-background-inverse); color: var(--fnd-color-text-inverse); padding: var(--fnd-spacing-04) var(--container-pad, 0px); text-align: center; font-size: var(--fnd-typography-body-s-font-size); margin-block: var(--fnd-spacing-04);">.nc-hero &mdash; Full-Bleed Kind</div>'
      : '';

    var html = '<div style="background: var(--fnd-color-background-secondary); padding: var(--fnd-spacing-02); border-radius: var(--fnd-radius-lg);">' +
      '<div class="' + variant + '">' +
      '<div style="' + innerStyle + '">Inhalt innerhalb .' + variant.replace(' ', '.') + '</div>' +
      fullbleedEl +
      '</div></div>';

    preview.className = 'docs-stage__preview ' + theme;
    preview.innerHTML = html;

    var mainClass = '.' + variant.trim().split(' ').join('.');
    var code = fullbleed
      ? '<div class="' + variant + '">\n  <p>Inhalt mit Container-Padding</p>\n  <div class="nc-hero">\n    Full-Bleed Kind\n  </div>\n</div>'
      : '<div class="' + variant + '">\n  <p>Seiteninhalt\u2026</p>\n</div>';
    codeEl.textContent = code;
  }

  themeSelect.addEventListener('change', render);
  variantSelect.addEventListener('change', render);
  fullbleedCheck.addEventListener('change', render);
  render();
})();
