# Session Log

## 2026-09-09 — Agent wallet funded + ERC-8004 on file

- Confirmed dedicated agent wallet `0x2879FBd50aBefb979270D2FFFD34d9ce1CecfF59` funded on Celo mainnet (~1.96 CELO; nonce 1 after Identity mint).
- Private key in `.env` derives to that address (match verified; key never pasted in chat).
- ERC-8004 agentId `9825` already minted; `public/agent/registration.json` updated with registry + Celoscan/8004scan URLs.
- Still blocked on Google claim (`CELO-…`) for celobuilders.xyz → attribution tag → `register:agent`.
- Residual risk only — do not claim unhackable.

## 2026-09-04 — Full-stack Option A kickoff

- Locked plan Option A: marketing + multi-tenant Studio + live Telegram till + cNGN EIP-3009 + attribution + ERC-8004 + fee abstraction + x402.
- Confirmed: never claim unhackable; residual risk only.
- Live research: contest deadline Sep 14 2026 09:00 GMT confirmed; attribution = ERC-8021; ERC-8004 = agent identity; x402 official facilitator docs list USDC/USDT (USA₮ gated by `/supported`).
- TinyFish prior key authenticated but 0 credits — awaiting new key.
- AgentRouter: OpenAI-compatible at `https://agentrouter.org/v1`; WAF may require client fingerprint headers.
- Started branch `cursor/till-full-stack-8d41`.
- Phase 0: secrets hygiene, memory pack, Cursor rules/skills, corrected TILL_BIBLE.md.

## 2026-09-05 — Live MiniPay authorize + production ops

- Shipped `/pay` MiniPay EIP-3009 authorize → `settleTillJob` (wait receipt + attribution `verifyTx`, fail closed).
- Telegram webhook fail-closed on missing secret; deep-links `/pay?job=` via required `PUBLIC_APP_URL`.
- `/api/ready` probes live Celo RPC + Supabase (presence + connectivity).
- Operator scripts: `bootstrap:tenant`, `register:telegram`, `smoke:verify-tx`.
- Studio overview no longer swallows ledger errors into fake zeros.
- `bun run test` + `smoke:attribution` + `bun run build` green.
- Still blocked on user keys for first live tagged mainnet settle.
- Residual risk only — do not claim unhackable.

## 2026-09-05 — Live MiniPay authorize + production ops

- Shipped `/pay` MiniPay EIP-3009 authorize → settleTillJob (wait receipt + attribution verifyTx, fail closed).
- Telegram webhook fail-closed on missing secret; deep-links `/pay?job=` via required PUBLIC_APP_URL.
- `/api/ready` probes live Celo RPC + Supabase.
- Operator scripts: bootstrap:tenant, register:telegram, smoke:verify-tx.
- Studio overview no longer swallows ledger errors into fake zeros.
- bun run test + smoke:attribution + bun run build green.
- Still blocked on user keys for first live tagged mainnet settle.
- Residual risk only — do not claim unhackable.
