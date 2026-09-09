# TILL — Current State

**Updated:** 2026-09-09  
**Branch:** `cursor/till-full-stack-8d41`  
**Plan:** Option A full stack

## Live contest identity

- Agent wallet: `0x2879FBd50aBefb979270D2FFFD34d9ce1CecfF59`
- ERC-8004 agentId: `9825`
- Attribution tag: `celo_f30ff80110c6` (draft on celobuilders)
- Primary track: `real-world-adoption`

## Supabase (goxtltzqwtluiqhpwupw)

- Multitenant migration applied — tables live
- Tenant `till` id `9ac9bbbc-6222-41d1-a2a7-da859e2c0585`
- `agent_config` has tag + wallet + ERC-8004 URL/id (`bootstrap:tenant` + `register:agent` OK)

## Next blockers

1. Deploy + `PUBLIC_APP_URL` (HTTPS)
2. `TELEGRAM_BOT_TOKEN` + `TELEGRAM_WEBHOOK_SECRET` → `bun run register:telegram`
3. Verified `CNGN_TOKEN_ADDRESS`
4. First tagged MiniPay settle + `smoke:verify-tx`
5. Make GitHub public before publish submission

## Security

Residual risk only — **not unhackable**. See `memory/THREAT_MODEL.md`.
