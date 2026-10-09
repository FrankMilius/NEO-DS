/**
 * Lange Woerter in Zwischenueberschriften der Prosa (Restpunkte 09.10.2026,
 * prosa-umbruch)
 *
 * Befund: „Zwischenüberschrift" (h2) lief bei 320 px 69 px ueber den Rand,
 * „Informationssicherheitsmanagementsystem" auch bei 1280 px 173 px.
 * overflow-wrap: break-word an allen Breiten (greift nur bei Ueberlauf),
 * hyphens: auto nur unter Tablet (ab Tablet keine neue Silbentrennung).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from 'path';
import * as sass from 'sass';

const ROOT = resolve(import.meta.dirname, '../..');
let css = '';

beforeAll(() => {
  css = sass.compile(resolve(ROOT, 'scss/scss/main.scss'), { style: 'compressed' }).css;
}, 60000);

const SEL = '.nc-prose :is(h1,h2,h3,h4,h5,h6),.u-prose :is(h1,h2,h3,h4,h5,h6)';

describe('Prosa: Ueberschriften brechen lange Woerter um', () => {
  it('overflow-wrap: break-word an allen Breiten (nicht anywhere — min-content bleibt)', () => {
    expect(css).toContain(`}${SEL}{overflow-wrap:break-word}`);
  });

  it('Silbentrennung nur unter Tablet, nur lange Woerter', () => {
    expect(css).toContain(`@media(max-width: 767px){${SEL}{hyphens:auto;hyphenate-limit-chars:12 5 5}}`);
    // keine Silbentrennung ausserhalb der Media-Query fuer diese Selektoren
    expect(css).not.toContain(`}${SEL}{overflow-wrap:break-word;hyphens`);
  });
});
