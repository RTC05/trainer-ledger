"""routes_auth.py — login, register, logout, admin."""
import os
from fastapi import APIRouter, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from auth import (
    hash_password, verify_password, set_session, clear_session,
    get_current_user_id,
)
from database import (
    list_feature_suggestions,
    list_bug_reports,
    create_changelog_entry,
    update_feature_suggestion_status,
    update_bug_report_status,
)
import database as db
from mailer import email_enabled, send_password_reset_email
from app_templates import templates  # shared instance — has css_v, js_v, app_version globals

router = APIRouter()
RESET_TOKEN_MAX_AGE_SECONDS = int(os.getenv("RESET_TOKEN_MAX_AGE_SECONDS", str(60 * 60 * 2)))


# ── helpers ───────────────────────────────────────────────────────────────
def _mask_email(email: str | None) -> str:
    if not email or "@" not in email:
        return "your recovery email"
    local, domain = email.split("@", 1)
    local_mask = local[:2] + ("*" * max(1, len(local) - 2))
    return f"{local_mask}@{domain}"


def _render(request, template, **ctx):
    uid  = get_current_user_id(request)
    user = db.get_user_by_id(uid) if uid else None
    return templates.TemplateResponse(
        request,
        template,
        {
            "current_user": user,
            "support_email": os.getenv("SUPPORT_EMAIL", "hello@trainerledger.com").strip(),
            "public_url": os.getenv("PUBLIC_BASE_URL", "https://trainerledger.com").strip(),
            **ctx,
        },
    )


# ── register ──────────────────────────────────────────────────────────────
@router.get("/register", response_class=HTMLResponse)
async def register_page(request: Request):
    if get_current_user_id(request):
        return RedirectResponse("/", status_code=302)
    return _render(request, "register.html", error=None)


@router.post("/register", response_class=HTMLResponse)
async def register_post(
    request: Request,
    username: str = Form(...),
    email: str = Form(default=""),
    password: str = Form(...),
    confirm:  str = Form(...),
):
    username = username.strip()
    email = email.strip().lower()
    error = None

    if len(username) < 2:
        error = "Username must be at least 2 characters."
    elif len(username) > 20:
        error = "Username must be 20 characters or fewer."
    elif email and "@" not in email:
        error = "Enter a valid email or leave it blank for now."
    elif len(password) < 6:
        error = "Password must be at least 6 characters."
    elif password != confirm:
        error = "Passwords do not match."
    elif db.get_user_by_username(username):
        error = "That username is already taken."
    elif email and db.get_user_by_email(email):
        error = "That email is already in use."

    if error:
        return _render(request, "register.html", error=error, username=username, email=email)

    is_first = db.count_users() == 0
    uid = db.create_user(username, hash_password(password), is_admin=is_first, email=email or None)
    response = RedirectResponse("/", status_code=302)
    set_session(response, uid)
    return response


# ── login ─────────────────────────────────────────────────────────────────
@router.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    if get_current_user_id(request):
        return RedirectResponse("/", status_code=302)
    return _render(request, "login.html", error=None)


@router.get("/forgot-password", response_class=HTMLResponse)
async def forgot_password_page(request: Request):
    if get_current_user_id(request):
        return RedirectResponse("/account", status_code=302)
    return _render(request, "forgot_password.html", error=None, message=None, reset_link=None)


@router.post("/forgot-password", response_class=HTMLResponse)
async def forgot_password_post(
    request: Request,
    email: str = Form(...),
):
    email = email.strip().lower()
    user = db.get_user_by_email(email) if email else None
    reset_link = None
    fallback_mode = False
    message = "If that email exists, reset instructions have been sent."
    delivery_target = None
    if user:
        token = db.create_password_reset_token(user["id"])
        base_url = os.getenv("PUBLIC_BASE_URL", "").strip().rstrip("/")
        path = f"/reset-password/{token}"
        reset_link = f"{base_url}{path}" if base_url else path
        delivery_target = _mask_email(user["email"])
        sent, _ = send_password_reset_email(
            to_email=user["email"],
            username=user["username"],
            reset_link=reset_link,
        )
        if sent:
            message = f"If that account exists, reset instructions were sent to {delivery_target}."
            reset_link = None
        else:
            fallback_mode = True
            message = (
                f"If that account exists, a reset link is ready below for {delivery_target}."
                if not email_enabled()
                else f"Email delivery is not ready yet, so the reset link is shown below for {delivery_target}."
            )

    return _render(
        request,
        "forgot_password.html",
        error=None,
        message=message,
        reset_link=reset_link,
        email=email,
        fallback_mode=fallback_mode,
        delivery_target=delivery_target,
    )


@router.get("/reset-password/{token}", response_class=HTMLResponse)
async def reset_password_page(request: Request, token: str):
    if get_current_user_id(request):
        return RedirectResponse("/account", status_code=302)
    reset_row = db.get_password_reset_token(token)
    valid = bool(reset_row and not reset_row.get("used_at"))
    return _render(
        request,
        "reset_password.html",
        error=None if valid else "This reset link is invalid or already used.",
        token=token,
        valid=valid,
    )


@router.post("/reset-password/{token}", response_class=HTMLResponse)
async def reset_password_post(
    request: Request,
    token: str,
    password: str = Form(...),
    confirm: str = Form(...),
):
    reset_row = db.get_password_reset_token(token)
    if not reset_row or reset_row.get("used_at"):
        return _render(request, "reset_password.html", error="This reset link is invalid or already used.", token=token, valid=False)

    from datetime import datetime, timezone

    created_at = datetime.strptime(reset_row["created_at"], "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
    age_seconds = (datetime.now(timezone.utc) - created_at).total_seconds()
    if age_seconds > RESET_TOKEN_MAX_AGE_SECONDS:
        return _render(request, "reset_password.html", error="This reset link has expired. Request a new one.", token=token, valid=False)

    if len(password) < 6:
        return _render(request, "reset_password.html", error="Password must be at least 6 characters.", token=token, valid=True)
    if password != confirm:
        return _render(request, "reset_password.html", error="Passwords do not match.", token=token, valid=True)

    db.update_user_password(reset_row["user_id"], hash_password(password))
    db.mark_password_reset_token_used(token)
    return RedirectResponse("/login", status_code=302)


@router.post("/login", response_class=HTMLResponse)
async def login_post(
    request: Request,
    username: str = Form(...),
    password: str = Form(...),
):
    user = db.get_user_by_username(username.strip())
    if not user or not verify_password(password, user["password_hash"]):
        return _render(request, "login.html",
                       error="Invalid username or password.",
                       username=username)

    response = RedirectResponse("/", status_code=302)
    set_session(response, user["id"])
    return response


@router.get("/account", response_class=HTMLResponse)
async def account_page(request: Request):
    uid = get_current_user_id(request)
    if not uid:
        return RedirectResponse("/login", status_code=302)
    user = db.get_user_by_id(uid)
    return _render(request, "account.html", error=None, message=None, account_email=(user or {}).get("email", ""))


@router.post("/account", response_class=HTMLResponse)
async def account_post(
    request: Request,
    email: str = Form(default=""),
    password: str = Form(default=""),
    confirm: str = Form(default=""),
):
    uid = get_current_user_id(request)
    if not uid:
        return RedirectResponse("/login", status_code=302)

    user = db.get_user_by_id(uid)
    email = email.strip().lower()

    if email and "@" not in email:
        return _render(request, "account.html", error="Enter a valid email or leave it blank.", message=None, account_email=email)

    existing = db.get_user_by_email(email) if email else None
    if existing and existing["id"] != uid:
        return _render(request, "account.html", error="That email is already attached to another account.", message=None, account_email=email)

    if password or confirm:
        if len(password) < 6:
            return _render(request, "account.html", error="New password must be at least 6 characters.", message=None, account_email=email)
        if password != confirm:
            return _render(request, "account.html", error="New password and confirmation do not match.", message=None, account_email=email)
        db.update_user_password(uid, hash_password(password))

    db.update_user_email(uid, email or None)
    return _render(request, "account.html", error=None, message="Account settings saved.", account_email=email)


# ── logout ────────────────────────────────────────────────────────────────
@router.post("/logout")
async def logout():
    response = RedirectResponse("/login", status_code=302)
    clear_session(response)
    return response


# ── admin ─────────────────────────────────────────────────────────────────
@router.get("/admin", response_class=HTMLResponse)
async def admin_page(request: Request):
    uid = get_current_user_id(request)
    if not uid:
        return RedirectResponse("/login", status_code=302)
    user = db.get_user_by_id(uid)
    if not user or not user["is_admin"]:
        return RedirectResponse("/", status_code=302)
    return _render(
        request, "admin.html",
        users=db.get_all_users(),
        game_status=db.get_all_game_cache_status(),
        suggestions=list_feature_suggestions(),
        bug_reports=list_bug_reports(),
        message=None,
    )


@router.post("/admin/delete/{target_id}")
async def admin_delete(request: Request, target_id: int):
    uid = get_current_user_id(request)
    user = db.get_user_by_id(uid) if uid else None
    if not user or not user["is_admin"] or target_id == uid:
        return RedirectResponse("/admin", status_code=302)
    db.delete_user(target_id)
    return RedirectResponse("/admin", status_code=302)


@router.post("/admin/reset-password/{target_id}")
async def admin_reset_password(
    request: Request,
    target_id: int,
    new_password: str = Form(...),
):
    uid = get_current_user_id(request)
    user = db.get_user_by_id(uid) if uid else None
    if not user or not user["is_admin"]:
        return RedirectResponse("/admin", status_code=302)
    db.update_user_password(target_id, hash_password(new_password))
    return RedirectResponse("/admin", status_code=302)


@router.post("/admin/reset-game/{game_id}")
async def admin_reset_game(request: Request, game_id: str):
    """Admin only — clear the cached flag for a game so the browser re-seeds it."""
    uid  = get_current_user_id(request)
    user = db.get_user_by_id(uid) if uid else None
    if not user or not user["is_admin"]:
        return RedirectResponse("/admin", status_code=302)
    db.reset_game_cache(game_id)
    return RedirectResponse("/admin", status_code=302)


@router.post("/admin/changelog")
async def admin_create_changelog(
    request: Request,
    title: str = Form(...),
    body: str = Form(...),
    affected_games: str = Form(default=""),
):
    uid = get_current_user_id(request)
    user = db.get_user_by_id(uid) if uid else None
    if not user or not user["is_admin"]:
        return RedirectResponse("/admin", status_code=302)

    title = title.strip()
    body = body.strip()
    affected_games = affected_games.strip()
    if len(title) < 4 or len(body) < 10:
        return RedirectResponse("/admin", status_code=302)

    if affected_games:
        body = f"Affected game(s): {affected_games}\n\n{body}"

    create_changelog_entry(title, body, uid)
    return RedirectResponse("/updates", status_code=302)


@router.post("/admin/suggestions/{suggestion_id}/status")
async def admin_update_suggestion_status(
    request: Request,
    suggestion_id: int,
    status: str = Form(...),
):
    uid = get_current_user_id(request)
    user = db.get_user_by_id(uid) if uid else None
    if not user or not user["is_admin"]:
        return RedirectResponse("/admin", status_code=302)

    allowed = {"new", "planned", "in-progress", "done", "rejected"}
    if status not in allowed:
        return RedirectResponse("/admin", status_code=302)

    update_feature_suggestion_status(suggestion_id, status, uid)
    return RedirectResponse("/admin", status_code=302)


@router.post("/admin/bugs/{bug_id}/status")
async def admin_update_bug_status(
    request: Request,
    bug_id: int,
    status: str = Form(...),
):
    uid = get_current_user_id(request)
    user = db.get_user_by_id(uid) if uid else None
    if not user or not user["is_admin"]:
        return RedirectResponse("/admin", status_code=302)

    allowed = {"new", "planned", "in-progress", "done", "rejected"}
    if status not in allowed:
        return RedirectResponse("/admin", status_code=302)

    update_bug_report_status(bug_id, status, uid)
    return RedirectResponse("/admin", status_code=302)
