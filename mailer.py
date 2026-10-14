"""Simple transactional email helpers for Trainer Ledger."""

from __future__ import annotations

import os
import smtplib
import ssl
import traceback
from email.message import EmailMessage


def _env_flag(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


def _smtp_settings() -> dict | None:
    host = os.getenv("SMTP_HOST", "").strip()
    username = os.getenv("SMTP_USERNAME", "").strip()
    password = os.getenv("SMTP_PASSWORD", "").strip()
    from_email = os.getenv("SMTP_FROM_EMAIL", "").strip()

    if not all([host, username, password, from_email]):
        return None

    return {
        "host": host,
        "port": int(os.getenv("SMTP_PORT", "587").strip() or "587"),
        "username": username,
        "password": password,
        "from_email": from_email,
        "from_name": os.getenv("SMTP_FROM_NAME", "Trainer Ledger").strip() or "Trainer Ledger",
        "use_ssl": _env_flag("SMTP_USE_SSL", False),
        "use_starttls": _env_flag("SMTP_USE_STARTTLS", True),
        "timeout": int(os.getenv("SMTP_TIMEOUT_SECONDS", "12").strip() or "12"),
    }


def email_enabled() -> bool:
    return _smtp_settings() is not None


def send_password_reset_email(*, to_email: str, username: str, reset_link: str) -> tuple[bool, str | None]:
    settings = _smtp_settings()
    if not settings:
        print(f"[mailer] password reset email skipped: SMTP not configured for {to_email}")
        return False, "Email delivery is not configured."

    msg = EmailMessage()
    msg["Subject"] = "Reset your Trainer Ledger password"
    msg["From"] = f'{settings["from_name"]} <{settings["from_email"]}>'
    msg["To"] = to_email
    msg.set_content(
        "\n".join(
            [
                f"Hi {username},",
                "",
                "We received a request to reset your Trainer Ledger password.",
                "Use the link below to choose a new password:",
                reset_link,
                "",
                "If you did not request this, you can ignore this email.",
                "",
                "Trainer Ledger",
            ]
        )
    )

    try:
        if settings["use_ssl"]:
            with smtplib.SMTP_SSL(
                settings["host"],
                settings["port"],
                timeout=settings["timeout"],
                context=ssl.create_default_context(),
            ) as server:
                server.login(settings["username"], settings["password"])
                server.send_message(msg)
        else:
            with smtplib.SMTP(settings["host"], settings["port"], timeout=settings["timeout"]) as server:
                if settings["use_starttls"]:
                    server.starttls(context=ssl.create_default_context())
                server.login(settings["username"], settings["password"])
                server.send_message(msg)
    except Exception as exc:  # pragma: no cover - transport-specific
        print(f"[mailer] password reset email failed for {to_email}: {type(exc).__name__}: {exc}")
        print(traceback.format_exc())
        return False, str(exc)

    print(f"[mailer] password reset email sent to {to_email}")
    return True, None
