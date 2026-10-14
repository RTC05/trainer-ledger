"""auth.py — password hashing, session cookies, FastAPI dependencies."""
import os
import secrets
import secrets
from pathlib import Path
from typing import Optional

from fastapi import Cookie, Request
from fastapi.responses import RedirectResponse
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from passlib.context import CryptContext

# ── Secret key (env var → local file fallback) ───────────────────────────
# On Railway: set SECRET_KEY as an environment variable.
# Locally: auto-generated and stored in .secret_key
_KEY_FILE = Path(__file__).parent / ".secret_key"

def _load_secret() -> str:
    env_key = os.environ.get("SECRET_KEY", "").strip()
    if env_key:
        return env_key
    if _KEY_FILE.exists():
        return _KEY_FILE.read_text().strip()
    key = secrets.token_hex(32)
    _KEY_FILE.write_text(key)
    return key

SECRET_KEY = _load_secret()
SESSION_COOKIE = "pkmn_session"
SESSION_MAX_AGE = 60 * 60 * 24 * 30   # 30 days in seconds

_serializer = URLSafeTimedSerializer(SECRET_KEY)
_pwd_ctx    = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ── Passwords ─────────────────────────────────────────────────────────────
def hash_password(plain: str) -> str:
    return _pwd_ctx.hash(plain)

def verify_password(plain: str, hashed: str) -> bool:
    return _pwd_ctx.verify(plain, hashed)

# ── Session cookies ───────────────────────────────────────────────────────
def make_session_token(user_id: int) -> str:
    return _serializer.dumps({"uid": user_id})

def decode_session_token(token: str) -> Optional[int]:
    try:
        data = _serializer.loads(token, max_age=SESSION_MAX_AGE)
        return int(data["uid"])
    except (BadSignature, SignatureExpired, KeyError, ValueError):
        return None

def set_session(response, user_id: int) -> None:
    response.set_cookie(
        SESSION_COOKIE,
        make_session_token(user_id),
        max_age=SESSION_MAX_AGE,
        httponly=True,
        samesite="lax",
    )

def clear_session(response) -> None:
    response.delete_cookie(SESSION_COOKIE)

# ── FastAPI dependency: current user from cookie ──────────────────────────
def get_current_user_id(request: Request) -> Optional[int]:
    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        return None
    return decode_session_token(token)

def require_user(request: Request):
    """Dependency for page routes — redirects to /login if not authenticated."""
    uid = get_current_user_id(request)
    if uid is None:
        # Raise as an exception so FastAPI can handle it
        raise _LoginRedirect()
    return uid

class _LoginRedirect(Exception):
    pass