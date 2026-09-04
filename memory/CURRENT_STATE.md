# TILL — Current State

**Updated:** 2026-09-04  
**Branch:** `cursor/till-full-stack-8d41`  
**Plan:** Option A full stack

## Shipped in this branch

- Secrets hygiene (`.env` untracked, `.env.example`)
- Memory pack + Cursor rules/skills + corrected `TILL_BIBLE.md`
- Multi-tenant Supabase migration (`tenants`, till jobs/txs, attribution_events, agent_config)
- HttpOnly cookie session mirror + production memory auth storage (no localStorage outside Lovable preview)
- Live Telegram webhook route `/api/telegram/webhook`
- Celo modules: attribution (ERC-8021), EIP-3009 settle, fee abstraction adapters, MiniPay links
- x402 facilitator client + `/api/x402/supported` (USA₮ **not** in live `/supported`)
- Studio dashboards bound to live till tables (mocks removed)
- ERC-8004 registration file at `public/agent/registration.json`
- Unit tests + smoke scripts; `bun run build` clean

## Blockers (need user env)

- `TELEGRAM_BOT_TOKEN` + webhook secret
- `SUPABASE_SERVICE_ROLE_KEY` + apply migration
- `CELO_AGENT_PRIVATE_KEY`, `CELO_ATTRIBUTION_TAG`, `CELO_AGENT_WALLET` (after contest register)
- `CNGN_TOKEN_ADDRESS` / `USAT_TOKEN_ADDRESS` once verified
- `X402_API_KEY` for settle
- New TinyFish key/credits
- AgentRouter reachable network (this host WAF-blocked)

## Security

Residual risk only — **not unhackable**. See `memory/THREAT_MODEL.md`.
