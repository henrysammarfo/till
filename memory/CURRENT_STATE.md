# TILL — Current State

**Updated:** 2026-09-11  
**Production:** https://till-topaz.vercel.app

## Live

- Vercel env synced (Telegram + cNGN + Supabase + Celo agent/tag/wallet)
- Redeployed production READY
- Bot `@TillPay_bot` webhook → `/api/telegram/webhook`
- cNGN `0xF6829D7393dAe24509eb1E52eE8e572e2E271a4f` (ASC docs + on-chain)
- Contest tag `celo_f30ff80110c6` · wallet `0x2879…fF59` · ERC-8004 **9825**

## Next

1. Message `@TillPay_bot`: `send 5 cNGN to 0xIndependentCounterparty`
2. Open `/pay?job=…` inside MiniPay → sign
3. Confirm attribution tag on Celoscan / `smoke:verify-tx`

## Security

Residual risk only — **not unhackable**. Rotate Telegram bot token after go-live (was pasted in chat).
