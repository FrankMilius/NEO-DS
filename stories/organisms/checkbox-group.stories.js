// ============================================================
// CheckboxGroup — Auto-generated from checkbox-group-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/CheckboxGroup',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**CheckboxGroup** v2.0.0 (stable)

Flex-Column Container fuer mehrere .nc-checkbox Elemente.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/checkbox-docs.html -->
<!-- @punkte: 3 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-checkbox-group" role="group" aria-labelledby="group-label-1">
<span id="group-label-1" style="font-weight: 600; margin-bottom: 4px; display: block;">Interessen</span>
<label class="nc-checkbox">
<input class="nc-checkbox__input" type="checkbox" name="interests" value="design">
<span class="nc-checkbox__control">
</span>
<span class="nc-checkbox__label">Design</span>
</label>
<label class="nc-checkbox">
<input class="nc-checkbox__input" type="checkbox" name="interests" value="development" checked="">
<span class="nc-checkbox__control">
</span>
<span class="nc-checkbox__label">Development</span>
</label>
<label class="nc-checkbox">
<input class="nc-checkbox__input" type="checkbox" name="interests" value="marketing">
<span class="nc-checkbox__control">
</span>
<span class="nc-checkbox__label">Marketing</span>
</label>
</div>`,
};
