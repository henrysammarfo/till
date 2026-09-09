# TILL — Current State

**Updated:** 2026-09-09  
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
- ERC-8004 Identity Registry mint on Celo mainnet — **agentId `9825`**
- ERC-8004 registration file at `public/agent/registration.json`
- Dedicated agent wallet funded on mainnet: `0x2879FBd50aBefb979270D2FFFD34d9ce1CecfF59`
- **Celo Builders claim + draft submission** for `agents-at-work`
  - Attribution tag: `celo_f30ff80110c6` (saved in `.env` as `CELO_ATTRIBUTION_TAG`)
  - Track: `real-world-adoption`
  - Status: **draft** (not published yet)
- Operator scripts: `bootstrap:tenant`, `register:telegram`, `register:agent`, `smoke:verify-tx`
- `/api/health` + `/api/ready`
- Unit tests + smokes; `bun run build` clean

## Blockers (need your keys / actions)

1. `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` + apply multitenant migration → then `bun run register:agent`
2. Make GitHub repo **public** before publish
3. `TELEGRAM_BOT_TOKEN` + `TELEGRAM_WEBHOOK_SECRET`
4. Verified `CNGN_TOKEN_ADDRESS` (+ `USAT_TOKEN_ADDRESS` if claiming USA₮)
5. `X402_API_KEY`, `PUBLIC_APP_URL`
6. First tagged mainnet MiniPay settle + `smoke:verify-tx`
7. TinyFish credits / AgentRouter reachable network (structured intents work without NL)

## Security

Residual risk only — **not unhackable**. See `memory/THREAT_MODEL.md`.
