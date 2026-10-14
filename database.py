import sqlite3
import os
import json
import secrets
from contextlib import contextmanager
from pathlib import Path

# DATA_DIR lets Railway (or any host) redirect the DB to a persistent volume.
# Locally it just lives next to this file.
_DATA_DIR_RAW = Path(os.getenv("DATA_DIR", str(Path(__file__).parent)))
try:
    _DATA_DIR_RAW.mkdir(parents=True, exist_ok=True)   # ensure volume mount path exists
    _DATA_DIR = _DATA_DIR_RAW
except OSError:
    # Fallback: if volume mount path is briefly unavailable/read-only during
    # container startup, don't crash the whole app.
    _DATA_DIR = Path("/tmp/pokedex-data")
    _DATA_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[db] ⚠️  Could not use DATA_DIR={_DATA_DIR_RAW}; falling back to {_DATA_DIR}")
DB_PATH = _DATA_DIR / "pokedex.db"

# Final guard: verify sqlite can actually open/write this DB path.
# If volume exists but is unusable, fallback to /tmp so app still starts.
try:
    _probe = sqlite3.connect(DB_PATH)
    _probe.execute("PRAGMA journal_mode=WAL")
    _probe.close()
except Exception as e:
    _fallback_dir = Path("/tmp/pokedex-data")
    _fallback_dir.mkdir(parents=True, exist_ok=True)
    _DATA_DIR = _fallback_dir
    DB_PATH = _DATA_DIR / "pokedex.db"
    print(f"[db] ⚠️  DB path probe failed ({e}); falling back to {DB_PATH}")

# Startup diagnostic — visible in `railway logs` so we can confirm the DB
# is landing on the persistent volume and not on ephemeral container storage.
_db_existed = DB_PATH.exists()
print(f"[db] DATA_DIR  = {_DATA_DIR}")
print(f"[db] DB_PATH   = {DB_PATH}")
print(f"[db] DB exists = {_db_existed} {'✅ (data will persist)' if _db_existed else '🆕 (fresh database)'}")
if not _db_existed and os.getenv("DATA_DIR"):
    print("[db] ⚠️  DATA_DIR is set but no existing DB found — volume may be new or unmounted")


@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with get_db() as conn:
        # ── Static tables (PokéAPI cache — never wiped) ──────────────────────
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS pokemon (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                sprite_url TEXT,
                sprite_shiny_url TEXT,
                types TEXT NOT NULL DEFAULT '[]',
                height INTEGER,
                weight INTEGER,
                base_experience INTEGER,
                hp INTEGER,
                attack INTEGER,
                defense INTEGER,
                sp_attack INTEGER,
                sp_defense INTEGER,
                speed INTEGER,
                generation INTEGER,
                is_cached INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS game_pokemon (
                game_id          TEXT    NOT NULL,
                pokemon_id       INTEGER NOT NULL,
                dex_number       INTEGER,
                in_regional_dex  INTEGER NOT NULL DEFAULT 1,
                dex_source       TEXT    NOT NULL DEFAULT 'regional',
                PRIMARY KEY (game_id, pokemon_id)
            );

            CREATE TABLE IF NOT EXISTS cache_meta (
                key TEXT PRIMARY KEY,
                value TEXT
            );
        """)

        # ── User-scoped tables ────────────────────────────────────────────────
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                username      TEXT    NOT NULL UNIQUE COLLATE NOCASE,
                email         TEXT    UNIQUE COLLATE NOCASE,
                password_hash TEXT    NOT NULL,
                is_admin      INTEGER NOT NULL DEFAULT 0,
                created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS caught_pokemon (
                user_id      INTEGER NOT NULL,
                game_id      TEXT    NOT NULL,
                pokemon_id   INTEGER NOT NULL,
                caught       INTEGER DEFAULT 0,
                shiny        INTEGER DEFAULT 0,
                last_updated TEXT    DEFAULT (datetime('now')),
                PRIMARY KEY (user_id, game_id, pokemon_id)
            );

            CREATE TABLE IF NOT EXISTS game_notes (
                user_id    INTEGER NOT NULL,
                game_id    TEXT    NOT NULL,
                notes      TEXT    NOT NULL DEFAULT '',
                updated_at TEXT    DEFAULT (datetime('now')),
                PRIMARY KEY (user_id, game_id)
            );

            CREATE TABLE IF NOT EXISTS changelog_entries (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                title       TEXT NOT NULL,
                body        TEXT NOT NULL,
                created_at  TEXT NOT NULL DEFAULT (datetime('now')),
                created_by  INTEGER
            );

            CREATE TABLE IF NOT EXISTS feature_suggestions (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id      INTEGER NOT NULL,
                title        TEXT NOT NULL,
                details      TEXT NOT NULL,
                status       TEXT NOT NULL DEFAULT 'new',
                created_at   TEXT NOT NULL DEFAULT (datetime('now')),
                reviewed_at  TEXT,
                reviewed_by  INTEGER
            );

            CREATE TABLE IF NOT EXISTS gym_progress (
                user_id      INTEGER NOT NULL,
                game_id      TEXT NOT NULL,
                challenge_id TEXT NOT NULL,
                completed    INTEGER NOT NULL DEFAULT 0,
                updated_at   TEXT NOT NULL DEFAULT (datetime('now')),
                PRIMARY KEY (user_id, game_id, challenge_id)
            );

            CREATE TABLE IF NOT EXISTS bug_reports (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id      INTEGER NOT NULL,
                title        TEXT NOT NULL,
                details      TEXT NOT NULL,
                status       TEXT NOT NULL DEFAULT 'new',
                created_at   TEXT NOT NULL DEFAULT (datetime('now')),
                reviewed_at  TEXT,
                reviewed_by  INTEGER
            );

            CREATE TABLE IF NOT EXISTS v2_user_state (
                user_id      INTEGER NOT NULL,
                game_id      TEXT NOT NULL,
                state_json   TEXT NOT NULL DEFAULT '{}',
                updated_at   TEXT NOT NULL DEFAULT (datetime('now')),
                PRIMARY KEY (user_id, game_id)
            );

            CREATE TABLE IF NOT EXISTS password_reset_tokens (
                token        TEXT PRIMARY KEY,
                user_id      INTEGER NOT NULL,
                created_at   TEXT NOT NULL DEFAULT (datetime('now')),
                used_at      TEXT
            );
        """)

        # ── Non-destructive migration: game_pokemon columns ───────────────────
        gp_cols = {r[1] for r in conn.execute("PRAGMA table_info(game_pokemon)")}
        if "in_regional_dex" not in gp_cols:
            conn.execute("ALTER TABLE game_pokemon ADD COLUMN in_regional_dex INTEGER NOT NULL DEFAULT 1")
        if "dex_source" not in gp_cols:
            conn.execute("ALTER TABLE game_pokemon ADD COLUMN dex_source TEXT NOT NULL DEFAULT 'regional'")
            conn.execute("""
                UPDATE game_pokemon
                SET dex_source = CASE
                    WHEN in_regional_dex = 1 THEN 'regional'
                    ELSE 'dlc'
                END
                WHERE dex_source IS NULL OR dex_source = ''
            """)

        # ── Data repair: normalize duplicate regional dex numbers per game ─────
        # Some PokéAPI dex payloads contain repeated entry_number values.
        # If a game has duplicate dex_number among regional rows, rewrite those
        # regional rows to a stable 1..N sequence in current order.
        dup_games = conn.execute("""
            SELECT game_id
            FROM game_pokemon
            WHERE dex_source = 'regional'
            GROUP BY game_id
            HAVING COUNT(*) != COUNT(DISTINCT dex_number)
        """).fetchall()
        for r in dup_games:
            gid = r["game_id"]
            rows = conn.execute(
                """
                SELECT pokemon_id
                FROM game_pokemon
                WHERE game_id = ? AND dex_source = 'regional'
                ORDER BY dex_number, pokemon_id
                """,
                (gid,),
            ).fetchall()
            for idx, rr in enumerate(rows, start=1):
                conn.execute(
                    """
                    UPDATE game_pokemon
                    SET dex_number = ?
                    WHERE game_id = ? AND pokemon_id = ?
                    """,
                    (idx, gid, rr["pokemon_id"]),
                )

        # ── Non-destructive migration: add user_id if old schema exists ───────
        cols = {r[1] for r in conn.execute("PRAGMA table_info(caught_pokemon)")}
        if "user_id" not in cols:
            # Old single-user schema — drop and recreate
            conn.executescript("""
                DROP TABLE IF EXISTS caught_pokemon;
                DROP TABLE IF EXISTS game_notes;
                CREATE TABLE caught_pokemon (
                    user_id INTEGER NOT NULL, game_id TEXT NOT NULL,
                    pokemon_id INTEGER NOT NULL, caught INTEGER DEFAULT 0,
                    shiny INTEGER DEFAULT 0,
                    last_updated TEXT DEFAULT (datetime('now')),
                    PRIMARY KEY (user_id, game_id, pokemon_id)
                );
                CREATE TABLE game_notes (
                    user_id INTEGER NOT NULL, game_id TEXT NOT NULL,
                    notes TEXT NOT NULL DEFAULT '',
                    updated_at TEXT DEFAULT (datetime('now')),
                    PRIMARY KEY (user_id, game_id)
                );
            """)

        user_cols = {r[1] for r in conn.execute("PRAGMA table_info(users)")}
        if "email" not in user_cols:
            conn.execute("ALTER TABLE users ADD COLUMN email TEXT")


# ── User management ────────────────────────────────────────────────────────────
def create_user(username: str, password_hash: str, is_admin: bool = False, email: str | None = None) -> int:
    with get_db() as conn:
        cur = conn.execute(
            "INSERT INTO users (username, email, password_hash, is_admin) VALUES (?, ?, ?, ?)",
            (username, (email or "").strip() or None, password_hash, 1 if is_admin else 0),
        )
        return cur.lastrowid

def get_user_by_username(username: str) -> dict | None:
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM users WHERE username = ? COLLATE NOCASE", (username,)
        ).fetchone()
        return dict(row) if row else None

def get_user_by_email(email: str) -> dict | None:
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM users WHERE email = ? COLLATE NOCASE", (email.strip(),)
        ).fetchone()
        return dict(row) if row else None

def get_user_by_id(user_id: int) -> dict | None:
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM users WHERE id = ?", (user_id,)
        ).fetchone()
        return dict(row) if row else None

def count_users() -> int:
    with get_db() as conn:
        return conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]

def get_all_users() -> list[dict]:
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, username, is_admin, created_at FROM users ORDER BY id"
        ).fetchall()
        return [dict(r) for r in rows]

def delete_user(user_id: int) -> None:
    with get_db() as conn:
        conn.execute("DELETE FROM caught_pokemon WHERE user_id = ?", (user_id,))
        conn.execute("DELETE FROM game_notes WHERE user_id = ?", (user_id,))
        conn.execute("DELETE FROM pokemon_stats_tracker WHERE user_id = ?", (user_id,))
        conn.execute("DELETE FROM users WHERE id = ?", (user_id,))

def update_user_password(user_id: int, new_hash: str) -> None:
    with get_db() as conn:
        conn.execute(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            (new_hash, user_id)
        )


def update_user_email(user_id: int, email: str | None) -> None:
    cleaned = (email or "").strip().lower() or None
    with get_db() as conn:
        conn.execute(
            "UPDATE users SET email = ? WHERE id = ?",
            (cleaned, user_id),
        )


def create_password_reset_token(user_id: int) -> str:
    token = secrets.token_urlsafe(32)
    with get_db() as conn:
        conn.execute(
            "INSERT INTO password_reset_tokens (token, user_id) VALUES (?, ?)",
            (token, user_id),
        )
    return token


def get_password_reset_token(token: str) -> dict | None:
    with get_db() as conn:
        row = conn.execute("""
            SELECT prt.token, prt.user_id, prt.created_at, prt.used_at, u.username, u.email
            FROM password_reset_tokens prt
            JOIN users u ON u.id = prt.user_id
            WHERE prt.token = ?
        """, (token,)).fetchone()
        return dict(row) if row else None


def mark_password_reset_token_used(token: str) -> None:
    with get_db() as conn:
        conn.execute(
            "UPDATE password_reset_tokens SET used_at = datetime('now') WHERE token = ?",
            (token,),
        )


# ── Pokémon data (not user-scoped) ──────────────────────────────────────────
def upsert_pokemon(pokemon_data: dict):
    with get_db() as conn:
        conn.execute("""
            INSERT INTO pokemon (
                id, name, sprite_url, sprite_shiny_url, types,
                height, weight, base_experience,
                hp, attack, defense, sp_attack, sp_defense, speed,
                generation, is_cached
            ) VALUES (
                :id, :name, :sprite_url, :sprite_shiny_url, :types,
                :height, :weight, :base_experience,
                :hp, :attack, :defense, :sp_attack, :sp_defense, :speed,
                :generation, 1
            )
            ON CONFLICT(id) DO UPDATE SET
                name=excluded.name,
                sprite_url=excluded.sprite_url,
                sprite_shiny_url=excluded.sprite_shiny_url,
                types=excluded.types,
                height=excluded.height,
                weight=excluded.weight,
                base_experience=excluded.base_experience,
                hp=excluded.hp,
                attack=excluded.attack,
                defense=excluded.defense,
                sp_attack=excluded.sp_attack,
                sp_defense=excluded.sp_defense,
                speed=excluded.speed,
                generation=excluded.generation,
                is_cached=1
        """, pokemon_data)


def link_pokemon_to_game(
    game_id: str,
    pokemon_id: int,
    dex_number: int,
    in_regional_dex: int = 1,
    dex_source: str = "regional",
):
    """Insert or update a Pokémon ↔ game link.

    Source precedence is stable and monotonic:
      regional > dlc > national
    This prevents later seeders from degrading a higher-priority source label.
    """
    source_rank = {"national": 1, "dlc": 2, "regional": 3}
    normalized_source = dex_source if dex_source in source_rank else "national"
    with get_db() as conn:
        existing = conn.execute(
            """
            SELECT in_regional_dex, dex_source
            FROM game_pokemon
            WHERE game_id=? AND pokemon_id=?
            """,
            (game_id, pokemon_id),
        ).fetchone()

        final_source = normalized_source
        final_regional_flag = 1 if normalized_source == "regional" else int(in_regional_dex)
        if existing:
            existing_source = existing["dex_source"] or ("regional" if existing["in_regional_dex"] else "national")
            if source_rank.get(existing_source, 1) > source_rank[final_source]:
                final_source = existing_source
                final_regional_flag = 1 if existing["in_regional_dex"] else 0

        conn.execute("""
            INSERT INTO game_pokemon (game_id, pokemon_id, dex_number, in_regional_dex, dex_source)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(game_id, pokemon_id) DO UPDATE SET
                dex_number      = excluded.dex_number,
                in_regional_dex = excluded.in_regional_dex,
                dex_source      = excluded.dex_source
        """, (game_id, pokemon_id, dex_number, final_regional_flag, final_source))


def get_seeded_ids(game_id: str) -> list[int]:
    """Return all pokemon_ids already linked to this game."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT pokemon_id FROM game_pokemon WHERE game_id = ?",
            (game_id,)
        ).fetchall()
        return [r["pokemon_id"] for r in rows]


def is_game_cached(game_id: str) -> bool:
    with get_db() as conn:
        row = conn.execute(
            "SELECT value FROM cache_meta WHERE key = ?",
            (f"game_cached_{game_id}",)
        ).fetchone()
        return row is not None and row["value"] == "1"


def is_dlc_cached(game_id: str) -> bool:
    with get_db() as conn:
        row = conn.execute(
            "SELECT value FROM cache_meta WHERE key=?",
            (f"dlc_cached_{game_id}",)
        ).fetchone()
        return bool(row and row["value"] == "1")


def mark_dlc_cached(game_id: str):
    with get_db() as conn:
        conn.execute(
            "INSERT OR REPLACE INTO cache_meta (key, value) VALUES (?, '1')",
            (f"dlc_cached_{game_id}",)
        )


def mark_game_cached(game_id: str):
    with get_db() as conn:
        conn.execute("""
            INSERT OR REPLACE INTO cache_meta (key, value)
            VALUES (?, '1')
        """, (f"game_cached_{game_id}",))


def reset_game_cache(game_id: str) -> None:
    """Back-compat wrapper: fully reset a game's seeded dex state."""
    reset_game_seed_state(game_id)


def get_all_game_cache_status() -> list[dict]:
    """Return cache + count info for every configured game (admin panel)."""
    from config import GAMES  # local import keeps DB layer loosely coupled

    with get_db() as conn:
        rows = conn.execute("""
            SELECT
                gp.game_id,
                COUNT(*) AS total,
                SUM(CASE WHEN gp.dex_source = 'regional' THEN 1 ELSE 0 END) AS regional,
                SUM(CASE WHEN gp.dex_source = 'dlc' THEN 1 ELSE 0 END) AS dlc,
                MAX(CASE WHEN cm.key = 'game_cached_' || gp.game_id THEN cm.value END) AS cached,
                MAX(CASE WHEN cm.key = 'dlc_cached_' || gp.game_id THEN cm.value END) AS dlc_cached,
                MAX(CASE WHEN cm.key = 'national_cached_' || gp.game_id THEN cm.value END) AS national_cached
            FROM game_pokemon gp
            LEFT JOIN cache_meta cm ON cm.key IN (
                'game_cached_' || gp.game_id,
                'dlc_cached_' || gp.game_id,
                'national_cached_' || gp.game_id
            )
            GROUP BY gp.game_id
        """).fetchall()

    by_game = {r["game_id"]: dict(r) for r in rows}
    out: list[dict] = []
    for g in GAMES:
        gid = g["id"]
        r = by_game.get(gid, {})
        expected_regional = g.get("regional_max_id")
        if expected_regional is None:
            # Fallback expectation from static seed slugs if no explicit cap
            from seeder import _ids_for_slugs
            expected_regional = len(_ids_for_slugs(g.get("pokedex_slugs", [])))

        out.append({
            "game_id": gid,
            "total": int(r.get("total") or 0),
            "regional": int(r.get("regional") or 0),
            "dlc": int(r.get("dlc") or 0),
            "cached": bool(r.get("cached")),
            "dlc_cached": bool(r.get("dlc_cached")),
            "national_cached": bool(r.get("national_cached")),
            "expected_regional": int(expected_regional or 0),
            "expected_national": int(g.get("national_max_id") or 0),
        })
    return out


def get_game_pokemon(
    game_id: str,
    user_id: int,
    dex_mode: str = "regional",
    national_max_id: int | None = None,
    regional_max_id: int | None = None,
) -> list[dict]:
    """Return Pokémon for a game, filtered by dex_mode.

    dex_mode='regional' → regional dex entries only
    dex_mode='national' → all species up to national_max_id
    dex_mode='all'      → regional + DLC (excludes national-only)
    """
    if dex_mode == "national":
        national_cap = int(national_max_id or 1025)
        regional_filter = f"AND p.id <= {national_cap}"
        dex_num_expr = "p.id"
        order_by = "p.id ASC"
    elif dex_mode == "regional":
        if regional_max_id:
            regional_filter = f"AND gp.dex_source = 'regional' AND gp.dex_number <= {int(regional_max_id)}"
        else:
            regional_filter = "AND gp.dex_source = 'regional'"
        dex_num_expr = "gp.dex_number"
        order_by = "gp.dex_number ASC"
    else:  # "all" — regional + DLC only
        regional_filter = "AND gp.dex_source IN ('regional', 'dlc')"
        dex_num_expr = "gp.dex_number"
        order_by = "gp.dex_number ASC"

    with get_db() as conn:
        rows = conn.execute(f"""
            SELECT p.*, {dex_num_expr} AS dex_number, gp.in_regional_dex,
                   COALESCE(c.caught, 0) AS caught,
                   COALESCE(c.shiny,  0) AS shiny
            FROM game_pokemon gp
            JOIN pokemon p ON p.id = gp.pokemon_id
            LEFT JOIN caught_pokemon c
              ON c.game_id = gp.game_id AND c.pokemon_id = gp.pokemon_id
              AND c.user_id = ?
            WHERE gp.game_id = ? {regional_filter}
            ORDER BY {order_by}
        """, (user_id, game_id)).fetchall()
        return [dict(r) for r in rows]


def toggle_caught(game_id: str, pokemon_id: int, user_id: int) -> bool:
    with get_db() as conn:
        existing = conn.execute(
            "SELECT caught FROM caught_pokemon WHERE user_id=? AND game_id=? AND pokemon_id=?",
            (user_id, game_id, pokemon_id)
        ).fetchone()
        if existing is None:
            conn.execute(
                "INSERT INTO caught_pokemon (user_id, game_id, pokemon_id, caught, last_updated) "
                "VALUES (?, ?, ?, 1, datetime('now'))",
                (user_id, game_id, pokemon_id)
            )
            return True
        new_val = 0 if existing["caught"] else 1
        conn.execute(
            "UPDATE caught_pokemon SET caught=?, last_updated=datetime('now') "
            "WHERE user_id=? AND game_id=? AND pokemon_id=?",
            (new_val, user_id, game_id, pokemon_id)
        )
        return bool(new_val)


def toggle_shiny(game_id: str, pokemon_id: int, user_id: int) -> bool:
    """Toggle shiny flag. Automatically marks the Pokémon as caught too."""
    with get_db() as conn:
        existing = conn.execute(
            "SELECT caught, shiny FROM caught_pokemon WHERE user_id=? AND game_id=? AND pokemon_id=?",
            (user_id, game_id, pokemon_id)
        ).fetchone()
        if existing is None:
            conn.execute(
                "INSERT INTO caught_pokemon (user_id, game_id, pokemon_id, caught, shiny, last_updated) "
                "VALUES (?, ?, ?, 1, 1, datetime('now'))",
                (user_id, game_id, pokemon_id)
            )
            return True
        new_shiny = 0 if existing["shiny"] else 1
        conn.execute(
            "UPDATE caught_pokemon SET shiny=?, last_updated=datetime('now') "
            "WHERE user_id=? AND game_id=? AND pokemon_id=?",
            (new_shiny, user_id, game_id, pokemon_id)
        )
        return bool(new_shiny)


def mark_all_caught_for_game(game_id: str, user_id: int) -> int:
    """Mark every Pokémon currently linked to a game as caught for this user."""
    with get_db() as conn:
        inserted = conn.execute(
            """
            INSERT INTO caught_pokemon (user_id, game_id, pokemon_id, caught, shiny, last_updated)
            SELECT ?, gp.game_id, gp.pokemon_id, 1, 0, datetime('now')
            FROM game_pokemon gp
            WHERE gp.game_id = ?
              AND NOT EXISTS (
                SELECT 1
                FROM caught_pokemon c
                WHERE c.user_id = ?
                  AND c.game_id = gp.game_id
                  AND c.pokemon_id = gp.pokemon_id
              )
            """,
            (user_id, game_id, user_id),
        ).rowcount

        updated = conn.execute(
            """
            UPDATE caught_pokemon
            SET caught = 1,
                last_updated = datetime('now')
            WHERE user_id = ?
              AND game_id = ?
              AND caught = 0
            """,
            (user_id, game_id),
        ).rowcount

        return int((inserted or 0) + (updated or 0))


def cleanup_orphaned_game_pokemon() -> int:
    """Delete game_pokemon rows where pokemon_id has no entry in the pokemon table.

    These orphans inflate stat counts while never rendering in the grid
    (which uses INNER JOIN). Safe to call on every startup — the browser
    seeder will re-add any legitimately missing pokemon.
    """
    with get_db() as conn:
        cursor = conn.execute(
            "DELETE FROM game_pokemon WHERE pokemon_id NOT IN (SELECT id FROM pokemon)"
        )
        return cursor.rowcount


def get_game_stats(
    game_id: str,
    user_id: int,
    dex_mode: str = "regional",
    national_max_id: int | None = None,
    regional_max_id: int | None = None,
) -> dict:
    if dex_mode == "national":
        national_cap = int(national_max_id or 1025)
        mode_filter = f"AND p.id <= {national_cap}"
    elif dex_mode == "regional":
        if regional_max_id:
            mode_filter = f"AND gp.dex_source = 'regional' AND gp.dex_number <= {int(regional_max_id)}"
        else:
            mode_filter = "AND gp.dex_source = 'regional'"
    else:
        mode_filter = "AND gp.dex_source IN ('regional', 'dlc')"

    with get_db() as conn:
        total = conn.execute(
            f"""SELECT COUNT(*) AS cnt
                FROM game_pokemon gp
                JOIN pokemon p ON p.id = gp.pokemon_id
                WHERE gp.game_id=? {mode_filter}""",
            (game_id,)
        ).fetchone()["cnt"]

        row = conn.execute(
            f"""
            SELECT
                COUNT(DISTINCT CASE WHEN c.caught=1 THEN c.pokemon_id END) AS caught,
                COUNT(DISTINCT CASE WHEN c.shiny=1  THEN c.pokemon_id END) AS shiny,
                MAX(c.last_updated) AS last_updated
            FROM game_pokemon gp
            JOIN pokemon p ON p.id = gp.pokemon_id
            LEFT JOIN caught_pokemon c
              ON c.game_id = gp.game_id
             AND c.pokemon_id = gp.pokemon_id
             AND c.user_id = ?
            WHERE gp.game_id = ? {mode_filter}
            """,
            (user_id, game_id),
        ).fetchone()

        return {
            "total": total,
            "caught": row["caught"] or 0,
            "shiny": row["shiny"] or 0,
            "last_updated": row["last_updated"],
        }


def get_single_pokemon_for_game(game_id: str, pokemon_id: int, user_id: int) -> dict | None:
    with get_db() as conn:
        row = conn.execute("""
            SELECT p.*, gp.dex_number,
                   COALESCE(c.caught, 0) AS caught,
                   COALESCE(c.shiny,  0) AS shiny
            FROM game_pokemon gp
            JOIN pokemon p ON p.id = gp.pokemon_id
            LEFT JOIN caught_pokemon c
              ON c.game_id = gp.game_id AND c.pokemon_id = gp.pokemon_id
              AND c.user_id = ?
            WHERE gp.game_id=? AND gp.pokemon_id=?
        """, (user_id, game_id, pokemon_id)).fetchone()
        return dict(row) if row else None


def get_all_game_stats(user_id: int) -> dict:
    with get_db() as conn:
        rows = conn.execute("""
            SELECT gp.game_id,
                   COUNT(DISTINCT gp.pokemon_id) AS total,
                   COUNT(DISTINCT CASE WHEN c.caught=1 THEN c.pokemon_id END) AS caught,
                   COUNT(DISTINCT CASE WHEN c.shiny=1  THEN c.pokemon_id END) AS shiny,
                   MAX(c.last_updated) AS last_updated
            FROM game_pokemon gp
            LEFT JOIN caught_pokemon c
              ON c.game_id=gp.game_id AND c.pokemon_id=gp.pokemon_id AND c.user_id=?
            GROUP BY gp.game_id
        """, (user_id,)).fetchall()
        return {
            r["game_id"]: {"total": r["total"], "caught": r["caught"],
                           "shiny": r["shiny"], "last_updated": r["last_updated"]}
            for r in rows
        }


def get_caught_pokemon_for_builder(game_id: str, user_id: int) -> list[dict]:
    """Return caught Pokémon for the team builder."""
    with get_db() as conn:
        rows = conn.execute("""
            SELECT p.id, p.name, p.sprite_url, p.types,
                   p.hp, p.attack, p.defense,
                   p.sp_attack, p.sp_defense, p.speed,
                   gp.dex_number
            FROM game_pokemon gp
            JOIN pokemon p ON p.id = gp.pokemon_id
            JOIN caught_pokemon c
              ON c.game_id=gp.game_id AND c.pokemon_id=gp.pokemon_id AND c.user_id=?
            WHERE gp.game_id=? AND c.caught=1
            ORDER BY gp.dex_number ASC
        """, (user_id, game_id)).fetchall()
        return [dict(r) for r in rows]


def get_game_notes(game_id: str, user_id: int) -> str:
    with get_db() as conn:
        row = conn.execute(
            "SELECT notes FROM game_notes WHERE user_id=? AND game_id=?",
            (user_id, game_id)
        ).fetchone()
        return row["notes"] if row else ""

def set_game_notes(game_id: str, notes: str, user_id: int) -> None:
    with get_db() as conn:
        conn.execute("""
            INSERT INTO game_notes (user_id, game_id, notes, updated_at)
            VALUES (?, ?, ?, datetime('now'))
            ON CONFLICT(user_id, game_id) DO UPDATE SET
                notes=excluded.notes, updated_at=datetime('now')
        """, (user_id, game_id, notes))


def get_v2_user_state(game_id: str, user_id: int) -> dict:
    with get_db() as conn:
        row = conn.execute(
            "SELECT state_json FROM v2_user_state WHERE user_id=? AND game_id=?",
            (user_id, game_id),
        ).fetchone()
        if not row:
            return {}
        try:
            return json.loads(row["state_json"] or "{}")
        except json.JSONDecodeError:
            return {}


def set_v2_user_state(game_id: str, state: dict, user_id: int) -> None:
    payload = json.dumps(state or {}, separators=(",", ":"), ensure_ascii=True)
    with get_db() as conn:
        conn.execute("""
            INSERT INTO v2_user_state (user_id, game_id, state_json, updated_at)
            VALUES (?, ?, ?, datetime('now'))
            ON CONFLICT(user_id, game_id) DO UPDATE SET
                state_json=excluded.state_json,
                updated_at=datetime('now')
        """, (user_id, game_id, payload))


def is_national_cached(game_id: str) -> bool:
    with get_db() as conn:
        row = conn.execute(
            "SELECT value FROM cache_meta WHERE key=?",
            (f"national_cached_{game_id}",)
        ).fetchone()
        return bool(row and row["value"] == "1")


def mark_national_cached(game_id: str):
    with get_db() as conn:
        conn.execute(
            "INSERT OR REPLACE INTO cache_meta (key, value) VALUES (?, '1')",
            (f"national_cached_{game_id}",),
        )


def reset_game_seed_state(game_id: str) -> None:
    """Clear seeded dex links/cache flags for one game.

    Does NOT delete users/caught rows; those become dormant unless species are re-linked.
    Useful for repairing bad partial/corrupted seed data.
    """
    with get_db() as conn:
        conn.execute("DELETE FROM game_pokemon WHERE game_id = ?", (game_id,))
        conn.execute(
            "DELETE FROM cache_meta WHERE key IN (?, ?, ?)",
            (f"game_cached_{game_id}", f"dlc_cached_{game_id}", f"national_cached_{game_id}"),
        )


def get_pokemon_stats_entry(game_id: str, pokemon_id: int, user_id: int) -> dict | None:
    with get_db() as conn:
        row = conn.execute(
            """
            SELECT * FROM pokemon_stats_tracker
            WHERE user_id=? AND game_id=? AND pokemon_id=?
            """,
            (user_id, game_id, pokemon_id),
        ).fetchone()
        return dict(row) if row else None


def upsert_pokemon_stats_entry(
    *,
    game_id: str,
    pokemon_id: int,
    user_id: int,
    stat_system: str,
    hp: int,
    attack: int,
    defense: int,
    sp_attack: int,
    sp_defense: int,
    speed: int,
    ev_hp: int,
    ev_attack: int,
    ev_defense: int,
    ev_sp_attack: int,
    ev_sp_defense: int,
    ev_speed: int,
) -> None:
    with get_db() as conn:
        conn.execute(
            """
            INSERT INTO pokemon_stats_tracker (
                user_id, game_id, pokemon_id, stat_system,
                hp, attack, defense, sp_attack, sp_defense, speed,
                ev_hp, ev_attack, ev_defense, ev_sp_attack, ev_sp_defense, ev_speed,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            ON CONFLICT(user_id, game_id, pokemon_id) DO UPDATE SET
                stat_system=excluded.stat_system,
                hp=excluded.hp,
                attack=excluded.attack,
                defense=excluded.defense,
                sp_attack=excluded.sp_attack,
                sp_defense=excluded.sp_defense,
                speed=excluded.speed,
                ev_hp=excluded.ev_hp,
                ev_attack=excluded.ev_attack,
                ev_defense=excluded.ev_defense,
                ev_sp_attack=excluded.ev_sp_attack,
                ev_sp_defense=excluded.ev_sp_defense,
                ev_speed=excluded.ev_speed,
                updated_at=datetime('now')
            """,
            (
                user_id, game_id, pokemon_id, stat_system,
                hp, attack, defense, sp_attack, sp_defense, speed,
                ev_hp, ev_attack, ev_defense, ev_sp_attack, ev_sp_defense, ev_speed,
            ),
        )


def list_changelog_entries(limit: int = 25) -> list[dict]:
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT c.*, u.username AS created_by_username
            FROM changelog_entries c
            LEFT JOIN users u ON u.id = c.created_by
            ORDER BY c.created_at DESC, c.id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
        return [dict(r) for r in rows]


def create_changelog_entry(title: str, body: str, created_by: int | None) -> int:
    with get_db() as conn:
        cur = conn.execute(
            """
            INSERT INTO changelog_entries (title, body, created_by)
            VALUES (?, ?, ?)
            """,
            (title.strip(), body.strip(), created_by),
        )
        return int(cur.lastrowid)


def ensure_default_changelog_entries() -> None:
    """Ensure baseline changelog entries exist (idempotent by title)."""
    defaults = [
        (
            "🚀 Trainer Ledger launched",
            "Initial release with offline-first tracking across every mainline game."
        ),
        (
            "👤 Accounts + per-user save data",
            "Added register/login, secure sessions, and separate progress per user."
        ),
        (
            "✨ Catch + Shiny tracking",
            "Track caught status and shiny status separately for each game."
        ),
        (
            "🔎 Search, filters, and notes",
            "Added search by name/number, caught filters, and per-game notes."
        ),
        (
            "📊 Detail drawer + catch tools",
            "Added Pokémon detail drawer with stats, matchups, evolutions, and catch-rate helper."
        ),
        (
            "🏘️ Team Builder + Gym helper",
            "Build teams from caught Pokémon and view gym/challenge matchup guidance."
        ),
        (
            "🌍 National Dex + DLC support",
            "Affected game(s): sword-shield, scarlet-violet\n\nImproved dex loading so regional, national, and DLC pools coexist cleanly."
        ),
        (
            "🧭 Gym progression tracking",
            "Affected game(s): all (gym/trial/challenge games)\n\nYou can now mark gyms/trials/challenges complete and see your next target."
        ),
        (
            "🩹 Game-specific fix: Legends Arceus Pokédex numbering clarity",
            "Affected game(s): legends-arceus\n\nFixed confusing dual-number display between game dex and national dex in the detail drawer by labeling number context clearly."
        ),
        (
            "🧰 UX + feedback polish: separate bug reports + light mode % readability",
            "Affected game(s): all\n\nUpdates page now has separate dropdowns for Feature Suggestions and Bug Reports. Also forced percentage labels to black in app light mode for better readability on affected devices."
        ),
        (
            "✅ Quality-of-life: Mark All Caught + Gen 10 tracking guard",
            "Affected game(s): all (Gen 10 blocked)\n\nAdded a per-game 'Mark All Caught' action with an explicit confirmation prompt for players importing completed saves. Also disabled catch/shiny tracking actions for Gen 10 placeholder content until official support is ready."
        ),
        (
            "🌐 Trainer Ledger public launch",
            "Affected game(s): site-wide\n\nThe app now runs on trainerledger.com with a public homepage, support page, Patreon support flow, clearer branding, and visible work-in-progress messaging for the live product."
        ),
        (
            "🗺️ V2 guides promoted across the full library",
            "Affected game(s): all mainline families\n\nV2 now covers every major game family with themed guide pages, regional-dex-first presentation, route structure, catch targets, key items, secrets, and game-specific progress tools."
        ),
        (
            "🏆 Gold-standard guide upgrades for flagship games",
            "Affected game(s): fire-red-leaf-green, heartgold-soulsilver, legends-za, scarlet-violet\n\nThe strongest guide pages now include deeper route planning, game-specific dashboards, polished visuals, helper panels, and cleaner start-to-finish playthrough support."
        ),
        (
            "🖼️ Game library visual overhaul",
            "Affected game(s): V2 library\n\nThe game selection screen now uses official-looking local box art, clearer completion states, better launcher-style cards, and paired-version presentation like Red / Blue and FireRed / LeafGreen."
        ),
        (
            "💾 V2 accounts, recovery, and permanent-save groundwork",
            "Affected game(s): site-wide, V2\n\nLogged-in players now have account settings, recovery email support, forgot-password and reset-password flows, and the first database-backed foundation for permanent V2 progress saves."
        ),
    ]

    with get_db() as conn:
        existing = {
            r[0]
            for r in conn.execute("SELECT title FROM changelog_entries").fetchall()
        }
        missing = [entry for entry in defaults if entry[0] not in existing]
        if not missing:
            return
        conn.executemany(
            "INSERT INTO changelog_entries (title, body, created_by) VALUES (?, ?, NULL)",
            missing,
        )


def create_feature_suggestion(user_id: int, title: str, details: str) -> int:
    with get_db() as conn:
        cur = conn.execute(
            """
            INSERT INTO feature_suggestions (user_id, title, details)
            VALUES (?, ?, ?)
            """,
            (user_id, title.strip(), details.strip()),
        )
        return int(cur.lastrowid)


def list_feature_suggestions(limit: int = 200) -> list[dict]:
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT fs.*, u.username
            FROM feature_suggestions fs
            JOIN users u ON u.id = fs.user_id
            ORDER BY fs.created_at DESC, fs.id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
        return [dict(r) for r in rows]


def list_feature_suggestions_for_user(user_id: int, limit: int = 50) -> list[dict]:
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT *
            FROM feature_suggestions
            WHERE user_id = ?
            ORDER BY created_at DESC, id DESC
            LIMIT ?
            """,
            (user_id, limit),
        ).fetchall()
        return [dict(r) for r in rows]


def update_feature_suggestion_status(
    suggestion_id: int,
    status: str,
    reviewed_by: int,
) -> None:
    with get_db() as conn:
        conn.execute(
            """
            UPDATE feature_suggestions
            SET status = ?, reviewed_at = datetime('now'), reviewed_by = ?
            WHERE id = ?
            """,
            (status, reviewed_by, suggestion_id),
        )


def create_bug_report(user_id: int, title: str, details: str) -> int:
    with get_db() as conn:
        cur = conn.execute(
            """
            INSERT INTO bug_reports (user_id, title, details)
            VALUES (?, ?, ?)
            """,
            (user_id, title.strip(), details.strip()),
        )
        return int(cur.lastrowid)


def list_bug_reports(limit: int = 200) -> list[dict]:
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT br.*, u.username
            FROM bug_reports br
            JOIN users u ON u.id = br.user_id
            ORDER BY br.created_at DESC, br.id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
        return [dict(r) for r in rows]


def list_bug_reports_for_user(user_id: int, limit: int = 50) -> list[dict]:
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT *
            FROM bug_reports
            WHERE user_id = ?
            ORDER BY created_at DESC, id DESC
            LIMIT ?
            """,
            (user_id, limit),
        ).fetchall()
        return [dict(r) for r in rows]


def update_bug_report_status(
    bug_id: int,
    status: str,
    reviewed_by: int,
) -> None:
    with get_db() as conn:
        conn.execute(
            """
            UPDATE bug_reports
            SET status = ?, reviewed_at = datetime('now'), reviewed_by = ?
            WHERE id = ?
            """,
            (status, reviewed_by, bug_id),
        )


def get_gym_progress(game_id: str, user_id: int) -> list[str]:
    """Return completed gym/challenge IDs for a game+user."""
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT challenge_id
            FROM gym_progress
            WHERE user_id = ? AND game_id = ? AND completed = 1
            ORDER BY challenge_id ASC
            """,
            (user_id, game_id),
        ).fetchall()
        return [r["challenge_id"] for r in rows]


def toggle_gym_challenge(game_id: str, challenge_id: str, user_id: int) -> bool:
    """Toggle a gym/trial/champion completion status; returns new completed state."""
    with get_db() as conn:
        existing = conn.execute(
            """
            SELECT completed
            FROM gym_progress
            WHERE user_id = ? AND game_id = ? AND challenge_id = ?
            """,
            (user_id, game_id, challenge_id),
        ).fetchone()

        if existing is None:
            conn.execute(
                """
                INSERT INTO gym_progress (user_id, game_id, challenge_id, completed, updated_at)
                VALUES (?, ?, ?, 1, datetime('now'))
                """,
                (user_id, game_id, challenge_id),
            )
            return True

        new_val = 0 if existing["completed"] else 1
        conn.execute(
            """
            UPDATE gym_progress
            SET completed = ?, updated_at = datetime('now')
            WHERE user_id = ? AND game_id = ? AND challenge_id = ?
            """,
            (new_val, user_id, game_id, challenge_id),
        )
        return bool(new_val)
