"""type_history.py — server-side historical type corrections per generation.

The DB stores modern (current) types, but some Pokémon had different
types in earlier generations. This module corrects them at render time
so the HTML is already accurate before it hits the browser.

Format: CORRECTIONS[pokemon_id] = [(max_gen, [types])]  — sorted oldest first.
  max_gen: last generation where the corrected types apply.
"""

from pokeapi import get_type_color

# pokemon_id -> list of (max_gen, corrected_types), oldest first
CORRECTIONS: dict[int, list[tuple[int, list[str]]]] = {
    # ── Fairy type introduced Gen 6 ────────────────────────────────
    35:  [(5, ["normal"])],            # Clefairy
    36:  [(5, ["normal"])],            # Clefable
    39:  [(5, ["normal"])],            # Jigglypuff
    40:  [(5, ["normal"])],            # Wigglytuff
    122: [(5, ["psychic"])],           # Mr. Mime
    173: [(5, ["normal"])],            # Cleffa
    174: [(5, ["normal"])],            # Igglybuff
    175: [(5, ["normal"])],            # Togepi
    176: [(5, ["normal", "flying"])],  # Togetic
    183: [(5, ["water"])],             # Marill
    184: [(5, ["water"])],             # Azumarill
    209: [(5, ["normal"])],            # Snubbull
    210: [(5, ["normal"])],            # Granbull
    280: [(5, ["psychic"])],           # Ralts
    281: [(5, ["psychic"])],           # Kirlia
    282: [(5, ["psychic"])],           # Gardevoir
    298: [(5, ["normal"])],            # Azurill
    303: [(5, ["steel"])],             # Mawile (Steel only until Gen 6)
    439: [(5, ["psychic"])],           # Mime Jr.
    468: [(5, ["normal", "flying"])],  # Togekiss
    546: [(5, ["grass"])],             # Cottonee (intro'd Gen 5 as pure Grass)
    547: [(5, ["grass"])],             # Whimsicott
    # ── Steel type introduced Gen 2 ──────────────────────────────
    81:  [(1, ["electric"])],          # Magnemite (pure Electric in Gen 1)
    82:  [(1, ["electric"])],          # Magneton
}


def correct_types(pokemon_id: int, game_gen: int) -> list[str] | None:
    """Return corrected types for this Pokémon in this generation,
    or None if no correction is needed."""
    entries = CORRECTIONS.get(pokemon_id)
    if not entries:
        return None
    for max_gen, types in entries:
        if game_gen <= max_gen:
            return types
    return None


def apply_corrections(pokemon_list: list[dict], game_gen: int) -> list[dict]:
    """Patch types and type_colors in-place for every Pokémon in the list."""
    for p in pokemon_list:
        corrected = correct_types(p["id"], game_gen)
        if corrected:
            p["types"]       = corrected
            p["type_colors"] = [get_type_color(t) for t in corrected]
    return pokemon_list