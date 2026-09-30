// Vorlage: security-list — Markup aus data/markup/security-list.html.
export default (zelle, m) => `
<ul class="${m.klasse}"${m.attrs}>
<li class="nc-security-list__item">Zwei-Faktor-Authentifizierung</li>
<li class="nc-security-list__item">Automatische Sicherheitsupdates</li>
<li class="nc-security-list__item">Penetrationstests durch Dritte</li>
</ul>
`
