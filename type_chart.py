"""Generation-aware type chart helpers for game pages.

Builds per-type rows that support both offensive and defensive views.
"""

from typing import Final

from pokeapi import TYPE_COLORS

_TYPE_INTRO_GEN: Final[dict[str, int]] = {
    "normal": 1, "fire": 1, "water": 1, "electric": 1, "grass": 1,
    "ice": 1, "fighting": 1, "poison": 1, "ground": 1, "flying": 1,
    "psychic": 1, "bug": 1, "rock": 1, "ghost": 1, "dragon": 1,
    "dark": 2, "steel": 2, "fairy": 6,
}

# Modern chart baseline (Gen 6+)
_TYPE_CHART_BASE: Final[dict[str, dict[str, list[str]]]] = {
    "normal":   {"super": [], "not": ["rock", "steel"], "immune": ["ghost"]},
    "fire":     {"super": ["grass", "ice", "bug", "steel"], "not": ["fire", "water", "rock", "dragon"], "immune": []},
    "water":    {"super": ["fire", "ground", "rock"], "not": ["water", "grass", "dragon"], "immune": []},
    "electric": {"super": ["water", "flying"], "not": ["electric", "grass", "dragon"], "immune": ["ground"]},
    "grass":    {"super": ["water", "ground", "rock"], "not": ["fire", "grass", "poison", "flying", "bug", "dragon", "steel"], "immune": []},
    "ice":      {"super": ["grass", "ground", "flying", "dragon"], "not": ["fire", "water", "ice", "steel"], "immune": []},
    "fighting": {"super": ["normal", "ice", "rock", "dark", "steel"], "not": ["poison", "flying", "psychic", "bug", "fairy"], "immune": ["ghost"]},
    "poison":   {"super": ["grass", "fairy"], "not": ["poison", "ground", "rock", "ghost"], "immune": ["steel"]},
    "ground":   {"super": ["fire", "electric", "poison", "rock", "steel"], "not": ["grass", "bug"], "immune": ["flying"]},
    "flying":   {"super": ["grass", "fighting", "bug"], "not": ["electric", "rock", "steel"], "immune": []},
    "psychic":  {"super": ["fighting", "poison"], "not": ["psychic", "steel"], "immune": ["dark"]},
    "bug":      {"super": ["grass", "psychic", "dark"], "not": ["fire", "fighting", "poison", "flying", "ghost", "steel", "fairy"], "immune": []},
    "rock":     {"super": ["fire", "ice", "flying", "bug"], "not": ["fighting", "ground", "steel"], "immune": []},
    "ghost":    {"super": ["psychic", "ghost"], "not": ["dark"], "immune": ["normal"]},
    "dragon":   {"super": ["dragon"], "not": ["steel"], "immune": ["fairy"]},
    "dark":     {"super": ["psychic", "ghost"], "not": ["fighting", "dark", "fairy"], "immune": []},
    "steel":    {"super": ["ice", "rock", "fairy"], "not": ["fire", "water", "electric", "steel"], "immune": []},
    "fairy":    {"super": ["fighting", "dragon", "dark"], "not": ["fire", "poison", "steel"], "immune": []},
}


def _available_types(game_gen: int) -> list[str]:
    return [t for t, intro_gen in _TYPE_INTRO_GEN.items() if intro_gen <= game_gen]


def _chart_for_gen(game_gen: int) -> dict[str, dict[str, list[str]]]:
    chart = {
        atk: {
            "super": vals["super"][:],
            "not": vals["not"][:],
            "immune": vals["immune"][:],
        }
        for atk, vals in _TYPE_CHART_BASE.items()
    }

    if game_gen == 1:
        chart["ghost"]["super"] = []
        chart["ghost"]["immune"] = ["normal", "psychic"]
        if "poison" not in chart["bug"]["super"]:
            chart["bug"]["super"].append("poison")

    return chart


def build_type_chart_rows(game_gen: int) -> list[dict]:
    """Build rows for type-chart rendering with offense + defense groupings."""
    types = _available_types(game_gen)
    chart = _chart_for_gen(game_gen)
    type_set = set(types)

    # Defensive map: for each defending type, which attack types are 2x / 0.5x / 0x
    defensive = {
        t: {"takes_double": [], "takes_half": [], "takes_zero": []}
        for t in types
    }
    for atk in types:
        vals = chart[atk]
        for t in vals["super"]:
            if t in type_set:
                defensive[t]["takes_double"].append(atk)
        for t in vals["not"]:
            if t in type_set:
                defensive[t]["takes_half"].append(atk)
        for t in vals["immune"]:
            if t in type_set:
                defensive[t]["takes_zero"].append(atk)

    rows: list[dict] = []
    for t in types:
        offense = chart[t]
        defense = defensive[t]
        rows.append({
            "type_name": t,
            "type_color": TYPE_COLORS.get(t, "#777777"),
            # Offense (this type attacking others)
            "offense_super": sorted([x for x in offense["super"] if x in type_set]),
            "offense_not": sorted([x for x in offense["not"] if x in type_set]),
            "offense_immune": sorted([x for x in offense["immune"] if x in type_set]),
            # Defense (this type being hit by other types)
            "defense_weak": sorted(defense["takes_double"]),
            "defense_resist": sorted(defense["takes_half"]),
            "defense_immune": sorted(defense["takes_zero"]),
        })

    return rows
