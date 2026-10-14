"""routes_stats.py — DV/IV/EV tracker API endpoints."""
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from auth import get_current_user_id
from config import GAMES_BY_ID
from database import get_db, get_pokemon_stats_entry, upsert_pokemon_stats_entry

router = APIRouter(prefix="/api/stats", tags=["stats"])


def _ensure_stats_table() -> None:
    with get_db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS pokemon_stats_tracker (
                user_id      INTEGER NOT NULL,
                game_id      TEXT    NOT NULL,
                pokemon_id   INTEGER NOT NULL,
                stat_system  TEXT    NOT NULL DEFAULT 'iv',
                hp           INTEGER NOT NULL DEFAULT 0,
                attack       INTEGER NOT NULL DEFAULT 0,
                defense      INTEGER NOT NULL DEFAULT 0,
                sp_attack    INTEGER NOT NULL DEFAULT 0,
                sp_defense   INTEGER NOT NULL DEFAULT 0,
                speed        INTEGER NOT NULL DEFAULT 0,
                ev_hp        INTEGER NOT NULL DEFAULT 0,
                ev_attack    INTEGER NOT NULL DEFAULT 0,
                ev_defense   INTEGER NOT NULL DEFAULT 0,
                ev_sp_attack INTEGER NOT NULL DEFAULT 0,
                ev_sp_defense INTEGER NOT NULL DEFAULT 0,
                ev_speed     INTEGER NOT NULL DEFAULT 0,
                updated_at   TEXT    DEFAULT (datetime('now')),
                PRIMARY KEY (user_id, game_id, pokemon_id)
            )
            """
        )


class StatsPayload(BaseModel):
    game_id: str
    pokemon_id: int
    stat_system: str
    hp: int
    attack: int
    defense: int
    sp_attack: int
    sp_defense: int
    speed: int
    ev_hp: int = 0
    ev_attack: int = 0
    ev_defense: int = 0
    ev_sp_attack: int = 0
    ev_sp_defense: int = 0
    ev_speed: int = 0


def _clamp(v: int, lo: int, hi: int) -> int:
    return max(lo, min(hi, int(v)))


def _sanitize(payload: StatsPayload, game_gen: int) -> dict:
    stat_system = "dv" if game_gen <= 2 else "iv"
    stat_max = 15 if stat_system == "dv" else 31
    ev_stat_max = 255 if game_gen >= 3 else 0

    vals = {
        "stat_system": stat_system,
        "hp": _clamp(payload.hp, 0, stat_max),
        "attack": _clamp(payload.attack, 0, stat_max),
        "defense": _clamp(payload.defense, 0, stat_max),
        "sp_attack": _clamp(payload.sp_attack, 0, stat_max),
        "sp_defense": _clamp(payload.sp_defense, 0, stat_max),
        "speed": _clamp(payload.speed, 0, stat_max),
        "ev_hp": _clamp(payload.ev_hp, 0, ev_stat_max),
        "ev_attack": _clamp(payload.ev_attack, 0, ev_stat_max),
        "ev_defense": _clamp(payload.ev_defense, 0, ev_stat_max),
        "ev_sp_attack": _clamp(payload.ev_sp_attack, 0, ev_stat_max),
        "ev_sp_defense": _clamp(payload.ev_sp_defense, 0, ev_stat_max),
        "ev_speed": _clamp(payload.ev_speed, 0, ev_stat_max),
    }

    # Modern EV total cap (Gen 3+) — keep deterministic by trimming from speed backward.
    if game_gen >= 3:
        total = (
            vals["ev_hp"] + vals["ev_attack"] + vals["ev_defense"] +
            vals["ev_sp_attack"] + vals["ev_sp_defense"] + vals["ev_speed"]
        )
        overflow = max(0, total - 510)
        for k in ("ev_speed", "ev_sp_defense", "ev_sp_attack", "ev_defense", "ev_attack", "ev_hp"):
            if overflow <= 0:
                break
            take = min(vals[k], overflow)
            vals[k] -= take
            overflow -= take
    else:
        # No modern EV tracker for Gen 1-2 in this MVP UI.
        vals["ev_hp"] = vals["ev_attack"] = vals["ev_defense"] = 0
        vals["ev_sp_attack"] = vals["ev_sp_defense"] = vals["ev_speed"] = 0

    return vals


@router.get("/{game_id}/{pokemon_id}")
async def get_stats(game_id: str, pokemon_id: int, request: Request):
    _ensure_stats_table()
    uid = get_current_user_id(request)
    if not uid:
        return JSONResponse({"error": "not authenticated"}, status_code=401)
    game = GAMES_BY_ID.get(game_id)
    if not game:
        return JSONResponse({"error": "unknown game"}, status_code=404)

    row = get_pokemon_stats_entry(game_id, pokemon_id, uid)
    if row:
        return JSONResponse({"ok": True, "entry": row, "game_gen": game["gen"]})

    stat_system = "dv" if game["gen"] <= 2 else "iv"
    return JSONResponse({
        "ok": True,
        "game_gen": game["gen"],
        "entry": {
            "game_id": game_id,
            "pokemon_id": pokemon_id,
            "stat_system": stat_system,
            "hp": 0,
            "attack": 0,
            "defense": 0,
            "sp_attack": 0,
            "sp_defense": 0,
            "speed": 0,
            "ev_hp": 0,
            "ev_attack": 0,
            "ev_defense": 0,
            "ev_sp_attack": 0,
            "ev_sp_defense": 0,
            "ev_speed": 0,
        },
    })


@router.post("/save")
async def save_stats(payload: StatsPayload, request: Request):
    _ensure_stats_table()
    uid = get_current_user_id(request)
    if not uid:
        return JSONResponse({"error": "not authenticated"}, status_code=401)
    game = GAMES_BY_ID.get(payload.game_id)
    if not game:
        return JSONResponse({"error": "unknown game"}, status_code=404)

    cleaned = _sanitize(payload, game["gen"])
    upsert_pokemon_stats_entry(
        game_id=payload.game_id,
        pokemon_id=payload.pokemon_id,
        user_id=uid,
        **cleaned,
    )

    return JSONResponse({"ok": True, "entry": {**cleaned, "game_id": payload.game_id, "pokemon_id": payload.pokemon_id}})
