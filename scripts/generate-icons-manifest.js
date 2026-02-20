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

console.log('\nDone.');
