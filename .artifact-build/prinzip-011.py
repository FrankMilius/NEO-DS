#!/usr/bin/env python3
"""neo brand 010 → 011: Die visuelle DNA (Node, Layer, Signal, Connection) wird auf ein
Prinzip zurückgeführt — „nie mehr als eine Betonung“. Kapitel 05 auf Formen reduziert,
06 zu Matrix, 07 zu Flächen; das Vokabular verlässt Kapitel 01. Anker-Skript, bricht ab."""
import re, sys, pathlib
B = pathlib.Path(__file__).resolve().parent / 'brand-neu.html'
s = B.read_text(encoding='utf-8'); fehler = []
N = '<span class="mk">neo</span>'; NC = '<span class="mk">neocosmo</span>'
def rep(a, b, mal=1):
    global s
    n = s.count(a)
    if n != mal: fehler.append(f'{n}× statt {mal}×: {a[:80]}'); return
    s = s.replace(a, b)
def cut(von, bis, neu, was):
    global s
    i = s.find(von); j = s.find(bis, i + 1)
    if i < 0 or j < 0: fehler.append(f'Schnitt {was}: {i} {j}'); return
    s = s[:i] + neu + s[j:]

# ── 1 Version ──────────────────────────────────────────────────────────────
rep('<title>neo brand 010</title>', '<title>neo brand 011</title>')
rep(f'<p class="code">{N.replace("neo","neo brand")} 010 · Living Document · 05.09.2026</p>', f'<p class="code">{N.replace("neo","neo brand")} 011 · Living Document · 06.09.2026</p>')
rep(f'<p><b>{N.replace("neo","neo brand")} 010</b> — Living Document, 5. September 2026.', f'<p><b>{N.replace("neo","neo brand")} 011</b> — Living Document, 6. September 2026.')
rep('<dt>Version</dt><dd>009</dd>', '<dt>Version</dt><dd>011</dd>')

# ── 2 Kapitel 01: DNA-Block → das eine Prinzip ────────────────────────────
prinzip = f'''<h4 style="margin-top:34px">Das eine Prinzip: nie mehr als eine Betonung</h4>
  <div class="prose">
    <p>Bis Fassung 010 stand hier eine visuelle DNA aus vier Begriffen — Node, Layer, Signal, Connection. Sie ist in mehreren Vorstellungen durchgefallen: Die Begriffe lagen auf verschiedenen Bedeutungsebenen, die Ableitung von Formen aus Akteuren war ein Code, den niemand in einer Präsentation lernt, und auf den Folien fand niemand ein Gegenstück. Das Urteil ist nicht, dass die Idee falsch war, sondern dass sie als <em>Vokabular</em> vorgetragen wurde. Eine visuelle DNA wird nicht gelernt, sie wird bemerkt.</p>
    <p>Was bleibt, ist der Mechanismus des Systemgesetzes, und er ist in einem Satz sagbar: <em>Bei uns ist nie mehr als eine Sache hervorgehoben.</em> Relevanz für jeden: Das Zutreffende tritt hervor. Klarheit für alle: mit einem Mittel, überall gleich. Das Logo zeigt es (neo fett, der Rest regulär), das Diagramm zeigt es (ein Wert im Akzent), die Folie zeigt es (ein Signalfeld, eine Zahl, ein Wort). Wer das bemerkt, hat das System verstanden, ohne ein Wort davon zu kennen.</p>
  </div>
  <div class="law"><p>Nie mehr als eine Betonung. Eine je Aussage — oder keine.</p><p class="src">Das eine Prinzip · seit 011</p></div>
  <div class="grid g4">
    <div class="card"><p class="lbl">Mittel 01</p><h3>Gewicht</h3><p>Für Wörter. Ein fettes Wort in regulärer Umgebung — wie im Logo, wie in einer Aussage-Überschrift. Das Standardmittel, weil es ohne Farbe auskommt.</p></div>
    <div class="card"><p class="lbl">Mittel 02</p><h3>Signalfarbe</h3><p>Für Werte und Marken. Der eine Balken, die eine Zahl, das eine Feld in Lime. Nie für Fließtext, nie als Fläche unter Text.</p></div>
    <div class="card"><p class="lbl">Ausnahme</p><h3>Die Reihe</h3><p>Drei bis fünf gleichwertige Werte (Kennzahlen, kleine Vielfache) dürfen dieselbe Stelle akzentuieren — das Plus, das Größer-als, der Marker. Die Reihe ist eine Komposition; sonst trägt nichts auf der Folie einen Akzent.</p></div>
    <div class="card"><p class="lbl">Erlaubt</p><h3>Keine</h3><p>Belege, Logowände, Listen, Anhang, Trenner: Wo nichts wichtiger ist als der Rest, wird nichts hervorgehoben. Eine Folie ohne Betonung ist keine leere Folie, sondern eine, die nichts behauptet.</p></div>
  </div>
  <div class="tbl"><table>
    <thead><tr><th scope="col">Wo</th><th scope="col">Die eine Betonung</th><th scope="col">Der Rest</th></tr></thead>
    <tbody>
      <tr><td>Logo</td><td>{N} in Bold</td><td>der Zusatz in Regular</td></tr>
      <tr><td>Aussage-Überschrift</td><td>ein Satzteil fett</td><td>der Satz regulär</td></tr>
      <tr><td>Diagramm</td><td>ein Wert in Lime, Beschriftung am Wert</td><td>alle anderen auf der Graphitleiter</td></tr>
      <tr><td>Folie</td><td>ein Signalfeld, eine Zahl, ein Wort</td><td>Papier, Tinte, Haarlinie</td></tr>
      <tr><td>Kennzahlenreihe</td><td>dieselbe Stelle je Wert (das Zeichen vor der Zahl)</td><td>Zahl und Bezeichnung in Tinte</td></tr>
      <tr><td>Foto</td><td>ein Mensch, eine Handlung im Licht</td><td>Umgebung ruhig, keine zweite Geschichte</td></tr>
      <tr><td>Website</td><td>ein Knopf, ein Signalpunkt je Ansicht</td><td>alles Übrige in Tinte und Flächen</td></tr>
    </tbody>
  </table></div>
  <div class="grid g3">
    <div class="card"><p class="lbl">Regel</p><h3>Eine Betonung je Aussage</h3><p>Jede Folie, Seite oder Grafik, die etwas behauptet, trägt genau eine Betonung — mit Gewicht oder mit Signalfarbe, nie mit beidem an derselben Stelle. Das Prinzip ist damit nicht „höchstens", sondern „eine, wo behauptet wird". Auf zu vielen Folien fehlt sie heute; das ist der Grund, warum das System dort unsichtbar bleibt.</p></div>
    <div class="card"><p class="lbl">Regel</p><h3>Die Betonung ist die Aussage</h3><p>Was hervorgehoben ist, muss das sein, worum es geht — nicht das Schönste, nicht das Neueste. Wer auf einer Kennzahlenfolie drei Werte akzentuiert, sagt: alle drei sind gleich wichtig. Das ist erlaubt, wenn es stimmt.</p></div>
    <div class="card"><p class="lbl">Prüfung</p><h3>Die Frage an Fremde</h3><p>Nicht „Können Sie das Konzept erklären", sondern „Was wiederholt sich auf diesen fünf Folien". Kommt „es ist immer eine Sache hervorgehoben" ungefragt zurück, funktioniert das Prinzip. Kommt nichts, ist es nicht sichtbar genug gesetzt — und dann ist die Folie das Problem, nicht der Betrachter.</p></div>
  </div>
  <p class="note">Die Gestaltungsgrammatik für Macher — Flächen ohne Transparenz (Kapitel 07), Formen in Diagrammen (05), Beziehungen als Matrix (06) — bleibt bestehen. Sie erklärt, wie das Prinzip gebaut wird. Sie ist kein Teil der Botschaft und wird niemandem vorgestellt, der nicht selbst gestaltet.</p>

  '''
cut('<h4 style="margin-top:34px">Die visuelle DNA: drei Dinge und ein Ereignis</h4>', '<div class="subhead"><span>1.3</span>', prinzip, 'DNA-Block')

# Design Principles: Regel 03 praezisieren
rep('<td><b>Ein Signal</b></td><td>Genau eine bunte Marke pro Komposition. Ein zweites Signal halbiert die Aussage, ein drittes löscht sie.</td>',
    '<td><b>Eine Betonung</b></td><td>Eine je Aussage, mit Gewicht oder Signalfarbe — oder keine. Eine Reihe gleichwertiger Werte darf dieselbe Stelle akzentuieren. Ein zweites Signal an anderer Stelle halbiert die Aussage.</td>')

# ── 3 Kapitel 05: Node → Formen ────────────────────────────────────────────
k05 = f'''<section id="s05">
  <div class="shead">
    <div class="snum">05</div>
    <div>
      <h2>Formen</h2>
      <p class="sdek">Zwei Formen für Diagramme, vier Größen, drei Zustände. Seit 011 ohne Bedeutungscode: Die Form sagt, ob etwas ein Ding oder ein Mensch ist — mehr muss niemand lernen.</p>
    </div>
  </div>
  <div class="prose">
    <p>Bis 010 trug dieses Kapitel eine Taxonomie: Akteur, Ressource, Kontext, Rolle, und dazu vier Formen mit je einer Bedeutung. Sie ist gestrichen, weil ein Code, den Betrachter nicht lernen, in Präsentationen und auf Websites nichts trägt. Was bleibt, ist das, was Diagramme in Kapitel 11 brauchen — und das ist wenig.</p>
    <p>Eine Form ist eine kleine Fläche ohne Kontur, ohne Schatten, ohne Rundung. Die Grundform ist das <em>Quadrat</em>, weil es sich zum Raster verhält und weil es das Zeichen des Logos in seiner kleinsten Fassung ist (Kapitel 02). Die einzige runde Form ist der <em>Kreis</em>, und er steht für Menschen — die eine Abweichung, die jeder ohne Erklärung liest.</p>
  </div>
  <div class="grid g3">
    <div class="card"><p class="lbl">Form 01</p><h3>Quadrat</h3><p>Dinge: Dokumente, Systeme, Werte, Knoten in Diagrammen. Auch das Favicon und das Signalfeld sind Quadrate. Ein Raster kleiner Quadrate zeigt Vielzahl — Daten, Einträge, Menge.</p></div>
    <div class="card"><p class="lbl">Form 02</p><h3>Kreis</h3><p>Menschen: Personen, Rollen, Teams, Zielgruppen. Die einzige runde Form im System; darum liest sie sich sofort als das Andere.</p></div>
    <div class="card"><p class="lbl">Gestrichen</p><h3>Offene Kontur, Raster als Bedeutung</h3><p>„Systeme als offene Kontur über etwas" und „Daten als Raster" waren Bedeutungen, die man erklären musste. Kontur und Raster bleiben als Zustand und als Menge erlaubt — nicht als Kategorie.</p></div>
  </div>
  <div class="grid g3">
    <div class="card"><p class="lbl">Zustand</p><h3>Drei Füllungen</h3><p>Kontur = möglich, halb gefüllt = in Arbeit, voll gefüllt = aktiv. Nur in Diagrammen und Interfaces, wo ein Zustand gezeigt werden muss. Funktioniert bei 8 px wie bei 800.</p></div>
    <div class="card"><p class="lbl">Maßstab</p><h3>Vier Größen</h3><p>4 · 8 · 16 · 32 px auf der Website, entsprechend in Print. Zwischengrößen gibt es nicht — eine Form außerhalb des Rasters liest sich als Fehler, nicht als Betonung.</p></div>
    <div class="card"><p class="lbl">Betonung</p><h3>Die eine in Signalfarbe</h3><p>Gilt aus Kapitel 01: Höchstens eine Form je Komposition trägt Lime — die, um die es geht. In einer Reihe gleichwertiger Werte dieselbe Stelle je Wert, sonst nichts.</p></div>
  </div>
  <p class="note">Was in Kapitel 08 (Grafische Sprache), 11 (Daten) und 13 (Folien) „Knoten" heißt, ist diese Form im Diagramm. Das Wort „Node" ist seit 011 nicht mehr in Gebrauch.</p>
</section>'''
m = re.search(r'<section id="s05">.*?</section>', s, re.S)
if not m: fehler.append('s05 fehlt')
else: s = s[:m.start()] + k05 + s[m.end():]

# ── 4 Kapitel 06: Connection → Matrix ─────────────────────────────────────
rep('<h2>Connection</h2>', '<h2>Matrix</h2>')
rep('<p class="sdek">Beziehungen werden nicht gezeichnet. Zwei Mechanismen bleiben übrig, und beide sind Formen, die jeder Betrachter längst kennt — eine Matrix und eine Lücke mit dem, was daraus entnommen wurde.</p>',
    '<p class="sdek">Beziehungen werden nicht gezeichnet, sondern angeordnet. Zwei Mechanismen bleiben übrig, und beide kennt jeder Betrachter: eine Matrix und eine Lücke mit dem, was daraus entnommen wurde. Seit 011 ist das eine Diagrammkonvention für Gestalter, kein Markenbegriff — „Connection" ist gestrichen.</p>')
rep('Connection beschreibt ausschließlich Beziehungen, die eine Aussage tragen.', 'Dieses Kapitel beschreibt ausschließlich Beziehungen, die eine Aussage tragen.')
rep('Der eigentliche Beleg ist, ob sich mit Node, Layer und Matrix ein realer Produktvorgang erklären lässt', 'Der eigentliche Beleg ist, ob sich mit Formen, Flächen und Matrix ein realer Produktvorgang erklären lässt')
rep('Das ist Tiefe und gehört zu <b>Layer</b> (Kapitel 07).', 'Das ist Tiefe und gehört zu den <b>Flächen</b> (Kapitel 07).')

# ── 5 Kapitel 07: Layer → Flächen ─────────────────────────────────────────
rep('<h2>Layer</h2>', '<h2>Flächen</h2>')
rep('Ein Layer ist ein Rechteck mit einer Füllung', 'Eine Fläche ist ein Rechteck mit einer Füllung')
rep('Der Scrim ist kein Layer, sondern ein <b>Zustand</b>', 'Der Scrim ist keine Fläche, sondern ein <b>Zustand</b>')

# ── 6 Vokabular in den uebrigen Kapiteln ──────────────────────────────────
# Kapitel 02: Node → Quadrat
rep('Eine Wortmarke in zwei Gewichten und ein Node.', 'Eine Wortmarke in zwei Gewichten und ein Quadrat.')
rep('das Favicon als Node,', 'das Favicon als Quadrat,')
rep('<h3>Der Node</h3>', '<h3>Das Quadrat</h3>')
rep('Dort übernimmt das kleinste Element des Systems: ein Node aus Kapitel 05, ein Quadrat ohne Rundung, mit dem n aus derselben Zeichnung.', 'Dort übernimmt die kleinste Form des Systems: ein Quadrat ohne Rundung (Kapitel 05), mit dem n aus derselben Zeichnung.')
rep('Lime bekommt der Node nur dort, wo er der eine bunte Node der Komposition sein darf', 'Lime bekommt das Quadrat nur dort, wo es die eine Betonung der Komposition sein darf')
rep('<b>Schutzraum und Node.</b>', '<b>Schutzraum und Quadrat.</b>')
rep('Der Node ist ein Quadrat von 8 u ohne Rundung; das n sitzt auf 4 u', 'Das Quadrat misst 8 u, ohne Rundung; das n sitzt auf 4 u')
rep('Darunter zeigt der Node oder das Wort in einem Gewicht', 'Darunter zeigt das Quadrat oder das Wort in einem Gewicht')
rep('<span class="cap">Node · Favicon</span>', '<span class="cap">Quadrat · Favicon</span>') if s.count('<span class="cap">Node · Favicon</span>') == 1 else None
s = s.replace('aria-label="Node"', 'aria-label="Quadrat"')
s = s.replace('<span style="font-family:var(--f-tech);font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--faint)">Node · Favicon</span>', '<span style="font-family:var(--f-tech);font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--faint)">Quadrat · Favicon</span>')
s = s.replace('NODE 8 u · n AUF 4 u', 'QUADRAT 8 u · n AUF 4 u')
s = s.replace('<td class="m">node.svg · node-graphit100.svg · node-mint.svg</td><td>Fläche in Tinte, n im Grund</td><td>Favicon, App-Icon, Avatar</td>', '<td class="m">node.svg · node-graphit100.svg · node-mint.svg</td><td>Quadrat in Tinte, n im Grund (Dateiname bleibt technisch „node")</td><td>Favicon, App-Icon, Avatar</td>')
s = s.replace('<td class="m">node-signal.svg</td><td>Lime 500, n Graphit 950</td><td>nur als Signal-Node im Tab</td>', '<td class="m">node-signal.svg</td><td>Lime 500, n Graphit 950</td><td>nur als die eine Betonung im Browser-Tab</td>')
s = s.replace('dazu Node / Master', 'dazu Quadrat / Master')
# Uebrige Kapitel: Node → Knoten (Diagrammbegriff), Layer → Fläche, sofern nicht Tokenname
s = s.replace('Signal-Node', 'Signalknoten').replace('Node-Formen', 'Knotenformen').replace('Node-Größen', 'Knotengrößen').replace('Node-Link-Diagramm', 'Netzwerkdiagramm (Node-Link)')
s = re.sub(r'\bNodes\b', 'Knoten', s); s = re.sub(r'\bNode\b(?! ?/ ?Master)', 'Knoten', s)
s = re.sub(r'\bLayern\b', 'Flächen', s); s = re.sub(r'(?<![-\w])Layer(?![-\w])', 'Fläche', s)
s = s.replace('aus Fläche und Knoten', 'aus Flächen und Knoten')

# ── 7 Aenderungsprotokoll ─────────────────────────────────────────────────
rep('<p><b>Änderungen 009 → 010:</b>', '''<p><b>Änderungen 010 → 011:</b> Die visuelle DNA aus vier Begriffen (Node, Layer, Signal, Connection) ist zurückgenommen — sie ist in Vorstellungen durchgefallen: Begriffe auf verschiedenen Ebenen, ein Formencode, den niemand lernt, kein Gegenstück auf den Folien. An ihre Stelle tritt in Kapitel 01 <b>das eine Prinzip: nie mehr als eine Betonung</b>, eine je Aussage oder keine, mit zwei Mitteln (Gewicht, Signalfarbe) und der Reihen-Ausnahme für gleichwertige Werte. <b>Kapitel 05</b> heißt jetzt Formen und kennt nur Quadrat und Kreis, ohne Bedeutungscode; <b>06</b> heißt Matrix und ist eine Diagrammkonvention; <b>07</b> heißt Flächen. „Node" wird in Diagrammkapiteln zu „Knoten", im Logo zum „Quadrat"; „Layer" zu „Fläche". Entschieden am 06.09.2026 nach Franks Rückmeldung aus mehreren Vorstellungen.</p>
  <p><b>Änderungen 009 → 010:</b>''')

if fehler: sys.exit('ABBRUCH:\n' + '\n'.join(fehler))
B.write_text(s, encoding='utf-8')
print('geschrieben; Rest Node:', len(re.findall(r'\bNode\b', s)), 'Layer:', len(re.findall(r'\bLayer\b', s)), 'Connection:', s.count('Connection'))
