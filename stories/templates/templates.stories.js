// ============================================================
// Templates — Page Layout Showcase
// Shell-Presets (data-layout) als Wireframe-Vorschau. Die .t-* Seitenvorlagen
// sind stillgelegt: content-page/form-page am 07.10.2026, dashboard,
// settings-page, error-page, home-hero und home-basic am 08.10.2026.
// ============================================================

const TEMPLATES = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    class: 'nc-shell — body[data-layout="dashboard"]',
    desc: 'App-Layout mit Sidebar, Metric-Cards und Content-Bereich (ersetzt .t-dashboard).',
    layout: `
      <div style="display:grid;grid-template-columns:80px 1fr;grid-template-rows:40px 1fr;height:300px;border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-md);overflow:hidden">
        <div style="grid-column:1/-1;background:var(--fnd-color-layer-01);border-bottom:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;padding:0 12px;font-size:var(--fs-2xs);color:var(--fnd-color-text-secondary)">Header</div>
        <div style="background:var(--fnd-color-layer-02);border-right:1px solid var(--fnd-color-border-secondary);padding:8px;font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary)">Sidebar</div>
        <div style="padding:12px;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:60px 1fr;gap:8px">
          <div style="background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;justify-content:center;font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary)">Metric</div>
          <div style="background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;justify-content:center;font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary)">Metric</div>
          <div style="background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;justify-content:center;font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary)">Metric</div>
          <div style="grid-column:1/-1;background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;justify-content:center;font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary)">Content Area</div>
        </div>
      </div>`,
  },
  {
    id: 'landing',
    name: 'Landing',
    class: 'nc-shell — body[data-layout="landing"]',
    desc: 'Landing Page mit Hero-Bereich und Content-Sektionen (ersetzt .home-hero und .home-basic).',
    layout: `
      <div style="display:flex;flex-direction:column;height:300px;border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-md);overflow:hidden">
        <div style="height:40px;background:var(--fnd-color-layer-01);border-bottom:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;padding:0 12px;font-size:var(--fs-2xs);color:var(--fnd-color-text-secondary)">Navigation</div>
        <div style="height:120px;background:color-mix(in srgb, var(--fnd-color-interactive-default) 10%, transparent);display:flex;align-items:center;justify-content:center;font-size:var(--fs-sm);color:var(--fnd-color-interactive-default);font-weight:var(--fnd-font-weight-semibold)">Hero Section</div>
        <div style="flex:1;padding:12px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
          <div style="background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary)"></div>
          <div style="background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary)"></div>
          <div style="background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary)"></div>
        </div>
      </div>`,
  },
  {
    id: 'settings',
    name: 'Settings',
    class: 'nc-shell — body[data-layout="settings"]',
    desc: 'Einstellungsseite mit Navigation und Form-Sektionen (ersetzt .t-settings).',
    layout: `
      <div style="display:flex;flex-direction:column;height:300px;border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-md);overflow:hidden">
        <div style="height:40px;background:var(--fnd-color-layer-01);border-bottom:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;padding:0 12px;font-size:var(--fs-2xs);color:var(--fnd-color-text-secondary)">Header</div>
        <div style="display:flex;flex:1">
          <div style="width:120px;background:var(--fnd-color-layer-01);border-right:1px solid var(--fnd-color-border-secondary);padding:8px;display:flex;flex-direction:column;gap:4px">
            <div style="height:24px;background:var(--fnd-color-interactive-default);border-radius:var(--fnd-radius-sm);opacity:0.15"></div>
            <div style="height:24px;border-radius:var(--fnd-radius-sm)"></div>
            <div style="height:24px;border-radius:var(--fnd-radius-sm)"></div>
          </div>
          <div style="flex:1;padding:12px;display:flex;flex-direction:column;gap:8px">
            <div style="height:16px;width:40%;background:var(--fnd-color-text-primary);border-radius:2px;opacity:0.15"></div>
            <div style="height:28px;background:var(--fnd-color-background-base);border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-sm)"></div>
            <div style="height:28px;background:var(--fnd-color-background-base);border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-sm)"></div>
          </div>
        </div>
      </div>`,
  },
  {
    id: 'focused',
    name: 'Focused',
    class: 'nc-shell — body[data-layout="focused"]',
    desc: 'Zentrierter, schmaler Inhalt — z. B. Fehlerseite (404, 500) oder Formular (ersetzt .t-error und .t-form-page).',
    layout: `
      <div style="display:flex;flex-direction:column;height:300px;border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-md);overflow:hidden">
        <div style="height:40px;background:var(--fnd-color-layer-01);border-bottom:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;padding:0 12px;font-size:var(--fs-2xs);color:var(--fnd-color-text-secondary)">Header</div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px">
          <div style="font-size:var(--fs-4xl);font-weight:var(--fnd-font-weight-bold);color:var(--fnd-color-text-tertiary)">404</div>
          <div style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary)">Seite nicht gefunden</div>
          <div style="height:32px;width:120px;background:var(--fnd-color-interactive-default);border-radius:var(--fnd-radius-sm);margin-top:8px"></div>
        </div>
      </div>`,
  },
  {
    id: 'shell',
    name: 'Shell (data-layout)',
    class: 'nc-shell',
    desc: 'Neues Shell-System mit data-layout Presets. Ersetzt die .t-* Klassen.',
    layout: `
      <div style="display:grid;grid-template-rows:40px 1fr 32px;height:300px;border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-md);overflow:hidden">
        <div style="background:var(--fnd-color-layer-01);border-bottom:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;padding:0 12px;font-size:var(--fs-2xs);color:var(--fnd-color-text-secondary)">nc-shell__header</div>
        <div style="display:flex">
          <div style="flex:1;padding:12px;display:flex;align-items:center;justify-content:center;font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary)">nc-shell__main</div>
        </div>
        <div style="background:var(--fnd-color-layer-01);border-top:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;padding:0 12px;font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary)">nc-shell__footer</div>
      </div>`,
  },
];

export default {
  title: 'Templates/Page Layouts',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Page Templates** — Seiten-Layouts als Presets des Shell-Systems (\`data-layout\`).
Artikelseiten laufen ueber \`data-layout="content-page"\`.
Templates definieren die Grundstruktur einer Seite (Grid, Bereiche, Proportionen).
Die frueheren \`.t-*\` Seitenvorlagen sind stillgelegt (07./08.10.2026).`,
      },
    },
  },
};

// Helper: Story fuer einzelnes Template
function makeStory(tmpl) {
  return {
    name: tmpl.name,
    render: () => `<div style="padding:24px;max-width:500px">
      <h3 style="margin-bottom:8px;font-size:var(--fs-base)">${tmpl.name}</h3>
      <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);margin-bottom:16px">${tmpl.desc}</p>
      <code style="font-size:var(--fs-2xs);color:var(--fnd-color-interactive-default);display:block;margin-bottom:12px">.${tmpl.class}</code>
      ${tmpl.layout}
    </div>`,
  };
}

export const Dashboard = makeStory(TEMPLATES[0]);
export const Landing = makeStory(TEMPLATES[1]);
export const Settings = makeStory(TEMPLATES[2]);
export const Focused = makeStory(TEMPLATES[3]);
export const Shell = makeStory(TEMPLATES[4]);

export const AllTemplates = {
  name: 'All Templates Overview',
  render: () => `<div style="padding:24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:24px">
    ${TEMPLATES.map(t => `
      <div>
        <h3 style="margin-bottom:4px;font-size:var(--fs-sm)">${t.name}</h3>
        <p style="font-size:var(--fs-xs);color:var(--fnd-color-text-secondary);margin-bottom:8px">${t.desc}</p>
        <code style="font-size:var(--fs-2xs);color:var(--fnd-color-interactive-default);display:block;margin-bottom:8px">.${t.class}</code>
        ${t.layout}
      </div>
    `).join('')}
  </div>`,
  parameters: { docs: { description: { story: 'Uebersicht der Shell-Presets als Wireframe.' } } },
};
