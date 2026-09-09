---
name: till-payment-pipeline
description: Builds and debugs the live TILL payment pipeline — Telegram intent, EIP-3009, MiniPay, fee abstraction, ERC-8021 attribution, x402 settle. Use when implementing or fixing Celo settlements.
---

# TILL Payment Pipeline

## Flow

1. Telegram webhook verifies secret → parse intent (`src/server/till/intent.ts`).
2. Counterparty independence check (`counterparty.ts`).
3. User signs EIP-3009 / MiniPay authorization.
4. Agent submits transfer + `toDataSuffix(tag)`; optional `feeCurrency`.
5. `verifyTx` → persist `till_transactions`.
6. x402 path: 402 → verify/settle via `api.x402.celo.org` with `X402_API_KEY`.

## Hard rules

- No mocks, no demo settlement mode in production scoring paths.
- Fail closed if token address / attribution tag / keys missing.
- USA₮ on x402 only if `/supported` lists it.

## Modules

See `src/server/telegram/`, `src/server/till/`, `src/server/celo/`, `src/server/x402/`.
