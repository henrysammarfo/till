# TILL — Current State

**Updated:** 2026-09-04  
**Branch:** `cursor/till-full-stack-8d41`  
**Plan:** Option A full stack (marketing + multi-tenant Studio + live Telegram till + Celo mainnet)

## Product

TILL is a Telegram payment till for MiniPay/Celo: counterparty jobs settle in cNGN (direct EIP-3009) and stablecoin x402 paths, every user-facing tx ERC-8021 attribution-tagged, agent identity on ERC-8004.

## Repo reality (this session)

| Layer | Status |
|---|---|
| Marketing site | Present (TanStack Start + TILL brand) |
| Studio dashboard | Present; **mocks being removed** → live till tables |
| Multitenancy | **In progress** — tenants + RLS |
| Sessions | Migrating off localStorage → HttpOnly cookies |
| Telegram / Celo runtime | **Building** under `src/server/**` |
| Memory / rules / skills | **Creating** |

## Contest

- Hackathon: Agents at Work · deadline **2026-09-14 09:00 GMT** · mainnet only
- Primary track: `real-world-adoption` / Best Stablecoin Adoption
- Attribution: ERC-8021 via `@celo/attribution-tags`
- Agent identity: ERC-8004 (separate from attribution)

## Security posture

Hardening + threat model + residual risk documented in `memory/THREAT_MODEL.md`.  
**We do not claim unhackable.**

## Blockers (awaiting env upload)

- `TELEGRAM_BOT_TOKEN`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CELO_AGENT_PRIVATE_KEY` / agent wallet + `CELO_ATTRIBUTION_TAG`
- `X402_API_KEY`
- New `TINYFISH_API_KEY` (prior key had 0 credits)
- Token addresses for cNGN / USA₮ verified into FACT_CHECK before live transfers
