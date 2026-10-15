"""routes_api_auth.py — JSON API for iOS app authentication.

Shares the same user database and bcrypt passwords as the website,
so credentials work on both.

Endpoints:
    POST /api/auth/register  { username, password, email? } -> { token, user_id, username }
    POST /api/auth/login     { username, password }          -> { token, user_id, username }
    GET  /api/auth/me        (Authorization: Bearer <token>) -> { user_id, username }
"""
from fastapi import APIRouter, Request, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional

from auth import hash_password, verify_password, make_session_token, decode_session_token
import database as db

router = APIRouter(prefix="/api/auth")


class RegisterBody(BaseModel):
    username: str
    password: str
    email: Optional[str] = None


class LoginBody(BaseModel):
    username: str
    password: str


def _token_response(user_id: int, username: str) -> JSONResponse:
    return JSONResponse({
        "token": make_session_token(user_id),
        "user_id": user_id,
        "username": username,
    })


@router.post("/register")
async def api_register(body: RegisterBody):
    username = body.username.strip()
    email = (body.email or "").strip().lower()
    password = body.password

    if len(username) < 2:
        return JSONResponse({"error": "Username must be at least 2 characters."}, status_code=400)
    if len(username) > 20:
        return JSONResponse({"error": "Username must be 20 characters or fewer."}, status_code=400)
    if email and "@" not in email:
        return JSONResponse({"error": "Enter a valid email or leave it blank."}, status_code=400)
    if len(password) < 6:
        return JSONResponse({"error": "Password must be at least 6 characters."}, status_code=400)
    if db.get_user_by_username(username):
        return JSONResponse({"error": "That username is already taken."}, status_code=409)
    if email and db.get_user_by_email(email):
        return JSONResponse({"error": "That email is already in use."}, status_code=409)

    is_first = db.count_users() == 0
    uid = db.create_user(username, hash_password(password), is_admin=is_first, email=email or None)
    return _token_response(uid, username)


@router.post("/login")
async def api_login(body: LoginBody):
    username = body.username.strip()
    user = db.get_user_by_username(username)
    if not user or not verify_password(body.password, user["password_hash"]):
        return JSONResponse({"error": "Invalid username or password."}, status_code=401)
    return _token_response(user["id"], user["username"])


@router.get("/me")
async def api_me(authorization: Optional[str] = Header(None)):
    """Validate a token. Send as: Authorization: Bearer <token>"""
    if not authorization or not authorization.startswith("Bearer "):
        return JSONResponse({"error": "Missing token."}, status_code=401)
    token = authorization[7:]
    user_id = decode_session_token(token)
    if not user_id:
        return JSONResponse({"error": "Invalid or expired token."}, status_code=401)
    user = db.get_user_by_id(user_id)
    if not user:
        return JSONResponse({"error": "User not found."}, status_code=404)
    return JSONResponse({"user_id": user["id"], "username": user["username"]})
