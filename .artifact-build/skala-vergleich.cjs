const STEPS = { '2xs': -3, 'xs': -2, 'sm': -1, 'base': 0, 'lg': 1, 'xl': 2, '2xl': 3, '3xl': 4,
                '4xl': 5, '5xl': 6, '6xl': 7, '7xl': 8, '8xl': 9, '9xl': 10 };
const FLOOR = 12;

function scale(base, ratio, fest) {
  const o = {};
  for (const [n, s] of Object.entries(STEPS)) {
    o[n] = fest && fest[n] !== undefined ? fest[n] : Math.max(FLOOR, base * Math.pow(ratio, s));
  }
  return o;
}
const f = (v) => (v % 1 ? v.toFixed(2) : String(v)).padStart(6);

// IST
const istMin = scale(14, 1.2), istMax = scale(18, 1.2);
// VORSCHLAG FRANK: feste Werte unten, Basis 16/18, Verhaeltnis 1,2 darueber
const fmFest = { '2xs': 12, 'xs': 13, 'sm': 14 }, fxFest = { '2xs': 14, 'xs': 15, 'sm': 16 };
const frMin = scale(16, 1.2, fmFest), frMax = scale(18, 1.2, fxFest);
// GEGENVORSCHLAG: gleiche feste Werte, aber kleineres Verhaeltnis am schmalen Ende
const gMin = scale(16, 1.15, fmFest), gMax = scale(18, 1.2, fxFest);

console.log('Stufe   IST klein  IST gross | FRANK kl.  FRANK gr. | Spanne IST  Spanne FRANK');
console.log('─'.repeat(86));
for (const n of Object.keys(STEPS)) {
  console.log(
    n.padEnd(7) + f(istMin[n]) + '   ' + f(istMax[n]) + ' |' +
    f(frMin[n]) + '   ' + f(frMax[n]) + ' |   ' +
    (istMax[n] / istMin[n]).toFixed(2) + 'x        ' + (frMax[n] / frMin[n]).toFixed(2) + 'x'
  );
}

console.log('\n\nWas der Basiswechsel 14 -> 16 mit den Stufen DARUEBER macht (schmales Ende):');
console.log('Stufe    IST     FRANK   Zuwachs | GEGEN (Verh. 1,15)');
console.log('─'.repeat(64));
for (const n of ['lg','xl','2xl','3xl','4xl','5xl','6xl','7xl','8xl','9xl']) {
  console.log(n.padEnd(8) + f(istMin[n]) + '  ' + f(frMin[n]) + '   +' +
    (((frMin[n] / istMin[n]) - 1) * 100).toFixed(1) + ' %  |' + f(gMin[n]));
}

console.log('\n\nFluide Spanne (wie stark waechst eine Stufe vom Handy zum Desktop):');
console.log('Stufe    IST      FRANK    GEGENVORSCHLAG');
console.log('─'.repeat(50));
for (const n of ['base','lg','2xl','4xl','6xl','9xl']) {
  console.log(n.padEnd(8) + (istMax[n]/istMin[n]).toFixed(2) + 'x    ' +
    (frMax[n]/frMin[n]).toFixed(2) + 'x     ' + (gMax[n]/gMin[n]).toFixed(2) + 'x');
}

console.log('\n\n9xl auf einem 320-px-Schirm, als Anteil der Viewportbreite:');
for (const [l, v] of [['IST', istMin['9xl']], ['FRANK', frMin['9xl']], ['GEGEN', gMin['9xl']]]) {
  console.log('  ' + l.padEnd(7) + v.toFixed(1) + ' px  =  ' + ((v / 320) * 100).toFixed(1) + ' % der Breite');
}

console.log('\n\nGreift der 12-px-Boden noch ein?');
for (const [l, mn, mx] of [['IST', istMin, istMax], ['FRANK', frMin, frMax]]) {
  const akt = Object.keys(STEPS).filter(n => {
    const roh = (l === 'IST' ? (n2 => 14 * Math.pow(1.2, STEPS[n2])) : (n2 => 16 * Math.pow(1.2, STEPS[n2])))(n);
    return roh < FLOOR && mn[n] === FLOOR;
  });
  console.log('  ' + l.padEnd(7) + (akt.length ? 'ja, bei ' + akt.join(', ') : 'nein — nur noch Schutzgelaender'));
}
