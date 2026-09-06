#!/usr/bin/env python3
"""neo brand 011 → 012: Kapitel 05 wird „Betonung“ (ein echtes Kapitel), Kapitel 06 bekommt den
Vorschlag „Beziehung ist Anordnung“, Kapitel 07 reale Folienbeispiele zu allen Wireframes,
Signalfarbe entschieden (Lime; Forest als Tinte), Artefakt-Akzent von Blau auf Forest/Lime.
Anker-Skript, bricht bei jedem unpassenden Anker ab."""
import re, sys, base64, pathlib
H = pathlib.Path(__file__).resolve().parent
B = H / 'brand-neu.html'
SHOTS = pathlib.Path('/private/tmp/claude-501/-Users-frank-milius-Sites-WEBSITE26/16d9b9eb-0eb2-495b-9652-638fd26a4124/scratchpad/shots')
s = B.read_text(encoding='utf-8'); fehler = []
N = '<span class="mk">neo</span>'
def rep(a, b, mal=1):
    global s
    n = s.count(a)
    if n != mal: fehler.append(f'{n}× statt {mal}×: {a[:90]}'); return
    s = s.replace(a, b)
def vor(anker, neu):
    """Fuegt neu VOR dem einmaligen Anker ein."""
    global s
    if s.count(anker) != 1: fehler.append(f'vor: {s.count(anker)}×: {anker[:80]}'); return
    s = s.replace(anker, neu + anker)
def nach_figure(capstart, neu):
    """Fuegt neu nach dem </figure> ein, dessen figcaption mit capstart beginnt."""
    global s
    i = s.find(capstart)
    if i < 0 or s.count(capstart) != 1: fehler.append(f'figure: {s.count(capstart)}×: {capstart[:60]}'); return
    j = s.find('</figure>', i) + len('</figure>')
    s = s[:j] + neu + s[j:]
def img(name, alt):
    p = SHOTS / f'{name}.jpg'
    if not p.exists(): fehler.append(f'Bild fehlt: {name}'); return ''
    return f'<img src="data:image/jpeg;base64,{base64.b64encode(p.read_bytes()).decode()}" alt="{alt}" loading="lazy">'
def shot(name, alt, cap, quelle):
    return f'<figure class="shot">{img(name, alt)}<figcaption>{cap} <span class="src">{quelle}</span></figcaption></figure>'
def shot2(a, b):
    return f'<div class="shot2">{a}{b}</div>'
PI = 'PIIPE-Präsentation, Figma'; BR = 'Brand-Deck, Figma'

# ── 0 CSS fuer Folienbilder ─────────────────────────────────────────────
_fc = re.search(r'figcaption\{[^}]*\}', s).group(0)
rep(_fc,
    _fc + '\n'
    'figure.shot img{display:block;width:100%;height:auto}\n'
    'figure.shot figcaption .src{display:block;margin-top:4px;font-family:var(--f-tech);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--faint)}\n'
    '.shot2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:0 0 20px}\n.shot2 figure{margin:0}\n'
    '@media (max-width:760px){.shot2{grid-template-columns:1fr}}')

# ── 1 Version ──────────────────────────────────────────────────────────
rep('<title>neo brand 011</title>', '<title>neo brand 012</title>')
rep(f'<p class="code">{N.replace("neo","neo brand")} 011 · Living Document · 06.09.2026</p>', f'<p class="code">{N.replace("neo","neo brand")} 012 · Living Document · 06.09.2026</p>')
rep(f'<p><b>{N.replace("neo","neo brand")} 011</b> — Living Document, 6. September 2026.', f'<p><b>{N.replace("neo","neo brand")} 012</b> — Living Document, 6. September 2026.')
rep('<dt>Version</dt><dd>011</dd>', '<dt>Version</dt><dd>012</dd>')
rep('<dt>Offen</dt><dd>Signalfarbe, PIIPE</dd>', '<dt>Offen</dt><dd>PIIPE, Anordnungen (Kapitel 06)</dd>')

# ── 2 Artefakt-Akzent: Blau raus, Forest als Tinte, Lime als Marke ─────
rep('--signal:#0079ad;', '--lime:#37e93d; --forest:#16494d;\n    --signal:var(--forest); /* Akzent als Tinte: Forest 700, 10:1 auf Papier. Lime nur als Marke, nie als Schrift auf hellem Grund. */')

# ── 3 Kapitel 04: Signalfarbe ist entschieden ──────────────────────────
rep('Das Signal ist die einzige offene Entscheidung im gesamten Dokument, und sie gehört der Unternehmensleitung.',
    'Das Signal ist am 06.09.2026 entschieden: <b>Lime</b>, durchgehend und auch in den Artefakten; wo Lime als Schrift auf hellem Grund die Kontraste nicht erreicht, tritt Forest an seine Stelle (Kapitel 05.3).')
rep('<p>Vier Kandidaten stehen zur Wahl. Neu hinzugekommen ist <em>Green</em>',
    '<p>Vier Kandidaten standen zur Wahl; die Bewertung bleibt als Begründung stehen. Zuletzt hinzugekommen war <em>Green</em>')
rep('<p><b>Arbeitsstand zur Signalfarbe.</b> Die Entscheidung ist weiterhin offen und gehört der Unternehmensleitung. Gearbeitet wird bis dahin mit <b>Lime</b> als Signal;',
    '<p><b>Entscheidung zur Signalfarbe (06.09.2026).</b> <b>Lime</b> ist das Signal — auf Folien, im Web, im Druck und in den Artefakten des Markenbuchs; <span class="mk">neo blue</span> hat keine Signalrolle mehr und bleibt nur als Ebenenfarbe „Daten und KI" in Diagrammen (4.2.d).')
rep('Ein Hinweis für die Signalentscheidung: Bei <span class="mk">neo blue</span> oder Magenta ist das Feld eine reine Prozessfarbe und im Druck unkritisch. Bei Green oder Lime wäre es die größtmögliche Fläche der am schlechtesten reproduzierbaren Farbe — siehe 4.14.</p>',
    'Für den Druck heißt das: Mit Lime ist das Signalfeld die größtmögliche Fläche der am schlechtesten reproduzierbaren Farbe — siehe 4.14; dort steht Green als Druckfassung.</p>')
rep('Fiele die Signalentscheidung auf <span class="mk">neo blue</span> oder Magenta, wäre Salbei sofort wieder verfügbar.',
    'Mit der Entscheidung für Lime bleibt Salbei in der Reserve.')
rep('Die Ebenenfarben aus Kapitel 05 — <b>Menschen</b> Orange', 'Die Ebenenfarben — <b>Menschen</b> Orange')

# ── 4 Kapitel 01: Verweise ─────────────────────────────────────────────
rep('Flächen ohne Transparenz (Kapitel 07), Formen in Diagrammen (05), Beziehungen als Matrix (06)',
    'die Betonung im Einzelnen (Kapitel 05), Beziehungen als Anordnung (06), Flächen ohne Transparenz (07)')

# ── 5 Kapitel 05: Betonung ─────────────────────────────────────────────
k05 = f'''<section id="s05">
  <div class="shead">
    <div class="snum">05</div>
    <div>
      <h2>Betonung</h2>
      <p class="sdek">Kapitel 03 liefert das Gewicht, Kapitel 04 die Signalfarbe. Dieses Kapitel sagt, wie aus beidem die eine Betonung wird — wo sie sitzt, wie groß sie ist, wann sie fehlt und woran man erkennt, dass sie falsch gesetzt ist.</p>
    </div>
  </div>
  <div class="law"><p>Eine Betonung je Aussage. Sie ist die Aussage.</p><p class="src">Aus dem einen Prinzip, Kapitel 01</p></div>
  <div class="prose">
    <p>Das eine Prinzip aus Kapitel 01 ist als Satz schnell gesagt und in der Anwendung die häufigste Fehlerquelle des Systems. Nicht, weil es zu viele Betonungen gäbe — sondern weil auf den meisten Folien, Seiten und Grafiken keine steht. Eine Folie, die etwas behauptet und nichts hervorhebt, ist nicht zurückhaltend, sie ist unentschieden. Der Betrachter muss dann selbst suchen, was gemeint ist, und das ist genau die Arbeit, die das Systemgesetz ihm abnehmen will: Relevanz für jeden, Klarheit für alle.</p>
    <p>Dieses Kapitel ist deshalb ein Arbeitskapitel. Es beschreibt zwei Mittel, eine Ausnahme, die erlaubte Null und die fünf Fehlerbilder — und zeigt an echten Folien aus beiden Präsentationen, wie die Betonung aussieht, wenn sie sitzt, und wie eine Folie aussieht, der sie fehlt.</p>
  </div>

  <div class="subhead"><span>5.1</span><h3>Gewicht — die Betonung für Wörter</h3></div>
  <div class="grid g3">
    <div class="card"><p class="lbl">Regel</p><h3>Ein Satzteil, nie ein Satz</h3><p>Fett ist ein Wort oder eine Wortgruppe von höchstens vier Wörtern in einer regulären Umgebung. Ein fetter Satz betont nichts, er ist nur laut. Die Wortmarke ist das Muster: <b>{N}</b> fett, der Zusatz regulär.</p></div>
    <div class="card"><p class="lbl">Wo</p><h3>Titel und Aussage</h3><p>In der Aussage-Überschrift (Vorlagen X1, X4, X5, X6, K1), in der Kernbotschaft einer Folie, im ersten Satz einer Karte. Im Fließtext höchstens einmal je Absatz, in Tabellen nur in der Zeile, um die es geht.</p></div>
    <div class="card"><p class="lbl">Gewicht</p><h3>Bold, nicht Medium</h3><p>Betont wird mit Bold 700 gegen Regular 400, dem Paar aus dem Logo. Medium 500 ist Lesbarkeit (Kleinfassung, Negativ), keine Betonung — zwei Stufen Abstand braucht das Auge, um den Unterschied als Absicht zu lesen.</p></div>
  </div>

  <div class="subhead"><span>5.2</span><h3>Signalfarbe — die Betonung für Werte und Marken</h3></div>
  <div class="grid g3">
    <div class="card"><p class="lbl">Regel</p><h3>Ein Wert, eine Marke, ein Feld</h3><p>Lime steht auf dem einen Balken, der einen Linie, dem einen Punkt in der Matrix, dem einen Signalfeld — an der Stelle, um die es geht. Es steht nie auf Fließtext, nie als Fläche unter Text, nie als Dekoration.</p></div>
    <div class="card"><p class="lbl">Menge</p><h3>Klein gegen groß</h3><p>Das Signal wirkt durch Seltenheit, nicht durch Größe. Ein 8-px-Punkt auf einer ruhigen Folie ist eine Betonung; eine halbe Folie in Lime ist ein Grund, und ein Grund betont nichts. Ausnahme: das Signalfeld (T2), das die ganze Aussage ist.</p></div>
    <div class="card"><p class="lbl">Grund</p><h3>Auf Forest oder Graphit, nie auf Papier als Schrift</h3><p>Lime als Schrift funktioniert nur auf dunklem Grund. Auf Papier ist Lime eine Marke (Punkt, Linie, Fläche mit dunkler Schrift) — als Schrift übernimmt Forest, siehe 5.3.</p></div>
  </div>

  <div class="subhead"><span>5.3</span><h3>Kontrast: wo Lime Schrift sein darf und wo Forest übernimmt</h3></div>
  <div class="prose">
    <p>Lime ist als Marke auf jedem Grund sichtbar, als Schrift nur auf dunklem. Das ist keine Geschmacksfrage, sondern Messung: WCAG verlangt für Schrift 4,5:1, für große Schrift und grafische Elemente 3:1. Die Tabelle nennt die Werte, aus denen die Regel folgt. Für Schrift auf hellem Grund übernimmt <b>Forest 700</b> — dieselbe Familie, nur als Tinte. So halten es seit 012 auch die Artefakte dieses Markenbuchs: Was hier als Akzentschrift und Akzentlinie erscheint, ist Forest; was als Marke erscheint, Lime.</p>
  </div>
  <div class="tbl"><table>
    <thead><tr><th scope="col">Kombination</th><th scope="col" class="r">Kontrast</th><th scope="col">Zulässig als</th></tr></thead>
    <tbody>
      <tr><td><span class="swatch" style="background:#37e93d"></span> Lime auf Papier (#ffffff … #f3f3ea)</td><td class="m r">1,6 : 1</td><td>Marke, Fläche mit Tinte darauf — <b>nie Schrift</b></td></tr>
      <tr><td><span class="swatch" style="background:#37e93d"></span> Lime auf Graphit 950</td><td class="m r">11,2 : 1</td><td>Schrift jeder Größe, Marke, Fläche</td></tr>
      <tr><td><span class="swatch" style="background:#37e93d"></span> Lime auf Forest 800 (#0c4146)</td><td class="m r">7,9 : 1</td><td>Schrift jeder Größe, Marke — das Signalfeld</td></tr>
      <tr><td><span class="swatch" style="background:#16494d"></span> Forest 700 auf Papier</td><td class="m r">10 : 1</td><td>Akzentschrift, Akzentlinie, Zahlenreihe auf hellem Grund</td></tr>
      <tr><td><span class="swatch" style="background:#161816"></span> Graphit 950 auf Lime</td><td class="m r">11,2 : 1</td><td>Tinte auf dem Signalfeld, auf der gefüllten Pill</td></tr>
    </tbody>
  </table></div>
  <p class="note">Sonderfall Zeichen: Das Plus und das Größer-als vor einer Kennzahl (5.4) sind grafische Elemente, keine Schrift, und ihre Bedeutung trägt die Zahl daneben. Sie dürfen auf Papier in Lime stehen, weil nichts verloren geht, wenn jemand sie nicht lesen kann. Sobald ein Zeichen allein die Aussage trägt, gilt die Schriftregel.</p>

  <div class="subhead"><span>5.4</span><h3>Die Reihe — die eine Ausnahme</h3></div>
  <div class="prose">
    <p>Drei bis fünf gleichwertige Werte dürfen dieselbe Stelle betonen: das Zeichen vor der Zahl, der Marker am Balken, der Punkt auf der Karte. Das ist kein Bruch des Prinzips, sondern seine Anwendung auf eine Komposition — die Reihe ist die Aussage, nicht das einzelne Element. Drei Bedingungen: gleichwertige Elemente, dieselbe Stelle je Element, und sonst nichts auf der Folie betont. Sobald eines der drei Elemente wichtiger ist als die anderen, trägt nur dieses den Akzent — und dann sagt die Folie etwas anderes.</p>
  </div>
  {shot('p-4-66', 'Folie Zahlen und Auszeichnungen: drei Kennzahlen, das Plus und die beiden Größer-als-Zeichen in Lime', '<b>Die Reihe.</b> Drei Kennzahlen, drei Zeichen in Lime an derselben Stelle — das Plus bei 60, das Größer-als bei 250.000 und 2,5 Mio. Nichts anderes auf der Folie ist betont; die Logos darunter stehen einfarbig. Die Zeichen sind grafische Elemente, die Zahl trägt die Bedeutung, darum darf Lime hier auf Papier stehen.', PI)}
  {shot2(
    shot('b-D4-53-41', 'Vorlage D4 Kleine Vielfache: sechs Liniendiagramme, eine Linie in Lime', '<b>Die eine in der Reihe.</b> Sechs gleiche Diagramme, eine Skala; nur die Linie, um die es geht, steht in Lime. Das ist der andere Fall: Die Elemente sind gleichwertig gebaut, aber eines ist die Aussage.', BR),
    shot('p-5-54', 'Folie Positionierung im Wettbewerb: Punktmatrix, ein Punkt in Lime', '<b>Ein Punkt in der Matrix.</b> Dreizehn Wettbewerber in Graphit, ein Punkt in Lime mit Ring. Die Betonung ist die Aussage der Folie; die Legende bestätigt nur, was das Auge schon weiß.', PI))}

  <div class="subhead"><span>5.5</span><h3>Keine Betonung — die erlaubte Null</h3></div>
  <div class="grid g3">
    <div class="card"><p class="lbl">Erlaubt</p><h3>Wo nichts behauptet wird</h3><p>Logowände, Listen, Tabellen als Beleg, Anhang, Glossar, Quellen, Trenner, Titel- und Abschlussfolien. Was nichts wichtiger macht als den Rest, hebt nichts hervor. Das ist Ruhe, kein Versäumnis.</p></div>
    <div class="card"><p class="lbl">Nicht erlaubt</p><h3>Wo behauptet wird</h3><p>Eine Aussage-Folie, eine Kennzahl, ein Vergleich, ein Diagramm, eine Empfehlung: Hier fehlt eine Betonung, wenn keine steht. Genau diese Folien sind heute in der Mehrzahl — siehe die beiden Beispiele unten.</p></div>
    <div class="card"><p class="lbl">Prüfung</p><h3>Die Frage</h3><p>„Behauptet diese Folie etwas?" Wenn ja: „Was ist der eine Satzteil, der eine Wert?" Wer die zweite Frage nicht beantworten kann, hat noch keine Folie, sondern Material.</p></div>
  </div>
  {shot2(
    shot('p-2-42', 'Folie Aussage: ein Satz in Bold ohne betonten Satzteil', '<b>So noch nicht.</b> Eine Aussage, die für sich steht — ganz in Bold gesetzt, also ohne Betonung: Der Satz ist laut, aber nichts darin tritt hervor. Richtig wäre Regular mit einem fetten Satzteil, oder das eine Wort in Forest.', PI),
    shot('b-K2-52-2', 'Vorlage K2 Drei Zahlen, alle drei gleich schwer in Tinte', '<b>So noch nicht.</b> Drei Zahlen, eine Lage — aber keine Reihe (kein gemeinsames Zeichen) und keine Hauptzahl. Die Vorlage behauptet und hebt nichts hervor. Nachzuziehen: entweder ein Reihenakzent an derselben Stelle oder die eine Zahl, die die Lage ist.', BR))}

  <div class="subhead"><span>5.6</span><h3>Betonung je Medium</h3></div>
  <div class="tbl"><table>
    <thead><tr><th scope="col">Medium</th><th scope="col">Mittel</th><th scope="col">Die eine Betonung</th><th scope="col">Was sonst gilt</th></tr></thead>
    <tbody>
      <tr><td>Folie, Aussage</td><td>Gewicht</td><td>ein Satzteil fett im regulären Satz</td><td>Kicker, Haarlinie, Fußzeile in Tinte</td></tr>
      <tr><td>Folie, Kennzahl</td><td>Signalfarbe</td><td>das Zeichen vor der Zahl oder die eine Zahl in Forest</td><td>Bezeichnungen Mono, Tinte</td></tr>
      <tr><td>Folie, Signalfeld</td><td>Signalfarbe</td><td>der Satz in Lime auf Forest — die Folie ist die Betonung</td><td>sonst nichts, auch keine Fußzeile in Tinte</td></tr>
      <tr><td>Diagramm</td><td>Signalfarbe</td><td>ein Wert in Lime, Beschriftung am Wert</td><td>alle anderen Werte auf der Graphitleiter</td></tr>
      <tr><td>Karten, Pills</td><td>Fläche + Signal</td><td>eine gefüllte Karte oder Pill, der eine Lime-Punkt</td><td>die übrigen als Kontur</td></tr>
      <tr><td>Tabelle</td><td>Gewicht</td><td>die eine Zeile oder Spalte fett</td><td>Zahlen tabular, rechtsbündig</td></tr>
      <tr><td>Website</td><td>Signalfarbe</td><td>ein Knopf, ein Signalpunkt je Ansicht</td><td>Links in Tinte mit Unterstrich</td></tr>
      <tr><td>Foto</td><td>Licht</td><td>ein Mensch, eine Handlung</td><td>Umgebung ruhig, keine zweite Geschichte</td></tr>
      <tr><td>Print</td><td>Gewicht, im Farbdruck Signal</td><td>ein Satzteil; auf Grün nur die Green-Druckfassung (4.14)</td><td>Schwarz als Tinte</td></tr>
      <tr><td>Logo</td><td>Gewicht</td><td>{N} fett</td><td>der Zusatz regulär</td></tr>
    </tbody>
  </table></div>
  {shot2(
    shot('b-T2-66-88', 'Vorlage T2 Signalfeld: ein Satz in Lime auf Forest', '<b>Das Signalfeld.</b> Der einzige Fall, in dem Lime Schrift ist: auf Forest, 7,9:1, und die ganze Folie ist die eine Betonung. Kicker und Fußzeile bleiben auf dieser Folie in Lime, weil nichts in Tinte neben dem Satz stehen soll.', BR),
    shot('b-KA5-74-15', 'Vorlage KA5 Karte hervorgehoben: die empfohlene Karte gefüllt, zwei Alternativen als Kontur', '<b>Fläche und Punkt.</b> Die Empfehlung ist die gefüllte Karte mit dem Lime-Punkt, die Alternativen stehen als Kontur. Zwei Mittel, eine Betonung — weil beide an derselben Stelle sitzen.', BR))}

  <div class="subhead"><span>5.7</span><h3>Fünf Fehlerbilder</h3></div>
  <div class="grid g3">
    <div class="card"><p class="lbl">01</p><h3>Zwei Signale</h3><p>Ein zweiter Lime-Wert an anderer Stelle halbiert die Aussage, ein dritter löscht sie. Ausnahme ist nur die Reihe (5.4).</p></div>
    <div class="card"><p class="lbl">02</p><h3>Signal unter Text</h3><p>Lime als Fläche hinter Fließtext ist ein Textmarker. Lime trägt Tinte nur auf dem Signalfeld und auf der gefüllten Pill.</p></div>
    <div class="card"><p class="lbl">03</p><h3>Lime als Schrift auf Papier</h3><p>1,6:1 — unlesbar für viele, unzulässig nach WCAG. Forest 700 übernimmt.</p></div>
    <div class="card"><p class="lbl">04</p><h3>Der ganze Satz fett</h3><p>Ein fetter Satz ist keine Betonung, sondern eine Lautstärke. Ein Satzteil fett, der Rest regulär.</p></div>
    <div class="card"><p class="lbl">05</p><h3>Das Falsche betont</h3><p>Das Schönste, das Neueste, das Logo — statt dem, worum es geht. Die Betonung ist die Aussage; wer sie setzt, entscheidet, was die Folie sagt.</p></div>
    <div class="card"><p class="lbl">Prüfung</p><h3>An Fremden</h3><p>Nicht „Können Sie das Konzept erklären", sondern „Was wiederholt sich auf diesen fünf Folien". Kommt „es ist immer eine Sache hervorgehoben" ungefragt zurück, funktioniert das Prinzip.</p></div>
  </div>

  <div class="subhead"><span>5.8</span><h3>Formen: Quadrat und Kreis</h3></div>
  <div class="prose">
    <p>Was die Betonung trägt, wenn sie eine Marke ist, sind zwei Formen ohne Kontur, Schatten und Rundung. Das <em>Quadrat</em> steht für Dinge — Dokumente, Systeme, Werte, Knoten in Diagrammen, das Favicon (Kapitel 02); der <em>Kreis</em> steht für Menschen und ist die einzige runde Form im System, darum liest sie sich sofort als das Andere. Vier Größen (4 · 8 · 16 · 32 px auf der Website, entsprechend in Print), drei Zustände in Diagrammen und Interfaces (Kontur = möglich, halb gefüllt = in Arbeit, voll gefüllt = aktiv). Mehr Bedeutung tragen die Formen nicht; ein Code, den Betrachter lernen müssten, wäre eine Betonung, die niemand sieht. Was in Kapitel 08, 11 und 13 „Knoten" heißt, ist diese Form im Diagramm.</p>
  </div>
</section>'''
m = re.search(r'<section id="s05">.*?</section>', s, re.S)
if not m: fehler.append('s05 fehlt')
else: s = s[:m.start()] + k05 + s[m.end():]

# ── 6 Kapitel 06: Vorschlag „Beziehung ist Anordnung“ ──────────────────
rep('<p class="sdek">Beziehungen werden nicht gezeichnet, sondern angeordnet. Zwei Mechanismen bleiben übrig, und beide kennt jeder Betrachter: eine Matrix und eine Lücke mit dem, was daraus entnommen wurde. Seit 011 ist das eine Diagrammkonvention für Gestalter, kein Markenbegriff — „Connection" ist gestrichen.</p>',
    '<p class="sdek">Beziehungen werden nicht gezeichnet, sondern angeordnet. Bisher kannte das Kapitel zwei Mechanismen — die Matrix und die Lücke mit dem, was daraus entnommen wurde. Seit 011 ist das eine Diagrammkonvention für Gestalter, kein Markenbegriff — „Connection" ist gestrichen. In 6.6 steht der Vorschlag, die beiden Mechanismen als Fälle einer allgemeineren Regel zu fassen: sieben Anordnungen, die die Folienvorlagen längst benutzen.</p>')
vorschlag = f'''
  <div class="subhead"><span>6.6</span><h3>Vorschlag: Beziehung ist Anordnung — sieben Anordnungen</h3></div>
  <div class="law"><p>Wo zwei Dinge liegen, sagt, was sie miteinander zu tun haben. Ein Strich sagt es nicht besser.</p><p class="src">Vorschlag 012 · zur Entscheidung</p></div>
  <div class="prose">
    <p><b>Der Einwand gegen dieses Kapitel</b>, wie es bis 011 stand: Die Matrix bekommt einen Rang, den sie im Alltag nicht hat. Sie ist die dichteste Form, um viele Beziehungen ohne Linie zu zeigen — aber die meisten Folien zeigen nicht viele Beziehungen, sondern eine: davor und danach, oben und unten, Teil und Ganzes, hier und dort. Dafür braucht es keine Matrix, und die Vorlagen des Foliensystems belegen, dass es längst anders gelöst wird: Prozesse als Reihe, Architekturen als Stapel, Komponenten als Kästen in Kästen, Vergleiche als Gegenüber, Schnittmengen als Überlappung, Kreisläufe als Ring, Ökosysteme als Zentrum mit Umfeld. Keine dieser Vorlagen zieht eine Linie — bis auf zwei, dazu unten.</p>
    <p>Der Vorschlag: Das Kapitel heißt „Anordnung". Sein Gesetz lautet, dass die <em>Lage</em> die Beziehung trägt. Die Matrix und die Lücke bleiben — als zwei von sieben Anordnungen, nicht als die einzigen. Die Matrix ist die Kreuzung zweier Reihen; die Lücke ist ein Nest, aus dem etwas entnommen wurde. Beides wird dadurch nicht kleiner, es bekommt Geschwister.</p>
  </div>
  <div class="tbl"><table>
    <thead><tr><th scope="col">Anordnung</th><th scope="col">Sagt</th><th scope="col">Lage</th><th scope="col">Vorlagen, die es schon tun</th><th scope="col">Bedingung</th></tr></thead>
    <tbody>
      <tr><td><b>Reihe</b></td><td>davor, danach; Rang</td><td>nebeneinander oder untereinander in Leserichtung, gleicher Abstand</td><td>P1, P2, P3 Prozess · L1 Timeline · AG1 Agenda · K2, K3 Zahlen</td><td>höchstens sieben Glieder; kein Pfeil zwischen den Gliedern, die Leserichtung ist die Richtung</td></tr>
      <tr><td><b>Stapel</b></td><td>trägt, liegt auf; Ebene</td><td>übereinander, das Fundament unten und als einzige Fläche gefüllt</td><td>R3 Ebenenmodell · C7 Pyramide · C4 Hierarchie (heute noch mit Linien)</td><td>höchstens fünf Schichten (7.6); Breite gleich, sonst wird es eine Pyramide und behauptet Menge</td></tr>
      <tr><td><b>Nest</b></td><td>enthält, ist Teil von</td><td>Kontur in Kontur, ein Steg Abstand, drei Sets tief</td><td>PIIPE Komponentenüberblick · KA6 Statuskarten · Ausschnitt und Ergänzung (6.4)</td><td>Konturen, keine Füllungen; das Innerste darf gefüllt sein, wenn es die Betonung ist</td></tr>
      <tr><td><b>Gegenüber</b></td><td>statt; vorher, nachher; richtig, falsch</td><td>links und rechts, gleiche Größe, gleiche Höhe, ein Steg dazwischen</td><td>C1 Vergleich · B6 Vorher und Nachher · C9 Transformation · DD1 Do und Don't · TB4 Vergleichstabelle</td><td>genau zwei; die Betonung liegt rechts (das Nachher, das Richtige) oder in der Mitte (das Mittel)</td></tr>
      <tr><td><b>Überlappung</b></td><td>teilt, hat gemeinsam</td><td>zwei bis drei Flächen mit fester Schnittzone</td><td>C8 Schnittmenge · 7.7 Fähigkeitsfelder als Bänder</td><td>Verdeckung, keine Transparenz (7.4); die Schnittzone ist die Betonung</td></tr>
      <tr><td><b>Ring</b></td><td>kehrt wieder</td><td>gleiche Glieder auf einem Kreis, Leserichtung im Uhrzeigersinn</td><td>C3 Kreislauf · PIIPE Funktionsfelder (Donut)</td><td>nur für echte Wiederholung; ein Prozess mit Ende ist eine Reihe</td></tr>
      <tr><td><b>Zentrum</b></td><td>hängt ab von; versorgt</td><td>eine Fläche in der Mitte, das Umfeld als Ring gleicher Formen darum</td><td>C6 Nabe und Speichen (heute noch mit sechs Linien)</td><td>höchstens acht im Umfeld; die Speichen entfallen — der Abstand zur Mitte ist die Beziehung</td></tr>
      <tr><td><b>Matrix</b></td><td>trifft zu, gehört zu; viele Beziehungen auf einmal</td><td>Reihe × Reihe</td><td>C2 Matrix · FA2 Kombinationsmatrix · PIIPE Positionierung</td><td>wie in 6.3: Bedeutung an der Berührung, ein Feld betont</td></tr>
    </tbody>
  </table></div>
  <div class="grid g3">
    <div class="card"><p class="lbl">Folge 01</p><h3>Zwei Vorlagen verlieren ihre Linien</h3><p>C4 Hierarchie wird ein Stapel mit eingerückten Kindern (drei Ebenen, zwölf Knoten, wie bisher). C6 Nabe und Speichen wird ein Zentrum mit Ring — die sechs Speichen entfallen, das Umfeld sitzt auf gleichem Abstand. Beides ist Handarbeit an zwei Folien.</p></div>
    <div class="card"><p class="lbl">Folge 02</p><h3>Der Pfeil bleibt, wo er ein Zeichen ist</h3><p>C9 Transformation behält den Pfeil: Er ist dort kein Verbindungsstrich zwischen zwei Positionen, sondern das eine Richtungszeichen aus Kapitel 08 mit einer Beschriftung — „womit". Ein Pfeil, der etwas benennt, ist ein Zeichen; ein Pfeil, der nur verbindet, ist eine Linie.</p></div>
    <div class="card"><p class="lbl">Folge 03</p><h3>Die Prüffrage ändert sich</h3><p>Statt „Lässt sich das als Matrix zeigen?" heißt sie „Welche der sieben Lagen ist das?". Wer keine findet, hat entweder keine Beziehung oder zu viele — und dann ist die Matrix das Werkzeug.</p></div>
  </div>
  <p class="note">Offen bis zur Entscheidung: die Benennung („Anordnung" als Kapiteltitel), ob C4 und C6 geändert werden, und ob der Ring als eigene Anordnung bleibt oder als Sonderfall der Reihe geführt wird. Die Abschnitte 6.1 bis 6.5 bleiben in jedem Fall bestehen; sie beschreiben Matrix und Lücke weiterhin richtig.</p>
'''
# vor dem Ende von s06 einfuegen
i6 = s.find('<section id="s06">'); j6 = s.find('</section>', i6)
if i6 < 0 or j6 < 0: fehler.append('s06 Ende')
else: s = s[:j6] + vorschlag + s[j6:]

# ── 7 Kapitel 07: reale Folien zu allen Wireframes ─────────────────────
vor('<div class="subhead"><span>7.2</span>', shot2(
    shot('b-KA1-73-2', 'Vorlage KA1 Kartenraster: drei Karten auf Mint-Papier', '<b>Erhoben auf Grund, ohne Schatten.</b> Drei Karten auf Mint-Papier: die Karte ist eine erhobene Fläche (Papierweiß mit 1-px-Kontur), das Bildfeld darin eine gesenkte. Die eine Betonung ist der Lime-Punkt der ersten Karte.', BR),
    shot('p-63-6', 'Folie Fünf Merkmale der Plattform als Kartenreihe', '<b>Dieselbe Regel in der Kundenpräsentation.</b> Fünf Karten, das Bild oben als Fläche in der Fläche, der Text auf der Karte. Kein Schatten, keine Rundung — die Tiefe kommt aus zwei Helligkeiten und einer Kontur.', PI)))
vor('<div class="subhead"><span>7.3</span>', shot2(
    shot('b-KA5-74-15', 'Vorlage KA5: gefüllte Empfehlung, Alternativen als Kontur', '<b>Kontur heißt möglich, Fläche heißt aktiv.</b> Die Empfehlung ist die gefüllte Karte, die beiden Alternativen stehen als Kontur. Die Füllung ist damit eine Aussage, keine Dekoration.', BR),
    shot('p-10-27', 'Folie Komponentenüberblick: Konturkästen in Konturkästen', '<b>Verschachtelung, drei Sets.</b> Anwendung, Kern, Dienste, Anbindung als Kontur in Kontur, ein Steg Abstand. Was gestrichelt umrandet ist, lässt sich austauschen — auch das ist eine Kontur-Aussage, keine Linie.', PI)))
vor('<div class="subhead"><span>7.5</span>', shot2(
    shot('b-B3-33-2', 'Vorlage B3 Bild angeschnitten: das Bild läuft über den unteren Rand', '<b>Anschnitt.</b> Das Bild läuft über den unteren Rand hinaus; die Folie wird zum Fenster. Das ist Tiefe ohne ein einziges Tiefenmittel — nur die Kante, an der etwas weitergeht.', BR),
    shot('b-B7-33-50', 'Vorlage B7 Vollbild mit Tafel: eine Papiertafel liegt auf dem Bild', '<b>Verdeckung.</b> Die Tafel in Papierfarbe liegt auf dem Vollbild und deckt es teilweise — der stärkste Tiefenhinweis, ohne Schatten, ohne Transparenz. Der Text steht auf der Tafel, nie auf dem Bild.', BR)) + shot2(
    shot('b-PI1-75-2', 'Vorlage PI1 Pill-Wolke auf Forest, eine Pill gefüllt', '<b>Zweite Kantenform: die Pill.</b> Auf Forest, als Kontur; die eine gefüllte Pill in Lime ist die Betonung. Pill und Rechteck mischen sich nie in einem Bauteil.', BR),
    shot('p-63-43', 'Folie Fünf Merkmale als Botschaftspills auf Forest', '<b>Pills als Kurzbotschaften.</b> Fünf Merkmale als Pills, die erste gefüllt. Auf Forest sind die Konturen Graphit 100, die Füllung Lime mit Tinte darauf — beide aus Kapitel 04.', PI)))
vor('<div class="subhead"><span>7.6</span>', shot2(
    shot('b-S3-38-17', 'Vorlage S3 Feature mit Callouts: Bildschirmfoto als Fläche, nummerierte Marken darauf', '<b>Die Bühne gehört dem Inhalt.</b> Das Bildschirmfoto ist die Bühne, die nummerierten Marken liegen darauf, die Erklärung steht daneben — nie auf dem Bild. Der Rahmen der Folie tut nichts.', BR),
    shot('p-7-52', 'Folie PIIPE Workplace: Laptop, Tablet und Telefon mit Produktbildern', '<b>Geräte als Bühne.</b> Drei Geräte zeigen denselben Inhalt; der Rahmen gehört dem Gerät, die Fläche darin dem Benutzer. Das ist die einzige Stelle, an der ein Gerät mit Schatten steht — er gehört zum Foto, nicht zum System.', PI)))
vor('<div class="subhead"><span>7.7</span>', shot('b-R3-40-23', 'Vorlage R3 Ebenenmodell: vier Schichten, unten das Fundament gefüllt', '<b>Die eine Anordnung als Folie.</b> Vier Schichten übereinander, gleich breit, ein Steg Abstand; nur das Fundament ist gefüllt. Was Menschen sehen steht oben, Identität und Zugang unten — die Anordnung aus 7.6, ohne Linie und ohne Pfeil.', BR))
nach_figure('<figcaption><b>Integration ist keine Schicht am Boden', shot('p-10-27', 'Folie Komponentenüberblick in der PIIPE-Präsentation', '<b>Die Folie dazu.</b> Der Komponentenüberblick zeigt die vier Schichten als Nest, nicht als Stapel; die senkrechte Integrationsebene aus der Zeichnung fehlt dort noch. Beides ist zulässig — die Zeichnung sagt „kreuzt", die Folie sagt „enthält".', PI))
nach_figure('<figcaption><b>Aus dem Ring wird eine Treppe', shot('p-7-68', 'Folie Sieben Funktionsfelder: Donut mit Liste', '<b>Die Folie dazu — noch als Ring.</b> Die Präsentation zeigt die sieben Felder heute als Donut mit Liste. Die Treppe aus der Zeichnung ist dort nicht umgesetzt; der Ring behauptet Wiederholung, wo die Treppe Aufbau sagen soll. Offen im Backlog.', PI))
nach_figure('<figcaption><b>Ein Strich pro Modell', shot('p-9-19', 'Folie Drei angebotene Betriebsmodelle als Tabelle', '<b>Die Folie dazu — als Tabelle.</b> Die Präsentation löst die drei Modelle als Vergleichstabelle, nicht als drei Ebenenkonfigurationen. Die Tabelle ist richtig für die Merkmale, die Zeichnung für die Frage, wo der Strich verläuft; die Folie mit den drei Konfigurationen fehlt noch. Offen im Backlog.', PI))

# ── 8 Aenderungsprotokoll ─────────────────────────────────────────────
rep('<p><b>Änderungen 010 → 011:</b>', '''<p><b>Änderungen 011 → 012:</b> <b>Kapitel 05</b> ist jetzt „Betonung" — ein Arbeitskapitel zu Gewicht, Signalfarbe, Kontrast (Lime nur auf dunklem Grund als Schrift, Forest 700 als Akzenttinte auf Papier), Reihe, erlaubter Null, fünf Fehlerbildern und den Formen; mit echten Folien aus beiden Präsentationen, auch als Gegenbeispiel. <b>Kapitel 06</b> trägt in 6.6 den Vorschlag „Beziehung ist Anordnung" mit sieben Anordnungen (Reihe, Stapel, Nest, Gegenüber, Überlappung, Ring, Zentrum, dazu die Matrix), zur Entscheidung. <b>Kapitel 07</b> zeigt zu jedem Wireframe reale Folien aus Brand-Deck und PIIPE-Präsentation. <b>Signalfarbe entschieden:</b> Lime, durchgehend und auch in den Artefakten; <span class="mk">neo blue</span> verliert die Signalrolle und bleibt nur als Ebenenfarbe „Daten und KI". Der Akzent der Artefakte wechselt von Blau auf Forest (Tinte) und Lime (Marke). Entschieden am 06.09.2026.</p>
  <p><b>Änderungen 010 → 011:</b>''')

if fehler: sys.exit('ABBRUCH:\n' + '\n'.join(fehler))
B.write_text(s, encoding='utf-8')
print('geschrieben', len(s)//1024, 'KB; shots', s.count('figure class="shot"'))
