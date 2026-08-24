// ============================================================
// Metric — Auto-generated from metric-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Metric',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Metric** v2.0.0 (stable)

Container: Flex-Column mit gap. Solid: inverse BG + inverse Text. Subtle: helle BG + primaere Farben.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Website /loesungen/branchen/industrie-und-fertigung -->
<!-- @punkte: 24 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-metric nc-metric--subtle">
<span class="nc-metric__label">Lizenz</span>
<div class="nc-metric__value-row">
<span class="nc-metric__value">100%</span>
</div>
<span class="nc-metric__footer">Open Source</span>
</div>`,
};
