#!/usr/bin/env bash
set -euo pipefail

# Safe Railway deploy for PokéDex Tracker
# Guards against common foot-guns:
# - duplicate /data volume mounts
# - missing critical env vars
# - bad post-deploy health

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

if ! command -v railway >/dev/null 2>&1; then
  echo "❌ railway CLI not found. Install with: brew install railway"
  exit 1
fi

echo "🔎 Checking Railway link/status..."
railway status >/dev/null

echo "🔎 Checking required env vars..."
VARS_OUT="$(railway variables)"
if ! grep -q "SECRET_KEY" <<<"$VARS_OUT"; then
  echo "❌ SECRET_KEY is missing. Run: railway variables set SECRET_KEY=..."
  exit 1
fi
if ! grep -q "DATA_DIR" <<<"$VARS_OUT"; then
  echo "❌ DATA_DIR is missing. Run: railway variables set DATA_DIR=/data"
  exit 1
fi

echo "🔎 Checking volume mount safety..."
VOL_OUT="$(railway volume list)"
DATA_MOUNT_COUNT="$(grep -c "Mount path: /data$" <<<"$VOL_OUT" || true)"
ATTACHED_COUNT="$(grep -c "Attached to: PokeDex Tracker" <<<"$VOL_OUT" || true)"

if [[ "$DATA_MOUNT_COUNT" -ne 1 ]]; then
  echo "❌ Expected exactly ONE volume mounted at /data, found: $DATA_MOUNT_COUNT"
  echo "   Fix in Railway dashboard/CLI before deploy."
  echo
  echo "$VOL_OUT"
  exit 1
fi

if [[ "$ATTACHED_COUNT" -lt 1 ]]; then
  echo "❌ No volume attached to service. Data persistence is at risk."
  echo "$VOL_OUT"
  exit 1
fi

echo "✅ Preflight passed. Deploying..."
railway up

# Get latest deployment id + status line
sleep 4
LATEST_LINE="$(railway deployment list | sed -n '2p')"
echo "📦 Latest deployment: $LATEST_LINE"
DEPLOY_ID="$(awk '{print $1}' <<<"$LATEST_LINE")"

if [[ -z "$DEPLOY_ID" ]]; then
  echo "❌ Could not parse deployment ID"
  exit 1
fi

echo "⏳ Waiting for deployment to settle..."
for _ in {1..25}; do
  LINE="$(railway deployment list | sed -n '2p')"
  STATUS="$(awk -F'|' '{gsub(/ /, "", $2); print $2}' <<<"$LINE")"
  echo "   status=$STATUS"
  case "$STATUS" in
    SUCCESS)
      break
      ;;
    FAILED|CRASHED|REMOVED)
      echo "❌ Deployment failed: $LINE"
      echo "--- Build logs ---"
      railway logs "$DEPLOY_ID" --build --lines 120 || true
      echo "--- Deploy logs ---"
      railway logs "$DEPLOY_ID" --deployment --lines 120 || true
      exit 1
      ;;
  esac
  sleep 6
done

echo "🩺 Verifying health endpoint..."
HTTP_CODE="$(curl -s -o /tmp/pdx_health.json -w '%{http_code}' https://pokedex-tracker-production.up.railway.app/health || true)"
if [[ "$HTTP_CODE" != "200" ]]; then
  echo "❌ Health endpoint check failed (HTTP $HTTP_CODE)"
  exit 1
fi

echo "✅ Deploy healthy. Summary:"
python3 - <<'PY'
import json
p='/tmp/pdx_health.json'
try:
    data=json.load(open(p))
except Exception:
    print('health parse failed')
    raise SystemExit(0)
print('  users:', data.get('users'))
print('  games_with_data:', len(data.get('games', [])))
print('  app_version:', data.get('app_version'))
PY

echo "🎉 Safe deploy complete."
