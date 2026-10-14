#!/usr/bin/env sh
set -eu

echo "[start] python=$(python --version 2>&1)"
echo "[start] PORT=${PORT:-<unset>} DATA_DIR=${DATA_DIR:-<unset>}"
echo "[start] pwd=$(pwd)"

python - <<'PY'
import os
print('[start] env check ok')
print('[start] SECRET_KEY set:', bool(os.getenv('SECRET_KEY')))
import main  # noqa: F401
print('[start] import main ok')
PY

exec uvicorn main:app --host 0.0.0.0 --port "${PORT:-8080}"
