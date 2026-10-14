"""Static Pokémon seeder — populates the DB from bundled data.

Used when PokéAPI is unreachable (e.g. on corporate networks).
Only seeds games that haven't been cached yet, so it's safe to
call on every startup.
"""
import json
from database import (
    get_db, is_game_cached, mark_game_cached,
    reset_game_cache, cleanup_orphaned_game_pokemon,
)
from seed_data.gen1 import KANTO
from seed_data.gen2 import JOHTO
from seed_data.gen3 import HOENN
from seed_data.gen4 import SINNOH
from seed_data.gen5 import UNOVA
from seed_data.gen6 import KALOS
from seed_data.gen7 import ALOLA
from seed_data.gen8 import GALAR
from seed_data.gen9 import PALDEA

# All Pokemon indexed by national dex ID: {id: (id, name, type1, type2|None)}
_ALL: dict[int, tuple] = {
    p[0]: p for p in
    KANTO + JOHTO + HOENN + SINNOH + UNOVA + KALOS + ALOLA + GALAR + PALDEA
}

_GEN_RANGES = [
    (1, 1, 151), (2, 152, 251), (3, 252, 386), (4, 387, 493),
    (5, 494, 649), (6, 650, 721), (7, 722, 809), (8, 810, 905), (9, 906, 1025),
]


def _gen_for_id(pid: int) -> int:
    for gen, lo, hi in _GEN_RANGES:
        if lo <= pid <= hi:
            return gen
    return 0


# Which national IDs belong to each pokedex slug.
# ORDER MATTERS — this is the regional dex order, not national.
# Johto slugs list Gen-2 Pokémon first so Chikorita lands on #001.
_SLUG_IDS: dict[str, list[int]] = {
    "kanto":           list(range(1, 152)),
    "letsgo-kanto":    list(range(1, 152)) + [808, 809],
    # Johto regional dex: 100 new Johto Pokémon first, then 151 Kanto
    "original-johto":  list(range(152, 252)) + list(range(1, 152)),
    "updated-johto":   list(range(152, 252)) + list(range(1, 152)),
    "hoenn":           list(range(252, 387)),
    "updated-hoenn":   list(range(252, 387)),
    "original-sinnoh": list(range(387, 494)),
    "extended-sinnoh": list(range(387, 494)),
    "updated-sinnoh":  list(range(387, 494)),
    "original-unova":  list(range(494, 650)),
    "updated-unova":   list(range(494, 650)),
    # Kalos sub-dexes start with Gen-6 Pokémon (Chespin = #001 in the game)
    "kalos-central":   list(range(650, 722)),
    "kalos-coastal":   list(range(650, 722)),
    "kalos-mountain":  list(range(650, 722)),
    "original-alola":  list(range(722, 810)),
    "updated-alola":   list(range(722, 810)),
    "galar":           list(range(810, 906)),
    "isle-of-armor":   list(range(810, 906)),
    "crown-tundra":    list(range(810, 906)),
    "hisui":           list(range(810, 906)),
    "paldea":          list(range(906, 1026)),
    "kitakami":        list(range(906, 1026)),
    "blueberry":       list(range(906, 1026)),
    "national":        list(range(1, 1026)),
}


def _ids_for_slugs(slugs: list[str]) -> list[int]:
    """Return national IDs for the given slugs in regional dex order.

    Insertion order is preserved (first occurrence wins for dedup).
    Do NOT sort — regional ordering is encoded in _SLUG_IDS.
    """
    seen: set[int] = set()
    result: list[int] = []
    for slug in slugs:
        for pid in _SLUG_IDS.get(slug, []):
            if pid not in seen:
                seen.add(pid)
                result.append(pid)
    return result  # regional order, not sorted


def _sprite_url(pid: int) -> str:
    return (
        f"https://raw.githubusercontent.com/PokeAPI/sprites/master"
        f"/sprites/pokemon/{pid}.png"
    )


def seed_game(game_id: str, slugs: list[str]) -> int:
    """Pre-populate one game from bundled static data.

    Deliberately does NOT call mark_game_cached() — that is the browser-side
    seeder's job after it fetches the authoritative regional dex from PokéAPI.
    Static data only covers same-generation Pokémon and is a fallback /
    offline safety net; cross-generation Pokémon (e.g. Eevee in Galar) are
    added by the browser seeder once PokéAPI is reachable.
    """
    ids = _ids_for_slugs(slugs)
    with get_db() as conn:
        for dex_pos, pid in enumerate(ids, start=1):
            if pid not in _ALL:
                continue
            _, name, type1, type2 = _ALL[pid]
            types_json = json.dumps([type1] + ([type2] if type2 else []))
            conn.execute(
                """
                INSERT INTO pokemon (id, name, sprite_url, types, generation, is_cached)
                VALUES (?, ?, ?, ?, ?, 1)
                ON CONFLICT(id) DO UPDATE SET
                    name=excluded.name, sprite_url=excluded.sprite_url,
                    types=excluded.types, generation=excluded.generation,
                    is_cached=1
                """,
                (pid, name, _sprite_url(pid), types_json, _gen_for_id(pid)),
            )
            conn.execute(
                """
                INSERT OR IGNORE INTO game_pokemon (game_id, pokemon_id, dex_number)
                VALUES (?, ?, ?)
                """,
                (game_id, pid, dex_pos),
            )
    # NOTE: do NOT call mark_game_cached() here.
    # The browser seeder owns the cached flag so cross-gen Pokémon aren't missed.
    return len(ids)


def seed_all_games(games: list[dict]) -> None:  # noqa: C901
    # ── Startup cleanup: remove game_pokemon rows with no matching pokemon entry.
    # These orphans inflate stat counts while never appearing in the grid.
    removed = cleanup_orphaned_game_pokemon()
    if removed:
        print(f"[seeder] removed {removed} orphaned game_pokemon row(s)")
    """Seed every uncached (or empty) game from static data. Safe on every startup.

    Self-healing: if a game is marked cached but only contains the static
    seed count (meaning the browser seeder never ran or was interrupted and
    marked it cached too early), clear the cached flag so the browser re-seeds
    on the next page visit.
    """
    for game in games:
        game_id = game["id"]
        static_count = len(_ids_for_slugs(game["pokedex_slugs"]))
        db_total     = _get_game_total(game_id)
        cached       = is_game_cached(game_id)

        # Stale-cache detection: cached flag is set but only static data exists.
        # Happens when old code called mark_game_cached() inside the seeder, or
        # when a browser seed was aborted after posting just the first batch.
        if cached and db_total <= static_count:
            reset_game_cache(game_id)
            cached = False
            print(f"[seeder] {game_id}: stale cache cleared "
                  f"(had {db_total} ≤ static {static_count}) — will re-seed from PokéAPI")

        if cached and db_total > 0:
            continue  # genuinely complete, nothing to do

        count = seed_game(game_id, game["pokedex_slugs"])
        print(f"[seeder] {game_id}: seeded {count} Pokémon from static data")


def _get_game_total(game_id: str) -> int:
    """Return how many Pokemon are linked to this game in the DB."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT COUNT(*) AS cnt FROM game_pokemon WHERE game_id = ?",
            (game_id,)
        ).fetchone()
        return row["cnt"] if row else 0