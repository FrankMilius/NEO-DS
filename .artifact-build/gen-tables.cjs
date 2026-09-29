const fs = require('fs');
const { contrast } = require('./oklch.cjs');
const D = JSON.parse(fs.readFileSync(__dirname + '/mono-data.json', 'utf8'));
const G = D.leitern.graphit.shades, A = D.accent, S = D.system;

function res(v, side) {
  if (!v) return v;
  let m = /var\(--fnd-neutral-(\d+)\)/.exec(v);            if (m) return G[m[1]];
  m = /var\(--fnd-accent-(\d+)\)/.exec(v);                 if (m) return A[m[1]];
  m = /var\(--fnd-primitive-(\w+)-(\d+)\)/.exec(v);        if (m && S[m[1]]) return S[m[1]][m[2]];
  if (/var\(--surface-card\)/.test(v)) return res(D[side]['--surface-card'], side);
  return v;
}

const groups = {
  'Flächen · Modell C — Website': ['--surface-stage', '--surface-card'],
  'Flächen · Modell A — Anwendung': ['--surface-base', '--surface-01', '--surface-02', '--surface-03', '--surface-sunken'],
  'Text': ['--text-primary', '--text-secondary', '--text-tertiary', '--text-inverse', '--text-disabled'],
  'Rahmen': ['--border-subtle', '--border-control', '--border-emphasis'],
  'Bedienung': ['--interactive-default', '--interactive-hover', '--interactive-active', '--interactive-on', '--interactive-quiet', '--interactive-quiet-hover'],
  'Akzent': ['--accent-surface', '--accent-surface-hover', '--accent-surface-active', '--accent-on', '--accent-line', '--accent-underline', '--accent-text'],
  'Rückmeldung · Systempaletten Stufe 500': ['--feedback-success', '--feedback-warning', '--feedback-danger', '--feedback-info'],
  'Fokus': ['--focus-inner', '--focus-outer'],
  'Erhebung': ['--elevation-0', '--elevation-1', '--elevation-2', '--elevation-3', '--elevation-1-surface', '--elevation-2-surface', '--elevation-3-surface'],
};

const REL = /text-(primary|secondary|tertiary|disabled)|border-|accent-(line|text)|feedback|interactive-default/;
let html = '';

for (const title of Object.keys(groups)) {
  html += '\n  <h3 class="grp">' + title + '</h3>\n  <div class="scroll">\n    <table>\n'
        + '      <thead><tr><th>Token</th><th>Hell</th><th>Dunkel</th><th class="num">Kontrast auf der Karte</th></tr></thead>\n      <tbody>\n';
  for (const k of groups[title]) {
    const lv = D.light[k], dv = D.dark[k];
    const lr = res(lv, 'light'), dr = res(dv, 'dark');
    const isCol = /^#/.test(String(lr)) && /^#/.test(String(dr));
    const lb = res(D.light['--surface-card'], 'light'), db = res(D.dark['--surface-card'], 'dark');
    const rel = REL.test(k);
    let c = '—';
    if (isCol && rel) {
      const cl = contrast(lr, lb), cd = contrast(dr, db);
      const flag = cl < 3.0 ? ' class="under"' : '';
      c = '<span' + flag + '>' + cl.toFixed(2) + '</span> / ' + cd.toFixed(2);
    }
    const cell = (v, r) => /^#/.test(String(r))
      ? '<span class="val"><span class="dot" style="background:' + r + '"></span>' + r + '</span>'
        + (v !== r ? '<span class="ref">' + v.replace(/^var\(--/, '').replace(/\)$/, '') + '</span>' : '')
      : '<span class="ref only">' + v + '</span>';
    html += '        <tr><td><code>' + k.replace(/^--/, '') + '</code></td><td>' + cell(lv, lr)
          + '</td><td>' + cell(dv, dr) + '</td><td class="num">' + c + '</td></tr>\n';
  }
  html += '      </tbody>\n    </table>\n  </div>\n';
  if (title.indexOf('Rückmeldung') === 0) {
    html += '  <p class="note">Die 500er-Stufen sind <b>Flächenfarben</b>. Als Schrift auf der hellen Karte bleiben alle vier unter der AA-Schwelle von 4,5 — Warning mit <b>2,31</b> auch unter der 3,0 für Bedienelemente. Im Dunkeln tragen sie. Schwarze Tinte <b>auf</b> der Fläche erreicht 5,32 bis 7,74; dort funktionieren die Werte einwandfrei.</p>\n';
  }
}

fs.writeFileSync(__dirname + '/mono-tables.html', html);
console.log('Tabellen erzeugt:', html.length, 'Bytes');
