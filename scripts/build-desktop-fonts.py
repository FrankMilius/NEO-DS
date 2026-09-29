#!/usr/bin/env python3
"""
Baut aus den Variable-Fonts statische TTF-Schnitte fuer Windows, macOS und
Microsoft Office.

Warum das noetig ist
--------------------
Unter fonts/ liegen Google-Subsets im woff2-Format. Die lassen sich weder
installieren noch in eine .pptx einbetten, und sie enthalten nur rund 220
Zeichen, aufgeteilt auf zwei Dateien (latin / latin-ext). Fuer Dokumente
braucht es die vollstaendigen Schriften als statische TTF.

Warum keine Variable Fonts
--------------------------
Word und PowerPoint werten keine Variationsachsen aus. Eine installierte
Variable Font erscheint dort nur mit ihrer Default-Instanz — bei Manrope
waere das ExtraLight 200.

Warum eigene Familiennamen fuer Zwischengewichte
------------------------------------------------
Das Windows-Schriftmodell kennt pro Familie genau vier Stile: Regular, Bold,
Italic, Bold Italic. Alles darueber hinaus muss als eigene Familie auftreten,
sonst ist es in Word nicht auswaehlbar. Modernere Anwendungen gruppieren die
Familien anhand der typografischen Namen (nameID 16/17) trotzdem korrekt.

Lizenz
------
Alle drei Familien stehen unter der SIL Open Font License 1.1 ohne Reserved
Font Name. Instanzieren und Weitergeben unter dem Originalnamen ist damit
zulaessig; die OFL.txt muss mitgeliefert werden und wird hier mitkopiert.

Aufruf:  python3 scripts/build-desktop-fonts.py
"""

import json
import shutil
import sys
import urllib.request
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / ".cache" / "fontsrc"
OUT = ROOT / "fonts" / "desktop"

GF = "https://raw.githubusercontent.com/google/fonts/main/ofl"

WIN = (3, 1, 0x409)   # Windows / Unicode BMP / en-US
MAC = (1, 0, 0)       # Macintosh / Roman / en

# ---------------------------------------------------------------------------
# Bauplan
# ---------------------------------------------------------------------------
# core   = Teil der Basisfamilie (Regular / Bold / Italic / Bold Italic)
# eigene = eigene Familie, damit Word das Gewicht anbietet
FAMILIES = [
    {
        "name": "Manrope",
        "role": "Fliesstext, Tabellen, Formulare",
        "sources": {"upright": ("manrope", "Manrope%5Bwght%5D.ttf")},
        "license": ("manrope", "OFL.txt"),
        "cuts": [
            {"wght": 400, "core": True,  "sub": "Regular"},
            {"wght": 700, "core": True,  "sub": "Bold"},
            {"wght": 500, "core": False, "suffix": "Medium"},
            {"wght": 600, "core": False, "suffix": "SemiBold"},
            {"wght": 800, "core": False, "suffix": "ExtraBold"},
        ],
    },
    {
        "name": "Space Grotesk",
        "role": "Ueberschriften, Titelfolien, Auszeichnung",
        "sources": {"upright": ("spacegrotesk", "SpaceGrotesk%5Bwght%5D.ttf")},
        "license": ("spacegrotesk", "OFL.txt"),
        "cuts": [
            {"wght": 400, "core": True,  "sub": "Regular"},
            {"wght": 700, "core": True,  "sub": "Bold"},
            {"wght": 300, "core": False, "suffix": "Light"},
            {"wght": 500, "core": False, "suffix": "Medium"},
            {"wght": 600, "core": False, "suffix": "SemiBold"},
        ],
    },
    {
        "name": "JetBrains Mono",
        "role": "Code, Kennzahlen, technische Angaben",
        "sources": {
            "upright": ("jetbrainsmono", "JetBrainsMono%5Bwght%5D.ttf"),
            "italic": ("jetbrainsmono", "JetBrainsMono-Italic%5Bwght%5D.ttf"),
        },
        "license": ("jetbrainsmono", "OFL.txt"),
        "cuts": [
            {"wght": 400, "core": True, "sub": "Regular"},
            {"wght": 700, "core": True, "sub": "Bold"},
            {"wght": 400, "core": True, "sub": "Italic", "italic": True},
            {"wght": 700, "core": True, "sub": "Bold Italic", "italic": True},
        ],
    },
]

# Zeichen, die in deutschen Geschaeftsdokumenten vorkommen muessen.
REQUIRED = {
    "Umlaute/ß": "ÄÖÜäöüß",
    "Anfuehrungszeichen": "„“‚‘»«›‹",
    "Striche": "–—…",
    "Waehrung": "€",
    "Rechtszeichen": "©®™§",
    "Sonstige": "×·°±≤≥≠",
}


def fetch(folder, filename, dest):
    if dest.exists() and dest.stat().st_size > 1000:
        return dest
    url = f"{GF}/{folder}/{filename}"
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        with urllib.request.urlopen(url, timeout=90) as r, dest.open("wb") as fh:
            shutil.copyfileobj(r, fh)
    except Exception as exc:
        sys.exit(f"Download fehlgeschlagen: {url}\n{exc}")
    if dest.stat().st_size < 1000:
        sys.exit(f"Download unplausibel klein: {url}")
    return dest


def set_name(font, name_id, value):
    for plat, enc, lang in (WIN, MAC):
        font["name"].setName(value, name_id, plat, enc, lang)


def drop_name(font, name_id):
    font["name"].names = [n for n in font["name"].names if n.nameID != name_id]


def build_cut(src_path, family, cut):
    base = TTFont(src_path)
    font = instancer.instantiateVariableFont(
        base, {"wght": cut["wght"]}, inplace=False, updateFontNames=False
    )

    italic = cut.get("italic", False)
    if cut["core"]:
        win_family = family["name"]
        win_sub = cut["sub"]
    else:
        win_family = f"{family['name']} {cut['suffix']}"
        win_sub = "Italic" if italic else "Regular"

    typo_sub = cut.get("suffix") or cut["sub"]
    full = win_family if win_sub == "Regular" else f"{win_family} {win_sub}"
    ps = (win_family + "-" + win_sub).replace(" ", "")

    set_name(font, 1, win_family)      # Familie (Windows-Modell)
    set_name(font, 2, win_sub)         # Stil (Windows-Modell)
    set_name(font, 4, full)            # voller Name
    set_name(font, 6, ps)              # PostScript-Name
    set_name(font, 16, family["name"]) # typografische Familie
    set_name(font, 17, typo_sub)       # typografischer Stil
    for nid in (21, 22, 25):           # WWS- und Variations-Namen entfallen
        drop_name(font, nid)

    os2 = font["OS/2"]
    os2.usWeightClass = cut["wght"]
    fs = os2.fsSelection
    fs &= ~((1 << 0) | (1 << 5) | (1 << 6))   # Italic / Bold / Regular loeschen
    if italic:
        fs |= 1 << 0
    if win_sub in ("Bold", "Bold Italic"):
        fs |= 1 << 5
    if win_sub == "Regular":
        fs |= 1 << 6
    fs |= 1 << 7                               # USE_TYPO_METRICS: Zeilenabstand
    os2.fsSelection = fs                       # wie im Web

    mac = font["head"].macStyle & ~0b11
    if win_sub in ("Bold", "Bold Italic"):
        mac |= 0b01
    if italic:
        mac |= 0b10
    font["head"].macStyle = mac

    return font, full, ps, win_family, win_sub


def check_charset(font, path_label, report):
    cmap = font.getBestCmap()
    for label, chars in REQUIRED.items():
        missing = [c for c in chars if ord(c) not in cmap]
        if missing:
            report.append(f"{path_label}: {label} fehlt {' '.join(missing)}")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {"families": [], "note": "Erzeugt von scripts/build-desktop-fonts.py"}
    charset_issues = []
    built = 0

    for family in FAMILIES:
        srcs = {}
        for key, (folder, fname) in family["sources"].items():
            srcs[key] = fetch(folder, fname, CACHE / f"{folder}-{key}.ttf")

        lic_folder, lic_name = family["license"]
        lic_src = fetch(lic_folder, lic_name, CACHE / f"{lic_folder}-OFL.txt")
        lic_dst = OUT / f"OFL-{family['name'].replace(' ', '')}.txt"
        shutil.copyfile(lic_src, lic_dst)

        probe = TTFont(srcs["upright"])
        version = next((str(r) for r in probe["name"].names if r.nameID == 5), "?")
        axis = probe["fvar"].axes[0]
        entry = {
            "family": family["name"],
            "role": family["role"],
            "upstream_version": version,
            "variable_range": [axis.minValue, axis.maxValue],
            "has_italic": "italic" in srcs,
            "license": lic_dst.name,
            "cuts": [],
        }

        for cut in family["cuts"]:
            src = srcs["italic"] if cut.get("italic") else srcs["upright"]
            font, full, ps, win_family, win_sub = build_cut(src, family, cut)
            filename = ps + ".ttf"
            font.save(OUT / filename)
            check_charset(font, filename, charset_issues)
            entry["cuts"].append({
                "file": filename,
                "windows_family": win_family,
                "windows_style": win_sub,
                "weight": cut["wght"],
                "italic": cut.get("italic", False),
                "own_family_in_word": not cut["core"],
                "bytes": (OUT / filename).stat().st_size,
            })
            built += 1
            print(f"  {filename:34} {win_family} / {win_sub}  (wght {cut['wght']})")

        manifest["families"].append(entry)

    (OUT / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"\n{built} Schnitte -> {OUT}")
    if charset_issues:
        print("\nZeichensatz-Luecken:")
        for i in charset_issues:
            print("  " + i)
    else:
        print("Zeichensatz: alle geprueften Zeichen in allen Schnitten vorhanden.")

    for f in manifest["families"]:
        if not f["has_italic"]:
            print(f"HINWEIS  {f['family']} hat keinen Kursivschnitt — "
                  f"Word und PowerPoint erzeugen eine kuenstliche Schraegstellung.")


if __name__ == "__main__":
    main()
