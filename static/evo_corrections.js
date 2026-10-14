/* evo_corrections.js — Generation-accurate evolution method overrides.

   PokéAPI returns CURRENT (Gen 9) evolution methods. Some Pokémon had
   different methods in older games. This table corrects them based on
   the game's generation so the drawer always shows the right info.

   Format per entry:
     pokemonId (evolved form): [ {maxGen, label}, ... ]
   The FIRST entry whose maxGen >= gameGen wins.
   If no entry matches, the PokéAPI data is used as-is.

   Sources: Bulbapedia evolution pages, verified per generation.
*/
'use strict';

const EVO_CORRECTIONS = {

  /* ── Feebas → Milotic ─────────────────────────────────────────────────
     Gen 3-4 : Max Beauty stat (Pokéblocks in Gen 3 / Poffins in Gen 4)
     Gen 5+  : Trade holding Prism Scale
     Note: BDSP (gen 8) also removed beauty — Prism Scale trade applies  */
  350: [
    { maxGen: 4,  label: 'High Beauty (Pokéblocks / Poffins)' },
    { maxGen: 99, label: 'Trade holding Prism Scale' },
  ],

  /* ── Magneton → Magnezone ─────────────────────────────────────────────
     Gen 4-6 : Level up in a location with a Magnetic Field
     Gen 7   : Level up at Mount Lanakila (Sun / Moon / USUM)
     Gen 8+  : Thunder Stone — PokéAPI handles correctly               */
  462: [
    { maxGen: 6, label: 'Level up near Magnetic Field' },
    { maxGen: 7, label: 'Level up at Mount Lanakila' },
  ],

  /* ── Eevee → Leafeon ──────────────────────────────────────────────────
     Gen 4-7 : Level up near a Moss Rock
       Gen 4  — Eterna Forest (D/P/Pt)
       Gen 5  — Pinwheel Forest (BW / BW2)
       Gen 6  — Pokémon Village (XY) — not obtainable in ORAS
       Gen 7  — Not obtainable in SM/USUM without transfer
     Gen 8+  : Leaf Stone — PokéAPI handles correctly                  */
  470: [
    { maxGen: 7, label: 'Level up near Moss Rock' },
  ],

  /* ── Eevee → Glaceon ──────────────────────────────────────────────────
     Gen 4-7 : Level up near an Ice Rock
       Gen 4  — Route 217 (D/P/Pt)
       Gen 5  — Twist Mountain (BW / BW2)
       Gen 6  — Frost Cavern area (XY) — not obtainable in ORAS
       Gen 7  — Not obtainable in SM/USUM without transfer
     Gen 8+  : Ice Stone — PokéAPI handles correctly                   */
  471: [
    { maxGen: 7, label: 'Level up near Ice Rock' },
  ],

  /* ── Nosepass → Probopass ─────────────────────────────────────────────
     Same magnetic-field logic as Magnezone                            */
  476: [
    { maxGen: 6, label: 'Level up near Magnetic Field' },
    { maxGen: 7, label: 'Level up at Mount Lanakila' },
  ],

  /* ── Eevee → Sylveon ──────────────────────────────────────────────────
     Gen 6-7 : 2+ Pokémon-Amie / Pokémon Refresh hearts + Fairy-type move
     Gen 8+  : High Friendship + knows a Fairy-type move
               (PokéAPI now returns the Gen 8 label correctly)         */
  700: [
    { maxGen: 7, label: 'High Affection (Pokémon-Amie) + Fairy-type move' },
  ],

  /* ── Charjabug → Vikavolt ─────────────────────────────────────────────
     Gen 7   : Level up at Vast Poni Canyon (SM / USUM)
     Gen 8+  : Thunder Stone — PokéAPI handles correctly               */
  738: [
    { maxGen: 7, label: 'Level up at Vast Poni Canyon' },
  ],

  /* ── Crabrawler → Crabominable ────────────────────────────────────────
     Gen 7   : Level up at Mount Lanakila (SM / USUM)
     Gen 8+  : Ice Stone — PokéAPI handles correctly                   */
  740: [
    { maxGen: 7, label: 'Level up at Mount Lanakila' },
  ],
};


/**
 * Returns corrected evolution label for this Pokémon in this generation,
 * or null if the PokéAPI data is already correct.
 */
function getEvoCorrection(pokemonId, gameGen) {
  const entries = EVO_CORRECTIONS[pokemonId];
  if (!entries) return null;
  for (const e of entries) {
    if (gameGen <= e.maxGen) return e.label;
  }
  return null; // API data is accurate for this gen — leave it alone
}


/**
 * Walk flattened evo rows and patch .trigger on any node that needs
 * a generation-accurate correction. Mutates rows in-place.
 */
function applyEvoCorrections(rows, gameGen) {
  if (!gameGen || gameGen === 99) return rows;
  rows.forEach(row => {
    const nodes = Array.isArray(row) ? row : [row];
    nodes.forEach(node => {
      if (!node || !node.id) return;
      const fix = getEvoCorrection(node.id, gameGen);
      if (fix !== null) node.trigger = fix;
    });
  });
  return rows;
}

window.applyEvoCorrections = applyEvoCorrections;