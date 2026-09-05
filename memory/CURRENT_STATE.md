# TILL — Current State

**Updated:** 2026-09-05  
**Branch:** `cursor/till-full-stack-8d41`  
**Plan:** Option A full stack

## Shipped

- Secrets hygiene (`.env` untracked, `.env.example`)
- Memory pack + Cursor rules/skills + `TILL_BIBLE.md`
- Multi-tenant Supabase migration (`tenants`, till jobs/txs, attribution_events, agent_config)
- HttpOnly cookie session + production memory auth (no localStorage outside Lovable preview)
- Live Telegram webhook `/api/telegram/webhook` → creates till jobs → MiniPay `/pay?job=`
- `/pay` MiniPay EIP-3009 authorize → `settleTillJob` (wait receipt + `verifyTx`)
- Celo modules: attribution (ERC-8021), EIP-3009 settle, fee abstraction (USDC/USDT only), MiniPay
- x402 facilitator client + `/api/x402/supported` (USA₮ gated — not in live `/supported`)
- Studio dashboards bound to live till tables (mocks removed)
- ERC-8004 registration file at `public/agent/registration.json`
- Operator scripts: `bootstrap:tenant`, `register:telegram`, `register:agent`, `smoke:verify-tx`
- `/api/health` + `/api/ready` (env presence + live Celo RPC + Supabase probes)
- Unit tests + smokes; `bun run build` clean

## Blockers (need your keys)

- `TELEGRAM_BOT_TOKEN` + `TELEGRAM_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY` + apply multitenant migration
- `CELO_AGENT_PRIVATE_KEY`, `CELO_ATTRIBUTION_TAG`, `CELO_AGENT_WALLET` (after contest register)
- Verified `CNGN_TOKEN_ADDRESS` (+ `USAT_TOKEN_ADDRESS` if claiming USA₮)
- `X402_API_KEY`, `PUBLIC_APP_URL`
- TinyFish credits / AgentRouter reachable network (structured intents work without NL)

## Security

Residual risk only — **not unhackable**. See `memory/THREAT_MODEL.md`.
