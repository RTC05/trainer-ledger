#!/usr/bin/env python3
"""Quick integrity audit for per-game dex data.

Checks:
- duplicate pokemon rows per game
- duplicate dex_number rows per game
- dex_source distribution
- total rows vs expected regional slug size (from static fallback map)
"""

from collections import defaultdict

from config import GAMES
from database import get_db
from seeder import _ids_for_slugs


def main() -> int:
    game_ids = [g["id"] for g in GAMES]
    expected_regional = {g["id"]: len(_ids_for_slugs(g["pokedex_slugs"])) for g in GAMES}

    with get_db() as conn:
        per_game_total = {
            r["game_id"]: r["cnt"]
            for r in conn.execute(
                "SELECT game_id, COUNT(*) AS cnt FROM game_pokemon GROUP BY game_id"
            ).fetchall()
        }

        per_game_source = defaultdict(dict)
        for r in conn.execute(
            """
            SELECT game_id, dex_source, COUNT(*) AS cnt
            FROM game_pokemon
            GROUP BY game_id, dex_source
            ORDER BY game_id, dex_source
            """
        ).fetchall():
            per_game_source[r["game_id"]][r["dex_source"]] = r["cnt"]

        dup_pid = {
            r["game_id"]: r["dups"]
            for r in conn.execute(
                """
                SELECT game_id, COUNT(*) AS dups
                FROM (
                  SELECT game_id, pokemon_id
                  FROM game_pokemon
                  GROUP BY game_id, pokemon_id
                  HAVING COUNT(*) > 1
                ) x
                GROUP BY game_id
                """
            ).fetchall()
        }

        # Duplicate dex numbers are only problematic within the same source
        # bucket (regional/regional or dlc/dlc). Regional vs national can share
        # numbers by design.
        dup_dexnum = {
            r["game_id"]: r["dups"]
            for r in conn.execute(
                """
                SELECT game_id, COUNT(*) AS dups
                FROM (
                  SELECT game_id, dex_source, dex_number
                  FROM game_pokemon
                  GROUP BY game_id, dex_source, dex_number
                  HAVING COUNT(*) > 1
                ) x
                GROUP BY game_id
                """
            ).fetchall()
        }

    print("\n=== PokéDex Audit ===")
    issues = 0
    for gid in game_ids:
        total = per_game_total.get(gid, 0)
        exp = expected_regional.get(gid, 0)
        src = per_game_source.get(gid, {})
        dpid = dup_pid.get(gid, 0)
        ddex = dup_dexnum.get(gid, 0)

        flags = []
        if dpid:
            flags.append(f"dup-pokemon-id:{dpid}")
            issues += 1
        if ddex:
            flags.append(f"dup-dex-number:{ddex}")
            issues += 1
        if total and total < exp:
            flags.append(f"under-expected:{total}<{exp}")
            issues += 1

        flag_txt = " | ".join(flags) if flags else "ok"
        print(f"- {gid:18} total={total:4} expected_regional={exp:4} sources={src} :: {flag_txt}")

    print(f"\nissues_found={issues}")
    return 1 if issues else 0


if __name__ == "__main__":
    raise SystemExit(main())
