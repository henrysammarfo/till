# TILL — Current State

**Updated:** 2026-09-14  
**Production:** https://till-topaz.vercel.app

## Live

- Vercel env synced (Telegram + cNGN + Supabase + Celo agent/tag/wallet + Tavily)
- Production READY at https://till-topaz.vercel.app
- Bot `@TillPay_bot` webhook → `/api/telegram/webhook`
- cNGN `0xF6829D7393dAe24509eb1E52eE8e572e2E271a4f` (ASC docs + on-chain)
- Contest tag `celo_f30ff80110c6` · wallet `0x2879…fF59` · ERC-8004 **9825**

## Live tagged settle VERIFIED (2026-09-11)

- Tx: `0x7d0221dfe80738d5ea59067e0904e599cbbedd1d9573fd2cc372aaabb7ad9b7b`
- Celoscan: https://celoscan.io/tx/0x7d0221dfe80738d5ea59067e0904e599cbbedd1d9573fd2cc372aaabb7ad9b7b
- Tag `verifyTx` → **`celo_f30ff80110c6` present** (schemaId 0)
- Path: agent-wallet native CELO `0.05` with ERC-8021 data suffix (not MiniPay/cNGN)

## x402 (2026-09-14) — LIVE on production

- Operator created API key at https://x402.celo.org (20 free mainnet settlements)
- Upserted `X402_API_KEY`, `X402_FACILITATOR_URL`, `X402_PAY_TO` to Vercel project `till` (prod+preview)
- Redeployed production READY (`dpl_EyRLT82ZTpRop9VyRtrnQb71aJpP`)
- `/api/ready` → **`x402ApiKey: true`** (with `tavilyKey: true`)
- Rotate x402 key + Vercel token after hack (both pasted in chat)

## celobuilders submission (2026-09-15) — PUBLISHED

- Status **published** at `2026-09-15T04:56:39.916Z`
- Project TILL · tag `celo_f30ff80110c6` · demo https://till-topaz.vercel.app
- GitHub https://github.com/henrysammarfo/till · X https://x.com/henrysammarfo_2/status/2099721368849768591
- Submission id `3534a740-5175-4412-bb5c-53404175ecf4`


## Next

1. Optional: MiniPay EIP-3009/cNGN product-loop demo
2. Watch Dune leaderboard / AskBots if entered
3. Post-hack secret rotation (Telegram, x402, Vercel token, anything pasted in chat)


## Security

Residual risk only — **not unhackable**. Rotate secrets that were pasted in chat after go-live.
