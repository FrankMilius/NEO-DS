// ============================================================
// TabNav — Auto-generated from tab-nav-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/TabNav',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**TabNav** v1.0.0 (draft)

Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.


`,
      },
    },
    status: { type: 'draft' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-solution-tabs nc-tab-nav nc-solution-tabs--contained" data-tab-nav="" data-orientation="horizontal" data-autoplay="off" style="--nc-solution-tabs-autoplay-duration: 7s;" data-tab-nav-init="1">
<div class="nc-solution-tabs__tablist" role="tablist">
<button class="nc-solution-tabs__tab" type="button" role="tab" id="tn5f-t0" aria-controls="tn5f-p0" aria-selected="true" tabindex="0">neo workplace<span class="nc-solution-tabs__progress" aria-hidden="true">
</span>
</button>
<button class="nc-solution-tabs__tab" type="button" role="tab" id="tn5f-t1" aria-controls="tn5f-p1" aria-selected="false" tabindex="-1">neo app<span class="nc-solution-tabs__progress" aria-hidden="true">
</span>
</button>
<button class="nc-solution-tabs__tab" type="button" role="tab" id="tn5f-t2" aria-controls="tn5f-p2" aria-selected="false" tabindex="-1">neo AI<span class="nc-solution-tabs__progress" aria-hidden="true">
</span>
</button>
<button class="nc-solution-tabs__tab" type="button" role="tab" id="tn5f-t3" aria-controls="tn5f-p3" aria-selected="false" tabindex="-1">neo magazine<span class="nc-solution-tabs__progress" aria-hidden="true">
</span>
</button>
<button class="nc-solution-tabs__tab" type="button" role="tab" id="tn5f-t4" aria-controls="tn5f-p4" aria-selected="false" tabindex="-1">neo chat<span class="nc-solution-tabs__progress" aria-hidden="true">
</span>
</button>
<button class="nc-solution-tabs__tab" type="button" role="tab" id="tn5f-t5" aria-controls="tn5f-p5" aria-selected="false" tabindex="-1">neo portal<span class="nc-solution-tabs__progress" aria-hidden="true">
</span>
</button>
<button class="nc-solution-tabs__tab" type="button" role="tab" id="tn5f-t6" aria-controls="tn5f-p6" aria-selected="false" tabindex="-1">neo cms<span class="nc-solution-tabs__progress" aria-hidden="true">
</span>
</button>
</div>
<div class="nc-solution-tabs__panel nc-tab-nav__panel is-active" role="tabpanel" id="tn5f-p0" aria-labelledby="tn5f-t0">
<div class="nc-tab-nav__panel-body">
<h3 class="nc-solution-tabs__panel-title">Social Intranet und Mitarbeitendenportal</h3>
<p class="nc-solution-tabs__panel-text">Das soziale Herzstück für Ihre digitale Arbeitswelt. Informationen fließen, Teams arbeiten zusammen, und Ihr Wissen ist auf Knopfdruck verfügbar.</p>
<div class="nc-tab-nav__module">
<ul class="nc-feature-list__items">
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Personalisierter News-Feed und Newskanäle</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Wissens- und Inhaltsseiten</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Vernetzung und Zusammenarbeit</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Digitale Prozesse</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Intranet-Apps für Geburtstage, Kantine, Räume, Fahrzeuge und mehr</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Effizientes Content-Management</span>
</li>
</ul>
</div>
<a class="nc-button nc-button--accent nc-button--lg" href="#">
<span>Mehr erfahren</span>
</a>
</div>
</div>
<div class="nc-solution-tabs__panel nc-tab-nav__panel" role="tabpanel" id="tn5f-p1" aria-labelledby="tn5f-t1" hidden="">
<div class="nc-tab-nav__panel-body">
<h3 class="nc-solution-tabs__panel-title">Mitarbeitenden-App für iOS und Android</h3>
<p class="nc-solution-tabs__panel-text">Von der Produktion bis zum Frontline-Service – Mit der neo Workplace App erreichen Sie alle Mitarbeitende – auch die ohne festen PC-Arbeitsplatz und ohne Mailadresse.</p>
<div class="nc-tab-nav__module">
<div class="nc-expanding-panels nc-tab-nav__xpanels" role="group">
<button type="button" class="nc-expanding-panels__panel" aria-expanded="true">
<span class="nc-expanding-panels__bg" aria-hidden="true">
</span>
<span class="nc-expanding-panels__num">01</span>
<span class="nc-expanding-panels__body">
<h3 class="nc-expanding-panels__title">iOS &amp; Android</h3>
</span>
</button>
<button type="button" class="nc-expanding-panels__panel" aria-expanded="false">
<span class="nc-expanding-panels__bg" aria-hidden="true">
</span>
<span class="nc-expanding-panels__num">02</span>
<span class="nc-expanding-panels__body">
<h3 class="nc-expanding-panels__title">White-Label: Angepasst an das Kundendesign</h3>
</span>
</button>
<button type="button" class="nc-expanding-panels__panel" aria-expanded="false">
<span class="nc-expanding-panels__bg" aria-hidden="true">
</span>
<span class="nc-expanding-panels__num">03</span>
<span class="nc-expanding-panels__body">
<h3 class="nc-expanding-panels__title">Push-Nachrichten und Echtzeit-Kommunikation</h3>
</span>
</button>
<button type="button" class="nc-expanding-panels__panel" aria-expanded="false">
<span class="nc-expanding-panels__bg" aria-hidden="true">
</span>
<span class="nc-expanding-panels__num">04</span>
<span class="nc-expanding-panels__body">
<h3 class="nc-expanding-panels__title">Interaktiv und dialogorientiert</h3>
</span>
</button>
<button type="button" class="nc-expanding-panels__panel" aria-expanded="false">
<span class="nc-expanding-panels__bg" aria-hidden="true">
</span>
<span class="nc-expanding-panels__num">05</span>
<span class="nc-expanding-panels__body">
<h3 class="nc-expanding-panels__title">Verschiedene Distributionsoptionen, z.B. über Mobile Device Management oder App-Stores</h3>
</span>
</button>
</div>
</div>
<a class="nc-button nc-button--accent nc-button--lg" href="#">
<span>Mehr erfahren</span>
</a>
</div>
</div>
<div class="nc-solution-tabs__panel nc-tab-nav__panel" role="tabpanel" id="tn5f-p2" aria-labelledby="tn5f-t2" hidden="">
<div class="nc-tab-nav__panel-body">
<h3 class="nc-solution-tabs__panel-title">Unternehmensinterner Assistent</h3>
<p class="nc-solution-tabs__panel-text">neo AI denkt mit und nach, beantwortet als KI-Agent Fragen und durchsucht dazu relevante, zuverlässige Quellen. Dabei wird berücksichtigt, was ein Mitarbeiter wissen darf. Sicher, direkt und interaktiv.</p>
<div class="nc-tab-nav__module">
<div class="nc-bento-grid nc-tab-nav__bento">
<article class="nc-bento-grid__cell nc-bento-grid__cell--lg">
<h3 class="nc-bento-grid__title">KI-gestützte Antworten zu allen Fragen</h3>
<p class="nc-bento-grid__text">Statt "Suchen" wird jetzt "gefragt". Und die Antwort wird mit Inhalten aus dem Intranet natürlichsprachig generiert</p>
</article>
<article class="nc-bento-grid__cell nc-bento-grid__cell--wide">
<h3 class="nc-bento-grid__title">Nutzung von Wissen und relevanten Informationen aus definierten Quellen</h3>
</article>
<article class="nc-bento-grid__cell nc-bento-grid__cell--lg">
<h3 class="nc-bento-grid__title">Nennung von Links und weiterführenden Inhalten z.B. im Intranet</h3>
</article>
<article class="nc-bento-grid__cell">
<h3 class="nc-bento-grid__title">Sichere, lokal gehostete LLM-Sprachmodelle</h3>
</article>
<article class="nc-bento-grid__cell nc-bento-grid__cell--wide">
<h3 class="nc-bento-grid__title">Kundenspezifische LLM anbindbar</h3>
</article>
<article class="nc-bento-grid__cell">
<h3 class="nc-bento-grid__title">Berücksichtigung von Zugriffs- und Nutzerberechtigungen</h3>
</article>
</div>
</div>
<a class="nc-button nc-button--accent nc-button--lg" href="#">
<span>Mehr erfahren</span>
</a>
</div>
</div>
<div class="nc-solution-tabs__panel nc-tab-nav__panel" role="tabpanel" id="tn5f-p3" aria-labelledby="tn5f-t3" hidden="">
<div class="nc-tab-nav__panel-body">
<h3 class="nc-solution-tabs__panel-title">Corporate Publishing als digitales Magazin</h3>
<p class="nc-solution-tabs__panel-text">Erreichen Sie ihre Zielgruppe mit erlebnisreichem Content – z.B. im Mitarbeitenden-, Kunden- oder Hochschulmagazin.</p>
<div class="nc-tab-nav__module">
<ul class="nc-feature-list__items">
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Magazin-Rubriken und Themen</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Abonnement-Funktion und personalisierter Newsletter</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Multimediale Beiträge (Video, Audio, Infografik)</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Drag-&amp;-Drop Redaktionssystem</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">KI-gestützte Content-Erstellung und Übersetzung</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Analytics und Reichweitenmessung</span>
</li>
</ul>
</div>
<a class="nc-button nc-button--accent nc-button--lg" href="#">
<span>Mehr erfahren</span>
</a>
</div>
</div>
<div class="nc-solution-tabs__panel nc-tab-nav__panel" role="tabpanel" id="tn5f-p4" aria-labelledby="tn5f-t4" hidden="">
<div class="nc-tab-nav__panel-body">
<h3 class="nc-solution-tabs__panel-title">DSGVO-konformer Echtzeit-Messenger</h3>
<p class="nc-solution-tabs__panel-text">Ein Add-On-Modul für neo workplace für die Echtzeit-Kommunikation zwischen Mitarbeitenden. Mit dem neo chat kommunizieren Ihre Mitarbeiter in Einzel- und Gruppenchats sicher und datenschutzkonform miteinander.</p>
<div class="nc-tab-nav__module">
<ul class="nc-solution-tabs__features nc-tab-nav__features">
<li class="nc-solution-tabs__feature">Chat-Nachrichten schreiben und versenden</li>
<li class="nc-solution-tabs__feature">Einzel- und Gruppenchats</li>
<li class="nc-solution-tabs__feature">Integriert in Ihr Intranet</li>
</ul>
</div>
</div>
</div>
<div class="nc-solution-tabs__panel nc-tab-nav__panel" role="tabpanel" id="tn5f-p5" aria-labelledby="tn5f-t5" hidden="">
<div class="nc-tab-nav__panel-body">
<h3 class="nc-solution-tabs__panel-title">Webseite, Portal und Extranet</h3>
<p class="nc-solution-tabs__panel-text">Die NEOCOSMO Lösung für Ihr zielgruppenspezisches Portal z.B. ein On- oder Preboarding-Portal, Extranet oder Ihre Presse- und Kommunikations-Website.</p>
<div class="nc-tab-nav__module">
<ul class="nc-feature-list__items">
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Offene Webseite und zugangsbeschränkte Kommunikationsbereiche</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Strukturierte Informations- und Wissensseiten</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Zusammenarbeit und Kollaborationsfunktionen</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Intelligente Suche</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">KI-gestützte Content-Erstellung und Übersetzung</span>
</li>
</ul>
</div>
<a class="nc-button nc-button--accent nc-button--lg" href="#">
<span>Mehr erfahren</span>
</a>
</div>
</div>
<div class="nc-solution-tabs__panel nc-tab-nav__panel" role="tabpanel" id="tn5f-p6" aria-labelledby="tn5f-t6" hidden="">
<div class="nc-tab-nav__panel-body">
<h3 class="nc-solution-tabs__panel-title">Content-Management - Basis von jeder Anwendung und automatisch dabei</h3>
<p class="nc-solution-tabs__panel-text">Einfach zu bedienen, funktional mächtig. Planen, Erstellen, Pflegen, Administrieren von allen Inhalten und Medien plus die Konfiguration des kompletten Systems.</p>
<div class="nc-tab-nav__module">
<ul class="nc-feature-list__items">
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Inhaltsplanung, -Erstellung, -Pflege und -Administration</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Redaktionsdashboard und einfach zu bedienender Drag&amp;Drop WYSYWIG Editor</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Benutzer-, Gruppen-, Rollen- und Berechtigungsverwaltung</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Medien-Management</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Administrations- und Konfigurationstools - Konfigurieren, Managen und Überwachen</span>
</li>
<li class="nc-feature-list__item">
<span class="nc-feature-list__icon">
<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<circle cx="18" cy="18" r="18" fill="#AEF359">
</circle>
<path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
</path>
</svg>
</span>
<span class="nc-feature-list__item-text">Umfangreiches Analytics für Nutzungs-, Engagement- und Wirkungsmessung</span>
</li>
</ul>
</div>
<a class="nc-button nc-button--accent nc-button--lg" href="#">
<span>Mehr erfahren</span>
</a>
</div>
</div>
</div>`,
};
