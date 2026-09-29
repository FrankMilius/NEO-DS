const fs = require('fs');
const css = fs.readFileSync(__dirname + '/../styles.css', 'utf8');

// Die echten fluiden Deklarationen mitnehmen, damit die Muster im Artefakt
// genauso skalieren wie in Produktion — statt fester px-Werte.
const vars = [];
for (const n of ['--fluid-min-vw', '--fluid-max-vw', '--fluid-range', '--fluid-bp']) {
  const m = new RegExp(n + ':\\s*([^;]+)').exec(css);
  if (m) vars.push('    ' + n + ': ' + m[1].trim() + ';');
}
const fsDecl = {};
for (const m of css.matchAll(/(--fs-([0-9a-z]+)):\s*(clamp\([^;]+\))/g)) {
  fsDecl[m[2]] = m[3];
  vars.push('    ' + m[1] + ': ' + m[3] + ';');
}

const px = (s) => {
  const m = /clamp\(([\d.]+)rem,[^,]*,\s*([\d.]+)rem\)/.exec(s);
  const f = (v) => { const n = parseFloat(v) * 16; return (n % 1 ? n.toFixed(2) : String(n)).replace('.', ','); };
  return [f(m[1]), f(m[2])];
};

// Stufe, Schrift, Gewicht, Rolle, Wo es vorkommt, Mustertext
const B = 'var(--f-brand)', I = 'var(--f-info)', T = 'var(--f-tech)';
const ZEILEN = [
  ['9xl', B, 700, 'Display 2XL', 'Messewand, Großformat', 'Ebenen'],
  ['8xl', B, 700, 'Display XL', 'Plakat', 'Wissen.'],
  ['7xl', B, 700, 'Display L', 'Titelseite, Kampagnenmotiv', 'Bedeutung entsteht'],
  ['6xl', B, 700, 'Display M', 'Hero, Titelfolie', 'Intelligent Workplace'],
  ['5xl', B, 700, 'Display S', 'Abschnittsauftakt', 'Drei Dinge und ein Ereignis'],
  ['4xl', B, 700, 'Überschrift 1', 'Seitentitel', 'Wissen findet dorthin, wo gearbeitet wird'],
  ['3xl', B, 700, 'Überschrift 2', 'Kapitelüberschrift', 'Die vier Flächen'],
  ['2xl', B, 700, 'Überschrift 3', 'Abschnitt im Fließtext', 'Warum ein Papier je Bereich'],
  ['xl', B, 600, 'Zwischenüberschrift', 'Absatzgruppe, Kartentitel', 'Nie zwei gleichzeitig'],
  ['lg', I, 400, 'Lead', 'Einleitungsabsatz, Teaser', 'Ein Intelligent Workplace verbindet Menschen, Wissen und Systeme.'],
  ['base', I, 400, 'Fließtext', 'Alles, was gelesen wird', 'Er ersetzt keine der Ebenen, er macht ihre Beziehungen bedienbar — dort, wo Arbeit tatsächlich stattfindet.'],
  ['sm', I, 400, 'Beschriftung', 'Tabellenzelle, Bildunterschrift', 'Der Ausschnitt zeigt die Schnittmenge zweier Ebenen.'],
  ['xs', I, 400, 'Fußnote', 'Quellenangabe, Anmerkung', 'Gemessen nach WCAG 2.1, Stand August 2026.'],
  ['2xs', I, 400, 'Rechtszeile', 'Impressum, Pflichtangabe', '© 2026 NEOCOSMO GmbH · Alle Rechte vorbehalten'],
];

let h = '';
for (const [stufe, font, gew, rolle, wo, text] of ZEILEN) {
  const d = fsDecl[stufe];
  if (!d) { console.error('fehlt:', stufe); continue; }
  const [mn, mx] = px(d);
  const eng = ['9xl','8xl','7xl','6xl','5xl','4xl'].includes(stufe);
  const satz = eng ? 'line-height:1.02;letter-spacing:-.03em' : 'line-height:1.34;letter-spacing:-.008em';
  h += '  <div class="stufe">\n'
     + '    <div class="stufe-meta">\n'
     + '      <p class="stufe-tok">--fs-' + stufe + '</p>\n'
     + '      <p class="stufe-px">' + mn + ' &rarr; ' + mx + '&nbsp;px</p>\n'
     + '      <p class="stufe-rolle">' + rolle + '</p>\n'
     + '      <p class="stufe-wo">' + wo + '</p>\n'
     + '    </div>\n'
     + '    <div class="stufe-probe"><span style="font-family:' + font + ';font-weight:' + gew
     + ';font-size:var(--fs-' + stufe + ');' + satz + '">' + text + '</span></div>\n'
     + '  </div>\n';
}

fs.writeFileSync(__dirname + '/leiter.html', h);
fs.writeFileSync(__dirname + '/leiter-vars.css', vars.join('\n'));
console.log(ZEILEN.length + ' Stufen, ' + vars.length + ' Variablen uebernommen');
