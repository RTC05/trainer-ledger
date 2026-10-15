import json
import os

from typing import Any
from fastapi import FastAPI, Request, BackgroundTasks, Form
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

from starlette.middleware.base import BaseHTTPMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel

from pathlib import Path
from config import GAMES, GAMES_BY_ID
from database import (
    init_db, get_game_pokemon, toggle_caught, toggle_shiny,
    get_game_stats, get_all_game_stats, is_game_cached,
    upsert_pokemon, link_pokemon_to_game, mark_game_cached,
    is_dlc_cached, mark_dlc_cached, get_seeded_ids,
    is_national_cached, mark_national_cached,
    get_single_pokemon_for_game, get_game_notes, set_game_notes,
    get_caught_pokemon_for_builder, get_user_by_id,
    reset_game_seed_state,
    list_changelog_entries, create_feature_suggestion,
    list_feature_suggestions_for_user, ensure_default_changelog_entries,
    create_bug_report, list_bug_reports_for_user,
    get_gym_progress, toggle_gym_challenge,
    mark_all_caught_for_game,
    get_v2_user_state, set_v2_user_state,
)
from auth import get_current_user_id, SESSION_COOKIE
from routes_auth import router as auth_router
from routes_stats import router as stats_router
from routes_api_auth import router as api_auth_router
from pokeapi import get_type_color
from type_history import apply_corrections
from seeder import seed_all_games
from type_chart import build_type_chart_rows
from v2_data import v2_demo_context, v2_game_context

# ── Public paths that don't require authentication ────────────────────────
_PUBLIC_PREFIXES = (
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/about",
    "/privacy",
    "/security",
    "/updates",
    "/support",
    "/v2",
    "/static",
    "/favicon.ico",
    "/health",
    "/livez",
)
_HTMX_PREFIXES   = ("/toggle", "/notes", "/htmx", "/api")

# Region boundaries (national dex number ranges)
_REGIONS = [
    ("Kanto",   1,   151),
    ("Johto",   152, 251),
    ("Hoenn",   252, 386),
    ("Sinnoh",  387, 493),
    ("Unova",   494, 649),
    ("Kalos",   650, 721),
    ("Alola",   722, 809),
    ("Galar",   810, 905),
    ("Paldea",  906, 1025),
]

_REGION_EMOJIS = {
    "Kanto": "🔴", "Johto": "⭐", "Hoenn": "🌊", "Sinnoh": "💎",
    "Unova": "⚫", "Kalos": "🗼", "Alola": "🌺", "Galar": "⚔️", "Paldea": "🎓",
}


def _get_region(dex_number: int) -> str:
    for name, lo, hi in _REGIONS:
        if lo <= dex_number <= hi:
            return name
    return "Unknown"


def _group_by_region(pokemon_list: list[dict]) -> list[dict]:
    """Return list of {region, emoji, pokemon, caught, total} dicts in dex order."""
    buckets: dict[str, list[dict]] = {}
    for p in pokemon_list:
        r = _get_region(p["dex_number"])
        buckets.setdefault(r, []).append(p)
    # Preserve the canonical region order
    result = []
    for name, _, __ in _REGIONS:
        pokes = buckets.get(name, [])
        caught = sum(1 for p in pokes if p["caught"])
        result.append({
            "region": name,
            "emoji": _REGION_EMOJIS.get(name, "🌍"),
            "pokemon": pokes,
            "caught": caught,
            "total": len(pokes),
        })
    return result


def _cart_imgs(game_id: str) -> tuple[str, str | None]:
    """Return (primary_url, secondary_url | None) for a game's cartridge art."""
    base = Path("static/carts") / game_id
    primary = None
    for ext in (".png", ".jpg", ".jpeg"):
        if base.with_suffix(ext).exists():
            primary = f"/static/carts/{game_id}{ext}"
            break
    if primary is None:
        primary = f"/static/carts/{game_id}.svg"

    secondary = None
    base_b = Path("static/carts") / f"{game_id}-b"
    for ext in (".png", ".jpg", ".jpeg"):
        if base_b.with_suffix(ext).exists():
            secondary = f"/static/carts/{game_id}-b{ext}"
            break

    return primary, secondary


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    ensure_default_changelog_entries()
    # Startup must stay fast on Railway. Heavy seeding can cause the
    # deployment healthcheck window to fail. Keep it opt-in.
    if os.getenv("SEED_ON_STARTUP", "0") == "1":
        seed_all_games(GAMES)
    yield


app = FastAPI(title="Trainer Ledger", lifespan=lifespan)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(auth_router)
app.include_router(stats_router)
app.include_router(api_auth_router)
from app_templates import (  # noqa: E402
    templates,
    app_version  as _app_version,
    css_version  as _css_version,
    js_version   as _js_version,
)


class _AuthMiddleware(BaseHTTPMiddleware):
    """Redirect unauthenticated users to /login for protected pages."""
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        if any(path.startswith(p) for p in _PUBLIC_PREFIXES):
            return await call_next(request)
        uid = get_current_user_id(request)
        if uid is None:
            # HTMX/API calls — return 401 so the browser can handle it
            if any(path.startswith(p) for p in _HTMX_PREFIXES):
                return JSONResponse({"error": "not authenticated"}, status_code=401)
            return RedirectResponse("/login", status_code=302)
        response = await call_next(request)
        # Prevent browsers from caching HTML pages.
        # Inline JS (loadDex, loadDLC) lives inside the HTML and changes on
        # every deploy — a stale cached page would run the old code silently.
        ct = response.headers.get("content-type", "")
        if ct.startswith("text/html"):
            response.headers["Cache-Control"] = "no-store, must-revalidate"
            response.headers["Pragma"]        = "no-cache"
            response.headers["Expires"]       = "0"
        return response

app.add_middleware(_AuthMiddleware)

# All versioned asset hashes and the shared Jinja2 env are set up in
# app_templates.py — imported above. Nothing to configure here.


def _relative_time(dt_str: str | None) -> str:
    """Turn a UTC datetime string into a human-friendly relative label."""
    if not dt_str:
        return ""
    from datetime import datetime, timezone
    try:
        dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
        diff = datetime.now(timezone.utc) - dt
        s = int(diff.total_seconds())
        if s < 60:           return "just now"
        if s < 3600:         return f"{s // 60}m ago"
        if s < 86400:        return f"{s // 3600}h ago"
        if s < 86400 * 7:    return f"{s // 86400}d ago"
        if s < 86400 * 30:   return f"{s // (86400 * 7)}w ago"
        if s < 86400 * 365:  return f"{s // (86400 * 30)}mo ago"
        return f"{s // (86400 * 365)}y ago"
    except ValueError:
        return ""


templates.env.filters["relative_time"] = _relative_time


class PokemonEntry(BaseModel):
    id: int
    dex_number: int
    name: str
    sprite_url: str = ""
    sprite_shiny_url: str = ""
    types: list[str] = []
    height: int | None = None
    weight: int | None = None
    base_experience: int | None = None
    hp: int | None = None
    attack: int | None = None
    defense: int | None = None
    sp_attack: int | None = None
    sp_defense: int | None = None
    speed: int | None = None
    in_regional_dex: bool = True
    dex_source: str = "regional"


class SeedBatch(BaseModel):
    game_id: str
    pokemon: list[PokemonEntry]


class V2StatePayload(BaseModel):
    state: dict[str, Any]


# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────

def _current_user(request: Request) -> dict | None:
    """Fetch the logged-in user dict for template context (or None)."""
    uid = get_current_user_id(request)
    return get_user_by_id(uid) if uid else None


def _global_dash(all_stats: dict, games_with_stats: list[dict]) -> dict:
    """Compute hero dashboard numbers for the index page."""
    total_caught   = sum(v["caught"] for v in all_stats.values())
    total_shiny    = sum(v.get("shiny", 0) for v in all_stats.values())
    total_possible = sum(v["total"]  for v in all_stats.values())
    overall_pct    = round((total_caught / total_possible) * 100, 1) if total_possible else 0
    games_with_data = [g for g in games_with_stats if g["total"] > 0]

    best = max(
        games_with_data,
        key=lambda g: g["caught"] / g["total"] if g["total"] else 0,
        default=None,
    )
    most_missing = max(
        games_with_data,
        key=lambda g: g["total"] - g["caught"],
        default=None,
    )

    return {
        "caught":        total_caught,
        "shiny":         total_shiny,
        "total":         total_possible,
        "pct":           overall_pct,
        "games_tracked": len(games_with_data),
        "total_games":   len(games_with_stats),
        "best":          best,
        "most_missing":  most_missing,
    }


def _public_site_context() -> dict[str, Any]:
    """Shared public-facing links and support settings."""
    patreon_url = os.getenv("PATREON_URL", "https://www.patreon.com/cw/RTC05").strip()
    one_time_url = os.getenv("STRIPE_DONATE_URL", "").strip()
    monthly_url = os.getenv("STRIPE_MONTHLY_URL", "").strip()
    support_email = os.getenv("SUPPORT_EMAIL", "hello@trainerledger.com").strip()
    public_url = os.getenv("PUBLIC_BASE_URL", "").strip()

    support_actions = [
        {
            "label": "Join on Patreon",
            "href": patreon_url,
            "kind": "patreon",
            "description": "Support the tracker directly on Patreon and help fund hosting, guides, and long-term updates.",
            "enabled": bool(patreon_url),
        },
        {
            "label": "One-Time Support",
            "href": one_time_url,
            "kind": "donate",
            "description": "Help pay for hosting, new guide data, and faster updates.",
            "enabled": bool(one_time_url),
        },
        {
            "label": "Monthly Support",
            "href": monthly_url,
            "kind": "monthly",
            "description": "Back the project long-term and support ongoing regional guide work.",
            "enabled": bool(monthly_url),
        },
        {
            "label": "Email the Project",
            "href": f"mailto:{support_email}",
            "kind": "contact",
            "description": "Reach out about feedback, partnerships, or support questions.",
            "enabled": True,
        },
    ]

    return {
        "public_url": public_url,
        "patreon_url": patreon_url,
        "support_email": support_email,
        "support_actions": support_actions,
        "donations_enabled": any(
            action["enabled"]
            for action in support_actions
            if action["kind"] in {"patreon", "donate", "monthly"}
        ),
    }


# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

@app.get("/livez")
async def livez():
    """Minimal liveness probe: no DB, no external calls."""
    return {"ok": True}


@app.get("/health")
async def health_check():
    """Public debug endpoint — shows app version + DB state.
    Use this to confirm which code is running on any machine."""
    import urllib.request
    from database import get_db

    # ── 1. PokeAPI reachability ──────────────────────────────────────────
    try:
        urllib.request.urlopen("https://pokeapi.co/api/v2/pokemon/1", timeout=4)
        pokeapi_reachable = True
    except Exception:
        pokeapi_reachable = False

    # ── 2. Per-game DB stats ─────────────────────────────────────────────
    with get_db() as conn:
        game_rows = conn.execute("""
            SELECT gp.game_id,
                   COUNT(*) AS total,
                   SUM(CASE WHEN gp.dex_source='regional' THEN 1 ELSE 0 END) AS regional,
                   SUM(CASE WHEN gp.dex_source='dlc' THEN 1 ELSE 0 END) AS dlc,
                   MAX(cm.value) AS cached
            FROM game_pokemon gp
            LEFT JOIN cache_meta cm
                   ON cm.key = 'game_cached_' || gp.game_id
            GROUP BY gp.game_id
            ORDER BY gp.game_id
        """).fetchall()
        user_count = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]

    games = [
        {
            "game_id": r["game_id"],
            "total":   r["total"],
            "regional": r["regional"],
            "dlc":     r["dlc"],
            "cached":  bool(r["cached"]),
        }
        for r in game_rows
    ]

    return JSONResponse({
        "app_version":       _app_version,
        "css_version":       _css_version,
        "js_version":        _js_version,
        "pokeapi_reachable": pokeapi_reachable,
        "users":             user_count,
        "games":             games,
    })


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    uid       = get_current_user_id(request)
    all_stats = get_all_game_stats(uid)
    games_with_stats = []
    for game in GAMES:
        stats  = all_stats.get(game["id"], {"total": 0, "caught": 0})
        cached = is_game_cached(game["id"])
        cart_a, cart_b = _cart_imgs(game["id"])
        games_with_stats.append({
            **game, **stats, "cached": cached,
            "cart_img": cart_a, "cart_img_b": cart_b,
        })
    return templates.TemplateResponse(request, "index.html", {
        "games":        games_with_stats,
        "dash":         _global_dash(all_stats, games_with_stats),
        "current_user": _current_user(request),
        **_public_site_context(),
    })


@app.get("/support", response_class=HTMLResponse)
async def support_page(request: Request):
    return templates.TemplateResponse(request, "support.html", {
        "current_user": _current_user(request),
        **_public_site_context(),
    })


@app.get("/about", response_class=HTMLResponse)
async def about_page(request: Request):
    return templates.TemplateResponse(request, "about.html", {
        "current_user": _current_user(request),
        **_public_site_context(),
    })


@app.get("/privacy", response_class=HTMLResponse)
async def privacy_page(request: Request):
    return templates.TemplateResponse(request, "privacy.html", {
        "current_user": _current_user(request),
        **_public_site_context(),
    })


@app.get("/security", response_class=HTMLResponse)
async def security_page(request: Request):
    return templates.TemplateResponse(request, "security.html", {
        "current_user": _current_user(request),
        **_public_site_context(),
    })


@app.get("/updates", response_class=HTMLResponse)
async def updates_page(request: Request):
    uid = get_current_user_id(request)
    my_suggestions = list_feature_suggestions_for_user(uid) if uid else []
    my_bug_reports = list_bug_reports_for_user(uid) if uid else []
    return templates.TemplateResponse(request, "updates.html", {
        "entries": list_changelog_entries(),
        "my_suggestions": my_suggestions,
        "my_bug_reports": my_bug_reports,
        "current_user": _current_user(request),
        "message": None,
        **_public_site_context(),
    })


@app.get("/v2", response_class=HTMLResponse)
async def v2_preview(request: Request):
    return templates.TemplateResponse(request, "v2_preview.html", {
        **v2_demo_context(),
        "current_user": _current_user(request),
    })


@app.post("/v2/suggest")
async def submit_v2_suggestion(
    request: Request,
    title: str = Form(...),
    details: str = Form(...),
):
    uid = get_current_user_id(request)
    if not uid:
        return RedirectResponse("/login", status_code=302)

    title = title.strip()
    details = details.strip()
    if len(title) >= 4 and len(details) >= 10:
        create_feature_suggestion(uid, f"[V2] {title}", details)
    return RedirectResponse(request.headers.get("referer") or "/v2", status_code=302)


@app.get("/api/v2/state/{game_id}")
async def get_v2_state(request: Request, game_id: str):
    uid = get_current_user_id(request)
    if uid is None:
        return JSONResponse({"error": "not authenticated"}, status_code=401)
    return JSONResponse({
        "game_id": game_id,
        "state": get_v2_user_state(game_id, uid),
    })


@app.post("/api/v2/state/{game_id}")
async def save_v2_state(request: Request, game_id: str, payload: V2StatePayload):
    uid = get_current_user_id(request)
    if uid is None:
        return JSONResponse({"error": "not authenticated"}, status_code=401)
    set_v2_user_state(game_id, payload.state, uid)
    return JSONResponse({"ok": True, "game_id": game_id})


@app.get("/v2/game/{game_id}", response_class=HTMLResponse)
async def v2_game_preview(request: Request, game_id: str):
    context = v2_game_context(game_id)
    if context is None:
        return RedirectResponse("/v2", status_code=302)
    return templates.TemplateResponse(request, "v2_game_preview.html", {
        **context,
        "current_user": _current_user(request),
    })


@app.post("/updates/suggest")
async def submit_feature_suggestion(
    request: Request,
    title: str = Form(...),
    details: str = Form(...),
):
    uid = get_current_user_id(request)
    if not uid:
        return RedirectResponse("/login", status_code=302)

    title = title.strip()
    details = details.strip()
    if len(title) < 4 or len(details) < 10:
        return templates.TemplateResponse(request, "updates.html", {
            "entries": list_changelog_entries(),
            "my_suggestions": list_feature_suggestions_for_user(uid),
            "my_bug_reports": list_bug_reports_for_user(uid),
            "current_user": _current_user(request),
            "message": "Please add a clear title (4+ chars) and details (10+ chars).",
        })

    create_feature_suggestion(uid, title, details)
    return RedirectResponse("/updates", status_code=302)


@app.post("/updates/report-bug")
async def submit_bug_report(
    request: Request,
    title: str = Form(...),
    details: str = Form(...),
):
    uid = get_current_user_id(request)
    if not uid:
        return RedirectResponse("/login", status_code=302)

    title = title.strip()
    details = details.strip()
    if len(title) < 4 or len(details) < 10:
        return templates.TemplateResponse(request, "updates.html", {
            "entries": list_changelog_entries(),
            "my_suggestions": list_feature_suggestions_for_user(uid),
            "my_bug_reports": list_bug_reports_for_user(uid),
            "current_user": _current_user(request),
            "message": "Please add a clear bug title (4+ chars) and details (10+ chars).",
        })

    create_bug_report(uid, title, details)
    return RedirectResponse("/updates", status_code=302)


@app.get("/game/{game_id}", response_class=HTMLResponse)
async def game_view(request: Request, game_id: str,
                    filter: str = "all", search: str = "",
                    dex_mode: str = "regional"):
    game = GAMES_BY_ID.get(game_id)
    if not game:
        return HTMLResponse("<h1>Game not found</h1>", status_code=404)

    uid         = get_current_user_id(request)
    cached      = is_game_cached(game_id)
    dlc_config  = game.get("dlc", [])            # list of {id, name, slug}
    dlc_cached  = is_dlc_cached(game_id) if dlc_config else False
    # dex_mode guard-rails:
    # - "all" only valid once DLC is cached
    # - "national" only valid for games that expose national_max_id
    # - anything unrecognised → regional
    has_national_dex = bool(game.get("national_max_id"))
    national_cached = is_national_cached(game_id) if has_national_dex else False
    if dex_mode == "all" and not dlc_cached:
        dex_mode = "regional"
    elif dex_mode == "national" and (not has_national_dex or not national_cached):
        dex_mode = "regional"
    elif dex_mode not in ("regional", "all", "national"):
        dex_mode = "regional"

    pokemon_list = []
    if cached:
        all_poke = get_game_pokemon(
            game_id,
            uid,
            dex_mode=dex_mode,
            national_max_id=game.get("national_max_id"),
            regional_max_id=game.get("regional_max_id"),
        )
        for p in all_poke:
            p["types"]      = json.loads(p["types"])
            p["type_colors"] = [get_type_color(t) for t in p["types"]]
        apply_corrections(all_poke, game["gen"])
        if search:
            s        = search.lower()
            all_poke = [p for p in all_poke
                        if s in p["name"].lower() or s in str(p["dex_number"])]
        if filter == "caught":
            all_poke = [p for p in all_poke if p["caught"]]
        elif filter == "uncaught":
            all_poke = [p for p in all_poke if not p["caught"]]
        pokemon_list = all_poke

    stats           = get_game_stats(
        game_id,
        uid,
        dex_mode=dex_mode,
        national_max_id=game.get("national_max_id"),
        regional_max_id=game.get("regional_max_id"),
    )
    grouped_regions = _group_by_region(pokemon_list) if (game.get("grouped_by_region") and cached) else None
    type_chart_rows = build_type_chart_rows(game["gen"])

    return templates.TemplateResponse(request, "game.html", {
        "game":              game,
        "cart_img":          _cart_imgs(game_id)[0],
        "cart_img_b":        _cart_imgs(game_id)[1],
        "pokemon_list":      pokemon_list,
        "grouped_regions":   grouped_regions,
        "cached":            cached,
        "stats":             stats,
        "notes":             get_game_notes(game_id, uid),
        "active_filter":     filter,
        "search":            search,
        "dex_mode":          dex_mode,
        "dlc_config":        dlc_config,
        "dlc_cached":        dlc_cached,
        "national_cached":   national_cached,
        "national_max_id":   game.get("national_max_id"),
        "custom_note":       game.get("custom_note", ""),
        "pokedex_slugs_json": json.dumps(game["pokedex_slugs"]),
        "dlc_json":          json.dumps(dlc_config),
        "has_national_dex":  has_national_dex,
        "type_chart_rows":   type_chart_rows,
        "current_user":      _current_user(request),
    })


# ─────────────────────────────────────────────
# Browser-side seed API
# The browser fetches from PokéAPI and posts here.
# ─────────────────────────────────────────────

@app.post("/api/seed/batch")
async def seed_batch(batch: SeedBatch):
    """Accept a batch of Pokemon fetched by the browser and save to SQLite."""
    game_id = batch.game_id
    if game_id not in GAMES_BY_ID:
        return JSONResponse({"error": "unknown game"}, status_code=404)

    for p in batch.pokemon:
        upsert_pokemon({
            "id": p.id,
            "name": p.name,
            "sprite_url": p.sprite_url,
            "sprite_shiny_url": p.sprite_shiny_url,
            "types": json.dumps(p.types),
            "height": p.height,
            "weight": p.weight,
            "base_experience": p.base_experience,
            "hp": p.hp,
            "attack": p.attack,
            "defense": p.defense,
            "sp_attack": p.sp_attack,
            "sp_defense": p.sp_defense,
            "speed": p.speed,
            "generation": None,
        })
        link_pokemon_to_game(
            game_id,
            p.id,
            p.dex_number,
            in_regional_dex=1 if p.in_regional_dex else 0,
            dex_source=p.dex_source,
        )

    return JSONResponse({"saved": len(batch.pokemon)})


@app.post("/api/seed/{game_id}/dlc-complete")
async def dlc_seed_complete(game_id: str, request: Request):
    """Mark a game's DLC as fully loaded."""
    if game_id not in GAMES_BY_ID:
        return JSONResponse({"error": "unknown game"}, status_code=404)
    mark_dlc_cached(game_id)
    return JSONResponse({"ok": True})




@app.post("/api/seed/{game_id}/national-complete")
async def national_seed_complete(game_id: str, request: Request):
    """Mark a game's National Dex as fully loaded."""
    if game_id not in GAMES_BY_ID:
        return JSONResponse({"error": "unknown game"}, status_code=404)
    mark_national_cached(game_id)
    return JSONResponse({"ok": True})

@app.post("/api/seed/{game_id}/reset")
async def seed_reset(game_id: str, request: Request):
    """Reset a game's seeded dex data and cache flags.

    Safe repair endpoint when a dex was partially/corruptly seeded.
    """
    if game_id not in GAMES_BY_ID:
        return JSONResponse({"error": "unknown game"}, status_code=404)
    reset_game_seed_state(game_id)
    return JSONResponse({"ok": True})


@app.post("/api/seed/{game_id}/complete")
async def seed_complete(game_id: str, request: Request):
    """Mark a game's pokedex as fully loaded."""
    if game_id not in GAMES_BY_ID:
        return JSONResponse({"error": "unknown game"}, status_code=404)
    uid   = get_current_user_id(request)
    stats = get_game_stats(game_id, uid)
    if stats["total"] > 0:
        mark_game_cached(game_id)
        return JSONResponse({"ok": True, "total": stats["total"]})
    return JSONResponse({"ok": False, "reason": "no pokemon saved yet"})


@app.post("/toggle/{game_id}/{pokemon_id}")
async def toggle(game_id: str, pokemon_id: int, request: Request):
    uid  = get_current_user_id(request)
    game = GAMES_BY_ID.get(game_id, {})
    if game.get("gen") == 10:
        return HTMLResponse("Gen 10 tracking is not available yet.", status_code=403)

    toggle_caught(game_id, pokemon_id, uid)
    p = get_single_pokemon_for_game(game_id, pokemon_id, uid)
    if not p:
        return HTMLResponse("", status_code=204)
    p["types"]      = json.loads(p["types"])
    p["type_colors"] = [get_type_color(t) for t in p["types"]]
    apply_corrections([p], game.get("gen", 99))
    return templates.TemplateResponse(request, "partials/poke_card.html", {"p": p, "game": game})


@app.post("/toggle-shiny/{game_id}/{pokemon_id}")
async def toggle_shiny_route(game_id: str, pokemon_id: int, request: Request):
    uid  = get_current_user_id(request)
    game = GAMES_BY_ID.get(game_id, {})
    if game.get("gen") == 10:
        return HTMLResponse("Gen 10 tracking is not available yet.", status_code=403)

    toggle_shiny(game_id, pokemon_id, uid)
    p = get_single_pokemon_for_game(game_id, pokemon_id, uid)
    if not p:
        return HTMLResponse("", status_code=204)
    p["types"]      = json.loads(p["types"])
    p["type_colors"] = [get_type_color(t) for t in p["types"]]
    apply_corrections([p], game.get("gen", 99))
    return templates.TemplateResponse(request, "partials/poke_card.html", {"p": p, "game": game})


@app.post("/game/{game_id}/mark-all-caught")
async def mark_all_caught(game_id: str, request: Request):
    game = GAMES_BY_ID.get(game_id)
    if not game:
        return JSONResponse({"error": "unknown game"}, status_code=404)
    if game.get("gen") == 10:
        return JSONResponse({"error": "Gen 10 tracking is not available yet."}, status_code=403)

    uid = get_current_user_id(request)
    changed = mark_all_caught_for_game(game_id, uid)
    return JSONResponse({"ok": True, "changed": changed})


@app.post("/notes/{game_id}")
async def save_notes(game_id: str, request: Request, notes: str = Form(default="")):
    uid = get_current_user_id(request)
    set_game_notes(game_id, notes, uid)
    return HTMLResponse('<span id="notes-saved" class="notes-saved-flash">Saved ✔</span>')


@app.get("/team-builder/{game_id}", response_class=HTMLResponse)
async def team_builder(request: Request, game_id: str):
    game = GAMES_BY_ID.get(game_id)
    if not game:
        return HTMLResponse("<h1>Game not found</h1>", status_code=404)
    cached = is_game_cached(game_id)
    return templates.TemplateResponse(request, "team_builder.html", {
        "game":         game,
        "cached":       cached,
        "cart_img":     _cart_imgs(game_id)[0],
        "current_user": _current_user(request),
    })


@app.get("/api/game/{game_id}/seeded-ids")
async def api_seeded_ids(game_id: str):
    """Return all pokemon IDs already seeded for this game.

    Used by the browser DLC seeder so it doesn't re-fetch pokemon
    that are already in the regional dex.
    """
    if game_id not in GAMES_BY_ID:
        return JSONResponse({"error": "unknown game"}, status_code=404)
    ids = get_seeded_ids(game_id)
    return JSONResponse({"ids": ids})


@app.get("/api/game/{game_id}/caught")
async def api_caught(game_id: str, request: Request):
    """Return caught Pokémon as JSON for the team builder."""
    if game_id not in GAMES_BY_ID:
        return JSONResponse({"error": "unknown game"}, status_code=404)
    uid  = get_current_user_id(request)
    rows = get_caught_pokemon_for_builder(game_id, uid)
    for r in rows:
        r["types"] = json.loads(r["types"])
    return JSONResponse(rows)


@app.get("/api/game/{game_id}/gym-progress")
async def api_gym_progress(game_id: str, request: Request):
    """Return completed gym/challenge IDs for this user+game."""
    if game_id not in GAMES_BY_ID:
        return JSONResponse({"error": "unknown game"}, status_code=404)
    uid = get_current_user_id(request)
    return JSONResponse({"completed": get_gym_progress(game_id, uid)})


@app.post("/api/game/{game_id}/gym-progress/{challenge_id:path}")
async def api_toggle_gym_progress(game_id: str, challenge_id: str, request: Request):
    """Toggle completion of one gym/trial/challenge entry."""
    if game_id not in GAMES_BY_ID:
        return JSONResponse({"error": "unknown game"}, status_code=404)
    uid = get_current_user_id(request)
    completed = toggle_gym_challenge(game_id, challenge_id, uid)
    return JSONResponse({"ok": True, "completed": completed})


@app.get("/htmx/game/{game_id}/pokemon", response_class=HTMLResponse)
async def htmx_pokemon_grid(request: Request, game_id: str,
                             filter: str = "all", search: str = ""):
    """HTMX endpoint — returns just the pokemon grid fragment."""
    uid    = get_current_user_id(request)
    cached = is_game_cached(game_id)
    if not cached:
        return HTMLResponse('<p class="text-center text-gray-400 py-8">Still loading...</p>')

    all_poke = get_game_pokemon(game_id, uid)
    for p in all_poke:
        p["types"]      = json.loads(p["types"])
        p["type_colors"] = [get_type_color(t) for t in p["types"]]
    game = GAMES_BY_ID[game_id]
    apply_corrections(all_poke, game["gen"])  # fix historical types server-side

    if search:
        s        = search.lower()
        all_poke = [p for p in all_poke
                    if s in p["name"].lower() or s in str(p["dex_number"])]
    if filter == "caught":
        all_poke = [p for p in all_poke if p["caught"]]
    elif filter == "uncaught":
        all_poke = [p for p in all_poke if not p["caught"]]

    grouped_regions = _group_by_region(all_poke) if game.get("grouped_by_region") else None
    return templates.TemplateResponse(request, "partials/pokemon_grid.html", {
        "pokemon_list":    all_poke,
        "grouped_regions": grouped_regions,
        "game":            game,
    })
