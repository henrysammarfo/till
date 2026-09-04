# DEEP_PASS — Architecture & win notes

## Differentiate

RemitRoute / Ajo / Monipay = remittance / susu / payment clones. TILL = **counter job till** in Telegram on MiniPay rails.

## Scoring signals to optimize

1. Verified independent users (pre-Aug-28 preferred)
2. Returning users (2+ distinct days)
3. Distinct EIP-3009 / relay authorisers
4. Stablecoin path: cNGN direct; USA₮+x402 only if facilitator `/supported` confirms

## Technical stack (this repo)

- TanStack Start + Vite + Supabase (multi-tenant RLS)
- Telegram webhook → till intent → EIP-3009 / MiniPay → tagged settlement
- AgentRouter for NL (no OpenAI); Tavily + TinyFish for live research
- Fee abstraction (CIP-64 feeCurrency) for agent-submitted gas
- x402 resource server for agent quote/resolve micropayments

## Risks called out in Bible that remain true

- Farming Value-Moved destroys independence metrics
- Bundlers can strip attribution suffixes — always verifyTx
- Stale celobuilders skill must not be used for registration
