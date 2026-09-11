# TILL — Current State

**Updated:** 2026-09-11  
**Production:** https://till-topaz.vercel.app

## Done locally

- Telegram bot `@TillPay_bot` saved; webhook secret generated (64 hex)
- Webhook registered → `https://till-topaz.vercel.app/api/telegram/webhook`
- Official cNGN Celo mainnet: `0xF6829D7393dAe24509eb1E52eE8e572e2E271a4f` (docs.cngn.co + on-chain)

## Blocked

- **Fresh Vercel token needed** — previous 1-day token lost team scope (403). Paste a new token so Telegram/cNGN env can be pushed + redeployed.
- Until then production `/api/ready` still missing telegram + cngn env on Vercel (local `.env` has them).

## Security

Residual risk only — **not unhackable**. Rotate Telegram token if it remains exposed in chat after go-live.
