// ============================================================
// Question — Auto-generated from question-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Question',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Question** v1.0.0 (stable)

Marquee-Lauftext: alternierend links/rechts scrollend (marquee/marquee-reverse).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/question-docs.html -->
<!-- @punkte: 20 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<section class="question" style="--px-per-sec: 80; --marquise-el-width: 2000;">
<hr>
<!-- Zeile 1 (ungerade &rarr; marquee-reverse) -->
<div class="question-text-row" style="animation: none; transform: translateX(0);" aria-hidden="true">
<span class="question-text">
 Wie können wir effizienter werden?
 <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
<circle cx="12" cy="12" r="10">
</circle>
</svg>
 Was wäre wenn alles möglich ist?
 <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
<circle cx="12" cy="12" r="10">
</circle>
</svg>
 Wie können wir effizienter werden?
 <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
<circle cx="12" cy="12" r="10">
</circle>
</svg>
 Was wäre wenn alles möglich ist?
 <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
<circle cx="12" cy="12" r="10">
</circle>
</svg>
</span>
</div>
<hr>
<!-- Zeile 2 (gerade &rarr; marquee) -->
<div class="question-text-row" style="animation: none; transform: translateX(-20%);" aria-hidden="true">
<span class="question-text">
 Welche Lösung passt zu uns?
 <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
<circle cx="12" cy="12" r="10">
</circle>
</svg>
 Wie wachsen wir nachhaltig?
 <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
<circle cx="12" cy="12" r="10">
</circle>
</svg>
 Welche Lösung passt zu uns?
 <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
<circle cx="12" cy="12" r="10">
</circle>
</svg>
 Wie wachsen wir nachhaltig?
 <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
<circle cx="12" cy="12" r="10">
</circle>
</svg>
</span>
</div>
<hr>
<!-- Action-Bereich -->
<div class="question-action-section">
<div class="question-buttons">
<button class="nc-button nc-button--primary">Demo vereinbaren</button>
<button class="nc-button nc-button--outline">Mehr erfahren</button>
</div>
</div>
<hr>
</section>`,
};
