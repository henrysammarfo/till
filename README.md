# TILL

Telegram payment till for MiniPay / Celo: counterparty stablecoin settlements with ERC-8021 attribution and ERC-8004 agent identity.

**Stack:** TanStack Start · Supabase · Celo mainnet · Vercel

## Develop

```bash
bun install
bun run dev
```

## Build / deploy

```bash
bun run build
```

Nitro uses the `vercel` preset. Configure secrets in the Vercel project environment — never commit `.env`.

## Operator

See `memory/OPERATOR_RUNBOOK.md`. Residual risk only — see `memory/THREAT_MODEL.md`. Do not claim unhackable.
