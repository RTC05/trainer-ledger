#!/bin/bash
# ─────────────────────────────────────────────────────────
#  PokéDex Tracker — smart launcher
#  First run: creates venv + installs deps automatically.
#  Every run: starts the server and opens your browser.
# ─────────────────────────────────────────────────────────
cd "$(dirname "$0")"

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo ""
echo -e "${YELLOW}  PokeDex Tracker${NC}"
echo "  ──────────────────────────────"

# ── 1. Find a usable Python 3.11+ ──────────────────────────
PY=""
for candidate in python3.13 python3.12 python3.11 python3; do
  if command -v "$candidate" &>/dev/null; then
    MAJOR=$("$candidate" -c 'import sys; print(sys.version_info[0])' 2>/dev/null)
    MINOR=$("$candidate" -c 'import sys; print(sys.version_info[1])' 2>/dev/null)
    if [ "$MAJOR" -ge 3 ] && [ "$MINOR" -ge 11 ]; then
      PY="$candidate"
      break
    fi
  fi
done

if [ -z "$PY" ]; then
  echo -e "${RED}  ERROR: Python 3.11+ not found.${NC}"
  echo ""
  echo "  Install it with Homebrew:"
  echo "    brew install python@3.12"
  echo ""
  echo "  Or download from: https://www.python.org/downloads/"
  exit 1
fi
echo -e "  ${GREEN}OK${NC} Python: $($PY --version)"

# ── 2. Create virtual environment (once) ───────────────────
if [ ! -d ".venv" ]; then
  echo "  Creating virtual environment..."
  if ! "$PY" -m venv .venv; then
    echo -e "${RED}  ERROR: Failed to create venv.${NC}"
    exit 1
  fi
  echo -e "  ${GREEN}OK${NC} Virtual environment created."
fi

VENV_PY=".venv/bin/python"

if [ ! -x "$VENV_PY" ]; then
  echo "  Rebuilding virtual environment..."
  rm -rf .venv
  if ! "$PY" -m venv .venv; then
    echo -e "${RED}  ERROR: Failed to rebuild venv.${NC}"
    exit 1
  fi
  echo -e "  ${GREEN}OK${NC} Virtual environment rebuilt."
fi

# ── 3. Install / update dependencies ───────────────────────
if [ ! -f ".venv/.deps-installed" ] || [ requirements.txt -nt ".venv/.deps-installed" ]; then
  echo "  Installing dependencies (first run takes ~30s)..."
  "$VENV_PY" -m pip install --quiet --upgrade pip
  if ! "$VENV_PY" -m pip install --quiet -r requirements.txt; then
    echo -e "${RED}  ERROR: pip install failed. Check your internet connection.${NC}"
    exit 1
  fi
  touch .venv/.deps-installed
  echo -e "  ${GREEN}OK${NC} Dependencies installed."
else
  echo -e "  ${GREEN}OK${NC} Dependencies up to date."
fi

# ── 4. Kill any existing server on port 8888 ───────────────
LISTENING=$(lsof -ti:8888 2>/dev/null || true)
if [ -n "$LISTENING" ]; then
  echo "  Stopping old server on :8888..."
  echo "$LISTENING" | xargs kill -9 2>/dev/null || true
  sleep 1
fi

# ── 5. Launch — listen on all interfaces so iOS devices can connect ──
echo "  Starting server on port 8888 ..."
"$VENV_PY" -m uvicorn main:app --host 0.0.0.0 --port 8888 --log-level warning > /tmp/pokedex-server.log 2>&1 &
SERVER_PID=$!
sleep 2

# Verify it started
if ! kill -0 "$SERVER_PID" 2>/dev/null; then
  echo -e "${RED}  ERROR: Server failed to start. Log output:${NC}"
  echo ""
  cat /tmp/pokedex-server.log
  exit 1
fi

# ── 6. Detect local network IP for iOS access ──────────────
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "")

echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║   PokeDex Tracker is running!                ║"
echo "  ║                                              ║"
echo "  ║   On this Mac:                               ║"
echo "  ║     http://localhost:8888                    ║"
if [ -n "$LOCAL_IP" ]; then
echo "  ║                                              ║"
echo "  ║   On iPhone/iPad (same WiFi):                ║"
echo "  ║     http://$LOCAL_IP:8888"
echo "  ║       (bookmark this in Safari!)             ║"
fi
echo "  ║                                              ║"
echo "  ║   Press Ctrl+C to stop.                      ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""

# ── 7. Open browser (Mac) ──────────────────────────────────
if command -v open &>/dev/null; then
  open http://localhost:8888
fi

# ── 8. Wait — Ctrl+C stops the server cleanly ──────────────
trap "echo ''; echo '  Stopping...'; kill $SERVER_PID 2>/dev/null; exit 0" INT TERM
wait $SERVER_PID
