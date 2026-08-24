const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const iconsDir = path.resolve(__dirname, '../assets/icons');
const outputPath = path.resolve(__dirname, '../data/icons-manifest.json');
const tablerTagsPath = path.resolve(__dirname, '../data/tabler-tags.json');

// ---------------------------------------------------------------------------
// Tabler-Tags laden (falls vorhanden)
// ---------------------------------------------------------------------------

let tablerTags = {};
if (fs.existsSync(tablerTagsPath)) {
  try {
    tablerTags = JSON.parse(fs.readFileSync(tablerTagsPath, 'utf8'));
  } catch (e) {
    console.warn('  ⚠ tabler-tags.json konnte nicht gelesen werden:', e.message);
  }
}

// ---------------------------------------------------------------------------
// Scan icons directory
// ---------------------------------------------------------------------------

function scanIcons() {
  const categories = [];
  const icons = [];

  if (!fs.existsSync(iconsDir)) {
    console.error('  ✗ Icons directory not found:', iconsDir);
    process.exit(1);
  }

  const dirs = fs.readdirSync(iconsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  dirs.forEach(category => {
    categories.push(category);
    const categoryDir = path.join(iconsDir, category);
    const files = fs.readdirSync(categoryDir)
      .filter(f => /\.(svg|png)$/i.test(f))
      .sort();

    files.forEach(file => {
      const ext = path.extname(file).toLowerCase();
      const name = path.basename(file, ext);
      const type = ext === '.svg' ? 'svg' : 'png';
      const filePath = path.join(categoryDir, file);
      const isTabler = !!tablerTags[name];

      // Generate keywords from name + category
      const keywords = [
        ...name.split(/[-_]+/),
        category,
        ...category.split(/[-_]+/)
      ];

      // Offizielle Tabler-Tags hinzufuegen (falls vorhanden)
      if (isTabler) {
        const officialTags = tablerTags[name].tags || [];
        officialTags.forEach(tag => keywords.push(tag));
      }

      // Deduplizieren
      const uniqueKeywords = keywords.filter((v, i, a) => a.indexOf(v) === i);

      const entry = {
        name: name,
        category: category,
        file: file,
        path: category + '/' + file,
        type: type,
        keywords: uniqueKeywords
      };

      // Tabler-Quelle markieren
      if (isTabler) {
        entry.source = 'tabler';
      }

      // For SVGs: inline the content with currentColor normalization
      if (type === 'svg') {
        let svgContent = fs.readFileSync(filePath, 'utf8');
        // Normalize strokes: #000000, #000, black → currentColor
        svgContent = svgContent.replace(/stroke="#000000"/g, 'stroke="currentColor"');
        svgContent = svgContent.replace(/stroke="#000"/g, 'stroke="currentColor"');
        svgContent = svgContent.replace(/stroke="#111111"/g, 'stroke="currentColor"');
        // Normalize fills that are black (but not fill="none")
        svgContent = svgContent.replace(/fill="#000000"/g, 'fill="currentColor"');
        svgContent = svgContent.replace(/fill="#000"/g, 'fill="currentColor"');
        // Remove XML declarations
        svgContent = svgContent.replace(/<\?xml[^?]*\?>\s*/g, '');
        // Trim whitespace
        svgContent = svgContent.trim();
        entry.svg = svgContent;
      }

      icons.push(entry);
    });
  });

  return { categories, icons };
}

// ---------------------------------------------------------------------------
// Generate manifest
// ---------------------------------------------------------------------------

console.log('Generating icons manifest...\n');

const { categories, icons } = scanIcons();

const tablerCount = icons.filter(i => i.source === 'tabler').length;
const customCount = icons.length - tablerCount;

const manifest = {
  meta: {
    generated: new Date().toISOString().split('T')[0],
    total: icons.length,
    categories_count: categories.length,
    tabler_count: tablerCount,
    custom_count: customCount
  },
  categories: categories,
  icons: icons
};

fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log('  ✓ icons-manifest.json (' + icons.length + ' icons in ' + categories.length + ' categories)');
console.log('    Tabler: ' + tablerCount + ' | Custom: ' + customCount);
console.log('');

// Category breakdown (pad for wider names)
categories.forEach(cat => {
  const count = icons.filter(i => i.category === cat).length;
  console.log('    ' + cat.padEnd(30) + count);
});

console.log('');

// ---------------------------------------------------------------------------
// Generate per-library manifests for additional icon libraries
// ---------------------------------------------------------------------------
// Convention: assets/icons-{libraryId}/ → data/icons-manifest-{libraryId}.json
// Each additional library gets its own manifest file.

const assetsDir = path.resolve(__dirname, '../assets');
const dataDir = path.resolve(__dirname, '../data');

const libraryDirs = fs.readdirSync(assetsDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name.startsWith('icons-') && d.name !== 'icons')
  .map(d => d.name);

libraryDirs.forEach(dirName => {
  const libraryId = dirName.replace(/^icons-/, '');
  const libDir = path.join(assetsDir, dirName);
  const libOutputPath = path.join(dataDir, 'icons-manifest-' + libraryId + '.json');

  console.log('Generating manifest for library: ' + libraryId + '...');

  const libCategories = [];
  const libIcons = [];

  const subDirs = fs.readdirSync(libDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  subDirs.forEach(category => {
    libCategories.push(category);
    const categoryDir = path.join(libDir, category);
    const files = fs.readdirSync(categoryDir)
      .filter(f => /\.svg$/i.test(f))
      .sort();

    files.forEach(file => {
      const name = path.basename(file, '.svg');
      const filePath = path.join(categoryDir, file);

      const keywords = [
        ...name.split(/[-_]+/),
        category,
        ...category.split(/[-_]+/)
      ].filter((v, i, a) => a.indexOf(v) === i);

      let svgContent = fs.readFileSync(filePath, 'utf8');
      svgContent = svgContent.replace(/<\?xml[^?]*\?>\s*/g, '');
      svgContent = svgContent.replace(/stroke="#000000"/g, 'stroke="currentColor"');
      svgContent = svgContent.replace(/stroke="#000"/g, 'stroke="currentColor"');
      svgContent = svgContent.trim();

      libIcons.push({
        name: name,
        category: category,
        file: file,
        path: category + '/' + file,
        type: 'svg',
        source: libraryId,
        keywords: keywords,
        svg: svgContent
      });
    });
  });

  const libManifest = {
    meta: {
      generated: new Date().toISOString().split('T')[0],
      library: libraryId,
      total: libIcons.length,
      categories_count: libCategories.length
    },
    categories: libCategories,
    icons: libIcons
  };

  fs.writeFileSync(libOutputPath, JSON.stringify(libManifest, null, 2), 'utf8');

  console.log('  ✓ icons-manifest-' + libraryId + '.json (' + libIcons.length + ' icons in ' + libCategories.length + ' categories)');
  libCategories.forEach(cat => {
    const count = libIcons.filter(i => i.category === cat).length;
    console.log('    ' + cat.padEnd(30) + count);
  });
  console.log('');
});

console.log('Done.');
