# Hausschriften als base64

GENERIERT. Subgesetzt auf Latin + deutsche Umlaute + typografische Zeichen,
Variable-Achse (Gewicht) bleibt erhalten.

Artefakte duerfen keine externen Requests stellen — Schriften muessen als
`data:`-URI eingebettet werden. Einsatz im Artefakt:

```css
@font-face {
  font-family: 'Manrope';
  font-weight: 200 800;
  font-display: swap;
  src: url(data:font/woff2;base64,<INHALT VON manrope.base64.txt>) format('woff2');
}
```

NUR einbetten, was das Artefakt wirklich braucht: jede Familie kostet rund
20 KB base64 im Dokument. Fuer Layout-, Farb- und Abstandsvergleiche genuegen
die Systemschriften aus dem Fallback-Stack.

- Manrope 200 800: 24.3 KB → base64 20 KB
- Space Grotesk 300 700: 21.8 KB → base64 17 KB
- JetBrains Mono 100 800: 39.5 KB → base64 41 KB
