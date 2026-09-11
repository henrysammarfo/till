#!/usr/bin/env bash
# Sync selected .env keys into the Vercel project (production + preview).
# Requires: VERCEL_TOKEN, linked project (or --scope/--project flags).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "Set VERCEL_TOKEN (https://vercel.com/account/tokens) then re-run." >&2
  exit 1
fi

SCOPE="${VERCEL_SCOPE:-teamtitanlink}"
PROJECT="${VERCEL_PROJECT:-till}"

KEYS=(
  SUPABASE_PROJECT_ID
  SUPABASE_URL
  SUPABASE_PUBLISHABLE_KEY
  SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  VITE_SUPABASE_PROJECT_ID
  VITE_SUPABASE_URL
  VITE_SUPABASE_PUBLISHABLE_KEY
  PUBLIC_APP_URL
  VITE_PUBLIC_APP_URL
  CELO_RPC_URL
  CELO_AGENT_PRIVATE_KEY
  CELO_ATTRIBUTION_TAG
  CELO_AGENT_WALLET
  CELO_ERC8004_URL
  CELO_ERC8004_AGENT_ID
  USDC_TOKEN_ADDRESS
  USDT_TOKEN_ADDRESS
  CNGN_TOKEN_ADDRESS
  USAT_TOKEN_ADDRESS
  X402_API_KEY
  X402_FACILITATOR_URL
  X402_PAY_TO
  TELEGRAM_BOT_TOKEN
  TELEGRAM_WEBHOOK_SECRET
  AGENTROUTER_API_KEY
  AGENTROUTER_BASE_URL
  AGENTROUTER_MODEL
  TILL_DEFAULT_TENANT_SLUG
  TAVILY_API_KEY
)

get_val() {
  local key="$1"
  python3 - "$key" <<'PY'
import sys
from pathlib import Path
key=sys.argv[1]
for ln in Path('.env').read_text().splitlines():
  if ln.startswith(key+'='):
    print(ln.split('=',1)[1].strip().strip('"'), end='')
    break
PY
}

for key in "${KEYS[@]}"; do
  val="$(get_val "$key")"
  if [[ -z "$val" ]]; then
    echo "skip empty $key"
    continue
  fi
  echo "upsert $key"
  # Remove existing then add for production + preview
  bunx vercel env rm "$key" production --yes --scope "$SCOPE" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
  bunx vercel env rm "$key" preview --yes --scope "$SCOPE" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
  printf '%s' "$val" | bunx vercel env add "$key" production --scope "$SCOPE" --token "$VERCEL_TOKEN" --sensitive >/dev/null
  printf '%s' "$val" | bunx vercel env add "$key" preview --scope "$SCOPE" --token "$VERCEL_TOKEN" --sensitive >/dev/null
done

echo "Done. Redeploy production: bunx vercel --prod --scope $SCOPE --token \$VERCEL_TOKEN --yes"
