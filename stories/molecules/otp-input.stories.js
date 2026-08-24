// ============================================================
// OtpInput — Auto-generated from otp-input-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/OtpInput',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**OtpInput** v1.0.0 (stable)

Inline-Flex Container mit einzelnen Input-Zellen (maxlength=1).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/otp-input-docs.html -->
<!-- @punkte: 12 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-otp-input" role="group" aria-label="Code teilweise ausgefüllt">
<input class="nc-otp-input__cell nc-otp-input__cell--filled" type="text" maxlength="1" inputmode="numeric" aria-label="Stelle 1" value="7" pattern="[0-9]*">
<input class="nc-otp-input__cell nc-otp-input__cell--filled" type="text" maxlength="1" inputmode="numeric" aria-label="Stelle 2" value="3" pattern="[0-9]*">
<input class="nc-otp-input__cell" type="text" maxlength="1" inputmode="numeric" aria-label="Stelle 3" pattern="[0-9]*">
<input class="nc-otp-input__cell" type="text" maxlength="1" inputmode="numeric" aria-label="Stelle 4" pattern="[0-9]*">
</div>`,
};
