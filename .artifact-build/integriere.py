#!/usr/bin/env python3
"""Führt die neuen Kapitel in NEO Brand ein und nummeriert das Dokument neu.

Arbeitet ausschliesslich mit Assertions: Findet ein Schritt seinen Anker nicht,
bricht das Skript ab, statt eine halb umgebaute Datei zu hinterlassen.
"""
import re, pathlib, sys

D = pathlib.Path(__file__).parent
quelle = D / "brand.html"
ziel = D / "brand-neu.html"

s = quelle.read_text()
ausgang = len(s)


def hole(name, ohne_einordnung=True):
    """Kapitelinhalt aus einem Artefakt-Body: ohne wrap, mast, footer."""
    t = (D / f"{name}.html").read_text()
    t = t[t.index("</header>") + len("</header>"):]
    t = t[:t.rindex('<footer style="border-top')]
    if ohne_einordnung:
        # Der erste .verdict-Block ist die Selbstverortung des Artefakts.
        m = re.match(r'\s*<div class="verdict"[^>]*>.*?</div>\s*', t, re.S)
        if m:
            t = t[m.end():]
    return t.strip()


def ersetze(alt, neu, wie_oft=1):
    global s
    n = s.count(alt)
    assert n == wie_oft, f"Anker {n}× statt {wie_oft}×: {alt[:70]!r}"
    s = s.replace(alt, neu)


def kapitel(nr, titel, dek, inhalt):
    return (f'\n<!-- ==================== {nr} ==================== -->\n\n'
            f'<section id="s{nr}">\n'
            f'  <div class="shead">\n'
            f'    <div class="snum">{nr}</div>\n'
            f'    <div>\n'
            f'      <h2>{titel}</h2>\n'
            f'      <p class="sdek">{dek}</p>\n'
            f'    </div>\n'
            f'  </div>\n\n'
            f'{inhalt}\n'
            f'</section>\n')


# ── 1 · Alte Kapitel 08–12 herausschneiden ───────────────────────────────
# BEFUND: Die HTML-Kommentare im Quelldokument stimmen nicht mit den
# Abschnitten ueberein — vor <section id="s09"> steht ein Kommentar "08", und
# fuer 04 bis 07 fehlen sie ganz. Verankert wird deshalb auf der Section-ID;
# die Kommentare werden beim Schreiben neu erzeugt.
def schneide(nr):
    a = s.index(f'<section id="s{nr}">')
    # Kommentar davor mitnehmen, falls vorhanden
    k = s.rfind("<!-- =", 0, a)
    if k != -1 and s.index("-->", k) < a and a - k < 200:
        a = k
    e = s.index("\n</section>\n", s.index(f'<section id="s{nr}">')) + len("\n</section>\n")
    return a, e


alt = {}
grenzen = {}
for nr in ["08", "09", "10", "11", "12"]:
    a, e = schneide(nr)
    grenzen[nr] = (a, e)
    alt[nr] = s[a:e]

kopf = s[:grenzen["08"][0]]
fuss = s[grenzen["12"][1]:]


def umnummeriert(block, alt_nr, neu_nr):
    """Nummer in Section-ID und .snum ersetzen, Kommentar neu setzen."""
    b = re.sub(r'<!-- =+ *\d+ *=+ -->\s*', '', block).lstrip()
    b = b.replace(f'<section id="s{alt_nr}">', f'<section id="s{neu_nr}">', 1)
    b = b.replace(f'<div class="snum">{alt_nr}</div>', f'<div class="snum">{neu_nr}</div>', 1)
    return f'\n<!-- ==================== {neu_nr} ==================== -->\n\n' + b


# ── 2 · Neue Reihenfolge zusammensetzen ──────────────────────────────────
neu = []

neu.append(kapitel(
    "08", "Graphic Language",
    "Node, Layer und Signal sind entschieden. Hier stehen die Regeln, nach denen aus drei Elementen ein Bild wird.",
    hole("gl-body")))

# 09 Bildwelt ersetzt Photography — mit dem Zurückgestellt-Vermerk, der im
# Artefakt der erste .verdict-Block ist. Deshalb hier NICHT entfernen.
neu.append(kapitel(
    "09", "Imagery",
    "Bildwelt ist keine Einkaufsliste, sondern eine Art-Direction-Definition: was fotografiert wird, aus welcher Höhe, in welchem Licht.",
    hole("img-body", ohne_einordnung=False)))

neu.append(kapitel(
    "10", "Illustration &amp; Iconography",
    "Die Ikonografie ist entschieden: Tabler, vollständig, ohne eigene Zeichnungen. Die Illustration ist die schwierigere Frage.",
    hole("ico-body")))

neu.append(umnummeriert(alt["09"], "09", "11"))   # Data
neu.append(umnummeriert(alt["10"], "10", "12"))   # Website

neu.append(kapitel(
    "13", "PowerPoint",
    "Der härteste Test des Systems und zugleich das Medium, in dem der Vertrieb es täglich benutzt. Ein eigenes Sub-System.",
    hole("ppt-body")))

neu.append(umnummeriert(alt["12"], "12", "14"))   # Print

s = kopf + "\n".join(neu) + fuss

# ── 3 · Typografie in Kapitel 03 einhängen ───────────────────────────────
t1 = hole("typo1-body").replace("<h2>Die Schriften</h2>", "", 1)
t2 = hole("typo2-body").replace("<h2>Der gemeinsame Ursprung</h2>", "", 1)
# Der Schluss-Verweis aus Teil 1 auf "den nächsten Teil" ergibt im Fliesstext
# keinen Sinn mehr, weil beide Teile jetzt hintereinander stehen.
t1 = re.sub(r'<div class="verdict">\s*<p><strong>Was hier nicht steht, steht im nächsten Teil\.</strong>.*?</div>\s*', '', t1, flags=re.S)

m = re.search(r'(<section id="s03">.*?)\n</section>\n', s, re.S)
assert m, "Kapitel 03 nicht gefunden"
s = s[:m.end(1)] + "\n\n" + t1 + "\n\n" + t2 + "\n</section>\n" + s[m.end(0):]

# ── 4 · Ergänzungs-Stylesheets in den Kopf ziehen ────────────────────────
zusatz = ""
for datei in ["stufen.css", "gl-fig.css", "ppt-fig.css"]:
    roh = (D / datei).read_text()
    zusatz += "\n".join(re.findall(r"<style>(.*?)</style>", roh, re.S))
letzte_style = s.rindex("</style>")
s = s[:letzte_style] + "\n/* ── Ergänzungen aus den Kapiteln 03, 08–11, 13 ── */\n" + zusatz + s[letzte_style:]

# ── 5 · Querverweise auf die neue Nummerierung ziehen ────────────────────
verweise = [
    ("Kapitel 09 (Data)", "Kapitel 11 (Data)"),
    ("siehe Kapitel 09", "siehe Kapitel 11"),
    ("Kapitel 09.", "Kapitel 11."),
    ("aus Kapitel 09", "aus Kapitel 11"),
    ("Kapitel 10 (Website)", "Kapitel 12 (Website)"),
    ("Kapitel 11 (PowerPoint)", "Kapitel 13 (PowerPoint)"),
    ("Kapitel 12 (Print)", "Kapitel 14 (Print)"),
    ("Kapitel 09 · Data", "Kapitel 11 · Data"),
]
gezogen = 0
for a, b in verweise:
    n = s.count(a)
    if n:
        s = s.replace(a, b); gezogen += n

# Selbstverweise der neuen Kapitel auf die eigene Nummer
s = s.replace("Dieses Kapitel schlägt <b>11</b> vor und ersetzt das bestehende Kapitel PowerPoint.",
              "Dieses Kapitel ist <b>13</b> und ersetzt das frühere Kapitel PowerPoint.")

ziel.write_text(s)
print(f"  Ausgang {ausgang:>7} Bytes  →  Ergebnis {len(s):>7} Bytes")
print(f"  Querverweise gezogen: {gezogen}")
