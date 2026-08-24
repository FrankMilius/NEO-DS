// ============================================================
// TextMedia — Auto-generated from text-media-recipe.json
// Version: 1.1.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/TextMedia',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**TextMedia** v1.1.0 (stable)

Grid: 2 Spalten, media + content. Responsive: stacked auf mobile.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Website /events -->
<!-- @punkte: 27 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-text-media nc-text-media--media-left">
<div class="nc-text-media__grid">
<div class="nc-text-media__media">
<img src="https://piipe-workplace.ddev.site/sites/default/files/callouts/festo-wenet-screenshot.png" alt="Verpasst? Jetzt als Aufzeichnung ansehen" class="nc-text-media__image nc-media-frame" loading="lazy">
</div>
<div class="nc-text-media__content">
<div class="nc-section-header nc-section-header--flush">
<h2 class="nc-section-header__title">Verpasst? Jetzt als Aufzeichnung ansehen</h2>
<p class="nc-section-header__subtitle">Unser letztes Webinar "Intranet-Relaunch: Erfahrungsbericht Festo" mit Alexandra Goeke ist jetzt als Aufzeichnung verfügbar. Erfahren Sie, wie Festo 20.000 Mitarbeitende weltweit erfolgreich auf PIIPE Workplace migriert hat.</p>
</div>
<div class="nc-text-media__cta">
<a href="/node/24" class="nc-button nc-button--accent nc-button--lg">
<span>Aufzeichnung ansehen</span>
</a>
</div>
</div>
</div>
</div>`,
};
