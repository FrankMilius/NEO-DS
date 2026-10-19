<template>
  <!--
    Bühne „Themes“ (19.10.2026). Vorher: Steckbriefe der vier Theme-Klassen
    (ThemesOverview, nur Klassennamen und Erklärtexte). Jetzt: derselbe
    Ausschnitt der Website in allen vier Kombinationen aus Variante
    (NEO · Kunde) und Modus (Hell · Dunkel) — mit den Werten des geöffneten
    Themes. Die technischen Klassen stehen nur bei „Technische Namen zeigen“.
  -->
  <div class="tb" data-test="themes-buehne">
    <p class="tb-hinweis">Derselbe Ausschnitt der Website in allen vier Kombinationen. Welche davon die Website zeigt, legen Sie mit „Auf der Website aktivieren“ fest.</p>
    <div class="tb-raster">
      <div v-for="k in KOMBINATIONEN" :key="k.klasse" class="tb-feld">
        <span class="tb-titel">{{ k.name }} <code class="we-technik">.{{ k.klasse }}</code></span>
        <WebsiteAusschnitt :set="k.set" :modus="k.modus" :komponenten="['card', 'button', 'badge', 'input', 'form-field', 'form-label']">
          <div class="tb-seite">
            <div class="tb-kopf">
              <strong class="tb-marke">neocosmo</strong>
              <nav class="tb-nav" aria-label="Beispielnavigation">
                <a href="#" @click.prevent>Lösungen</a>
                <a href="#" @click.prevent>Produkte</a>
                <a href="#" @click.prevent>Kontakt</a>
              </nav>
            </div>
            <span class="nc-badge"><span class="nc-badge__label">Neu</span></span>
            <h3>Der intelligente digitale Arbeitsplatz</h3>
            <p>Kommunikation, Wissen und Zusammenarbeit in einer offenen Plattform. <a href="#" @click.prevent>Mehr über die Plattform</a></p>
            <div class="tb-knoepfe">
              <button type="button" class="nc-button nc-button--primary"><span class="nc-button__label">Demo anfragen</span></button>
              <button type="button" class="nc-button nc-button--outline"><span class="nc-button__label">Mehr erfahren</span></button>
            </div>
            <!-- Karte: Markup geerntet von der Website (data/markup/card.html) -->
            <a href="#" class="nc-card nc-card--navigational" @click.prevent>
              <div class="nc-card__content">
                <span class="nc-card__kicker">Konferenz</span>
                <h3 class="nc-card__title">NEO Partner Day 2026</h3>
                <p class="nc-card__meta">08.07.2026</p>
              </div>
              <div class="nc-card__footer">
                <span class="nc-card__footer-label">Mehr erfahren</span>
                <span class="nc-card__footer-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></span>
              </div>
            </a>
            <div class="nc-form-field">
              <label class="nc-form-label" :for="`tb-mail-${k.klasse}`"><span class="nc-form-label__text">E-Mail-Adresse</span></label>
              <input :id="`tb-mail-${k.klasse}`" class="nc-input" type="email" placeholder="name@behoerde.de">
            </div>
          </div>
        </WebsiteAusschnitt>
      </div>
    </div>
  </div>
</template>

<script setup>
import WebsiteAusschnitt from './WebsiteAusschnitt.vue'

const KOMBINATIONEN = [
  { name: 'NEO · Hell', klasse: 'neo-light-theme', set: 'neo', modus: 'light' },
  { name: 'NEO · Dunkel', klasse: 'neo-dark-theme', set: 'neo', modus: 'dark' },
  { name: 'Kunde · Hell', klasse: 'customer-light-theme', set: 'customer', modus: 'light' },
  { name: 'Kunde · Dunkel', klasse: 'customer-dark-theme', set: 'customer', modus: 'dark' },
]
</script>

<style scoped>
.tb { display: grid; gap: 12px; padding: 16px; }
.tb-hinweis { margin: 0; font-size: 12px; color: var(--cfg-text-muted); }
.tb-raster { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px; }
.tb-feld { display: grid; gap: 6px; align-content: start; min-width: 0; }
.tb-titel { font-size: 12px; font-weight: 600; color: var(--cfg-text); display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
.tb-titel code { font-size: 10px; color: var(--cfg-text-muted); }
.tb-seite { display: grid; gap: 14px; justify-items: start; }
.tb-seite > * { margin: 0; }
.tb-kopf { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; width: 100%; padding-bottom: 10px; border-bottom: 1px solid var(--fnd-color-border-secondary); }
.tb-marke { font-family: var(--font-heading); letter-spacing: .08em; }
.tb-nav { display: flex; gap: 14px; font-size: 13px; }
.tb-nav a { color: var(--fnd-color-text-primary); text-decoration: none; }
.tb-knoepfe { display: flex; flex-wrap: wrap; gap: 8px; }
.tb-seite .nc-card, .tb-seite .nc-form-field { width: 100%; }
</style>
