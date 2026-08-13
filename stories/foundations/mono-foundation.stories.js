// ============================================================
// Monochrome Farbgrundlage — Leitern, Rollen, Flaechen
// Graphit + Lime, vier austauschbare Neutralleitern
// ============================================================

const STUFEN = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const LEITERN = {
  Graphit: { hue: '143°', hinweis: 'fuehrend, alle Produkte',
    werte: ['#f9fbf9','#f1f3f1','#e4e6e4','#d2d4d2','#afb2af','#909390','#727572','#595c59','#414341','#292b29','#161816'] },
  Blaustichig: { hue: '248°', hinweis: 'kuehl, sachlich — Support, Statusseiten',
    werte: ['#f6fbff','#edf3f9','#e0e6ec','#cdd4dc','#aab2ba','#8a939d','#6c7680','#535c65','#3c434b','#252b31','#13181c'] },
  Beigestichig: { hue: '80°', hinweis: 'warm, einladend — Kurse, Weiterbildung',
    werte: ['#fef9f2','#f6f2ea','#eae4dc','#d8d3ca','#b7b0a6','#989185','#7b7366','#615a4e','#474138','#2e2922','#1a1710'] },
  Salbei: { hue: '143°', hinweis: 'sichtbar getoent — Foren, Gemeinschaft',
    werte: ['#f7fcf7','#eff4ef','#e2e7e1','#d0d5cf','#adb3ac','#8d948d','#6f776f','#565d56','#3e443e','#272c27','#151814'] },
};

const LIME = ['#f0ffef','#d0ffcd','#a4ff9f','#61ff61','#3df643','#37e93d','#00c01a','#009612','#006f0a','#004904','#002801'];

const leiter = (werte, marke) => `<div style="display:flex;gap:4px;flex-wrap:wrap">
  ${werte.map((w, i) => `<div style="width:74px">
    <div style="height:52px;border-radius:3px;background:${w};border:1px solid var(--fnd-color-border-subtle,rgba(128,128,128,.3))${marke === STUFEN[i] ? ';outline:2px solid var(--fnd-color-text-primary);outline-offset:2px' : ''}"></div>
    <span style="display:block;margin-top:5px;font-family:var(--font-mono);font-size:10px;color:var(--fnd-color-text-secondary)">${STUFEN[i]}<br>${w}</span>
  </div>`).join('')}
</div>`;

export default {
  title: 'Foundations/Monochrome Farbgrundlage',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Monochrome Farbgrundlage** — ein Graphit-Grau traegt, Lime unterbricht.

Alle Leitern sind in **OKLCH** gerechnet, nicht in HSL: Dort sind gleiche
Helligkeitswerte auch gleich hell. Deshalb haben die vier Neutralleitern
**stufenweise dieselben Kontrastwerte** — ein Bereich, der von Graphit auf
Beige umschaltet, behaelt saemtliche Werte und muss nicht neu geprueft werden.

Das gilt nur, solange Bauteile die **Stufennummer** ansprechen
(\`--fnd-neutral-700\`) und nicht den Hexwert. Ein einziger fest eingetragener
Grauton bricht die Umschaltbarkeit fuer den ganzen Bereich.`,
      },
    },
  },
};

export const Neutralleitern = {
  name: 'Vier Neutralleitern',
  render: () => `<div style="padding:24px;display:flex;flex-direction:column;gap:28px">
    <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);max-width:64ch">
      Kontrast gegen Weiss, fuer alle vier gleich:
      50&nbsp;1,04 &middot; 100&nbsp;1,12 &middot; 200&nbsp;1,25 &middot; 300&nbsp;1,49 &middot;
      400&nbsp;2,14 &middot; 500&nbsp;3,11 &middot; 600&nbsp;4,66 &middot; 700&nbsp;6,77 &middot;
      800&nbsp;9,98 &middot; 900&nbsp;14,27 &middot; 950&nbsp;17,85
    </p>
    ${Object.entries(LEITERN).map(([name, l]) => `<div>
      <div style="display:flex;gap:12px;align-items:baseline;margin-bottom:8px">
        <b style="font-size:var(--fs-sm)">${name}</b>
        <span style="font-family:var(--font-mono);font-size:11px;color:var(--fnd-color-text-secondary)">${l.hue} &middot; ${l.hinweis}</span>
      </div>
      ${leiter(l.werte)}
    </div>`).join('')}
  </div>`,
};

export const Akzentleiter = {
  name: 'Akzent (Lime)',
  render: () => `<div style="padding:24px;display:flex;flex-direction:column;gap:24px">
    <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);max-width:64ch">
      Stufe 500 ist der unveraenderte Markenwert. <b>Die Leiter zerfaellt zwischen
      700 und 800:</b> Oberhalb taugt Lime nur als Flaeche, unterhalb nur als
      Schrift. Das ist keine Empfehlung, sondern Arithmetik — der Markenwert
      erreicht als Schrift auf Weiss 1,63.
    </p>
    ${leiter(LIME, 500)}
    <div class="nc-data-table nc-data-table--static" style="max-width:640px">
      <table class="nc-data-table__table">
        <thead><tr><th>Rolle</th><th>Stufe</th><th>Kontrast</th></tr></thead>
        <tbody>
          <tr><td><code>--accent-surface</code></td><td>500</td><td>schwarze Schrift 12,89</td></tr>
          <tr><td><code>--accent-surface-hover</code> hell</td><td>600</td><td>8,55</td></tr>
          <tr><td><code>--accent-surface-active</code> hell</td><td>700</td><td>5,37</td></tr>
          <tr><td><code>--accent-line</code> hell</td><td>700</td><td>3,91 auf Weiss (1.4.11)</td></tr>
          <tr><td><code>--accent-text</code> hell</td><td>800</td><td>6,41 auf Weiss</td></tr>
        </tbody>
      </table>
    </div>
  </div>`,
};

export const AkzentGegenBedienung = {
  name: 'Akzent ist nicht Bedienung',
  render: () => `<div style="padding:24px;display:flex;flex-direction:column;gap:20px">
    <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);max-width:64ch">
      Drei getrennte Begriffe, weil es drei verschiedene Dinge sind.
      <b>Akzent</b> ist die Marke und markiert Bedeutung. <b>Interaktiv</b> heisst
      anklickbar. <b>Rueckmeldung</b> ist Zustand. Ohne diese Trennung faerbt ein
      Kunde, der in der Konfig-App seine Akzentfarbe waehlt, versehentlich jede
      Schaltflaeche im System ein.
    </p>
    <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center">
      <button style="font:inherit;font-size:.875rem;font-weight:600;padding:9px 18px;border-radius:8px;border:none;background:var(--fnd-color-background-accent);color:var(--fnd-color-on-accent)">Akzent — die eine Handlung</button>
      <button style="font:inherit;font-size:.875rem;font-weight:600;padding:9px 18px;border-radius:8px;border:none;background:var(--fnd-color-interactive-default);color:var(--fnd-color-text-on-interactive)">Interaktiv — anklickbar</button>
      <button style="font:inherit;font-size:.875rem;font-weight:600;padding:9px 18px;border-radius:8px;background:transparent;border:1px solid var(--fnd-color-border-primary);color:var(--fnd-color-text-primary)">Leise</button>
    </div>
    <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);max-width:64ch">
      <b>Erfolg ist nicht gruen.</b> Bei Rot-Gruen-Sehschwaeche liegt ein
      Erfolgsgruen 0,4&deg; vom Markenlime entfernt — beide werden zu demselben
      Gelb. Petrol liegt 175&deg; entfernt.
    </p>
    <div style="display:flex;gap:14px;flex-wrap:wrap">
      ${[['Erfolg','success'],['Warnung','warning'],['Fehler','danger'],['Hinweis','info']].map(([l, k]) =>
        `<span style="padding:6px 12px;border-radius:5px;font-size:.85rem;background:var(--fnd-color-background-${k});color:var(--fnd-color-text-${k})">${l}</span>`).join('')}
    </div>
  </div>`,
};

export const Flaechen = {
  name: 'Flaechen und Erhebung',
  render: () => `<div style="padding:24px;display:flex;flex-direction:column;gap:22px">
    <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);max-width:64ch">
      Zwei getrennte Achsen, keine Alternativen. Die <b>Flaeche</b> beantwortet
      „worauf liege ich", die <b>Erhebung</b> „wie hoch schwebe ich darueber".
      Ein Hover-Zustand aendert die Erhebung und <i>nicht</i> die Flaeche.
    </p>
    <div style="background:var(--fnd-color-background-secondary);padding:20px;border-radius:8px;display:flex;flex-direction:column;gap:14px">
      <span style="font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:var(--fnd-color-text-secondary)">Buehne</span>
      <div style="background:var(--fnd-color-background-base);border:1px solid var(--fnd-color-border-primary);border-radius:8px;padding:16px;box-shadow:var(--elevation-1,0 1px 2px rgb(0 0 0/.07))">
        <span style="font-size:.85rem">Karte &middot; Erhebung 1</span>
      </div>
      <div style="background:var(--fnd-color-background-base);border:1px solid var(--fnd-color-border-primary);border-radius:8px;padding:16px;box-shadow:var(--elevation-2,0 6px 16px rgb(0 0 0/.13))">
        <span style="font-size:.85rem">Karte beruehrt &middot; Erhebung 2 &middot; gleiche Flaeche</span>
      </div>
    </div>
  </div>`,
};

export const RahmenUndFokus = {
  name: 'Rahmen und Fokus',
  render: () => `<div style="padding:24px;display:flex;flex-direction:column;gap:22px">
    <div>
      <h3 style="font-size:var(--fs-base);margin:0 0 8px">Zwei Rahmenrollen, nicht eine</h3>
      <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);max-width:64ch;margin:0 0 14px">
        WCAG 1.4.11 verlangt 3:1 nur fuer Rahmen, die ein <b>Bedienelement</b>
        erkennbar machen. Eine Trennlinie ist ausgenommen. Mit einem einzigen
        Token wird entweder die Trennlinie unnoetig hart oder das Eingabefeld
        unzulaessig blass.
      </p>
      <div style="display:flex;gap:24px;flex-wrap:wrap;align-items:center">
        <div style="width:220px">
          <div style="border-top:1px solid var(--border-subtle,var(--fnd-color-border-secondary));padding-top:8px">
            <code style="font-size:11px">--border-subtle</code>
          </div>
        </div>
        <div style="width:220px">
          <input type="text" placeholder="Eingabefeld" style="width:100%;font:inherit;font-size:.85rem;padding:8px 12px;border-radius:6px;background:transparent;color:inherit;border:1px solid var(--border-control,var(--fnd-color-border-mid-dark))">
          <code style="font-size:11px;display:block;margin-top:6px">--border-control &middot; 3,11</code>
        </div>
      </div>
    </div>
    <div>
      <h3 style="font-size:var(--fs-base);margin:0 0 8px">Fokus in zwei Schichten</h3>
      <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);max-width:64ch;margin:0 0 14px">
        Ein einfarbiger Ring muesste auf jeder Flaeche 3:1 erreichen, auch auf
        dem Akzentknopf. Das schafft keine einzelne Farbe. Innen dunkel, aussen
        hell: auf hellen Flaechen traegt der innere, auf dunklen der aeussere.
      </p>
      <div style="display:flex;gap:20px;flex-wrap:wrap">
        <span style="background:#ffffff;padding:16px 20px;border-radius:6px;border:1px solid var(--fnd-color-border-primary)">
          <button style="font:inherit;font-size:.85rem;font-weight:600;padding:8px 16px;border-radius:8px;border:none;background:#37e93d;color:#000;outline:2px solid #161816;outline-offset:2px;box-shadow:0 0 0 4px #f9fbf9">Auf Akzent</button>
        </span>
        <span style="background:#161816;padding:16px 20px;border-radius:6px">
          <button style="font:inherit;font-size:.85rem;font-weight:600;padding:8px 16px;border-radius:8px;border:none;background:#292b29;color:#f1f3f1;outline:2px solid #161816;outline-offset:2px;box-shadow:0 0 0 4px #f9fbf9">Auf dunkel</button>
        </span>
      </div>
    </div>
  </div>`,
};

export const Links = {
  name: 'Links',
  render: () => `<div style="padding:24px;max-width:64ch">
    <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);margin:0 0 16px">
      Textfarbe, leicht gefettet, abgesetzter Unterstrich im Akzent. Der Akzent
      ist absichtlich <b>nicht</b> die Schriftfarbe — als Schrift auf Weiss
      erreicht er 1,63. Der Unterstrich dagegen ist kein Text; fuer ihn gelten
      die 3:1 aus WCAG 1.4.11, und <code>--accent-line</code> erfuellt sie mit 3,91.
      Beim Ueberfahren wird er dicker statt bunter: Ein Farbwechsel wuerde die
      Unterscheidung wieder allein der Farbe ueberlassen.
    </p>
    <p style="font-size:1rem;line-height:1.7">
      Ein Satz mit einem
      <a href="#" style="color:inherit;font-weight:550;text-decoration:underline;text-decoration-color:#009612;text-decoration-thickness:2px;text-underline-offset:3px;text-decoration-skip-ink:auto">Verweis auf eine andere Seite</a>
      mitten im Fliesstext, der sich abhebt, ohne zu schreien. Die Unterlaengen
      von g, j und p bleiben frei, weil der Strich sie umgeht.
    </p>
  </div>`,
};
