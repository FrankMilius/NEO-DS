#!/usr/bin/env python3
"""Kapitel 02 Logo ins Markenbuch (brand-neu.html) schreiben.
Ersetzt die Sektion s02 komplett; Figuren entstehen aus den Pfaden in assets/logo.
Bricht ab, statt eine halbe Datei zu hinterlassen."""
import re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
B = pathlib.Path(__file__).resolve().parent / 'brand-neu.html'
L = ROOT / 'assets' / 'logo'
s = B.read_text(encoding='utf-8')

def paths(name, fill='currentColor'):
    t = (L / f'{name}.svg').read_text()
    body = re.search(r'<svg[^>]*>(.*)</svg>', t, re.S).group(1).strip()
    body = re.sub(r'fill="#[0-9A-Fa-f]{6}"', f'fill="{fill}"', body)
    vb = re.search(r'viewBox="([^"]+)"', t).group(1)
    return vb, body

def wortmarke(name, height, fill='currentColor', extra=''):
    vb, body = paths(name, fill)
    w, h = [float(x) for x in vb.split()[2:]]
    return f'<svg viewBox="{vb}" height="{height}" width="{height * w / h:.1f}" role="img" aria-label="{name}" {extra}>{body}</svg>'

def node(name, size, extra=''):
    t = (L / f'{name}.svg').read_text()
    body = re.search(r'<svg[^>]*>(.*)</svg>', t, re.S).group(1).strip()
    vb = re.search(r'viewBox="([^"]+)"', t).group(1)
    return f'<svg viewBox="{vb}" width="{size}" height="{size}" role="img" aria-label="Node" {extra}>{body}</svg>'

# ── Konstruktionsfigur: Pfade bei Schriftgrad 320, u = 40.32 ─────────────────
U = 0.126 * 320; OV = 14 / 1000 * 320
vb, body = paths('neocosmo', '#161816')
W, H = 1536, 168
base = H - OV; xh = OV; cap = base - 0.7 * 320; desc = base + 0.2 * 320
vbx, vby, vbw, vbh = -60, cap - 60, W + 320, (desc - cap) + 120
dots = ''.join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="1.2" fill="#afb2af"/>' for y in [base - i * U for i in range(0, 6)] + [base + U] for x in [i * U for i in range(0, int(W / U) + 2)])
lines = ''.join(f'<line x1="{vbx}" y1="{y:.1f}" x2="{vbx + vbw}" y2="{y:.1f}" stroke="#0079ad" stroke-width="1" stroke-dasharray="5 4"/>' for y in (cap, xh, base, desc))
labels = ''.join(f'<text x="{W + 30}" y="{y + dy:.1f}" font-family="JetBrains Mono, monospace" font-size="11" fill="#0079ad">{t}</text>' for y, t, dy in ((cap, 'OBERLÄNGE 5,5 u', -4), (xh, 'x-HÖHE 4 u', -4), (base, 'GRUNDLINIE', 12), (desc, 'UNTERLÄNGE 1,6 u', 12)))
fig_konstruktion = f'''<figure><svg viewBox="{vbx} {vby:.1f} {vbw} {vbh:.1f}" role="img" aria-label="Konstruktionsraster der Wortmarke: Grundraster aus Stammbreiten, Oberlänge, x-Höhe, Grundlinie, Unterlänge"><rect x="{vbx}" y="{vby:.1f}" width="{vbw}" height="{vbh:.1f}" fill="#f1f3f1"/>{dots}{lines}<rect x="0" y="{xh:.1f}" width="{U:.2f}" height="{base - xh:.1f}" fill="#37e93d" opacity=".85"/>{body}{labels}</svg><figcaption><b>Grundraster und Konstruktion.</b> Punkte im Abstand u = 126 Tausendstel des Gevierts, die Stammbreite des fetten n (grün markiert). x-Höhe 4 u, Versal- und Oberlänge 5,5 u, Unterlänge 1,6 u. Die Pfade sind aus Space Grotesk 700 und 400 gewandelt, Laufweite −2 und −1 Prozent.</figcaption></figure>'''

# ── Lockup-Figur: neo workplace bei 200, u2 = 25.2 ───────────────────────────
U2 = 0.126 * 200
vb2, body2 = paths('neo-workplace', '#161816')
W2, H2 = 1336, 180
base2 = H2 - 0.2 * 200; neo_ink = 330  # gemessen in Figma: Tinte von neo bei Schriftgrad 200
fig_lockup = f'''<figure><svg viewBox="-40 -40 {W2 + 80} {H2 + 110}" role="img" aria-label="Lockup-Raster: Marke und Produktname mit einem Abstand von zwei Stammbreiten"><rect x="-40" y="-40" width="{W2 + 80}" height="{H2 + 110}" fill="#f1f3f1"/><rect x="0" y="0" width="{neo_ink}" height="{H2}" fill="none" stroke="#0079ad" stroke-width="1"/><rect x="{neo_ink + 2 * U2:.1f}" y="0" width="{W2 - neo_ink - 2 * U2:.1f}" height="{H2}" fill="none" stroke="#0079ad" stroke-width="1"/><rect x="{neo_ink}" y="{base2 - 496 / 1000 * 200:.1f}" width="{2 * U2:.1f}" height="{496 / 1000 * 200:.1f}" fill="#37e93d" opacity=".85"/>{body2}<g font-family="JetBrains Mono, monospace" font-size="11" fill="#595c59"><text x="0" y="{H2 + 26}">MARKE · 700</text><text x="{neo_ink - 6}" y="{H2 + 26}">2 u</text><text x="{neo_ink + 2 * U2:.1f}" y="{H2 + 26}">PRODUKT · 400 · EIN WORT, KLEIN, HÖCHSTENS ZWÖLF ZEICHEN</text></g></svg><figcaption><b>Lockup.</b> Der Produktname beginnt zwei Stammbreiten nach der Tinte des o — nicht nach dem Wortraum der Schrift. Wechselt der Name, ändert sich nur der rechte Kasten. Die Familie „neocosmo" hat den Abstand 0: Sie ist die Marke, kein Produkt.</figcaption></figure>'''

# ── Schutzraum und Node ───────────────────────────────────────────────────────
sr = 4 * U
fig_schutz = f'''<figure><svg viewBox="{-sr - 40:.1f} {cap - sr - 40:.1f} {W + 2 * sr + 560:.1f} {(desc - cap) + 2 * sr + 80:.1f}" role="img" aria-label="Schutzraum von einer x-Höhe um die Wortmarke und der Node mit dem n"><rect x="{-sr - 40:.1f}" y="{cap - sr - 40:.1f}" width="{W + 2 * sr + 560:.1f}" height="{(desc - cap) + 2 * sr + 80:.1f}" fill="#f1f3f1"/><rect x="{-sr:.1f}" y="{cap - sr:.1f}" width="{W + 2 * sr:.1f}" height="{(desc - cap) + 2 * sr:.1f}" fill="none" stroke="#0079ad" stroke-width="1" stroke-dasharray="5 4"/><rect x="0" y="{cap:.1f}" width="{W}" height="{desc - cap:.1f}" fill="none" stroke="#0079ad" stroke-width="1"/><rect x="{-sr:.1f}" y="{xh:.1f}" width="{sr:.1f}" height="{base - xh:.1f}" fill="#37e93d" opacity=".5"/>{body}<g transform="translate({W + sr + 120:.1f} {cap - 20:.1f})">{node('node', 8 * U).replace('<svg', '<svg x="0" y="0"')}<line x1="-16" y1="{0.746 * 8 * U:.1f}" x2="{8 * U + 16:.1f}" y2="{0.746 * 8 * U:.1f}" stroke="#37e93d" stroke-width="1"/><line x1="-16" y1="{0.746 * 8 * U - 4 * U:.1f}" x2="{8 * U + 16:.1f}" y2="{0.746 * 8 * U - 4 * U:.1f}" stroke="#37e93d" stroke-width="1"/><text x="0" y="{8 * U + 26:.1f}" font-family="JetBrains Mono, monospace" font-size="11" fill="#595c59">NODE 8 u · n AUF 4 u</text></g><text x="{-sr:.1f}" y="{cap - sr - 12:.1f}" font-family="JetBrains Mono, monospace" font-size="11" fill="#595c59">SCHUTZRAUM 4 u = EINE x-HÖHE, AUF ALLEN SEITEN</text></svg><figcaption><b>Schutzraum und Node.</b> Eine x-Höhe ist wenig — absichtlich, weil das Logo an Ebenenkanten angeschnitten und auf Flächen gesetzt werden darf. Der Node ist ein Quadrat von 8 u ohne Rundung; das n sitzt auf 4 u, halbe Kante Buchstabe, halbe Kante Luft.</figcaption></figure>'''

def stage(bg, ink, cap_text, node_name, extra_style=''):
    return f'''<div style="background:{bg};color:{ink};border:1px solid var(--border);padding:34px 32px;display:flex;flex-wrap:wrap;gap:28px 56px;align-items:center;margin-bottom:1px;{extra_style}">{wortmarke('neocosmo', 40)}{wortmarke('neo-workplace', 43)}{node(node_name, 40)}<span style="font-family:var(--f-tech);font-size:10px;letter-spacing:.13em;text-transform:uppercase;opacity:.62;flex-basis:100%">{cap_text}</span></div>'''

gruende = ''.join([
    stage('#ffffff', '#161816', 'Weiß · Tinte Graphit 950 · 17,9', 'node'),
    stage('#f1f3f1', '#161816', 'Graphit 100 · Tinte Graphit 950 · 16,0', 'node'),
    stage('#efffe6', '#161816', 'Mint · Tinte Graphit 950 · 17,1', 'node'),
    stage('#161816', '#f1f3f1', 'Graphit 950 · Tinte Graphit 100 · 16,0', 'node-graphit100'),
    stage('#0c4146', '#efffe6', 'Forest · Tinte Mint · 10,8', 'node-mint'),
])

sizes = ''.join(f'<div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start">{wortmarke("neocosmo", round(fs * 168 / 320, 2))}<span style="font-family:var(--f-tech);font-size:10px;letter-spacing:.12em;color:var(--faint)">{fs} PX{" · GRENZE" if fs == 14 else ""}</span></div>' for fs in (12, 14, 16, 24, 32, 48, 96))
favs = ''.join(f'<div style="display:flex;flex-direction:column;gap:8px;align-items:center">{node("node", sz)}<span style="font-family:var(--f-tech);font-size:10px;letter-spacing:.12em;color:var(--faint)">{sz}</span></div>' for sz in (16, 32, 48, 64, 128)) + f'<div style="display:flex;flex-direction:column;gap:8px;align-items:center">{node("node-signal", 128)}<span style="font-family:var(--f-tech);font-size:10px;letter-spacing:.12em;color:var(--faint)">128 · SIGNAL-NODE</span></div>'

neu = f'''<section id="s02">
  <div class="shead">
    <div class="snum">02</div>
    <div>
      <h2>Logo</h2>
      <p class="sdek">Eine Wortmarke in zwei Gewichten und ein Node. Entschieden am 5. September 2026: Space Grotesk statt Manrope, das Gewichtspaar 700 und 400, eine Einheit für alle Maße, das Favicon als Node, die Tinten des Systems statt eigener Farben, die Schreibweise überall klein. Das Zeichen zeigt das Systemgesetz, es illustriert es nicht.</p>
    </div>
  </div>

  <div class="law">
    <p>neo ist die Marke. Alles danach ist Beschreibung.</p>
    <p class="src">Das Zeichen · entschieden 05.09.2026</p>
  </div>

  <div class="subhead"><span>2.1</span><h3>Das Zeichen</h3></div>
  <div class="prose">
    <p>Das Logo ist ein Wort in zwei Gewichten: <em>neo</em> fett, der Rest regulär. Es gibt kein Symbol, keine Farbe, keinen Effekt. Das ist keine Sparsamkeit, sondern die Aussage des Systems in seiner kürzesten Form — <em>ein Element trägt die Betonung, alles andere tritt in einer Form zurück.</em> Relevanz für jeden: Das Wichtige ist hervorgehoben. Klarheit für alle: mit einem Mittel, das überall gleich funktioniert.</p>
    <p>Daraus folgt die Architektur. „neocosmo" ist die Familie, ein Wort ohne Abstand. „neo workplace" und „neo app" sind Produkte: dieselbe Marke, ein beschreibender Zusatz im leichten Gewicht, zwei Stammbreiten entfernt. Wer ein neues Produkt benennt, braucht kein neues Logo, sondern ein Wort.</p>
  </div>
  <div style="background:var(--surface);border:1px solid var(--border);padding:44px 40px;display:flex;flex-wrap:wrap;gap:36px 64px;align-items:center;margin-bottom:20px">
    <div style="display:flex;flex-direction:column;gap:14px">{wortmarke('neocosmo', 72)}<span style="font-family:var(--f-tech);font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--faint)">Familie · ein Wort</span></div>
    <div style="display:flex;flex-direction:column;gap:14px">{wortmarke('neo-workplace', 77)}<span style="font-family:var(--f-tech);font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--faint)">Produkt · Abstand 2 u</span></div>
    <div style="display:flex;flex-direction:column;gap:14px">{wortmarke('neo-app', 61)}<span style="font-family:var(--f-tech);font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--faint)">Produkt · Abstand 2 u</span></div>
    <div style="display:flex;flex-direction:column;gap:14px">{node('node', 88)}<span style="font-family:var(--f-tech);font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--faint)">Node · Favicon</span></div>
  </div>

  <div class="grid g3">
    <div class="card"><p class="lbl">Warum Space Grotesk</p><h3>Die Markenstimme</h3><p>Kapitel 03 gibt Space Grotesk alles, was die Marke sagt. Ein Logo ist die knappste Markenaussage — in Manrope spräche es in der Stimme seiner Fußnoten. Dazu haben e, c und s waagerechte Enden, die in „neocosmo" dreimal fallen: Charakter, ohne einen Buchstaben zu verbiegen.</p></div>
    <div class="card"><p class="lbl">Warum 700 gegen 400</p><h3>Ein Kontrast, der klein überlebt</h3><p>Die Stämme messen 126 gegen 79 Tausendstel — 1,6 zu 1. Das ist auf 72 px sichtbar und auf 14 px noch da. Manrope 800 gegen 200 wäre 3,2 zu 1 und unter 40 px weg. Ein Logo, das seine Pointe nur groß erzählen kann, hat sie nicht.</p></div>
    <div class="card"><p class="lbl">Warum kein Symbol</p><h3>Die Kategorie hat genug davon</h3><p>Fünf der acht Wettbewerber tragen ein Symbol, fünf sind blau, drei versal, zwei spielen mit einem Buchstaben. Keiner nutzt Gewichtskontrast als Markenarchitektur. Die reine Wortmarke ist Category Fit und Unterscheidung zugleich.</p></div>
  </div>

  <div class="subhead"><span>2.2</span><h3>Konstruktion</h3></div>
  <div class="prose">
    <p>Alle Maße sind Vielfache einer Einheit: <em>u ist die Stammbreite des fetten n</em>, 126 Tausendstel des Gevierts. Die x-Höhe von Space Grotesk 700 misst 496 Tausendstel, also 3,94 u — sie wird auf 4 u gesetzt, die Abweichung ist die Rundung, die die Pfadwandlung ohnehin braucht. Auf 72 px ist u 9 px, auf 16 px sind es 2 px.</p>
  </div>
  <div class="tbl"><table>
    <thead><tr><th scope="col">Maß</th><th scope="col" class="r">In u</th><th scope="col" class="r">Tausendstel</th><th scope="col">Gilt für</th></tr></thead>
    <tbody>
      <tr><td>Stammbreite des n, Gewicht 700</td><td class="m r">1</td><td class="m r">126</td><td>die Einheit</td></tr>
      <tr><td>Stammbreite, Gewicht 400</td><td class="m r">0,63</td><td class="m r">79</td><td>der Zusatz</td></tr>
      <tr><td>x-Höhe</td><td class="m r">4</td><td class="m r">496</td><td>Schutzraum, Node</td></tr>
      <tr><td>Versal- und Oberlänge</td><td class="m r">5,5</td><td class="m r">700</td><td>Lockup-Kästen</td></tr>
      <tr><td>Unterlänge</td><td class="m r">1,6</td><td class="m r">200</td><td>Lockup-Kästen</td></tr>
      <tr><td>Abstand Marke zu Produkt, Tinte zu Tinte</td><td class="m r">2</td><td class="m r">252</td><td>Produkte</td></tr>
      <tr><td>Schutzraum auf allen Seiten</td><td class="m r">4</td><td class="m r">496</td><td>Wortmarke und Produkte</td></tr>
      <tr><td>Node, Kantenlänge</td><td class="m r">8</td><td class="m r">1008</td><td>Favicon, App-Icon, Avatar</td></tr>
      <tr><td>Laufweite neo · Zusatz</td><td class="m r">—</td><td class="m r">−20 · −10</td><td>Ausgangswerte vor der Unterschneidung</td></tr>
    </tbody>
  </table></div>
  {fig_konstruktion}
  {fig_lockup}
  {fig_schutz}

  <div class="subhead"><span>2.3</span><h3>Familie</h3></div>
  <div class="grid g3">
    <div class="card"><p class="lbl">Regel</p><h3>Ein Wort, klein, höchstens zwölf Zeichen</h3><p>Der Zusatz beschreibt, er benennt nicht. „workplace" und „app" erfüllen das. Bindestrich, Ziffer oder Versalie im Zusatz verlassen die Familie und brauchen eine eigene Entscheidung.</p></div>
    <div class="card"><p class="lbl">Regel</p><h3>Die Familie hat keinen Abstand</h3><p>„neocosmo" ist ein Wort und bleibt eines. Es steht für die Produktwelt, nie für ein einzelnes Produkt. Wo die Familie gemeint ist, steht kein Zusatz.</p></div>
    <div class="card"><p class="lbl">Offen</p><h3>PIIPE</h3><p>Die Produktmarke PIIPE steht heute neben neocosmo. Wird PIIPE zu „neo workplace", ist die Familie geschlossen. Bleibt PIIPE, braucht es eine Regel für zwei Markensysteme nebeneinander — die ist schwerer als jedes Logo.</p></div>
  </div>

  <div class="subhead"><span>2.4</span><h3>Der Node</h3></div>
  <div class="prose">
    <p>Auf 16 px ist ein Wort kein Logo mehr. Dort übernimmt das kleinste Element des Systems: ein Node aus Kapitel 05, ein Quadrat ohne Rundung, mit dem n aus derselben Zeichnung. Die Grundfassung ist Tinte auf Tinte — Graphit 950 mit Graphit 100. Lime bekommt der Node nur dort, wo er der eine bunte Node der Komposition sein darf: im Browser-Tab, auf dem Homescreen. Im Logo selbst gibt es keine Farbe.</p>
  </div>
  <div style="background:var(--surface);border:1px solid var(--border);padding:34px 32px;display:flex;flex-wrap:wrap;gap:28px 36px;align-items:flex-end;margin-bottom:20px">{favs}</div>

  <div class="subhead"><span>2.5</span><h3>Gründe und Tinten</h3></div>
  <div class="prose">
    <p>Das Logo hat keine Farbe. Es nimmt die Tinte, die Kapitel 04 auf dem jeweiligen Grund für Text vorsieht. Weiß gibt es im System nicht als Tinte, auch nicht für das Logo. Auf Bild gilt Kapitel 09: nur auf ruhigen, dunklen Bildstellen oder auf einer Tafel.</p>
  </div>
  {gruende}
  <p class="note" style="margin-top:16px">Kontrastwerte nach WCAG 2.1 aus der Kombinationsmatrix in 4.6.</p>

  <div class="subhead"><span>2.6</span><h3>Größen</h3></div>
  <div style="background:var(--surface);border:1px solid var(--border);padding:34px 32px;display:flex;flex-wrap:wrap;gap:28px 40px;align-items:baseline;margin-bottom:20px">{sizes}</div>
  <div class="grid g3">
    <div class="card"><p class="lbl">Bildschirm</p><h3>Mindestens 14 px Schriftgrad</h3><p>Das sind 7 px x-Höhe. Darunter zeigt der Node oder das Wort in einem Gewicht — unter 7 px werden zwei Gewichte eines.</p></div>
    <div class="card"><p class="lbl">Druck</p><h3>x-Höhe mindestens 2 mm</h3><p>Etwa 4 mm Schriftgrad. Visitenkarte und Kugelschreiber reichen; darunter der Node, in Sonderfarbe oder Prägung.</p></div>
    <div class="card"><p class="lbl">Groß</p><h3>Ab 96 px enger</h3><p>Messewand und Titelfolie setzen „neo" auf −3 Prozent — die Headline-Regel aus Kapitel 03. Das Logo ist dann die Headline.</p></div>
  </div>

  <div class="subhead"><span>2.7</span><h3>Schreibweise</h3></div>
  <div class="verdict">
    <p><strong>Überall klein.</strong> neo, neocosmo, neo workplace und neo app werden auch im Fließtext klein geschrieben — am Satzanfang ebenso. Es gibt keine Versalfassung, weder als „NEO" noch als „Neocosmo". Die Firmierung „NEOCOSMO GmbH" ist Recht, keine Marke, und steht nur im Impressum und in Verträgen.</p>
    <p><em>Folge:</em> Markenbuch, Website, Folien und Signaturen schreiben heute „NEO" und „NEOCOSMO" versal. Sie werden nachgezogen; bis dahin gilt: neue Texte klein, alte beim nächsten Anfassen.</p>
  </div>

  <div class="subhead"><span>2.8</span><h3>Was nicht geht</h3></div>
  <div class="cols">
    <ul>
      <li><b>Weiß als Tinte.</b> Auf dunklem Grund steht Graphit 100, auf Forest Mint.</li>
      <li><b>Eine eigene Farbe.</b> Kein Lime, kein Blau, kein Verlauf im Wort.</li>
      <li><b>Rundung am Node.</b> Der Node ist ein Quadrat; ein gerundetes Quadrat ist ein App-Icon von jemand anderem.</li>
      <li><b>Schatten, Kontur, Effekt.</b> Das Logo liegt auf dem Grund, es schwebt nicht.</li>
    </ul>
    <ul>
      <li><b>Drehen, dehnen, stauchen.</b> Die Pfade werden proportional skaliert, sonst nichts.</li>
      <li><b>Ein Symbol davor.</b> Auch nicht „nur für die Messe".</li>
      <li><b>Eine andere Schrift.</b> Die Pfade sind die Schrift. Wer das Logo tippt, hat es nicht.</li>
      <li><b>Ein Zusatz mit Versalie, Ziffer oder Bindestrich.</b> Das ist eine Entscheidung, keine Anwendung.</li>
    </ul>
  </div>

  <div class="subhead"><span>2.9</span><h3>Dateien</h3></div>
  <div class="tbl"><table>
    <thead><tr><th scope="col">Datei</th><th scope="col">Tinte</th><th scope="col">Wofür</th></tr></thead>
    <tbody>
      <tr><td class="m">neocosmo.svg · neo-workplace.svg · neo-app.svg</td><td>Graphit 950</td><td>Papier, Weiß, Mint</td></tr>
      <tr><td class="m">*-graphit100.svg</td><td>Graphit 100</td><td>auf Graphit 950</td></tr>
      <tr><td class="m">*-mint.svg</td><td>Mint</td><td>auf Forest</td></tr>
      <tr><td class="m">node.svg · node-graphit100.svg · node-mint.svg</td><td>Fläche in Tinte, n im Grund</td><td>Favicon, App-Icon, Avatar</td></tr>
      <tr><td class="m">node-signal.svg</td><td>Lime 500, n Graphit 950</td><td>nur als Signal-Node im Tab</td></tr>
      <tr><td class="m">node-16 · 32 · 48 · 64 · 180 · 512.png · favicon.ico</td><td>gerastert</td><td>Favicon, Apple Touch, PWA</td></tr>
    </tbody>
  </table></div>
  <p class="note">Ablage: <code>assets/logo/</code> im Design-System-Repository, Quelle die Rahmen „02 Logo" in der Figma-Datei „NEO Brand Styleguide" mit den Komponenten Logo / neocosmo, neo workplace, neo app und Node. Die Konstruktionsraster liegen dort als schaltbare Ebenen.</p>

  <div class="subhead"><span>2.10</span><h3>Offen</h3></div>
  <div class="grid g3">
    <div class="card"><p class="lbl">Handarbeit</p><h3>Unterschneidung</h3><p>Die Pfade tragen die Ausgangslaufweiten. Die Paare „ne", „eo", „oc", „sm" und „mo" sind noch nicht von Hand geprüft; danach ist die Zeichnung endgültig.</p></div>
    <div class="card"><p class="lbl">Recht</p><h3>Markenrecherche</h3><p>„neo" allein ist nicht schützbar und mehrfach belegt. Schutzfähig ist „neocosmo" als Wort und das Zeichen als Ganzes — Recherche bei DPMA und EUIPO in den Klassen 9, 35 und 42.</p></div>
    <div class="card"><p class="lbl">Bewegung</p><h3>Eine erlaubte Animation</h3><p>Erscheint das Logo animiert, blendet der Zusatz ein und „neo" steht. Keine Morphs, keine Partikel. Ausgeführt wird das erst, wenn ein Anlass da ist.</p></div>
  </div>
</section>'''

m = re.search(r'<section id="s02">.*?</section>', s, re.S)
if not m: sys.exit('Sektion s02 nicht gefunden')
s = s[:m.start()] + neu + s[m.end():]

# Nebenstellen: Logo ist nicht mehr offen
fehler = []
def rep(alt, neu_, mal=1):
    global s
    n = s.count(alt)
    if n != mal: fehler.append(f'{n}× statt {mal}×: {alt[:70]}'); return
    s = s.replace(alt, neu_)
rep('<div><dt>Offen</dt><dd>Signalfarbe, Logo</dd></div>', '<div><dt>Offen</dt><dd>Signalfarbe, PIIPE</dd></div>')
rep('Was offen ist, steht als offen markiert — das Logo und die Signalfarbe.', 'Was offen ist, steht als offen markiert — die Signalfarbe und das Verhältnis zu PIIPE.')
rep('<p><b>Änderungen 009 → 010:</b> ', '<p><b>Änderungen 009 → 010:</b> <b>Kapitel 02 Logo</b> ist geschrieben und nicht mehr zurückgestellt: Wortmarke in Space Grotesk 700/400, Konstruktion nach der Einheit u, Familie, Node, Gründe, Größen, Schreibweise klein, Dateien (entschieden am 05.09.2026, Arbeitspapier „Das neo Zeichen"). ')
if fehler: sys.exit('ABBRUCH:\n' + '\n'.join(fehler))
B.write_text(s, encoding='utf-8')
print('Kapitel 02 geschrieben,', len(s), 'Zeichen')
