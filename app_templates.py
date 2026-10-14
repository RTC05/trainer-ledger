"""Shared Jinja2Templates instance with versioned asset globals.

A single canonical templates object that both main.py and routes_auth.py
import. This guarantees css_v, js_v, and app_version are always available
in every rendered template without duplication.
"""
import hashlib
from pathlib import Path
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="templates")


def _md5(*paths: str) -> str:
    h = hashlib.md5()
    for p in paths:
        h.update(Path(p).read_bytes())
    return h.hexdigest()[:8]


_css_version = _md5(
    "static/style.css",
    "static/game-detail.css",
    "static/team-builder.css",
    "static/v2-preview.css",
    "static/sv-guide.css",
    "static/auth.css",
)

_js_version = _md5(
    "static/detail-drawer.js",
    "static/stat-tracker.js",
    "static/gym-panel.js",
    "static/type-chart.js",
    "static/type-corrections.js",
    "static/enhancements.js",
    "static/evo_corrections.js",
    "static/v2-game.js",
    "static/v2-preview.js",
)

# Short hash of the most volatile source files.
# Displayed in the footer so any machine can confirm the exact build.
_app_version = _md5(
    "main.py",
    "database.py",
    "templates/game.html",
)

templates.env.globals["css_v"]       = _css_version
templates.env.globals["js_v"]        = _js_version
templates.env.globals["app_version"] = _app_version

# Re-export version strings for use in endpoint responses
css_version = _css_version
js_version  = _js_version
app_version = _app_version
