// NEO Brand 009 → 010: Gruenfamilie, vier Welten, Kombinationsmatrix,
// Layoutschemata, Pill als Kantenform, Kapitel 15 Application.
// Arbeitet mit Ankern und bricht ab, statt eine halb umgebaute Datei zu
// hinterlassen — wie integriere.py. Danach: python3 reinigen.py.
const fs = require('fs');
const P = __dirname + '/brand-neu.html';
let s = fs.readFileSync(P, 'utf8');
const fehler = [];
const rep = (alt, neu, mal = 1) => { const n = s.split(alt).length - 1; if (n !== mal) { fehler.push(`${n}× statt ${mal}×: ${alt.slice(0, 70)}`); return; } s = s.split(alt).join(neu); };
const vor = (anker, block) => rep(anker, block + '\n' + anker);
const nach = (anker, block) => rep(anker, anker + '\n' + block);

// ── Kontrast ──────────────────────────────────────────────────────────────
const lum = h => { const c = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4)); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
const K = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const f1 = n => n.toFixed(1).replace('.', ',');
const sw = (name, hex) => `<div><div class="chip" style="background:#${hex}"></div><div class="info"><p class="n">${name}</p><p class="v">#${hex}</p></div></div>`;

// ── 1 Version ─────────────────────────────────────────────────────────────
rep('<title>NEO Brand 009</title>', '<title>NEO Brand 010</title>');
rep('<p class="code">NEO Brand 009 · Living Document · 01.09.2026</p>', '<p class="code">NEO Brand 010 · Living Document · 05.09.2026</p>');
rep('<p><b>NEO Brand 009</b> — Living Document, 1. September 2026.', '<p><b>NEO Brand 010</b> — Living Document, 5. September 2026.');

// ── 2 Kapitel 04: 4.2.c Gruenfamilie, 4.2.d Vier Welten ───────────────────
const forest = { 100: 'e7eced', 200: 'ced9da', 300: 'aabdbe', 400: '799799', 500: '497174', 600: '29585c', 700: '16494d', 800: '0c4146', 900: '082e31', 950: '051d20' };
const mint = { 50: 'f5fff0', 100: 'efffe6', 200: 'e1f0d8', 300: 'd0dec8', 400: 'b3bfad', 500: '949e8f', 600: '788073', 700: '5b6157', 800: '3e423c', 900: '262925', 950: '161715' };
const gruen = `
  <div class="subhead"><span>4.2.c</span><h3>Grünfamilie: Mint und Forest</h3></div>
  <div class="law">
    <p>Grün ist bei NEO nicht nur das Signal. Es hat ein Papier, einen Grund und eine Leiter dazwischen.</p>
    <p class="src">Ergänzt in Fassung 010, nach der Analyse der Vorlagen Horizon und Calypso</p>
  </div>
  <div class="prose">
    <p>Bisher trat Grün ausschließlich als Lime auf: ein Signal, das auf jedem Papier steht und nie Fläche wird. Der Vergleich mit zwei Markenhandbuch-Vorlagen (Made by Circular, Calypso und Horizon) hat gezeigt, was dadurch fehlte — Grün <b>als Fläche</b>, mit einem tiefen Grund, auf dem das Signal liegt, und einem hellen Papier, das einen Abschnitt tragen kann. Beides gibt es jetzt. <b>Forest</b> (<code>#0c4146</code>) ist ein zweiter tiefer Grund neben Graphit 950, <b>Mint</b> (<code>#efffe6</code>) ein sechstes Papier neben den fünf aus 4.2. Beide Werte sind gesetzt, nicht gemischt; die Leitern sind daraus abgeleitet: Forest liegt auf Stufe 800, Mint auf Stufe 100.</p>
    <p>Die Familie hat vier Rollen, und jede hat einen Wert: <b>Papier</b> Mint 100, <b>Grund</b> Forest 800, <b>Signal</b> Lime 500, <b>Text auf dem Grund</b> Mint 100 oder Lime 200. Text auf Mint nimmt Graphit 950 oder Forest 600 — <b>nicht Lime 700</b>, das dort nur 4,2:1 erreicht. Die Proportion folgt der Regel aus 4.5, hier als 60 Grund, 30 Zweitfläche, 10 Signal.</p>
  </div>

  <div style="display:flex;align-items:baseline;gap:15px;margin:36px 0 14px;flex-wrap:wrap"><h4 style="font-family:var(--f-brand);font-weight:700;font-size:19.5px;margin:0;letter-spacing:-.015em">Forest</h4><span style="font-size:14.5px;color:var(--muted)">Grund · Stufe 800 ist der Wert aus dem Color Picker</span></div>
  <div class="sw">
    ${Object.entries(forest).map(([st, h]) => sw('Forest ' + st, h)).join('\n    ')}
  </div>
  <p class="note">Lime 500 auf Forest: <b>${f1(K('37e93d', '0c4146'))}</b> · Mint auf Forest: <b>${f1(K('efffe6', '0c4146'))}</b> · Weiß auf Forest: <b>${f1(K('ffffff', '0c4146'))}</b> · Forest 300 als Mono-Farbe auf Forest: ${f1(K('aabdbe', '0c4146'))}</p>

  <div style="display:flex;align-items:baseline;gap:15px;margin:36px 0 14px;flex-wrap:wrap"><h4 style="font-family:var(--f-brand);font-weight:700;font-size:19.5px;margin:0;letter-spacing:-.015em">Mint</h4><span style="font-size:14.5px;color:var(--muted)">Papier · Stufe 100 ist der Wert aus dem Color Picker</span></div>
  <div class="sw">
    ${Object.entries(mint).map(([st, h]) => sw('Mint ' + st, h)).join('\n    ')}
  </div>
  <p class="note">Graphit 950 auf Mint: <b>${f1(K('161816', 'efffe6'))}</b> · Forest 600 auf Mint: <b>${f1(K('29585c', 'efffe6'))}</b> · Lime 700 auf Mint: <span style="color:var(--bad)">${f1(K('218c25', 'efffe6'))}</span>, kein Textwert · Lime 500 auf Mint: ${f1(K('37e93d', 'efffe6'))}, nur als Fläche mit Graphit 950 darauf</p>

  <div class="grid g3">
    <div class="card"><p class="lbl">Regel</p><h3>Forest ist ein Grund, kein Theme</h3><p>Forest trägt Titel, Trenner, Abschluss und Kapitelaufmacher — wie Graphit 950. Inhaltsseiten laufen weiter auf Papier. Damit bleibt 4.14 in Kraft: dunkle Flächen sind Einzelelemente, kein Modus.</p></div>
    <div class="card"><p class="lbl">Regel</p><h3>Mint ist ein Papier wie die anderen</h3><p>Ein Papier je Abschnitt, nie zwei gleichzeitig. Mint ist dem Bereich <em>Wissen</em> zugeordnet (4.2.d) und tritt in Folien für Karten, Menschen und Belege auf.</p></div>
    <div class="card"><p class="lbl">Grenze</p><h3>Ein Signal, auch hier</h3><p>Lime bleibt das einzige Signal. Auf Forest liegt es als Fläche oder Marke, nie als Fließtext; auf Mint nur als Fläche mit dunkler Schrift. Zwei Grüntöne nebeneinander ohne den Grund dazwischen sind keine Familie, sondern ein Unfall.</p></div>
  </div>

  <div class="subhead"><span>4.2.d</span><h3>Vier Welten aus den Ebenenfarben</h3></div>
  <div class="prose">
    <p>Die Ebenenfarben aus Kapitel 05 — <b>Menschen</b> Orange, <b>Wissen</b> Grün, <b>Systeme</b> Pink, <b>Daten</b> Blau — waren bis 009 Einzelwerte für Knoten und Diagramme. Calypso zeigt, was eine Sekundärfarbe leistet, wenn sie drei Stufen hat: eine helle als Papier, eine satte als Fläche, eine tiefe als Grund. Jede Ebenenfarbe bekommt darum eine <b>Welt</b> aus drei Werten, alle aus den Reserveleitern (4.2.b) oder der Grünfamilie. Die Regeln aus 4.2 gelten unverändert: eine Welt je Komposition, nie zwei gleichzeitig, nur in hellen Themes — der tiefe Wert ist wie Forest ein Grund für Einzelelemente.</p>
  </div>
  <div class="tbl">
    <table>
      <thead><tr><th scope="col">Welt</th><th scope="col">Ebenenfarbe</th><th scope="col">Hell · Papier</th><th scope="col">Satt · Fläche</th><th scope="col">Tief · Grund</th><th scope="col" class="r">Weiß auf tief</th><th scope="col" class="r">Graphit 950 auf hell</th><th scope="col" class="r">Graphit 950 auf satt</th></tr></thead>
      <tbody>
${[['Menschen', 'f39100', ['Mustard 100', 'fff5d1'], ['Dark Orange 500', 'ff8c00'], ['Dark Orange 900', '331c00']], ['Wissen', 'a1c513', ['Mint 100', 'efffe6'], ['Lime 500', '37e93d'], ['Forest 800', '0c4146']], ['Systeme', 'e5007d', ['Pink 100', 'ffddf5'], ['Pink 500', 'ff53cb'], ['Burgundy 500', '800020']], ['Daten', '009ee3', ['Neo Blue 100', 'ccecf9'], ['Neo Blue 500', '009ee3'], ['Neo Darkblue 500', '002049']]].map(([w, e, h, sa, t]) => `        <tr><td><b>${w}</b></td><td class="m"><span class="swatch" style="background:#${e}"></span> #${e}</td><td class="m"><span class="swatch" style="background:#${h[1]}"></span> ${h[0]}</td><td class="m"><span class="swatch" style="background:#${sa[1]}"></span> ${sa[0]}</td><td class="m"><span class="swatch" style="background:#${t[1]}"></span> ${t[0]}</td><td class="m r">${f1(K('ffffff', t[1]))}</td><td class="m r">${f1(K('161816', h[1]))}</td><td class="m r">${f1(K('161816', sa[1]))}</td></tr>`).join('\n')}
      </tbody>
    </table>
  </div>
  <p class="note">Satte Werte tragen nur dunkle Schrift; Dark Orange 500 erreicht mit Weiß ${f1(K('ffffff', 'ff8c00'))}, mit Graphit 950 ${f1(K('161816', 'ff8c00'))}. Pink 500 auf Burgundy erreicht ${f1(K('ff53cb', '800020'))} und reicht nur für Großes. Lime auf Neo Darkblue erreicht ${f1(K('37e93d', '002049'))} — neben Forest die stärkste Zweifarb-Kombination des Systems.</p>
`;
vor('  <div class="subhead"><span>4.3</span><h3>Neutral Palette</h3></div>', gruen);

// ── 3 Kapitel 04: 4.6 Kombinationsmatrix ──────────────────────────────────
const gruende = [['Pearl', 'f2f2f2'], ['Graphit 100', 'f1f3f1'], ['Beige', 'f6f2ea'], ['Ivory', 'f3f3ea'], ['Taupe', 'f8f1eb'], ['Mint', 'efffe6'], ['Graphit 950', '161816'], ['Forest', '0c4146']];
const vorder = [['Graphit 950', '161816'], ['Graphit 700', '595c59'], ['Forest 600', '29585c'], ['Forest', '0c4146'], ['Mint', 'efffe6'], ['Weiß', 'ffffff'], ['Lime 500', '37e93d'], ['Lime 700', '218c25'], ['Menschen', 'f39100'], ['Wissen', 'a1c513'], ['Systeme', 'e5007d'], ['Daten', '009ee3']];
const zelle = (k) => k >= 4.5 ? `<td class="m r"><b>${f1(k)}</b></td>` : k >= 3 ? `<td class="m r" style="color:var(--muted)">${f1(k)}</td>` : `<td class="m r no" style="text-decoration:line-through">${f1(k)}</td>`;
const matrix = `
  <h4 style="margin-top:30px">Die Kombinationsmatrix</h4>
  <div class="prose">
    <p>Was 4.6 als Regel sagt und 4.7 als Grenze, steht hier als Tabelle: jede Vorder- auf jeder Grundfarbe mit dem Kontrastwert nach WCAG 2.1. <b>Fett</b> ab 4,5:1 für Text, grau ab 3,0:1 für Großes und Marken, durchgestrichen darunter. Wer eine Farbe tauscht, rechnet die Zeile neu — die Werte hier sind gerechnet, nicht geschätzt.</p>
  </div>
  <div class="tbl">
    <table>
      <thead><tr><th scope="col">Vordergrund auf …</th>${gruende.map(g => `<th scope="col" class="r">${g[0]}</th>`).join('')}</tr></thead>
      <tbody>
${vorder.map(v => `        <tr><td><span class="swatch" style="background:#${v[1]}"></span> ${v[0]}</td>${gruende.map(g => zelle(K(v[1], g[1]))).join('')}</tr>`).join('\n')}
      </tbody>
    </table>
  </div>
  <p class="note">Die Ebenenfarben Menschen, Wissen und Systeme tragen auf keinem Papier Text — sie sind Knoten- und Diagrammfarben (Kapitel 05, 11). Daten erreicht auf Forest ${f1(K('009ee3', '0c4146'))}. Dieselbe Matrix liegt als Folie FA2 im Foliensystem.</p>
`;
vor('  <div class="subhead"><span>4.7</span><h3>Accessibility</h3></div>', matrix);

// ── 4 Kapitel 04: 4.14 praezisieren ───────────────────────────────────────
rep('<p><b>Regel:</b> Print und Office laufen immer auf Light oder IC Light. Dunkle Flächen sind Einzelelemente — ein Kapitelaufmacher, eine Rückseite —, kein Modus.</p>',
  '<p><b>Regel:</b> Print und Office laufen immer auf Light oder IC Light. Dunkle Flächen sind Einzelelemente — ein Kapitelaufmacher, eine Rückseite —, kein Modus.</p>\n      <p><b>Präzisiert in 010:</b> Das gilt auch für <b>Forest</b> (4.2.c). Es ist ein zweiter tiefer Grund neben Graphit 950 für Titel, Trenner und Aufmacher, kein Theme für Inhaltsseiten. Im Druck ist Forest eine Sonderfarbe oder ein Vierfarbaufbau mit Musterdruck, nie ein Verlauf.</p>');

// ── 5 Kapitel 08: Pill als Kantenform ─────────────────────────────────────
nach('  <p><b>Elemente mit Bediencharakter behalten im Web die bisherigen Radien</b> — Knopf, Chip, Eingabefeld und ausdrücklich auch die Karte. Für Folie und Print bleibt das offen, bis konkrete Anwendungsbeispiele vorliegen.</p>\n</div>',
`
<div class="verdict">
  <p><strong>Ergänzt in 010: die Pill ist eine Kantenform.</strong> Chips, Tags und Pills — vollrund an den kurzen Seiten — sind seit dem 5. September 2026 als Form zugelassen, in Folie, Web und Print. Sie tragen <b>Werte, Eigenschaften und Botschaften</b> (Foliensystem PI1, PI2) und Zustände (Chip, Tag), keine Layoutflächen. Die Regel aus 8.4 „eine Kantenform je Komposition" ist für die Pill ausgesetzt: Sie steht neben eckigen Flächen, ohne als zweite Form zu zählen.</p>
  <p><em>Offen:</em> Die Kantenformen dieses Kapitels — Quadrat, Kreis, Radius nach Rolle, Richtungsdreieck, Pill — sind nicht final. Sie werden gesondert überarbeitet; bis dahin gilt dieser Stand.</p>
</div>`);

// ── 6 Kapitel 08: Layoutschemata ──────────────────────────────────────────
const schema = (titel, text, rects) => `  <div class="card"><p class="lbl">Schema</p><h3>${titel}</h3>
    <svg viewBox="0 0 160 90" role="img" aria-label="${titel}" style="width:100%;max-width:220px;display:block;margin:8px 0 10px"><rect x="0" y="0" width="160" height="90" fill="var(--gl-paper)" stroke="var(--gl-kontur)"/>${rects.map(r => `<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" fill="var(--gl-kontur)"${r[4] ? ' opacity=".45"' : ''}/>`).join('')}</svg>
    <p>${text}</p></div>`;
const schemata = `
<h4 style="margin-top:30px">Layoutschemata</h4>
<div class="prose">
  <p>Ergänzt in 010. Sechs Felder erlauben viele Aufteilungen; benutzt werden vier. Wer eine fünfte braucht, prüft erst, ob die Aussage in eine der vier passt — meistens ja. Die Schemata gelten für Folie und Web gleichermaßen; das Foliensystem (Kapitel 13) ordnet jedem Layout eines davon zu.</p>
</div>
<div class="grid g4">
${schema('Vollbreite', 'Titel über fünf Felder, Inhalt über sechs. Aussage, Fließtext, Diagramm, Tabelle.', [[8, 10, 100, 8], [8, 26, 144, 54, 1]])}
${schema('Halbe und Halbe', 'Drei Felder links, drei rechts. Text und Bild, Vergleich, zwei Spalten, Kartenpaar.', [[8, 10, 100, 8], [8, 26, 70, 54, 1], [82, 26, 70, 54, 1]])}
${schema('Zwei und Vier', 'Zwei Felder Text, vier Felder Fläche — oder umgekehrt. Screenshot mit Text, Diagramm mit Anmerkung, Zoom.', [[8, 10, 100, 8], [8, 26, 44, 54, 1], [56, 26, 96, 54, 1]])}
${schema('Drei mal zwei', 'Sechs Felder als Raster. Karten, Funktionen, kleine Vielfache, Bildraster.', [[8, 10, 100, 8], [8, 26, 44, 25, 1], [58, 26, 44, 25, 1], [108, 26, 44, 25, 1], [8, 55, 44, 25, 1], [58, 55, 44, 25, 1], [108, 55, 44, 25, 1]])}
</div>
<p class="note">Die Titelzone nimmt in allen vier nicht am Raster teil. Auf Papier (vier Felder) fallen „Zwei und Vier" und „Drei mal zwei" zu „Eins und Drei" und „Zwei mal zwei" zusammen.</p>
`;
vor('<div class="subhead"><span>8.4</span><h3>Composition</h3></div>', schemata);

// ── 7 Kapitel 15 Application ──────────────────────────────────────────────
const k15 = `
<!-- ==================== 15 ==================== -->

<section id="s15">
  <div class="shead">
    <div class="snum">15</div>
    <div>
      <h2>Application</h2>
      <p class="sdek">Wo die Marke außerhalb von Website, Folie und Druckbogen auftritt: LinkedIn, E-Mail, Messe, das Produkt selbst und das Angebot als Dokument. Fünf Anwendungen, je mit Format, Regeln und der Vorlage, aus der sie kommen.</p>
    </div>
  </div>
  <div class="prose">
    <p>Ergänzt in 010. Die Kapitel 12 bis 14 beschreiben die drei Träger, auf denen die Marke entsteht. Dieses Kapitel beschreibt, wohin sie von dort aus geht — in der Reihenfolge, in der es im Alltag vorkommt. Jede Anwendung nennt das Format, die Regeln, die aus den vorderen Kapiteln folgen, und die Vorlage im Foliensystem, aus der sie gebaut wird. Mockups dafür liegen in der Figma-Präsentation (MO1 Browser, MO2 Telefone, MO3 Plakatserie).</p>
  </div>

  <div class="subhead"><span>15.1</span><h3>LinkedIn</h3></div>
  <div class="grid g3">
    <div class="card"><p class="lbl">Format</p><h3>Beitrag 4∶5, Story 9∶16</h3><p>Beitragsbild 1080 × 1350, Story 1080 × 1920. Rand 5 Prozent der kurzen Seite, Titel Space Grotesk Bold, Aussage in höchstens neun Wörtern.</p></div>
    <div class="card"><p class="lbl">Regel</p><h3>Ein Papier, ein Signal, kein Logo im Bild</h3><p>Das Profil trägt das Logo. Im Bild trägt es nichts: Papier des Bereichs, Aussage, ein Signal. Karussells folgen der Plakatserie: dieselbe Aussage, drei Aufteilungen.</p></div>
    <div class="card"><p class="lbl">Vorlage</p><h3>MO2, MO3, PI2</h3><p>Story aus MO2 mit dem Telefonrahmen aus der PIIPE-Präsentation, Beitrag aus MO3 Format 4∶5, Botschaften als Pills aus PI2.</p></div>
  </div>

  <div class="subhead"><span>15.2</span><h3>E-Mail-Signatur</h3></div>
  <div class="grid g3">
    <div class="card"><p class="lbl">Format</p><h3>Text, kein Bild</h3><p>Name in Manrope Bold, Rolle und Kontakt in Manrope Regular, Systemschrift als Fallback (Kapitel 03: keine Markenschrift in E-Mails). Vier Zeilen, keine Trennlinie.</p></div>
    <div class="card"><p class="lbl">Regel</p><h3>Kein Logo, keine Farbe, kein Banner</h3><p>Ein Logo in der Signatur ist ein Anhang. Das Signal gibt es in E-Mails nicht. Was die Marke trägt, ist die Ordnung der vier Zeilen.</p></div>
    <div class="card"><p class="lbl">Vorlage</p><h3>Textbaustein</h3><p>Liegt bei der IT als Vorlage für Outlook und Microsoft 365, nicht im Foliensystem.</p></div>
  </div>

  <div class="subhead"><span>15.3</span><h3>Messe und Rollup</h3></div>
  <div class="grid g3">
    <div class="card"><p class="lbl">Format</p><h3>Rollup 85 × 200, Wand 3∶1</h3><p>Aussage im oberen Drittel, Signal als Fläche, unten Kontakt in Mono. Bei der Wand läuft die Aussage über die ganze Breite, das Bild randlos.</p></div>
    <div class="card"><p class="lbl">Regel</p><h3>Kapitel 14 gilt, plus Musterdruck</h3><p>Forest und Lime vor jeder Beauftragung auf dem tatsächlichen Medium prüfen; hinterleuchtet ist ein eigener Fall. Nie zwei Verfahren nebeneinander für dieselbe Fläche.</p></div>
    <div class="card"><p class="lbl">Vorlage</p><h3>MO3</h3><p>Plakat, Rollup und Messewand sind die drei Formate der Plakatserie. Die Messewand ist die Vorlage für Messestände.</p></div>
  </div>

  <div class="subhead"><span>15.4</span><h3>Produkt-Dashboard</h3></div>
  <div class="grid g3">
    <div class="card"><p class="lbl">Format</p><h3>Bildschirm 16∶9, Tablet, Telefon</h3><p>Das Produkt in seinen drei Fenstern. Bildschirmfotos sind echter Stand mit plausiblen Testdaten, keine Mockups mit Lorem ipsum.</p></div>
    <div class="card"><p class="lbl">Regel</p><h3>Das Produkt spricht selbst</h3><p>Graphit-Papier, kein Signal um den Rahmen herum. Marker in Erklärreihenfolge (S3), Zoom in Originalauflösung (S5), zwei Geräte nur mit demselben Inhalt (S7).</p></div>
    <div class="card"><p class="lbl">Vorlage</p><h3>MO1, S3, S5, S7</h3><p>MacBook-Rahmen aus der PIIPE-Präsentation in MO1; die Produktfolien der Familie S für Details.</p></div>
  </div>

  <div class="subhead"><span>15.5</span><h3>Angebot in Word</h3></div>
  <div class="grid g3">
    <div class="card"><p class="lbl">Format</p><h3>A4, vier Felder</h3><p>Raster aus 8.3 mit größerem Fußsteg. Formatvorlagen statt Direktformatierung (Kapitel 03): vier Manrope-Einträge, Tabellen in JetBrains Mono.</p></div>
    <div class="card"><p class="lbl">Regel</p><h3>Das Angebot ist die Versandstufe</h3><p>Dieselbe Dramaturgie wie der Angebotsbogen im Foliensystem: Zusammenfassung mit Antwort zuerst, Lieferumfang, Vorgehen, Konditionen, Rechtliches. Kein Angebot als .docx, immer PDF.</p></div>
    <div class="card"><p class="lbl">Vorlage</p><h3>Foliensystem, Bogen B</h3><p>X9, L10, L4, L9, Z5 als Abschnitte des Dokuments. Eine Word-Vorlage dafür ist offen.</p></div>
  </div>
</section>
`;
vor('<footer>', k15);

// ── 8 Aenderungsprotokoll ─────────────────────────────────────────────────
vor('  <p><b>Änderungen 008 → 009:</b>', `  <p><b>Änderungen 009 → 010:</b> Fünf Erweiterungen aus dem Vergleich mit den Markenhandbuch-Vorlagen <em>Horizon</em> und <em>Calypso</em> (Made by Circular). <b>Kapitel 04</b> hat eine Grünfamilie mit Forest als zweitem tiefem Grund und Mint als sechstem Papier (4.2.c), vier Welten aus den Ebenenfarben (4.2.d) und die Kombinationsmatrix mit gerechneten Kontrastwerten (4.6); 4.14 ist auf Forest hin präzisiert. <b>Kapitel 08</b> lässt die Pill als Kantenform zu und nennt vier Layoutschemata. <b>Kapitel 15 Application</b> ist neu: LinkedIn, E-Mail-Signatur, Messe und Rollup, Produkt-Dashboard, Angebot in Word. Im Foliensystem (Kapitel 13) kamen 23 Layouts in sechs Familien hinzu — Karten, Pills, Do und Don't, Farbe, Typografie, Mockups — vorerst nur in der Figma-Präsentation. <b>Zurückgestellt:</b> das Logo (Kapitel 02) wird gesondert bearbeitet; die Kantenformen aus Kapitel 08 werden überarbeitet; Rasterflexibilität und Bild-Do/Don't warten auf die Bildwelt.</p>`);

if (fehler.length) { console.error('ABBRUCH, nichts geschrieben:\n' + fehler.join('\n')); process.exit(1); }
fs.writeFileSync(P, s);
console.log('geschrieben:', s.length, 'Zeichen; Kapitel', (s.match(/<section id="s\d+">/g) || []).length, '; Version', (s.match(/NEO Brand 010/g) || []).length + '× 010');
