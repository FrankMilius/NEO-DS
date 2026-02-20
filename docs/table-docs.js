// Table Docs — Inline-Script extrahiert

(function () {
  var themeSelect = document.getElementById('stage-theme');
  var colSelect   = document.getElementById('stage-columns');
  var preview     = document.getElementById('stage-preview');
  var codeEl      = document.getElementById('stage-code');

  var HEADERS_MAP = {
    '3': ['Funktion', 'Starter', 'Enterprise'],
    '4': ['Funktion', 'Starter', 'Professional', 'Enterprise'],
    '5': ['Funktion', 'Starter', 'Professional', 'Business', 'Enterprise']
  };

  var ROWS_MAP = {
    '3': [
      ['Nutzer', '5', 'Unbegrenzt'],
      ['Speicher', '10 GB', '1 TB'],
      ['Support', 'E-Mail', 'Dediziert']
    ],
    '4': [
      ['Nutzer', '5', '25', 'Unbegrenzt'],
      ['Speicher', '10 GB', '100 GB', '1 TB'],
      ['API-Zugriff', 'Nein', 'Ja', 'Ja'],
      ['Support', 'E-Mail', 'Priorit\u00e4t', 'Dediziert']
    ],
    '5': [
      ['Nutzer', '5', '15', '50', 'Unbegrenzt'],
      ['Speicher', '10 GB', '50 GB', '250 GB', '1 TB'],
      ['API-Zugriff', 'Nein', 'Nein', 'Ja', 'Ja'],
      ['Support', 'E-Mail', 'E-Mail', 'Priorit\u00e4t', 'Dediziert'],
      ['SLA', '\u2014', '\u2014', '99,5\u00a0%', '99,9\u00a0%']
    ]
  };

  function render() {
    var theme = themeSelect.value;
    var cols  = colSelect.value;
    var heads = HEADERS_MAP[cols];
    var rows  = ROWS_MAP[cols];

    var headCells = heads.map(function(h){ return '<th>' + h + '</th>'; }).join('');
    var bodyRows  = rows.map(function(r){
      return '<tr>' + r.map(function(c){ return '<td>' + c + '</td>'; }).join('') + '</tr>';
    }).join('');

    var html = '<table class="nc-compare-table"><thead><tr>' + headCells + '</tr></thead><tbody>' + bodyRows + '</tbody></table>';

    preview.className = 'docs-stage__preview ' + theme;
    preview.innerHTML = html;

    codeEl.textContent = '<table class="nc-compare-table">\n  <thead>\n    <tr>\n      ' +
      heads.map(function(h){ return '<th>' + h + '</th>'; }).join('\n      ') +
      '\n    </tr>\n  </thead>\n  <tbody>\n    <tr>...</tr>\n  </tbody>\n</table>';
  }

  themeSelect.addEventListener('change', render);
  colSelect.addEventListener('change', render);
  render();
})();
