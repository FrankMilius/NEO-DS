const fs = require('fs'), path = require('path');
const W = path.resolve(__dirname, '..');
const OUT = path.join(W, 'node_modules/@tabler/icons/icons/outline');
const FIL = path.join(W, 'node_modules/@tabler/icons/icons/filled');

const lies = (dir, name) => {
  const f = path.join(dir, name + '.svg');
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8').replace(/\s+/g, ' ').trim() : null;
};
// Groesse und Farbe von aussen steuerbar machen
const setze = (svg, px) => svg
  .replace(/width="24"/, `width="${px}"`)
  .replace(/height="24"/, `height="${px}"`)
  .replace(/stroke="currentColor"/, 'stroke="currentColor"');

const teile = {};

// 10.5 — Stilbeleg: echte Tabler-Icons, 24 px
teile['stil'] = ['search','users','file-text','settings','bell','chart-line','folder','shield-check']
  .map(n => { const s = lies(OUT, n); return s ? `<div class="ic"><div class="ic-b">${setze(s,24)}</div><span class="ic-n">${n}</span></div>` : ''; })
  .join('\n      ');

// 10.6 — dieselbe Ikone in sechs Groessen, Strichstaerke skaliert mit
const px = [16,20,24,28,32,36];
teile['stroke'] = px.map(p => {
  const s = lies(OUT, 'settings');
  return `<div class="ic"><div class="ic-b" style="min-height:52px">${setze(s,p)}</div><span class="ic-n">${p} px<br><b>${(1.5*p/24).toFixed(2).replace('.',',')}</b></span></div>`;
}).join('\n      ');

// 10.8 — Outline gegen Filled, beide echt aus dem Paket
teile['fill'] = ['heart','star','bell','circle-check'].map(n => {
  const o = lies(OUT, n), f = lies(FIL, n);
  return `<div class="ic"><div class="ic-b">${o ? setze(o,28) : '—'}</div><span class="ic-n">${n}<br>outline</span></div>`
       + `<div class="ic"><div class="ic-b">${f ? setze(f,28) : '<span style="font-size:10px;color:var(--faint)">fehlt</span>'}</div><span class="ic-n">${n}-filled<br><b style="color:var(--signal)">nicht gesynct</b></span></div>`;
}).join('\n      ');

// 10.9 — vier der 202 eigenen Icons, wie sie im Manifest liegen
const man = require(path.join(W, 'data/icons-manifest.json'));
const eigen = man.icons.filter(x => !x.source);
teile['eigen'] = ['piipe-signet','rocks','candle--candled','mourning']
  .map(n => { const e = eigen.find(x => x.name === n);
    return e ? `<div class="ic"><div class="ic-b">${(e.svg||'').replace(/\s+/g,' ').trim().replace(/width="24px"/,'width="26"').replace(/height="24px"/,'height="26"')}</div><span class="ic-n">${n}</span></div>` : ''; })
  .join('\n      ');

fs.writeFileSync(path.join(__dirname, 'icon-figs.json'), JSON.stringify(teile));
console.log('Bausteine:', Object.keys(teile).join(', '));
console.log('outline vorhanden:', fs.readdirSync(OUT).length, '| filled:', fs.readdirSync(FIL).length);
