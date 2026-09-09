# TILL — Current State

**Updated:** 2026-09-09  
**Branch:** `main` (+ `cursor/vercel-prod-url-8d41`)  
**Production:** https://till-topaz.vercel.app

## Live

- Vercel project `till` (`prj_ANRWCjtvOqZGJkwrSo540kzs05au`) — production READY
- Deployment protection disabled (public MiniPay / Telegram webhooks)
- Favicon / apple-touch / OG / twitter / webmanifest live
- `/api/health` → ok
- Contest draft: tag `celo_f30ff80110c6`, wallet `0x2879…fF59`, ERC-8004 **9825**
- Supabase `goxtltzqwtluiqhpwupw` tenant `till` + agent_config live

## Blocked

1. **Vercel env sync** — paste a `VERCEL_TOKEN` (or set vars in Vercel UI), then `bash scripts/sync-vercel-env.sh` and redeploy
2. Telegram bot token + webhook secret → `register:telegram`
3. Verified `CNGN_TOKEN_ADDRESS`
4. First tagged MiniPay settle

## Security

Residual risk only — **not unhackable**.
