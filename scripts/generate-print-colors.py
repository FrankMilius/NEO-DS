#!/usr/bin/env python3
"""
Erzeugt die Print-Farbtabelle aus data/design-tokens.json.

Fuer jede Farbe der Token-Datei wird ueber ICC-Profile die CMYK-Umsetzung
gerechnet, zurueckgerechnet und die Abweichung als dE00 gemessen. Damit ist
belegt statt behauptet, welche Farben im Vierfarbdruck erreichbar sind.

Rendering Intent: relativ farbmetrisch mit Tiefenkompensierung — das ist,
was ein Reinzeichner bei einer Markenfarbe einstellt. Perzeptiv wuerde auch
die Farben veraendern, die im Gamut liegen.

Ausgabe:  data/print/farbtabelle.json
          data/print/farbtabelle.csv

Abhaengigkeiten: Pillow (ImageCms / littleCMS). Keine Netzwerkzugriffe.
"""

import csv
import json
import os
import sys
from pathlib import Path

from PIL import Image, ImageCms

ROOT = Path(__file__).resolve().parent.parent
TOKENS = ROOT / "data" / "design-tokens.json"
OUTDIR = ROOT / "data" / "print"

# ---------------------------------------------------------------------------
# ICC-Profile
# ---------------------------------------------------------------------------
# ISO Coated v2 (ECI) = FOGRA39L, gestrichenes Papier, Farbauftrag bis 330 %.
# Trotz der neueren v3-Profile (FOGRA51/52) ist das im deutschen Offsetdruck
# weiterhin der am haeufigsten angeforderte Standard.
ADOBE = Path("/Library/Application Support/Adobe/Color/Profiles")

PROFILES = {
    "coated": {
        "label": "ISO Coated v2 (ECI) · FOGRA39",
        "paper": "gestrichen (Bilderdruck, Kunstdruck)",
        "path": ADOBE / "Recommended" / "ISOcoated_v2_eci.icc",
        "tac_limit": 330,
    },
    "uncoated": {
        "label": "Uncoated FOGRA29",
        "paper": "ungestrichen (Naturpapier, Briefbogen)",
        "path": ADOBE / "Recommended" / "UncoatedFOGRA29.icc",
        "tac_limit": 300,
    },
}

SRGB_PATH = Path("/System/Library/ColorSync/Profiles/sRGB Profile.icc")

# dE00-Schwellen. 1,0 gilt als gerade eben wahrnehmbar, 2,0 als Toleranz fuer
# Sonderfarben im Proof, ab etwa 5,0 spricht man von einer anderen Farbe.
DE_OK = 2.0
DE_WARN = 5.0


# ---------------------------------------------------------------------------
# Farbmathematik
# ---------------------------------------------------------------------------

def hex_to_rgb(value):
    v = value.strip().lstrip("#")
    if len(v) == 3:
        v = "".join(c * 2 for c in v)
    if len(v) != 6:
        return None
    try:
        return tuple(int(v[i:i + 2], 16) for i in (0, 2, 4))
    except ValueError:
        return None


def rgb_to_hex(rgb):
    return "#{:02x}{:02x}{:02x}".format(*(max(0, min(255, int(round(c)))) for c in rgb))


def _srgb_to_linear(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def relative_luminance(rgb):
    r, g, b = (_srgb_to_linear(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast_ratio(rgb_a, rgb_b):
    la, lb = relative_luminance(rgb_a), relative_luminance(rgb_b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def srgb_to_oklch(rgb):
    """sRGB (0-255) -> OKLCH. Formeln nach Bjoern Ottosson."""
    r, g, b = (_srgb_to_linear(c) for c in rgb)
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l_, m_, s_ = (v ** (1 / 3) if v >= 0 else -((-v) ** (1 / 3)) for v in (l, m, s))
    L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
    a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
    bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    import math
    C = math.hypot(a, bb)
    H = math.degrees(math.atan2(bb, a)) % 360.0
    return L, C, H


def delta_e_2000(lab1, lab2):
    """CIEDE2000. Standardimplementierung nach Sharma et al."""
    import math
    L1, a1, b1 = lab1
    L2, a2, b2 = lab2
    kL = kC = kH = 1.0

    C1 = math.hypot(a1, b1)
    C2 = math.hypot(a2, b2)
    Cbar = (C1 + C2) / 2.0
    G = 0.5 * (1 - math.sqrt(Cbar ** 7 / (Cbar ** 7 + 25.0 ** 7))) if Cbar > 0 else 0.0

    a1p, a2p = (1 + G) * a1, (1 + G) * a2
    C1p, C2p = math.hypot(a1p, b1), math.hypot(a2p, b2)
    h1p = math.degrees(math.atan2(b1, a1p)) % 360.0 if (a1p or b1) else 0.0
    h2p = math.degrees(math.atan2(b2, a2p)) % 360.0 if (a2p or b2) else 0.0

    dLp = L2 - L1
    dCp = C2p - C1p
    if C1p * C2p == 0:
        dhp = 0.0
    elif abs(h2p - h1p) <= 180:
        dhp = h2p - h1p
    elif h2p - h1p > 180:
        dhp = h2p - h1p - 360
    else:
        dhp = h2p - h1p + 360
    dHp = 2 * math.sqrt(C1p * C2p) * math.sin(math.radians(dhp) / 2)

    Lbarp = (L1 + L2) / 2.0
    Cbarp = (C1p + C2p) / 2.0
    if C1p * C2p == 0:
        hbarp = h1p + h2p
    elif abs(h1p - h2p) <= 180:
        hbarp = (h1p + h2p) / 2.0
    elif h1p + h2p < 360:
        hbarp = (h1p + h2p + 360) / 2.0
    else:
        hbarp = (h1p + h2p - 360) / 2.0

    T = (1 - 0.17 * math.cos(math.radians(hbarp - 30))
         + 0.24 * math.cos(math.radians(2 * hbarp))
         + 0.32 * math.cos(math.radians(3 * hbarp + 6))
         - 0.20 * math.cos(math.radians(4 * hbarp - 63)))
    dtheta = 30 * math.exp(-(((hbarp - 275) / 25) ** 2))
    Rc = 2 * math.sqrt(Cbarp ** 7 / (Cbarp ** 7 + 25.0 ** 7)) if Cbarp > 0 else 0.0
    Sl = 1 + (0.015 * (Lbarp - 50) ** 2) / math.sqrt(20 + (Lbarp - 50) ** 2)
    Sc = 1 + 0.045 * Cbarp
    Sh = 1 + 0.015 * Cbarp * T
    Rt = -math.sin(math.radians(2 * dtheta)) * Rc

    return math.sqrt(
        (dLp / (kL * Sl)) ** 2
        + (dCp / (kC * Sc)) ** 2
        + (dHp / (kH * Sh)) ** 2
        + Rt * (dCp / (kC * Sc)) * (dHp / (kH * Sh))
    )


# ---------------------------------------------------------------------------
# ICC-Transformationen
# ---------------------------------------------------------------------------

class Converter:
    def __init__(self):
        if not SRGB_PATH.exists():
            sys.exit(f"sRGB-Profil nicht gefunden: {SRGB_PATH}")
        self.srgb = ImageCms.getOpenProfile(str(SRGB_PATH))
        self.lab = ImageCms.createProfile("LAB")

        flags = ImageCms.Flags.BLACKPOINTCOMPENSATION
        intent = ImageCms.Intent.RELATIVE_COLORIMETRIC

        self.to_lab = ImageCms.buildTransform(
            self.srgb, self.lab, "RGB", "LAB",
            renderingIntent=intent, flags=flags,
        )

        self.presses = {}
        for key, meta in PROFILES.items():
            if not meta["path"].exists():
                sys.exit(f"ICC-Profil fehlt: {meta['path']}\n"
                         f"Adobe-Farbprofile installieren oder Pfad in PROFILES anpassen.")
            prof = ImageCms.getOpenProfile(str(meta["path"]))
            self.presses[key] = {
                "meta": meta,
                "rgb2cmyk": ImageCms.buildTransform(
                    self.srgb, prof, "RGB", "CMYK",
                    renderingIntent=intent, flags=flags),
                "cmyk2rgb": ImageCms.buildTransform(
                    prof, self.srgb, "CMYK", "RGB",
                    renderingIntent=intent, flags=flags),
                "cmyk2lab": ImageCms.buildTransform(
                    prof, self.lab, "CMYK", "LAB",
                    renderingIntent=intent, flags=flags),
            }

    @staticmethod
    def _px(mode, values):
        return Image.new(mode, (1, 1), tuple(int(v) for v in values))

    def lab_of_rgb(self, rgb):
        out = ImageCms.applyTransform(self._px("RGB", rgb), self.to_lab)
        L, a, b = out.getpixel((0, 0))
        # littleCMS liefert Lab 8-bit-kodiert: L 0..100 skaliert, a/b mit Offset 128
        return (L * 100.0 / 255.0, a - 128.0, b - 128.0)

    def lab_of_cmyk(self, key, cmyk):
        t = self.presses[key]["cmyk2lab"]
        out = ImageCms.applyTransform(self._px("CMYK", cmyk), t)
        L, a, b = out.getpixel((0, 0))
        return (L * 100.0 / 255.0, a - 128.0, b - 128.0)

    def convert(self, key, rgb):
        p = self.presses[key]
        cmyk_px = ImageCms.applyTransform(self._px("RGB", rgb), p["rgb2cmyk"])
        c, m, y, k = cmyk_px.getpixel((0, 0))
        back = ImageCms.applyTransform(self._px("CMYK", (c, m, y, k)), p["cmyk2rgb"])
        rgb_back = back.getpixel((0, 0))

        pct = tuple(round(v * 100.0 / 255.0) for v in (c, m, y, k))
        return {
            "cmyk": list(pct),
            "cmyk_string": "C{} M{} Y{} K{}".format(*pct),
            "tac": sum(pct),
            "rgb_back": list(rgb_back),
            "hex_back": rgb_to_hex(rgb_back),
        }


# ---------------------------------------------------------------------------
# Token-Ernte
# ---------------------------------------------------------------------------

GROUP_LABELS = {
    "brand": "Marke",
    "neutralleitern": "Neutralleitern",
    "system": "Systemfarben",
    "supporting": "Reservefarben",
    "foundation": "Foundation",
}

# Diese Gruppen kommen in die Print-Tabelle. Die Alpha-Stufen von
# foundation.black/white sind Transparenzen und im Druck bedeutungslos.
INCLUDE = ["brand", "neutralleitern", "system", "supporting"]


def harvest(tokens):
    rows = []
    prim = tokens["primitives"]
    for group in INCLUDE:
        if group not in prim:
            continue
        for family, data in prim[group].items():
            label = data.get("label", family)
            base = data.get("base")
            shades = data.get("shades", {})
            if base and hex_to_rgb(base):
                rows.append({
                    "group": group, "group_label": GROUP_LABELS.get(group, group),
                    "family": family, "family_label": label,
                    "shade": "base", "hex": base.lower(),
                })
            for shade, val in shades.items():
                if not isinstance(val, str) or not hex_to_rgb(val):
                    continue  # rgba()-Stufen ueberspringen
                rows.append({
                    "group": group, "group_label": GROUP_LABELS.get(group, group),
                    "family": family, "family_label": label,
                    "shade": shade, "hex": val.lower(),
                })

    # Papier- und Vollton-Referenz ergaenzen
    for shade, hexv, fam in (("100", "#ffffff", "white"), ("100", "#000000", "black")):
        rows.append({
            "group": "foundation", "group_label": "Foundation",
            "family": fam, "family_label": f"Foundation {fam.title()}",
            "shade": shade, "hex": hexv,
        })
    return rows


def rate(de):
    if de <= DE_OK:
        return "sicher"
    if de <= DE_WARN:
        return "abweichend"
    return "kritisch"


def main():
    if not TOKENS.exists():
        sys.exit(f"Token-Datei nicht gefunden: {TOKENS}")
    tokens = json.loads(TOKENS.read_text(encoding="utf-8"))
    conv = Converter()
    rows = harvest(tokens)

    white = (255, 255, 255)
    black = (0, 0, 0)
    out = []
    seen = set()

    for row in rows:
        rgb = hex_to_rgb(row["hex"])
        key = (row["group"], row["family"], row["shade"])
        if key in seen:
            continue
        seen.add(key)

        lab_src = conv.lab_of_rgb(rgb)
        L, C, H = srgb_to_oklch(rgb)

        entry = dict(row)
        entry["rgb"] = list(rgb)
        entry["oklch"] = {"l": round(L, 4), "c": round(C, 4), "h": round(H, 1)}
        entry["oklch_css"] = f"oklch({L * 100:.1f}% {C:.3f} {H:.1f})"
        entry["lab"] = [round(v, 2) for v in lab_src]
        entry["contrast_on_white"] = round(contrast_ratio(rgb, white), 2)
        entry["contrast_on_black"] = round(contrast_ratio(rgb, black), 2)
        entry["press"] = {}

        for pkey in PROFILES:
            res = conv.convert(pkey, rgb)
            lab_dst = conv.lab_of_cmyk(pkey, [round(v * 255 / 100) for v in res["cmyk"]])
            de = delta_e_2000(lab_src, lab_dst)
            res["delta_e"] = round(de, 2)
            res["rating"] = rate(de)
            res["tac_over_limit"] = res["tac"] > PROFILES[pkey]["tac_limit"]
            res["contrast_on_paper"] = round(
                contrast_ratio(tuple(res["rgb_back"]), white), 2)
            entry["press"][pkey] = res

        out.append(entry)

    OUTDIR.mkdir(parents=True, exist_ok=True)

    payload = {
        "generated_from": "data/design-tokens.json",
        "token_version": tokens.get("$meta", {}).get("version"),
        "rendering_intent": "relativ farbmetrisch, mit Tiefenkompensierung",
        "profiles": {k: {"label": v["label"], "paper": v["paper"],
                         "icc": v["path"].name, "tac_limit": v["tac_limit"]}
                     for k, v in PROFILES.items()},
        "thresholds": {"sicher": f"dE00 <= {DE_OK}",
                       "abweichend": f"dE00 <= {DE_WARN}",
                       "kritisch": f"dE00 > {DE_WARN}"},
        "count": len(out),
        "colors": out,
    }
    (OUTDIR / "farbtabelle.json").write_text(
        json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    with (OUTDIR / "farbtabelle.csv").open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, delimiter=";")
        w.writerow([
            "Gruppe", "Familie", "Stufe", "HEX", "RGB", "OKLCH", "Lab (D50)",
            "CMYK gestrichen", "Farbauftrag %", "dE00 gestrichen", "Bewertung gestrichen",
            "erreichbar HEX gestrichen",
            "CMYK ungestrichen", "dE00 ungestrichen", "Bewertung ungestrichen",
            "erreichbar HEX ungestrichen",
            "Kontrast auf Weiss",
        ])
        for e in out:
            c = e["press"]["coated"]
            u = e["press"]["uncoated"]
            w.writerow([
                e["group_label"], e["family_label"], e["shade"], e["hex"],
                "{} {} {}".format(*e["rgb"]), e["oklch_css"],
                "{} {} {}".format(*e["lab"]),
                c["cmyk_string"], c["tac"], c["delta_e"], c["rating"], c["hex_back"],
                u["cmyk_string"], u["delta_e"], u["rating"], u["hex_back"],
                e["contrast_on_white"],
            ])

    crit = [e for e in out if e["press"]["coated"]["rating"] == "kritisch"]
    warn = [e for e in out if e["press"]["coated"]["rating"] == "abweichend"]
    print(f"{len(out)} Farben verarbeitet -> {OUTDIR}")
    print(f"  sicher      {len(out) - len(crit) - len(warn)}")
    print(f"  abweichend  {len(warn)}")
    print(f"  kritisch    {len(crit)}")
    for e in sorted(crit, key=lambda x: -x["press"]["coated"]["delta_e"])[:12]:
        c = e["press"]["coated"]
        print(f"    dE {c['delta_e']:5.1f}  {e['family_label']} {e['shade']:>4}  "
              f"{e['hex']} -> {c['hex_back']}  {c['cmyk_string']}")


if __name__ == "__main__":
    main()
