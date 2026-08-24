// ============================================================
// Range — Auto-generated from range-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Range',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Range** v2.0.0 (stable)

Native <input type='range'> mit Cross-Browser Custom-Styling via Pseudo-Elemente.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/slider-docs.html -->
<!-- @punkte: 15 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-range">
<input class="nc-range__input" type="range" min="0" max="100" value="40" data-slider-output="output-demo2">
<span class="nc-range__output" id="output-demo2">40</span>
<div class="nc-range__labels">
<span class="nc-range__label-min">0</span>
<span class="nc-range__label-max">100</span>
</div>
</div>`,
};
