# TILL — Current State

**Updated:** 2026-09-11  
**Production:** https://till-topaz.vercel.app

## Live

- Vercel env synced (Telegram + cNGN + Supabase + Celo agent/tag/wallet)
- Redeployed production READY
- Bot `@TillPay_bot` webhook → `/api/telegram/webhook`
- cNGN `0xF6829D7393dAe24509eb1E52eE8e572e2E271a4f` (ASC docs + on-chain)
- Contest tag `celo_f30ff80110c6` · wallet `0x2879…fF59` · ERC-8004 **9825**

## UI hardening (2026-09-11)

- Every nav/footer/marketing route live; added `/privacy`, `/terms`, `/how-it-works` → `/product`, `sitemap.xml`
- Portal/book content centered in `.wrap`; contact form writes to `bookings`; agent identity matches env (`celo_f30ff80110c6`, wallet `0x2879…fF59`, ERC-8004 `9825`)
- Favicons regenerated from till-mark (no solid-black tab icon); IBM Plex Sans wired; menu chevron corrected


## Live settle in progress (2026-09-11)

- Repo **public**: https://github.com/henrysammarfo/till
- Tavily synced to Vercel production — `/api/ready` → `tavilyKey: true`
- x402 API key still missing (prompted) — `x402ApiKey: false`
- First tagged MiniPay job created (awaiting your signature):
  - job `44708a3c-8ce6-4377-be63-3cd7e1bbc54f`
  - amount **1 cNGN** → `0x13b239a267b061c60c9dcaF0071C305b47E4AcBa` (independent EOA, nonce 159)
  - pay URL: https://till-topaz.vercel.app/pay?job=44708a3c-8ce6-4377-be63-3cd7e1bbc54f
  - expected tag `celo_f30ff80110c6`
- Secret rotation deferred until after hack

## Next

1. Open the pay URL **inside MiniPay** and authorize 1 cNGN
2. Reply with the Celoscan tx hash
3. We run `bun run smoke:verify-tx -- --tx 0x…` to confirm the tag
4. Paste `X402_API_KEY` when ready (optional strengthener)
5. Publish celobuilders draft → published after tx verified

## Security
## Security

Residual risk only — **not unhackable**. Rotate Telegram bot token after go-live (was pasted in chat).
