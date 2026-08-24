// ============================================================
// RadioGroup — Auto-generated from radio-group-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/RadioGroup',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**RadioGroup** v2.0.0 (stable)

Flex-Column Container fuer mehrere .nc-radio Elemente.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/radio-docs.html -->
<!-- @punkte: 3 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-radio-group" role="radiogroup" aria-label="Lieblingsfarbe">
<label class="nc-radio">
<input type="radio" class="nc-radio__input" name="demo-group-v" value="rot" checked="">
<span class="nc-radio__control">
</span>
<span class="nc-radio__label">Rot</span>
</label>
<label class="nc-radio">
<input type="radio" class="nc-radio__input" name="demo-group-v" value="gruen">
<span class="nc-radio__control">
</span>
<span class="nc-radio__label">Grün</span>
</label>
<label class="nc-radio">
<input type="radio" class="nc-radio__input" name="demo-group-v" value="blau">
<span class="nc-radio__control">
</span>
<span class="nc-radio__label">Blau</span>
</label>
</div>`,
};
