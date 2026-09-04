# Threat Model & Residual Risk

**Doctrine:** Harden production systems. Document residual risk honestly. **Never claim unhackable.**

## Assets

- User EIP-3009 authorizations and wallet signatures
- Agent private key / fee-payer balances
- Supabase service role + tenant data
- Telegram bot token / webhook secret
- Attribution tag integrity (leaderboard honesty)
- LLM/research API keys (AgentRouter, Tavily, TinyFish, X402)

## Trust boundaries

1. Browser / Studio ↔ cookie session ↔ Supabase RLS
2. Telegram ↔ webhook HMAC/secret ↔ till intent pipeline
3. User wallet ↔ EIP-3009 / MiniPay ↔ Celo mainnet
4. Agent server ↔ Forno RPC / x402 facilitator
5. Agent server ↔ AgentRouter / Tavily / TinyFish (egress)

## Mitigations (shipped / shipping)

- Secrets only in env (gitignored); never in client bundles
- Multi-tenant RLS; service role limited to webhook + indexer paths
- HttpOnly Secure SameSite cookies for Studio sessions (no localStorage session tokens in production)
- Zod validation on all external inputs
- Rate limits on Telegram webhook
- Attribution `verifyTx` after tagged settlements
- Independence policy for counterparties (no builder-funded “users”)
- No silent provider fallbacks for LLM/payments

## Residual risks (accepted)

- Compromised agent key can drain fee-payer / mis-submit authorizations
- RPC / facilitator downtime blocks settlement
- Smart-account/bundler flows can strip ERC-8021 suffixes (verify on-chain)
- Social engineering via Telegram intents
- Supply-chain risk in npm deps and LLM gateway
- Zero-days in browser, OS, or chain clients

## Explicit non-claims

We do **not** claim: unhackable, NK-proof, bulletproof, or guaranteed contest win.
