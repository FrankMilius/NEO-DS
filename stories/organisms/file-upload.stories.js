// ============================================================
// FileUpload — Auto-generated from file-upload-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/FileUpload',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FileUpload** v1.0.0 (stable)

Dropzone: flex-column zentriert, gestrichelte Border (dashed), Hover wechselt Border + BG.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-file-upload">
    <span class="nc-file-upload__text">file-upload</span>
    <span class="nc-file-upload__input">input</span>
  </div>`,
};

export const AllStates = {
  name: 'All States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-file-upload">
    <span class="nc-file-upload__text">file-upload</span>
    <span class="nc-file-upload__input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dropzone in allen Zustaenden: default, hover, focus, dragging, disabled' },
    },
  },
};

export const VariantComparison = {
  name: 'Variant Comparison',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default Dropzone vs Compact Variante' },
    },
  },
};

export const WithFileList = {
  name: 'With File List',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-file-upload">
    <span class="nc-file-upload__text">file-upload</span>
    <span class="nc-file-upload__input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dropzone mit angehaengter Dateiliste (hochgeladene Dateien)' },
    },
  },
};

export const WithUploadProgress = {
  name: 'With Upload Progress',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-file-upload">
    <span class="nc-file-upload__text">file-upload</span>
    <span class="nc-file-upload__input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dateiliste mit Upload-Fortschrittsbalken' },
    },
  },
};

export const ErrorStates = {
  name: 'Error States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-file-upload">
    <span class="nc-file-upload__text">file-upload</span>
    <span class="nc-file-upload__input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dropzone-Error und einzelne Datei-Error im Vergleich' },
    },
  },
};

export const CompactwithList = {
  name: 'Compact with List',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-file-upload">
    <span class="nc-file-upload__text">file-upload</span>
    <span class="nc-file-upload__input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Kompakte Variante mit Dateiliste — platzsparend fuer Formulare' },
    },
  },
};
