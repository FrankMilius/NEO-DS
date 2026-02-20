// Section Docs — Inline-Script extrahiert

(function () {
  var themeSelect = document.getElementById('stage-theme');
  var gridSelect  = document.getElementById('stage-grid');
  var countSelect = document.getElementById('stage-count');
  var preview     = document.getElementById('stage-preview');
  var codeEl      = document.getElementById('stage-code');

  var GRID_LABELS = {
    'nc-feature-grid':  'Feature',
    'nc-benefit-grid':  'Vorteil',
    'nc-usecase-grid':  'Use Case',
    'nc-news-grid':     'News',
    'nc-metric-grid':   'Metrik',
    'nc-facts-grid':    'Fakt',
    'nc-pricing-grid':  'Plan'
  };

  function render() {
    var theme = themeSelect.value;
    var grid  = gridSelect.value;
    var count = parseInt(countSelect.value, 10);
    var label = GRID_LABELS[grid] || 'Eintrag';

    var itemStyle = [
      'background: var(--fnd-color-background-secondary)',
      'padding: var(--fnd-spacing-05)',
      'border-radius: var(--fnd-radius-lg)',
      'text-align: center',
      'color: var(--fnd-color-text-secondary)',
      'font-size: var(--fnd-typography-body-s-font-size)'
    ].join('; ');

    var items = '';
    for (var i = 1; i <= count; i++) {
      items += '<div style="' + itemStyle + '">' + label + ' ' + i + '</div>';
    }

    var html = '<div class="' + grid + '">' + items + '</div>';

    preview.className = 'docs-stage__preview ' + theme;
    preview.innerHTML = html;

    var codeItems = '';
    for (var j = 1; j <= count; j++) {
      codeItems += '\n  <div>' + label + ' ' + j + '</div>';
    }
    codeEl.textContent = '<div class="' + grid + '">' + codeItems + '\n</div>';
  }

  themeSelect.addEventListener('change', render);
  gridSelect.addEventListener('change', render);
  countSelect.addEventListener('change', render);
  render();
})();
