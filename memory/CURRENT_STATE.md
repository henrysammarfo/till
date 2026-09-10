# TILL — Current State

**Updated:** 2026-09-10  
**Production:** https://till-topaz.vercel.app

## Live

- Vercel env synced (Supabase, Celo agent key/tag/wallet, PUBLIC_APP_URL, USDC/USDT, AgentRouter)
- `/api/health` ok · Celo RPC + Supabase probes green
- Contest: `celo_f30ff80110c6` · wallet `0x2879…fF59` · ERC-8004 **9825**

## Missing for `/api/ready`

1. `TELEGRAM_BOT_TOKEN` + `TELEGRAM_WEBHOOK_SECRET`
2. Verified `CNGN_TOKEN_ADDRESS`

Then: `bun run register:telegram` → first tagged MiniPay settle.

## Security

Residual risk only — **not unhackable**.
