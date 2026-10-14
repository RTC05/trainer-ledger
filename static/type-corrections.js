/* type-corrections.js
   Patches card type badges to show historically accurate types.

   The DB stores current (modern) types, but some Pokémon had different
   types in older generations:
     - Fairy type didn't exist until Gen 6
     - Steel type didn't exist until Gen 2

   This runs on page load and after every HTMX card swap.
*/
'use strict';

/* ── Historical type overrides ─────────────────────────────────────────────
   Format: pokemonId: [{untilGen: N, types: ['type1', 'type2?']}]
   "untilGen" = last generation where this correction applies
   (so untilGen:5 means Gen 1, 2, 3, 4 and 5 all use the corrected types)
*/
const HISTORICAL_TYPES = {
  // ── Fairy introduced Gen 6 ──────────────────────────────────────────────
  35:  [{untilGen: 5, types: ['normal']}],            // Clefairy
  36:  [{untilGen: 5, types: ['normal']}],            // Clefable
  39:  [{untilGen: 5, types: ['normal']}],            // Jigglypuff
  40:  [{untilGen: 5, types: ['normal']}],            // Wigglytuff
  122: [{untilGen: 5, types: ['psychic']}],           // Mr. Mime
  173: [{untilGen: 5, types: ['normal']}],            // Cleffa
  174: [{untilGen: 5, types: ['normal']}],            // Igglybuff
  175: [{untilGen: 5, types: ['normal']}],            // Togepi
  176: [{untilGen: 5, types: ['normal', 'flying']}],  // Togetic
  183: [{untilGen: 5, types: ['water']}],             // Marill
  184: [{untilGen: 5, types: ['water']}],             // Azumarill
  209: [{untilGen: 5, types: ['normal']}],            // Snubbull
  210: [{untilGen: 5, types: ['normal']}],            // Granbull
  280: [{untilGen: 5, types: ['psychic']}],           // Ralts
  281: [{untilGen: 5, types: ['psychic']}],           // Kirlia
  282: [{untilGen: 5, types: ['psychic']}],           // Gardevoir
  298: [{untilGen: 5, types: ['normal']}],            // Azurill
  303: [{untilGen: 5, types: ['steel']}],             // Mawile (Steel only — no Fairy until Gen 6)
  439: [{untilGen: 5, types: ['psychic']}],           // Mime Jr.
  468: [{untilGen: 5, types: ['normal', 'flying']}],  // Togekiss
  546: [{untilGen: 5, types: ['grass']}],             // Cottonee (introduced Gen 5 as pure Grass)
  547: [{untilGen: 5, types: ['grass']}],             // Whimsicott

  // ── Steel introduced Gen 2 — Magnemite line was pure Electric in Gen 1 ──
  81:  [{untilGen: 1, types: ['electric']}],           // Magnemite
  82:  [{untilGen: 1, types: ['electric']}],           // Magneton
};

const _TC = {
  normal:'#A8A878', fire:'#F08030', water:'#6890F0', electric:'#F8D030',
  grass:'#78C850',  ice:'#98D8D8',  fighting:'#C03028', poison:'#A040A0',
  ground:'#E0C068', flying:'#A890F0', psychic:'#F85888', bug:'#A8B820',
  rock:'#B8A038',   ghost:'#705898', dragon:'#7038F8',   dark:'#705848',
  steel:'#B8B8D0',  fairy:'#EE99AC',
};

function _historicalTypes(pokemonId, gameGen) {
  const entries = HISTORICAL_TYPES[pokemonId];
  if (!entries) return null;
  for (const e of entries) {
    if (gameGen <= e.untilGen) return e.types;
  }
  return null;
}

function _patchCard(card, gameGen) {
  const pokemonId = parseInt(card.id.replace('card-', ''), 10);
  if (!pokemonId) return;
  const corrected = _historicalTypes(pokemonId, gameGen);
  if (!corrected) return;

  // Fix data-types so the type-filter chips and search logic use correct types
  card.dataset.types = corrected.join(',');

  // Fix the visible type badges
  const typeRow = card.querySelector('.type-row');
  if (typeRow) {
    typeRow.innerHTML = corrected
      .map(t => `<span class="type-badge" style="background:${_TC[t] || '#777'}">${t}</span>`)
      .join('');
  }
}

function patchAllCards() {
  const gameGen = window.GAME_GEN;
  if (!gameGen) return;
  document.querySelectorAll('.poke-card').forEach(c => _patchCard(c, gameGen));
  // Rebuild type filter chips now that data-types attributes are corrected
  if (typeof buildTypeChips === 'function') buildTypeChips();
}

// Run immediately — script is at bottom of body so DOM is already built
patchAllCards();

// After any HTMX swap (card toggled caught/uncaught → server re-renders card with DB types)
document.addEventListener('htmx:afterSettle', e => {
  const gameGen = window.GAME_GEN;
  if (!gameGen) return;
  const t = e.detail?.target;
  if (t?.classList?.contains('poke-card')) {
    _patchCard(t, gameGen);
  } else {
    patchAllCards();
  }
});