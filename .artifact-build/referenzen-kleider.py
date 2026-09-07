#!/usr/bin/env python3
"""Referenzen-Artefakt: Entscheidungen vom 07.09.2026 eintragen, Abschnitt 05 „Key Facts in sechs Kleidern“ einfuegen."""
import sys, pathlib
P = pathlib.Path(__file__).resolve().parent / 'referenzen.html'
s = P.read_text(encoding='utf-8'); fehler = []
def rep(a, b, mal=1):
    global s
    if s.count(a) != mal: fehler.append(f'{s.count(a)}× statt {mal}×: {a[:80]}'); return
    s = s.replace(a, b)

# ── CSS ────────────────────────────────────────────────────────────────
rep('.slide .arrow{position:absolute;left:940px;top:600px;width:40px;text-align:center;font-family:var(--f-tech);font-size:18px;letter-spacing:3px;color:#595c59}',
'''.slide .arrow{position:absolute;left:940px;top:600px;width:40px;text-align:center;font-family:var(--f-tech);font-size:18px;letter-spacing:3px;color:#595c59}
.slide .face{position:absolute;width:120px;height:120px;border-radius:50%;background:#d2d4d2;display:flex;align-items:center;justify-content:center;font-family:var(--f-tech);font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#595c59}
/* Kleider */
.slide .motto{position:absolute;left:80px;top:250px;width:1760px;font-family:var(--f-brand);font-weight:700;font-size:40px;letter-spacing:-.5px;color:var(--forest);text-transform:uppercase}
.slide .form{position:absolute;left:80px;top:330px;width:1760px;border:3px solid var(--forest);display:grid;grid-template-columns:1fr 1fr}
.slide .form .c{border:1.5px solid var(--forest);margin:-1px;padding:22px 28px 24px;min-height:120px;display:flex;gap:26px;align-items:flex-start}
.slide .form .c.w{grid-column:1/3}
.slide .form .c .l{font-family:var(--f-tech);font-size:20px;letter-spacing:4px;text-transform:uppercase;color:var(--forest);padding-top:10px;min-width:170px}
.slide .form .c .v{font-family:var(--f-brand);font-weight:500;font-size:40px;letter-spacing:-.5px;line-height:1.15;color:#161816;padding-top:2px}
.slide .form .c .v b{font-weight:700}
.slide .pass{position:absolute;left:80px;top:300px;width:1760px;height:560px;background:#fff;border:1px solid #d2d4d2;display:grid;grid-template-columns:1240px 520px}
.slide .pass .main{position:relative;padding:0}
.slide .pass .stub{position:relative;border-left:3px dashed #909390;padding:0}
.slide .pass .strip{height:80px;background:var(--forest-deep);color:var(--g100);display:flex;align-items:center;justify-content:space-between;padding:0 40px;font-family:var(--f-tech);font-size:20px;letter-spacing:4px;text-transform:uppercase}
.slide .pass .fields{display:grid;grid-template-columns:repeat(3,1fr);gap:34px 40px;padding:44px 40px 0}
.slide .pass .f .l{font-family:var(--f-tech);font-size:17px;letter-spacing:3px;text-transform:uppercase;color:#595c59;margin-bottom:8px}
.slide .pass .f .v{font-family:var(--f-brand);font-weight:500;font-size:36px;letter-spacing:-.5px;line-height:1.1;color:#161816}
.slide .pass .f .v b{font-weight:700}
.slide .pass .f.xl .v{font-size:56px;letter-spacing:-2px}
.slide .pass .bar{position:absolute;left:40px;right:40px;bottom:40px;height:90px;background:repeating-linear-gradient(90deg,#161816 0 3px,transparent 3px 7px,#161816 7px 9px,transparent 9px 16px,#161816 16px 22px,transparent 22px 26px)}
.slide .akte{position:absolute;left:80px;top:330px;width:1760px;height:560px;background:#fff;border:1px solid #afb2af}
.slide .akte .tab{position:absolute;left:-1px;top:-58px;height:58px;padding:0 30px;background:#fff;border:1px solid #afb2af;border-bottom:0;display:flex;align-items:center;font-family:var(--f-tech);font-size:20px;letter-spacing:4px;text-transform:uppercase;color:#161816}
.slide .akte .lines{position:absolute;inset:0;background:repeating-linear-gradient(180deg,transparent 0 79px,#d2d4d2 79px 80px);margin-top:0}
.slide .akte .top{position:absolute;left:0;right:0;top:80px;height:2px;background:var(--forest)}
.slide .akte .row{position:absolute;left:60px;height:80px;display:flex;align-items:center;gap:30px;font-family:var(--f-tech);font-size:26px;letter-spacing:1px;color:#161816}
.slide .akte .row .l{color:#595c59;min-width:300px;text-transform:uppercase;font-size:20px;letter-spacing:4px}
.slide .akte .row b{font-weight:500;font-family:var(--f-brand);font-size:32px;letter-spacing:-.3px}
.slide .stamp{position:absolute;right:120px;top:120px;transform:rotate(-7deg);border:4px solid var(--forest);color:var(--forest);padding:14px 26px;font-family:var(--f-tech);font-size:26px;letter-spacing:5px;text-transform:uppercase;line-height:1.2;text-align:center}
.slide .plate{position:absolute;left:80px;top:300px;width:1760px;height:580px;background:#e4e6e4;border:2px solid #909390;box-shadow:inset 0 0 0 10px #e4e6e4,inset 0 0 0 12px #909390}
.slide .plate .sq{position:absolute;width:24px;height:24px;background:#161816}
.slide .plate .grid{position:absolute;left:60px;top:60px;right:60px;bottom:60px;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);border:1.5px solid #161816}
.slide .plate .grid div{border:1.5px solid #161816;margin:-.75px;padding:22px 26px;font-family:var(--f-tech);text-transform:uppercase}
.slide .plate .grid .l{display:block;font-size:17px;letter-spacing:4px;color:#595c59;margin-bottom:10px}
.slide .plate .grid .v{display:block;font-size:34px;letter-spacing:2px;color:#161816;line-height:1.15}
.slide .plate .grid div.acc{background:var(--lime)}
.slide .bon{position:absolute;left:80px;top:270px;width:640px;height:720px;background:#fff;border:1px solid #d2d4d2;padding:44px 46px 0;font-family:var(--f-tech);font-size:24px;letter-spacing:1px;color:#161816;clip-path:polygon(0 0,100% 0,100% calc(100% - 18px),97% 100%,94% calc(100% - 18px),91% 100%,88% calc(100% - 18px),85% 100%,82% calc(100% - 18px),79% 100%,76% calc(100% - 18px),73% 100%,70% calc(100% - 18px),67% 100%,64% calc(100% - 18px),61% 100%,58% calc(100% - 18px),55% 100%,52% calc(100% - 18px),49% 100%,46% calc(100% - 18px),43% 100%,40% calc(100% - 18px),37% 100%,34% calc(100% - 18px),31% 100%,28% calc(100% - 18px),25% 100%,22% calc(100% - 18px),19% 100%,16% calc(100% - 18px),13% 100%,10% calc(100% - 18px),7% 100%,4% calc(100% - 18px),1% 100%,0 calc(100% - 18px))}
.slide .bon .h{text-align:center;text-transform:uppercase;letter-spacing:5px;font-size:20px;color:#595c59;margin-bottom:26px}
.slide .bon .r{display:flex;align-items:baseline;gap:12px;margin:0 0 16px}
.slide .bon .r span:first-child{white-space:nowrap}
.slide .bon .r .d{flex:1;border-bottom:2px dotted #909390;transform:translateY(-8px)}
.slide .bon .r span:last-child{white-space:nowrap;text-align:right}
.slide .bon .sum{border-top:2px solid #161816;border-bottom:2px solid #161816;padding:16px 0;margin:22px 0 18px;display:flex;justify-content:space-between;font-weight:500;font-family:var(--f-brand);font-size:34px;letter-spacing:-.3px}
.slide .bon .sum b{font-weight:700}
.slide .bon .ft{text-align:center;font-size:18px;letter-spacing:4px;text-transform:uppercase;color:#595c59;margin-top:20px}
.slide .board{position:absolute;left:80px;top:300px;width:1760px;background:var(--forest-deep);padding:34px 40px 26px;font-family:var(--f-tech);text-transform:uppercase;color:var(--g100)}
.slide .board .hd{display:grid;grid-template-columns:260px 1fr 1fr 360px;gap:30px;font-size:17px;letter-spacing:4px;color:#aabdbe;padding-bottom:16px;border-bottom:1px solid #29585c}
.slide .board .rw{display:grid;grid-template-columns:260px 1fr 1fr 360px;gap:30px;font-size:30px;letter-spacing:3px;padding:24px 0;border-bottom:1px solid #29585c}
.slide .board .rw:last-child{border-bottom:0}
.slide .board .rw i{font-style:normal;color:var(--lime)}
.slide .board .rw em{font-style:normal;color:#aabdbe}''')

# ── Entscheidungen statt offener Fragen ────────────────────────────────
rep('''    <h3 style="margin-top:22px">Zu entscheiden</h3>
    <ul class="tight">
      <li><b>Standardtiefe im Versand:</b> M1 für alle sieben, oder S3 plus M1 nur für die Leuchttürme?</li>
      <li><b>Leuchttürme:</b> Rentenversicherung und Polizei Baden-Württemberg, oder andere zwei?</li>
      <li><b>Titel der Use-Case-Folie:</b> der Vorgang (wie hier) oder der Kundenname?</li>
      <li><b>Zitate:</b> nur mit Namen und Freigabe, oder auch als „Projektleitung, Kunde"?</li>
      <li><b>Bildschirme:</b> echte Screens mit Freigabe, oder die neutrale Produktfassung mit Testdaten aus der Produktpräsentation?</li>
    </ul>''',
'''    <h3 style="margin-top:22px">Entschieden am 07.09.2026</h3>
    <ul class="tight">
      <li><b>Versand:</b> S3 Referenzraster plus M1 Key Facts.</li>
      <li><b>Standardfoliensatz:</b> Jede Referenz wird in Short, Medium und Long ausgearbeitet und liegt in allen drei Tiefen im Standardfoliensatz. Welche Tiefe gezeigt wird, entscheidet je Sales-Präsentation, Vortrag und Event der Präsentator. Folge: sieben Referenzen mal vier bis fünf Folien, rund dreißig Folien im Kapitel; die Erhebung der Steckbriefe ist für alle sieben Pflicht.</li>
      <li><b>Titel:</b> der Kundenname; der Use Case kann mit Gedankenstrich angehängt werden („Polizei Baden-Württemberg — Dienstinformationen erreichen jede Streife").</li>
      <li><b>Zitate:</b> mit Name und Funktion (Projektleitung), optional mit Bild.</li>
      <li><b>Bildschirme:</b> echte Bildschirme mit Freigabe des Kunden.</li>
    </ul>''')

# Folgen der Entscheidungen in den Mockups: L1-Titel, M3 mit Bild, L2-Hinweis
rep('<p class="ttl">Dienstinformationen erreichen jede Streife</p>\n          <div class="hair" style="top:229px"></div>\n          <div class="tag" style="top:250px">Beispielinhalte</div>',
    '<p class="ttl">Polizei Baden-Württemberg — Dienstinformationen erreichen jede Streife</p>\n          <div class="hair" style="top:229px"></div>\n          <div class="tag" style="top:250px">Beispielinhalte</div>')
rep('<div class="who">Name, Funktion · Polizei Baden-Württemberg</div>',
    '<div class="face" style="left:80px;top:690px">Bild</div><div class="who" style="left:230px;top:720px">Vorname Name, Projektleitung · Polizei Baden-Württemberg</div>')
rep('Bildschirme brauchen die Freigabe des Kunden oder plausible Testdaten.', 'Bildschirme sind echte Bildschirme mit Freigabe des Kunden (entschieden).')
rep('<b>L1 · Use Case im Dreiklang.</b> Ausgangslage, Lösung, Ergebnis als drei Spalten (Anordnung „Reihe"). Der Titel nennt den Vorgang, nicht den Kunden — der Kunde steht im Kicker und im Logo.',
    '<b>L1 · Use Case im Dreiklang.</b> Ausgangslage, Lösung, Ergebnis als drei Spalten (Anordnung „Reihe"). Der Titel nennt den Kunden und hängt den Use Case mit Gedankenstrich an (entschieden).')

# ── Abschnitt 05: Kleider ──────────────────────────────────────────────
def head(kick, ttl, extra=''):
    return f'<div class="kick">{kick}</div><p class="ttl">{ttl}</p>{extra}<div class="foot l">neocosmo 2026</div><div class="foot m">Referenzen</div><div class="foot r">Seite</div>'
K = 'Referenz · 01 · Sozialversicherung'; T = 'Sieben Rentenversicherungsträger'
kleider = f'''
  <section>
    <div class="shead"><div class="snum">05</div><div><h2>Key Facts in sechs Kleidern</h2><p class="sdek">Dieselben sechs Zeilen des Steckbriefs, sechsmal anders gefasst — als Amtsformular, Bordkarte, Akte, Typenschild, Kassenbon und Anzeigetafel. Die Metapher wechselt, die Grammatik nicht: Mono für Beschriftungen, Space Grotesk für Werte, Tinte auf Papier, eine Betonung. Keine Handschrift, kein viertes Schriftbild — das „Eingetragene" entsteht durch Versatz und Gewicht.</p></div></div>
    <div class="law"><p>Ein Kleid je Kunde, nie zwei Kleider in einer Präsentation. Die Metapher gehört zum Kunden, nicht zur Laune.</p><p class="src">Regel für die Kleider</p></div>
    <div class="deck">

      <div class="exhibit">
        <div class="frame"><div class="slide">
          {head(K, T)}
          <div class="motto">Gemeinsame Plattform — Sieben Träger — Ein Betreiber</div>
          <div class="form">
            <div class="c"><span class="l">Größe</span><span class="v"><b>7 Mandanten</b>, 18.000 Nutzerinnen und Nutzer</span></div>
            <div class="c"><span class="l">Betrieb</span><span class="v">On Premises, NOW-IT</span></div>
            <div class="c w"><span class="l">Module</span><span class="v">Intranet, intelligente Benachrichtigungen, Inhaltsempfehlungen</span></div>
            <div class="c"><span class="l">Zeitraum</span><span class="v">seit 20xx</span></div>
            <div class="c"><span class="l">Besonderheit</span><span class="v">Barrierefreiheit zertifiziert, Migration vom Altsystem</span></div>
          </div>
        </div></div>
        <div class="cap"><div><b>K1 · Amtsformular.</b> Die Anlage als Vorbild: Mottozeile in Versalien, darunter das Formular mit Feldern, deren Beschriftung klein links sitzt und deren Wert groß „eingetragen" ist. Rahmen und Beschriftungen in Forest statt Amtsgrün. Passt zu Verwaltung und Sozialversicherung — dort kennt jeder das Formular, und die Selbstironie ist leise.</div><div class="meta">BETONUNG: „7 MANDANTEN" (GEWICHT)<br>PASST ZU: VERWALTUNG · SOZIALVERSICHERUNG<br>RISIKO: KEINS, WENN DIE MOTTOZEILE ERNST BLEIBT</div></div>
      </div>

      <div class="exhibit">
        <div class="frame"><div class="slide">
          {head(K, T)}
          <div class="pass">
            <div class="main">
              <div class="strip"><span>Bordkarte · Referenz 01</span><span>neocosmo</span></div>
              <div class="fields">
                <div class="f xl" style="grid-column:1/3"><div class="l">Von → Nach</div><div class="v">Altsystem → <b>neo workplace</b></div></div>
                <div class="f"><div class="l">Abflug</div><div class="v">seit 20xx</div></div>
                <div class="f"><div class="l">Passagiere</div><div class="v">18.000</div></div>
                <div class="f"><div class="l">Träger</div><div class="v">7 Mandanten</div></div>
                <div class="f"><div class="l">Klasse</div><div class="v">On Premises</div></div>
                <div class="f" style="grid-column:1/4"><div class="l">Gepäck</div><div class="v">Intranet · Benachrichtigungen · Empfehlungen · Barrierefreiheit zertifiziert</div></div>
              </div>
            </div>
            <div class="stub">
              <div class="strip"><span>Abriss</span></div>
              <div class="fields" style="grid-template-columns:1fr">
                <div class="f"><div class="l">Kunde</div><div class="v">Deutsche Rentenversicherung</div></div>
                <div class="f"><div class="l">Passagiere</div><div class="v">18.000</div></div>
              </div>
              <div class="bar"></div>
            </div>
          </div>
        </div></div>
        <div class="cap"><div><b>K2 · Bordkarte.</b> Die Referenz als Reise: von Altsystem nach <span style="font-family:var(--f-brand);font-weight:700">neo</span> workplace, mit Passagieren, Abflug, Klasse und Gepäck. Der Abriss rechts wiederholt Kunde und Größe, der Strichcode ist ein Graphitmuster. Gut, wenn die Migration die Geschichte ist. Die Betonung ist das Ziel der Reise, fett.</div><div class="meta">BETONUNG: „NEO WORKPLACE" (GEWICHT)<br>PASST ZU: MIGRATION · ROLLOUT · WECHSEL VOM ALTSYSTEM<br>RISIKO: ZU VERSPIELT FÜR VERGABEUNTERLAGEN</div></div>
      </div>

      <div class="exhibit">
        <div class="frame"><div class="slide">
          {head(K, T)}
          <div class="akte">
            <div class="tab">Akte 01 · Sozialversicherung</div>
            <div class="lines"></div><div class="top"></div>
            <div class="row" style="top:0"><span class="l">Betreff</span><b>Gemeinsame Plattform, betrieben durch NOW-IT</b></div>
            <div class="row" style="top:80px"><span class="l">Auftraggeber</span><b>Deutsche Rentenversicherung, sieben Träger</b></div>
            <div class="row" style="top:160px"><span class="l">Umfang</span><b>7 Mandanten · 18.000 Nutzerinnen und Nutzer</b></div>
            <div class="row" style="top:240px"><span class="l">Gegenstand</span><b>Intranet, Benachrichtigungen, Empfehlungen</b></div>
            <div class="row" style="top:320px"><span class="l">Betrieb</span><b>On Premises</b></div>
            <div class="row" style="top:400px"><span class="l">Zeitraum</span><b>seit 20xx</b></div>
            <div class="row" style="top:480px"><span class="l">Ansprechpartner</span><b>Vorname Name, Projektleitung</b></div>
            <div class="stamp">Barrierefrei<br>zertifiziert</div>
          </div>
        </div></div>
        <div class="cap"><div><b>K3 · Akte.</b> Karteikarte mit Reiter, Linienraster und Stempel. Die Felder heißen wie im Vergabe-Referenzblatt (Auftraggeber, Umfang, Gegenstand, Zeitraum, Ansprechpartner) — dieses Kleid ist damit zugleich die Vorlage für Ausschreibungen. Die Betonung ist der Stempel, gedreht, in Forest.</div><div class="meta">BETONUNG: DER STEMPEL (FORM)<br>PASST ZU: BEHÖRDEN · POLIZEI · VERGABE<br>RISIKO: KEINS — DAS ERNSTESTE KLEID</div></div>
      </div>

      <div class="exhibit">
        <div class="frame"><div class="slide grau">
          {head(K, T)}
          <div class="plate">
            <div class="sq" style="left:22px;top:22px"></div><div class="sq" style="right:22px;top:22px"></div><div class="sq" style="left:22px;bottom:22px"></div><div class="sq" style="right:22px;bottom:22px"></div>
            <div class="grid">
              <div><span class="l">Typ</span><span class="v">neo workplace</span></div>
              <div><span class="l">Hersteller</span><span class="v">neocosmo GmbH</span></div>
              <div><span class="l">Baujahr</span><span class="v">seit 20xx</span></div>
              <div class="acc"><span class="l">Mandanten</span><span class="v">7</span></div>
              <div><span class="l">Nutzer</span><span class="v">18.000</span></div>
              <div><span class="l">Betrieb</span><span class="v">On Premises · NOW-IT</span></div>
              <div><span class="l">Ausstattung</span><span class="v">Intranet · Benachr. · Empfehlungen</span></div>
              <div><span class="l">Prüfung</span><span class="v">Barrierefrei zertifiziert</span></div>
              <div><span class="l">Vorgänger</span><span class="v">Altsystem, migriert</span></div>
            </div>
          </div>
        </div></div>
        <div class="cap"><div><b>K4 · Typenschild.</b> Eine Maschinenplakette: doppelter Rand, vier Quadrate als Schrauben (die Form aus Kapitel 05.8), neun Felder in Mono-Versalien. Die Betonung ist das eine Lime-Feld mit Tinte darauf — der zulässige Fall aus 5.3. Passt zu Technik und Industrie, zu Betrieb und Architektur.</div><div class="meta">BETONUNG: LIME-FELD „7 MANDANTEN" (SIGNAL)<br>PASST ZU: TECHNIK · INDUSTRIE · IT-DIENSTLEISTER<br>RISIKO: WIRKT KALT BEI MENSCHEN-THEMEN</div></div>
      </div>

      <div class="exhibit">
        <div class="frame"><div class="slide">
          {head(K, T)}
          <div class="bon">
            <div class="h">neocosmo · Referenz 01</div>
            <div class="r"><span>Mandanten</span><span class="d"></span><span>7</span></div>
            <div class="r"><span>Nutzerinnen und Nutzer</span><span class="d"></span><span>18.000</span></div>
            <div class="r"><span>Intranet</span><span class="d"></span><span>1</span></div>
            <div class="r"><span>Benachrichtigungen</span><span class="d"></span><span>1</span></div>
            <div class="r"><span>Empfehlungen</span><span class="d"></span><span>1</span></div>
            <div class="r"><span>Betrieb On Premises</span><span class="d"></span><span>NOW-IT</span></div>
            <div class="r"><span>Barrierefreiheit</span><span class="d"></span><span>zertifiziert</span></div>
            <div class="r"><span>Altsystem</span><span class="d"></span><span>migriert</span></div>
            <div class="sum"><span>Summe</span><span><b>eine Plattform</b></span></div>
            <div class="ft">seit 20xx · vielen Dank</div>
          </div>
          <div class="ph pic" style="left:800px;top:270px;width:1040px;height:720px">Bild oder Bildschirm</div>
        </div></div>
        <div class="cap"><div><b>K5 · Kassenbon.</b> Der Steckbrief als Beleg: Posten mit Punktlinien, die Summe unten als die eine Aussage — „eine Plattform". Schmal links, daneben Bild oder Bildschirm. Gut für Zahlenkunden und für Folien, auf denen das Bild die Hälfte tragen soll. Die Betonung ist die Summenzeile.</div><div class="meta">BETONUNG: DIE SUMME (GEWICHT)<br>PASST ZU: WOHNUNGSWIRTSCHAFT · MITTELSTAND · KENNZAHLEN<br>RISIKO: „QUITTUNG" KANN NACH KOSTEN KLINGEN</div></div>
      </div>

      <div class="exhibit">
        <div class="frame"><div class="slide">
          {head(K, T)}
          <div class="board">
            <div class="hd"><span>Zeit</span><span>Von</span><span>Nach</span><span>Status</span></div>
            <div class="rw"><span>seit 20xx</span><span>Altsystem</span><span>neo workplace</span><span><i>in Betrieb</i></span></div>
            <div class="rw"><span>7</span><span>Träger</span><span>eine Plattform</span><span><em>Mandanten</em></span></div>
            <div class="rw"><span>18.000</span><span>Nutzerinnen und Nutzer</span><span>On Premises · NOW-IT</span><span><em>Betrieb</em></span></div>
            <div class="rw"><span>3</span><span>Module</span><span>Intranet · Benachr. · Empfehlungen</span><span><em>Ausstattung</em></span></div>
            <div class="rw"><span>BITV</span><span>Barrierefreiheit</span><span>zertifiziert</span><span><em>Prüfung</em></span></div>
          </div>
        </div></div>
        <div class="cap"><div><b>K6 · Anzeigetafel.</b> Die Abfahrtstafel: Zeit, Von, Nach, Status in Mono-Versalien auf Forest. Die Betonung ist der eine Status in Lime — „in Betrieb", Lime auf Forest 800 mit 7,9:1. Passt, wenn Zeitraum und Rollout die Geschichte sind, und als dunkle Folie zwischen hellen.</div><div class="meta">BETONUNG: STATUS „IN BETRIEB" (SIGNAL)<br>PASST ZU: ROLLOUT · MEHRERE STANDORTE · HOCHSCHULEN<br>RISIKO: DIE TAFEL ERZWINGT KURZE WERTE</div></div>
      </div>
    </div>

    <div class="tbl"><table>
      <thead><tr><th>Kleid</th><th>Metapher</th><th>Betonung</th><th>Passt zu</th><th>Vergabe-tauglich</th><th>Aufwand in Figma</th></tr></thead>
      <tbody>
        <tr><td><b>K1 Amtsformular</b></td><td>Formular vom Amt</td><td>Gewicht im Wert</td><td>Verwaltung, Sozialversicherung</td><td class="yes">ja</td><td>gering — Tabelle mit Rahmen</td></tr>
        <tr><td><b>K2 Bordkarte</b></td><td>Reise, Abriss, Strichcode</td><td>Gewicht im Ziel</td><td>Migration, Rollout</td><td class="no">nein</td><td>mittel — zwei Teile, Strichcode</td></tr>
        <tr><td><b>K3 Akte</b></td><td>Karteikarte, Reiter, Stempel</td><td>der Stempel</td><td>Behörden, Polizei, Vergabe</td><td class="yes">ja — Feldnamen der Vergabe</td><td>gering</td></tr>
        <tr><td><b>K4 Typenschild</b></td><td>Maschinenplakette</td><td>Lime-Feld</td><td>Technik, IT-Dienstleister</td><td class="yes">ja</td><td>gering — Raster 3 × 3</td></tr>
        <tr><td><b>K5 Kassenbon</b></td><td>Beleg mit Summe</td><td>die Summe</td><td>Kennzahlen, Mittelstand</td><td class="no">bedingt</td><td>gering — Zackenkante als Vektor</td></tr>
        <tr><td><b>K6 Anzeigetafel</b></td><td>Abfahrtstafel</td><td>Status in Lime</td><td>Rollout, mehrere Standorte</td><td class="no">bedingt</td><td>gering — dunkle Tabelle</td></tr>
      </tbody>
    </table></div>
    <div class="grid g3">
      <div class="card"><p class="lbl">Regel 01</p><h3>Ein Kleid je Kunde</h3><p>Die Metapher folgt dem Kunden und seiner Geschichte: die Akte für die Polizei, die Bordkarte für die Migration, das Typenschild für den IT-Dienstleister. Innerhalb einer Präsentation wechselt das Kleid mit dem Kunden, nie innerhalb einer Referenz.</p></div>
      <div class="card"><p class="lbl">Regel 02</p><h3>M1 bleibt der Grundfall</h3><p>Die schlichte Key-Facts-Folie ist die Fassung für Vergabe, PDF und alle Kunden ohne passende Metapher. Die Kleider sind Abwechslung, keine Pflicht — wer keins wählt, nimmt M1.</p></div>
      <div class="card"><p class="lbl">Regel 03</p><h3>Die Grammatik bleibt</h3><p>Schriften, Tinte, Papier, Forest und das eine Signal wie überall. Das Kleid darf Rahmen, Reiter, Zacken, Stempel und Strichcode bringen — aber keine Handschrift, keine Fremdfarbe, keinen Schatten. So bleibt es erkennbar dieselbe Präsentation.</p></div>
    </div>
  </section>
'''
rep('  <section>\n    <div class="shead"><div class="snum">05</div><div><h2>Empfehlung und Reihenfolge</h2>', kleider + '\n  <section>\n    <div class="shead"><div class="snum">06</div><div><h2>Empfehlung und Reihenfolge</h2>')
rep('<tr><td class="m">RF4 Key Facts</td><td>Referenzen</td><td>heutige DRV-Folie, TB1</td><td>Standard, Versand, Vergabe</td></tr>',
    '<tr><td class="m">RF4 Key Facts</td><td>Referenzen</td><td>heutige DRV-Folie, TB1</td><td>Standard, Versand, Vergabe</td></tr>\n        <tr><td class="m">RF4a–f Key Facts im Kleid</td><td>Referenzen</td><td>RF4 als Amtsformular, Bordkarte, Akte, Typenschild, Kassenbon, Anzeigetafel</td><td>Abwechslung je Kunde</td></tr>')
rep('Das Foliensystem wächst damit von 16 auf 17 Familien und von 114 auf 123 Vorlagen.', 'Das Foliensystem wächst damit von 16 auf 17 Familien und von 114 auf 129 Vorlagen (neun Grundvorlagen, sechs Kleider).')
rep('<p class="src">Konzept · 07.09.2026 · zur Entscheidung</p>', '<p class="src">Konzept · 07.09.2026 · Grundsatzentscheidungen getroffen, Kleider zur Auswahl</p>')

if fehler: sys.exit('ABBRUCH:\n' + '\n'.join(fehler))
P.write_text(s, encoding='utf-8'); print('ok', len(s)//1024, 'KB')
