/**
 * @file
 * Macht aus den Rohdaten der Bilanz eine Seite.
 *
 * Getrennt von der Erhebung (bilanz-daten.js): Wer den Zahlen misstraut,
 * ruft die Rohdaten auf und rechnet nach, ohne sich durch Markup zu lesen.
 *
 * GESTALTUNG
 * Die Seite benutzt die Farben, ueber die sie berichtet — Graphit als Grund,
 * Lime als einzigen Akzent. Lime traegt dabei nie Text: #37e93d kommt auf
 * Weiss auf 1,7:1 und ist als Schriftfarbe unbrauchbar. Es markiert Balken
 * und Kanten; fuer Text steht ein abgedunkelter Ton daneben, der AA haelt.
 */

import { writeFileSync } from 'node:fs';

const e = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const zahl = (n) => new Intl.NumberFormat('de-DE').format(Math.round(n || 0));
const geld = (n) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);
const kurz = (n) => (n >= 1e9 ? (n / 1e9).toFixed(1) + ' Mrd' : n >= 1e6 ? (n / 1e6).toFixed(1) + ' Mio' : zahl(n));
const datum = (s) => new Date(s).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

const CSS = `
:root{
  --papier:#f6f7f3; --karte:#fffffe; --tinte:#15180f; --gedaempft:#65695c;
  --linie:#e0e2d8; --linie-stark:#c6c9bc;
  --lime:#37e93d;            /* Markenwert — nur Flaeche und Kante */
  --lime-text:#2f6f2b;       /* 5,2:1 auf Papier — dafuer ist er da */
  --lime-matt:#e6f9e4;
  --warn:#8a5a1c; --warn-matt:#fbf0df;
  --raster:1px solid var(--linie);
}
@media (prefers-color-scheme:dark){
  :root{
    --papier:#101208; --karte:#191c12; --tinte:#e9ebe0; --gedaempft:#9aa08d;
    --linie:#2b2f21; --linie-stark:#3d4230;
    --lime-text:#8ce887; --lime-matt:#1d2a17;
    --warn:#e0b071; --warn-matt:#2c2114;
  }
}
:root[data-theme="dark"]{
  --papier:#101208; --karte:#191c12; --tinte:#e9ebe0; --gedaempft:#9aa08d;
  --linie:#2b2f21; --linie-stark:#3d4230;
  --lime-text:#8ce887; --lime-matt:#1d2a17;
  --warn:#e0b071; --warn-matt:#2c2114;
}
:root[data-theme="light"]{
  --papier:#f6f7f3; --karte:#fffffe; --tinte:#15180f; --gedaempft:#65695c;
  --linie:#e0e2d8; --linie-stark:#c6c9bc;
  --lime-text:#2f6f2b; --lime-matt:#e6f9e4;
  --warn:#8a5a1c; --warn-matt:#fbf0df;
}

*{box-sizing:border-box}
body{
  margin:0;padding:0;background:var(--papier);color:var(--tinte);
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  font-size:15px;line-height:1.55;
  -webkit-font-smoothing:antialiased;
  font-variant-numeric:tabular-nums;
}
.huelle{max-width:1120px;margin:0 auto;padding:40px 24px 96px}
h1,h2,h3{text-wrap:balance;margin:0}
.mono{font-family:ui-monospace,SFMono-Regular,"SF Mono",Menlo,monospace}

/* -- Kopf -- */
.kopf{border-bottom:3px solid var(--tinte);padding-bottom:20px;margin-bottom:8px}
.marke{display:flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--gedaempft);font-weight:650}
.marke::before{content:"";width:26px;height:9px;background:var(--lime);border-radius:1px}
.kopf h1{font-size:clamp(30px,4.4vw,46px);line-height:1.05;letter-spacing:-.022em;font-weight:760;margin:14px 0 6px}
.zeitraum{font-size:17px;color:var(--gedaempft)}

/* -- Kennzahlenband -- */
.band{display:grid;grid-template-columns:repeat(auto-fit,minmax(158px,1fr));
  gap:0;border:var(--raster);border-radius:8px;overflow:hidden;background:var(--karte);margin:26px 0 40px}
.kz{padding:16px 18px;border-right:var(--raster)}
.kz:last-child{border-right:0}
.kz dt{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--gedaempft);font-weight:650}
.kz dd{margin:6px 0 0;font-size:27px;font-weight:730;letter-spacing:-.02em;line-height:1.1}
.kz small{display:block;font-size:12px;color:var(--gedaempft);font-weight:400;letter-spacing:0;margin-top:3px}

section{margin:44px 0 0}
section > h2{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--gedaempft);
  font-weight:700;padding-bottom:9px;border-bottom:var(--raster);margin-bottom:18px}
.lead{color:var(--gedaempft);max-width:64ch;margin:0 0 20px;font-size:14px}

/* -- Tabellen -- */
.rahmen{overflow-x:auto;border:var(--raster);border-radius:8px;background:var(--karte)}
table{width:100%;border-collapse:collapse;font-size:14px;min-width:640px}
th{text-align:left;font-size:11px;letter-spacing:.08em;text-transform:uppercase;
  color:var(--gedaempft);font-weight:650;padding:11px 14px;border-bottom:1px solid var(--linie-stark);white-space:nowrap}
td{padding:12px 14px;border-bottom:var(--raster);vertical-align:top}
tr:last-child td{border-bottom:0}
.num{text-align:right;font-variant-numeric:tabular-nums}
.dom{font-weight:660}
.dom small{display:block;font-weight:400;color:var(--gedaempft);font-size:12.5px;margin-top:2px;max-width:46ch}

/* Balken: Groesse als Form, nicht nur als Zahl */
.balken{display:block;height:5px;border-radius:3px;background:var(--lime);margin-top:7px;min-width:2px}
.balken.matt{background:var(--linie-stark)}

/* -- Chips -- */
.chip{display:inline-block;padding:2px 9px;border-radius:100px;font-size:12px;font-weight:640;white-space:nowrap}
.chip.ok{background:var(--lime-matt);color:var(--lime-text)}
.chip.offen{background:var(--warn-matt);color:var(--warn)}

/* -- Hinweiskasten -- */
.notiz{border-left:3px solid var(--lime);background:var(--karte);border-radius:0 8px 8px 0;
  padding:15px 18px;margin:20px 0;font-size:13.5px;color:var(--gedaempft)}
.notiz b{color:var(--tinte)}

/* -- Verlauf -- */
.commit{padding:13px 0;border-bottom:var(--raster)}
.commit:last-child{border-bottom:0}
.commit .kopfz{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}
.commit .hash{font-size:12px;color:var(--gedaempft)}
.commit .betreff{font-weight:600}
.commit .repo{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--gedaempft)}

footer{margin-top:56px;padding-top:18px;border-top:var(--raster);font-size:12.5px;color:var(--gedaempft)}
@media (max-width:640px){.huelle{padding:24px 14px 64px}.kz{border-right:0;border-bottom:var(--raster)}}
`;

export function html(d) {
  const D = Object.entries(d.jeDomaene).filter(([, v]) => v.commits > 0 || v.kosten > 0);
  const maxK = Math.max(...D.map(([, v]) => v.kosten), 1);
  const maxC = Math.max(...D.map(([, v]) => v.commits), 1);
  const b = d.bestand;
  const g = d.gesamtstrecke;
  const offen = d.befunde.filter((x) => !x.gut);

  const kennzahl = (t, w, s) => `<div class="kz"><dt>${e(t)}</dt><dd>${w}${s ? `<small>${e(s)}</small>` : ''}</dd></div>`;

  // Domaenenspezifische Kennzahl — je Gegenstand die, die dort etwas aussagt
  const spezifisch = {
    ds: `${zahl(b.ds.komponenten)} Komponenten · ${zahl(b.ds.ohneRecipe)} ohne Recipe · ${zahl(b.ds.ohneStory)} ohne Story`,
    konfig: `${zahl(b.konfig.gruppen)} einstellbare Gruppen · ${zahl(b.konfig.vueKomponenten)} Vue-Bausteine`,
    theme: `${zahl(b.theme.templates)} Templates · ${zahl(b.theme.js)} JS · ${zahl(b.theme.css)} CSS`,
    messstand: `${zahl(b.messstand.skripte)} Prüfskripte · ${zahl(b.messstand.referenzstaende)} Referenzstände`,
    doku: `${zahl(b.doku.recipes)} Recipes · ${zahl(b.doku.markdown)} Markdown-Dateien`,
    storybook: `${zahl(b.storybook.stories)} Stories`,
    site: `${zahl(b.site.configExporte)} Config-Exporte`,
    skills: `${zahl(b.skills.skills)} Skills · ${zahl(b.skills.agenten)} Agenten · ${zahl(b.skills.regeln)} Regeln`,
    sonst: '—',
  };

  return `<title>Arbeitsbilanz ${e(d.zeitraum.von)} bis ${e(d.zeitraum.bis)}</title>
<style>${CSS}</style>
<div class="huelle">

<header class="kopf">
  <div class="marke">NEO · Arbeitsbilanz</div>
  <h1>Was diese Woche entstanden ist</h1>
  <p class="zeitraum">${e(datum(d.zeitraum.von))} &ndash; ${e(datum(d.zeitraum.bis))}</p>
</header>

<dl class="band">
  ${kennzahl('Commits', zahl(d.commits.length), `${new Set(d.commits.map((c) => c.repo)).size} Repositories`)}
  ${kennzahl('Berührte Komponenten', zahl(g.beruehrt), `${zahl(g.vollstaendig)} auf ganzer Strecke`)}
  ${kennzahl('Nacharbeitsquote', d.nacharbeit.quote + '&thinsp;%', `${zahl(d.nacharbeit.korrektur)} von ${zahl(d.nacharbeit.commits)} Commits`)}
  ${kennzahl('Offene Befunde', zahl(offen.length), offen.length ? `ältester ${zahl(Math.max(0, ...offen.map((x) => x.tage || 0)))} Tage` : 'nichts offen')}
  ${d.entscheidungen ? kennzahl('Entscheidungen', d.entscheidungen.gebrochen === 0 ? 'halten' : zahl(d.entscheidungen.gebrochen) + ' gebrochen',
    `${zahl(d.entscheidungen.gesamt)} im Register`) : ''}
  ${kennzahl(d.kosten.abonnement ? 'Verbrauch (Rechenwert)' : 'Kosten', '$' + geld(d.kosten.gesamt), `${zahl(d.kosten.sitzungen)} Sitzungen`)}
</dl>

<section>
  <h2>Reportinggegenstände</h2>
  <p class="lead">Jede Zeile ist eine Domäne mit eigener Aufgabe. Der Balken zeigt
  den Anteil am Verbrauch — die Zahl allein verführt zum Vergleich von Dingen,
  die nicht vergleichbar sind.</p>
  <div class="rahmen"><table>
    <thead><tr>
      <th>Domäne</th><th class="num">Commits</th><th class="num">Dateien</th>
      <th class="num">Zeilen</th><th>Bestand</th><th class="num">Verbrauch</th>
    </tr></thead>
    <tbody>
    ${D.map(([id, v]) => `<tr>
      <td class="dom">${e(v.name)}<small>${e(v.was)}</small></td>
      <td class="num">${zahl(v.commits)}<span class="balken matt" style="width:${Math.round((v.commits / maxC) * 100)}%"></span></td>
      <td class="num">${zahl(v.dateien)}</td>
      <td class="num">+${zahl(v.plus)} <span style="color:var(--gedaempft)">&minus;${zahl(v.minus)}</span></td>
      <td style="font-size:13px;color:var(--gedaempft)">${e(spezifisch[id] || '—')}</td>
      <td class="num">$${geld(v.kosten)}<span class="balken" style="width:${Math.round((v.kosten / maxK) * 100)}%"></span></td>
    </tr>`).join('')}
    </tbody>
  </table></div>
  <div class="notiz">
    <b>Wie der Verbrauch je Domäne zustande kommt.</b> Kosten fallen je Sitzung an,
    Arbeit je Domäne. Der Betrag einer Sitzung wird auf die Domänen verteilt, die sie
    angefasst hat — gewichtet nach Dateipfaden aus Werkzeugaufrufen und nach Commits
    im Zeitfenster der Sitzung. Das trägt eine Größenordnung, keine zwei Nachkommastellen.
    ${d.kosten.abonnement ? '<br><br><b>Es ist kein Ausgabeposten.</b> Die Nutzung läuft über ein Abonnement; der Betrag misst Verbrauch, nicht Rechnung.' : ''}
  </div>
</section>

<section>
  <h2>Gesamtstrecke</h2>
  <p class="lead">Deine Regel: Nach einer finalen Entscheidung ist die Umsetzung erst
  fertig, wenn Design System, Konfig-App, Dokumentation und Storybook bedient sind.
  Diese Zahl misst genau das — nicht die Absicht, sondern den Stand.</p>
  ${g.beruehrt
    ? `<p style="font-size:22px;font-weight:700;margin:0 0 14px">${zahl(g.vollstaendig)} von ${zahl(g.beruehrt)} berührten Komponenten sind vollständig.</p>
  ${g.luecken.length ? `<div class="rahmen"><table>
    <thead><tr><th>Komponente</th><th>Was fehlt</th></tr></thead><tbody>
    ${g.luecken.map((l) => `<tr><td class="mono">${e(l.komponente)}</td><td>${l.fehlt.map((f) => `<span class="chip offen">${e(f)}</span>`).join(' ')}</td></tr>`).join('')}
    </tbody></table></div>` : '<p>Keine Lücken.</p>'}`
    : '<p>In diesem Zeitraum wurde keine Komponente berührt.</p>'}
</section>

${d.entscheidungen ? `<section>
  <h2>Entscheidungsregister</h2>
  <p class="lead">Getroffene Entscheidungen und die wöchentliche Gegenprobe, ob sie
  noch gelten. Die Slate-Palette lief vier Tage produktiv, ohne dass es auffiel —
  eine Entscheidung ohne Gegenprobe ist eine Absicht, kein Zustand.</p>
  <p style="font-size:22px;font-weight:700;margin:0 0 14px">
    ${d.entscheidungen.gebrochen === 0
      ? `Alle ${zahl(d.entscheidungen.gesamt)} Entscheidungen halten.`
      : `${zahl(d.entscheidungen.gebrochen)} von ${zahl(d.entscheidungen.gesamt)} Entscheidungen gelten nicht mehr.`}
    ${d.entscheidungen.unpruefbar ? `<span style="color:var(--warn)"> ${zahl(d.entscheidungen.unpruefbar)} nicht prüfbar.</span>` : ''}
  </p>
  <div class="rahmen"><table>
    <thead><tr><th>Stand</th><th>Entscheidung</th><th class="num">Alter</th><th>Warum</th></tr></thead><tbody>
    ${d.entscheidungen.liste.map((x) => `<tr>
      <td><span class="chip ${x.haelt === true ? (x.status === 'offen' ? 'offen' : 'ok') : 'offen'}">${
        x.status === 'offen' ? 'offen' : x.haelt === true ? 'gilt' : x.haelt === false ? 'gebrochen' : 'unprüfbar'}</span></td>
      <td class="dom">${e(x.titel)}${x.bemerkung ? `<small style="color:var(--warn)">${e(x.bemerkung)}</small>` : ''}${x.notiz ? `<small>${e(x.notiz)}</small>` : ''}</td>
      <td class="num">${x.alterTage !== null ? zahl(x.alterTage) + '&thinsp;d' : '—'}</td>
      <td style="color:var(--gedaempft);font-size:13px">${e(x.warum)}</td>
    </tr>`).join('')}
    </tbody></table></div>
</section>` : ''}

<section>
  <h2>Befunde</h2>
  <p class="lead">Ein Befund von gestern und einer, der seit Wochen mitreist, sind
  nicht dasselbe. Die Spalte „offen seit" liest sich aus den Ständen früherer Bilanzen.</p>
  <div class="rahmen"><table>
    <thead><tr><th>Stand</th><th>Befund</th><th class="num">Offen seit</th><th>Was es bedeutet</th></tr></thead><tbody>
    ${d.befunde.map((x) => `<tr>
      <td><span class="chip ${x.gut ? 'ok' : 'offen'}">${x.gut ? 'in Ordnung' : 'offen'}</span></td>
      <td class="dom">${e(x.titel)}${x.wert !== null ? ` <span style="color:var(--gedaempft)">(${zahl(x.wert)})</span>` : ''}</td>
      <td class="num">${x.gut ? '—' : x.neu ? '<span class="chip offen">neu</span>' : `${zahl(x.tage)}&thinsp;d`}</td>
      <td style="color:var(--gedaempft)">${e(x.text)}</td>
    </tr>`).join('')}
    ${d.ungenutzt ? `<tr>
      <td><span class="chip ${d.ungenutzt.ungenutzt === 0 ? 'ok' : 'offen'}">${d.ungenutzt.ungenutzt === 0 ? 'in Ordnung' : 'zu prüfen'}</span></td>
      <td class="dom">Bauteile ohne Fundstelle <span style="color:var(--gedaempft)">(${zahl(d.ungenutzt.ungenutzt)} von ${zahl(d.ungenutzt.gesamt)})</span></td>
      <td style="color:var(--gedaempft)">Wurzelklassen, die auf keiner gemessenen Seite vorkommen (Stand <span class="mono">${e(d.ungenutzt.stand)}</span>). Nicht automatisch tot — vieles gehört zu Storybook oder wartet auf Einsatz. Aber hier stand auch das Card-Atom.</td>
    </tr>` : ''}
    </tbody></table></div>
</section>

<section>
  <h2>Verbrauch im Einzelnen</h2>
  <div class="rahmen"><table>
    <thead><tr><th>Posten</th><th class="num">Token</th><th class="num">Anteil</th></tr></thead><tbody>
    ${[['Eingabe (frisch)', d.kosten.token.input], ['Ausgabe', d.kosten.token.output],
       ['Cache angelegt', d.kosten.token.cacheWrite], ['Cache gelesen', d.kosten.token.cacheRead]]
      .map(([n, v]) => {
        const s = Object.values(d.kosten.token).reduce((a, x) => a + x, 0) || 1;
        return `<tr><td>${e(n)}</td><td class="num">${kurz(v)}</td><td class="num">${((v / s) * 100).toFixed(1)}&thinsp;%<span class="balken" style="width:${Math.round((v / s) * 100)}%"></span></td></tr>`;
      }).join('')}
    </tbody></table></div>
  <div class="notiz"><b>Ein hoher Cache-Anteil ist ein gutes Zeichen.</b> Er bedeutet lange
  Sitzungen mit warmem Kontext statt ständigem Neuaufbau — und er ist der mit Abstand
  billigste Posten. Modelle in diesem Zeitraum:
  ${Object.entries(d.kosten.modelle).map(([m, n]) => `<span class="mono">${e(m)}</span> (${zahl(n)})`).join(', ') || '—'}.</div>
</section>

<section>
  <h2>Gewicht, Backlog, Beteiligte</h2>
  <p class="lead">Drei Zahlen, die einzeln wenig und über Monate viel sagen.</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(268px,1fr));gap:16px">

    ${d.cssGewicht ? `<div class="rahmen" style="padding:16px 18px">
      <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--gedaempft);font-weight:650">Gebautes CSS</div>
      <div style="font-size:26px;font-weight:730;margin-top:6px">${(d.cssGewicht.jetzt.bytes / 1024).toFixed(0)}&thinsp;KB</div>
      <div style="color:var(--gedaempft);font-size:13px;margin-top:4px">
        ${zahl(d.cssGewicht.jetzt.regeln)} Regeln · ${zahl(d.cssGewicht.jetzt.selektoren)} Selektoren · ${zahl(d.cssGewicht.jetzt.eigenschaften)} Eigenschaften
      </div>
      <div style="margin-top:9px;font-size:13px">${d.cssGewicht.delta
        ? `Gegenüber dem letzten Stand: <b>${d.cssGewicht.delta.regeln >= 0 ? '+' : '&minus;'}${zahl(Math.abs(d.cssGewicht.delta.regeln))} Regeln</b>, ${d.cssGewicht.delta.bytes >= 0 ? '+' : '&minus;'}${(Math.abs(d.cssGewicht.delta.bytes) / 1024).toFixed(1)}&thinsp;KB`
        : '<span style="color:var(--gedaempft)">Erster Stand — der Vergleich beginnt nächste Woche.</span>'}</div>
      <div style="margin-top:7px;font-size:12px;color:var(--gedaempft)">Stand von heute: <span class="mono">styles.css</span> ist ignoriert und hat keine Historie, aus der ein früherer Stand rekonstruierbar wäre.</div>
    </div>` : ''}

    ${d.backlog ? `<div class="rahmen" style="padding:16px 18px">
      <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--gedaempft);font-weight:650">Backlog</div>
      <div style="font-size:26px;font-weight:730;margin-top:6px">${zahl(d.backlog.offen)} <span style="font-size:15px;font-weight:400;color:var(--gedaempft)">offen von ${zahl(d.backlog.gesamt)}</span></div>
      <div style="color:var(--gedaempft);font-size:13px;margin-top:4px">${zahl(d.backlog.abschnitte)} Abschnitte · gepflegt bis ${e(d.backlog.stand || '—')}</div>
      <div style="margin-top:9px;font-size:13px">${d.backlog.delta
        ? `Diese Woche: <b>+${zahl(Math.max(0, d.backlog.delta.zugefuegt))} zugefügt</b>, ${zahl(Math.max(0, d.backlog.delta.abgearbeitet))} abgearbeitet`
        : '<span style="color:var(--gedaempft)">Erster Stand — die Bewegung zeigt sich ab dem nächsten Lauf.</span>'}</div>
    </div>` : ''}

    ${d.autoren ? `<div class="rahmen" style="padding:16px 18px">
      <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--gedaempft);font-weight:650">Beteiligte</div>
      <div style="font-size:26px;font-weight:730;margin-top:6px">${zahl(d.autoren.fremdAnteil)}&thinsp;% <span style="font-size:15px;font-weight:400;color:var(--gedaempft)">fremd</span></div>
      <div style="color:var(--gedaempft);font-size:13px;margin-top:4px">
        ${d.autoren.liste.map((a) => `${e(a.name)}${a.eigen ? '' : ' (fremd)'}: ${zahl(a.commits)}`).join(' · ') || '—'}
      </div>
      <div style="margin-top:9px;font-size:13px">${d.autoren.fremdCommits
        ? 'Fremde Arbeit im Baum — beim Committen einzeln stagen, nie <span class="mono">git add -A</span>.'
        : '<span style="color:var(--gedaempft)">Keine fremden Commits in diesem Zeitraum.</span>'}</div>
    </div>` : ''}

  </div>
</section>

<section>
  <h2>Verlauf</h2>
  <p class="lead">${zahl(d.commits.length)} Commits, neueste zuerst.</p>
  <div class="rahmen" style="padding:4px 18px">
  ${d.commits.map((c) => `<div class="commit"><div class="kopfz">
      <span class="repo">${e(c.repo)}</span>
      <span class="betreff">${e(c.betreff)}</span>
      <span class="hash mono">${e(c.hash)} · ${e(new Date(c.datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }))}</span>
    </div></div>`).join('')}
  </div>
</section>

<footer>
  Berechnet am ${e(new Date(d.erzeugt).toLocaleString('de-DE'))} aus Git, Claude-Transkripten und dem Bestand der drei Repositories.
  Keine Zahl auf dieser Seite ist geschätzt außer der Verteilung des Verbrauchs auf Domänen — diese eine ist als Schätzung gekennzeichnet.
  Rohdaten: <span class="mono">node scripts/bilanz-daten.js --von ${e(d.zeitraum.von)} --bis ${e(d.zeitraum.bis)}</span>
</footer>

</div>`;
}

export function schreiben(daten, pfad) {
  writeFileSync(pfad, html(daten), 'utf8');
  return pfad;
}
