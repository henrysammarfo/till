# LOCKED — Contest constraints (TILL)

Do not violate without product-owner sign-off.

1. **Mainnet only** for scoring transactions.
2. **Register day-0**; leaderboard ignores untagged txs.
3. **ERC-8021** attribution via `@celo/attribution-tags` on every user-facing tx; `verifyTx` after first.
4. **ERC-8004** agent identity + public URL at registration.
5. **Independence:** not builder wallets; not first-funded by us; prefer pre-Aug-28 Celo activity.
6. **Primary track:** real-world-adoption / Best Stablecoin Adoption — not Value-Moved float farming.
7. **No mocks / no fallbacks** in payment or LLM paths for production scoring flows.
8. **Never claim unhackable.**
9. x402 facilitator host: `https://api.x402.celo.org` (not the dashboard SPA).
10. Secrets in env only; declare own wallets/contracts honestly.
