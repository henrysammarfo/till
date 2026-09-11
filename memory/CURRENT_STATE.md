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



## Live tagged settle VERIFIED (2026-09-11)

- Tx: `0x7d0221dfe80738d5ea59067e0904e599cbbedd1d9573fd2cc372aaabb7ad9b7b`
- Celoscan: https://celoscan.io/tx/0x7d0221dfe80738d5ea59067e0904e599cbbedd1d9573fd2cc372aaabb7ad9b7b
- Tag `verifyTx` → **`celo_f30ff80110c6` present** (schemaId 0)
- Path: agent-wallet native CELO `0.05` with ERC-8021 data suffix (used remaining CELO; MiniPay/cNGN user-sign path still optional for product demo)
- Tavily on Vercel: yes (`tavilyKey: true`)
- x402 API key: still missing — get from dashboard (steps below)
- Secret rotation: after hack

### x402 key steps
1. Open https://www.x402.org/ or Celo x402 docs facilitator dashboard linked from https://docs.celo.org
2. Create / sign in → generate API key for facilitator settle
3. Paste as `X402_API_KEY` in Cursor cloud secrets (and we sync to Vercel)
4. Optional: `X402_PAY_TO` = your settle receive address

## Next
1. Paste `X402_API_KEY` when you have it
2. Publish celobuilders draft → published (repo already public)
3. Optional: MiniPay EIP-3009 path with cNGN for product-loop demo

## Next

1. Open the pay URL **inside MiniPay** and authorize 1 cNGN
2. Reply with the Celoscan tx hash
3. We run `bun run smoke:verify-tx -- --tx 0x…` to confirm the tag
4. Paste `X402_API_KEY` when ready (optional strengthener)
5. Publish celobuilders draft → published after tx verified

## Security
## Security

Residual risk only — **not unhackable**. Rotate Telegram bot token after go-live (was pasted in chat).
