<template>
  <!--
    Ausschnitt einer Website-Seite für die Bühne (Themes, „Auf der Seite“,
    19.10.2026). Bauteile mit dem Markup der Website (Karte: data/markup/
    card.html); Abstände der Anordnung aus den Abstands-Tokens des Design
    Systems — sonst zeigte „Auf der Seite“ Werte, die es auf der Website nicht
    gibt.
  -->
  <div class="wb">
    <div class="wb-kopf">
      <strong class="wb-marke">neocosmo</strong>
      <nav class="wb-nav" aria-label="Beispielnavigation">
        <a href="#" @click.prevent>Lösungen</a>
        <a href="#" @click.prevent>Produkte</a>
        <a href="#" @click.prevent>Kontakt</a>
      </nav>
    </div>
    <span class="nc-badge"><span class="nc-badge__label">Neu</span></span>
    <h3>Der intelligente digitale Arbeitsplatz</h3>
    <p>Kommunikation, Wissen und Zusammenarbeit in einer offenen Plattform. <a href="#" @click.prevent>Mehr über die Plattform</a></p>
    <div class="wb-knoepfe">
      <button type="button" class="nc-button nc-button--primary"><span class="nc-button__label">Demo anfragen</span></button>
      <button type="button" class="nc-button nc-button--outline"><span class="nc-button__label">Mehr erfahren</span></button>
      <button v-if="mitDeaktiviert" type="button" class="nc-button nc-button--primary" disabled><span class="nc-button__label">Ausgebucht</span></button>
    </div>
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
      <label class="nc-form-label" :for="`${idPraefix}-mail`"><span class="nc-form-label__text">E-Mail-Adresse</span></label>
      <input :id="`${idPraefix}-mail`" class="nc-input" type="email" placeholder="name@behoerde.de">
    </div>
  </div>
</template>

<script setup>
defineProps({
  /** eindeutige Feld-IDs, wenn der Ausschnitt mehrfach auf der Bühne steht */
  idPraefix: { type: String, required: true },
  /** deaktivierter Knopf (Deckkraft) */
  mitDeaktiviert: { type: Boolean, default: false },
})
</script>

<style scoped>
.wb { display: grid; gap: var(--fnd-spacing-04); justify-items: start; }
.wb > * { margin: 0; }
.wb-kopf { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--fnd-spacing-02) var(--fnd-spacing-04); width: 100%; padding-bottom: var(--fnd-spacing-03); border-bottom: var(--fnd-border-width-xs) solid var(--fnd-color-border-secondary); }
.wb-marke { font-family: var(--font-heading); letter-spacing: .08em; }
.wb-nav { display: flex; flex-wrap: wrap; gap: var(--fnd-spacing-02) var(--fnd-spacing-04); }
.wb-nav a { color: var(--fnd-color-text-primary); text-decoration: none; }
.wb-knoepfe { display: flex; flex-wrap: wrap; gap: var(--fnd-spacing-02); }
.wb .nc-card, .wb .nc-form-field { width: 100%; }
</style>
