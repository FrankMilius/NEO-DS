#!/usr/bin/env python3
"""Markenname überall klein: NEOCOSMO -> neocosmo, NEO Brand/NEO BRAND -> neo brand,
NEO Blue/Lime -> neo blue/lime, alleinstehendes NEO -> neo.
In HTML nur in Textknoten (nicht in Attributen, <style>, <script>, <svg>); Markenwörter,
die in versal gesetzten Elementen stehen würden, bekommen <span class="mk"> (text-transform:none).
Bricht ab, wenn eine Datei fehlt. Nutzung: klein.py DATEI [DATEI ...]"""
import re, sys, pathlib

RULES = [(re.compile(r'NEOCOSMO'), 'neocosmo'), (re.compile(r'NEO BRAND'), 'neo brand'), (re.compile(r'NEO Brand'), 'neo brand'),
         (re.compile(r'NEO Blue'), 'neo blue'), (re.compile(r'NEO Lime'), 'neo lime'), (re.compile(r'\bNEO\b'), 'neo')]
MARK = re.compile(r'\b(neocosmo|neo brand|neo blue|neo lime|neo)\b')

def text_only(html):
    out = []; i = 0; n = len(html); skip = None; count = 0
    tag = re.compile(r'<[^>]*>')
    while i < n:
        m = tag.search(html, i)
        if not m: seg = html[i:]; out.append(seg if skip else conv(seg)); break
        seg = html[i:m.start()]
        out.append(seg if skip else conv(seg))
        t = m.group(0); tl = t.lower()
        if skip:
            if tl.startswith('</' + skip): skip = None
        else:
            for k in ('svg', 'style', 'script'):
                if re.match(r'<' + k + r'[\s>]', tl): skip = k
        out.append(t); i = m.end()
    return ''.join(out)

def conv(seg):
    s = seg
    for re_, to in RULES: s = re_.sub(to, s)
    return s

def wrap_mk(html):
    # nur in Textknoten innerhalb von Elementen mit Versal-Klassen: einfacher Ansatz — jedes Markenwort in Textknoten, das NICHT bereits in .mk steht
    out = []; i = 0; skip = None; tag = re.compile(r'<[^>]*>'); n = len(html); depth_mk = 0
    while i < n:
        m = tag.search(html, i)
        seg = html[i:] if not m else html[i:m.start()]
        if not skip and depth_mk == 0:
            seg = MARK.sub(lambda mm: f'<span class="mk">{mm.group(1)}</span>', seg)
        out.append(seg)
        if not m: break
        t = m.group(0); tl = t.lower()
        if skip:
            if tl.startswith('</' + skip): skip = None
        else:
            for k in ('svg', 'style', 'script', 'code', 'pre', 'title'):
                if re.match(r'<' + k + r'[\s>]', tl): skip = k
        if 'class="mk"' in t: depth_mk += 1
        elif tl == '</span>' and depth_mk: depth_mk -= 1
        out.append(t); i = m.end()
    return ''.join(out)

for arg in sys.argv[1:]:
    p = pathlib.Path(arg); s = p.read_text(encoding='utf-8'); before = s
    if p.suffix == '.html':
        s = text_only(s)
        # <title> separat (Textknoten, aber ohne span)
        s = re.sub(r'<title>([^<]*)</title>', lambda m: '<title>' + conv(m.group(1)) + '</title>', s)
        if 'mk{text-transform:none' not in s and '<style>' in s:
            s = s.replace('<style>', '<style>\n  .mk{text-transform:none}', 1)
        s = wrap_mk(s)
    else:
        s = conv(s)
    rest = len(re.findall(r'NEOCOSMO|\bNEO\b', s))
    p.write_text(s, encoding='utf-8')
    print(f'{p.name}: {len(before)} -> {len(s)} Zeichen, Rest versal: {rest}')
