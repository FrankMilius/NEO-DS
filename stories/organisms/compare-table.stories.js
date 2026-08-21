// ============================================================
// CompareTable — Auto-generated from compare-table-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/CompareTable',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**CompareTable** v1.0.0 (draft)

Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.


`,
      },
    },
    status: { type: 'draft' },
  },
  argTypes: {
    "unknown": {
      "control": {
        "type": "select"
      },
      "options": [
        "0",
        "1",
        "2",
        "3"
      ],
      "description": ""
    }
  },
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-compare-table nc-compare-table--striped nc-compare-table--sticky-header nc-compare-table--full-width nc-compare-table--sticky-col">
<table>
<thead>
<tr>
<th scope="col">Funktion</th>
<th scope="col">Standard</th>
<th scope="col">Premium</th>
</tr>
</thead>
<tbody>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">FUER MITARBEITENDE / ENDNUTZER</p>
</div>
</th>
<td>
<div class="nc-tbl-cell">
</div>
</td>
<td>
<div class="nc-tbl-cell">
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">News, Newskanäle</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Inhalts- und Wissensseiten</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Veranstaltungskalender &amp; Event-Seiten</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Mitarbeiterverzeichnis &amp; Nutzerprofile</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Personalisierte Toolbar &amp; Schnellzugriff</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Intelligente Volltextsuche</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Personalisierung, Liken, Teilen, Kommentieren</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Digitales Mitarbeitendenmagazin mit Rubriken &amp; Empfehlungen</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--dash" width="32" height="32" viewBox="0 0 36 36" fill="none">
<path d="M11 18H25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Wikis</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--dash" width="32" height="32" viewBox="0 0 36 36" fill="none">
<path d="M11 18H25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Umfragen</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--dash" width="32" height="32" viewBox="0 0 36 36" fill="none">
<path d="M11 18H25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Schwarzes Brett, Ideenboard, Forum</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--dash" width="32" height="32" viewBox="0 0 36 36" fill="none">
<path d="M11 18H25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Digitale Verzeichnisse (Dokumente, Räume, Fahrzeuge)</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--dash" width="32" height="32" viewBox="0 0 36 36" fill="none">
<path d="M11 18H25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Kantinenpläne, Jubiläen, Stellenausschreibungen</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--dash" width="32" height="32" viewBox="0 0 36 36" fill="none">
<path d="M11 18H25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">MOBILE NUTZUNG</p>
</div>
</th>
<td>
<div class="nc-tbl-cell">
</div>
</td>
<td>
<div class="nc-tbl-cell">
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Responsive Web &amp; Web-App</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Standard Mobile App (iOS &amp; Android)</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">alternativ: White-Label App (gebrandete Variante)</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--dash" width="32" height="32" viewBox="0 0 36 36" fill="none">
<path d="M11 18H25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Add-On</p>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">FUER ADMINISTRATION &amp; REDAKTION</p>
</div>
</th>
<td>
<div class="nc-tbl-cell">
</div>
</td>
<td>
<div class="nc-tbl-cell">
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Content Management (Gutenberg, Versionierung)</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Medien- &amp; Asset-Management</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Benutzerverwaltung &amp; Rechteverwaltung</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Nutzerstatistiken &amp; Seitenauswertungen</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Erweiterte Analytics &amp; Engagement-Analysen</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--dash" width="32" height="32" viewBox="0 0 36 36" fill="none">
<path d="M11 18H25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Organisationsgruppen &amp; Nutzersegmentierung</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--dash" width="32" height="32" viewBox="0 0 36 36" fill="none">
<path d="M11 18H25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Konfigurierbare Automatisierungsregeln</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--dash" width="32" height="32" viewBox="0 0 36 36" fill="none">
<path d="M11 18H25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Newsletter-Kommunikation</p>
</div>
</th>
<td>
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Add-On</p>
</div>
</td>
<td>
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Add-On</p>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">BETRIEB &amp; INFRASTRUKTUR</p>
</div>
</th>
<td>
<div class="nc-tbl-cell">
</div>
</td>
<td>
<div class="nc-tbl-cell">
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Cloud-Hosting (ISO 27001, EU/Deutschland)<button class="nc-tbl-cell__info-btn" aria-label="Mehr Informationen">
<svg class="nc-tbl-info-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5">
</circle>
<path d="M8 5.33h.007" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
</path>
<path d="M7.33 8H8v2.67h.67" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</button>
</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">On-Premise<button class="nc-tbl-cell__info-btn" aria-label="Mehr Informationen">
<svg class="nc-tbl-info-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5">
</circle>
<path d="M8 5.33h.007" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
</path>
<path d="M7.33 8H8v2.67h.67" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</button>
</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--dash" width="32" height="32" viewBox="0 0 36 36" fill="none">
<path d="M11 18H25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">möglich</p>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Sicherheits- &amp; Funktionsupdates</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Verfuegbarkeitsgarantie (99%)<button class="nc-tbl-cell__info-btn" aria-label="Mehr Informationen">
<svg class="nc-tbl-info-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5">
</circle>
<path d="M8 5.33h.007" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
</path>
<path d="M7.33 8H8v2.67h.67" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</button>
</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">AD-Anbindung &amp; SSO<button class="nc-tbl-cell__info-btn" aria-label="Mehr Informationen">
<svg class="nc-tbl-info-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5">
</circle>
<path d="M8 5.33h.007" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
</path>
<path d="M7.33 8H8v2.67h.67" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</button>
</p>
</div>
</th>
<td>
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Optional</p>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">User Provisioning via LDAP / SCIM<button class="nc-tbl-cell__info-btn" aria-label="Mehr Informationen">
<svg class="nc-tbl-info-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5">
</circle>
<path d="M8 5.33h.007" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
</path>
<path d="M7.33 8H8v2.67h.67" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</button>
</p>
</div>
</th>
<td>
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Optional</p>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Eigene Domain / Corporate URL</p>
</div>
</th>
<td>
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Optional</p>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Corporate Design</p>
</div>
</th>
<td>
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Logo &amp; Farben</p>
</div>
</td>
<td>
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Eigenes Theme</p>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Support 5/8 Werktage</p>
</div>
</th>
<td>
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Supportportal</p>
</div>
</td>
<td>
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Portal, Tel. &amp; Mail</p>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Dedizierter Key Account Manager</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--dash" width="32" height="32" viewBox="0 0 36 36" fill="none">
<path d="M11 18H25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
<tr>
<th scope="row">
<div class="nc-tbl-cell">
<p class="nc-tbl-cell__text">Offene REST-API</p>
</div>
</th>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
<td>
<div class="nc-tbl-cell nc-tbl-cell--icon">
<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</div>
</td>
</tr>
</tbody>
</table>
</div>`,
};
