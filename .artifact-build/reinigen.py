#!/usr/bin/env python3
"""Erzeugt aus der Arbeitsfassung die Lesefassung fuer die Kommentierung.

Entfernt Versionshistorie, Selbstkorrekturen und die Ich-Stimme des Verfassers.
Inhaltliche Aussagen bleiben unangetastet — auch die offenen Entscheidungen,
weil genau sie kommentiert werden sollen.
"""
import pathlib, re, sys

D = pathlib.Path(__file__).parent
s = D.joinpath("brand-neu.html").read_text()
ausgang = len(s)
fehler, getan = [], 0

NOTIZ_12 = '<p class="note" style="margin-top:18px"><b>Was hier bewusst fehlt.</b> Der frühere Satz stand auf einem dritten Bein: dem Vierfarbdruck, in dem Farbe durch übereinanderliegende, teildurchsichtige Schichten entsteht. Dieses Bein ist mit der Entscheidung in Kapitel 07 gebrochen, auf Transparenz zu verzichten — Flächen stoßen aneinander, sie überlagern sich nicht. Der Sachverhalt gilt weiter für das Medium (Kapitel 14), für die Marke trägt er nicht mehr. Mit ihm entfällt die Berufung auf Josef Albers, deren ganzer Gehalt die Überlagerung war.</p>'


def rep(alt, neu, mal=1):
    """Ersetzt und meldet Fehlschlaege, statt beim ersten abzubrechen."""
    global s, getan
    n = s.count(alt)
    if n != mal:
        fehler.append(f"{n}× statt {mal}×: {alt[:75]!r}")
        return
    s = s.replace(alt, neu)
    getan += mal


def schneide(von, bis, was):
    """Entfernt von 'von' bis zum naechsten 'bis' dahinter."""
    global s, getan
    if s.count(von) != 1:
        fehler.append(f"Schnitt {was}: Anfang {s.count(von)}×")
        return
    a = s.index(von)
    b = s.find(bis, a)
    if b == -1:
        fehler.append(f"Schnitt {was}: Ende nicht gefunden")
        return
    s = s[:a] + s[b:]
    getan += 1


# ══ 1 · Kopf: Arbeitsversion → Lesefassung ═══════════════════════════
# Versionsunabhaengig: die Nummer aendert sich mit jeder Fassung.
def ersetze_muster(muster, neu, was):
    """Regex-Ersetzung mit Trefferpruefung."""
    global s, getan
    n = len(re.findall(muster, s))
    if n != 1:
        fehler.append(f"{was}: {n}× statt 1×")
        return
    s = re.sub(muster, neu, s)
    getan += 1


ersetze_muster(r'<title>neo brand \d+</title>', '<title>neo brand</title>', "Titel")
ersetze_muster(r'<p class="code"><span class="mk">neo brand</span> \d+ · Living Document · [\d.]+</p>',
               '<p class="code"><span class="mk">neo brand</span> · Erster Entwurf zur Kommentierung · September 2026</p>', "Kopfzeile")
ersetze_muster(r'<div><dt>Version</dt><dd>\d+</dd></div>',
               '<div><dt>Fassung</dt><dd>Erster Entwurf</dd></div>', "Versionsfeld")

# ══ 2 · Versionshistorie ═════════════════════════════════════════════
schneide('<p><b>Änderungen 010 → 011:</b>',
         '<p>Dieses Dokument folgt den Regeln, die es beschreibt', "Fussnoten-Historie")
rep(NOTIZ_12, "")
# ══ 2b · Fassungshinweise aus 010 ════════════════════════════════════
rep('<p class="src">Ergänzt in Fassung 010, nach der Analyse der Vorlagen Horizon und Calypso</p>', '<p class="src">Die Grünfamilie</p>')
rep('<p class="src">Das eine Prinzip · seit 011</p>', '<p class="src">Das eine Prinzip</p>')
schneide('<p>Bis Fassung 010 stand hier eine visuelle DNA', '<p>Was bleibt, ist der Mechanismus des Systemgesetzes', '')
rep('<p>Was bleibt, ist der Mechanismus des Systemgesetzes, und er ist in einem Satz sagbar:', '<p>Der Mechanismus des Systemgesetzes ist in einem Satz sagbar:')
rep('Seit 011 ohne Bedeutungscode: Die Form sagt', 'Ohne Bedeutungscode: Die Form sagt')
schneide('<p>Bis 010 trug dieses Kapitel eine Taxonomie', '<p>Eine Form ist eine kleine Fläche ohne Kontur', '<p>Dieses Kapitel enthält nur, was Diagramme in Kapitel 11 brauchen — und das ist wenig.</p>\n    ')
schneide('<div class="card"><p class="lbl">Gestrichen</p><h3>Offene Kontur, Raster als Bedeutung</h3>', '</div>\n  </div>\n  <div class="grid g3">\n    <div class="card"><p class="lbl">Zustand</p>', '')
rep(' Das Wort „Node" ist seit 011 nicht mehr in Gebrauch.', '')
rep(' Seit 011 ist das eine Diagrammkonvention für Gestalter, kein Markenbegriff — „Connection" ist gestrichen.', '')
rep('Ergänzt in 010. ', '', 2)
rep('<b>Präzisiert in 010:</b> ', '')
rep('<strong>Ergänzt in 010: die Pill ist eine Kantenform.</strong>', '<strong>Die Pill ist eine Kantenform.</strong>')
schneide('<p class="note"><b>Warum das hier ausdrücklich steht.</b>',
         '<p>Praktisch heißt das: Die Flächen des Systems', "14 Ueberdruck-Historie")
rep(' Die frühere Fassung versprach, die Ebenen <em>gleichzeitig sichtbar</em> zu machen — genau das nimmt das Systemgesetz zurück.', '')
ersetze_muster(r'<p><b><span class=\"mk\">neo brand</span> \d+</b> — Living Document, [^.]+\.',
               '<p><b><span class="mk">neo brand</span></b> — Erster Entwurf, September 2026.', "Fusszeile")

# ══ 3 · Ich-Stimme ═══════════════════════════════════════════════════
rep('Meine Empfehlung nach dem Vergleich: eckig', 'Nach dem Vergleich: eckig')
rep('Mein Vorschlag für die Korrektur:', 'Die Korrektur:')
rep('Die Musterregel, die ich vorschlage:', 'Die Musterregel:')
rep('Daraus folgt die Regel, die ich vorschlage: Eine Architektur wird als',
    'Daraus folgt die Regel: Eine Architektur wird als')
rep('Mein Vorschlag für die Ausführung:', 'Die Ausführung:')
rep('Mein Vorschlag für die Ausführung', 'Die Ausführung')
rep('Mein Vorschlag zur Ergänzung:', 'Die Ergänzung:')
rep('Mein Vorschlag ist, die Plattformarchitektur gar nicht zu fotografieren.',
    'Die Plattformarchitektur wird gar nicht fotografiert.')
rep('Mein Vorschlag zur Ausführung:', 'Die Ausführung:', 2)
rep('Mein Vorschlag, es messbar zu machen:', 'Messbar gemacht:')
rep('Mein Vorschlag für das, was erlaubt bleibt:', 'Was erlaubt bleibt:')
rep('Mein Vorschlag für den Übergang:', 'Der Übergang:')
rep('Ich habe geprüft, ob es Dubletten sind:', 'Geprüft, ob es Dubletten sind:')
rep('Die Anteile sind ein Vorschlag, keine Messung.', 'Die Anteile sind ein Richtwert, keine Messung.')
rep('<div class="subhead"><span>—</span><h3>Was ich von dir brauche</h3></div>',
    '<div class="subhead"><span>—</span><h3>Offene Entscheidungen</h3></div>')
rep('<th scope="col">Mein Vorschlag</th>', '<th scope="col">Vorschlag</th>')

# ══ 4 · Selbstkorrekturen ════════════════════════════════════════════
rep('<p><b>Korrektur meines ersten Vorschlags.</b> Ich hatte Icons in Marketingkontexten ganz ausschließen und durch Knoten ersetzen wollen. Das geht an einem realen Bedarf vorbei: Karten brauchen einen <b>Kicker</b>,',
    '<p>Icons haben auch im Marketing eine Aufgabe. Karten brauchen einen <b>Kicker</b>,')
rep('<p><strong>Zur Heroicons-Entscheidung muss ich eine eigene Angabe zurücknehmen.</strong> Ich hatte sie als ungenutzte dritte Bibliothek beschrieben. Das war falsch: Sie werden über',
    '<p><strong>Heroicons sind in Betrieb.</strong> Sie werden über')
rep('serverseitig gerendert. Meine erste Prüfung hatte die Datei <span class="m" style="text-transform:none;letter-spacing:0">neo_fe.theme</span> verfehlt, weil sie nicht auf <span class="m" style="text-transform:none;letter-spacing:0">.php</span> endet.</p>',
    'serverseitig gerendert.</p>')
rep('<b>Heroicons sind in Betrieb</b>, und ich hatte sie als Altlast beschrieben — die Korrektur steht darüber. Daraus folgt',
    '<b>Heroicons sind in Betrieb</b> und keine Altlast. Daraus folgt')
rep('Und beides sollte jemand tun, der die Datei danach auch prüft — <b>ich kann die Layouts erzeugen, aber nicht sehen, wie PowerPoint sie darstellt.</b>',
    'Und beides sollte jemand tun, der die Datei danach auch prüft: <b>Die erzeugten Layouts müssen in PowerPoint gesichtet werden, bevor sie in Umlauf gehen.</b>')

# Restliche Vorschlagsformeln entpersonalisieren
rep('<b>Mein Vorschlag</b> unterscheidet', '<b>Der Vorschlag</b> unterscheidet')
rep('<b>mein Vorschlag</b> fasst sie zusammen', '<b>der Vorschlag</b> fasst sie zusammen')
rep('<b>Mein Vorschlag</b> für die Auswahlregel', '<b>Der Vorschlag</b> für die Auswahlregel')
rep('Mein Vorschlag', 'Vorschlag', s.count('Mein Vorschlag'))

# ══ 5 · Leseranrede ══════════════════════════════════════════════════
rep('Die Entscheidung liegt trotzdem bei dir; die Beispiele oben zeigen beide Fassungen nebeneinander.',
    'Die Entscheidung ist damit vorbereitet, aber nicht getroffen — die Beispiele oben zeigen beide Fassungen nebeneinander.')
rep('<p>Die Referenz, die du genannt hast, trägt: Pentagram beschreibt',
    '<p>Als Referenz trägt Tractable: Pentagram beschreibt')
rep('Mit Graphic Language auf 08 rückt dieses Kapitel auf <b>09</b>.',
    'Es steht als Kapitel <b>09</b>.')

if fehler:
    print(f"  {len(fehler)} Anker sitzen nicht:")
    for f in fehler: print("   ·", f)
    sys.exit(1)

D.joinpath("brand-oeffentlich.html").write_text(s)
print(f"  {getan} Eingriffe · {ausgang} → {len(s)} Zeichen")
for w in ["ich ", "mein", "Mein", "Änderungen 0", "Version 00", "Living Document", "in 010", "Fassung 010", "in 011", "seit 011", "Bis 010"]:
    n = s.count(w)
    print(f"  Rest {w!r}: {n}")
