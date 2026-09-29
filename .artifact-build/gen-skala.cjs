const fs = require('fs');
const css = fs.readFileSync(__dirname + '/../styles.css', 'utf8');
const rows = [...css.matchAll(/--fs-([0-9a-z]+):\s*clamp\(([\d.]+)rem,[^,]*,\s*([\d.]+)rem\)/g)];

const rolle = {
  '2xs': 'Rechtszeile, Pflichtangabe',
  'xs': 'Fussnote, Quellenangabe',
  'sm': 'Beschriftung, Tabellenzelle',
  'base': 'Fliesstext',
  'lg': 'Lead, Fliesstext gross',
  'xl': 'Zwischenueberschrift',
  '2xl': 'Ueberschrift 3',
  '3xl': 'Ueberschrift 2',
  '4xl': 'Ueberschrift 1',
  '5xl': 'Display S',
  '6xl': 'Display M',
  '7xl': 'Display L',
  '8xl': 'Display XL',
  '9xl': 'Display 2XL',
};
const geboden = [];  // Boden greift nach dem Umbau in keine Stufe mehr ein
const px = (v) => { const n = parseFloat(v) * 16; return n % 1 ? n.toFixed(2) : String(n); };

let h = '';
for (const [, name, min, max] of rows) {
  const mn = parseFloat(min) * 16, mx = parseFloat(max) * 16;
  const flag = geboden.includes(name) && mn <= 12.001
    ? ' <span class="no">&middot; auf 12&nbsp;px angehoben</span>' : '';
  h += '        <tr><td class="m">--fs-' + name + '</td>'
     + '<td class="m r">' + px(min) + '&nbsp;px</td>'
     + '<td class="m r">' + px(max) + '&nbsp;px</td>'
     + '<td class="m r">' + (mx / mn).toFixed(2) + '&times;</td>'
     + '<td>' + (rolle[name] || '') + flag + '</td></tr>\n';
}
fs.writeFileSync(__dirname + '/skala.html', h);
console.log(rows.length + ' Stufen erzeugt');
